# ti.game API reference

Complete JS surface of `ti.game` as of upstream `main` on 2026-08-19, verified against the module source (`android/src/ti/game/*.java` and `engine/*.java`, mirrored by `ios/Classes/TG*`). Defaults come from the engine fields, not from prose. The manifest still reads `0.3.0`; the text engine (`createFont`/`createText`), `screenFixed`, `swept`, `collisionend`, `followPath`, animation chaining, `raycast`, the game-clock timers, `scrollFactor` and the `multiply`/`screen` blend modes all landed after it and are not in any numbered release yet.

Every property listed is **live**: reading returns the current native value, even mid-drag or mid-tween. Every property can also be passed to its `create*` factory. All durations crossing the JS boundary are **milliseconds** (the engine converts to seconds internally).

## Contents

- [Module](#module)
- [GameView](#gameview)
- [SpriteSheet](#spritesheet)
- [Sprite](#sprite)
- [Font](#font)
- [Text](#text)
- [Sound](#sound)
- [Emitter](#emitter)
- [Rope](#rope)
- [Events at a glance](#events-at-a-glance)
- [Gotchas the property tables do not show](#gotchas-the-property-tables-do-not-show)

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

Easing constants (for `sprite.animate({ easing })`): `Game.EASE_LINEAR`, `Game.EASE_IN`, `Game.EASE_OUT`, `Game.EASE_IN_OUT`, `Game.EASE_BOUNCE`, `Game.EASE_ELASTIC`.

## GameView

A normal Titanium view — add it to a window or any container, size it with the usual Titanium properties.

| Member | Type | Default | Notes |
| --- | --- | --- | --- |
| `add(object)` / `add([objects])` | method | — | Accepts Sprite, Emitter or Rope. An array crosses the bridge once and is committed under a single native scene lock — build a level into an array and add it in one call |
| `remove(object)` | method | — | Remove one object from the scene |
| `removeAllSprites()` | method | — | Clear the whole scene |
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
| `after(ms, callback)` | method | — | Runs `callback` once after `ms` of **game time** — the delay stretches under `timeScale` slow motion, freezes at `0` and pauses with the render loop, unlike `setTimeout`. Returns an int id. The callback receives `{ id }` |
| `every(ms, callback)` | method | — | Like `after()`, repeating until cancelled. Fires at most once per frame, and restarts its interval after a stall instead of bursting to catch up |
| `cancelTimer(id)` | method | — | Cancels a timer from `after()` / `every()` |
| `cameraEffect` | string | `'none'` | Fullscreen shader pass: `'none'`, `'tint'`, `'glitch'`. With `'none'` the extra pass is skipped entirely |
| `cameraTint` | string | — | Color for the `'tint'` effect, e.g. `'#4f8'` (night vision, poison, flashback) |
| `cameraEffectIntensity` | float | `1` | 0..1 — tint mix or glitch amount |
| `debug` | bool | `false` | Draw collision shapes for every sprite in the scene |

Events: `press`, `tap`, `release` — fired for **every** touch anywhere on the view, with payload `x`, `y` in scene coordinates (tap-anywhere controls, flappy-style). And `resize` with payload `width`, `height` — the real surface size in pixels.

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

## SpriteSheet

Create one sheet per texture and share it across every sprite that uses it — sprites sharing a sheet batch into a single draw call.

| Option | Default | Notes |
| --- | --- | --- |
| `image` | — | Path to the texture, relative to the resources root (`'assets/hero.png'`) |
| `frameWidth` / `frameHeight` | — | Grid mode: cell size in source pixels. Frames are numbered left-to-right, top-to-bottom, starting at 0 |
| `atlas` | — | TexturePacker JSON (hash or array format) instead of a grid |
| `smoothing` | `true` | `false` = GL_NEAREST, the pixel-art setting. On a **grid** sheet, `true` also insets the interior frame UVs by half a texel so magnified edges cannot sample the neighbouring frame; outer edges keep the exact 0..1 range so `tileRepeat` still wraps. Atlas frames come from the JSON untouched |
| `repeat` | `false` | GL_REPEAT wrap, required by sprites using `tileRepeat`. Needs power-of-two texture dimensions |

| Member | Notes |
| --- | --- |
| `frameCount` | Number of frames. `0` until the texture has loaded, for grid sheets |
| `frameNames` | Sorted frame names — atlas sheets only |
| `frameIndex(name)` | Index for an atlas frame name, `-1` if unknown |

Textures upload to the GPU lazily on first use, from the render thread, and are re-created automatically after an EGL context loss.

## Sprite

### Transform

| Property | Default | Notes |
| --- | --- | --- |
| `x`, `y` | `0` | Position of the **anchor**, not the top-left corner |
| `width`, `height` | frame size | `0` means "use the sheet frame size" |
| `scale` | `1` | Write-only convenience that sets both axes |
| `scaleX`, `scaleY` | `1` | Negative values flip *and* affect physics/hit testing — prefer `flipX`/`flipY` for pure mirroring |
| `rotation` | `0` | Degrees, clockwise |
| `anchorX`, `anchorY` | `0.5` | `0/0` = top-left, `0.5/0.5` = center, `0.5/1` = bottom-center (useful for feet) |
| `opacity` | `1` | |
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
| `restitution` | `0` | 0..1 bounce factor against solids |
| `oneWay` | `false` | On the **solid**: pass-through except for landings on its top edge — classic platformer floors |
| `carryRiders` | `true` | On the **solid**: a moving solid carries whoever stands on it (velocity, tweens, idle wobble — wrap teleports excluded). Set `false` for world-scroll terrain that moves while the player is meant to stay put |

### Collision

| Property | Default | Notes |
| --- | --- | --- |
| `collisionGroup` | — | The tag *this* sprite carries |
| `collidesWith` | — | Array of groups this sprite reports overlaps with |
| `hitboxScale` | `1` | Shrinks the collision box around the anchor |
| `hitboxShape` | `'rect'` | `'circle'` — radius = half the smaller drawn side × `hitboxScale`. Circles resolve against solids along the contact normal (corner bounces) and get a round touch area |
| `swept` | `false` | Test this sprite's movement as a **path** (swept AABB), not just at the end position, so a fast mover cannot tunnel between frames. Applies to both `collidesWith` events and `solidWith` blocking (the sprite is clamped to the impact point, then resolved by the normal static pass). Circle hitboxes sweep as their bounding box. Set it on the *mover* — the bullet, not the wall |
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

`animate()` accepts exactly these keys — anything else is silently ignored: `x`, `y`, `scale`, `scaleX`, `scaleY`, `rotation`, `opacity`, `glowOpacity`, `duration` (ms), `delay` (ms), `easing`, `frame` (the sheet frame to set once the tween finishes). Re-calling `animate` from the `complete` handler is still how a ping-pong or a blink is built (there is no `repeat`/`yoyo` yet), but a fixed route is now `followPath` instead of a chain of tween legs.

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
| `land` | `x`, `y`, `other`, `group` | Landed on top of a `solidWith` solid. `other` is the solid — read it to react to what you landed on (trampolines, hazards) |

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
| `width`, `height` | laid-out size | **Derived, not settable** — the glyph layout drives the size, and with it the anchor, hit test, AABB and `ySort` bottom edge |

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

## Events at a glance

Only these events exist. Nothing fires per frame, and events are only fired if a listener is registered.

- **GameView**: `press`, `tap`, `release`, `resize`, `timer`
- **Sprite** (and therefore **Text**): `press`, `release`, `tap`, `dragstart`, `drag`, `dragend`, `pinch`, `rotate`, `animationcomplete`, `complete`, `pathcomplete`, `collision`, `collisionend`, `land`
- **SpriteSheet, Font, Sound, Emitter, Rope**: none

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
- **`swept` belongs on the fast mover, not on the target.** A stationary thin wall with `swept: true` changes nothing; the bullet is the sprite whose path needs testing.
- **A swept bullet can enter and leave in consecutive frames.** If it crosses a thin target entirely, you get `collision` and then `collisionend` almost immediately — react on the enter.
- **Text `width`/`height` are read-only in practice.** They report the laid-out block; to make text bigger use `scale`.
- **`hitboxShape: 'circle'` also changes the touch area**, not just collisions.
- **Every blend-mode change costs a batch flush.** Group same-blend sprites on their own `zIndex` band; alternating modes sprite by sprite degrades toward one draw call each.
- **`glowColor` alone draws nothing.** The glow pass only runs when `glowBlur > 0` *and* `glowOpacity > 0`; both default in a way that makes `glowColor` on its own a no-op (`glowBlur` is `0`). Always set the blur radius with the color.
- **`followPath` overrides position absolutely.** The path is applied after velocity and gravity have been integrated and writes `x`/`y` outright, so a path-driven sprite ignores its own physics for placement. Do not expect `velocityX` and a path to add up. A tween on `x`/`y` runs *after* the path in the same frame and wins outright — pick one.
- **A path needs at least two points.** One point (or a non-array) clears the path and logs a warning instead of parking the sprite there.
- **Path movement still carries riders.** It feeds the frame delta like a tweened or velocity-driven solid, so a platform on a `followPath` circuit moves whatever stands on it.
- **`raycast` groups: pass an array, not varargs.** Android accepts both `raycast(x0, y0, x1, y1, ['enemy'])` and loose arguments; iOS reads only the array. Write the array and it works on both.
- **`raycast` only sees `visible`, non-`screenFixed` sprites carrying a `collisionGroup`.** A hidden pooled sprite is invisible to the ray, which is usually what you want; an untagged wall is invisible too, which usually is not. HUD sprites are skipped by design, so a screen-fixed score never blocks a world-space line of sight.
- **`raycast` is a discrete query, not a sensor.** Calling it from a game-clock timer or a tap handler is the intended use. Calling it every frame from JS puts exactly the bridge traffic in the loop that the whole engine exists to avoid.
- **Game-clock timers are not `setTimeout`.** `after`/`every` freeze at `timeScale: 0` and pause with the render loop — which is why spawn waves belong there — but a pause menu that needs a real countdown still needs `setTimeout`.
- **`screenFixed` beats `scrollFactor`.** Setting both leaves the sprite screen-fixed; the parallax offset is skipped entirely.
- **Ghost lines along a frame's edge are a filtering artifact, not bad art.** A magnified `smoothing: true` sheet samples past the frame border — 1px seams, or the next row's heads at the bottom. Grid sheets have inset UVs upstream since 2026-08-19; an atlas needs padding and extrude at pack time, and an older module build needs either `smoothing: false` or a rebuild.
- **`scrollFactor` does not move the sprite.** It shifts where the sprite is *drawn* and maps touch back to match. `x`, `y`, physics and collisions stay in world coordinates, so a `scrollFactor: 0.5` platform still collides where its world `x` says, not where it looks.
