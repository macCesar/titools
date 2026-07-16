# Ti.UI Lists & Tables API Reference

## Ti.UI.ListView
> A list view is used to present information, organized in to sections and items, in a vertically-scrolling view.
> Extends Ti.UI.View
> Platforms: both

| Android | iOS |
| ------- | --- |
| ![Android](./listview_android.png) | ![iOS](./listview_ios.png) |

Use the <Titanium.UI.createListView> method or **`<ListView>`** Alloy element to create a `ListView`.

A `ListView` object is a container for [ListSection](Titanium.UI.ListSection)
objects that are, in turn, containers for [ListItem](Titanium.UI.ListItem) objects. This is
easily visualized as an Alloy view:

``` xml

### Properties (unique: 54/122)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| touchFeedback | Boolean | true | android | A material design visual construct that provides an instantaneous visual confir… |
| allowsSelection | Boolean | true | ios | Determines whether this item can be selected. |
| canScroll | Boolean | true | both | Determines if the list view can scroll in response to user actions. |
| contentOffset | Point | — | android | X and Y coordinates to which to reposition the top-left point of the content re… |
| disableBounce | Boolean | false | ios | Determines whether the scroll-bounce of the list view should be disabled. |
| editing | Boolean | false | both | Determines if the list view is currently in editing mode. |
| requiresEditingToMove | Boolean | true | both | Determines if the list view should allow drag-and-drop even without going into … |
| fastScroll | Boolean | false | android | Sets the fastScroll mode on Android ListViews. |
| fixedSize | Boolean | false | android | Sets fixedSize mode on Android ListViews. |
| allowsSelectionDuringEditing | Boolean | false | both | Determines whether this list view items can be selected while editing the table. |
| allowsMultipleSelectionDuringEditing | Boolean | false | both | Determines whether multiple items of this list view can be selected at the same… |
| allowsMultipleSelectionInteraction | Boolean | false | both | Allows a two-finger pan gesture to automatically transition the table view into… |
| lazyLoadingEnabled | Boolean | true | ios | Determines if the list view should use lazy loading to load remote images. |
| pruneSectionsOnEdit | Boolean | false | ios | Determines if empty sections are retained when the user completes editing the l… |
| templates | Dictionary | — | both | Contain key-value pairs mapping a style name (key) to an <ItemTemplate> (value). |
| sections | Array<Titanium.UI.ListSection> | — | both | Sections of this list. |
| defaultItemTemplate | String \| Number | Titanium.UI.LIST_ITEM_TEMPLATE_DEFAULT | both | Sets the default template for list data items that do not specify the `template… |
| separatorHeight | String \| Number | — | android | height of the ListView separator. |
| footerDividersEnabled | Boolean | undefined but behaves as false | android | When set to false, the ListView will not draw the divider before the footer vie… |
| footerTitle | String | — | both | List view footer title. |
| footerView | Ti.UI.View | — | both | List view footer as a view that will be rendered instead of a label. |
| headerDividersEnabled | Boolean | undefined but behaves as false | android | When set to false, the ListView will not draw the divider after the header view. |
| headerTitle | String | — | both | List view header title. |
| headerView | Ti.UI.View | — | both | List view header as a view that will be rendered instead of a label. |
| pullView | Ti.UI.View | — | ios | View positioned above the first row that is only revealed when the user drags t… |
| refreshControl | Ti.UI.RefreshControl | — | both | View positioned above the first row that is only revealed when the user drags t… |
| searchView | Ti.UI.SearchBar \| Ti.UI.Android.SearchView | — | both | Search field to use for the list view. |
| searchText | String | — | both | The string to use as the search parameter. |
| caseInsensitiveSearch | Boolean | true | both | Determines if the search performed is case insensitive. |
| continuousUpdate | Boolean | false | both | Determines if the scrolling event should fire every time there is a new visible… |
| forceUpdates | Boolean | false | both | Optimize the `continuousUpdate` scrolling event. |
| keepSectionsInSearch | Boolean | false | ios | Determines if the section information is displayed in the search results when u… |
| keyboardDismissMode | Number | Undefined (behaves like <Titanium.UI.iOS.KEYBOARD_DISMISS_MODE_NONE>) | ios | The manner in which the keyboard is dismissed when a drag begins in the list vi… |
| sectionIndexTitles | Array<ListViewIndexEntry> | — | ios | Array of objects (with `title` and `index` properties) to control the list view… |
| scrollIndicatorStyle | Number | <Titanium.UI.iOS.ScrollIndicatorStyle.DEFAULT> | ios | Style of the scrollbar. |
| willScrollOnStatusTap | Boolean | true | ios | Controls the scroll-to-top gesture. |
| sectionCount | Number | — | both | Number of sections in this list view. |
| sectionHeaderTopPadding | Number | — | ios | Padding above each section header. |
| showSelectionCheck | Boolean | true | android | Determines whether the selection checkmark is displayed on selected items. |
| showVerticalScrollIndicator | Boolean | true | both | Determines whether this list view displays a vertical scroll indicator. |
| separatorColor | String \| Ti.UI.Color | platform-specific default color | both | Separator line color between items, as a color name or hex triplet. |
| separatorInsets | HorizontalInsets | — | ios | The insets for list view separators (applies to all cells). |
| separatorStyle | Number | — | both | Separator style constant. |
| style | Number | Titanium.UI.iOS.ListViewStyle.PLAIN | ios | Style of the list view. |
| tableSeparatorInsets | HorizontalInsets | — | ios | The insets for the table view header and footer. |
| listSeparatorInsets | HorizontalInsets | — | ios | The insets for the list view header and footer. |
| rowSeparatorInsets | HorizontalInsets | — | ios | The insets for list view cells (applies to all cells). |
| dimBackgroundForSearch | Boolean | true | ios | A Boolean indicating whether the underlying content is dimmed during a search. |
| showSearchBarInNavBar | Boolean | false | ios | A Boolean indicating whether search bar will be in navigation bar. |
| resultsBackgroundColor | String \| Ti.UI.Color | undefined (behaves as white) | ios | The background color of the search results (iOS-only). |
| resultsSeparatorColor | String \| Ti.UI.Color | undefined (behaves as gray) | ios | Separator line color between rows inside search results, as a color name or hex… |
| resultsSeparatorStyle | Number | — | ios | The separator style of the search results (iOS-only). |
| resultsSeparatorInsets | HorizontalInsets | — | ios | The insets for search results separators (applies to all cells & iOS-only). |
| selectedItems | Array<ListItemEventType> | — | both | Returns the selected list view items. |


