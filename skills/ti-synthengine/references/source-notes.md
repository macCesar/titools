# Maintaining the synthesis snapshot

These references cover **published module 1.0.2 and local 1.1.0 candidates**, both with public API 1.0.0. All fifteen official Markdown documents were reviewed against the native module. Thirteen are mirrored into fourteen parts; the index and notices retain explicit reviewed exclusions. The official documentation corrections are committed at `b07c97c762be5905f132cecf33e9d60ea0c21316`. Complete source/mirror hashes are recorded in [source-snapshot.json](source-snapshot.json). Review date: 2026-11-02.

## Public downloads and artifact provenance

The published replacement packages were downloaded and verified on 2026-10-30 UTC (2026-10-29 locally). The following records are that historical artifact verification, not new downloads during this audit. GitHub release metadata was checked on 2026-11-02: public platform releases remain 1.0.2; local 1.1.0 candidates have no published release.

| Platform | Published release | Replacement package SHA-256 |
| --- | --- | --- |
| Android | [android-1.0.2](https://github.com/macCesar/TiSynthEngine/releases/tag/android-1.0.2) | `8698104f188782a77699fbd6308a779ca0b190833ceebf398557b628af1b8bbe` |
| iOS / Mac Catalyst | [ios-1.0.2](https://github.com/macCesar/TiSynthEngine/releases/tag/ios-1.0.2) | `779e77d018d5b3f686d69cb1b4b0162281803ea12691487df565c1fd15175c58` |

Both ZIPs passed full CRC checks and matched the GitHub asset SHA-256 digests at that verification. These hashes replace the original 1.0.2 packages' hashes; filenames and
release URLs did not change. Manifests report module `ti.synthengine`, version
`1.0.2`, minimum Titanium `13.2.0.GA`, four Android ABIs and Apple Mac Catalyst
support. The manifest's native `apiversion` field is distinct from the JavaScript
contract's `apiVersion: '1.0.0'`, which remains unchanged.

All eight Android native libraries (inside the AAR) and three Apple static
libraries match the preserved original 1.0.2 release packages byte for byte.
Corrected guide, example and platform README HTML was inspected in both new
packages. Source/package checks do not constitute a fresh device installation or
listening acceptance. See the [guide](guide.md) for API35/iOS15 requirements,
app-root ZIP installation and both `tiapp.xml` declarations.

## Sources and permitted transformations

Thirteen official Markdown documents are mirrored into fourteen parts, including the ordered examples/advanced-examples split. New references preserve the complete [instruments/effects guide](instruments-and-effects.md), [implemented variation contract](native-variation.md), [historical proposal](native-variation-proposal.md) and [variation verification](native-variation-validation.md). The proposal is historical design context, not an outstanding implementation plan. The current snapshot inventories all
complete JSON reports, bundled example assets and linked raw-evidence archives.
The historical [performance review](performance-review.json) and its raw archive are
preserved alongside historical reports; none is replaced by a favorable summary.
Read snapshot records for exact counts and hashes. Example JavaScript and raw
reports/archives remain byte-identical to source.

Each Markdown part and the example README have a committed-source provenance header and recorded navigation transformations. Verified API, timing, spatial, panic, processing and diagnostic corrections were applied to the official module documentation before synchronization. They are shared source content, not mirror-only errata. Remaining `link_fixes` record navigation and curated entry points; the source hash identifies the corrected official committed text. Reversible `link_fixes` rebase links into the split advanced examples, preserve [curated recipes](recipes.md), and resolve current example links to bundled assets. The example README points back to this skill's current API and guides. All three example JavaScript files remain byte-identical to source; none requires a historical GitHub snapshot.

The fidelity regression strips provenance/navigation, concatenates example parts, reverses declared transformations and compares the complete source hash. Raw records must remain byte-identical. Update transformations intentionally; never change hashes merely to hide unexplained source drift.

## Protected curated content

[Retro recipes](recipes.md) and [interaction/instrument recipes](recipes-interaction.md) are TiTools contributions. Preserve their acoustic intent, lifecycle ownership and entry links when upstream docs change. Their native sequence examples keep the original millisecond onsets and total envelopes through separate `duration` and `length`; no JavaScript timer schedules notes. The repeated chord is now one centered native chord sequence; the separate one-off layered chord retains its per-voice stereo pans.

Focused executable recipe tests inspect submitted intervals, envelope lengths, pitch and cancellation IDs. They do not render audio or measure native callback timing.

## Current contract and acceptance boundaries

`start` configures one engine, up to 32 shared voices and one to four preallocated sequence slots. `playSequence` is the only successive-sound scheduler and returns a positive ID or zero. Sequence edits, state queries and cancellation name that ID. Global `setTempo` governs beat timing and synchronized modulation; millisecond sequences retain fixed times. Finite playback is the default, and circular patterns explicitly opt into looping.

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
- Local 1.1.0 returns `capabilities.variation: true` and `variationSchemaVersion: 1` on both platforms. Android also reports native sequence/master processing/modulation flags and `limits.stepDurationMs`; iOS omits those additional entries. Published 1.0.2 does not accept variation. Both platforms return sequence-capacity, priority and send limits; use the [API](api.md) for exact beat/millisecond ranges.
- Official examples now bind their waveform constants and document native sequence modulation, complete effect fidelity and publication ownership correctly. The mirrors preserve the same facts.


These are official-documentation and skill corrections, not native implementation fixes. No module code, public range or hardware acceptance was changed.
A validator corpus establishes accepted/rejected dictionaries, not sample-identical
rendering on a physical device. Current source-first coverage ledgers and native locators are recorded in the maintainer's November 2 audit evidence.

## Local 1.1.0 attack variation

Both platforms validate eight bounded parameter ranges and select once per admitted attack. Require the capability/schema pair and omit the property entirely on published 1.0.2, including amount zero. The [variation guide](native-variation.md) preserves exact bounds, linear amount, pitch ratio, source prerequisites, per-chord ordinals, held stability, whole-dictionary step replacement, revision merging and deterministic seed identity. `updateVoice` rejects the attack dictionary. Preserve all of the authored envelope, cadence, routing and layer gains.

The [verification report](native-variation-validation.md) separates initial host/build checks from later consumer installations and scoped listening feedback. It records the 144-byte configuration and four-transport growth from 8,627,712 to 9,537,152 bytes, excluding other engine/bridge/process storage. Earlier 1.0.2 memory reports remain historical. Host callback timings do not prove device overhead or sustained acceptance.

This audit reran the paired production validators (156 cases per platform), the affected documentation checks and TiTools mirror/recipe checks. New source inspection verified sampling/admission and sequence seed identity. Historical renderer PCM, native build, consumer install and listening results were read with their original boundaries; they were not repeated or expanded into general device acceptance. No native source or binary was changed.

All thirteen raw JSON/ZIP records moved upstream from `documentation/` to `docs/validation/` without changing bytes. Their distributed skill paths are preserved; the snapshot now records their actual upstream locations. All five ZIPs passed CRC checks. The three example JavaScript assets remain byte-identical; `app.js` now includes the capability-gated attack-variation action.

## Upstream documents outside the mirror set

The official index is replaced by this skill's task routing. Dependency/license notices remain in the official module and binary packages. Both are recorded with hashes and reasons in `excluded_documents`, so changed or newly added documents still require review.

## Verification after a reviewed update

Run the focused mirror/link and recipe tests, then:

```sh
node scripts/verify-module-snapshot.mjs --source /path/to/TiSynthEngine --skill ti-synthengine
```

The verifier checks source/mirror hashes, exclusions, new documents, base HEAD and the exact tracked/untracked worktree fingerprint. Refresh that fingerprint only after the source changes are finished. No npm version, publication or native-device acceptance follows from this procedure.
