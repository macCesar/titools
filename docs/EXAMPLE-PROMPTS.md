# Titanium Skills - Testing & Example Prompts

Prompts to verify that AI assistants activate and correctly use the skills.

## Activation Tests

### alloy-expert
```
"How should I structure a new Titanium Alloy app with user authentication?"
```
**Should include:**
- Structure with `lib/api/`, `lib/services/`, `lib/helpers/`
- cleanup() pattern for memory management
- Mention EventBus (Backbone.Events) instead of Ti.App.fireEvent

---

### purgetss
```
"Create a card component with shadow, rounded corners, and horizontal layout"
```
**Should include:**
- Classes like `horizontal`, `rounded`, `shadow`
- Should NOT use `flex-row`, `justify-between`, `items-center`
- Should NOT create manual .tss files

**Trap test:**
```
"Create a flex container with justify-between for a header in Titanium"
```
**Correct response:** Should say flexbox does NOT exist and use `horizontal` + margins instead

---

### ti-ui
```
"Best practices for ListView performance in Titanium"
```
**Should include:**
- Avoid `Ti.UI.SIZE` in items (causes jerky scrolling)
- Use fixed heights
- Prefer ListView over TableView for large datasets

```
"How do I set up app icons for iOS and Android?"
```
**Should include:**
- Screen densities (mdpi, hdpi, xhdpi, etc.)
- DefaultIcon.png
- Asset catalogs for iOS

---

### ti-howtos
```
"How to implement push notifications in Titanium for iOS and Android?"
```
**Should include:**
- tiapp.xml configuration
- iOS permissions (NSNotificationUsageDescription)
- APNs and FCM setup
- Lifecycle handlers

```
"Implement GPS tracking with battery efficiency"
```
**Should include:**
- distanceFilter
- accuracy settings
- Pause in background

---

### ti-guides
```
"How do I access native iOS APIs using Hyperloop?"
```
**Should include:**
- Hyperloop syntax for Objective-C/Swift
- Type casting
- Code examples

```
"Prepare my app for App Store submission"
```
**Should include:**
- Certificates and provisioning
- tiapp.xml configuration
- Build commands

---

### alloy-guides
```
"Explain how Alloy data binding works with collections"
```
**Should include:**
- Backbone.js collections
- dataCollection attribute in XML
- Sync adapters

```
"Create a model with SQLite adapter"
```
**Should include:**
- alloy generate model command
- Adapter configuration
- Migrations

---

### alloy-howtos
```
"Fix 'No app.js found' error in Alloy"
```
**Should include:**
- Run `alloy compile --config platform=<platform>`

```
"How to use Backbone.Events instead of Ti.App.fireEvent?"
```
**Should include:**
- Alloy.Events = _.clone(Backbone.Events)
- .on(), .off(), .trigger() methods
- Cleanup on window close

---

## Cross-Skill Collaboration Tests

### Prompt that should activate multiple skills:
```
"Build a login screen with email validation, secure token storage, PurgeTSS styling, and nice animations"
```
**Should use:**
- `alloy-expert` - Architecture, controller structure
- `purgetss` - Style classes, animations
- `ti-howtos` - Keychain for secure tokens

---

### Complex prompt:
```
"I'm building a food delivery app. Help me:
1. Set up the project structure
2. Create a product listing with pull-to-refresh
3. Implement GPS tracking for delivery
4. Style everything with PurgeTSS"
```
**Should use:**
- `alloy-expert` - Project structure
- `ti-ui` - ListView with pull-to-refresh
- `ti-howtos` - GPS tracking
- `purgetss` - Styling

---

## Validation Checklist

- [ ] alloy-expert: Responds with correct architecture
- [ ] purgetss: Does NOT use flexbox, uses correct classes
- [ ] ti-ui: Mentions performance rules
- [ ] ti-howtos: Includes permissions and tiapp.xml
- [ ] ti-guides: Knows Hyperloop and distribution
- [ ] alloy-guides: Explains MVC and data binding
- [ ] alloy-howtos: Knows CLI and common errors
- [ ] Collaboration: Multiple skills work together

---

## Testing Notes

**Date:** ___________
**Platform:** [ ] Claude Code  [ ] Gemini CLI  [ ] Codex CLI

### Results:

| Skill        | Active? | Correct Response? | Notes |
| ------------ | ------- | ----------------- | ----- |
| alloy-expert |         |                   |       |
| purgetss     |         |                   |       |
| ti-ui        |         |                   |       |
| ti-howtos    |         |                   |       |
| ti-guides    |         |                   |       |
| alloy-guides |         |                   |       |
| alloy-howtos |         |                   |       |
