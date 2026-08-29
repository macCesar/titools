> Source snapshot: official TiSynthEngine 1.0.0 documentation at commit `6685b81` (2026-08-29).

# Audio engine

This page explains the native signal path behind the JavaScript API. You do not
need it to play a sound, but it helps when choosing a mixing profile, sizing the
voice pool or investigating device behavior.

## Signal path

```text
playTone / playChord / playPattern
             |
       strict validation
             |
   native command ring buffer
             |
 voice pool: oscillator * envelope * event gain * stereo pan
             |
       sum voices and steal tails
             |
      smoothed master volume
             |
 stereo-linked lookahead limiter
             |
        floating-point output
```

The audio callback does not allocate memory or wait on a lock. JavaScript and
the pattern scheduler publish small commands; the real-time thread consumes
them and renders the samples.

## Oscillators

The engine has five sources:

| Waveform | Source behavior |
| --- | --- |
| `SINE` | Direct sinusoid. |
| `SQUARE` | PolyBLEP band-limited discontinuity. |
| `SAWTOOTH` | PolyBLEP band-limited discontinuity. |
| `TRIANGLE` | Continuous triangle oscillator. |
| `NOISE` | White-noise generator. |

Pitch can move linearly from `frequency` to `frequencyEnd`. A sine LFO adds
`lfoDepth * sin(lfoPhase)` in hertz before the oscillator advances. This makes
vibrato depth absolute in hertz rather than cents.

## Envelope

Each voice has a linear attack, a full-level middle section and a linear
release. `duration` includes the whole envelope. Defaults are adjusted to fit a
short event, while an explicit envelope that cannot fit is rejected by the
contract.

Voice stealing does not cut the old waveform at an arbitrary sample. The old
voice contributes a short tail of roughly 6 ms while the slot begins the new
event. `stopAll()` uses a release of roughly 20 ms for the same reason.

## Event gain

In protected profiles, gain is fixed when an event starts:

```text
voiceGain = waveformGain(waveType) * profileFactor / sqrt(eventVoiceCount)
```

One tone and one pattern step have an event voice count of 1. A chord uses the
number of pitches in that chord. Dividing by the square root of the count keeps
the event close to constant power without changing gain sample by sample.

Waveforms are calibrated toward a common source RMS:

| Waveform | Base gain | Approximate output RMS |
| --- | ---: | ---: |
| Sine | 0.440 | 0.311 |
| Square | 0.311 | 0.311 |
| Sawtooth, triangle and noise | 0.539 | 0.311 |

This calculation is why one three-note `playChord` and three `playTone` calls
are not equivalent. A protected sine triad assigns about 0.254 to each chord
voice (`0.440 / sqrt(3)`). Three separate tone events each receive 0.440, for a
much hotter worst-case sum.

## Mixing profiles

The profile is fixed when `startEngine()` opens the stream.

| Profile | Factor | Sine gain | Limiter ceiling | Intended use |
| --- | ---: | ---: | ---: | --- |
| `conservative` | 1 | 0.440 | 0.85 | Default headroom for polyphony and effects. |
| `balanced` | `sqrt(2)` | 0.622 | 0.85 | Mostly one or two simultaneous voices. |
| `speakerSafe` | `1 / sqrt(2)` | 0.311 | 0.70 | Small speakers and demanding low pitches. |
| `raw` | no source reduction | 1.000 | 0.85 | App-controlled gain staging. |

`raw` lets one full-volume oscillator reach full scale before the master. Any
overlap then relies on the limiter, so it is not a general-purpose loudness
setting.

## Limiter

A single stereo-linked peak limiter sits after master volume. Linking preserves
the stereo image when only one channel has the largest peak.

| Parameter | Value |
| --- | --- |
| Lookahead | 10 ms |
| Release | 100 ms, exponential |
| Ceiling | 0.85, or 0.70 with `speakerSafe` |

Lookahead gives the gain time to reach a safe value before the peak reaches the
output. Below the ceiling the limiter converges back to unity. It is meant to
catch exceptional sums, not to normalize every callback.

