> Source snapshot: official TiSynthEngine documentation at commit `b07c97c762be5905f132cecf33e9d60ea0c21316` (2026-11-02). Published 1.0.2; local 1.1.0 candidates; public API 1.0.0. Upstream `documentation/native-variation.md` SHA-256: `30bbf837a163372aa0d369c6c8e267dc8fc2d3349e8ae30c51d13d20c88cb7eb`.

# Native per-attack variation

`variation` lets the engine choose bounded parameter values when it admits an attack. Repeated shots can have different pitch, noise color or filter settings without JavaScript randomization. Each voice keeps the chosen values for its lifetime; existing envelopes, sweeps and LFOs continue from that starting configuration.

Android and iOS support this dictionary in the local 1.1.0 packages, with public API version `1.0.0` and variation schema version `1`. The published 1.0.2 packages do not accept it. The local packages have not been published as a release.

## Select the local package

Install the matching locally built Android and iOS 1.1.0 archives in the app and select them in `tiapp.xml`:

```xml
<modules>
  <module platform="android" version="1.1.0">ti.synthengine</module>
  <module platform="iphone" version="1.1.0">ti.synthengine</module>
</modules>
```

Rebuild and reinstall the application after replacing native modules. Copying module files alone does not update an installed app. Keep the published 1.0.2 archives separate; the new property does not change the reported public API version.

## Detect support and start playback

Check both metadata fields. API version alone does not identify variation support. Omit the property completely when either announcement is missing, including when the requested amount is zero.

```javascript
var synth = require('ti.synthengine')
var contract = synth.getDefaults()
var supportsVariation = !!(contract.capabilities
  && contract.capabilities.variation === true
  && contract.variationSchemaVersion === 1)
var W = contract.waveTypes

synth.start({ maxVoices: 8, maxSequences: 1 })
synth.setVolume({ volume: 0.6 })
```

