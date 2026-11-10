# Native modules

Based on the [current official guide](https://titaniumsdk.com/docs/extend/modules.md). Examples target released SDK 13.4.1; verify the selected SDK before adopting version-specific behavior.

A native module wraps platform code and exposes it to JavaScript. Write one
when the SDK has no API for something the platform does, or when you need a
native library that has no JavaScript equivalent.

Before you do, check the [modules directory](https://titaniumsdk.com/modules.md) - somebody may already
have. And check [Hyperloop](https://titaniumsdk.com/docs/extend/hyperloop.md), which reaches native APIs
directly without a module at all.

## Create one

```sh
ti create --type module --id com.example.thing --name thing --platforms android --workspace-dir .
```

`--platforms` takes `android`, `ios` or both, and each gets its own directory
with its own build.

```
thing/
  android/
    manifest              id, version, and what it needs
    timodule.xml          module-level tiapp settings
    build.gradle
    src/com/example/thing/
      ThingModule.java    the module object
      ExampleProxy.java   a proxy
    lib/                  third-party jars
    platform/             files copied into the app build
    assets/
  documentation/index.md
  example/app.js          runs against the built module
  LICENSE
```

## The manifest

```
version: 1.0.0
apiversion: 4
architectures: arm64-v8a armeabi-v7a x86 x86_64
name: thing
moduleid: com.example.thing
guid: 1bf6ca03-c384-44f1-8bdc-f06454872771
platform: android
minsdk: 13.4.1
```

`minsdk` is the oldest Titanium SDK the module supports, and the build refuses
when a project's SDK is older. `apiversion` is the module API generation - 4 on
Android, 2 on iOS for 13.4.

Bump `version` on every release. It is what a project pins against.

## What the code looks like

Titanium's Android bridge is Kroll, driven by annotations:

```java
@Kroll.module(name = "Thing", id = "com.example.thing")
public class ThingModule extends KrollModule {

    @Kroll.method
    public String greet(String name) {
        return "Hello " + name;
    }

    @Kroll.constant
    public static final String VERSION = "1.0.0";
}
```

`@Kroll.method` exposes a method, `@Kroll.getProperty` and
`@Kroll.setProperty` make a property, and `@Kroll.constant` makes a constant.
A `KrollProxy` subclass becomes an object your JavaScript can create.

On iOS the equivalent is an Objective-C class extending `TiModule`, where
methods are exposed by naming convention rather than annotation.

## Build and test

Build from the module directory:

```sh
ti build --platform android --build-only
```

That produces a distributable zip. Use `example/app.js` in the module test workflow; the `--build-only` packaging command does not itself demonstrate runtime behavior. It is an example app you run against the built module, which is the fastest way to exercise what you just wrote.

Install it into a project by unzipping it there - see
[using modules](https://titaniumsdk.com/docs/build/modules.md) for the layout and for declaring it in
`tiapp.xml`.

## Things that catch people

**`apiversion` and `minsdk` are promises.** A module built against an old SDK
may link against internals that moved. When a project fails at link time with a
message naming nothing, a stale module is the first suspect.

**Architectures cost size.** Every one in `architectures` is compiled and
shipped. Drop the ones you do not need.

**The bridge is the slow part.** A call from JavaScript into native crosses
Kroll, and a loop that crosses per iteration is where the time goes. Pass a
collection and return a collection rather than calling per item.

**Threading is yours to get right.** A long native call blocks the JavaScript
thread. Do the work on a background thread and call back.

## Next

[Hyperloop](https://titaniumsdk.com/docs/extend/hyperloop.md) does much of this without a module.


## Hyperloop

Based on the [current official guide](https://titaniumsdk.com/docs/extend/hyperloop.md). Examples target released SDK 13.4.1; verify the selected SDK before adopting version-specific behavior.

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
[using modules](https://titaniumsdk.com/docs/build/modules.md).

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
[native modules](https://titaniumsdk.com/docs/extend/modules.md).

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

[CLI plugins](https://titaniumsdk.com/docs/extend/cli-plugins.md) is the other extension point: changing
the build rather than the app.


## CLI plugins

Based on the [current official guide](https://titaniumsdk.com/docs/extend/cli-plugins.md). Examples target released SDK 13.4.1; verify the selected SDK before adopting version-specific behavior.

A CLI plugin is JavaScript the CLI loads and lets subscribe to build events. It
changes the build, not the app: generating a file before compilation, injecting
a value, uploading an artifact afterwards.

Alloy is one. `plugins/ti.alloy/hooks/alloy.js` in an Alloy project is a hook
that compiles `app/` into `Resources/` before every build - which is why an
Alloy project needs `ti.alloy` in `tiapp.xml` and is otherwise a Classic
project.

## The shape of one

```js
// plugins/ti.example/hooks/stamp.js
exports.cliVersion = '>=3.X';
exports.version = '1.0.0';

exports.init = (logger, config, cli, appc) => {
  cli.on('build.pre.compile', {
    priority: 1000,
    post(builder, done) {
      logger.info(`building ${builder.tiapp.name} ${builder.tiapp.version}`);
      done();
    },
  });
};
```

`init` is called once with the logger, the CLI config, the CLI itself, and the
`node-appc` helpers. `cliVersion` is a range the plugin needs, and a plugin
whose range does not match is skipped rather than crashing the build.

A hook subscribes with `pre` or `post`. In the two-argument callback form shown above, **call `done()`** when finished or the build waits. The current CLI also awaits a one-argument async handler; do not mix callback completion with an unfinished asynchronous task.

`priority` orders hooks against each other; the default is 1000.

## Where they are found

| Location                        | Scope        |
| ------------------------------- | ------------ |
| `<project>/plugins/<id>/hooks/` | That project |
| `paths.hooks` in CLI config     | That machine |
| The SDK's own `cli/hooks/`      | Everything   |

Declare a project plugin in `tiapp.xml`:

```xml
<plugins>
  <plugin version="1.0">ti.example</plugin>
</plugins>
```

Add a machine-wide path with
[CLI configuration](https://titaniumsdk.com/docs/reference/config.md):

```sh
ti config paths.hooks --append ~/titanium-hooks
```

A machine-wide hook changes builds for every project on that machine and for
nobody else, so a build stops being reproducible from the repository alone. Use
the project location unless you specifically want the opposite.

## Useful events

| Event                 | When                                          |
| --------------------- | --------------------------------------------- |
| `build.pre.construct` | Before the builder is set up                  |
| `build.pre.compile`   | Before compilation. Where generated code goes |
| `build.post.compile`  | After compilation, before packaging           |
| `build.finalize`      | The build is done                             |
| `cli:pre-execute`     | Before any command runs                       |
| `cli:post-execute`    | After it finishes                             |

The build events carry the `builder`, which is where `tiapp`, the project
directory and the resolved options are. Read it rather than re-parsing
`tiapp.xml`.

Platform builders emit their own more specific events too. `--debug` prints the
events as they fire, which is the practical way to find the one you want.

## Alloy's own hook file

For work tied to Alloy's compile rather than the CLI's build, `app/alloy.jmk`
is simpler and does not need a plugin. See
[Alloy configuration](https://titaniumsdk.com/docs/alloy/config.md).

## Keep them cheap

A hook runs on every build, including the rebuild you do twenty times an hour.
Anything slow belongs behind a check that skips it when there is nothing to do,
or in a `production`-only branch.

## Next

Back to [building apps](https://titaniumsdk.com/docs/build.md), or the
[CLI reference](https://titaniumsdk.com/docs/reference/cli.md) for the commands these hook into.

CLI contract verification: Titanium CLI 9.1.0 `src/cli.js` (`createHook`, `emit`, `scanHooks`) and SDK 13.4.1 `build.pre.compile` emission. An event hook receives the supplied builder payload augmented with hook metadata; other events may have different payloads.
