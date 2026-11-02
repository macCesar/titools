# Maintaining the synthesis snapshot

These references cover **published module 1.1.0 with public API 1.1.0**. Older 1.0.2 packages retain API 1.0.0 and lack attack variation and finite-tone repetition. All sixteen official Markdown documents were reviewed; fourteen are mirrored into fifteen parts, with explicit index/notices exclusions. The snapshot anchors committed official sources at `ec04f4e634075c41b55f66279eabcd78b9652d58`: official prose corrections remove a stale local-package label and statistics-method count and document the verified native interval edge. Those documentation corrections are committed and pushed to official main; the already published 1.1.0 ZIPs retain their original documentation. Exact source/mirror hashes are in [source-snapshot.json](source-snapshot.json). Review date: 2026-11-02.

## Public downloads and artifact provenance

Both public 1.1.0 platform releases target `7cd035409453b01df2736aef56f2316d94ca019c`. Their ZIPs were downloaded on 2026-11-02; SHA-256 matches the GitHub asset digests and full ZIP CRC checks pass. Manifests declare module 1.1.0, minimum Titanium 13.2.0.GA, four Android ABIs and Apple Mac Catalyst support. Packaged `index.d.ts` files match the official source and the bundled [declaration asset](../assets/index.d.ts) byte for byte. Native manifest `apiversion` is separate from JavaScript `apiVersion`. No binary was installed on a device during this update.

