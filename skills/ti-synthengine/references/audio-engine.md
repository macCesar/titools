> Source snapshot: official TiSynthEngine 1.0.0 beta documentation at reviewed local commit `7ab31107302d9b7027a6359ba1a6fdb49c250407` (2026-10-23); this synchronization does not publish that commit or a release. Upstream `documentation/audio-engine.md` SHA-256: `8b0ede7f5131c706cf0cfd5f9acbdb8cbcdcbc55e1a5a466f00264ef0f49540c`.

# Audio engine

The native signal path explains how mixing profiles and voice capacity affect the output. Use this reference when choosing those settings or investigating device behavior; it is optional for basic playback.

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
- [Engine statistics](#engine-statistics)
- [Sustained voices](#sustained-voices)
- [Native transport and processing](#native-transport-and-processing)
- [Unified transport acceptance boundaries](#unified-transport-acceptance-boundaries)

<!-- TOC-END -->

## Signal path

```text
playTone / playChord / noteOn     playSequence / updateSequence
       strict commands          atomic preallocated score banks
               \                 /
                shared 32-voice renderer
       source/FM -> quantizer -> filters -> envelope -> event gain
                  stereo pan OR binaural FIR
                             |
            per-voice category selection / explicit send
                   /                         \
        selected share                    dry share
 input gain -> chorus -> delay -> reverb   input gain
        master -> optional saturation       master
                   \                         /
                     stereo recombination
                  one final lookahead limiter
                      floating-point output
```

The audio callback does not allocate memory or wait on a lock. JavaScript publishes control commands and immutable score banks; the real-time thread schedules and renders the samples.

## Oscillators

The engine has six sources:

| Waveform    | Source behavior                                                 |
| ----------- | --------------------------------------------------------------- |
| `SINE`      | Direct sinusoid.                                                |
| `SQUARE`    | PolyBLEP band-limited discontinuity.                            |
| `SAWTOOTH`  | PolyBLEP band-limited discontinuity.                            |
| `TRIANGLE`  | Continuous triangle oscillator.                                 |
| `NOISE`     | White or variable-rate sample-and-hold pseudo-random generator. |
| `WAVETABLE` | Caller-supplied 2 to 64-sample stepped cycle.                   |

Pitch can move linearly from `frequency` to `frequencyEnd`. A sine LFO adds `lfoDepth * sin(lfoPhase)` in hertz before the oscillator advances. This makes vibrato depth absolute in hertz rather than cents.

Noise rate advances an independent phase accumulator. A zero `noiseRate` uses one new pseudo-random value per output sample; a positive rate holds that value until the accumulator crosses the next update. `noiseRateEnd` changes the increment linearly over the event.

The source is optionally quantized to the selected `bitDepth` (2 to 16 bits) and then passes through a one-pole low-pass filter when `lowPassHz` is nonzero. Square waves use `pulseWidth` for the second PolyBLEP discontinuity and can interpolate that duty cycle toward `pulseWidthEnd`.

### Frequency modulation

A `SINE` voice with a positive `fmDepth`, or with `fmDepthEnd`, is phase modulated: the carrier computes `sin(2 * pi * phase + depth * sin(2 * pi * modPhase))`. The modulator phase advances by the carrier's instantaneous phase increment times `fmRatio`, so pitch sweeps and vibrato keep the ratio. The index moves linearly from `fmDepth` to `fmDepthEnd` over the event. With a depth of exactly 0 and no end, the voice takes the plain sine path.

The modulated sine has constant amplitude, so event gain is unchanged. Nothing band-limits the sidebands, so a high carrier with a large index aliases.

### State-variable filter

`filterType` selects a topology-preserving state-variable filter that runs after the one-pole `lowPassHz` stage. It stays stable as its coefficients change, including during a cutoff sweep at high Q.

| Output     | Response                                         |
| ---------- | ------------------------------------------------ |
| `lowpass`  | 12 dB per octave, peak of about Q at the cutoff. |
| `highpass` | 12 dB per octave, peak of about Q at the cutoff. |
| `bandpass` | Unity gain at the center for every Q.            |

The cutoff is held between 20 Hz and `sampleRate * 0.45`. With `filterHzEnd` the cutoff follows `from * (to / from) ^ t`, where `t` runs from 0 to 1 across the event, and coefficients are recomputed every eighth sample. Without a sweep they are computed once, when the note starts.

## Envelope

Each voice has a smoothstep attack, an optional smoothstep decay to `sustain`, a hold at that level and a smoothstep release. `duration` includes the whole envelope. Defaults are adjusted to fit a short event, while an explicit envelope that cannot fit is rejected by the contract.

```text
base = attack ramp, then decay ramp from 1 to sustain, then sustain
level = base * release ramp
```

The release ramp multiplies the base level, so a release that begins during the decay is continuous. With `decay: 0` and `sustain: 1` the base is 1 after the attack and the result is the plain attack, hold and release shape. Voice-steal tails read the final level, so they stay continuous with the decay too.

When a slot is reused, the old voice contributes a short tail of roughly 6 ms while the new event begins, avoiding a cut at an arbitrary sample. `stopAll()` uses a release of roughly 20 ms to avoid the same discontinuity.

## Event gain

In protected profiles, gain is fixed when an event starts:

```text
voiceGain = waveformGain(waveType) * profileFactor / sqrt(eventVoiceCount)
```

One tone and one independently held note have an event voice count of 1. Chords, including sequence chords, use their initial pitch count for fixed event compensation. Adding or releasing other voices never rescales an existing event.

Waveforms are calibrated toward a common source RMS:

| Waveform                                | Base gain | Approximate output RMS |
| --------------------------------------- | --------: | ---------------------: |
| Sine                                    |     0.440 |                  0.311 |
| Square                                  |     0.311 |                  0.311 |
| Sawtooth, triangle, noise and wavetable |     0.539 |       signal-dependent |

This calculation is why one three-note `playChord` and three `playTone` calls are not equivalent. A protected sine triad assigns about 0.254 to each chord voice (`0.440 / sqrt(3)`). Three separate tone events each receive 0.440, for a much hotter worst-case sum.

## Mixing profiles

The profile is fixed when `start()` opens the stream.

| Profile        |              Factor | Sine gain | Limiter ceiling | Intended use                                |
| -------------- | ------------------: | --------: | --------------: | ------------------------------------------- |
| `conservative` |                   1 |     0.440 |            0.85 | Default headroom for polyphony and effects. |
| `balanced`     |           `sqrt(2)` |     0.622 |            0.85 | Mostly one or two simultaneous voices.      |
| `speakerSafe`  |       `1 / sqrt(2)` |     0.311 |            0.70 | Small speakers and demanding low pitches.   |
| `raw`          | no source reduction |     1.000 |            0.85 | App-controlled gain staging.                |

`raw` lets one full-volume oscillator reach full scale before the master. Any overlap then relies on the limiter, so it is not a general-purpose loudness setting.

## Limiter

A single stereo-linked peak limiter sits after master volume and optional creative saturation. Linking preserves the stereo image when only one channel has the largest peak.

| Parameter | Value                            |
| --------- | -------------------------------- |
| Lookahead | 10 ms                            |
| Release   | 100 ms, exponential              |
| Ceiling   | 0.85, or 0.70 with `speakerSafe` |

Lookahead gives the gain time to reach a safe value before the peak reaches the output. Below the ceiling, the limiter converges back to unity. It catches exceptional sums without normalizing every callback.

Overlapping events can trigger audible limiting when their sum exceeds the ceiling. Check the accumulated reduction measurement before attributing a volume dip to this protection: repeated same-pitch oscillators can also cancel one another even below the ceiling. Compatible public sustained-note repetitions preserve the phase of a releasing predecessor while retaining separate envelopes and tails. Timed calls, transport notes and simultaneous held unisons keep their existing phase policy.

## Master volume and pan

`setVolume()` ramps the master to avoid a discontinuous gain step. Per-event `volume` is multiplied before the bus. Values up to 2 are valid, but values above 1 use headroom and make limiting more likely.

Pan uses equal-power coefficients. A centered sound feeds both channels; the sum does not simply double. `panEnd` interpolates the position across a tone or sequence note. Chords use `panSpread` or the explicit `pans` array.

## Voice pool

`maxVoices` reserves between 1 and 32 active voice slots. The setting controls capacity and leaves event gain unchanged. Replacement first considers the lowest eligible priority (0-3); higher-priority voices are protected. Among that priority, timed-only replacement selects least remaining duration; sustained/transport replacement prefers releasing voices, then oldest attack. A reused slot receives a short fade tail; no category owns reserved slots.

A chord is an atomic group of up to 32 pitches. If capacity or priority cannot accommodate every pitch, the entire group is dropped. When any held/transport voice is active, that policy also applies to incoming timed tones/chords. For normal apps, choose the largest real overlap plus room for release tails.

## Command queue

Both ports use a 128-slot single-consumer ring buffer. Producers are serialized with a lock that the audio callback never touches. When note commands cannot be queued, the public call returns `false` and logs an `overflow` warning.

`playChord()` publishes its note data and advances the queue index once. The consumer receives the complete event or nothing. `stopAll` and `shutdown` have a control fallback so cleanup is not lost under queue pressure.

`playSequence` runs inside the sample-clock callback; JavaScript publishes entire configurations rather than individual notes. Scheduled releases execute independently of public command-queue capacity. `sequenceend` records are delivered outside the callback and retain their sequence identifier when slots are reused.

## Shared DSP core

The envelope, the state-variable filter, the sweep helpers, the FM sine and the cents conversion live once, in `shared/synth_core.h`. It is plain C, header-only and allocation-free. The Android renderer includes it from `android/jni/SynthOboeEngine.cpp` and the iOS renderer from `ios/Classes/TiSynthengineModule.m`, so both platforms run the same code. Backend voice integration, mixing and the limiter remain separate per platform. Held envelopes/ramps, transport, master effects, extra modulation and compatible retrigger support also have shared C cores.

## Android implementation

Android renders in C++ through Oboe. The stream requests floating-point output, low-latency performance and exclusive sharing when the device supports it. If exclusive access is unavailable, Oboe can use shared mode.

The renderer mixes in the data callback and targets a small device buffer. A route or stream error triggers a reopen on the current output. The supported ABIs are `arm64-v8a`, `armeabi-v7a`, `x86` and `x86_64`.

## iOS implementation

iOS renders with `AVAudioEngine` and `AVAudioSourceNode`, using the active session's sample rate. The module configures the audio session as `Playback`, or `Ambient` when `start()` receives `audioSession: 'ambient'`, activates it, and observes route and engine configuration notifications. If a route change stops the graph, the port reapplies the category, reactivates the session and resumes the existing renderer.

The module targets iOS 15 or newer. The module archive contains device, simulator and Mac Catalyst slices.

## Latency

End-to-end latency contains three main pieces:

1. The fixed 10 ms limiter lookahead.
2. The hardware and operating-system output buffer.
3. JavaScript publication and callback-boundary latency for a newly submitted event; accepted sequence steps then follow the sample clock.

Immediate calls are suitable for interface and game feedback. A visual or musical event that must align to a known future time should be scheduled ahead by the app instead of relying on a JavaScript callback at that instant.

## Route behavior

Connecting headphones or changing another output route can interrupt the hardware stream. The ports recover automatically, though the event crossing the transition may be cut short and the operating system may keep the new route muted briefly. Start later sounds normally after the route settles.

## Regression coverage

The repository checks the public contract and both source ports without a device:

```sh
node tests/api_contract_regression.js
node tests/default_profile_regression.js
node tests/documentation_regression.js

cd android
test_dir=$(mktemp -d /tmp/ti-synth-test.XXXXXX)
javac -d "$test_dir" \
  src/ti/synthengine/SynthContract.java \
  test/ti/synthengine/SynthContractRegression.java \
  test/ti/synthengine/SynthSpatialContractRegression.java \
  src/ti/synthengine/SynthDsp.java \
  test/ti/synthengine/SynthDspRegression.java
java -cp "$test_dir" ti.synthengine.SynthContractRegression
java -cp "$test_dir" ti.synthengine.SynthSpatialContractRegression
java -cp "$test_dir" ti.synthengine.SynthDspRegression
```

The DSP suite covers stable RMS from 1 through 32 voices, limiter transparency and recovery, waveform discontinuities, envelope endpoints, master smoothing, voice stealing and representative dense chords. Device tests remain necessary for route changes, startup underruns and speaker acoustics.

Three more checks cover the shared core, the Android engine and the iOS contract.

The shared DSP core builds with any C99 compiler:

```sh
test_dir=$(mktemp -d /tmp/ti-synth-core.XXXXXX)
cc -std=c99 -O2 -Wall -Wextra -o "$test_dir/dsp_core" \
  tests/dsp_core_regression.c -lm
"$test_dir/dsp_core"
```

It checks that the envelope equals the original attack, hold and release shape for every attack and release combination when decay is off, the decay and sustain endpoints and continuity, the response of each filter type (slope, cutoff and the resonance peak), stability of every filter type under a cutoff sweep on noise, FM sidebands against the Bessel function values and the cents conversion.

The Android engine renders on the host. `tests/engine_render_host.cpp` compiles `SynthOboeEngine.cpp` without opening an audio stream and drives the same command and callback path Oboe uses. It needs the Oboe headers, which any Gradle cache that built the module has, and the JDK's `jni.h`, so it is a local check and does not run in CI:

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

It renders decay and sustain levels, filter attenuation, an opening cutoff sweep, FM sidebands and an FM index that decays to nothing, plus voice stealing and `stopAll` with every control active. Built without `-DHAS_EXPRESSIVE` it renders only the original controls and prints one hash per scenario, so the same file can be built against an older copy of the engine and the hashes compared.

The iOS contract replays the cases that the Java contract test writes to `tests/contract_corpus.jsonl`. The Java test fails when that file no longer matches the Java contract; regenerate it from `android/` with `-Dsynth.corpus.out=../tests/contract_corpus.jsonl`. On macOS, run the iOS side from the repository root:

```sh
test_dir=$(mktemp -d /tmp/ti-synth-ios.XXXXXX)
clang -fobjc-arc -Wall -Wextra -framework Foundation \
  tests/contract_corpus_ios.m ios/Classes/TiSynthengineContract.m \
  -o "$test_dir/contract_corpus_ios"
"$test_dir/contract_corpus_ios"
```

The iOS renderer uses the same DSP header. Its output has no host-rendering test, so check it on a device.

## Binaural front-plane renderer

`shared/synth_spatial.h` runs the same allocation-free FIR processor in both native ports, after each voice envelope and before summation/master/limiter. Nine stereo impulse responses from Gardner and Martin's MIT KEMAR measurements form a compact front-plane grid. The complete 128-sample source responses at 44.1 kHz are interpolated across direction and linearly resampled once at voice onset to the output rate. A single front-response energy calibration preserves directional differences. At 48 kHz the convolution uses 140 padded taps per ear. Buffers are reserved with the voice/tail pools; there are no runtime downloads, callback allocations, or additional callback locks.

Spatial voice-steal and stop tails copy the filter history as well as oscillator state. After the source envelope or fade ends, both ports drain the FIR with zero input for `taps - 1` samples before freeing the voice; this preserves even 1 ms events. Ordinary voices bypass the FIR. CPU cost grows with spatial voices, including short replacement tails. Spatial held updates prepare coefficients outside audio, then ramp the FIR over 10 ms while retaining history. The intended output-rate range is 8 to 192 kHz. Interpolated generic HRTFs provide directional cues, but localization varies by listener.

The shared processor check is `cc -std=c99 -O2 -Wall -Wextra -Wpedantic tests/spatial_regression.c -lm -o /tmp/spatial_regression` followed by `/tmp/spatial_regression`. `tests/spatial_engine_host.cpp` uses the same compile flags as `engine_render_host.cpp` and verifies native left/right rendering, elevation changes, stealing and stopping. Java spatial validation is checked by `SynthSpatialContractRegression`; the common Java/iOS corpus also covers spatial acceptance and conflicts.

### Reproduce a host CPU comparison

Compile `tests/spatial_benchmark_host.cpp` with the same Oboe/JDK includes and definitions as `engine_render_host.cpp` above, replacing the source filename and choosing an output such as `/tmp/spatial_benchmark`. Supply a whitespace-separated timeline, one event per line, with these 25 columns in order:

```text
timeMs frequency frequencyEnd durationMs attackMs releaseMs decayMs sustain waveType volume noiseRate noiseRateEnd lowPassHz pulseWidth lfoFreq lfoDepth filterTypeIndex filterHz filterHzEnd filterQ fmRatio fmDepth fmDepthEnd pan panEnd
```

The filter indices are 0=none, 1=lowpass, 2=highpass and 3=bandpass. This internal harness bypasses public contract validation, so only feed valid event recipes. In binaural mode every event uses its `pan` column as spatialX and a synthetic moving elevation `0.8 * sin(timeMs / 1000)`; the other pan column is irrelevant to that mode. This tests CPU, not the localization of the original timeline.

```sh
python3 tools/benchmark_spatial.py /tmp/spatial_benchmark /path/to/timeline.txt
```

The script compares stereo and binaural using a warmup and five measured trials, reporting the median by audio processing time. There is no hardware stream or JavaScript bridge. Results include peak level, non-finite/clipped frames, voice replacements and processing time; they do not measure device CPU, latency, underruns, heat or battery.

## Engine statistics

The [statistics API](api.md#getstats) has the same shape on both platforms. `shared/synth_stats.h` owns telemetry math and publication. Voice transitions update render-owned occupancy and maxima, including primary FIR draining and external replacement/stop tails. Whole empty groups can then be skipped without changing the signal. Producers are serialized separately from the renderer; querying queue depth does not include future scheduled pattern steps.

The callback publishes atomic words behind a sequence counter. Readers retry a snapshot if publication overlaps their read; the callback never waits for them. Eight-byte alignment and a compile-time lock-free assertion also cover Android's 32-bit ABIs. Reset/enable requests are consumed at callback boundaries. A new control generation hides stale optional measurements immediately. Shutdown waits for the backend callback to stop before clearing occupancy. Queries allocate result objects on the calling thread. Pattern publication and shutdown share a control monitor; that monitor is never taken by the audio callback.

Diagnostic timing uses a monotonic host clock only while enabled. Stereo peak, RMS and maximum limiter reduction accumulate over approximately 200 ms of final float output; logarithms are calculated at window boundaries. These readings do not diagnose physical distortion, latency, heat, battery use or overall app CPU.

Run portable telemetry and Java API tests with:

```sh
c++ -std=c++17 -O2 -Wall -Wextra -pthread tests/stats_regression.cpp -o /tmp/stats
/tmp/stats
python3 tests/run_stats_java.py
```

`tests/stats_engine_host.cpp` uses the Oboe/JDK host flags shown above. It tests native occupancy, reset while playing, saturated queues, binaural drain, shutdown and exact output equality with diagnostics enabled/disabled. This native integration harness requires local Oboe headers; portable shared tests and the stopped-engine Java API tests also run in CI. iOS builds use the same telemetry core, but host Android renders do not execute the iOS audio callback.

`tests/stats_benchmark_host.cpp` extends the spatial replay harness with silence, one/32 voices, replacement pressure, chords, scheduled note publications and short FIR drains in stereo/binaural. Build it twice with identical `-O3` flags: once against the previous engine using `-DSTATS_BASELINE`, and once against the current engine. Run `python3 tools/benchmark_stats.py BASELINE CURRENT` for one warmup and ten alternating trials/configuration, including current snapshots at 5 Hz. The harness verifies identical output hashes across all modes. The [measured comparison and limitations](stats-performance.md) explain what the host percentages establish and which results still require device tests.

## Sustained voices

`noteOn`, `noteOff` and `updateVoice` use the existing bounded native command queue. Voice storage, smoothing ramps and identity snapshots are preallocated. The callback owns envelopes, oscillator/filter state and replacement decisions; it does not allocate or acquire producer locks. `shared/synth_held.h` supplies the same held ADSR, current-level release and independent 10 ms linear parameter ramps to both renderers. Held attack/decay counters stop advancing after those stages, avoiding sample-counter overflow on long notes.

IDs are app-supplied positive 32-bit integers. Atomic 32-bit identity snapshots and queued attacks let producers validate update source compatibility without reading mutable DSP state. The callback checks compatibility again. A full queue rejects note release with `false`; the caller owns its bounded retry and shutdown policy. See the [sustained contract](api.md#noteonoptions) for immutable configuration and supported updates.

Run `tests/held_core_regression.c` with C11 for shared envelope/ramp/identity checks. `tests/held_engine_host.cpp` uses the same build flags as `engine_render_host.cpp`; it covers long notes, release stages, phase-preserving targets, source capabilities, replacement, stale IDs, queue saturation and 32 mixed-source spatial voices. The Java held contract regression and the shared Java/iOS corpus verify the public option shapes. Host rendering and successful builds do not establish device audio quality or touch responsiveness.


## Native transport and processing

`shared/synth_transport.h` owns up to four independent sequences and one global tempo/beat/millisecond clock; `shared/synth_sequence.h` advances each traversal with compensated sample increments. Beat lengths follow tempo changes; millisecond lengths remain constant. A serialized producer prepares sorted traversal and all pitches before publishing one of three immutable banks. The callback accepts tempo at the block boundary and structure at a step boundary; swing changes at a pair boundary. Transport voices share the sustained pool, retain owner identifiers and absolute note deadlines beyond internal slot reuse and release independently of the public command queue. See the [public transport contract](api.md#native-sequence-transport).

`shared/synth_effects.h` supplies chorus, ping-pong delay, damped Schroeder reverb and optional saturation; `shared/synth_modulation.h` supplies two phase-preserving LFOs. Buffers allocate at engine initialization and free after the audio backend stops. Epoch tags on 16-sample pages invalidate histories during panic without walking delay memory; recovery clears at most one short page on a first write. Effects start disabled and default rendering follows exact bypass. Enabled effects drain on disable, bounded to 30 seconds. No new external DSP dependency is used.

Pre-limiter peak and maximum limiter reduction accumulate natively until reset, so polling cannot miss a brief intervention. The callback tracks linear extrema and converts to decibels once per block. Existing output peak/RMS and reduction windows remain approximately 200 ms. Diagnostics are optional; host measurements do not establish device audio deadlines or listening acceptance.

Portable checks: compile and run `tests/sequence_core_regression.c`, `tests/effects_core_regression.c` and `tests/modulation_core_regression.c` with C11, optimization and libm. The transport test checks ten minutes at five sample rates against calculated event times, plus edits, swing, rests, chords and publication pressure. Effects tests check bypass, tails, panic, automation, memory and stability at 16, 44.1, 48, 96 and 192 kHz. On macOS, `tests/studio_contract_ios.m` validates the new iOS configuration contract without Titanium.

`tools/calibrate_studio.py --studio-root PATH` renders Studio presets through the native Android callback at maximum master gain with new effects and modulation disabled. It measures eight independent notes, coherent unisons and repeated attacks with release overlap across low, middle and high registers, then adjusts only a fixed preset gain. The target is at most -6 dBFS before the limiter and at most 0.1 dB limiter reduction; this does not promise zero reduction for arbitrary 32-voice combinations. The report records each scenario before and after calibration. Listening and device performance remain separate acceptance checks.

Device feedback superseded that headroom target for Studio's initial Cristal preset: its fixed gain is restored to 1 because the calibrated setting made a fresh Android installation barely audible. This adds 10.83 dB without saturation or voice-count normalization. Three coherent factory notes remain below the limiter ceiling at maximum master; eight independent coherent notes can require limiting. The calibration recommendations remain recorded separately from this active preset exception.

The [Studio technical validation report](studio-validation.json) records the calibration and corrected full-chain host benchmark, including failed deadline acceptance and pending device checks. Its host performance result must not be presented as hardware realtime acceptance.

## Unified transport acceptance boundaries

The current beta contract uses one renderer, at most 32 voices and capacity for 1-4 sequences. `bus` categories and per-voice sends share one effects chain. No physical-device ten-minute maximum-load acceptance is claimed by these API changes. Host timing, bypass comparisons, memory accounting, actual Android/iOS builds and the remaining device/listening checks are separate evidence. Historical Studio benchmarks below predate these changes and remain historical observations. At 192 kHz, the revised effects buffers use approximately 13.1 MiB; the maximum sequence pool uses approximately 8.23 MiB before renderer voices/queues. Total native accounting must include those remaining structures and recovery peaks; the target is at most 32 MiB additional memory.
