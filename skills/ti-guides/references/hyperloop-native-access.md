# Hyperloop: Native API Access

Hyperloop allows you to access 100% of native APIs (iOS Objective-C/Swift and Android Java/Kotlin) directly from JavaScript.

## 1. Core Syntax
- **`require('Framework/Class')`**: Access the native class.
- **Instantiation**: Use `new Class()` or `Class.alloc().init()`.

## 2. iOS (Objective-C)
- **Method Concatenation**: Selector `addAttribute:value:range:` becomes `addAttributeValueRange(a, v, r)`.
- **Casting**: Use `UIView.cast(proxy)` to convert a Titanium proxy to a native view.
- **Blocks**: Pass a JavaScript function where a native block is expected.

## 3. Android (Java)
- **Activity Context**: Often required for view constructors.
  ```javascript
  const Activity = require('android.app.Activity');
  const activity = new Activity(Ti.Android.currentActivity);
  ```
- **Interfaces**: Pass a JS object with methods matching the interface.
- **Gradle**: Add dependencies in `app/platform/android/build.gradle`.
- **Method Overloading**: Hyperloop automatically selects the matching overload based on parameter types.

## 4. Swift Support (iOS)
Hyperloop supports Swift classes alongside Objective-C. You can directly access Swift classes from JavaScript.
- Swift and Objective-C classes can be mixed in the same app
- Use the same `require()` syntax for Swift classes

## 5. XIB and Storyboards (iOS)
XIB files and Storyboards are supported but must be programmatically loaded:
```javascript
// Load XIB example
const NSBundle = require('Foundation.NSBundle');
const UINib = require('UIKit.UINib');

const nib = UINib.nibWithNibName_bundle('MyView', NSBundle.mainBundle);
const objects = nib.instantiateWithOwner_options(null, null);
```

## 6. Debugging Hyperloop

### Limitations
- Studio debugging capabilities are limited for Hyperloop code
- Hyperloop modifies source files during build, which throws debuggers off track
- Breakpoints may not hit correctly in main listview click events

### Workarounds
- **iOS**: Use Safari Web Inspector for debugging up to the native transition point
- **Android**: Use Chrome DevTools (SDK 7.0.0+)
- Note: No source maps available for processed Alloy controllers

## 7. TiApp Utility Class (iOS)
The `TiApp` utility class provides access to Titanium's app instance:
```javascript
const TiApp = require('TiApp.TiApp');
const app = TiApp.app();
```

Useful for accessing the app delegate, key window, and app-level properties.

## 8. Performance Tip
Don't use Hyperloop for things Titanium already does well. Use it for specialized APIs (e.g., custom UI components or hardware access not covered by modules).
