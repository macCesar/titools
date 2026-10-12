# Textures, tiles and seamless repetition

Clarify what “symmetric” means: mirrored appearance, rotational symmetry, or periodic edges that repeat without a visible seam. A seamless texture need not be mirrored. Mirroring can join edges while leaving obvious center axes and repeated motifs, as Lander's terrain review found.

Declare repeat axes (`x`, `y`, `xy`, none), period, logical scale, opacity and allowed neighbors. A sky may repeat only horizontally; a terrain interior may repeat both ways; a surface tile has a free top silhouette and only joins an interior below. Specify corner/edge/interior roles and index order when topology matters. Never validate every pair as if all pairs are reachable in the level.

For raster creation request periodic edges and balanced visual density with integrated `image_gen`; inspect the result rather than assuming the prompt made it seamless. For authored SVG/procedural textures use periodic geometry and wrapped copies of border-crossing elements. With seeded stars/details, check spacing across the wrap boundary as well as inside the tile; otherwise a seam can create a cluster. Avoid modular placement rules that create diagonal bands.

Generate 3×3 repeated previews and offset the image by half its width/height to expose central seams. Test all reachable horizontal/vertical adjacency pairs and top-to-interior joins. Compare RGBA edges with premultiplied RGB and alpha separately so invisible RGB does not create false seams. Compare the edge jump to ordinary adjacent-pixel differences and inspect gradients/tangent continuity: identical end pixels alone cannot certify an invisible join. Record measured tolerance for the style; no universal numeric seam threshold applies to every texture.

Review at actual zoom/filtering and while native camera scrolling crosses the seam. Check larger patches for visible repetition, symmetry axes and brightness bands. Seam correctness and repetition fatigue are distinct concerns.

Use independent full textures for repeated backgrounds where the renderer repeats whole textures; do not assume an atlas frame repeats safely. Consult the installed `ti-game` build for texture-repeat restrictions (including power-of-two when required), filtering, UV inset and tile-layer support. A non-repeated atlas need not obey repeat-texture dimensions. For a circular world, coordinate world width, texture period and parallax factors so every layer returns to the same phase at wrap. Keep motion native.

Store project-specific `tiling` metadata (axes, period, allowed neighbors, edge roles and seam-preview paths) and validate it with the project's existing tile verifier. The bundled manifest validator checks inventory/parallax declarations, not rendered seam quality.

Evidence: Lander `docs/art/terrain-tiles.md` separates surface/interior topology and warns about visible mirror axes. Guardian `docs/art/README.md`, `docs/scripts/verify-art.js` and `docs/project/context.md` document periodic backgrounds, wrap spacing and circular parallax phase.
