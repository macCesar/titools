# Setting up a ti.game project

Installing the module, wiring it into Classic and Alloy projects, organizing art and sound, and the lifecycle work the engine does not do for you.

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

## Install the module

There is no registry and no `ti module install` command — Titanium modules are zips you drop into a project. Grab the platform zips from the module's `dist/` folders (or build them yourself) and put them where the CLI looks:

**Project-local** (recommended — the version travels with the repo):

```
modules/
├── android/ti.game/0.3.0/
└── iphone/ti.game/0.3.0/
```

Unzipping the module zip at the project root creates exactly that layout.

**Global** (shared across projects): `~/Library/Application Support/Titanium/modules/<platform>/ti.game/<version>/`.

Then declare it in `tiapp.xml`. The iOS platform key is `iphone`, not `ios`:

```xml
<modules>
  <module platform="android" version="0.3.0">ti.game</module>
  <module platform="iphone" version="0.3.0">ti.game</module>
</modules>
```

Pinning `version` is worth the extra attribute: with two module versions installed side by side, an unpinned entry silently picks the highest one.

The version number lies right now: the manifest has read `0.3.0` through several feature landings. A zip built before 2026-08-18 has no `createText`, no `createFont`, no `screenFixed`, no `swept` and no `collisionend`; one built before 2026-08-19 also lacks `followPath`, `play(name, { then })`, `raycast`, `after`/`every`, `scrollFactor` and the `multiply`/`screen` blend modes — all while still calling itself 0.3.0. A zip built before 2026-08-19 16:00 UTC+2 also bleeds at grid-frame edges on smoothed sheets. If a call that this skill documents is `undefined` at runtime, rebuild the module from upstream `main` rather than hunting for a typo.

Building the module from source:

```bash
cd android
ti build -p android --build-only    # → android/dist/ti.game-android-<version>.zip
ti build -p ios --build-only        # macOS only → ios/dist/ti.game-iphone-<version>.zip
```

## Classic projects

`require('ti.game')` anywhere and add the GameView to a window. The 24 demos in the module's `example/` folder are Classic, each one a CommonJS module exporting a start function:

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
- **Edge bleeding on a smoothed grid is fixed upstream, on grids only.** Linear filtering samples past a frame's edge when the sprite is magnified, which shows up as 1px ghost lines or the next row's heads peeking in at the bottom. Since 2026-08-19 a grid sheet with `smoothing: true` pulls its *interior* frame edges in by half a texel automatically; outer edges stay at the texture border, so full-texture `tileRepeat` frames still wrap seamlessly, and `smoothing: false` sheets skip the inset entirely (NEAREST cannot bleed, and pixel art at 1:1 needs exact UVs). **Atlas sheets are not covered** — their UVs come straight from the JSON, so prevent bleeding when packing instead: 2px padding and extrude in TexturePacker.
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
	gameView.removeAllSprites();
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

For restart-without-teardown (a retry button), `removeAllSprites()` plus rebuilding is simplest, but pooling and repositioning is cheaper: reset positions, zero velocities, `clearTweens()`, and re-`play()` the animations.

## Debugging and tuning

- **`debug: true` on the GameView** draws collision shapes for the whole scene; on a single sprite, only that one. Green = collision AABB with `hitboxScale` applied, blue = sprite/touch bounds, orange dot = anchor. This is the fastest way to explain a hit that should not have registered.
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
- **`theme: 'Theme.Titanium.DayNight.NoTitleBar'`** on the window is the Android idiom for a fullscreen game surface; on iOS use `navBarHidden`/`statusBarHidden` (or the Alloy XML equivalents).
