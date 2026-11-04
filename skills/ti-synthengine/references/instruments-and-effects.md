> Source snapshot: official TiSynthEngine documentation at commit `9d74aa45f84d3f2822d4aab76874efe37d81257f` (2026-11-03). Published module 2.0.0. Upstream `documentation/instruments-and-effects.md` SHA-256: `3796589dd6b3ac23ad1b9808a17bc1302187b5de980b5b234521246bba745b3c`.

# Instruments, sound effects and complete sequences

A playable instrument and a missile sound can use the same oscillator. Their behavior depends on the complete recipe: pitch, envelope, pitch/filter movement, layers, timing and how the app starts and ends the sound. This guide explains which public API to use and how to preserve that recipe.

These are application roles built on the same native synthesizer and output chain. They are not different audio engines, quality modes, or guarantees against distortion. An instrument can be noisy or inharmonic; an effect can be a single pitched tone, a chord, or a musical phrase.

## Choose the playback contract

| Intention | Sound interface | Who ends the sound? |
| --- | --- | --- |
| Play a key until the finger lifts | Held definition's `play()` or `sound.noteOn()` | The owner calls its note control's `noteOff()` |
| Fire one finite sound | Tone definition's `play()` | Finite duration includes release |
| Repeat one finite tone or independent layer | Repeat definition's `play()` | Control `stop()` cancels future attacks; admitted attacks finish |
| Fire a simultaneous chord | Chord definition's `play()` | Native duration and release |
| Play an ordered score, alarm or pattern | Pattern definition's `play()` | Native clock; control `stop()` releases its voices |
| Add chorus, delay, reverb or saturation | `synth.setProcessing()` | Shared processor retains bounded tails |

The last row describes audio processing effects. Those processors are different from an authored sound effect, such as a laser or an explosion. A laser may use no reverb or delay at all.

The detailed recipes below use supported direct native calls to explain the rendering parameters. Reusable application code uses the Sound controls above; see the [Sound reference](sound-api.md). All examples assume successful startup:

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

`noteOn` does not accept timed-event endpoint sweeps such as `frequencyEnd`. A held voice can use its supported vibrato/LFOs and compatible `updateNote` edits. Removing a timed sweep, replacing the original frequency with the key's pitch, and holding indefinitely changes the sound's meaning: that is a new playable timbre, not an exact audition of the original effect.

A short envelope does not automatically end a held voice. With `sustain: 0`, it can become silent while still requiring release of its ID. Choose a timed event for a self-contained strike when contact ownership is unnecessary.

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

Use `playChord` when its contract exactly represents the intended chord. It applies its own chord compensation. Independent layers authored with distinct levels, envelopes or waves are not automatically equivalent to one chord call. Preserve those layers without normalizing them again or flattening them into one source.

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

Timed and sequence routes are not automatically interchangeable. In the current native implementation, a `playTone` endpoint sweep progresses across the total timed duration, including release. A sequence endpoint sweep progresses across its explicit `length`, then holds the endpoint during release. Thus the timed 350 ms example and the sequence with `length: 300` do not have the same pitch trajectory, even though both finish after 350 ms and use the same endpoints. Sequence voices also use the held envelope's minimum 3 ms attack/release edges; very short or zero timed edges can differ. This matters most for short weapon/noise effects and is not corrected by merely copying the option names.

For consistent manual and repeated auditions, use the same native interpretation for both. Preserve the original attack length when changing only the repetition interval; each new attack may overlap the prior voice. Do not claim exact timed-to-sequence fidelity from field equality or validator acceptance. Use the retained `repeatTone({ intervalMs, ... })` method to repeat the original finite-tone renderer directly. A JavaScript adapter that simply renames `duration` to `length` does not preserve that rendering contract.

For a sequence-owned burst, `stopSequence` also releases emitted voices. To stop repetitions while preserving those attacks, publish a finite traversal with `loop: false`, retain its current effect steps and suppress later variant attacks as appropriate. Natural completion leaves emitted voices to their own lengths/releases. Retain the first attack in an update that can arrive before the initial callback. Handle publication rejection explicitly, with bounded control retries if necessary; those retries must not trigger notes or queue new sound requests.

Use complete step dictionaries and their required overrides. Do not identify variants by guessing from silence, remove an intentional gap, round source frequencies to MIDI integers, discard a sweep, or merge independent layers solely because they begin together. A source importer should carry explicit interpretation, variant boundaries and demo association alongside the recipe.

### Repeated firing uses the native clock

For effects whose complete recipe consists of finite tone calls, pass each original recipe to `repeatTone` with `intervalMs`. Retain every returned tone ID for independent layers. Compound ordered patterns and chords keep their existing sequence/chord interpretation.

