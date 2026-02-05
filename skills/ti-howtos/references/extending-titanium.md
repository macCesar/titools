# Extending Titanium

## 1. Module architecture (core concepts)

Titanium modules are based on a native class hierarchy that communicates with JavaScript:

- Proxy: base class that binds native code with JS and maintains object state
- Module: special Proxy that defines a namespace (for example, `Ti.UI`). Only one per project is allowed.
- ViewProxy: Proxy specialized in rendering views; manages the native view lifecycle
- View: the actual visual representation (for example, a `UIButton` or an Android `UIView`)

### Proxy-view relationship
The `ViewProxy` keeps properties in JS even if the native view does not exist yet. When the view is added to the hierarchy, the Proxy creates the native `View` and applies all accumulated properties.

### Threading considerations
- JavaScript in Titanium is single-threaded. All JS callbacks run on the JS runtime thread.
- Native modules can use background threads for heavy work, but UI operations must happen on the main/UI thread.
- On iOS, each Window with a `url` property gets its own JS context and thread. Avoid this pattern.
- Use `@Kroll.method(runOnUiThread=true)` (Android) to ensure a method runs on the UI thread.

### Key Android Kroll annotations
- `@Kroll.method` - expose a Java method to JavaScript
- `@Kroll.getProperty` / `@Kroll.setProperty` - expose getter/setter properties
- `@Kroll.onAppCreate` - annotate a static method to run when the app process starts
- `propertyAccessors` in `@Kroll.proxy` - auto-generate getter/setter methods

## 2. Module debugging in Xcode (iOS)

You can debug a native module directly within a Titanium project:

1. Open the generated Xcode project at `build/iphone/<App>.xcodeproj`.
2. Drag the module project (`.xcodeproj`) into the app project in Xcode.
3. In the app, go to Build Phases → Dependencies and add the module.
4. In Link Binary With Libraries, add the module's `.a` library or framework.
5. Set a breakpoint in your native code and launch the app from Xcode.

## 3. Upgrading to SDK 9.0.0+ (Android)

Titanium 9.0.0 introduced major Android changes:

- AndroidX: legacy support libraries are no longer supported. Migrate Java/Kotlin code to AndroidX.
- Gradle: modules now use Gradle for dependencies. Create `android/build.gradle` instead of copying `.jar` files into `lib/`.
- Architectures: include `arm64-v8a` and `x86_64` in the manifest.

Example module `build.gradle`:
```gradle
dependencies {
    implementation 'com.google.android.material:material:1.1.0'
}
```

## 4. Hyperloop

### What is Hyperloop?

Hyperloop provides direct JavaScript access to native iOS and Android APIs without writing wrapper code. You can call native methods, create native objects, and interact with platform frameworks directly.

### Prerequisites

For iOS:
- Requires `ti.hyperloop` module in `tiapp.xml`
- Only works with Classic Titanium projects (not Alloy initially, now supported)
- iOS 7+ deployment target

For Android:
- Requires `ti.hyperloop` module in `tiapp.xml`
- Android 4.0+ (API level 14+)

Enable in `tiapp.xml`:
```xml
<modules>
  <module platform="iphone">ti.hyperloop</module>
  <module platform="android">ti.hyperloop</module>
</modules>
```

### Hyperloop basics

Pattern for accessing native APIs:
```javascript
const NativeClass = require('path.to.NativeClass');
const instance = new NativeClass();
instance.methodName();
```

### iOS Hyperloop examples

#### Access iOS frameworks

```javascript
// Access Foundation framework
const NSString = require('Foundation/NSString');
const NSMutableString = require('Foundation/NSMutableString');

// Create string
const str = NSString.stringWithString('Hello from Hyperloop');
Ti.API.info(`Length: ${str.length()}`);

// Mutable string
const mutable = NSMutableString.alloc().initWithString('Hello');
mutable.appendString(' Hyperloop');
Ti.API.info(mutable); // "Hello Hyperloop"
```

#### Access UIKit

```javascript
const UIViewController = require('UIKit/UIViewController');
const UIColor = require('UIKit/UIColor');

// Create native view controller
const controller = UIViewController.alloc().init();

// Set background color
controller.view().setBackgroundColor(
  UIColor.redColor()
);
```

#### Make native HTTP request

