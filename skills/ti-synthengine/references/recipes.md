# Curated sound and interaction recipes

These recipes are tuned starting points for `ti.synthengine` 1.0.0. They use
only public option keys, keep every explicit envelope valid, and obtain
waveforms from the runtime contract instead of hardcoding integers.

Unless a section says otherwise, the snippets assume one owner has already
started the engine:

```javascript
var synth = require('ti.synthengine')
var contract = synth.getDefaults()
var WAVE = contract.waveTypes
```

Treat levels as starting points, not mastering targets. Test on the actual
phone speaker and leave headroom when release tails or independent events can
overlap.

<!-- TOC-START -->
## Contents

- [Retro and arcade effects](#retro-and-arcade-effects)
- [Playable xylophone](#playable-xylophone)
- [Four-pad memory cues](#four-pad-memory-cues)
- [Polyphony and layered chords](#polyphony-and-layered-chords)
- [Preset architecture for strict contracts](#preset-architecture-for-strict-contracts)
- [Recipe verification checklist](#recipe-verification-checklist)

<!-- TOC-END -->

## Retro and arcade effects

### Rising missile launch

A bright square wave and a fast upward sweep create the impression of thrust
and acceleration. The short release removes the edge without blurring the
motion.

```javascript
var accepted = synth.playTone({
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

Short ascending square notes read as collection or reward. `stepDuration`
controls spacing; each step's `duration` controls its gate.

```javascript
synth.playPattern({
  stepDuration: 110,
  attack: 2,
  release: 30,
  volume: 0.55,
  waveType: WAVE.SQUARE,
  steps: [
    { frequency: 523.25, duration: 95 },
    { frequency: 587.33, duration: 95 },
    { frequency: 659.25, duration: 130 }
  ]
})
```

### Fast four-note arpeggio

Very short square notes with a small attack retain the hard cartridge-era
edge while reducing uncontrolled clicks.

```javascript
synth.playPattern({
  stepDuration: 50,
  attack: 5,
  release: 15,
  volume: 0.5,
  waveType: WAVE.SQUARE,
  steps: [
    { frequency: 261.63, duration: 40 },
    { frequency: 329.63, duration: 40 },
    { frequency: 392, duration: 40 },
    { frequency: 523.25, duration: 80 }
  ]
})
```

### Rapid score ticks

Use one native pattern instead of ten JavaScript timers. Explicit attack and
release values make every 60 ms step valid without relying on shortened
defaults.

```javascript
var scoreSteps = []

for (var index = 0; index < 10; index++) {
  scoreSteps.push({
    frequency: 1046.5,
    duration: 60,
    attack: 2,
    release: 20
  })
}

synth.playPattern({
  stepDuration: 70,
  volume: 0.42,
  waveType: WAVE.SQUARE,
  steps: scoreSteps
})
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
speaker. The envelope fits exactly inside every 120 ms tone:
`10 + 100 <= 120`.

```javascript
var warningSteps = []

for (var pulse = 0; pulse < 5; pulse++) {
  warningSteps.push({ frequency: 800, duration: 120 })
  warningSteps.push({ frequency: 400, duration: 120 })
}

synth.playPattern({
  stepDuration: 130,
  attack: 10,
  release: 100,
  volume: 0.45,
  waveType: WAVE.SQUARE,
  steps: warningSteps
})
```

### Low heartbeat pair

Two separated triangle pulses suggest a double heartbeat without the buzz of a
square wave. These sub-bass pitches suit headphones or a larger speaker; for a
phone speaker, try 180 and 160 Hz while preserving the rhythm.

```javascript
function playHeartbeatPair () {
  synth.playTone({
    frequency: 90,
    duration: 150,
    attack: 10,
    release: 120,
    volume: 0.55,
    waveType: WAVE.TRIANGLE
  })

  setTimeout(function () {
    synth.playTone({
      frequency: 80,
      duration: 150,
      attack: 10,
      release: 120,
      volume: 0.48,
      waveType: WAVE.TRIANGLE
    })
  }, 220)
}
```

If this becomes a repeating effect, own and cancel its JavaScript timer; see
[Cancellable repetition](#cancellable-repetition).

## Playable xylophone

Triangle gives a mallet-like balance of a defined pitch and soft upper
harmonics. A 2 ms attack makes the strike immediate, while a 180 ms release
lets adjacent bars overlap musically.

```javascript
var XYLOPHONE = [
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
  var bar = XYLOPHONE[index]
  if (!bar || !isFinite(pan) || pan < -1 || pan > 1) return false

  return synth.playTone({
    frequency: bar.frequency,
    duration: 420,
    attack: 2,
    release: 180,
    volume: 0.65,
    waveType: WAVE.TRIANGLE,
    pan: pan
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
  var tracking = false
  var activeIndex = -1

  function enter (index) {
    if (!tracking || index < 0 || index === activeIndex) return
    activeIndex = index
    playIndex(index)
  }

  return {
    start: function (index) {
      tracking = true
      activeIndex = -1
      enter(index)
    },
    move: enter,
    finish: function () {
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
var PAD_BANKS = {
  low: [415, 310, 252, 209],
  equalTempered: [391.995, 329.628, 261.626, 195.998]
}

function playMemoryPad (bankName, index) {
  var bank = PAD_BANKS[bankName]
  var frequency = bank && bank[index]
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
  var bank = PAD_BANKS[bankName]
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
var TIMBRE_PROFILES = {
  square: { waveType: WAVE.SQUARE, volume: 0.52 },
  sine: { waveType: WAVE.SINE, volume: 0.68 },
  triangle: { waveType: WAVE.TRIANGLE, volume: 0.64 },
  sawtooth: { waveType: WAVE.SAWTOOTH, volume: 0.46 }
}

function auditionTimbre (profileName) {
  var profile = TIMBRE_PROFILES[profileName]
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

The standard A4 = 440 Hz formula makes it easy to build interval recipes and
small detunings without embedding a long frequency table.

```javascript
function midiToHz (midi) {
  return 440 * Math.pow(2, (midi - 69) / 12)
}
```

A cent is one hundredth of a semitone, so add `cents / 100` to the MIDI value
before conversion.

### Build a wide layered chord

The interval cycle `[0, 4, 7, ...]` stacks major-triad chord tones across
octaves. Later layers repeat those tones with small cent offsets, which creates
width and beating without requiring an unsupported detune option.

```javascript
var CHORD_INTERVALS = [0, 4, 7, 12, 16, 19, 24, 28, 31, 36]
var LAYER_DETUNE_CENTS = [0, -8, 8, -12]

function normalizeVoiceCount (value) {
  var count = Math.round(Number(value))
  if (!isFinite(count)) return 1
  return Math.max(1, Math.min(32, count))
}

function buildLayeredFrequencies (voiceCount) {
  var count = normalizeVoiceCount(voiceCount)
  var frequencies = []

  for (var index = 0; index < count; index++) {
    var intervalIndex = index % CHORD_INTERVALS.length
    var layer = Math.floor(index / CHORD_INTERVALS.length)
    var cents = LAYER_DETUNE_CENTS[layer % LAYER_DETUNE_CENTS.length]
    var midi = 60.12 + CHORD_INTERVALS[intervalIndex] + (cents / 100)
    frequencies.push(midiToHz(midi))
  }

  return frequencies
}

function buildSymmetricPans (voiceCount, spread) {
  var count = normalizeVoiceCount(voiceCount)
  var numericSpread = Number(spread)
  var safeSpread = isFinite(numericSpread)
    ? Math.max(0, Math.min(1, numericSpread))
    : 0
  var pans = []

  if (count === 1) return [0]

  for (var index = 0; index < count; index++) {
    pans.push(-safeSpread + (2 * safeSpread * index / (count - 1)))
  }

  return pans
}

function playLayeredChord (voiceCount) {
  var count = normalizeVoiceCount(voiceCount)

  return synth.playChord({
    frequencies: buildLayeredFrequencies(count),
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
var pulseTimer = null
var pulseGeneration = 0

function stopChordPulse () {
  pulseGeneration++
  if (pulseTimer !== null) {
    clearTimeout(pulseTimer)
    pulseTimer = null
  }
  synth.stopAll()
}

function startChordPulse () {
  stopChordPulse()
  var generation = pulseGeneration

  function tick () {
    if (generation !== pulseGeneration) return

    synth.playChord({
      frequencies: buildLayeredFrequencies(4),
      duration: 180,
      attack: 10,
      release: 60,
      volume: 0.42,
      waveType: WAVE.SINE,
      pans: buildSymmetricPans(4, 0.7)
    })

    pulseTimer = setTimeout(tick, 260)
  }

  tick()
}
```

### Cancellable repetition

`stopAll()` silences native voices, but it cannot cancel JavaScript timers that
will launch new calls later. Every repeating UI or game effect therefore needs
an owner-controlled cancellation mechanism. The generation token above guards
against a callback that was already queued when `clearTimeout()` ran.

When the owning window closes:

```javascript
function cleanupAudio () {
  stopChordPulse()
  synth.shutdown()
}

win.addEventListener('close', cleanupAudio)
```

Do not call `shutdown()` from a child control if another visible screen owns
the shared engine.

## Preset architecture for strict contracts

Keep descriptive metadata outside the native options object. Build a new
closed object at the call boundary so keys such as `label`, `category`, or
`description` never reach the module.

```javascript
var PRESETS = {
  success: {
    label: 'Success',
    frequency: 760,
    frequencyEnd: 1040,
    waveType: WAVE.TRIANGLE
  }
}

function playPreset (name) {
  var preset = PRESETS[name]
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
- include a pitch field on every sounding pattern step, including noise;
- verify `attack < duration` and `release <= duration - attack` for every
  explicit event or step;
- keep all numbers finite and integer-only fields integral;
- use `WAVE` constants, not copied numeric waveform values;
- check Boolean results at important control boundaries;
- size `maxVoices` for the largest real overlap, including release tails;
- cancel app-owned timers before `stopAll()` or `shutdown()`;
- audition on the intended phone speaker as well as headphones.
