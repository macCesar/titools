---
name: ti-game
description: "Use when building or reviewing 2D games with the ti.game module for Titanium SDK (Android and iOS) — sprites, sprite sheets, frame animations, tweens, physics (gravity, solid platforms, carMode drifting, thrust), collision groups, particles, Verlet ropes, camera follow/zoom/shake, low-latency sound, drag & drop, multitouch. AUTO-DETECT: if tiapp.xml declares ti.game or any file calls require('ti.game'), invoke BEFORE writing ANY game code. Also trigger on: game, juego, sprite, spritesheet, platformer, endless runner, top-down, shooter, racer, flappy, breakout, rhythm game, card game, puzzle, collision, hitbox, parallax, particles, game loop, 60 fps, GameView. ti.game is NOT Phaser, Godot or Box2D: you never write a game loop, never move a sprite from setInterval, and several familiar features (bitmap text, tilemap layer, sprite parenting, raycast) do not exist yet — check references/roadmap.md before inventing an API."
argument-hint: "[genre or feature]"
allowed-tools: Read, Grep, Glob, Edit, Write, Bash(node *)
---

# ti.game — 2D game engine for Titanium SDK

`ti.game` is a native OpenGL ES 2.0 sprite engine exposed to JavaScript, written and maintained by **Michael Gangolf (m1ga)** — upstream is https://github.com/m1ga/ti.game. This skill was written against version 0.3.0 as it stands in the `macCesar/ti.game` contribution fork; when upstream and the fork disagree, upstream wins. Same JS API on Android and iOS — the iOS side is a class-per-class Obj-C twin of the Android engine.

Works in **both Classic and Alloy** projects. Nothing here depends on PurgeTSS.

## The one rule everything follows

**JS describes the scene and reacts to events. The engine runs every frame.**

The Kroll bridge (JS ↔ native) is far too slow for per-frame work, so the API is a *scene description*: setting `sprite.x`, `sprite.velocityY` or `car.throttle` writes a volatile field the render thread reads on the next tick. Events flow back only when something discrete happens — `tap`, `collision`, `land`, `complete`. Nothing fires per frame by design.

The practical consequence, and the single biggest mistake to avoid:

> If you are about to move a sprite from a `setInterval` or a `requestAnimationFrame`, stop and find the native property that does it. Coarse timers for *decisions* (an AI picking a direction every 80–150 ms, an autofire cadence, a spawn schedule) are fine and the official demos use them. Timers for *motion* are not.

| You want | Do NOT write | Use |
| --- | --- | --- |
| A sprite that falls | `setInterval(() => s.y += 5)` | `s.gravity = 2000` |
| A sprite that moves at constant speed | timer updating `x` | `s.velocityX = 300` |
| Move from A to B over time | manual easing loop | `s.animate({ x, y, duration, easing })` |
| A car that drives and drifts | your own physics | `carMode: true` + `throttle`/`steering` |
| A ship with inertia | vector math per frame | `thrust` + `angularVelocity` |
| Drag a sprite with the finger | `touchmove` handler | `draggable: true` |
| Scrolling background | timer repositioning copies | `wrapX` / `wrapShift` + `velocityX` |
| Camera that follows the player | timer writing `cameraX` | `gameView.follow(sprite, options)` |
| Smoke, sparks, explosions | pooled sprites in JS | `Game.createEmitter(...)` |
| A swinging chain or cape | verlet solver in JS | `Game.createRope(...)` |
| Slow motion or a pause that still draws | pausing your own timers | `gameView.timeScale = 0.5` / `0` |

## Minimal scene

