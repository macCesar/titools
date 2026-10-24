# Maintaining the synthesis snapshot

These references mirror the **public TiSynthEngine 1.0.0 release** at
`e7cbbe8a6f9ab38088fd8029c7b43cef6501101f`, recorded in
[source-snapshot.json](source-snapshot.json). The clean local checkout and remote
main matched that commit on 2026-10-24. The repository is public; the Android
and iOS releases are published, neither draft nor prerelease. Module availability
is independent of publishing a new TiTools version.

## Public downloads and artifact provenance

| Platform | Published release | Package SHA-256 |
| --- | --- | --- |
| Android | [android-1.0.0](https://github.com/macCesar/TiSynthEngine/releases/tag/android-1.0.0) | `cf3510f290eca6dd00e8e0742a7db4f09dd2b8c4ef9270ed1f34d30eb32389cf` |
| iOS / Mac Catalyst | [ios-1.0.0](https://github.com/macCesar/TiSynthEngine/releases/tag/ios-1.0.0) | `bc2e3f88c2945df721dd2196dfbb852c64aa98954b04460adf56ca41c75e6e91` |

Both platform tags and `v1.0.0` point at the reviewed commit; only the two
platform tags have GitHub release pages. Downloaded ZIPs were independently
hashed and inspected: module ID `ti.synthengine`, version `1.0.0`, minimum
Titanium `13.2.0.GA`; Android includes four ABIs and the Apple manifest enables
Mac Catalyst. See the [guide](guide.md) for Android API35 and iOS15 requirements,
app-root ZIP installation and both `tiapp.xml` declarations. These checks do not
constitute a fresh device installation or audio acceptance run.

## Sources and permitted transformations

Eight official Markdown documents are mirrored into nine parts, including the
ordered examples/advanced-examples split. The current snapshot inventories all
complete JSON reports, bundled example assets and linked raw-evidence archives.
The new [performance review](performance-review.json) and its raw archive are
preserved alongside historical reports; none is replaced by a favorable summary.
Read snapshot records for exact counts and hashes. Example JavaScript and raw
reports/archives remain byte-identical to source.

Each Markdown part and the example README have a local-commit provenance header and recorded navigation transformations. Native-backed corrections to stale official prose are also declared as reversible `link_fixes`; the source hash still identifies the original official text, not the corrected mirror. Reversible `link_fixes` rebase links into the split advanced examples, preserve [curated recipes](recipes.md), and resolve current example links to bundled assets. The example README points back to this skill's current API and guides. All three example JavaScript files remain byte-identical to source; none requires a historical GitHub snapshot.

The fidelity regression strips provenance/navigation, concatenates example parts, reverses declared transformations and compares the complete source hash. Raw records must remain byte-identical. Update transformations intentionally; never change hashes merely to hide unexplained source drift.

## Protected curated content

[Retro recipes](recipes.md) and [interaction/instrument recipes](recipes-interaction.md) are TiTools contributions. Preserve their acoustic intent, lifecycle ownership and entry links when upstream docs change. Their native sequence examples keep the original millisecond onsets and total envelopes through separate `duration` and `length`; no JavaScript timer schedules notes. The repeated chord is now one centered native chord sequence; the separate one-off layered chord retains its per-voice stereo pans.

Focused executable recipe tests inspect submitted intervals, envelope lengths, pitch and cancellation IDs. They do not render audio or measure native callback timing.

## Current contract and acceptance boundaries

`start` configures one engine, up to 32 shared voices and one to four preallocated sequence slots. `playSequence` is the only successive-sound scheduler and returns a positive ID or zero. Sequence edits, state queries and cancellation name that ID. Global `setTempo` governs beat timing and synchronized modulation; millisecond sequences retain fixed times. Finite playback is the default, and circular patterns explicitly opt into looping.

Selective `music`, `effects`, `ui` and `ambience` categories feed one shared effect chain; an explicit per-voice send overrides category selection. Live spatial position, noise clock, low-pass cutoff and compatible continuous voice controls ramp over 10 ms while preserving history. Priorities protect higher-priority voices without reserved quotas. See the [API](api.md) for exact limits, source compatibility, return values and event delivery.

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

The October 23 native findings were independently rechecked against the
published source on October 24. These current differences remain explicit;
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
- Android `getDefaults()` includes capabilities and additional limit metadata
  that the current iOS dictionary omits. Both expose the corresponding APIs;
  detect methods rather than requiring Android-only metadata flags. Sequence
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
