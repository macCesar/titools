---
name: ti-guides
description: 'Use when working on Titanium SDK fundamentals: project configuration (`tiapp.xml`, `timodule.xml`), CommonJS modules, Hyperloop native access, app distribution (App Store / Google Play, certificates, provisioning), Titanium CLI usage, memory management, bridge optimization, SQLite transactions, image memory, or coding standards. Triggers include `tiapp.xml` in the project root, for either Alloy (`app/`) or Classic (`Resources/`) Titanium projects.'
---

# ti-guides

## Overview

Reference for Titanium SDK fundamentals: project configuration, distribution, native access via Hyperloop, CommonJS module patterns, memory and bridge optimization, and TiDev coding standards. Applies to both Alloy and Classic projects.

## When to use

Use this skill when:

- The project contains `tiapp.xml` (definitive Titanium project indicator)
- Configuring `tiapp.xml` or `timodule.xml`
- Setting up app distribution (App Store / Google Play, certificates, provisioning, AAB / IPA)
- Using Hyperloop to call native APIs (Objective-C / Swift / Java)
- Optimizing memory: removing global listeners, caching native properties, image memory footprints
- Working with the Titanium CLI (`ti build`, `ti sdk install`, `ti sdk select`)
- Writing CommonJS modules (stateful caching, ES6+ patterns, antipatterns)
- Authoring `AndroidManifest.xml` overrides
- Following TiDev style and naming conventions

Do NOT use for:

- Alloy MVC concepts, controllers, models (use `alloy-guides`)
- Alloy CLI usage and configuration files (use `alloy-howtos`)
- Looking up specific Titanium API surfaces (use `ti-api`)
- Native module dependency updates (use `ti-module-update`)

## Quick reference

| Topic | Reference |
|---|---|
| Project creation, structure, getting started (Alloy or Classic) | [hello-world.md](references/hello-world.md) |
| JavaScript fundamentals, learning resources, ES6+ features | [javascript-primer.md](references/javascript-primer.md) |
| Alloy vs Classic Titanium, framework selection | [application-frameworks.md](references/application-frameworks.md) |
| Memory leaks, bridge efficiency, event naming, security, lazy loading | [coding-best-practices.md](references/coding-best-practices.md) |
| Stateful modules, caching, ES6+ support, antipatterns | [commonjs-advanced.md](references/commonjs-advanced.md) |
| SQLite transactions and image memory optimization | [advanced-data-and-images.md](references/advanced-data-and-images.md) |
| Hyperloop: Objective-C / Swift / Java syntax, casting, debugging, XIB / Storyboards | [hyperloop-native-access.md](references/hyperloop-native-access.md) |
| Naming standards and formatting rules | [style-and-conventions.md](references/style-and-conventions.md) |
| ECMAScript, iOS, and Alloy reserved keywords to avoid | [reserved-words.md](references/reserved-words.md) |
| Custom `AndroidManifest.xml`, permissions, manifest merge | [android-manifest.md](references/android-manifest.md) |
| Google Play (APK / AAB), App Store (IPA), certificates, provisioning, deployment | [app-distribution.md](references/app-distribution.md) |
| Complete `tiapp.xml` and `timodule.xml` reference | [tiapp-config.md](references/tiapp-config.md) |
| Titanium CLI commands, options, tasks, configuration, build processes | [cli-reference.md](references/cli-reference.md) |
| Community support, modules, sample code, Slack, learning materials | [resources.md](references/resources.md) |

## Core practices

1. Validate that the project follows a modular pattern (CommonJS or Alloy).
2. Ensure global listeners are removed and heavy objects are nulled during cleanup.
3. Cache frequently accessed native properties to reduce bridge crossings.
4. Use Hyperloop for specialized native functionality and handle casting and threading correctly.
5. Use transactions for database work and manage image memory footprints.

## Procedural rules

- Always remove `Ti.App` and `Ti.Geolocation` listeners during controller cleanup.
- Do not access `Ti.Platform` or `Ti.DisplayCaps` inside loops. Store values in local variables.
- Concatenate Hyperloop selectors accurately (for example, `addAttribute:value:range:` → `addAttributeValueRange`).
- Close result sets and database handles after every transaction block.

## Response format

When answering Titanium SDK questions:

1. **Technical recommendation** — cite the specific TiDev best practice.
2. **Optimized implementation** — provide modern ES6+ code.
3. **Rationale** — briefly explain the performance or memory impact.

## Related skills

| Task | Use this skill |
|---|---|
| Alloy MVC concepts, controllers, models, data binding | `alloy-guides` |
| Alloy CLI, `alloy.jmk`, `config.json`, debugging | `alloy-howtos` |
| Titanium API lookup (Ti.UI, Ti.Network, modules) | `ti-api` |
| Native module dependency updates | `ti-module-update` |
