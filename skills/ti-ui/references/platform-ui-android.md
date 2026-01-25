# Android UI Components and Conventions

## 1. Action Bar

### Overview

The Action Bar is a key Android UI component that appears at the top of the screen. It provides actions, navigation, and app branding.

### Enabling Action Bar

**In tiapp.xml**:

```xml
<android>
  <manifest>
    <application>
      <activity android:name=".MyActivity"
                android:configChanges="keyboard|keyboardHidden|orientation|screenLayout|uiMode">
        <intent-filter>
          <action android:name="android.intent.action.MAIN" />
          <category android:name="android.intent.category.LAUNCHER" />
        </intent-filter>
      </activity>
    </application>
  </manifest>
</android>
```

### Creating Action Bar (Programmatic)

```javascript
var activity = Ti.Android.currentActivity;

activity.onCreateOptionsMenu = function(e) {
  var menu = e.menu;

  // Add "Refresh" action
  var refreshItem = menu.add({
    title: 'Refresh',
    icon: Ti.Android.R.drawable.ic_menu_refresh,
    showAsAction: Ti.Android.SHOW_AS_ACTION_IF_ROOM,
    itemId: 1
  });

  // Add "Settings" action
  var settingsItem = menu.add({
    title: 'Settings',
    icon: Ti.Android.R.drawable.ic_menu_preferences,
    showAsAction: Ti.Android.SHOW_AS_ACTION_IF_ROOM,
    itemId: 2
  });

  // Add "Search" action (shown as collapsible action view)
  var searchItem = menu.add({
    title: 'Search',
    icon: Ti.Android.R.drawable.ic_menu_search,
    actionView: Ti.UI.createSearchBar({
      showCancel: true
    }),
    itemId: 3,
    expandActionView: Ti.Android.COLLAPSE_ACTION_VIEW_IF_ROOM
  });
};

activity.onOptionsItemSelected = function(e) {
  switch (e.itemId) {
    case 1:
      refreshData();
      return true;
    case 2:
      openSettings();
      return true;
    case 3:
      // Search action - handled by SearchBar
      return true;
  }
  return false;
};

activity.onPrepareOptionsMenu = function(e) {
  // Update menu items before showing
  var menu = e.menu;
  // Modify items based on state
};
```

### Action Bar with App Icon

```javascript
var activity = Ti.Android.currentActivity;

activity.onCreateOptionsMenu = function(e) {
  var menu = e.menu;

  // App icon on left
  var appIcon = menu.addMenuItem({
    title: 'My App',
    icon: Ti.App.Android.R.drawable.app_icon,
    itemId: 0
  });
  appIcon.setEnabled(false);  // Not clickable, just branding
};
```

### Action View (Custom Layout)

```javascript
activity.onCreateOptionsMenu = function(e) {
  var menu = e.menu;

  // Custom action view with button
  var actionView = Ti.UI.createView({
    height: Ti.UI.FILL,
    backgroundColor: '#4CAF50',
    layout: 'horizontal'
  });

  var actionButton = Ti.UI.createButton({
    title: 'Action',
    color: 'white',
    height: Ti.UI.FILL,
    width: Ti.UI.SIZE
  });

  actionButton.addEventListener('click', function() {
    performAction();
  });

  actionView.add(actionButton);

  var actionItem = menu.add({
    title: 'Custom',
    actionView: actionView,
    showAsAction: Ti.Android.SHOW_AS_ACTION_ALWAYS,
    itemId: 10
  });
};
```

## 2. Android Themes

### Overview

Themes control the visual style of Android apps. Titanium 10.0.0+ **requires** material-based themes.

### Titanium Material Themes (SDK 10.0.0+)

