var sequenceScore = require('lib/sequenceScore')
var Synth = require('ti.synthengine')

var sequenceOwner = require('lib/sequenceOwner')(Synth, {
  rejected: function() { setStatus('Request rejected · sequence publication', COLORS.red) }
})
function publishSequence(options) { return sequenceOwner.submit(options) }

var defaults = Synth.getDefaults()
if (!defaults || defaults.apiVersion !== '1.0.0') {
  throw new Error('TiSynthEngine 1.0.0 is required')
}

if (!defaults.limits || !defaults.limits.spatialX || !defaults.limits.spatialY
  || typeof Synth.getStats !== 'function' || typeof Synth.resetStats !== 'function'
  || typeof Synth.setStatsEnabled !== 'function') {
  throw new Error('Install the current TiSynthEngine 1.0.0 packages, then rebuild and reinstall this app')
}

var WAVE = defaults.waveTypes
var STEPPED_WAVE = [-1, -0.78, -0.16, 0.84, 1, 0.42, -0.2, -0.62]
var engineRunning = false
var startTimer = null
var statsTimer = null
var diagnosticsEnabled = false
var selectedSession = 'playback'
var masterVolume = 1
var binauralEnabled = true
var interactiveControls = []

var COLORS = {
  canvas: '#030712',
  surface: '#111827',
  surfaceRaised: '#1f2937',
  surfaceMuted: '#374151',
  text: '#ffffff',
  textSecondary: '#9ca3af',
  textMuted: '#6b7280',
  green: '#16a34a',
  greenPressed: '#15803d',
  red: '#dc2626',
  redDark: '#991b1b',
  yellow: '#eab308',
  yellowPressed: '#ca8a04',
  blue: '#2563eb',
  blueDark: '#1e40af',
  indigo: '#4338ca',
  indigoPressed: '#3730a3',
  orange: '#c2410c',
  orangePressed: '#9a3412',
  teal: '#0f766e',
  tealPressed: '#115e59',
  pink: '#be185d',
  pinkPressed: '#9d174d',
  brown: '#78350f',
  brownPressed: '#451a03'
}

function dp(value) {
  return value + 'dp'
}

// ---------------------------------------------------------------------------
// Window and reusable UI
// ---------------------------------------------------------------------------

var win = Ti.UI.createWindow({
  backgroundColor: COLORS.canvas,
  layout: 'vertical',
  navBarHidden: true,
  extendSafeArea: false
})

var scrollOptions = {
  layout: 'vertical',
  contentWidth: Ti.UI.FILL,
  contentHeight: Ti.UI.SIZE,
  showVerticalScrollIndicator: false,
  width: Ti.UI.FILL,
  height: Ti.UI.FILL,
  touchEnabled: false
}
if (Ti.Platform.osname === 'android') {
  scrollOptions.scrollType = 'vertical'
}

var scrollView = Ti.UI.createScrollView(scrollOptions)

function makeText(text, options) {
  options = options || {}
  return Ti.UI.createLabel({
    text: text,
    color: options.color || COLORS.text,
    width: options.width || Ti.UI.FILL,
    height: options.height || Ti.UI.SIZE,
    textAlign: options.textAlign || Ti.UI.TEXT_ALIGNMENT_LEFT,
    verticalAlign: options.verticalAlign,
    includeFontPadding: options.includeFontPadding,
    top: options.top,
    right: options.right,
    bottom: options.bottom,
    left: options.left,
    opacity: options.opacity === undefined ? 1 : options.opacity,
    font: {
      fontSize: options.fontSize || 14,
      fontWeight: options.fontWeight || 'normal'
    }
  })
}

function makeBadge(text, backgroundColor) {
  var badge = Ti.UI.createView({
    backgroundColor: backgroundColor,
    borderRadius: dp(12),
    width: Ti.UI.SIZE,
    height: dp(24),
    right: dp(8)
  })
  badge.add(makeText(text, {
    color: COLORS.text,
    width: Ti.UI.SIZE,
    left: dp(10),
    right: dp(10),
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
  }))
  return badge
}

var statusDot = Ti.UI.createView({
  backgroundColor: COLORS.yellow,
  width: dp(8),
  height: dp(8),
  borderRadius: dp(4),
  top: dp(12),
  left: dp(12)
})

var statusLabel = makeText('Preparing audio after layout…', {
  color: COLORS.textSecondary,
  width: Ti.UI.SIZE,
  height: Ti.UI.FILL,
  left: dp(8),
  right: dp(12),
  fontSize: 12,
  fontWeight: 'bold',
  verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
  includeFontPadding: false
})

var statusPill = Ti.UI.createView({
  layout: 'horizontal',
  backgroundColor: COLORS.surfaceRaised,
  borderRadius: dp(16),
  height: dp(32),
  width: Ti.UI.SIZE,
  top: dp(18)
})
statusPill.add(statusDot)
statusPill.add(statusLabel)

