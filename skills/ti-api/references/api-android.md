# Ti.Android API Reference

## Ti.Android
> The top-level Android module.
> Extends Ti.Module
> Platforms: android
> Type: module

### Properties (unique: 4/240)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| R | Ti.Android.R | android | Accessor for Android system resources. |
| currentActivity | Ti.Android.Activity | android | References the top-most window's activity. |
| currentService | Ti.Android.Service | android | Service in the active context. |
| rootActivity | Ti.Android.Activity | android | The first activity launched by the application. |

### Constants (233)
- **ACTION_\***: ACTION_ANSWER, ACTION_CALL, ACTION_CHOOSER, ACTION_DEFAULT, ACTION_DELETE, ACTION_DIAL, ACTION_EDIT, ACTION_INSERT, ACTION_MAIN, ACTION_PICK, ACTION_REBOOT, ACTION_RUN, ACTION_SEARCH, ACTION_SEND, ACTION_SENDTO, ACTION_SHUTDOWN, ACTION_SYNC, ACTION_VIEW
- **ACTION_AIRPLANE_MODE_\***: ACTION_AIRPLANE_MODE_CHANGED
- **ACTION_ALL_\***: ACTION_ALL_APPS
- **ACTION_ATTACH_\***: ACTION_ATTACH_DATA
- **ACTION_BATTERY_\***: ACTION_BATTERY_CHANGED, ACTION_BATTERY_LOW, ACTION_BATTERY_OKAY
- **ACTION_BOOT_\***: ACTION_BOOT_COMPLETED
- **ACTION_BUG_\***: ACTION_BUG_REPORT
- **ACTION_CALL_\***: ACTION_CALL_BUTTON
- **ACTION_CAMERA_\***: ACTION_CAMERA_BUTTON
- **ACTION_CLOSE_SYSTEM_\***: ACTION_CLOSE_SYSTEM_DIALOGS
- **ACTION_CONFIGURATION_\***: ACTION_CONFIGURATION_CHANGED
- **ACTION_CREATE_\***: ACTION_CREATE_SHORTCUT
- **ACTION_DATE_\***: ACTION_DATE_CHANGED
- **ACTION_DEVICE_STORAGE_\***: ACTION_DEVICE_STORAGE_LOW
- **ACTION_GET_\***: ACTION_GET_CONTENT
- **ACTION_GTALK_SERVICE_\***: ACTION_GTALK_SERVICE_CONNECTED, ACTION_GTALK_SERVICE_DISCONNECTED
- **ACTION_HEADSET_\***: ACTION_HEADSET_PLUG
- **ACTION_INPUT_METHOD_\***: ACTION_INPUT_METHOD_CHANGED
- **ACTION_INSERT_OR_\***: ACTION_INSERT_OR_EDIT
- **ACTION_MANAGE_PACKAGE_\***: ACTION_MANAGE_PACKAGE_STORAGE
- **ACTION_MEDIA_\***: ACTION_MEDIA_BUTTON, ACTION_MEDIA_CHECKING, ACTION_MEDIA_EJECT, ACTION_MEDIA_MOUNTED, ACTION_MEDIA_NOFS, ACTION_MEDIA_REMOVED, ACTION_MEDIA_SHARED, ACTION_MEDIA_UNMOUNTABLE, ACTION_MEDIA_UNMOUNTED
- **ACTION_MEDIA_BAD_\***: ACTION_MEDIA_BAD_REMOVAL
- **ACTION_MEDIA_SCANNER_\***: ACTION_MEDIA_SCANNER_FINISHED, ACTION_MEDIA_SCANNER_STARTED
- **ACTION_MEDIA_SCANNER_SCAN_\***: ACTION_MEDIA_SCANNER_SCAN_FILE
- **ACTION_NEW_OUTGOING_\***: ACTION_NEW_OUTGOING_CALL
- **ACTION_PACKAGE_\***: ACTION_PACKAGE_ADDED, ACTION_PACKAGE_CHANGED, ACTION_PACKAGE_REMOVED, ACTION_PACKAGE_REPLACED, ACTION_PACKAGE_RESTARTED
- **ACTION_PACKAGE_DATA_\***: ACTION_PACKAGE_DATA_CLEARED
- **ACTION_PICK_\***: ACTION_PICK_ACTIVITY
- **ACTION_POWER_\***: ACTION_POWER_CONNECTED, ACTION_POWER_DISCONNECTED
- **ACTION_POWER_USAGE_\***: ACTION_POWER_USAGE_SUMMARY
- **ACTION_PROVIDER_\***: ACTION_PROVIDER_CHANGED
- **ACTION_SCREEN_\***: ACTION_SCREEN_OFF, ACTION_SCREEN_ON
- **ACTION_SEARCH_LONG_\***: ACTION_SEARCH_LONG_PRESS
- **ACTION_SEND_\***: ACTION_SEND_MULTIPLE
- **ACTION_SET_\***: ACTION_SET_WALLPAPER
- **ACTION_SYSTEM_\***: ACTION_SYSTEM_TUTORIAL
- **ACTION_TIME_\***: ACTION_TIME_CHANGED, ACTION_TIME_TICK
- **ACTION_UID_\***: ACTION_UID_REMOVED
- **ACTION_USER_\***: ACTION_USER_PRESENT
- **ACTION_VOICE_\***: ACTION_VOICE_COMMAND
- **ACTION_WALLPAPER_\***: ACTION_WALLPAPER_CHANGED
- **ACTION_WEB_\***: ACTION_WEB_SEARCH
- **CATEGORY_\***: CATEGORY_ALTERNATIVE, CATEGORY_BROWSABLE, CATEGORY_DEFAULT, CATEGORY_EMBED, CATEGORY_HOME, CATEGORY_INFO, CATEGORY_LAUNCHER, CATEGORY_MONKEY, CATEGORY_OPENABLE, CATEGORY_PREFERENCE, CATEGORY_TAB, CATEGORY_TEST, CATEGORY_ALARM, CATEGORY_CALL, CATEGORY_EMAIL, CATEGORY_ERROR, CATEGORY_EVENT, CATEGORY_MESSAGE, CATEGORY_PROGRESS, CATEGORY_PROMO, CATEGORY_RECOMMENDATION, CATEGORY_SERVICE, CATEGORY_SOCIAL, CATEGORY_STATUS, CATEGORY_TRANSPORT
- **CATEGORY_DEVELOPMENT_\***: CATEGORY_DEVELOPMENT_PREFERENCE
- **CATEGORY_FRAMEWORK_INSTRUMENTATION_\***: CATEGORY_FRAMEWORK_INSTRUMENTATION_TEST
- **CATEGORY_SAMPLE_\***: CATEGORY_SAMPLE_CODE
- **CATEGORY_SELECTED_\***: CATEGORY_SELECTED_ALTERNATIVE
- **CATEGORY_UNIT_\***: CATEGORY_UNIT_TEST
- **DEFAULT_\***: DEFAULT_ALL, DEFAULT_LIGHTS, DEFAULT_SOUND, DEFAULT_VIBRATE
- **EXTRA_\***: EXTRA_BCC, EXTRA_CC, EXTRA_EMAIL, EXTRA_INTENT, EXTRA_REPLACING, EXTRA_STREAM, EXTRA_SUBJECT, EXTRA_TEMPLATE, EXTRA_TEXT, EXTRA_TITLE, EXTRA_UID
- **EXTRA_ALARM_\***: EXTRA_ALARM_COUNT
- **EXTRA_DATA_\***: EXTRA_DATA_REMOVED
- **EXTRA_DONT_KILL_\***: EXTRA_DONT_KILL_APP
- **EXTRA_KEY_\***: EXTRA_KEY_EVENT
- **EXTRA_PHONE_\***: EXTRA_PHONE_NUMBER
- **EXTRA_SHORTCUT_\***: EXTRA_SHORTCUT_ICON, EXTRA_SHORTCUT_INTENT, EXTRA_SHORTCUT_NAME
- **EXTRA_SHORTCUT_ICON_\***: EXTRA_SHORTCUT_ICON_RESOURCE
- **FILL_IN_\***: FILL_IN_ACTION, FILL_IN_CATEGORIES, FILL_IN_COMPONENT, FILL_IN_DATA, FILL_IN_PACKAGE
- **FLAG_\***: FLAG_IMMUTABLE, FLAG_MUTABLE, FLAG_INSISTENT
- **FLAG_ACTIVITY_BROUGHT_TO_\***: FLAG_ACTIVITY_BROUGHT_TO_FRONT
- **FLAG_ACTIVITY_CLEAR_\***: FLAG_ACTIVITY_CLEAR_TOP
- **FLAG_ACTIVITY_CLEAR_WHEN_TASK_\***: FLAG_ACTIVITY_CLEAR_WHEN_TASK_RESET
- **FLAG_ACTIVITY_EXCLUDE_FROM_\***: FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS
- **FLAG_ACTIVITY_FORWARD_\***: FLAG_ACTIVITY_FORWARD_RESULT
- **FLAG_ACTIVITY_LAUNCHED_FROM_\***: FLAG_ACTIVITY_LAUNCHED_FROM_HISTORY
- **FLAG_ACTIVITY_MULTIPLE_\***: FLAG_ACTIVITY_MULTIPLE_TASK
- **FLAG_ACTIVITY_NEW_\***: FLAG_ACTIVITY_NEW_TASK
- **FLAG_ACTIVITY_NO_\***: FLAG_ACTIVITY_NO_ANIMATION, FLAG_ACTIVITY_NO_HISTORY
- **FLAG_ACTIVITY_NO_USER_\***: FLAG_ACTIVITY_NO_USER_ACTION
- **FLAG_ACTIVITY_PREVIOUS_IS_\***: FLAG_ACTIVITY_PREVIOUS_IS_TOP
- **FLAG_ACTIVITY_REORDER_TO_\***: FLAG_ACTIVITY_REORDER_TO_FRONT
- **FLAG_ACTIVITY_RESET_TASK_IF_\***: FLAG_ACTIVITY_RESET_TASK_IF_NEEDED
- **FLAG_ACTIVITY_SINGLE_\***: FLAG_ACTIVITY_SINGLE_TOP
- **FLAG_AUTO_\***: FLAG_AUTO_CANCEL
- **FLAG_CANCEL_\***: FLAG_CANCEL_CURRENT
- **FLAG_DEBUG_LOG_\***: FLAG_DEBUG_LOG_RESOLUTION
- **FLAG_FROM_\***: FLAG_FROM_BACKGROUND
- **FLAG_GRANT_READ_URI_\***: FLAG_GRANT_READ_URI_PERMISSION
- **FLAG_GRANT_WRITE_URI_\***: FLAG_GRANT_WRITE_URI_PERMISSION
- **FLAG_NO_\***: FLAG_NO_CREATE, FLAG_NO_CLEAR
- **FLAG_ONE_\***: FLAG_ONE_SHOT
- **FLAG_ONGOING_\***: FLAG_ONGOING_EVENT
- **FLAG_ONLY_ALERT_\***: FLAG_ONLY_ALERT_ONCE
- **FLAG_RECEIVER_REGISTERED_\***: FLAG_RECEIVER_REGISTERED_ONLY
- **FLAG_SHOW_\***: FLAG_SHOW_LIGHTS
- **FLAG_UPDATE_\***: FLAG_UPDATE_CURRENT
- **FOREGROUND_SERVICE_TYPE_\***: FOREGROUND_SERVICE_TYPE_MANIFEST, FOREGROUND_SERVICE_TYPE_NONE, FOREGROUND_SERVICE_TYPE_LOCATION, FOREGROUND_SERVICE_TYPE_MICROPHONE, FOREGROUND_SERVICE_TYPE_CAMERA
- **FOREGROUND_SERVICE_TYPE_CONNECTED_\***: FOREGROUND_SERVICE_TYPE_CONNECTED_DEVICE
- **FOREGROUND_SERVICE_TYPE_MEDIA_\***: FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK, FOREGROUND_SERVICE_TYPE_MEDIA_PROJECTION
- **FOREGROUND_SERVICE_TYPE_PHONE_\***: FOREGROUND_SERVICE_TYPE_PHONE_CALL
- **IMPORTANCE_\***: IMPORTANCE_DEFAULT, IMPORTANCE_HIGH, IMPORTANCE_LOW, IMPORTANCE_MAX, IMPORTANCE_MIN, IMPORTANCE_NONE, IMPORTANCE_UNSPECIFIED
- **NAVIGATION_MODE_\***: NAVIGATION_MODE_STANDARD, NAVIGATION_MODE_TABS
- **PENDING_INTENT_FOR_\***: PENDING_INTENT_FOR_ACTIVITY, PENDING_INTENT_FOR_BROADCAST, PENDING_INTENT_FOR_SERVICE
- **PENDING_INTENT_MAX_\***: PENDING_INTENT_MAX_VALUE
- **PRIORITY_\***: PRIORITY_MAX, PRIORITY_HIGH, PRIORITY_DEFAULT, PRIORITY_LOW, PRIORITY_MIN
- **RESULT_\***: RESULT_CANCELED, RESULT_OK
- **RESULT_FIRST_\***: RESULT_FIRST_USER
- **SCREEN_ORIENTATION_\***: SCREEN_ORIENTATION_BEHIND, SCREEN_ORIENTATION_LANDSCAPE, SCREEN_ORIENTATION_NOSENSOR, SCREEN_ORIENTATION_PORTRAIT, SCREEN_ORIENTATION_SENSOR, SCREEN_ORIENTATION_UNSPECIFIED, SCREEN_ORIENTATION_USER
- **SHOW_AS_ACTION_\***: SHOW_AS_ACTION_ALWAYS, SHOW_AS_ACTION_NEVER
- **SHOW_AS_ACTION_COLLAPSE_ACTION_\***: SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW
- **SHOW_AS_ACTION_IF_\***: SHOW_AS_ACTION_IF_ROOM
- **SHOW_AS_ACTION_WITH_\***: SHOW_AS_ACTION_WITH_TEXT
- **START_NOT_\***: START_NOT_STICKY
- **START_REDELIVER_\***: START_REDELIVER_INTENT
- **STREAM_\***: STREAM_ALARM, STREAM_DEFAULT, STREAM_MUSIC, STREAM_NOTIFICATION, STREAM_RING, STREAM_SYSTEM
- **STREAM_VOICE_\***: STREAM_VOICE_CALL
- **TILE_STATE_\***: TILE_STATE_UNAVAILABLE, TILE_STATE_INACTIVE, TILE_STATE_ACTIVE
- **URI_INTENT_\***: URI_INTENT_SCHEME
- **VISIBILITY_\***: VISIBILITY_PRIVATE, VISIBILITY_PUBLIC, VISIBILITY_SECRET
- **WAKE_LOCK_\***: WAKE_LOCK_PARTIAL, WAKE_LOCK_FULL
- **WAKE_LOCK_ACQUIRE_CAUSES_\***: WAKE_LOCK_ACQUIRE_CAUSES_WAKEUP
- **WAKE_LOCK_ON_AFTER_\***: WAKE_LOCK_ON_AFTER_RELEASE
- **WAKE_LOCK_SCREEN_\***: WAKE_LOCK_SCREEN_DIM, WAKE_LOCK_SCREEN_BRIGHT


