# Modules: Facebook, Identity, Crypto & More API Reference

## Modules.Applesignin
> A module to use apple signin functionality.
> Extends Ti.Module
> Platforms: ios
> Type: module

### Constants (14)
- **AUTHORIZATION_SCOPE_\***: AUTHORIZATION_SCOPE_FULLNAME, AUTHORIZATION_SCOPE_EMAIL
- **BUTTON_STYLE_\***: BUTTON_STYLE_WHITE, BUTTON_STYLE_BLACK
- **BUTTON_STYLE_WHITE_\***: BUTTON_STYLE_WHITE_OUTLINE
- **BUTTON_TYPE_\***: BUTTON_TYPE_DEFAULT, BUTTON_TYPE_CONTINUE
- **BUTTON_TYPE_SIGN_\***: BUTTON_TYPE_SIGN_IN
- **CREDENTIAL_STATE_\***: CREDENTIAL_STATE_REVOKED, CREDENTIAL_STATE_AUTHORIZED
- **CREDENTIAL_STATE_NOT_\***: CREDENTIAL_STATE_NOT_FOUNFD
- **USER_DETECTION_STATUS_\***: USER_DETECTION_STATUS_REAL, USER_DETECTION_STATUS_UNSUPPORTED, USER_DETECTION_STATUS_UNKNOWN


### Methods (3)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| authorize(scopes) | void | ios | Request Apple ID authorization. |
| getCredentialState(userId, callback) | void | ios | Returns the credential state for the given user. |
| createLoginButton(parameters) | Modules.Applesignin.LoginButton | ios | Creates and returns an instance of <Modules.Apple… |

### Events (1)
| Event | Platform | Description |
|-------|----------|-------------|
| login | ios | Fired at login. |

---

## Modules.Applesignin.LoginButton
> Built-in login button which can be added on view.
> Extends Ti.UI.View
> Platforms: ios

### Properties (unique: 3/49)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| borderRadius | Number | ios | The radius, in points, for the rounded corners on… |
| type | Number | ios | Type for the authorization button. |
| style | Number | ios | Style for the authorization button. |




---

## Modules.Barcode
> Add-on Barcode module
> Extends Ti.Module
> Platforms: both
> Type: module

### Properties (unique: 7/39)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| allowRotation | Boolean | ios | Value that indicates if the barcode capture shoul… |
| allowMenu | Boolean | android | Whether or not to allow the built-in ZXing menu t… |
| allowInstructions | Boolean | android | Whether or not to display helpful instructions or… |
| copyToClipboard | Boolean | android | Whether or not copy the result to the clipboard |
| displayedMessage | String | both | Controls the message that is displayed to the end… |
| useFrontCamera | Boolean | both | Controls whether or not the front camera on the d… |
| useLED | Boolean | both | Whether or not to use the LED when scanning barco… |

### Constants (30)
- **FORMAT_\***: FORMAT_NONE, FORMAT_ITF, FORMAT_AZTEC, FORMAT_MAXICODE, FORMAT_CODABAR
- **FORMAT_CODE_\***: FORMAT_CODE_128, FORMAT_CODE_39, FORMAT_CODE_93
- **FORMAT_CODE_39_MOD_\***: FORMAT_CODE_39_MOD_43
- **FORMAT_DATA_\***: FORMAT_DATA_MATRIX
- **FORMAT_EAN_\***: FORMAT_EAN_8, FORMAT_EAN_13
- **FORMAT_INTERLEAVED_2_OF_\***: FORMAT_INTERLEAVED_2_OF_5
- **FORMAT_PDF_\***: FORMAT_PDF_417
- **FORMAT_QR_\***: FORMAT_QR_CODE
- **FORMAT_RSS_\***: FORMAT_RSS_14, FORMAT_RSS_EXPANDED
- **FORMAT_UPC_\***: FORMAT_UPC_E, FORMAT_UPC_A
- **OTHER_\***: UNKNOWN, URL, SMS, TELEPHONE, TEXT, CALENDAR, GEOLOCATION, EMAIL, CONTACT, BOOKMARK, WIFI


