# Alloy Widgets

## Table of Contents

1. [Introduction](#introduction)
2. [Using Widgets](#using-widgets)
3. [Creating Widgets](#creating-widgets)
4. [Assets and Libs](#assets-and-libs)
5. [Configuration](#configuration)
6. [Controllers](#controllers)
7. [Models](#models)
8. [Styles](#styles)
9. [Themes](#themes)
10. [Views](#views)
11. [Widgets](#widgets-1)

## Introduction

Widgets are self-contained components that can be easily dropped into Alloy-powered Titanium projects. They were conceived as a way to reuse code in multiple applications or to be used multiple times in the same application. Widgets have their own views, controllers, styles and assets and are laid out the same as the `app` directory in the Alloy project.

## Using Widgets

See [Importing Widgets](./VIEWS_XML.md#importing-widgets) for more information on using widgets in your project.

## Creating Widgets

Widgets should be built in their own directory in the Alloy project's `app/widgets/` directory. Widgets have their own views, controllers, models, styles and assets and are laid out the same as the `app` directory in the Alloy project. Additionally, since widgets are self-contained, they should not reference any code or assets not within its path, except for internationalization and localization files, which are located in the `i18n` folder.

## Assets and Libs

For any files in the `assets` or `libs` folder, use the `WPATH()` macro to automatically map the path relative from the widget's root folder.

For example, if you have a library located at `app/widgets/foo/lib/helper.js`, to require it:

```javascript
require(WPATH('helper'))
```

If you have an image located at `app/widgets/foo/assets/images/foo.png`, to reference it:

```javascript
WPATH('images/foo.png')
```

## Configuration

Widgets have their own configuration file called `widget.json` located in the widget's root directory.

Example **widget.json**:

```json
{
    "id": "com.example.widget",
    "name": "My Widget",
    "description": "A sample widget",
    "author": "Your Name",
    "version": "1.0",
    "platform": [
        "android",
        "ios"
    ],
    "min_alloy": "1.0"
}
```

## Controllers

The main controller is called `widget.js` instead of `index.js`.

To use another view-controller besides `widget.js`/`widget.xml`, use the `Widget.createController(controller_name, [params])` method to create a new instance and the `getView()` method to access the Titanium proxy object.

**app/widgets/foo/controllers/widget.js**

```javascript
var button = Widget.createController('button').getView();
$.widget.add(button);
```

All methods in the widget controller are private unless you prefix the method with `$`, which makes it accessible to the Alloy project and other widgets.

**app/widgets/foo/controllers/widget.js**

```javascript
$.init = function (args) {
    $.button.title = args.title || 'Si';
    $.button.color = args.color || 'black';
    message = args.message || 'Hola mundo';
}
```

Then, in the Alloy project:

```javascript
$.foo.init({title:'Yes', color:'gray', message:'I pity the foo.'});
```

## Models

Use models the same way as with a regular Alloy project except to create a model or collection inside a widget controller, use the `Widget.createModel(model_name, [params])` and `Widget.createCollection(model_name, [params])` methods, respectively.

You can also use the `Model` and `Collection` tags in widget views.

## Styles

The main TSS file is called `widget.tss` instead of `index.tss`.

## Themes

Widget themes work the same as project themes except for the placement of the files. Inside your theme folder (`app/themes/<THEME_NAME>`), create `widgets/<WIDGET_NAME>` folders, where `<THEME_NAME>` is the name of the theme and `<WIDGET_NAME>` is the name of the widget.

Create two folders, `assets` and `styles`, to place your custom images and styles for your widget, respectively.

```
app
├── themes
│   └── mytheme
│       └── widgets
│           └── mywidget
│               ├── assets
│               │   ├── ios
│               │   │   └── star_half.png
│               │   ├── star.png
│               │   └── star_off.png
│               └── styles
│                   ├── ios
│                   │   └── star.tss
│                   └── star.tss
└── widgets
    └── mywidget
        ├── assets
        │   ├── star.png
        │   ├── star_half.png
        │   └── star_off.png
        ├── controllers
        │   ├── star.js
        │   └── widget.js
        ├── styles
        │   ├── star.tss
        │   └── widget.tss
        ├── views
        │   ├── star.xml
        │   └── widget.xml
        └── widget.json
```

To use a theme, in the project's `config.json` file, add the `theme` key with the name of the theme folder as the value.

## Views

The main view is called `widget.xml` instead of `index.xml`.

Specifying the `id` attribute in the XML markup components will make it easier to access and override Titanium object properties. For example, if you have a Button object in a widget view with id `button` and in the Alloy project the widget id is `foo`:

```javascript
Ti.API.info("button state: " + $.foo.button.enabled);
```

For widgets that have multiple view-controllers, to include a widget's view-controller in another widget's view, use the `Widget` tag and assign the `name` attribute with the name of the view-controller minus the file extension. Since Alloy 1.5.0, if you omit the `src` attribute, Alloy assumes you are referencing the current widget.

**app/widgets/foo/views/widget.xml**

```xml
<Alloy>
  <View>
    <Widget src="foo" name="button"/>
  </View>
</Alloy>
```

## Widgets

Widgets can also contain other widgets. Follow the same directions from [Importing Widgets](./VIEWS_XML.md#importing-widgets) except the widget's configuration file is called `widget.json` instead of `config.json`.

To create a widget inside a widget controller, use the `Widget.createWidget(widget_name, [controller_name], [params])` method.