### Methods (11)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| scrollToItem(sectionIndex, itemIndex, animation) | void | both | Scrolls to a specific item. |
| deselectItem(sectionIndex, itemIndex) | void | ios | Deselects a specific item. |
| appendSection(section, animation) | void | both | Appends a single section or an array of sections to the end of the list. |
| deleteSectionAt(sectionIndex, animation) | void | both | Deletes an existing section. |
| insertSectionAt(sectionIndex, section, animation) | void | both | Inserts a section or an array of sections at a specific index. |
| replaceSectionAt(sectionIndex, section, animation) | void | both | Replaces an existing section. |
| selectItem(sectionIndex, itemIndex) | void | ios | Selects an item in the list using the specified item and section indices. |
| setContentInsets(edgeInsets, options) | void | ios | Sets this list view's content insets. |
| setContentOffset(contentOffset, options) | void | both | Sets the value of the content offset of the list view without animation by defa… |
| setMarker(markerProps) | void | both | Sets a reference item in the list view. |
| addMarker(markerProps) | void | both | Adds a reference item in the list view. |

### Events (20)
| Event | Platform | Description |
|-------|----------|-------------|
| indexclick | ios | Fired when the index bar is clicked by the user. |
| itemclick | both | Fired when a list row is clicked by the user. |
| itemsselected | both | Fired when user stops two-pan gesture interaction for selecting multiple items.… |
| delete | both | Fired when a list row is deleted by the user. |
| insert | ios | Fired when a list row is inserted by the user. |
| dragstart | ios | Fired when the user starts dragging the list view. |
| dragend | ios | Fired when the user stops dragging the list view. |
| marker | both | Fired when the list view displays the reference item. |
| movestart | both | Fired when a list row has started moving. |
| moveend | both | Fired when a list row has ended moving. |
| move | both | Fired when a list row is moved to a different location by the user. |
| noresults | both | Fired when the search using either [searchView](Titanium.UI.ListView.searchView… |
| pull | ios | Fired when the user drags the list view past the top edge of the [pullView](Tit… |
| prefetch | ios | Fired when new list items are prefetched. The items are ordered ascending by ge… |
| cancelprefetch | ios | Fired when list items that previously were considered as candidates for pre-fet… |
| pullend | ios | Fired when the user stops dragging the list view and the [pullView](Titanium.UI… |
| editaction | ios | Fired when the user interacts with one of the custom edit actions defined by <T… |
| scrollstart | both | Fires when the list view starts scrolling by user interaction. Calling the `scr… |
| scrollend | both | Fires when the list view ends scrolling. Calling the `scrollTo` methods will no… |
| scrolling | both | Fires when the list view is scrolling. Calling the `scrollTo` methods will not … |

### Related Types

#### AnimatedOptions
> A JavaScript object holding an `animated` property. Used for many UI methods as a means of specifying some transition should be animated.

| Property | Type | Description |
|----------|------|-------------|
| animated | Boolean | If `true`, animate a transition for the method/value change. Note that for most… |

#### AnimatedWithDurationOptions
> A JavaScript object holding `animated` and `duration` properties. Used on iOS For [TableView](Titanium.UI.TableView) and [ListView](Titanium.UI.ListView) content offset transitions.

| Property | Type | Description |
|----------|------|-------------|
| animated | Boolean | If `true`, animate a transition for the method/value change. Note that for most… |
| duration | Number | The duration in `milliseconds` for animation |

#### Dictionary
> Plain JavaScript object.

*Plus 6 more types: ListViewMarkerProps, Padding, Point, SelectedItem*

---

## Ti.UI.ListItem
> A list item is an individual item in a list section.
> Extends Ti.Proxy
> Platforms: both

A list item is a combination of a <ListDataItem> and <ItemTemplate>.  The list data item
represents the actual data, while the item template represents the style elements of the item.

You should not create `ListItem` objects with a JavaScript factory method, as you do other Titanium proxies.
Instead, you should pass a <ListDataItem> array to the `setItems` method of a `ListSection`. The list data items
contain the data you want to display in the list.

Alloy applications can use **`<ListItem>`** elements to create `ListItem` objects. `<ListItem>` elements
must be nested inside a **`<ListSection>`** element, which itself is nested in a `<ListView>` element,
as shown below:

``` xml

### Properties (unique: 26/28)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| itemId | String | — | both | A user defined string that gets passed to events. |
| accessoryType | Number | Titanium.UI.LIST_ACCESSORY_TYPE_NONE | both | Sets an accessory on the right side of an item. |
| backgroundColor | String \| Ti.UI.Color | Transparent | both | Background color of the view, as a color name or hex triplet. |
| backgroundImage | String | — | both | Background image to render when the item is not selected. |
| backgroundGradient | Gradient | — | both | Background gradient to render when the item is not selected. |
| backgroundSelectedColor | String \| Ti.UI.Color | transparent | both | Background color of the view, as a color name or hex triplet when item is selec… |
| backgroundSelectedImage | String | — | both | Background image to render when the item is selected. |
| backgroundSelectedGradient | Gradient | — | ios | Background gradient to render when the item is selected. |
| selectedBackgroundColor | String \| Ti.UI.Color | transparent | both | Background color of the view, as a color name or hex triplet when item is selec… |
| selectedBackgroundImage | String | — | both | Background image to render when the item is selected. |
| selectedBackgroundGradient | Gradient | — | ios | Background gradient to render when the item is selected. |
| canEdit | Boolean | false | both | Specifies if the item can be deleted by a user initiated action. |
| canInsert | Boolean | false | ios | Specifies if the item can be inserted by a user initiated action. |
| canMove | Boolean | false | both | Specifies if the item can be reordered within the list view by a user initiated… |
| editActions | Array<RowActionType> | — | ios | Specifies custom action items to be shown when when a list item is edited. |
| searchableText | String | — | both | The text to match against when the [ListView](Titanium.UI.ListView) is performi… |
| color | String \| Ti.UI.Color | — | both | Default text color of the item when not selected, as a color name or hex triple… |
| subtitleColor | String \| Ti.UI.Color | — | ios | Default text color of the subtitle, as a color name or hex triplet. |
| selectedColor | String \| Ti.UI.Color | — | ios | Color to use for the item title when the item is selected, as a color name or h… |
| selectedSubtitleColor | String \| Ti.UI.Color | — | ios | Color to use for the item subtitle when the item is selected, as a color name o… |
| font | Font | System default font. | both | Font to use for the item title. |
| height | Number \| String | — | both | Row height in platform-specific units. |
| image | String | — | both | Image to render in the image area of the item, specified as a local path or URL. |
| title | String | — | both | Title to set in the text area of the item. |
| selectionStyle | Number | — | both | Selection style constant to control the selection color. |
| subtitle | String | — | ios | Subtitle to set in the text area of the item. |




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

#### Gradient
> A simple object defining a color gradient.

| Property | Type | Description |
|----------|------|-------------|
| type | String | Type of gradient, either 'linear' or 'radial'. |
| startPoint | Point | Start point for the gradient. |
| endPoint | Point | End point for the gradient. |
| startRadius | Number | For a radial gradient, the radius at the `startPoint`. |
| endRadius | Number | For a radial gradient, the radius at the `endPoint`. |
| colors | Array<String> \| Array<GradientColorRef> | An array of colors, as a color name or hex triplet. |
| backfillStart | Boolean | Set to `true` to continue filling with the starting color beyond the `startPoin… |
| backfillEnd | Boolean | Set to `true` to continue filling with the final color beyond the `endPoint`. |

---

## Ti.UI.ListSection
> A list section is a container within a list view used to organize list items.
> Extends Ti.Proxy
> Platforms: both

Use the <Titanium.UI.createListSection> method or **`<ListSection>`** Alloy element to create a `ListSection`.

List sections are used to manipulate and organize list items contained within it. For examples 
of using list sections, see the examples in <Titanium.UI.ListView> and <Titanium.UI.ListItem>.

### Properties (unique: 7/9)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| footerTitle | String | — | both | Title of this section footer. |
| footerView | Ti.UI.View | — | both | View to use for this section footer. |
| headerTitle | String | — | both | Title of this section header. |
| headerView | Ti.UI.View | — | both | View to use for this section header. |
| items | Array<ListDataItem> | — | both | Items of this list section. |
| itemCount | Number | — | both | Returns the item count of the section. |
| filteredItemCount | Number | — | android | Returns the item count of the section, also incorporating the search filter if … |


### Methods (7)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| setItems(dataItems, animation) | void | both | Sets the data entries in the list section. |
| appendItems(dataItems, animation) | void | both | Appends the data entries to the end of the list section. |
| insertItemsAt(itemIndex, dataItems, animation) | void | both | Inserts data entries to the list section at the specified index. |
| replaceItemsAt(index, count, dataItems, animation) | void | both | Removes count entries from the list section at the specified index, then insert… |
| deleteItemsAt(itemIndex, count, animation) | void | both | Removes count entries from the list section at the specified index. |
| getItemAt(itemIndex) | ListDataItem | both | Returns the item entry from the list view at the specified index. |
| updateItemAt(index, dataItem, animation) | void | both | Updates an item at the specified index. |


### Related Types

#### ListDataItem
> Represents displayed item data.

| Property | Type | Description |
|----------|------|-------------|
| template | String \| Number | Template ID configured with the <Titanium.UI.ListView.templates> property or <T… |
| properties | Dictionary<Titanium.UI.ListItem> | Contains key-value pairs of view properties and their values that are applied t… |

#### ListViewAnimationProperties
> A simple object for specifying the animation properties to use when inserting or deleting sections or cells, or scrolling the list.

| Property | Type | Description |
|----------|------|-------------|
| animated | Boolean | Whether this list change should be animated. Ignored if any `animationStyle` va… |
| animationStyle | Number | Type of animation to use for cell insertions and deletions. |
| position | Number | Specifies what position to scroll the selected cell to. |

---

## Ti.UI.ListViewScrollPosition
> A set of constants for the position value that can be used for the `position` property of <ListViewAnimationProperties> when invoking the ListView's `scrollToItem`, `appendSection`, `deleteSectionAt`, `insertSectionAt` and `replaceSectionAt` methods.
> Extends Ti.Proxy
> Platforms: both

### Constants (4)
- **OTHER_\***: BOTTOM, MIDDLE, NONE, TOP




---

## Ti.UI.TableView
> A table view is used to present information, organized in sections and rows, in a vertically-scrolling view.
> Extends Ti.UI.View
> Platforms: both

| Android | iOS |
| ------- | --- |
| ![Android](./tableview_android.png) | ![iOS](./tableview_ios.png) |

A `TableView` object is a container for [TableViewSection](Titanium.UI.TableViewSection)
objects that are, in turn, containers for [TableViewRow](Titanium.UI.TableViewRow) objects.

Use the <Titanium.UI.createTableView> method or **`<TableView>`** Alloy element to create a `TableView`.

Also see the [TableViews guide](https://titaniumsdk.com/guide/Titanium_SDK/Titanium_SDK_How-tos/User_Interface_Deep_Dives/TableViews.html).

### Creating Tables

There are few approaches to creating and using `TableView` object.


*(See full overview in titanium-docs)*

### Properties (unique: 55/122)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| backgroundColor | String \| Ti.UI.Color | transparent on non-iOS platforms, white on the iOS platform | both | Background color of the view, as a color name or hex triplet. |
| touchFeedback | Boolean | true | android | A material design visual construct that provides an instantaneous visual confir… |
| allowsSelection | Boolean | true | ios | Determines whether this table's rows can be selected. |
| allowsSelectionDuringEditing | Boolean | false | both | Determines whether this table's rows can be selected while editing the table. |
| contentOffset | Point | — | android | X and Y coordinates to which to reposition the top-left point of the content re… |
| data | Array<Titanium.UI.TableViewRow> \| Array<Titanium.UI.TableViewSection> | — | both | Rows of the table view. |
| editable | Boolean | Depends on `editing` and `moving` mode | both | Determines the rows' default editable behavior, which allows them to be deleted… |
| editing | Boolean | false | both | Determines whether row editing mode is active. |
| filterAttribute | String | — | both | Filter attribute to be used when searching. |
| filterAnchored | Boolean | false | both | Determines whether the search is limited to the start of the string |
| filterCaseInsensitive | Boolean | true | both | Determines whether the search is case insensitive. |
| fixedSize | Boolean | false | android | Sets fixedSize mode on Android TableView. |
| footerDividersEnabled | Boolean | undefined but behaves as false | android | When set to false, the ListView will not draw the divider before the footer vie… |
| footerTitle | String | — | both | Table view footer title. |
| maxClassname | Number | 32 | android | Max number of row class names. |
| headerPullView | Ti.UI.View | — | ios | View positioned above the first row that is only revealed when the user drags t… |
| refreshControl | Ti.UI.RefreshControl | — | both | View positioned above the first row that is only revealed when the user drags t… |
| hideSearchOnSelection | Boolean | true | ios | Determines whether the search field should hide on completion. |
| allowsMultipleSelectionDuringEditing | Boolean | false | both | Determines whether multiple items of this table view can be selected at the sam… |
| allowsMultipleSelectionInteraction | Boolean | false | ios | Allows a two-finger pan gesture to automatically transition the table view into… |
| footerView | Ti.UI.View | — | both | Table view footer as a view that will be rendered instead of a label. |
| headerDividersEnabled | Boolean | undefined but behaves as false | android | When set to false, the ListView will not draw the divider after the header view. |
| headerTitle | String | — | both | Table view header title. |
| headerView | Ti.UI.View | — | both | Table view header as a view that will be rendered instead of a label. |
| index | Array<TableViewIndexEntry> | — | ios | Array of objects (with `title` and `index` properties) to control the table vie… |
| maxRowHeight | Number | — | both | Maximum row height for table view rows. |
| minRowHeight | Number | — | both | Minimum row height for table view rows. |
| moveable | Boolean | Depends on `editing` and `moving` mode | both | Determines the rows' default moveable behavior, which allows them to be re-orde… |
| moving | Boolean | false | both | Determines whether row moving mode is active. |
| overScrollMode | Number | Titanium.UI.Android.OVER_SCROLL_ALWAYS | android | Determines the behavior when the user overscrolls the view. |
| rowHeight | Number | — | both | Default row height for table view rows. |
| scrollable | Boolean | true | both | If `true`, the table view can be scrolled. |
| scrollIndicatorStyle | Number | <Titanium.UI.iOS.ScrollIndicatorStyle.DEFAULT> | ios | Style of the scrollbar. |
| scrollsToTop | Boolean | true | ios | Controls whether the scroll-to-top gesture is effective. |
| search | Ti.UI.SearchBar \| Ti.UI.Android.SearchView | — | both | Search field to use for the table view. |
| dimBackgroundForSearch | Boolean | true | ios | A Boolean indicating whether the underlying content is dimmed during a search. |
| keyboardDismissMode | Number | Undefined (behaves like <Titanium.UI.iOS.KEYBOARD_DISMISS_MODE_NONE>) | ios | The manner in which the keyboard is dismissed when a drag begins in the table v… |
| showSearchBarInNavBar | Boolean | false | ios | A Boolean indicating whether search bar will be in navigation bar. |
| searchAsChild | Boolean | true | android | Determines whether the [SearchBar](Titanium.UI.SearchBar) or [SearchView](Titan… |
| searchHidden | Boolean | false (search field visible) | ios | Determines whether the search field is visible. |
| sectionCount | Number | — | both | Number of sections in this table view. |
| sections | Array<Titanium.UI.TableViewSection> | — | both | Sections of this table. |
| sectionHeaderTopPadding | Number | — | ios | Padding above each section header. |
| separatorColor | String \| Ti.UI.Color | platform-specific default color | both | Separator line color between rows, as a color name or hex triplet. |
| separatorInsets | HorizontalInsets | — | ios | The insets for table view separators (applies to all cells). |
| tableSeparatorInsets | HorizontalInsets | — | ios | The insets for the table view header and footer. |
| rowSeparatorInsets | HorizontalInsets | — | ios | The insets for table view cells (applies to all cells). |
| separatorStyle | Number | — | both | Separator style constant. |
| showSelectionCheck | Boolean | true | android | Determines whether the selection checkmark is displayed on selected rows. |
| showVerticalScrollIndicator | Boolean | true | ios | Determines whether this table view displays a vertical scroll indicator. |
| style | Number | — | ios | Style of the table view, specified using one of the constants from <Titanium.UI… |
| resultsBackgroundColor | String \| Ti.UI.Color | undefined (behaves as white) | ios | The background color of the search results (iOS-only). |
| resultsSeparatorColor | String \| Ti.UI.Color | undefined (behaves as gray) | ios | Separator line color between rows inside search results, as a color name or hex… |
| resultsSeparatorStyle | Number | — | ios | The separator style of the search results (iOS-only). |
| resultsSeparatorInsets | HorizontalInsets | — | ios | The insets for search results separators (applies to all cells & iOS-only). |


### Methods (18)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| appendRow(row, animation) | void | both | Appends a single row or an array of rows to the end of the table. |
| appendSection(section, animation) | void | both | Appends a single section or an array of sections to the end of the table. |
| deleteRow(row, animation) | void | both | Deletes an existing row. |
| deleteSection(section, animation) | void | both | Deletes an existing section. |
| deselectRow(row) | void | ios | Programmatically deselects a row. |
| insertRowAfter(index, row, animation) | void | both | Inserts a row after another row. |
| insertSectionAfter(index, section, animation) | void | both | Inserts a section after another section. |
| insertRowBefore(index, row, animation) | void | both | Inserts a row before another row. |
| insertSectionBefore(index, section, animation) | void | both | Inserts a section before another section. |
| scrollToIndex(index, animation) | void | both | Scrolls the table view to ensure that the specified row is on screen. |
| scrollToTop(top, animation) | void | both | Scrolls the table to a specific top position where 0 is the topmost y position … |
| setContentInsets(edgeInsets, options) | void | ios | Sets this tableview's content insets. |
| setContentOffset(contentOffset, options) | void | both | Sets the value of the content offset of the table view without animation by def… |
| selectRow(row) | void | both | Programmatically selects a row. In Android, it sets the currently selected item… |
| setData(data, animation) | void | both | Sets the data in the table. |
| setHeaderPullView(view) | void | ios | Sets the value of the [Titanium.UI.TableView.headerPullView] property. |
| updateRow(index, row, animation) | void | both | Updates an existing row, optionally with animation. |
| updateSection(index, section, animation) | void | both | Updates an existing section, optionally with animation. |

### Events (18)
| Event | Platform | Description |
|-------|----------|-------------|
| click | both | Fired when a table row is clicked by the user. |
| doubletap | both | Fired when the device detects a double tap against this view. |
| longpress | both | Fired when the device detects a long press. |
| singletap | both | Fired when the device detects a single tap against the view. |
| swipe | both | Fired when the device detects a swipe gesture (left or right) against the view. |
| touchcancel | ios | Fired when a touch gesture is interrupted by the device. |
| touchend | both | Fired when a touch gesture is complete. |
| touchstart | both | Fired as soon as the device detects a touch gesture against this view. |
| twofingertap | ios | Fired when the device detects a two-finger tap against the view. |
| rowsselected | both | Fired when user stops two-pan gesture interaction for selecting multiple rows. … |
| delete | both | Fired when a table row is deleted by the user. |
| indexclick | ios | Fired when the index bar is clicked by the user. |
| move | both | Fired when a table row is moved by the user. |
| scroll | both | Fired when the table view is scrolled. |
| scrollend | both | Fired when the table view stops scrolling. |
| dragstart | ios | Fired when the scrollable region starts being dragged. |
| dragend | ios | Fired when the scrollable region stops being dragged. |
| editaction | ios | Fired when the user interacts with one of the custom edit actions defined by <T… |

### Related Types

#### AnimatedOptions
> A JavaScript object holding an `animated` property. Used for many UI methods as a means of specifying some transition should be animated.

| Property | Type | Description |
|----------|------|-------------|
| animated | Boolean | If `true`, animate a transition for the method/value change. Note that for most… |

#### AnimatedWithDurationOptions
> A JavaScript object holding `animated` and `duration` properties. Used on iOS For [TableView](Titanium.UI.TableView) and [ListView](Titanium.UI.ListView) content offset transitions.

| Property | Type | Description |
|----------|------|-------------|
| animated | Boolean | If `true`, animate a transition for the method/value change. Note that for most… |
| duration | Number | The duration in `milliseconds` for animation |

#### HorizontalInsets
> Dictionary object of parameters for horizontal-only insets applied to [Table](Titanium.UI.TableView) and [List](Titanium.UI.ListView) views. Only `left` and `right` properties are used (see <Padding>).

| Property | Type | Description |
|----------|------|-------------|
| left | Number | Left padding/inset |
| right | Number | Right padding/inset |

*Plus 5 more types: SelectedRowObject, Size, TableViewAnimationProperties*

---

## Ti.UI.TableViewRow
> A table view row is an individual item in a table, organized into table view sections.
> Extends Ti.UI.View
> Platforms: both

Use the <Titanium.UI.createTableViewRow> method or **`<TableViewRow>`** Alloy element to create
a table view row.

These may be explicitly added to [TableViewSection](Titanium.UI.TableViewSection) objects, which are applied
to a [TableView](Titanium.UI.TableView). If a table section is not specified, one will be
automatically created.

A row's contents can be as simple as a single line of text, or comprised of a completely
customized layout of child views.

### Creating Table View Rows

Rows may be created using the properties directly available on the `TableViewRow` object, to
achieve the following:


*(See full overview in titanium-docs)*

### Properties (unique: 27/95)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| accessibilityLabel | String | — | ios | A succinct label associated with the table row for the device's accessibility s… |
| backgroundSelectedColor | String \| Ti.UI.Color | — | both | Background color to render when the row is selected, as a color name or hex tri… |
| backgroundSelectedImage | String | — | both | Background image to render when the row is selected. |
| opacity | Number | — | android | Opacity of this view, from 0.0 (transparent) to 1.0 (opaque). Defaults to 1.0 (… |
| className | String | — | android | Class name for the row. |
| color | String \| Ti.UI.Color | — | both | Default text color of the row when not selected, as a color name or hex triplet. |
| deleteButtonTitle | String | — | both | Text to display on the delete button when editable is enabled |
| editable | Boolean | undefined | both | Determines the rows' editable behavior, which allows them to be deleted by the … |
| editActions | Array<RowActionType> | — | ios | Specifies custom action items to be shown when when a list item is edited. |
| filterAlwaysInclude | Boolean | false | both | This row will always be visible when you filter your content. |
| font | Font | System default font. | both | Font to use for the row title. |
| footer | String | — | both | The footer title of the row. |
| footerTitle | String | — | both | The footer title of the row. |
| hasCheck | Boolean | false | both | Determines whether a system-provided checkmark is displayed on the right-hand s… |
| hasChild | Boolean | false | both | Determines whether a system-provided arrow is displayed on the right-hand side … |
| hasDetail | Boolean | false | both | Determines whether a system-provided detail disclosure button is displayed on t… |
| header | String | — | both | The header title of the row. |
| headerTitle | String | — | both | The header title of the row. |
| indentionLevel | Number | 0 | ios | Indention level for the row. |
| leftImage | String | — | both | Image to render in the left image area of the row, specified as a local path or… |
| moveable | Boolean | undefined | both | Determines the rows' moveable behavior, which allows them to be re-ordered by t… |
| rightImage | String | — | both | Image to render in the right image area of the row, specified as a local path o… |
| selectedBackgroundColor | String \| Ti.UI.Color | — | both | Background color to render when the row is selected, as a color name or hex tri… |
| selectedBackgroundImage | String | — | both | Background image to render when the row is selected. |
| selectedColor | String \| Ti.UI.Color | — | ios | Color of the row text when the row is selected, as a color name or hex triplet. |
| selectionStyle | Number | — | both | Selection style constant to control the selection color. |
| title | String | — | both | Text to display on the row. |



### Events (4)
| Event | Platform | Description |
|-------|----------|-------------|
| click | both | Fired when a table row is clicked by the user. |
| touchcancel | ios | Fired when a touch gesture is interrupted by the device. |
| touchend | ios | Fired when a touch gesture is complete. |
| touchstart | ios | Fired as soon as the device detects a touch gesture against this view. |

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

## Ti.UI.TableViewSection
> A table view section is a container within a table used to organize table view rows.
> Extends Ti.Proxy
> Platforms: both

Use the <Titanium.UI.createTableViewSection> method or **`<TableViewSection>`** Alloy element to 
create a `TableViewSection`.

Before the table is rendered, the `TableViewSection` [add](Titanium.UI.TableViewSection.add) 
method may be used to add [TableViewRow](Titanium.UI.TableViewRow) objects to a section. After 
it is rendered, one of the `TableView` [insertRowBefore](Titanium.UI.TableView.insertRowBefore), 
[insertRowAfter](Titanium.UI.TableView.insertRowAfter), or 
[appendRow](Titanium.UI.TableView.appendRow) methods must be used instead. 

To remove a row from a section after the table is rendered, use the `TableView` 
[deleteRow](Titanium.UI.TableView.deleteRow) method. 

In order for a section to be visible, either its `headerTitle` or `headerView` property must be 
configured. 


*(See full overview in titanium-docs)*

### Properties (unique: 6/9)
| Property | Type | Default | Platform | Description |
|----------|------|---------|----------|-------------|
| footerTitle | String | — | both | Title of this section footer. |
| footerView | Ti.UI.View | — | both | View to use for this section footer. |
| headerTitle | String | — | both | Title of this section header. |
| headerView | Ti.UI.View | — | both | View to use for this section header. |
| rowCount | Number | — | both | Number of rows in this section. |
| rows | Array<Titanium.UI.TableViewRow> | — | both | Rows in this section. |


### Methods (3)
| Method | Returns | Platform | Description |
|--------|---------|----------|-------------|
| add(row) | void | both | Adds a table view row to this section. |
| remove(row) | void | both | Removes a table view row from this section. |
| rowAtIndex(index) | Ti.UI.TableViewRow | android | Returns a row in this section. |


---

## Ti.UI.TableViewScrollPosition
> A set of constants for the position value that can be used for the `position` property of <Titanium.UI.TableView> when invoking `scrollToIndex`.
> Extends Ti.Proxy
> Platforms: both

### Constants (4)
- **OTHER_\***: BOTTOM, MIDDLE, NONE, TOP




---

