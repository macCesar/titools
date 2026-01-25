# Reserved Words in Titanium

## ECMAScript Reserved Keywords

These keywords cannot be used as variable, function, method, or object identifiers per the ECMAScript specification:

```
abstract, boolean, break, byte, case, catch, char, class, const, continue,
debugger, default, delete, do, double, else, enum, export, extends, finally,
for, function, goto, if, implements, import, in, instanceof, int, interface,
let, long, native, new, package, private, protected, public, return, short,
static, super, switch, synchronized, this, throw, throws, transient, try,
typeof, var, void, volatile, while, with, yield
```

## iOS Objective-C Reserved Words

These keywords are exposed from Objective-C and may not be used as identifiers on iOS:

```
_configure, _destroy, _initProperties, autorelease, deadlock, dealloc,
description, id, init, release, startup
```

## Alloy Reserved Words

**Do not use double underscore prefixes** on variables, properties, or function names (e.g., `__foo`). These are reserved for Alloy's internal use.

## Best Practice

Always avoid these reserved words when naming:
- Variables
- Functions
- Methods
- Object properties
- Module exports
