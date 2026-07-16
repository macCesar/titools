# Using modules

Guide to obtaining, installing, and using Titanium modules to extend app functionality.

## Obtaining modules

### Sources of modules

Official modules:
- Enterprise Extensions
  - InAppBilling (Android)
  - StoreKit (iOS)
  - Barcode (iOS/Android)
  - Compression (iOS/Android)
  - OpenGL (iOS)
  - AirPrint (iOS)

Open-source modules:
- GitHub: tidev
  - https://github.com/tidev/ti.admob - AdMob ads
  - https://github.com/tidev/ti.map - Native maps
  - And more in the org

Community modules:
- From Zero To App list: https://fromzerotoapp.com/modules/
- Curated list of modules maintained by Michael Gangolf

Marketplace:
The original Appcelerator Marketplace is no longer available. Find community modules on GitHub and npm. A curated list is at https://fromzerotoapp.com/modules/.

### Pre-installed modules
Some modules ship with the SDK and do not need separate installation: `ti.map`, `ti.identity`, `ti.webdialog`, `ti.applesignin`.

## Installing modules

### Single project installation
1. Copy the module ZIP to your app root folder.
2. Add the module to `tiapp.xml` (see configuration below).
3. Build the project. The ZIP is extracted automatically.

### Global installation (all projects)
Modules install to platform-specific locations:

| Operating system | Path                                     |
| ---------------- | ---------------------------------------- |
| macOS            | `~/Library/Application Support/Titanium` |
| Windows          | `%ProgramData%\Titanium\mobilesdk\win32` |

Show hidden Library folder on macOS:

```bash
# Permanently show
chflags nohidden ~/Library/

# Open once
open ~/Library
```

## Configuring your app

### Updating tiapp.xml

Using Studio/IDE:
1. Open `tiapp.xml`.
2. Go to the Overview tab.
3. Click the plus button in Modules.
4. Select module and version.
5. Save.

Manually (XML):

```xml
<modules>
  <module version="3.0.2" platform="ios">ti.map</module>
  <module version="5.0.0" platform="android">ti.admob</module>
</modules>
```

Attributes:
- `version`: must match the module manifest
- `platform`: "ios" or "android"

### Selecting module versions
If multiple versions are installed, select specific versions per platform and build type (development/production).

In Studio, double-click the module to open the Module Properties dialog.

### Enable debugger (for native modules)
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

## Using a module

### Loading the module (ES5)

```javascript
const Module = require('module.id');
// Example: const Map = require('ti.map');
```

### Loading the module (ES6+)

```javascript
import Module from 'module.id'
// Example: import Map from 'ti.map'
```

Important: do not include the `.js` extension in the module ID.

### Using module functionality
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

### Module patterns

Singleton pattern:
```javascript
const admob = require('ti.admob');
admob.createView({ ... });
```

Constructor pattern:
```javascript
const Map = require('ti.map');
const view = Map.createView({ ... });
```

Refer to module documentation for its specific API.

## Troubleshooting

### "Requested module not found"
Solutions:
1. Check module ID spelling in `require()`.
2. Verify the module is added to `tiapp.xml`.
3. Confirm the module is installed (global or local path).
4. Remove the `version` attribute to use the latest version.

### Version conflicts
If multiple versions exist, specify the exact version in `tiapp.xml`, or remove the version attribute to use the latest.

### Platform-specific issues
- iOS: the module must support the iOS SDK version you are using.
- Android: the module manifest `platform` must match the target.

### Clean build
Sometimes needed after installing modules:

```bash
# Clean and rebuild
ti clean
```

## Best practices

1. Pin versions for production.
2. Check compatibility with your Titanium SDK version.
3. Test on devices. Some modules behave differently on simulator vs device.
