---
name: ti-new-screen
description: Create a new Alloy screen (controller + view + style) following project conventions
argument-hint: "<screenName>"
---

Create a new Alloy screen with the given name. Before creating files:

1. Invoke the `alloy-guides` skill to follow Alloy MVC patterns
2. If PurgeTSS is detected (purgetss/ folder exists), invoke the `purgetss` skill — all styling MUST use utility classes in the XML, NOT custom TSS
3. If PurgeTSS is detected, invoke the `ti-ui` skill for layout patterns

Create these files:
- `app/views/$ARGUMENTS.xml` — Alloy XML view with PurgeTSS utility classes
- `app/controllers/$ARGUMENTS.js` — Controller with proper event cleanup
- `app/styles/$ARGUMENTS.tss` — Empty or minimal (PurgeTSS handles styling)

Follow the existing screens in the project as examples for conventions.
