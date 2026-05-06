# The `opacity` Modifier

> **INFO**
> Add an opacity modifier to any available color property by appending a value between 0 and 100 after a slash (`/`).

## In Your XML Files

```xml
<Label class="w-11/12 h-8 text-center bg-sky-500/50 text-purple-900/75">My Button</Label>
```

```tss
/* Main styles */
'Window': { backgroundColor: '#ffffff' }
'.h-8': { height: 32 }
'.text-center': { textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER }
'.w-11/12': { width: '91.666667%' }

/* Styles with color opacity modifiers */
'.bg-sky-500/50': { backgroundColor: '#800ea5e9' }
'.text-purple-900/75': { color: '#bf581c87', textColor: '#bf581c87' }
```

## In the `apply` Directive

You can also use color opacity modifiers in the `apply` directive in the `config.cjs` file.

`./purgetss/config.cjs`
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#ce10cc'
      }
    },
    '.main-banner': {
      apply: [
        'bg-primary/35',
        'border-primary/75'
      ]
    }
  }
};
```

`Generated classes`
```tss
/* Custom Styles and Resets */
'.main-banner': { backgroundColor: '#59ce10cc', borderColor: '#bfce10cc' }

/* backgroundColor Property */
'.bg-primary': { backgroundColor: '#ce10cc' }
```

## Semantic colors

Since v7.9.0, opacity modifiers also work on classes that resolve to a semantic color. Any class mapped to a semantic color entry can use `/<percent>` syntax.

```xml
<View class="bg-surface/65" />
```

PurgeTSS detects that `bg-surface` maps to the semantic name `surfaceColor`, then derives a new semantic key (`surfaceColor_65`) with the original `light` and `dark` hex values plus the requested alpha for both modes. It writes that key back to `semantic.colors.json` and emits the rule against the derived key. Light/Dark switching still works.

See [Semantic colors — Opacity modifier auto-derivation](./semantic-colors.md#opacity-modifier-auto-derivation) for the full mechanics.

## Community-Discovered Patterns

The following note reflects community observations about how the opacity modifier interacts with gradient utilities.

> **Gradients**
> The same modifier logic applies to color-based gradient utilities such as `from-*` and `to-*`. When you define custom `backgroundGradient.colors` arrays of `{ color, offset }` objects in `config.cjs`, PurgeTSS v7.4.0 correctly serializes those nested objects in `utilities.tss`.
