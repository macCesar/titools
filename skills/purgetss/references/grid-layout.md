# Grid System

The grid system is a small layout tool that lets you build rows and columns with utility classes.

> **WARNING**
> PurgeTSS grid is not CSS Grid. It is a Titanium-oriented layout helper built around horizontal and vertical layout behavior.

The snippet below shows the simplest layout. From there, you can mix columns and rows as needed.

```xml
<Alloy>
  <View class="grid">
    <View class="grid-cols-4">
      <!-- Remove if you don't need a gutter between columns (or rows) -->
      <View class="gap-1">
        <!-- ANY CONTENT GOES HERE -->
      </View>
    </View>

    <View class="grid-cols-4">
      <View class="gap-1">
        <!-- ANY CONTENT GOES HERE -->
      </View>
    </View>
  </View>
</Alloy>
```

## Column Grid

### `grid-cols-{n}`

Use `grid-cols` to set how many columns fit in each row. For example, `.grid-cols-2` fits two views per row, `.grid-cols-3` fits three, and so on.

### `col-span-{n}`

Use `col-span` to set how many columns an element occupies in a 12-column grid.

If a view uses `.col-span-3`, you can add three more views of the same width to fill the row. Other combos like 3-6-3 or 2-4-6 work too, as long as the total is 12.

## Row Grid

### `grid-rows-{n}`

Use `grid-rows` to set how many rows fit in each column. For example, `.grid-rows-2` fits two views per column, `.grid-rows-3` fits three, and so on.

### `row-span-{n}`

Use `row-span` to set how many rows an element occupies in a 12-row grid.

If a view uses `.row-span-3`, you can add three more views of the same height to fill the column. Other combos like 3-6-3 or 2-4-6 work too, as long as the total is 12.

## Available Utilities

These are the available utilities to control the grid.

### Gutter Utilities

- `gap-{size}`: Change the gap between rows and columns.
- `gap-x-{size}` and `gap-y-{size}`: Change the gap between rows and columns independently.
- `gap-{side}-{size}`: Change the gap on a specific side (t=top, r=right, b=bottom, l=left).

### Column Span Utilities

- `col-span-{n}`: Make an element span `n` columns.

### Row Span Utilities

- `row-span-{n}`: Make an element span `n` rows.

### Direction Utilities

- `grid` or `grid-flow-col`: Set the layout property to horizontal.
- `grid-flow-row`: Set the layout property to vertical.

### Column Utilities

- `grid-cols-{n}`: Create grids with `n` equally sized columns.

### Row Utilities

- `grid-rows-{n}`: Create grids with `n` equally sized rows.

### Row Placement Utilities

Control horizontal alignment of elements within a row:

| Class | Effect | Use case |
| --- | --- | --- |
| `start` | Align to the start of the row | Left-aligned content |
| `end` | Align to the end of the row | Right-aligned buttons or labels |
| `center` | Align to the center of the row | Centered content blocks |

These apply to child views inside a `grid-cols-*` container and control horizontal placement within the grid cell.
