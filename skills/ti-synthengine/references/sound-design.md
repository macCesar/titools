> Source snapshot: official TiSynthEngine 1.0.0 documentation at commit `6685b81` (2026-08-29).

# Sound design with TiSynthEngine

TiSynthEngine builds sounds from oscillators. There is no recorded sample
underneath a tone: pitch, waveform, envelope, movement and level describe the
whole sound. That small set of controls is enough for interface feedback,
musical cues, alarms, retro effects and simple percussion.

The examples assume the engine is running and use these constants:

```javascript
var synth = require('ti.synthengine')
var WAVE = synth.getDefaults().waveTypes
```

<!-- TOC-START -->
## Contents

- [Notes, frequencies and octaves](#notes-frequencies-and-octaves)
- [Waveform and timbre](#waveform-and-timbre)
- [Envelope and total duration](#envelope-and-total-duration)
- [Pan and movement](#pan-and-movement)
- [Vibrato and the LFO](#vibrato-and-the-lfo)
- [Chords, polyphony and gain](#chords-polyphony-and-gain)
- [Mixing profiles and limiter](#mixing-profiles-and-limiter)
- [Speakers, headphones and devices](#speakers-headphones-and-devices)
- [Recipes](#recipes)

<!-- TOC-END -->

## Notes, frequencies and octaves

Frequency is the number of waveform cycles per second, measured in hertz. A
440 Hz oscillator repeats 440 times each second. TiSynthEngine accepts a
frequency directly or converts a note name for you:

```javascript
synth.playTone({ frequency: 440 })
synth.playTone({ note: 'A4' })
```

Both calls have the same pitch. Note names use an octave number: `C4` is middle
C, `C5` is one octave higher, and `C3` is one octave lower. Moving up one
octave doubles frequency; moving down halves it.

The note parser accepts English letters and solfege. Sharps use `#`; flats use
a lowercase `b`.

```text
C4  C#4  Db4  D4
DO4 DO#4 REb4 RE4
```

When no octave is present, octave 4 is used. The supported octave digit is 0
through 9, subject to the current frequency ceiling.

The tuning system is twelve-tone equal temperament with A4 at 440 Hz. Each
semitone multiplies frequency by the twelfth root of two:

```text
frequency = 440 * 2 ^ ((midiNote - 69) / 12)
```

Equal temperament keeps intervals consistent in every key. It also means a
major third is the practical keyboard interval, not a pure 5:4 frequency
ratio. That distinction rarely matters for game or interface sounds.

## Waveform and timbre

Pitch says how fast the oscillator repeats. Waveform says how it moves within
each cycle, which determines the harmonic content and perceived timbre.

### Sine

`SINE` contains the fundamental and no intentional overtones. It works for
clean beeps, soft bass notes and sounds that should stay out of the way. On a
small speaker, very low sines may be quiet or may excite the speaker's own
distortion because there are no upper harmonics to carry the pitch.

### Square

`SQUARE` contains strong odd harmonics. It sounds hollow, bright and electronic.
It is a good starting point for retro game cues and clear melodic prompts. The
extra high-frequency energy makes it more assertive than a sine at the same
pitch.

### Sawtooth

`SAWTOOTH` contains both even and odd harmonics. It is the densest pitched
waveform in the module and reads as buzzy or brassy. Use it for alarms, arcade
leads and short sweeps. Square and sawtooth are band-limited with PolyBLEP to
reduce aliasing at discontinuities.

### Triangle

`TRIANGLE` contains odd harmonics that fall off faster than a square wave. It
has more body than a sine without the hard edge of a square. It suits gentle
melodies, pads and xylophone-like sketches.

### Noise

`NOISE` produces white noise rather than a repeating pitched cycle. Its
`frequency` is accepted because every sound event uses the same contract, but
changing that value does not tune the noise. A short envelope turns it into a
click, hat or impact layer; a long envelope creates wind or static.

Try every waveform at a moderate level before choosing one:

```javascript
;[WAVE.SINE, WAVE.SQUARE, WAVE.SAWTOOTH, WAVE.TRIANGLE, WAVE.NOISE]
  .forEach(function (waveType, index) {
    setTimeout(function () {
      synth.playTone({
        note: 'A4',
        waveType: waveType,
        duration: 450,
        attack: 8,
        release: 120,
        volume: 0.65
      })
    }, index * 550)
  })
```

## Envelope and total duration

Every event uses an attack, an implicit sustain section and a release:

```text
silence -> attack -> full level -> release -> silence
          |<---------- duration ---------->|
```

`duration` is the total time, not the sustain time. If duration is 500 ms,
attack is 50 ms and release is 100 ms, the full-level middle lasts 350 ms.

Short attacks feel immediate. A 0 or 1 ms attack can be useful for percussion,
but an abrupt start at an unlucky phase can sound like a click. Values between
5 and 15 ms keep most game feedback crisp without a hard edge.

Long attacks soften the onset. Use 100 to 500 ms for pads and slow warnings.
Release controls how the sound leaves: 20 to 80 ms feels tight, while several
hundred milliseconds leaves a tail.

Explicit attack and release values must fit. These relationships are required:

```text
attack < duration
release <= duration - attack
```

Defaults are adjusted internally if a very short duration leaves no room, but
values supplied by the caller are never reshaped silently.

## Pan and movement

`pan` ranges from -1 on the left to 1 on the right. Zero is centered. Stereo
movement is a straight interpolation from `pan` to `panEnd` over the event.

```javascript
synth.playTone({
  note: 'E5',
  pan: -0.9,
  panEnd: 0.9,
  duration: 900,
  attack: 10,
  release: 120,
  waveType: WAVE.TRIANGLE
})
```

Phone speakers are often mono or close together, so pan may be subtle. Treat it
as extra detail rather than the only cue that distinguishes two sounds.

`frequencyEnd` makes a linear pitch sweep. Use an upward sweep for activation
or reward and a downward sweep for dismissal, power-down or impact.

```javascript
synth.playTone({
  frequency: 180,
  frequencyEnd: 920,
  duration: 420,
  attack: 4,
  release: 90,
  waveType: WAVE.SAWTOOTH,
  volume: 0.55
})
```

## Vibrato and the LFO

The low-frequency oscillator modulates pitch. `lfoFreq` is the modulation rate
in cycles per second, and `lfoDepth` is the maximum pitch movement in hertz.

```javascript
synth.playTone({
  note: 'A4',
  duration: 1400,
  attack: 80,
  release: 240,
  lfoFreq: 5.5,
  lfoDepth: 7,
  waveType: WAVE.SINE
})
```

A rate around 4 to 7 Hz with a small depth sounds like musical vibrato. A fast
rate or large depth becomes an effect. Because depth is measured in hertz, 8 Hz
is a larger musical interval on a low note than on a high note.

## Chords, polyphony and gain

`playChord` is for notes that should start together. The call is placed in the
native queue as one event, so the audio callback sees the whole chord or none
of it. Its source gain is divided by the square root of the chord's voice count
to keep power stable.

```javascript
synth.playChord({
  notes: ['C4', 'E4', 'G4', 'B4'],
  duration: 1500,
  attack: 180,
  release: 450,
  volume: 0.65,
  waveType: WAVE.TRIANGLE,
  pans: [-0.75, -0.25, 0.25, 0.75]
})
```

Four separate `playTone` calls are four independent full-gain events. They are
not atomic and may start in different audio callbacks. Their sum is also hotter
and can push the limiter. Separate calls are correct for unrelated taps or
effects; use `playChord` when the app already knows the pitches are one chord.

`maxVoices` is capacity, not a loudness control. When the pool is full, the
voice with the least time remaining is faded and reused. Leave a small margin for release tails, but do
not set 32 by habit when the app can only make four sounds at once.

## Mixing profiles and limiter

Choose the profile once in `startEngine()`:

| Profile | Practical use |
| --- | --- |
| `conservative` | Default for mixed effects, chords and unpredictable overlap. |
| `balanced` | More level for mostly monophonic sounds. |
| `speakerSafe` | Lower source gain and a 0.70 ceiling for small speakers. |
| `raw` | Full source gain; useful only when the app owns all gain staging. |

Protected profiles calibrate source gain by waveform and event voice count.
The final stereo-linked limiter catches exceptional peaks with 10 ms of
lookahead and a 100 ms release. Its ceiling is 0.85, or 0.70 for `speakerSafe`.

The limiter is protection, not a loudness effect. If it works on every note,
lower event volume or choose a more conservative profile. Repeatedly starting
the same long sound before its previous release ends raises and lowers the sum,
which can produce audible pumping. That overlap is useful as a stress test, but
it is a poor reference for the tone's normal quality.

## Speakers, headphones and devices

Headphones usually reproduce bass and stereo movement more cleanly than a phone
speaker. A sound that is smooth in headphones can buzz on a small driver even
when the digital signal never clips. Low pitches and square or sawtooth waves
are the most demanding.

For speaker-facing sounds:

- begin with `conservative` or `speakerSafe`;
- keep important pitches above roughly 200 Hz;
- use short attacks instead of an instantaneous full-scale edge;
- test at several system volume settings on the target device;
- keep critical meaning in rhythm and pitch, not pan alone.

Different phones have different sample rates, speaker protection and acoustic
resonances. Test the real device family. A desktop browser or simulator cannot
answer whether a small speaker will rattle.

## Recipes

These recipes use only the 1.0.0 contract and keep explicit envelopes valid.
Tune pitch and volume for the app's other audio rather than treating the values
as mastering targets.

### Interface click

```javascript
synth.playTone({
  frequency: 1200,
  duration: 32,
  attack: 1,
  release: 24,
  volume: 0.35,
  waveType: WAVE.SINE
})
```

The short sine is cleaner than a full-band noise click. Raise the frequency for
a lighter control or lower it for a heavier one.

### Confirmation hit

```javascript
synth.playTone({
  frequency: 760,
  frequencyEnd: 1040,
  duration: 150,
  attack: 3,
  release: 90,
  volume: 0.6,
  waveType: WAVE.TRIANGLE
})
```

### Soft pad

```javascript
synth.playChord({
  notes: ['C4', 'G4', 'C5', 'E5'],
  duration: 2600,
  attack: 480,
  release: 900,
  volume: 0.55,
  waveType: WAVE.TRIANGLE,
  panSpread: 0.8
})
```

### Two-tone alarm

```javascript
synth.playPattern({
  bpm: 150,
  noteValue: '8n',
  attack: 8,
  release: 70,
  volume: 0.55,
  waveType: WAVE.SAWTOOTH,
  steps: [
    { note: 'A4' },
    { note: 'E5' },
    { note: 'A4' },
    { note: 'E5' }
  ]
})
```

### Retro pickup

```javascript
synth.playPattern({
  bpm: 180,
  swing: 0.06,
  noteValue: '16n',
  attack: 2,
  release: 45,
  volume: 0.5,
  waveType: WAVE.SQUARE,
  steps: [
    { note: 'C5', duration: 80 },
    { note: 'E5', duration: 80 },
    { note: 'G5', duration: 80 },
    { note: 'C6', duration: 160, noteValue: '8n' }
  ]
})
```

The pattern root does not accept `duration`. Put it on each sounding step when
you want a gate shorter than its rhythmic step.

### Noise percussion

```javascript
synth.playPattern({
  bpm: 112,
  noteValue: '8n',
  waveType: WAVE.NOISE,
  volume: 0.34,
  steps: [
    { frequency: 220, duration: 65, attack: 1, release: 55 },
    { rest: true },
    { frequency: 220, duration: 35, attack: 1, release: 28 },
    { frequency: 220, duration: 35, attack: 1, release: 28 }
  ]
})
```

Noise steps still need `frequency` or `note` because every sounding pattern
step follows the same shape. The pitch value is not used by the noise source.

### Simon-style cues

Use short, distinct square-wave pitches. Play one tone for the sequence and
one atomic chord only when demonstrating all pads together.

```javascript
var SIMON = [329.63, 440, 554.37, 659.25]

function playSimonPad (index) {
  return synth.playTone({
    frequency: SIMON[index],
    duration: 340,
    attack: 6,
    release: 90,
    volume: 0.62,
    waveType: WAVE.SQUARE
  })
}

function playAllSimonPads () {
  return synth.playChord({
    frequencies: SIMON,
    duration: 520,
    attack: 8,
    release: 130,
    volume: 0.58,
    waveType: WAVE.SQUARE,
    pans: [-0.75, -0.25, 0.25, 0.75]
  })
}
```

For more complete code, continue with [Examples](examples.md) and
[Curated sound and interaction recipes](recipes.md). The latter includes retro
effects, a playable xylophone, memory-pad timbres, layered chords and timer
ownership. For gain and device-testing advice, see
[Recommendations](recommendations.md).
