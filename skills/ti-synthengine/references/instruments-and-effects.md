> Source snapshot: official TiSynthEngine documentation at commit `b07c97c762be5905f132cecf33e9d60ea0c21316` (2026-11-02). Published 1.0.2; local 1.1.0 candidates; public API 1.0.0. Upstream `documentation/instruments-and-effects.md` SHA-256: `bcd7c2191bfae2b07688c9dbe19d813fe4eb8fcc45ab38d49b29dff7bdc2981c`.

# Instruments, sound effects and complete sequences

A playable instrument and a missile sound can use the same oscillator. What makes them behave differently is the complete recipe: pitch, envelope, pitch/filter movement, layers, timing, and how the app starts and ends it. This guide explains which public API to use and how to preserve that recipe.

These are application roles built on the same native synthesizer and output chain. They are not different audio engines, quality modes, or guarantees against distortion. An instrument can be noisy or inharmonic; an effect can be a single pitched tone, a chord, or a musical phrase.

## Choose the playback contract

| Intention                                                        | Native methods                              | Who ends the sound?                                      | What to preserve                                                             |
| ---------------------------------------------------------------- | ------------------------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Play a key until the finger lifts                                | `noteOn`, `updateVoice`, `noteOff`          | The app releases its unique voice ID                     | Timbre, tuning, envelope, contact ownership                                  |
| Fire one finite sound                                            | `playTone`                                  | Native duration and release                              | Original frequency, endpoints, duration, envelope, gain                      |
| Fire a simultaneous chord with shared shaping                    | `playChord`                                 | Native duration and release                              | All pitches, per-note pan/detune, shared envelope, native chord compensation |
| Play a melody, alarm, layered effect, or repeated firing pattern | `playSequence`, optionally `updateSequence` | Native step clock; `stopSequence` cancels future attacks | Complete ordered steps, rests, lengths, overrides and independent layers     |
| Add chorus, delay, reverb or creative saturation                 | `setMasterProcessing`                       | The shared processor owns its tails                      | Routing, sends, input gain, effect settings and output headroom              |

The last row describes **audio processing effects**. Those processors are different from an authored **sound effect**, such as a laser or an explosion. A laser may use no reverb or delay at all.

All examples below assume successful startup. Use constants from the installed module and check native acceptance:

```javascript
var synth = require('ti.synthengine')
var WAVE = synth.getDefaults().waveTypes
if (!synth.start({ maxVoices: 32, maxSequences: 4,
  mixingProfile: 'conservative', audioSession: 'playback' })) {
  throw new Error('Could not start TiSynthEngine')
}
synth.setVolume({ volume: 0.6 })
```

See [API limits](api.md) and [startup and lifecycle](guide.md) for application integration. Do not call `start` on each key just to reset a voice pool. Shut the engine down when its application owner finishes.

## 1. Playable instruments and sustained voices

An instrument recipe defines the response of a new note: waveform, filter, FM, envelope, level and positioning. The keyboard supplies its pitch and release gesture. Each simultaneous contact needs its own positive voice ID.

```javascript
var nextVoiceId = 1
function pressKey(frequency) {
  var voiceId = nextVoiceId++
  var accepted = synth.noteOn({ voiceId: voiceId, frequency: frequency,
    waveType: WAVE.TRIANGLE, volume: 0.16,
    attack: 8, decay: 220, sustain: 0.35, release: 180,
    bus: 'music' })
  return accepted ? voiceId : 0
}
function releaseKey(voiceId) {
  return synth.noteOff({ voiceId: voiceId })
}
```

Store the returned ID with that contact. Sliding to another key must release the old owner and admit the new attack; do not release another finger's voice. An app-level Hold control retains selected IDs until explicitly released. If `noteOff` is rejected, keep ownership and follow a bounded retry/error policy; silently forgetting the ID can leave a stuck voice. The [held voice guide](guide.md#hold-and-edit-a-voice) covers lifecycle and compatible live edits.

`noteOn` does not accept timed-event endpoint sweeps such as `frequencyEnd`. A held voice can use its supported vibrato/LFOs and compatible `updateVoice` edits. Removing a timed sweep, replacing the original frequency with the key's pitch, and holding indefinitely changes the sound's meaning: that is a new playable timbre, not an exact audition of the original effect.

A short envelope also does not automatically make a held voice finite. With `sustain: 0`, it can become silent while still requiring release of its ID. Choose a timed event for a self-contained strike when contact ownership is unnecessary.

