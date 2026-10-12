#!/usr/bin/env python3
"""Inspect alpha; explicitly remove reviewed exterior residue into new files."""
import argparse
import json
import math
from pathlib import Path

from PIL import Image, ImageDraw

THRESHOLDS = (1, 4, 8, 16, 32)


def bbox(alpha, threshold):
    return alpha.point(lambda value: 255 if value >= threshold else 0).getbbox()


def analyze(image):
    alpha = image.getchannel('A')
    histogram = alpha.histogram()
    return {
        'dimensions': list(image.size),
        'alpha_range': list(alpha.getextrema()),
        'translucent_pixels': sum(histogram[1:255]),
        'visible_pixels': sum(histogram[1:]),
        'bounding_boxes': {str(t): bbox(alpha, t) for t in THRESHOLDS},
    }


def rectangle(values, size):
    x0, y0, x1, y1 = values
    if not (0 <= x0 < x1 <= size[0] and 0 <= y0 < y1 <= size[1]):
        raise ValueError('rectangle must be nonempty and inside the source canvas')
    return tuple(values)


def clean(image, protected):
    alpha = image.getchannel('A')
    retained = Image.new('L', image.size, 0)
    retained.paste(alpha.crop(protected), protected[:2])
    result = image.copy()
    result.putalpha(retained)
    return result


def preview(before, after=None):
    images = [before] if after is None else [before, after]
    cell = 280
    output = Image.new('RGB', (cell * len(images), (cell + 24) * 3), 'white')
    draw = ImageDraw.Draw(output)
    for column, source in enumerate(images):
        scaled = source.copy()
        scaled.thumbnail((cell, cell), Image.Resampling.NEAREST)
        for row, background in enumerate(('checker', '#eeeeee', '#181818')):
            x, y = column * cell, row * (cell + 24) + 24
            panel = Image.new('RGBA', (cell, cell), background if row else '#cccccc')
            if row == 0:
                painter = ImageDraw.Draw(panel)
                for cy in range(0, cell, 16):
                    for cx in range(0, cell, 16):
                        if (cx // 16 + cy // 16) % 2:
                            painter.rectangle((cx, cy, cx + 15, cy + 15), fill='#999999')
            panel.alpha_composite(scaled)
            output.paste(panel.convert('RGB'), (x, y))
            draw.text((x + 4, y - 20), ('original' if column == 0 else 'candidate') + ' / ' + background, fill='black')
            for threshold, color in zip(THRESHOLDS, ('red', 'orange', 'lime', 'cyan', 'magenta')):
                box = bbox(source.getchannel('A'), threshold)
                if box:
                    sx, sy = scaled.width / source.width, scaled.height / source.height
                    draw.rectangle((x + box[0] * sx, y + box[1] * sy,
                                    x + (box[2] - 1) * sx, y + (box[3] - 1) * sy), outline=color)
    return output


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source', type=Path)
    parser.add_argument('--profile', choices=('pixel-art', 'hard-surface', 'soft-fx'), default='hard-surface')
    parser.add_argument('--logical-size', nargs=2, type=int, metavar=('W', 'H'))
    parser.add_argument('--threshold', type=int, default=8)
    parser.add_argument('--protect', nargs=4, type=int, metavar=('X0', 'Y0', 'X1', 'Y1'))
    parser.add_argument('--auto-protect', action='store_true')
    parser.add_argument('--reason', help='reviewed residue and justification for the protected region')
    parser.add_argument('--clean', type=Path, help='new PNG output; omit for analysis only')
    crop = parser.add_mutually_exclusive_group()
    crop.add_argument('--crop', action='store_true')
    crop.add_argument('--crop-box', nargs=4, type=int, metavar=('X0', 'Y0', 'X1', 'Y1'))
    parser.add_argument('--report', type=Path)
    parser.add_argument('--preview', type=Path)
    args = parser.parse_args()
    try:
        if not 1 <= args.threshold <= 255:
            raise ValueError('threshold must be 1..255')
        if args.logical_size and min(args.logical_size) <= 0:
            raise ValueError('logical size must be positive')
        if args.protect and args.auto_protect:
            raise ValueError('choose explicit or automatic protection, not both')
        if not args.clean and (args.crop or args.crop_box or args.protect or args.auto_protect):
            raise ValueError('protection and crop flags require --clean')
        outputs = [p.resolve() for p in (args.clean, args.report, args.preview) if p]
        if len(outputs) != len(set(outputs)) or args.source.resolve() in outputs:
            raise ValueError('outputs must be distinct from each other and the source')
        if any(p.exists() for p in outputs):
            raise ValueError('refusing to overwrite an existing output')
        with Image.open(args.source) as opened:
            source = opened.convert('RGBA')
        report = {'source': str(args.source), 'profile': args.profile, 'analysis': analyze(source)}
        candidate = None
        if args.clean:
            if not args.reason or not args.reason.strip():
                raise ValueError('cleaning requires --reason documenting the review')
            if args.profile == 'soft-fx' and (not args.protect or args.auto_protect):
                raise ValueError('soft-fx requires an explicit protected region')
            if args.profile == 'pixel-art' and not args.logical_size:
                raise ValueError('pixel-art cleaning requires --logical-size')
            padding = [math.ceil(source.size[i] / args.logical_size[i]) for i in (0, 1)] if args.logical_size else [1, 1]
            if args.protect:
                protected = rectangle(args.protect, source.size)
            elif args.auto_protect:
                detected = bbox(source.getchannel('A'), args.threshold)
                if not detected:
                    raise ValueError('no content at threshold; preserve source and inspect lower thresholds')
                protected = (max(0, detected[0] - padding[0]), max(0, detected[1] - padding[1]),
                             min(source.width, detected[2] + padding[0]), min(source.height, detected[3] + padding[1]))
            else:
                raise ValueError('cleaning requires --protect or reviewed --auto-protect')
            candidate = clean(source, protected)
            report['cleanup'] = {
                'protected_region': protected, 'threshold': args.threshold,
                'logical_size': args.logical_size, 'logical_pixel_padding': padding,
                'reason': args.reason, 'region_mode': 'explicit' if args.protect else 'automatic-trial',
                'removed_pixels': report['analysis']['visible_pixels'] - analyze(candidate)['visible_pixels'],
                'analysis': analyze(candidate),
            }
            trim = args.crop_box or (bbox(candidate.getchannel('A'), 1) if args.crop else None)
            if (args.crop or args.crop_box) and not bbox(candidate.getchannel('A'), 1):
                raise ValueError('cannot crop empty content')
            if trim:
                trim = rectangle(trim, source.size)
                visible = bbox(candidate.getchannel('A'), 1)
                if visible and not (trim[0] <= visible[0] and trim[1] <= visible[1] and trim[2] >= visible[2] and trim[3] >= visible[3]):
                    raise ValueError('crop box would discard visible content')
            report['export'] = {'path': str(args.clean), 'offset': list(trim[:2]) if trim else [0, 0],
                                'source_dimensions': list(source.size),
                                'dimensions': [trim[2] - trim[0], trim[3] - trim[1]] if trim else list(source.size)}
        # Build comparison before writing any output. It uses common source canvases.
        comparison = preview(source, candidate) if args.preview else None
        if args.clean:
            (candidate.crop(trim) if trim else candidate).save(args.clean, format='PNG')
        if args.preview:
            comparison.save(args.preview, format='PNG')
        encoded = json.dumps(report, indent=2)
        if args.report:
            args.report.write_text(encoded + '\n', encoding='utf-8')
        print(encoded)
    except (ValueError, OSError) as error:
        parser.error(str(error))


if __name__ == '__main__':
    main()
