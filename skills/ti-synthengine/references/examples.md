> Source snapshot: official TiSynthEngine 1.0.0 documentation at commit `6685b81` (2026-08-29).

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
- [Five waveforms](#five-waveforms)
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
- [Speaker-safe startup](#speaker-safe-startup)
- [Validation at an input boundary](#validation-at-an-input-boundary)
- [Stop and clean up](#stop-and-clean-up)

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

## Five waveforms

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
    { note: 'C4', duration: 150 },
    { note: 'E4', duration: 150 },
    { rest: true },
    { note: 'G4', duration: 150 },
    { note: 'C5', duration: 280, noteValue: '4n' }
  ]
})
```

Positive swing lengthens one step and shortens the next. Negative swing flips
that relationship. Keep it subtle unless the lurch is the intended effect.

## Millisecond pattern

```javascript
synth.playPattern({
  stepDuration: 110,
  pan: -0.4,
  panEnd: 0.4,
  waveType: WAVE.TRIANGLE,
  steps: [
    { note: 'C5', duration: 90 },
    { note: 'D5', duration: 90 },
    { note: 'E5', duration: 90 },
    { note: 'G5', duration: 180 }
  ]
})
```

`stepDuration` controls spacing. Per-step `duration` controls how long the
sound itself lasts. The pattern root does not accept `duration`.

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
    { frequency: 200, duration: 70, attack: 1, release: 60 },
    { rest: true },
    { frequency: 200, duration: 32, attack: 1, release: 25 },
    { frequency: 200, duration: 32, attack: 1, release: 25 },
    { rest: true },
    { frequency: 200, duration: 52, attack: 1, release: 44 }
  ]
})
```

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

The complete interactive demo is `example/app.js` in the upstream TiSynthEngine repository. For additional retro effects, playable xylophone interaction, memory pads, layered polyphony and cancellable repetition, continue with [Curated sound and interaction recipes](recipes.md).
