# Maintaining the synthesis snapshot

The eight official Markdown mirrors and raw statistics comparison are derived
from the reviewed TiSynthEngine working tree based on the commit in
[source-snapshot.json](source-snapshot.json). This snapshot includes the committed held/transport/effects implementation and uncommitted
documentation corrections from2026-10-22. The commit identifies the
base; it does not contain all reviewed content. `reviewed_worktree_sha256`
records the reviewed dirty-state fingerprint, including tracked differences
and untracked files. The checker verifies that fingerprint in addition to the
individual source/mirror hashes. A match establishes fidelity to that source
state; it does not establish that the source is correct, committed, published
or installed in an app. A different dirty fingerprint requires a fresh review.
Read the native contracts, command conversion and renderers when auditing
behavior. The maintainer workflow is `titools-skill-auditor` in this repository.

## Sources and permitted transformations

`api.md`, `audio-engine.md`, `examples.md`, `guide.md`, `recommendations.md`,
`sound-design.md`, `troubleshooting.md` and `stats-performance.md` mirror the
corresponding upstream `documentation/` files. `stats-performance.json` preserves
the complete raw trials without Markdown transformations. These nine assets
each record a full-source SHA-256 and final mirror SHA-256. Markdown provenance
headers identify the working tree, base commit and full-source hash.

Only these transformations are currently declared:

- A provenance header and generated `TOC-START`/`TOC-END` navigation.
- The upstream demo link in `examples.md` is rebased to the last committed
  `example/app.js` at the base commit. The committed reference app covers timed/statistics controls, not the new held/transport/effects controls; a
  GitHub commit link cannot expose uncommitted documentation updates. It requires access to
  the official module repository; the runnable app is not bundled here.
- `examples.md` and `sound-design.md` retain their TiTools links to
  [curated recipes](recipes.md). These additions are recorded as reversible
  `link_fixes`, with the complete original and mirrored Markdown fragments.

For Markdown mirrors, the snapshot test removes the header and generated
navigation, reverses those fragments, and checks the full original source hash.
The raw JSON is checked byte for byte. Update the declared
transformations when an intentional source-derived edit is reviewed; never
regenerate hashes merely to conceal an unexplained difference.

## Protected curated content

[recipes.md](recipes.md) is a TiTools contribution, not an official mirror.
Preserve its recipes, lifecycle patterns and navigation during synchronization.
Check every native option and envelope against the current contract. The
rhythm tests execute the Markdown examples and assert their intended note
onsets, lengths and cancellation behavior; they do not render audio.

Do not remove either official mirror's curated recipe link just because the
upstream source has no equivalent. The snapshot records these intentional
differences so preservation and source fidelity can both be checked.

## Statistics scope and evidence

The reviewed source adds `getStats()`, `resetStats()` and
`setStatsEnabled(Boolean)` to the previous eight-method API. Detect support
before using them with older 1.0.0 beta binaries; the version string alone does
not identify the feature. Basic counters remain available without enabling
diagnostics. Monotonic-clock render timing and signal measurements are optional
and default off; missing/unmeasured fields stay `null`, distinct from measured
zero. Android backend underrun, buffer and latency fields are independent of
that diagnostics switch and remain best-effort. Poll at a modest rate and
cancel polling with the owning screen/service.

[stats-performance.md](stats-performance.md) and its
[raw trials](stats-performance.json) document an Android native host comparison
against the base engine, including variability and excluded costs. They do not
run the iOS callback, JavaScript bridge or real device stream, and do not prove
device CPU, battery, heat, latency or physical underrun behavior. Review the
native statistics contract/publication and tests independently of the benchmark
percentages; no zero-overhead or unchanged device-performance guarantee follows.

## Upstream documents outside the mirror set

The snapshot declares `documentation/index.md` and
`documentation/third-party-notices.md` in `excluded_documents`, including each
reviewed hash and reason. SKILL.md supplies the distributed navigation;
dependency notices accompany the official module and native packages. This
skill does not distribute Oboe, native binaries or KEMAR impulse responses.
Changes or deletion of these excluded documents still require review. New
upstream documents remain visible as new documents until reviewed and mapped
or explicitly excluded; these records are not a blanket ignore rule.

## Verification after a reviewed update

```bash
node scripts/verify-module-snapshot.mjs --skill ti-synthengine --source /path/to/TiSynthEngine
node --test test/ti-synthengine.test.js test/ti-synthengine-recipes.test.js
```

Run these from TiTools. The checker is read-only: it reports source dirtiness,
commit drift, source/mirror changes, missing files and new official documents.
It never fetches, pulls or synchronizes. In the module checkout, also run the
applicable official documentation, contract and DSP checks described in
[audio-engine.md](audio-engine.md#regression-coverage).

Regenerate navigation only after inspecting the generator's dry run. Refresh
the snapshot's mirror hashes after navigation and declared additions are final.
Before committing, inspect source differences and the distributed package;
neither an old passing test count nor hash equality substitutes for that review.

## Native findings and acceptance boundaries

At the 2026-10-14 audit, iOS command construction converted zero attack/release
to at least one sample; Android preserved zero. The shared envelope therefore
has a one-sample boundary difference. This remains an upstream implementation
finding: no native changes were made during the documentation correction.
Recheck command construction or rendered output before calling it resolved.

Java/iOS corpus parity covers validator acceptance/reasons, not rendered
samples. The shared FIR suite and Android host tests establish narrower DSP
properties. Inspect their current assertions for rate endpoints and exact
tail-history coverage rather than assuming every advertised case is tested.
The JavaScript rhythm checks interpret submitted options; they are not native
scheduler timing measurements.

Device startup/route behavior, iOS rendering, headphone localization, CPU,
battery and underruns need their own evidence. Contract-valid recipes are not
automatically pleasant or perceptually well localized.

## Current synthesis expansion

The2026-10-22 review covers nineteen methods, held voices, native transport, master processing, two extra LFOs and accumulated limiter diagnostics. Official reference mirrors now include integration/copyable usage for those features. Processing defaults remain disabled. Per-voice sends, MIDI reading and independent composition tracks remain unsupported. The master mix is shared across callers.

The statistics-only benchmark is historical. The official studio-validation.json report records newer host evidence, including unmet full-chain deadline acceptance and pending physical checks. Links to assets outside this skill target the pinned upstream tree; its uncommitted documentation edits are represented by the mirrored text and working-tree fingerprint, not claimed as published content. No runtime/device guarantees follow from these hashes or validator checks.
