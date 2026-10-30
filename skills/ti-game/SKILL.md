---
name: ti-game
description: "Use when a Titanium app declares ti.game in tiapp.xml, imports require('ti.game'), or needs a 2D game built or reviewed with that native engine: sprites, native movement, collisions, tile layers, camera, HUD, audio, particles, touch, keyboard/mouse actions or gamepads. Covers Alloy and Classic on Android, iOS and Mac Catalyst. Do not use for unrelated game engines or ordinary Titanium UI."
allowed-tools: Read, Grep, Glob, Edit, Write, Bash(node *)
---

# ti.game — native 2D games for Titanium SDK

`ti.game` is Michael Gangolf's native sprite engine for Titanium: OpenGL ES 2.0 on Android and Metal on iPhone, iPad and Mac Catalyst. JavaScript describes the scene and reacts to discrete events; Android and iOS run rendering, animation, physics, collision, gestures, audio, particles, ropes, tile layers, camera work, and telemetry natively.

Reviewed on **2026-10-23** against `macCesar/ti.game@2bf5f82`, based on
upstream `m1ga/ti.game@88e181c`. Both manifests declare **`1.0.0`** and
minimum Titanium SDK **`13.4.0`**; documented builds use **`13.4.1.GA`**.
The fork's documentation/build adjustments and upstream engine are recorded
separately in [references/source-notes.md](references/source-notes.md).
Upstream PR #39 was merged on **2026-10-29**; current upstream `db11980`
has the same complete Git tree as the audited `2bf5f82` revision.
Identify installed artifacts by source commit and ZIP hash; the version alone
does not prove these capabilities or publication of the fork.

The skill applies to **Classic and Alloy** projects. Nothing here requires PurgeTSS.

## Visual and sound asset collaboration

Use `ti-game-assets` to create/edit complete visual and sound asset sets, preserve art/acoustic palettes and provenance, validate alpha/frames/manifests, prepare exports, and coordinate variants and stereo event placement. `ti-game` governs native representation/motion/events; `ti-synthengine` governs synthesis and sound behavior with `ti.synthengine`. Both have equal domain authority. Read their relevant current references rather than duplicating manuals. Art alone does not require installing modules or adding sounds/mechanics.

For requested advertising or existing `ti.admob.unified`, use `ti-admob-unified` for the official module/privacy/provider contract and deliberate game-ad boundaries. Preserve native clock, inputs and audio ownership; graphics work alone does not authorize monetization.

## Required workflow

Open the references relevant to the task before proposing code. Do not answer from familiarity with Phaser, Godot, Box2D, or an older `ti.game` build.

| Task | Read first |
| --- | --- |
| Exact methods, properties, defaults, event payloads, percentages | [references/api.md](references/api.md) |
| Keyboard, mouse, named actions, contexts, focus and controller ownership | [references/input.md](references/input.md) |
| Source pins, upstream/fork differences, audit limits | [references/source-notes.md](references/source-notes.md) |
| Install, Classic/Alloy structure, assets, cleanup, lifecycle | [references/project-setup.md](references/project-setup.md) |
| Choose a runnable upstream example | [references/examples.md](references/examples.md) |
| Choose or tune a physical model, derive equations/units, diagnose FPS-dependent motion | [references/physics.md](references/physics.md) |
| Reusable level, pooling, HUD, collision, path, timer patterns | [references/patterns.md](references/patterns.md) |
| Platformer, racer, shooter, runner, rhythm, ball-game recipes | [references/recipes-action.md](references/recipes-action.md) |
| Cards, point-and-click, particles, ropes, camera, effects | [references/recipes-adventure-effects.md](references/recipes-adventure-effects.md) |
| Large maps, Tiled data, tile collision, live edits, pathfinding | [references/tilemaps.md](references/tilemaps.md) |
| Hitbox overlays, performance HUD, telemetry, tuning | [references/debugging-performance.md](references/debugging-performance.md) |
| Missing, partial, and deliberately out-of-scope features | [references/roadmap.md](references/roadmap.md) |

In the response, cite factual guidance with `[source: references/<file>.md]`. If a relevant reference cannot be consulted, prefix the claim with `FROM_MEMORY (unverified):` instead of silently filling the gap.

The module's demos are integration evidence, not production templates. Preserve the API combination they prove, but remove launcher plumbing, repeated navigation controls, and avoidable global state when adapting them.

## The engine rule

**JS describes and reacts. The engine runs every frame.**

Do not move sprites from `setInterval`, `requestAnimationFrame`, or a JS loop. Property writes cross the Kroll bridge; native properties and methods keep frame-by-frame work on the render thread. Coarse timers are appropriate for decisions such as enemy targeting or spawn cadence, preferably through `gameView.after()` / `every()` when they must obey pause and `timeScale`.

