# ListViews and Performance Optimization

## 1. Overview

ListView is a data-oriented, high-performance replacement for TableView. It optimizes large datasets by recycling native views and managing the item lifecycle automatically.

### Core Concepts

| Concept          | Description                                                   |
| ---------------- | ------------------------------------------------------------- |
| **ListView**     | Container for sections                                        |
| **ListSection**  | Organizes items, supports CRUD operations                     |
| **ListItem**     | Virtual view object (not directly accessible after rendering) |
| **ItemTemplate** | Defines row structure and binding                             |
| **ListDataItem** | Raw data bound to templates                                   |

## 2. Basic ListView Structure

### Declarative (Alloy XML)

```xml
<Alloy>
  <Window>
    <ListView id="myList">
      <ListSection name="section1">
        <ListItem title="Item 1"/>
        <ListItem title="Item 2"/>
        <ListItem title="Item 3"/>
      </ListSection>
    </ListView>
  </Window>
</Alloy>
```

### Programmatic Data Binding

```javascript
const items = [
  { properties: { title: "Item 1" } },
  { properties: { title: "Item 2" } },
  { properties: { title: "Item 3" } }
];

$.myList.sections[0].setItems(items);
```

### Mapping External Data

```javascript
const externalData = [
  { name: "Item 1", value: 100 },
  { name: "Item 2", value: 200 }
];

// Map to ListDataItem format
const items = _.map(externalData, (item) => {
  return {
    properties: {
      title: item.name
    },
    // Custom binding
    value: { text: item.value.toString() }
  };
});

$.myList.sections[0].setItems(items);
```

## 3. Templates

### Default Template

Built-in template with:
- ImageView (left on iOS, right on Android)
- Title Label (left-aligned, black)
- Optional accessory icon

```xml
<ListView id="myList">
  <ListSection>
    <ListItem title="Title" image="icon.png" accessoryType="Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE"/>
  </ListSection>
</ListView>
```

### Custom Templates

Create with `<Templates>` and `<ItemTemplate>`:

```xml
<ListView id="elementsList" defaultItemTemplate="elementTemplate">
  <Templates>
    <ItemTemplate name="elementTemplate">
      <!-- Bindable elements with bindId -->
      <Label bindId="symbol" id="symbol" />
      <View id="atomProperties">
        <Label bindId="name" id="name" />
        <View id="secondLine">
          <Label class="line2" bindId="number" id="number" />
          <Label class="line2" bindId="mass" id="mass" />
        </View>
      </View>
      <ImageView bindId="image" id="image" />
    </ItemTemplate>
  </Templates>
  <ListSection>
    <!-- Bind data using bindId:property syntax -->
    <ListItem symbol:text="H" symbol:color="#090" name:text="Hydrogen" number:text="1" mass:text="1.00794"/>
  </ListSection>
</ListView>
```

### Multiple Templates

```xml
<ListView id="dynamicListView">
  <Templates>
    <ItemTemplate name="image_title" height="100">
      <View layout="horizontal" left="15">
        <ImageView bindId="image" id="image"/>
        <Label bindId="label" id="label1"/>
      </View>
    </ItemTemplate>
    <ItemTemplate name="title_only" height="50">
      <View left="15">
        <Label bindId="label"/>
      </View>
    </ItemTemplate>
  </Templates>
  <ListSection/>
</ListView>
```

Assign template per item:

```javascript
const items = [
  {
    label: { text: "Full item" },
    image: { image: "photo.png" },
    template: "image_title"  // Use this template
  },
  {
    label: { text: "Text only" },
    template: "title_only"  // Use this template
  }
];

$.dynamicListView.sections[0].setItems(items);
```

### iOS Built-in Templates (iOS Only)

iOS provides four built-in templates that can be used without defining custom `ItemTemplate`:

