# Upstream example catalog

Verified against all 33 self-contained demos under `ti.game@d587081:example/` plus the launcher `example/app.js`.

The demos prove that API combinations run together on the current module. They are **not** production templates: most keep state in one file, repeat launcher/back-button plumbing, and still use pre-ES6 syntax. Start from the closest demo, retain the demonstrated engine calls, then apply the focused structure and cleanup patterns in this skill.

| Demo | What it proves | Production-oriented reference |
| --- | --- | --- |
| `basic.js` | Sheets, frame animation, drag/pinch/rotate, tween completion | [Scaffolding](patterns.md#the-scaffolding) |
| `puzzle.js` | Multi-touch drag, press-to-lift, snapping and tween-back | [Cards and board games](recipes-adventure-effects.md#cards-and-board-games) |
| `flappy.js` | Gravity impulse, invisible score/death zones, wrapping parallax | [Tap-to-flap](recipes-action.md#tap-to-flap) |
| `platformer.js` | `solidWith`, `land`, `oneWay`, carried rider, camera follow, multi-touch controls | [Platformer](recipes-action.md#platformer) |
| `volley.js` | Restitution ball, `land`, collision response, coarse AI timer | [Ball sports](recipes-action.md#ball-sports--breakout-physics) |
| `racing.js` | `carMode`, drift, skid marks, checkpoints and lap state | [Top-down racer](recipes-action.md#top-down-racer) |
| `cards.js` | Dealing, fanned layout, selection tweens and idle wobble | [Cards and board games](recipes-adventure-effects.md#cards-and-board-games) |
| `asteroids.js` | Thrust, angular velocity, wrapping, pooling, additive bolts, effect/music audio | [Space shooter](recipes-action.md#asteroids--space-shooter) |
| `topdown.js` | Small string map made from sprites, `ySort`, eight-way input, decision timer | [Top-down / Zelda](recipes-action.md#top-down--zelda) |
| `skate.js` | Endless-runner pooling, carried/uncarried terrain, parallax, emitter and audio hooks | [Endless runner](recipes-action.md#endless-runner) |
| `pointclick.js` | Tap-to-walk with `findPath` → `followPath`, hotspots and `ySort` | [Point-and-click](recipes-adventure-effects.md#point--click-adventure) |
| `particles.js` | Continuous/burst emitters, sprite target, HUD telemetry | [Particles](recipes-adventure-effects.md#particles) and [debugging](debugging-performance.md) |
| `rhythm.js` | Pooled notes, native velocity, `press` pads, timing and audio feedback | [Rhythm game](recipes-action.md#rhythm-game) |
| `camera.js` | Two-axis follow, bounds, zoom, shake, camera effects, parallax and debug HUD | [Camera work](recipes-adventure-effects.md#camera-work) |
| `rope.js` | Rope pinned to a sprite, fixed head, tail weight | [Ropes and chains](recipes-adventure-effects.md#ropes-and-chains) |
| `flip.js` | Draw-only flips driven by direction and inverted gravity | [Visual effects](recipes-adventure-effects.md#visual-effects) |
| `hitbox.js` | Global/sprite debug overlays and per-axis hitbox correction | [Seeing the hitbox](patterns.md#seeing-the-hitbox--hitboxjs) |
| `blend.js` | Normal/add/multiply/screen modes and `flash()` | [Visual effects](recipes-adventure-effects.md#visual-effects) |
| `text.js` | Screen-fixed HUD, world labels, text buttons, word wrap and `attachTo` | [HUD](patterns.md#hud--textjs-flappyjs) |
| `swept.js` | Identical fast bullets with and without continuous sweep | [Object pooling](patterns.md#object-pooling) and [API gotchas](api.md#gotchas-the-property-tables-do-not-show) |
| `path.js` | Looped/smoothed paths, one-shot paths and animation chains | [Patrol routes](patterns.md#patrol-routes-and-animation-chains--pathjs) |
| `raycast.js` | Line of sight, ledge probes and tap-fired hitscan | [Raycast pattern](patterns.md#line-of-sight-ledge-probes-and-hitscan--raycastjs) |
| `zones.js` | `collision`/`collisionend`, pressure plate and removal during contact | [Zones](patterns.md#zones-you-can-be-inside-of-enter--exit--zonesjs) |
| `demoscene.js` | Follow-path circles, per-character scroller, glow, blend and music | [Visual effects](recipes-adventure-effects.md#visual-effects) |
| `maze.js` | Raw/simplified A*, re-pathing AI and path visualization | [Pathfinding](patterns.md#pathfinding-around-obstacles--mazejs-pointclickjs) |
| `timescale.js` | Slow/frozen scene, engine timer versus real-time interval | [Game-clock timers](patterns.md#timers-on-the-game-clock) |
| `circles.js` | Rect/circle/rotated-rect solids and `block` versus bilateral `push` | [Shaped solids](patterns.md#shaped-solids-ramps-round-posts-and-bodies-that-push-back--slopesjs-circlesjs-pooljs-drumjs) |
| `slopes.js` | Rotated-rect ramp normals and restitution supplied by a surface | [Shaped solids](patterns.md#shaped-solids-ramps-round-posts-and-bodies-that-push-back--slopesjs-circlesjs-pooljs-drumjs) |
| `plinko.js` | Circular pegs, swept balls and trigger slots | [Shaped solids](patterns.md#shaped-solids-ramps-round-posts-and-bodies-that-push-back--slopesjs-circlesjs-pooljs-drumjs) |
| `pool.js` | Bilateral circle momentum, rails, pockets and linear damping | [Shaped solids](patterns.md#shaped-solids-ramps-round-posts-and-bodies-that-push-back--slopesjs-circlesjs-pooljs-drumjs) |
| `drum.js` | Analytic circular containment and contact-driven impulses | [Shaped solids](patterns.md#shaped-solids-ramps-round-posts-and-bodies-that-push-back--slopesjs-circlesjs-pooljs-drumjs) |
| `wind.js` | `gravityX` as wind and as top-down constant acceleration | [Shaped solids](patterns.md#shaped-solids-ramps-round-posts-and-bodies-that-push-back--slopesjs-circlesjs-pooljs-drumjs) |
| `tilemap.js` | One 120×90 `TileLayer`, visible-cell rendering, cell collision, live edits, A* and HUD | [Tile maps](tilemaps.md) |

## Choosing the right map example

`topdown.js` deliberately creates one sprite per tile for a small 16×12 scene; that remains reasonable when individual tiles need sprite behavior. `tilemap.js` is the reference for large or mostly static grids: one native `TileLayer` avoids ticking, sorting, drawing, and collision-scanning off-screen tile sprites.

## Reading a demo safely

1. Identify the engine-owned behavior being demonstrated.
2. Copy the smallest connected API sequence, not the entire file.
3. Replace `var` and function-expression callbacks with the project's current ES6+ style.
4. Keep resources outside `resize`; create surface-sized scene objects inside one guarded `resize` path.
5. Separate reusable state from launcher UI and add explicit cleanup for app-owned listeners, timers, and sounds.