| Theme | Description |
|-------|-------------|
| `Theme.Titanium.DayNight` | Light/dark switching (default 10.0.x) |
| `Theme.Titanium.DayNight.NoTitleBar` | No action bar |
| `Theme.Titanium.DayNight.Fullscreen` | No action bar or status bar |
| `Theme.Titanium.DayNight.Solid` | Seamless background (default 10.1.0+) |
| `Theme.Titanium.Dark` | Dark only |
| `Theme.Titanium.Light` | Light only |
| `Theme.AppDerived.NoTitleBar` | Inherits app theme, no action bar |
| `Theme.AppDerived.Fullscreen` | Inherits app theme, fullscreen |
| `Theme.AppDerived.Translucent` | Transparent background |

### Material 3 Themes (SDK 12.0.0+)

```xml
<!-- tiapp.xml -->
<android xmlns:android="http://schemas.android.com/apk/res/android">
  <manifest>
    <application android:theme="@style/Theme.Titanium.Material3.DayNight"/>
  </manifest>
</android>
```

| Theme | Description |
|-------|-------------|
| `Theme.Titanium.Material3.DayNight` | Material 3 with dynamic colors |
| `Theme.Titanium.Material3.DayNight.NoTitleBar` | No action bar |
| `Theme.Titanium.Material3.DayNight.Fullscreen` | No action/status bar |

**Custom Material 3 theme:**
```xml
<!-- platform/android/res/values/mytheme.xml -->
<resources>
  <style name="AppTheme" parent="Theme.Material3.DynamicColors.DayNight"/>
</resources>
```

### Applying Themes

**Global (tiapp.xml):**
```xml
<android xmlns:android="http://schemas.android.com/apk/res/android">
  <manifest>
    <application android:theme="@style/Theme.Titanium.DayNight.Solid"/>
  </manifest>
</android>
```

**Per-window (JavaScript):**
```javascript
const win = Ti.UI.createWindow({
  theme: 'Theme.AppDerived.Fullscreen'
});
```

### Custom Theme

```xml
<!-- platform/android/res/values/mytheme.xml -->
<?xml version="1.0" encoding="utf-8"?>
<resources>
  <!-- SDK 10.0.0+ -->
  <style name="Theme.MyTheme" parent="@style/Theme.Titanium.Light">
    <item name="colorPrimary">#c91326</item>
    <item name="colorPrimaryDark">#900000</item>
    <item name="colorAccent">#c91326</item>
    <item name="android:textColorPrimary">#000000</item>
    <item name="android:statusBarColor">#c91326</item>
    <item name="android:navigationBarColor">#c91326</item>
  </style>
</resources>
```

**Dark theme variant (values-night/):**
```xml
<!-- platform/android/res/values-night/mytheme.xml -->
<resources>
  <style name="Theme.MyTheme" parent="@style/Theme.Titanium.Dark">
    <item name="colorPrimary">#d5544b</item>
    <item name="colorAccent">#d5544b</item>
  </style>
</resources>
```

### Color Palette Attributes

| Attribute | Description |
|-----------|-------------|
| `colorPrimary` | Action bar color |
| `colorPrimaryDark` | Status bar color (API 21+) |
| `colorAccent` | Control accent color |
| `colorControlNormal` | Inactive control color |
| `colorControlActivated` | Active control color |
| `colorControlHighlight` | Click highlight (API 21+) |
| `android:navigationBarColor` | Bottom nav bar (API 21+) |
| `android:textColorPrimary` | Primary text color |

### Hiding Action Bar

**Via theme (recommended):**
```xml
<application android:theme="@style/Theme.AppDerived.NoTitleBar"/>
```

**Via JavaScript:**
```javascript
const win = Ti.UI.createWindow({
  theme: 'Theme.AppDerived.NoTitleBar'
});

// Or hide after open
win.addEventListener('open', () => {
  win.activity.actionBar.hide();
});
```

### Theme Requirements

