# UI/UX Design Patterns for Titanium with PurgeTSS

This guide collects practical UI patterns that stay aligned with Titanium layout behavior and verified PurgeTSS conventions.

## Core Rules

- PurgeTSS is not Tailwind CSS. Verify classes before recommending them.
- Titanium does not support Flexbox. Use `horizontal`, `vertical`, or the default composite layout.
- Do not use `p-*` on `View`, `Window`, `ScrollView`, or `TableView`. Use margins on children instead.
- Prefer `w-screen` over `w-full` when you need `Ti.UI.FILL`.
- For dynamic components, prefer `$.UI.create()` over manual `Ti.UI.create*()` styling.

## Cards

### Elevated Card

```xml
<View class="rounded-xl bg-white shadow-lg">
  <ImageView class="h-48 w-screen rounded-t-xl" image="/images/card-image.jpg" />

  <Label class="mx-4 mt-4 text-xl font-bold text-gray-800" text="Card Title" />
  <Label class="mx-4 mt-2 text-sm text-gray-600" text="Card description goes here." />

  <View class="horizontal mx-4 mt-4 mb-4">
    <Button class="rounded-lg bg-blue-500 text-white" title="Action" />
    <Button class="ml-2 rounded-lg bg-gray-200 text-gray-700" title="Learn More" />
  </View>
</View>
```

### Outlined Card

```xml
<View class="rounded-xl border-(1) border-gray-300 bg-white">
  <Label class="mx-4 mt-4 text-lg font-semibold text-gray-800" text="Outlined Card" />
  <Label class="mx-4 mt-2 mb-4 h-auto text-sm text-gray-600" text="Clean borders without elevation." />
</View>
```

### Card with Image Overlay

```xml
<View class="h-48 w-screen rounded-xl">
  <ImageView class="h-48 w-screen rounded-xl" image="/images/cover.jpg" />

  <View class="bottom-0 w-screen bg-(#88000000) rounded-b-xl">
    <Label class="mx-4 mt-4 text-xl font-bold text-white" text="Overlay Title" />
    <Label class="mx-4 mt-2 mb-4 h-auto text-sm text-gray-200" text="Subtitle text" />
  </View>
</View>
```

## Lists

### Simple List Item

```xml
<View class="border-b border-gray-200 bg-white">
  <Label class="mx-4 my-4 h-auto text-base text-gray-800" text="List item content" />
</View>
```

### List with Avatar

```xml
<View class="horizontal border-b border-gray-200 bg-white">
  <View class="ml-4 my-4 rounded-full-12 bg-blue-500">
    <Label class="center text-lg font-bold text-white" text="JD" />
  </View>

  <View class="vertical ml-3 my-4">
    <Label class="text-base font-semibold text-gray-800" text="John Doe" />
    <Label class="text-sm text-gray-500" text="john.doe@example.com" />
  </View>
</View>
```

### ListView Template

```xml
<ListView id="myList">
  <Templates>
    <ItemTemplate name="cardTemplate" class="h-20">
      <View bindId="container" class="horizontal mx-4 my-2 rounded-lg bg-white shadow-lg">
        <View bindId="iconWrap" class="ml-4 my-4 rounded-full-10 bg-blue-100">
          <Label bindId="icon" class="center fas fa-home text-blue-500" />
        </View>

        <View class="vertical ml-3 my-4">
          <Label bindId="title" class="text-base font-semibold text-gray-800" />
          <Label bindId="subtitle" class="text-sm text-gray-500" />
        </View>
      </View>
    </ItemTemplate>
  </Templates>

  <ListSection />
</ListView>
```

> **⚠️ ListView Performance**
> Prefer fixed item heights for production ListView templates. Avoid relying on `Ti.UI.SIZE` in scrolling cells when performance matters.

## Forms

### Text Input

