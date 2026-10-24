> Source snapshot: official TiSynthEngine 1.0.0 documentation at release source commit `e7cbbe8a6f9ab38088fd8029c7b43cef6501101f` (2026-10-24). Upstream `documentation/stats-performance.md` SHA-256: `3d6d35b9e0e49a778777d406418eaba04ebd57da871a322da28fae0190c5cb17`.

# Statistics host comparison

## Unified transport validation

The unified transport, selective processing and continuous voice controls are implemented in 1.0.0. The following evidence was collected during pre-release development. Both native modules were rebuilt with Titanium SDK 13.4.1.GA. Fresh Android libraries for four ABIs and the three Apple XCFramework libraries were compared with the packaged binaries. The eight consumer applications and the module example use the final API; consumer application builds and physical playback are checked separately below.

[Unified validation evidence](unified-validation.json) records native binary hashes, contract and regression results, the five-rate ten-minute simulated transport clock test, consumer checks and remaining acceptance work. Nine reference renders and thirty rate/wave cases match the archived renderer sample for sample with the new functions inactive. The effects history optimization also preserves its five-rate render hashes.

[Unified bypass measurements](unified-bypass-performance.json) retain the complete matched trials against `937e774`, with four sequence slots preallocated in the current engine. Initial stereo regressions prompted changes to inactive voice scans, send ramps, constant controls and compiler inlining. These are measurements of the Android callback on macOS, not iOS callback or physical output results.

The original short-process one-voice stereo trial exceeded the total-time screen (+12.01%); a twenty-pair repeat also exceeded it (+7.64%), with two distinct latency groups. A diagnostic then ran one hundred benchmark calls in each process, discarded its first ten calls, and compared ten alternating baseline/current process pairs. Its median change was -0.17% total and -0.01% p95. The other three matched configurations stay within the screening thresholds. All original and diagnostic trials remain in the report. This supports an influence from process startup/core residency; it neither identifies a specific CPU core nor establishes a precise device overhead bound.

A later source-frozen recheck includes the physical-phase constant-control and exact Android FIR optimizations. Three configurations remain within the screening limits. One-voice stereo still exceeds the total-time screen after the same warmed ten-pair protocol (+3.49% total, +1.73% p95). A focused layout comparison restored the previous voice offsets but improved total time by less than 0.5%, so that candidate was rejected. This latest-source host screen remains open. The [complete recheck and layout trials](bypass-physical-recheck-evidence.zip) and summary in the JSON report preserve this result separately from the earlier source.

The maximum-load host run covers thirty simulated seconds at 48 kHz with 256-frame blocks, 32 voices, four sequences, binaural output, two LFOs per voice and all effects. Render p95 was 32.13% of the block deadline; one block exceeded its deadline. This run does not satisfy the ten-minute, zero-miss physical acceptance criterion. Counted native buffers at 192 kHz occupy 24,649,584 bytes (23.51 MiB); this native accounting excludes managed allocations, drivers and complete recovery/process peaks. Physical measurements are reported separately below.

