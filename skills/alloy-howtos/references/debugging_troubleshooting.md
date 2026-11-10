# Debugging an Alloy application

First separate a compiler/native build failure from a failure in the running app.

## Build failures

1. Run `ti info` and fix toolchain errors first.
2. If generated files are stale, run `ti clean` and rebuild.
3. Read upward to the first Gradle/Xcode error; later messages can be consequences.
4. For linker failures, inspect native-module compatibility with the SDK through `ti-guides`.

`Resources/` and `build/` are generated in an Alloy app. Do not repair generated output by editing it.

## Runtime diagnosis

Use `Ti.API.trace`, `debug`, `info`, `warn`, `error` and `log`. `info` is the default build log level; add `--log-level warn` to reduce output or `--log-level trace` for build diagnostics. Logs ship with release builds and can expose tokens, email addresses or other interpolated private data; guard or remove them before distribution.

The VS Code Titanium extension provides the `titanium` debug type for breakpoints. The JetBrains integration uses Chrome DevTools Protocol and also needs `ios-webkit-debug-proxy` for iOS. Without an editor integration, use logs rather than assuming breakpoints are available.

For native crashes, inspect Android `adb logcat`, or macOS Console with the iOS device selected and filtered by app name. Xcode also retains device crash reports.

## LiveView

```bash
ti build --platform android --liveview
```

LiveView re-runs JavaScript against the installed app. Changes to `tiapp.xml`, modules, native dependencies or `app/platform/` require a real build. Check this when a saved change appears ineffective.

## Profiling

Use Android Studio Profiler on a debug build or Xcode Instruments on iOS. Allocations and Leaks help investigate memory growth. Native frames may show JavaScript work as bridge time rather than a precise source line. For list performance, inspect row/template work and use the current lists guidance through `ti-ui`.

Source: [debugging and profiling](https://titaniumsdk.com/docs/build/debugging.md).
