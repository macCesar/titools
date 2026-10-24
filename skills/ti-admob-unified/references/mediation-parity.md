> Source snapshot: official ti.admob.unified 1.0.0 documentation at release source commit `034843299b2984253988e0ffccb9f6a1c91682c9` (copied 2026-10-24). Relative links rebased for this skill.

# Mediation parity

The first release, `1.0.0`, provides five optional dependency modules with identical identifiers on iOS and Android. Install only the networks the application intends to use. The core `ti.admob.unified` contains Google Mobile Ads and UMP only. The complements provide dependencies without a JavaScript API or manual provider initialization.

| Network                   | Module ID                             | iOS adapter  | Android adapter |
| ------------------------- | ------------------------------------- | ------------ | --------------- |
| AppLovin                  | `ti.admob.unified.mediation.applovin` | `13.6.4.0` | `13.6.4.2` |
| Meta Audience Network     | `ti.admob.unified.mediation.meta`     | `6.22.0.0` | `6.22.0.1` |
| InMobi                    | `ti.admob.unified.mediation.inmobi`   | `11.5.0.0` | `11.5.0.1` |
| Unity Ads                 | `ti.admob.unified.mediation.unity`    | `4.21.0.0` | `4.21.0.0` |
| Liftoff Monetize (Vungle) | `ti.admob.unified.mediation.liftoff`  | `7.7.8.0` | `7.7.9.0` |

ironSource mediation is deferred: neither its adapter nor its advertising SDK is distributed. Unity includes UnityCoherenceLib; Unity Ads 4.21.0 no longer requires IronSourceAdQualitySDK.

All requests use the core factories and event contracts. Network selection requires installing the corresponding complement and configuring the source in AdMob. `getMediationStatus()` reports `{ initializationState, adapters }` with all statuses known to Google on both platforms. Entries include native class name, state, description and latency in milliseconds. Initialization and ad delivery require separate verification. See [AdMob mediation](mediation.md).
