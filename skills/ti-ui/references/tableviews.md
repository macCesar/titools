# TableViews

## 1. Overview

TableView is a scrolling list component that displays rows of data. While ListView is the recommended modern API for most use cases, TableView remains useful for:
- Complex row animations
- Direct child view access
- Legacy code compatibility
- UI patterns requiring direct row manipulation

## 2. TableView vs ListView

| Feature | TableView | ListView |
|---------|-----------|----------|
| **Recommended for** | Legacy apps, complex animations | New apps, large datasets |
| **Data binding** | Direct row object access | Template-based binding |
| **Performance** | Good for small datasets | Optimized for large datasets |
| **Row access** | Direct children access | Virtual, data-only updates |
| **Animations** | Full row animation support | Limited |
| **Complexity** | Simpler for basic needs | More setup required |

## 3. Creating a TableView

### Basic TableView

```javascript
var table = Ti.UI.createTableView({
  height: Ti.UI.FILL,
  width: Ti.UI.FILL,
  backgroundColor: 'white',
  rowHeight: 50,
  separatorColor: '#ccc'
});

win.add(table);
```

### TableView Properties

| Property | Description |
|----------|-------------|
| `data` | Array of row objects |
| `headerTitle` / `headerView` | Table header |
| `footerTitle` / `footerView` | Table footer |
| `rowHeight` / `minRowHeight` / `maxRowHeight` | Row dimensions |
| `scrollable` | Enable vertical scrolling |
| `separatorColor` | Color between rows |
| `style` | iOS: GROUPED or PLAIN |
| `allowsSelection` | Enable row selection |

## 4. Creating Rows

### Object Literal Rows (Simple)

```javascript
var data = [
  { title: 'Row 1' },
  { title: 'Row 2' },
  { title: 'Row 3' }
];

var table = Ti.UI.createTableView({
  data: data
});

win.add(table);
```

### Explicit TableViewRow Objects

```javascript
var row = Ti.UI.createTableViewRow({
  title: 'Row 1',
  className: 'row'  // Performance optimization
});

table.appendRow(row);

// With explicit row, you can call methods
var imgCapture = row.toImage();
```

### Performance: setData() vs appendRow()

```javascript
// GOOD - Batch assignment
var rows = [];
for (var i = 0; i < 100; i++) {
  rows.push({ title: 'Row ' + i });
}
table.setData(rows);  // Fast

// AVOID - Adding one by one (slow for many rows)
for (var i = 0; i < 100; i++) {
  table.appendRow({ title: 'Row ' + i });
}
```

**Best Practice**: Use `setData()` for multiple rows. `appendRow()` is significantly slower.

## 5. Row Properties

### Built-in Row Properties

| Property | Description |
|----------|-------------|
| `title` | Row title text |
| `className` | Reuse identifier for performance |
| `leftImage` | Image to left of title |
| `rightImage` | Image to right of title |
| `backgroundImage` | Row background image |
| `backgroundColor` | Row background color |
| `hasChild` | Shows > indicator (iOS/Android) |
| `hasDetail` | Shows detail indicator (iOS only) |
| `hasCheck` | Shows checkmark indicator |
| `header` | Section header text |
| `footer` | Section footer text |

### Styled Rows Example

```javascript
var data = [
  { title: 'Row 1', leftImage: 'icon.png', hasChild: true },
  { title: 'Row 2', rightImage: 'arrow.png', hasDetail: true },
  { title: 'Row 3', backgroundColor: '#fdd', hasCheck: true }
];

var table = Ti.UI.createTableView({ data: data });
```

### Row Indicators

Row indicators provide visual cues:

```javascript
// iOS and Android
{ title: 'Sub-items', hasChild: true }  // > arrow

// iOS only
{ title: 'Details', hasDetail: true }  // circle with i

// Both platforms
{ title: 'Selected', hasCheck: true }  // checkmark
```

## 6. Custom Rows

### Adding Child Views

