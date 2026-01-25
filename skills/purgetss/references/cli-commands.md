# PurgeTSS CLI Commands Guide

PurgeTSS provides a comprehensive suite of CLI commands for project setup, asset management, and development workflow automation.

:::info What's New in v7.2.x
**FontAwesome 7 & Major Optimization**: PurgeTSS v7.2 introduces full support for **FontAwesome 7**, including the new CSS custom properties format. This version also features a significant reduction in installation size and a complete internal restructuring for better performance and maintainability.

**Key Changes:**
- **Node.js 20+** required (due to "inquirer" v13 upgrade)
- **FontAwesome 7 Support**: Full compatibility with the new CSS custom properties format
- **Titanium SDK 13.1 Support**: Updated definitions to support new properties in Titanium SDK 13.1.0.GA
- **Removed deprecated commands**: "copy-fonts" and "build-legacy" are completely gone
- **Reduced Installation Size**: Reduced by approximately **45MB** by moving non-essential assets to dev dependencies
- **Improved Unicode Extraction**: Enhanced support for various Unicode formats and direct character mappings
:::

## Setup Commands

### `purgetss init` (alias: `i`)

Initializes PurgeTSS in an existing Alloy project by creating the `purgetss/config.cjs` file.

```bash
purgetss init
# or
purgetss i
```

**What it does:**
- Creates `./purgetss/config.cjs` with minimal configuration
- Does NOT modify `alloy.jmk` (use `purgetss` for full initialization)

:::tip
Use this to create a fresh config.cjs if you want to start over. For first-time setup, just run `purgetss` without any arguments.
:::

### `purgetss create` (alias: `c`)

Creates a new Alloy project with PurgeTSS already configured.

```bash
purgetss create 'Name of the Project' [options]
# or
purgetss c 'Name of the Project' [options]
```

**Arguments:**
- Project name (required) - Enclose in single or double quotes

**Options:**
- `-f, --force` - Overwrite existing project without prompting
- `-d, --dependencies` - Install ESLint and Tailwind CSS dev dependencies
- `-v, --vendor [fa,mi,ms,f7]` - Copy icon fonts (FontAwesome, Material Icons, Material Symbols, Framework7)

**Example:**
```bash
purgetss create 'My Awesome App' --dependencies --vendor=fa,mi
```

:::caution Requirements
Ensure that `app.idprefix` and `app.workspace` are configured in Titanium's `config.json`:

```bash
ti config app.idprefix 'com.yourdomain'
ti config app.workspace '/path/to/workspace/folder'
```
:::

### `purgetss install-dependencies` (alias: `id`)

Installs dev dependencies and VS Code configuration files into an existing project.

```bash
purgetss install-dependencies
# or
purgetss id
```

**What it installs:**
- ESLint with Titanium-specific configuration
- Tailwind CSS
- VS Code settings and recommended extensions
- Configuration files (`.editorconfig`, `eslint.config.js`, `tailwind.config.js`, `.vscode/`)

:::caution
This command will overwrite existing `extensions.json` and `settings.json` files. Create a backup if you want to preserve them.
:::

## Development Commands

### `purgetss build` (alias: `b`)

Manually regenerates `tailwind.tss` based on `config.cjs`.

```bash
purgetss build
# or
purgetss b
```

**Use cases:**
- After updating `config.cjs`
- After adding custom fonts to `purgetss/fonts/`
- When `tailwind.tss` seems out of sync

### `purgetss watch` (alias: `w`)

Toggles the automatic purging hook in `alloy.jmk`.

```bash
purgetss watch
# or
purgetss w

# To deactivate:
purgetss watch --off
# or
purgetss w -o
```

**Default behavior:** Activates auto-purge (runs on every compile)

## Asset Commands

### `purgetss icon-library` (alias: `il`)

Downloads and installs official icon fonts into `./app/assets/fonts`.

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

### `purgetss build-fonts` (alias: `bf`)

Generates TSS file with class definitions for custom fonts.

**Workflow:**
1. Place `.ttf` or `.otf` files in `purgetss/fonts/`
2. Run `purgetss build-fonts`
3. PurgeTSS renames fonts to PostScript names (cross-platform compatibility)
4. Generates `purgetss/styles/fonts.tss` with class definitions

```bash
purgetss build-fonts [options]
# or
purgetss bf [options]
```

**Options:**
- `-m, --module` - Generates `purgetss.fonts.js` CommonJS module for programmatic icon usage

:::tip
After adding fonts to `purgetss/fonts/`, always run `purgetss build-fonts` to regenerate the class definitions.
:::

## Utility Commands

### `purgetss shades` (alias: `s`)

Generates a complete 50-950 color palette from a single hex color.

```bash
purgetss shades [color] [name] [options]
# or
purgetss s [color] [name] [options]
```

**Arguments:**
- `color` - Hex color code (e.g., `#53606b`)
- `name` - Name for the color palette (e.g., `primary`)

