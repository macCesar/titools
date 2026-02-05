# Alloy samples

## Kitchen sink

See the [KitchenSink-v2 application on GitHub](https://github.com/tidev/kitchensink-v2) for Alloy samples in a full app.

## Controller sample

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

## Conditional statements in views

Alloy separates business logic (controllers) from UI definition (XML/TSS). A common challenge is showing or hiding content based on app state (for example, login status).

:::tip TSS defaults
The samples below assume some additional TSS: views and windows use a vertical layout, and the `View` tag has a default height and width of `Ti.UI.SIZE`.
:::

### Problems with traditional approaches

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
**Problem:** Both views render when the window opens. If the user isn't logged in, there is empty space where the logged-in view was.

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
**Problem:** This works, but it forces you to manage height values (`Ti.UI.SIZE`) in JavaScript instead of TSS.

### Solution: IF attributes in XML

Use `if` attributes directly in the XML view. These conditions are evaluated before rendering.

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

Benefits:
- Only the view that matches the condition is rendered.
- The UI is correct from the first frame.
- No visibility logic in controllers.

### Conditional queries in TSS

Use `if` attributes in TSS definitions:

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

### Data-binding with conditional queries

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
