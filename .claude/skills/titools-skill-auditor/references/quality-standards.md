# Quality standards

Shared rules the auditor must follow when reviewing or updating any doc-based skill in this repo. Load this file first before executing the audit workflow.

---

## Anti-hallucination protocol

Every fact in a skill's reference must be traceable to an official source.

### The 5 rules

1. **Read before writing** — Never write content for a section without first reading the official source for that section in the current session. "I remember what it says" is not sufficient.
2. **Verify every method/property** — If a Titanium API method, property, or event is referenced, verify it exists in the official docs. Common hallucination: methods that sound plausible but don't exist (e.g. `$.args.getProperty()`, `Ti.App.getArguments()`).
3. **Verify every parameter** — If a method's parameters are documented, verify the parameter names, types, and defaults against the official source. Common hallucination: extra parameters that don't exist.
4. **No training-data backfill** — If the official docs don't cover a topic, do not fill the gap with training-data knowledge. Either skip the topic or clearly mark it as an author addition (see "Protected sections" below).
5. **Re-read for each reference** — When updating multiple reference files, re-read the source for each one. Don't rely on memory from reading a different reference's source.

### How to detect training-data content

Signs that content came from training data rather than official docs:

- **Overly generic advice** — "Always handle errors properly" without specific Titanium context
- **Methods that don't match SDK** — Check against `.titanium-sdk/apidoc/` if unsure; that YAML is what the SDK team edits
- **Perfect-sounding examples** — Too clean, too simple, or using patterns not in official docs
- **Advice about features that don't exist** — e.g. built-in dependency injection, official plugin system
- **Mixing frameworks** — React Native patterns, Cordova patterns, or web patterns applied to Titanium
- **Wrong event names** — Events that sound right but aren't in the SDK (verify in API docs)

### When in doubt

If unsure whether something is from official docs or training data:

1. Grep the official docs for the term
2. If not found, flag it explicitly to the user as unverified
3. Never include unverified content silently

---

## Code style

Modernization must preserve behavior, binding, event payloads, execution order and cleanup. Keep a regular function when an arrow would change required `this` behavior. Byte-identical official mirrors and example assets follow their declared source transformations instead of the general style rules below.

Curated examples and source copies with permitted syntax transformations use modern ES6+ JavaScript under that preservation rule.

### Pattern replacements

| Old pattern | ES6+ replacement |
|---|---|
| `var x = ...` | `const x = ...` or `let x = ...` |
| `function (e) { ... }` (callback) | `(e) => { ... }` |
| `function name () { ... }` (reusable) | Keep as `function name () { ... }` |
| `obj = { method: function () {} }` | `obj = { method () {} }` |
| `'string' + variable` | `` `string ${variable}` `` |
| `Ti.include('file.js')` | `require('/file')` or ES6 `import` |
| `var self = this` | Arrow function (no `self` needed) |

### Style rules

- Use `const` by default, `let` only when reassignment is needed
- Never use `var`
- Arrow functions for callbacks that do not require dynamic `this`
- Keep `function` declarations for named reusable functions
- Use template literals for string concatenation
- Use destructuring where it improves readability
- Use shorthand property names: `{ name, age }` not `{ name: name, age: age }`

---

## URL rules

### Dead domains — never link to these

| Domain | Status | Replacement |
|---|---|---|
| `docs.appcelerator.com` | Dead | Use relative refs or cache paths |
| `wiki.appcelerator.com` | Dead | Use relative refs or cache paths |
| `jira.appcelerator.com` | Dead | Reference ticket numbers only (e.g. `TIMOB-12345`) |
| `developer.appcelerator.com` | Dead | Use relative refs |

### URL handling

- **Internal cross-references**: Use relative markdown links: `[Topic](../other-reference.md)` or `[Topic](./same-dir.md)`.
- **External URLs**: Only include if verifiable as live. When in doubt, describe the resource without linking.
- **GitHub URLs**: Acceptable when pointing to specific files in maintained repos under `tidev/`.
- **Generated API docs**: May contain broken URLs (known upstream issue). Flag but do not try to fix upstream URLs.

---

## Content rules

### Language

- **English only** — All content must be in English.
- No mixed-language content.
- Technical terms may remain in their original form (e.g. `Alloy`, `Backbone.js`).

### File size limits

| File type | Max lines | Action if exceeded |
|---|---|---|
| `SKILL.md` | 500 | Move detailed content to references |
| Reference file | 800 | Split into two focused references |

Size limits govern organization, not source coverage. Split and link references instead of deleting required information to fit a line/token budget.

### Semantic completeness

A concise reference must let a consumer make the same supported decisions and complete the same documented tasks as the in-scope official sources. It need not reproduce their wording, screenshots, repeated prose or every syntactically similar example.

For each source section, preserve and locate in the coverage ledger:

- Prerequisites, dependencies, permissions, configuration files and **every required target** (activity, platform, device class or build variant).
- Required steps, their order and when settings take effect (build time, before creation/open, or runtime).
- API names/signatures, accepted values, units, defaults, returns/events, error cases and conflicting options.
- Platform/version/device differences, limitations, deprecations, warnings and failure consequences.
- Lifecycle, ownership, cleanup, performance constraints and distinct behaviors demonstrated by examples.

**Allowed condensation:** equivalent examples may be combined when all distinct branches and requirements survive; tables may replace prose; repeated facts may have one canonical destination with verified links. Record where each distinct behavior went.

