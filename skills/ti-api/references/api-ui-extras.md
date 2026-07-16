# Ti.UI Extras API Reference

## Ti.UI.Animation
> The `Animation` object defines an animation that can be applied to a view.
> Extends Ti.Proxy
> Platforms: both

An animation object describes the properties of an animation. At its most basic, an animation
object represents a single-phase animation with an end state and a duration.

When [animate](Titanium.UI.View.animate) is called on a [View](Titanium.UI.View), the view is
animated from its current state to the state described by the animation object. The properties
that can be animated include the view's position, size, colors, transformation matrix and opacity.

You can also specify an animation curve or *easing function* to control the pace of the
animation. To use an easing function, set the animation's `curve` property to one of the
`ANIMATION_CURVE` constants defined in <Titanium.UI>. For example,
[ANIMATION_CURVE_EASE_IN](Titanium.UI.ANIMATION_CURVE_EASE_IN) specifies an animation that
starts slowly and then speeds up.

Animations can be set to reverse themselves automatically on completion, and to repeat a given
number of times. For more complicated effects, multiple animations can be combined in sequence,

*(See full overview in titanium-docs)*

### Properties (unique: 28/31)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| anchorPoint | Point | — | android | Coordinate of the view about which to pivot an animation. |
| autoreverse | Boolean | false | both | Specifies if the animation should be replayed in reverse upon completion. |
| backgroundColor | String \| Ti.UI.Color | — | both | Value of the `backgroundColor` property at the end of the animation, as a color… |
| bottom | Number | — | both | Value of the `bottom` property at the end of the animation. |
| center | Point | — | both | Value of the `center` property at the end of the animation. |
| color | String \| Ti.UI.Color | — | both | Value of the `color` property at the end of the animation, as a color name or h… |
| curve | Number | — | both | Animation curve or easing function to apply to the animation. |
| dampingRatio | Number | — | ios | The damping ratio for the spring animation as it approaches its quiescent state. |
| delay | Number | — | both | Delay, in milliseconds before starting the animation. |
| duration | Number | — | both | Duration of the animation, in milliseconds. |
| rotationY | Number | — | android | Value of the `rotationY` property at the end of the animation. |
| rotationX | Number | — | android | Value of the `rotationX` property at the end of the animation. |
| elevation | Number | — | android | Value of the `elevation` property at the end of the animation. |
| height | Number | — | both | Value of the `height` property at the end of the animation. |
| left | Number | — | both | Value of the `left` property at the end of the animation. |
| opacity | Number | — | both | Value of the `opacity` property at the end of the animation. |
| opaque | Boolean | — | ios | Value of the `opaque` property at the end of the animation. |
| repeat | Number | 1 (no repeat) | both | Number of times the animation should be performed. |
| right | Number | — | both | Value of the `right` property at the end of the animation. |
| springVelocity | Number | — | ios | The initial spring velocity. |
| bounce | Number | — | ios | The animation bounce. If set, the animation uses the iOS 17+ spring animation. |
| top | Number | — | both | Value of the `top` property at the end of the animation. |
| transform | Ti.UI.Matrix2D \| Ti.UI.Matrix3D | — | both | Animate the view from its current transform to the specified transform. |
| transition | Number | — | ios | Transition type to use during a transition animation. |
| view | Ti.UI.View | — | ios | New view to transition to. |
| visible | Boolean | — | ios | Value of the `visible` property at the end of the animation. |
| width | Number | — | both | Value of the `width` property at the end of the animation. |
| zIndex | Number | — | ios | Value of the `zIndex` property at the end of the animation. |



### Events (3)
| Event | Platform | Description |
|-------|----------|-------------|
| cancel | android | Fired when the animation is canceled. |
| complete | both | Fired when the animation completes. |
| start | both | Fired when the animation starts. |

### Related Types

#### Point
> A pair of coordinates used to describe the location of a <Titanium.UI.View>.

| Property | Type | Description |
|----------|------|-------------|
| x | Number \| String | The x-axis coordinate of this point. |
| y | Number \| String | The y-axis coordinate of this point. |

---

## Ti.UI.Matrix2D
> The 2D Matrix is an object for holding values for an affine transformation matrix.
> Extends Ti.Proxy
> Platforms: both

A 2D matrix is used to rotate, scale, translate, or skew the objects in a two-dimensional space.
A 2D affine transformation can be  represented by a 3 by 3 matrix:

