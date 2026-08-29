> Source snapshot: official TiSynthEngine 1.0.0 documentation at commit `6685b81` (2026-08-29).

# Recommendations

The defaults work for ordinary tones and chords. The choices below matter when
an app has dense overlap, user-controlled values, demanding speakers or several
audio systems sharing one lifecycle.

## Group simultaneous notes

Use `playChord()` when pitches form one known simultaneous event. The chord is
atomic and its source gain accounts for its voice count. Separate `playTone()`
calls are appropriate for independent touches and effects, but their start
times and gain are independent too.

For keys or pads a user can trigger freely, keep each event around 0.4 to 0.7
until the worst overlap has been heard. Raising every event above 1 is usually
a sign that the session needs `balanced`, not that each note needs more gain.

## Choose the mixing profile once

| Situation | Profile |
| --- | --- |
| General app audio and chords | `conservative` |
| Mostly single notes that need more level | `balanced` |
| Low pitches or distortion from a small phone speaker | `speakerSafe` |
| The app performs its own strict gain staging | `raw` |

The profile is fixed for the stream. Changing it requires `shutdown()` and a
new `startEngine()` call, so it should not be a live sound-design control.

If a phone buzzes under `speakerSafe`, lower the event volume or raise the
pitch. Small drivers can distort acoustically even when the digital output is
well below its ceiling.

## Size `maxVoices` for real overlap

`maxVoices` controls capacity. It does not make the engine louder or quieter.

| App behavior | Starting value |
| --- | ---: |
| Occasional interface feedback | 4 to 8 |
| Game effects with overlap | 8 to 16 |
| Chords, keys or long release tails | 16 to 24 |
| Explicit stress testing | 32 |

Count release tails, not just buttons pressed at the same instant. A new voice
steals the slot with the least time remaining when the pool is full. The short
fade prevents a hard click but cannot preserve the stolen note.

## Keep one lifecycle owner

Require the module in one audio service or controller, start it after the first
layout settles, and shut it down from the same owner. This avoids an engine that
outlives its window or a timer that starts after cleanup.

A 250 ms debounce after `postlayout` is a practical baseline for a plain
screen. Heavy startup work, advertisements or entry animations may need more.
Measure the real app instead of increasing the delay indefinitely.

Route recovery is automatic. Do not call `shutdown()` just because headphones
were inserted or removed. The sound crossing the transition may end early;
play later sounds normally once the system has moved to the new route.

## Coexisting with other audio

On iOS, the audio session is app-wide and the last component to configure it
wins. TiSynthEngine selects `Playback`, which ignores the ring/silent switch and
normally interrupts other apps. That behavior fits an instrument or an app
whose sound must be heard.

A game that should respect the silent switch may set Titanium's ambient
category after the last engine startup:

```javascript
if (Ti.Platform.osname !== 'android') {
  Ti.Media.audioSessionCategory = Ti.Media.AUDIO_SESSION_CATEGORY_AMBIENT
}
```

The order is important because `startEngine()` configures the session. Other
native audio modules may configure it again. Test the final startup sequence,
interruptions, background behavior and route changes on iOS before relying on
an override.

Android mixes independent output streams at the system level, but another app
or stale test process can still consume low-latency resources. Force-stop old
test builds when diagnosing a glitch that does not reproduce after reboot.

## Validate values at the app boundary

The native API rejects invalid values instead of clamping them. Use
`getDefaults().limits` for a user-facing slider, remote configuration or saved
sound preset.

```javascript
function acceptedFrequency (raw) {
  var value = Number(raw)
  var range = synth.getDefaults().limits.frequency
  if (!isFinite(value)) return null
  if (value < range.min || value > range.max) return null
  return value
}
```

Do not copy the frequency maximum into application code. It depends on the
active sample rate and should be read again after startup.

Check Boolean return values during development. A rejected call includes the
method, key and reason in the native log. Logging that result at the caller is
often enough to identify a stale preset or misspelled field.

## Test the intended sound

Listen on the output people will use. Headphones reveal noise and stereo detail;
the phone speaker reveals acoustic buzz, weak bass and mono collapse. Test at
low, normal and high system volume.

Use one sustained chord when judging polyphonic timbre. A loop that starts the
same chord before its predecessor finishes deliberately changes the number of
overlapping events. That can drive the limiter in a repeating cycle and sound
like pumping. Keep the loop as an extreme scheduling and recovery test, not as
the reference for how the chord should sound.

Exercise the real worst case:

- every pad the UI allows at once;
- the fastest pattern the app can request;
- a long release followed by unrelated feedback;
- a route change while a note is playing;
- screen off, interruption and background transitions if the product depends
  on them.

An underrun counter only describes transport. A clean counter cannot tell you
whether a waveform, pitch or mix is pleasant.

## Known limits

- There are no per-voice handles. A single active note cannot be edited or
  stopped; `stopAll()` affects the whole pool.
- Every event has a finite duration of at most 60 seconds. There is no looping.
- The module synthesizes waveforms and does not play audio files.
- Only one pattern scheduler is pending at a time.
- There is no completion event for a note, chord or pattern.
- The module emits no JavaScript events.
- Voice capacity and mixing profile remain fixed until shutdown.
- Pattern scheduling is timer-based, not sample-accurate.

Use a sample player or a dedicated music engine when a product needs streaming,
loop points, per-voice control or a synchronized composition timeline.
