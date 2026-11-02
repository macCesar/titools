> Source snapshot: official TiSynthEngine documentation at commit `ec04f4e634075c41b55f66279eabcd78b9652d58` (2026-11-02). Published module 1.1.0; public API 1.1.0. Upstream `documentation/native-tone-repetition-validation.md` SHA-256: `b29758b5ec3b50650c4e30e8c408cb9bc680cad3fc158e543c3f6eec00c268a1`.

# Native tone repetition validation: November 2, 2026

The local Android/iOS 1.1.0 candidates announce API 1.1.0. `playTone(recipe)` retains Boolean acceptance for one finite attack, including independent successive JavaScript calls. `repeatTone(recipe)` requires `intervalMs` inside that single dictionary and returns a positive tone ID or numeric zero. `updateTone` and `stopTone` manage future attacks; admitted voices finish their original lifetimes. The [API reference](api.md#repeattoneoptions) describes the contract.

## Native checks

The shared fixed-capacity scheduler was tested for fractional sample remainders, variable render blocks, update deadlines, independent stops and slot reuse. A serialized control producer and an audio consumer exercised 2,000 start/stop cycles and 40,000 revisions under ThreadSanitizer without reported races.

Android production-render hosts cover finite attack PCM parity for all six waveforms and four mixing profiles, controlled noise, spatial onset boundaries, tempo independence, 32 simultaneous repetitions beside four sequences, overlap, partial revisions and variation streams. iOS production-render tests cover all six shapes in stereo/spatial routes, fractional 44.1-frame intervals, deadlines, overlap, capacity, queued stops, revision snapshots and aliases. Existing Apple render fixtures cover 120 rate/scenario combinations. The variation contract corpus passes 156 cases per platform.

Focused regressions reproduce and verify corrections for global-stop ordering (a later accepted repetition survives an earlier stop), immutable accepted nested dictionaries/arrays on iOS, and standalone JavaScript attacks remaining unrestricted. Unknown/stopped IDs, invalid intervals, missing required intervals, source validation, queue saturation and the separate note/stat method aliases are covered.

Relevant commands:

```sh
clang -std=c11 -O2 tests/tone_core_regression.c -lm -o /tmp/synth-tone-core
/tmp/synth-tone-core
clang++ -std=c++17 -O1 -g -fsanitize=thread -pthread tests/tone_concurrency_regression.cpp -o /tmp/synth-tone-tsan
/tmp/synth-tone-tsan
python3 tests/run_native_hosts.py tone_engine variation_engine spatial_engine engine_render
python3 tests/run_stats_java.py
python3 tools/build_ios_render_host.py --output /tmp/ios-tones --driver tests/ios_tone_repetition.m
/tmp/ios-tones
python3 tests/run_sequence_events_ios.py
python3 tests/run_variation_contracts.py
node tests/api_contract_regression.js
node tests/documentation_regression.js
node --test tests/example_app_regression.js
```

The runnable example passes ten regressions, including native repetition ownership, edits and teardown. Public linkage checks cover 25 methods. TypeScript declarations pass strict checking and positive/negative contract examples.

## Preallocated memory and host cost

| Platform | Repetition transport storage | Benchmark                                        |
| -------- | ---------------------------: | ------------------------------------------------ |
| Android  |                617,744 bytes | 500 callbacks × 256 frames at 48 kHz; thread CPU |
| iOS      |                620,048 bytes | 1,000 callbacks × 256 frames at 48 kHz; host CPU |

The storage includes 32 slots with three plain-recipe banks each; it is allocated before audio callbacks. The scheduler does not allocate, lock or execute JavaScript in the callback.

| Synthetic workload     | Android callback/deadline | iOS callback/deadline |
| ---------------------- | ------------------------: | --------------------: |
| One stereo repetition  |                    0.571% |                 1.01% |
| 32 stereo repetitions  |                    6.683% |                 3.19% |
| One spatial repetition |                    2.065% |                 1.40% |
| 32 spatial repetitions |                   36.840% |                14.95% |

The host workloads use separate configurations. Their results do not rank platform performance, measure physical-device CPU or guarantee real-time behavior. See `tests/tone_benchmark_host.cpp` and `tests/ios_tone_benchmark.m` for their recipes and measurement methods. Existing sequence/voice/effect storage is additional to the transport figures.

## Packaging and consumer integration

Both native module builds pass. Candidates remain package version 1.1.0. Documentation packaging checks ZIP CRC, examples, declaration source equality, links/anchors and unchanged native bytes during the documentation refresh. Studio receives the rebuilt AAR and all three Apple XCFramework variants; binary hashes are checked against their source ZIPs. Official 1.0.2 packages are retained.

Studio uses native repetition for complete finite-tone plans, including parallel layers, while existing chords, compound scores and sustained motors keep their playback. It reserves overlaps and prior recipe tails after edits. Focused regressions cover cancellation, partial publication failure, variation disable and changed-layer capacity accounting. Native attack timing is covered by render hosts; UI gestures and perceived sound remain separate checks.

Raw logs, binary hashes, installation preference comparisons and host measurements are retained outside distribution packages in `Developer/validation-evidence/TiSynthEngine/native-tone-repetition-2026-11-02`. The records above describe checks completed before publication. Release verification records the source commit and final artifact hashes separately.