| Constant                            | Layout                                                          |
| ----------------------------------- | --------------------------------------------------------------- |
| `Ti.UI.LIST_ITEM_TEMPLATE_DEFAULT`  | Left-justified title only (this is the default)                 |
| `Ti.UI.LIST_ITEM_TEMPLATE_SUBTITLE` | Title with subtitle below in smaller gray text                  |
| `Ti.UI.LIST_ITEM_TEMPLATE_SETTINGS` | Left-justified title on left, right-justified subtitle on right |
| `Ti.UI.LIST_ITEM_TEMPLATE_CONTACTS` | Right-justified title with left-justified subtitle              |

```javascript
const section = Ti.UI.createListSection({
  items: [
    { properties: { title: 'Title', subtitle: 'Subtitle' } }
  ]
});

const listView = Ti.UI.createListView({
  sections: [section],
  defaultItemTemplate: Ti.UI.LIST_ITEM_TEMPLATE_SUBTITLE
});
```

### Supported Template View Classes

The following views can be used as child elements in custom templates: ActivityIndicator, Button, ImageView, Label, MaskedImage, ProgressBar, Slider, Switch, TextArea, TextField.

## 4. Data Binding

### Binding Syntax

**XML (Alloy)**: `bindId:property="value"`
**JavaScript**: `{ bindId: { property: value } }`

### Programmatic Binding with Custom Templates

```javascript
const items = [
  {
    mass: { text: "1.00794" },
    name: { text: "Hydrogen" },
    number: { text: "1" },
    symbol: { color: "#090", text: "H" }
  },
  {
    mass: { text: "4.002602" },
    name: { text: "Helium" },
    number: { text: "2" },
    symbol: { color: "#090", text: "He" }
  }
];

$.elementsList.sections[0].setItems(items);
```

## 5. Section Operations

### CRUD Methods

| Method                                | Description        |
| ------------------------------------- | ------------------ |
| `setItems(items)`                     | Replace all items  |
| `appendItems(items)`                  | Add to end         |
| `insertItemsAt(index, items)`         | Insert at position |
| `replaceItemsAt(index, count, items)` | Replace range      |
| `deleteItemsAt(index, count)`         | Delete range       |

### Example Operations

```javascript
const section = $.myList.sections[0];

// Replace all (clears first)
section.setItems(items);

// Append to end
section.appendItems(newItems);

// Insert at position 5
section.insertItemsAt(5, moreItems);

// Replace 3 items starting at index 2
section.replaceItemsAt(2, 3, replacementItems);

// Delete 2 items starting at index 10
section.deleteItemsAt(10, 2);
```

### Row Animation (iOS)

You can pass animation styles to append/delete/insert/replace/update methods:

```javascript
section.deleteItemsAt(0, 1, {
  animationStyle: Ti.UI.iOS.RowAnimationStyle.LEFT
});

section.appendItems(newItems, {
  animationStyle: Ti.UI.iOS.RowAnimationStyle.FADE
});
```

Available styles: `Ti.UI.iOS.RowAnimationStyle.BOTTOM`, `FADE`, `LEFT`, `NONE`, `RIGHT`, `TOP`.

## 6. Events

### Item Click

```xml
<ListView id="list" onItemclick="handleClick">
```

```javascript
function handleClick(e) {
  // e.sectionIndex: which section
  // e.itemIndex: which item
  // e.bindId: which template element (null if row clicked)
  // e.itemId: custom itemId if set

  const section = $.list.sections[e.sectionIndex];
  const item = section.getItemAt(e.itemIndex);

  // Update item
  item.properties.title += " (clicked)";
  item.properties.color = 'red';
  section.updateItemAt(e.itemIndex, item);
}
```

### Marker Events (Infinite Scroll)

Markers act as "tripwires" for loading more data:

```javascript
// Set initial marker at item 100
$.myList.setMarker({ sectionIndex: 0, itemIndex: 99 });

// Handle marker event
function markerReached(e) {
  // Load more data
  const moreData = loadNextPage();

  // Append to list
  e.section.appendItems(moreData);

  // Set next marker
  const nextMarker = e.itemIndex + moreData.length - 1;
  $.myList.setMarker({ sectionIndex: e.sectionIndex, itemIndex: nextMarker });
}

$.myList.addEventListener('marker', markerReached);
```

