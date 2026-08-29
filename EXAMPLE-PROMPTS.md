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
- All 10 TiTools skills: `ti-expert`, `purgetss`, `ti-ui`, `ti-game`, `ti-synthengine`, `ti-api`, `ti-guides`, `ti-howtos`, `alloy-guides`, `alloy-howtos`
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

### ti-game
```
"I want to build a little endless runner with ti.game — the guy jumps over obstacles that come from the right. Where do I start?"
```
Expect:
- Activates `ti-game`
- Player stays at a fixed x; gravity plus an invisible ground solid handle the jump arc
- Obstacles are pooled sprites scrolling on `velocityX`, spawned from a coarse timer
- Parallax layers via `wrapX`/`wrapShift`, never a JS loop repositioning copies

```
"My bullets go straight through the asteroids sometimes. Both have collisionGroup set and I'm listening for collision."
```
Expect:
- `collisionGroup` goes on the target, `collidesWith` on the mover — both are needed
- Fast small sprites tunnel between frames — `swept: true` on the bullet path-tests its movement, which is the fix (widening the hitbox only papers over it)
- `visible: false` disables collision, which is how pooled bullets are parked

```
"How do I move the player sprite smoothly? Right now I have a setInterval at 16ms adding to sprite.x and it stutters."
```
Expect:
- Names the anti-pattern: JS must not move sprites per frame
- `velocityX` for continuous motion, `animate()` for a move from A to B, `carMode`/`thrust` for vehicles
- Timers are fine for decisions (AI, spawning, autofire), not for motion

```
"Score label on top of the game, and the camera should follow the player but not right away — I want a dead zone."
```
Expect:
- HUD is `Game.createText({ screenFixed: true })` — a text sprite inside the scene, sized with an integer `scale`, not a `Ti.UI.Label` overlay
- `gameView.follow(sprite, { leftMargin, rightMargin, topMargin, bottomMargin, smoothing })`
- Warns that horizontal follow stays off unless `leftMargin`/`rightMargin` are passed, and that `maxY` defaults to `0`

```
"My bottom row of sprites is cut off on my phone but fine on the tablet. I'm positioning them from Ti.Platform.displayCaps."
```
Expect:
- `displayCaps` includes the system bars and reports points on iOS; the scene is in surface pixels
- Build the level in a guarded `resize` handler using `e.width`/`e.height`
- Sizes derived as fractions of W/H rather than absolute pixels

```
"I want a guard that patrols back and forth and stops when he sees the player. Right now I'm chaining animate() calls and checking distance every frame."
```
Expect:
- The route is `sprite.followPath(points, { speed, loop })`, not a chain of tween legs re-launched from `complete`
- Line of sight is `gameView.raycast(x0, y0, x1, y1, ['wall'])` — `null` means a clear view, otherwise the nearest hit with `distance` and `sprite`
- The sight check runs on a coarse timer (`gameView.every`), never per frame — a per-frame raycast from JS is the bridge traffic the engine exists to avoid
- Warns that `followPath` overwrites `x`/`y` after physics, so velocity and a path do not add up

```
"My enemies keep spawning while the game is paused with timeScale = 0."
```
Expect:
- `setInterval` runs on the JS clock and knows nothing about `timeScale`
- `gameView.every(ms, cb)` runs on the game clock: it stretches under slow motion, freezes at `0` and pauses with the render loop
- `cancelTimer(id)` with the id returned; a real-time countdown is the one case that stays on `setTimeout`

```
"Point-and-click game: I tap the floor and the guy walks there with a tween, but he walks straight through the tree. How do I make him go around?"
```
Expect:
- `gameView.findPath(from, to, { cellSize, groups, clearance, bounds })` returns waypoints for `sprite.followPath()` — no hand-authored routes, no A* in JS
- The obstacle is any sprite with a `collisionGroup`; an invisible box (`opacity: 0`, `touchEnabled: false`) over just the trunk keeps the canopy walkable
- `clearance` of about half the walker's width, because the path is a line for the sprite's **center**
- `bounds` is the walkable floor in sprite-center coordinates, and a discrete query: run it on the tap, not per frame

