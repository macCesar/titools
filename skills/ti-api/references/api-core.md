# Ti Core API Reference

## Titanium
> The top-level Titanium module.
> Extends Ti.Module
> Platforms: both
> Type: module

The Titanium module provides the Titanium Mobile API, allowing developers to access native
features of each target environment. Currently, the Android and iOSenvironments are supported.

### Titanium Namespace

The complete Titanium API is accessible from the `Titanium` namespace but, for convenience and
brevity, the alias `Ti` is also provided. As the `Titanium` namespace is functionally-identical
to its `Ti` alias, it is always recommended to use `Ti` in your code.

For example, the following pairs of Titanium calls behave exactly the same.

``` js
Titanium.API.info('Hello Titanium!');
Ti.API.info('Hello Titanium!');


*(See full overview in titanium-docs)*

### Properties (unique: 4/7)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| userAgent | String | — | both | User-agent string used by Titanium. |
| version | String | — | both | Version of Titanium that is executing. |
| buildDate | String | — | both | Date of the Titanium build. |
| buildHash | String | — | both | Git hash of the Titanium build. |


### Methods (1)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| createBuffer(params) | Ti.Buffer | both | Creates a new buffer based on the params. |


### Related Types

#### CreateBufferArgs
> Arguments to be passed to createBuffer

| Property | Type | Description |
|----------|------|-------------|
| value | String \| Number | An initial value which will be encoded and placed in the buffer. If value is a … |
| length | Number | The length of the buffer. |
| type | String | The type of data encoding to use with `value`. |
| byteOrder | Number | The byte order of this buffer. |

---

## Ti.UI
> The main <Titanium.UI> module.
> Extends Ti.Module
> Platforms: both
> Type: module

The UI module is responsible for native user-interface components and interaction inside
Titanium.  The goal of the UI module is to provide a native experience along with native
performance by compiling Javascript code into their native counterparts as part of the
build process.

### Design

The UI module is broken down into 3 major area:

* **Views** - [Views](Titanium.UI.View) are containers that host visual elements such as
controls or other views.  Views can have their properties customized, such as their border color
and radius, can fire events such as swipe events or touches, and can optionally contain a
hierarchy or other views as children. In Titanium, most views are specialized to perform both a
visual function and set of interaction behaviors such as [Table View](Titanium.UI.TableView) or
[Coverflow View](Titanium.UI.iOS.CoverFlowView).  Views are always named with the suffix `View`.

*(See full overview in titanium-docs)*

### Properties (unique: 9/285)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| semanticColorType | String | — | both | The current mode for the device (corresponding to night/dark or light/normal) |
| availableSystemFontFamilies | Array<String> | — | both | Returns a list of font families that are provided by the system. |
| backgroundColor | String \| Ti.UI.Color | — | both | Sets the background color of the master view (when there are no windows or othe… |
| backgroundImage | String | — | both | Local path or URL to an image file for setting a background for the master view… |
| overrideUserInterfaceStyle | Number | Titanium.UI.USER_INTERFACE_STYLE_UNSPECIFIED | both | Forces the app to used assigned theme instead of the system theme. |
| tintColor | String \| Ti.UI.Color | — | ios | Sets the global tint color of the application. It is inherited by the child vie… |
| userInterfaceStyle | Number | — | both | The style associated with the user interface. |
| cutoutSize | CutoutSize | — | android | Returns the position and shape of the Android notch. Read more about the notch … |
| statusBarHeight | Number | — | both | The total height of the status bar including safe area padding. |

### Constants (273)
- **ANIMATION_CURVE_\***: ANIMATION_CURVE_LINEAR
- **ANIMATION_CURVE_EASE_\***: ANIMATION_CURVE_EASE_IN, ANIMATION_CURVE_EASE_OUT
- **ANIMATION_CURVE_EASE_IN_\***: ANIMATION_CURVE_EASE_IN_OUT
- **ATTRIBUTE_\***: ATTRIBUTE_FONT, ATTRIBUTE_LIGATURE, ATTRIBUTE_KERN, ATTRIBUTE_SHADOW, ATTRIBUTE_LINK, ATTRIBUTE_OBLIQUENESS, ATTRIBUTE_EXPANSION
- **ATTRIBUTE_BACKGROUND_\***: ATTRIBUTE_BACKGROUND_COLOR
- **ATTRIBUTE_BASELINE_\***: ATTRIBUTE_BASELINE_OFFSET
- **ATTRIBUTE_FOREGROUND_\***: ATTRIBUTE_FOREGROUND_COLOR
- **ATTRIBUTE_LETTERPRESS_\***: ATTRIBUTE_LETTERPRESS_STYLE
- **ATTRIBUTE_LINE_\***: ATTRIBUTE_LINE_BREAK
- **ATTRIBUTE_LINE_BREAK_BY_\***: ATTRIBUTE_LINE_BREAK_BY_CLIPPING
- **ATTRIBUTE_LINE_BREAK_BY_CHAR_\***: ATTRIBUTE_LINE_BREAK_BY_CHAR_WRAPPING
- **ATTRIBUTE_LINE_BREAK_BY_TRUNCATING_\***: ATTRIBUTE_LINE_BREAK_BY_TRUNCATING_HEAD, ATTRIBUTE_LINE_BREAK_BY_TRUNCATING_MIDDLE, ATTRIBUTE_LINE_BREAK_BY_TRUNCATING_TAIL
- **ATTRIBUTE_LINE_BREAK_BY_WORD_\***: ATTRIBUTE_LINE_BREAK_BY_WORD_WRAPPING
- **ATTRIBUTE_PARAGRAPH_\***: ATTRIBUTE_PARAGRAPH_STYLE
- **ATTRIBUTE_STRIKETHROUGH_\***: ATTRIBUTE_STRIKETHROUGH_STYLE, ATTRIBUTE_STRIKETHROUGH_COLOR
- **ATTRIBUTE_STROKE_\***: ATTRIBUTE_STROKE_COLOR, ATTRIBUTE_STROKE_WIDTH
- **ATTRIBUTE_SUBSCRIPT_\***: ATTRIBUTE_SUBSCRIPT_STYLE
- **ATTRIBUTE_SUPERSCRIPT_\***: ATTRIBUTE_SUPERSCRIPT_STYLE
- **ATTRIBUTE_TEXT_\***: ATTRIBUTE_TEXT_EFFECT
- **ATTRIBUTE_UNDERLINE_\***: ATTRIBUTE_UNDERLINE_COLOR
- **ATTRIBUTE_UNDERLINE_BY_\***: ATTRIBUTE_UNDERLINE_BY_WORD
- **ATTRIBUTE_UNDERLINE_PATTERN_\***: ATTRIBUTE_UNDERLINE_PATTERN_SOLID, ATTRIBUTE_UNDERLINE_PATTERN_DOT, ATTRIBUTE_UNDERLINE_PATTERN_DASH
- **ATTRIBUTE_UNDERLINE_PATTERN_DASH_\***: ATTRIBUTE_UNDERLINE_PATTERN_DASH_DOT
- **ATTRIBUTE_UNDERLINE_PATTERN_DASH_DOT_\***: ATTRIBUTE_UNDERLINE_PATTERN_DASH_DOT_DOT
- **ATTRIBUTE_UNDERLINE_STYLE_\***: ATTRIBUTE_UNDERLINE_STYLE_NONE, ATTRIBUTE_UNDERLINE_STYLE_SINGLE, ATTRIBUTE_UNDERLINE_STYLE_THICK, ATTRIBUTE_UNDERLINE_STYLE_DOUBLE
- **ATTRIBUTE_UNDERLINES_\***: ATTRIBUTE_UNDERLINES_STYLE
- **ATTRIBUTE_WRITING_\***: ATTRIBUTE_WRITING_DIRECTION
- **ATTRIBUTE_WRITING_DIRECTION_\***: ATTRIBUTE_WRITING_DIRECTION_EMBEDDING, ATTRIBUTE_WRITING_DIRECTION_OVERRIDE, ATTRIBUTE_WRITING_DIRECTION_NATURAL
- **ATTRIBUTE_WRITING_DIRECTION_LEFT_TO_\***: ATTRIBUTE_WRITING_DIRECTION_LEFT_TO_RIGHT
- **ATTRIBUTE_WRITING_DIRECTION_RIGHT_TO_\***: ATTRIBUTE_WRITING_DIRECTION_RIGHT_TO_LEFT
- **AUTOFILL_TYPE_\***: AUTOFILL_TYPE_USERNAME, AUTOFILL_TYPE_PASSWORD, AUTOFILL_TYPE_NAME, AUTOFILL_TYPE_NICKNAME, AUTOFILL_TYPE_LOCATION, AUTOFILL_TYPE_ADDRESS, AUTOFILL_TYPE_SUBLOCALITY, AUTOFILL_TYPE_PHONE, AUTOFILL_TYPE_EMAIL, AUTOFILL_TYPE_URL
- **AUTOFILL_TYPE_ADDRESS_\***: AUTOFILL_TYPE_ADDRESS_LINE1, AUTOFILL_TYPE_ADDRESS_LINE2, AUTOFILL_TYPE_ADDRESS_CITY, AUTOFILL_TYPE_ADDRESS_STATE
- **AUTOFILL_TYPE_ADDRESS_CITY_\***: AUTOFILL_TYPE_ADDRESS_CITY_STATE
- **AUTOFILL_TYPE_CARD_\***: AUTOFILL_TYPE_CARD_NUMBER
- **AUTOFILL_TYPE_CARD_EXPIRATION_\***: AUTOFILL_TYPE_CARD_EXPIRATION_DATE, AUTOFILL_TYPE_CARD_EXPIRATION_DAY, AUTOFILL_TYPE_CARD_EXPIRATION_MONTH, AUTOFILL_TYPE_CARD_EXPIRATION_YEAR
- **AUTOFILL_TYPE_CARD_SECURITY_\***: AUTOFILL_TYPE_CARD_SECURITY_CODE
- **AUTOFILL_TYPE_COUNTRY_\***: AUTOFILL_TYPE_COUNTRY_NAME
- **AUTOFILL_TYPE_FAMILY_\***: AUTOFILL_TYPE_FAMILY_NAME
- **AUTOFILL_TYPE_GIVEN_\***: AUTOFILL_TYPE_GIVEN_NAME
- **AUTOFILL_TYPE_JOB_\***: AUTOFILL_TYPE_JOB_TITLE
- **AUTOFILL_TYPE_MIDDLE_\***: AUTOFILL_TYPE_MIDDLE_NAME
- **AUTOFILL_TYPE_NAME_\***: AUTOFILL_TYPE_NAME_PREFIX, AUTOFILL_TYPE_NAME_SUFFIX
- **AUTOFILL_TYPE_NEW_\***: AUTOFILL_TYPE_NEW_PASSWORD
- **AUTOFILL_TYPE_ONE_TIME_\***: AUTOFILL_TYPE_ONE_TIME_CODE
- **AUTOFILL_TYPE_ORGANIZATION_\***: AUTOFILL_TYPE_ORGANIZATION_NAME
- **AUTOFILL_TYPE_POSTAL_\***: AUTOFILL_TYPE_POSTAL_CODE
- **AUTOLINK_\***: AUTOLINK_ALL, AUTOLINK_CALENDAR, AUTOLINK_URLS, AUTOLINK_NONE, AUTOLINK_MONEY
- **AUTOLINK_EMAIL_\***: AUTOLINK_EMAIL_ADDRESSES
- **AUTOLINK_FLIGHT_\***: AUTOLINK_FLIGHT_NUMBER
- **AUTOLINK_LOOKUP_\***: AUTOLINK_LOOKUP_SUGGESTION
- **AUTOLINK_MAP_\***: AUTOLINK_MAP_ADDRESSES
- **AUTOLINK_PHONE_\***: AUTOLINK_PHONE_NUMBERS
- **AUTOLINK_PHYSICAL_\***: AUTOLINK_PHYSICAL_VALUE
- **AUTOLINK_SHIPMENT_TRACKING_\***: AUTOLINK_SHIPMENT_TRACKING_NUMBER
- **BLEND_MODE_\***: BLEND_MODE_CLEAR, BLEND_MODE_COLOR, BLEND_MODE_COPY, BLEND_MODE_DARKEN, BLEND_MODE_DIFFERENCE, BLEND_MODE_EXCLUSION, BLEND_MODE_HUE, BLEND_MODE_LIGHTEN, BLEND_MODE_LUMINOSITY, BLEND_MODE_MULTIPLY, BLEND_MODE_NORMAL, BLEND_MODE_OVERLAY, BLEND_MODE_SATURATION, BLEND_MODE_SCREEN, BLEND_MODE_XOR
- **BLEND_MODE_COLOR_\***: BLEND_MODE_COLOR_BURN, BLEND_MODE_COLOR_DODGE
- **BLEND_MODE_DESTINATION_\***: BLEND_MODE_DESTINATION_ATOP, BLEND_MODE_DESTINATION_IN, BLEND_MODE_DESTINATION_OUT, BLEND_MODE_DESTINATION_OVER
- **BLEND_MODE_HARD_\***: BLEND_MODE_HARD_LIGHT
- **BLEND_MODE_PLUS_\***: BLEND_MODE_PLUS_DARKER, BLEND_MODE_PLUS_LIGHTER
- **BLEND_MODE_SOFT_\***: BLEND_MODE_SOFT_LIGHT
- **BLEND_MODE_SOURCE_\***: BLEND_MODE_SOURCE_ATOP, BLEND_MODE_SOURCE_IN, BLEND_MODE_SOURCE_OUT
- **BREAK_\***: BREAK_SIMPLE, BREAK_BALANCED
- **BREAK_HIGH_\***: BREAK_HIGH_QUALITY
- **BUTTON_STYLE_\***: BUTTON_STYLE_FILLED, BUTTON_STYLE_OUTLINED, BUTTON_STYLE_TEXT
- **BUTTON_STYLE_OPTION_\***: BUTTON_STYLE_OPTION_POSITIVE, BUTTON_STYLE_OPTION_NEGATIVE, BUTTON_STYLE_OPTION_NEUTRAL
- **CLIPBOARD_OPTION_EXPIRATION_\***: CLIPBOARD_OPTION_EXPIRATION_DATE
- **CLIPBOARD_OPTION_LOCAL_\***: CLIPBOARD_OPTION_LOCAL_ONLY
- **DATE_PICKER_STYLE_\***: DATE_PICKER_STYLE_AUTOMATIC, DATE_PICKER_STYLE_WHEELS, DATE_PICKER_STYLE_COMPACT, DATE_PICKER_STYLE_INLINE
- **EXTEND_EDGE_\***: EXTEND_EDGE_TOP, EXTEND_EDGE_BOTTOM, EXTEND_EDGE_LEFT, EXTEND_EDGE_RIGHT, EXTEND_EDGE_NONE, EXTEND_EDGE_ALL
- **FACE_\***: FACE_DOWN, FACE_UP
- **HIDDEN_BEHAVIOR_\***: HIDDEN_BEHAVIOR_GONE, HIDDEN_BEHAVIOR_INVISIBLE
- **HINT_TYPE_\***: HINT_TYPE_STATIC, HINT_TYPE_ANIMATED
- **HYPHEN_\***: HYPHEN_NONE, HYPHEN_NORMAL, HYPHEN_FULL
- **HYPHEN_FULL_\***: HYPHEN_FULL_FAST
- **HYPHEN_NORMAL_\***: HYPHEN_NORMAL_FAST
- **INPUT_BORDERSTYLE_\***: INPUT_BORDERSTYLE_BEZEL, INPUT_BORDERSTYLE_LINE, INPUT_BORDERSTYLE_NONE, INPUT_BORDERSTYLE_ROUNDED, INPUT_BORDERSTYLE_UNDERLINED, INPUT_BORDERSTYLE_FILLED
- **INPUT_BUTTONMODE_\***: INPUT_BUTTONMODE_ALWAYS, INPUT_BUTTONMODE_NEVER, INPUT_BUTTONMODE_ONBLUR, INPUT_BUTTONMODE_ONFOCUS
- **INPUT_TYPE_CLASS_\***: INPUT_TYPE_CLASS_NUMBER, INPUT_TYPE_CLASS_TEXT
- **KEYBOARD_APPEARANCE_\***: KEYBOARD_APPEARANCE_DEFAULT, KEYBOARD_APPEARANCE_DARK, KEYBOARD_APPEARANCE_LIGHT
- **KEYBOARD_TYPE_\***: KEYBOARD_TYPE_ASCII, KEYBOARD_TYPE_DEFAULT, KEYBOARD_TYPE_EMAIL, KEYBOARD_TYPE_WEBSEARCH, KEYBOARD_TYPE_TWITTER, KEYBOARD_TYPE_URL
- **KEYBOARD_TYPE_DECIMAL_\***: KEYBOARD_TYPE_DECIMAL_PAD
- **KEYBOARD_TYPE_NAMEPHONE_\***: KEYBOARD_TYPE_NAMEPHONE_PAD
- **KEYBOARD_TYPE_NUMBER_\***: KEYBOARD_TYPE_NUMBER_PAD
- **KEYBOARD_TYPE_NUMBERS_\***: KEYBOARD_TYPE_NUMBERS_PUNCTUATION
- **KEYBOARD_TYPE_PHONE_\***: KEYBOARD_TYPE_PHONE_PAD
- **LANDSCAPE_\***: LANDSCAPE_LEFT, LANDSCAPE_RIGHT
- **LIST_ACCESSORY_TYPE_\***: LIST_ACCESSORY_TYPE_NONE, LIST_ACCESSORY_TYPE_CHECKMARK, LIST_ACCESSORY_TYPE_DETAIL, LIST_ACCESSORY_TYPE_DISCLOSURE
- **LIST_ITEM_TEMPLATE_\***: LIST_ITEM_TEMPLATE_DEFAULT, LIST_ITEM_TEMPLATE_SETTINGS, LIST_ITEM_TEMPLATE_CONTACTS, LIST_ITEM_TEMPLATE_SUBTITLE
- **NOTIFICATION_DURATION_\***: NOTIFICATION_DURATION_LONG, NOTIFICATION_DURATION_SHORT
- **OTHER_\***: FILL, PORTRAIT, SIZE, UNKNOWN
- **PICKER_TYPE_\***: PICKER_TYPE_DATE, PICKER_TYPE_PLAIN, PICKER_TYPE_TIME
- **PICKER_TYPE_COUNT_DOWN_\***: PICKER_TYPE_COUNT_DOWN_TIMER
- **PICKER_TYPE_DATE_AND_\***: PICKER_TYPE_DATE_AND_TIME
- **RETURNKEY_\***: RETURNKEY_CONTINUE, RETURNKEY_DEFAULT, RETURNKEY_DONE, RETURNKEY_GO, RETURNKEY_GOOGLE, RETURNKEY_JOIN, RETURNKEY_NEXT, RETURNKEY_ROUTE, RETURNKEY_SEARCH, RETURNKEY_SEND, RETURNKEY_YAHOO
- **RETURNKEY_EMERGENCY_\***: RETURNKEY_EMERGENCY_CALL
- **SELECTION_STYLE_\***: SELECTION_STYLE_NONE, SELECTION_STYLE_DEFAULT
- **SEMANTIC_COLOR_TYPE_\***: SEMANTIC_COLOR_TYPE_DARK, SEMANTIC_COLOR_TYPE_LIGHT
- **SWITCH_STYLE_\***: SWITCH_STYLE_CHECKBOX, SWITCH_STYLE_SLIDER, SWITCH_STYLE_CHIP
- **SWITCH_STYLE_TOGGLE_\***: SWITCH_STYLE_TOGGLE_BUTTON
- **TABLE_VIEW_SEPARATOR_STYLE_\***: TABLE_VIEW_SEPARATOR_STYLE_NONE
- **TABLE_VIEW_SEPARATOR_STYLE_SINGLE_\***: TABLE_VIEW_SEPARATOR_STYLE_SINGLE_LINE
- **TABS_STYLE_\***: TABS_STYLE_DEFAULT
- **TABS_STYLE_BOTTOM_\***: TABS_STYLE_BOTTOM_NAVIGATION
- **TEXT_ALIGNMENT_\***: TEXT_ALIGNMENT_CENTER, TEXT_ALIGNMENT_JUSTIFY, TEXT_ALIGNMENT_LEFT, TEXT_ALIGNMENT_RIGHT
- **TEXT_AUTOCAPITALIZATION_\***: TEXT_AUTOCAPITALIZATION_ALL, TEXT_AUTOCAPITALIZATION_NONE, TEXT_AUTOCAPITALIZATION_SENTENCES, TEXT_AUTOCAPITALIZATION_WORDS
- **TEXT_ELLIPSIZE_TRUNCATE_\***: TEXT_ELLIPSIZE_TRUNCATE_CLIP, TEXT_ELLIPSIZE_TRUNCATE_START, TEXT_ELLIPSIZE_TRUNCATE_MIDDLE, TEXT_ELLIPSIZE_TRUNCATE_END, TEXT_ELLIPSIZE_TRUNCATE_MARQUEE, TEXT_ELLIPSIZE_TRUNCATE_NONE
- **TEXT_ELLIPSIZE_TRUNCATE_CHAR_\***: TEXT_ELLIPSIZE_TRUNCATE_CHAR_WRAP
- **TEXT_ELLIPSIZE_TRUNCATE_WORD_\***: TEXT_ELLIPSIZE_TRUNCATE_WORD_WRAP
- **TEXT_STYLE_\***: TEXT_STYLE_HEADLINE, TEXT_STYLE_SUBHEADLINE, TEXT_STYLE_BODY, TEXT_STYLE_FOOTNOTE, TEXT_STYLE_CAPTION1, TEXT_STYLE_CAPTION2, TEXT_STYLE_CALLOUT, TEXT_STYLE_TITLE1, TEXT_STYLE_TITLE2, TEXT_STYLE_TITLE3
- **TEXT_STYLE_LARGE_\***: TEXT_STYLE_LARGE_TITLE
- **TEXT_VERTICAL_ALIGNMENT_\***: TEXT_VERTICAL_ALIGNMENT_BOTTOM, TEXT_VERTICAL_ALIGNMENT_CENTER, TEXT_VERTICAL_ALIGNMENT_TOP
- **UNIT_\***: UNIT_CM, UNIT_DIP, UNIT_IN, UNIT_MM, UNIT_PX
- **UPSIDE_\***: UPSIDE_PORTRAIT
- **URL_ERROR_\***: URL_ERROR_AUTHENTICATION, URL_ERROR_CONNECT, URL_ERROR_FILE, URL_ERROR_TIMEOUT, URL_ERROR_UNKNOWN
- **URL_ERROR_BAD_\***: URL_ERROR_BAD_URL
- **URL_ERROR_FILE_NOT_\***: URL_ERROR_FILE_NOT_FOUND
- **URL_ERROR_HOST_\***: URL_ERROR_HOST_LOOKUP
- **URL_ERROR_REDIRECT_\***: URL_ERROR_REDIRECT_LOOP
- **URL_ERROR_SSL_\***: URL_ERROR_SSL_FAILED
- **URL_ERROR_UNSUPPORTED_\***: URL_ERROR_UNSUPPORTED_SCHEME
- **USER_INTERFACE_STYLE_\***: USER_INTERFACE_STYLE_UNSPECIFIED, USER_INTERFACE_STYLE_LIGHT, USER_INTERFACE_STYLE_DARK


### Methods (47)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| createMatrix2D(parameters) | Ti.UI.Matrix2D | both | Creates and returns an instance of <Titanium.UI.Matrix2D>. |
| createMatrix3D(parameters) | Ti.UI.Matrix3D | both | Creates and returns an instance of <Titanium.UI.Matrix3D>. |
| convertUnits(convertFromValue, convertToUnits) | Number | both | Converts one type of unit to another using the metrics of the main display. |
| fetchSemanticColor(colorName) | void | both | Fetches the correct color to be used with a UI element dependent on the users c… |
| createView(parameters) | Ti.UI.View | both | Creates and returns an instance of <Titanium.UI.View>. |
| createActivityIndicator(parameters) | Ti.UI.ActivityIndicator | both | Creates and returns an instance of <Titanium.UI.ActivityIndicator>. |
| createAlertDialog(parameters) | Ti.UI.AlertDialog | both | Creates and returns an instance of <Titanium.UI.AlertDialog>. |
| createAnimation(parameters) | Ti.UI.Animation | both | Creates and returns an instance of <Titanium.UI.Animation>. |
| createAttributedString(parameters) | Ti.UI.AttributedString | both | Creates and returns an instance of <Titanium.UI.AttributedString>. |
| createButton(parameters) | Ti.UI.Button | both | Creates and returns an instance of <Titanium.UI.Button>. |
| createButtonBar(parameters) | Ti.UI.ButtonBar | both | Creates and returns an instance of <Titanium.UI.ButtonBar>. |
| createColor(parameters) | Ti.UI.Color | both | Creates and returns an instance of <Titanium.UI.Color>. |
| createDashboardItem(parameters) | Ti.UI.DashboardItem | ios | Creates and returns an instance of <Titanium.UI.DashboardItem>. |
| createDashboardView(parameters) | Ti.UI.DashboardView | ios | Creates and returns an instance of <Titanium.UI.DashboardView>. |
| createEmailDialog(parameters) | Ti.UI.EmailDialog | both | Creates and returns an instance of <Titanium.UI.EmailDialog>. |
| createImageView(parameters) | Ti.UI.ImageView | both | Creates and returns an instance of <Titanium.UI.ImageView>. |
| createLabel(parameters) | Ti.UI.Label | both | Creates and returns an instance of <Titanium.UI.Label>. |
| createListSection(parameters) | Ti.UI.ListSection | both | Creates and returns an instance of <Titanium.UI.ListSection>. |
| createListView(parameters) | Ti.UI.ListView | both | Creates and returns an instance of <Titanium.UI.ListView>. |
| createMaskedImage(parameters) | Ti.UI.MaskedImage | both | Creates and returns an instance of <Titanium.UI.MaskedImage>. |
| createNavigationWindow(parameters) | Ti.UI.NavigationWindow | both | Creates and returns an instance of <Titanium.UI.NavigationWindow>. |
| createNotification(parameters) | Ti.UI.Notification | android | Creates and returns an instance of <Titanium.UI.Notification>. |
| createOptionBar(parameters) | Ti.UI.OptionBar | both | Creates and returns an instance of <Titanium.UI.OptionBar>. |
| createOptionDialog(parameters) | Ti.UI.OptionDialog | both | Creates and returns an instance of <Titanium.UI.OptionDialog>. |
| createPicker(parameters) | Ti.UI.Picker | both | Creates and returns an instance of <Titanium.UI.Picker>. |
| createPickerColumn(parameters) | Ti.UI.PickerColumn | both | Creates and returns an instance of <Titanium.UI.PickerColumn>. |
| createPickerRow(parameters) | Ti.UI.PickerRow | both | Creates and returns an instance of <Titanium.UI.PickerRow>. |
| createProgressBar(parameters) | Ti.UI.ProgressBar | both | Creates and returns an instance of <Titanium.UI.ProgressBar>. |
| createRefreshControl(parameters) | Ti.UI.RefreshControl | both | Creates and returns an instance of <Titanium.UI.RefreshControl>. |
| createScrollView(parameters) | Ti.UI.ScrollView | both | Creates and returns an instance of <Titanium.UI.ScrollView>. |
| createScrollableView(parameters) | Ti.UI.ScrollableView | both | Creates and returns an instance of <Titanium.UI.ScrollableView>. |
| createSearchBar(parameters) | Ti.UI.SearchBar | both | Creates and returns an instance of <Titanium.UI.SearchBar>. |
| createShortcut(parameters) | Ti.UI.Shortcut | both | Creates and returns an instance of <Titanium.UI.Shortcut>. |
| createShortcutItem(parameters) | Ti.UI.ShortcutItem | both | Creates and returns an instance of <Titanium.UI.ShortcutItem>. |
| createSlider(parameters) | Ti.UI.Slider | both | Creates and returns an instance of <Titanium.UI.Slider>. |
| createSwitch(parameters) | Ti.UI.Switch | both | Creates and returns an instance of <Titanium.UI.Switch>. |
| createTab(parameters) | Ti.UI.Tab | both | Creates and returns an instance of <Titanium.UI.Tab>. |
| createTabGroup(parameters) | Ti.UI.TabGroup | both | Creates and returns an instance of <Titanium.UI.TabGroup>. |
| createTabbedBar(parameters) | Ti.UI.TabbedBar | both | Creates and returns an instance of <Titanium.UI.TabbedBar>. |
| createTableView(parameters) | Ti.UI.TableView | both | Creates and returns an instance of <Titanium.UI.TableView>. |
| createTableViewRow(parameters) | Ti.UI.TableViewRow | both | Creates and returns an instance of <Titanium.UI.TableViewRow>. |
| createTableViewSection(parameters) | Ti.UI.TableViewSection | both | Creates and returns an instance of <Titanium.UI.TableViewSection>. |
| createTextArea(parameters) | Ti.UI.TextArea | both | Creates and returns an instance of <Titanium.UI.TextArea>. |
| createTextField(parameters) | Ti.UI.TextField | both | Creates and returns an instance of <Titanium.UI.TextField>. |
| createToolbar(parameters) | Ti.UI.Toolbar | both | Creates and returns an instance of <Titanium.UI.Toolbar>. |
| createWebView(parameters) | Ti.UI.WebView | both | Creates and returns an instance of <Titanium.UI.WebView>. |
| createWindow(parameters) | Ti.UI.Window | both | Creates and returns an instance of <Titanium.UI.Window>. |

### Events (1)
| Event | Platform | Description |
|-------|----------|-------------|
| userinterfacestyle | both | Fired when the `userInterfaceStyle` changes. |

### Related Types

#### CutoutSize
> Dictionary object of parameters for the <Titanium.UI.cutoutSize>.

| Property | Type | Description |
|----------|------|-------------|
| top | Number | The top position of the cutout. |
| left | Number | The left position of the cutout. |
| width | Number | The width of the cutout |
| height | Number | The height of the cutout |

#### Matrix2DCreationDict
> Simple object passed to <Titanium.UI.createMatrix2D> to initialize a matrix.

| Property | Type | Description |
|----------|------|-------------|
| scale | Number | Scale the matrix by the specified scaling factor. The same scaling factor is us… |
| rotate | Number | Rotation angle, in degrees. See the [rotate](Titanium.UI.Matrix2D.rotate) metho… |
| anchorPoint | Point | Point to rotate around, specified as a dictionary object with `x` and `y` prope… |

#### Matrix3DCreationDict
> Simple object passed to <Titanium.UI.createMatrix3D> to initialize a matrix.

| Property | Type | Description |
|----------|------|-------------|
| scale | Number | Scale the matrix by the specified scaling factor. |

---

## Ti.API
> The top-level API module, containing methods to output messages to the system log.
> Extends Ti.Module
> Platforms: both
> Type: module


### Methods (7)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| debug(message) | void | both | Logs messages with a `debug` severity-level. |
| error(message) | void | both | Logs messages with an `error` severity-level. |
| info(message) | void | both | Logs messages with an `info` severity-level. |
| log(level, message) | void | both | Logs messages with the specified severity-level. |
| timestamp(message) | void | ios | Logs messages with a `timestamp` severity-level, prefixed with a timestamp floa… |
| trace(message) | void | both | Logs messages with a `trace` severity-level. |
| warn(message) | void | both | Logs messages with a `warn` severity-level. |


---

## Ti.Accelerometer
> The top-level Accelerometer module, used to determine the device's physical position.
> Extends Ti.Module
> Platforms: both
> Type: module

An accelerometer is a hardware unit integrated into a mobile device, that detects when the 
device has moved, and returns its new orientation in a three-dimensional space. With its 
single `update` event, this module provides an interface to access the output positional data.

An accelerometer needs to be switched on in order for it to report to the operating system, 
which consumes a lot of power that will deplete the battery over time. This is why it is 
recommended that the accelerometer is switched off when not in use.

The accelerometer may be switched on and off by simply adding and removing the `update` 
event listener function. See the example for a demonstration.



### Events (1)
| Event | Platform | Description |
|-------|----------|-------------|
| update | both | Fired when the accelerometer changes. |

---

## Ti.Blob
> A container for binary data.
> Extends Ti.Proxy
> Platforms: both

A `Blob` represents a chunk of binary information, often obtained through
an [HTTPClient](Titanium.Network.HTTPClient) or by reading a [File](Titanium.Filesystem.File).

Blobs are often used to store text or image data.
The `Blob` object includes a number of properties and methods specific to image blobs.

Android supports an [append](Titanium.Blob.append) method, but
otherwise blobs are immutable.

The <Titanium.Utils> module provides several utility methods for working with
blobs, including methods for converting between blobs and Base64-encoded strings,
and methods for generating SHA-1 and SHA-256 hashes and MD5 digests from blob data.

The [Buffer](Titanium.Buffer) object can also contain binary data, and is
more easily mutable. Extracting blob data to a buffer is somewhat roundabout:

*(See full overview in titanium-docs)*

### Properties (unique: 11/14)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| file | Ti.Filesystem.File | — | both | File object represented by this blob, or `null` if this blob is not associated … |
| length | Number | — | both | Length of this blob in bytes. |
| text | String | — | both | UTF-8 string representation of the data in this blob. |
| mimeType | String | — | both | Mime type of the data in this blob. |
| height | Number | — | both | If this blob represents an image, this is the height of the image in pixels. |
| uprightHeight | Number | — | both | If the blob references an image, this provides the height in pixels after facto… |
| width | Number | — | both | If this blob represents an image, this is the width of the image in pixels. |
| uprightWidth | Number | — | both | If the blob references an image, this provides the width in pixels after factor… |
| nativePath | String | — | both | If this blob represents a [File](Titanium.Filesystem.File), this is the file UR… |
| size | Number | — | both | Size of the blob in pixels (for image blobs) or bytes (for all other blobs). |
| rotation | Number | — | android | EXIF rotation of the image if available. Can be `undefined` if no orientation w… |


### Methods (11)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| toString(—) | String | both | Returns a string representation of this blob. |
| append(blob) | void | android | Appends the data from another blob to this blob. |
| imageAsCropped(options) | Ti.Blob | both | Creates a new blob by cropping the underlying image to the specified dimensions. |
| imageAsResized(width, height) | Ti.Blob | both | Creates a new blob by resizing and scaling the underlying image to the specifie… |
| imageAsCompressed(quality) | Ti.Blob | both | Creates a new blob by compressing the underlying image to the specified quality. |
| imageAsThumbnail(size, borderSize, cornerRadius) | Ti.Blob | both | Returns a thumbnail version of the underlying image, optionally with a border a… |
| imageWithAlpha(—) | Ti.Blob | both | Returns a copy of the underlying image with an added alpha channel. |
| imageWithRoundedCorner(cornerSize, borderSize) | Ti.Blob | both | Returns a copy of the underlying image with rounded corners added. |
| imageWithTransparentBorder(size) | Ti.Blob | both | Returns a copy of the underlying image with an added transparent border. |
| toArrayBuffer(—) | ArrayBuffer | both | Returns an `ArrayBuffer` representation of this blob. |
| arrayBuffer(—) | Promise<ArrayBuffer> | both | Returns a `Promise` that resolves with the contents of the blob as binary data … |


### Related Types

#### Dimension
> A simple object consisting of the position and size measurements. Effectively combines <Size> and <Point> but ensures numeric x/y values.

| Property | Type | Description |
|----------|------|-------------|
| height | Number | The height measurement. |
| width | Number | The width measurement. |
| x | Number | The x-axis coordinate of the position. When returned by <Titanium.UI.View.rect>… |
| y | Number | The y-axis coordinate of the position. When returned by <Titanium.UI.View.rect>… |

---

## Ti.BlobStream
> Wrapper around <Titanium.Blob> that implements the <Titanium.IOStream> interface.
> Extends Ti.IOStream
> Platforms: both

Use the <Titanium.Stream.createStream> method to create a `BlobStream` instance from a
`Blob`.




---

## Ti.Buffer
> Buffer is a mutable, resizable container for raw data.
> Extends Ti.Proxy
> Platforms: both

A `Buffer` works like a resizable array of byte values.

Use the <Titanium.createBuffer> method to create a buffer.

### Properties (unique: 4/7)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| length | Number | 0 unless `value` is specified, in which case the length of the encoded data is used. | both | Length of the buffer in bytes. |
| value | Number \| String | — | both | Data to be encoded. |
| type | String | For string values, defaults to <Titanium.Codec.CHARSET_UTF8>. | both | The type of data encoding to use with `value`. |
| byteOrder | Number | OS native byte order. | both | Byte order of this buffer. |


### Methods (9)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| append(sourceBuffer, sourceOffset, sourceLength) | Number | both | Appends `sourceBuffer` to the this buffer. |
| insert(sourceBuffer, offset, sourceOffset, sourceLength) | Number | both | Inserts data from `sourceBuffer` into this buffer at `offset`. |
| copy(sourceBuffer, offset, sourceOffset, sourceLength) | Number | both | Copies data from `sourceBuffer` into the current buffer at `offset`. |
| clone(offset, length) | Ti.Buffer | both | Creates a complete or partial copy of this buffer. |
| fill(fillByte, offset, length) | void | both | Fills this buffer with the specified byte value. |
| clear(—) | void | both | Clears this buffer's contents but does not change the size of the buffer. |
| release(—) | void | both | Releases the space allocated to the buffer, and sets its length to 0. |
| toString(—) | String | both | Converts this buffer to a String. |
| toBlob(—) | Ti.Blob | both | Converts this buffer to a <Titanium.Blob>. |


---

## Ti.BufferStream
> Wrapper around <Titanium.Buffer> that implements the <Titanium.IOStream> interface.
> Extends Ti.IOStream
> Platforms: both

Use the <Titanium.Stream.createStream> method to create a `BufferStream` instance from a
`Buffer`.




---

## Ti.Codec
> A module for translating between primitive types and raw byte streams.
> Extends Ti.Module
> Platforms: both
> Type: module

The `Codec` module can be used for encoding strings and numbers into [Buffer](Titanium.Buffer)
objects, and decoding primitive types from buffers.

### Byte Order

Multi-byte data can be stored in two different byte orders: big-endian or
little-endian. In big-endian byte order, the most significant or highest-value
byte is stored first. For example, the 4-byte integer 0xFEDCBA98 is made up of the
bytes 0xFE, 0xDC, 0xBA and 0x98, from most-significant to least-significant.

If we represent a buffer as an array of byte values, a big-endian encoding of
0xFEDCBA98 would look like this:

``` js
[ 0xFE, 0xDC, 0xBA, 0x98 ]

