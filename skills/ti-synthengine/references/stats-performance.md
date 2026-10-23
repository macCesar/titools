> Source snapshot: official TiSynthEngine 1.0.0 beta documentation from the reviewed working tree based on `6b48af568c4a50685541b4ae2800d38081e6ebb7` (2026-10-22), including uncommitted documentation updates. Upstream `documentation/stats-performance.md` SHA-256: `e259df3fccfa5dc4eb4d397ff76277317bf32f394fb88aecc43f32750bf53467`.

# Statistics host comparison

This is a historical statistics-only comparison, before sustained voices, native sequence transport, master effects and the two additional voice LFOs. It is not a performance measurement of those features. See [current technical validation](https://github.com/macCesar/TiSynthEngine/blob/6b48af568c4a50685541b4ae2800d38081e6ebb7/documentation/studio-validation.json) for newer evidence and its device/deadline limits.

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
