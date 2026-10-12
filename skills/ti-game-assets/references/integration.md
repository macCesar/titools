# Exports and audiovisual integration

Find and reuse project exporters before writing another pipeline. A change to a master is complete only after regenerating affected atlas PNG/JSON, frame map, HUD, archive cards, previews, menus and Android/iOS densities. Record commands, input/output paths and validation results. Check transparent borders, aliases, sequence order and dimensions; make contact sheets for visual review.

For atlas packing record padding and extrusion chosen for the filter/mipmap strategy; check adjacent-frame bleeding in the actual renderer. HD gradients are not pixel art: select filtering per style. For pixel art default to `SpriteSheet` `smoothing: false` and sprite `pixelSnap: true`, while preserving an explicitly authorized project exception. `pixelSnap` aligns only the drawn anchor to framebuffer pixels; it neither changes physics nor eliminates raster changes at arbitrary rotation angles. Do not add JS frame loops to round motion or angles.

Consult `ti-game` for the installed native contract before choosing atlas, animation, particle or parallax calls. Consult Titanium/UI and PurgeTSS only for applicable output paths and project type. Check texture dimensions against device/build capabilities; estimate uncompressed RGBA memory as width × height × 4 bytes per texture, with mipmaps, copies and concurrent textures accounted for separately. Read [repeating-textures.md](repeating-textures.md) for repeat axes, neighbor topology and seam/phase checks, and [vector-sources.md](vector-sources.md) for deterministic SVG exports. Test seams in repeating backgrounds at their actual scale. Keep three parallax layers independent (far, middle, near), with transparent foregrounds where required, increasing order and explicit repeat/displacement. Native scrolling/motion must remain native.

Art updates do not alter collision geometry. If sources or approved collision profiles change, regenerate collision overlays and review impact zones independently from the drawings. Never infer physical mechanics from the existence of a frame.

## Sound coordination

Use `ti-game` and `ti-synthengine` together for creating/refining sound assets and audiovisual coordination. Read [sound-assets.md](sound-assets.md) for the acoustic palette, meaningful variations, stereo and audition workflow. Map semantic events (shot, impact, explosion, thrust, reward, damage, UI, ambience) to created or existing sound/pattern references in the manifest. Count audio resources separately from PNGs and frames. Creating visual art alone does not authorize a sound library or module installation.

Read the current `ti-synthengine` API, guide and relevant sound references before writing calls: options, envelopes, timing, results, pause behavior and cleanup belong to that contract, not to this skill. Preserve the project's engine owner, clock and lifecycle. Distinguish discrete effects, sustained sounds and music; do not play a sound for every animation frame. Use discrete native events and documented mechanisms. Avoid inventing indefinite voices, per-voice control, a pause API or sample-accurate sync; check documented limitations. Handle rejected calls and cleanup at their existing ownership level.

Report separately: export/contract validation, visual inspection, runtime synchronization and device listening. No script result certifies aesthetic or acoustic quality.

For requested monetization or affected ad transitions, read [responsible-ads.md](responsible-ads.md). Coordinate native pause/audio cleanup with the existing game and ad owners; asset work alone does not enable advertising.
