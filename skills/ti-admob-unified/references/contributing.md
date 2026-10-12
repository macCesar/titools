> Source snapshot: official ti.admob.unified 1.0.0 documentation at commit `5b4cbf9` (copied 2026-10-11). Relative links rebased for this skill.

# Contributing to ti.admob.unified

Changes to this native bridge must keep the JavaScript contract consistent with native behavior on both platforms, including cleanup. Tests and documentation must describe that same behavior.

## Before opening an issue

Include enough information to reproduce the problem:

- Titanium SDK version
- module version
- platform and OS version
- device or simulator/emulator model
- minimal JavaScript example
- expected and actual behavior
- complete module and native ad error payloads
- relevant Xcode or logcat output with secrets removed

For layout issues, include the Titanium proxy, host, and parent dimensions plus device density/orientation.

## Development baseline

- Titanium SDK `13.2.0.GA` or later (build toolchain: `13.4.1.GA`)
- iOS `15.0+`
- Android API `24+`, the floor the Titanium `13.2.0.GA` module template sets
- Node.js with the built-in `node:test` runner

Dependency versions are pinned in [DEPENDENCIES.md](dependencies.md).

## Workflow

Create a focused branch and keep unrelated local changes intact. Before editing a native dependency, establish a recoverable Git baseline and record the upstream source and checksum.

This repository holds the core at its root and five dependency-only complements in `mediation/<network>/`. Each has iOS and Android projects at version `1.0.0`. Scripts discover complement folders and derive archive identity/version from manifests. See [Adding a network](#adding-a-network). Applications call only the core. Both script helpers accept a module directory or `--all`.

Run the static checks from the repository root:

```sh
npm test
./scripts/verify-artifacts.sh
./scripts/verify-artifacts.sh --all
node --check example/app.js
```

Build all discovered artifacts for API or native changes:

```sh
./scripts/prepare-build.sh
./scripts/prepare-build.sh --all
./scripts/build-all.sh
python3 scripts/verify-packages.py
```

Never add a mediation network to the core module. Its `-framework` flags belong in `mediation/<network>/ios/module.xcconfig` and its Maven coordinate in `mediation/<network>/android/build.gradle`; a contract test fails if a network name reaches `ios/module.xcconfig`, `android/build.gradle`, the core `pbxproj`, or the core checksum inventory. Applications that use only the core should carry no mediation dependencies.

The `example/app.js` file is the module test-harness entry point. It is not a standalone Titanium project.

## Adding a network

Complements package existing official Google mediation adapters; writing a new native adapter is outside this workflow. No core registration or JavaScript API is needed.

1. Copy the source/configuration structure of `mediation/applovin/` to `mediation/<provider>/`, using a lowercase letter followed by lowercase letters/digits for `<provider>`. Work outside `mediation/` until both platform projects are complete: discovery treats every visible subdirectory as a module. Exclude `platform/`, `Pods/`, `build/`, `dist/`, `.gradle/`, generated Android libraries, `metadata.json`, `Podfile.lock`, checksums, Xcode user/workspace files and other caches. Copy no binaries or credentials from the reference network.
2. Replace `ti.admob.unified.mediation.applovin`, `TiAdmobUnifiedMediationApplovin` and the Java package directory with the new identity everywhere: both manifests and `timodule.xml` files, Java source/file path, Objective-C Module/ModuleAssets headers and implementations, prefix header, `.xcodeproj` directory and `project.pbxproj`, Podfile and framework installer. Generate a GUID with `uuidgen`; use the same value in both manifests and the iOS `moduleGUID`. Update author, description and licenses. Keep matching manifest IDs and versions on both platforms. Preserve all Xcode file references, Sources and Headers registrations while renaming.
3. Replace `android/build.gradle` with the provider's exact official adapter coordinate and required direct overrides. Use literal `implementation 'group:artifact:version'` declarations (double quotes and parentheses are also accepted), one per line. The verifier deliberately rejects variables, ranges and unsupported dependency syntax. Update repositories in `android/root.build.gradle` if needed. It checks the packaged POM against these declarations plus Titanium/Kotlin build dependencies; the core uses the same check against its own Gradle declarations.
4. Pin the official iOS adapter in `Podfile`, run `pod install`, and review the new lockfile and transitive versions against [Dependencies](dependencies.md). Adapt `install_frameworks.sh` with the new module path and explicit framework copy map. Stage only the adapter/network frameworks and resources, never core-owned GMA/UMP or frameworks already owned by another complement. Record and review their tree checksums using the installer's `tree_sha256` algorithm. Complete `module.xcconfig` with `$(inherited) -ObjC` and the required framework flags. Keep redistribution notices and privacy resources.
5. Follow Google's current [Android](https://developers.google.com/admob/android/choose-networks) and [iOS](https://developers.google.com/admob/ios/choose-networks) provider guides. Document required consumer manifest/plist settings, supported formats, consent propagation, publisher accounts and AdMob placement mappings. Do not initialize the provider yourself or invent credentials.
6. Run `./scripts/prepare-build.sh mediation/<provider>`, then build from each platform directory with `ti build -p android --build-only` or `ti build -p ios --build-only`. Inspect the generated POM and iOS objects/defined symbols. Run the tests and `./scripts/build-all.sh`; all helpers discover the new folder automatically, with two ZIPs per module. Install the resulting ZIPs alongside the core and add `<module version="1.0.0">ti.admob.unified.mediation.<provider></module>` to the consumer's `tiapp.xml` (use the manifest's version).
7. Test core-only and core-plus-complement consumers on Android and iOS. Query `getMediationStatus()` after `module_initialized`. Test provider delivery with your own configured mediation units, registered test devices, provider test mode and Ad Inspector single-source tests. Record installation/linking and Google initialization separately from actual provider ad delivery. A build or `ready` result does not establish delivery. Keep the public demo core-only with Google's official test IDs.