### Properties (unique: 6/9)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| a | Number | — | ios | The entry at position [1,1] in the matrix. |
| b | Number | — | ios | The entry at position [1,2] in the matrix. |
| c | Number | — | ios | The entry at position [2,1] in the matrix. |
| d | Number | — | ios | The entry at position [2,2] in the matrix. |
| tx | Number | — | ios | The entry at position [3,1] in the matrix. |
| ty | Number | — | ios | The entry at position [3,2] in the matrix. |


### Methods (5)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| invert(—) | Ti.UI.Matrix2D | both | Returns a matrix constructed by inverting this matrix. |
| multiply(t2) | Ti.UI.Matrix2D | both | Returns a matrix constructed by combining two existing matrices. |
| rotate(angle, toAngle) | Ti.UI.Matrix2D | both | Returns a matrix constructed by rotating this matrix. |
| scale(sx, sy, toSx, toSy) | Ti.UI.Matrix2D | both | Returns a `Matrix2D` object that specifies a scaling animation from one scale t… |
| translate(tx, ty) | Ti.UI.Matrix2D | both | Returns a matrix constructed by applying a translation transform to this matrix. |


---

## Ti.UI.Matrix3D
> The 3D Matrix is an object for holding values for a 3D affine transform.
> Extends Ti.Proxy
> Platforms: ios

The 3D Matrix is created by <Titanium.UI.createMatrix3D>. A 3D transform is
used to rotate, scale, translate, or skew the objects in three-dimensional
space. A 3D transform  is represented by a 4 by 4 matrix.

You create an `identity matrix` by creating a 3D Matrix with an empty
constructor.

### Properties (unique: 16/18)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| m11 | Number | — | ios | The entry at position [1,1] in the matrix. |
| m12 | Number | — | ios | The entry at position [1,2] in the matrix. |
| m13 | Number | — | ios | The entry at position [1,3] in the matrix. |
| m14 | Number | — | ios | The entry at position [1,4] in the matrix. |
| m21 | Number | — | ios | The entry at position [2,1] in the matrix. |
| m22 | Number | — | ios | The entry at position [2,2] in the matrix. |
| m23 | Number | — | ios | The entry at position [2,3] in the matrix. |
| m24 | Number | — | ios | The entry at position [2,4] in the matrix. |
| m31 | Number | — | ios | The entry at position [3,1] in the matrix. |
| m32 | Number | — | ios | The entry at position [3,2] in the matrix. |
| m33 | Number | — | ios | The entry at position [3,3] in the matrix. |
| m34 | Number | — | ios | The entry at position [3,4] in the matrix. |
| m41 | Number | — | ios | The entry at position [4,1] in the matrix. |
| m42 | Number | — | ios | The entry at position [4,2] in the matrix. |
| m43 | Number | — | ios | The entry at position [4,3] in the matrix. |
| m44 | Number | — | ios | The entry at position [4,4] in the matrix. |


### Methods (5)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| invert(—) | Ti.UI.Matrix3D | ios | Returns a matrix constructed by inverting this matrix. |
| multiply(t2) | Ti.UI.Matrix3D | ios | Returns a matrix constructed by combining two existing matrix. |
| rotate(angle, x, y, z) | Ti.UI.Matrix3D | ios | Returns a matrix constructed by rotating this matrix. |
| scale(sx, sy, sz) | Ti.UI.Matrix3D | ios | Returns a matrix constructed by scaling this matrix. |
| translate(tx, ty, tz) | Ti.UI.Matrix3D | ios | Returns a matrix constructed by translating an existing matrix. |


---

## Ti.UI.WebView
> The web view allows you to open an HTML5 based view which can load either local or remote content.
> Extends Ti.UI.View
> Platforms: both

Use the <Titanium.UI.createWebView> method or **`<WebView>`** Alloy element to create a web view.

Web views are more expensive to create than other native views because of the requirement to
load the HTML browser into memory.

The web view content can be any valid web content such as HTML, PDF, SVG or other WebKit supported
content types.

### JavaScript Context in WebViews--Local vs. Remote Content

JavaScript in the web view executes in its own context.  The web view can interact with this
content, but most of this functionality is limited to local content.

**Local Scripts**


*(See full overview in titanium-docs)*

