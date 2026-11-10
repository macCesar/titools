# Alloy CLI workflow in the current guides

Install Alloy separately with `npm install -g alloy`. The Titanium CLI and platform toolchain must already work; run `ti info` before creating or building the app.

| Task | Command |
| --- | --- |
| Create an app and convert it to Alloy | `ti create --type app --alloy --name Hello --id com.example.hello --platforms android,ios --workspace-dir .` |
| Convert an existing Classic app | `alloy new` from its project root |
| Generate a reusable widget | `alloy generate widget com.example.rating` |
| Build and run on Android | `ti build --platform android` |
| Build and run on iOS | `ti build --platform ios` |
| Compile without installing/launching | Add `--build-only` |
| Reload JavaScript on save | Add `--liveview` |
| Select real hardware | Add `--target device` |
| Select one device | Add `--device-id <id>` |

Without Alloy on `PATH`, `ti create --alloy` leaves a Classic project and reports what to install. `ti create` without arguments prompts; noninteractive use needs the creation values shown above, including `--type` and `--workspace-dir`.

Use `ios` for iPhone and iPad; `iphone` selects iPhone only. A new app ID after publication creates a separate store listing. Default build targets are Android emulator and iOS simulator, with prompts when more than one device is available. iOS builds require macOS and Xcode.

The current guides do not provide a complete Alloy command/options catalog. Use the installed released CLI's `alloy --help` / `alloy <command> --help` when an unlisted operation is required, and verify its behavior rather than importing an archived recipe.

See [creating and running an app](../../alloy-guides/references/CLI_TASKS.md) for prerequisites and device signing, and [debugging](./debugging_troubleshooting.md) for LiveView limitations.

Sources: [first app](https://titaniumsdk.com/docs/build/first-app.md), [Alloy](https://titaniumsdk.com/docs/alloy.md), [widgets](https://titaniumsdk.com/docs/alloy/widgets.md).
