---
name: ti-ui
description: Titanium SDK UI/UX expert for layouts, ListViews, TableViews, events, animations, accessibility, scrolling, gestures, orientation, custom fonts, icons, splash screens, app structures, and platform-specific UI (Action Bar, Navigation Bar, iOS/Android components). Use when implementing complex UI, optimizing performance, handling platform differences, or configuring app icons and launch images.
---

# Titanium SDK UI Expert

Comprehensive expert covering all official Titanium SDK UI how-to guides. Provides guidance on cross-platform UI/UX, event handling, animations, performance optimization, and platform-specific components.

## Quick Reference

| Topic | Reference |
|-------|-----------|
| **App Structures** | [application-structures.md](references/application-structures.md) |
| Layouts, positioning, units | [layouts-and-positioning.md](references/layouts-and-positioning.md) |
| Events, bubbling, lifecycle | [event-handling.md](references/event-handling.md) |
| ScrollView vs ScrollableView | [scrolling-views.md](references/scrolling-views.md) |
| **TableView** | [tableviews.md](references/tableviews.md) |
| ListView templates & performance | [listviews-and-performance.md](references/listviews-and-performance.md) |
| Touch, swipe, pinch, gestures | [gestures.md](references/gestures.md) |
| Orientation handling | [orientation.md](references/orientation.md) |
| Custom fonts, attributed strings | [custom-fonts-styling.md](references/custom-fonts-styling.md) |
| Animations, 2D/3D matrices | [animation-and-matrices.md](references/animation-and-matrices.md) |
| Icons, splash screens, densities | [icons-and-splash-screens.md](references/icons-and-splash-screens.md) |
| Android Action Bar, themes | [platform-ui-android.md](references/platform-ui-android.md) |
| iOS Navigation, 3D Touch | [platform-ui-ios.md](references/platform-ui-ios.md) |
| VoiceOver, TalkBack, a11y | [accessibility-deep-dive.md](references/accessibility-deep-dive.md) |

## Critical Rules (Low Freedom)

### Performance
- **NO `Ti.UI.SIZE` in ListViews**: Causes jerky scrolling. Use fixed heights.
- **Prefer ListView over TableView** for new apps with large datasets.
- **Batch updates**: Use `applyProperties` to reduce bridge crossing overhead.
- **WebView in TableView**: Anti-pattern causing severe scrolling issues.

### iOS Accessibility
- **NO accessibility properties on container views**: Blocks children interaction.
- **NO accessibilityLabel on text controls** (Android): Overrides visible text.

### Layout
- **Use `dp` units** for cross-platform consistency.
- **Android ScrollView**: Vertical OR horizontal, not both. Set `scrollType`.

### Event Management
- **Remove global listeners** (`Ti.App`, `Ti.Gesture`, `Ti.Accelerometer`) on pause to save battery.
- **Event bubbling**: Input events bubble up; system events do not.

### App Architecture
- **Limit tabs to 4 or less** for better UX across platforms.
- **Use NavigationWindow for iOS** hierarchical navigation.
- **Handle androidback** to prevent unexpected app exits.

## Platform Differences Summary

| Feature | iOS | Android |
|---------|-----|---------|
| 3D Matrix | ✅ Full support | ❌ No |
| Pinch gesture | ✅ Full support | ⚠️ Limited |
| ScrollView | Bidirectional | Unidirectional |
| TableView | ✅ Full support | ✅ Full support |
| ListView | ✅ Full support | ✅ Full support |
| Default template image | Left side | Right side |
| ListView action items | ✅ Swipe actions | ❌ No |
| Modal windows | Fills screen, covers tab bar | No effect (always full) |
| Navigation pattern | NavigationWindow | Back button + Menu |

## UI Design Workflow

1. **Choose App Structure**: Tab-based (most common) or Window-based
2. **Layout Selection**: Choose mode (composite/vertical/horizontal) based on structure
3. **Sizing Strategy**: Assign `SIZE` or `FILL` based on component defaults
4. **Event Architecture**: Plan bubbling, app-level events, lifecycle
5. **Performance**: Use ListView/TableView templates, batch updates
6. **Accessibility**: Apply a11y properties per platform requirements
7. **Motion**: Add animations, 2D/3D transforms, transitions

## Searching References

When looking for specific patterns, grep these terms in reference files:
- **App Structure**: `TabGroup`, `NavigationWindow`, `modal`, `execution context`, `androidback`
- **Layouts**: `dp`, `Ti.UI.SIZE`, `Ti.UI.FILL`, `composite`, `vertical`, `horizontal`
- **Events**: `addEventListener`, `cancelBubble`, `bubbling`, `Ti.App.fireEvent`
- **TableView**: `TableView`, `TableViewRow`, `setData`, `appendRow`, `className`
- **ListView**: `ItemTemplate`, `bindId`, `setItems`, `updateItemAt`, `marker`
- **Gestures**: `swipe`, `pinch`, `longpress`, `shake`, `accelerometer`
- **Animation**: `animate`, `create2DMatrix`, `create3DMatrix`, `autoreverse`
- **Fonts**: `fontFamily`, `PostScript`, `createAttributedString`, `ATTRIBUTE_`
- **Icons/Splash**: `DefaultIcon`, `appicon`, `nine-patch`, `drawable`, `splash`, `iTunesArtwork`, `adaptive`
- **Android**: `Action Bar`, `onCreateOptionsMenu`, `theme`, `Material3`, `talkback`
- **iOS**: `3D Touch`, `Popover`, `SplitWindow`, `badge`, `NavigationWindow`
- **Accessibility**: `accessibilityLabel`, `VoiceOver`, `TalkBack`, `accessibilityHidden`
