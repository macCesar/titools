---
name: ti-synthengine
description: "Use when a Titanium app declares ti.synthengine in tiapp.xml, imports require('ti.synthengine'), or needs generated tones, chords, native sequences, sustained game motors, ADSR, sweeps, FM, resonant filters, noise, binaural spatialX/spatialY, held noteOn/noteOff/updateVoice, shared tempo, selective music/effects/ui/ambience processing, effectSend, priorities, chorus/delay/reverb/saturation, LFOs, sequenceend events, gain staging, statistics or render-load diagnosis. Covers the current Android/iOS 1.0.0 beta source contract. Not for audio-file decoding, sample streaming or unrelated synthesizers."
---

# ti.synthengine — native sound synthesis for Titanium

Act as an audio engineer and mobile sound designer. Translate the requested sound into acoustically reasoned JavaScript using the exact public contract.

These references describe the reviewed **1.0.0 beta at local commit `7ab31107302d9b7027a6359ba1a6fdb49c250407` (2026-10-23)**. Source hashes and the clean worktree fingerprint are in [source-snapshot.json](references/source-snapshot.json). Current [interactive example assets](assets/example/README.md) are bundled with both JavaScript helpers. This synchronization does not publish the module commit or a TiTools release. Old 1.0.0 binaries may expose a different beta API: require the current methods and rebuild with matching packages, rather than maintaining aliases or a second timer-based audio implementation.

## Required workflow

Read the relevant references before writing or reviewing code. When updating the module or its documentation, compare with both native platforms and the shared DSP before synchronizing these mirrors; a snapshot is not an independent correctness oracle.

