"""Behavioral checks for the distributed art helpers; no paid generation."""
import copy
import importlib.util
import hashlib
import wave
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / 'skills/ti-game-assets/scripts'
spec = importlib.util.spec_from_file_location('manifest_validator', SCRIPTS / 'validate_manifest.py')
validator = importlib.util.module_from_spec(spec)
spec.loader.exec_module(validator)


class AssetsTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.image = Image.new('RGBA', (64, 64), (12, 23, 34, 0))
        # Two separate legitimate parts, internal translucency, and faint exterior residue.
        self.image.paste((100, 60, 20, 255), (16, 16, 30, 32))
        self.image.paste((10, 200, 90, 100), (36, 20, 45, 30))
        self.image.putpixel((25, 25), (99, 66, 22, 3))
        self.image.putpixel((0, 0), (200, 100, 50, 2))
        self.source = self.root / 'master.png'
        self.image.save(self.source)

    def alpha(self, *args, success=True):
        result = subprocess.run([sys.executable, str(SCRIPTS / 'alpha_tools.py'), str(self.source), *map(str, args)],
                                text=True, capture_output=True, env=dict(os.environ, PYTHONDONTWRITEBYTECODE='1'))
        self.assertEqual(result.returncode == 0, success, result.stderr)
        return json.loads(result.stdout) if success else result.stderr

    def clean(self, *args, **kwargs):
        return self.alpha('--clean', self.root / 'clean.png', '--protect', 15, 15, 46, 33,
                          '--reason', 'reviewed exterior fleck', *args, **kwargs)

    def test_default_analysis_is_nonmutating_and_reports_thresholds(self):
        original = self.source.read_bytes()
        report = self.alpha('--preview', self.root / 'preview.png')
        self.assertEqual(self.source.read_bytes(), original)
        self.assertEqual(report['analysis']['bounding_boxes']['1'], [0, 0, 45, 32])
        self.assertEqual(report['analysis']['bounding_boxes']['8'], [16, 16, 45, 32])
        self.assertEqual(set(report['analysis']['bounding_boxes']), {'1', '4', '8', '16', '32'})
        self.assertTrue((self.root / 'preview.png').exists())
        self.assertFalse((self.root / 'clean.png').exists())

    def test_clean_preserves_rgba_inside_and_rgb_everywhere(self):
        report = self.clean('--preview', self.root / 'comparison.png')
        with Image.open(self.root / 'clean.png') as cleaned:
            self.assertEqual(cleaned.crop((15, 15, 46, 33)).tobytes(), self.image.crop((15, 15, 46, 33)).tobytes())
            self.assertEqual(cleaned.convert('RGB').tobytes(), self.image.convert('RGB').tobytes())
            self.assertEqual(cleaned.getpixel((0, 0))[3], 0)
            self.assertEqual(cleaned.getpixel((40, 25))[3], 100)
            self.assertEqual(cleaned.getpixel((25, 25))[3], 3)
        self.assertEqual(report['cleanup']['removed_pixels'], 1)
        self.assertEqual(self.source.read_bytes(), self.image_bytes())

    def image_bytes(self):
        from io import BytesIO
        output = BytesIO()
        self.image.save(output, format='PNG')
        return output.getvalue()

    def test_auto_protection_uses_logical_pixel_padding(self):
        report = self.alpha('--clean', self.root / 'clean.png', '--profile', 'pixel-art', '--logical-size', 16, 16,
                            '--auto-protect', '--reason', 'reviewed trial')
        self.assertEqual(report['cleanup']['protected_region'], [12, 12, 49, 36])
        self.assertEqual(report['cleanup']['logical_pixel_padding'], [4, 4])

    def test_soft_fx_preserves_alpha_and_requires_explicit_region(self):
        self.alpha('--profile', 'soft-fx')
        self.alpha('--profile', 'soft-fx', '--auto-protect', '--clean', self.root / 'bad.png', '--reason', 'trial', success=False)
        self.clean('--profile', 'soft-fx')
        with Image.open(self.root / 'clean.png') as cleaned:
            self.assertEqual(cleaned.getpixel((25, 25)), self.image.getpixel((25, 25)))

    def test_empty_and_faint_images_are_not_mistaken_for_threshold_content(self):
        for alpha in (0, 3):
            Image.new('RGBA', (64, 64), (100, 90, 80, alpha)).save(self.source)
            self.alpha('--auto-protect', '--clean', self.root / 'bad.png', '--reason', 'trial', success=False)
        Image.new('RGBA', (64, 64)).save(self.source)
        self.assertIsNone(self.alpha()['analysis']['bounding_boxes']['1'])
        self.clean('--crop', success=False)
        self.assertFalse((self.root / 'clean.png').exists())

    def test_crop_metadata_and_common_canvas(self):
        report = self.clean('--crop')
        self.assertEqual(report['export']['offset'], [16, 16])
        self.assertEqual(report['export']['dimensions'], [29, 16])
        (self.root / 'clean.png').unlink()
        report = self.clean('--crop-box', 12, 12, 50, 40)
        self.assertEqual(report['export']['offset'], [12, 12])
        self.assertEqual(report['export']['dimensions'], [38, 28])

    def test_invalid_args_and_no_overwrite(self):
        self.clean('--crop-box', 20, 20, 30, 30, success=False)
        self.alpha('--threshold', 0, success=False)
        self.alpha('--logical-size', 0, 16, success=False)
        self.alpha('--crop', success=False)
        self.alpha('--clean', self.source, success=False)
        self.alpha('--preview', self.source, success=False)
        self.alpha('--clean', self.root / 'bad.png', '--protect', -1, 0, 2, 2, '--reason', 'trial', success=False)
        self.alpha('--clean', self.root / 'bad.png', '--protect', 1, 1, 2, 2, success=False)
        self.clean()
        self.clean(success=False)

    def manifest(self):
        data = json.loads((ROOT / 'skills/ti-game-assets/references/manifest.example.json').read_text())
        for asset in data['sets'][0]['assets']:
            path = self.root / asset['source']
            path.parent.mkdir(parents=True, exist_ok=True)
            image = Image.new('RGBA', (1024, 1024), (0, 0, 0, 0 if asset['transparency'] else 255))
            image.paste((100, 60, 20, 255), (300, 300, 600, 600))
            image.save(path)
        audio = self.root / 'audio/recipes.js'
        audio.parent.mkdir()
        audio.write_text('// Test fixture for manifest presence, not synthesis validation\n')
        return data

    def test_complete_contract_with_parallax_and_sound_counts(self):
        errors, counts = validator.validate(self.manifest(), self.root)
        self.assertEqual(errors, [])
        self.assertEqual(counts[0]['png_frames'], 8)
        self.assertEqual(counts[0]['sound_variants'], 3)
        self.assertEqual(counts[0]['unique_resources'], 5)

    def test_incomplete_contracts_sources_dimensions_aliases_and_alignment(self):
        original = self.manifest()
        edits = [lambda d: d['sets'][0]['assets'].pop(),
                 lambda d: d['sets'][0]['sounds'].pop(),
                 lambda d: d['sets'][0]['aliases'].update({'bad': 'missing'}),
                 lambda d: d['sets'][0]['assets'][0].update(source='missing.png'),
                 lambda d: d['sets'][0]['assets'][0].update(dimensions=[10, 10]),
                 lambda d: d['sets'][0]['assets'][1].update(pivot=[500, 512]),
                 lambda d: d['sets'][0]['assets'][0].update(style='pixel-art'),
                 lambda d: d['sets'][0]['events'][0].update(timing='frame'),
                 lambda d: d['sets'][0]['sounds'][0].update(source='missing.js'),
                 lambda d: d['sets'][0]['parallax'][2].update(asset='sky-middle-base-idle-0'),
                 lambda d: d['sets'][0]['parallax'][2].update(order=0),
                 lambda d: d['sets'][0]['parallax'][0].update(transparent=True)]
        for edit in edits:
            with self.subTest(edit=edit):
                data = copy.deepcopy(original)
                edit(data)
                self.assertTrue(validator.validate(data, self.root)[0])

    def test_transparency_must_be_boolean_and_match_png(self):
        original = self.manifest()
        for value in (None, 'true', 1, False):
            data = copy.deepcopy(original)
            data['sets'][0]['assets'][0]['transparency'] = value
            self.assertTrue(validator.validate(data, self.root)[0], str(value))
        data = copy.deepcopy(original)
        del data['sets'][0]['assets'][0]['transparency']
        self.assertTrue(validator.validate(data, self.root)[0])

    def test_empty_contract_is_rejected_but_sound_only_is_valid(self):
        data = self.manifest()
        group = data['sets'][0]
        group.update(assets=[], aliases={}, parallax=[], events=[])
        data['contracts']['demo-world'].update(resources=[], parallax=False)
        self.assertEqual(validator.validate(data, self.root)[0], [])
        group['sounds'] = []
        data['contracts']['demo-world']['sounds'] = []
        self.assertTrue(validator.validate(data, self.root)[0])

    def test_sequences_order_duplicates_and_empty_png(self):
        original = self.manifest()
        data = copy.deepcopy(original)
        data['sets'][0]['assets'][2:5] = reversed(data['sets'][0]['assets'][2:5])
        self.assertTrue(validator.validate(data, self.root)[0])
        data = copy.deepcopy(original)
        data['sets'][0]['assets'].append(copy.deepcopy(data['sets'][0]['assets'][0]))
        self.assertTrue(validator.validate(data, self.root)[0])
        Image.new('RGBA', (1024, 1024)).save(self.root / original['sets'][0]['assets'][0]['source'])
        self.assertTrue(validator.validate(original, self.root)[0])

    def test_different_contracts_do_not_require_equal_counts(self):
        data = self.manifest()
        other = copy.deepcopy(data['sets'][0])
        other.update(id='other', contract='small', assets=other['assets'][:2], sounds=[], aliases={}, parallax=[], events=[])
        data['contracts']['small'] = {'resources': data['contracts']['demo-world']['resources'][:2], 'sounds': []}
        data['sets'].append(other)
        errors, counts = validator.validate(data, self.root)
        self.assertEqual(errors, [])
        self.assertEqual([entry['png_frames'] for entry in counts], [8, 2])
        other['contract'] = 'demo-world'
        self.assertTrue(validator.validate(data, self.root)[0])

    def test_vector_sources_and_build_hashes(self):
        data = self.manifest()
        asset = data['sets'][0]['assets'][0]
        source = self.root / 'ship.svg'
        source.write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 26"><path d="M0 0L42 13L0 26Z"/></svg>')
        asset['vector_source'] = 'ship.svg'
        digest = hashlib.sha256(source.read_bytes()).hexdigest()
        data['build'] = {'files': {'ship.svg': digest}}
        self.assertEqual(validator.validate(data, self.root)[0], [])
        source.write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 26"><circle cx="10" cy="10" r="3"/></svg>')
        self.assertTrue(validator.validate(data, self.root)[0])
        source.write_text('<svg viewBox="0 0 0 26"/>')
        self.assertTrue(validator.validate(data, self.root)[0])
        del data['build']
        self.assertTrue(validator.validate(data, self.root)[0])
        source.unlink()
        self.assertTrue(validator.validate(data, self.root)[0])

    def test_wav_payload_and_format_contract(self):
        data = self.manifest()
        file = self.root / 'cue.wav'
        with wave.open(str(file), 'wb') as output:
            output.setnchannels(1)
            output.setsampwidth(2)
            output.setframerate(22050)
            output.writeframes(b'\x00\x01' * 100)
        sound = data['sets'][0]['sounds'][0]
        sound['wav'] = {'file': 'cue.wav', 'sample_rate': 22050, 'channels': 1, 'sample_width': 2, 'frames': 100, 'loop': True}
        self.assertEqual(validator.validate(data, self.root)[0], [])
        for field, value in [('frames', 99), ('sample_rate', 44100), ('channels', 2), ('sample_width', 1), ('loop', 'true')]:
            candidate = copy.deepcopy(data)
            candidate['sets'][0]['sounds'][0]['wav'][field] = value
            self.assertTrue(validator.validate(candidate, self.root)[0], field)
        file.write_bytes(file.read_bytes()[:-10])
        self.assertTrue(validator.validate(data, self.root)[0])
        file.unlink()
        self.assertTrue(validator.validate(data, self.root)[0])

    def test_manifest_cli_rejects_malformed_and_missing_sources(self):
        manifest = self.root / 'manifest.json'
        for value in ([], {'schema_version': 1, 'contracts': {'c': {}}, 'sets': [{'id': 'bad', 'contract': 'c', 'assets': [None]}]}):
            manifest.write_text(json.dumps(value))
            result = subprocess.run([sys.executable, str(SCRIPTS / 'validate_manifest.py'), str(manifest)], text=True, capture_output=True)
            self.assertEqual(result.returncode, 1)
            self.assertFalse(json.loads(result.stdout)['valid'])
        result = subprocess.run([sys.executable, str(SCRIPTS / 'validate_manifest.py'), str(ROOT / 'skills/ti-game-assets/references/manifest.example.json')], text=True, capture_output=True)
        self.assertEqual(result.returncode, 1)
        self.assertIn('source not found', result.stdout)


if __name__ == '__main__':
    unittest.main()
