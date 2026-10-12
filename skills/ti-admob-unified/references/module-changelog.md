> Source snapshot: official ti.admob.unified 1.0.0 documentation at commit `5b4cbf9` (copied 2026-10-11). Relative links rebased for this skill.

# Changelog

## [1.0.0] — Unreleased

### Audit corrections

- Normalize iOS load errors to the shared constants and return actual Booleans through the bridge.
- Implement percentage-based application volume on iOS and validate the same range on Android.
- Hide accidental iOS state/helper exports while preserving native delegates and lifecycle callbacks.
- Expose fullscreen configuration properties on Android and retain primitive extras; defer banner reconfiguration to its next load.
- Allow consent retries after failures, refresh cached results after privacy options, and serialize reset with outstanding UMP work.
- Read Android's standard IAB preferences and restrict mediation availability to installed adapters.
- Capture the presented rewarded ad's reward independently of dismissal/reload; serialize fullscreen SDK operations on the UI thread.
- Remove targeting values and test-device IDs from module-owned debug messages.
- Fix library callback reentrancy, share concurrent privacy/Inspector operations, and wait for iOS adaptive layout.
- Keep banner-button feedback in the button with light-green styling; reuse the current banner on reload without collapsing its slot.
- Keep ads and listeners through an Android light/dark switch: the example and the cleanup guide ignore the `close` event Titanium fires while it recreates the activity.
- Check fullscreen request dimensions at Show in the library and playground; reload only the selected stale ad, without rotation listeners or timers.
- Accept iOS UMP UUID test identifiers and support per-platform consent test defaults in the example application's properties.


First public release. Earlier development snapshots were not published releases.

### Dependency refresh

- Update Google Mobile Ads to iOS 13.10.0 and Android 25.5.0; UMP remains at iOS 3.1.0 and Android 4.0.0.
- Update all five adapters to the September 23, 2026 published versions listed in [Dependencies](dependencies.md).
- Remove IronSourceAdQualitySDK from Unity: Unity Ads 4.20.1 no longer depends on it.
- Pin Guava 33.7.1-android in the core and OkHttp 4.12.0 in InMobi/Liftoff to replace the Guava, OkHttp and Okio versions flagged in the security review.
- Retain the version contract test: Meta now matches across platforms; Liftoff retains the documented SDK difference.

### Unified core

- One iOS/Android JavaScript API for standard/adaptive banners, interstitials, rewarded ads and app open ads.
- Consent-first UMP flow, portable ATT completion and Ad Inspector support.
- Idempotent initialization, serialized loads and deterministic cleanup.
- Google Mobile Ads and UMP only; no third-party network adapters in the core.
- The examples use only the core without a mediation flag. Google Mobile Ads automatically discovers adapters supplied by selected complements; `disableMediation: true` remains an explicit session exception.

### Optional mediation

- Five independent dependency modules: `ti.admob.unified.mediation.applovin`, `.meta`, `.inmobi`, `.unity` and `.liftoff`, each on Android and iOS at `1.0.0`.
- Each Android complement declares only its adapter Maven coordinate. Each iOS complement vendors only its own adapter, SDK and required resources/dependencies.
- Unity includes UnityAdapter, UnityAds and UnityCoherenceLib. Its updated SDK no longer requires IronSourceAdQualitySDK.
- ironSource mediation is deferred; IronSourceAdapter and IronSource are not distributed.
- SDKs and adapters were updated to the published September 23, 2026 versions; framework checksums were regenerated. See [Dependencies](dependencies.md).
- `getMediationStatus()` returns generic Google initialization diagnostics; pre-release provider probes and no-op consent setters were removed. `disableMediation` remains a global startup control.
- Release artifacts are discovered from complement folders and manifests; packaged dependencies are checked against literal Gradle declarations without a provider list. Nothing is published or tagged by the build scripts.

### Validation

Packaging/linking and Google test-ad loading are separate from third-party ad delivery. Provider delivery requires configured accounts, mappings and Ad Inspector evidence; it is not established by a successful build or a Google test ad. See [release validation](mediation.md#release-validation).
