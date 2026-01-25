# Alloy Tasks with the CLI

## Table of Contents

1. [Creating a New Application](#creating-a-new-application)
2. [Creating a New Application Using a Test Application](#creating-a-new-application-using-a-test-application)
3. [Generating Components](#generating-components)
4. [Extracting Localization Strings](#extracting-localization-strings)
5. [Compiling a Specific View-Controller](#compiling-a-specific-view-controller)
6. [Building an Application](#building-an-application)
7. [Installing Special Project Components](#installing-special-project-components)

## Creating a New Application

To create an Alloy application, run the following command from your workspace directory:

```bash
ti create
```

You will be prompted to enter an application name and application ID.

```bash
cd PROJECTDIRECTORY
alloy new
```

A new skeleton Alloy project will be generated. A new Alloy project has a folder named `app` that contains the skeleton Alloy application.

## Creating a New Application Using a Test Application

You can generate a new Alloy project using a test application from the Alloy Github repo.

```bash
ti create -t app --classic -i com.appc.picker -n AlloyPicker
cd AlloyPicker
alloy new --testapp ui/picker
```

## Generating Components

The CLI can generate skeleton controllers (with views and styles), models, database migrations and widgets.

### Generating a Controller

To generate a controller with a style and view:

```bash
alloy generate controller <name> [--widgetname <widget_name>] [-o path_to_project/app] [--platform <platform>]
```

This creates `app/controllers/<name>.js`, `app/styles/<name>.tss`, and `app/views/<name>.xml`.

### Generating a View

To generate a view and style **without** a controller:

```bash
alloy generate view <name> [--widgetname <widget_name>] [-o path_to_project/app] [--platform <platform>]
```

This creates `app/styles/<name>.tss` and `app/views/<name>.xml`.

### Generating a Style

To generate a style for a view-controller:

```bash
alloy generate style <name> [--widgetname <widget_name>]
```

Alloy uses the id and attribute names in the markup file to populate the skeleton style file. This creates `app/styles/<name>.tss`.

To generate style files for all view-controllers:

```bash
alloy generate style --all
```

### Generating a Model

To generate a model:

```bash
alloy generate model <name> <adapter> [<col_name_1>:<col_type_1> <col_name_2>:<col_type_2> ...] [-o path_to_project/app]
```

The fourth parameter selects the adapter type: `sql` for SQLite or `properties` for local storage.

This creates `app/models/<name>.js`, and `app/migrations/DATETIME_<name>.js` if the adapter type is 'sql'.

### Generating a Migration

To generate a standalone migration for a specific model:

```bash
alloy generate migration <name> [-o path_to_project/app]
```

This creates `app/migrations/DATETIME_<name>.js`.

### Generating a Widget

To generate a basic widget:

```bash
alloy generate widget <name> [-o path_to_project/app]
```

This creates `app/widgets/<name>/widget.json`, `app/widgets/<name>/controllers/widget.js`, `app/widgets/<name>/styles/widget.tss`, and `app/widgets/<name>/views/widget.xml`. The widget is automatically added to `config.json`.

### Generating alloy.jmk

To generate the build customization file:

```bash
alloy generate jmk [-o path_to_project/app]
```

This creates `app/alloy.jmk` with a few task hooks in place.

## Extracting Localization Strings

The `alloy extract-i18n` command inspects your JS and TSS files for instances of Titanium's localization functions and adds those strings to an i18n strings.xml file.

```bash
alloy extract-i18n [language] [--apply]
```

**Parameters**:

* `language` – Optional. Two-letter language code (`en` or `es`). Default is `en`.
* `--apply` – Optional. Writes new entries to `strings.xml`. Without it, displays a preview.

Supported functions:

* `Titanium.Locale.getString()`
* `L()`

**Example**:

```javascript
var name = Ti.Locale.getString('name');
var color = Titanium.Locale.getString('color');
var currency = L('currency');
```

```bash
alloy extract-i18n --apply
```

Generates `app/i18n/en/strings.xml`:

```xml
<resources>
  <string name="name">name</string>
  <string name="color">color</string>
  <string name="currency">currency</string>
</resources>
```

## Compiling a Specific View-Controller

To select which Alloy view-controller to compile to Titanium code:

```bash
alloy compile --config platform=<platform>,file=<file>

## Example
alloy compile --config platform=android,file=app/controller/index.js
```

## Building an Application

To build and run an application:

```bash
ti build --platform <platform> [--project-dir <value>] [--sdk <value>] [<platform_build_options>]
```

Running this from the root directory of the project compiles the files to the correct location automatically.

## Installing Special Project Components

### Installing the Compiler Plugin

To install the compiler plugin that hooks the Alloy project to Studio:

```bash
alloy install plugin [path_to_project]
```

Use this command to update the compiler plugin if your project was created using an older version of Alloy.
