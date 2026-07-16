# Ti.UI.Android API Reference

## Ti.UI.Android
> The Android-specific UI capabilities. All properties, methods and events in this namespace will only work on Android systems.  #### Drawer Layout  The drawer-layout components acts as a top-level container for window content that allows for interactive "drawer" views to be pulled out from one or both vertical edges of the window. It is represented by a `centerView` and optional `leftView` and `rightView` components that can be swiped in and out with additional configuration and transitions. Learn more about drawer-layouts in it's dedicated <Titanium.UI.Android.DrawerLayout> docs.
> Extends Ti.Module
> Platforms: android
> Type: module

## Examples

### Android Preferences Example

Create preferences interface for the application.

#### `app.js`
``` js
const button = Ti.UI.createButton({
  title:	'Click to Open Preferences'
});
button.addEventListener('click', function() {
  Ti.API.info('Current value for editText: ' + Ti.App.Properties.getString('editText'));
  Ti.UI.Android.openPreferences();
});

*(See full overview in titanium-docs)*

### Constants (101)
- **FLAG_LAYOUT_NO_\***: FLAG_LAYOUT_NO_LIMITS
- **FLAG_TRANSLUCENT_\***: FLAG_TRANSLUCENT_NAVIGATION, FLAG_TRANSLUCENT_STATUS
- **GRAVITY_\***: GRAVITY_BOTTOM, GRAVITY_CENTER, GRAVITY_END, GRAVITY_FILL, GRAVITY_LEFT, GRAVITY_RIGHT, GRAVITY_START, GRAVITY_TOP
- **GRAVITY_AXIS_\***: GRAVITY_AXIS_CLIP, GRAVITY_AXIS_SPECIFIED
- **GRAVITY_AXIS_PULL_\***: GRAVITY_AXIS_PULL_AFTER, GRAVITY_AXIS_PULL_BEFORE
- **GRAVITY_AXIS_X_\***: GRAVITY_AXIS_X_SHIFT
- **GRAVITY_AXIS_Y_\***: GRAVITY_AXIS_Y_SHIFT
- **GRAVITY_CENTER_\***: GRAVITY_CENTER_HORIZONTAL, GRAVITY_CENTER_VERTICAL
- **GRAVITY_CLIP_\***: GRAVITY_CLIP_HORIZONTAL, GRAVITY_CLIP_VERTICAL
- **GRAVITY_DISPLAY_CLIP_\***: GRAVITY_DISPLAY_CLIP_HORIZONTAL, GRAVITY_DISPLAY_CLIP_VERTICAL
- **GRAVITY_FILL_\***: GRAVITY_FILL_HORIZONTAL, GRAVITY_FILL_VERTICAL
- **GRAVITY_HORIZONTAL_GRAVITY_\***: GRAVITY_HORIZONTAL_GRAVITY_MASK
- **GRAVITY_NO_\***: GRAVITY_NO_GRAVITY
- **GRAVITY_RELATIVE_HORIZONTAL_GRAVITY_\***: GRAVITY_RELATIVE_HORIZONTAL_GRAVITY_MASK
- **GRAVITY_RELATIVE_LAYOUT_\***: GRAVITY_RELATIVE_LAYOUT_DIRECTION
- **GRAVITY_VERTICAL_GRAVITY_\***: GRAVITY_VERTICAL_GRAVITY_MASK
- **OVER_SCROLL_\***: OVER_SCROLL_ALWAYS, OVER_SCROLL_NEVER
- **OVER_SCROLL_IF_CONTENT_\***: OVER_SCROLL_IF_CONTENT_SCROLLS
- **PIXEL_FORMAT_\***: PIXEL_FORMAT_OPAQUE, PIXEL_FORMAT_TRANSLUCENT, PIXEL_FORMAT_TRANSPARENT, PIXEL_FORMAT_UNKNOWN
- **PIXEL_FORMAT_A_\***: PIXEL_FORMAT_A_8
- **PIXEL_FORMAT_L_\***: PIXEL_FORMAT_L_8
- **PIXEL_FORMAT_LA_\***: PIXEL_FORMAT_LA_88
- **PIXEL_FORMAT_RGB_\***: PIXEL_FORMAT_RGB_332, PIXEL_FORMAT_RGB_565, PIXEL_FORMAT_RGB_888
- **PIXEL_FORMAT_RGBA_\***: PIXEL_FORMAT_RGBA_4444, PIXEL_FORMAT_RGBA_5551, PIXEL_FORMAT_RGBA_8888
- **PIXEL_FORMAT_RGBX_\***: PIXEL_FORMAT_RGBX_8888
- **PROGRESS_INDICATOR_\***: PROGRESS_INDICATOR_DIALOG, PROGRESS_INDICATOR_INDETERMINANT, PROGRESS_INDICATOR_DETERMINANT
- **PROGRESS_INDICATOR_STATUS_\***: PROGRESS_INDICATOR_STATUS_BAR
- **SCROLL_FLAG_\***: SCROLL_FLAG_SCROLL, SCROLL_FLAG_SNAP
- **SCROLL_FLAG_ENTER_\***: SCROLL_FLAG_ENTER_ALWAYS
- **SCROLL_FLAG_ENTER_ALWAYS_\***: SCROLL_FLAG_ENTER_ALWAYS_COLLAPSED
- **SCROLL_FLAG_EXIT_UNTIL_\***: SCROLL_FLAG_EXIT_UNTIL_COLLAPSED
- **SCROLL_FLAG_NO_\***: SCROLL_FLAG_NO_SCROLL
- **SCROLL_FLAG_SNAP_\***: SCROLL_FLAG_SNAP_MARGINS
- **SOFT_INPUT_ADJUST_\***: SOFT_INPUT_ADJUST_PAN, SOFT_INPUT_ADJUST_RESIZE, SOFT_INPUT_ADJUST_NOTHING, SOFT_INPUT_ADJUST_UNSPECIFIED
- **SOFT_INPUT_STATE_\***: SOFT_INPUT_STATE_HIDDEN, SOFT_INPUT_STATE_UNSPECIFIED, SOFT_INPUT_STATE_VISIBLE
- **SOFT_INPUT_STATE_ALWAYS_\***: SOFT_INPUT_STATE_ALWAYS_HIDDEN, SOFT_INPUT_STATE_ALWAYS_VISIBLE
- **SOFT_KEYBOARD_DEFAULT_ON_\***: SOFT_KEYBOARD_DEFAULT_ON_FOCUS
- **SOFT_KEYBOARD_HIDE_ON_\***: SOFT_KEYBOARD_HIDE_ON_FOCUS
- **SOFT_KEYBOARD_SHOW_ON_\***: SOFT_KEYBOARD_SHOW_ON_FOCUS
- **STATUS_BAR_\***: STATUS_BAR_LIGHT
- **SWITCH_STYLE_\***: SWITCH_STYLE_CHECKBOX, SWITCH_STYLE_TOGGLEBUTTON, SWITCH_STYLE_SWITCH
- **TAB_MODE_\***: TAB_MODE_FIXED, TAB_MODE_SCROLLABLE
- **TABS_STYLE_\***: TABS_STYLE_DEFAULT
- **TABS_STYLE_BOTTOM_\***: TABS_STYLE_BOTTOM_NAVIGATION
- **TRANSITION_\***: TRANSITION_EXPLODE, TRANSITION_NONE
- **TRANSITION_CHANGE_\***: TRANSITION_CHANGE_BOUNDS, TRANSITION_CHANGE_TRANSFORM
- **TRANSITION_CHANGE_CLIP_\***: TRANSITION_CHANGE_CLIP_BOUNDS
- **TRANSITION_CHANGE_IMAGE_\***: TRANSITION_CHANGE_IMAGE_TRANSFORM
- **TRANSITION_FADE_\***: TRANSITION_FADE_IN, TRANSITION_FADE_OUT
- **TRANSITION_SLIDE_\***: TRANSITION_SLIDE_TOP, TRANSITION_SLIDE_RIGHT, TRANSITION_SLIDE_BOTTOM, TRANSITION_SLIDE_LEFT
- **WEBVIEW_LOAD_\***: WEBVIEW_LOAD_DEFAULT
- **WEBVIEW_LOAD_CACHE_\***: WEBVIEW_LOAD_CACHE_ONLY
- **WEBVIEW_LOAD_CACHE_ELSE_\***: WEBVIEW_LOAD_CACHE_ELSE_NETWORK
- **WEBVIEW_LOAD_NO_\***: WEBVIEW_LOAD_NO_CACHE
- **WEBVIEW_PLUGINS_\***: WEBVIEW_PLUGINS_OFF, WEBVIEW_PLUGINS_ON
- **WEBVIEW_PLUGINS_ON_\***: WEBVIEW_PLUGINS_ON_DEMAND
- **WEBVIEW_SCROLLBARS_\***: WEBVIEW_SCROLLBARS_DEFAULT
- **WEBVIEW_SCROLLBARS_HIDE_\***: WEBVIEW_SCROLLBARS_HIDE_VERTICAL, WEBVIEW_SCROLLBARS_HIDE_HORIZONTAL, WEBVIEW_SCROLLBARS_HIDE_ALL


### Methods (12)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| harmonizedColor(color) | String | android | Creates a harmonizing color |
| moveToBackground(—) | void | android | Moves the app to the background |
| hideSoftKeyboard(—) | void | android | Hides the soft keyboard. |
| openPreferences(—) | void | android | Opens an application preferences dialog, using the native Android system settin… |
| getColorResource(resourceIdOrColorName) | Ti.UI.Color | android | Returns a <Ti.Color> instance for a color defined by the system or user resourc… |
| createCardView(parameters) | Ti.UI.Android.CardView | android | Creates and returns an instance of <Titanium.UI.Android.CardView>. |
| createCollapseToolbar(parameters) | Ti.UI.Android.CollapseToolbar | android | Creates and returns an instance of <Titanium.UI.Android.CollapseToolbar>. |
| createDrawerLayout(parameters) | Ti.UI.Android.DrawerLayout | android | Creates and returns an instance of <Titanium.UI.Android.DrawerLayout>. |
| createFloatingActionButton(parameters) | Ti.UI.Android.FloatingActionButton | android | Creates and returns an instance of <Titanium.UI.Android.FloatingActionButton>. |
| createProgressIndicator(parameters) | Ti.UI.Android.ProgressIndicator | android | Creates and returns an instance of <Titanium.UI.Android.ProgressIndicator>. |
| createSearchView(parameters) | Ti.UI.Android.SearchView | android | Creates and returns an instance of <Titanium.UI.Android.SearchView>. |
| createSnackbar(parameters) | Ti.UI.Android.Snackbar | android | Creates and returns an instance of <Titanium.UI.Android.Snackbar>. |


---

## Ti.UI.Android.CardView
> CardView provides a layout container with rounded corners and a shadow indicating the view is elevated.
> Extends Ti.UI.View
> Platforms: android

| Android |
| ------- |
| ![Android](./cardview_android.png) |

Use a CardView to layout content that:

  * Comprises multiple data types
  * Does not require direct comparison
  * Supports variable length content or displays more than three lines of text
  * Contains rich content or interactive elements, such as comments or a favorite button

If you are displaying a collection of the same type in a uniform layout without many actions,
use a [ListView](Titanium.UI.ListView) or [TableView](Titanium.UI.TableView) instead.

For design guidelines, see

*(See full overview in titanium-docs)*

### Properties (unique: 11/65)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| backgroundColor | String | — | android | Background color for CardView as a color name or hex triplet. |
| borderRadius | Number | 0 | android | Corner radius for CardView. |
| elevation | Number | — | android | Elevation for CardView. |
| maxElevation | Number | — | android | Maximum Elevation for CardView. |
| preventCornerOverlap | Boolean | false | android | Add padding to CardView on API level 20 and before to prevent intersections bet… |
| useCompatPadding | Boolean | false | android | Add padding on API level 21 and above to have the same measurements with previo… |
| padding | Number | — | android | Inner padding between the edges of the Card and children of the CardView. |
| paddingBottom | Number | — | android | Inner padding between the bottom edge of the Card and children of the CardView. |
| paddingLeft | Number | — | android | Inner padding between the left edge of the Card and children of the CardView. |
| paddingRight | Number | — | android | Inner padding between the right edge of the Card and children of the CardView. |
| paddingTop | Number | — | android | Inner padding between the top edge of the Card and children of the CardView. |




---

## Ti.UI.Android.CollapseToolbar
> A collapsing toolbar layout.
> Extends Ti.UI.View
> Platforms: android

| Android |
| ------- |
| ![Android](./collpasetoolbar_android.jpg) |

CollapseToolbar acts as a top-level container for window content that allows to set a parallax image and title
in the toolbar. The main content goes into `centerView` and will automatically be scrollable.

### Properties (unique: 11/18)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| barColor | String | — | android | Background color of the extended toolbar when no image is shown. |
| contentScrimColor | String | — | android | Background color of the small toolbar when the content is scrolled up. |
| image | String | — | android | Background image for the full size toolbar. Has a parallax effect when scrollin… |
| imageHeight | Number | 250 | android | Height of the image. Use `height` for the height of the extended toolbar. |
| title | String | — | android | Title of the toolbar. |
| color | String | — | android | Color of the title. |
| navigationIconColor | String | — | android | Color of the back arrow. |
| contentView | Ti.UI.View | — | android | Main view below the toolbar. |
| displayHomeAsUp | Boolean | — | android | Displays an "up" affordance on the "home" area of the action bar. |
| flags | Number | — | android | Scroll flags. Check [Android documentation](https://developer.android.com/refer… |
| onHomeIconItemSelected | Callback | — | android | Callback function called when the home icon is clicked. |




---

## Ti.UI.Android.DrawerLayout
> A panel that displays the app's main navigation options on the left edge of the screen.
> Extends Ti.UI.View
> Platforms: android

| Android |
| ------- |
| ![Android](./drawerlayout_android.png) |

DrawerLayout acts as a top-level container for window content that allows for interactive "drawer"
views to be pulled out from one or both vertical edges of the window.

As per the Android Design guide, any drawers positioned to the left/start should always contain
content for navigating around the application, whereas any drawers positioned to the right/end
should always contain actions to take on the current content.

For design guidelines, see
[Google Design Guidelines: DrawerLayout](https://developer.android.com/training/implementing-navigation/nav-drawer.html)

### Properties (unique: 15/80)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| isLeftOpen | Boolean | false | android | Determine whether the left drawer is open |
| isRightOpen | Boolean | false | android | Determine whether the right drawer is open |
| isLeftVisible | Boolean | false | android | Determine whether the left drawer is visible |
| isRightVisible | Boolean | false | android | Determine whether the right drawer is visible |
| leftWidth | Number | — | android | Get or set the width of the left drawer |
| rightWidth | Number | — | android | Get or set the width of the right drawer |
| leftView | Ti.UI.View | — | android | Get or set the view of the left drawer |
| rightView | Ti.UI.View | — | android | Get or set the view of the right drawer |
| centerView | Ti.UI.View | — | android | Get or set the center view |
| drawerIndicatorEnabled | Boolean | true | android | Determine the drawer indicator status |
| drawerLockMode | Number | <Titanium.UI.Android.DrawerLayout.LOCK_MODE_UNDEFINED> | android | Get or set the drawerLockMode |
| leftDrawerLockMode | Number | <Titanium.UI.Android.DrawerLayout.LOCK_MODE_UNDEFINED> | android | Get or set lock mode for the left drawer |
| rightDrawerLockMode | Number | <Titanium.UI.Android.DrawerLayout.LOCK_MODE_UNDEFINED> | android | Get or set lock mode for the right drawer |
| toolbarEnabled | Boolean | true | android | Determine whether to enable the toolbar. |
| toolbar | Ti.UI.Toolbar | — | android | A Toolbar instance to use as a toolbar. |

### Constants (4)
- **LOCK_MODE_\***: LOCK_MODE_UNDEFINED, LOCK_MODE_UNLOCKED
- **LOCK_MODE_LOCKED_\***: LOCK_MODE_LOCKED_CLOSED, LOCK_MODE_LOCKED_OPEN


### Methods (7)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| toggleLeft(—) | void | android | Toggle the visibility of the left view. |
| openLeft(—) | void | android | Open the left view. |
| closeLeft(—) | void | android | Close the left view. |
| toggleRight(—) | void | android | Toggle the visibility of the right view. |
| openRight(—) | void | android | Open the right view. |
| closeRight(—) | void | android | Close the right view. |
| interceptTouchEvent(view, disallowIntercept) | void | android | Disallow touch events on a specific view. |

### Events (4)
| Event | Platform | Description |
|-------|----------|-------------|
| open | android | Fired when the drawer view is opened. |
| close | android | Fired when the drawer view is closed. |
| change | android | Fired when the motion state of the drawer view changes. |
| slide | android | Fired when the drawer view changes it's position. |

---

## Ti.UI.Android.FloatingActionButton
> A floating action button (FAB) is a circular button that triggers the primary action in your app's UI.
> Extends Ti.UI.View
> Platforms: android

For design guidelines, see
[Material design: Snackbars](https://material.io/components/buttons-floating-action-button)

### Properties (unique: 4/30)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| customSize | Number | — | android | Size of the button |
| maxImageSize | Number | — | android | Size of the image inside the button |
| image | String \| Number \| Ti.Blob | — | android | Image inside the button (the icon) |
| iconSize | String | — | android | Predefined button size |



### Events (1)
| Event | Platform | Description |
|-------|----------|-------------|
| click | android | Fired when the button is clicked |

---

## Ti.UI.Android.ProgressIndicator
> A progress dialog or a horizontal progress bar in the title of the window.
> Extends Ti.UI.View
> Platforms: android

| Android |
| ------- |
| ![Android](./progressindicator_android.png) |

A progress indicator can be used to show the progress of an operation in the UI to let the
user know that some action is taking place. It is used to indicate an ongoing activity of
determinate or indeterminate length.

Use the <Titanium.UI.Android.createProgressIndicator> method or **`<ProgressIndicator>`** Alloy
element to create a progress indicator.

A progress indicator can be either a progress dialog or a horizontal progress bar in the title
of the window. The progress dialog is a modal dialog that blocks the UI. See also:

### Properties (unique: 8/29)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| cancelable | Boolean | — | android | When `true` allows the user to cancel the progress dialog by pressing the BACK … |
| canceledOnTouchOutside | Boolean | false | android | When `cancelable` is set to `true` and this is set to `true`, the dialog is can… |
| message | String | — | android | Message text. |
| messageid | String | — | android | Key identifying a string in the locale file to use for the message text. |
| min | Number | — | android | Minimum value of the progress bar. |
| max | Number | — | android | Maximum value of the progress bar. |
| location | Number | <Titanium.UI.Android.PROGRESS_INDICATOR_DIALOG> | android | Location for the progress indicator. |
| type | Number | <Titanium.UI.Android.PROGRESS_INDICATOR_INDETERMINANT> | android | Type for the progress indicator. |


### Methods (2)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| hide(options) | void | android | Hides the progress indicator and stops the animation. |
| show(options) | void | android | Shows the progress indicator and starts the animation. |

### Events (1)
| Event | Platform | Description |
|-------|----------|-------------|
| cancel | android | Fired when the user has canceled the progress indicator dialog. |

### Related Types

#### AnimatedOptions
> A JavaScript object holding an `animated` property. Used for many UI methods as a means of specifying some transition should be animated.

| Property | Type | Description |
|----------|------|-------------|
| animated | Boolean | If `true`, animate a transition for the method/value change. Note that for most… |

---

## Ti.UI.Android.SearchView
> A specialized text field for entering search text.
> Extends Ti.UI.View
> Platforms: android

| Android |
| ------- |
| ![Android](./searchview_android.png) |

`SearchView` provides a user interface to enter a search query and submit a request to a search provider.

Search views are most commonly used for filtering the rows in a [TableView](Titanium.UI.TableView).
Similar to [SearchBar](Titanium.UI.SearchBar), you can add a search view to a table view by setting the table view's
[search](Titanium.UI.TableView.search) property. A search view can be used without a `TableView`.

You can also use a `SearchView` object as the <Titanium.UI.ListView.searchView>
property of a [ListView](Titanium.UI.ListView) object.

You can also add `SearchView` to an `ActionBar` as a view (see example below).


*(See full overview in titanium-docs)*

### Properties (unique: 7/68)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| color | String | — | android | Color of the text in this SearchView, as a color name or hex triplet. |
| hintText | String | no hint text | android | Text to show when the search view field is not focused. |
| hintTextColor | String | Default Android theme's hint text color. | android | Color of hint text that displays when field is empty. |
| value | String | — | android | Value of the search view. |
| iconified | Boolean | undefined | android | Iconifies or expands the search view |
| iconifiedByDefault | Boolean | true | android | Sets the default or resting state of the search view |
| submitEnabled | Boolean | undefined | android | Whether to display the submit button when necessary or never display. |


### Methods (2)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| blur(—) | void | android | Causes the search view to lose focus. |
| focus(—) | void | android | Causes the search view to gain focus. |

### Events (5)
| Event | Platform | Description |
|-------|----------|-------------|
| focus | android | Fired when the search view gains focus. |
| blur | android | Fired when the search view loses focus. |
| cancel | android | Fired when the cancel button is pressed. |
| change | android | Fired when the value of the search view changes. |
| submit | android | If the search query is not empty, fired when the search button is clicked on so… |

---

## Ti.UI.Android.Snackbar
> Snackbars provide brief messages about app processes at the bottom of the screen.
> Extends Ti.UI.View
> Platforms: android

| Android |
| ------- |
| ![Android](./snackbar_android.png) |

For design guidelines, see
[Material design: Snackbars](https://material.io/components/snackbars)

### Properties (unique: 3/27)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| length | Number | LENGTH_SHORT | android | Display time of the Snackbar |
| action | String | — | android | Text of the right hand action button |
| message | String | — | android | Text of Snackbar |

### Constants (3)
- **LENGTH_\***: LENGTH_SHORT, LENGTH_LONG, LENGTH_INDEFINITE


### Methods (1)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| show(options) | void | android | Show the Snackbar |

### Events (1)
| Event | Platform | Description |
|-------|----------|-------------|
| click | android | Fired when the action button is clicked |

### Related Types

#### AnimatedOptions
> A JavaScript object holding an `animated` property. Used for many UI methods as a means of specifying some transition should be animated.

| Property | Type | Description |
|----------|------|-------------|
| animated | Boolean | If `true`, animate a transition for the method/value change. Note that for most… |

---

## Ti.UI.iPad.Popover
> A Popover is used to manage the presentation of content in a popover.
> Extends Ti.UI.View
> Platforms: ios

A popover is created using the <Titanium.UI.iPad.createPopover> method or **`<Popover>`** Alloy element.

Popovers are used to present information temporarily, but in a way that does not take over
the entire screen in the way that a modal view does. The popover content is layered on top of
the existing content in a special type of window. The popover remains visible until the user
taps outside of the popover window or it is explicitly dismissed.

Do not add top-level view containers, such as a `SplitWindow` or `TabGroup`, to a popover.
Adding top-level view containers may have unintended side effects. See the [contentView](Titanium.UI.iPad.Popover.contentView)
property for more information.

### Properties (unique: 4/13)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| backgroundColor | String \| Ti.UI.Color | undefined (behaves as transparent) | ios | Sets the background color of the popover. |
| arrowDirection | Number | — | ios | Indicates the arrow direction of the popover. |
| contentView | Ti.UI.View | — | ios | View to use for the popover content. Must be set before calling the `show()` me… |
| passthroughViews | Array<Titanium.UI.View> | — | ios | Passthrough views to use when the popover is shown. |


### Methods (2)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| hide(options) | void | ios | Hides the popover. |
| show(options) | void | ios | Displays the popover. |

### Events (1)
| Event | Platform | Description |
|-------|----------|-------------|
| hide | ios | Fired when the popover is hidden. |

### Related Types

#### AnimatedOptions
> A JavaScript object holding an `animated` property. Used for many UI methods as a means of specifying some transition should be animated.

| Property | Type | Description |
|----------|------|-------------|
| animated | Boolean | If `true`, animate a transition for the method/value change. Note that for most… |

#### ShowPopoverParams
> Dictionary of options for <Titanium.UI.iPad.Popover.show>.

| Property | Type | Description |
|----------|------|-------------|
| animated | Boolean | Indicates whether to animate showing the popover. |
| rect | Dimension | Sets the arrow position of the popover relative to the attached view object's d… |
| view | Ti.UI.View | Attaches the popover to the specified view when showing the popover. |

---

## Ti.UI.iPad
> iPad specific UI capabilities.
> Extends Ti.Module
> Platforms: ios
> Type: module

All properties, methods and events in this namespace will only work on the Apple iPad devices. 

For iOS UI programming guidelines, review the
[iOS Human Interface Guidelines](https://developer.apple.com/ios/human-interface-guidelines/overview/themes/).

### Constants (6)
- **POPOVER_ARROW_DIRECTION_\***: POPOVER_ARROW_DIRECTION_ANY, POPOVER_ARROW_DIRECTION_DOWN, POPOVER_ARROW_DIRECTION_LEFT, POPOVER_ARROW_DIRECTION_RIGHT, POPOVER_ARROW_DIRECTION_UNKNOWN, POPOVER_ARROW_DIRECTION_UP


### Methods (1)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| createPopover(parameters) | Ti.UI.iPad.Popover | ios | Creates and returns an instance of <Titanium.UI.iPad.Popover>. |


---

