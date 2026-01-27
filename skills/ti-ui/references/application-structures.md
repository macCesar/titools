# Application Structures and Core Building Blocks

## Table of Contents

- [Application Structures and Core Building Blocks](#application-structures-and-core-building-blocks)
  - [Table of Contents](#table-of-contents)
  - [1. Overview](#1-overview)
  - [2. Windows](#2-windows)
    - [Window Concepts](#window-concepts)
    - [Creating Windows](#creating-windows)
    - [Window Events](#window-events)
    - [Window Lifecycle](#window-lifecycle)
  - [3. Views](#3-views)
    - [View Concepts](#view-concepts)
    - [Creating Views](#creating-views)
    - [Common View Types](#common-view-types)
    - [Adding Views to Windows](#adding-views-to-windows)
    - [Removing Views](#removing-views)
  - [4. TabGroups](#4-tabgroups)
    - [Tab-Based Apps](#tab-based-apps)
    - [Tab Properties](#tab-properties)
    - [Window Titles vs Tab Titles](#window-titles-vs-tab-titles)
    - [Tab Events](#tab-events)
    - [Tab Recommendations](#tab-recommendations)
    - [Tab-Based Applications](#tab-based-applications)
    - [Navigation Bar Customization](#navigation-bar-customization)
  - [7. Modal Windows](#7-modal-windows)
    - [iOS Modal Windows](#ios-modal-windows)
  - [8. Heavyweight vs Lightweight Windows](#8-heavyweight-vs-lightweight-windows)
    - [Heavyweight Windows (Android)](#heavyweight-windows-android)
    - [Lightweight Windows](#lightweight-windows)
  - [9. Window Hierarchy and Stacking](#9-window-hierarchy-and-stacking)
    - [Understanding the Stack](#understanding-the-stack)
    - [Accessing the Stack](#accessing-the-stack)
  - [10. Platform-Specific Navigation](#10-platform-specific-navigation)
    - [Android Navigation Patterns](#android-navigation-patterns)
    - [iOS Navigation Patterns](#ios-navigation-patterns)
  - [11. Execution Contexts](#11-execution-contexts)
    - [Lightweight Contexts](#lightweight-contexts)
  - [12. Common Patterns](#12-common-patterns)
    - [Drill-Down Navigation](#drill-down-navigation)
    - [Modal Forms](#modal-forms)
    - [Tab with Navigation](#tab-with-navigation)
  - [13. Best Practices](#13-best-practices)
  - [14. Platform Differences Summary](#14-platform-differences-summary)

---

## 1. Overview

Titanium apps are built from three core components:
- **Windows** - Top-level containers (like web pages)
- **Views** - Generic content containers (like HTML divs)
- **TabGroups** - Tab-based navigation containers

## 2. Windows

### Window Concepts

In web development terms:
- **Window** ≈ **Web page** (top-level container)
- **View** ≈ **div** (generic content container)
- Windows can run in their own execution context
- Windows are top-level containers that hold views

### Creating Windows

```javascript
const win = Ti.UI.createWindow({
  title: 'My Window',
  backgroundColor: '#fff',
  fullscreen: false,
  modal: false,
  barColor: '#000'
});

win.open();
```
...
### Window Events

```javascript
win.addEventListener('open', (e) => {
  Ti.API.info('Window opened');
});

win.addEventListener('close', (e) => {
  Ti.API.info('Window closed');
});

win.addEventListener('focus', (e) => {
  Ti.API.info('Window focused');
});

win.addEventListener('blur', (e) => {
  Ti.API.info('Window blurred');
});
```

### Window Lifecycle

Windows exist in a stack. Opening a window pushes it onto the stack; closing pops it from the stack.

```javascript
const win1 = Ti.UI.createWindow({ title: 'Window 1' });
const win2 = Ti.UI.createWindow({ title: 'Window 2' });

win1.open();
win2.open();  // Pushed on top of win1

// Pressing back (Android) or calling close() returns to win1
```

## 3. Views

### View Concepts

Views are style-able generic containers that:
- Hold other components (buttons, labels, etc.)
- Must be contained within a window
- Are analogous to HTML divs

### Creating Views

```javascript
const view = Ti.UI.createView({
  width: 300,
  height: 400,
  backgroundColor: 'blue',
  top: 10,
  left: 10
});

win.add(view);
```

### Common View Types

```javascript
// Basic view
const view = Ti.UI.createView();

// Container with specific purpose
const containerView = Ti.UI.createView({
  layout: 'vertical',
  height: Ti.UI.SIZE
});

// ImageView
const imageView = Ti.UI.createImageView({
  image: 'photo.png',
  width: 100,
  height: 100
});

// WebView
const webView = Ti.UI.createWebView({
  url: 'https://example.com',
  width: Ti.UI.FILL,
  height: Ti.UI.FILL
});
```

### Adding Views to Windows

```javascript
// Add single view
win.add(view);

// Add multiple
win.add(view1);
win.add(view2);

// Nested views
container.add(childView);
win.add(container);
```

### Removing Views

```javascript
// Remove specific view
win.remove(view);

// Remove all children
win.removeAllChildren();
```

## 4. TabGroups

### Tab-Based Apps

TabGroups contain multiple tabs, each containing a window. This is the most common mobile app pattern.

```javascript
// Create tab group
const tabGroup = Ti.UI.createTabGroup();

// Create windows
const win1 = Ti.UI.createWindow({
  title: 'Tab 1',
  backgroundColor: '#fff'
});

const win2 = Ti.UI.createWindow({
  title: 'Tab 2',
  backgroundColor: '#fff'
});

// Create tabs
const tab1 = Ti.UI.createTab({
  icon: 'tab1icon.png',
  title: 'Tab 1',
  window: win1
});

const tab2 = Ti.UI.createTab({
  icon: 'tab2icon.png',
  title: 'Tab 2',
  window: win2
});

// Add tabs to group
tabGroup.addTab(tab1);
tabGroup.addTab(tab2);

// Open tab group
tabGroup.open();
```

### Tab Properties

| Property     | Description            |
| ------------ | ---------------------- |
| `icon`       | Tab icon (PNG path)    |
| `title`      | Tab text               |
| `window`     | Root window for tab    |
| `badge`      | Badge number           |
| `activeIcon` | Icon when active (iOS) |

### Window Titles vs Tab Titles

```javascript
const tab = Ti.UI.createTab({
  title: 'Tab Title',     // Shown on tab handle
  window: Ti.UI.createWindow({
    title: 'Window Title'  // Shown in nav bar
  })
});
```

### Tab Events

```javascript
tabGroup.addEventListener('focus', (e) => {
  Ti.API.info(`Tab focused: ${e.index}`);
  // e.tab: the tab object
  // e.index: tab index
});
```

### Tab Recommendations

**Limit tabs to 4 or less**:
- iOS: Fixed minimum width, shows "More" for overflow
- Android: Tabs shrink to fit (can become unusable)
- Both platforms: All tabs visible = better UX

**Tab expectations**:
- Tabs are peers (siblings), not hierarchical
- Each tab focuses on limited, related functionality
- Tabs are related within overall app purpose

### Tab-Based Applications

**Characteristics**:
- 2-4 tabs at bottom
- Each tab contains a window
- Easy navigation between features
- Most common mobile pattern

**Example apps**:
- Social networks (feed, profile, messages)
- News apps (headlines, sports, business)
- Utilities with distinct features

```javascript
// Classic tab-based app
const tabGroup = Ti.UI.createTabGroup();

tabGroup.addTab(Ti.UI.createTab({
  title: 'Home',
  icon: 'home.png',
  window: createHomeWindow()
}));

tabGroup.addTab(Ti.UI.createTab({
  title: 'Search',
  icon: 'search.png',
  window: createSearchWindow()
}));

tabGroup.addTab(Ti.UI.createTab({
  title: 'Profile',
  icon: 'profile.png',
  window: createProfileWindow()
}));

tabGroup.open();
```
...
// Window-based app with NavigationWindow (iOS)
const navWindow = Ti.UI.createNavigationWindow({
  window: Ti.UI.createWindow({
    backgroundColor: '#fff',
    title: 'Home'
  })
});

navWindow.open();
```

## 6. NavigationWindow (iOS)

NavigationWindow provides iOS-style navigation with push/pop transitions.

```javascript
const navWindow = Ti.UI.createNavigationWindow({
  window: Ti.UI.createWindow({
    title: 'Root',
    backgroundColor: '#fff'
  })
});

// Open detail window
const detailWin = Ti.UI.createWindow({
  title: 'Detail',
  backgroundColor: 'gray'
});

navWindow.openWindow(detailWin, { animated: true });

// Close to go back
detailWin.close();
```

### Navigation Bar Customization

```javascript
const win = Ti.UI.createWindow({
  title: 'My Window',
  barColor: '#000',  // Nav bar color
  translucent: false  // Opaque nav bar
});

// Left nav button
win.leftNavButton = Ti.UI.createButton({
  title: 'Back'
});

win.leftNavButton.addEventListener('click', () => {
  navWindow.closeWindow(win);
});

// Right nav button
win.rightNavButton = Ti.UI.createButton({
  title: 'Action'
});
```

## 7. Modal Windows

### iOS Modal Windows

```javascript
const modalWin = Ti.UI.createWindow({
  title: 'Modal',
  backgroundColor: '#fff'
});

// Modal windows fill screen, covering tab bar
modalWin.open({ modal: true });
```

**Modal behavior**:
- Fills entire screen
- Covers tab bar (if in tab)
- Must be explicitly closed
- No automatic back button

## 8. Heavyweight vs Lightweight Windows

### Heavyweight Windows (Android)

Android windows are "heavyweight" - they each run in their own activity/context.

```javascript
// Explicit heavyweight (Android)
const win = Ti.UI.createWindow({
  fullscreen: false,
  navBarHidden: false,
  modal: false  // Still heavyweight on Android
});
```

**Heavyweight characteristics**:
- Each window = separate Android Activity
- Own back button handling
- Own lifecycle
- More memory intensive

### Lightweight Windows

```javascript
// Lightweight (same context)
const win = Ti.UI.createWindow({
  navBarHidden: true,  // Creates lightweight on Android
  modal: true  // Can create lightweight on iOS
});
```

**Lightweight characteristics**:
- Share context with opening window
- No back button (typically)
- Less memory usage
- Faster creation

## 9. Window Hierarchy and Stacking

### Understanding the Stack

```javascript
const win1 = Ti.UI.createWindow({ title: '1' });
const win2 = Ti.UI.createWindow({ title: '2' });
const win3 = Ti.UI.createWindow({ title: '3' });

win1.open();
// Stack: [win1]

win2.open();
// Stack: [win1, win2]

win3.open();
// Stack: [win1, win2, win3]

win3.close();
// Stack: [win1, win2]

win2.close();
// Stack: [win1]
```

### Accessing the Stack

```javascript
// Get current window (some contexts)
const currentWin = Ti.UI.currentWindow;

// On Android, get current activity
const activity = Ti.Android.currentActivity;
```

## 10. Platform-Specific Navigation

### Android Navigation Patterns

**Back Button**:
```javascript
win.addEventListener('androidback', (e) => {
  // Override default behavior
  const dialog = Ti.UI.createAlertDialog({
    title: 'Exit?',
    message: 'Go back?',
    buttonNames: ['Yes', 'No']
  });

  dialog.addEventListener('click', (evt) => {
    if (evt.index === 0) {
      win.close();
    }
  });

  dialog.show();
});
```

**Menu Button**:
```javascript
const activity = Ti.Android.currentActivity;

activity.onCreateOptionsMenu = (e) => {
  const menu = e.menu;

  menu.add({
    title: 'Refresh',
    itemId: 1,
    showAsAction: Ti.Android.SHOW_AS_ACTION_IF_ROOM
  });

  menu.add({
    title: 'Settings',
    itemId: 2
  });
};

activity.onOptionsItemSelected = (e) => {
  switch(e.itemId) {
    case 1:
      refreshData();
      return true;
    case 2:
      openSettings();
      return true;
  }
  return false;
};
```

### iOS Navigation Patterns

**NavigationWindow** (most common):
```javascript
const navWindow = Ti.UI.createNavigationWindow({
  window: rootWindow
});
navWindow.open();
```

**Tab Bar Controller**:
```javascript
const tabGroup = Ti.UI.createTabGroup();
tabGroup.open();
```

**SplitWindow** (iPad):
```javascript
const splitWin = Ti.UI.iOS.createSplitWindow({
  masterView: masterWindow,
  detailView: detailWindow
});
splitWin.open();
```

## 11. Execution Contexts

### Lightweight Contexts

Windows share contexts by default:

```javascript
const win1 = Ti.UI.createWindow();
const win2 = Ti.UI.createWindow();

// These share the same JavaScript context
const sharedVariable = 123;  // Accessible in both
```
...
## 12. Common Patterns

### Drill-Down Navigation

```javascript
// Root level
const table = Ti.UI.createTableView({
  data: [
    { title: 'Category 1', hasChild: true },
    { title: 'Category 2', hasChild: true }
  ]
});

table.addEventListener('click', (e) => {
  if (e.row.hasChild) {
    const detailTable = createDetailTable(e.row.title);

    // iOS: Use NavigationWindow
    if (Ti.Platform.osname === 'iphone') {
      navWindow.openWindow(detailTable.window);
    } else {
      // Android: Open new window
      detailTable.window.open();
    }
  }
});
```

### Modal Forms

```javascript
function showModalForm() {
  const formWin = Ti.UI.createWindow({
    title: 'Add Item',
    backgroundColor: '#fff',
    modal: true
  });

  const nameField = Ti.UI.createTextField({
    hintText: 'Name',
    top: 20,
    height: 40
  });

  const saveButton = Ti.UI.createButton({
    title: 'Save',
    top: 70
  });

  saveButton.addEventListener('click', () => {
    saveData(nameField.value);
    formWin.close();
  });

  formWin.add(nameField);
  formWin.add(saveButton);
  formWin.open();
}
```

### Tab with Navigation

```javascript
const navWindow = Ti.UI.createNavigationWindow({
  window: Ti.UI.createWindow({
    title: 'Home',
    backgroundColor: '#fff'
  })
});

const tab = Ti.UI.createTab({
  title: 'Home',
  icon: 'home.png',
  window: navWindow  // Use navWindow, not win directly
});

tabGroup.addTab(tab);
```

## 13. Best Practices

1. **Prefer TabGroups for multi-feature apps** - Most common pattern
2. **Use NavigationWindow for iOS hierarchy** - Standard iOS pattern
3. **Limit to 4 tabs** - All tabs visible = better UX
4. **Handle androidback appropriately** - Confirm before destructive actions
5. **Use modal windows for focused tasks** - Forms, confirmations
6. **Consider execution contexts** - Heavyweight windows don't share variables
7. **Test on both platforms** - Navigation patterns differ significantly

## 14. Platform Differences Summary

| Feature       | iOS                          | Android                                |
| ------------- | ---------------------------- | -------------------------------------- |
| Modal windows | Fill screen, cover tab bar   | No effect (windows always full screen) |
| Navigation    | NavigationWindow             | Back button + Menu button              |
| Tabs          | Fixed width, "More" overflow | Shrink to fit                          |
| Window stack  | Manual management            | Back button navigation                 |
| Heavyweight   | Requires fullscreen          | Default behavior                       |
