> Source snapshot: official TiSynthEngine 1.0.0 beta documentation at reviewed local commit `7ab31107302d9b7027a6359ba1a6fdb49c250407` (2026-10-23); this synchronization does not publish that commit or a release. Upstream `documentation/sound-design.md` SHA-256: `dd543e07c825aaf67a0a5f85619088a8d02721a9d33dbf4579edf760dad3e262`.

# Sound design with TiSynthEngine

TiSynthEngine generates sound with oscillators, without recorded samples. Pitch, waveform, envelope, movement and level define each sound, from interface feedback and musical cues to alarms, retro effects and simple percussion.

Additional [curated recipes](recipes.md) provide application sound and interaction variants.

The examples assume the engine is running and use these constants:

```javascript
var synth = require('ti.synthengine')
var WAVE = synth.getDefaults().waveTypes
```

<!-- TOC-START -->
## Contents

- [Notes, frequencies and octaves](#notes-frequencies-and-octaves)
- [Waveform and timbre](#waveform-and-timbre)
- [Filter, pulse width and quantization](#filter-pulse-width-and-quantization)
- [Envelope and total duration](#envelope-and-total-duration)
- [Decay and sustain](#decay-and-sustain)
- [Pan and movement](#pan-and-movement)
- [Vibrato and the LFO](#vibrato-and-the-lfo)
- [Resonant filter](#resonant-filter)
- [Frequency modulation](#frequency-modulation)
- [Detune](#detune)
- [Chords, polyphony and gain](#chords-polyphony-and-gain)
- [Mixing profiles and limiter](#mixing-profiles-and-limiter)
- [Speakers, headphones and devices](#speakers-headphones-and-devices)
- [Recipes](#recipes)
- [Holding a sound and adding movement](#holding-a-sound-and-adding-movement)
- [Native space and creative drive](#native-space-and-creative-drive)

<!-- TOC-END -->

## Notes, frequencies and octaves

Frequency is the number of waveform cycles per second, measured in hertz. A 440 Hz oscillator repeats 440 times each second. TiSynthEngine accepts a frequency directly or converts a note name for you:

```javascript
synth.playTone({ frequency: 440 })
synth.playTone({ note: 'A4' })
```

Both calls have the same pitch. Note names use an octave number: `C4` is middle C, `C5` is one octave higher, and `C3` is one octave lower. Moving up one octave doubles frequency; moving down halves it.

The note parser accepts English letters and solfege. Sharps use `#`; flats use a lowercase `b`.

```text
C4  C#4  Db4  D4
DO4 DO#4 REb4 RE4
```

When no octave is present, octave 4 is used. The supported octave digit is 0 through 9, subject to the current frequency ceiling.

The tuning system is twelve-tone equal temperament with A4 at 440 Hz. Each semitone multiplies frequency by the twelfth root of two:

```text
frequency = 440 * 2 ^ ((midiNote - 69) / 12)
```

Equal temperament keeps intervals consistent in every key. It also means a major third is the practical keyboard interval, not a pure 5:4 frequency ratio. That distinction rarely matters for game or interface sounds.

## Waveform and timbre

Pitch says how fast the oscillator repeats. Waveform says how it moves within each cycle, which determines the harmonic content and perceived timbre.

### Sine

`SINE` contains the fundamental and no intentional overtones. Use it for clean beeps, soft bass notes and unobtrusive sounds. On a small speaker, very low sines may be quiet or may excite the speaker's own distortion because there are no upper harmonics to carry the pitch.

### Square

`SQUARE` contains strong odd harmonics. It sounds hollow, bright and electronic. Try it for retro game cues and clear melodic prompts. The extra high-frequency energy makes it more assertive than a sine at the same pitch.

### Sawtooth

`SAWTOOTH` contains both even and odd harmonics. It is the densest pitched waveform in the module and reads as buzzy or brassy. Use it for alarms, arcade leads and short sweeps. Square and sawtooth are band-limited with PolyBLEP to reduce aliasing at discontinuities.

### Triangle

`TRIANGLE` contains odd harmonics that fall off faster than a square wave. It has more body than a sine without the hard edge of a square. It suits gentle melodies, pads and xylophone-like sketches.

### Noise

`NOISE` produces white noise rather than a repeating pitched cycle. Its `frequency` is accepted because every sound event uses the same contract, but changing that value does not tune the noise. A short envelope turns it into a click, hat or impact layer; a long envelope creates wind or static.

`noiseRate` changes the source into variable-rate sample-and-hold noise. Zero keeps the white-noise default. Lower rates hold each pseudo-random value longer and sound grainier. `noiseRateEnd` moves the rate over the event.

### Wavetable

`WAVETABLE` repeats 2 to 64 values supplied in `waveTable`. Values range from -1 to 1 and are read as steps, without interpolation. Short asymmetric tables are useful for coarse DAC-like voices, buzzy radio tones and original retro effects that do not fit the four built-in oscillator shapes.

```javascript
synth.playTone({
  note: 'D4',
  duration: 600,
  waveType: WAVE.WAVETABLE,
  waveTable: [-1, -0.8, -0.1, 0.9, 0.45, 0.1, -0.25, -0.6],
  bitDepth: 8
})
```

Try the built-in sources at a moderate level before choosing one:

```javascript
synth.playSequence({ timeUnit: 'ms', stepDuration: 550,
  voice: { attack: 8, release: 120, volume: 0.65 },
  steps: [WAVE.SINE, WAVE.SQUARE, WAVE.SAWTOOTH, WAVE.TRIANGLE, WAVE.NOISE]
    .map(function (waveType) {
      return { notes: [69], length: 330, overrides: { waveType: waveType } }
    })
})
```

## Filter, pulse width and quantization

`lowPassHz` enables a per-voice one-pole low-pass filter. It is most obvious on noise, square and sawtooth sources. Zero bypasses the filter. For resonance, high-pass and band-pass shapes or a moving cutoff, use the [resonant filter](#resonant-filter) below.

`pulseWidth` controls how much of each square-wave cycle stays high. The 0.5 default is a normal square. Values closer to 0.05 or 0.95 become thinner and brighter. `pulseWidthEnd` creates a linear duty-cycle sweep.

```javascript
synth.playTone({
  note: 'A3',
  duration: 700,
  release: 180,
  waveType: WAVE.SQUARE,
  pulseWidth: 0.1,
  pulseWidthEnd: 0.86,
  lowPassHz: 4200
})
```

`bitDepth` rounds the oscillator or noise amplitude to a fixed number of levels before filtering. Values from 2 to 16 are accepted. Zero preserves the floating-point signal. Quantization adds harmonic grit; it does not change the audio device's output format.

## Envelope and total duration

Every event uses an attack, an implicit sustain section and a release:

```text
silence -> attack -> full level -> release -> silence
          |<---------- duration ---------->|
```

`duration` is the total time, not the sustain time. If duration is 500 ms, attack is 50 ms and release is 100 ms, the full-level middle lasts 350 ms.

Short attacks feel immediate. A 0 or 1 ms attack can be useful for percussion, but an abrupt start at an unlucky phase can sound like a click. Values between 5 and 15 ms keep most game feedback crisp without a hard edge.

Long attacks soften the onset. Use 100 to 500 ms for pads and slow warnings. Release controls how the sound leaves: 20 to 80 ms feels tight, while several hundred milliseconds leaves a tail.

Explicit attack and release values must fit. These relationships are required:

```text
attack < duration
release <= duration - attack
```

Defaults are adjusted internally if a very short duration leaves no room, but values supplied by the caller are never reshaped silently.

## Decay and sustain

Plucked strings, struck keys and mallets start loud and settle. A flat envelope cannot do that, so `decay` and `sustain` add a stage after the attack: the level falls from full scale to `sustain` over `decay` milliseconds, then holds until the release.

```text
decay: 0                    flat tone, the default
decay: 260, sustain: 0.18   pluck: loud start, settles low
decay: 2000, sustain: 0.02  bell or mallet: fades by itself
```

Practical starting regions:

- plucks and keys: attack 2 to 10 ms, decay 100 to 400 ms, sustain 0.1 to 0.4;
- struck percussion with a pitch drop: decay about half the duration, sustain near 0.3;
- bells and mallets: decay over most of the duration, sustain near 0.

`sustain` below 1 needs a nonzero `decay`. Without one the level would jump instantly, which clicks, so the call is rejected with `sustain_without_decay`.

The release scales the level the note has reached. If the release begins while the decay is still running, the note leaves smoothly from that point. The decay still has to fit: `attack` plus `decay` cannot exceed `duration`, and the 50 ms default attack counts. Set a short `attack` explicitly for a tight pluck.

## Pan and movement

`pan` ranges from -1 on the left to 1 on the right. Zero is centered. Stereo movement is a straight interpolation from `pan` to `panEnd` over the event.

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

Phone speakers are often mono or close together, so pan may be subtle. Treat it as extra detail rather than the only cue that distinguishes two sounds.

`frequencyEnd` makes a linear pitch sweep. Use an upward sweep for activation or reward and a downward sweep for dismissal, power-down or impact.

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

The low-frequency oscillator modulates pitch. `lfoFreq` is the modulation rate in cycles per second, and `lfoDepth` is the maximum pitch movement in hertz.

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

A rate around 4 to 7 Hz with a small depth sounds like musical vibrato. A fast rate or large depth becomes an effect. Because depth is measured in hertz, 8 Hz is a larger musical interval on a low note than on a high note.

## Resonant filter

`filterType` adds a filter that removes or emphasizes part of the spectrum. It has 12 dB per octave of slope, twice as steep as the one-pole `lowPassHz` filter, and can be combined with it (`lowPassHz` runs first).

- `lowpass` darkens the sound. A sawtooth through a closing low-pass reads as a zap or a sound moving away; an opening one reads as a swell.
- `highpass` thins the sound by removing body. It makes hats, hiss and tinny effects out of noise.
- `bandpass` keeps one band around `filterHz`, which gives vocal, nasal and wah-like colors.

Filters shape harmonics, so give them a source that has some: `SAWTOOTH`, `SQUARE` and `NOISE` respond strongly. A sine has only its fundamental, so a filter mostly changes its level.

`filterQ` is the resonance. The default 0.7071 is flat. Values from 2 to 4 add character, and above about 6 the filter whistles around the cutoff. A low-pass or high-pass boosts the cutoff region by about `filterQ`, so Q 10 is roughly 20 dB. Lower the event `volume` as Q goes up. The limiter catches peaks, but a resonance that keeps hitting it makes the whole mix pump. The band-pass keeps unity gain at its center for every Q and only narrows.

`filterHzEnd` moves the cutoff over the whole event. The motion is exponential, so each second covers the same musical distance. Set it above `filterHz` to open the filter and below to close it. Zero disables the sweep.

```javascript
synth.playTone({
  note: 'A2',
  duration: 1000,
  attack: 10,
  release: 200,
  volume: 0.5,
  waveType: WAVE.SAWTOOTH,
  filterType: 'bandpass',
  filterHz: 350,
  filterHzEnd: 2400,
  filterQ: 5
})
```

## Frequency modulation

FM makes rich, bright and metallic sounds from a plain sine. A second sine, the modulator, bends the pitch of the first one, the carrier. Turn it on with `fmDepth` or `fmDepthEnd`, on a `SINE` voice.

- `fmRatio` is the modulator frequency as a multiple of the carrier's. Whole numbers (1, 2, 3) keep the added overtones on the harmonic series, so the pitch stays clear and the sound reads as organ- or piano-like. Fractional ratios such as 1.4142 or 3.5 put the overtones between harmonics, which reads as bells, glass and metal.
- `fmDepth` is the modulation index and works like a brightness control. Around 0.5 to 1.5 it warms a sine, 2 to 5 makes it bright and rich, and values near 10 get harsh.
- `fmDepthEnd` moves the index over the event. Starting high and ending low gives a bright attack that mellows, which is the signature of electric pianos, bells and mallets. Pair it with `decay` so the level falls with the brightness.

FM does not change the sine's amplitude, so gain staging is the same as for a plain sine. There is no band-limiting: a high carrier with a large index and ratio puts sidebands above the Nyquist frequency, where they alias into inharmonic noise. Keep bell carriers modest, around 500 Hz, or lower the index.

## Detune

`detune` shifts a pitch by cents, hundredths of a semitone. Two tones a few cents apart drift in and out of phase and beat at a rate close to `frequency * (2 ^ (cents / 1200) - 1)`. A 12-cent gap at 440 Hz beats about 3 times a second. Slow beating (0.5 to 4 Hz) sounds warm and wide, like a chorus; past about 20 cents it starts to sound out of tune.

Use `detune` on a single tone to vary the pitch slightly between repetitions. The effect comes from stacking detuned copies. In a chord, give `detunes` one entry per pitch and repeat a pitch to thicken it:

```javascript
synth.playChord({
  frequencies: [440, 440],
  detunes: [-6, 6],
  duration: 2000,
  attack: 200,
  release: 600,
  volume: 0.55,
  waveType: WAVE.SINE
})
```

Each repeated pitch is a voice, so size `maxVoices` for the full stack. Protected profiles divide per-voice source gain by the square root of the event voice count. This reduces buildup; it does not guarantee equal loudness. Correlated voices can still reinforce each other, and detuned voices can produce peaks as their phases align. `raw` does not apply this event normalization.

## Chords, polyphony and gain

`playChord` is for notes that should start together. The call is placed in the native queue as one event, so the audio callback sees the whole chord or none of it. In protected profiles, per-voice source gain is divided by the square root of the chord's voice count. This approximately stabilizes power for uncorrelated voices, not coherent copies; it does not guarantee constant peaks or perceived loudness. `raw` bypasses this normalization.

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

Four separate `playTone` calls are four independent full-gain events. They are not atomic and may start in different audio callbacks. Their sum is also hotter and can push the limiter. Separate calls are correct for unrelated taps or effects; use `playChord` when the app already knows the pitches are one chord.

`maxVoices` sets voice capacity without changing loudness. Timed-only pools replace the least remaining duration; held/transport pools prefer a releasing voice, then the oldest attack. Leave a small margin for release tails, but do not set 32 by habit when the app can only make four sounds at once.

## Mixing profiles and limiter

Choose the profile once in `start()`:

| Profile        | Practical use                                                     |
| -------------- | ----------------------------------------------------------------- |
| `conservative` | Default for mixed effects, chords and unpredictable overlap.      |
| `balanced`     | More level for mostly monophonic sounds.                          |
| `speakerSafe`  | Lower source gain and a 0.70 ceiling for small speakers.          |
| `raw`          | Full source gain; useful only when the app owns all gain staging. |

Protected profiles calibrate source gain by waveform and event voice count. The final stereo-linked limiter catches exceptional peaks with 10 ms of lookahead and a 100 ms release. Its ceiling is 0.85, or 0.70 for `speakerSafe`.

The limiter protects against peaks. If it engages on every note, lower event volume or choose a more conservative profile instead of using it to raise loudness. Repeatedly starting the same long sound before its previous release ends raises and lowers the sum, which can produce audible pumping. That overlap is useful as a stress test, but it is a poor reference for the tone's normal quality.

## Speakers, headphones and devices

Headphones usually reproduce bass and stereo movement more cleanly than a phone speaker. A sound that is smooth in headphones can buzz on a small driver even when the digital signal never clips. Low pitches and square or sawtooth waves are the most demanding.

For speaker-facing sounds:

- begin with `conservative` or `speakerSafe`;
- keep important pitches above roughly 200 Hz;
- use short attacks instead of an instantaneous full-scale edge;
- test at several system volume settings on the target device;
- keep critical meaning in rhythm and pitch, not pan alone.

Different phones have different sample rates, speaker protection and acoustic resonances. Test the real device family. A desktop browser or simulator cannot answer whether a small speaker will rattle.

## Recipes

These recipes use only the 1.0.0 contract and keep explicit envelopes valid. Adjust pitch and volume to fit the app's other audio; the recipe values are starting points, not mastering targets.

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

The short sine is cleaner than a full-band noise click. Raise the frequency for a lighter control or lower it for a heavier one.

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
synth.setTempo({ bpm: 150 })
synth.playSequence({
  timeUnit: 'beats',
  stepDuration: 0.5,
  voice: { attack: 8, release: 70, volume: 0.55, waveType: WAVE.SAWTOOTH },
  steps: [
    { notes: [69] },
    { notes: [76] },
    { notes: [69] },
    { notes: [76] }
  ]
})
```

### Retro pickup

```javascript
synth.setTempo({ bpm: 180 })
synth.playSequence({
  timeUnit: 'beats',
  stepDuration: 0.25,
  swing: 0.06,
  voice: { attack: 2, release: 45, volume: 0.5, waveType: WAVE.SQUARE },
  steps: [
    { notes: [72] },
    { notes: [76] },
    { notes: [79] },
    { notes: [84], duration: 0.5 }
  ]
})
```

The first three intervals are sixteenth notes and the last is an eighth note. Gate sets when release begins; `length` overrides that note duration independently of the next attack.

### Noise percussion

```javascript
synth.setTempo({ bpm: 112 })
synth.playSequence({
  timeUnit: 'beats',
  stepDuration: 0.5,
  voice: { waveType: WAVE.NOISE, volume: 0.34 },
  steps: [
    { frequencies: [220], overrides: { attack: 1, decay: 65, sustain: 0, release: 55 } },
    { rest: true },
    { frequencies: [220], overrides: { attack: 1, decay: 35, sustain: 0, release: 28 } },
    { frequencies: [220], overrides: { attack: 1, decay: 35, sustain: 0, release: 28 } }
  ]
})
```

The steps keep the eighth-note grid while short decay and `sustain: 0` let each hit settle to silence inside its step.

Noise steps still need `frequencies` or `notes` because every sounding pattern step follows the same shape. The pitch value is not used by the noise source.

### Filtered noise burst

```javascript
synth.playTone({
  frequency: 120,
  duration: 760,
  attack: 1,
  release: 580,
  volume: 0.62,
  waveType: WAVE.NOISE,
  noiseRate: 12000,
  noiseRateEnd: 650,
  lowPassHz: 2500,
  bitDepth: 8
})
```

The decreasing update rate makes the texture break into slower chunks while the envelope removes energy. Reverse the two rates for an effect that becomes more frantic.

### Pluck

```javascript
synth.playTone({
  note: 'E4',
  duration: 900,
  attack: 2,
  decay: 260,
  sustain: 0.18,
  release: 380,
  volume: 0.6,
  waveType: WAVE.TRIANGLE
})
```

### Electric piano

```javascript
synth.playTone({
  note: 'E3',
  duration: 1800,
  attack: 3,
  decay: 700,
  sustain: 0.3,
  release: 600,
  volume: 0.55,
  waveType: WAVE.SINE,
  fmRatio: 1,
  fmDepth: 2.2,
  fmDepthEnd: 0.25
})
```

The index falls from 2.2 to 0.25 while the level settles, so the attack is bright and the sustain is mellow.

### Bell

```javascript
synth.playTone({
  note: 'C5',
  duration: 2600,
  attack: 1,
  decay: 2000,
  sustain: 0.02,
  release: 500,
  volume: 0.5,
  waveType: WAVE.SINE,
  fmRatio: 3.5,
  fmDepth: 4,
  fmDepthEnd: 0
})
```

The fractional ratio makes the overtones inharmonic. Try 1.4142 or 2.76 for a different metal.

### Wah

The wah in [Resonant filter](#resonant-filter) is also a recipe. Reverse the two cutoffs for a sound that closes instead of opening.

### Filtered laser

```javascript
synth.playTone({
  frequency: 1600,
  frequencyEnd: 160,
  duration: 340,
  attack: 2,
  release: 90,
  volume: 0.4,
  waveType: WAVE.SAWTOOTH,
  filterType: 'lowpass',
  filterHz: 7000,
  filterHzEnd: 500,
  filterQ: 4
})
```

### Hi-hat

```javascript
synth.playTone({
  duration: 80,
  attack: 1,
  decay: 30,
  sustain: 0.25,
  release: 45,
  volume: 0.45,
  waveType: WAVE.NOISE,
  filterType: 'highpass',
  filterHz: 7000
})
```

For an open hat, use `duration: 320`, `decay: 70` and `release: 220`.

### Thick pad

```javascript
synth.playChord({
  notes: ['A3', 'E4', 'A3', 'E4', 'A3', 'E4'],
  detunes: [-9, -9, 0, 0, 9, 9],
  duration: 3200,
  attack: 700,
  release: 1300,
  volume: 0.5,
  waveType: WAVE.SAWTOOTH,
  filterType: 'lowpass',
  filterHz: 1500,
  panSpread: 0.8
})
```

Six voices play two pitches, each in three slightly different tunings. The low-pass takes the harshness off the sawtooth stack. Start the engine with `maxVoices` of at least 6.

### Kick

```javascript
synth.playTone({
  frequency: 150,
  frequencyEnd: 42,
  duration: 320,
  attack: 1,
  decay: 150,
  sustain: 0.3,
  release: 140,
  volume: 0.85,
  waveType: WAVE.SINE
})
```

The pitch drop is the punch and the decay is the thump. A phone speaker cannot reproduce 42 Hz, so raise `frequencyEnd` toward 70 for speaker playback.

### Simon-style cues

Use short, distinct square-wave pitches. Play one tone for the sequence and one atomic chord only when demonstrating all pads together.

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

See [Examples](examples.md) for complete code and [Recommendations](recommendations.md) for gain and device-testing advice.

## Holding a sound and adding movement

Choose a held voice when the ending follows a player action instead of a fixed duration: motor, charge beam, pad or the last chord of a ceremony. `noteOn` starts a positive app-owned ID; `noteOff` begins release from the current level, and compatible `updateVoice` edits ramp over 10 ms. Distinct IDs remain independent events with fixed gain. Reserve enough capacity for their releases and unrelated effects, and release on cancellation as well as ordinary key up. See the [held motor recipe](advanced-examples.md#sustained-game-motor) for retry/cleanup handling.

A fanfare can use beat or millisecond sequences with native chords, rests, gate, independent length, swing and pitch-ordered arpeggios. A long release can ring over later steps. Use held voices when release follows presentation or interaction. See [transport usage](guide.md#choose-the-musical-transport).

The two additional voice LFOs move filter cutoff, square PWM or sine FM index using sine/triangle shapes. Cutoff movement creates slow breathing or rhythmic filtering; PWM adds changing harmonic color; a small FM-index modulation varies brightness. Free rates reach 20 Hz, and synced rates follow native transport tempo. These slots are separate from pitch vibrato. Avoid deep/high-rate modulation with strong resonance or high-frequency FM; safe parameter clamping does not guarantee a pleasant or alias-free sound. The [two-LFO example](advanced-examples.md#two-voice-lfos) shows a filtered PWM pad.

## Native space and creative drive

| Processor | What changes | Useful starting region |
| --- | --- | --- |
| Stereo chorus | A short interpolated delay with offset LFO phases adds width and movement. | Rate 0.3 to 0.8 Hz, depth 0.15 to 0.35, mix 0.08 to 0.2. |
| Ping-pong delay | Alternating echoes create rhythmic or spatial repeats. | 180 to 350 ms or synced eighths, feedback 0.15 to 0.35, mix 0.08 to 0.18. |
| Stereo reverb | Damped comb/allpass reflections create a diffuse decay. | Decay 0.8 to 1.8 seconds, damping 0.5 to 0.7, mix 0.08 to 0.18. |
| Optional saturation | Soft waveshaping adds harmonics and changes attack/timbre. | Drive 1.2 to 1.6 with a small blend; compare at matched levels. |

All processors are off initially, with input gain 1. Enable one shared chain through `setMasterProcessing`; select `applyTo` categories such as `music` and `ambience` to keep explosions dry. Per-voice `effectSend` overrides that category selection. [Configuration](advanced-examples.md#chorus-delay-reverb-and-creative-saturation) and [exact ranges](api.md#setmasterprocessingoptions) explain chorus, delay, reverb and optional saturation.

Disabling an effect closes its input gradually and drains the tail before exact bypass; it does not immediately erase its history. Panic invalidates histories. Saturation is a creative choice rather than automatic gain protection; the final limiter stays in place. Match dry/wet comparison levels and watch accumulated limiter reduction so a louder version does not win an A/B comparison merely by level. None of these effects makes a small speaker reproduce missing bass.