```
"My Tiled map is 200x200 and one sprite per tile destroys performance. How should this work in ti.game?"
```
Expect:
- Uses `Game.createTileLayer()` with nested/flat/string data instead of 40,000 sprites
- Explains `firstGid`, gid 0 and stripped Tiled flip bits; does not claim flips are rendered
- Uses `collisionGroup` plus `solid`/`oneWay`, and notes that fully solid cells feed `findPath`
- Treats `legend`, `firstGid`, `cols` and `rows` as factory-time options for Android/iOS parity
- Warns that Android string rows need build `c216e7f` or newer; earlier builds ignore a normal nested JS `legend`
- Does not invent tile trigger events, tile raycasts, animated tiles or an automatic multi-layer Tiled loader

```
"I need to see fps, p95 frame time, draw calls and particle count while I tune this scene. Does debug: true do that?"
```
Expect:
- Keeps `debug: true` as collision-shape shorthand only
- Uses `debug: { hud: 'topRight' }` for the expandable screen-space HUD
- Offers the opt-in `performance` event for programmatic snapshots, at most once per second
- Notes that `averagePresentMs` and `presentFailures` are iOS-only and omitted on Android

```
"Add Celeste-style wall jumps and a slow wall slide. I do not want a timer checking collisions."
```
Expect:
- Sets `wallSlideSpeed` on the mover; does not clamp `velocityY` from a JS loop
- Reads `onWallLeft` / `onWallRight` inside the jump-input handler and kicks `velocityX` away from that side
- Uses `wallhit` only for one-shot feedback because it fires on entry/side change; does not invent `wallend`
- Notes that the wall state works against sprite and TileLayer solids, while tile `wallhit` omits `other` and `group`

```
"My hero's hitbox is wrong: 0.62 gets his width right but he floats above the floor, and 0.92 lands him but he clips walls a mile away."
```
Expect:
- No single `hitboxScale` fits art that fills its frame by a different fraction on each axis — `hitboxScaleX: 0.62` with `hitboxScaleY: 0.92`
- The two **multiply** `hitboxScale`, so it stays the overall adjustment and they are corrections on top of it
- Circle hitboxes ignore them, and none of them change the touch area — `debug: true` draws the resulting green AABB

```
"I need a dialog box in my game. Right now I'm counting characters in JS to decide where to put the \n."
```
Expect:
- `maxWidth` on the text sprite wraps on word boundaries natively and re-wraps whenever `text` is written
- The width is font-space px, *before* `scale` — divide the screen width you want by the scale
- A word longer than `maxWidth` overflows rather than breaking mid-word; `align` positions lines against the block, not inside the wrap column

```
"My game loads a new world every level and the memory keeps climbing until it dies. I'm already removing the old sprites."
```
Expect:
- Removing sprites does not free the **texture** — `spriteSheet.unload()` / `font.unload()` release the GL texture on the next rendered frame
- Permanent, not an eviction: unload only after nothing draws from that sheet, or the sprites still pointing at it go silently blank
- Releasing the proxy unloads too; a single-level game should not call it at all

```
"Every time LiveView reloads, the game gets slower — after a few reloads it's crawling."
```
Expect:
- Since 2026-08-23 the module retires the previous runtime's render loops, `SoundPool`, `MediaPlayer`s and audio proxies on its own — app code needs no reload guard
- A build that still stacks game loops predates that commit; the manifest still says `0.4.0` either way, so date the build
- Your own JS timers, sounds and listeners are still yours to stop on a normal window close

```
"Every enemy needs a name tag floating over its head. I'm updating tag.x and tag.y from a 30ms interval and they're always a bit behind."
```
Expect:
- `tag.attachTo(enemy, { offsetY: -40 })` pins it natively — the interval and the bridge traffic go away
- Resolved after physics and solid resolution, before collisions, so the tag never trails by a frame, not even on a moving platform
- Both sprites must be in the scene; removing the enemy removes its tag recursively (`detach()` first to keep it)
- Position, rotation and opacity are inherited — fading the enemy fades its tag — while scale, visibility and tint stay per sprite

