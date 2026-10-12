# Art contract and masters

Before drawing, read the project's workflow/inventory and inspect its actual reference images. Record style, palette (swatches where useful), materials, texture, perspective, orientation, silhouette, contrast and detail density for each set. A rusty scrap collection cannot dictate a clean spaceship or a different world's palette. Separate the visual style reference from a composition reference and from an edit target.

For raster-authored art, keep each individual HD PNG with real alpha in the source-of-truth directory, alongside prompt, generation/edit provenance and reference roles. Use `image_gen` for raster creation/edits; request `transparent_background: true` for cutouts. Inspect each result on light, dark and checkerboard backgrounds: a painted checkerboard is not transparency. Preserve authored SVG/procedural pipelines when the project uses them or the user requests them; read [vector-sources.md](vector-sources.md). Those scripts author editable geometry and render derivatives, rather than editing raster drawings. CLI/API generation is an explicitly chosen alternative, not an automatic fallback.

Gameplay sprites must have no cast, ground or exterior drop shadows, especially moving/rotating objects. Internal shading is allowed. Declare intentional light emission or halos as effects so alpha cleanup preserves them. Background art can have lighting appropriate to its composition.

## Pixel art

Declare a logical size, typically 32×32, 64×64, 128×128 or 256×256; justify other sizes. Require a strict grid with proportional pixel blocks, consistent block size, constrained palette and no subpixel edge shading. Keep the HD master. Prepare the logical output with nearest-neighbor resampling, then inspect palette and borders at integer zoom: nearest-neighbor resizing alone cannot repair a generator's inconsistent grid. Correct the drawing when necessary. Inspect current image-generator capabilities before choosing master size; no fixed tool-resolution maximum belongs in this contract.

## States and sequences

Maintain silhouette, scale, orientation, canvas and pivot between intact/damaged variants. An explosion may grow; reserve its maximum canvas and keep the same anchor throughout. Review contact sheets and a playback preview for animation continuity, frame order, lighting drift and generator deviations. Correct deviations before integration, rather than hiding them in changing hitboxes.

Cover the families the world needs: players, enemies, allies, obstacles, ammunition, rewards, ambient objects and backgrounds. Declare omissions intentionally in the contract; no universal file count applies to every world.
