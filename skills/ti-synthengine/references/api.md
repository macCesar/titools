> Source snapshot: official TiSynthEngine 1.0.0 documentation at commit `6685b81` (2026-08-29).

# API reference

Module id: `ti.synthengine`

Public API version: `1.0.0`

Android and iOS expose the same eight methods, defaults, limits, waveform
values and validation behavior. Option objects are strict: an unknown key is
rejected with `unsupported_option`.

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
    panSpread: 0,
    bpm: 120,
    swing: 0,
    stepDuration: 100
  },
  limits: { /* ranges listed below */ },
  mixingProfiles: ['conservative', 'raw', 'balanced', 'speakerSafe'],
  waveTypes: {
    SINE: 0,
    SQUARE: 1,
    SAWTOOTH: 2,
    TRIANGLE: 3,
    NOISE: 4
  }
}
```

The maximum frequency is `sampleRate * 0.45`. Before the stream opens, the
reported fallback is 19,845 Hz. Read the object again after `startEngine()` if
the precise device limit matters.

## Limits

All ranges include their endpoints.

| Field | Minimum | Maximum | Unit or rule |
| --- | ---: | ---: | --- |
| `maxVoices` | 1 | 32 | integer voices |
| `frequency` | 1 | `sampleRate * 0.45` | Hz |
| `duration` | 1 | 60,000 | integer ms |
| `attack` | 0 | 2,000 | integer ms; must be less than duration |
| `release` | 0 | 4,000 | integer ms; must fit after attack |
| `volume` | 0 | 2 | event or master multiplier |
| `waveType` | 0 | 4 | integer waveform value |
| `patternSteps` | 1 | 512 | object steps |
| `pan`, `panEnd`, `pans[]` | -1 | 1 | left to right |
| `panSpread` | 0 | 1 | chord stereo width |
| `frequencyEnd` | 0 | `sampleRate * 0.45` | Hz; 0 disables the sweep |
| `lfoFreq` | 0 | 20,000 | Hz; 0 disables vibrato |
| `lfoDepth` | 0 | 20,000 | Hz |
| `bpm` | 20 | 300 | beats per minute |
| `swing` | -0.49 | 0.49 | alternating timing offset |
| `stepDuration` | 1 | 60,000 | ms |

The allowed `noteValue` strings are `1n`, `2n`, `4n`, `8n`, `16n` and `32n`.

## `startEngine(options)`

Starts the native stream. Calling it again while the engine is running returns
`true` without rebuilding the stream.

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `maxVoices` | integer | `8` | Size of the voice pool, from 1 to 32. |
| `mixingProfile` | string | `conservative` | `conservative`, `balanced`, `speakerSafe` or `raw`. Matching is case-insensitive. |

The profile and voice capacity stay fixed for the session. Call `shutdown()`
before starting again with different values.

## `playTone(options)`

Plays one pitch. It uses 440 Hz when neither pitch field is present.

| Key | Type | Default | Description |
| --- | --- | ---: | --- |
| `frequency` | number | `440` | Starting frequency in Hz. Cannot be combined with `note`. |
| `note` | string | none | Note name. Cannot be combined with `frequency`. |
| `duration` | integer | `500` | Total event length in ms. |
| `attack` | integer | `50` | Fade-in time in ms. |
| `release` | integer | `50` | Fade-out time in ms. |
| `volume` | number | `1` | Event level multiplier. |
| `waveType` | integer | `SINE` | One of the five waveform values. |
| `pan` | number | `0` | Starting stereo position. |
| `panEnd` | number | `0` | Ending stereo position. |
| `frequencyEnd` | number | `0` | Ending frequency; 0 keeps the starting pitch. |
| `lfoFreq` | number | `0` | Vibrato rate in Hz. |
| `lfoDepth` | number | `0` | Vibrato depth in Hz. |

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

`pans` cannot contain more entries than the pitch array. `playChord` does not
accept sweep or vibrato fields.

## `playPattern(options)`

Schedules a monophonic sequence. The required `steps` array must contain only
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
| `panEnd` | number | `0` | Inherited ending pan. |
| `frequencyEnd` | number | `0` | Inherited sweep target. |
| `lfoFreq` | number | `0` | Inherited vibrato rate. |
| `lfoDepth` | number | `0` | Inherited vibrato depth. |

Step keys:

| Key | Type | Description |
| --- | --- | --- |
| `note` | string | Pitch name; exclusive with `frequency` and `rest`. |
| `frequency` | number | Pitch in Hz; exclusive with `note` and `rest`. |
| `rest` | Boolean | Must be exactly `true` for a rest. |
| `duration` | integer | Step length in ms. |
| `noteValue` | string | Step length derived from `bpm`. |
| `attack`, `release`, `volume`, `waveType` | number | Override the pattern value for this step. |
| `pan`, `panEnd`, `frequencyEnd`, `lfoFreq`, `lfoDepth` | number | Override motion or vibrato for this step. |

Step timing precedence is `duration`, step `noteValue`, pattern `noteValue`,
pattern `stepDuration`, then 100 ms. Only one pattern remains pending at a
time. Starting another one cancels steps that have not fired.

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
| `not_string`, `not_array`, `not_boolean` | A field has the wrong container or primitive type. |
| `invalid_note` | A note name cannot be parsed. |
| `unsupported_note_value` | A note value is not one of the six supported values. |
| `missing_required` | A required chord pitch array is absent. |
| `missing_pitch_or_rest` | A pattern step has no pitch and is not a rest. |
| `conflicting_pitch_fields` | A call or step provides more than one pitch source. |
| `invalid_voice_count` | A chord has fewer than 1 or more than 32 pitches. |
| `invalid_step_count` | A pattern has fewer than 1 or more than 512 steps. |
| `too_many_values` | `pans` is longer than the chord. |
| `attack_greater_or_equal_duration` | An explicit attack leaves no time for the event. |
| `release_exceeds_remaining_duration` | An explicit release does not fit after attack. |

Explicit values are not clamped. Read `getDefaults().limits` when accepting
user input and decide in the app whether to reject or constrain it.
