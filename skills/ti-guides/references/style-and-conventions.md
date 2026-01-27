# Style and Conventions Reference

## 1. Naming Conventions
- **Variables**: `nounCategory` (e.g., `personName`, `buttonSubmit`).
- **Functions**: `verbCategory` (e.g., `getPersonName`, `doSync`).
- **Classes/Constructors**: `PascalCase` (e.g., `User`, `NetClient`).
- **Factories**: Prefix with `create` (e.g., `createWidget`).
- **Namespaces**: Use capitalized words (e.g., `App.UI.Widget`, `App.Network.Request`). Avoid lowercase for major namespaces (e.g., use `App.UI` instead of `app.ui`).

## 2. Formatting
- **Semicolons**: Mandatory in official SDK guides, but **omitted** in the `alloy-expert` standard (let ASI handle it).
- **Indentation**: Consistency is most important (K&R/1TBS style).
- **Operators**: Add a single space around operators.
```javascript
const fullName = firstName + ' ' + lastName
```

**CRITICAL: Return Statement Placement**
Never put `return` on its own line followed by an object literal. JavaScript will insert a semicolon automatically, returning `undefined`.
```javascript
// ❌ WRONG
return
{
  foo: 'bar'
}

// ✅ CORRECT
return {
  foo: 'bar'
}
```

## 3. Primitive Types
- Avoid using primitive type object constructors (e.g., `new String()`).
- Use template literals or single space concatenation.

## 4. Control Statements
- Switch statements should have a single space around parentheses and proper indentation for cases.

## 5. Comments and Documentation
- **Single-line comments**: Preferred for short explanations.
- **JSDoc/Block comments**: Required for documenting functions and classes.
```javascript
/**
 * @param {String} customerName Customer's full name.
 */
function getCustomer(customerName) {}
```
