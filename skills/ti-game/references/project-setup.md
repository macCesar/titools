# Setting up a ti.game project

Installing the module, wiring it into Classic and Alloy projects, organizing art and sound, and the lifecycle work the engine does not do for you. Verified against `ti.game@3bea2f4` (2026-09-02).

<!-- TOC-START -->
## Contents

- [Install the module](#install-the-module)
- [Classic projects](#classic-projects)
- [Alloy projects](#alloy-projects)
- [Where art and sound live](#where-art-and-sound-live)
- [Sprite sheets and atlases](#sprite-sheets-and-atlases)
- [Fonts](#fonts)
- [Lifecycle and cleanup](#lifecycle-and-cleanup)
- [Debugging and tuning](#debugging-and-tuning)
- [Platform differences](#platform-differences)

<!-- TOC-END -->

## Install the module

There is no registry and no `ti module install` command — Titanium modules are zips you drop into a project. Grab the platform zips from the module's `dist/` folders (or build them yourself) and put them where the CLI looks:

**Project-local** (recommended — the version travels with the repo):

```
modules/
├── android/ti.game/0.5.0/
└── iphone/ti.game/0.5.0/
```

Unzipping the module zip at the project root creates exactly that layout.

**Global** (shared across projects): `~/Library/Application Support/Titanium/modules/<platform>/ti.game/<version>/`.

Then declare it in `tiapp.xml`. The iOS platform key is `iphone`, not `ios`:

```xml
<modules>
  <module platform="android" version="0.5.0">ti.game</module>
  <module platform="iphone" version="0.5.0">ti.game</module>
</modules>
```

Pinning `version` is worth the extra attribute: with two module versions installed side by side, an unpinned entry silently picks the highest one.

**The version string does not identify a feature set — the build date does.** The manifest went `0.3.0` → **`0.4.0`** on 2026-08-20, **`0.5.0`** on 2026-08-27 and **`0.6.0`** on 2026-09-02, and in between each number kept accepting features without moving. So every one of them covers several incompatible builds:

| A build from | Missing, compared to what this skill documents |
| --- | --- |
| `0.3.0` before 2026-08-18 | `createText`, `createFont`, `screenFixed`, `swept`, `collisionend` |
| `0.3.0` before 2026-08-19 | also `followPath`, `play(name, { then })`, `raycast`, `after`/`every`, `scrollFactor`, `multiply`/`screen` blends |
| `0.3.0` before 2026-08-19 16:00 UTC+2 | additionally bleeds at grid-frame edges on smoothed sheets |
| `0.4.0` — including the 2026-08-20 release zip | `hitboxScaleX`/`hitboxScaleY`, text `maxWidth`, `SpriteSheet.unload()`/`Font.unload()` and the LiveView renderer lifecycle, all added on 2026-08-23 with the manifest untouched |
| `0.4.0` built before 2026-08-24 | additionally rocks side to side through a multi-frame animation on a `smoothing: true` grid sheet — the half-texel inset was one-sided, so the end frames came out slightly wider and off-centre |
| `0.4.0` built before 2026-08-26 | additionally `sprite.attachTo()` / `detach()` / `attachedTo`, and `gameView.follow()` still aborts the app on Android if it is handed anything that is not a sprite |
| `0.4.0` built on 2026-08-26 but before `83b7863` | additionally the opacity an attachment inherits from its target, the `anchor` property, and percentage strings on every ratio — a build in this window has `attachTo` but treats `'55%'` as a number it cannot read |
| `0.4.0` at its last commit (`b780051`) | additionally everything the `0.5.0` bump carries: `hitboxShape: 'rotatedRect'`, circular solids resolved as circles, `solidMode`, `gravityX`, `linearDamping`, and `restitution` read off both sides of a contact. It also still pulls a swept sprite back to where its frame started when it begins the frame already touching a solid, so a `swept: true` body parked on a slope creeps and then breaks loose as if launched |
| `0.5.0` built before `d042060` | the performance HUD object form (`debug: { hud, hitbox, hudFont }`) and the `performance` event |
| `0.5.0` built before `10a046e` | additionally `Game.createTileLayer()`, native visible-cell tile rendering, tile collision/live edits, and TileLayer participation in `findPath` |
| `0.5.0` built before `85a723d` | additionally read-only `onWallLeft` / `onWallRight` and the `wallhit` transition event for sprite and TileLayer walls |
| `0.5.0` built before `05cb60c` | additionally `wallSlideSpeed`, the native downward-speed cap while pressed against a wall |
| `0.5.0` built before `c216e7f` | on Android only, string-row TileLayers with a nested JS `legend` decode as empty because the proxy rejects the ordinary map object; numeric data is unaffected |
| `0.5.0` built before `d7d471e` (2026-08-28) | additionally the whole gamepad surface: `buttondown`/`buttonup`, `stick`, `trigger`, `gamepadconnected`/`gamepaddisconnected`, and the `gamepads`/`gamepad`/dead-zone properties |
| `0.5.0` built before `af2e544` (2026-08-29) | additionally circular horizontal worlds: `gameView.worldWrapX` and per-sprite `wrapWorldX` |
| `0.5.0` built before `80d8f2b` (2026-08-30) | additionally the `solidimpact` event and `impactThreshold` |
| `0.5.0` built before `9c45cf6` (2026-09-02) — **this includes the artifacts most people have** | no crash fixes: writing `y`/`zIndex` from JS can abort the GL thread with *Comparison method violates its general contract*; a sound whose load failed throws `IllegalStateException` on the next `play()`; passing a mistyped value to `sheet`/`target`/`head`/`tail`/`font` aborts the process in JNI instead of raising a JS error. Also `pinch`/`rotate` fire per motion event instead of ~10 Hz, two-finger rotation can add a whole turn at the ±180° flip, the tap/drag slop ignores `cameraScale`, `cameraX`/`cameraY`/`cameraScale`/`cameraBounds`/`throttle`/`steering` are dropped when passed to a `create*` call, a removed sprite stays retained as the camera's follow target, `collidesWith`/`solidWith` reject a bare string, and the iOS glitch shader goes NaN after roughly 27 minutes |

The newest upstream release is `0.5.0` (2026-09-02), and for once the tag is ahead of the local habit rather than behind it: it sits on `9c45cf6`, so the published zip carries every fix in the row above, while a module built locally from source any time in the previous two weeks reports the same `0.5.0` and does not. Same number, different engine — prefer the release artifact, or rebuild from upstream `main` and let the manifest read `0.6.0`. If a documented call is `undefined`, check the manifest and build commit before hunting for a typo, and rebuild from upstream `main`. More reliable than either is feature detection: read a property **before** writing it (`typeof sprite.hitboxScaleX === 'undefined'`) or probe a method/factory (`typeof Game.createTileLayer === 'function'`). Write-then-read is not proof because Kroll can retain an unknown property on the proxy.

Building the module from source:

```bash
cd android
ti build -p android --build-only    # → android/dist/ti.game-android-<version>.zip
ti build -p ios --build-only        # macOS only → ios/dist/ti.game-iphone-<version>.zip
```

## Classic projects

`require('ti.game')` anywhere and add the GameView to a window. The 33 demos in the module's `example/` folder are Classic, each one a CommonJS module exporting a start function (`app.js` is the launcher, not a demo):

```javascript
// Resources/flappy.js
const Game = require('ti.game');

module.exports = function () {
	const win = Ti.UI.createWindow({ backgroundColor: '#000', theme: 'Theme.Titanium.DayNight.NoTitleBar' });
	const gameView = Game.createGameView({ backgroundColor: '#8ed8f8' });
	// ... build the game
	win.add(gameView);
	win.open();
};
```

```javascript
// Resources/app.js
require('/flappy')();
```

One module per screen or per game mode keeps things separable, and a window per mode means closing it tears the scene down.

## Alloy projects

Two ways to get a GameView on screen. Both work; pick by whether the scene is permanent or comes and goes.

### A: declare it in XML (`<Module>`)

The standard Alloy element for a native module view. `method` names the factory to call and every attribute is passed as a creation property.

```xml
<!-- app/views/index.xml -->
<Alloy>
	<Window id="index" navBarHidden="true" exitOnClose="true" onOpen="onOpen" onClose="onClose">
		<Module id="gameView" module="ti.game" method="createGameView" backgroundColor="#8ed8f8" />
		<Button id="jumpButton" title="JUMP" onTouchstart="jump" />
	</Window>
</Alloy>
```

```javascript
// app/controllers/index.js
const Game = require('ti.game');

const heroSheet = Game.createSpriteSheet({ image: 'hero.png', frameWidth: 64, frameHeight: 64 });

let initialized = false;

function onOpen() {
	$.gameView.addEventListener('resize', onResize);
}

function onResize(e) {
	if (initialized) {
		return;
	}
	initialized = true;
	buildLevel(e.width, e.height);
}
```

Only views that must be native — buttons, menus, dialogs — belong in the XML. The HUD does not: scores and labels are `Game.createText` sprites created in the controller and added to the game view, so they batch with the scene and can tween and flash.

Style the view in TSS like any other component (`'#gameView': { width: Ti.UI.FILL, height: Ti.UI.FILL }`). The `<Module>` element itself is documented Alloy behavior; the pattern below is the one verified in a shipped ti.game app.

### B: an empty container in XML, the GameView created in JS

Preferred when the game is created and destroyed repeatedly — switching between a menu and a run, changing levels, or restarting cleanly. The XML holds a plain container and the game code owns everything inside it.

```xml
<Alloy>
	<Window id="index" navBarHidden="true" exitOnClose="true" onOpen="onOpen" onClose="onClose">
		<View id="menuState" />
		<View id="gameContainer" visible="false" />
	</Window>
</Alloy>
```

```javascript
// app/controllers/index.js
const LanderGame = require('/game/LanderGame');

let game = null;

function startCampaign() {
	destroyGame();
	game = new LanderGame({ container: $.gameContainer, onExit: showMenu });
	$.menuState.visible = false;
	$.gameContainer.visible = true;
}

function destroyGame() {
	if (!game) {
		return;
	}
	game.destroy();
	game = null;
}

function onClose() {
	destroyGame();
	$.destroy();
}

$.cleanup = onClose;
```

### Structure for anything bigger than a demo

Alloy Tier 2 applies unchanged: a slim controller that owns navigation and menu state, with the game itself in `app/lib/`. A shipped layout that works:

```
app/lib/game/
├── LanderGame.js        session orchestration and the whole JS↔native boundary
├── TerrainGenerator.js  deterministic level geometry
├── WorldCatalog.js      immutable world/level data
├── AudioManager.js      owns every createSound handle
├── GamePreferences.js   Ti.App.Properties persistence
└── LeaderboardStore.js  scores
```

Catalogs, generators and stores are plain modules with no Titanium UI in them, so they are unit-testable in plain Node. The one class that touches sprites is the boundary — keep it explicit and keep the rest pure.

Alloy specifics worth remembering: `OS_IOS`/`OS_ANDROID` are compile-time constants (the dead branch is stripped, so an iOS-only API inside `if (OS_IOS)` never reaches an Android build), `Alloy.CFG` reads `config.json`, and `$.destroy()` releases Alloy's own bindings but knows nothing about your timers, sounds or sprites — see the cleanup section below.

## Where art and sound live

**Alloy**: everything under `app/assets/` is copied to the resources root, so the path in code drops the `app/assets/` prefix.

| File | Referenced as |
| --- | --- |
| `app/assets/lander.png` | `'lander.png'` |
| `app/assets/game/stars_far.png` | `'game/stars_far.png'` |
| `app/assets/sounds/jump.wav` | `'sounds/jump.wav'` |

**Classic**: paths are relative to `Resources/`, so `Resources/assets/hero.png` is `'assets/hero.png'`.

Do not use `@2x`/`@3x` density suffixes for game art. The scene is measured in surface pixels and you size every sprite yourself from the `resize` dimensions — density variants would fight that. Ship one texture at a resolution high enough for the largest target and let the engine scale it.

## Sprite sheets and atlases

**Grid** — frames numbered left-to-right, top-to-bottom from 0:

```javascript
const sheet = Game.createSpriteSheet({
	image: 'hero.png',
	frameWidth: 64,
	frameHeight: 64,
	smoothing: false        // pixel art
});
```

**TexturePacker atlas** — hash or array JSON format:

```javascript
const sheet = Game.createSpriteSheet({ image: 'hero.png', atlas: 'hero.json' });
const runFrame = sheet.frameIndex('run_01');    // -1 if unknown
```

Atlases are the better default for hand-authored art with varied frame sizes; grids are simpler for uniform pixel art.

Practical rules:

- **One sheet per scene if you can manage it.** Sprites sharing a texture batch into a single draw call. The endless-runner demo even draws its crash burst from the *player's* sheet to keep the whole scene on one texture.
- **`smoothing: false` for pixel art.** Combine with `pixelSnap: true` on moving sprites when the texel phase must stay stable.
- **Ship sheets as PNG, not JPG.** JPEG has no alpha channel, so every frame comes back on an opaque block, and its compression smears colour across frame borders — exactly where a sheet can least afford it. The module's own `basic.js` demo was converted from `hero.jpg` to `hero.png` on 2026-08-19 for this reason.
- **Edge bleeding on a smoothed grid is fixed upstream, on grids only.** Linear filtering samples past a frame's edge when the sprite is magnified, which shows up as 1px ghost lines or the next row's heads peeking in at the bottom. Since 2026-08-19 a grid sheet with `smoothing: true` pulls its frame edges in by half a texel automatically, and since 2026-08-24 it does so on **both** edges of any axis that holds more than one frame — the first version inset only the side facing a neighbour, which left the end frames of a strip half a texel wider than the rest and their centres a quarter texel off, so an animation cycling through them visibly rocked. An axis with a single frame keeps the exact texture border, so full-texture `tileRepeat` frames still wrap seamlessly, and `smoothing: false` sheets skip the inset entirely (NEAREST cannot bleed, and pixel art at 1:1 needs exact UVs). **Atlas sheets are not covered** — their UVs come straight from the JSON, so prevent bleeding when packing instead: 2px padding and extrude in TexturePacker.
- **`repeat: true` for tiling.** Required by sprites using `tileRepeat`, and it needs power-of-two texture dimensions on ES 2.0 — a 512×64 street strip tiles, a 500×60 one does not.
- **White art plus `tint`** covers every color variant of a particle or effect with one small texture.

`frameCount` is `0` until a grid sheet's texture has loaded, so do not compute animation ranges from it at creation time.

## Fonts

Nothing to ship for the default look: `Game.createText({ text: 'SCORE 0' })` uses a 9×15 pixel font embedded in the module, on both platforms.

A custom face is an asset like any other, created once outside `resize`:

```javascript
// BMFont / AngelCode descriptor + its page image, side by side in assets/
const hud = Game.createFont({ font: 'fonts/hud.fnt' });        // hud.png resolved next to it

// or a monospace grid image
const mono = Game.createFont({ image: 'fonts/mono.png', charWidth: 9, charHeight: 15 });
```

| File | Referenced as (Alloy) |
| --- | --- |
| `app/assets/fonts/hud.fnt` + `app/assets/fonts/hud.png` | `'fonts/hud.fnt'` |

These are **bitmap** fonts — do not put them in `app/assets/fonts/` expecting Titanium's native font handling, and do not use a `.ttf` here. To go from a TTF to either format, the module ships `tools/genfont.py`, which rasterizes it into a grid or BMFont atlas.

The built-in font covers ASCII 32..126 only. Any game whose text includes `ñ`, accents or `¿` needs a generated font — or a `Ti.UI.Label` overlay for that specific string.

## Lifecycle and cleanup

The engine handles what it owns: the render loop pauses and resumes with the activity or app, music pauses and resumes with it, and textures survive an EGL context loss. **Everything you created in JS is yours to stop.**

A leaked `setInterval` keeps running after the window closes, keeps reading sprite properties from a dead scene and keeps the whole closure alive. A looping `createSound` keeps playing over the next screen.

```javascript
const levelObjects = [];              // keep emitters, ropes, and TileLayers here

function cleanup() {
	clearInterval(aiTimer);
	clearTimeout(spawnTimer);
	clearHitStop();                    // restore timeScale — a frozen scene must not persist
	music.stop();
	thrustSound.stop();                // looping effects too
	listeners.forEach(({ target, eventName, handler }) => {
		target.removeEventListener(eventName, handler);
	});
	gameView.pause();
	gameView.removeAllSprites();          // Sprite/Text only
	levelObjects.forEach((object) => {    // emitters, ropes, tile layers
		gameView.remove(object);
	});
}

// Classic
win.addEventListener('close', cleanup);

// Alloy
$.cleanup = cleanup;
```

Tracking listeners as you add them makes the teardown mechanical instead of a memory exercise:

```javascript
const listeners = [];

function listen(target, eventName, handler) {
	target.addEventListener(eventName, handler);
	listeners.push({ target, eventName, handler });
}
```

`removeAllSprites()` is named literally: it clears Sprite/Text objects and their attachment state, but leaves emitters, ropes, and tile layers in the scene. Track non-sprite scene objects in `levelObjects` and remove them explicitly. For restart-without-teardown, pooling and repositioning is cheaper than rebuilding: reset positions, zero velocities, `clearTweens()`, and re-`play()` animations.

### GPU textures: `unload()`

Sheets and fonts hold GL textures, and until 2026-08-23 nothing but losing the context ever freed one. `spriteSheet.unload()` and `font.unload()` release the texture on the next rendered frame, from the render thread. Releasing the proxy does the same, so a sheet that goes out of scope no longer strands its memory.

This is for **level streaming** — a game that loads world 2's atlases while world 1's are still resident. It is not a cache: the unload is permanent, and any sprite still pointing at that sheet stops drawing.

```javascript
function unloadLevel(level) {
	level.sprites.forEach(s => gameView.remove(s));
	level.sheets.forEach(sheet => sheet.unload());   // after the sprites are gone
}
```

A single-level game with a handful of sheets should not call it at all: the textures die with the window.

### LiveView reloads

A LiveView reload replaces Titanium's JS runtime while the native side survives, which used to leave the previous `GameView`'s render loop running — every reload added another GL thread, and the audio engine handed the new runtime sample ids the old one still owned.

Since 2026-08-23 the module retires the previous generation itself: stale renderers are shut down (the `GLSurfaceView` is detached, which stops its `GLThread`), the old `SoundPool`, `MediaPlayer`s and audio proxies are released, and on Android `GameViewProxy.releaseViews()` drops the view reference so the `GLSurfaceView` — and the Activity it holds — can be collected after a window close. iOS does the same by hooking the LiveView restart and shutting down the views registered to the retiring runtime context.

**Nothing in your code needs to change**, and this is not a substitute for the cleanup above: your own timers, sounds and listeners still belong to you on a normal window close. It does mean that a reload no longer accumulates game loops, so a stuttering scene after ten reloads is a symptom that dates the build.

## Debugging and tuning

- **`debug: true` on the GameView** draws collision shapes for the whole scene; object form separates hitboxes from the performance HUD: `debug: { hitbox: true, hud: 'topRight' }`. On a sprite or TileLayer, `debug` remains a boolean. See [debugging-performance.md](debugging-performance.md) for colors, telemetry payloads, platform-only keys, and a tuning workflow.
- **Physics that feels wrong is usually a units problem.** Speeds are px/s and accelerations px/s², both in surface pixels — which is why the demos express them as fractions of `W` and `H`. A gravity of `20` is imperceptible; `H * 2.2` is a snappy platformer.
- **Sprite is invisible?** Check in order: was it added to the GameView, does it have a sheet, is `width`/`height` non-zero, is it inside the surface bounds, and is its `zIndex` below a background sprite.
- **Collision never fires?** `collisionGroup` goes on the *target*, `collidesWith` on the *mover*. Both need to be set, and `visible: false` disables collision entirely.
- **Never scrolls / never follows?** `follow()` only does horizontal tracking when `leftMargin` or `rightMargin` is passed, and `maxY` defaults to `0`.
- Testing: game logic that lives in plain modules (catalogs, generators, scoring, persistence) tests in Node with the built-in `node:test` runner. The scene layer needs a device — there is no headless renderer.

## Platform differences

The JS API is identical on Android and iOS. What differs is around it:

- **`Ti.UI.createNotification` (Android Toast) does not exist on iOS.** The demos branch on `Ti.Platform.osname` and fall back to `Ti.UI.createAlertDialog`.
- **The iOS Simulator renders at a 1x logical drawable** (its translated OpenGL path is disproportionately expensive at 3x Retina) and is noticeably slower than any real device. Real iPhone and iPad builds keep the device's native screen scale. Judge performance on device.
- **`logicalDensityFactor` lies in the iOS Simulator** — it reports the device scale while the surface renders at 1x. Derive dp→scene units from the surface instead: `H / Ti.Platform.displayCaps.platformHeight`.
- **Android's `touchFeedback` ripple** cannot animate over the GL canvas and logs `RippleDrawable` errors; give on-screen buttons manual `backgroundColor` feedback on `touchstart`/`touchend`.
- **Sound formats**: WAV, MP3 and OGG on Android; WAV, MP3 and M4A on iOS. WAV for effects, MP3 for music covers both.
- **TileLayer grid configuration**: assign `legend`, `firstGid`, `cols`, and `rows` in `createTileLayer()`. iOS accepts later writes; Android treats them as creation-time inputs.
- **Android `legend` compatibility**: string-row maps require build `c216e7f` or newer. Older Android proxies ignore a normal nested JS legend object; use numeric data or update the module.
- **Performance telemetry**: `averagePresentMs` and `presentFailures` exist only on iOS and are omitted on Android.
- **`theme: 'Theme.Titanium.DayNight.NoTitleBar'`** on the window is the Android idiom for a fullscreen game surface; on iOS use `navBarHidden`/`statusBarHidden` (or the Alloy XML equivalents).
