# Status — 2026-08-27

**Phase:** live and maintained. **v4.15.0 shipped on both channels**, working tree clean, 0 commits unpushed, nothing in flight.
**Session by:** Claude Code · Opus 5 (`claude-opus-5`).

## Release state — both channels on 4.15.0

| Channel | Version | Verified today |
|---|---|---|
| npm | 4.15.0 | `curl registry.npmjs.org/@maccesar%2Ftitools` → `dist-tags.latest = 4.15.0` |
| Claude Code marketplace | 4.15.0 | `package.json` and `plugin.json` both read 4.15.0, tag `v4.15.0` pushed, GitHub release created 18:54 UTC |

`publish.yml` ran green on the tag and the `npm publish` step succeeded. **Do not verify with `npm view`** — it served a stale version for minutes after a successful publish during 4.6.1. Query the registry over HTTP, and expect the first read to lag the workflow by a few seconds even then: the read right after `gh run watch` still said 4.14.0, and the retry said 4.15.0.

The suite is **318 tests**, run under an empty `HOME` before each push:

```bash
FAKEHOME=$(mktemp -d) && HOME="$FAKEHOME" npm test; rm -rf "$FAKEHOME"
```

## Shipped in 4.15.0 — the `ti.game` shape-aware solids release

Upstream PR #20 (César's) is the first manifest bump — `0.4.0` → **`0.5.0`** — that carries a feature set of its own rather than trailing one. The solid's own shape now takes part in the resolution: `hitboxShape: 'rotatedRect'`, circular solids resolved as circles, `solidMode: 'contain'` / `'push'`, `gravityX`, `linearDamping`, and `restitution` read off both sides of a contact. 3,694 lines and six new demos, which took the module's example count from 26 to 32.

The skill was audited against the Android engine read in full (`Scene.java`, `Sprite.java`, `SpriteProxy.java`) plus the six demos; iOS parity was checked by grep for the same constants and functions (`TGSlop = 0.5f`, the 40 px/s bounce floor, the 4 px/s damping stop, `resolveBilateralPairs`, the three `solidMode` branches) and **not** read line by line. `api.md` gained a resolver matrix read from the dispatch rather than from prose, and eleven gotchas upstream's README does not state. Six of them have teeth:

- A floor given `restitution` switches `onGround` off for anything landing hard on it — grounding lives in the branch taken when the bounce is damped away, and the mix is `max`, so it cannot be opted out of per rider.
- `solidMode` is only consulted when the **mover** is a circle. A rect inside a `'contain'` boundary is pushed out, not held in.
- The swept pass skips every solid that is not `'block'`, so `swept: true` does not keep a fast ball inside a drum.
- `linearDamping` never checks contact: it brakes in the air as much as on the felt, and zeroes both axes under a combined 4 px/s.
- `'push'` degrades silently to one-sided shoving unless both sprites are circles, both are `'push'`, and each lists the other's group.
- A resting body sinks up to half a pixel in the circle, turned-rect and `'push'` paths — but not in plain rect-against-rect.

`roadmap.md` moved slopes out of "does not exist" and into **partly shipped**, which is the shape most of that table will take from here: the geometry landed, the platformer feel did not.

## The pattern this repo now runs on

Three releases in three days, each one an audit of a same-week upstream change, and 4.13.0 shipped a claim that was false within hours of the tag. The dated build table in `project-setup.md` is what absorbs that; it now has seven rows. The manifest number is a floor, never a feature list — two builds calling themselves `0.4.0` differ by more than `0.4.0` and `0.5.0` do.

The audit's value keeps landing in the same place: never a property, always what happens where two of them meet. That measurement is what justified sending six clauses upstream as m1ga/ti.game#18 rather than proposing a README rewrite.

## Sibling parity — aiskills 1.21.0

| Repo | npm | Tests | `scripts/` | `release-docs` test |
|---|---|---|---|---|
| titools | 4.15.0 | 318 | yes | yes |
| aiskills | 1.21.0 | 111 | **no** | **no** |

Verified today: aiskills reads 1.21.0, its tree is clean with nothing unpushed, and it still has neither a `scripts/` directory nor `test/release-docs.test.js`. **Nothing from this session is portable to it** — it was entirely `ti-game` content, which aiskills does not ship.

## Open, not blocked

- **`scripts/generate-toc.mjs` and `fix-fences.mjs` live only here.** Porting them to aiskills would also carry `test/anchors.test.js`. `fix-fences.mjs` carries Titanium-specific reasoning, so it is not a `cp`.
- **`test/release-docs.test.js` has not been ported to aiskills**, which has the same tag-triggered `publish.yml` and the same docs that can drift from it.
- **Three upstream items would change what the skill documents if they land**: contact-only friction for slopes (`linearDamping` is the wrong tool and upstream's `TODO.md` says so), the `ratio` parser falling back to the property's default on iOS while Android keeps the current value, and `animate()` accepting a percentage on `scale` only. All three are currently documented as divergences.
- **Not reported upstream:** that a `restitution` on a surface silently disables `onGround` for its riders. It follows from PR #20 and is not in the README. Worth mentioning to Michael, or fixing in code — the skill documents it either way.
