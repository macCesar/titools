# Debugging and performance telemetry

Verified against `ti.game@3bea2f4`: both `GameViewProxy` implementations, `DebugHud`, `FrameStats`, both scene renderers, `example/camera.js`, `example/particles.js`, and `example/tilemap.js`.

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
- Tile debug: outlines fully solid cells in view.

Tune geometry in this order:

1. Put the correct shape on both mover and solid (`rect`, `circle`, or `rotatedRect`).
2. Set the anchor to the semantic contact point, often `anchor: 'bottom'` for feet.
3. Apply the global hitbox scale.
4. Correct one axis only when the frame padding differs by axis.

The scale properties affect collision, not the touch rectangle. `hitboxShape: 'circle'` does change the touch shape.

## Performance HUD fields

| HUD | Event key | Meaning |
| --- | --- | --- |
| `FPS` | `fps` | Frames presented in the closed one-second window |
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
| `PRESENT` | `averagePresentMs` | iOS only: buffer presentation time |
| `PRESENTFAIL` | `presentFailures` | iOS only: failed presentations |

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

Telemetry is opt-in inside the renderers. With the HUD disabled and no `performance` listener, frame-stat clock reads are disabled. Use the HUD while developing; use the event for short diagnostic sessions or a deliberate in-app performance screen, not permanent per-frame business logic.

## Reading the numbers

- High draw calls with stable sprite count: inspect texture order, blend changes, glow/flash, ropes, skid marks, and debug overlays.
- High texture switches: pack related art into fewer sheets and group sprites using the same sheet/blend into coherent `zIndex` bands.
- High update time: narrow collision groups and reduce active colliders/particles; hidden sprites are excluded from render and collision.
- A large `TileLayer` should keep draw calls and visible work stable while the camera moves; one sprite per tile scales with the whole scene instead.
- `maxFps: 60` can prevent a 120 Hz display from doubling work when the game does not need it.
- Judge final performance on hardware. The iOS Simulator's translated OpenGL path is intentionally rendered at 1× and remains slower than a device.

## Common diagnostic order

1. Confirm the object was added and is visible/in bounds.
2. Turn on the relevant sprite/layer debug shape, then the global overlay if relationships are unclear.
3. Verify `collisionGroup` is on the target and `solidWith`/`collidesWith` on the mover.
4. Inspect HUD counts and draw calls before changing code.
5. Compare the smallest relevant upstream demo from [examples.md](examples.md).
6. Disable instrumentation after the issue is understood.
