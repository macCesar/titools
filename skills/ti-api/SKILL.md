---
name: ti-api
description: "Titanium SDK complete API reference. Use when looking up properties, methods, events, constants, or type signatures for any Ti.* or Modules.* API. Covers Ti.UI, Ti.Android, Ti.App, Ti.Media, Ti.Network, Ti.Database, Ti.Filesystem, Ti.Geolocation, Ti.Contacts, Ti.Calendar, Global, and third-party modules (Map, BLE, NFC, Facebook, Identity, CoreMotion). AUTO-DETECT: If tiapp.xml exists in the project, this is a Titanium project — invoke this skill BEFORE writing any code that uses Ti.* APIs. Do NOT rely on training data for Titanium APIs; always check the reference files in this skill first."
argument-hint: "[Ti.UI.Window | Ti.Network.HTTPClient | Modules.Map.View | ...]"
allowed-tools: Read, Grep, Glob
---

# Titanium API Reference

Quick lookup for properties, methods, events, and constants across all Titanium SDK and module APIs.

## How to use this skill

1. Identify which namespace the API belongs to
2. Look up the reference file in the table below
3. Read the reference file for full property/method/event tables

## Namespace Lookup

| Namespace | Reference File | Contents |
|-----------|---------------|----------|
| Titanium.UI.View, Titanium.UI.Label, Titanium.UI.Button, Titanium.UI.ImageView, ... | [api-ui-views.md](references/api-ui-views.md) | Ti.UI Core Views (13 APIs) |
| Titanium.UI.Window, Titanium.UI.NavigationWindow, Titanium.UI.TabGroup, Titanium.UI.Tab, ... | [api-ui-windows-navigation.md](references/api-ui-windows-navigation.md) | Ti.UI Windows & Navigation (7 APIs) |
| Titanium.UI.TextField, Titanium.UI.TextArea, Titanium.UI.SearchBar, Titanium.UI.AttributedString, ... | [api-ui-text-input.md](references/api-ui-text-input.md) | Ti.UI Text & Input (9 APIs) |
| Titanium.UI.ListView, Titanium.UI.ListItem, Titanium.UI.ListSection, Titanium.UI.ListViewScrollPosition, ... | [api-ui-lists.md](references/api-ui-lists.md) | Ti.UI Lists & Tables (8 APIs) |
| Titanium.UI.Animation, Titanium.UI.Matrix2D, Titanium.UI.Matrix3D, Titanium.UI.WebView, ... | [api-ui-extras.md](references/api-ui-extras.md) | Ti.UI Extras (13 APIs) |
| Titanium.UI.iOS | [api-ui-ios.md](references/api-ui-ios.md) | Ti.UI.iOS (36 APIs) |
| Titanium.UI.iOS | [api-ui-ios-animator.md](references/api-ui-ios-animator.md) | Ti.UI.iOS Animator & Physics (8 APIs) |
| Titanium.UI.Android, Titanium.UI.iPad | [api-ui-android.md](references/api-ui-android.md) | Ti.UI.Android (10 APIs) |
| Titanium.Android, Titanium.Android.ActionBar, Titanium.Android.Activity, Titanium.Android.BigPictureStyle, ... | [api-android.md](references/api-android.md) | Ti.Android (17 APIs) |
| Titanium.App, Titanium.App.Android, Titanium.App.Properties, Titanium.App.iOS, ... | [api-app-platform.md](references/api-app-platform.md) | Ti.App & Ti.Platform (18 APIs) |
| Titanium.Media, Titanium.Media.Android, Titanium.Media.AudioPlayer, Titanium.Media.AudioRecorder, ... | [api-media.md](references/api-media.md) | Ti.Media (9 APIs) |
| Titanium.Database, Titanium.Database.DB, Titanium.Database.ResultSet, Titanium.Filesystem, ... | [api-data-network.md](references/api-data-network.md) | Ti.Network, Ti.Database & Ti.Filesystem (14 APIs) |
| Titanium.Calendar, Titanium.Calendar.Alert, Titanium.Calendar.Attendee, Titanium.Calendar.Calendar, ... | [api-services.md](references/api-services.md) | Ti.Geolocation, Ti.Contacts, Ti.Calendar & Ti.WatchSession (15 APIs) |
| Titanium, Titanium.UI, Titanium.API, Titanium.Accelerometer, ... | [api-core.md](references/api-core.md) | Ti Core (16 APIs) |
| Titanium.XML, Titanium.XML.Attr, Titanium.XML.CDATASection, Titanium.XML.CharacterData, ... | [api-xml-global.md](references/api-xml-global.md) | Ti.XML & Global (25 APIs) |
| Modules.Map, Modules.Map.Annotation, Modules.Map.Camera, Modules.Map.Circle, ... | [api-modules-map.md](references/api-modules-map.md) | Modules: Map (11 APIs) |
| Modules.Applesignin, Modules.Applesignin.LoginButton, Modules.Barcode, Modules.Crypto, ... | [api-modules-social-misc.md](references/api-modules-social-misc.md) | Modules: Facebook, Identity, Crypto & More (16 APIs) |
| Modules.BLE, Modules.BLE.Beacon, Modules.BLE.BeaconIdentityConstraint, Modules.BLE.BeaconRegion, ... | [api-modules-ble-bluetooth.md](references/api-modules-ble-bluetooth.md) | Modules: BLE & Bluetooth (20 APIs) |
| Modules.Nfc, Modules.Nfc.MifareTagTechnology, Modules.Nfc.NativeTagTechnology, Modules.Nfc.NdefMessage, ... | [api-modules-nfc.md](references/api-modules-nfc.md) | Modules: NFC (28 APIs) |
| Modules.CoreMotion, Modules.CoreMotion.Accelerometer, Modules.CoreMotion.Altimeter, Modules.CoreMotion.DeviceMotion, ... | [api-modules-coremotion-urlsession.md](references/api-modules-coremotion-urlsession.md) | Modules: CoreMotion & URLSession (12 APIs) |

