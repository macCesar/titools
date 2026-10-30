# Maintaining the synthesis snapshot

These references describe **TiSynthEngine module 1.0.2, public API 1.0.0**.
The corrected official documentation is a reviewed working tree based on
`4a45f21230ffc5a8838fbd5fc108dd3ab470362a`, recorded with its exact fingerprint in
[source-snapshot.json](source-snapshot.json). The documentation corrections are
not represented as committed by that base revision. Review date: 2026-10-29.

## Public downloads and artifact provenance

The replacement packages were freshly downloaded from the existing public URLs
on 2026-10-30 UTC (2026-10-29 locally), rather than reusing cached 1.0.2 files.

| Platform | Published release | Replacement package SHA-256 |
| --- | --- | --- |
| Android | [android-1.0.2](https://github.com/macCesar/TiSynthEngine/releases/tag/android-1.0.2) | `8698104f188782a77699fbd6308a779ca0b190833ceebf398557b628af1b8bbe` |
| iOS / Mac Catalyst | [ios-1.0.2](https://github.com/macCesar/TiSynthEngine/releases/tag/ios-1.0.2) | `779e77d018d5b3f686d69cb1b4b0162281803ea12691487df565c1fd15175c58` |

Both ZIPs passed full CRC checks and match the current GitHub asset SHA-256
digests. These hashes replace the original 1.0.2 packages' hashes; filenames and
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

Nine official Markdown documents are mirrored into ten parts, including the
ordered examples/advanced-examples split. The current snapshot inventories all
complete JSON reports, bundled example assets and linked raw-evidence archives.
The new [performance review](performance-review.json) and its raw archive are
preserved alongside historical reports; none is replaced by a favorable summary.
Read snapshot records for exact counts and hashes. Example JavaScript and raw
reports/archives remain byte-identical to source.

Each Markdown part and the example README have a reviewed working-tree provenance header and recorded navigation transformations. Native-backed corrections to stale official prose are also declared as reversible `link_fixes`; the source hash still identifies the original official text, not the corrected mirror. Reversible `link_fixes` rebase links into the split advanced examples, preserve [curated recipes](recipes.md), and resolve current example links to bundled assets. The example README points back to this skill's current API and guides. All three example JavaScript files remain byte-identical to source; none requires a historical GitHub snapshot.

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

Official corrections now preserve panic cancellation (`stopAll` stops every
sequence and invalidates effect histories), compatible live `updateVoice`
noise/low-pass/spatial/send edits, and category selection with `applyTo` plus
explicit `effectSend` overrides. Their superseded mirror errata were removed;
remaining native-backed errata and curated recipe navigation stay reversible.
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

The earlier native findings were independently rechecked against the
1.0.2 source on October 29. These current differences remain explicit;
hash fidelity alone cannot establish them:

- iOS timed tone/chord command construction still rounds accepted zero attack
  and release to at least one sample; Android preserves zero. Validator
  acceptance does not establish identical sample envelopes.
- iOS early tempo/sequence/processing rejections and incompatible held spatial/
  modulation edits can bypass rejection counters. Android also leaves some
  unknown/retired sequence-stop returns uncounted. The recorded reason sum is
  consistent with recorded totals, not a complete API-call rejection tally.
- Sequence cutoff coefficients currently refresh every 16 samples on Android
  and every 8 samples on Apple; both use note length but do not promise identical
  sample output. See [engine details](audio-engine.md).
- Android `getDefaults()` additionally returns `capabilities` and
  `limits.stepDurationMs`; iOS omits those keys. Both platforms return
  `limits.maxSequences`, `limits.priority` and `limits.effectSend`. Detect
  required methods rather than requiring Android-only metadata flags. Sequence
  intervals use different beat and millisecond ranges; see [API](api.md).
- Remaining stale official claims are corrected only where verified against
  current native behavior, with exact reversible transformations. Corrections
  already adopted upstream are removed from the transformation list.


These findings are skill corrections and module implementation findings, not
native fixes. No module code, public range or hardware acceptance was changed.
A validator corpus establishes accepted/rejected dictionaries, not sample-identical
rendering on a physical device. Consumer scenarios and exact native locators
are recorded in the maintainer's October 23 audit evidence.

## Upstream documents outside the mirror set

The official index is replaced by this skill's task routing. Dependency/license notices remain in the official module and binary packages. Both are recorded with hashes and reasons in `excluded_documents`, so changed or newly added documents still require review.

## Verification after a reviewed update

Run the focused mirror/link and recipe tests, then:

```sh
node scripts/verify-module-snapshot.mjs --source /path/to/TiSynthEngine --skill ti-synthengine
```

The verifier checks source/mirror hashes, exclusions, new documents, base HEAD and the exact tracked/untracked worktree fingerprint. Refresh that fingerprint only after the source changes are finished. No npm version, publication or native-device acceptance follows from this procedure.