*(See full overview in titanium-docs)*

### Constants (14)
- **BIG_\***: BIG_ENDIAN
- **CHARSET_\***: CHARSET_ASCII, CHARSET_UTF8, CHARSET_UTF16, CHARSET_UTF16BE, CHARSET_UTF16LE
- **CHARSET_ISO_LATIN_\***: CHARSET_ISO_LATIN_1
- **LITTLE_\***: LITTLE_ENDIAN
- **TYPE_\***: TYPE_BYTE, TYPE_SHORT, TYPE_INT, TYPE_FLOAT, TYPE_LONG, TYPE_DOUBLE


### Methods (5)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| getNativeByteOrder(—) | Number | both | Get the OS native byte order (either <Titanium.Codec.BIG_ENDIAN> or <Titanium.C… |
| encodeNumber(options) | Number | both | Encodes a number and writes it to a buffer. |
| decodeNumber(options) | Number | both | Decodes a number from the `source` buffer using the specified data type. |
| encodeString(options) | Number | both | Encodes a string into a series of bytes in a buffer using the specified charact… |
| decodeString(options) | String | both | Decodes the source buffer into a String using the supplied character set. |


### Related Types

#### DecodeNumberDict
> Named parameters for <Titanium.Codec.decodeNumber>.

| Property | Type | Description |
|----------|------|-------------|
| source | Ti.Buffer | Buffer to decode. |
| type | String | The encoding type to use. |
| position | Number | Index in the `source` buffer of the first byte of data to decode. |
| byteOrder | Number | byte order to decode with. |

