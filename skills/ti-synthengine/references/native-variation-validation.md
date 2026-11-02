> Source snapshot: official TiSynthEngine documentation at commit `b07c97c762be5905f132cecf33e9d60ea0c21316` (2026-11-02). Published 1.0.2; local 1.1.0 candidates; public API 1.0.0. Upstream `documentation/native-variation-validation.md` SHA-256: `df18826824984cb440d7412b547663ba6b8a7152bc347508114d7af982c90e68`.

# Native variation: technical verification

Initial host and build verification on November 1, 2026, against Engine base `5a328ad`. Native sources build local 1.1.0 Android/iOS candidates; public API remains 1.0.0. The measurements below describe that technical stage. Later consumer installation and listening observations are recorded separately in the [follow-up](#consumer-installation-and-listening-follow-up); they do not turn the host measurements into physical-device benchmarks. No 1.1.0 release is announced by this report.

## Contract and rendering

- Shared C helper: a known SplitMix64 vector, independent attack/ordinal/field coordinates, bounded sampling, repeatability, no mutation of authored configuration, amount-zero bypass and schema-slot independence.
- The paired corpus plus nonfinite probes exercises 156 cases on each production validator: tones, chords, held starts, sequence voices/overrides, source restrictions, malformed/inverted ranges, booleans, seeds including zero/uint32 maximum, amount endpoints, tuning/detune/chord/sweep pitch corners and zero-depth FM starts. `updateVoice` rejects variation.
- Actual Android renderer and extracted actual Apple callback hosts cover deterministic parameters, held stability, independent chord ordinals, loop attacks, rests, rejected admission, revision continuity and changed seeds. A focused shared regression reproduced the structural-edit counter reset before its fix, then verified inherited-rest insertion, explicit root-seed change, appended explicit step seed zero and reordered declarations.
- Absent/amount-zero PCM matches within the new renderer across six waveforms, four mixing profiles, held/chord/sequence paths and release. Noise initialization is controlled by existing host fixtures; production noise generation is unchanged.
- Android's pre-feature and candidate `engine_render` fixture output, including its PCM hashes, matches exactly.
- Apple pre-feature versus candidate PCM is byte-identical across the original 120 lifecycle/effects/transport scenarios: 29,692,526 bytes. The comparator's `--pcm-only` mode excludes internal structure snapshots because prepared sequence layouts intentionally changed.
- An additional Apple compatibility driver compares the pre-feature renderer against both candidate absent and amount-zero modes across six waveforms, four profiles and four paths (timed, held, chord, native sequence), including overlap/release: 2,359,296 bytes match exactly in each comparison.
- Existing native renderer, sequence-publication, retrigger, bypass, startup, contract and canonical-state memory checks accompany the focused variation cases. Existing tests with handcrafted packets now use the new internal header/step widths; the public score format is unchanged.

Commands: `python3 tests/run_variation_contracts.py`, the two `variation_*_regression.c` executables, `python3 tests/run_native_hosts.py variation_engine`, and `python3 tools/build_ios_render_host.py --output /tmp/variation-ios --driver tests/variation_render_ios.m`. The compatibility driver is `tests/variation_compatibility_ios.m`, built once against the Git base extracted to an external temporary directory and once against the candidate. No checkout/HEAD changes are needed.

## Storage and callback work

64-bit macOS layouts:

| Structure              | Base bytes | Candidate bytes |
| ---------------------- | ---------: | --------------: |
| Sequence voice         |        824 |             968 |
| Sequence step          |      1,400 |           1,544 |
| Prepared configuration |    718,920 |         794,704 |
| Triple-bank transport  |  2,156,928 |       2,384,288 |
| Four transports        |  8,627,712 |       9,537,152 |

The four-bank-owner total grows by 909,440 bytes, including prepared explicit-seed identities. This excludes renderer voices/tails, command queues, effect rings, bridge arrays and canonical Java/Objective-C options. A variation configuration itself is 144 bytes. No dictionary or variable-size object reaches the callback. Explicit step seed declarations are sorted during preparation; application compares prepared root identity and seed declarations without sorting or allocation.

The callback measurements below run four native transports at 48 kHz, 256 frames/block, 1,000 warmup and 1,000 measured blocks. Voice counts are distributed over the four transports; unused transports contain rests. Full-amount three-field variation is selected per admitted attack. Measurements are thread CPU time divided by rendered block budget, on the macOS hosts, without opening audio hardware.

| Target voices | Android variation off | Android variation on | Apple variation off | Apple variation on |
| ------------- | --------------------: | -------------------: | ------------------: | -----------------: |
| 1             |                 0.49% |                0.41% |               0.48% |              0.50% |
| 8             |                 1.43% |                1.41% |               1.85% |              1.78% |
| 16            |                 3.01% |                2.59% |               3.07% |              3.08% |
| 32            |                 6.48% |                4.80% |               5.53% |              6.04% |

Run-to-run/cache/scheduling variation is visible; these single samples do not estimate a causal speedup or physical overhead bound. Other app builds were running during parts of this session. Wall time is retained in the external logs, separately from thread CPU time. At 32 voices, enabled mean CPU work is approximately 0.256 ms/Android callback and 0.322 ms/Apple callback on this host, with a 5.333 ms block budget.

A 512-step publication check (100 edits, 32 pitches/step) measured Android JNI/native producer CPU p95 0.335 ms and Apple Foundation producer CPU p95 10.609 ms. These execute outside the audio callback and exclude Android Java preparation. The canonical Java memory regression verifies detached input, immutable reuse, rejected-edit isolation and release of accepted bridge packets. None of these results represents phone memory pressure, thermal stability, underruns or latency.

## Packages and consumer acceptance

Both module builds passed with `ti build -p android/ios --build-only`. Native-build archive SHA-256 before the final documentation-only refresh (the external packaging proof records the refreshed archives and proves native binary members unchanged):

- Android: `4fc5cb31ecb16a0d3d8acc9599f87f71e322778f92073fa0042e49b24fcfbacb`.
- iOS: `71b28d2473a7b56d7e966addad636037b985c1eb5bffa9f8a2e0737efe3ce2b7`.

Consumer source tests, installed candidate-file parity and platform build evidence are recorded in each app's validation/session notes. The official 1.0.2 directories/archives are retained. Capability-gated fallback and authored range gains are tested independently from listening. Studio's personal presets, A/B, disabled/zero paths, layer ownership and pattern restoration have their own tests; module validation does not replace those checks.

Technical hosts establish parameter/transport/rendering behavior within their stated scope. Physical real-time acceptance and comparative listening at low/mid/full amount remain separate and require free authorized devices.


## Consumer installation and listening follow-up

The current Studio, Frontier and Guardian builds using module 1.1.0 were installed over the existing apps on the OPPO CPH2639 and physical iPad (9th generation), preserving app data. Signed physical iOS builds succeeded with the projects' selected SDKs; these device builds do not require the missing simulator runtime.

César reported that Studio's variations and control edits sound good, and specifically accepted Frontier's Órbita Neón / Roca Frágil variation. The device and output route were not specified in that feedback. This records those observations without extending them to all effects, both platforms or sustained maximum-load performance.
