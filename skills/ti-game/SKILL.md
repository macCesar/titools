---
name: ti-game
description: "Use when building or reviewing 2D games with the ti.game module for Titanium SDK (Android/iOS) — sprites, sheets, animations, tweens, physics (gravity, gravityX, solids, solidMode, linearDamping, carMode, thrust), collision groups, trigger zones, hitbox shapes (circle, rotatedRect), swept, raycast, paths, bitmap text, particles, ropes, camera, parallax, sound, drag & drop, multitouch, attachments. AUTO-DETECT: if tiapp.xml declares ti.game or any file calls require('ti.game'), invoke BEFORE writing ANY game code. Also trigger on: game, juego, spritesheet, platformer, endless runner, top-down, shooter, racer, flappy, breakout, rhythm, cards, puzzle, hitbox, attachTo, slope, ramp, pool, plinko, bounce, friction, pathfinding, maze, patrol, HUD, score, game loop, GameView. ti.game is NOT Phaser, Godot or Box2D: you never write a game loop nor move a sprite from setInterval, and features like tilemaps, parent/child transforms and gamepads do not exist yet — check references/roadmap.md before inventing an API."
argument-hint: "[genre or feature]"
allowed-tools: Read, Grep, Glob, Edit, Write, Bash(node *)
---

# ti.game — 2D game engine for Titanium SDK

`ti.game` is a native OpenGL ES 2.0 sprite engine exposed to JavaScript, written and maintained by **Michael Gangolf (m1ga)** — upstream is https://github.com/m1ga/ti.game. This skill tracks upstream `main` as of **2026-08-27**, manifest **`0.5.0`** (`ee69056`) — and that number has meant different things at different times. Under `0.3.0` the engine gained the text engine, `screenFixed`, `swept` collisions, `collisionend`, `followPath`, animation chaining, `raycast`, `findPath`, game-clock timers, `scrollFactor` parallax and the `multiply`/`screen` blend modes, so anything still calling itself 0.3.0 has none of them. Under `0.4.0` it gained per-axis hitboxes, text word wrap, `unload()` on sheets and fonts, the LiveView renderer lifecycle (2026-08-23), then `attachTo`/`detach`, inherited opacity on attachments and named/percentage values (2026-08-26). `0.5.0` is the first bump that carries a feature set of its own: shape-aware solids and lightweight circle physics — `hitboxShape: 'rotatedRect'`, circular solids, `solidMode`, `gravityX`, `linearDamping` and two-sided `restitution`. Date the build rather than trusting the version. When upstream and any fork disagree, upstream wins. Same JS API on Android and iOS — the iOS side is a class-per-class Obj-C twin of the Android engine.

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
| Scrolling background under a fixed camera | timer repositioning copies | `wrapX` / `wrapShift` + `velocityX` |
| Parallax layers under a moving camera | hand-scrolled layers | `scrollFactor` on each layer |
| Camera that follows the player | timer writing `cameraX` | `gameView.follow(sprite, options)` |
| A score, a title, a label | `Ti.UI.Label` overlays | `Game.createText({ text, screenFixed: true })` |
| A name tag, health bar or turret that rides a sprite | a timer copying `owner.x`/`y` onto it | `tag.attachTo(owner, { offsetY: -40 })` |
| A dialog box that fits the screen | breaking the lines with `\n` after measuring in JS | `maxWidth` on the text sprite |
| A bullet fast enough to skip past a thin wall | shrinking the time step | `swept: true` on the bullet |
| To know the player *left* a zone | polling on a timer | the `collisionend` event |
| An enemy on a fixed patrol route | chained `animate()` legs | `sprite.followPath(points, { loop })` |
| Play an attack, then go back to idle | an `animationcomplete` handler | `play('attack', { then: 'idle' })` |
| Line of sight, a ledge probe, a hitscan shot | an invisible probe sprite | `gameView.raycast(x0, y0, x1, y1, ['group'])` |
| Walking around obstacles to a tapped point | your own A* in JS, or a straight line through the wall | `gameView.findPath(from, to, opts)` → `sprite.followPath(path)` |
| A spawn wave or an AI tick that respects pause | `setInterval` | `gameView.every(ms, cb)` |
| Smoke, sparks, explosions | pooled sprites in JS | `Game.createEmitter(...)` |
| A swinging chain or cape | verlet solver in JS | `Game.createRope(...)` |
| A tilted ramp a crate slides down | a staircase of small rectangles | `rotation` + `hitboxShape: 'rotatedRect'` on the ramp |
| A round post or peg that deflects | a box solid and a JS correction | `hitboxShape: 'circle'` on the **solid**, not just on the ball |
| Balls that knock each other around | separating pairs by hand in a loop | `solidMode: 'push'` on both, each listing the other's group |
| A drum, bowl or cage holding balls in | a ring of wall sprites around the rim | one circle solid with `solidMode: 'contain'` |
| A ball that rolls to a stop | decrementing `velocityX` on a timer | `linearDamping` |
| Wind, or a conveyor pull | `velocityX -= k` every tick | `gravityX` |
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
| Bouncing body | `restitution` (0..1) on **either** side of the contact, on top of `solidWith` | Balls, pinball, breakout |
| Rolling body | `hitboxShape: 'circle'` + `linearDamping`, and `solidMode: 'push'` when they hit each other | Pool, plinko, a bingo drum |
| Car | `carMode: true`, `throttle`, `steering` (-1..1) | Top-down racer with emergent drift |
| Newtonian flight | `thrust` (px/s² along heading), `angularVelocity` (deg/s), `maxSpeed` | Asteroids, lunar lander |
| Tween | `animate({ x, y, duration, easing })` | Point-and-click walking, UI cards, patrols |

