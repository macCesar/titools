---
name: alloy-guides
description: Use when writing or reviewing Titanium Alloy XML views, TSS styles, controllers, models and collections, persistent list binding, widgets or build-time themes. Applies to app/views, app/styles, app/controllers and app/models. Uses the current official Titanium guides; Alloy is a compiler over the Titanium API, not web MVC.
---

# Alloy guides

Use this skill for Alloy screen structure, styling, controller lifecycle, persistent data and reusable widgets. Load the relevant reference before writing code.

| Task | Reference |
| --- | --- |
| MVC, project directories and generated output | [Concepts](references/CONCEPTS.md) |
| Arguments, opening windows, shared modules and cleanup | [Controllers](references/CONTROLLERS.md) |
| Model definition, ListView binding, filters and transforms | [Models](references/MODELS.md) |
| Persistence choices and schema migrations | [Persistence](references/MODELS_ADVANCED.md) |
| XML, IDs, namespaces, conditional elements and composition | [Views](references/VIEWS_XML.md) |
| TSS selectors, precedence, queries and build-time themes | [Styles](references/VIEWS_STYLES.md) |
| Runtime class changes and their required class tracking | [Dynamic styles](references/VIEWS_DYNAMIC.md) |
| Creating, declaring, using and isolating widgets | [Widgets](references/WIDGETS.md) |
| Creating, converting and running an Alloy app | [App workflow](references/CLI_TASKS.md) |
| PurgeTSS integration, with its independent source | [PurgeTSS](references/PURGETSS.md) |

Keep XML, TSS and JavaScript in their corresponding `app` directories. `Resources/` and `build/` are generated; do not edit or commit them. A controller creates its views but does not automatically open a Window. Read `$.args` at the top, export deliberate operations and clean up listeners/subscriptions separately from `$.destroy()`.

For configuration, compiler constants, hooks and debugging use `alloy-howtos`. For API signatures and platform availability use `ti-api`. Use `ti-guides` for toolchain, native modules and distribution, `ti-howtos` for service setup, and `ti-ui` for current Titanium layout and list behavior.

The current guide pages are at [titaniumsdk.com/docs/alloy.md](https://titaniumsdk.com/docs/alloy.md). References include released-compiler caveats where a published recipe conflicts with released behavior. PurgeTSS keeps its own source and is outside the official Alloy guide refresh.
