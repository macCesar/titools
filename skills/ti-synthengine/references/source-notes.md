# Maintaining the synthesis snapshot

The seven official document mirrors are derived from the TiSynthEngine commit
in [source-snapshot.json](source-snapshot.json). A matching hash establishes
fidelity to that source; it does not establish that the source is correct.
Read the native contracts, command conversion and renderers when auditing
behavior. The maintainer workflow is `titools-skill-auditor` in this repository.

## Sources and permitted transformations

`api.md`, `audio-engine.md`, `examples.md`, `guide.md`, `recommendations.md`,
`sound-design.md` and `troubleshooting.md` mirror the corresponding upstream
`documentation/` files. Every record stores a full-source SHA-256 and a final
mirror SHA-256. The source header names the commit and full-source hash.

Only these transformations are currently declared:

- A provenance header and generated `TOC-START`/`TOC-END` navigation.
- The upstream demo link in `examples.md` is rebased to `example/app.js` at the
  pinned source commit. It requires access to the official module repository;
  the runnable application is not bundled with this skill.
- `examples.md` and `sound-design.md` retain their TiTools links to
  [curated recipes](recipes.md). These additions are recorded as reversible
  `link_fixes`, with the complete original and mirrored Markdown fragments.

The snapshot test removes the header and generated navigation, reverses those
fragments, and checks the full original source hash. Update the declared
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
