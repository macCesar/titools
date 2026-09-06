# Missing, partial, and out-of-scope features

Verified against `ti.game@3bea2f4` (2026-09-02), especially upstream `TODO.md` and both native implementations. Planned is not shipped; partial means the exact boundary below matters.

## Not available today

| Tempting API or capability | Current status | Safe approach |
| --- | --- | --- |
| `gameView.panTo(x, y, options)` | Planned | Tween an invisible sprite, follow it for the cutscene, then follow the player again |
| Full `sprite.parent` transform inheritance | Partial | `attachTo()` supplies position, optional rotation, and inherited opacity. Scale, visibility, flips, tint, hit-test hierarchy, y-sort hierarchy, and a `parent` property do not exist |
| Native joystick/d-pad binding (`joystick.bind(sprite)`) | Planned | Use overlaid Titanium controls that write native motion/input properties on `touchstart`/`touchend`; sibling views support simultaneous touches. Upstream intends the same binding to accept a gamepad's left stick, which also does not exist yet |
| Complete platformer slopes | Partial | `rotatedRect` geometry, normals, rider carrying, and sliding work. Smooth uphill walking, contact-only surface friction, and connected terrain are not implemented |
| Tile animation | Planned TileLayer follow-up | Change ids deliberately or use sprites for the animated cells; there is no per-id native frame cycle |
| `raycast()` against TileLayer cells | Planned TileLayer follow-up | Use sprite colliders for ray-visible obstacles or grid/cell queries appropriate to the game |
| Tile trigger events (`collision`/`collisionend` for water/lava) | Planned TileLayer follow-up | Use sparse invisible trigger sprites or map the mover/world point to cells on a coarse decision/event path |
| `solidimpact` from TileLayer cells | Not implemented | Solid cells block, bounce and ground movers but emit no impact event. Put a sprite solid where the hit must be audible |
| Periodic repetition of `raycast()`, `findPath()`, particles, ropes and skid trails across a `worldWrapX` seam | Not implemented | Those queries and effects see a single linear world. Keep them away from the seam, or resolve the nearest image in JS before calling |
| One-call Tiled loader for tilesets and multiple layers | Planned TileLayer follow-up | Parse the exported JSON in app code and create one TileLayer per layer/tileset |
| Per-frame animation events | Planned | Split an action into short non-looping animations and react to `animationcomplete`, or use an engine timer aligned to a deliberate cadence |
| Ping-pong, repeat/yoyo, random animation offset, per-sprite animation speed | Planned | Author ping-pong frames or re-launch a tween from `complete`; avoid a JS per-frame loop |
| `playbackRate`, pitch jitter, stereo pan, `fadeTo()` | Planned | Current sound API is `volume`, `loop`, `play`, `pause`, `stop`; use prepared variants or a game-clock volume cadence when necessary |
| TypeScript declarations | Planned | No upstream `ti.game.d.ts` exists |
| Aseprite JSON import | Planned | SpriteSheet atlases support TexturePacker JSON hash/array formats |
| Tweening `width`, `height`, or `tintColor` | Not implemented | Tween scale/opacity/glowOpacity; other properties are instant writes |
| A GameView-level `stop()` | Already covered differently | `timeScale = 0` freezes engine ticks while rendering/touch continue; `pause()` stops the render loop |
| Standard Titanium touch events on GameView | By design | Use GameView `press`/`tap`/`release`, sprite events, or Titanium views over the canvas |
| A per-frame JS event | Deliberately absent | React to discrete events and use native movement; coarse `every()` calls are for decisions, not motion |

## Already shipped — do not recreate in JS

- Native `TileLayer`: visible-cell drawing, strings/flat/nested data, Tiled GID offset, solid/one-way cells, live edits, cell lookup, parallax, tint/opacity, and `findPath` participation.
- Debug object form, screen-space performance HUD, optional bitmap `hudFont`, and the opt-in `performance` event.
- Camera follow on both axes, bounds, smoothing, zoom, shake, fullscreen tint/glitch, and per-object `scrollFactor`.
- Text/Font sprites, word wrap, `screenFixed`, attachment, named anchors, percentage ratios, and explicit sheet/font `unload()`.
- Sprite paths, animation chaining, raycasts, A*, game-clock timers, collision exit, swept movers, and four blend modes.
- Shape-aware solids: circle and rotated-rect geometry, one-way platforms, carried riders, containment, bilateral circle push, two-sided restitution, `gravityX`, and `linearDamping`.
- Native wall contacts: `onWallLeft` / `onWallRight`, `wallhit`, TileLayer-wall parity, and `wallSlideSpeed`.
- Native particles, ropes, effect/music sound backends, car physics, thrust, drag/pinch/rotate, and multi-touch sprites.
- Gamepads: normalized `buttondown`/`buttonup` names, throttled `stick`/`trigger`, connect/disconnect events, `gamepads`/`gamepad` snapshots, dead zone and stick-press hysteresis, and release-everything on background or disconnect.
- Circular horizontal worlds: `gameView.worldWrapX` plus per-sprite `wrapWorldX`, seam-aware camera, rendering, touch, overlap, solid resolution and swept movement, and a full-width TileLayer that repeats across the seam.
- Discrete physical impacts: the `solidimpact` event with per-receiver `impactThreshold`, compensated closing speed, shared contact point, opposite normals and mixed restitution, for `block`, `contain` and bilateral `push` responses between sprites.

## Deliberately out of scope upstream

- Full 2D lighting/shadows.
- Skeletal animation such as Spine.
- Box2D-class rigid-body physics: masses, joints, torque, compound bodies, frictional contacts, spin, iterative stacking.
- General render-to-texture. The internal fullscreen camera effect is not a public render-target API.

## Checking a moving target

The manifest number cannot prove a feature exists: it stayed at `0.5.0` across shape-aware solids, the HUD, TileLayer, gamepads, world wrapping and `solidimpact`, and only moved to `0.6.0` in the commit right after the `0.5.0` release was tagged. A locally built artifact stamped `0.5.0` may therefore be weeks older than the published release of the same number. Prefer the build commit/date and safe feature probes such as `typeof Game.createTileLayer === 'function'`. Read a property before writing it; Kroll can preserve unknown writes on a proxy.

Before claiming an item is still absent, re-check upstream `TODO.md`, `README.md`, both platform proxies, and the examples. Source code wins over prose when they disagree.