| Platform | Current public release | Package SHA-256 |
| --- | --- | --- |
| Android | [android-1.1.0](https://github.com/macCesar/TiSynthEngine/releases/tag/android-1.1.0) | `69dea7daaa8b5dd77f7a3d4d6e6ad801e2a0bd48f9e2c79b9caf584dd56e36eb` |
| iOS / Mac Catalyst | [ios-1.1.0](https://github.com/macCesar/TiSynthEngine/releases/tag/ios-1.1.0) | `c426fed49d78926f8dd4e176addaebf0cb0fe4592c5eb48c842aef833ad798b4` |

### Historical 1.0.2 artifact verification

The following replacement packages were downloaded and verified on 2026-10-30 UTC (2026-10-29 locally). Their checks remain historical evidence; they are not the current 1.1.0 downloads.

| Platform | Published release | Replacement package SHA-256 |
| --- | --- | --- |
| Android | [android-1.0.2](https://github.com/macCesar/TiSynthEngine/releases/tag/android-1.0.2) | `8698104f188782a77699fbd6308a779ca0b190833ceebf398557b628af1b8bbe` |
| iOS / Mac Catalyst | [ios-1.0.2](https://github.com/macCesar/TiSynthEngine/releases/tag/ios-1.0.2) | `779e77d018d5b3f686d69cb1b4b0162281803ea12691487df565c1fd15175c58` |

Both ZIPs passed full CRC checks and matched the GitHub asset SHA-256 digests at that verification. These hashes replace the original 1.0.2 packages' hashes; filenames and
release URLs did not change. Manifests report module `ti.synthengine`, version
`1.0.2`, minimum Titanium `13.2.0.GA`, four Android ABIs and Apple Mac Catalyst
support. The manifest's native `apiversion` field is distinct from the JavaScript
1.0.2 contract's `apiVersion: '1.0.0'`.

All eight Android native libraries (inside the AAR) and three Apple static
libraries match the preserved original 1.0.2 release packages byte for byte.
Corrected guide, example and platform README HTML was inspected in both new
packages. Source/package checks do not constitute a fresh device installation or
listening acceptance. See the [guide](guide.md) for API35/iOS15 requirements,
app-root ZIP installation and both `tiapp.xml` declarations.

## Sources and permitted transformations

Fourteen official Markdown documents are mirrored into fifteen parts, including the ordered examples/advanced-examples split. New references preserve the complete [instruments/effects guide](instruments-and-effects.md), [implemented variation contract](native-variation.md), [historical proposal](native-variation-proposal.md) and [variation verification](native-variation-validation.md). The proposal is historical design context, not an outstanding implementation plan. The current snapshot inventories all
complete JSON reports, bundled example assets and linked raw-evidence archives.
The historical [performance review](performance-review.json) and its raw archive are
preserved alongside historical reports; none is replaced by a favorable summary.
Read snapshot records for exact counts and hashes. Example JavaScript and raw
reports/archives remain byte-identical to source.

Each Markdown part and the example README have a committed-source provenance header and recorded navigation transformations. Verified API, timing, spatial, panic, processing and diagnostic corrections were applied to the official module documentation before synchronization. They are shared source content, not mirror-only errata. Remaining `link_fixes` record navigation and curated entry points; the source hash identifies the exact reviewed official text, including the committed prose corrections. Reversible `link_fixes` rebase links into the split advanced examples, preserve [curated recipes](recipes.md), and resolve current example links to bundled assets. The example README points back to this skill's current API and guides. All three example JavaScript files remain byte-identical to source; none requires a historical GitHub snapshot.

The fidelity regression strips provenance/navigation, concatenates example parts, reverses declared transformations and compares the complete source hash. Raw records must remain byte-identical. Update transformations intentionally; never change hashes merely to hide unexplained source drift.

## Protected curated content

[Retro recipes](recipes.md) and [interaction/instrument recipes](recipes-interaction.md) are TiTools contributions. Preserve their acoustic intent, lifecycle ownership and entry links when upstream docs change. Their native sequence examples keep the original millisecond onsets and total envelopes through separate `duration` and `length`; no JavaScript timer schedules notes. The repeated chord is now one centered native chord sequence; the separate one-off layered chord retains its per-voice stereo pans.

Focused executable recipe tests inspect submitted intervals, envelope lengths, pitch and cancellation IDs. They do not render audio or measure native callback timing.

## Current contract and acceptance boundaries

`start` configures one engine, up to 32 shared voices and one to four preallocated sequence slots. `playSequence` schedules scores and returns a positive sequence ID or zero. `repeatTone` preserves the complete finite renderer for one repeating recipe and returns a positive tone ID or zero; its 32 slots are independent of the sequence slots, while admitted attacks share the voice pool. Sequence edits, state queries and cancellation name that ID. Global `setTempo` governs beat timing and synchronized modulation; millisecond sequences retain fixed times. Finite playback is the default, and circular patterns explicitly opt into looping.

Selective `music`, `effects`, `ui` and `ambience` categories feed one shared effect chain; an explicit per-voice send overrides category selection. Live spatial position, noise clock, low-pass cutoff and compatible continuous voice controls ramp over 10 ms while preserving history. Priorities protect higher-priority voices without reserved quotas. See the [API](api.md) for exact limits, source compatibility, return values and event delivery.

### Module 1.0.1 and 1.0.2 corrections

Michael Gangolf's [Android PR #1](https://github.com/macCesar/TiSynthEngine/pull/1)
updates Oboe to 1.11.0, recovers closed streams after all stream errors, keeps a
single demand-driven sequence-event poll chain and shuts down on root activity
destruction. Removing the unused Java Thread inheritance changes no public API.
The subsequent Apple correction polls only while sequence events or held-voice
metadata need retirement and guards shutdown/restart reentry. Neither poller is
a musical scheduler; explicit engine ownership/teardown remains required.

Module 1.0.2 shares final output processing in `shared/synth_output.h`: zero
retained samples, immediate stereo-linked sample protection, ceilings 0.85/0.70,
100 ms exponential recovery and reset after two consecutive quiet stereo frames.
Master volume ramps linearly over 10 ms on both platforms, independently of the
protector. The iOS `raw` startup correction now applies its documented gain;
existing raw mixes need review. Overload changes the waveform, and sample
ceilings do not certify inter-sample peaks or speaker behavior.

[Pipeline validation](audio-pipeline-validation.md) preserves the new production
callback/CI checks, five-rate output comparisons and physical scope. Preset
calibration measures both renderers and six scenarios at 1/2/4/8/16/32 voices;
fixed-gain recommendations target the measured 1–8-voice configuration, with
16/32 kept as stress diagnostics. It never edits Studio. The Android startup
underrun remains unresolved, including independent silent Oboe reproduction.
Route-wide latency, Bluetooth and extended maximum-load acceptance remain open.

Official documentation corrections preserve panic cancellation (`stopAll` stops every
sequence and invalidates effect histories), compatible live `updateVoice`
noise/low-pass/spatial/send edits, and category selection with `applyTo` plus
explicit `effectSend` overrides. The matching mirror-only errata were removed from the transformation list; curated recipe navigation remains reversible.
Android and Apple production callback tests now run in CI; the historical Java
DSP model is not the production audio oracle. No native binaries were installed
or device/listening tests rerun during this skill update.

### Historical evidence

The [performance review](performance-review.json) documents the accepted
control-thread changes: partial sequence-bank preparation and removal of idle
allocations/orphan held-position metadata. The Apple rendering bundle was
rejected after a physical stereo regression, and production returned to the
stable callback. Earlier candidate timings and fidelity checks remain evidence
of that rejected candidate, not a promised Apple render speedup. Current matched
Apple bypass measurements and actual hardware/rate/block-size scope are in the
report; global performance acceptance remains open.

Historical statistics, Studio/unified transport, physical/Frontier measurements
and Android FIR8 correction reports keep their original artifact and acceptance
boundaries. The short Android Sim80 headphone result had zero backend xruns and
accepted listening; it does not close the distinct ten-minute maximum-load,
bypass, memory and strict Frontier presentation criteria. Current evidence and
rejected candidates must not be combined into a general pass. This skill update
did not rerun devices, install binaries or alter native source.

The native differences below were rechecked against current sources on November 2 and are now documented accurately in the official API/engine guides as well as the mirrors. They describe implementation differences, not unresolved documentation contradictions:

- iOS timed tone/chord command construction initially rounds accepted zero attack
  and release to one sample before duration-budget trimming; Android preserves zero. Validator
  acceptance does not establish identical sample envelopes.
- iOS early tempo/sequence/processing rejections and incompatible held spatial/
  modulation edits can bypass rejection counters. Android also leaves some
  unknown/retired sequence-stop returns uncounted. The recorded reason sum is
  consistent with recorded totals, not a complete API-call rejection tally.
- Sequence cutoff coefficients currently refresh every 16 samples on Android
  and every 8 samples on Apple; both use note length but do not promise identical
  sample output. See [engine details](audio-engine.md).
- Published 1.1.0 returns `capabilities.variation: true` and `variationSchemaVersion: 1` on both platforms. Android also reports native sequence/master processing/modulation flags and `limits.stepDurationMs`; iOS omits those additional entries. Published 1.0.2 does not accept variation. Both platforms return sequence-capacity, priority and send limits; use the [API](api.md) for exact beat/millisecond ranges.
- Official examples now bind their waveform constants and document native sequence modulation, complete effect fidelity and publication ownership correctly. The mirrors preserve the same facts.


These are official-documentation and skill corrections, not native implementation fixes. No module code, public range or hardware acceptance was changed.
A validator corpus establishes accepted/rejected dictionaries, not sample-identical
rendering on a physical device. Current source-first coverage ledgers and native locators are recorded in the maintainer's November 2 audit evidence.

## Published 1.1.0 attack variation

Both platforms validate eight bounded parameter ranges and select once per admitted attack. Require the capability/schema pair and omit the property entirely on published 1.0.2, including amount zero. The [variation guide](native-variation.md) preserves exact bounds, linear amount, pitch ratio, source prerequisites, per-chord ordinals, held stability, whole-dictionary step replacement, revision merging and deterministic seed identity. `updateNote` and its deprecated `updateVoice` alias reject the attack dictionary. Preserve all of the authored envelope, cadence, routing and layer gains.

The [verification report](native-variation-validation.md) separates initial host/build checks from later consumer installations and scoped listening feedback. It records the 144-byte configuration and four-transport growth from 8,627,712 to 9,537,152 bytes, excluding other engine/bridge/process storage. Earlier 1.0.2 memory reports remain historical. Host callback timings do not prove device overhead or sustained acceptance.

The earlier variation audit reran the paired production validators (156 cases per platform). This repetition update ran the focused shared scheduler, Android production renderer, Java bridge, Apple exact-render host and Android tone contract checks, plus official documentation/example and TiTools mirror/recipe checks. New source inspection verified sampling/admission and sequence seed identity. Historical renderer PCM, native build, consumer install and listening results were read with their original boundaries; they were not repeated or expanded into general device acceptance. No native source or binary was changed.

All thirteen raw JSON/ZIP records moved upstream from `documentation/` to `docs/validation/` without changing bytes. Their distributed skill paths are preserved; the snapshot now records their actual upstream locations. All five ZIPs passed CRC checks. The three example JavaScript assets remain byte-identical; `app.js` now includes the capability-gated attack-variation action.

## Finite-tone repetition and compatibility

Read the complete [API](api.md#finite-tone-repetition), [effect fidelity guide](instruments-and-effects.md) and [repetition verification](native-tone-repetition-validation.md). Require `capabilities.toneRepetition === true` and the three repetition methods before enabling controls. `playTone` remains Boolean standalone playback and rejects `intervalMs`; independent event-driven calls and deliberate finite JavaScript bursts are supported, with application-owned timer cleanup. Native repetition provides a sample-clock cadence independent of tempo.

`repeatTone` requires integer `intervalMs` 1–60,000. `updateTone` validates partial changes merged with the latest accepted recipe, keeps the next deadline and applies the new interval after that attack. Active voices retain their admitted recipe. `stopTone` cancels future attacks at the next render block, even under ordinary queue saturation, and lets admitted finite voices finish. There is no `toneend`; IDs are never reused over shutdown/start. Global stop and shutdown invalidate repetitions. A positive ID does not guarantee every future attack is admitted; reserve for overlapping finite lifetimes and other sounds.

Each repetition retains its own admitted-attack variation stream. A replacement variation dictionary replaces the whole prior dictionary; amount zero disables future variation, seed changes restart the stream, and rejected attacks do not consume a selection. The new report separately records 617,744 Android and 620,048 Apple transport bytes and scoped host measurements; earlier sequence/variation storage and device evidence do not measure repetition overhead.

Use `updateNote` for current held-voice edits and `enableStats`/`disableStats` for current diagnostics. `updateVoice` and `setStatsEnabled` remain deprecated compatibility aliases, without scheduled removal or repeated runtime warnings. Older 1.0.2 binaries need method detection and their original aliases; never send new closed-dictionary fields speculatively.

### Known native interval edge

The documented interval contract requires an integer. Android rejects `intervalMs: 1.0000000001`; the reviewed Apple validator accepts it within its 1e-9 integer tolerance and command conversion truncates it to 1. This was independently reproduced against the production validators. Always submit exact integer milliseconds; do not rely on Apple's acceptance. This native edge remains unresolved: no native source or published binary was changed by the skill update. It is separate from the existing platform zero-envelope and diagnostic differences above.

The declaration asset is a byte-identical official aid, not a runtime validator: TypeScript `number` cannot prove finite/integer/range constraints or native state/capacity. Its original candidate comment is preserved as source text, while current release provenance is recorded above. Preserve historical API 1.0.0 wording inside dated variation reports/proposals rather than relabeling their evidence as current acceptance.

## Upstream documents outside the mirror set

The official index is replaced by this skill's task routing. Dependency/license notices remain in the official module and binary packages. Both are recorded with hashes and reasons in `excluded_documents`, so changed or newly added documents still require review.

## Verification after a reviewed update

Run the focused mirror/link and recipe tests, then:

```sh
node scripts/verify-module-snapshot.mjs --source /path/to/TiSynthEngine --skill ti-synthengine
```

The verifier checks source/mirror hashes, exclusions, new documents, base HEAD and the exact tracked/untracked worktree fingerprint. Refresh that fingerprint only after the source changes are finished. No npm version, publication or native-device acceptance follows from this procedure.
