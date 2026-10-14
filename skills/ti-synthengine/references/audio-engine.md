> Source snapshot: official TiSynthEngine 1.0.0 beta documentation from the uncommitted working tree based on `ef62edd` (captured 2026-10-14). Upstream `documentation/audio-engine.md` SHA-256: `2266b2997b9799bc40c499bd24ecb7d689da9815f05c46abccdb0733b5d37937`.

# Audio engine

This page explains the native signal path behind the JavaScript API. You do not
need it to play a sound, but it helps when choosing a mixing profile, sizing the
voice pool or investigating device behavior.

<!-- TOC-START -->
## Contents

- [Signal path](#signal-path)
- [Oscillators](#oscillators)
- [Envelope](#envelope)
- [Event gain](#event-gain)
- [Mixing profiles](#mixing-profiles)
- [Limiter](#limiter)
- [Master volume and pan](#master-volume-and-pan)
- [Voice pool](#voice-pool)
- [Command queue](#command-queue)
- [Shared DSP core](#shared-dsp-core)
- [Android implementation](#android-implementation)
- [iOS implementation](#ios-implementation)
- [Latency](#latency)
- [Route behavior](#route-behavior)
- [Regression coverage](#regression-coverage)
- [Binaural front-plane renderer](#binaural-front-plane-renderer)

<!-- TOC-END -->

## Signal path

```text
playTone / playChord / playPattern
             |
       strict validation
             |
   native command ring buffer
             |
 voice pool: source (or FM) -> quantizer -> one-pole low-pass
             -> state-variable filter -> envelope -> gain and pan
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

The engine has six sources:

| Waveform | Source behavior |
| --- | --- |
| `SINE` | Direct sinusoid. |
| `SQUARE` | PolyBLEP band-limited discontinuity. |
| `SAWTOOTH` | PolyBLEP band-limited discontinuity. |
| `TRIANGLE` | Continuous triangle oscillator. |
| `NOISE` | White or variable-rate sample-and-hold pseudo-random generator. |
| `WAVETABLE` | Caller-supplied 2 to 64-sample stepped cycle. |

Pitch can move linearly from `frequency` to `frequencyEnd`. A sine LFO adds
`lfoDepth * sin(lfoPhase)` in hertz before the oscillator advances. This makes
vibrato depth absolute in hertz rather than cents.

Noise rate advances an independent phase accumulator. A zero `noiseRate` uses
one new pseudo-random value per output sample; a positive rate holds that value
until the accumulator crosses the next update. `noiseRateEnd` changes the
increment linearly over the event.

The source is optionally quantized to the selected `bitDepth` (2 to 16 bits)
and then passes through a one-pole low-pass filter when `lowPassHz` is nonzero.
Square waves use `pulseWidth` for the second PolyBLEP discontinuity and can
interpolate that duty cycle toward `pulseWidthEnd`.

### Frequency modulation

A `SINE` voice with a positive `fmDepth`, or with `fmDepthEnd`, is phase
modulated: the carrier computes `sin(2 * pi * phase + depth * sin(2 * pi *
modPhase))`. The modulator phase advances by the carrier's instantaneous phase
increment times `fmRatio`, so pitch sweeps and vibrato keep the ratio. The
index moves linearly from `fmDepth` to `fmDepthEnd` over the event. With a depth
of exactly 0 and no end, the voice takes the plain sine path.

The modulated sine has constant amplitude, so event gain is unchanged. Nothing
band-limits the sidebands, so a high carrier with a large index aliases.

### State-variable filter

`filterType` selects a topology-preserving state-variable filter that runs
after the one-pole `lowPassHz` stage. It is stable while its coefficients move,
which is why a cutoff sweep cannot blow up even at high Q.

| Output | Response |
| --- | --- |
| `lowpass` | 12 dB per octave, peak of about Q at the cutoff. |
| `highpass` | 12 dB per octave, peak of about Q at the cutoff. |
| `bandpass` | Unity gain at the center for every Q. |

The cutoff is held between 20 Hz and `sampleRate * 0.45`. With `filterHzEnd`
the cutoff follows `from * (to / from) ^ t`, where `t` runs from 0 to 1 across
the event, and coefficients are recomputed every eighth sample. Without a
sweep they are computed once, when the note starts.

## Envelope

Each voice has a smoothstep attack, an optional smoothstep decay to `sustain`,
a hold at that level and a smoothstep release. `duration` includes the whole
envelope. Defaults are adjusted to fit a short event, while an explicit
envelope that cannot fit is rejected by the contract.

```text
base = attack ramp, then decay ramp from 1 to sustain, then sustain
level = base * release ramp
```

The release ramp multiplies the base level, so a release that begins during the
decay is continuous. With `decay: 0` and `sustain: 1` the base is 1 after the
attack and the result is the plain attack, hold and release shape. Voice-steal
tails read the final level, so they stay continuous with the decay too.

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
| Sawtooth, triangle, noise and wavetable | 0.539 | signal-dependent |

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
musical patterns, but it is not a sample-accurate composition timeline. The
same timer fires `patternend`, about 1 ms after the sum of the step lengths,
and the event is handed to the JavaScript runtime asynchronously.

## Shared DSP core

The envelope, the state-variable filter, the sweep helpers, the FM sine and
the cents conversion live once, in `shared/synth_core.h`. It is plain C,
header-only and allocation-free. The Android renderer includes it from
`android/jni/SynthOboeEngine.cpp` and the iOS renderer from
`ios/Classes/TiSynthengineModule.m`, so both platforms run the same code. Voice
management, mixing and the limiter are still separate per platform.

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
or `Ambient` when `startEngine()` receives `audioSession: 'ambient'`, activates
it, and observes route and engine configuration notifications. If a route
change stops the graph, the port reapplies the category, reactivates the
session and resumes the existing renderer.

The module targets iOS 15 or newer. The module archive contains device,
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
node tests/documentation_regression.js

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

Three more checks cover the shared core, the Android engine and the iOS contract.

The shared DSP core builds with any C99 compiler:

```sh
test_dir=$(mktemp -d /tmp/ti-synth-core.XXXXXX)
cc -std=c99 -O2 -Wall -Wextra -o "$test_dir/dsp_core" \
  tests/dsp_core_regression.c -lm
"$test_dir/dsp_core"
```

It checks that the envelope equals the original attack, hold and release shape
for every attack and release combination when decay is off, the decay and
sustain endpoints and continuity, the response of each filter type (slope,
cutoff and the resonance peak), stability of every filter type under a cutoff
sweep on noise, FM sidebands against the Bessel function values and the cents
conversion.

The Android engine renders on the host. `tests/engine_render_host.cpp` compiles
`SynthOboeEngine.cpp` without opening an audio stream and drives the same
command and callback path Oboe uses. It needs the Oboe headers, which any
Gradle cache that built the module has, and the JDK's `jni.h`, so it is a local
check and does not run in CI:

```sh
OBOE=$(find ~/.gradle -path '*oboe-1.10.0/prefab/modules/oboe/include' | head -1)
JH=$(/usr/libexec/java_home)
test_dir=$(mktemp -d /tmp/ti-synth-engine.XXXXXX)
clang++ -std=c++17 -O1 -Wall -I"$OBOE" -I"$JH/include" -I"$JH/include/darwin" \
  -DHAS_EXPRESSIVE -DENGINE_CPP='"../android/jni/SynthOboeEngine.cpp"' \
  -Wl,-undefined,dynamic_lookup tests/engine_render_host.cpp \
  -o "$test_dir/engine_render"
"$test_dir/engine_render"
```

It renders decay and sustain levels, filter attenuation, an opening cutoff
sweep, FM sidebands and an FM index that decays to nothing, plus voice stealing
and `stopAll` with every control active. Built without `-DHAS_EXPRESSIVE` it
renders only the original controls and prints one hash per scenario, so the
same file can be built against an older copy of the engine and the hashes
compared.

The iOS contract replays the cases that the Java contract test writes to
`tests/contract_corpus.jsonl`. The Java test fails when that file no longer
matches the Java contract; regenerate it from `android/` with
`-Dsynth.corpus.out=../tests/contract_corpus.jsonl`. On macOS, run the iOS
side from the repository root:

```sh
test_dir=$(mktemp -d /tmp/ti-synth-ios.XXXXXX)
clang -fobjc-arc -Wall -Wextra -framework Foundation \
  tests/contract_corpus_ios.m ios/Classes/TiSynthengineContract.m \
  -o "$test_dir/contract_corpus_ios"
"$test_dir/contract_corpus_ios"
```

The iOS renderer shares the DSP math through the same header, but nothing
renders its output on the host, so check it on a device.

## Binaural front-plane renderer

`shared/synth_spatial.h` runs the same allocation-free FIR processor in both native ports, after each voice envelope and before summation/master/limiter. Nine stereo impulse responses from Gardner and Martin's MIT KEMAR measurements form a compact front-plane grid. The complete 128-sample source responses at 44.1 kHz are interpolated across direction and linearly resampled once at voice onset to the output rate. A single front-response energy calibration preserves directional differences. At 48 kHz the convolution uses 140 padded taps per ear. Buffers are reserved with the voice/tail pools; there are no runtime downloads, callback allocations, or additional callback locks.

Spatial voice-steal and stop tails copy the filter history as well as oscillator state. After the source envelope or fade ends, both ports drain the FIR with zero input for `taps - 1` samples before freeing the voice; this preserves even 1 ms events. Ordinary voices bypass the FIR. CPU cost grows with spatial voices, including short replacement tails. A fixed position avoids changing the filter during an event. The intended output-rate range is 8 to 192 kHz. Interpolated generic HRTFs provide directional cues, not guaranteed individual localization.

The shared processor check is `cc -std=c99 -O2 -Wall -Wextra -Wpedantic tests/spatial_regression.c -lm -o /tmp/spatial_regression` followed by `/tmp/spatial_regression`. `tests/spatial_engine_host.cpp` uses the same compile flags as `engine_render_host.cpp` and verifies native left/right rendering, elevation changes, stealing and stopping. Java spatial validation is checked by `SynthSpatialContractRegression`; the common Java/iOS corpus also covers spatial acceptance and conflicts.
