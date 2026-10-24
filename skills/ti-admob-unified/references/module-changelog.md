> Source snapshot: official ti.admob.unified 1.0.0 documentation at release source commit `034843299b2984253988e0ffccb9f6a1c91682c9` (copied 2026-10-24). Relative links rebased for this skill.

# Changelog

## [1.0.0] - 2026-10-24

- Add a bounded iPad layout workaround for a collapsed Google Interstitial SVG. Eligibility follows the zero-width column-flex markup for both demo and publisher-owned units. It preserves proportions and stops with the presentation lifecycle. Production creative coverage remains unverified; see the fullscreen guide for its limits.

- Preserve ready fullscreen preloads across Android client-area changes after dismissal by comparing stable outer window bounds; retain invalidation for rotation and window resizing.

- Keep the example's session status panel fixed above the scrolling content, reserving its measured height and preserving the banner's separate space.

- Keep an explicit fullscreen Show/Retry request pending through loading or size replacement in the example, then present without a second tap. Cancel pending presentation when its foreground, privacy or window context ends.

- Add visible ATT status/query/request controls to the example, with current-state refresh after returning from Settings, visible feedback for repeated checks, an explanation for resolved permissions and explicit Android applicability.

- Explain AdMob’s rewarded interstitial introduction requirements in the demo card, with an official policy link. Show opens a reward introduction with Watch test ad and Skip; Skip cancels that presentation. After Watch, a needed reload completes and presents without another Show tap. Clarify ATT configuration when AdMob UMP presents the IDFA message.

- Add `getTrackingAuthorizationStatus()` on iOS and Android for a current ATT snapshot without prompting or starting ads. Clarify ATT startup order, localization and store disclosures.

- Added `createRewardedInterstitial()` on iOS and Android, with shared fullscreen events, SDK-earned rewards, terminal cleanup and a matching integration-library manager. The demo introduces the reward and allows skipping before presentation.

First public release. Earlier development snapshots were not published releases.

### Integration and reliability

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


### Documentation

- Add production integration guidance for archive installation, Alloy/Classic imports, privacy, store disclosures, app verification and troubleshooting.
- Separate fullscreen load and show examples, make the optional ATT startup path explicit, and reconcile consent retries, banner reconfiguration and app-open expiry documentation with both native implementations.
- Document API limits and preserve known iOS runtime issues in release readiness.
- Include README screenshots in offline release archives and verify their packaged contents.

### Dependency refresh

- Include Unity Ads SDK 4.21.0 explicitly on Android; the adapter POM does not supply it.
- Update UnityCoherenceLib to 0.2.0 with Unity Ads 4.21.0.
- Retain Meta SDK 6.22.0 and InMobi Android SDK 11.5.0 as required by their latest published adapters, despite newer standalone SDKs.

- Update Google Mobile Ads to iOS 13.11.0 and Android 25.5.0; UMP remains at iOS 3.1.0 and Android 4.0.0.
- Refresh InMobi, Unity and Liftoff to the compatible published versions checked October 23, 2026; AppLovin and Meta adapters remain current. See [Dependencies](dependencies.md).
- Remove IronSourceAdQualitySDK from Unity: Unity Ads 4.21.0 no longer depends on it.
- Require Titanium SDK 13.4.1.GA for the core and every optional complement, matching the build toolchain and Android compile SDK 36.
- Pin Guava 33.7.2-android in the core plus OkHttp 5.4.0 and Okio 3.18.2 in InMobi/Liftoff/Unity to replace the Guava, OkHttp and Okio versions flagged in the security review.
- Retain the version contract test: Meta now matches across platforms; Liftoff retains the documented SDK difference.

### Unified core

- Run Android SDK configuration and initialization off the UI thread; preserve idempotency and deliver success/failure on the UI thread.

- One iOS/Android JavaScript API for standard/adaptive banners, interstitials, rewarded ads, rewarded interstitials and app open ads.
- Consent-first UMP flow, portable ATT completion and Ad Inspector support.
- Idempotent initialization, serialized loads and deterministic cleanup.
- Google Mobile Ads and UMP only; no third-party network adapters in the core.
- The examples use only the core without a mediation flag. Google Mobile Ads automatically discovers adapters supplied by selected complements; `disableMediation: true` remains an explicit session exception.

### Optional mediation

- Five independent dependency modules: `ti.admob.unified.mediation.applovin`, `.meta`, `.inmobi`, `.unity` and `.liftoff`, each on Android and iOS at `1.0.0`.
- Each Android complement declares its adapter Maven coordinate, any required explicit SDK dependency, and documented utility overrides. Each iOS complement vendors only its own adapter, SDK and required resources/dependencies.
- Unity includes UnityAdapter, UnityAds and UnityCoherenceLib. Its updated SDK no longer requires IronSourceAdQualitySDK.
- ironSource mediation is deferred; IronSourceAdapter and IronSource are not distributed.
- SDKs and adapters were updated to the compatible October 23, 2026 versions; framework checksums were regenerated. See [Dependencies](dependencies.md).
- `getMediationStatus()` returns generic Google initialization diagnostics; pre-release provider probes and no-op consent setters were removed. `disableMediation` remains a global startup control.
- Release artifacts are discovered from complement folders and manifests; packaged dependencies are checked against literal Gradle declarations without a provider list. Nothing is published or tagged by the build scripts.

### Validation

Packaging/linking and Google test-ad loading are separate from third-party ad delivery. Provider delivery requires configured accounts, mappings and Ad Inspector evidence; it is not established by a successful build or a Google test ad. See [release validation](mediation.md#release-validation).
