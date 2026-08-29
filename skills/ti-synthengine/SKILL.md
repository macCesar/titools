---
name: ti-synthengine
description: "Use when a Titanium app declares ti.synthengine in tiapp.xml, imports require('ti.synthengine'), or asks for generated tones, chords, patterns, retro/game/UI sounds, alarms, sweeps, vibrato, envelopes, panning, gain staging, or troubleshooting with that native module. Covers Android and iOS contract 1.0.0. Do not use for audio-file playback, streaming music, or unrelated synthesizers."
---

# ti.synthengine — sound synthesis for Titanium SDK

Act as an audio engineer and mobile sound designer for the native `ti.synthengine` module. Translate an aesthetic request into acoustically reasoned JavaScript that uses only the module's public contract.

This skill is verified against TiSynthEngine **1.0.0** at commit **`6685b81` (2026-08-29)**. Android and iOS expose the same eight public methods, option contracts, defaults, limits, waveform constants, and validation behavior.

## Required workflow

Read the references relevant to the task before proposing code. Do not infer option names from Web Audio, another synthesizer, or general DSP libraries.

| Task | Read first |
| --- | --- |
| Any code using a public method, option, default, limit, or return value | [references/api.md](references/api.md) |
| Design a sound from an aesthetic description | [references/sound-design.md](references/sound-design.md), then [references/recipes.md](references/recipes.md) for a tuned starting point |
| Build retro/arcade effects, a playable instrument, memory pads, layered chords, timbre comparisons, or cancellable repetition | [references/recipes.md](references/recipes.md), plus [references/api.md](references/api.md) |
| Learn the official examples for tones, chords, tempo, patterns, noise, validation, startup, and cleanup | [references/examples.md](references/examples.md) |
| Install the module, start it safely, or manage screen/app cleanup | [references/guide.md](references/guide.md) |
| Choose a mixing profile, voice count, gain, latency strategy, or understand the signal path | [references/audio-engine.md](references/audio-engine.md), [references/recommendations.md](references/recommendations.md) |
| Diagnose `false`, silence, glitches, distortion, pattern replacement, or route changes | [references/troubleshooting.md](references/troubleshooting.md), [references/api.md](references/api.md) |

Cite factual guidance with `[source: references/<file>.md]`. If a relevant reference cannot be consulted, prefix the claim with `FROM_MEMORY (unverified):` instead of filling the gap silently.

## Response contract for sound requests

Answer in the user's language and use this order:

1. **Brief acoustic explanation.** Name the waveform, envelope, pitch movement or LFO, stereo movement, and why they create the requested perception.
2. **Safe initialization when needed.** If the surrounding code does not already own a running engine, show `require`, `getDefaults()`, a checked `startEngine()` call, and appropriate cleanup. For a screen startup, follow the post-layout lifecycle in the guide.
3. **Production JavaScript.** Return a focused, copyable block with short comments, exact option names, valid types and checked Boolean results.

If the request cannot be represented by this synthesizer—audio-file playback, indefinite loops, per-voice control, streaming, or sample-accurate composition—say so and recommend the appropriate kind of audio engine instead of inventing an API.

## Contract invariants

Start from the installed contract:

```javascript
var synth = require('ti.synthengine')
var contract = synth.getDefaults()
var WAVE = contract.waveTypes
```

Never hardcode waveform integers when `WAVE.SINE`, `WAVE.SQUARE`, `WAVE.SAWTOOTH`, `WAVE.TRIANGLE`, and `WAVE.NOISE` are available.

- Option dictionaries are closed. Unknown or misspelled keys, wrong types, non-finite numbers, fractional values for integer fields, and out-of-range values make the entire call return `false`.
- `playTone()` takes at most one pitch source: `note` or `frequency`. If neither is supplied, it defaults to 440 Hz. Never send both.
- `playChord()` requires exactly one of `notes` or `frequencies`. It accepts `panSpread` or `pans`, but no sweep or LFO fields.
- Every sounding `playPattern()` step needs exactly one of `note` or `frequency`; a rest uses exactly `rest: true`. Even a `NOISE` step needs a pitch field, although noise ignores its value. Pattern roots do not accept `duration`.
- `duration` includes attack, the full-level middle, and release. For explicit envelopes, `attack < duration` and `release <= duration - attack`.
- `pan` and `panEnd` range from -1 to 1. `frequencyEnd` is a linear sweep target. `lfoFreq` is the modulation rate in Hz and `lfoDepth` is absolute pitch deviation in Hz, not cents.
- `startEngine()`, `playTone()`, `playChord()`, `playPattern()`, and `setVolume()` return `Boolean`; production code must handle rejection where it matters.
- Only one pattern can remain pending. A new pattern replaces future steps from the previous one. `stopAll()` fades active voices but does not cancel scheduled steps; `shutdown()` does both and frees the stream.

## Acoustic decision guide

Use these as starting regions, then keep every explicit value inside the API limits and the envelope intersection:

| Intent | Starting design |
| --- | --- |
| Clean UI click or feedback | `SINE` or `TRIANGLE`, roughly 30–120 ms, 1–5 ms attack, short fitted release |
| Retro pickup or melody | `SQUARE`, short notes or a rising `playPattern()` |
| Retro bass | `TRIANGLE`, lower pitch, short attack and controlled release |
| Hit, hat, explosion texture | `NOISE`, immediate attack and short-to-medium release; layer only when the overlap budget allows |
| Alarm or urgent cue | `SAWTOOTH`, repeated pitches, a sweep, or vibrato around 4–7 Hz; use larger `lfoDepth` only for an obvious effect |
| Laser or sci-fi movement | One `frequency` plus `frequencyEnd`, short attack, fitted release, optional `pan` → `panEnd` |
| Pad or atmosphere | One `playChord()` with `SINE` or `TRIANGLE`, 2000 ms or longer, 300–600 ms attack, 800–1500 ms release when it fits |

A4 is 440 Hz under twelve-tone equal temperament; each octave doubles or halves frequency. Upward sweeps tend to read as activation, reward, or energy gain; downward sweeps tend to read as dismissal, power-down, or impact. Treat pan as supporting detail because many phone speakers collapse the stereo image.

For playable controls, trigger one event when the finger enters a new key, not on every `touchmove`. For simultaneous musical voices, prefer one atomic `playChord()` call; use small cent offsets in the generated frequency array when a layered sound needs beating because the module has no chord-detune option. Cancel app-owned timers before stopping voices or shutting down the engine. [source: references/recipes.md]

## Mixing and lifecycle defaults

- Begin with `mixingProfile: 'conservative'`; use `balanced` mainly for one or two voices, `speakerSafe` for demanding small speakers, and `raw` only when the app owns gain staging.
- Size `maxVoices` for the largest real overlap, including release tails. Capacity is not loudness.
- Use one engine owner. On a Titanium screen, start after layout settles and call `shutdown()` when the owner closes.
- Test on the actual output path. Headphones expose noise and stereo detail; small phone speakers expose weak bass, resonance, and acoustic distortion that a digital limiter cannot repair.

## Before returning code

- Re-read the exact method table in `references/api.md`; remove every unsupported property.
- Confirm pitch fields are mutually exclusive and numeric values are finite and in range.
- Compute the envelope intersection explicitly.
- Use `WAVE` constants from `getDefaults()`.
- Use `playChord()` for one simultaneous musical event instead of several hotter independent tones.
- Include startup and cleanup only at the ownership level relevant to the request.
- Cite the references that support the acoustic and API choices.
