---
name: titools-skill-auditor
description: Use when reference files for the doc-based skills in this repo need re-aligning with upstream Titanium SDK documentation — after a `tidev/titanium-docs` release, when an audit reveals stale or training-data content, or before tagging a skills version. Covers `ti-api`, `ti-guides`, `ti-howtos`, `alloy-guides`, and `alloy-howtos`. Maintenance-only — not intended for end-user Titanium projects.
metadata:
  internal: true
---

# titools-skill-auditor

Maintenance-only skill for auditing and updating the doc-based skills in this repo against their upstream documentation source ([`tidev/titanium-docs`](https://github.com/tidev/titanium-docs)).

For *creating* a new skill from scratch, use a generic skill-creator workflow instead.

## Scope

This skill audits the five reference skills:

- `ti-api`
- `ti-guides`
- `ti-howtos`
- `alloy-guides`
- `alloy-howtos`

It does **not** audit:

- Workflow skills like `ti-module-update` (no single upstream doc tree to compare against)
- Skills outside the `skills/` folder

## Setup

Audits compare reference files against a local clone of `tidev/titanium-docs` at `.titanium-docs/` in the repo root. The folder is gitignored.

If `.titanium-docs/` is missing, fetch it before auditing:

```bash
git clone --depth 1 https://github.com/tidev/titanium-docs.git .titanium-docs
```

To refresh before an audit:

```bash
cd .titanium-docs && git pull --ff-only && cd ..
```

## Invocation

Parse `$ARGUMENTS` to determine which skill to audit:

| Input | Action |
|---|---|
| `<skill-name>` | Audit the named skill against its mapped doc subtree |
| *(empty)* | Ask the user which skill to audit |

Valid skill names: `ti-api`, `ti-guides`, `ti-howtos`, `alloy-guides`, `alloy-howtos`.

## Audit workflow

1. Load [quality-standards.md](references/quality-standards.md) and [source-map.md](references/source-map.md).
2. Verify `.titanium-docs/` exists. If not, prompt the user with the clone command above.
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
3. **Commit per skill** — one focused commit per audited skill, e.g. `audit(<skill>): align refs with titanium-docs <date or commit>`.
4. **Mention in the PR description** if changes are substantial, so reviewers see the diff context.