function setStatus(text, tone) {
  statusLabel.text = text
  statusDot.backgroundColor = tone || COLORS.green
}

function makeHero() {
  var hero = Ti.UI.createView({
    layout: 'vertical',
    height: Ti.UI.SIZE,
    left: dp(20),
    right: dp(20),
    top: Ti.Platform.osname === 'android' ? dp(30) : dp(20),
    bottom: dp(8)
  })

  hero.add(makeText('NATIVE AUDIO PLAYGROUND', {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
  }))
  hero.add(makeText('TiSynthEngine', {
    top: dp(6),
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
  }))
  hero.add(makeText('Explore synthesis, sequencing, headphone positioning and engine diagnostics.', {
    top: dp(8),
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
  }))

  var badgeRow = Ti.UI.createView({
    layout: 'horizontal',
    width: Ti.UI.SIZE,
    height: Ti.UI.SIZE,
    top: dp(16)
  })
  badgeRow.add(makeBadge('API 1.0.0', COLORS.indigo))
  badgeRow.add(makeBadge('ANDROID + iOS', COLORS.surfaceMuted))
  hero.add(badgeRow)
  hero.add(statusPill)

  return hero
}

function makeSection(title, description, accentColor) {
  var section = Ti.UI.createView({
    layout: 'vertical',
    height: Ti.UI.SIZE,
    left: dp(16),
    right: dp(16),
    top: dp(20),
    backgroundColor: COLORS.surface,
    borderRadius: dp(12)
  })

  section.add(Ti.UI.createView({
    height: dp(4),
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: accentColor
  }))
  section.add(makeText(title.toUpperCase(), {
    top: dp(16),
    left: dp(16),
    right: dp(16),
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: 'bold'
  }))
  section.add(makeText(description, {
    top: dp(5),
    left: dp(16),
    right: dp(16),
    bottom: dp(4),
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold'
  }))

  return section
}

function makeRow() {
  return Ti.UI.createView({
    layout: 'horizontal',
    width: Ti.UI.FILL,
    height: Ti.UI.SIZE
  })
}

function makeAction(options) {
  var action = Ti.UI.createView({
    backgroundColor: options.color,
    borderRadius: dp(options.radius || 8),
    width: options.width || Ti.UI.FILL,
    height: dp(options.height || 52),
    top: dp(options.top === undefined ? 6 : options.top),
    right: options.right === undefined ? dp(16) : options.right,
    bottom: options.bottom,
    left: options.left === undefined ? dp(16) : options.left,
    opacity: 0.58,
    touchEnabled: false,
    bubbleParent: false,
    accessibilityLabel: options.accessibilityLabel || options.title,
    accessibilityHint: options.accessibilityHint || 'Plays this sound demonstration'
  })

  var label = makeText(options.title, {
    color: options.textColor || COLORS.text,
    left: dp(8),
    right: dp(8),
    fontSize: options.fontSize || 13,
    fontWeight: 'bold',
    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
  })
  label.accessibilityHidden = true
  action.add(label)

  function restoreColor() {
    action.backgroundColor = options.color
    action.opacity = engineRunning || options.allowStopped ? 1 : 0.58
  }

  action.addEventListener('touchstart', function () {
    if (!engineRunning && !options.allowStopped) return
    action.backgroundColor = options.pressedColor || COLORS.surfaceMuted
    action.opacity = 0.9
  })
  action.addEventListener('touchend', restoreColor)
  action.addEventListener('touchcancel', restoreColor)
  action.addEventListener('click', function () {
    if (!engineRunning && !options.allowStopped) return
    restoreColor()
    setStatus(options.status || ('Playing ' + options.title), options.statusColor || options.color)
    var accepted = options.onPress()
    if (accepted === false || accepted === 0) {
      setStatus('Request rejected · inspect the native log', COLORS.red)
    }
  })

  interactiveControls.push({ view: action, allowStopped: !!options.allowStopped })
  return action
}

function makeGridAction(options) {
  options.width = '46%'
  options.left = '2%'
  options.right = '2%'
  return makeAction(options)
}

function makeCompactAction(options) {
  options.width = '29%'
  options.left = '2%'
  options.right = '2%'
  options.height = 48
  return makeAction(options)
}

function playMatchedSine(note) {
  return Synth.playTone({
    note: note,
    duration: 600,
    attack: 10,
    release: 80,
    volume: 0.7,
    waveType: WAVE.SINE
  })
}

function playMatchedArpeggio(pitchKey, pitches) {
  return publishSequence(sequenceScore({
    attack: 5,
    release: 30,
    volume: 0.7,
    waveType: WAVE.SQUARE,
    steps: pitches.map(function (pitch) {
      var step = { duration: 140 }
      step[pitchKey] = pitch
      return step
    })
  }))
}

