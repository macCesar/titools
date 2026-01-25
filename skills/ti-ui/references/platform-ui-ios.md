# iOS UI Components and Conventions

## 1. Overview

iOS offers several UI components and conventions that differ from Android. This guide covers iPad-specific controls, app badges, Settings integration, 3D Touch, and iOS-specific navigation patterns.

## 2. iPad-Only UI Components

### Popover

Popovers present content temporarily without taking over the entire screen. Used for menus, options, or detail views.

```javascript
var button = Ti.UI.createButton({
  title: 'Show popover',
  width: 250,
  height: 50,
  top: 30,
  right: 5
});

var popover = Ti.UI.iPad.createPopover({
  width: 300,
  height: 250,
  title: 'Popover Content',
  arrowDirection: Ti.UI.iPad.POPOVER_ARROW_DIRECTION_RIGHT
});

// Add content to popover
var popoverContent = Ti.UI.createView({
  backgroundColor: 'white'
});
popover.add(popoverContent);

button.addEventListener('click', function(e) {
  popover.show({
    view: button,  // Anchor to this view
    animated: true
  });
});

win.add(button);
```

### Arrow Direction Constants

```javascript
Ti.UI.iPad.POPOVER_ARROW_DIRECTION_UP
Ti.UI.iPad.POPOVER_ARROW_DIRECTION_DOWN
Ti.UI.iPad.POPOVER_ARROW_DIRECTION_LEFT
Ti.UI.iPad.POPOVER_ARROW_DIRECTION_RIGHT
Ti.UI.iPad.POPOVER_ARROW_DIRECTION_ANY
Ti.UI.iPad.POPOVER_ARROW_DIRECTION_UNKNOWN
```

### Popover Events

```javascript
popover.addEventListener('hide', function(e) {
  Ti.API.info('Popover hidden');
});

popover.addEventListener('show', function(e) {
  Ti.API.info('Popover shown');
});

// Dismiss programmatically
popover.hide();
```

### SplitWindow

SplitWindow manages master-detail interface (left pane list, right pane details). iPad only.

```javascript
// Master (left) window
var masterWin = Ti.UI.createWindow({
  backgroundColor: '#fff',
  title: 'Master'
});
masterWin.add(Ti.UI.createLabel({
  text: 'Master View - Select an item',
  font: { fontWeight: 'bold', fontSize: 16 }
}));

// Detail (right) window
var detailWin = Ti.UI.createWindow({
  backgroundColor: '#dfdfdf',
  title: 'Detail'
});
detailWin.add(Ti.UI.createLabel({
  text: 'Detail View - Item details',
  font: { fontWeight: 'bold', fontSize: 16 }
}));

// Create split window
var splitwin = Ti.UI.iPad.createSplitWindow({
  detailView: detailWin,
  masterView: masterWin,
  orientationModes: [
    Ti.UI.LANDSCAPE_LEFT,
    Ti.UI.LANDSCAPE_RIGHT
  ]
});

splitwin.open();
```

