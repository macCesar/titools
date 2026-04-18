# Master input guidelines

## Preferred: SVG

SVG is the best source because:

- Vector: re-renders cleanly at any density, no upscaling artifacts
- Preserves transparency natively
- Small file size (~5–50 KB for typical logos vs 100+ KB for 1024² PNG)
- Easy to edit by designers in Illustrator / Affinity / Figma / Inkscape

**SVG requirements**:

- Square viewBox (or content that's square within a rectangular viewBox)
- Paths only — avoid `<script>`, `<foreignObject>`, web fonts
- Solid fills or simple gradients — very complex gradients may rasterize inconsistently across densities
- No external references (embedded images, fonts loaded by URL)

The skill uses `rsvg-convert` to rasterize to 1024×1024 PNG before any further processing.

## Acceptable: PNG ≥ 1024×1024 with transparency

A PNG master works when SVG isn't available:

- Minimum size: 1024×1024 (smaller input produces visibly soft xxxhdpi icons)
- Square preferred — non-square inputs get center-cropped with a warning
- Transparent background for best monochrome layer results

## Accepted with warning: PNG with solid background

PNGs that already have a non-transparent background still work, but:

- The monochrome layer will be a solid square silhouette (every pixel is non-transparent, so "everything" becomes white)
- You cannot change the adaptive background color — it's baked in
- Recommend re-exporting from the source with transparency if possible

## Padding and the "pegado" problem

If the icon's content already fills the full canvas (logo touching the edges), every generated asset will show the same cramped look. The skill cannot add space that isn't there.

Two ways to fix:

1. **Prepare the master with transparent padding** — export the logo so there's ~15% empty space around it in the source
2. **Increase the `--padding` flag** — the skill re-centers the logo inside the target canvas. Higher padding pushes the logo inward

Recommended padding values:

| Padding | Logo fill | When to use |
|---------|-----------|-------------|
| 19 (spec floor) | 62% | Intricate logos needing maximum detail; risky with aggressive launcher masks |
| 22 (default) | 56% | Balanced, compliant with Android safe-zone spec + 3% buffer |
| 25 | 50% | Logos with fine strokes or details near the edge |
| 28–32 | 44–36% | Bold simple shapes, single-letter monograms |

If the user sees the logo pegado after running the skill once, re-run with a higher `--padding`.

## Alpha channel handling

PNG inputs commonly have one of three alpha configurations:

- **Straight alpha** (most common): `rgba(r, g, b, a)` — R/G/B hold true color, A holds coverage
- **Premultiplied alpha**: `rgba(r × a, g × a, b × a, a)` — R/G/B are scaled by A
- **No alpha channel**: opaque only

ImageMagick handles straight alpha transparently. Premultiplied inputs may show dark halos at the edges when composited — if this happens, re-export from the source app with straight alpha.

## Checking the master before running

Quick sanity check:

```bash
# Dimensions and alpha info
magick identify -format "%wx%h  alpha=%A\n" /path/to/logo.png

# Visualize the alpha channel (useful for debugging halos)
magick /path/to/logo.png -alpha extract /tmp/alpha.png && open /tmp/alpha.png
```

For SVG:

```bash
# Preview at output size
rsvg-convert -w 1024 -h 1024 /path/to/logo.svg -o /tmp/preview.png && open /tmp/preview.png
```
