# Hyperloop: Native API Access

Hyperloop allows you to access 100% of native APIs (iOS Objective-C/Swift and Android Java/Kotlin) directly from JavaScript. It is pre-packaged with the Titanium SDK and works as a native module.

## 1. Requirements

- **Titanium SDK**: 9.0.0+
- **Titanium CLI**: 7.0.0+
- **Alloy** (optional): 1.8.0+
- **CocoaPods** (optional, iOS only): 1.0.0+
- **Xcode location**: Must be at `/Applications/Xcode.app` -- Hyperloop uses a bundled library from Xcode to inspect available native APIs. Having Xcode in a non-default location (via `xcode-select` or Xcode preferences) while another installation exists in the default folder can cause metadata errors.

## 2. Enabling Hyperloop

Add the Hyperloop module to your `tiapp.xml`:

```xml
<modules>
  <module>hyperloop</module>
</modules>
```

The `run-on-main-thread` property should already be in `tiapp.xml` by default:
```xml
<property name="run-on-main-thread" type="bool">true</property>
```

> Do NOT name your app "Hyperloop" in tiapp.xml -- it is a reserved word and will cause build failures.

## 3. Framework Namespace Conventions

Each platform uses different `require()` conventions:

**iOS** -- use `Framework/Class` with a forward slash:
```javascript
const UIView = require('UIKit/UIView');
const NSBundle = require('Foundation/NSBundle');
const UIColor = require('UIKit/UIColor');
```

**Android** -- use the full Java package with dots:
```javascript
const View = require('android.view.View');
const Activity = require('android.app.Activity');
const Context = require('android.content.Context');
```

## 4. iOS (Objective-C)

### Instantiation: `new` vs `alloc().init()`

- **`new Class()`**: Equivalent to `alloc().init()`. Only calls the **default** initializer (`init`).
- **`Class.alloc().initWith*()`**: Use when you need a **special initializer** with arguments.

```javascript
const UIView = require('UIKit/UIView');

// Default initializer (both are equivalent)
const view1 = new UIView();
const view2 = UIView.alloc().init();

// Special initializer with arguments -- must use alloc().init*()
const CGRectMake = require('CoreGraphics').CGRectMake;
const view3 = UIView.alloc().initWithFrame(CGRectMake(0, 0, 100, 100));
```

### Named Methods (Selector Concatenation)

Selectors with multiple parameters are camel-cased and colons are removed. Arguments are passed in the same order as in Objective-C.

Selector `addAttribute:value:range:` becomes `addAttributeValueRange(attr, val, range)`.

```javascript
// Objective-C: [myView insertSubview:anotherView atIndex:0]
myView.insertSubviewAtIndex(anotherView, 0);

// Objective-C: [UIView animateWithDuration:1.0 animations:^{} completion:^(BOOL){}]
UIView.animateWithDurationAnimationsCompletion(1.0, () => {
  view.layer.opacity = 0.0;
}, (finished) => {
  // Animation completed
});
```

### Properties

Objective-C properties map directly to JavaScript property accessors. Auto-generated setters are also available:
```javascript
view.backgroundColor = UIColor.redColor;
// or
view.setBackgroundColor(UIColor.redColor);
```

### Casting

Use `Class.cast(object)` to convert a generic return type (`NSObject` / `id`) or a Titanium proxy to a native view:
```javascript
const UIView = require('UIKit/UIView');

// Cast a generic object
const view = UIView.cast(someObject);

// Cast a Titanium view to its native equivalent
const tiView = Ti.UI.createView({ backgroundColor: 'red' });
const nativeView = UIView.cast(tiView);
```

> Be careful with casting: casting to the wrong type will cause a crash.

### Blocks

Blocks are translated to JavaScript callback functions:
```javascript
const UIView = require('UIKit/UIView');

UIView.animateWithDurationAnimationsCompletion(1.0, () => {
  view.layer.opacity = 0.0;
}, (done) => {
  // Animation completed
});
```

### Constants, Enumerations, and Functions

Framework-level constants and enums are accessed by requiring the framework itself:
```javascript
const UIKit = require('UIKit');
const unspecified = UIKit.UISemanticContentAttributeUnspecified;
view.semanticContentAttribute = unspecified;
```

### TiApp Utility Class

Access Titanium's app instance for the app delegate, key window, and app-level properties:
```javascript
const TiApp = require('TiApp/TiApp');
const app = TiApp.app();
```

## 5. iOS: Creating Custom Classes

Use `Hyperloop.defineClass()` to create Objective-C classes at runtime:

