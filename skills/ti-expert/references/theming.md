# Theming & Dark Mode

## Alloy Theme System

Alloy has a built-in theme system via the `app/themes/` folder. Themes override views, styles, and assets without modifying originals.

### Theme Folder Structure

```
app/
├── themes/
│   ├── light/                   # Light theme (or default)
│   │   ├── styles/
│   │   │   └── app.tss          # Overrides app/styles/app.tss
│   │   └── assets/
│   │       └── images/
│   │           └── logo.png     # Overrides app/assets/images/logo.png
│   └── dark/                    # Dark theme
│       ├── styles/
│       │   └── app.tss          # Dark overrides
│       └── assets/
│           └── images/
│               └── logo.png     # Dark version of logo
├── styles/
│   └── app.tss                  # Base styles (used when no theme active)
├── config.json
```

### Activating a Theme

Set the theme in `config.json`:

```json
{
  "global": {
    "theme": "light"
  },
  "env:development": {
    "theme": "light"
  }
}
```

:::warning Theme is compile-time only
Alloy themes are applied at **build time**. You cannot switch themes at runtime using this system alone. For runtime switching, use the Dynamic Theming approach below.
:::

### Theme Cascade

When a theme is active, Alloy merges files in this order:
1. `app/styles/app.tss` (base)
2. `app/themes/<theme>/styles/app.tss` (theme override)
3. `app/styles/<controller>.tss` (controller-specific)
4. `app/themes/<theme>/styles/<controller>.tss` (theme + controller override)

Theme files **merge** with base files — you only need to include properties you want to override.

---

## Dynamic Theming with Alloy.Globals

For runtime theme switching (including Dark Mode), use `Alloy.Globals` as a centralized color palette.

### Step 1: Define Color Palette

```javascript
// alloy.js
const themes = {
  light: {
    bg: '#ffffff',
    bgSecondary: '#f3f4f6',
    text: '#111827',
    textSecondary: '#6b7280',
    primary: '#2563eb',
    primaryText: '#ffffff',
    border: '#e5e7eb',
    card: '#ffffff',
    danger: '#ef4444',
    success: '#22c55e'
  },
  dark: {
    bg: '#111827',
    bgSecondary: '#1f2937',
    text: '#f9fafb',
    textSecondary: '#9ca3af',
    primary: '#3b82f6',
    primaryText: '#ffffff',
    border: '#374151',
    card: '#1f2937',
    danger: '#f87171',
    success: '#4ade80'
  }
}

// Load saved preference or default to light
const savedTheme = Ti.App.Properties.getString('app:theme', 'light')
Alloy.Globals.theme = themes[savedTheme]
Alloy.Globals.themeName = savedTheme
```

### Step 2: Use in TSS with Alloy.Globals

```tss
/* app.tss - Global base styles using theme colors */
"Window": {
  backgroundColor: Alloy.Globals.theme.bg
}

"Label": {
  color: Alloy.Globals.theme.text
}

".card": {
  backgroundColor: Alloy.Globals.theme.card,
  borderWidth: 1,
  borderColor: Alloy.Globals.theme.border,
  borderRadius: 12
}

".btn-primary": {
  backgroundColor: Alloy.Globals.theme.primary,
  color: Alloy.Globals.theme.primaryText,
  height: 48,
  borderRadius: 8,
  font: { fontWeight: 'bold' }
}

".text-secondary": {
  color: Alloy.Globals.theme.textSecondary
}

".bg-secondary": {
  backgroundColor: Alloy.Globals.theme.bgSecondary
}
```

### Step 3: Theme Switching Service

```javascript
// lib/services/themeService.js
const EventBus = require('services/eventBus')

const themes = {
  light: { /* ... same as alloy.js ... */ },
  dark: { /* ... same as alloy.js ... */ }
}

exports.ThemeService = {
  getCurrentTheme() {
    return Alloy.Globals.themeName
  },

  setTheme(name) {
    if (!themes[name]) return

    Alloy.Globals.theme = themes[name]
    Alloy.Globals.themeName = name
    Ti.App.Properties.setString('app:theme', name)

    // Notify all listeners
    EventBus.trigger('theme:changed', { theme: name })
  },

  toggle() {
    const next = Alloy.Globals.themeName === 'light' ? 'dark' : 'light'
    this.setTheme(next)
  },

  // Follow system Dark Mode (iOS 13+, Android 10+)
  followSystem() {
    if (Ti.UI.semanticColorType !== undefined) {
      const isDark = Ti.UI.semanticColorType === Ti.UI.SEMANTIC_COLOR_TYPE_DARK
      this.setTheme(isDark ? 'dark' : 'light')
    }
  }
}
```

### Step 4: Respond to Theme Changes in Controllers

:::warning Theme change requires UI rebuild
Since TSS is applied at controller creation time, changing `Alloy.Globals.theme` does NOT retroactively update already-rendered views. You must manually update visible elements or restart the root controller.
:::

**Approach A: Rebuild root controller (simplest)**

```javascript
// controllers/settings.js
const { ThemeService } = require('services/themeService')

function onToggleTheme() {
  ThemeService.toggle()

  // Restart app from root controller
  const root = Alloy.createController('index')
  root.getView().open()

  // Close current window tree
  $.getView().close()
}
```

**Approach B: Update visible elements in-place (smoother)**

