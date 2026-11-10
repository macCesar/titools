# Runtime TSS classes

The current styling guide exposes controller methods to change classes on an existing view:

```javascript
$.addClass($.row, 'selected');
$.removeClass($.row, 'selected');
$.resetClass($.row, 'row');
```

`resetClass` replaces the class list instead of adding to it. Use it for mutually exclusive states. Provide a view with ID `row` and the referenced TSS classes before calling these methods.

Released Alloy requires autostyle to track the class list and recompute properties correctly when classes are removed. Enable it before creating these components, for example on their view root:

```xml
<Alloy autoStyle="true">
    <Window>
        <View id="row" class="row" />
    </Window>
</Alloy>
```

This is a required correction to the current guide's abbreviated recipe: without class tracking, removal can leave old property values in place. This opt-in has a cost, so apply it to the components that need dynamic classes.

Source: [styles and themes, Classes at runtime](https://titaniumsdk.com/docs/alloy/styles.md). The prerequisite is verified against the released Alloy 3.0.1 controller implementation.
