# Alloy Styles and Themes

## Table of Contents

1. [Titanium Style Sheets](#titanium-style-sheets)
2. [Global Styles](#global-styles)
3. [Platform-Specific Styles](#platform-specific-styles)
4. [Custom Query Styles](#custom-query-styles)
5. [Themes](#themes)
6. [Style Priorities](#style-priorities)

## Titanium Style Sheets

The Titanium Style Sheets (TSS) file uses a JSON-like syntax to define the attributes of elements in the XML files. All TSS attributes are the properties of the Titanium object.

Styles are defined at three different levels: markup element, class attribute and the id attribute. When mixed together, the id attribute overrides both the class attribute and markup element, and the class attribute overrides the markup element.

In the TSS file, define attributes as key-value pairs, where the key is the name of the markup element, the class name prefixed with a period (`.`), or the id name prefixed with a hash tag (`#`) and the value is a dictionary of attributes.

You can use the following values and operators in your TSS file:

* JSON values: Strings, Numbers, Objects, Array, Booleans and null
* `undefined` to unset a property (since Alloy 1.4.0)
* Titanium SDK constants: `Ti.UI.SIZE`
* Localization functions: `Ti.Locale.getString()` and `L()`
* Variables from `Alloy.CFG` or `Alloy.Globals`
* Bitwise operators: `>>`, `<<`, `>>>`, `&`, `|`, `^` (since Alloy 1.3.0)
* Single (`//comment`) and multiline comments (`/* comment */`)

::: warning ⚠️ Warning
Alloy does not support the CSS concept of child or descendent selectors.
:::

**app/styles/index.tss**

```javascript
// Applied to any element with class "container"
".container": {
  backgroundColor:"white"
},
// Applied to all Labels
"Label": {
    width: Ti.UI.SIZE,
    height: Ti.UI.SIZE,
    color: "#000",
    transform: Alloy.Globals.rotateLeft
},
// Applied only to element with id="label"
"#label": {
    color: "#999"
}
```

**app/views/index.xml**

```xml
<Alloy>
    <Window class="container">
        <Label id="label" onClick="doClick">Hello, World</Label>
    </Window>
</Alloy>
```

## Global Styles

You can create a global style file, called `app.tss`, which applies all styles defined inside it to all views, but does not override the non-global styles or property attributes in the markup.

**styles/app.tss**

```javascript
"Window":{
    backgroundColor: 'white',
    layout: 'vertical'
}
"Label":{
    color: 'gray',
    textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
    backgroundColor: 'transparent',
    font: {
        fontFamily:'Helvetica',
        fontSize: '12dp',
        fontStyle: 'normal',
        fontWeight: 'normal'
    }
}
```

**styles/index.tss**

```javascript
"Window":{
    backgroundColor: 'blue'
}
"Label":{
    top: 20,
    left: '25dp',
    right: '25dp'
}
"#subtitle":{
    width: Ti.UI.FILL,
    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
    font: {
        fontSize: '16dp',
        fontWeight: 'bold'
    }
}
```

**views/index.xml**

```xml
<Alloy>
    <Window titleid="story_title" modal="true" exitOnClose="true">
        <Label id="subtitle" color="orange" textid="story_subtitle" />
        <Label top="25" color="white" textid="story_content" />
    </Window>
</Alloy>
```

Style priority (lowest to highest): Global Style File → Global Style File in Theme → Platform-Specific Global → View-Controller Style File → View-Controller Style in Theme → Platform-Specific View-Controller → XML Markup → Platform-Specific XML Markup.

## Platform-Specific Styles

As with views, separate styles may be defined based on the platform and device size.

**To specify platform or device size conditionals:**

1. Place a set of square brackets (`[]`) directly after the name of the markup element, class name or id name in the TSS file.
2. Inside the brackets:
   * `platform` attribute: assign a platform (`android`, `ios`). Comma separate to OR values. Prepend with `!` to negate.
   * `formFactor` attribute: assign a device size (`handheld` or `tablet`).

```
// Default label
"Label": {
    backgroundColor: "#000",
    text: 'Another platform'
},
// iPhone
"Label[platform=ios formFactor=handheld]": {
    backgroundColor: "#f00",
    text: 'iPhone'
},
// iPad
"Label[platform=ios formFactor=tablet]": {
    backgroundColor: "#0f0",
    text: 'iPad'
},
// Android
"Label[platform=android]": {
    backgroundColor: "#00f",
    text: 'Android'
}
```

Alternatively, create subfolders named as the platform in the `styles` directory.

## Custom Query Styles

You can create custom queries to select which styles to apply in both the TSS and XML files.

**To use a custom query:**

1. Define a conditional statement that returns a boolean value, and assign it to a property in `Alloy.Globals` or a local function.
2. Assign the `if` attribute to an element in the XML or TSS file.

### Example Using Conditional Statements

**app/alloy.js**

```javascript
Alloy.Globals.isIos7Plus = (OS_IOS && parseInt(Ti.Platform.version.split(".")[0]) >= 7);
Alloy.Globals.iPhoneTall = (OS_IOS && Ti.Platform.osname == "iphone" && Ti.Platform.displayCaps.platformHeight == 568);
```

**app/styles/index.tss**

```javascript
// Default Styles
"#content": {
    color: 'gray',
    top: '25dp',
    left: '10dp',
    font: {
        fontSize: '12dp'
    }
},
// Query styles
"#content[if=Alloy.Globals.isIos7Plus]": {
    font: { textStyle : Ti.UI.TEXT_STYLE_CAPTION1 }
},
"ScrollView[if=Alloy.Globals.iPhoneTall]": {
    height: '500dp'
}
```

## Themes

Themes provide a way to overwrite or modify files for a specific brand of your app.

To create a theme, create a folder called `themes` in your Alloy `app` directory. In the `themes` folder, create a folder for your theme.

| Folder or Filename | Merges or Overwrites |
| --- | --- |
| config.json | merges |
| i18n | merges folders and files |
| assets | merges folders, overwrites files |
| lib | merges folders, overwrites files |
| platform | merges folders, overwrites files |
| styles | merges folders and files |
| widgets/\*/assets | merges folders, overwrites files |
| widgets/\*/styles | merges folders and files |

To use a theme, add it to your `config.json`:

```
{
    "global": {
        "theme":"mytheme"
    },
    "os:ios": {
        "theme":"green"
    },
    "os:android": {
        "theme":"blue"
    },
    "dependencies": {}
}
```

## Style Priorities

When mixing themes, the global style file, view style files and defining styles inline in the XML markup, Alloy applies the styles in the following order from lowest to highest priority:

| Style Defined in... | Example |
| --- | --- |
| Global Style File | `styles/app.tss` |
| Global Style File in a Theme | `themes/<theme_name>/styles/app.tss` |
| Global Style File with Platform-Specific Styles | `styles/<platform>/app.tss` |
| Global Style File in a Theme with Platform-Specific Styles | `themes/<theme_name>/styles/<platform>/app.tss` |
| View-Controller Style File | `styles/<view_controller>.tss` |
| View-Controller Style File in a Theme | `themes/<theme_name>/styles/<view_controller>.tss` |
| View-Controller Style File with Platform-Specific Styles | `styles/<platform>/<view_controller>.tss` |
| View-Controller Style File in a Theme with Platform-Specific Styles | `themes/<theme_name>/styles/<platform>/<view_controller>.tss` |
| XML Markup | `views/<view_controller>.xml` |
| XML Markup with Platform-Specific Styles | `views/<platform>/<view_controller>.xml` |
