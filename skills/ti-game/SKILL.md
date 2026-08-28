---
name: ti-game
description: "Use when a Titanium app declares ti.game in tiapp.xml, imports require('ti.game'), or needs a 2D game built or reviewed with that native engine: sprites, native movement, collisions, tile layers, camera, HUD, audio, particles, or touch. Covers Alloy and Classic on Android/iOS. Do not use for unrelated game engines or ordinary Titanium UI."
allowed-tools: Read, Grep, Glob, Edit, Write, Bash(node *)
---

# ti.game — native 2D games for Titanium SDK

`ti.game` is Michael Gangolf's OpenGL ES 2.0 sprite engine for Titanium. JavaScript describes the scene and reacts to discrete events; Android and iOS run rendering, animation, physics, collision, gestures, audio, particles, ropes, tile layers, camera work, and telemetry natively.

This skill is verified against upstream `main` at **`c216e7f` (2026-08-28)**. Both manifests still say **`0.5.0`**, although important features landed after that version was introduced. Treat the commit or build date as the capability marker; feature-detect an installed build when the exact artifact is unknown.

The skill applies to **Classic and Alloy** projects. Nothing here requires PurgeTSS.

## Required workflow

Open the references relevant to the task before proposing code. Do not answer from familiarity with Phaser, Godot, Box2D, or an older `ti.game` build.

| Task | Read first |
| --- | --- |
| Exact methods, properties, defaults, event payloads, percentages | [references/api.md](references/api.md) |
| Install, Classic/Alloy structure, assets, cleanup, lifecycle | [references/project-setup.md](references/project-setup.md) |
| Choose a runnable upstream example | [references/examples.md](references/examples.md) |
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
3. Upstream `README.md` and `TUTORIAL.md` for intended public usage.
4. Upstream `TODO.md` for what remains partial or absent.

Known upstream prose drift at the pinned commit: the README says 26 demos although there are 33; its camera row names the wrong HUD corner; and it says every `TileLayer` property is live although Android treats `legend`, `firstGid`, `cols`, and `rows` as creation-time configuration. The references already normalize those differences. No demo exercises the wall-contact API yet, so its contract comes from the README and both native implementations.

## Before returning code

- Confirm the installed module build exposes every API used; the manifest version alone is insufficient.
- Keep per-frame work native and JS event-driven.
- Prefer a demo-backed combination, then refactor it into focused, maintainable code.
- Preserve Android/iOS parity; do not rely on an Android-only permissive argument shape.
- State partial engine behavior honestly, especially slopes, tile triggers/raycast, parenting, audio polish, and input devices.
- Cite the references that support the result.
