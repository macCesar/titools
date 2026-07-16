---
name: ti-howtos
description: 'Use when implementing Titanium SDK native integrations: location services, Google Maps v2 (Android) or Map Kit (iOS), push notifications (APNs/FCM), camera and gallery, media APIs, SQLite databases, HTTPClient networking, WKWebView, Android Intents, iOS Keychain/iCloud, WatchKit/Siri, Hyperloop native modules, or CI/CD with Fastlane and Appium. Triggers include `tiapp.xml` in the project root plus calls to `Ti.Geolocation`, `Ti.Media`, `Ti.Database`, `Ti.Network.HTTPClient`, `Ti.UI.WebView`, `Ti.Filesystem`, or third-party modules like `ti.map`, `ti.playservices`, `ti.identity`.'
---

# ti-howtos

## Overview

Practical reference for Titanium SDK native integrations: device APIs, networking, persistence, native modules, platform-specific deep dives, and CI/CD. Reference-style — load the relevant file from `references/` for deeper detail.

## When to use

Use this skill when:

- The project contains `tiapp.xml`
- Implementing device features: GPS, camera, push notifications, sensors
- Adding maps: Google Maps v2 on Android or Map Kit on iOS
- Working with media: audio, video, image gallery, density assets
- Persisting data: SQLite, Properties, Filesystem, encrypted storage
- Networking: HTTPClient, sockets, SOAP, SSL/TLS, file uploads/downloads
- Embedding web content: WKWebView, local HTML, JS bridges
- Platform-specific work: Android Intents, iOS 17 privacy, Spotlight, iCloud, Core Motion, WatchKit, Siri
- Extending Titanium: Hyperloop, native modules, AndroidX migration
- CI/CD: Fastlane lanes, Appium UI tests, store deployment

Do NOT use for:

- Alloy MVC concepts, controllers, models, data binding (use `alloy-guides`)
- Alloy CLI, conditional views, custom XML tags, build hooks (use `alloy-howtos`)
- Titanium SDK fundamentals, `tiapp.xml` config basics, app distribution overview (use `ti-guides`)
- Looking up specific Titanium API signatures (use `ti-api`)
- Native module dependency updates (use `ti-module-update`)

## Quick reference

| Topic | Reference |
|---|---|
| GPS, distance filter, accuracy, geofencing | [location-and-maps.md](references/location-and-maps.md) |
| Google Maps v2 on Android: API keys, Play Services | [google-maps-v2.md](references/google-maps-v2.md) |
| iOS Map Kit: 3D camera, system buttons, callouts | [ios-map-kit.md](references/ios-map-kit.md) |
| Push notifications (APNs / FCM), local alerts, interactive notifications | [notification-services.md](references/notification-services.md) |
| HTTPClient lifecycle, JSON/XML, uploads, sockets, SOAP, SSL | [remote-data-sources.md](references/remote-data-sources.md) |
| Filesystem, SQLite, Properties, persistence strategy | [local-data-sources.md](references/local-data-sources.md) |
| Binary data with `Ti.Buffer`, `Ti.Codec`, streams | [buffer-codec-streams.md](references/buffer-codec-streams.md) |
| Audio playback/recording, video, camera, gallery, density assets | [media-apis.md](references/media-apis.md) |
| WKWebView, local/remote content, JS bridge | [web-content-integration.md](references/web-content-integration.md) |
| Webpack build pipeline (Ti 9.1.0+), npm integration, `@` alias | [webpack-build-pipeline.md](references/webpack-build-pipeline.md) |
| Android Intents, broadcast permissions, background services | [android-platform-deep-dives.md](references/android-platform-deep-dives.md) |
| iOS 17 privacy, silent push, Spotlight, Handoff, iCloud, Core Motion, WatchKit, Siri | [ios-platform-deep-dives.md](references/ios-platform-deep-dives.md) |
| Hyperloop, native Proxy/View modules, AndroidX migration | [extending-titanium.md](references/extending-titanium.md) |
| Memory management, leak detection, native debugging tools | [debugging-profiling.md](references/debugging-profiling.md) |
| Fastlane lanes, Appium UI testing, store deployment | [automation-fastlane-appium.md](references/automation-fastlane-appium.md) |
| Cross-platform strategy: shared vs platform-specific code | [cross-platform-development.md](references/cross-platform-development.md) |
| End-to-end tutorials: REST APIs, camera, geolocation, controller chaining, Fastlane | [tutorials.md](references/tutorials.md) |
| Obtaining, installing, and configuring native modules | [using-modules.md](references/using-modules.md) |

## Key practices

### iOS permissions

Required `tiapp.xml` keys for common features:

- Location: `NSLocationWhenInUseUsageDescription` or `NSLocationAlwaysAndWhenInUseUsageDescription`
- Motion activity: `NSMotionUsageDescription`
- Camera: `NSCameraUsageDescription`
- Photo library: `NSPhotoLibraryUsageDescription` (read) and `NSPhotoLibraryAddUsageDescription` (write)
- Microphone: `NSMicrophoneUsageDescription`
- iOS 17+: `PrivacyInfo.xcprivacy` for UserDefaults and File Timestamps (see [ios-platform-deep-dives.md](references/ios-platform-deep-dives.md))

### Android resource management

- Stop background services explicitly when no longer needed
- Use `distanceFilter` and FusedLocationProvider (requires `ti.playservices`) for battery-efficient location
- Intent filters: copy the root activity to `tiapp.xml`, then add action / data / category

### Data and networking

- HTTPClient: handle both `onload` and `onerror` — never just one
- SQLite: close both `db` and `resultSet` to avoid locks
- Filesystem: check `isExternalStoragePresent()` before using SD card storage
- Binary data: use `Ti.Buffer` and `Ti.Codec` for byte-level work; `BufferStream` / `FileStream` / `BlobStream` for chunked I/O

### Media and memory

- Camera / gallery: use `imageAsResized` to reduce memory pressure
- Audio: handle `pause` / `resume` for streaming interruptions
- WebView: avoid embedding inside TableView; set `touchEnabled=false` if needed
- Video: Android requires fullscreen; iOS supports embedded players

### Platform-specific properties need modifiers

Using `Ti.UI.iOS.*` or `Ti.UI.Android.*` without platform modifiers can break cross-platform builds.

```javascript
// Wrong — adds Ti.UI.iOS to Android build
const win = Ti.UI.createWindow({
  statusBarStyle: Ti.UI.iOS.StatusBar.LIGHT_CONTENT
});
```

TSS modifier (Alloy):

```tss
"#mainWindow[platform=ios]": {
  statusBarStyle: Ti.UI.iOS.StatusBar.LIGHT_CONTENT
}
```

Conditional code:

```javascript
if (OS_IOS) {
  $.mainWindow.statusBarStyle = Ti.UI.iOS.StatusBar.LIGHT_CONTENT;
}
```

Common offenders:

- iOS: `statusBarStyle`, `modalStyle`, `modalTransitionStyle`, any `Ti.UI.iOS.*` constant
- Android: `actionBar` config, any `Ti.UI.Android.*` constant

## Related skills

| Task | Use this skill |
|---|---|
| Alloy MVC concepts, controllers, models, data binding | `alloy-guides` |
| Alloy CLI, custom tags, build hooks, conditional views | `alloy-howtos` |
| Titanium SDK fundamentals, `tiapp.xml`, app distribution | `ti-guides` |
| Look up Titanium API properties, methods, events | `ti-api` |
| Native module dependency updates | `ti-module-update` |