**Important**:
- Cannot control pane widths (system-managed)
- User cannot resize panes
- Top-level container (don't add to another Window)
- Inherits from Window object

### SplitWindow in Portrait

By default, master view hides in portrait. To show master view:

```javascript
splitwin.addEventListener('visible', function(e) {
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
var tabGroup = Ti.UI.createTabGroup();

var win1 = Ti.UI.createWindow({ title: 'Window 1' });

var tab1 = Ti.UI.createTab({
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

### Badge Use Cases

- Unread message count
- Pending notifications
- Task completion status
- Update availability indicator

## 4. Settings Integration

Apple recommends configuring app settings through the native Settings app rather than in-app controls.

### Settings Bundle Setup

**1. Create Settings.bundle**

Copy from KitchenSink or create manually in:
```
platform/iphone/Settings.bundle/
```

**2. Edit Root.plist**

Key structure:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>StringsTable</key>
  <string>Root</string>

  <!-- App preferences -->
  <key>PreferenceSpecifiers</key>
  <array>

    <!-- Text field -->
    <dict>
      <key>Type</key>
      <string>PSTextFieldSpecifier</string>
      <key>Title</key>
      <string>Name</string>
      <key>Key</key>
      <string>name_preference</string>
      <key>DefaultValue</key>
      <string></string>
    </dict>

    <!-- Toggle switch -->
    <dict>
      <key>Type</key>
      <string>PSToggleSwitchSpecifier</string>
      <key>Title</key>
      <string>Enabled</string>
      <key>Key</key>
      <string>enabled_preference</string>
      <key>DefaultValue</key>
      <true/>
    </dict>

  </array>
</dict>
</plist>
```

### Accessing Preferences in App

```javascript
// Must match the "Key" value from Root.plist
var name = Ti.App.Properties.getString('name_preference');
var enabled = Ti.App.Properties.getBool('enabled_preference');
```

**Important**: Always include `_preference` suffix in key names.

### Localization

Place localized strings in `i18n/<lang>/app.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<resources>
  <string name="name_preference">Your Name</string>
  <string name="enabled_preference">Enable Feature</string>
</resources>
```

## 5. 3D Touch (iOS 9+)

3D Touch requires:
- 3D Touch enabled device
- iOS 9 or later
- Testing on physical device (simulator doesn't support)

### Quick Actions (App Icon Shortcuts)

Press app icon firmly to reveal shortcuts. Can be static (always present) or dynamic (generated at runtime).

#### Static Quick Actions (tiapp.xml)

```xml
<ti:app>
  <ios>
    <plist>
      <dict>
        <key>UIApplicationShortcutItems</key>
        <array>
          <!-- Item 1: Default icon -->
          <dict>
            <key>UIApplicationShortcutItemIconType</key>
            <string>UIApplicationShortcutIconTypeAdd</string>
            <key>UIApplicationShortcutItemTitle</key>
            <string>Add New Item</string>
            <key>UIApplicationShortcutItemType</key>
            <string>com.myapp.add</string>
            <key>UIApplicationShortcutItemSubtitle</key>
            <string>Create new content</string>
          </dict>

          <!-- Item 2: Custom icon -->
          <dict>
            <!-- Find hash in build/iphone/Assets.xcassets -->
            <key>UIApplicationShortcutItemIconFile</key>
            <string>6ce9fb071294c440a20ff73b7c09fef2082c2206</string>
            <key>UIApplicationShortcutItemTitle</key>
            <string>Open Recent</string>
            <key>UIApplicationShortcutItemType</key>
            <string>com.myapp.recent</string>
            <!-- Custom data passed to event -->
            <key>UIApplicationShortcutItemUserInfo</key>
            <dict>
              <key>action</key>
              <string>open_recent</string>
            </dict>
          </dict>
        </array>
      </dict>
    </plist>
  </ios>
</ti:app>
```

#### Icon Types

```javascript
UIApplicationShortcutIconTypeCompose
UIApplicationShortcutIconTypeAdd
UIApplicationShortcutIconTypePlay
UIApplicationShortcutIconTypePause
UIApplicationShortcutIconTypeSearch
UIApplicationShortcutIconTypeProhibit
// ... and more
```

#### Dynamic Quick Actions

```javascript
if (Ti.UI.iOS.forceTouchSupported) {
  var appShortcuts = Ti.UI.iOS.createApplicationShortcuts();

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
Ti.App.iOS.addEventListener('shortcutitemclick', function(e) {
  Ti.API.info('Shortcut clicked: ' + e.itemtype);

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

  var preview = Alloy.createController('preview').getView();
  var detail = Alloy.createController('detail').getView();

  var shareAction = Ti.UI.iOS.createPreviewAction({
    title: "Share",
    style: Ti.UI.iOS.PREVIEW_ACTION_STYLE_DEFAULT
  });

  shareAction.addEventListener('click', function(e) {
    // Handle share action
  });

  var previewContext = Ti.UI.iOS.createPreviewContext({
    preview: preview,
    contentHeight: 400,
    actions: [shareAction]
  });

  previewContext.addEventListener('peek', function() {
    Ti.API.info('User started peeking');
  });

  previewContext.addEventListener('pop', function() {
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
var win1 = Ti.UI.createWindow({
  backgroundColor: 'white',
  title: 'First Window'
});

var navWindow = Ti.UI.createNavigationWindow({
  window: win1
});

// Open second window
var win2 = Ti.UI.createWindow({
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
var flexSpace = Ti.UI.createButton({
  systemButton: Ti.UI.iOS.SystemButton.FLEXIBLE_SPACE
});

var refreshButton = Ti.UI.createButton({
  title: 'Refresh'
});

var toolbar = Ti.UI.createToolbar({
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
var tabGroup = Ti.UI.createTabGroup();

var tab1 = Ti.UI.createTab({
  icon: 'home.png',
  title: 'Home',
  window: Ti.UI.createWindow({ backgroundColor: 'white' })
});

var tab2 = Ti.UI.createTab({
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
var activityIndicator = Ti.UI.createActivityIndicator({
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
var activityIndicator = Ti.UI.createActivityIndicator({
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
var doneButton = Ti.UI.createButton({
  systemButton: Ti.UI.iOS.SystemButton.DONE
});

// Use NavigationWindow animations
navWindow.openWindow(win2, {
  animated: true,
  transition: Ti.UI.iOS.NavigationWindowTransitionStyle.NONE
});

// Respect safe area (iPhone X+)
var view = Ti.UI.createView({
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
