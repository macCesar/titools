# PurgeTSS Installation & Setup

## Installation

Install PurgeTSS globally on your machine using [NPM](https://www.npmjs.com/).

```bash
[sudo] npm install -g purgetss
```

:::caution Node.js 20+ Required
PurgeTSS requires Node 20.0.0 or higher.
:::

## Upgrade Notes

- `utilities.tss` is the generated utilities file. Update any scripts or docs that still use the previous output filename.
- `deviceInfo()` now works in Alloy and Classic Titanium projects.
- If an upgrade behaves unexpectedly, a clean reinstall is the recommended recovery step:

```bash
npm uninstall -g purgetss
npm install -g purgetss
```

## Run PurgeTSS the First Time

:::info
Run `purgetss` once in your project to generate the required files and folders.

After that, every build parses your XML files and writes a clean `app.tss` with only the classes used in your project.
:::

When you run `purgetss` for the first time in your project, it does the following:

### 1. Auto-run Hook

PurgeTSS adds a task in `alloy.jmk` to run `purgetss` every time you compile your app. This is especially useful when using `liveview`.

### 2. `purgetss` Folder

PurgeTSS creates a `purgetss` folder at the root of your project containing the following files and folders:

```bash
purgetss
├─ fonts
├─ styles
│  ├─ definitions.css
│  └─ utilities.tss
└─ config.cjs
```

- `config.cjs`

  This is where you can customize or create new classes with your preferred spacing, colors, margin values, and more. For deeper customization, see [Customization Deep Dive](./customization-deep-dive.md).

- `styles`

  The `styles` folder contains `utilities.tss` and `definitions.css`:

  - `utilities.tss`

    This file includes all PurgeTSS utility classes, including any custom classes defined in `config.cjs`.

  - `definitions.css`

    A special CSS file that incorporates all classes from `utilities.tss`, `_app.tss`, any `.tss` remaining in your project, and `fonts.tss`. It is meant to be used with the [VS Code extension](#vscode-extension).

- `fonts`

  Here, you can add various font types such as icons, serif, sans-serif, cursive, fantasy, or monospace fonts for your app. Step-by-step instructions are available in the [`build-fonts` command](./cli-commands.md#purgetss-build-fonts-alias-bf) section.

:::caution Important
PurgeTSS overwrites your existing `app.tss` file.

On the first run, your original `app.tss` is backed up to `_app.tss`.

From this point forward, you can add, delete, or update your custom classes in `_app.tss`.

Alternatively, include custom values in `config.cjs`.
:::

## Example Files

To use the example files:

1. Copy the content of `index.xml` and `app.tss` into a new Alloy project.
2. Install Font Awesome font files with `purgetss icon-library --vendor=fontawesome`.
3. Run `purgetss` once to generate the necessary files.
4. Compile your app as usual.
5. If you use `liveview`, it speeds up testing and development time.

```xml
<Alloy>
  <Window class="bg-primary">
    <View class="h-auto w-10/12 rounded-lg bg-white">
      <View class="vertical m-4">
        <ImageView class="rounded-16 mx-auto h-16 w-16" image="https://randomuser.me/api/portraits/men/43.jpg" />

        <View class="vertical">
          <Label class="text-center text-lg font-semibold text-gray-900">John W. Doe</Label>
          <Label class="mt-0.5 text-center text-sm text-purple-600">Product Engineer</Label>

          <View class="mt-6 w-screen">
            <View class="horizontal ml-0">
              <Label class="far fa-envelope mr-1 text-xs text-gray-600"></Label>
              <Label class="text-xs text-gray-600">john@internet.com</Label>
            </View>

            <View class="horizontal mr-0">
              <Label class="fas fa-phone-alt mr-1 text-xs text-gray-600"></Label>
              <Label class="text-xs text-gray-600">(555) 765-4321</Label>
            </View>
          </View>
        </View>
      </View>
    </View>
  </Window>
</Alloy>
```

```tss
'.bg-primary': {
  backgroundColor: '#002359'
}
```

:::info
After running `purgetss`, you will have a new `app.tss` file with only the classes used in the XML files.

Your original `app.tss` file is backed up in `_app.tss`. You can use this file to add, delete, or update any of your original styles.

Every time `purgetss` runs, it copies the content of `_app.tss` to `app.tss`.
:::

```tss
/* PurgeTSS v7.2.7 */
/* Created by César Estrada */
/* https://github.com/macCesar/purgeTSS */

/* _app.tss styles */
'.bg-primary': {
  backgroundColor: '#002359'
}

/* Ti Elements */
'ImageView[platform=ios]': { hires: true }
'View': { width: Ti.UI.SIZE, height: Ti.UI.SIZE }
'Window': { backgroundColor: '#FFFFFF' }

/* Main Styles */
'.bg-white': { backgroundColor: '#ffffff' }
'.font-semibold': { font: { fontWeight: 'semibold' } }
'.h-16': { height: 64 }
'.h-auto': { height: Ti.UI.SIZE }
'.horizontal': { layout: 'horizontal' }
'.m-4': { top: 16, right: 16, bottom: 16, left: 16 }
'.ml-0': { left: 0 }
'.mr-0': { right: 0 }
'.mr-1': { right: 4 }
'.mt-0.5': { top: 2 }
'.mt-6': { top: 24 }
'.mx-auto': { right: null, left: null }
'.rounded-16': { borderRadius: 32 }
'.rounded-lg': { borderRadius: 8 }
'.text-center': { textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER }
'.text-gray-600': { color: '#4b5563', textColor: '#4b5563' }
'.text-gray-900': { color: '#111827', textColor: '#111827' }
'.text-lg': { font: { fontSize: 18 } }
'.text-purple-600': { color: '#9333ea', textColor: '#9333ea' }
'.text-sm': { font: { fontSize: 14 } }
'.text-xs': { font: { fontSize: 12 } }
'.vertical': { layout: 'vertical' }
'.w-10/12': { width: '83.333334%' }
'.w-16': { width: 64 }
'.w-screen': { width: Ti.UI.FILL }

/* Default Font Awesome */
'.fa-envelope': { text: '\uf0e0', title: '\uf0e0' }
'.fa-phone-alt': { text: '\uf879', title: '\uf879' }
'.far': { font: { fontFamily: 'FontAwesome7Free-Regular' } }
'.fas': { font: { fontFamily: 'FontAwesome7Free-Solid' } }
```

Find more examples in the sample app repository referenced by the official documentation.

## VSCode Extension

If you're using [Visual Studio Code](https://code.visualstudio.com), install the [IntelliSense for CSS class names in HTML](https://marketplace.visualstudio.com/items?itemName=Zignd.html-css-class-completion) extension.

It provides class name completion for the `XML` `class` attribute based on the `definitions.css` file created by PurgeTSS.

After installing the extension, add the `xml` language to the `"HTMLLanguages"` setting and exclude any `css/html` files from the caching process by pointing `"excludeGlobPattern"` to the `./purgetss/fonts/` folder.

```json
{
  "html-css-class-completion.HTMLLanguages": [
    "html",
    "vue",
    "razor",
    "blade",
    "handlebars",
    "twig",
    "django-html",
    "php",
    "markdown",
    "erb",
    "ejs",
    "svelte",
    "xml"
  ],
  "html-css-class-completion.excludeGlobPattern": "**/node_modules/**,purgetss/fonts/**/*.{css,html}"
}
```

:::warning Titanium Layout Reminder
PurgeTSS does not add Flexbox to Titanium. Use `horizontal`, `vertical`, or the default composite layout, and prefer `w-screen` instead of `w-full` when you need `Ti.UI.FILL`.
:::
