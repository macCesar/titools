> Source snapshot: official TiSynthEngine 1.0.0 beta documentation at reviewed local commit `7ab31107302d9b7027a6359ba1a6fdb49c250407` (2026-10-23); this synchronization does not publish that commit or a release. Upstream `documentation/examples.md` SHA-256: `eba45d9ba675190050f4bfb15873c1c0a9821d5bc034397dcd9bc51dcdbf1e48`.

# Examples

Every snippet on this page uses the TiSynthEngine 1.0.0 contract. Unless a snippet includes startup code, it assumes the engine is already running.

Additional [curated recipes](recipes.md) provide application sound and interaction variants.

For the newer beta capabilities, begin with [held motors](advanced-examples.md#sustained-game-motor), [native sequences](advanced-examples.md#native-sequence-with-chords-and-edits), [master processing](advanced-examples.md#chorus-delay-reverb-and-creative-saturation) or [two LFOs](advanced-examples.md#two-voice-lfos). Detect methods before use; the version string alone cannot identify an installed beta build.

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
- [Chain sequences with `sequenceend`](#chain-sequences-with-sequenceend)
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
    started = synth.start({
      maxVoices: 16,
      mixingProfile: 'conservative',
      audioSession: 'ambient'
    })
    if (!started) Ti.API.warn('Audio startup failed; keep playback controls disabled')
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

The startup example uses `ambient` for game/UI feedback. On iOS it respects silent mode and mixes with other apps. The module default is `playback`; Android validates either value without changing its output. Shut down before changing the policy. Use the [interactive session controls](../assets/example/README.md#audio-session) to compare them.

## Built-in waveforms

```javascript
var names = ['SINE', 'SQUARE', 'SAWTOOTH', 'TRIANGLE', 'NOISE']
synth.playSequence({ timeUnit: 'ms', stepDuration: 500,
  voice: { attack: 8, release: 100, volume: 0.6 },
  steps: names.map(function (name) {
    return { notes: [69], length: 300, overrides: { waveType: WAVE[name] } }
  })
})
```

Noise ignores pitch; each sounding step still supplies one pitch array.

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

`noiseRate` starts at 12 kHz and falls to 600 Hz. `lowPassHz` removes high frequency energy after the 8-bit source quantizer.

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

The table repeats as a stepped cycle. `bitDepth: 8` quantizes each table value before filtering and the amplitude envelope.

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

Chord voices share fixed shaping controls. Sweep fields such as `pulseWidthEnd` and `noiseRateEnd` are not accepted by `playChord()`.

## Wave-shaping pattern overrides

```javascript
synth.playSequence({
  timeUnit: 'ms',
  stepDuration: 210,
  voice: { attack: 2, release: 80, volume: 0.48, waveType: WAVE.NOISE, noiseRate: 12000, lowPassHz: 2600, bitDepth: 8 },
  steps: [
    { frequencies: [120], duration: 180, overrides: { release: 150, noiseRateEnd: 800 } },
    { rest: true, duration: 100 },
    { notes: [57], duration: 300, overrides: { release: 120, waveType: WAVE.SQUARE, pulseWidth: 0.1, pulseWidthEnd: 0.82, lowPassHz: 0, bitDepth: 0 } },
    { notes: [62], duration: 360, overrides: { release: 160, waveType: WAVE.WAVETABLE, waveTable: [-1, -0.7, -0.1, 0.8, 1, 0.35, -0.25, -0.55] } }
  ]
})
```

Pattern roots provide inherited values. Each sounding step can override the source and any shaping control; a `WAVETABLE` step needs a local or inherited `waveTable`.

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

Set `frequencyEnd: 0` to keep the starting pitch. Set `panEnd` equal to `pan` when no stereo movement is wanted.

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

`lfoFreq` and `lfoDepth` are both in hertz. A depth of 6 Hz is gentle around E4; use your ears when moving the same setting to a much lower note.

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

Use `playChord` for a known simultaneous group. Launching four separate tones is not atomic and gives each one full event gain.

## Tempo, note values and swing

```javascript
synth.setTempo({ bpm: 132 })
synth.playSequence({
  timeUnit: 'beats',
  stepDuration: 0.5,
  swing: 0.12,
  voice: { attack: 4, release: 55, volume: 0.55, waveType: WAVE.SQUARE },
  steps: [
    { notes: [60] },
    { notes: [64] },
    { rest: true },
    { notes: [67] },
    { notes: [72], duration: 1 }
  ]
})
```

Swing adjusts pairs of intervals by `swing * min(A, B)`: the first grows and the second shrinks by that amount, preserving the pair total. Negative values reverse the adjustment. The default is 0 and the range is −0.75…0.75.

## Millisecond pattern

```javascript
synth.playSequence({
  timeUnit: 'ms',
  stepDuration: 100,
  voice: { pan: -0.4, panEnd: 0.4, waveType: WAVE.TRIANGLE },
  steps: [
    { notes: [72], duration: 90 },
    { rest: true, duration: 20 },
    { notes: [74], duration: 90 },
    { rest: true, duration: 20 },
    { notes: [76], duration: 90 },
    { rest: true, duration: 20 },
    { notes: [79], duration: 180 }
  ]
})
```

Each `duration` sets the interval until the next step. The 90 ms intervals followed by 20 ms rests place attacks 110 ms apart; a release can overlap a rest. Gate defaults to 0.8. Use `length` to choose note duration independently, while ADSR remains milliseconds.

## Step overrides

```javascript
synth.setTempo({ bpm: 100 })
synth.playSequence({
  timeUnit: 'beats',
  stepDuration: 0.5,
  voice: { attack: 10, release: 90, volume: 0.5, waveType: WAVE.SINE },
  steps: [
    { notes: [60] },
    { notes: [64], overrides: { waveType: WAVE.SAWTOOTH, pan: -0.7, panEnd: 0.7, lfoFreq: 7, lfoDepth: 10 } },
    { rest: true },
    { notes: [67], duration: 1, overrides: { volume: 0.75 } }
  ]
})
```

## Noise percussion

```javascript
synth.setTempo({ bpm: 116 })
synth.playSequence({
  timeUnit: 'beats',
  stepDuration: 0.25,
  voice: { volume: 0.32, waveType: WAVE.NOISE },
  steps: [
    { frequencies: [200], overrides: { attack: 1, decay: 70, sustain: 0, release: 60 } },
    { rest: true },
    { frequencies: [200], overrides: { attack: 1, decay: 32, sustain: 0, release: 25 } },
    { frequencies: [200], overrides: { attack: 1, decay: 32, sustain: 0, release: 25 } },
    { rest: true },
    { frequencies: [200], overrides: { attack: 1, decay: 52, sustain: 0, release: 44 } }
  ]
})
```

The steps retain the sixteenth-note grid. Short decay with `sustain: 0` makes each hit settle to silence before its step ends, without changing that grid. Every sounding step needs `frequencies` or `notes`, including a noise step. Do not write a primitive step such as `200`; primitive steps reject the complete publication.

## Xylophone sketch

```javascript
synth.playSequence({ timeUnit: 'ms', stepDuration: 130,
  voice: { attack: 2, release: 430, volume: 0.62, waveType: WAVE.TRIANGLE },
  steps: [{ notes: [72], length: 90, overrides: { pan: -0.7 } },
    { notes: [76], length: 90, overrides: { pan: -0.2 } },
    { notes: [79], length: 90, overrides: { pan: 0.3 } },
    { notes: [84], length: 90, overrides: { pan: 0.75 } }]
})
```

Native attacks are 130 ms apart. Each note releases after 90 ms and its 430 ms tail overlaps later strikes. Leave headroom and voice capacity for those tails.

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

`decay` and `sustain` shape the tone into a plucked or struck sound. The electric piano also lowers the FM index as the level falls, giving it a bright attack and a mellow tail.

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

A fractional `fmRatio` puts the overtones between harmonics, which reads as metal. `fmDepthEnd: 0` lets the brightness die away completely.

## Wah and filtered laser

```javascript
synth.playSequence({ timeUnit: 'ms',
  voice: { waveType: WAVE.SAWTOOTH },
  steps: [{ notes: [45], duration: 1300, length: 800,
    overrides: { attack: 10, release: 200, volume: 0.5,
      filterType: 'bandpass', filterHz: 350, filterHzEnd: 2400, filterQ: 5 } },
    { frequencies: [1600], duration: 340, length: 250,
      overrides: { frequencyEnd: 160, attack: 2, release: 90, volume: 0.4,
        filterType: 'lowpass', filterHz: 7000, filterHzEnd: 500, filterQ: 4 } }]
})
```

Each sweep reaches its destination at `length`, then holds there through release. Intervals and note lengths remain fixed in milliseconds when the global tempo changes.

## Kick and hi-hat in one pattern

Each step can carry its own envelope and filter.

```javascript
synth.setTempo({ bpm: 110 })
synth.playSequence({
  timeUnit: 'beats',
  stepDuration: 0.5,
  steps: [
    { frequencies: [150], duration: 1, overrides: { frequencyEnd: 42, attack: 1, decay: 140, sustain: 0.3, release: 120, volume: 0.85 } },
    { frequencies: [440], overrides: { waveType: WAVE.NOISE, attack: 1, decay: 30, sustain: 0.25, release: 45, volume: 0.45, filterType: 'highpass', filterHz: 7000 } },
    { rest: true },
    { frequencies: [440], overrides: { waveType: WAVE.NOISE, attack: 1, decay: 30, sustain: 0.25, release: 45, volume: 0.45, filterType: 'highpass', filterHz: 7000 } }
  ]
})
```

## Detuned chords

Repeat a pitch with small offsets in `detunes` to make it beat and widen. Two copies 12 cents apart at 440 Hz beat about three times a second.

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

// Alternative voicing:
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

Each repeated pitch is a voice. The second chord needs `maxVoices` of at least 6.

## Chain sequences with `sequenceend`

Use one sequence containing all steps for uninterrupted, sample-clock phrasing. The asynchronous completion event is useful for presentation or launching an unrelated cue:

```javascript
var jingleId = synth.playSequence({
  stepDuration: 0.5,
  voice: { attack: 5, release: 60, volume: 0.5, waveType: WAVE.SQUARE },
  steps: [{ notes: [72] }, { notes: [76] }, { notes: [79] }]
})
function onSequenceEnd (event) {
  if (event.sequenceId === jingleId && event.reason === 'completed') Ti.API.info('Jingle scheduled to completion')
}
synth.addEventListener('sequenceend', onSequenceEnd)
// When the owner closes:
synth.removeEventListener('sequenceend', onSequenceEnd)
```

A positive identifier acknowledges publication; 0 rejects the complete operation. Sequence completion does not guarantee audible silence: release envelopes and effect tails can continue.

## Rules across keys

Some combinations are rejected even when every value is in range. This call returns `false` with `sustain_without_decay`, because a sustain below 1 with no decay would jump in level and click:

```javascript
// Rejected on purpose: sustain needs a decay.
var accepted = synth.playTone({ note: 'A4', sustain: 0.5 })

// Accepted: the same note with a decay.
synth.playTone({ note: 'A4', decay: 200, sustain: 0.5, duration: 800 })
```

## Speaker-safe startup

```javascript
var accepted = synth.start({
  maxVoices: 12,
  mixingProfile: 'speakerSafe'
})

if (accepted) synth.setVolume({ volume: 0.85 })
```

This profile lowers source gain and the limiter ceiling. It cannot repair a speaker that physically struggles with a very low pitch, so test the real device and raise the pitch when needed.

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

The native contract rejects invalid values without clamping them. Validation in the app lets you give the user a specific message before the call reaches the module.

## Stop and clean up

```javascript
synth.stopAll()

// Later, when the audio owner closes:
synth.shutdown()
```

`stopAll()` fades current voices but leaves pending pattern scheduling alone. `shutdown()` cancels the scheduler and releases the native stream.

Follow the [interactive demo setup and test checklist](../assets/example/README.md) to run [`example/app.js`](../assets/example/app.js). It includes headphone positioning, session selection, pattern completion/replacement and all three statistics methods. For a service-level statistics recipe, see [read engine statistics](guide.md#read-engine-statistics).

## Positioned headphone effect

With the engine running, check the installed coordinate limits. This example places one generated noise effect above and to the right. Other sound calls keep their existing placement:

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

Continue with [advanced examples](advanced-examples.md).