### Methods (4)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| cancel(—) | void | both | Cancels and closes the currently open capture win… |
| canShow(—) | Boolean | ios | Whether the barcode scanner camera is allowed. |
| capture(dictionary) | void | both | Brings up the camera and begins the capture seque… |
| parse(dictionary) | void | both | Parses a blob image for barcodes. |

### Events (3)
| Event | Platform | Description |
|-------|----------|-------------|
| success | both | Fired upon a successful barcode scan. |
| error | both | Sent when an error occurs. |
| cancel | both | Sent when the scanning process is canceled. |

---

## Modules.Crypto
> Add-on Crypto module
> Extends Ti.Module
> Platforms: both
> Type: module

### Constants (37)
- **ALGORITHM_\***: ALGORITHM_AES128, ALGORITHM_DES, ALGORITHM_3DES, ALGORITHM_CAST, ALGORITHM_RC4, ALGORITHM_RC2
- **BLOCKSIZE_\***: BLOCKSIZE_AES128, BLOCKSIZE_DES, BLOCKSIZE_3DES, BLOCKSIZE_CAST, BLOCKSIZE_RC2
- **KEYSIZE_\***: KEYSIZE_AES128, KEYSIZE_AES192, KEYSIZE_AES256, KEYSIZE_DES, KEYSIZE_3DES, KEYSIZE_MINCAST, KEYSIZE_MAXCAST, KEYSIZE_MINRC4, KEYSIZE_MAXRC4, KEYSIZE_MINRC2, KEYSIZE_MAXRC2
- **OPTION_\***: OPTION_PKCS7PADDING, OPTION_ECBMODE
- **OTHER_\***: ENCRYPT, DECRYPT
- **STATUS_\***: STATUS_SUCCESS, STATUS_ERROR, STATUS_PARAMERROR, STATUS_BUFFERTOOSMALL, STATUS_MEMORYFAILURE, STATUS_ALIGNMENTERROR, STATUS_DECODEERROR, STATUS_UNIMPLEMENTED
- **TYPE_\***: TYPE_BLOB, TYPE_HEXSTRING, TYPE_BASE64STRING


### Methods (2)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| encodeData(dictionary) | Number | both | Encodes the source into the destination buffer us… |
| decodeData(dictionary) | String | both | Decodes a source buffer into a string using the s… |


---

## Modules.Crypto.Cryptor
> The Cryptor object provides access to a number of symmetric encryption algorithms. Symmetric encryption algorithms come in two "flavors" - block ciphers, and stream ciphers. Block ciphers process data (while both encrypting and decrypting) in discrete chunks of data called blocks; stream ciphers operate on arbitrary sized data.
> Extends Ti.Proxy
> Platforms: both

