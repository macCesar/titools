# ListViews and Performance Optimization

## 1. Overview

ListView is a data-oriented, high-performance replacement for TableView. It optimizes large datasets by recycling native views and managing the item lifecycle automatically.

### Core Concepts

| Concept | Description |
|---------|-------------|
| **ListView** | Container for sections |
| **ListSection** | Organizes items, supports CRUD operations |
| **ListItem** | Virtual view object (not directly accessible after rendering) |
| **ItemTemplate** | Defines row structure and binding |
| **ListDataItem** | Raw data bound to templates |

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
var items = [
  { properties: { title: "Item 1" } },
  { properties: { title: "Item 2" } },
  { properties: { title: "Item 3" } }
];

$.myList.sections[0].setItems(items);
```

### Mapping External Data

```javascript
var externalData = [
  { name: "Item 1", value: 100 },
  { name: "Item 2", value: 200 }
];

// Map to ListDataItem format
var items = _.map(externalData, function(item) {
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
var items = [
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

## 4. Data Binding

### Binding Syntax

**XML (Alloy)**: `bindId:property="value"`
**JavaScript**: `{ bindId: { property: value } }`

### Programmatic Binding with Custom Templates

```javascript
var items = [
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

| Method | Description |
|--------|-------------|
| `setItems(items)` | Replace all items |
| `appendItems(items)` | Add to end |
| `insertItemsAt(index, items)` | Insert at position |
| `replaceItemsAt(index, count, items)` | Replace range |
| `deleteItemsAt(index, count)` | Delete range |

### Example Operations

```javascript
var section = $.myList.sections[0];

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

  var section = $.list.sections[e.sectionIndex];
  var item = section.getItemAt(e.itemIndex);

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
  var moreData = loadNextPage();

  // Append to list
  e.section.appendItems(moreData);

  // Set next marker
  var nextMarker = e.itemIndex + moreData.length - 1;
  $.myList.setMarker({ sectionIndex: e.sectionIndex, itemIndex: nextMarker });
}

$.myList.addEventListener('marker', markerReached);
```

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
    var item = e.section.getItemAt(e.itemIndex);

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
  var item = e.section.getItemAt(e.itemIndex);
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
var item = section.getItemAt(index);

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
var section = $.myList.sections[0];

// Define edit actions
var deleteAction = Ti.UI.iOS.createListViewDeleteOptions({
  title: 'Delete'
});

var moreAction = Ti.UI.iOS.createListViewEditAction({
  title: 'More',
  backgroundColor: 'blue',
  style: Ti.UI.iOS.LIST_VIEW_EDIT_ACTION_STYLE_NORMAL
});

// Enable editing
section.editActions = [deleteAction, moreAction];
section.canEdit = true;

// Handle actions
$.myList.addEventListener('editaction', function(e) {
  if (e.action === deleteAction) {
    section.deleteItemsAt(e.itemIndex, 1);
  } else if (e.action === moreAction) {
    // Handle more action
  }
});
```

## 9. Search

```javascript
var searchView = Ti.UI.createSearchBar({
  showCancel: true
});

$.myList.searchView = searchView;

// Mark searchable text in items
var items = [
  {
    properties: {
      title: "Apple",
      searchableText: "Apple fruit red delicious"  // Extra keywords
    }
  }
];
```

## 10. Performance Best Practices

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

## 11. Transitioning from TableView

| TableView | ListView |
|-----------|----------|
| TableViewRow | ListItem (Virtual) |
| `add()` views to row | `childTemplates` in Template |
| `data` property | `sections` property |
| Direct child access | Bound data updates only |
| `appendRow()` | `appendItems()` |
| `updateRow()` | `updateItemAt()` |
| `deleteRow()` | `deleteItemsAt()` |

## 12. Common Patterns

### Infinite Scroll with Markers

```javascript
var PAGE_SIZE = 25;
var currentPage = 0;

function loadPage(page) {
  var data = fetchDataFromAPI(page);

  if (page === 0) {
    $.myList.sections[0].setItems(data);
  } else {
    $.myList.sections[0].appendItems(data);
  }

  // Set marker for next page
  var markerIndex = (page * PAGE_SIZE) + data.length - 1;
  $.myList.setMarker({ sectionIndex: 0, itemIndex: markerIndex });
}

// Initial load
loadPage(0);

// Marker handler
$.myList.addEventListener('marker', function(e) {
  currentPage++;
  loadPage(currentPage);
});
```

### Multiple Selection

```javascript
var selectedItems = {};

$.myList.addEventListener('itemclick', function(e) {
  var item = e.section.getItemAt(e.itemIndex);
  var key = e.sectionIndex + '-' + e.itemIndex;

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

## 13. Platform Differences

### iOS vs Android

| Feature | iOS | Android |
|---------|-----|---------|
| Action items (swipe) | Full support | Not supported |
| Section index titles | Full support | Not supported |
| Search bar | Full support | Full support |
| Default template image | Left side | Right side |
| cacheSize property | Supported | Not supported |

### cacheSize (iOS)

```javascript
// Number of views to pre-render offscreen
$.myList.cacheSize = 3;  // Default
```

## 14. Debugging

### Common Issues

**Problem**: Jerky scrolling
**Solution**: Remove `Ti.UI.SIZE` from templates

**Problem**: Data changes not visible
**Solution**: Use `updateItemAt()` instead of modifying views

**Problem**: Event not firing on template element
**Solution**: Check `bindId` in event handler

**Problem**: Wrong item updated
**Solution**: Use `e.section.getItemAt(e.itemIndex)` not global reference