| Task | Read first |
| --- | --- |
| Any public method, option, default, return value or limit | [API](references/api.md) |
| Initialize, install, own or clean up an engine | [Guide](references/guide.md) |
| Design an effect, instrument, reward, alarm or game motor | [Sound design](references/sound-design.md), [recipes](references/recipes.md), [examples](references/examples.md) |
| Hold, edit, release or position a sustained voice | [API](references/api.md#noteonoptions), [advanced examples](references/advanced-examples.md#sustained-game-motor) |
| Schedule simultaneous sequences, tempo, swing, edits and cancellation | [API transport](references/api.md#native-sequence-transport), [advanced examples](references/advanced-examples.md#native-sequence-with-chords-and-edits) |
| Select categories, sends, shared effects and synchronized LFOs | [Processing API](references/api.md#setmasterprocessingoptions), [engine](references/audio-engine.md), [advanced examples](references/advanced-examples.md) |
| Map headphone coordinates and stereo bypass | [Guide](references/guide.md#integrate-binaural-in-a-2d-app), [API](references/api.md) |
| Interpret gain, clipping, statistics or render performance | [Recommendations](references/recommendations.md), [statistics](references/stats-performance.md), [engine](references/audio-engine.md) |
| Diagnose rejection, silence, interruptions or glitches | [Troubleshooting](references/troubleshooting.md), [source notes](references/source-notes.md) |
| Audit provenance and acceptance boundaries | [Snapshot](references/source-snapshot.json), [source notes](references/source-notes.md), [historical Studio report](references/studio-validation.json), [physical evidence](references/physical-validation.json), [Frontier measurements](references/frontier-physical-validation.json) |

Cite factual guidance with `[source: references/<file>.md]`. If the relevant source cannot be read, prefix the claim with `FROM_MEMORY (unverified):`; do not invent Web Audio or other synthesizer option names.

## Response contract

Explain the waveform, envelope, pitch/filter motion and stereo choice briefly in the user's language. Include checked initialization if no engine owner exists, followed by focused production code. Comments and controls should explain meaningful sound choices. Obtain constants from the runtime:

```javascript
const synth = require('ti.synthengine')
const contract = synth.getDefaults()
const WAVE = contract.waveTypes
if (!synth.start({maxVoices: 32, maxSequences: 4,
  mixingProfile: 'conservative', audioSession: 'ambient'})) {
  throw new Error('Audio engine rejected startup')
}
```

Choose the actual required sequence capacity, 1–4; the snippet's four slots suit games with simultaneous music, effects and cues. One engine and render callback share up to 32 voices. Start after screen layout settles; the owning service/window shuts down on teardown. On iOS, `ambient` respects silent mode and mixes with other apps; `playback` is the default and ignores silent mode. Profile, voice/sequence capacity and session require shutdown before changing them. [source: references/api.md]

## Scheduling contract

- `playTone` is one timed event, `playChord` one simultaneous atomic chord, and `noteOn`/`noteOff`/`updateVoice` own sustained voices. `playSequence` is the only successive-sound scheduler. Do not add aliases or JavaScript note timers.
- `playSequence(options)` returns a positive identifier or `0`. `updateSequence({sequenceId,...changes})`, `stopSequence({sequenceId})` and `setTempo({bpm})` return Boolean acceptance. `getSequenceState({sequenceId})` returns applied revision/position or `null` for unknown/retired IDs. Acceptance can precede callback application.
- Sequence IDs do not repeat over module lifetime, including shutdown/start. Keep the accepted ID and cancel only the owner's sequence. An accepted stop does not immediately free capacity: coalesce replacement requests and publish the latest complete score after its matching `sequenceend`. A delayed event for an old ID must not change the new owner.
- `setTempo({bpm})` accepts 20–300, initially 120. It changes on the next block while conserving musical position. Synced delays/LFOs follow this tempo; free controls keep milliseconds/hertz.
- `timeUnit` is fixed for a sequence: `beats` by default, or `ms`. `stepDuration` defaults to 0.25 beats or 100 ms. `loop` defaults to false; circular Studio patterns explicitly pass true.
- Up to 512 steps each carry exactly one of MIDI `notes` (12–119), `frequencies`, or `rest:true`. Pitch arrays hold 1–32 values and permit duplicates for unison. Root shaping belongs in `voice`; per-step shaping belongs in `overrides`.
- Step `duration` changes the interval until the next attack. `gate`, initially 0.8, places release within that effective interval. Explicit `length` replaces gate and may overlap later attacks. Intervals and lengths follow the sequence time unit; ADSR remains in milliseconds without a sequence interval budget. Sweeps reach their target at note length and hold it during release.
- Swing −0.75…0.75 shifts `swing * min(A,B)` within a pair and preserves its total. Structural edits enter next step; swing next pair. Modes are normal/up/down/updown; rests participate only in normal mode.
- `sequenceend` carries `{sequenceId,reason:'completed'|'stopped'}` outside audio render. It does not establish audible silence: voice release and effect tails may remain.

Preserve migrated score timing deliberately: a former total envelope of 150 ms with 25 ms release becomes `length:125` in a millisecond sequence, with `release:25`. Keep onset intervals separate. [source: references/api.md]

## Voices, routes and continuous controls

`bus` selects `music`, `effects` (default), `ui` or `ambience`. `setMasterProcessing({applyTo:[...]})` selects processed categories, initially all four; an empty array selects none. An explicit `effectSend:0…1` overrides the category selection for that voice. There is one shared chorus/delay/reverb/saturation chain. Input gain and master volume remain global. Selected audio receives processing, rejoins dry audio, and passes one final limiter. Effects and saturation start disabled. Disable closes input and retains bounded tails up to 30 seconds; panic invalidates histories. [source: references/api.md]

Sustained IDs are positive app-owned integers. Release on key up, touch cancellation, pause and teardown. Handle rejected release by retrying twice at 16 ms, then shut down/report if it still fails. These retry timers are lifecycle/error recovery, not a musical clock. Ended/stolen IDs accept edits as no-ops. [source: references/api.md]

Compatible `updateVoice` fields include frequency, volume, vibrato, resonant filter targets, pulse width, FM, modulations, `noiseRate`, `lowPassHz`, stereo/spatial position and `effectSend`. Transitions take 10 ms and preserve phase, spatial history and the current envelope. `noiseRate:0` is white noise; `lowPassHz:0` bypasses its one-pole filter. Spatial updates require a voice started spatially; stereo `pan` applies to a stereo voice. Do not combine spatial coordinates with stereo pan fields. [source: references/api.md]

`priority:0…3`, initially 0, controls eligible replacement under the shared voice pool. Higher priorities remain protected. Chords are admitted or discarded completely; there are no reserved per-category quotas. Gain is fixed per event, with initial chord compensation. Starting unrelated voices does not normalize earlier voices. [source: references/api.md]

## Sound and validation rules

- Closed option dictionaries reject unknown keys, wrong types, non-finite/out-of-range values and fractional integer fields. Check acceptance at meaningful boundaries; never silently clamp native options.
- A tone uses at most one of note/frequency; a chord uses exactly one notes/frequencies array. Tone/chord note names differ from sequence MIDI integers.
- Timed tone/chord `duration` includes release: explicit attack must be shorter, release must fit after attack, and attack+decay must fit. `sustain < 1` requires decay. Held/sequence ADSR has its own documented rules.
- FM requires sine; enabled filter fields require a filter type. `fmDepthEnd:0` is a real target, so omit it to disable a sweep. Plain tone FM ratio requires active depth; held/sequence FM-target modulation can start at zero depth.
- WAVETABLE needs 2–64 samples in −1…1. `bitDepth` is 0 or integer 2–16. Pulse width shapes square voices. Read the exact discontinuous ranges and source rules in the API.
- Up to two native sine/triangle LFOs target filterHz, pulseWidth or fmDepth. Free rates and tempo sync are distinct. Empty modulations disables them; omission on update preserves them.
- Use noise for impacts/wind, square for retro rewards, triangle for bass/plucks, sine FM for bells/keys, and filtered saw/noise for moving textures. Keep gains modest enough for release overlap and coherent unison. Listen on the actual speaker/headphones before approving timbre.

Binaural coordinates span a headphone front plane. Omit both spatial keys to bypass; two zeros still enable binaural center. Map app percentages explicitly and preserve pitch/envelope recipes. Height perception depends on the listener and sound spectrum; output remains stereo without rear sources, room reflections or head tracking. [source: references/api.md]

Diagnostics are opt-in. Preserve unavailable/null readings; poll UI slowly and clean up its timer. Render load is callback work divided by deadline, not app CPU. Historical host reports, validator parity and hash equality do not establish current physical real-time or listening acceptance. Keep technical results and César's auditory acceptance separate. [source: references/audio-engine.md] [source: references/source-notes.md]

Use `ti-game` for native movement/physics and `ti-game-assets` for related visual/audio asset production. Audio scheduling remains in TiSynthEngine; do not change gameplay or install on physical devices without the task's authorization.