```javascript
const NSURL = require('Foundation/NSURL');
const NSURLRequest = require('Foundation/NSURLRequest');
const NSURLSession = require('Foundation/NSURLSession');

const url = NSURL.URLWithString('https://api.example.com/data');
const request = NSURLRequest.requestWithURL(url);

const session = NSURLSession.sharedSession();
const task = session.dataTaskWithRequestCompletionHandler(request, (data, response, error) => {
  if (!error) {
    Ti.API.info('Response received');
    // Process data
  }
});

task.resume();
```

#### Access CoreBluetooth (Bluetooth LE)

```javascript
var CBCentralManager = require('CoreBluetooth/CBCentralManager');

var central = CBCentralManager.alloc().initWithDelegateQueueOptions(
  null, // delegate
  null // queue
);

// Check Bluetooth state
var state = central.state();
if (state === 5) { // CBCentralManagerStatePoweredOn
  // Start scanning
  central.scanForPeripheralsWithServicesOptions(null, null);
}
```

#### Access AVFoundation (camera/video)

```javascript
var AVCaptureDevice = require('AVFoundation/AVCaptureDevice');

// Get back camera
var devices = AVCaptureDevice.devicesWithMediaType('vide');
var backCamera = null;

for (var i = 0; i < devices.count(); i++) {
  var device = devices.objectAtIndex(i);
  if (device.position() === 1) { // AVCaptureDevicePositionBack
    backCamera = device;
    break;
  }
}

// Configure camera
if (backCamera) {
  backCamera.lockForConfiguration(null);
  backCamera.setFlashMode(1); // AVCaptureFlashModeOn
  backCamera.unlockForConfiguration();
}
```

#### Access Address Book (contacts)

```javascript
var ABAddressBook = require('AddressBook/ABAddressBook');

var addressBook = ABAddressBook.create();
var people = addressBook.people();

for (var i = 0; i < people.count(); i++) {
  var person = people.objectAtIndex(i);
  var firstName = person.valueForProperty(0); // kABPersonFirstNameProperty
  Ti.API.info('Contact: ' + firstName);
}
```

#### Access CoreLocation (enhanced)

```javascript
var CLLocationManager = require('CoreLocation/CLLocationManager');
var CLLocation = require('CoreLocation/CLLocation');

var locationManager = CLLocationManager.alloc().init();
locationManager.setDelegate(null);
locationManager.setDesiredAccuracy(3); // kCLLocationAccuracyBest
locationManager.startUpdatingLocation();
```

### Android Hyperloop examples

#### Access Android frameworks

```javascript
const Context = require('android.content.Context');
const Activity = require('android.app.Activity');
const Toast = require('android.widget.Toast');

// Get current activity
const activity = Ti.Android.currentActivity;

// Show toast
Toast.makeText(
  activity,
  'Hello from Hyperloop',
  Toast.LENGTH_SHORT
).show();
```

#### Access vibrator

```javascript
const Vibrator = require('android.os.Vibrator');
const Context = require('android.content.Context');

const activity = Ti.Android.currentActivity;
const vibrator = activity.getSystemService(Context.VIBRATOR_SERVICE);

// Vibrate for 500ms
vibrator.vibrate(500);
```

#### Access TelephonyManager

```javascript
const TelephonyManager = require('android.telephony.TelephonyManager');
const Context = require('android.content.Context');

const activity = Ti.Android.currentActivity;
const tm = activity.getSystemService(Context.TELEPHONY_SERVICE);

// Get device ID
const deviceId = tm.getDeviceId();
Ti.API.info(`Device ID: ${deviceId}`);

// Get phone state
const state = tm.getCallState();
if (state === 0) {
  Ti.API.info('Phone idle');
} else if (state === 1) {
  Ti.API.info('Phone ringing');
} else if (state === 2) {
  Ti.API.info('Phone offhook');
}
```

#### Access WiFi Manager

```javascript
const WifiManager = require('android.net.wifi.WifiManager');
const Context = require('android.content.Context');

const activity = Ti.Android.currentActivity;
const wifi = activity.getSystemService(Context.WIFI_SERVICE);

// Check WiFi enabled
if (wifi.isWifiEnabled()) {
  // Get connection info
  const info = wifi.getConnectionInfo();
  const ssid = info.getSSID();
  const speed = info.getLinkSpeed();
  Ti.API.info(`Connected to: ${ssid} at ${speed} Mbps`);
}
```

#### Access PackageManager