```javascript
var data = [];

for (var i = 0; i < 10; i++) {
  var row = Ti.UI.createTableViewRow({
    className: 'customRow',
    height: 60
  });

  var label = Ti.UI.createLabel({
    left: 10,
    text: 'Row ' + (i + 1),
    font: { fontSize: 16 }
  });

  var image = Ti.UI.createImageView({
    right: 10,
    image: 'icon.png'
  });

  var button = Ti.UI.createButton({
    right: 60,
    height: 30,
    width: 80,
    title: 'Action'
  });

  row.add(label);
  row.add(image);
  row.add(button);

  data.push(row);
}

var table = Ti.UI.createTableView({ data: data });
```

### Performance Warning

**Warning**: Complex rows have performance implications. Each unique UI element adds resource requirements multiplied by the number of rows. Test on device and scale back if necessary.

## 7. Headers and Footers

### Table-Level Headers/Footers

```javascript
var table = Ti.UI.createTableView({
  data: data,
  headerTitle: 'Table Header',
  footerTitle: 'Table Footer'
});
```

### Custom Header/Footer Views

```javascript
function createCustomView(title) {
  var view = Ti.UI.createView({
    backgroundColor: '#222',
    height: 40
  });

  var text = Ti.UI.createLabel({
    text: title,
    left: 20,
    color: '#fff'
  });

  view.add(text);
  return view;
}

var table = Ti.UI.createTableView({
  data: data,
  headerView: createCustomView('Header View'),
  footerView: createCustomView('Footer View')
});
```

### Section Headers/Footers

```javascript
var data = [
  { title: 'Row 1', header: 'Section 1' },
  { title: 'Row 2' },
  { title: 'Row 3' },
  { title: 'Row 4', header: 'Section 2' },
  { title: 'Row 5' }
];

var table = Ti.UI.createTableView({ data: data });
```

## 8. Grouped Table Style (iOS)

```javascript
var data = [
  { title: 'row 1', header: 'Header 1' },
  { title: 'row 2' },
  { title: 'row 3' },
  { title: 'row 4', header: 'Header 2' },
  { title: 'row 5' }
];

var table = Ti.UI.createTableView({
  data: data,
  style: Ti.UI.iPhone.TableViewStyle.GROUPED
});
```

## 9. Editing Mode

```javascript
table.editing = true;

// Allow row movement
table.moving = true;

// Allow deletion
var data = [
  { title: 'Row 1', canEdit: true },
  { title: 'Row 2', canEdit: false }  // Cannot be deleted
];
```

## 10. TableView Events

### Click Event

```javascript
table.addEventListener('click', function(e) {
  // e.index: row index
  // e.row: TableViewRow object
  // e.rowData: row data object
  // e.section: section (if using sections)

  Ti.API.info('Clicked row: ' + e.index);
  Ti.API.info('Row title: ' + e.row.title);
});
```

### Delete Event

```javascript
table.addEventListener('delete', function(e) {
  Ti.API.info('Deleted row: ' + e.row.title);
});
```

### Scroll Events

```javascript
table.addEventListener('scroll', function(e) {
  Ti.API.info('Scrolling... y=' + e.y);
});

table.addEventListener('scrollEnd', function(e) {
  Ti.API.info('Scroll ended at y=' + e.y);
});
```

## 11. Searching

```javascript
var search = Ti.UI.createSearchBar({
  showCancel: true,
  height: 43,
  top: 0
});

var table = Ti.UI.createTableView({
  search: search,  // Attach search bar
  searchHidden: false  // Initially visible
});
```

## 12. Updating Table Data

### Appending Rows

```javascript
table.appendRow({ title: 'New Row' });

// Append multiple
table.appendRow([
  { title: 'Row 1' },
  { title: 'Row 2' }
]);
```

### Inserting Rows

```javascript
table.insertRowBefore(2, { title: 'Inserted at index 2' });
table.insertRowAfter(5, { title: 'Inserted after index 5' });
```

