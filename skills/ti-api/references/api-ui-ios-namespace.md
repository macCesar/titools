# Ti.UI.iOS Namespace API Reference

## Ti.UI.iOS
> Full released contract: [Titanium.UI.iOS](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS)

> Apple iOS specific UI capabilities.  All properties, methods and events in this namespace will only work on Apple iOS devices.
> Extends Ti.Module
> Platforms: ios
> Type: module

### Properties (unique: 4/160)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| forceTouchSupported | Boolean | ios | Determines if the 3D-Touch capability "Force Touc… |
| appBadge | Number | ios | Value of the badge for the application's springbo… |
| appSupportsShakeToEdit | Boolean | ios | Determines whether the shake to edit system-wide … |
| statusBarBackgroundColor | String \| Ti.UI.Color | ios | Sets the global status bar background color for t… |

### Constants (154)
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

### SDK 14.0.0 constants

These constants are read-only Number values. The namespace declares iPhone/iPad/macOS support; the affected properties and OS/device requirements below still apply. Numeric backing values are not specified in the released YAML: use the constants, not guessed integers.

| Constant | Meaning | OS / API |
|----------|---------|----------|
| `SPLIT_WINDOW_DISPLAY_MODE_AUTOMATIC` | Let the system choose the display mode of a split window that fits the available width. Default. | [SplitWindow.displayMode](api-ui-ios-split-window.md#properties) |
| `SPLIT_WINDOW_DISPLAY_MODE_SECONDARY_ONLY` | Show only the detail view of a split window and hide the master view. | [SplitWindow.displayMode](api-ui-ios-split-window.md#properties) |
| `SPLIT_WINDOW_DISPLAY_MODE_ONE_BESIDE_SECONDARY` | Show the master view of a split window next to the detail view. | [SplitWindow.displayMode](api-ui-ios-split-window.md#properties) |
| `SPLIT_WINDOW_DISPLAY_MODE_ONE_OVER_SECONDARY` | Show the master view of a split window as an overlay on top of the detail view. | [SplitWindow.displayMode](api-ui-ios-split-window.md#properties) |
| `SPLIT_WINDOW_SPLIT_BEHAVIOR_AUTOMATIC` | Let the system choose how the master view and the detail view of a split window share the width. Default. | [SplitWindow.splitBehavior](api-ui-ios-split-window.md#properties) |
| `SPLIT_WINDOW_SPLIT_BEHAVIOR_TILE` | Show the master view and the detail view of a split window side by side without overlap. | [SplitWindow.splitBehavior](api-ui-ios-split-window.md#properties) |
| `SPLIT_WINDOW_SPLIT_BEHAVIOR_OVERLAY` | Show the master view of a split window on top of the detail view, which keeps its full width. | [SplitWindow.splitBehavior](api-ui-ios-split-window.md#properties) |
| `SPLIT_WINDOW_SPLIT_BEHAVIOR_DISPLACE` | Show the master view of a split window next to the detail view, which keeps its width and moves aside. | [SplitWindow.splitBehavior](api-ui-ios-split-window.md#properties) |
| `BAR_BUTTON_VISIBILITY_PRIORITY_LOW` | The item is moved into the overflow menu first when the bar runs out of space. | iOS 27.0+; [Button.visibilityPriority](api-ui-views.md#tiuibutton) |
| `BAR_BUTTON_VISIBILITY_PRIORITY_STANDARD` | The default priority of a bar item. Default. | iOS 27.0+; [Button.visibilityPriority](api-ui-views.md#tiuibutton) |
| `BAR_BUTTON_VISIBILITY_PRIORITY_HIGH` | The item stays visible as long as possible when the bar runs out of space. | iOS 27.0+; [Button.visibilityPriority](api-ui-views.md#tiuibutton) |
| `BAR_BUTTON_AXIS_BEHAVIOR_AUTOMATIC` | The system decides if the item is shown in a horizontal or vertical bar. Default. | iOS 27.1+; [Button.axisBehavior](api-ui-views.md#tiuibutton) |
| `BAR_BUTTON_AXIS_BEHAVIOR_HORIZONTAL_ONLY` | The item is only shown in horizontal bars. | iOS 27.1+; [Button.axisBehavior](api-ui-views.md#tiuibutton) |
| `BAR_BUTTON_AXIS_BEHAVIOR_VERTICAL_PREFERRED` | The item prefers to be shown in a vertical bar. | iOS 27.1+; [Button.axisBehavior](api-ui-views.md#tiuibutton) |
| `VERTICAL_BAR_BEHAVIOR_AUTOMATIC` | The system decides if a vertical bar is used. Default. | iOS 27.1+; [Window.verticalBarBehavior](api-ui-windows-navigation.md#tiuiwindow) |
| `VERTICAL_BAR_BEHAVIOR_DISABLED` | The vertical bar is disabled. | iOS 27.1+; [Window.verticalBarBehavior](api-ui-windows-navigation.md#tiuiwindow) |
| `VERTICAL_BAR_COMPRESSION_BEHAVIOR_AUTOMATIC` | The system decides if the bar items or the tab bar compress first. Default. | iOS 27.1+; [Window.verticalBarCompressionBehavior](api-ui-windows-navigation.md#tiuiwindow) |
| `VERTICAL_BAR_COMPRESSION_BEHAVIOR_PREFERS_BAR_ITEMS` | The bar items compress before the tab bar does. | iOS 27.1+; [Window.verticalBarCompressionBehavior](api-ui-windows-navigation.md#tiuiwindow) |
| `VERTICAL_BAR_COMPRESSION_BEHAVIOR_PREFERS_TAB_BAR` | The tab bar compresses before the bar items do. | iOS 27.1+; [Window.verticalBarCompressionBehavior](api-ui-windows-navigation.md#tiuiwindow) |

The SplitWindow mode/behavior getters return the actual system arrangement, which may differ from the requested value. For bar buttons, low visibility priority enters overflow before standard, then high. `HORIZONTAL_ONLY` keeps an item in a top/bottom bar; `VERTICAL_PREFERRED` chooses a vertical bar when the system supplies one. Vertical bars require the iPhone Duo and the iOS 27.1 build SDK. `VERTICAL_BAR_BEHAVIOR_DISABLED` returns items and the status bar to the horizontal axis. `PREFERS_BAR_ITEMS` compresses bar items first so tabs remain visible; `PREFERS_TAB_BAR` compresses tabs first so bar items remain visible.

`ALERT_SEVERITY_DEFAULT` and `ALERT_SEVERITY_CRITICAL` are used with `Ti.UI.createAlertDialog()` for Mac Catalyst severity; there is no `Ti.UI.iOS.createAlertDialog()` factory. Their SDK 12.0.0 / iOS 16.0+ metadata is unchanged.

[Other iOS UI types](api-ui-ios.md) · [SplitWindow](api-ui-ios-split-window.md)
