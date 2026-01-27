# Using Modules

Guide for obtaining, installing, and using Titanium modules to extend app functionality.

## Table of Contents

- [Using Modules](#using-modules)
  - [Table of Contents](#table-of-contents)
  - [Obtaining Modules](#obtaining-modules)
    - [Sources of Modules](#sources-of-modules)
  - [Installing Modules](#installing-modules)
    - [Single Project Installation](#single-project-installation)
    - [Global Installation (All Projects)](#global-installation-all-projects)
  - [Configuring Your App](#configuring-your-app)
    - [Updating tiapp.xml](#updating-tiappxml)
    - [Selecting Module Versions](#selecting-module-versions)
    - [Enable Debugger (for native modules)](#enable-debugger-for-native-modules)
  - [Using a Module](#using-a-module)
    - [Loading the Module (ES5)](#loading-the-module-es5)
    - [Loading the Module (ES6+)](#loading-the-module-es6)
    - [Using Module Functionality](#using-module-functionality)
    - [Module Patterns](#module-patterns)
  - [Troubleshooting](#troubleshooting)
    - ["Requested module not found"](#requested-module-not-found)
    - [Version Conflicts](#version-conflicts)
    - [Platform-Specific Issues](#platform-specific-issues)
    - [Clean Build](#clean-build)
  - [Best Practices](#best-practices)
  - [Module Development](#module-development)

---

## Obtaining Modules

### Sources of Modules

**Official Appcelerator Modules:**
- **Enterprise Extensions** - Available to paid subscribers
  - InAppBilling (Android)
  - StoreKit (iOS)
  - Barcode (iOS/Android)
  - Compression (iOS/Android)
  - OpenGL (iOS)
  - AirPrint (iOS)

**Open-Source Modules:**
- **GitHub: tidev/** - Official open-source modules
  - [ti.admob](https://github.com/tidev/ti.admob) - AdMob ads
  - [ti.map](https://github.com/tidev/ti.map) - Native maps
  - And many more

**Community Modules:**
- **gitTio** - Lists all Titanium modules on GitHub
  - http://gitt.io/
- Individual developer projects (check GitHub)

**Marketplace:**
- Appcelerator Marketplace is no longer in use
- Contact marketplace-admin@axway.com for previously purchased modules

---

## Installing Modules

### Single Project Installation

1. Copy the module ZIP to your app root folder
2. Add module to `tiapp.xml` (see configuration below)
3. Build project - ZIP will be extracted automatically

### Global Installation (All Projects)

Modules are installed to platform-specific locations:

| Operating System | Path                                     |
| ---------------- | ---------------------------------------- |
| macOS            | `~/Library/Application Support/Titanium` |
| Windows          | `%ProgramData%\Titanium\mobilesdk\win32` |

**Show hidden Library folder on macOS:**
```bash
# Permanently show
chflags nohidden ~/Library/

# Open once
open ~/Library
```

---

## Configuring Your App

### Updating tiapp.xml

**Using Studio/IDE:**
1. Open `tiapp.xml`
2. Go to **Overview** tab
3. Click **+** button in Modules section
4. Select module and version
5. Save

**Manually (XML):**
```xml
<modules>
  <module version="3.0.2" platform="ios">ti.map</module>
  <module version="5.0.0" platform="android">ti.admob</module>
</modules>
```

**Attributes:**
- `version` - Must match module manifest
- `platform` - "ios" or "android"

### Selecting Module Versions

When multiple versions are installed, you can select specific versions per platform and build type (development/production).

In Studio, double-click the module to open **Module Properties** dialog.

### Enable Debugger (for native modules)

Required for debugging native modules:

```xml
<ti:app>
  <android xmlns:android="http://schemas.android.com/apk/res/android">
    <manifest>
      <application android:debuggable="true">
      </application>
    </manifest>
  </android>
</ti:app>
```

---

## Using a Module

### Loading the Module (ES5)

```javascript
const Module = require('module.id');
// Example: const Map = require('ti.map');
```

### Loading the Module (ES6+)

```javascript
import Module from 'module.id'
// Example: import Map from 'ti.map'
```

**Important:** Don't include `.js` extension in the module ID.

### Using Module Functionality

After requiring, use the module's API:

```javascript
// ES6+ example with ti.admob
const Admob = require('ti.admob');

const adview = Admob.createView({
    top: 0,
    testing: true,
    adBackgroundColor: 'black',
    primaryTextColor: 'blue',
    publisherId: 'YOUR_PUBLISHER_ID'
});

win.add(adview);
```

### Module Patterns

**Singleton pattern:**
```javascript
const admob = require('ti.admob');
admob.createView({...});
```

**Constructor pattern:**
```javascript
const Map = require('ti.map');
const view = Map.createView({...});
```

Refer to module documentation for its specific API.

---

## Troubleshooting

### "Requested module not found"

**Solutions:**
1. Check module ID spelling in `require()`
2. Verify module is added to `tiapp.xml`
3. Confirm module is installed (check global or local path)
4. Remove `version` attribute to use latest version

### Version Conflicts

If multiple versions exist, specify exact version in `tiapp.xml` or remove version attribute to use latest.

### Platform-Specific Issues

- **iOS:** Module must support iOS SDK version you're using
- **Android:** Check module's `platform` attribute in manifest matches target

### Clean Build

Sometimes needed after installing modules:

```bash
# Clean and rebuild
ti clean
```

---

## Best Practices

1. **Version pinning** - Specify exact module versions for production
2. **Check compatibility** - Verify module supports your Titanium SDK version
3. **Test on devices** - Modules may behave differently on simulator vs. device
4. **Keep updated** - Update modules regularly for bug fixes and new features
5. **Read documentation** - Each module has specific setup and usage patterns

---

## Module Development

If you need to create your own module, see the **extending-titanium.md** reference for:
- Android Module Development Guide
- iOS Module Development Guide
- Module architecture and best practices