```javascript
// defineClass(className, superClass, protocolsArray)
const MyView = Hyperloop.defineClass('MyView', 'UIView', ['UIAppearance']);
```

Add methods with `addMethod()`:
```javascript
MyView.addMethod({
  selector: 'drawRect:',
  instance: true,
  arguments: ['CGRect'],
  callback: function(rect) {
    // Called when drawRect: is invoked
  }
});
```

Methods with multiple arguments and return types:
```javascript
MyView.addMethod({
  selector: 'foo:bar:hello:',
  instance: true,
  returnType: 'void',
  arguments: ['int', 'float', 'id'],
  callback: function(a, b, c) {
    // Invoked when the method is called
  }
});
```

`addMethod` properties:
- **`selector`**: The Objective-C selector string
- **`instance`**: `true` for instance methods, `false` for class methods
- **`arguments`**: Array or String of argument types (Objective-C encoding types or general types like `float`, `int`, `id`)
- **`returnType`**: String return type. Omit for `void`.
- **`callback`**: The JavaScript function implementation

Instantiate the custom class normally:
```javascript
const myView = new MyView();
```

## 6. iOS: CocoaPods Support

### Installation

Install CocoaPods if not already installed:
```bash
sudo gem install cocoapods
```

### Podfile Configuration

Create a `Podfile` in your Titanium project root:
```ruby
# Required for CocoaPods 1.x
install! 'cocoapods',
         :integrate_targets => false

platform :ios, '12.0'
target 'YourProjectName' do
    pod 'SomeLibrary'
end
```

Replace `YourProjectName` with your actual Titanium project name.

### Using the Pod

```javascript
const JBBarChartView = require('JBChartView/JBBarChartView');
const chart = new JBBarChartView();
chart.minimumValue = 1;
chart.maximumValue = 100;
```

### Bitcode Handling for Ad-Hoc Builds

If your build fails due to mixed Bitcode frameworks, disable Bitcode in your Podfile:
```ruby
post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['ENABLE_BITCODE'] = 'NO'
    end
  end
end
```

### Custom Frameworks (without CocoaPods)

Drop native iOS frameworks (static or dynamic) into `app/platform/ios` (Alloy) or `platform/ios` (Classic). They will be automatically detected and linked.

## 7. iOS: Swift Support

Hyperloop supports Swift classes alongside Objective-C:
- Swift and Objective-C classes can be mixed in the same app
- Use the same `require()` syntax for Swift classes
- For Swift frameworks via CocoaPods, use the `use_frameworks!` flag in your Podfile

## 8. iOS: XIB and Storyboards

XIB files and Storyboards must be programmatically loaded. Place them in `app/assets/iphone` (Alloy) or `Resources/iphone` (Classic) and they will be compiled automatically.

```javascript
const NSBundle = require('Foundation/NSBundle');
const UINib = require('UIKit/UINib');

const nib = UINib.nibWithNibNameBundle('MyView', NSBundle.mainBundle);
const objects = nib.instantiateWithOwnerOptions(null, null);
```

The following resources are compiled automatically: `*.storyboard`, `*.xcdatamodel`, `*.xcdatamodeld`, `*.xcmappingmodel`, `*.xib`.

## 9. iOS: Customizing the Xcode Build

Use `appc.js` in the project root to pass custom flags to `xcodebuild`:
```javascript
module.exports = {
  hyperloop: {
    ios: {
      xcodebuild: {
        flags: {
          GCC_PREPROCESSOR_DEFINITIONS: 'foo=bar'
        }
      }
    }
  }
};
```

## 10. Android (Java)

### Activity Context

Most Android view constructors require an Activity context:
```javascript
const Activity = require('android.app.Activity');
const activity = new Activity(Ti.Android.currentActivity);
```

### Methods and Fields

Java methods map to JavaScript functions. Java fields map to JavaScript property accessors. Static methods and constants are attached to the class type:
```javascript
const View = require('android.view.View');
const generatedId = View.generateViewId(); // static method
```

### Method Overloading

Hyperloop automatically selects the matching overload based on parameter types. It is slightly more liberal with numeric primitives due to JavaScript Number conversion.

### Casting

Pass the object to the constructor of the target type:
```javascript
const View = require('android.view.View');

// Cast a generic Object to a View
const view = new View(someObject);

// Cast a Titanium view to native
const tiView = Ti.UI.createView({ backgroundColor: 'red' });
const nativeView = new View(tiView);
```

### Interfaces

