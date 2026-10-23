> Source snapshot: official TiSynthEngine 1.0.0 beta documentation at reviewed local commit `5f9bf05ce683794449a49972a963460e6760b07a` (2026-10-23); this synchronization does not publish that commit or a release. Upstream `documentation/examples.md` SHA-256: `eba45d9ba675190050f4bfb15873c1c0a9821d5bc034397dcd9bc51dcdbf1e48`.

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

Wire `startMotor` to acceleration/key down, `changeMotor` to a boost change, and `stopMotor` to release or cancellation. Compatible updates ramp over 10 ms without retriggering: frequency, level, noise clock, low-pass, send and position are live controls. Source/filter type requires a new attack. Start spatial voices with coordinates before editing them; pan updates apply to stereo voices. A stolen ID accepts updates as a no-op; optional priority improves admission without reserving voices.

## Native sequence with chords and edits

Start the engine with enough sequence capacity, then store each positive ID. The default interval is a sixteenth note (0.25 beats); rests advance time and gates start release, which can overlap later steps.

```javascript
synth.setTempo({ bpm: 110 })
var musicId = synth.playSequence({ swing: 0.12, loop: true, bus: 'music',
  voice: { waveType: WAVE.TRIANGLE, attack: 8, release: 100, volume: 0.3 },
  steps: [{ notes: [60, 64, 67], gate: 0.7 }, { rest: true },
    { notes: [67], gate: 0.5, overrides: { volume: 0.22 } },
    { notes: [64, 67, 72], duration: 0.5, length: 0.75 }]
})
if (musicId === 0) throw new Error('Sequence publication rejected')
synth.setTempo({ bpm: 128 })
if (!synth.updateSequence({ sequenceId: musicId, swing: 0.18, voice: { volume: 0.25 } })) Ti.API.warn('Edit rejected')
var positionTimer = setInterval(function () {
  var state = synth.getSequenceState({ sequenceId: musicId })
  if (state) Ti.API.info(JSON.stringify(state))
}, 200)
function stopOnlySequence () {
  if (!synth.stopSequence({ sequenceId: musicId })) Ti.API.warn('Stop rejected')
}
function closeSequenceAudio () {
  clearInterval(positionTimer)
  synth.shutdown()
}
```

The UI timer presents state; native audio schedules every attack/release. For fixed-time cues use `timeUnit: 'ms'`, whose intervals and note lengths survive tempo changes. Edits enter at the next step, swing at the next pair. Up/down/updown modes reorder sounding steps by pitch; normal mode retains rests. A completed/stopped ID is retired; create a new sequence to play again. `sequenceend` identifies the owner, and releases/tails can outlive completion.

## Chorus, delay, reverb and creative saturation

This configures the selected share of a running engine; `applyTo` defaults to all categories. Check method presence and Boolean acceptance; partial section updates merge with the last accepted settings. Effects start disabled, input gain starts at 1, and no LFOs are added to voices implicitly.

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

Call `setCreativeDrive(true)` only for a deliberate timbre change and check acceptance. `disableMasterEffects` closes input and drains bounded tails before exact bypass; it retains input gain 0.7. Set gain back to 1 after tails drain for a unity comparison. Panic stops all sequences, fades voices and invalidates histories. Select music/ambience categories or individual sends when gameplay effects should stay dry.

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
