---
name: titools-skill-auditor
description: Use when reference files for the doc-based skills in this repo need re-aligning with their upstream sources — after a Titanium SDK, Alloy, or PurgeTSS release; when an audit reveals stale or training-data content; or before tagging a TiTools version. Covers the five Titanium documentation skills plus `purgetss`. Maintenance-only — not intended for end-user Titanium projects.
metadata:
  internal: true
---

# titools-skill-auditor

Maintenance-only skill for auditing and updating the doc-based skills in this repo against their official upstream documentation and source repositories.

For *creating* a new skill from scratch, use a generic skill-creator workflow instead.

## Scope

This skill audits six reference skills:

- `ti-api`
- `ti-guides`
- `ti-howtos`
- `alloy-guides`
- `alloy-howtos`
- `purgetss`

It does **not** audit:

- Workflow skills like `ti-module-update` (no single upstream doc tree to compare against)
- Skills outside the `skills/` folder

## Setup

Four caches, all gitignored, all symlinks or clones at the repo root.

| Cache | Repo | Serves |
|---|---|---|
| `.titanium-sdk` | `tidev/titanium-sdk` | `ti-api` — `apidoc/` is the canonical API source |
| `.titaniumsdk-site` | `tidev/titaniumsdk.com` | the four guide skills (`content/docs/`) and the release cross-check (`registry/sdk/`) |
| `.titanium-docs` | `tidev/titanium-docs` | the frozen archive, additive only |
| `.purgetss-docs` + `.purgetss-source` | `macCesar/purgetss-docs`, `macCesar/purgeTSS` | `purgetss` |

Read `references/source-map.md` § "Precedence" before any audit. Which root wins is not a preference; an audit that reads the archive first reports green against a corpus that stopped moving.

If a cache is missing, clone it. Full clones for the two live Titanium repos: the API audit needs release tags, and the site's history explains why a page says what it says.

```bash
git clone https://github.com/tidev/titanium-sdk.git .titanium-sdk
git clone https://github.com/tidev/titaniumsdk.com.git .titaniumsdk-site
git clone --depth 1 https://github.com/tidev/titanium-docs.git .titanium-docs

git clone --depth 1 https://github.com/macCesar/purgetss-docs.git .purgetss-docs
git clone --depth 1 https://github.com/macCesar/purgeTSS.git .purgetss-source
```

On the maintainer's machine these are symlinks to existing checkouts, `.titaniumsdk-site` among them pointing at the `macCesar/titaniumsdk.com` fork. A fork is fine to read from, but confirm it is not behind before trusting it as a source:

```bash
git -C .titaniumsdk-site fetch upstream && git -C .titaniumsdk-site log --oneline HEAD..upstream/main
```

To refresh before an audit:

```bash
for c in .titanium-sdk .titaniumsdk-site .titanium-docs .purgetss-docs .purgetss-source; do
  git -C "$c" pull --ff-only
done
```

Record in the audit report which commit of each cache the audit read, and for `ti-api` the SDK **tag** it was anchored to. `main` currently declares `14.0.0` and carries unreleased APIs.

## Invocation

Parse `$ARGUMENTS` to determine which skill to audit:

| Input | Action |
|---|---|
| `<skill-name>` | Audit the named skill against its mapped doc subtree |
| *(empty)* | Ask the user which skill to audit |

Valid skill names: `ti-api`, `ti-guides`, `ti-howtos`, `alloy-guides`, `alloy-howtos`, `purgetss`.

## Audit workflow

1. Load [quality-standards.md](references/quality-standards.md) and [source-map.md](references/source-map.md).
2. Verify the cache(s) required by the selected skill exist. If not, prompt the user with the matching clone command above.
3. Execute Phases 0–3 of [audit-workflow.md](references/audit-workflow.md) (classify, analyze, identify gaps, report).
4. **Phase 4 is a hard STOP** — present the consolidated report and wait for explicit user approval.
5. After approval, execute Phases 5–6 (apply updates, verify).

---

## Protected content — NEVER delete during audits

Any section titled `## Community-Discovered Patterns` (H2) in a skill's reference file contains verified real-world patterns that are intentionally **not** in the official docs. These sections fill gaps where official docs are silent or incomplete.

### Rules during audits

- **NEVER delete** a Community-Discovered Patterns section, even when it lacks an official source.
- **Verify every pattern against current docs** — if officially documented now, move the content to the main section and cite the source (don't leave duplicates). If SDK behavior changed, update the pattern. Outdated patterns are as harmful as hallucinated ones.
- **Preserve** patterns that remain uncovered by official docs.
- **Add** new patterns when verified gaps are found — see `audit-workflow.md` Phase 2 step 5 for how to classify unlabeled author content.

See `references/quality-standards.md` § "Protected sections" for the full rule set.

---

## Skill structure convention

Every doc-based skill in this repo follows this layout:

```
skills/<skill-name>/
  SKILL.md                # Entry point (~200–500 lines)
  references/
    TOPIC_ONE.md          # Deep reference (~200–800 lines each)
    TOPIC_TWO.md
    ...
```

### SKILL.md responsibilities

1. **Frontmatter** — `name`, `description` ("Use when…", third person), total ≤ 1024 chars
2. **Quick reference** — Topic → reference file mapping
3. **Summary content** — Enough context to answer simple questions without loading references
4. **When to load references** — Clear guidance on which reference to read for deeper topics

### Reference file responsibilities

1. **Single topic focus** — One reference = one coherent topic
2. **Self-contained** — Readable without SKILL.md context
3. **Code examples** — ES6+ style, practical and copy-pasteable
4. **Cross-references** — Use relative markdown links to related references within the same skill

---

## Reference file navigation

| Reference | Purpose |
|---|---|
| [audit-workflow.md](references/audit-workflow.md) | 7-phase audit with hard-stop approval gate |
| [quality-standards.md](references/quality-standards.md) | Anti-hallucination, ES6+, URL rules, content rules |
| [source-map.md](references/source-map.md) | Skill → official doc subtree mapping |

### Loading order

1. `quality-standards.md` — Internalize rules before evaluating content
2. `source-map.md` — Find the official docs to compare against
3. `audit-workflow.md` — Follow phases sequentially

---

## Post-completion reminder

After completing an audit:

1. **Spot-check** — open 2–3 updated references and verify content quality.
2. **Test invocation** — verify the updated skill loads correctly in Claude Code (or the agent of choice).
3. **Commit per skill** — one focused commit per audited skill, naming the source: `audit(ti-api): align refs with apidoc 13_4_1_GA`.
4. **Mention in the PR description** if changes are substantial, so reviewers see the diff context.
