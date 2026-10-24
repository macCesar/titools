> Source snapshot: official ti.admob.unified 1.0.0 documentation at release source commit `034843299b2984253988e0ffccb9f6a1c91682c9` (copied 2026-10-24). Relative links rebased for this skill.

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
- A later call after success re-emits the cached `consent_complete` result.
- After an update or form failure, another `requestConsent({})` can retry without clearing persisted consent.
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

A failed update can still report `canRequestAds: true` from previously stored consent. Check that field even when `success` is false; do not assume an error requires blocking all requests. If it is false, continue the app without ads and offer a later retry.

The native `code` depends on the platform and SDK. Avoid tying business logic to a particular value.

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
| `disableMediation`             | Boolean  | Optional global session exception before SDK startup; defaults to `false`. See [automatic adapter discovery](api-reference.md#automatic-adapter-discovery). |
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

Android SDK initialization failures also emit `success: false`, `code: -1` and the failure text; a later call can retry. Request configuration and SDK startup run in the background, while completion events return to the UI thread. The app can continue while SDK work runs; a provider timeout still delays completion.

Use `status` for diagnostics. Its text can change and should not drive application logic.

## App Tracking Transparency

`getTrackingAuthorizationStatus()` reads the current ATT state synchronously, without a prompt, event, or SDK initialization. Call it again after returning from Settings; the result is not cached.

`requestTrackingAuthorization()` remains the explicit permission request and emits:

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

On Android, ATT does not apply. The method completes synchronously with `status: 3`, `authorized: true`, and `applicable: false`, allowing the same listener and call site on both platforms. The query returns the same convention. `authorized: true` here is not general permission to track an Android user.

For apps that use tracking, run UMP → optional ATT → `canRequestAds()` → `initialize()` → ad loading. Request ATT while the application is active in the foreground, after UMP has dismissed its form and other system prompts have finished. If the app becomes inactive, defer the request until it is active again.

When requesting ATT, always wait for `tracking_authorization_completed`, even if the user resolved ATT in an earlier session. Denial changes tracking availability and does not imply `canRequestAds() === false`; UMP still determines permission to request ads.

ATT is optional. An application that calls `requestTrackingAuthorization()` must ship `NSUserTrackingUsageDescription` in its plist, because Apple's prompt cannot be presented without one. An IDFA message configured in AdMob can also make UMP request ATT during `requestConsent()`, which requires the same key and translations even if the app never calls the module's explicit request method. Omit the key only when neither the app nor its SDK configuration requests ATT and the app does not track. See Google's [UMP IDFA message guide](https://developers.google.com/admob/ios/privacy/idfa). See [Getting started](getting-started.md#ios).

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
  // Recheck event.canRequestAds and replace affected placements before
  // requesting more ads. The integration library handles this boundary.
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

After a privacy change, stop new loads and presentations until the dismissal result has been evaluated. Discard ads requested under the previous choice and create fresh requests only if `canRequestAds()` allows them. Do not destroy an onscreen fullscreen ad as a way to dismiss it. The [integration library](library.md#privacy-and-diagnostics) manages placement reauthorization.

## Testing UMP

GMA test-device IDs and UMP test-device IDs belong to separate SDK configurations; registering one does not register the other. Copy each identifier from that SDK's log. `TEST_*` ad units select Google test creatives; they do not force a UMP region.

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


## ATT demo controls

The published example includes a Tracking transparency section on both platforms:

- Check ATT status calls `getTrackingAuthorizationStatus()` and displays the current status, authorization and applicability without requesting permission or initializing ads. The result also shows when it was checked and a manual check count, so repeated taps have visible feedback.
- Request ATT permission is enabled only for an undetermined iOS permission while the app is active and no consent/initialization operation is busy. It uses the same request event as startup. Resolved, restricted and Android states keep the button disabled. A resolved iOS permission has a nearby explanation directing changes to Settings.
- Returning from Settings refreshes the displayed system state. The app cannot reset ATT through UMP or show Apple's prompt again after a resolved choice.

An AdMob UMP IDFA message may already resolve ATT during startup. In that case the request button is disabled and the current result remains visible. On Android, the section explains that the portable `authorized: true` value is not general tracking permission. See [ATT configuration](getting-started.md#ios) for the usage description and translations.
