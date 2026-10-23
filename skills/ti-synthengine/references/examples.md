> Source snapshot: official TiSynthEngine 1.0.0 beta documentation from the reviewed working tree based on `6b48af568c4a50685541b4ae2800d38081e6ebb7` (2026-10-22), including uncommitted documentation updates. Upstream `documentation/examples.md` SHA-256: `90ff3eb384fabbcb104a2b5fc0e8eeac52090a7b9e399241cbc67302abbb225f`.

# Examples

Every snippet on this page uses the TiSynthEngine 1.0.0 contract. Unless a snippet includes startup code, it assumes the engine is already running. Additional [curated recipes](recipes.md) cover interaction and sound variants.

For the newer beta capabilities, begin with [held motors](#sustained-game-motor), [native sequences](#native-sequence-with-chords-and-edits), [master processing](#chorus-delay-reverb-and-creative-saturation) or [two LFOs](#two-voice-lfos). Detect methods before use; the version string alone cannot identify an installed beta build.

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
- [Sustained game motor](#sustained-game-motor)
- [Native sequence with chords and edits](#native-sequence-with-chords-and-edits)
- [Chorus, delay, reverb and creative saturation](#chorus-delay-reverb-and-creative-saturation)
- [Two voice LFOs](#two-voice-lfos)
- [Measure peaks and limiter reduction](#measure-peaks-and-limiter-reduction)

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

The startup example uses `ambient` for game/UI feedback. On iOS it respects silent mode and mixes with other apps. The module default is `playback`; Android validates either value without changing its output. Shut down before changing the policy. Use the [interactive session controls](https://github.com/macCesar/TiSynthEngine/blob/6b48af568c4a50685541b4ae2800d38081e6ebb7/example/README.md#audio-session) to compare them.

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

Each `duration` sets both the voice length and the advance to the next step. The 90 ms tones followed by 20 ms rests put the first four notes 110 ms apart; the last tone lasts 180 ms. Rests provide actual silence. `release` only fades within a sounding step, not a separate gate. The pattern root does not accept `duration`, and `stepDuration` is only a fallback when a step has no timing.

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

The steps retain the sixteenth-note grid. Short decay with `sustain: 0` makes each hit settle to silence before its step ends, without changing that grid. Every sounding step needs `frequency` or `note`, including a noise step. Do not write a primitive step such as `200`; primitive steps return `invalid_step_type`.

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

These strikes are independent events. Their releases overlap, so leave headroom in `volume` and choose enough `maxVoices` for the tails.

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

Each repeated pitch is a voice. The second chord needs `maxVoices` of at least 6.

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

The event reports `completed: false` when another pattern or a native sequence replaces the running one, so this handler does not chain from replacement. It assumes exclusive ownership of the module's single scheduler; another owner's later completion could otherwise trigger it. `shutdown()` discards a pending pattern without generating an event. Completion is not a guarantee of audible silence.

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
var accepted = synth.startEngine({
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

Follow the [interactive demo setup and test checklist](https://github.com/macCesar/TiSynthEngine/blob/6b48af568c4a50685541b4ae2800d38081e6ebb7/example/README.md) to run [`example/app.js`](https://github.com/macCesar/TiSynthEngine/blob/6b48af568c4a50685541b4ae2800d38081e6ebb7/example/app.js). It includes headphone positioning, session selection, pattern completion/replacement and all three statistics methods. For a service-level statistics recipe, see [read engine statistics](guide.md#read-engine-statistics).

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

## Sustained game motor

Assume one running engine owned by this service. The positive voice ID belongs to the app; do not reuse it during the session or share its counter with an independent audio owner. There is no `duration` or `*End` target on `noteOn`.

```javascript
if (!['noteOn', 'noteOff', 'updateVoice'].every(function (name) {
  return typeof synth[name] === 'function'
})) throw new Error('Current held-voice beta APIs are required')

var nextMotorId = 1
var motorId = null
var releaseTimers = new Set()

function startMotor () {
  if (motorId !== null) return true
  var id = nextMotorId++
  if (!synth.noteOn({ voiceId: id, frequency: 160, waveType: WAVE.NOISE,
    noiseRate: 1500, lowPassHz: 600, attack: 80, release: 120,
    filterType: 'bandpass', filterHz: 220, filterQ: 0.8, volume: 0.15 })) return false
  motorId = id
  return true
}

function changeMotor (boosted) {
  if (motorId === null) return false
  return synth.updateVoice({ voiceId: motorId,
    filterHz: boosted ? 320 : 220, volume: boosted ? 0.18 : 0.15 })
}

function releaseMotorId (id, attempt) {
  if (synth.noteOff({ voiceId: id })) return
  if (attempt >= 2) {
    closeMotorAudio()
    Ti.API.warn('Release queue stayed full; audio shut down to prevent a stuck note')
    return
  }
  var timer = setTimeout(function () {
    releaseTimers.delete(timer)
    releaseMotorId(id, attempt + 1)
  }, 16)
  releaseTimers.add(timer)
}

function stopMotor () {
  if (motorId === null) return
  var id = motorId
  motorId = null
  releaseMotorId(id, 0)
}

function closeMotorAudio () {
  releaseTimers.forEach(function (timer) { clearTimeout(timer) })
  releaseTimers.clear()
  motorId = null
  synth.shutdown()
}
```

Wire `startMotor` to acceleration/key down, `changeMotor` to a boost change, and `stopMotor` to release or cancellation. Handle a false start/update at the input boundary. On pause/owner close, call `closeMotorAudio` and start the stream again before future input. Only permanent release failure shuts down other audio. Compatible edits ramp for 10 ms without resetting the voice phase; noise clock, source, filter type and spatial position require a new attack. A stolen ID accepts updates as a no-op, so an application requiring continuous recovery must own a renewal policy; there is no reserved motor slot.

## Native sequence with chords and edits

Start the engine first and detect all four transport methods. Notes here are integer MIDI values, not the strings used by `playPattern`. Each entry occupies one sixteenth, including rests; `gate` controls the note-off point within it. Release may continue across later steps.

```javascript
if (!['playSequence', 'updateSequence', 'stopSequence', 'getSequenceState'].every(function (name) {
  return typeof synth[name] === 'function'
})) throw new Error('Current native transport beta APIs are required')

if (!synth.playSequence({ bpm: 110, swing: 0.12, loop: true, mode: 'normal',
  voice: { waveType: WAVE.TRIANGLE, attack: 8, release: 100, volume: 0.3 },
  steps: [
    { notes: [60, 64, 67], gate: 0.7 },
    { rest: true },
    { notes: [67], gate: 0.5, overrides: { volume: 0.22 } },
    { notes: [64, 67, 72], gate: 0.85 }
  ] })) throw new Error('Sequence rejected; retry or retain the previous UI state')

// Later UI edits publish configurations, not individual note timers.
if (!synth.updateSequence({ bpm: 128, swing: 0.18, voice: { volume: 0.25 } })) {
  Ti.API.warn('Edit rejected; the previous sequence remains accepted')
}
var positionTimer = setInterval(function () {
  var state = synth.getSequenceState()
  Ti.API.info(JSON.stringify({ playing: state.playing, step: state.step, revision: state.revision }))
}, 200)

function closeSequenceAudio () {
  clearInterval(positionTimer)
  // Owner teardown closes the stream, cancelling transport and timer patterns.
  synth.shutdown()
}

function stopOnlySequence () {
  // Held keys and unrelated tones continue. A rejected stop must be handled.
  if (!synth.stopSequence()) Ti.API.warn('Sequence stop rejected; retry outside render')
}
```

BPM changes at the next block while preserving musical position; structural edits apply at the next step and swing at the next pair. To replace a phrase, send the complete `steps` array. Select `up`, `down` or `updown` to reorder sounding steps by pitch; rests participate only in `normal`. `updateSequence` does not resume a stopped sequence; call `playSequence` to restart at the beginning of the traversal. Accepted publication can precede the revision reported by `getSequenceState`. Native completion has no `patternend` event; inspect `playing` for presentation state, without using UI polling to time notes. `playPattern` and `playSequence` replace each other's future events.

## Chorus, delay, reverb and creative saturation

This configures the whole mix of a running engine. Check method presence and Boolean acceptance; partial section updates merge with the last accepted settings. Effects start disabled, input gain starts at 1, and no LFOs are added to voices implicitly.

```javascript
if (typeof synth.setMasterProcessing !== 'function') {
  throw new Error('Current master-processing beta API is required')
}
if (!synth.setMasterProcessing({
  inputGain: 0.7,
  chorus: { enabled: true, rate: 0.6, depth: 0.25, mix: 0.12 },
  delay: { enabled: true, timeMs: 280, sync: 'off', feedback: 0.25, mix: 0.1 },
  reverb: { enabled: true, decay: 1.4, damping: 0.6, mix: 0.14 },
  saturation: { enabled: false }
})) throw new Error('Processing rejected')

// Sync follows the native transport tempo, initially 120 BPM.
if (!synth.setMasterProcessing({ delay: { sync: 'eighth' } })) {
  Ti.API.warn('Synced delay edit rejected')
}

function setCreativeDrive (enabled) {
  return synth.setMasterProcessing({ saturation: { enabled: enabled, drive: 1.5, mix: 0.2 } })
}

function disableMasterEffects () {
  return synth.setMasterProcessing({ chorus: { enabled: false }, delay: { enabled: false },
    reverb: { enabled: false }, saturation: { enabled: false } })
}
```

Call `setCreativeDrive(true)` only when a deliberate timbre change is wanted, and check its return value. Drive is not a loudness repair or limiter replacement. `disableMasterEffects` closes effect input gradually and drains delay/reverb/chorus histories for at most 30 seconds before exact bypass; its fixed `inputGain` remains 0.7. Check acceptance and, after tails drain, set `inputGain: 1` if a unity-gain comparison is intended. For panic, `stopAll()` fades current voices, stops native transport and invalidates effect histories; future timer-based `playPattern` steps still require cancellation or `shutdown()`. There are no per-voice sends or separate music/effects buses.

## Two voice LFOs

This square voice modulates cutoff and PWM independently. The original `lfoFreq`/`lfoDepth` pitch vibrato remains a separate control. All LFOs run natively; edits preserve their phases and ramp contributions over 10 ms.

```javascript
if (typeof synth.noteOn !== 'function' || typeof synth.updateVoice !== 'function') {
  throw new Error('Current held-voice beta APIs are required')
}
var modulatedId = 100001 // Reserve an unused ID from the owner's counter in an app.
if (!synth.noteOn({ voiceId: modulatedId, note: 'A3', waveType: WAVE.SQUARE,
  attack: 100, release: 250, pulseWidth: 0.5, volume: 0.2,
  filterType: 'lowpass', filterHz: 1600, filterQ: 0.8,
  modulations: [
    { wave: 'sine', target: 'filterHz', rate: 0.4, depth: 0.12 },
    { wave: 'triangle', target: 'pulseWidth', sync: 'eighth', depth: 0.15 }
  ] })) throw new Error('Modulated voice rejected')

function disableVoiceLfos () {
  return synth.updateVoice({ voiceId: modulatedId, modulations: [] })
}
// Call disableVoiceLfos on the UI action and handle false.
// Later release this ID with the bounded release policy above, or shut down its owner.
```

Use `target: 'fmDepth'` only with `WAVE.SINE`; a filter target requires an active filter and PWM requires `WAVE.SQUARE`. Free rates are 0 to 20 Hz; synced subdivisions follow native transport BPM. Depth is normalized, with cutoff/PWM/FM contributions clamped to safe parameter ranges. `modulations: []` disables both slots; omitting the field on update preserves them. Copy the same initial `modulations` array into a sequence's `voice` or a step's `overrides` to modulate transport notes. Timed tones/chords/patterns do not accept the new array.

## Measure peaks and limiter reduction

Enable diagnostics only while measuring and keep unavailable readings distinct from zero. A brief overload can disappear from the window meter while remaining in the accumulated maximum.

```javascript
if (!['setStatsEnabled', 'getStats', 'resetStats'].every(function (name) {
  return typeof synth[name] === 'function'
})) throw new Error('Statistics APIs are required')
if (!synth.setStatsEnabled(true)) throw new Error('Diagnostics rejected')
synth.resetStats()
var mixTimer = setInterval(function () {
  var stats = synth.getStats()
  Ti.API.info(JSON.stringify({ preLimiterDbFS: stats.preLimiterPeakDb,
    maximumReductionDb: stats.maxLimiterReductionDb, latestReductionDb: stats.limiterReductionDb }))
}, 200)

function closeMixMeter () {
  clearInterval(mixTimer)
  if (!synth.setStatsEnabled(false)) Ti.API.warn('Diagnostics disable rejected')
}
```

Call `closeMixMeter` when its owner hides or closes. The new fields may be absent on older beta packages; display that as unavailable. Reset deliberately before a comparison. These values measure digital peak protection, not speaker loudness, subjective quality or a guarantee that every audio deadline was met.