The following examples use those variables. Handle rejected publications through the normal [return values and diagnostics](api.md#return-values). For rapid effects, size the shared voice pool for overlapping durations and releases.

## Supported locations

| Call or score field | Behavior |
| --- | --- |
| `playTone({ variation, ... })` | Chooses once for an admitted timed tone |
| `playChord({ variation, ... })` | Admits the whole chord atomically and chooses independent values for each voice |
| `noteOn({ variation, ... })` | Chooses at the held voice's attack; sustain and release keep that configuration |
| `playSequence({ voice: { variation, ... }, ... })` | Supplies the default for sounding steps on every native loop |
| `steps[i].overrides.variation` | Replaces the entire dictionary inherited from the sequence voice |
| `updateSequence({ voice, steps, ... })` | Changes future attacks when the revision applies |
| `updateVoice({ variation, ... })` | Rejected; live edits must name the parameters they change |

Schema 1 varies `volume`, `filterHz`, `filterQ`, `fmDepth`, `noiseRate`, `lowPassHz`, `pulseWidth` and `pitchCents`. Waveform, table contents, ADSR, duration, cadence, FM ratio, routing, priority and voice count retain their authored values.

## Dictionary reference

```javascript
var variation = {
  amount: 0.5,
  seed: 42,
  ranges: {
    volume: [0.20, 0.30],
    pitchCents: [-24, 24]
  }
}
```

| Field | Default | Accepted values |
| --- | --- | --- |
| `amount` | `1` | Finite number from `0` to `1` |
| `seed` | Omitted; engine selects a native stream | Integer from `0` to `4294967295`; `0` is an explicit deterministic seed |
| `ranges` | Empty dictionary | Any subset of the eight range names below |

Only these keys are accepted. A range must contain exactly two finite numbers in ascending order. Equal endpoints are valid. Strings, booleans, `null`, `NaN`, infinity, reversed bounds and unknown names are rejected. An empty range dictionary makes no parameter changes and consumes no variation event.

The frequency ceiling is the active engine's `limits.frequency.max` value from `getDefaults()`. The maximum is `sampleRate * 0.45`, with a 19,845 Hz fallback before startup. Read `getDefaults()` again after `start()` when preparing device-specific ranges.

| Range | Inclusive validation bounds | Required source or setting |
| --- | --- | --- |
| `volume` | `0` to `2` | Any source; existing chord compensation follows selection |
| `filterHz` | `20` Hz to the active frequency ceiling | Enabled resonant filter: `lowpass`, `highpass` or `bandpass` |
| `filterQ` | `0.5` to `10` | Enabled resonant filter |
| `fmDepth` | `0` to `10` | `SINE`, with the normal FM ratio/depth rules |
| `noiseRate` | `1` Hz to the active frequency ceiling | `NOISE` with authored `noiseRate >= 1` |
| `lowPassHz` | `20` Hz to the active frequency ceiling | One-pole low-pass already enabled with authored `lowPassHz >= 20` |
| `pulseWidth` | `0.05` to `0.95` | `SQUARE` |
| `pitchCents` | `-1200` to `1200` cents | Resulting tuned frequencies and active pitch endpoints must remain within engine limits |

`filterHz` controls the resonant filter; `lowPassHz` controls the separate one-pole low-pass. A range cannot enable a bypassed filter or turn white noise into colored noise. Pitch cents change oscillator pitch; use `noiseRate` to change a noise source's clock. A zero-depth sine can start with an active FM-depth range when the remaining FM configuration is valid.

## What amount means

The engine samples each named range uniformly, independently of JavaScript property order. For absolute parameters:

```text
selected = authored + amount * (sampled - authored)
```

For example, with authored `filterHz: 1000` and range `[600, 1400]`, amount `0.25` permits 900 to 1100 Hz; amount `0.5` permits 800 to 1200 Hz; amount `1` uses the full range. Amount describes deviation from the authored value. A range may sit entirely above or below that value, in which case the deviation is biased in that direction.

Pitch uses a multiplicative ratio after tuning and detune:

```text
ratio = 2 ** (amount * sampledCents / 1200)
selectedFrequency = tunedFrequency * ratio
```

The same pitch ratio applies to an active `frequencyEnd`, preserving the sweep's interval. Other range names change their starting value while the corresponding authored sweep endpoint stays fixed. For example, varying `noiseRate` does not rewrite `noiseRateEnd`.

Omitting `variation` or using a valid dictionary with `amount: 0` preserves the authored recipe and consumes no variation event. Both still obey normal noise initialization; a noise waveform can differ between attacks without this feature. Equal range endpoints force that selected field to their common value at amount `1`.

Validation checks the complete reachable configuration before admission, including every chord or step pitch, tuning, detune and active sweep endpoint. Invalid dictionaries are rejected even at amount zero. The engine does not clip invalid bounds into an acceptable recipe.

## Repeated independent effects

Leave out `seed` to obtain successive native selections. Call `playTone` for each actual shot; keep the application's existing firing clock.

```javascript
function fireLaser() {
  var tone = {
    frequency: 900, frequencyEnd: 180,
    waveType: W.SQUARE, pulseWidth: 0.35,
    duration: 180, attack: 2, decay: 40, sustain: 0.25,
    release: 90, volume: 0.22
  }
  if (supportsVariation) tone.variation = {
    amount: 0.6,
    ranges: { pulseWidth: [0.25, 0.45], pitchCents: [-36, 36] }
  }
  return synth.playTone(tone)
}
fireLaser()
```

The engine samples after admission and before initializing filters, smoothing controls and trajectories. Rejected attacks do not consume a selection. Existing release tails, capacity policy and voice replacement still apply.

## Chords and application gain

One chord is one atomic publication. Each voice uses its position within that attack to obtain independent field samples; it does not reuse the first voice's result. If the chord cannot be admitted, none of its voices starts and no event is consumed.

Scale a volume range with the same application gain as the authored volume. Let the engine apply its existing chord compensation once.

```javascript
var gain = 0.7
var chord = {
  notes: ['C4', 'E4', 'G4'], waveType: W.TRIANGLE,
  duration: 500, attack: 4, release: 120,
  volume: 0.30 * gain
}
if (supportsVariation) chord.variation = {
  ranges: {
    volume: [0.24 * gain, 0.30 * gain],
    pitchCents: [-8, 8]
  }
}
synth.playChord(chord)
```

If an effect consists of separate layers, prepare each layer's ranges and gain independently. Variation does not change how many layers or voices the effect needs.

## Sustained voices and explicit live edits

A held voice samples once. Moving a slider, releasing another note or revising a sequence does not resample it. A live edit explicitly replaces its named parameter through the existing smoothing behavior.

```javascript
var held = {
  voiceId: 71, frequency: 220, waveType: W.SINE,
  attack: 12, release: 180, volume: 0.18,
  fmRatio: 2, fmDepth: 1.4
}
if (supportsVariation) held.variation = {
  ranges: { fmDepth: [1.1, 1.7], pitchCents: [-10, 10] }
}
synth.noteOn(held)
synth.updateVoice({ voiceId: 71, volume: 0.12 })
synth.noteOff({ voiceId: 71 })
```

`updateVoice` rejects `variation`. To obtain another varied attack, release the owned voice and start another through the normal ownership path. A sustained motor stays steady under a single held attack. Release owned IDs on cancellation, pause and teardown; keep the usual bounded handling of rejected releases.

## Native loops and dictionary inheritance

The transport selects at sounding attacks on every native loop, including independent samples for chord voices. Rests and attacks rejected by capacity consume none. Native loop variation does not need a JavaScript timer or a loop-finished callback.

A step without `overrides.variation` inherits the root dictionary. Supplying that field replaces the whole dictionary, including its amount, ranges and seed declaration. It does not merge individual ranges. A step can therefore opt out with `{ amount: 0 }` or replace pitch variation with a filter-only dictionary.

```javascript
var voice = {
  waveType: W.SINE, attack: 2, decay: 70,
  sustain: 0.2, release: 80, volume: 0.16,
  fmRatio: 2, fmDepth: 1.4
}
var steps = [
  { notes: [60, 67] },
  { rest: true },
  { notes: [64] }
]
if (supportsVariation) {
  voice.variation = {
    seed: 20261101,
    ranges: { fmDepth: [1.1, 1.7], pitchCents: [-12, 12] }
  }
  steps[2].overrides = { variation: { amount: 0 } }
}
var sequenceId = synth.playSequence({
  timeUnit: 'beats', stepDuration: 0.25, loop: true,
  voice: voice, steps: steps
})
```

A revision changes future attacks when it applies. Existing voices retain their selected values. Supply the complete replacement dictionary, including a seed you intend to retain:

```javascript
if (supportsVariation && sequenceId > 0) {
  synth.updateSequence({
    sequenceId: sequenceId,
    voice: { variation: {
      seed: 20261101, amount: 0.5,
      ranges: { fmDepth: [1.1, 1.7], pitchCents: [-12, 12] }
    } }
  })
}
```

The root voice merges with the existing sequence voice on revision. Omitting `variation` from an updated root does not remove a dictionary already stored there. To clear it for future inherited attacks, publish an amount-zero replacement. Explicit step dictionaries still take precedence; revise those steps as well when disabling the whole score.

```javascript
if (supportsVariation && sequenceId > 0) {
  synth.updateSequence({
    sequenceId: sequenceId,
    voice: { variation: { amount: 0 } }
  })
}
```

Stop the owned sequence through the normal lifecycle when it is no longer needed. Stop/new play starts a new stream.

## Seeds and reproducibility

| Usage | Reproducibility |
| --- | --- |
| Repeated standalone calls with the same recipe and explicit seed | Reproduce the selected parameter values, starting at event zero each time |
| Standalone calls without a seed | Use successive native selections |
| Seeded native loop | Advances its attack counter across loop iterations |
| Revision with unchanged seed identity | Retains that counter |
| Revision that changes the root seed | Resets the counter when the revision applies |
| Stop followed by a new sequence | Starts a new counter |

Seed identity includes whether the root seed was declared and its value, plus the sorted multiset of explicit step seed declarations. Moving steps, swapping existing declarations or inserting inherited rests preserves that identity. Adding, removing or changing an explicit step seed declaration changes it and resets the counter. Prefer a root seed for comparisons of a complete score.

The counter is an unsigned 64-bit value and wraps modulo `2^64`. Admitted attack, voice ordinal and field slot determine each sample through the shared integer helper. Field slots are stable, so changing dictionary property order or adding an unrelated range does not shift existing field samples. Variation state is separate from the noise generator. A reproducible seed promises selected parameters, not identical noise PCM or identical DSP output across platforms.

## Rejected configurations

These examples are intentionally invalid when variation is supported:

```javascript
// NOISE is required for a noiseRate range.
synth.playTone({ waveType: W.SINE,
  variation: { ranges: { noiseRate: [1000, 2000] } } })

// Zero amount still validates the inverted range.
synth.playTone({ variation: {
  amount: 0, ranges: { volume: [0.4, 0.2] }
} })

// Live updates do not accept an attack-only dictionary.
synth.updateVoice({ voiceId: 71,
  variation: { ranges: { pitchCents: [-10, 10] } } })
```

Also check pitch corners near 1 Hz or the reported ceiling. A valid base pitch can become invalid when its tuning, detune and maximum pitch offset combine. Keep module diagnostics when a recipe is rejected; a `false` return can also mean unavailable engine state or a full command queue.

## Studio and game integration

Studio calls this control Variantes. Its displayed percentage maps linearly: 25% sends native amount `0.25`, 50% sends `0.5`, and 100% sends `1`. Studio prepares broader ranges for its editor. The games retain their authored range profiles.

Frontier automatically applies authored ranges only to its eligible destruction sounds; Guardian applies them only to its two lasers. Both require the capability/schema pair and keep their existing recipes on older modules. Studio allows any source to opt in through compatible parameter ranges. See [Studio's control and preset guide](https://github.com/macCesar/TiSynth-Studio/blob/main/documentation/variation.md); the native contract in this document does not depend on a consumer app.

## Implementation and verification

Both renderers use [`shared/synth_variation.h`](https://github.com/macCesar/TiSynthEngine/blob/433d7884800f70fb4803dbfe2e0e869cd5411889/shared/synth_variation.h): stable schema slots, integer-defined SplitMix64 finalization and exact uint32-to-uniform conversion. Parsing prepares a fixed 144-byte configuration outside the audio callback. The callback performs bounded arithmetic without allocation, locks, JavaScript calls or entropy services.

Focused checks cover known vectors, both native validators, attack admission, chord ordinals, sustained stability, loops, revisions, rejection and old-renderer compatibility with controlled noise initialization. [Technical verification](native-variation-validation.md) records the measured memory/callback cost and its limits. Host results do not certify physical latency or listening quality on every device.
