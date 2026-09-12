# Source map

Mapping of doc-based skills in this repo to their upstream documentation source. This file is intentionally self-contained so the auditor doesn't need to load anything else to find what to compare against.

---

## Documentation roots

The Titanium documentation moved during 2026. `tidev/titanium-docs` (VuePress) is frozen and being archived under TI-52; `tidev/titaniumsdk.com` (Next.js) replaces it, and the Titanium SDK now dispatches its API regeneration there. The job that still notifies `titanium-docs` is labelled `Notify titanium-docs (legacy)` in the SDK's own `regen-docs.yml`, with a comment saying to delete it once the move completes.

That leaves three roots with different standing, and the difference is the whole point of this file. Two are live sources. One is an archive.

| Local path | Upstream | Standing |
|---|---|---|
| `.titanium-sdk/apidoc/` | `tidev/titanium-sdk:apidoc/` | **Live, canonical for the API.** Every other API copy is compiled from it. |
| `.titaniumsdk-site/content/docs/` | `tidev/titaniumsdk.com:content/docs/` | **Live, canonical for the guides.** Being written; ~20 of 41 approved pages still unwritten. |
| `.titaniumsdk-site/registry/sdk/<version>/` | compiled from `apidoc/` by `scripts/docgen/` | Live cross-check: says which release actually shipped an API. Resolve through that version's `contents.json`, never by grepping `_pool/`. |
| `.titanium-docs/docs/guide/` | `tidev/titanium-docs:docs/guide/` | **Archive.** 336 pages TiDev condensed into 62. Preserved here, never a source of a *new* claim. |
| `.titanium-docs/docs/api/` | `tidev/titanium-docs:docs/api/` | **Archive, and already behind.** Verified 2026-09-11: `Ti.UI.Toolbar.hideSharedBackground` (apidoc 2026-07-12) and `Ti.UI.ListView.snapping` (apidoc 2026-07-20) never reached it, though both are in the site's `registry/sdk/main/`. |
| `.purgetss-docs/docs/` | `macCesar/purgetss-docs:docs/` | Live. |
| `.purgetss-source/` | `macCesar/purgeTSS` package source, `CHANGELOG.md`, `README.md`, `bin/`, `src/`, and `dist/` | Live. |

All cache roots are gitignored. See `SKILL.md` § "Setup" for clone/refresh commands.

---

## Precedence: which root wins

An audit that reads the wrong root reports green against a corpus that stopped moving. These rules decide what beats what.

**1. For anything factual about the API — a property, a method, a signature, a constant, a platform flag — `.titanium-sdk/apidoc/` wins, always.** It is the file the SDK team edits. The site's registry and the archived markdown are both downstream of it.

**2. For anything factual about a guide topic — a command, a path, a version number, a required tool — the new site wins when it has a page on that topic.** The archive was written across a decade of "the latest version" and points at hosts that no longer resolve. Where the new page says something different, the new page is right.

**3. The archive is additive only.** It supplies topics the new site has not written yet, and detail the new site deliberately dropped. It never overrides a live source, and nothing in it is deleted for being absent from the new site. TiTools keeps the full corpus on purpose: at 1390 KB against the new site's 219 KB, this repo holds material the official docs no longer carry.

**4. Anchor the API audit to a release, not to `main`.** `main` currently declares `14.0.0` and carries APIs no published SDK has (`Ti.UI.TableView.searchText`, `Ti.UI.ListView.snapping`). Audit against the newest GA tag — `git -C .titanium-sdk show 13_4_1_GA:apidoc/...` — and cross-check with `registry/sdk/13.4.1/`. An API present in `main` but absent from both is a future release, not a gap in the skill.