### Properties (unique: 44/123)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| allowFileAccess | Boolean | false | android | A Boolean value indicating file access within WebView. |
| allowsLinkPreview | Boolean | false | ios | A Boolean value that determines whether pressing on a link displays a preview o… |
| blacklistedURLs | Array<String> | — | both | An array of URL strings to blacklist. |
| blockedURLs | Array<String> | — | both | An array of URL strings to be blocked. |
| data | Ti.Blob \| Ti.Filesystem.File | — | both | Web content to load. |
| disableBounce | Boolean | false | ios | Determines whether the view will bounce when scrolling to the edge of the scrol… |
| disableContextMenu | Boolean | false | both | Determines whether or not the webview should not be able to display the context… |
| enableJavascriptInterface | Boolean | true | android | Enable adding JavaScript interfaces internally to webview prior to JELLY_BEAN_M… |
| handlePlatformUrl | Boolean | undefined. Behaves as if false | ios | Lets the webview handle platform supported urls |
| configuration | Ti.UI.iOS.WebViewConfiguration | — | ios | The configuration for the new web view. |
| allowedURLSchemes | Array<String> | — | ios | List of allowed URL schemes for the web view. |
| hideLoadIndicator | Boolean | false | ios | Hides activity indicator when loading remote URL. |
| assetsDirectory | String | — | ios | Path of file or directory to allow read access by the WebView. |
| html | String | — | both | HTML content of this web view. |
| keyboardDisplayRequiresUserAction | Boolean | undefined but behaves as true | ios | A Boolean value indicating whether web content can programmatically display the… |
| hideKeyboardAccessoryView | Boolean | false | ios | A Boolean value indicating whether to hide the keyboard accessory bar. |
| autoAdjustScrollViewInsets | Boolean | false | ios | Specifies whether or not the web view should automatically adjust its scroll vi… |
| ignoreSslError | Boolean | undefined but behaves as false | both | Controls whether to ignore invalid SSL certificates or not. |
| loading | Boolean | — | ios | Indicates if the webview is loading content. |
| onCreateWindow | Callback<Object> | — | android | Callback function called when there is a request for the application to create … |
| onlink | Callback<OnLinkURLResponse> | — | both | Fired before navigating to a link. |
| overScrollMode | Number | Titanium.UI.Android.OVER_SCROLL_ALWAYS | android | Determines the behavior when the user overscrolls the view. |
| cacheMode | Number | <Titanium.UI.Android.WEBVIEW_LOAD_DEFAULT> | android | Determines how a cache is used in this web view. |
| pluginState | Number | <Titanium.UI.Android.WEBVIEW_PLUGINS_OFF> | android | Determines how to treat content that requires plugins in this web view. |
| scrollsToTop | Boolean | true | ios | Controls whether the scroll-to-top gesture is effective. |
| layerType | Number | <Titanium.UI.WebView.LAYER_TYPE_NONE> | android | A value indicating the render mode of the WebView |
| enableZoomControls | Boolean | true | android | If `true`, zoom controls are enabled. |
| mixedContentMode | Boolean | false | android | If `true`, allows the loading of insecure resources from a secure origin. |
| multipleWindows | Boolean | false | android | If set to `false` it will prevent the WebView from opening new windows/tabs. |
| scalesPageToFit | Boolean | `false` on iOS. On Android, `false` when content is specified as a local URL, `true` for any other kind of content (remote URL, `Blob`, or `File`). | both | If `true`, scale contents to fit the web view. |
| url | String | — | both | URL to the web document. |
| userAgent | String | System default user-agent value. | both | The User-Agent header used by the web view when requesting content. |
| willHandleTouches | Boolean | true | ios | Explicitly specifies if this web view handles touches. |
| lightTouchEnabled | Boolean | true | android | Enables using light touches to make a selection and activate mouseovers. |
| requestHeaders | Dictionary | — | both | Sets extra request headers for this web view to use on subsequent URL requests. |
| zoomLevel | Number | undefined. Behaves as no zoom applied. | both | Manage the zoom-level of the current page. |
| scrollbars | Number | <Titanium.UI.Android.WEBVIEW_SCROLLBARS_DEFAULT> | android | Enable or disable horizontal/vertical scrollbars in a WebView. |
| allowsBackForwardNavigationGestures | Boolean | false | ios | A Boolean value indicating whether horizontal swipe gestures will trigger back-… |
| title | String | — | ios | Returns page title of webpage. |
| progress | Number | — | both | An estimate of what fraction of the current navigation has been loaded. |
| cachePolicy | Number | — | ios | The cache policy for the request. |
| timeout | Number | — | ios | The timeout interval for the request, in seconds. |
| selectionGranularity | Number | — | ios | The level of granularity with which the user can interactively select content i… |
| secure | Boolean | — | ios | A Boolean value indicating whether all resources on the page have been loaded t… |

