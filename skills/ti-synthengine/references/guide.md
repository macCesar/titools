> Source snapshot: official TiSynthEngine 1.0.0 documentation at commit `6685b81` (2026-08-29).

# Guide

This guide covers the normal path from installing TiSynthEngine to releasing
the native audio resources when the owning screen closes.

## Install the module

Use the archive for each target platform:

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

TiSynthEngine requires Titanium SDK 13.3.1.GA or newer. The iOS renderer
requires iOS 13 or newer.

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

Use `pans` when every note needs a deliberate position. Missing entries remain
centered, and an array longer than the note array is rejected.

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
inherits the pattern's envelope, volume, waveform, pan, sweep and vibrato
options. Values set on the step override the inherited value.

Only one pattern scheduler is active. Starting another pattern cancels the
pending steps of the previous pattern. It does not stop voices that have
already started.

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

On iOS, `startEngine()` activates a `Playback` audio session. That ignores the
silent switch and normally interrupts other audio. If the app needs different
session behavior, read [coexisting with other audio](recommendations.md#coexisting-with-other-audio)
and test the final app on a device.

## Next steps

- [API reference](api.md) for every accepted key and limit.
- [Sound design](sound-design.md) for waveform and envelope recipes.
- [Examples](examples.md) for copy-ready sounds and patterns.
- [Troubleshooting](troubleshooting.md) when a call returns `false` or audio is
  silent.