**5. Report which root produced each change.** A finding that says "apidoc 13_4_1_GA, Titanium/UI/Toolbar.yml" can be checked. One that says "the docs say" cannot.

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
| `animation-system.md`, `animation-advanced.md`, `purgetss-ui-classic.md` | `.purgetss-docs/docs/purgetss-ui/` + UI module template/source |
| `class-index.md`, `class-index-properties.md`, `class-categories.md` | Generated utilities, builders, config template, and `dist/*.tss` in `.purgetss-source/`; verify class existence from source/output, not from Tailwind memory |
| `dynamic-component-creation.md` | Official configuration/custom-rule docs plus Alloy integration code in `.purgetss-source/`; mark any production convention beyond those sources as community-discovered |
| `smart-mappings.md`, `performance-tips.md`, `ui-ux-design.md`, `tikit-components.md`, `EXAMPLES.md` | Curated cross-topic references. Verify every PurgeTSS class/API against the mapped official docs/source; preserve valid `Community-Discovered Patterns` and flag unsupported prose |
| `version-history.md` | `.purgetss-source/CHANGELOG.md` (agent-facing summary, not a copy of the full changelog) |

Do not treat the similarly named `alloy-guides/references/PURGETSS.md` as the source for this skill. That file is separately marked `AUDIT-SKIP` in the titanium-docs audit because `skills/purgetss/` is the maintained PurgeTSS authority in this repository.

### `alloy-guides`

- **Source type:** Narrative, two layers
- **Live layer:** `.titaniumsdk-site/content/docs/alloy/` — 7 pages, the rewritten Alloy guide
- **Archive layer:** `.titanium-docs/docs/guide/Alloy_Framework/Alloy_Guide` — 17 pages, the corpus it was condensed from

The live layer wins on anything factual. The archive supplies what the rewrite dropped: `Views_without_Controllers`, `Dynamic_Styles`, the Backbone migration notes, and most of the sync-adapter detail.

| Live page | Covers the archive's |
|---|---|
| `alloy/index.md` | `Alloy_Concepts.md` |
| `alloy/controllers.md` | `Alloy_Controllers.md` |
| `alloy/views.md` | `Alloy_Views/Alloy_XML_Markup.md` |
| `alloy/styles.md` | `Alloy_Views/Alloy_Styles_and_Themes.md` |
| `alloy/models.md` | all of `Alloy_Models/`, migrations included |
| `alloy/widgets.md` | `Alloy_Widgets.md` |
| `alloy/config.md` | `config.json` and `alloy.jmk` |
| *(none)* | `Alloy_Views/Views_without_Controllers.md`, `Alloy_Views/Dynamic_Styles.md`, `Alloy_Tasks_with_the_CLI.md` — archive only, keep |

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

- **Source type:** Narrative, two layers
- **Live layer:** `.titaniumsdk-site/content/docs/alloy/config.md` and `alloy/widgets.md` — the only new pages touching this skill's ground
- **Archive layer:** `.titanium-docs/docs/guide/Alloy_Framework/Alloy_How-tos` — 11 pages

The new site wrote no how-to silo, on purpose. Most of this skill has no live counterpart and stays archive-only: `alloy compile`, the conditional `if=` attribute in XML and TSS, custom XML tags via `app/lib/`, and the compiler troubleshooting. Those are real gaps in the official docs and good candidates for a PR.

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

- **Source type:** Narrative, two layers
- **Live layer:** `.titaniumsdk-site/content/docs/{setup,reference,distribute}/` + `build/project-structure.md`
- **Archive layer:** `.titanium-docs/docs/guide/Titanium_SDK/Titanium_SDK_Guide`

| Reference file | Live page (wins) |
|---|---|
| `compatibility-matrix.md` | `reference/compatibility.md` — generated from the SDK each build, so it beats any hand-kept table |
| `tiapp-config.md` | `reference/tiapp-xml.md` — 14 KB, the largest page on the new site |
| `cli-reference.md` | `reference/cli.md` + `reference/config.md` |
| `app-distribution.md` | `distribute/{signing,ios,android,encryption}.md` |
| `hello-world.md` | `build/first-app.md` + `setup/` |
| `application-frameworks.md` | `build/project-structure.md` |
| `hyperloop-native-access.md` | `extend/hyperloop.md` |
| `javascript-primer.md`, `reserved-words.md`, `style-and-conventions.md`, `coding-best-practices.md`, `commonjs-advanced.md`, `advanced-data-and-images.md`, `android-manifest.md` | *(no live page)* — archive only |
| `sdk-release-notes.md` | `.titaniumsdk-site/registry/sdk/<version>/release-notes.md`, one per release |
| `resources.md` | `/contribute` on the new site |
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

