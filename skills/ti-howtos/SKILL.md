---
name: ti-howtos
description: "Comprehensive Titanium SDK How-tos expert covering ALL official how-to guides. Use when Claude needs to implement: (1) Location & Maps with battery-efficient tracking, (2) Push/Local Notifications with proper lifecycle, (3) Media APIs (Camera, Gallery, Audio, Video, Images), (4) Remote data (HTTPClient, JSON, XML, uploads/downloads, sockets), (5) Local data (Filesystem, SQLite, Properties, Streams), (6) WebView integration with bidirectional communication, (7) Android platform features (Intents, Receivers, Services, Intent Filters), (8) iOS platform features (Background Services, Spotlight, Handoff, iCloud, Core Motion, WatchKit), (9) Extending Titanium (Hyperloop, native modules), or (10) Cross-platform patterns and persistence strategies."
---

# Titanium SDK How-tos Expert

Comprehensive expert covering all official Titanium SDK how-to guides. Provides step-by-step instructions for integrating native features, handling data, working with media, and implementing platform-specific APIs.

## Integration Workflow

1.  **Requirement Check**: Identify needed permissions, `tiapp.xml` configurations, and module dependencies.
2.  **Service Setup**: Register listeners or services (Location, Push, Core Motion, etc.).
3.  **Lifecycle Sync**: Coordinate service listeners with Android/iOS lifecycle events.
4.  **Error Handling**: Implement robust error callbacks for asynchronous native calls.
5.  **Platform Optimization**: Apply platform-specific deep-dive logic (e.g., Intent Filters, Spotlight, Core Motion).

## Native Integration Rules (Low Freedom)

### iOS Permissions
- **Location**: `NSLocationWhenInUseUsageDescription` or `NSLocationAlwaysAndWhenInUseUsageDescription` in `tiapp.xml`
- **Motion Activity**: Required for Core Motion Activity API
- **Camera/Photo**: `NSCameraUsageDescription` and `NSPhotoLibraryUsageDescription`
- **Background Modes**: Required for background audio, location, or VOIP

### Android Resource Management
- **Services**: Always stop background services when no longer needed
- **Location**: Use `distanceFilter` and FusedLocationProvider for battery efficiency
- **Intents**: Specify proper action, data type, and category

### Data & Networking
- **HTTPClient**: Always handle both `onload` and `onerror` callbacks
- **SQLite**: Always `db.close()` and `resultSet.close()` to prevent locks
- **Filesystem**: Check `isExternalStoragePresent()` before accessing SD card
- **JSON**: Use `JSON.parse()` for responses, `JSON.stringify()` for sending
- **XML**: Use DOM Level 2 API with `getElementsByTagName()`, `getAttribute()`

### Media & Memory
- **Camera/Gallery**: Use `imageAsResized` to avoid memory exhaustion
- **Audio**: Handle `pause`/`resume` events for streaming interruption
- **WebView**: Avoid embedding in TableViews; set `touchEnabled=false` if needed
- **Video**: Android requires fullscreen; iOS supports embedded players

## Reference Guides (Progressive Disclosure)

### Core Features
-   **[Location & Maps](references/location-and-maps.md)**: Battery-efficient GPS tracking, geocoding, native maps.
-   **[Notification Services](references/notification-services.md)**: Push notifications (APNs/FCM), local alerts, interactive notifications.

### Data Handling
-   **[Remote Data Sources](references/remote-data-sources.md)**: HTTPClient lifecycle, JSON/XML parsing, file uploads/downloads, sockets, SSL certificates.
-   **[Local Data Sources](references/local-data-sources.md)**: Filesystem operations, SQLite databases, Properties API, Streams, persistence strategies.

### Media & Content
-   **[Media APIs](references/media-apis.md)**: Audio playback/recording, Video streaming, Camera/Gallery, Images and ImageViews, density-specific assets.

### Web Integration
-   **[Web Content Integration](references/web-content-integration.md)**: WebView component (WKWebView), local/remote content, bidirectional communication with Titanium code.

### Platform-Specific (Android)
-   **[Android Platform Deep Dives](references/android-platform-deep-dives.md)**: Intents, Intent Filters, Broadcast Receivers, Background Services.

### Platform-Specific (iOS)
-   **[iOS Platform Deep Dives](references/ios-platform-deep-dives.md)**: Background Services, Spotlight Search, Handoff, iCloud (Keychain/Documents), Core Motion, WatchKit integration.

### Advanced
-   **[Extending Titanium](references/extending-titanium.md)**: Hyperloop integration, native module development (Android/iOS), adding custom native functionality.

## Related Skills

For tasks beyond native feature integration, use these complementary skills:

| Task | Use This Skill |
|------|----------------|
| Project architecture, services, memory cleanup | `alloy-expert` |
| UI layouts, ListViews, gestures, animations | `ti-ui` |
| Hyperloop, app distribution, tiapp.xml config | `ti-guides` |
| Alloy MVC, models, data binding | `alloy-guides` |

## Response Format

1.  **Prerequisites**: List required permissions, `tiapp.xml` configurations, or module dependencies.
2.  **Step-by-Step Implementation**: Task-focused code guide with error handling.
3.  **Platform Caveats**: Mention specific behavior differences between iOS and Android.
4.  **Best Practices**: Include memory management, lifecycle considerations, and performance tips.