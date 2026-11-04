> Source snapshot: official TiSynthEngine documentation at commit `9d74aa45f84d3f2822d4aab76874efe37d81257f` (2026-11-03). Published module 2.0.0. Upstream `example/README.md` SHA-256: `db0f5921699859a1dd6918f215a4d30b008dd933cae458f21033216d7f807dd0`.

# Interactive example

The Classic Titanium app in [app.js](app.js) demonstrates the Sound object API on Android and iOS. It requires TiSynth 2.0.0, reported by `getContract().version`. `getDefaults().version` reports the same installed module version.

The default configuration is 16 voices, `conservative` mixing and the `playback` session. Master volume starts at 100% and optional diagnostics start off. Creating a Sound does not reserve a voice.

## Run it

1. Create a Classic Titanium application with Android and/or iOS support. For Alloy projects, keep the example in a separate Classic test app so the Alloy-generated files remain intact.
2. Build and install the current module source for the target platforms. Select the version declared by that build in `tiapp.xml`; rebuilding and reinstalling the test app is necessary after changing module packages.
3. Copy the entire `example/` directory into the app's `Resources/`, including `app.js` and every file under `lib/`. No images or audio files are needed.
4. Run with Titanium SDK 13.2.0.GA or newer, Android compile API 35 or newer, and iOS 15 or newer. See the [installation guide](../../references/guide.md#install-the-module).

The example checks the Sound contract, spatial limits and enable/disable statistics methods before constructing the screen. Audio starts after layout settles. If startup fails, session buttons remain available to retry. Closing the window retires its pattern listener, clears startup/statistics timers, disables diagnostics and shuts down the engine.

This example plays foreground finite sounds and patterns. Sustained notes, master processing and voice LFOs have separate examples in the [advanced documentation](../../references/advanced-examples.md#sustained-game-motor).

## Synthesis and sequencing

`createSound({ sound, playback })` separates synthesis properties from interpretation and timing. `lib/soundPreset.js` converts the example's editable recipes to this schema without playing audio. Finite sounds call `Sound.play()` and preserve their Boolean acceptance result. Chords declare `type: 'chord'`, including a chord containing just one note.

## Native finite-tone repetition

```js
var synth = require('ti.synthengine')
var shot = synth.createSound({
  sound: { waveType: synth.getContract().waveTypes.SQUARE, attack: 2, release: 40, volume: 0.1 },
  playback: { type: 'repeat', frequencies: [1380], frequencyEnd: 340, duration: 105, interval: 200 }
})
if (synth.start({ maxVoices: 16, mixingProfile: 'conservative' })) {
  synth.setVolume(1)
  var repetition = shot.play()
  if (repetition) {
    repetition.update({ interval: 150, volume: 0.08 })
    // Later: repetition.stop()
  }
}
```

Finite `duration` includes release; envelope times and repetition `interval` are milliseconds. Per-call overrides do not change the Sound definition. Repetition controls keep private execution identity. An update preserves the next deadline and changes subsequent attacks; stopping cancels future attacks while admitted shots finish. There is no JavaScript attack timer. Close, session changes and STOP ALL also release or invalidate repetition ownership.

The screen retains its waveform, English/solfege pitch, stereo motion, vibrato, variable-rate noise, pulse-width, wavetable, quantization, chord, arpeggio, tempo/swing, percussion, decay/sustain, filter, FM and detune demonstrations. Master BOOST intentionally raises the bus above unity; 100% restores unity. Repeated taps can overlap voices and cause limiting or replacement.

## Native attack variation

ATTACK VARIATION retains its metal-strike recipe. When both `capabilities.variation === true` and `variationSchemaVersion === 1` are announced, the renderer chooses pitch, FM depth and level once per admitted attack. Otherwise the recipe omits variation. See the [variation guide](../../references/native-variation.md).

## Sequence completion and cancellation

`lib/sequenceScore.js` compiles note-name scores to millisecond onsets and explicit release onsets. `soundPreset.js` maps step spacing to `playback.interval` or `steps[].interval`, keeps `length`, and places synthesis in `sound` or `steps[].sound`. The native sample clock schedules every attack.

`lib/sequenceOwner.js` retains the pattern control returned by `Sound.play()`. Tap PATTERN END once to see `end: completed`. Tap repeatedly to request a stop, coalesce pending scores and publish only the newest complete score after the matching control emits `end`. Its callback receives `{ reason: 'completed' | 'stopped' }`, without native IDs. Late events from retired controls cannot change application ownership.

A completed pattern can leave audible releases or shared effect tails. STOP ALL cancels future attacks and fades active voices. Changing sessions or closing the example shuts down its engine and cancels pending application publication.

## Headphone positioning

Use stereo headphones to compare the nine noise positions individually. Horizontal coordinates run from -1 to 1; vertical coordinates run from 1 above to -1 below. Center still uses binaural processing. Elevation perception varies by listener and headphones.

STEREO MODE omits both spatial coordinates and uses horizontal pan alone. BINAURAL MODE restores coordinates for new events; an active voice retains its original position. These modes affect only this section. SPATIAL CHORD places a whole chord above/right, and SPATIAL PATTERN places three broadband hits using per-step coordinates. Binaural events omit stereo pan fields.

Output remains two channels on a front plane, without rear positioning, distance attenuation or head tracking. See the [integration guide](../../references/guide.md#integrate-binaural-in-a-2d-app).

## Audio session

PLAYBACK SESSION and AMBIENT SESSION shut down the existing stream, cancel pending patterns, start the selected policy and restore master volume. They do not resume old sounds; a second `start()` alone cannot change a running session's policy.

On physical iOS hardware, compare another app's music, silent mode and an output-route change. Ambient respects silent mode and mixes with other apps; playback ignores silent mode and normally interrupts them. Android accepts both strings without changing its output. Simulator results do not establish physical interruption or route behavior.

## Statistics

READ STATS takes a snapshot without resetting counters or enabling diagnostics. TOGGLE DIAGNOSTICS enables callback timing and signal meters, refreshing at 5 Hz; disabling it stops the timer and optional measurements while retaining basic counters. RESET STATS clears accumulated statistics without stopping voices or cancelling scheduled work.

The panel shows active/peak/spatial/tail voices, pending commands, replacements, request/publication rejections, priority drops, callback load, stereo peak and backend underruns. Unavailable measurements remain `n/a`, distinct from zero. Signal windows need about 200 ms after enabling diagnostics. See the [field reference](../../references/api.md#getstats).

Render load is callback elapsed time divided by the budget for that block. It is not total app CPU. The stream continues rendering silence with zero voices. Compare measurements on the same device, route, configuration and load; a clean counter does not establish audio quality. Turn diagnostics off before leaving this foreground example in the background.

## Checks and limits

From the module repository root:

```sh
node --test tests/example_app_regression.js tests/sequence_owner_regression.js
```

These checks execute the real interactive callbacks and the current public adapter over native payload spies. They cover preserved synthesis parameters, rejection feedback, spatial bypass, repeated finite shots, session/gain restoration, diagnostics, native retirement coalescing, active updates, late events and close-before-start. Native validator replay and platform listening acceptance remain separate. Host checks do not establish layout, perceived elevation, silent-mode behavior or sound quality.
