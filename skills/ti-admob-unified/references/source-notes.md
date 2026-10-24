# Official sources and snapshot maintenance

The native module is `ti.admob.unified`; this skill is `ti-admob-unified`. It works in ordinary Titanium apps as well as games and does not depend on `ti.game`, `ti.synthengine` or PurgeTSS.

## Provenance

Copied from the official module repository `macCesar/ti.admob.unified`, at clean commit `5b4cbf9347a51c4f959dc262ac1500f82f28b4a0` on 2026-10-11. Use the installed package documentation or a checkout of that repository. Commands below use `/path/to/ti.admob.unified` as a placeholder, not a required machine path. The 1.0.0 first public release remains under preparation according to this session; re-check its release status when installing later.

`source-snapshot.json` records original paths, source SHA-256, destination hashes and rebased Markdown links. Eleven official `documentation/*.md` guides are preserved, with dependency inventory, roadmap, contributing guide, upstream changelog and module license. Each Markdown file adds a source line and rewrites relative links (with any separately recorded broken-anchor correction) so they resolve inside the skill. Long API/banner references add generated TOCs. This provenance applies to the copied references, not to TiTools' curated `game-monetization.md` or this note.

`assets/example/lib/ads.js`, `assets/example/library-usage.js` and `assets/example/app.js` are byte-identical official source files. They are application code resources, not scripts to run in Node for ad delivery. The library is intended to be copied unchanged into the consuming app; keep project policies in a separate director/controller. Review native integration on both target platforms.

## Source priority and updates

Use the installed native module/build and its official docs for actual APIs and parity. This snapshot is a reproducible source for the documented 1.0.0 contract, not a proof of native ad delivery. A newer local build can carry behavior ahead of a version label; reconcile documented methods with installed artifacts before changing integration.

When updating the skill, inspect source changes and repository state, copy the official docs/example library, rebase all local links, regenerate only the affected TOCs, and update source and destination hashes. Keep the copy-ready library untouched. Run TiTools manifest, anchor, snapshot/link and example syntax tests; check packaging and installability. Validate integration and selected-provider delivery independently when a device/accounts are available. Do not silently refresh only version labels or hashes around unreviewed API changes.

Provider accounts, mediation groups, credentials, placement mappings and network privacy settings live outside a successful compile. `getMediationStatus()` describes Google's adapter initialization map, not installation inventory or delivery. Use the official mediation guide, current linked Google/provider setup documents, and single-source Ad Inspector testing. A Google demo ad cannot validate AppLovin/Meta/InMobi/Unity/Liftoff demand.

## TiTools audit convention

The maintainer-only `titools-skill-auditor` source map registers this skill. Use its quality/coverage workflow for future updates, including reading every affected official source, reporting docs/native disagreements and preserving verified author additions. The title `## Community-Discovered Patterns` denotes protected content; do not remove it merely because official docs do not mention it. Update or move it when official docs gain equivalent coverage. Creation of this new skill follows the authorized skill-creator task rather than reopening an audit approval gate.

Before an update run this maintainer tool from the TiTools repository:

```bash
node scripts/verify-module-snapshot.mjs --source /path/to/ti.admob.unified
```

It reports changed/missing sources, newly added official Markdown, modified shipped mirrors, source dirtiness and commit changes. It performs no fetch, pull, write or hash refresh. Compare the pinned commit to the candidate commit, review the report and relevant native/library changes, then perform only the authorized update. Native-module releases, provider SDK changes and official-doc corrections can all trigger a review.

Snapshot link correction: the official API page still links to `#mediation-diagnostics-and-compatibility` after its heading became `Mediation diagnostics`. The mirrored link targets `#mediation-diagnostics`; `source-snapshot.json` records the exact transformation and tests reconstruct the original source hash. The module repository was not edited. Re-check this correction during the next refresh.