```xml
<View class="mb-4">
  <Label class="mb-2 text-sm font-medium text-gray-700" text="Email Address" />
  <TextField class="w-screen rounded-lg border-(1) border-gray-300 bg-white px-4 py-3 text-base text-gray-800" hintText="you@example.com" keyboardType="Ti.UI.KEYBOARD_TYPE_EMAIL" autocapitalization="Ti.UI.TEXT_AUTOCAPITALIZATION_NONE" autocorrect="false" />
</View>
```

### Text Area

```xml
<View class="mb-4">
  <Label class="mb-2 text-sm font-medium text-gray-700" text="Message" />
  <TextArea class="h-32 w-screen rounded-lg border-(1) border-gray-300 bg-white px-4 py-3 text-base text-gray-800" hintText="Type your message here..." />
</View>
```

### Validation State

```xml
<View class="mb-4">
  <Label class="mb-2 text-sm font-medium text-gray-700" text="Email Address" />
  <TextField class="w-screen rounded-lg border-(1) border-red-500 bg-white px-4 py-3 text-base text-gray-800" hintText="Invalid email" />
  <Label class="mt-1 text-xs text-red-500" text="Please enter a valid email address." />
</View>
```

> **⚠️ Input Padding**
> Padding utilities (`p-`, `px-`, `py-`) work on `TextField` and `TextArea`, but NOT on `Button` (especially iOS/Mac) and NOT on container views (`View`, `Window`, `ScrollView`, `TableView`). Use margins on children to simulate internal spacing on containers.

## Buttons

### Primary Button

```xml
<Button class="rounded-lg bg-blue-500 text-base font-semibold text-white" title="Save Changes" />
```

### Secondary Button

```xml
<Button class="rounded-lg bg-gray-200 text-base font-semibold text-gray-800" title="Cancel" />
```

### Outline Button

```xml
<Button class="rounded-lg border-(1) border-blue-500 text-base font-semibold text-blue-500" title="Learn More" />
```

### Icon Button

```xml
<Button class="rounded-lg bg-blue-500 text-white" title="Save" />
<Label class="fas fa-save ml-2 text-white" />
```

## Navigation Patterns

### Top Bar with Title and Action

```xml
<View class="h-14 w-screen bg-white border-b border-gray-200">
  <Label class="left-4 center text-lg font-bold text-gray-800" text="Dashboard" />
  <Label class="right-4 center fas fa-bars text-gray-700" />
</View>
```

### Bottom Tab Bar

```xml
<View class="bottom-0 h-16 w-screen bg-white border-t border-gray-200 horizontal">
  <View class="vertical w-1/3">
    <Label class="mx-auto mt-2 fas fa-home text-blue-500" />
    <Label class="mx-auto mt-1 text-xs text-blue-500" text="Home" />
  </View>

  <View class="vertical w-1/3">
    <Label class="mx-auto mt-2 fas fa-search text-gray-400" />
    <Label class="mx-auto mt-1 text-xs text-gray-400" text="Search" />
  </View>

  <View class="vertical w-1/3">
    <Label class="mx-auto mt-2 fas fa-user text-gray-400" />
    <Label class="mx-auto mt-1 text-xs text-gray-400" text="Profile" />
  </View>
</View>
```

## Modals, Sheets, and Feedback

### Full-Screen Overlay

```xml
<View class="h-screen w-screen bg-(#88000000)">
  <View class="mx-6 mt-24 rounded-xl bg-white shadow-lg">
    <Label class="mx-4 mt-4 text-lg font-bold text-gray-800" text="Confirm Action" />
    <Label class="mx-4 mt-2 text-sm text-gray-600" text="Are you sure you want to continue?" />

    <View class="horizontal mx-4 mt-4 mb-4">
      <Button class="rounded-lg bg-gray-200 text-gray-700" title="Cancel" />
      <Button class="ml-2 rounded-lg bg-red-500 text-white" title="Delete" />
    </View>
  </View>
</View>
```

### Bottom Sheet

