# TiKit UI Components

TiKit is a collection of ready-to-use UI components built with Alloy and PurgeTSS for creating polished mobile interfaces quickly.

## Installation

```bash
# Install TiKit CLI globally
npm install -g tikit

# Make sure PurgeTSS is also installed
npm install -g purgetss
```

### Setting Up a Project

1. Create a PurgeTSS project (if not already):
   ```bash
   purgetss create myApp
   ```

2. Install TiKit components:
   ```bash
   cd myApp
   tikit install
   # Choose: all components, alerts, avatars, buttons, cards
   ```

## Component Defaults

TiKit components work out of the box with sensible defaults — you only need to provide what's unique:

| Component   | Property  | Default Value                                                                  | Description                  |
| ----------- | --------- | ------------------------------------------------------------------------------ | ---------------------------- |
| **Alerts**  | `color`   | `"dark"`                                                                       | The alert's color scheme     |
|             | `variant` | `"pop"` (with text) or `"solid"` (without text)                                | The alert's visual style     |
| **Avatars** | `size`    | `"base"`                                                                       | The avatar's size            |
|             | `variant` | `"chip"` (with name) or `"square"` (without name)                              | The avatar's shape and style |
| **Buttons** | `size`    | `"base"`                                                                       | The button's size            |
|             | `variant` | `"icon-left"` (with icon) or `"filled"` (without icon)                         | The button's visual style    |
| **Cards**   | `color`   | `"dark"`                                                                       | The card's color scheme      |
|             | `variant` | `"showcase"` (with image) or `"content"` (with subtitle) or `"code"` (default) | The card's layout style      |

```xml
<!-- Uses variant="pop", color="dark" by default -->
<Alert module="tikit.ui" title="Simple Alert" text="With default values" />

<!-- Uses variant="square", size="base" by default -->
<Avatar module="tikit.ui" image="path/to/image.jpg" />

<!-- Uses variant="filled", size="base" by default -->
<Button module="tikit.ui" title="Default Button" />

<!-- Uses variant="code", color="dark" by default -->
<Card module="tikit.ui" title="Simple Card" text="Using defaults" />

<!-- Uses variant="content" when subtitle is provided -->
<Card module="tikit.ui" title="Card" subtitle="Important info" text="Details" />

<!-- Uses variant="showcase" when image is provided -->
<Card module="tikit.ui" title="Image Card" text="Description" image="path/to/image.jpg" />
```

---

## Alerts

> **Common Properties:** `variant`, `color`, `classes`, `title`, `text`

Short, important messages without interrupting the user.

### Variants

- `callout` — Simple message with title and text
- `pop` — Includes an icon alongside the title and text
- `solid` — Full-width banner style, usually with just a title and icon

### Colors

`success`, `danger`, `warning`, `info`, `dark`, `light`

You can also define `primary` and `secondary` custom colors:

```bash
purgetss shades '#yourHexCode1' primary
purgetss shades '#yourHexCode2' secondary
```

### Extra Controls

- `delay` (milliseconds) — Wait before showing the alert
- `duration` (milliseconds) — Control animation speed
- `dismissible` (boolean) — Let users tap to close

### Examples

```xml
<!-- Callout -->
<Alert module="tikit.ui" variant="callout" color="success" title="Success!" text="Your changes have been saved." />

<!-- Pop with custom icon -->
<Alert module="tikit.ui" variant="pop" color="primary" title="Action Required" text="Please review." icon="mi mi-pending_actions text-3xl" />

<!-- Solid banner -->
<Alert module="tikit.ui" variant="solid" color="warning" title="Maintenance Soon" icon="mi mi-warning text-2xl" />

<!-- Dismissible -->
<Alert module="tikit.ui" variant="pop" color="info" delay="500" dismissible="true" title="FYI" text="Tap to close." />
```

---

## Avatars

> **Common Properties:** `variant`, `size`, `classes`, `image`

Visual representations of users or objects.

### Variants

- `chip` — Image with a name label next to it
- `circular` — Standard round avatar
- `landscape` — Rectangular, wider than tall
- `portrait` — Rectangular, taller than wide
- `square` — Simple square avatar
- `stacked` — Designed to overlap in a horizontal group

### Sizes

`xs`, `sm`, `base`, `lg`, `xl`, `2xl`

### Examples

