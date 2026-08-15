# PurgeTSS Configuration Deep Dive

<!-- TOC-START -->
## Contents

- [The `config` File](#the-config-file)
- [Create the `config.cjs` File](#create-the-configcjs-file)
- [Structure](#structure)
- [Overriding and Extending Properties](#overriding-and-extending-properties)
- [Customize Colors](#customize-colors)
- [Customize Spacing](#customize-spacing)
- [Community-Discovered Patterns](#community-discovered-patterns)
- [List of Customizable Properties](#list-of-customizable-properties)
- [Custom Rules and Ti Elements](#custom-rules-and-ti-elements)

<!-- TOC-END -->

## The `config` File

> **ℹ️ INFO**
> The configuration file is named `config.cjs` (it used to be `config.js`). The structure is the same. Legacy mode was removed in PurgeTSS v7.2.x along with its related options.

By default, PurgeTSS looks for `./purgetss/config.cjs`, where you can define customizations.

## Create the `config.cjs` File

> **ℹ️ INFO**
> `config.cjs` is created automatically the first time you run `purgetss` in a project.

If you want a clean `config.cjs`, delete the existing one and run:

```bash
purgetss init
```

This creates a `./purgetss/config.cjs` file with the default sections:

```javascript
module.exports = {
  purge: {
    mode: 'all',
    method: 'sync', // How to execute the auto-purging task: sync or async

    // These options are passed directly to PurgeTSS
    options: {
      missing: true, // Reports missing classes
      widgets: false, // Purges widgets too
      safelist: [], // Array of classes to keep
      plugins: [] // Array of properties to ignore
    }
  },
  brand: {
    background: '#FFFFFF',   // inherited by every piece that doesn't set its own
    confirmOverwrites: true, // prompt before overwriting files (set false to skip)
    optimize: false,         // true = quantize the generated PNGs to a palette (lossy, ~71% smaller)

    // One block per piece. Artwork comes from purgetss/brand/logo-<piece>.{svg,png};
    // these keys are for numbers, colors and activation. Padding is never inherited.
    icon:             { padding: '4%' },    // DefaultIcon.png + DefaultIcon-ios.png
    dark:             { background: null }, // DefaultIcon-Dark.png
    tinted:           {},                   // DefaultIcon-Tinted.png
    iosSplash:        { padding: '26%' },   // assets/iphone/Default*.png × 16
    launchLogo:       { padding: '12%' },   // LaunchLogo.png (1024×1024)
    marketplace:      {},                   // iTunesConnect.png + MarketplaceArtwork.png
    featureGraphic:   { padding: '12%' },   // MarketplaceArtworkFeature.png (1024×500)
    adaptive:         { padding: '18%' },   // ic_launcher_{foreground,background,monochrome}.png × 5 + ic_launcher.xml
    legacyIcon:       { padding: '10%' },   // ic_launcher.png × 5
    appicon:          {},                   // appicon.png (128×128)
    androidSplash:    { padding: '26%' },   // assets/android/default.png + images/res-*/default.png × 11

    // Opt-in: inert until you edit the Android theme / FCM meta-data by hand.
    splashIcon:       { enabled: false },   // drawable-*/splash_icon.png × 5
    notificationIcon: { enabled: false },   // drawable-*/ic_stat_notify.png × 5
    ninePatch:        { enabled: false }    // background.9.png (not implemented yet)
  },
  images: {
    autoSync: true,          // false = SVG pipeline computes dims but doesn't write to images.files (v7.11.0)
    quality: 85,             // JPEG/WebP/AVIF quality (0-100)
    format: null,            // null = keep original; 'webp' | 'jpeg' | 'png' to convert every image
    confirmOverwrites: true, // prompt before overwriting files (set false to skip)
    files: []                // per-file overrides: [{ filename, width, height? }] (v7.11.0)
    // Note: --width (v7.8.0) and --opacity / --padding / --output (v7.10.0) are CLI-only
    //       by design — those decisions are per-asset, not project-wide.
  },
  theme: {
    extend: {}
  }
};
```

`init` also creates empty `purgetss/fonts/`, `purgetss/brand/`, and `purgetss/images/` folders on first run, so you can see where each kind of asset goes.

Every section is optional. Only add what you want to change. Anything missing falls back to the defaults.

## Structure

The config file has four main sections: `purge`, `brand`, `images`, and `theme`.

`brand:` and `images:` configure the matching CLI commands — see [CLI Commands: `brand`](./cli-commands.md#brand-command) and [CLI Commands: `images`](./cli-commands.md#images-command) for the full option lists. The rest of this page covers `purge` and `theme`.

For `brand`, the structure is **one block per piece of artwork** (v7.13.0), each accepting the same four keys where they apply:

- `logo`: path to this piece's artwork, when it lives outside `purgetss/brand/`
- `padding`: inset per side, as a number or a percentage string like `'19%'` — **never inherited**
- `background`: hex color, or `null` for transparent — inherited from `brand.background`
- `enabled`: `false` turns a default piece off, `true` turns an opt-in piece on

Plus `brand.background`, `brand.confirmOverwrites`, `brand.optimize`, `brand.logo` (the main logo) and `brand.monochromeLogo`.

> **INFO — Older `brand:` blocks update themselves**
> A `brand:` block written for an earlier PurgeTSS is rewritten **on disk** to this structure on the next run, carrying over every value that had been customized and printing each one it moved. Both earlier shapes are recognized: the original flat keys and the v7.7.0 grouped sections (`logos` / `padding` / `android` / `ios` / `colors`). This replaced the in-memory translation used from v7.10.2 to v7.12.1. A key that belongs to no structure at all — a typo — aborts the run with the list of valid ones instead of being ignored. See [App Icons & Branding → Older configs update themselves](./app-branding.md#older-configs-update-themselves).

For the property-by-property reference, see [App Icons & Branding → Brand config reference](./app-branding.md#brand-config-reference) and [Configurable Properties](./configurable-properties.md).

### Overriding logo paths

By default, PurgeTSS auto-discovers logo files from `purgetss/brand/` — `logo.{svg,png}` for the main artwork and `logo-<piece>.{svg,png}` for a specific piece. If you want to use custom paths, set `logo` on the piece:

```javascript
module.exports = {
  brand: {
    logo: './my-logos/main.svg',                       // overrides auto-discovered logo.svg
    monochromeLogo: './my-logos/mono.svg',             // overrides auto-discovered logo-mono.svg
    adaptive: { logo: './my-logos/adaptive.svg' },     // Android launcher mark
    dark: { logo: './my-logos/dark.svg' },             // iOS 18+ dark variant
    tinted: { logo: './my-logos/tinted.svg' },         // iOS 18+ tinted variant
    featureGraphic: { logo: './my-logos/feature.svg' } // Google Play 1024×500 banner
  }
};
```

You only need to override the ones you're using. Missing overrides still auto-discover from `purgetss/brand/`.

### `purge` Section

The `purge` section controls how PurgeTSS removes unused classes or keeps the ones you want.

```javascript
module.exports = {
  purge: {
    mode: 'all',
    method: 'sync', // How to execute the auto-purging task: sync or async

    // These options are passed through directly to PurgeTSS
    options: {
      missing: true, // Reports missing classes
      widgets: false, // Purges widgets too
      safelist: [], // Array of classes to keep
      plugins: [] // Array of properties to ignore
    }
  }
};
```

- **`mode: 'all'`**

  By default, PurgeTSS searches XML files everywhere: comments, attributes, classes, IDs, and Ti Elements.

  Use this mode if you want PurgeTSS to parse Ti Elements you style in `config.cjs`.

- **`method: 'sync'` or `method: 'async'`**

  The `method` setting controls how the auto-purge task runs: `sync` (default) or `async`.

  If changes are not showing up when rebuilding a project with TiKit Components and LiveView, set the method to `async`.

- **`mode: 'class'`**

  Use `class` to search only class and ID attributes in XML files.

- **`options.missing`**

  Set `missing` to `true` if you want a list of missing or misspelled classes at the end of `app.tss`.

  This is useful when you want to confirm you did not forget class definitions or when upgrading older projects.

- **`options.widgets`**

  Set `widgets` to `true` to also parse all XML files under the Widgets folder.

- **`options.safelist`**

  The `safelist` is a list of classes and Ti Elements you want to keep no matter the purge mode or whether they appear in XML.

  If the list is large, put it in a CommonJS module and require it in `config.cjs`:

  ```javascript
  module.exports = {
    purge: {
      options: {
        safelist: require('./safelist')
      }
    }
  };
  ```

  Keep the safelist inside the `purgetss` folder:

  ```javascript
  // ./purgetss/safelist.js
  exports.safelist = [
    'Label',
    'Button',
    'Window',
    'ListView',
    'TableView',
    'ScrollView',
    'ScrollableView',
    'bg-indigo-50',
    'bg-indigo-100',
    'bg-indigo-800',
    'bg-indigo-900'
  ];
  ```

- **`options.plugins`**

  The `plugins` option lets you disable classes PurgeTSS would normally generate.

  To disable specific classes, provide an array of properties (or plugins) to disable:

  ```javascript
  module.exports = {
    purge: {
      options: {
        plugins: [
          'opacity',
          'borderRadius'
        ]
      }
    }
  };
  ```

### `theme` Section

The `theme` section defines your project's color palette, type scale, font stacks, border radius values, and other properties.

```javascript
module.exports = {
  theme: {
    fontFamily: {
      display: 'AlfaSlabOne-Regular',
      body: 'BarlowSemiCondensed-Regular'
    },
    borderWidth: {
      DEFAULT: 1,
      0: 0,
      2: 2,
      4: 4
    },
    extend: {
      colors: {
        cyan: '#9cdbff'
      },
      spacing: {
        96: '24rem',
        128: '32rem'
      }
    }
  }
};
```

### Default `font-sans`, `font-serif`, `font-mono`

PurgeTSS generates three `fontFamily` classes by default, even when `theme.fontFamily` is not set in `config.cjs`. iOS and Android get different values on purpose so each platform picks its native system font:

| Class        | iOS              | Android      |
| ------------ | ---------------- | ------------ |
| `font-sans`  | `Helvetica Neue` | `sans-serif` |
| `font-serif` | `Georgia`        | `serif`      |
| `font-mono`  | `monospace`      | `monospace`  |

If you define a value for `sans`, `serif`, or `mono` in `theme.fontFamily` (or `theme.extend.fontFamily`), your value replaces the default on both platforms — no per-platform fork needed:

`./purgetss/config.cjs`
```javascript
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: 'Inter-Regular' // replaces Helvetica Neue / sans-serif on both platforms
      }
    }
  }
};
```

### Config Syntax Validation (v7.11.0)

Since v7.11.0, PurgeTSS validates known fields in `config.cjs` at load time. On a type mismatch it prints a formatted `Config Syntax Error` block — file, JSON path, context, issue, and a fix snippet — instead of crashing downstream with a cryptic message like `rule.startsWith is not a function`.

The validator runs on every config load and covers the case that trips up developers coming from Tailwind: `fontFamily` values must be a **string**, not a Tailwind-style array. It currently validates:

- `theme.fontFamily.*` — expected a string.
- `theme.extend.fontFamily.*` — expected a string.

```javascript
// ✗ Tailwind-style array — triggers a Config Syntax Error
theme: {
  extend: {
    fontFamily: {
      sans: ['Inter', 'sans-serif']
    }
  }
}

// ✓ Single font family per element (Titanium accepts one)
theme: {
  extend: {
    fontFamily: {
      sans: 'Inter-Regular'
    }
  }
}
```

The scope is defined by the `FIELD_RULES` array in `src/shared/validation/config-validator.js`; additional fields can be added there. Today only the two `fontFamily` paths are validated.

## Overriding and Extending Properties

By default, your project inherits values from the default theme. You have two options depending on your goal.

### Override Properties

To override a default property, add it directly in the `theme` section.

```javascript
module.exports = {
  theme: {
    // Replaces all of the default `opacity` values
    opacity: {
      15: '0.15',
      35: '0.35',
      65: '0.65',
      85: '0.85'
    }
  }
};
```

This completely replaces the original default `opacity` values with the new ones.

> **ℹ️ INFO**
> Keys you do not provide are inherited from the default theme. In the example above, colors, spacing, border radius, background position, and other defaults remain.

### Extend Properties

If you want to keep the defaults and add new values, place them under `theme.extend`.

For example, if you want to add an extra color but preserve the existing ones, you could extend the `colors` section:

```javascript
module.exports = {
  theme: {
    extend: {
      // Adds a new color in addition to the default colors
      colors: {
        primary: '#002359'
      }
    }
  }
};
```

You can override some parts of the default theme and extend others within the same configuration:

```javascript
module.exports = {
  theme: {
    opacity: {
      15: '0.15',
      35: '0.35',
      65: '0.65',
      85: '0.85'
    },
    extend: {
      colors: {
        primary: '#002359'
      }
    }
  }
};
```

## Customize Colors

PurgeTSS includes Tailwind's default color palette. Customize it under the `colors` key in the `theme` section of your `config.cjs` file.

### Use Custom Colors

To replace the default color palette, add your colors directly under `theme.colors`:

```javascript
module.exports = {
  theme: {
    colors: {
      transparent: 'transparent',
      white: '#ffffff',
      purple: '#3f3cbb',
      midnight: '#121063',
      metal: '#565584',
      tahiti: '#3ab7bf',
      silver: '#ecebff',
      'bubble-gum': '#ff77e9',
      bermuda: '#78dcca'
    }
  }
};
```

These colors are available across utilities like text, border, and background colors.

### Color Object Syntax

Colors can be defined as a simple list of key-value pairs or as nested objects. Nested keys are added to the base color name as modifiers.

```javascript
module.exports = {
  theme: {
    colors: {
      highlight: '#ffff00',
      primary: {
        solid: '#002359',
        dark: '#000030',
        transparent: '#D9002359'
      },
      tahiti: {
        100: '#cffafe',
        200: '#a5f3fc',
        300: '#67e8f9',
        400: '#22d3ee',
        500: '#06b6d4',
        600: '#0891b2',
        700: '#0e7490',
        800: '#155e75',
        900: '#164e63'
      }
    }
  }
};
```

The nested keys are combined with the parent key to form class names like `bg-tahiti-400` or `text-tahiti-400`.

### Nesting beyond one level

Since v7.10.0, `theme` and `theme.extend` values are walked recursively, so you can group categories more than one level deep. Each level flattens into a kebab-case suffix on the generated class names:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: {
            500: '#0ea5e9',
            900: '#0c4a6e'
          },
          accent: '#f97316'
        }
      }
    }
  }
};
```

```tss
'.bg-brand-primary-500': { backgroundColor: '#0ea5e9' }
'.bg-brand-primary-900': { backgroundColor: '#0c4a6e' }
'.bg-brand-accent': { backgroundColor: '#f97316' }
```

Default modifier keys (`default`, `global`, `DEFAULT`) collapse without contributing to the suffix. The same flattening applies to other property categories that accept nested objects, including `backgroundGradient` and `backgroundSelectedGradient`. One-level configs behave exactly as before.

### Override a Default Color

If you want to override one of the default colors but keep the rest, provide the new values in `theme.extend.colors`.

For example, replacing the default cool grays with a neutral gray palette:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        gray: {
          50: '#f7f7f7',
          100: '#ededed',
          200: '#dfdfdf',
          300: '#c8c8c8',
          400: '#adadad',
          500: '#9e9e9e',
          600: '#888888',
          700: '#7b7b7b',
          800: '#676767',
          900: '#545454'
        }
      }
    }
  }
};
```

### Extend the Default Palette

If you want to extend the default color palette, use `theme.extend.colors`.

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'regal-blue': '#243c5a'
      }
    }
  }
};
```

This generates classes like `bg-regal-blue` in addition to all of Tailwind's default colors.

> **ℹ️ INFO**
> You can use the `shades` command to generate a range of shades for a color and add them to `config.cjs`. See [CLI Commands](./cli-commands.md#shades-command).

## Customize Spacing

The `spacing` section sets the global spacing and sizing scale.

```javascript
module.exports = {
  theme: {
    spacing: {
      1: '8px',
      2: '12px',
      3: '16px',
      4: '24px',
      5: '32px',
      6: '48px'
    }
  }
};
```

By default, the spacing scale is inherited by the padding, margin, width, height, and gap core plugins.

### Shared Spacing

The `spacing` section is shared by the `padding`, `margin`, `width`, and `height` properties.

When you include the `spacing` section, PurgeTSS automatically generates all spacing-related properties and merges them with any other spacing-related properties present in the configuration file.

```javascript
module.exports = {
  theme: {
    spacing: {
      tight: '0.25rem',
      loose: '1.0rem'
    },
    width: {
      banner: '5rem'
    },
    height: {
      xl: '3rem',
      '1/3': '33.333333%'
    }
  }
};
```

```tss
/* width */
'.w-tight': { width: 4 }
'.w-loose': { width: 16 }
'.w-banner': { width: 80 }

/* height */
'.h-tight': { height: 4 }
'.h-loose': { height: 16 }
'.h-xl': { height: 48 }
'.h-1/3': { height: '33.333334%' }

/* margin */
'.m-tight': { top: 4, right: 4, bottom: 4, left: 4 }
'.m-loose': { top: 16, right: 16, bottom: 16, left: 16 }
'.my-tight': { top: 4, bottom: 4 }
'.my-loose': { top: 16, bottom: 16 }

/* padding */
'.p-tight': { padding: { top: 4, right: 4, bottom: 4, left: 4 } }
'.p-loose': { padding: { top: 16, right: 16, bottom: 16, left: 16 } }
'.py-tight': { padding: { top: 4, bottom: 4 } }
'.py-loose': { padding: { top: 16, bottom: 16 } }
```

### Override the Default Spacing Scale

If you want to override the default spacing scale, use `theme.spacing` in `config.cjs`:

```javascript
module.exports = {
  theme: {
    spacing: {
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24
    }
  }
};
```

This disables the default spacing scale and generates classes like `p-sm` for padding, `m-md` for margin, `w-lg` for width, and `h-xl` for height.

### Extend the Default Spacing Scale

If you want to extend the default spacing scale, use `theme.extend.spacing`:

```javascript
module.exports = {
  theme: {
    extend: {
      spacing: {
        72: '18rem',
        84: '21rem',
        96: '24rem'
      }
    }
  }
};
```

This generates classes like `p-72`, `m-84`, and `h-96` in addition to all of the default spacing and sizing utilities.

## Community-Discovered Patterns

### Titanium Layout Constraint: `padding` on View / Window / ScrollView / TableView

Titanium does not support native `padding` on `View`, `Window`, `ScrollView`, or `TableView`. Even if PurgeTSS generates spacing-related utilities (`p-*`, `px-*`, `py-*`), applying them to those elements is silently ignored at runtime. Prefer margins on the children of those containers instead — `m-*`, `mt-*`, `mb-*`, etc. — which Titanium honors correctly.

This is a Titanium platform constraint, not a PurgeTSS bug. `Button`, `Label`, and `TextField` do accept `padding` natively.

## List of Customizable Properties

The official guide ends with an exhaustive list of color and configurable properties. In this skill, that list is maintained separately in [Configurable Properties](./configurable-properties.md) so this guide stays focused on config structure and usage patterns.

## Custom Rules and Ti Elements

Create your own custom rules and include Ti Elements with any number of attributes or conditional statements. See [Custom Rules](./custom-rules.md) for the rule syntax and examples.
