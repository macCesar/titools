> Source snapshot: official ti.admob.unified 1.0.0 documentation at release source commit `034843299b2984253988e0ffccb9f6a1c91682c9` (copied 2026-10-24). Relative links rebased for this skill.

# Dependency inventory

The core and five optional complements use the published SDK and adapter pairs verified on October 23, 2026. Each module has its own iOS Podfile, lockfile and framework checksum inventory. Android pins live in each module's `android/build.gradle`.

The latest published Google adapters determine the network SDK versions. Meta iOS SDK `6.22.1` and InMobi Android SDK `11.5.1` are available independently, but their current Google adapters pin `6.22.0` and `11.5.0` respectively; those tested pairs are retained. Do not replace a network SDK independently of its adapter. InMobi Android adapter `11.5.0.1` is available as an AAR and POM in Google's Maven repository, although its documentation heading still says "In progress".

Google currently lists GMA iOS `13.x` and Android `25.x` as supported. Check both the [iOS sunset schedule](https://developers.google.com/admob/ios/deprecation) and [Android sunset schedule](https://developers.google.com/admob/android/deprecation), plus SDK/provider advisories, before distributing an app update. A supported major version and a store-specific SDK warning are separate checks; review any warning against the final app's resolved dependencies.

## iOS vendored XCFrameworks: `ti.admob.unified`

| Component               | Framework                           |  Version |
| ----------------------- | ----------------------------------- | -------: |
| Google Mobile Ads       | `GoogleMobileAds.xcframework`       | `13.11.0` |
| User Messaging Platform | `UserMessagingPlatform.xcframework` |  `3.1.0` |

## iOS per-network complements

The eleven frameworks are stored without duplication under `mediation/<network>/ios/platform/`: AppLovin (2), Meta (2), InMobi (2), Unity (3), Liftoff (2). Unity Ads 4.21.0 no longer requires IronSourceAdQualitySDK. No ironSource advertising adapter or SDK is distributed.

| Component                 | Framework                            |      Version |
| ------------------------- | ------------------------------------ | -----------: |
| AppLovin adapter          | `AppLovinAdapter.xcframework`        |   `13.6.4.0` |
| AppLovin SDK              | `AppLovinSDK.xcframework`            |     `13.6.4` |
| Meta adapter              | `MetaAdapter.xcframework`            | `6.22.0.0` |
| Meta Audience Network SDK | `FBAudienceNetwork.xcframework`      |     `6.22.0` |
| InMobi adapter            | `InMobiAdapter.xcframework`          |   `11.5.0.0` |
| InMobi SDK                | `InMobiSDK.xcframework`              |     `11.5.0` |
| Unity adapter             | `UnityAdapter.xcframework`           |   `4.21.0.0` |
| Unity Ads SDK             | `UnityAds.xcframework`               |     `4.21.0` |
| Unity support library     | `UnityCoherenceLib.xcframework`      |      `0.2.0` |
| Liftoff Monetize adapter  | `LiftoffMonetizeAdapter.xcframework` |    `7.7.8.0` |
| Vungle Ads SDK            | `VungleAdsSDK.xcframework`           |      `7.7.8` |

The version column is the pinned CocoaPods version; lockfiles record the resolved adapter and SDK pair. Meta now uses SDK 6.22.0 on both platforms. Liftoff uses SDK 7.7.8 on iOS and 7.7.9 on Android. The version contract test records this difference and checks the networks whose versions match.

The official CocoaPods specifications resolve the adapter and matching network SDK pairs. Each module has its own `ios/install_frameworks.sh`: it downloads that module's exact Podfile versions, stages its framework set, verifies its tree hashes, and restores the previous platform directory if validation fails. Run `ios/install_frameworks.sh` for the two core frameworks and `mediation/<network>/ios/install_frameworks.sh` for one complement. Complement installers use `pod install --deployment` to preserve the locked resolution.

The tree checksum is calculated from the sorted list of relative file paths and the SHA-256 of every file in the XCFramework:

```sh
find . -type f -print0 | LC_ALL=C sort -z | xargs -0 shasum -a 256 |
  shasum -a 256
```

## Android Maven dependencies: `ti.admob.unified`

Declared in `android/build.gradle`.

| Coordinate                                       | Version |
| ------------------------------------------------ | ------: |
| `com.google.android.gms:play-services-ads`       |  25.5.0 |
| `com.google.android.ump:user-messaging-platform` |   4.0.0 |
| `com.google.guava:guava` | 33.7.2-android |

## Android per-network complements

Declared separately in `mediation/<network>/android/build.gradle`; `meta` uses the `facebook` coordinate and `liftoff` uses `vungle`.

| Coordinate                          |  Version |
| ----------------------------------- | -------: |
| `com.google.ads.mediation:facebook` | 6.22.0.1 |
| `com.google.ads.mediation:inmobi`   | 11.5.0.1 |
| `com.google.ads.mediation:unity`    | 4.21.0.0 |
| `com.google.ads.mediation:applovin` | 13.6.4.2 |
| `com.google.ads.mediation:vungle`   | 7.7.9.0 |

Each complement declares its adapter coordinate. Unity also explicitly declares `com.unity3d.ads:unity-ads:4.21.0`: Google's adapter POM does not bring the Unity SDK transitively. Both entries must reach the packaged POM and consumer graph. See Google's [Unity Android integration guide](https://developers.google.com/admob/android/mediation/unity).

InMobi, Liftoff and Unity also pin `com.squareup.okhttp3:okhttp:5.4.0` and `com.squareup.okio:okio:3.18.2`. OkHttp 5.4.0 requires compile SDK 36, provided by the declared minimum Titanium 13.4.1.GA. OkHttp 5.5.x requires compile SDK 37 and remains incompatible with this stable Titanium toolchain. Okio fixes base64 compatibility with callers compiled against pre-3.18 releases. These utility dependencies add no ad networks. The core pins Guava `33.7.2-android` for its deserialization allocation fix. Unity Ads 4.21.0 requests OkHttp 3.12.13 and Okio 1.15.0 without these overrides; both matched advisories during the isolated-consumer scan. Generated POMs propagate the reviewed versions into consumer applications.

## Update policy

All six modules remain at version `1.0.0`. Dependency updates require rebuilding both platform ZIPs for every discovered module, validating checksums, checking isolated consumer combinations and testing on available devices. Verify third-party delivery separately with configured accounts and Ad Inspector.

## Transitive security review

The October 23 refresh updates the direct utility overrides as well as the ad SDKs:

| Dependency | Previous pin | Current pin | Modules |
| --- | --- | --- | --- |
| Guava | `33.7.1-android` | `33.7.2-android` | Core |
| OkHttp | `4.12.0` | `5.4.0` | InMobi, Liftoff, Unity |
| Okio | Transitive, including `3.6.0` / `3.7.0` | `3.18.2` | InMobi, Liftoff, Unity |

Guava's [33.7.2 release](https://github.com/google/guava/releases/tag/v33.7.2) documents the allocation fix. OkHttp's [changelog](https://lysine.dev/okhttp/changelogs/changelog/) documents later releases, but 5.4.0 is the latest compatible pin because of the Android AAR compile-SDK requirements above. The 5.5.1 certificate-blocklist change is not included in this compatible pin; runtime OS support and compile-SDK requirements are separate constraints. The [Okio changelog](https://lysine.dev/okio/changelog/) describes the 3.18.2 compatibility correction.

The October 23 [OSV querybatch](https://google.github.io/osv.dev/api/) scan covered 151 distinct resolved Maven name/version pairs across eight configurations: core, each complement, AppLovin + Unity, and all networks. No matches remained after the Unity utility overrides. The earlier September scan describes the old matrix. Dependency scanning and successful linking do not establish provider ad delivery.

Unity `4.21.0.0` includes the adapter consent-forwarding update. Provider-side verification is described in the [mediation guide](mediation.md#unity-consent-with-the-pinned-adapter).
