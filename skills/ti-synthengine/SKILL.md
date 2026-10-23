---
name: ti-synthengine
description: "Use when a Titanium app declares ti.synthengine in tiapp.xml, imports require('ti.synthengine'), or asks for generated tones, chords, patterns, retro/game/UI sounds, alarms, sweeps, vibrato, envelopes (attack, decay, sustain, release), resonant filters, FM bells and electric-piano tones, detune, panning, binaural headphone positioning (spatialX/spatialY), held voices (noteOn/noteOff/updateVoice), native sequences, master chorus/delay/reverb/saturation, voice LFOs, gain staging, engine statistics, render load, the patternend event, or troubleshooting with that native module. Covers Android and iOS contract 1.0.0. Do not use for audio-file playback, streaming music, or unrelated synthesizers."
---

# ti.synthengine — sound synthesis for Titanium SDK

Act as an audio engineer and mobile sound designer for the native `ti.synthengine` module. Translate an aesthetic request into acoustically reasoned JavaScript that uses only the module's public contract.

This skill follows the reviewed TiSynthEngine **1.0.0 beta working tree based on `6b48af568c4a50685541b4ae2800d38081e6ebb7` (2026-10-22)**, including uncommitted documentation updates. Official Markdown references and the raw statistics/Studio reports record source hashes; [source notes](references/source-notes.md) and [snapshot metadata](references/source-snapshot.json) identify this source state. Android and iOS expose nineteen methods and one event. This is not a claim about published packages. Detect held, sequence, processing and statistics methods separately; `apiVersion` alone does not identify beta capabilities. Additional voice LFOs require the current field contract, so handle configuration rejection even after method checks.

## Visual and sound asset collaboration

Use `ti-game-assets` to create/edit complete visual and sound asset sets, preserve art/acoustic palettes and provenance, validate alpha/frames/manifests, prepare exports, and coordinate variants and stereo event placement. `ti-game` governs native representation/motion/events; `ti-synthengine` governs synthesis and sound behavior with `ti.synthengine`. Both have equal domain authority. Read their relevant current references rather than duplicating manuals. Art alone does not require installing modules or adding sounds/mechanics.

## Required workflow

Read the references relevant to the task before proposing code. These are source snapshots, not an independent validation oracle: when reviewing the module or updating its official documentation, compare against the native contract and both renderers, then synchronize the references. Do not infer option names from Web Audio, another synthesizer, or general DSP libraries.

