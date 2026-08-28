# ti.game API reference

Complete JS surface of `ti.game` as of upstream `main` at `d587081`, 2026-08-28, verified against every Android proxy/engine and its iOS twin. Defaults come from native fields, not prose. The manifests still read **`0.5.0`**, but the performance HUD/telemetry and native `TileLayer` landed afterward without another bump. Read the number as a floor, never as a feature list. Older `0.3.0`/`0.4.0` artifacts also vary by build date; feature-detect when the artifact is unknown. Read a property before writing it, because Kroll can retain an unknown write on the proxy. Methods are safer probes (`typeof Game.createTileLayer === 'function'`), as are normalized properties (`solidMode` reads an unknown name back as `'block'` only when the engine implements it).

Properties are live unless their table says creation-time or read-only. Every writable property can be passed to its `create*` factory. `TileLayer` has four cross-platform creation-time inputs (`legend`, `firstGid`, `cols`, `rows`) because Android does not expose the live setters that iOS has. All durations crossing the JS boundary are **milliseconds**.

<!-- TOC-START -->
## Contents

- [Module](#module)
- [Names and percentages](#names-and-percentages)
- [GameView](#gameview)
- [SpriteSheet](#spritesheet)
- [Sprite](#sprite)
- [Font](#font)
- [Text](#text)
- [Sound](#sound)
- [Emitter](#emitter)
- [Rope](#rope)
- [TileLayer](#tilelayer)
- [Events at a glance](#events-at-a-glance)
- [Gotchas the property tables do not show](#gotchas-the-property-tables-do-not-show)

<!-- TOC-END -->

## Module

```javascript
const Game = require('ti.game');
```

| Factory | Returns |
| --- | --- |
| `Game.createGameView(options)` | GameView — the canvas, a Titanium view |
| `Game.createSpriteSheet(options)` | SpriteSheet — a texture cut into frames |
| `Game.createSprite(options)` | Sprite |
| `Game.createFont(options)` | Font — a bitmap font for text sprites |
| `Game.createText(options)` | Text — a sprite that draws a string |
| `Game.createSound(options)` | Sound |
| `Game.createEmitter(options)` | Emitter — particle system |
| `Game.createRope(options)` | Rope — Verlet chain |
| `Game.createTileLayer(options)` | TileLayer — visible-cell tile renderer and collision grid |

Easing constants (for `sprite.animate({ easing })`): `Game.EASE_LINEAR`, `Game.EASE_IN`, `Game.EASE_OUT`, `Game.EASE_IN_OUT`, `Game.EASE_BOUNCE`, `Game.EASE_ELASTIC`.

## Names and percentages

Added 2026-08-26, and purely additive: every number that worked before still works. Anything the engine treats as a **ratio** also accepts a percentage string, and the **anchors** also accept names.

```javascript
// The same sprite, twice.
Game.createSprite({ anchorX: 0, anchorY: 1, hitboxScaleY: 0.55, opacity: 0.8 });
Game.createSprite({ anchor: 'bottom-left', hitboxScaleY: '55%', opacity: '80%' });
```

**Percentages** work on exactly these, and nowhere else:

| Object | Properties |
| --- | --- |
| Sprite | `scale`, `scaleX`, `scaleY`, `opacity`, `glowOpacity`, `scrollFactor`, `hitboxScale`, `hitboxScaleX`, `hitboxScaleY`, `restitution`, `throttle`, `steering` |
| GameView | `cameraScale`, `timeScale`, `cameraEffectIntensity`, and inside `follow()`: `topMargin`, `bottomMargin`, `leftMargin`, `rightMargin`, `smoothing` |
| Emitter | `startScale`, `endScale`, `startOpacity`, `endOpacity` |
| Rope | `damping` |
| Sound | `volume` |
| TileLayer | `opacity`, `scrollFactor`, `restitution` |

Over 100% is meaningful where the ratio is a multiplier — `scaleX: '200%'` is twice as wide. Text sprites are sprites, so they take all of it (`Game.createText({ anchor: 'top-left', opacity: '60%' })`).

They do **not** apply to coordinates, sizes, degrees, speeds, or the friction coefficients — the car model's `grip` and `drag`, and `linearDamping`, are all per-second rates, not fractions.

**Anchor names** (`anchorX`, `anchorY`, and `anchor` for both at once):

| Property | Accepts |
| --- | --- |
| `anchorX` | `'left'` (0), `'center'` / `'centre'` / `'middle'` (0.5), `'right'` (1) |
| `anchorY` | `'top'` (0), `'center'` / `'centre'` / `'middle'` (0.5), `'bottom'` (1) |
| `anchor` | Any of the nine presets, either order, separated by `-`, `_` or a space: `'bottom-left'`, `'left bottom'`, `'top'`, `'center'`. An axis the name does not mention lands on 0.5, so `'left'` is `(0, 0.5)` |

`anchor` is the only one that reads back as a name: it returns the preset the sprite currently sits on, or `'custom'` when the anchors are somewhere else — so `b.anchor = a.anchor` copies a preset. `anchorX` and `anchorY` read back as numbers, always.

Why it exists, from the case that prompted it: a prop whose hitbox should cover its lower half while still reaching the ground is `anchorY = 1` plus `hitboxScaleY = 0.55`, and neither number says so — `hitboxScale` shrinks **around the anchor**, so moving the anchor is what lets the box start lower without lifting off the floor. `anchor: 'bottom'` with `hitboxScaleY: '55%'` says it out loud.

**A value the engine cannot parse logs a warning and does not throw** — but what it falls back to differs by platform, which upstream's README does not mention:

| | A bad value (`'half'`, `'50 %'`, `'abc'`) leaves the property at |
| --- | --- |
| Android | **the value it already held** |
| iOS | **the property's default** (`opacity` → 1, `restitution` → 0, `hitboxScale` → 1…) |

At creation time the two agree, because the current value *is* the default. They part company when the write lands on a property already set to something else: `sprite.opacity = 0.3` then `sprite.opacity = 'half'` leaves 0.3 on Android and 1 on iOS. Do not lean on either — a typo here is a bug on one platform and a silent no-op on the other.

## GameView

A normal Titanium view — add it to a window or any container, size it with the usual Titanium properties.

| Member | Type | Default | Notes |
| --- | --- | --- | --- |
| `add(object)` / `add([objects])` | method | — | Accepts Sprite/Text, Emitter, Rope, or TileLayer. An array crosses the bridge once and is committed under native scene locks — build a level into an array and add it in one call |
| `remove(object)` | method | — | Remove one object from the scene — **and, recursively, every sprite attached to it** (see [Attachment](#attachment)) |
| `removeAllSprites()` | method | — | Clears Sprite/Text objects and their attachments. It does **not** remove emitters, ropes, or tile layers; track and remove those separately |
| `pause()` / `resume()` | method | — | Render loop control. The activity/app lifecycle already pauses and resumes automatically |
| `backgroundColor` | string | — | GL clear color |
| `maxFps` | int | `0` | Frame cap. `60` stops 120 Hz ProMotion displays from doubling render work; `0` = display refresh rate |
| `timeScale` | float | `1` | Global multiplier for everything the engine ticks: physics, sheet animations, tweens, particles, camera. `0.5` = slow motion, `0` freezes the scene while rendering and touch keep running (pause menus, hit-stop) |
| `surfaceWidth` / `surfaceHeight` | int | — | Read-only surface size in pixels |
| `cameraX` / `cameraY` | float | `0` | World-space offset of the view |
| `cameraScale` | float | `1` | Zoom, anchored on the view center |
| `cameraBounds` | dict / null | `null` | `{ minX, minY, maxX, maxY }` world rect the visible area is clamped into |
| `follow(sprite, options)` | method | — | Native dead-zone follow, see below |
| `stopFollow()` | method | — | Stop following; the camera stays where it is |
| `shake({ strength, duration })` | method | `12` px, `400` ms | Detuned-sine rumble on the projection only — follow, bounds and touch mapping are unaffected |
| `raycast(x0, y0, x1, y1, groups)` | method | — | One-shot nearest-hit query along the segment against **visible, non-`screenFixed`** sprites carrying a `collisionGroup` in `groups` (omit for any tagged sprite). Returns `null` for a clear ray, else `{ x, y, distance, group, sprite, normal: { x, y } }`. Rect hitboxes are tested as their AABB, circle hitboxes exactly; a ray starting inside a hitbox reports it at distance 0 |
| `findPath(from, to, options)` | method | — | Grid A\* from `from` to `to` (`{ x, y }` world points) around visible, non-`screenFixed` sprites and fully solid TileLayer cells carrying a `collisionGroup` in `options.groups` (omit for any tagged obstacle). Returns `{ x, y }` waypoints ready for `sprite.followPath()`, or `null`. Options below |
| `after(ms, callback)` | method | — | Runs `callback` once after `ms` of **game time** — the delay stretches under `timeScale` slow motion, freezes at `0` and pauses with the render loop, unlike `setTimeout`. Returns an int id. The callback receives `{ id }` |
| `every(ms, callback)` | method | — | Like `after()`, repeating until cancelled. Fires at most once per frame, and restarts its interval after a stall instead of bursting to catch up |
| `cancelTimer(id)` | method | — | Cancels a timer from `after()` / `every()` |
| `cameraEffect` | string | `'none'` | Fullscreen shader pass: `'none'`, `'tint'`, `'glitch'`. With `'none'` the extra pass is skipped entirely |
| `cameraTint` | string | — | Color for the `'tint'` effect, e.g. `'#4f8'` (night vision, poison, flashback) |
| `cameraEffectIntensity` | float | `1` | 0..1 — tint mix or glitch amount |
| `debug` | bool / dict | `false` | `true` draws all collision shapes. Object form: `{ hitbox, hud, hudFont }`; `hud` is `true` or a corner name. Readback is normalized to `{ hitbox, hud: false | corner }`. See [debugging-performance.md](debugging-performance.md) |

Events: `press`, `tap`, `release` — fired for **every** touch anywhere on the view, with payload `x`, `y` in scene coordinates (tap-anywhere controls, flappy-style). `resize` carries the real surface `width`, `height` in pixels. `performance` carries a one-second telemetry snapshot only while a listener exists; see [debugging-performance.md](debugging-performance.md).

Plus `timer` with payload `id`, fired only for `after()` / `every()` calls made **without** a callback — pass a callback or listen for the event, not both.

### `follow(sprite, options)`

| Option | Default | Effect |
| --- | --- | --- |
| `topMargin` | `0.33` | Vertical dead-zone top edge, as a fraction of visible height |
| `bottomMargin` | `0.7` | Vertical dead-zone bottom edge |
| `leftMargin` | `0.35` when horizontal follow is enabled | Horizontal dead-zone left edge |
| `rightMargin` | `0.65` | Horizontal dead-zone right edge |
| `smoothing` | `0` | 0..1. `0` snaps; otherwise the camera eases by that fraction of the remaining distance per 1/60 s |
| `maxY` | `0` | The camera's `cameraY` never goes past this. Default `0` suits a platformer whose start view is the bottom of the level — for a free-roaming world pass the world height |

Vertical follow is always on. **Horizontal follow is off until you pass `leftMargin` or `rightMargin`.**

Each call **resets every option to its default** before applying what you passed. Calling `follow(sprite)` with no options after configuring it wipes the configuration.

Anything that is not a sprite — `null`, a plain object, a number — clears the follow instead of throwing, which is also what `stopFollow()` does. Since 2026-08-26 that is guaranteed on Android too: the binding takes an untyped argument and checks the type itself, because a typed proxy parameter aborts the whole app on the JNI type check when JS sends a plain object (it crosses as a `HashMap`). Passing an options dict where the sprite goes now silently stops the camera rather than killing the process — a real behaviour difference from older builds.

### `findPath(from, to, options)`

| Option | Default | Effect |
| --- | --- | --- |
| `cellSize` | `32` | Grid resolution in px. Match it to the tile size on a tile map so the grid lines up with the walls; a coarser grid is faster and blockier |
| `groups` | all tagged obstacles | Array of sprite or TileLayer `collisionGroup` names to treat as obstacles |
| `clearance` | `0` | Extra obstacle inflation in px. About half the walker's width keeps it from scraping corners, since the path is a line for the sprite's **center** |
| `bounds` | the whole surface | `{ minX, minY, maxX, maxY }` search rect — also the walkable area, so a floor clamp goes here |
| `diagonals` | `true` | Octile moves. Diagonals never cut a blocked corner |
| `simplify` | `true` | Line-of-sight string pulling: the cell chain collapses to the few corner waypoints `followPath` needs. `false` returns every grid cell (useful to visualize or debug the route) |

Waypoints come back with the **exact** start and goal as first and last point, so the walk begins under the sprite's feet and ends on the tapped pixel. A blocked start or goal snaps outward to the nearest free cell (up to 4 rings), which is why tapping an obstacle walks to its edge instead of returning `null`. `null` means: no route, degenerate `bounds`, `cellSize <= 0`, or a grid over ~1M cells (a runaway `bounds`/`cellSize` combination fails the query rather than allocating).

Everything is built per call on the calling thread — no persistent grid, no GL work. Fully solid TileLayer cells are rasterized; one-way cells are intentionally walkable. Like `raycast` it is a **discrete query**: run it on taps and AI timers (`gameView.every`), never per frame.

```javascript
const path = gameView.findPath(
	{ x: player.x, y: player.y },
	{ x: e.x, y: e.y },
	{ cellSize: TILE, groups: ['wall'], clearance: player.width * 0.35, bounds: WALK_BOUNDS });
if (path) {
	player.followPath(path, { speed: 160 });
}
```

## SpriteSheet

Create one sheet per texture and share it across every sprite that uses it — sprites sharing a sheet batch into a single draw call.

| Option | Default | Notes |
| --- | --- | --- |
| `image` | — | Path to the texture, relative to the resources root (`'assets/hero.png'`) |
| `frameWidth` / `frameHeight` | — | Grid mode: cell size in source pixels. Frames are numbered left-to-right, top-to-bottom, starting at 0 |
| `atlas` | — | TexturePacker JSON (hash or array format) instead of a grid |
| `smoothing` | `true` | `false` = GL_NEAREST, the pixel-art setting. On a **grid** sheet, `true` also insets the frame UVs by half a texel so magnified edges cannot sample the neighbouring frame — **both** edges of any axis that has more than one frame, since 2026-08-24. An axis with a single frame keeps the exact 0..1 range, which is what `tileRepeat` needs to wrap. Atlas frames come from the JSON untouched |
| `repeat` | `false` | GL_REPEAT wrap, required by sprites using `tileRepeat`. Needs power-of-two texture dimensions |

| Member | Notes |
| --- | --- |
| `frameCount` | Number of frames. `0` until the texture has loaded, for grid sheets |
| `frameNames` | Sorted frame names — atlas sheets only |
| `frameIndex(name)` | Index for an atlas frame name, `-1` if unknown |
| `unload()` | Frees the GL texture on the next rendered frame, from the render thread. **Permanent** — sprites still using the sheet stop drawing. For level streaming: unload the finished level's atlases instead of accumulating GPU memory. Since 2026-08-23 |

Textures upload to the GPU lazily on first use, from the render thread, and are re-created automatically after an EGL context loss. Releasing the proxy unloads its texture too, so a sheet that goes out of scope does not strand GPU memory.

## Sprite

### Transform

| Property | Default | Notes |
| --- | --- | --- |
| `x`, `y` | `0` | Position of the **anchor**, not the top-left corner |
| `width`, `height` | frame size | `0` means "use the sheet frame size" |
| `scale` | `1` | Write-only convenience that sets both axes |
| `scaleX`, `scaleY` | `1` | Negative values flip *and* affect physics/hit testing — prefer `flipX`/`flipY` for pure mirroring |
| `rotation` | `0` | Degrees, clockwise |
| `anchorX`, `anchorY` | `0.5` | `0/0` = top-left, `0.5/0.5` = center, `0.5/1` = bottom-center (useful for feet). Also take names — `'left'`/`'center'`/`'right'` and `'top'`/`'middle'`/`'bottom'` — but always read back as numbers. See [Names and percentages](#names-and-percentages) |
| `anchor` | — | Both anchors from one preset: `'bottom-left'`, `'top'`, `'center'`. Reads back as the preset the sprite is on, or `'custom'`. Applied after `anchorX`/`anchorY`, so passing both to `createSprite` lets `anchor` win |
| `opacity` | `1` | Also takes `'80%'`. `0` disables touch as well. While attached to another sprite, the target's opacity multiplies into this one — see [Attachment](#attachment) |
| `visible` | `true` | `false` = no render **and no collision** — the pooling idiom |
| `zIndex` | `0` | Draw order |
| `ySort` | `false` | Within the same `zIndex`, sort by the sprite's **bottom edge** — top-down depth (walk behind a tree, in front of it below) |
| `flipX`, `flipY` | `false` | Mirror the drawn frame only. Position, anchor, physics and hit testing are untouched |
| `screenFixed` | `false` | `x`/`y` become **surface** coordinates and the sprite ignores camera position, zoom and shake — HUDs, on-screen buttons, overlays. Touch is mapped back automatically, so `tap` still works. Works on any sprite, not only text |
| `scrollFactor` | `1` | Parallax: how much camera travel (and shake) moves this sprite. `0.5` = a background layer at half speed, `1.5` = a foreground layer overtaking the camera, `0` = pinned to the view but **still zooming** with `cameraScale` (unlike `screenFixed`). Rendering and touch mapping only — `x`/`y`, physics and collisions stay in plain world coordinates. Ignored when `screenFixed` is true |
| `pixelSnap` | `false` | Rounds only the rendered anchor to a framebuffer pixel after camera position and zoom. Physics and live `x`/`y` stay subpixel floats. Combine with `smoothing: false` when a moving pixel-art sprite must keep a stable texel phase |

### Sheet and animation

| Property | Default | Notes |
| --- | --- | --- |
| `sheet` | — | The SpriteSheet |
| `frame` | `0` | Current frame index; writing it stops nothing, it just shows that frame |
| `animations` | — | Named definitions: `{ walk: { frames: [1, 2], fps: 6, loop: true } }` |
| `animation` | — | Read-only name of the current animation. **Keeps its value after `stop()`** — track "is walking" yourself if you need it |
| `tileRepeat` | `false` | `true` / `'x'` / `'y'` — tile the frame at native size instead of stretching. Needs `repeat: true` on the sheet and a frame spanning the whole texture |

An animation definition takes `frames` (array of indices), `fps`, `loop`, and an optional `frame` — the sheet frame to show once a non-looping animation finishes (default: hold the last animation frame).

Methods: `play(name)` starts an animation, `stop()` halts it on the current frame.

### Touch

| Property | Default | Notes |
| --- | --- | --- |
| `draggable` | `false` | Native drag & drop — the sprite moves on the UI thread, JS only hears milestones |
| `pinchable` | `false` | Two-finger scale |
| `rotatable` | `false` | Two-finger rotate |
| `touchEnabled` | `true` | `false` = touches pass through to sprites underneath |

Hit-testing runs against the transformed shape (rotation and scale included), topmost first, and is multi-touch: each finger runs its own gesture and a sprite belongs to at most one finger. A second finger landing on empty space — or on the sprite already held — pinches/rotates that sprite instead, per its flags.

### Physics

| Property | Default | Notes |
| --- | --- | --- |
| `velocityX`, `velocityY` | `0` | px/s |
| `gravity` | `0` | px/s², added to `velocityY`. Per sprite — there is no global gravity |
| `gravityX` | `0` | px/s², added to `velocityX`. The **sibling** of `gravity`, not half of a vector: `gravity` keeps its exact vertical meaning. Wind, a conveyor, or a top-down game whose "down" is sideways (`gravity: 0`, `gravityX` non-zero). Since 2026-08-27 |
| `linearDamping` | `0` | Fraction of speed shed per second, applied to both velocity axes before the position integration — rolling friction for ordinary sprites, which `drag` never was (that one only runs inside `carMode`). ~`0.6` is a pool ball on felt. Proportional, so a fast body sheds a lot and a slow one very little; below **4 px/s** the engine zeroes both axes outright, because a proportion never reaches zero on its own. Negative values are clamped to 0. Since 2026-08-27 |
| `maxSpeed` | `500` | px/s cap applied **only** to `thrust` acceleration and the `carMode` model. Writing `velocityX`/`velocityY` directly is never clamped |
| `angularVelocity` | `0` | deg/s |
| `thrust` | `0` | px/s² along the current heading (Newtonian flight) |
| `wrapAround` | `false` | Re-enter from the opposite screen edge (Asteroids) |
| `wrapX`, `wrapShift` | `0` | Scroll looping: at `x < wrapX`, add `wrapShift`. Two screen-wide copies with `{ wrapX: -W/2, wrapShift: 2*W }` and a negative `velocityX` make a seamless parallax layer with no JS in the loop |

### Solids

| Property | Default | Notes |
| --- | --- | --- |
| `solidWith` | — | Array of group names that block this sprite. The engine pushes it out along the axis of least penetration |
| `onGround` | `false` | Read-only. Gate jumps on it |
| `restitution` | `0` | 0..1 bounce factor. Read off **both** sides of the contact and mixed as `max(mover, solid)`, the way Box2D does it — so a springy floor bounces riders that are not themselves bouncy. Solids default to 0, so a scene that never sets it on a surface behaves exactly as it did before this existed. A bounce whose closing speed would come out under **40 px/s** is damped to a dead stop instead, so a settling body grounds rather than buzzing |
| `solidMode` | `'block'` | On the **solid**. `'block'` is an immovable wall (what every solid was). `'contain'` is an inward circular boundary — matched circles are kept *inside* its circumference (drums, bowls, lottery cages). `'push'` makes it a body in its own right: a matched circle and this one split the separation and exchange the closing velocity at equal mass. `'contain'` and `'push'` are **circle-on-circle only**; anything else, and any unknown string, falls back to `'block'`. Since 2026-08-27 |
| `oneWay` | `false` | On the **solid**: pass-through except for landings on its top edge — classic platformer floors. Honoured by `'block'` solids only |
| `carryRiders` | `true` | On the **solid**: a moving solid carries whoever stands on it (velocity, tweens, idle wobble — wrap teleports excluded). Set `false` for world-scroll terrain that moves while the player is meant to stay put |

#### Which resolver runs, and what each pair produces

The **mover's** hitbox shape picks the resolver; the **solid's** shape and `solidMode` decide the contact normal inside it. Both sides matter, and the pairing is not symmetric.

| Mover | Solid | Resolution |
| --- | --- | --- |
| `rect` | `rect` | Axis of least penetration — the original platformer path |
| `rect` or `rotatedRect` | `rotatedRect` (or the mover is one) | Separating axes over the four box axes; the smallest overlap is the way out, so a crate slides down a tilted ramp instead of standing on an invisible ledge |
| `circle` | `rect` | Closest point on the AABB → contact normal (corner bounces) |
| `circle` | `rotatedRect` | The circle is taken into the box's frame, resolved there, and the normal rotated back out |
| `circle` | `circle` | Centre to centre — a round post deflects instead of showing faces and corners it does not have |
| `circle` | `circle` + `solidMode: 'contain'` | The mover is kept **inside** `R - r`, analytically. No ring of wall sprites, so no seams to squeeze through |
| `circle` + `push` | `circle` + `push`, mutually listed | Resolved **once**, before every other pass: the separation is split in half and the closing velocity exchanged at equal mass |

Two consequences that cost an afternoon each if you meet them by surprise:

- **`solidMode` is only read when the mover is a circle.** A `rect` mover runs the axis/SAT path, which never looks at it — so a square ball inside a `'contain'` drum is pushed *out* of the boundary, not held in, and a `rect` against a `'push'` body shoves it like a wall. Give both sides `hitboxShape: 'circle'`.
- **`'push'` is the only mode that needs agreement from both sprites.** Each must be `solidMode: 'push'`, each must carry a circle hitbox, and **each must list the other's `collisionGroup` in its own `solidWith`**. Miss any one of those and the pair silently degrades to the ordinary one-sided resolver: one body shoves an immovable one, which looks like a bug in the momentum and is really a missing group. `'contain'` is one-directional by design — only the ball lists the drum.

### Collision

| Property | Default | Notes |
| --- | --- | --- |
| `collisionGroup` | — | The tag *this* sprite carries |
| `collidesWith` | — | Array of groups this sprite reports overlaps with |
| `hitboxScale` | `1` | Shrinks the collision box **around the anchor** — which is what makes `anchor` the other half of the tuning: `anchor: 'bottom'` with `hitboxScaleY: '55%'` covers the lower half without lifting the box off the floor. Also takes `'80%'` |
| `hitboxScaleX`, `hitboxScaleY` | `1` | Per-axis corrections **multiplied on top of** `hitboxScale`, for art that fills its frame by a different fraction on each axis. A 20×44 drawing in a 32×48 frame needs `0.62` wide and `0.92` tall — no single `hitboxScale` describes it. Ignored by circle hitboxes. Since 2026-08-23 |
| `hitboxShape` | `'rect'` | `'circle'` — radius = half the smaller drawn side × `hitboxScale` (the per-axis scales are skipped: a circle has no axes). Circles resolve against solids along the contact normal (corner bounces) and get a round touch area. `'rotatedRect'` keeps the collision rect **turned with the sprite** (an OBB) instead of re-boxing it square to the screen: a plain `'rect'` at 45° is re-boxed around its turned corners and comes out 41% wider with a flat top that is not there. Only matters once `rotation` is non-zero, and it does honour `hitboxScaleX`/`hitboxScaleY`, unlike a circle. Covers solids, `collidesWith` overlap, `raycast`, the swept pass and the debug overlay. Since 2026-08-27 |
| `swept` | `false` | Test this sprite's movement as a **path** (swept AABB), not just at the end position, so a fast mover cannot tunnel between frames. Applies to both `collidesWith` events and `solidWith` blocking (the sprite is clamped to the impact point, then resolved by the normal static pass). Two **circle** hitboxes now sweep as circles (the Minkowski sum of two circles is a circle of radius r1+r2); a circle against a rectangular or turned solid sweeps as a box, and against a turned one the box is grown into a *rounded* rect so the diagonal does not poke out by 1.41r. Set it on the *mover* — the bullet, not the wall. The sweep skips solids that are not `solidMode: 'block'` |
| `debug` | `false` | Draw this sprite's shapes: green = collision AABB, blue = touch bounds, orange dot = anchor |

### Car (`carMode`)

| Property | Default | Notes |
| --- | --- | --- |
| `carMode` | `false` | Enables the arcade car model |
| `throttle` | `0` | `-1` (brake/reverse) .. `1` (gas) |
| `steering` | `0` | `-1` (left) .. `1` (right) |
| `enginePower` | `600` | Forward acceleration, px/s² |
| `maxSpeed` | `500` | px/s; reverse caps at 40% |
| `turnRate` | `200` | deg/s at full steering and speed |
| `grip` | `4` | Lateral friction, 1/s. **Lower = more drift** |
| `drag` | `0.6` | Longitudinal friction, 1/s |
| `skidMarks` | `false` | Fading rubber trails while drifting |
| `skidThreshold` | `0` | Lateral px/s that counts as drifting |
| `drifting` | `false` | Read-only — handy for triggering tire sounds |

Drift is emergent, not a mode: lateral grip is finite, so hard cornering at speed keeps sideways momentum.

### Idle wobble

| Property | Default | Notes |
| --- | --- | --- |
| `idleAnimation` | `false` | Gentle organic sway around the base transform |
| `idleRotation` | `3` | Degrees |
| `idleMovement` | `4` | px |
| `idleSpeed` | `1` | Frequency multiplier |

Every sprite gets its own phase, and the wobble unwinds exactly when disabled. Turn it **off before tweening a sprite to a position where alignment matters** — tweens write absolute values, so a wobbling sprite lands with a leftover offset.

### Color

| Property | Default | Notes |
| --- | --- | --- |
| `tintColor` | — | Multiplies the frame's colors (team colors, day/night, damage states). `null` or `'#fff'` = unchanged. Multiplicative, so it can only darken |
| `glowColor` | — | Tinted, blurred silhouette drawn behind the sprite by a shader pass |
| `glowBlur` | `0` | Blur radius in px; `0` = off. An active glow switches to the silhouette shader and back: **2 extra draw calls per glowing sprite per frame** (2 more while a `flash()` runs), even on a shared texture. Fine for a few highlights, not for every coin in the level |
| `glowOpacity` | `1` | Halo strength 0..1 — tweenable via `animate`, so a glow can fade in without touching the blur |
| `blend` | `'normal'` | `'add'` brightens the backdrop (glows, fire, lasers), `'multiply'` darkens it (contact shadows, stains, grime), `'screen'` lightens softly without blowing out to white (fog, god rays, soft light). Costs one batch flush per mode change — group same-blend sprites by `zIndex`. Unknown strings fall back to `'normal'` silently, and the names are case-sensitive |

### Methods

| Method | Notes |
| --- | --- |
| `play(name, options)` | Start a named animation; returns `false` for an unknown name. `options.then` (a name or an array of names) chains natively — each queued animation starts as the previous non-looping one finishes, and `animationcomplete` still fires per step. A looping animation ends the chain |
| `stop()` | Stop the animation on the current frame; also drops any queued `then` chain |
| `followPath(points, options)` | Walk the sprite along `points` — `{ x, y }` objects or `[x, y]` pairs, **at least two**, fewer is ignored with a warning. `options`: `speed` px/s (default `100`), `loop` (closed circuit), `rotate` (face along the path, 0 = up), `smoothing` (corner radius in px, precomputed once). Fires `pathcomplete` at the end of a non-looping run and clears itself. `followPath(null)` stops in place |
| `animate(options)` | Native tween, fires `complete` |
| `clearTweens()` | Cancel tweens in progress — call before starting a replacement tween |
| `flash(color, duration)` | Fills the sprite's silhouette with `color` (default white) and fades it out over `duration` ms (default 150). The classic damage/invincibility flash that a multiplicative `tintColor` cannot do |
| `attachTo(target, options)` | Pin this sprite to another one natively — see [Attachment](#attachment) below. `options`: `offsetX`, `offsetY` (both `0`), `rotate` (`false`). `attachTo(null)` detaches |
| `detach()` | Release the sprite where it is; `x`/`y` are writable again |

`animate()` accepts exactly these keys — anything else is silently ignored: `x`, `y`, `scale`, `scaleX`, `scaleY`, `rotation`, `opacity`, `glowOpacity`, `duration` (ms), `delay` (ms), `easing`, `frame` (the sheet frame to set once the tween finishes). Re-calling `animate` from the `complete` handler is still how a ping-pong or a blink is built (there is no `repeat`/`yoyo` yet), but a fixed route is now `followPath` instead of a chain of tween legs.

### Attachment

Added 2026-08-26. `sprite.attachTo(target, { offsetX, offsetY, rotate })` pins a sprite to another sprite natively: every frame the engine writes the sprite's `x`/`y` from the target's **final** position plus the offset, with no per-frame JS. Name tags, health bars, shadows, turrets, a hitbox that must sit on a moving body.

```javascript
const tag = Game.createText({ text: 'PLAYER 1', zIndex: 6 });
tag.attachTo(hero, { offsetY: -40 });   // 40 px above the hero's anchor
gameView.add(tag);                      // still has to be in the scene
```

| Member | Notes |
| --- | --- |
| `attachTo(target, options)` | `options.offsetX` / `offsetY` (default `0`) are in the **attached sprite's** own coordinate space. `options.rotate` (default `false`) copies the target's `rotation` onto the sprite each frame *and* swings the offset around the target — a turret or a hat. Left `false`, the sprite stays upright while the target spins. Every call replaces the previous offset and flag; there is no partial update |
| `detach()` | Stops the pinning, leaving the sprite where it was. Same as `attachTo(null)` |
| `attachedTo` | **Read-only** property: the target sprite, or `null`. Setting it does nothing (it is a getter — the write lands on the Kroll proxy and is never read back by the engine) |

Where it runs in the frame, and why it matters: after physics integration and solid resolution, before collision checks. So a tag never trails its owner by a frame — including an owner riding a moving platform — and an attached invisible hitbox is tested at the position it was just moved to, not the previous one.

**Opacity is inherited** (2026-08-26), and it is the only thing besides position and rotation that is. Each frame the target's *effective* opacity is multiplied into the attached sprite wherever it is drawn or hit-tested, so fading an owner — an `animate({ opacity })` tween included — fades its tags and bars with it, down a whole chain, without ever writing to their own `opacity`. Detaching, being removed, or `removeAllSprites()` resets the inherited factor to 1.

The rest of the contract, all read from the engine:

- **The attached sprite must be in the scene** (`gameView.add(...)`). The pass iterates the scene's sprite list; a sprite that was never added is never repositioned. So is one whose *target* is not in the scene — it simply freezes where it stands.
- **While attached, position is not yours.** Direct `x`/`y` writes, `velocityX`/`velocityY`, gravity and position tweens still run, and are then overwritten the same frame. `detach()` first if the sprite has to move on its own.
- **A drag outranks the attachment — for position only.** While a finger holds the sprite (`draggable: true`, past the touch slop) the pinning is skipped, exactly as it is for a rider on a moving platform, and resumes when the finger lifts. The inherited opacity keeps applying throughout.
- **Chains work**: attach a hat to a tag attached to a hero. Parents resolve first through recursion, with a depth cap of 8 that breaks accidental cycles — beyond eight links the far ancestor is not re-resolved that frame and the chain lags instead of hanging. Attaching a sprite to itself is ignored.
- **Cross-space attach converts automatically.** A `screenFixed` sprite attached to a world sprite (or the reverse) has the target's position mapped through the camera first, so the offset stays in the sprite's own units.
- **Removing the target removes everything attached to it**, recursively — a tag never outlives its owner, and a chain goes with it. `detach()` first to keep one alive. `removeAllSprites()` clears every attachment as it empties the Sprite/Text list; emitters, ropes, and tile layers remain.
- **A non-sprite target detaches** instead of crashing (Android logs a warning; iOS is silent). Like `follow()`, the binding takes an untyped argument on purpose — a typed proxy parameter aborts the app on the JNI type check when JS sends a plain object.

### Sprite events

| Event | Payload | Fires |
| --- | --- | --- |
| `press` | `x`, `y`, `touchX`, `touchY` | Finger down on the sprite |
| `release` | `x`, `y` | Finger up or cancel after a press (after `tap`/`dragend`) |
| `tap` | `x`, `y`, `touchX`, `touchY` | Quick touch without movement |
| `dragstart` | `x`, `y` | Drag exceeded touch slop |
| `drag` | `x`, `y` | Throttled to ~10 Hz while dragging |
| `dragend` | `x`, `y` | Finger lifted; the sprite has already moved natively |
| `pinch` | `scaleX`, `scaleY` | While two-finger scaling |
| `rotate` | `rotation` | While two-finger rotating |
| `animationcomplete` | `animation` | A non-looping sheet animation finished — including each finished step of a `then` chain |
| `complete` | final transform values | A tween finished |
| `pathcomplete` | `x`, `y` | A non-looping `followPath` run reached the end |
| `collision` | `group`, `other`, `x`, `y` | Overlap with a `collidesWith` group began |
| `collisionend` | `group`, `other`, `x`, `y` | That overlap ended: the shapes separated, **or** the partner was removed from the scene, hidden (`visible = false`) or stopped matching the group filter |
| `land` | `x`, `y`, optional `other`, `group` | Landed on top of a `solidWith` solid. `other` is the solid sprite when one exists; TileLayer cells have no proxy and omit it |

## Font

A glyph atlas for text sprites. Create it once, outside `resize`, like a SpriteSheet — it holds a GL texture.

```javascript
// 1. Built-in: nothing to ship. A 9x15 pixel font embedded in the module.
//    You do not even need a Font object — createText without `font` uses it.
const builtin = Game.createFont({});

// 2. BMFont / AngelCode: .fnt text format or its JSON export, kerning included.
//    Produced by BMFont, Hiero, fontbm or the module's tools/genfont.py.
const hud = Game.createFont({ font: 'assets/hud.fnt' });

// 3. Monospace grid image: cells row-major, ASCII 32..126 by default.
const mono = Game.createFont({ image: 'assets/mono.png', charWidth: 9, charHeight: 15 });
```

| Option | Default | Notes |
| --- | --- | --- |
| `font` | — | Path to a `.fnt` descriptor (AngelCode text or JSON). The page image is loaded from **next to the descriptor** unless `image` overrides it |
| `image` | — | Grid mode: the glyph sheet. Also overrides a BMFont page path |
| `charWidth`, `charHeight` | — | **Required** in grid mode. Missing or ≤ 0 silently falls back to the built-in font |
| `characters` | ASCII 32..126 | Grid mode: which characters the cells map to, row-major |
| `smoothing` | `true` | Filters the glyph texture like a sheet. The built-in font is always crisp |
| `lineHeight` | — | Read-only: the font's natural line height in px |
| `unload()` | Method, not an option: frees the glyph texture exactly like `SpriteSheet.unload()`, and just as permanently. Since 2026-08-23 |

A descriptor that fails to parse falls back to the built-in font and logs the error — the text still renders, in the wrong face, which is the symptom to recognize.

## Text

`Game.createText(options)` returns a **Sprite**. Everything in the Sprite section applies — `zIndex`, `ySort`, `animate()`, `flash()`, `tintColor`, glow, `idleAnimation`, `screenFixed`, touch events, `collidesWith`. Add it to the view like any sprite: `gameView.add(label)`.

```javascript
const score = Game.createText({
	text: 'SCORE 0',
	x: 16,
	y: 40,
	anchorX: 0,          // left-aligned to a margin
	anchorY: 0,
	scale: 3,            // bitmap fonts size by scale, not by fontSize
	screenFixed: true,   // ignore the camera
	zIndex: 100
});
gameView.add(score);
score.text = 'SCORE 10';   // re-lays out natively on the next frame
```

| Property | Default | Notes |
| --- | --- | --- |
| `text` | `''` | The string. `\n` breaks lines. Writing it re-lays out natively |
| `font` | built-in | A Font object. Omitted or `null` = the embedded pixel font, which the scene assigns per GameView |
| `align` | `'left'` | `'center'` / `'right'` — how multiple lines align against each other. Unknown values fall back to `'left'` |
| `letterSpacing` | `0` | Extra px between glyphs; negative tightens |
| `lineSpacing` | `1` | Multiplier on the font's line height |
| `maxWidth` | `0` | Wrap width in **font-space px** (`0` = no wrap). Lines break on word boundaries, re-wrapping whenever `text` is written. Since 2026-08-23 |
| `width`, `height` | laid-out size | **Derived, not settable** — the glyph layout drives the size, and with it the anchor, hit test, AABB and `ySort` bottom edge |

`maxWidth` wraps a single long string so dialog boxes stop needing hand-broken `\n` lines — hard `\n` breaks still apply on top of it. Measurement reuses the layout pen (kerning, `letterSpacing`, the missing-glyph advance), so a wrapped line never renders wider than it measured, and the spaces around a soft break are dropped.

```javascript
const dialog = Game.createText({
	text: 'A WISE FROG ONCE SAID: THE POND LOOKS SMALL UNTIL YOU TRY TO HOP ACROSS IT.',
	maxWidth: Math.round(W * 0.55 / UNIT),   // font-space px, so divide by the scale
	align: 'center',
	scale: UNIT,
	lineSpacing: 1.3
});
dialog.text = nextLine;   // re-wraps natively
```

There is no font size: scale the sprite. With the built-in pixel font, use **integer** `scale` values (`Math.max(1, Math.round(W / 240))` is the demos' idiom) so texels stay square.

Every glyph is a quad in the same batch, so one label costs one draw call — a screen of labels sharing a font costs one too.

## Sound

```javascript
const jump = Game.createSound({ url: 'assets/jump.wav', volume: 0.8 });
jump.play();   // fire-and-forget; rapid plays overlap

const music = Game.createSound({ url: 'assets/theme.mp3', music: true, loop: true });
music.play();
```

| Option | Default | Notes |
| --- | --- | --- |
| `url` | required | App resource or file path |
| `volume` | `1` | 0..1, live |
| `loop` | `false` | Live |
| `music` | `false` | Chooses the backend — **set at creation, not changeable later** |

Effect mode (the default) is built for low latency: a shared `SoundPool` on Android, a small pool of preloaded players on iOS. Call `play()` from any handler and repeated plays overlap instead of cutting each other off. `music: true` picks the streaming backend (`MediaPlayer` / `AVAudioPlayer`) for longer tracks; music pauses when the app backgrounds and resumes with it.

Methods: `play()`, `pause()` (resumes where it stopped), `stop()` (rewinds to the beginning). Formats: WAV, MP3, OGG on Android; WAV, MP3, M4A on iOS.

## Emitter

Add and remove like a sprite: `gameView.add(emitter)` / `remove(emitter)`. Spawning, integration, fading and drawing all run in the native loop — JS only writes configuration and calls `emit()`.

| Property | Default | Notes |
| --- | --- | --- |
| `sheet`, `frame` | — | All particles share one frame, so an emitter renders as a single batch run |
| `x`, `y` | `0` | Ignored while `target` is set |
| `target` | — | Sprite to follow. Set to `null` to detach |
| `offsetX`, `offsetY` | `0` | Offset from the target (rear wheels, exhaust) |
| `zIndex` | `0` | Emitters draw above sprites of the same z |
| `rate` | `0` | Particles per second while `emitting`. Leave at `0` for burst-only emitters |
| `emitting` | `true` | Toggle the continuous stream |
| `lifetime` | `800` | ms |
| `speed` | `100` | px/s, randomized between 50% and 100% so bursts do not form perfect rings |
| `angle` | `0` | Base direction: `0` = up, clockwise degrees |
| `spread` | `360` | Cone width in degrees |
| `gravity` | `0` | px/s² applied to particle velocity |
| `size` | `0` | Base particle width in px; `0` = frame size |
| `startScale` / `endScale` | `1` / `1` | Interpolated over `lifetime` |
| `startOpacity` / `endOpacity` | `1` / `0` | Interpolated over `lifetime` |
| `tint` | white | Tint white particle art at runtime — one tiny texture covers every color in the game |
| `blend` | `'normal'` | `'add'` for fire, sparks and magic; `'multiply'` for smoke and dust that darken what they cross; `'screen'` for soft haze |
| `maxParticles` | `200` | Pool size, hard cap 1000 |

Methods: `emit(n)` fires a one-shot burst on top of `rate`; `clear()` kills all live particles.

## Rope

A native Verlet chain: integration and distance constraints run in the game loop, segments render as quads oriented along the rope (one sheet frame, one batch run).

| Property | Default | Notes |
| --- | --- | --- |
| `sheet`, `frame` | — | One frame, textured along each link |
| `segments` | `10` | Number of links |
| `segmentLength` | `30` | px |
| `thickness` | `10` | Drawn width in px |
| `gravity` | `1500` | px/s² |
| `damping` | `0.98` | Velocity kept per step |
| `iterations` | `3` | Constraint passes per frame — higher is stiffer and costlier |
| `head` | — | Sprite the head is pinned to. Without it, the head anchors at `x`/`y` |
| `tail` | — | Sprite pinned to the other end (hanging weights, bridges) |
| `x`, `y` | `0` | Fixed head anchor when no `head` sprite is set |
| `maxLength` | `0` | `0` = off. With a `tail`, turns the rope into a tether: when head→tail distance exceeds it, the sprites are pulled back onto the limit each frame and their outward velocity is cancelled — a falling weight snaps taut and swings like a pendulum instead of stretching |
| `zIndex` | `0` | |
| `visible` | `true` | |
| `endX`, `endY` | — | Read-only live position of the loose end (grappling-hook tips) |

The tether yields at the end no finger owns: with a fixed head anchor the tail sprite is simply leashed, but with sprites on both ends you can drag either one and the other is towed once the rope goes taut.

## TileLayer

One native grid replaces a sprite per tile. Only cells inside the camera are drawn, collision checks visit cells under the mover, and fully solid cells can feed `findPath`. Add/remove a layer through the GameView like other scene objects. It draws below sprites at the same `zIndex`.

| Group | Members | Notes |
| --- | --- | --- |
| Grid input | `data` | Nested numeric rows, string rows decoded through `legend`, or flat row-major ids sized by `cols`/`rows`. Live on both platforms |
| Creation-time grid configuration | `legend`, `firstGid`, `cols`, `rows` | Set in `createTileLayer()` for portability. `cols`/`rows` read back from the parsed grid; Android has no live setters for the four configuration inputs |
| Derived size | `width`, `height` | Read-only world dimensions |
| Placement | `x`, `y`, `tileWidth`, `tileHeight`, `zIndex`, `scrollFactor` | Tile sizes default to the sheet frame dimensions |
| Look | `sheet`, `visible`, `opacity`, `tintColor` | `opacity` and `scrollFactor` accept percentage strings |
| Collision | `collisionGroup`, `solid`, `oneWay`, `restitution`, `debug` | `solid`/`oneWay` accept tile ids or legend characters. `restitution` accepts a percentage |

Tiled data uses `firstGid`: gid 0 becomes empty when an offset is active, and flip bits are stripped before the frame id is calculated. The flip transform itself is not rendered.

| Method | Result |
| --- | --- |
| `getTile(col, row)` | Frame id, `-1` when empty or outside |
| `setTile(col, row, id)` | Replaces art and recalculates its flag from `solid`/`oneWay` |
| `isBlocked(col, row)` | Fully solid status; one-way cells answer `false` |
| `setBlocked(col, row, bool)` | Per-cell full-solid override without changing art |
| `tileAt(x, y)` | World point → `{ col, row, tile, solid, x, y }`, or `null` outside |
| `cellAt(col, row)` | Cell → the same structure; `x`/`y` are the center |

Movers list the layer's `collisionGroup` in `solidWith`. Rect, circle, swept, restitution, grounding, and `land` are supported, but the tile cell is not a proxy: a tile landing has no `other` sprite. Tile cells do not produce `collidesWith` trigger events and are not included in `raycast()` yet. Full workflow, Tiled input, live edits, and bounded A* are in [tilemaps.md](tilemaps.md).

## Events at a glance

Only these events exist. Nothing fires per frame, and events are only fired if a listener is registered.

- **GameView**: `press`, `tap`, `release`, `resize`, `timer`, `performance`
- **Sprite** (and therefore **Text**): `press`, `release`, `tap`, `dragstart`, `drag`, `dragend`, `pinch`, `rotate`, `animationcomplete`, `complete`, `pathcomplete`, `collision`, `collisionend`, `land`
- **SpriteSheet, Font, Sound, Emitter, Rope, TileLayer**: none

There is `collision` (enter) and `collisionend` (exit), but deliberately **no** per-frame "stay" event — that would be bridge traffic every frame. Hold the in-between state in JS: you heard the enter, you will hear the end.

## Gotchas the property tables do not show

- **`maxSpeed` caps `thrust` and `carMode` only — not plain velocity.** The clamp runs inside the thrust integration and inside the car model, so a sprite given `velocityX = 3000` travels at 3000 no matter what `maxSpeed` says. A ship accelerating on `thrust`, on the other hand, stops gaining speed at 500 px/s unless you raise its own `maxSpeed`, which is the cap people actually hit.
- **`sprite.animation` survives `stop()`.** Comparing it to decide whether to restart an animation gives a false negative. The top-down demo tracks a `walking` boolean itself.
- **`follow()` resets its options.** See the GameView section.
- **`animate()` ignores unknown keys.** Tweening `width`, `height` or `tintColor` silently does nothing — those are instant writes only. There is no `repeat` or `yoyo` either; re-launch from `complete`.
- **`visible: false` removes a sprite from collision too.** That is why pooled bullets and rocks use it instead of removing them from the scene.
- **`scaleX: -1` versus `flipX: true`.** Negative scale flips the physics and hit-test shape with the art; `flipX` mirrors only the drawing. Use `flipX` unless you specifically want the former.
- **Tween positions are absolute.** A sprite with `idleAnimation` on will land off-target; disable the wobble before the tween and re-enable it on `complete`.
- **`music` is chosen at creation.** Creating an effect sound and flipping `music` later does not switch backends.
- **`collision` fires once per overlap-enter**, re-arming only after the shapes separate. A sprite resting inside a trigger does not re-fire — `collisionend` tells you when it left.
- **Pooling a sprite with `visible = false` fires `collisionend`** on whoever was touching it. That is usually what you want (a plate whose ball was despawned closes its door), but a handler that assumes separation means "the player walked away" will misfire.
- **The built-in pixel font only covers ASCII 32..126.** Em dashes, accents and `ñ` render as blanks or garbage — the module's own demos rewrote `—` as `-` for this reason. Ship a BMFont atlas (`tools/genfont.py` rasterizes any TTF) when the game needs accented Spanish text.
- **A bouncy floor switches `onGround` off.** In every resolver the grounding and the `land` event live in the branch taken when the bounce is *damped away*; a contact whose rebound would exceed 40 px/s reflects and grounds nothing. That was always true of a bouncy rider, but `restitution` now mixes as `max(mover, solid)`, so giving a *floor* `restitution: 0.5` silently stops every rider that lands hard on it from ever reporting `onGround` — and a jump gated on `onGround` stops working on that one platform.
- **A two-sided `restitution` cannot be opted out of.** The mix is `max`, not a product or an average, so the springier surface always wins: a deliberately dead `restitution: 0` crate still bounces off a floor set to `0.5`. If one rider must not bounce, the bounce has to live on the riders, not on the surface.
- **A resting body is allowed to sink half a pixel — in some resolvers.** Separation is skipped when the overlap is under 0.5 px, because shoving a gravity-loaded body back out sixty times a second is what makes a settled pile tremble; the closing velocity is still cancelled, so the sink cannot grow past it. It applies to the circle path, the turned-rect path and `'push'` pairs. Plain rect-against-rect still separates in full. Do not derive an exact contact position from `y` after a landing.
- **`linearDamping` is not surface friction.** Nothing checks whether the sprite is touching anything: it bleeds speed on both axes every frame, in the air as much as on the felt, and along a slope as much as across it. It is right for a pool table and wrong for a hill, which is why upstream still lists contact-only friction as unbuilt. A projectile that must keep its arc wants `0`.
- **`linearDamping` kills a slow deliberate drift.** Under a combined 4 px/s the engine zeroes *both* axes outright, since a proportion never reaches zero on its own. A conveyor nudging something along at 3 px/s stops dead the moment that sprite also carries any damping.
- **A swept sprite is not contained and not pushed.** The sweep only considers solids in `solidMode: 'block'` — a `'contain'` boundary would stop the ball against its *outside*, and a `'push'` body is meant to move. So `swept: true` does not stop a fast enough ball from crossing a drum wall between frames; only the static pass contains it. Keep the speeds inside a container below its wall thickness per frame.
- **`'push'` pairs never ground and never fire `land`.** The bilateral resolver moves positions and exchanges velocity and touches nothing else, so a pile of balls resting on each other all read `onGround: false` unless something underneath them is a `'block'` solid.
- **The `'push'` exchange has no masses, no spin and no friction.** A marble and a boulder trade velocity identically, and nothing ever starts rotating from a contact. `restitution` mixes as `max` here too, and with no mass to weight it against, that is the whole model.
- **`swept: true` no longer drags a resting body backwards** (since 2026-08-27). A hit at t = 0 is a contact the sprite is already in, and the static resolver owns it; the sweep used to clamp the sprite back to where the frame started, every frame, while its along-surface speed kept climbing until it broke loose looking launched. On an older build, that is what a swept sprite parked on a slope or a floor does — it is a build date, not your code.
- **The hitbox shapes are exclusive, and an unknown name is `'rect'`.** Setting `hitboxShape` clears whichever of the other two was set, so switching a sprite between `'circle'` and `'rotatedRect'` at runtime is safe, and a typo lands on the default rather than throwing. Reading the property back is therefore also the one clean way to tell whether a build understands `'rotatedRect'` at all.
- **`'rotatedRect'` costs something and only earns it once `rotation` is non-zero.** At zero degrees it produces the same box the default already produces, by a more expensive route. Turn it on for the tilted things, not for everything.
- **`swept` belongs on the fast mover, not on the target.** A stationary thin wall with `swept: true` changes nothing; the bullet is the sprite whose path needs testing.
- **A swept bullet can enter and leave in consecutive frames.** If it crosses a thin target entirely, you get `collision` and then `collisionend` almost immediately — react on the enter.
- **Text `width`/`height` are read-only in practice.** They report the laid-out block; to make text bigger use `scale`.
- **`unload()` is permanent, not a cache eviction.** There is no reload: sprites and text still pointing at an unloaded sheet or font simply stop drawing. Unload a level's atlases after its sprites are gone, never to "free memory" on something still on screen.
- **A tap is a press released within 300 ms**, inside the touch slop (the platform's scaled slop on Android, 8 pt × screen scale on iOS). Hold a button longer and you get `press` and `release` but no `tap` — which is why the demos drive held controls from `press`/`release` and reserve `tap` for discrete hits.
- **`hitboxShape: 'circle'` also changes the touch area**, not just collisions.
- **The hitbox scales do not change the touch area.** `hitTest` runs against the full drawn frame, so a sprite with `hitboxScale: 0.6` still takes taps out to its art's edges. Only the hitbox *shape* reaches touch. Shrink `width`/`height` if a tap target must match the collision box.
- **`hitboxScaleX`/`hitboxScaleY` multiply `hitboxScale`, they do not replace it.** `hitboxScale: 0.85` with `hitboxScaleX: 0.66` gives an effective 0.561 on X and 0.85 on Y. Both default to `1`, so sprites that never set them are unaffected — and `0` still means zero, as everywhere else in the engine.
- **Text `maxWidth` is in font-space px, before `scale`.** The wrap width on screen is `maxWidth * scale`, so a label at `scale: 3` wrapping at 55% of the screen wants `maxWidth: W * 0.55 / 3`. Passing screen pixels straight in produces a block three times too wide.
- **`align` centers against the widest wrapped line, not against `maxWidth`.** The block's `width` is what the glyphs actually occupied, so a short wrapped line is not centered inside the wrap column — anchor the sprite where the block should sit.
- **A word longer than `maxWidth` overflows rather than breaking mid-word.** There is no hyphenation and no character-level break; a long unbroken token widens the block past the limit.
- **Every blend-mode change costs a batch flush.** Group same-blend sprites on their own `zIndex` band; alternating modes sprite by sprite degrades toward one draw call each.
- **`glowColor` alone draws nothing.** The glow pass only runs when `glowBlur > 0` *and* `glowOpacity > 0`; both default in a way that makes `glowColor` on its own a no-op (`glowBlur` is `0`). Always set the blur radius with the color.
- **`followPath` overrides position absolutely.** The path is applied after velocity and gravity have been integrated and writes `x`/`y` outright, so a path-driven sprite ignores its own physics for placement. Do not expect `velocityX` and a path to add up. A tween on `x`/`y` runs *after* the path in the same frame and wins outright — pick one.
- **A path needs at least two points.** One point (or a non-array) clears the path and logs a warning instead of parking the sprite there.
- **Path movement still carries riders.** It feeds the frame delta like a tweened or velocity-driven solid, so a platform on a `followPath` circuit moves whatever stands on it.
- **`raycast` groups: pass an array, not varargs.** Android accepts both `raycast(x0, y0, x1, y1, ['enemy'])` and loose arguments; iOS reads the fifth argument **only if it is an array**, and otherwise leaves the filter empty — which does not mean "no hit", it means the ray tests **every** sprite carrying a `collisionGroup`. So `raycast(x0, y0, x1, y1, 'enemy')` works on Android and, on iOS, silently answers a different question: a wall the ray was never meant to see now blocks the line of sight. Write the array and it works on both.
- **`raycast` only sees `visible`, non-`screenFixed` sprites carrying a `collisionGroup`.** A hidden pooled sprite is invisible to the ray, which is usually what you want; an untagged wall is invisible too, which usually is not. HUD sprites are skipped by design, so a screen-fixed score never blocks a world-space line of sight.
- **`raycast` is a discrete query, not a sensor.** Calling it from a game-clock timer or a tap handler is the intended use. Calling it every frame from JS puts exactly the bridge traffic in the loop that the whole engine exists to avoid.
- **`findPath` walks the sprite's center, not its silhouette.** The waypoints are a line through free grid cells, so a body wider than a cell clips corners unless you pass `clearance` (roughly half the walker's width) or shrink `cellSize`. Obstacles are read from the **hitbox**, so `hitboxScale`, the per-axis scales and `hitboxShape: 'circle'` shape the walkable space too.
- **`findPath` sees fully solid TileLayer cells, not one-way cells.** One-way platforms answer non-solid to the path grid so a top-down route may cross them. If that is not correct for the game's navigation rules, maintain a separate fully solid navigation layer or cell overrides.
- **`findPath` returning `null` is not always "no route".** Degenerate `bounds`, `cellSize <= 0` and a grid over ~1M cells all return `null` as well — a `bounds` rect of the whole world at `cellSize: 4` fails silently that way. Check the numbers before blaming the maze.
- **A path of one or two points is the straight-line case, not a bug.** With nothing in the way `findPath` returns just `[start, goal]`; `path.length < 2` is the guard the demos use to detect a tap outside `bounds`.
- **Game-clock timers are not `setTimeout`.** `after`/`every` freeze at `timeScale: 0` and pause with the render loop — which is why spawn waves belong there — but a pause menu that needs a real countdown still needs `setTimeout`.
- **`screenFixed` beats `scrollFactor`.** Setting both leaves the sprite screen-fixed; the parallax offset is skipped entirely.
- **Ghost lines along a frame's edge are a filtering artifact, not bad art.** A magnified `smoothing: true` sheet samples past the frame border — 1px seams, or the next row's heads at the bottom. Grid sheets have inset UVs upstream since 2026-08-19; an atlas needs padding and extrude at pack time, and an older module build needs either `smoothing: false` or a rebuild.
- **An animation that rocks side to side on a smoothed grid sheet dates the build.** Until 2026-08-24 the inset was applied only to the edge facing a neighbour, so the first and last frame of a strip came out half a texel wider than the rest with their centres a quarter texel to opposite sides — a cycle through them wobbles, most visibly on hard-edged art. Fixed by insetting both edges of any multi-frame axis. Unreachable with `smoothing: false`, which is why it went unnoticed for so long: check the build date before redrawing the art.
- **An attached sprite matches its target's world `x`/`y`, not where the target is *drawn*.** Give the attachment the same `scrollFactor` as its target, or a tag on a parallax sprite drifts off it as the camera travels — the two are pinned in world space and then drawn at different offsets.
- **A cross-space attachment is converted with the camera from the previous frame.** Attachments are applied before the camera update, so a `screenFixed` tag on a world sprite (or the reverse) lags by one frame while the camera is moving. Same-space attachments — the normal case — are exact.
- **Removing a sprite removes everything attached to it.** Pooling the owner with `visible = false` does not, but `gameView.remove(owner)` takes the tag, the health bar and anything chained off them. `detach()` first to keep one.
- **`attachedTo` is read-only.** Assigning to it stores a value on the proxy that the engine never reads — use `attachTo()` / `detach()`.
- **Inherited opacity is invisible from JS.** An attached sprite's `opacity` still reads back as its own value, however faded its owner is; the product is computed natively at draw time and is not exposed. There is nothing to read to find out what is actually on screen.
- **A faded owner stops its tags taking taps.** The inherited opacity goes through the same hit test as a sprite's own, so a tag on an owner at `opacity: 0` is untouchable even though its own `opacity` still says 1 — the pooling idiom of hiding an owner now silently disarms its attached buttons too.
- **`animate()` takes a percentage only on `scale`.** Inside the tween options `scaleX`, `scaleY` and `opacity` are read as plain numbers on both platforms, so `animate({ opacity: '50%' })` does not do what the property setter would. Percentages are for property writes; keep tween targets numeric.
- **A bad ratio or anchor name fails differently per platform.** Android keeps the value the property already held; iOS resets it to the property's default. Neither throws, both log a warning, and at creation time they agree — the split only shows on a write to a property already set to something else.
- **Four TileLayer inputs are creation-time for portable code.** iOS rebuilds after live writes to `legend`, `firstGid`, `cols`, and `rows`; Android exposes only creation-dict handling (plus `cols`/`rows` getters). Put all four in `createTileLayer()` and replace `data` for a live rebuild.
- **`removeAllSprites()` does not clear every scene list.** It removes Sprite/Text objects and resets their attachments; emitters, ropes, and TileLayers remain until individually removed.
- **`anchor` beats `anchorX`/`anchorY` in the same `createSprite` call**, whatever the key order in the object, because the engine applies the preset after the two axes. Pass one or the other, not both.
- **`scrollFactor` does not move the sprite.** It shifts where the sprite is *drawn* and maps touch back to match. `x`, `y`, physics and collisions stay in world coordinates, so a `scrollFactor: 0.5` platform still collides where its world `x` says, not where it looks.
