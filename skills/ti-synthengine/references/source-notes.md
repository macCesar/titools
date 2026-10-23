# Maintaining the synthesis snapshot

The nine official Markdown parts and two raw validation/statistics JSON records are derived from the reviewed TiSynthEngine commit in [source-snapshot.json](source-snapshot.json). The source implementation and documentation are committed as of 2026-10-22. Source/mirror hashes and the pinned commit identify this state; neither commits nor hash equality establish public release, installation, native correctness or physical sound quality. For a future reviewed dirty source, use `source_state: working-tree` plus the exact `reviewed_worktree_sha256`; ordinary committed snapshots require a clean source checkout. Read native contracts, command conversion and renderers when auditing behavior. The maintainer workflow is `titools-skill-auditor` in this repository.

## Sources and permitted transformations

`api.md`, `audio-engine.md`, `examples.md`, `guide.md`, `recommendations.md`,
`sound-design.md`, `troubleshooting.md` and `stats-performance.md` mirror the
corresponding upstream `documentation/` files. The complete `examples.md` source
is distributed in `examples.md` and `advanced-examples.md`, with ordered
`source_parts` metadata. `stats-performance.json` and `studio-validation.json`
preserve the complete raw records without Markdown transformations. These eleven assets
each record a full-source SHA-256 and final mirror SHA-256. Markdown provenance
headers identify the working tree, base commit and full-source hash.

Only these transformations are currently declared:

- A provenance header and generated `TOC-START`/`TOC-END` navigation.
- Splitting the official examples across two ordered parts, with reversible
  setup/navigation text and rebased incoming links. Both parts reconstruct the
  complete official source; neither silently omits examples.
- Adding the required `SynthStudioContract.java` source to the official host
  `javac` recipe; the original incomplete command remains reconstructable.
- A declared TiTools correction to the statistics rejection-count description;
  see native findings below. Upstream prose remains reconstructable.
- The upstream demo link in `examples.md` is rebased to the last committed
  `example/app.js` at the base commit. The committed reference app covers timed/statistics controls, not the new held/transport/effects controls; a
  GitHub commit link cannot expose uncommitted documentation updates. It requires access to
  the official module repository; the runnable app is not bundled here.
- `examples.md` and `sound-design.md` retain their TiTools links to
  [curated recipes](recipes.md). These additions are recorded as reversible
  `link_fixes`, with the complete original and mirrored Markdown fragments.

For Markdown mirrors, the snapshot test removes the header and generated
navigation, reverses those fragments, and checks the full original source hash.
The two example parts are concatenated before reversing transformations and
checking the full original source hash. Raw JSON is checked byte for byte. Update the declared
transformations when an intentional source-derived edit is reviewed; never
regenerate hashes merely to conceal an unexplained difference.

The commit-pinned interactive README retains its historical claim of all eleven
public methods. It documents the timed-playback/statistics demonstration only;
the current contract has nineteen methods. Its setup and existing control
checklists remain usable. Read [advanced examples](advanced-examples.md) for
held/transport/processing/LFO usage rather than inferring that the pinned demo
exposes those controls.

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

The statistics expansion added `getStats()`, `resetStats()` and
`setStatsEnabled(Boolean)` to the earlier eight-method API; the current snapshot
has nineteen methods in total. Detect support
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
Changes or deletion of these excluded documents still require review. New upstream Markdown documents remain visible to the checker until reviewed
and mapped or explicitly excluded. Its discovery scan currently covers `.md`
only: inventory new JSON and other assets explicitly during audits. Both current
JSON records are tracked and hash-checked. Exclusions are not blanket ignores.

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

The 2026-10-22 audit rechecked the following against the committed native
implementation at `6b48af568c4a50685541b4ae2800d38081e6ebb7`. Native code was
not changed by this skill update.

- **iOS rejection counters are incomplete.** The upstream API promises every
  rejected Boolean request is counted. The iOS port returns `false` without
  incrementing rejection counters for stopped `playSequence`/`updateSequence`
  (`ios/Classes/TiSynthengineModule.m:1842`), non-dictionary sequence arguments
  (`:1844`), stopped `stopSequence` (`:1862`), stopped `setMasterProcessing`
  (`:1874`) and incompatible known-voice modulation edits (`:1968`). Android
  counts the corresponding paths in `android/src/ti/synthengine/TiSynthEngineModule.java`
  (`:449–455`, `:466–475`, `:269`). Treat `rejectedRequestCount` and its reason
  breakdown as observed counters, not an exhaustive rejection audit on iOS.
  The reasons can still sum correctly while undercounting actual rejected calls.
  The API mirror contains a declared correction rather than repeating the
  upstream guarantee.
- **Timed zero-envelope conversion still differs.** iOS forces zero attack and
  release to one sample when constructing timed tones (`TiSynthengineModule.m:2078–2079`),
  chords (`:2169–2170`) and pattern steps (`:2470–2471`). Android preserves zero.
  Held notes follow a different path: the shared safety edge enforces at least
  3 ms (`:1063–1067`). This finding concerns timed calls, not a claimed defect
  in held-note safety or a failed validator.
- **Spatial coverage has precise limits.** `tests/spatial_regression.c:19–23`
  exercises 16, 32, 64 and 128 kHz; its doubling loop does not exercise 8 or
  192 kHz. `tests/spatial_engine_host.cpp:19–29` compares a complete short-note
  FIR output at 48 kHz. Its stealing/stopping cases check finite output and
  eventual silence, not exact equivalence of every tail-history sample.

Java/iOS corpus parity covers validator acceptance/rejection, not rendered
samples. Shared held, sequence, effects and modulation tests establish their
asserted core behavior; the sequence test checks ten-minute clocks at five
rates, and effects explicitly cover 16, 44.1, 48, 96 and 192 kHz. Neither runs
the iOS audio callback on a device. JavaScript recipe and consumer checks
interpret submitted options, UI retry timers and cancellation; they do not
measure native scheduler or output timing.

Device startup/route behavior, iOS rendering, headphone localization, CPU,
battery and underruns need their own evidence. Contract-valid recipes are not
automatically pleasant or perceptually well localized.

## Current synthesis expansion

The 2026-10-22 review covers nineteen methods, held voices, native transport, master processing, two extra LFOs and accumulated limiter diagnostics. Official reference mirrors now include integration/copyable usage for those features. Processing defaults remain disabled. Per-voice sends, MIDI reading and independent composition tracks remain unsupported. The master mix is shared across callers.

The statistics-only benchmark is historical. The bundled [studio-validation.json](studio-validation.json) report records newer host evidence, including unmet full-chain deadline acceptance and pending physical checks. Links to the runnable example outside this skill target the pinned upstream tree; its uncommitted documentation edits are represented by the mirrored text and working-tree fingerprint, not claimed as published content. No runtime/device guarantees follow from these hashes or validator checks.
