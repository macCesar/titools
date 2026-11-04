> Source snapshot: official TiSynthEngine documentation at commit `9d74aa45f84d3f2822d4aab76874efe37d81257f` (2026-11-03). Published module 2.0.0. Upstream `documentation/sound-api.md` SHA-256: `bb7bfe10a63aba700bdd3584e803436852e07200b82798f5f16c83383687a546`.

# Sound objects: TiSynth 2.0.0

TiSynth 2.0.0 provides reusable sound definitions and independent playback controls on Android and iOS. `createSound()` allocates no voice. Its definition survives `shutdown()` and can play again after `start()`. Rendering, gain, admission limits and scheduling use the existing native tone, chord, held, repetition and sequence paths.

TiSynth uses one version: the installed module version. Both `getContract().version` and `getDefaults().version` report `2.0.0`. `getContract()` also describes `capabilities.soundObjects: true`, supported interpretations, property names and units.

## First sound

```javascript
const synth = require('ti.synthengine')
const contract = synth.getContract()
if (contract.version !== '2.0.0') throw new Error('Sound objects require TiSynth 2.0.0')
if (!synth.start({ maxVoices: 16, maxSequences: 4, mixingProfile: 'conservative', audioSession: 'ambient' })) {
  throw new Error('Audio startup rejected')
}
const bell = synth.createSound({
  name: 'Bell',
  sound: { waveType: contract.waveTypes.SINE, volume: 0.25, attack: 5, release: 120 },
  playback: { type: 'tone', notes: ['A4'], duration: 400 }
})
if (!bell.play()) throw new Error('Bell rejected')
bell.play({ notes: ['C5'], volume: 0.15 })
synth.setVolume(0.8)
synth.setTempo(110)
```

