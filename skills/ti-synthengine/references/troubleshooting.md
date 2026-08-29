> Source snapshot: official TiSynthEngine 1.0.0 documentation at commit `6685b81` (2026-08-29).

# Troubleshooting

Start with the Boolean returned by the call and the native log. Most silent
requests are contract rejections, a stale binary or an engine that never
started.

## A call returns `false`

Look for a structured warning in logcat or the Xcode console:

```text
event=validation_warning method=playPattern key=steps reason=invalid_step_type action=rejected value=C4
```

Common fixes:

| Reason | Check |
| --- | --- |
| `unsupported_option` | Remove or correct the named key. Every options object is strict. |
| `invalid_step_type` | Make every pattern step an object, not a number or string. |
| `conflicting_pitch_fields` | Send only one of `note`, `frequency` or `rest: true`. |
| `missing_pitch_or_rest` | Add one pitch field or an explicit rest. |
| `out_of_range` | Compare the value with `getDefaults().limits`. |
| `not_integer` | Use whole milliseconds and integer waveform values where required. |
| `invalid_note` | Check spelling, accidental case and octave. |
| envelope reason | Make attack and release fit inside total duration. |

Warnings are deduplicated by method, key and reason. Repeating the same bad
call may return `false` without printing a new line each time.

An `overflow` warning means the command queue was full. Reduce the command
burst or wait for the audio thread to consume queued work. Chords are rejected
as a whole rather than partially started.

## The installed contract is wrong

Check the native binary at startup:

```javascript
var actual = synth.getDefaults().apiVersion
if (actual !== '1.0.0') {
  throw new Error('Expected TiSynthEngine 1.0.0, found ' + actual)
}
```

Confirm both entries in `tiapp.xml` pin 1.0.0. Then remove the application's
build output and rebuild so Titanium does not reuse an archive from an earlier
build. The module directories should be:

```text
modules/android/ti.synthengine/1.0.0/
modules/iphone/ti.synthengine/1.0.0/
```

## The first sound glitches

Do not start the engine during the first layout. Add the `postlayout` listener
before opening the window, debounce it for about 250 ms, and start after the
screen settles. Cancel the timer if the owner closes first. The complete code
is in the [guide](guide.md#lifecycle).

If startup remains noisy, temporarily remove other launch work and increase the
quiet period. Ads, animations, remote configuration and another audio module
can all compete during the same short interval.

## The app is silent

Check these in order:

1. `startEngine()` returned `true`.
2. The tone, chord or pattern call returned `true`.
3. Master and event `volume` are above zero.
4. The device media volume is up and the expected route is selected.
5. `shutdown()` was not called by another owner.
6. The note is within the current frequency range.
7. The app is not relying on a pattern that another `playPattern()` call
   replaced.

On iOS, the module uses a `Playback` session, so the silent switch should not
mute it. Another audio component can change the app-wide session after engine
startup; inspect the order if behavior differs from the simple example.

## A pattern stops or skips steps

Only one pattern is pending. A new `playPattern()` call cancels steps from the
previous scheduler that have not fired. Voices already on the audio thread keep
playing.

`stopAll()` fades current voices but does not cancel later scheduled steps. Use
`shutdown()` when both active audio and future scheduling must end, or replace
the pattern deliberately before stopping its current voices.

Make sure every step is an object and has exactly one pitch source:

```javascript
steps: [
  { note: 'C4' },
  { rest: true },
  { frequency: 660 }
]
```

## A chord is distorted or pumps

Use one `playChord()` call for notes that should begin together. Several
`playTone()` calls have independent source gain and produce a hotter sum.

If the limiter engages repeatedly:

- lower event volume;
- use `conservative` instead of `balanced` or `raw`;
- use `speakerSafe` on a small speaker;
- avoid retriggering a long event before its previous release ends.

A repeating overlap test is expected to change the summed level. Judge tonal
quality with one chord, then use the loop only to test stress behavior.

## The phone speaker buzzes but headphones are clean

That usually points to the physical speaker or its protection system. Try
`speakerSafe`, lower the event level, shorten low-frequency energy, or move the
important pitch above roughly 200 Hz. A digital limiter cannot make a tiny
speaker reproduce bass it cannot move cleanly.

Compare several devices before changing the synthesis globally. A resonance on
one handset may not exist on another.

## Audio changes after connecting headphones

Route recovery is automatic, but the sound crossing the hardware transition
may end early. The operating system can also mute or fade the new route for a
brief device-dependent interval. Wait for the route to settle and play a new
sound; do not restart the app.

If later sounds remain silent, capture the Android or Xcode log around the route
change. Confirm that no screen lifecycle handler called `shutdown()` at the same
time.

## Android-specific checks

- Force-stop stale builds and other audio-heavy apps before comparing runs.
- Confirm the device ABI exists in the installed module archive.
- Capture logcat for Oboe stream errors and reopen messages.
- Test the release build as well as a debug build; startup load can differ.
- Treat background and screen-off playback as a product-specific device test.

## iOS-specific checks

- Confirm the deployment target is iOS 13 or newer.
- Check whether another module changes `AVAudioSession` after startup.
- Test interruptions, phone calls, Bluetooth and route changes on hardware.
- Use the matching device or simulator slice from the 1.0.0 archive.

## What to include in a bug report

Include the platform, OS version, device model, Titanium SDK version, module
version, mixing profile, `maxVoices`, the smallest accepted call that reproduces
the problem, and the native log around startup and playback. For a sound-quality
report, say whether it reproduces through the built-in speaker, wired
headphones, Bluetooth or all routes.