```xml
<!-- Chip with custom colors -->
<Avatar module="tikit.ui" variant="chip" size="base" name="Jane Doe"
        image="https://randomuser.me/api/portraits/women/86.jpg"
        classes="bg-blue-100 text-blue-800" />

<!-- Circular with border -->
<Avatar module="tikit.ui" variant="circular" size="base" border="true"
        image="https://randomuser.me/api/portraits/men/86.jpg"
        classes="border-gray-300" />

<!-- Portrait with custom border color -->
<Avatar module="tikit.ui" variant="portrait" size="base"
        image="https://randomuser.me/api/portraits/men/87.jpg"
        classes="border-green-500" />

<!-- Stacked avatars (use last="true" on the final one) -->
<View class="horizontal">
  <Avatar module="tikit.ui" variant="stacked" size="base" image="img1.jpg" />
  <Avatar module="tikit.ui" variant="stacked" size="base" image="img2.jpg" />
  <Avatar module="tikit.ui" variant="stacked" size="base" last="true" image="img3.jpg" />
</View>
```

### Variant-Specific Properties

| Variant     | Properties                           | Notes                                       |
| ----------- | ------------------------------------ | ------------------------------------------- |
| `chip`      | `name`, `image`                      | Default gray bg/text, override with classes |
| `circular`  | `name` (optional), `image`, `border` | `border="true"` adds white border           |
| `square`    | `name` (optional), `image`, `border` | Same as circular but square                 |
| `portrait`  | `name` (optional), `image`           | Default gray border, override with classes  |
| `landscape` | `name` (optional), `image`           | Default gray border, override with classes  |
| `stacked`   | `image`, `last`                      | Use inside `horizontal` View                |

---

## Buttons

> **Common Properties:** `variant`, `size`, `classes`, `title`

### Variants

- `border` — Text with an outline border
- `border-rounded` — Like `border` with rounded corners
- `filled` — Solid background color with text
- `filled-rounded` — Like `filled` with rounded corners
- `icon-left` — Icon on the left, text on the right
- `icon-right` — Text on the left, icon on the right

### Sizes

`xs`, `sm`, `base`, `lg`, `xl`, `2xl`

### Examples

```xml
<!-- Border button -->
<Button module="tikit.ui" variant="border" size="base" title="Cancel"
        classes="border-red-500 text-red-500" />

<!-- Filled rounded -->
<Button module="tikit.ui" variant="filled-rounded" size="base" title="Confirm"
        classes="bg-green-600 text-white" />

<!-- Icon left -->
<Button module="tikit.ui" variant="icon-left" size="base" title="Save"
        icon="fa fa-save text-white" classes="bg-blue-500 text-white" />

<!-- Icon right with Material Icon -->
<Button module="tikit.ui" variant="icon-right" size="lg" title="Settings"
        icon="mi mi-settings text-lg text-gray-100"
        classes="bg-gray-700 text-gray-100" />
```

---

## Cards

> **Common Properties:** `variant`, `color`, `classes`

### Variants

- `code` — Display code snippets with optional copy button
- `content` — Text with title, subtitle, and body
- `quote` — Quotation with attribution
- `showcase` — Image with title and description

### Colors

`black`, `dark`, `light`, `white`

### Examples

```xml
<!-- Code card with copy button -->
<Card module="tikit.ui" variant="code" color="dark" copy="true"
      title="Example" text="function hello() { console.log('Hi!'); }" />

<!-- Showcase card -->
<Card module="tikit.ui" variant="showcase" color="black"
      title="Project X" text="Mobile app design concept."
      image="images/showcase/project-x.jpg" />

<!-- Quote card -->
<Card module="tikit.ui" variant="quote" color="white"
      name="Jane Austen" text="There is no charm equal to tenderness of heart." />

<!-- Content card -->
<Card module="tikit.ui" variant="content" color="light"
      title="About TiKit" subtitle="Making UI Easier"
      text="TiKit provides useful components..." />
```

### Variant-Specific Properties

| Variant    | Properties                                | Notes                                                    |
| ---------- | ----------------------------------------- | -------------------------------------------------------- |
| `code`     | `title`, `text`, `copy` (boolean)         | Install monospaced font for best results                 |
| `showcase` | `title`, `text`, `image`, `rounded` (int) | `rounded=0` for sharp, higher values for rounded corners |
| `quote`    | `name`, `text`                            | Name is the attribution                                  |
| `content`  | `title`, `subtitle`, `text`               | Clear hierarchy: large title, highlighted subtitle, body |

:::tip Code Card Localization
The copy button uses `L('copy', 'Copy')` for its title and `L('code_copied', 'Code copied!')` for confirmation. Add these keys to `strings.xml` for translation.
:::