Since SDK 4.1.0, use `addMarker()` to add additional markers after the initial `setMarker()`:

```javascript
$.myList.addMarker({ sectionIndex: 0, itemIndex: 149 });
```

### Scroll Events

Since SDK 4.1.0, use `scrollstart` and `scrollend` events to monitor scrolling:

```javascript
$.myList.addEventListener('scrollstart', (e) => {
  Ti.API.info(`Scroll started at section ${e.firstVisibleSectionIndex}, item ${e.firstVisibleItemIndex}`);
  Ti.API.info(`Visible items: ${e.visibleItemCount}`);
});

$.myList.addEventListener('scrollend', (e) => {
  Ti.API.info(`Scroll ended at section ${e.firstVisibleSectionIndex}, item ${e.firstVisibleItemIndex}`);
});
```

Event properties: `firstVisibleSectionIndex`, `firstVisibleItemIndex`, `visibleItemCount`.

### Template Element Events

```xml
<ListView id="likeList" onItemclick="handleItemClick">
  <Templates>
    <ItemTemplate name="custom">
      <Label bindId="label" left="15" />
      <ImageView bindId="icon" right="15" />
    </ItemTemplate>
  </Templates>
  <ListSection>
    <ListItem label:text="Like me?" icon:image="star_grey.png" />
  </ListSection>
</ListView>
```

```javascript
function handleItemClick(e) {
  // Check which element was clicked
  if (e.bindId === "icon") {
    const item = e.section.getItemAt(e.itemIndex);

    // Toggle image (update data, NOT e.source)
    if (item.icon.image === "star_grey.png") {
      item.icon.image = "star_gold.png";
    } else {
      item.icon.image = "star_grey.png";
    }

    e.section.updateItemAt(e.itemIndex, item);
  }
}
```

## 7. Critical Performance Rules

### Rule 1: Avoid Ti.UI.SIZE in Templates

**BAD** - Causes jerky scrolling:

```xml
<ItemTemplate name="bad">
  <Label bindId="title" height="Ti.UI.SIZE"/>  <!-- DON'T -->
</ItemTemplate>
```

**GOOD** - Use fixed height or Ti.UI.FILL:

```xml
<ItemTemplate name="good">
  <Label bindId="title" height="40"/>  <!-- Fixed -->
</ItemTemplate>
```

### Rule 2: Cannot Access Children Directly

Views are recycled. Always update via data:

**BAD**:

```javascript
// DON'T - Will be lost when recycled
function handleClick(e) {
  e.source.image = "star_gold.png";
}
```

**GOOD**:

```javascript
// DO - Update the data item
function handleClick(e) {
  const item = e.section.getItemAt(e.itemIndex);
  item.icon.image = "star_gold.png";
  e.section.updateItemAt(e.itemIndex, item);
}
```

### Rule 3: Minimize Template Count

Fewer templates = better native cell reuse:

**GOOD** - One template with conditional visibility:

```xml
<ItemTemplate name="flexible">
  <ImageView bindId="icon"/>
  <Label bindId="title"/>
  <Label bindId="subtitle"/>  <!-- Hidden if not needed -->
</ItemTemplate>
```

**BAD** - Multiple similar templates:

```xml
<ItemTemplate name="withIcon">...</ItemTemplate>
<ItemTemplate name="withoutIcon">...</ItemTemplate>
<ItemTemplate name="withSubtitle">...</ItemTemplate>
```

### Rule 4: Use updateItemAt for Changes

```javascript
// Get item data
const item = section.getItemAt(index);

// Modify properties
item.properties.backgroundColor = 'blue';
item.customField.text = 'Updated';

// Update in list
section.updateItemAt(index, item);
```

### Rule 5: Animations are Limited

ListView items have limited animation support. For complex animations, consider TableView.

## 8. iOS Action Items (Swipe Actions)

