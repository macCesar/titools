---
name: ti-guides
description: 'Use when working on current Titanium SDK fundamentals: environment setup, Classic or Alloy project creation and structure, tiapp.xml or timodule.xml configuration, native modules and npm dependencies, Hyperloop, app signing/distribution, Titanium CLI commands/configuration, local persistence, editor integration, released SDK compatibility and release notes. Applies when a project contains tiapp.xml, with Alloy app/ or Classic Resources/ sources. Use ti-api for individual API contracts, alloy-guides for MVC, and ti-howtos for native integrations.'
---

# ti-guides

Use current official guides maintained in [tidev/titaniumsdk.com](https://github.com/tidev/titaniumsdk.com). Discover routes through [llms.txt](https://titaniumsdk.com/llms.txt); append `.md` to guide routes. API routes can be pinned, for example `https://titaniumsdk.com/docs/sdk/13.4.1`. Read rendered compatibility Markdown because raw source uses generated includes.

This skill covers the released SDK 13.4.1.GA baseline. Verify version-specific contracts against the selected SDK's declarations and implementation; do not treat SDK `main`, an unversioned API page, or SDK 14-only site guidance as released behavior. Current guides can contain errors. Explain a verified discrepancy instead of copying an invalid example.

## Routes

| Task | Reference |
| --- | --- |
| Toolchains, setup, Classic/Alloy creation, first run and hardware | [hello-world.md](references/hello-world.md) |
| Source versus generated files, asset/native paths, framework choice | [application-frameworks.md](references/application-frameworks.md) |
| Native module installation/declaration and npm runtime compatibility | [commonjs-advanced.md](references/commonjs-advanced.md) |
| Properties, app files, SQLite cursors, async queries and seed migration | [advanced-data-and-images.md](references/advanced-data-and-images.md) |
| Hyperloop setup, platform guards, native require paths and bridge costs | [hyperloop-native-access.md](references/hyperloop-native-access.md) |
| Android manifest elements, merge behavior and release inspection | [android-manifest.md](references/android-manifest.md) |
| Signing, AAB/archive/IPA workflows, review and code encryption | [app-distribution.md](references/app-distribution.md) |
| Current tiapp.xml elements, ignored/removed settings and timodule.xml | [tiapp-config.md](references/tiapp-config.md) |
| Current CLI commands, automation and machine configuration | [cli-reference.md](references/cli-reference.md) |
| Released toolchain requirements and host/platform support | [compatibility-matrix.md](references/compatibility-matrix.md) |
| Current registry release notes for SDK 13.4.1 | [sdk-release-notes.md](references/sdk-release-notes.md) |
| VS Code, Pulsar and JetBrains integration | [resources.md](references/resources.md) |

## Working rules

- Confirm Classic versus Alloy source ownership before editing. Alloy generates `Resources/`; edit `app/` instead.
- Pin SDK/module dependencies where reproducibility matters. Separate CLI requirements, SDK declarations and native-module compatibility.
- A native module needs unpacking, declaration and a require. A JavaScript dependency must fit Titanium's actual runtime/API subset rather than assuming full Node.js or browser support.
- Close SQLite cursors and database handles on success and failure. Await asynchronous work before closing resources.
- Properties and encrypted JavaScript are not secure credential storage. Keep server secrets off the device.
- Verify the final release manifest, privacy manifest placement, signing identity and actual exported artifact before submission.
- For official guide examples use modern JavaScript, semicolons, braces and spaces. Preserve a regular function when callback behavior depends on its native `this` receiver.

## Related skills

| Task | Skill |
| --- | --- |
| Alloy controllers, views, styles, models, collections and widgets | `alloy-guides` |
| Alloy CLI, build configuration, debugging and localization | `alloy-howtos` |
| Individual Titanium API properties, methods and event contracts | `ti-api` |
| Media, notifications, maps, location and other native integrations | `ti-howtos` |
| Native module dependency updates | `ti-module-update` |
