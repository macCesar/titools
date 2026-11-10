# Debugging & profiling

Based on the [current official guide](https://titaniumsdk.com/docs/build/debugging.md). Examples target released SDK 13.4.1; verify the selected SDK before adopting version-specific behavior.

Most Titanium debugging is the log. The build streams it to your terminal until
you stop it, and `Ti.API` is what writes to it.

```js
Ti.API.info('loaded 12 notes');
Ti.API.warn('no cached copy, fetching');
Ti.API.error(`request failed: ${e.error}`);
```

Six levels: `trace`, `debug`, `info`, `warn`, `error`, and `log` for an
explicit one. Filter the build's output with `--log-level`:

```sh
ti build --platform android --log-level warn
```

`info` is the default. Drop to `warn` when the SDK's own chatter is burying
yours, and raise to `trace` when the problem is in the build rather than the
app.

> [!IMPORTANT]
> Log statements ship. `Ti.API.info` in a release build still runs and still
> writes, and anything you interpolated into it - a token, an email address - is
> readable on a connected device. Strip them or guard them before you
> distribute.

## Breakpoints

The [Visual Studio Code extension](https://titaniumsdk.com/docs/setup/ide-integration.md) contributes a
`titanium` debug type, so you can set breakpoints in your JavaScript and step
through a running app rather than reading log output. The JetBrains plugin
debugs over the Chrome DevTools Protocol; on iOS it additionally needs
`ios-webkit-debug-proxy`.

Without an editor integration there are no breakpoints. That is the honest
answer, and it is why the log matters as much as it does here.

## LiveView

`--liveview` reloads the running app when you save, instead of rebuilding:

```sh
ti build --platform android --liveview
```

It re-runs your JavaScript against the app already installed. That is a second
or two rather than a minute, and it is the difference between iterating on a
layout and giving up on it.

It does not pick up everything. A change to `tiapp.xml`, a new module, a native
dependency or anything in `platform/` needs a real build. When a change seems
to have no effect, that is the first thing to rule out.

## Reading the platform's own logs

Titanium's log is a filtered view. When the app dies without reaching your
handler, go under it.

**Android**

```sh
adb logcat
```

A crash in native code appears here and nowhere else. Filter to the app with
`adb logcat --pid=$(adb shell pidof com.example.hello)`.

**iOS**

Open **Console.app**, select the device in the sidebar, and filter by the app
name. A crash also leaves a report under **Window, Devices and Simulators** in
Xcode.

## When the build fails, not the app

A build failure and a runtime failure need different tools, and the first
question is which one you have.

**Rule out the environment first.** `ti info` reports what it found and what is
wrong with it, and a build that broke without a source change is usually a
toolchain that moved underneath it.

**Force a clean build.** `build/` is generated, and a stale one produces errors
that the source does not explain:

```sh
ti clean
```

**Read upward.** A Gradle or Xcode failure prints a great deal after the line
that matters. The first error is the real one; everything below is consequence.

**A linker error usually means a module.** See
[using modules](https://titaniumsdk.com/docs/build/modules.md): a module built against an older SDK fails
at link time with a message that never names it.

## Profiling

There is no Titanium profiler. Use the platform's:

Android Studio's **Profiler** attaches to a running debug build for CPU, memory
and energy. Xcode's **Instruments** does the same on iOS, and the Allocations
and Leaks instruments are the ones worth learning.

Both show you native frames. A JavaScript hot spot appears as time inside the
bridge, which tells you where to look rather than which line.

For the common Titanium performance problem, look first at lists: a
`TableView` with hundreds of rows, or a `ListView` whose item template does
work per row. [Lists and tables](https://titaniumsdk.com/docs/build/ui/lists.md) covers the difference.

## Next

[Distributing apps](https://titaniumsdk.com/docs/distribute.md) covers signing and getting a build to
other people.
