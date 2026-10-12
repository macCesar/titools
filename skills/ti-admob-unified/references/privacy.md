> Source snapshot: official ti.admob.unified 1.0.0 documentation at commit `5b4cbf9` (copied 2026-10-11). Relative links rebased for this skill.

# Privacy and initialization

`ti.admob.unified` exposes Google UMP as an event-based workflow. Callback properties are not part of the contract.

## Required order

Use this order on every app launch:

1. Register module listeners.
2. Call `requestConsent({ ... })`.
3. Wait for the terminal `consent_complete` event.
4. Check `event.canRequestAds` or `canRequestAds()`.
5. Call `initialize({ ... })` once.
6. Create and load ads only after initialization succeeds.

App Tracking Transparency is optional and separate from UMP. `canRequestAds()` remains the only ad-request gate. If the application uses tracking, resolve ATT before `initialize()`; otherwise skip it. See [Optional: if the application requests ATT](getting-started.md#optional-if-the-application-requests-att).

Check UMP even when the consent operation reports an error. Consent from a previous session may still allow requests; `canRequestAds` determines whether the application can continue.

Google's UMP guidance also requires a consent-information update every app session and warns against deriving status from cached consent strings. See [UMP for Android](https://developers.google.com/admob/android/privacy) and [UMP for iOS](https://developers.google.com/admob/ios/privacy).

## `requestConsent(config)`

Starts the UMP consent-information update and immediately loads/presents a form if one is required.

| Property                  | Type     | Default        | Description                                                            |
| ------------------------- | -------- | -------------- | ---------------------------------------------------------------------- |
| `geography`               | Number   | Native default | A `DEBUG_GEOGRAPHY_*` constant. Development only.                      |
| `testDeviceIds`           | String[] | `[]`           | UMP hashed test-device identifiers. Used when `geography` is supplied. |
| `tagForUnderAgeOfConsent` | Boolean  | `false`        | Marks the consent request as under age of consent.                     |

Use `{}` when no options are needed:

```js
Admob.requestConsent({})
```

The operation is idempotent:

- Concurrent calls share the active native operation.
- The first accepted call supplies the configuration.
- A later call after completion re-emits the cached `consent_complete` result.
- `resetConsent()` clears UMP test state and the module's cached consent operation so a new request can run.

Do not put `resetConsent()` in a production launch path.

## `consent_complete`

Every accepted consent operation reaches this terminal event:

```js
{
  success: true,
  canRequestAds: true,
  privacyOptionsRequired: false
}
```

On failure:

```js
{
  success: false,
  canRequestAds: false,
  privacyOptionsRequired: false,
  error: 'Native UMP error message',
  code: 1
}
```

The exact native `code` is platform and SDK dependent. Do not make business logic depend on a particular code.

The payload temporarily retains these deprecated keys:

- `canShowAds`
- `canShowPersonalizedAds`
- `isGDPR`
- `isPrivacyOptionsRequired`

New code must use `canRequestAds` and `privacyOptionsRequired`.

The legacy `consent_ready` and `consent_error` events are emitted before the modern terminal event for compatibility. Do not subscribe to all three for the same workflow or initialization may be attempted more than once.

## `canRequestAds()`

Returns UMP's current permission to request ads.

```js
if (Admob.canRequestAds()) {
  // An ad request may be made.
}
```

This is the only supported request gate.

- `canShowAds()` is a deprecated alias.
- `canShowPersonalizedAds()` is deprecated and always returns `false`.
- `isGDPR()` is a legacy diagnostic and must not gate ads.
- Do not parse `IABTCF_*` storage.
- Do not derive or inject an `npa` request flag from these legacy methods.

Google Mobile Ads applies the privacy signals collected by UMP.

## `initialize(config)`

Configures the global Google Mobile Ads request settings and initializes the SDK.

| Property                       | Type     | Description                                                                                                          |
| ------------------------------ | -------- | -------------------------------------------------------------------------------------------------------------------- |
| `testDeviceIds`                | String[] | Google Mobile Ads test-device identifiers.                                                                           |
| `ageRestrictedTreatment`       | String   | One `AGE_RESTRICTED_TREATMENT_*` constant.                                                                           |
| `maxAdContentRating`           | String   | One `MAX_AD_CONTENT_RATING_*` constant.                                                                              |
| `tagForChildDirectedTreatment` | Boolean  | Deprecated compatibility input; maps to child/unspecified.                                                           |
| `tagForUnderAgeOfConsent`      | Boolean  | Deprecated initialization input; maps to child/unspecified. This is distinct from the UMP option with the same name. |

`applicationId` and `debugGeography` are not initialization properties.

Initialization is idempotent:

- Concurrent calls share one native operation.
- The first accepted configuration wins.
- A call after completion re-emits the cached `module_initialized` result.
- An Android failure caused by a missing current activity can be retried.

### `module_initialized`

Success:

```js
{
  success: true,
  status: 'Native initialization status description'
}
```

Android can report a missing-activity failure:

```js
{
  success: false,
  error: 'No current activity',
  code: -1
}
```

Use `status` for diagnostics. Its text is not a stable machine-readable value.

## App Tracking Transparency

`requestTrackingAuthorization()` is available on both platforms and emits:

```js
{
  status: 3,
  authorized: true,
  applicable: true
}
```

On iOS, the numeric status follows Apple's `ATTrackingManagerAuthorizationStatus`:

| Value | Meaning        |
| ----: | -------------- |
|   `0` | Not determined |
|   `1` | Restricted     |
|   `2` | Denied         |
|   `3` | Authorized     |

On Android, ATT does not apply. The method completes synchronously with `status: 3`, `authorized: true`, and `applicable: false`, allowing the same listener and call site on both platforms.

Always wait for `tracking_authorization_completed`, even if the user resolved ATT in an earlier session. Denial changes tracking availability and does not imply `canRequestAds() === false`; UMP still determines permission to request ads.

ATT is optional. An application that calls `requestTrackingAuthorization()` must ship `NSUserTrackingUsageDescription` in its plist, because Apple's prompt cannot be presented without one. An application that never calls it should omit the key: Apple reviews the prompt against actual behavior, and UMP works without it. See [Getting started](getting-started.md#ios).

## Privacy options

After consent completes, use either the event payload or `isPrivacyOptionsRequired()` to decide whether the app should show a visible, interactive privacy entry point:

```js
privacyButton.visible = Admob.isPrivacyOptionsRequired()
privacyButton.touchEnabled = privacyButton.visible
```

When the user taps it:

```js
const onPrivacyDismissed = event => {
  if (!event.success) {
    Ti.API.warn(`Privacy options failed: ${event.error}`)
  }

  privacyButton.visible = event.privacyOptionsRequired
  privacyButton.touchEnabled = privacyButton.visible
}

Admob.addEventListener('privacy_options_dismissed', onPrivacyDismissed)

privacyButton.addEventListener('click', () => {
  Admob.presentPrivacyOptions({})
})
```

The event payload is:

```js
{
  success: true,
  canRequestAds: true,
  privacyOptionsRequired: true
}
```

Failures add `error` and `code`. Remove the module listener when its owning service is disposed.

## Testing UMP

Use debug geography only with registered UMP test devices:

```js
Admob.requestConsent({
  geography: Admob.DEBUG_GEOGRAPHY_EEA,
  testDeviceIds: ['HASHED_UMP_TEST_DEVICE_ID'],
  tagForUnderAgeOfConsent: false
})
```

Available debug constants:

- `DEBUG_GEOGRAPHY_DISABLED`
- `DEBUG_GEOGRAPHY_EEA`
- `DEBUG_GEOGRAPHY_REGULATED_US_STATE`
- `DEBUG_GEOGRAPHY_OTHER`

Do not store the numeric values; use the names because the native enum values are platform-owned.

`resetConsent()` exists for controlled testing. It does not remove the need to request consent information again, and it must not be exposed as a general "revoke consent" implementation. Use `presentPrivacyOptions()` for the publisher-rendered privacy entry point.


## Interactive consent demo

The published `example/app.js` includes **Consent demo** controls in development/test builds on Android and iOS. First launch uses the normal region. Production builds hide these controls and ignore saved debug settings.

1. In the visible **Test device** field, use the physical device's UMP identifier from the SDK log, including any hyphens on iOS; the app remembers it. To prefill a development build, set the string application property `demo.consentDeviceIds.ios` or `demo.consentDeviceIds.android` in the consumer's `tiapp.xml`. A saved nonempty field takes precedence. iOS simulators need no identifier. Enter only finishes typing.
2. Tap the scenario selector, choose **Europe — consent form**, **US — privacy options**, **Other region — no form**, or **My actual region**, then tap **Run test**. Selecting a scenario alone does not reset consent. Running it clears the previous UMP choice and replaces existing ads.
3. The single result below the button reports progress and completion. Europe requests consent; US opens privacy options when available; Other and the actual region can finish without a dialog. Which form is available depends on the AdMob message configuration. The banner slot keeps its height while ads reload.
4. Use **Advertising privacy options** to revise a choice without resetting. Relaunching preserves the chosen mode, hashes and consent. Run **My actual region** to remove the region override.

Demo ad unit IDs do not register physical devices for UMP debugging. If the SDK log redacts the hash, use an iOS simulator; an unregistered physical device may ignore forced geography.

These test buttons reset UMP consent only. They cannot reset Apple's ATT permission. Do not copy these testing controls or debug geography into a production consent flow. Unknown/error states are displayed separately from a successful result that does not require privacy options.

Google reference: [Testing UMP on iOS](https://developers.google.com/admob/ios/privacy#testing) and [Testing UMP on Android](https://developers.google.com/admob/android/privacy#testing).