Reproduce the matched bypass build with `python3 tools/benchmark_unified.py --build-only`, then run `python3 tools/benchmark_unified.py --run-only` while other CPU work is idle. The tool archives each renderer with its own headers and records source/binary hashes. `tests/unified_load_host.cpp` uses the host include/compiler setup in [engine test instructions](audio-engine.md#regression-coverage); compile with `-O3` and supply the simulated duration in seconds when running it. These tools never open a hardware stream.

After both real native builds, refresh the ZIP documentation and examples with `python3 tools/package_documentation.py --sdk-path "<Titanium SDK directory>"`. Use `--check-only` to validate temporary candidates first. The tool verifies archive CRC, documentation links/anchors, reports and examples, and proves that all native binary members retain their hashes. It does not compile native code.

## Physical validation in progress

[Physical validation evidence](physical-validation.json) records the device protocol, measurements and remaining acceptance work. The isolated diagnostic uses separate app identifiers and preserves the applications' saved data. Its callback histogram and memory queries exist only in temporary instrumented module copies; they are excluded from production packages. Reproduction tools are in `tools/device-validation/`.

The ninth-generation iPad rendered 600.027 seconds at its actual 44.1 kHz rate, with 1,024-frame callbacks, 32 binaural voices, four sequences, two LFOs per voice and all shared effects. Across 25,841 measured callbacks, p95 occupied [38.8%, 38.9%) of the deadline, the maximum was 55.45%, and no measured callback exceeded its deadline. iOS hardware underruns remain unavailable; this result does not claim a hardware-underrun count of zero.

The Android CPH2639 rendered at 48 kHz with 256-frame callbacks. Its short feasibility test fails the render criterion, including after exact-output FIR and constant-control optimizations. Paired wall/thread-CPU measurements confirm substantial CPU cost. The controlled ten-minute test has not started; no Android maximum-load pass is claimed.

Memory pressure publishes four 512-step, 32-note scores and repeated complete edits, then exercises recovery. On iPad, a conservative charged-footprint/native-buffer projection at 192 kHz is 33,405,808 bytes, while resident high-water growth is 43,401,216 bytes. These are distinct metrics, and the projection is an estimate from actual 44.1 kHz operation. Android's first whole-process pressure measurement exceeds 32 MiB at its actual 48 kHz rate; the producer-memory correction reduces the observed peak by about 9 to 11 MiB, but the whole-process bound remains unestablished. Neither result certifies whole-process RSS below 32 MiB at physical 192 kHz.

[Frontier physical measurements](frontier-physical-validation.json) cover Arcade and simulations starting with 20 or 80 large asteroids on both devices. The [iPad raw reports](frontier-ipad-evidence.zip) retain actual Metal presentation timestamps; the [Android raw reports](frontier-android-evidence.zip) retain SurfaceFlinger presentations aligned with native realtime/monotonic clocks. Arcade and simulation20 satisfy the predefined equivalent-load coverage and presentation/FPS limits. Strict simulation80 matching reaches 47.5% coverage on iPad and 45% on Android against the required 50%, so those comparisons remain inconclusive. Exploratory matching remains separate from the primary result; no causal audio-driven FPS improvement is claimed.

Android's two simulation80 Audio-on phases reached 32 spatial voices, callback maxima 3.07/3.19 times their deadline and 67/88 backend xruns. A matched simulation20 renderer elapsed-work diagnostic also exceeded its investigation screen: p95-of-window-p95 increased 6.91%. Source and packaged-class inspection show a wall elapsed counter covering updates, Java/GL calls and descheduling, excluding the explicit FPS sleep and direct EGL swap. Available data cannot isolate CPU contention, governor or indirect driver/GPU effects. Stable presentation timing does not approve this separate renderer-work increase.

Cesar initially reported clean manual Sim80 audio on both devices. A later headphone comparison withdrew Android's initial result: many simultaneous explosions sounded saturated on Android, while iPad remained clean. The correction and latest scoped acceptance are recorded below; the original failed measurements remain unchanged.

A private Android diagnostic captured 458,496 stereo float frames after the limiter and replayed those exact samples through a fresh empty engine with the same backend, route and volume. Live Sim80 reported 89 backend xruns and a maximum render load of 2.95 times the deadline; copy-only replay reported zero xruns and a maximum load of 3.69%. Cesar heard saturation live and very little or none during replay. Captured samples were finite, peaked at 0.85 (-1.41 dBFS), and ended with 250 ms of exact silence. This supports a delivery failure under live load. The comparison includes physics and synthesis in the live case, so it does not isolate DSP from game or operating-system contention.

An exact-output attack-preparation candidate remains outside production. Its physical comparison changed route and volume between baseline and candidate and included overlapping user/automation actions; it cannot establish a causal improvement. The candidate still reported output xruns. A subsequent actual-Sim80 callback profile attributed about 65% of audio-thread CPU samples to the binaural FIR and only 0.45% of measured callback CPU time to new attacks. Blocks without new attacks also exceeded their deadlines.

The [Android Sim80 correction](android-sim80-correction.json) reuses FIR coefficients across eight consecutive samples of a voice while preserving partial-sum rounding, sequence boundaries, mix order, ramps and tails. Stereo output and other Android ABIs retain their previous render path. In the short headphone diagnostic at 48 kHz/256 frames, with the same 512-frame output buffer and volume120/160, the corrected candidate reached 32 voices/25 tails and reported zero output xruns. CPU p95 occupied [96.5%,97.0%) of the deadline; 80 CPU-timed and 104 wall-timed callbacks still exceeded one block deadline. Output buffering absorbed those overruns in this run. Cesar then accepted live manual Sim80 with headphones as clean, without perceptible distortion. This is acceptance of that short scene, not the ten-minute maximum-load render criterion. The [raw correction reports](android-sim80-correction-evidence.zip) retain the original, intermediate and corrected captures separately. Private PCM/profiling interfaces remain excluded from production packages. Full multiplatform acceptance remains open.

## Historical statistics-only comparison

This is a historical statistics-only comparison, before sustained voices, native sequence transport, master effects and the two additional voice LFOs. It is not a performance measurement of those features. See [current technical validation](studio-validation.json) for newer evidence and its device/deadline limits.

Beta 1.0.0. Synthetic Android native render on Apple M1. Apple clang version 21.0.0 (clang-2100.3.34.2). Baseline commit `95901c98af5353b86d9dc7c60b29ab9186b038cd`. Both renderers use identical `-O3` flags.

One warmup and ten alternating runs per configuration, 48 kHz, 32 slots, 256-frame callbacks, twenty seconds per run. Current modes query native snapshots at 5 Hz. Timing includes command publication and snapshot work; JavaScript/JNI, real scheduler jitter and hardware streams are excluded. macOS user-interactive QoS reduces core-selection variability. Values below are median percentage changes relative to the previous engine.

The flagged sustained 32-voice binaural configuration was repeated in isolation with another warmup and ten alternating trials; its table row uses that repeat. The original trials are retained in the raw investigation.

| Case     | Output   | Basic total | Basic p95 | Full total | Full p95 |
| -------- | -------- | ----------: | --------: | ---------: | -------: |
| silence  | stereo   |     -73.13% |   -72.45% |    -71.89% |  -70.92% |
| oneVoice | stereo   |     -41.29% |   -41.09% |    -39.20% |  -38.70% |
| 32Voices | stereo   |      -5.48% |    -6.61% |     -4.88% |   -4.25% |
| steals   | stereo   |      -7.01% |    -6.01% |     -0.42% |   -1.47% |
| chords   | stereo   |     -17.88% |    -3.59% |    -16.64% |   -3.15% |
| patterns | stereo   |     -40.19% |   -39.07% |    -38.55% |  -36.80% |
| drain    | stereo   |     -69.59% |   -60.42% |    -68.12% |  -59.24% |
| silence  | binaural |     -73.09% |   -72.45% |    -71.75% |  -71.17% |
| oneVoice | binaural |     -16.36% |   -19.86% |    -13.44% |  -17.71% |
| 32Voices | binaural |      -6.09% |   -19.89% |    -10.14% |  -23.25% |
| steals   | binaural |      +0.55% |    -0.26% |     -0.47% |   -6.54% |
| chords   | binaural |      -8.41% |    -6.12% |     -3.69% |   +1.28% |
| patterns | binaural |     -11.76% |    -9.16% |     -9.53% |   -7.40% |
| drain    | binaural |     -45.49% |   -22.73% |    -50.18% |  -21.98% |

All mode/configuration hashes match sample for sample. The direct integration regression also compares float arrays, including a reset during playback. Full mode includes timing, stereo peak/RMS and limiter reduction; basic mode leaves those measurements disabled. Full mode does more work than basic mode. The table compares each final configuration with the previous engine.

Initial repeated silence regressions were about +5% basic and +19% full. Sparse sounds also crossed the investigation thresholds. The correction uses event-maintained occupancy to skip entirely empty voice/tail groups, in both Android and iOS, while retaining all requested meters. No DSP formulas or emitted samples were changed.

The acceptance thresholds are increases above 2% total render time or 5% p95 elapsed block time. No final median exceeds either threshold. The sustained 32-voice binaural full-mode total changed from +5.01% in the original batch to -10.14% in the isolated repeat; this variability prevents treating the percentages as a precise overhead bound. No repeatable regression above the screening limits was established in that case.

These are host measurements of the Android renderer and shared telemetry core. They do not execute the iOS callback, include bridge polling cost, establish physical underrun behavior, or demonstrate unchanged device heat, battery use or total app CPU. Both native modules are compiled separately. Physical stereo/headphone listening and device performance require their own acceptance tests; these results do not establish zero impact on devices.

The patterns case replays timed native note publications; it does not run the Java or dispatch scheduler. The drain case repeatedly renders 1 ms voices plus the complete binaural FIR history. Shutdown/rejection/queue concurrency belongs to regression testing, not these timings.

[Raw trials and investigation](stats-performance.json). Reproduce with `tests/stats_benchmark_host.cpp` and `tools/benchmark_stats.py`; see [engine test instructions](audio-engine.md#engine-statistics).
