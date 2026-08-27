# Status — 2026-08-26

**Phase:** live and maintained. **v4.14.0 shipped on both channels**, working tree clean, 0 commits unpushed, nothing in flight.
**Session by:** Claude Code · Opus 5 (`claude-opus-5`).

## Release state — both channels on 4.14.0

| Channel | Version | Verified today |
|---|---|---|
| npm | 4.14.0 | `curl registry.npmjs.org/@maccesar%2Ftitools` → `dist-tags.latest = 4.14.0` |
| Claude Code marketplace | 4.14.0 | `package.json` and `plugin.json` both read 4.14.0, tag `v4.14.0` pushed, GitHub release created |

Two releases went out this session, 4.13.0 and 4.14.0, both published by `publish.yml` on the tag — nothing by hand. **Do not verify with `npm view`**: it served a stale version for minutes after a successful publish during 4.6.1. Query the registry over HTTP.

The suite is **318 tests** (155 + the 163 new anchor checks), run under an empty `HOME` before each push:

```bash
FAKEHOME=$(mktemp -d) && HOME="$FAKEHOME" npm test; rm -rf "$FAKEHOME"
```

## Shipped in 4.14.0 — named values, and a correction to 4.13.0

Upstream PR #16 (César's) made every ratio the engine exposes accept `'55%'` and both anchors accept names, with a new `anchor` property. `api.md` gained a section listing which properties are ratios, read from the `Values.ratio` call sites rather than from upstream's prose, plus three things no documentation mentions: `centre`/`middle` are accepted aliases, `anchor` beats `anchorX`/`anchorY` in the same `createSprite` call whatever the key order, and `animate()` parses a percentage on `scale` alone.

**4.13.0 shipped a claim that was already false.** It said an attachment does not inherit `opacity`; Michael added exactly that in `48beb97`, hours after the tag. The skill asserted the opposite in five places. Fixed in 4.14.0, together with two consequences read from the engine and absent from upstream's README: the inherited value runs through the hit test, so an owner at `opacity: 0` leaves an attached text button untappable while its own `opacity` still reads 1, and the product is never exposed to JS.

That is the shape of maintaining this skill now — upstream can invalidate a published claim the same day. The dated build table in `project-setup.md` is what absorbs it.

## Shipped in 4.13.0 — `attachTo`, and a generator that made dead links

`attachTo`/`detach` (upstream PR #15) documented from the diff, plus the half-texel inset fix from César's PR #14, which had made the reference describe behaviour that no longer existed.

The bigger find was local: **`scripts/generate-toc.mjs` built anchors by collapsing runs of whitespace while GitHub turns every space into its own hyphen**, so every heading with punctuation between two words — "Top-down / Zelda", "Point & click adventure" — had a generated link that scrolled nowhere. Four skills carried them. The slug rules were then checked against `github-slugger`, the library GitHub itself uses, over all 4263 headings in the repo: the fix takes the disagreements from 11 to 5, the residue being keycap emoji. `test/anchors.test.js` now fails on any in-file link no heading produces, importing `slugify` from the script rather than reimplementing it — and it was validated against a deliberately broken control file before being kept.

The three long `ti-game` references also swapped their hand-written `## Contents` for the generated block, so the index can no longer drift from the headings.

## Contributed upstream — m1ga/ti.game#18, merged

Six feature interactions were sent to the module's own README and merged the same evening: `hitboxScale` being collision-only while `hitboxShape: 'circle'` does round the touch area, `glowColor` drawing nothing without a blur radius, `follow()` resetting its options on every call, `followPath` needing two points, the inherited opacity going through the hit test, and `raycast` groups having to be an array.

That last one is the one with teeth: **passing loose group arguments does not fail on iOS**, the filter stays empty and the ray tests every sprite carrying a `collisionGroup`, so the same call answers a different question per platform. Documented in the skill; upstream may prefer to fix it in code.

The measurement behind that PR is worth keeping: upstream's README is good — 1118 lines, 226 table rows — and most of the skill's 47 gotchas are in it or derivable from it. What is missing is never a property, it is what happens where two of them meet. That is the gap this skill fills, and the reason the PR was six clauses rather than a rewrite.

## Sibling parity — aiskills 1.21.0

| Repo | npm | Tests | `scripts/` | `release-docs` test |
|---|---|---|---|---|
| titools | 4.14.0 | 318 | yes | yes |
| aiskills | 1.21.0 | 111 | **no** | **no** |

Verified today: aiskills reads 1.21.0 in both version files, its tree is clean with nothing unpushed, and it has no `scripts/` directory. **Nothing from this session is portable to it yet** — the TOC fix and `anchors.test.js` both depend on `generate-toc.mjs`, which only exists here. Porting the script is the prerequisite, not the test.

## Open, not blocked

- **`scripts/generate-toc.mjs` and `fix-fences.mjs` live only here.** Porting them to aiskills would also carry `test/anchors.test.js`. `fix-fences.mjs` carries Titanium-specific reasoning, so it is not a `cp`.
- **`test/release-docs.test.js` has not been ported to aiskills**, which has the same tag-triggered `publish.yml` and the same docs that can drift from it.
- **Two upstream items would change what the skill documents if they land**: the `ratio` parser falling back to the property's default on iOS while Android keeps the current value (a parity gap in PR #16), and `animate()` accepting a percentage on `scale` only. Both are currently documented as divergences.
