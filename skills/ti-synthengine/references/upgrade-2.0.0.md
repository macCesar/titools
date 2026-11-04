> Source snapshot: official TiSynthEngine documentation at commit `9d74aa45f84d3f2822d4aab76874efe37d81257f` (2026-11-03). Published module 2.0.0. Upstream `documentation/upgrade-2.0.0.md` SHA-256: `d25459ad28ec6fea2e40796d09aa0d6348b0f2a177cd79e3ef223fbe3ae23172`.

# Upgrade to TiSynth 2.0.0

TiSynth 2.0.0 separates reusable sound definitions from playback. Existing direct methods remain supported with their signatures, return values, identifiers, events and behavior. Use Sound objects for new code.

| Direct call | Sound interface |
| --- | --- |
| `playTone(options)` | A tone definition followed by `sound.play()` |
| `playChord(options)` | A chord definition followed by `sound.play()` |
| `noteOn({ voiceId, ... })` | `sound.noteOn()` or a held definition's `play()` |
| `updateNote({ voiceId, ... })`, `noteOff({ voiceId })` | Returned note control's `update()` and `noteOff()` |
| `repeatTone`, `updateTone`, `stopTone` | A repeat definition's `play()`, then the control's `update()` and `stop()` |
| `playSequence`, `updateSequence`, `stopSequence`, `getSequenceState` | A pattern definition's `play()`, then the control's `update()`, `stop()` and `getState()` |
| Global `sequenceend` with a `sequenceId` | The pattern control's `end` event with `{ reason }` |
| `setMasterProcessing(options)` | `setProcessing(options)` with the units below |
| `setVolume({ volume })`, `setTempo({ bpm })` | `setVolume(number)`, `setTempo(number)` |

Put synthesis fields in `sound`. Put pitch arrays, type and timing in `playback`. Direct `note` and `frequency` become one-element `notes` and `frequencies` arrays. Execution overrides are flat; stored revisions use nested `{ sound, playback }` dictionaries.

## Names and units

- Repetition `intervalMs` becomes `playback.interval`, still integer milliseconds.
- Pattern `stepDuration` becomes root `playback.interval`. Step `duration` becomes step `interval`; both keep the declared `timeUnit`, which defaults to beats. Step `length` keeps its sounding-length meaning.
- Pattern `voice` becomes root `sound`; step `overrides` becomes step `sound`. Root sequence detune belongs in root `sound.detune`.
- Processing delay `timeMs` becomes `time`, still milliseconds. Reverb `decay` changes from seconds in `setMasterProcessing()` to milliseconds in `setProcessing()`; multiply the value by 1000.
- Finite `duration` still includes release. ADSR remains milliseconds. Converting a finite event into a pattern requires a deliberate length/gate conversion and can change sweeps or chord gain.
- Replace runtime metadata `apiVersion` reads with `version`. There is one installed module version.

`setProcessing()` accepts `timeMs` as an input alias for delay, but it cannot coexist with `time`. Reverb decay remains milliseconds in this method. The direct processing method retains its own units.

## Ownership and errors

Sound controls hide native playback identifiers. Keep each control with its owning interaction. Shutdown invalidates controls; reusable definitions survive it. Finite tones and chords return acceptance without a stop control.

Sound validation throws descriptive errors. Operational playback rejection returns `false`. Direct methods keep their existing return contracts. `Sound.set()` validates an atomic revision for future executions and leaves active executions unchanged.

The direct aliases `updateVoice` and `setStatsEnabled` remain supported. New code uses note controls and `enableStats()` / `disableStats()`.

The [Sound reference](sound-api.md) documents current use. The [validation report](https://github.com/macCesar/TiSynthEngine/blob/9d74aa45f84d3f2822d4aab76874efe37d81257f/documentation/sound-api-validation.md) records the comparison against the source baseline.