### Properties (unique: 6/8)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| resizeBuffer | Boolean | both | Used in the [encrypt](Modules.Crypto.Cryptor.encr… |
| operation | Number | both | Used in the [capture](Modules.Barcode.capture) an… |
| algorithm | Number | both | Used in the [encrypt](Modules.Crypto.Cryptor.encr… |
| options | Number | both | Used in the [encrypt](Modules.Crypto.Cryptor.encr… |
| key | Ti.Buffer | both | Used in the [encrypt](Modules.Crypto.Cryptor.encr… |
| initializationVector | Ti.Buffer | both | Used in the [encrypt](Modules.Crypto.Cryptor.encr… |


### Methods (7)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| encrypt(dataIn, dataInLength, dataOut, dataOutLength) | Number | both | Stateless, one-shot encryption operation. |
| decrypt(dataIn, dataInLength, dataOut, dataOutLength) | Number | both | Stateless, one-shot decryption operation. |
| getOutputLength(dataInLength, final) | Number | both | getOutputLength is used to determine the output b… |
| update(dataIn, dataInLength, dataOut, dataOutLength) | Number | both | update is used to encrypt or decrypt data. This m… |
| finish(dataOut, dataOutLength) | Number | both | Finishes encryption and decryption operations and… |
| reset(initializationVector) | Number | both | reset reinitializes an existing cryptor object wi… |
| release(—) | Number | both | release will dispose of the internal cryptor data |


---

## Modules.EncryptedDatabase
> Provides transparent, secure 256-bit AES encryption of SQLite database files.
> Extends Ti.Database
> Platforms: both
> Type: module

### Properties (unique: 4/14)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| hmacAlgorithm | Number | both | The hashing algorithm the encrypted database will… |
| hmacKdfIterations | Number | both | Number of iterations that the KDF (Key Derivation… |
| password | String | both | The password used to encrypt sensitive data. |
| pageSize | Number | android | Setting the PRAGMA cipher_page_size value |

### Constants (3)
- **HMAC_\***: HMAC_SHA1, HMAC_SHA256, HMAC_SHA512


### Methods (2)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| isCipherUpgradeRequired(name) | Boolean | ios | Checks and returns if sqlcipher is required to be… |
| cipherUpgrade(name) | CipherUpgradeResult | ios | Upgrades sqlcipher used in database. |


---

## Modules.Facebook
> Add-on Facebook module.
> Extends Ti.Module
> Platforms: both
> Type: module

### Properties (unique: 10/50)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| accessToken | String | both | OAuth token set after a successful `authorize`. |
| accessTokenExpired | Boolean | both | Returns whether the <Modules.Facebook.accessToken… |
| accessTokenActive | Boolean | both | Returns `true` if the <Modules.Facebook.accessTok… |
| appID | String | both | If not explicitly set, the default will be read f… |
| canPresentOpenGraphActionDialog | Boolean | android | Checks if the device can support the use of the F… |
| expirationDate | Date | both | Time at which the `accessToken` expires. |
| loggedIn | Boolean | both | Indicates if the user is logged in. |
| loginTracking | Number | ios | Gets or sets the desired tracking preference to u… |
| permissions | Array<String> | both | Array of permissions to request for your app. |
| uid | String | both | Unique user ID returned from Facebook. |

### Constants (37)
- **ACTION_TYPE_\***: ACTION_TYPE_NONE, ACTION_TYPE_SEND, ACTION_TYPE_TURN
- **ACTION_TYPE_ASK_\***: ACTION_TYPE_ASK_FOR
- **AUDIENCE_\***: AUDIENCE_FRIENDS, AUDIENCE_EVERYONE
- **AUDIENCE_ONLY_\***: AUDIENCE_ONLY_ME
- **EVENT_NAME_ADDED_PAYMENT_\***: EVENT_NAME_ADDED_PAYMENT_INFO
- **EVENT_NAME_ADDED_TO_\***: EVENT_NAME_ADDED_TO_CART
- **EVENT_NAME_COMPLETED_\***: EVENT_NAME_COMPLETED_REGISTRATION
- **EVENT_NAME_INITIATED_\***: EVENT_NAME_INITIATED_CHECKOUT
- **EVENT_NAME_VIEWED_\***: EVENT_NAME_VIEWED_CONTENT
- **EVENT_PARAM_\***: EVENT_PARAM_CONTENT, EVENT_PARAM_CURRENCY
- **EVENT_PARAM_CONTENT_\***: EVENT_PARAM_CONTENT_ID, EVENT_PARAM_CONTENT_TYPE
- **EVENT_PARAM_NUM_\***: EVENT_PARAM_NUM_ITEMS
- **EVENT_PARAM_PAYMENT_INFO_\***: EVENT_PARAM_PAYMENT_INFO_AVAILABLE
- **FILTER_\***: FILTER_NONE
- **FILTER_APP_\***: FILTER_APP_USERS
- **FILTER_APP_NON_\***: FILTER_APP_NON_USERS
- **LOGIN_BUTTON_TOOLTIP_BEHAVIOR_\***: LOGIN_BUTTON_TOOLTIP_BEHAVIOR_AUTOMATIC, LOGIN_BUTTON_TOOLTIP_BEHAVIOR_DISABLE
- **LOGIN_BUTTON_TOOLTIP_BEHAVIOR_FORCE_\***: LOGIN_BUTTON_TOOLTIP_BEHAVIOR_FORCE_DISPLAY
- **LOGIN_BUTTON_TOOLTIP_STYLE_FRIENDLY_\***: LOGIN_BUTTON_TOOLTIP_STYLE_FRIENDLY_BLUE
- **LOGIN_BUTTON_TOOLTIP_STYLE_NEUTRAL_\***: LOGIN_BUTTON_TOOLTIP_STYLE_NEUTRAL_GRAY
- **LOGIN_TRACKING_\***: LOGIN_TRACKING_ENABLED, LOGIN_TRACKING_LIMITED
- **MESSENGER_BUTTON_MODE_\***: MESSENGER_BUTTON_MODE_CIRCULAR, MESSENGER_BUTTON_MODE_RECTANGULAR
- **SHARE_DIALOG_MODE_\***: SHARE_DIALOG_MODE_AUTOMATIC, SHARE_DIALOG_MODE_NATIVE, SHARE_DIALOG_MODE_BROWSER, SHARE_DIALOG_MODE_WEB
- **SHARE_DIALOG_MODE_FEED_\***: SHARE_DIALOG_MODE_FEED_BROWSER, SHARE_DIALOG_MODE_FEED_WEB
- **SHARE_DIALOG_MODE_SHARE_\***: SHARE_DIALOG_MODE_SHARE_SHEET


### Methods (17)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| authorize(—) | void | both | Prompts the user to log in (if not already logged… |
| createActivityWorker(parameters) | Ti.Proxy | android | Creates a Facebook proxy to hook into the activit… |
| initialize(—) | void | both | Loads a cached Facebook session if available, the… |
| logCustomEvent(event, valueToSum, params) | void | both | Logs a custom event to Facebook. |
| logPurchase(amount, currency, parameters) | void | both | Log a purchase of the specified amount, in the sp… |
| logout(—) | void | both | Clears the OAuth `accessToken` and logs out the u… |
| presentShareDialog(params) | void | both | Opens a Facebook link share dialog. |
| presentPhotoShareDialog(params) | void | both | Opens a Facebook photo share dialog. |
| refreshPermissionsFromServer(—) | void | both | Makes a request to Facebook to get the latest per… |
| requestWithGraphPath(path, params, httpMethod, callback) | void | both | Makes a Facebook Graph API request. |
| requestNewReadPermissions(permissions, callback) | void | both | Makes a request to Facebook for additional read p… |
| requestNewPublishPermissions(permissions, audience, callback) | void | both | Makes a request to Facebook for additional write … |
| fetchDeferredAppLink(callback) | void | both | Fetch the deferred app link |
| setCurrentAccessToken(params) | void | ios | Set a new access token for using Facebook service… |
| logPushNotificationOpen(payload, action) | void | both | Log an app event that tracks that the application… |
| setPushNotificationsDeviceToken(deviceToken) | void | both | Sets a device token to register the current appli… |
| createLoginButton(parameters) | Modules.Facebook.LoginButton | both | Creates and returns an instance of <Modules.Faceb… |

### Events (6)
| Event | Platform | Description |
|-------|----------|-------------|
| login | both | Fired at session login. |
| logout | both | Fired at session logout. |
| requestDialogCompleted | both | Fired when the Send Request dialog is closed. |
| shareCompleted | both | Fired when the Share dialog or Web Share dialog is closed. |
| inviteCompleted | both | Fired when the Invite dialog is closed. |
| tokenUpdated | both | Fired when [refreshPermissionsFromServer](Modules.Facebook.refreshPermissionsFr… |

---

## Modules.Facebook.LoginButton
> A Facebook Login Button.
> Extends Ti.UI.View
> Platforms: both

### Properties (unique: 7/79)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| audience | Number | both | Default audience to use for Facebook posts if pub… |
| readPermissions | Array<String> | both | Requested read permissions. |
| publishPermissions | Array<String> | both | Requested write permissions. |
| tooltipBehavior | Number | both | Gets or sets the desired tooltip behavior. |
| tooltipColorStyle | Number | both | Gets or sets the desired tooltip color style. |
| loginTracking | Number | ios | Gets or sets the desired tracking preference to u… |
| nonce | String | ios | Gets or sets an optional nonce to use for login a… |




---

## Modules.Geofence
> Provides a battery-efficient way to monitor a device's movement into or out of a geographic region.
> Extends Ti.Module
> Platforms: both
> Type: module

### Properties (unique: 1/11)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| monitoredRegions | Array<Modules.Geofence.Region> | ios | An array of the regions currently being monitored… |

### Constants (7)
- **LOCATION_STATUS_\***: LOCATION_STATUS_ERROR
- **LOCATION_STATUS_GEOFENCE_NOT_\***: LOCATION_STATUS_GEOFENCE_NOT_AVAILABLE
- **LOCATION_STATUS_GEOFENCE_TOO_MANY_\***: LOCATION_STATUS_GEOFENCE_TOO_MANY_GEOFENCES
- **LOCATION_STATUS_GEOFENCE_TOO_MANY_PENDING_\***: LOCATION_STATUS_GEOFENCE_TOO_MANY_PENDING_INTENTS
- **REGION_STATE_\***: REGION_STATE_UNKNOWN, REGION_STATE_INSIDE, REGION_STATE_OUTSIDE


### Methods (7)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| regionMonitoringAvailable(—) | Boolean | ios | Returns a boolean that indicates if region monito… |
| requestStateForRegion(—) | void | ios | Asynchronously retrieve the cached state of the s… |
| isGooglePlayServicesAvailable(—) | Boolean | android | Returns a number value indicating the availabilit… |
| createRegion(object) | Modules.Geofence.Region | both | Creates a geofence [Region](Modules.Geofence.Regi… |
| startMonitoringForRegions(Region) | void | both | Starts monitoring the [Region(s)](Modules.Geofenc… |
| stopMonitoringForRegions(Region) | void | both | Stops monitoring the specified region or regions. |
| stopMonitoringAllRegions(—) | void | both | Stops monitoring all of the regions that are curr… |

### Events (6)
| Event | Platform | Description |
|-------|----------|-------------|
| error | both | Fired when there is an error, or monitoring failed for a region. |
| enterregions | both | Fired when the device enters a monitored region. |
| exitregions | both | Fired when the device exits a monitored region. |
| monitorregions | both | Fired when [startMonitoringForRegions()](Modules.Geofence.startMonitoringForReg… |
| regionstate | both | Fired when [requestStateForRegion()](Modules.Geofence.requestStateForRegion) re… |
| removeregions | android | Fired on Android when regions are removed using `stopMonitoringForRegions` or `… |

---

## Modules.Geofence.Region
> Represents a geographic region to be monitored.
> Extends Ti.Proxy
> Platforms: both

### Properties (unique: 5/8)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| identifier | String | both | The unique identifier of the region. |
| center | Dictionary | both | An object representing the center coordinate for … |
| radius | Number | both | The radius of the region to monitor in meters. |
| notifyOnEntry | Boolean | both | A boolean that controls whether the region will n… |
| notifyOnExit | Boolean | both | A boolean that controlls whether the region will … |


### Methods (1)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| containsCoordinate(point) | void | ios | Returns `true` if the coordinates passed to the m… |


---

## Modules.Https
> Prevents a man-in-the-middle attack when used with the `Titanium.Network.HTTPClient` class.
> Extends Ti.Module
> Platforms: both
> Type: module


### Methods (1)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| createX509CertificatePinningSecurityManager(params) | SecurityManagerProtocol | both | Creates a Security Manager object for the `HTTPCl… |


---

## Modules.Identity
> Allows a Titanium application to use the iOS Touch ID / Face ID authentication mechanism.
> Extends Ti.Module
> Platforms: both
> Type: module

### Properties (unique: 5/43)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| authenticationPolicy | Number | both | Sets the global authentication policy used in thi… |
| biometryType | Number | ios | Indicates the type of the biometry supported by t… |
| hasFaceScanner | Boolean | android | Returns true if the has biometric hardware to per… |
| hasIrisScanner | Boolean | android | Returns true if the device has biometric hardware… |
| hasFingerprintScanner | Boolean | android | Returns true if the device has biometric hardware… |

### Constants (35)
- **ACCESS_CONTROL_\***: ACCESS_CONTROL_OR, ACCESS_CONTROL_AND
- **ACCESS_CONTROL_APPLICATION_\***: ACCESS_CONTROL_APPLICATION_PASSWORD
- **ACCESS_CONTROL_DEVICE_\***: ACCESS_CONTROL_DEVICE_PASSCODE
- **ACCESS_CONTROL_PRIVATE_KEY_\***: ACCESS_CONTROL_PRIVATE_KEY_USAGE
- **ACCESS_CONTROL_TOUCH_ID_\***: ACCESS_CONTROL_TOUCH_ID_ANY
- **ACCESS_CONTROL_TOUCH_ID_CURRENT_\***: ACCESS_CONTROL_TOUCH_ID_CURRENT_SET
- **ACCESS_CONTROL_USER_\***: ACCESS_CONTROL_USER_PRESENCE
- **ACCESSIBLE_\***: ACCESSIBLE_ALWAYS
- **ACCESSIBLE_AFTER_FIRST_\***: ACCESSIBLE_AFTER_FIRST_UNLOCK
- **ACCESSIBLE_AFTER_FIRST_UNLOCK_THIS_DEVICE_\***: ACCESSIBLE_AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY
- **ACCESSIBLE_ALWAYS_THIS_DEVICE_\***: ACCESSIBLE_ALWAYS_THIS_DEVICE_ONLY
- **ACCESSIBLE_WHEN_\***: ACCESSIBLE_WHEN_UNLOCKED
- **ACCESSIBLE_WHEN_PASSCODE_SET_THIS_DEVICE_\***: ACCESSIBLE_WHEN_PASSCODE_SET_THIS_DEVICE_ONLY
- **ACCESSIBLE_WHEN_UNLOCKED_THIS_DEVICE_\***: ACCESSIBLE_WHEN_UNLOCKED_THIS_DEVICE_ONLY
- **AUTHENTICATION_POLICY_\***: AUTHENTICATION_POLICY_PASSCODE, AUTHENTICATION_POLICY_BIOMETRICS, AUTHENTICATION_POLICY_WATCH
- **AUTHENTICATION_POLICY_BIOMETRICS_OR_\***: AUTHENTICATION_POLICY_BIOMETRICS_OR_WATCH
- **BIOMETRY_TYPE_\***: BIOMETRY_TYPE_NONE
- **BIOMETRY_TYPE_FACE_\***: BIOMETRY_TYPE_FACE_ID
- **BIOMETRY_TYPE_TOUCH_\***: BIOMETRY_TYPE_TOUCH_ID
- **ERROR_APP_\***: ERROR_APP_CANCELLED
- **ERROR_AUTHENTICATION_\***: ERROR_AUTHENTICATION_FAILED
- **ERROR_BIOMETRY_\***: ERROR_BIOMETRY_LOCKOUT
- **ERROR_BIOMETRY_NOT_\***: ERROR_BIOMETRY_NOT_AVAILABLE, ERROR_BIOMETRY_NOT_ENROLLED
- **ERROR_INVALID_\***: ERROR_INVALID_CONTEXT
- **ERROR_PASSCODE_NOT_\***: ERROR_PASSCODE_NOT_SET
- **ERROR_SYSTEM_\***: ERROR_SYSTEM_CANCEL
- **ERROR_TOUCH_ID_\***: ERROR_TOUCH_ID_LOCKOUT
- **ERROR_TOUCH_ID_NOT_\***: ERROR_TOUCH_ID_NOT_AVAILABLE, ERROR_TOUCH_ID_NOT_ENROLLED
- **ERROR_USER_\***: ERROR_USER_CANCEL, ERROR_USER_FALLBACK


### Methods (5)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| createKeychainItem(params) | void | both | Create KeychainItem. |
| authenticate(params) | void | both | Initiates the biometric authentication process. |
| invalidate(—) | void | both | Invalidates the current biometric dialog. |
| deviceCanAuthenticate(—) | DeviceCanAuthenticateResult | both | Checks to see if device is configured for biometr… |
| isSupported(—) | Boolean | both | Determines if the current device supports Touch I… |


---

## Modules.Identity.KeychainItem
> Represents a keychain item to communicate with the native iOS Keychain and Android Keystore.
> Extends Ti.Module
> Platforms: both
> Type: module


### Methods (5)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| save(value) | void | both | Saves a new value to the native keychain. |
| read(—) | void | both | Reads an existing value to the native keychain. |
| update(value) | void | both | Updates an existing value to the native keychain. |
| reset(—) | void | both | Resets an existing value from the native keychain. |
| fetchExistence(result) | void | both | Asynchronously determines whether or not a value … |

### Events (4)
| Event | Platform | Description |
|-------|----------|-------------|
| save | both | Triggered when a new keychain item is saved (or an error occurred). |
| update | both | Triggered when a new keychain item is updated (or an error occurred). |
| read | both | Triggered when a new keychain item is read (or an error occurred). |
| reset | both | Triggered when a new keychain item is reset (or an error occurred). |

---

## Modules.PlayServices
> Allows a Titanium application or module to use Google Play Services.
> Extends Ti.Module
> Platforms: android
> Type: module

### Constants (7)
- **GOOGLE_PLAY_SERVICES_\***: GOOGLE_PLAY_SERVICES_PACKAGE
- **GOOGLE_PLAY_SERVICES_VERSION_\***: GOOGLE_PLAY_SERVICES_VERSION_CODE
- **RESULT_\***: RESULT_SUCCESS
- **RESULT_SERVICE_\***: RESULT_SERVICE_MISSING, RESULT_SERVICE_UPDATING, RESULT_SERVICE_INVALID
- **RESULT_SERVICE_VERSION_UPDATE_\***: RESULT_SERVICE_VERSION_UPDATE_REQUIRED


### Methods (4)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| makeGooglePlayServicesAvailable(callback) | void | android | Attempts to make Google Play services available o… |
| isGooglePlayServicesAvailable(—) | Number | android | Verifies that Google Play services is installed a… |
| isUserResolvableError(—) | Boolean | android | Checks to see if device is configured for Touch I… |
| getErrorString(—) | String | android | Determines if the current device supports Touch I… |


---

## Modules.WebDialog
> Allows a Titanium application to use the Safari Controller (iOS) and Chrome Tabs (Android) to create an embedded browser.
> Extends Ti.Module
> Platforms: both
> Type: module

### Constants (3)
- **DISMISS_BUTTON_STYLE_\***: DISMISS_BUTTON_STYLE_DONE, DISMISS_BUTTON_STYLE_CLOSE, DISMISS_BUTTON_STYLE_CANCEL


### Methods (5)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| isOpen(—) | Boolean | ios | Indicates if the web dialog is open. |
| isSupported(—) | Boolean | both | Indicates if the web dialog is supported. |
| open(params) | void | both | Opens the web dialog with the options provided. |
| close(—) | void | both | Programmatically closes the web dialog. |
| createAuthenticationSession(parameters) | Modules.WebDialog.AuthenticationSession | ios | Creates and returns an instance of <Modules.WebDi… |

### Events (4)
| Event | Platform | Description |
|-------|----------|-------------|
| open | ios | The open event is fired after the web dialog has opened. |
| close | ios | The close event is fired when the web dialog is closed by the user or programma… |
| load | ios | Fired when the initial URL load is complete. |
| redirect | ios | Fired when the browser is redirected to another URL before the first page load … |

---

## Modules.WebDialog.AuthenticationSession
> Authenticate a user with a web service, even if the web service is run by a third party.
> Extends Ti.Proxy
> Platforms: ios

### Properties (unique: 2/4)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| url | String | ios | The initial URL pointing to the authentication we… |
| scheme | String | ios | The custom URL scheme that the app expects in the… |


### Methods (2)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| start(—) | Boolean | ios | Starts the `AuthenticationSession` instance after… |
| cancel(—) | void | ios | Cancel an authentication-session. |

### Events (1)
| Event | Platform | Description |
|-------|----------|-------------|
| callback | ios | The callback which is called when the session is completed successfully or canc… |

---

