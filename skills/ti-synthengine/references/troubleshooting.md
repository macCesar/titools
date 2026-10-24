> Source snapshot: official TiSynthEngine 1.0.0 documentation at release source commit `e7cbbe8a6f9ab38088fd8029c7b43cef6501101f` (2026-10-24). Upstream `documentation/troubleshooting.md` SHA-256: `939960cde5860569699916208c0d3b352e60ba2a7603b5046dcefa9970294b70`.

# Troubleshooting

Start with the Boolean returned by the call and the native log. Most silent requests are contract rejections, a stale binary or an engine that never started.

## A call returns `false`

For methods that emit structured validation warnings, inspect logcat or the Xcode console:

```text
event=validation_warning method=playTone key=duraton reason=unsupported_option action=rejected value=200
```

Always check the return value: `playSequence` rejects with 0, while Boolean methods reject with `false`. Some sequence/control rejection paths do not emit a structured warning; absence of a new log entry does not establish acceptance.

Common fixes:

| Reason                              | Check                                                                                                                   |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `unsupported_option`                | Remove or correct the named key. Every options object is strict.                                                        |
| `invalid_step_type`                 | Make every pattern step an object, not a number or string.                                                              |
| `conflicting_pitch_fields`          | Timed/held calls use mutually exclusive `note`/`frequency`; each sequence step uses exactly one `notes` array, `frequencies` array or `rest: true`.                                                                   |
| `missing_pitch_or_rest`             | Add one pitch field or an explicit rest.                                                                                |
| `out_of_range`                      | Compare the value with `getDefaults().limits`.                                                                          |
| `not_integer`                       | Use integer milliseconds for timed tone/chord envelope fields and integer waveform values; native sequence intervals and lengths may be fractional.                                                      |
| `invalid_note`                      | Check spelling, accidental case and octave.                                                                             |
| `invalid_sample_count`              | Supply 2 to 64 values in `waveTable`.                                                                                   |
| `unsupported_value`                 | Use `none`, `lowpass`, `highpass` or `bandpass` for `filterType`.                                                       |
| `sustain_without_decay`             | Add a `decay` greater than 0, or remove `sustain`.                                                                      |
| `decay_exceeds_remaining_duration`  | Shorten `attack` or `decay`, or lengthen `duration`. The default attack counts.                                         |
| `filter_type_required`              | Set `filterType` to a filter, or remove `filterHz`, `filterHzEnd` and `filterQ`.                                        |
| `fm_requires_sine`                  | Use `SINE` for FM, or set `fmDepth` to 0 and remove `fmDepthEnd`.                                                       |
| `fm_depth_required`                 | Set `fmDepth` or `fmDepthEnd`, or remove `fmRatio`.                                                                     |
| `conflicting_spatial_fields`        | Remove `pan`, `panEnd`, `pans` and `panSpread` whenever sending `spatialX` or `spatialY`; check pattern root and steps. |
| `too_many_values`                   | Pass no more `pans` or `detunes` than the chord has pitches.                                                            |
| `missing_required` with `waveTable` | Add a table whenever `waveType` is `WAVETABLE`.                                                                         |
| envelope reason                     | Make attack and release fit inside total duration.                                                                      |

Warnings are deduplicated by method, key and reason. Repeating the same bad call may return `false` without printing a new line each time.

An `overflow` warning means the command queue was full. Reduce the command burst or wait for the audio thread to consume queued work. A chord is either accepted in full or rejected; it cannot start partially.

The envelope and filter rules apply to the final values of each sounding event. In a native sequence, each step's `overrides` merges over root `voice`: root `voice.sustain` is valid when every sounding step supplies compatible decay, and `voice.filterHz` needs a non-none filter type after merging. Timed tones/chords enforce their total-duration envelope budget; held and sequence ADSR has no sequence-interval budget. A `detune` that pushes the pitch, or `frequencyEnd`, outside the frequency range is rejected with `out_of_range`.

`fmDepthEnd: 0` is valid. It sweeps the index down to nothing. Omit the key, rather than passing 0, when the index should not move.

