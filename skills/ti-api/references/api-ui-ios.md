# Ti.UI.iOS API Reference

## Ti.UI.iOS
> Apple iOS specific UI capabilities.  All properties, methods and events in this namespace will only work on Apple iOS devices.
> Extends Ti.Module
> Platforms: ios
> Type: module

### Properties (unique: 4/141)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| forceTouchSupported | Boolean | ios | Determines if the 3D-Touch capability "Force Touc… |
| appBadge | Number | ios | Value of the badge for the application's springbo… |
| appSupportsShakeToEdit | Boolean | ios | Determines whether the shake to edit system-wide … |
| statusBarBackgroundColor | String \| Ti.UI.Color | ios | Sets the global status bar background color for t… |

### Constants (135)
- **ACTION_POLICY_\***: ACTION_POLICY_CANCEL, ACTION_POLICY_ALLOW
- **ALERT_SEVERITY_\***: ALERT_SEVERITY_DEFAULT, ALERT_SEVERITY_CRITICAL
- **AUDIOVISUAL_MEDIA_TYPE_\***: AUDIOVISUAL_MEDIA_TYPE_NONE, AUDIOVISUAL_MEDIA_TYPE_AUDIO, AUDIOVISUAL_MEDIA_TYPE_VIDEO, AUDIOVISUAL_MEDIA_TYPE_ALL
- **BLUR_EFFECT_STYLE_\***: BLUR_EFFECT_STYLE_LIGHT, BLUR_EFFECT_STYLE_DARK, BLUR_EFFECT_STYLE_REGULAR, BLUR_EFFECT_STYLE_PROMINENT
- **BLUR_EFFECT_STYLE_EXTRA_\***: BLUR_EFFECT_STYLE_EXTRA_LIGHT
- **BLUR_EFFECT_STYLE_SYSTEM_\***: BLUR_EFFECT_STYLE_SYSTEM_MATERIAL
- **BLUR_EFFECT_STYLE_SYSTEM_CHROME_\***: BLUR_EFFECT_STYLE_SYSTEM_CHROME_MATERIAL
- **BLUR_EFFECT_STYLE_SYSTEM_CHROME_MATERIAL_\***: BLUR_EFFECT_STYLE_SYSTEM_CHROME_MATERIAL_LIGHT, BLUR_EFFECT_STYLE_SYSTEM_CHROME_MATERIAL_DARK
- **BLUR_EFFECT_STYLE_SYSTEM_MATERIAL_\***: BLUR_EFFECT_STYLE_SYSTEM_MATERIAL_LIGHT, BLUR_EFFECT_STYLE_SYSTEM_MATERIAL_DARK
- **BLUR_EFFECT_STYLE_SYSTEM_THICK_\***: BLUR_EFFECT_STYLE_SYSTEM_THICK_MATERIAL
- **BLUR_EFFECT_STYLE_SYSTEM_THICK_MATERIAL_\***: BLUR_EFFECT_STYLE_SYSTEM_THICK_MATERIAL_LIGHT, BLUR_EFFECT_STYLE_SYSTEM_THICK_MATERIAL_DARK
- **BLUR_EFFECT_STYLE_SYSTEM_THIN_\***: BLUR_EFFECT_STYLE_SYSTEM_THIN_MATERIAL
- **BLUR_EFFECT_STYLE_SYSTEM_THIN_MATERIAL_\***: BLUR_EFFECT_STYLE_SYSTEM_THIN_MATERIAL_LIGHT, BLUR_EFFECT_STYLE_SYSTEM_THIN_MATERIAL_DARK
- **BLUR_EFFECT_STYLE_SYSTEM_ULTRA_THIN_\***: BLUR_EFFECT_STYLE_SYSTEM_ULTRA_THIN_MATERIAL
- **BLUR_EFFECT_STYLE_SYSTEM_ULTRA_THIN_MATERIAL_\***: BLUR_EFFECT_STYLE_SYSTEM_ULTRA_THIN_MATERIAL_LIGHT, BLUR_EFFECT_STYLE_SYSTEM_ULTRA_THIN_MATERIAL_DARK
- **CACHE_POLICY_RELOAD_IGNORING_LOCAL_CACHE_\***: CACHE_POLICY_RELOAD_IGNORING_LOCAL_CACHE_DATA
- **CACHE_POLICY_RETURN_CACHE_DATA_DONT_\***: CACHE_POLICY_RETURN_CACHE_DATA_DONT_LOAD
- **CACHE_POLICY_RETURN_CACHE_DATA_ELSE_\***: CACHE_POLICY_RETURN_CACHE_DATA_ELSE_LOAD
- **CACHE_POLICY_USE_PROTOCOL_CACHE_\***: CACHE_POLICY_USE_PROTOCOL_CACHE_POLICY
- **CLIP_MODE_\***: CLIP_MODE_DEFAULT, CLIP_MODE_DISABLED, CLIP_MODE_ENABLED
- **COLLISION_MODE_\***: COLLISION_MODE_ALL, COLLISION_MODE_BOUNDARY, COLLISION_MODE_ITEM
- **CREDENTIAL_PERSISTENCE_\***: CREDENTIAL_PERSISTENCE_NONE, CREDENTIAL_PERSISTENCE_PERMANENT, CREDENTIAL_PERSISTENCE_SYNCHRONIZABLE
- **CREDENTIAL_PERSISTENCE_FOR_\***: CREDENTIAL_PERSISTENCE_FOR_SESSION
- **DATE_PICKER_STYLE_\***: DATE_PICKER_STYLE_AUTOMATIC, DATE_PICKER_STYLE_WHEELS, DATE_PICKER_STYLE_COMPACT, DATE_PICKER_STYLE_INLINE
- **FEEDBACK_GENERATOR_IMPACT_STYLE_\***: FEEDBACK_GENERATOR_IMPACT_STYLE_LIGHT, FEEDBACK_GENERATOR_IMPACT_STYLE_MEDIUM, FEEDBACK_GENERATOR_IMPACT_STYLE_HEAVY
- **FEEDBACK_GENERATOR_NOTIFICATION_TYPE_\***: FEEDBACK_GENERATOR_NOTIFICATION_TYPE_SUCCESS, FEEDBACK_GENERATOR_NOTIFICATION_TYPE_WARNING, FEEDBACK_GENERATOR_NOTIFICATION_TYPE_ERROR
- **FEEDBACK_GENERATOR_TYPE_\***: FEEDBACK_GENERATOR_TYPE_SELECTION, FEEDBACK_GENERATOR_TYPE_IMPACT, FEEDBACK_GENERATOR_TYPE_NOTIFICATION
- **GLASS_EFFECT_STYLE_\***: GLASS_EFFECT_STYLE_REGULAR, GLASS_EFFECT_STYLE_CLEAR
- **INJECTION_TIME_DOCUMENT_\***: INJECTION_TIME_DOCUMENT_START, INJECTION_TIME_DOCUMENT_END
- **KEYBOARD_DISMISS_MODE_\***: KEYBOARD_DISMISS_MODE_NONE, KEYBOARD_DISMISS_MODE_INTERACTIVE
- **KEYBOARD_DISMISS_MODE_ON_\***: KEYBOARD_DISMISS_MODE_ON_DRAG
- **LARGE_TITLE_DISPLAY_MODE_\***: LARGE_TITLE_DISPLAY_MODE_AUTOMATIC, LARGE_TITLE_DISPLAY_MODE_ALWAYS, LARGE_TITLE_DISPLAY_MODE_NEVER
- **LIVEPHOTO_BADGE_OPTIONS_LIVE_\***: LIVEPHOTO_BADGE_OPTIONS_LIVE_OFF
- **LIVEPHOTO_BADGE_OPTIONS_OVER_\***: LIVEPHOTO_BADGE_OPTIONS_OVER_CONTENT
- **LIVEPHOTO_PLAYBACK_STYLE_\***: LIVEPHOTO_PLAYBACK_STYLE_FULL, LIVEPHOTO_PLAYBACK_STYLE_HINT
- **MENU_POPUP_ARROW_DIRECTION_\***: MENU_POPUP_ARROW_DIRECTION_UP, MENU_POPUP_ARROW_DIRECTION_DOWN, MENU_POPUP_ARROW_DIRECTION_LEFT, MENU_POPUP_ARROW_DIRECTION_RIGHT, MENU_POPUP_ARROW_DIRECTION_DEFAULT
- **MODAL_PRESENTATION_\***: MODAL_PRESENTATION_FORMSHEET, MODAL_PRESENTATION_FULLSCREEN, MODAL_PRESENTATION_PAGESHEET
- **MODAL_PRESENTATION_CURRENT_\***: MODAL_PRESENTATION_CURRENT_CONTEXT
- **MODAL_PRESENTATION_OVER_CURRENT_\***: MODAL_PRESENTATION_OVER_CURRENT_CONTEXT
- **MODAL_PRESENTATION_OVER_CURRENT_FULL_\***: MODAL_PRESENTATION_OVER_CURRENT_FULL_SCREEN
- **MODAL_TRANSITION_STYLE_COVER_\***: MODAL_TRANSITION_STYLE_COVER_VERTICAL
- **MODAL_TRANSITION_STYLE_CROSS_\***: MODAL_TRANSITION_STYLE_CROSS_DISSOLVE
- **MODAL_TRANSITION_STYLE_FLIP_\***: MODAL_TRANSITION_STYLE_FLIP_HORIZONTAL
- **MODAL_TRANSITION_STYLE_PARTIAL_\***: MODAL_TRANSITION_STYLE_PARTIAL_CURL
- **PREVIEW_ACTION_STYLE_\***: PREVIEW_ACTION_STYLE_DEFAULT, PREVIEW_ACTION_STYLE_SELECTED, PREVIEW_ACTION_STYLE_DESTRUCTIVE
- **PUSH_MODE_\***: PUSH_MODE_CONTINUOUS, PUSH_MODE_INSTANTANEOUS
- **ROW_ACTION_STYLE_\***: ROW_ACTION_STYLE_DEFAULT, ROW_ACTION_STYLE_DESTRUCTIVE, ROW_ACTION_STYLE_NORMAL
- **SCROLL_DECELERATION_RATE_\***: SCROLL_DECELERATION_RATE_FAST, SCROLL_DECELERATION_RATE_NORMAL
- **SCROLL_VIEW_EDGE_EFFECT_STYLE_\***: SCROLL_VIEW_EDGE_EFFECT_STYLE_AUTOMATIC, SCROLL_VIEW_EDGE_EFFECT_STYLE_HARD, SCROLL_VIEW_EDGE_EFFECT_STYLE_SOFT
- **SEARCH_BAR_STYLE_\***: SEARCH_BAR_STYLE_PROMINENT, SEARCH_BAR_STYLE_MINIMAL
- **SELECTION_GRANULARITY_\***: SELECTION_GRANULARITY_DYNAMIC, SELECTION_GRANULARITY_CHARACTER
- **SHORTCUT_ICON_TYPE_\***: SHORTCUT_ICON_TYPE_COMPOSE, SHORTCUT_ICON_TYPE_PLAY, SHORTCUT_ICON_TYPE_PAUSE, SHORTCUT_ICON_TYPE_ADD, SHORTCUT_ICON_TYPE_LOCATION, SHORTCUT_ICON_TYPE_SEARCH, SHORTCUT_ICON_TYPE_SHARE, SHORTCUT_ICON_TYPE_PROHIBIT, SHORTCUT_ICON_TYPE_CONTACT, SHORTCUT_ICON_TYPE_HOME, SHORTCUT_ICON_TYPE_FAVORITE, SHORTCUT_ICON_TYPE_LOVE, SHORTCUT_ICON_TYPE_CLOUD, SHORTCUT_ICON_TYPE_INVITATION, SHORTCUT_ICON_TYPE_CONFIRMATION, SHORTCUT_ICON_TYPE_MAIL, SHORTCUT_ICON_TYPE_MESSAGE, SHORTCUT_ICON_TYPE_DATE, SHORTCUT_ICON_TYPE_TIME, SHORTCUT_ICON_TYPE_TASK, SHORTCUT_ICON_TYPE_ALARM, SHORTCUT_ICON_TYPE_BOOKMARK, SHORTCUT_ICON_TYPE_SHUFFLE, SHORTCUT_ICON_TYPE_AUDIO, SHORTCUT_ICON_TYPE_UPDATE
- **SHORTCUT_ICON_TYPE_CAPTURE_\***: SHORTCUT_ICON_TYPE_CAPTURE_PHOTO, SHORTCUT_ICON_TYPE_CAPTURE_VIDEO
- **SHORTCUT_ICON_TYPE_MARK_\***: SHORTCUT_ICON_TYPE_MARK_LOCATION
- **SHORTCUT_ICON_TYPE_TASK_\***: SHORTCUT_ICON_TYPE_TASK_COMPLETED
- **TAB_GROUP_MINIMIZE_BEHAVIOR_\***: TAB_GROUP_MINIMIZE_BEHAVIOR_AUTOMATIC, TAB_GROUP_MINIMIZE_BEHAVIOR_NEVER
- **TAB_GROUP_MINIMIZE_BEHAVIOR_ON_SCROLL_\***: TAB_GROUP_MINIMIZE_BEHAVIOR_ON_SCROLL_UP, TAB_GROUP_MINIMIZE_BEHAVIOR_ON_SCROLL_DOWN
- **TABLEVIEW_INDEX_\***: TABLEVIEW_INDEX_SEARCH


