# Audit workflow

7-phase process for auditing and updating an existing doc-based skill in this repo against its upstream documentation source. Verify authorization before applying changes; read-only audits stop after their report.

**Pre-requisite:** Load `quality-standards.md` and `source-map.md` before starting this workflow.

---

<!-- TOC-START -->
## Contents

- [Phase 0: Pre-flight + classify source type](#phase-0-pre-flight--classify-source-type)
- [Phase 1: Coverage analysis](#phase-1-coverage-analysis)
- [Phase 2: Gap identification](#phase-2-gap-identification)
- [Phase 3: Consolidated report](#phase-3-consolidated-report)
- [Phase 4: User approval gate](#phase-4-user-approval-gate)
- [Phase 5: Apply updates](#phase-5-apply-updates)
- [Phase 6: Post-audit verification](#phase-6-post-audit-verification)

<!-- TOC-END -->

## Phase 0: Pre-flight + classify source type

Before starting an audit, do two things.

### 0a. Verify the upstream caches

Which caches an audit needs depends on the skill, and getting this wrong is the failure mode this phase exists to prevent: `.titanium-docs` is frozen, so an audit that reads it as a live source passes everything and finds nothing.

| Skill | Required caches |
|---|---|
| `ti-api` | `.titanium-sdk` (canonical) + `.titaniumsdk-site` (release cross-check) + `.titanium-docs` (provenance only) |
| `alloy-guides`, `alloy-howtos`, `ti-guides`, `ti-howtos` | `.titaniumsdk-site` (live) + `.titanium-docs` (archive) |
| `purgetss` | `.purgetss-docs` + `.purgetss-source` |
| `ti-admob-unified` | `.ti-admob-unified` or existing module checkout; `references/source-snapshot.json` |
| `ti-synthengine` | Existing `macCesar/TiSynthEngine` checkout or gitignored source cache; `references/source-snapshot.json` and `source-notes.md` |
| `ti-ui` | Titanium guide caches + `.titanium-sdk` for exact API/configuration claims |
| `ti-game` | Existing `m1ga/ti.game` checkout or gitignored cache; Titanium sources for app/window integration dependencies |

If one is missing, stop and prompt the user with the matching clone command from `SKILL.md` § Setup.

Record what each audit read, because a finding is only checkable if its source is:

```bash
git -C .titanium-sdk rev-parse --short HEAD
git -C .titanium-sdk describe --tags --abbrev=0   # the GA the API audit is anchored to
git -C .titaniumsdk-site rev-parse --short HEAD
git -C .titanium-docs rev-parse --short HEAD
```

For `ti-api`, anchor to the tag, not to the checkout. `main` declares `14.0.0` and carries APIs no released SDK has:

```bash
git -C .titanium-sdk show 13_4_1_GA:apidoc/Titanium/UI/Toolbar.yml
```

An API that is in `main` but in neither the GA tag nor `registry/sdk/<version>/` is a future release, not a gap in the skill. Say so in the report rather than proposing it as a fix.

For `purgetss`, require both `.purgetss-docs/` and `.purgetss-source/`, then record both commit hashes. The docs establish user-facing workflows; the package changelog, CLI, implementation, generated `dist/` files, and tests resolve release-specific behavior and exact class/module contracts.

### 0b. Classify the skill's source type

| Source type | Skills | Audit approach |
|---|---|---|
| **Narrative, two layers** | `alloy-guides`, `alloy-howtos`, `ti-guides`, `ti-howtos` | Compare against the live page in `.titaniumsdk-site/content/docs/` first; use `.titanium-docs` additively for missing topics and applicable details omitted within an existing live topic |
| **API** | `ti-api` | Compare against `.titanium-sdk/apidoc/*.yml` at the newest GA tag, cross-checked with `.titaniumsdk-site/registry/sdk/<version>/` |
| **Mixed narrative + implementation** | `purgetss`, `ti-admob-unified`, `ti-synthengine` | Compare against the skill's mapped official docs, then independently verify exact behavior against its own implementation/tests; classify curated additions separately |
| **Curated official-source guidance** | `ti-ui`, `ti-game` | Inventory every in-scope source topic and distinct example behavior, map into curated references, and verify app-integration dependencies through the owning Titanium skill |

The source type determines audit strategy:

- **Narrative, two layers**: Section-by-section against the live page. Where the live page and the archive disagree on a fact, the live page is right. Where the archive covers a topic or applicable operational detail the live page omits, keep it and mark it archive-sourced, verifying current behavior when needed. Absence from a condensed page is not evidence of deprecation. Never delete a reference for being absent from the new site: the new site condensed 336 pages into 62, and this repo deliberately keeps the rest.
- **API**: Compare per-namespace against YAML, not markdown. A property is a `- name:` entry under `properties:`; `platforms`, `since`, `default` and `deprecated` are its siblings. Expect one reference file to map to many `.yml` files.
- **Mixed**: Documentation prose is not enough when it lags a same-day release. Prefer observable CLI/source/test behavior for exact contracts and use the docs for explanations.

---

For `ti-admob-unified`, run the read-only snapshot checker from `source-map.md` and distinguish official mirrors, byte-identical example assets and curated `game-monetization.md` before coverage comparison. Resolve exact module claims against Android/iOS implementation/tests and official module docs, not Titanium SDK apidoc.

For `ti-synthengine`, run `node scripts/verify-module-snapshot.mjs --skill ti-synthengine --source /path/to/TiSynthEngine`. Read the snapshot metadata and source notes before comparing the mapped official mirrors and raw assets. For an explicitly reviewed working-tree snapshot, verify its fingerprint and base commit; ordinary dirty sources still require review. Account for explicitly excluded upstream documents (`index.md`, `third-party-notices.md`) separately from newly discovered documents; exclusions require declared reasons. Keep curated `recipes.md`, declared cross-links and the rebased commit-pinned demo link distinct from official source content.

## Phase 1: Coverage analysis

Map the current state of the skill against its upstream documentation.

### AUDIT-SKIP files

Before doing coverage analysis, scan all reference files in the skill for an `<!-- AUDIT-SKIP -->` HTML comment near the top. Files marked with this comment are manually maintained against a different upstream source (e.g. a third-party toolkit's own docs) and must be **excluded from the audit entirely**:

- Do NOT read or compare the file against any upstream Titanium documentation source.
- Do NOT include the file in the coverage table.
- List skipped files in a separate "Skipped (manually maintained)" section of the report.
- Source-map.md should also flag these files; cross-check both signals.

If you propose any change to an AUDIT-SKIP file, that is a bug in the audit. Stop and ask the user before continuing.

This exclusion protects the file from the wrong-source comparison and edits; it does not remove upstream requirements from the source-first ledger. If a skipped file is the destination for an in-scope requirement, record its owner/source and mark the delegation unverified until the owning audit supplies evidence. A skip marker alone cannot satisfy the completion gate.

### Steps

1. **Identify the source subtree** for the skill from `source-map.md`.
2. **List all files in both locations:**
   - Official docs/source: `Glob` the mapped upstream roots
   - Skill references: `Glob` the skill's `references/` directory
   - **Filter out AUDIT-SKIP files** (see above) — exclude them from all later phases.
   - Inventory upstream documents even when no existing reference maps to them. Use upstream indexes, navigation, README/tutorial links and example catalogs to detect source-map gaps. Define the topic scope from the skill's advertised purpose, not just its existing contents. Account for each discovered document as in scope, delegated or explicitly excluded with a reason.
3. **Read the skill's `SKILL.md`** to understand its quick reference table and overall structure.
4. **Build a source-first coverage ledger**, not a line-ratio estimate. Read every in-scope section, table, warning and example before assigning a verdict. Expand each section into independently applicable requirements where necessary; one topic heading can hide several required targets or platform branches.

   | Source @ commit + section/lines | Requirement / distinct example behavior | Skill destination + heading/lines | Status | Evidence / gap / exclusion reason |
   |---|---|---|---|---|
   | `Orientation.md@<hash>` app-level Android lock | Configure the launcher and each applicable Titanium activity | `orientation.md` locking orientation | Partial | Only launcher shown; remaining activity targets omitted |
   | `<source>@<hash>` setup | Required permissions and initialization before use | `<reference>#<heading>` | Complete | All steps and timing preserved in a shorter example |

   Statuses: **complete** (including an equivalent summary), **partial**, **missing**, **unverified** (source unread/unavailable or evidence unresolved), **delegated** (verified available destination), **excluded** (explicit reason, no lost in-scope requirement). Track author additions separately. Link the current official source as provenance; an upstream-only link without the required skill guidance is not a complete/delegated summary.

5. **Check both directions.** Source → skill establishes missing material; skill → source establishes unsupported claims and preserved author contributions. A diff-only audit cannot discover older omissions. Read unchanged sections too; label a deliberately narrower request as a partial audit rather than certifying the entire skill.

6. **Define consumer scenarios** for the audited task families. Include a complete setup path and applicable platform/device/version branches, failure cases and cleanup. Use documented multi-target integration to test whether a summary remains actionable; determine expected behavior from the source, not from the existing skill.

### Output

Present the coverage table to the user. Note any reference files that have no clear official source mapping — these may be author additions or curated content.

---

## Phase 2: Gap identification

Compare each reference file against its upstream source in detail.

> **Use parallel agents for this phase.** Each reference file comparison is independent.

### Per-reference comparison steps

For each reference file:

1. **Read the reference file** completely.
2. **Read the corresponding official source file(s)** completely.
3. **Compare section by section.** For each section in the official docs:
   - Mark as **complete** (all operational requirements survive, including in an equivalent shorter summary)
   - Mark as **partial** (exists but missing subsections, examples, or options)
   - Mark as **missing** (not covered at all)
   - Mark as **author addition** (exists in reference but NOT in official docs)
4. **Check code examples:**
   - Does every distinct behavior demonstrated by official examples survive in the reference or a verified delegated destination? Equivalent examples may be combined; verbatim duplication is not required.
   - Are prerequisites, all configuration targets, ordering, platform branches, defaults, errors and cleanup retained? A shorter example must not silently narrow a whole-app recipe to one window/activity.
   - Are reference examples accurate (not hallucinated)?
   - Are curated/transformable examples updated to ES6+ without changed behavior, respecting declared mirror/asset exceptions?
5. **Classify content without an official source.** Not all unlabeled content is training-data contamination. Distinguish three cases:
   - **Training-data contamination** (propose DELETE): methods/properties that don't exist in the SDK, wrong parameter names, overly generic advice, patterns from other frameworks (React, Vue, Cordova).
   - **Legitimate author contribution** (propose PRESERVE + MARK): verifiable real-world patterns, workarounds for known SDK bugs, best practices from production apps. Propose moving these into a `## Community-Discovered Patterns` section — never silently delete.
   - **Ambiguous** (propose ASK): cannot verify either way. Flag for user decision.
6. **Respect the `## Community-Discovered Patterns` convention.** Sections under this H2 heading are PROTECTED — never delete during audits, even without official source. See `quality-standards.md` § "Protected sections".

### Native module correctness checks

For `ti-game`, `ti-admob-unified` and `ti-synthengine`, perform these checks independently of the documentation comparison. Matching upstream prose and hashes can preserve an upstream error exactly. Use each module's own mapped contracts; DSP/renderer-specific checks apply only where relevant.

- Trace affected public options through validation, conversion/inheritance, command construction and native consumers on both platforms. Verify omissions, explicit zero values, defaults, conflicts and return values, not just accepted key names.
- Compare official explanations against the executing implementation, including shared DSP and each platform renderer where relevant. Report contradictory prose or native behavior with exact file/line and source commit, distinguishing newly introduced findings from pre-existing issues.
- Read test assertions and name the boundary they cover: validator acceptance/rejection, command conversion, shared DSP, native host rendering or device behavior. Passing validator parity is not renderer parity; passing structural tests is not proof that recipes or prose are correct.
- For `ti-synthengine`, check protected recipes against the public contract and envelope constraints. Check spatial opt-in/omission, inherited pan conflicts, fixed coordinates, FIR history/draining, sample-rate coverage and gain staging. Review source notes for the current test blind spots and unresolved iOS zero-envelope conversion issue; do not treat a previously green suite as resolution.
- State which claims still need device evidence (for example iOS rendering, perceptual localization, route behavior and CPU/latency). Do not change native code or silently redefine a public contract to hide a discrepancy during a documentation audit.

### Output per reference

```markdown
### CONTROLLERS.md

| Official section | Status | Notes |
|---|---|---|
| Controller lifecycle | Complete | |
| Event handling | Partial | Missing `removeEventListener` cleanup pattern |
| Conditional code | Complete | |
| Passing arguments | Missing | Not covered at all |

**Requirement evidence:** source file @ commit + section/lines → skill file + heading/lines for every ledger item; expand partial sections into their missing requirements.
**Condensed/combined examples:** source examples → destination; distinct behaviors preserved or missing.
**Consumer scenarios:** task, source-derived expected steps/branches, observed skill guidance, pass/fail/unverified and verification boundary.

**Author additions (not in official docs):**
- ES6+ migration tips section — valid enhancement, keep

**Suspected training-data content:**
- `$.args.getProperty()` method — does not exist in SDK, REMOVE
```

---

## Phase 3: Consolidated report

Aggregate all per-reference findings into a single report.

### Report structure

```markdown
## Audit report: <skill-name>

**Compared against:** `<upstream repo(s)>@<commit-hash(es)>`

### Overall health
- **References audited:** X of Y
- **Source documents/sections accounted for:** X of Y; exclusions/delegations listed below
- **Requirement ledger:** complete X; partial X; missing X; unverified X; delegated X; excluded X
- **Verdict:** complete / incomplete / partial audit (state exact scope)
- **Critical gaps:** X sections completely missing
- **Training-data contamination:** X instances found

### Priority fixes (must fix)
1. [reference] Section X — completely missing, covers core functionality
2. [reference] Method Y — hallucinated, does not exist in SDK
3. [reference] Required configuration target, prerequisite or platform warning omitted, even within an otherwise complete section

### Recommended updates (should fix)
1. [reference] Section X — partial, missing Z examples
2. [reference] Code examples — need ES6+ update

### Low priority (nice to have)
1. [reference] Could add cross-reference to related skill
2. [reference] Formatting/readability improvement without changed requirements

### Coverage evidence
- Source-first ledger with exact locators and all unresolved items
- Explicit exclusions/delegations, reasons and verified destinations
- Consumer scenarios and distinct example behaviors: pass/fail/unverified
- Source-document omissions vs skill-summary omissions vs unsupported author claims

### Author additions to preserve
1. [reference] Section X — valid enhancement beyond official docs

### Native evidence and limits (module skills)
- Snapshot/mirror fidelity: ...
- Official claims checked against native implementation: ...
- Validator, command-conversion, DSP and renderer checks: ...
- Unresolved upstream discrepancies and device-only verification: ...
- Explicitly excluded upstream docs and reasons: ...

### Estimated effort
- Full rewrite of X references
- Targeted updates to Y references
- Total reference files to modify: Z
```

---

## Phase 4: User approval gate

> **STOP. Do NOT proceed past this phase without explicit user approval.**

For a read-only audit, deliver the report and stop without asking to apply changes. If the user already explicitly authorized the proposed in-scope updates, record that authorization and continue; do not request the same permission again. Otherwise present the concrete proposed changes below and obtain approval. Deferred items remain visible in the coverage verdict.

### Present to the user

1. The consolidated report from Phase 3.
2. Ask: *"Should I proceed with these updates? You can also:"*
   - Adjust priorities
   - Skip certain references
   - Request full rewrite vs targeted edits for specific files
   - Add additional items you've noticed

### Wait for one of

- **"Proceed"** / **"Go ahead"** / **"Aplica"** — Continue to Phase 5
- **"Skip X"** — Remove items from the update list
- **"Rewrite X"** — Force full rewrite of specific references
- **"Cancel"** — Stop the audit; the report can stay as a notes file for future reference

---

## Phase 5: Apply updates

Execute the approved changes from Phase 4.

### Decision: rewrite vs targeted edit

For each reference file, decide the approach:

| Condition | Approach |
|---|---|
| Structure cannot hold the mapped requirements or heavy contamination | **Full rewrite** — re-read source, preserve verified content and close every ledger item |
| Missing requirements fit existing structure | **Targeted additions** — add necessary steps, branches and examples |
| Local factual/wording errors | **Targeted edits** — correct with source evidence |
| Training-data contamination found | **Full rewrite** of affected sections at minimum |

### Applying updates

> **Use parallel agents for this phase.** Each reference file update is independent.

For each reference file being updated:

1. **Re-read the official source** — never write from memory of Phase 2.
2. **Apply the changes** based on the approach:
   - **Full rewrite**: Use the `Write` tool to replace the entire file.
   - **Targeted additions**: Use the `Edit` tool to add sections.
   - **Targeted edits**: Use the `Edit` tool for specific corrections.
3. **Preserve author additions** flagged in Phase 2 (unless the user said to remove them).
4. **Apply quality standards** from `quality-standards.md`:
   - ES6+ code style
   - No dead URLs
   - English only
   - Practical code examples
5. **Update the ledger** to the final skill destinations. Preserve the scope of each example and all required behavior when modernizing it. Split oversized files and repair routing instead of shortening away requirements. Follow declared byte-identical mirror/asset rules where applicable.

### Preservation rules

When updating references, preserve:

- **Author additions** marked as valid in Phase 2
- **Cross-references** to other references in the skill
- **Platform-specific warnings** (even if not in official docs)
- **ES6+ style updates** already applied to examples

When updating references, remove or fix:

- **Training-data contamination** (hallucinated methods, wrong parameters)
- **Dead URLs** (`docs.appcelerator.com`, etc.)
- **Duplicate content** (same info in multiple sections)
- **Outdated patterns** (`var`, `Ti.include`, etc.) only in curated/transformable content, preserving semantics; byte-identical mirrors/assets retain the declared source policy

---

## Phase 6: Post-audit verification

Verify the updates are correct and complete.

### Steps

1. **Reconcile the entire coverage ledger against the final references.** Re-read each changed source/skill pairing, confirm all remaining destinations, and record final statuses. Recheck prerequisites, every required target, ordering, contract details, warnings and platform/version branches in every changed example. Compare pre/post requirements to detect information lost during rewriting. Hash equality, headings, line counts and a 2–3-file spot-check cannot replace this semantic closure.

   Replay the consumer scenarios using only the final skill and its available reference routes. Record source-derived expected behavior, actual instructions and pass/fail/unverified results. Syntax/build/contract checks support only the boundaries they exercise; do not claim device behavior from a documentation walkthrough. Supplement with spot-checks for readability and preserved author additions.

   **Completion gate:** report complete only when every in-scope requirement is complete or verified delegated, exclusions are explicit and justified, and no partial/missing/unverified requirement or failed/unverified guidance scenario remains. User-deferred gaps stay listed in an incomplete/partial verdict. Missing device evidence limits runtime claims; it does not by itself invalidate verified documentation coverage.

2. **Verify `SKILL.md`** — does the quick reference table still match the reference files?
   - Were any reference files added or removed?
   - Does the description still accurately reflect the skill's scope?

3. **Check file sizes:**
   ```bash
   wc -l skills/<skill-name>/SKILL.md
   wc -l skills/<skill-name>/references/*.md
   ```
   - `SKILL.md` should be under 500 lines.
   - References should be under 800 lines each.

4. **Verify cross-references and orphaned content** (see subsection below).

5. **For native module snapshots**, rerun the mapped read-only snapshot checker and verify source/mirror hashes, declared exclusions and transformations after all edits. Validate preserved curated content and links separately. Run applicable contract/DSP/renderer checks from the reviewed module checkout, recording what each proves and which device checks remain. For `ti-synthengine`, keep the one-sample iOS zero attack/release discrepancy reported until command construction or renderer evidence establishes its resolution; validator results alone do not do so.

### Step 4 — Cross-reference and orphan-content verification

Whenever Phase 5 moves a section from one reference to another, splits one ref into two, or renames a section heading, run **every** check below. The classic failure mode is a stale `(./other-ref.md#anchor)` link to a heading slug that no longer exists in the target file. The audit's *external* comparison (skill vs upstream docs) stays green even if the *internal* cross-refs broke — `wc -l`, the spot-check, and any compiler will all miss it, because Markdown renders broken anchors as valid links that simply jump nowhere.

This step is **non-negotiable** when any of these happened during Phase 5:

- A `##` or `###` heading was deleted, renamed, or moved to a different file
- A reference file was renamed, split, or created from scratch
- A reference file was effectively "stubbed" (full content replaced by a short pointer)

For each moved/renamed/stubbed section `<X>`:

1. **Grep for residual content of `<X>` in every other ref of the same skill:**
   ```bash
   grep -rln "<command-name-or-distinctive-phrase>" skills/<skill-name>/ \
     | grep -v "<destination-file>"
   ```
   Classify each hit as **cross-reference** (link or one-line mention — keep), **workflow invocation** (uses the API/command but doesn't document it — keep), or **duplicate documentation** (same content lives in two places — fix by deleting the older copy and replacing it with a link to the destination).

2. **List every anchor link that targets the modified file:**
   ```bash
   grep -rnE "<modified-file>\.md#[a-z0-9-]+" skills/<skill-name>/
   ```

3. **List every heading still present in the modified file:**
   ```bash
   grep -nE "^(## |### )" skills/<skill-name>/references/<modified-file>.md
   ```
   GitHub-flavored markdown slugs are: lowercase, spaces → `-`, drop backticks/punctuation. Example: ``## `Alloy.Collections` API`` → `#alloycollections-api`.

4. **Validate each anchor against the slug list from sub-step 3.** Any link whose anchor is not in the slug list is **broken** — repoint to the new heading, or to a more appropriate ref entirely if the content moved cross-file.

5. **Verify `SKILL.md`'s quick reference table** lists every current `references/*.md` file, with descriptions that match the file's actual content (not the pre-restructure scope). Cross-check anchors in `SKILL.md` against the same slug list from sub-step 3.

Output:

```markdown
### Cross-reference verification: <skill-name>
- Residual content grep: __ refs touched, __ classified as cross-reference, __ classified as duplicate (fixed)
- Anchors entering modified files: __ total, __ valid, __ broken (fixed: list paths)
- SKILL.md quick reference table: in sync / drift (description: …)
```

A clean output is `0 broken anchors, 0 duplicates, table in sync`. Anything else must be fixed before declaring the audit done.

---

### Remind the user

- One commit per audited skill, naming the source it was aligned to: `audit(ti-api): align refs with apidoc 13_4_1_GA`, `audit(ti-howtos): align refs with titaniumsdk.com <commit>`.
- Mention the upstream commit hash from Phase 0a in the commit body or PR description.
- If changes are substantial, surface them in the PR description so reviewers see the diff context.
- If the cross-reference step fixed any broken anchors, call them out in the commit body so a reviewer can sanity-check the new link targets.