```javascript
const Game = require('ti.game');

const win = Ti.UI.createWindow({
	backgroundColor: '#000',
	navBarHidden: true,                           // iOS: no nav bar
	theme: 'Theme.Titanium.DayNight.NoTitleBar'   // Android: no title bar
});
const gameView = Game.createGameView({ backgroundColor: '#8ed8f8' });

const sheet = Game.createSpriteSheet({
	image: 'assets/hero.png',
	frameWidth: 32,
	frameHeight: 48,
	smoothing: false            // nearest-neighbor — crisp pixel art
});

let initialized = false;
gameView.addEventListener('resize', (e) => {
	if (initialized) {
		return;
	}
	initialized = true;
	buildLevel(e.width, e.height);
});

function buildLevel(W, H) {
	const hero = Game.createSprite({
		sheet: sheet,
		x: W / 2,
		y: H / 2,
		width: 96,
		height: 144,
		animations: {
			idle: { frames: [0], fps: 1, loop: true },
			walk: { frames: [1, 2], fps: 6, loop: true }
		}
	});
	hero.play('idle');
	gameView.add(hero);
}

win.add(gameView);
win.open();
```

### Build the level on `resize`, never from `displayCaps`

`Ti.Platform.displayCaps` includes the system bars and reports **points** on iOS, while the scene lives in surface **pixels**. Sizing a level from it puts bottom-anchored sprites below the visible area. The GameView fires `resize` with the real surface size — that is the coordinate space. The guard flag matters: `resize` fires again on rotation and on some lifecycle transitions, and rebuilding the level there would duplicate every sprite.

When you genuinely need dp→scene units (to keep a floor above 80dp on-screen buttons), measure the surface rather than trusting the density factor, because the iOS Simulator renders at 1x while still reporting the device scale:

```javascript
const density = Ti.Platform.osname === 'android'
	? Ti.Platform.displayCaps.logicalDensityFactor
	: H / Ti.Platform.displayCaps.platformHeight;
const buttonZone = Math.round(130 * density);
const groundTop = H - buttonZone;
```

### Coordinates

Top-left origin, y-down, surface pixels. Touch coordinates map 1:1. `(x, y)` is the sprite's **anchor** (default `0.5/0.5` = center, so `y` is the middle of the sprite, not its top). Rotation in degrees, positive clockwise. All JS durations are milliseconds.

## Pick a movement model

| Model | Properties | Fits |
| --- | --- | --- |
| Plain velocity | `velocityX/Y` (px/s), `gravity` (px/s²) | Flappy, projectiles, falling objects, notes |
| Platformer | velocity + `solidWith`, read-only `onGround`, `land` event | Mario-style run & jump |
| Bouncing body | `restitution` (0..1) on top of `solidWith` | Balls, pinball, breakout |
| Car | `carMode: true`, `throttle`, `steering` (-1..1) | Top-down racer with emergent drift |
| Newtonian flight | `thrust` (px/s² along heading), `angularVelocity` (deg/s), `maxSpeed` | Asteroids, lunar lander |
| Tween | `animate({ x, y, duration, easing })` | Point-and-click walking, UI cards, patrols |

Gravity is per sprite, not global — set it on each body that should fall. A sprite with no `gravity` and no velocity simply stays put.

## Block versus react: `solidWith` and `collidesWith` are independent

- `solidWith: ['ground']` **blocks** movement against sprites tagged `collisionGroup: 'ground'`. The engine pushes the sprite out along the axis of least penetration, sets read-only `onGround` and fires `land`.
- `collidesWith: ['coin', 'enemy']` **reports** overlap. Fires `collision` once per overlap-enter (payload `group`, `other`, `x`, `y`), re-arming after separation. Nothing is blocked.

A sprite can use both — a player that stands on platforms (`solidWith`) and dies on spikes (`collidesWith`).

**A sprite with `width`/`height` but no `sheet` renders nothing and works as an invisible trigger.** Score zones, goals, checkpoints, ceilings, kill floors and walls are all built this way in the official demos. This is the idiomatic way to add logic to a scene without art.

Tune fairness with `hitboxScale` (art rarely fills its frame; slightly small hitboxes feel better) and `hitboxShape: 'circle'` for balls and rocks — circles also resolve against solids along the contact normal, so they bounce off corners diagonally instead of like a box. Turn on `debug: true` per sprite, or on the GameView for everything, to see green collision AABBs, blue touch bounds and the orange anchor dot.

## Performance rules that actually matter

