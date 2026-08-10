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
- All 8 TiTools skills: `ti-expert`, `purgetss`, `ti-ui`, `ti-api`, `ti-guides`, `ti-howtos`, `alloy-guides`, `alloy-howtos`
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
- Reference to `purgetss/references/dynamic-component-creation.md` if PurgeTSS is detected, or to `alloy-guides/references/VIEWS_DYNAMIC.md` otherwise

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

Feedback surfaces:
```
"Every confirmation in my app is a createAlertDialog and it all looks the same. Saving a draft, deleting an account, picking a category — same ugly box. Where do I start?"
```
Expect:
- Classify by meaning first (owner, blocking, reversible, persistence, choice shape) before naming a proxy
- Snackbar with Undo for ordinary/undoable success, Dialog for blocking or destructive, Bottom Sheet for related choices
- Alloy Widget under `app/widgets/` registered in `config.json`, with `attach()` / `destroy()` lifecycle

```
"Should the file picker and the 'are you sure you want to delete this?' both become custom styled components, or do I leave them native?"
```
Expect:
- Keep OS-owned flows native (pickers, permissions, share sheets, biometrics)
- App-owned feedback (the delete confirmation) may be styled
- Never imitate a trusted system prompt

Receiving files:
```
"I gave my backup files a .snapgym extension and declared them in tiapp.xml, but tapping one in iOS Files just previews it — my app never opens. Does iOS even allow this?"
```
Expect:
- `LSSupportsOpeningDocumentsInPlace` is a root-level `Info.plist` key; nested inside `CFBundleDocumentTypes` iOS ignores it without a word
- The app still registers as owner of the type, which is why the symptom looks like iOS refusing to launch third-party apps
- Check the built binary with `plutil -extract`, not what `tiapp.xml` says

```
"On Android my app opens files named backup.snapgym but not backup.2026-08-10.snapgym. Same extension, same intent filter."
```
Expect:
- `pathPattern` matches greedily, so one variant is needed per dot in the filename
- A `content://` URI whose path carries no filename cannot match at all — a limit of name-based matching, not a misconfiguration
- Verify with `cmd package query-activities`

Sharing content out:
```
"My Share button opens the sheet on Android but does nothing on iOS, and there's no error in the log. It's a .backup file I generate in the app."
```
Expect:
- The type is not previewable, so `Ti.UI.iOS.DocumentViewer` presents nothing and reports nothing
- iOS needs a native module for opaque types — `dk.napp.social`, from the maintained `hansemannn` fork, not the archived `viezel` one
- Android needs no module at all: `Ti.Android.createIntent` + `createIntentChooser`

```
"When I share my backup file and pick 'Save to Files', it saves the backup AND a stray .txt with the title in it. Why?"
```
Expect:
- `text` passed alongside `file` becomes a second item in the iOS sheet
- Use `subject` instead, so the title rides along without becoming an item
- Mention that this only shows up in destinations that write to disk, which is why it survives testing

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
- Activates `ti-ui`
- Explains `DefaultIcon.png` (1024×1024) as the single iOS master
- Android adaptive icon triplet (foreground, background, monochrome) × 5 densities
- References `mipmap-anydpi-v26/ic_launcher.xml` binder

---

### ti-api
```
"What events does `Ti.UI.ListView` fire and what data do their callbacks receive?"
```
```
"Show me the full signature of `Ti.Network.createHTTPClient` — every property and method."
```
Expect:
- Activates `ti-api`
- References `ti-api/references/api-ui-lists.md` (ListView) or `api-data-network.md` (HTTPClient)
- Concrete property/method/event names, not generic descriptions

---

### ti-guides
```
"How do I set the iOS bundle identifier and the Android applicationId in `tiapp.xml`?"
```
```
"What's the right way to wire up Hyperloop to call a native iOS class from JavaScript?"
```
Expect:
- Activates `ti-guides`
- References `ti-guides/references/tiapp-config.md` or `hyperloop-native-access.md`
- Concrete XML/JS examples, no hand-waving

---

### ti-howtos
```
"How do I add Android push notifications using Firebase in a Titanium app?"
```
```
"How do I show a Google Maps v2 view on Android with a custom marker?"
```
Expect:
- Activates `ti-howtos`
- References `ti-howtos/references/notification-services.md` or `google-maps-v2.md`
- Working integration code, not pseudocode

---

### alloy-guides
```
"How do I bind a Backbone Collection to a TableView in Alloy and update the UI when items change?"
```
```
"Explain how Alloy widgets work and how to share one between two projects."
```
Expect:
- Activates `alloy-guides`
- References `alloy-guides/references/MODELS.md` or `WIDGETS.md`
- XML/TSS/controller patterns specific to Alloy

---

### alloy-howtos
```
"What does `alloy.jmk` do and when should I add a pre:compile hook?"
```
```
"How do I make `config.json` use different values for iOS vs Android in production?"
```
Expect:
- Activates `alloy-howtos`
- References `alloy-howtos/references/config_files.md` or the related Alloy CLI reference
- Concrete examples of conditionals and build hooks

---

## Cross-skill collaboration tests

### Prompt that should activate multiple skills
```
"I need a login screen with email/password validation, the auth token stored securely, and a nice fade-in animation when it loads."
```
Expect:
- Use `ti-expert` for architecture and controller structure
- Use `ti-ui` for animations and layout patterns
- Use `purgetss` only if PurgeTSS is detected or the user mentions it
- For secure token storage: use `ti-howtos`

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
- `purgetss` only if PurgeTSS is detected or the user mentions it
- For GPS tracking: use `ti-howtos`

---

## Validation checklist

- [ ] ti-expert: responds with correct architecture
- [ ] ti-expert: classifies the feedback surface before naming a proxy
- [ ] ti-expert: places `LSSupportsOpeningDocumentsInPlace` at the root of Info.plist
- [ ] ti-expert: splits sharing by platform instead of routing both through a module
- [ ] purgetss: does not use flexbox, uses correct classes
- [ ] ti-ui: mentions performance rules
- [ ] ti-api: cites specific properties/methods/events
- [ ] ti-guides: references tiapp.xml / Hyperloop / distribution docs
- [ ] ti-howtos: provides working integration code
- [ ] alloy-guides: uses Alloy XML/TSS patterns
- [ ] alloy-howtos: references alloy.jmk / config.json correctly
- [ ] Collaboration: multiple skills work together

---

## Testing notes

Date: ___________ Platform: [ ] Claude Code  [ ] Gemini CLI  [ ] Codex CLI

### Results

| Skill        | Active? | Correct response? | Notes |
| ------------ | ------- | ----------------- | ----- |
| ti-expert    |         |                   |       |
| purgetss     |         |                   |       |
| ti-ui        |         |                   |       |
| ti-api       |         |                   |       |
| ti-guides    |         |                   |       |
| ti-howtos    |         |                   |       |
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
Expect: use `ti-ui`, `ti-expert` (for offline caching with native APIs, use `ti-howtos`)

Settings screen:
```
"I need a settings screen with toggle switches for notifications and dark mode,
an account section with logout, and it should look native on both platforms
(Action Bar on Android, Navigation Bar on iOS)."
```
Expect: use `ti-ui`

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
Expect: use `purgetss` (references/platform-modifiers.md) Explain: missing `[platform=ios]` modifier

Slow ListView:
```
"My product list with ~1000 items is choppy and laggy when scrolling fast. How do I fix it?"
```
Expect: use `ti-ui` (references/listviews-and-performance.md) Check: using `Ti.UI.SIZE`? using proper templates?

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
Expect: use `ti-expert` for migration patterns and `ti-guides` for SDK version notes.

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