```javascript
const section = $.myList.sections[0];

// Define edit actions as plain objects with title, style, and optional color
section.editActions = [
  {
    title: 'Delete',
    style: Ti.UI.iOS.ROW_ACTION_STYLE_DESTRUCTIVE
  },
  {
    title: 'More',
    color: 'blue',
    style: Ti.UI.iOS.ROW_ACTION_STYLE_NORMAL
  }
];
section.canEdit = true;

// Handle actions — e.action is the title STRING of the tapped action
$.myList.addEventListener('editaction', (e) => {
  if (e.action === 'Delete') {
    e.section.deleteItemsAt(e.itemIndex, 1);
  } else if (e.action === 'More') {
    // Handle more action
    Ti.API.info(`More tapped on item ${e.itemIndex} in section ${e.sectionIndex}`);
  }
});
```

**Available action styles:**
- `Ti.UI.iOS.ROW_ACTION_STYLE_DEFAULT` — gray background
- `Ti.UI.iOS.ROW_ACTION_STYLE_DESTRUCTIVE` — red background (default)
- `Ti.UI.iOS.ROW_ACTION_STYLE_NORMAL` — custom color background

**Event properties:** `action` (string — the title), `itemId`, `itemIndex`, `section`, `sectionIndex`.

## 9. Editing Mode (iOS)

Set the `editing` property to toggle edit mode, allowing users to delete and reorder items:

```javascript
// Toggle edit mode
$.myList.editing = true;

// Auto-remove sections that become empty during editing
$.myList.pruneSectionsOnEdit = true;
```

### Delete Event

Fires when a user deletes an item in edit mode:

```javascript
$.myList.addEventListener('delete', (e) => {
  Ti.API.info(`Deleted item ${e.itemIndex} from section ${e.sectionIndex}`);
});
```

### Move Event

Fires when a user reorders an item in edit mode:

```javascript
$.myList.addEventListener('move', (e) => {
  Ti.API.info(`Moved item from ${e.itemIndex} to ${e.targetItemIndex}`);
});
```

## 10. Search

```javascript
const searchView = Ti.UI.createSearchBar({
  showCancel: true
});

$.myList.searchView = searchView;

// Mark searchable text in items
const items = [
  {
    properties: {
      title: "Apple",
      searchableText: "Apple fruit red delicious"  // Extra keywords
    }
  }
];
```

### Search Properties

- `keepSectionsInSearch: true` — preserves section headers while filtering search results.
- `caseInsensitiveSearch: true` — enables case-insensitive search filtering.

```javascript
const listView = Ti.UI.createListView({
  searchView: searchView,
  keepSectionsInSearch: true,
  caseInsensitiveSearch: true
});
```

### No Results Event

Since SDK 3.3.0, when items are filtered using `searchView` or `searchText`, the `noresults` event fires when search returns no results:

```javascript
$.myList.addEventListener('noresults', (e) => {
  Ti.API.info('No matching items found');
});
```

## 11. Performance Best Practices

### DO:
- Use fixed heights in templates
- Minimize number of templates
- Use `updateItemAt()` for changes
- Cache `sections[0]` reference
- Use markers for infinite scroll
- Test with real device data volumes

### DON'T:
- Use `Ti.UI.SIZE` for row dimensions
- Access `e.source` in itemclick events
- Create too many similar templates
- Add complex animations to list items
- Ignore the "recycled" nature of views

## 12. Transitioning from TableView

### Core Logic Differences

| TableView            | ListView                     |
| -------------------- | ---------------------------- |
| TableViewRow         | ListItem (Virtual)           |
| `add()` views to row | `childTemplates` in Template |
| `data` property      | `sections` property          |
| Direct child access  | Bound data updates only      |
| `appendRow()`        | `appendItems()`              |
| `updateRow()`        | `updateItemAt()`             |
| `deleteRow()`        | `deleteItemsAt()`            |

### API Differences

**Properties NOT available for ListItem**:
- `accessibilityLabel`, `className`, `editable`, `hasCheck`, `hasChild`, `hasDetail`, `leftImage`, `moveable`, `rightImage`.
- *Alternatives*: Use `accessoryType` for indicators, and `image` or custom templates for images.

