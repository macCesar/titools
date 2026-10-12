> Source snapshot: official ti.admob.unified 1.0.0 documentation at commit `5b4cbf9` (copied 2026-10-11). Relative links rebased for this skill.

# Third-party SDK notices

`ti.admob.unified` and the `ti.admob.unified.mediation.<network>` complements use the MIT license. The distributed advertising SDKs and adapters have their own licenses, terms, privacy policies and publisher agreements.

The core `ti.admob.unified` includes Google Mobile Ads and UMP. Each optional network module includes its network SDK and Google adapter, so applications distribute only selected dependencies. Unity includes UnityCoherenceLib; ironSource advertising is deferred.

| Component                                             | Owner                      | Terms or license                                                    |
| ----------------------------------------------------- | -------------------------- | ------------------------------------------------------------------- |
| Google Mobile Ads, UMP, and Google mediation adapters | Google LLC                 | [Google APIs Terms of Service](https://developers.google.com/terms) |
| AppLovin SDK                                          | AppLovin Corp.             | [AppLovin Terms](https://www.applovin.com/terms/)                   |
| Meta Audience Network SDK                             | Meta Platforms, Inc.       | [Meta Platform Terms](https://developers.facebook.com/terms/)       |
| InMobi SDK                                            | InMobi Technology Services | [InMobi publisher terms](https://www.inmobi.com/terms-of-service/)  |
| Unity Ads and Unity support libraries                 | Unity Technologies         | [Unity Terms of Service](https://unity.com/legal/terms-of-service)  |
| Liftoff Monetize/Vungle SDK                           | Liftoff Mobile, Inc.       | [Liftoff Monetize terms](https://publisher.vungle.com/LICENSE.html) |

The exact versions are recorded in [the dependency inventory](dependencies.md). Maintainers must review the upstream terms whenever a native SDK is added or updated. Application publishers must also accept and comply with the terms of every network they enable in AdMob.

Android also distributes Guava as a utility dependency. Guava uses the [Apache License 2.0](https://github.com/google/guava/blob/master/LICENSE) and is not an advertising SDK.

The InMobi and Liftoff Android complements also pin OkHttp 4.12.0. OkHttp and its Okio dependency use the Apache License 2.0; preserve their distributed license notices. See [OkHttp](https://github.com/lysine-dev/okhttp/blob/master/LICENSE.txt) and [Okio](https://github.com/lysine-dev/okio/blob/main/LICENSE.txt).
