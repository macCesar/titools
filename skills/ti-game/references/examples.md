# Module example catalog

Catalog checked against `macCesar/ti.game@2bf5f82:README.md` (Learn from the examples) and `example/app.js`: 35 demos at the reviewed snapshot, 34 touch-ready entries on phones/tablets and the additional Configurable Input entry on Mac Catalyst (`osname === 'macos'`). The launcher and `backnav.js`, `keyboard.js`, and `pool-viewport.js` are helpers, not demos. The current upstream branch is `m1ga/ti.game@88e181c`; the reviewed checkout adds documentation commit `2bf5f82`. These features are not established by the older `3bea2f4` skill pin. `wallhit` now has one user — `worldwrap.js` counts bolt hits with it — but `wallSlideSpeed` and the `onWallLeft`/`onWallRight` flags still have no demo; for those use [the platformer recipe](recipes-action.md#platformer), verified against both native implementations and the README contract.

The demos show intended API combinations; reading them does not verify an
installed module or device. They are **not** production templates: most keep
state in one file, repeat launcher/back-button plumbing, and still use pre-ES6
syntax. Start from the closest demo, retain the demonstrated engine calls,
then apply the focused structure and cleanup patterns in this skill.

For equations, units, genre selection and frame-rate limits, use
[physics.md](physics.md). Rhythm's 400 ms interval is a quarter note at its
stated 150 BPM; the current source now corrects the older "eighth" comments. Flappy replaces
vertical velocity per tap; it does not add repeated impulses. The curated
Lunar Lander recipe is not an additional upstream demo.

| Demo | What it proves | Production-oriented reference |
| --- | --- | --- |
| `inputmap.js` | Native configurable actions shared across keys/mouse/gamepads; focus ownership, pause contexts, movement/aim/crouch/projectiles and raw input monitor | [Shared digital actions](recipes-action.md#shared-digital-actions) |
| `basic.js` | Sheets, frame animation, drag/pinch/rotate, tween completion | [Scaffolding](patterns.md#the-scaffolding) |
| `puzzle.js` | Multi-touch drag, press-to-lift, free-cell snapping/re-drag, tween-back, solved spin and Restart | [Cards and board games](recipes-adventure-effects.md#cards-and-board-games) |
| `flappy.js` | Gravity with replacement flap velocity, invisible score/death zones, five-gate win/reset and wrapping parallax | [Tap-to-flap](recipes-action.md#tap-to-flap) |
| `platformer.js` | `solidWith`, `land`, `oneWay`, carried rider, camera follow, multi-touch controls, and shared keyboard/gamepad actions | [Platformer](recipes-action.md#platformer) |
| `volley.js` | Restitution ball, `land`, biased player reflection, opponent score/serve, coarse AI and shared keyboard/gamepad actions | [Ball sports](recipes-action.md#ball-sports--breakout-physics) |
| `racing.js` | `carMode`, drift, skid marks, checkpoints and lap state | [Top-down racer](recipes-action.md#top-down-racer) |
| `cards.js` | Five-card deal, three-card selection, glow/wobble, Done play/re-fan and Reset sweep/redeal | [Cards and board games](recipes-adventure-effects.md#cards-and-board-games) |
| `asteroids.js` | Thrust, angular velocity, wrapping, momentum-inheriting pooled/additive bolts, five-rock waves, three-hit lives/invulnerability/reset and audio | [Space shooter](recipes-action.md#asteroids--space-shooter) |
| `topdown.js` | 12-column/15-row sprite map, animated water/solid house, nonblocking depth-sorted trees, eight-way input and companion follow/tree-state AI | [Top-down / Zelda](recipes-action.md#top-down--zelda) |
| `skate.js` | Endless-runner pooling, carried/uncarried terrain, parallax, emitter and audio hooks | [Endless runner](recipes-action.md#endless-runner) |
| `pointclick.js` | Tap-to-walk with `findPath` → `followPath`, hotspots and `ySort` | [Point-and-click](recipes-adventure-effects.md#point--click-adventure) |
| `particles.js` | Continuous/burst emitters, sprite target, HUD telemetry | [Particles](recipes-adventure-effects.md#particles) and [debugging](debugging-performance.md) |
| `worldwrap.js` | `worldWrapX` end to end: seam-aware camera, touch, overlap, solid resolution, swept movement, `wallhit`, and a full-width TileLayer that repeats across the seam | [Circular worlds](api.md#gameview) |
| `rhythm.js` | Pooled notes, native velocity, `press` pads, timing and audio feedback | [Rhythm game](recipes-action.md#rhythm-game) |
| `camera.js` | Two-axis follow, bounds, zoom, shake, camera effects, parallax and screen-space `topRight` debug HUD | [Camera work](recipes-adventure-effects.md#camera-work) |
| `rope.js` | Rope pinned to a sprite, fixed head/tail weight and two draggable ends | [Ropes and chains](recipes-adventure-effects.md#ropes-and-chains) |
| `flip.js` | Draw-only flips driven by direction and inverted gravity | [Visual effects](recipes-adventure-effects.md#visual-effects) |
| `hitbox.js` | Global/sprite debug overlays and per-axis hitbox correction | [Seeing the hitbox](patterns.md#seeing-the-hitbox--hitboxjs) |
| `blend.js` | Normal/add/multiply/screen modes and `flash()` | [Visual effects](recipes-adventure-effects.md#visual-effects) |
| `text.js` | Screen-fixed HUD, world labels, text buttons, word wrap, precomposed ES/DE/NL characters and `attachTo` | [HUD](patterns.md#hud--textjs-flappyjs) |
| `swept.js` | Identical fast bullets with and without continuous sweep | [Object pooling](patterns.md#object-pooling) and [API gotchas](api.md#gotchas-the-property-tables-do-not-show) |
| `path.js` | Looped/smoothed paths, one-shot paths and animation chains | [Patrol routes](patterns.md#patrol-routes-and-animation-chains--pathjs) |
| `raycast.js` | Line of sight, ledge probes and tap-fired hitscan | [Raycast pattern](patterns.md#line-of-sight-ledge-probes-and-hitscan--raycastjs) |
| `zones.js` | `collision`/`collisionend`, pressure plate and removal during contact | [Zones](patterns.md#zones-you-can-be-inside-of-enter--exit--zonesjs) |
| `demoscene.js` | Arc-offset per-character closed-path sine scroller, additive circle-driven copper bars, glowing logo, chained opacity pulse, period-scrolled starfield and music cleanup | [Visual effects](recipes-adventure-effects.md#visual-effects) |
| `maze.js` | Raw/simplified A* dots, tap routes, 800 ms game-clock re-pathing chase and catch/den reset | [Pathfinding](patterns.md#pathfinding-around-obstacles--mazejs-pointclickjs) |
| `timescale.js` | Slow/frozen scene, engine timer versus real-time interval | [Game-clock timers](patterns.md#timers-on-the-game-clock) |
| `circles.js` | Rect/circle/rotated-rect solids and `block` versus bilateral `push` | [Shaped solids](patterns.md#shaped-solids-ramps-round-posts-and-bodies-that-push-back--slopesjs-circlesjs-pooljs-drumjs) |
| `slopes.js` | Rotated-rect ramp normals and restitution supplied by a surface | [Shaped solids](patterns.md#shaped-solids-ramps-round-posts-and-bodies-that-push-back--slopesjs-circlesjs-pooljs-drumjs) |
| `plinko.js` | 86 circular pegs, swept/push chips, rect dividers, trigger payouts, chosen/random one/ten drops and deduplicated impact audio | [Shaped solids](patterns.md#shaped-solids-ramps-round-posts-and-bodies-that-push-back--slopesjs-circlesjs-pooljs-drumjs) |
| `pool.js` | 16 bilateral push balls, rect rails, circular trigger pockets, felt damping, additive anytime shot, pair-deduplicated impact audio/reset and fitted portrait stage | [Shaped solids](patterns.md#shaped-solids-ramps-round-posts-and-bodies-that-push-back--slopesjs-circlesjs-pooljs-drumjs) |
| `drum.js` | Analytic circular containment, 25 push balls, shake, enter/exit-rearmed tumble strip, separate glass/ball impact audio and pair deduplication | [Shaped solids](patterns.md#shaped-solids-ramps-round-posts-and-bodies-that-push-back--slopesjs-circlesjs-pooljs-drumjs) |
| `wind.js` | `gravityX` as wind and as top-down constant acceleration | [Shaped solids](patterns.md#shaped-solids-ramps-round-posts-and-bodies-that-push-back--slopesjs-circlesjs-pooljs-drumjs) |
| `tilemap.js` | One 120×90 `TileLayer`, visible-cell rendering, cell collision, live edits, A* and HUD relayout on later resizes | [Tile maps](tilemaps.md) |

## Choosing the right map example

`topdown.js` deliberately creates one sprite per tile for a small 12-column by 15-row scene; that remains reasonable when individual tiles need sprite behavior. `tilemap.js` is the reference for large or mostly static grids: one native `TileLayer` avoids ticking, sorting, drawing, and collision-scanning off-screen tile sprites.

## Reading a demo safely

1. Identify the engine-owned behavior being demonstrated.
2. Copy the smallest connected API sequence, not the entire file.
3. Replace `var` and function-expression callbacks with the project's current ES6+ style.
4. Keep resources outside `resize`; create surface-sized scene objects inside one guarded `resize` path.
5. Separate reusable state from launcher UI and add explicit cleanup for app-owned listeners, timers, and sounds.

## Keyboard shortcuts and shared helpers

`keyboard.js` builds a native `inputMap`, dispatches `actiondown`/`actionup`
to the existing gameplay functions, activates/focuses the canvas on window
open/focus, and sets `inputContext = null` on blur/close. It removes its two
action listeners on close. It also focuses immediately because a guarded
scene `resize` may initialize after `Window.open`. This helper replaces the
entire map; merge bindings in app code if the view already owns other actions.
Platformer and Volley route mapped gamepad buttons through the same actions;
do not also dispatch those actions from `buttondown`/`buttonup`.

| Demos | Keyboard shortcuts |
| --- | --- |
| Platformer, Volley | Left/Right, A/D or J/L move; Space/Up/W/I jump; pad d-pad/left stick and A/up use the same actions |
| Flappy, Flip | Space/Up/W flap or restart / invert gravity |
| Skate | Space/Up/W jump or restart |
| Plinko | Space/1 drops one chip; 0 drops ten |
| Pool | R resets; mouse/touch aims |
| Drum | Space shakes; T toggles tumble |
| Circles | Space shoots; D toggles shapes |
| Slopes | R resets; D toggles shapes |
| Zones | Space/R removes or respawns the ball |
| Text | Space scores; R resets; N advances dialog |
| Tilemap | B toggles building; D toggles debug; mouse/touch selects cells |
| Wind | Space drops; Left/Right or A/D changes wind |
| Particles, Blend | Space creates a centered burst / flashes ships |
| Rhythm | A/S/D or Left/Down/Right hits the lanes |
| Swept | Space shoots both lanes; Left/Right or A/D changes speed |
| Camera | Z/X zooms out/in; Space shakes |
| Timescale | 1/2/3/4 selects 1/0.5/0.1/0 speed |

Configurable Input has its own map: A/D, J/L or arrows move; last pressed
left/right wins and releasing it restores the other held direction. Space
or pad A jumps once from the ground. W/I/Up aims up (with horizontal movement
for diagonal shots), S/K/Down crouches while grounded, left canvas click or
pad X fires. The normalized direction keeps diagonal projectile speed equal
to straight shots; crouching changes height while preserving foot position.
Escape switches between gameplay/paused contexts and toggles `timeScale`.
The right/middle mouse bindings are test entries: the reviewed docs report
that they do not trigger on Mac; left click is the verified path.

Instructions remain separate from changing action feedback. The monitor
shows physical key codes/modifiers and pad buttons/sticks/triggers. Focusing
the native text field disables actions and clears held movement; window
focus does not steal that text focus. The focus button or first canvas click
restores game input; that first click does not shoot. Blur/close disables
actions, close cancels projectile-expiry game timers and unloads the four
owned sheets. Run the indirect-input configuration from [project setup](project-setup.md)
before mouse testing on the supported older Apple systems. Physical peripheral
and overlay acceptance is separate from compilation and resolver fixtures.

## Resizable scenes and portrait Pool

The current demos size foreground art against both surface dimensions rather
than letting a wide Mac window enlarge actors beyond its height. Scenes with
native overlay controls derive pixels per view point from
`resize.width / gameView.rect.width`, with a positive finite check and a
logical-density fallback; monitor/display height is not the GameView size.

Pool alone uses `pool-viewport.js`: a 380 by 680 point portrait stage contains
both GameView and native Reset control. Host `postlayout` applies a uniform
`min(hostWidth / 380, hostHeight / 680)` transform and removes that listener on
close. Window resizing fits the running stage; it does not recreate balls,
timers, collision bounds or drag state. Tilemap instead retains its native
map and relays later `resize` values to HUD layout. Plinko fits chip/peg sizes
to horizontal, diagonal and two-row gaps while preserving their proportions;
wide/short scenes must still leave chip-sized passages.

## Running and verification boundaries

From the module's `android/`, use `ti build -p android --sdk 13.4.1.GA` for
the launcher. On Apple, build the module, copy `example/` into a Classic app's
`Resources/` and register the `iphone` module; keep the three helpers when
copying demos that require them. Mac lists Configurable Input; mobile retains
34 touch-ready entries, with the input demo source available for external
peripheral tests. Back uses action-bar Up on Android and a shared overlay on Apple.

The catalog is not exhaustive API acceptance: no dedicated wall-slide/jump or
`unload()` demo exists, nor coverage for every gamepad event or creation-time
option. `worldwrap.js` does exercise `wallhit`. Use native-contract references
for uncovered members and verify the actual installed binary on the target.
