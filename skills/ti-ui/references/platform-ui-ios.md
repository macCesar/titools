# iOS UI Components and Conventions

## Table of Contents

- [iOS UI Components and Conventions](#ios-ui-components-and-conventions)
  - [Table of Contents](#table-of-contents)
  - [1. Overview](#1-overview)
  - [2. iPad-Only UI Components](#2-ipad-only-ui-components)
    - [Popover](#popover)
    - [Popover Events](#popover-events)
    - [SplitWindow](#splitwindow)
    - [SplitWindow in Portrait](#splitwindow-in-portrait)
  - [3. Badges](#3-badges)
    - [App Icon Badge](#app-icon-badge)
    - [Tab Badge](#tab-badge)
    - [Accessing Preferences in App](#accessing-preferences-in-app)
      - [Dynamic Quick Actions](#dynamic-quick-actions)
      - [Handling Quick Actions](#handling-quick-actions)
    - [Peek and Pop](#peek-and-pop)
      - [Enabling Peek and Pop](#enabling-peek-and-pop)
      - [Preview Action Styles](#preview-action-styles)
  - [6. Navigation Bar (iOS)](#6-navigation-bar-ios)
    - [NavigationWindow](#navigationwindow)
    - [Toolbar](#toolbar)
    - [System Buttons](#system-buttons)
  - [7. Tab Bar](#7-tab-bar)
    - [Creating Tab Bar](#creating-tab-bar)
    - [Tab Bar Customization (iOS)](#tab-bar-customization-ios)
  - [8. Activity Indicator](#8-activity-indicator)
    - [iOS-Specific Location](#ios-specific-location)
  - [9. Platform Best Practices](#9-platform-best-practices)
    - [Follow iOS Human Interface Guidelines](#follow-ios-human-interface-guidelines)
    - [iOS-Specific Patterns](#ios-specific-patterns)
  - [10. Common Issues](#10-common-issues)
    - [Settings Not Appearing](#settings-not-appearing)
    - [3D Touch Not Working](#3d-touch-not-working)
    - [SplitWindow Issues](#splitwindow-issues)

---

## 1. Overview

iOS offers several UI components and conventions that differ from Android. This guide covers iPad-specific controls, app badges, Settings integration, 3D Touch, and iOS-specific navigation patterns.

## 2. iPad-Only UI Components

### Popover

Popovers present content temporarily without taking over the entire screen. Used for menus, options, or detail views.

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

button.addEventListener('click', (e) => {
  popover.show({
    view: button,  // Anchor to this view
    animated: true
  });
});

win.add(button);
```
...
### Popover Events

```javascript
popover.addEventListener('hide', (e) => {
  Ti.API.info('Popover hidden');
});

popover.addEventListener('show', (e) => {
  Ti.API.info('Popover shown');
});

// Dismiss programmatically
popover.hide();
```

### SplitWindow

SplitWindow manages master-detail interface (left pane list, right pane details). iPad only.

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
...
### SplitWindow in Portrait

By default, master view hides in portrait. To show master view:

```javascript
splitwin.addEventListener('visible', (e) => {
  if (e.view === 'master' && !e.visible) {
    // Master is hidden, show it in a popover or navigation
    splitwin.showMasterViewInPopover();
  }
});
```

## 3. Badges

### App Icon Badge

```javascript
// Set badge to number
Ti.UI.iOS.appBadge = 23;

// Remove badge (set to null, not 0)
Ti.UI.iOS.appBadge = null;

// Note: Setting to 0 still displays "0"
```

### Tab Badge

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
...
### Accessing Preferences in App

```javascript
// Must match the "Key" value from Root.plist
const name = Ti.App.Properties.getString('name_preference');
const enabled = Ti.App.Properties.getBool('enabled_preference');
```
...
#### Dynamic Quick Actions

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

#### Handling Quick Actions

```javascript
Ti.App.iOS.addEventListener('shortcutitemclick', (e) => {
  Ti.API.info(`Shortcut clicked: ${e.itemtype}`);

  switch(e.itemtype) {
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

### Peek and Pop

Peek provides a preview of content, Pop opens it fully.

#### Enabling Peek and Pop

```javascript
if (Ti.UI.iOS.forceTouchSupported) {

  const preview = Alloy.createController('preview').getView();
  const detail = Alloy.createController('detail').getView();

  const shareAction = Ti.UI.iOS.createPreviewAction({
    title: "Share",
    style: Ti.UI.iOS.PREVIEW_ACTION_STYLE_DEFAULT
  });

  shareAction.addEventListener('click', (e) => {
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

#### Preview Action Styles

```javascript
Ti.UI.iOS.PREVIEW_ACTION_STYLE_DEFAULT
Ti.UI.iOS.PREVIEW_ACTION_STYLE_SELECTED  // Blue background
Ti.UI.iOS.PREVIEW_ACTION_STYLE_DESTRUCTIVE  // Red background
```

## 6. Navigation Bar (iOS)

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

### System Buttons

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

## 7. Tab Bar

### Creating Tab Bar

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

### Tab Bar Customization (iOS)

```javascript
tabGroup.setActiveTabIconColor('blue');
tabGroup.setActiveTabColor('#f0f0f0');

// Hide tab bar on specific window
win1.tabBarHidden = true;

// Set tab bar style (deprecated in iOS 13+)
tabGroup.tabsStyle = Ti.UI.iOS.TABS_STYLE_BOTTOM;
```

## 8. Activity Indicator

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

### iOS-Specific Location

```javascript
const activityIndicator = Ti.UI.createActivityIndicator({
  message: 'Loading...',
  location: Ti.UI.iOS.ACTIVITY_INDICATOR_DIALOG,
  opacity: 0.8
});
```

## 9. Platform Best Practices

### Follow iOS Human Interface Guidelines

- Use NavigationWindow for hierarchical navigation
- Use Tab Bar for top-level categories
- Present modal views for focused tasks
- Use Popovers for auxiliary content (iPad)
- Respect 3D Touch conventions

### iOS-Specific Patterns

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

## 10. Common Issues

### Settings Not Appearing

**Problem**: Settings not visible in Settings app

**Solutions**:
1. Clean and rebuild project
2. Check plist syntax
3. Ensure Settings.bundle is in platform/iphone/
4. Kill and relaunch Settings app

### 3D Touch Not Working

**Problem**: 3D Touch features don't respond

**Solutions**:
1. Must test on physical 3D Touch device
2. Check `Ti.UI.iOS.forceTouchSupported` before using
3. Ensure iOS 9 or later
4. Verify `previewContext` is properly attached

### SplitWindow Issues

**Problem**: Master view not visible in portrait

**Solution**: This is default behavior. Use `showMasterViewInPopover()` or handle via NavigationWindow.