```xml
<View class="bottom-0 w-screen rounded-t-xl bg-white shadow-lg">
  <View class="mx-auto mt-2 h-1 w-10 rounded bg-gray-300" />
  <Label class="mx-4 mt-4 text-lg font-bold text-gray-800" text="Share" />
  <View class="vertical mx-4 mt-4 mb-4">
    <Label class="text-base text-gray-700" text="Copy link" />
    <Label class="mt-3 text-base text-gray-700" text="Send message" />
    <Label class="mt-3 text-base text-gray-700" text="Open in browser" />
  </View>
</View>
```

### Snackbar

```xml
<View id="snackbar" class="bottom-4 left-4 right-4 hidden rounded-lg bg-gray-800 shadow-lg">
  <View class="horizontal">
    <Label class="mx-4 my-4 h-auto text-base text-white" text="File deleted successfully" />
    <Label id="undoBtn" class="my-4 mr-4 h-auto text-base font-semibold text-blue-400" text="UNDO" />
  </View>
</View>
```

## Layout Patterns

### Standard Screen Layout

```xml
<Window class="bg-gray-100">
  <View class="vertical h-screen w-screen">
    <View class="h-14 w-screen border-b border-gray-200 bg-white">
      <Label class="left-4 center text-xl font-bold text-gray-800" text="Screen Title" />
    </View>

    <ScrollView class="h-screen w-screen">
      <View class="vertical">
        <Label class="mx-4 mt-4 text-base text-gray-700" text="Main content goes here." />
      </View>
    </ScrollView>
  </View>
</Window>
```

### Two-Column Tablet Layout

```xml
<View class="horizontal w-screen">
  <View class="tablet:w-(30%) handheld:w-screen bg-white">
    <Label class="mx-4 my-4 text-base font-semibold text-gray-800" text="Sidebar" />
  </View>

  <View class="tablet:w-(70%) handheld:w-screen bg-gray-50">
    <Label class="mx-4 my-4 text-base text-gray-700" text="Main content" />
  </View>
</View>
```

### Percentage Layout

```xml
<View class="horizontal w-screen">
  <View class="w-(48%) mr-2 rounded-lg bg-blue-100">
    <Label class="mx-4 my-4 text-blue-700" text="Left panel" />
  </View>

  <View class="w-(48%) ml-2 rounded-lg bg-green-100">
    <Label class="mx-4 my-4 text-green-700" text="Right panel" />
  </View>
</View>
```

## Typography and Icons

### Typography Scale

- `text-xs`: 12px
- `text-sm`: 14px
- `text-base`: 16px
- `text-lg`: 18px
- `text-xl`: 20px
- `text-2xl`: 24px
- `text-3xl`: 30px

### Icon Pattern

```xml
<View class="horizontal">
  <Label class="fas fa-envelope mr-2 text-gray-600" />
  <Label class="text-gray-800" text="Email" />
</View>
```

## Accessibility

- Keep primary touch targets around `44x44` or larger.
- Pair icons with visible labels or `accessibilityLabel` values.
- Preserve contrast between text and background.
- Avoid using color alone for validation or state.

Example:

```xml
<Button class="h-12 rounded-lg bg-blue-500 text-white" title="Continue" accessibilityLabel="Continue to next step" />
```

## Performance Notes

- Prefer `ListView` templates for long lists.
- Use fixed heights for high-density scrolling content when possible.
- Avoid manual inline styling when a class can express the same result.
- Keep overlays and large composited layouts simple on lower-end devices.

## Quick Reference

| Need | Preferred Pattern |
| --- | --- |
| Full-width container | `w-screen` |
| Stack items vertically | `vertical` |
| Row of actions | `horizontal` |
| Fill space in overlay/modal | `h-screen w-screen` |
| Card spacing | Margins on children |
| Input inner spacing | `px-*`, `py-*` on input controls |
| Tablet adaptation | `tablet:*`, `handheld:*` |
| Overlay background | `bg-(#88000000)` |

> **⚠️ Common Pitfalls**
> - Do not use `md:*`, `lg:*`, `focus:*`, or other web-responsive/state prefixes.
> - Do not assume `w-full` behaves like `Ti.UI.FILL`.
> - Do not put `p-*` on container views.
> - Do not rely on Flexbox classes such as `flex-row`, `justify-between`, or `items-center`.
