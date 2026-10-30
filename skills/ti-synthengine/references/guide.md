> Source snapshot: official TiSynthEngine 1.0.2 documentation from the reviewed working-tree based on `4a45f21230ffc5a8838fbd5fc108dd3ab470362a` (2026-10-29). Upstream `documentation/guide.md` SHA-256: `6241f84ba84e20c0516bf01bc0850f9625d2b41f0bef39289c056e687b21ee37`.

# Guide

Install TiSynthEngine, start it after layout settles, and release its native audio resources when the owning screen closes.

<!-- TOC-START -->
## Contents

- [Install the module](#install-the-module)
- [Load and verify the contract](#load-and-verify-the-contract)
- [Lifecycle](#lifecycle)
- [Detect required capabilities](#detect-required-capabilities)
- [Hold and edit a voice](#hold-and-edit-a-voice)
- [Choose the musical transport](#choose-the-musical-transport)
- [Add master effects](#add-master-effects)
- [Play the first sound](#play-the-first-sound)
- [Choose a pitch](#choose-a-pitch)
- [Shape a tone](#shape-a-tone)
- [Settle, filter and modulate](#settle-filter-and-modulate)
- [Shape noise and waveforms](#shape-noise-and-waveforms)
- [Play simultaneous notes](#play-simultaneous-notes)
- [Play a sequence](#play-a-sequence)
- [Know when a sequence ends](#know-when-a-sequence-ends)
- [Master level and stopping](#master-level-and-stopping)
- [Output route changes](#output-route-changes)
- [Integrate binaural in a 2D app](#integrate-binaural-in-a-2d-app)
- [Read engine statistics](#read-engine-statistics)
- [Next steps](#next-steps)
- [Diagnose mix headroom](#diagnose-mix-headroom)

<!-- TOC-END -->

## Install the module

Download both official packages from [Android 1.0.2](https://github.com/macCesar/TiSynthEngine/releases/tag/android-1.0.2) and [iOS 1.0.2](https://github.com/macCesar/TiSynthEngine/releases/tag/ios-1.0.2). For source builds, the matching archives are produced under `android/dist` and `ios/dist`:

- `ti.synthengine-android-1.0.2.zip`
- `ti.synthengine-iphone-1.0.2.zip`

Put the archives in the Titanium project root or install them through the Titanium CLI. Pin the same version for both platforms:

```xml
<modules>
  <module platform="android" version="1.0.2">ti.synthengine</module>
  <module platform="iphone" version="1.0.2">ti.synthengine</module>
</modules>
```

TiSynthEngine requires Titanium SDK 13.2.0.GA or newer. Android projects must compile against API 35 or newer. The iOS module requires iOS 15 or newer.

## Load and verify the contract

Require the module once in the code that owns audio. Check `apiVersion` before starting. Also check the [spatial limits](#detect-the-installed-feature) and [statistics methods](#read-engine-statistics) if the app needs those features. Check [required capabilities](#detect-required-capabilities) for held voices, musical transport and master processing.

```javascript
var synth = require('ti.synthengine')
var contract = synth.getDefaults()

if (contract.apiVersion !== '1.0.0') {
  throw new Error('TiSynthEngine 1.0.0 is required; found ' + contract.apiVersion)
}
```

`getDefaults()` works before the stream starts. Call it again after startup if you need the frequency ceiling for input validation, because that ceiling depends on the output sample rate.

## Lifecycle

Opening a low-latency stream while Titanium lays out the first window can cause an underrun on some Android devices. Register `postlayout` before `open()`, wait for a short quiet period, and cancel the timer if the window closes first.

```javascript
var running = false
var startTimer = null

function startAudio () {
  startTimer = null
  win.removeEventListener('postlayout', onPostLayout)
  running = synth.start({
    maxVoices: 16,
    mixingProfile: 'conservative',
    audioSession: 'ambient'
  })
  if (!running) Ti.API.warn('TiSynthEngine could not start; keep playback controls disabled')
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

Use one owner for the engine. Start it once, pass a small audio service to the screens that need it, and call `shutdown()` from the owner. On Android, the module also shuts down when Titanium destroys the root activity, so that a cached process does not keep the audio stream open. This is a safety net, not a replacement for the owner's `shutdown()` call. While the engine is running, another valid `start()` call returns `true` and leaves the existing options in effect. Changing voice capacity, profile or session policy requires `shutdown()` and a new start. This example selects `ambient` for game/UI audio; the default remains `playback`. Android validates the session policy and leaves output unchanged.

## Detect required capabilities

Public API version 1.0.0 includes held voices, sample-clock sequences, stereo effects and two optional LFOs. Require the methods used by each feature before enabling its controls:

```javascript
function hasMethods (names) {
  return names.every(function (name) { return typeof synth[name] === 'function' })
}
var supportsHeld = hasMethods(['noteOn', 'noteOff', 'updateVoice'])
var supportsSequence = hasMethods(['playSequence', 'updateSequence', 'stopSequence', 'getSequenceState'])
var supportsProcessing = hasMethods(['setMasterProcessing'])
```

Start the engine successfully before publishing held notes, sequence edits or processing. `getDefaults` and feature checks do not open the stream. Install matching packages for Android/iOS and rebuild the application when replacing a native module. Additional LFOs require the documented modulation contract; check acceptance of the complete configuration. Treat rejected configurations as unavailable rather than silently dropping their keys.

## Hold and edit a voice

Use `noteOn({ voiceId, ... })` when duration follows interaction: a piano key, motor, beam, pad or the last chord of a ceremony. Allocate a unique positive integer ID per attack, and release only that ID with `noteOff`. No duration or sweep-end fields are accepted. A chord held this way consists of separate IDs; unlike one `playChord` or sequence chord, separate `noteOn` calls have independent gain and publication.

`updateVoice` changes compatible pitch, volume, cutoff/Q, vibrato, PWM/FM, LFO targets, noise clock, one-pole cutoff, effect send and stereo/spatial position with 10 ms ramps, without restarting oscillator/envelope phase. Source, table, filter type, quantization, ADSR and stereo-versus-spatial mode are fixed at attack. See [complete fields](api.md#updatevoiceoptions). A note that has ended or been stolen accepts updates as a no-op; there is no note-finished event or reserved slot. A `true` return means accepted publication, not proof that the sound is still active.

Release on touch end and cancellation as well as ordinary key up. Retry a rejected release twice at 16 ms outside the audio callback, then shut down and report failure if publication remains blocked. Cancel retries during teardown. The [held motor example](advanced-examples.md#sustained-game-motor) implements this ownership policy. For pause/owner close, invalidate app scheduling and shut down; require a new start before future notes.

## Choose the musical transport

Use `playSequence` for all successive native sounds. `playTone` and `playChord` handle independent timed events; `noteOn`/`noteOff` hold a sound for interaction. Start with `maxSequences: 1…4` to preallocate independent sequence capacity. All use the same pool of up to 32 voices.

Store the positive identifier returned by `playSequence`, and include it in each update, stop or state query. 0 rejects publication. Three banks per sequence publish complete edits atomically. Structural edits enter at the next step; swing at the next pair. `setTempo({ bpm })` applies at the next block, preserving beat position. Beat sequences follow it; ms sequences keep fixed times. `stopSequence({ sequenceId })` releases only that owner's voices and leaves effect tails. A retired identifier returns null from `getSequenceState`.

```javascript
synth.setTempo({ bpm: 112 })
var sequenceId = synth.playSequence({
  stepDuration: 0.5, swing: 0.12, bus: 'music',
  voice: { waveType: WAVE.SQUARE, volume: 0.55 },
  steps: [{ notes: [60] }, { notes: [64], overrides: { pan: -0.4, panEnd: 0.4 } },
    { rest: true }, { notes: [67], duration: 1, length: 0.8 }]
})
if (sequenceId === 0) throw new Error('Sequence rejected')
// Stop this owner without affecting unrelated voices:
synth.stopSequence({ sequenceId: sequenceId })
```

See [the full sequence contract](api.md#native-sequence-transport) for length, gate, variable durations, arpeggios, revisions and capacity rejection.

## Add master effects

The native chain is voices, fixed input gain, chorus, ping-pong delay, stereo Schroeder reverb, master volume, optional saturation, then the final limiter. The initial `inputGain` is 1 and chorus/delay/reverb/saturation are disabled. New notes have no extra LFOs unless requested. This preserves default render behavior without making effects exclusive to instruments or Studio.

Chorus adds stereo movement, delay adds free or synchronized echoes, and reverb adds a damped tail. Saturation is optional creative drive. Select processed categories with `applyTo: ['music', 'ambience']`; a voice's explicit `effectSend` overrides that selection. One chain processes the selected share and one final limiter protects the recombined output.

`setMasterProcessing` merges partial updates, validates the entire result and returns publication acceptance. Continuous controls ramp over 10 ms. Disabling an effect closes input gradually and keeps its tail, bounded to 30 seconds with a final fade, then restores exact bypass. It does not undo a non-unity input gain. `stopAll` invalidates histories and stops every native sequence; `shutdown` stops the stream and frees its buffers. See the [processing example](advanced-examples.md#chorus-delay-reverb-and-creative-saturation) and [field ranges](api.md#setmasterprocessingoptions).

Delay and LFO sync follow global `setTempo` (initially 120); free settings retain milliseconds or hertz. The two extra voice LFOs target filter cutoff, square PWM or sine FM, with sine/triangle waves. They are independent of `lfoFreq`/`lfoDepth` pitch vibrato. See [two LFOs](advanced-examples.md#two-voice-lfos).

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

Timed and held sound calls and accepted edits return `true` when accepted and `false` when rejected. `playSequence` instead returns a positive sequence ID or `0`; state queries return their documented state or `null`, and lifecycle/cleanup methods follow their own return contracts. During development, handle the relevant result and inspect logcat or the Xcode console for the structured validation warning.

## Choose a pitch

`playTone` accepts one of these fields:

```javascript
synth.playTone({ frequency: 440 })
synth.playTone({ note: 'A4' })
```

Do not send both. Notes accept English names (`C#4`, `Bb3`) and solfege names (`DO4`, `FA#5`, `Sib3`). When the octave is omitted, octave 4 is used.

## Shape a tone

The oscillator runs for `duration` milliseconds. `attack` controls the fade in and `release` controls the fade out; the time between them stays at full level.

```javascript
synth.playTone({
  note: 'C4',
  duration: 1100,
  attack: 180,
  release: 420,
  waveType: contract.waveTypes.TRIANGLE
})
```

Explicit envelope values must fit inside `duration`. An attack equal to or longer than the duration is rejected, as is a release longer than the time left after attack.

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

`frequencyEnd` creates a linear pitch sweep. `panEnd` moves the sound between channels. `lfoFreq` is the vibrato rate in hertz and `lfoDepth` is its depth in hertz.

## Settle, filter and modulate

A flat envelope suits beeps. For plucks, keys and bells, add `decay` and `sustain`: the level falls from full scale to `sustain` over `decay` milliseconds and holds there until the release.

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

`sustain` below 1 needs a nonzero `decay`, and `attack` plus `decay` must fit in `duration`. The 50 ms default attack counts, so set a short `attack` when the decay is long.

`filterType` adds a resonant filter: `lowpass`, `highpass` or `bandpass`. `filterHz` is the cutoff, `filterQ` the resonance, and `filterHzEnd` sweeps the cutoff over the note.

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

Any `filterHz`, `filterHzEnd` or `filterQ` without a `filterType` other than `none` is rejected with `filter_type_required`.

`fmDepth` makes a `SINE` voice an FM voice. `fmRatio` is the modulator frequency as a multiple of the carrier, and `fmDepthEnd` moves the modulation index over the note. Omit `fmDepthEnd` for no sweep; 0 is a real target.

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

`detune` shifts a pitch in cents. In a chord, `detunes` gives one offset per pitch, so repeating a note with small offsets thickens it:

```javascript
synth.playChord({
  notes: ['A3', 'A3', 'E4', 'E4'],
  detunes: [-8, 8, -8, 8],
  duration: 2000,
  waveType: contract.waveTypes.SAWTOOTH
})
```

## Shape noise and waveforms

Use `noiseRate` to hold each pseudo-random noise value instead of generating a new one every sample. A low rate sounds sparse and grainy; a high rate moves toward white noise. `noiseRateEnd` sweeps the update rate.

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

`lowPassHz` is a per-voice one-pole filter. `bitDepth` applies amplitude quantization from 2 to 16 bits. Zero disables either control.

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

For a caller-defined repeating shape, select `WAVETABLE` and provide 2 to 64 samples from -1 to 1. The table is stepped rather than interpolated.

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

The chord is placed on the audio queue atomically. Its voices also share a constant-power event gain. Several separate `playTone` calls are independent, can begin in different callbacks, and are hotter when summed.

Use `pans` to choose a position for each note. Supplied entries override `panSpread`; missing entries use the spread position, or remain centered when spread is 0. An array longer than the note array is rejected.

```javascript
synth.playChord({
  frequencies: [261.63, 329.63, 392],
  pans: [-0.75, 0, 0.75],
  duration: 700
})
```

## Play a sequence

```javascript
synth.setTempo({ bpm: 112 })
var sequenceId = synth.playSequence({
  stepDuration: 0.5, swing: 0.12, bus: 'music',
  voice: { waveType: WAVE.SQUARE, volume: 0.55 },
  steps: [{ notes: [60] }, { notes: [64], overrides: { pan: -0.4, panEnd: 0.4 } },
    { rest: true }, { notes: [67], duration: 1, length: 0.8 }]
})
if (sequenceId === 0) throw new Error('Sequence rejected')
// Stop this owner without affecting unrelated voices:
synth.stopSequence({ sequenceId: sequenceId })
```

## Know when a sequence ends

Listen for `sequenceend`, whose payload is `{ sequenceId, reason: 'completed' | 'stopped' }`. Filter by the owner ID before changing UI. The event is asynchronous and may arrive while a release or effect tail remains audible. For a precise next attack, place it in the same native sequence; event chaining crosses JavaScript delivery latency. Remove the listener during owner cleanup. Identifiers survive internal slot reuse without referring to the new sequence.

```javascript
function onSequenceEnd (event) {
  if (event.sequenceId === sequenceId) Ti.API.info(event.reason)
}
synth.addEventListener('sequenceend', onSequenceEnd)
// During owner cleanup:
synth.removeEventListener('sequenceend', onSequenceEnd)
```

## Master level and stopping

```javascript
synth.setVolume({ volume: 0.7 })
synth.stopAll()
```

Master volume changes use a linear 10 ms ramp. `stopAll()` stops every native sequence, cancels future attacks, fades active voices and invalidates effect histories. Call `stopSequence({ sequenceId })` to stop only one sequence, or `shutdown()` to close the stream and free resources.

## Output route changes

The native ports rebuild or resume their stream after headphones, Bluetooth or other output routes change. The note crossing the transition may end early; new notes can be played normally after the system settles. Do not restart the whole app for a route change.

On iOS, `start()` activates a `Playback` audio session by default. That ignores the silent switch and normally interrupts other audio. Pass `audioSession: 'ambient'` to respect the silent switch and mix with other apps; read [coexisting with other audio](recommendations.md#coexisting-with-other-audio) and test the final app on a device.

## Integrate binaural in a 2D app

The JavaScript app chooses a position for each sound; the native module generates and filters that voice. Installing the module or enabling an app switch does not convert existing `pan` calls into binaural calls. Update every playback path that should use positioning, including explosions, impacts, shots, lasers and repeated motor/thrust events. A central audio service can do this once for all effects that supply their current source position. Calls bypassing that service keep their existing behavior.

Keep the synthesis recipe (pitch, waveform, duration, envelope, filters, FM and volume), and replace its placement fields when submitting the event. The native ports process each event with the shared KEMAR FIR; there is no global platform spatial-audio switch.

### Detect the installed feature

Check both coordinate limits before enabling binaural controls to verify that the app loaded the expected native module:

```javascript
var synth = require('ti.synthengine')
var contract = synth.getDefaults()
var supportsBinaural = !!(contract.limits &&
  contract.limits.spatialX && contract.limits.spatialY)
```

If the limits are absent, disable the binaural switch and keep stereo playback. Replace the installed module package and rebuild and reinstall the app to use a new native binary. Updating `tiapp.xml` or copying module files does not change an app already installed on a device. Follow the [lifecycle](#lifecycle) above to start the engine before playing.

### Direction and amplitude are different controls

`spatialX`/`spatialY` are signed directions from -1 to 1. A 0 to 100% amplitude slider scales the position derived from the object; it does not select a direction. At height 100%, an upper object remains above and a lower object remains below. At height 0%, both are at the front-center height, while binaural remains enabled. Direct direction sliders would instead need -100 to +100%, divided by 100.

| App control                     | Effect                                                                                      |
| ------------------------------- | ------------------------------------------------------------------------------------------- |
| Binaural switch                 | Send spatial coordinates when on; omit both when off.                                       |
| Horizontal amplitude, 0 to 100% | Scale each source's left/right coordinate; also controls stereo `pan` when binaural is off. |
| Height amplitude, 0 to 100%     | Scale each source's below/above coordinate; inactive in stereo mode.                        |
| Master volume                   | Use `setVolume`; independent of direction and amplitude.                                    |

Store these settings as app preferences; `start` does not accept them, and they have no separate native methods. Keep the app's chosen defaults and saved preferences; the module does not impose a 100% slider default. Persist them in the app if they should survive restart. A switch change applies to newly submitted events, without restarting the engine or repositioning voices already playing.

With both amplitude controls at 100%, screen positions map as follows:

| Position      | `spatialX` | `spatialY` |
| ------------- | ---------: | ---------: |
| Top left      |         -1 |          1 |
| Top center    |          0 |          1 |
| Top right     |          1 |          1 |
| Middle left   |         -1 |          0 |
| Center        |          0 |          0 |
| Middle right  |          1 |          0 |
| Bottom left   |         -1 |         -1 |
| Bottom center |          0 |         -1 |
| Bottom right  |          1 |         -1 |

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

Supply the current position whenever an effect fires. A projectile launch cue can use the launch position; an impact uses the collision position. Timed event positions remain fixed after submission. An identified sustained voice started spatially can instead change `spatialX`/`spatialY` through `updateVoice`, with 10 ms ramps and retained spatial history. A stereo voice cannot become spatial through an update. Stereo `panEnd` movement cannot be combined with binaural; do not continually retrigger long sounds every frame to imitate movement.

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

Sequence steps inherit coordinates from root `voice` and can override either one. Remove conflicting stereo fields from both root `voice` and every step override; even `pan: 0` conflicts with a spatial coordinate. A step cannot opt out of inherited binaural by passing zero coordinates; use a pattern without spatial coordinates in its root voice for a mix of spatial and stereo steps.

```javascript
if (!synth.playSequence({
  timeUnit: 'ms',
  stepDuration: 300,
  voice: { attack: 5, release: 80, volume: 0.3, spatialX: 0, spatialY: 1 },
  steps: [
    { notes: [60] },
    { notes: [64], overrides: { spatialY: -1 } },
    { rest: true },
    { notes: [67], overrides: { spatialX: 1, spatialY: 0 } }
  ]
})) Ti.API.warn('Spatial pattern rejected')
```

### Listen and measure

Use stereo headphones and compare isolated broadband noise above/below before testing many collisions. Perceived elevation varies with the listener, headphones and spectrum; low sine tones are weak tests. The output is still stereo, with a front plane and no rear sources, distance attenuation, room reflections or head tracking. A 100% slider uses the modeled directional range; it does not guarantee strong localization for every person.

Measure CPU cost on the intended device with realistic event overlap. The cost depends on concurrent spatial voices and their short tails; the total number of effects over a game does not determine it. Host replay supports comparisons but does not measure device CPU, battery, heat or underruns. See [the renderer](audio-engine.md#binaural-front-plane-renderer) and [diagnostic checks](troubleshooting.md#binaural-does-not-change-the-position).

## Read engine statistics

Basic counters are available without enabling optional diagnostics. Reads do not start audio or reset counters. Detect the methods if supporting older development packages that also report 1.0.0:

```javascript
var statsTimer = null
var statsSupported = typeof synth.getStats === 'function' &&
  typeof synth.setStatsEnabled === 'function' && typeof synth.resetStats === 'function'

function readStats () {
  var stats = synth.getStats()
  Ti.API.info('Voices: ' + stats.activeVoices + '/' + stats.maxVoices)
  Ti.API.info('Render load: ' + (stats.renderLoad === null
    ? 'unmeasured' : (stats.renderLoad * 100).toFixed(1) + '%'))
}

function startDiagnostics () {
  if (!statsSupported || statsTimer !== null) return false
  if (!synth.setStatsEnabled(true)) return false
  statsTimer = setInterval(readStats, 200)
  return true
}

function stopDiagnostics () {
  if (statsTimer !== null) clearInterval(statsTimer)
  statsTimer = null
  if (statsSupported) synth.setStatsEnabled(false)
}

// Read basic counters without enabling timing or signal meters:
if (statsSupported) readStats()
// When the user requests diagnostics: startDiagnostics()
// When the diagnostic view hides, the app backgrounds or the owner closes:
// stopDiagnostics()
// To reset accumulated counters deliberately, without stopping playback:
// if (statsSupported) synth.resetStats()
```

Integrate `stopDiagnostics()` into the existing owner's hide/background/close handlers, before shutdown. Resume polling only while the diagnostic view is active; do not add a second engine owner. Timing and output meters stay `null` until enabled and measured. Basic counters remain available when diagnostics are off. Android backend underrun/buffer/latency fields are best-effort and independent of that switch; iOS returns `null` for those backend fields. A zero underrun count does not prove clean sound.

See the [complete field contract](api.md#getstats), [measurement limits](stats-performance.md) and [interactive statistics controls](../assets/example/README.md#statistics).

## Next steps

- [API reference](api.md) for every accepted key and limit.
- [Sound design](sound-design.md) for waveform, envelope, filter and FM recipes.
- [Examples](examples.md) for copy-ready sounds and patterns.
- [Troubleshooting](troubleshooting.md) when a call returns `false` or audio is silent.

## Diagnose mix headroom

The current diagnostics add `preLimiterPeakDb` (maximum signal before final limiting, in dBFS) and `maxLimiterReductionDb` (greatest limiter attenuation in dB) accumulated since reset. Unlike the approximately 200 ms window reduction field, brief peaks remain visible between UI polls. Enable measurements, reset before the scenario and keep `null`/absent fields distinct from measured zero. The [measurement example](advanced-examples.md#measure-peaks-and-limiter-reduction) shows opt-in polling and cleanup.

Fixed event/input gain does not normalize continuously by active voice count. Coherent overlapping notes, effects feedback or resonance can still exceed the ceiling; the limiter then acts on the whole stereo sum. Saturation is a separate creative processor, disabled initially. Physical loudness and small-speaker bass response are not measured by these digital meters.
