# Welcome to TiKit UI Components

TiKit is a small library of UI components built with Alloy and PurgeTSS. It provides reusable building blocks for common UI patterns so you can move faster without fighting styling details.

## Why TiKit

- Ready-to-use components: Alerts, Avatars, Buttons, Cards, Tabs with practical defaults.
- PurgeTSS-first styling: Use utility classes instead of large TSS files.
- Dynamic updates: Change text, images, and icons without recreating components.
- Icon support: Works with Font Awesome, Material Icons, and other icon fonts.
- Consistent UI: Components are designed to look good together.
- Easy to customize: Adjust colors and styles to match your brand.
- Lightweight: Built to stay fast and avoid extra overhead.
- Sensible defaults: You only pass what you need.

## Getting Started

Install the TiKit CLI and make sure PurgeTSS is installed globally:

```bash
npm install -g tikit
npm install -g purgetss
```

## Setting Up Your Project

1. Create a PurgeTSS project and configure `app.idprefix` and `app.theme` in `config.json` as required by PurgeTSS.
1. Run `tikit install` inside your project:

```bash
purgetss create myApp
cd myApp

tikit install
# ? Choose a component to install ›
# ❯   all components
#     alerts
#     avatars
#     buttons
#     cards
```

## Component Default Values

| Component | Property  | Default Value                                                                  | Description                  |
| --------- | --------- | ------------------------------------------------------------------------------ | ---------------------------- |
| Alerts    | `color`   | `"dark"`                                                                       | The alert's color scheme     |
| Alerts    | `variant` | `"pop"` (with text) or `"solid"` (without text)                                | The alert's visual style     |
| Avatars   | `size`    | `"base"`                                                                       | The avatar's size            |
| Avatars   | `variant` | `"chip"` (with name) or `"square"` (without name)                              | The avatar's shape and style |
| Buttons   | `size`    | `"base"`                                                                       | The button's size            |
| Buttons   | `variant` | `"icon-left"` (with icon) or `"filled"` (without icon)                         | The button's visual style    |
| Cards     | `color`   | `"dark"`                                                                       | The card's color scheme      |
| Cards     | `variant` | `"showcase"` (with image) or `"content"` (with subtitle) or `"code"` (default) | The card's layout style      |

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
<Card module="tikit.ui" title="Card with Subtitle" subtitle="Important info" text="Some details" />

<!-- Uses variant="showcase" when image is provided -->
<Card module="tikit.ui" title="Image Card" text="With an image" image="path/to/image.jpg" />
```

## Alerts

Common properties: `variant`, `color`, `classes`, `title`, `text`

Alerts are for short, important messages that do not block the user.

Variants:

- `callout`: Simple message with title and text.
- `pop`: Includes an icon alongside the title and text.
- `solid`: Full-width banner style, usually with just a title and icon.

Colors:

- `success`, `danger`, `warning`, `info`, `dark`, `light`.
- Define `primary` and `secondary` with `purgetss shades`.

Extra controls:

- `delay` (ms): Wait before showing the alert.
- `duration` (ms): Control animation speed.
- `dismissible` (boolean): Tap to close.

```xml
<Alert module="tikit.ui" variant="pop" color="info" delay="500" dismissible="true"
       title="Just FYI" text="You can tap this alert to close it." />
```

### `callout`

```xml
<Alert module="tikit.ui" variant="callout" color="success"
       title="Success!" text="Your changes have been saved." />
```

### `pop`

Use the `icon` property with PurgeTSS classes for size and color.

```xml
<Alert module="tikit.ui" variant="pop" color="primary"
       title="Action Required" text="Please review the details."
       icon="mi mi-pending_actions text-3xl" />
```

### `solid`

```xml
<Alert module="tikit.ui" variant="solid" color="warning"
       title="Maintenance Soon" icon="mi mi-warning text-2xl" />
```

## Avatars

Common properties: `variant`, `size`, `classes`, `image`

Variants:

- `chip`: Image with a name label next to it.
- `circular`: Standard round avatar.
- `landscape`: Rectangular, wider than tall.
- `portrait`: Rectangular, taller than wide.
- `square`: Simple square avatar.
- `stacked`: Designed to overlap slightly in a horizontal group.

Sizes: `xs`, `sm`, `base`, `lg`, `xl`, `2xl`.

```xml
<Avatar module="tikit.ui" variant="circular" size="lg" image="path/to/your/image.jpg" />
```

### `chip`

```xml
<Avatar module="tikit.ui" variant="chip" size="base" name="Jane Doe"
        image="https://randomuser.me/api/portraits/women/86.jpg"
        classes="bg-blue-100 text-blue-800" />
```

### `circular` and `square`

Set `border="true"` for a default white border. Override border color with `classes`.

```xml
<Avatar module="tikit.ui" variant="circular" size="base" border="true"
        image="https://randomuser.me/api/portraits/men/86.jpg"
        classes="border-gray-300" />
```

### `portrait` and `landscape`

Default gray border (`border-gray-500`). Override with `classes`.

```xml
<Avatar module="tikit.ui" variant="portrait" size="base"
        image="https://randomuser.me/api/portraits/men/87.jpg"
        classes="border-green-500" />
