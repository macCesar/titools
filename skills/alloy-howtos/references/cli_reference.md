# Alloy command-line interface reference

The Alloy CLI manages and builds Alloy projects.

## Installation

The Alloy CLI is installed when you install the `alloy` package.

### Manual Installation

Install Node.js from [nodejs.org](http://nodejs.org/#download) first, then:

```bash
sudo npm install -g alloy
```

For a specific version:
```bash
sudo npm install -g alloy@1.10.0
```

### Development install

```bash
git clone https://github.com/tidev/alloy.git
cd alloy
[sudo] npm install -g .
```

## Commands

### new

Creates a new Alloy project on top of an existing Titanium project (create the classic Titanium project first, then run this command from inside the project directory).

```bash
alloy new [<project_path>] [<project_template>] [--force] [--no-colors]
```

| Option               | Description                                                                       |
| -------------------- | --------------------------------------------------------------------------------- |
| `<project_path>`     | Path to skeleton Titanium project (default: current directory)                    |
| `<project_template>` | **default** (single pane) or **two_tabbed** (tabbed app)                          |
| `--testapp <path>`   | Relative path to a test application in the Alloy GitHub repo (under `test/apps/`) |
| `-f, --force`        | Force execution                                                                   |
| `-n, --no-colors`    | Disable color output                                                              |

### generate

Creates skeleton Alloy components.

```bash
alloy generate <component> [--widgetname <widget_name>] [--outputPath <output_path>] [--platform <platform>] [--force] [--no-colors]
```

| Component                         | Description                                                                                                                                                                 |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `controller <name>`               | Create controller, view and style                                                                                                                                           |
| `jmk`                             | Create `alloy.jmk`                                                                                                                                                          |
| `model <name> <adapter> [schema]` | Create model (see Model Format below)                                                                                                                                       |
| `migration <model_name>`          | Create migration file                                                                                                                                                       |
| `style <name>` or `--all`         | Create style file (or all styles). If name matches a view-controller, it populates using IDs/classes from markup. Running again updates existing files with new attributes. |
| `view <name>`                     | Create view and style                                                                                                                                                       |
| `widget <name>`                   | Create widget                                                                                                                                                               |

| Option                    | Description                                      |
| ------------------------- | ------------------------------------------------ |
| `--widgetname <name>`     | Create component for specified widget            |
| `-o, --outputPath <path>` | Output path (point to 'app' directory)           |
| `--platform <platform>`   | Create platform-specific component (android/ios) |
| `-f, --force`             | Force execution                                  |
| `-n, --no-colors`         | Disable color output                             |

#### Model format

Select adapter type:
- `sql` - SQLite database for Android/iOS (also generates a migration file)
- `properties` - Local storage in Titanium SDK context

Schema format: space-delimited list of `field:type`
- Example: `name:string age:number sex:varchar dob:date`

SQLite type mapping:

| Datatype                                 | SQLite Type |
| ---------------------------------------- | ----------- |
| string, varchar, text                    | TEXT        |
| int, tinyint, smallint, bigint, integer  | INTEGER     |
| double, float, real                      | REAL        |
| blob                                     | BLOB        |
| decimal, number, date, datetime, boolean | NUMERIC     |
| null                                     | NULL        |
| unknown                                  | TEXT        |

### install

Installs special Alloy project components.

```bash
alloy install <module> [<project_path>]
```

| Module           | Description                               |
| ---------------- | ----------------------------------------- |
| `plugin`         | Install compiler plugin for Studio        |
| `<project_path>` | Project path (default: current directory) |

### compile

Compiles Alloy code to Titanium SDK code.

```bash
alloy compile [<project_path>] [--config <compiler_options>] [--no-colors]
```

| Option                   | Description                                                               |
| ------------------------ | ------------------------------------------------------------------------- |
| `<project_path>`         | Project path (default: current directory)                                 |
| `-c, --config <options>` | Comma-delimited compiler options (e.g., `beautify=false,deploytype=test`) |
| `-n, --no-colors`        | Disable color output                                                      |

Compiler options reference the `event.alloyConfig` object in [Build Configuration File (alloy.jmk)](config_files.md).

### run

Use `titanium build` command to run Alloy projects. See [Titanium Command-Line Interface Reference](https://titaniumsdk.com/guide/Titanium_SDK/Titanium_SDK_Guide/Titanium_Command-Line_Interface_Reference/).

:::tip Common ti build pitfalls

Using `-C` flag without UDID:
```bash
# Prompts for simulator selection interactively
ti build -p ios -T simulator -C
```

Correct approach for simulator:
```bash
# Runs on default simulator
ti build -p ios -T simulator
```

Using `--no-prompt` incorrectly:
```bash
# Still may prompt for device selection if not specific
ti build -p ios --no-prompt
```

Always specify target:
```bash
# Clear target specification
ti build -p ios -T simulator --no-prompt
```

**Common patterns:**
```bash
# iOS Simulator (most common during development)
ti build -p ios -T simulator

# iOS Device (requires UDID)
ti build -p ios -T device -V <udid>

# Android Emulator
ti build -p android -T emulator

# Build only (don't run)
ti build -p ios -T simulator --build-only
```
:::

### i18n-extract

Extracts i18n keys from TSS and JS files to strings.xml.

```bash
alloy extract-i18n [<language>] [--apply]
```

| Option       | Description                                |
| ------------ | ------------------------------------------ |
| `<language>` | Two-letter language code (default: **en**) |
| `--apply`    | Write to strings.xml (preview if absent)   |

Supported functions:
- `Ti.Locale.getString()`
- `L()`

Usage examples:
```bash
# Preview changes for default (English)
alloy extract-i18n

# Write changes to "app/i18n/en/strings.xml"
alloy extract-i18n --apply

# Specify "es" as the language and write the changes to "app/i18n/es/strings.xml"
alloy extract-i18n es --apply

# Preview Spanish changes
alloy extract-i18n es
```

### copy

Copy a view-controller (controller, XML, TSS).

```bash
alloy copy <CONTROLLER_NAME> <COPIED_CONTROLLER_NAME>
```

### move

Rename a view-controller.

```bash
alloy move <CONTROLLER_NAME> <NEW_CONTROLLER_NAME>
```

### remove

Remove a view-controller.

```bash
alloy remove <CONTROLLER_NAME>
```

## Additional Options

| Option          | Description           |
| --------------- | --------------------- |
| `-h, --help`    | Output command usage  |
| `-v, --version` | Output version number |
