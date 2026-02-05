# TableViews

## 1. Overview

TableView is a scrolling list component that displays rows of data. ListView is the recommended modern API for most cases, but TableView is still useful for:
- Complex row animations
- Direct child view access
- Legacy code compatibility
- UI patterns that need direct row manipulation

## 2. TableView vs ListView

| Feature             | TableView                       | ListView                     |
| ------------------- | ------------------------------- | ---------------------------- |
| Recommended for     | Legacy apps, complex animations | New apps, large datasets     |
| Data binding        | Direct row object access        | Template-based binding       |
| Performance         | Good for small datasets         | Optimized for large datasets |
| Row access          | Direct children access          | Virtual, data-only updates   |
| Animations          | Full row animation support      | Limited                      |
| Complexity          | Simpler for basic needs         | More setup required          |

## 3. Creating a TableView

### Basic TableView

```javascript
const table = Ti.UI.createTableView({
  height: Ti.UI.FILL,
  width: Ti.UI.FILL,
  backgroundColor: 'white',
  rowHeight: 50,
  minRowHeight: 40,
  maxRowHeight: 80,
  separatorColor: '#ccc',
  scrollable: true  // Set false to disable scrolling
});

win.add(table);
```
...
## 4. Creating rows

### Object literal rows (simple)

```javascript
const data = [
  { title: 'Row 1' },
  { title: 'Row 2' },
  { title: 'Row 3' }
];

const table = Ti.UI.createTableView({
  data: data
});

win.add(table);
```

### Explicit TableViewRow objects

```javascript
const row = Ti.UI.createTableViewRow({
  title: 'Row 1',
  // Performance optimization
  className: 'row'
});

table.appendRow(row);

// With explicit row, you can call methods
const imgCapture = row.toImage();
```

### Performance: setData() vs appendRow()

```javascript
// GOOD - Batch assignment
const rows = [];
for (let i = 0; i < 100; i++) {
  rows.push({ title: `Row ${i}` });
}
table.setData(rows);  // Fast

// AVOID - Adding one by one (slow for many rows)
for (let i = 0; i < 100; i++) {
  table.appendRow({ title: `Row ${i}` });
}
```

Best practice: use `setData()` for multiple rows. `appendRow()` is significantly slower.

## 5. Row properties

### Built-in row properties

| Property          | Description                       |
| ----------------- | --------------------------------- |
| `title`           | Row title text                    |
| `className`       | Reuse identifier for performance  |
| `leftImage`       | Image to left of title            |
| `rightImage`      | Image to right of title           |
| `backgroundImage` | Row background image              |
| `backgroundColor` | Row background color              |
| `hasChild`        | Shows > indicator (iOS/Android)   |
| `hasDetail`       | Shows detail indicator (iOS only) |
| `hasCheck`        | Shows checkmark indicator         |
| `header`          | Section header text               |
| `footer`          | Section footer text               |

### Styled rows example

```javascript
const data = [
  { title: 'Row 1', leftImage: 'icon.png', hasChild: true },
  { title: 'Row 2', rightImage: 'arrow.png', hasDetail: true },
  { title: 'Row 3', backgroundColor: '#fdd', hasCheck: true }
];

const table = Ti.UI.createTableView({ data: data });
```

### Row indicators

Row indicators provide visual cues:

```javascript
// iOS and Android
{ title: 'Sub-items', hasChild: true }  // > arrow

// iOS only
{ title: 'Details', hasDetail: true }  // circle with i

// Both platforms
{ title: 'Selected', hasCheck: true }  // checkmark
```

## 6. Custom rows

### Add child views

```javascript
const data = [];

for (let i = 0; i < 10; i++) {
  const row = Ti.UI.createTableViewRow({
    height: 60,
    className: 'customRow'
  });

  const label = Ti.UI.createLabel({
    left: 10,
    text: `Row ${i + 1}`,
    font: { fontSize: 16 }
  });

  const image = Ti.UI.createImageView({
    right: 10,
    image: 'icon.png'
  });

  const button = Ti.UI.createButton({
    right: 60,
    width: 80,
    height: 30,
    title: 'Action'
  });

  row.add(label);
  row.add(image);
  row.add(button);

  data.push(row);
}

const table = Ti.UI.createTableView({ data: data });
```

### Performance warning

Warning: complex rows have performance costs. Each extra UI element multiplies resource use across rows. Test on device and simplify if needed.

## 7. Headers and footers

### Table-level headers and footers

```javascript
const table = Ti.UI.createTableView({
  data: data,
  headerTitle: 'Table Header',
  footerTitle: 'Table Footer'
});
```

### Custom header and footer views

```javascript
function createCustomView(title) {
  const view = Ti.UI.createView({
    height: 40,
    backgroundColor: '#222'
  });

  const text = Ti.UI.createLabel({
    left: 20,
    text: title,
    color: '#fff'
  });

  view.add(text);
  return view;
}

const table = Ti.UI.createTableView({
  data: data,
  headerView: createCustomView('Header View'),
  footerView: createCustomView('Footer View')
});
```

### Section headers and footers

```javascript
const data = [
  { title: 'Row 1', header: 'Section 1' },
  { title: 'Row 2' },
  { title: 'Row 3' },
  { title: 'Row 4', header: 'Section 2' },
  { title: 'Row 5' }
];

const table = Ti.UI.createTableView({ data: data });
```

## 8. Grouped table style (iOS)

