# Titanium skills: testing and example prompts

Prompts to check that assistants activate the right skills and use them correctly. These are written like normal developer requests.

## Instruction files context tests

These prompts verify the assistant read the docs index from your project's instruction file (AGENTS.md, CLAUDE.md, GEMINI.md).

### Context checks

```
"What Titanium skills and docs do I have available in this project?"
```
Expect:
- Titanium SDK docs index
- All 7 skills: `alloy-guides`, `alloy-howtos`, `purgetss`, `ti-expert`, `ti-guides`, `ti-howtos`, `ti-ui`
- Reference file locations

---

```
"What PurgeTSS reference docs are included?"
```
Expect:
- animation-system.md
- class-index.md
- custom-rules.md
- grid-layout.md
- etc.

---

```
"What Titanium SDK version is this project using?"
```
Expect:
- Version detection from tiapp.xml

---

### Instruction files plus skills

These prompts check that the docs index provides context while skills add specialized help.

```
"My Android build crashes because of an iOS-only property in PurgeTSS. What's the rule for platform-specific stuff?"
```
Expect:
- Reference to `purgetss/references/platform-modifiers.md`
- Rule: require `[platform=ios]` or `[platform=android]` modifiers
- Reason: prevents cross-platform build failures

---

```
"My ListView scrolls like garbage with 200+ items. What am I doing wrong?"
```
Expect:
- Reference to `ti-ui/references/listviews-and-performance.md`
- No `Ti.UI.SIZE` in items
- Use fixed heights
- Prefer ListView over TableView for large datasets

---

```
"I need to create views on the fly from code instead of XML. What's the cleanest way?"
```
Expect:
- `$.UI.create()` syntax examples (standard Alloy API)
- Why it's better than manual style objects
- Reference to `alloy-guides/references/VIEWS_DYNAMIC.md` or `purgetss/references/dynamic-component-creation.md` if PurgeTSS is detected

---

## Activation tests

### ti-expert
```
"I'm starting a new app that needs login, signup, and a protected dashboard. How should I organize the project?"
```
```
"My app is getting messy, controllers are huge, everything talks to everything. Help me restructure it properly."
```
Expect:
- Structure with `lib/api/`, `lib/services/`, `lib/helpers/`
- cleanup() pattern for memory management
- Mention EventBus (Backbone.Events) instead of Ti.App.fireEvent

---

### purgetss
```
"I need a card component with rounded corners, a shadow, and the image on the left side. What PurgeTSS classes do I use?"
```
Expect:
- Classes like `horizontal`, `rounded`, `shadow`
- Do not use `flex-row`, `justify-between`, `items-center`
- Do not create manual .tss files

Trap test:
```
"I want a header with the title on the left and a menu icon on the right, spaced with justify-between."
```
Correct response:
- Flexbox does not exist in Titanium
- Use `horizontal` plus margins instead

---

### ti-ui
```
"I have a TableView with 500 rows and it's super slow on Android. How do I fix this?"
```
Expect:
- Avoid `Ti.UI.SIZE` in items (causes jerky scrolling)
- Use fixed heights
- Prefer ListView over TableView for large datasets

```
"I need to generate all the app icons for iOS and Android. What sizes do I need and where do they go?"
```
Expect:
- Screen densities (mdpi, hdpi, xhdpi, etc.)
- DefaultIcon.png
- Asset catalogs for iOS

---

### ti-howtos
```
"I need to send push notifications to both iOS and Android. What do I need to configure?"
```
Expect:
- tiapp.xml configuration
- iOS permissions (NSNotificationUsageDescription)
- APNs and FCM setup
- Lifecycle handlers

```
"My app needs real-time GPS for delivery tracking but users complain it drains their battery."
```
Expect:
- distanceFilter
- accuracy settings
- Pause in background

---

### ti-guides
```
"I need to use a native iOS API that Titanium doesn't expose. How does Hyperloop work?"
```
Expect:
- Hyperloop syntax for Objective-C/Swift
- Type casting
- Code examples

```
"My app is ready. What's the whole process to get it on the App Store?"
```
Expect:
- Certificates and provisioning
- tiapp.xml configuration
- Build commands

---

### alloy-guides
```
"I have a list of products from an API and I want them to auto-update in the view when the data changes. How does data binding work in Alloy?"
```
Expect:
- Backbone.js collections
- dataCollection attribute in XML
- Sync adapters

```
"I need to store user profiles locally with SQLite. How do I set up the model?"
```
Expect:
- alloy generate model command
- Adapter configuration
- Migrations

---

### alloy-howtos
```
"I'm getting 'No app.js found' when I try to build. What's going on?"
```
Expect:
- Run `alloy compile --config platform=<platform>`

```
"I'm using Ti.App.fireEvent everywhere and it's turning into spaghetti. What's the better way to communicate between controllers?"
```
Expect:
- Alloy.Events = _.clone(Backbone.Events)
- .on(), .off(), .trigger() methods
- Cleanup on window close

---

## Cross-skill collaboration tests

### Prompt that should activate multiple skills
```
"I need a login screen with email/password validation, the auth token stored securely, and a nice fade-in animation when it loads."
```
Expect:
- Use `ti-expert` for architecture and controller structure
- Use `ti-ui` for animations and layout patterns
- Use `ti-howtos` for secure token storage
- Use `purgetss` only if PurgeTSS is detected or the user mentions it