#### DecodeStringDict
> Named parameters for <Titanium.Codec.decodeString>.

| Property | Type | Description |
|----------|------|-------------|
| source | Ti.Buffer | Buffer to decode. |
| position | Number | Index in the `source` buffer of the first byte of data to decode. |
| length | Number | Number of bytes to decode. |
| charset | String | Character set to use when encoding this string to bytes. |

#### EncodeNumberDict
> Named parameters for <Titanium.Codec.encodeNumber>.

| Property | Type | Description |
|----------|------|-------------|
| source | Number | Number to encode. |
| dest | Ti.Buffer | Destination buffer. |
| type | String | Encoding type to use. |
| position | Number | Index in the `dest` buffer of the first byte of encoded data. |
| byteOrder | Number | Byte order to encode with. |

---

## Ti.Gesture
> The Gesture module is responsible for high-level device gestures such as orientation changes and shake gestures.
> Extends Ti.Module
> Platforms: both
> Type: module

### Properties (unique: 3/6)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| portrait | Boolean | — | both | Indicates if the device is currently held in portrait form. |
| landscape | Boolean | — | both | Indicates if the device is currently held in landscape form. |
| orientation | Number | — | both | Orientation of the device. |


### Methods (1)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| stopListener(—) | void | android | Stops the gesture listener. |

