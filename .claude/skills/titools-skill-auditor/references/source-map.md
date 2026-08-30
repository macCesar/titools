# Source map

Mapping of doc-based skills in this repo to their upstream documentation source. This file is intentionally self-contained so the auditor doesn't need to load anything else to find what to compare against.

---

## Documentation roots

Five skills source from [`tidev/titanium-docs`](https://github.com/tidev/titanium-docs). `purgetss` uses the official documentation repo plus the released CLI source.

| Local path | Upstream |
|---|---|
| `.titanium-docs/docs/guide/` | `tidev/titanium-docs:docs/guide/` |
| `.titanium-docs/docs/api/` | `tidev/titanium-docs:docs/api/` |
| `.purgetss-docs/docs/` | `macCesar/purgetss-docs:docs/` |
| `.purgetss-source/` | `macCesar/purgeTSS` package source, `CHANGELOG.md`, `README.md`, `bin/`, `src/`, and `dist/` |

All cache roots are gitignored. See `SKILL.md` § "Setup" for clone/refresh commands.

---

## Per-skill mapping

### `purgetss`

- **Source type:** Mixed narrative + released implementation
- **Official docs root:** `.purgetss-docs/docs/`
- **Release/implementation root:** `.purgetss-source/`

The docs are primary for workflows and user-facing paths. Use the package `CHANGELOG.md`, current CLI help in `bin/purgetss`, and implementation/tests when a release changes behavior before or beyond the prose docs. Record both commit hashes in the audit report.

| Reference file(s) | Official source |
|---|---|
| `installation-setup.md` | `.purgetss-docs/docs/installation.md` + `commands.md` compatibility table |
| `cli-commands.md`, `classic-projects.md` | `.purgetss-docs/docs/commands.md` + `.purgetss-source/CHANGELOG.md` |
| `app-branding.md`, `launch-background.md` | `.purgetss-docs/docs/app-assets/1-app-icons-and-branding.md` + branding CLI/source/tests |
| `multi-density-images.md` | `.purgetss-docs/docs/app-assets/2-multi-density-images.md` + images CLI/source/tests |
| `svg-pipeline.md` | `.purgetss-docs/docs/app-assets/3-svg-pipeline.md` |
| `appearance-module.md` | `.purgetss-docs/docs/best-practices/1-appearance-setup.md` + `docs/purgetss-ui/10-appearance.md` |
| `semantic-colors.md` | `.purgetss-docs/docs/best-practices/2-semantic-colors.md` + semantic CLI/source/tests |
| `ios-large-titles.md` | `.purgetss-docs/docs/best-practices/3-large-titles-on-ios.md` |
| `values-and-units.md` | `.purgetss-docs/docs/best-practices/4-values-and-units.md` |
| `customization-deep-dive.md`, `configurable-properties.md`, `titanium-resets.md` | `.purgetss-docs/docs/customization/1-configuring-guide.md` + config templates/builders in `.purgetss-source/` |
| `custom-rules.md` | `.purgetss-docs/docs/customization/2-custom-rules.md` |
| `apply-directive.md` | `.purgetss-docs/docs/customization/3-the-apply-directive.md` |
| `opacity-modifier.md` | `.purgetss-docs/docs/customization/4-opacity.md` |
| `arbitrary-values.md` | `.purgetss-docs/docs/customization/5-arbitrary-values.md` |
| `platform-modifiers.md` | `.purgetss-docs/docs/customization/6-platform-and-device-modifiers.md` |
| `custom-fonts.md` | `.purgetss-docs/docs/customization/7-custom-fonts.md` + font builder tests |
| `icon-fonts.md` | `.purgetss-docs/docs/customization/8-icon-fonts-libraries.md` + generated modules in `.purgetss-source/dist/` |
| `grid-layout.md` | `.purgetss-docs/docs/grid-system.md` |
| `animation-system.md`, `animation-advanced.md` | `.purgetss-docs/docs/purgetss-ui/` + UI module template/source |
| `class-index.md`, `class-index-properties.md`, `class-categories.md` | Generated utilities, builders, config template, and `dist/*.tss` in `.purgetss-source/`; verify class existence from source/output, not from Tailwind memory |
| `dynamic-component-creation.md` | Official configuration/custom-rule docs plus Alloy integration code in `.purgetss-source/`; mark any production convention beyond those sources as community-discovered |
| `smart-mappings.md`, `performance-tips.md`, `ui-ux-design.md`, `tikit-components.md`, `EXAMPLES.md` | Curated cross-topic references. Verify every PurgeTSS class/API against the mapped official docs/source; preserve valid `Community-Discovered Patterns` and flag unsupported prose |
| `version-history.md` | `.purgetss-source/CHANGELOG.md` (agent-facing summary, not a copy of the full changelog) |

Do not treat the similarly named `alloy-guides/references/PURGETSS.md` as the source for this skill. That file is separately marked `AUDIT-SKIP` in the titanium-docs audit because `skills/purgetss/` is the maintained PurgeTSS authority in this repository.

### `alloy-guides`

- **Source type:** Narrative
- **Official doc subtree:** `.titanium-docs/docs/guide/Alloy_Framework/Alloy_Guide`

| Reference file | Official source |
|---|---|
| `CONCEPTS.md` | `Alloy_Concepts.md` |
| `CONTROLLERS.md` | `Alloy_Controllers.md` |
| `MODELS.md` | `Alloy_Models/Alloy_Collection_and_Model_Objects.md` + `Alloy_Models/Alloy_Data_Binding.md` |
| `MODELS_ADVANCED.md` | `Alloy_Models/Alloy_Sync_Adapters_and_Migrations.md` + `Alloy_Models/Backbone_Objects_without_Alloy.md` + `Alloy_Models/Alloy_Backbone_Migration.md` |
| `VIEWS_XML.md` | `Alloy_Views/Alloy_XML_Markup.md` |
| `VIEWS_STYLES.md` | `Alloy_Views/Alloy_Styles_and_Themes.md` |
| `VIEWS_DYNAMIC.md` | `Alloy_Views/Dynamic_Styles.md` |
| `VIEWS_WITHOUT_CONTROLLERS.md` | `Alloy_Views/Views_without_Controllers.md` |
| `WIDGETS.md` | `Alloy_Widgets.md` |
| `CLI_TASKS.md` | `Alloy_Tasks_with_the_CLI.md` |
| `PURGETSS.md` | **AUDIT-SKIP** — manually maintained against the PurgeTSS toolkit's own docs at [purgetss.com](https://purgetss.com), not `Alloy_PurgeTSS.md` upstream. The auditor must NOT propose changes to this file. See in-file `<!-- AUDIT-SKIP -->` marker for details. |

---

### `alloy-howtos`

- **Source type:** Narrative
- **Official doc subtree:** `.titanium-docs/docs/guide/Alloy_Framework/Alloy_How-tos`

| Reference file | Official source |
|---|---|
| `best_practices.md` | `Alloy_Best_Practices_and_Recommendations.md` |
| `cli_reference.md` | `Alloy_Reference_Guides/` (CLI-related files) |
| `config_files.md` | `Alloy_Reference_Guides/` (config-related files) |
| `custom_tags.md` | `Creating_Custom_Tags_in_Titanium_with_Alloy.md` |
| `debugging_troubleshooting.md` | `Alloy_Debugging_and_Troubleshooting.md` |
| `samples.md` | `Alloy_Samples.md` (+ `Titanium_SDK_Tutorials.md` for additional examples) |

---

### `ti-guides`

- **Source type:** Narrative
- **Official doc subtree:** `.titanium-docs/docs/guide/Titanium_SDK/Titanium_SDK_Guide`
- **Additional subtrees:** `Titanium_SDK/Titanium_SDK_Getting_Started/`, `Titanium_SDK/Titanium_SDK_Release_Notes/`, and `docs/guide/Editor_IDE/` — see the rows below. These sit outside `Titanium_SDK_Guide` and were unmapped until 2026-08-11, so upstream changes to them were invisible to the audit.

| Reference file | Official source |
|---|---|
| `hello-world.md` | `Getting_Started/` |
| `javascript-primer.md` | `Best_Practices/` JS section |
| `application-frameworks.md` | `Welcome_To_Titanium/` architecture overview |
| `coding-best-practices.md` | `Best_Practices_and_Recommendations/` |
| `commonjs-advanced.md` | `Best_Practices_and_Recommendations/CommonJS_Modules.md` |
| `advanced-data-and-images.md` | Data and image related guides |
| `hyperloop-native-access.md` | `Hyperloop/` subdirectory |
| `style-and-conventions.md` | `Best_Practices_and_Recommendations/` style section |
| `reserved-words.md` | `Best_Practices_and_Recommendations/` reserved words |
| `android-manifest.md` | `Appendices/` or platform-specific sections |
| `tiapp-config.md` | `Appendices/tiapp.xml_and_timodule.xml_Reference.md` |
| `resources.md` | `Contributing_to_Titanium/` or community section |
| `cli-reference.md` | CLI documentation across guide |
| `app-distribution.md` | App distribution guides (App Store, Google Play) |
| `compatibility-matrix.md` | `Titanium_SDK_Getting_Started/Installation_and_Configuration/Titanium_Compatibility_Matrix/README.md` |
| `sdk-release-notes.md` | `Titanium_SDK_Release_Notes/Titanium_SDK_Release_Notes_13.x/` (all `*_Release_Note.md`) |
| `resources.md` (IDE section) | `docs/guide/Editor_IDE/README.md` |

> **Reading the release notes.** They are changelogs, not API documentation. A line such as *"add deprecation note for old events in ScrollableView"* is a commit subject — before turning one into guidance, confirm it against `docs/api/api.json` and, when available, the installed SDK's `api.jsca` under `~/Library/Application Support/Titanium/mobilesdk/osx/<version>/`. In the 2026-08-11 audit that exact line turned out to have no corresponding `deprecated` flag in either source.

---

### `ti-howtos`

- **Source type:** Narrative
- **Official doc subtree:** `.titanium-docs/docs/guide/Titanium_SDK/Titanium_SDK_How-tos`

| Reference file | Official source |
|---|---|
| `location-and-maps.md` | `Location_Services/` (overview + `Native_Maps_and_Annotations.md`) |
| `google-maps-v2.md` | `Location_Services/Google_Maps_v2_for_Android.md` |
| `ios-map-kit.md` | `Location_Services/iOS_Map_Kit.md` |
| `notification-services.md` | `Notification_Services/` |
| `remote-data-sources.md` | `Working_with_Remote_Data_Sources/` |
| `local-data-sources.md` | `Working_with_Local_Data_Sources/` |
| `buffer-codec-streams.md` | `Working_with_Local_Data_Sources/` (Buffer / Codec / Stream sections) |
| `media-apis.md` | `Working_with_Media_APIs/` |
| `web-content-integration.md` | `Integrating_Web_Content/` + `WKWebView.md` |
| `webpack-build-pipeline.md` | `Webpack_Guide.md` |
| `android-platform-deep-dives.md` | `Platform_API_Deep_Dives/Android_API_Deep_Dives/` |
| `ios-platform-deep-dives.md` | `Platform_API_Deep_Dives/iOS_API_Deep_Dives/` + `Adhere_to_the_iOS17_Privacy_Requirements.md` |
| `extending-titanium.md` | `Extending_Titanium_Mobile/` |
| `debugging-profiling.md` | `Debugging_and_Profiling/` |
| `cross-platform-development.md` | `Cross-Platform_Mobile_Development_In_Titanium/` |
| `tutorials.md` | `Titanium_SDK_Tutorials/` |
| `using-modules.md` | `Using_Modules/` |
| `automation-fastlane-appium.md` | **No upstream source** — community / external tooling (Fastlane, Appium). Not in `tidev/titanium-docs`. Auditor should preserve as-is and only update if behavior of the external tools changes. |

---

### `ti-api`

- **Source type:** API
- **Official doc subtree:** `.titanium-docs/docs/api/`

> **Notes for `ti-api`:**
> - Source is ~580 generated `.md` files from YAML definitions in `tidev/titanium-sdk:apidoc/`.
> - Generated files may contain broken cross-doc URLs (known upstream issue) — flag but do not try to fix upstream.
> - References are grouped by namespace (Ti.UI, Ti.App, Ti.Network, etc.) into ~20 reference files.

| Reference file | Namespace coverage |
|---|---|
| `api-ui-views.md` | `Ti.UI` core views (View, Label, Button, ImageView, …) |
| `api-ui-windows-navigation.md` | `Ti.UI.Window`, `NavigationWindow`, `TabGroup`, `Tab` |
| `api-ui-text-input.md` | `Ti.UI.TextField`, `TextArea`, `SearchBar`, `AttributedString` |
| `api-ui-lists.md` | `Ti.UI.ListView`, `TableView`, related |
| `api-ui-extras.md` | `Ti.UI.Animation`, `Matrix2D`, `Matrix3D`, `WebView`, … |
| `api-ui-ios.md` | `Ti.UI.iOS` |
| `api-ui-ios-animator.md` | `Ti.UI.iOS` Animator & Physics |
| `api-ui-android.md` | `Ti.UI.Android`, `Ti.UI.iPad` |
| `api-android.md` | `Ti.Android`, `ActionBar`, `Activity`, … |
| `api-app-platform.md` | `Ti.App`, `Ti.App.Properties`, `Ti.Platform` |
| `api-media.md` | `Ti.Media` (audio/video, camera, gallery) |
| `api-data-network.md` | `Ti.Network`, `Ti.Database`, `Ti.Filesystem` |
| `api-services.md` | `Ti.Geolocation`, `Ti.Contacts`, `Ti.Calendar`, `Ti.WatchSession` |
| `api-core.md` | `Titanium`, `Ti.UI` root, `Ti.API`, `Ti.Accelerometer`, … |
| `api-xml-global.md` | `Ti.XML`, Global APIs |
| `api-modules-map.md` | `Modules.Map` |
| `api-modules-social-misc.md` | `Modules.Applesignin`, `Barcode`, `Crypto`, `Facebook`, `Identity` |
| `api-modules-ble-bluetooth.md` | `Modules.BLE`, Bluetooth |
| `api-modules-nfc.md` | `Modules.Nfc` |
| `api-modules-coremotion-urlsession.md` | `Modules.CoreMotion`, `Modules.URLSession` |
