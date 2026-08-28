# Native tile maps

Verified against `ti.game@c216e7f`: upstream `README.md` § Tile maps, `example/tilemap.js`, both `TileLayerProxy` implementations, both native `TileLayer` engines, scene collision, and `Pathfinder`.

Use `Game.createTileLayer()` for a large or mostly static grid. The engine stores the whole map but renders only cells inside the camera, batches the layer through one sheet, checks only collision cells under a mover, and feeds solid cells into `findPath`. A small map whose tiles need independent sprite behavior can still use sprites; `topdown.js` is a 16×12 example of that older pattern.

## Create a layer

```javascript
const tileSheet = Game.createSpriteSheet({
	image: 'assets/tiles.png',
	frameWidth: 16,
	frameHeight: 16,
	smoothing: false
});

const ground = Game.createTileLayer({
	sheet: tileSheet,
	tileWidth: 32,
	tileHeight: 32,
	data: [
		'WWWWWW',
		'W....W',
		'W.FP.W',
		'WWWWWW'
	],
	legend: { W: 3, '.': 0, F: 1, P: 2 },
	collisionGroup: 'water',
	solid: ['W'],
	oneWay: [],
	zIndex: 0
});

gameView.add(ground);
```

`data` accepts nested numeric rows, strings decoded through `legend`, or a flat row-major array accompanied by `cols` and optionally `rows`. Uneven nested rows are padded with empty cells. Negative/unlisted values are empty.

For Tiled JSON, pass the layer data with `cols: map.width`, `rows: map.height`, and the tileset's `firstgid` as `firstGid`. GID 0 becomes empty when `firstGid > 0`, and the three flip bits are stripped. The current renderer does not reproduce Tiled's flip transforms; it resolves the underlying frame id.

## Portable property timing

The upstream README says every property is live, but the native bindings differ. Use the portable contract below:

| Timing | Properties |
| --- | --- |
| Creation-time for cross-platform code | `legend`, `firstGid`, `cols`, `rows` |
| Live on Android and iOS | `data`, `solid`, `oneWay`, `sheet`, `tileWidth`, `tileHeight`, `x`, `y`, `zIndex`, `visible`, `opacity`, `scrollFactor`, `tintColor`, `collisionGroup`, `restitution`, `debug` |
| Read-only | `width`, `height`; `cols` and `rows` reflect the current parsed grid |

iOS rebuilds the grid when `legend`, `firstGid`, `cols`, or `rows` is assigned later. Android exposes no setters for those four. Supplying them in the factory keeps both platforms aligned.

`opacity`, `scrollFactor`, and `restitution` accept ratio numbers or percentage strings. `tileWidth`/`tileHeight`, coordinates, and dimensions do not.

## Collision cells

Give the layer a `collisionGroup`; movers list that group in `solidWith`:

```javascript
const player = Game.createSprite({
	sheet: playerSheet,
	solidWith: ['water'],
	hitboxScale: '65%'
});
```

- `solid` ids block from every side.
- `oneWay` ids catch a mover falling onto the top and do not block sideways or upward movement.
- Rect, circle, and swept movers are supported.
- Layer `restitution` mixes with the mover like restitution on a solid sprite.
- A successful top landing sets `onGround` and fires `land`. A tile cell is not a sprite, so the event has no `other` or `group`.
- A sideways push sets `onWallLeft` / `onWallRight`, applies `wallSlideSpeed`, and can fire `wallhit`. Tile-wall events likewise omit `other` and `group`.
- Adjacent solid cells suppress their shared internal faces, avoiding seams while sliding along a floor.

Android builds before `c216e7f` ignore an ordinary nested JS object passed as `legend`, so string rows decode as empty there. Upgrade or use numeric data on those builds. The fix does not make `legend` live on Android; it remains a factory-time portability input.

Tile cells participate in **solid resolution**, not overlap events. `collidesWith` does not produce `collision`/`collisionend` for trigger tiles yet. `raycast()` also does not inspect tile cells. See [roadmap.md](roadmap.md) before designing those behaviors.

## Read and edit cells

| Method | Result |
| --- | --- |
| `getTile(col, row)` | Frame id, or `-1` when empty/outside |
| `setTile(col, row, id)` | Replaces the art; solid/one-way flags are recalculated from the id lists |
| `isBlocked(col, row)` | Whether the cell is fully solid; one-way cells return `false` |
| `setBlocked(col, row, bool)` | Overrides the cell as fully solid or non-solid without changing its art |
| `tileAt(x, y)` | World point → `{ col, row, tile, solid, x, y }`, or `null` outside |
| `cellAt(col, row)` | Cell → the same structure; `x`/`y` are the cell center |

`setBlocked()` is a cell-level override. Replacing `data`, `solid`, or `oneWay` rebuilds flags and should be treated as ending those overrides.

## Tap-to-walk across a large map

`findPath()` includes fully solid cells when the layer's `collisionGroup` appears in `groups`. One-way cells remain walkable in the path grid.

```javascript
function walkTo(player, destination, tileLayer, gameView) {
	const start = { x: player.x, y: player.y };
	const reach = tileLayer.tileWidth * 20;
	const path = gameView.findPath(start, destination, {
		cellSize: tileLayer.tileWidth,
		groups: [tileLayer.collisionGroup],
		clearance: player.width * 0.3,
		bounds: {
			minX: Math.max(tileLayer.x, start.x - reach),
			minY: Math.max(tileLayer.y, start.y - reach),
			maxX: Math.min(tileLayer.x + tileLayer.width, start.x + reach),
			maxY: Math.min(tileLayer.y + tileLayer.height, start.y + reach)
		}
	});

	if (path && path.length >= 2) {
		player.followPath(path, { speed: tileLayer.tileWidth * 4 });
	}
}
```

Bound the per-query A* search to the useful neighborhood. The layer can be enormous without rendering cost, but `findPath()` still builds a grid for the requested bounds on the calling thread.

## Layering and performance

- Stack separate layers for ground, decoration, and foreground. Layers draw below sprites at the same `zIndex`.
- Share one sheet when layers use the same tileset.
- Use `scrollFactor` for parallax layers; collision remains in world coordinates, just as with sprites.
- Use `visible: false` to exclude the layer from drawing and collision.
- Toggle `layer.debug` for one layer or `gameView.debug = { hitbox: true }` for every layer's solid cells.
- Use the performance HUD while scrolling: map dimensions should not change visible-cell draw cost.
