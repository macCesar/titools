> Source snapshot: official ti.admob.unified 1.0.0 documentation at commit `5b4cbf9` (copied 2026-10-11). Relative links rebased for this skill.

# AdMob mediation

The first release, `1.0.0`, provides five optional dependency modules with identical identifiers on iOS and Android. Install only the networks the application intends to use. The core `ti.admob.unified` contains Google Mobile Ads and UMP only. Each complement has no JavaScript API and performs no manual provider initialization.

| Network                   | Module ID                             | iOS adapter | Android adapter |
| ------------------------- | ------------------------------------- | ----------- | --------------- |
| AppLovin                  | `ti.admob.unified.mediation.applovin` | `13.6.4.0`  | `13.6.4.2`      |
| Meta Audience Network     | `ti.admob.unified.mediation.meta`     | `6.22.0.0`  | `6.22.0.1`      |
| InMobi                    | `ti.admob.unified.mediation.inmobi`   | `11.4.1.0`  | `11.4.1.2`      |
| Unity Ads                 | `ti.admob.unified.mediation.unity`    | `4.20.1.0`  | `4.20.1.0`      |
| Liftoff Monetize (Vungle) | `ti.admob.unified.mediation.liftoff`  | `7.7.7.0`   | `7.7.8.1`       |

ironSource mediation is deferred: neither its adapter nor its advertising SDK is distributed. Unity includes UnityCoherenceLib. Unity Ads 4.20.1 no longer depends on IronSourceAdQualitySDK, so it is not distributed.

## Installing one or several networks

Install the core ZIP and each selected complement ZIP for every target platform. One declaration covers both platforms:

```xml
<modules>
  <module version="1.0.0">ti.admob.unified</module>
  <module version="1.0.0">ti.admob.unified.mediation.applovin</module>
</modules>
```

For AppLovin and Unity together:

```xml
<modules>
  <module version="1.0.0">ti.admob.unified</module>
  <module version="1.0.0">ti.admob.unified.mediation.applovin</module>
  <module version="1.0.0">ti.admob.unified.mediation.unity</module>
</modules>
```

Use `1.0.0` for the core and complements. Call only `require('ti.admob.unified')` and its factories. To remove a network, remove its declaration and rebuild.

## Installing an adapter is not the same as enabling a network

Installing an adapter adds its SDK to the application and makes it discoverable by Google Mobile Ads. It does not approve a publisher account, configure a mediation group or validate credentials. Leave unneeded complements out of the build. Their exact frameworks, dependencies and versions are recorded in [Dependencies](dependencies.md).

## Publisher setup

For each network that an application will use:

1. Create or connect the publisher account for that network.
2. Add the network as an ad source in the AdMob mediation group.
3. Enter the provider credentials and map the provider placement to the AdMob ad unit.
4. Complete the provider's privacy and store-disclosure requirements.
5. Validate the integration with test ads and Ad Inspector before enabling production traffic.

Google Mobile Ads can still inspect or initialize every installed adapter during SDK startup. In development, incomplete or conflicting server mappings can produce provider warnings even when Google serves the requested test banner. Examples include a missing AppLovin SDK key and multiple Liftoff Monetize app IDs. The module does not add provider credentials to either native manifest; AdMob supplies those server parameters from the mediation mapping.

Do not silence these messages with placeholder credentials. Complete the provider mapping, use that provider's test mode, and verify it through single-source testing in Ad Inspector. If the application does not intend to use a network, leave it out of the AdMob mediation group.

