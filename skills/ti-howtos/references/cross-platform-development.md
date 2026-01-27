# Cross-Platform Development

Strategies and techniques for building Titanium apps that work on iOS and Android from a single codebase.

## Table of Contents

- [Cross-Platform Development](#cross-platform-development)
  - [Table of Contents](#table-of-contents)
  - [Philosophy](#philosophy)
    - ["Write Once, Adapt Everywhere"](#write-once-adapt-everywhere)
    - [Embrace the Platform](#embrace-the-platform)
  - [Platform Identification](#platform-identification)
    - [Platform Properties](#platform-properties)
    - [Best Practice: Cache Platform Checks](#best-practice-cache-platform-checks)
    - [Anti-Pattern: Don't Assume Binary](#anti-pattern-dont-assume-binary)
  - [Coding Strategies](#coding-strategies)
    - [1. Branching (For Mostly Similar Code)](#1-branching-for-mostly-similar-code)
    - [2. Platform-Specific Files (For Mostly Different Code)](#2-platform-specific-files-for-mostly-different-code)
    - [3. Single Execution Context (Recommended)](#3-single-execution-context-recommended)
  - [Platform-Specific Resources](#platform-specific-resources)
    - [Resource Overrides System](#resource-overrides-system)
    - [Assets (Alloy)](#assets-alloy)
  - [5. Webpack Build Pipeline (TiSDK 9.1.0+)](#5-webpack-build-pipeline-tisdk-910)
    - [`@` Alias](#-alias)
    - [NPM Support](#npm-support)
  - [6. Internationalization (i18n)](#6-internationalization-i18n)
    - [Using Localized Strings](#using-localized-strings)
    - [Date and Currency Formatting](#date-and-currency-formatting)
    - [Testing Localizations](#testing-localizations)
  - [Platform-Specific APIs](#platform-specific-apis)
    - [Example: Platform-Specific Properties](#example-platform-specific-properties)
  - [Common Cross-Platform Patterns](#common-cross-platform-patterns)
    - [Tab Groups](#tab-groups)
    - [Navigation](#navigation)
    - [Platform-Specific Event Handling](#platform-specific-event-handling)
  - [Best Practices](#best-practices)
  - [Resources](#resources)

---

## Philosophy

### "Write Once, Adapt Everywhere"

Titanium is **not** "write once, run anywhere." It's "write once, **adapt** everywhere."

**What's shared (90-100%):**
- Business logic
- Networking code
- Database operations
- Event handling
- Data models

**What differs:**
- UI conventions (tabs position, navigation)
- Platform-specific features
- Hardware capabilities
- User expectations

### Embrace the Platform

Best-of-breed apps feel **native** on each platform:

- **iOS** - Bottom tabs, left navigation buttons, iOS-specific controls
- **Android** - Top tabs, Menu button (legacy), Action Bar, Material Design

**Develop for both platforms from the start** - much more efficient than porting later.

---

## Platform Identification

### Platform Properties

```javascript
// Platform name
Ti.Platform.name          // "iPhone OS", "android", "mobileweb"
Ti.Platform.osname        // "iphone", "ipad", "android", "mobileweb"
Ti.Platform.model         // "iPhone 15", "Pixel 8", etc.
```

### Best Practice: Cache Platform Checks

```javascript
// Create aliases - query once, use many times
const osname = Ti.Platform.osname;
const isAndroid = (osname === 'android');
const isIOS = (osname === 'iphone' || osname === 'ipad');
const isMobileWeb = (osname === 'mobileweb');
```

### Anti-Pattern: Don't Assume Binary

```javascript
// BAD: Assumes if not Android, then iOS
if (osname !== 'android') {
   // Wrong! Could be mobile web or future platform
}

// GOOD: Explicit checks
if (isAndroid) {
   // Android code
} else if (isIOS) {
   // iOS code
}
```

---

## Coding Strategies

### 1. Branching (For Mostly Similar Code)

Use when code is 90%+ the same with small differences.

```javascript
const isAndroid = (Ti.Platform.osname === 'android');

const win = Ti.UI.createWindow({
    backgroundColor: 'white',
    // Platform-specific property
    softInputMode: isAndroid ? Ti.UI.Android.SOFT_INPUT_ADJUST_PAN : null
});
```

**Tips:**
- Cache platform checks to avoid repeated "bridge crossings"
- Group as much code as possible within branches
- Defer loading to reduce performance impact

### 2. Platform-Specific Files (For Mostly Different Code)

Use when code differs significantly between platforms.

**Structure:**
```
Resources/
├── ui.js              // Common code (optional)
├── android/
│   └── ui.js          // Android-specific (overrides)
└── iphone/
    └── ui.js          // iOS-specific (overrides)
```

**Usage:**
```javascript
// Will automatically include the specific version
const ui = require('ui');
// Carga: /android/ui.js en Android, /iphone/ui.js en iOS
```

### 3. Single Execution Context (Recommended)

**Avoid multiple contexts:**
```javascript
// Creates a new context - variables from app.js are not available
Ti.UI.createWindow({
    url: 'window.js'  // DON'T DO THIS
}).open();
```

**Use instead:**
```javascript
// Same context - all variables available
const win = Ti.UI.createWindow({});
require('window')(win);
win.open();
```

---

## Platform-Specific Resources

### Resource Overrides System

```javascript
// Automatically uses the platform-specific version
const image = Ti.UI.createImageView({
    image: '/images/logo.png'  // Will choose the correct file
});
```

### Assets (Alloy)

```
app/
├── assets/
│   └── images/
│       └── logo.png      // Default
├── assets/
│   └── android/
│       └── images/
│           └── logo.png  // Android
└── assets/
    └── iphone/
        └── images/
            └── logo.png  // iOS
```

---

## 5. Webpack Build Pipeline (TiSDK 9.1.0+)

Titanium's modern build engine optimizes packaging and allows using NPM libraries natively.

### `@` Alias
Use `@` to reference your code root regardless of the current folder depth.
```javascript
import MyModule from '@/utils/myModule'; // Points to app/lib or src
```

### NPM Support
Install any NPM package in the project root and use it directly with `import`.

For more details on optimization, diagnostics, and build Web UI, see:
- [Webpack Build Pipeline](./webpack-build-pipeline.md)

## 6. Internationalization (i18n)

### Using Localized Strings

**Basic usage:**
```javascript
// Two equivalent methods
const str1 = L('welcome_message');
const str2 = Ti.Locale.getString('welcome_message');
```

**String formatting:**
```javascript
// Simple replacement
const formatted = String.format(L('format_test'), 'Kevin');
// Result: "Your name is Kevin"

// Ordered replacement
const formatted = String.format(L('ordered'), 'Jeff', 'Kevin');
// Result: "Hi Jeff, my name is Kevin"
```

### Date and Currency Formatting

```javascript
// Date formatting
const today = new Date();
const dateStr = String.formatDate(today, 'long');
const timeStr = String.formatTime(today, 'short');

// Currency
const price = String.formatCurrency(1234.56);

// Decimal
const amount = String.formatDecimal(1234.56);
```

### Testing Localizations

**iOS:**
1. Settings → General → Language & Region
2. Change iPhone Language
3. Confirm and restart device

**Android:**
1. Settings → Language & input
2. Select Language

---

## Platform-Specific APIs

### Example: Platform-Specific Properties

```javascript
const win = Ti.UI.createWindow({
    // iOS-specific
    barColor: isIOS ? '#007AFF' : null,
    titlePrompt: isIOS ? 'Title' : null,

    // Android-specific
    softInputMode: isAndroid ? Ti.UI.Android.SOFT_INPUT_ADJUST_PAN : null,
    exitOnClose: isAndroid ? true : false
});
```

---

## Common Cross-Platform Patterns

### Tab Groups

```javascript
const tabGroup = Ti.UI.createTabGroup();

const tab1 = Ti.UI.createTab({
    title: 'Tab 1',
    icon: isIOS ? 'tab1.png' : null,  // iOS uses icons
    window: win1
});

tabGroup.addTab(tab1);
tabGroup.open();
```

### Navigation

```javascript
if (isIOS) {
    // iOS: Navigation window with back button
    const nav = Ti.UI.iOS.createNavigationWindow({
        window: win
    });
    nav.open();
} else if (isAndroid) {
    // Android: Open window, use physical button
    win.open();
}
```

### Platform-Specific Event Handling

```javascript
if (isAndroid) {
    // Android: Handle physical 'Back' button
    win.addEventListener('androidback', (e) => {
        // Custom behavior
        alert('Back pressed!');
    });
}
```

---

## Best Practices

1. **Test early on both platforms** - Don't wait until "porting time"
2. **Use Alloy framework** - Provides MVC structure and platform abstraction
3. **Follow platform conventions** - iOS apps should feel like iOS, Android like Android
4. **Cache platform checks** - Store in variables, don't call `Ti.Platform.osname` repeatedly
5. **Use CommonJS modules** - Better code organization and reusability
6. **Leverage resource overrides** - Avoid conditional code for images/assets
7. **Think cross-platform from design phase** - UI should adapt gracefully

---

## Resources

- **Alloy Framework** - MVC framework for Titanium (see alloy-guides skill)
- **CommonJS Modules** - Module specification (see coding-strategies above)
- **Platform API Deep Dives** - iOS and Android platform-specific features