| Intent | Native mechanism |
| --- | --- |
| Fall or move continuously | `gravity`, `gravityX`, `velocityX`, `velocityY` |
| Move to a point | `animate()` or `followPath()` |
| Drive or fly | `carMode` + `throttle`/`steering`, or `thrust` + `angularVelocity` |
| Drag, pinch, rotate | `draggable`, `pinchable`, `rotatable` |
| Follow the player | `gameView.follow()` |
| Walk around obstacles | `findPath()` → `followPath()` |
| Test line of sight or hitscan | `raycast()` |
| Fast projectile collision | `swept: true` on the mover |
| Detect a side wall or slide down it | `onWallLeft` / `onWallRight`, `wallhit`, `wallSlideSpeed` |
| Repeat a large map efficiently | `Game.createTileLayer()` |
| Attach a label, health bar, or turret | `attachTo()` |
| Score or in-game label | `Game.createText()`; usually `screenFixed: true` for a HUD |
| Smoke, sparks, explosions | `Game.createEmitter()` |
| Chain, tether, cape | `Game.createRope()` |
| Pause or slow the scene while still drawing | `gameView.timeScale` |
| Measure FPS, frame time, and draw calls | `debug: { hud: true }` or the `performance` event |
| Map keyboard, mouse and gamepad buttons to actions | `inputMap`, `inputContext`, `actiondown` / `actionup`, `focusInput()` |
| Read a game controller | GameView `buttondown`/`buttonup`, `stick`, `trigger` (names normalized across pads) |
| Wrap the world around horizontally | `gameView.worldWrapX` + per-sprite `wrapWorldX` |
| React to the force of a hit | `solidimpact` with a per-sprite `impactThreshold` |

## Minimal scene

```javascript
const Game = require('ti.game');

const win = Ti.UI.createWindow({
	backgroundColor: '#000',
	navBarHidden: true,
	theme: 'Theme.Titanium.DayNight.NoTitleBar'
});
const gameView = Game.createGameView({
	backgroundColor: '#8ed8f8',
	maxFps: 60
});
const sheet = Game.createSpriteSheet({
	image: 'assets/hero.png',
	frameWidth: 32,
	frameHeight: 48,
	smoothing: false
});

let initialized = false;
gameView.addEventListener('resize', ({ width, height }) => {
	if (initialized) {
		return;
	}
	initialized = true;

	const hero = Game.createSprite({
		sheet,
		x: width / 2,
		y: height / 2,
		animations: {
			idle: { frames: [0], fps: 1, loop: true },
			walk: { frames: [1, 2], fps: 6, loop: true }
		}
	});
	hero.play('idle');
	gameView.add(hero);
});

win.add(gameView);
win.open();
```

## Non-negotiable invariants

- For keyboard/mouse, read the focused input contract and consuming-app plist requirements before coding; keep native text fields and overlaid controls usable.
- Build surface-dependent content from the GameView's guarded `resize` event. `Ti.Platform.displayCaps` is not the scene surface and can include system bars or different units.
- Coordinates use a top-left origin, y increases downward, and `(x, y)` is the sprite anchor. Durations crossing the JS boundary are milliseconds.
- `solidWith` blocks; `collidesWith` reports `collision`/`collisionend`. They are independent. A sized sprite without a sheet is a valid invisible solid or trigger.
- Put the hitbox shape on the object whose geometry matters. A round peg needs `hitboxShape: 'circle'`; a ramp needs `'rotatedRect'`.
- Gate wall jumps on `onWallLeft` / `onWallRight` inside the jump input handler. `wallhit` is the transition event for effects; `wallSlideSpeed` caps the downward speed natively.
- A `TileLayer` replaces one-sprite-per-tile maps when the map is large. Its visible-cell renderer, cell collision, live edits, and pathfinding integration are native.
- Collect initial sprites, emitters, ropes, and tile layers and add them in one `gameView.add([...])` call.
- Use `Game.createText()` for scene text. Use Titanium views only for UI the engine cannot draw, such as native input controls or system-font interfaces.
- Stop app-owned JS timers, looping sounds, and listeners on close/controller cleanup. `removeAllSprites()` clears Sprite/Text objects only; explicitly remove tracked emitters, ropes, and tile layers. `SpriteSheet.unload()` and `Font.unload()` are permanent level-streaming operations, not cache eviction.
- Check [references/roadmap.md](references/roadmap.md) before naming an API that merely exists in another engine.

## Source priority

When sources disagree, use this order:

1. Android and iOS native proxy/engine code for actual behavior and parity.
2. `example/*.js` for combinations exercised by the module, not code-quality conventions.
3. Upstream `README.md` and `tutorial.md` for intended public usage.
4. Upstream `TODO.md` for what remains partial or absent.

The reviewed launcher has **35 demos**: 34 mobile touch scenes plus
Configurable Input on Mac. Helpers and layout/focus behavior are cataloged in
[references/examples.md](references/examples.md). Source inspection and host
regressions do not certify installed binaries or physical-device behavior.

Current damping lets effective unopposed acceleration build speed from rest, and a zero-delta rope update
freezes its initialized geometry. Older `3bea2f4` behavior is historical; read
[references/physics.md](references/physics.md) for the current equations,
remaining step-size limits and regression boundaries. Input focus and Mac
right/middle mouse limitations belong in [references/input.md](references/input.md).

## Before returning code

- Confirm the installed module build exposes every API used; the manifest version alone is insufficient.
- Keep per-frame work native and JS event-driven.
- Prefer a demo-backed combination, then refactor it into focused, maintainable code.
- Preserve Android/iOS parity; do not rely on an Android-only permissive argument shape.
- State partial engine behavior honestly, especially slopes, tile triggers/raycast, parenting, audio polish, and input devices.
- Cite the references that support the result.