- SDK 10.0.0+ requires material-based themes (runtime error otherwise)
- Place custom themes in `platform/android/res/values/`
- Do NOT name file `theme.xml` (overwrites Titanium's)
- Use `values-v<api>` for version-specific themes
- Use `values-night` for dark mode variants

## 3. Options Menu

### Legacy Options Menu

```javascript
var activity = Ti.Android.currentActivity;

activity.onCreateOptionsMenu = function(e) {
  var menu = e.menu;

  // Add items
  menu.add({ title: 'Option 1', itemId: 1 });
  menu.add({ title: 'Option 2', itemId: 2 });
  menu.add({ title: 'Option 3', itemId: 3 });
  menu.add({ title: 'Option 4', itemId: 4 });
};

activity.onOptionsItemSelected = function(e) {
  switch (e.itemId) {
    case 1:
      handleOption1();
      return true;
    // ... other cases
  }
  return false;
};
```

### Context Menu (Long Press)

```javascript
var view = Ti.UI.createView({
  backgroundColor: 'white'
});

view.addEventListener('longpress', function(e) {
  // Register for context menu
  registerForContextMenu();
});

function registerForContextMenu() {
  // Android: Create and register for context menu
  // This is typically done in tiapp.xml with intent filters
}
```

## 4. Status Bar Notifications

### Notifications

```javascript
// Create notification
var notification = Ti.Android.createNotification({
  contentTitle: 'New Message',
  contentText: 'You have a new message',
  contentIntent: Ti.Android.createIntent({
    url: 'myapp://message/123'
  }),
  number: 1,  // Notification number
  sound: Ti.App.Android.R.drawable.app_icon,  // Notification sound
  defaults: 0,  // Flags (LED, vibration, etc.)
  flags: Ti.Android.FLAG_AUTO_CANCEL | Ti.Android.FLAG_SHOW_LIGHTS
});

// Show notification
Ti.Android.NotificationManager.notify(1, notification);
```

### Notification Channels (Android 8.0+)

```javascript
// Create notification channel for Android 8.0+
var channel = Ti.Android.createNotificationChannel({
  id: 'my_channel_id',
  name: 'My Channel',
  importance: Ti.Android.NOTIFICATION_IMPORTANCE_HIGH,
  lightColor: '#FF0000',
  enableLights: true,
  showBadge: true,
  sound: Ti.Filesystem.getFile('sound.mp3')
});

Ti.Android.NotificationManager.createNotificationChannel(channel);

// Use channel in notification
var notification = Ti.Android.createNotification({
  channelId: 'my_channel_id',
  contentTitle: 'Channel Test',
  contentText: 'Testing notification channels',
  // ... other properties
});

Ti.Android.NotificationManager.notify(1, notification);
```

### Clearing Notifications

```javascript
// Cancel specific notification
Ti.Android.NotificationManager.cancel(1);

// Clear all notifications
Ti.Android.NotificationManager.cancelAll();
```

## 5. Progress Bars

### Horizontal Progress Bar

```javascript
var progressBar = Ti.UI.createProgressBar({
  min: 0,
  max: 100,
  value: 0,
  width: Ti.UI.FILL,
  height: Ti.UI.SIZE,
  style: Ti.UI.Android.PROGRESS_BAR_STYLE_HORIZONTAL,
  top: 10
});

// Update progress
progressBar.value = 50;

// Indeterminate progress
progressBar.message = 'Loading...';
progressBar.show();
```

### Spinner (Indeterminate Progress)

```javascript
var activityIndicator = Ti.UI.createActivityIndicator({
  message: 'Loading...',
  location: Ti.UI.Android.ACTIVITY_INDICATOR_DIALOG,
  cancelable: false
});

activityIndicator.show();

// Later:
activityIndicator.hide();
```

## 6. Tab Groups and Tabs

### Native Android Tabs

```javascript
var tabGroup = Ti.UI.createTabGroup({
  tabs: [tab1, tab2, tab3]
});

tabGroup.addEventListener('open', function(e) {
  Ti.API.info('Tab opened: ' + e.index + ' (' + e.tab.title + ')');
});
```

### Tab Badges

```javascript
var tab = Titanium.UI.createTab({
  title: 'Inbox',
  window: winInbox,
  icon: Ti.Android.R.drawable.ic_menu_info
});

// Set badge (number)
tab.badge = 5;

// Clear badge
tab.badge = null;  // or tab.setBadge(null);
```

## 7. Hardware Back Button Handling

### Handling Back Button

```javascript
var win = Ti.UI.createWindow();

win.addEventListener('androidback', function(e) {
  e.cancelBubble = true;  // Prevent default behavior

  // Check if can go back
  if (canGoBack()) {
    closeCurrentWindow();
  } else {
    showExitConfirmation();
  }
});

function canGoBack() {
  // Your logic here
  return true;  // or false
}
```

### Exit Confirmation Dialog

```javascript
function showExitConfirmation() {
  var dialog = Ti.UI.createAlertDialog({
    title: 'Exit?',
    message: 'Do you want to exit?',
    buttonNames: ['Yes', 'No'],
    cancel: 1
  });

  dialog.addEventListener('click', function(e) {
    if (e.index === 0) {
      var activity = Ti.Android.currentActivity;
      activity.finish();  // Close app
    }
  });

  dialog.show();
}
```

## 8. Notification Drawer

### Display Notification

```javascript
var notification = Ti.Android.createNotification({
  contentTitle: 'Download Complete',
  contentText: 'Your file has been downloaded',
  contentIntent: Ti.Android.createIntent({
    url: 'myapp://download/complete'
  }),
  largeIcon: Ti.App.Android.R.drawable.app_icon,
  bigTextStyle: { bold: true, italic: false }
});

Ti.Android.NotificationManager.notify(1, notification);
```

## 9. Android UI Conventions

### Back Button Behavior

Standard Android conventions:
- **Back button** = Navigate back in hierarchy
- **Long press back** = Show recent apps menu (system behavior)
- Apps should handle back button unless:

  1. It's the root activity (app would exit)
  2. User is in a task that shouldn't be interrupted
  3. Confirmation needed (destructive action)

### Up/Down Navigation

Traditional Android navigation uses:
- **Up button** = Navigate up in hierarchy
- **Menu button** = Show options menu
- **Home button** = Go to home (backgrounds app)

Modern apps may:
- Use Navigation Component (jetpack)
- Use up button for "back" navigation pattern
- Implement custom up navigation

### App Shortcuts

Android 7.1+ app shortcuts:

```xml
<activity
  android:name=".MainActivity"
  android:launchMode="singleTask">
  <!-- Define shortcuts -->
  <intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <data android:scheme="myapp" />
  </intent-filter>
</activity>
```

## 10. Material Design Components

### Using AppCompat v7

```xml
<android>
  <manifest>
    <application>
      <!-- Use AppCompat for Material Design support -->
      <meta-data android:name="android:theme"
        android:resource="@style/Theme.AppCompat.Light" />
    </application>
  </manifest>
</android>
```

### Material Design Components

- `Toolbar` - Replaces Action Bar (recommended)
- `CardView` - Cards with elevation
- `RecyclerView` - Advanced list component
- `CoordinatorLayout` - Complex layout coordination
- `TextInputLayout` - Floating label hints
- `FloatingActionButton` - Circular action button

These can be accessed via Hyperloop or custom modules.

## Best Practices

1. **Follow Material Design guidelines** for modern Android apps
2. **Use AppCompat v7** for consistent styling across Android versions
3. **Handle back button** to prevent unexpected app exits
4. **Use appropriate themes** that match your brand/design
5. **Test on multiple Android versions** - Theme support varies
6. **Consider accessibility** - Ensure content descriptions are set
7. **Use notification channels** for Android 8.0+ apps
8. **Test on physical devices** - Some features don't work in emulator