Google maintains the current setup instructions and format caveats in its [Android mediation network guide](https://developers.google.com/admob/android/choose-networks) and [iOS mediation network guide](https://developers.google.com/admob/ios/choose-networks). Use formats supported by the selected network and adapter version.

## Missing configuration and startup errors

Only install selected complements when the app will use mediation and its publisher accounts, source mappings and credentials are configured. The examples and the core-only test app do not require these accounts. Do not install the complements merely to run Google demo ads.

An internal Android demo build with several adapters produced these messages. Each points to a different failure; only some identify missing credentials:

| Message                                 | What it establishes                                                                                                                                                | Action                                                                                                                                                   |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AppLovin: `Missing or invalid SDK Key.` | The adapter did not receive a usable SDK key.                                                                                                                      | Verify the publisher SDK key and the AppLovin mapping in AdMob.                                                                                          |
| AdColony: `Failed to create Adapter.`   | Google could not construct the requested adapter. This does not establish a missing key. AdColony is not one of the five distributed adapters.                     | Inspect the requested ad source/mapping and adapter availability in Ad Inspector. Do not add a legacy SDK or placeholder credentials just to silence it. |
| Liftoff/Vungle: `Timeout.`              | Initialization did not finish before the SDK timeout. In the observed run, a preceding warning reported conflicting app IDs and selection of `fake-vungle-app-id`. | Check the provider app ID and AdMob mapping; the timeout alone does not prove which configuration value is wrong.                                        |

### Why there is no automatic “missing local key → skip this network” filter

Each optional module only packages dependencies; it does not call each provider's initializer. Google Mobile Ads controls adapter initialization and supplies mediation parameters from AdMob. There is no supported pre-initialization API in the Google Mobile Ads APIs used here that lets this module read all publisher mappings and selectively suppress adapters with missing credentials.

A key may be absent from JavaScript or the native manifest and still be configured in AdMob. The [AppLovin adapter guide](https://developers.google.com/admob/android/mediation/applovin) instructs publishers to enter the SDK key in AdMob; its changelog says adapter 12.1.0.0 stopped checking the Android manifest. The module leaves readiness checks and provider initialization to Google, without using private SDK internals.

Choose the setup that matches the application:

- For Google ads alone, omit complements and call `Admob.initialize({})`. There are no third-party adapters to initialize.
- For mediation, include one `tiapp.xml` entry per selected network, configure its account and AdMob mappings, and call `Admob.initialize({})`. Google discovers the installed adapters without an `enableMediation` flag or manual provider initializer. Check native initialization results and Ad Inspector; `getMediationStatus()` reports the adapter initialization states known to Google.

For a session that deliberately skips initialization of installed adapters, see the [initialization reference](api-reference.md#automatic-adapter-discovery). That exception is global and does not validate credentials or filter individual networks.

## Portable diagnostics

`getMediationStatus()` belongs to the core and returns `{ initializationState, adapters }`. It includes every adapter Google reports, including Google, sorted by native class name. Entries contain `adapterClass`, `state`, `description` and numeric `latencyMs`; native class names may differ across platforms.

```js
const Admob = require('ti.admob.unified')
Admob.addEventListener('module_initialized', event => {
  const diagnostic = Admob.getMediationStatus()
  Ti.API.info(diagnostic.initializationState)
  diagnostic.adapters.forEach(adapter => {
    Ti.API.info(`${adapter.adapterClass}: ${adapter.state} (${adapter.latencyMs} ms) ${adapter.description}`)
  })
})
```

Before `initialize()`, the result is `not_started` with no adapters. During startup it is `initializing` and Google's map may be partial or empty. `completed` means the core callback finished, even when an adapter is `not_ready`; an initialization exception reports `failed`. The query does not initialize SDKs or request ads. Neither absence from this map nor `ready` establishes installed-module inventory, valid accounts, credentials or ad delivery. See the [complete contract](api-reference.md#mediation-diagnostics).

New providers need no core registration. Follow [Adding a network](contributing.md#adding-a-network) to package an existing official adapter.

After initialization on a registered test device, inspect actual requests:

```js
Admob.addEventListener('ad_inspector_closed', event => {
  Ti.API.info(JSON.stringify(event))
})
Admob.openAdInspector()
```

## Privacy and bundled resources

Continue using UMP and `canRequestAds()` before requests. Each selected iOS complement includes its vendor resources and privacy manifests. Review the current Google/provider guidance for SKAdNetwork entries, privacy disclosures and consent propagation for the networks the application distributes. Android resolves each selected adapter's SDK transitively through its POM.

The public example and the test demo use only the core, with no mediation flag. No provider credentials are required to run Google demo ads. Adding a selected complement to `tiapp.xml` makes its adapter discoverable at SDK startup; configure the provider account and AdMob mapping before using that network. Automatic discovery does not validate credentials or eliminate initialization timeouts.

## Release validation

Build all discovered modules (two ZIPs per module) and inspect their framework inventories and generated POMs. Compile isolated consumer applications on both platforms with core only, each of the five complements individually, AppLovin + Unity, and all five together. Check that no framework is duplicated and that resolved dependency versions remain pinned.

Record separately:

- Integration and linking: the build succeeds, expected adapter classes are visible, and official Google test ads load.
- Provider ad delivery: the provider returns its own test ad with valid publisher accounts and AdMob mappings, confirmed by single-source testing in Ad Inspector.

Google test ads do not prove provider delivery. iOS simulator results do not substitute for device results. Re-run device validation when hardware is available. Do not use or click production ads during development.

## Unity consent with the pinned adapter

The distribution uses Unity adapter `4.20.1.0` on both platforms. It includes the automatic forwarding of `IABTCF_AddtlConsent` introduced in `4.19.0.1` on [Android](https://developers.google.com/admob/android/mediation/unity) and [iOS](https://developers.google.com/admob/ios/mediation/unity). Configure Unity as a consent partner and verify signal propagation with the provider before enabling demand. Adapter presence and a Google test ad do not establish provider consent or delivery.