```

### `stacked`

Use inside a `<View class="horizontal">` and set `last="true"` on the final avatar.

```xml
<View class="horizontal">
  <Avatar module="tikit.ui" variant="stacked" size="base"
          image="https://randomuser.me/api/portraits/men/86.jpg" />
  <Avatar module="tikit.ui" variant="stacked" size="base"
          image="https://randomuser.me/api/portraits/women/87.jpg" />
  <Avatar module="tikit.ui" variant="stacked" size="base"
          image="https://randomuser.me/api/portraits/men/62.jpg" />
  <Avatar module="tikit.ui" variant="stacked" size="base" last="true"
          image="https://randomuser.me/api/portraits/women/88.jpg" />
</View>
```

## Buttons

Common properties: `variant`, `size`, `classes`, `title`

Variants:

- `border`
- `border-rounded`
- `filled`
- `filled-rounded`
- `icon-left`
- `icon-right`

Sizes: `xs`, `sm`, `base`, `lg`, `xl`, `2xl`.

```xml
<Button module="tikit.ui" variant="filled" size="lg" title="Submit"
        classes="bg-blue-500 text-white" />
```

### `border` and `border-rounded`

```xml
<Button module="tikit.ui" variant="border" size="base" title="Cancel"
        classes="border-red-500 text-red-500" />
```

### `filled` and `filled-rounded`

```xml
<Button module="tikit.ui" variant="filled-rounded" size="base" title="Confirm"
        classes="bg-green-600 text-white" />
```

### `icon-left` and `icon-right`

Use the `icon` property with the icon class and any PurgeTSS size or color classes.

```xml
<Button module="tikit.ui" variant="icon-left" size="base" title="Save"
        icon="fa fa-save text-white" classes="bg-blue-500 text-white" />
```

### Using Custom Icons in Buttons

```xml
<Button module="tikit.ui" variant="icon-right" size="lg" title="Settings"
        icon="mi mi-settings text-lg text-gray-100"
        classes="bg-gray-700 text-gray-100" />
```

## Cards

Common properties: `variant`, `color`, `classes`

Variants:

- `code`: Display code snippets, optional copy button.
- `content`: Text with title, subtitle, and body.
- `quote`: Quote with attribution.
- `showcase`: Image with title and description.

Colors: `black`, `dark`, `light`, `white`.

### `code`

`copy="true"` enables a copy button. Add `L('copy', 'Copy')` and `L('code_copied', 'Code copied!')` to `strings.xml`.

```xml
<Card module="tikit.ui" variant="code" color="dark" copy="true"
      title="Example Function" text="function hello() { console.log('Hi!'); }" />
```

### `showcase`

Use `rounded` (integer >= 0) to control border radius.

```xml
<Card module="tikit.ui" variant="showcase" color="black"
      title="Project X" text="Mobile app design concept."
      image="images/showcase/project-x.jpg" />
```

### `quote`

```xml
<Card module="tikit.ui" variant="quote" color="white"
      name="Jane Austen" text="There is no charm equal to tenderness of heart." />
```

### `content`

```xml
<Card module="tikit.ui" variant="content" color="light"
      title="About TiKit" subtitle="Making UI Easier"
      text="TiKit aims to provide useful components..." />
```

## Tabs

Properties: `title`, `icon`, `activeIcon` (iOS only) plus standard `Titanium.UI.Tab` properties.

```xml
<Tab module="tikit.ui" title="Home" icon="fa fa-home" activeIcon="fas fa-home">
  <Require src="home_window" />
</Tab>
```

### Styling Tabs Further

```xml
<Tab module="tikit.ui"
     class="active-tint-indigo-600 active-title-indigo-600"
     title="Profile"
     icon="mi mi-person_outline text-3xl"
     activeIcon="mi mi-person text-3xl">
  <Require src="profile_window" />
</Tab>
```

## Updating Components Dynamically

Give the component an `id` and call update methods from your controller.

Available update methods:

- `updateTitle(newTitle)`
- `updateSubtitle(newSubtitle)`
- `updateText(newText)`
- `updateName(newName)`
- `updateImage(newImage)`
- `updateIcon(newIcon)`
- `update(args)` for multiple properties (`title`, `subtitle`, `text`, `name`, `image`, `icon`)

Supported updates:

- Cards: `title`, `subtitle`, `text`, `image`
- Avatars: `image`, `name` (mostly for `chip`)
- Alerts: `title`, `text`, `icon` (`text` not applicable to `solid`)
- Buttons: `title`, `icon` (`icon` for `icon-left`/`icon-right`)

Example:

```xml
<Card id="statusCard" module="tikit.ui" variant="content" color="light"
      title="Status" subtitle="Current" text="Waiting for update..." />

<Button module="tikit.ui" variant="filled" size="base"
        title="Fetch Status" onClick="fetchStatus"
        classes="mt-4 bg-blue-500 text-white" />
```

```javascript
function fetchStatus() {
  $.statusCard.update({
    title: 'Status Updated!',
    subtitle: 'Just Now',
    text: 'Everything looks good. System operational.'
  });
}
```

## Working with Icon Fonts

Use any icon font loaded via PurgeTSS. Specify the font prefix and icon name in the `icon` property, along with size and color classes.

### Official Icon Fonts

```bash
purgetss icon-library --vendor=fa,mi,ms,f7
```

### Custom Icon Fonts

1. Place your font files and CSS in `purgetss/fonts/your-font-name/`.
1. Run `purgetss build-fonts`.
1. Use in TiKit components:

```xml
<Button module="tikit.ui" variant="icon-left" title="Launch"
        icon="myicon myicon-rocket text-lg"
        classes="bg-purple-600 text-white" />

<Alert module="tikit.ui" variant="pop" color="info"
       title="Update Available"
       icon="myicon myicon-download text-2xl" />
```

## License

TiKit UI Components is open source under the MIT License.
