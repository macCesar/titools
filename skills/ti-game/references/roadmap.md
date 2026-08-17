# What does not exist yet — and what to do instead

The most expensive mistake with `ti.game` is writing code against a feature that sounds like it should be there because Phaser, Godot or Cocos has it. This file is the guard rail: everything below is **absent from 0.3.0**, with the workaround that is idiomatic today.

Planned items come from the module's `TODO.md`. Planned is not shipped — when a game needs one of these, use the workaround and keep the code isolated enough to swap later.

## Not available today

| You might reach for | Status | What to do now |
| --- | --- | --- |
| `Game.createText()`, bitmap fonts, text sprites | Planned (priority 5) | Overlay `Ti.UI.Label` views on the window, above the GameView. Costs: labels are screen-fixed, so they do not scroll with the camera, do not z-sort against sprites and cannot be tweened by the engine |
| A tilemap layer, Tiled JSON import, collision layer | Planned (priority 4) | One sprite per tile. Fine at 12×15, dead at 200×200. For large ground planes use a single `tileRepeat` sprite instead of a grid, and add sparse invisible solids for collision |
| `sprite.parent`, attaching a turret to a tank, a hat to a hero, multi-part bosses | Planned (priority 7), the biggest structural item | Move the parts together from JS on the same coarse tick, or bake the combination into sheet frames. There is no transform inheritance |
| `gameView.raycast(...)`, line-of-sight, ground probes | Planned (priority 3) | Compare positions in JS on a decision timer, or place an invisible trigger sprite where the probe would land and listen for `collision` |
| Native virtual joystick or d-pad bound to a sprite | Planned (priority 6) | Overlaid Titanium views, one per button, writing `velocityX`/`steering`/`throttle` on `touchstart`/`touchend`. Sibling views get simultaneous pointers, so multitouch works |
| Gamepad support | Planned (priority 6) | Nothing native. Touch controls only |
| `blend: 'multiply'` or `'screen'` | Planned (priority 2) | Only `'normal'` and `'add'` exist. For darkening, use `tintColor` (multiplicative) on the sprite itself |
| Swept AABB so fast bullets stop tunneling | Planned (priority 3) | Cap bullet speed, or enlarge the hitbox along the travel axis with `hitboxScale` — the asteroids demo uses `hitboxScale: 1.4` on its bolts for exactly this |
| Slopes in platformer terrain | Planned (priority 3), conditional | Build slopes as stepped rectangles, or keep terrain flat |
| Per-frame animation events (footstep on frame 3) | Planned (priority 9) | Use `animationcomplete` on a short non-looping animation, or a timer aligned to the animation's fps |
| `play('attack', { then: 'idle' })` chaining | Planned (priority 9) | Handle `animationcomplete` and call `play()` from it |
| `sprite.followPath([points], ...)` | Planned (priority 9) | Chain tweens: call `animate()` again from the `complete` handler, one leg per call |
| `playbackRate`, pitch jitter, stereo pan, `fadeTo()` on sounds | Planned (priority 8) | Only `volume`, `loop`, `play`, `pause`, `stop` exist. Ship a few pre-pitched variants of a sample and alternate between them |
| An fps / draw-call / sprite-count overlay | Planned (developer experience) | `debug: true` draws collision shapes only. There is no stats overlay and no `performance` event — measure with platform tooling |
| TypeScript definitions (`ti.game.d.ts`) | Planned (developer experience) | None yet |
| Aseprite JSON import | Planned (developer experience) | TexturePacker JSON (hash or array) is the only atlas format |
| A `stop()` for the whole scene | Not planned — already covered | `gameView.timeScale = 0` freezes everything the engine ticks while rendering and touch keep running. `gameView.pause()` stops the render loop entirely |
| Tweening `width`, `height`, `tintColor` | Not planned | `animate()` only handles `x`, `y`, `scale`, `scaleX`, `scaleY`, `rotation`, `opacity`, `glowOpacity`, plus `frame` at the end. Everything else is an instant write |
| Standard Titanium touch events on the GameView | By design | The view fires its own `press`, `tap`, `release` with scene coordinates. Sprites fire the richer set. Overlaid Titanium views keep their normal events |
| A per-frame event to hook your own logic into | By design, never | The whole architecture exists to keep JS out of the frame loop. Use `collision`, `land`, `complete`, `animationcomplete`, or a coarse timer for decisions |

## Deliberately out of scope

The module's own `TODO.md` rules these out, each being a project the size of everything built so far:

- **2D lighting and shadows.** If it ever comes up: a screen-dim overlay plus additive light sprites (`blend: 'add'`) gets 90% of the look for 1% of the cost.
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

## Checking the current state

This file describes 0.3.0. Before relying on any "planned" item being still absent — or on a workaround still being necessary — read `TODO.md` and `README.md` at https://github.com/m1ga/ti.game, the module's upstream repo. `README.md` there is the canonical API documentation; the `documentation/` folder only points at it. The priorities quoted above are the maintainer's, not a roadmap this skill decides.
