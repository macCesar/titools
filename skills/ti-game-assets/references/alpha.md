# Analyze alpha before changing it

The scripts need Python 3 and Pillow. In an environment without Pillow, use a project-approved environment or a disposable virtual environment (`python3 -m venv /tmp/game-art-env`, then its `bin/pip install Pillow`). Set `PYTHONDONTWRITEBYTECODE=1` when running installed helpers to avoid generated files in the skill package.

```bash
python3 scripts/alpha_tools.py master.png --report /tmp/master-alpha.json --preview /tmp/master-alpha.png
```

Analysis is the default. The JSON reports dimensions, alpha range, translucent pixel count and bounding boxes at 1, 4, 8, 16 and 32 over 255 (inclusive). The preview shows threshold boxes on checkerboard and light/dark backgrounds. Inspect the source at full size too.

Profiles are `pixel-art`, `hard-surface`, `soft-fx`. For defined edges, start evaluating at 8/255 with protection equivalent to one logical pixel: set `--logical-size W H` for pixel art; padding is the ceiling of master/logical scale on each axis. Without a logical grid hard-surface padding is one source pixel. These are evaluation starting values, not universal removal thresholds.

Cleaning is explicit and produces new files:

```bash
python3 scripts/alpha_tools.py master.png --profile pixel-art --logical-size 64 64 \
  --clean /tmp/master-clean.png --protect 40 40 984 984 \
  --threshold 8 --reason 'Reviewed isolated exterior generator residue' \
  --report /tmp/clean.json --preview /tmp/clean-comparison.png
```

`--protect` is an exclusive-right/bottom rectangle in source pixels. Everything inside it is preserved byte-for-byte in RGBA. Only alpha outside is zeroed; RGB is preserved everywhere. Choose a rectangle enclosing *all* legitimate pieces, including detached pieces and faint emissions. Never delete components merely because they are small, and never binarize the whole image. A rectangle can leave residue between pieces; preserve it and use a reviewed image edit if a more precise region is needed.

For defined edges, `--auto-protect` proposes the threshold bbox plus logical padding; use it for a reviewed trial only. The report records region, tolerance, reason, removed pixels and original/candidate boxes; the preview compares before/after. Reject a candidate that removes content. Soft smoke, explosions and halos preserve alpha by default and require explicit `--protect` before cleaning. If no threshold bbox exists, do not infer an empty image from that threshold: retain the source and inspect lower thresholds.

Optional `--crop` trims the cleaned image at alpha >= 1. It refuses empty content. `--crop-box X0 Y0 X1 Y1` chooses a common canvas for sequences and must enclose all remaining alpha. Both require cleaning first. Record offset, original and output dimensions in the report; subtract offset from a source pivot to get the trimmed pivot. Independent tight crops are unsuitable for animation: choose the union of all frames, keep common offsets/canvases, and preserve effect growth. Never overwrite a master or an existing output.
