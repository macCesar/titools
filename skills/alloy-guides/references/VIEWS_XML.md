# Alloy XML Markup

## Table of Contents

1. [Introduction](#introduction)
2. [Collection Element](#collection-element)
3. [Model Element](#model-element)
4. [Module Attribute](#module-attribute)
5. [Module Element](#module-element-1)
6. [Require Element](#require-element)
7. [Namespace](#namespace)
8. [Conditional Code](#conditional-code)
9. [Property Mapping](#property-mapping)
10. [Event Handling](#event-handling)
11. [Data Binding](#data-binding)
12. [Non-Standard Syntax](#non-standard-syntax)

## Introduction

In Alloy, the XML markup abstracts the Titanium SDK UI components, so you do not need to code the creation and setup of these components using JavaScript and the Titanium SDK API. All view files must be placed in the `app/views` folder of your project with the `.xml` file extension.

The following code is an example of a view file:

**app/views/index.xml**

```xml
<Alloy>
    <Window class="container">
        <Label id="label" onClick="doClick">Hello, World</Label>
    </Window>
</Alloy>
```

The `Alloy` tag is the root element for the XML markup and is required in all views. The Window element defines an instance of the `Ti.UI.Window` object and within that window instance is the `Label` element which defines an instance of a `Ti.UI.Label` object. Almost all of the Alloy XML tags are the class names of the Titanium UI components without the preceding namespace.

Within a controller, a UI component can be referenced if its ID attribute is defined. For instance, the Label component in the above example has its ID defined as `label` and can be referenced in the controller using `$.label`.

If the top-level UI component does not have an ID defined, it can be referenced using the name of the view-controller prefixed with a dollar sign and period (`$.`). For instance, the Window element in the above example can be referenced in the controller using `$.index`.

The following table lists the attributes for the UI components:

| Attribute | Description |
| --- | --- |
| `id` | Identifies UI elements in the controller (prefixed with `$.`) and style sheet (prefixed with `#`). |
| `class` | Applies additional styles (prefixed with `.` in the TSS file). |
| `autoStyle` | Enables the autostyle feature for dynamic styling. |
| `formFactor` | Acts as a compiler directive for size-specific view components (`handheld` or `tablet`). |
| `if` | Use a custom query to apply additional styles to the element. |
| `module` | Requires in a CommonJS module. |
| `ns` | Overrides the default `Titanium.UI` namespace. |
| `platform` | Switches the namespace based on the platform. |
| `<properties>` | Assigns values to UI object properties. |
| `<events>` | Assigns callbacks to UI object events. |

The following table lists the special XML elements besides the Titanium UI components:

| Element | Description |
| --- | --- |
| `Alloy` | Root element for all view XML files. Required in all views. |
| `Collection` | Creates a singleton or instance of a collection. |
| `Model` | Creates a singleton or instance of a model. |
| `Module` | Imports a module view inside this view. |
| `Require` | Imports a widget or includes another view inside this view. |
| `Widget` | Imports a widget inside this view. |

`index.xml` is a special case that only accepts the following view components as direct children of the Alloy tag:

* `Ti.UI.Window` or `<Window>`
* `Ti.UI.TabGroup` or `<TabGroup>`
* `Ti.UI.NavigationWindow` or `<NavigationWindow>`
* `Ti.UI.iOS.SplitWindow` or `<SplitWindow>`

## Collection Element

The `Collection` XML element creates a singleton or instance of a collection. The `Collection` tag needs to be a child of the `Alloy` parent tag.

### Creating a Singleton

```xml
<Alloy>
    <Collection src="book" />
    <Window>
        <TableView id="table" />
    </Window>
</Alloy>
```

```javascript
var library = Alloy.Collections.book;
library.fetch();
```

### Creating an Instance

```xml
<Alloy>
    <Collection id="localLibrary" src="book" instance="true"/>
    <Window>
        <TableView id="table" />
    </Window>
</Alloy>
```

```javascript
var library = $.localLibrary;
library.fetch();
```

## Model Element

The `Model` XML element creates a singleton or instance of a model. The `Model` tag needs to be a child of the `Alloy` parent tag.

### Creating a Singleton

```xml
<Alloy>
    <Model src="book" />
    <Window>
        <TableView id="table" />
    </Window>
</Alloy>
```

```javascript
var drama = Alloy.Models.book;
drama.set('title', 'Hamlet');
drama.set('author', 'William Shakespeare');
```

### Creating an Instance

```xml
<Alloy>
    <Model id="myBook" src="book" instance="true"/>
    <Window>
        <TableView id="table" />
    </Window>
</Alloy>
```

```javascript
var drama = $.myBook;
drama.set('title', 'Hamlet');
drama.set('author', 'William Shakespeare');
```

## Module Attribute

You can require a CommonJS module in an Alloy view using the `module` attribute of an XML element.

**app/lib/foo.js**

```javascript
exports.createFoo = function (args) {
    var viewArgs = {
        backgroundColor: args.color || 'white',
        width: 100,
        height: 100
    };
    var view = Ti.UI.createView(viewArgs);
    var labelArgs = {
        color: args.textColor || 'black',
        text: args.text || 'Foobar'
    };
    var label = Ti.UI.createLabel(labelArgs);
    view.add(label);
    return view;
};
```

**app/views/index.xml**

```xml
<Alloy>
    <Window backgroundColor="white">
        <Foo module="foo" color="blue" textColor="orange" text="Hello, World!"/>
    </Window>
</Alloy>
```

## Module Element

You can also include a view from a native module using the `Module` XML element.

**app/views/index.xml**

```xml
<Alloy>
  <Window>
    <Module id="paint" module="ti.paint" method="createPaintView" eraseMode="false" strokeWidth="1.0" strokeColor="red" strokeAlpha="100" />
    <Button onClick="eraseMe" bottom="0">Erase</Button>
  </Window>
</Alloy>
```

**app/controllers/index.js**

```javascript
function eraseMe() {
  $.paint.clear();
}

$.index.open();
```

## Require Element

The `Require` XML element has two uses: including external views and importing widgets into the current view.

### Including Views

Views may be included in other views using the `Require` element. Specify the `type` attribute as `view` and the `src` attribute should be the view file minus the `.xml` extension.

**app/views/index.xml**

```xml
<Alloy>
    <TabGroup>
        <Tab id="leftTab">
            <Require type="view" src="rss" id="rssTab"/>
        </Tab>
        <Tab id="rightTab">
            <Require type="view" src="about" id="aboutTab"/>
        </Tab>
    </TabGroup>
</Alloy>
```

To use UI objects from the included views:

```javascript
var aboutView = $.aboutTab.getView('aboutView');
aboutView.url = 'http://www.google.com';
```

### Importing Widgets

Within a view in the regular Alloy project space (`app/views`), use the `<Widget>` tag to import the widget into the application.

**To import a widget:**

1. Copy the widget to the `app/widgets` folder.
2. Add the `<Widget>` tag in the XML and specify its `src` attribute as the folder name of the widget.
3. Update the `dependencies` object in the `config.json` file.

**app/views/index.xml**

```xml
<Alloy>
    <Window>
        <Widget src="mywidget" id="foo" name="foo" />
    </Window>
</Alloy>
```

**app/controllers/index.js**

```javascript
$.index.open();
$.foo.myMethod();
```

### Passing Arguments

You can add any custom attributes to the markup to initialize a widget or controller.

**apps/views/index.xml**

```xml
<Require id="foobar" src="foo" customTitle="Hello" customImage="hello.png"/>
```

This is equivalent to:

**apps/controllers/index.js**

```javascript
var foobar = Alloy.createController('foo', {
    id: 'foobar',
    customTitle: 'Hello',
    customImage: 'images/hello.png'
});
```

In the required view's controller:

**apps/controllers/foo.js**

```javascript
var title = $.args.customTitle || 'Foobar';
var image = $.args.customImage || 'default.png';
```

### Binding Events

To bind a callback to an event in a required view using the `on` attribute:

Parent View:

```xml
<Require id="fooButton" src="button" onClick="doClick" />
```

Button View:

```xml
<Alloy>
    <Button id="button">Click Me!</Button>
</Alloy>
```

In the controller of the required view:

```
$.button.addEventListener('click', function(e) {
    $.trigger('click', e);
});
```

### Adding Children Views

If your Require element is a parent view, you can add children elements to it. These children elements are passed to the parent controller as an array called `$.args.children`.

**app/views/info.xml**

```xml
<Alloy>
    <View backgroundColor="yellow" borderWidth="0.5" borderColor="brown"/>
</Alloy>
```

**controllers/info.js**

```javascript
_.each($.args.children || [], function(child) {
    $.info.add(child);
});

$.info.height = Ti.UI.SIZE;
```

**app/views/index.xml**

```xml
<Alloy>
    <Window class="container">
        <Require src="info">
            <Label>I am an info box.</Label>
        </Require>
    </Window>
</Alloy>
```

## Namespace

By default, all UI components specified in the views are prefixed with `Titanium.UI` for convenience. However, to use a component not part of the `Titanium.UI` namespace, use the `ns` attribute.

```xml
<BlurView ns="Ti.UI.iOS" id="blurView"/>
```

For UI objects that belong to a specific platform, use the `platform` attribute:

```xml
<SplitWindow platform="ios"/>
```

Many of the Titanium view proxies not part of the `Titanium.UI` namespace do not require that the `ns` attribute be explicitly set. The following elements are implicitly mapped to a namespace:

| Element | Namespace |
| --- | --- |
| Menu | Ti.Android |
| MenuItem | Ti.Android |
| Annotation | Ti.Map |
| VideoPlayer | Ti.Media |
| MusicPlayer | Ti.Media |
| SearchView | Ti.UI.Android |
| AdView | Ti.UI.iOS |
| CoverFlowView | Ti.UI.iOS |
| NavigationWindow | Ti.UI |
| TabbedBar | Ti.UI.iOS |
| DocumentViewer | Ti.UI.iOS |
| Popover | Ti.UI.iPad |
| SplitWindow | Ti.UI.iOS |
| StatusBar | Ti.UI.iOS |

## Conditional Code

Add the `platform`, `formFactor` and `if` attributes to apply XML elements based on conditionals.

* `platform`: Assign it a platform, such as, `android` or `ios`. Comma separate values to OR them. Prepend with `!` to negate.
* `formFactor`: Assign it a device size–either `handheld` or `tablet`.
* `if`: Assign it to a conditional statement in the `Alloy.Globals` namespace or `$.args` namespace.

```xml
<Alloy>
    <Window>
        <Module id="mapview" module="ti.map" method="createView">
            <Annotation title="Cupertino" platform='ios' formFactor='tablet' latitude='37.3231' longitude='-122.0311'/>
            <Annotation title="Redwood City" platform='ios' formFactor='handheld' latitude='37.4853' longitude='-122.2353'/>
            <Annotation title="Mountain View" platform='android' latitude='37.3861' longitude='-122.0828'/>
            <Annotation title="Palo Alto" platform='android,ios,mobileweb' latitude='37.4419' longitude='-122.1419'/>
            <Annotation title="San Francisco" platform='mobileweb' latitude='37.7750' longitude='-122.4183'/>
        </Module>
    </Window>
</Alloy>
```

## Property Mapping

Each Titanium UI object property is defined as an attribute in the XML and TSS file if it accepts a string, boolean, number or Titanium SDK constant.

```xml
<Label borderWidth="1" borderColor="red" color="red" width="Ti.UI.FILL">Hello, World!</Label>
```

### Proxy Properties

For properties that are assigned Titanium proxies, create a child tag under the Titanium UI object tag, using the name of the property with the first character capitalized.

```xml
<Alloy>
    <Window>
        <RightNavButton>
            <Button title="Back" onClick="closeWindow" />
        </RightNavButton>
    </Window>
</Alloy>
```

### Android ActionBar

You can set ActionBar properties in the `ActionBar` element.

**app/views/index.xml**

```xml
<Alloy>
    <Window title="My App">
        <ActionBar id="actionbar" platform="android" title="Home Screen" onHomeIconItemSelected="showInfo" />
        <Menu>
            <MenuItem id="editItem" title="Edit" onClick="editInfo" />
            <MenuItem id="viewItem" title="View" onClick="viewInfo" />
        </Menu>
        <Label id="label">Use the ActionBar to Perform an Action.</Label>
    </Window>
</Alloy>
```

### iOS Navigation Button Shorthand

When specifying either the `LeftNavButton` or `RightNavButton` element, you can define the `Button` attributes directly.

**app/views/index.xml**

```xml
<Alloy>
    <NavigationWindow>
        <Window>
            <LeftNavButton title="Back" onClick="goBack" />
            <Label>I am iOS!</Label>
        </Window>
    </NavigationWindow>
</Alloy>
```

### iOS SystemButton Shorthand

When specifying the `systemButton` attribute, you do not need to use the `Ti.UI.iOS.SystemButton` namespace.

```xml
<Button systemButton="CAMERA"/>
<!-- Instead of -->
<Button systemButton="Titanium.UI.iOS.SystemButton.CAMERA"/>
```

### TextField Keyboard Shorthands

When specifying the `keyboardType` or `returnKeyType` for a TextField:

```xml
<TextField id="txt" keyboardType="DECIMAL_PAD" returnKeyType="DONE"/>

"#txt": {
  keyboardType: "DECIMAL_PAD",
  returnKeyType: "DONE"
}
```

## Event Handling

In Alloy, events may be added in the views using a special attribute. Capitalize the first character of the event name and prefix it with `on`, so the `Ti.UI.Button` object events `click`, `dblclick` and `swipe` events will become the attributes: `onClick`, `onDblclick`, and `onSwipe`, respectively.

```xml
<Alloy>
    <Window>
        <Button id="confirmButton" onClick="confirmCB">OK</Button>
    </Window>
</Alloy>
```

## Data Binding

If you have a collection of model data that needs to be automatically updated to a view as it changes, you need to use data binding techniques. See [Alloy Data Binding](./MODELS.md#alloy-data-binding) for more details.

## Non-Standard Syntax

Some Titanium view elements use special syntax. Refer to the **Alloy XML Markup** examples in the Titanium API Guides site for the following view objects:

* [AlertDialog](https://docs.appcelerator.com/platform/latest/#!/api/Titanium.UI.AlertDialog)
* [ButtonBar](https://docs.appcelerator.com/platform/latest/#!/api/Titanium.UI.ButtonBar)
* [CoverFlowView](https://docs.appcelerator.com/platform/latest/#!/api/Titanium.UI.iOS.CoverFlowView)
* [DashboardView](https://docs.appcelerator.com/platform/latest/#!/api/Titanium.UI.iOS.DashboardView)
* [ListView](https://docs.appcelerator.com/platform/latest/#!/api/Titanium.UI.ListView)
* [Map](https://docs.appcelerator.com/platform/latest/#!/api/Modules.Map)
* [Menu](https://docs.appcelerator.com/platform/latest/#!/api/Titanium.Android.Menu)
* [OptionBar](https://docs.appcelerator.com/platform/latest/#!/api/Titanium.UI.OptionBar)
* [OptionDialog](https://docs.appcelerator.com/platform/latest/#!/api/Titanium.UI.OptionDialog)
* [Picker](https://docs.appcelerator.com/platform/latest/#!/api/Titanium.UI.Picker)
* [SplitWindow](https://docs.appcelerator.com/platform/latest/#!/api/Titanium.UI.iOS.SplitWindow)
* [TabbedBar](https://docs.appcelerator.com/platform/latest/#!/api/Titanium.UI.iOS.TabbedBar)
* [Toolbar](https://docs.appcelerator.com/platform/latest/#!/api/Titanium.UI.Toolbar)
