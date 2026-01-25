# Alloy Samples

## Kitchen Sink

See the [KitchenSink-v2 application on GitHub](https://github.com/tidev/kitchensink-v2) for Alloy samples in a real app.

## Controller Sample

**index.js**
```javascript
// These "builtin" requires are detected by alloy compile process
// Automatically included as Resources/alloy/animation.js and Resources/alloy/string.js
var animation = require('alloy/animation'),
  string = require('alloy/string');

function shake(e) {
    animation.shake($.mover, 0, function() {
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
        var front, back;
        e.bubbleParent = false;
        if (e.source === $.back) {
            front = $.back;
            back = $.front;
        } else {
            front = $.front;
            back = $.back;
        }
        animation.flipHorizontal(front, back, 500, function(e) {
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

### Problem

Showing/hiding content based on conditions (e.g., login status) traditionally causes rendering issues:

**Approach 1: show/hide (problematic)**
```javascript
if (Alloy.Globals.isLoggedIn()) {
    $.loggedIn.show();
    $.notLoggedIn.hide();
} else {
    $.loggedIn.hide(); // Bug in original - should be hide()
    $.notLoggedIn.show();
}
```
Problem: Both views render initially, causing white space.

**Approach 2: setHeight (works but messy)**
```javascript
if (Alloy.Globals.isLoggedIn()) {
    $.loggedIn.setHeight(Ti.UI.SIZE);
    $.notLoggedIn.setHeight(0);
} else {
    $.loggedIn.setHeight(0);
    $.notLoggedIn.setHeight(Ti.UI.SIZE);
}
```

### Solution: IF Attributes in XML

Use IF attributes within the XML View:

**index.xml**
```xml
<Alloy>
    <Window>
        <View class="container indent">
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

Benefits:
- Only one view renders (no white space)
- Condition evaluated before rendering
- Smoother app experience

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