```javascript
const data = [
  { title: 'row 1', header: 'Header 1' },
  { title: 'row 2' },
  { title: 'row 3' },
  { title: 'row 4', header: 'Header 2' },
  { title: 'row 5' }
];

const table = Ti.UI.createTableView({
  data: data,
  style: Ti.UI.iPhone.TableViewStyle.GROUPED
});
```

## 9. Editing mode

```javascript
table.editing = true;

// Allow row movement
table.moving = true;

// Allow deletion
const data = [
  { title: 'Row 1', canEdit: true },
  { title: 'Row 2', canEdit: false }  // Cannot be deleted
];
```

## 10. TableView events

### Click event

```javascript
table.addEventListener('click', (e) => {
  // e.index: row index
  // e.row: TableViewRow object
  // e.rowData: row data object
  // e.section: section (if using sections)

  Ti.API.info(`Clicked row: ${e.index}`);
  Ti.API.info(`Row title: ${e.row.title}`);
});
```

### Delete event

```javascript
table.addEventListener('delete', (e) => {
  Ti.API.info(`Deleted row: ${e.row.title}`);
});
```

### Scroll events

```javascript
table.addEventListener('scroll', (e) => {
  Ti.API.info(`Scrolling... y=${e.y}`);
});

table.addEventListener('scrollEnd', (e) => {
  Ti.API.info(`Scroll ended at y=${e.y}`);
});
```

## 11. Searching

```javascript
const search = Ti.UI.createSearchBar({
  top: 0,
  height: 43,
  showCancel: true
});

const table = Ti.UI.createTableView({
  search: search,  // Attach search bar
  searchHidden: false  // Initially visible
});
```

## 12. Updating table data

### Append rows

```javascript
table.appendRow({ title: 'New Row' });

// Append multiple
table.appendRow([
  { title: 'Row 1' },
  { title: 'Row 2' }
]);
```

### Insert rows

```javascript
table.insertRowBefore(2, { title: 'Inserted at index 2' });
table.insertRowAfter(5, { title: 'Inserted after index 5' });
```

### Delete rows

```javascript
table.deleteRow(3);  // Delete row at index 3

// Clear all rows
table.setData([]);
// NOT: table.data = null or undefined (causes unexpected behavior)
// Use table.setData([]) or table.data = [] to clear
```

### Update a specific row

```javascript
const data = table.data;
data[2].title = 'Updated Title';
table.setData(data);
```

## 13. TableView sections

### Create sections

```javascript
const section1 = Ti.UI.createTableViewSection({
  headerTitle: 'Section 1'
});

section1.add(Ti.UI.createTableViewRow({ title: 'Row 1' }));
section1.add(Ti.UI.createTableViewRow({ title: 'Row 2' }));

const section2 = Ti.UI.createTableViewSection({
  headerTitle: 'Section 2',
  footerTitle: 'Section Footer'
});

section2.add(Ti.UI.createTableViewRow({ title: 'Row 3' }));

const table = Ti.UI.createTableView({
  data: [section1, section2]
});
```

### Custom section headers

```javascript
const section = Ti.UI.createTableViewSection({
  headerView: createCustomView('Custom Header')
});
```

## 14. Performance optimization

### Use className

```javascript
// GOOD - Rows with same structure share className
const row1 = Ti.UI.createTableViewRow({
  title: 'Row 1',
  className: 'standardRow'
});

const row2 = Ti.UI.createTableViewRow({
  title: 'Row 2',
  // Reuses row1's template
  className: 'standardRow'
});
```

`className` lets the OS reuse scrolled-out rows for faster rendering.

### Avoid too many rows

If you have thousands of rows, consider:
- Pagination
- ListView instead
- Filtering
- Drill-down interface

### Optimize custom rows

- Test on device
- Use simple layouts
- Minimize child views per row
- Avoid nested ScrollViews

## 15. Common patterns

### Detail view navigation

```javascript
table.addEventListener('click', (e) => {
  const detailWin = Ti.UI.createWindow({
    title: e.row.title,
    backgroundColor: 'white'
  });

  const detailLabel = Ti.UI.createLabel({
    text: `Details for ${e.row.title}`
  });

  detailWin.add(detailLabel);
  detailWin.open();
});
```

### Row actions (swipe to delete)

```javascript
table.setEditable(true);

table.addEventListener('delete', () => {
  // Confirm deletion
  const dialog = Ti.UI.createAlertDialog({
    title: 'Delete',
    message: 'Delete this row?',
    buttonNames: ['Delete', 'Cancel']
  });

  dialog.addEventListener('click', (evt) => {
    if (evt.index === 0) {
      // Delete confirmed
      // e.row is automatically removed
    }
  });

  dialog.show();
});
```

### Refresh control

```javascript
const table = Ti.UI.createTableView({
  refreshControl: Ti.UI.createRefreshControl({
    tintColor: 'blue'
  })
});

table.refreshControl.addEventListener('refreshstart', () => {
  // Load data
  loadData(() => {
    table.refreshControl.endRefreshing();
  });
});
```

## 16. Platform differences

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
- Large datasets (more than 100 rows)
- Performance issues
- Need modern features (templates, binding)

Key differences:
- TableView: `data` property with row objects
- ListView: `sections` property with templates

## Best practices

1. Use ListView for new apps - better performance and features
2. Use className to enable row reuse
3. Batch updates with `setData()` instead of many `appendRow()` calls
4. Test on device; simulator performance differs
5. Limit row complexity; fewer children means better scrolling
6. Consider pagination; avoid showing thousands of rows at once