### Events (2)
| Event | Platform | Description |
|-------|----------|-------------|
| orientationchange | both | Fired when the device orientation changes. |
| shake | both | Fired when the device is shaken. |

---

## Ti.IOStream
> IOStream is the interface that all stream types implement.
> Extends Ti.Proxy
> Platforms: both

See the <Titanium.Stream> module for related utility methods that support asynchronous
I/O.


### Methods (5)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| read(buffer, offset, length, resultsCallback) | Number | both | Reads data from this stream into a buffer. |
| write(buffer, offset, length, resultsCallback) | Number | both | Writes data from a buffer to this stream. |
| isWritable(—) | Boolean | both | Indicates whether this stream is writable. |
| isReadable(—) | Boolean | both | Indicates whether this stream is readable. |
| close(—) | void | both | Closes this stream. |


---

## Ti.Locale
> The top level Locale module.
> Extends Ti.Module
> Platforms: both
> Type: module

The `Locale` module works with localization files to which are generated during compilation 
into the operating system specific localization formats. The `Locale` module provides 
locale-specific strings which can be referenced at runtime.  Additionally, the module 
contains a few methods and properties for querying device locale information.

The macro `L` can be used as an alias for the <Titanium.Locale.getString> method.

### Properties (unique: 3/6)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| currentCountry | String | — | both | Country of the app's current locale, as an ISO 2-letter code. |
| currentLanguage | String | — | both | Language of the app's current locale, as an ISO 2-letter code. |
| currentLocale | String | — | both | Current app locale, as a combination of ISO 2-letter language and country codes. |