### Constants (8)
- **LAYER_TYPE_\***: LAYER_TYPE_NONE, LAYER_TYPE_SOFTWARE, LAYER_TYPE_HARDWARE
- **PDF_PAGE_DIN_\***: PDF_PAGE_DIN_A5, PDF_PAGE_DIN_A4, PDF_PAGE_DIN_A3, PDF_PAGE_DIN_A2, PDF_PAGE_DIN_A1


### Methods (24)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| setHtml(html, options) | void | both | Sets the value of [html](Titanium.UI.WebView.html) property. |
| canGoBack(—) | Boolean | both | Returns `true` if the web view can go back in its history list. |
| canGoForward(—) | Boolean | both | Returns `true` if the web view can go forward in its history list. |
| evalJS(code, callback) | String | both | Evaluates a JavaScript expression inside the context of the web view and option… |
| goBack(—) | void | both | Goes back one entry in the web view's history list, to the previous page. |
| goForward(—) | void | both | Goes forward one entry in this web view's history list, if possible. |
| pause(—) | void | android | Pauses native webview plugins. |
| reload(—) | void | both | Reloads the current webpage. |
| repaint(—) | void | ios | Forces the web view to repaint its contents. |
| release(—) | void | android | Releases memory when the web view is no longer needed. |
| resume(—) | void | android | Resume native webview plugins. |
| setBasicAuthentication(username, password, persistence) | void | both | Sets the basic authentication for this web view to use on subsequent URL reques… |
| stopLoading(—) | void | both | Stops loading a currently loading page. |
| startListeningToProperties(propertyList) | void | ios | Add native properties for observing for change. |
| stopListeningToProperties(propertyList) | void | ios | Remove native properties from observing. |
| takeSnapshot(callback) | void | ios | Takes a snapshot of the view's visible viewport. |
| addUserScript(params) | void | ios | Adds a user script. |
| removeAllUserScripts(—) | void | ios | Removes all associated user scripts. |
| addScriptMessageHandler(handlerName) | void | both | Adds a script message handler. |
| removeScriptMessageHandler(name) | void | both | Removes a script message handler. |
| backForwardList(—) | BackForwardList | ios | An object which maintains a list of visited pages used to go back and forward t… |
| createPDF(pageWidth, pageHeight, pageSize, showMenu, firstPageOnly, success, callback) | void | both | Create a PDF document representation from the web page currently displayed in t… |
| createWebArchive(callback) | void | ios | Create WebKit web archive data representing the current web content of the WebV… |
| findString(searchString, options, callback) | void | ios | Searches the page contents for the given string. |

### Events (11)
| Event | Platform | Description |
|-------|----------|-------------|
| beforeload | both | Fired before the web view starts loading its content. |
| error | both | Fired when the web view cannot load the content. |
| load | both | Fired when the web view content is loaded. |
| onLoadResource | android | Fired when loading resource. |
| sslerror | both | Fired when an SSL error occurred. |
| blacklisturl | both | Fired when a blacklisted URL is stopped. |
| blockedurl | both | Fired when a URL has been blocked from loading. |
| message | both | Fired when a script message is received from a webpage. |
| progress | both | Fired when webpage download progresses. |
| redirect | ios | Fired when a web view receives a server redirect. |
| handleurl | ios | Fired when <Titanium.UI.WebView.allowedURLSchemes> contains scheme of opening u… |

### Related Types

#### BackForwardList
> The object returned to the <Titanium.UI.WebView.backForwardList> method.

| Property | Type | Description |
|----------|------|-------------|
| currentItem | BackForwardListItem | The current item. |
| backItem | BackForwardListItem | The item immediately preceding the current item. |
| forwardItem | BackForwardListItem | The item immediately following the current item. |
| backList | Array<BackForwardListItem> | The portion of the list preceding the current item. |
| forwardList | Array<BackForwardListItem> | The portion of the list following the current item. |

