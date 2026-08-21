# What does not exist yet — and what to do instead

The most expensive mistake with `ti.game` is writing code against a feature that sounds like it should be there because Phaser, Godot or Cocos has it. This file is the guard rail: everything below is **absent from upstream `main` as of 2026-08-20** (manifest `0.4.0`), with the workaround that is idiomatic today.

Planned items come from the module's `TODO.md`. Planned is not shipped — when a game needs one of these, use the workaround and keep the code isolated enough to swap later.

## Not available today

| You might reach for | Status | What to do now |
| --- | --- | --- |
| A tilemap layer, Tiled JSON import, collision layer | Planned (priority 4) | One sprite per tile. Fine at 12×15, dead at 200×200. For large ground planes use a single `tileRepeat` sprite instead of a grid, and add sparse invisible solids for collision. `findPath` already rasterizes those per-tile sprites, so a tile maze pathfinds today — the planned collision layer is meant to feed the same grid |
| `sprite.parent`, attaching a turret to a tank, a hat to a hero, multi-part bosses | Planned (priority 7), the biggest structural item | Move the parts together from JS on the same coarse tick, or bake the combination into sheet frames. There is no transform inheritance |
| `gameView.panTo(x, y, { duration, easing })` for a cutscene camera move | Planned (priority 1) | `follow()` an invisible sprite and tween that sprite, then `follow()` the player again |
| `maxWidth` word wrap on text sprites | Planned (priority 5) | Break the lines yourself with `\n`. Measure with the font's `charWidth` on a monospace grid font; a proportional font needs a per-glyph tally |
| Ping-pong animation playback, a per-sprite animation speed multiplier, a random start offset | Planned (priority 9) | Author the ping-pong into the sheet as a longer animation. Desync a field of torches by giving each one its own `idleAnimation` timing, or start them from staggered timers |
| Native virtual joystick or d-pad bound to a sprite | Planned (priority 6) | Overlaid Titanium views, one per button, writing `velocityX`/`steering`/`throttle` on `touchstart`/`touchend`. Sibling views get simultaneous pointers, so multitouch works |
| Gamepad support | Planned (priority 6) | Nothing native. Touch controls only |
| Slopes in platformer terrain | Planned (priority 3), conditional | Build slopes as stepped rectangles, or keep terrain flat |
| Per-frame animation events (footstep on frame 3) | Planned (priority 9) | Use `animationcomplete` on a short non-looping animation, or a timer aligned to the animation's fps |
| `playbackRate`, pitch jitter, stereo pan, `fadeTo()` on sounds | Planned (priority 8) | Only `volume`, `loop`, `play`, `pause`, `stop` exist. Ship a few pre-pitched variants of a sample and alternate between them |
| An fps / draw-call / sprite-count overlay | Planned (developer experience) | `debug: true` draws collision shapes only. There is no stats overlay and no `performance` event — measure with platform tooling |
| TypeScript definitions (`ti.game.d.ts`) | Planned (developer experience) | None yet |
| Aseprite JSON import | Planned (developer experience) | TexturePacker JSON (hash or array) is the only atlas format |
| A `stop()` for the whole scene | Not planned — already covered | `gameView.timeScale = 0` freezes everything the engine ticks while rendering and touch keep running. `gameView.pause()` stops the render loop entirely |
| Tweening `width`, `height` | Not planned | `animate()` only handles `x`, `y`, `scale`, `scaleX`, `scaleY`, `rotation`, `opacity`, `glowOpacity`, plus `frame` at the end. Everything else is an instant write — scale instead of sizing |
| Tweening `tintColor`, or `repeat`/`yoyo` on `animate()` | Planned (priority 9) | Re-launch the tween from its `complete` handler for a blink or a ping-pong, and step a tint by writing `tintColor` on a game-clock timer |
| Standard Titanium touch events on the GameView | By design | The view fires its own `press`, `tap`, `release` with scene coordinates. Sprites fire the richer set. Overlaid Titanium views keep their normal events |
| A per-frame event to hook your own logic into | By design, never | The whole architecture exists to keep JS out of the frame loop. Use `collision`, `land`, `complete`, `animationcomplete`, or a coarse timer for decisions |

## Deliberately out of scope

The module's own `TODO.md` rules these out, each being a project the size of everything built so far:

