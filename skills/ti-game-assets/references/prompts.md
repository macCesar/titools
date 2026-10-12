# Prompt starting points

Replace brackets from the world's art contract. Attach only relevant references and explicitly identify their role. Use integrated `image_gen`, not a script/API, to create or edit raster art. These examples require review rather than guaranteeing generator compliance.

## Pixel sprite

“Create a [player ship], strict [64×64] logical pixel grid represented as uniform proportional blocks on a transparent HD canvas. [Palette], [orientation/perspective], [materials], clear silhouette at game size. No cast, ground or external drop shadow; internal shading only. Match [style reference] for this family. Center pivot [coordinates], preserve generous transparent margin. No antialiased subpixel edges or painted checkerboard.” Keep the master, prepare nearest-neighbor logical output and inspect grid/palette.

## HD state edit

“Edit the attached [exact target], preserving canvas, silhouette, scale, orientation and pivot. Add [damage] in [specified areas] using the same [palette/materials/texture]. Real transparency, no external shadow, no cropping. [Second image] is a composition reference only.” Inspect both states overlaid; regenerate exports.

## Soft explosion

“Create [frame description] of an explosion sequence in [style/palette]. Real transparent background with intentional faint smoke and [declared halo]. Common [canvas] and center [pivot] across frames, increasing radius [progression]. No ground/cast shadow.” Analyze alpha at all thresholds; preserve faint effect edges. Cleaning needs an explicit reviewed protected region.

## Level and parallax with sound

“Design [world] using [contract], with players, enemies, allies, obstacles, ammunition, rewards, ambient objects and backgrounds as required. Produce independent far, middle and near parallax layers; [axes] repeat seamlessly with [transparency] and [order/displacement].” Complete the manifest before integration. If shot/explosion/ambience synthesis is requested, map semantic events to existing `ti.synthengine` sounds/patterns, consult its current contract and preserve the native clock; never trigger each frame.

## Sound family with variants and stereo

“Create [three] related [metallic explosion] variants for [world/material] using `ti.synthengine`, keeping the same recognizable family and distinguishing texture/envelope rather than random volume alone. Place discrete events from their screen origin, keep event layers spatially coherent, preserve the current audio owner/clock/preferences and size the overlap budget from representative scenes. Inventory recipes and explain waveform/envelope/filter choices. Validate calls separately from device listening.” Read `sound-assets.md` and the current `ti-synthengine` references first.