scrollView.add(makeHero())

// ---------------------------------------------------------------------------
// 1. Waveform demos
// ---------------------------------------------------------------------------

var waveSection = makeSection(
  'Waveforms · 440 Hz',
  'Same 70% gain; harmonics still change perceived loudness.',
  COLORS.indigo
)
var waveNames = ['Sine', 'Square', 'Sawtooth', 'Triangle', 'Noise', 'Wavetable']
var waveTypes = [WAVE.SINE, WAVE.SQUARE, WAVE.SAWTOOTH, WAVE.TRIANGLE, WAVE.NOISE, WAVE.WAVETABLE]
var waveStyles = [
  { color: COLORS.green, pressed: COLORS.greenPressed },
  { color: COLORS.blue, pressed: COLORS.blueDark },
  { color: COLORS.orange, pressed: COLORS.orangePressed },
  { color: COLORS.indigo, pressed: COLORS.indigoPressed },
  { color: COLORS.surfaceMuted, pressed: COLORS.surfaceRaised },
  { color: COLORS.teal, pressed: COLORS.tealPressed }
]

var waveRow = null
waveNames.forEach(function (name, index) {
  if (index % 2 === 0) {
    waveRow = makeRow()
    waveSection.add(waveRow)
  }
  waveRow.add(makeGridAction({
    title: name === 'Noise' ? 'Noise\nUnpitched' : name + '\n440 Hz',
    color: waveStyles[index].color,
    pressedColor: waveStyles[index].pressed,
    status: name === 'Noise' ? 'Noise · unpitched' : name + ' · 440 Hz',
    onPress: function () {
      var options = {
        frequency: 440,
        duration: 600,
        attack: 10,
        release: 80,
        volume: 0.7,
        waveType: waveTypes[index]
      }
      if (waveTypes[index] === WAVE.WAVETABLE) options.waveTable = STEPPED_WAVE
      return Synth.playTone(options)
    }
  }))
})
waveSection.add(Ti.UI.createView({ height: dp(12) }))
scrollView.add(waveSection)

// ---------------------------------------------------------------------------
// 2. Note names
// ---------------------------------------------------------------------------

var noteSection = makeSection(
  'Note names · matched A/B',
  'Same sine, envelope and gain as above. A4 and La4 resolve to 440 Hz.',
  COLORS.green
)
var noteDemos = [
  { note: 'A4', frequency: '440 Hz' },
  { note: 'La4', frequency: '440 Hz' },
  { note: 'C4', frequency: '261.63 Hz' },
  { note: 'Do4', frequency: '261.63 Hz' },
  { note: 'F#4', frequency: '369.99 Hz' },
  { note: 'Fa#4', frequency: '369.99 Hz' },
  { note: 'Bb3', frequency: '233.08 Hz' },
  { note: 'Sib3', frequency: '233.08 Hz' }
]
var noteRow = null
noteDemos.forEach(function (demo, index) {
  if (index % 2 === 0) {
    noteRow = makeRow()
    noteSection.add(noteRow)
  }
  noteRow.add(makeGridAction({
    title: demo.note + '\n' + demo.frequency,
    color: COLORS.surfaceMuted,
    pressedColor: COLORS.surfaceRaised,
    status: 'Note ' + demo.note + ' · sine at 70%',
    onPress: function () {
      return playMatchedSine(demo.note)
    }
  }))
})
noteSection.add(Ti.UI.createView({ height: dp(12) }))
scrollView.add(noteSection)

// ---------------------------------------------------------------------------
// 3. Motion and modulation
// ---------------------------------------------------------------------------

var motionSection = makeSection(
  'Motion and modulation',
  'Move a sound through stereo space, pitch and vibrato.',
  COLORS.pink
)
motionSection.add(makeAction({
  title: 'PAN SWEEP\nLeft → Right · 2 seconds',
  color: COLORS.teal,
  pressedColor: COLORS.tealPressed,
  status: 'Pan sweep · left to right',
  onPress: function () {
    return Synth.playTone({
      frequency: 440,
      duration: 2000,
      attack: 20,
      release: 200,
      volume: 0.8,
      pan: -1.0,
      panEnd: 1.0
    })
  }
}))
motionSection.add(makeAction({
  title: 'PITCH SWEEP\n200 → 900 Hz · sawtooth',
  color: COLORS.pink,
  pressedColor: COLORS.pinkPressed,
  status: 'Pitch sweep · 200 to 900 Hz',
  onPress: function () {
    return Synth.playTone({
      frequency: 200,
      frequencyEnd: 900,
      duration: 400,
      attack: 5,
      release: 40,
      volume: 0.7,
      waveType: WAVE.SAWTOOTH
    })
  }
}))
motionSection.add(makeAction({
  title: 'LFO VIBRATO\n5 Hz · depth 30',
  color: COLORS.orange,
  pressedColor: COLORS.orangePressed,
  status: 'LFO vibrato · 5 Hz',
  onPress: function () {
    return Synth.playTone({
      frequency: 440,
      duration: 2000,
      attack: 20,
      release: 200,
      volume: 0.7,
      lfoFreq: 5,
      lfoDepth: 30
    })
  }
}))
motionSection.add(Ti.UI.createView({ height: dp(16) }))
scrollView.add(motionSection)