For the shaping controls, check the discontinuous disabled values as well as the numeric range: `bitDepth` accepts 0 or 2 through 16, and `pulseWidthEnd` accepts 0 or 0.05 through 0.95. A `waveTable` must contain only finite values from -1 to 1.

## The installed contract is wrong

Check the native binary at startup:

```javascript
var actual = synth.getDefaults().apiVersion
if (actual !== '1.0.0') {
  throw new Error('Expected TiSynthEngine 1.0.0, found ' + actual)
}
```

Confirm both entries in `tiapp.xml` pin 1.0.0. Then remove the application's build output and rebuild so Titanium does not reuse an archive from an earlier build. The module directories should be:

```text
modules/android/ti.synthengine/1.0.0/
modules/iphone/ti.synthengine/1.0.0/
```

For binaural, also inspect `getDefaults().limits.spatialX` and `.spatialY`. Use the official packages to avoid stale development binaries. Copying the package does not update an already installed app: rebuild and reinstall it.

## Binaural does not change the position

Inspect the options sent to the native method as well as the settings screen:

- Every effect that should be spatial sends `spatialX` and/or `spatialY`. A switch alone does not modify existing playback calls.
- Values are finite numbers within -1 to 1, with positive Y above and negative Y below. A 0 to 100% height slider scales the source position; it does not put all sounds above.
- Turning binaural off removes both coordinate keys. Sending zeros leaves binaural enabled at the front center.
- No stereo placement fields remain, even with value 0 or through pattern inheritance. Handle the Boolean return value.
- The installed contract reports both spatial limits and the device has the rebuilt app.
- Use headphones and one broadband event at a time; with binaural off, points with the same X use the same horizontal placement regardless of Y.
- Timed tones/chords and each sequence attack keep their specified position. A spatial held voice can move through `updateVoice({ voiceId, spatialX, spatialY })`; omitted coordinates retain their previous value, and the FIR ramps over 10 ms without clearing history. A stereo voice cannot be converted to spatial by an update.

