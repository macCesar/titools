# Ti.UI Text & Input API Reference

## Ti.UI.TextField
> A single line text field.
> Extends Ti.UI.View
> Platforms: both

| Android | iOS |
| ------- | --- |
| ![Android](./textfield_android.png) | ![iOS](./textfield_ios.png) |

Use the <Titanium.UI.createTextField> method or **`<TextField>`** Alloy element to create a text field.

### `click` event in iOS

In iOS 11+, `click` event in text field is not fired due to changes from apple.
Use `touchstart` event instead of `click` event.

### Properties (unique: 45/116)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| keyboardAppearance | Number | <Titanium.UI.KEYBOARD_APPEARANCE_DEFAULT> | ios | Determines the appearance of the keyboard displayed when this field is focused. |
| attributedString | Ti.UI.AttributedString | — | both | TextField attributed string. |
| attributedHintText | Ti.UI.AttributedString | — | both | Hint text attributed string. |
| autocapitalization | Number | <Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE> | both | Determines how text is capitalized during typing. |
| autocorrect | Boolean | — | both | Determines whether to automatically correct text entered into this text field. |
| autofillType | String | undefined | both | Sets the autofill type for the text field. |
| autoLink | Number | undefined | android | Automatically convert text to clickable links. |
| borderStyle | Number | <Titanium.UI.INPUT_BORDERSTYLE_NONE> (on iOS), <Titanium.UI.INPUT_BORDERSTYLE_FILLED> (on Android) | both | Border style for the field. |
| clearButtonMode | Number | Titanium.UI.INPUT_BUTTONMODE_NEVER | ios | Determines when the clear button is displayed. |
| clearOnEdit | Boolean | false | both | Determines whether the value of this text field should be cleared when it is fo… |
| color | String \| Ti.UI.Color | — | both | Color of the text in this text field, as a color name or hex triplet. |
| editable | Boolean | true | both | Determines whether this field can be edited. |
| ellipsize | Boolean | false | android | Determines whether an ellipsis (`...`) should be used to indicate truncated tex… |
| enableCopy | Boolean | true | both | Determines if user can copy or cut text from the text field. |
| enableReturnKey | Boolean | false | both | Determines whether the return key is enabled automatically when there is text i… |
| focused | Boolean | false | both | Determines whether this TextField has focus. |
| font | Font | — | both | Font to use for text. |
| fullscreen | Boolean | true | android | Leave some space above the keyboard in landscape mode or not. |
| hintText | String | No hint text. | both | Hint text to display when the field is empty. |
| hintTextColor | String \| Ti.UI.Color | The platform's default hint text color. | both | Hint text color to display when the field is empty. |
| hinttextid | String | — | both | Key identifying a string from the locale file to use for the [hintText](Titaniu… |
| hintType | Number | <Titanium.UI.HINT_TYPE_STATIC> | android | Hint type to display on the text field. |
| inputType | Array<Number> | Empty array. If not defined, default is Keyboard type specified by <Titanium.UI.TextField.keyboardType>. | android | Input type to accept in the text field. Also influences the Keyboard type to di… |
| keyboardToolbar | Array<Titanium.UI.View> \| Ti.UI.Toolbar | — | ios | Array of toolbar button objects or a [toolbar](Titanium.UI.Toolbar) to be used … |
| keyboardToolbarColor | String \| Ti.UI.Color | — | ios | Color of the keyboard toolbar if keyboardToolbar is an array, as a color name o… |
| keyboardToolbarHeight | Number | — | ios | Height of the keyboard toolbar if keyboardToolbar is an array. |
| keyboardType | Number | <Titanium.UI.KEYBOARD_TYPE_DEFAULT> | both | Keyboard type to display when this text field is focused. |
| leftButton | Ti.UI.View | — | ios | Left button view to display in the `TextField`. |
| leftButtonMode | Number | <Titanium.UI.INPUT_BUTTONMODE_NEVER> | ios | Determines when to display the left button view. |
| leftButtonPadding | Number | — | ios | Padding between the left button and the edge of the field. |
| minimumFontSize | Number | — | ios | Minimum size of the font when the font is sized based on the contents. Enables … |
| padding | TextFieldPadding | — | both | Sets the padding of this text field. |
| passwordMask | Boolean | false | both | Obscure the input text from the user. |
| passwordRules | String | — | ios | Set password rules that should be used for this text field. |
| returnKeyType | Number | <Titanium.UI.RETURNKEY_DEFAULT> | both | Specifies the text to display on the keyboard `Return` key when this field is f… |
| rightButton | Ti.UI.View | — | ios | Right button view. |
| rightButtonMode | Number | Titanium.UI.INPUT_BUTTONMODE_NEVER | ios | Determines when to display the right button view. |
| rightButtonPadding | Number | — | ios | Padding between the right button and the edge of the field. |
| suppressReturn | Boolean | — | ios | Determines whether the return key should be suppressed during entry. |
| selection | textFieldSelectedParams | — | both | Returns the currently selected text of the text field. |
| showUndoRedoActions | Boolean | true | ios | Determines if the undo and redo buttons on the left side of the keyboard should… |
| textAlign | String \| Number | <Titanium.UI.TEXT_ALIGNMENT_LEFT> | both | Text alignment within this text field. This has no effect on `hintText` when `h… |
| value | String | — | both | Value of this text field, which may be set programmatically and modified by the… |
| verticalAlign | Number \| String | <Titanium.UI.TEXT_VERTICAL_ALIGNMENT_CENTER> | both | Vertical alignment within this text field. |
| maxLength | Number | -1 | both | Maximum length of text field input. |


### Methods (4)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| blur(—) | void | both | Forces the field to lose focus. |
| focus(—) | void | both | Forces the field to gain focus. |
| hasText(—) | Boolean | both | Returns `true` if this text field contains text. |
| setSelection(start, end) | void | both | Selects the text in range (start, end). |

### Events (5)
| Event | Platform | Description |
|-------|----------|-------------|
| focus | android | Fired when the field gains focus. |
| blur | both | Fired when the field loses focus. |
| change | both | Fired when the field value changes. |
| empty | android | Fired when the field is empty and you press backspace key again. |
| return | both | Fired when the return key is pressed on the keyboard. |

### Related Types

#### Font
> An abstract datatype for specifying a text font.

| Property | Type | Description |
|----------|------|-------------|
| fontFamily | String | Specifies the font family or specific font to use. |
| fontSize | Number \| String | Font size, in platform-dependent units. |
| fontWeight | String | Font weight. Valid values are "bold", "semibold", "normal", "thin", "light" and… |
| fontStyle | String | Font style. Valid values are "italic" or "normal". |
| textStyle | String | The text style for the font. |

#### TextFieldPadding
> Dictionary object of parameters for the <Titanium.UI.TextField.padding> that describes the padding. Most notable difference from typical <Padding> is that `top`/`bottom` are only supported on Android.

| Property | Type | Description |
|----------|------|-------------|
| left | Number | Left padding |
| right | Number | Right padding |
| top | Number | Top padding (Android only, since 6.1.0) |
| bottom | Number | Bottom padding (Android only, since 6.1.0) |

#### textFieldSelectedParams
> Dictionary object of parameters for the <Titanium.UI.TextField.selection> property that describes position and length of the selected text.

| Property | Type | Description |
|----------|------|-------------|
| location | Number | Starting position of selected text. |
| length | Number | Number of characters selected. |

---

## Ti.UI.TextArea
> A multiline text field that supports editing and scrolling.
> Extends Ti.UI.View
> Platforms: both

| Android | iOS |
| ------- | --- |
| ![Android](./textarea_android.png) | ![iOS](./textarea_ios.png) |

Use the <Titanium.UI.createTextArea> method or **&lt;TextArea&gt;** Alloy element to create a text area.

### `click` event in iOS

In iOS 11+, `click` event in text area is not fired due to changes from apple.
Use `touchstart` event instead of `click` event.

### Properties (unique: 40/111)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| keyboardAppearance | Number | <Titanium.UI.KEYBOARD_APPEARANCE_DEFAULT> | ios | Determines the appearance of the keyboard displayed when this text area is focu… |
| attributedHintText | Ti.UI.AttributedString | — | both | Hint text attributed string. |
| attributedString | Ti.UI.AttributedString | — | both | TextArea attributed string. |
| autocapitalization | Number | <Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE> | both | Determines how text is capitalized during typing. |
| autocorrect | Boolean | — | both | Determines whether to automatically correct text entered into this text area. |
| autofillType | String | undefined | both | Sets the autofill type for the text area. |
| autoLink | Number | <Titanium.UI.AUTOLINK_NONE> | both | Automatically convert text to clickable links. |
| borderStyle | Number | <Titanium.UI.INPUT_BORDERSTYLE_FILLED> | android | Border style for the text area. |
| clearOnEdit | Boolean | false | android | Determines whether the value of this text area should be cleared when it is foc… |
| color | String \| Ti.UI.Color | — | both | Color of the text in this text area, as a color name or hex triplet. |
| editable | Boolean | true | both | Determines whether this field can be edited. |
| ellipsize | Boolean | false | android | Determines whether an ellipsis (`...`) should be used to indicate truncated tex… |
| enableCopy | Boolean | true | both | Determines if user can copy or cut text from the text area. |
| enableReturnKey | Boolean | false | both | Determines whether the return key is enabled automatically when there is text i… |
| focused | Boolean | false | both | Determines whether this TextArea has focus. |
| font | Font | — | both | Font to use for text. |
| fullscreen | Boolean | true | android | Leave some space above the keyboard in landscape mode or not. |
| hintText | String | No hint text. | android | Hint text to display when the field is empty. |
| hinttextid | String | — | both | Key identifying a string from the locale file to use for the [hintText](Titaniu… |
| hintTextColor | String | Default Android theme's hint text color. | android | Color of hint text that displays when field is empty. |
| hintType | Number | <Titanium.UI.HINT_TYPE_STATIC> | android | Hint type to display on the text field. |
| handleLinks | Boolean | false | ios | Specifies if the text area should allow user interaction with the given URL in … |
| html | String | — | both | Pass a HTML-based string and it will be formatted accordingly. |
| keyboardToolbar | Array<Titanium.UI.View> \| Ti.UI.Toolbar | — | ios | Array of toolbar button objects or a [toolbar](Titanium.UI.Toolbar) to be used … |
| keyboardToolbarColor | String \| Ti.UI.Color | — | ios | Color of the keyboard toolbar if keyboardToolbar is an array, as a color name o… |
| keyboardToolbarHeight | Number | — | ios | Height of the keyboard toolbar if keyboardToolbar is an array. |
| keyboardType | Number | <Titanium.UI.KEYBOARD_DEFAULT> | both | Keyboard type to display when this text area is focused. |
| lines | Number | 1 | android | Number of lines tall the text area height will be, if set. |
| maxLength | Number | -1 | both | Maximum length of text field input. |
| maxLines | Number | -1 | android | Maximum line count of text field input. |
| padding | Padding | — | both | Sets the left and right padding of this TextArea. The text will always be verti… |
| returnKeyType | Number | <Titanium.UI.RETURNKEY_DEFAULT> | ios | Specifies the text to display on the keyboard `Return` key when this text area … |
| scrollsToTop | Boolean | true | ios | Controls whether the scroll-to-top gesture is effective. |
| showUndoRedoActions | Boolean | true | ios | Determines if the undo and redo buttons on the left side of the keyboard should… |
| suppressReturn | Boolean | — | ios | Determines if the return key should be suppressed during text entry. |
| textAlign | String \| Number | <Titanium.UI.TEXT_ALIGNMENT_LEFT> | both | Text alignment within this text area. This has no effect on `hintText` when `hi… |
| value | String | — | both | Value of this text area, which may be set programmatically and modified by the … |
| scrollable | Boolean | true | ios | Determines whether this text area can be scrolled. |
| selection | textAreaSelectedParams | — | both | Returns the currently selected text of the text area. |
| verticalAlign | Number \| String | <Titanium.UI.TEXT_VERTICAL_ALIGNMENT_TOP> | android | Vertical alignment within this text area. |


### Methods (4)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| blur(—) | void | both | Forces this text area to lose focus. |
| focus(—) | void | both | Forces this text area to gain focus. |
| hasText(—) | Boolean | both | Returns `true` if this text area contains text. |
| setSelection(start, end) | void | both | Selects the text in range (start, end). |

### Events (6)
| Event | Platform | Description |
|-------|----------|-------------|
| focus | android | Fired when this text area gains focus. |
| blur | both | Fired when this text area loses focus. |
| change | both | Fired when this text area value changes. |
| link | ios | Fired when user interacts with a URL in the text area. See [handleLinks](Titani… |
| return | both | Fired when the return key is pressed on the keyboard. |
| selected | ios | Fired when text in this text area is selected. |

### Related Types

#### Font
> An abstract datatype for specifying a text font.

| Property | Type | Description |
|----------|------|-------------|
| fontFamily | String | Specifies the font family or specific font to use. |
| fontSize | Number \| String | Font size, in platform-dependent units. |
| fontWeight | String | Font weight. Valid values are "bold", "semibold", "normal", "thin", "light" and… |
| fontStyle | String | Font style. Valid values are "italic" or "normal". |
| textStyle | String | The text style for the font. |

#### Padding
> Dictionary object of parameters for the padding/insets applied to all kinds of views.

| Property | Type | Description |
|----------|------|-------------|
| left | Number | Left padding/inset |
| right | Number | Right padding/inset |
| top | Number | Top padding/inset |
| bottom | Number | Bottom padding/inset |

#### textAreaSelectedParams
> Dictionary object of parameters for the <Titanium.UI.TextArea.selected> event and <Titanium.UI.TextArea.selection> property that describes position and length of the selected text.

| Property | Type | Description |
|----------|------|-------------|
| location | Number | Starting position of selected text. |
| length | Number | Number of characters selected. |

---

## Ti.UI.SearchBar
> A specialized text field for entering search text.
> Extends Ti.UI.View
> Platforms: both

| Android | iOS |
| ------- | --- |
| ![Android](./searchbar_android.png) | ![iOS](./searchbar_ios.png) |

Search bars are most commonly used for filtering the rows in a [TableView](Titanium.UI.TableView) and
[ListView](Titanium.UI.ListView). You can add a search bar to a table view via its
[search](Titanium.UI.TableView.search) property. You can add a search bar to a list view via its
[searchBar](Titanium.UI.SearchBar) property.

A search bar can also be used on its own.

Use the <Titanium.UI.createSearchBar> method or Alloy **`<SearchBar>`** element to create a search bar.

### Android Notes


*(See full overview in titanium-docs)*

### Properties (unique: 23/95)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| autocapitalization | Number | Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE | both | Determines how text is capitalized during typing. |
| autocorrect | Boolean | false | both | Determines whether the text in the search bar is autocorrected during typing. |
| barColor | String \| Ti.UI.Color | System default bar color. | both | Bar color of the search bar view, as a color name or hex triplet. |
| cancelButtonTitle | String | System-localized 'Cancel' | ios | The title of the cancel button when the search bar field is focused. |
| color | String \| Ti.UI.Color | — | both | Color of the text in this text field, as a color name or hex triplet. |
| fieldBackgroundImage | String | — | ios | Background image of the text field, specified as a local file path or URL. |
| fieldBackgroundDisabledImage | String | — | ios | Background image of the text field in disabled state, specified as a local file… |
| focused | Boolean | false | both | Determines whether this SearchBar has focus. |
| hintText | String | On iOS, System-localized 'Search'. On Android and Windows, no hint text. | both | Text to show when the search bar field is not focused. |
| hintTextColor | String \| Ti.UI.Color | The platform's default hint text color. | both | Hint text color to display when the field is empty. |
| hinttextid | String | — | both | Key identifying a string from the locale file to use for the [hintText](Titaniu… |
| iconified | Boolean | undefined | both | Collapses/expands the search view to/from a search icon. |
| iconifiedByDefault | Boolean | false | both | Set true show as a search icon that expands to a search view when tapped on. |
| iconColor | String \| Ti.UI.Color | — | android | Color of the search and close icon. Search icon will only work for `iconified:f… |
| keyboardType | Number | Titanium.UI.KEYBOARD_TYPE_DEFAULT | ios | Keyboard type constant to use when the field is focused. |
| keyboardAppearance | Number | Titanium.UI.KEYBOARD_APPEARANCE_DEFAULT | ios | Determines the appearance of the keyboard to be displayed the field is focused. |
| prompt | String | No prompt. | ios | Single line of text displayed at the top of the search bar. |
| promptid | String | — | ios | Key identifying a string from the locale file to use for the [prompt](Titanium.… |
| showBookmark | Boolean | false | ios | Determines whether the bookmark button is displayed. |
| showCancel | Boolean | false | both | Determines whether the cancel button is displayed. |
| style | Number | Titanium.UI.iOS.SEARCH_BAR_STYLE_PROMINENT | ios | Determines the style of the search bar. |
| value | String | — | both | Value of the search bar. |
| tokens | Array<String> | — | ios | The token of a search text field |


### Methods (5)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| blur(—) | void | both | Causes the search bar to lose focus. |
| focus(—) | void | both | Causes the search bar to gain focus. |
| setShowCancel(showCancel, options) | void | both | Shows or hides the cancel button. |
| insertTokenAtIndex(token, index) | void | ios | Inserts a new search token at the specified index. |
| removeTokenAtIndex(index) | void | ios | Removes an existing token at the specified index. |

### Events (6)
| Event | Platform | Description |
|-------|----------|-------------|
| focus | both | Fired when the search bar gains focus. |
| blur | both | Fired when the search bar loses focus. |
| bookmark | ios | Fired when the bookmark button is pressed. |
| cancel | both | Fired when the cancel button is pressed. |
| change | both | Fired when the value of the search bar changes. |
| return | both | Fired when keyboard search button is pressed. |

### Related Types

#### AnimatedOptions
> A JavaScript object holding an `animated` property. Used for many UI methods as a means of specifying some transition should be animated.

| Property | Type | Description |
|----------|------|-------------|
| animated | Boolean | If `true`, animate a transition for the method/value change. Note that for most… |

#### SearchBarToken
> The search bar token for the <Titanium.UI.SearchBar.insertTokenAtIndex> method.

| Property | Type | Description |
|----------|------|-------------|
| identifier | String | The identifier of the search bar token. |
| text | String | The text of the search bar token (displayed in the search bar). |
| image | String | The image of the search bar token. |

---

## Ti.UI.AttributedString
> An attributed string proxy manages character strings and associated sets of attributes (for example, font and foregroundcolor) that apply to individual characters or ranges of characters in the string.
> Extends Ti.Proxy
> Platforms: both

The AttributedString proxy is created with the <Titanium.UI.createAttributedString> method.

The `text` property must be set initially in the constructor when creating an attributed string.
The [attributes](Titanium.UI.AttributedString.attributes) can either be set in the constructor or after it has been created.

For examples of Attributed Strings, see the
[Attributed Strings guide](https://titaniumsdk.com/guide/Titanium_SDK/Titanium_SDK_How-tos/User_Interface_Deep_Dives/Attributed_Strings.html).

### Properties (unique: 2/5)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| text | String | — | both | The text applied to the attributed string. |
| attributes | Array<Attribute> | — | both | An array of attributes to add. |


### Methods (1)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| addAttribute(attribute) | void | both | Adds an [attribute](Attribute) with the given name and value to the characters … |


### Related Types

#### Attribute
> An abstract datatype for specifying an attributed string attribute.

| Property | Type | Description |
|----------|------|-------------|
| type | Number | Attribute to apply to the text. |
| value | String \| Number \| Ti.UI.Color \| Object \| ParagraphAttribute | Attribute value. |
| range | Array<Number> | Attribute range. |

---

## Ti.UI.Color
> Represents a color used for UI components.
> Extends Ti.Proxy
> Platforms: both

This type may be used on iOS for assignment to any property typically taking a String color value.
A developer is not expected to typically interact with a <Titanium.UI.Color> object, as we generate them
under the hood when converting the passed in String representations. One major exception is use of the


### Methods (1)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| toHex(—) | String | both | Returns a hex string representation of the color (in the RRGGBB or AARRGGBB for… |


---

## Ti.UI.Clipboard
> A module used for accessing clipboard data.
> Extends Ti.Module
> Platforms: both
> Type: module

The Clipboard is a temporary data store, used to save a single item of data that may then
be accessed by the user using UI copy and paste interactions within an app or between apps.

On iOS, the module's `setData()` and `getData()` methods enable multiple representations of the
same data item to be stored together with their respective
[MIME type](http://en.wikipedia.org/wiki/Internet_media_type) to describe their format. For
example, `'text'` and `'text/plain'` for text, and `'image/jpg'` and `'image/png'` for an image.
iOS Will report back the type of data representation in `getItems()` as 
[Universal Type Identifiers](https://developer.apple.com/library/archive/documentation/Miscellaneous/Reference/UTIRef/Articles/System-DeclaredUniformTypeIdentifiers.html).

When working with text, either of the `getData()`/`setData()` methods may be used with a `'text/plain'` type, or
the `getText()`/`hasText()`/`setText()` methods without the need to specify the type.

Android currently only supports text data to be stored.


*(See full overview in titanium-docs)*

### Properties (unique: 3/6)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| name | String | — | ios | Create a new named clipboard. |
| unique | Boolean | — | ios | Create a new clipboard identified by a unique system-generated name. |
| allowCreation | Boolean | — | ios | Create a clipboard identified by name if it doesn't exist. |


### Methods (14)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| clearData(type) | void | both | Deletes data of the specified MIME type stored in the clipboard. If MIME type o… |
| clearText(—) | void | both | Deletes all text data stored in the clipboard. |
| getData(type) | String \| Ti.Blob | both | Gets data of the specified MIME type stored in the clipboard. Returns null if n… |
| getText(—) | String | both | Gets text data stored in the clipboard. |
| hasData(type) | Boolean | both | Indicates whether any data of the specified MIME type is stored in the clipboar… |
| hasText(—) | Boolean | both | Indicates whether any text data is stored in the clipboard. |
| hasURLs(—) | Boolean | ios | Indicates whether any URLs are stored in the clipboard. |
| hasImages(—) | Boolean | ios | Indicates whether any images are stored in the clipboard. |
| hasColors(—) | Boolean | ios | Indicates whether any colors are stored in the clipboard. |
| setData(type, data) | void | both | Stores data of the specified MIME type in the clipboard. |
| setText(text) | void | both | Stores text data in the clipboard. |
| setItems(items) | void | ios | Adds an array of items to a clipboard, and sets privacy options for all include… |
| getItems(—) | Array<Dictionary> | ios | Gets the items that have been specified earlier using <Titanium.UI.Clipboard.se… |
| remove(—) | void | ios | Removes the clipboard. |


### Related Types

#### ClipboardItemsType
> Dictionary describing the items for <Titanium.UI.Clipboard.setItems>.

| Property | Type | Description |
|----------|------|-------------|
| items | Array<Dictionary> | An array of key-value items to add to the clipboard. The key must a valid mime-… |
| options | Dictionary | The privacy options to apply to all the items on the clipboard. The available o… |

---

## Ti.UI.Picker
> A control used to select one or more fixed values.
> Extends Ti.UI.View
> Platforms: both

| Android | iOS |
| ------- | --- |
| ![Android](./picker_android.png) | ![iOS](./picker_ios.png) |

Use the <Titanium.UI.createPicker> method or Alloy **`<Picker>`** element to create a picker control.

On Android, the `useSpinner` property must be enabled to support multiple columns.
By default, the spinner is automatically sized to fit its content and can overflow
to additional spinner rows. The size of the picker can be adjusted with the `width`
and `height` properties, but may omit picker columns or cut off picker rows
if the size is set too small. This property is deprecated. Please use the default
Android native "dropdown" style by not setting `useSpinner` to `true`.

On iOS, the `height` property is only available in iOS 9 and later.
By default, the size of the picker, including its background, is fixed at the

*(See full overview in titanium-docs)*

### Properties (unique: 24/78)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| backgroundColor | String \| Ti.UI.Color | White (iOS), Transparent (Android) | both | Background color of the picker, as a color name or hex triplet. |
| borderStyle | Number | <Titanium.UI.INPUT_BORDERSTYLE_FILLED> | android | Border style to use when picker is shown as a text field or drop-down field. |
| columns | Array<Titanium.UI.PickerColumn> | — | both | Columns used for this picker, as an array of <Titanium.UI.PickerColumn> objects. |
| countDownDuration | Number | — | ios | Duration in milliseconds used for a Countdown Timer picker. |
| dateTimeColor | String \| Ti.UI.Color | black | ios | Sets the text color of date- and time-pickers. |
| overrideUserInterfaceStyle | Number | Titanium.UI.USER_INTERFACE_STYLE_UNSPECIFIED | both | Forces the picker to used assigned theme instead of the system theme. |
| format24 | Boolean | false | android | Determines whether the Time pickers display in 24-hour or 12-hour clock format. |
| hintText | String | undefined | android | Text to be shown above date/time when picker is shown as a text field or drop-d… |
| locale | String | System Settings | android | Locale used when displaying Date and Time picker values. |
| maxDate | Date | — | both | Maximum date displayed when a Date picker is in use. |
| minDate | Date | — | both | Minimum date displayed when a Date picker is in use. |
| minuteInterval | Number | 1 | ios | Interval in minutes displayed when one of the Time types of pickers is in use. |
| selectionIndicator | Boolean | true | android | Determines whether the visual selection indicator is shown. |
| selectionOpens | Boolean | false (Android) | android | Determines whether calling the method `setSelectedRow` opens when called |
| textAlign | String \| Number | <Titanium.UI.TEXT_ALIGNMENT_LEFT>, | android | Horizontal text alignment of the date picker when using <Titanium.UI.PICKER_TYP… |
| datePickerStyle | Number | <Titanium.UI.DATE_PICKER_STYLE_AUTOMATIC> | both | Determines how a date or time picker should appear. |
| type | Number | <Titanium.UI.PICKER_TYPE_PLAIN> | both | Determines the type of picker displayed |
| useSpinner | Boolean | false | android | Determines if a multi-column spinner or single column drop-down picker should b… |
| nativeSpinner | Boolean | false | android | Determines if a multi-column spinner or single column drop-down picker should b… |
| value | Date | — | both | Date and time value for Date and Time pickers. |
| visibleItems | Number | 5 | android | Number of visible rows to display. This is only applicable to a plain picker an… |
| calendarViewShown | Boolean | false | android | Determines whether the calenderView is visible. |
| font | Font | — | android | Font to use for text. |
| color | String \| Ti.UI.Color | — | android | Text color of the Picker |


### Methods (7)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| add(data) | void | both | Adds rows or columns to the picker. |
| getSelectedRow(index) | Ti.UI.PickerRow | both | Gets the selected row for a column, or `null` if none exists. |
| reloadColumn(column) | void | ios | Repopulates values for a column. |
| setSelectedRow(column, row, animated) | void | both | Selects a column's row. |
| setValue(date) | Ti.UI.PickerRow | ios | Sets the date and time value property for Date pickers. |
| showDatePickerDialog(dictObj) | void | android | Shows Date picker as a modal dialog. |
| showTimePickerDialog(dictObj) | void | android | Shows Time picker as a modal dialog. |

### Events (2)
| Event | Platform | Description |
|-------|----------|-------------|
| click | android | Fired when the device detects a click against the view. |
| change | both | Fired when the value of any column's row is changed. |

### Related Types

#### Font
> An abstract datatype for specifying a text font.

| Property | Type | Description |
|----------|------|-------------|
| fontFamily | String | Specifies the font family or specific font to use. |
| fontSize | Number \| String | Font size, in platform-dependent units. |
| fontWeight | String | Font weight. Valid values are "bold", "semibold", "normal", "thin", "light" and… |
| fontStyle | String | Font style. Valid values are "italic" or "normal". |
| textStyle | String | The text style for the font. |

---

## Ti.UI.PickerColumn
> A picker column, representing a selectable group of items in a <Titanium.UI.Picker>.
> Extends Ti.UI.View
> Platforms: both

Use the <Titanium.UI.createPickerColumn> method to create a picker column control. In an Alloy application,
you can use a **`<PickerColumn>`** element inside a `<Picker>` element. You can also use `<Column>`
as a shorthand for `<PickerColumn>` (see Examples).

On Android, the `useSpinner` property must be enabled to support multiple columns.

See <Titanium.UI.Picker> for further examples of usage.

### Properties (unique: 3/11)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| rowCount | Number | — | both | Number of rows in this column. |
| rows | Array<Titanium.UI.PickerRow> | — | both | Rows of this column. |
| font | Font | — | android | Font to use for text. |


### Methods (2)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| addRow(row) | void | both | Adds a row to this column. |
| removeRow(row) | void | both | Removes a row from this column. |


### Related Types

#### Font
> An abstract datatype for specifying a text font.

| Property | Type | Description |
|----------|------|-------------|
| fontFamily | String | Specifies the font family or specific font to use. |
| fontSize | Number \| String | Font size, in platform-dependent units. |
| fontWeight | String | Font weight. Valid values are "bold", "semibold", "normal", "thin", "light" and… |
| fontStyle | String | Font style. Valid values are "italic" or "normal". |
| textStyle | String | The text style for the font. |

---

## Ti.UI.PickerRow
> A picker row, representing a selectable item in a <Titanium.UI.Picker>.
> Extends Ti.UI.View
> Platforms: both

Use the <Titanium.UI.createPickerRow> method to create a picker row control. In an Alloy application,
you can use a **`<PickerRow>`** element inside a `<PickerColumn>` element. You can also use `<Row>`
as a shorthand for `<PickerRow>` (see Examples).

Views added to picker rows is only supported on iOS.

### Properties (unique: 3/75)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| color | String \| Ti.UI.Color | — | both | Color of the item text, as a color name or hex triplet. |
| font | Font | — | ios | Font to use for the item text. |
| title | String | — | both | Item text. |


### Methods (1)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| add(view) | void | ios | Adds a child view to this picker row, to provide a custom row. |


### Related Types

#### Font
> An abstract datatype for specifying a text font.

| Property | Type | Description |
|----------|------|-------------|
| fontFamily | String | Specifies the font family or specific font to use. |
| fontSize | Number \| String | Font size, in platform-dependent units. |
| fontWeight | String | Font weight. Valid values are "bold", "semibold", "normal", "thin", "light" and… |
| fontStyle | String | Font style. Valid values are "italic" or "normal". |
| textStyle | String | The text style for the font. |

---

