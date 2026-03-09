# PurgeTSS Configuration Deep Dive

## The `config` File

:::info
`config.cjs` is the active configuration filename. Older `config.js` references are outdated.
:::

By default, PurgeTSS looks for `./purgetss/config.cjs`, where you can define customizations.

## Create the `config.cjs` File

:::info
`config.cjs` is created automatically the first time you run `purgetss` in a project.
:::

If you want a clean `config.cjs`, delete the existing one and run:

```bash
purgetss init
```

This creates a minimal `./purgetss/config.cjs` file:

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
  theme: {
    extend: {}
  }
};
```

Every section is optional. Only add what you want to change. Anything missing falls back to the defaults.

## Structure

The config file has two main sections: `purge` and `theme`.

### `purge` Section

The `purge` section controls how PurgeTSS removes unused classes or keeps the ones you want.

```javascript
module.exports = {
  purge: {
    mode: 'all',
    method: 'sync',
    options: {
      missing: true,
      widgets: false,
      safelist: [],
      plugins: []
    }
  }
}
```

- `mode: 'all'`

  By default, PurgeTSS searches XML files everywhere: comments, attributes, classes, IDs, and Ti Elements.

  Use this mode if you want PurgeTSS to parse Ti Elements you style in `config.cjs`.

- `method: 'sync'` or `method: 'async'`

  The `method` setting controls how the auto-purge task runs.

  If changes are not showing up when rebuilding a project with TiKit Components and LiveView, set the method to `async`.

- `mode: 'class'`

  Use `class` to search only class and ID attributes in XML files.

- `options.missing`

  Set `missing` to `true` if you want a list of missing or misspelled classes at the end of `app.tss`.

  This is useful when you want to confirm you did not forget class definitions or when upgrading older projects.

- `options.widgets`

  Set `widgets` to `true` to also parse all XML files under the widgets folder.

- `options.safelist`

  The `safelist` is a list of classes and Ti Elements you want to keep no matter the purge mode or whether they appear in XML.

  If the list is large, put it in a CommonJS module and require it in `config.cjs`:

```javascript
module.exports = {
  purge: {
    options: {
      safelist: require('./safelist')
    }
  }
}
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

- `options.plugins`

  The `plugins` option lets you disable classes PurgeTSS would normally generate.

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
}
```

### `theme` Section

The `theme` section in `config.cjs` is where you define and extend your project's color palette, type scale, font stacks, border radius values, and other properties.

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
}
```

## Overriding and Extending Properties

By default, your project inherits values from the default theme. You have two options depending on your goal.

### Override Properties

To override a default property, add it directly in the `theme` section.

```javascript
module.exports = {
  theme: {
    opacity: {
      15: '0.15',
      35: '0.35',
      65: '0.65',
      85: '0.85'
    }
  }
}
```

This completely replaces the original default `opacity` values with the new ones.

:::info
Keys you do not provide are inherited from the default theme. In the example above, colors, spacing, border radius, background position, and other defaults remain.
:::

### Extend Properties

If you want to keep the defaults and add new values, place them under `theme.extend`.

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#002359'
      }
    }
  }
}
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
}
```

## Customize Colors

PurgeTSS includes a default color palette. Customize it under the `colors` key in the `theme` section of your `config.cjs` file.

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
}
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

### Override a Default Color

If you want to override one of the default colors but keep the rest, provide the new values in `theme.extend.colors`.

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
}
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
}
```

This generates classes like `bg-regal-blue`.

:::info
You can use the `shades` command to generate a range of shades for a color and add them to `config.cjs`. See [CLI Commands](./cli-commands.md#shades-command).
:::

## Customize Spacing

The `spacing` section controls the global spacing and sizing scale values.

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
}
```

By default, the spacing scale is inherited by the padding, margin, width, height, and gap plugins.

### Shared Spacing

The `spacing` section is shared by `padding`, `margin`, `width`, and `height`.

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
}
```

This generates classes like `p-sm`, `m-md`, `w-lg`, and `h-xl`.

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
}
```

This generates classes like `p-72`, `m-84`, and `h-96` in addition to the default spacing and sizing utilities.

:::warning Titanium Layout Constraint
Titanium does not support native `padding` on `View`, `Window`, `ScrollView`, or `TableView`. Even if PurgeTSS can generate spacing-related utilities, prefer margins on children for those elements.
:::

## List of Customizable Properties

The official guide ends with an exhaustive list of color and configurable properties. In this skill, that subsection is maintained separately in [Configurable Properties](./configurable-properties.md) so the main configuration guide stays focused.

## Custom Rules and Ti Elements

Create your own custom rules and include Ti Elements with any number of attributes or conditional statements. See [Custom Rules](./custom-rules.md) for the rule syntax and examples.
