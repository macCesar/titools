# Adventure, presentation, and effects recipes

Production-oriented patterns distilled from the upstream non-action demos at `ti.game@d587081`. Use [examples.md](examples.md) to locate the full runnable demo and [api.md](api.md) for exact defaults and payloads.

<!-- TOC-START -->
## Contents

- [Cards and board games](#cards-and-board-games)
- [Point & click adventure](#point--click-adventure)
- [Particles](#particles)
- [Ropes and chains](#ropes-and-chains)
- [Camera work](#camera-work)
- [Visual effects](#visual-effects)

<!-- TOC-END -->

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

The walkable floor is still a clamp, not geometry — but it is now expressed as the `bounds` rect the search runs in. Obstacles are separate: `pointclick.js` adds an invisible box over the oak's *trunk* only (`opacity: 0`, `touchEnabled: false`, `collisionGroup: 'obstacle'`), so the player circles the trunk and still walks behind the canopy with `ySort`. See [Pathfinding around obstacles](patterns.md#pathfinding-around-obstacles--mazejs-pointclickjs) for the options.

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
