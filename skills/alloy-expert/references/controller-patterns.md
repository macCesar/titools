# PurgeTSS Implementation Patterns

## Standard PurgeTSS View Template

```xml
<!-- views/user/card.xml -->
<Alloy>
  <View class="m-2 bg-white rounded-xl shadow-md border-(1) border-gray-200">
    <View class="horizontal w-screen m-3">
      <Label class="fa-solid fa-user-circle text-4xl text-blue-500" />
      <View class="vertical ml-3">
        <Label id="name" class="text-lg font-bold text-gray-900" />
        <Label id="email" class="text-sm text-gray-500" />
      </View>
    </View>
    <Button class="mt-4 mx-3 mb-3 w-screen h-10 bg-blue-600 rounded-md text-white font-medium"
      title="L('view_profile')"
      onClick="onViewProfile"
    />
  </View>
</Alloy>
```

**PurgeTSS Layout Rules:**
- Use `horizontal` (not `flex-row`) for left-to-right
- Use `vertical` (not `flex-col`) for top-to-bottom
- Omit layout class for composite (absolute positioning)
- Use `m-*` on children instead of `p-*` on parent
- Use `border-(1)` with parentheses for arbitrary values

## Animation Component Usage

Always prefer the PurgeTSS Animation component over manual matrix calculations.

```xml
<Animation id="myAnim" module="purgetss.ui" class="open:fade-in close:fade-out duration-500" />
```

```javascript
// controllers/user/card.js
function show() {
  $.myAnim.open($.container)
}

function hide() {
  $.myAnim.close($.container, () => {
    $.container.applyProperties({ visible: false })
  })
}
```

## Draggable Method
Use the `draggable` method to convert views into draggable elements.

```javascript
$.myAnim.draggable([$.red, $.green, $.blue])
```

## Dynamic Styling with Classes

To change styles dynamically, use `classes` instead of individual property updates.

```javascript
function setStatus(isActive) {
  $.statusLabel.applyProperties({
    classes: isActive ? ['text-green-500'] : ['text-red-500'],
    text: isActive ? L('active') : L('inactive')
  })
}
```

## Grid System

Use PurgeTSS percentage-based widths for responsive layouts.

```xml
<!-- Horizontal layout with percentage widths -->
<View class="horizontal w-screen">
  <View class="w-8/12 h-20 bg-red-100" />
  <View class="w-4/12 h-20 bg-blue-100" />
</View>

<!-- Or use the grid-cols system -->
<View class="grid-cols-3 gap-2 w-screen">
  <View class="h-20 bg-red-100" />
  <View class="h-20 bg-blue-100" />
  <View class="h-20 bg-green-100" />
</View>
```