Run startup after the owning screen has settled, and call `shutdown()` when its audio owner closes. Keep the [lifecycle guidance](guide.md#lifecycle) and [voice budget](recommendations.md). A finite event's acceptance does not guarantee that a later higher-priority event will leave it sounding.

## Stored definitions and temporary overrides

A preset has optional `name`, `sound` and `playback` dictionaries. `sound` holds synthesis and routing; `playback` holds pitch and interpretation. `getPreset()` returns a detached copy, preserving whether `type` was authored or inferred. Inputs are copied too.

`Sound.set({ sound, playback })` recursively merges objects, replaces whole arrays and validates the complete result before replacing the stored definition. A failed change throws without partially applying it. `null` removes an optional leaf when the remaining preset is valid; it does not remove a whole `sound` or `playback` dictionary. Arrays, including `steps`, `notes`, `frequencies`, `waveTable`, `modulations` and variation ranges, replace the complete array; they do not concatenate. `set()` affects future executions; it does not edit controls already playing.

`Sound.play(changes)` and `Sound.noteOn(changes)` accept **flat** overrides, such as `{ notes: ['D4'], volume: 0.2 }`. They do not accept nested `{ sound, playback }` arguments. An execution never mutates the stored preset. Repetition and pattern updates also accept `null` to remove an optional leaf when the complete resulting revision is valid. Such resets replace the native recipe without restarting its transport or repetition deadline. Held-note updates require concrete live values; use supported disabling values such as zero or an empty modulation array. Setting `notes` replaces a previously stored `frequencies` source and vice versa; supplying both together throws.

```javascript
const sound = synth.createSound({
  sound: { volume: 0.3, pan: 0.2, variation: { amount: 1, ranges: { volume: [0.2, 0.3] } } },
  playback: { notes: ['C4'], duration: 300 }
})
sound.set({ sound: { pan: null, variation: { amount: 0.5 } } })
sound.set({ playback: { notes: ['D4'] } })
const preset = sound.getPreset()
// The volume range is retained; pan is absent; notes is now exactly ['D4'].
if (preset.sound.pan !== undefined || preset.playback.notes.length !== 1) throw new Error('Unexpected preset')
sound.play({ notes: ['E4'] })
```

Unknown keys, wrong types, incompatible fields and out-of-range values throw descriptive `TypeError`s before publication. Fields are never silently stripped to make a definition valid. Numeric ranges and waveform-dependent rules remain those in the [native reference](api.md#strict-validation). Operational failures, including an unavailable engine or a rejected publication, return `false`.

## Interpretations and returns

An explicit type on the call wins over the preset's declared type. If neither declares a type, `steps` infers a pattern, more than one pitch infers a chord, and otherwise a tone is inferred. Inference never writes a type into the stored preset. Repetition and held interpretation require an explicit type, or `noteOn()` for held execution.

| Type or method | Accepted return | Playback fields | Native path |
| --- | --- | --- | --- |
| `tone` | `true` | `notes` or `frequencies`, `duration`, `frequencyEnd` | One finite tone |
| `chord` | `true` | `notes` or `frequencies`, `duration` | Atomic finite chord, including an explicitly declared one-note chord |
| `repeat` | Repetition control | Single pitch, `duration`, `frequencyEnd`, required `interval` | Native finite-tone repetition |
| `pattern` | Pattern control | `steps`, `interval`, `timeUnit`, `gate`, `loop`, `swing`, `mode`, `tuning`, optional root `frequencyEnd` | Native sequence |
| `held` or `Sound.noteOn()` | Note control | Single pitch only | Existing sustained voice |

All executions can return `false` on operational rejection. Finite tones and chords expose no individual control or identifier. A declared type remains in force when pitches change: `type: 'tone'` with two notes throws; an explicit `type: 'chord'` with one note retains chord gain and admission behavior. Choosing another type does not discard incompatible preset fields: clear or replace them in the definition first.

Use either `notes` as note names or integer MIDI notes 12 through 119, or `frequencies` in hertz. Tone, held and repetition use one-element arrays. Chords use 1 through 32 pitches. Numeric pitches in finite/held calls convert to native note names; pattern pitches remain MIDI integers. Keep duplicate pitches when unison is intentional.

The shared sound-property allowlist below is not a promise that every field works for every interpretation. For example, finite-tone endpoints do not become held live controls; chord sweeps and chord modulations are rejected by their native validator. Source rules still require sine for FM, square for PWM, an active filter for filter targets, and compatible stereo or spatial controls. Use explicit `type: 'held'` when a definition contains held-only modulation or envelopes, so construction validates the intended native path.

## Held notes

```javascript
const heldSound = synth.createSound({
  sound: { waveType: 0, volume: 0.2, fmRatio: 2, fmDepth: 1, attack: 10, release: 160,
    modulations: [{ target: 'fmDepth', wave: 'sine', rate: 2, depth: 0.1 }] },
  playback: { type: 'held', notes: ['C4'] }
})
const note = heldSound.play()
if (note) {
  note.update({ notes: ['D4'], volume: 0.15, fmDepth: 0 })
  if (!note.noteOff()) throw new Error('Note release rejected; owner must retry or close audio')
}
const anotherNote = heldSound.noteOn({ notes: ['E4'] })
if (anotherNote) anotherNote.noteOff()
```

Each start returns an independent `{ update, noteOff }` control with private identity. No `voiceId` is accepted or exposed. `noteOn()` always uses the single-note held path, even when called on a finite preset; finite `playback.duration` and `playback.frequencyEnd` are not applied to that held execution. Incompatible synthesis leaves, such as `sound.panEnd`, still throw rather than being discarded. It accepts flat synthesis and live pitch overrides, not `type`, `duration` or `frequencyEnd`.

`Note.update()` accepts `notes` or `frequencies`, `volume`, `pan`, `lfoFreq`, `lfoDepth`, `noiseRate`, `lowPassHz`, `pulseWidth`, `filterHz`, `filterQ`, `fmRatio`, `fmDepth`, `spatialX`, `spatialY`, `effectSend` and `modulations`. Only compatible source controls can change; variation, waveform, attack/release, bus and priority are not live fields. Live FM depth can reach zero. Updates retain phase and envelope, using the existing native 10 ms transition. They validate the live patch without requiring attack-only settings again.

Release on touch cancellation, pause and owner teardown. A rejected release remains retryable; the [held ownership guidance](guide.md#hold-and-edit-a-voice) describes bounded recovery. After an accepted release, that control no longer updates or releases a second time. Ended or stolen voices retain the native no-op edit behavior while their control generation remains valid.

## Repetition

```javascript
const pulse = synth.createSound({
  sound: { waveType: 1, volume: 0.15, attack: 2, release: 40 },
  playback: { type: 'repeat', frequencies: [440], duration: 120, interval: 200 }
})
const repetition = pulse.play()
if (repetition) {
  repetition.update({ frequencies: [660], interval: 180 })
  repetition.stop()
}
```

A repetition exposes `{ update, stop }`. `interval` is integer milliseconds from 1 through 60000. Each attack retains finite-tone duration, envelope and sweep semantics. An update affects the next scheduled attack without moving its existing deadline; the edited interval controls the following gap. Already admitted attacks retain their original recipe. `stop()` cancels future attacks while admitted finite attacks finish. Repetition has no end event and uses its existing capacity independently of pattern slots. Shared voice admission still applies to each attack.

## Patterns

```javascript
const melody = synth.createSound({
  sound: { waveType: 3, volume: 0.2, attack: 5, release: 80, bus: 'music', priority: 2 },
  playback: { type: 'pattern', timeUnit: 'beats', interval: 0.25, loop: false,
    steps: [{ notes: ['C4'] }, { notes: [64], interval: 0.5, sound: { volume: 0.15 } },
      { rest: true }, { notes: [60, 64, 67], length: 0.4 }] }
})
const pattern = melody.play()
if (pattern) {
  pattern.addEventListener('end', event => {
    // event.reason is 'completed' or 'stopped'. Release and effects may remain audible.
    Ti.API.info(event.reason)
  })
  pattern.update({ swing: 0.1 })
  const state = pattern.getState()
  if (state) Ti.API.info(state.step)
  pattern.stop()
}
```

A pattern exposes `{ update, stop, getState, addEventListener, removeEventListener }`. The event name is `end`; its payload is `{ reason: 'completed' | 'stopped' }`, with no native identifier. A control receives completion at most once. `getState()` returns the existing applied transport state with `sequenceId` removed, or `null` when unavailable. Removing a listener requires the same function reference.

Root and per-step `interval` specify time until the next attack. `length` still controls sounding length; omitting it uses `gate`. A step contains exactly one of `notes`, `frequencies` or `rest: true`, with optional `interval`, `length`, `gate` and `sound`. Per-step `sound` supplies synthesis settings for that attack. Root `sound.detune` applies the pattern pitch rule. Root `playback.frequencyEnd` maps to the native voice endpoint, while a per-step endpoint belongs in `steps[i].sound.frequencyEnd`.

`timeUnit` is `beats` by default or `ms`, and stays fixed during playback. Root interval defaults to 0.25 beats or 100 ms. Patterns contain up to 512 steps and 32 pitches per sounding step, with the existing swing, mode, revision and capacity rules. Updates replace arrays and preserve native revision scheduling; they do not restart transport. Pattern `stop()` remains accepted before its native slot is retired. Coalesce replacements and wait for the owned control's `end` event before publishing the next score when capacity is occupied. An `end` event marks transport retirement, not audible silence: release and processing tails may continue.

## Units and processing

| Quantity | Unit and meaning |
| --- | --- |
| `sound.attack`, `decay`, `release` | Milliseconds in every interpretation |
| Tone, chord or repetition `playback.duration` | Total milliseconds including release, including the complete finite envelope |
| Tone or repetition `playback.frequencyEnd` | Hertz; native finite sweep endpoint |
| Repetition `playback.interval` | Integer milliseconds, independent of global tempo |
| Pattern root/step `interval` and step `length` | Beats or milliseconds according to the pattern's `timeUnit` |
| Pattern `frequencyEnd` | Hertz; native note-length sweep timing with release afterward |
| `setTempo(number)` | Beats per minute, 20 through 300 |
| `setProcessing().delay.time` | Milliseconds, 20 through 2000 |
| `setProcessing().reverb.decay` | Milliseconds, 200 through 8000 |

Finite and pattern envelopes are different native paths. Converting a finite total duration of 150 ms with 25 ms release to a millisecond pattern requires `length: 125` and `release: 25` to preserve that sounding lifetime; attack spacing is a separate `interval`. Do not replace grouped chords with independent tone starts or convert repetition into a sequence when preserving the original gain and envelope interpretation.

```javascript
synth.setProcessing({ inputGain: 1, applyTo: ['music'],
  delay: { enabled: true, time: 250, feedback: 0.25, mix: 0.1 },
  reverb: { enabled: true, decay: 1500, damping: 0.6, mix: 0.12 } })
synth.enableStats()
const statistics = synth.getStats()
synth.disableStats()
```

`setProcessing()` uses the shared effects chain and strict native validation. Supply delay `time` and reverb `decay` in milliseconds. The adapter converts them to native `timeMs` and seconds-based decay. Other chorus/delay/reverb/saturation, `inputGain` and `applyTo` fields retain the [processing reference](api.md#setmasterprocessingoptions) ranges and semantics.

`bus`, `effectSend` and `priority` belong to `sound`, including a step's `sound` where supported. Routes, sends, fixed per-event gain and chord grouping are unchanged. Sound creation does not enable diagnostics; use `enableStats()` and `disableStats()`, and retain unavailable readings as `null`.

## Lifetime and errors

A Sound is reusable across engine shutdown/start; a playback control is bound to the generation that created it. Shutdown invalidates old controls, which subsequently return `false` for updates/releases/stops and `null` for pattern state. They cannot affect a new execution or a reused app identifier. Stale completion/invalidation events cannot retire a new generation's pattern. Listener installation on an invalid pattern has no effect. `stopAll()` retains its global panic behavior; prefer an owned control for ordinary release or cancellation.

The [upgrade guide](upgrade-2.0.0.md) records method mappings and metadata changes. Global `setVolume()` and `setTempo()` return Boolean acceptance. Sound and `setProcessing()` reject invalid configurations with descriptive errors.

The [TypeScript declarations](../assets/index.d.ts) describe Sound definitions, controls and the supported direct methods. `Sound.play()` has a mixed return when the stored interpretation is not known at the call: narrow the result before calling a control method, or supply an explicit call `type`. Runtime validation remains authoritative for numeric ranges and combinations.

## Property allowlists

These are the shared structural allowlists reported by `getContract()`. Native interpretation-specific validators apply afterward; this table does not widen their compatibility rules.

### Sound properties

| Keys | Purpose |
| --- | --- |
| `attack`, `decay`, `sustain`, `release`, `volume`, `waveType` | Envelope, gain and source |
| `pan`, `panEnd`, `pans`, `panSpread`, `spatialX`, `spatialY` | Stereo or spatial placement |
| `lfoFreq`, `lfoDepth`, `noiseRate`, `noiseRateEnd`, `lowPassHz` | Vibrato and noise shaping |
| `pulseWidth`, `pulseWidthEnd`, `waveTable`, `bitDepth` | Wave shaping |
| `filterType`, `filterHz`, `filterHzEnd`, `filterQ` | Resonant filter |
| `fmRatio`, `fmDepth`, `fmDepthEnd`, `detune`, `detunes`, `modulations` | Pitch, FM and compatible LFOs |
| `bus`, `effectSend`, `priority`, `variation` | Routing, admission and native variation |

### Playback properties

| Keys | Purpose |
| --- | --- |
| `type`, `notes`, `frequencies`, `frequencyEnd`, `duration` | Interpretation, pitches and finite timing |
| `interval`, `timeUnit`, `steps`, `gate`, `loop`, `swing`, `mode`, `tuning` | Repetition or pattern scheduling |