- **2D lighting and shadows.** If it ever comes up: a screen-dim overlay plus additive light sprites (`blend: 'add'`) gets 90% of the look for 1% of the cost, and `blend: 'multiply'` now does contact shadows under sprites.
- **Skeletal animation (Spine).** Frame animations from sheets only.
- **Full rigid-body physics (Box2D class).** What exists — velocity, gravity, solids with penetration resolution, restitution, circle and rect hitboxes, the car model, thrust — covers the target genres. Joints, torque, compound bodies and stacking do not exist.
- **Render-to-texture.** The only offscreen pass is the fullscreen `cameraEffect`.

## Already shipped (do not "work around" these)

Recent additions that are easy to miss and easy to reimplement badly in JS:

- Camera: horizontal and vertical dead-zone `follow`, `cameraBounds`, `smoothing`, `cameraScale` zoom, native `shake`.
- `tintColor`, `flash(color, duration)`, `blend: 'add'`, `tileRepeat` with `repeat: true` sheets.
- `hitboxShape: 'circle'` with contact-normal resolution against solids, `oneWay` platforms, moving solids that carry their riders (`carryRiders` to opt out).
- `createEmitter` particles, `createRope` Verlet ropes with `maxLength` tethers.
- `createSound` with separate low-latency effect and streaming music backends.
- `timeScale`, `maxFps`, `flipX`/`flipY`, `pixelSnap`, `idleAnimation`, `ySort`, `glowColor`/`glowBlur`/`glowOpacity`.
- `gameView.add([array])` committing a whole level in one bridge crossing.
- **Text is in the engine now** (2026-08-18): `createText` glyph sprites with an embedded pixel font, `createFont` for BMFont/AngelCode or monospace grid atlases, `align`/`letterSpacing`/`lineSpacing`, and `tools/genfont.py` to rasterize a TTF. Text objects are sprites — they tween, tint, flash, glow, z-sort and take taps. Do **not** fall back to `Ti.UI.Label` overlays for scores.
- **`screenFixed`** on any sprite: surface coordinates, camera position/zoom/shake ignored, touch mapped back. HUDs no longer need overlay views.
- **`swept: true`** per sprite: the frame's movement is path-tested (Minkowski + slab) for both collision events and solid blocking. Fast bullets stop tunneling; `hitboxScale` tricks along the travel axis are obsolete.
- **`collisionend`**: the exit half of the trigger lifecycle, including when the partner is removed, hidden or re-tagged mid-contact.
- **`followPath(points, opts)` and `play(name, { then })`** (2026-08-19): patrol routes, bullet arcs and animation chains run natively. Do not chain `animate()` legs from `complete`, and do not re-`play()` from an `animationcomplete` handler.
- **`gameView.raycast(x0, y0, x1, y1, groups)`** (2026-08-19): nearest hit as `{ x, y, distance, group, sprite, normal }`, or `null`. Line of sight, ledge probes and hitscan no longer need an invisible probe sprite — but it is a discrete query, not something to poll every frame.
- **Game-clock timers** (2026-08-19): `gameView.after(ms, cb)` / `every(ms, cb)` / `cancelTimer(id)` obey `timeScale` and pause with the render loop. Spawn waves and AI ticks belong here, not in `setTimeout`.
- **`scrollFactor`** (2026-08-19): per-sprite parallax against camera travel. A background layer is one property, not a hand-scrolled pair of copies.
- **`blend: 'multiply'` and `'screen'`** (2026-08-19) join `'normal'` and `'add'`, on sprites and emitters alike.
- **`gameView.findPath(from, to, options)`** (2026-08-20): grid A* around the sprites carrying a `collisionGroup`, returning waypoints ready for `followPath` — the Godot `AStar2D` / GameMaker `mp_grid` equivalent. Tap-to-walk and chasing AI route around obstacles natively now; hand-authored waypoint arrays and straight-line walking are the old workaround. Discrete like `raycast`: taps and AI timers, not per frame.

## Checking the current state

This file describes upstream `main` on 2026-08-20 — a moving target: nine items on this list shipped within four days of the skill being written, four of them in a single day, and the manifest only caught up at the end (`0.3.0` → `0.4.0` on 2026-08-20, after all of them). Before relying on any "planned" item being still absent — or on a workaround still being necessary — read `TODO.md` and `README.md` at https://github.com/m1ga/ti.game, the module's upstream repo. `README.md` there is the canonical API documentation; the `documentation/` folder only points at it. The priorities quoted above are the maintainer's, not a roadmap this skill decides.
