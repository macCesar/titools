> Source snapshot: official TiSynthEngine 1.0.0 beta documentation from the reviewed source tree at `937e774db7c5a924c9162cf0bbd01cb546754231` (2026-10-22); implementation and documentation are committed. Upstream `documentation/api.md` SHA-256: `74be6e1dbd51caa72bb158606bd01eeb226d4008d242a0965ed61fc03e6785df`.

# API reference

Module id: `ti.synthengine`

Public API version: `1.0.0`

Android and iOS expose the same nineteen methods, one event, defaults, limits, waveform values and validation behavior. Option objects are strict: an unknown key is rejected with `unsupported_option`.

<!-- TOC-START -->
## Contents

- [Return values](#return-values)
- [`getDefaults()`](#getdefaults)
- [Limits](#limits)
- [`startEngine(options)`](#startengineoptions)
- [`noteOn(options)`](#noteonoptions)
- [`noteOff(options)`](#noteoffoptions)
- [`updateVoice(options)`](#updatevoiceoptions)
- [`playTone(options)`](#playtoneoptions)
- [Native sequence transport](#native-sequence-transport)
- [`setMasterProcessing(options)`](#setmasterprocessingoptions)
- [Additional voice modulation](#additional-voice-modulation)
- [`playChord(options)`](#playchordoptions)
- [`playPattern(options)`](#playpatternoptions)
- [Expressive controls](#expressive-controls)
- [`setVolume(options)`](#setvolumeoptions)
- [`stopAll()`](#stopall)
- [`shutdown()`](#shutdown)
- [`patternend` event](#patternend-event)
- [Strict validation](#strict-validation)
- [Binaural front-plane positioning](#binaural-front-plane-positioning)
- [`getStats()`](#getstats)
- [`setStatsEnabled(enabled)`](#setstatsenabledenabled)
- [`resetStats()`](#resetstats)

<!-- TOC-END -->

## Return values

`startEngine`, `playTone`, `playChord`, `playPattern`, `noteOn`, `noteOff`, `updateVoice`, `setVolume`, `playSequence`, `updateSequence`, `stopSequence` and `setMasterProcessing` return a Boolean. `true` means the request was accepted. `false` means validation failed, the engine was unavailable, or the native command queue was full.

`setStatsEnabled` also returns Boolean acceptance. `stopAll`, `resetStats` and `shutdown` do not return a value. `getDefaults` returns the contract object described below. `getStats` returns a new statistics snapshot.

## `getDefaults()`

Returns the installed contract without starting the audio stream.

```javascript
var contract = synth.getDefaults()
```

The result has this shape:

```javascript
{
  apiVersion: '1.0.0',
  defaults: {
    maxVoices: 8,
    mixingProfile: 'conservative',
    audioSession: 'playback',
    frequency: 440,
    duration: 500,
    attack: 50,
    release: 50,
    volume: 1,
    waveType: 0,
    pan: 0,
    panEnd: 0,
    frequencyEnd: 0,
    lfoFreq: 0,
    lfoDepth: 0,
    noiseRate: 0,
    noiseRateEnd: 0,
    lowPassHz: 0,
    pulseWidth: 0.5,
    pulseWidthEnd: 0,
    waveTable: [],
    bitDepth: 0,
    panSpread: 0,
    bpm: 120,
    swing: 0,
    stepDuration: 100,
    decay: 0,
    sustain: 1,
    filterType: 'none',
    filterHz: 1000,
    filterHzEnd: 0,
    filterQ: 0.7071,
    fmRatio: 1,
    fmDepth: 0,
    detune: 0
  },
  limits: { /* ranges listed below */ },
  mixingProfiles: ['conservative', 'raw', 'balanced', 'speakerSafe'],
  audioSessions: ['playback', 'ambient'],
  filterTypes: ['none', 'lowpass', 'highpass', 'bandpass'],
  waveTypes: {
    SINE: 0,
    SQUARE: 1,
    SAWTOOTH: 2,
    TRIANGLE: 3,
    NOISE: 4,
    WAVETABLE: 5
  }
}
```

`fmDepthEnd`, `detunes`, `spatialX` and `spatialY` have no reported default: their presence changes how the call is interpreted. Supplying a spatial coordinate enables binaural; the other coordinate then defaults to 0 internally. The maximum frequency is `sampleRate * 0.45`. Before the stream opens, the reported fallback is 19,845 Hz. Read the object again after `startEngine()` if the precise device limit matters.

## Limits

All ranges include their endpoints. `getDefaults().limits` uses `{ min, max }` objects. Sweep targets and array elements share the corresponding base range: `panEnd`/`pans[]` use `pan`, `frequencyEnd` accepts 0 through the frequency maximum, but only targets of at least 1 Hz enable a sweep (values below 1 disable it), `noiseRateEnd` uses `noiseRate`, `filterHzEnd` uses `filterHz` plus disabled value 0, `fmDepthEnd` uses `fmDepth`, and `detunes[]` uses `detune`. The sample-count key is `waveTableSamples`; there is no `limits.waveTable` object.

| Field                       |   Minimum |             Maximum | Unit or rule                                                              |
| --------------------------- | --------: | ------------------: | ------------------------------------------------------------------------- |
| `maxVoices`                 |         1 |                  32 | integer voices                                                            |
| `frequency`                 |         1 | `sampleRate * 0.45` | Hz                                                                        |
| `duration`                  |         1 |              60,000 | integer ms, including explicit pattern step duration                      |
| `attack`                    |         0 |               2,000 | integer ms; must be less than duration                                    |
| `release`                   |         0 |               4,000 | integer ms; must fit after attack                                         |
| `volume`                    |         0 |                   2 | event or master multiplier                                                |
| `waveType`                  |         0 |                   5 | integer waveform value                                                    |
| `patternSteps`              |         1 |                 512 | object steps                                                              |
| `pan`, `panEnd`, `pans[]`   |        -1 |                   1 | left to right                                                             |
| `spatialX`, `spatialY`      |        -1 |                   1 | fixed binaural direction; omitted unless enabled                          |
| `panSpread`                 |         0 |                   1 | chord stereo width                                                        |
| `frequencyEnd`              |         0 | `sampleRate * 0.45` | Hz; values below 1 disable the sweep                                      |
| `lfoFreq`                   |         0 |              20,000 | Hz; 0 disables vibrato                                                    |
| `lfoDepth`                  |         0 |              20,000 | Hz                                                                        |
| `noiseRate`, `noiseRateEnd` |         0 | `sampleRate * 0.45` | Hz; 0 selects white noise or disables the sweep                           |
| `lowPassHz`                 |         0 | `sampleRate * 0.45` | Hz; 0 disables the filter                                                 |
| `pulseWidth`                |      0.05 |                0.95 | fraction of a square-wave cycle                                           |
| `pulseWidthEnd`             | 0 or 0.05 |                0.95 | 0 disables the sweep                                                      |
| `waveTable`                 | 2 samples |          64 samples | each value must be from -1 to 1; count range is `limits.waveTableSamples` |
| `bitDepth`                  |    0 or 2 |                  16 | integer bits; 0 disables quantization                                     |
| `bpm`                       |        20 |                 300 | beats per minute                                                          |
| `swing`                     |     -0.49 |                0.49 | alternating timing offset                                                 |
| `stepDuration`              |         1 |              60,000 | ms                                                                        |
| `decay`                     |         0 |               4,000 | integer ms; `attack` plus `decay` must fit in the event                   |
| `sustain`                   |         0 |                   1 | level held after the decay                                                |
| `filterHz`                  |        20 | `sampleRate * 0.45` | Hz                                                                        |
| `filterHzEnd`               |   0 or 20 | `sampleRate * 0.45` | Hz; 0 disables the sweep                                                  |
| `filterQ`                   |       0.5 |                  10 | resonance                                                                 |
| `fmRatio`                   |       0.1 |                  16 | modulator frequency divided by carrier frequency                          |
| `fmDepth`, `fmDepthEnd`     |         0 |                  10 | modulation index in radians                                               |
| `detune`, `detunes[]`       |     -1200 |                1200 | cents                                                                     |

The allowed `noteValue` strings are `1n`, `2n`, `4n`, `8n` and `16n`, the dotted values `2n.`, `4n.` and `8n.`, and the triplets `8t` and `16t`. A dotted value lasts one and a half times as long as the plain one. Three triplet steps fit in the time of two plain steps of the same name. Any other length is set in milliseconds with `duration` or `stepDuration`.

## `startEngine(options)`

Starts the native stream. Calling it again while the engine is running returns `true` without rebuilding the stream.

| Key             | Type    | Default        | Description                                                                                                                              |
| --------------- | ------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `maxVoices`     | integer | `8`            | Size of the voice pool, from 1 to 32.                                                                                                    |
| `mixingProfile` | string  | `conservative` | `conservative`, `balanced`, `speakerSafe` or `raw`. Matching is case-insensitive.                                                        |
| `audioSession`  | string  | `playback`     | iOS session category: `playback` or `ambient`. Matching is case-insensitive. Android validates the value and does not change its output. |

Options are validated even when the engine is already running; a second call with invalid options still returns `false`.

The profile, voice capacity and audio session stay fixed for the session. Call `shutdown()` before starting again with different values.

On iOS, `playback` ignores the silent switch and interrupts other apps' audio. `ambient` is muted by the silent switch and mixes with other apps' audio. The module applies the category again when it resumes after a route change.

## `noteOn(options)`

Starts a sustained native voice. Detect `typeof synth.noteOn === 'function'`, `noteOff` and `updateVoice` before using these beta capabilities; `apiVersion` remains `1.0.0`. There is no duration limit and no JavaScript timer holds the note.

| Field | Rule |
| --- | --- |
| `voiceId` | Required positive integer, 1-2,147,483,647, supplied by the app. |
| `frequency`, `note` | Optional mutually exclusive pitch; default 440 Hz, same ranges as playTone. |
| `attack`, `decay`, `sustain`, `release` | ADSR configuration for this attack; release begins only on noteOff. Same individual ranges as playTone, without a duration budget. |
| `volume` | Initial voice level, 0-2; default 1. |
| `waveType` | One of the six waveTypes; fixed for this attack. |
| `pan` | Fixed stereo position, −1…1. Conflicts with spatial coordinates. |
| `lfoFreq`, `lfoDepth` | Initial vibrato, 0-20,000 Hz; default 0. |
| `noiseRate`, `lowPassHz` | Fixed noise clock / one-pole cutoff, 0 through the frequency maximum; default 0. |
| `pulseWidth` | Initial square-wave duty cycle, 0.05-0.95; default 0.5. |
| `waveTable` | Fixed table of 2-64 samples in −1…1; required for WAVETABLE. |
| `bitDepth` | Fixed amplitude quantization, 0 or integer 2-16; default 0. |
| `filterType` | Fixed none/lowpass/highpass/bandpass; default none. |
| `filterHz`, `filterQ` | Initial cutoff and Q; a non-none filter type is required. |
| `fmRatio`, `fmDepth` | Initial sine FM; same rules and ranges as playTone. |
| `detune` | Initial pitch offset in cents, −1200…1200; default 0. |
| `spatialX`, `spatialY` | Fixed binaural position in −1…1; omitted for stereo. |
| `modulations` | Up to two native LFOs; see Additional voice modulation. |

No `duration` or temporal `*End` targets are accepted. Source, table, filter type, position and envelope configuration remain fixed until the next attack. Other initial defaults and cross-field validation rules match `playTone`.

Sustained voices apply a minimum 3 ms attack and release edge to prevent a hard gate when the requested time is 0-2 ms. Longer ADSR times are unchanged. Timed tones and patterns retain their existing envelope behavior.

The app supplies IDs and should never reuse one during its session. Reusing an active ID explicitly replaces that attack, snapshots a 6 ms fade tail and uses at least 6 ms attack for the replacement. With a full pool, release voices are replaced first, then the oldest attack. Timed-only events retain their existing replacement policy and sound. A former ID cannot control its replacement.

Repeating a public sustained note can inherit the oscillator phase and pre-envelope filter history of the newest compatible note still releasing at the same pitch. This prevents a fresh phase reset from cancelling its release tail. Each note keeps its own ID, envelope, gain and release. Compatibility requires stable matching oscillator, vibrato and filter settings; changing parameters or the two optional LFOs retain independent starts. Simultaneously held unisons, native transport notes and timed calls retain their existing phase policy.

## `noteOff(options)`

| Field | Rule |
| --- | --- |
| `voiceId` | Required positive integer, 1-2,147,483,647. |

Begins release from the current level, including during attack or decay. Repeated release requests never restart or lengthen a release. An ended or stolen ID is a no-op. `true` reports validation and queue publication, not proof of an audible voice. On `false` from a full queue, an instrument should retry twice at 16 ms intervals, then shut down and report failure if release still cannot be published.

## `updateVoice(options)`

| Field | Rule |
| --- | --- |
| `voiceId` | Required positive integer, 1-2,147,483,647. |
| `frequency`, `note` | Mutually exclusive target pitch. Same frequency/note ranges as playTone. |
| `volume` | Target voice level, 0-2. |
| `filterHz`, `filterQ` | Target cutoff/Q; only for a voice that started with a resonant filter. |
| `lfoFreq`, `lfoDepth` | Target vibrato rate/deviation, 0-20,000 Hz. |
| `pulseWidth` | Target duty cycle, 0.05-0.95; only for a square voice. |
| `fmRatio`, `fmDepth` | Target FM ratio 0.1-16 / depth 0-10; only for a sine voice. |
| `modulations` | Replace up to two native LFOs; empty array disables them while preserving phase. |

At least one change is required. An incompatible change rejects the entire request when the ID is known; unknown/ended IDs accept publication as a no-op. The callback also checks source compatibility before applying a command. Changed continuous parameters ramp linearly from their current values over 10 ms. New targets retarget that ramp without restarting oscillator phase or the envelope. Unchanged parameters retain their current ramps. This also works during release.

Pitch updates are absolute: an initial `detune` is already included in the note's starting frequency. To edit tuning later, compute the desired effective frequency in the app and send `frequency`. There is no `detune` update field. Filter type, ADSR, noise clock, one-pole cutoff, quantization, stereo/binaural position and table are new-attack configuration; they are not active-voice update fields.

```javascript
if (typeof synth.noteOn !== 'function' || typeof synth.noteOff !== 'function' ||
    typeof synth.updateVoice !== 'function') throw new Error('Sustained voices unavailable')
if (!synth.noteOn({ voiceId: 1, note: 'C4', attack: 8, decay: 180, sustain: 0.6,
  release: 300, filterType: 'lowpass', filterHz: 1200, volume: 0.25 })) {
  throw new Error('Note rejected')
}
synth.updateVoice({ voiceId: 1, filterHz: 3600 })
synth.noteOff({ voiceId: 1 })
```

Panic, owner close and background transitions should cancel app scheduling and call `shutdown()`. `stopAll()` fades current voices but does not cancel future pattern steps. The single app scheduler must own cancellation and release retries.


## `playTone(options)`

Plays one pitch. It uses 440 Hz when neither pitch field is present. Note names accept C through B or DO, RE, MI, FA, SOL, LA, SI and TI, followed by optional `#` or lowercase `b` and one octave digit from 0 to 9. Letters are case-insensitive, the omitted octave is 4, and A4 is 440 Hz. A valid named pitch is limited to the active frequency ceiling when rendered; an out-of-range numeric `frequency` is rejected.

| Key             | Type     |       Default | Description                                                                                |
| --------------- | -------- | ------------: | ------------------------------------------------------------------------------------------ |
| `frequency`     | number   |         `440` | Starting frequency in Hz. Cannot be combined with `note`.                                  |
| `note`          | string   |          none | Note name. Cannot be combined with `frequency`.                                            |
| `duration`      | integer  |         `500` | Total event length in ms.                                                                  |
| `attack`        | integer  |          `50` | Fade-in time in ms.                                                                        |
| `release`       | integer  |          `50` | Fade-out time in ms.                                                                       |
| `volume`        | number   |           `1` | Event level multiplier.                                                                    |
| `waveType`      | integer  |        `SINE` | One of the six waveform values.                                                            |
| `pan`           | number   |           `0` | Starting stereo position.                                                                  |
| `panEnd`        | number   | same as `pan` | Ending stereo position; omission keeps the position fixed.                                 |
| `frequencyEnd`  | number   |           `0` | Ending frequency; values below 1 keep the starting pitch.                                  |
| `lfoFreq`       | number   |           `0` | Vibrato rate in Hz.                                                                        |
| `lfoDepth`      | number   |           `0` | Vibrato depth in Hz.                                                                       |
| `noiseRate`     | number   |           `0` | Noise update rate; 0 produces a fresh value per sample.                                    |
| `noiseRateEnd`  | number   |           `0` | Ending noise update rate; 0 disables the sweep.                                            |
| `lowPassHz`     | number   |           `0` | Per-voice low-pass cutoff; 0 bypasses it.                                                  |
| `pulseWidth`    | number   |         `0.5` | Duty cycle for `SQUARE`.                                                                   |
| `pulseWidthEnd` | number   |           `0` | Ending duty cycle; 0 disables the sweep.                                                   |
| `waveTable`     | number[] |          none | Required for `WAVETABLE`; 2 to 64 normalized samples.                                      |
| `bitDepth`      | integer  |           `0` | Amplitude quantization from 2 to 16 bits; 0 disables it.                                   |
| `decay`         | integer  |           `0` | Milliseconds to fall from full level to `sustain` after the attack.                        |
| `sustain`       | number   |           `1` | Level held after the decay, from 0 to 1.                                                   |
| `filterType`    | string   |        `none` | `none`, `lowpass`, `highpass` or `bandpass`. Case-insensitive.                             |
| `filterHz`      | number   |        `1000` | Cutoff, or center for `bandpass`, in Hz.                                                   |
| `filterHzEnd`   | number   |           `0` | Ending cutoff; 0 disables the sweep.                                                       |
| `filterQ`       | number   |      `0.7071` | Resonance, from 0.5 to 10.                                                                 |
| `fmRatio`       | number   |           `1` | Modulator frequency as a multiple of the carrier.                                          |
| `fmDepth`       | number   |           `0` | Modulation index; 0 leaves FM off unless `fmDepthEnd` is set.                              |
| `fmDepthEnd`    | number   |          none | Ending index. Omit it for no sweep; 0 is a valid target.                                   |
| `detune`        | number   |           `0` | Pitch offset in cents, applied to `frequency` and `frequencyEnd`.                          |
| `spatialX`      | number   |       omitted | Fixed left/right binaural direction; see [positioning](#binaural-front-plane-positioning). |
| `spatialY`      | number   |       omitted | Fixed below/above binaural direction.                                                      |

Omitted attack/release values are shortened to fit an event smaller than the default envelope. Explicit values must satisfy the documented envelope rules. `getDefaults()` reports the baseline defaults, not these per-event adjustments.

The controls from `decay` to `detune` are described in [Expressive controls](#expressive-controls), including the rules that tie them together.

## Native sequence transport

Detect `playSequence`, `updateSequence`, `stopSequence` and `getSequenceState` by method presence; beta `apiVersion` remains `1.0.0`. The audio callback advances this transport in samples. JavaScript publishes edits and may poll position, without scheduling notes or releases. The older `playPattern` retains its timer-based contract.

`playSequence(options)` starts at the beginning of the traversal. `updateSequence(changes)` merges root fields and the `voice` dictionary into the last accepted configuration; `steps` replaces the complete step list. Both return Boolean publication acceptance, before audio applies the revision. Validation, bank exhaustion or a full publication mailbox reject the whole edit. Three preallocated banks keep the callback free of allocation and locks. Retry rejected edits outside the callback. Start the engine successfully before using these publication methods. `playSequence` resets position and releases the previous transport generation, preserving keyboard-held voices. `updateSequence` does not start or resume a stopped transport.

| Root field | Rule |
| --- | --- |
| `steps` | Required on play, 1-512 step objects. |
| `bpm` | 20-300, default 120. Applied at the next audio block without resetting musical position or scheduled gates. |
| `swing` | -0.75-0.75, default 0; positive values lengthen the first sixteenth and shorten the second by the same fraction, negative values reverse that pair. Changes begin at the next pair. |
| `loop` | Boolean, default true. False stops after one traversal and releases transport voices. |
| `mode` | `normal`, `up`, `down`, `updown`; default normal. Arpeggios sort sounding steps by their first MIDI note; rests participate only in normal mode. Updown does not repeat endpoints. |
| `tuning`, `detune` | A4 in Hz, 220-880 (default 440); cents −1200-1200 (default 0). Every effective pitch is checked against the current frequency limit. |
| `voice` | Initial noteOn shaping options, excluding voiceId, note, frequency and detune. Source, ADSR, stereo/binaural position and table apply to new attacks. |

Each step has either `notes` (1-32 integer MIDI values, 12-119, duplicates allowed) or `rest: true`. `gate` is 0.01-1, default 0.8, of that swung sixteenth. Optional `overrides` merges voice shaping over the root voice. Chords on sequence steps are independent of the keyboard's chord mode. A chord receives fixed initial event compensation; adding independent notes does not change existing gains.

When a voice edit changes `filterType` to `none`, inherited `filterHz`/`filterQ` are removed. A non-sine source clears inherited FM fields; changing to stereo placement clears inherited spatial coordinates, and spatial placement clears inherited pan. Incompatible inherited `modulations` must still be replaced or cleared explicitly with `[]`. This merge behavior does not permit unsupported noteOn fields.

Structural edits apply at the next step. Compatible continuous voice parameters use 10 ms ramps without restarting phases. Shortened loops wrap their cursor into the new traversal. Starting `playPattern` stops future transport events; starting `playSequence` cancels future pattern events. Existing releases are preserved. Transport and keyboard share the configured voice pool, at most 32 voices, with the sustained-note stealing policy.

`stopSequence()` returns Boolean and releases only transport-owned voices at the next block. Gates are owned by voice slots and execute without using the public command queue, even when that queue is full. `getSequenceState()` returns `{ playing, step, beat, position, bpm, revision }`; step is the original zero-based step index (−1 before the first step), beat/position count quarter notes, and revision identifies the applied configuration. Polling does not alter timing. Native completion and stopping emit no `patternend`; that event belongs only to `playPattern`.

### `playSequence(options)`

Publish the root/step fields above and start at the beginning of the traversal; `steps` is required. Returns Boolean acceptance. A new accepted play cancels future `playPattern` events and reports `completed: false` for the replaced timer pattern.

### `updateSequence(changes)`

Publish any supported root/configuration fields; supplied `steps` replaces the complete list. Returns Boolean acceptance of the merged edit. It does not restart playback.

### `stopSequence()`

Returns Boolean publication acceptance, releasing only native transport voices when applied. Handle rejection or use owner shutdown when all scheduling must end.

### `getSequenceState()`

Returns the state object above without starting playback or changing timing. The `revision` is the configuration applied by audio, not merely the last accepted publication.

```javascript
if (typeof synth.playSequence !== 'function') throw new Error('Native transport unavailable')
if (!synth.playSequence({ bpm: 120, loop: true, voice: { volume: 0.2 },
  steps: [{ notes: [60, 64, 67], gate: 0.7 }, { rest: true }, { notes: [67] }] })) {
  throw new Error('Sequence rejected')
}
synth.updateSequence({ bpm: 137 })
// UI polling may read synth.getSequenceState(); music continues without it.
synth.stopSequence()
```

## `setMasterProcessing(options)`

Native stereo chain: voices → fixed input gain → chorus → ping-pong delay → reverb → master volume → optional saturation → final lookahead limiter. Independent notes never trigger voice-count normalization. The limiter remains the final protection.

Requires a running engine and returns Boolean acceptance. Partial updates merge into the last accepted processing configuration, validate the complete result and publish atomically. Continuous controls ramp over 10 ms. Unknown fields, numeric booleans and non-finite values reject the whole edit. Detect method presence before use.

| Section | Fields and initial values |
| --- | --- |
| Root | `inputGain`: 0-4, initially 1. |
| `chorus` | `enabled`: false; `rate`: 0.05-5 Hz, initially 0.8; `depth`: 0-1, initially 0.4; `mix`: 0-1, initially 0.25. Stereo interpolated delay with offset modulation phases. |
| `delay` | `enabled`: false; `timeMs`: 20-2000, initially 250; `sync`: off; `feedback`: 0-0.85, initially 0.3; `mix`: 0-1, initially 0.25. Ping-pong feedback and crossfade between changed read positions, up to four seconds reserved. |
| `reverb` | `enabled`: false; `decay`: 0.2-8 seconds, initially 1.5; `damping`: 0-1, initially 0.5; `mix`: 0-1, initially 0.2. Stereo damped comb/allpass Schroeder network. |
| `saturation` | `enabled`: false; `drive`: 1-4, initially 1; `mix`: 0-1, initially 1. Creative soft waveshaping that changes timbre. |

Delay sync accepts `off`, `quarter`, `eighth`, `sixteenth`, `quarterTriplet`, `eighthTriplet` or `sixteenthTriplet`. Sync follows the native transport BPM, initially 120. Disabling an effect gradually closes its input and drains its tail, then restores exact bypass. Tails are bounded to 30 seconds with a final fade. `stopAll()` performs panic: it fades voices, stops the new transport and invalidates effect histories in bounded work. It retains the behavior of not canceling future playPattern timer events. `shutdown()` cancels both schedulers and frees buffers off the callback.

Processing applies to the shared stereo master bus, including simultaneous timed tones and held/transport voices. There are no per-voice sends or separate music/effects buses. Delay synchronization follows native transport BPM, not `playPattern` tempo.

Defaults keep all effects and saturation disabled, input gain at unity, and preserve the earlier render exactly. Enabling saturation is an explicit sound-design choice. Output protection is still required with dense voices and effect feedback.

## Additional voice modulation

`noteOn` and `updateVoice` accept `modulations`, an array of up to two LFO objects. An empty array disables them. Omission on update preserves the previous configuration. Each object accepts only these fields:

| Field | Rule |
| --- | --- |
| `wave` | `sine` (default) or `triangle`. |
| `target` | Required: `filterHz`, `pulseWidth` or `fmDepth`. Requires an active resonant filter, square source or sine source respectively. An explicit FM ratio with zero base depth is permitted when an FM-target LFO is enabled. |
| `rate` | 0-20 Hz, default 1. Zero permits a stationary free-running phase. |
| `depth` | 0-1, default 0; scales up to four cutoff octaves, 0.45 PWM offset or ten FM-index units. Two contributions sum with safe clamping. |
| `sync` | Same musical values as delay; default off. Synced rates follow native tempo (up to 30 Hz at 300 BPM in sixteenth-note triplets). |

Edits preserve oscillator/LFO phases. Continuous modulation contributions ramp over 10 ms; cutoff stays within 20 Hz and the frequency maximum, PWM within 0.05-0.95, FM index within 0-10. Initial modulations may also be inherited by sequence voices and overridden per step. These two slots coexist with the independent `lfoFreq`/`lfoDepth` pitch vibrato; they are not accepted by timed tones, chords or `playPattern`.

## `playChord(options)`

Starts 1 to 32 pitches as one atomic event. Exactly one pitch array is required.

| Key           | Type     |              Default | Description                                                    |
| ------------- | -------- | -------------------: | -------------------------------------------------------------- |
| `frequencies` | number[] | required alternative | Frequencies in Hz.                                             |
| `notes`       | string[] | required alternative | Note names.                                                    |
| `duration`    | integer  |                `500` | Total chord length in ms.                                      |
| `attack`      | integer  |                 `50` | Fade-in time in ms.                                            |
| `release`     | integer  |                 `50` | Fade-out time in ms.                                           |
| `volume`      | number   |                  `1` | Chord event level.                                             |
| `waveType`    | integer  |               `SINE` | Waveform for every voice.                                      |
| `panSpread`   | number   |                  `0` | Even stereo spread from 0 to 1.                                |
| `pans`        | number[] |                 none | Per-note pan positions; overrides spread for supplied entries. |
| `noiseRate`   | number   |                  `0` | Fixed update rate for noise voices.                            |
| `lowPassHz`   | number   |                  `0` | Fixed low-pass cutoff for every voice.                         |
| `pulseWidth`  | number   |                `0.5` | Fixed square-wave duty cycle.                                  |
| `waveTable`   | number[] |                 none | Required when `waveType` is `WAVETABLE`.                       |
| `bitDepth`    | integer  |                  `0` | Fixed amplitude quantization; 0 disables it.                   |
| `decay`       | integer  |                  `0` | Fixed decay time shared by every voice.                        |
| `sustain`     | number   |                  `1` | Fixed sustain level shared by every voice.                     |
| `filterType`  | string   |               `none` | Fixed filter type for every voice.                             |
| `filterHz`    | number   |               `1000` | Fixed cutoff or center in Hz.                                  |
| `filterQ`     | number   |             `0.7071` | Fixed resonance.                                               |
| `fmRatio`     | number   |                  `1` | Fixed modulator ratio.                                         |
| `fmDepth`     | number   |                  `0` | Fixed modulation index; sine voices only.                      |
| `detunes`     | number[] |                 none | Per-note offsets in cents, matched to the pitch array.         |
| `spatialX`    | number   |              omitted | Shared fixed left/right binaural direction.                    |
| `spatialY`    | number   |              omitted | Shared fixed below/above binaural direction.                   |

`pans` and `detunes` cannot contain more entries than the pitch array, and missing detune entries count as 0. Missing `pans` entries use the position computed from `panSpread`, or 0 when no spread is set. `playChord` does not accept sweep, vibrato or `detune` fields.

## `playPattern(options)`

Schedules one pitch or rest per step. Swing can cause successive voices to overlap; a step does not contain a chord. The required `steps` array must contain only objects. A string or number step is rejected with `invalid_step_type`.

Pattern-level keys:

| Key             | Type     |            Default | Description                                     |
| --------------- | -------- | -----------------: | ----------------------------------------------- |
| `steps`         | object[] |           required | Between 1 and 512 steps.                        |
| `bpm`           | number   |              `120` | Tempo used by note values.                      |
| `swing`         | number   |                `0` | Alternating timing offset.                      |
| `stepDuration`  | number   |              `100` | Fallback step length in ms.                     |
| `noteValue`     | string   |               none | Shared musical step length.                     |
| `attack`        | integer  |               `50` | Inherited attack.                               |
| `release`       | integer  |               `50` | Inherited release.                              |
| `volume`        | number   |                `1` | Inherited event level.                          |
| `waveType`      | integer  |             `SINE` | Inherited waveform.                             |
| `pan`           | number   |                `0` | Inherited starting pan.                         |
| `panEnd`        | number   | same as root `pan` | Inherited ending pan.                           |
| `frequencyEnd`  | number   |                `0` | Inherited sweep target.                         |
| `lfoFreq`       | number   |                `0` | Inherited vibrato rate.                         |
| `lfoDepth`      | number   |                `0` | Inherited vibrato depth.                        |
| `noiseRate`     | number   |                `0` | Inherited noise update rate.                    |
| `noiseRateEnd`  | number   |                `0` | Inherited noise-rate sweep target.              |
| `lowPassHz`     | number   |                `0` | Inherited low-pass cutoff.                      |
| `pulseWidth`    | number   |              `0.5` | Inherited square-wave duty cycle.               |
| `pulseWidthEnd` | number   |                `0` | Inherited pulse-width sweep target.             |
| `waveTable`     | number[] |               none | Inherited custom wavetable.                     |
| `bitDepth`      | integer  |                `0` | Inherited amplitude quantization.               |
| `decay`         | integer  |                `0` | Inherited decay time.                           |
| `sustain`       | number   |                `1` | Inherited sustain level.                        |
| `filterType`    | string   |             `none` | Inherited filter type.                          |
| `filterHz`      | number   |             `1000` | Inherited cutoff or center.                     |
| `filterHzEnd`   | number   |                `0` | Inherited cutoff sweep target.                  |
| `filterQ`       | number   |           `0.7071` | Inherited resonance.                            |
| `fmRatio`       | number   |                `1` | Inherited modulator ratio.                      |
| `fmDepth`       | number   |                `0` | Inherited modulation index.                     |
| `fmDepthEnd`    | number   |               none | Inherited index sweep target.                   |
| `detune`        | number   |                `0` | Inherited pitch offset in cents.                |
| `spatialX`      | number   |            omitted | Inherited fixed left/right binaural direction.  |
| `spatialY`      | number   |            omitted | Inherited fixed below/above binaural direction. |

Step keys:

| Key                                                    | Type     | Description                                         |
| ------------------------------------------------------ | -------- | --------------------------------------------------- |
| `note`                                                 | string   | Pitch name; exclusive with `frequency` and `rest`.  |
| `frequency`                                            | number   | Pitch in Hz; exclusive with `note` and `rest`.      |
| `rest`                                                 | Boolean  | Must be exactly `true` for a rest.                  |
| `duration`                                             | integer  | Explicit step length in ms.                         |
| `noteValue`                                            | string   | Step length derived from `bpm`.                     |
| `attack`, `release`, `volume`, `waveType`              | number   | Override the pattern value for this step.           |
| `pan`, `panEnd`, `frequencyEnd`, `lfoFreq`, `lfoDepth` | number   | Override motion or vibrato for this step.           |
| `noiseRate`, `noiseRateEnd`, `lowPassHz`               | number   | Override noise character or filtering.              |
| `pulseWidth`, `pulseWidthEnd`                          | number   | Override square-wave duty cycle or its sweep.       |
| `waveTable`                                            | number[] | Override the custom table for this step.            |
| `bitDepth`                                             | integer  | Override amplitude quantization.                    |
| `decay`, `sustain`                                     | number   | Override the decay stage.                           |
| `filterType`, `filterHz`, `filterHzEnd`, `filterQ`     | mixed    | Override the filter.                                |
| `fmRatio`, `fmDepth`, `fmDepthEnd`                     | number   | Override frequency modulation.                      |
| `detune`                                               | number   | Override the pitch offset in cents.                 |
| `spatialX`, `spatialY`                                 | number   | Override either inherited coordinate for this step. |

Step timing precedence is `duration`, step `noteValue`, pattern `noteValue`, pattern `stepDuration`, then 100 ms. The resolved length controls both the voice duration and the advance to the next step; there is no independent gate length. A step `duration` overrides musical timing rather than shortening a voice inside it. Only one pattern remains pending at a time. Starting another one cancels steps that have not fired, and the cancelled pattern reports it through the [`patternend` event](#patternend-event).

Musical note values and numeric `stepDuration` can resolve to fractional milliseconds; each voice envelope uses the nearest integer millisecond. Explicit step `duration` must be an integer. Each step keeps its resolved duration. Swing changes its scheduled start by `swing` multiplied by that step's resolved duration for even steps (zero-based) and the negative of that offset for odd steps; a negative start is clamped to the call time. Positive swing delays even steps and advances odd ones, so voices can overlap. Pattern `panEnd` defaults to the root `pan`; a step overriding only `pan` still inherits the root ending position. Set both on that step for fixed stereo placement.

Acceptance schedules the pattern, but a later native queue overflow can still drop an individual step and log `overflow`; `patternend` describes the schedule, not a guarantee that every step sounded.

## Expressive controls

These options are optional; omitting them leaves the note unchanged. They apply to `playTone`, to `playChord` as fixed values, and to `playPattern` at the root and on each step.

### Decay and sustain

After the attack, the level falls from full scale to `sustain` over `decay` milliseconds, then holds there until the release begins. With `decay: 0` and `sustain: 1` the envelope is the plain attack, full level and release.

```text
level
1.0    /\
      /  \
     /    \________  sustain
    /              \
   /                \
  +------------------------> time
   attack decay hold release
```

The release scales whatever level the note has reached, so a release that begins during the decay stays continuous. `duration` still covers the whole event.

### Resonant filter

`filterType` inserts a 12 dB per octave state-variable filter after the one-pole `lowPassHz` filter:

| `filterType` | Passes                        | `filterHz` means |
| ------------ | ----------------------------- | ---------------- |
| `none`       | Everything; the default.      | Not allowed.     |
| `lowpass`    | Frequencies below the cutoff. | Cutoff.          |
| `highpass`   | Frequencies above the cutoff. | Cutoff.          |
| `bandpass`   | A band around the center.     | Center.          |

`filterQ` sets the resonance. The default 0.7071 is flat. Higher values add a peak at the cutoff: `lowpass` and `highpass` boost it by about `filterQ`, so Q 10 is roughly 20 dB. `bandpass` keeps unity gain at its center for every Q and only gets narrower.

`filterHzEnd` moves the cutoff over the whole event. The sweep is exponential: equal musical distance per unit of time, so 200 Hz to 3,200 Hz crosses 800 Hz at the midpoint. `filterHz` and `filterHzEnd` are held between 20 Hz and `sampleRate * 0.45`.

### Frequency modulation

A positive `fmDepth`, or any `fmDepthEnd`, turns a `SINE` voice into a two-operator phase-modulated voice:

```text
output = sin(2 * pi * phase + fmDepth * sin(2 * pi * modulatorPhase))
```

`fmRatio` sets the modulator frequency as a multiple of the carrier's current frequency, so pitch sweeps and vibrato keep the ratio. `fmDepth` is the modulation index in radians. Index 0 is a plain sine; each increase adds sidebands at the carrier frequency plus and minus multiples of the modulator frequency. `fmDepthEnd` moves the index linearly over the event. Unlike the other `*End` keys, 0 is a real target, so omit the key for no sweep.

FM works only on `SINE`. Another waveform is rejected with `fm_requires_sine`.

### Detune

`detune` shifts the pitch by cents: the frequency is multiplied by `2 ^ (cents / 1200)`, so 100 cents is one semitone. It applies to `note`, `frequency` and `frequencyEnd`. In a chord, `detunes` supplies one offset per pitch instead. The shifted pitch must stay between 1 Hz and the frequency ceiling, otherwise the call is rejected with `out_of_range` on `detune` or `detunes`.

### Rules across keys

The rules below apply to the final values of each sounding event. A pattern step overrides values from the pattern root. A pattern made only of rests is not checked.

| Reason                             | Rejected when                                                                  |
| ---------------------------------- | ------------------------------------------------------------------------------ |
| `sustain_without_decay`            | `sustain` is below 1 and `decay` is 0.                                         |
| `decay_exceeds_remaining_duration` | `attack` plus `decay` is longer than the event.                                |
| `filter_type_required`             | `filterHz`, `filterHzEnd` or `filterQ` is set and `filterType` is `none`.      |
| `fm_requires_sine`                 | `fmDepth` is above 0, or `fmDepthEnd` is set, on a waveform other than `SINE`. |
| `fm_depth_required`                | `fmRatio` is set while FM is off.                                              |

For the decay rule, `attack` is the explicit value or the 50 ms default, held below `duration`. Set a short `attack` explicitly when the decay is long.

## `setVolume(options)`

Changes the master level with a short smoothing ramp.

| Key      | Type   | Default |  Range |
| -------- | ------ | ------: | -----: |
| `volume` | number |     `1` | 0 to 2 |

## `stopAll()`

Fades active voices over roughly 20 ms to avoid clicks, stops future native sequence events and invalidates effect histories as panic. It does not cancel future timer-based `playPattern` steps. This is distinct from disabling an effect, which drains its tail.

## `shutdown()`

Cancels pending timer patterns and native transport, stops the stream and releases voice/effect resources outside the audio callback. Call it when the owner closes, after cancelling app-owned timers/retries. It emits no completion event.

## `patternend` event

The module emits one event. Listen with `addEventListener`:

```javascript
function onPatternEnd (event) {
  Ti.API.info(event.completed ? 'pattern finished' : 'pattern replaced')
}

synth.addEventListener('patternend', onPatternEnd)
// when the owner closes:
synth.removeEventListener('patternend', onPatternEnd)
```

The payload is `{ completed: Boolean }`.

- An accepted `playPattern` produces one event unless `shutdown()` discards it before completion. A rejected call produces none.
- `completed: true` arrives at the natural end of the pattern, about 1 ms after the sum of its step lengths counted from the call. The scheduler has finished at that point, although swing, callback timing and the binaural FIR tail can leave audio playing after the event.
- `completed: false` arrives when a later accepted `playPattern` or `playSequence` replaces the pattern before it ends.
- `shutdown()` discards a pending pattern without an event. `stopAll()` does not cancel patterns, so it produces none either.

Events have no pattern identifier. Only the current owner of the shared scheduler should chain patterns. Remove its listener during cleanup. Shutdown generates no event and leaves any event already queued for JavaScript in place.

Both ports deliver the event asynchronously to the JavaScript runtime, never from inside the call that caused it. The timing follows the pattern scheduler, so it is not sample-accurate.

## Strict validation

Unknown keys and invalid values return `false` and produce one deduplicated native log entry:

```text
event=validation_warning method=playTone key=duraton reason=unsupported_option action=rejected value=200
```

Common reasons include:

| Reason                                   | Meaning                                                                                      |
| ---------------------------------------- | -------------------------------------------------------------------------------------------- |
| `unsupported_option`                     | The option name is not part of that method or step.                                          |
| `invalid_step_type`                      | A pattern step is not an object.                                                             |
| `non_numeric_or_non_finite`              | A numeric field is the wrong type, `NaN` or infinite.                                        |
| `not_integer`                            | An integer field contains a fractional number.                                               |
| `out_of_range`                           | A number falls outside the documented range.                                                 |
| `missing_required`                       | A required pitch array or `WAVETABLE` sample array is missing.                               |
| `not_string`, `not_array`, `not_boolean` | A field has the wrong container or primitive type.                                           |
| `invalid_note`                           | A note name cannot be parsed.                                                                |
| `unsupported_note_value`                 | A note value is not one of the ten supported values.                                         |
| `unsupported_value`                      | `mixingProfile`, `audioSession` or `filterType` is not one of the listed strings.            |
| `invalid_sample_count`                   | `waveTable` has fewer than 2 or more than 64 samples.                                        |
| `missing_pitch_or_rest`                  | A pattern step has no pitch and is not a rest.                                               |
| `conflicting_pitch_fields`               | A call or step provides more than one pitch source.                                          |
| `conflicting_spatial_fields`             | Spatial coordinates are combined with stereo pan fields, including inherited pattern values. |
| `invalid_voice_count`                    | A chord has fewer than 1 or more than 32 pitches.                                            |
| `invalid_step_count`                     | A pattern has fewer than 1 or more than 512 steps.                                           |
| `too_many_values`                        | `pans` or `detunes` is longer than the chord.                                                |
| `attack_greater_or_equal_duration`       | An explicit attack leaves no time for the event.                                             |
| `release_exceeds_remaining_duration`     | An explicit release does not fit after attack.                                               |
| `decay_exceeds_remaining_duration`       | `attack` plus `decay` does not fit in the event.                                             |
| `sustain_without_decay`                  | `sustain` is below 1 while `decay` is 0.                                                     |
| `filter_type_required`                   | A filter key is set while `filterType` is `none`.                                            |
| `fm_requires_sine`                       | FM is active on a waveform other than `SINE`.                                                |
| `fm_depth_required`                      | `fmRatio` is set while FM is off.                                                            |

Explicit values are not clamped. Read `getDefaults().limits` when accepting user input and decide in the app whether to reject or constrain it.

## Binaural front-plane positioning

`playTone`, `playChord` and `playPattern` (root and steps) accept `spatialX` and `spatialY`, finite numbers from -1 to 1. Supplying either enables headphone binaural processing for that event; the omitted coordinate is 0. Coordinates are fixed for the event. `spatialX: -1` is left, `1` is right, `spatialY: -1` is below, and `1` is above. The center is in front of the listener. The grid spans approximately 60 degrees horizontally and 40 degrees vertically, with interpolated diagonals. A chord shares one position across its voices; each voice is filtered separately.

Spatial coordinates cannot be combined with `pan`, `panEnd`, `pans` or `panSpread`, including conflicting fields inherited by a pattern step. Such calls return `false` with `conflicting_spatial_fields`. Omitting both spatial coordinates keeps the stereo renderer. The coordinate limits in `getDefaults().limits` can be used to detect support without starting the engine.

```javascript
var accepted = synth.playTone({
  frequency: 90, waveType: WAVE.NOISE,
  duration: 500, attack: 2, release: 200, volume: 0.3,
  spatialX: 0.6, spatialY: 0.8
})
if (!accepted) Ti.API.warn('Spatial explosion rejected')
```

There is no `binaural` Boolean option or percentage parameter on the native API. JavaScript chooses which coordinates to send for each event; `spatialX: 0, spatialY: 0` still enables binaural at the front center. To turn it off, omit both keys. The [integration guide](guide.md#integrate-binaural-in-a-2d-app) shows a switch, amplitude sliders and screen-coordinate conversion without changing synthesis recipes.

Listen with stereo headphones. Height perception depends on the listener, headphones and sound spectrum; a low sine tone is a weak test of elevation. This version models a front plane without rear sources, distance attenuation, room reflections or head tracking. The output remains two channels. Filter positions do not follow objects automatically; submit later events at their updated coordinates.

## `getStats()`

Older beta 1.0.0 packages may lack these methods; use `typeof synth.getStats === 'function'` for feature detection when supporting earlier beta installations.

Returns a new snapshot without resetting counters. Available before start and after shutdown. Occupancy is the last completed render block; queued commands are read at query time. No audio-thread allocation, locks or waiting are added.

| Field                      | Meaning                                                                                                                                 |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `activeVoices`             | Occupied primary slots, including binaural FIR draining.                                                                                |
| `maxVoices`                | Configured primary-slot capacity (default 8 before start).                                                                              |
| `peakActiveVoices`         | Highest primary occupancy since reset/start, including peaks between queries.                                                           |
| `tailVoices`               | External fade tails from replacement or `stopAll`, excluding primary FIR drain.                                                         |
| `spatialVoices`            | Spatial primary slots, including FIR draining; excludes external tails.                                                                 |
| `voiceStealCount`          | Primary replacements while all slots are occupied.                                                                                      |
| `rejectedRequestCount`     | Observed rejected Boolean API requests. On the reviewed iOS beta, sequence/effects argument or engine-stopped rejections and incompatible modulation updates are not all counted; this is not an exhaustive rejection total. See [native findings](source-notes.md#native-findings-and-acceptance-boundaries).                                                                                   |
| `rejectedRequestsByReason` | `{ validation, engineStopped, queueFull }`; sum equals rejection total.                                                                 |
| `droppedPatternStepCount`  | Previously accepted pattern steps that could not enter the render queue; cancelled/replaced steps are excluded.                         |
| `pendingCommands`          | Published entries awaiting the renderer; chord notes count separately, future scheduler steps are excluded.                             |
| `sampleRate`               | Current native rate, or the last rate after shutdown; 44100 before start.                                                               |
| `callbackFrames`           | Frames processed in the most recent callback; 0 before start/after shutdown.                                                            |
| `renderLoad`               | Last callback elapsed seconds / (`callbackFrames / sampleRate`); may exceed 1.                                                          |
| `peakRenderLoad`           | Maximum callback load in this diagnostic window.                                                                                        |
| `outputPeakDbFS`           | `{ left, right }` peaks of final float output in the latest completed approximately 200 ms window.                                      |
| `outputRmsDbFS`            | `{ left, right }` RMS of that same window.                                                                                              |
| `preLimiterPeakDb` | Maximum native peak before the limiter since reset, in dBFS; diagnostics required. |
| `maxLimiterReductionDb` | Maximum native limiter attenuation since reset, in dB; diagnostics required. A brief intervention persists across UI polls. |
| `limiterReductionDb`       | Maximum limiter attenuation in that window, as a positive dB magnitude.                                                                 |
| `underrunCount`            | Android Oboe accumulated backend xruns since reset/start when supported; otherwise `null`.                                              |
| `bufferFrames`             | Android Oboe output buffer size; otherwise `null`. This is distinct from `callbackFrames`.                                              |
| `estimatedOutputLatencyMs` | Android timestamp-based stream-to-DAC estimate plus module lookahead, when valid; otherwise `null` (always `null` on this iOS backend). |

`renderLoad`, `peakRenderLoad`, `outputPeakDbFS`, `outputRmsDbFS`, `preLimiterPeakDb`, `maxLimiterReductionDb` and `limiterReductionDb` are `null` until enabled and measured, and after shutdown. Android backend metrics (`underrunCount`, `bufferFrames` and `estimatedOutputLatencyMs`) are best-effort readings independent of this diagnostic switch. Signal windows use the final output after master volume, limiter and clamping, with a silence floor of -120 dBFS. A query does not start or consume a window. iOS does not expose a trustworthy underrun count or hardware output buffer size through this source-node backend, so those fields are `null`. Android preserves supported xrun totals across stream recovery and resets the baseline with `resetStats()`. If a route makes xrun coverage unavailable, the count stays `null` until reset/start restores a measurable window. The latency estimate excludes command/scheduler delay and any external DAC/HDMI latency unknown to Android. Timestamp errors, unsupported backends and negative estimates return `null`. It is queried off the audio callback. A zero underrun count does not prove clean sound. Render load includes elapsed callback work, not total app CPU.

Render load is a fraction: multiply by 100 for a percentage. For example, `0.012` is 1.2% of the block budget, while `1.0` is 100%. An open stream still renders silent blocks, including output/limiter work and enabled signal measurements, so no active voices does not imply zero load. Callback elapsed time varies with scheduling and system activity; displayed decimal places do not establish measurement accuracy. Compare the same configuration on the same device. Percentages from a simulator and a phone do not provide a direct performance comparison.

## `setStatsEnabled(enabled)`

Accepts a Boolean directly, returns Boolean acceptance. Default `false`. Enabling starts a new diagnostic window, without restarting audio. Calling it again with `true` also starts a fresh window. Disabling hides timing and signal fields immediately. Basic counters remain available in either mode. The setting persists across shutdown/start, while a new engine starts with fresh counters.

## `resetStats()`

Returns nothing. Resets accumulated counters and maxima without stopping sounds, clearing queued commands or enabling diagnostics. Primary occupancy becomes the initial maximum. Render-owned changes take effect at the next callback boundary; queries immediately hide stale measurements and report reset accumulated values. A new successful start after shutdown also resets statistics. Shutdown clears occupancy and commands while retaining accumulated basic totals and maxima.

```javascript
// Optional diagnostics; poll at 5 Hz and stop the timer with the owner.
if (synth.setStatsEnabled(true)) {
  var statsTimer = setInterval(function () {
    Ti.API.info(JSON.stringify(synth.getStats()))
  }, 200)
  // Later: clearInterval(statsTimer); synth.setStatsEnabled(false)
}
```
