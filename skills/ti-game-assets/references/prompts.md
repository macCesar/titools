# Prompt starting points

Replace brackets from the world's art contract. Attach only relevant references and explicitly identify their role. Use integrated `image_gen`, not a script/API, to create or edit raster art. These examples require review rather than guaranteeing generator compliance.

## Pixel sprite

“Create one individual [player ship], strict [64×64] logical pixel grid represented as uniform proportional blocks on a transparent HD canvas. [Palette], [orientation/perspective], [materials], clear silhouette at game size. No cast, ground or external drop shadow; internal shading only. Match [style reference] for this family. Use the maximum useful canvas with tight framing of the complete silhouette, only the transparent edge needed to prevent clipping, and pivot [coordinates]. No antialiased subpixel edges or painted checkerboard.” Keep the master, prepare nearest-neighbor logical output and inspect grid/palette. A shared state/animation canvas overrides independent tight framing when its contract requires alignment.

For pixel-art effects, explicitly add: “Final atlas cell [32×32 impact / 64×64 explosion], visible phase extent [W×H], source-to-logical mapping [registered common grid / phase-specific grid]. Each logical pixel is one uniform square block of flat RGBA in the HD master, proportional to the actual final display size. No mixed block sizes, tiny HD texture or subpixel sparks. Smoke uses square clusters on the same grid, controlled partial-alpha steps and increasingly transparent outer clusters, with transparent gaps; no opaque grey backing shape or smooth painted smoke.” Inspect the actual reduced frame and neighboring phases with nearest-neighbor rendering; HD appearance alone is not acceptance.

## Individual HD sprite

“Create one individual [power-up/ship/asteroid] as a transparent HD master in [world style and palette]. [Reference A] defines materials and rendering; [reference B] defines composition. Use the highest suitable supported generation quality, [appropriate aspect ratio] and maximum useful canvas coverage. Closely frame the entire subject with only minimal transparent edge clearance; preserve every outline and [declared effect extent], without clipping. Crisp angles and clean contours, finely defined [textures/material reflections], smooth controlled gradients and internal shading, readable silhouette at [display size]. No external shadow or painted checkerboard.” Record actual output dimensions, inspect alpha/detail and keep the original pixels. Do not insert arbitrary occupancy percentages or force the HD master to the small display size.

## HD reconstruction

For a requested substantial mechanical reconstruction, use: “Create a freshly redrawn individual HD [ship/object]. [Original] defines recognizable design/topology only; [quality reference] defines the required finish. Rebuild the geometry with [required symmetry], precise straight panel lines, regular curved edges and concentric rings, defined bevels/joints/material textures, clean gradients and coherent [lighting]. Correct the original's warped shading and irregular curves. Use the highest useful native generation resolution and tight complete framing with real alpha. A near-identical copy with slight sharpening is insufficient.” Preserve deliberate design asymmetry where applicable; do not impose mechanical geometry on other styles. Inspect original, new master and final-size derivative together.

## HD state edit

“Edit the attached [exact target], preserving canvas, silhouette, scale, orientation and pivot. Add [damage] in [specified areas] using the same [palette/materials/texture]. Real transparency, no external shadow, no cropping. [Second image] is a composition reference only.” Inspect both states overlaid; regenerate exports.

## Soft explosion

“Create [frame description] of an explosion sequence in [style/palette]. Real transparent background with intentional faint smoke and [declared halo]. Common [canvas] and center [pivot] across frames, increasing radius [progression]. No ground/cast shadow.” Analyze alpha at all thresholds; preserve faint effect edges. Cleaning needs an explicit reviewed protected region.

## Level and parallax with sound

“Design [world] using [contract], with players, enemies, allies, obstacles, ammunition, rewards, ambient objects and backgrounds as required. Produce independent far, middle and near parallax layers; [axes] repeat seamlessly with [transparency] and [order/displacement].” Complete the manifest before integration. If shot/explosion/ambience synthesis is requested, map semantic events to existing `ti.synthengine` sounds/patterns, consult its current contract and preserve the native clock; never trigger each frame.

## Sound family with variants and stereo

“Create [three] related [metallic explosion] variants for [world/material] using `ti.synthengine`, keeping the same recognizable family and distinguishing texture/envelope rather than random volume alone. Place discrete events from their screen origin, keep event layers spatially coherent, preserve the current audio owner/clock/preferences and size the overlap budget from representative scenes. Inventory recipes and explain waveform/envelope/filter choices. Validate calls separately from device listening.” Read `sound-assets.md` and the current `ti-synthengine` references first.
