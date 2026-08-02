# iOS UI components and conventions

<!-- TOC-START -->
## Contents

- [1. Overview](#1-overview)
- [2. iPad-only UI components](#2-ipad-only-ui-components)
- [3. Badges](#3-badges)
- [4. Settings.bundle integration](#4-settingsbundle-integration)
- [5. Quick Actions and 3D Touch](#5-quick-actions-and-3d-touch)
- [6. Navigation bar (iOS)](#6-navigation-bar-ios)
- [Community-Discovered Patterns](#community-discovered-patterns)
- [7. Tab bar](#7-tab-bar)
- [8. Activity indicator](#8-activity-indicator)
- [9. Platform best practices](#9-platform-best-practices)
- [10. Common issues](#10-common-issues)

<!-- TOC-END -->

## 1. Overview

iOS has UI components and patterns that differ from Android. This guide covers iPad-only controls, badges, Settings integration, 3D Touch, and iOS navigation patterns.

## 2. iPad-only UI components

### Popover

Popovers show temporary content without taking over the whole screen. Use them for menus, options, or detail views.

```javascript
const button = Ti.UI.createButton({
  title: 'Show popover',
  width: 250,
  height: 50,
  top: 30,
  right: 5
});

const popover = Ti.UI.iPad.createPopover({
  width: 300,
  height: 250,
  title: 'Popover Content',
  arrowDirection: Ti.UI.iPad.POPOVER_ARROW_DIRECTION_RIGHT
});

// Add content to popover
const popoverContent = Ti.UI.createView({
  backgroundColor: 'white'
});
popover.add(popoverContent);

button.addEventListener('click', () => {
  popover.show({
    view: button,  // Anchor to this view
    animated: true
  });
});

win.add(button);
```

### Popover events

```javascript
popover.addEventListener('hide', () => {
  Ti.API.info('Popover hidden');
});

popover.addEventListener('show', () => {
  Ti.API.info('Popover shown');
});

// Dismiss programmatically
popover.hide();
```

### SplitWindow

SplitWindow manages a master-detail layout (left list, right detail). It is iPad only.

```javascript
// Master (left) window
const masterWin = Ti.UI.createWindow({
  backgroundColor: '#fff',
  title: 'Master'
});
masterWin.add(Ti.UI.createLabel({
  text: 'Master View - Select an item',
  font: { fontWeight: 'bold', fontSize: 16 }
}));

// Detail (right) window
const detailWin = Ti.UI.createWindow({
  backgroundColor: '#dfdfdf',
  title: 'Detail'
});
detailWin.add(Ti.UI.createLabel({
  text: 'Detail View - Item details',
  font: { fontWeight: 'bold', fontSize: 16 }
}));

// Create split window
const splitwin = Ti.UI.iPad.createSplitWindow({
  detailView: detailWin,
  masterView: masterWin,
  orientationModes: [
    Ti.UI.LANDSCAPE_LEFT,
    Ti.UI.LANDSCAPE_RIGHT
  ]
});

splitwin.open();
```

### SplitWindow in portrait

By default, the master view is hidden in portrait. To show it:

```javascript
splitwin.addEventListener('visible', (e) => {
  if (e.view === 'master' && !e.visible) {
    // Master is hidden, show it in a popover or navigation
    splitwin.showMasterViewInPopover();
  }
});
```

## 3. Badges

### App icon badge

```javascript
// Set badge to number
Ti.UI.iOS.appBadge = 23;

// Remove badge (set to null, not 0)
Ti.UI.iOS.appBadge = null;

// Note: Setting to 0 still displays "0"
```

### Tab badge

```javascript
const tabGroup = Ti.UI.createTabGroup();

const win1 = Ti.UI.createWindow({ title: 'Window 1' });

const tab1 = Ti.UI.createTab({
  icon: 'myIcon.png',
  title: 'Tab 1',
  window: win1,
  badge: 10  // Show badge with number
});

// Update badge
tab1.setBadge(5);
tab1.badge = 5;

// Clear badge
tab1.setBadge(null);
tab1.badge = null;
```

## 4. Settings.bundle integration

iOS apps can expose user settings in the Settings app using a Settings.bundle.

Setup:
- Place the bundle at `platform/iphone/Settings.bundle/` (SDK 1.8+)
- The bundle contains `Root.plist`, which defines the settings UI (toggles, text fields, groups, etc.)
- Edit `Root.plist` using Xcode's Property List editor for a visual interface

Key conventions: Settings keys typically use the `_preference` suffix, for example `username_preference` or `enabled_preference`.

### Access preferences in the app

```javascript
// Read a preference set in iOS Settings app
const username = Ti.App.Properties.getString('username_preference');

// Must match the "Key" value from Root.plist
const name = Ti.App.Properties.getString('name_preference');
const enabled = Ti.App.Properties.getBool('enabled_preference');
```

## 5. Quick Actions and 3D Touch

### Static Quick Actions (via tiapp.xml)

Static shortcuts are defined in `tiapp.xml` and available immediately after install.

- Required keys: `UIApplicationShortcutItemTitle`, `UIApplicationShortcutItemType`
- Optional keys: `UIApplicationShortcutItemSubtitle`, `UIApplicationShortcutItemIconType`, `UIApplicationShortcutItemIconFile`, `UIApplicationShortcutItemUserInfo`

```xml
<ios>
  <plist>
    <dict>
      <key>UIApplicationShortcutItems</key>
      <array>
        <dict>
          <key>UIApplicationShortcutItemTitle</key>
          <string>New Message</string>
          <key>UIApplicationShortcutItemType</key>
          <string>com.app.newmessage</string>
          <key>UIApplicationShortcutItemIconType</key>
          <string>UIApplicationShortcutIconTypeCompose</string>
        </dict>
      </array>
    </dict>
  </plist>
</ios>
```

Quick action titles and subtitles can be localized using `i18n/LANG/app.xml` (not `strings.xml`). Use the localized key as the value in `tiapp.xml`.

To use custom images for quick action icons, enable app thinning in `tiapp.xml` with `<use-app-thinning>true</use-app-thinning>` inside the `<ios>` element.

### Dynamic Quick Actions

```javascript
if (Ti.UI.iOS.forceTouchSupported) {
  const appShortcuts = Ti.UI.iOS.createApplicationShortcuts();

  appShortcuts.addDynamicShortcut({
    itemtype: 'com.myapp.share',
    title: 'Share Photo',
    subtitle: 'Share last photo',
    icon: Ti.UI.iOS.SHORTCUT_ICON_TYPE_SHARE,
    userInfo: {
      action: 'share_photo',
      photoId: '123'
    }
  });

  // Remove specific shortcut
  appShortcuts.removeDynamicShortcut('com.myapp.share');

  // Remove all dynamic shortcuts
  appShortcuts.removeAllDynamicShortcuts();
}
```

### Handle quick actions

```javascript
Ti.App.iOS.addEventListener('shortcutitemclick', (e) => {
  Ti.API.info(`Shortcut clicked: ${e.itemtype}`);

  switch (e.itemtype) {
    case 'com.myapp.add':
      addNewItem();
      break;
    case 'com.myapp.recent':
      openRecent();
      break;
    case 'com.myapp.share':
      sharePhoto(e.userInfo.photoId);
      break;
  }
});
```

### Peek and pop

Peek shows a preview, Pop opens the full view.

#### Enable peek and pop

```javascript
if (Ti.UI.iOS.forceTouchSupported) {

  const preview = Alloy.createController('preview').getView();
  const detail = Alloy.createController('detail').getView();

  const shareAction = Ti.UI.iOS.createPreviewAction({
    title: 'Share',
    style: Ti.UI.iOS.PREVIEW_ACTION_STYLE_DEFAULT
  });

  shareAction.addEventListener('click', () => {
    // Handle share action
  });

  const previewContext = Ti.UI.iOS.createPreviewContext({
    preview: preview,
    contentHeight: 400,
    actions: [shareAction]
  });

  previewContext.addEventListener('peek', () => {
    Ti.API.info('User started peeking');
  });

  previewContext.addEventListener('pop', () => {
    Ti.API.info('User popped to full view');
    detail.open();
  });

  // Attach to view
  $.peekView.previewContext = previewContext;
}
```

#### Preview action styles

```javascript
Ti.UI.iOS.PREVIEW_ACTION_STYLE_DEFAULT
Ti.UI.iOS.PREVIEW_ACTION_STYLE_SELECTED  // Blue background
Ti.UI.iOS.PREVIEW_ACTION_STYLE_DESTRUCTIVE  // Red background
```

#### Peek and pop details

- Use `contentHeight` on the preview context to control preview height (for example `contentHeight: 400`).
- Use `Ti.UI.iOS.createPreviewActionGroup()` to group related preview actions into a submenu:

```javascript
const subAction1 = Ti.UI.iOS.createPreviewAction({ title: 'Copy', style: Ti.UI.iOS.PREVIEW_ACTION_STYLE_DEFAULT });
const subAction2 = Ti.UI.iOS.createPreviewAction({ title: 'Move', style: Ti.UI.iOS.PREVIEW_ACTION_STYLE_DEFAULT });

const actionGroup = Ti.UI.iOS.createPreviewActionGroup({
  title: 'Organize',
  style: Ti.UI.iOS.PREVIEW_ACTION_STYLE_DEFAULT,
  actions: [subAction1, subAction2]
});
```

Important: 3D Touch features (peek and pop, quick actions with force) can only be tested on physical devices with 3D Touch hardware. The iOS Simulator does not support force touch.

## 6. Navigation bar (iOS)

### NavigationWindow

```javascript
const win1 = Ti.UI.createWindow({
  backgroundColor: 'white',
  title: 'First Window'
});

const navWindow = Ti.UI.createNavigationWindow({
  window: win1
});

// Open second window
const win2 = Ti.UI.createWindow({
  backgroundColor: 'gray',
  title: 'Second Window'
});

navWindow.openWindow(win2, { animated: true });

// Close to go back
win2.close();

// Hide navigation bar
win1.navBarHidden = true;
```

## Community-Discovered Patterns

### Large Titles + ScrollView: required property triad (iOS)

When using `largeTitleEnabled: true` with a `ScrollView` inside a `NavigationWindow`, three Window properties must be set together. Without all three, the ScrollView content overlaps behind the navigation bar.

```javascript
const win = Ti.UI.createWindow({
  title: 'My Screen',
  largeTitleEnabled: true,
  largeTitleDisplayMode: Ti.UI.iOS.LARGE_TITLE_DISPLAY_MODE_AUTOMATIC,
  extendEdges: [Ti.UI.EXTEND_EDGE_ALL],
  autoAdjustScrollViewInsets: true,
  barColor: '#1e293b',
  backgroundColor: '#0f172a'
});

const scrollView = Ti.UI.createScrollView({
  layout: 'vertical',
  contentWidth: Ti.UI.FILL,
  contentHeight: Ti.UI.SIZE
});

scrollView.add(Ti.UI.createLabel({ text: 'Content here' }));
win.add(scrollView);
navWindow.openWindow(win);
```

| Property | Purpose | What breaks without it |
|---|---|---|
| `largeTitleEnabled: true` | Large title that collapses on scroll | No large title behavior |
| `extendEdges: [Ti.UI.EXTEND_EDGE_ALL]` | Content renders behind bars (blur/translucent effect) | Large title renders with visible delay (empty nav bar gap appears first, then title draws) |
| `autoAdjustScrollViewInsets: true` | Automatically adjusts ScrollView insets | Content overlaps behind the nav bar |

> **Why all three?** `extendEdges` tells iOS to extend content behind the navigation bar. `autoAdjustScrollViewInsets` tells iOS to compensate by adjusting the ScrollView's content insets so content starts below the bar. Without `extendEdges`, there is nothing to adjust — and the large title renders with a visible delay as iOS cannot calculate the full layout upfront. Without `autoAdjustScrollViewInsets`, the content sits behind the bar. They are interdependent.

`largeTitleDisplayMode` controls collapse behavior:
- `LARGE_TITLE_DISPLAY_MODE_AUTOMATIC` (default) — inherits from previous window; collapses on scroll
- `LARGE_TITLE_DISPLAY_MODE_ALWAYS` — title stays large regardless of scroll position
- `LARGE_TITLE_DISPLAY_MODE_NEVER` — always standard title size

#### Works with both NavigationWindow and TabGroup

On iOS, TabGroup wraps each Tab in an implicit NavigationWindow. The same three properties apply to Windows inside both standalone NavigationWindow and TabGroup Tabs. Child windows opened via `navWindow.openWindow()` or from within a Tab inherit the large title behavior when using `LARGE_TITLE_DISPLAY_MODE_AUTOMATIC`.

#### Recommended: global defaults

Instead of repeating the properties on every Window, set them as global defaults:

```javascript
// app.tss (Alloy)
'Window[platform=ios]': {
  autoAdjustScrollViewInsets: true,
  extendEdges: [Ti.UI.EXTEND_EDGE_ALL]
}
```

Then only add `largeTitleEnabled` and `largeTitleDisplayMode` per-window as needed.

> **Note:** The official docs only document the `largeTitleEnabled` + `extendEdges` pair for RefreshControl flicker prevention. The full triad for ScrollView content positioning is not in official documentation.

See also: [scrolling-views.md](scrolling-views.md) for ScrollView properties and patterns.

### Toolbar

```javascript
const flexSpace = Ti.UI.createButton({
  systemButton: Ti.UI.iOS.SystemButton.FLEXIBLE_SPACE
});

const refreshButton = Ti.UI.createButton({
  title: 'Refresh'
});

const toolbar = Ti.UI.createToolbar({
  items: [refreshButton, flexSpace],
  bottom: 0
});

win.add(toolbar);
```

### System buttons

```javascript
Ti.UI.iOS.SystemButton.DONE
Ti.UI.iOS.SystemButton.CANCEL
Ti.UI.iOS.SystemButton.EDIT
Ti.UI.iOS.SystemButton.SAVE
Ti.UI.iOS.SystemButton.ADD
Ti.UI.iOS.SystemButton.FLEXIBLE_SPACE
Ti.UI.iOS.SystemButton.FIXED_SPACE
// ... and more
```

## 7. Tab bar

### Create a tab bar

```javascript
const tabGroup = Ti.UI.createTabGroup();

const tab1 = Ti.UI.createTab({
  icon: 'home.png',
  title: 'Home',
  window: Ti.UI.createWindow({ backgroundColor: 'white' })
});

const tab2 = Ti.UI.createTab({
  icon: 'settings.png',
  title: 'Settings',
  window: Ti.UI.createWindow({ backgroundColor: 'gray' })
});

tabGroup.addTab(tab1);
tabGroup.addTab(tab2);

tabGroup.open();
```

### Tab bar customization (iOS)

```javascript
tabGroup.setActiveTabIconColor('blue');
tabGroup.setActiveTabColor('#f0f0f0');

// Hide tab bar on specific window
win1.tabBarHidden = true;

// Set tab bar style (deprecated in iOS 13+)
tabGroup.tabsStyle = Ti.UI.iOS.TABS_STYLE_BOTTOM;
```

## 8. Activity indicator

```javascript
const activityIndicator = Ti.UI.createActivityIndicator({
  message: 'Loading...',
  color: 'white',
  backgroundColor: '#333',
  font: { fontSize: 16, fontWeight: 'bold' }
});

activityIndicator.show();

// Later
activityIndicator.hide();
```

### iOS-specific location

```javascript
const activityIndicator = Ti.UI.createActivityIndicator({
  message: 'Loading...',
  location: Ti.UI.iOS.ACTIVITY_INDICATOR_DIALOG,
  opacity: 0.8
});
```

## 9. Platform best practices

### Follow iOS Human Interface Guidelines

- Use NavigationWindow for hierarchical navigation
- Use Tab Bar for top-level categories
- Present modal views for focused tasks
- Use Popovers for auxiliary content (iPad)
- Respect 3D Touch conventions

### iOS-specific patterns

```javascript
// Use system buttons for standard actions
const doneButton = Ti.UI.createButton({
  systemButton: Ti.UI.iOS.SystemButton.DONE
});

// Use NavigationWindow animations
navWindow.openWindow(win2, {
  animated: true,
  transition: Ti.UI.iOS.NavigationWindowTransitionStyle.NONE
});

// Respect safe area (iPhone X+)
const view = Ti.UI.createView({
  top: Ti.Platform.displayCaps.platformHeight > 800 ? 44 : 20  // Account for notch
});
```

## 10. Common issues

### Settings not appearing

Problem: Settings are not visible in the Settings app.

Solutions:
1. Clean and rebuild the project
2. Check plist syntax
3. Ensure Settings.bundle is in `platform/iphone/`
4. Kill and relaunch the Settings app

### 3D Touch not working

Problem: 3D Touch features do not respond.

Solutions:
1. Test on a physical device with 3D Touch hardware
2. Check `Ti.UI.iOS.forceTouchSupported` before using
3. Ensure iOS 9 or later
4. Verify `previewContext` is properly attached

### SplitWindow issues

Problem: Master view is not visible in portrait.

Solution: This is default behavior. Use `showMasterViewInPopover()` or handle it via NavigationWindow.
