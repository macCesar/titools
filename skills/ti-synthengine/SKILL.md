---
name: ti-synthengine
description: "Use when a Titanium app declares ti.synthengine in tiapp.xml, imports require('ti.synthengine'), or needs TiSynth 2.0 createSound presets, play/noteOn controls, native repetitions or patterns, chords, ADSR, sweeps, FM, filters, noise, binaural spatialX/spatialY, attack variation, shared effects, gain staging or audio diagnostics. Also use for migrating direct playback calls to Sound objects, version metadata, processing units, TypeScript declarations and lifecycle cleanup. Not for audio-file decoding, sample streaming or unrelated synthesizers."
---

# ti.synthengine — sound design for Titanium

Translate the requested sound into practical JavaScript using **TiSynth 2.0.0** for Android and iOS. Explain the waveform, envelope, pitch/filter motion and placement briefly in the user's language. Prefer reusable Sound definitions and their independent playback controls for new code. Existing direct methods remain supported. [source: references/sound-api.md] [source: references/upgrade-2.0.0.md]

## Required workflow

Read the relevant reference before writing or reviewing code. Read the Sound contract for new code and the direct API for exact native limits. Do not infer valid combinations from a property list or TypeScript `number` alone.

| Task | Read first |
| --- | --- |
| Create reusable presets; play, hold, repeat, update or stop sounds | [Sound objects](references/sound-api.md) |
| Migrate existing calls, metadata or processing units | [Upgrade to 2.0](references/upgrade-2.0.0.md) |
| Install Android/iOS packages, initialize and own the engine | [Guide](references/guide.md) |
| Check exact fields, ranges, defaults and supported direct methods | [API](references/api.md) |
| Design a laser, instrument, reward, alarm or game motor | [Sound design](references/sound-design.md), [examples](references/examples.md) |
| Preserve a complete effect or adapt it into a playable instrument | [Instruments and effects](references/instruments-and-effects.md) |
| Retro cues, xylophone, memory pads, layered chords and interaction ownership | [Recipes](references/recipes.md), [interaction recipes](references/recipes-interaction.md) |
| Held movement, native scores, effects and modulation examples | [Advanced examples](references/advanced-examples.md) |
| Author bounded attack variation, amount, ranges and seeds | [Native variation](references/native-variation.md) |
| Choose voice capacity, headroom, spatial processing or diagnostics | [Recommendations](references/recommendations.md), [audio engine](references/audio-engine.md) |
| Diagnose rejection, silence, routes or platform differences | [Troubleshooting](references/troubleshooting.md), [source notes](references/source-notes.md) |
| Check TypeScript signatures and narrow playback returns | [Declarations](assets/index.d.ts), [Sound objects](references/sound-api.md) |
| Run the complete interactive example | [Example app](assets/example/README.md) |

Cite factual guidance with `[source: references/<file>.md]`. If the required reference cannot be read, mark the claim `FROM_MEMORY (unverified):` and do not invent option names.

## First sound

Reuse the project's existing engine owner. If none exists, start after the owning screen has settled and shut down when that owner closes. Download matching [Android 2.0.0](https://github.com/macCesar/TiSynthEngine/releases/tag/android-2.0.0) and [iOS 2.0.0](https://github.com/macCesar/TiSynthEngine/releases/tag/ios-2.0.0) packages and follow the guide's installation/rebuild steps. Requirements: Titanium SDK 13.2.0.GA+, Android compile API 35+, iOS 15+; the Apple package includes Mac Catalyst. [source: references/guide.md]

```javascript
const synth = require('ti.synthengine')
const contract = synth.getContract()
if (!synth.start({ maxVoices: 16, maxSequences: 4,
  mixingProfile: 'conservative', audioSession: 'ambient' })) {
  throw new Error('Audio startup rejected')
}
const bell = synth.createSound({
  sound: { waveType: contract.waveTypes.SINE, volume: 0.25, attack: 5, release: 120 },
  playback: { type: 'tone', notes: ['A4'], duration: 400 }
})
if (!bell.play()) throw new Error('Bell rejected')
bell.play({ notes: ['C5'], volume: 0.15 })
```

`getContract().version` and `getDefaults().version` report the installed module version. Use `getContract().waveTypes` for constants and check required capabilities. On iOS, `ambient` respects silent mode and mixes with other apps; the default `playback` session ignores silent mode. [source: references/sound-api.md] [source: references/api.md]

## Definitions and executions