```javascript
function repeatShortShots(intervalMs) {
  return synth.repeatTone({ frequency: 1380, frequencyEnd: 340,
    duration: 105, waveType: WAVE.SQUARE, attack: 2,
    decay: 0, sustain: 1, release: 40, volume: 0.1,
    bus: 'effects', intervalMs: intervalMs })
}
var shotId = repeatShortShots(150)
if (!shotId) throw new Error('Repeating shot rejected')
// Keep the next attack deadline; use the new interval after it.
synth.updateTone({ toneId: shotId, intervalMs: 120 })
// Current 105 ms attacks finish; future attacks are cancelled.
synth.stopTone({ toneId: shotId })
```

Validate the integer interval against the native 1-60,000 ms limits and the application's overlap budget. This recipe retains the 105 ms timed attack, including its 40 ms release; shortening only the interval can overlap voices. The first attack starts at the first render opportunity. The native sample clock preserves fractional samples and is independent of tempo. This native repetition needs no JavaScript attack timer. Independent calls remain supported for gameplay events or an explicitly scheduled finite burst; `playTone` always returns Boolean acceptance. See [the standalone burst example](api.md#finite-tone-repetition).

Each layer consumes one of 32 repetition slots, independently of the four sequence slots. Each admitted attack still consumes shared voice capacity. Preserve headroom for old attacks after edits and for other owners. Rejected attacks are skipped without catch-up or variation consumption. Releasing a momentary pad, disabling fixed repetition, switching presets, backgrounding and owner close should call `stopTone` for all owned IDs. Stop remains publishable with a full ordinary queue; it cancels at the next block, including before the first attack. Global `stopAll` and shutdown also invalidate those IDs and pending edits.

`updateTone` merges changes with the last accepted recipe and validates it as a whole. It changes the next scheduled attack without advancing it. `note` and `frequency` replace each other. A supplied variation dictionary replaces the previous one, and `{ amount: 0 }` disables future variation. Each repetition advances its reproducible native stream only for admitted attacks; parameter edits retain its counter, while changing seed restarts the succession. Sounding attacks keep their original recipe. See [the complete repetition contract](api.md#finite-tone-repetition).

Native sequences remain appropriate for complete ordered scores. Keep every positive sequence ID and wait for matching `sequenceend` retirement when replacing a sequence. `stopSequence` releases that sequence's emitted voices, whereas `stopTone` lets admitted finite attacks finish. Application recipe functions remain ordinary JavaScript; there is no built-in named-recipe registry.

## 4. Polyphony, gain and output protection

Both musical notes and effects share the voice pool and output chain. Either can distort when too many contributions sum at high gain, when filters resonate strongly, when tails overlap, or when creative saturation is enabled. A successful effect in one game does not certify arbitrary held chords, denser firing, different processing, or a device's physical speaker volume.

- `maxVoices` is a capacity, not a loudness control. Reserve for simultaneous attacks and release tails, including future overlap in a repeating score.
- `maxSequences` limits independent native tracks. Do not silently drop a layer to fit the limit.
- Check native acceptance. A positive sequence ID acknowledges publication; it does not prove every future note will find enough voices.
- Native admission can replace eligible voices under pressure. If the product promises no stealing, the application must reserve capacity across all of its sound owners and reject excess work visibly.
- Do not apply chord normalization to an already authored set of independent layers unless that gain change is intended.
- Keep headroom at voice, processor input and master stages. Preserve source gains when importing a known recipe; changing the overlap pattern still needs new validation.
- Creative `saturation` intentionally changes timbre. Final output limiting protects peaks but is not proof that the earlier mix is clean.

Use `getStats` to inspect active/tail voices, pending commands, rejected publications, priority drops and voice steals. Enable diagnostics for `preLimiterPeakDb`, `maxLimiterReductionDb`, output peaks and callback load. See [gain staging](sound-design.md#chords-polyphony-and-gain), [processing](api.md#setmasterprocessingoptions), [statistics](https://github.com/macCesar/TiSynthEngine/blob/9d74aa45f84d3f2822d4aab76874efe37d81257f/documentation/stats-performance.md), and [troubleshooting](troubleshooting.md). Host measurements and successful validation do not replace listening on the target speaker/headphones at the intended overlap and physical volume.

## Verify the route you actually ship

First compare an effect against its original complete recipe, including timing and levels. Separately test its playable adaptation, if offered. For instruments, test single keys, simultaneous keys, slides, Hold, release tails and finite demos. For effects, test rapid taps, native bursts, explicit variants, layered sounds, cancellation and exhausted capacity. Distinguish publication acceptance, rendered output, physical responsiveness and listening results in the report.
