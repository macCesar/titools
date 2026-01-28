---
name: ti-ui
description: "UI/UX patterns and components. Use when working with layouts, ListView/TableView performance optimization, event handling and bubbling, gestures (swipe, pinch), animations, accessibility (VoiceOver/TalkBack), orientation changes, custom fonts/icons, app icons/splash screens, or platform-specific UI (Action Bar, Navigation Bar)."
argument-hint: "[component]"
allowed-tools: Read, Grep, Glob, Edit, Write, Bash(node *)
---

# Titanium SDK UI Expert

Comprehensive expert covering all official Titanium SDK UI how-to guides. Provides guidance on cross-platform UI/UX, event handling, animations, performance optimization, and platform-specific components.

## Project Detection

:::info AUTO-DETECTS TITANIUM PROJECTS
This skill automatically detects Titanium projects when invoked and provides UI/UX component guidance.

**Detection occurs automatically** - no manual command needed.

**Titanium project indicator:**
- `tiapp.xml` file (required for all Titanium projects)

**Applicable to BOTH:**
- **Alloy projects** (app/ folder structure)
- **Classic projects** (Resources/ folder)

**Behavior based on detection:**
- **Titanium detected** → Provides UI component guidance for both Alloy and Classic, ListView/TableView patterns, platform-specific UI differences
- **Not detected** → Indicates this is for Titanium projects only, does NOT provide Titanium UI guidance
:::

## Table of Contents

- [Titanium SDK UI Expert](#titanium-sdk-ui-expert)
  - [Project Detection](#project-detection)
  - [Table of Contents](#table-of-contents)
  - [Quick Reference](#quick-reference)
  - [Critical Rules (Low Freedom)](#critical-rules-low-freedom)
    - [Performance](#performance)
    - [iOS Accessibility](#ios-accessibility)
    - [Layout](#layout)
    - [Platform-Specific Properties](#platform-specific-properties)
    - [Event Management](#event-management)
    - [App Architecture](#app-architecture)
  - [Platform Differences Summary](#platform-differences-summary)
  - [UI Design Workflow](#ui-design-workflow)
  - [Searching References](#searching-references)
  - [Related Skills](#related-skills)

---

## Quick Reference

| Topic                            | Reference                                                               |
| -------------------------------- | ----------------------------------------------------------------------- |
| **App Structures**               | [application-structures.md](references/application-structures.md)       |
| Layouts, positioning, units      | [layouts-and-positioning.md](references/layouts-and-positioning.md)     |
| Events, bubbling, lifecycle      | [event-handling.md](references/event-handling.md)                       |
| ScrollView vs ScrollableView     | [scrolling-views.md](references/scrolling-views.md)                     |
| **TableView**                    | [tableviews.md](references/tableviews.md)                               |
| ListView templates & performance | [listviews-and-performance.md](references/listviews-and-performance.md) |
| Touch, swipe, pinch, gestures    | [gestures.md](references/gestures.md)                                   |
| Orientation handling             | [orientation.md](references/orientation.md)                             |
| Custom fonts, attributed strings | [custom-fonts-styling.md](references/custom-fonts-styling.md)           |
| Animations, 2D/3D matrices       | [animation-and-matrices.md](references/animation-and-matrices.md)       |
| Icons, splash screens, densities | [icons-and-splash-screens.md](references/icons-and-splash-screens.md)   |
| Android Action Bar, themes       | [platform-ui-android.md](references/platform-ui-android.md)             |
| iOS Navigation, 3D Touch         | [platform-ui-ios.md](references/platform-ui-ios.md)                     |
| VoiceOver, TalkBack, a11y        | [accessibility-deep-dive.md](references/accessibility-deep-dive.md)     |

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

### Platform-Specific Properties

:::danger CRITICAL: Platform-Specific Properties Require Modifiers
Using `Ti.UI.iOS.*` or `Ti.UI.Android.*` properties WITHOUT platform modifiers causes cross-platform compilation failures.

**Example of the damage:**
```javascript
// ❌ WRONG - Adds Ti.UI.iOS to Android project
const win = Ti.UI.createWindow({
  statusBarStyle: Ti.UI.iOS.StatusBar.LIGHT_CONTENT  // FAILS on Android!
})
```

**CORRECT approaches:**

**Option 1 - TSS modifier (Alloy projects):**
```tss
"#mainWindow[platform=ios]": {
  statusBarStyle: Ti.UI.iOS.StatusBar.LIGHT_CONTENT
}
```

**Option 2 - Conditional code:**
```javascript
if (OS_IOS) {
  $.mainWindow.statusBarStyle = Ti.UI.iOS.StatusBar.LIGHT_CONTENT
}
```

**Properties that ALWAYS require platform modifiers:**
- iOS: `statusBarStyle`, `modalStyle`, `modalTransitionStyle`, any `Ti.UI.iOS.*`
- Android: `actionBar` config, any `Ti.UI.Android.*` constant

**For complete platform-specific UI patterns, see** [Platform UI - iOS](references/platform-ui-ios.md) and [Platform UI - Android](references/platform-ui-android.md).
:::

### Event Management
- **Remove global listeners** (`Ti.App`, `Ti.Gesture`, `Ti.Accelerometer`) on pause to save battery.
- **Event bubbling**: Input events bubble up; system events do not.

### App Architecture
- **Limit tabs to 4 or less** for better UX across platforms.
- **Use NavigationWindow for iOS** hierarchical navigation.
- **Handle androidback** to prevent unexpected app exits.

## Platform Differences Summary

| Feature                | iOS                          | Android                 |
| ---------------------- | ---------------------------- | ----------------------- |
| 3D Matrix              | ✅ Full support               | ❌ No                    |
| Pinch gesture          | ✅ Full support               | ⚠️ Limited               |
| ScrollView             | Bidirectional                | Unidirectional          |
| TableView              | ✅ Full support               | ✅ Full support          |
| ListView               | ✅ Full support               | ✅ Full support          |
| Default template image | Left side                    | Right side              |
| ListView action items  | ✅ Swipe actions              | ❌ No                    |
| Modal windows          | Fills screen, covers tab bar | No effect (always full) |
| Navigation pattern     | NavigationWindow             | Back button + Menu      |

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

## Related Skills

For tasks beyond UI components, use these complementary skills:

| Task                                            | Use This Skill |
| ----------------------------------------------- | -------------- |
| Project architecture, services, memory cleanup  | `alloy-expert` |
| Native features (camera, location, push, media) | `ti-howtos`    |
| Alloy MVC, data binding, widgets                | `alloy-guides` |
