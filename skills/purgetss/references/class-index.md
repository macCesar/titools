# PurgeTSS Class Index

**Based on the actual PurgeTSS `tailwind.tss` file - 21,236 unique utility classes across 364 unique prefixes covering 416 Titanium properties**

Before suggesting ANY class, verify it exists:
```bash
grep -E "PATTERN" ./purgetss/styles/tailwind.tss
```

## Table of Contents

- [PurgeTSS Class Index](#purgetss-class-index)
  - [Table of Contents](#table-of-contents)
  - [PurgeTSS Naming Conventions](#purgetss-naming-conventions)
    - [How Classes Are Generated from Titanium Properties](#how-classes-are-generated-from-titanium-properties)
      - [1. Basic Conversion: camelCase → kebab-case](#1-basic-conversion-camelcase--kebab-case)
      - [2. Boolean Properties: `property` and `property-false`](#2-boolean-properties-property-and-property-false)
      - [3. Color Properties: Special Word Replacements](#3-color-properties-special-word-replacements)
      - [4. Tailwind CSS Compatibility Classes](#4-tailwind-css-compatibility-classes)
    - [Finding Properties in tailwind.tss](#finding-properties-in-tailwindtss)
  - [Multiple Properties Grouped Together](#multiple-properties-grouped-together)
  - [All 416 Titanium Properties with Classes](#all-416-titanium-properties-with-classes)
    - [A-E](#a-e)
    - [F-L](#f-l)
    - [M-P](#m-p)
    - [R-Z](#r-z)
  - [Class Categories by Prefix (Complete Inventory)](#class-categories-by-prefix-complete-inventory)
    - [Layout \& Structure](#layout--structure)
    - [Spacing (Margins \& Padding)](#spacing-margins--padding)
    - [Positioning](#positioning)
    - [Colors (Background)](#colors-background)
    - [Colors (Text \& Foreground)](#colors-text--foreground)
    - [Borders \& Radius](#borders--radius)
    - [Typography](#typography)
    - [Accessibility](#accessibility)
    - [Input \& Keyboard](#input--keyboard)
    - [Boolean \& State Classes](#boolean--state-classes)
    - [Text Transformation](#text-transformation)
    - [Opacity](#opacity)
    - [Transformation \& Animation](#transformation--animation)
    - [Shadows \& Elevation](#shadows--elevation)
    - [Z-Index \& Overflow](#z-index--overflow)
    - [Status Bar \& Navigation](#status-bar--navigation)
    - [UI Component States](#ui-component-states)
    - [Display \& Sizing](#display--sizing)
    - [Media \& Video](#media--video)
    - [Other Special Prefixes](#other-special-prefixes)
  - [PROHIBITED: Tailwind Classes (DO NOT EXIST)](#prohibited-tailwind-classes-do-not-exist)
  - [All 364 Unique Prefixes (Alphabetical)](#all-364-unique-prefixes-alphabetical)
  - [Quick Verification Commands](#quick-verification-commands)
  - [When to Use Direct Properties (No Classes)](#when-to-use-direct-properties-no-classes)
  - [Key Insights from Real Data](#key-insights-from-real-data)

---

## PurgeTSS Naming Conventions

### How Classes Are Generated from Titanium Properties

Every PurgeTSS class follows systematic naming rules derived from Titanium SDK property names:

#### 1. Basic Conversion: camelCase → kebab-case

```javascript
// Titanium Property → PurgeTSS Class
keepSectionsInSearch        → keep-sections-in-search
backgroundColor            → bg-*
keyboardType               → keyboard-type-*
returnKeyType              → return-key-type-*
```

#### 2. Boolean Properties: `property` and `property-false`

```javascript
// Property: editable
'.editable':               { editable: true }
'.editable-false':         { editable: false }

// Property: enabled
'.enabled':                { enabled: true }
'.enabled-false':          { enabled: false }

// Property: visible
'.visible':                { visible: true }
'.visible-false':          { visible: false }
'.hidden':                 { visible: false }  // alias
```

#### 3. Color Properties: Special Word Replacements

| Pattern             | Property                 | Class Example          |
| ------------------- | ------------------------ | ---------------------- |
| `*BackgroundColor`  | `resultsBackgroundColor` | `results-bg-gray-900`  |
| `*Background*Color` | `barBackgroundColor`     | `bar-bg-gray-900`      |
| `*Color`            | `titleColor`             | `title-gray-900`       |
| `*TextColor`        | `titleTextColor`         | `title-text-gray-900`  |
| `TintColor`         | `activeTintColor`        | `active-tint-gray-900` |

**Color Word Replacements:**
- `Background` → `bg-`
- `Color` → (omitted, color value follows)
- `TextColor` → `text-`
- `TintColor` → `tint-`

#### 4. Tailwind CSS Compatibility Classes

Some properties use Tailwind CSS class names directly (no kebab-case conversion):

```javascript
// Property: autocapitalization
'.uppercase':              { autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_ALL }
'.normal-case':            { autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE }
'.capitalize':             { autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_WORDS }
'.sentences':              { autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_SENTENCES }
```

### Finding Properties in tailwind.tss

Each property section in the file includes documentation:

```tss
// Property(ies): contentWidth, contentHeight
// Component(s): Ti.UI.ScrollView
'.content-w-screen': { contentWidth: Ti.UI.FILL }
'.content-h-screen': { contentHeight: Ti.UI.FILL }
```

**Comment Patterns:**
- `// Property: propertyName` - Single property
- `// Property(ies): prop1, prop2` - Multiple properties
- `// Component(s): Ti.UI.View, ...` - Which components use these classes
- `// Description: ...` - Optional description

**Exception:** Only `// debug` exists without a `Property:` label.

Search for any property to see its available classes:
```bash
# Find by property name
grep -A 20 "// Property: keyboardType" ./purgetss/styles/tailwind.tss

# Find by multiple properties
grep -A 20 "// Property(ies): contentWidth, contentHeight" ./purgetss/styles/tailwind.tss

# Find by component
grep -B 2 "Component(s): Ti.UI.TextField" ./purgetss/styles/tailwind.tss

# Find all properties for a component
grep -B 2 "Component(s):.*Ti.UI.ListView" ./purgetss/styles/tailwind.tss | grep "// Property"
```

---

## Multiple Properties Grouped Together

Some PurgeTSS classes combine multiple Titanium properties under a single class prefix:

| Class Prefix             | Properties                                                     | Description                |
| ------------------------ | -------------------------------------------------------------- | -------------------------- |
| `anchor-point-*`         | `anchorPoint`                                                  | Animation/View positioning |
| `autocapitalization-*`   | `autocapitalization`                                           | Text capitalization        |
| `bg-gradient-*`          | `backgroundGradient`                                           | Linear gradients           |
| `bg-radial-*`            | `backgroundGradient`                                           | Radial gradients (iOS)     |
| `clip-mode-*`            | `clipMode`                                                     | iOS clipping               |
| `content-*`              | `contentWidth`, `contentHeight`                                | ScrollView content size    |
| `curve-*`                | `curve`                                                        | Animation easing           |
| `dragging-*`             | `draggingType`                                                 | Animation module dragging  |
| `filter-attribute-*`     | `filterAttribute`                                              | ListView filtering         |
| `flip-*`                 | `flip`                                                         | Animation flipping         |
| `font-*`                 | `fontFamily`, `fontSize`, `fontStyle`, `fontWeight`            | Typography                 |
| `grid-*`                 | Various                                                        | Grid layout system         |
| `h-*`                    | `height`                                                       | All components             |
| `hint-*`                 | `hintTextColor`                                                | TextField placeholder      |
| `layout-*`               | `layout`                                                       | View layout modes          |
| `minimum-font-size-*`    | `minimumFontSize`                                              | Label auto-shrink          |
| `navigation-*`           | `navigationMode`                                               | Navigation modes           |
| `orientation-modes-*`    | `orientationModes`                                             | Supported orientations     |
| `origin-*`               | `anchorPoint`                                                  | Transform origin           |
| `padding-*`              | `padding`                                                      | Android-specific padding   |
| `rotate-*`               | `rotate`                                                       | 2D Matrix rotation         |
| `scale-*`                | `scale`                                                        | 2D Matrix scaling          |
| `scroll-type-*`          | `scrollType`                                                   | Android scroll type        |
| `shadow-*`               | `shadowOffset`, `shadowRadius`, `shadowColor`                  | Box shadows                |
| `show-*scroll-indicator` | `showHorizontalScrollIndicator`, `showVerticalScrollIndicator` | ScrollView                 |
| `status-bar-style-*`     | `statusBarStyle`                                               | iOS status bar             |
| `tint-*`                 | `tintColor`                                                    | View/Button tinting        |
| `title-*`                | `titleAttributes: color/shadow`                                | iOS title styling          |
| `toggle-*`               | `toggle`                                                       | Animation toggle           |
| `w-*`                    | `width`                                                        | All components             |
| `wh-*`                   | `width`, `height`                                              | Combined width/height      |

---

## All 416 Titanium Properties with Classes

The following properties have PurgeTSS utility classes. Each property name converts to kebab-case for the class prefix.

### A-E

| Property                                 | Class Prefix                                                                  | Notes                                    |
| ---------------------------------------- | ----------------------------------------------------------------------------- | ---------------------------------------- |
| `accessibilityDisableLongPress`          | `accessibility-disable-long-press`                                            | Boolean                                  |
| `accessibilityEnabled`                   | `accessibility-enabled`                                                       | Boolean                                  |
| `accessibilityHidden`                    | `accessibility-hidden`                                                        | Boolean                                  |
| `accessoryType`                          | `accessory-type`                                                              | ListView/TableView                       |
| `accuracy`                               | `accuracy`                                                                    | Location                                 |
| `accuracyAuthorization`                  | `accuracy-authorization`                                                      | Location                                 |
| `actionViewExpanded`                     | `action-view-expanded`                                                        | iOS                                      |
| `activationMode`                         | `activation-mode`                                                             | Notifications                            |
| `active`                                 | `active`                                                                      | Boolean                                  |
| `activeIconIsMask`                       | `active-icon-is-mask`                                                         | Tabs                                     |
| `activeTab`                              | `active-tab`                                                                  | Tabs                                     |
| `activeTintColor`                        | `active-tint-*`                                                               | Color variants                           |
| `activeTitleColor`                       | `active-title-*`                                                              | Color variants                           |
| `activityEnterTransition`                | `activity-enter-transition`                                                   | Android                                  |
| `activityExitTransition`                 | `activity-exit-transition`                                                    | Android                                  |
| `activityReenterTransition`              | `activity-reenter-transition`                                                 | Android                                  |
| `activityReturnTransition`               | `activity-return-transition`                                                  | Android                                  |
| `activitySharedElementEnterTransition`   | `activity-shared-element-enter-transition`                                    | Android                                  |
| `activitySharedElementExitTransition`    | `activity-shared-element-exit-transition`                                     | Android                                  |
| `activitySharedElementReenterTransition` | `activity-shared-element-reenter-transition`                                  | Android                                  |
| `activitySharedElementReturnTransition`  | `activity-shared-element-return-transition`                                   | Android                                  |
| `activityType`                           | `activity-type`                                                               | Android                                  |
| `alertSetting`                           | `alert-setting`                                                               | Notifications                            |
| `alertStyle`                             | `alert-style`                                                                 | AlertDialog                              |
| `alignment`                              | `alignment`                                                                   | Text alignment                           |
| `allDay`                                 | `all-day`                                                                     | Calendar events                          |
| `allowBackground`                        | `allow-background`                                                            | Android                                  |
| `allowCreation`                          | `allow-creation`                                                              | Contacts                                 |
| `allowEditing`                           | `allow-editing`                                                               | Calendar events                          |
| `allowFileAccess`                        | `allow-file-access`                                                           | WebView                                  |
| `allowMultiple`                          | `allow-multiple`                                                              | Media picker                             |
| `allowMultipleSelections`                | `allow-multiple-selections`                                                   | Picker                                   |
| `allowsAirPlay`                          | `allows-air-play`                                                             | Video player                             |
| `allowsBackForwardNavigationGestures`    | `allows-back-forward-navigation-gestures`                                     | iOS WebView                              |
| `allowsBackgroundLocationUpdates`        | `allows-background-location-updates`                                          | Location                                 |
| `allowsDefaultTighteningForTruncation`   | `allows-default-tightening-for-truncation`                                    | Label                                    |
| `allowsExternalPlayback`                 | `allows-external-playback`                                                    | Video player                             |
| `allowsInlineMediaPlayback`              | `allows-inline-media-playback`                                                | iOS WebView                              |
| `allowsLinkPreview`                      | `allows-link-preview`                                                         | iOS                                      |
| `allowsMultipleSelectionDuringEditing`   | `allows-multiple-selection-during-editing`                                    | ListView                                 |
| `allowsMultipleSelectionInteraction`     | `allows-multiple-selection-interaction`                                       | iOS                                      |
| `allowsPictureInPictureMediaPlayback`    | `allows-picture-in-picture-media-playback`                                    | iOS Video                                |
| `allowsRotation`                         | `allows-rotation`                                                             | Video player                             |
| `allowsSelection`                        | `allows-selection`                                                            | ListView                                 |
| `allowsSelectionDuringEditing`           | `allows-selection-during-editing`                                             | iOS                                      |
| `allowTranscoding`                       | `allow-transcoding`                                                           | Media picker                             |
| `allowUserCustomization`                 | `allow-user-customization`                                                    | Toolbar                                  |
| `animated`                               | `animated`                                                                    | Boolean                                  |
| `animationStyle`                         | `animation-style`                                                             | Navigation                               |
| `appSupportsShakeToEdit`                 | `app-supports-shake-to-edit`                                                  | iOS                                      |
| `arrowDirection`                         | `arrow-direction`                                                             | Popover                                  |
| `aspectRatio`                            | `aspect-ratio`                                                                | `aspect-ratio-16-9`, `aspect-ratio-4-3`  |
| `audioFocus`                             | `audio-focus`                                                                 | Audio player                             |
| `audioPlaying`                           | `audio-playing`                                                               | Boolean                                  |
| `audioSessionCategory`                   | `audio-session-category`                                                      | Audio player                             |
| `audioStreamType`                        | `audio-stream-type`                                                           | Android Audio                            |
| `audioType`                              | `audio-type`                                                                  | Audio player                             |
| `authenticationRequired`                 | `authentication-required`                                                     | Notifications                            |
| `authorizationStatus`                    | `authorization-status`                                                        | Location/Permissions                     |
| `autoAdjustScrollViewInsets`             | `auto-adjust-scroll-view-insets`                                              | iOS                                      |
| `autocapitalization`                     | `autocapitalization-*`, `uppercase`, `capitalize`, `sentences`, `normal-case` | TextField                                |
| `autocorrect`                            | `autocorrect`, `autocorrect-false`                                            | TextField                                |
| `autoEncodeUrl`                          | `auto-encode-url`                                                             | WebView                                  |
| `autofillType`                           | `autofill-type`                                                               | TextField                                |
| `autohide`                               | `autohide`, `autohide-false`                                                  | Various                                  |
| `autoHide`                               | `auto-hide`                                                                   | ScrollView                               |
| `autoLink`                               | `auto-link`                                                                   | Label (phone, email, web, address, etc.) |
| `autoplay`                               | `autoplay`, `autoplay-false`                                                  | Video player                             |
| `autoRedirect`                           | `auto-redirect`                                                               | WebView                                  |
| `autorepeat`                             | `autorepeat`, `autorepeat-false`                                              | Button                                   |
| `autoreverse`                            | `autoreverse`, `autoreverse-false`                                            | Animation                                |
| `autorotate`                             | `autorotate`, `autorotate-false`                                              | Video/Window                             |
| `autoSize`                               | `auto-size`                                                                   | TextArea                                 |
| `autoTabTitle`                           | `auto-tab-title`                                                              | Tab                                      |
| `availability`                           | `availability`                                                                | Calendar events                          |
| `availableCameraMediaTypes`              | `available-camera-media-types`                                                | Media picker                             |
| `availableCameras`                       | `available-cameras`                                                           | Camera                                   |
| `availablePhotoGalleryMediaTypes`        | `available-photo-gallery-media-types`                                         | Media picker                             |
| `availablePhotoMediaTypes`               | `available-photo-media-types`                                                 | Media picker                             |
| `backfillEnd`                            | `backfill-end`                                                                | Picker                                   |
| `backfillStart`                          | `backfill-start`                                                              | Picker                                   |
| `backgroundColor`                        | `bg-*`                                                                        | All components                           |
| `backgroundDisabledColor`                | `background-disabled-*`                                                       | Button                                   |
| `backgroundFocusedColor`                 | `background-focused-*`                                                        | Button                                   |
| `backgroundLeftCap`                      | `background-left-cap`                                                         | ImageView                                |
| `backgroundPaddingBottom`                | `background-padding-bottom`                                                   | ImageView                                |
| `backgroundPaddingLeft`                  | `background-padding-left`                                                     | ImageView                                |
| `backgroundPaddingRight`                 | `background-padding-right`                                                    | ImageView                                |
| `backgroundPaddingTop`                   | `background-padding-top`                                                      | ImageView                                |
| `backgroundRepeat`                       | `background-repeat`                                                           | ImageView                                |
| `backgroundSelectedColor`                | `background-selected-*`                                                       | Button/TableView                         |
| `backgroundTopCap`                       | `background-top-cap`                                                          | ImageView                                |
| `backward`                               | `backward`                                                                    | Boolean                                  |
| `badgeBackgroundColor`                   | `badge-bg-*`                                                                  | Tab/Button                               |
| `badgeColor`                             | `badge-color-*`                                                               | Tab                                      |
| `badgeSetting`                           | `badge-setting`                                                               | Notifications                            |
| `badgeTextColor`                         | `badge-text-*`                                                                | Tab                                      |
| `barColor`                               | `bar-color-*`                                                                 | ProgressBar/Slider                       |
| `batteryMonitoring`                      | `battery-monitoring`                                                          | Battery                                  |
| `behavior`                               | `behavior`                                                                    | Various                                  |
| `borderColor`                            | `border-*`                                                                    | View                                     |
| `borderRadius`                           | `rounded-*`                                                                   | View                                     |
| `borderStyle`                            | `border-style`                                                                | TextField                                |
| `borderWidth`                            | `border-*`                                                                    | View                                     |
| `bottom`                                 | `bottom-*`                                                                    | Positioning                              |
| `breakStrategy`                          | `break-strategy`                                                              | Android TextView                         |
| `bubbleParent`                           | `bubble-parent`                                                               | Event propagation                        |
| `bubbles`                                | `bubbles`                                                                     | Event propagation                        |
| `buttonClickRequired`                    | `button-click-required`                                                       | Switch                                   |
| `bypassDnd`                              | `bypass-dnd`                                                                  | Notifications Android                    |
| `cache`                                  | `cache`                                                                       | Various                                  |
| `cacheMode`                              | `cache-mode`                                                                  | Image loading                            |
| `cachePolicy`                            | `cache-policy`                                                                | HTTP client                              |
| `cacheSize`                              | `cache-size`                                                                  | Image loading                            |
| `calendarAuthorization`                  | `calendar-authorization`                                                      | Calendar                                 |
| `calendarViewShown`                      | `calendar-view-shown`                                                         | DatePicker                               |
| `cameraAuthorization`                    | `camera-authorization`                                                        | Camera                                   |
| `cameraFlashMode`                        | `camera-flash-mode`                                                           | Camera                                   |
| `canCancelEvents`                        | `can-cancel-events`                                                           | Event handling                           |
| `cancelable`                             | `cancelable`                                                                  | Boolean                                  |
| `cancelBubble`                           | `cancel-bubble`                                                               | Event propagation                        |
| `canceledOnTouchOutside`                 | `canceled-on-touch-outside`                                                   | Dialog                                   |
| `canDelete`                              | `can-delete`                                                                  | TableView                                |
| `canEdit`                                | `can-edit`                                                                    | TableView                                |
| `canInsert`                              | `can-insert`                                                                  | TableView                                |
| `canMove`                                | `can-move`                                                                    | TableView                                |
| `canRecord`                              | `can-record`                                                                  | Audio recording                          |
| `canScroll`                              | `can-scroll`                                                                  | ScrollView                               |
| `carPlaySetting`                         | `car-play-setting`                                                            | Notifications iOS                        |
| `caseInsensitiveSearch`                  | `case-insensitive-search`                                                     | SearchBar                                |
| `caseSensitive`                          | `case-sensitive`                                                              | TextField                                |
| `category`                               | `category`                                                                    | Notifications                            |
| `charset`                                | `charset`                                                                     | WebView                                  |
| `checkable`                              | `checkable`                                                                   | Boolean                                  |
| `checked`                                | `checked`                                                                     | Boolean                                  |
| `clearButtonMode`                        | `clear-button-mode`                                                           | TextField                                |
| `clearOnEdit`                            | `clear-on-edit`                                                               | TextField                                |
| `clipViews`                              | `clip-views`                                                                  | ScrollView                               |
| `closed`                                 | `closed`                                                                      | Boolean                                  |
| `code`                                   | `code`                                                                        | Option dialog                            |
| `collisionMode`                          | `collision-mode`                                                              | Annotations                              |
| `color`                                  | `color-*`                                                                     | Text/Icon colors                         |
| `colors`                                 | `colors-*`                                                                    | Picker color                             |
| `columnCount`                            | `column-count`                                                                | Grid                                     |
| `compact`                                | `compact`                                                                     | Boolean                                  |
| `compression`                            | `compression`                                                                 | Image quality                            |
| `connected`                              | `connected`                                                                   | Boolean                                  |
| `contactsAuthorization`                  | `contacts-authorization`                                                      | Contacts                                 |
| `contentHeight`                          | `content-h-*`                                                                 | ScrollView                               |
| `contentScrimColor`                      | `content-scrim-*`                                                             | Android                                  |
| `contentWidth`                           | `content-w-*`                                                                 | ScrollView                               |
| `continuous`                             | `continuous`                                                                  | Boolean                                  |
| `continuousUpdate`                       | `continuous-update`                                                           | Slider                                   |
| `countDownDuration`                      | `count-down-duration`                                                         | Timer                                    |
| `criticalAlertSetting`                   | `critical-alert-setting`                                                      | Notifications iOS                        |
| `currentPageIndicatorColor`              | `current-page-indicator-*`                                                    | ScrollView pager                         |
| `curve`                                  | `curve-*`                                                                     | Animation                                |
| `customInspect`                          | `custom-inspect`                                                              | Android WebView                          |
| `datePickerStyle`                        | `date-picker-style`                                                           | iOS                                      |
| `dateTimeColor`                          | `date-time-*`                                                                 | Picker                                   |
| `decelerationRate`                       | `deceleration-rate`                                                           | ScrollView                               |
| `defaults`                               | `defaults`                                                                    | Notifications                            |
| `delay`                                  | `delay-*`                                                                     | Animation                                |
| `destructive`                            | `destructive`                                                                 | Boolean                                  |
| `dimBackgroundForSearch`                 | `dim-background-for-search`                                                   | SearchBar                                |
| `disableBounce`                          | `disable-bounce`                                                              | ScrollView                               |
| `disableContextMenu`                     | `disable-context-menu`                                                        | Android WebView                          |
| `disabledColor`                          | `disabled-*`                                                                  | Button/TextField                         |
| `disableNetworkActivityIndicator`        | `disable-network-activity-indicator`                                          | iOS WebView                              |
| `displayHomeAsUp`                        | `display-as-home-arrow`                                                       | Android                                  |
| `drawerIndicatorEnabled`                 | `drawer-indicator-enabled`                                                    | Android                                  |
| `drawerLockMode`                         | `drawer-lock-mode`                                                            | Android                                  |
| `duration`                               | `duration-*`                                                                  | Animation                                |
| `editable`                               | `editable`, `editable-false`                                                  | TextField                                |
| `editing`                                | `editing`                                                                     | Boolean                                  |
| `effect`                                 | `effect`                                                                      | iOS                                      |
| `elevation`                              | `elevation-*`                                                                 | Android                                  |
| `eligibleForHandoff`                     | `eligible-for-handoff`                                                        | iOS                                      |
| `eligibleForPrediction`                  | `eligible-for-prediction`                                                     | iOS                                      |
| `eligibleForPublicIndexing`              | `eligible-for-public-indexing`                                                | Spotlight                                |
| `eligibleForSearch`                      | `eligible-for-search`                                                         | Spotlight                                |
| `ellipsize`                              | `ellipsize-*`                                                                 | Label truncation                         |
| `enableCopy`                             | `enable-copy`                                                                 | TextArea                                 |
| `enabled`                                | `enabled`, `enabled-false`                                                    | All components                           |
| `enableJavascriptInterface`              | `enable-javascript-interface`                                                 | Android WebView                          |
| `enableKeepAlive`                        | `enable-keep-alive`                                                           | HTTP client                              |
| `enableLights`                           | `enable-lights`                                                               | Notifications Android                    |
| `enableReturnKey`                        | `enable-return-key`                                                           | TextField                                |
| `enableVibration`                        | `enable-vibration`                                                            | Notifications Android                    |
| `enableZoomControls`                     | `enable-zoom-controls`                                                        | Android WebView                          |
| `exact`                                  | `exact`                                                                       | Boolean                                  |
| `exitOnClose`                            | `exit-on-close`                                                               | Window                                   |
| `experimental`                           | `experimental`                                                                | Boolean                                  |
| `extendBackground`                       | `extend-background`                                                           | Switch                                   |
| `extendEdges`                            | `extend-edges`                                                                | iOS                                      |
| `extendSafeArea`                         | `extend-safe-area`                                                            | iOS                                      |

### F-L

| Property                                | Class Prefix                                       | Notes                                  |
| --------------------------------------- | -------------------------------------------------- | -------------------------------------- |
| `fastScroll`                            | `fast-scroll`                                      | ListView Android                       |
| `filterAlwaysInclude`                   | `filter-always-include`                            | Picker                                 |
| `filterAnchored`                        | `filter-anchored`                                  | Picker                                 |
| `filterCaseInsensitive`                 | `filter-case-insensitive`                          | Picker                                 |
| `filterTouchesWhenObscured`             | `filter-touches-when-obscured`                     | View                                   |
| `fixedSize`                             | `fixed-size`                                       | View                                   |
| `flags`                                 | `flags`                                            | Notifications                          |
| `flagSecure`                            | `flag-secure`                                      | Android                                |
| `focusable`                             | `focusable`                                        | Boolean                                |
| `footerDividersEnabled`                 | `footer-dividers-enabled`                          | ListView Android                       |
| `forceBottomPosition`                   | `force-bottom-position`                            | ScrollView                             |
| `forceModal`                            | `force-modal`                                      | Window                                 |
| `forceSplashAsSnapshot`                 | `force-splash-as-snapshot`                         | Android                                |
| `forceTouchSupported`                   | `force-touch-supported`                            | iOS                                    |
| `forceUpdates`                          | `force-updates`                                    | Notifications                          |
| `format`                                | `format-*`                                         | Date/Time                              |
| `format24`                              | `format24`, `format24-false`                       | Time format                            |
| `frequency`                             | `frequency-*`                                      | Location updates                       |
| `fullscreen`                            | `fullscreen`                                       | Boolean                                |
| `generatedMessage`                      | `generated-message`                                | Notifications                          |
| `getters`                               | `getters`                                          | Model                                  |
| `gravity`                               | `gravity`                                          | Android                                |
| `grouping`                              | `grouping`                                         | DatePicker/Picker                      |
| `groupSummary`                          | `group-summary`                                    | Notifications Android                  |
| `handleLinks`                           | `handle-links`                                     | Label                                  |
| `hasAlarm`                              | `has-alarm`                                        | Calendar events                        |
| `hasCheck`                              | `has-check`                                        | Notifications Android                  |
| `hasChild`                              | `has-child`                                        | Annotations                            |
| `hasCompass`                            | `has-compass`                                      | Geolocation                            |
| `hasDetail`                             | `has-detail`                                       | Notifications Android                  |
| `hasProtectedAsset`                     | `has-protected-asset`                              | Video                                  |
| `headerDividersEnabled`                 | `header-dividers-enabled`                          | ListView Android                       |
| `height`                                | `h-*`                                              | All components                         |
| `hiddenBehavior`                        | `hidden-behavior`                                  | Tabs Android                           |
| `hideLoadIndicator`                     | `hide-load-indicator`                              | WebView                                |
| `hidesBackButton`                       | `hides-back-button`                                | iOS                                    |
| `hidesBarsOnSwipe`                      | `hides-bars-on-swipe`                              | iOS                                    |
| `hidesBarsOnTap`                        | `hides-bars-on-tap`                                | iOS                                    |
| `hidesBarsWhenKeyboardAppears`          | `hides-bars-when-keyboard-appears`                 | iOS                                    |
| `hideSearchOnSelection`                 | `hide-search-on-selection`                         | SearchBar                              |
| `hideShadow`                            | `hide-shadow`                                      | iOS                                    |
| `hidesSearchBarWhenScrolling`           | `hides-search-bar-when-scrolling`                  | iOS                                    |
| `highlightedColor`                      | `highlighted-*`                                    | TableView/ListView                     |
| `hintTextColor`                         | `hint-*`                                           | TextField                              |
| `hintType`                              | `hint-type`                                        | TextField                              |
| `hires`                                 | `hires`                                            | Boolean                                |
| `homeButtonEnabled`                     | `home-button-enabled`                              | Android                                |
| `homeIndicatorAutoHidden`               | `home-indicator-auto-hidden`                       | iOS                                    |
| `horizontalBounce`                      | `horizontal-bounce`                                | ScrollView                             |
| `horizontalMargin`                      | `horizontal-margin`                                | TableView                              |
| `horizontalWrap`                        | `horizontal-wrap`                                  | DashboardView                          |
| `hour12`                                | `hour12`, `hour12-false`                           | Time format                            |
| `html`                                  | `html`, `html-false`                               | WebView                                |
| `httponly`                              | `httponly`, `httponly-false`                       | Cookie                                 |
| `hyphenationFrequency`                  | `hyphenation-frequency`                            | Android TextView                       |
| `icon`                                  | `icon-*`                                           | Tab/Notifications                      |
| `iconColor`                             | `icon-*`                                           | Tab                                    |
| `iconified`                             | `iconified`                                        | Boolean                                |
| `iconifiedByDefault`                    | `iconified-by-default`                             | SearchBar                              |
| `iconIsMask`                            | `icon-is-mask`                                     | Tab                                    |
| `idleTimerDisabled`                     | `idle-timer-disabled`                              | iOS                                    |
| `ignorePunctuation`                     | `ignore-punctuation`                               | SearchBar                              |
| `ignoreSslError`                        | `ignore-ssl-error`                                 | WebView                                |
| `imageHeight`                           | `image-h-*`                                        | ImageView                              |
| `imageIsMask`                           | `image-is-mask`                                    | ImageView                              |
| `imagePadding`                          | `image-padding`                                    | Button                                 |
| `imageTouchFeedback`                    | `image-touch-feedback`                             | Android                                |
| `imageTouchFeedbackColor`               | `image-touch-feedback-*`                           | Android                                |
| `importance`                            | `importance`                                       | Notifications                          |
| `inBackground`                          | `in-background`                                    | Audio player                           |
| `includeFontPadding`                    | `include-font-padding`                             | Android TextView                       |
| `includeNote`                           | `include-note`                                     | Calendar events                        |
| `includeOpaqueBars`                     | `include-opaque-bars`                              | iOS                                    |
| `indentionLevel`                        | `indention-level-*`                                | ListView                               |
| `indicatorColor`                        | `indicator-*`                                      | ScrollView                             |
| `injectionTime`                         | `injection-time`                                   | Android                                |
| `inPopOver`                             | `in-pop-over`                                      | iOS                                    |
| `inputs`                                | `inputs-*`                                         | Media capture                          |
| `inputType`                             | `input-type`                                       | Android TextField                      |
| `interactive`                           | `interactive`                                      | Boolean                                |
| `interactiveDismissModeEnabled`         | `interactive-dismiss-mode-enabled`                 | iOS                                    |
| `isCameraSupported`                     | `is-camera-supported`                              | Camera                                 |
| `isCloudItem`                           | `is-cloud-item`                                    | Asset                                  |
| `isCompilation`                         | `is-compilation`                                   | Media                                  |
| `isDetached`                            | `is-detached`                                      | Window                                 |
| `isExplicit`                            | `is-explicit`                                      | Media                                  |
| `isLeftOpen`                            | `is-left-open`                                     | Navigation                             |
| `isLeftVisible`                         | `is-left-visible`                                  | Navigation                             |
| `isLocal`                               | `is-local`                                         | Asset                                  |
| `isOrganizer`                           | `is-organizer`                                     | Calendar events                        |
| `isRightOpen`                           | `is-right-open`                                    | Navigation                             |
| `isRightVisible`                        | `is-right-visible`                                 | Navigation                             |
| `isSearching`                           | `is-searching`                                     | SearchBar                              |
| `isTranslatedBinaryOnAppleSilicon`      | `is-translated-binary-on-apple-silicon`            | iOS                                    |
| `itemContentType`                       | `item-content-type`                                | Notifications                          |
| `javaScriptCanOpenWindowsAutomatically` | `java-script-can-open-windows-automatically`       | WebView                                |
| `javaScriptEnabled`                     | `java-script-enabled`                              | WebView                                |
| `keepScreenOn`                          | `keep-screen-on`                                   | Android                                |
| `keepSectionsInSearch`                  | `keep-sections-in-search`                          | TableView                              |
| `keyboardAppearance`                    | `keyboard-appearance-*`                            | TextField                              |
| `keyboardDismissMode`                   | `keyboard-dismiss-mode`                            | TableView/ScrollView                   |
| `keyboardDisplayRequiresUserAction`     | `keyboard-display-requires-user-action`            | iOS WebView                            |
| `keyboardToolbarColor`                  | `keyboard-toolbar-*`                               | TextField iOS                          |
| `keyboardToolbarHeight`                 | `keyboard-toolbar-h-*`                             | TextField iOS                          |
| `keyboardType`                          | `keyboard-type-*`                                  | TextField                              |
| `keyboardVisible`                       | `keyboard-visible`, `keyboard-visible-false`       | TextField                              |
| `kind`                                  | `kind`                                             | Notifications                          |
| `largeTitleDisplayMode`                 | `large-title-display-mode`                         | iOS                                    |
| `largeTitleEnabled`                     | `large-title-enabled`, `large-title-enabled-false` | iOS                                    |
| `launchOptionsLocationKey`              | `launch-options-location-key`                      | iOS                                    |
| `layerType`                             | `layer-type`                                       | Android View                           |
| `layout`                                | `layout`                                           | View (composite, horizontal, vertical) |
| `lazyLoadingEnabled`                    | `lazy-loading-enabled`                             | ListView Android                       |
| `left`                                  | `left-*`                                           | Positioning                            |
| `leftButtonMode`                        | `left-button-mode`                                 | TextField                              |
| `leftButtonPadding`                     | `left-button-padding`                              | TextField                              |
| `leftDrawerLockMode`                    | `left-drawer-lock-mode`                            | Navigation                             |
| `leftTrackLeftCap`                      | `left-track-left-cap`                              | Slider                                 |
| `leftTrackTopCap`                       | `left-track-top-cap`                               | Slider                                 |
| `leftWidth`                             | `left-width`                                       | Slider                                 |
| `letterSpacing`                         | `letter-spacing-*`                                 | Label                                  |
| `lightColor`                            | `light-*`                                          | Notification                           |
| `lightTouchEnabled`                     | `light-touch-enabled`                              | Android ListView                       |
| `lineBreakMode`                         | `line-break-mode-*`                                | Label                                  |
| `lineHeightMultiple`                    | `line-h-multiple-*`                                | Label                                  |
| `lines`                                 | `lines-*`                                          | Label                                  |
| `lineSpacing`                           | `line-spacing-*`                                   | Label                                  |
| `loading`                               | `loading`                                          | Boolean                                |
| `location`                              | `location-*`                                       | Annotations                            |
| `locationAccuracyAuthorization`         | `location-accuracy-authorization`                  | Location                               |
| `locationServicesAuthorization`         | `location-services-authorization`                  | Location                               |
| `locationServicesEnabled`               | `location-services-enabled`                        | Geolocation                            |
| `lockScreenSetting`                     | `lock-screen-setting`                              | Notifications                          |
| `lockscreenVisibility`                  | `lockscreen-visibility`                            | Notifications                          |
| `loginKeyboardType`                     | `login-keyboard-type`                              | TextField                              |
| `loginReturnKeyType`                    | `login-return-key-type`                            | TextField                              |
| `looping`                               | `looping`                                          | Boolean                                |

### M-P

| Property                                   | Class Prefix                                     | Notes                    |
| ------------------------------------------ | ------------------------------------------------ | ------------------------ |
| `mainFrameOnly`                            | `main-frame-only`                                | WebView                  |
| `manualMode`                               | `manual-mode`                                    | Geolocation              |
| `masterIsOverlayed`                        | `master-is-overlayed`                            | SplitWindow              |
| `masterViewVisible`                        | `master-view-visible`                            | SplitWindow              |
| `maxElevation`                             | `max-elevation`                                  | Android                  |
| `maxImages`                                | `max-images`                                     | Email                    |
| `maximumLineHeight`                        | `maximum-line-height-*`                          | Label                    |
| `maxLines`                                 | `max-lines-*`                                    | Label                    |
| `maxRowHeight`                             | `max-row-height`                                 | TableView                |
| `maxZoomScale`                             | `max-zoom-scale`                                 | ScrollView               |
| `mediaType`                                | `media-type`                                     | Camera/Video             |
| `mediaTypes`                               | `media-types`                                    | Media picker             |
| `mediaTypesRequiringUserActionForPlayback` | `media-types-requiring-user-action-for-playback` | Video                    |
| `method`                                   | `method-*`                                       | HTTP                     |
| `minimizeBehavior`                         | `minimize-behavior`                              | iOS Picture-in-Picture   |
| `minimumLineHeight`                        | `minimum-line-height-*`                          | Label                    |
| `minRowHeight`                             | `min-row-height`                                 | TableView                |
| `minZoomScale`                             | `min-zoom-scale`                                 | ScrollView               |
| `mixedContentMode`                         | `mixed-content-mode`                             | Android WebView          |
| `modal`                                    | `modal`                                          | Boolean                  |
| `modalStyle`                               | `modal-style`                                    | iOS                      |
| `modalTransitionStyle`                     | `modal-transition-style`                         | iOS                      |
| `mode`                                     | `mode-*`                                         | Various components       |
| `moveable`                                 | `moveable`                                       | Boolean                  |
| `moviePlayerStatus`                        | `movie-player-status`                            | Video player             |
| `moving`                                   | `moving`                                         | Boolean                  |
| `multipleWindows`                          | `multiple-windows`                               | Android                  |
| `nativeSpinner`                            | `native-spinner`                                 | RefreshControl           |
| `navBarColor`                              | `nav-bar-*`                                      | Android                  |
| `navBarHidden`                             | `nav-bar-hidden`                                 | iOS                      |
| `navigationIconColor`                      | `navigation-icon-*`                              | Android Toolbar          |
| `navTintColor`                             | `nav-tint-*`                                     | iOS                      |
| `needsSave`                                | `needs-save`                                     | Event                    |
| `networkType`                              | `network-type`                                   | Email                    |
| `noDeprecation`                            | `no-deprecation`                                 | Geolocation              |
| `notificationCenterSetting`                | `notification-center-setting`                    | Notifications iOS        |
| `numeric`                                  | `numeric`                                        | Boolean                  |
| `online`                                   | `online`                                         | Boolean                  |
| `onThumbColor`                             | `on-thumb-*`                                     | Switch                   |
| `onTintColor`                              | `on-*`                                           | Switch                   |
| `opacity`                                  | `opacity-*`                                      | All components           |
| `opaque`                                   | `opaque`                                         | Boolean                  |
| `opaquebackground`                         | `opaquebackground`                               | Boolean                  |
| `options`                                  | `options-*`                                      | Option dialog            |
| `outputs`                                  | `outputs-*`                                      | Media capture            |
| `overlayEnabled`                           | `overlay-enabled`, `overlay-enabled-false`       | iOS                      |
| `overrideCurrentAnimation`                 | `override-current-animation`                     | Navigation               |
| `overrideUserInterfaceStyle`               | `override-user-interface-style`                  | iOS                      |
| `overScrollMode`                           | `over-scroll-mode`                               | Android ScrollView       |
| `padding`                                  | `padding-*`                                      | All directional paddings |
| `paddingBottom`                            | `padding-bottom-*`                               | Alternative to `pb-*`    |
| `paddingLeft`                              | `padding-left-*`                                 | Alternative to `pl-*`    |
| `paddingRight`                             | `padding-right-*`                                | Alternative to `pr-*`    |
| `paddingTop`                               | `padding-top-*`                                  | Alternative to `pt-*`    |
| `pageHeight`                               | `page-height`                                    | ScrollView               |
| `pageIndicatorColor`                       | `page-indicator-*`                               | ScrollView               |
| `pageWidth`                                | `page-width`                                     | ScrollView               |
| `pagingControlAlpha`                       | `paging-control-alpha`                           | ScrollView               |
| `pagingControlColor`                       | `paging-control-*`                               | ScrollView               |
| `pagingControlHeight`                      | `paging-control-height`                          | ScrollView               |
| `pagingControlOnTop`                       | `paging-control-on-top`                          | ScrollView               |
| `pagingControlTimeout`                     | `paging-control-timeout`                         | ScrollView               |
| `paragraphSpacingAfter`                    | `paragraph-spacing-after-*`                      | Label                    |
| `paragraphSpacingBefore`                   | `paragraph-spacing-before-*`                     | Label                    |
| `passwordKeyboardType`                     | `password-keyboard-type`                         | TextField                |
| `passwordMask`                             | `password-mask`                                  | TextField                |
| `passwordReturnKeyType`                    | `password-return-key-type`                       | TextField                |
| `pathOnly`                                 | `path-only`                                      | File                     |
| `pauseLocationUpdateAutomatically`         | `pause-location-update-automatically`            | Location                 |
| `persistent`                               | `persistent`                                     | Boolean                  |
| `physicalSizeCategory`                     | `physical-size-category`                         | iOS                      |
| `pictureInPictureEnabled`                  | `picture-in-picture-enabled`                     | iOS                      |
| `playbackState`                            | `playback-state`                                 | Audio/Video              |
| `pluginState`                              | `plugin-state`                                   | Android WebView          |
| `position`                                 | `position-*`                                     | All components           |
| `preventCornerOverlap`                     | `prevent-corner-overlap`                         | Android                  |
| `preventDefaultImage`                      | `prevent-default-image`                          | WebView                  |
| `providesAppNotificationSettings`          | `provides-app-notification-settings`             | Notifications iOS        |
| `proximityDetection`                       | `proximity-detection`                            | Proximity sensor         |
| `proximityState`                           | `proximity-state`                                | Proximity sensor         |
| `pruneSectionsOnEdit`                      | `prune-sections-on-edit`                         | TableView                |
| `pullBackgroundColor`                      | `pull-bg-*`                                      | RefreshControl           |
| `pushMode`                                 | `push-mode`                                      | Notifications            |

### R-Z

| Property                          | Class Prefix                                   | Notes                       |
| --------------------------------- | ---------------------------------------------- | --------------------------- |
| `readyState`                      | `ready-state`                                  | XMLHttpRequest              |
| `recording`                       | `recording`                                    | Boolean                     |
| `remoteNotificationsEnabled`      | `remote-notifications-enabled`                 | Notifications               |
| `repeat`                          | `repeat-*`                                     | Animation                   |
| `repeatCount`                     | `repeat-count-*`                               | Animation                   |
| `repeatMode`                      | `repeat-mode`                                  | Android                     |
| `requestedOrientation`            | `requested-orientation`                        | Android                     |
| `requiresEditingToMove`           | `requires-editing-to-move`                     | iOS                         |
| `resultsBackgroundColor`          | `results-bg-*`                                 | SearchBar                   |
| `resultsSeparatorColor`           | `results-separator-*`                          | SearchBar                   |
| `resultsSeparatorStyle`           | `results-separator-style`                      | SearchBar                   |
| `returnKeyType`                   | `return-key-type-*`                            | TextField                   |
| `reverse`                         | `reverse`                                      | Boolean                     |
| `right`                           | `right-*`                                      | Positioning                 |
| `rightButtonMode`                 | `right-button-mode`                            | TextField                   |
| `rightButtonPadding`              | `right-button-padding`                         | TextField                   |
| `rightDrawerLockMode`             | `right-drawer-lock-mode`                       | Navigation                  |
| `rightTrackLeftCap`               | `right-track-left-cap`                         | Slider                      |
| `rightTrackTopCap`                | `right-track-top-cap`                          | Slider                      |
| `rightWidth`                      | `right-width`                                  | Slider                      |
| `role`                            | `role-*`                                       | Accessibility               |
| `rotate`                          | `rotate-*`                                     | 2D Matrix                   |
| `rowCount`                        | `row-count`                                    | Picker                      |
| `rowHeight`                       | `row-height`                                   | TableView                   |
| `running`                         | `running`                                      | Boolean                     |
| `saveToPhotoGallery`              | `save-to-photo-gallery`                        | Camera                      |
| `scale`                           | `scale-*`                                      | 2D Matrix                   |
| `scalesPageToFit`                 | `scales-page-to-fit`                           | WebView                     |
| `scaleX`                          | `scale-x-*`                                    | 2D Matrix                   |
| `scaleY`                          | `scale-y-*`                                    | 2D Matrix                   |
| `scalingMode`                     | `scaling-mode`                                 | ImageView                   |
| `scrollable`                      | `scrollable`                                   | Boolean                     |
| `scrollbars`                      | `scrollbars-*`                                 | ScrollView Android          |
| `scrollIndicatorStyle`            | `scroll-indicator-style`                       | iOS                         |
| `scrollingEnabled`                | `scrolling-enabled`, `scrolling-enabled-false` | ScrollView                  |
| `scrollsToTop`                    | `scrolls-to-top`                               | ScrollView                  |
| `searchAsChild`                   | `search-as-child`                              | SearchBar                   |
| `searchHidden`                    | `search-hidden`                                | SearchBar                   |
| `sectionHeaderTopPadding`         | `section-header-top-padding`                   | TableView                   |
| `secure`                          | `secure`                                       | Boolean                     |
| `selected`                        | `selected`, `selected-*`                       | Boolean + color variants    |
| `selectedBackgroundColor`         | `selected-bg-*`                                | TableView/ListView          |
| `selectedBorderColor`             | `selected-border-*`                            | Button                      |
| `selectedButtonColor`             | `selected-button-*`                            | Button                      |
| `selectedColor`                   | `selected-*`                                   | Tab/TableView               |
| `selectedSubtitleColor`           | `selected-subtitle-*`                          | Android                     |
| `selectedTextColor`               | `selected-text-*`                              | TableView                   |
| `selectionGranularity`            | `selection-granularity`                        | iOS TextView                |
| `selectionIndicator`              | `selection-indicator`                          | Various                     |
| `selectionLimit`                  | `selection-limit`                              | Picker                      |
| `selectionOpens`                  | `selection-opens`                              | Picker                      |
| `selectionStyle`                  | `selection-style`                              | TableView                   |
| `separatorColor`                  | `separator-*`                                  | TableView/ListView          |
| `separatorHeight`                 | `separator-height`                             | TableView                   |
| `separatorStyle`                  | `separator-style`                              | TableView                   |
| `severity`                        | `severity`                                     | Notifications Android       |
| `shadowColor`                     | `shadow-*`                                     | View                        |
| `shadowRadius`                    | `shadow-radius-*`                              | View                        |
| `shiftMode`                       | `shift-mode`                                   | DatePicker                  |
| `showAsAction`                    | `show-as-action`                               | Android                     |
| `showBackgroundLocationIndicator` | `show-background-location-indicator`           | Location iOS                |
| `showBadge`                       | `show-badge`                                   | Notifications Android       |
| `showBookmark`                    | `show-bookmark`                                | Video player                |
| `showCalibration`                 | `show-calibration`                             | Camera                      |
| `showCancel`                      | `show-cancel`                                  | SearchBar                   |
| `showControls`                    | `show-controls`                                | Video player                |
| `showHidden`                      | `show-hidden`                                  | SearchBar                   |
| `showHorizontalScrollIndicator`   | `show-horizontal-scroll-indicator`             | ScrollView                  |
| `showMasterInPortrait`            | `show-master-in-portrait`                      | SplitWindow                 |
| `showPagingControl`               | `show-paging-control`                          | ScrollView                  |
| `showProxy`                       | `show-proxy`                                   | HTTP                        |
| `showsControls`                   | `shows-controls`                               | Video player                |
| `showSearchBarInNavBar`           | `show-search-bar-in-nav-bar`                   | iOS                         |
| `showSelectionCheck`              | `show-selection-check`                         | Picker                      |
| `showUndoRedoActions`             | `show-undo-redo-actions`                       | iOS                         |
| `showVerticalScrollIndicator`     | `show-vertical-scroll-indicator`               | ScrollView                  |
| `shuffleMode`                     | `shuffle-mode`                                 | Audio                       |
| `smoothScrollOnTabClick`          | `smooth-scroll-on-tab-click`                   | Tab Android                 |
| `softKeyboardOnFocus`             | `soft-keyboard-on-focus`                       | TextField                   |
| `sorted`                          | `sorted`                                       | Boolean                     |
| `soundSetting`                    | `sound-setting`                                | Notifications               |
| `sourceType`                      | `source-type`                                  | Camera/Media                |
| `splitTrack`                      | `split-track`                                  | Switch Android              |
| `startMode`                       | `start-mode`                                   | Notification                |
| `state`                           | `state-*`                                      | Notifications               |
| `status`                          | `status`                                       | Various                     |
| `statusBarBackgroundColor`        | `status-bar-bg-*`                              | iOS                         |
| `statusBarColor`                  | `status-bar-*`                                 | Android                     |
| `statusBarHeight`                 | `status-bar-height`                            | iOS                         |
| `statusBarStyle`                  | `status-bar-style`                             | iOS                         |
| `stopped`                         | `stopped`                                      | Boolean                     |
| `style`                           | `style-*`                                      | Various components          |
| `submitEnabled`                   | `submit-enabled`, `submit-enabled-false`       | TextField                   |
| `subtitleColor`                   | `subtitle-*`                                   | Android Toolbar             |
| `subtitleTextColor`               | `subtitle-text-*`                              | Tab                         |
| `success`                         | `success`                                      | Boolean                     |
| `suppressesIncrementalRendering`  | `suppresses-incremental-rendering`             | WebView iOS                 |
| `suppressReturn`                  | `suppress-return`                              | TextField                   |
| `sustainedPerformanceMode`        | `sustained-performance-mode`                   | Android                     |
| `swipeable`                       | `swipeable`                                    | Boolean                     |
| `swipeToClose`                    | `swipe-to-close`                               | Navigation                  |
| `systemButton`                    | `system-button`                                | Button                      |
| `tabBarHidden`                    | `tab-bar-hidden`                               | iOS                         |
| `tabBarVisible`                   | `tab-bar-visible`                              | Android                     |
| `tabMode`                         | `tab-mode`                                     | Tab Android                 |
| `tabsBackgroundColor`             | `tabs-bg-*`                                    | Tab                         |
| `tabsBackgroundSelectedColor`     | `tabs-background-selected-*`                   | Tab                         |
| `tabsTranslucent`                 | `tabs-translucent`                             | iOS                         |
| `targetImageHeight`               | `target-image-height`                          | Email                       |
| `targetImageWidth`                | `target-image-width`                           | Email                       |
| `textAlign`                       | `text-*`                                       | Label (left, center, right) |
| `textStyle`                       | `text-style`                                   | Label                       |
| `thumbColor`                      | `thumb-*`                                      | Slider/Switch               |
| `thumbTintColor`                  | `thumb-tint-*`                                 | Slider iOS                  |
| `timeout`                         | `timeout-*`                                    | HTTP/Animation              |
| `tint`                            | `tint-*`                                       | Button/Tab                  |
| `titleColor`                      | `title-*`                                      | All components              |
| `titlePadding`                    | `title-padding`                                | Button                      |
| `titleTextColor`                  | `title-text-*`                                 | Button/Tab                  |
| `tlsVersion`                      | `tls-version`                                  | HTTP                        |
| `toolbarEnabled`                  | `toolbar-enabled`, `toolbar-enabled-false`     | iOS                         |
| `top`                             | `top-*`                                        | Positioning                 |
| `torch`                           | `torch`                                        | Camera                      |
| `touchEnabled`                    | `touch-enabled`, `touch-enabled-false`         | All components              |
| `touchFeedback`                   | `touch-feedback`                               | Android                     |
| `touchFeedbackColor`              | `touch-feedback-*`                             | Android                     |
| `traceDeprecation`                | `trace-deprecation`                            | Logging                     |
| `trackSignificantLocationChange`  | `track-significant-location-change`            | Location                    |
| `trackTintColor`                  | `track-tint-*`                                 | Slider/Progress             |
| `trackUserInteraction`            | `track-user-interaction`                       | Analytics                   |
| `transition`                      | `transition-*`                                 | Navigation                  |
| `translucent`                     | `translucent`                                  | Boolean                     |
| `treatReferenceAsBoundary`        | `treat-reference-as-boundary`                  | Annotations                 |
| `type`                            | `type-*`                                       | Various                     |
| `unique`                          | `unique`                                       | Boolean                     |
| `updateCurrentIntent`             | `update-current-intent`                        | Notifications Android       |
| `uprightHeight`                   | `upright-height`                               | Safe area                   |
| `uprightWidth`                    | `upright-width`                                | Safe area                   |
| `useCameraX`                      | `use-camera-x`                                 | Camera Android              |
| `useCompatPadding`                | `use-compat-padding`                           | Android                     |
| `useGrouping`                     | `use-grouping`                                 | Picker                      |
| `userInterfaceStyle`              | `user-interface-style`                         | iOS                         |
| `useSpinner`                      | `use-spinner`                                  | RefreshControl              |
| `validatesSecureCertificate`      | `validates-secure-certificate`                 | HTTP                        |
| `validRow`                        | `valid-row`                                    | TableView                   |
| `value`                           | `value-*`                                      | Various                     |
| `verticalAlign`                   | `vertical-align`                               | Label                       |
| `verticalBounce`                  | `vertical-bounce`                              | ScrollView                  |
| `verticalMargin`                  | `vertical-margin`                              | TableView                   |
| `videoQuality`                    | `video-quality`                                | Camera                      |
| `View`                            | (default)                                      | Base component styles       |
| `viewShadowColor`                 | `view-shadow-*`                                | Android                     |
| `visibility`                      | `visibility`                                   | Android                     |
| `visible`                         | `visible`, `visible-false`, `hidden`           | All components              |
| `waitsForConnectivity`            | `waits-for-connectivity`                       | Notifications               |
| `whichCamera`                     | `which-camera`                                 | Camera                      |
| `width`                           | `w-*`                                          | All components              |
| `willHandleTouches`               | `will-handles-touches`                         | ScrollView                  |
| `willScrollOnStatusTap`           | `will-scroll-on-status-tap`                    | iOS                         |
| `Window`                          | (default)                                      | Base component styles       |
| `windowPixelFormat`               | `window-pixel-format`                          | Android                     |
| `windowSoftInputMode`             | `window-soft-input-mode`                       | Android                     |
| `wobble`                          | `wobble`                                       | Boolean                     |
| `wraps`                           | `wraps`                                        | Boolean                     |
| `xOffset`                         | `x-offset`                                     | ScrollView                  |
| `yOffset`                         | `y-offset`                                     | ScrollView                  |
| `zIndex`                          | `z-index-*`                                    | All components              |
| `zoomEnabled`                     | `zoom-enabled`, `zoom-enabled-false`           | ScrollView/WebView          |
| `zoomScale`                       | `zoom-scale-*`                                 | ScrollView                  |

---

## Class Categories by Prefix (Complete Inventory)

### Layout & Structure

| Prefix        | Count | Examples                                                 |
| ------------- | ----- | -------------------------------------------------------- |
| `horizontal`  | 1     | `horizontal`                                             |
| `vertical`    | 1     | `vertical`                                               |
| `composite`   | 1     | `composite` (default, omit class)                        |
| `grid`        | 1     | `grid`                                                   |
| `grid-cols-*` | ~12   | `grid-cols-2`, `grid-cols-3`, etc.                       |
| `col-*`       | ~24   | `col-1/2`, `col-2/3`, etc. (percentages)                 |
| `row-*`       | ~55   | `row-*` (grid row related)                               |
| `wh-`         | ~60   | `wh-0`, `wh-auto`, `wh-screen`, `wh-full`, `wh-1/2`      |
| `w-`          | ~60   | `w-0` to `w-96`, `w-auto`, `w-screen`, `w-full`, `w-1/2` |
| `h-`          | ~60   | `h-0` to `h-96`, `h-auto`, `h-screen`, `h-full`, `h-1/2` |
| `content-*`   | ~20   | `content-h-*`, `content-w-*`                             |
| `aspect-*`    | 2     | `aspect-ratio-16-9`, `aspect-ratio-4-3`                  |

**Important: `w-full` vs `w-screen`**
- `w-full` → `width: '100%'` — 100% of parent container
- `w-screen` → `width: Ti.UI.FILL` — Fills all available space in parent
- `h-full` → `height: '100%'` — 100% of parent container
- `h-screen` → `height: Ti.UI.FILL` — Fills all available space in parent
- `wh-full` → Both `'100%'` |

### Spacing (Margins & Padding)

| Prefix      | Count | Examples                                            |
| ----------- | ----- | --------------------------------------------------- |
| `m-`        | ~80   | `m-0` to `m-96`, `m-auto`, `m-1/2`, `m-px`, `m-0.5` |
| `mt-`       | ~80   | `mt-0` to `mt-96`, `mt-auto`, `mt-1/2`, `mt-px`     |
| `mb-`       | ~80   | `mb-0` to `mb-96`, `mb-auto`, `mb-1/2`, `mb-px`     |
| `ml-`       | ~80   | `ml-0` to `ml-96`, `ml-auto`, `ml-1/2`, `ml-px`     |
| `mr-`       | ~80   | `mr-0` to `mr-96`, `mr-auto`, `mr-1/2`, `mr-px`     |
| `mx-`       | ~80   | `mx-0` to `mx-96`, `mx-auto`, `mx-1/2`, `mx-px`     |
| `my-`       | ~80   | `my-0` to `my-96`, `my-auto`, `my-1/2`, `my-px`     |
| `p-`        | ~80   | `p-0` to `p-96`, `p-auto`, `p-1/2`, `p-px`          |
| `pt-`       | ~80   | `pt-0` to `pt-96`, `pt-auto`, `pt-1/2`, `pt-px`     |
| `pb-`       | ~80   | `pb-0` to `pb-96`, `pb-auto`, `pb-1/2`, `pb-px`     |
| `pl-`       | ~80   | `pl-0` to `pl-96`, `pl-auto`, `pl-1/2`, `pl-px`     |
| `pr-`       | ~80   | `pr-0` to `pr-96`, `pr-auto`, `pr-1/2`, `pr-px`     |
| `px-`       | ~80   | `px-0` to `px-96`, `px-auto`, `px-1/2`, `px-px`     |
| `py-`       | ~80   | `py-0` to `py-96`, `py-auto`, `py-1/2`, `py-px`     |
| `gap-`      | ~60   | `gap-0` to `gap-96`, `gap-px`, fractions            |
| `padding-*` | ~155  | `padding-top-*`, `padding-bottom-*`, etc.           |

### Positioning

| Prefix       | Count | Examples                                                            |
| ------------ | ----- | ------------------------------------------------------------------- |
| `top-`       | ~60   | `top-0` to `top-96`, `top-auto`, `top-1/2`, `top-px`                |
| `right-`     | ~60   | `right-0` to `right-96`, `right-auto`, `right-1/2`, `right-px`      |
| `bottom-`    | ~60   | `bottom-0` to `bottom-96`, `bottom-auto`, `bottom-1/2`, `bottom-px` |
| `left-`      | ~60   | `left-0` to `left-96`, `left-auto`, `left-1/2`, `left-px`           |
| `inset-*`    | ~20   | `inset-*` (all sides)                                               |
| `position-*` | ~5    | Various position utilities                                          |

### Colors (Background)

| Prefix               | Count     | Examples                                                                       |
| -------------------- | --------- | ------------------------------------------------------------------------------ |
| `bg-`                | **1,688** | `bg-white`, `bg-gray-*` (50-950), all 22 Tailwind colors                       |
|                      |           | Each color has 11 shades: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 |
|                      |           | Plus: `bg-black`, `bg-white`, `bg-transparent`, `bg-translucent`               |
| `active-tint-*`      | ~24       | `active-tint-*` (all colors)                                                   |
| `selected-bg-*`      | ~264      | `selected-bg-*` (selected state backgrounds)                                   |
| `badge-bg-*`         | ~264      | `badge-bg-*` (badge backgrounds)                                               |
| `title-bg-*`         | ~264      | `title-bg-*` (title backgrounds)                                               |
| `tabs-bg-*`          | ~264      | `tabs-bg-*` (tab backgrounds)                                                  |
| `keyboard-toolbar-*` | ~285      | `keyboard-toolbar-*` colors + heights                                          |
| `thumb-*`            | ~264      | `thumb-*` colors (sliders)                                                     |
| `track-*`            | ~264      | `track-*` colors (sliders)                                                     |
| `status-bar-bg-*`    | ~264      | `status-bar-bg-*` (status bar)                                                 |
| `nav-*`              | ~492      | `nav-bg-*`, `nav-tint-*` (navigation)                                          |
| `tint-*`             | ~490      | `tint-*` colors (UI tinting)                                                   |
| `placeholder-*`      | ~245      | `placeholder-*` colors                                                         |
| `hint-*`             | ~247      | `hint-*` colors                                                                |
| `subtitle-*`         | ~490      | `subtitle-*` colors                                                            |
| `bar-*`              | ~245      | `bar-bg-*`, `bar-color-*`                                                      |
| `separator-*`        | ~278      | `separator-*` colors                                                           |
| `indicator-*`        | ~245      | `indicator-*` colors                                                           |
| `disabled-*`         | ~245      | `disabled-*` colors (disabled state)                                           |
| `highlighted-*`      | ~245      | `highlighted-*` colors                                                         |

### Colors (Text & Foreground)

| Prefix       | Count     | Examples                                                            |
| ------------ | --------- | ------------------------------------------------------------------- |
| `text-`      | **273**   | `text-white`, `text-gray-*` (50-950), `text-center/left/right`      |
|              |           | Text sizes: `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl` |
| `title-*`    | **1,019** | `title-*`, `title-attributes-*`, `title-color-*`                    |
| `selected-*` | **1,471** | `selected-*`, `selected-bg-*`, `selected-color-*`                   |
| `badge-*`    | **735**   | `badge-*`, `badge-bg-*`, `badge-color-*`                            |
| `colors-*`   | ~245      | `colors-*` (picker colors)                                          |
| `color-*`    | ~245      | `color-*` variants                                                  |

### Borders & Radius

| Prefix      | Count   | Examples                                                   |
| ----------- | ------- | ---------------------------------------------------------- |
| `border-`   | **303** | `border-0`, `border-(1)`, `border-gray-*` colors           |
|             |         | `border-t-*`, `border-r-*`, `border-b-*`, `border-l-*`     |
| `rounded-*` | **455** | `rounded-none`, `rounded-sm`, `rounded-lg`                 |
|             |         | `rounded-full-*` (with size: `rounded-full-12`)            |
|             |         | `rounded-t-*`, `rounded-r-*`, `rounded-b-*`, `rounded-l-*` |

### Typography

| Prefix                | Count | Examples                                                     |
| --------------------- | ----- | ------------------------------------------------------------ |
| `text-*`              | 273   | Text colors, sizes, alignment                                |
| `font-*`              | 9     | `font-thin`, `font-light`, `font-normal`, `font-medium`      |
|                       |       | `font-semibold`, `font-bold`, `font-extrabold`, `font-black` |
| `line-h-multiple-*`   | ~85   | Line height as multiple                                      |
| `line-spacing-*`      | ~85   | Line spacing                                                 |
| `line-break-mode-*`   | 7     | `line-break-mode-attribute-by-word-wrapping`, etc.           |
| `letter-spacing-*`    | ~85   | Letter spacing values                                        |
| `paragraph-spacing-*` | ~120  | Paragraph spacing                                            |
| `ellipsize-*`         | ~18   | `ellipsize-*` (text truncation)                              |

### Accessibility

| Prefix            | Count | Examples                                                                     |
| ----------------- | ----- | ---------------------------------------------------------------------------- |
| `accessibility-*` | 7     | `accessibility-enabled`, `accessibility-enabled-false`                       |
|                   |       | `accessibility-hidden`, `accessibility-hidden-false`                         |
|                   |       | `accessibility-disable-long-press`, `accessibility-disable-long-press-false` |

### Input & Keyboard

| Prefix                  | Count   | Examples                                                                   |
| ----------------------- | ------- | -------------------------------------------------------------------------- |
| `keyboard-*`            | **297** | `keyboard-type-*`, `keyboard-appearance-*`                                 |
| `keyboard-type-*`       | 11      | `email`, `number-pad`, `phone-pad`, `url`, `decimal-pad`                   |
|                         |         | `twitter`, `websearch`, `ascii`, `namephone-pad`                           |
|                         |         | `numbers-punctuation`                                                      |
| `return-key-type-*`     | 12      | `next`, `done`, `go`, `search`, `send`, `continue`                         |
|                         |         | `route`, `join`, `yahoo`, `google`, `emergency-call`, `returnkey`          |
| `keyboard-appearance-*` | 3       | `keyboard-appearance`, `dark`, `light`                                     |
| `keyboard-toolbar-*`    | ~285    | `keyboard-toolbar-*` (colors, heights)                                     |
| `keyboard-visible-*`    | 2       | `keyboard-visible`, `keyboard-visible-false`                               |
| `autocapitalization-*`  | 4       | `autocapitalization-text-all`, `text-none`, `text-sentences`, `text-words` |
| `autocorrect`           | 2       | `autocorrect`, `autocorrect-false`                                         |
| `autofill-*`            | 32      | `autofill-*` variants                                                      |

### Boolean & State Classes

| Property              | Classes                                            | Pattern                             |
| --------------------- | -------------------------------------------------- | ----------------------------------- |
| `editable`            | `editable`, `editable-false`                       | Boolean                             |
| `enabled`             | `enabled`, `enabled-false`                         | Boolean                             |
| `visible`             | `visible`, `visible-false`, `hidden`               | Boolean                             |
| `selectable`          | `selectable`, `selectable-false`                   | Boolean                             |
| `scrolling`           | `scrolling-enabled`, `scrolling-enabled-false`     | Boolean                             |
| `scrollable`          | `scrollable`                                       | Boolean                             |
| `zoom`                | `zoom-enabled`, `zoom-enabled-false`               | Boolean                             |
| `touch`               | `touch-enabled`, `touch-enabled-false`             | Boolean                             |
| `clip`                | `clip-enabled`, `clip-enabled-false`               | Boolean (iOS)                       |
| `interactive-dismiss` | `interactive-dismiss-mode-enabled`, `*-false`      | Boolean (iOS)                       |
| `large-title`         | `large-title-enabled`, `large-title-enabled-false` | Boolean (iOS)                       |
| `overlay`             | `overlay-enabled`, `overlay-enabled-false`         | Boolean (iOS)                       |
| `toolbar`             | `toolbar-enabled`, `toolbar-enabled-false`         | Boolean                             |
| `submit`              | `submit-enabled`, `submit-enabled-false`           | Boolean                             |
| `active`              | `active`, `active-false`                           | Boolean                             |
| `modal`               | `modal`                                            | Boolean                             |
| `animated`            | `animated`                                         | Boolean                             |
| `focusable`           | `focusable`                                        | Boolean                             |
| `checkable`           | `checkable`                                        | Boolean                             |
| `checked`             | `checked`                                          | Boolean                             |
| `cancelable`          | `cancelable`                                       | Boolean                             |
| `canceled`            | `canceled`                                         | Boolean                             |
| `closed`              | `closed`                                           | Boolean                             |
| `compact`             | `compact`                                          | Boolean                             |
| `connected`           | `connected`                                        | Boolean                             |
| `continuous`          | `continuous`                                       | Boolean                             |
| `debug`               | `debug`                                            | Boolean                             |
| `destructive`         | `destructive`                                      | Boolean                             |
| `editable`            | `editable`, `editable-false`                       | Boolean                             |
| `editing`             | `editing`                                          | Boolean                             |
| `enabled`             | `enabled`, `enabled-false`                         | Boolean                             |
| `exact`               | `exact`                                            | Boolean                             |
| `experimental`        | `experimental`                                     | Boolean                             |
| `hidden`              | `hidden`                                           | Boolean (alias for `visible-false`) |
| `hires`               | `hires`                                            | Boolean                             |
| `html`                | `html`                                             | Boolean                             |
| `httponly`            | `httponly`                                         | Boolean                             |
| `iconified`           | `iconified`                                        | Boolean                             |
| `interactive`         | `interactive`                                      | Boolean                             |
| `loading`             | `loading`                                          | Boolean                             |
| `looping`             | `looping`                                          | Boolean                             |
| `modal`               | `modal`                                            | Boolean                             |
| `moveable`            | `moveable`                                         | Boolean                             |
| `moving`              | `moving`                                           | Boolean                             |
| `numeric`             | `numeric`                                          | Boolean                             |
| `online`              | `online`                                           | Boolean                             |
| `opaque`              | `opaque`                                           | Boolean                             |
| `opaquebackground`    | `opaquebackground`                                 | Boolean                             |
| `persistent`          | `persistent`                                       | Boolean                             |
| `portrait`            | `portrait`                                         | Boolean                             |
| `recording`           | `recording`                                        | Boolean                             |
| `reverse`             | `reverse`                                          | Boolean                             |
| `running`             | `running`                                          | Boolean                             |
| `scrollable`          | `scrollable`                                       | Boolean                             |
| `secure`              | `secure`                                           | Boolean                             |
| `selected`            | `selected` (also has color variants)               | Boolean                             |
| `sorted`              | `sorted`                                           | Boolean                             |
| `stopped`             | `stopped`                                          | Boolean                             |
| `success`             | `success`                                          | Boolean                             |
| `swipeable`           | `swipeable`                                        | Boolean                             |
| `translucent`         | `translucent`                                      | Boolean                             |
| `transparent`         | `transparent`                                      | Boolean                             |
| `unique`              | `unique`                                           | Boolean                             |
| `uppercase`           | `uppercase`                                        | Boolean (also text transform)       |
| `visible`             | `visible`, `visible-false`                         | Boolean                             |
| `wraps`               | `wraps`                                            | Boolean                             |
| `wobble`              | `wobble`                                           | Boolean                             |

### Text Transformation

| Class         | Property           | Value                             |
| ------------- | ------------------ | --------------------------------- |
| `uppercase`   | autocapitalization | TEXT_AUTOCAPITALIZATION_ALL       |
| `capitalize`  | autocapitalization | TEXT_AUTOCAPITALIZATION_WORDS     |
| `sentences`   | autocapitalization | TEXT_AUTOCAPITALIZATION_SENTENCES |
| `normal-case` | autocapitalization | TEXT_AUTOCAPITALIZATION_NONE      |

**Note:** Use `autocapitalization-*` classes for explicit control, or single-word shortcuts.

### Opacity

| Pattern     | Examples                                                              |
| ----------- | --------------------------------------------------------------------- |
| `opacity-*` | `opacity-0`, `opacity-5`, `opacity-10` ... `opacity-100` (23 classes) |
|             | Also: `opacity-to-0`, `opacity-to-100`                                |

### Transformation & Animation

| Prefix       | Count | Examples                                                          |
| ------------ | ----- | ----------------------------------------------------------------- |
| `rotate-*`   | 14    | `rotate-0`, `rotate-1`, `rotate-2`, `rotate-3`, `rotate-6`        |
|              |       | `rotate-12`, `rotate-45`, `rotate-90`, `rotate-135`, `rotate-180` |
|              |       | `rotate-225`, `rotate-270`, `rotate-315`, `rotate-360`            |
| `scale-*`    | 15    | `scale-0`, `scale-5` to `scale-200`                               |
| `scale-x-*`  | 15    | `scale-x-0`, `scale-x-5` to `scale-x-200`                         |
| `scale-y-*`  | 15    | `scale-y-0`, `scale-y-5` to `scale-y-200`                         |
| `origin-*`   | ~9    | `origin-center`, `origin-top-left`, etc.                          |
| `duration-*` | 22    | `duration-0`, `duration-50` to `duration-5000`                    |
| `delay-*`    | 22    | `delay-0`, `delay-50` to `delay-5000`                             |
| `repeat-*`   | ~31   | `repeat-*` variants                                               |

### Shadows & Elevation

| Prefix        | Count   | Examples                                                                 |
| ------------- | ------- | ------------------------------------------------------------------------ |
| `shadow-*`    | **285** | `shadow-none`, `shadow-sm`, `shadow-md`, `shadow-lg`                     |
|               |         | `shadow-xl`, `shadow-2xl`, `shadow-xs`, `shadow-inner`, `shadow-outline` |
|               |         | `shadow-*` (all colors), `shadow-radius-*`                               |
| `elevation-*` | 29      | `elevation-0` to `elevation-96` (Android only)                           |
|               |         | `elevation-px`                                                           |

### Z-Index & Overflow

| Prefix       | Count | Examples                                 |
| ------------ | ----- | ---------------------------------------- |
| `z-index-*`  | 6     | `z-index-0` to `z-index-50`              |
| `overflow-*` | 6     | `overflow-hidden`, `overflow-scroll`     |
|              |       | `overflow-x-hidden`, `overflow-x-scroll` |
|              |       | `overflow-y-hidden`, `overflow-y-scroll` |

### Status Bar & Navigation

| Prefix         | Count   | Examples                                       |
| -------------- | ------- | ---------------------------------------------- |
| `status-bar-*` | **563** | `status-bar-*`, `status-bar-bg-*` (all colors) |
|                |         | `status-bar-*-gray-*` (all states + colors)    |
| `tabs-*`       | **492** | `tabs-bg-*`, `tabs-tint-*`                     |
| `nav-*`        | **492** | `nav-bg-*`, `nav-tint-*`                       |

### UI Component States

| Prefix          | Count     | Examples                                                       |
| --------------- | --------- | -------------------------------------------------------------- |
| `selected-*`    | **1,471** | `selected-*`, `selected-bg-*`, `selected-color-*` (all colors) |
| `badge-*`       | **735**   | `badge-*`, `badge-bg-*`, `badge-color-*`                       |
| `title-*`       | **1,019** | `title-*`, `title-attributes-*`, `title-bg-*`                  |
| `disabled-*`    | **245**   | `disabled-*`, `disabled-bg-*`, `disabled-color-*`              |
| `highlighted-*` | **245**   | `highlighted-*` colors                                         |
| `pull-*`        | **245**   | `pull-*` (pull-to-refresh colors)                              |
| `results-*`     | **492**   | `results-*` (search results styling)                           |
| `on-*`          | **490**   | `on-*` (switch/toggle "on" state)                              |

### Display & Sizing

| Prefix      | Count | Examples                             |
| ----------- | ----- | ------------------------------------ |
| `display-*` | ~5    | `display-*` variants                 |
| `size-*`    | ~60   | `size-*` (component sizing)          |
| `min-*`     | ~73   | `minimum-*`, `min-*` (minimum sizes) |
| `max-*`     | ~91   | `maximum-*`, `max-*` (maximum sizes) |

### Media & Video

| Prefix      | Count | Examples                          |
| ----------- | ----- | --------------------------------- |
| `media-*`   | ~23   | `media-*` (media control styling) |
| `video-*`   | ~5    | `video-*` properties              |
| `audio-*`   | ~15   | `audio-*` properties              |
| `picture-*` | ~5    | `picture-*` properties            |

### Other Special Prefixes

| Prefix         | Count | Usage                                        |
| -------------- | ----- | -------------------------------------------- |
| `allows-*`     | ~14   | `allows-*`, `allows-*-*-false` (permissions) |
| `can-*`        | ~14   | `can-*` (capability queries)                 |
| `has-*`        | ~12   | `has-*` (state queries)                      |
| `is-*`         | ~26   | `is-*` (state queries)                       |
| `no-*`         | ~10   | `no-*` (negations)                           |
| `not-*`        | ~5    | `not-*` (negations)                          |
| `show-*`       | ~30   | `show-*`, `shows-*` (visibility control)     |
| `hide-*`       | ~10   | `hide-*`, `hides-*` (visibility control)     |
| `cache-*`      | ~15   | `cache-*` (caching behavior)                 |
| `autohide`     | 2     | `autohide`, `autohide-false`                 |
| `autoplay`     | 2     | `autoplay`, `autoplay-false`                 |
| `autorepeat`   | 2     | `autorepeat`, `autorepeat-false`             |
| `autoreverse`  | 2     | `autoreverse`, `autoreverse-false`           |
| `autorotate`   | 2     | `autorotate`, `autorotate-false`             |
| `timeout-*`    | ~22   | `timeout-*` (timeout values)                 |
| `count-*`      | ~23   | `count-*` (count limits)                     |
| `frequency-*`  | ~5    | `frequency-*` (update frequency)             |
| `exit-*`       | ~5    | `exit-*` (exit animations)                   |
| `ease-*`       | ~5    | `ease-*` (easing functions)                  |
| `curve-*`      | ~5    | `curve-*` (animation curves)                 |
| `flip-*`       | ~5    | `flip-*` (flip animations)                   |
| `from-*`       | ~245  | `from-*` (animation from states)             |
| `to-*`         | ~245  | `to-*` (animation to states)                 |
| `dim-*`        | ~5    | `dim-*` (dimming)                            |
| `fast-*`       | ~5    | `fast-*` (fast scroll/animation)             |
| `slow-*`       | ~5    | `slow-*` (slow scroll/animation)             |
| `smooth-*`     | ~5    | `smooth-*` (smooth scrolling)                |
| `keep-*`       | ~5    | `keep-*` (keep state)                        |
| `ignore-*`     | ~5    | `ignore-*` (ignore events)                   |
| `include-*`    | ~5    | `include-*` (include in layout)              |
| `extend-*`     | ~10   | `extend-*` (extend regions)                  |
| `fixed-*`      | ~5    | `fixed-*` (fixed positioning)                |
| `native-*`     | ~5    | `native-*` (native components)               |
| `override-*`   | ~5    | `override-*` (theme overrides)               |
| `custom-*`     | ~5    | `custom-*` (custom properties)               |
| `generated-*`  | ~5    | `generated-*` (generated content)            |
| `group-*`      | ~5    | `group-*` (grouping)                         |
| `grouping-*`   | ~5    | `grouping-*` (grouping behavior)             |
| `handle-*`     | ~5    | `handle-*` (event handlers)                  |
| `header-*`     | ~5    | `header-*` (header styling)                  |
| `footer-*`     | ~5    | `footer-*` (footer styling)                  |
| `main-*`       | ~5    | `main-*` (main content)                      |
| `manual-*`     | ~5    | `manual-*` (manual control)                  |
| `master-*`     | ~5    | `master-*` (master-detail)                   |
| `method-*`     | ~5    | `method-*` (HTTP methods)                    |
| `mode-*`       | ~31   | `mode-*` (display/interaction modes)         |
| `multiple-*`   | ~5    | `multiple-*` (multiple selection)            |
| `layer-*`      | ~5    | `layer-*` (layering)                         |
| `lazy-*`       | ~5    | `lazy-*` (lazy loading)                      |
| `login-*`      | ~26   | `login-*` (login-related)                    |
| `mixed-*`      | ~5    | `mixed-*` (mixed content)                    |
| `object-*`     | ~5    | `object-*` (object fit/position)             |
| `in-*`         | ~5    | `in-*` (insets)                              |
| `items-*`      | ~5    | `items-*` (list items)                       |
| `indention-*`  | ~31   | `indention-*` (text indention)               |
| `outputs-*`    | ~14   | `outputs-*` (output devices)                 |
| `inputs-*`     | ~14   | `inputs-*` (input devices)                   |
| `override-*`   | ~5    | `override-*` (property overrides)            |
| `path-*`       | ~5    | `path-*` (path drawing)                      |
| `pause-*`      | ~5    | `pause-*` (pause behavior)                   |
| `playback-*`   | ~12   | `playback-*` (media playback)                |
| `pointer-*`    | ~5    | `pointer-*` (pointer events)                 |
| `prevent-*`    | ~5    | `prevent-*` (prevent defaults)               |
| `proximity-*`  | ~5    | `proximity-*` (sensor)                       |
| `prune-*`      | ~5    | `prune-*` (prune content)                    |
| `ready-*`      | ~5    | `ready-*` (ready state)                      |
| `remote-*`     | ~5    | `remote-*` (remote images)                   |
| `requires-*`   | ~5    | `requires-*` (requirements)                  |
| `role-*`       | ~5    | `role-*` (accessibility roles)               |
| `section-*`    | ~31   | `section-*` (list sections)                  |
| `search-*`     | ~5    | `search-*` (search UI)                       |
| `selection-*`  | ~5    | `selection-*` (text selection)               |
| `shift-*`      | ~5    | `shift-*` (shift modifier)                   |
| `shuffle-*`    | ~5    | `shuffle-*` (shuffle order)                  |
| `source-*`     | ~5    | `source-*` (image source)                    |
| `split-*`      | ~5    | `split-*` (split view)                       |
| `state-*`      | ~16   | `state-*` (UI states)                        |
| `style-*`      | ~14   | `style-*` (style variants)                   |
| `submit-*`     | ~5    | `submit-*` (form submission)                 |
| `suppress-*`   | ~5    | `suppress-*`                                 | `suppresses-*` | ~5 | `suppresses-*` |
| `sustained-*`  | ~5    | `sustained-*`                                |
| `swipe-*`      | ~5    | `swipe-*` (swipe gestures)                   |
| `target-*`     | ~120  | `target-*` (action targets)                  |
| `throw-*`      | ~5    | `throw-*` (throw gestures)                   |
| `tls-*`        | ~5    | `tls-*` (TLS settings)                       |
| `toggle-*`     | ~5    | `toggle-*` (toggle behavior)                 |
| `toolbar-*`    | ~5    | `toolbar-*` (toolbar styling)                |
| `trace-*`      | ~5    | `trace-*` (debug traces)                     |
| `update-*`     | ~5    | `update-*` (update behavior)                 |
| `use-*`        | ~5    | `use-*` (feature flags)                      |
| `user-*`       | ~5    | `user-*` (user preferences)                  |
| `valid-*`      | ~5    | `valid-*` (validation)                       |
| `validates-*`  | ~5    | `validates-*`                                |
| `value-*`      | ~10   | `value-*` (component values)                 |
| `view-*`       | ~245  | `view-*` (view properties)                   |
| `visibility-*` | ~5    | `visibility-*`                               |
| `waits-*`      | ~5    | `waits-*` (wait states)                      |
| `which-*`      | ~5    | `which-*` (conditional)                      |
| `will-*`       | ~5    | `will-*` (future state)                      |
| `upside-*`     | ~5    | `upside-*` (orientation)                     |
| `upright-*`    | ~62   | `upright-*` (orientation)                    |
| `save-*`       | ~5    | `save-*` (save behavior)                     |
| `scales-*`     | ~5    | `scales-*`                                   |
| `scaling-*`    | ~5    | `scaling-*`                                  |
| `scroll-*`     | ~20   | `scroll-*`                                   |
| `scrolls-*`    | ~5    | `scrolls-*`                                  |

---

## PROHIBITED: Tailwind Classes (DO NOT EXIST)

| Tailwind          | Issue                             | PurgeTSS Alternative                        |
| ----------------- | --------------------------------- | ------------------------------------------- |
| `flex-row`        | Flexbox not supported             | `horizontal`                                |
| `flex-col`        | Flexbox not supported             | `vertical`                                  |
| `flex`            | Flexbox not supported             | `horizontal` or `vertical`                  |
| `justify-between` | Flexbox not supported             | Use margins/positioning                     |
| `justify-center`  | Flexbox not supported             | Use margins/positioning                     |
| `items-center`    | Different meaning in Titanium     | Use layout + sizing                         |
| `w-full`          | Different meaning than Tailwind   | Use `w-full` for 100%, `w-screen` for FILL  |
| `flex-wrap`       | Flexbox not supported             | Not supported                               |
| `flex-grow`       | Flexbox not supported             | Not supported                               |
| `flex-shrink`     | Flexbox not supported             | Not supported                               |
| `rounded-full`    | Requires size suffix              | `rounded-full-12` (size × 4 = diameter)     |
| `space-x-*`       | Space utilities not like Tailwind | Use `gap-*`                                 |
| `space-y-*`       | Space utilities not like Tailwind | Use `gap-*`                                 |
| `leading-*`       | Uses different prefix             | Use `line-h-multiple-*` or `line-spacing-*` |
| `tracking-*`      | Uses different prefix             | Use `letter-spacing-*`                      |

---

## All 364 Unique Prefixes (Alphabetical)

```
accessibility, accessory, accuracy, action, active, activity, alignment, all, allow, allows,
amber, anchor, animated, app, arrow, aspect, audio, authentication, auto, autocapitalization,
autocorrect, autofill, autohide, autoplay, autorepeat, autoreverse, autorotate, availability,
available, backfill, background, backward, badge, bar, battery, bg, black, block, blue, border,
bottom, break, bubble, bubbles, button, bypass, cache, calendar, camera, can, cancel,
cancelable, canceled, capitalize, case, charset, checkable, checked, clear, clip, closed,
code, col, colors, compact, composite, compression, connected, contacts, content, continuous,
count, current, curve, custom, cyan, date, debug, delay, destructive, dim, disable, disabled,
display, drag, drawer, drop, duration, ease, editable, editing, elevation, eligible, ellipsize,
emerald, enable, enabled, exact, exit, experimental, extend, fast, filter, fixed, flag, flip,
focusable, font, footer, force, format, format24, frequency, from, fuchsia, fullscreen, gap,
generated, getters, gray, green, grid, group, grouping, h, handle, has, header, hidden, hide,
hides, highlighted, hint, hires, home, horizontal, hour12, html, httponly, hyphenation, icon,
iconified, idle, ignore, image, in, include, indention, indicator, indigo, input, inputs,
inset, interactive, is, italic, items, java, keep, keyboard, kind, landscape, large, launch,
layer, lazy, left, letter, light, lime, line, lines, list, loading, location, login, looping,
m, main, manual, master, max, maximum, mb, media, method, min, minimum, mixed, ml, modal,
mode, move, moveable, movie, moving, mr, mt, multiple, mx, my, native, nav, navigation,
needs, network, neutral, no, normal, not, numeric, object, on, online, opacity, opaque,
opaquebackground, opaquebg, orange, orientation, origin, outputs, overflow, overlay, override,
p, padding, page, paging, paragraph, password, path, pause, pb, persistent, picture, pink,
pl, placeholder, platform, playback, pointer, portrait, position, pr, prevent, proximity,
prune, pt, pull, purple, px, py, ready, recording, red, remote, repeat, requires, results,
return, reverse, right, role, rose, rotate, rounded, row, running, save, scale, scales,
scaling, scroll, scrollable, scrolling, scrolls, search, section, secure, selected, selection,
sentences, separator, shadow, shift, show, shows, shuffle, size, sky, slate, smooth, sorted,
source, split, state, status, stone, stopped, style, submit, subtitle, success, suppress,
suppresses, sustained, swipe, swipeable, tab, tabs, target, teal, text, theme, throw, thumb,
timeout, tint, title, tls, to, toggle, toolbar, top, torch, touch, trace, track, translucent,
transparent, treat, type, unique, update, uppercase, upright, upside, use, user, valid,
validates, value, vertical, video, view, violet, visibility, visible, w, waits, wh, which,
white, will, wobble, wraps, x, y, yellow, z, zinc, zoom
```

---

## Quick Verification Commands

```bash
# Search for a specific prefix
grep -o "'\.[a-zA-Z0-9_/-]*':" ./purgetss/styles/tailwind.tss | sed "s/'\.//;s/':$//" | grep "^bg-" | sort -u

# Search for keyboard classes
grep -o "'\.[a-zA-Z0-9_/-]*':" ./purgetss/styles/tailwind.tss | sed "s/'\.//;s/':$//" | grep "^keyboard-type-" | sort -u

# Search for text classes
grep -o "'\.[a-zA-Z0-9_/-]*':" ./purgetss/styles/tailwind.tss | sed "s/'\.//;s/':$//" | grep "^text-" | sort -u

# Search for margin classes
grep -o "'\.[a-zA-Z0-9_/-]*':" ./purgetss/styles/tailwind.tss | sed "s/'\.//;s/':$//" | grep "^m-" | sort -u

# Search for boolean/state classes
grep -o "'\.[a-zA-Z0-9_/-]*':" ./purgetss/styles/tailwind.tss | sed "s/'\.//;s/':$//" | grep -E "^(editable|enabled|visible|hidden)$"

# Count total classes
grep -o "'\.[a-zA-Z0-9_/-']*':" ./purgetss/styles/tailwind.tss | wc -l

# Count unique classes
grep -o "'\.[a-zA-Z0-9_/-']*':" ./purgetss/styles/tailwind.tss | sort -u | wc -l

# Get all unique prefixes
grep -o "'\.[a-zA-Z0-9_/-']*':" ./purgetss/styles/tailwind.tss | sed "s/'\.//;s/':$//" | while read line; do echo "${line%%-*}"; done | sort -u
```

---

## When to Use Direct Properties (No Classes)

These properties are NOT styled with classes in PurgeTSS - use as XML attributes:

| Property       | Use As Attribute                  | Notes                    |
| -------------- | --------------------------------- | ------------------------ |
| `id`           | `id="myId"`                       | Component identification |
| `onClick`      | `onClick="functionName"`          | Event handlers           |
| `onPostlayout` | `onPostlayout="handlePostlayout"` | Event handlers           |
| `hintText`     | `hintText="Email"`                | Placeholder text         |
| `passwordMask` | `passwordMask="true"`             | Password masking         |
| `value`        | `value="value"`                   | Component value          |
| `text`         | `text="Label text"`               | Label text               |
| `title`        | `title="Button title"`            | Button title             |
| `imageUrl`     | `imageUrl="/path.png"`            | Image source             |
| `bindId`       | `bindId="myData"`                 | ListView data binding    |

**Note:** For `autocapitalization`, `editable`, `enabled`, `visible`, `autocorrect` - PurgeTSS DOES have classes (see above), so you CAN use either the class or the attribute depending on your preference.

---

## Key Insights from Real Data

1. **21,236 unique classes** across **364 unique prefixes** - Far more than initially documented
2. **Extensive state management** - Hundreds of `*enabled`, `*-false` classes for UI states
3. **Platform-specific classes** - Many iOS/Android specific variants (like `[platform=ios]`)
4. **Complete color coverage** - All 22 Tailwind v3 colors with 11 shades each (50-950) = 242 color variants per prefix
5. **Boolean class pattern** - For properties like `editable`, `enabled`, `visible` → `class` and `class-false`
6. **UI component state variants** - `selected-*`, `badge-*`, `title-*`, `disabled-*` with full color coverage
7. **Keyboard toolbar styling** - Extensive `keyboard-toolbar-*` classes for custom keyboard accessories
8. **Status bar & navigation** - `status-bar-*`, `tabs-*`, `nav-*` for system UI customization
9. **Accessibility support** - `accessibility-*` classes for a11y properties
10. **Animation system** - `duration-*`, `delay-*`, `rotate-*`, `scale-*` for PurgeTSS Animation component
