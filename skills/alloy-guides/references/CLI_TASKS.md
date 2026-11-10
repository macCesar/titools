# Create and run an Alloy app

Check the toolchain with `ti info` and finish environment setup before diagnosing a failed build as an Alloy problem.

```bash
npm install -g alloy
ti create --type app --alloy --name Hello --id com.example.hello --platforms android,ios --workspace-dir .
cd Hello
ti build --platform android
```

Use a reverse-DNS app ID from a domain you control: changing it after publication means a new listing in both stores. `--name` chooses the directory and icon label. `ios` selects iPhone and iPad; `iphone` selects iPhone only. In noninteractive creation, supply `--type` and `--workspace-dir` as shown; `ti create` without arguments prompts.

`--alloy` invokes `alloy new` after creating the project. Alloy must be on `PATH`; otherwise the project remains Classic and the CLI reports what to install. To convert an existing Classic project, run `alloy new` in its root.

## Build and iterate

```bash
ti build --platform ios
ti build --platform android --build-only
ti build --platform android --liveview
```

Default targets are Android emulator and iOS simulator. With several available devices, the CLI prompts; use `--device-id` to choose explicitly. iOS builds require macOS and Xcode. Initial native builds are slower than incremental builds. A successful build reports `Project built successfully`; terminal logs continue until Ctrl-C. `--build-only` skips installation and launch; LiveView reloads JavaScript on save.

For real devices, use `--target device`. Android needs developer options, USB debugging and USB authorization; check `ti info -t android`. iOS needs a development certificate and a matching provisioning profile containing the device; connect, unlock and trust the Mac. Select a UDID from `ti info -t ios` with `--device-id`. Use `ti-guides` for full setup and signing.

To generate the widget described by the current guide:

```bash
alloy generate widget com.example.rating
```

Sources: [first app](https://titaniumsdk.com/docs/build/first-app.md), [Alloy](https://titaniumsdk.com/docs/alloy.md), [widgets](https://titaniumsdk.com/docs/alloy/widgets.md).
