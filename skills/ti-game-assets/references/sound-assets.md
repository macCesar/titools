# Create and refine sound assets

Sound is an essential asset domain alongside images. `ti-game-assets` coordinates creation, variation, inventory, integration and acceptance of both. `ti-synthengine` governs synthesis and acoustic design with the **`ti.synthengine`** native contract; `ti-game` governs visual representation, movement and events. Neither domain is subordinate to the other.

Read the installed `ti-synthengine` skill and its API, sound-design/recipes, audio-engine and lifecycle references relevant to the request before composing or editing sounds. Use integrated `image_gen` for raster drawings and native synthesis recipes/patterns for runtime sounds. For procedural WAV generators, file analysis, fallback and seamless loops read [offline-audio.md](offline-audio.md); preserve the project backend instead of requiring a native synthesis module. Do not treat `image_gen` as an audio generator. If requested sound cannot be represented by `ti.synthengine` (such as recorded speech or sample playback), explain the limitation and use the project's appropriate audio workflow when authorized; never invent synthesizer capabilities.

## Synthesis knowledge to apply

Use these concepts to explain the acoustic choices, then consult `ti-synthengine`'s `references/sound-design.md` and `references/recipes.md` for details and `references/api.md` for exact supported fields. These are design starting points, not another API manual.

| Control | What to listen for | Useful game direction |
| --- | --- | --- |
| Waveform and harmonics | Sine is clean; triangle softer than square; square/saw have stronger harmonics; noise has no single pitch | Clean UI, retro rewards, buzzy alarms, impact/wind texture |
| ADSR envelope | Attack shapes onset; decay falls to sustain; release shapes the tail | Fast impact vs. soft ambience, pluck vs. held propulsion; fit stages inside duration |
| Pitch and sweep | Register and upward/downward motion change perceived energy | Laser zap, activation, power-down; distinguish actual pitch from noise-rate changes |
| Filters and resonance | Low-pass darkens, high-pass thins, band-pass isolates a band; resonance can emphasize it | Material/body vs. hiss, explosion tails, wah or wind; watch resonant peaks |
| FM | Modulator/carrier ratio and modulation depth change harmonic/metallic character | Bell/glass/metal attacks, electric-piano rewards; declining depth mellows the tail |
| Detune and LFO | Nearby pitched voices beat; LFO adds pitch motion | Unison texture or vibrato; avoid adding voices or modulation without a perceptual purpose |
| Layering and gain | Body and noise can combine; overlap and release tails add energy | One recognizable event with a controlled voice budget; check clipping and masking |
| Pan and movement | Stereo position or sweep supports spatial meaning | Place impacts in the playfield, keep UI centered when appropriate, verify mono cues |

Avoid equating lower frequency with a guaranteed bigger sound on a phone speaker. Listen for harmonics, attack, noise/body balance and intelligibility in context. Change one design dimension at a time when comparing candidates; keep level comparable so louder does not win by accident. Describe why each waveform, envelope and modulation creates the requested effect. Exact range, cross-field validity and module-specific limitations remain `ti-synthengine`'s responsibility.

## Work from meaning to timbre

Inspect the existing sound owner and inventory first. Define an acoustic palette per game/world/family, just as for art: retro/clean/metallic/organic texture, attack and decay character, pitch register, emotional role and density. Design shots, impacts, explosions, thrust, pickups, damage, UI, music and ambience only as required by the contract. Create or refine focused recipes and reusable parameter variants, not another global audio owner. Preserve prompts/design rationale and provenance with their source code/data.

Make variation meaningful: material, enemy, weapon or reward function should guide timbre, envelope, pitch/filter/FM choices. Random pitch or volume alone may be insufficient. Choose among related variants without immediate repetition when that suits the event, and coordinate visual/audio variation indices when they describe the same outcome. Preserve a recognizable family sound and avoid distracting differences. These are design criteria, not universal counts or mandatory mechanics.

## Stereo, overlap and lifecycle

Where screen position matters, derive bounded pan from the event's horizontal position using the measured playfield width. Clamp to a deliberately chosen range and use center when position is unavailable. Capture coordinates before pooling/recycling an entity. Keep layers of one event at the same spatial position unless a deliberate sweep is part of the sound. When a static position is intended, consult the current contract for `pan`/`panEnd` behavior. Do not add frame timers or extra voices just for panning. Check mono/small-speaker audibility: stereo supports a cue, never carries its only meaning.

Use accepted events, not every spawned projectile or animation frame, as sound triggers. Budget simultaneous voices including release tails, layers, enemies and music. Use event gates, priorities, family aggregation and gain staging when actual overlap calls for them; derive the values from the game, not from another project's constants. Sustained propulsion/ambience and music need a different ownership/timing strategy from discrete effects. Preserve the native clock, pause/background/resume behavior, mute/preferences and cleanup. Verify the module's real scheduling/cancellation limitations before proposing changes.

Asteroids provides useful design evidence: related explosion variants, material/enemy profiles, stereo positions captured before recycling, family aggregation and overlap budgets. Those choices are examples rather than fixed caps, gates, gains, pan ranges or API wrappers for every game. Inspect a target project's current implementation; do not import Asteroids' balance or assumptions.

## Validate and listen

Check every recipe/pattern against the current strict option contract, envelope intersection, finite/ranged values, accepted results and lifecycle. If a project has a contract harness or DSP render tool, reuse it; do not certify a mock as native playback. Use a temporary diagnostic listening surface when appropriate, preserving app data and existing owners.

Listen to individual variants and representative busy scenes on headphones and a physical phone speaker, including mono behavior, distinction between cues, clipping/fatigue and music/effect masking. Record technical validation, audition path and human acceptance separately. Simulation or DSP replay can catch problems but cannot certify device sound quality. No new sound library, module install or unrelated gameplay change is implied by an image-only request.
