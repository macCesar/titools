# Maintaining the synthesis snapshot

These references mirror TiSynthEngine **1.0.0 beta at reviewed local commit `5f9bf05ce683794449a49972a963460e6760b07a`**, as recorded in [source-snapshot.json](source-snapshot.json). The source repository is clean and committed locally; this synchronization does not push that commit or publish a release. `source_state: committed`, full source/mirror hashes and the clean `reviewed_worktree_sha256` identify the reviewed state. Hash equality establishes provenance, not native correctness, binary installation, listening approval or physical performance.

## Sources and permitted transformations

Eight official Markdown documents are mirrored into nine parts: `api.md`, `audio-engine.md`, `examples.md`, `advanced-examples.md`, `guide.md`, `recommendations.md`, `sound-design.md`, `troubleshooting.md` and `stats-performance.md`. The official examples split immediately before the sustained motor section. Ordered `source_parts` reconstruct their complete source. `stats-performance.json` and `studio-validation.json` are preserved byte for byte as historical records. The current `unified-bypass-performance.json` and `unified-validation.json` reports are also mirrored byte for byte; their explicit limits remain part of the evidence. Current [physical validation](physical-validation.json) and [Frontier measurements](frontier-physical-validation.json) complete the six byte-identical JSON reports. Four current example assets are also included: the [setup instructions](../assets/example/README.md), [app.js](../assets/example/app.js) and its two helpers in `assets/example/lib/`. The three linked raw-evidence ZIP archives are also mirrored byte for byte. The ledger therefore contains fifteen reference records, four example-asset records and three evidence archives.

Each Markdown part and the example README have a local-commit provenance header and recorded navigation transformations. Reversible `link_fixes` rebase links into the split advanced examples, preserve [curated recipes](recipes.md), and resolve current example links to bundled assets. The example README points back to this skill's current API and guides. All three example JavaScript files remain byte-identical to source; none requires a historical GitHub snapshot.

The fidelity regression strips provenance/navigation, concatenates example parts, reverses declared transformations and compares the complete source hash. Raw records must remain byte-identical. Update transformations intentionally; never change hashes merely to hide unexplained source drift.

## Protected curated content

[Recipes](recipes.md) are TiTools contributions. Preserve their acoustic intent, lifecycle ownership and entry links when upstream docs change. Their native sequence examples keep the original millisecond onsets and total envelopes through separate `duration` and `length`; no JavaScript timer schedules notes. The repeated chord is now one centered native chord sequence; the separate one-off layered chord retains its per-voice stereo pans.

Focused executable recipe tests inspect submitted intervals, envelope lengths, pitch and cancellation IDs. They do not render audio or measure native callback timing.

## Current contract and acceptance boundaries

`start` configures one engine, up to 32 shared voices and one to four preallocated sequence slots. `playSequence` is the only successive-sound scheduler and returns a positive ID or zero. Sequence edits, state queries and cancellation name that ID. Global `setTempo` governs beat timing and synchronized modulation; millisecond sequences retain fixed times. Finite playback is the default, and circular patterns explicitly opt into looping.

Selective `music`, `effects`, `ui` and `ambience` categories feed one shared effect chain; an explicit per-voice send overrides category selection. Live spatial position, noise clock, low-pass cutoff and compatible continuous voice controls ramp over 10 ms while preserving history. Priorities protect higher-priority voices without reserved quotas. See the [API](api.md) for exact limits, source compatibility, return values and event delivery.

The historical statistics-only benchmark predates the full chain. [Studio validation](studio-validation.json) records earlier full-chain host evidence, including unmet deadline acceptance and physical checks still pending. Those records do not certify this newer transport/routing implementation. The [unified transport validation](unified-validation.json) and [bypass performance comparison](unified-bypass-performance.json) record current host evidence and outstanding conditions. Physical evidence remains incomplete: Android maximum-load and headphone acceptance fail, and strict Frontier Sim80 load matching is inconclusive on both devices. iPad's clean Sim80 listening is scoped to that scenario. The same-PCM Android comparison supports live-delivery failure; private optimization candidates were not promoted. Read the current reports for exact device, native revision, sampling and matching scopes; a functional API build does not establish performance acceptance.

Earlier source audits identified incomplete iOS rejection accounting, timed zero-envelope conversion differences and limits in spatial test coverage. Those findings described their recorded historical native revision; this reference synchronization does not re-establish them against every new native path. Read the current official engine/tests and their validation report before making a current-platform claim. A validator corpus establishes accepted/rejected dictionaries, not sample-identical rendering on a physical device.

## Upstream documents outside the mirror set

The official index is replaced by this skill's task routing. Dependency/license notices remain in the official module and binary packages. Both are recorded with hashes and reasons in `excluded_documents`, so changed or newly added documents still require review.

## Verification after a reviewed update

Run the focused mirror/link and recipe tests, then:

```sh
node scripts/verify-module-snapshot.mjs --source /path/to/TiSynthEngine --skill ti-synthengine
```

The verifier checks source/mirror hashes, exclusions, new documents, base HEAD and the exact tracked/untracked worktree fingerprint. Refresh that fingerprint only after the source changes are finished. No npm version, publication or native-device acceptance follows from this procedure.