// ---------------------------------------------------------------------------
// 4. Wave shaping
// ---------------------------------------------------------------------------

var retroSection = makeSection(
  'Wave shaping',
  'Hear variable-rate sample-and-hold noise, low-pass filtering, variable pulse width, a custom wavetable and 8-bit quantization.',
  COLORS.orange
)
retroSection.add(makeAction({
  title: 'FILTERED NOISE DECAY\n12 kHz → 650 Hz · 8-bit',
  color: COLORS.brown,
  pressedColor: COLORS.brownPressed,
  status: 'Filtered sample-and-hold noise sweep',
  onPress: function () {
    return Synth.playTone({
      frequency: 120,
      duration: 760,
      attack: 1,
      release: 580,
      volume: 0.68,
      waveType: WAVE.NOISE,
      noiseRate: 12000,
      noiseRateEnd: 650,
      lowPassHz: 2500,
      bitDepth: 8
    })
  }
}))
retroSection.add(makeAction({
  title: 'PULSE-WIDTH SWEEP\n10% → 86% · A3',
  color: COLORS.orange,
  pressedColor: COLORS.orangePressed,
  status: 'Square pulse-width sweep',
  onPress: function () {
    return Synth.playTone({
      note: 'A3',
      duration: 700,
      attack: 3,
      release: 180,
      volume: 0.58,
      waveType: WAVE.SQUARE,
      pulseWidth: 0.1,
      pulseWidthEnd: 0.86
    })
  }
}))
retroSection.add(makeAction({
  title: 'STEPPED WAVETABLE\n8 samples · D4 · 8-bit',
  color: COLORS.teal,
  pressedColor: COLORS.tealPressed,
  status: 'Custom stepped wavetable',
  onPress: function () {
    return Synth.playTone({
      note: 'D4',
      duration: 680,
      attack: 4,
      release: 220,
      volume: 0.6,
      waveType: WAVE.WAVETABLE,
      waveTable: STEPPED_WAVE,
      bitDepth: 8
    })
  }
}))
retroSection.add(makeAction({
  title: 'SHAPING PATTERN\nNoise → pulse → wavetable',
  color: COLORS.indigo,
  pressedColor: COLORS.indigoPressed,
  status: 'Pattern-level shaping with per-step overrides',
  onPress: function () {
    return publishSequence(sequenceScore({
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
          waveTable: STEPPED_WAVE
        }
      ]
    }))
  }
}))
retroSection.add(Ti.UI.createView({ height: dp(16) }))
scrollView.add(retroSection)

// ---------------------------------------------------------------------------
// 5. Harmony
// ---------------------------------------------------------------------------

var harmonySection = makeSection(
  'Harmony',
  'Atomic chords keep every voice aligned at the same onset.',
  COLORS.blue
)
harmonySection.add(makeAction({
  title: 'C MAJOR TRIAD\nSine · automatic stereo spread',
  color: COLORS.blueDark,
  pressedColor: COLORS.blue,
  status: 'C major triad · sine',
  onPress: function () {
    return Synth.playChord({
      frequencies: [261.63, 329.63, 392.0],
      duration: 1200,
      attack: 20,
      release: 300,
      volume: 0.7,
      panSpread: 0.8
    })
  }
}))
harmonySection.add(makeAction({
  title: 'C MAJOR · WIDE\nSquare · per-voice pans',
  color: COLORS.indigo,
  pressedColor: COLORS.indigoPressed,
  status: 'C major chord · square and wide',
  onPress: function () {
    return Synth.playChord({
      notes: ['C4', 'E4', 'G4', 'C5'],
      duration: 1000,
      attack: 10,
      release: 200,
      volume: 0.6,
      waveType: WAVE.SQUARE,
      pans: [-0.9, -0.3, 0.3, 0.9]
    })
  }
}))
harmonySection.add(Ti.UI.createView({ height: dp(16) }))
scrollView.add(harmonySection)

// ---------------------------------------------------------------------------
// 6. Sequencing
// ---------------------------------------------------------------------------

