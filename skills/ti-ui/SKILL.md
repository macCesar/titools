---
name: ti-ui
description: "Titanium SDK UI/UX patterns and components expert. Use when working with, reviewing, analyzing, or examining Titanium layouts, ListView/TableView performance optimization, event handling and bubbling, gestures (swipe, pinch), animations, accessibility (VoiceOver/TalkBack), orientation changes, custom fonts/icons, app icons/splash screens, or platform-specific UI (Action Bar, Navigation Bar)."
argument-hint: "[component]"
allowed-tools: Read, Grep, Glob, Edit, Write, Bash(node *)
---

# Titanium SDK UI expert

A practical guide to Titanium SDK UI. Covers layouts, event handling, animations, performance, and platform-specific components for iOS and Android.

## Project detection

:::info auto-detects titanium projects
This skill detects Titanium projects and provides UI guidance.

Detection happens automatically. You do not need to run a command.

Titanium project indicator:
- `tiapp.xml` (required for all Titanium projects)

Applicable to both:
- Alloy projects (app/ folder structure)
- Classic projects (Resources/ folder)

Behavior based on detection:
- Titanium detected: Provide UI guidance for Alloy and Classic, ListView/TableView patterns, and platform differences
- Not detected: State this is for Titanium projects only and skip UI guidance
:::

## Quick reference

| Topic                            | Reference                                                               |
| -------------------------------- | ----------------------------------------------------------------------- |
| App structures                   | [application-structures.md](references/application-structures.md)       |
| Layouts, positioning, units      | [layouts-and-positioning.md](references/layouts-and-positioning.md)     |
| Events, bubbling, lifecycle      | [event-handling.md](references/event-handling.md)                       |
| ScrollView vs ScrollableView     | [scrolling-views.md](references/scrolling-views.md)                     |
| TableView                        | [tableviews.md](references/tableviews.md)                               |
| ListView templates, performance  | [listviews-and-performance.md](references/listviews-and-performance.md) |
| Touch, swipe, pinch, gestures    | [gestures.md](references/gestures.md)                                   |
| Orientation handling             | [orientation.md](references/orientation.md)                             |
| Custom fonts, attributed strings | [custom-fonts-styling.md](references/custom-fonts-styling.md)           |
| Animations, 2D/3D matrices       | [animation-and-matrices.md](references/animation-and-matrices.md)       |
| Icons, splash screens, densities | [icons-and-splash-screens.md](references/icons-and-splash-screens.md)   |
| Android action bar, themes       | [platform-ui-android.md](references/platform-ui-android.md)             |
| iOS navigation, 3D Touch         | [platform-ui-ios.md](references/platform-ui-ios.md)                     |
| VoiceOver, TalkBack, a11y        | [accessibility-deep-dive.md](references/accessibility-deep-dive.md)     |

## Critical rules

### Performance
- Do not use `Ti.UI.SIZE` in ListViews. It causes jerky scrolling. Use fixed heights.
- Prefer ListView over TableView for new apps with large datasets.
- Batch updates with `applyProperties` to reduce bridge overhead.
- Avoid WebView inside TableView. It kills scrolling performance.

### iOS accessibility
- Do not set accessibility properties on container views. It blocks child interaction.
- Do not set `accessibilityLabel` on text controls on Android. It overrides visible text.

### Layout
- Use `dp` units for cross-platform consistency.
- Android ScrollView is vertical or horizontal, not both. Set `scrollType`.

### Platform-specific properties

:::danger critical: platform-specific properties require modifiers
Using `Ti.UI.iOS.*` or `Ti.UI.Android.*` properties without platform modifiers will crash cross-platform compilation.

Example of the damage:
```javascript
// Wrong: adds Ti.UI.iOS to an Android build
const win = Ti.UI.createWindow({
  statusBarStyle: Ti.UI.iOS.StatusBar.LIGHT_CONTENT
})
```

Correct approaches:

