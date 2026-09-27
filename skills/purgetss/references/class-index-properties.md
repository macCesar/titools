# PurgeTSS Class Index — Titanium Properties (A–Z)

Every Titanium property that has PurgeTSS utility classes, with the classes that set it. Generated from `utilities.tss` (PurgeTSS 7.18.0) by `.claude/skills/titools-skill-auditor/scripts/purgetss-class-index.mjs`; do not edit by hand. For naming rules and verification commands see [class-index.md](./class-index.md); for classes grouped by kind of value see [class-categories.md](./class-categories.md).

> Before suggesting ANY class, verify it exists: `grep -E "PATTERN" ./purgetss/styles/utilities.tss`

<!-- TOC-START -->
## Contents

- [620 Titanium Properties with Classes](#620-titanium-properties-with-classes)
  - [A–C](#ac)
  - [D–H](#dh)
  - [I–O](#io)
  - [P–S](#ps)
  - [T–Z](#tz)

<!-- TOC-END -->

## 620 Titanium Properties with Classes

A property set inside `font` or `animationProperties` is listed with its container (`font.fontSize`). A class that sets several properties appears under each of them. **Classes** shows the family as it appears in `utilities.tss`: `name-*` when the classes share that stem, otherwise the class names themselves. **Count** is the number of distinct class names in that family.

### A–C

| Property | Classes | Count | Components | Platform |
| --- | --- | --- | --- | --- |
| `accessibilityDisableLongPress` | `accessibility-disable-long-press`, `accessibility-disable-long-press-false` | 2 | View, Ti.Media.VideoPlayer, ActivityIndicator +37 more | — |
| `accessibilityEnabled` | `accessibility-enabled`, `accessibility-enabled-false` | 2 | Ti.App | — |
| `accessibilityHidden` | `accessibility-hidden`, `accessibility-hidden-false` | 2 | View, Ti.Media.VideoPlayer, Android.CardView +32 more | — |
| `accessoryType` | `accessory-type-list-none`, `accessory-type-list-checkmark`, `accessory-type-list-detail`, `accessory-type-list-disclosure` | 4 | ListItem | — |
| `accuracy` | `accuracy-*` | 9 | Ti.Geolocation.Android.LocationRule, Ti.Geolocation, LocationCoordinates +3 more | — |
| `accuracyAuthorization` | `accuracy-authorization-full`, `accuracy-authorization-reduced` | 2 | LocationAccuracyAuthorizationResponse | — |
| `actionViewExpanded` | `action-view-expanded`, `action-view-expanded-false` | 2 | Ti.Android.MenuItem | — |
| `activationMode` | `activation-mode-background`, `activation-mode-foreground` | 2 | Ti.App.iOS.UserNotificationAction | iOS only |
| `active` | `active`, `active-false` | 2 | Tab, iOS.PushBehavior | — |
| `activeIconIsMask` | `active-icon-is-mask`, `active-icon-is-mask-false` | 2 | Tab | — |
| `activeTab` | `active-tab-*` | 13 | TabGroup | — |
| `activeTintColor` | `active-tint-*` | 245 | Tab, TabGroup, TabbedBar | — |
| `activeTitleColor` | `active-title-*` | 245 | Tab, TabGroup | — |
| `activityEnterTransition` | `activity-enter-transition-*` | 8 | NavigationWindow, TabGroup, Window | Android only |
| `activityExitTransition` | `activity-exit-transition-*` | 8 | NavigationWindow, TabGroup, Window | Android only |
| `activityReenterTransition` | `activity-reenter-transition-*` | 8 | NavigationWindow, TabGroup, Window | Android only |
| `activityReturnTransition` | `activity-return-transition-*` | 8 | NavigationWindow, TabGroup, Window | Android only |
| `activitySharedElementEnterTransition` | `activity-shared-element-enter-transition-change-bounds`, `activity-shared-element-enter-transition-change-clip-bounds`, `activity-shared-element-enter-transition-change-transform`, `activity-shared-element-enter-transition-change-image-transform`, `activity-shared-element-enter-transition-none` | 5 | NavigationWindow, TabGroup, Window | Android only |
| `activitySharedElementExitTransition` | `activity-shared-element-exit-transition-change-bounds`, `activity-shared-element-exit-transition-change-clip-bounds`, `activity-shared-element-exit-transition-change-transform`, `activity-shared-element-exit-transition-change-image-transform`, `activity-shared-element-exit-transition-none` | 5 | NavigationWindow, TabGroup, Window | Android only |
| `activitySharedElementReenterTransition` | `activity-shared-element-reenter-transition-change-bounds`, `activity-shared-element-reenter-transition-change-clip-bounds`, `activity-shared-element-reenter-transition-change-transform`, `activity-shared-element-reenter-transition-change-image-transform`, `activity-shared-element-reenter-transition-none` | 5 | NavigationWindow, TabGroup, Window | Android only |
| `activitySharedElementReturnTransition` | `activity-shared-element-return-transition-change-bounds`, `activity-shared-element-return-transition-change-clip-bounds`, `activity-shared-element-return-transition-change-transform`, `activity-shared-element-return-transition-change-image-transform`, `activity-shared-element-return-transition-none` | 5 | NavigationWindow, TabGroup, Window | Android only |
| `activityType` | `activity-type-activitytype-other`, `activity-type-activitytype-automotive-navigation`, `activity-type-activitytype-fitness`, `activity-type-activitytype-other-navigation` | 4 | Ti.App.iOS.UserActivity, Ti.Geolocation | — |
| `alertSetting` | `alert-setting-not-supported`, `alert-setting-enabled`, `alert-setting-disabled` | 3 | GetUserNotificationSettings | iOS only |
| `alertStyle` | `alert-style-none`, `alert-style`, `alert-style-banner` | 3 | GetUserNotificationSettings | iOS only |
| `alignment` | `alignment-text-center`, `alignment-text-justify`, `alignment-text-left`, `alignment-text-right` | 4 | ParagraphAttribute | — |
| `allDay` | `all-day`, `all-day-false` | 2 | Ti.Calendar.Event | — |
| `allowBackground` | `allow-background`, `allow-background-false` | 2 | Ti.Media.AudioPlayer, Ti.Media.Sound | — |
| `allowCreation` | `allow-creation`, `allow-creation-false` | 2 | Clipboard | — |
| `allowEditing` | `allow-editing`, `allow-editing-false` | 2 | CameraOptionsType, PhotoGalleryOptionsType | — |
| `allowFileAccess` | `allow-file-access`, `allow-file-access-false` | 2 | WebView | — |
| `allowMultiple` | `allow-multiple`, `allow-multiple-false` | 2 | PhotoGalleryOptionsType | — |
| `allowMultipleSelections` | `allow-multiple-selections`, `allow-multiple-selections-false` | 2 | MusicLibraryOptionsType | — |
| `allowsAirPlay` | `allows-air-play`, `allows-air-play-false` | 2 | Ti.Media.VideoPlayer | — |
| `allowsAirPlayMediaPlayback` | `allows-air-play-media-playback`, `allows-air-play-media-playback-false` | 2 | iOS.WebViewConfiguration | — |
| `allowsBackForwardNavigationGestures` | `allows-back-forward-navigation-gestures`, `allows-back-forward-navigation-gestures-false` | 2 | WebView | — |
| `allowsBackgroundLocationUpdates` | `allows-bg-location-updates`, `allows-bg-location-updates-false` | 2 | Ti.Geolocation | — |
| `allowsDefaultTighteningForTruncation` | `allows-tightening-for-truncation`, `allows-tightening-for-truncation-false` | 2 | ParagraphAttribute | — |
| `allowsExternalPlayback` | `allows-external-playback`, `allows-external-playback-false` | 2 | Ti.Media.AudioPlayer | — |
| `allowsInlineMediaPlayback` | `allows-inline-media-playback`, `allows-inline-media-playback-false` | 2 | iOS.WebViewConfiguration | — |
| `allowsLinkPreview` | `allows-link-preview`, `allows-link-preview-false` | 2 | WebView | — |
| `allowsMultipleSelectionDuringEditing` | `allows-multiple-selection-during-editing`, `allows-multiple-selection-during-editing-false` | 2 | ListView, TableView | — |
| `allowsMultipleSelectionInteraction` | `allows-multiple-selection-interaction`, `allows-multiple-selection-interaction-false` | 2 | ListView, TableView | — |
| `allowsPictureInPictureMediaPlayback` | `allows-picture-in-media-playback`, `allows-picture-in-media-playback-false` | 2 | iOS.WebViewConfiguration | — |
| `allowsRotation` | `allows-rotation`, `allows-rotation-false` | 2 | iOS.DynamicItemBehavior | — |
| `allowsSelection` | `allows-selection`, `allows-selection-false` | 2 | ListView, TableView | — |
| `allowsSelectionDuringEditing` | `allows-selection-during-editing`, `allows-selection-during-editing-false` | 2 | ListView, TableView | — |
| `allowTranscoding` | `allow-transcoding`, `allow-transcoding-false` | 2 | PhotoGalleryOptionsType | — |
| `allowUserCustomization` | `allow-user-customization`, `allow-user-customization-false` | 2 | TabGroup | — |
| `anchorPoint` | `origin-*` | 9 | Animation, View | — |
| `anchorPoint` | `anchor-point-*` | 9 | — | — |
| `animated` | `animated`, `animated-false` | 2 | showParams, showContactsParams, MusicLibraryOptionsType +16 more | — |
| `animationProperties.close` | `opacity-to-0`, `opacity-to-100`, `toggle-visible` | 3 | Animation | — |
| `animationProperties.close` | `zoom-*` | 30 | Animation | — |
| `animationProperties.complete` | `zoom-*` | 30 | Animation | — |
| `animationProperties.keepZIndex` | `snap-back`, `snap-back-false`, `snap-center`, `snap-center-false`, `keep-z-index`, `keep-z-index-false` | 6 | Animation | — |
| `animationProperties.open` | `opacity-to-0`, `opacity-to-100`, `toggle-visible` | 3 | Animation | — |
| `animationProperties.open` | `zoom-*` | 30 | Animation | — |
| `animationProperties.snap` | `snap-back`, `snap-back-false`, `snap-center`, `snap-center-false`, `keep-z-index`, `keep-z-index-false` | 6 | Animation | — |
| `animationStyle` | `animation-style-*` | 14 | ListViewAnimationProperties, TableViewAnimationProperties, closeWindowParams | iOS only |
| `appSupportsShakeToEdit` | `app-supports-shake-to-edit`, `app-supports-shake-to-edit-false` | 2 | iOS | — |
| `arrowDirection` | `arrow-direction-*` | 11 | CameraOptionsType, PhotoGalleryOptionsType, MenuPopupShowParams, iPad.Popover | some variants platform-only |
| `aspectRatio` | `aspect-ratio-4-3`, `aspect-ratio-16-9` | 2 | Ti.Media | — |
| `audioFocus` | `audio-focus`, `audio-focus-false` | 2 | Ti.Media.AudioPlayer | — |
| `audioPlaying` | `audio-playing`, `audio-playing-false` | 2 | Ti.Media | — |
| `audioSessionCategory` | `audio-session-category-ambient`, `audio-session-category-playback`, `audio-session-category-play-and-record`, `audio-session-category-record`, `audio-session-category-solo-ambient` | 5 | Ti.Media | — |
| `audioStreamType` | `audio-stream-type`, `audio-stream-type-*` | 7 | Ti.Android.Notification | Android only |
| `audioType` | `audio-type-alarm`, `audio-type-signalling`, `audio-type-media`, `audio-type-notification`, `audio-type-ring`, `audio-type-voice` | 6 | Ti.Media.AudioPlayer, Ti.Media.Sound | — |
| `authenticationRequired` | `authentication-required`, `authentication-required-false` | 2 | Ti.App.iOS.UserNotificationAction | — |
| `authorizationStatus` | `authorization-status-not-determined`, `authorization-status-authorized`, `authorization-status-denied`, `authorization-status-provisional` | 4 | GetUserNotificationSettings | iOS only |
| `autoAdjustScrollViewInsets` | `auto-adjust-scroll-view-insets`, `auto-adjust-scroll-view-insets-false` | 2 | NavigationWindow, TabGroup, WebView +2 more | — |
| `autocapitalization` | `uppercase`, `normal-case`, `capitalize`, `sentences` | 4 | SearchBar, TextArea, TextField | — |
| `autocapitalization` | `autocapitalization-text-all`, `autocapitalization-text-none`, `autocapitalization-text-sentences`, `autocapitalization-text-words` | 4 | SearchBar, TextArea, TextField | — |
| `autocorrect` | `autocorrect`, `autocorrect-false` | 2 | SearchBar, TextArea, TextField | — |
| `autoEncodeUrl` | `auto-encode-url`, `auto-encode-url-false` | 2 | Ti.Network.HTTPClient | — |
| `autofillType` | `autofill-type-*` | 32 | TextArea, TextField | — |
| `autohide` | `autohide`, `autohide-false` | 2 | MusicLibraryOptionsType, CameraOptionsType, PhotoGalleryOptionsType | — |
| `autoHide` | `auto-hide`, `auto-hide-false` | 2 | Ti.Media.VideoPlayer | — |
| `autoLink` | `auto-link-*` | 12 | Label, TextArea, TextField | — |
| `autoplay` | `autoplay`, `autoplay-false` | 2 | Ti.Media.VideoPlayer | — |
| `autoRedirect` | `auto-redirect`, `auto-redirect-false` | 2 | Ti.Network.HTTPClient | — |
| `autorepeat` | `autorepeat`, `autorepeat-false` | 2 | iOS.Stepper | — |
| `autoreverse` | `autoreverse`, `autoreverse-false` | 2 | Animation | — |
| `autorotate` | `autorotate`, `autorotate-false` | 2 | CameraOptionsType, ImageView | — |
| `autoSize` | `auto-size`, `auto-size-false` | 2 | Label | — |
| `autoTabTitle` | `auto-tab-title`, `auto-tab-title-false` | 2 | TabGroup | — |
| `availability` | `availability-calendar-notsupported`, `availability-calendar-busy`, `availability-calendar-free`, `availability-calendar-tentative`, `availability-calendar-unavailable` | 5 | Ti.Calendar.Event | — |
| `availableCameraMediaTypes` | `available-camera-media-types-type-photo`, `available-camera-media-types-type-livephoto`, `available-camera-media-types-type-video` | 3 | Ti.Media | — |
| `availableCameras` | `available-cameras-camera-front`, `available-cameras-camera-rear` | 2 | Ti.Media | — |
| `availablePhotoGalleryMediaTypes` | `available-photo-gallery-media-types-type`, `available-photo-gallery-media-types-type-livephoto`, `available-photo-gallery-media-types-type-video` | 3 | Ti.Media | — |
| `availablePhotoMediaTypes` | `available-photo-media-types-type`, `available-photo-media-types-type-livephoto`, `available-photo-media-types-type-video` | 3 | Ti.Media | — |
| `backfillEnd` | `backfill-end`, `backfill-end-false` | 2 | Gradient | — |
| `backfillStart` | `backfill-start`, `backfill-start-false` | 2 | Gradient | — |
| `backgroundColor` | `bg-*` | 245 | View, Ti.Media.VideoPlayer, Android.CardView +40 more | — |
| `backgroundDisabledColor` | `bg-disabled-*` | 245 | View, Ti.Media.VideoPlayer, Android.CardView +25 more | — |
| `backgroundFocusedColor` | `bg-focused-*` | 245 | View, Ti.Media.VideoPlayer, Android.CardView +25 more | — |
| `backgroundGradient` | `bg-linear`, `bg-linear-*` | 9 | MaskedImage | — |
| `backgroundGradient` | `bg-gradient`, `bg-gradient-*` | 9 | MaskedImage | — |
| `backgroundGradient` | `bg-radial`, `bg-radial-*` | 9 | ListItem, View | — |
| `backgroundGradient` | `from-*` | 245 | ListItem, View | — |
| `backgroundGradient` | `to-*` | 245 | ListItem, View | — |
| `backgroundLeftCap` | `bg-left-cap-*` | 35 | View, Ti.Media.VideoPlayer, Button +27 more | — |
| `backgroundPaddingBottom` | `bg-padding-bottom-*` | 35 | Label | — |
| `backgroundPaddingLeft` | `bg-padding-left-*` | 35 | Label | — |
| `backgroundPaddingRight` | `bg-padding-right-*` | 35 | Label | — |
| `backgroundPaddingTop` | `bg-padding-top-*` | 35 | Label | — |
| `backgroundRepeat` | `background-repeat`, `background-repeat-false` | 2 | View, Ti.Media.VideoPlayer, Android.DrawerLayout +29 more | — |
| `backgroundSelectedColor` | `bg-selected-*` | 245 | View, Ti.Media.VideoPlayer, Android.CardView +30 more | — |
| `backgroundSelectedGradient` | `bg-selected-from-*` | 245 | ListItem, View | — |
| `backgroundSelectedGradient` | `bg-selected-to-*` | 245 | ListItem, View | — |
| `backgroundTopCap` | `bg-top-cap-*` | 35 | View, Ti.Media.VideoPlayer, Button +27 more | — |
| `backward` | `backward`, `backward-false` | 2 | StringSearchOptions | — |
| `badgeBackgroundColor` | `badge-bg-*` | 245 | Tab | — |
| `badgeColor` | `badge-*` | 245 | Tab | — |
| `badgeSetting` | `badge-setting-not-supported`, `badge-setting-enabled`, `badge-setting-disabled` | 3 | GetUserNotificationSettings | iOS only |
| `badgeTextColor` | `badge-text-*` | 245 | Tab | — |
| `barColor` | `bar-*` | 245 | Android.CollapseToolbar, EmailDialog, SearchBar +5 more | — |
| `batteryMonitoring` | `battery-monitoring`, `battery-monitoring-false` | 2 | Ti.Platform | — |
| `behavior` | `behavior`, `behavior-textinput` | 2 | Ti.App.iOS.UserNotificationAction | iOS only |
| `borderColor` | `border-*` | 245 | View, Ti.Media.VideoPlayer, Android.DrawerLayout +31 more | — |
| `borderRadius` | `rounded`, `rounded-*` | 462 | View, Ti.Media.VideoPlayer, Android.CardView +32 more | — |
| `borderRadius` | `rounded-full`, `rounded-full-*` | 41 | View, Ti.Media.VideoPlayer, Android.CardView +32 more | — |
| `borderRadius` | `border-radius`, `border-radius-*` | 43 | View, Ti.Media.VideoPlayer, Android.CardView +32 more | — |
| `borderStyle` | `border-style-bezel`, `border-style-line`, `border-style-none`, `border-style-rounded`, `border-style-underlined`, `border-style-filled` | 6 | Picker, TextArea, TextField | — |
| `borderWidth` | `border`, `border-*` | 14 | View, Ti.Media.VideoPlayer, Android.CardView +32 more | — |
| `bottom` | `m-*`, `my-*`, `mx-*`, `mt-*`, `mr-*`, `mb-*`, `ml-*`, `-m-*`, … | 1134 | — | — |
| `bottom` | `items-start`, `items-end`, `items-center` | 3 | ActivityIndicator, Animaiton, View, Window | — |
| `bottom` | `top-auto`, `left-auto`, `right-auto`, `bottom-auto`, `inset-x-0`, `inset-y-0`, `inset-0`, `inset-x-auto`, … | 10 | ActivityIndicator, Animation, View, Window | — |
| `bottom` | `gap-*` | 259 | ActivityIndicator, Animation, View, Window | — |
| `bottom` | `bottom-*` | 63 | View, Ti.Media.VideoPlayer, ActivityIndicator +38 more | — |
| `breakStrategy` | `break-strategy-simple`, `break-strategy-high-quality`, `break-strategy-balanced` | 3 | Label | — |
| `bubbleParent` | `bubble-parent`, `bubble-parent-false` | 2 | Ti.Proxy, Ti.Module, View +190 more | — |
| `bubbles` | `bubbles`, `bubbles-false` | 2 | Ti.Event | — |
| `buttonClickRequired` | `button-click-required`, `button-click-required-false` | 2 | AlertDialog | — |
| `bypassDnd` | `bypass-dnd`, `bypass-dnd-false` | 2 | Ti.Android.NotificationChannel | — |
| `cache` | `cache`, `cache-false` | 2 | Ti.Network.HTTPClient | — |
| `cacheMode` | `cache-mode-webview-load`, `cache-mode-webview-load-no`, `cache-mode-webview-load-only`, `cache-mode-webview-load-else-network` | 4 | WebView | Android only |
| `cachePolicy` | `cache-policy-use-protocol`, `cache-policy-reload-ignoring-local-data`, `cache-policy-return-data-else-load`, `cache-policy-return-data-dont-load` | 4 | WebView | iOS only |
| `cacheSize` | `cache-size-*` | 13 | ScrollableView | — |
| `calendarAuthorization` | `calendar-authorization-authorized`, `calendar-authorization-denied`, `calendar-authorization-restricted`, `calendar-authorization-unknown` | 4 | Ti.Calendar | — |
| `calendarViewShown` | `calendar-view-shown`, `calendar-view-shown-false` | 2 | Picker | — |
| `cameraAuthorization` | `camera-authorization-authorized`, `camera-authorization-denied`, `camera-authorization-restricted`, `camera-authorization-unknown` | 4 | Ti.Media | — |
| `cameraFlashMode` | `camera-flash-mode-auto`, `camera-flash-mode-off`, `camera-flash-mode-on` | 3 | Ti.Media | — |
| `canCancelEvents` | `can-cancel-events`, `can-cancel-events-false` | 2 | ScrollView | — |
| `cancelable` | `cancelable`, `cancelable-false` | 2 | Android.ProgressIndicator | — |
| `cancelBubble` | `cancel-bubble`, `cancel-bubble-false` | 2 | Ti.Event | — |
| `canceledOnTouchOutside` | `canceled-on-touch-outside`, `canceled-on-touch-outside-false` | 2 | AlertDialog, Android.ProgressIndicator | — |
| `canDelete` | `can-delete`, `can-delete-false` | 2 | DashboardItem | — |
| `canEdit` | `can-edit`, `can-edit-false` | 2 | ListItem | — |
| `canInsert` | `can-insert`, `can-insert-false` | 2 | ListItem | — |
| `canMove` | `can-move`, `can-move-false` | 2 | ListItem | — |
| `canRecord` | `can-record`, `can-record-false` | 2 | Ti.Media | — |
| `canScroll` | `can-scroll`, `can-scroll-false` | 2 | ListView | — |
| `carPlaySetting` | `car-play-setting-not-supported`, `car-play-setting-enabled`, `car-play-setting-disabled` | 3 | GetUserNotificationSettings | iOS only |
| `caseInsensitiveSearch` | `case-insensitive-search`, `case-insensitive-search-false` | 2 | ListView | — |
| `caseSensitive` | `case-sensitive`, `case-sensitive-false` | 2 | StringSearchOptions | — |
| `category` | `category`, `category-*` | 30 | Ti.Android.Notification, UserNotificationDictionary, NotificationParams | Android only |
| `charset` | `charset-codec-ascii`, `charset-codec-iso-latin-1`, `charset-codec-utf8`, `charset-codec-utf16`, `charset-codec-utf16be`, `charset-codec-utf16le` | 6 | EncodeStringDict, DecodeStringDict | — |
| `checkable` | `checkable`, `checkable-false` | 2 | Ti.Android.MenuItem | — |
| `checked` | `checked`, `checked-false` | 2 | Ti.Android.MenuItem | — |
| `clearButtonMode` | `clear-button-mode-always`, `clear-button-mode-never`, `clear-button-mode-onblur`, `clear-button-mode-onfocus` | 4 | TextField | — |
| `clearOnEdit` | `clear-on-edit`, `clear-on-edit-false` | 2 | TextArea, TextField | — |
| `clipMode` | `clip-enabled`, `clip-disabled` | 2 | View | iOS only |
| `clipViews` | `clip-views`, `clip-views-false` | 2 | ScrollableView | — |
| `closed` | `closed`, `closed-false` | 2 | NavigationWindow, TabGroup, Window, iOS.SplitWindow | — |
| `code` | `code-device-busy`, `code-no-camera`, `code-unknown-error`, `code-no-focus` | 4 | assert.AssertionError, EmitWarningOptions, RequestPermissionAccessResult +28 more | — |
| `collisionMode` | `collision-mode-all`, `collision-mode-boundary`, `collision-mode-item` | 3 | iOS.CollisionBehavior | iOS only |
| `color` | `text-*` | 245 | Button, Label, PickerRow +10 more | — |
| `color` | `transparent`, `black`, `white`, `slate-*`, `gray-*`, `zinc-*`, `neutral-*`, `stone-*`, … | 245 | Ti.Android.Notification, Ti.Android.R, ActivityIndicator +20 more | — |
| `colors` | `colors-*` | 245 | UtilInspectOptions, Gradient | — |
| `columnCount` | `col-count-*` | 12 | DashboardView | — |
| `compact` | `compact`, `compact-false` | 2 | UtilInspectOptions | — |
| `compression` | `compression-audio-format-*` | 7 | Ti.Media.AudioRecorder | — |
| `connected` | `connected`, `connected-false` | 2 | process, Ti.Network.HTTPClient, Ti.Network.Socket.TCP | — |
| `constraint` | `horizontal-constraint`, `vertical-constraint` | 2 | Animation | — |
| `contactsAuthorization` | `contacts-authorization-authorized`, `contacts-authorization-denied`, `contacts-authorization-unknown` | 3 | Ti.Contacts | — |
| `contentHeight` | `content-w-auto`, `content-h-auto`, `content-w-screen`, `content-h-screen`, `content-auto`, `content-screen` | 6 | ScrollView | — |
| `contentHeight` | `content-h-*` | 35 | ScrollView, iOS.PreviewContext | — |
| `contentScrimColor` | `content-scrim-*` | 245 | Android.CollapseToolbar | — |
| `contentWidth` | `content-w-auto`, `content-h-auto`, `content-w-screen`, `content-h-screen`, `content-auto`, `content-screen` | 6 | ScrollView | — |
| `contentWidth` | `content-w-*` | 35 | ScrollView | — |
| `continuous` | `continuous`, `continuous-false` | 2 | iOS.Stepper | — |
| `continuousUpdate` | `continuous-update`, `continuous-update-false` | 2 | ListView | — |
| `countDownDuration` | `count-down-duration`, `count-down-duration-*` | 23 | Picker | — |
| `criticalAlertSetting` | `critical-alert-setting-not-supported`, `critical-alert-setting-enabled`, `critical-alert-setting-disabled` | 3 | GetUserNotificationSettings | iOS only |
| `currentPageIndicatorColor` | `current-page-indicator-*` | 245 | ScrollableView | — |
| `curve` | `ease-in`, `ease-out`, `ease-linear`, `ease-in-out` | 4 | Animation | — |
| `curve` | `curve-animation-ease-in`, `curve-animation-ease-in-out`, `curve-animation-ease-out`, `curve-animation-linear` | 4 | Animation | — |
| `customInspect` | `custom-inspect`, `custom-inspect-false` | 2 | UtilInspectOptions | — |

### D–H

| Property | Classes | Count | Components | Platform |
| --- | --- | --- | --- | --- |
| `datePickerStyle` | `date-picker-style-automatic`, `date-picker-style-wheels`, `date-picker-style-compact`, `date-picker-style-inline` | 4 | Picker | — |
| `dateTimeColor` | `date-time-*` | 245 | Picker | — |
| `debug` | `debug` | 1 | — | — |
| `decelerationRate` | `deceleration-rate-scroll-fast`, `deceleration-rate-scroll-normal` | 2 | ScrollView | iOS only |
| `defaultItemTemplate` | `list-item-template`, `list-item-template-contacts`, `list-item-template-settings`, `list-item-template-subtitle` | 4 | ListView | — |
| `defaults` | `defaults-all`, `defaults-lights`, `defaults-sound`, `defaults-vibrate` | 4 | Ti.Android.Notification | Android only |
| `delay` | `delay-*` | 22 | Animation | — |
| `destructive` | `destructive`, `destructive-false` | 2 | Ti.App.iOS.UserNotificationAction, AlertDialog, OptionDialog | — |
| `dimBackgroundForSearch` | `dim-bg-for-search`, `dim-bg-for-search-false` | 2 | ListView, TableView | — |
| `disableBounce` | `disable-bounce`, `disable-bounce-false` | 2 | ListView, ScrollView, ScrollableView, WebView | — |
| `disableContextMenu` | `disable-context-menu`, `disable-context-menu-false` | 2 | WebView | — |
| `disabledColor` | `disabled-*` | 245 | Button | — |
| `disableNetworkActivityIndicator` | `disable-network-activity-indicator`, `disable-network-activity-indicator-false` | 2 | Ti.App | — |
| `displayHomeAsUp` | `display-home-as-up`, `display-home-as-up-false` | 2 | Ti.Android.ActionBar, Android.CollapseToolbar | — |
| `draggingType` | `drag-apply`, `drag-animate` | 2 | For the Animation Component | — |
| `drawerIndicatorEnabled` | `drawer-indicator-enabled`, `drawer-indicator-enabled-false` | 2 | Android.DrawerLayout | — |
| `drawerLockMode` | `drawer-lock-mode-locked-closed`, `drawer-lock-mode-locked-open`, `drawer-lock-mode-undefined`, `drawer-lock-mode-unlocked` | 4 | Android.DrawerLayout | Android only |
| `duration` | `duration-*` | 22 | Ti.App.iOS.SearchableItemAttributeSet, Ti.Media.AudioPlayer, CameraRecordingCallback +7 more | — |
| `editable` | `editable`, `editable-false` | 2 | DashboardView, TableView, TableViewRow +2 more | — |
| `editing` | `editing`, `editing-false` | 2 | ListView, TableView | — |
| `effect` | `effect-blur-style-*` | 20 | iOS.BlurView | iOS only |
| `elevation` | `shadow`, `shadow-*` | 10 | iOS: Ti.UI.View, Android: Ti.UI.Android.CardView, Animation, View | — |
| `elevation` | `elevation-*` | 35 | View, Ti.Media.VideoPlayer, ActivityIndicator +36 more | — |
| `eligibleForHandoff` | `eligible-for-handoff`, `eligible-for-handoff-false` | 2 | Ti.App.iOS.UserActivity | — |
| `eligibleForPrediction` | `eligible-for-prediction`, `eligible-for-prediction-false` | 2 | Ti.App.iOS.UserActivity | — |
| `eligibleForPublicIndexing` | `eligible-for-public-indexing`, `eligible-for-public-indexing-false` | 2 | Ti.App.iOS.UserActivity | — |
| `eligibleForSearch` | `eligible-for-search`, `eligible-for-search-false` | 2 | Ti.App.iOS.UserActivity | — |
| `ellipsize` | `ellipsize-*` | 8 | Label | — |
| `ellipsize` | `ellipsize`, `ellipsize-false` | 2 | TextArea, TextField | — |
| `ellipsize` | `ellipsize-text-truncate-*` | 8 | Label, TextArea, TextField | — |
| `enableCopy` | `enable-copy`, `enable-copy-false` | 2 | TextArea, TextField | — |
| `enabled` | `enabled`, `enabled-false` | 2 | Ti.Android.MenuItem, Button, Slider +5 more | — |
| `enableJavascriptInterface` | `enable-javascript-interface`, `enable-javascript-interface-false` | 2 | WebView | — |
| `enableKeepAlive` | `enable-keep-alive`, `enable-keep-alive-false` | 2 | Ti.Network.HTTPClient | — |
| `enableLights` | `enable-lights`, `enable-lights-false` | 2 | Ti.Android.NotificationChannel | — |
| `enableReturnKey` | `enable-return-key`, `enable-return-key-false` | 2 | TextArea, TextField | — |
| `enableVibration` | `enable-vibration`, `enable-vibration-false` | 2 | Ti.Android.NotificationChannel | — |
| `enableZoomControls` | `enable-zoom-controls`, `enable-zoom-controls-false` | 2 | ImageView, WebView | — |
| `exact` | `exact`, `exact-false` | 2 | MediaQueryInfoType | — |
| `exitOnClose` | `exit-on-close`, `exit-on-close-false` | 2 | NavigationWindow, TabGroup, Window | — |
| `experimental` | `experimental`, `experimental-false` | 2 | TabGroup | — |
| `extendBackground` | `extend-background`, `extend-background-false` | 2 | Toolbar | — |
| `extendEdges` | `extend-edges-top`, `extend-edges-bottom`, `extend-edges-left`, `extend-edges-right`, `extend-edges-none`, `extend-edges-all` | 6 | NavigationWindow, TabGroup, Window, iOS.SplitWindow | — |
| `extendSafeArea` | `extend-safe-area`, `extend-safe-area-false` | 2 | NavigationWindow, TabGroup, Window, iOS.SplitWindow | — |
| `fastScroll` | `fast-scroll`, `fast-scroll-false` | 2 | ListView | — |
| `filterAlwaysInclude` | `filter-always-include`, `filter-always-include-false` | 2 | TableViewRow | — |
| `filterAnchored` | `filter-anchored`, `filter-anchored-false` | 2 | TableView | — |
| `filterAttribute` | `filter-attribute`, `filter-attribute-false` | 2 | TableView | — |
| `filterCaseInsensitive` | `filter-case-insensitive`, `filter-case-insensitive-false` | 2 | TableView | — |
| `filterTouchesWhenObscured` | `filter-touches-when-obscured`, `filter-touches-when-obscured-false` | 2 | View, Ti.Media.VideoPlayer, ActivityIndicator +36 more | — |
| `fixedSize` | `fixed-size`, `fixed-size-false` | 2 | ListView, TableView | — |
| `flags` | `flags-*` | 45 | Ti.Android.Intent, Ti.Android.Notification, wakeLockOptions +3 more | Android only |
| `flagSecure` | `flag-secure`, `flag-secure-false` | 2 | NavigationWindow, TabGroup, Window | — |
| `flip` | `flip-horizontal`, `flip-vertical` | 2 | For the Animation Component | — |
| `focusable` | `focusable`, `focusable-false` | 2 | View, Ti.Media.VideoPlayer, Android.CardView +26 more | — |
| `font.fontFamily` | `font-mono`, `font-sans`, `font-serif` | 3 | ActivityIndicator, Button, Label +9 more | some variants platform-only |
| `font.fontSize` | `text-*` | 13 | ActivityIndicator, Button, Label +9 more | — |
| `font.fontStyle` | `italic`, `not-italic` | 2 | ActivityIndicator, Button, Label +9 more | — |
| `font.fontWeight` | `font-*` | 9 | ActivityIndicator, Button, Label +9 more | — |
| `footerDividersEnabled` | `footer-dividers-enabled`, `footer-dividers-enabled-false` | 2 | ListView, TableView | — |
| `forceBottomPosition` | `force-bottom-position`, `force-bottom-position-false` | 2 | TabGroup | — |
| `forceModal` | `force-modal`, `force-modal-false` | 2 | openWindowParams | — |
| `forceSplashAsSnapshot` | `force-splash-as-snapshot`, `force-splash-as-snapshot-false` | 2 | Ti.App | — |
| `forceTouchSupported` | `force-touch-supported`, `force-touch-supported-false` | 2 | iOS | — |
| `forceUpdates` | `force-updates`, `force-updates-false` | 2 | ListView | — |
| `format` | `format-audio-fileformat-*` | 9 | Ti.Media.AudioRecorder | — |
| `format24` | `format24`, `format24-false` | 2 | Picker | — |
| `frequency` | `frequency-calendar-recurrence-daily`, `frequency-calendar-recurrence-weekly`, `frequency-calendar-recurrence-monthly`, `frequency-calendar-recurrence-yearly` | 4 | Ti.Calendar.RecurrenceRule, iOS.AnchorAttachmentBehavior, iOS.ViewAttachmentBehavior | — |
| `fullscreen` | `fullscreen`, `fullscreen-false` | 2 | Ti.Media.VideoPlayer, NavigationWindow, TabGroup +5 more | — |
| `generatedMessage` | `generated-message`, `generated-message-false` | 2 | assert.AssertionError | — |
| `getters` | `getters`, `getters-false` | 2 | UtilInspectOptions | — |
| `gravity` | `gravity-*` | 27 | Notification | Android only |
| `grouping` | `grouping-music-media-group-*` | 8 | MediaQueryType | — |
| `groupSummary` | `group-summary`, `group-summary-false` | 2 | Ti.Android.Notification | — |
| `handleLinks` | `handle-links`, `handle-links-false` | 2 | TextArea | — |
| `hasAlarm` | `has-alarm`, `has-alarm-false` | 2 | Ti.Calendar.Event | — |
| `hasCheck` | `has-check`, `has-check-false` | 2 | TableViewRow | — |
| `hasChild` | `has-child`, `has-child-false` | 2 | TableViewRow | — |
| `hasCompass` | `has-compass`, `has-compass-false` | 2 | Ti.Geolocation | — |
| `hasDetail` | `has-detail`, `has-detail-false` | 2 | TableViewRow | — |
| `hasProtectedAsset` | `has-protected-asset`, `has-protected-asset-false` | 2 | Ti.Media.Item, MediaQueryType | — |
| `headerDividersEnabled` | `header-dividers-enabled`, `header-dividers-enabled-false` | 2 | ListView, TableView | — |
| `height` | `platform-w`, `platform-h`, `platform-wh`, `platform-w-inverted`, `platform-h-inverted`, `platform-wh-inverted`, `inverted-platform-w`, `inverted-platform-h` | 8 | ActivityIndicator, Animation, iPad.Popover, View | some variants platform-only |
| `height` | `row-span-*` | 12 | ActivityIndicator, Animation, iPad.Popover +2 more | — |
| `height` | `grid`, `grid-flow-col`, `grid-flow-row` | 3 | View | — |
| `height` | `grid-rows-*` | 12 | ActivityIndicator, Animation, iPad.Popover +2 more | — |
| `height` | `items-start`, `items-end`, `items-center` | 3 | ActivityIndicator, Animaiton, View, Window | — |
| `height` | `rounded-full`, `rounded-full-*` | 41 | View, Ti.Media.VideoPlayer, Android.CardView +32 more | — |
| `height` | `wh-*` | 64 | View, Ti.Blob, Ti.Media.VideoPlayer +43 more | — |
| `height` | `size-*` | 64 | View, Ti.Blob, Ti.Media.VideoPlayer +43 more | — |
| `height` | `h-*` | 64 | View, Ti.Blob, CameraOpen +45 more | — |
| `hiddenBehavior` | `hidden-behavior-invisible`, `hidden-behavior-gone` | 2 | View, Ti.Media.VideoPlayer, ActivityIndicator +35 more | — |
| `hideKeyboardAccessoryView` | `hide-keyboard-accessory-view`, `hide-keyboard-accessory-view-false` | 2 | WebView | — |
| `hideLoadIndicator` | `hide-load-indicator`, `hide-load-indicator-false` | 2 | WebView | — |
| `hidesBackButton` | `hides-back-button`, `hides-back-button-false` | 2 | NavigationWindow, TabGroup, Window, iOS.SplitWindow | — |
| `hidesBarsOnSwipe` | `hides-bars-on-swipe`, `hides-bars-on-swipe-false` | 2 | NavigationWindow, TabGroup, Window, iOS.SplitWindow | — |
| `hidesBarsOnTap` | `hides-bars-on-tap`, `hides-bars-on-tap-false` | 2 | NavigationWindow, TabGroup, Window, iOS.SplitWindow | — |
| `hidesBarsWhenKeyboardAppears` | `hides-bars-when-keyboard-appears`, `hides-bars-when-keyboard-appears-false` | 2 | NavigationWindow, TabGroup, Window, iOS.SplitWindow | — |
| `hideSearchOnSelection` | `hide-search-on-selection`, `hide-search-on-selection-false` | 2 | TableView | — |
| `hideShadow` | `hide-shadow`, `hide-shadow-false` | 2 | TabGroup, Window, iOS.SplitWindow | — |
| `hidesSearchBarWhenScrolling` | `hides-search-bar-when-scrolling`, `hides-search-bar-when-scrolling-false` | 2 | NavigationWindow, TabGroup, Window, iOS.SplitWindow | — |
| `highlightedColor` | `highlighted-*` | 245 | Label | — |
| `hintTextColor` | `placeholder-*` | 245 | Android.SearchView, SearchBar, TextArea, TextField | — |
| `hintTextColor` | `hint-text-*` | 245 | Android.SearchView, SearchBar, TextArea, TextField | — |
| `hintType` | `hint-type-static`, `hint-type-animated` | 2 | TextArea, TextField | — |
| `hires` | `hires`, `hires-false` | 2 | ImageView | — |
| `homeButtonEnabled` | `home-button-enabled`, `home-button-enabled-false` | 2 | Ti.Android.ActionBar | — |
| `homeIndicatorAutoHidden` | `home-indicator-auto-hidden`, `home-indicator-auto-hidden-false` | 2 | NavigationWindow, TabGroup, Window, iOS.SplitWindow | — |
| `horizontalBounce` | `horizontal-bounce`, `horizontal-bounce-false` | 2 | ScrollView | — |
| `horizontalMargin` | `horizontal-margin-left`, `horizontal-margin-right`, `horizontal-margin-center` | 3 | Notification | — |
| `horizontalWrap` | `horizontal-wrap`, `horizontal-wrap-false` | 2 | View, Ti.Media.VideoPlayer, Android.CardView +32 more | — |
| `hour12` | `hour12`, `hour12-false` | 2 | DateTimeFormatOptions | — |
| `html` | `html`, `html-false` | 2 | EmailDialog, Label, TextArea, WebView | — |
| `httponly` | `httponly`, `httponly-false` | 2 | Ti.Network.Cookie | — |
| `hyphenationFrequency` | `hyphenation-frequency-hyphen-none`, `hyphenation-frequency-hyphen-normal`, `hyphenation-frequency-hyphen-full`, `hyphenation-frequency-hyphen-normal-fast`, `hyphenation-frequency-hyphen-full-fast` | 5 | Label | — |

### I–O

| Property | Classes | Count | Components | Platform |
| --- | --- | --- | --- | --- |
| `icon` | `r-drawable-*` | 169 | — | Android only |
| `icon` | `icon-shortcut-type-*` | 29 | Ti.Android.ActionBar, Ti.Android.MenuItem, Ti.Android.Notification +4 more | iOS only |
| `iconColor` | `icon-*` | 245 | SearchBar | — |
| `iconified` | `iconified`, `iconified-false` | 2 | Android.SearchView, SearchBar | — |
| `iconifiedByDefault` | `iconified-by`, `iconified-by-false` | 2 | Android.SearchView, SearchBar | — |
| `iconIsMask` | `icon-is-mask`, `icon-is-mask-false` | 2 | Tab | — |
| `idleTimerDisabled` | `idle-timer-disabled`, `idle-timer-disabled-false` | 2 | Ti.App | — |
| `ignorePunctuation` | `ignore-punctuation`, `ignore-punctuation-false` | 2 | CollatorOptions | — |
| `ignoreSslError` | `ignore-ssl-error`, `ignore-ssl-error-false` | 2 | WebView | — |
| `imageHeight` | `image-h-*` | 64 | Android.CollapseToolbar | — |
| `imageIsMask` | `image-is-mask`, `image-is-mask-false` | 2 | Button | — |
| `imagePadding` | `image-padding-*` | 35 | iOS.ButtonConfiguration | — |
| `imageTouchFeedback` | `image-touch-feedback`, `image-touch-feedback-false` | 2 | ImageView | — |
| `imageTouchFeedbackColor` | `image-touch-feedback-*` | 245 | ImageView | — |
| `importance` | `importance`, `importance-*` | 7 | Ti.Android.NotificationChannel | Android only |
| `inBackground` | `in-background`, `in-background-false` | 2 | PushNotificationData | — |
| `includeFontPadding` | `include-font-padding`, `include-font-padding-false` | 2 | Label | — |
| `includeNote` | `include-note`, `include-note-false` | 2 | Ti.Contacts | — |
| `includeOpaqueBars` | `include-opaque-bars`, `include-opaque-bars-false` | 2 | NavigationWindow, TabGroup, Window, iOS.SplitWindow | — |
| `indentionLevel` | `indention-level-*` | 35 | TableViewRow | — |
| `indicatorColor` | `indicator-*` | 245 | ActivityIndicator | — |
| `injectionTime` | `injection-time-document-start`, `injection-time-document-end` | 2 | UserScriptParams | iOS only |
| `inPopOver` | `in-pop-over`, `in-pop-over-false` | 2 | CameraOptionsType | — |
| `inputs` | `inputs-audio-session-port-*` | 14 | RouteDescription | — |
| `inputType` | `input-type-class-number`, `input-type-class-text` | 2 | TextField | — |
| `interactive` | `interactive`, `interactive-false` | 2 | GlassEffectConfiguration | — |
| `interactiveDismissModeEnabled` | `interactive-dismiss-mode-enabled`, `interactive-dismiss-mode-enabled-false` | 2 | NavigationWindow, TabGroup | — |
| `isCameraSupported` | `is-camera-supported`, `is-camera-supported-false` | 2 | Ti.Media | — |
| `isCloudItem` | `is-cloud-item`, `is-cloud-item-false` | 2 | Ti.Media.Item, MediaQueryType | — |
| `isCompilation` | `is-compilation`, `is-compilation-false` | 2 | Ti.Media.Item, MediaQueryType | — |
| `isDetached` | `is-detached`, `is-detached-false` | 2 | Ti.Calendar.Event | — |
| `isExplicit` | `is-explicit`, `is-explicit-false` | 2 | Ti.Media.Item | — |
| `isLeftOpen` | `is-left-open`, `is-left-open-false` | 2 | Android.DrawerLayout | — |
| `isLeftVisible` | `is-left-visible`, `is-left-visible-false` | 2 | Android.DrawerLayout | — |
| `isLocal` | `is-local`, `is-local-false` | 2 | Ti.Network.BonjourService | — |
| `isOrganizer` | `is-organizer`, `is-organizer-false` | 2 | Ti.Calendar.Attendee | — |
| `isRightOpen` | `is-right-open`, `is-right-open-false` | 2 | Android.DrawerLayout | — |
| `isRightVisible` | `is-right-visible`, `is-right-visible-false` | 2 | Android.DrawerLayout | — |
| `isSearching` | `is-searching`, `is-searching-false` | 2 | Ti.Network.BonjourBrowser | — |
| `isTranslatedBinaryOnAppleSilicon` | `is-translated-binary-on-apple-silicon`, `is-translated-binary-on-apple-silicon-false` | 2 | Ti.Platform | — |
| `itemContentType` | `item-content-type-uttype-*` | 33 | Ti.App.iOS.SearchableItemAttributeSet | iOS only |
| `javaScriptCanOpenWindowsAutomatically` | `java-script-can-open-windows-automatically`, `java-script-can-open-windows-automatically-false` | 2 | WebViewPreferencesObject | — |
| `javaScriptEnabled` | `java-script-enabled`, `java-script-enabled-false` | 2 | WebViewPreferencesObject | — |
| `keepHardwareMode` | `keep-hardware-mode`, `keep-hardware-mode-false` | 2 | View, Ti.Media.VideoPlayer, ActivityIndicator +37 more | — |
| `keepScreenOn` | `keep-screen-on`, `keep-screen-on-false` | 2 | View, Ti.Media.VideoPlayer, Android.CardView +27 more | — |
| `keepSectionsInSearch` | `keep-sections-in-search`, `keep-sections-in-search-false` | 2 | ListView | — |
| `keyboardAppearance` | `keyboard-appearance`, `keyboard-appearance-dark`, `keyboard-appearance-light` | 3 | AlertDialog, SearchBar, TextArea, TextField | — |
| `keyboardDismissMode` | `keyboard-dismiss-mode-none`, `keyboard-dismiss-mode-on-drag`, `keyboard-dismiss-mode-interactive` | 3 | ListView, ScrollView, TableView | iOS only |
| `keyboardDisplayRequiresUserAction` | `keyboard-display-requires-user-action`, `keyboard-display-requires-user-action-false` | 2 | WebView | — |
| `keyboardToolbarColor` | `keyboard-toolbar-*` | 245 | TextArea, TextField | — |
| `keyboardToolbarHeight` | `keyboard-toolbar-h-*` | 35 | TextArea, TextField | — |
| `keyboardType` | `keyboard-type`, `keyboard-type-*` | 11 | AlertDialog, SearchBar, TextArea, TextField | — |
| `keyboardVisible` | `keyboard-visible`, `keyboard-visible-false` | 2 | Ti.App | — |
| `kind` | `kind-contacts-organization`, `kind-contacts-person` | 2 | Ti.App.iOS.SearchableItemAttributeSet, Ti.Contacts.Person | — |
| `largeTitleDisplayMode` | `large-title-display-mode-automatic`, `large-title-display-mode-always`, `large-title-display-mode-never` | 3 | NavigationWindow, TabGroup, Window, iOS.SplitWindow | iOS only |
| `largeTitleEnabled` | `large-title-enabled`, `large-title-enabled-false` | 2 | NavigationWindow, TabGroup, Window, iOS.SplitWindow | — |
| `launchOptionsLocationKey` | `launch-options-location-key`, `launch-options-location-key-false` | 2 | launchOptions | — |
| `layerType` | `layer-type-web-view-none`, `layer-type-web-view-software`, `layer-type-web-view-hardware` | 3 | WebView | — |
| `layout` | `grid`, `grid-flow-col`, `grid-flow-row` | 3 | View | — |
| `layout` | `vertical`, `horizontal`, `composite` | 3 | View, Ti.Android.R, Ti.Media.VideoPlayer +31 more | — |
| `lazyLoadingEnabled` | `lazy-loading-enabled`, `lazy-loading-enabled-false` | 2 | ListView | — |
| `left` | `m-*`, `my-*`, `mx-*`, `mt-*`, `mr-*`, `mb-*`, `ml-*`, `-m-*`, … | 1134 | — | — |
| `left` | `top-auto`, `left-auto`, `right-auto`, `bottom-auto`, `inset-x-0`, `inset-y-0`, `inset-0`, `inset-x-auto`, … | 10 | ActivityIndicator, Animation, View, Window | — |
| `left` | `gap-*` | 259 | ActivityIndicator, Animation, View, Window | — |
| `left` | `left-*` | 63 | View, Ti.Media.VideoPlayer, ActivityIndicator +41 more | — |
| `leftButtonMode` | `left-button-mode-always`, `left-button-mode-never`, `left-button-mode-onblur`, `left-button-mode-onfocus` | 4 | TextField | — |
| `leftButtonPadding` | `left-button-padding-*` | 35 | TextField | — |
| `leftDrawerLockMode` | `left-drawer-lock-mode-locked-closed`, `left-drawer-lock-mode-locked-open`, `left-drawer-lock-mode-undefined`, `left-drawer-lock-mode-unlocked` | 4 | Android.DrawerLayout | Android only |
| `leftTrackLeftCap` | `left-track-cap-*` | 35 | Slider | — |
| `leftTrackTopCap` | `left-track-top-cap-*` | 35 | Slider | — |
| `leftWidth` | `left-w-*` | 64 | Android.DrawerLayout | — |
| `letterSpacing` | `letter-spacing-*` | 64 | Label | — |
| `lightColor` | `light-*` | 245 | Ti.Android.NotificationChannel | — |
| `lightTouchEnabled` | `light-touch-enabled`, `light-touch-enabled-false` | 2 | WebView | — |
| `lineBreakMode` | `line-break-mode-attribute-by-word-wrapping`, `line-break-mode-attribute-by-char-wrapping`, `line-break-mode-attribute-by-clipping`, `line-break-mode-attribute-by-truncating-head`, `line-break-mode-attribute-by-truncating-middle`, `line-break-mode-attribute-by-truncating-tail` | 6 | ParagraphAttribute | — |
| `lineHeightMultiple` | `line-h-multiple-*` | 64 | ParagraphAttribute | — |
| `lines` | `lines-*` | 12 | Label, TextArea | — |
| `lineSpacing` | `line-spacing-*` | 64 | ParagraphAttribute, Label | — |
| `loading` | `loading`, `loading-false` | 2 | WebView, iOS.ButtonConfiguration | — |
| `location` | `location-progress-indicator-dialog`, `location-progress-indicator-status-bar` | 2 | Ti.Calendar.Event, Ti.Network.HTTPClient, Android.ProgressIndicator +2 more | Android only |
| `locationAccuracyAuthorization` | `location-accuracy-authorization-full`, `location-accuracy-authorization-reduced` | 2 | Ti.Geolocation | — |
| `locationServicesAuthorization` | `location-services-authorization-denied`, `location-services-authorization-restricted`, `location-services-authorization-unknown`, `location-services-authorization-always`, `location-services-authorization-when-in-use` | 5 | Ti.Geolocation | — |
| `locationServicesEnabled` | `location-services-enabled`, `location-services-enabled-false` | 2 | Ti.Geolocation | — |
| `lockScreenSetting` | `lock-screen-setting-not-supported`, `lock-screen-setting-enabled`, `lock-screen-setting-disabled` | 3 | GetUserNotificationSettings | iOS only |
| `lockscreenVisibility` | `lockscreen-visibility-private`, `lockscreen-visibility-public`, `lockscreen-visibility-secret` | 3 | Ti.Android.NotificationChannel | Android only |
| `loginKeyboardType` | `login-keyboard-type`, `login-keyboard-type-*` | 11 | AlertDialog | — |
| `loginReturnKeyType` | `login-return-key-type-*` | 12 | AlertDialog | — |
| `looping` | `looping`, `looping-false` | 2 | Ti.Media.Sound | — |
| `mainFrameOnly` | `main-frame-only`, `main-frame-only-false` | 2 | UserScriptParams | — |
| `manualMode` | `manual-mode`, `manual-mode-false` | 2 | Ti.Geolocation.Android | — |
| `masterIsOverlayed` | `master-is-overlayed`, `master-is-overlayed-false` | 2 | iOS.SplitWindow | — |
| `masterViewVisible` | `master-view-visible`, `master-view-visible-false` | 2 | iOS.SplitWindow | — |
| `maxElevation` | `max-elevation-*` | 35 | Android.CardView | — |
| `maxImages` | `max-images`, `max-images-false` | 2 | PhotoGalleryOptionsType | — |
| `maximumLineHeight` | `maximum-line-h-*` | 35 | ParagraphAttribute | — |
| `maxLines` | `max-lines-*` | 12 | Label, TextArea | — |
| `maxRowHeight` | `max-row-h-*` | 35 | TableView | — |
| `maxZoomScale` | `max-zoom-scale-*` | 15 | ScrollView | — |
| `mediaType` | `media-type-music-all`, `media-type-music-any-audio`, `media-type-music-audiobook`, `media-type-music`, `media-type-music-podcast` | 5 | Ti.Media.Item, MediaQueryType, CameraMediaItemType | — |
| `mediaTypes` | `media-types-*` | 18 | Ti.App.iOS.SearchableItemAttributeSet, MusicLibraryOptionsType, CameraOptionsType +2 more | — |
| `mediaTypesRequiringUserActionForPlayback` | `media-types-requiring-user-action-for-playback-audiovisual-type-none`, `media-types-requiring-user-action-for-playback-audiovisual-type-audio`, `media-types-requiring-user-action-for-playback-audiovisual-type-video`, `media-types-requiring-user-action-for-playback-audiovisual-type-all` | 4 | iOS.WebViewConfiguration | iOS only |
| `method` | `method-calendar-alert`, `method-calendar`, `method-calendar-email`, `method-calendar-sms` | 4 | Ti.Calendar.Reminder | — |
| `minimizeBehavior` | `minimize-behavior-tab-group-automatic`, `minimize-behavior-tab-group-never`, `minimize-behavior-tab-group-on-scroll-up`, `minimize-behavior-tab-group-on-scroll-down` | 4 | TabGroup | iOS only |
| `minimumFontSize` | `minimum-text-*` | 13 | label, TextField | — |
| `minimumLineHeight` | `minimum-line-h-*` | 64 | ParagraphAttribute | — |
| `minRowHeight` | `min-row-h-*` | 35 | TableView | — |
| `minZoomScale` | `min-zoom-scale-*` | 15 | ScrollView | — |
| `mixedContentMode` | `mixed-content-mode`, `mixed-content-mode-false` | 2 | WebView | — |
| `modal` | `modal`, `modal-false` | 2 | NavigationWindow, TabGroup, Window +2 more | — |
| `modalStyle` | `modal-style-presentation-current-context`, `modal-style-presentation-over-current-context`, `modal-style-presentation-over-current-full-screen`, `modal-style-presentation-formsheet`, `modal-style-presentation-fullscreen`, `modal-style-presentation-pagesheet` | 6 | openWindowParams | iOS only |
| `modalTransitionStyle` | `modal-transition-style-cover-vertical`, `modal-transition-style-cross-dissolve`, `modal-transition-style-flip-horizontal`, `modal-transition-style-partial-curl` | 4 | openWindowParams | iOS only |
| `mode` | `mode-*` | 31 | fs.Stats, fs.appendFile.options, fs.mkdir.options +3 more | — |
| `moveable` | `moveable`, `moveable-false` | 2 | TableView, TableViewRow | — |
| `moveByAnimate` | `move-by-animate`, `move-by-animate-false` | 2 | — | — |
| `moveByAnimation` | `move-by-animation`, `move-by-animation-false` | 2 | — | — |
| `moveByProperties` | `move-by-properties`, `move-by-properties-false` | 2 | — | — |
| `moviePlayerStatus` | `movie-player-status-video-load-state-failed`, `movie-player-status-video-load-state-playable`, `movie-player-status-video-load-state-unknown` | 3 | Ti.Media.VideoPlayer | — |
| `moving` | `moving`, `moving-false` | 2 | TableView | — |
| `multipleWindows` | `multiple-windows`, `multiple-windows-false` | 2 | WebView | — |
| `nativeSpinner` | `native-spinner`, `native-spinner-false` | 2 | Picker | — |
| `navBarColor` | `nav-bar-*` | 245 | NavigationWindow, TabGroup, Window | — |
| `navBarHidden` | `nav-bar-hidden`, `nav-bar-hidden-false` | 2 | TabGroup, Window, openWindowParams, iOS.SplitWindow | — |
| `navigationIconColor` | `navigation-icon-*` | 245 | Android.CollapseToolbar, Toolbar | — |
| `navigationMode` | `navigation-mode-standard`, `navigation-mode-tabs` | 2 | Ti.Android.ActionBar | Android only |
| `navTintColor` | `nav-tint-*` | 245 | TabGroup, Window, iOS.SplitWindow | — |
| `needsSave` | `needs-save`, `needs-save-false` | 2 | Ti.App.iOS.UserActivity | — |
| `networkType` | `network-type-lan`, `network-type-mobile`, `network-type-none`, `network-type-unknown`, `network-type-wifi` | 5 | Ti.Network | — |
| `noDeprecation` | `no-deprecation`, `no-deprecation-false` | 2 | process | — |
| `notificationCenterSetting` | `notification-center-setting-user-not-supported`, `notification-center-setting-user-enabled`, `notification-center-setting-user-disabled` | 3 | GetUserNotificationSettings | iOS only |
| `numeric` | `numeric`, `numeric-false` | 2 | CollatorOptions | — |
| `online` | `online`, `online-false` | 2 | Ti.Network | — |
| `onThumbColor` | `on-thumb-*` | 245 | Switch | — |
| `onTintColor` | `on-tint-*` | 245 | Switch | — |
| `opacity` | `opacity-to-0`, `opacity-to-100`, `toggle-visible` | 3 | Animation | — |
| `opacity` | `opacity-*` | 21 | View, Ti.Media.VideoPlayer, Android.CardView +33 more | — |
| `opaque` | `opaque`, `opaque-false` | 2 | Animation | — |
| `opaquebackground` | `opaquebackground`, `opaquebg-false` | 2 | OptionDialog | — |
| `options` | `options-category-none`, `options-category-custom-dismiss-action`, `options-category-allow-in-carplay`, `options-category-hidden-previews-show-title`, `options-category-hidden-previews-show-subtitle` | 5 | showParams, Ti.App.iOS.UserNotificationCategory, UserNotificationAttachment +2 more | iOS only |
| `orientationModes` | `orientation-landscape-left`, `orientation-landscape-right`, `orientation-portrait`, `orientation-upside-portrait`, `orientation-landscape`, `orientation-all` | 6 | NavigationWindow, TabGroup, Window, iOS.SplitWindow | — |
| `orientationModes` | `portrait`, `upside-portrait`, `landscape-left`, `landscape-right`, `landscape` | 5 | NavigationWindow, TabGroup, Window, iOS.SplitWindow | — |
| `outputs` | `outputs-audio-session-port-*` | 14 | RouteDescription | — |
| `overlayEnabled` | `overlay-enabled`, `overlay-enabled-false` | 2 | ScrollableView | — |
| `overrideCurrentAnimation` | `override-current-animation`, `override-current-animation-false` | 2 | View, Ti.Media.VideoPlayer, Android.CardView +28 more | — |
| `overrideUserInterfaceStyle` | `override-user-interface-style-unspecified`, `override-user-interface-style-light`, `override-user-interface-style-dark` | 3 | Picker, Ti.UI | — |
| `overScrollMode` | `over-scroll-mode-always`, `over-scroll-mode-if-content-scrolls`, `over-scroll-mode-never` | 3 | ScrollView, ScrollableView, TableView, WebView | Android only |

### P–S

| Property | Classes | Count | Components | Platform |
| --- | --- | --- | --- | --- |
| `padding` | `p-*`, `py-*`, `px-*`, `pt-*`, `pr-*`, `pb-*`, `pl-*` | 245 | Android.CardView, TextArea, TextField | — |
| `padding` | `padding-*` | 35 | Android.CardView, ScrollableView, TextArea +2 more | — |
| `paddingBottom` | `padding-bottom-*` | 35 | Android.CardView, TabGroup | — |
| `paddingLeft` | `padding-left-*` | 35 | Android.CardView, TabGroup | — |
| `paddingRight` | `padding-right-*` | 35 | Android.CardView, TabGroup | — |
| `paddingTop` | `padding-top-*` | 35 | Android.CardView | — |
| `pageHeight` | `page-h-*` | 35 | Ti.App.iOS.SearchableItemAttributeSet | — |
| `pageIndicatorColor` | `page-indicator-*` | 245 | ScrollableView | — |
| `pageWidth` | `page-w-*` | 35 | Ti.App.iOS.SearchableItemAttributeSet | — |
| `pagingControlAlpha` | `paging-control-alpha-*` | 21 | ScrollableView | — |
| `pagingControlColor` | `paging-control-*` | 245 | ScrollableView | — |
| `pagingControlHeight` | `paging-control-h-*` | 35 | ScrollableView | — |
| `pagingControlOnTop` | `paging-control-on-top`, `paging-control-on-top-false` | 2 | ScrollableView | — |
| `pagingControlTimeout` | `paging-control-timeout-*` | 22 | ScrollableView | — |
| `paragraphSpacingAfter` | `paragraph-spacing-after-*` | 64 | ParagraphAttribute | — |
| `paragraphSpacingBefore` | `paragraph-spacing-before-*` | 64 | ParagraphAttribute | — |
| `passwordKeyboardType` | `password-keyboard-type`, `password-keyboard-type-*` | 11 | AlertDialog | — |
| `passwordMask` | `password-mask`, `password-mask-false` | 2 | TextField | — |
| `passwordReturnKeyType` | `password-return-key-type-*` | 12 | AlertDialog | — |
| `pathOnly` | `path-only`, `path-only-false` | 2 | PhotoGalleryOptionsType | — |
| `pauseLocationUpdateAutomatically` | `pause-location-update-automatically`, `pause-location-update-automatically-false` | 2 | Ti.Geolocation | — |
| `persistent` | `persistent`, `persistent-false` | 2 | AlertDialog, OptionDialog | — |
| `physicalSizeCategory` | `physical-size-category-large`, `physical-size-category-normal`, `physical-size-category-small`, `physical-size-category-undefined`, `physical-size-category-xlarge` | 5 | Ti.Platform.Android | Android only |
| `pictureInPictureEnabled` | `picture-in-enabled`, `picture-in-enabled-false` | 2 | Ti.Media.VideoPlayer | — |
| `playbackState` | `playback-state-*` | 12 | Ti.Media.MusicPlayer, Ti.Media.VideoPlayer | — |
| `pluginState` | `plugin-state-webview-plugins-off`, `plugin-state-webview-plugins-on`, `plugin-state-webview-plugins-on-demand` | 3 | WebView | Android only |
| `position` | `position-*` | 8 | EncodeNumberDict, DecodeNumberDict, DecodeStringDict +3 more | some variants platform-only |
| `preventCornerOverlap` | `prevent-corner-overlap`, `prevent-corner-overlap-false` | 2 | Android.CardView | — |
| `preventDefaultImage` | `prevent-default-image`, `prevent-default-image-false` | 2 | ImageView | — |
| `providesAppNotificationSettings` | `provides-app-notification-settings-not-supported`, `provides-app-notification-settings-enabled`, `provides-app-notification-settings-disabled` | 3 | GetUserNotificationSettings | iOS only |
| `proximityDetection` | `proximity-detection`, `proximity-detection-false` | 2 | Ti.App | — |
| `proximityState` | `proximity-state`, `proximity-state-false` | 2 | Ti.App | — |
| `pruneSectionsOnEdit` | `prune-sections-on-edit`, `prune-sections-on-edit-false` | 2 | ListView | — |
| `pullBackgroundColor` | `pull-bg-*` | 245 | View, Ti.Media.VideoPlayer, Button +31 more | — |
| `pushMode` | `push-mode-continuous`, `push-mode-instantaneous` | 2 | iOS.PushBehavior | iOS only |
| `readyState` | `ready-state-network-httpclient-unsent`, `ready-state-network-httpclient-opened`, `ready-state-network-httpclient-headers-received`, `ready-state-network-httpclient-loading`, `ready-state-network-httpclient-done` | 5 | Ti.Network.HTTPClient, ReadyStatePayload | — |
| `recording` | `recording`, `recording-false` | 2 | Ti.Media.AudioRecorder, CameraOptionsType | — |
| `remoteNotificationsEnabled` | `remote-notifications-enabled`, `remote-notifications-enabled-false` | 2 | Ti.Network | — |
| `repeat` | `repeat-*` | 13 | NotificationParams, Animation | — |
| `repeatCount` | `repeat-count-*` | 12 | ImageView | — |
| `repeatMode` | `repeat-mode-music-player-all`, `repeat-mode-music-player`, `repeat-mode-music-player-none`, `repeat-mode-music-player-one`, `repeat-mode-video-none`, `repeat-mode-video-one` | 6 | Ti.Media.MusicPlayer, Ti.Media.VideoPlayer | — |
| `requestedOrientation` | `requested-orientation-screen-*` | 7 | Ti.Android.Activity | Android only |
| `requiresEditingToMove` | `requires-editing-to-move`, `requires-editing-to-move-false` | 2 | ListView | — |
| `resultsBackgroundColor` | `results-bg-*` | 245 | ListView, TableView | — |
| `resultsSeparatorColor` | `results-separator-*` | 245 | ListView, TableView | — |
| `resultsSeparatorStyle` | `results-separator-style-table-view-none`, `results-separator-style-table-view-single-line` | 2 | ListView, TableView | — |
| `returnKeyType` | `return-key-type-*` | 12 | AlertDialog, TextArea, TextField | — |
| `reverse` | `reverse`, `reverse-false` | 2 | ImageView | — |
| `right` | `m-*`, `my-*`, `mx-*`, `mt-*`, `mr-*`, `mb-*`, `ml-*`, `-m-*`, … | 1134 | — | — |
| `right` | `top-auto`, `left-auto`, `right-auto`, `bottom-auto`, `inset-x-0`, `inset-y-0`, `inset-0`, `inset-x-auto`, … | 10 | ActivityIndicator, Animation, View, Window | — |
| `right` | `gap-*` | 259 | ActivityIndicator, Animation, View, Window | — |
| `right` | `right-*` | 63 | View, Ti.Media.VideoPlayer, ActivityIndicator +39 more | — |
| `rightButtonMode` | `right-button-mode-always`, `right-button-mode-never`, `right-button-mode-onblur`, `right-button-mode-onfocus` | 4 | TextField | — |
| `rightButtonPadding` | `right-button-padding-*` | 35 | TextField | — |
| `rightDrawerLockMode` | `right-drawer-lock-mode-locked-closed`, `right-drawer-lock-mode-locked-open`, `right-drawer-lock-mode-undefined`, `right-drawer-lock-mode-unlocked` | 4 | Android.DrawerLayout | Android only |
| `rightTrackLeftCap` | `right-track-left-cap-*` | 35 | Slider | — |
| `rightTrackTopCap` | `right-track-top-cap-*` | 35 | Slider | — |
| `rightWidth` | `right-w-*` | 64 | Android.DrawerLayout | — |
| `role` | `role-calendar-attendee-unknown`, `role-calendar-attendee-optional`, `role-calendar-attendee-required`, `role-calendar-attendee-chair`, `role-calendar-attendee-non-participant` | 5 | Ti.App.iOS.SearchableItemAttributeSet, Ti.Calendar.Attendee | — |
| `rotate` | `-rotate-*` | 14 | For the Animation Component | — |
| `rotate` | `rotate-*` | 14 | Matrix2DCreationDict | — |
| `rowCount` | `row-count-*` | 12 | Ti.Database.ResultSet, DashboardView, PickerColumn, TableViewSection | — |
| `rowHeight` | `row-h-*` | 35 | TableView | — |
| `running` | `running`, `running-false` | 2 | iOS.Animator | — |
| `saveToPhotoGallery` | `save-to-photo-gallery`, `save-to-photo-gallery-false` | 2 | CameraOptionsType | — |
| `scale` | `scale-*` | 15 | Matrix2DCreationDict, Matrix3DCreationDict | — |
| `scalesPageToFit` | `scales-page-to-fit`, `scales-page-to-fit-false` | 2 | WebView | — |
| `scaleX` | `scale-x-*` | 15 | View, Ti.Media.VideoPlayer, ActivityIndicator +35 more | — |
| `scaleY` | `scale-y-*` | 15 | View, Ti.Media.VideoPlayer, ActivityIndicator +35 more | — |
| `scalingMode` | `bg-auto`, `bg-fill`, `bg-none`, `bg-cover`, `bg-contain` | 5 | ImageView | — |
| `scalingMode` | `object-auto`, `object-fill`, `object-none`, `object-cover`, `object-contain` | 5 | ImageView | — |
| `scalingMode` | `scaling-mode-*` | 8 | Ti.Media, Ti.Media.VideoPlayer, ImageView | — |
| `scrollable` | `scrollable`, `scrollable-false` | 2 | TableView, TextArea | — |
| `scrollbars` | `scrollbars-webview`, `scrollbars-webview-hide-vertical`, `scrollbars-webview-hide-horizontal`, `scrollbars-webview-hide-all` | 4 | WebView | Android only |
| `scrollIndicatorStyle` | `scroll-indicator-style-black`, `scroll-indicator-style`, `scroll-indicator-style-white` | 3 | ListView, ScrollView, TableView | iOS only |
| `scrollingEnabled` | `scrolling-enabled`, `scrolling-enabled-false` | 2 | ScrollView, ScrollableView | — |
| `scrollsToTop` | `scrolls-to-top`, `scrolls-to-top-false` | 2 | ScrollView, TableView, TextArea, WebView | — |
| `scrollType` | `scroll-type-horizontal`, `scroll-type-vertical` | 2 | ScrollView | — |
| `searchAsChild` | `search-as-child`, `search-as-child-false` | 2 | TableView | — |
| `searchHidden` | `search-hidden`, `search-hidden-false` | 2 | TableView | — |
| `sectionHeaderTopPadding` | `section-header-top-padding-*` | 35 | ListView, TableView | — |
| `secure` | `secure`, `secure-false` | 2 | Ti.Network.Cookie, Ti.Network.Socket.TCP, WebView | — |
| `selected` | `selected`, `selected-false` | 2 | Ti.Calendar.Calendar, iOS.CoverFlowView | — |
| `selectedBackgroundColor` | `selected-bg-*` | 245 | ListItem, OptionBar, TabbedBar, TableViewRow | — |
| `selectedBorderColor` | `selected-border-*` | 245 | OptionBar | — |
| `selectedButtonColor` | `selected-button-*` | 245 | ButtonBar | — |
| `selectedColor` | `selected-*` | 245 | Button, ListItem, TableViewRow | — |
| `selectedSubtitleColor` | `selected-subtitle-*` | 245 | ListItem | — |
| `selectedTextColor` | `selected-text-*` | 245 | ButtonBar, OptionBar, TabbedBar | — |
| `selectionGranularity` | `selection-granularity-dynamic`, `selection-granularity-character` | 2 | WebView, iOS.WebViewConfiguration | iOS only |
| `selectionIndicator` | `selection-indicator`, `selection-indicator-false` | 2 | Picker | — |
| `selectionLimit` | `selection-limit`, `selection-limit-false` | 2 | PhotoGalleryOptionsType | — |
| `selectionOpens` | `selection-opens`, `selection-opens-false` | 2 | Picker | — |
| `selectionStyle` | `selection-style-none`, `selection-style` | 2 | ListItem, TableViewRow | — |
| `separatorColor` | `separator-*` | 245 | ListView, TableView | — |
| `separatorHeight` | `separator-h-*` | 35 | ListView | — |
| `separatorStyle` | `separator-style-table-view-none`, `separator-style-table-view-single-line` | 2 | ListView, TableView | — |
| `severity` | `severity-alert`, `severity-alert-critical` | 2 | AlertDialog | iOS only |
| `shadowColor` | `drop-shadow`, `drop-shadow-*` | 8 | Button, Label | — |
| `shadowColor` | `shadow-*` | 245 | Button, Label | — |
| `shadowOffset` | `drop-shadow`, `drop-shadow-*` | 8 | Button, Label | — |
| `shadowRadius` | `drop-shadow`, `drop-shadow-*` | 8 | Button, Label | — |
| `shadowRadius` | `shadow-radius-*` | 35 | Button, Label | — |
| `shiftMode` | `shift-mode-none`, `shift-mode-title`, `shift-mode-icon` | 3 | TabGroup | — |
| `showAsAction` | `show-as-action-always`, `show-as-action-collapse-view`, `show-as-action-if-room`, `show-as-action-never`, `show-as-action-with-text` | 5 | Ti.Android.MenuItem | Android only |
| `showBackgroundLocationIndicator` | `show-bg-location-indicator`, `show-bg-location-indicator-false` | 2 | Ti.Geolocation | — |
| `showBadge` | `show-badge`, `show-badge-false` | 2 | Ti.Android.NotificationChannel | — |
| `showBookmark` | `show-bookmark`, `show-bookmark-false` | 2 | SearchBar | — |
| `showCalibration` | `show-calibration`, `show-calibration-false` | 2 | Ti.Geolocation | — |
| `showCancel` | `show-cancel`, `show-cancel-false` | 2 | SearchBar | — |
| `showControls` | `show-controls`, `show-controls-false` | 2 | CameraOptionsType | — |
| `showHidden` | `show-hidden`, `show-hidden-false` | 2 | UtilInspectOptions | — |
| `showHorizontalScrollIndicator` | `overflow-x-scroll`, `overflow-y-scroll`, `overflow-x-hidden`, `overflow-y-hidden`, `overflow-scroll`, `overflow-hidden` | 6 | ScrollView | — |
| `showHorizontalScrollIndicator` | `show-horizontal-scroll-indicator`, `show-horizontal-scroll-indicator-false` | 2 | ScrollView | — |
| `showMasterInPortrait` | `show-master-in-portrait`, `show-master-in-portrait-false` | 2 | iOS.SplitWindow | — |
| `showPagingControl` | `show-paging-control`, `show-paging-control-false` | 2 | ScrollableView | — |
| `showProxy` | `show-proxy`, `show-proxy-false` | 2 | UtilInspectOptions | — |
| `showsControls` | `shows-controls`, `shows-controls-false` | 2 | Ti.Media.VideoPlayer | — |
| `showSearchBarInNavBar` | `show-search-bar-in-nav`, `show-search-bar-in-nav-false` | 2 | ListView, TableView | — |
| `showSelectionCheck` | `show-selection-check`, `show-selection-check-false` | 2 | ListView, TableView | — |
| `showUndoRedoActions` | `show-undo-redo-actions`, `show-undo-redo-actions-false` | 2 | TextArea, TextField | — |
| `showVerticalScrollIndicator` | `overflow-x-scroll`, `overflow-y-scroll`, `overflow-x-hidden`, `overflow-y-hidden`, `overflow-scroll`, `overflow-hidden` | 6 | ScrollView | — |
| `showVerticalScrollIndicator` | `show-vertical-scroll-indicator`, `show-vertical-scroll-indicator-false` | 2 | ListView, ScrollView, TableView | — |
| `shuffleMode` | `shuffle-mode-music-player-albums`, `shuffle-mode-music-player`, `shuffle-mode-music-player-none`, `shuffle-mode-music-player-songs` | 4 | Ti.Media.MusicPlayer | — |
| `smoothScrollOnTabClick` | `smooth-scroll-on-tab-click`, `smooth-scroll-on-tab-click-false` | 2 | TabGroup | — |
| `softKeyboardOnFocus` | `soft-keyboard-on-focus`, `soft-keyboard-on-focus-hide`, `soft-keyboard-on-focus-show` | 3 | View, Ti.Media.VideoPlayer, Android.CardView +25 more | Android only |
| `sorted` | `sorted`, `sorted-false` | 2 | UtilInspectOptions | — |
| `soundSetting` | `sound-setting-not-supported`, `sound-setting-enabled`, `sound-setting-disabled` | 3 | GetUserNotificationSettings | iOS only |
| `sourceType` | `source-type-calendar-local`, `source-type-calendar-exchange`, `source-type-calendar-caldav`, `source-type-calendar-mobileme`, `source-type-calendar-subscribed`, `source-type-calendar-birthdays` | 6 | Ti.Calendar.Calendar | — |
| `splitTrack` | `split-track`, `split-track-false` | 2 | Slider | — |
| `startMode` | `start-mode-not-sticky`, `start-mode-redeliver-intent` | 2 | ServiceIntentOptions | Android only |
| `state` | `state-*` | 19 | Ti.Android.QuickSettingsService, Ti.Calendar.Alert, GeocodedAddress +3 more | some variants platform-only |
| `status` | `status-calendar-*` | 13 | Ti.Calendar.Attendee, Ti.Calendar.Event, Ti.Network.HTTPClient | — |
| `statusBarBackgroundColor` | `status-bar-bg-*` | 245 | iOS | — |
| `statusBarColor` | `status-bar-*` | 245 | NavigationWindow, TabGroup, Window | — |
| `statusBarHeight` | `status-bar-h-*` | 64 | Ti.UI | — |
| `statusBarStyle` | `status-bar`, `status-bar-dark`, `status-bar-light` | 3 | Window | iOS only |
| `statusBarStyle` | `status-bar-style`, `status-bar-style-light-content` | 2 | NavigationWindow, TabGroup, Window, iOS.SplitWindow | iOS only |
| `stopped` | `stopped`, `stopped-false` | 2 | Ti.Media.AudioRecorder | — |
| `style` | `alert-dialog-style`, `alert-dialog-style-login-and-password`, `alert-dialog-style-plain-text-input`, `alert-dialog-style-secure-text-input` | 4 | — | iOS only |
| `style` | `progress-bar-style-bar`, `progress-bar-style`, `progress-bar-style-plain` | 3 | ProgressBar | iOS only |
| `style` | `style-*` | 32 | NumberFormatOptions, Ti.Android.Notification, Ti.Android.R +16 more | some variants platform-only |
| `submitEnabled` | `submit-enabled`, `submit-enabled-false` | 2 | Android.SearchView | — |
| `subtitleColor` | `subtitle-*` | 245 | ListItem | — |
| `subtitleTextColor` | `subtitle-text-*` | 245 | Toolbar | — |
| `success` | `success`, `success-false` | 2 | RequestPermissionAccessResult, EventsAuthorizationResponse, ContactsAuthorizationResponse +34 more | — |
| `suppressesIncrementalRendering` | `suppresses-incremental-rendering`, `suppresses-incremental-rendering-false` | 2 | iOS.WebViewConfiguration | — |
| `suppressReturn` | `suppress-return`, `suppress-return-false` | 2 | TextArea, TextField | — |
| `sustainedPerformanceMode` | `sustained-performance-mode`, `sustained-performance-mode-false` | 2 | NavigationWindow, TabGroup, Window | — |
| `swipeable` | `swipeable`, `swipeable-false` | 2 | TabGroup | — |
| `swipeToClose` | `swipe-to-close`, `swipe-to-close-false` | 2 | TabGroup, Window | — |
| `systemButton` | `system-button-*` | 26 | Button | iOS only |

### T–Z

| Property | Classes | Count | Components | Platform |
| --- | --- | --- | --- | --- |
| `tabBarHidden` | `tab-bar-hidden`, `tab-bar-hidden-false` | 2 | TabGroup, Window, iOS.SplitWindow | — |
| `tabBarVisible` | `tab-bar-visible`, `tab-bar-visible-false` | 2 | TabGroup | — |
| `tabMode` | `tab-mode-fixed`, `tab-mode-scrollable` | 2 | TabGroup | Android only |
| `tabsBackgroundColor` | `tabs-bg-*` | 245 | TabGroup | — |
| `tabsBackgroundSelectedColor` | `tabs-bg-selected-*` | 245 | TabGroup | — |
| `tabsTranslucent` | `tabs-translucent`, `tabs-translucent-false` | 2 | TabGroup | — |
| `targetImageHeight` | `target-image-h-*` | 64 | CameraOptionsType | — |
| `targetImageWidth` | `target-image-w-*` | 64 | CameraOptionsType | — |
| `textAlign` | `text-center`, `text-justify`, `text-left`, `text-right` | 4 | Button, Label, Picker +4 more | — |
| `textColor` | `text-*` | 245 | Button, Label, PickerRow +10 more | — |
| `textStyle` | `text-style-*` | 11 | Font | — |
| `theme` | `theme-*` | 24 | Window | — |
| `throwDeprecation` | `throw-deprecation`, `throw-deprecation-false` | 2 | process | — |
| `thumbColor` | `thumb-*` | 245 | Switch | — |
| `thumbTintColor` | `thumb-tint-*` | 245 | Switch | — |
| `timeout` | `timeout-*` | 22 | Ti.Network.HTTPClient, Ti.Network.Socket.TCP, AcceptDict, WebView | — |
| `tint` | `tint-*` | 245 | MaskedImage | — |
| `tintColor` | `tint-color-*` | 245 | View, Ti.Media.VideoPlayer, AlertDialog +35 more | — |
| `titleAttributes` | `title-attributes-shadow`, `title-attributes-shadow-*` | 8 | TabGroup, Window | — |
| `titleAttributes` | `title-attributes-*` | 245 | TabGroup, Window | — |
| `titleAttributes` | `title-attributes-shadow-*` | 245 | TabGroup, Window | — |
| `titleColor` | `title-*` | 245 | Tab, TabGroup | — |
| `titlePadding` | `title-padding-*` | 35 | iOS.ButtonConfiguration | — |
| `titleTextColor` | `title-text-*` | 245 | Toolbar | — |
| `tlsVersion` | `tls-version-network-1-0`, `tls-version-network-1`, `tls-version-network-1-2`, `tls-version-network-1-3` | 4 | Ti.Network.HTTPClient | — |
| `toolbarEnabled` | `toolbar-enabled`, `toolbar-enabled-false` | 2 | Android.DrawerLayout | — |
| `top` | `m-*`, `my-*`, `mx-*`, `mt-*`, `mr-*`, `mb-*`, `ml-*`, `-m-*`, … | 1134 | — | — |
| `top` | `items-start`, `items-end`, `items-center` | 3 | ActivityIndicator, Animaiton, View, Window | — |
| `top` | `top-auto`, `left-auto`, `right-auto`, `bottom-auto`, `inset-x-0`, `inset-y-0`, `inset-0`, `inset-x-auto`, … | 10 | ActivityIndicator, Animation, View, Window | — |
| `top` | `gap-*` | 259 | ActivityIndicator, Animation, View, Window | — |
| `top` | `top-*` | 63 | View, Ti.Media.VideoPlayer, ActivityIndicator +41 more | — |
| `torch` | `torch`, `torch-false` | 2 | Ti.Media | — |
| `touchEnabled` | `pointer-events-auto`, `pointer-events-none` | 2 | View | — |
| `touchEnabled` | `touch-enabled`, `touch-enabled-false` | 2 | View, Ti.Media.VideoPlayer, Android.CardView +34 more | — |
| `touchFeedback` | `touch-feedback`, `touch-feedback-false` | 2 | View, Ti.Media.VideoPlayer, ActivityIndicator +34 more | — |
| `touchFeedbackColor` | `touch-feedback-*` | 245 | View, Ti.Media.VideoPlayer, ActivityIndicator +35 more | — |
| `traceDeprecation` | `trace-deprecation`, `trace-deprecation-false` | 2 | process | — |
| `trackSignificantLocationChange` | `track-significant-location-change`, `track-significant-location-change-false` | 2 | Ti.Geolocation | — |
| `trackTintColor` | `track-tint-*` | 245 | ProgressBar, Slider | — |
| `trackUserInteraction` | `track-user-interaction`, `track-user-interaction-false` | 2 | Ti.App | — |
| `transition` | `transition-animation-style-*` | 8 | Animation | iOS only |
| `translucent` | `translucent`, `translucent-false` | 2 | TabGroup, Toolbar, Window +2 more | — |
| `treatReferenceAsBoundary` | `treat-reference-as-boundary`, `treat-reference-as-boundary-false` | 2 | iOS.CollisionBehavior | — |
| `type` | `type-*` | 41 | DateTimeFormattedPart, NumberFormattedPart, EmitWarningOptions +16 more | some variants platform-only |
| `unique` | `unique`, `unique-false` | 2 | Clipboard | — |
| `updateCurrentIntent` | `update-current-intent`, `update-current-intent-false` | 2 | Ti.Android.PendingIntent | — |
| `uprightHeight` | `upright-h-*` | 35 | Ti.Blob | — |
| `uprightWidth` | `upright-w-*` | 35 | Ti.Blob | — |
| `useCameraX` | `use-camera-x`, `use-camera-x-false` | 2 | Ti.Media | — |
| `useCompatPadding` | `use-compat-padding`, `use-compat-padding-false` | 2 | Android.CardView | — |
| `useGrouping` | `use-grouping`, `use-grouping-false` | 2 | NumberFormatOptions | — |
| `userInterfaceStyle` | `user-interface-style-unspecified`, `user-interface-style-light`, `user-interface-style-dark` | 3 | Ti.App.iOS, Ti.UI | — |
| `useSpinner` | `use-spinner`, `use-spinner-false` | 2 | Picker | — |
| `validatesSecureCertificate` | `validates-secure-certificate`, `validates-secure-certificate-false` | 2 | Ti.Network.HTTPClient | — |
| `validRow` | `valid-row`, `valid-row-false` | 2 | Ti.Database.ResultSet | — |
| `value` | `value-attribute-*` | 10 | DateTimeFormattedPart, NumberFormattedPart, Ti.Buffer +16 more | — |
| `verticalAlign` | `vertical-align-center`, `vertical-align-top`, `vertical-align-bottom`, `vertical-align-text-bottom`, `vertical-align-text-center`, `vertical-align-text-top` | 6 | Ti.Media, Button, Label +3 more | — |
| `verticalBounce` | `vertical-bounce`, `vertical-bounce-false` | 2 | ScrollView | — |
| `verticalMargin` | `vertical-margin-top`, `vertical-margin-bottom`, `vertical-margin-middle` | 3 | Notification | — |
| `videoQuality` | `video-quality-*` | 7 | CameraOptionsType | — |
| `viewShadowColor` | `shadow`, `shadow-*` | 10 | iOS: Ti.UI.View, Android: Ti.UI.Android.CardView, Animation, View | — |
| `viewShadowColor` | `view-shadow-*` | 245 | View, Ti.Media.VideoPlayer, Android.CardView +34 more | — |
| `viewShadowOffset` | `shadow`, `shadow-*` | 10 | iOS: Ti.UI.View, Android: Ti.UI.Android.CardView, Animation, View | — |
| `viewShadowRadius` | `shadow`, `shadow-*` | 10 | iOS: Ti.UI.View, Android: Ti.UI.Android.CardView, Animation, View | — |
| `visibility` | `visibility-*` | 7 | Ti.Android.Notification, Ti.Calendar.Event | some variants platform-only |
| `visible` | `block`, `hidden` | 2 | View, Ti.Android.ActionBar, Ti.Android.MenuItem +37 more | — |
| `visible` | `visible`, `visible-false` | 2 | View, Ti.Android.ActionBar, Ti.Android.MenuItem +38 more | — |
| `waitsForConnectivity` | `waits-for-connectivity`, `waits-for-connectivity-false` | 2 | Ti.Network.HTTPClient | — |
| `whichCamera` | `which-camera-front`, `which-camera-rear` | 2 | CameraOptionsType | — |
| `width` | `platform-w`, `platform-h`, `platform-wh`, `platform-w-inverted`, `platform-h-inverted`, `platform-wh-inverted`, `inverted-platform-w`, `inverted-platform-h` | 8 | ActivityIndicator, Animation, iPad.Popover, View | some variants platform-only |
| `width` | `col-span-*` | 12 | ActivityIndicator, Animation, iPad.Popover +2 more | — |
| `width` | `grid`, `grid-flow-col`, `grid-flow-row` | 3 | View | — |
| `width` | `grid-cols-*` | 12 | ActivityIndicator, Animation, iPad.Popover +2 more | — |
| `width` | `items-start`, `items-end`, `items-center` | 3 | ActivityIndicator, Animaiton, View, Window | — |
| `width` | `rounded-full`, `rounded-full-*` | 41 | View, Ti.Media.VideoPlayer, Android.CardView +32 more | — |
| `width` | `wh-*` | 64 | View, Ti.Blob, Ti.Media.VideoPlayer +43 more | — |
| `width` | `size-*` | 64 | View, Ti.Blob, Ti.Media.VideoPlayer +43 more | — |
| `width` | `w-*` | 64 | View, Ti.Blob, CameraOpen +45 more | — |
| `willHandleTouches` | `will-handle-touches`, `will-handle-touches-false` | 2 | WebView | — |
| `willScrollOnStatusTap` | `will-scroll-on-status-tap`, `will-scroll-on-status-tap-false` | 2 | ListView | — |
| `windowPixelFormat` | `window-pixel-format-*` | 14 | NavigationWindow, TabGroup, Window | Android only |
| `windowSoftInputMode` | `window-soft-input-mode-*` | 9 | NavigationWindow, TabGroup, Window | Android only |
| `wobble` | `wobble`, `wobble-false` | 2 | DashboardView | — |
| `wraps` | `wraps`, `wraps-false` | 2 | StringSearchOptions, iOS.Stepper | — |
| `xOffset` | `x-offset-*` | 35 | Notification | — |
| `yOffset` | `y-offset-*` | 35 | Notification | — |
| `zIndex` | `z-index-0`, `z-index-10`, `z-index-20`, `z-index-30`, `z-index-40`, `z-index-50` | 6 | View, Ti.Media.VideoPlayer, Android.CardView +32 more | — |
| `zoomEnabled` | `zoom-enabled`, `zoom-enabled-false` | 2 | CameraOptionsType | — |
| `zoomScale` | `zoom-scale-*` | 15 | ScrollView | — |
