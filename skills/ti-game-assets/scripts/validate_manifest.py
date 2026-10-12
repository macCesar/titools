#!/usr/bin/env python3
"""Validate per-set game art and sound contracts, files, frames and parallax."""
import argparse
from collections import Counter, defaultdict
import json
import hashlib
import re
import wave
import xml.etree.ElementTree as ET
import math
from pathlib import Path

from PIL import Image

FAMILIES = {'players', 'enemies', 'allies', 'obstacles', 'ammunition', 'rewards', 'ambient', 'backgrounds', 'technical'}


def numbers(value, length, positive=False):
    return (isinstance(value, list) and len(value) == length
            and all(type(n) in (int, float) and math.isfinite(n) and (not positive or n > 0) for n in value))


def dimensions(value):
    return numbers(value, 2, True) and all(type(n) is int for n in value)


def validate(data, root):
    errors = []
    counts = []

    def require(condition, message):
        if not condition:
            errors.append(message)

    def source_path(value, label):
        if not isinstance(value, str) or not value:
            errors.append(label + ': missing source')
            return None
        path = (root / value).resolve()
        if not path.is_file():
            errors.append(label + ': source not found: ' + value)
            return None
        return path

    build = data.get('build')
    if build is not None:
        files = build.get('files') if isinstance(build, dict) else None
        require(isinstance(files, dict) and bool(files), 'build.files must be a nonempty path-to-SHA256 object')
        for filename, digest in files.items() if isinstance(files, dict) else []:
            valid_hash = isinstance(digest, str) and re.fullmatch(r'[0-9a-f]{64}', digest) is not None
            require(valid_hash, 'build: invalid SHA256 for ' + filename)
            path = source_path(filename, 'build')
            if path and valid_hash:
                require(hashlib.sha256(path.read_bytes()).hexdigest() == digest, 'build: stale source/output hash: ' + filename)

    require(data.get('schema_version') == 1, 'schema_version must be 1')
    contracts = data.get('contracts', {})
    sets = data.get('sets', [])
    require(isinstance(contracts, dict) and bool(contracts), 'contracts must be a nonempty object')
    require(isinstance(sets, list) and bool(sets), 'sets must be a nonempty list')
    if not isinstance(contracts, dict) or not isinstance(sets, list):
        return errors, counts
    seen_sets = set()
    for group in sets:
        if not isinstance(group, dict):
            errors.append('set must be an object')
            continue
        name = group.get('id')
        require(isinstance(name, str) and bool(name) and name not in seen_sets, 'set ids must be unique nonempty strings')
        if not isinstance(name, str):
            continue
        seen_sets.add(name)
        label = name + ': '
        contract = contracts.get(group.get('contract'))
        if not isinstance(contract, dict):
            errors.append(label + 'unknown contract')
            continue
        expected = Counter()
        definitions = contract.get('resources', [])
        expected_sounds = Counter()
        require(isinstance(definitions, list), label + 'contract resources must be a list')
        for definition in definitions if isinstance(definitions, list) else []:
            resource, family, variant, state = (definition.get(k) for k in ('resource', 'family', 'variant', 'state'))
            frames = definition.get('frames')
            if not all(isinstance(v, str) and v for v in (resource, family, variant, state)) or type(frames) is not int or frames < 1:
                errors.append(label + 'invalid resource definition')
                continue
            require(family in FAMILIES, label + 'unknown resource family ' + family)
            for frame in range(frames):
                expected[(resource, family, variant, state, frame)] += 1
        require(all(n == 1 for n in expected.values()), label + 'duplicate contract resource definition')
        sound_defs = contract.get('sounds', [])
        require(isinstance(sound_defs, list), label + 'contract sounds must be a list')
        for definition in sound_defs if isinstance(sound_defs, list) else []:
            sound, variants = definition.get('sound'), definition.get('variants')
            if not isinstance(sound, str) or not sound or not isinstance(variants, list) or not variants or not all(isinstance(v, str) and v for v in variants):
                errors.append(label + 'invalid sound definition')
                continue
            expected_sounds.update((sound, variant) for variant in variants)
        require(all(n == 1 for n in expected_sounds.values()), label + 'duplicate sound contract variant')
        require(bool(expected or expected_sounds), label + 'contract must require visual or sound assets')
        assets, sounds = group.get('assets', []), group.get('sounds', [])
        require(isinstance(assets, list) and isinstance(sounds, list), label + 'assets and sounds must be lists')
        if not isinstance(assets, list) or not isinstance(sounds, list):
            continue
        actual = Counter()
        ids = set()
        asset_by_id = {}
        alignment = defaultdict(list)
        sequences = defaultdict(list)
        for asset in assets:
            identity = asset.get('id')
            require(isinstance(identity, str) and bool(identity) and identity not in ids, label + 'asset ids must be unique strings')
            if not isinstance(identity, str):
                continue
            ids.add(identity)
            asset_by_id[identity] = asset
            fields = [asset.get(k) for k in ('resource', 'family', 'variant', 'state')]
            frame = asset.get('frame')
            if not all(isinstance(v, str) and v for v in fields) or type(frame) is not int or frame < 0:
                errors.append(label + identity + ': invalid identity/frame')
                continue
            actual[tuple(fields) + (frame,)] += 1
            sequences[tuple(fields)].append(frame)
            size, canvas, pivot = (asset.get(k) for k in ('dimensions', 'canvas', 'pivot'))
            require(dimensions(size), label + identity + ': dimensions must be positive integers')
            require(dimensions(canvas), label + identity + ': canvas must be positive integers')
            require(numbers(pivot, 2), label + identity + ': pivot must be finite coordinates')
            require(size == canvas, label + identity + ': master must retain its common canvas')
            if dimensions(canvas) and numbers(pivot, 2):
                require(all(0 <= pivot[i] <= canvas[i] for i in (0, 1)), label + identity + ': pivot outside canvas')
            alignment[tuple(fields[:3])].append((canvas, pivot, asset.get('logical_size')))
            require(type(asset.get('transparency')) is bool, label + identity + ': transparency must be Boolean')
            style = asset.get('style')
            require(style in ('pixel-art', 'hard-surface', 'soft-fx', 'hd'), label + identity + ': unknown style')
            if style == 'pixel-art':
                require(dimensions(asset.get('logical_size')), label + identity + ': pixel-art requires logical_size')
            require(isinstance(asset.get('provenance'), dict) and bool(asset['provenance'].get('prompt')),
                    label + identity + ': provenance.prompt required')
            if 'vector_source' in asset:
                vector = source_path(asset['vector_source'], label + identity + ' vector')
                if vector:
                    try:
                        svg = ET.parse(vector).getroot()
                        require(svg.tag in ('svg', '{http://www.w3.org/2000/svg}svg'), label + identity + ': vector source must have SVG root')
                        viewbox = [float(n) for n in svg.get('viewBox', '').replace(',', ' ').split()]
                        require(numbers(viewbox, 4) and viewbox[2] > 0 and viewbox[3] > 0,
                                label + identity + ': SVG requires finite viewBox with positive extents')
                    except (ET.ParseError, ValueError, OSError) as error:
                        errors.append(label + identity + ': unreadable SVG: ' + str(error))
            path = source_path(asset.get('source'), label + identity)
            if path:
                try:
                    with Image.open(path) as image:
                        require(image.format == 'PNG', label + identity + ': master must be PNG')
                        require(list(image.size) == size, label + identity + ': source dimensions mismatch')
                        alpha = image.convert('RGBA').getchannel('A')
                        require(alpha.getextrema()[1] > 0, label + identity + ': empty image')
                        if asset.get('transparency') is True:
                            require(('A' in image.getbands() or 'transparency' in image.info) and alpha.getextrema()[0] < 255,
                                    label + identity + ': real transparency required')
                        elif asset.get('transparency') is False:
                            require(alpha.getextrema()[0] == 255, label + identity + ': declared opaque source contains transparency')
                except OSError as error:
                    errors.append(label + identity + ': unreadable image: ' + str(error))
        require(actual == expected, label + 'resource/frame contract incomplete or contains unexpected/duplicate entries')
        for key, frames in sequences.items():
            require(frames == list(range(len(frames))), label + str(key) + ': frames must appear in contiguous order from zero')
        for key, values in alignment.items():
            require(all(value == values[0] for value in values), label + str(key) + ': states/frames must share canvas, pivot and logical size')
        audio_ids = set()
        actual_sounds = Counter()
        for sound in sounds:
            identity = sound.get('id')
            require(isinstance(identity, str) and bool(identity) and identity not in audio_ids and identity not in ids,
                    label + 'sound ids must be unique and distinct from images')
            if not isinstance(identity, str):
                continue
            audio_ids.add(identity)
            key = (sound.get('sound'), sound.get('variant'))
            if not all(isinstance(v, str) and v for v in key):
                errors.append(label + identity + ': invalid sound/variant')
                continue
            actual_sounds[key] += 1
            source_path(sound.get('source'), label + identity)
            if 'wav' in sound:
                wav = sound['wav']
                if not isinstance(wav, dict):
                    errors.append(label + identity + ': wav must be an object')
                else:
                    fields = ('sample_rate', 'channels', 'sample_width', 'frames')
                    require(all(type(wav.get(k)) is int and wav[k] > 0 for k in fields), label + identity + ': WAV format fields must be positive integers')
                    require(type(wav.get('loop')) is bool, label + identity + ': WAV loop must be Boolean')
                    file = source_path(wav.get('file'), label + identity + ' WAV')
                    if file:
                        try:
                            with wave.open(str(file), 'rb') as audio:
                                actual_format = (audio.getframerate(), audio.getnchannels(), audio.getsampwidth(), audio.getnframes())
                                require(actual_format == tuple(wav.get(k) for k in fields), label + identity + ': WAV header differs from contract')
                                require(audio.getcomptype() == 'NONE' and audio.getnframes() > 0, label + identity + ': WAV must be nonempty PCM')
                                expected_bytes = audio.getnframes() * audio.getnchannels() * audio.getsampwidth()
                                # Stream the data to avoid loading an entire music file into memory.
                                actual_bytes = 0
                                while block := audio.readframes(65536):
                                    actual_bytes += len(block)
                                require(actual_bytes == expected_bytes, label + identity + ': truncated WAV payload')
                        except (wave.Error, EOFError, OSError) as error:
                            errors.append(label + identity + ': unreadable WAV: ' + str(error))
            require(isinstance(sound.get('reference'), str) and bool(sound['reference']), label + identity + ': recipe/pattern reference required')
            require(sound.get('kind') in ('effect', 'sustained', 'music', 'ambient', 'ui'), label + identity + ': unknown sound kind')
            require(isinstance(sound.get('design'), dict) and bool(sound['design']), label + identity + ': sound design required')
            require(isinstance(sound.get('provenance'), dict) and bool(sound['provenance']), label + identity + ': sound provenance required')
        require(actual_sounds == expected_sounds, label + 'sound contract incomplete or contains unexpected/duplicate variants')
        aliases = group.get('aliases', {})
        require(isinstance(aliases, dict), label + 'aliases must be an object')
        if isinstance(aliases, dict):
            for alias, target in aliases.items():
                require(alias not in ids | audio_ids and isinstance(target, str) and target in ids | audio_ids,
                        label + alias + ': alias must directly reference an existing asset or sound without masking an id')
        layers = group.get('parallax', [])
        require(isinstance(layers, list), label + 'parallax must be a list')
        if layers or contract.get('parallax'):
            require(isinstance(layers, list) and len(layers) == 3 and {layer.get('depth') for layer in layers} == {'far', 'middle', 'near'},
                    label + 'parallax requires far, middle and near layers')
            if isinstance(layers, list):
                layer_assets = [layer.get('asset') for layer in layers]
                require(len(set(layer_assets)) == 3, label + 'parallax layers must be independent assets')
                orders = {}
                for layer in layers:
                    asset = asset_by_id.get(layer.get('asset'))
                    require(bool(asset) and asset.get('family') == 'backgrounds', label + 'parallax references unknown/non-background asset')
                    require(type(layer.get('transparent')) is bool and asset is not None and asset.get('transparency') == layer.get('transparent'),
                            label + 'parallax transparency must match its asset')
                    require(layer.get('repeat') in ('none', 'x', 'y', 'xy'), label + 'invalid parallax repeat')
                    require(numbers(layer.get('displacement'), 2), label + 'parallax displacement must be finite x/y')
                    order = layer.get('order')
                    require(type(order) is int, label + 'parallax order must be integer')
                    orders[layer.get('depth')] = order
                if all(type(orders.get(k)) is int for k in ('far', 'middle', 'near')):
                    require(orders['far'] < orders['middle'] < orders['near'], label + 'parallax orders must increase with depth')
        for event in group.get('events', []):
            require(isinstance(event.get('event'), str) and bool(event['event']), label + 'semantic event required')
            require(event.get('visual') in ids and event.get('sound') in audio_ids, label + 'event references unknown visual/sound')
            require(event.get('timing') in ('discrete', 'sustained', 'music'), label + 'event timing must be discrete, sustained or music (never each frame)')
        counts.append({'set': name, 'contract': group.get('contract'), 'unique_resources': len({k[0] for k in actual}),
                       'png_frames': len(assets), 'sound_variants': len(sounds), 'aliases': len(aliases)})
    return errors, counts


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('manifest', type=Path)
    parser.add_argument('--root', type=Path, help='source root; defaults to manifest directory')
    args = parser.parse_args()
    try:
        data = json.loads(args.manifest.read_text(encoding='utf-8'))
        if not isinstance(data, dict):
            raise ValueError('manifest must be an object')
        errors, counts = validate(data, args.root or args.manifest.parent)
    except (ValueError, OSError, TypeError, KeyError, AttributeError) as error:
        errors, counts = ['malformed manifest: ' + str(error)], []
    print(json.dumps({'valid': not errors, 'counts': counts, 'errors': errors}, indent=2))
    raise SystemExit(1 if errors else 0)


if __name__ == '__main__':
    main()
