> Source snapshot: official ti.admob.unified 1.0.0 documentation at commit `5b4cbf9` (copied 2026-10-11). Relative links rebased for this skill.

# ti.admob.unified documentation

This documentation describes the public JavaScript contract implemented by `ti.admob.unified` `1.0.0`.

## Start here

1. [Getting started](getting-started.md): install the platform artifacts, configure the AdMob application IDs, and make a first test request.
2. [Integrating the module](integration.md): the boundary between native lifecycle, application navigation, layout, and refresh ownership.
3. [Copy-ready JavaScript library](library.md): copy one maintained file into `lib/` for startup, every implemented ad format, privacy, and cleanup.
4. [Privacy and initialization](privacy.md): implement UMP, ATT, the `canRequestAds()` gate, and privacy options correctly.
5. [AdMob mediation](mediation.md): install selected complements, and configure and validate the five networks without platform-specific JavaScript.
6. [Banner ads](banners.md): integrate standard or adaptive banners with real layout space and deterministic cleanup.
7. [Fullscreen ads](fullscreen.md): interstitial, rewarded, and app open ads on one lifecycle, and when it is acceptable to interrupt the user.

## Reference

- [Complete API reference](api-reference.md): module methods, proxy methods, events, payloads, constants, compatibility APIs, and platform notes.
- [Migrating to ti.admob.unified](migration.md): replace `ti.admob`, `ti.android.admob`, or an internal pre-release build.
- [Third-party SDK notices](third-party-notices.md): licenses and terms for the distributed advertising SDKs.

- [Adding a network](contributing.md#adding-a-network): package and validate an existing official mediation adapter.

## Project information

- [Dependency inventory](dependencies.md)
- [Changelog](module-changelog.md)
- [Roadmap](roadmap.md)
- [Contributing](contributing.md)
