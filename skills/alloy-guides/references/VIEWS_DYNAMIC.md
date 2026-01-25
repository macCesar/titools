# Dynamic Styles

## Table of Contents

1. [Introduction](#introduction)
2. [Define Class Styles](#define-class-styles)
3. [Generate a Dynamic Style](#generate-a-dynamic-style)
4. [Modify TSS Classes](#modify-tss-classes)
5. [Autostyle](#autostyle)

## Introduction

Since Alloy 1.2.0, Alloy supports changing styles dynamically or during runtime. There are two methods to support dynamic styling in Alloy. You can either generate a dynamic style dictionary that can be passed to `applyProperties` or a create method, or modify TSS class styles to an existing component on the fly.

## Define Class Styles

Before using either method, you need to create class styles in the TSS files, either in the global style file or in the individual TSS files.

**app/styles/app.tss**

```javascript
".bluetext" : {
  color: 'blue'
},
".orangetext" : {
  color: 'orange'
},
".shadow" : {
  shadowColor: '#88f',
  shadowOffset: {x:1,y:3}
},
".hdpi" : {
  font: {fontSize: '24dp', fontWeight: 'bold' }
},
".xhdpi" : {
  font: {fontSize: '24dp', fontWeight: 'bold' }
},
"Label" : {
  font: {fontSize: '14dp', fontWeight: 'normal' },
  shadow : {},
  color : 'black'
},
".rude_button" : {
  title: 'Go Away'
},
".nice_button" : {
  title: 'Please Close'
},
"Button" : {
    width: Ti.UI.SIZE,
    height: Ti.UI.SIZE
}
".tiny_win" : {
  height: '150dp',
  width: '200dp',
  backgroundColor: 'blue'
},
".big_win" : {
  height: '300dp',
  width: '400dp',
  backgroundColor: 'red'
}
```

## Generate a Dynamic Style

To generate a dynamic style, use the controller's `createStyle` method by passing it a dictionary with TSS classes. This method returns a dictionary that can be passed to the view object's `applyProperties` method or a create view object method.

You can use the controller's `UI.create` method to create a view component that is dynamically styled.

**app/views/dialog.xml**

```xml
<Alloy>
    <Window id="win">
        <Button id="button" onClick="doClick" />
    </Window>
</Alloy>
```

**app/controllers/dialog.js**

```javascript
function doClick(e) {
    $.win.close();
}

args = arguments[0] || {};
if (args.button) {
    var style = $.createStyle({
        classes: args.button,
        apiName: 'Button',
        color: 'blue'
    });
    $.button.applyProperties(style);
}
if (args.win) {
    var style = $.createStyle({
        classes: args.win,
        apiName: 'Window',
        backgroundColor: 'white'
    });
    $.win.applyProperties(style);
}
if (args.label) {
    args.label.top = 10
    var label = $.UI.create("Label", args.label);
    $.win.add(label);
}
```

**app/controllers/index.js**

```javascript
var args = {};
args.button = ['rude_button'];
args.win = ['tiny_win'];
args.label = {
    classes: ['hdpi', 'shadow'],
    text: 'No zombies allowed!'
};
Alloy.createController('dialog', args).getView().open();
```

## Modify TSS Classes

To modify the TSS classes of an object that has already been created, use the controller's `addClass`, `removeClass` and `resetClass` methods, which adds, removes or resets the TSS classes of a view object, respectively.

Pass a reference to the view object as the first parameter, then pass the classes to add or remove as an array or space-separated string as the second parameter. You can optionally specify inline properties as an optional third parameter.

**app/controllers/index.js**

```javascript
var dialog = Alloy.createController('dialog');
dialog.addClass(dialog.win, 'tiny_win', {backgroundColor:'white'});
dialog.addClass(dialog.button, 'rude_button', {color: 'blue'});
var style = {
    top: 10,
    text: 'No zombies allowed!',
    classes: 'hdpi shadow'
}
var label = dialog.UI.create('Label', style);
dialog.getView().open();
```

Later on, you can change the classes:

```
dialog.resetClass(dialog.button, 'nice_button orangetext hdpi');
```

## Autostyle

A view component with autostyle enabled has its TSS classes stored with the view object. Autostyle is necessary to take full advantage of the `addClass()`, `removeClass()` and `resetClass()` classes to properly update the view as classes are removed and added. There is a small performance overhead for using this feature and should only be enabled on components that use this feature. By default, autostyle is disabled.

To enable autostyle, set the `autoStyle` attribute to `true` either in the XML markup or the `config.json` file.

* To enable autostyle for an individual component, set the `autoStyle` attribute to true on the XML tag: `<View autoStyle="true">`.
* To enable autostyle for components in a controller, set the `autoStyle` attribute to true on the root `<Alloy/>` tag: `<Alloy autoStyle="true">`.
* To enable autostyle for all controllers in an Alloy project, set the `autoStyle` field to true in the `config.json` file.

**app/config.json**

```json
{
    "autoStyle": true
}
```

### Why Autostyle is Needed

Consider the following example without autostyle:

**app/styles/index.tss**

```javascript
".coloronly" : {
    color: 'red'
},
".colorsize" : {
    color: 'blue',
    font: {fontSize: '24dp'}
},
"Label" : {
    color: 'black',
    font: {fontSize: '12dp'}
}
```

**app/controllers/index.js**

```javascript
$.addClass($.label, "coloronly colorsize"); // --> appears blue and 24dp
$.removeClass($.label, "colorsize"); // --> appears red and 24dp (font size not updated!)
$.removeClass($.label, "coloronly"); // --> appears red and 24dp (not black!)
```

With autostyle enabled, the styles update as expected when classes are added or removed.
