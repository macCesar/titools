# Grid Layout System

The PurgeTSS grid system is a layout tool with utilities to lay out columns and rows using Titanium's layout properties.

:::caution Not CSS Grid
**PurgeTSS grid does NOT work like CSS Grid.** Titanium lacks native CSS Grid support. The PurgeTSS grid system is an abstraction using `horizontal` and `vertical` layouts with percentage widths and margins.
:::

## Basic Structure

This is the most basic layout for using the grid system:

```xml
<Alloy>
  <View class='grid'>
    <View class="grid-cols-4">
      <!-- Remove gap View if you don't need gutters between columns -->
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

### `.grid-cols-{n}`

With `grid-cols`, you tell the grid system how many columns you want to fit in each row:

- `grid-cols-1` - 1 column per row (100% width each)
- `grid-cols-2` - 2 columns per row (50% width each)
- `grid-cols-3` - 3 columns per row (33.33% width each)
- `grid-cols-4` - 4 columns per row (25% width each)
- And so on...

```xml
<View class="grid">
  <View class="grid-cols-2">
    <!-- Each view is 50% width -->
  </View>
  <View class="grid-cols-2">
    <!-- Each view is 50% width -->
  </View>
</View>
```

### `.col-span-{n}`

With `col-span`, you set the number of columns each element will occupy in a **12-column grid**:

- `col-span-1` - Spans 1 column (8.33% width)
- `col-span-2` - Spans 2 columns (16.66% width)
- `col-span-3` - Spans 3 columns (25% width)
- `col-span-4` - Spans 4 columns (33.33% width)
- `col-span-6` - Spans 6 columns (50% width)
- `col-span-12` - Spans 12 columns (100% width)

If you set a view with `.col-span-3`, you can add three more views of equal width to fill the row, or any other combination like 3-6-3, 2-4-6, etc., as long as the sum fills a **12-column grid**.

```xml
<!-- 12-column grid examples -->
<View class="grid">
  <!-- 3 + 3 + 3 + 3 = 12 -->
  <View class="col-span-3">...</View>
  <View class="col-span-3">...</View>
  <View class="col-span-3">...</View>
  <View class="col-span-3">...</View>
</View>

<View class="grid">
  <!-- 6 + 6 = 12 -->
  <View class="col-span-6">...</View>
  <View class="col-span-6">...</View>
</View>

<View class="grid">
  <!-- 4 + 4 + 4 = 12 -->
  <View class="col-span-4">...</View>
  <View class="col-span-4">...</View>
  <View class="col-span-4">...</View>
</View>
```

## Row Grid

### `.grid-rows-{n}`

With `grid-rows`, you tell the grid system how many rows you want to fit in each column:

- `grid-rows-2` - 2 rows per column
- `grid-rows-3` - 3 rows per column
- And so on...

```xml
<View class="grid-flow-row">
  <View class="grid-rows-2">
    <!-- Each view is 50% height -->
  </View>
  <View class="grid-rows-2">
    <!-- Each view is 50% height -->
  </View>
</View>
```

### `.row-span-{n}`

With `row-span`, you set the number of rows each element will occupy in a **12-row grid**:

- `row-span-1` through `row-span-12`

If you set a view with `.row-span-3`, you can add three more views of equal height to fill the column, or any other combination like 3-6-3, 2-4-6, etc., as long as the sum fills a **12-row grid**.

```xml
<!-- 12-row grid example -->
<View class="grid-flow-row">
  <!-- 6 + 6 = 12 -->
  <View class="row-span-6">...</View>
  <View class="row-span-6">...</View>