**Material omissions:** dropping one required activity from a multi-activity configuration, replacing a multi-step integration with a property name, losing an opt-in/default distinction, or removing a platform caveat while retaining the happy path. These are coverage defects even if every heading exists and most lines were retained.

If a source is wrong or obsolete, record the exact discrepancy and the current authoritative evidence; preserve the applicable task with corrected guidance and provenance. Do not silently copy an error or silently erase the entire topic. If sources are unavailable, record unverified coverage. If a necessary prerequisite belongs to another domain, map the dependency to the relevant skill/reference; do not invent missing module guidance.

Declared exclusions need an item-level reason and a destination when delegated. A technical requirement cannot be excluded merely for brevity, familiarity, age, duplication without a verified destination, or absence from a newer condensed page. Unresolved in-scope requirements prevent a complete verdict.

### Permitted enhancements beyond official docs

- **Platform-specific warnings** — `> **Warning:**` blocks for known pitfalls
- **ES6+ code updates** — Modernizing old `var`-style examples
- **Table formatting** — Converting prose lists to tables for clarity
- **Cross-references** — Links to related references within the same skill
- **Practical tips** — Brief "in practice" notes from real-world Titanium development
- **Deprecation notices** — Noting deprecated APIs or patterns

### Prohibited additions

- **Training-data content** — Information not traceable to an official source
- **Opinion-as-fact** — Presenting personal preferences as requirements
- **Other framework patterns** — React, Vue, Angular patterns applied to Titanium
- **Unverified workarounds** — "Try this, it might work" without official backing
- **Future speculation** — "This will probably change in SDK X.Y"

### Protected sections — do NOT remove during audits

Sections titled `## Community-Discovered Patterns` contain verified real-world behavior that is **not present in official documentation**. These sections:

- Are clearly marked and separated from official-source content
- Have been verified against actual SDK behavior
- Fill gaps where official docs are silent or incomplete
- Must be **preserved during audits** — they are not training-data contamination

During an audit you may:

- **Update** a community pattern if upstream docs now cover it (move to the main section and cite the source).
- **Add** new community patterns when verified gaps are found.
- **Never delete** a community pattern just because it has no official source — that is the entire point of the section.

---

## Titanium ecosystem context

Useful background to avoid errors in skill content.

- **Appcelerator Inc.** developed Titanium SDK and Alloy framework
- **Axway** acquired Appcelerator in 2016
- **TiDev** (community organization) maintains Titanium SDK since Axway discontinued commercial support in 2022
- **Documentation** at `docs.appcelerator.com` is dead. The canonical sources are `tidev/titanium-sdk:apidoc/` for the API and `tidev/titaniumsdk.com:content/docs/` for the guides. `tidev/titanium-docs` is the frozen predecessor, kept as an archive.
- **Alloy** remains actively maintained as the MVC framework for Titanium

### Skill dual purpose

Each doc-based skill serves two roles:

1. **Knowledge index** — Quick reference table in `SKILL.md` lets the agent identify which reference to read.
2. **Deep reference** — Reference files contain the actual detailed documentation.

`SKILL.md` should be scannable (tables, short descriptions). References should be comprehensive (full explanations, code examples, edge cases).

---

## File naming conventions

### Reference files

| Convention | When to use | Examples |
|---|---|---|
| `UPPER_CASE.md` | Major topic areas, primary references | `CONTROLLERS.md`, `MODELS.md`, `VIEWS_XML.md` |
| `lowercase-hyphens.md` | Subtopics, secondary references, specific features | `animation-system.md`, `grid-layout.md` |

### Choosing a convention

- Follow the existing convention within the skill being audited.
- Consistency within a skill matters more than a global rule.

---

## Quality checklist template

Reusable checklist for audits. Copy and fill in for each skill.

```markdown
### Quality checklist: <skill-name>

**Anti-hallucination:**
- [ ] Every section traces to an official source
- [ ] All methods/properties verified against API docs
- [ ] No training-data backfill detected
- [ ] Code examples come from official sources; modernization respects behavior and declared mirror/asset fidelity

**Coverage and usable summaries:**
- [ ] All in-scope source documents/sections inventoried, including unchanged and newly added material
- [ ] Each operational requirement has a source locator and verified skill destination
- [ ] Prerequisites, all configuration targets, steps/order, contracts and platform/version caveats preserved
- [ ] Combined examples retain every distinct behavior; changed examples checked for semantic equivalence
- [ ] Cross-skill dependencies resolve to usable references; source omissions remain distinguished from skill omissions
- [ ] Exclusions have explicit reasons; partial, missing and unread items remain in the verdict
- [ ] Final ledger reconciled in full; consumer scenarios verified with evidence and limits

**Code style:**
- [ ] Curated/transformable examples use modern style; byte-identical assets/mirrors retain source syntax
- [ ] Arrow callbacks preserve required binding and lifecycle semantics
- [ ] Permitted template-literal and other syntax updates preserve behavior

**URLs:**
- [ ] No links to dead domains
- [ ] Cross-references use relative markdown links
- [ ] External URLs verified as live

**Content:**
- [ ] English only
- [ ] SKILL.md under 500 lines
- [ ] All references under 800 lines
- [ ] No duplicate content across references
- [ ] Permitted enhancements clearly distinguishable from official content

**Structure:**
- [ ] SKILL.md has frontmatter, quick reference, summary
- [ ] Each reference has clear heading and single-topic focus
- [ ] Cross-references between related references exist
```
