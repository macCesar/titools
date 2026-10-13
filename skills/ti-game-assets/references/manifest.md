# Manifest contract (schema version 1)

Use `manifest.example.json` as a template, not a shipped asset library. Its paths are placeholders for actual project sources; validation must fail until those files exist. Paths resolve from the manifest directory or `--root`.

```bash
python3 scripts/validate_manifest.py path/to/manifest.json --root path/to/project
```

`contracts` maps names to required inventories. Each resource definition declares `resource`, `family`, `variant`, `state` and positive `frames`. Every frame 0..frames-1 must exist exactly once in each set using that contract. Define another contract when a game/world/level needs a different set; never force every world to match a remembered 44/45 file count. List omissions intentionally in the contract's notes. Families are `players`, `enemies`, `allies`, `obstacles`, `ammunition`, `rewards`, `ambient`, `backgrounds`, `technical`.

Each set has `id`, `contract`, `assets`, `sounds`, `aliases`, optional `parallax` and `events`. Each PNG asset has a unique `id`, the contract identity fields, zero-based `frame`, existing `source`, positive integer `dimensions` and `canvas`, finite pixel `pivot`, `style` (`pixel-art`, `hard-surface`, `soft-fx`, `hd`), Boolean `transparency` and `provenance.prompt`. Record generator/tool, reference roles and edit lineage in provenance. Pixel art additionally requires `logical_size`.

Masters retain their full common canvas. All states and frames for one resource/variant must share canvas, pivot and logical size. The validator checks PNG dimensions, nonempty alpha and declared transparency (true requires actual transparent pixels; false requires an opaque image); it cannot recognize a painted checkerboard, grid quality or artistic continuity. Review those visually. For trimmed derivatives, store source dimensions, crop offset, output dimensions and adjusted pivot in the alpha report/export inventory; never substitute a trimmed derivative for the aligned master.

`aliases` maps alternate names directly to existing image or sound IDs, without hiding an ID or chaining aliases. Technical utilities are inventoried distinctly through their family, not mistaken for unique gameplay drawings. The count report separates unique visual resources, PNG frames, sound variants and aliases.

## Sounds are assets

Contract `sounds` entries declare a sound family and its required named variants. Each set supplies every variant exactly once. A sound entry has `id`, `sound`, `variant`, an existing `source` code/data file, a `reference` identifying the recipe/pattern within it, `kind` (`effect`, `sustained`, `music`, `ambient`, `ui`), `design` and `provenance`. Synthesized sounds do not need a WAV or PNG; their reusable source is the recipe and its parameters. Keep sound assets distinct from image frames.

Record semantic purpose, waveform/timbre, envelope, pitch movement, filters/FM, duration, gain, voice/overlap budget, variation strategy, stereo placement and lifecycle owner in design when relevant. Record which `ti-synthengine` contract/references were consulted. The inventory validator proves source presence and variant completeness, not that a symbol exists or synthesis options are accepted: verify recipe references and calls against the current module contract separately.

`events` maps a semantic `event` to an image ID, sound ID and `timing` (`discrete`, `sustained`, `music`). Use variant-specific bindings where needed. An explosion sound starts at the explosion event, not once per animation frame. Sound-only/UI events may live in the project's audio inventory without requiring a made-up visual; this audiovisual mapping is only for events having both.

## Parallax and derived outputs

When the contract declares `parallax: true`, provide exactly three independent background assets: `far`, `middle`, `near`. Each layer declares `asset`, integer `order` increasing with depth, Boolean `transparent` matching its source asset, `repeat` (`none`, `x`, `y`, `xy`) and finite `[x,y]` displacement. Review seams and actual native scrolling separately. Transparency of opaque distant skies and translucent nearer layers is a style choice declared here.

Extend the manifest with project-specific `exports` (atlas/JSON/frame map, HUD/cards/previews/menu/densities), collision-overlay references and source-to-output dependencies. Reuse the project's validator/exporter for those formats. The bundled validator validates masters/inventory only; include its report and the project export checks in acceptance. Quantities are compared within a named contract, not across unlike contracts.

For each export destination, record the selected resources/aliases and their actual consumer. Keep this selection distinct from the complete source inventory: menu icons, HD previews, Archive cards and covers can require different subsets. An unused source or alias is not a reason to generate a UI copy. Follow [integration.md](integration.md#export-only-what-each-consumer-uses) for selection, obsolete-density cleanup and package verification.

## Optional reproducible sources and audio files

For vector-authored artwork, `vector_source` points at the existing SVG with a finite, positive-extent `viewBox`; `source` remains the full-canvas PNG render checked for image geometry. Preserve the actual editable source and record generator/render settings. `build.files` optionally maps all source, generator and generated paths to lowercase SHA-256 hashes, checked against existing files. See [vector-sources.md](vector-sources.md).

For offline audio, a sound can add `wav: {file, sample_rate, channels, sample_width, frames, loop}`. `sample_width` is bytes/sample; numeric header fields are positive integers and `loop` is Boolean. The validator checks nonempty PCM headers and complete payloads; signal/loop quality is a separate analysis. See [offline-audio.md](offline-audio.md).

Project-specific `tiling` and ad policy metadata remain checked by project verifiers, not by this inventory helper. See [repeating-textures.md](repeating-textures.md) and [responsible-ads.md](responsible-ads.md).