### Deleting Rows

```javascript
table.deleteRow(3);  // Delete row at index 3

// Clear all rows
table.setData([]);
// NOT: table.data = null (causes issues)
```

### Updating Specific Row

```javascript
var data = table.data;
data[2].title = 'Updated Title';
table.setData(data);
```

## 13. TableView Sections

### Creating Sections

```javascript
var section1 = Ti.UI.createTableViewSection({
  headerTitle: 'Section 1'
});

section1.add(Ti.UI.createTableViewRow({ title: 'Row 1' }));
section1.add(Ti.UI.createTableViewRow({ title: 'Row 2' }));

var section2 = Ti.UI.createTableViewSection({
  headerTitle: 'Section 2',
  footerTitle: 'Section Footer'
});

section2.add(Ti.UI.createTableViewRow({ title: 'Row 3' }));

var table = Ti.UI.createTableView({
  data: [section1, section2]
});
```

### Custom Section Headers

```javascript
var section = Ti.UI.createTableViewSection({
  headerView: createCustomView('Custom Header')
});
```

## 14. Performance Optimization

### Use className

```javascript
// GOOD - Rows with same structure share className
var row1 = Ti.UI.createTableViewRow({
  className: 'standardRow',
  title: 'Row 1'
});

var row2 = Ti.UI.createTableViewRow({
  className: 'standardRow',  // Reuses row1's template
  title: 'Row 2'
});
```

`className` enables OS to reuse scrolled-out rows for faster rendering.

### Avoid Too Many Rows

If you have thousands of rows, consider:
- Filtering mechanism
- Drill-down interface
- Pagination
- ListView instead

### Optimize Custom Rows

- Minimize child views per row
- Use simple layouts
- Test on device
- Avoid nested ScrollViews

## 15. Common Patterns

### Detail View Navigation

```javascript
table.addEventListener('click', function(e) {
  var detailWin = Ti.UI.createWindow({
    title: e.row.title,
    backgroundColor: 'white'
  });

  var detailLabel = Ti.UI.createLabel({
    text: 'Details for ' + e.row.title
  });

  detailWin.add(detailLabel);
  detailWin.open();
});
```

### Row Actions (Swipe to Delete)

```javascript
table.setEditable(true);

table.addEventListener('delete', function(e) {
  // Confirm deletion
  var dialog = Ti.UI.createAlertDialog({
    title: 'Delete',
    message: 'Delete this row?',
    buttonNames: ['Delete', 'Cancel']
  });

  dialog.addEventListener('click', function(evt) {
    if (evt.index === 0) {
      // Delete confirmed
      // e.row is automatically removed
    }
  });

  dialog.show();
});
```

### Refresh Control

```javascript
var table = Ti.UI.createTableView({
  refreshControl: Ti.UI.createRefreshControl({
    tintColor: 'blue'
  })
});

table.refreshControl.addEventListener('refreshstart', function() {
  // Load data
  loadData(function() {
    table.refreshControl.endRefreshing();
  });
});
```

## 16. Platform Differences

### iOS
- Supports `GROUPED` style
- Supports `hasDetail` indicator
- Modal windows fill screen
- NavigationController integration

### Android
- No `GROUPED` style
- `hasDetail` not supported
- Windows always fill screen
- Back button closes windows

## 17. Migration: TableView to ListView

When to migrate:
- New app development
- Large datasets (>100 rows)
- Performance issues
- Need modern features (templates, binding)

Key differences:
- TableView: `data` property with row objects
- ListView: `sections` property with templates

## Best Practices

1. **Use ListView for new apps** - Better performance and features
2. **Use className** - Enables row reuse
3. **Batch updates** - Use `setData()` instead of multiple `appendRow()`
4. **Test on device** - Simulator performance differs
5. **Limit row complexity** - Fewer children = better scrolling
6. **Consider pagination** - Don't show thousands of rows at once
