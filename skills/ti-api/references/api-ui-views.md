# Ti.UI Core Views API Reference

## Ti.UI.View
> An empty drawing surface or container
> Extends Ti.Proxy
> Platforms: both

### Properties (unique: 69/72)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| accessibilityHidden | Boolean | both | Whether the view should be "hidden" from (i.e., i… |
| accessibilityHint | String | both | Briefly describes what performing an action (such… |
| accessibilityLabel | String | both | A succinct label identifying the view for the dev… |
| accessibilityValue | String | both | A string describing the value (if any) of the vie… |
| accessibilityDisableLongPress | Boolean | android | Boolean value to remove the long press notificati… |
| anchorPoint | Point | both | Coordinate of the view about which to pivot an an… |
| animatedCenter | Point | ios | Current position of the view during an animation. |
| backgroundColor | String \| Ti.UI.Color | both | Background color of the view, as a color name or … |
| backgroundDisabledColor | String | android | Disabled background color of the view, as a color… |
| backgroundDisabledImage | String | android | Disabled background image for the view, specified… |
| backgroundFocusedColor | String | android | Focused background color of the view, as a color … |
| backgroundFocusedImage | String | android | Focused background image for the view, specified … |
| backgroundGradient | Gradient | both | A background gradient for the view. |
| backgroundImage | String | both | Background image for the view, specified as a loc… |
| backgroundRepeat | Boolean | both | Determines whether to tile a background across a … |
| backgroundLeftCap | Number | ios | Size of the left end cap. |
| backgroundSelectedColor | String \| Ti.UI.Color | both | Selected background color of the view, as a color… |
| backgroundSelectedImage | String | android | Selected background image URL for the view, speci… |
| backgroundTopCap | Number | ios | Size of the top end cap. |
| borderColor | String \| Ti.UI.Color | both | Border color of the view, as a color name or hex … |
| borderRadius | Number \| String \| Array<Number> \| Array<String> | both | Radius for the rounded corners of the view's bord… |
| borderWidth | Number | both | Border width of the view. |
| bottom | Number \| String | both | View's bottom position, in platform-specific unit… |
| center | Point | both | View's center position, in the parent view's coor… |
| children | Array<Titanium.UI.View> | both | Array of this view's child views. |
| clipMode | Number | ios | View's clipping behavior. |
| elevation | Number | android | Base elevation of the view relative to its parent… |
| filterTouchesWhenObscured | Boolean | android | Discards touch related events if another app's sy… |
| focusable | Boolean | android | Whether view should be focusable while navigating… |
| height | Number \| String | both | View height, in platform-specific units. |
| hiddenBehavior | Number | android | Sets the behavior when hiding an object to releas… |
| horizontalMotionEffect | MinMaxOptions | ios | Adds a horizontal parallax effect to the view |
| id | String | both | View's identifier. |
| left | Number \| String | both | View's left position, in platform-specific units. |
| keepHardwareMode | Boolean | android | A value indicating the render mode of the View |
| layout | String | both | Specifies how the view positions its children. On… |
| opacity | Number | both | Opacity of this view, from 0.0 (transparent) to 1… |
| overrideCurrentAnimation | Boolean | android | When on, animate call overrides current animation… |
| pullBackgroundColor | String \| Ti.UI.Color | ios | Background color of the wrapper view when this vi… |
| previewContext | Ti.UI.iOS.PreviewContext | ios | The preview context used in the 3D-Touch feature … |
| right | Number \| String | both | View's right position, in platform-specific units. |
| rect | DimensionWithAbsolutes | both | The bounding box of the view relative to its pare… |
| rotation | Number | both | Clockwise 2D rotation of the view in degrees. |
| rotationX | Number | android | Clockwise rotation of the view in degrees (x-axis… |
| rotationY | Number | android | Clockwise rotation of the view in degrees (y-axis… |
| scaleX | Number | android | Scaling of the view in x-axis in pixels. |
| scaleY | Number | android | Scaling of the view in y-axis in pixels. |
| size | Dimension | both | The size of the view in system units. |
| softKeyboardOnFocus | Number | android | Determines keyboard behavior when this view is fo… |
| tintColor | String \| Ti.UI.Color | ios | The view's tintColor |
| tooltip | String | both | The default text to display in the control's tool… |
| top | Number \| String | both | The view's top position. |
| touchEnabled | Boolean | both | Determines whether view should receive touch even… |
| touchFeedback | Boolean | android | A material design visual construct that provides … |
| touchFeedbackColor | String | android | Optional touch feedback ripple color. This has no… |
| transform | Ti.UI.Matrix2D \| Ti.UI.Matrix3D | both | Transformation matrix to apply to the view. |
| translationX | Number | android | Horizontal location of the view relative to its l… |
| translationY | Number | android | Vertical location of the view relative to its top… |
| translationZ | Number | android | Depth of the view relative to its elevation in pi… |
| transitionName | String | android | A name to identify this view in activity transiti… |
| verticalMotionEffect | MinMaxOptions | ios | Adds a vertical parallax effect to the view |
| viewShadowRadius | Number \| String | ios | Determines the blur radius used to create the sha… |
| viewShadowColor | String \| Ti.UI.Color | both | Determines the color of the shadow. |
| viewShadowOffset | Point | ios | Determines the offset for the shadow of the view. |
| visible | Boolean | both | Determines whether the view is visible. |
| width | Number \| String | both | View's width, in platform-specific units. |
| horizontalWrap | Boolean | both | Determines whether the layout has wrapping behavi… |
| zIndex | Number | both | Z-index stack order position, relative to other s… |
| keepScreenOn | Boolean | android | Determines whether to keep the device screen on. |


### Methods (13)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| add(view) | void | both | Adds a child to this view's hierarchy. |
| animate(animation, callback) | void | both | Animates this view. |
| clearMotionEffects(—) | void | ios | Removes all previously added motion effects. |
| hide(options) | void | both | Hides this view. |
| insertAt(params) | void | both | Inserts a view at the specified position in the [… |
| remove(view) | void | both | Removes a child view from this view's hierarchy. |
| removeAllChildren(—) | void | both | Removes all child views from this view's hierarch… |
| replaceAt(params) | void | both | Replaces a view at the specified position in the … |
| show(options) | void | both | Makes this view visible. |
| stopAnimation(—) | void | android | Stops a running animation. |
| toImage(callback, honorScaleFactor) | Ti.Blob | both | Returns an image of the rendered view, as a Blob. |
| convertPointToView(point, destinationView) | Point | both | Translates a point from this view's coordinate sy… |
| getViewById(id) | Ti.UI.View | both | Returns the matching view of a given view ID. |

### Events (17)
| Event | Platform | Description |
|-------|----------|-------------|
| click | both | Fired when the device detects a click against the view. |
| dblclick | both | Fired when the device detects a double click against the view. |
| doubletap | both | Fired when the device detects a double tap against the view. |
| focus | android | Fired when the view element gains focus. |
| keypressed | both | Fired when a hardware key is pressed in the view. |
| longclick | android | Fired when the device detects a long click. |
| longpress | both | Fired when the device detects a long press. |
| pinch | both | Fired when the device detects a pinch gesture. |
| postlayout | both | Fired when a layout cycle is finished. |
| rotate | both | Fired when the device detects a two finger rotation. |
| singletap | both | Fired when the device detects a single tap against the view. |
| swipe | both | Fired when the device detects a swipe gesture against the view. |
| touchcancel | both | Fired when a touch event is interrupted by the device. |
| touchend | both | Fired when a touch event is completed. |
| touchmove | both | Fired as soon as the device detects movement of a touch. |
| touchstart | both | Fired as soon as the device detects a touch gesture. |
| twofingertap | both | Fired when the device detects a two-finger tap against the view. |

---

## Ti.UI.Label
> A text label, with an optional background image.
> Extends Ti.UI.View
> Platforms: both

### Properties (unique: 31/102)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| attributedString | Ti.UI.AttributedString | both | Specify an attributed string for the label. |
| autoLink | Number | android | Automatically convert certain text items in the l… |
| autoSize | Boolean | android | Automatically scales the label into its size. |
| backgroundPaddingBottom | Number | ios | Number of pixels to extend the background image p… |
| backgroundPaddingLeft | Number | ios | Number of pixels to extend the background image p… |
| backgroundPaddingRight | Number | ios | Number of pixels to extend the background image p… |
| backgroundPaddingTop | Number | ios | Number of pixels to extend the background image p… |
| color | String \| Ti.UI.Color | both | Color of the label text, as a color name or hex t… |
| ellipsize | Number | both | Causes words in the text that are longer than the… |
| font | Font | both | Font to use for the label text. |
| highlightedColor | String \| Ti.UI.Color | both | Color of the label when in the highlighted state,… |
| html | String | both | Pass a HTML-based string and it will be formatted… |
| breakStrategy | Number | android | Break strategy (control over paragraph layout). C… |
| hyphenationFrequency | Number | android | Frequency of automatic hyphenation. Check [Androi… |
| includeFontPadding | Boolean | android | Includes extra top and bottom padding to make roo… |
| lines | Number | android | Makes the label be exactly this many lines tall. |
| lineCount | Number | both | Returns the amount of lines the content is actual… |
| letterSpacing | Number | android | Letter spacing of the [text](Titanium.UI.Label.te… |
| lineSpacing | LabelLineSpacing | android | Line spacing of the [text](Titanium.UI.Label.text… |
| maxLines | Number | both | Makes the label at most this many lines tall. |
| minimumFontSize | Number | both | Minimum font size when the font is sized based on… |
| shadowColor | String \| Ti.UI.Color | both | Shadow color of the [text](Titanium.UI.Label.text… |
| shadowOffset | Point | both | Shadow offset of the [text](Titanium.UI.Label.tex… |
| shadowRadius | Number | android | Shadow radius of the [text](Titanium.UI.Label.tex… |
| text | String | both | Label text. |
| textTransform | String | both | Property that specifies how to capitalize the tex… |
| textAlign | String \| Number | both | Text alignment. |
| textid | String | both | Key identifying a string from the locale file to … |
| visibleText | String | android | Returns the actual text seen on the screen. If th… |
| wordWrap | Boolean | android | Enable or disable word wrapping in the label. |
| verticalAlign | Number \| String | both | Vertical text alignment, specified using one of t… |



### Events (1)
| Event | Platform | Description |
|-------|----------|-------------|
| link | both | Fired when user interacts with a URL in the Label. |

---

## Ti.UI.Button
> A button widget that has four states: normal, disabled, focused and selected.
> Extends Ti.UI.View
> Platforms: both

### Properties (unique: 25/89)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| backgroundDisabledImage | String | both | Background image for the button in its disabled s… |
| backgroundFocusedImage | String | both | Background image for the button in its focused st… |
| backgroundImage | String | both | Background image for the button in its normal sta… |
| backgroundSelectedColor | String \| Ti.UI.Color | both | Selected background color of the view, as a color… |
| backgroundSelectedImage | String | both | Background image for the button in its selected s… |
| tintColor | String | both | Color applied to button's image and title. |
| tooltip | String | both | The default text to display in the control's tool… |
| attributedString | Ti.UI.AttributedString | both | Specify an attributed string for the label. |
| color | String \| Ti.UI.Color | both | Default button text color, as a color name or hex… |
| disabledColor | String \| Ti.UI.Color | ios | Text color of the button in its disabled state, a… |
| configuration | Ti.UI.iOS.ButtonConfiguration \| Object | ios | Button configuration for modern button styling. |
| enabled | Boolean | both | Set to `true` to enable the button, `false` to di… |
| font | Font | both | Font to use for the button text. |
| image | String \| Number \| Ti.Blob | both | Image to display next to the button title. |
| imageIsMask | Boolean | both | Set true to tint the button image. Set false to s… |
| selectedColor | String \| Ti.UI.Color | ios | Button text color used to indicate the selected s… |
| shadowColor | String \| Ti.UI.Color | both | Shadow color of the [title](Titanium.UI.Button.ti… |
| shadowOffset | Point | both | Shadow offset of the [title](Titanium.UI.Button.t… |
| shadowRadius | Number | android | Shadow radius of the [title](Titanium.UI.Button.t… |
| style | Number | both | The border and fill style the button will use. |
| systemButton | Number | ios | Specifies an iOS system button appearance, as def… |
| textAlign | String \| Number | both | Text alignment, specified using one of the <Titan… |
| title | String | both | Button title. |
| titleid | String | both | Key identifying a string from the locale file to … |
| verticalAlign | Number \| String | both | Vertical alignment for the text field, specified … |



### Events (1)
| Event | Platform | Description |
|-------|----------|-------------|
| touchfiltered | android | Fired when the device detects a swipe gesture against the view. |

---

## Ti.UI.ImageView
> A view to display a single image or series of animated images.
> Extends Ti.UI.View
> Platforms: both

### Properties (unique: 17/87)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| tintColor | String \| Ti.UI.Color | both | The view's tintColor. Android does not support se… |
| animating | Boolean | both | Indicates whether animation is running. |
| autorotate | Boolean | both | Indicates whether the image should be rotated bas… |
| decodeRetries | Number | android | Number of times to retry decoding the bitmap at a… |
| defaultImage | String | both | Local path to the default image to display while … |
| duration | Number | both | Amount of time in milliseconds to animate one cyc… |
| enableZoomControls | Boolean | android | Show zoom controls when the user touches the imag… |
| hires | Boolean | ios | Set to `true` to prevent scaling of 2x/3x-resolut… |
| image | String \| Ti.Blob \| Ti.Filesystem.File | both | Image to display. |
| imageTouchFeedback | Boolean | android | Enables a ripple effect when the foreground image… |
| imageTouchFeedbackColor | String | android | Optional touch feedback ripple color. This has no… |
| images | Array<String> \| Array<Titanium.Blob> \| Array<Titanium.Filesystem.File> | both | Array of images to animate, defined using local f… |
| paused | Boolean | both | Indicates whether the animation is paused. |
| preventDefaultImage | Boolean | ios | Prevent the default image from being displayed wh… |
| repeatCount | Number | both | Number of times to repeat the image animation. |
| reverse | Boolean | both | Run the animation in reverse. |
| scalingMode | Number | both | Determines how the image is scaled within the vie… |


### Methods (6)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| pause(—) | void | both | Pauses a running animation. Use `resume` method t… |
| resume(—) | void | both | Resumes an animation from a `pause` state. |
| start(—) | void | both | Starts the image animation. On Android, also rese… |
| stop(—) | void | both | Stops a running animation. On iOS, also resets `i… |
| toBlob(—) | Ti.Blob | both | Returns the image as a Blob object. |
| addSymbolEffect(symbolEffect, options, animated, callback) | void | ios | Adds a symbol effect to the image view with speci… |

### Events (6)
| Event | Platform | Description |
|-------|----------|-------------|
| change | both | Fired for each frame change during an animation. |
| load | both | Fired when either the initial image and/or all of the images in an animation ar… |
| start | both | Fired when the animation starts. |
| stop | both | Fired when the animation stops. |
| error | both | Fired when an image fails to load. |
| pause | both | Fired when the animation pauses. |

---

## Ti.UI.ScrollView
> A view that contains a horizontally and/or vertically-scrollable region of content.
> Extends Ti.UI.View
> Platforms: both

### Properties (unique: 21/93)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| canCancelEvents | Boolean | both | Determines whether this scroll view can cancel su… |
| contentHeight | Number \| String | both | Height of the scrollable region. |
| contentOffset | Point | both | X and Y coordinates to which to reposition the to… |
| contentWidth | Number \| String | both | Width of the scrollable region. |
| decelerationRate | Number | ios | The deceleration rate of the ScrollView. |
| edgeEffect | Dictionary | ios | Configures the edge effects displayed when the sc… |
| disableBounce | Boolean | ios | Determines whether scroll bounce of the scrollabl… |
| horizontalBounce | Boolean | ios | Determines whether horizontal scroll bounce of th… |
| keyboardDismissMode | Number | ios | The manner in which the keyboard is dismissed whe… |
| maxZoomScale | Number | ios | Maximum scaling factor of the scrollable region a… |
| minZoomScale | Number | ios | Minimum scaling factor of the scrollable region a… |
| overScrollMode | Number | android | Determines the behavior when the user overscolls … |
| refreshControl | Ti.UI.RefreshControl | both | View positioned above the first row that is only … |
| scrollsToTop | Boolean | ios | Controls whether the scroll-to-top gesture is eff… |
| scrollIndicatorStyle | Number | ios | Style of the scrollbar. |
| scrollType | String | android | Limits the direction of the scrollable region, ov… |
| scrollingEnabled | Boolean | both | Determines whether scrolling is enabled for the v… |
| showHorizontalScrollIndicator | Boolean | both | Determines whether the horizontal scroll indicato… |
| showVerticalScrollIndicator | Boolean | both | Determines whether the vertical scroll indicator … |
| verticalBounce | Boolean | ios | Determines whether vertical scroll bounce of the … |
| zoomScale | Number | ios | Scaling factor of the scroll view's content. |


### Methods (5)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| scrollTo(x, y, options) | void | both | Moves the specified coordinate of the scrollable … |
| setContentOffset(contentOffsetXY, animated) | void | ios | Sets the value of the [contentOffset](Titanium.UI… |
| setZoomScale(zoomScale, options) | void | ios | Sets the value of the [zoomScale](Titanium.UI.Scr… |
| scrollToBottom(—) | void | both | Moves the end of the scrollable region into the v… |
| scrollToTop(—) | void | both | Moves the top of the scrollable region into the v… |

### Events (6)
| Event | Platform | Description |
|-------|----------|-------------|
| scale | ios | Fired when the zoom scale factor changes. |
| scroll | both | Fired when the scrollable region is scrolled. |
| dragStart | ios | Fired when the scrollable region starts being dragged. |
| dragEnd | ios | Fired when the scrollable region stops being dragged. |
| dragstart | both | Fired when the scrollable region starts being dragged. |
| dragend | both | Fired when the scrollable region stops being dragged. |

---

## Ti.UI.ScrollableView
> A view that encapsulates a horizontally-scrolling set of child views, known as pages, navigable using its built-in horizontal swipe gestures.
> Extends Ti.UI.View
> Platforms: both

### Properties (unique: 20/91)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| cacheSize | Number | both | Number of pages to cache (pre-render). |
| currentPage | Number | both | Index of the active page. |
| currentPageIndicatorColor | String \| Ti.UI.Color | ios | Color for the current page of the paging control,… |
| disableBounce | Boolean | ios | Determines whether page bouncing effect is disabl… |
| overScrollMode | Number | android | Determines the behavior when the user overscolls … |
| pagingControlColor | String \| Ti.UI.Color | ios | Color of the paging control, as a color name or h… |
| preferredIndicatorImage | String \| Ti.Blob | ios | The preferred image for indicators, defined using… |
| pagingControlHeight | Number | ios | Height of the paging control, in pixels. |
| pageIndicatorColor | String \| Ti.UI.Color | ios | Color of the paging control, as a color name or h… |
| scrollType | String | android | Direction of the ScrollableView (`horizontal` or … |
| showPagingControl | Boolean | both | Determines whether the paging control is visible. |
| pagingControlTimeout | Number | android | Number of milliseconds to wait before hiding the … |
| pagingControlAlpha | Number | ios | Alpha value of the paging control. |
| pagingControlOnTop | Boolean | ios | Determines whether the paging control is displaye… |
| overlayEnabled | Boolean | ios | Determines whether the paging control is added as… |
| scrollingEnabled | Boolean | both | Determines whether scrolling is enabled for the v… |
| views | Array<Titanium.UI.View> | both | Sets the pages within this Scrollable View. |
| clipViews | Boolean | both | Determines whether the previous and next pages ar… |
| hitRect | Dimension | ios | Sets the region where this view responds to gestu… |
| padding | Padding | android | The padding applied to the scrollable view. |


### Methods (7)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| insertViewsAt(position, views) | void | both | Inserts views at the specified position in the [v… |
| addView(view) | void | both | Adds a new page to this Scrollable View. |
| moveNext(—) | void | both | Sets the current page to the next consecutive pag… |
| movePrevious(—) | void | both | Sets the current page to the previous consecutive… |
| removeView(view) | void | both | Removes an existing page from this Scrollable Vie… |
| scrollToView(view) | void | both | Scrolls to the specified page in <Titanium.UI.Scr… |
| setIndicatorImageForPage(image, pageNo) | void | ios | Sets the indicator image for the specified page. |

### Events (10)
| Event | Platform | Description |
|-------|----------|-------------|
| dblclick | ios | Fired when the device detects a double click against the view. |
| doubletap | ios | Fired when the device detects a double tap against this page. |
| longpress | ios | Fired when the device detects a long press against this view. |
| singletap | ios | Fired when the device detects a single tap against this view. |
| touchcancel | ios | Fired when a touch gesture is interrupted by the device. |
| touchstart | ios | Fired as soon as the device detects a touch gesture against this view. |
| twofingertap | ios | Fired when the device detects a two-finger tap against the view. |
| scroll | both | Fired repeatedly as the view is being scrolled. |
| scrollend | both | Fired when the view has stopped moving completely. |
| dragend | android | Fired when the scrolling drag gesture on the view has been completed. |

---

## Ti.UI.ActivityIndicator
> An activity indicator that lets the user know an action is taking place.
> Extends Ti.UI.View
> Platforms: both

### Properties (unique: 12/36)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| bottom | Number \| String | both | Bottom position of the view. |
| height | String | both | Width of the view. Only accepts value of <Titaniu… |
| left | Number \| String | both | Left position of the view. |
| right | Number \| String | both | Right position of the view. |
| top | Number \| String | both | Top position of the view. |
| width | String | both | Width of the view. Only accepts value of <Titaniu… |
| color | String \| Ti.UI.Color | both | Color of the message text, as a color name or hex… |
| font | Font | both | Font used for the message text. |
| indicatorColor | String \| Ti.UI.Color | both | Color of the animated indicator. |
| message | String | both | Message text. |
| messageid | String | both | Key identifying a string in the locale file to us… |
| style | Number | both | The style for the activity indicator. |


### Methods (2)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| hide(options) | void | both | Hides the activity indicator and stops the animat… |
| show(options) | void | both | Shows the activity indicator and starts the anima… |


---

## Ti.UI.ActivityIndicatorStyle
> A set of constants for the styles available for <Titanium.UI.ActivityIndicator> objects.
> Extends Ti.Module
> Platforms: both
> Type: module

### Constants (4)
- **BIG_\***: BIG_DARK
- **OTHER_\***: BIG, DARK, PLAIN




---

## Ti.UI.ProgressBar
> A progress bar.
> Extends Ti.UI.View
> Platforms: both

### Properties (unique: 10/80)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| tintColor | String \| Ti.UI.Color | both | The color shown for the portion of the progress b… |
| animated | Boolean | both | Enables smooth progress change animation when cha… |
| color | String \| Ti.UI.Color | both | Color of the progress bar message, as a color nam… |
| font | Font | ios | Font for the progress bar text. |
| max | Number | both | Maximum value of the progress bar. |
| message | String | both | Progress bar text. |
| trackTintColor | String \| Ti.UI.Color | both | The color shown for the portion of the progress b… |
| min | Number | both | Minimum value of the progress bar. |
| style | Number | ios | Style of the progress bar. |
| value | Number | both | Current value of the progress bar. |




---

## Ti.UI.Slider
> A slider component with a draggable thumb.
> Extends Ti.UI.View
> Platforms: both

### Properties (unique: 25/94)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| tintColor | String \| Ti.UI.Color | both | The color shown for the portion of the progress b… |
| disabledLeftTrackImage | String | ios | Image URL of the slider left track when in the di… |
| disabledRightTrackImage | String | ios | Image URL of the slider right track when in the d… |
| disabledThumbImage | String | ios | Image URL of the slider thumb when in the disable… |
| enabled | Boolean | both | Boolean to indicate the enabled state of the slid… |
| highlightedLeftTrackImage | String | ios | Image URL of the slider left track when in the hi… |
| highlightedRightTrackImage | String | ios | Image URL of the slider right track when in the h… |
| highlightedThumbImage | String | ios | Image URL of the slider thumb when in the highlig… |
| leftTrackImage | String | both | Image URL of the slider left track. |
| leftTrackLeftCap | Number | ios | Size of the left end cap for the leftTrackImage, … |
| leftTrackTopCap | Number | ios | Size of the top end cap for the leftTrackImage, d… |
| max | Number | both | Maximum value of the slider. |
| maxRange | Number | android | Upper limit on the slider value that can be selec… |
| min | Number | both | Minimum value of the slider. |
| minRange | Number | android | Lower limit on the slider value that can be selec… |
| rightTrackImage | String | both | Image URL of the slider right track. |
| rightTrackLeftCap | Number | ios | Size of the left end cap for the rightTrackImage,… |
| rightTrackTopCap | Number | ios | Size of the top end cap for the rightTrackImage, … |
| selectedLeftTrackImage | String | ios | Image URL of the slider left track when in the se… |
| selectedRightTrackImage | String | ios | Image URL of the slider right track when in the s… |
| selectedThumbImage | String | ios | Image URL of the slider thumb when in the selecte… |
| splitTrack | Boolean | android | Separates the thumbImage from the slider track. |
| thumbImage | String \| Ti.Blob | both | Image for the slider thumb. |
| trackTintColor | String \| Ti.UI.Color | both | The color shown for the portion of the progress b… |
| value | Number | both | Current value of the slider. |


### Methods (1)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| setValue(value, options) | void | ios | Sets the [value](Titanium.UI.Slider.value) proper… |

### Events (4)
| Event | Platform | Description |
|-------|----------|-------------|
| click | android | Fired when the device detects a click against the view. |
| change | both | Fired when the value of the slider changes. |
| start | both | Fired when the user starts tracking the slider. |
| stop | both | Fired when the user stops tracking the slider. |

---

## Ti.UI.Switch
> An on/off switch control.
> Extends Ti.UI.View
> Platforms: both

### Properties (unique: 16/86)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| tintColor | String \| Ti.UI.Color | both | The color used to tint the outline of the switch … |
| animated | Boolean | ios | Determines if there is animation when the switch … |
| color | String \| Ti.UI.Color | android | Color to use for switch text, as a color name or … |
| enabled | Boolean | both | Determines whether the switch is enabled. |
| font | Font | android | Font to use for the switch text. |
| style | Number | both | Style of the switch. |
| textAlign | String \| Number | android | Horizontal text alignment of the switch title. |
| title | String | android | Text to display next to the switch, when the chec… |
| titleOff | String | android | Text to display on the switch in its "off" state,… |
| titleOn | String | android | Text to display on the switch in its "on" state, … |
| onThumbColor | String \| Ti.UI.Color | android | — |
| thumbColor | String \| Ti.UI.Color | android | — |
| onTintColor | String \| Ti.UI.Color | both | The color used to tint the appearance of the swit… |
| thumbTintColor | String \| Ti.UI.Color | ios | The color used to tint the appearance of the thum… |
| value | Boolean | both | Indicates whether the switch has been turned on o… |
| verticalAlign | Number \| String | android | Vertical alignment for the text field. |



### Events (2)
| Event | Platform | Description |
|-------|----------|-------------|
| click | android | Fired when the device detects a click against the view. |
| change | both | Fired when the switch value changes. |

---

## Ti.UI.MaskedImage
> A control that displays an image composited with a background image or color.
> Extends Ti.UI.View
> Platforms: both

### Properties (unique: 4/75)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| mask | String | both | Image drawn as the background image. |
| image | String | both | Image drawn as the Foreground image. |
| mode | Number | both | Blend mode to use to combine layers. |
| tint | String \| Ti.UI.Color | both | Color to combine with the image, as a color name … |




---

## Ti.UI.RefreshControl
> The RefreshControl is a representation of the native iOS [UIRefreshControl](https://developer.apple.com/documentation/uikit/uirefreshcontrol) and Android [SwipeRefreshLayout](https://developer.android.com/reference/android/support/v4/widget/SwipeRefreshLayout.html).
> Extends Ti.Proxy
> Platforms: both

### Properties (unique: 4/7)
| Property | Type | Platform | Description |
|----------|------|----------|-------------|
| title | Ti.UI.AttributedString | ios | The attributed title of the control. |
| tintColor | String \| Ti.UI.Color | both | The tint color for the refresh control, as a colo… |
| offset | RefreshControlOffset | android | Offset of the refresh control view. |
| backgroundColor | String \| Ti.UI.Color | ios | The background color for the refresh control, as … |


### Methods (2)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| beginRefreshing(—) | void | both | Tells the control that a refresh operation was st… |
| endRefreshing(—) | void | both | Tells the control that a refresh operation has en… |

### Events (2)
| Event | Platform | Description |
|-------|----------|-------------|
| refreshstart | both | Fired in response to a user initiated an action to refresh the contents of the … |
| refreshend | both | Fired in response to a user finished action to refresh the contents of the tabl… |

---

