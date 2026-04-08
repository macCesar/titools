# Ti.App & Ti.Platform API Reference

## Ti.App
> The top-level App module is mainly used for accessing information about the application at runtime, and for sending or listening for system events.
> Extends Ti.Module
> Platforms: both
> Type: module

### Properties (unique: 21/26)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| accessibilityEnabled | Boolean | both | Indicates whether Accessibility is enabled by the… |
| copyright | String | both | Application copyright statement, determined by `t… |
| currentService | Ti.App.iOS.BackgroundService | ios | A reference to the current background service run… |
| deployType | String | both | Build type that reflects how the application was … |
| description | String | both | Application description, determined by `tiapp.xml… |
| guid | String | both | Application globally-unique ID, determined by `ti… |
| forceSplashAsSnapshot | Boolean | ios | Shows the application's splash screen on app resu… |
| id | String | both | Application ID, from `tiapp.xml`. |
| installId | String | ios | The install ID for this application. |
| idleTimerDisabled | Boolean | ios | Determines whether the screen is locked when the … |
| name | String | both | Application name, determined by `tiapp.xml`. |
| proximityDetection | Boolean | both | Determines whether proximity detection is enabled. |
| proximityState | Boolean | both | Indicates the state of the device's proximity sen… |
| disableNetworkActivityIndicator | Boolean | ios | Prevents network activity indicator from being di… |
| publisher | String | both | Application publisher, from `tiapp.xml`. |
| sessionId | String | both | Unique session identifier for the current continu… |
| url | String | both | Application URL, from `tiapp.xml`. |
| version | String | both | Application version, from `tiapp.xml`. |
| keyboardVisible | Boolean | both | Indicates whether or not the soft keyboard is vis… |
| trackUserInteraction | Boolean | ios | Indicates whether or not the user interaction sho… |
| arguments | launchOptions | ios | The arguments passed to the application on startu… |

### Constants (2)
- **EVENT_ACCESSIBILITY_\***: EVENT_ACCESSIBILITY_ANNOUNCEMENT, EVENT_ACCESSIBILITY_CHANGED


### Methods (2)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| fireSystemEvent(eventName, param) | void | both | Fire a system-level event such as <Titanium.App.E… |
| getArguments(—) | launchOptions | ios | Returns the arguments passed to the application o… |

### Events (15)
| Event | Platform | Description |
|-------|----------|-------------|
| accessibilitychanged | both | Fired by the system when the device's accessibility service is turned on or off. |
| close | both | Fired by the system when the application is about to be terminated. |
| memorywarning | ios | Fired when the app receives a warning from the operating system about low memor… |
| pause | both | Fired when the application transitions from active to inactive state on a multi… |
| paused | both | Fired when the application transitions to the background on a multitasked syste… |
| proximity | both | Fired when the proximity sensor changes state. |
| screenshotcaptured | both | Fired after the user takes a screenshot, e.g. by pressing both the home and loc… |
| uncaughtException | both | Fired when an uncaught JavaScript exception occurs. |
| resume | both | Fired when the application returns to the foreground on a multitasked system. |
| resumed | both | Fired when the application returns to the foreground. |
| started | both | Fired after the "app.js" or "alloy.js" gets executed during application startup. |
| keyboardframechanged | both | Fired when the soft keyboard is presented, on and off the screen. |
| significanttimechange | ios | Fired when there is a significant change in the time. |
| shortcutitemclick | both | Fired when a <Titanium.UI.ShortcutItem> is clicked. |
| userinteraction | both | Called whenever an interaction with the window occurred. To be used together wi… |

---

## Ti.App.Android
> A module used to access Android application resources.
> Extends Ti.Module
> Platforms: android
> Type: module

### Properties (unique: 4/7)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| R | Ti.Android.R | android | The `R` namespace for application resources. |
| appVersionCode | Number | android | The version number of the application. |
| appVersionName | String | android | The version name of the application. |
| launchIntent | Ti.Android.Intent | android | Return the intent that was used to launch the app… |


### Methods (1)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| clearUserCache(—) | void | android | Clears app data and cache. This will close the ap… |

### Events (1)
| Event | Platform | Description |
|-------|----------|-------------|
| shortcutitemclick | android | Fired when a <Titanium.UI.ShortcutItem> is clicked. |

---

## Ti.App.Properties
> The App Properties module is used for storing application-related data in property/value pairs  that persist beyond application sessions and device power cycles.
> Extends Ti.Module
> Platforms: both
> Type: module


### Methods (16)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| getBool(property, default) | Boolean | both | Returns the value of a property as a boolean data… |
| getDouble(property, default) | Number | both | Returns the value of a property as a double (doub… |
| getInt(property, default) | Number | both | Returns the value of a property as an integer dat… |
| getList(property, default) | Array<Object> | both | Returns the value of a property as an array data … |
| getObject(property, default) | Object | both | Returns the value of a property as an object. |
| getString(property, default) | String | both | Returns the value of a property as a string data … |
| hasProperty(property) | Boolean | both | Indicates whether a property exists. |
| listProperties(—) | Array<Object> | both | Returns an array of property names. |
| removeProperty(property) | void | both | Removes a property if it exists, or does nothing … |
| removeAllProperties(—) | void | both | Removes all properties that have been set by the … |
| setBool(property, value) | void | both | Sets the value of a property as a boolean data ty… |
| setDouble(property, value) | void | both | Sets the value of a property as a double (double-… |
| setInt(property, value) | void | both | Sets the value of a property as an integer data t… |
| setList(property, value) | void | both | Sets the value of a property as an array data typ… |
| setObject(property, value) | void | both | Sets the value of a property as an object data ty… |
| setString(property, value) | void | both | Sets the value of a property as a string data typ… |

### Events (1)
| Event | Platform | Description |
|-------|----------|-------------|
| change | ios | Fired when a property is changed. |

---

## Ti.App.iOS
> The top-level App iOS module, available only to iOS devices, that includes the facilities to create and manage local notifications and background services.
> Extends Ti.Module
> Platforms: ios
> Type: module

### Properties (unique: 4/72)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| currentUserNotificationSettings | UserNotificationSettings | ios | Notification types and user notification categori… |
| supportedUserActivityTypes | Array<String> | ios | Provides an Array of the NSUserActivityTypes keys… |
| applicationOpenSettingsURL | String | ios | Returns a URL to open the app's settings. |
| userInterfaceStyle | Number | ios | The style associated with the user interface. |

### Constants (66)
- **BACKGROUNDFETCHINTERVAL_\***: BACKGROUNDFETCHINTERVAL_MIN, BACKGROUNDFETCHINTERVAL_NEVER
- **EVENT_ACCESSIBILITY_LAYOUT_\***: EVENT_ACCESSIBILITY_LAYOUT_CHANGED
- **EVENT_ACCESSIBILITY_SCREEN_\***: EVENT_ACCESSIBILITY_SCREEN_CHANGED
- **USER_INTERFACE_STYLE_\***: USER_INTERFACE_STYLE_UNSPECIFIED, USER_INTERFACE_STYLE_LIGHT, USER_INTERFACE_STYLE_DARK
- **USER_NOTIFICATION_ACTIVATION_MODE_\***: USER_NOTIFICATION_ACTIVATION_MODE_BACKGROUND, USER_NOTIFICATION_ACTIVATION_MODE_FOREGROUND
- **USER_NOTIFICATION_ALERT_STYLE_\***: USER_NOTIFICATION_ALERT_STYLE_NONE, USER_NOTIFICATION_ALERT_STYLE_ALERT, USER_NOTIFICATION_ALERT_STYLE_BANNER
- **USER_NOTIFICATION_AUTHORIZATION_STATUS_\***: USER_NOTIFICATION_AUTHORIZATION_STATUS_AUTHORIZED, USER_NOTIFICATION_AUTHORIZATION_STATUS_DENIED, USER_NOTIFICATION_AUTHORIZATION_STATUS_PROVISIONAL
- **USER_NOTIFICATION_AUTHORIZATION_STATUS_NOT_\***: USER_NOTIFICATION_AUTHORIZATION_STATUS_NOT_DETERMINED
- **USER_NOTIFICATION_BEHAVIOR_\***: USER_NOTIFICATION_BEHAVIOR_DEFAULT, USER_NOTIFICATION_BEHAVIOR_TEXTINPUT
- **USER_NOTIFICATION_CATEGORY_OPTION_\***: USER_NOTIFICATION_CATEGORY_OPTION_NONE
- **USER_NOTIFICATION_CATEGORY_OPTION_ALLOW_IN_\***: USER_NOTIFICATION_CATEGORY_OPTION_ALLOW_IN_CARPLAY
- **USER_NOTIFICATION_CATEGORY_OPTION_CUSTOM_DISMISS_\***: USER_NOTIFICATION_CATEGORY_OPTION_CUSTOM_DISMISS_ACTION
- **USER_NOTIFICATION_CATEGORY_OPTION_HIDDEN_PREVIEWS_SHOW_\***: USER_NOTIFICATION_CATEGORY_OPTION_HIDDEN_PREVIEWS_SHOW_TITLE, USER_NOTIFICATION_CATEGORY_OPTION_HIDDEN_PREVIEWS_SHOW_SUBTITLE
- **USER_NOTIFICATION_SETTING_\***: USER_NOTIFICATION_SETTING_ENABLED, USER_NOTIFICATION_SETTING_DISABLED
- **USER_NOTIFICATION_SETTING_NOT_\***: USER_NOTIFICATION_SETTING_NOT_SUPPORTED
- **USER_NOTIFICATION_TYPE_\***: USER_NOTIFICATION_TYPE_NONE, USER_NOTIFICATION_TYPE_BADGE, USER_NOTIFICATION_TYPE_SOUND, USER_NOTIFICATION_TYPE_ALERT, USER_NOTIFICATION_TYPE_PROVISIONAL
- **USER_NOTIFICATION_TYPE_CRITICAL_\***: USER_NOTIFICATION_TYPE_CRITICAL_ALERT
- **USER_NOTIFICATION_TYPE_PROVIDES_APP_NOTIFICATION_\***: USER_NOTIFICATION_TYPE_PROVIDES_APP_NOTIFICATION_SETTINGS
- **UTTYPE_\***: UTTYPE_TEXT, UTTYPE_RTF, UTTYPE_HTML, UTTYPE_XML, UTTYPE_PDF, UTTYPE_RTFD, UTTYPE_IMAGE, UTTYPE_JPEG, UTTYPE_JPEG2000, UTTYPE_TIFF, UTTYPE_PICT, UTTYPE_GIF, UTTYPE_PNG, UTTYPE_BMP, UTTYPE_ICO, UTTYPE_MOVIE, UTTYPE_VIDEO, UTTYPE_AUDIO, UTTYPE_MPEG, UTTYPE_MPEG4, UTTYPE_MP3
- **UTTYPE_APPLE_\***: UTTYPE_APPLE_ICNS
- **UTTYPE_APPLE_PROTECTED_MPEG4_\***: UTTYPE_APPLE_PROTECTED_MPEG4_AUDIO
- **UTTYPE_FLAT_\***: UTTYPE_FLAT_RTFD
- **UTTYPE_MPEG4_\***: UTTYPE_MPEG4_AUDIO
- **UTTYPE_PLAIN_\***: UTTYPE_PLAIN_TEXT
- **UTTYPE_QUICKTIME_\***: UTTYPE_QUICKTIME_IMAGE, UTTYPE_QUICKTIME_MOVIE
- **UTTYPE_TXN_TEXT_AND_MULTIMEDIA_\***: UTTYPE_TXN_TEXT_AND_MULTIMEDIA_DATA
- **UTTYPE_UTF16_EXTERNAL_PLAIN_\***: UTTYPE_UTF16_EXTERNAL_PLAIN_TEXT
- **UTTYPE_UTF16_PLAIN_\***: UTTYPE_UTF16_PLAIN_TEXT
- **UTTYPE_UTF8_PLAIN_\***: UTTYPE_UTF8_PLAIN_TEXT
- **UTTYPE_WEB_\***: UTTYPE_WEB_ARCHIVE


### Methods (11)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| createUserDefaults(parameters) | Ti.App.iOS.UserDefaults | ios | Creates and returns an instance of Titanium.App.i… |
| cancelAllLocalNotifications(—) | void | ios | Cancels all scheduled local notifications. |
| cancelLocalNotification(id) | void | ios | Cancels a local notification. |
| registerBackgroundService(params) | Ti.App.iOS.BackgroundService | ios | Registers a service to run when the application i… |
| registerUserNotificationSettings(params) | void | ios | Registers the application to use the requested no… |
| scheduleLocalNotification(params) | Ti.App.iOS.LocalNotification | ios | Schedule a local notification. |
| setMinimumBackgroundFetchInterval(fetchInterval) | void | ios | Specifies the minimum amount of time that must el… |
| endBackgroundHandler(handlerID) | void | ios | Marks the end of the app execution after initiati… |
| sendWatchExtensionReply(handlerId, userInfo) | void | ios | Marks the end of an `openParentApplication:reply`… |
| createUserNotificationAction(parameters) | Ti.App.iOS.UserNotificationAction | ios | Creates and returns an instance of <Titanium.App.… |
| createUserNotificationCategory(parameters) | Ti.App.iOS.UserNotificationCategory | ios | Creates and returns an instance of <Titanium.App.… |

### Events (18)
| Event | Platform | Description |
|-------|----------|-------------|
| notification | ios | Fired when a local notification is received by the application. |
| localnotificationaction | ios | Fired when a user selects an action for an interactive local notification. |
| remotenotificationaction | ios | Fired when a user selects an action for an interactive remote notification. |
| backgroundfetch | ios | Fired when the application is woken up for a fetch operation. Available only on… |
| silentpush | ios | Fired when the application is woken up by a silent remote notification. Availab… |
| backgroundtransfer | ios | Fired when the events related to a [urlSession](Modules.URLSession) are waiting… |
| downloadprogress | ios | Fired periodically to inform the app about the download's progress of a [urlSes… |
| uploadprogress | ios | Fired periodically to inform the app about the upload's progress of a [urlSessi… |
| downloadcompleted | ios | Fired to indicate that a [urlSession's](Modules.URLSession) download task has f… |
| sessioncompleted | ios | Fired to indicate that a [urlSession](Modules.URLSession) task finished transfe… |
| sessioneventscompleted | ios | Fired to indicate that all messages enqueued for a [urlSession](Modules.URLSess… |
| usernotificationsettings | ios | Fired when the user notification settings are registered. |
| watchkitextensionrequest | ios | Fired when openParentApplication:reply is called from a WatchKit extension. Ava… |
| continueactivity | ios | Fired when iOS continueactivity calls `continueUserActivity`. |
| shortcutitemclick | ios | Fired when a user taps the Application Shortcut. |
| handleurl | ios | Fired when a new URL is handled by the application. |
| traitcollectionchange | ios | Fired when the trait collection of the device changes, e.g. the user interface … |
| screenshotcaptured | ios | Fired after the user takes a screenshot, e.g. by pressing both the home and loc… |

---

## Ti.App.iOS.BackgroundService
> A service that runs when the application is placed in the background.
> Extends Ti.Proxy
> Platforms: ios

### Properties (unique: 1/3)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| url | String | ios | A local URL to a JavaScript file containing the c… |


### Methods (2)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| stop(—) | void | ios | Stops the service from running during the current… |
| unregister(—) | void | ios | Unregisters the background service. |


---

## Ti.App.iOS.LocalNotification
> A local notification to alert the user of new or pending application information.
> Extends Ti.Proxy
> Platforms: ios


### Methods (1)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| cancel(—) | void | ios | Cancels the pending notification. |


---

## Ti.App.iOS.SearchQuery
> A search query object manages the criteria to apply when searching app content that you have previously  indexed by using the Core Spotlight APIs.
> Extends Ti.Proxy
> Platforms: ios

### Properties (unique: 2/4)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| queryString | String | ios | A formatted string that defines the matching crit… |
| attributes | Array<String> | ios | An array of strings that represent the attributes… |


### Methods (3)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| start(—) | void | ios | Asynchronously queries the index for items that m… |
| cancel(—) | void | ios | Cancels a query operation. |
| isCancelled(—) | Boolean | ios | A Boolean value that indicates if the query has b… |

### Events (2)
| Event | Platform | Description |
|-------|----------|-------------|
| founditems | ios | Fired when the query finds a new batch of matching items. |
| completed | ios | Fired when the query completes to inform you about it's success. To receive ite… |

---

## Ti.App.iOS.SearchableIndex
> The SearchableIndex module is used to add or remove Ti.App.iOS.SearchableItem objects from the device search index.
> Extends Ti.Proxy
> Platforms: ios


### Methods (5)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| isSupported(—) | Boolean | ios | Indicates whether indexing is supported by the de… |
| addToDefaultSearchableIndex(Array, callback) | void | ios | Adds an array of Titanium.App.iOS.SearchableItem … |
| deleteAllSearchableItems(callback) | void | ios | Removes all search items added by the application. |
| deleteAllSearchableItemByDomainIdentifiers(Array, callback) | void | ios | Removes search items based on an array of domain … |
| deleteSearchableItemsByIdentifiers(Array, callback) | void | ios | Removes search items based on an array of identif… |


---

## Ti.App.iOS.SearchableItem
> Used to create a unique object containing all of the search information that will appear in the device search index.
> Extends Ti.Proxy
> Platforms: ios

### Properties (unique: 4/6)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| attributeSet | Ti.App.iOS.SearchableItemAttributeSet | ios | Set of metadata properties to display for the ite… |
| domainIdentifier | String | ios | Identifier that represents the "domain" or owner … |
| expirationDate | String | ios | Searchable items have an expiration date or time … |
| uniqueIdentifier | String | ios | Unique identifier to your application group. |




---

## Ti.App.iOS.SearchableItemAttributeSet
> The SearchableItemAttributeSet module defines metadata properties for SearchItem and UserActivity objects.
> Extends Ti.Proxy
> Platforms: ios

### Properties (unique: 94/96)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| itemContentType | String | ios | Content type of the attribute set. |
| displayName | String | ios | A localized string to be displayed in the UI for … |
| alternateNames | Array<String> | ios | An array of localized strings of alternate displa… |
| path | String | ios | The complete path to the item. |
| contentURL | String | ios | File URL representing the content to be indexed. |
| thumbnailURL | String | ios | File URL pointing to a thumbnail image for this i… |
| thumbnailData | String \| Ti.Blob | ios | Image data for thumbnail for this item. |
| relatedUniqueIdentifier | String | ios | For activities this is the unique identifier for … |
| metadataModificationDate | String | ios | The date that the last metadata attribute was cha… |
| contentType | String | ios | UTI Type pedigree for an item. |
| contentTypeTree | Array<String> | ios | Array of strings related to the content tree of t… |
| keywords | Array<String> | ios | Represents keywords associated with this particul… |
| title | String | ios | The title of the particular item. |
| subject | String | ios | Subject of the the item. |
| theme | String | ios | Theme of the the item. |
| contentDescription | String | ios | An account of the content of the resource. |
| identifier | String | ios | Used to reference to the resource within a given … |
| audiences | Array<String> | ios | A class of entity for whom the resource is intend… |
| fileSize | Number | ios | Size of the document in MB. |
| pageCount | Number | ios | Number of pages in the item. |
| pageWidth | Number | ios | Width in points (72 points per inch) of the docum… |
| pageHeight | Number | ios | Height in points (72 points per inch) of the docu… |
| securityMethod | String | ios | Security (encryption) method used in the file. |
| creator | String | ios | Application used to create the document content (… |
| encodingApplications | Array<String> | ios | Software used to convert the original content int… |
| kind | String | ios | Kind that the item represents. |
| fontNames | Array<String> | ios | Array of font names used in the item. |
| audioSampleRate | Number | ios | The sample rate of the audio data contained in th… |
| audioChannelCount | Number | ios | The number of channels in the audio data containe… |
| tempo | Number | ios | The tempo of the music contained in the audio fil… |
| keySignature | String | ios | The musical key of the song/composition contained… |
| timeSignature | String | ios | The time signature of the musical composition con… |
| audioEncodingApplication | String | ios | The name of the application that encoded the data… |
| composer | String | ios | The composer of the song/composition contained in… |
| lyricist | String | ios | The lyricist/text writer for song/composition con… |
| album | String | ios | The title for a collection of media. |
| artist | String | ios | The artist for the media. |
| audioTrackNumber | Number | ios | The track number of a song/composition when it is… |
| recordingDate | String | ios | The recording date of the song/composition. |
| musicalGenre | String | ios | The musical genre of the song/composition contain… |
| generalMIDISequence | Number | ios | Used to indicates whether the MIDI sequence conta… |
| musicalInstrumentCategory | String | ios | Metadata attribute that stores the category of in… |
| musicalInstrumentName | String | ios | Metadata attribute that stores the name of instru… |
| supportsPhoneCall | Number | ios | Used to indicate that using the phone number is a… |
| supportsNavigation | Number | ios | Used to determine if navigation is supported. |
| containerTitle | String | ios | Title displayed in the search container |
| containerDisplayName | String | ios | Display of the search container |
| containerIdentifier | String | ios | Identifier for the search container |
| containerOrder | Number | ios | Order the search container is displayed. |
| editors | Array<String> | ios | The list of editor/editors that have worked on th… |
| participants | Array<String> | ios | The list of people who are visible in an image or… |
| projects | Array<String> | ios | The list of projects that this item is part of. |
| downloadedDate | String | ios | The date that the file was last downloaded / rece… |
| lastUsedDate | String | ios | The date that the item was last used. |
| contentCreationDate | String | ios | The date that the contents of the item were creat… |
| contentModificationDate | String | ios | The date that the contents of the item were last … |
| addedDate | String | ios | The date that the item was moved into the current… |
| contentSources | Array<String> | ios | Used to indicate where the item was obtained from. |
| comment | String | ios | Comment related to a file. |
| copyright | String | ios | Copyright of the content. |
| duration | Number | ios | Duration in seconds of the content of the item (i… |
| contactKeywords | Array<String> | ios | A list of contacts that are somehow associated wi… |
| codecs | Array<String> | ios | The codecs used to encode/decode the media. |
| organizations | Array<String> | ios | Used to indicate company/Organization that create… |
| mediaTypes | Array<String> | ios | Media types present in the content. |
| version | String | ios | A version specifier for this item. |
| role | String | ios | Used to indicate the role of the document creator. |
| streamable | Number | ios | Whether the content is prepared for streaming. Se… |
| totalBitRate | Number | ios | The total bit rate (audio and video combined) of … |
| videoBitRate | Number | ios | The video bit rate. |
| audioBitRate | Number | ios | The audio bit rate. |
| deliveryType | Number | ios | The delivery type of the item. Set to `0` for fas… |
| languages | Array<String> | ios | Used to designate the languages of the intellectu… |
| rights | Array<String> | ios | Used to provide a link to information about right… |
| publishers | Array<String> | ios | Used to designate the entity responsible for maki… |
| contributors | Array<String> | ios | Used to designate the entity responsible for maki… |
| coverage | Array<String> | ios | Used to designate the extent or scope of the cont… |
| rating | Number | ios | User rating of this item out of 5 stars. |
| ratingDescription | String | ios | A description of the rating, for example, the num… |
| playCount | Number | ios | User play count of this item. |
| information | String | ios | Information about the item. |
| director | String | ios | Director of the item, for example, the movie dire… |
| producer | String | ios | Producer of the content. |
| genre | String | ios | Genre of the item, for example, movie genre. |
| performers | Array<String> | ios | Performers in the movie. |
| originalFormat | String | ios | Original format of the movie. |
| originalSource | String | ios | Original source of the movie. |
| local | Number | ios | Whether or not the item is local. Set to `1` if t… |
| contentRating | Number | ios | Whether or not the item has explicit content. Set… |
| url | String | ios | URL of the item. |
| fullyFormattedAddress | String | ios | The fully formatted address of the item (obtained… |
| subThoroughfare | String | ios | The sub-location (e.g., street number) for the it… |
| thoroughfare | String | ios | The location (e.g., street name) for the item acc… |
| postalCode | String | ios | The postal code for the item according to guideli… |




---

## Ti.App.iOS.UserActivity
> The UserActivity module is used to enable device Handoff and to create User Activities.
> Extends Ti.Proxy
> Platforms: ios

### Properties (unique: 14/16)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| activityType | String | ios | Name of the activity type. |
| eligibleForPublicIndexing | Boolean | ios | Set to `true` if the user activity can be publicl… |
| eligibleForSearch | Boolean | ios | Set to true if the user activity should be added … |
| eligibleForHandoff | Boolean | ios | Set to true if this user activity should be eligi… |
| eligibleForPrediction | Boolean | ios | A Boolean value that determines whether Siri can … |
| persistentIdentifier | String | ios | A value used to identify the user activity. |
| expirationDate | String | ios | Absolute date after which the activity is no long… |
| keywords | Array<String> | ios | An array of string keywords representing words or… |
| needsSave | Boolean | ios | Set to true every time you have updated the user … |
| requiredUserInfoKeys | Array<String> | ios | An array of String keys from the userInfo propert… |
| supported | Boolean | ios | Determines if user activities are supported (`tru… |
| title | String | ios | An optional, user-visible title for this activity… |
| userInfo | Dictionary | ios | The userInfo dictionary contains application-spec… |
| webpageURL | String | ios | When no suitable application is installed on a re… |


