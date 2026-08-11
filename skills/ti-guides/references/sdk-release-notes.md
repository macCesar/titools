# SDK release notes: what changes your code

Condensed 13.x release history, filtered down to what actually affects how you write or configure an app. Full changelogs (every commit, every credit) live upstream under `Titanium_SDK_Release_Notes/`.

Each GA release desupports the previous patch release. Running an unsupported version is allowed, but bug reports against it are not accepted.

<!-- TOC-START -->
## Contents

- [1. Version timeline](#1-version-timeline)
- [2. 13.4.0 — Android target SDK 36 groundwork](#2-1340--android-target-sdk-36-groundwork)
- [3. 13.3.1 — patch](#3-1331--patch)
- [4. 13.3.0 — Xcode 27, iOS 27, multi-scene](#4-1330--xcode-27-ios-27-multi-scene)
- [5. 13.2.0 — ViewPager2, keepHardwareMode](#5-1320--viewpager2-keephardwaremode)
- [6. Bundled module versions](#6-bundled-module-versions)

<!-- TOC-END -->

## 1. Version timeline

| Version | Date | Headline |
|---|---|---|
| 13.4.0.GA | 28 July 2026 | Prepares the SDK for Android target SDK 36; v8 memory cleanup |
| 13.3.1.GA | 20 July 2026 | Patch — iOS restart and LiveView fixes |
| 13.3.0.GA | 01 July 2026 | Xcode 27 and iOS 27, Hyperloop 8.0.0, iOS multi-scene apps |
| 13.2.0.GA | 08 April 2026 | iOS core changes, Node.js 24 support, Android fixes |
| 13.1.0.GA | — | Minor release, high-priority fixes |
| 13.0.0.GA | — | Major release: iOS 26 / Xcode 26, Android 16 KB page size |

## 2. 13.4.0 — Android target SDK 36 groundwork

- **Prepares the SDK for Android target SDK 36.** Groundwork only; the compatibility matrix still lists API 35 as the maximum target. See [compatibility-matrix.md](compatibility-matrix.md) § Android.
- v8 memory cleanup (Android).
- `Window.rect` now reflects pre-open `left`/`top` instead of reporting zeros before the window opens (Android).
- Build paths adjusted for Windows hosts.
- iOS: fixed the dimming area in a TableView SearchBar.
- The debug-only selector for `Ti.App._restart()` was removed, making the method callable outside debug builds.

## 3. 13.3.1 — patch

iOS-only fixes: the `restart` method, and LiveView restart. Hyperloop bumped to 8.0.1.

## 4. 13.3.0 — Xcode 27, iOS 27, multi-scene

- **Xcode 27 and iOS 27 support.** This postdates the Xcode/iOS rows in the compatibility matrix, which still cap at Xcode 16.x.
- **iOS multi-scene applications** are supported.
- **Hyperloop 8.0.0.**
- ScrollableView (Android): a deprecation note was added for its older events. As of SDK 13.4.0 no ScrollableView event is actually flagged deprecated in the API metadata — `scroll`, `scrollend` and `dragend` all remain current — so treat this as advance warning, not as a removal.
- ImageView: pinch-and-zoom improved on Android; the remote-image fade-in animation was removed on iOS.
- TabGroup (iOS): `focus` is now emitted separately from `selected`. Code that assumed one event covered both cases needs checking.
- `borderWidth` no longer renders at double thickness when `borderRadius` is an array (iOS).
- Android: Material 3 BottomNavigation theme and dark/light switching fixes, CameraX rotation fix under orientation lock, WebView fix for URLs carrying large GET data, `Ti.Preferences` optimized.

## 5. 13.2.0 — ViewPager2, keepHardwareMode

- **ScrollableView moved to ViewPager2 on Android.** A backing-widget swap; verify paging, nested scrolling and any custom paging control against it.
- **`keepHardwareMode` added to `Ti.UI.View`** (Android) — controls the view's render mode.
- **`hideKeyboardAccessoryView` added to WebView** (iOS) to hide the keyboard accessory bar.
- **AttributedString support on Android**, previously iOS-only.
- Images can be dragged horizontally inside a ScrollableView (Android).
- ListView caches `searchText` (Android).
- The app name in `AndroidManifest.xml` now uses the i18n value.
- Node.js 24 support; core-js upgraded, removing the `baseline-browser-mapping` warning.
- iOS: Mac Catalyst fixes for `Ti.UI.Button` styling and events, and module builds with `mac=true`.

## 6. Bundled module versions

Versions shipped with each SDK. Unchanged rows are omitted.

| Module | 13.2.0 (Android / iOS) | 13.3.0+ (Android / iOS) |
|---|---|---|
| facebook | 14.0.0 / 15.0.0 | 15.0.0 / 16.0.0 |
| hyperloop | 7.1.0 / 7.1.0 | 8.0.1 / 8.0.1 (8.0.0 in 13.3.0) |

Stable across 13.2.0–13.4.0: `ti.map` 5.7.0 / 7.3.1, `ti.webdialog` 2.5.0 / 3.0.2, `ti.playservices` 18.6.0 (Android only), `ti.identity` 3.2.0 / 5.0.0, `urlSession` 4.0.1 (iOS only), `ti.coremotion` 4.0.1 (iOS only), `ti.applesignin` 3.1.2 (iOS only).
