# Alloy Samples

## Table of Contents

- [Alloy Samples](#alloy-samples)
  - [Table of Contents](#table-of-contents)
  - [Kitchen Sink](#kitchen-sink)
  - [Controller Sample](#controller-sample)
  - [Conditional Statements in Views](#conditional-statements-in-views)
    - [The Problem with Traditional Approaches](#the-problem-with-traditional-approaches)
    - [The Solution: IF Attributes in XML](#the-solution-if-attributes-in-xml)
    - [Conditional Queries in TSS](#conditional-queries-in-tss)
    - [Data-Binding with Conditional Queries](#data-binding-with-conditional-queries)

---

## Kitchen Sink

See the [KitchenSink-v2 application on GitHub](https://github.com/tidev/kitchensink-v2) for Alloy samples in a real app.

## Controller Sample

**index.js**
```javascript
// These "builtin" requires are detected by alloy compile process
// Automatically included as Resources/alloy/animation.js and Resources/alloy/string.js
const animation = require('alloy/animation');
const string = require('alloy/string');

function shake(e) {
    animation.shake($.mover, 0, () => {
        alert("Shake ended.");
    });
}

function flash(e) {
    animation.flash($.mover);
}

function trim(e) {
    $.label.text = string.trim($.label.text);
}

if (OS_IOS) {
    function flip(e) {
        let front, back;
        e.bubbleParent = false;
        if (e.source === $.back) {
            front = $.back;
            back = $.front;
        } else {
            front = $.front;
            back = $.back;
        }
        animation.flipHorizontal(front, back, 500, (e) => {
            Ti.API.info('flipped');
        });
    }
}

$.index.open();

// Runtime unit tests
if (!ENV_PROD) {
    require('specs/index')($);
}
```

## Conditional Statements in Views

Alloy separates business logic (controllers) from UI definition (XML/TSS). A common challenge is showing/hiding content based on app state (e.g., login status).

### The Problem with Traditional Approaches

**Approach 1: show/hide (in controller)**
```javascript
if (Alloy.Globals.isLoggedIn()) {
    $.loggedIn.show();
    $.notLoggedIn.hide();
} else {
    $.loggedIn.hide();
    $.notLoggedIn.show();
}
```
**Problem:** Both views render initially when the window opens. If the user isn't logged in, there's a big white space where the logged-in view was originally placed before it was hidden.

**Approach 2: setHeight (in controller)**
```javascript
if (Alloy.Globals.isLoggedIn()) {
    $.loggedIn.setHeight(Ti.UI.SIZE);
    $.notLoggedIn.setHeight(0);
} else {
    $.loggedIn.setHeight(0);
    $.notLoggedIn.setHeight(Ti.UI.SIZE);
}
```
**Problem:** This works but is messy and forces you to manage specific height values (`Ti.UI.SIZE`) in JavaScript logic, which should ideally stay in TSS.

### The Solution: IF Attributes in XML

Use `if` attributes directly within the XML View. These conditions are evaluated **before** rendering, providing a smoother experience.

**index.xml**
```xml
<Alloy>
    <Window>
        <View>
            <!-- Only one of these will ever be rendered -->
            <View if="Alloy.Globals.isLoggedIn()" id="notLoggedIn" class="vertical">
                 <Label text="Not logged in" />
            </View>
            <View if="!Alloy.Globals.isLoggedIn()" id="loggedIn" class="vertical">
                <Label text="Logged in" />
            </View>
        </View>
    </Window>
</Alloy>
```

**Benefits:**
- **No White Space:** Only the view that matches the condition is rendered to the UI.
- **Pre-rendering Evaluation:** The UI is correct from the first frame.
- **Cleaner Code:** No need for visibility logic in your controllers.

### Conditional Queries in TSS

Use IF attributes in TSS definitions:

```tss
"#info[if=Alloy.Globals.isIos7Plus]": {
    font: {
        textStyle: Ti.UI.TEXT_STYLE_FOOTNOTE
    }
},
"#title[if=Alloy.Globals.isIos7Plus]": {
    top: "25dp",
    font: {
        textStyle: Ti.UI.TEXT_STYLE_HEADLINE
    }
},
"#content[if=Alloy.Globals.isIos7Plus]": {
    font: {
        textStyle: Ti.UI.TEXT_STYLE_CAPTION1
    }
},
"ScrollView[if=Alloy.Globals.iPhoneTall]": {
    height: "500dp"
}
```

### Data-Binding with Conditional Queries

Define custom methods in models and render based on those methods:

**Model Method:** `shouldShowCommentRow()` returns `true`

**XML View:**
```xml
<Alloy>
    <TableViewRow id="commentRow" hasChild="false" if="$model.shouldShowCommentRow()" onClick="onSelectComment">
        <Label id="commentPlaceholderLabel" class="commentRowPreviewLabel placeholderLabel" text="Ti.App.L('AddComment')" />
        <Label id="commentRowLabel" class="commentRowPreviewLabel" text="{Comment}" />
    </TableViewRow>
</Alloy>
```

See [Custom Query Styles](/guide/Alloy_Framework/Alloy_Guide/Alloy_Views/Alloy_Styles_and_Themes/#custom-query-styles) for more details.
