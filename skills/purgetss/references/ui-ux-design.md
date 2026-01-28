# UI/UX Design Patterns for Titanium SDK with PurgeTSS

A comprehensive guide to building beautiful, accessible, and performant mobile UIs using Titanium SDK and PurgeTSS utility classes.

## Table of Contents

- [UI/UX Design Patterns for Titanium SDK with PurgeTSS](#uiux-design-patterns-for-titanium-sdk-with-purgetss)
  - [Table of Contents](#table-of-contents)
  - [1. Common UI Components](#1-common-ui-components)
    - [Cards](#cards)
      - [Elevated Card](#elevated-card)
      - [Outlined Card](#outlined-card)
      - [Card with Image Overlay](#card-with-image-overlay)
      - [Horizontal Card](#horizontal-card)
    - [Lists](#lists)
      - [Simple List Item](#simple-list-item)
      - [List with Avatar](#list-with-avatar)
      - [List with Actions](#list-with-actions)
      - [List with Dividers](#list-with-dividers)
      - [ListView with Custom Template](#listview-with-custom-template)
    - [Forms](#forms)
      - [Text Input](#text-input)
      - [Text Area](#text-area)
      - [Password Input](#password-input)
      - [Select/Dropdown (using Picker)](#selectdropdown-using-picker)
      - [Switch Toggle](#switch-toggle)
      - [Slider](#slider)
      - [Form with Validation States](#form-with-validation-states)
      - [Form Section](#form-section)
    - [Buttons](#buttons)
      - [Primary Button](#primary-button)
      - [Secondary Button](#secondary-button)
      - [Outline Button](#outline-button)
      - [Text Button](#text-button)
      - [Icon Button](#icon-button)
      - [Floating Action Button (FAB)](#floating-action-button-fab)
      - [Button with Icon](#button-with-icon)
      - [Button Group](#button-group)
      - [Button Sizes](#button-sizes)
    - [Navigation Bars](#navigation-bars)
      - [Top Navigation Bar with Title](#top-navigation-bar-with-title)
      - [Navigation Bar with Actions](#navigation-bar-with-actions)
      - [Tab Bar (Bottom)](#tab-bar-bottom)
      - [Segment Control](#segment-control)
      - [Breadcrumb Navigation](#breadcrumb-navigation)
    - [Modals and Dialogs](#modals-and-dialogs)
      - [Alert Dialog](#alert-dialog)
      - [Full Screen Modal (iOS)](#full-screen-modal-ios)
      - [Bottom Sheet (Android-style)](#bottom-sheet-android-style)
    - [Toasts and Snackbars](#toasts-and-snackbars)
      - [Simple Toast](#simple-toast)
      - [Custom Snackbar](#custom-snackbar)
      - [Success Toast](#success-toast)
      - [Error Toast](#error-toast)
  - [2. Layout Patterns](#2-layout-patterns)
    - [Screen Structure](#screen-structure)
      - [Standard Screen Layout](#standard-screen-layout)
      - [Tab Bar Screen Structure](#tab-bar-screen-structure)
    - [Spacing System](#spacing-system)
      - [Margin Examples](#margin-examples)
      - [Padding Examples](#padding-examples)
      - [Gap (Spacing between children)](#gap-spacing-between-children)
    - [Responsive Patterns](#responsive-patterns)
      - [Responsive Grid](#responsive-grid)
      - [Adaptive Layout (Tablet vs Phone)](#adaptive-layout-tablet-vs-phone)
      - [Percentage-Based Widths](#percentage-based-widths)
  - [3. Typography](#3-typography)
    - [Font Scales](#font-scales)
      - [Typography Examples](#typography-examples)
    - [Font Weights](#font-weights)
    - [Text Alignment and Truncation](#text-alignment-and-truncation)
      - [Text Alignment](#text-alignment)
      - [Text Truncation](#text-truncation)
      - [Text Transformations](#text-transformations)
  - [4. Colors and Themes](#4-colors-and-themes)
    - [Semantic Color Naming](#semantic-color-naming)
      - [Primary Colors](#primary-colors)
      - [Semantic Colors](#semantic-colors)
    - [Dark Mode Considerations](#dark-mode-considerations)
    - [Platform-Specific Colors](#platform-specific-colors)
      - [iOS System Colors](#ios-system-colors)
      - [Material Design Colors](#material-design-colors)
  - [5. Icons](#5-icons)
    - [Font Awesome 7 Icon Fonts](#font-awesome-7-icon-fonts)
    - [Icon Sizing and Alignment](#icon-sizing-and-alignment)
      - [Icon Sizes](#icon-sizes)
      - [Icon Colors](#icon-colors)
    - [Icon with Text Patterns](#icon-with-text-patterns)
      - [Icon with Label](#icon-with-label)
      - [Circular Icon Button](#circular-icon-button)
      - [Icon Badge](#icon-badge)
      - [Icon Group](#icon-group)
  - [6. Accessibility](#6-accessibility)
    - [Accessibility Labels](#accessibility-labels)
    - [Touch Target Sizes](#touch-target-sizes)
    - [Color Contrast](#color-contrast)
    - [Screen Reader Support](#screen-reader-support)
  - [7. Performance Best Practices](#7-performance-best-practices)
    - [ListView Performance](#listview-performance)
    - [View Recycling](#view-recycling)
    - [Batch Updates](#batch-updates)
    - [Minimize Template Count](#minimize-template-count)
  - [8. Platform-Specific Patterns](#8-platform-specific-patterns)
    - [iOS Patterns](#ios-patterns)
      - [Navigation Window](#navigation-window)
      - [Tab Bar](#tab-bar)
      - [iOS Swipe Actions](#ios-swipe-actions)
    - [Android Patterns](#android-patterns)
      - [Action Bar](#action-bar)
      - [Back Button Handling](#back-button-handling)
      - [Material Design Theme](#material-design-theme)
      - [Notifications](#notifications)
  - [Quick Reference Card](#quick-reference-card)
    - [Common PurgeTSS Classes](#common-purgetss-classes)
    - [Platform Modifiers](#platform-modifiers)
  - [Best Practices Summary](#best-practices-summary)
  - [Additional Resources](#additional-resources)

---

## 1. Common UI Components

### Cards

Cards are versatile containers for content and actions on a single subject.

#### Elevated Card

```xml
<View class="mb-4 rounded-xl bg-white shadow-lg">
  <ImageView class="mb-4 h-48 w-full rounded-lg" image="/images/card-image.jpg" />
  <Label class="mb-2 text-xl font-bold text-gray-800" text="Card Title" />
  <Label class="mb-4 text-sm text-gray-600" text="Card description goes here with details about the content." />
  <View class="horizontal mt-4">
    <Button class="bg-brand-500 mr-2 rounded-lg px-4 py-2 text-white" title="Action" />
    <Button class="rounded-lg bg-gray-200 px-4 py-2 text-gray-700" title="Learn More" />
  </View>
</View>
```

#### Outlined Card

```xml
<View class="mb-4 rounded-xl border border-gray-300 bg-white">
  <Label class="mb-2 text-lg font-semibold text-gray-800" text="Outlined Card" />
  <Label class="text-sm text-gray-600" text="Clean borders without elevation" />
</View>
```

#### Card with Image Overlay

```xml
<View class="relative mb-4 h-64 overflow-hidden rounded-xl">
  <ImageView class="absolute left-0 top-0 h-full w-full" image="/images/cover.jpg" />
  <View class="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent">
    <Label class="mb-4 ml-4 text-xl font-bold text-white" text="Overlay Title" />
    <Label class="mb-4 ml-4 text-sm text-gray-200" text="Subtitle text" />
  </View>
</View>
```

#### Horizontal Card

```xml
<View class="horizontal mb-3 rounded-lg bg-white shadow">
  <ImageView class="ml-3 mr-4 h-20 w-20 rounded-lg" image="/images/thumbnail.jpg" />
  <View class="vertical mr-3 w-full">
    <Label class="text-lg font-semibold text-gray-800" text="Title" />
    <Label class="text-sm text-gray-600" text="Description text that wraps to multiple lines if needed" />
    <Label class="text-brand-500 mt-1 text-xs" text="Read more →" />
  </View>
</View>
```

### Lists

Lists display multiple items vertically and are essential for mobile UIs.

#### Simple List Item

```xml
<View class="border-b border-gray-200 bg-white">
  <Label class="mx-4 my-4 text-base text-gray-800" text="List item content" />
</View>
```

#### List with Avatar

```xml
<View class="horizontal border-b border-gray-200 bg-white">
  <View class="bg-brand-500 ml-4 mr-4 h-12 w-12 rounded-full">
    <Label class="center text-lg font-bold text-white" text="JD" />
  </View>
  <View class="vertical mr-4">
    <Label class="text-base font-semibold text-gray-800" text="John Doe" />
    <Label class="text-sm text-gray-500" text="john.doe@example.com" />
  </View>
</View>
```

#### List with Actions

```xml
<View class="border-b border-gray-200 bg-white">
  <View class="horizontal">
    <View class="horizontal">
      <View class="ml-4 mr-4 h-12 w-12 rounded-lg bg-blue-100">
        <Label class="center fas fa-folder text-xl text-blue-500" />
      </View>
      <View class="vertical">
        <Label class="text-base font-semibold text-gray-800" text="Project Folder" />
        <Label class="text-sm text-gray-500" text="24 files" />
      </View>
    </View>
    <Label class="fas fa-chevron-right mr-4 text-gray-400" />
  </View>
</View>
```

#### List with Dividers

```xml
<View class="bg-white">
  <!-- Item 1 -->
  <View class="border-b border-gray-100">
    <Label class="mx-4 my-4 text-base text-gray-800" text="Item 1" />
  </View>
  <!-- Item 2 -->
  <View class="border-b border-gray-100">
    <Label class="mx-4 my-4 text-base text-gray-800" text="Item 2" />
  </View>
  <!-- Item 3 -->
  <View>
    <Label class="mx-4 my-4 text-base text-gray-800" text="Item 3" />
  </View>
</View>
```

#### ListView with Custom Template

```xml
<ListView id="myList" defaultItemTemplate="cardTemplate">
  <Templates>
    <ItemTemplate name="cardTemplate" class="h-auto">
      <View bindId="container" class="mx-4 mb-2 rounded-lg bg-white shadow">
        <View class="horizontal">
          <View bindId="iconContainer" class="bg-brand-100 mr-3 h-10 w-10 rounded-full">
            <Label bindId="icon" class="center fas fa-home text-brand-500" />
          </View>
          <View class="vertical">
            <Label bindId="title" class="text-base font-semibold text-gray-800" />
            <Label bindId="subtitle" class="text-sm text-gray-500" />
          </View>
        </View>
      </View>
    </ItemTemplate>
  </Templates>
  <ListSection/>
</ListView>
```

```javascript
// Controller
const items = [
  {
    container: {},
    icon: { text: "\uf015" },  // fa-home
    title: { text: "Item 1" },
    subtitle: { text: "First item description" }
  },
  {
    container: {},
    icon: { text: "\uf007" },  // fa-user
    title: { text: "Item 2" },
    subtitle: { text: "Second item description" }
  }
]

$.myList.sections[0].setItems(items)
```

### Forms

Forms collect user input through various controls.

#### Text Input

```xml
<View class="mb-4">
  <Label class="mb-2 text-sm font-medium text-gray-700" text="Email Address" />
  <TextField class="focus:border-brand-500 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-800" hintText="you@example.com" keyboardType="Ti.UI.KEYBOARD_TYPE_EMAIL" autocapitalization="Ti.UI.TEXT_AUTOCAPITALIZATION_NONE" autocorrect="false" />
</View>
```

#### Text Area

```xml
<View class="mb-4">
  <Label class="mb-2 text-sm font-medium text-gray-700" text="Message" />
  <TextArea class="h-32 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-800" hintText="Type your message here..." autocapitalization="Ti.UI.TEXT_AUTOCAPITALIZATION_SENTENCES" />
</View>
```

#### Password Input

```xml
<View class="mb-4">
  <Label class="mb-2 text-sm font-medium text-gray-700" text="Password" />
  <TextField class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-800" passwordMask="true" hintText="Enter password" />
</View>
```

#### Select/Dropdown (using Picker)

```xml
<View class="mb-4">
  <Label class="mb-2 text-sm font-medium text-gray-700" text="Category" />
  <Picker class="w-full rounded-lg border border-gray-300 bg-white" selectionIndicator="true">
    <PickerRow title="Option 1" />
    <PickerRow title="Option 2" />
    <PickerRow title="Option 3" />
  </Picker>
</View>
```

#### Switch Toggle

```xml
<View class="horizontal mb-4 rounded-lg border border-gray-200 bg-white">
  <View class="vertical">
    <Label class="text-base font-medium text-gray-800" text="Notifications" />
    <Label class="text-sm text-gray-500" text="Receive push notifications" />
  </View>
  <Switch class="ml-4" value="true" />
</View>
```

#### Slider

```xml
<View class="mb-4">
  <View class="horizontal mb-2">
    <Label class="text-sm font-medium text-gray-700" text="Volume" />
    <Label id="sliderValue" class="ml-auto text-sm text-gray-500" text="50%" />
  </View>
  <Slider class="w-full" min="0" max="100" value="50" />
</View>
```

#### Form with Validation States

```xml
<!-- Error State -->
<View class="mb-4">
  <Label class="mb-2 text-sm font-medium text-red-600" text="Email Address" />
  <TextField class="w-full rounded-lg border border-red-500 bg-white px-4 py-3 text-base" hintText="Invalid email" />
  <Label class="mt-1 text-xs text-red-500" text="Please enter a valid email address" />
</View>

<!-- Success State -->
<View class="mb-4">
  <Label class="mb-2 text-sm font-medium text-green-600" text="Email Address" />
  <TextField class="w-full rounded-lg border border-green-500 bg-white px-4 py-3 text-base" hintText="Valid email" />
  <Label class="fas fa-check-circle mt-1 text-xs text-green-500" text=" Valid email" />
</View>
```

#### Form Section

```xml
<View class="mb-6 rounded-lg bg-white shadow">
  <Label class="mx-6 mb-6 mt-6 text-xl font-bold text-gray-800" text="Account Information" />

  <View class="mb-4">
    <Label class="mb-2 text-sm font-medium text-gray-700" text="Full Name" />
    <TextField class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3" hintText="John Doe" />
  </View>

  <View class="mb-4">
    <Label class="mb-2 text-sm font-medium text-gray-700" text="Email" />
    <TextField class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3" hintText="john@example.com" keyboardType="Ti.UI.KEYBOARD_TYPE_EMAIL" />
  </View>

  <View class="mb-6">
    <Label class="mb-2 text-sm font-medium text-gray-700" text="Phone" />
    <TextField class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3" hintText="+1 (555) 000-0000" keyboardType="Ti.UI.KEYBOARD_TYPE_PHONE" />
  </View>

  <Button class="bg-brand-500 w-full rounded-lg py-3 text-base font-semibold text-white" title="Save Changes" />
</View>
```

### Buttons

Buttons trigger actions and are primary interactive elements.

#### Primary Button

```xml
<Button class="bg-brand-500 rounded-lg px-6 py-3 text-base font-semibold text-white shadow-md" title="Primary Action" />
```

#### Secondary Button

```xml
<Button class="rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-700" title="Secondary Action" />
```

#### Outline Button

```xml
<Button class="border-brand-500 text-brand-500 rounded-lg border-2 bg-transparent px-6 py-3 text-base font-semibold" title="Outline" />
```

#### Text Button

```xml
<Button class="text-brand-500 bg-transparent text-base font-semibold" title="Text Only" />
```

#### Icon Button

```xml
<View class="bg-brand-500 h-12 w-12 rounded-full">
  <Label class="center fas fa-plus text-xl text-white" />
</View>
```

#### Floating Action Button (FAB)

```xml
<View class="absolute bottom-6 right-6">
  <View class="bg-brand-500 h-14 w-14 rounded-full shadow-lg">
    <Label class="center fas fa-plus text-2xl text-white" />
  </View>
</View>
```

#### Button with Icon

```xml
<View class="horizontal bg-brand-500 rounded-lg px-6 py-3 shadow-md">
  <Label class="fas fa-arrow-left mr-2 text-lg text-white" />
  <Label class="text-base font-semibold text-white" text="Back" />
</View>
```

#### Button Group

```xml
<View class="horizontal rounded-lg bg-gray-200">
  <View class="w-1/3 rounded-md bg-white py-2 shadow-sm">
    <Label class="text-center text-sm font-semibold text-gray-800" text="Day" />
  </View>
  <View class="w-1/3 py-2">
    <Label class="text-center text-sm font-medium text-gray-500" text="Week" />
  </View>
  <View class="w-1/3 py-2">
    <Label class="text-center text-sm font-medium text-gray-500" text="Month" />
  </View>
</View>
```

#### Button Sizes

```xml
<!-- Small -->
<Button class="bg-brand-500 rounded px-4 py-2 text-sm font-semibold text-white" title="Small" />

<!-- Medium (Default) -->
<Button class="bg-brand-500 rounded-lg px-6 py-3 text-base font-semibold text-white" title="Medium" />

<!-- Large -->
<Button class="bg-brand-500 rounded-xl px-8 py-4 text-lg font-semibold text-white" title="Large" />
```

### Navigation Bars

Navigation bars provide hierarchy and navigation context.

#### Top Navigation Bar with Title

```xml
<View class="horizontal h-14 border-b border-gray-200 bg-white">
  <Label class="fas fa-arrow-left ml-4 text-xl text-gray-600" />
  <Label class="w-screen text-center text-lg font-semibold text-gray-800" text="Screen Title" />
  <Label class="fas fa-ellipsis-v mr-4 text-xl text-gray-600" />
</View>
```

#### Navigation Bar with Actions

```xml
<View class="bg-brand-500 horizontal h-14">
  <Label class="fas fa-bars ml-4 text-xl text-white" />
  <Label class="w-screen text-center text-lg font-semibold text-white" text="Dashboard" />
  <View class="horizontal mr-4">
    <Label class="fas fa-search mr-4 text-xl text-white" />
    <Label class="fas fa-bell text-xl text-white" />
  </View>
</View>
```

#### Tab Bar (Bottom)

```xml
<View class="horizontal h-16 border-t border-gray-200 bg-white">
  <View class="vertical w-1/3">
    <Label class="fas fa-home text-brand-500 mx-auto mb-1 text-xl" />
    <Label class="text-brand-500 text-center text-xs font-medium" text="Home" />
  </View>
  <View class="vertical w-1/3">
    <Label class="fas fa-search mx-auto mb-1 text-xl text-gray-400" />
    <Label class="text-center text-xs text-gray-400" text="Search" />
  </View>
  <View class="vertical w-1/3">
    <Label class="fas fa-user mx-auto mb-1 text-xl text-gray-400" />
    <Label class="text-center text-xs text-gray-400" text="Profile" />
  </View>
</View>
```

#### Segment Control

```xml
<View class="horizontal mx-4 my-4 rounded-lg bg-gray-200">
  <View id="segment1" class="w-1/2 rounded-md bg-white py-2 shadow-sm">
    <Label class="text-center text-sm font-semibold text-gray-800" text="Active" />
  </View>
  <View id="segment2" class="w-1/2 py-2">
    <Label class="text-center text-sm font-medium text-gray-500" text="Inactive" />
  </View>
</View>
```

#### Breadcrumb Navigation

```xml
<View class="horizontal bg-gray-50">
  <Label class="text-brand-500 text-sm" text="Home" />
  <Label class="fas fa-chevron-right mx-2 my-3 text-xs text-gray-400" />
  <Label class="text-brand-500 text-sm" text="Products" />
  <Label class="fas fa-chevron-right mx-2 my-3 text-xs text-gray-400" />
  <Label class="my-3 text-sm font-medium text-gray-800" text="Category" />
</View>
```

### Modals and Dialogs

Modals focus user attention on specific content or actions.

#### Alert Dialog

```javascript
const dialog = Ti.UI.createAlertDialog({
  cancel: 0,
  title: 'Delete Item',
  buttonNames: ['Cancel', 'Delete'],
  message: 'Are you sure you want to delete this item? This action cannot be undone.'
})

dialog.addEventListener('click', (e) => {
  if (e.index === 1) {
    // Delete action
  }
})

dialog.show()
```

#### Full Screen Modal (iOS)

```xml
<!-- modal.xml -->
<Window class="bg-white" modal="true">
  <View class="vertical h-full">
    <!-- Header -->
    <View class="horizontal border-b border-gray-200 bg-white">
      <Label id="closeBtn" class="text-brand-500 text-base font-semibold" text="Cancel" />
      <Label class="w-screen text-center text-lg font-semibold text-gray-800" text="Modal Title" />
      <Label id="saveBtn" class="text-brand-500 text-base font-semibold" text="Save" />
    </View>

    <!-- Content -->
    <ScrollView class="h-full">
      <View>
        <Label class="mx-4 my-4 text-base text-gray-800" text="Modal content goes here..." />
      </View>
    </ScrollView>
  </View>
</Window>
```

```javascript
// Open modal
const modal = Alloy.createController('modal').getView()
modal.open({ modal: true })
```

#### Bottom Sheet (Android-style)

```xml
<View class="absolute bottom-0 left-0 w-full rounded-t-xl bg-white shadow-2xl">
  <View class="mx-auto mb-4 mt-3 h-1 w-12 rounded-full bg-gray-300" />
  <View>
    <Label class="mx-4 mb-4 mt-4 text-lg font-semibold text-gray-800" text="Choose Action" />
    <View class="vertical">
      <View class="border-b border-gray-100">
        <Label class="mx-4 my-3 text-base text-gray-800" text="Action 1" />
      </View>
      <View class="border-b border-gray-100">
        <Label class="mx-4 my-3 text-base text-gray-800" text="Action 2" />
      </View>
      <View>
        <Label class="mx-4 my-3 text-base font-semibold text-red-500" text="Delete" />
      </View>
    </View>
  </View>
</View>
```

### Toasts and Snackbars

Brief notifications that provide feedback.

#### Simple Toast

```javascript
// Native toast (Android only)
var toast = Ti.UI.createNotification({
  message: "Operation successful",
  duration: Ti.UI.NOTIFICATION_DURATION_SHORT
})
toast.show()
```

#### Custom Snackbar

```xml
<View id="snackbar" class="absolute bottom-4 left-4 right-4 hidden rounded-lg bg-gray-800 shadow-lg">
  <View class="horizontal">
    <Label class="w-screen text-base text-white" text="File deleted successfully" />
    <Label id="undoBtn" class="text-brand-400 text-base font-semibold" text="UNDO" />
  </View>
</View>
```

```javascript
// Show snackbar
$.snackbar.setVisible(true)
setTimeout(() => {
  $.snackbar.setVisible(false)
}, 3000)
```

#### Success Toast

```xml
<View class="horizontal absolute left-4 right-4 top-4 rounded-lg bg-green-500 shadow-lg">
  <Label class="fas fa-check-circle mr-3 text-xl text-white" />
  <Label class="text-base font-medium text-white" text="Changes saved successfully!" />
</View>
```

#### Error Toast

```xml
<View class="horizontal absolute left-4 right-4 top-4 rounded-lg bg-red-500 shadow-lg">
  <Label class="fas fa-exclamation-circle mr-3 text-xl text-white" />
  <Label class="text-base font-medium text-white" text="An error occurred. Please try again." />
</View>
```

---

## 2. Layout Patterns

### Screen Structure

#### Standard Screen Layout

```xml
<Window class="bg-gray-100">
  <ScrollView class="h-full w-full">
    <!-- Header -->
    <View class="border-b border-gray-200 bg-white">
      <Label class="mx-4 my-4 text-2xl font-bold text-gray-800" text="Screen Title" />
    </View>

    <!-- Content -->
    <View>
      <!-- Main content goes here -->
    </View>

    <!-- Footer -->
    <View class="border-t border-gray-200 bg-white">
      <Label class="text-center text-sm text-gray-500" text="Footer content" />
    </View>
  </ScrollView>
</Window>
```

#### Tab Bar Screen Structure

```xml
<TabGroup>
  <!-- Tab 1 -->
  <Tab>
    <Window class="bg-gray-100">
      <ScrollView class="h-full w-full">
        <Label class="mb-4 text-lg font-semibold text-gray-800" text="Home" />
        <!-- Content -->
      </ScrollView>
    </Window>
  </Tab>

  <!-- Tab 2 -->
  <Tab>
    <Window class="bg-gray-100">
      <ScrollView class="h-full w-full">
        <Label class="mb-4 text-lg font-semibold text-gray-800" text="Search" />
        <!-- Content -->
      </ScrollView>
    </Window>
  </Tab>

  <!-- Tab 3 -->
  <Tab>
    <Window class="bg-gray-100">
      <ScrollView class="h-full w-full">
        <Label class="mb-4 text-lg font-semibold text-gray-800" text="Profile" />
        <!-- Content -->
      </ScrollView>
    </Window>
  </Tab>
</TabGroup>
```

### Spacing System

PurgeTSS uses a consistent spacing scale based on 4px increments:

| Class | Spacing | Usage       |
| ----- | ------- | ----------- |
| `p-0` | 0px     | No padding  |
| `p-1` | 4px     | Extra small |
| `p-2` | 8px     | Small       |
| `p-3` | 12px    | Medium      |
| `p-4` | 16px    | Standard    |
| `p-5` | 20px    | Large       |
| `p-6` | 24px    | Extra large |
| `p-8` | 32px    | Double      |

**Note:** Padding classes (`p-*`) work on some elements like TextField, TextArea, Button, and Label, but do NOT work on View. For View spacing, use margin classes on child elements instead.

#### Margin Examples

```xml
<!-- All sides -->
<View class="m-4">...</View>

<!-- Horizontal -->
<View class="mx-4">...</View>

<!-- Vertical -->
<View class="my-4">...</View>

<!-- Individual sides -->
<View class="mb-4 ml-2 mr-4 mt-2">...</View>
```

#### Padding Examples

```xml
<!-- All sides (works on TextField, TextArea, Button, Label) -->
<TextField class="p-4" hintText="Input with padding" />

<!-- Horizontal (works on TextField, TextArea, Button, Label) -->
<TextField class="px-4" hintText="Input with horizontal padding" />

<!-- Vertical (works on TextField, TextArea, Button, Label) -->
<TextField class="py-4" hintText="Input with vertical padding" />

<!-- Individual sides (works on TextField, TextArea, Button, Label) -->
<TextField class="pb-4 pl-2 pr-4 pt-2" hintText="Input with individual padding" />
```

#### Gap (Spacing between children)

```xml
<View class="gap-2">  <!-- 8px between all children -->
  <View class="h-10 bg-red-500" />
  <View class="h-10 bg-blue-500" />
  <View class="h-10 bg-green-500" />
</View>
```

### Responsive Patterns

#### Responsive Grid

```xml
<!-- Two columns on large screens, one column on small -->
<View class="grid">
  <View class="col-span-6 md:col-span-12">
    <Label text="Responsive Item" />
  </View>
</View>
```

#### Adaptive Layout (Tablet vs Phone)

```xml
<!-- Use platform modifiers for adaptive layouts -->
<View class="horizontal">
  <!-- Sidebar on tablets, full width on phones -->
  <View class="w-1/4 md:w-full">
    <Label text="Sidebar" />
  </View>

  <!-- Main content -->
  <View class="w-3/4 md:w-full">
    <Label text="Main Content" />
  </View>
</View>
```

#### Percentage-Based Widths

```xml
<!-- Half width -->
<View class="w-(50%)">...</View>

<!-- One-third width -->
<View class="w-(33.33%)">...</View>

<!-- Custom percentage -->
<View class="w-(75%)">...</View>
```

---

## 3. Typography

### Font Scales

PurgeTSS provides consistent font size utilities:

| Class       | Size | Usage               |
| ----------- | ---- | ------------------- |
| `text-xs`   | 12px | Captions, labels    |
| `text-sm`   | 14px | Secondary text      |
| `text-base` | 16px | Body text (default) |
| `text-lg`   | 18px | Subheadings         |
| `text-xl`   | 20px | Headings            |
| `text-2xl`  | 24px | Large headings      |
| `text-3xl`  | 30px | Display headings    |
| `text-4xl`  | 36px | Hero text           |

#### Typography Examples

```xml
<!-- Display heading -->
<Label class="text-4xl font-bold text-gray-900" text="Hero Title" />

<!-- Page heading -->
<Label class="text-2xl font-bold text-gray-800" text="Page Title" />

<!-- Section heading -->
<Label class="text-xl font-semibold text-gray-800" text="Section Title" />

<!-- Body text -->
<Label class="text-base text-gray-600" text="Regular body text content" />

<!-- Caption -->
<Label class="text-xs text-gray-500" text="Caption text" />
```

### Font Weights

```xml
<Label class="font-light" text="Light weight (300)" />
<Label class="font-normal" text="Normal weight (400)" />
<Label class="font-medium" text="Medium weight (500)" />
<Label class="font-semibold" text="Semibold weight (600)" />
<Label class="font-bold" text="Bold weight (700)" />
```

### Text Alignment and Truncation

#### Text Alignment

```xml
<Label class="text-left" text="Left aligned" />
<Label class="text-center" text="Center aligned" />
<Label class="text-right" text="Right aligned" />
```

#### Text Truncation

```xml
<!-- Single line truncation -->
<Label class="truncate" text="Very long text that will be truncated with ellipsis..." />

<!-- Multi-line truncation -->
<Label class="line-clamp-2" text="Long text that will truncate after 2 lines with ellipsis..." />
<Label class="line-clamp-3" text="Long text that will truncate after 3 lines with ellipsis..." />
```

#### Text Transformations

```xml
<Label class="uppercase" text="uppercase text" />
<Label class="lowercase" text="LOWERCASE TEXT" />
<Label class="capitalize" text="capitalize each word" />
```

---

## 4. Colors and Themes

### Semantic Color Naming

Use semantic color names for better maintainability:

#### Primary Colors

```xml
<!-- Brand colors -->
<View class="bg-brand-500">...</View>
<View class="bg-brand-600">...</View>
<View class="bg-brand-700">...</View>

<!-- Gray scale -->
<View class="bg-gray-50">...</View>
<View class="bg-gray-100">...</View>
<View class="bg-gray-200">...</View>
<View class="bg-gray-300">...</View>
<View class="bg-gray-400">...</View>
<View class="bg-gray-500">...</View>
<View class="bg-gray-600">...</View>
<View class="bg-gray-700">...</View>
<View class="bg-gray-800">...</View>
<View class="bg-gray-900">...</View>
```

#### Semantic Colors

```xml
<!-- Success -->
<View class="bg-green-500">...</View>
<Label class="text-green-500" text="Success message" />

<!-- Warning -->
<View class="bg-yellow-500">...</View>
<Label class="text-yellow-500" text="Warning message" />

<!-- Error -->
<View class="bg-red-500">...</View>
<Label class="text-red-500" text="Error message" />

<!-- Info -->
<View class="bg-blue-500">...</View>
<Label class="text-blue-500" text="Info message" />
```

### Dark Mode Considerations

Use semantic color names that adapt to theme:

```xml
<!-- Adaptive background -->
<View class="bg-white dark:bg-gray-900">...</View>

<!-- Adaptive text -->
<Label class="text-gray-800 dark:text-gray-100" text="Adaptive text" />

<!-- Adaptive borders -->
<View class="border-gray-200 dark:border-gray-700">...</View>
```

### Platform-Specific Colors

#### iOS System Colors

```xml
<!-- iOS blue -->
<Button class="bg-ios-blue text-white" title="iOS Button" />

<!-- iOS system background -->
<Window class="bg-ios-system-background">
  <View class="bg-ios-secondary-system-background">
    <Label class="text-ios-label" text="iOS Text" />
  </View>
</Window>
```

#### Material Design Colors

```xml
<!-- Material primary -->
<Button class="bg-material-primary text-white" title="Material Button" />

<!-- Material surface -->
<View class="bg-material-surface">
  <Label class="text-material-on-surface" text="Material Text" />
</View>
```

---

## 5. Icons

### Font Awesome 7 Icon Fonts

Font Awesome 7 uses style prefixes for different icon sets:

```xml
<!-- Solid icons (free) -->
<Label class="fas fa-home" />
<Label class="fas fa-user" />
<Label class="fas fa-envelope" />

<!-- Regular icons (free) -->
<Label class="far fa-heart" />
<Label class="far fa-star" />
<Label class="far fa-bookmark" />

<!-- Brand icons (free) -->
<Label class="fab fa-twitter" />
<Label class="fab fa-facebook" />
<Label class="fab fa-github" />

<!-- Pro-only styles (require Font Awesome Pro) -->
<Label class="fal fa-camera" />  <!-- Light -->
<Label class="fass fa-star" />   <!-- Sharp Solid -->
```

### Icon Sizing and Alignment

#### Icon Sizes

```xml
<Label class="fas fa-home text-xs" />    <!-- 12px -->
<Label class="fas fa-home text-sm" />    <!-- 14px -->
<Label class="fas fa-home text-base" />  <!-- 16px -->
<Label class="fas fa-home text-lg" />    <!-- 18px -->
<Label class="fas fa-home text-xl" />    <!-- 20px -->
<Label class="fas fa-home text-2xl" />   <!-- 24px -->
<Label class="fas fa-home text-3xl" />   <!-- 30px -->
<Label class="fas fa-home text-4xl" />   <!-- 36px -->
```

#### Icon Colors

```xml
<Label class="fas fa-home text-gray-500" />
<Label class="fas fa-home text-brand-500" />
<Label class="fas fa-home text-(#FF5733)" />  <!-- Arbitrary color -->
```

### Icon with Text Patterns

#### Icon with Label

```xml
<View class="horizontal">
  <Label class="fas fa-envelope mr-2 text-gray-600" />
  <Label class="text-gray-800" text="Email" />
</View>
```

#### Circular Icon Button

```xml
<View class="bg-brand-500 h-12 w-12 rounded-full">
  <Label class="center fas fa-plus text-xl text-white" />
</View>
```

#### Icon Badge

```xml
<View class="relative">
  <Label class="fas fa-bell text-xl" />
  <View class="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-red-500">
    <Label class="center text-xs font-bold text-white" text="3" />
  </View>
</View>
```

#### Icon Group

```xml
<View class="horizontal">
  <Label class="fab fa-twitter mr-4 text-2xl text-blue-400" />
  <Label class="fab fa-facebook mr-4 text-2xl text-blue-600" />
  <Label class="fab fa-instagram mr-4 text-2xl text-pink-500" />
  <Label class="fab fa-github text-2xl text-gray-800" />
</View>
```

---

## 6. Accessibility

### Accessibility Labels

All interactive elements should have accessibility labels:

```xml
<!-- Button with label -->
<Button class="bg-brand-500 text-white" title="Save" accessibilityLabel="Save changes" />

<!-- Icon button with label -->
<View class="bg-brand-500 h-12 w-12 rounded-full" accessibilityLabel="Add new item">
  <Label class="center fas fa-plus text-white" accessibilityHidden="true" />
</View>

<!-- Image with label -->
<ImageView image="/images/avatar.jpg" accessibilityLabel="User avatar" />
```

### Touch Target Sizes

Ensure touch targets are at least 44dp for iOS and 48dp for Android:

```xml
<!-- Minimum touch target (44dp) -->
<Button class="min-w-44 min-h-44 bg-brand-500" title="Button" />

<!-- Icon button with proper touch target -->
<View class="h-12 w-12" accessibilityLabel="Settings">
  <Label class="center fas fa-cog text-xl" />
</View>
```

### Color Contrast

Ensure sufficient color contrast for text:

```xml
<!-- Good contrast examples -->
<View class="bg-white">
  <Label class="text-gray-900" text="Dark text on white background" />
</View>

<View class="bg-gray-900">
  <Label class="text-white" text="White text on dark background" />
</View>

<View class="bg-brand-500">
  <Label class="font-semibold text-white" text="White text on brand color" />
</View>
```

### Screen Reader Support

```xml
<!-- Hide decorative elements -->
<View class="absolute right-0 top-0" accessibilityHidden="true">
  <Label class="fas fa-star text-yellow-500" />
</View>

<!-- Provide hints for complex controls -->
<Slider accessibilityLabel="Volume" accessibilityHint="Adjust the volume level" accessibilityValue="50 percent" />

<!-- State changes -->
<Switch id="notificationSwitch" accessibilityLabel="Enable notifications" />
```

```javascript
// Update accessibility value on state change
$.notificationSwitch.addEventListener('change', (e) => {
  $.notificationSwitch.accessibilityValue = e.value ? 'On' : 'Off'
})
```

---

## 7. Performance Best Practices

### ListView Performance

**CRITICAL**: Never use `Ti.UI.SIZE` in ListView templates - causes jerky scrolling.

```xml
<!-- BAD - Causes performance issues -->
<ItemTemplate name="bad">
  <Label bindId="title" height="Ti.UI.SIZE" />
</ItemTemplate>

<!-- GOOD - Use fixed heights -->
<ItemTemplate name="good">
  <Label bindId="title" height="40" />
</ItemTemplate>
```

### View Recycling

ListViews recycle views. Always update via data, not direct access:

```javascript
// BAD - Direct modification
function handleClick(e) {
  e.source.text = "Updated"
}

// GOOD - Update via data
function handleClick(e) {
  const item = e.section.getItemAt(e.itemIndex)
  item.title.text = "Updated"
  e.section.updateItemAt(e.itemIndex, item)
}
```

### Batch Updates

Use `applyProperties` to reduce bridge crossings:

```javascript
// BAD - Multiple property updates
view.backgroundColor = 'red'
view.width = 100
view.height = 50

// GOOD - Single batch update
view.applyProperties({
  backgroundColor: 'red',
  width: 100,
  height: 50
})
```

### Minimize Template Count

Fewer templates = better native cell reuse:

```xml
<!-- GOOD - One flexible template -->
<ItemTemplate name="flexible">
  <ImageView bindId="icon" />
  <Label bindId="title" />
  <Label bindId="subtitle" />  <!-- Hidden if not needed -->
</ItemTemplate>

<!-- BAD - Multiple similar templates -->
<ItemTemplate name="withIcon">...</ItemTemplate>
<ItemTemplate name="withoutIcon">...</ItemTemplate>
<ItemTemplate name="withSubtitle">...</ItemTemplate>
```

---

## 8. Platform-Specific Patterns

### iOS Patterns

#### Navigation Window

```xml
<NavigationWindow id="navWindow">
  <Window class="bg-white">
    <View>
      <Label class="text-lg font-semibold" text="Main Screen" />
      <Button id="pushBtn" class="mt-4" title="Push Next Screen" />
    </View>
  </Window>
</NavigationWindow>
```

```javascript
// Push new window
$.pushBtn.addEventListener('click', () => {
  const nextWin = Ti.UI.createWindow({
    title: 'Next Screen',
    backgroundColor: 'white'
  })
  $.navWindow.openWindow(nextWin, { animated: true })
})
```

#### Tab Bar

```xml
<TabGroup id="tabGroup">
  <Tab id="homeTab" icon="fa-home.png" title="Home">
    <Window class="bg-white">
      <ScrollView class="h-full w-full">
        <Label class="text-lg font-semibold" text="Home Screen" />
      </ScrollView>
    </Window>
  </Tab>

  <Tab id="searchTab" icon="fa-search.png" title="Search">
    <Window class="bg-white">
      <ScrollView class="h-full w-full">
        <Label class="text-lg font-semibold" text="Search Screen" />
      </ScrollView>
    </Window>
  </Tab>

  <Tab id="profileTab" icon="fa-user.png" title="Profile">
    <Window class="bg-white">
      <ScrollView class="h-full w-full">
        <Label class="text-lg font-semibold" text="Profile Screen" />
      </ScrollView>
    </Window>
  </Tab>
</TabGroup>
```

#### iOS Swipe Actions

```javascript
const section = $.myList.sections[0]

// Define edit actions
const deleteAction = Ti.UI.iOS.createListViewDeleteOptions({
  title: 'Delete'
})

const moreAction = Ti.UI.iOS.createListViewEditAction({
  title: 'More',
  backgroundColor: 'blue',
  style: Ti.UI.iOS.LIST_VIEW_EDIT_ACTION_STYLE_NORMAL
})

// Enable editing
section.editActions = [deleteAction, moreAction]
section.canEdit = true

// Handle actions
$.myList.addEventListener('editaction', (e) => {
  if (e.action === deleteAction) {
    section.deleteItemsAt(e.itemIndex, 1)
  } else if (e.action === moreAction) {
    // Handle more action
  }
})
```

### Android Patterns

#### Action Bar

```javascript
const activity = Ti.Android.currentActivity

activity.onCreateOptionsMenu = (e) => {
  const menu = e.menu

  const searchItem = menu.add({
    title: 'Search',
    icon: Ti.Android.R.drawable.ic_menu_search,
    showAsAction: Ti.Android.SHOW_AS_ACTION_IF_ROOM
  })

  const settingsItem = menu.add({
    title: 'Settings',
    icon: Ti.Android.R.drawable.ic_menu_preferences,
    showAsAction: Ti.Android.SHOW_AS_ACTION_IF_ROOM
  })
}

activity.onOptionsItemSelected = (e) => {
  switch (e.itemId) {
    case 0:
      // Handle search
      return true
    case 1:
      // Handle settings
      return true
  }
  return false
}
```

#### Back Button Handling

```javascript
$.window.addEventListener('androidback', (e) => {
  e.cancelBubble = true

  if (canGoBack()) {
    closeCurrentWindow()
  } else {
    showExitConfirmation()
  }
})
```

#### Material Design Theme

```xml
<!-- tiapp.xml -->
<android xmlns:android="http://schemas.android.com/apk/res/android">
  <manifest>
    <application android:theme="@style/Theme.Titanium.Material3.DayNight"/>
  </manifest>
</android>
```

#### Notifications

```javascript
// Create notification channel (Android 8.0+)
const channel = Ti.Android.createNotificationChannel({
  name: 'My Channel',
  id: 'my_channel_id',
  importance: Ti.Android.NOTIFICATION_IMPORTANCE_HIGH
})

Ti.Android.NotificationManager.createNotificationChannel(channel)

// Create and show notification
const notification = Ti.Android.createNotification({
  number: 1,
  channelId: 'my_channel_id',
  contentTitle: 'New Message',
  contentText: 'You have a new message'
})

Ti.Android.NotificationManager.notify(1, notification)
```

---

## Quick Reference Card

### Common PurgeTSS Classes

| Category        | Classes                                      | Examples                        |
| --------------- | -------------------------------------------- | ------------------------------- |
| **Spacing**     | `p-{0-8}`, `m-{0-8}`, `px-{0-8}`, `py-{0-8}` | `p-4`, `mx-2`, `py-6`           |
| **Colors**      | `bg-{color}-{shade}`, `text-{color}-{shade}` | `bg-brand-500`, `text-gray-800` |
| **Typography**  | `text-{xs,sm,base,lg,xl,2xl,3xl,4xl}`        | `text-xl`, `text-2xl`           |
| **Font Weight** | `font-{light,normal,medium,semibold,bold}`   | `font-semibold`, `font-bold`    |
| **Borders**     | `border`, `border-{color}`, `rounded-{size}` | `border-gray-300`, `rounded-lg` |
| **Shadows**     | `shadow-{sm,md,lg,xl,2xl}`                   | `shadow-md`, `shadow-lg`        |
| **Width**       | `w-{size}`, `w-{percentage}`                 | `w-full`, `w-(50%)`             |
| **Height**      | `h-{size}`, `h-screen`                       | `h-10`, `h-screen`              |
| **Display**     | `hidden`, `visible`                          | `hidden`, `visible`             |
| **Icons**       | `fas`, `far`, `fab fa-{icon}`                | `fas fa-home`, `fab fa-twitter` |

### Platform Modifiers

```xml
<!-- iOS-only -->
<View class="ios:p-4 ios:bg-white">...</View>

<!-- Android-only -->
<View class="android:p-4 android:bg-gray-100">...</View>

<!-- Platform-specific values -->
<View class="ios:bg-white android:bg-gray-100 p-4">...</View>
```

---

## Best Practices Summary

1. **Use `dp` units** for cross-platform consistency
2. **Prefer ListView over TableView** for large datasets
3. **Avoid `Ti.UI.SIZE` in ListViews** - use fixed heights
4. **Provide accessibility labels** for all interactive elements
5. **Ensure minimum touch target size** of 44dp (iOS) / 48dp (Android)
6. **Use semantic color names** for better theming support
7. **Test on both platforms** to ensure consistent experience
8. **Follow platform conventions** - iOS NavigationWindow, Android Action Bar
9. **Use PurgeTSS utility classes** for consistent styling
10. **Batch property updates** using `applyProperties()` for better performance
11. **Padding classes do NOT work on View** - use margin on children instead
12. **Always specify Font Awesome icons** - `fas fa-home`, not just `fas`

---

## Additional Resources

- [PurgeTSS Documentation](https://purgetss.com)
- [Titanium SDK Documentation](https://docs.appcelerator.com)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design Guidelines](https://material.io/design)
- [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)