var sequenceSection = makeSection(
  'Native sequencing',
  'The first two demos are matched A/B tests; only the pitch input format changes.',
  COLORS.yellow
)
sequenceSection.add(makeAction({
  title: 'ARPEGGIO A/B · FREQUENCIES\nC major · square · 70% gain',
  color: COLORS.green,
  pressedColor: COLORS.greenPressed,
  status: 'Matched arpeggio · frequencies',
  onPress: function () {
    return playMatchedArpeggio('frequency', [261.63, 329.63, 392.0, 523.25, 392.0, 329.63])
  }
}))
sequenceSection.add(makeAction({
  title: 'ARPEGGIO A/B · NOTE NAMES\nC4 · E4 · G4 · C5 · G4 · E4',
  color: COLORS.green,
  pressedColor: COLORS.greenPressed,
  status: 'Matched arpeggio · note names',
  onPress: function () {
    return playMatchedArpeggio('note', ['C4', 'E4', 'G4', 'C5', 'G4', 'E4'])
  }
}))
sequenceSection.add(makeAction({
  title: 'MELODY PATTERN\n140 BPM · swing 0.1',
  color: COLORS.yellow,
  pressedColor: COLORS.yellowPressed,
  textColor: COLORS.canvas,
  status: 'Melody pattern · 140 BPM',
  onPress: function () {
    return publishSequence(sequenceScore({
      bpm: 140,
      swing: 0.1,
      steps: [
        { note: 'C4', noteValue: '8n', volume: 0.8, waveType: WAVE.SQUARE },
        { note: 'E4', noteValue: '8n', volume: 0.7, waveType: WAVE.SQUARE },
        { note: 'G4', noteValue: '8n', volume: 0.7, waveType: WAVE.SQUARE },
        { note: 'C5', noteValue: '4n', volume: 0.9, waveType: WAVE.SQUARE },
        { rest: true, noteValue: '8n' },
        { note: 'Bb3', noteValue: '8n', volume: 0.7, waveType: WAVE.SQUARE },
        { note: 'G3', noteValue: '4n', volume: 0.8, waveType: WAVE.SQUARE }
      ]
    }))
  }
}))
sequenceSection.add(makeAction({
  title: 'NOISE PERCUSSION\n120 BPM · eighths and sixteenths',
  color: COLORS.brown,
  pressedColor: COLORS.brownPressed,
  status: 'Noise percussion · 120 BPM',
  onPress: function () {
    return publishSequence(sequenceScore({
      bpm: 120,
      steps: [
        { frequency: 80, noteValue: '8n', volume: 0.9, waveType: WAVE.NOISE, attack: 2, release: 60 },
        { rest: true, noteValue: '8n' },
        { frequency: 80, noteValue: '8n', volume: 0.7, waveType: WAVE.NOISE, attack: 2, release: 40 },
        { rest: true, noteValue: '8n' },
        { frequency: 80, noteValue: '8n', volume: 0.9, waveType: WAVE.NOISE, attack: 2, release: 60 },
        { rest: true, noteValue: '8n' },
        { frequency: 80, noteValue: '16n', volume: 0.7, waveType: WAVE.NOISE, attack: 2, release: 30 },
        { frequency: 80, noteValue: '16n', volume: 0.7, waveType: WAVE.NOISE, attack: 2, release: 30 }
      ]
    }))
  }
}))
sequenceSection.add(Ti.UI.createView({ height: dp(16) }))
scrollView.add(sequenceSection)

// ---------------------------------------------------------------------------
// 7. Expressive synthesis
// ---------------------------------------------------------------------------

