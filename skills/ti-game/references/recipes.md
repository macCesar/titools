# ti.game recipes by genre

Working patterns distilled from the 26 official demos in `example/` and from a shipped Alloy game (Titanium Lander). Each recipe shows the part that is specific to the genre; the shared scaffolding is in [The scaffolding](#the-scaffolding) and is not repeated.

Every snippet uses only API that exists in upstream `main` at `df66122`, 2026-08-23 (manifest `0.4.0`, unchanged since 2026-08-20 — the version number stopped tracking the code). Check [roadmap.md](roadmap.md) before reaching for anything not shown here.

## Contents

- [The 26 demos, and what each one is the reference for](#the-26-demos-and-what-each-one-is-the-reference-for)
- [The scaffolding](#the-scaffolding)
- [Cross-cutting patterns](#cross-cutting-patterns) — pooling, freeing textures, parallax, multitouch controls, HUD text, wrapped dialog, invisible triggers, seeing the hitbox, enter/exit zones, patrol routes, line of sight, pathfinding, game-clock timers, hit-stop
- [Tap-to-flap](#tap-to-flap) (`flappy.js`)
- [Platformer](#platformer) (`platformer.js`)
- [Top-down / Zelda](#top-down--zelda) (`topdown.js`)
- [Top-down racer](#top-down-racer) (`racing.js`)
- [Asteroids / space shooter](#asteroids--space-shooter) (`asteroids.js`)
- [Lunar lander](#lunar-lander)
- [Endless runner](#endless-runner) (`skate.js`)
- [Rhythm game](#rhythm-game) (`rhythm.js`)
- [Ball sports / breakout physics](#ball-sports--breakout-physics) (`volley.js`)
- [Cards and board games](#cards-and-board-games) (`cards.js`, `puzzle.js`)
- [Point & click adventure](#point--click-adventure) (`pointclick.js`, `maze.js`)
- [Particles](#particles) (`particles.js`)
- [Ropes and chains](#ropes-and-chains) (`rope.js`)
- [Camera work](#camera-work) (`camera.js`)
- [Visual effects](#visual-effects) (`blend.js`, `flip.js`, `timescale.js`, `demoscene.js`)

## The 26 demos, and what each one is the reference for

`example/` is the module's real documentation: every demo is a runnable app, and upstream keeps them current with the engine. When a recipe here is not enough, open the demo — it compiles today.

| Demo | The reference implementation of | Covered here |
| --- | --- | --- |
| `basic.js` | Sheets, animations, drag/pinch/rotate, tween chaining | [The scaffolding](#the-scaffolding) |
| `puzzle.js` | Drag & drop with snapping, press-to-lift, one piece per finger | [Cards and board games](#cards-and-board-games) |
| `flappy.js` | Gravity + tap impulse, score zones, wrapping parallax | [Tap-to-flap](#tap-to-flap) |
| `platformer.js` | `solidWith`, `land`, `oneWay` stairs, a moving platform that carries you, d-pad | [Platformer](#platformer) |
| `volley.js` | `restitution`, JS hit response, an AI timer | [Ball sports / breakout physics](#ball-sports--breakout-physics) |
| `racing.js` | `carMode` drift, skid marks, lap and checkpoint logic | [Top-down racer](#top-down-racer) |
| `cards.js` | Deck dealing, fanned hand, selection tweens, idle wobble | [Cards and board games](#cards-and-board-games) |
| `asteroids.js` | `thrust`/`angularVelocity`, `wrapAround`, bullet pooling, additive bolts | [Asteroids / space shooter](#asteroids--space-shooter) |
| `topdown.js` | Tile map from a string array, `ySort` depth, follower NPC | [Top-down / Zelda](#top-down--zelda) |
| `skate.js` | Endless runner: pooled obstacles, jump button, pixel-art parallax | [Endless runner](#endless-runner) |
| `pointclick.js` | Tap-to-walk with `findPath` + `followPath`, verb coin, hotspots | [Point & click adventure](#point--click-adventure) |
| `particles.js` | Fountain, tap bursts, a smoke trail following a dragged sprite | [Particles](#particles) |
| `rhythm.js` | Pooled notes on native velocity, `press` pads, timing windows | [Rhythm game](#rhythm-game) |
| `camera.js` | Dead-zone follow, `cameraBounds`, zoom, shake, `cameraEffect`, `scrollFactor` | [Camera work](#camera-work) |
| `rope.js` | Verlet ropes from a dragged head and from a fixed anchor | [Ropes and chains](#ropes-and-chains) |
| `flip.js` | `flipX`/`flipY` driven by movement; tap inverts gravity | [Visual effects](#visual-effects) |
| `hitbox.js` | `debug: true` overlays, and why the per-axis hitbox scales exist | [Seeing the hitbox](#seeing-the-hitbox--hitboxjs) |
| `blend.js` | The four blend modes side by side, `flash()` variants | [Visual effects](#visual-effects) |
| `text.js` | Screen-fixed HUD, world-space labels, text buttons, wrapped dialog | [HUD](#hud--textjs-flappyjs) |
| `swept.js` | `swept: true` vs tunneling, same bullets, rising speed | [Object pooling](#object-pooling) |
| `path.js` | Smoothed circuits, sharp patrols, `play(name, { then })` chains | [Patrol routes and animation chains](#patrol-routes-and-animation-chains--pathjs) |
| `raycast.js` | Line of sight, ledge probes, tap-fired hitscan | [Line of sight, ledge probes and hitscan](#line-of-sight-ledge-probes-and-hitscan--raycastjs) |
| `zones.js` | The `collision`/`collisionend` lifecycle, including despawned partners | [Zones you can be inside of](#zones-you-can-be-inside-of-enter--exit--zonesjs) |
| `demoscene.js` | Sine scrollers and copper bars built from `followPath` circles | [Visual effects](#visual-effects) |
| `maze.js` | A* over a tile maze, `simplify: false` route visualization, a re-pathing hound | [Pathfinding around obstacles](#pathfinding-around-obstacles--mazejs-pointclickjs) |
| `timescale.js` | `timeScale` slow motion and freeze; game clock vs `setInterval` | [Timers on the game clock](#timers-on-the-game-clock) |

## The scaffolding

Every game repeats this shape. Sheets and sounds are created once, outside `resize`, because they are texture handles, not scene objects.

```javascript
const Game = require('ti.game');

module.exports = function () {

	const win = Ti.UI.createWindow({
		backgroundColor: '#000',
		theme: 'Theme.Titanium.DayNight.NoTitleBar'
	});
	const gameView = Game.createGameView({
		backgroundColor: '#8ed8f8',
		maxFps: 60
		// debug: true   // draw every collision shape while tuning hitboxes
	});

	const heroSheet = Game.createSpriteSheet({ image: 'assets/hero.png', frameWidth: 64, frameHeight: 64 });
	const jumpSound = Game.createSound({ url: 'assets/jump.wav', volume: 0.8 });

	let timer = null;
	win.addEventListener('close', () => {
		if (timer !== null) {
			clearInterval(timer);
			timer = null;
		}
	});

	let initialized = false;
	gameView.addEventListener('resize', (e) => {
		if (initialized) {
			return;
		}
		initialized = true;
		init(e.width, e.height);
	});

	function init(W, H) {
		// The whole game lives here. Derive every size from W and H so the
		// layout holds on any screen: SPEED = W * 0.35, GRAVITY = H * 2.2.
	}

	win.add(gameView);
	win.open();
};
```

Sizing everything as a fraction of `W`/`H` is not cosmetic — a jump tuned in absolute pixels becomes unplayable on a different device. The demos consistently express speeds as `W * f`, accelerations as `H * f` and sprite sizes as `Math.min(W, H) * f`.

## Cross-cutting patterns

### Object pooling

Create a fixed set once, recycle forever. `visible = false` also removes the sprite from collision, which is what makes this work.

```javascript
const bullets = [];
for (let i = 0; i < 10; i++) {
	const sprite = Game.createSprite({
		sheet: shipSheet,
		frame: 3,
		width: 8,
		height: 16,
		visible: false,
		wrapAround: true,
		swept: true,                   // path-tested: a fast bolt cannot skip past a rock
		collidesWith: ['asteroid']
	});
	const state = { sprite: sprite, active: false, generation: 0 };

	sprite.addEventListener('collision', (e) => {
		if (!state.active) {
			return;
		}
		deactivate(state);
		e.other.visible = false;       // the rock is gone: no render, no collision
	});

	gameView.add(sprite);
	bullets.push(state);
}

function deactivate(state) {
	state.active = false;
	state.sprite.visible = false;
	state.sprite.velocityX = 0;
	state.sprite.velocityY = 0;
}

function fire(x, y, vx, vy) {
	const state = bullets.find((b) => !b.active);
	if (!state) {
		return;                        // pool exhausted — drop the shot
	}
	state.active = true;
	state.generation++;
	const generation = state.generation;
	Object.assign(state.sprite, { x: x, y: y, velocityX: vx, velocityY: vy, visible: true });
	setTimeout(() => {
		// burn out — unless this slot was already recycled by a newer shot
		if (state.active && state.generation === generation) {
			deactivate(state);
		}
	}, 1200);
}
```

The `generation` counter matters: without it, a timeout fired for an old shot deactivates the *new* bullet occupying that slot.

`swept: true` (compared side by side in `swept.js`) is what keeps a fast bolt from crossing a rock between two frames without ever overlapping it. The asteroids demo predates it and inflates the hitbox instead (`hitboxScale: 1.4`) — that works, at the price of counting near misses as hits. Prefer `swept`, and reserve `hitboxScale` — with `hitboxScaleX`/`hitboxScaleY` when the art's fit differs per axis — for fairness tuning.

Recycling a sprite with `visible = false` fires `collisionend` on anything it was touching. Handlers that treat separation as "the player walked away" need to tolerate a despawn.

### Freeing a level's textures

Pooling recycles sprites; it does not free the **texture** behind them. A game that streams worlds accumulates every atlas it has ever loaded until the GL context dies. `unload()` releases one on the next rendered frame.

```javascript
function unloadLevel(level) {
	level.sprites.forEach((s) => gameView.remove(s));
	level.sheets.forEach((sheet) => sheet.unload());   // only once nothing draws from them
}
```

It is permanent — not an eviction that reloads on demand. A sprite still pointing at an unloaded sheet stops drawing, silently. A single-level game should not call it: the textures die with the window.

### Parallax

Two ways, and the choice is decided by whether the **camera** moves or the **world** does.

**A camera travelling through a static world** — platformer, top-down, anything using `follow()` — wants `scrollFactor`, one property per layer:

```javascript
const clouds = Game.createSprite({ sheet: cloudSheet, x: W / 2, y: 120, zIndex: 0, scrollFactor: 0.25 });
const hills  = Game.createSprite({ sheet: hillSheet,  x: W / 2, y: 260, zIndex: 1, scrollFactor: 0.6 });
const sun    = Game.createSprite({ sheet: sunSheet,   x: 60,    y: 60,  zIndex: 0, scrollFactor: 0 });
```

`0` pins the sun to the view while still zooming with `cameraScale` — that is the difference from `screenFixed`, which ignores zoom as well. Values above `1` overtake the camera for foreground grass. The sprite's `x`/`y` never change: `scrollFactor` shifts where it is *drawn* and maps touch back to match, so collisions still happen at the world coordinates you wrote.

**A world scrolling under a fixed camera** — endless runner, flappy — cannot use `scrollFactor`, because the camera never travels. Two screen-wide copies per layer, scrolled by native velocity; `wrapX`/`wrapShift` teleport a copy that left the screen back behind its sibling. No JS runs in the loop.

```javascript
function makeLayer(sheet, y, height, speed, z) {
	const copies = [];
	for (let i = 0; i < 2; i++) {
		const s = Game.createSprite({
			sheet: sheet,
			x: W / 2 + i * W,
			y: y,
			width: W,
			height: height,
			zIndex: z,
			tileRepeat: 'x',           // keeps texture density; needs repeat: true on the sheet
			wrapX: -W / 2,
			wrapShift: 2 * W
		});
		gameView.add(s);
		copies.push(s);
	}
	return {
		setSpeed: (v) => copies.forEach((copy) => {
			copy.velocityX = -v;
		})
	};
}

const skyline = makeLayer(skylineSheet, groundTop - SKY_H / 2, SKY_H, SPEED * 0.12, 1);
const street = makeLayer(streetSheet, (groundTop + H) / 2, H - groundTop, SPEED, 8);
```

Slower layers read as further away. Three layers (clouds at 0.15×, hills at 0.4×, ground at 1×) is the flappy demo's recipe. `camera.js` demos the other half: `scrollFactor` cloud shadows at 1.35× and a `scrollFactor: 0` sun.

### Multitouch on-screen controls

Each button must be **its own Titanium view** — sibling views receive simultaneous pointers, so holding a direction while pressing jump works. A single container splitting touches itself does not.

```javascript
function makeButton(title, position, fontSize) {
	const button = Ti.UI.createLabel({
		text: title,
		textAlign: 'center',
		color: '#fff',
		font: { fontSize: fontSize || 30, fontWeight: 'bold' },
		backgroundColor: '#59000000',
		borderRadius: 40,
		width: '80dp',
		height: '80dp',
		bottom: '24dp'
	});
	// Manual press feedback: touchFeedback's ripple cannot animate over this
	// canvas and spams RippleDrawable errors on Android.
	button.addEventListener('touchstart', () => {
		button.backgroundColor = '#8c000000';
	});
	['touchend', 'touchcancel'].forEach((event) => {
		button.addEventListener(event, () => {
			button.backgroundColor = '#59000000';
		});
	});
	Object.assign(button, position);
	return button;
}

function bindHold(button, apply, release) {
	button.addEventListener('touchstart', apply);
	['touchend', 'touchcancel'].forEach((event) => {
		button.addEventListener(event, release);
	});
}

const leftButton = makeButton('◀', { left: '24dp' });
bindHold(leftButton, () => {
	car.steering = -1;
}, () => {
	if (car.steering === -1) {   // don't cancel the other button's input
		car.steering = 0;
	}
});
```

The guard in the release handler is what keeps two opposite buttons from fighting: releasing left only zeroes steering if left is still the active direction.

### HUD — `text.js`, `flappy.js`

Text sprites with `screenFixed: true`. They live in the scene — one batch, no overlay views — but ignore the camera, so a score stays in the corner while the world scrolls under it.

```javascript
// Created outside resize (no size known yet), positioned once it is
const scoreLabel = Game.createText({ text: '0', screenFixed: true, zIndex: 100 });
const statusLabel = Game.createText({ text: 'Tap to start!', screenFixed: true, zIndex: 100 });

function buildLevel(W, H) {
	const TEXT_SCALE = Math.max(1, Math.round(W / 240));   // integer: crisp pixels
	Object.assign(scoreLabel, { scale: TEXT_SCALE, x: W / 2, y: H * 0.08 });
	Object.assign(statusLabel, { scale: TEXT_SCALE, x: W / 2, y: H * 0.45 });
	gameView.add([scoreLabel, statusLabel]);
	// ...
}

function score() {
	points += 1;
	scoreLabel.text = points + ' / ' + GATE_COUNT;
	scoreLabel.flash('#4dff88', 250);                      // text flashes like any sprite
}
```

Scaling from `W` is what replaces `fontSize`: a bitmap font has one native size, and an integer multiplier is the only way to keep texels square. `Math.max(1, ...)` guards the smallest screens.

Because a label is a sprite, the HUD gets the whole toolbox for free — `animate()` to pop a score on change, `tintColor` per state, `glowColor` on a title, `idleAnimation` for a gentle wobble, and `tap` handlers so a `[ RESET ]` label works as a button with no Titanium view behind it.

Drop `screenFixed` and the same label becomes world furniture: signposts, floating damage numbers, a name over an NPC — it scrolls with everything else.

A dialog box is one long string with `maxWidth`: the engine breaks the lines on word boundaries and re-wraps every time `text` is written, so the source keeps no hand-placed `\n`.

```javascript
const UNIT = Math.max(1, Math.round(W / 240));
const dialog = Game.createText({
	text: 'TAP FOR POND WISDOM',
	maxWidth: Math.round(W * 0.55 / UNIT),   // font-space px: divide by the scale
	align: 'center',
	lineSpacing: 1.3,
	scale: UNIT,
	x: W / 2,
	y: H * 0.78,
	zIndex: 3
});
dialog.addEventListener('tap', () => {
	dialog.text = lines[i++ % lines.length];   // re-wraps natively
	dialog.flash('#fff', 150);
});
```

`maxWidth` is measured before `scale`, which is the only trap here — pass screen pixels straight in and the block comes out `scale` times too wide. `align` positions the lines against each other (the block's own width), not inside the wrap column, so anchor the sprite where the text should sit. A word longer than `maxWidth` overflows instead of breaking mid-word.

Overlaid `Ti.UI.Label` views remain the answer for text the engine's font cannot draw (accents, system fonts, right-to-left) and for real UI: menus, dialogs, text inputs.

### Invisible triggers

A sprite with `width`/`height` and no `sheet` renders nothing but still collides. This is how scores, goals, ceilings, kill floors, walls and checkpoints are built.

```javascript
// score zone in the gap between two pipes
gameView.add(Game.createSprite({ x: gateX, y: gapCenter, width: 20, height: GAP, collisionGroup: 'score' }));

// invisible ceiling so the player cannot escape upward
gameView.add(Game.createSprite({ x: W / 2, y: -20, width: W * 3, height: 40, collisionGroup: 'ceiling' }));

// side walls
[-20, W + 20].forEach((x) => {
	gameView.add(Game.createSprite({ x: x, y: H / 2, width: 40, height: H * 3, collisionGroup: 'wall' }));
});
```

Attach your own metadata to a sprite and read it back from `e.other` in the handler:

```javascript
const zone = Game.createSprite({ x: cp.x, y: cp.y, width: cp.w, height: cp.h, collisionGroup: 'checkpoint' });
zone.cpIndex = index;

car.addEventListener('collision', (e) => {
	if (e.group === 'checkpoint') {
		visited[e.other.cpIndex] = true;
	}
});
```

### Seeing the hitbox — `hitbox.js`

`debug: true` on the GameView is the whole tuning workflow, and the demo exists to make the overlays legible: two identical adventurers walk into the same wall, one untuned and one with `hitboxScaleX: 0.62` / `hitboxScaleY: 0.92`. The untuned one stops a body's width short and hovers above the floor on his frame's padding; the tuned one goes flush and lands his feet. Tapping toggles the tuning live, so the green box snaps between frame and drawing.

```javascript
const gameView = Game.createGameView({ debug: true });   // green = collision AABB, blue = drawn frame, orange = anchor

hero.hitboxScaleX = 0.62;   // both are live: write them and watch the box move
hero.hitboxScaleY = 0.92;
```

Read the two boxes as a pair: green is what collides, blue is what draws **and what takes taps**. Green much smaller than blue on one axis only is exactly the case the per-axis scales exist for; green and blue identical on a sprite whose art has padding is the bug the demo dramatizes.

### Zones you can be inside of (enter / exit) — `zones.js`

`collision` and `collisionend` are the two halves of a trigger: entering water, standing on a pressure plate, holding a capture point. Nothing fires while you stay inside — the state lives in JS between the two events, and that is deliberate, since a per-frame "stay" would be bridge traffic every frame.

```javascript
const pool = Game.createSprite({
	x: W * 0.32, y: H * 0.3, width: W * 0.44, height: H * 0.18,
	sheet: waterSheet, tintColor: '#3d6fd4', opacity: 0.35,
	touchEnabled: false,          // drags pass through to whatever is inside
	collisionGroup: 'water'
});

hero.collidesWith = ['water'];
hero.addEventListener('collision', (e) => {
	if (e.group === 'water') {
		hero.tintColor = '#7fb2ff';
		swimming = true;
	}
});
hero.addEventListener('collisionend', (e) => {
	if (e.group === 'water') {
		hero.tintColor = null;
		swimming = false;
	}
});
```

The listener goes on the sprite that declares `collidesWith`. For a pressure plate holding a door open exactly while a crate rests on it, that is the **plate** (`collidesWith: ['crate']`), not the crate — then `collision` opens the door and `collisionend` closes it, with no polling anywhere.

Removing the partner from the scene, hiding it (`visible = false`) or changing its `collisionGroup` mid-contact all count as separation, so the exit still fires and the door cannot stick open when an object despawns.

### Patrol routes and animation chains — `path.js`

A fixed route is `followPath`, not a chain of tween legs. The points are walked natively at `speed` px/s; `rotate: true` turns the sprite to face along the path (heading `0` = up, same convention as `rotation`), and `smoothing` rounds the corners with a radius in px.

```javascript
guard.followPath([
	{ x: W * 0.22, y: H * 0.46 },
	{ x: W * 0.78, y: H * 0.46 },
	{ x: W * 0.78, y: H * 0.60 },
	{ x: W * 0.22, y: H * 0.60 }
], { speed: W * 0.16, loop: true });     // sharp rectangle, walks forever

ship.followPath(diamond, {
	speed: W * 0.35,
	loop: true,
	rotate: true,                          // nose follows the heading
	smoothing: W * 0.12                    // rounds the diamond into an oval
});
```

A non-looping run fires `pathcomplete` and clears itself; `followPath(null)` stops in place. Two points is the minimum — one point is ignored with a warning, not treated as "go there".

The path writes `x`/`y` outright, after velocity and gravity have been integrated, so **a sprite on a path ignores its own physics for placement**. It still feeds the frame delta, though, which means a platform on a looping circuit carries whatever is standing on it — a moving platform is now a path, not a tween ping-pong.

Animation chains are native in the same spirit:

```javascript
guard.play('hop', { then: 'walk' });        // one call, no animationcomplete handler
bird.play('flap', { then: ['glide', 'idle'] });
```

Each queued animation starts as the previous non-looping one finishes, and a looping animation ends the chain. `animationcomplete` still fires per step if you want to hook one. `stop()` drops the queue along with the current animation.

### Line of sight, ledge probes and hitscan — `raycast.js`

`gameView.raycast(x0, y0, x1, y1, groups)` answers "what is the first thing on this line?" with `null` or `{ x, y, distance, group, sprite, normal }`. The targets need nothing but a `collisionGroup` — no `collidesWith` on the asking side.

```javascript
const hit = gameView.raycast(eyeX, eyeY, dog.x, dog.y, ['blocker']);
if (hit) {
	aimBeam(sight, eyeX, eyeY, hit.x, hit.y, hit.distance);
	sight.tintColor = '#f44';               // view blocked at the impact point
}
```

Pass the groups as an **array**. Android also accepts loose arguments, iOS does not, so the array is the portable form. Only `visible`, non-`screenFixed` sprites carrying a `collisionGroup` are candidates — a pooled sprite parked at `visible = false` is correctly invisible to the ray, an untagged wall is invisible too (the usual mistake), and HUD sprites are skipped by design so a screen-fixed score never blocks a world-space sight line.

A ledge probe is the same call pointed straight down, one step ahead of the feet:

```javascript
const dir = walker.velocityX >= 0 ? 1 : -1;
const probeX = walker.x + dir * W * 0.07;
if (!gameView.raycast(probeX, walker.y, probeX, walker.y + W * 0.12, ['ground'])) {
	walker.velocityX = -walker.velocityX;   // nothing underfoot: turn before falling
	walker.flipX = walker.velocityX < 0;
}
```

Run these from a coarse timer or a tap handler — the demo probes at 150 ms — never once per frame. A per-frame `raycast` from JS is exactly the bridge traffic the engine is built to avoid. Note that `raycast.js` drives its probes with `setInterval`: it was written two commits before game-clock timers existed, and `gameView.every` is the better home for an AI tick today.

### Pathfinding around obstacles — `maze.js`, `pointclick.js`

`gameView.findPath(from, to, options)` is grid A\* over the same sprites `raycast` sees: visible, tagged with a `collisionGroup`, nothing else to set up. It returns `{ x, y }` waypoints — or `null` — and those waypoints go straight into `followPath`, so the walk itself runs natively.

```javascript
gameView.addEventListener('tap', (e) => {
	const path = gameView.findPath(
		{ x: player.x, y: player.y },
		{ x: e.x, y: e.y },
		{ cellSize: TILE, groups: ['wall'], bounds: MAZE_BOUNDS });
	if (!path || path.length < 2) {
		return;                                   // tapped outside the walkable rect
	}
	player.scaleX = path[1].x < player.x ? -1 : 1;   // face the first leg
	player.play('walk');
	player.followPath(path, { speed: SPEED });
});
```

`cellSize` is the one option that decides everything else. On a tile map, pass the tile size and the grid lines up with the walls exactly; on a free-form scene, something near the walker's width. Too coarse and doorways disappear, too fine and the query gets expensive (over ~1M cells it returns `null` rather than allocating).

**The path is a line for the sprite's *center*.** A body wider than a cell scrapes corners unless you pass `clearance` — about half the walker's width:

```javascript
const path = gameView.findPath(from, to, {
	cellSize: Math.round(W * 0.04),
	groups: ['obstacle'],
	clearance: PLAYER_W * 0.35,               // keep half a body off the trunk
	bounds: WALK_BOUNDS                       // the walkable floor, in center coordinates
});
```

`bounds` doubles as the walkable area, which is how the point-&-click floor clamp survives: `WALK_BOUNDS` is the old `WALK_TOP`/margin clamp expressed as a rect, in **sprite-center coordinates** (tap points are feet positions, so subtract half the sprite height before searching).

**Obstacles do not have to be the art.** `pointclick.js` blocks only the oak's trunk with an invisible sprite — `opacity: 0`, `touchEnabled: false`, no collision wiring — because `findPath` reads the hitbox, not the pixels. The canopy stays walkable, so the player still passes behind the tree with `ySort` doing the depth:

```javascript
gameView.add(Game.createSprite({
	sheet: treeSheet, opacity: 0, touchEnabled: false,
	x: tree.x, y: groundY, width: TREE_W * 0.35, height: PLAYER_H * 0.8,
	collisionGroup: 'obstacle'
}));
```

A blocked goal snaps to the nearest free cell a few rings out, so tapping a wall walks to its edge instead of doing nothing. Tapping outside `bounds` is the case worth guarding — that is what `path.length < 2` catches.

**Chasing AI is a timer, not a frame loop.** Re-path on a coarse game-clock tick and let `followPath` cover the gap:

```javascript
const chase = gameView.every(800, () => {
	const path = gameView.findPath({ x: hound.x, y: hound.y }, { x: player.x, y: player.y }, PATH_OPTIONS);
	if (path && path.length > 1) {
		hound.followPath(path, { speed: TILE * 2.6 });
	}
});
win.addEventListener('close', () => gameView.cancelTimer(chase));
```

`followPath(null)` cancels an in-flight route — `maze.js` uses it to yank the hound back to its den after it catches you.

To *see* what A\* did, ask twice: `simplify: false` returns every grid cell it walked, `simplify: true` (the default) the line-of-sight-reduced corners the sprite actually gets. Dropping a dot on each is the whole route visualization in the maze demo.

### Timers on the game clock

`gameView.after(ms, cb)` and `every(ms, cb)` run on the engine's clock: they stretch under `timeScale` slow motion, freeze at `0`, and pause with the render loop. Spawn waves, AI decision ticks and respawn delays belong here — a paused game that keeps spawning is the bug this fixes.

```javascript
const wave = gameView.every(2000, () => spawnEnemy());
gameView.after(500, () => player.play('idle'));
gameView.cancelTimer(wave);                 // both return an int id
```

The callback receives `{ id }`. Called without a callback, the view fires a `timer` event carrying the same id instead — pick one, not both. A repeating timer fires at most once per frame and restarts its interval after a stall rather than bursting to catch up.

What still belongs in `setTimeout`: anything that must keep running while the game is frozen. A pause menu counting down in real seconds is not on the game clock.

### Hit-stop on impact

Freezing the scene for a few frames makes an impact read before the explosion starts. `timeScale = 0` stops the engine from advancing while it keeps drawing and accepting touches — no render loop to restart, no state to save. (Pattern from Titanium Lander: 140 ms on a crash, 90 ms when a shield absorbs a hit.)

```javascript
let hitStopTimer = null;

function hitStop(ms) {
	clearHitStop();
	gameView.timeScale = 0;
	hitStopTimer = setTimeout(() => {
		hitStopTimer = null;
		gameView.timeScale = 1;
	}, ms);
}

function clearHitStop() {
	if (hitStopTimer !== null) {
		clearTimeout(hitStopTimer);
		hitStopTimer = null;
	}
	gameView.timeScale = 1;
}
```

Restoring the scale must be unconditional: run `clearHitStop()` from reset, from window close and from every teardown path, because a freeze that outlives a retry starts the next round stopped.

## Tap-to-flap

Gravity plus an impulse per tap. Scoring and death are collisions with invisible zones. The rotation tween is what sells the arc.

```javascript
const pig = Game.createSprite({
	sheet: pigSheet,
	x: W * 0.28,
	y: H * 0.42,
	width: PIG_SIZE,
	height: PIG_SIZE,
	zIndex: 10,
	hitboxScale: 0.7,                 // the art does not fill the frame
	hitboxScaleY: 0.85,               // ...and the pig is wider than he is tall
	collidesWith: ['pipe', 'ground', 'score', 'ceiling'],
	animations: { fly: { frames: [0, 1, 2, 1], fps: 10, loop: true } }
});
pig.play('fly');

gameView.addEventListener('press', () => {
	if (over) {
		reset();
		return;
	}
	if (!started) {
		start();                      // first tap turns gravity on
	}
	pig.velocityY = FLAP;             // e.g. -H * 0.6
	pig.clearTweens();
	pig.rotation = -15;               // snap the nose up...
	pig.animate({ rotation: 25, duration: 900, easing: Game.EASE_IN });   // ...then tip forward
});

pig.addEventListener('collision', (e) => {
	if (over) {
		return;
	}
	if (e.group === 'score') {
		score++;
	} else if (e.group === 'ceiling') {
		pig.velocityY = H * 0.1;      // gentle push back down instead of a hard stop
	} else {
		gameOver();
	}
});
```

Obstacles are pooled gates: three sprites each (top pipe, bottom pipe, invisible score zone) that scroll left on `velocityX` and get repositioned when they leave the screen. Freezing the game means setting every scroller's `velocityX = 0` and the player's `gravity = 0` — the engine has no global "stop", but `gameView.timeScale = 0` is one if you want the scene frozen mid-flight.

## Platformer

`solidWith` handles the blocking; you only decide when to jump.

```javascript
const player = Game.createSprite({
	sheet: playerSheet,
	x: W * 0.15,
	y: groundTop - PLAYER_SIZE / 2,
	width: PLAYER_SIZE,
	height: PLAYER_SIZE,
	zIndex: 10,
	gravity: GRAVITY,                        // H * 2.2
	hitboxScale: 0.85,
	hitboxScaleX: 0.66,                      // the blob is 38px wide in a 64px frame, but nearly full height
	solidWith: ['solid', 'trampoline'],
	animations: {
		idle: { frames: [0], fps: 1, loop: true },
		walk: { frames: [1, 2], fps: 8, loop: true }
	}
});

gameView.follow(player, { topMargin: 0.33, bottomMargin: 0.7, maxY: 0 });

let moveDir = 0;

function applyMovement() {
	player.velocityX = moveDir * RUN_SPEED;
	if (moveDir !== 0) {
		player.scaleX = moveDir;             // face the running direction
	}
	if (player.onGround) {
		player.play(moveDir !== 0 ? 'walk' : 'idle');
	}
}

function jump() {
	if (player.onGround) {                   // gate on the engine's own flag
		player.velocityY = -JUMP;            // H * 0.95 ≈ 0.2 * H of height
		player.stop();
		player.frame = 3;                    // hold the jump pose
	}
}

player.addEventListener('land', (e) => {
	if (e.group === 'trampoline') {
		player.velocityY = -JUMP * 1.1;      // bounce higher than a jump
		player.stop();
		player.frame = 3;
		e.other.frame = 1;                   // squash the mat you landed on
		setTimeout(() => {
			e.other.frame = 0;
		}, 150);
		return;
	}
	applyMovement();                         // back from the jump pose
});
```

Jump height is `JUMP² / (2 × GRAVITY)`. Space your platforms comfortably below it — the demo uses steps of `0.14 * H` against a `0.2 * H` jump.

**One-way platforms**: `oneWay: true` on the solid lets riders jump up through it and land on top, never blocking sideways or from below. This is what makes a staircase climbable.

**Moving platforms carry riders for free** — a solid moved by `velocityX` or a tween drags whoever stands on it, with no re-landing jitter:

```javascript
const mover = Game.createSprite({
	sheet: moverSheet, x: W * 0.18, y: groundTop - STEP * 2,
	width: W * 0.26, height: PLAT_H, collisionGroup: 'solid'
});

function patrol() {
	mover.animate({
		x: (mover.x < W * 0.35) ? W * 0.5 : W * 0.18,
		duration: 2600,
		easing: Game.EASE_IN_OUT
	});
}
mover.addEventListener('complete', patrol);   // ping-pong forever
patrol();
```

Set `carryRiders: false` on terrain that scrolls under a player who should stay put (endless runners).

## Top-down / Zelda

A tile map from a string array, plus `ySort` for depth. Only water is solid; trees are pure decoration you can walk behind.

```javascript
const MAP = [
	'WWWWWWWWWWWW',
	'WGGGGGGGGGGW',
	'WGGFGGGPGGGW',
	'WWWWWWWWWWWW'
];
const FRAMES = { G: 0, F: 1, P: 2, W: 3 };
const COLS = MAP[0].length;
const ROWS = MAP.length;
const TILE = Math.floor(Math.min(W / COLS, (H - buttonZone) / ROWS));
const ox = (W - COLS * TILE) / 2;
const oy = (H - buttonZone - ROWS * TILE) / 2;

const level = [];
for (let row = 0; row < ROWS; row++) {
	for (let col = 0; col < COLS; col++) {
		const kind = MAP[row].charAt(col);
		level.push(Game.createSprite({
			sheet: tileSheet,
			frame: FRAMES[kind],
			x: ox + (col + 0.5) * TILE,
			y: oy + (row + 0.5) * TILE,
			width: TILE,
			height: TILE,
			zIndex: 0,
			collisionGroup: (kind === 'W') ? 'solid' : null    // only water blocks
		}));
	}
}
gameView.add(level);                                          // one bridge crossing
```

This is fine at 12×15 tiles and dead at 200×200 — one sprite per tile. A native tilemap layer is on the roadmap; until then, build large worlds from a few big `tileRepeat` sprites plus sparse solids.

Depth sorting: give the player, trees and buildings the **same `zIndex`** with `ySort: true`, and keep ground tiles on a lower `zIndex`. The engine then orders them by bottom edge.

```javascript
const player = Game.createSprite({
	sheet: walkerSheet,
	x: start.x, y: start.y, width: TILE, height: TILE,
	zIndex: 5,
	ySort: true,
	hitboxScale: 0.6,                 // top-down games feel best with a small body box
	solidWith: ['solid'],
	animations: {
		down: { frames: [0, 1], fps: 6, loop: true },
		up: { frames: [2, 3], fps: 6, loop: true },
		side: { frames: [4, 5], fps: 6, loop: true }
	}
});
```

8-way movement from four buttons, tracking facing yourself because `animation` keeps its value after `stop()`:

```javascript
let moveX = 0;
let moveY = 0;
let lastFacing = 'down';
let walking = false;

function applyMovement() {
	player.velocityX = moveX * SPEED;
	player.velocityY = moveY * SPEED;
	if (moveX === 0 && moveY === 0) {
		player.stop();
		walking = false;
		player.frame = { down: 0, up: 2, side: 4 }[lastFacing];
		return;
	}
	const facing = (moveX !== 0) ? 'side' : (moveY < 0 ? 'up' : 'down');
	if (moveX !== 0) {
		player.scaleX = moveX;        // side frames face right; mirror for left
	}
	if (!walking || facing !== lastFacing) {
		player.play(facing);
		walking = true;
	}
	lastFacing = facing;
}
```

**NPC on a decision timer.** The AI thinks every 100 ms; the walking itself is native velocity between ticks. This is the sanctioned use of a timer — decisions, not motion.

```javascript
timer = setInterval(() => {
	const dx = player.x - dog.x;
	const dy = player.y - dog.y;
	const dist = Math.sqrt(dx * dx + dy * dy);
	if (dist > FOLLOW_DISTANCE) {
		dog.velocityX = (dx / dist) * DOG_SPEED;
		dog.velocityY = (dy / dist) * DOG_SPEED;
		if (Math.abs(dx) > 2) {
			dog.scaleX = (dx > 0) ? 1 : -1;
		}
		setDogState('walk');
	} else {
		dog.velocityX = 0;
		dog.velocityY = 0;
		setDogState('sit');
	}
}, 100);
```

## Top-down racer

`carMode` gives you throttle, steering and emergent drift. You supply the track and the lap logic.

```javascript
const car = Game.createSprite({
	sheet: carSheet,
	x: W * 0.38,
	y: laneY,
	width: CAR_SIZE,
	height: CAR_SIZE,
	pixelSnap: true,                  // stable texel phase for pixel art in motion
	rotation: 90,                     // facing right along the bottom straight
	zIndex: 10,
	hitboxScale: 0.75,
	carMode: true,
	enginePower: MAX_SPEED * 1.1,
	maxSpeed: MAX_SPEED,
	turnRate: 210,
	grip: 3.2,                        // below the default 4 → drifts in fast corners
	drag: 0.8,
	skidMarks: true,
	restitution: 0.3,                 // bump off the barriers instead of sticking
	solidWith: ['wall'],
	collidesWith: ['checkpoint', 'goal']
});
```

Controls write `throttle` and `steering` once per touch — never per frame:

```javascript
bindHold(gasButton, () => {
	car.throttle = 1;
}, () => {
	if (car.throttle === 1) {
		car.throttle = 0;
	}
});
bindHold(brakeButton, () => {
	car.throttle = -1;
}, () => {
	if (car.throttle === -1) {
		car.throttle = 0;
	}
});
```

Track and laps: the visible track is one sprite; the collision geometry is invisible rectangles (outer border, inner island). Checkpoints are strips across each lane, and the goal only counts a lap once all of them were visited — that is what stops a player from reversing over the finish line.

```javascript
car.addEventListener('collision', (e) => {
	if (e.group === 'checkpoint') {
		visited[e.other.cpIndex] = true;
	} else if (e.group === 'goal' && Object.keys(visited).length === 3) {
		laps++;
		visited = {};
	}
});
```

Tuning: lower `grip` = more drift; `turnRate` is degrees per second at full steering and full speed; `drag` decides how fast the car coasts to a stop. Read-only `drifting` is the hook for a tire-squeal sound.

## Asteroids / space shooter

Newtonian flight: `thrust` accelerates along the heading, `angularVelocity` turns, `wrapAround` re-enters from the opposite edge, momentum does the rest.

```javascript
const ship = Game.createSprite({
	sheet: shipSheet,
	x: W / 2, y: H / 2, width: SHIP_SIZE, height: SHIP_SIZE,
	zIndex: 10,
	maxSpeed: MAX_SPEED,
	wrapAround: true,
	hitboxScale: 0.6,
	hitboxShape: 'circle',
	collidesWith: ['asteroid'],
	animations: { thrust: { frames: [1, 2], fps: 14, loop: true } }   // flickering flame
});

bindHold(thrustButton, () => {
	ship.thrust = THRUST;             // px/s² along the heading
	ship.play('thrust');
	thrustSound.play();               // created with loop: true
}, () => {
	ship.thrust = 0;
	ship.stop();
	ship.frame = 0;
	thrustSound.stop();
});

bindHold(leftButton, () => {
	ship.angularVelocity = -TURN_SPEED;
}, () => {
	if (ship.angularVelocity < 0) {
		ship.angularVelocity = 0;
	}
});
```

Firing from the nose, inheriting the ship's momentum — with `rotation` in degrees clockwise and y pointing down, the heading vector is `(sin θ, -cos θ)`:

```javascript
const rad = ship.rotation * Math.PI / 180;
const dirX = Math.sin(rad);
const dirY = -Math.cos(rad);
bullet.x = ship.x + dirX * SHIP_SIZE * 0.55;
bullet.y = ship.y + dirY * SHIP_SIZE * 0.55;
bullet.rotation = ship.rotation;
bullet.velocityX = ship.velocityX + dirX * BULLET_SPEED;
bullet.velocityY = ship.velocityY + dirY * BULLET_SPEED;
bullet.visible = true;
```

Give bolts `blend: 'add'` so they glow over the starfield. Autofire is a `setInterval` on the fire button — a cadence decision, not motion.

Damage feedback and invulnerability:

```javascript
let invulnerableUntil = 0;

ship.addEventListener('collision', (e) => {
	if (e.group !== 'asteroid' || Date.now() < invulnerableUntil) {
		return;
	}
	lives--;
	explodeSound.play();
	ship.flash('#ff5252', 400);       // native red damage flash
	invulnerableUntil = Date.now() + 1500;
});

// last-life warning: one JS timer, the fade itself runs in the engine
warnTimer = setInterval(() => {
	ship.flash('#ff5252', 350);
}, 700);
```

Rocks are round (`hitboxShape: 'circle'`), drift on random velocities, spin on `angularVelocity`, and are recycled by `visible = false` rather than removed.

## Lunar lander

Same flight model as Asteroids, with gravity on and a landing test. There is no "landing" event — you judge the touchdown yourself in the `land` handler, where velocities are still readable.

```javascript
const lander = Game.createSprite({
	sheet: shipSheet,
	x: W / 2, y: H * 0.2, width: SHIP, height: SHIP,
	zIndex: 10,
	gravity: world.gravity,                    // per-world, e.g. H * 0.35 for the Moon
	maxSpeed: MAX_SPEED,
	hitboxScale: 0.8,
	solidWith: ['terrain', 'pad'],
	collidesWith: ['hazard']
});

const MAX_LANDING_SPEED = H * 0.18;
const MAX_LANDING_TILT = 12;                   // degrees

lander.addEventListener('land', (e) => {
	const speed = Math.abs(lander.velocityY);
	const tilt = Math.abs(((lander.rotation % 360) + 540) % 360 - 180);
	const onPad = e.group === 'pad';

	if (onPad && speed <= MAX_LANDING_SPEED && tilt <= MAX_LANDING_TILT) {
		succeed();
		return;
	}
	crash();
});

function crash() {
	hitStop(140);                              // see the hit-stop pattern
	lander.flash('#ff5252', 400);
	explosion.x = lander.x;
	explosion.y = lander.y;
	explosion.emit(30);
	gameView.shake({ strength: SHIP * 0.5, duration: 450 });
	crashSound.play();
}
```

Thrust burns fuel on the same coarse tick that reads the controls — 80 ms is fast enough to feel responsive and slow enough to stay off the bridge:

```javascript
timer = setInterval(() => {
	if (mainThrusterHeld && fuel > 0) {
		fuel -= BURN_RATE;
		lander.thrust = THRUST;
		exhaust.emitting = true;
	} else {
		lander.thrust = 0;
		exhaust.emitting = false;
	}
	fuelLabel.text = Math.max(0, Math.round(fuel)) + '%';
}, 80);
```

Wind is just a horizontal acceleration you re-apply on that same tick by nudging `velocityX`; per-world gravity, drag and wind are plain numbers in a catalog object.

## Endless runner

The player never moves horizontally. Gravity plus an invisible ground solid handle the jump arc; the world scrolls past at the same speed as the obstacles, so they look glued to the street.

```javascript
const player = Game.createSprite({
	sheet: skaterSheet,
	x: W * 0.24,
	y: groundTop - PLAYER / 2,
	width: PLAYER, height: PLAYER,
	zIndex: 10,
	gravity: GRAVITY,
	hitboxScale: 0.9,
	solidWith: ['ground', 'platform'],
	collidesWith: ['wall', 'pit'],
	animations: { roll: { frames: [0, 1], fps: 6, loop: true } }
});

function jump() {
	if (!over && player.onGround) {
		jumpSound.play();
		dust.emitting = false;            // no dust while airborne
		player.velocityY = -JUMP;
		player.stop();
		player.frame = 2;                 // tuck pose
	}
}

player.addEventListener('land', () => {
	if (!over) {
		player.play('roll');
		dust.emitting = true;
	}
});
```

Spawning is a self-rescheduling timeout, so the gap can vary and a long obstacle can push the next spawn further out:

```javascript
function scheduleSpawn() {
	spawnTimer = setTimeout(() => {
		spawnObstacle();
		scheduleSpawn();
	}, 1100 + Math.random() * 800 + extraDelay);
}
```

Raised road sections are solids the player jumps onto, with `carryRiders: false` (the road scrolls, the skater must not be dragged with it) plus an invisible trigger on the front face so rolling into the step is a crash rather than the solid shoving the player off screen.

Crash sequence: stop the timers, zero gravity, freeze every scroller, switch to the wipeout frame, fire a spark burst, shake the camera.

```javascript
function crash(group) {
	over = true;
	music.stop();
	crashSound.play();
	clearTimers();
	player.gravity = 0;
	player.velocityY = 0;
	player.stop();
	player.frame = 3;
	layers.forEach((layer) => layer.setSpeed(0));
	setObstacleSpeed(0);
	dust.emitting = false;
	sparks.x = player.x;
	sparks.y = player.y;
	sparks.emit(26);
	gameView.shake({ strength: PLAYER * 0.12, duration: 450 });
}
```

## Rhythm game

Notes fall on native velocity; JS only handles presses and a spawn timer. Pads use `press`, not `tap` — a rhythm game cannot wait for the finger to lift.

```javascript
const pads = LANES.map((x, lane) => {
	const pad = Game.createSprite({ sheet: padSheet, x: x, y: PAD_Y, width: PAD, height: PAD, zIndex: 5 });
	pad.addEventListener('press', () => hitLane(lane, pad));
	gameView.add(pad);
	return pad;
});

// gems must not swallow pad presses
const sprite = Game.createSprite({
	sheet: noteSheet, width: NOTE, height: NOTE, zIndex: 10,
	visible: false,
	touchEnabled: false,
	collidesWith: ['misszone']
});

function hitLane(lane, pad) {
	pad.frame = 1;
	setTimeout(() => {
		pad.frame = 0;
	}, 120);

	let best = null;
	let bestDistance = Infinity;
	notes.forEach((note) => {
		if (note.active && note.lane === lane) {
			const distance = Math.abs(note.sprite.y - PAD_Y);   // live native read
			if (distance < bestDistance) {
				bestDistance = distance;
				best = note;
			}
		}
	});

	if (best !== null && bestDistance <= HIT_RANGE) {
		recycle(best);
		goodSound.play();
		burst.x = LANES[lane];
		burst.y = PAD_Y;
		burst.tint = LANE_TINTS[lane];
		burst.emit(18);
		score += (bestDistance <= PERFECT) ? 3 : 1;
	} else {
		badSound.play();
	}
}
```

An invisible `misszone` trigger below the pads catches gems that got away and counts the miss. Derive the fall speed from the beat: `FALL_SPEED = (PAD_Y + NOTE) / 1.6` with a 400 ms spawn interval puts four eighth notes between spawn and pad at 150 BPM.

## Ball sports / breakout physics

`restitution` on a circle-hitbox ball gives real reflection off walls and obstacles. Player contact is handled in JS so you control the feel.

```javascript
const ball = Game.createSprite({
	sheet: ballSheet,
	x: W / 2, y: H * 0.3, width: BALL_SIZE, height: BALL_SIZE,
	zIndex: 12,
	hitboxScale: 0.9,
	hitboxShape: 'circle',            // bounces off the net's corner along the normal
	restitution: 0.75,
	solidWith: ['wall', 'net'],       // blocked and bounced by these
	collidesWith: ['player', 'floor'] // only reported for these
});

ball.addEventListener('collision', (e) => {
	if (e.group === 'player') {
		// reflect away from the blob's center, biased upward
		const blob = e.other;
		const dx = ball.x - blob.x;
		const dy = ball.y - blob.y;
		const len = Math.sqrt(dx * dx + dy * dy) || 1;
		ball.velocityX = (dx / len) * HIT_SPEED;
		ball.velocityY = Math.min((dy / len) * HIT_SPEED, -HIT_SPEED * 0.45);
	} else if (e.group === 'floor') {
		roundOver(ball.x > W / 2);
	}
});
```

Note the split: walls and the net are `solidWith` (the engine bounces the ball off them for free), while the players and the floor are `collidesWith` (you decide what happens). For breakout, bricks go in `collidesWith` and are removed with `visible = false` on hit while the paddle and walls stay solid.

A `restitution: 1` ball on an invisible floor bounces forever with no JS at all.

**Opponent AI** on an 80 ms timer, reading a handful of live properties per tick:

```javascript
timer = setInterval(() => {
	const onCpuSide = ball.x > W / 2;
	const target = (running && onCpuSide) ? ball.x + PLAYER_SIZE * 0.2 : cpuHomeX;
	const dx = target - cpu.x;
	cpu.velocityX = (Math.abs(dx) > PLAYER_SIZE * 0.15) ? (dx > 0 ? RUN_SPEED : -RUN_SPEED) : 0;
	if (running && onCpuSide && cpu.onGround
			&& Math.abs(ball.x - cpu.x) < PLAYER_SIZE * 1.2
			&& ball.y < cpu.y && ball.velocityY > 0) {
		cpu.velocityY = -JUMP;
	}
}, 80);
```

## Cards and board games

No physics at all — sprite taps, native tweens, glow and idle wobble.

**Dealing** staggers one tween per card with `delay`, and flips the art on arrival:

```javascript
cards.forEach((card, index) => {
	card.state = 'dealing';
	card.sprite.idleAnimation = false;      // still cards land exactly on target
	card.sprite.frame = BACK_FRAME;
	card.sprite.x = DECK_X;
	card.sprite.y = DECK_Y;
	card.sprite.zIndex = 30 + index;        // above the deck while flying
	card.sprite.animate({
		x: card.home.x,
		y: card.home.y,
		rotation: card.home.rotation,
		duration: 380,
		delay: index * 140,                 // one card after another
		easing: Game.EASE_IN_OUT
	});
});

sprite.addEventListener('complete', () => {
	if (card.state === 'dealing') {
		card.state = 'hand';
		sprite.frame = card.face;           // flip face up on arrival
		sprite.zIndex = card.index;
		sprite.idleAnimation = true;        // wobble only once it has settled
	}
});
```

**Selection** lifts the card and fades a glow in — `glowOpacity` is tweenable, so the halo appears with the movement instead of popping:

```javascript
sprite.addEventListener('tap', () => {
	if (card.selected) {
		card.selected = false;
		sprite.animate({ x: home.x, y: home.y, rotation: home.rotation, scale: 1, glowOpacity: 0, duration: 150, easing: Game.EASE_OUT });
	} else if (selectedCards().length < MAX_SELECTED) {
		card.selected = true;
		sprite.glowColor = '#ffc94d';
		sprite.glowBlur = CARD_W * 0.14;
		sprite.glowOpacity = 0;
		sprite.animate({ y: home.y - LIFT, scale: 1.12, glowOpacity: 1, duration: 150, easing: Game.EASE_OUT });
	}
});
```

**Drag & drop with snapping** (puzzle pieces, board tiles). The drag itself is native; you only decide where it lands:

```javascript
const piece = Game.createSprite({ sheet: sheet, frame: index, x: homeX, y: homeY, width: PIECE, height: PIECE, draggable: true, zIndex: 10 });

piece.addEventListener('press', () => {
	piece.zIndex = 100;                     // draw above everything while held
	piece.animate({ scale: 1.15, duration: 120, easing: Game.EASE_OUT });
});

piece.addEventListener('release', () => {
	piece.animate({ scale: 1, duration: 120, easing: Game.EASE_OUT });
});

piece.addEventListener('dragend', (e) => {
	let best = null;
	let bestDistance = SNAP_DISTANCE;
	cells.forEach((cell) => {
		if (cell.piece) {
			return;
		}
		const d = Math.sqrt(Math.pow(e.x - cell.x, 2) + Math.pow(e.y - cell.y, 2));
		if (d < bestDistance) {
			bestDistance = d;
			best = cell;
		}
	});
	piece.zIndex = 10;
	if (best) {
		best.piece = piece;
		piece.animate({ x: best.x, y: best.y, duration: 150, easing: Game.EASE_OUT });
	} else {
		piece.animate({ x: homeX, y: homeY, duration: 400, easing: Game.EASE_IN_OUT });
	}
});
```

Because every handler is per sprite, this is multi-touch for free: each finger grabs its own piece.

## Point & click adventure

Tap-to-walk routes around the scenery with `findPath` and walks the waypoints natively:

```javascript
const WALK_BOUNDS = {                                     // the floor, in sprite-CENTER coordinates
	minX: W * 0.06, maxX: W * 0.94,
	minY: WALK_TOP - PLAYER_H / 2, maxY: H * 0.95 - PLAYER_H / 2
};

function walkTo(x, y) {
	const targetX = Math.min(Math.max(x, WALK_BOUNDS.minX), WALK_BOUNDS.maxX);
	const targetY = Math.min(Math.max(y - PLAYER_H / 2, WALK_BOUNDS.minY), WALK_BOUNDS.maxY);
	const path = gameView.findPath({ x: player.x, y: player.y }, { x: targetX, y: targetY }, {
		cellSize: Math.round(W * 0.04),
		groups: ['obstacle'],
		clearance: PLAYER_W * 0.35,                       // keep half a body off the trunk
		bounds: WALK_BOUNDS
	});
	if (!path || path.length < 2) {
		return;                                           // tapped outside the floor
	}
	player.scaleX = path[1].x < player.x ? -1 : 1;        // face the first leg
	player.play('walk');
	player.followPath(path, { speed: WALK_SPEED });       // constant px/s, cancels the previous route
}

player.addEventListener('pathcomplete', () => player.play('idle'));
```

The walkable floor is still a clamp, not geometry — but it is now expressed as the `bounds` rect the search runs in. Obstacles are separate: `pointclick.js` adds an invisible box over the oak's *trunk* only (`opacity: 0`, `touchEnabled: false`, `collisionGroup: 'obstacle'`), so the player circles the trunk and still walks behind the canopy with `ySort`. See [Pathfinding around obstacles](#pathfinding-around-obstacles--mazejs-pointclickjs) for the options.

With nothing in the scene to route around, `findPath` returns `[start, goal]` and `followPath` walks the straight line — the same result as the distance-sized `animate()` tween this demo used before, with one less speed calculation to get wrong.

**Hotspots and the tap conflict.** The GameView fires `tap` for *every* touch, including ones a sprite already handled, so a naive walk handler also walks when you click the bird. Hit-test the interactive sprites in JS and bail out:

```javascript
function over(sprite, x, y) {
	return sprite.visible !== false
		&& Math.abs(x - sprite.x) <= sprite.width / 2 + PAD
		&& Math.abs(y - sprite.y) <= sprite.height / 2 + PAD;
}

gameView.addEventListener('tap', (e) => {
	if (over(bird, e.x, e.y) || over(handIcon, e.x, e.y) || over(talkIcon, e.x, e.y)) {
		return;
	}
	hideIcons();
	walkTo(e.x, e.y);
});
```

A verb coin is two icon sprites with `visible` toggled and `idleAnimation: true` for a bit of life while open.

## Particles

Three modes, all native. Tint white art at runtime so one 16×16 texture covers every effect in the game.

**Continuous fountain**:

```javascript
const fountain = Game.createEmitter({
	sheet: sparkSheet, frame: 1,
	x: W / 2, y: H - UNIT * 0.05,
	rate: 90,
	lifetime: 1600,
	speed: H * 0.75,          // launch up...
	angle: 0,                 // 0 = up, clockwise degrees
	spread: 25,
	gravity: H * 0.45,        // ...and fall back
	size: UNIT * 0.03,
	startScale: 1, endScale: 0.4,
	startOpacity: 1, endOpacity: 0,
	tint: '#ffcc44',
	maxParticles: 400
});
gameView.add(fountain);
```

**Burst on demand** — `rate: 0`, position it and call `emit(n)`:

```javascript
const firework = Game.createEmitter({
	sheet: sparkSheet, frame: 1,
	rate: 0,
	lifetime: 900,
	speed: UNIT * 0.6,
	spread: 360,
	gravity: H * 0.25,
	startScale: 1, endScale: 0.3,
	maxParticles: 500
});
gameView.add(firework);

gameView.addEventListener('tap', (e) => {
	firework.x = e.x;
	firework.y = e.y;
	firework.tint = COLORS[colorIndex++ % COLORS.length];
	firework.emit(45);
});
```

**Trail following a sprite** — `target` keeps up even mid-drag, with no bridge traffic:

```javascript
const dust = Game.createEmitter({
	sheet: sparkSheet, frame: 0,
	target: player,
	offsetX: -PLAYER * 0.32,      // behind the rear wheels
	offsetY: PLAYER * 0.42,
	rate: 22,
	lifetime: 450,
	speed: W * 0.08,
	angle: -35,                   // up and back
	spread: 50,
	startOpacity: 0.45, endOpacity: 0,
	tint: '#8a8580',
	zIndex: 9                     // behind the player
});
gameView.add(dust);

dust.emitting = false;            // the one property JS toggles at runtime
```

Add `blend: 'add'` for fire, magic and sparks — overlaps bloom instead of covering.

## Ropes and chains

```javascript
// hangs from a draggable ball
const ball = Game.createSprite({ sheet: ballSheet, x: W / 2, y: H * 0.22, width: BALL, height: BALL, zIndex: 10, draggable: true, hitboxShape: 'circle' });
gameView.add(ball);

gameView.add(Game.createRope({
	sheet: ropeSheet,
	segments: 14,
	segmentLength: H * 0.04,
	thickness: W * 0.03,
	gravity: H * 1.6,
	damping: 0.985,
	iterations: 3,
	head: ball,                   // pinned to the sprite — drag it and the rope follows
	zIndex: 5
}));

// fixed anchor + a weight on a tether: drag it too far and it is pulled back
gameView.add(Game.createRope({
	sheet: ropeSheet,
	segments: 10,
	segmentLength: SEG_LEN,
	gravity: H * 1.6,
	x: W * 0.15, y: H * 0.1,      // fixed head anchor
	tail: weight,
	maxLength: 10 * SEG_LEN,      // wrecking balls, leashes, yo-yos
	zIndex: 5
}));
```

With sprites on both ends plus `maxLength`, dragging either one tows the other once the rope goes taut — carts, chained crates, a grappling hook whose tip you read from `rope.endX` / `rope.endY`.

## Camera work

```javascript
gameView.follow(player, {
	leftMargin: 0.4, rightMargin: 0.6,       // horizontal follow is off without these
	topMargin: 0.4, bottomMargin: 0.6,
	smoothing: 0.12,                         // 0 snaps; higher eases
	maxY: WORLD_H                            // default 0 clamps to the top of the world
});
gameView.cameraBounds = { minX: 0, minY: 0, maxX: WORLD_W, maxY: WORLD_H };
```

Sprites live in world coordinates and touch input is mapped back to world space automatically, zoom included — taps and drags keep working while scrolled. Overlaid Titanium controls are screen-fixed and unaffected.

```javascript
gameView.cameraScale = Math.min(2.5, Math.max(0.5, gameView.cameraScale * 1.25));   // zoom
gameView.shake({ strength: W * 0.02, duration: 500 });                              // impact
gameView.cameraEffect = 'tint';                                                     // night vision
gameView.cameraTint = '#4f8';
gameView.cameraEffectIntensity = 0.7;
gameView.cameraEffect = 'glitch';                                                   // broken signal
gameView.cameraEffect = 'none';                                                     // skips the pass entirely
```

For a big ground plane, one `tileRepeat` sprite covering the whole world beats a grid of tile sprites — the texture keeps its native density and the scene stays one draw call.

## Visual effects

**Blend modes** — four, on sprites and emitters alike. `blend.js` shows all of them side by side over a bright meadow strip:

| Mode | Does | Use for |
| --- | --- | --- |
| `'normal'` | Covers what is behind it | Everything else |
| `'add'` | Sums toward white | Glows, fire, lasers, light shafts, sparks |
| `'multiply'` | Darkens the backdrop | Contact shadows under sprites, stains, grime, smoke that dims |
| `'screen'` | Lightens without blowing out | Fog, haze, god rays, soft light |

Group same-blend sprites on their own `zIndex` band: every mode change in draw order costs a batch flush, so alternating them sprite by sprite degrades toward one draw call each. Unknown strings fall back to `'normal'` in silence and the names are case-sensitive — `blend: 'Add'` renders as normal with no warning.

**`flash(color, duration)`** — a solid-color silhouette that fades out natively. This is the damage flash a multiplicative `tintColor` cannot produce (white tint = no change). Retrigger it on a timer for invincibility blinking.

**`flipX` / `flipY` from movement** — mirror the drawn frame without touching physics:

```javascript
// tween patrol: flip on each turn-around
function patrol() {
	const goingRight = bird.x < W / 2;
	bird.flipX = !goingRight;
	bird.animate({ x: goingRight ? W - MARGIN : MARGIN, duration: 3000, easing: Game.EASE_IN_OUT });
}
bird.addEventListener('complete', patrol);

// velocity runner: a slow watchdog turns it around, never moves it
timer = setInterval(() => {
	[dog, player].forEach((runner) => {
		if (runner.velocityX > 0 && runner.x > W - MARGIN) {
			runner.velocityX = -runner.velocityX;
		} else if (runner.velocityX < 0 && runner.x < MARGIN) {
			runner.velocityX = -runner.velocityX;
		}
		runner.flipX = runner.velocityX < 0;
	});
}, 150);

// VVVVVV-style gravity inversion
gameView.addEventListener('tap', () => {
	player.gravity = -player.gravity;
	player.flipY = player.gravity < 0;
});
```

**`timeScale`** — one property slows or freezes physics, sheet animations, tweens, particles, the camera and the game-clock timers together, while rendering and touch keep running. `0.5` for slow motion, `0` for a pause that still draws, short bursts of `0` for hit-stop. `timescale.js` makes the timer half visible: a clock on `gameView.every(1000, ...)` freezes with the scene while a `setInterval` clock beside it keeps ticking.

**`idleAnimation`** — a per-sprite organic sway that composes with tweens and drags. Cheap life for cards, icons, floating pickups and menu art. Disable it before a tween that must land precisely.
