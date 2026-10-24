# Official sources and snapshot maintenance

The native module is `ti.admob.unified`; this skill is `ti-admob-unified`. It works in ordinary Titanium apps as well as games and does not depend on `ti.game`, `ti.synthengine` or PurgeTSS.

## Provenance

Reviewed against public official **1.0.0** source
`034843299b2984253988e0ffccb9f6a1c91682c9` on 2026-10-24. Clean local HEAD,
remote main and Android/iOS annotated release tags match. Repository visibility
and non-draft/non-prerelease platform releases were verified.

| Platform | Published downloads | Verified core ZIP SHA-256 |
| --- | --- | --- |
| Android | [android-1.0.0](https://github.com/macCesar/ti.admob.unified/releases/tag/android-1.0.0) | `533ae21b6462ba2d773209f91ea607e975ce34413b165c1d77a34fc5680ec055` |
| iOS | [ios-1.0.0](https://github.com/macCesar/ti.admob.unified/releases/tag/ios-1.0.0) | `665e0ad85c0d343c47bc1b671d57a1f2ac41cb9f57305053c6ab64b7951ebb20` |

Both core archives were downloaded, independently hashed and CRC/manifest
checked without installation. Each release's SHA256SUMS lists core plus five
optional network ZIPs; all twelve hashes match published GitHub asset digests.
Complement binaries were not downloaded or executed. Core manifests require
Titanium 13.4.1.GA; Android has four ABIs and Apple declares `mac:false`.
App requirements also include iOS 15+, Android API 24+ and compile SDK 36. Use
[installation guidance](getting-started.md) and only selected complements;
installing adapters alone does not configure provider demand.

`source-snapshot.json` records each source, original/mirror hash and declared
link/correction transformations. It covers thirteen official documentation pages,
dependency/roadmap/contributing/changelog/license material and the public
[mediation parity comparison](mediation-parity.md). The root README is a reviewed,
hashed exclusion whose operational requirements map to the available guides.

The three official JavaScript resources under `assets/example/` remain
byte-identical. Copy `lib/ads.js` unchanged; keep app policy/director logic
outside it. The curated [game guide](game-monetization.md) and this provenance
note are TiTools contributions rather than upstream mirrors.

## Current source distinctions

- Rewarded interstitial and synchronous ATT status query are implemented.
  Read the dedicated format/production guides before integration; older
  unsupported-format guidance does not describe this release.
- Native `autoReload` is read live at fullscreen close. The other four mutable
  request options affect the next load. Official API/fullscreen prose grouped
  all five as next-load properties; exact reversible errata preserve original
  source hashes while describing current native behavior.
- Raw proxy `load()`/`show()` do not return success. Manager returns and mocked
  tests do not establish a delivered ad. UMP consent, ATT query, initialization,
  per-format layout and account readiness remain separate boundaries.
- The iOS collapsed-SVG repair is narrowly scoped to the Google interstitial
  creative case documented in source. Host lifecycle/DOM assertions are not
  new physical visual acceptance or a generic creative replacement API.

The earlier skill pin `5b4cbf9` is no longer resolvable in the source checkout.
The audit uses prior shipped mirrors/library as its documentation baseline and
verifies current released implementation independently. It does not invent an
unavailable historical native diff or restore removed private history.

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

The old broken mediation heading link was corrected upstream and no longer
needs a local transformation. Current semantic errata are explicitly recorded
and reconstructed by the source-fidelity regression.