### Methods (29)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| createLivePhotoBadge(type) | Ti.Blob | ios | Creates a live photo badge to be used together wi… |
| createButtonConfiguration(parameters) | Ti.UI.iOS.ButtonConfiguration | ios | Creates a button configuration object for customi… |
| systemImage(name, parameters) | Ti.Blob | ios | Get image from SF Symbols provided by Apple. |
| createAnchorAttachmentBehavior(parameters) | Ti.UI.iOS.AnchorAttachmentBehavior | ios | Creates and returns an instance of <Titanium.UI.i… |
| createAnimator(parameters) | Ti.UI.iOS.Animator | ios | Creates and returns an instance of <Titanium.UI.i… |
| createBlurView(parameters) | Ti.UI.iOS.BlurView | ios | Creates and returns an instance of <Titanium.UI.i… |
| createCollisionBehavior(parameters) | Ti.UI.iOS.CollisionBehavior | ios | Creates and returns an instance of <Titanium.UI.i… |
| createCoverFlowView(parameters) | Ti.UI.iOS.CoverFlowView | ios | Creates and returns an instance of <Titanium.UI.i… |
| createDocumentViewer(parameters) | Ti.UI.iOS.DocumentViewer | ios | Creates and returns an instance of <Titanium.UI.i… |
| createDynamicItemBehavior(parameters) | Ti.UI.iOS.DynamicItemBehavior | ios | Creates and returns an instance of <Titanium.UI.i… |
| createGravityBehavior(parameters) | Ti.UI.iOS.GravityBehavior | ios | Creates and returns an instance of <Titanium.UI.i… |
| createLivePhotoView(parameters) | Ti.UI.iOS.LivePhotoView | ios | Creates and returns an instance of <Titanium.UI.i… |
| createMenuPopup(parameters) | Ti.UI.iOS.MenuPopup | ios | Creates and returns an instance of <Titanium.UI.i… |
| createNavigationWindow(parameters) | Ti.UI.iOS.NavigationWindow | ios | Creates and returns an instance of <Titanium.UI.i… |
| createPreviewAction(parameters) | Ti.UI.iOS.PreviewAction | ios | Creates and returns an instance of <Titanium.UI.i… |
| createPreviewActionGroup(parameters) | Ti.UI.iOS.PreviewActionGroup | ios | Creates and returns an instance of <Titanium.UI.i… |
| createPreviewContext(parameters) | Ti.UI.iOS.PreviewContext | ios | Creates and returns an instance of <Titanium.UI.i… |
| createPushBehavior(parameters) | Ti.UI.iOS.PushBehavior | ios | Creates and returns an instance of <Titanium.UI.i… |
| createSnapBehavior(parameters) | Ti.UI.iOS.SnapBehavior | ios | Creates and returns an instance of <Titanium.UI.i… |
| createSplitWindow(parameters) | Ti.UI.iOS.SplitWindow | ios | Creates and returns an instance of <Titanium.UI.i… |
| createStepper(parameters) | Ti.UI.iOS.Stepper | ios | Creates and returns an instance of <Titanium.UI.i… |
| createSystemButton(parameters) | Ti.UI.iOS.SystemButton | ios | Creates and returns an instance of <Titanium.UI.i… |
| createTabbedBar(parameters) | Ti.UI.iOS.TabbedBar | ios | Creates and returns an instance of <Titanium.UI.i… |
| createToolbar(parameters) | Ti.UI.iOS.Toolbar | ios | Creates and returns an instance of <Titanium.UI.i… |
| createTransitionAnimation(parameters) | Ti.UI.iOS.TransitionAnimation | ios | Creates and returns an instance of <Titanium.UI.i… |
| createViewAttachmentBehavior(parameters) | Ti.UI.iOS.ViewAttachmentBehavior | ios | Creates and returns an instance of <Titanium.UI.i… |
| createWebViewConfiguration(parameters) | Ti.UI.iOS.WebViewConfiguration | ios | Creates and returns an instance of <Titanium.UI.i… |
| createWebViewDecisionHandler(parameters) | Ti.UI.iOS.WebViewDecisionHandler | ios | Creates and returns an instance of <Titanium.UI.i… |
| createWebViewProcessPool(parameters) | Ti.UI.iOS.WebViewProcessPool | ios | Creates and returns an instance of <Titanium.UI.i… |


