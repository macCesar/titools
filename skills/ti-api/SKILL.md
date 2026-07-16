---
name: ti-api
description: 'Use when looking up properties, methods, events, constants, or type signatures for any Titanium API: `Ti.UI`, `Ti.Android`, `Ti.App`, `Ti.Media`, `Ti.Network`, `Ti.Database`, `Ti.Filesystem`, `Ti.Geolocation`, `Ti.Contacts`, `Ti.Calendar`, `Global`, `Ti.XML`, or third-party modules (Map, BLE, NFC, Facebook, Identity, CoreMotion, URLSession). Triggers include `tiapp.xml` in the project root, or any code that references `Ti.*` or `Modules.*`.'
---

# ti-api

## Overview

API reference for the Titanium SDK and TiDev-maintained modules. Use it to look up properties, methods, events, constants, and type signatures across ~360 APIs grouped into 20 reference files.

## When to use

Use this skill when:

- Writing or reviewing code that calls any `Ti.*` or `Modules.*` API
- Verifying a property name, type, default, or platform availability
- Confirming a method signature, parameter list, or return type
- Looking up event names and event-object payloads
- Checking platform support (`android`, `ios`, or `both`) for an API

Do NOT use for:

- Alloy MVC concepts, controllers, models (use `alloy-guides`)
- Alloy CLI and configuration files (use `alloy-howtos`)
- Titanium project setup, `tiapp.xml`, distribution, Hyperloop (use `ti-guides`)
- Native module dependency updates (use `ti-module-update`)

## How to use this skill

1. Identify which namespace the API belongs to.
2. Look up the matching reference file in the table below.
3. Read the reference file for full property / method / event tables.

## Namespace lookup

| Namespace examples | Reference | Coverage |
|---|---|---|
| `Ti.UI.View`, `Ti.UI.Label`, `Ti.UI.Button`, `Ti.UI.ImageView`, ... | [api-ui-views.md](references/api-ui-views.md) | Ti.UI Core Views (13 APIs) |
| `Ti.UI.Window`, `Ti.UI.NavigationWindow`, `Ti.UI.TabGroup`, `Ti.UI.Tab`, ... | [api-ui-windows-navigation.md](references/api-ui-windows-navigation.md) | Ti.UI Windows & Navigation (7 APIs) |
| `Ti.UI.TextField`, `Ti.UI.TextArea`, `Ti.UI.SearchBar`, `Ti.UI.AttributedString`, ... | [api-ui-text-input.md](references/api-ui-text-input.md) | Ti.UI Text & Input (9 APIs) |
| `Ti.UI.ListView`, `Ti.UI.ListItem`, `Ti.UI.ListSection`, `Ti.UI.TableView`, ... | [api-ui-lists.md](references/api-ui-lists.md) | Ti.UI Lists & Tables (8 APIs) |
| `Ti.UI.Animation`, `Ti.UI.Matrix2D`, `Ti.UI.Matrix3D`, `Ti.UI.WebView`, ... | [api-ui-extras.md](references/api-ui-extras.md) | Ti.UI Extras (13 APIs) |
| `Ti.UI.iOS` | [api-ui-ios.md](references/api-ui-ios.md) | Ti.UI.iOS (36 APIs) |
| `Ti.UI.iOS` Animator / Physics | [api-ui-ios-animator.md](references/api-ui-ios-animator.md) | Ti.UI.iOS Animator & Physics (8 APIs) |
| `Ti.UI.Android`, `Ti.UI.iPad` | [api-ui-android.md](references/api-ui-android.md) | Ti.UI.Android (10 APIs) |
| `Ti.Android`, `Ti.Android.ActionBar`, `Ti.Android.Activity`, ... | [api-android.md](references/api-android.md) | Ti.Android (17 APIs) |
| `Ti.App`, `Ti.App.Properties`, `Ti.App.iOS`, `Ti.Platform`, ... | [api-app-platform.md](references/api-app-platform.md) | Ti.App & Ti.Platform (18 APIs) |
| `Ti.Media`, `Ti.Media.AudioPlayer`, `Ti.Media.AudioRecorder`, ... | [api-media.md](references/api-media.md) | Ti.Media (9 APIs) |
| `Ti.Network`, `Ti.Database`, `Ti.Database.DB`, `Ti.Filesystem`, ... | [api-data-network.md](references/api-data-network.md) | Ti.Network, Ti.Database & Ti.Filesystem (14 APIs) |
| `Ti.Geolocation`, `Ti.Contacts`, `Ti.Calendar`, `Ti.WatchSession`, ... | [api-services.md](references/api-services.md) | Ti.Geolocation, Ti.Contacts, Ti.Calendar & Ti.WatchSession (15 APIs) |
| `Titanium`, `Ti.UI` (root), `Ti.API`, `Ti.Accelerometer`, ... | [api-core.md](references/api-core.md) | Ti Core (16 APIs) |
| `Ti.XML`, `Ti.XML.Attr`, `Ti.XML.CDATASection`, Global APIs | [api-xml-global.md](references/api-xml-global.md) | Ti.XML & Global (25 APIs) |
| `Modules.Map`, `Modules.Map.Annotation`, `Modules.Map.Camera`, ... | [api-modules-map.md](references/api-modules-map.md) | Modules: Map (11 APIs) |
| `Modules.Applesignin`, `Modules.Barcode`, `Modules.Crypto`, Facebook, Identity, ... | [api-modules-social-misc.md](references/api-modules-social-misc.md) | Modules: Facebook, Identity, Crypto & More (16 APIs) |
| `Modules.BLE`, `Modules.BLE.Beacon`, `Modules.BLE.BeaconRegion`, ... | [api-modules-ble-bluetooth.md](references/api-modules-ble-bluetooth.md) | Modules: BLE & Bluetooth (20 APIs) |
| `Modules.Nfc`, `Modules.Nfc.MifareTagTechnology`, `Modules.Nfc.NdefMessage`, ... | [api-modules-nfc.md](references/api-modules-nfc.md) | Modules: NFC (28 APIs) |
| `Modules.CoreMotion`, `Modules.CoreMotion.Accelerometer`, URLSession, ... | [api-modules-coremotion-urlsession.md](references/api-modules-coremotion-urlsession.md) | Modules: CoreMotion & URLSession (12 APIs) |