</View>
```

## Gutter Utilities

The gap utilities add spacing between grid items.

:::warning Important Note on Gaps
**`gap-{size}` adds margin to ALL sides** (top, right, bottom, left), not just between elements. This is different from CSS gap and can cause layout issues if not used carefully.
:::

### Available Gap Utilities

- **`gap-{size}`** - Gap between rows and columns
- **`gap-x-{size}`** - Gap between columns only
- **`gap-y-{size}`** - Gap between rows only
- **`gap-t-{size}`** - Gap on top side
- **`gap-r-{size}`** - Gap on right side
- **`gap-b-{size}`** - Gap on bottom side
- **`gap-l-{size}`** - Gap on left side

```xml
<View class="grid">
  <View class="gap-1">
    <!-- 4px margin on all sides -->
  </View>
  <View class="gap-1">
    <!-- 4px margin on all sides -->
  </View>
</View>
```

## Direction Utilities

Control the flow direction of the grid:

- **`.grid`** or **`.grid-flow-col`** - Sets `layout: 'horizontal'` (columns flow left to right)
- **`.grid-flow-row`** - Sets `layout: 'vertical'` (rows flow top to bottom)

```xml
<!-- Horizontal grid (default) -->
<View class="grid">
  <View class="col-span-6">...</View>
  <View class="col-span-6">...</View>
</View>

<!-- Vertical grid -->
<View class="grid-flow-row">
  <View class="row-span-6">...</View>
  <View class="row-span-6">...</View>
</View>
```

## Alignment Utilities

Align items within the grid:

- **`.start`** - Aligns element to the start of a row
- **`.center`** - Aligns element to the center of a row
- **`.end`** - Aligns element to the end of a row

```xml
<View class="grid">
  <View class="col-span-4 start">...</View>
  <View class="col-span-4 center">...</View>
  <View class="col-span-4 end">...</View>
</View>
```

## Common Layout Patterns

### Two-Column Layout

```xml
<View class="grid">
  <View class="col-span-6 bg-blue-100">
    <Label text="Left Column" />
  </View>
  <View class="col-span-6 bg-green-100">
    <Label text="Right Column" />
  </View>
</View>
```

### Three-Column Layout

```xml
<View class="grid">
  <View class="col-span-4 bg-blue-100">
    <Label text="Column 1" />
  </View>
  <View class="col-span-4 bg-green-100">
    <Label text="Column 2" />
  </View>
  <View class="col-span-4 bg-red-100">
    <Label text="Column 3" />
  </View>
</View>
```

### Sidebar + Main Content

```xml
<View class="grid">
  <View class="col-span-3 bg-gray-100">
    <Label text="Sidebar" />
  </View>
  <View class="col-span-9 bg-white">
    <Label text="Main Content" />
  </View>
</View>
```

### Asymmetric Layout

```xml
<View class="grid">
  <View class="col-span-8 bg-blue-100">
    <Label text="Wide Column" />
  </View>
  <View class="col-span-4 bg-green-100">
    <Label text="Narrow Column" />
  </View>
</View>
```

## Grid System Pitfalls and Solutions

### Problem: Gap Breaks Percentage Widths

```xml
<!-- ❌ This may overflow -->
<View class="grid grid-cols-2">
  <View class="gap-2 col-span-6">
    <!-- 50% width + 8px margin all sides = overflow -->
  </View>
  <View class="gap-2 col-span-6">
    <!-- Same issue -->
  </View>
</View>
```

**Solution**: Use explicit widths with margins

```xml
<!-- ✅ Better approach -->
<View class="horizontal w-screen">
  <View class="w-(48%) mr-2">
    <!-- Card 1 -->
  </View>
  <View class="w-(48%) ml-2">
    <!-- Card 2 -->
  </View>
</View>
```

### Problem: Grid Without w-screen

```xml
<!-- ❌ Parent doesn't have explicit width -->
<View>
  <View class="grid grid-cols-2">
    <!-- Percentage widths may not work correctly -->
  </View>
</View>
```

**Solution**: Add `w-screen` to parent

```xml
<!-- ✅ Parent has explicit width -->
<View class="w-screen">
  <View class="grid grid-cols-2">
    <!-- Percentage widths work correctly -->
  </View>
