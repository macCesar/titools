# Application structures and core building blocks

## 1. Overview

Titanium apps are built from three core components.
- Windows: top-level containers, similar to web pages.
- Views: generic content containers, similar to HTML divs.
- TabGroups: tab-based navigation containers.

## 2. Windows

### Window concepts

If you think in web terms:
- A window is like a page. It is the top-level container.
- A view is like a div. It sits inside a window.
- Windows can run in their own execution context.

### Creating windows

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
### Window events

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

### Window lifecycle

Windows live in a stack. Opening a window pushes it on top. Closing it pops it off.

```javascript
const win1 = Ti.UI.createWindow({ title: 'Window 1' });
const win2 = Ti.UI.createWindow({ title: 'Window 2' });

win1.open();
win2.open();  // Pushed on top of win1

// Pressing back (Android) or calling close() returns to win1
```

## 3. Views

### View concepts

Views are stylable containers that:
- Hold other components (buttons, labels, etc.).
- Must be contained within a window.
- Map closely to HTML divs.

### Creating views

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

### Common view types

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

### Adding views to windows

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

### Removing views

```javascript
// Remove specific view
win.remove(view);

// Remove all children
win.removeAllChildren();
```

## 4. TabGroups

### Tab-based apps

TabGroups contain multiple tabs, each with a window. This is a common mobile pattern.

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

### Tab properties

| Property     | Description            |
| ------------ | ---------------------- |
| `icon`       | Tab icon (PNG path)    |
| `title`      | Tab text               |
| `window`     | Root window for tab    |
| `badge`      | Badge number           |
| `activeIcon` | Icon when active (iOS) |

### Window titles vs tab titles

```javascript
const tab = Ti.UI.createTab({
  title: 'Tab Title',     // Shown on tab handle
  window: Ti.UI.createWindow({
    title: 'Window Title'  // Shown in nav bar
  })
});
```

### Tab events

```javascript
tabGroup.addEventListener('focus', (e) => {
  Ti.API.info(`Tab focused: ${e.index}`);
  // e.tab: the tab object
  // e.index: tab index
});
```

### Tab recommendations

Keep tabs to four or fewer.
- iOS uses a fixed minimum width and shows "More" for overflow.
- Android shrinks tabs to fit, which can make them hard to use.
- On both platforms, visible tabs are easier to scan.

Tabs should be peers. They are not a hierarchy.
- Each tab should focus on a narrow slice of functionality.
- All tabs should make sense as parts of a single app.

### Tab-based applications

Typical characteristics:
- Two to four tabs at the bottom.
- Each tab contains a window.
- Switching between features is quick.

Example apps:
- Social networks (feed, profile, messages).
- News apps (headlines, sports, business).
- Utilities with distinct features.

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

NavigationWindow provides iOS-style navigation with push and pop transitions.

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

### Navigation bar customization

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

## 7. Modal windows

### iOS modal windows

```javascript
const modalWin = Ti.UI.createWindow({
  title: 'Modal',
  backgroundColor: '#fff'
});

// Modal windows fill screen, covering tab bar
modalWin.open({ modal: true });
```

Modal behavior:
- Fills the entire screen.
- Covers the tab bar if the app uses tabs.
- Must be explicitly closed.
- No automatic back button.

## 8. Heavyweight vs lightweight windows

### Heavyweight windows (Android)

Android windows are heavyweight. Each runs in its own activity and context.

```javascript
// Explicit heavyweight (Android)
const win = Ti.UI.createWindow({
  fullscreen: false,
  navBarHidden: false,
  modal: false  // Still heavyweight on Android
});
```

Heavyweight characteristics:
- Each window is a separate Android Activity.
- Each has its own back button handling.
- Each has its own lifecycle.
- They use more memory.

### Lightweight windows

```javascript
// Lightweight (same context)
const win = Ti.UI.createWindow({
  navBarHidden: true,  // Creates lightweight on Android
  modal: true  // Can create lightweight on iOS
});
```

Lightweight characteristics:
- Share context with the opening window.
- No back button (typically).
- Use less memory.
- Create faster.

## 9. Window hierarchy and stacking

### Understanding the stack

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

### Accessing the stack

```javascript
// Get current window (some contexts)
const currentWin = Ti.UI.currentWindow;

// On Android, get current activity
const activity = Ti.Android.currentActivity;
```

## 10. Platform-specific navigation

### Android navigation patterns

Back button:
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

Menu button:
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

### iOS navigation patterns

NavigationWindow (most common):
```javascript
const navWindow = Ti.UI.createNavigationWindow({
  window: rootWindow
});
navWindow.open();
```

Tab bar controller:
```javascript
const tabGroup = Ti.UI.createTabGroup();
tabGroup.open();
```

SplitWindow (iPad):
```javascript
const splitWin = Ti.UI.iOS.createSplitWindow({
  masterView: masterWindow,
  detailView: detailWindow
});
splitWin.open();
```

## 11. Execution contexts

### Lightweight contexts

Windows share contexts by default.

```javascript
const win1 = Ti.UI.createWindow();
const win2 = Ti.UI.createWindow();

// These share the same JavaScript context
const sharedVariable = 123;  // Accessible in both
```
...
## 12. Common patterns

### Drill-down navigation

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

### Modal forms

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

### Tab with navigation

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

## 13. Best practices

1. Prefer TabGroups for multi-feature apps. It is the most common pattern.
2. Use NavigationWindow for iOS hierarchy. It matches platform expectations.
3. Limit to 4 tabs. All tabs visible is better UX.
4. Handle `androidback` with care. Confirm destructive actions.
5. Use modal windows for focused tasks like forms and confirmations.
6. Remember execution contexts. Heavyweight windows do not share variables.
7. Test on both platforms. Navigation differs in real use.

## 14. Platform differences summary

| Feature       | iOS                          | Android                                |
| ------------- | ---------------------------- | -------------------------------------- |
| Modal windows | Fill screen, cover tab bar   | No effect (windows always full screen) |
| Navigation    | NavigationWindow             | Back button and menu button            |
| Tabs          | Fixed width, "More" overflow | Shrink to fit                          |
| Window stack  | Manual management            | Back button navigation                 |
| Heavyweight   | Requires fullscreen          | Default behavior                       |
