---
name: ti-game-assets
description: Use when creating, editing, preparing or integrating game sprites, animation frames, atlases, particles, backgrounds, parallax layers, HUD art, synthesized sound effects, sound variants, stereo placement, music, ambience, procedural WAV, editable SVG sources, repeating textures or world asset sets in a Titanium project, including pixel art, HD art and alpha cleanup. Applies to visual assets even without native game or sound modules installed.
metadata:
  requirements: Raster drawing uses integrated image_gen; authored SVG/procedural exports use project tools; validators need Python 3 and Pillow.
---

# Game assets for Titanium

Produce coherent visual and sound assets and complete, reproducible exports. Sound creation and refinement are an essential domain alongside images, governed by `ti-synthengine`. Preserve editable SVG/procedural sources when used, full-canvas PNG masters/renders, audio recipes or WAV generators, prompts and provenance in the project's source of truth. Read its art workflow and inventory before editing; a world's own style and authorized rendering exceptions govern that world.

For individual raster masters, request maximum useful canvas coverage and the highest suitable detail supported by the current generator. Frame the complete subject closely with only the transparent edge needed to avoid clipping. Do not prescribe a default occupancy percentage or generous empty margins. Game-size outputs are derivatives of these masters. Record actual generated dimensions; no permanent 1024, 1254 or 1400-pixel cap applies. Shared animation/state canvases and intentional effect extents follow their explicit contracts; see [references/art-direction.md](references/art-direction.md).

For pixel art, specify the actual final logical grid and visible phase extent before generation. HD blocks must map proportionally to final pixels, with consistent square color/alpha blocks; "pixel-art style" alone is insufficient. Preserve progressive smoke alpha on that grid, export with nearest-neighbor resampling and inspect at actual game size. HD gradients follow their own filtering contract.

For HD illustration, require both the highest useful native generation resolution and a visibly refined finish: well-defined materials/textures, clean gradients, precise straight edges, smooth regular curves, crisp delineation and coherent light/shadow. Follow the world's style and any requested symmetry. Inspect the full-resolution master and its final reduction; pixel count alone does not establish quality, and minor sharpening does not satisfy a requested reconstruction.

## Required workflow

Read the relevant references before acting:

| Work | Reference |
| --- | --- |
| Generate/edit art, pixel grid, variants, animation continuity | [references/art-direction.md](references/art-direction.md) |
| Inventory, contracts per game/world/level, frames, aliases, parallax | [references/manifest.md](references/manifest.md) and `references/manifest.example.json` |
| Analyze/clean alpha, protected regions, trim and alignment | [references/alpha.md](references/alpha.md) |
| ti.game sprite-sheets, proportional reduction/integer rounding, atlas packing, HUD, previews, densities and sound events | [references/integration.md](references/integration.md) |
| Create/edit sounds, variants, stereo, mixing and audition | [references/sound-assets.md](references/sound-assets.md) |
| Editable SVG/procedural art and deterministic builds | [references/vector-sources.md](references/vector-sources.md) |
| Seamless textures, tile adjacency and circular parallax phase | [references/repeating-textures.md](references/repeating-textures.md) |
| Offline WAV generation, signal analysis and seamless audio loops | [references/offline-audio.md](references/offline-audio.md) |
| Requested monetization or existing ad/game transitions | [references/responsible-ads.md](references/responsible-ads.md) |
| Prompt starting points | [references/prompts.md](references/prompts.md) |

1. Inspect references and existing exporters. Distinguish style references, composition references and the exact image being edited. Scrap art is a reference for its own family, never a universal base.
2. Define the art contract and complete manifest before integrating a new world. Separate unique resources, variants, states, ordered frames, aliases and technical utilities. Compare counts only between sets sharing a contract. Declare each derived output's actual consumer and explicit resource selection; a complete source inventory does not require exporting every asset to every UI folder. See [references/integration.md](references/integration.md#export-only-what-each-consumer-uses).
3. Create/edit required sound recipes and patterns through the current `ti-synthengine` workflow; define acoustic palette, meaningful variants, stereo placement and overlap budgets. Preserve the existing clock and lifecycle owner. Generate and edit raster drawings with ChatGPT's integrated `image_gen` tool, requesting real transparency. For authored SVG/procedural art, preserve and edit code/vector sources and rasterize with existing exporters; scripts may generate those declared sources/derivatives and procedural WAV. Raster image-model CLI/API generation remains an explicitly chosen alternative. Inspect tool capabilities at execution time instead of hardcoding a permanent resolution cap.
4. Validate sound calls and audition when a playback path is available; distinguish contract checks from listening. Review masters, analyze alpha, then explicitly clean identified exterior residue into new files. Preserve ambiguous content. Verify silhouettes, scale, pivots and frame continuity before export.
5. Check seamless texture/audio joins, source/output hashes and deterministic regeneration when applicable. Use the responsible-ad reference only for requested monetization or affected game transitions. Reuse existing exporters and regenerate every affected atlas PNG/JSON, frame map, HUD, archive card, preview, menu and Android/iOS density. Record provenance and verify outputs before handing back.

## Collaborating skills

`ti-game` and `ti-synthengine` have equal importance in their own domains: native representation/motion/events and synthesis/sound behavior. Coordinate both when the task involves audiovisual work; do not duplicate their manuals.

- Read `ti-game` for sprites, sheets, animation, atlas, particles and parallax integration. Verify APIs against its current references and installed build.
- Read `ti-synthengine` for creation or editing of synthesized effects, variants, music, ambience, stereo placement and audiovisual timing. The identifier is **`ti.synthengine`**. Read its current API/lifecycle contract before proposing calls.
- Read `ti-admob-unified` for requested ad integration, configuration and providers using **`ti.admob.unified`**; the responsible-ad guide adds game experience criteria without duplicating that module manual.
- Read `purgetss` for its existing asset exporters and the Titanium/UI/Alloy skills relevant to the destination. Detect Alloy vs. Classic.
- Creating drawings does not require installing modules. An image does not authorize a new mechanic, sound, collision profile or balance change.

## Acceptance

Validate with `scripts/validate_manifest.py`; analyze images with `scripts/alpha_tools.py`. Separate technical validation, visual review and listening on a device in the result. A valid manifest is not artistic approval, and an accepted synthesis call is not sound-quality certification. Report missing resources or unverified runtime behavior explicitly. Keep physics and movement native; preserve authorized rendering exceptions.