```javascript
const PackageManager = require('android.content.pm.PackageManager');

const activity = Ti.Android.currentActivity;
const pm = activity.getPackageManager();

// Get installed apps
const packages = pm.getInstalledApplications(0);
for (let i = 0; i < packages.size(); i++) {
  const pkg = packages.get(i);
  const appName = pm.getApplicationLabel(pkg);
  Ti.API.info(`App: ${appName}`);
}
```

### Hyperloop best practices

1. Check platform availability. Use `Ti.Platform.osname` to branch code.
2. Handle errors. Native calls can throw exceptions.
3. Memory management: be aware of native object lifecycles.
4. Test thoroughly. Native APIs have platform-specific behaviors.
5. Document requirements. Note platform versions and permissions needed.
6. Use try/catch. Wrap native calls for safety.

```javascript
try {
  const NativeClass = require('path.to.NativeClass');
  const instance = new NativeClass();
  // Use instance
} catch (e) {
  Ti.API.error(`Hyperloop error: ${e.message}`);
}
```

## 3. Native module development

### When to create native modules

Create a native module when you need to:
- Reuse native code across multiple Titanium apps
- Distribute functionality to other developers
- Implement complex native functionality not suitable for Hyperloop
- Maintain a stable API regardless of native SDK changes

### Android module development

#### Quick start

1. Create module structure:
```
com.example.mymodule/
├── src/
│   └── com/
│       └── example/
│           └── mymodule/
│               ├── ExampleModule.java
│               └── ExampleProxy.java
├── build.properties
├── build.xml
├── timodule.xml
└── LICENSE
```

2. Module Java class:

```java
package com.example.mymodule;

import org.appcelerator.kroll.KrollModule;
import org.appcelerator.kroll.annotations.KrollModule;

@KrollModule(name="MyModule", id="com.example.mymodule")
public class ExampleModule extends KrollModule {

    public ExampleModule() {
        super();
    }

    @Kroll.method
    public String helloWorld() {
        return "Hello from native module!";
    }

    @Kroll.method
    public int add(int a, int b) {
        return a + b;
    }

    @Kroll.getProperty
    public String getVersion() {
        return "1.0.0";
    }
}
```

3. `timodule.xml`:
```xml
<module>
    <description>My Example Module</description>
    <version>1.0.0</version>
    <platform>android</platform>
    <min-sdk>3.0.0.GA</min-sdk>
</module>
```

4. Build and package:
```bash
ant clean
ant package
```

#### Use in Titanium app

```javascript
const myModule = require('com.example.mymodule');
Ti.API.info(myModule.helloWorld()); // "Hello from native module!"
Ti.API.info(myModule.add(5, 3)); // 8
Ti.API.info(myModule.version); // "1.0.0"
```

#### Common Android module patterns

Accessing Android APIs:

```java
import android.content.Context;
import android.location.LocationManager;

@Kroll.method
public boolean isGPSEnabled() {
    LocationManager lm = (LocationManager) getActivity().getSystemService(Context.LOCATION_SERVICE);
    return lm.isProviderEnabled(LocationManager.GPS_PROVIDER);
}
```

Firing events to JavaScript:

```java
import org.appcelerator.kroll.KrollDict;

@Kroll.method
public void triggerEvent() {
    KrollDict data = new KrollDict();
    data.put("message", "Hello from native!");
    fireEvent("myEvent", data);
}
```

Receiving events from JavaScript:

```java
@Kroll.method
public void startService() {
    // Start service and listen for events
}
```

### iOS module development

#### Quick start

1. Create module with template:
```bash
# Use Titanium CLI
titanium create --type module --id com.example.mymodule --name MyModule --platform ios
```

2. Module structure:
```
com.example.mymodule/
├── Classes/
│   ├── ComExampleMymoduleModule.h
│   ├── ComExampleMymoduleModule.m
│   └── ComExampleMymoduleProxy.h
├── documentation/
│   └── index.md
├── assets/
├── iphone/
│   └── MyModule_Prefix.pch
├── timodule.xml
└── LICENSE
```

3. Module implementation (`ComExampleMymoduleModule.m`):