**TableViewSection methods NOT supported by ListSection**:
- `add`, `remove`, `rowAtIndex`.
- *Alternatives*: Use `getItemAt` and `appendItems`/`deleteItemsAt`.

**TableView methods NOT available to ListView**:
- `appendRow`, `deleteRow`, `deselectRow`, `insertRowAfter`, `insertRowBefore`, `selectRow`, `updateRow`, `scrollToIndex`.
- *Alternatives*: Use `scrollToItem` and `selectItem` (iOS). For row manipulation, use the containing `ListSection`.

## 13. Common Patterns

### Infinite Scroll with Markers

```javascript
const PAGE_SIZE = 25;
let currentPage = 0;

function loadPage(page) {
  const data = fetchDataFromAPI(page);

  if (page === 0) {
    $.myList.sections[0].setItems(data);
  } else {
    $.myList.sections[0].appendItems(data);
  }

  // Set marker for next page
  const markerIndex = (page * PAGE_SIZE) + data.length - 1;
  $.myList.setMarker({ sectionIndex: 0, itemIndex: markerIndex });
}

// Initial load
loadPage(0);

// Marker handler
$.myList.addEventListener('marker', (e) => {
  currentPage++;
  loadPage(currentPage);
});
```

### Multiple Selection

```javascript
const selectedItems = {};

$.myList.addEventListener('itemclick', (e) => {
  const item = e.section.getItemAt(e.itemIndex);
  const key = `${e.sectionIndex}-${e.itemIndex}`;

  if (selectedItems[key]) {
    // Deselect
    delete selectedItems[key];
    item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_NONE;
  } else {
    // Select
    selectedItems[key] = item;
    item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_CHECKMARK;
  }

  e.section.updateItemAt(e.itemIndex, item);
});
```

### Section Index (A-Z)

```javascript
$.myList.sectionIndexTitles = ["A", "B", "C", ...];
```

## 14. Platform Differences

### iOS vs Android

| Feature                | iOS          | Android       |
| ---------------------- | ------------ | ------------- |
| Action items (swipe)   | Full support | Not supported |
| Section index titles   | Full support | Not supported |
| Search bar             | Full support | Full support  |
| Default template image | Left side    | Right side    |
| cacheSize property     | Supported    | Not supported |

### Grouped Style (iOS)

Set `style: Ti.UI.iOS.ListViewStyle.GROUPED` to display sections as separate visual groups with rounded corners and inset spacing:

```javascript
const listView = Ti.UI.createListView({
  style: Ti.UI.iOS.ListViewStyle.GROUPED,
  sections: [sectionA, sectionB]
});
```

### Pull-to-Refresh (iOS)

The `pull` event fires when the user pulls past the top of the list, and `pullend` fires when the user releases. Use the `pullView` property to set a custom pull-to-refresh view:

```javascript
const pullView = Ti.UI.createView({
  height: 60,
  backgroundColor: '#eee'
});
pullView.add(Ti.UI.createLabel({ text: 'Pull to refresh...' }));

$.myList.pullView = pullView;

$.myList.addEventListener('pull', (e) => {
  // User is pulling — update UI as needed
  pullView.children[0].text = e.active ? 'Release to refresh...' : 'Pull to refresh...';
});

$.myList.addEventListener('pullend', (e) => {
  // User released — trigger data refresh
  refreshData();
});
```

### cacheSize (iOS)

```javascript
// Number of views to pre-render offscreen
$.myList.cacheSize = 3;  // Default
```

## 15. Debugging

### Common Issues

**Problem**: Jerky scrolling
**Solution**: Remove `Ti.UI.SIZE` from templates

**Problem**: Data changes not visible
**Solution**: Use `updateItemAt()` instead of modifying views

**Problem**: Event not firing on template element
**Solution**: Check `bindId` in event handler

**Problem**: Wrong item updated
**Solution**: Use `e.section.getItemAt(e.itemIndex)` not global reference
