# Style and Conventions Reference

## 1. Naming Conventions
- **Variables**: `nounCategory` (e.g., `personName`, `buttonSubmit`).
- **Functions**: `verbCategory` (e.g., `getPersonName`, `doSync`).
- **Classes/Constructors**: `PascalCase` (e.g., `User`, `NetClient`).
- **Factories**: Prefix with `create` (e.g., `createWidget`).

## 2. Formatting
- **Semicolons**: Mandatory in original guide (Skill Engineer rule: let ASI handle it).
- **Indentation**: Consistency is most important (K&R/1TBS style).
- **Operators**: Add a single space around operators.
```javascript
const fullName = firstName + ' ' + lastName
```

## 3. Primitive Types
- Avoid using primitive type object constructors (e.g., `new String()`).
- Use template literals or single space concatenation.

## 4. Control Statements
- Switch statements should have a single space around parentheses and proper indentation for cases.