- **Source type:** Narrative, two layers
- **Live layer:** `.titaniumsdk-site/content/docs/build/` + `content/docs/extend/`
- **Archive layer:** `.titanium-docs/docs/guide/Titanium_SDK/Titanium_SDK_How-tos` — 116 pages, the largest archive tree

| Reference file | Live page (wins) |
|---|---|
| `location-and-maps.md`, `google-maps-v2.md`, `ios-map-kit.md` | `build/location.md` |
| `notification-services.md` | `build/notifications.md` |
| `remote-data-sources.md` | `build/data/networking.md` |
| `local-data-sources.md`, `buffer-codec-streams.md` | `build/data/index.md` |
| `media-apis.md` | `build/media.md` |
| `extending-titanium.md` | `extend/modules.md` + `build/modules.md`, **plus the archive's new `iOS_Module_Swift_Package_Manager.md`** |
| `debugging-profiling.md` | `build/debugging.md` |
| `using-modules.md` | `build/modules.md` |
| `cross-platform-development.md` | `build/ui/platform-conventions.md` |
| `web-content-integration.md`, `webpack-build-pipeline.md`, `android-platform-deep-dives.md`, `ios-platform-deep-dives.md`, `tutorials.md` | *(no live page)* — archive only |
| `automation-fastlane-appium.md` | **No upstream source** in either layer — community tooling. Preserve as-is. |

The archive is still moving even while frozen: `iOS_Module_Swift_Package_Manager.md` was added 2026-08-23, 117 lines on `spm.json` and `linkage: host` vs `embedded`, and this skill has no coverage of it.

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
- **Canonical source:** `.titanium-sdk/apidoc/` — 238 YAML files, the ones the SDK team edits
- **Release cross-check:** `.titaniumsdk-site/registry/sdk/<version>/` (`contents.json` maps a type to its document in `_pool/`)
- **Archive:** `.titanium-docs/docs/api/` — the ~580 generated markdown files these references were converted from, kept for provenance only

> **Audit against a tag, not the working tree.** `git -C .titanium-sdk show 13_4_1_GA:apidoc/Titanium/UI/Toolbar.yml`. The checkout tracks `main`, which declares `14.0.0` and already carries APIs no released SDK has. Record the tag in the audit report.
>
> **Three questions, three sources.** *Does this API exist?* → apidoc. *Did it ship?* → the registry for the GA release. *Where did our current text come from?* → the archive. Answering the first from the archive is what let `hideSharedBackground` and `snapping` stay missing from this skill for two months.
>
> **YAML reads differently from the generated markdown.** A property is a `- name:` entry under `properties:`, with `type`, `platforms`, `since`, `default` and `availability` as siblings. `since` is often absent — its absence means "since the type existed", not "new". `excludes:` at the type level removes inherited members, and `deprecated:` carries `since` and `notes`. Read the YAML, do not infer the shape from the old markdown table.