```
"I want a turret on top of my tank that turns with it, and its own barrel rotation."
```
Expect:
- `rotate: true` (`turret.attachTo(tank, { offsetY: -12, rotate: true })`) copies the tank's rotation *and* swings the offset around it — right for a part welded to the body
- A turret that aims on its own wants the default `rotate: false`: the position is pinned, `rotation` stays yours to write. `rotate: true` overwrites it every frame, so the two cannot be combined on one sprite
- Not full parenting: no `parent` property, and scale, visibility and tint are not inherited — see `references/roadmap.md`

```
"What does anchorY: 1 with hitboxScaleY: 0.55 actually mean? I copied it from an example and I don't get it."
```
Expect:
- The hitbox shrinks **around the anchor**, so `anchorY: 1` (feet) is what lets the box start mid-height without lifting off the floor — neither number says that alone
- The same sprite written readably: `anchor: 'bottom'` with `hitboxScaleY: '55%'`
- Percentages work on every ratio the engine exposes and names on both anchors, all additive — but not on coordinates, sizes, degrees, speeds, or the car model's `grip`/`drag`
- `anchor` reads back as the preset or `'custom'`; `anchorX`/`anchorY` always read back as numbers

```
"I made a ramp by rotating a platform sprite 20 degrees, but the crate lands on thin air above it and just sits there."
```
Expect:
- A plain `'rect'` hitbox is re-boxed square to the screen every frame, so a turned platform blocks along a flat top that is not drawn anywhere
- `hitboxShape: 'rotatedRect'` on the **ramp** keeps its box turned with the art; the rider needs nothing new
- Keeps the ramp short — a long one hands the rider its whole drop as speed and looks like it fired it
- Names what is still missing: `linearDamping` bleeds speed in every direction, so it is a pool table's friction, not a hill's

```
"I have 20 balls in a bowl and they all overlap each other. I'm separating them in a loop on a timer and it jitters."
```
Expect:
- The bowl is one sprite: `hitboxShape: 'circle'` with `solidMode: 'contain'`, analytic, with no ring of wall segments and no seams
- The balls are `solidMode: 'push'` to each other — and every clause is needed: both circles, both `'push'`, **each listing the other's `collisionGroup`**, or it degrades silently to one ball shoving an immovable one
- No masses, no spin, no friction, and `restitution` mixes as `max` off both sides
- Warns that `swept: true` skips anything that is not `solidMode: 'block'`, so a fast enough ball still crosses the boundary

```
"Can I use ti.game in an Alloy project or is it app.js only?"
```
Expect:
- Both. `<Module module="ti.game" method="createGameView" />` in XML, or an empty container plus a GameView created in the controller
- Game logic belongs in `app/lib/`, leaving the controller for navigation (Alloy Tier 2)
- `$.cleanup` must stop timers and sounds — `$.destroy()` does not know about them

---

### ti-synthengine
```
"Create a short sci-fi laser with ti.synthengine. It should rise in pitch while moving from the left speaker to the right."
```
Expect:
- Activates `ti-synthengine` and reads `references/api.md` plus `references/sound-design.md`
- Briefly explains why a sawtooth or triangle sweep, fast attack, fitted release, and `pan` → `panEnd` create the effect
- Uses `frequency` with `frequencyEnd`, never adds `note`, and obtains the waveform from `synth.getDefaults().waveTypes`
- Shows checked engine startup when no running owner is provided and handles the Boolean returned by `playTone()`

```
"Design a clean two-note success cue for a Titanium button. I want it pleasant on a small phone speaker, not arcade-like."
```
Expect:
- Activates `ti-synthengine`
- Chooses sine or triangle with short valid envelopes and an ascending interval
- Uses `playPattern()` with object steps or two deliberately scheduled independent tones; does not invent a multi-stage `playTone` option
- Keeps event levels conservative, explains speaker testing, and emits exact production JavaScript

