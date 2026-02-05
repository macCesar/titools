# Cross-platform development

Strategies for building Titanium apps that run on iOS and Android from a single codebase.

## Philosophy

### "Write once, adapt everywhere"
Titanium is not "write once, run anywhere." It is "write once, adapt everywhere."

Shared (90-100%):
- Business logic
- Networking code
- Database operations
- Event handling
- Data models

Different:
- UI conventions (tab position, navigation)
- Platform-specific features
- Hardware capabilities
- User expectations

### Embrace the platform
Good apps feel native on each platform:

- iOS: bottom tabs, left navigation buttons, iOS-specific controls
- Android: top tabs, Menu button (legacy), Action Bar, Material Design

Develop for both platforms from day one. It is much easier than porting later.

### Android platform key concepts
- Screen sizes: small, normal, large, xlarge (measured in dp). Use density-independent resources.
- Screen densities: ldpi (~120 dpi), mdpi (~160 dpi), hdpi (~240 dpi), xhdpi (~320 dpi), xxhdpi (~480 dpi), xxxhdpi (~640 dpi)
- Activities: each heavyweight Window maps to an Android Activity. Titanium manages the Activity lifecycle.
- Intents: for inter-app and intra-app communication. See `android-platform-deep-dives.md`.
- Back button: hardware/software back closes the current Window by default. Override with `window.addEventListener('androidback', ...)`.

### iOS platform key concepts
- Human Interface Guidelines: Apple enforces design standards through App Store review. Follow iOS conventions for navigation, tab bars, and gestures.
- One-button design: no hardware back or menu buttons. All navigation must be in the UI (NavigationWindow, back buttons).
- Frameworks: Titanium wraps UIKit, Foundation, MapKit, and other Cocoa Touch frameworks. Use Hyperloop for additional frameworks.
- Developer account: requires a paid Apple Developer Program membership for device testing and App Store distribution.

## Platform identification

### Platform properties

```javascript
// Platform name
Ti.Platform.name          // "iPhone OS", "android", "mobileweb"
Ti.Platform.osname        // "iphone", "ipad", "android", "mobileweb"
Ti.Platform.model         // "iPhone 15", "Pixel 8", etc.
```

### Best practice: cache platform checks

```javascript
// Create aliases - query once, use many times
const osname = Ti.Platform.osname;
const isAndroid = (osname === 'android');
const isIOS = (osname === 'iphone' || osname === 'ipad');
const isMobileWeb = (osname === 'mobileweb');
```

### Anti-pattern: do not assume binary

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

## Coding strategies

### 1. Branching (mostly similar code)
Use when code is 90%+ the same with small differences.

```javascript
const isAndroid = (Ti.Platform.osname === 'android');

const win = Ti.UI.createWindow({
  backgroundColor: 'white',
  // Platform-specific property
  softInputMode: isAndroid ? Ti.UI.Android.SOFT_INPUT_ADJUST_PAN : null
});
```

Tips:
- Cache platform checks to avoid repeated bridge crossings
- Group as much code as possible within branches
- Defer loading to reduce performance impact

### 2. Platform-specific files (mostly different code)
Use when code differs significantly between platforms.

Structure:
```
Resources/
├── ui.js              // Common code (optional)
├── android/
│   └── ui.js          // Android-specific (overrides)
└── iphone/
    └── ui.js          // iOS-specific (overrides)
```

Usage:
```javascript
// Will automatically include the specific version
const ui = require('ui');
// Loads: /android/ui.js on Android, /iphone/ui.js on iOS
```

### 3. Execution contexts
Titanium supports single-context and multi-context apps:

- Single context (recommended): all windows share one JavaScript runtime. Use `require()` for modules and `Alloy.createController()` for views.
- Multi-context (legacy): `Ti.UI.createWindow({ url: 'other.js' })` creates a separate JavaScript context. Variables are not shared between contexts.

Avoid multi-context apps. Use CommonJS modules and `require()` instead. If you must communicate across contexts, use `Ti.App.fireEvent()` and `Ti.App.addEventListener()`.

Avoid multiple contexts:
```javascript
// Creates a new context - variables from app.js are not available
Ti.UI.createWindow({
  url: 'window.js' // DO NOT DO THIS
}).open();
```

Use instead:
```javascript
// Same context - all variables available
const win = Ti.UI.createWindow({});
require('window')(win);
win.open();
```

## Platform-specific resources

### Resource overrides system