Option 1: TSS modifier (Alloy projects):
```tss
"#mainWindow[platform=ios]": {
  statusBarStyle: Ti.UI.iOS.StatusBar.LIGHT_CONTENT
}
```

Option 2: Conditional code:
```javascript
if (OS_IOS) {
  $.mainWindow.statusBarStyle = Ti.UI.iOS.StatusBar.LIGHT_CONTENT
}
```

Properties that always require platform modifiers:
- iOS: `statusBarStyle`, `modalStyle`, `modalTransitionStyle`, any `Ti.UI.iOS.*`
- Android: `actionBar` config, any `Ti.UI.Android.*` constant

For platform-specific UI patterns, see [platform-ui-ios.md](references/platform-ui-ios.md) and [platform-ui-android.md](references/platform-ui-android.md).
:::

### Event management
- Remove global listeners (`Ti.App`, `Ti.Gesture`, `Ti.Accelerometer`) on pause to save battery.
- Input events bubble up. System events do not.

### App architecture
- Limit tabs to 4 or fewer for better UX across platforms.
- Use NavigationWindow for iOS hierarchical navigation.
- Handle `androidback` to prevent unexpected exits.

## Platform differences summary

| Feature                | iOS                          | Android                 |
| ---------------------- | ---------------------------- | ----------------------- |
| 3D Matrix              | Full support                 | No support              |
| Pinch gesture          | Full support                 | Limited                 |
| ScrollView             | Bidirectional                | Unidirectional          |
| TableView              | Full support                 | Full support            |
| ListView               | Full support                 | Full support            |
| Default template image | Left side                    | Right side              |
| ListView action items  | Swipe actions                | No                      |
| Modal windows          | Fills screen, covers tab bar | No effect (always full) |
| Navigation pattern     | NavigationWindow             | Back button + Menu      |

## UI design workflow

1. Choose app structure: tab-based or window-based
2. Pick a layout mode: composite, vertical, or horizontal
3. Decide sizing: `SIZE` or `FILL` based on component defaults
4. Plan events: bubbling, app-level events, lifecycle
5. Optimize performance: templates, batch updates
6. Apply accessibility per platform
7. Add motion: animations, 2D/3D transforms, transitions

## Searching references

When you need specific patterns, grep these terms in the reference files:
- App structure: `TabGroup`, `NavigationWindow`, `modal`, `execution context`, `androidback`
- Layouts: `dp`, `Ti.UI.SIZE`, `Ti.UI.FILL`, `composite`, `vertical`, `horizontal`
- Events: `addEventListener`, `cancelBubble`, `bubbling`, `Ti.App.fireEvent`
- TableView: `TableView`, `TableViewRow`, `setData`, `appendRow`, `className`
- ListView: `ItemTemplate`, `bindId`, `setItems`, `updateItemAt`, `marker`
- Gestures: `swipe`, `pinch`, `longpress`, `shake`, `accelerometer`
- Animation: `animate`, `create2DMatrix`, `create3DMatrix`, `autoreverse`
- Fonts: `fontFamily`, `PostScript`, `createAttributedString`, `ATTRIBUTE_`
- Icons/splash: `DefaultIcon`, `appicon`, `nine-patch`, `drawable`, `splash`, `iTunesArtwork`, `adaptive`
- Android: `Action Bar`, `onCreateOptionsMenu`, `theme`, `Material3`, `talkback`
- iOS: `3D Touch`, `Popover`, `SplitWindow`, `badge`, `NavigationWindow`
- Accessibility: `accessibilityLabel`, `VoiceOver`, `TalkBack`, `accessibilityHidden`

## Related skills

For work beyond UI components, use these skills:

| Task                                            | Use this skill |
| ----------------------------------------------- | -------------- |
| Project architecture, services, memory cleanup  | `ti-expert`    |
| Native features (camera, location, push, media) | `ti-howtos`    |
| Alloy MVC, data binding, widgets                | `alloy-guides` |