---

### Complex prompt
```
"I'm building a food delivery app. I need:
1. A clean project structure with separate API and service layers
2. A product listing that refreshes when you pull down
3. Live GPS tracking for the delivery driver
4. The UI styled consistently across iOS and Android"
```
Expect:
- `ti-expert` for project structure
- `ti-ui` for ListView with pull-to-refresh
- `ti-howtos` for GPS tracking
- `purgetss` only if PurgeTSS is detected or the user mentions it

---

## Validation checklist

- [ ] ti-expert: responds with correct architecture
- [ ] purgetss: does not use flexbox, uses correct classes
- [ ] ti-ui: mentions performance rules
- [ ] ti-howtos: includes permissions and tiapp.xml
- [ ] ti-guides: knows Hyperloop and distribution
- [ ] alloy-guides: explains MVC and data binding
- [ ] alloy-howtos: knows CLI and common errors
- [ ] Collaboration: multiple skills work together

---

## Testing notes

Date: ___________
Platform: [ ] Claude Code  [ ] Gemini CLI  [ ] Codex CLI

### Results

| Skill        | Active? | Correct response? | Notes |
| ------------ | ------- | ----------------- | ----- |
| ti-expert    |         |                   |       |
| purgetss     |         |                   |       |
| ti-ui        |         |                   |       |
| ti-howtos    |         |                   |       |
| ti-guides    |         |                   |       |
| alloy-guides |         |                   |       |
| alloy-howtos |         |                   |       |

---

## Additional practical examples

### Real-world scenarios

E-commerce product listing:
```
"I need a product catalog screen. Each product has an image, name, price, and an 'Add to Cart' button.
The list could have hundreds of items, and users should be able to pull down to refresh and swipe to delete."
```
Expect: use `ti-ui`, `ti-expert` (plus `purgetss` if detected)

Social feed:
```
"I'm building a social feed like Instagram, avatar, username, photo, like/comment counts.
It needs infinite scroll, smooth animations when new posts load, and it should cache posts for offline."
```
Expect: use `ti-ui`, `ti-howtos`, `ti-expert`

Settings screen:
```
"I need a settings screen with toggle switches for notifications and dark mode,
an account section with logout, and it should look native on both platforms
(Action Bar on Android, Navigation Bar on iOS)."
```
Expect: use `ti-ui`, `ti-howtos`

Onboarding flow:
```
"I want a 3-screen onboarding flow that users can swipe through, with a skip button and a 'Get Started' on the last page."
```
Expect: use `ti-expert`, `ti-ui`

---

### Debugging scenarios

Memory leak investigation:
```
"My app gets slower the more screens the user opens and closes. I think I have a memory leak.
How do I find it and fix it in Alloy?"
```
Expect: use `ti-expert` (references/error-handling.md, performance-optimization.md)

Build failure:
```
"My build fails on Android with 'Property opaque is not allowed in android platform'.
I'm using PurgeTSS. What did I do wrong?"
```
Expect: use `purgetss` (references/platform-modifiers.md)
Explain: missing `[platform=ios]` modifier

Slow ListView:
```
"My product list with ~1000 items is choppy and laggy when scrolling fast. How do I fix it?"
```
Expect: use `ti-ui` (references/listviews-and-performance.md)
Check: using `Ti.UI.SIZE`? using proper templates?

Performance audit:
```
"My app feels sluggish overall. Can you look at my code and tell me what's slowing it down?"
```
Expect: use `ti-ui`, `ti-expert`

---

### Migration scenarios

Classic to Alloy:
```
"I have an old Classic Titanium app with everything in Resources/app.js. It's unmaintainable.
How do I migrate it to Alloy step by step?"
```
Expect: use `ti-expert` (references/migration-patterns.md)

Old Titanium to modern:
```
"I'm upgrading from Titanium 8.x to 12.x. What's going to break? What new stuff should I use?"
```
Expect: use `ti-guides`, check version documentation

---

## Testing AGENTS.md effectiveness

### Before vs after comparison

Test these prompts without AGENTS.md, then with AGENTS.md to see the difference.

Test 1: specific API knowledge
```
"How do I use the new connection() API for dynamic rendering in Titanium?"
```
- Without AGENTS.md: may hallucinate or use old patterns
- With AGENTS.md: should say "not in current docs" or point to the correct reference

Test 2: framework-specific knowledge
```
"I need a 3-column grid layout in PurgeTSS. What's the syntax?"
```
- Without AGENTS.md: may suggest flexbox or Tailwind classes
- With AGENTS.md: should use `grid grid-cols-3` and explain syntax

Test 3: cross-reference
```
"Where in the docs can I find how to properly clean up Alloy controllers?"
```
- Without AGENTS.md: "I don't know" or vague answer
- With AGENTS.md: "ti-expert/references/controller-patterns.md"

---

## Quick verification checklist

After installing AGENTS.md or CLAUDE.md, ask these to verify it works.

- [ ] "What Titanium skills and docs are available in this project?" should list all skills
- [ ] "Which PurgeTSS doc covers grid layouts?" should know the file path
- [ ] "My Android build crashes with an iOS-only property. What's the rule?" should answer correctly
- [ ] "My ListView is slow with lots of items. Where are the performance docs?" should point to docs
- [ ] "How do I create views from code instead of XML?" should explain with reference
