# Icon Fonts Libraries

PurgeTSS supports several icon font libraries for use in your Titanium Alloy applications.

:::info Official Icon Fonts for PurgeTSS

Previous versions of PurgeTSS included several icon font libraries such as Bootstrap Icons, Boxicons, LineIcons, and Tabler Icons. **However, adding more icon fonts was getting out of control**.

**As a result, we have decided to leave the following fonts as the official icon fonts for PurgeTSS:**

- [Font Awesome 7 Free (Highly recommended to upgrade using `purgetss il -v=fa`)](https://fontawesome.com)
- [Framework 7](https://framework7.io/icons/)
- [Material Icons](https://fonts.google.com/icons?icon.set=Material+Icons)
- [Material Symbols](https://fonts.google.com/icons?icon.set=Material+Symbols)

:::

## Installing Official Icon Fonts

Use the `icon-library` command to download and install official icon fonts:

```bash
purgetss icon-library --vendor=[fa,mi,ms,f7] [options]
# or
purgetss il -v=[fa,mi,ms,f7] [options]
```

**Vendors:**
- `fa` - Font Awesome (Free version)
- `mi` - Material Icons
- `ms` - Material Symbols
- `f7` - Framework7 Icons

**Options:**
- `-m, --module` - Generates CommonJS module with Unicode mappings in `app/lib/`
- `-s, --styles` - Generates TSS file with class definitions

**Examples:**
```bash
# Install Font Awesome only
purgetss icon-library --vendor=fa

# Install multiple vendors with module
purgetss il -v=fa,mi,ms -m

# Install all available vendors
purgetss icon-library -v=fa,mi,ms,f7 -m -s
```

:::tip
After running `icon-library`, the font files are automatically placed in `app/assets/fonts/` and the necessary TSS classes are generated.
:::

## Using Icon Fonts in XML

Once installed, icon fonts work on both Labels and Buttons:

```xml
<!-- Works on Labels -->
<Label class="fas fa-home" />
<Label class="fab fa-twitter text-blue-400" />

<!-- Works on Buttons too! -->
<Button class="fas fa-search" />
<Button class="fas fa-arrow-right" />
```

### Font Awesome 7

Font Awesome 7 uses different style prefixes:

```xml
<!-- Solid icons (free) -->
<Label class="fas fa-home fa-user fa-envelope" />

<!-- Regular icons (free) -->
<Label class="far fa-heart fa-star" />

<!-- Brand icons (free) -->
<Label class="fab fa-twitter fa-facebook fa-github" />
```

### Material Icons

```xml
<Label class="material-icons md-home md-settings" />
```

### Material Symbols

```xml
<Label class="material-symbols ms-check ms-add ms-close" />
```

### Framework7 Icons

```xml
<Label class="f7-icons f7-home f7-search" />
```

## Recreating Deleted Libraries

If you need to use icon fonts that are no longer officially supported (Bootstrap Icons, Boxicons, LineIcons, Tabler Icons), you can recreate them using the `build-fonts` command.

### Step 1: Download the Libraries

Download the libraries from their official websites:

- [Bootstrap Icons](https://icons.getbootstrap.com)
- [Boxicons](https://boxicons.com)
- [LineIcons](https://lineicons.com/icons/?type=free)
- [Tabler Icons](https://tabler-icons.io)

### Step 2: Place in fonts Folder

Put the desired libraries in the `./purgetss/fonts` folder.

:::info
You just need to copy the **TrueType** or **OpenType** font files and the `.css` file.
:::

```bash
./purgetss/fonts/
├─ boxicons
│  ├─ boxicons.css
│  └─ boxicons.ttf
└─ lineicons
   ├─ lineicons.css
   └─ lineicons.ttf
```

### Step 3: Run build-fonts Command

```bash
$ purgetss build-fonts [--module]
# alias:
$ purgetss bf [-m]
```

**What happens:**
1. Generates `./purgetss/styles/fonts.tss` with all Unicode characters and style rules
2. Copies font files to `./app/assets/fonts/` and renames them to PostScript names (cross-platform compatibility)
3. Optionally generates `./app/lib/purgetss.fonts.js` CommonJS module with `--module` option

#### Generated fonts.tss Example

```tss
/* ./purgetss/styles/fonts.tss */
'.boxicons': { font: { fontFamily: 'boxicons' } }
'.lineicons': { font: { fontFamily: 'LineIcons' } }

/* Unicode Characters */
/* To use your Icon Fonts in Buttons AND Labels each class sets 'text' and 'title' properties */

/* boxicons.css */
'.bxl-meta': { text: '\uef27', title: '\uef27' }
'.bx-lemon': { text: '\uef28', title: '\uef28' }
'.bxs-lemon': { text: '\uef29', title: '\uef29' }

/* lineicons.css */
'.lni-500px': { text: '\uea03', title: '\uea03' }
'.lni-add-files': { text: '\uea01', title: '\uea01' }
'.lni-adobe': { text: '\uea06', title: '\uea06' }
```

### Renaming the Style Rule Name

**PurgeTSS** uses the font's file name as the style rule name. **You can change it by renaming the font file**.

```bash
./purgetss/fonts/
└─ boxicons
   └─ bx.ttf  # Renamed from boxicons.ttf
```

New style rule name: `'.bx'`

```tss
/* ./purgetss/styles/fonts.tss */
'.bx': { font: { fontFamily: 'boxicons' } }
```

## Using Custom Font Modules

When using the `--module` option with `build-fonts` or `icon-library`, a CommonJS module is generated at `./app/lib/purgetss.fonts.js`.

### Generated Module Structure

```javascript
// ./app/lib/purgetss.fonts.js
const icons = {
  'boxicons': {
    'bxlMeta': '\uef27',
    'bxLemon': '\uef28',
    'bxsLemon': '\uef29',
    /* ... */
  },
  'lineicons': {
    '500px': '\uea03',
    'addFiles': '\uea01',
    'adobe': '\uea06',
    /* ... */
  }
};
exports.icons = icons;
```

### Usage in Controllers

```javascript
var icons = require('purgetss.fonts');

// Get icon unicode
var homeIcon = icons.fontAwesome.fasHome; // '\uf015'

// Use in Label
$.myLabel.text = homeIcon;

// Use in Button
$.myButton.title = icons.fontAwesome.fabTwitter;
```

:::tip
Using the module is useful when you need to dynamically set icons based on data or user actions.
:::

## The --prefix Option

**PurgeTSS** automatically determines the group's prefix for each icon family and class name. However, you can use the `--prefix` option to apply the style's filename as the prefix for class names in `fonts.tss` and property names in `purgetss.fonts.js`.

### Example with Custom Prefix

```bash
./purgetss/fonts/
└─ lineicons
   └─ li.css  # Renamed to use custom prefix
```

**New group prefix: `li`**

```tss
/* ./purgetss/styles/fonts.tss */
/* lineicons/li.css */
'.li-zoom-out': { text: '\uea02', title: '\uea02' }
'.li-zoom-in': { text: '\uea03', title: '\uea03' }
'.li-zip': { text: '\uea04', title: '\uea04' }
```

```javascript
/* ./app/lib/purgetss.fonts.js */
const icons = {
  'li': {
    /* ... */
  }
};
```

:::danger WARNING
**Make sure that the new prefix remains unique to avoid conflicts with other class prefixes.**
:::

## Icon Font Best Practices

### 1. Use Semantic Icon Names

```xml
<!-- Good -->
<Label class="fas fa-home" />
<Label class="fas fa-envelope" />

<!-- Avoid - unclear what the icon is -->
<Label class="fas fa-icon1" />
```

### 2. Combine with Styling Classes

```xml
<!-- Styled icon button -->
<Label class="fas fa-arrow-right text-brand-600 text-xl" />
<Label class="fas fa-search bg-gray-100 rounded-full p-2 text-gray-600" />
```

### 3. Use in Navigation

```xml
<!-- Tab bar icons -->
<Button class="fas fa-home text-gray-400" id="homeBtn" />
<Button class="fas fa-user text-gray-400" id="profileBtn" />
<Button class="fas fa-cog text-gray-400" id="settingsBtn" />
```

### 4. Dynamic Icons in Controllers

```javascript
function setIconBasedOnStatus(status) {
  var icons = require('purgetss.fonts').fontAwesome;

  switch(status) {
    case 'success':
      $.statusIcon.text = icons.fasCheckCircle;
      $.statusIcon.classes = ['text-green-500'];
      break;
    case 'error':
      $.statusIcon.text = icons.fasExclamationCircle;
      $.statusIcon.classes = ['text-red-500'];
      break;
    case 'warning':
      $.statusIcon.text = icons.fasExclamationTriangle;
      $.statusIcon.classes = ['text-yellow-500'];
      break;
  }
}
```

## Font Assets Folder

After running `build-fonts` or `icon-library`, fonts are automatically placed in:

```bash
./app/assets/fonts/
├─ FontAwesome7Free-Solid.ttf
├─ FontAwesome7Brands-Regular.ttf
├─ MaterialIcons-Regular.ttf
└─ Framework7Icons.ttf
```

These fonts are renamed to their **PostScript** names to ensure cross-platform compatibility between iOS and Android.

:::info
PurgeTSS automatically handles the PostScript name conversion. You don't need to manually rename font files.
:::

## Icon Sizing and Styling

Icon fonts can be sized and styled just like any text element:

```xml
<!-- Size utilities -->
<Label class="fas fa-home text-xs" />   <!-- 12px -->
<Label class="fas fa-home text-sm" />   <!-- 14px -->
<Label class="fas fa-home text-base" /> <!-- 16px -->
<Label class="fas fa-home text-lg" />   <!-- 18px -->
<Label class="fas fa-home text-xl" />   <!-- 20px -->
<Label class="fas fa-home text-2xl" />  <!-- 24px -->
<Label class="fas fa-home text-3xl" />  <!-- 30px -->
<Label class="fas fa-home text-(32px)" /> <!-- Arbitrary size -->

<!-- Color utilities -->
<Label class="fas fa-home text-gray-500" />
<Label class="fas fa-home text-brand-600" />
<Label class="fas fa-home text-(#FF5733)" />

<!-- Background utilities -->
<Label class="fas fa-home bg-white rounded-full p-4 text-center" />

<!-- Transform utilities -->
<Label class="fas fa-arrow-right rotate-45" />
<Label class="fas fa-heart scale-125" />
```

## Common Patterns

### Icon with Text

```xml
<View class="horizontal">
  <Label class="fas fa-envelope mr-2 text-gray-600" />
  <Label class="text-gray-800" text="Email" />
</View>
```

### Circular Icon Button

```xml
<Label class="fas fa-plus rounded-full bg-brand-500 w-12 h-12 text-white text-center text-xl" />
```

### Icon Badge

```xml
<View class="relative">
  <Label class="fas fa-bell text-xl" />
  <Label class="fas fa-circle text-red-500 text-xs -right-(4) -top-(4)" />
</View>
```

### Social Media Icons

```xml
<View class="horizontal w-screen">
  <Label class="fab fa-twitter text-blue-400 text-2xl mr-4" />
  <Label class="fab fa-facebook text-blue-600 text-2xl mr-4" />
  <Label class="fab fa-instagram text-pink-500 text-2xl mr-4" />
  <Label class="fab fa-github text-gray-800 text-2xl" />
</View>
```

## Troubleshooting

### Icons Not Displaying

**Problem**: Icon fonts not showing in app

**Solutions:**
1. Ensure font files are in `app/assets/fonts/`
2. Check that `fonts.tss` is in `purgetss/styles/`
3. Verify class names match the CSS file (case-sensitive)
4. Run `purgetss build` to regenerate styles

### Wrong Icon Character

**Problem**: Icon displays wrong character

**Solutions:**
1. Check icon prefix (fas/far/fab for Font Awesome)
2. Verify icon name matches CSS file exactly
3. Ensure you're using the correct font family

### Icons Different on iOS vs Android

**Problem**: Icons look different on each platform

**Solutions:**
1. Ensure PostScript name conversion happened (run `build-fonts` again)
2. Check that font files were copied to `app/assets/fonts/`
3. Verify both platforms use the same font file version

## Vendor-Specific Notes

### Font Awesome 7

Font Awesome 7 introduced new CSS custom properties format. PurgeTSS v7.2+ supports this format automatically.

```xml
<!-- Style prefix is required -->
<Label class="fas fa-home" />  <!-- Solid -->
<Label class="far fa-heart" />  <!-- Regular -->
<Label class="fab fa-twitter" /> <!-- Brands -->
```

### Font Awesome Pro

If you have a **[Font Awesome Pro Account](https://fontawesome.com/pro)**, you can generate a customized `purgetss/styles/fontawesome.tss` file containing all the extra classes that the Pro version provides ***(except duotone icons; see note below)***.

:::caution
Titanium cannot use FontAwesome's duotone icons because they have two separate glyphs for each individual icon.
:::

#### Setting Up Font Awesome Pro

**Step 1: Set up @fortawesome scope**

After setting the [@fortawesome scope](https://fontawesome.com/how-to-use/on-the-web/setup/using-package-managers#installing-pro) with your token, install it in your project's root folder:

```bash
npm init
npm install --save-dev @fortawesome/fontawesome-pro
```

**Step 2: Run purgetss build**

To generate a new `purgetss/styles/fontawesome.tss` file with Pro icons:

```bash
purgetss build
```

This will also automatically copy the Pro font files into `./app/assets/fonts/` if necessary.

#### Pro Icon Styles

Font Awesome Pro includes additional style prefixes beyond the free version:

```xml
<!-- Free styles -->
<Label class="fas fa-home" />  <!-- Solid (free) -->
<Label class="far fa-heart" />  <!-- Regular (free) -->
<Label class="fab fa-twitter" /> <!-- Brands (free) -->

<!-- Pro-only styles -->
<Label class="fal fa-camera" />  <!-- Light (Pro) -->
<Label class="fad fa-user" />   <!-- Duotone (Pro) - NOT SUPPORTED in Titanium -->
<Label class="fass fa-star" />  <!-- Sharp Solid (Pro) -->
<Label class="fasr fa-check" /> <!-- Sharp Regular (Pro) -->
<Label class="fasl fa-arrow" /> <!-- Sharp Light (Pro) -->
```

:::danger
**Duotone icons are NOT supported** in Titanium because they require two separate glyphs per icon. Using `fad` classes will not render correctly.
:::

### Font Awesome 7 Beta

You can generate a customized `fontawesome.tss` file from **[Font Awesome 7 Beta](https://fontawesome.com/download)** for testing purposes.

#### Setting Up Font Awesome 7 Beta

**Step 1: Copy beta assets**

Move the `css` and `webfonts` folders from the beta download:

```bash
# From beta download
fontawesome-pro-7.0.0-beta3-web/
└─ css
└─ webfonts

# To your project
purgetss/
└─ fontawesome-beta/
   ├─ css
   └─ webfonts
```

**Step 2: Run purgetss build**

```bash
purgetss build
```

This generates your customized `fontawesome.tss` file with beta icons.

#### Testing Beta Icons

```xml
<!-- Test beta-specific icons -->
<Label class="fas fa-new-beta-icon" />
```

### Material Icons vs Material Symbols

- **Material Icons**: Older Google icon set
- **Material Symbols**: Newer, more customizable icon set

Both use similar syntax but have different icon names and font files.

```xml
<!-- Material Icons -->
<Label class="material-icons md-home" />

<!-- Material Symbols -->
<Label class="material-symbols ms-home" />
```

## Complete Command Reference

| Command | Purpose |
|---------|---------|
| `purgetss icon-library -v=fa` | Install Font Awesome 7 |
| `purgetss icon-library -v=mi` | Install Material Icons |
| `purgetss icon-library -v=ms` | Install Material Symbols |
| `purgetss icon-library -v=f7` | Install Framework7 Icons |
| `purgetss icon-library -v=fa,mi -m` | Install multiple with module |
| `purgetss build-fonts` | Build custom fonts from `purgetss/fonts/` |
| `purgetss build-fonts -m` | Build with CommonJS module |
