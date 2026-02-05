# Migrating to PurgeTSS

Guide for migrating existing Titanium Alloy apps from manual TSS styling to PurgeTSS utility-first workflow.

## Assessment Checklist

Before migrating, evaluate styling in the current codebase:

| Current State                                | Target State                              |
| -------------------------------------------- | ----------------------------------------- |
| Manual `.tss` files per controller           | PurgeTSS utility classes in XML           |
| Inline attributes (`backgroundColor="#fff"`) | PurgeTSS classes (`bg-white`)             |
| `id`-based styles in `app.tss`               | Class-based utility styling               |
| Manual 2D Matrix animations                  | PurgeTSS Animation component              |
| Platform conditionals in controllers         | PurgeTSS platform modifiers (`ios:mt-10`) |

:::info v7.3 Upgrade Note
If your project or scripts reference `tailwind.tss`, update them to `utilities.tss` (the file was renamed in v7.3).
:::

## Step 1: Initialize PurgeTSS

```bash
cd your-app
purgetss init
```

This creates the `./purgetss/` folder with `config.cjs` and sets up the auto-run hook.

## Step 2: Backup Existing Styles

PurgeTSS automatically backs up your existing `app.tss` to `_app.tss`. Your custom styles are preserved and will be merged during compilation.

## Step 3: Migrate Views Incrementally

Migrate one view at a time. Don't try to convert everything at once.

### Before (Manual TSS)

```xml
<!-- views/index.xml -->
<View id="header">
  <Label id="title" text="Welcome" />
</View>
```

```tss
/* styles/index.tss */
"#header": { backgroundColor: "#fff", height: 60, top: 0 }
"#title": { color: "#333", font: { fontSize: 18, fontWeight: "bold" } }
```

### After (PurgeTSS)

```xml
<!-- views/index.xml -->
<View class="top-0 h-16 bg-white">
  <Label class="text-lg font-bold text-gray-800" text="Welcome" />
</View>
```

No manual TSS needed — delete the `#header` and `#title` styles.

## Step 4: Remove Manual TSS Files

Once a view is fully migrated to utility classes:

1. Remove corresponding entries from `_app.tss`
2. Delete any controller-specific `.tss` files (e.g., `styles/login.tss`)
3. Run `purgetss` to regenerate `app.tss`

## Common Style Translations

| Manual TSS                     | PurgeTSS Class          |
| ------------------------------ | ----------------------- |
| `backgroundColor: "#ffffff"`   | `bg-white`              |
| `backgroundColor: "#f3f4f6"`   | `bg-gray-100`           |
| `color: "#1f2937"`             | `text-gray-800`         |
| `font: { fontSize: 18 }`       | `text-lg`               |
| `font: { fontWeight: "bold" }` | `font-bold`             |
| `width: Ti.UI.FILL`            | `w-screen`              |
| `height: Ti.UI.SIZE`           | `h-auto`                |
| `height: 60`                   | `h-16` (64) or `h-(60)` |
| `top: 0`                       | `top-0`                 |
| `left: 16, right: 16`          | `mx-4`                  |
| `top: 16`                      | `mt-4`                  |
| `borderRadius: 8`              | `rounded-lg`            |
| `opacity: 0.5`                 | `opacity-50`            |
| `layout: "horizontal"`         | `horizontal`            |
| `layout: "vertical"`           | `vertical`              |

### Platform-Specific Translations

| Manual Code                              | PurgeTSS                         |
| ---------------------------------------- | -------------------------------- |
| `if (OS_IOS) { view.top = 40 }`          | `class="ios:mt-10 mt-5"`         |
| `if (OS_ANDROID) { view.elevation = 4 }` | `class="android:elevation-4"`    |
| Tablet conditional in controller         | `class="tablet:w-6/12 w-screen"` |

### Animation Translations

| Manual Animation                       | PurgeTSS Animation                                      |
| -------------------------------------- | ------------------------------------------------------- |
| `Ti.UI.create2DMatrix()` + `animate()` | `<Animation module="purgetss.ui" class="..." />`        |
| Manual opacity animation               | `class="close:opacity-0 open:opacity-100 duration-300"` |
| Manual scale animation                 | `class="close:scale-100 open:scale-95 duration-150"`    |

## Migration Pitfalls

| Pitfall                          | Consequence                       | Prevention                       |
| -------------------------------- | --------------------------------- | -------------------------------- |
| Editing `app.tss` directly       | Changes overwritten on next build | Use `_app.tss` for custom styles |
| Migrating styles without testing | Broken layouts                    | Test each view on both platforms |
| Using `flex-row`/`justify-*`     | Classes don't exist               | Use `horizontal`/`vertical`      |
| Using `p-*` on container Views   | No padding on containers          | Use `m-*` on children            |
| Forgetting `autoStyle: false`    | Style conflicts                   | Set in `config.json`             |
| Using `w-[100px]` syntax         | Wrong bracket style               | Use `w-(100px)` with parentheses |

## Rollback Strategy

For each view migration:

1. **Create a branch** before starting
2. **Migrate one view** completely
3. **Test thoroughly** on both iOS and Android
4. **Keep legacy styles** in `_app.tss` until stable
5. **Delete legacy styles** only after confirming utility classes work

:::tip Migration Order
Start with simple views (static content, few elements) and progress to complex ones (forms, lists). This builds familiarity with PurgeTSS classes before tackling harder views.
:::