### Methods (7)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| formatTelephoneNumber(number) | String | android | Formats a telephone number according to the current system locale. |
| getCurrencyCode(locale) | String | both | Returns the ISO 3-letter currency code for the specified locale. |
| getCurrencySymbol(currencyCode) | String | both | Returns the currency symbol for the specified currency code. |
| setLanguage(language) | void | both | Sets the current language of the application. |
| getLocaleCurrencySymbol(locale) | String | both | Returns the currency symbol for the specified locale. |
| getString(key, hint) | String | both | Returns a string, localized according to the current system locale using the ap… |
| parseDecimal(text, locale) | Number | both | Parses a number from the given string using the current or given locale. |

### Events (1)
| Event | Platform | Description |
|-------|----------|-------------|
| change | both | Fired when the device locale changes. |

---

## Ti.Stream
> Stream module containing stream utility methods.
> Extends Ti.Module
> Platforms: both
> Type: module

This module provides a set of methods for interacting with
[IOStream](Titanium.IOStream) objects, including asynchronous versions of the
`read` and `write` methods offered by all stream objects. These
methods should be used in any place where reading from or writing
to a stream might block.

See also:

* <Titanium.IOStream>
* <Titanium.BlobStream>
* <Titanium.BufferStream>
* <Titanium.Filesystem.FileStream>
* <Titanium.Network.Socket.TCP>