Gravity is per sprite, not global — set it on each body that should fall. A sprite with no `gravity` and no velocity simply stays put.

## Block versus react: `solidWith` and `collidesWith` are independent

- `solidWith: ['ground']` **blocks** movement against sprites tagged `collisionGroup: 'ground'`. The engine pushes the sprite out along the axis of least penetration, sets read-only `onGround` and fires `land`.
- `collidesWith: ['coin', 'enemy']` **reports** overlap. Fires `collision` once per overlap-enter and `collisionend` once on separation (both carry `group`, `other`, `x`, `y`). Nothing is blocked.

A sprite can use both — a player that stands on platforms (`solidWith`) and dies on spikes (`collidesWith`).

The enter/exit pair is the trigger lifecycle other engines call `OnTriggerEnter`/`Exit`: water that tints the hero while he is in it, a pressure plate holding a door open exactly while something rests on it. Removing or hiding the partner mid-contact also counts as separation, so a despawned object still closes its door. There is deliberately **no** per-frame "stay" event — keep that state in JS.

A fast mover can slip through a thin target between frames: it never overlaps on any single frame, so the discrete test misses. `swept: true` on the *mover* tests its movement as a path — `collision` fires for whatever the path crossed, and `solidWith` walls stop it at the impact point instead of letting it teleport through.

When the question is not "did we touch?" but "what is over there?", the answer is `gameView.raycast(x0, y0, x1, y1, ['group'])` — line of sight, a ledge probe ahead of a walker's feet, a hitscan shot. It returns `null` or the nearest hit (`{ x, y, distance, group, sprite, normal }`), needs nothing but a `collisionGroup` on the targets, and replaces the old trick of parking an invisible probe sprite where the ray would land. It is a discrete query: call it from a decision timer or a tap handler, never every frame.

And when the question is "how do I get over there?", `gameView.findPath(from, to, { cellSize, groups, clearance, bounds })` runs grid A* around the same tagged sprites and hands back waypoints for `followPath` — tap-to-walk that rounds a tree, a hound re-routing to the player on an 800 ms timer. Also discrete: the walk itself runs natively between queries, so pathfind on taps and AI ticks, never per frame. Pass `clearance` of about half the walker's width, since the route is a line for the sprite's **center**.

**A sprite with `width`/`height` but no `sheet` renders nothing and works as an invisible trigger.** Score zones, goals, checkpoints, ceilings, kill floors and walls are all built this way in the official demos. This is the idiomatic way to add logic to a scene without art.

Tune fairness with `hitboxScale` (art rarely fills its frame; slightly small hitboxes feel better), `hitboxScaleX`/`hitboxScaleY` when the drawing fills its frame by a different fraction on each axis (a 20×44 hero in a 32×48 frame wants `0.62` wide and `0.92` tall — the two multiply `hitboxScale` rather than replace it), and `hitboxShape: 'circle'` for balls and rocks — circles also resolve against solids along the contact normal, so they bounce off corners diagonally instead of like a box. Since 2026-08-27 the **solid's** shape counts too: a `'circle'` on the post makes the normal run centre to centre, and `'rotatedRect'` keeps a tilted platform's box turned with its art instead of re-boxing it square to the screen — which is what lets a crate slide down a ramp rather than stand on an invisible ledge. Two more properties live on the solid: `solidMode: 'contain'` holds matched circles *inside* a circular boundary with no ring of wall sprites, and `solidMode: 'push'` makes a pair of circles bodies that split the separation and trade momentum. `'push'` needs both sides to agree — both circles, both `'push'`, and each listing the other's `collisionGroup` — or it silently degrades to one ball shoving an immovable one. Turn on `debug: true` per sprite, or on the GameView for everything, to see green collision AABBs, blue touch bounds and the orange anchor dot.

