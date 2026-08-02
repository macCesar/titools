---
name: ti-audit
description: Audit Titanium project for anti-patterns, memory leaks, and best practice violations
---

Audit the current Titanium project by invoking the relevant TiTools skills:

1. Invoke `ti-expert` — check for architecture anti-patterns, memory leaks (missing event listener cleanup), and code conventions
2. Invoke `ti-ui` — check for UI anti-patterns (Ti.UI.SIZE in ListViews, WebView inside TableView, missing accessibility)
3. If PurgeTSS project, invoke `purgetss` — check for custom TSS that should be utility classes, unsupported classes, padding on Views
4. Invoke `alloy-guides` — check for proper Alloy patterns (model usage, widget structure)

Report findings grouped by severity: critical, warning, info.