Implement Java interfaces by passing a JavaScript object with matching method names:
```javascript
const OnTouchListener = require('android.view.View.OnTouchListener');
const listener = new OnTouchListener({
  onTouch: (v, event) => {
    // Handle touch
    return true;
  }
});
```

### Creating Custom Classes (Android)

Use `.extend()` on the class to subclass, passing an object with method overrides:
```javascript
const Activity = require('android.app.Activity');
const View = require('android.view.View');
const activity = new Activity(Ti.Android.currentActivity);

const MyView = View.extend({
  onDraw: function(canvas) {
    this.super.onDraw(canvas);
    // Custom drawing implementation
  }
});
const customView = new MyView(activity);
```

## 11. Android: Native XML Layouts

### Creating the Layout

Place XML layout files in `app/platform/android/res/layout/` (Alloy) or `platform/android/res/layout/` (Classic).

Example `main_content.xml`:
```xml
<androidx.coordinatorlayout.widget.CoordinatorLayout
    android:id="@+id/main_content"
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <ListView
        android:id="@+id/lvToDoList"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

    <com.google.android.material.floatingactionbutton.FloatingActionButton
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="bottom|right"
        android:layout_margin="16dp" />
</androidx.coordinatorlayout.widget.CoordinatorLayout>
```

### Inflating the Layout

```javascript
const Activity = require('android.app.Activity');
const Context = require('android.content.Context');
const Inflater = require('android.view.LayoutInflater');

const activity = new Activity(Ti.Android.currentActivity);
const inflater = Inflater.cast(
  activity.getApplicationContext().getSystemService(Context.LAYOUT_INFLATER_SERVICE)
);

// getIdentifier(name, defType, defPackage) retrieves the R.layout.* ID
const resId = activity.getResources().getIdentifier('main_content', 'layout', activity.getPackageName());
const view = inflater.inflate(resId, null);

// Add to a Titanium view
$.myView.add(view);
```

`getIdentifier()` also works for other resource types: `R.color.*`, `R.string.*`, `R.drawable.*`, etc.

## 12. Android: Third-Party Libraries

### AndroidX Requirement

As of Titanium SDK 9.0.0, you must use **AndroidX** libraries. Google's deprecated Support libraries (`android.support.*`) are no longer supported.

### Gradle Dependencies (Preferred)

Add a `build.gradle` file to `app/platform/android/` (Alloy) or `platform/android/` (Classic):

```groovy
dependencies {
    implementation 'com.google.android.material:material:1.1.0'
}
```

### Local JAR/AAR Dependencies

Place JAR and AAR files directly in `app/platform/android/` (Alloy) or `platform/android/` (Classic). Hyperloop will automatically:
- Load Java classes and generate bindings
- For AARs: extract resources, assets, `*.so` libraries, and merge `AndroidManifest.xml`

### Third-Party Library Example

```javascript
// After adding the AAR to app/platform/android/
const Activity = require('android.app.Activity');
const ParkedTextView = require('com.goka.parkedtextview.ParkedTextView');

const activity = new Activity(Ti.Android.currentActivity);
const parkedView = new ParkedTextView(activity);
parkedView.setParkedText('.slack.com');
parkedView.setHintText('your-team');

// Listen to events via interfaces
const TextWatcher = require('android.text.TextWatcher');
const watcher = new TextWatcher({
  onTextChanged: () => { console.log('Changed'); },
  afterTextChanged: (s) => { console.log('After:', s); },
  beforeTextChanged: () => { console.log('Before'); }
});
parkedView.addTextChangedListener(watcher);

$.myView.add(parkedView);
```

## 13. Debugging Hyperloop

- **iOS**: Use **Safari Web Inspector** to debug Hyperloop code up to the native transition point
- **Android**: Use **Chrome DevTools** for JavaScript debugging
- Breakpoints may not hit correctly in all cases because Hyperloop modifies source files during the build process
- No source maps are available for processed Alloy controllers

## 14. Performance Tips

- Do NOT use Hyperloop for things Titanium already does well
- Use it for specialized APIs: custom UI components, hardware access not covered by modules, or native third-party library integration
- Existing Titanium modules (Java for Android, Objective-C for iOS) continue to be fully supported alongside Hyperloop

## 15. Sample Projects

The official cross-platform example app demonstrates native APIs for iOS and Android, including CocoaPods, Android AAR packages, UICollectionView, Beacons, BottomNavigationView, native XML layouts, Storyboards, XIBs, and more:

- **Repository**: `https://github.com/tidev/hyperloop-examples`
- **Community modules**: `https://github.com/hyperloop-modules` -- JavaScript wrappers around native APIs (Speech, Mapbox, Snackbar, etc.)