## Quick lookup by common task

| Task | API | Reference |
|------|-----|-----------|
| Create a window | Ti.UI.Window | [api-ui-windows-navigation.md](references/api-ui-windows-navigation.md) |
| HTTP request | Ti.Network.HTTPClient | [api-data-network.md](references/api-data-network.md) |
| Show an alert | Ti.UI.AlertDialog | [api-ui-windows-navigation.md](references/api-ui-windows-navigation.md) |
| Play audio | Ti.Media.AudioPlayer | [api-media.md](references/api-media.md) |
| Read a file | Ti.Filesystem.File | [api-data-network.md](references/api-data-network.md) |
| SQLite query | Ti.Database.DB | [api-data-network.md](references/api-data-network.md) |
| GPS location | Ti.Geolocation | [api-services.md](references/api-services.md) |
| Push notification | Ti.App.iOS | [api-app-platform.md](references/api-app-platform.md) |
| ListView | Ti.UI.ListView | [api-ui-lists.md](references/api-ui-lists.md) |
| Camera/gallery | Ti.Media | [api-media.md](references/api-media.md) |
| Map view | Modules.Map.View | [api-modules-map.md](references/api-modules-map.md) |
| BLE scanning | Modules.BLE | [api-modules-ble-bluetooth.md](references/api-modules-ble-bluetooth.md) |
| Animation | Ti.UI.Animation | [api-ui-extras.md](references/api-ui-extras.md) |
| WebView | Ti.UI.WebView | [api-ui-extras.md](references/api-ui-extras.md) |
| Contacts | Ti.Contacts | [api-services.md](references/api-services.md) |

## Reading the reference tables

Each API entry includes:

- **Summary** — one-line description
- **Extends** — parent type (inherited properties/methods not repeated)
- **Platforms** — `both` (android + ios), `android`, or `ios`
- **Properties table** — unique properties (not inherited), with type, default, platform
- **Methods table** — unique methods with parameters, return type, platform
- **Events table** — unique events with platform and description
- **Related Types** — inline struct definitions used by that API

### Property counts

Tables show `unique: X/Y` where X is properties defined on this class and Y is total including inherited. To see inherited properties, check the parent class.

## API coverage

| Category | APIs | Reference File |
|----------|------|---------------|
| Ti.UI Core Views | 13 | api-ui-views.md |
| Ti.UI Windows & Navigation | 7 | api-ui-windows-navigation.md |
| Ti.UI Text & Input | 9 | api-ui-text-input.md |
| Ti.UI Lists & Tables | 8 | api-ui-lists.md |
| Ti.UI Extras | 13 | api-ui-extras.md |
| Ti.UI.iOS | 36 | api-ui-ios.md |
| Ti.UI.iOS Animator & Physics | 8 | api-ui-ios-animator.md |
| Ti.UI.Android | 10 | api-ui-android.md |
| Ti.Android | 17 | api-android.md |
| Ti.App & Ti.Platform | 18 | api-app-platform.md |
| Ti.Media | 9 | api-media.md |
| Ti.Network, Ti.Database & Ti.Filesystem | 14 | api-data-network.md |
| Ti.Geolocation, Ti.Contacts, Ti.Calendar & Ti.WatchSession | 15 | api-services.md |
| Ti Core | 16 | api-core.md |
| Ti.XML & Global | 25 | api-xml-global.md |
| Modules: Map | 11 | api-modules-map.md |
| Modules: Facebook, Identity, Crypto & More | 16 | api-modules-social-misc.md |
| Modules: BLE & Bluetooth | 20 | api-modules-ble-bluetooth.md |
| Modules: NFC | 28 | api-modules-nfc.md |
| Modules: CoreMotion & URLSession | 12 | api-modules-coremotion-urlsession.md |

## Related skills

- **ti-ui** — UI/UX patterns, layout strategies, performance tips (narrative)
- **ti-expert** — Architecture patterns, memory management, anti-patterns
- **ti-howtos** — Integration guides for push, camera, maps, networking
- **ti-guides** — SDK fundamentals, tiapp.xml, Hyperloop
