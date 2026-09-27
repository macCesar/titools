# Grid System

The grid system is a small layout tool that lets you build rows and columns with utility classes.

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

> **Visual Reference**
> The official PurgeTSS docs ship a screenshot at `images/grid-system-example.png` (in the docs source repo) that visualizes how columns, rows, and spans render in a real Alloy view. Consult it when you need a quick mental model of the layout primitives — it is not embedded here, only referenced.

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

The official source organizes the grid utilities into these categories. The structure below mirrors the official rewrite so you can map directly between this reference and the upstream docs.

### Direction Utilities

- `grid` or `grid-flow-col`: Set the layout property to horizontal.
- `grid-flow-row`: Set the layout property to vertical.

### Column Utilities

- `grid-cols-{n}`: Create grids with `n` equally sized columns.

### Row Utilities

- `grid-rows-{n}`: Create grids with `n` equally sized rows.

### Column Span Utilities

- `col-span-{n}`: Make an element span `n` columns inside a 12-column grid.

### Row Span Utilities

- `row-span-{n}`: Make an element span `n` rows inside a 12-row grid.

### Gutter Utilities

- `gap-{size}`: Change the gap between rows and columns.
- `gap-x-{size}` and `gap-y-{size}`: Change the gap between rows and columns independently.
- `gap-{side}-{size}`: Change the gap on a specific side (`t`=top, `r`=right, `b`=bottom, `l`=left).

### Row Placement Utilities

The grid alignment classes PurgeTSS generates are:

| Class          | Generated rule                                  |
| -------------- | ----------------------------------------------- |
| `items-start`  | `{ top: 0 }`                                    |
| `items-end`    | `{ bottom: 0 }`                                 |
| `items-center` | `{ width: Ti.UI.FILL, height: Ti.UI.FILL }`     |

## Row Span Use Cases

`grid-rows-{n}` and `row-span-{n}` both set a percentage `height` on the view that carries them; neither one declares a row count for its children. `grid-rows-{n}` gives `100/n %` (`grid-rows-2` → `50%`), and `row-span-{n}` always gives `n/12` of the parent (`row-span-3` → `25%`), whatever `grid-rows-*` class appears elsewhere. To stack the children vertically, give the parent `grid-flow-row` (`layout: 'vertical'`, `height: '100%'`).

| Pattern                                  | Children of a `grid-flow-row` parent            | Result                          |
| ---------------------------------------- | ----------------------------------------------- | ------------------------------- |
| Full-height item                         | `grid-rows-1` or `row-span-12`                  | One view at `100%`              |
| Two equal stacked items                  | `grid-rows-2` on each child                     | `50%` + `50%`                   |
| Tall hero on top, short footer at bottom | `row-span-9`, `row-span-3`                      | `75%` + `25%`                   |
| 3-6-3 vertical split                     | `row-span-3`, `row-span-6`, `row-span-3`        | `25%` + `50%` + `25%`           |
| Two short rows above a tall row          | `row-span-3`, `row-span-3`, `row-span-6`        | `25%` + `25%` + `50%`           |

> **Note**
> Just like `col-span-{n}` in a row, the `row-span-{n}` values in a column must add up to 12 to fill it without leftover space.

## Community-Discovered Patterns

The following notes come from community experience using the PurgeTSS grid system in Titanium projects. They clarify how the grid relates to Titanium's layout engine (not CSS Grid) and offer common use cases for row placement.

> **WARNING**
> PurgeTSS grid is not CSS Grid. It is a Titanium-oriented layout helper built around horizontal and vertical layout behavior.

### Common Use Cases for Row Placement

| Class          | Use case                                                        |
| -------------- | --------------------------------------------------------------- |
| `items-start`  | Pin a view to the top of its cell (`top: 0`)                    |
| `items-end`    | Pin a view to the bottom of its cell (`bottom: 0`)              |
| `items-center` | Fill the cell (`width` and `height` set to `Ti.UI.FILL`)        |
