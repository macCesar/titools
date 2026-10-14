> Source snapshot: official TiSynthEngine 1.0.0 beta documentation at commit `918c9a6a9e8fc96ee7b6e81c6a8845e612c4f6b6` (2026-10-14). Upstream `documentation/guide.md` SHA-256: `c5fb4ff34ec425487221b80d6793bda24aa328281ab9ccb02e65b0065e54842e`.

# Guide

This guide covers the normal path from installing TiSynthEngine to releasing
the native audio resources when the owning screen closes.

<!-- TOC-START -->
## Contents

- [Install the module](#install-the-module)
- [Load and verify the contract](#load-and-verify-the-contract)
- [Lifecycle](#lifecycle)
- [Play the first sound](#play-the-first-sound)
- [Choose a pitch](#choose-a-pitch)
- [Shape a tone](#shape-a-tone)
- [Settle, filter and modulate](#settle-filter-and-modulate)
- [Shape noise and waveforms](#shape-noise-and-waveforms)
- [Play simultaneous notes](#play-simultaneous-notes)
- [Play a pattern](#play-a-pattern)
- [Know when a pattern ends](#know-when-a-pattern-ends)
- [Master level and stopping](#master-level-and-stopping)
- [Output route changes](#output-route-changes)
- [Integrate binaural in a 2D app](#integrate-binaural-in-a-2d-app)
- [Next steps](#next-steps)

<!-- TOC-END -->

## Install the module

For the unreleased beta, use the packages built from the current module source in `android/dist` and `ios/dist`. The [latest release](https://github.com/macCesar/TiSynthEngine/releases/latest) is a separate package snapshot; it does not update when source files change. The archive names are:

- `ti.synthengine-android-1.0.0.zip`
- `ti.synthengine-iphone-1.0.0.zip`

Put the archives in the Titanium project root or install them through the
Titanium CLI. Pin the same version for both platforms:

```xml
<modules>
  <module platform="android" version="1.0.0">ti.synthengine</module>
  <module platform="iphone" version="1.0.0">ti.synthengine</module>
</modules>
```

TiSynthEngine requires Titanium SDK 13.2.0.GA or newer. Android projects must
compile against API 35 or newer. The iOS module requires iOS 15 or newer.

## Load and verify the contract

Require the module once in the code that owns audio. Check `apiVersion` before
starting the engine so a stale native archive fails with a useful message.

```javascript
var synth = require('ti.synthengine')
var contract = synth.getDefaults()

if (contract.apiVersion !== '1.0.0') {
  throw new Error('TiSynthEngine 1.0.0 is required; found ' + contract.apiVersion)
}
```

`getDefaults()` works before the stream starts. Call it again after startup if
you need the frequency ceiling for input validation, because that ceiling
depends on the output sample rate.

## Lifecycle

Opening a low-latency stream while Titanium lays out the first window can cause
an underrun on some Android devices. Register `postlayout` before `open()`, wait
for a short quiet period, and cancel the timer if the window closes first.

```javascript
var running = false
var startTimer = null

function startAudio () {
  startTimer = null
  win.removeEventListener('postlayout', onPostLayout)
  running = synth.startEngine({
    maxVoices: 16,
    mixingProfile: 'conservative'
  })
}

function onPostLayout () {
  if (startTimer !== null) clearTimeout(startTimer)
  startTimer = setTimeout(startAudio, 250)
}

function closeAudio () {
  win.removeEventListener('postlayout', onPostLayout)
  win.removeEventListener('close', closeAudio)

  if (startTimer !== null) {
    clearTimeout(startTimer)
    startTimer = null
  }

  if (running) {
    synth.shutdown()
    running = false
  }
}

win.addEventListener('postlayout', onPostLayout)
win.addEventListener('close', closeAudio)
win.open()
```

Use one owner for the engine. Start it once, pass a small audio service to the
screens that need it, and call `shutdown()` from the owner. A second
`startEngine()` call is harmless, but it makes ownership and cleanup unclear.

## Play the first sound

```javascript
var accepted = synth.playTone({
  note: 'A4',
  duration: 300,
  attack: 8,
  release: 80,
  volume: 0.8,
  waveType: contract.waveTypes.SINE
})

if (!accepted) Ti.API.warn('The tone was rejected')
```

Calls that create or change sound return `true` when accepted and `false` when
rejected. During development, handle that result and inspect logcat or the
Xcode console for the structured validation warning.

## Choose a pitch

`playTone` accepts one of these fields:

```javascript
synth.playTone({ frequency: 440 })
synth.playTone({ note: 'A4' })
```

Do not send both. Notes accept English names (`C#4`, `Bb3`) and solfege names
(`DO4`, `FA#5`, `Sib3`). When the octave is omitted, octave 4 is used.

## Shape a tone

The oscillator runs for `duration` milliseconds. `attack` controls the fade in
and `release` controls the fade out; the time between them stays at full level.

```javascript
synth.playTone({
  note: 'C4',
  duration: 1100,
  attack: 180,
  release: 420,
  waveType: contract.waveTypes.TRIANGLE
})
```

Explicit envelope values must fit inside `duration`. An attack equal to or
longer than the duration is rejected, as is a release longer than the time left
after attack.

Tone options can also move during the event:

```javascript
synth.playTone({
  frequency: 220,
  frequencyEnd: 880,
  pan: -0.8,
  panEnd: 0.8,
  lfoFreq: 5.5,
  lfoDepth: 8,
  duration: 1200,
  release: 180,
  waveType: contract.waveTypes.SAWTOOTH
})
```

`frequencyEnd` creates a linear pitch sweep. `panEnd` moves the sound between
channels. `lfoFreq` is the vibrato rate in hertz and `lfoDepth` is its depth in
hertz.

## Settle, filter and modulate

A flat envelope suits beeps. For plucks, keys and bells, add `decay` and
`sustain`: the level falls from full scale to `sustain` over `decay`
milliseconds and holds there until the release.

```javascript
synth.playTone({
  note: 'E4',
  duration: 900,
  attack: 2,
  decay: 260,
  sustain: 0.18,
  release: 380,
  waveType: contract.waveTypes.TRIANGLE
})
```

`sustain` below 1 needs a nonzero `decay`, and `attack` plus `decay` must fit in
`duration`. The 50 ms default attack counts, so set a short `attack` when the
decay is long.

`filterType` adds a resonant filter: `lowpass`, `highpass` or `bandpass`.
`filterHz` is the cutoff, `filterQ` the resonance, and `filterHzEnd` sweeps the
cutoff over the note.

```javascript
synth.playTone({
  note: 'A2',
  duration: 1000,
  release: 200,
  waveType: contract.waveTypes.SAWTOOTH,
  filterType: 'bandpass',
  filterHz: 350,
  filterHzEnd: 2400,
  filterQ: 5
})
```

Any `filterHz`, `filterHzEnd` or `filterQ` without a `filterType` other than
`none` is rejected with `filter_type_required`.

`fmDepth` makes a `SINE` voice an FM voice. `fmRatio` is the modulator
frequency as a multiple of the carrier, and `fmDepthEnd` moves the modulation
index over the note. Omit `fmDepthEnd` for no sweep; 0 is a real target.

```javascript
synth.playTone({
  note: 'C5',
  duration: 2600,
  attack: 1,
  decay: 2000,
  sustain: 0.02,
  fmRatio: 3.5,
  fmDepth: 4,
  fmDepthEnd: 0
})
```

`detune` shifts a pitch in cents. In a chord, `detunes` gives one offset per
pitch, so repeating a note with small offsets thickens it:

```javascript
synth.playChord({
  notes: ['A3', 'A3', 'E4', 'E4'],
  detunes: [-8, 8, -8, 8],
  duration: 2000,
  waveType: contract.waveTypes.SAWTOOTH
})
```

## Shape noise and waveforms

Use `noiseRate` to hold each pseudo-random noise value instead of generating a
new one every sample. A low rate sounds sparse and grainy; a high rate moves
toward white noise. `noiseRateEnd` sweeps the update rate.

```javascript
synth.playTone({
  frequency: 120,
  duration: 700,
  attack: 1,
  release: 520,
  waveType: contract.waveTypes.NOISE,
  noiseRate: 11000,
  noiseRateEnd: 650,
  lowPassHz: 2600,
  bitDepth: 8
})
```

`lowPassHz` is a per-voice one-pole filter. `bitDepth` applies amplitude
quantization from 2 to 16 bits. Zero disables either control.

Square waves accept a duty cycle and a duty-cycle sweep:

```javascript
synth.playTone({
  note: 'A3',
  duration: 650,
  release: 180,
  waveType: contract.waveTypes.SQUARE,
  pulseWidth: 0.12,
  pulseWidthEnd: 0.82
})
```

For a caller-defined repeating shape, select `WAVETABLE` and provide 2 to 64
samples from -1 to 1. The table is stepped rather than interpolated.

```javascript
synth.playTone({
  note: 'D4',
  duration: 500,
  waveType: contract.waveTypes.WAVETABLE,
  waveTable: [-1, -0.8, -0.1, 0.9, 0.4, 0.1, -0.2, -0.6],
  bitDepth: 8
})
```

## Play simultaneous notes

Use `playChord` when notes belong to one musical event:

```javascript
synth.playChord({
  notes: ['C4', 'E4', 'G4'],
  duration: 900,
  attack: 25,
  release: 220,
  panSpread: 0.7,
  waveType: contract.waveTypes.SINE
})
```

The chord is placed on the audio queue atomically. Its voices also share a
constant-power event gain. Several separate `playTone` calls are independent,
can begin in different callbacks, and are hotter when summed.

Use `pans` when notes need deliberate positions. Supplied entries override `panSpread`; missing entries use the spread position, or remain centered when spread is 0. An array longer than the note array is rejected.

```javascript
synth.playChord({
  frequencies: [261.63, 329.63, 392],
  pans: [-0.75, 0, 0.75],
  duration: 700
})
```

## Play a pattern

A pattern contains 1 to 512 object steps. Each step must have exactly one of
`note`, `frequency` or `rest: true`.

```javascript
synth.playPattern({
  bpm: 126,
  swing: 0.1,
  noteValue: '8n',
  waveType: contract.waveTypes.SQUARE,
  steps: [
    { note: 'C4' },
    { note: 'E4' },
    { rest: true },
    { note: 'G4', noteValue: '4n', pan: 0.5 }
  ]
})
```

Step timing is chosen in this order: step `duration`, step `noteValue`, pattern
`noteValue`, pattern `stepDuration`, then the 100 ms default. A step also
inherits the pattern's envelope, decay, sustain, volume, waveform, pan, sweep,
vibrato, noise, filter, resonant filter, FM, detune, pulse-width, wavetable and
quantization options. Values set on the step override the inherited value.

Only one pattern scheduler is active. Starting another pattern cancels the
pending steps of the previous pattern. It does not stop voices that have
already started.

## Know when a pattern ends

Each accepted pattern produces one `patternend` event. `completed` is `true`
when the pattern reaches its natural end and `false` when a newer pattern
replaces it. Use it to chain jingles or to release state that follows a
pattern.

```javascript
function onPatternEnd (event) {
  if (event.completed) playNextJingle()
}

synth.addEventListener('patternend', onPatternEnd)
```

The listener belongs to the module, not to the pattern, so it outlives the
screen unless you remove it. Add it to the same cleanup that calls
`shutdown()`:

```javascript
function closeAudio () {
  synth.removeEventListener('patternend', onPatternEnd)
  if (running) synth.shutdown()
}
```

`shutdown()` discards a pending pattern without an event, so a closing owner
never receives a callback after cleanup.

## Master level and stopping

```javascript
synth.setVolume({ volume: 0.7 })
synth.stopAll()
```

Master volume is ramped to avoid a step in the output. `stopAll()` fades active
voices, but it does not cancel future steps in the current pattern. Start a new
pattern or call `shutdown()` when future scheduling must stop as well.

## Output route changes

The native ports rebuild or resume their stream after headphones, Bluetooth or
other output routes change. The note crossing the transition may end early;
new notes can be played normally after the system settles. Do not restart the
whole app for a route change.

On iOS, `startEngine()` activates a `Playback` audio session by default. That
ignores the silent switch and normally interrupts other audio. Pass
`audioSession: 'ambient'` to respect the silent switch and mix with other apps;
read [coexisting with other audio](recommendations.md#coexisting-with-other-audio)
and test the final app on a device.

## Integrate binaural in a 2D app

The JavaScript app chooses a position for each sound; the native module generates and filters that voice. Installing the module or enabling an app switch does not convert existing `pan` calls into binaural calls. Update every playback path that should use positioning, including explosions, impacts, shots, lasers and repeated motor/thrust events. A central audio service can do this once for all effects that supply their current source position. Calls bypassing that service keep their existing behavior.

Keep the synthesis recipe (pitch, waveform, duration, envelope, filters, FM and volume). Replace its placement fields when submitting the event. This is per-event processing inside the native ports using the shared KEMAR FIR, rather than a global platform spatial-audio switch.

### Detect the installed feature

During the unreleased 1.0.0 beta, the version string alone does not prove that an installed binary has binaural support. Check both coordinate limits before enabling the controls:

```javascript
var synth = require('ti.synthengine')
var contract = synth.getDefaults()
var supportsBinaural = !!(contract.limits &&
  contract.limits.spatialX && contract.limits.spatialY)
```

If the limits are absent, disable the binaural switch and keep stereo playback. Replace the installed module package and rebuild and reinstall the app to use a new native binary. Updating `tiapp.xml` or copying module files does not change an app already installed on a device. Follow the [lifecycle](#lifecycle) above to start the engine before playing.

### Direction and amplitude are different controls

`spatialX`/`spatialY` are signed directions from -1 to 1. A 0 to 100% amplitude slider scales the position derived from the object; it does not select a direction. At height 100%, an upper object remains above and a lower object remains below. At height 0%, both are at the front-center height, while binaural remains enabled. Direct direction sliders would instead need -100 to +100%, divided by 100.

| App control | Effect |
| --- | --- |
| Binaural switch | Send spatial coordinates when on; omit both when off. |
| Horizontal amplitude, 0 to 100% | Scale each source's left/right coordinate; also controls stereo `pan` when binaural is off. |
| Height amplitude, 0 to 100% | Scale each source's below/above coordinate; inactive in stereo mode. |
| Master volume | Use `setVolume`; independent of direction and amplitude. |

These are app preferences, not options for `startEngine` or additional native methods. Keep the app's chosen defaults and saved preferences; the module does not impose a 100% slider default. Persist them in the app if they should survive restart. A switch change applies to newly submitted events, without restarting the engine or repositioning voices already playing.

With both amplitude controls at 100%, screen positions map as follows:

| Position | `spatialX` | `spatialY` |
| --- | ---: | ---: |
| Top left | -1 | 1 |
| Top center | 0 | 1 |
| Top right | 1 | 1 |
| Middle left | -1 | 0 |
| Center | 0 | 0 |
| Middle right | 1 | 0 |
| Bottom left | -1 | -1 |
| Bottom center | 0 | -1 |
| Bottom right | 1 | -1 |

### Convert screen positions when playing a tone

This example preserves a recipe, removes conflicting placement fields, and computes new coordinates for each call. Coordinates use the same local arena space: X grows right, Y grows down, and width/height are the arena dimensions. Convert world or camera coordinates into that space first. The example percentages are app choices; retain your own defaults.

```javascript
var audioSettings = {
  binaural: supportsBinaural,
  horizontalPercent: 50,
  heightPercent: 100
}

function clamp (value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function playPositionedTone (recipe, x, y, width, height) {
  var values = [x, y, width, height]
  if (!values.every(function (value) {
    return typeof value === 'number' && isFinite(value)
  }) || width <= 0 || height <= 0) {
    throw new Error('Sound position needs finite coordinates and positive dimensions')
  }

  var options = Object.assign({}, recipe)
  delete options.pan
  delete options.panEnd
  delete options.pans
  delete options.panSpread
  delete options.spatialX
  delete options.spatialY

  var horizontal = clamp(audioSettings.horizontalPercent, 0, 100) / 100
  var vertical = clamp(audioSettings.heightPercent, 0, 100) / 100
  var nx = clamp(2 * x / width - 1, -1, 1)
  var ny = clamp(1 - 2 * y / height, -1, 1)

  if (audioSettings.binaural && supportsBinaural) {
    options.spatialX = nx * horizontal
    options.spatialY = ny * vertical
  } else {
    options.pan = nx * horizontal
    options.panEnd = options.pan
  }
  return synth.playTone(options)
}

var explosion = {
  frequency: 90,
  waveType: contract.waveTypes.NOISE,
  duration: 500,
  attack: 2,
  release: 200,
  volume: 0.3
}
if (!playPositionedTone(explosion, 900, 100, 1000, 800)) {
  Ti.API.warn('Positioned explosion rejected')
}
```

Connect a Titanium switch's `change` event to `audioSettings.binaural = event.value`; connect the two sliders' `change` events to `horizontalPercent` and `heightPercent`. Configure slider minimum 0 and maximum 100, and disable the height slider while the switch is off. Validate restored preference values as finite numbers within those ranges before using them. Do not pass these preference names to `playTone`: that would return `false` with `unsupported_option`.

Supply the current position whenever an effect fires. A projectile launch cue can use the launch position; an impact uses the collision position. Repeated short motor events can use successive positions. A single active tone cannot move after submission because this API has no per-voice handle or position-update method. Stereo `panEnd` movement cannot be combined with binaural; do not continually retrigger long sounds every frame to imitate movement.

### Chords and patterns

A chord shares one binaural position across all its voices. Remove `pans` and `panSpread` when sending coordinates. For different simultaneous source positions, use independent tone events and account for their different gain/overlap behavior:

```javascript
if (!synth.playChord({
  notes: ['C4', 'E4', 'G4'],
  duration: 500,
  volume: 0.3,
  spatialX: -0.5,
  spatialY: 0.7
})) Ti.API.warn('Spatial chord rejected')
```

Pattern steps inherit coordinates from the root and can override either one. Remove conflicting stereo fields from both the root and every step; even `pan: 0` conflicts with a spatial coordinate. A step cannot opt out of inherited binaural by passing zero coordinates; use a pattern without spatial coordinates on its root for a mix of spatial and stereo steps.

```javascript
if (!synth.playPattern({
  stepDuration: 300,
  attack: 5,
  release: 80,
  volume: 0.3,
  spatialX: 0,
  spatialY: 1,
  steps: [
    { note: 'C4' },
    { note: 'E4', spatialY: -1 },
    { rest: true },
    { note: 'G4', spatialX: 1, spatialY: 0 }
  ]
})) Ti.API.warn('Spatial pattern rejected')
```

### Listen and measure

Use stereo headphones and compare isolated broadband noise above/below before testing many collisions. Perceived elevation varies with the listener, headphones and spectrum; low sine tones are weak tests. The output is still stereo, with a front plane and no rear sources, distance attenuation, room reflections or head tracking. A 100% slider uses the modeled directional range; it does not guarantee strong localization for every person.

CPU cost depends on concurrent spatial voices and their short tails, not the total number of effects over a game. Measure the intended device and realistic event overlap. Host replay is a comparison tool, not device CPU, battery, heat or underrun evidence. See [the renderer](audio-engine.md#binaural-front-plane-renderer) and [diagnostic checks](troubleshooting.md#binaural-does-not-change-the-position).

## Next steps

- [API reference](api.md) for every accepted key and limit.
- [Sound design](sound-design.md) for waveform, envelope, filter and FM recipes.
- [Examples](examples.md) for copy-ready sounds and patterns.
- [Troubleshooting](troubleshooting.md) when a call returns `false` or audio is
  silent.
