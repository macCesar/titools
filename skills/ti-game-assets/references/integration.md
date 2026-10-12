# Exports and audiovisual integration

Find and reuse project exporters before writing another pipeline. A change to a master is complete only after regenerating affected atlas PNG/JSON, frame map, HUD, archive cards, previews, menus and Android/iOS densities. Record commands, input/output paths and validation results. Check transparent borders, aliases, sequence order and dimensions; make contact sheets for visual review.

For atlas packing record padding and extrusion chosen for the filter/mipmap strategy; check adjacent-frame bleeding in the actual renderer. HD gradients are not pixel art: select filtering per style. For pixel art default to `SpriteSheet` `smoothing: false` and sprite `pixelSnap: true`, while preserving an explicitly authorized project exception. `pixelSnap` aligns only the drawn anchor to framebuffer pixels; it neither changes physics nor eliminates raster changes at arbitrary rotation angles. Do not add JS frame loops to round motion or angles.

Consult `ti-game` for the installed native contract before choosing atlas, animation, particle or parallax calls. Consult Titanium/UI and PurgeTSS only for applicable output paths and project type. Check texture dimensions against device/build capabilities; estimate uncompressed RGBA memory as width × height × 4 bytes per texture, with mipmaps, copies and concurrent textures accounted for separately. Read [repeating-textures.md](repeating-textures.md) for repeat axes, neighbor topology and seam/phase checks, and [vector-sources.md](vector-sources.md) for deterministic SVG exports. Test seams in repeating backgrounds at their actual scale. Keep three parallax layers independent (far, middle, near), with transparent foregrounds where required, increasing order and explicit repeat/displacement. Native scrolling/motion must remain native.

Art updates do not alter collision geometry. If sources or approved collision profiles change, regenerate collision overlays and review impact zones independently from the drawings. Never infer physical mechanics from the existence of a frame.

## Sprite-sheets for ti.game: integer dimensions and packing

These sizing and rounding rules apply to every required sprite-sheet size, including rectangular cells and non-power-of-two drawing dimensions. The 32-pixel examples below illustrate the rule; they are not a size restriction.

Keep the individual HD masters as sources. Build the runtime sprite-sheet from those sources with the project's deterministic exporter, choosing either a regular grid (`frameWidth`/`frameHeight`) or a TexturePacker-compatible PNG/JSON atlas (`atlas`) according to the current `ti-game` contract. Define cell dimensions, frame names/order, aliases, animation sequence, pivot and filtering before packing; sprite-sheet cells are runtime containers, not the resolution of the HD originals.

Calculate proportional reduction from the original source dimensions, then round each resulting image dimension to the nearest positive integer: `floor(value + 0.5)` for positive pixel sizes. Preserve the fixed integer axis and round only the fractional result on the other axis. Do not always truncate or always round up, retain fractional PNG dimensions, or resize repeatedly through intermediate reductions.

| Proportional result | Final drawing size |
| --- | --- |
| Height fixed at 32; width computes to 28.3 | 28×32 pixels |
| Width fixed at 32; height computes to 17.7 | 32×18 pixels |
| Width computes to 28.5; height fixed at 32 | 29×32 pixels |

For a source `W×H` fitted inside a `cellW×cellH` limit, calculate `scale = min(cellW / W, cellH / H)` and round `W * scale` and `H * scale` once. If one axis is explicitly fixed, use its scale first and verify that the other axis fits the cell. If it does not fit, fit against both limits; non-proportional compression requires an explicit project contract. Record the final integer dimensions and effective ratio. The tiny ratio difference introduced by integer rounding is expected; the master remains unchanged.

Place the resulting image at integer offsets inside its transparent cell: `x = floor((cellW - width) / 2)`, `y = floor((cellH - height) / 2)`. When the gap is odd, the extra empty pixel goes to the right/bottom; do not place the image at half-pixel coordinates. Thus 28×32 in a 32×32 cell starts at (2,0), and 32×18 starts at (0,7). Preserve a declared noncentral pivot or registered animation alignment rather than recentering it blindly. Atlas rectangles (`x`, `y`, `w`, `h`), grid cells, padding and extrusion also use integer source pixels.

For animations, retain common cell dimensions, pivot and sequence order. Preserve any documented phase-size progression; separately scaling every frame to the full cell erases growth. Keep pixel-art block size proportional to the final visible extent, as specified in [art-direction.md](art-direction.md). Use nearest-neighbor reduction for pixel art and preserve its partial-alpha levels. Use the declared HD resampling/filter for gradients, reflections and continuous smoke alpha. Neither style uses binary-alpha cleanup by default.

Generate PNG, JSON and runtime frame map together; verify that semantic aliases resolve to the intended frames, all rectangles fit, padding/extrusion prevents neighbour bleeding and sequences stay aligned. Do not silently enable rotation/trimming unless the installed module and project pivot/offset handling support them. Inspect native-size contact sheets and playback previews, then distinguish export validation from visual acceptance in the actual renderer. This integer rounding belongs to image preparation and packing; do not round physics positions or introduce JS per-frame loops.

## Sound coordination

Use `ti-game` and `ti-synthengine` together for creating/refining sound assets and audiovisual coordination. Read [sound-assets.md](sound-assets.md) for the acoustic palette, meaningful variations, stereo and audition workflow. Map semantic events (shot, impact, explosion, thrust, reward, damage, UI, ambience) to created or existing sound/pattern references in the manifest. Count audio resources separately from PNGs and frames. Creating visual art alone does not authorize a sound library or module installation.

Read the current `ti-synthengine` API, guide and relevant sound references before writing calls: options, envelopes, timing, results, pause behavior and cleanup belong to that contract, not to this skill. Preserve the project's engine owner, clock and lifecycle. Distinguish discrete effects, sustained sounds and music; do not play a sound for every animation frame. Use discrete native events and documented mechanisms. Avoid inventing indefinite voices, per-voice control, a pause API or sample-accurate sync; check documented limitations. Handle rejected calls and cleanup at their existing ownership level.

Report separately: export/contract validation, visual inspection, runtime synchronization and device listening. No script result certifies aesthetic or acoustic quality.

For requested monetization or affected ad transitions, read [responsible-ads.md](responsible-ads.md). Coordinate native pause/audio cleanup with the existing game and ad owners; asset work alone does not enable advertising.
