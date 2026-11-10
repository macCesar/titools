---
name: alloy-howtos
description: Use when working on current Titanium Alloy app creation and conversion, config.json runtime settings, environment/platform overrides, compiler constants, widget dependencies, Backbone selection, alloy.jmk hooks, LiveView and build/runtime debugging. Applies to Alloy projects with app/views, app/controllers and app/config.json.
---

# Alloy workflows and configuration

Load the relevant reference before changing an Alloy project's configuration or workflow.

| Task | Reference |
| --- | --- |
| Current conventions, ownership and cleanup | [Practical conventions](references/best_practices.md) |
| App creation, conversion and supported guide workflows | [CLI workflow](references/cli_reference.md) |
| config.json, constants, dependencies, themes and hooks | [Configuration](references/config_files.md) |
| Build errors, logs, breakpoints, LiveView and profiling | [Debugging](references/debugging_troubleshooting.md) |
| A complete screen and links to persistent-list/widget examples | [Examples](references/samples.md) |

Run `ti info` before diagnosing a toolchain failure as an Alloy defect. Keep secrets out of config files and release logs. Configuration is compiled into the application; environment changes require a build. LiveView handles JavaScript changes, while native configuration/modules require rebuilding.

The currently published configuration page has release-sensitive details. Read the configuration reference's verified caveats before relying on conflicting environment/platform values or selecting a build hook. Confirm the installed Alloy release with `alloy --version`.

Use `alloy-guides` for XML, controllers, TSS, models, migrations and widgets; `ti-guides` for SDK setup, modules and distribution; `ti-api` for exact API/platform contracts; and `ti-ui` for native layout/list behavior.

Sources: [current Alloy guides](https://titaniumsdk.com/docs/alloy.md), [first app](https://titaniumsdk.com/docs/build/first-app.md), [debugging](https://titaniumsdk.com/docs/build/debugging.md).
