# The `opacity` Modifier

:::info
Add an opacity modifier to any available color property by appending a value between `0` and `100` after a slash (`/`).
:::

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

You can also use color opacity modifiers in the `apply` directive in `config.cjs`.

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
}
```

`Generated classes`
```tss
/* Custom Styles and Resets */
'.main-banner': { backgroundColor: '#59ce10cc', borderColor: '#bfce10cc' }

/* backgroundColor Property */
'.bg-primary': { backgroundColor: '#ce10cc' }
```

:::caution Semantic Colors
Semantic colors cannot be modified with the opacity modifier because they are defined as an object with light and dark values.
:::

:::info Gradients
The same modifier logic applies to color-based gradient utilities such as `from-*` and `to-*`. When you define custom `backgroundGradient.colors` arrays of `{ color, offset }` objects in `config.cjs`, PurgeTSS v7.4.0 correctly serializes those nested objects in `utilities.tss`.
:::
