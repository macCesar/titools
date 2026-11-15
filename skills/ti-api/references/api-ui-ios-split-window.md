# Ti.UI.iOS.SplitWindow API Reference

## Ti.UI.iOS.SplitWindow

> Full released contract: [Titanium.UI.iOS.SplitWindow](https://titaniumsdk.com/docs/sdk/14.0.0/Titanium.UI.iOS.SplitWindow)
> A window managing master/detail view controllers. Extends `Ti.UI.Window`; iPhone/iPad/macOS.

Set both `masterView` and `detailView` before opening. SplitWindow is a top-level window and cannot be added inside another window or view.

SDK 14.0.0 uses the native `UISplitViewController` layout:

- A wide regular width, such as landscape iPad, shows the panes side by side.
- A narrower regular width, such as portrait iPad, hides the master. The detail navigation bar's display-mode button or a leading-edge swipe reveals it as an overlay.
- A compact width, such as portrait iPhone, collapses to a single column; the system navigates between master and detail.

Each pane is embedded in a navigation controller, so its Window `title` and navigation-bar properties work directly. Set `navBarHidden: true` on that Window to hide its bar. Use an explicit `Ti.UI.NavigationWindow` as a pane when you need to push additional windows inside that pane.

### Properties

The following members are introduced in SDK 14.0.0 unless stated otherwise. [Constants](api-ui-ios-namespace.md#sdk-1400-constants) are Number values; use them rather than hard-coded integers.

| Property | Type | Default | Contract |
|----------|------|---------|----------|
| detailView | Ti.UI.Window | Not specified | Required before opening; existing API. |
| masterView | Ti.UI.Window | Not specified | Required before opening; existing API. |
| displayMode | Number | `Ti.UI.iOS.SPLIT_WINDOW_DISPLAY_MODE_AUTOMATIC` | Requests an arrangement; getter returns the actual system mode, which can differ at compact widths. |
| splitBehavior | Number | `Ti.UI.iOS.SPLIT_WINDOW_SPLIT_BEHAVIOR_AUTOMATIC` | Requests how visible panes share width; getter returns the actual system behavior, which may differ. |
| presentsWithGesture | Boolean | `true` | Leading-edge swipe shows the hidden master. |
| primaryColumnWidthFraction | Number | System default | Master width as a fraction of total split width; bounded by the two point limits below. |
| minimumPrimaryColumnWidth | Number | System default | Minimum master width in points. |
| maximumPrimaryColumnWidth | Number | System default | Maximum master width in points. |

### Methods

| Method | Returns | Contract |
|--------|---------|----------|
| showMasterView() | void | SDK 14.0.0+: animates the master into a mode that fits the current width, for example a narrow overlay. |
| hideMasterView() | void | SDK 14.0.0+: animates the master out if currently visible. |

Observe `displaymodechange` to react to the result; the system chooses the final arrangement.

### Events

| Event | Payload | Contract |
|-------|---------|----------|
| displaymodechange | `displayMode: Number` | SDK 14.0.0+: fires **before** the change; value is a `SPLIT_WINDOW_DISPLAY_MODE_*` constant. |
| collapse | No additional fields declared | SDK 14.0.0+: changes to one column, for example at compact width. |
| expand | No additional fields declared | SDK 14.0.0+: changes from one to two columns. |

### Deprecated legacy controls

All five properties and both setters remain declared, but are deprecated since SDK 14.0.0. Layout is system-owned; the properties have no effect. The old 0.25–0.5 portrait/landscape fraction restriction does not define the replacement API.

| Property | Legacy type / default | Replacement |
|----------|-----------------------|-------------|
| showMasterInPortrait | Boolean / `false` | `displayMode: Ti.UI.iOS.SPLIT_WINDOW_DISPLAY_MODE_ONE_BESIDE_SECONDARY` |
| masterIsOverlayed | Boolean / `false` | `splitBehavior: Ti.UI.iOS.SPLIT_WINDOW_SPLIT_BEHAVIOR_OVERLAY` |
| masterViewVisible | Boolean / `true` | `showMasterView()` / `hideMasterView()` |
| portraitSplit | Number / master width divided by screen width | `primaryColumnWidthFraction` |
| landscapeSplit | Number / master width divided by screen height | `primaryColumnWidthFraction` |

`setShowMasterInPortrait(showMasterInPortrait: Boolean, options?: AnimatedOptions)` and `setMasterIsOverlayed(masterIsOverlayed: Boolean, options?: AnimatedOptions)` retain their signatures and void returns. Their `options` are ignored; the declared legacy default remains `{ animated: false }`. Use `displayMode` and `splitBehavior` instead.

Inherited `transitionAnimation`, `swipeToClose` and `setToolbar` remain excluded by this type's declaration. See [Window](api-ui-windows-navigation.md#tiuiwindow) for other inherited members and [AnimatedOptions](api-ui-windows-navigation.md#animatedoptions) for the dictionary.

[Other iOS UI types](api-ui-ios.md) · [Ti.UI.iOS constants](api-ui-ios-namespace.md)