```objc
#import "ComExampleMymoduleModule.h"

@implementation ComExampleMymoduleModule

#pragma mark Internal

- (id)moduleGUID {
    return @"com.example.mymodule";
}

- (NSString *)moduleName {
    return @"MyModule";
}

#pragma mark Lifecycle

- (void)startup {
    [super startup];
    DebugLog(@"[DEBUG] MyModule initialized");
}

- (void)shutdown:(id)sender {
    [super shutdown:sender];
}

#pragma mark Cleanup

- (void)dealloc {
    [super dealloc];
}

#pragma Public APIs

- (NSString*)version {
    return @"1.0.0";
}

- (NSString*)helloWorld {
    return @"Hello from native module!";
}

- (NSNumber*)add:(NSNumber*)a with:(NSNumber*)b {
    return [NSNumber numberWithInt:[a intValue] + [b intValue]];
}

@end
```

4. `timodule.xml`:
```xml
<module>
    <description>My Example Module</description>
    <version>1.0.0</version>
    <platform>iphone</platform>
    <min-sdk>3.0.0.GA</min-sdk>
</module>
```

5. Build and package:
```bash
./build.py
```

6. Use in Titanium app:

```javascript
const myModule = require('com.example.mymodule');
Ti.API.info(myModule.helloWorld()); // "Hello from native module!"
Ti.API.info(myModule.add(5, { with: 3 })); // 8
Ti.API.info(myModule.version); // "1.0.0"
```

#### Common iOS module patterns

Accessing iOS frameworks:

```objc
#import <CoreLocation/CoreLocation.h>

- (void)startTracking {
    CLLocationManager *manager = [[CLLocationManager alloc] init];
    [manager setDelegate:self];
    [manager startUpdatingLocation];
}
```

Firing events to JavaScript:

```objc
- (void)locationUpdated:(CLLocation*)location {
    NSDictionary *event = @{
        @"latitude": [NSNumber numberWithDouble:location.coordinate.latitude],
        @"longitude": [NSNumber numberWithDouble:location.coordinate.longitude]
    };
    [self fireEvent:@"locationUpdate" withObject:event];
}
```

View proxies (custom UI components):

```objc
@interface MyViewProxy : TiViewProxy {
    UIView *myView;
}

- (UIView *)view {
    if (myView == nil) {
        myView = [[MyCustomView alloc] initWithFrame:[self frame]];
    }
    return myView;
}

@end
```

### Module distribution

#### Packaging

Both platforms create a `.zip` file for distribution:

```bash
# For iOS
./build.py -d

# For Android
ant dist
```

#### Installing module

1. Local installation: extract to `/Library/Application Support/Titanium/modules/`
2. Global installation: use `gittio` or `npm` for publishing
3. Project-specific: place in the app's `modules/` directory

#### Module configuration in tiapp.xml

```xml
<modules>
  <module platform="android" version="1.0.0">com.example.mymodule</module>
  <module platform="iphone" version="1.0.0">com.example.mymodule</module>
</modules>
```

## 4. Choosing between Hyperloop and native modules

### Use Hyperloop when

- Prototyping native API access
- App-specific native functionality (not reusable)
- One-off native API calls
- Quick integration with platform features
- You do not need to distribute code

### Use native modules when

- Creating reusable components
- Distributing to other developers
- Complex native logic with state management
- Need stable API abstraction
- Performance-critical code paths
- Custom UI components

## 5. Finding and using third-party modules

### Ti_slack marketplace

Search for existing modules at:
- https://fromzerotoapp.com/modules/
- https://github.com/search?q=titanium+module

### Popular third-party modules

- ti.map - Enhanced mapping (Google Maps, Apple Maps)
- ti.paint - Drawing/signature capture
- ti.barcode - Barcode/QR scanning
- ti.admob - AdMob integration
- ti.facebook - Facebook SDK
- ti.googleplus - Google+ SDK
- ti.oauth2 - OAuth 2.0 client

### Using third-party modules

1. Download module zip
2. Extract to modules directory
3. Add to `tiapp.xml`:

```xml
<modules>
  <module platform="android">com.mapbox.map</module>
  <module platform="iphone">com.mapbox.map</module>
</modules>
```

4. Require in code:

```javascript
const Mapbox = require('com.mapbox.map');
```

## Best practices summary

1. Try built-in APIs first; Titanium may already have what you need.
2. Prefer Hyperloop for simple cases; less overhead.
3. Create modules for reusable code; better distribution.
4. Handle platform differences; branch code appropriately.
5. Document dependencies; note SDK versions and requirements.
6. Test on real devices; simulators may not support all features.
7. Version your modules; use semantic versioning for compatibility.
8. Provide examples; help users understand usage patterns.