### Constants (3)
- **MODE_\***: MODE_READ, MODE_WRITE, MODE_APPEND


### Methods (6)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| createStream(params) | Ti.IOStream | both | Creates stream from a `Buffer` or `Blob` object. |
| read(sourceStream, buffer, offset, length, resultsCallback) | void | both | Asynchronously reads data from an [IOStream](Titanium.IOStream) into a buffer. |
| readAll(sourceStream, buffer, resultsCallback) | void | both | Reads all data from the specified [IOStream](Titanium.IOStream). |
| write(outputStream, buffer, offset, length, resultsCallback) | void | both | Asynchronously writes data from a buffer to an [IOStream](Titanium.IOStream). |
| writeStream(inputStream, outputStream, maxChunkSize, resultsCallback) | void | both | Writes all data from an input stream to an output stream. |
| pump(inputStream, handler, maxChunkSize, isAsync) | void | both | Reads data from input stream and passes it to a handler method. |


### Related Types

#### CreateStreamArgs
> Argument passed to [createStream](Titanium.Stream.createStream).

| Property | Type | Description |
|----------|------|-------------|
| source | Ti.Blob \| Ti.Buffer | Object that the stream will read from or write to. |
| mode | Number | Mode to open the stream in. |

---

## Ti.Utils
> The top-level Utils module, containing a set of JavaScript methods that are often useful when building applications.
> Extends Ti.Module
> Platforms: both
> Type: module