| Reference file | apidoc source |
|---|---|
| `api-ui-views.md` | `Titanium/UI/{View,Label,Button,ImageView,MaskedImage,ScrollView,ScrollableView,Slider,Switch,ProgressBar,ActivityIndicator,RefreshControl}.yml` |
| `api-ui-windows-navigation.md` | `Titanium/UI/{Window,NavigationWindow,TabGroup,Tab,Toolbar,OptionDialog,AlertDialog,EmailDialog}.yml` |
| `api-ui-text-input.md` | `Titanium/UI/{TextField,TextArea,SearchBar,AttributedString,Attribute}.yml` |
| `api-ui-lists.md` | `Titanium/UI/{ListView,ListItem,ListSection,ListViewScrollPosition,TableView,TableViewRow,TableViewSection,TableViewScrollPosition}.yml` |
| `api-ui-extras.md` | `Titanium/UI/{Animation,AnimatedOptions,Matrix2D,Matrix3D,WebView,Picker,PickerColumn,PickerRow,ButtonBar,TabbedBar,OptionBar,DashboardView,DashboardItem,ShortcutItem,Notification}.yml` |
| `api-ui-ios.md` | `Titanium/UI/iOS/` |
| `api-ui-ios-animator.md` | `Titanium/UI/iOS/` animator and physics types |
| `api-ui-android.md` | `Titanium/UI/Android/` + `Titanium/UI/iPad/` |
| `api-android.md` | `Titanium/Android/` |
| `api-app-platform.md` | `Titanium/App/` + `Titanium/Platform/` + `Titanium/Locale/` |
| `api-media.md` | `Titanium/Media/` |
| `api-data-network.md` | `Titanium/Network/` + `Titanium/Database/` + `Titanium/Filesystem/` + `Titanium/Stream/` + `Titanium/Codec/` |
| `api-services.md` | `Titanium/Geolocation/` + `Titanium/Contacts/` + `Titanium/Calendar/` + `Titanium/WatchSession/` |
| `api-core.md` | `Titanium/Titanium.yml` + `Titanium/UI/UI.yml` + `Titanium/API/` + `Titanium/Accelerometer/` + `Titanium/Gesture/` + `Titanium/Utils/` + shared types in `Titanium/UI/{Color,Font,Dimension,Size,Padding}.yml` |
| `api-xml-global.md` | `Titanium/XML/` + `Global/` + `NodeJS/` |
| `api-modules-map.md` | `Modules/Map/` |
| `api-modules-social-misc.md` | `Modules/{Applesignin,Barcode,Crypto,Facebook,Identity}/` |
| `api-modules-ble-bluetooth.md` | `Modules/{BLE,Bluetooth}/` |
| `api-modules-nfc.md` | `Modules/Nfc/` |
| `api-modules-coremotion-urlsession.md` | `Modules/{CoreMotion,URLSession}/` |

Modules ship their apidoc in their own repos; `.titaniumsdk-site/scripts/docgen/sources.json` is the authoritative list of the 17 source repos the site compiles. When a module's types are missing from `.titanium-sdk/apidoc/Modules/`, read them from the registry instead and note it.

#### Reading the registry without fooling yourself

`registry/sdk/_pool/` is content-addressed and **shared across every version**, 8.0.0 through `main`. A grep for a property name there tells you some version has it, not which. It is an easy way to report an unreleased API as shipped, and it happened on 2026-09-11: three pool files carrying `hideSharedBackground` all belonged to `registry/sdk/main/`, while 13.4.0 and 13.4.1 both hold a 14-property `Titanium.UI.Toolbar` without it.

Resolve through the version instead: read `registry/sdk/<version>/contents.json`, take the hash it gives for the type, then open that one pool file.

#### Coverage as of 2026-09-11, apidoc @ 13_4_1_GA

Measured with `scripts/apidoc-coverage.mjs`. Three APIs sit in `apidoc` on `main` and in no published release, so they are **not** gaps in the skill — adding them would document a version nobody can install:

| API | In apidoc since | In 13.4.1 | Verdict |
|---|---|---|---|
| `Ti.UI.Toolbar.hideSharedBackground` | 2026-07-12 | no | wait for the GA |
| `Ti.UI.ListView.snapping` (+ `TableView`) | 2026-07-20 | no | wait for the GA |
| `Ti.UI.TableView.searchText` | 2026-09-02 | no | wait for the GA |
| `QuickSettingsServiceShowParams` | 2026-08-26 | no | pseudo-type split out of the shared `showParams`; cosmetic for this skill |

`main` declares `14.0.0`. When it ships, re-run the coverage script against the new tag and these become real work.

#### Reference map

Do not hand-write which reference holds which type; it drifts and then an audit reports every member of a type as missing because it read the wrong file. `scripts/api-map.mjs` derives it from the `## Ti.X` headings in the files themselves:

```bash
node .claude/skills/titools-skill-auditor/scripts/api-map.mjs --find Toolbar
node .claude/skills/titools-skill-auditor/scripts/api-map.mjs --by-file
```

As of 2026-09-11 the 20 reference files carry 305 types with no type documented in two places.