The hitbox shrinks **around the anchor**, which is why the anchor is half of that tuning and why both now have readable forms: `anchor: 'bottom'` with `hitboxScaleY: '55%'` is the same sprite as `anchorY: 1` with `hitboxScaleY: 0.55`, and says what it is doing. Every ratio the engine exposes takes a percentage string, and the anchors take names (`'left'`, `'bottom-right'`, `'center'`); numbers keep working untouched. [api.md](references/api.md) lists exactly which properties are ratios — coordinates, sizes, degrees and speeds are not, and neither is the car model's `grip`/`drag`.

## Performance rules that actually matter

- **One texture = one draw call.** The batcher accumulates up to 1000 quads and flushes on texture switch. A scene whose sprites all share one sheet renders in a single draw call regardless of sprite count. Pack art into as few sheets as possible; reuse one white particle texture and tint it at runtime.
- **Know what else breaks the batch**, since none of it is visible on screen: every blend-mode transition in draw order flushes — there are four (`'normal'`, `'add'`, `'multiply'`, `'screen'`), so group same-blend sprites into their own `zIndex` band and the frame switches a handful of times instead of constantly; each glowing sprite costs 2 extra draw calls per frame, plus 2 more while a `flash()` runs; ropes, skid marks and debug overlays always draw with normal blending, so interleaving them with non-normal content flushes too.
- **Bulk-add a level.** `gameView.add([spriteA, spriteB, emitter, rope])` crosses the bridge once and commits under one scene lock. Collect a level's objects in an array and add them in one call; `add(object)` still works for single objects.
- **Keep collision group lists targeted.** Cost is O(colliders × candidates) per frame. A bullet checking `['asteroid']` tests 5 sprites, not the whole scene.
- **Pool, don't create.** Bullets, notes, obstacles and enemies are created once (usually 3–10 of them), then recycled by setting `visible = false` and zeroing velocity. Creating sprites mid-game costs a bridge hop and a scene lock.
- **Read properties in handlers, not in loops.** `ball.x` is a synchronous snapshot of the live native value — perfect inside a `collision` handler or an 80 ms AI tick, wasteful in a tight loop.
- **`maxFps: 60`** on the GameView keeps 120 Hz ProMotion displays from doubling render work. `0` (default) follows the display refresh rate.
- **Judge performance on device.** The iOS Simulator's OpenGL translation layer is disproportionately slow and renders at a 1x drawable; real devices keep native screen scale and run far smoother.

## Text is a sprite

Text draws **inside** the scene: `Game.createText({ text: 'SCORE 0' })` returns a sprite made of glyph quads, so it z-sorts, tweens, tints, flashes, glows, wobbles on `idleAnimation` and takes `tap` events like any other sprite — a text button needs no overlay view. With no `font` it uses a pixel font embedded in the module (nothing to ship); `Game.createFont({...})` loads a BMFont/AngelCode atlas or a monospace grid image. There is no font size — scale the sprite, with integer values for crisp pixels.

```javascript
const score = Game.createText({ text: 'SCORE 0', screenFixed: true, x: W / 2, y: H * 0.08, scale: 3, zIndex: 100 });
gameView.add(score);
score.text = 'SCORE 10';   // re-lays out natively
```

One long string wraps itself: `maxWidth` breaks lines on word boundaries and re-wraps every time `text` changes, so a dialog box needs no hand-broken `\n`. It is measured in font-space px, *before* `scale` — divide the screen width you want by the scale you are drawing at.

`screenFixed: true` works on **any** sprite: `x`/`y` become surface coordinates and camera position, zoom and shake are ignored, while touch still maps back. That is the HUD pattern — the score stays put while the camera follows the player. Without it, text is world-space and scrolls past like scenery (signposts, floating damage numbers).

A label that belongs *on* a moving sprite is neither: `tag.attachTo(hero, { offsetY: -40 })` pins it natively, resolved every frame after physics and before collisions, so it never lags by a frame and needs no JS. It works on any sprite, not just text — health bars, shadows, an invisible hitbox on a body, and with `rotate: true` a turret whose offset swings with the tank. Removing the owner removes what is attached to it, and fading the owner fades them with it: position, rotation and opacity are inherited. Scale, visibility and tint are not — set those per sprite.

Overlaid `Ti.UI.Label` views still work and are still right for anything the engine cannot draw: native inputs, system fonts, accented text the built-in font lacks, scrollable menus. Just do not reach for them for a score any more.