</View>
```

### Problem: Missing Gap Container

```xml
<!-- ❌ Gap not applied correctly -->
<View class="grid">
  <View class="col-span-6 bg-white">
    <!-- Content -->
  </View>
</View>
```

**Solution**: Wrap content in gap View

```xml
<!-- ✅ Correct structure -->
<View class="grid">
  <View class="col-span-6">
    <View class="gap-2 bg-white">
      <!-- Content -->
    </View>
  </View>
</View>
```

## When to Use Grid vs. Manual Layout

### Use Grid System When:
- You need simple column layouts (2, 3, 4 columns)
- Content is uniform in size
- You don't need complex gutters
- Building a dashboard or card grid

### Use Manual Layout When:
- You need precise control over spacing
- Using percentage widths with margins
- Creating adaptive layouts (tablet vs handheld)
- Dealing with complex responsive behavior

```xml
<!-- Manual layout for more control -->
<View class="horizontal w-screen mb-4">
  <View class="w-(48%) mr-2 rounded-xl bg-white shadow vertical">
    <!-- Card content -->
  </View>
  <View class="w-(48%) ml-2 rounded-xl bg-white shadow vertical">
    <!-- Card content -->
  </View>
</View>
```

## Complete Utility Reference

| Utility | Purpose | Example |
|---------|---------|---------|
| `.grid` | Horizontal layout | `<View class="grid">` |
| `.grid-flow-col` | Horizontal layout | `<View class="grid-flow-col">` |
| `.grid-flow-row` | Vertical layout | `<View class="grid-flow-row">` |
| `.grid-cols-{n}` | N columns per row | `<View class="grid-cols-2">` |
| `.grid-rows-{n}` | N rows per column | `<View class="grid-rows-2">` |
| `.col-span-{n}` | Span N columns (12-grid) | `<View class="col-span-6">` |
| `.row-span-{n}` | Span N rows (12-grid) | `<View class="row-span-6">` |
| `.gap-{size}` | Gap all sides | `<View class="gap-4">` |
| `.gap-x-{size}` | Gap horizontal | `<View class="gap-x-4">` |
| `.gap-y-{size}` | Gap vertical | `<View class="gap-y-4">` |
| `.start` | Align to start | `<View class="start">` |
| `.center` | Align to center | `<View class="center">` |
| `.end` | Align to end | `<View class="end">` |

## Real-World Example

```xml
<Alloy>
  <Window class="bg-gray-100">
    <ScrollView class="vertical h-screen w-screen">

      <!-- Header -->
      <View class="bg-white p-4">
        <Label class="text-xl font-bold text-gray-800" text="Dashboard" />
      </View>

      <!-- Stats Grid -->
      <View class="grid m-4">
        <View class="col-span-6">
          <View class="gap-2 bg-white rounded-lg p-4">
            <Label class="text-2xl font-bold text-blue-600" text="1,234" />
            <Label class="text-sm text-gray-500" text="Total Users" />
          </View>
        </View>
        <View class="col-span-6">
          <View class="gap-2 bg-white rounded-lg p-4">
            <Label class="text-2xl font-bold text-green-600" text="$56.7k" />
            <Label class="text-sm text-gray-500" text="Revenue" />
          </View>
        </View>
      </View>

      <!-- Three Column Section -->
      <View class="grid m-4">
        <View class="col-span-4">
          <View class="gap-2 bg-white rounded-lg p-4 h-32">
            <Label class="text-center text-gray-800" text="Card 1" />
          </View>
        </View>
        <View class="col-span-4">
          <View class="gap-2 bg-white rounded-lg p-4 h-32">
            <Label class="text-center text-gray-800" text="Card 2" />
          </View>
        </View>
        <View class="col-span-4">
          <View class="gap-2 bg-white rounded-lg p-4 h-32">
            <Label class="text-center text-gray-800" text="Card 3" />
          </View>
        </View>
      </View>

    </ScrollView>
  </Window>
</Alloy>
```