```javascript
// controllers/settings.js
const EventBus = require('services/eventBus')
const { ThemeService } = require('services/themeService')

function init() {
  EventBus.on('theme:changed', applyTheme)
}

function applyTheme() {
  const t = Alloy.Globals.theme

  $.settingsWindow.applyProperties({ backgroundColor: t.bg })
  $.titleLabel.applyProperties({ color: t.text })
  $.themeToggle.applyProperties({ backgroundColor: t.bgSecondary })
}

function onToggleTheme() {
  ThemeService.toggle()
}

function cleanup() {
  EventBus.off('theme:changed', applyTheme)
  $.destroy()
}

$.cleanup = cleanup
```

---

## System Dark Mode Detection

### iOS 13+ / Android 10+

```javascript
// lib/services/themeService.js (add to existing service)

exports.ThemeService = {
  // ... existing methods ...

  // Initialize system theme listener
  initSystemListener() {
    // Detect current system theme
    this.followSystem()

    // Listen for system theme changes
    Ti.App.addEventListener('significantTimeChange', () => {
      this.followSystem()
    })

    // iOS: userInterfaceStyle change
    if (OS_IOS) {
      Ti.App.addEventListener('traitCollectionChange', () => {
        this.followSystem()
      })
    }
  }
}
```

### Semantic Colors (iOS)

Titanium supports iOS semantic colors that automatically adapt to Dark Mode:

```tss
/* These colors automatically switch in Dark Mode */
"#label": {
  color: Ti.UI.fetchSemanticColor('label')
}

"#bg": {
  backgroundColor: Ti.UI.fetchSemanticColor('systemBackground')
}
```

Available semantic colors: `label`, `secondaryLabel`, `systemBackground`, `secondarySystemBackground`, `separator`, `systemFill`, etc.

:::tip When to use Semantic Colors vs Alloy.Globals
- **Semantic Colors**: Quick adaptation for iOS only. No Android support.
- **Alloy.Globals palette**: Cross-platform, full control, consistent behavior on both platforms. **Recommended.**
:::

---

## Reusable Style Classes Pattern

Define a library of reusable TSS classes in `app.tss` for consistency across the app:

```tss
/* app.tss - Design System */

/* === Layout === */
".row": { layout: 'horizontal', width: Ti.UI.FILL, height: Ti.UI.SIZE }
".col": { layout: 'vertical', width: Ti.UI.FILL, height: Ti.UI.SIZE }
".centered": { width: Ti.UI.SIZE, height: Ti.UI.SIZE }

/* === Cards === */
".card": {
  backgroundColor: Alloy.Globals.theme.card,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: Alloy.Globals.theme.border,
  width: Ti.UI.FILL,
  height: Ti.UI.SIZE
}

/* === Buttons === */
".btn-primary": {
  backgroundColor: Alloy.Globals.theme.primary,
  color: Alloy.Globals.theme.primaryText,
  height: 48,
  width: Ti.UI.FILL,
  borderRadius: 8,
  font: { fontSize: 16, fontWeight: 'bold' }
}

".btn-secondary": {
  backgroundColor: 'transparent',
  color: Alloy.Globals.theme.primary,
  height: 48,
  width: Ti.UI.FILL,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: Alloy.Globals.theme.primary,
  font: { fontSize: 16, fontWeight: 'bold' }
}

".btn-danger": {
  backgroundColor: Alloy.Globals.theme.danger,
  color: '#ffffff',
  height: 48,
  width: Ti.UI.FILL,
  borderRadius: 8,
  font: { fontSize: 16, fontWeight: 'bold' }
}

/* === Typography === */
".text-title": { font: { fontSize: 24, fontWeight: 'bold' }, color: Alloy.Globals.theme.text }
".text-subtitle": { font: { fontSize: 18, fontWeight: 'semibold' }, color: Alloy.Globals.theme.text }
".text-body": { font: { fontSize: 16 }, color: Alloy.Globals.theme.text }
".text-caption": { font: { fontSize: 14 }, color: Alloy.Globals.theme.textSecondary }
".text-small": { font: { fontSize: 12 }, color: Alloy.Globals.theme.textSecondary }

/* === Inputs === */
".input": {
  height: 48,
  width: Ti.UI.FILL,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: Alloy.Globals.theme.border,
  backgroundColor: Alloy.Globals.theme.bg,
  color: Alloy.Globals.theme.text,
  paddingLeft: 12,
  font: { fontSize: 16 }
}

/* === Spacing (applied via class in XML) === */
".mt-sm": { top: 8 }
".mt-md": { top: 16 }
".mt-lg": { top: 24 }
".mt-xl": { top: 32 }
".mx-md": { left: 16, right: 16 }
".mx-lg": { left: 24, right: 24 }
```

### Using Style Classes in Views

```xml
<Alloy>
  <Window>
    <View class="col mx-md">
      <Label class="text-title mt-lg" text="L('settings')" />

      <View class="card mt-md">
        <Label class="text-body mx-md mt-md" text="L('appearance')" />
        <Button class="btn-secondary mx-md mt-md" title="L('toggle_theme')" onClick="onToggleTheme" />
      </View>

      <Button class="btn-danger mt-xl mx-md" title="L('logout')" onClick="onLogout" />
    </View>
  </Window>
</Alloy>
```

This approach gives you:
- Consistent spacing and typography across the entire app
- Theme-aware colors that change with `Alloy.Globals.theme`
- Clean XML views without inline styles
- A single place to update design decisions (`app.tss`)
