# Editable vector and procedural sources

Use an existing SVG/procedural workflow when the project uses it or the user requests editable art generated with code. Integrated `image_gen` remains the default for raster drawing creation/edits; it is not a requirement to replace authored vectors. Rasterizing an SVG is an export step, not image-model generation.

## Source of truth

Keep the editable SVG, generator and parameters as canonical sources; retain individual full-canvas PNG renders as reproducible derivatives. Avoid making a generated PNG the only editable master. Preserve original/legacy source when it has a documented purpose. Name symbols and groups by meaningful parts (hull, cockpit, lights, propulsion, appendages), with explicit `viewBox`, proportions and pivots. Parameterize palette, poses and damage overlays without shifting silhouette or anchor accidentally.

Record deterministic seeds for procedural distributions. Use a maintained SVG rasterizer already in the project, such as `rsvg-convert`/librsvg, and record its version, font dependencies, antialiasing and target dimensions. Rasterizer changes can change bytes: regenerate and review the affected set rather than merely updating hashes. Avoid hidden system-font or external-image dependencies in gameplay graphics.

Reuse a build that emits PNG sheets, runtime catalogs/frame maps, source/generator/output hashes, contact sheets and animation/parallax previews together. The runtime consumes generated PNG/catalog data, not the offline generator. Verify missing/empty cells, frame bounds, dimensions, anchor consistency, stale output hashes and repeat seams. Run it twice in a disposable output directory to check determinism in a fixed environment. Do not infer human authorship from a PNG compression filter or overwrite policy: preserve authored assets through explicit provenance.

Render at the declared logical proportions and preview at actual game sizes, in grayscale and relevant color-vision simulations. Distinguish roles by silhouette/symbol as well as color. Preserve warning readability under reduced-flash settings; do not silently change mechanics, flashes or accessibility preferences while exporting.

## Manifest extension

Keep `source` pointing at the PNG render inspected by the bundled validator; add `vector_source` pointing at its existing SVG master. The validator checks an SVG root and finite positive `viewBox` extents, not vector aesthetics or generation dependencies. Record generator, parameters and render settings in provenance. Optional top-level `build.files` maps source/generator/output paths to SHA-256 hashes; validation detects modified declared files. Include *all* relevant dependencies, not just outputs. Hash agreement does not prove a build was run or that a rasterizer is correct.

## Evidence from Guardian

`docs/art/source/guardian-parts.svg` holds named symbols/editable groups. `docs/scripts/generate-art.js` creates PNGs, runtime catalog and review sheets. `docs/scripts/verify-art.js` checks hashes, cells, animation frames and background edges. `docs/art/README.md` documents the renderer and why its high-resolution antialiased art uses smoothing. These are reusable design choices, not a requirement to copy its cell sizes, frame counts or art.