## Quick lookup by common task

| Task | API | Reference |
|---|---|---|
| Create a window | `Ti.UI.Window` | [api-ui-windows-navigation.md](references/api-ui-windows-navigation.md) |
| HTTP request | `Ti.Network.HTTPClient` | [api-data-network.md](references/api-data-network.md) |
| Show an alert | `Ti.UI.AlertDialog` | [api-ui-windows-navigation.md](references/api-ui-windows-navigation.md) |
| Play audio | `Ti.Media.AudioPlayer` | [api-media.md](references/api-media.md) |
| Read a file | `Ti.Filesystem.File` | [api-data-network.md](references/api-data-network.md) |
| SQLite query | `Ti.Database.DB` | [api-data-network.md](references/api-data-network.md) |
| GPS location | `Ti.Geolocation` | [api-services.md](references/api-services.md) |
| Push notifications | `Ti.App.iOS` / Android FCM | [api-app-platform.md](references/api-app-platform.md) |
| ListView | `Ti.UI.ListView` | [api-ui-lists.md](references/api-ui-lists.md) |
| Camera / gallery | `Ti.Media` | [api-media.md](references/api-media.md) |
| Map view | `Modules.Map.View` | [api-modules-map.md](references/api-modules-map.md) |
| BLE scanning | `Modules.BLE` | [api-modules-ble-bluetooth.md](references/api-modules-ble-bluetooth.md) |
| Animation | `Ti.UI.Animation` | [api-ui-extras.md](references/api-ui-extras.md) |
| WebView | `Ti.UI.WebView` | [api-ui-extras.md](references/api-ui-extras.md) |
| Contacts | `Ti.Contacts` | [api-services.md](references/api-services.md) |

## Reading the reference tables

Each API entry includes:

- **Summary** — one-line description
- **Extends** — parent type (inherited properties / methods are not repeated)
- **Platforms** — `both` (Android + iOS), `android`, or `ios`
- **Properties table** — unique properties (not inherited), with type, default, platform
- **Methods table** — unique methods with parameters, return type, platform
- **Events table** — unique events with platform and description
- **Related Types** — inline struct definitions used by that API

### Property counts

Tables show `unique: X / Y` where `X` is properties defined on this class and `Y` is total including inherited. For inherited properties, check the parent class.

## API coverage

| Category | APIs | Reference |
|---|---|---|
| Ti.UI Core Views | 13 | `api-ui-views.md` |
| Ti.UI Windows & Navigation | 7 | `api-ui-windows-navigation.md` |
| Ti.UI Text & Input | 9 | `api-ui-text-input.md` |
| Ti.UI Lists & Tables | 8 | `api-ui-lists.md` |
| Ti.UI Extras | 13 | `api-ui-extras.md` |
| Ti.UI.iOS | 36 | `api-ui-ios.md` |
| Ti.UI.iOS Animator & Physics | 8 | `api-ui-ios-animator.md` |
| Ti.UI.Android | 10 | `api-ui-android.md` |
| Ti.Android | 17 | `api-android.md` |
| Ti.App & Ti.Platform | 18 | `api-app-platform.md` |
| Ti.Media | 9 | `api-media.md` |
| Ti.Network, Ti.Database & Ti.Filesystem | 14 | `api-data-network.md` |
| Ti.Geolocation, Ti.Contacts, Ti.Calendar & Ti.WatchSession | 15 | `api-services.md` |
| Ti Core | 16 | `api-core.md` |
| Ti.XML & Global | 25 | `api-xml-global.md` |
| Modules: Map | 11 | `api-modules-map.md` |
| Modules: Facebook, Identity, Crypto & More | 16 | `api-modules-social-misc.md` |
| Modules: BLE & Bluetooth | 20 | `api-modules-ble-bluetooth.md` |
| Modules: NFC | 28 | `api-modules-nfc.md` |
| Modules: CoreMotion & URLSession | 12 | `api-modules-coremotion-urlsession.md` |

## Related skills

| Task | Use this skill |
|---|---|
| Alloy MVC concepts, controllers, models, data binding | `alloy-guides` |
| Alloy CLI, `alloy.jmk`, `config.json`, debugging | `alloy-howtos` |
| Titanium SDK config, Hyperloop, app distribution | `ti-guides` |
| Native module dependency updates | `ti-module-update` |