```
"Build a playable ti.synthengine xylophone from C5 to C6. Taps should ring naturally and dragging across the bars must not retrigger the same bar on every touchmove."
```
Expect:
- Reads `references/recipes.md` as well as the exact API contract
- Uses `TRIANGLE`, a fast fitted attack, a moderate release and conservative per-strike gain
- Tracks the currently entered bar, resolves hit rectangles after layout, and resets the gesture on both `touchend` and `touchcancel`
- Leaves release tails independent and sizes the voice pool for their real overlap

```
"Give me a clean 12-voice layered chord, then pulse it repeatedly until the Alloy controller closes."
```
Expect:
- Uses one atomic `playChord()` per pulse and builds finite frequencies from musical intervals plus small cent offsets
- Generates a matching `pans` array, keeps the clean reference distinct from intentional overlap stress, and chooses enough `maxVoices`
- Owns the JavaScript timer with a cancellation token or handle; cleanup cancels the timer before `stopAll()`/`shutdown()`
- Does not invent per-voice detune, an indefinite native loop, or unsupported chord LFO/sweep options

Trap test:
```
"This returns false. Fix it without changing the sound I intended: synth.playTone({ note: 'A4', frequency: 440, duraton: 100, attack: 80, release: 40 })"
```
Expect:
- Removes the misspelled unsupported key, keeps only one pitch source, and makes `attack + release <= duration`
- Explains that strict option dictionaries reject the whole call rather than ignoring bad fields
- Does not clamp or silently reinterpret explicit invalid values

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
```
"Which JDK do I need for Titanium SDK 13.4? I'm on 21 and the Android build fails."
```
```
"We're on 13.1.1 — what would upgrading to 13.4 break?"
```
Expect:
- Activates `ti-guides`
- References `ti-guides/references/tiapp-config.md`, `hyperloop-native-access.md`, `compatibility-matrix.md` or `sdk-release-notes.md`
- Concrete XML/JS examples, no hand-waving
- For the version questions: cites the supported JDK range (18–25 from 13.3.0) and the changes that touch app code (ScrollableView on ViewPager2, TabGroup `focus` split from `selected`), not a raw changelog dump

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
- [ ] ti-game: refuses to move sprites from a timer and names the native property instead
- [ ] ti-game: builds the level from the `resize` event, not from `displayCaps`
- [ ] ti-game: pins a label or bar onto a sprite with `attachTo`, not with a timer copying coordinates
- [ ] ti-game: names the anchor and writes ratios as percentages where a bare number is a riddle
- [ ] ti-game: puts the shape on the **solid** — a circle peg, a `'rotatedRect'` ramp — instead of correcting a bounding box in JS
- [ ] ti-game: uses `createTileLayer` for large grids and does not invent tile triggers/raycast/animation/loader helpers
- [ ] ti-game: distinguishes collision `debug: true` from the HUD and handles iOS-only telemetry keys
- [ ] ti-game: implements wall jumps from the native wall flags and slide cap, not collision polling
- [ ] ti-game: does not invent full `parent` transforms, joysticks, gamepads, or finished platformer-slope feel
- [ ] ti-synthengine: uses only documented option keys and keeps pitch sources mutually exclusive
- [ ] ti-synthengine: produces valid envelope intersections and explains waveform/sweep/LFO choices acoustically
- [ ] ti-synthengine: checks Boolean results and owns `startEngine()` / `shutdown()` at the correct lifecycle level
- [ ] ti-synthengine: interactive instruments deduplicate `touchmove` entries and repeating effects cancel JavaScript timers before cleanup
- [ ] ti-synthengine: polyphony uses atomic chords, matched pitch/pan arrays, finite generated frequencies and an intentional overlap budget
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
| ti-game      |         |                   |       |
| ti-synthengine |       |                   |       |
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
- [ ] "Make a clean ti.synthengine success cue" should explain the acoustics and return strict, valid module code
