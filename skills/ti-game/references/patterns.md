# Cross-cutting ti.game patterns

Verified against `ti.game@d587081` and the runnable examples under `example/`. These are production-oriented extractions of the API combinations demonstrated upstream; they intentionally omit demo-launcher and back-navigation plumbing.

See [examples.md](examples.md) to choose the source demo, [api.md](api.md) for exact members, and the genre recipe files for complete game loops.

<!-- TOC-START -->
## Contents

- [The scaffolding](#the-scaffolding)
- [Cross-cutting patterns](#cross-cutting-patterns)
  - [Object pooling](#object-pooling)
  - [Freeing a level's textures](#freeing-a-levels-textures)
  - [Parallax](#parallax)
  - [Multitouch on-screen controls](#multitouch-on-screen-controls)
  - [HUD — `text.js`, `flappy.js`](#hud--textjs-flappyjs)
  - [Labels, bars and turrets pinned to a sprite — `attachTo`, `text.js`](#labels-bars-and-turrets-pinned-to-a-sprite--attachto-textjs)
  - [Invisible triggers](#invisible-triggers)
  - [Seeing the hitbox — `hitbox.js`](#seeing-the-hitbox--hitboxjs)
  - [Shaped solids: ramps, round posts and bodies that push back — `slopes.js`, `circles.js`, `pool.js`, `drum.js`](#shaped-solids-ramps-round-posts-and-bodies-that-push-back--slopesjs-circlesjs-pooljs-drumjs)
  - [Zones you can be inside of (enter / exit) — `zones.js`](#zones-you-can-be-inside-of-enter--exit--zonesjs)
  - [Patrol routes and animation chains — `path.js`](#patrol-routes-and-animation-chains--pathjs)
  - [Line of sight, ledge probes and hitscan — `raycast.js`](#line-of-sight-ledge-probes-and-hitscan--raycastjs)
  - [Pathfinding around obstacles — `maze.js`, `pointclick.js`](#pathfinding-around-obstacles--mazejs-pointclickjs)
  - [Timers on the game clock](#timers-on-the-game-clock)
  - [Hit-stop on impact](#hit-stop-on-impact)

<!-- TOC-END -->

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

The pieces every genre below reuses: pooling, freeing a level's textures, parallax, multitouch controls, HUD text, wrapped dialog, labels and bars attached to a sprite, invisible triggers, seeing the hitbox, enter/exit zones, patrol routes, line of sight, pathfinding, game-clock timers and hit-stop.

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

### Labels, bars and turrets pinned to a sprite — `attachTo`, `text.js`

A HUD is `screenFixed`; a name tag, a health bar or a shadow is the opposite — it belongs *on* a sprite that moves. `attachTo` is the native version of the JS everyone wrote before it: a timer copying `owner.x` into `tag.x`, one bridge round trip per tag per tick, and always a frame behind.

```javascript
const tag = Game.createText({ text: 'THE BALL', scale: UNIT, tintColor: '#7fd4ff', zIndex: 6 });
tag.attachTo(ball, { offsetY: -(W * 0.09) });   // offset in the tag's own units
gameView.add(tag);                              // the tag is still a scene sprite
```

The tag now tracks the ball through gravity, tweens, a moving platform and a finger drag, with no JS in the loop, and disappears with it — `gameView.remove(ball)` removes everything attached to the ball, recursively.

A health bar is the same idea with two sprites, and shows where inheritance stops:

```javascript
// blockSheet is any small opaque texture stretched and tinted — a sheet-less
// sprite draws nothing at all, that is the invisible-trigger idiom below
const barBack = Game.createSprite({ sheet: blockSheet, width: 40, height: 5, zIndex: 5, tintColor: '#222' });
const barFill = Game.createSprite({ sheet: blockSheet, width: 40, height: 5, zIndex: 6, anchor: 'left', tintColor: '#3f6' });

barBack.attachTo(hero, { offsetY: -34 });
barFill.attachTo(hero, { offsetX: -20, offsetY: -34 });   // anchored left → grows to the right
gameView.add([barBack, barFill]);

// on damage: the width is yours to set — scale, visibility and tint are not inherited
barFill.width = 40 * (hp / hpMax);

// on death: one tween fades the hero AND both bars, because opacity does cascade
hero.animate({ opacity: 0, duration: 400 });
```

`rotate: true` is the other half: the offset swings around the target and the sprite copies its rotation, which is what a turret on a tank or a hat on a tumbling hero needs.

```javascript
turret.attachTo(tank, { offsetY: -12, rotate: true });
```

Four things to keep in mind:

- **The attached sprite has to be added to the scene**, and so does its target. Neither pins otherwise — the sprite just sits at whatever `x`/`y` it was created with.
- **Its position stops being yours.** Velocity, gravity and `animate({ x })` still run and are overwritten the same frame. To fling a tag off a dying enemy, `detach()` first, then give it velocity.
- **Match `scrollFactor` between the two.** Attachment pins world coordinates; parallax changes only where a sprite is *drawn*. A tag at `scrollFactor: 1` on a background sprite at `0.5` stays pinned in world space and drifts across the screen anyway.
- **A faded owner also stops its tags taking taps.** The inherited opacity runs through the hit test as well as the draw, so an owner at `opacity: 0` leaves an attached text button untouchable — while that button's own `opacity` still reads 1. Hide an owner with `visible = false` if the tags should keep working, or detach them.

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

The orange dot is the third variable, not decoration: the box shrinks **around the anchor**, so where the anchor sits decides which edge stays put. A prop that should collide from mid-height down while still resting on the floor is the anchor and the scale together, and both have a readable form now:

```javascript
// the same thing, twice — the second one says what it is doing
Game.createSprite({ sheet, anchorY: 1, hitboxScaleY: 0.55 });
Game.createSprite({ sheet, anchor: 'bottom', hitboxScaleY: '55%' });
```

Every ratio takes a percentage this way (`opacity`, `scale`, `scrollFactor`, `restitution`, `volume`, the `follow` margins…) and both anchors take names. Coordinates, sizes, degrees and speeds do not — they were never fractions.

### Shaped solids: ramps, round posts and bodies that push back — `slopes.js`, `circles.js`, `pool.js`, `drum.js`

Until 2026-08-27 a solid was always resolved as an axis-aligned box no matter what it looked like, so a round post showed flat faces and a tilted ramp blocked along a phantom horizontal ledge. Now the **solid's** declared shape takes part, which turns four hand-written workarounds into one property.

**A ramp is one turned rectangle**, not a staircase of small ones:

```javascript
const ramp = Game.createSprite({
	sheet: wallSheet, x: W * 0.28, y: H * 0.24,
	width: W * 0.30, height: 14,
	rotation: 12,
	hitboxShape: 'rotatedRect',   // the box turns with the art
	collisionGroup: 'ramp'
});

const crate = Game.createSprite({
	sheet: crateSheet, x: W * 0.2, y: 0,
	gravity: 1400, swept: true,
	solidWith: ['ramp']
});
```

The rider needs nothing new — `'rect'` against a `'rotatedRect'` goes through separating axes on its own, and a circle rider is taken into the ramp's frame. Both settle on the real face and slide. Keep ramps **short**: a rider that slides a long one arrives at the bottom carrying everything the drop gave it and leaves like a projectile, which reads as the ramp firing it.

**A round obstacle wants a circle on the solid, not just on the ball.** `hitboxShape: 'circle'` on the mover has been there for a while; putting it on the *peg* is what makes the contact normal run centre to centre:

```javascript
const peg = Game.createSprite({ sheet, x, y, hitboxShape: 'circle', collisionGroup: 'peg' });

const chip = Game.createSprite({
	sheet, hitboxShape: 'circle', gravity: 1200,
	restitution: 0.42,
	swept: true,                  // small pegs, fast chip: no stepping over one
	collisionGroup: 'chip',
	solidWith: ['peg', 'chip'],
	solidMode: 'push'             // …and the chips are bodies to each other
});
```

As bounding boxes every peg is a square with a flat top and the chips stack instead of scattering. That is the whole Plinko board.

**Balls that push each other** need agreement on both sides — this is the one setting that fails silently when it is half-configured:

```javascript
const ball = Game.createSprite({
	sheet: ballSheet, hitboxShape: 'circle',
	restitution: 0.96,
	linearDamping: 0.62,          // the felt: it trickles to a halt
	swept: true,
	collisionGroup: 'ball',
	solidWith: ['ball', 'rail'],  // ← its own group is in there
	solidMode: 'push'
});
```

Every clause matters: both sprites `'push'`, both circles, and **each listing the other's group**. Drop any one and the pair quietly degrades to one ball shoving an immovable one, which looks like broken momentum and is a missing string. There are no masses and no spin — a marble and a boulder trade velocity identically.

**A container is one sprite, not a ring of walls.** `solidMode: 'contain'` keeps matched circles *inside* a circle, analytically, so there are no seams to squeeze through and nothing to place by hand:

```javascript
// sheetless: it collides and contains, and draws nothing — draw the barrel over it
gameView.add(Game.createSprite({
	x: CX, y: CY, width: DRUM * 0.88, height: DRUM * 0.88,
	touchEnabled: false,
	hitboxShape: 'circle',
	solidMode: 'contain',
	collisionGroup: 'drum',
	debug: true                    // green circle = exactly where the wall is
}));

// the balls list the drum; the drum lists nothing — containment is one-directional
const ball = Game.createSprite({
	sheet: ballSheet, hitboxShape: 'circle',
	gravity: 900, restitution: 0.55, linearDamping: 0.35,
	collisionGroup: 'ball', solidWith: ['drum', 'ball'], solidMode: 'push'
});
```

Two things bite here. The sweep **ignores** anything that is not `solidMode: 'block'`, so `swept: true` will not stop a fast enough ball crossing the boundary between frames — keep the speeds inside a container sane. And a `'contain'` solid only holds *circles*: a rect mover runs a resolver that never reads `solidMode` and gets pushed **out** of the boundary instead of held in.

**`linearDamping` is the missing friction, with a caveat.** `drag` only ever worked inside `carMode`; this is the same idea for ordinary sprites, and it is what brings a pool table to rest. But nothing checks contact — it bleeds speed on both axes, in the air as much as on the felt, and along a slope as much as across it. Right for a table, wrong for a hill. Below a combined 4 px/s the engine zeroes the velocity outright, so a deliberate 3 px/s drift dies the moment that sprite also carries damping.

**A bouncy surface is now a property of the surface.** `restitution` is read off both sides and mixed as `max`, so a springy floor rebounds riders that are not themselves bouncy:

```javascript
addSurface({ color: '#4caf50', restitution: 0.5 });   // the floor and the side walls
// the ball keeps restitution: 0.1 and still bounces off them at 0.5
```

The cost of `max` is that it cannot be opted out of — a deliberately dead crate bounces off that floor too — and a rebound over 40 px/s takes the reflecting branch, which never sets `onGround` and never fires `land`. A jump gated on `onGround` stops working on the one platform somebody made bouncy.

**`gravityX` is the sibling of `gravity`, not half of a vector.** `gravity` keeps its exact vertical meaning; this is a second constant acceleration on X, read natively every tick, so a field of leaves answers a wind change at once with no per-frame JS:

```javascript
leaves.forEach((leaf) => { leaf.gravityX = wind; });   // on a button, not on a timer
```

The other use has nothing to do with wind: a top-down table with `gravity: 0` and a non-zero `gravityX` is a board seen from above with a lean.

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
