> Source snapshot: official ti.admob.unified 1.0.0 documentation at commit `5b4cbf9` (copied 2026-10-11). Relative links rebased for this skill.

# Dependency inventory

The core and five optional complements use the published versions verified on September 23, 2026. Each module has its own iOS Podfile, lockfile and framework checksum inventory. Android pins live in each module’s `android/build.gradle`.

## iOS vendored XCFrameworks: `ti.admob.unified`

| Component               | Framework                           |  Version |
| ----------------------- | ----------------------------------- | -------: |
| Google Mobile Ads       | `GoogleMobileAds.xcframework`       | `13.10.0` |
| User Messaging Platform | `UserMessagingPlatform.xcframework` |  `3.1.0` |

## iOS per-network complements

The eleven frameworks are stored without duplication under `mediation/<network>/ios/platform/`: AppLovin (2), Meta (2), InMobi (2), Unity (3), Liftoff (2). Unity Ads 4.20.1 no longer requires IronSourceAdQualitySDK. No ironSource advertising adapter or SDK is distributed.

| Component                 | Framework                            |      Version |
| ------------------------- | ------------------------------------ | -----------: |
| AppLovin adapter          | `AppLovinAdapter.xcframework`        |   `13.6.4.0` |
| AppLovin SDK              | `AppLovinSDK.xcframework`            |     `13.6.4` |
| Meta adapter              | `MetaAdapter.xcframework`            | `6.22.0.0` |
| Meta Audience Network SDK | `FBAudienceNetwork.xcframework`      |     `6.22.0` |
| InMobi adapter            | `InMobiAdapter.xcframework`          |   `11.4.1.0` |
| InMobi SDK                | `InMobiSDK.xcframework`              |     `11.4.1` |
| Unity adapter             | `UnityAdapter.xcframework`           |   `4.20.1.0` |
| Unity Ads SDK             | `UnityAds.xcframework`               |     `4.20.1` |
| Unity support library     | `UnityCoherenceLib.xcframework`      |      `0.1.0` |
| Liftoff Monetize adapter  | `LiftoffMonetizeAdapter.xcframework` |    `7.7.7.0` |
| Vungle Ads SDK            | `VungleAdsSDK.xcframework`           |      `7.7.7` |

The version column is the pinned CocoaPods version; lockfiles record the resolved adapter and SDK pair. Meta now uses SDK 6.22.0 on both platforms. Liftoff uses SDK 7.7.7 on iOS and 7.7.8 on Android. The version contract test retains this remaining difference and checks the matching networks.

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
| `com.google.guava:guava` | 33.7.1-android |

## Android per-network complements

Declared separately in `mediation/<network>/android/build.gradle`; `meta` uses the `facebook` coordinate and `liftoff` uses `vungle`.

| Coordinate                          |  Version |
| ----------------------------------- | -------: |
| `com.google.ads.mediation:facebook` | 6.22.0.1 |
| `com.google.ads.mediation:inmobi`   | 11.4.1.2 |
| `com.google.ads.mediation:unity`    | 4.20.1.0 |
| `com.google.ads.mediation:applovin` | 13.6.4.2 |
| `com.google.ads.mediation:vungle`   | 7.7.8.1 |

Each complement declares one adapter coordinate. InMobi and Liftoff also pin OkHttp 4.12.0. This replaces InMobi’s 3.14.9 and lifts Liftoff’s Okio dependency above the affected 3.0.0 release while retaining the okhttp3 API. Generated POMs propagate these versions and the matching network SDK into the consuming application. The core POM declares GMA, UMP and a patched Guava utility dependency. Guava replaces the older transitive version; it adds no ad network. Inspect all six POMs and resolved consumer dependency graphs before release.

## Update policy

All six modules remain at version `1.0.0`. Dependency updates require rebuilding both platform ZIPs for every discovered module, validating checksums, checking isolated consumer combinations and testing on available devices. Verify third-party delivery separately with configured accounts and Ad Inspector.

## Transitive security review

The September 23, 2026 refresh checks resolved dependencies for all eight Android consumer combinations. Updating the ad adapters alone still selected older utility libraries, so the distributed POMs include these corrections:

| Dependency | Previous resolution | Updated resolution | Where the pin lives |
| --- | --- | --- | --- |
| Guava | `31.1-android` in core and several combinations | `33.7.1-android` | Core Android module |
| OkHttp | `3.14.9` with InMobi; `4.10.0` with Liftoff | `4.12.0` | InMobi and Liftoff Android complements |
| Okio / Okio-jvm | `3.0.0` with Liftoff | At least `3.6.0`, through OkHttp; InMobi selects `3.7.0` | Resolved transitively |

Guava's Android variant requires API 24, matching this module's existing floor. [Guava release notes](https://github.com/google/guava/releases/tag/v33.7.1) identify the published Android artifact. [OkHttp 4's compatibility guide](https://lysine.dev/okhttp/changelogs/upgrading_to_okhttp_4/) documents binary compatibility with the okhttp3 API; its [4.x changelog](https://lysine.dev/okhttp/changelogs/changelog_4x/) records the hostname-verification fix and Okio update. These are utility dependencies, not additional ad networks.

The earlier matches were `GHSA-5mg8-w23w-74h3`, `GHSA-7g45-4rm6-3mm3` (Guava), `GHSA-3cqm-mf7h-prrj` (OkHttp) and `GHSA-w33c-445m-f8w7` (Okio). The final [OSV querybatch](https://google.github.io/osv.dev/api/) scan covered 149 distinct Maven name/version pairs across all eight consumer combinations and returned no matches on September 23, 2026. A version scan does not establish provider delivery or prove that every internal SDK path is safe.

Unity `4.20.1.0` includes the adapter consent-forwarding update. Provider-side verification is described in the [mediation guide](mediation.md#unity-consent-with-the-pinned-adapter).
