# Reserved words in Titanium

## ECMAScript reserved keywords

These keywords cannot be used as variable, function, method, or object identifiers under the ECMAScript specification:

```
abstract, boolean, break, byte, case, catch, char, class, const, continue,
debugger, default, delete, do, double, else, enum, export, extends, finally,
for, function, goto, if, implements, import, in, instanceof, int, interface,
let, long, native, new, package, private, protected, public, return, short,
static, super, switch, synchronized, this, throw, throws, transient, try,
typeof, var, void, volatile, while, with, yield
```

## iOS Objective-C reserved words

These keywords are exposed from Objective-C and should not be used as identifiers on iOS:

```
_configure, _destroy, _initProperties, autorelease, deadlock, dealloc,
description, id, init, release, startup
```

## Alloy reserved words

Do not use double underscore prefixes on variables, properties, or function names (for example, `__foo`). These are reserved for Alloy's internal use.

## Best practice

Avoid these reserved words when naming:
- Variables
- Functions
- Methods
- Object properties
- Module exports