## Platform notes

The native implementations share one JavaScript contract. The notes below describe their source files and platform differences.

### iOS

Sources in `ios/Classes/` comprise five proxy pairs and the module:

| Source                                  | Responsibility                                            |
| --------------------------------------- | --------------------------------------------------------- |
| `TiAdmobUnifiedModule.*`                | Module constants, UMP, ATT, initialization, and factories |
| `TiAdmobUnifiedBannerAdProxy.*`         | Standard banner proxy and native view                     |
| `TiAdmobUnifiedAdaptiveBannerAdProxy.*` | Anchored and inline adaptive banner proxy and native view |
| `TiAdmobUnifiedInterstitialAdProxy.*`   | Interstitial proxy                                        |
| `TiAdmobUnifiedRewardedAdProxy.*`       | Rewarded proxy                                            |
| `TiAdmobUnifiedAppOpenAdProxy.*`        | App open proxy and the four hour validity window          |

Build from the repository root:

```sh
./ios/install_frameworks.sh
ti build -p ios --build-only --project-dir ios --no-prompt
```

`install_frameworks.sh` resolves the pinned CocoaPods dependencies, stages that module's XCFrameworks, verifies their tree hashes, and prepares them for packaging: two frameworks for the core, and the selected network’s frameworks for `mediation/<network>/ios/install_frameworks.sh`. A new `.m` file also has to be registered in `ios/ti.admob.unified.xcodeproj` for inclusion in the static library. An unregistered file can go unnoticed during the module build and cause a link failure in the consuming app.

iOS-specific public behavior:

- `requestTrackingAuthorization()` requests or retrieves ATT and emits `tracking_authorization_completed`.
- `createAdaptiveBanner()` implements anchored and inline adaptive banners. Anchored always uses the large variant, because Google deprecated the plain anchored functions.
- `collapsible` travels as a `GADExtras` network extra, merged with `extras` into one registration. A second `GADExtras` registration for the same network replaces the first.
- `customAdSize` builds `GADAdSizeFromCGSize`, which is how a fixed full-width strip is requested.
- `smart_banner` no longer yields a full-width banner. It falls through to `BANNER`, as it does on Android.
- `setAppVolume()` forwards a validated percentage to Google Mobile Ads, matching Android.

### Android

Sources live in `android/src/ti/admob/unified/`. The banner types split proxy and view; the fullscreen types do not:

| Source                                                      | Responsibility                                       |
| ----------------------------------------------------------- | ---------------------------------------------------- |
| `TiAdmobUnifiedModule.java`                                 | Module constants, UMP, initialization, and factories |
| `TiAdmobUnifiedBannerAdProxy.java` / `…AdView.java`         | Standard banner proxy and native `AdView`            |
| `TiAdmobUnifiedAdaptiveBannerAdProxy.java` / `…AdView.java` | Adaptive banner proxy and native container           |
| `TiAdmobUnifiedInterstitialAdProxy.java`                    | Interstitial proxy                                   |
| `TiAdmobUnifiedRewardedAdProxy.java`                        | Rewarded proxy                                       |
| `TiAdmobUnifiedAppOpenAdProxy.java`                         | App open proxy and the four hour validity window     |

Maven coordinates are declared in `android/build.gradle`. Build from the module root:

```sh
ti build -p android --build-only --project-dir android --no-prompt
```

Android-specific public behavior:

- `collapsible` accepts Google's raw placement string, `"top"` or `"bottom"`. Both platforms forward these values to Google; the returned ad may still be non-collapsible.
- The adaptive `loaded` event carries the same seven size fields on both platforms: `width`, `widthUnit`, `widthPx`, `heightPx`, `density`, `height` and `heightUnit`.
- `setAppVolume()` accepts a percentage string such as `"50%"` and forwards a normalized value.
- `isTestDevice()` delegates to `AdRequest.isTestDevice(context)`.
- Pausing calls the native `AdView.pause()` without changing visibility or layout. Loads requested while paused are deferred until every application/lifecycle pause cause clears. Automatic refresh eligibility still depends on whether Android actually considers the banner visible on screen.

