---
name: ti-new-screen
description: Create a new Alloy screen (controller + view + style) following project conventions
argument-hint: "<screenName>"
---

Create a new Alloy screen with the given name. Before creating files:

0. Invoke the `ti-reuse-first` skill and confirm the screen has to be new. Run rung 1 against this project: list `app/controllers/` and `app/widgets/` and check whether an existing screen covers the case with a parameter, or whether a `<Require>` into an existing window is enough. If the answer is that an existing screen should be parameterized instead, say so, name it, and **stop** — do not generate the trio. Only continue when a new screen is genuinely the answer.
1. Invoke the `alloy-guides` skill to follow Alloy MVC patterns
2. If PurgeTSS is detected (purgetss/ folder exists), invoke the `purgetss` skill — all styling MUST use utility classes in the XML, NOT custom TSS
3. If PurgeTSS is detected, invoke the `ti-ui` skill for layout patterns

Create these files:
- `app/views/$ARGUMENTS.xml` — Alloy XML view with PurgeTSS utility classes
- `app/controllers/$ARGUMENTS.js` — Controller with proper event cleanup
- `app/styles/$ARGUMENTS.tss` — Empty or minimal (PurgeTSS handles styling)

Follow the existing screens in the project as examples for conventions.
