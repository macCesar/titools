---
name: ti-howtos
description: 'Use when implementing Titanium SDK device integrations, location and ti.map, local or push notifications, camera/gallery/audio/video, SQLite and files, HTTPClient, platform conventions, native modules, Hyperloop, CLI plugins, or debugging. Triggers include tiapp.xml and calls to Ti.Geolocation, Ti.Media, Ti.Database, Ti.Network or third-party modules.'
---

# ti-howtos

Practical guidance from the current official Titanium website. Load the matching reference before implementing a feature. Release API/compiler contracts resolve mistakes in guide examples; do not assume an unreleased SDK feature is available.

| Task | Reference |
|---|---|
| Location permission, one position, tracking, geocoding, ti.map | [location-and-maps.md](references/location-and-maps.md) |
| Local notifications, Android channels, APNs/FCM boundaries | [notification-services.md](references/notification-services.md) |
| HTTPClient, JSON, forms, files, progress, connection and TLS | [remote-data-sources.md](references/remote-data-sources.md) |
| Properties, files, SQLite, seed databases and migrations | [local-data-sources.md](references/local-data-sources.md) |
| Camera/gallery permissions, audio, video and cleanup | [media-apis.md](references/media-apis.md) |
| Install/declare/require native modules and npm dependencies | [using-modules.md](references/using-modules.md) |
| Logs, breakpoints, LiveView, build failures and profiling | [debugging-profiling.md](references/debugging-profiling.md) |
| Navigation, Android Back, title bars, tabs and safe areas | [cross-platform-development.md](references/cross-platform-development.md) |
| Native module development, Hyperloop and CLI build plugins | [extending-titanium.md](references/extending-titanium.md) |

Use `ti-api` for exact signatures, `ti-guides` for project/toolchain/distribution configuration, and `alloy-guides` / `alloy-howtos` for Alloy MVC and CLI tasks. For details not published in current guides, consult their linked current reference; do not infer a complete recipe from a historical example.

## Essential checks

- Request the feature's permission and supply the matching iOS usage descriptions before using it. Handle denial and cancellation.
- Remove global/location listeners and release owned media resources when the feature closes.
- Handle both HTTP success and failure, malformed JSON, timeouts and server status; register callbacks before `open()`.
- Bind SQL values and close result sets/databases after the operation completes.
- Android notification permission and FCM token registration are separate operations; `ti.playservices` alone is not an FCM integration.
- Native configuration/module changes require a real build; LiveView is for JavaScript iteration.