---

## Ti.UI.iOS.AlertDialogStyle
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
> A set of constants for the animation styles used for view transitions.  One of the group of animation style constants    * [CURL_DOWN](Titanium.UI.iOS.AnimationStyle.CURL_DOWN)   * [CURL_UP](Titanium.UI.iOS.AnimationStyle.CURL_UP)   * [FLIP_FROM_LEFT](Titanium.UI.iOS.AnimationStyle.FLIP_FROM_LEFT)   * [FLIP_FROM_RIGHT](Titanium.UI.iOS.AnimationStyle.FLIP_FROM_RIGHT)   * [FLIP_FROM_TOP](Titanium.UI.iOS.AnimationStyle.FLIP_FROM_TOP)   * [FLIP_FROM_BOTTOM](Titanium.UI.iOS.AnimationStyle.FLIP_FROM_BOTTOM)   * [CROSS_DISSOLVE](Titanium.UI.iOS.AnimationStyle.CROSS_DISSOLVE)   * [NONE](Titanium.UI.iOS.AnimationStyle.NONE)
> Extends Ti.Proxy
> Platforms: ios

### Constants (8)
- **CROSS_\***: CROSS_DISSOLVE
- **CURL_\***: CURL_DOWN, CURL_UP
- **FLIP_FROM_\***: FLIP_FROM_LEFT, FLIP_FROM_RIGHT, FLIP_FROM_TOP, FLIP_FROM_BOTTOM
- **OTHER_\***: NONE




