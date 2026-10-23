# Curated sound and interaction recipes

These recipes are tuned starting points for `ti.synthengine` 1.0.0. They use
only public option keys, keep every explicit envelope valid, and obtain
waveforms from the runtime contract instead of hardcoding integers.

Unless a section says otherwise, the snippets assume one owner has already
started the engine:

```javascript
const synth = require('ti.synthengine')
const contract = synth.getDefaults()
const WAVE = contract.waveTypes
```

Treat levels as starting points, not mastering targets. Test on the actual
phone speaker and leave headroom when release tails or independent events can
overlap.

The recipes under "Expressive envelopes, filters and FM" pass the real
contract, but they come from standard synthesis ranges and have not been
auditioned on a device. Listen before shipping them.

<!-- TOC-START -->
## Contents

- [Retro and arcade effects](#retro-and-arcade-effects)
- [Playable xylophone](#playable-xylophone)
- [Four-pad memory cues](#four-pad-memory-cues)
- [Polyphony and layered chords](#polyphony-and-layered-chords)
- [Expressive envelopes, filters and FM](#expressive-envelopes-filters-and-fm)
- [Preset architecture for strict contracts](#preset-architecture-for-strict-contracts)
- [Recipe verification checklist](#recipe-verification-checklist)

<!-- TOC-END -->

## Retro and arcade effects

### Rising missile launch

A bright square wave and a fast upward sweep create the impression of thrust
and acceleration. The short release removes the edge without blurring the
motion.

```javascript
const accepted = synth.playTone({
  frequency: 196,
  frequencyEnd: 523,
  duration: 350,
  attack: 0,
  release: 50,
  volume: 0.55,
  waveType: WAVE.SQUARE
})
```

### Downward projectile

Reverse the pitch direction for a compact shot, fall, or power-down effect.

```javascript
synth.playTone({
  frequency: 900,
  frequencyEnd: 200,
  duration: 150,
  attack: 0,
  release: 50,
  volume: 0.48,
  waveType: WAVE.SQUARE
})
```

### Power-up sweep

Sawtooth carries more upper harmonics than square or triangle, so this sweep
cuts through small speakers at a moderate event level.

```javascript
synth.playTone({
  frequency: 220,
  frequencyEnd: 880,
  duration: 600,
  attack: 10,
  release: 100,
  volume: 0.5,
  waveType: WAVE.SAWTOOTH
})
```

### Noise explosion

White noise supplies an impact spectrum without implying a musical pitch. The
long release creates the debris tail. A pitch field is still included because
every sounding event follows the same contract.

```javascript
synth.playTone({
  frequency: 200,
  duration: 600,
  attack: 0,
  release: 500,
  volume: 0.72,
  waveType: WAVE.NOISE
})
```

For a shorter blast, use `duration: 500` and `release: 400`. Do not stack
several full-level explosions unless the engine profile and overlap budget
were chosen for it.

### Three-note bonus cue

Short ascending square notes read as collection or reward. Native millisecond intervals preserve the 110 ms onset spacing; explicit `length` starts release early enough to preserve the original 95/95/130 ms total envelopes.

```javascript
const sequenceId = synth.playSequence({
  "timeUnit": "ms",
  "loop": false,
  "swing": 0,
  "voice": {
    "attack": 2,
    "release": 30,
    "volume": 0.55,
    "waveType": WAVE.SQUARE
  },
  "steps": [
    {
      "frequencies": [
        523.25
      ],
      "duration": 95,
      "length": 65,
      "overrides": {}
    },
    {
      "rest": true,
      "duration": 15
    },
    {
      "frequencies": [
        587.33
      ],
      "duration": 95,
      "length": 65,
      "overrides": {}
    },
    {
      "rest": true,
      "duration": 15
    },
    {
      "frequencies": [
        659.25
      ],
      "duration": 130,
      "length": 100,
      "overrides": {}
    }
  ]
})
if (!sequenceId) throw new Error('Sequence rejected')
```

### Fast four-note arpeggio

Very short square notes with a small attack retain the hard cartridge-era
edge while reducing uncontrolled clicks. The 10 ms rests keep the first three
40 ms notes on a 50 ms grid; the final note rings for 80 ms.

```javascript
const sequenceId = synth.playSequence({
  "timeUnit": "ms",
  "loop": false,
  "swing": 0,
  "voice": {
    "attack": 5,
    "release": 15,
    "volume": 0.5,
    "waveType": WAVE.SQUARE
  },
  "steps": [
    {
      "frequencies": [
        261.63
      ],
      "duration": 40,
      "length": 25,
      "overrides": {}
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        329.63
      ],
      "duration": 40,
      "length": 25,
      "overrides": {}
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        392
      ],
      "duration": 40,
      "length": 25,
      "overrides": {}
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        523.25
      ],
      "duration": 80,
      "length": 65,
      "overrides": {}
    }
  ]
})
if (!sequenceId) throw new Error('Sequence rejected')
```

### Rapid score ticks

Use one native pattern instead of ten JavaScript timers. Explicit attack and
release values make every 60 ms tone valid without relying on shortened
defaults. A 10 ms rest after each tone places the ticks 70 ms apart.

```javascript
const sequenceId = synth.playSequence({
  "timeUnit": "ms",
  "loop": false,
  "swing": 0,
  "voice": {
    "volume": 0.42,
    "waveType": WAVE.SQUARE
  },
  "steps": [
    {
      "frequencies": [
        1046.5
      ],
      "duration": 60,
      "length": 40,
      "overrides": {
        "attack": 2,
        "release": 20
      }
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        1046.5
      ],
      "duration": 60,
      "length": 40,
      "overrides": {
        "attack": 2,
        "release": 20
      }
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        1046.5
      ],
      "duration": 60,
      "length": 40,
      "overrides": {
        "attack": 2,
        "release": 20
      }
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        1046.5
      ],
      "duration": 60,
      "length": 40,
      "overrides": {
        "attack": 2,
        "release": 20
      }
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        1046.5
      ],
      "duration": 60,
      "length": 40,
      "overrides": {
        "attack": 2,
        "release": 20
      }
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        1046.5
      ],
      "duration": 60,
      "length": 40,
      "overrides": {
        "attack": 2,
        "release": 20
      }
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        1046.5
      ],
      "duration": 60,
      "length": 40,
      "overrides": {
        "attack": 2,
        "release": 20
      }
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        1046.5
      ],
      "duration": 60,
      "length": 40,
      "overrides": {
        "attack": 2,
        "release": 20
      }
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        1046.5
      ],
      "duration": 60,
      "length": 40,
      "overrides": {
        "attack": 2,
        "release": 20
      }
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        1046.5
      ],
      "duration": 60,
      "length": 40,
      "overrides": {
        "attack": 2,
        "release": 20
      }
    },
    {
      "rest": true,
      "duration": 10
    }
  ]
})
if (!sequenceId) throw new Error('Sequence rejected')
```

### Hovering craft

A large triangle-wave LFO is no longer subtle vibrato: it becomes a cyclical
engine wobble. Slow stereo travel adds movement on headphones while pitch
remains the primary cue on mono speakers.

```javascript
synth.playTone({
  frequency: 800,
  duration: 2500,
  attack: 100,
  release: 400,
  volume: 0.42,
  waveType: WAVE.TRIANGLE,
  lfoFreq: 12,
  lfoDepth: 200,
  pan: -0.35,
  panEnd: 0.35
})
```

### Alternating warning alarm

An octave-like high/low alternation is easy to identify even through a small
speaker. Each 120 ms tone has a fitted envelope (`10 + 100 <= 120`), followed
by a 10 ms rest, so the pitch changes every 130 ms.

```javascript
const sequenceId = synth.playSequence({
  "timeUnit": "ms",
  "loop": false,
  "swing": 0,
  "voice": {
    "attack": 10,
    "release": 100,
    "volume": 0.45,
    "waveType": WAVE.SQUARE
  },
  "steps": [
    {
      "frequencies": [
        800
      ],
      "duration": 120,
      "length": 20,
      "overrides": {}
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        400
      ],
      "duration": 120,
      "length": 20,
      "overrides": {}
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        800
      ],
      "duration": 120,
      "length": 20,
      "overrides": {}
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        400
      ],
      "duration": 120,
      "length": 20,
      "overrides": {}
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        800
      ],
      "duration": 120,
      "length": 20,
      "overrides": {}
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        400
      ],
      "duration": 120,
      "length": 20,
      "overrides": {}
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        800
      ],
      "duration": 120,
      "length": 20,
      "overrides": {}
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        400
      ],
      "duration": 120,
      "length": 20,
      "overrides": {}
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        800
      ],
      "duration": 120,
      "length": 20,
      "overrides": {}
    },
    {
      "rest": true,
      "duration": 10
    },
    {
      "frequencies": [
        400
      ],
      "duration": 120,
      "length": 20,
      "overrides": {}
    },
    {
      "rest": true,
      "duration": 10
    }
  ]
})
if (!sequenceId) throw new Error('Sequence rejected')
```

### Low heartbeat pair

Two separated triangle pulses suggest a double heartbeat without the buzz of a
square wave. These sub-bass pitches suit headphones or a larger speaker; for a
phone speaker, try 180 and 160 Hz while preserving the rhythm.

```javascript
function playHeartbeatPair () {
  return synth.playSequence({ timeUnit: 'ms', loop: false,
    voice: {waveType: WAVE.TRIANGLE, attack: 10, release: 120, volume: 0.55},
    steps: [
      {frequencies: [90], duration: 220, length: 30},
      {frequencies: [80], duration: 150, length: 30, overrides: {volume: 0.48}}
    ]
  })
}
```

The native clock owns both attacks. Keep the returned ID to stop only this cue.

## Playable xylophone

Triangle gives a mallet-like balance of a defined pitch and soft upper
harmonics. A 2 ms attack makes the strike immediate, while a 180 ms release
lets adjacent bars overlap musically.

```javascript
const XYLOPHONE = [
  { label: 'C5', frequency: 523.25 },
  { label: 'D5', frequency: 587.33 },
  { label: 'E5', frequency: 659.25 },
  { label: 'F5', frequency: 698.46 },
  { label: 'G5', frequency: 783.99 },
  { label: 'A5', frequency: 880 },
  { label: 'B5', frequency: 987.77 },
  { label: 'C6', frequency: 1046.5 }
]

function playXylophoneBar (index, pan) {
  const bar = XYLOPHONE[index]
  if (!bar || !isFinite(pan) || pan < -1 || pan > 1) return false

  return synth.playTone({
    frequency: bar.frequency,
    duration: 420,
    attack: 2,
    release: 180,
    volume: 0.65,
    waveType: WAVE.TRIANGLE,
    pan
  })
}
```

Map the bars across the stereo field with
`pan = -0.8 + (1.6 * index / (barCount - 1))`. Do not make pan carry essential
meaning because the device may have a mono output.

### Drag interaction without note storms

A `touchmove` event may fire many times while the finger remains on one bar.
Track the last entered bar and strike only when the index changes:

```javascript
function createBarGesture (playIndex) {
  let tracking = false
  let activeIndex = -1

  function enter (index) {
    if (!tracking || index < 0 || index === activeIndex) return
    activeIndex = index
    playIndex(index)
  }

  return {
    start (index) {
      tracking = true
      activeIndex = -1
      enter(index)
    },
    move: enter,
    finish () {
      tracking = false
      activeIndex = -1
    }
  }
}
```

In a Titanium view:

- compute each bar's hit rectangle after layout with `convertPointToView()`;
- convert move coordinates into one shared container before hit testing;
- call `gesture.start(index)` on `touchstart` and `gesture.move(index)` only
  after resolving a valid bar;
- call `gesture.finish()` on both `touchend` and `touchcancel`;
- keep visual pressed-state counts separate if multiple touches are supported.

The audio release may continue after the finger leaves a bar. That is desired
for a xylophone; call `stopAll()` only for an explicit all-notes-off action.

## Four-pad memory cues

Four separated square-wave frequencies remain easy to distinguish at short
durations. Keep each bank as app metadata, then build a fresh closed options
object for the module.

```javascript
const PAD_BANKS = {
  low: [415, 310, 252, 209],
  equalTempered: [391.995, 329.628, 261.626, 195.998]
}

function playMemoryPad (bankName, index) {
  const bank = PAD_BANKS[bankName]
  const frequency = bank && bank[index]
  if (!isFinite(frequency)) return false

  return synth.playTone({
    frequency: frequency,
    duration: 420,
    attack: 6,
    release: 100,
    volume: 0.62,
    waveType: WAVE.SQUARE
  })
}
```

To demonstrate the whole pitch bank as one event, use a chord rather than four
independent full-gain calls:

```javascript
function playMemoryBank (bankName) {
  const bank = PAD_BANKS[bankName]
  if (!bank) return false

  return synth.playChord({
    frequencies: bank.slice(),
    duration: 480,
    attack: 8,
    release: 120,
    volume: 0.56,
    waveType: WAVE.SQUARE,
    pans: [-0.75, -0.25, 0.25, 0.75]
  })
}
```

### Controlled timbre comparison

For an honest A/B test, hold pitches, duration, envelope and pan constant.
Change only waveform and its comparison level. Never pass a profile object
containing labels or other app metadata directly to `playChord()` because its
options dictionary is closed.

```javascript
const TIMBRE_PROFILES = {
  square: { waveType: WAVE.SQUARE, volume: 0.52 },
  sine: { waveType: WAVE.SINE, volume: 0.68 },
  triangle: { waveType: WAVE.TRIANGLE, volume: 0.64 },
  sawtooth: { waveType: WAVE.SAWTOOTH, volume: 0.46 }
}

function auditionTimbre (profileName) {
  const profile = TIMBRE_PROFILES[profileName]
  if (!profile) return false

  return synth.playChord({
    frequencies: PAD_BANKS.low.slice(),
    duration: 420,
    attack: 8,
    release: 100,
    volume: profile.volume,
    waveType: profile.waveType,
    pans: [-0.75, -0.25, 0.25, 0.75]
  })
}
```

## Polyphony and layered chords

### Convert MIDI pitch to hertz

The standard A4 = 440 Hz formula makes it easy to build interval recipes
without embedding a long frequency table.

```javascript
function midiToHz (midi) {
  return 440 * Math.pow(2, (midi - 69) / 12)
}
```

Detuning needs no conversion: `detune` on a tone or sequence root and `detunes` on a chord take cents, one hundredth of a semitone.

### Build a wide layered chord

The interval cycle `[0, 4, 7, ...]` stacks major-triad chord tones across
octaves. Later layers repeat those tones with small cent offsets, passed as
`detunes`, which creates width and beating.

```javascript
const CHORD_INTERVALS = [0, 4, 7, 12, 16, 19, 24, 28, 31, 36]
const LAYER_DETUNE_CENTS = [0, -8, 8, -12]

function normalizeVoiceCount (value) {
  const count = Math.round(Number(value))
  if (!isFinite(count)) return 1
  return Math.max(1, Math.min(32, count))
}

function buildLayeredFrequencies (voiceCount) {
  const count = normalizeVoiceCount(voiceCount)
  const frequencies = []

  for (let index = 0; index < count; index++) {
    const intervalIndex = index % CHORD_INTERVALS.length
    frequencies.push(midiToHz(60.12 + CHORD_INTERVALS[intervalIndex]))
  }

  return frequencies
}

function buildLayerDetunes (voiceCount) {
  const count = normalizeVoiceCount(voiceCount)
  const detunes = []

  for (let index = 0; index < count; index++) {
    const layer = Math.floor(index / CHORD_INTERVALS.length)
    detunes.push(LAYER_DETUNE_CENTS[layer % LAYER_DETUNE_CENTS.length])
  }

  return detunes
}

function buildSymmetricPans (voiceCount, spread) {
  const count = normalizeVoiceCount(voiceCount)
  const numericSpread = Number(spread)
  const safeSpread = isFinite(numericSpread)
    ? Math.max(0, Math.min(1, numericSpread))
    : 0
  const pans = []

  if (count === 1) return [0]

  for (let index = 0; index < count; index++) {
    pans.push(-safeSpread + (2 * safeSpread * index / (count - 1)))
  }

  return pans
}

function playLayeredChord (voiceCount) {
  const count = normalizeVoiceCount(voiceCount)

  return synth.playChord({
    frequencies: buildLayeredFrequencies(count),
    detunes: buildLayerDetunes(count),
    duration: 800,
    attack: 35,
    release: 220,
    volume: 0.48,
    waveType: WAVE.SINE,
    pans: buildSymmetricPans(count, 0.8)
  })
}
```

The engine must have `maxVoices` at least as large as the intended simultaneous
chord. Four to twelve voices are a practical musical starting point. Counts
near 32 are useful for deliberate capacity tests, not as a default.

### Clean reference versus overlap stress

A single sustained chord is the clean reference for judging waveform quality.
If a new 220 ms chord starts every 120 ms, release tails overlap and the summed
level rises and falls. Limiter pumping is expected in that stress condition;
it is not proof that a single chord is defective.

For a musical pulse, keep the event shorter than its period:

```javascript
let pulseSequenceId = 0
let pulseRequested = false
let pulseStopping = false
function publishChordPulse () {
  pulseSequenceId = synth.playSequence({timeUnit: 'ms', stepDuration: 260, loop: true,
    voice: {attack: 10, release: 60, volume: 0.42, waveType: WAVE.SINE, pan: 0},
    steps: [{frequencies: buildLayeredFrequencies(4), length: 120}]
  })
  if (!pulseSequenceId) throw new Error('Chord pulse rejected')
}
function requestPulseStop () {
  if (!pulseSequenceId || pulseStopping) return
  pulseStopping = true
  if (!synth.stopSequence({sequenceId: pulseSequenceId})) throw new Error('Pulse stop rejected')
}
function stopChordPulse () {
  pulseRequested = false
  requestPulseStop()
}
function startChordPulse () {
  pulseRequested = true
  if (pulseSequenceId) requestPulseStop()
  else publishChordPulse()
}
function onPulseEnd (event) {
  if (event.sequenceId !== pulseSequenceId) return
  pulseSequenceId = 0
  pulseStopping = false
  if (pulseRequested) publishChordPulse()
}
synth.addEventListener('sequenceend', onPulseEnd)
```

This repeated chord uses one centered native sequence. The one-off layered chord above retains its individual stereo pans. `length: 120` plus 60 ms release preserves the 180 ms envelope while attacks remain 260 ms apart.

### Cancellable repetition

Every repeating sound has an identified native owner. Repeated start requests coalesce until the matching retirement event frees its slot. Stop its sequence ID and cancel pending restarts when its window closes; no JavaScript timer schedules subsequent notes.

```javascript
function cleanupAudio () {
  stopChordPulse()
  synth.removeEventListener('sequenceend', onPulseEnd)
  synth.shutdown()
}
win.addEventListener('close', cleanupAudio)
```

Call `shutdown()` only from the screen or service that owns the shared engine.

## Expressive envelopes, filters and FM

### Plucked marimba note

A short attack, a decay that falls to a low sustain and a release that fits
give the struck-and-ring shape of a mallet or plucked string. A sustain below 1
needs a decay, and `attack + decay` must fit inside `duration`.

```javascript
synth.playTone({
  note: 'C5',
  duration: 700,
  attack: 2,
  decay: 260,
  sustain: 0.12,
  release: 240,
  waveType: WAVE.TRIANGLE,
  volume: 0.62
})
```

### Kick drum

A sine that falls in pitch while its level decays reads as a drum. The pitch
sweep is linear over the whole event.

```javascript
synth.playTone({
  frequency: 150,
  frequencyEnd: 45,
  duration: 320,
  attack: 1,
  decay: 140,
  sustain: 0.35,
  release: 140,
  volume: 0.9
})
```

### Closed hi-hat

White noise through a high-pass filter, with a decay that drops to a quiet
tail. The filter fields only work together with a `filterType`.

```javascript
synth.playTone({
  waveType: WAVE.NOISE,
  duration: 90,
  attack: 1,
  decay: 20,
  sustain: 0.3,
  release: 60,
  filterType: 'highpass',
  filterHz: 6500,
  volume: 0.45
})
```

### Electric piano

Frequency modulation with a 1:1 ratio gives a tine-like tone. Letting the
modulation index fall through `fmDepthEnd` makes the note mellow as it rings,
which is what the ear expects from a struck tine. FM needs a sine carrier.

```javascript
synth.playTone({
  note: 'E3',
  duration: 1400,
  attack: 3,
  decay: 700,
  sustain: 0.25,
  release: 500,
  fmRatio: 1,
  fmDepth: 2.2,
  fmDepthEnd: 0.3,
  volume: 0.55
})
```

### Bell

A non-integer ratio produces an inharmonic spectrum, and an index that decays
to nothing leaves a pure ring. `fmDepthEnd: 0` is a real target, so it is
accepted; omit the key when no sweep is wanted.

```javascript
synth.playTone({
  note: 'A5',
  duration: 2400,
  attack: 1,
  decay: 1800,
  sustain: 0,
  release: 500,
  fmRatio: 3.5,
  fmDepth: 4,
  fmDepthEnd: 0,
  volume: 0.5
})
```

### Wah sweep

A resonant band-pass opening on a sawtooth. The cutoff moves exponentially, so
equal distances in pitch take equal time. Keep `filterQ` moderate: high values
make the resonance peak loud enough to engage the limiter.

```javascript
synth.playTone({
  note: 'A2',
  duration: 900,
  attack: 20,
  release: 200,
  waveType: WAVE.SAWTOOTH,
  filterType: 'bandpass',
  filterHz: 350,
  filterHzEnd: 2200,
  filterQ: 4,
  volume: 0.7
})
```

### Thick unison pad

Repeat a pitch and spread the copies a few cents apart. The slow beating
between them is what makes the sound wide. `detunes` is aligned with the
pitches and can be shorter than the array.

```javascript
synth.playChord({
  notes: ['A3', 'A3', 'A3', 'E4', 'E4', 'E4'],
  detunes: [-9, 0, 9, -7, 0, 7],
  pans: [-0.6, 0, 0.6, -0.4, 0, 0.4],
  duration: 2400,
  attack: 350,
  release: 900,
  waveType: WAVE.SAWTOOTH,
  volume: 0.45
})
```

### Chaining after a sequence

`sequenceend` carries the accepted `sequenceId` and a reason of `completed` or `stopped`. Only the completed event for this owner should trigger the outro; a delayed event for another ID must not affect it.

```javascript
let cueSequenceId = 0
function onSequenceEnd (event) {
  if (event.sequenceId !== cueSequenceId) return
  cueSequenceId = 0
  if (event.reason === 'completed') playOutroCue()
}
synth.addEventListener('sequenceend', onSequenceEnd)
cueSequenceId = synth.playSequence({timeUnit: 'beats', stepDuration: 0.5, loop: false,
  voice: {waveType: WAVE.SQUARE, volume: 0.5},
  steps: [{notes: [72]}, {notes: [76]}, {notes: [79]}, {notes: [84]}]
})
if (!cueSequenceId) throw new Error('Cue rejected')
function cleanupSequenceEvents () {
  if (cueSequenceId) synth.stopSequence({sequenceId: cueSequenceId})
  synth.removeEventListener('sequenceend', onSequenceEnd)
}
```

## Preset architecture for strict contracts

Keep descriptive metadata outside the native options object. Build a new
closed object at the call boundary so keys such as `label`, `category`, or
`description` never reach the module.

```javascript
const PRESETS = {
  success: {
    label: 'Success',
    frequency: 760,
    frequencyEnd: 1040,
    waveType: WAVE.TRIANGLE
  }
}

function playPreset (name) {
  const preset = PRESETS[name]
  if (!preset) return false

  return synth.playTone({
    frequency: preset.frequency,
    frequencyEnd: preset.frequencyEnd,
    duration: 150,
    attack: 3,
    release: 90,
    volume: 0.58,
    waveType: preset.waveType
  })
}
```

Avoid `synth.playTone(PRESETS[name])`: the preset contains `label`, which makes
the native call reject the entire dictionary.

## Recipe verification checklist

Before returning or shipping a variation:

- use exactly one pitch source for a tone and exactly one pitch array for a
  chord;
- use exactly one MIDI `notes` array, `frequencies` array or `rest: true` per native sequence step, including noise;
- keep `duration` as the onset interval and `length` as the release onset; both use the sequence time unit;
- verify `attack < duration`, `release <= duration - attack` and `attack + decay <= duration` for timed tones/chords; sequence ADSR remains in milliseconds and has no interval budget;
- give `sustain` below 1 a `decay`, give filter fields a `filterType`, and give
  FM a sine carrier and a depth;
- keep all numbers finite and integer-only fields integral;
- use `WAVE` constants, not copied numeric waveform values;
- check Boolean acceptance and positive sequence IDs at important control boundaries;
- size `maxVoices` for the largest real overlap, including release tails;
- cancel app-owned timers before `stopAll()` or `shutdown()`;
- audition on the intended phone speaker as well as headphones.