### Methods (5)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| base64decode(obj) | Ti.Blob | both | Returns the specified data decoded from Base64. |
| base64encode(obj) | Ti.Blob | both | Returns the specified data encoded to Base64. |
| md5HexDigest(obj) | String | both | Returns a MD5 digest of the specified data as a hex-based String. |
| sha1(obj) | String | both | Returns a SHA-1 hash of the specified data as a hex-based String. |
| sha256(obj) | String | both | Returns a SHA-256 hash of the specified data as a hex-based String. |


---

## Ti.Proxy
> The base for all Titanium objects.
> Extends Object
> Platforms: both

On platforms that use native code (Android and iOS), the `Proxy` type represents a
JavaScript wrapper or _proxy_ around a native object. Setting or getting a property
on a proxy object results in a method invocation on the native object. Likewise,
calling a method on the proxy object results in a method invocation on the native
object.

Some Titanium objects are _createable_: new instances of these objects can be created using
factory methods. For example, a [Window](Titanium.UI.Window) object can be created using the

### Properties (unique: 3/3)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| bubbleParent | Boolean | true | both | Indicates if the proxy will bubble an event to its parent. |
| apiName | String | — | both | The name of the API that this proxy corresponds to. |
| lifecycleContainer | Ti.UI.Window \| Ti.UI.TabGroup | — | android | The Window or TabGroup whose Activity lifecycle should be triggered on the prox… |


### Methods (4)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| addEventListener(name, callback) | void | both | Adds the specified callback as an event listener for the named event. |
| removeEventListener(name, callback) | void | both | Removes the specified callback as an event listener for the named event. |
| fireEvent(name, event) | void | both | Fires a synthesized event to any registered listeners. |
| applyProperties(props) | void | both | Applies the properties to the proxy. |


### Related Types

#### Dictionary
> Plain JavaScript object.

---

## Ti.Module
> Base type for all Titanium modules.
> Extends Ti.Proxy
> Platforms: both
> Type: module

A Titanium module is a non-createable Titanium object that is exposed through the
global Titanium object.

For example, the <Titanium.UI> module provides constants and factory methods related
to UI objects, as well as a few UI-related properties that are not related to a
specific object.




---

