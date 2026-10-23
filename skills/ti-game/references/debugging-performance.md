# Debugging and performance telemetry

Reviewed on 2026-10-23 against upstream native `88e181c` and
`macCesar/ti.game@2bf5f82` documentation: both `GameViewProxy` implementations, `DebugHud`, `FrameStats`, both scene renderers, `example/camera.js`, `example/particles.js`, and `example/tilemap.js`.

## The two debug aids

`GameView.debug` accepts a legacy boolean or an object:

```javascript
const gameView = Game.createGameView({
	debug: {
		hitbox: true,
		hud: 'topRight'
	}
});
```

| Form | Meaning |
| --- | --- |
| `debug: true` | Global collision shapes only; shorthand for `{ hitbox: true }` |
| `{ hitbox: true }` | Global sprite and tile-cell collision visualization |
| `{ hud: true }` | Performance HUD in `topLeft` |
| `{ hud: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' }` | HUD in an explicit corner |
| `{ hud: true, hudFont: font }` | HUD drawn with a `Game.createFont()` bitmap font |

Writing the object replaces both modes: omit `hitbox` and it becomes false; omit `hud` and the HUD turns off. Reading `gameView.debug` returns `{ hitbox: boolean, hud: false | corner }`; `hudFont` is configuration, not part of the readback. Sprite-level `sprite.debug` remains a boolean.

The HUD is screen-space and is drawn after the camera effect. Camera scroll, zoom, shake, and glitch do not move or distort it. It starts compact (`FPS`, `MS`, `DC`); tapping it expands/collapses the panel, and the panel consumes its own touches.

## Hitbox colors and tuning

- Green: collision shape after `hitboxScale`, `hitboxScaleX`, and `hitboxScaleY`.
- Blue: full sprite/touch bounds.
- Orange: anchor.
- Tile debug: green outlines fully solid cells; yellow marks one-way top faces.

Tune geometry in this order:

1. Put the correct shape on both mover and solid (`rect`, `circle`, or `rotatedRect`).
2. Set the anchor to the semantic contact point, often `anchor: 'bottom'` for feet.
3. Apply the global hitbox scale.
4. Correct one axis only when the frame padding differs by axis.

The scale properties affect collision, not the touch rectangle. `hitboxShape: 'circle'` does change the touch shape.

## Performance HUD fields

| HUD | Event key | Meaning |
| --- | --- | --- |
| `FPS` | `fps` | Frames recorded in the measurement window; Metal submission does not confirm physical presentation |
| `MS` | `averageCpuMs` | Average engine CPU time per frame; the `maxFps` wait is excluded |
| `P95` | `p95CpuMs` | 95th percentile CPU frame time |
| `MAX` | `maxCpuMs` | Worst CPU frame in the window |
| `DROP` | `droppedFrames` | Presentation intervals longer than one target refresh |
| `SPRITES` | `visibleSprites` / `sprites` | Drawn sprites / sprites in the scene |
| `EMITTERS` | `emitters` | Emitters in the scene |
| `PARTICLES` | `particles` | Live particles |
| `DRAWCALLS` | `drawCalls` | Scene draw calls; HUD draw calls excluded |
| `TEXSWITCH` | `textureSwitches` | Texture switches |
| `UPDATE` | `averageUpdateMs` | Physics, animation, tween, and scene update time |
| `TEXTURE` | `averageTexturePrepareMs` | Texture preparation/upload time |
| `BATCH` | `averageBatchMs` | Batching and drawing time |
| `PRESENT` | `averagePresentMs` | Apple only: CPU time acquiring a Metal drawable and submitting presentation; excludes GPU execution |
| `PRESENTFAIL` | `presentFailures` | Apple only: missing drawables and reported command errors |

The event also includes `surfaceWidth` and `surfaceHeight`. Android omits `averagePresentMs` and `presentFailures`; do not interpret missing keys as zero.

## Programmatic telemetry

The `performance` event fires at most once per second and only while a listener exists:

```javascript
function onPerformance({ fps, averageCpuMs, drawCalls, textureSwitches }) {
	Ti.API.info(`${fps} fps; ${averageCpuMs.toFixed(1)} ms; ${drawCalls} calls; ${textureSwitches} switches`);
}

gameView.addEventListener('performance', onPerformance);

function cleanup() {
	gameView.removeEventListener('performance', onPerformance);
}
```

Telemetry is opt-in inside the renderers. With the HUD disabled and no `performance` listener, telemetry timing and HUD drawing are skipped. The simulation clock still runs. Use the HUD while developing; use the event for short diagnostic sessions or a deliberate in-app performance screen, not permanent per-frame business logic.

## Reading the numbers

- High draw calls with stable sprite count: inspect texture order, blend changes, glow/flash, ropes, skid marks, and debug overlays.
- High texture switches: pack related art into fewer sheets and group sprites using the same sheet/blend into coherent `zIndex` bands.
- High update time: narrow collision groups and reduce active colliders/particles; hidden sprites are excluded from render and collision.
- A large `TileLayer` should keep draw calls and visible work stable while the camera moves; one sprite per tile scales with the whole scene instead.
- `maxFps: 60` can prevent a 120 Hz display from doubling work when the game does not need it.
- Judge final performance on hardware. The Apple backend uses Metal on iPhone, iPad, Simulator and Mac Catalyst. Simulator/host fixture results do not establish physical-device GPU timing or presentation.

The Apple Simulator keeps a 1× logical drawable; physical iPhone/iPad builds
use native screen scale. A frame-cap request is platform scheduling, and a
Metal frame can be skipped when its in-flight slot or drawable is unavailable.
The next successful simulation frame includes elapsed time capped at 0.1 s.
Do not compare telemetry across different drawable scales or call submission
counts a measurement of physically presented frames.

## Common diagnostic order

For a physics discrepancy, record the installed build/commit, surface size,
`timeScale`, input values and actual FPS first. `maxFps` is a cap, not a fixed
physics step. A visible thruster proves an animation state, not acceleration.
Older builds could erase a small first thrust step; current source preserves
effective acceleration and settles coasting after contacts. Rope still uses
per-update damping, but now freezes at zero game delta. See [physics.md](physics.md#time-step-and-frame-rate).

1. Confirm the object was added and is visible/in bounds.
2. Turn on the relevant sprite/layer debug shape, then the global overlay if relationships are unclear.
3. Verify `collisionGroup` is on the target and `solidWith`/`collidesWith` on the mover.
4. Inspect HUD counts and draw calls before changing code.
5. Compare the smallest relevant upstream demo from [examples.md](examples.md).
6. Disable instrumentation after the issue is understood.
