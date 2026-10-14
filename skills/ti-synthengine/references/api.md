> Source snapshot: official TiSynthEngine 1.0.0 beta documentation at commit `95901c98af5353b86d9dc7c60b29ab9186b038cd` (2026-10-14). Upstream `documentation/api.md` SHA-256: `845b1a793d01d2418d1f0859a3f34a1431ac4264107366d1ec8f343877307a9d`.

# API reference

Module id: `ti.synthengine`

Public API version: `1.0.0`

Android and iOS expose the same eight methods, one event, defaults, limits,
waveform values and validation behavior. Option objects are strict: an unknown
key is rejected with `unsupported_option`.

<!-- TOC-START -->
## Contents

- [Return values](#return-values)
- [`getDefaults()`](#getdefaults)
- [Limits](#limits)
- [`startEngine(options)`](#startengineoptions)
- [`playTone(options)`](#playtoneoptions)
- [`playChord(options)`](#playchordoptions)
- [`playPattern(options)`](#playpatternoptions)
- [Expressive controls](#expressive-controls)
- [`setVolume(options)`](#setvolumeoptions)
- [`stopAll()`](#stopall)
- [`shutdown()`](#shutdown)
- [`patternend` event](#patternend-event)
- [Strict validation](#strict-validation)
- [Binaural front-plane positioning](#binaural-front-plane-positioning)

<!-- TOC-END -->

## Return values

`startEngine`, `playTone`, `playChord`, `playPattern` and `setVolume` return a
Boolean. `true` means the request was accepted. `false` means validation
failed, the engine was unavailable, or the native command queue was full.

`stopAll` and `shutdown` do not return a value. `getDefaults` returns the
contract object described below.

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

`fmDepthEnd`, `detunes`, `spatialX` and `spatialY` have no reported default because omitting them is meaningful. Supplying a spatial coordinate enables binaural; the other coordinate then defaults to 0 internally. The maximum frequency is `sampleRate * 0.45`. Before the stream opens, the
reported fallback is 19,845 Hz. Read the object again after `startEngine()` if
the precise device limit matters.

## Limits

All ranges include their endpoints. `getDefaults().limits` uses `{ min, max }` objects. Sweep targets and array elements share the corresponding base range: `panEnd`/`pans[]` use `pan`, `frequencyEnd` accepts 0 through the frequency maximum, but only targets of at least 1 Hz enable a sweep (values below 1 disable it), `noiseRateEnd` uses `noiseRate`, `filterHzEnd` uses `filterHz` plus disabled value 0, `fmDepthEnd` uses `fmDepth`, and `detunes[]` uses `detune`. The sample-count key is `waveTableSamples`; there is no `limits.waveTable` object.

| Field | Minimum | Maximum | Unit or rule |
| --- | ---: | ---: | --- |
| `maxVoices` | 1 | 32 | integer voices |
| `frequency` | 1 | `sampleRate * 0.45` | Hz |
| `duration` | 1 | 60,000 | integer ms, including explicit pattern step duration |
| `attack` | 0 | 2,000 | integer ms; must be less than duration |
| `release` | 0 | 4,000 | integer ms; must fit after attack |
| `volume` | 0 | 2 | event or master multiplier |
| `waveType` | 0 | 5 | integer waveform value |
| `patternSteps` | 1 | 512 | object steps |
| `pan`, `panEnd`, `pans[]` | -1 | 1 | left to right |
| `spatialX`, `spatialY` | -1 | 1 | fixed binaural direction; omitted unless enabled |
| `panSpread` | 0 | 1 | chord stereo width |
| `frequencyEnd` | 0 | `sampleRate * 0.45` | Hz; values below 1 disable the sweep |
| `lfoFreq` | 0 | 20,000 | Hz; 0 disables vibrato |
| `lfoDepth` | 0 | 20,000 | Hz |
| `noiseRate`, `noiseRateEnd` | 0 | `sampleRate * 0.45` | Hz; 0 selects white noise or disables the sweep |
| `lowPassHz` | 0 | `sampleRate * 0.45` | Hz; 0 disables the filter |
| `pulseWidth` | 0.05 | 0.95 | fraction of a square-wave cycle |
| `pulseWidthEnd` | 0 or 0.05 | 0.95 | 0 disables the sweep |
| `waveTable` | 2 samples | 64 samples | each value must be from -1 to 1; count range is `limits.waveTableSamples` |
| `bitDepth` | 0 or 2 | 16 | integer bits; 0 disables quantization |
| `bpm` | 20 | 300 | beats per minute |
| `swing` | -0.49 | 0.49 | alternating timing offset |
| `stepDuration` | 1 | 60,000 | ms |
| `decay` | 0 | 4,000 | integer ms; `attack` plus `decay` must fit in the event |
| `sustain` | 0 | 1 | level held after the decay |
| `filterHz` | 20 | `sampleRate * 0.45` | Hz |
| `filterHzEnd` | 0 or 20 | `sampleRate * 0.45` | Hz; 0 disables the sweep |
| `filterQ` | 0.5 | 10 | resonance |
| `fmRatio` | 0.1 | 16 | modulator frequency divided by carrier frequency |
| `fmDepth`, `fmDepthEnd` | 0 | 10 | modulation index in radians |
| `detune`, `detunes[]` | -1200 | 1200 | cents |

The allowed `noteValue` strings are `1n`, `2n`, `4n`, `8n` and `16n`, the
dotted values `2n.`, `4n.` and `8n.`, and the triplets `8t` and `16t`. A dotted
value lasts one and a half times as long as the plain one. Three triplet steps
fit in the time of two plain steps of the same name. Any other length is set
in milliseconds with `duration` or `stepDuration`.

## `startEngine(options)`

Starts the native stream. Calling it again while the engine is running returns
`true` without rebuilding the stream.

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `maxVoices` | integer | `8` | Size of the voice pool, from 1 to 32. |
| `mixingProfile` | string | `conservative` | `conservative`, `balanced`, `speakerSafe` or `raw`. Matching is case-insensitive. |
| `audioSession` | string | `playback` | iOS session category: `playback` or `ambient`. Matching is case-insensitive. Android validates the value and does not change its output. |

Options are validated even when the engine is already running; a second call with invalid options still returns `false`.

The profile, voice capacity and audio session stay fixed for the session. Call
`shutdown()` before starting again with different values.

On iOS, `playback` ignores the silent switch and interrupts other apps' audio.
`ambient` is muted by the silent switch and mixes with other apps' audio. The
module applies the category again when it resumes after a route change.

## `playTone(options)`

Plays one pitch. It uses 440 Hz when neither pitch field is present. Note names accept C through B or DO, RE, MI, FA, SOL, LA, SI and TI, followed by optional `#` or lowercase `b` and one octave digit from 0 to 9. Letters are case-insensitive, the omitted octave is 4, and A4 is 440 Hz. A valid named pitch is limited to the active frequency ceiling when rendered; an out-of-range numeric `frequency` is rejected.

| Key | Type | Default | Description |
| --- | --- | ---: | --- |
| `frequency` | number | `440` | Starting frequency in Hz. Cannot be combined with `note`. |
| `note` | string | none | Note name. Cannot be combined with `frequency`. |
| `duration` | integer | `500` | Total event length in ms. |
| `attack` | integer | `50` | Fade-in time in ms. |
| `release` | integer | `50` | Fade-out time in ms. |
| `volume` | number | `1` | Event level multiplier. |
| `waveType` | integer | `SINE` | One of the six waveform values. |
| `pan` | number | `0` | Starting stereo position. |
| `panEnd` | number | same as `pan` | Ending stereo position; omission keeps the position fixed. |
| `frequencyEnd` | number | `0` | Ending frequency; values below 1 keep the starting pitch. |
| `lfoFreq` | number | `0` | Vibrato rate in Hz. |
| `lfoDepth` | number | `0` | Vibrato depth in Hz. |
| `noiseRate` | number | `0` | Noise update rate; 0 produces a fresh value per sample. |
| `noiseRateEnd` | number | `0` | Ending noise update rate; 0 disables the sweep. |
| `lowPassHz` | number | `0` | Per-voice low-pass cutoff; 0 bypasses it. |
| `pulseWidth` | number | `0.5` | Duty cycle for `SQUARE`. |
| `pulseWidthEnd` | number | `0` | Ending duty cycle; 0 disables the sweep. |
| `waveTable` | number[] | none | Required for `WAVETABLE`; 2 to 64 normalized samples. |
| `bitDepth` | integer | `0` | Amplitude quantization from 2 to 16 bits; 0 disables it. |
| `decay` | integer | `0` | Milliseconds to fall from full level to `sustain` after the attack. |
| `sustain` | number | `1` | Level held after the decay, from 0 to 1. |
| `filterType` | string | `none` | `none`, `lowpass`, `highpass` or `bandpass`. Case-insensitive. |
| `filterHz` | number | `1000` | Cutoff, or center for `bandpass`, in Hz. |
| `filterHzEnd` | number | `0` | Ending cutoff; 0 disables the sweep. |
| `filterQ` | number | `0.7071` | Resonance, from 0.5 to 10. |
| `fmRatio` | number | `1` | Modulator frequency as a multiple of the carrier. |
| `fmDepth` | number | `0` | Modulation index; 0 leaves FM off unless `fmDepthEnd` is set. |
| `fmDepthEnd` | number | none | Ending index. Omit it for no sweep; 0 is a valid target. |
| `detune` | number | `0` | Pitch offset in cents, applied to `frequency` and `frequencyEnd`. |
| `spatialX` | number | omitted | Fixed left/right binaural direction; see [positioning](#binaural-front-plane-positioning). |
| `spatialY` | number | omitted | Fixed below/above binaural direction. |

Omitted attack/release values are shortened to fit an event smaller than the default envelope. Explicit values must satisfy the documented envelope rules. `getDefaults()` reports the baseline defaults, not these per-event adjustments.

The controls from `decay` to `detune` are described in
[Expressive controls](#expressive-controls), including the rules that tie them
together.

## `playChord(options)`

Starts 1 to 32 pitches as one atomic event. Exactly one pitch array is
required.

| Key | Type | Default | Description |
| --- | --- | ---: | --- |
| `frequencies` | number[] | required alternative | Frequencies in Hz. |
| `notes` | string[] | required alternative | Note names. |
| `duration` | integer | `500` | Total chord length in ms. |
| `attack` | integer | `50` | Fade-in time in ms. |
| `release` | integer | `50` | Fade-out time in ms. |
| `volume` | number | `1` | Chord event level. |
| `waveType` | integer | `SINE` | Waveform for every voice. |
| `panSpread` | number | `0` | Even stereo spread from 0 to 1. |
| `pans` | number[] | none | Per-note pan positions; overrides spread for supplied entries. |
| `noiseRate` | number | `0` | Fixed update rate for noise voices. |
| `lowPassHz` | number | `0` | Fixed low-pass cutoff for every voice. |
| `pulseWidth` | number | `0.5` | Fixed square-wave duty cycle. |
| `waveTable` | number[] | none | Required when `waveType` is `WAVETABLE`. |
| `bitDepth` | integer | `0` | Fixed amplitude quantization; 0 disables it. |
| `decay` | integer | `0` | Fixed decay time shared by every voice. |
| `sustain` | number | `1` | Fixed sustain level shared by every voice. |
| `filterType` | string | `none` | Fixed filter type for every voice. |
| `filterHz` | number | `1000` | Fixed cutoff or center in Hz. |
| `filterQ` | number | `0.7071` | Fixed resonance. |
| `fmRatio` | number | `1` | Fixed modulator ratio. |
| `fmDepth` | number | `0` | Fixed modulation index; sine voices only. |
| `detunes` | number[] | none | Per-note offsets in cents, matched to the pitch array. |
| `spatialX` | number | omitted | Shared fixed left/right binaural direction. |
| `spatialY` | number | omitted | Shared fixed below/above binaural direction. |

`pans` and `detunes` cannot contain more entries than the pitch array, and
missing detune entries count as 0. Missing `pans` entries use the position computed from `panSpread`, or 0 when no spread is set. `playChord` does not accept sweep, vibrato or
`detune` fields.

## `playPattern(options)`

Schedules one pitch or rest per step. Swing can cause successive voices to overlap; a step does not contain a chord. The required `steps` array must contain only
objects. A string or number step is rejected with `invalid_step_type`.

Pattern-level keys:

| Key | Type | Default | Description |
| --- | --- | ---: | --- |
| `steps` | object[] | required | Between 1 and 512 steps. |
| `bpm` | number | `120` | Tempo used by note values. |
| `swing` | number | `0` | Alternating timing offset. |
| `stepDuration` | number | `100` | Fallback step length in ms. |
| `noteValue` | string | none | Shared musical step length. |
| `attack` | integer | `50` | Inherited attack. |
| `release` | integer | `50` | Inherited release. |
| `volume` | number | `1` | Inherited event level. |
| `waveType` | integer | `SINE` | Inherited waveform. |
| `pan` | number | `0` | Inherited starting pan. |
| `panEnd` | number | same as root `pan` | Inherited ending pan. |
| `frequencyEnd` | number | `0` | Inherited sweep target. |
| `lfoFreq` | number | `0` | Inherited vibrato rate. |
| `lfoDepth` | number | `0` | Inherited vibrato depth. |
| `noiseRate` | number | `0` | Inherited noise update rate. |
| `noiseRateEnd` | number | `0` | Inherited noise-rate sweep target. |
| `lowPassHz` | number | `0` | Inherited low-pass cutoff. |
| `pulseWidth` | number | `0.5` | Inherited square-wave duty cycle. |
| `pulseWidthEnd` | number | `0` | Inherited pulse-width sweep target. |
| `waveTable` | number[] | none | Inherited custom wavetable. |
| `bitDepth` | integer | `0` | Inherited amplitude quantization. |
| `decay` | integer | `0` | Inherited decay time. |
| `sustain` | number | `1` | Inherited sustain level. |
| `filterType` | string | `none` | Inherited filter type. |
| `filterHz` | number | `1000` | Inherited cutoff or center. |
| `filterHzEnd` | number | `0` | Inherited cutoff sweep target. |
| `filterQ` | number | `0.7071` | Inherited resonance. |
| `fmRatio` | number | `1` | Inherited modulator ratio. |
| `fmDepth` | number | `0` | Inherited modulation index. |
| `fmDepthEnd` | number | none | Inherited index sweep target. |
| `detune` | number | `0` | Inherited pitch offset in cents. |
| `spatialX` | number | omitted | Inherited fixed left/right binaural direction. |
| `spatialY` | number | omitted | Inherited fixed below/above binaural direction. |

Step keys:

| Key | Type | Description |
| --- | --- | --- |
| `note` | string | Pitch name; exclusive with `frequency` and `rest`. |
| `frequency` | number | Pitch in Hz; exclusive with `note` and `rest`. |
| `rest` | Boolean | Must be exactly `true` for a rest. |
| `duration` | integer | Explicit step length in ms. |
| `noteValue` | string | Step length derived from `bpm`. |
| `attack`, `release`, `volume`, `waveType` | number | Override the pattern value for this step. |
| `pan`, `panEnd`, `frequencyEnd`, `lfoFreq`, `lfoDepth` | number | Override motion or vibrato for this step. |
| `noiseRate`, `noiseRateEnd`, `lowPassHz` | number | Override noise character or filtering. |
| `pulseWidth`, `pulseWidthEnd` | number | Override square-wave duty cycle or its sweep. |
| `waveTable` | number[] | Override the custom table for this step. |
| `bitDepth` | integer | Override amplitude quantization. |
| `decay`, `sustain` | number | Override the decay stage. |
| `filterType`, `filterHz`, `filterHzEnd`, `filterQ` | mixed | Override the filter. |
| `fmRatio`, `fmDepth`, `fmDepthEnd` | number | Override frequency modulation. |
| `detune` | number | Override the pitch offset in cents. |
| `spatialX`, `spatialY` | number | Override either inherited coordinate for this step. |

Step timing precedence is `duration`, step `noteValue`, pattern `noteValue`,
pattern `stepDuration`, then 100 ms. The resolved length controls both the voice
duration and the advance to the next step; there is no independent gate length.
A step `duration` overrides musical timing rather than shortening a voice inside it. Only one pattern remains pending at a
time. Starting another one cancels steps that have not fired, and the cancelled
pattern reports it through the [`patternend` event](#patternend-event).

Musical note values and numeric `stepDuration` can resolve to fractional milliseconds; each voice envelope uses the nearest integer millisecond. Explicit step `duration` must be an integer. Each step keeps its resolved duration. Swing changes its scheduled start by `swing` multiplied by that step's resolved duration for even steps (zero-based) and the negative of that offset for odd steps; a negative start is clamped to the call time. Positive swing delays even steps and advances odd ones, so voices can overlap. Pattern `panEnd` defaults to the root `pan`; a step overriding only `pan` still inherits the root ending position. Set both on that step for fixed stereo placement.

Acceptance schedules the pattern, but a later native queue overflow can still drop an individual step and log `overflow`; `patternend` describes the schedule, not a guarantee that every step sounded.

## Expressive controls

These options are opt-in. With none of them present, a note sounds exactly as
it did without them. They apply to `playTone`, to `playChord` as fixed values,
and to `playPattern` at the root and on each step.

### Decay and sustain

After the attack, the level falls from full scale to `sustain` over `decay`
milliseconds, then holds there until the release begins. With `decay: 0` and
`sustain: 1` the envelope is the plain attack, full level and release.

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

The release scales whatever level the note has reached, so a release that
begins during the decay stays continuous. `duration` still covers the whole
event.

### Resonant filter

`filterType` inserts a 12 dB per octave state-variable filter after the
one-pole `lowPassHz` filter:

| `filterType` | Passes | `filterHz` means |
| --- | --- | --- |
| `none` | Everything; the default. | Not allowed. |
| `lowpass` | Frequencies below the cutoff. | Cutoff. |
| `highpass` | Frequencies above the cutoff. | Cutoff. |
| `bandpass` | A band around the center. | Center. |

`filterQ` sets the resonance. The default 0.7071 is flat. Higher values add a
peak at the cutoff: `lowpass` and `highpass` boost it by about `filterQ`, so Q
10 is roughly 20 dB. `bandpass` keeps unity gain at its center for every Q and
only gets narrower.

`filterHzEnd` moves the cutoff over the whole event. The sweep is exponential:
equal musical distance per unit of time, so 200 Hz to 3,200 Hz crosses 800 Hz
at the midpoint. `filterHz` and `filterHzEnd` are held between 20 Hz and
`sampleRate * 0.45`.

### Frequency modulation

A positive `fmDepth`, or any `fmDepthEnd`, turns a `SINE` voice into a
two-operator phase-modulated voice:

```text
output = sin(2 * pi * phase + fmDepth * sin(2 * pi * modulatorPhase))
```

`fmRatio` sets the modulator frequency as a multiple of the carrier's current
frequency, so pitch sweeps and vibrato keep the ratio. `fmDepth` is the
modulation index in radians. Index 0 is a plain sine; each increase adds
sidebands at the carrier frequency plus and minus multiples of the modulator
frequency. `fmDepthEnd` moves the index linearly over the event. Unlike the
other `*End` keys, 0 is a real target, so omit the key for no sweep.

FM works only on `SINE`. Another waveform is rejected with `fm_requires_sine`.

### Detune

`detune` shifts the pitch by cents: the frequency is multiplied by
`2 ^ (cents / 1200)`, so 100 cents is one semitone. It applies to `note`,
`frequency` and `frequencyEnd`. In a chord, `detunes` supplies one offset per
pitch instead. The shifted pitch must stay between 1 Hz and the frequency
ceiling, otherwise the call is rejected with `out_of_range` on `detune` or
`detunes`.

### Rules across keys

The rules below use the values a sounding event ends up with. For a pattern
step, that means the step over the pattern root. A pattern made only of rests is
not checked.

| Reason | Rejected when |
| --- | --- |
| `sustain_without_decay` | `sustain` is below 1 and `decay` is 0. |
| `decay_exceeds_remaining_duration` | `attack` plus `decay` is longer than the event. |
| `filter_type_required` | `filterHz`, `filterHzEnd` or `filterQ` is set and `filterType` is `none`. |
| `fm_requires_sine` | `fmDepth` is above 0, or `fmDepthEnd` is set, on a waveform other than `SINE`. |
| `fm_depth_required` | `fmRatio` is set while FM is off. |

For the decay rule, `attack` is the explicit value or the 50 ms default, held
below `duration`. Set a short `attack` explicitly when the decay is long.

## `setVolume(options)`

Changes the master level with a short smoothing ramp.

| Key | Type | Default | Range |
| --- | --- | ---: | ---: |
| `volume` | number | `1` | 0 to 2 |

## `stopAll()`

Fades active voices over roughly 20 ms to avoid clicks. It does not cancel
future pattern steps.

## `shutdown()`

Cancels the pending pattern, stops the native stream and releases its audio
resources. Call it when the owner closes.

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

- Every accepted `playPattern` produces exactly one event. A rejected call
  produces none.
- `completed: true` arrives at the natural end of the pattern, about 1 ms after
  the sum of its step lengths counted from the call. This reports scheduler completion, not audible silence: swing, callback timing and the binaural FIR tail can leave audio after that event.
- `completed: false` arrives when a later accepted `playPattern` replaces the
  pattern before it ends.
- `shutdown()` discards a pending pattern without an event. `stopAll()` does not
  cancel patterns, so it produces none either.

Both ports deliver the event asynchronously to the JavaScript runtime, never
from inside the call that caused it. The timing follows the pattern scheduler,
so it is not sample-accurate.

## Strict validation

Unknown keys and invalid values return `false` and produce one deduplicated
native log entry:

```text
event=validation_warning method=playTone key=duraton reason=unsupported_option action=rejected value=200
```

Common reasons include:

| Reason | Meaning |
| --- | --- |
| `unsupported_option` | The option name is not part of that method or step. |
| `invalid_step_type` | A pattern step is not an object. |
| `non_numeric_or_non_finite` | A numeric field is the wrong type, `NaN` or infinite. |
| `not_integer` | An integer field contains a fractional number. |
| `out_of_range` | A number falls outside the documented range. |
| `missing_required` | A required pitch array or `WAVETABLE` sample array is missing. |
| `not_string`, `not_array`, `not_boolean` | A field has the wrong container or primitive type. |
| `invalid_note` | A note name cannot be parsed. |
| `unsupported_note_value` | A note value is not one of the ten supported values. |
| `unsupported_value` | `mixingProfile`, `audioSession` or `filterType` is not one of the listed strings. |
| `invalid_sample_count` | `waveTable` has fewer than 2 or more than 64 samples. |
| `missing_pitch_or_rest` | A pattern step has no pitch and is not a rest. |
| `conflicting_pitch_fields` | A call or step provides more than one pitch source. |
| `conflicting_spatial_fields` | Spatial coordinates are combined with stereo pan fields, including inherited pattern values. |
| `invalid_voice_count` | A chord has fewer than 1 or more than 32 pitches. |
| `invalid_step_count` | A pattern has fewer than 1 or more than 512 steps. |
| `too_many_values` | `pans` or `detunes` is longer than the chord. |
| `attack_greater_or_equal_duration` | An explicit attack leaves no time for the event. |
| `release_exceeds_remaining_duration` | An explicit release does not fit after attack. |
| `decay_exceeds_remaining_duration` | `attack` plus `decay` does not fit in the event. |
| `sustain_without_decay` | `sustain` is below 1 while `decay` is 0. |
| `filter_type_required` | A filter key is set while `filterType` is `none`. |
| `fm_requires_sine` | FM is active on a waveform other than `SINE`. |
| `fm_depth_required` | `fmRatio` is set while FM is off. |

Explicit values are not clamped. Read `getDefaults().limits` when accepting
user input and decide in the app whether to reject or constrain it.

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
