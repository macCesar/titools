---
name: ti-ui
description: 'Use when working with Titanium SDK native UI layouts, ListView or TableView, app icons and launch screens, navigation, tabs, Android back handling, safe areas, or platform-specific UI conventions in Classic or Alloy projects.'
---

# Titanium SDK user interface

Use the current official UI guides for Titanium Classic and Alloy. Titanium controls are native views; its layout system is shared across platforms and differs from CSS.

Before creating new UI files, use `ti-reuse-first` to check existing screens and components.

## Required workflow

1. Confirm the project has `tiapp.xml` and identify its selected SDK.
2. Open the relevant reference below before giving instructions or editing UI.
3. Cite the reference used as `[source: references/<file>.md]`. Read the linked release-specific API when a property, event, default or platform restriction matters.
4. For a topic not covered by these guides, consult `ti-api` and the current official API. Do not reconstruct an unpublished guide from archived recipes or memory. Mark an unverified claim `FROM_MEMORY (unverified):` if it cannot be checked.
5. Verify the affected layout on its intended platform before claiming visual correctness.

## Guide routing

| Task | Reference |
| --- | --- |
| Native UI model and guide selection | [User interface](references/user-interface.md) |
| Composite, vertical, horizontal layouts; units, sizing, measurement | [Layout and positioning](references/layouts-and-positioning.md) |
| ListView templates, sections, items, events; choosing TableView | [Lists and tables](references/listviews-and-performance.md) |
| iOS and Android app icons, launch screens, app name | [Icons and launch screens](references/icons-and-splash-screens.md) |
| NavigationWindow, Android activities/back, bars, tabs, safe areas, platform branches | [Platform conventions](references/platform-conventions.md) |

## Sources and release scope

These references follow the current [official UI documentation](https://titaniumsdk.com/docs/build/ui), maintained in [tidev/titaniumsdk.com](https://github.com/tidev/titaniumsdk.com/tree/main/content/docs/build/ui). Use the pages' `.md` versions when reading them with an agent. The released baseline is SDK 14.0.0.GA. SDK `main` and unversioned guides can describe later changes, so verify version-specific instructions against the selected release.

The [release-specific API](https://titaniumsdk.com/docs/sdk/14.0.0) resolves property and platform details when a guide disagrees. In particular, iOS `Window.extendSafeArea` defaults to `true`; set `false` when content should stay within the safe area. SDK 14 supports PNG icons and Icon Composer documents on Xcode 26+; read the icon reference for filename, fallback and launch-screen requirements.

## Related skills

| Task | Skill |
| --- | --- |
| Properties, methods, events, accessibility, gestures, animations and other UI API contracts | `ti-api` |
| Alloy views, styles and data binding | `alloy-guides` |
| Configuration, SDK setup and distribution | `ti-guides` |
| Location, media, notifications and other native integrations | `ti-howtos` |
| Existing component discovery | `ti-reuse-first` |