- Store synthesis and routing in `sound`; store pitch, type and timing in `playback`. Pitch uses `notes` or `frequencies` arrays. When supplied, tone/held/repetition pitch arrays contain exactly one pitch; chords accept 1–32. [source: references/sound-api.md]
- `createSound()` starts no voice. `getPreset()` returns a detached copy. `Sound.set({ sound, playback })` recursively merges objects, replaces whole arrays and validates atomically for future executions. `null` removes an optional leaf if the result remains valid. Existing executions keep their revisions. [source: references/sound-api.md]
- `play(changes)` and `noteOn(changes)` take **flat** temporary overrides; they do not accept nested preset dictionaries. Switching between `notes` and `frequencies` replaces the previous pitch source. Supplying both throws. [source: references/sound-api.md]
- Explicit call type wins over the preset's declared type. Otherwise `steps` infers a pattern, multiple pitches infer a chord, and one pitch infers a tone. Repetition and held playback need an explicit type, or `noteOn()` for held execution. A type change does not discard incompatible fields. [source: references/sound-api.md]
- Invalid Sound configurations throw descriptive errors. Operational rejection returns `false`. Do not silently clamp values or retry malformed recipes. Direct methods retain their own return contracts. [source: references/sound-api.md]

## Playback and ownership

| Interpretation | Accepted result | Owner's responsibility |
| --- | --- | --- |
| `tone` / `chord` | `true` | Finite event finishes naturally; no per-event control |
| `held` / `noteOn()` | Note control | `update()` compatible live fields; `noteOff()` on release/cancel |
| `repeat` | Repetition control | `update()` future attacks; `stop()` future repetition |
| `pattern` | Pattern control | `update()`, `getState()`, `stop()`; own its `end` listener |

Every execution can return `false`; narrow the mixed result before calling control methods. Keep controls with the interaction that created them. Shutdown invalidates controls, while reusable definitions survive shutdown/start. Use `stopAll()` for global panic. [source: references/sound-api.md]

Release held notes on touch cancellation, pause and teardown. Rejected releases remain retryable; use the guide's bounded recovery policy. Accepted release retires that control. Compatible live edits preserve phase/envelope with native 10 ms transitions; waveform, variation, routing category and attack/release are not live note fields. [source: references/sound-api.md] [source: references/guide.md]

Repeats preserve the original finite renderer. Their integer `interval` is 1–60,000 ms and ignores tempo. Updates retain the next deadline; the new interval controls the following gap. `stop()` leaves already admitted attacks to finish. Patterns use the native clock, up to 512 steps and 1–4 configured slots. Coalesce replacement scores while capacity is occupied and wait for the owned control's `end` event. `{ reason: 'completed' | 'stopped' }` marks transport retirement; release and effect tails may remain audible. [source: references/sound-api.md]

## Timing, processing and sound fidelity

- Finite `duration` includes release; ADSR always uses milliseconds. Pattern root/step `interval` controls attack spacing and `length` controls sounding length, in beats or milliseconds according to `timeUnit`. Preserve those distinctions when adapting recipes. [source: references/sound-api.md]
- `setVolume(number)` and `setTempo(number)` return Boolean acceptance. Tempo is 20–300 BPM. `setProcessing()` uses milliseconds for both delay `time` and reverb `decay`; direct `setMasterProcessing()` retains seconds for reverb decay. Never copy its numeric decay unchanged into the new method. [source: references/upgrade-2.0.0.md]
- `sound.bus` selects `music`, `effects`, `ui` or `ambience`; processing `applyTo` selects categories, and explicit `effectSend` overrides that selection. There is one shared chain. Keep layer gains and grouped chord admission/compensation when translating effects. [source: references/sound-api.md] [source: references/instruments-and-effects.md]
- One engine shares up to 32 voices. Reserve overlap and release capacity; repeating attacks can be dropped under admission pressure. Higher priorities protect voices without per-category quotas. [source: references/api.md]
- Omit spatial coordinates for stereo; two zeros still enable binaural center. Spatial coordinates conflict with stereo pan fields. A held voice must start spatially to accept live position changes. Headphone localization varies by listener and spectrum. [source: references/guide.md]
- Native `sound.variation` samples bounded parameters once per admitted attack. Check capability/schema, source-dependent ranges and seed behavior; seeds reproduce parameter selection, not cross-platform noise PCM. Keep authored timing, envelopes and gains. [source: references/native-variation.md]

## Compatibility and diagnostics

Use [the upgrade guide](references/upgrade-2.0.0.md) when retaining direct `playTone`, `playChord`, `repeatTone`, sequence or positive-ID held methods. Their identifiers, event names and partial-update behavior remain distinct from Sound controls. Older binaries require method/capability detection; 1.0.2 lacks repetition and variation. Never send unsupported closed-dictionary keys, including disabled variation. [source: references/api.md] [source: references/native-variation.md]

Use `enableStats()` / `disableStats()` for optional diagnostics. Poll slowly, clear the owner's timer and preserve unavailable readings as `null`. Render load measures callback work relative to its deadline; it is not app CPU or listening acceptance. Check platform caveats before assuming identical envelopes or rejection counters. Listen on the target speaker/headphones before approving timbre. [source: references/audio-engine.md] [source: references/source-notes.md]

Use `ti-game` for native gameplay and `ti-game-assets` for related visual/audio asset preparation.
