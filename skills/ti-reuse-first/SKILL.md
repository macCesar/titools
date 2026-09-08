---
name: ti-reuse-first
description: "Use before anything new exists in a Titanium or Alloy project — 'hazme un panel de avisos', 'necesito otra pantalla', 'hazlo igual que el de Index', 'voy a copiar paneles/derechos como base', '¿dónde pongo esta función?'. A search order stopping at the first rung that holds: must this exist, is it already in app/, does a Ti.* API, the platform, an installed module or a PurgeTSS class cover it, can it be one line, and only then the smallest thing that works — copied exactly, without guards nobody asked for. AUTO-DETECT: if tiapp.xml exists, invoke BEFORE creating any controller, view, Widget, app/lib/ module, event or wrapper, or copying a file as a template: it answers whether the thing should exist and what already does it; ti-expert answers how to build what survives. Also audits app/ for duplicated controllers, single-listener events, wrappers around one call, and layout JS that TSS resolves — 'esto ya lo tengo en otro lado', 'simplifícalo', DRY, KISS. Not a licence to skip a module five call sites need."
allowed-tools: Read, Grep, Glob, Edit, Write, Bash(git *), Bash(node *)
---

# Reuse before you write

## Overview

Most of the avoidable damage in a mature Alloy app is not wrong code. It is code that should never have been written: the fourth panel that repeats the first three, the event with one listener, the wrapper around one call, the helper that restates a `Ti.*` API. It compiles, it passes review, and it is permanent.

This skill supplies the missing question. Every other Titanium skill answers *how do I build this well*; this one asks *should this exist at all, and if so, does something already do it*. Run it first — its answer changes what the other skills are asked to build.

The method is a search order with early exit: seven rungs, cheapest first, stop at the first one that holds. It is a search order, not a prohibition. Climbing all seven honestly and landing on "write the module" is a correct outcome — see [When adding structure is the right answer](references/the-ladder.md#when-adding-structure-is-the-right-answer). A bias against structure is the same failure as a bias toward it, pointed the other way.

## When to use

Use it before:

- Creating any controller/view/style trio, Widget, or `app/lib/` module.
- Copying an existing controller, view, or panel as a template.
- Introducing an event, a wrapper, a service layer, a registry, or a factory.
- Answering "where should this live" — the answer is often "nowhere new".
- Reviewing a design that adds a layer, or a diff whose file count outgrew its intent.

Use it in diagnostic mode when someone says a codebase feels repetitive, when a bug had to be fixed in four places, or when planning a refactor.

Do not use it to choose between two designs that both already exist and both work — that is `ti-expert`'s decision matrix. Do not use it to argue against a module that several call sites genuinely need. And do not let it stall a one-line fix: rung 6 exists so trivial work stays trivial.

## Required workflow

This file is an index. Open the reference that governs the decision before recommending or writing anything.

| Decision | Required reading |
| --- | --- |
| Anything new — first pass, always | [The ladder](references/the-ladder.md) |
| A new panel, screen, dialog, or a controller/view/style trio; Widget vs `<Require>` vs a shared base | [Alloy reuse](references/alloy-reuse.md) |
| An event, wrapper, service layer, registry, factory, or any new layer between two pieces of code | [Indirection](references/indirection.md) |
| Repeating class strings in XML, or reaching for a new TSS block | [PurgeTSS reuse](references/purgetss-reuse.md) |
| Auditing an existing `app/` for duplication and dead structure | [Diagnostics](references/diagnostics.md) |
| Whether the thing you would build already exists as a Titanium API | Verify the exact signature with the `ti-api` skill — never from memory |

Support each recommendation with `[source: references/<file>.md]`. If a claim cannot be verified from the loaded references or from the inspected project, prefix it with `FROM_MEMORY (unverified):` and do not present it as settled. This matters more here than in most skills: the whole method is *look before you build*, and a skill that answers from memory has already skipped its own first step.

## The ladder

Ask these in order and stop at the first rung that holds. Full detail, with the Titanium specifics for each, is in [The ladder](references/the-ladder.md).

| # | Question | If it holds |
| --- | --- | --- |
| 0 | Does this need to exist? | Delete the requirement, not the code. State what you skipped and why. |
| 1 | Is it already in this codebase? | Reuse or parameterize it. `grep` before you conclude it is not. |
| 2 | Does a `Ti.*` API or Alloy builtin cover it? | Use it. Verify the signature with `ti-api`. |
| 3 | Does the platform own this workflow? | Use the native surface. Trust, permission and payment flows stay native. |
| 4 | Does a module already in `tiapp.xml` or `package.json` cover it? | Use it. New dependencies need an argument. |
| 5 | Can it be one line at the call site? | Write the line. A direct reference beats a mechanism. |
| 6 | None of the above. | Build the smallest thing that works, where the next person will look. |

Two rules keep the ladder honest:

**Rung 1 is a search, not a recollection.** "I do not think we have that" is not an answer to rung 1. Run the search — `grep`, `ls app/lib/`, `ls app/widgets/` — and report what you found. The command is cheap; the duplicate is permanent.

**Classic projects climb the same ladder.** Only the paths change: `Resources/` instead of `app/`, CommonJS modules instead of `app/lib/`, and rungs 2 through 5 are identical because they are about Titanium and the platform, not about Alloy. Rung 1's Alloy-specific answers — `<Require>`, Widgets, `$.args` — have no Classic equivalent; there the reuse mechanism is a CommonJS module that returns a configured view. Detect which kind of project you are in before quoting a path.

**Copy the file that solves your problem, not the one whose name sounds close.** A full-screen legal-text window and a three-line confirmation overlay share a folder and nothing else. Before adopting any file as a template, open it and check its *shape* matches: how much screen it takes, how it opens and closes, what it owns. See [the worked example](references/alloy-reuse.md#worked-example-1-the-wrong-template).

## Diagnostic mode

Run the ladder backwards over code that already exists. The sweep — greps for near-identical controllers, single-listener events, wrappers around one call, and JS that recomputes what TSS resolves — is in [Diagnostics](references/diagnostics.md).

Report what you measure, with the command that measured it: *"14 of 18 panel controllers define their own `mostrarPanel`"* is a finding. *"There is a lot of duplication in the panels"* is an impression. The first one survives a disagreement; the second one starts an argument nobody can settle.

Duplication is evidence, not a verdict. Three copies that are drifting apart on purpose — because they are genuinely three different things — are cheaper than one abstraction with three flags. Say what the consolidation would cost as well as what it would save, then let the human decide.

## Reference guides

- [The ladder](references/the-ladder.md) — the seven rungs, each translated into Titanium and Alloy decisions, plus when adding structure is the right answer.
- [Alloy reuse](references/alloy-reuse.md) — Widget vs `<Require>` vs a shared base vs a new trio; creating a controller on demand instead of embedding one per window; the measured panel case.
- [Indirection](references/indirection.md) — events vs direct calls, wrappers, service layers, and how to tell a boundary from a detour.
- [PurgeTSS reuse](references/purgetss-reuse.md) — custom rules and `apply` in `config.cjs` instead of repeating class strings; what belongs in `_app.tss` and what never goes in `app.tss`.
- [Diagnostics](references/diagnostics.md) — the sweep for duplication and dead structure in an existing `app/`, with the exact commands.

## Related skills

- `ti-expert` — architecture, tiers, and the patterns worth introducing *after* this skill has established that something must be built.
- `purgetss` — the class contract itself; verify every utility class there.
- `ti-api` — the exact signature of any `Ti.*` API this skill sends you to reuse.