- **One texture = one draw call.** The batcher accumulates up to 1000 quads and flushes on texture switch. A scene whose sprites all share one sheet renders in a single draw call regardless of sprite count. Pack art into as few sheets as possible; reuse one white particle texture and tint it at runtime.
- **Bulk-add a level.** `gameView.add([spriteA, spriteB, emitter, rope])` crosses the bridge once and commits under one scene lock. Collect a level's objects in an array and add them in one call; `add(object)` still works for single objects.
- **Keep collision group lists targeted.** Cost is O(colliders × candidates) per frame. A bullet checking `['asteroid']` tests 5 sprites, not the whole scene.
- **Pool, don't create.** Bullets, notes, obstacles and enemies are created once (usually 3–10 of them), then recycled by setting `visible = false` and zeroing velocity. Creating sprites mid-game costs a bridge hop and a scene lock.
- **Read properties in handlers, not in loops.** `ball.x` is a synchronous snapshot of the live native value — perfect inside a `collision` handler or an 80 ms AI tick, wasteful in a tight loop.
- **`maxFps: 60`** on the GameView keeps 120 Hz ProMotion displays from doubling render work. `0` (default) follows the display refresh rate.
- **Judge performance on device.** The iOS Simulator's OpenGL translation layer is disproportionately slow and renders at a 1x drawable; real devices keep native screen scale and run far smoother.

## There is no text in the engine

The engine draws sprites, particles and ropes — **not text**. HUDs, scores and labels are ordinary `Ti.UI.Label` views overlaid on the window, on top of the GameView. That is how every official demo does it. Consequences worth knowing before designing a HUD: overlaid Titanium views are screen-fixed, so they do not scroll with the camera, do not z-sort against sprites and cannot be tweened by the engine. Bitmap-font text sprites are planned but do not exist — see [roadmap.md](references/roadmap.md).

Standard Titanium touch events do not reach the GameView, but ordinary Titanium buttons and views layered on top work normally, and sibling views receive simultaneous pointers — which is how the demos build multitouch d-pads (hold ▶ and press jump at the same time). One caveat from the demos: Android's `touchFeedback` ripple cannot animate over this canvas and spams `RippleDrawable` errors, so on-screen buttons set their own `backgroundColor` on `touchstart`/`touchend`.

## Clean up what you created

The render loop follows the activity lifecycle automatically, but **your timers and sounds do not**. Every demo that starts an interval or plays looping music stops it on window close. In Alloy, wire this into the controller's `cleanup()`.

```javascript
win.addEventListener('close', () => {
	clearInterval(aiTimer);
	clearTimeout(spawnTimer);
	music.stop();          // a looping track outlives the window otherwise
	gameView.pause();
	gameView.removeAllSprites();
});
```

## Reference files

Read the one that matches the task instead of guessing — the API surface below was verified against the module source, not reconstructed from memory.

| Need | Reference |
| --- | --- |
| Exact properties, methods, events, defaults for every object | [api.md](references/api.md) |
| Working code per genre: flappy, platformer, top-down, racer, asteroids, endless runner, rhythm, cards, point & click, particles, ropes, camera | [recipes.md](references/recipes.md) |
| Install the module, tiapp.xml, Alloy vs Classic wiring, assets, sprite sheets, atlases, lifecycle, testing | [project-setup.md](references/project-setup.md) |
| What does NOT exist yet, what is coming, and how to work around it today | [roadmap.md](references/roadmap.md) |

## Before writing game code, check these

1. Is the level built inside a guarded `resize` handler, using `e.width`/`e.height`?
2. Does any timer move a sprite? Replace it with velocity, gravity, a tween, `carMode` or `thrust`.
3. Are all the level's objects added in one `gameView.add([...])` call?
4. Does every moving body have the right model — `solidWith` to be blocked, `collidesWith` to be notified?
5. Is `hitboxScale` set on sprites whose art does not fill the frame?
6. Do triggers (scores, goals, kill zones) use sheet-less sprites instead of visible art?
7. Is every `createSound`, `setInterval` and `setTimeout` stopped when the window closes?
8. Is the HUD a `Ti.UI.Label` overlay, not an imagined engine text API?
9. Are you using an API that actually exists? Anything involving text, tilemaps, sprite parenting, raycasting, joysticks or `blend: 'multiply'` — check [roadmap.md](references/roadmap.md) first.