Repeated overlapping events can make any limiter audibly raise and lower the
bus. A loop that starts a 300 ms chord every 100 ms is therefore a useful load
test and a poor tonal reference. Judge the chord with one sustained event; use
the overlapping loop only when testing scheduling, stealing and recovery.

## Master volume and pan

`setVolume()` ramps the master rather than applying a discontinuous gain step.
Per-event `volume` is multiplied before the bus. Values up to 2 are valid, but
values above 1 use headroom and make limiting more likely.

Pan uses equal-power coefficients. A centered sound feeds both channels; the
sum does not simply double. `panEnd` interpolates the position across a tone or
pattern step. Chords use `panSpread` or the explicit `pans` array.

## Voice pool

`maxVoices` reserves between 1 and 32 active voice slots. The setting controls
capacity, not event gain. When every slot is occupied, the voice with the least
time remaining is faded and its slot is reused.

A chord is one command with up to 32 pitches. If its size exceeds the session's
voice capacity, slots with the least time remaining are reused. For normal apps,
choose the largest real overlap plus room for release tails.

## Command queue

Both ports use a 128-slot single-consumer ring buffer. Producers are serialized
with a lock that the audio callback never touches. When note commands cannot be
queued, the public call returns `false` and logs an `overflow` warning.

`playChord()` publishes its note data and advances the queue index once. The
consumer receives the complete event or nothing. `stopAll` and `shutdown` have
a control fallback so cleanup is not lost under queue pressure.

Pattern timing runs outside the audio callback. A platform timer places each
step on the command queue. The sequence is suitable for game cues and simple
musical patterns, but it is not a sample-accurate composition timeline.

## Android implementation

Android renders in C++ through Oboe. The stream requests floating-point output,
low-latency performance and exclusive sharing when the device supports it. If
exclusive access is unavailable, Oboe can use shared mode.

The renderer mixes in the data callback and targets a small device buffer. A
route or stream error triggers a reopen on the current output. The supported
ABIs are `arm64-v8a`, `armeabi-v7a`, `x86` and `x86_64`.

## iOS implementation

iOS renders with `AVAudioEngine` and `AVAudioSourceNode`, using the active
session's sample rate. The module configures the audio session as `Playback`,
activates it, and observes route and engine configuration notifications. If a
route change stops the graph, the port reactivates the session and resumes the
existing renderer.

`AVAudioSourceNode` requires iOS 13 or newer. The module archive contains device,
simulator and Mac Catalyst slices.

## Latency

End-to-end latency contains three main pieces:

1. The fixed 10 ms limiter lookahead.
2. The hardware and operating-system output buffer.
3. JavaScript or platform timer scheduling before the command reaches audio.

Immediate calls are suitable for interface and game feedback. A visual or
musical event that must align to a known future time should be scheduled ahead
by the app instead of relying on a JavaScript callback at that instant.

## Route behavior

Connecting headphones or changing another output route can interrupt the
hardware stream. The ports recover automatically, though the event crossing
the transition may be cut short and the operating system may keep the new
route muted briefly. Start later sounds normally after the route settles.

## Regression coverage

The repository checks the public contract and both source ports without a
device:

```sh
node tests/api_contract_regression.js
node tests/default_profile_regression.js

cd android
test_dir=$(mktemp -d /tmp/ti-synth-test.XXXXXX)
javac -d "$test_dir" \
  src/ti/synthengine/SynthContract.java \
  test/ti/synthengine/SynthContractRegression.java \
  src/ti/synthengine/SynthDsp.java \
  test/ti/synthengine/SynthDspRegression.java
java -cp "$test_dir" ti.synthengine.SynthContractRegression
java -cp "$test_dir" ti.synthengine.SynthDspRegression
```

The DSP suite covers stable RMS from 1 through 32 voices, limiter transparency
and recovery, waveform discontinuities, envelope endpoints, master smoothing,
voice stealing and representative dense chords. Device tests remain necessary
for route changes, startup underruns and speaker acoustics.