---

## Ti.UI.iOS.ApplicationShortcuts
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
> A <Titanium.UI.iOS.BlurView> object gives you an easy way implement some complex visual effects.  The blur effect is applied to every view the blur view is added to by default. You can also place the  blur view above other views and all visible views layered under the blur view are blurred as well.  For more information on BlurView, please refer to the official [Apple documentation](https://developer.apple.com/documentation/uikit/uivisualeffectview).  Note: In iOS 26, Apple introduced the `UIGlassEffectView`, an alternative to classic blur views. See the <Titanium.UI.iOS.BlurView.glassEffect> property for more details.
> Extends Ti.UI.View
> Platforms: ios

### Properties (unique: 2/49)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| effect | Number | ios | The blur effect to apply to the effect view. |
| glassEffect | GlassEffectConfiguration | ios | The glass effect configuration to apply to the ef… |




---

## Ti.UI.iOS.ButtonConfiguration
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
> The cover flow view is a container showing animated three-dimensional images in a style  consistent with the former cover flow presentation style used for iPod, iTunes, and Finder.
> Extends Ti.UI.View
> Platforms: ios

### Properties (unique: 2/48)
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
> A set of constants for the style that can be used for the `selectionStyle` property of a ListItem, which is set in the `properties` dictionary of either the <ListDataItem> or <ItemTemplate>.
> Extends Ti.Proxy
> Platforms: ios

### Constants (3)
- **OTHER_\***: BLUE, GRAY, NONE




---

## Ti.UI.iOS.ListViewScrollPosition
> A set of constants for the position value that can be used for the `position` property of <ListViewAnimationProperties> when invoking the ListView's `scrollToItem`, `appendSection`, `deleteSectionAt`, `insertSectionAt` and `replaceSectionAt` methods.
> Extends Ti.Proxy
> Platforms: ios

### Constants (4)
- **OTHER_\***: BOTTOM, MIDDLE, NONE, TOP




---

## Ti.UI.iOS.ListViewStyle
> A set of constants for the style that can be used for the `style` property of  <Titanium.UI.ListView>.
> Extends Ti.Proxy
> Platforms: ios

### Constants (3)
- **INSET_\***: INSET_GROUPED
- **OTHER_\***: GROUPED, PLAIN




---

## Ti.UI.iOS.LivePhoto
> Abstract object representing a live photo used in <Titanium.UI.iOS.LivePhotoView>.
> Extends Ti.Proxy
> Platforms: both




---

## Ti.UI.iOS.LivePhotoView
> A view to display a <Titanium.UI.iOS.LivePhoto> object introduced in iOS 9.1.
> Extends Ti.UI.View
> Platforms: ios

### Properties (unique: 2/49)
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
> A `NavigationWindow` implements a specialized view that manages the navigation of hierarchical content.
> Extends Ti.UI.Window
> Platforms: ios

### Properties (unique: 1/72)
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
> A set of constants for the bar styles used on the `style` property of <Titanium.UI.ProgressBar>.
> Extends Ti.Proxy
> Platforms: ios

### Constants (3)
- **OTHER_\***: BAR, DEFAULT, PLAIN




---

## Ti.UI.iOS.RowAnimationStyle
> A set of constants for the Animation Styles used for transition on table view rows.
> Extends Ti.Proxy
> Platforms: ios

### Constants (6)
- **OTHER_\***: BOTTOM, FADE, LEFT, NONE, RIGHT, TOP




---

## Ti.UI.iOS.ScrollIndicatorStyle
> A set of constants for the styles available for scrollbars used with <Titanium.UI.ScrollView.scrollIndicatorStyle> and <Titanium.UI.TableView.scrollIndicatorStyle> properties.
> Extends Ti.Proxy
> Platforms: ios

### Constants (3)
- **OTHER_\***: BLACK, DEFAULT, WHITE




---

## Ti.UI.iOS.SplitWindow
> A SplitWindow is a window that manages the presentation of two side-by-side view controllers.
> Extends Ti.UI.Window
> Platforms: ios

### Properties (unique: 7/97)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| detailView | Ti.UI.Window | ios | Window for the detail view section of the SplitWi… |
| masterView | Ti.UI.Window | ios | Window for the master view section of the SplitWi… |
| showMasterInPortrait | Boolean | ios | Determines whether to show the master view in por… |
| masterIsOverlayed | Boolean | ios | Determines whether to show the master view is ove… |
| masterViewVisible | Boolean | ios | Determines whether to show the master view or hid… |
| portraitSplit | Number | ios | Determines the width of the `masterView` in portr… |
| landscapeSplit | Number | ios | Determines the width of the `masterView` in lands… |


### Methods (2)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| setShowMasterInPortrait(showMasterInPortrait, options) | void | ios | Sets the value of the [showMasterInPortrait](Tita… |
| setMasterIsOverlayed(masterIsOverlayed, options) | void | ios | Sets the value of the [masterIsOverlayed](Titaniu… |


---

## Ti.UI.iOS.StatusBar
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
> A widget used to increment and decrement a value.
> Extends Ti.UI.View
> Platforms: ios

### Properties (unique: 14/58)
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
> A set of constants for the system icon styles that can be used on a tab group tab.
> Extends Ti.Proxy
> Platforms: ios

### Constants (12)
- **MOST_\***: MOST_RECENT, MOST_VIEWED
- **OTHER_\***: BOOKMARKS, CONTACTS, DOWNLOADS, FAVORITES, FEATURED, HISTORY, MORE, RECENTS, SEARCH
- **TOP_\***: TOP_RATED




---

## Ti.UI.iOS.TabbedBar
> A button bar that maintains a selected state.
> Extends Ti.UI.View
> Platforms: ios

### Properties (unique: 3/49)
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
> A set of constants for the style that can be used for the `selectionStyle` property of  <Titanium.UI.TableViewRow>.
> Extends Ti.Proxy
> Platforms: ios

### Constants (3)
- **OTHER_\***: BLUE, GRAY, NONE




---

## Ti.UI.iOS.TableViewScrollPosition
> A set of constants for the position value that can be used for the `position` property of <Titanium.UI.TableView> when invoking `scrollToIndex`.
> Extends Ti.Proxy
> Platforms: ios

### Constants (4)
- **OTHER_\***: BOTTOM, MIDDLE, NONE, TOP




---

## Ti.UI.iOS.TableViewStyle
> A set of constants for the style that can be used for the `style` property of  <Titanium.UI.TableView> and <Titanium.UI.ListView>.
> Extends Ti.Proxy
> Platforms: ios

### Constants (3)
- **INSET_\***: INSET_GROUPED
- **OTHER_\***: GROUPED, PLAIN




---

## Ti.UI.iOS.Toolbar
> An iOS toolbar, which can contain buttons and certain other controls.
> Extends Ti.UI.View
> Platforms: ios

### Properties (unique: 4/44)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| barColor | String \| Ti.UI.Color | ios | Background color for the toolbar, as a color name… |
| items | Array<Titanium.UI.View> | ios | An array of buttons (or other widgets) contained … |
| extendBackground | Boolean | ios | If `true`, the background of the toolbar extends … |
| translucent | Boolean | ios | If `true`, a translucent background color is used… |




---

## Ti.UI.iOS.TransitionAnimation
> A transition animation when opening or closing windows in a <Titanium.UI.NavigationWindow> or <Titanium.UI.Tab>.  Use this proxy with the Window's [transitionAnimation](Titanium.UI.Window.transitionAnimation) property.
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
> It represents the decision handler to tell to webview, whether allow or cancel the navigation.
> Extends Ti.Proxy
> Platforms: ios


### Methods (1)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| invoke(value) | void | ios | It calls the decision handler with given action p… |


---

## Ti.UI.iOS.WebViewProcessPool
> It represents a pool of Web Content processes.
> Extends Ti.Proxy
> Platforms: ios




---