### Methods (7)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| addContentAttributeSet(contentAttributeSet) | void | ios | Adds a Titanium.App.iOS.SearchableItemAttributeSe… |
| becomeCurrent(—) | void | ios | Marks the activity as currently in use by the use… |
| invalidate(—) | void | ios | Invalidates an activity when it is no longer elig… |
| resignCurrent(—) | void | ios | Marks the activity as currently **not** in use an… |
| isSupported(—) | Boolean | ios | Determines if user activities are supported (`tru… |
| deleteSavedUserActivitiesForPersistentIdentifiers(persistentIdentifiers) | void | ios | Deletes user activities created by your app that … |
| deleteAllSavedUserActivities(—) | void | ios | Deletes all user activities created by your app. |

### Events (3)
| Event | Platform | Description |
|-------|----------|-------------|
| useractivitywillsave | ios | Fired if the activity context needs to be saved before being continued on anoth… |
| useractivitywascontinued | ios | Fired when the user activity was continued on another device. |
| useractivitydeleted | ios | Fired when the user activity get deleted using the <Titanium.App.iOS.UserActivi… |

---

## Ti.App.iOS.UserDefaults
> The UserDefaults module is used for storing application-related data in property/value pairs  that persist beyond application sessions and device power cycles. UserDefaults allows the suiteName of the UserDefaults to be specified at creation time.  **Important**: Using this API requires the `NSPrivacyAccessedAPICategoryUserDefaults` property set in the privacy manifest that was introduced in iOS 17. You can learn more about it [here](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_use_of_required_reason_api).
> Extends Ti.App.Properties
> Platforms: ios
> Type: module

### Properties (unique: 1/3)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| suiteName | String | ios | Sets the name of the suite to be used to access U… |




---

## Ti.App.iOS.UserNotificationAction
> An action the user selects in response to an interactive notification.
> Extends Ti.Proxy
> Platforms: ios

### Properties (unique: 6/7)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| activationMode | Number | ios | Selects how to activate the application. |
| behavior | Number | ios | Custom behavior the user notification supports. |
| authenticationRequired | Boolean | ios | Set to true if the action requires the device to … |
| destructive | Boolean | ios | Set to true if the action causes destructive beha… |
| identifier | String | ios | Identifier for this action. Used to identify the … |
| title | String | ios | Title of the button displayed in the notification. |




---

## Ti.App.iOS.UserNotificationCategory
> A set of notification actions to associate with a notification.
> Extends Ti.Proxy
> Platforms: ios

### Properties (unique: 7/8)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| actionsForDefaultContext | Array<Titanium.App.iOS.UserNotificationAction> | ios | Array of notification actions to associate with t… |
| actionsForMinimalContext | Array<Titanium.App.iOS.UserNotificationAction> | ios | Array of notification actions to display for non-… |
| categorySummaryFormat | String | ios | A format string for the summary description used … |
| identifier | String | ios | Identifier for this category. |
| intentIdentifiers | Array<String> | ios | The intents related to notifications of this cate… |
| hiddenPreviewsBodyPlaceholder | String | ios | The placeholder text to display when notification… |
| options | Array<Number> | ios | Options for how to handle notifications of this t… |




---

## Ti.App.iOS.UserNotificationCenter
> The top-level App iOS Notification Center module. It is used to control scheduled notifications and receive details about the system-wide notification settings.
> Extends Ti.Module
> Platforms: ios
> Type: module


### Methods (5)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| getPendingNotifications(callback) | void | ios | Fetches the pending notifications asynchronously. |
| getDeliveredNotifications(callback) | void | ios | Fetches the delivered notifications asynchronousl… |
| removePendingNotifications(notifications) | void | ios | Removes the specified pending notifications to pr… |
| removeDeliveredNotifications(notifications) | void | ios | Removes the specified delivered notifications fro… |
| requestUserNotificationSettings(callback) | void | ios | Notification types and user notification categori… |


---

## Ti.Platform
> The top-level Platform module.  The Platform module is used to access the device's platform-related functionality.
> Extends Ti.Module
> Platforms: both
> Type: module

### Properties (unique: 29/36)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| address | String | both | System's WIFI IP address. No other network types … |
| architecture | String | both | System's processor architecture. |
| availableMemory | Number | both | System's unused memory, measured in bytes. |
| batteryLevel | Number | both | Battery level in percent, accessible only when `b… |
| batteryMonitoring | Boolean | both | Determines whether battery monitoring is enabled. |
| batteryState | Number | both | Indicates the state of the battery. Accessible on… |
| displayCaps | Ti.Platform.DisplayCaps | both | Returns the DisplayCaps object. |
| id | String | both | Applications's globally-unique ID (UUID). |
| identifierForVendor | String | ios | An alphanumeric string that uniquely identifies a… |
| identifierForAdvertising | String | ios | An alphanumeric string unique to each device, use… |
| isAdvertisingTrackingEnabled | Boolean | ios | A Boolean value that indicates whether the user h… |
| isTranslatedBinaryOnAppleSilicon | Boolean | ios | A Boolean value that indicates whether the curren… |
| locale | String | both | System's default language. |
| macaddress | String | both | System's network interface mac address, or app UU… |
| manufacturer | String | both | Manufacturer of the device. |
| model | String | both | Model of the device. |
| name | String | both | Name of the platform. Returns `android` for the A… |
| netmask | String | both | System's WIFI network mask. No other network type… |
| osname | String | both | Short name of the system's Operating System. Retu… |
| ostype | String | both | Operating System architecture. On Android, this i… |
| processorCount | Number | both | Number of logical processing cores. |
| runtime | String | both | Short name of the JavaScript runtime in use. |
| totalMemory | Number | both | System's total memory, measured in bytes. |
| uptime | Number | both | System uptime since last boot in seconds. |
| username | String | both | System name, if set. On iOS, this can be found in… |
| version | String | both | The operating system's version string. |
| versionMajor | Number | both | The operating system's major version number. |
| versionMinor | Number | both | The operating system's minor version number. |
| versionPatch | Number | both | The operating system's patch version number. |

### Constants (4)
- **BATTERY_STATE_\***: BATTERY_STATE_CHARGING, BATTERY_STATE_FULL, BATTERY_STATE_UNKNOWN, BATTERY_STATE_UNPLUGGED


### Methods (5)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| canOpenURL(url) | Boolean | both | Returns whether the system is configured with a d… |
| cpus(—) | Array<CPU> | android | Returns an array of basic CPU information for all… |
| createUUID(—) | String | both | Creates a globally-unique identifier. |
| openURL(url, options, callback) | Boolean | both | Opens this URL using the system's default applica… |
| is24HourTimeFormat(—) | Boolean | both | Returns whether the system settings are configure… |

### Events (1)
| Event | Platform | Description |
|-------|----------|-------------|
| battery | both | Fired when the battery state changes. This is measured in 5% increments on iPho… |

---

## Ti.Platform.Android
> The Android-specific Platform module, used to access the device's platform-related functionality.
> Extends Ti.Module
> Platforms: android
> Type: module

### Properties (unique: 1/10)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| physicalSizeCategory | Number | android | The physical size category of the Android device … |

### Constants (6)
- **API_\***: API_LEVEL
- **PHYSICAL_SIZE_CATEGORY_\***: PHYSICAL_SIZE_CATEGORY_LARGE, PHYSICAL_SIZE_CATEGORY_NORMAL, PHYSICAL_SIZE_CATEGORY_SMALL, PHYSICAL_SIZE_CATEGORY_UNDEFINED, PHYSICAL_SIZE_CATEGORY_XLARGE




---

## Ti.Platform.DisplayCaps
> The Display Caps object returned by the <Titanium.Platform.displayCaps> property.
> Extends Ti.Proxy
> Platforms: both

### Properties (unique: 7/10)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| density | String | both | Logical density of the display. |
| dpi | Number | both | Display density expressed as dots-per-inch. |
| logicalDensityFactor | Number | both | Logical density of the display, as a scaling fact… |
| platformHeight | Number | both | Absolute height of the display in relation to UI … |
| platformWidth | Number | both | Absolute width of the display in relation to UI o… |
| xdpi | Number | android | Physical pixels per inch of the display in the X … |
| ydpi | Number | android | Physical pixels per inch of the display in the Y … |




---

