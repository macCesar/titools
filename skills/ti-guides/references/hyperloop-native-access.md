# Hyperloop


Hyperloop lets JavaScript call native classes directly. Instead of writing a
module to wrap `UIImpactFeedbackGenerator`, you require it and use it.

```js
const UIImpactFeedbackGenerator = require('UIKit/UIImpactFeedbackGenerator');

const generator = UIImpactFeedbackGenerator.alloc().init();
generator.impactOccurred();
```

```js
const Toast = require('android.widget.Toast');
const Activity = Ti.Android.currentActivity;

Toast.makeText(Activity, 'Saved', Toast.LENGTH_SHORT).show();
```

It is a module, maintained by TiDev, and still current: 8.0.1 is the release
against SDK 13.4.

## Install

```xml
<modules>
  <module platform="android">hyperloop</module>
  <module platform="iphone">hyperloop</module>
</modules>
```

The module is unpacked like any other - see
[using modules](https://titaniumsdk.com/docs/build/modules).

## How the require works

The path is the native type's own name.

| Platform | Form                  | Example                           |
| -------- | --------------------- | --------------------------------- |
| iOS      | `Framework/Class`     | `require('UIKit/UIView')`         |
| Android  | Fully-qualified class | `require('android.widget.Toast')` |

Hyperloop generates a JavaScript wrapper for each type you require, at build
time, by reading the platform's own metadata. That is why a type you have not
required costs nothing.

## Hyperloop or a module

**Hyperloop** for a handful of calls, for something a single app needs, and for
trying an API out. No native toolchain knowledge and no separate build.

**A module** for something several apps need, for anything with real native
logic behind it, and when you want to ship a versioned artifact. See
[native modules](https://titaniumsdk.com/docs/extend/modules).

The wrong choice in one direction is a module for three lines. In the other, it
is the same Hyperloop code pasted into four apps.

## What it costs

**Build time.** Hyperloop scans your JavaScript for requires and generates
wrappers for each. A build with many is measurably slower.

**Every call crosses the bridge.** Native code called in a loop from JavaScript
pays per iteration. Keep native work on the native side.

**You are using the platform API directly**, so there is no cross-platform
shape and no Titanium safety net. Guard with `OS_IOS` and `OS_ANDROID`, or
`Ti.Platform.osname`.

**The API is the platform's**, so its documentation is Apple's and Google's.
Titanium's reference does not describe it.

## Next

[CLI plugins](https://titaniumsdk.com/docs/extend/cli-plugins) is the other extension point: changing
the build rather than the app.

## Platform guards in Classic and Alloy

Use Alloy compile-time constants only in Alloy source. In Classic use `Ti.Platform.osname` or a supported platform directory; otherwise `OS_IOS`/`OS_ANDROID` are undefined. Native method availability is controlled by the installed OS/framework, so check platform documentation and guard optional APIs. SDK 14-only changes remain outside this released baseline.
