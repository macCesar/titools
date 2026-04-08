# Ti.UI Windows & Navigation API Reference

## Ti.UI.Window
> The Window is an empty drawing surface or container.
> Extends Ti.UI.View
> Platforms: both

To create a window, use the <Titanium.UI.createWindow> method or a **`<Window>`** Alloy element.

A window is a top-level container which can contain other views. Windows can
be *opened* and *closed*.  Opening a window causes the window and its child
views to be added to the application's render stack, on top of any previously opened
windows. Closing a window removes the window and its children from the render stack.

Windows *contain* other views, but in general they are not *contained* inside
other views. There are a few specialized views that manage windows:

* [NavigationWindow](Titanium.UI.NavigationWindow)
* [SplitWindow](Titanium.UI.iOS.SplitWindow)
* [TabGroup](Titanium.UI.TabGroup)
* [Tab](Titanium.UI.Tab)


*(See full overview in titanium-docs)*

### Properties (unique: 72/138)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| backgroundColor | String \| Ti.UI.Color | Transparent | both | Background color of the window, as a color name or hex triplet. |
| bottom | Number \| String | 0 | both | Window's bottom position, in platform-specific units. |
| left | Number \| String | 0 | both | Window's left position, in platform-specific units. |
| opacity | Number | — | both | The opacity from 0.0-1.0. |
| right | Number \| String | 0 | both | Window's right position, in platform-specific units. |
| top | Number \| String | 0 | both | Window's top position, in platform-specific units. |
| activity | Ti.Android.Activity | — | android | Contains a reference to the Android Activity object associated with this window. |
| backButtonTitle | String | — | ios | Title for the back button. This is only valid when the window is a child of a t… |
| backButtonTitleImage | String \| Ti.Blob | — | ios | The image to show as the back button. This is only valid when the window is a c… |
| barColor | String \| Ti.UI.Color | — | both | Background color for the nav bar, as a color name or hex triplet. |
| barImage | String | — | ios | Background image for the nav bar, specified as a URL to a local image. |
| closed | Boolean | true | both | Determines whether this Window is closed. |
| exitOnClose | Boolean | true if this is the first window launched else false; prior to Release 3.3.0, the default was always false. | android | Boolean value indicating if the application should exit when the Android Back b… |
| extendEdges | Array<Number> | — | ios | An array of supported values specified using the EXTEND_EDGE constants in <Tita… |
| flagSecure | Boolean | false | android | Treat the content of the window as secure, preventing it from appearing in scre… |
| focused | Boolean | false | both | Determines whether this TextArea has focus. |
| includeOpaqueBars | Boolean | — | ios | Specifies if the edges should extend beyond opaque bars (navigation bar, tab ba… |
| autoAdjustScrollViewInsets | Boolean | — | ios | Specifies whether or not the view controller should automatically adjust its sc… |
| extendSafeArea | Boolean | `false` on Android, `true` on iOS. | both | Specifies whether the screen insets/notches are allowed to overlap the window's… |
| fullscreen | Boolean | false | both | Boolean value indicating if the window is fullscreen. |
| homeIndicatorAutoHidden | Boolean | false | ios | Boolean value indicating whether the system is allowed to hide the visual indic… |
| hideShadow | Boolean | false | ios | Set this to true to hide the shadow image of the navigation bar. |
| hidesBarsOnSwipe | Boolean | false | ios | Set this to true to hide the navigation bar on swipe. |
| hidesBarsOnTap | Boolean | false | ios | Set this to true to hide the navigation bar on tap. |
| hidesBarsWhenKeyboardAppears | Boolean | false | ios | Set this to true to hide the navigation bar when the keyboard appears. |
| hidesBackButton | Boolean | false | both | Set this to true to hide the back button of navigation bar. |
| largeTitleEnabled | Boolean | false | ios | A Boolean value indicating whether the title should be displayed in a large for… |
| hidesSearchBarWhenScrolling | Boolean | true | ios | A Boolean value indicating whether the integrated search bar is hidden when scr… |
| largeTitleDisplayMode | Number | Titanium.UI.iOS.LARGE_TITLE_DISPLAY_MODE_AUTOMATIC | ios | The mode to use when displaying the title of the navigation bar. |
| leftNavButton | Ti.UI.View | — | ios | View to show in the left nav bar area. |
| leftNavButtons | Array<Titanium.UI.View> | — | ios | An Array of views to show in the left nav bar area. |
| modal | Boolean | false | both | Indicates to open a modal window or not. |
| navBarHidden | Boolean | false | both | Hides the navigation bar (`true`) or shows the navigation bar (`false`). |
| navTintColor | String \| Ti.UI.Color | — | ios | The tintColor to apply to the navigation bar. |
| navigationWindow | Ti.UI.NavigationWindow | — | ios | The <Titanium.UI.NavigationWindow> instance hosting this window. |
| onBack | Callback<void> | — | android | Callback function that overrides the default behavior when the user presses the… |
| orientationModes | Array<Number> | empty array | both | Array of supported orientation modes, specified using the orientation constants… |
| orientation | Number | — | both | Current orientation of the window. |
| rightNavButton | Ti.UI.View | — | ios | View to show in the right nav bar area. |
| rightNavButtons | Array<Titanium.UI.View> | — | ios | An Array of views to show in the right nav bar area. |
| safeAreaPadding | Padding | — | both | The padding needed to safely display content without it being overlapped by the… |
| shadowImage | String | — | ios | Shadow image for the navigation bar, specified as a URL to a local image.. |
| splitActionBar | Boolean | — | android | Boolean value to enable split action bar. |
| statusBarStyle | Number | — | ios | The status bar style associated with this window. |
| statusBarColor | Number | — | android | The color of the status bar (top bar) for this window. |
| navBarColor | Number | — | android | The color of the navigation bar (bottom bar) for this window. |
| sustainedPerformanceMode | Boolean | — | android | Maintain a sustainable level of performance. |
| swipeToClose | Boolean | true | ios | Boolean value indicating if the user should be able to close a window using a s… |
| tabBarHidden | Boolean | — | ios | Boolean value indicating if the tab bar should be hidden. |
| theme | String | — | android | Name of the theme to apply to the window. |
| title | String | — | both | Title of the window. |
| titleAttributes | titleAttributesParams | — | both | Title text attributes of the window. |
| titleControl | Ti.UI.View | — | ios | View to show in the title area of the nav bar. |
| titleImage | String | — | ios | Image to show in the title area of the nav bar, specified as a local file path … |
| titlePrompt | String | — | ios | Title prompt for the window. |
| titleid | String | — | both | Key identifying a string from the locale file to use for the window title. |
| titlepromptid | String | — | ios | Key identifying a string from the locale file to use for the window title promp… |
| toolbar | Array<Titanium.UI.View> | — | ios | Array of button objects to show in the window's toolbar. |
| transitionAnimation | Ti.Proxy | — | ios | Use a transition animation when opening or closing windows in a <Titanium.UI.Na… |
| translucent | Boolean | true on iOS 7 and above, false otherwise. | ios | Boolean value indicating if the nav bar is translucent. |
| windowFlags | Number | — | android | Additional flags to set on the Activity Window. |
| uiFlags | Number | — | android | Additional UI flags to set on the Activity Window. |
| windowSoftInputMode | Number | — | android | Determines whether a window's soft input area (ie software keyboard) is visible… |
| windowPixelFormat | Number | — | android | Set the pixel format for the Activity's Window. |
| activityExitTransition | Number | If not specified uses platform theme transition. | android | The type of transition used when activity is exiting. |
| activityEnterTransition | Number | If not specified uses platform theme transition. | android | The type of transition used when activity is entering. |
| activityReturnTransition | Number | If not specified uses `activityEnterTransition`. | android | The type of transition used when returning from a previously started activity. |
| activityReenterTransition | Number | If not specified uses `activityExitTransition`. | android | The type of transition used when reentering to a previously started activity. |
| activitySharedElementExitTransition | Number | Defaults to Android platform's [move](https://github.com/android/platform_frameworks_base/blob/lollipop-release/core/res/res/transition/move.xml) transition. | android | The type of exit transition used when animating shared elements between two act… |
| activitySharedElementEnterTransition | Number | Defaults to Android platform's [move](https://github.com/android/platform_frameworks_base/blob/lollipop-release/core/res/res/transition/move.xml) transition. | android | The type of enter transition used when animating shared elements between two ac… |
| activitySharedElementReturnTransition | Number | Defaults to Android platform's [move](https://github.com/android/platform_frameworks_base/blob/lollipop-release/core/res/res/transition/move.xml) transition. | android | The type of return transition used when animating shared elements between two a… |
| activitySharedElementReenterTransition | Number | Defaults to Android platform's [move](https://github.com/android/platform_frameworks_base/blob/lollipop-release/core/res/res/transition/move.xml) transition. | android | The type of reenter transition used when animating shared elements between two … |


### Methods (11)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| addSharedElement(view, transitionName) | void | android | Adds a common UI element to participate in window transition animation. |
| close(params) | Promise<any> | both | Closes the window. |
| hideNavBar(options) | void | ios | Hides the navigation bar. |
| hideTabBar(—) | void | ios | Hides the tab bar. Must be called before opening the window. |
| open(params) | Promise<any> | both | Opens the window. |
| removeAllSharedElements(—) | void | android | Clears all added shared elements. |
| setToolbar(items, params) | void | ios | Sets the array of items to show in the window's toolbar. |
| showNavBar(options) | void | ios | Makes the navigation bar visible. |
| showTabBar(—) | void | ios | Shows the tab bar. Must be called before opening the window. |
| showToolbar(options) | void | ios | Makes the bottom toolbar visible. |
| hideToolbar(options) | void | ios | Makes the bottom toolbar invisible. |

### Events (10)
| Event | Platform | Description |
|-------|----------|-------------|
| focus | both | Fired when the window gains focus. |
| androidback | android | Fired when the back button is pressed by the user. |
| androidcamera | android | Fired when the Camera button is released. |
| androidfocus | android | Fired when the Camera button is half-pressed then released. |
| androidsearch | android | Fired when the Search button is released. |
| androidvoldown | android | Fired when the volume down button is released. |
| androidvolup | android | Fired when the volume up button is released. |
| blur | both | Fired when the window loses focus. |
| close | both | Fired when the window is closed. |
| open | both | Fired when the window is opened. |

### Community-Discovered Patterns

#### Large title with ScrollView

When using `largeTitleEnabled` with a ScrollView inside NavigationWindow, three properties must be configured together on the Window:

| Property | Required Value | Role |
|----------|----------------|------|
| `largeTitleEnabled` | `true` | Displays title in large format, collapses on scroll |
| `extendEdges` | `[Ti.UI.EXTEND_EDGE_ALL]` | Content extends behind bars (blur/translucent effect) |
| `autoAdjustScrollViewInsets` | `true` | Adjusts ScrollView insets to prevent content overlap |

**Without `autoAdjustScrollViewInsets`**, setting `extendEdges` causes ScrollView content to render behind the navigation bar. **Without `extendEdges`**, the large title renders with a visible delay (empty nav bar gap, then title draws).

Use `largeTitleDisplayMode` to control collapse behavior:
- `Ti.UI.iOS.LARGE_TITLE_DISPLAY_MODE_AUTOMATIC` (default) — inherits from previous window in the navigation stack; collapses on scroll
- `Ti.UI.iOS.LARGE_TITLE_DISPLAY_MODE_ALWAYS` — title stays large
- `Ti.UI.iOS.LARGE_TITLE_DISPLAY_MODE_NEVER` — always standard size

This applies to Windows inside both standalone NavigationWindow and TabGroup (which wraps each Tab in an implicit NavigationWindow on iOS).

### Related Types

#### AnimatedOptions
> A JavaScript object holding an `animated` property. Used for many UI methods as a means of specifying some transition should be animated.

| Property | Type | Description |
|----------|------|-------------|
| animated | Boolean | If `true`, animate a transition for the method/value change. Note that for most… |

#### Padding
> Dictionary object of parameters for the padding/insets applied to all kinds of views.

| Property | Type | Description |
|----------|------|-------------|
| left | Number | Left padding/inset |
| right | Number | Right padding/inset |
| top | Number | Top padding/inset |
| bottom | Number | Bottom padding/inset |

#### closeWindowParams
> Dictionary of options for the <Titanium.UI.Window.close> method.

| Property | Type | Description |
|----------|------|-------------|
| animated | Boolean | Determines whether to use an animated effect when the window is closed. Default… |
| animationDuration | Number | duration of the animation in milliseconds |
| animationStyle | Number | Transition type to use during a transition animation. |
| activityEnterAnimation | Number | Animation resource to use for the incoming activity. |
| activityExitAnimation | Number | Animation resource to use for the outgoing activity. |

*Plus 3 more types: windowToolbarParam*

---

## Ti.UI.NavigationWindow
> A `NavigationWindow` implements a specialized view that manages the navigation of hierarchical content.
> Extends Ti.UI.Window
> Platforms: both

You create a `NavigationWindow` with the <Titanium.UI.createNavigationWindow> factory method or
a `<NavigationWindow>` Alloy element.

All `NavigationWindow` objects must have at least one root window that cannot be removed. When
creating a `NavigationWindow` with the factory method, you must set its `window` property to the
root level window. Equivalently, in an Alloy application, insert a `<Window>` element as a child of the
`<NavigationWindow>` element. See examples below.

This object is not meant to be added to other windows. However, it can be used within a <Titanium.UI.iOS.SplitWindow>.

### Properties (unique: 2/119)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| window | Ti.UI.Window | — | both | Window to add to this navigation window. |
| interactiveDismissModeEnabled | Boolean | false | ios | A boolean indicating whether or not child windows of this navigation window sho… |


### Methods (3)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| closeWindow(window, options) | void | both | Closes a window and removes it from the navigation window. |
| openWindow(window, options) | void | both | Opens a window within the navigation window. |
| popToRootWindow(options) | void | both | Closes all windows that are currently opened inside the navigation window. |


### Related Types

#### AnimatedOptions
> A JavaScript object holding an `animated` property. Used for many UI methods as a means of specifying some transition should be animated.

| Property | Type | Description |
|----------|------|-------------|
| animated | Boolean | If `true`, animate a transition for the method/value change. Note that for most… |

#### Dictionary
> Plain JavaScript object.

---

## Ti.UI.TabGroup
> A tabbed group of windows.
> Extends Ti.UI.Window
> Platforms: both

| Android | iOS |
| ------- | --- |
| ![Android](./tabgroup_android.png) |  |

A tab group can contain one or more [Tab](Titanium.UI.Tab) objects, each of which has an
associated tab control that is used to bring it into focus.

Use the <Titanium.UI.createTabGroup> method or **`<TabGroup>`** Alloy element to create a tab group
that, in turn, contains one or more `<Tab>` elements.

You can add tabs to the group using [addTab](Titanium.UI.TabGroup.addTab), and programmatically
switch to a specific tab using [setActiveTab](Titanium.UI.TabGroup.setActiveTab).

### Platform Implementation Notes


*(See full overview in titanium-docs)*

### Properties (unique: 43/136)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| tintColor | String | — | both | The tintColor to apply to tabs. |
| activity | Ti.Android.Activity | — | android | Reference to the Android Activity object associated with this tab group. |
| barColor | String \| Ti.UI.Color | — | both | Default navigation bar color (typically for the **More** tab), as a color name … |
| exitOnClose | Boolean | True if tab group is opened on top of the root activity. False otherwise. | android | Boolean value indicating if the application should exit when closing the tab gr… |
| navTintColor | String \| Ti.UI.Color | — | ios | The tintColor to apply to the navigation bar (typically for the **More** tab). |
| shadowImage | String | — | ios | Image of the shadow placed between the tab group and the content area. |
| statusBarColor | Number | — | android | The color of the status bar (top bar) for this window. |
| title | String | — | android | Title for this tabGroup. |
| titleAttributes | titleAttributesParams | — | ios | Title text attributes of the window to be applied on the **More** tab. |
| translucent | Boolean | true on iOS 7 and above, false otherwise. | ios | Boolean value indicating if the nav bar (typically for the **More** tab), is tr… |
| windowSoftInputMode | Number | — | android | Determines how the tab group is treated when a soft input method (such as a vir… |
| activeTab | Number \| Ti.UI.Tab | — | both | Active tab. |
| allowUserCustomization | Boolean | true | ios | Allow the user to reorder tabs in the tab group using the **Edit** button on th… |
| autoTabTitle | Boolean | false | android | If set to `true` it will automatically set the actionbar title to the current t… |
| bottomAccessoryView | Ti.UI.View | — | ios | View shown as a bottom accessory attached to the tab group. |
| minimizeBehavior | Number | — | ios | Defines the minimize behavior for the tab group, if it is supported. |
| enabled | Number | true | both | Enables or disables the menu in a BottomNavigation. If disabled you can't chang… |
| paddingLeft | Number \| String | — | android | Left padding of bottom navigation |
| paddingRight | Number \| String | — | android | Right padding of bottom navigation |
| paddingBottom | Number \| String | — | android | Bottom padding of bottom navigation |
| titleColor | String \| Ti.UI.Color | — | both | Defines the color of the title of tab when it's inactive. |
| activeTitleColor | String \| Ti.UI.Color | — | both | Defines the color of the title of tab when it's active. |
| editButtonTitle | String | — | ios | Title for the edit button on the **More** tab. |
| forceBottomPosition | Boolean | false | ios | Force tab bar to bottom position. |
| swipeable | Boolean | true | android | Boolean value indicating if tab navigation can be done by swipes, in addition t… |
| smoothScrollOnTabClick | Boolean | true | android | Boolean value indicating if changing pages by tab clicks is animated. |
| tabs | Array<Titanium.UI.Tab> | — | both | Tabs managed by the tab group. |
| shiftMode | Number | 1 | android | Determines whether the [TABS_STYLE_BOTTOM_NAVIGATION](Titanium.UI.Android.TABS_… |
| style | Number | — | android | Property defining which style for the TabGroup to be used. |
| tabsBackgroundColor | String \| Ti.UI.Color | — | both | Default background color for inactive tabs, as a color name or hex triplet. |
| tabMode | Number | — | android | Property defining which tabMode is used for the TabGroup. |
| tabsTintColor | String \| Ti.UI.Color | — | ios | The tintColor to apply to the tabs. |
| tabsTranslucent | Boolean | true | ios | A Boolean value that indicates whether the tab group is translucent. |
| flags | Number | — | android | Additional flags to set on the TabGroup. |
| activeTintColor | String | — | both | The activeTintColor to apply to tabs. |
| tabsBackgroundImage | String | — | ios | Default background image for tabs. |
| unselectedItemTintColor | String \| Ti.UI.Color | — | ios | Unselected items in this tab group will be tinted with this color. Setting this… |
| activeTabIconTint | String \| Ti.UI.Color | — | ios | Color applied to active tabs icons, as a color name or hex triplet, where the t… |
| tabsBackgroundSelectedColor | String | — | android | Default background selected color for tabs, as a color name or hex triplet. |
| activeTabBackgroundImage | String | — | ios | Default background image for the active tab. |
| tabBarVisible | Boolean | true | both | Programmatically shows / hides the bottom tab group of the tab group. |
| interactiveDismissModeEnabled | Boolean | false | ios | A boolean indicating whether or not child windows of this tab group should have… |
| experimental | Boolean | false | android | Only used for a BottomNavigation setup. If set to `true` it will use an optimiz… |


### Methods (10)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| close(params) | Promise<any> | both | Closes the tab group and removes it from the UI. |
| hideTabBar(—) | void | both | Hides the tab group with animation. |
| open(params) | Promise<any> | both | Opens the tab group and makes it visible. |
| showTabBar(—) | void | both | Shows the tab group with animation. |
| addTab(tab) | void | both | Adds a tab to the tab group. |
| disableTabNavigation(params) | void | android | Disable (or re-enable) tab navigation. If tab navigation is disabled, the tabs … |
| getActiveTab(—) | Ti.UI.Tab | both | Gets the currently-active tab. |
| removeTab(tab) | void | ios | Removes a tab from the tab group. |
| setActiveTab(indexOrObject) | void | both | Selects the currently active tab in a tab group. |
| getTabs(—) | Array<Titanium.UI.Tab> | both | Gets all tabs that are managed by the tab group. |

### Events (10)
| Event | Platform | Description |
|-------|----------|-------------|
| focus | both | Fired when this tab group gains focus. On Android, fired when a tab in this tab… |
| androidback | android | Fired when the back button is pressed by the user. |
| androidcamera | android | Fired when the Camera button is released. |
| androidfocus | android | Fired when the Camera button is half-pressed then released. |
| androidsearch | android | Fired when the Search button is released. |
| androidvoldown | android | Fired when the volume down button is released. |
| androidvolup | android | Fired when the volume up button is released. |
| blur | both | Fired when this tab group loses focus. On Android, fired when a tab in this tab… |
| close | both | Fired when the tab group is closed. |
| open | both | Fired when the tab group is opened. |

### Related Types

#### closeWindowParams
> Dictionary of options for the <Titanium.UI.Window.close> method.

| Property | Type | Description |
|----------|------|-------------|
| animated | Boolean | Determines whether to use an animated effect when the window is closed. Default… |
| animationDuration | Number | duration of the animation in milliseconds |
| animationStyle | Number | Transition type to use during a transition animation. |
| activityEnterAnimation | Number | Animation resource to use for the incoming activity. |
| activityExitAnimation | Number | Animation resource to use for the outgoing activity. |

#### disableTabOptions
> Dictionary of options for the <Titanium.UI.TabGroup.disableTabOptions> method.

| Property | Type | Description |
|----------|------|-------------|
| animated | Boolean | Determines whether to use an animated effect to hide/show the navigation bar. |
| enabled | Boolean | Show or hide the navigation bar. |

#### openWindowParams
> Dictionary of options for the <Titanium.UI.Window.open> method.

| Property | Type | Description |
|----------|------|-------------|
| animated | Boolean | Determines whether to use an animated effect when the window is shown. |
| bottom | Number \| String | Window's bottom position, in platform-specific units. |
| fullscreen | Boolean | Determines if the window is fullscreen. |
| height | Number \| String | Window's height, in platform-specific units. |
| left | Number \| String | Window's left position, in platform-specific units. |
| modal | Boolean | Determines whether to open the window modal in front of other windows. |
| forceModal | Boolean | Indicates whether the window enforces modal behaviour. |
| modalStyle | Number | Presentation style of this modal window. |
| modalTransitionStyle | Number | Transition style of this modal window. |
| navBarHidden | Boolean | For modal windows, hides the nav bar (`true`) or shows the nav bar (`false`). |
| right | Number \| String | Window's right position, in platform-specific units. |
| top | Number \| String | Window's top position, in platform-specific units. |
| transition | Number | Transition style of this non-modal window. |
| width | Number \| String | Window's width, in platform-specific units. |
| activityEnterAnimation | Number | Animation resource to run on the activity being opened. |
| activityExitAnimation | Number | Animation resource to run on the activity that is being put in background as a … |

*Plus 1 more types: *

---

## Ti.UI.Tab
> A tab instance for a [TabGroup](Titanium.UI.TabGroup).
> Extends Ti.UI.View
> Platforms: both

A `TabGroup` tab instance. Each tab includes a button and one or more windows, which
holds the "contents" of the tab. Users can select a tab by clicking on the tab button.

Use the <Titanium.UI.createTab> method or **`<Tab>`** Alloy element to create a tab.

Use [TabGroup.setActiveTab](Titanium.UI.TabGroup.setActiveTab) to switch between tabs
in a tab group.

The behavior of tabs and tab groups follows the platform's native navigation style,
which varies significantly between platforms.

### iOS Platform Implementation Notes

On iOS, the tab maintains a stack of windows. Windows on top
of the stack can partially or totally obscure windows lower in the stack.  Calling

*(See full overview in titanium-docs)*

### Properties (unique: 20/57)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| backgroundColor | String \| Ti.UI.Color | — | android | Sets the color of the tab when it is inactive. |
| backgroundFocusedColor | String | — | android | Sets the color of the tab when it is focused. |
| tintColor | String | — | both | Defines the color of the tab icon. |
| active | Boolean | — | ios | `true` if this tab is active, `false` if it is not. |
| activeIcon | String | — | ios | Icon URL for this tab when active. |
| badge | String | — | both | Badge value for this tab. `null` indicates no badge. |
| badgeColor | String \| Ti.UI.Color | — | both | If this item displays a badge, this color will be used for the badge's backgrou… |
| badgeBackgroundColor | String \| Ti.UI.Color | — | both | If this item displays a badge, this color will be used for the badge's backgrou… |
| badgeTextColor | String \| Ti.UI.Color | — | android | Set the text color of the badge. |
| icon | String | — | both | Icon URL for this tab. |
| iconFamily | String | — | android | Specifies the font family or specific font to use. |
| iconInsets | TabIconInsets | All insets are zero. | ios | The icon inset or outset for each edge. |
| iconIsMask | Boolean | true | ios | Defines if the icon property of the tab must be used as a mask. |
| activeIconIsMask | Boolean | true | ios | Defines if the active icon property of the tab must be used as a mask. |
| activeTintColor | String | — | both | Defines the color of the tab icon when it is active. |
| title | String | — | both | Title for this tab. |
| titleid | String | — | both | Key identifying a string from the locale file to use for the tab title. Only on… |
| titleColor | String \| Ti.UI.Color | — | both | Defines the color of the title of tab when it's inactive. |
| activeTitleColor | String \| Ti.UI.Color | — | both | Defines the color of the title of tab when it's active. |
| window | Ti.UI.Window | — | both | Root-level tab window. All tabs must have at least one root-level tab window. |


### Methods (4)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| open(window, options) | void | both | Opens a new window. |
| close(window, options) | void | both | Closes the top-level window for this tab. |
| setWindow(window) | void | both | Sets the root window that appears in the tab. |
| popToRootWindow(options) | void | both | Closes all windows that are currently opened inside the tab. |

### Events (3)
| Event | Platform | Description |
|-------|----------|-------------|
| click | both | Fired when this tab is clicked in the tab group. |
| unselected | both | Fired when the tab is no longer selected. |
| selected | both | Fired when the tab is selected. |

### Related Types

#### AnimatedOptions
> A JavaScript object holding an `animated` property. Used for many UI methods as a means of specifying some transition should be animated.

| Property | Type | Description |
|----------|------|-------------|
| animated | Boolean | If `true`, animate a transition for the method/value change. Note that for most… |

#### TabIconInsets
> Dictionary to specify edge insets for <Titanium.UI.Tab.iconInsets>. Difference from typical <Padding> is that `right` and `bottom` are ignored and calculated internally from `top`/`left` values.

| Property | Type | Description |
|----------|------|-------------|
| left | Number | Left inset. |
| top | Number | Top inset. |

#### openWindowParams
> Dictionary of options for the <Titanium.UI.Window.open> method.

| Property | Type | Description |
|----------|------|-------------|
| animated | Boolean | Determines whether to use an animated effect when the window is shown. |
| bottom | Number \| String | Window's bottom position, in platform-specific units. |
| fullscreen | Boolean | Determines if the window is fullscreen. |
| height | Number \| String | Window's height, in platform-specific units. |
| left | Number \| String | Window's left position, in platform-specific units. |
| modal | Boolean | Determines whether to open the window modal in front of other windows. |
| forceModal | Boolean | Indicates whether the window enforces modal behaviour. |
| modalStyle | Number | Presentation style of this modal window. |
| modalTransitionStyle | Number | Transition style of this modal window. |
| navBarHidden | Boolean | For modal windows, hides the nav bar (`true`) or shows the nav bar (`false`). |
| right | Number \| String | Window's right position, in platform-specific units. |
| top | Number \| String | Window's top position, in platform-specific units. |
| transition | Number | Transition style of this non-modal window. |
| width | Number \| String | Window's width, in platform-specific units. |
| activityEnterAnimation | Number | Animation resource to run on the activity being opened. |
| activityExitAnimation | Number | Animation resource to run on the activity that is being put in background as a … |

---

## Ti.UI.AlertDialog
> An alert dialog is a modal view that includes an optional title, a message and buttons, positioned in the middle of the display.
> Extends Ti.UI.View
> Platforms: both

| Android | iOS |
| ------- | --- |
| ![Android](./alertdialog_android.png) | ![iOS](./alertdialog_ios.png) |

An alert dialog is created using <Titanium.UI.createAlertDialog> or **`<AlertDialog>`** Alloy element.

Although this dialog always appears in the middle of the display (not touching the edges),
other aspects of its aesthetics and the way the user interacts with it are different for each
platform, as described below.

### Android

On Android, the default alert dialog displays text information, via a title and message, without
any buttons. As the user can use the system hardware `back` button to dismiss it, a button is
optional.

*(See full overview in titanium-docs)*

### Properties (unique: 36/60)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| tintColor | String \| Ti.UI.Color | — | ios | The tint-color of the dialog. |
| androidView | Ti.UI.View | — | android | View to load inside the message area, to create a custom layout. |
| buttonNames | Array<String> | No buttons (Android), Single "OK" button (iOS) | both | Name of each button to create. |
| cancel | Number | undefined (Android), -1 (iOS) | both | Index to define the cancel button. |
| buttonClickRequired | Boolean | false on Android | android | Setting this to true requires the end-user to click a dialog button to close th… |
| canceledOnTouchOutside | Boolean | true on Android | android | When this is set to `true`, the dialog is canceled when touched outside the win… |
| destructive | Number | -1 | ios | Index to define the destructive button. |
| hintText | String | — | ios | Hint text of the text field inside the dialog. |
| hinttextid | String | — | ios | Key identifying a string from the locale file to use for the [hintText](Titaniu… |
| keyboardType | Number | <Titanium.UI.KEYBOARD_TYPE_DEFAULT> | ios | Keyboard type to display when this text field inside the dialog is focused. |
| keyboardAppearance | Number | <Titanium.UI.KEYBOARD_APPEARANCE_DEFAULT> | ios | Keyboard appearance to be displayed when the text field inside the dialog is fo… |
| loginPlaceholder | String | — | ios | Placeholder of the login text field inside the dialog. |
| loginHintText | String | — | ios | Hint text of the login text field inside the dialog. |
| loginhinttextid | String | — | ios | Key identifying a string from the locale file to use for the [loginHintText](Ti… |
| loginReturnKeyType | Number | <Titanium.UI.RETURNKEY_NEXT> | both | Specifies the text to display on the keyboard `Return` key when this field is f… |
| loginValue | String | — | ios | Value of the login text field inside the dialog. |
| loginKeyboardType | Number | <Titanium.UI.KEYBOARD_DEFAULT> | both | Keyboard type to display when this text field inside the dialog is focused. |
| message | String | — | both | Dialog message. |
| messageid | String | — | both | Key identifying a string in the locale file to use for the message text. |
| ok | String | — | both | Text for the `OK` button. |
| okid | String | — | ios | Key identifying a string in the locale file to use for the `ok` text. |
| passwordPlaceholder | String | — | ios | Placeholder of the password text field inside the dialog. |
| passwordHintText | String | — | ios | Hint text of the password text field inside the dialog. |
| passwordhinttextid | String | — | ios | Key identifying a string from the locale file to use for the [passwordHintText]… |
| passwordReturnKeyType | Number | <Titanium.UI.RETURNKEY_DONE> | both | Specifies the text to display on the keyboard `Return` key when this field is f… |
| passwordValue | String | — | ios | Value of the password text field inside the dialog. |
| passwordKeyboardType | Number | <Titanium.UI.KEYBOARD_DEFAULT> | both | Keyboard type to display when this text field inside the dialog is focused. |
| placeholder | String | — | ios | Placeholder of the text field inside the dialog. |
| persistent | Boolean | false on iOS, true on Android | both | Boolean value indicating if the alert dialog should only be cancelled by user g… |
| preferred | Number | -1 | ios | Index to define the preferred button. |
| returnKeyType | Number | <Titanium.UI.RETURNKEY_DEFAULT> | ios | Specifies the text to display on the keyboard `Return` key when this field is f… |
| style | Number | <Titanium.UI.iOS.AlertDialogStyle.DEFAULT> | ios | The style for the alert dialog. |
| severity | Number | <Titanium.UI.iOS.ALERT_SEVERITY_DEFAULT> | ios | Indicates the severity of the alert in apps built with Mac Catalyst. |
| title | String | — | both | Title of the dialog. |
| titleid | String | — | both | Key identifying a string in the locale file to use for the title text. |
| value | String | — | ios | Value of the text field inside the dialog. |


### Methods (2)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| hide(options) | void | both | Hides this dialog. |
| show(options) | void | both | Shows this dialog. |

### Events (1)
| Event | Platform | Description |
|-------|----------|-------------|
| click | both | Fired when a button in the dialog is clicked. |

### Related Types

#### AnimatedOptions
> A JavaScript object holding an `animated` property. Used for many UI methods as a means of specifying some transition should be animated.

| Property | Type | Description |
|----------|------|-------------|
| animated | Boolean | If `true`, animate a transition for the method/value change. Note that for most… |

---

## Ti.UI.OptionDialog
> An option dialog is a modal view that includes a message and one or more option items positioned in the middle of the display on Android and at the bottom edge on iOS. On Android, buttons may be added below the options.
> Extends Ti.UI.View
> Platforms: both

| Android | iPhone | iPad |
| ------- | ------ | ---- |
| ![Android](./optiondialog_android.png) | ![iPhone](./optiondialog_iphone.png) | ![iPad](./optiondialog_ipad.png) |

An option dialog is created using <Titanium.UI.createOptionDialog> or Alloy `<OptionDialog>`
element. See Examples below for usage.

This dialog is presented differently on each platform, as described below.

### Android

On Android, the dialog is shown in the middle of the display (not touching the edges),
with the option items represented in a picker. The previously-selected, or default, item can be
set on creation.


*(See full overview in titanium-docs)*

### Properties (unique: 10/35)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| androidView | Ti.UI.View | — | android | View to load inside the message area, to create a custom layout. |
| buttonNames | Array<String> | — | android | List of button names. |
| cancel | Number | undefined (Android), -1 (iOS) | both | Index to define the cancel option. |
| destructive | Number | -1 | ios | Index to define the destructive option, indicated by a visual cue when rendered. |
| options | Array<String> | — | both | List of option names to display in the dialog. |
| opaquebackground | Boolean | false | ios | Boolean value indicating if the option dialog should have an opaque background. |
| persistent | Boolean | true | both | Boolean value indicating if the option dialog should only be cancelled by user … |
| selectedIndex | Number | — | android | Defines the default selected option. Since `8.1.0`, if not defined or -1 it wil… |
| title | String | — | both | Title of the dialog. |
| titleid | String | — | both | Key identifying a string in the locale file to use for the title text. |


### Methods (2)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| hide(params) | void | both | Hides this dialog. |
| show(params) | void | both | Shows this dialog. |

### Events (1)
| Event | Platform | Description |
|-------|----------|-------------|
| click | both | Fired when an option of this dialog is clicked or, under certain circumstances,… |

### Related Types

#### hideParams
> Dictionary of options for the <Titanium.UI.OptionDialog.hide> method.

| Property | Type | Description |
|----------|------|-------------|
| animated | Boolean | Determines whether to animate the dialog as it is dismissed. |

#### showParams
> Dictionary of options for the <Titanium.UI.OptionDialog.show> method.

| Property | Type | Description |
|----------|------|-------------|
| title | String | String to be used as title for the dialog. |
| message | String | String to be used as a message for the dialog. |
| buttonNames | Array<String> | Array of String instances. |
| options | Array<String> | Array of String instances. |
| animated | Boolean | Determines whether to animate the dialog as it is shown. |
| view | Ti.UI.View | View to which to attach the dialog. |
| rect | Dimension | Positions the arrow of the option dialog relative to the attached view's dimens… |

---

## Ti.UI.Notification
> A toast notification.
> Extends Ti.Proxy
> Platforms: android

| Android | iOS |
| ------- | --- |
| ![Android](./toast_android.png) |  |

A toast notification is an unobtrusive, pop-up notification that does not
block the UI. Use the <Titanium.UI.createNotification> method or **`<Notification>`** Alloy element
to create a Toast notification.

On Android, by default, a toast notification appears centered on the bottom half of the screen.
On Windows Phone, by default, a toast notification appears over the status bar on the top part
of the screen.

### Properties (unique: 7/10)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| message | String | — | android | Notification text to display. |
| duration | Number | <Titanium.UI.NOTIFICATION_DURATION_SHORT> | android | Determines how long the notification stays on screen. |
| gravity | Number | — | android | Determines the location at which the notification should appear on the screen. |
| xOffset | Number | 0 | android | X offset from the default position, in pixels. |
| yOffset | Number | 0 | android | Y offset from the default position, in pixels. |
| horizontalMargin | Number | 0 | android | Horizontal placement of the notification, *as a fraction of the screen width*. |
| verticalMargin | Number | 0 | android | Vertical placement of the notification, *as a fraction of the screen height*. |


### Methods (1)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| show(—) | void | android | Show the notification. |


---

