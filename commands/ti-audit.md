---
name: ti-audit
description: Audit Titanium project for anti-patterns, memory leaks, and best practice violations
---

Audit the current Titanium project by invoking every applicable TiTools skill. First inspect `tiapp.xml` and the project layout so conditional skills are not run against the wrong project type.

Core Titanium audit:

1. Invoke `ti-expert` — check architecture, navigation ownership, event/timer cleanup, memory leaks, bridge pressure, testing boundaries, adaptive layouts and code conventions.
2. Invoke `ti-guides` — check `tiapp.xml`, CommonJS/Hyperloop usage, Titanium CLI/build assumptions, memory and bridge guidance, distribution settings, and toolchain compatibility.
3. Invoke `ti-api` — verify every audited `Ti.*` API, event, property, constant and third-party module call against its exact signature. Do not report a suspected API defect from memory.
4. Invoke `ti-ui` when the project creates Titanium UI — check layouts, list performance, event bubbling, gestures, animations, accessibility, orientation and platform-specific UI.
5. Invoke `ti-howtos` when the project implements a native integration such as location, maps, push, camera, media, SQLite, HTTPClient, WebView, intents, Keychain/iCloud, Hyperloop or CI/CD — audit the complete integration and platform setup, not only the JavaScript call site.

Project-type audit:

6. If the project is Alloy (`app/views/`, `app/controllers/`, `app/styles/`), invoke `alloy-guides` — check controllers, XML/TSS, models, collections, widgets, sync adapters and cleanup patterns.
7. If the Alloy project uses `alloy.jmk`, `config.json`, `widget.json`, conditional views, custom XML tags or Alloy CLI workflows, invoke `alloy-howtos` — check configuration precedence, build hooks, generated structures and compilation/debugging conventions.
8. If the project uses PurgeTSS (`purgetss/`, `purgetss/config.cjs`, a PurgeTSS-generated `app.tss`, or `purgetss.{ui,colors,fonts}.js`), invoke `purgetss` and detect Alloy vs. Classic before applying findings. In Alloy, audit unsupported utility classes, padding on Views, unnecessary manual TSS, dynamic components, grids, icons and animations. In Classic, audit only the supported standalone asset/CommonJS commands and their `Resources/` outputs; do not require or recommend `alloy.jmk`, generated TSS, utility classes, or `$.UI.create()`.

Native-module audit:

9. If the project declares `ti.game`, invoke `ti-game` — check for sprites moved from timers instead of native properties, levels sized from `Ti.Platform.displayCaps` instead of the `resize` event, sprites added one by one instead of in one array, and timers or sounds left running when the window closes.
10. If the project declares `ti.synthengine`, invoke `ti-synthengine` — check strict option names and types, mutually exclusive pitch fields, valid envelope intersections, checked Boolean results, one clear lifecycle owner, delayed startup after layout, app-owned timer cancellation, and `shutdown()` cleanup.

If a conditional skill does not apply, record it as `not applicable` with the detected reason instead of inventing findings from it.

Report findings grouped by severity: critical, warning, info.
