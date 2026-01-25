# Alloy CLI Reference

The `alloy` command is the primary interface for managing Alloy metadata and automation.

## 1. Internationalization (i18n) Extraction

Instead of manually managing `strings.xml`, use the `extract-i18n` command to automatically scan your XML, JS, and TSS files for `L()` or `Ti.Locale.getString()` calls.

### Syntax
```bash
# Preview the strings found in the project
alloy extract-i18n [language]

# Create or update the strings.xml file
alloy extract-i18n [language] --apply
```

### Key Benefits
- **Accuracy**: Ensures all strings used in code are present in the translation files
- **Safety**: The `--apply` flag only adds new entries and never deletes or overwrites existing ones
- **Efficiency**: Faster than manual entry and prevents human error

## 2. Code Generation

Generate components from templates to speed up development:

```bash
# Create a new controller
alloy generate controller <name>

# Generate other component types
alloy generate view <name>
alloy generate model <name>
alloy generate widget <name>
alloy generate migration <name>
```

## 3. Installation Commands

Install specialized components or themes:

```bash
# Install a widget or theme
alloy install widget <path>
alloy install theme <path>
```

## 4. Project Conversion

Convert a Classic Titanium project to Alloy:

```bash
alloy new
```

## 5. Configuration Files

### `config.json`
Global app configuration file. Can store:
- Theme settings (`theme: "theme_name"`)
- Environment variables
- Per-platform themes
- App-specific metadata

### `alloy.js`
Global initializer executed before any controllers. Perfect for:
- Creating `Alloy.Collections`
- Setting up `Alloy.Globals`
- Initializing singletons
- Configuring global event listeners

### `alloy.jmk`
Build configuration file for pre-compile and post-compile hooks:
```javascript
task('pre:compile', function(event, logger) {
  // Run before compilation
  // Example: Auto-run PurgeTSS
});
```

Common use cases:
- Auto-running PurgeTSS
- Custom asset processing
- Environment-specific configurations
