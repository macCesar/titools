> Source snapshot: official TiSynthEngine 1.0.0 beta documentation at commit `95901c98af5353b86d9dc7c60b29ab9186b038cd` (2026-10-14). Upstream `documentation/examples.md` SHA-256: `53a8bd95215cc24a35776edb8686fa0d60c5399be0b4ff2685eee1563738f6cb`.

# Examples

Every snippet on this page uses the TiSynthEngine 1.0.0 contract. Unless a
snippet includes startup code, it assumes the engine is already running.

```javascript
var synth = require('ti.synthengine')
var contract = synth.getDefaults()
var WAVE = contract.waveTypes

if (contract.apiVersion !== '1.0.0') {
  throw new Error('TiSynthEngine 1.0.0 is required')
}
```

<!-- TOC-START -->
## Contents

- [Start once after layout](#start-once-after-layout)
- [Built-in waveforms](#built-in-waveforms)
- [Variable-rate filtered noise](#variable-rate-filtered-noise)
- [Pulse-width sweep](#pulse-width-sweep)
- [Stepped wavetable](#stepped-wavetable)
- [Fixed controls on a chord](#fixed-controls-on-a-chord)
- [Wave-shaping pattern overrides](#wave-shaping-pattern-overrides)
- [Pitch sweep and pan movement](#pitch-sweep-and-pan-movement)
- [Vibrato](#vibrato)
- [Chord with an even spread](#chord-with-an-even-spread)
- [Chord with explicit pans](#chord-with-explicit-pans)
- [Tempo, note values and swing](#tempo-note-values-and-swing)
- [Millisecond pattern](#millisecond-pattern)
- [Step overrides](#step-overrides)
- [Noise percussion](#noise-percussion)
- [Xylophone sketch](#xylophone-sketch)
- [Simon-style pads](#simon-style-pads)
- [Pluck and electric piano](#pluck-and-electric-piano)
- [Bell](#bell)
- [Wah and filtered laser](#wah-and-filtered-laser)
- [Kick and hi-hat in one pattern](#kick-and-hi-hat-in-one-pattern)
- [Detuned chords](#detuned-chords)
- [Chain patterns with `patternend`](#chain-patterns-with-patternend)
- [Rules across keys](#rules-across-keys)
- [Speaker-safe startup](#speaker-safe-startup)
- [Validation at an input boundary](#validation-at-an-input-boundary)
- [Stop and clean up](#stop-and-clean-up)
- [Positioned headphone effect](#positioned-headphone-effect)

<!-- TOC-END -->

## Start once after layout

```javascript
var started = false
var timer = null

function onPostLayout () {
  if (timer !== null) clearTimeout(timer)
  timer = setTimeout(function () {
    timer = null
    win.removeEventListener('postlayout', onPostLayout)
    started = synth.startEngine({
      maxVoices: 16,
      mixingProfile: 'conservative'
    })
  }, 250)
}

function cleanup () {
  win.removeEventListener('postlayout', onPostLayout)
  if (timer !== null) clearTimeout(timer)
  if (started) synth.shutdown()
}

win.addEventListener('postlayout', onPostLayout)
win.addEventListener('close', cleanup)
win.open()
```

## Built-in waveforms

```javascript
var names = ['SINE', 'SQUARE', 'SAWTOOTH', 'TRIANGLE', 'NOISE']

names.forEach(function (name, index) {
  setTimeout(function () {
    synth.playTone({
      note: 'A4',
      duration: 400,
      attack: 8,
      release: 100,
      volume: 0.6,
      waveType: WAVE[name]
    })
  }, index * 500)
})
```

Noise ignores pitch, but `note` keeps the event shape valid.

## Variable-rate filtered noise

```javascript
synth.playTone({
  frequency: 100,
  duration: 760,
  attack: 1,
  release: 580,
  volume: 0.65,
  waveType: WAVE.NOISE,
  noiseRate: 12000,
  noiseRateEnd: 600,
  lowPassHz: 2400,
  bitDepth: 8
})
```

`noiseRate` starts at 12 kHz and falls to 600 Hz. `lowPassHz` removes high
frequency energy after the 8-bit source quantizer.

## Pulse-width sweep

```javascript
synth.playTone({
  note: 'A3',
  duration: 700,
  attack: 3,
  release: 180,
  volume: 0.55,
  waveType: WAVE.SQUARE,
  pulseWidth: 0.1,
  pulseWidthEnd: 0.86
})
```

The square duty cycle moves from 10 percent to 86 percent over the event.

## Stepped wavetable

```javascript
synth.playTone({
  note: 'D4',
  duration: 650,
  attack: 4,
  release: 220,
  volume: 0.58,
  waveType: WAVE.WAVETABLE,
  waveTable: [-1, -0.7, -0.1, 0.8, 1, 0.35, -0.25, -0.55],
  bitDepth: 8
})
```

The table repeats as a stepped cycle. `bitDepth: 8` quantizes each table value
before filtering and the amplitude envelope.

## Fixed controls on a chord

```javascript
synth.playChord({
  notes: ['A3', 'E4', 'A4'],
  duration: 900,
  attack: 8,
  release: 220,
  volume: 0.5,
  waveType: WAVE.SQUARE,
  pulseWidth: 0.22,
  lowPassHz: 3600,
  bitDepth: 8,
  pans: [-0.65, 0, 0.65]
})
```

Chord voices share fixed shaping controls. Sweep fields such as
`pulseWidthEnd` and `noiseRateEnd` are not accepted by `playChord()`.

## Wave-shaping pattern overrides

```javascript
synth.playPattern({
  stepDuration: 210,
  attack: 2,
  release: 80,
  volume: 0.48,
  waveType: WAVE.NOISE,
  noiseRate: 12000,
  lowPassHz: 2600,
  bitDepth: 8,
  steps: [
    { frequency: 120, duration: 180, release: 150, noiseRateEnd: 800 },
    { rest: true, duration: 100 },
    {
      note: 'A3',
      duration: 300,
      release: 120,
      waveType: WAVE.SQUARE,
      pulseWidth: 0.1,
      pulseWidthEnd: 0.82,
      lowPassHz: 0,
      bitDepth: 0
    },
    {
      note: 'D4',
      duration: 360,
      release: 160,
      waveType: WAVE.WAVETABLE,
      waveTable: [-1, -0.7, -0.1, 0.8, 1, 0.35, -0.25, -0.55]
    }
  ]
})
```

Pattern roots provide inherited values. Each sounding step can override the
source and any shaping control; a `WAVETABLE` step needs a local or inherited
`waveTable`.

## Pitch sweep and pan movement

```javascript
synth.playTone({
  frequency: 180,
  frequencyEnd: 1200,
  pan: -0.9,
  panEnd: 0.9,
  duration: 950,
  attack: 5,
  release: 160,
  volume: 0.55,
  waveType: WAVE.SAWTOOTH
})
```

Set `frequencyEnd: 0` to keep the starting pitch. Set `panEnd` equal to `pan`
when no stereo movement is wanted.

## Vibrato

```javascript
synth.playTone({
  note: 'E4',
  duration: 1600,
  attack: 100,
  release: 300,
  volume: 0.7,
  waveType: WAVE.SINE,
  lfoFreq: 5.2,
  lfoDepth: 6
})
```

`lfoFreq` and `lfoDepth` are both in hertz. A depth of 6 Hz is gentle around
E4; use your ears when moving the same setting to a much lower note.

## Chord with an even spread

```javascript
synth.playChord({
  notes: ['C4', 'E4', 'G4', 'C5'],
  duration: 1200,
  attack: 120,
  release: 360,
  volume: 0.65,
  waveType: WAVE.TRIANGLE,
  panSpread: 0.85
})
```

## Chord with explicit pans

```javascript
synth.playChord({
  frequencies: [261.63, 329.63, 392, 523.25],
  duration: 900,
  attack: 20,
  release: 240,
  volume: 0.62,
  waveType: WAVE.SINE,
  pans: [-0.8, -0.25, 0.25, 0.8]
})
```

Use `playChord` for a known simultaneous group. Launching four separate tones
is not atomic and gives each one full event gain.

## Tempo, note values and swing

```javascript
synth.playPattern({
  bpm: 132,
  swing: 0.12,
  noteValue: '8n',
  attack: 4,
  release: 55,
  volume: 0.55,
  waveType: WAVE.SQUARE,
  steps: [
    { note: 'C4' },
    { note: 'E4' },
    { rest: true },
    { note: 'G4' },
    { note: 'C5', noteValue: '4n' }
  ]
})
```

Swing offsets scheduled starts without changing voice durations: positive swing delays even steps and advances odd steps (zero-based); negative swing reverses those offsets. Each offset is the swing value times that step's duration, and a start before the call time is clamped to zero. This can overlap voices. Keep it subtle unless the lurch is the intended effect.

## Millisecond pattern

```javascript
synth.playPattern({
  pan: -0.4,
  panEnd: 0.4,
  waveType: WAVE.TRIANGLE,
  steps: [
    { note: 'C5', duration: 90 },
    { rest: true, duration: 20 },
    { note: 'D5', duration: 90 },
    { rest: true, duration: 20 },
    { note: 'E5', duration: 90 },
    { rest: true, duration: 20 },
    { note: 'G5', duration: 180 }
  ]
})
```

Each `duration` sets both the voice length and the advance to the next step.
The 90 ms tones followed by 20 ms rests put the first four notes 110 ms apart;
the last tone lasts 180 ms. Rests provide actual silence. `release` only fades
within a sounding step, not a separate gate. The pattern root does not accept
`duration`, and `stepDuration` is only a fallback when a step has no timing.

## Step overrides

```javascript
synth.playPattern({
  bpm: 100,
  noteValue: '8n',
  attack: 10,
  release: 90,
  volume: 0.5,
  waveType: WAVE.SINE,
  steps: [
    { note: 'C4' },
    {
      note: 'E4',
      waveType: WAVE.SAWTOOTH,
      pan: -0.7,
      panEnd: 0.7,
      lfoFreq: 7,
      lfoDepth: 10
    },
    { rest: true },
    { note: 'G4', volume: 0.75, noteValue: '4n' }
  ]
})
```

## Noise percussion

```javascript
synth.playPattern({
  bpm: 116,
  noteValue: '16n',
  volume: 0.32,
  waveType: WAVE.NOISE,
  steps: [
    { frequency: 200, attack: 1, decay: 70, sustain: 0, release: 60 },
    { rest: true },
    { frequency: 200, attack: 1, decay: 32, sustain: 0, release: 25 },
    { frequency: 200, attack: 1, decay: 32, sustain: 0, release: 25 },
    { rest: true },
    { frequency: 200, attack: 1, decay: 52, sustain: 0, release: 44 }
  ]
})
```

The steps retain the sixteenth-note grid. Short decay with `sustain: 0` makes
each hit settle to silence before its step ends, without changing that grid.
Every sounding step needs `frequency` or `note`, including a noise step. Do not
write a primitive step such as `200`; primitive steps return
`invalid_step_type`.

## Xylophone sketch

```javascript
function playBar (note, pan) {
  return synth.playTone({
    note: note,
    duration: 520,
    attack: 2,
    release: 430,
    volume: 0.62,
    waveType: WAVE.TRIANGLE,
    pan: pan
  })
}

playBar('C5', -0.7)
setTimeout(function () { playBar('E5', -0.2) }, 130)
setTimeout(function () { playBar('G5', 0.3) }, 260)
setTimeout(function () { playBar('C6', 0.75) }, 390)
```

These are deliberately independent strikes. Their releases overlap, so leave
headroom in `volume` and choose enough `maxVoices` for the tails.

## Simon-style pads

```javascript
var simonPitches = [329.63, 440, 554.37, 659.25]

function playPad (index) {
  return synth.playTone({
    frequency: simonPitches[index],
    duration: 340,
    attack: 6,
    release: 90,
    volume: 0.62,
    waveType: WAVE.SQUARE
  })
}

function playAllPads () {
  return synth.playChord({
    frequencies: simonPitches,
    duration: 480,
    attack: 8,
    release: 120,
    volume: 0.58,
    waveType: WAVE.SQUARE,
    pans: [-0.75, -0.25, 0.25, 0.75]
  })
}
```

## Pluck and electric piano

`decay` and `sustain` turn a flat tone into an instrument. The electric piano
adds an FM index that falls with the level, so the attack is bright and the
tail is mellow.

```javascript
function pluck (note) {
  return synth.playTone({
    note: note,
    duration: 900,
    attack: 2,
    decay: 260,
    sustain: 0.18,
    release: 380,
    volume: 0.6,
    waveType: WAVE.TRIANGLE
  })
}

function electricPiano (note) {
  return synth.playTone({
    note: note,
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
}
```

## Bell

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

A fractional `fmRatio` puts the overtones between harmonics, which reads as
metal. `fmDepthEnd: 0` lets the brightness die away completely.

## Wah and filtered laser

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

setTimeout(function () {
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
}, 1300)
```

The cutoff sweep spans the whole event, so a longer note sweeps more slowly.

## Kick and hi-hat in one pattern

Each step can carry its own envelope and filter.

```javascript
synth.playPattern({
  bpm: 110,
  noteValue: '8n',
  steps: [
    {
      frequency: 150,
      frequencyEnd: 42,
      noteValue: '4n',
      attack: 1,
      decay: 140,
      sustain: 0.3,
      release: 120,
      volume: 0.85
    },
    {
      frequency: 440,
      waveType: WAVE.NOISE,
      attack: 1,
      decay: 30,
      sustain: 0.25,
      release: 45,
      volume: 0.45,
      filterType: 'highpass',
      filterHz: 7000
    },
    { rest: true },
    {
      frequency: 440,
      waveType: WAVE.NOISE,
      attack: 1,
      decay: 30,
      sustain: 0.25,
      release: 45,
      volume: 0.45,
      filterType: 'highpass',
      filterHz: 7000
    }
  ]
})
```

## Detuned chords

Repeat a pitch with small offsets in `detunes` to make it beat and widen. Two
copies 12 cents apart at 440 Hz beat about three times a second.

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

setTimeout(function () {
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
}, 2400)
```

Each repeated pitch is a voice. The second chord needs `maxVoices` of at least
6.

## Chain patterns with `patternend`

```javascript
var jingles = [
  [{ note: 'C5' }, { note: 'E5' }, { note: 'G5' }],
  [{ note: 'G5' }, { note: 'E5' }, { note: 'C5' }]
]
var nextJingle = 0

function playNextJingle () {
  if (nextJingle >= jingles.length) return false
  return synth.playPattern({
    noteValue: '8n',
    attack: 5,
    release: 60,
    volume: 0.5,
    waveType: WAVE.SQUARE,
    steps: jingles[nextJingle++]
  })
}

function onPatternEnd (event) {
  if (event.completed) playNextJingle()
}

synth.addEventListener('patternend', onPatternEnd)
playNextJingle()

// When the audio owner closes:
synth.removeEventListener('patternend', onPatternEnd)
```

The event reports `completed: false` when another pattern replaces the running
one, so a listener that only chains on `completed: true` never double-starts.

## Rules across keys

Some combinations are rejected even when every value is in range. This call
returns `false` with `sustain_without_decay`, because a sustain below 1 with no
decay would jump in level and click:

```javascript
// Rejected on purpose: sustain needs a decay.
var accepted = synth.playTone({ note: 'A4', sustain: 0.5 })

// Accepted: the same note with a decay.
synth.playTone({ note: 'A4', decay: 200, sustain: 0.5, duration: 800 })
```

## Speaker-safe startup

```javascript
var accepted = synth.startEngine({
  maxVoices: 12,
  mixingProfile: 'speakerSafe'
})

if (accepted) synth.setVolume({ volume: 0.85 })
```

This profile lowers source gain and the limiter ceiling. It cannot repair a
speaker that physically struggles with a very low pitch, so test the real
device and raise the pitch when needed.

## Validation at an input boundary

```javascript
function playUserFrequency (input) {
  var limits = synth.getDefaults().limits.frequency
  var frequency = Number(input)

  if (!isFinite(frequency)) return false
  if (frequency < limits.min || frequency > limits.max) return false

  return synth.playTone({ frequency: frequency })
}
```

The native contract rejects bad values rather than clamping them. Validation in
the app lets you give the user a specific message before the call reaches the
module.

## Stop and clean up

```javascript
synth.stopAll()

// Later, when the audio owner closes:
synth.shutdown()
```

`stopAll()` fades current voices but leaves pending pattern scheduling alone.
`shutdown()` cancels the scheduler and releases the native stream.

The complete interactive demo is in the upstream [`example/app.js`](https://github.com/macCesar/TiSynthEngine/blob/95901c98af5353b86d9dc7c60b29ab9186b038cd/example/app.js). For additional retro effects, playable xylophone interaction, memory pads, layered polyphony and cancellable repetition, continue with [Curated sound and interaction recipes](recipes.md).

## Positioned headphone effect

Check the installed coordinate limits and keep the engine running. This JavaScript places one generated noise effect above and to the right; it does not change other sound calls:

```javascript
if (!contract.limits.spatialX || !contract.limits.spatialY) {
  throw new Error('This installed module does not report binaural support')
}
if (!synth.playTone({
  frequency: 90,
  waveType: WAVE.NOISE,
  duration: 500,
  attack: 2,
  release: 200,
  volume: 0.3,
  spatialX: 0.8,
  spatialY: 0.75
})) Ti.API.warn('Positioned effect rejected')
```

For app switches, amplitude sliders, all nine screen positions and routing multiple effects through one service, use the [binaural integration guide](guide.md#integrate-binaural-in-a-2d-app). Omitting both coordinates disables binaural for that event; setting both to zero keeps it enabled at the front center.