| Task | Read first |
| --- | --- |
| Any code using a public method, option, default, limit, or return value | [references/api.md](references/api.md) |
| Position sounds in a headphone front plane, map spatial controls, or diagnose spatial/pan conflicts | [references/guide.md](references/guide.md#integrate-binaural-in-a-2d-app), [references/api.md](references/api.md), [references/audio-engine.md](references/audio-engine.md) |
| Design a sound from an aesthetic description | [references/sound-design.md](references/sound-design.md), then [references/recipes.md](references/recipes.md) for a tuned starting point |
| Build retro/arcade effects, a playable instrument, memory pads, layered chords, timbre comparisons, or cancellable repetition | [references/recipes.md](references/recipes.md), plus [references/api.md](references/api.md) |
| Hold/release/update a voice, edit native sequences, add master effects or extra LFOs | [references/api.md](references/api.md#noteonoptions), [references/guide.md](references/guide.md#detect-optional-beta-capabilities), [references/advanced-examples.md](references/advanced-examples.md) |
| Learn the official examples for tones, chords, tempo, patterns, noise, validation, startup, and cleanup | [references/examples.md](references/examples.md) |
| Install the module, start it safely, or manage screen/app cleanup | [references/guide.md](references/guide.md) |
| Choose a mixing profile, voice count, gain, latency strategy, or understand the signal path | [references/audio-engine.md](references/audio-engine.md), [references/recommendations.md](references/recommendations.md) |
| Query/reset statistics, enable diagnostics, interpret render load/meters, or compare host performance | [references/api.md](references/api.md#getstats), [references/audio-engine.md](references/audio-engine.md#engine-statistics), [references/stats-performance.md](references/stats-performance.md), [raw trials](references/stats-performance.json) |
| Review source provenance, native discrepancies and acceptance boundaries | [references/source-notes.md](references/source-notes.md), [snapshot metadata](references/source-snapshot.json), [Studio validation report](references/studio-validation.json) |
| Diagnose `false`, silence, glitches, distortion, pattern replacement, or route changes | [references/troubleshooting.md](references/troubleshooting.md), [references/api.md](references/api.md) |

Cite factual guidance with `[source: references/<file>.md]`. If a relevant reference cannot be consulted, prefix the claim with `FROM_MEMORY (unverified):` instead of filling the gap silently.

## Response contract for sound requests

Answer in the user's language and use this order:

1. **Brief acoustic explanation.** Name the waveform, envelope, pitch movement or LFO, stereo movement, and why they create the requested perception.
2. **Safe initialization when needed.** If the surrounding code does not already own a running engine, show `require`, `getDefaults()`, a checked `startEngine()` call, and appropriate cleanup. For a screen startup, follow the post-layout lifecycle in the guide.
3. **Production JavaScript.** Return a focused, copyable block with short comments, exact option names, valid types and checked Boolean results.

Use the current public APIs for identified held voices, native sample-clock musical sequences, master chorus/delay/reverb/optional saturation and two extra voice LFOs. The master bus processes all simultaneous sounds; it has no per-voice sends or separate music/effects buses. These features start disabled. See [integration](references/guide.md#detect-optional-beta-capabilities) and [advanced examples](references/advanced-examples.md#sustained-game-motor).

The module does not decode audio files, stream samples, read MIDI or provide sample loop points, independent music tracks, arbitrary millisecond native-sequence steps or ties. Use an appropriate sample/music engine when those unsupported capabilities are required.

## Contract invariants

Start from the installed contract:

```javascript
const synth = require('ti.synthengine')
const contract = synth.getDefaults()
const WAVE = contract.waveTypes
```

Never hardcode waveform integers when `WAVE.SINE`, `WAVE.SQUARE`, `WAVE.SAWTOOTH`, `WAVE.TRIANGLE`, `WAVE.NOISE`, and `WAVE.WAVETABLE` are available.

- Option dictionaries are closed. Unknown or misspelled keys, wrong types, non-finite numbers, fractional values for integer fields, and out-of-range values make the entire call return `false`.
- `playTone()` takes at most one pitch source: `note` or `frequency`. If neither is supplied, it defaults to 440 Hz. Never send both.
- `playChord()` requires exactly one of `notes` or `frequencies`. It accepts `panSpread` or `pans`, the fixed shaping fields `noiseRate`, `lowPassHz`, `pulseWidth`, `waveTable`, and `bitDepth`, the fixed expressive fields `decay`, `sustain`, `filterType`, `filterHz`, `filterQ`, `fmRatio`, and `fmDepth`, and `detunes`, but no sweep, LFO, `detune`, or `*End` fields.
- Every sounding `playPattern()` step needs exactly one of `note` or `frequency`; a rest uses exactly `rest: true`. Even a `NOISE` step needs a pitch field, although noise ignores its value. Pattern roots do not accept `duration`. Step `duration` overrides musical timing and controls both voice length and timeline advance; `stepDuration` is only a fallback. Use explicit rest steps for silence between short notes. [source: references/api.md]
- `duration` includes attack, decay, the held level, and release. For timed calls with explicit envelopes, `attack < duration` and `release <= duration - attack`.
- For timed calls, `decay` (integer ms, 0 to 4000) and `sustain` (0 to 1) complete the ADSR envelope. `sustain` below 1 needs a `decay`. `attack + decay <= duration`, and the default 50 ms attack counts toward that budget. The release overlaps the decay and fades from wherever the level is.
- `filterType` is `none`, `lowpass`, `highpass` or `bandpass`. `filterHz` (20 Hz up to the frequency limit), `filterQ` (0.5 to 10) and `filterHzEnd` (0 or 20 Hz up, an exponential sweep) are rejected while no filter type is active. This filter is separate from, and runs after, the one-pole `lowPassHz`. A chord has no `filterHzEnd`.
- FM is `fmDepth` (modulation index, 0 to 10), `fmRatio` (0.1 to 16) and an optional `fmDepthEnd`; unlike the other `*End` keys, 0 is a real target, so omit the key for no sweep. Only `WAVE.SINE` can carry FM. Timed calls reject `fmRatio` when FM is off; held/sequence voices also allow zero base depth with an enabled `fmDepth` modulation slot.
- `detune` (cents, -1200 to 1200) works on `playTone` and `playPattern`. `playChord()` uses `detunes`, an array aligned with the pitches. The detuned pitch, and any `frequencyEnd` target, must stay inside the frequency limits.
- `patternend` is an event, not a method: unless shutdown discards it first, it fires once per accepted `playPattern()` with `{ completed: true }` at the natural end, or `{ completed: false }` when a newer pattern or native sequence replaces it. `stopAll()` and `shutdown()` fire nothing. Remove the listener when the owner closes.
- `spatialX` (left/right) and `spatialY` (below/above) are finite numbers from -1 to 1 on `playTone`, `playChord`, and `playPattern` roots/steps. Supplying either enables binaural processing, with 0 for the omitted coordinate; omitting both preserves stereo. A chord shares one fixed position. Never combine coordinates with `pan`, `panEnd`, `pans` or `panSpread`, even through pattern inheritance: the call returns `false` with `conflicting_spatial_fields`. [source: references/api.md]
- A binaural switch and percentage sliders belong to the app. For direct direction sliders, divide signed percentages from -100 to 100 by 100. For amplitude sliders from 0 to 100%, multiply each source's normalized coordinate by the percentage divided by 100; 100% height does not move every source above. Route every effect that should be spatial through that conversion, preserving its synthesis recipe, then send only the coordinates when enabled. When disabled, omit both coordinates; sending two zeros still enables binaural processing. The module has no separate switch option. Positions stay fixed for each event; later events can use updated coordinates. Test with stereo headphones and broadband sounds; the front plane has no rear sources, distance attenuation, room reflections or head tracking. [source: references/api.md]
- `pan` and `panEnd` range from -1 to 1. `frequencyEnd` accepts 0 through the frequency maximum; targets below 1 Hz disable the linear sweep. `lfoFreq` is the modulation rate in Hz and `lfoDepth` is absolute pitch deviation in Hz, not cents.
- `WAVE.WAVETABLE` requires `waveTable`: 2 to 64 finite values from -1 to 1, stepped without interpolation. `bitDepth` is 0 or an integer from 2 to 16; `pulseWidth` is 0.05 to 0.95 and only shapes `SQUARE`; `pulseWidthEnd` is 0 or 0.05 to 0.95. For `noiseRate`, `noiseRateEnd`, and `lowPassHz`, 0 means white noise, no sweep, or no filter.
- `startEngine()`, `playTone()`, `playChord()`, `playPattern()`, and `setVolume()` return `Boolean`; production code must handle rejection where it matters.
- `getStats()` returns a snapshot without resetting it; `resetStats()` returns nothing and does not stop playback. `setStatsEnabled(enabled)` accepts a Boolean and returns Boolean acceptance. Detect each method with `typeof synth.<method> === 'function'` when supporting older beta binaries. Basic occupancy/queue/rejection counters remain available with diagnostics off; optional render-load timing and output peak/RMS/limiter measurements default off. Android backend underrun/buffer/latency fields are best-effort and independent of that switch. Preserve `null` for unavailable or unmeasured fields: it is not zero. Poll slowly (for example, 5 Hz), cancel the timer with its owner and disable diagnostics when no owner needs them. Render load is callback elapsed work, not total app CPU; Android host comparisons do not establish iOS/device performance, physical underruns, heat or battery behavior. [source: references/api.md] [source: references/audio-engine.md] [source: references/stats-performance.md]
- Only one pattern can remain pending. A new pattern replaces future steps from the previous one. `stopAll()` fades active voices, stops the native sequence and invalidates effect histories; it does not cancel future `playPattern` steps. `shutdown()` cancels both schedulers and frees the stream.

## Acoustic decision guide

Use these as starting regions, then keep every explicit value inside the API limits and the envelope intersection:

| Intent | Starting design |
| --- | --- |
| Clean UI click or feedback | `SINE` or `TRIANGLE`, roughly 30–120 ms, 1–5 ms attack, short fitted release |
| Retro pickup or melody | `SQUARE`, short notes or a rising `playPattern()`; a narrow `pulseWidth` or a `pulseWidthEnd` sweep thins it, `bitDepth` adds grit |
| Retro bass | `TRIANGLE`, lower pitch, short attack and controlled release |
| Hit, hat, explosion texture | `NOISE`, immediate attack and short-to-medium release; lower `noiseRate` or `lowPassHz` darkens it; layer only when the overlap budget allows |
| Coarse DAC-like or buzzy custom voice | `WAVETABLE` with a short asymmetric `waveTable`, optionally with `bitDepth` |
| Alarm or urgent cue | `SAWTOOTH`, repeated pitches, a sweep, or vibrato around 4–7 Hz; use larger `lfoDepth` only for an obvious effect |
| Laser or sci-fi movement | One `frequency` plus `frequencyEnd`, short attack, fitted release, optional `pan` → `panEnd` |
| Headphone cue above/right or below/left | Use `spatialX`/`spatialY` on a broadband sound, without stereo pan fields; verify perceived direction with headphones |
| Pad or atmosphere | One `playChord()` with `SINE` or `TRIANGLE`, 2000 ms or longer, 300–600 ms attack, 800–1500 ms release when it fits |
| Plucked string, marimba or keyboard note | `TRIANGLE` or `SINE`, 2 ms attack, `decay` 120–400 ms, `sustain` 0 to 0.3, release that fits |
| Electric piano, bell or metallic hit | `SINE` with `fmDepth` that falls to `fmDepthEnd: 0`; `fmRatio` 1, 2 or 3.5 for tine-like tones, a non-integer ratio for bells; add `decay` and a low `sustain` |
| Wah, wind or filter sweep | `SAWTOOTH` or `NOISE` through `filterType: 'bandpass'` or `'lowpass'`, `filterHz` to `filterHzEnd`, `filterQ` 2 to 6 |
| Thick unison pad or supersaw | `playChord()` with the same pitch repeated and `detunes` of ±5 to ±12 cents; keep the gain staging in mind |

A4 is 440 Hz under twelve-tone equal temperament; each octave doubles or halves frequency. Upward sweeps tend to read as activation, reward, or energy gain; downward sweeps tend to read as dismissal, power-down, or impact. Treat pan as supporting detail because many phone speakers collapse the stereo image.

For playable controls, trigger one event when the finger enters a new key, not on every `touchmove`. For simultaneous musical voices, prefer one atomic `playChord()` call; use `detunes` (cents per pitch) when a layered sound needs beating. Cancel app-owned timers before stopping voices or shutting down the engine. [source: references/recipes.md]

## Mixing and lifecycle defaults

- Begin with `mixingProfile: 'conservative'`; use `balanced` mainly for one or two voices, `speakerSafe` for demanding small speakers, and `raw` only when the app owns gain staging.
- Size `maxVoices` for the largest real overlap, including release tails. Capacity is not loudness.
- On iOS, the default `audioSession: 'playback'` ignores the silent switch and interrupts other apps' audio. Pass `audioSession: 'ambient'` to `startEngine()` when a game should respect the switch and mix with other apps; Android validates the value and ignores it. Profile, voice count, and session are fixed until `shutdown()`.
- Use one engine owner. On a Titanium screen, start after layout settles and call `shutdown()` when the owner closes.
- Test on the actual output path. Headphones expose noise and stereo detail; small phone speakers expose weak bass, resonance, and acoustic distortion that a digital limiter cannot repair.

## Before returning code

- Re-read the exact method table in `references/api.md`; remove every unsupported property.
- Confirm pitch fields are mutually exclusive and numeric values are finite and in range.
- For timed calls, compute the envelope intersection explicitly, including `attack + decay <= duration`. Held voices have no duration budget; release them with `noteOff()`. Native sequence gates follow transport timing.
- Check the cross-field rules: `sustain` below 1 needs a `decay`, filter fields need a `filterType`; FM needs a sine and an active depth or supported FM-target LFO.
- Check installed spatial limits before using binaural coordinates; remove conflicting stereo fields at both pattern root and step. Omit coordinates when the app switch is off.
- Use `WAVE` constants from `getDefaults()`.
- Use `playChord()` for one simultaneous musical event instead of several hotter independent tones.
- Include startup and cleanup only at the ownership level relevant to the request.
- Cite the references that support the acoustic and API choices.

## Held voices, native transport and effects

- Read the [current API](references/api.md#noteonoptions) before writing held or processing code. Start the engine successfully first. Held, sequence-edit and processing methods return Boolean acceptance; applied sequence revisions can lag accepted edits.
- Allocate unique positive held IDs. Release on cancellation as well as normal key up; retry a rejected noteOff twice at 16 ms, then shut down/report if still rejected. Cancel retries during teardown. Ended/stolen IDs accept updates as no-ops.
- Use `playSequence` for up to 512 sixteenth steps, MIDI note arrays/chords, rests, gates, swing and arpeggios. Root voice shaping is in `voice`; step shaping is in `overrides`. `updateSequence` does not resume stopped playback. Structural edits enter next step; BPM next block; swing next pair. Inspect applied revision through `getSequenceState`.
- Timer `playPattern` and native `playSequence` cancel each other's future events. Replaced timer patterns emit completed:false; native completion/stop has no patternend. Keep UI position polling separate from audio timing.
- `setMasterProcessing` merges/validates partial configs. Initial `inputGain: 1` and disabled processors preserve default rendering. Chorus/delay/reverb drain on disable for at most 30 seconds; panic invalidates histories. Saturation is an explicit creative timbre change, never an automatic limiter substitute.
- Up to two sine/triangle LFOs on held/sequence voices target filterHz, pulseWidth or fmDepth with source validation. Free rates 0–20 Hz or native-tempo sync. These slots coexist with pitch vibrato. `modulations:[]` disables them, omission preserves them on update.
- Enable diagnostics deliberately; accumulated preLimiterPeakDb and maxLimiterReductionDb retain brief interventions since reset. Keep missing/null distinct from 0. Historical stats-only host measurements do not establish current full-chain device performance.