### Methods (20)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| createIntentChooser(intent, title) | Ti.Android.Intent | android | Creates an activity chooser intent, used to allow… |
| createPendingIntent(parameters) | Ti.Android.PendingIntent | android | Creates a [PendingIntent](Titanium.Android.Pendin… |
| createService(intent) | Ti.Android.Service | android | Create a <Titanium.Android.Service> so you can st… |
| createServiceIntent(options) | Ti.Android.Intent | android | Create an `Intent` to be used to start a service. |
| hasPermission(permission) | Boolean | android | Returns `true` if the app has permission access. |
| requestPermissions(permissions, callback) | Promise<RequestPermissionAccessResult> | android | Request for permission access. |
| isServiceRunning(intent) | Boolean | android | Check on state of Service. |
| registerBroadcastReceiver(broadcastReceiver, actions) | void | android | Registers broadcast receiver for the given action… |
| unregisterBroadcastReceiver(broadcastReceiver) | void | android | Unregisters a broadcast receiver. |
| startService(intent) | void | android | Starts a simple service. |
| stopService(intent) | void | android | Stop a simple service that was started with `star… |
| createBroadcastIntent(parameters) | Ti.Android.Intent | android | Create an `Intent` to be used in a broadcast. |
| createBigPictureStyle(parameters) | Ti.Android.BigPictureStyle | android | Creates and returns an instance of <Titanium.Andr… |
| createBigTextStyle(parameters) | Ti.Android.BigTextStyle | android | Creates and returns an instance of <Titanium.Andr… |
| createBroadcastReceiver(parameters) | Ti.Android.BroadcastReceiver | android | Creates and returns an instance of <Titanium.Andr… |
| createIntent(parameters) | Ti.Android.Intent | android | Creates and returns an instance of <Titanium.Andr… |
| createNotification(parameters) | Ti.Android.Notification | android | Creates and returns an instance of <Titanium.Andr… |
| createNotificationChannel(parameters) | Ti.Android.NotificationChannel | android | Creates and returns an instance of <Titanium.Andr… |
| createQuickSettingsService(parameters) | Ti.Android.QuickSettingsService | android | Creates and returns an instance of <Titanium.Andr… |
| createRemoteViews(parameters) | Ti.Android.RemoteViews | android | Creates and returns an instance of <Titanium.Andr… |


---

## Ti.Android.ActionBar
> An action bar is a window feature that identifies the application and user location, and provides user actions and navigation modes.
> Extends Ti.Proxy
> Platforms: android

### Properties (unique: 12/15)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| backgroundImage | String | android | The background image for the action bar, specifie… |
| displayHomeAsUp | Boolean | android | Displays an "up" affordance on the "home" area of… |
| homeAsUpIndicator | String \| Number \| Ti.Blob | android | Sets a custom icon for the "home" button in the c… |
| homeButtonEnabled | Boolean | android | Enable or disable the "home" button in the corner… |
| icon | String \| Number \| Ti.Blob | android | Sets the application icon displayed in the "home"… |
| logo | String \| Number \| Ti.Blob | android | Sets the application logo displayed in the "home"… |
| navigationMode | Number | android | Controls the navigation mode. |
| onHomeIconItemSelected | Callback | android | Callback function called when the home icon is cl… |
| subtitle | String | android | Sets the subtitle of the action bar. |
| title | String | android | Sets the title of the action bar. |
| customView | Ti.UI.View | android | Sets a view to be used for a custom navigation mo… |
| visible | Boolean | android | Gets or sets the action bar visibility state. |


### Methods (4)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| hide(—) | void | android | Hides the action bar if it is currently showing. |
| setDisplayShowHomeEnabled(show) | void | android | Shows or hides the action bar home icon |
| setDisplayShowTitleEnabled(show) | void | android | Shows or hides the action bar title/subtitle |
| show(—) | void | android | Shows the action bar if it is currently hidden. |


---

## Ti.Android.Activity
> The Titanium binding of an Android Activity.
> Extends Ti.Proxy
> Platforms: android

### Properties (unique: 13/16)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| actionBar | Ti.Android.ActionBar | android | The action bar for this activity. |
| intent | Ti.Android.Intent | android | The last `Intent` received by this activity. |
| onCreate | Callback<ActivityLifecycleCallbackObject> | android | Callback function called when the Android activit… |
| onCreateOptionsMenu | Callback<OptionsMenuCallbackObject> | android | Callback function called to initially create an A… |
| onDestroy | Callback<ActivityLifecycleCallbackObject> | android | Callback function called when the Android activit… |
| onPause | Callback<ActivityLifecycleCallbackObject> | android | Callback function called when the Android activit… |
| onPrepareOptionsMenu | Callback<OptionsMenuCallbackObject> | android | Callback function called to prepare an options me… |
| onRestart | Callback<ActivityLifecycleCallbackObject> | android | Callback function called when the Android activit… |
| onResume | Callback<ActivityLifecycleCallbackObject> | android | Callback function called when the Android activit… |
| onStart | Callback<ActivityLifecycleCallbackObject> | android | Callback function called when the Android activit… |
| onStop | Callback<ActivityLifecycleCallbackObject> | android | Callback function called when the Android activit… |
| requestedOrientation | Number | android | Specifies a specific orientation for this activit… |
| supportToolbar | Ti.UI.Toolbar | android | Toolbar instance that serves as ActionBar |


### Methods (11)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| finish(—) | void | android | Closes this activity. |
| getString(resourceId, format) | String | android | Gets an Android or Application string using the s… |
| invalidateOptionsMenu(—) | void | android | Declares that the option menu has changed and sho… |
| setRequestedOrientation(orientation) | void | android | Sets the requested Activity orientation. |
| setResult(resultCode, intent) | void | android | Sets the result of this activity using an `Intent… |
| setSupportActionBar(toolbar) | void | android | Sets a toolbar instance to be used as an ActionBa… |
| startActivity(intent) | void | android | Starts a new activity, using the passed in `Inten… |
| startActivityForResult(intent, callback) | void | android | The same as `startActivity`, but also accepts a c… |
| openOptionsMenu(—) | void | android | Programmatically opens the options menu. |
| sendBroadcast(intent) | void | android | Broadcast the passed in `Intent` to all `Broadcas… |
| sendBroadcastWithPermission(intent, receiverPermission) | void | android | Broadcast the passed in `Intent` to all `Broadcas… |

### Events (4)
| Event | Platform | Description |
|-------|----------|-------------|
| newintent | android | Fired when the activity is already running and an intent different than the one… |
| onIntent | android | Fired when the activity is launched. |
| userleavehint | android | Fired when the activity is about to go into the background as a result of user … |
| userinteraction | android | Called whenever a key, touch, or trackball event is dispatched to the activity. |

---

## Ti.Android.BigPictureStyle
> Helper object for generating large-format notifications that include a large image attachment.
> Extends Ti.Proxy
> Platforms: android

### Properties (unique: 5/8)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| bigLargeIcon | Number \| String | android | Override the <Titanium.Android.Notification.large… |
| bigPicture | Number \| String \| Ti.Blob \| Ti.Filesystem.File | android | Provide the bitmap to be used as the payload for … |
| bigContentTitle | String | android | Overrides <Titanium.Android.Notification.contentT… |
| decodeRetries | Number | android | Number of times to retry decoding the bitmap at b… |
| summaryText | String | android | Set the first line of text after the detail secti… |




---

## Ti.Android.BigTextStyle
> Helper object for generating large-format notifications that include a lot of text.
> Extends Ti.Proxy
> Platforms: android

### Properties (unique: 3/6)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| bigText | String | android | Sets the longer text to be displayed in the big f… |
| bigContentTitle | String | android | Overrides <Titanium.Android.Notification.contentT… |
| summaryText | String | android | Set the first line of text after the detail secti… |




---

## Ti.Android.BroadcastReceiver
> Monitor and handle Android system broadcasts.
> Extends Ti.Proxy
> Platforms: android

### Properties (unique: 2/5)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| onReceived | Callback<Object> | android | The function called when a broadcast is received. |
| url | String | android | URL of the JavaScript file to handle the broadcas… |




---

## Ti.Android.Intent
> Message objects passed between Android application components.
> Extends Ti.Proxy
> Platforms: android

### Properties (unique: 7/10)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| action | String | android | The action associated with this intent. |
| className | String | android | The Java class name of the activity associated wi… |
| data | String | android | The Intent's Data URI. |
| flags | Number | android | Intent flags. |
| packageName | String | android | The fully-qualified Java package name of the acti… |
| type | String | android | The MIME type for this Intent. |
| url | String | android | The URL to a Titanium JavaScript Activity. |


### Methods (12)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| addCategory(name) | void | android | Adds a category to this Intent. |
| addFlags(flags) | void | android | Adds to the existing flags on the `Intent`. |
| getBlobExtra(name) | Ti.Blob | android | Get a <Titanium.Blob> property from this `Intent`. |
| getBooleanExtra(name, default) | Boolean | android | Get a boolean property from this Intent. |
| getData(—) | String | android | Get the Data URI from this `Intent`. |
| getDoubleExtra(name, default) | Number | android | Get a double property from this `Intent`. |
| getIntExtra(name, default) | Number | android | Get an integer property from this `Intent`. |
| getLongExtra(name, default) | Number | android | Get a long property from this `Intent`. |
| getStringExtra(name) | String | android | Get a string property from this `Intent`. |
| hasExtra(name) | Boolean | android | Returns `true` if this `Intent` has the specified… |
| putExtra(name, value) | void | android | Puts an extra property on this `Intent`. |
| putExtraUri(name, value) | void | android | Put a URI property on this `Intent` (useful for <… |


---

## Ti.Android.Menu
> The Titanium binding of an Android Options Menu.
> Extends Ti.Proxy
> Platforms: android

### Properties (unique: 1/4)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| items | Array<Titanium.Android.MenuItem> | android | Array of menu items in this menu. |


### Methods (11)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| add(options) | Ti.Android.MenuItem | android | Creates a <Titanium.Android.MenuItem> from the pa… |
| clear(—) | void | android | Clears all items from this menu. |
| close(—) | void | android | Closes the menu, if visible. |
| findItem(item) | Ti.Android.MenuItem | android | Locates a [MenuItem](Titanium.Android.MenuItem) i… |
| getItem(index) | Ti.Android.MenuItem | android | Returns the [MenuItem](Titanium.Android.MenuItem)… |
| hasVisibleItems(—) | Boolean | android | Returns `true` if this menu has visible items. |
| removeGroup(groupId) | void | android | Removes all menu items with the specified [groupI… |
| removeItem(itemId) | void | android | Removes a specific [MenuItem](Titanium.Android.Me… |
| setGroupEnabled(groupId, enabled) | void | android | Enables or disables a group of menu items identif… |
| setGroupVisible(groupId, visible) | void | android | Shows or hides a group of menu items identified b… |
| size(—) | Number | android | Number of items in this menu. |


---

## Ti.Android.MenuItem
> The Titanium binding of an Android menu item.
> Extends Ti.Proxy
> Platforms: android

### Properties (unique: 16/19)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| accessibilityHint | String | android | Briefly describes what performing an action (such… |
| accessibilityLabel | String | android | A succinct label identifying the view for the dev… |
| accessibilityValue | String | android | A string describing the value (if any) of the vie… |
| actionView | Ti.UI.View | android | Custom view that replaces the default menu item b… |
| actionViewExpanded | Boolean | android | True if this menu item's action view has been exp… |
| checkable | Boolean | android | Determines if the item can be checked. |
| checked | Boolean | android | Determines if the item is checked. |
| enabled | Boolean | android | Determines if the item is enabled. |
| groupId | Number | android | Group ID for this item. |
| icon | Number \| String | android | Icon to display for the this menu item. |
| itemId | Number | android | Item ID for this item. |
| order | Number | android | Integer used for controlling the category and sor… |
| showAsAction | Number | android | A set of flags that controls how this item appear… |
| title | String | android | Title of the item. |
| titleCondensed | String | android | Shortened version of the item's title. |
| visible | Boolean | android | Determines whether the menu item is visible. |


### Methods (11)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| collapseActionView(—) | void | android | Collapse the action view associated with this men… |
| expandActionView(—) | void | android | Expand the action view associated with this menu … |
| isActionViewExpanded(—) | Boolean | android | Returns the [actionViewExpanded](Titanium.Android… |
| isCheckable(—) | Boolean | android | Returns the [checkable](Titanium.Android.MenuItem… |
| isChecked(—) | Boolean | android | Returns the [checked](Titanium.Android.MenuItem.c… |
| isEnabled(—) | Boolean | android | Returns the [enabled](Titanium.Android.MenuItem.e… |
| isVisible(—) | Boolean | android | Returns the [visible](Titanium.Android.MenuItem.v… |
| setCheckable(checkable) | void | android | Sets the [checkable](Titanium.Android.MenuItem.ch… |
| setChecked(enabled) | void | android | Sets the [checked](Titanium.Android.MenuItem.chec… |
| setEnabled(enabled) | void | android | Sets the [enabled](Titanium.Android.MenuItem.enab… |
| setVisible(visible) | void | android | Sets the [visible](Titanium.Android.MenuItem.visi… |

### Events (3)
| Event | Platform | Description |
|-------|----------|-------------|
| click | android | Fired when the user clicks the menu item. |
| expand | android | Fired when the action view has been expanded. |
| collapse | android | Fired when the action view has been collapsed. |

---

## Ti.Android.Notification
> UI notifications that can be sent while the application is in the background.
> Extends Ti.Proxy
> Platforms: android

### Properties (unique: 26/29)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| audioStreamType | Number | android | The audio stream type to use when playing the sou… |
| category | String | android | Sets the notification's category. |
| channelId | String | android | The channel id specified for the notification. |
| contentIntent | Ti.Android.PendingIntent | android | The `PendingIntent` to execute when the expanded … |
| contentText | String | android | Description text of the notification. |
| contentTitle | String | android | Title of the notification. |
| contentView | Ti.Android.RemoteViews | android | Custom layout to display in the notification. |
| defaults | Number | android | Specifies which values should be taken from the d… |
| deleteIntent | Ti.Android.PendingIntent | android | The `PendingIntent` to execute when the status en… |
| flags | Number | android | Set of flags for the notification. |
| groupKey | String | android | The group key that the notification will belong t… |
| groupSummary | Boolean | android | Specifies if this is a group summary notification. |
| icon | Number \| String | android | Notification icon, specified as an Android resour… |
| largeIcon | Number \| String | android | Add a large icon to the notification (and the tic… |
| color | String | android | Accent color used behind icon. |
| ledARGB | Number | android | The color for the LED to blink. |
| ledOffMS | Number | android | The number of milliseconds for the LED to be off … |
| ledOnMS | Number | android | The number of milliseconds for the LED to be on w… |
| number | Number | android | The number of events that this notification repre… |
| priority | Number | android | Sets the priority of the notification. |
| sound | String | android | A URL to the sound to play. |
| style | Ti.Android.BigTextStyle \| Ti.Android.BigPictureStyle | android | Style object that can apply a rich notification s… |
| tickerText | String | android | Text to scroll across the screen when this item i… |
| visibility | Number | android | Allows user to conceal private information of the… |
| wakeLock | wakeLockOptions | android | Will wake up the device for the given time (in mi… |
| when | Date \| Number | android | The timestamp for the notification (defaults to t… |


### Methods (3)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| setLatestEventInfo(contentTitle, contentText, contentIntent) | void | android | Sets the latest event info using the built-in not… |
| setProgress(max, progress, indeterminate) | void | android | Set the progress this notification represents. |
| addAction(icon, title, intent) | void | android | Add an action button to the notification |


---

## Ti.Android.NotificationChannel
> Module for notification channels.
> Extends Ti.Proxy
> Platforms: android

### Properties (unique: 13/16)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| bypassDnd | Boolean | android | Whether or not notifications posted to this chann… |
| description | String | android | User visible description of this channel. |
| enableLights | Boolean | android | Whether notifications posted to this channel shou… |
| enableVibration | Boolean | android | Whether notification posted to this channel shoul… |
| groupId | String | android | Group id this channel belongs to. |
| importance | Number | android | The audio stream type to use when playing the sou… |
| id | String | android | The channel id specified for the notification cha… |
| lightColor | Number | android | The notification light color for notifications po… |
| lockscreenVisibility | Number | android | Whether or not notifications posted to this chann… |
| name | String | android | The visible name of this channel. The recommended… |
| showBadge | Boolean | android | Whether notifications posted to this channel can … |
| sound | String | android | A URL to the sound to play. |
| vibratePattern | Array<Number> | android | The vibration pattern for notifications posted to… |




---

## Ti.Android.NotificationManager
> Module for managing notifications.
> Extends Ti.Module
> Platforms: android
> Type: module

### Properties (unique: 1/15)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| notificationChannels | Dictionary<NotificationChannels> | android | Returns an object with the ID and name of the not… |

### Constants (11)
- **DEFAULT_\***: DEFAULT_ALL, DEFAULT_LIGHTS, DEFAULT_SOUND, DEFAULT_VIBRATE
- **FLAG_\***: FLAG_INSISTENT
- **FLAG_AUTO_\***: FLAG_AUTO_CANCEL
- **FLAG_NO_\***: FLAG_NO_CLEAR
- **FLAG_ONGOING_\***: FLAG_ONGOING_EVENT
- **FLAG_ONLY_ALERT_\***: FLAG_ONLY_ALERT_ONCE
- **FLAG_SHOW_\***: FLAG_SHOW_LIGHTS
- **STREAM_\***: STREAM_DEFAULT


### Methods (6)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| cancel(id) | void | android | Cancels a previously displayed notification. |
| cancelAll(—) | void | android | Cancels all previously displayed notifications. |
| notify(id, notification) | void | android | Adds a persistent notification to the status bar. |
| createNotificationChannel(parameters) | Ti.Android.NotificationChannel | android | Create a notification channel. |
| deleteNotificationChannel(id) | void | android | Deletes a notification channel. |
| areNotificationsEnabled(—) | Boolean | android | Returns whether showing notifications is enabled … |


---

## Ti.Android.PendingIntent
> The Titanium binding of an Android `PendingIntent`.
> Extends Ti.Proxy
> Platforms: android

### Properties (unique: 3/6)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| flags | Number | android | Flags used for creating the Pending Intent. |
| intent | Ti.Android.Intent | android | The intent data to pass to the [Activity](Titaniu… |
| updateCurrentIntent | Boolean | android | If this property is true, flag <Titanium.Android.… |




---

## Ti.Android.QuickSettingsService
> Android service for creating custom quick settings tiles and handling user's interaction with them.
> Extends Ti.Android.Service
> Platforms: android

### Properties (unique: 3/8)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| icon | String \| Ti.Blob \| Ti.Filesystem.File | android | Changes the Tile's icon. |
| state | Number | android | Sets the state of the Tile. |
| label | String | android | The Tile's label. |


### Methods (12)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| updateTile(—) | void | android | Applies current tile's properties. |
| setIcon(icon) | void | android | Changes the Tile's icon. |
| setState(state) | void | android | Sets the state of the Tile. |
| setLabel(label) | void | android | Changes the Tile's label. |
| getIcon(—) | String \| Ti.Blob \| Ti.Filesystem.File | android | Returns the Tile's current icon. |
| getState(—) | Number | android | Returns the Tile's current state. |
| getLabel(—) | String | android | Returns the Tile's current label. |
| isLocked(—) | Boolean | android | Returns 'true' if the device is currently locked,… |
| isSecure(—) | Boolean | android | Returns 'true' if the device is in secure state, … |
| showDialog(options) | void | android | Opens an Alert dialog. |
| startActivityAndCollapse(intent) | void | android | Collapses the quick settings menu and starts an a… |
| unlockAndRun(jsCode) | void | android | Prompts the user to unlock the device and runs th… |

### Events (9)
| Event | Platform | Description |
|-------|----------|-------------|
| startlistening | android | Tile is listening for events. |
| stoplistening | android | Tile has stopped listening for events. |
| tileadded | android | The Tile has been added in the quick menu. |
| tileremoved | android | The Tile has been removed from the quick menu. |
| tiledialogoptionselected | android | An item from the single choice menu has been selected. |
| tiledialogcancelled | android | Dispatched when the alert dialog has been cancelled. |
| tiledialogpositive | android | Dispatched when the positive (index 0) button has been clicked. |
| tiledialogneutral | android | Dispatched when the neutral (index 1) button has been clicked. |
| tiledialognegative | android | Dispatched when the negative (index 2) button has been clicked. |

---

## Ti.Android.R
> The Titanium binding of the native Android `R` class, giving access to Android system-wide resources or application resources.
> Extends Ti.Proxy
> Platforms: android

### Properties (unique: 22/25)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| anim | Object | android | Animation resources. See [R.anim](https://develop… |
| animator | Object | android | Animator resources. See [R.animator](https://deve… |
| array | Object | android | Array resources. See [R.array](https://developer.… |
| attr | Object | android | Attribute resources. See [R.attr](https://develop… |
| bool | Object | android | Boolean resources. See [R.bool](https://developer… |
| color | Object | android | Color resources. See [R.color](https://developer.… |
| dimen | Object | android | Dimension resources. See [https://developer.andro… |
| drawable | Object | android | Drawable resources. See [R.drawable](https://deve… |
| fraction | Object | android | Fraction resources. See [R.fraction](https://deve… |
| id | Object | android | ID resources. See [R.id](https://developer.androi… |
| integer | Object | android | Integer resources. See [R.integer](https://develo… |
| interpolator | Object | android | Interpolator resources. See [R.fraction](https://… |
| layout | Object | android | Layout resources. See [R.layout](https://develope… |
| menu | Object | android | Menu resources. See [R.menu](https://developer.an… |
| mipmap | Object | android | Mipmap resources. See [R.mipmap](https://develope… |
| plurals | Object | android | Plurals resources. See [R.plurals](https://develo… |
| raw | Object | android | Raw resources. See [R.raw](https://developer.andr… |
| string | Object | android | String resources. See [R.string](https://develope… |
| style | Object | android | Style resources. See [R.style](https://developer.… |
| styleable | Object | android | Styleable resources. See [R.styleable](https://de… |
| transition | Object | android | Transition resources. See [R.transition](https://… |
| xml | Object | android | XML resources. See [R.xml](https://developer.andr… |




---

## Ti.Android.RemoteViews
> The Titanium binding of [Android RemoteViews](https://developer.android.com/reference/android/widget/RemoteViews.html).
> Extends Ti.Proxy
> Platforms: android

### Properties (unique: 2/5)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| layoutId | Number | android | Android layout resource ID for the view to displa… |
| packageName | String | android | Package name that the resource ID lives in. Optio… |


### Methods (13)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| setBoolean(viewId, methodName, value) | void | android | Calls a method taking a single `boolean` argument… |
| setChronometer(viewId, base, format, started) | void | android | Sets the base time, format string, and started fl… |
| setDouble(viewId, methodName, value) | void | android | Calls a method taking a single `double` argument … |
| setImageViewResource(viewId, srcId) | void | android | Sets the image for an image view in the remote vi… |
| setImageViewUri(viewId, uri) | void | android | Sets the image for an image view in the remote vi… |
| setInt(viewId, methodName, value) | void | android | Calls a method taking a single `int` argument on … |
| setOnClickPendingIntent(viewId, pendingIntent) | void | android | Launches a <Titanium.Android.PendingIntent> when … |
| setProgressBar(viewId, max, progress, indeterminate) | void | android | Sets the progress, max value, and indeterminate f… |
| setString(viewId, methodName, value) | void | android | Calls a method taking a single String argument on… |
| setTextColor(viewId, color) | void | android | Sets the text color of a view in the remote view … |
| setTextViewText(viewId, text) | void | android | Sets the text of a text view in the remote view h… |
| setUri(viewId, methodName, value) | void | android | Calls a method taking one URI on a view in the re… |
| setViewVisibility(viewId, visibility) | void | android | Sets the visibility of a view in the remote view … |


---

## Ti.Android.Service
> Android application component that executes in the background.
> Extends Ti.Proxy
> Platforms: android

### Properties (unique: 2/5)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| intent | Ti.Android.Intent | android | The intent used to start or bind to the Service. |
| serviceInstanceId | Number | android | A service can be started more than once -- this n… |


### Methods (4)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| foregroundCancel(—) | void | android | Puts the service into the "background" state and … |
| foregroundNotify(id, notification, foregroundServiceType) | void | android | Puts the service into the "foreground" state and … |
| start(—) | void | android | Starts the Service. |
| stop(—) | void | android | Stops this running instance of the Service. |

### Events (5)
| Event | Platform | Description |
|-------|----------|-------------|
| pause | android | For Javascript-based services that you create, `pause` fires after each time th… |
| resume | android | For JavaScript-based Services which you create, `resume` fires each time the Ja… |
| start | android | Fired when the bound service instance starts. |
| stop | android | Fired when the bound service instance stops. |
| taskremoved | android | Fired when the task that comes from the service's application has been removed. |

---