---

## Tabs

> **Properties:** `title`, `icon`, `activeIcon` (iOS only) + standard `Titanium.UI.Tab` properties

TiKit tabs make it easy to add icon-based tabs using any loaded font library.

```xml
<Tab module="tikit.ui" title="Home" icon="fa fa-home" activeIcon="fas fa-home">
  <Require src="home_window" />
</Tab>
```

### Styling Tabs

Since these are `Titanium.UI.Tab` objects, use standard properties and PurgeTSS classes:

```xml
<Tab module="tikit.ui"
     class="active-tint-indigo-600 active-title-indigo-600"
     title="Profile"
     icon="mi mi-person_outline text-3xl"
     activeIcon="mi mi-person text-3xl">
  <Require src="profile_window" />
</Tab>
```

---

## Updating Components Dynamically

TiKit components with an `id` can be updated without destroying and recreating them.

### Available Update Methods

| Method                   | Description                        |
| ------------------------ | ---------------------------------- |
| `updateTitle(newTitle)`  | Changes the main title             |
| `updateSubtitle(newSub)` | Changes the subtitle (Cards)       |
| `updateText(newText)`    | Changes the main text content      |
| `updateName(newName)`    | Changes the name (Avatar `chip`)   |
| `updateImage(newImage)`  | Changes the image (path or blob)   |
| `updateIcon(newIcon)`    | Changes the icon class string      |
| `update(args)`           | Update multiple properties at once |

The `update()` method accepts an object with keys: `title`, `subtitle`, `text`, `name`, `image`, `icon`.

### Which Components Support Which Updates

| Component   | Updatable Properties                                       |
| ----------- | ---------------------------------------------------------- |
| **Cards**   | `title`, `subtitle`, `text`, `image`                       |
| **Avatars** | `image`, `name` (mostly for `chip`)                        |
| **Alerts**  | `title`, `text`, `icon` (`text` not applicable to `solid`) |
| **Buttons** | `title`, `icon` (`icon` for `icon-left`/`icon-right`)      |

### Example

```xml
<!-- View -->
<Card id="statusCard" module="tikit.ui" variant="content" color="light"
      title="Status" subtitle="Current" text="Waiting for update..." />

<Button module="tikit.ui" variant="filled" size="base"
        title="Fetch Status" onClick="fetchStatus"
        classes="mt-4 bg-blue-500 text-white" />
```

```javascript
// Controller
function fetchStatus() {
  // Update multiple properties at once
  $.statusCard.update({
    title: 'Status Updated!',
    subtitle: 'Just Now',
    text: 'Everything looks good. System operational.'
  });

  // Or update individually
  // $.statusCard.updateTitle('Status Updated!');
  // $.statusCard.updateSubtitle('Just Now');
}
```

---

## Using Icon Fonts with TiKit

TiKit components accept icon fonts via the `icon` property. Use any font loaded through PurgeTSS.

### Official Icon Fonts

```bash
purgetss icon-library --vendor=fa,mi,ms,f7
```

### Custom Icon Fonts

1. Place font (`.ttf`/`.otf`) and CSS in `purgetss/fonts/your-font-name/`
2. Run `purgetss build-fonts`
3. Use in TiKit components:

```xml
<Button module="tikit.ui" variant="icon-left" title="Launch"
        icon="myicon myicon-rocket text-lg"
        classes="bg-purple-600 text-white" />

<Alert module="tikit.ui" variant="pop" color="info"
       title="Update Available"
       icon="myicon myicon-download text-2xl" />
```

## Quick Reference

### All Component Variants

| Component | Variants                                                                          |
| --------- | --------------------------------------------------------------------------------- |
| Alert     | `callout`, `pop`, `solid`                                                         |
| Avatar    | `chip`, `circular`, `landscape`, `portrait`, `square`, `stacked`                  |
| Button    | `border`, `border-rounded`, `filled`, `filled-rounded`, `icon-left`, `icon-right` |
| Card      | `code`, `content`, `quote`, `showcase`                                            |
| Tab       | (single variant, uses standard Tab properties)                                    |

### Size Scale (Avatars & Buttons)

`xs` → `sm` → `base` → `lg` → `xl` → `2xl`

### Color Schemes

- **Alerts**: `success`, `danger`, `warning`, `info`, `dark`, `light` (+ custom `primary`, `secondary`)
- **Cards**: `black`, `dark`, `light`, `white`
