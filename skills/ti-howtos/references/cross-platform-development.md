# Cross-Platform Development

Strategies and techniques for building Titanium apps that work on iOS and Android from a single codebase.

## Table of Contents
1. [Philosophy](#philosophy)
2. [Platform Identification](#platform-identification)
3. [Coding Strategies](#coding-strategies)
4. [Platform-Specific Resources](#platform-specific-resources)
5. [Internationalization](#internationalization)

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
Ti.Platform.model         // "iPhone 3GS", "Droid", etc.
```

### Best Practice: Cache Platform Checks

```javascript
// Create aliases - query once, use many times
var osname = Ti.Platform.osname;
var isAndroid = (osname === 'android');
var isIOS = (osname === 'iphone' || osname === 'ipad');
var isMobileWeb = (osname === 'mobileweb');
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
var isAndroid = (Ti.Platform.osname === 'android');

var win = Ti.UI.createWindow({
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
// Will include platform-specific version automatically
var ui = require('ui');
// Loads: /android/ui.js on Android
//        /iphone/ui.js on iOS
//        /ui.js on other platforms (if exists)
```

**Pros:**
- Removes long if/then blocks
- Reduces chance of using wrong platform's API
- Cleaner code organization

**Cons:**
- Must maintain changes across multiple files
- Can increase work if code changes frequently

### 3. Single Execution Context (Recommended)

**Why single context?**
- Pass complex objects easily (not just JSON)
- Load libraries once (memory efficient)
- Most common pattern in production apps

**Avoid multiple contexts:**
```javascript
// Creates new context - variables from app.js not available
Ti.UI.createWindow({
    url: 'window.js'  // DON'T DO THIS
}).open();
```

**Use instead:**
```javascript
// Same context - all variables available
var win = Ti.UI.createWindow({});
require('window')(win);
win.open();
```

---

## Platform-Specific Resources

### Resource Overrides System

Files in platform-specific folders **automatically override** base Resources:

```
Resources/
├── images/
│   └── logo.png          // Default
├── android/
│   └── images/
│       └── logo.png      // Used on Android
└── iphone/
    └── images/
        └── logo.png      // Used on iOS
```

**No code changes needed:**
```javascript
// Uses platform-specific version automatically
var image = Ti.UI.createImageView({
    image: '/images/logo.png'  // Will pick correct file
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

## Internationalization (i18n)

### Directory Structure

Create `i18n` folder in your project root:

```
app/
├── controllers/
├── i18n/
│   ├── en/
│   │   ├── strings.xml    // English strings
│   │   └── app.xml        // English app name
│   ├── es/
│   │   ├── strings.xml    // Spanish strings
│   │   └── app.xml        // Spanish app name
│   ├── en-US/             // American English variant
│   └── fr/                // French
└── views/
```

**Folder naming (ISO 639-1):**
- `en`, `es`, `fr`, `de`, `ja`, `zh`, etc.
- Add country code for variants: `en-US`, `en-GB`, `es-MX`

### strings.xml Format

```xml
<resources>
    <string name="welcome_message">Welcome to My App</string>
    <string name="user_label">Username</string>
    <string name="format_test">Your name is %s</string>
    <string name="ordered">Hi %1$s, my name is %2$s</string>
</resources>
```

### Using Localized Strings

**Basic usage:**
```javascript
// Two equivalent methods
var str1 = L('welcome_message');
var str2 = Ti.Locale.getString('welcome_message');
```

**With default value:**
```javascript
var str = L('missing_key', 'Default text');
```

**In UI components:**
```javascript
// Using titleid property
var label = Ti.UI.createLabel({
    titleid: 'welcome_message'
});

// Or with L() macro
var label = Ti.UI.createLabel({
    text: L('welcome_message')
});
```

**String formatting:**
```javascript
// Simple replacement
var formatted = String.format(L('format_test'), 'Kevin');
// Result: "Your name is Kevin"

// Ordered replacement
var formatted = String.format(L('ordered'), 'Jeff', 'Kevin');
// Result: "Hi Jeff, my name is Kevin"
```

### Localizing App Name

**iOS and Android (SDK 3.2+):**

Create `i18n/{lang}/app.xml`:

```xml
<!-- i18n/en/app.xml -->
<resources>
    <string name="appname">My App</string>
</resources>

<!-- i18n/es/app.xml -->
<resources>
    <string name="appname">Mi App</string>
</resources>

<!-- i18n/ja/app.xml -->
<resources>
    <string name="appname">私のアプリ</string>
</resources>
```

### iOS-Specific Settings

**Add supported languages to tiapp.xml:**
```xml
<ios>
    <plist>
        <dict>
            <key>CFBundleLocalizations</key>
            <array>
                <string>en</string>
                <string>es</string>
                <string>fr</string>
            </array>
        </dict>
    </plist>
</ios>
```

**Localize permission descriptions (iOS):**

```xml
<!-- i18n/en/app.xml -->
<resources>
    <string name="NSLocationWhenInUseUsageDescription">Your location is needed for...</string>
    <string name="NSContactsUsageDescription">Access to contacts is needed for...</string>
</resources>

<!-- i18n/es/app.xml -->
<resources>
    <string name="NSLocationWhenInUseUsageDescription">Su ubicación es necesaria para...</string>
    <string name="NSContactsUsageDescription">El acceso a contactos es necesario para...</string>
</resources>
```

### Date and Currency Formatting

```javascript
// Date formatting
var today = new Date();
var dateStr = String.formatDate(today, 'long');
var timeStr = String.formatTime(today, 'short');

// Currency
var price = String.formatCurrency(1234.56);

// Decimal
var amount = String.formatDecimal(1234.56);

// Locale info
Ti.API.info(Ti.Locale.currentLanguage);   // "en"
Ti.API.info(Ti.Locale.currentLocale);     // "en-US"
Ti.API.info(Ti.locale.getCurrencyCode('en_US'));  // "USD"
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

### Namespaces

- **iOS:** `Ti.UI.iOS`, `Ti.UI.iPhone`, `Ti.UI.iPad`
- **Android:** `Ti.UI.Android`

### Example: Platform-Specific Properties

```javascript
var win = Ti.UI.createWindow({
    // iOS-specific
    barColor: isIOS ? '#007AFF' : null,
    titlePrompt: isIOS ? 'Title' : null,

    // Android-specific
    softInputMode: isAndroid ? Ti.UI.Android.SOFT_INPUT_ADJUST_PAN : null,
    exitOnClose: isAndroid ? true : false
});
```

### Platform-Specific Constants

```javascript
// iOS-only animation
if (isIOS) {
    win.animate({
        curve: Ti.UI.iOS.ANIMATION_CURVE_EASE_IN,
        duration: 300
    });
}
```

---

## Common Cross-Platform Patterns

### Tab Groups

```javascript
var tabGroup = Ti.UI.createTabGroup();

// Tabs position differently
if (isIOS) {
    // iOS: No special handling needed (bottom tabs)
} else if (isAndroid) {
    // Android: Tabs at top automatically
}

var tab1 = Ti.UI.createTab({
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
    var nav = Ti.UI.iOS.createNavigationWindow({
        window: win
    });
    nav.open();
} else if (isAndroid) {
    // Android: Just open window, use back button
    win.open();
}
```

### Platform-Specific Event Handling

```javascript
if (isAndroid) {
    // Android: Handle hardware back button
    win.addEventListener('androidback', function(e) {
        // Custom back behavior
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