Standard Titanium touch events do not reach the GameView, but ordinary Titanium buttons and views layered on top work normally, and sibling views receive simultaneous pointers — which is how the demos build multitouch d-pads (hold ▶ and press jump at the same time). One caveat from the demos: Android's `touchFeedback` ripple cannot animate over this canvas and spams `RippleDrawable` errors, so on-screen buttons set their own `backgroundColor` on `touchstart`/`touchend`.

## Clean up what you created

The render loop follows the activity lifecycle automatically, but **your JS timers and sounds do not**. Every demo that starts an interval or plays looping music stops it on window close. In Alloy, wire this into the controller's `cleanup()`.

Two things the engine now cleans up on its own, so do not hand-roll them: a **LiveView reload** retires the previous runtime's render loops, `SoundPool`, `MediaPlayer`s and audio proxies, so reloads stop stacking game loops; and releasing a sheet or font frees its GL texture. What you *can* now do explicitly is `spriteSheet.unload()` / `font.unload()` when streaming levels — permanent, so only after nothing draws from them.

Game-clock timers (`gameView.after` / `every`) are the exception that proves the rule: they run on the engine's clock, so they freeze at `timeScale: 0` and pause with the render loop instead of firing into a dead scene. That is why spawn waves and AI ticks belong there. A `setInterval` keeps running through a pause, which is right for a real-time countdown and wrong for everything else.

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
| Working code per genre: flappy, platformer, top-down, racer, asteroids, endless runner, rhythm, cards, point & click, particles, ropes, camera — plus patrol paths, raycast probes, pathfinding, parallax and game-clock timers | [recipes.md](references/recipes.md) |
| Install the module, tiapp.xml, Alloy vs Classic wiring, assets, sprite sheets, atlases, lifecycle, testing | [project-setup.md](references/project-setup.md) |
| What does NOT exist yet, what is coming, and how to work around it today | [roadmap.md](references/roadmap.md) |

When this skill runs out — a brand-new feature, a demo's exact code, a build question — read upstream itself at https://github.com/m1ga/ti.game. Each file there is authoritative for something different:

| Upstream file | What it is authoritative for |
| --- | --- |
| `README.md` | The module's own API documentation, and the demo index. Canonical, but it has lagged the code: verify a defaulted value against the source before relying on it |
| `example/` | 32 runnable demos, one per feature area — the reference implementations this skill's recipes are distilled from |
| `TODO.md` | What the maintainer has planned, with priorities. The source of [roadmap.md](references/roadmap.md) |
| `tutorial.md` | A step-by-step first scene (sprite, animation, tap-to-move). For a human learning the module, not for looking things up |
| `ios/README.md` | The iOS port's threading, coordinates and touch constants. Mostly for module developers; the app-facing facts are already here |
| `AGENTS.md` | Rules for changing the module itself — irrelevant to building a game with it |
| `android/src/ti/game/`, `ios/Classes/` | The truth. Defaults, clamping and edge cases in this skill were read here, not from prose |

## Before writing game code, check these

1. Is the level built inside a guarded `resize` handler, using `e.width`/`e.height`?
2. Does any timer move a sprite? Replace it with velocity, gravity, a tween, `carMode` or `thrust`.
3. Are all the level's objects added in one `gameView.add([...])` call?
4. Does every moving body have the right model — `solidWith` to be blocked, `collidesWith` to be notified?
5. Is `hitboxScale` set on sprites whose art does not fill the frame — with `hitboxScaleX`/`hitboxScaleY` when the fit differs per axis, and the `anchor` the box shrinks around named rather than left as a bare `1`?
6. Do triggers (scores, goals, kill zones) use sheet-less sprites instead of visible art?
7. Is every `createSound`, `setInterval` and `setTimeout` stopped when the window closes?
8. Is the HUD `Game.createText` with `screenFixed: true`, rather than a stack of overlaid labels?
9. Does anything travel far enough per frame to tunnel? Give it `swept: true`.
10. Does a timer drive game logic (spawn waves, AI ticks, respawns)? Move it to `gameView.every`/`after` so it obeys pause and slow motion.
11. Does anything ride on top of a moving sprite — a name tag, a health bar, a turret, a hitbox? `attachTo` pins it natively; a timer copying coordinates is the old workaround.
12. Is a solid's own **shape** doing the work, or is JS correcting for a box that is not what the art shows? A round post wants `hitboxShape: 'circle'` on itself; a tilted one wants `'rotatedRect'`.
13. Did anything get `restitution` on a *surface*? Every rider on it now bounces, and a hard landing on it stops setting `onGround` — check whatever gates jumps.
14. Are you using an API that actually exists? Anything involving tilemaps, full parent/child transforms, joysticks, gamepads, or the platformer *feel* on a slope (step-up, friction along the contact) — check [roadmap.md](references/roadmap.md) first.