**Options:**
- `-t, --tailwind` - Outputs Tailwind-compatible structure to console

**Examples:**
```bash
# Generate 'primary' palette from color
purgetss shades #53606b primary

# Output Tailwind format to console
purgetss s #007AFF brand -t
```

**Result in `config.cjs`:**
```javascript
colors: {
  primary: {
    50: '#f0f4f8',
    100: '#e0eaf3',
    // ... all the way to 950
    950: '#0d1216'
  }
}
```

:::info
You can use the `shades` command to generate a range of shades for a given color, automatically adding them to your `config.cjs` file.
:::

### `purgetss color-module` (alias: `cm`)

Generates `app/lib/purgetss.colors.js` with all colors from `config.cjs` for JavaScript usage.

```bash
purgetss color-module
# or
purgetss cm
```

**Usage in JavaScript:**
```javascript
var colors = require('purgetss.colors');
console.log(colors.brand500); // '#1eacff'
```

### `purgetss module` (alias: `m`)

Installs the `<Animation>` component into `app/lib/`.

```bash
purgetss module
# or
purgetss m
```

**What it installs:**
- `purgetss.ui.js` in `app/lib/`
- Declarative animation component
- Support for `play()`, `apply()`, `open`/`close` states, and draggable logic

See [Animation Component](animation-system.md) for usage details.

## Maintenance Commands

### `purgetss update` (alias: `u`)

Updates PurgeTSS to the latest version.

```bash
purgetss update
# or
purgetss u
```

### `purgetss sudo-update` (alias: `su`)

Updates PurgeTSS using sudo (for systems requiring elevated permissions).

```bash
purgetss sudo-update
# or
purgetss su
```

:::caution
Use `sudo-update` only if standard `npm install -g` requires sudo on your system.
:::

## Command Quick Reference

| Command | Alias | Purpose |
|---------|-------|---------|
| `purgetss init` | `i` | Create fresh config.cjs |
| `purgetss create` | `c` | New Alloy project with PurgeTSS |
| `purgetss build` | `b` | Regenerate tailwind.tss |
| `purgetss watch` | `w` | Toggle auto-purge |
| `purgetss icon-library` | `il` | Install icon fonts |
| `purgetss build-fonts` | `bf` | Generate custom font classes |
| `purgetss shades` | `s` | Generate color palette |
| `purgetss color-module` | `cm` | Generate JS color module |
| `purgetss module` | `m` | Install Animation component |
| `purgetss update` | `u` | Update to latest version |

## Advanced Usage

### Combining Commands for New Projects

```bash
# Create project with all bells and whistles
purgetss create 'MyApp' --dependencies --vendor=fa,mi --module

# This is equivalent to running:
# 1. ti create with proper id
# 2. alloy new
# 3. purgetss w (enable watch)
# 4. purgetss b (build styles)
# 5. purgetss icon-library -v=fa,mi -m (fonts with module)
# 6. npm install dev dependencies
# 7. Copy VS Code configs
```

### Safelist for Large Projects

For projects with many classes that should always be included:

```javascript
// ./purgetss/safelist.js
exports.safelist = [
  // Ti Elements
  'Label', 'Button', 'Window', 'ListView', 'TableView', 'ScrollView',
  // Color palette
  'bg-indigo-50', 'bg-indigo-100', /* ... */,
  'bg-indigo-800', 'bg-indigo-900',
  // Custom classes
  'btn-primary', 'card-shadow', /* ... */
];

// ./purgetss/config.cjs
module.exports = {
  purge: {
    options: {
      safelist: require('./safelist')
    }
  }
}
```

:::tip
If you need to keep a large list of classes and elements, you can create a CommonJS module with an array of all the styles and require it in `config.cjs`. You should put the safelist inside the `purgetss` folder to keep everything organized.
:::

### Disabling Specific Classes

To disable entire property plugins:

```javascript
module.exports = {
  purge: {
    options: {
      plugins: [
        'opacity',      // Disable all opacity classes
        'borderRadius'  // Disable all border-radius classes
      ]
    }
  }
}
```

This removes these classes from generation to reduce `app.tss` size.

## Troubleshooting Commands

### Verifying Installation

```bash
# Check PurgeTSS version
purgetss --version

# Verify global installation
which purgetss

# List all available commands
purgetss --help
```

### Debug Mode

Set `purge.options.missing` to `true` in `config.cjs` to see missing classes at the end of `app.tss`:

```javascript
module.exports = {
  purge: {
    options: {
      missing: true  // Reports missing/misspelled classes
    }
  }
}
```

:::info
Set `missing` to `true` if you want to get a list of any missing or misspelled classes at the end of the `app.tss` file. This is very useful if you want to check if you forgot to add a class definition or if you forgot to remove non-existing classes from your views, especially if you have upgraded from PurgeTSS v5 to v6.
:::