#### Dictionary
> Plain JavaScript object.

#### StringSearchOptions
> The optional options to pass to the <Titanium.UI.WebView.findString>. Pass a dictionary with one or more of the following string-keys:     * `caseSensitive` (Boolean value)     * `backward` (Boolean value)     * `wraps` (Boolean value)

| Property | Type | Description |
|----------|------|-------------|
| caseSensitive | Boolean | Whether or not the search should be case sensitive. |
| backward | Boolean | The direction to search from the current selection. The search will respect the… |
| wraps | Boolean | Whether the search should start at the beginning of the document once it reache… |

*Plus 2 more types: *

---

## Ti.UI.Toolbar
> A Toolbar can contain buttons, as well as certain other widgets, including text fields and labels.
> Extends Ti.UI.View
> Platforms: both

A `Toolbar` is created by the <Titanium.UI.createToolbar> factory method or **`<Toolbar>`** Alloy element.

To provide spacing between items in the toolbar, on iOS you can use the special system button types,
[FIXED_SPACE](Titanium.UI.iOS.SystemButton.FIXED_SPACE) and
[FLEXIBLE_SPACE](Titanium.UI.iOS.SystemButton.FLEXIBLE_SPACE).

Note that toolbars are positioned like other views (using the `top` and `bottom` properties,
for example), but the [iOS Human Interface Guidelines](https://developer.apple.com/ios/human-interface-guidelines/overview/themes/#//apple_ref/doc/uid/TP40006556-CH12-SW4)
have specific requirements for placing toolbars, specifically:

* On the iPhone and Android, a toolbar should be at the bottom of the window.
* On the iPad, a toolbar should appear at the top or bottom of a window.

Due to an iOS limitation, the buttons in the toolbar only support the `click` event.
The native object underlying a toolbar button does not generate standard view events,

*(See full overview in titanium-docs)*

### Properties (unique: 14/73)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| barColor | String \| Ti.UI.Color | — | both | Background color for the toolbar, as a color name or hex triplet. |
| items | Array<Titanium.UI.View> | — | both | An array of buttons (or other widgets) contained in the toolbar. |
| extendBackground | Boolean | Undefined. Behaves as if set to false. | both | If `true`, the background of the toolbar extends upwards. |
| translucent | Boolean | true | ios | If `true`, a translucent background color is used for the toolbar. |
| contentInsetEndWithActions | Number | — | android | Returns the margin after the toolbar's content when there are action buttons. |
| contentInsetStartWithNavigation | Number | — | android | Returns the margin at the toolbar's content start when there is a navigation bu… |
| logo | String \| Ti.Blob \| Ti.Filesystem.File | — | android | Image to be used as a logo in the Toolbar. |
| navigationIcon | String \| Ti.Blob \| Ti.Filesystem.File | — | android | Image to be used for a navigation icon. |
| navigationIconColor | String | — | android | Tint color of the navigation icon (e.g. home arrow) |
| overflowIcon | String \| Ti.Blob \| Ti.Filesystem.File | — | android | Image to be used for the overflow menu. |
| subtitle | String | — | android | Text of the subtitle. |
| subtitleTextColor | String | — | android | Color for toolbar's subtitle |
| title | String | — | android | Text of the title. |
| titleTextColor | String | — | android | Color string with any Titanium supported format |


### Methods (16)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| collapseActionViews(—) | void | android | Collapses expanded ActionViews if there is any |
| dismissPopupMenus(—) | void | android | Collapses expanded ActionViews and hides overflow menu |
| getContentInsetEnd(—) | Number | android | Returns the margin at the toolbar's content end. |
| getContentInsetLeft(—) | Number | android | Returns the margin on the left of the toolbar's content. |
| getContentInsetRight(—) | Number | android | Returns the margin on the right of the toolbar's content. |
| getContentInsetStart(—) | Number | android | Returns the margin at the toolbar's content start. |
| getCurrentContentInsetEnd(—) | Number | android | Returns the margin at the toolbar's content end that will be used with the curr… |
| getCurrentContentInsetLeft(—) | Number | android | Returns the margin on the left of the toolbar's content that will be used with … |
| getCurrentContentInsetRight(—) | Number | android | Returns the margin on the right of the toolbar's content that will be used with… |
| getCurrentContentInsetStart(—) | Number | android | Returns the margin at the toolbar's content start that will be used with the cu… |
| hasExpandedActionView(—) | Boolean | android | Checks if the toolbar is currently hosting an expanded action view. |
| hideOverflowMenu(—) | void | android | Hides the overflow menu if there is one. |
| isOverflowMenuShowing(—) | Boolean | android | Checks if the toolbar is currently hosting an expanded action view. |
| setContentInsetsAbsolute(insetLeft, insetRight) | void | android | Sets the content margins of the toolbar |
| setContentInsetsRelative(insetStart, insetEnd) | void | android | Sets the content margins relative to the layout direction |
| showOverflowMenu(—) | void | android | Shows the overflow menu if there is one |


---

## Ti.UI.ButtonBar
> An iOS button bar component.
> Extends Ti.UI.View
> Platforms: both

| Android | iOS |
| ------- | --- |
| ![Android](./buttonbar_android.png) |  |

The button bar is a set of buttons joined into a single control.
On iOS, you can set up the buttons with either a title or image, but not both.
On Android, you can set up the buttons with a title, image, or both.

Use the <Titanium.UI.createButtonBar> method or **`<ButtonBar>`** Alloy element to create a button bar.

The [TabbedBar](Titanium.UI.iOS.TabbedBar) control is a button bar where the
last selected button maintains a pressed or selected state. The following discussion
applies to both button bar and tabbed bar.

### Properties (unique: 5/76)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| index | Number | — | both | Index of the currently selected button. |
| labels | Array<String> \| Array<BarItemType> | — | both | Array of labels for the button bar. |
| textColor | String \| Ti.UI.Color | — | ios | Color of title of button, as a color name or hex triplet. |
| selectedTextColor | String \| Ti.UI.Color | — | ios | Color of title of button when it is selected, as a color name or hex triplet. |
| selectedButtonColor | String \| Ti.UI.Color | — | ios | Color of selected button, as a color name or hex triplet. |



### Events (1)
| Event | Platform | Description |
|-------|----------|-------------|
| click | both | Fired when a button is clicked. |

---

## Ti.UI.TabbedBar
> A button bar that maintains a selected state.
> Extends Ti.UI.View
> Platforms: both

A tabbed bar is a button bar that
maintains a state (visually distinguished as a pressed or selected look).
It is closely related to the `ButtonBar` control. See the description of
[ButtonBar](Titanium.UI.ButtonBar) for information on styling tabbed bars and buttons
bars.

Use the <Titanium.UI.createTabbedBar> method to create a Tabbed Bar.

### Properties (unique: 7/78)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| index | Number | — | both | Index of the currently selected button. |
| labels | Array<String> \| Array<BarItemType> | — | both | Array of labels for the tabbed bar. |
| textColor | String \| Ti.UI.Color | — | both | Color of the text |
| selectedBackgroundColor | String \| Ti.UI.Color | — | android | Background color of the selected tab indicator. |
| selectedTextColor | String \| Ti.UI.Color | — | both | Color of the selected text |
| activeTintColor | String \| Ti.UI.Color | — | android | Icon tint color of the selected tab |
| style | Number | Titanium.UI.BUTTON_STYLE_OPTION_NEUTRAL for iOS, Ti.UI.TABS_STYLE_DEFAULT for Android | both | Style of the tabbed bar. |



### Events (1)
| Event | Platform | Description |
|-------|----------|-------------|
| click | both | Fired when a button is clicked. |

---

## Ti.UI.OptionBar
> A bar of selectable buttons where only 1 can be selected at a time.
> Extends Ti.UI.View
> Platforms: both

| Android | iOS |
| ------- | --- |
| ![Android](./optionbar_android.png) |  |

This is a view which shows a list of options where only 1 option is selectable by the user.

On iOS, this displays a
[segmented control](https://developer.apple.com/design/human-interface-guidelines/ios/controls/segmented-controls/).

On Android, this displays a
[toggle button group](https://material.io/components/buttons/android#toggle-button).

Use the <Titanium.UI.createOptionBar> method to create a Option Bar.

### Properties (unique: 7/77)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| layout | String | horizontal | both | Specifies the layout direction such as 'horizontal' or 'vertical'. |
| index | Number | — | both | Index of the currently selected option. |
| labels | Array<String> \| Array<BarItemType> | — | both | Array of labels for the option bar. |
| selectedBackgroundColor | String \| Ti.UI.Color | — | android | Background color of the selected button |
| selectedTextColor | String \| Ti.UI.Color | — | android | Text color of the selected button |
| selectedBorderColor | String \| Ti.UI.Color | — | android | Border color of the selected button |
| color | String \| Ti.UI.Color | — | android | Text color of the unselected button |



### Events (1)
| Event | Platform | Description |
|-------|----------|-------------|
| click | both | Fired when an option has been selected. |

---

## Ti.UI.Shortcut
> Manage application shortcuts.
> Extends Ti.Proxy
> Platforms: both

Allows the creation of application shortcuts, which can be detected using
the `click` event from <Titanium.UI.Shortcut>.

On iOS, shortcuts are only supported on a 3D Touch compatible device.
Use the <Titanium.UI.iOS.forceTouchSupported> property to see if it's supported.

### Properties (unique: 2/5)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| items | Array<Titanium.UI.ShortcutItem> | — | both | List dynamic shortcuts. |
| staticItems | Array<Titanium.UI.ShortcutItem> | — | both | List current pinned/static shortcuts. |


### Methods (4)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| add(item) | void | both | Adds a shortcut item to the application. |
| remove(item) | void | both | Removes the given shortcut item from the application. |
| removeAll(—) | void | both | Removes all shortcut items from the application. |
| getById(id) | Ti.UI.ShortcutItem | both | Fetches a shortcut item by its unique string identifier. |

### Events (1)
| Event | Platform | Description |
|-------|----------|-------------|
| click | both | Fired when a <Titanium.UI.ShortcutItem> was clicked on. |

---

## Ti.UI.ShortcutItem
> An application shortcut item.
> Extends Ti.Proxy
> Platforms: both

Allows the creation of dynamic application shortcut items which can be set in the app to 
offer a dynamic behavior at runtime.

Use the <Titanium.UI.createShortcutItem> method to create a shortcut item and pass it to
the <Titanium.UI.Shortcut.add> method to add it to the application.

### Android Static Shortcuts
Google documents how to add static shortcuts
[here](https://developer.android.com/guide/topics/ui/shortcuts/creating-shortcuts#static).

In the `tiapp.xml` file, you will need to add a shortcuts `<meta-data/>` element to your main activity.
``` xml

### Properties (unique: 6/9)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| id | String | — | both | Determines shortcut id. |
| title | String | — | both | Title of the shortcut. |
| description | String | — | both | Description of the shortcut. |
| icon | String \| Number | — | both | Shortcut icon. |
| data | Object | — | both | Shortcut data. |
| visible | Boolean | — | android | Shortcut visibility. |


### Methods (3)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| show(—) | void | android | Allow the shortcut to show. |
| hide(—) | void | android | Hide the shortcut. |
| pin(—) | void | android | Pin shortcut to launcher. |


---

## Ti.UI.EmailDialog
> An email dialog is a modal window that allows users to compose and send an email.
> Extends Ti.UI.View
> Platforms: both

| Android | iOS |
| ------- | --- |
| ![Android](./emaildialog_android.png) | ![iOS](./emaildialog_ios.png) |

The Email Dialog is created with the <Titanium.UI.createEmailDialog> method. The user needs to
register an e-mail account on the device in order to open the dialog.  The dialog will not
open when there is not a registered e-mail account.

**iOS Platform Notes**

On iOS, you cannot test the e-mail dialog on the iOS Simulator. Test the email dialog on device.

### Properties (unique: 7/35)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| barColor | String \| Ti.UI.Color | — | ios | Bar color of the email dialog window, as a color name or hex triplet. |
| bccRecipients | Array<String> | — | both | Recipients of the email included via the `BCC` (Blind Carbon Copy) field. |
| ccRecipients | Array<String> | — | both | Recipients of the email included via the `CC` (Carbon Copy) field. |
| html | Boolean | false | both | Determines whether the email message, specifically the contents of [messageBody… |
| messageBody | String | — | both | Email message body. |
| subject | String | — | both | Subject line for the email. |
| toRecipients | Array<String> | — | both | Recipients of the email included via the main `TO` field. |

### Constants (4)
- **OTHER_\***: CANCELLED, FAILED, SAVED, SENT


### Methods (3)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| addAttachment(attachment) | void | both | Adds an attachment. |
| isSupported(—) | Boolean | both | Indicates whether sending email is supported by the system. |
| open(options) | void | both | Opens this email dialog. |

### Events (1)
| Event | Platform | Description |
|-------|----------|-------------|
| complete | both | Fired when this email dialog has completed sending an email. |

### Related Types

#### AnimatedOptions
> A JavaScript object holding an `animated` property. Used for many UI methods as a means of specifying some transition should be animated.

| Property | Type | Description |
|----------|------|-------------|
| animated | Boolean | If `true`, animate a transition for the method/value change. Note that for most… |

---

## Ti.UI.DashboardView
> A dashboard view is an iOS Springboard-like view of <Titanium.UI.DashboardItem> items that may  be deleted and reordered by the user using its built-in edit mode.
> Extends Ti.UI.View
> Platforms: ios

The DashboardView is created using the <Titanium.UI.createDashboardView> method or **`<DashboardView>`** 
Alloy element.

Dashboard view's edit mode may be activated by a longpress of a <Titanium.UI.DashboardItem> item, 
unless this behavior has been disabled by the [editable](Titanium.UI.DashboardView.editable) 
property. As a dashboard view does not inherently provide a way to exit edit mode, this must be 
explicitly defined.

When edit mode has been activated, the item icons wobble by default to act as a visual cue. 
This behavior may be disabled using the [wobble](Titanium.UI.DashboardView.wobble) property.

If a dashboard contains more than 9 items, it will be paged into screens in a 3 x 3 formation 
using its built-in scrollable view. A paging control is added to the bottom of the view to 
indicate the active page.


*(See full overview in titanium-docs)*

### Properties (unique: 5/51)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| columnCount | Number | 3 | ios | The number of columns of items in the view. |
| rowCount | Number | 3 | ios | The number of rows of items in the view. |
| data | Array<Titanium.UI.DashboardItem> | — | ios | Items to display in this view. |
| editable | Boolean | true | ios | Determines whether edit mode is activated by a longpress of an item. |
| wobble | Boolean | true | ios | Determines whether the wobble visual editing cue is enabled in edit mode. |


### Methods (2)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| startEditing(—) | void | ios | Enable edit mode. |
| stopEditing(—) | void | ios | Disable edit mode. |

### Events (8)
| Event | Platform | Description |
|-------|----------|-------------|
| click | ios | Fired when the device detects a click against the view. |
| commit | ios | Fired when edit mode ends. |
| delete | ios | Fired when an item is deleted in edit mode. |
| dragend | ios | Fired when an item finishes being dragged in edit mode. |
| dragstart | ios | Fired when an item starts being dragged in edit mode. |
| edit | ios | Fired when edit mode starts. |
| move | ios | Fired when an item is moved in edit mode. |
| pagechanged | ios | Fired when the current page of the dashboard view changes. |

### Related Types

#### Point
> A pair of coordinates used to describe the location of a <Titanium.UI.View>.

| Property | Type | Description |
|----------|------|-------------|
| x | Number \| String | The x-axis coordinate of this point. |
| y | Number \| String | The y-axis coordinate of this point. |

---

## Ti.UI.DashboardItem
> A dashboard item is a view that is displayed as an icon in a <Titanium.UI.DashboardView>.
> Extends Ti.Proxy
> Platforms: ios

A DashboardItem is created using the <Titanium.UI.createDashboardItem> method or **`<DashboardItem>`** Alloy element.

### Properties (unique: 4/6)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| badge | Number | 0 | ios | Integer value displayed in a badge. |
| canDelete | Boolean | true | ios | Determines whether this item can be deleted when it edit mode. |
| image | String \| Ti.Blob | — | ios | Image or path to image to display in the item by default. |
| selectedImage | String \| Ti.Blob | — | ios | Image or path to image to display in the item as it is selected. |



### Events (3)
| Event | Platform | Description |
|-------|----------|-------------|
| click | ios | Fired when a click is detected against the view. |
| delete | ios | Fired when an item is deleted during editing mode. |
| move | ios | Fired when an item is moved during editing mode. |

### Related Types

#### Point
> A pair of coordinates used to describe the location of a <Titanium.UI.View>.

| Property | Type | Description |
|----------|------|-------------|
| x | Number \| String | The x-axis coordinate of this point. |
| y | Number \| String | The y-axis coordinate of this point. |

---

