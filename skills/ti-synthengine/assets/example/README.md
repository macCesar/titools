> Source snapshot: official TiSynthEngine documentation at commit `ec04f4e634075c41b55f66279eabcd78b9652d58` (2026-11-02). Published module 1.1.0; public API 1.1.0. Upstream `example/README.md` SHA-256: `e191a701a3a913c85b15503fd256e0aec085eb731a587b1bf4faa43865c81982`.

# Interactive example

The Classic Titanium app in [app.js](app.js) demonstrates the timed sounds, native sequences and statistics with the `sequenceend` event on Android and iOS. It requires module version 1.1.0 and public API 1.1.0 for native finite-tone repetition, attack variation and the recommended note/statistics methods. Held voices, master processing and voice LFOs have copyable examples in the [advanced documentation](../../references/advanced-examples.md#sustained-game-motor); this reference app does not expose those newer controls. The default engine configuration is 16 voices, `conservative` mixing and the `playback` session; master volume starts at 100% and optional diagnostics start off.

## Run it

1. Create a Classic Titanium application with Android and/or iOS support. If the app uses Alloy, create a separate Classic test project and leave the Alloy-generated files in place.
2. Download the official [Android 1.1.0](https://github.com/macCesar/TiSynthEngine/releases/tag/android-1.1.0) and [iOS 1.1.0](https://github.com/macCesar/TiSynthEngine/releases/tag/ios-1.1.0) packages, or build the current module source. Source builds produce `android/dist/ti.synthengine-android-1.1.0.zip` and `ios/dist/ti.synthengine-iphone-1.1.0.zip`; select version `1.1.0` in both module entries when using them.
3. Put the archive for each target platform in the test app root. Add these entries inside its `tiapp.xml`:

```xml
<modules>
  <module platform="android" version="1.1.0">ti.synthengine</module>
  <module platform="iphone" version="1.1.0">ti.synthengine</module>
</modules>
```

Both packages report public API `1.1.0`; detect variation through both capability/schema announcements. Rebuild and reinstall after switching packages.

4. Copy the entire `example/` folder into the test app's `Resources/`, including [app.js](app.js), [sequenceScore.js](lib/sequenceScore.js) and [sequenceOwner.js](lib/sequenceOwner.js). It needs no images or audio files.
5. Build and run the test app with the Titanium CLI or your existing Titanium launch configuration. Use Titanium SDK 13.2.0.GA or newer, Android compile API 35 or newer, and iOS 15 or newer. See the [module installation guide](../../references/guide.md#install-the-module).

The example checks the installed API version, spatial limits and the recommended enable/disable statistics methods before constructing the screen. If it requests current packages, replace the native module, then rebuild and reinstall the app; copying module files alone does not update an app already on a device.

Audio starts after the first layout settles. Sound controls report native rejections. If startup fails, the session buttons remain available to retry. Closing the window removes its sequence listener, clears startup/statistics timers, disables diagnostics and shuts down the engine. The example plays finite sounds in the foreground and does not demonstrate background audio. Turn diagnostics off before leaving it in the background.

## Synthesis and sequencing

- Compare all six waveforms and equivalent English/solfege note names.
- Try stereo pan, pitch sweep, vibrato, variable-rate noise, pulse width, custom wavetable and quantization.
- Compare atomic chords with explicit pans, matched arpeggios, tempo/swing and noise percussion.
- Hear decay/sustain, resonant filtering, FM bell/electric piano and detuned voices.

Keep system volume moderate while comparing sounds. Master BOOST intentionally raises the bus above unity; use the 100% control to restore it. Repeated taps overlap events and may cause limiting or voice replacement.

## Headphone positioning

Use stereo headphones. In the binaural section, compare each of the nine noise positions one at a time: left/right runs from -1 to 1, above/below from 1 to -1. The center still uses binaural processing. Elevation perception varies with the listener and headphones, so the controls cannot guarantee localization for each person.

Select STEREO MODE and repeat points with the same horizontal position. Their height no longer affects placement because both spatial keys are omitted. BINAURAL MODE restores per-event coordinates. These two modes affect this section only; the ordinary stereo demos remain unchanged. An active voice keeps its original position.

SPATIAL CHORD places the whole chord above/right. SPATIAL PATTERN places three broadband hits above/left, below/center and above/right using per-step coordinates. Neither sends stereo pan fields while binaural is active. The output remains two channels on a front plane, without rear positioning, distance attenuation or head tracking. See the [app integration guide](../../references/guide.md#integrate-binaural-in-a-2d-app) for source mapping and amplitude sliders.

## Audio session

On iOS, compare PLAYBACK SESSION and AMBIENT SESSION. Changing the selection shuts down the engine, silently cancels any pending pattern, starts the new policy and restores the selected master volume. It does not resume the previous sound. The policy is fixed while the stream runs; a second `start()` alone cannot change it.

On an iOS device, play music from another app and try a short sound in ambient mode; compare with playback. Also compare the device's silent mode where available. Ambient should respect silent mode and mix with other apps; playback ignores silent mode and normally interrupts their audio. Android validates both strings but does not change its output. Simulator behavior does not establish the physical silent-mode, interruption or route behavior.

## Sequence completion and cancellation

1. Tap PATTERN END and wait for `sequenceend: completed`.
2. Tap it twice quickly. The example requests stop for its accepted sequence, coalesces repeated taps to the latest complete score, and publishes it only after the matching retirement event frees capacity. Native `sequenceend` events report `{ sequenceId, reason: 'completed' | 'stopped' }`.
3. Selecting a session shuts down the engine and restarts it with the selected policy. Events already queued for JavaScript can still arrive.
4. STOP ALL releases active voices and cancels future attacks. Closing the example shuts down its engine.

All successive attacks run on the native sample clock. The example compiles its note-name scores to millisecond sequences with explicit `duration` and `length`, preserving the original interval and release onset. Each sequence has one of `frequencies`, MIDI `notes`, or `rest: true` per step, with sound shaping in `voice`/`overrides`. Copy the entire `example/` folder, including `lib/sequenceScore.js` and `lib/sequenceOwner.js`, into a Classic app's Resources folder.

Completion marks the final scheduled step; releases and shared effect tails can remain audible. See the [event contract](../../references/api.md#sequenceend-event).

## Statistics

- READ STATS takes a fresh snapshot without resetting counters or enabling diagnostics.
- TOGGLE DIAGNOSTICS enables callback timing and signal meters, refreshing at 5 Hz. Toggle it off to stop the timer and optional measurements; basic counters remain available.
- RESET STATS clears accumulated statistics without stopping voices, cancelling queued work or changing the diagnostic switch. The next callback applies render-owned resets.

The panel shows active/peak/spatial/tail voices, pending commands, replacements, request/publication rejections, priority drops, callback load, stereo output peak and backend underruns. It displays `n/a` for unmeasured or unavailable values, keeping them distinct from zero. Signal windows need about 200 ms of output after enabling. Native snapshots also include RMS, limiter reduction, sample rate, buffer and latency fields; consult the [complete field reference](../../references/api.md#getstats) when integrating a full diagnostic view.

Render load divides callback elapsed time by the audio budget for that block; it does not measure total app CPU. The panel multiplies the native fraction by 100, so a reading of 1.20% means that fraction of the block budget, not 120%.

The shared final output stage retains zero samples. Master volume changes use a linear 10 ms ramp; overload can audibly change the mix. Even with zero voices, the stream renders silent blocks and runs output protection and any enabled diagnostics. Expect a small, changing baseline. The two decimal places are display formatting and do not guarantee that precision.

Compare readings on the same device with the same configuration and load; simulator and phone readings are not equivalent. Android backend metrics are best-effort. This iOS backend has no underrun/buffer/latency measurement, and a clean counter cannot establish sound quality.

## Checks and limits

Run these focused checks from the module repository root:

```sh
node tests/documentation_regression.js
node --test tests/example_app_regression.js
```

The example regression executes its real action callbacks with simulated Titanium UI/audio boundaries. It covers rejection feedback, placement/bypass, session restart and gain preservation, diagnostic cleanup and close-before-start. It does not render native audio or establish layout, perceived elevation, silent-mode behavior or sound quality. Use the device checklist above, including headphones and an output-route change, before claiming those results.


## Native attack variation

The ATTACK VARIATION button submits the same metal-strike recipe on each press. With `capabilities.variation === true` and `variationSchemaVersion === 1`, the renderer chooses pitch, FM depth and level once per admitted attack. Older packages receive the original recipe without the dictionary. This button uses independent timed events; the [variation guide](../../references/native-variation.md) separately demonstrates sustained ownership and native sequence retriggers. Physical listening acceptance remains separate from host correctness checks.

## Native finite-tone repetition

START REPEATING calls `repeatTone` once with a complete 105 ms square-wave shot and required `intervalMs: 200`. It retains the positive tone ID. EDIT REPEATING calls `updateTone` for that ID, keeping the next deadline and changing subsequent separation to 150 ms. STOP REPEATING calls `stopTone`, cancelling future attacks while admitted shots finish. Close, session changes and global Stop also release or invalidate ownership. There is no JavaScript attack timer for this demo.

`playTone` remains a standalone Boolean operation and rejects `intervalMs`; `repeatTone` always returns a numeric ID or 0 and requires the interval. Independent JavaScript calls remain supported, including finite bursts scheduled by an application's own event clock. See [the full contract and standalone burst example](../../references/api.md#finite-tone-repetition).
