> Source snapshot: official TiSynthEngine 1.0.0 beta documentation from the reviewed source tree at `937e774db7c5a924c9162cf0bbd01cb546754231` (2026-10-22); implementation and documentation are committed. Upstream `documentation/examples.md` SHA-256: `90ff3eb384fabbcb104a2b5fc0e8eeac52090a7b9e399241cbc67302abbb225f`.

# Advanced examples

Use these examples with one running engine. Initialize `var synth = require('ti.synthengine')`, `var contract = synth.getDefaults()` and `var WAVE = contract.waveTypes`; verify API version `1.0.0`. See [startup and timed examples](examples.md) and [installation and lifecycle](guide.md#lifecycle).

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