var expressiveSection = makeSection(
  'Expressive synthesis',
  'Decay and sustain, a resonant filter, FM and detune.',
  COLORS.teal
)
expressiveSection.add(makeAction({
  title: 'PLUCK\nTriangle · decay 260 ms · sustain 0.18',
  color: COLORS.green,
  pressedColor: COLORS.greenPressed,
  status: 'Pluck · decay and sustain',
  onPress: function () {
    return Synth.playTone({
      note: 'E4',
      duration: 900,
      attack: 2,
      decay: 260,
      sustain: 0.18,
      release: 380,
      volume: 0.6,
      waveType: WAVE.TRIANGLE
    })
  }
}))
expressiveSection.add(makeAction({
  title: 'WAH\nSawtooth · band-pass 350 → 2400 Hz',
  color: COLORS.orange,
  pressedColor: COLORS.orangePressed,
  status: 'Wah · band-pass cutoff sweep',
  onPress: function () {
    return Synth.playTone({
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
  }
}))
expressiveSection.add(makeAction({
  title: 'BELL\nFM ratio 3.5 · index 4 → 0',
  color: COLORS.indigo,
  pressedColor: COLORS.indigoPressed,
  status: 'Bell · FM index decays',
  onPress: function () {
    return Synth.playTone({
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
  }
}))
expressiveSection.add(makeAction({
  title: 'ELECTRIC PIANO\nFM ratio 1 · index 2.2 → 0.25',
  color: COLORS.blueDark,
  pressedColor: COLORS.blue,
  status: 'Electric piano · FM index mellows',
  onPress: function () {
    return Synth.playTone({
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
  }
}))
expressiveSection.add(makeAction({
  title: 'THICK CHORD\nSix sawtooth voices · detunes ±9 cents',
  color: COLORS.pink,
  pressedColor: COLORS.pinkPressed,
  status: 'Thick chord · detuned voices',
  onPress: function () {
    return Synth.playChord({
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
  }
}))

var patternEndLabel = makeText('sequenceend: no pattern yet', {
  top: dp(8),
  left: dp(16),
  right: dp(16),
  color: COLORS.textSecondary,
  fontSize: 12
})

function onSequenceEnd(event) {
  patternEndLabel.text = event.reason === 'completed'
    ? 'sequenceend: completed'
    : 'sequenceend: stopped'
  setStatus(patternEndLabel.text, event.reason === 'completed' ? COLORS.green : COLORS.yellow)
}

Synth.addEventListener('sequenceend', onSequenceEnd)

expressiveSection.add(makeAction({
  title: 'PATTERN END\nTap once to finish; tap again quickly to replace',
  color: COLORS.yellow,
  pressedColor: COLORS.yellowPressed,
  textColor: COLORS.canvas,
  status: 'Pattern running · waiting for sequenceend',
  onPress: function () {
    patternEndLabel.text = 'sequenceend: pattern running'
    return publishSequence(sequenceScore({
      bpm: 132,
      noteValue: '8n',
      attack: 3,
      decay: 90,
      sustain: 0.4,
      release: 60,
      volume: 0.55,
      waveType: WAVE.SQUARE,
      steps: [
        { note: 'C5' },
        { note: 'E5' },
        { note: 'G5' },
        { rest: true },
        { note: 'E5' },
        { note: 'C5', noteValue: '4n' }
      ]
    }))
  }
}))
expressiveSection.add(patternEndLabel)
expressiveSection.add(Ti.UI.createView({ height: dp(16) }))
scrollView.add(expressiveSection)

// ---------------------------------------------------------------------------
// 8. Headphone positioning
// ---------------------------------------------------------------------------

var spatialSection = makeSection(
  'Binaural headphone positioning',
  'Use stereo headphones. Compare one noise burst at a time; elevation varies by listener. These controls affect this section only.',
  COLORS.teal
)
var spatialModeLabel = makeText('Mode: binaural (front plane)', {
  left: dp(16), right: dp(16), top: dp(8), fontSize: 12
})
var spatialModes = makeRow()
;[true, false].forEach(function (enabled) {
  spatialModes.add(makeGridAction({
    title: enabled ? 'BINAURAL MODE' : 'STEREO MODE',
    color: COLORS.teal, pressedColor: COLORS.tealPressed,
    accessibilityHint: 'Changes placement for new sounds in this section',
    onPress: function () {
      binauralEnabled = enabled
      spatialModeLabel.text = enabled ? 'Mode: binaural (front plane)' : 'Mode: stereo (horizontal only)'
    }
  }))
})
spatialSection.add(spatialModes)
spatialSection.add(spatialModeLabel)

function placement(x, y) {
  // Never mix spatial coordinates with pan, panEnd, pans or panSpread.
  return binauralEnabled ? { spatialX: x, spatialY: y } : { pan: x, panEnd: x }
}

var spatialPoints = [
  ['TOP LEFT', -1, 1], ['TOP', 0, 1], ['TOP RIGHT', 1, 1],
  ['LEFT', -1, 0], ['CENTER', 0, 0], ['RIGHT', 1, 0],
  ['BOTTOM LEFT', -1, -1], ['BOTTOM', 0, -1], ['BOTTOM RIGHT', 1, -1]
]
var spatialRow
spatialPoints.forEach(function (point, index) {
  if (index % 3 === 0) { spatialRow = makeRow(); spatialSection.add(spatialRow) }
  spatialRow.add(makeCompactAction({
    title: point[0] + '\nNoise burst',
    fontSize: 11, color: COLORS.teal, pressedColor: COLORS.tealPressed,
    onPress: function () {
      return Synth.playTone(Object.assign({
        frequency: 200, waveType: WAVE.NOISE, duration: 550,
        attack: 5, release: 200, volume: 0.3
      }, placement(point[1], point[2])))
    }
  }))
})
spatialSection.add(makeAction({
  title: 'SPATIAL CHORD\nOne fixed position above and right',
  color: COLORS.blueDark, pressedColor: COLORS.blue,
  onPress: function () {
    var position = binauralEnabled ? { spatialX: 0.7, spatialY: 1 } : { panSpread: 0, pans: [0.7, 0.7, 0.7] }
    return Synth.playChord(Object.assign({
      notes: ['C4', 'E4', 'G4'], duration: 1200, attack: 15, release: 300,
      volume: 0.4, waveType: WAVE.SAWTOOTH
    }, position))
  }
}))
spatialSection.add(makeAction({
  title: 'SPATIAL PATTERN\nAbove left, below center, above right',
  color: COLORS.indigo, pressedColor: COLORS.indigoPressed,
  onPress: function () {
    return publishSequence(sequenceScore({
      stepDuration: 550, attack: 5, decay: 180, sustain: 0, release: 200,
      volume: 0.3, waveType: WAVE.NOISE,
      steps: [[-1, 1], [0, -1], [1, 1]].map(function (point) {
        return Object.assign({ frequency: 200 }, placement(point[0], point[1]))
      })
    }))
  }
}))
spatialSection.add(Ti.UI.createView({ height: dp(16) }))
scrollView.add(spatialSection)

// ---------------------------------------------------------------------------
// 9. Session policy and statistics
// ---------------------------------------------------------------------------

var sessionSection = makeSection(
  'Audio session',
  'On iOS, playback ignores silent mode; ambient respects it and mixes with other apps. Changing policy stops sounds and patterns, then restarts. Android accepts both without changing its output.',
  COLORS.blue
)
var sessionLabel = makeText('Session: playback', { left: dp(16), right: dp(16), top: dp(8), fontSize: 12 })
;['playback', 'ambient'].forEach(function (session) {
  sessionSection.add(makeAction({
    title: session.toUpperCase() + ' SESSION',
    allowStopped: true,
    color: COLORS.blueDark, pressedColor: COLORS.blue,
    accessibilityHint: 'Restarts the engine with this session policy',
    onPress: function () {
      sequenceOwner.reset(); Synth.shutdown()
      engineRunning = false
      selectedSession = session
      patternEndLabel.text = 'sequenceend: cancelled by shutdown (no event)'
      return startAppCycles()
    }
  }))
})
sessionSection.add(sessionLabel)
sessionSection.add(Ti.UI.createView({ height: dp(16) }))
scrollView.add(sessionSection)

var statsSection = makeSection(
  'Engine statistics',
  'Read counters without changing them. Optional diagnostics poll at 5 Hz; n/a means unmeasured or unavailable, not zero. Render load is not total app CPU.',
  COLORS.orange
)
var statsLabel = makeText('Diagnostics: off. Tap READ STATS for basic counters.', {
  left: dp(16), right: dp(16), top: dp(8), fontSize: 12
})
function measured(value, suffix) {
  return typeof value === 'number' && isFinite(value) ? value.toFixed(2) + (suffix || '') : 'n/a'
}
function refreshStats() {
  var stats = Synth.getStats()
  statsLabel.text = 'Diagnostics: ' + (diagnosticsEnabled ? 'on' : 'off')
    + '\nVoices: ' + stats.activeVoices + '/' + stats.maxVoices + ' (peak ' + stats.peakActiveVoices + ')'
    + '\nSpatial: ' + stats.spatialVoices + ' | tails: ' + stats.tailVoices + ' | queued: ' + stats.pendingCommands
    + '\nReplaced: ' + stats.voiceStealCount + ' | requests rejected: ' + stats.rejectedRequestCount
    + '\nPublications rejected: ' + stats.rejectedPublicationCount + ' | priority drops: ' + stats.priorityDropCount
    + '\nRender load: ' + (stats.renderLoad == null ? 'n/a' : measured(stats.renderLoad * 100, '%'))
    + '\nPeak L/R: ' + measured(stats.outputPeakDbFS && stats.outputPeakDbFS.left) + '/' + measured(stats.outputPeakDbFS && stats.outputPeakDbFS.right) + ' dBFS'
    + '\nBackend underruns: ' + measured(stats.underrunCount)
}
function stopStatsPolling() {
  if (statsTimer !== null) clearInterval(statsTimer)
  statsTimer = null
}
statsSection.add(makeAction({
  title: 'READ STATS', color: COLORS.surfaceMuted, pressedColor: COLORS.surfaceRaised,
  accessibilityHint: 'Reads statistics without resetting them',
  onPress: refreshStats
}))
statsSection.add(makeAction({
  title: 'TOGGLE DIAGNOSTICS', color: COLORS.orange, pressedColor: COLORS.orangePressed,
  accessibilityHint: 'Enables or disables timing and signal measurements',
  onPress: function () {
    if (!Synth.setStatsEnabled(!diagnosticsEnabled)) return false
    diagnosticsEnabled = !diagnosticsEnabled
    stopStatsPolling()
    if (diagnosticsEnabled) statsTimer = setInterval(refreshStats, 200)
    refreshStats()
    return true
  }
}))
statsSection.add(makeAction({
  title: 'RESET STATS', color: COLORS.surfaceMuted, pressedColor: COLORS.surfaceRaised,
  accessibilityHint: 'Resets counters without stopping sounds or changing diagnostics',
  onPress: function () { Synth.resetStats(); refreshStats() }
}))
statsSection.add(statsLabel)
statsSection.add(Ti.UI.createView({ height: dp(16) }))
scrollView.add(statsSection)

// ---------------------------------------------------------------------------
// 10. Output controls
// ---------------------------------------------------------------------------

var controlSection = makeSection(
  'Output',
  'Set the master gain or stop every active voice.',
  COLORS.red
)
var volumeRow = makeRow()
var volumeValues = [0.2, 0.5, 1.0]
volumeValues.forEach(function (volume) {
  volumeRow.add(makeCompactAction({
    title: Math.round(volume * 100) + '%',
    color: volume === 1.0 ? COLORS.blueDark : COLORS.surfaceMuted,
    pressedColor: volume === 1.0 ? COLORS.blue : COLORS.surfaceRaised,
    status: 'Master volume · ' + Math.round(volume * 100) + '%',
    accessibilityLabel: 'Set master volume to ' + Math.round(volume * 100) + ' percent',
    onPress: function () {
      return setMasterVolume(volume)
    }
  }))
})
controlSection.add(volumeRow)

var boostRow = makeRow()
boostRow.add(makeGridAction({
  title: 'BOOST\n150%',
  color: COLORS.orange,
  pressedColor: COLORS.orangePressed,
  status: 'Master volume · 150%',
  accessibilityLabel: 'Set master volume to 150 percent',
  onPress: function () {
    return setMasterVolume(1.5)
  }
}))
boostRow.add(makeGridAction({
  title: 'STOP ALL\nRelease active voices',
  color: COLORS.redDark,
  pressedColor: COLORS.red,
  status: 'Active voices fading; pending pattern steps remain',
  accessibilityHint: 'Fades current voices without cancelling future pattern steps',
  onPress: function () {
    sequenceOwner.stop(); Synth.stopAll()
  }
}))
controlSection.add(boostRow)
controlSection.add(Ti.UI.createView({ height: dp(12) }))
scrollView.add(controlSection)

scrollView.add(makeText('Built with the same public API on Android and iOS.', {
  top: dp(24),
  bottom: dp(32),
  color: COLORS.textMuted,
  fontSize: 12,
  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
}))

win.add(scrollView)

// ---------------------------------------------------------------------------
// Engine lifecycle
// ---------------------------------------------------------------------------

function setMasterVolume(volume) {
  if (!Synth.setVolume({ volume: volume })) return false
  masterVolume = volume
  return true
}

function startAppCycles() {
  startTimer = null
  win.removeEventListener('postlayout', onFirstPostLayout)
  engineRunning = Synth.start({ maxVoices: 16, mixingProfile: 'conservative', audioSession: selectedSession })
  // Keep session controls available for retry if a native stream cannot open.
  scrollView.touchEnabled = true
  interactiveControls.forEach(function (control) {
    var enabled = engineRunning || control.allowStopped
    control.view.applyProperties({ opacity: enabled ? 1 : 0.58, touchEnabled: enabled })
  })
  sessionLabel.text = 'Session: ' + selectedSession + (engineRunning ? '' : ' (start failed; tap a session to retry)')
  if (!engineRunning) {
    setStatus('Engine start failed; select a session to retry', COLORS.red)
    return false
  }
  if (!setMasterVolume(masterVolume)) {
    setStatus('Request rejected · master volume was not restored', COLORS.red)
    return false
  }
  setStatus('Audio ready · tap a demo', COLORS.green)
  refreshStats()
  return true
}

function onFirstPostLayout() {
  if (startTimer !== null) clearTimeout(startTimer)
  startTimer = setTimeout(startAppCycles, 250)
}

function hideAndroidActionBar() {
  if (Ti.Platform.osname !== 'android') return

  var activity = win.activity || Ti.Android.currentActivity
  if (activity && activity.actionBar) activity.actionBar.hide()
}

function cleanup() {
  stopStatsPolling()
  Synth.setStatsEnabled(false)
  diagnosticsEnabled = false
  Synth.removeEventListener('sequenceend', onSequenceEnd)
  win.removeEventListener('postlayout', onFirstPostLayout)
  win.removeEventListener('open', hideAndroidActionBar)
  win.removeEventListener('focus', hideAndroidActionBar)
  win.removeEventListener('close', cleanup)

  if (startTimer !== null) {
    clearTimeout(startTimer)
    startTimer = null
  }
  if (engineRunning) {
    sequenceOwner.reset(); Synth.shutdown()
    engineRunning = false
  }
}

win.addEventListener('postlayout', onFirstPostLayout)
if (Ti.Platform.osname === 'android') {
  win.addEventListener('open', hideAndroidActionBar)
  win.addEventListener('focus', hideAndroidActionBar)
}
win.addEventListener('close', cleanup)
win.open()