### Consumer configuration

Neither native module hardcodes application values. The consuming Titanium application owns `GADApplicationIdentifier` and the Android `com.google.android.gms.ads.APPLICATION_ID` metadata, `NSUserTrackingUsageDescription` when it requests ATT, current `SKAdNetworkItems`, production or test ad-unit selection, and the Privacy & messaging configuration in AdMob. See [Getting started](getting-started.md).

Do not add a public method or constant on one platform without checking and documenting the other platform's surface, payloads, lifecycle, cleanup, and tests.

## Public API changes

For a new or changed method, property, event, payload key, or constant:

1. Define the portable JavaScript contract first.
2. Implement it on iOS and Android, or document the platform limitation explicitly.
3. Preserve existing supported use cases.
4. Make cleanup and repeated lifecycle calls deterministic.
5. Add contract tests for both native sources.
6. Update the API reference and the relevant task guide.
7. Update `CHANGELOG.md`.

Do not export a format constant as evidence that a format is implemented. A new ad format needs a working factory and proxy on both platforms before it is listed as supported.

## Privacy changes

For privacy changes:

- `canRequestAds()` remains the only ad-request gate.
- Do not parse TCF storage or infer a personalization Boolean.
- Do not replace UMP with ATT, and do not make ATT a step in the start-up flow. It is optional; an application that resolves it does so before `initialize()`.
- Every accepted asynchronous operation must emit one modern terminal event.
- Errors must remain non-blocking to the host application.
- Debug geography and consent reset belong only in controlled testing.

Review [Privacy and initialization](privacy.md) before changing this surface.

## Banner changes

Standard and adaptive banners must preserve:

- `load()`, `pause()`, `resume()`, `isLoaded()`, and terminal `destroy()`;
- one active request and at most one deferred request;
- repeatable destruction and one `destroyed` event;
- removal of native delegates, listeners, controllers, views, and activity lifecycle registrations;
- common event names and payload keys;
- real adaptive height in density-independent units;
- no hardcoded device height and no `setNativeView(null)`.

Review [Banner ads](banners.md).

## Testing

Static tests cannot establish native UI and SDK behavior. Changes affecting that behavior also require validation on physical devices on both platforms:

- consent required/not required, accepted/rejected, and previous-session state;
- ATT authorized, denied, and previously resolved;
- privacy-options reopening;
- load, failure, click, impression, show, close, and reward events;
- background/resume and repeated window lifecycle;
- orientation, density, safe areas, keyboard, lists, navigation, and snackbars;
- absence of duplicate ads and retained listeners;
- official test IDs and Ad Inspector request evidence;
- `getMediationStatus()` returning the documented types and Google-reported statuses in isolated consumers: core only, each complement, AppLovin + Unity, all five. Test empty/partial maps, an unknown adapter and initialization failures; do not assume this is a complete installed-module inventory. Record simulator and hardware evidence separately; adapter presence and Google test ads do not prove third-party delivery.

Never click production ads while developing.

## Documentation

Keep documentation in English and follow these requirements:

- describe only behavior implemented by the referenced version;
- include argument types, return values, events, and payloads;
- separate portable behavior from platform-specific behavior;
- mark deprecated aliases and non-working reserved APIs;
- use official test constants in executable examples;
- link to primary Google or Apple documentation for upstream requirements.

`tests/documentation.test.js` checks method/constant coverage, internal links, and unsafe example regressions.

## Pull requests

A pull request should state:

- the problem and intended contract;
- iOS and Android implementation impact;
- compatibility or migration impact;
- tests and builds executed;
- devices and scenarios validated;
- documentation updated.

Do not publish artifacts or create a release tag from a contribution branch. Release signing, tags, and distribution remain maintainer actions.

Contributions are licensed under the [MIT License](module-license.txt).

### Native wrapper behavior harness

Run `python3 tests/native/android.py` with a JDK, and `python3 tests/native/run.py` on macOS. The Java harness checks percentage validation, the TCF preference store and consent reset ordering. It compiles the current Objective-C method bodies against controlled Foundation-based SDK stand-ins and checks volume validation, load-error mapping, consent retry/reset ordering and delayed reward callbacks. It does not replace a Titanium consumer build, native bridge checks or Google ad presentation tests. `npm test` separately exercises the JavaScript library and example, alongside static contract checks.

After individual platform builds, run `python3 scripts/prepare-package-docs.py` before `python3 scripts/verify-packages.py`. Titanium renders guides as HTML without rewriting their Markdown links. The preparation step fixes links between generated guides and includes the linked Markdown sources for offline use. `scripts/build-all.sh` runs both steps automatically.