```javascript
// Automatically uses the platform-specific version
const image = Ti.UI.createImageView({
  image: '/images/logo.png' // Will choose the correct file
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

## 5. Webpack build pipeline (TiSDK 9.1.0+)

Titanium's modern build engine optimizes packaging and allows using npm libraries natively.

### `@` alias
Use `@` to reference your code root regardless of the current folder depth.

```javascript
import MyModule from '@/utils/myModule'; // Points to app/lib or src
```

### npm support
Install any npm package in the project root and use it directly with `import`.

For more details on optimization, diagnostics, and the build web UI, see `webpack-build-pipeline.md`.

## 6. Internationalization (i18n)

### i18n directory structure
```
i18n/
├── en/
│   ├── strings.xml      <!-- Default language -->
│   └── app.xml          <!-- App name localization (Android) -->
├── es/
│   ├── strings.xml
│   └── app.xml
└── ja/
    └── strings.xml
```

Use ISO 639-1 language codes (en, es, ja) and optionally ISO 3166-1 region codes (en-GB, pt-BR).

### strings.xml format
```xml
<?xml version="1.0" encoding="UTF-8"?>
<resources>
  <string name="welcome_message">Welcome to my app</string>
  <string name="login_button">Log In</string>
</resources>
```

### Using localized strings

Basic usage:
```javascript
// Two equivalent methods
const str1 = L('welcome_message');
const str2 = Ti.Locale.getString('welcome_message');

// With a default fallback
const withDefault = L('missing_key', 'Default text');
```

In Alloy XML views, use `titleid` instead of `title`:
```xml
<Button titleid="login_button" />
<Label textid="welcome_message" />
```

String formatting:
```javascript
// Simple replacement
const formatted = String.format(L('format_test'), 'Kevin');
// Result: "Your name is Kevin"

// Ordered replacement
const formatted = String.format(L('ordered'), 'Jeff', 'Kevin');
// Result: "Hi Jeff, my name is Kevin"
```

### Localizing the app name

iOS (SDK 3.2.0+): set `<key>CFBundleDisplayName</key>` in `i18n/LANG/app.xml`

Android: use `<string name="appname">Mi App</string>` in `i18n/LANG/strings.xml`

### Localizing images and files

Two approaches:
1. Platform folders: place localized images in `app/assets/iphone/LANG.lproj/` (iOS) or `app/assets/android/images/` with language qualifiers (Android)
2. Code-based: load different assets based on `Ti.Locale.currentLanguage`

### Date and currency formatting

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

Warning (Android): `String.formatDate()` may produce incorrect translations or field ordering on some Android versions. Consider using JavaScript `Date` methods as a workaround.

### Testing localizations

iOS:
1. Settings → General → Language & Region
2. Change iPhone Language
3. Confirm and restart device

Android:
1. Settings → Language & input
2. Select Language

## Platform-specific APIs

### Example: platform-specific properties

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

## Common cross-platform patterns

### Tab groups

```javascript
const tabGroup = Ti.UI.createTabGroup();

const tab1 = Ti.UI.createTab({
  title: 'Tab 1',
  icon: isIOS ? 'tab1.png' : null, // iOS uses icons
  window: win1
});

tabGroup.addTab(tab1);
tabGroup.open();
```

### Navigation

```javascript
if (isIOS) {
  // iOS: navigation window with back button
  const nav = Ti.UI.iOS.createNavigationWindow({
    window: win
  });
  nav.open();
} else if (isAndroid) {
  // Android: open window, use physical button
  win.open();
}
```

### Platform-specific event handling

```javascript
if (isAndroid) {
  // Android: handle physical Back button
  win.addEventListener('androidback', (e) => {
    // Custom behavior
    alert('Back pressed!');
  });
}
```

## Best practices

1. Test early on both platforms. Do not wait until "porting time".
2. Use Alloy. It provides MVC structure and platform abstraction.
3. Follow platform conventions. iOS apps should feel like iOS, Android like Android.
4. Cache platform checks. Store in variables, do not call `Ti.Platform.osname` repeatedly.
5. Use CommonJS modules. Better code organization and reuse.
6. Leverage resource overrides. Avoid conditional code for images and assets.
7. Think cross-platform from the design phase. UI should adapt gracefully.

## Resources

- Alloy Framework - MVC framework for Titanium (see alloy-guides skill)
- CommonJS Modules - module specification (see coding strategies above)
- Platform API deep dives - iOS and Android platform-specific features