### Instrument demonstrations are musical performances

A demo provides notes and articulation for the current timbre. It should not silently substitute another sound or replace the user's editable pattern. A useful finite phrase has an opening, development and a resolved ending:

- Winds need an appropriate register, separated attacks and breathing spaces.
- Strings benefit from longer notes and nearly connected lengths.
- Basses benefit from a low register, rests and a deliberate groove.
- Guitars and keyboards can use arpeggios, chord changes and varied note lengths.
- Percussion needs separate strikes and enough room for its decay and release.
- Slow pads need broad entries long enough for their attack to develop.
- Unpitched textures demonstrate density, filtering and movement; changing a noise clock is not the same as transposing a harmonic note.

Schedule such phrases with the native transport. Make looping an explicit application choice. See [sequences](api.md#playsequenceoptions) and [sound-design envelopes](sound-design.md#envelope-and-total-duration).

## 2. Independent finite sound effects

A sound effect often communicates a specific action: launch, impact, warning, confirmation. Its original pitch is part of that action. A rising missile and a descending shot can share the same square-wave timbre while conveying different movement.

```javascript
function fireMissile() {
  return synth.playTone({ frequency: 196, frequencyEnd: 523,
    duration: 350, waveType: WAVE.SQUARE,
    attack: 2, decay: 0, sustain: 1, release: 50,
    volume: 0.15, bus: 'effects' })
}
```

This event completes natively. Repeated independent calls can overlap naturally. Their frequencies and endpoints remain those of the recipe; they are not implicitly transposed to the key being touched.

A keyboard adapter that keeps only the square wave and envelope, starts at C7, and omits `frequencyEnd` will sound very different. Neither result establishes an engine fault: the adapter has selected a different pitch, duration model and motion. An effect audition should execute the whole recipe. Label a separately offered playable adaptation clearly.

Use `playChord` when its contract exactly represents the intended chord. It applies its own chord compensation. Independent layers authored with distinct levels, envelopes or waves are not automatically equivalent to one chord call. Preserve those layers rather than normalizing them again or flattening them into one source.

## 3. Complete sound sequences and layered effects

Some effects need multiple ordered attacks. Others combine simultaneous body, noise and high-frequency detail, each with a different envelope. A sustained key containing only the first layer cannot reproduce the complete event.

This native sequence defines a missile with 300 ms of pitch motion followed by 50 ms of release. It is a sequence interpretation, not a sample-equivalent conversion of the timed example above:

```javascript
function missileSequence() {
  return synth.playSequence({ timeUnit: 'ms', loop: false,
    voice: { waveType: WAVE.SQUARE, attack: 2,
      decay: 0, sustain: 1, release: 50, volume: 0.15,
      bus: 'effects' },
    steps: [{ frequencies: [196], duration: 350, length: 300,
      overrides: { frequencyEnd: 523 } }] })
}
```

`duration` on a sequence step is the interval until the next attack. `length` is how long that note runs before release starts. Both use the sequence's time unit; attack, decay and release remain milliseconds. A note can extend beyond its step and overlap later attacks. In a timed `playTone` call, `duration` includes release. These values cannot be copied interchangeably without accounting for release.

**Timed and sequence routes are not automatically interchangeable.** In the current native implementation, a `playTone` endpoint sweep progresses across the total timed duration, including release. A sequence endpoint sweep progresses across its explicit `length`, then holds the endpoint during release. Thus the timed 350 ms example and the sequence with `length: 300` do not have the same pitch trajectory, even though both finish after 350 ms and use the same endpoints. Sequence voices also use the held envelope's minimum 3 ms attack/release edges; very short or zero timed edges can differ. This matters most for short weapon/noise effects and is not corrected by merely copying the option names.

For consistent manual and repeated auditions, use the same native interpretation for both. Preserve the original attack length when changing only the repetition interval; each new attack may overlap the prior voice. Do not claim exact timed-to-sequence fidelity from field equality or validator acceptance. Preserving the exact timed renderer inside a native repetition would require native support for that rendering contract; it cannot be obtained by a JavaScript adapter that simply renames `duration` to `length`.

For a sequence-owned burst, `stopSequence` also releases emitted voices. To stop repetitions while preserving those attacks, publish a finite traversal with `loop: false`, retain its current effect steps and suppress later variant attacks as appropriate. Natural completion leaves emitted voices to their own lengths/releases. Retain the first attack in an update that can arrive before the initial callback. Handle publication rejection explicitly, with bounded control retries if necessary; those retries must not trigger notes or queue new sound requests.

Use complete step dictionaries and their required overrides. Do not identify variants by guessing from silence, remove an intentional gap, round source frequencies to MIDI integers, discard a sweep, or merge independent layers solely because they begin together. A source importer should carry explicit interpretation, variant boundaries and demo association alongside the recipe.

### Repeated firing uses the native clock

```javascript
function repeatShortShots(intervalMs) {
  return synth.playSequence({ timeUnit: 'ms', loop: true,
    voice: { waveType: WAVE.SQUARE, attack: 2,
      decay: 0, sustain: 1, release: 40, volume: 0.1,
      bus: 'effects' },
    steps: [{ frequencies: [1380], duration: intervalMs, length: 65,
      overrides: { frequencyEnd: 340 } }] })
}
```

Validate `intervalMs` against native limits and the application's voice budget. This example has a 105 ms event (65 ms plus 40 ms release). At a shorter interval, tails overlap; at 150 ms they have room to finish. A compound multi-attack effect also needs enough interval for its complete pattern if the app promises complete repetitions.

The app can begin an independent first attack immediately and publish delayed native repetitions, or publish a complete native repeating score with its first attack at time zero. Avoid emitting the same initial attack through both `touchstart` and `click`. JavaScript polling may display transport position, but `setInterval`/`setTimeout` should not schedule individual musical attacks.

Keep every positive sequence ID. Releasing a momentary pad, disabling a fixed burst, switching presets, backgrounding the app, and pressing Stop should cancel the sequences owned by that panel. `stopSequence` releases that sequence's voices and cancels future attacks; independent timed calls already emitted are separate and finish naturally. Stop is different from global `stopAll`/shutdown panic.

A successful stop request does not mean the native slot is already reusable. Wait for the matching `sequenceend` retirement when replacing a sequence; do not poll and enqueue a backlog of missed firing requests. Keep authored variant order explicit and advance it only for accepted work. Application recipe functions are ordinary JavaScript; there is no built-in public named-recipe registry. Local 1.1.0 candidates support optional [native per-attack variation](native-variation.md), which chooses once at each admitted attack, including native loop attacks. It does not continuously resample an already sounding voice, and `updateVoice` rejects the variation dictionary. Published 1.0.2 packages reject it entirely; require both the variation capability and schema announcement before adding that property.

## 4. Polyphony, gain and output protection

Both musical notes and effects share the voice pool and output chain. Either can distort when too many contributions sum at high gain, when filters resonate strongly, when tails overlap, or when creative saturation is enabled. A successful effect in one game does not certify arbitrary held chords, denser firing, different processing, or a device's physical speaker volume.

- `maxVoices` is a capacity, not a loudness control. Reserve for simultaneous attacks and release tails, including future overlap in a repeating score.
- `maxSequences` limits independent native tracks. Do not silently drop a layer to fit the limit.
- Check native acceptance. A positive sequence ID acknowledges publication; it does not prove every future note will find enough voices.
- Native admission can replace eligible voices under pressure. If the product promises no stealing, the application must reserve capacity across all of its sound owners and reject excess work visibly.
- Do not apply chord normalization to an already authored set of independent layers unless that gain change is intended.
- Keep headroom at voice, processor input and master stages. Preserve source gains when importing a known recipe; changing the overlap pattern still needs new validation.
- Creative `saturation` intentionally changes timbre. Final output limiting protects peaks but is not proof that the earlier mix is clean.

Use `getStats` to inspect active/tail voices, pending commands, rejected publications, priority drops and voice steals. Enable diagnostics for `preLimiterPeakDb`, `maxLimiterReductionDb`, output peaks and callback load. See [gain staging](sound-design.md#chords-polyphony-and-gain), [processing](api.md#setmasterprocessingoptions), [statistics](stats-performance.md), and [troubleshooting](troubleshooting.md). Host measurements and successful validation do not replace listening on the target speaker/headphones at the intended overlap and physical volume.

## Verify the route you actually ship

First compare an effect against its original complete recipe, including timing and levels. Separately test its playable adaptation, if offered. For instruments, test single keys, simultaneous keys, slides, Hold, release tails and finite demos. For effects, test rapid taps, native bursts, explicit variants, layered sounds, cancellation and exhausted capacity. Distinguish publication acceptance, rendered output, physical responsiveness and listening results in the report.
