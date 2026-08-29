# Status — 2026-08-29

**Phase:** v4.17.1 shipped; live and maintained
**Session by:** Codex
**Deployed:** `@maccesar/titools@4.17.1`, tag `v4.17.1`, GitHub Release, marketplace version on `main`, OIDC workflow, and npm registry version were verified during the release.
**Branch:** `main`, aligned with `origin/main`; the shared-CORE parity correction and release metadata are published.
**Sibling:** `../AISkills` — its explicit-only cross-agent release skill shipped as v1.22.0.

## Where things stand

The `ti-synthengine` skill and full TiTools integration remain released from 4.17.0. Version 4.17.1 adds the shared safeguards exposed by AISkills' release-skill migration: `doctor` handles an empty `COMMANDS` catalog cleanly, and an older enabled plugin command suppresses a same-name replacement skill until the marketplace cache catches up.

## In flight

- Nothing. The diagnostics/symlink parity change and regression coverage are released.

## Requirements

- R10 remains satisfied: the shared diagnostics and symlink behavior match AISkills and both repositories were tested independently.

## Next step

Keep future shared-CORE changes synchronized with AISkills and refresh the maintainer's marketplace cache when needed.

## Verified vs. assumed

- Verified: the current full suite passes 346/346 with lint clean; `git diff --check` is clean.
- Verified: AISkills' corresponding implementation passes 121/121 with lint clean and its isolated zero-command `doctor` smoke check is correct.
- Verified during release: `main`, tag `v4.17.1`, GitHub Release, and npm `4.17.1` all resolve to the published release.

## Known pending

- None.
