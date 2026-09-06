# Action-game recipes

Production-oriented patterns distilled from the upstream action demos at `ti.game@3bea2f4`. Use [examples.md](examples.md) to locate the full runnable demo and [api.md](api.md) for exact defaults and payloads. The wall-contact API is source/README-backed because upstream has not added a wall-jump demo yet.

<!-- TOC-START -->
## Contents

- [Tap-to-flap](#tap-to-flap)
- [Platformer](#platformer)
- [Top-down / Zelda](#top-down--zelda)
- [Top-down racer](#top-down-racer)
- [Asteroids / space shooter](#asteroids--space-shooter)
- [Lunar lander](#lunar-lander)
- [Endless runner](#endless-runner)
- [Rhythm game](#rhythm-game)
- [Ball sports / breakout physics](#ball-sports--breakout-physics)

<!-- TOC-END -->

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
const WALL_KICK_X = RUN_SPEED * 1.35;
const WALL_KICK_Y = JUMP * 0.9;

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
	wallSlideSpeed: H * 0.18,                // 0 disables the native downward cap
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
		return;
	}

	const away = player.onWallLeft ? 1 : player.onWallRight ? -1 : 0;
	if (away !== 0) {                        // read state when the jump is requested
		player.velocityX = away * WALL_KICK_X;
		player.velocityY = -WALL_KICK_Y;
		player.scaleX = away;
		player.stop();
		player.frame = 3;
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

player.addEventListener('wallhit', () => {
	player.flash('#d7f4ff', 80);             // transition effect, not jump gating
});
```

Jump height is `JUMP² / (2 × GRAVITY)`. Space your platforms comfortably below it — the demo uses steps of `0.14 * H` against a `0.2 * H` jump.

**Wall jumps and slides**: `onWallLeft` / `onWallRight` are read-only contact state and only stay true while the resolver is pushing the player sideways. Read them in `jump()`; do not poll `wallhit` or make it sticky in JS. `wallhit` fires on first contact or a side switch and is ideal for sound/dust. `wallSlideSpeed` caps downward velocity only, so the upward kick remains intact. With touch controls that continuously reapply horizontal movement, let the wall-jump impulse win briefly before writing the held direction again. TileLayer walls set the same flags, but their `wallhit` payload has no `other` or `group`.

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

This sprite-per-tile pattern is still reasonable at 12×15 when trees and buildings need independent sprite behavior. At 200×200 it ticks, sorts, draws, and collision-scans far too many objects. Use one or more native `Game.createTileLayer()` grids for large/static terrain, then keep only interactive actors and props as sprites. See [tilemaps.md](tilemaps.md).

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

A `restitution: 1` ball on an invisible floor bounces forever with no JS at all — and since 2026-08-27 the bounce can live on the *floor* instead, which is what makes one springy platform in an otherwise dead level a one-property change. Round obstacles, bumpers that knock each other around and a table that brings everything to rest are all in [Shaped solids](patterns.md#shaped-solids-ramps-round-posts-and-bodies-that-push-back--slopesjs-circlesjs-pooljs-drumjs).

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