The [integration guide](guide.md#integrate-binaural-in-a-2d-app) contains the JavaScript conversion and explains switch/slider behavior.

## Statistics are missing or show `null`

Older development packages can report 1.0.0 without statistics methods. Check `typeof synth.getStats`, `typeof synth.setStatsEnabled` and `typeof synth.resetStats`; install the current packages, rebuild and reinstall the app if needed.

Basic voice/queue/rejection counters do not require diagnostics. Timing, output peak/RMS and limiter reduction require `setStatsEnabled(true)` and a measured callback/window. `null` means unmeasured or unavailable; keep it distinct from zero. The current iOS backend always reports `null` for underruns, output buffer size and estimated hardware latency. Android backend metrics are best-effort and independent of the diagnostic switch.

Read at a modest rate, such as 5 Hz, and stop polling and optional measurements when the diagnostic owner hides or closes. `getStats()` never resets counters; call `resetStats()` deliberately. See the [integration recipe](guide.md#read-engine-statistics).

## Render load changes while no notes are playing

`renderLoad` is measured callback elapsed time divided by the time represented by that audio block. The native value is a fraction: `0.012` means 1.2%, and `1.0` means 100%. The interactive example displays percentages.

An open stream keeps delivering blocks, even in silence. It consumes commands, processes the output/limiter and measures signal levels when diagnostics are enabled. That work continues with zero active voices. Later sounds can use the running output without reopening it for each event, reducing repeated startup work. Envelopes and fades still handle abrupt signal changes; an open stream alone cannot guarantee a click-free onset.

The iOS app-wide session policy (`ambient` or `playback`) is separate from whether the native stream is open. Scheduling, system activity and measurement overhead cause elapsed time to vary between blocks. Expect a small, changing baseline. The two displayed decimals do not guarantee that level of timing accuracy.

A block at 100% has used its nominal time budget; repeated readings at or above that level warrant investigation. Low readings describe the observed blocks and do not prove every deadline was met or establish sound quality. Compare matching configurations on the same device. Stopping playback with `stopAll()` leaves the stream open; `shutdown()` closes it and optional measurements become `null`. See the [statistics contract](api.md#getstats).

## The first sound glitches

Do not start the engine during the first layout. Add the `postlayout` listener before opening the window, debounce it for about 250 ms, and start after the screen settles. Cancel the timer if the owner closes first. The complete code is in the [guide](guide.md#lifecycle).

If startup remains noisy, temporarily remove other launch work and increase the quiet period. Ads, animations, remote configuration and another audio module can all compete during the same short interval.

## The app is silent

Check these in order:

1. `start()` returned `true`.
2. The tone, chord or pattern call returned `true`.
3. Master and event `volume` are above zero.
4. The device media volume is up and the expected route is selected.
5. `shutdown()` was not called by another owner.
6. The note is within the current frequency range.
7. The app retained the positive sequence identifier and checked publication acceptance.

On iOS, the module uses a `Playback` session by default, so the silent switch should not mute it. With `audioSession: 'ambient'` the silent switch mutes it by design. Another audio component can change the app-wide session after engine startup; inspect the order if behavior differs from the simple example.

## A sequence stops or skips steps

Check the positive sequence ID, available `maxSequences` capacity and accepted updates. New sequences do not replace existing ones. All sequences and direct events share the voice pool; higher-priority voices can cause an entire lower-priority chord to drop. Inspect `priorityDropCount`, `rejectedPublicationCount` and output diagnostics separately. A stopped or completed identifier is retired and cannot be resumed by an update.

## `sequenceend` never arrives

The event uses `{ sequenceId, reason }`, where reason is `completed` or `stopped`. Looping sequences complete only after an explicit stop. Check that publication returned a positive ID, the listener remains registered and JavaScript is able to receive events. Delivery happens outside audio and does not time the next attack. Shutdown tears down the owner; do not depend on a future completion callback after cleanup.

## A chord is distorted or pumps

Use one `playChord()` call for notes that should begin together. Several `playTone()` calls have independent source gain and produce a hotter sum.

If the limiter engages repeatedly:

- lower event volume;
- lower `filterQ`, because a resonant low-pass or high-pass boosts its cutoff by about Q;
- use `conservative` instead of `balanced` or `raw`;
- use `speakerSafe` on a small speaker;
- avoid retriggering a long event before its previous release ends.

A repeating overlap test is expected to change the summed level. Judge tonal quality with one chord, then use the loop only to test stress behavior.

## The phone speaker buzzes but headphones are clean

The physical speaker or its protection system is usually the cause. Try `speakerSafe`, lower the event level, shorten low-frequency energy, or move the important pitch above roughly 200 Hz. A digital limiter cannot make a tiny speaker reproduce bass it cannot move cleanly.

Compare several devices before changing the synthesis globally. A resonance on one handset may not exist on another.

## Audio changes after connecting headphones

Route recovery is automatic, but the sound crossing the hardware transition may end early. The operating system can also mute or fade the new route for a brief device-dependent interval. Wait for the route to settle and play a new sound; do not restart the app.

If later sounds remain silent, capture the Android or Xcode log around the route change. Confirm that no screen lifecycle handler called `shutdown()` at the same time.

## Android-specific checks

- Force-stop stale builds and other audio-heavy apps before comparing runs.
- Confirm the device ABI exists in the installed module archive.
- Capture logcat for Oboe stream errors and reopen messages.
- Test the release build as well as a debug build; startup load can differ.
- Treat background and screen-off playback as a product-specific device test.

## iOS-specific checks

- Confirm the deployment target is iOS 15 or newer.
- Check whether another module changes `AVAudioSession` after startup.
- Test interruptions, phone calls, Bluetooth and route changes on hardware.
- Use the matching device or simulator slice from the 1.0.0 archive.

## What to include in a bug report

Include the platform, OS version, device model, Titanium SDK version, module version, mixing profile, `maxVoices`, the smallest accepted call that reproduces the problem, and the native log around startup and playback. For a sound-quality report, say whether it reproduces through the built-in speaker, wired headphones, Bluetooth or all routes.

## Held notes, sequences or effects methods are missing

The official release reports API version 1.0.0. Detect `noteOn`/`noteOff`/`updateVoice`, all four sequence methods and `setMasterProcessing` according to the feature needed. Install matching current Android/iOS packages, rebuild and reinstall the consumer app. A stale development binary may report the same version without the complete release API. See [capability detection](guide.md#detect-required-capabilities).

## A held voice does not release or update

Use the original positive `voiceId`, not the pitch or an ID that has already been reused. `noteOn` does not accept `duration` or temporal `*End` fields. Source, filter type, table, quantization and ADSR require a new attack. Compatible `updateVoice` controls include live noise clock, one-pole cutoff, spatial position for a spatial voice, stereo pan for a stereo voice, modulation and explicit effect send, in addition to pitch/volume/filter/vibrato/FM/pulse targets. Changed continuous controls ramp for 10 ms while retaining phase, envelope and spatial history; `noiseRate: 0` means white noise and `lowPassHz: 0` bypasses that filter.

Check Boolean returns. A full public queue can reject `noteOff`; retry twice at 16 ms outside render, then shut down/report if still rejected. Cancel those retries on owner teardown. The [held motor example](advanced-examples.md#sustained-game-motor) implements this policy. Touch cancellation, pause and close need cleanup as well as normal key up.

An ended or stolen ID accepts updates as a no-op, so acceptance does not prove audible continuity. Held voices share capacity with timed sounds and transport voices. Check replacement counts under dense collision load, leave headroom in the pool and use an app-owned renewal policy if needed. Increasing capacity above 32 or enabling reverb does not reserve a voice.

## A native sequence edit seems delayed or does not resume

Boolean update acceptance precedes application. Query `getSequenceState({ sequenceId }).revision` when the state is non-null. Structural edits enter at the next step and swing at the next pair. `setTempo` applies globally at the next audio block. Bank pressure rejects the whole publication; retain accepted UI state and retry later. Updates cannot resume retired IDs; create a new sequence and store its new ID. Steps contain MIDI `notes`, `frequencies` or `rest: true`, with optional interval `duration` and independent note `length`.

## Effects are silent, remain audible when disabled or affect other sounds

The stream must run and `setMasterProcessing` must accept the configuration. Effects start disabled. Check `applyTo` categories, each event's `bus` and any explicit `effectSend`, which overrides selection. Delay and LFO sync follow global `setTempo`, initially 120 BPM. Free settings retain hertz or milliseconds.

Disabling effects closes input smoothly and lets bounded tails finish, then bypasses exactly. It retains input gain. Panic through `stopAll` stops every sequence, fades voices and invalidates effect histories. Shutdown closes audio and frees resources. Saturation changes timbre separately from the limiter.

## A brief level dip is gone before the meter refreshes

Enable diagnostics, reset deliberately, then inspect `preLimiterPeakDb` and `maxLimiterReductionDb`. They retain the native pre-limiter peak and greatest attenuation since reset, including brief interventions between UI polls. `limiterReductionDb` is a window measurement and can return to zero sooner. Older packages may omit the accumulated fields; disabled/unmeasured diagnostics return `null`. See [measurement example](advanced-examples.md#measure-peaks-and-limiter-reduction).

If accumulated attenuation remains near zero, investigate phase cancellation between repeated same-pitch oscillators, changing filters or the device speaker/protection path. Compatible released public held-note repetitions preserve predecessor phase; simultaneous unisons, timed calls and transport notes retain their existing phase behavior. Extra effects and resonance can consume headroom even when source gain is fixed. Compare matched levels through headphones and the physical speaker before changing the mix globally.

## A wavetable sounds rough

`WAVETABLE` repeats the supplied values using a stepped lookup. A short table can sound grainy or buzzy even when its values describe a sine wave and `bitDepth` is 0. Its harmonic character changes with pitch and filtering; this does not require reverb, an LFO or creative saturation to be enabled.

Compare one note with `SINE`, at a comfortable matched level, to distinguish the source's texture from the combined sound of overlapping notes. Read `preLimiterPeakDb` and `maxLimiterReductionDb` with diagnostics enabled to investigate mix headroom. No limiter reduction does not prove that the physical speaker, headphones or output processing are clean. Keep a subjective listening observation separate from a confirmed clipping or buffer-loss diagnosis.
