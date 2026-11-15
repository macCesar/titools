# Ti.UI.iOS API Reference

<!-- TOC-START -->
## Contents

- [Ti.UI.iOS](#tiuiios)
- [Ti.UI.iOS.AlertDialogStyle](#tiuiiosalertdialogstyle)
- [Ti.UI.iOS.AnimationStyle](#tiuiiosanimationstyle)
- [Ti.UI.iOS.ApplicationShortcuts](#tiuiiosapplicationshortcuts)
- [Ti.UI.iOS.BlurView](#tiuiiosblurview)
- [Ti.UI.iOS.ButtonConfiguration](#tiuiiosbuttonconfiguration)
- [Ti.UI.iOS.CoverFlowView](#tiuiioscoverflowview)
- [Ti.UI.iOS.DocumentViewer](#tiuiiosdocumentviewer)
- [Ti.UI.iOS.FeedbackGenerator](#tiuiiosfeedbackgenerator)
- [Ti.UI.iOS.ListViewCellSelectionStyle](#tiuiioslistviewcellselectionstyle)
- [Ti.UI.iOS.ListViewScrollPosition](#tiuiioslistviewscrollposition)
- [Ti.UI.iOS.ListViewStyle](#tiuiioslistviewstyle)
- [Ti.UI.iOS.LivePhoto](#tiuiioslivephoto)
- [Ti.UI.iOS.LivePhotoView](#tiuiioslivephotoview)
- [Ti.UI.iOS.MenuPopup](#tiuiiosmenupopup)
- [Ti.UI.iOS.NavigationWindow](#tiuiiosnavigationwindow)
- [Ti.UI.iOS.PreviewAction](#tiuiiospreviewaction)
- [Ti.UI.iOS.PreviewActionGroup](#tiuiiospreviewactiongroup)
- [Ti.UI.iOS.PreviewContext](#tiuiiospreviewcontext)
- [Ti.UI.iOS.ProgressBarStyle](#tiuiiosprogressbarstyle)
- [Ti.UI.iOS.RowAnimationStyle](#tiuiiosrowanimationstyle)
- [Ti.UI.iOS.ScrollIndicatorStyle](#tiuiiosscrollindicatorstyle)
- [Ti.UI.iOS.SplitWindow](#tiuiiossplitwindow)
- [Ti.UI.iOS.StatusBar](#tiuiiosstatusbar)
- [Ti.UI.iOS.Stepper](#tiuiiosstepper)
- [Ti.UI.iOS.SystemButton](#tiuiiossystembutton)
- [Ti.UI.iOS.SystemIcon](#tiuiiossystemicon)
- [Ti.UI.iOS.TabbedBar](#tiuiiostabbedbar)
- [Ti.UI.iOS.TableViewCellSelectionStyle](#tiuiiostableviewcellselectionstyle)
- [Ti.UI.iOS.TableViewScrollPosition](#tiuiiostableviewscrollposition)
- [Ti.UI.iOS.TableViewStyle](#tiuiiostableviewstyle)
- [Ti.UI.iOS.Toolbar](#tiuiiostoolbar)
- [Ti.UI.iOS.TransitionAnimation](#tiuiiostransitionanimation)
- [Ti.UI.iOS.WebViewConfiguration](#tiuiioswebviewconfiguration)
- [Ti.UI.iOS.WebViewDecisionHandler](#tiuiioswebviewdecisionhandler)
- [Ti.UI.iOS.WebViewProcessPool](#tiuiioswebviewprocesspool)

<!-- TOC-END -->

## Ti.UI.iOS

The complete namespace properties, constants and methods are in [Ti.UI.iOS namespace](api-ui-ios-namespace.md#tiuiios), including the SDK 14.0.0 SplitWindow and bar-item constants.

---

## Ti.UI.iOS.AlertDialogStyle
> Full released contract: [Titanium.UI.iOS.AlertDialogStyle](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.AlertDialogStyle)

> A set of constants for the style that can be used for the `style` property of  <Titanium.UI.AlertDialog>.
> Extends Ti.Proxy
> Platforms: ios

### Constants (4)
- **LOGIN_AND_PASSWORD_\***: LOGIN_AND_PASSWORD_INPUT
- **OTHER_\***: DEFAULT
- **PLAIN_TEXT_\***: PLAIN_TEXT_INPUT
- **SECURE_TEXT_\***: SECURE_TEXT_INPUT




---

## Ti.UI.iOS.AnimationStyle
> Full released contract: [Titanium.UI.iOS.AnimationStyle](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.AnimationStyle)

> A set of constants for the animation styles used for view transitions.  One of the group of animation style constants    * [CURL_DOWN](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.AnimationStyle)   * [CURL_UP](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.AnimationStyle)   * [FLIP_FROM_LEFT](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.AnimationStyle)   * [FLIP_FROM_RIGHT](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.AnimationStyle)   * [FLIP_FROM_TOP](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.AnimationStyle)   * [FLIP_FROM_BOTTOM](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.AnimationStyle)   * [CROSS_DISSOLVE](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.AnimationStyle)   * [NONE](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.AnimationStyle)
> Extends Ti.Proxy
> Platforms: ios

### Constants (8)
- **CROSS_\***: CROSS_DISSOLVE
- **CURL_\***: CURL_DOWN, CURL_UP
- **FLIP_FROM_\***: FLIP_FROM_LEFT, FLIP_FROM_RIGHT, FLIP_FROM_TOP, FLIP_FROM_BOTTOM
- **OTHER_\***: NONE




---

## Ti.UI.iOS.ApplicationShortcuts
> Full released contract: [Titanium.UI.iOS.ApplicationShortcuts](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.ApplicationShortcuts)

> The Home screen quick actions API is for adding shortcuts to your app icon that anticipate and accelerate a  user's interaction with your app.
> Extends Ti.Proxy
> Platforms: ios


### Methods (7)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| listDynamicShortcuts(—) | Array<ShortcutParams> | ios | Returns an array of the application shortcuts cre… |
| listStaticShortcuts(—) | Array<ShortcutParams> | ios | Returns an array of the application shortcuts lis… |
| removeAllDynamicShortcuts(—) | void | ios | Removes all dynamically created application short… |
| dynamicShortcutExists(identifier) | Boolean | ios | Returns true or false depending if the provided s… |
| addDynamicShortcut(params) | void | ios | Creates a new dynamic application shortcut item. |
| removeDynamicShortcut(identifier) | void | ios | Removes the dynamic application shortcut item ide… |
| getDynamicShortcut(identifier) | ShortcutParams | ios | Gets the dynamic application shortcut item identi… |


---

## Ti.UI.iOS.BlurView
> Full released contract: [Titanium.UI.iOS.BlurView](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.BlurView)

> A <Titanium.UI.iOS.BlurView> object gives you an easy way implement some complex visual effects.  The blur effect is applied to every view the blur view is added to by default. You can also place the  blur view above other views and all visible views layered under the blur view are blurred as well.  For more information on BlurView, please refer to the official [Apple documentation](https://developer.apple.com/documentation/uikit/uivisualeffectview).  Note: In iOS 26, Apple introduced the `UIGlassEffectView`, an alternative to classic blur views. See the <Titanium.UI.iOS.BlurView.glassEffect> property for more details.
> Extends Ti.UI.View
> Platforms: ios

### Properties (unique: 2/50)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| effect | Number | ios | The blur effect to apply to the effect view. |
| glassEffect | GlassEffectConfiguration | ios | The glass effect configuration to apply to the ef… |




---

## Ti.UI.iOS.ButtonConfiguration
> Full released contract: [Titanium.UI.iOS.ButtonConfiguration](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.ButtonConfiguration)

> A configuration object for customizing the appearance and behavior of a button.
> Extends Ti.Proxy
> Platforms: ios

### Properties (unique: 15/17)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| style | String | ios | The style of button configuration to create. |
| title | String | ios | The title text to display on the button. |
| subtitle | String | ios | The subtitle text to display below the title. |
| backgroundColor | String \| Ti.UI.Color | ios | The background color of the button. |
| color | String \| Ti.UI.Color | ios | The foreground color of the button's content. |
| image | String \| Ti.Blob \| Ti.Filesystem.File | ios | The image to display on the button. |
| loading | Boolean | ios | Whether or not a loading indicator should be shown |
| padding | Padding | ios | The padding around the button's content. |
| imagePlacement | String | ios | The placement of the image relative to the title. |
| imagePadding | Number | ios | The spacing between the image and title. |
| titlePadding | Number | ios | The spacing between the title and subtitle. |
| font | Font | ios | Font to use for the button title. |
| textAlign | String \| Number | ios | Text alignment of the configuration title. |
| attributedString | Ti.UI.AttributedString | ios | Specify an attributed string for the button title. |
| backgroundSelectedColor | String \| Ti.UI.Color | ios | Background color to use while the button is highl… |




---

## Ti.UI.iOS.CoverFlowView
> Full released contract: [Titanium.UI.iOS.CoverFlowView](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.CoverFlowView)

> The cover flow view is a container showing animated three-dimensional images in a style  consistent with the former cover flow presentation style used for iPod, iTunes, and Finder.
> Extends Ti.UI.View
> Platforms: ios

### Properties (unique: 2/49)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| images | Array<String> \| Array<Titanium.Blob> \| Array<Titanium.Filesystem.File> \| Array<CoverFlowImageType> | ios | Images to display in the view. |
| selected | Number | ios | Index to make selected. |


### Methods (1)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| setImage(index, image) | void | ios | Changes the image for a specified index. |

### Events (2)
| Event | Platform | Description |
|-------|----------|-------------|
| click | ios | Fired when the user clicks on the view. |
| change | ios | Fired when the user changes the image using a gesture. |

---

## Ti.UI.iOS.DocumentViewer
> Full released contract: [Titanium.UI.iOS.DocumentViewer](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.DocumentViewer)

> A DocumentViewer provides in-app support for managing user interactions with files on the local system.
> Extends Ti.Proxy
> Platforms: ios

### Properties (unique: 4/6)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| name | String | ios | Name of the file (without the path). |
| url | String | ios | URL of the document being previewed. |
| annotation | Dictionary \| Array \| String \| Number \| Date | ios | Custom property list information for the target f… |
| title | String | ios | Title of the file. |


### Methods (2)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| hide(options) | void | ios | Dismisses the document viewer. |
| show(options) | void | ios | Displays the document viewer over the current vie… |

### Events (3)
| Event | Platform | Description |
|-------|----------|-------------|
| load | ios | Fires when the document is previewed. |
| menu | ios | Fires when the options menu appears before the document is previewed. |
| unload | ios | Fires when the document is dismissed. |

---

## Ti.UI.iOS.FeedbackGenerator
> Full released contract: [Titanium.UI.iOS.FeedbackGenerator](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.FeedbackGenerator)

> The feedback generator API is introduced in iOS 10 to handle the haptic feedback when using an iPhone 7 or  later devices.
> Extends Ti.Proxy
> Platforms: ios

### Properties (unique: 2/4)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| type | Number | ios | The type of feedback generator you want to create. |
| style | Number | ios | The style of the feedback generator you want to c… |


### Methods (4)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| prepare(—) | void | ios | Used to prepare the haptic sensor for the upcomin… |
| selectionChanged(—) | void | ios | Used to trigger a haptic feedback after a selecti… |
| impactOccurred(—) | void | ios | Used to trigger a haptic feedback after an impact… |
| notificationOccurred(notificationType) | void | ios | Used to trigger a haptic feedback after a notific… |


---

## Ti.UI.iOS.ListViewCellSelectionStyle
> Full released contract: [Titanium.UI.iOS.ListViewCellSelectionStyle](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.ListViewCellSelectionStyle)

> A set of constants for the style that can be used for the `selectionStyle` property of a ListItem, which is set in the `properties` dictionary of either the <ListDataItem> or <ItemTemplate>.
> Extends Ti.Proxy
> Platforms: ios

### Constants (3)
- **OTHER_\***: BLUE, GRAY, NONE




---

## Ti.UI.iOS.ListViewScrollPosition
> Full released contract: [Titanium.UI.iOS.ListViewScrollPosition](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.ListViewScrollPosition)

> A set of constants for the position value that can be used for the `position` property of <ListViewAnimationProperties> when invoking the ListView's `scrollToItem`, `appendSection`, `deleteSectionAt`, `insertSectionAt` and `replaceSectionAt` methods.
> Extends Ti.Proxy
> Platforms: ios

### Constants (4)
- **OTHER_\***: BOTTOM, MIDDLE, NONE, TOP




---

## Ti.UI.iOS.ListViewStyle
> Full released contract: [Titanium.UI.iOS.ListViewStyle](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.ListViewStyle)

> A set of constants for the style that can be used for the `style` property of  <Titanium.UI.ListView>.
> Extends Ti.Proxy
> Platforms: ios

### Constants (3)
- **INSET_\***: INSET_GROUPED
- **OTHER_\***: GROUPED, PLAIN




---

## Ti.UI.iOS.LivePhoto
> Full released contract: [Titanium.UI.iOS.LivePhoto](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.LivePhoto)

> Abstract object representing a live photo used in <Titanium.UI.iOS.LivePhotoView>.
> Extends Ti.Proxy
> Platforms: both




---

## Ti.UI.iOS.LivePhotoView
> Full released contract: [Titanium.UI.iOS.LivePhotoView](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.LivePhotoView)

> A view to display a <Titanium.UI.iOS.LivePhoto> object introduced in iOS 9.1.
> Extends Ti.UI.View
> Platforms: ios

### Properties (unique: 2/50)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| livePhoto | Ti.UI.iOS.LivePhoto | ios | The Live Photo displayed in the view. |
| muted | Boolean | ios | A Boolean value that determines whether the view … |


### Methods (2)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| startPlaybackWithStyle(playbackStyle) | void | ios | Begins playback of Live Photo content in the view. |
| stopPlayback(—) | void | ios | Ends playback of Live Photo content in the view. |

### Events (2)
| Event | Platform | Description |
|-------|----------|-------------|
| start | ios | Fired when the Live Photo playback starts. |
| stop | ios | Fired when the Live Photo playback stops. |

---

## Ti.UI.iOS.MenuPopup
> Full released contract: [Titanium.UI.iOS.MenuPopup](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.MenuPopup)

> A menu popup provides the ability to create custom tooltip options using the `items` property covering the native `UIMenuController` class.  See also:  * [iOS Developer Library: UIMenuController](https://developer.apple.com/documentation/uikit/uimenucontroller)
> Extends Ti.Proxy
> Platforms: ios

### Properties (unique: 1/3)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| items | Array<String> | ios | The items of the menu popup. |


### Methods (3)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| show(options) | void | ios | Shows the menu popup. |
| hide(options) | void | ios | Hides the menu popup. |
| isVisible(—) | void | ios | Indicates whether the menu popup is currently vis… |

### Events (1)
| Event | Platform | Description |
|-------|----------|-------------|
| click | ios | Fired when the user clicks at one of the menu popup items. |

---

## Ti.UI.iOS.NavigationWindow
> Full released contract: [Titanium.UI.iOS.NavigationWindow](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.NavigationWindow)

> A `NavigationWindow` implements a specialized view that manages the navigation of hierarchical content.
> Extends Ti.UI.Window
> Platforms: ios

### Properties (unique: 1/74)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| window | Ti.UI.Window | ios | Window to add to this navigation window. |


### Methods (3)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| closeWindow(window, options) | void | ios | Closes a window and removes it from the navigatio… |
| openWindow(window, options) | void | ios | Opens a window within the navigation window. |
| popToRootWindow(options) | void | ios | Closes all windows that are currently opened insi… |


---

## Ti.UI.iOS.PreviewAction
> Full released contract: [Titanium.UI.iOS.PreviewAction](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.PreviewAction)

> A PreviewAction provides options to configure actions used by the iOS 9 3D-Touch "Peek and Pop" feature.
> Extends Ti.Proxy
> Platforms: ios

### Properties (unique: 2/4)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| title | String | ios | The title of the action. |
| style | Number | ios | The style of the action. |



### Events (1)
| Event | Platform | Description |
|-------|----------|-------------|
| click | ios | Fired when the device detects a click against a preview action. |

---

## Ti.UI.iOS.PreviewActionGroup
> Full released contract: [Titanium.UI.iOS.PreviewActionGroup](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.PreviewActionGroup)

> A PreviewActionGroup provides options to configure a group of actions used by the iOS 9 3D-Touch feature "Peek and Pop".
> Extends Ti.Proxy
> Platforms: ios

### Properties (unique: 3/5)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| title | String | ios | The title of the action group. |
| style | Number | ios | The style of the action group. |
| actions | Array<Titanium.UI.iOS.PreviewAction> | ios | The preview actions assigned to this preview acti… |




---

## Ti.UI.iOS.PreviewContext
> Full released contract: [Titanium.UI.iOS.PreviewContext](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.PreviewContext)

> A PreviewContext provides options to configure the iOS 9 3D-Touch "Peek and Pop" feature.
> Extends Ti.Proxy
> Platforms: ios

### Properties (unique: 3/5)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| actions | Array<Titanium.UI.iOS.PreviewAction> | ios | The preview actions and preview action groups. |
| contentHeight | Number | ios | The height of the preview. |
| preview | Ti.UI.View | ios | The preview view. |



### Events (2)
| Event | Platform | Description |
|-------|----------|-------------|
| peek | ios | Fired when the user peeks the preview. You can configure the preview |
| pop | ios | Fired when the user pop the preview. You will most likely open a fullscreen win… |

---

## Ti.UI.iOS.ProgressBarStyle
> Full released contract: [Titanium.UI.iOS.ProgressBarStyle](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.ProgressBarStyle)

> A set of constants for the bar styles used on the `style` property of <Titanium.UI.ProgressBar>.
> Extends Ti.Proxy
> Platforms: ios

### Constants (3)
- **OTHER_\***: BAR, DEFAULT, PLAIN




---

## Ti.UI.iOS.RowAnimationStyle
> Full released contract: [Titanium.UI.iOS.RowAnimationStyle](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.RowAnimationStyle)

> A set of constants for the Animation Styles used for transition on table view rows.
> Extends Ti.Proxy
> Platforms: ios

### Constants (6)
- **OTHER_\***: BOTTOM, FADE, LEFT, NONE, RIGHT, TOP




---

## Ti.UI.iOS.ScrollIndicatorStyle
> Full released contract: [Titanium.UI.iOS.ScrollIndicatorStyle](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.ScrollIndicatorStyle)

> A set of constants for the styles available for scrollbars used with <Titanium.UI.ScrollView.scrollIndicatorStyle> and <Titanium.UI.TableView.scrollIndicatorStyle> properties.
> Extends Ti.Proxy
> Platforms: ios

### Constants (3)
- **OTHER_\***: BLACK, DEFAULT, WHITE




---

## Ti.UI.iOS.SplitWindow

See [SplitWindow](api-ui-ios-split-window.md#tiuiiossplitwindow) for the system layout, SDK 14.0.0 properties/methods/events and deprecated legacy controls.

---

## Ti.UI.iOS.StatusBar
> Full released contract: [Titanium.UI.iOS.StatusBar](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.StatusBar)

> A set of constants for the status bar style.
> Extends Ti.Proxy
> Platforms: ios

### Constants (8)
- **ANIMATION_STYLE_\***: ANIMATION_STYLE_NONE, ANIMATION_STYLE_SLIDE, ANIMATION_STYLE_FADE
- **DARK_\***: DARK_CONTENT
- **LIGHT_\***: LIGHT_CONTENT
- **OTHER_\***: DEFAULT, GRAY, GREY




---

## Ti.UI.iOS.Stepper
> Full released contract: [Titanium.UI.iOS.Stepper](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.Stepper)

> A widget used to increment and decrement a value.
> Extends Ti.UI.View
> Platforms: ios

### Properties (unique: 14/59)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| backgroundImage | String | ios | Background image for the stepper in its normal st… |
| tintColor | String \| Ti.UI.Color | ios | Sets the color for the widget, any backgroundImag… |
| enabled | Boolean | ios | Determines if the stepper is enabled or disabled. |
| value | Number | ios | The current value of the stepper. |
| continuous | Boolean | ios | If YES, value change events are sent immediately … |
| autorepeat | Boolean | ios | If YES, the user pressing and holding on the step… |
| wraps | Boolean | ios | If YES, incrementing beyond <Titanium.UI.iOS.Step… |
| minimum | Number | ios | The minimum value the stepper will be set to, the… |
| maximum | Number | ios | The maximum value the stepper will be set to, the… |
| steps | Number | ios | The value the stepper will increment and decremen… |
| decrementImage | String | ios | Background image for the stepper decrement button… |
| decrementDisabledImage | String | ios | Background image for the stepper decrement button… |
| incrementImage | String | ios | Background image for the stepper increment button… |
| incrementDisabledImage | String | ios | Background image for the stepper increment button… |



### Events (1)
| Event | Platform | Description |
|-------|----------|-------------|
| change | ios | Fired every time the stepper value changes. |

---

## Ti.UI.iOS.SystemButton
> Full released contract: [Titanium.UI.iOS.SystemButton](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.SystemButton)

> A set of constants for creating standard iOS system buttons.
> Extends Ti.Proxy
> Platforms: ios

### Constants (26)
- **CONTACT_\***: CONTACT_ADD
- **FAST_\***: FAST_FORWARD
- **FIXED_\***: FIXED_SPACE
- **FLEXIBLE_\***: FLEXIBLE_SPACE
- **INFO_\***: INFO_DARK, INFO_LIGHT
- **OTHER_\***: ACTION, ACTIVITY, ADD, BOOKMARKS, CAMERA, CANCEL, COMPOSE, DISCLOSURE, DONE, EDIT, ORGANIZE, PAUSE, PLAY, REFRESH, REPLY, REWIND, SAVE, SPINNER, STOP, TRASH




---

## Ti.UI.iOS.SystemIcon
> Full released contract: [Titanium.UI.iOS.SystemIcon](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.SystemIcon)

> A set of constants for the system icon styles that can be used on a tab group tab.
> Extends Ti.Proxy
> Platforms: ios

### Constants (12)
- **MOST_\***: MOST_RECENT, MOST_VIEWED
- **OTHER_\***: BOOKMARKS, CONTACTS, DOWNLOADS, FAVORITES, FEATURED, HISTORY, MORE, RECENTS, SEARCH
- **TOP_\***: TOP_RATED




---

## Ti.UI.iOS.TabbedBar
> Full released contract: [Titanium.UI.iOS.TabbedBar](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.TabbedBar)

> A button bar that maintains a selected state.
> Extends Ti.UI.View
> Platforms: ios

### Properties (unique: 3/50)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| index | Number | ios | Index of the currently selected button. |
| labels | Array<String> \| Array<BarItemType> | ios | Array of labels for the tabbed bar. |
| style | Number | ios | Style of the tabbed bar. |



### Events (1)
| Event | Platform | Description |
|-------|----------|-------------|
| click | ios | Fired when a button is clicked. |

---

## Ti.UI.iOS.TableViewCellSelectionStyle
> Full released contract: [Titanium.UI.iOS.TableViewCellSelectionStyle](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.TableViewCellSelectionStyle)

> A set of constants for the style that can be used for the `selectionStyle` property of  <Titanium.UI.TableViewRow>.
> Extends Ti.Proxy
> Platforms: ios

### Constants (3)
- **OTHER_\***: BLUE, GRAY, NONE




---

## Ti.UI.iOS.TableViewScrollPosition
> Full released contract: [Titanium.UI.iOS.TableViewScrollPosition](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.TableViewScrollPosition)

> A set of constants for the position value that can be used for the `position` property of <Titanium.UI.TableView> when invoking `scrollToIndex`.
> Extends Ti.Proxy
> Platforms: ios

### Constants (4)
- **OTHER_\***: BOTTOM, MIDDLE, NONE, TOP




---

## Ti.UI.iOS.TableViewStyle
> Full released contract: [Titanium.UI.iOS.TableViewStyle](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.TableViewStyle)

> A set of constants for the style that can be used for the `style` property of  <Titanium.UI.TableView> and <Titanium.UI.ListView>.
> Extends Ti.Proxy
> Platforms: ios

### Constants (3)
- **INSET_\***: INSET_GROUPED
- **OTHER_\***: GROUPED, PLAIN




---

## Ti.UI.iOS.Toolbar
> Full released contract: [Titanium.UI.iOS.Toolbar](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.Toolbar)

> An iOS toolbar, which can contain buttons and certain other controls.
> Extends Ti.UI.View
> Platforms: ios

### Properties (unique: 4/45)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| barColor | String \| Ti.UI.Color | ios | Background color for the toolbar, as a color name… |
| items | Array<Titanium.UI.View> | ios | An array of buttons (or other widgets) contained … |
| extendBackground | Boolean | ios | If `true`, the background of the toolbar extends … |
| translucent | Boolean | ios | If `true`, a translucent background color is used… |




---

## Ti.UI.iOS.TransitionAnimation
> Full released contract: [Titanium.UI.iOS.TransitionAnimation](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.TransitionAnimation)

> A transition animation when opening or closing windows in a <Titanium.UI.NavigationWindow> or <Titanium.UI.Tab>.  Use this proxy with the Window's [transitionAnimation](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.Window) property.
> Extends Ti.Proxy
> Platforms: ios

### Properties (unique: 3/5)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| duration | Number | ios | Length of the transition in milliseconds. |
| transitionFrom | Ti.UI.Animation | ios | Animation to hide the current window. |
| transitionTo | Ti.UI.Animation | ios | Animation to show the new window. |




---

## Ti.UI.iOS.WebViewConfiguration
> Full released contract: [Titanium.UI.iOS.WebViewConfiguration](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.WebViewConfiguration)

> A collection of properties used to initialize a web view.
> Extends Ti.Proxy
> Platforms: ios

### Properties (unique: 8/10)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| preferences | WebViewPreferencesObject | ios | The preference settings to be used by the web vie… |
| selectionGranularity | Number | ios | The level of granularity with which the user can … |
| mediaTypesRequiringUserActionForPlayback | Number | ios | Determines which media types require a user gestu… |
| suppressesIncrementalRendering | Boolean | ios | A Boolean value indicating whether the web view s… |
| allowsInlineMediaPlayback | Boolean | ios | A Boolean value indicating whether HTML5 videos p… |
| allowsAirPlayMediaPlayback | Boolean | ios | A Boolean value indicating whether AirPlay is all… |
| allowsPictureInPictureMediaPlayback | Boolean | ios | A Boolean value indicating whether HTML5 videos c… |
| processPool | Ti.UI.iOS.WebViewProcessPool | ios | The process pool from which to obtain the Web Con… |




---

## Ti.UI.iOS.WebViewDecisionHandler
> Full released contract: [Titanium.UI.iOS.WebViewDecisionHandler](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.WebViewDecisionHandler)

> It represents the decision handler to tell to webview, whether allow or cancel the navigation.
> Extends Ti.Proxy
> Platforms: ios


### Methods (1)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| invoke(value) | void | ios | It calls the decision handler with given action p… |


---

## Ti.UI.iOS.WebViewProcessPool
> Full released contract: [Titanium.UI.iOS.WebViewProcessPool](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.WebViewProcessPool)

> It represents a pool of Web Content processes.
> Extends Ti.Proxy
> Platforms: ios




---

