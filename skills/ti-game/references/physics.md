# Physical models and equations

Use this reference to choose movement by its intended feel, derive parameters,
or explain frame-rate-dependent behavior. A camera angle is not a physics
model: a top-down character, car, spaceship and billiard ball use different
rules. The [demo catalog](examples.md) covers action, platforms, ball games,
adventures, board interactions and visual demonstrations.

Reviewed on 2026-10-23 against native upstream
[`88e181c`](https://github.com/m1ga/ti.game/tree/88e181cb85526d8146d0be6e09b2b90c2551baad)
and the documentation refresh in `macCesar/ti.game@2bf5f82`. These source
contracts do not identify the contents of an installed binary.

Each equation is labeled **Engine** (native implementation), **Demo**
(application rule) or **Analytical** (a mathematical model for tuning).
An analytical equation does not imply a matching public property exists.
JS selects controls and reacts to events; frame-by-frame integration stays native.

<!-- TOC-START -->
## Contents

- [Units and conventions](#units-and-conventions)
- [Model selection across the demos](#model-selection-across-the-demos)
- [Sprite integration and constant acceleration](#sprite-integration-and-constant-acceleration)
- [Thrust, inertia and linear damping](#thrust-inertia-and-linear-damping)
- [Projectiles and additive impulses](#projectiles-and-additive-impulses)
- [Arcade car equations](#arcade-car-equations)
- [Direct character control](#direct-character-control)
- [Jumps, flaps and scrolling runners](#jumps-flaps-and-scrolling-runners)
- [Landing and impact measurements](#landing-and-impact-measurements)
- [Static reflection and arcade ball sports](#static-reflection-and-arcade-ball-sports)
- [Equal-mass billiards and circular containment](#equal-mass-billiards-and-circular-containment)
- [Slopes and contact friction](#slopes-and-contact-friction)
- [Verlet ropes and tethers](#verlet-ropes-and-tethers)
- [Swept movement and periodic worlds](#swept-movement-and-periodic-worlds)
- [Paths, tweens and navigation](#paths-tweens-and-navigation)
- [Rhythm timing](#rhythm-timing)
- [Particle integration](#particle-integration)
- [Time step and frame rate](#time-step-and-frame-rate)
- [What needs a different model](#what-needs-a-different-model)

<!-- TOC-END -->

## Units and conventions

| Quantity | Units |
| --- | --- |
| Position, width, height, path distance | Surface pixels, from guarded GameView `resize` |
| `velocityX/Y`, `maxSpeed` | px/s |
| `gravity`, `gravityX`, `thrust`, `enginePower` | px/s² |
| Native `dt` | Seconds |
| JS `duration`, `after`, `every`, particle lifetime | Milliseconds |
| `rotation` | Clockwise degrees; 0 points up |
| `angularVelocity`, `turnRate` | degrees/s |
| `linearDamping`, car `drag`, car `grip` | 1/s coefficients, not percentage strings |
| Rope `damping` | Retained displacement fraction per update |
| `restitution` | Dimensionless, 0..1 |

Origin is top-left; y increases downwards. Position is the sprite anchor.
For `θ = rotation·π/180`, forward `f=(sin θ,−cos θ)` and right
`r=(cos θ,sin θ)`. `n` below is a unit contact normal.

## Model selection across the demos

| Model | Examples | What determines movement |
| --- | --- | --- |
| Inertial ship | Asteroids | Thrust adds velocity along heading; rotation does not redirect existing momentum |
| Gravity and replacement jump/flap | Platformer, Flappy, Skate, Flip | Vertical acceleration plus a chosen takeoff velocity |
| Direct character control | Topdown | Velocity follows input immediately, including diagonal normalization |
| Arcade car | Racing | Forward/lateral velocity, throttle, steering, drag and grip |
| Ball with static-surface reflection | Volley, Plinko, Circles, Slopes | Gravity, geometry normals and restitution |
| Equal-mass circle bodies | Pool, Plinko, Drum, Circles | Bilateral normal impulse and separation |
| Circular containment | Drum | Keep ball centers inside radius `R−r` |
| Position constraints | Rope | Verlet displacement and link-distance relaxation |
| Fast body or instant query | Swept, Raycast, Worldwrap | Swept movement versus a discrete ray query |
| Prescribed route | Path, Maze, Pointclick, Tilemap, Demoscene | Distance traveled along a path; A* chooses waypoints |
| Prescribed interpolation | Cards, Puzzle, Basic | Tween destination and easing; drag/snap rules |
| Timing window | Rhythm | Constant velocity and distance-to-pad acceptance |
| Ballistic effects | Particles | Native emitter rate, gravity and lifetime; no Sprite solid response |
| Cross-cutting systems | Camera, Blend, Text, Hitbox, Zones, Timescale | Presentation, geometry, events or clock; not separate locomotion models |

Names map to `example/<name>.js`, with lowercase spelling. These groups cover
the launcher entries; the Configurable input/Keyboard demos exercise input rather
than add physics models. Lunar Lander in the action recipes is a curated
composition, not an extra upstream demo. Use [examples.md](examples.md) for
the exact filenames and [api.md](api.md) for public properties.

## Sprite integration and constant acceleration

**Engine**, without contacts or position overrides:

```text
vNext = v + a·dt
pNext = p + vNext·dt
```

This is semi-implicit Euler: acceleration before position. In Sprite, the
order is car integration, angular velocity, thrust and its speed cap,
gravity, linear damping, position, scroll wrap, path, animation, tween and
idle wobble. Scene solid resolution, post-contact damping, and attachment
passes can change that result again.
Do not combine several position writers expecting their displacements to add.

**Analytical**, constant acceleration with no cap/contact:

```text
v(t) = v0 + a·t
p(t) = p0 + v0·t + 0.5·a·t²
```

That position is the continuous solution, not the exact discrete output.
At constant step, `t=N·dt`, Euler gives
`pN=p0+v0·t+0.5·a·(t²+t·dt)`. Multiplying by dt is necessary but does
not eliminate integration error.

**Demo Wind**: gravityX values −900..900 px/s², leaves with vertical gravity
260 and a puck with gravity 0. Constant sideways acceleration is an arcade
wind field; it is not drag calculated from relative air velocity.

Sources: [Android Sprite.update](https://github.com/m1ga/ti.game/blob/88e181cb85526d8146d0be6e09b2b90c2551baad/android/src/ti/game/engine/Sprite.java),
[iOS TGSprite.update](https://github.com/m1ga/ti.game/blob/88e181cb85526d8146d0be6e09b2b90c2551baad/ios/Classes/TGSprite.m).

## Thrust, inertia and linear damping

**Engine**:

```text
rotation += angularVelocity·dt
f = (sin θ,−cos θ)                 # updated heading
v += f·thrust·dt
if |v| > maxSpeed: v *= maxSpeed/|v|
v += (gravityX,gravity)·dt
if linearDamping > 0:
    v *= max(0,1−linearDamping·dt)
    if effectively coasting and |v| < 4 px/s: v = (0,0)
p += v·dt
```

The thrust cap runs only in its active branch; direct velocity writes are
not capped. Asteroids uses 220 degrees/s turning and both thrust and speed
cap `0.9·min(W,H)`, with no ship damping. Turning changes the nose, not the
velocity already accumulated. Assisted flight can deliberately add damping,
but it is resistance everywhere, not contact-only friction.

**Analytical** damping: `dv/dt=−cv`, hence `v(t)=v0·exp(−ct)` and speed
half-life `ln(2)/c`. With constant aligned acceleration, `dv/dt=a−cv`
tends to `a/c`. The engine approximates damping using `1−c·dt`, then
applies its rest threshold. Box2D documents the same continuous decay but
uses `1/(1+c·dt)`; do not substitute that for ti.game's implemented formula.
[Box2D damping reference](https://box2d.org/documentation/md_simulation.html).

### Powered launch and post-contact rest

The current engine preserves acceleration below the 4 px/s cutoff. At rest,
thrust 220 and damping 1.2 at a 1/60 s step produce
`220/60·(1−1.2/60)=3.593` px/s; that powered step now survives. Damping
still applies during acceleration. An unopposed powered equilibrium may remain
below 4 px/s without being forced to zero.

**Engine** tracks the vector sum of thrust, gravity, gravityX and car motor
acceleration. A tolerance of `1e−6·sum(abs(input acceleration magnitudes))`
treats floating-point cancellation residue as coasting. After solid resolution,
`finishDamping()` evaluates the remaining speed and work `v·a`. Below 4 px/s,
nonpositive or negligible work allows the body to settle. A force cancelled
by another force, or pressing into a blocked surface, therefore does not
protect residual tangential drift. An inward rect-wall velocity retained for
held input is excluded from that tangential test and preserved separately.

**Historical build boundary:** `3bea2f4` erased every damped velocity below
4 px/s before position integration, including powered launch. Verify the build
before diagnosing that behavior. Do not carry its mandatory damping-off
workaround into current source. Choosing damping only while coasting remains
a valid application feel, but intentionally removes powered-flight drag.

`tests/test_linear_damping.py` executes production Java/Objective-C update,
car and post-contact methods at 30/60/120 FPS. Contacts in that fixture are
velocity projections; it does not certify complete scene/device behavior.

### Coasting brake feel reference

**Application profile**, Titanium Asteroids autopilot, recorded 2026-10-12:
set `linearDamping: 0` while thrust is active and `linearDamping: 1.2` s⁻¹
when thrust stops. Native braking then multiplies velocity by
`max(0, 1-1.2*dt)`, with the installed engine's rest policy. The current source preserves
acceleration below the cutoff; this older application profile remains an
optional control feel rather than a required engine workaround.

César liked the speed of this braking as a reference for other games,
especially arcade racing, although he did not choose it as the preferred
feel for Asteroids. Keep the coefficient and activation condition together
when comparing the feel. This is an optional tuning example, not a default
for all games or an upstream demo preset. In a racer, evaluate longitudinal
braking and lateral grip separately before adopting it.

## Projectiles and additive impulses

**Demo Asteroids**, nose launch:

```text
pBullet = pShip + f·0.55·SHIP_SIZE
vBullet = vShip + f·BULLET_SPEED
BULLET_SPEED = 1.2·min(W,H)
```

Inherited ship velocity is a deliberate application choice. A fixed
world-speed projectile instead assigns only `f·speed`.

**Analytical** impulse: `Δv=J/m`. The demos add a chosen velocity change
directly; Sprite has no configurable rigid-body mass. `v+=Δv` bends existing
motion, whereas `v=vNew` replaces it. Pool strikes are additive, Flappy's
vertical flap is a replacement, and Drum's SHAKE replaces velocities while
its contact-driven TUMBLE adds increments.

## Arcade car equations

**Engine carMode**, forward/right axes from the old heading:

```text
vForward = v·f; vLateral = v·r
steerFactor = clamp(vForward/(0.25·maxSpeed),−1,1)
rotation += steering·turnRate·steerFactor·dt
vForward += throttle·enginePower·dt
vForward *= max(0,1−drag·dt)
vLateral *= max(0,1−grip·dt)
vForward = clamp(vForward,−0.4·maxSpeed,maxSpeed)
v = fNew·vForward + rNew·vLateral
```

Recomposition uses the updated heading. A stopped car with zero forward
speed does not steer; reverse forward speed reverses steering direction.
Lower grip retains more lateral drift; drag reduces forward speed.
Negative throttle can brake and then reverse. It is an arcade model,
without wheelbase geometry, individual tires or weight transfer.

**Demo Racing** uses `maxSpeed=0.8·min(W,TH)`, where TH is track height,
`enginePower=1.1·maxSpeed`, turnRate 210, grip 3.2 and drag 0.8. These numeric
values have the units in the table above, not an interchangeable percentage.
No JS loop should rotate the velocity to reproduce this native model.

Sources: Android Sprite.updateCar and iOS TGSprite.updateCar, at the same
links as [Sprite integration](#sprite-integration-and-constant-acceleration).

## Direct character control

**Demo Topdown** uses speed `S=3.5·TILE`. For cardinal input it assigns
`v=(moveX,moveY)·S`; for diagonal input each axis uses `S/sqrt(2)` so
the combined magnitude remains S. Releasing input writes zero velocity:
there is no ship-like inertia. For a general nonzero input vector d, the
application formula is `v=S·d/|d|`; distinguish this from analog magnitude
control, which may intentionally retain the stick's partial travel.

The demo dog normalizes its target direction at `1.1S` on a decision timer.
The timer chooses direction; native velocity integrates movement between
decisions. [Top-down recipe](recipes-action.md#top-down--zelda).

## Jumps, flaps and scrolling runners

**Demo** Platformer assigns `vx=direction·RUN_SPEED` and, on permitted
grounded input, `vy=−JUMP`. Flappy assigns `vy=−0.6H` per tap; it does not
accumulate upward impulses. Its tilt tween is visual, not aerodynamic lift.
Skate keeps player x fixed and moves terrain/obstacles at `vx=−0.5W`.

**Analytical**, gravity `g>0`, takeoff speed magnitude `J`:

```text
timeToApex = J/g
height = J²/(2g)
sameLevelFlightTime = 2J/g
J for desired height h = sqrt(2gh)
g for height h and apex time T = 2h/T²; J = 2h/T
```

| Demo | g | J | Continuous prediction |
| --- | --- | --- | --- |
| Platformer | 2.2H | 0.95H | Apex 0.432 s; rise 0.205H |
| Skate | 2.4H | 0.9H | Apex 0.375 s; same-level flight 0.75 s |
| Flappy | 1.9H | 0.6H | Isolated flap apex0.316 s; rise 0.095H |
| Volley players | 2.2H | 0.85H | Apex 0.386 s; rise 0.164H |

Contact geometry, ceilings and discrete integration change actual results.
`oneWay` allows top landings through otherwise passable platforms; exact
conditions differ by resolver. Moving solids carry grounded riders using
their frame delta. Skate's raised scrolling road disables `carryRiders` so
the player is not dragged off screen. [Action recipes](recipes-action.md).

## Landing and impact measurements

**Engine** `land` reports a grounding transition after solid response.
Its payload does not include the original velocity. Live `velocityY` can
already be zero or reflected, and JS event delivery can be later still.
Do not classify a hard touchdown as gentle by reading that zero value.

For sprite solids, `solidimpact.speed` snapshots relative closing normal
speed before response, compensated for the frame's own acceleration.
Set `impactThreshold:0` to include gentle positive impacts and check the
contact normal/group. It is not full vector speed or an exact post-gravity
pre-contact sample. A rule involving tangential velocity needs separate
evidence; solid TileLayer cells do not emit `solidimpact`.

The [Lunar Lander recipe](recipes-action.md#lunar-lander) uses a static sprite
pad and this normal-impact contract. A resting body with no positive impact
does not receive an invented impact merely because its threshold is0.

Sources: Android `Scene.resolveSolids`, `dispatchSolidImpact`, `finishContacts`;
iOS `TGScene.resolveSolids`, `dispatchSolidImpactFor`, `finishContactsFor`;
see [event payload](api.md#sprite-events).

## Static reflection and arcade ball sports

**Engine**, circle against a static solid, outward normal:

```text
e = max(eMover,eSolid)
vn = v·n
if vn < 0:
    if e > 0 and −e·vn > 40 px/s: v -= (1+e)·vn·n
    else: v -= vn·n
```

This preserves tangential velocity. The small-rebound cutoff belongs to
this response, not the equal-mass bilateral impulse below. No contact
friction or collision-generated spin is implied.

**Demo Volley** replaces the ball's velocity on player contact:
`u=normalize(pBall−pPlayer)`, `S=0.85H`,
`vx=u.x·S`, `vy=min(u.y·S,−0.45S)`. It guarantees an upward component
instead of simulating two masses. Scenario walls use native restitution;
player hits use an arcade rule. Plinko uses gravity 1100, restitution 0.42,
circle pegs and `push` chips.

Sources: [Android Scene.resolveCircleSolids](https://github.com/m1ga/ti.game/blob/88e181cb85526d8146d0be6e09b2b90c2551baad/android/src/ti/game/engine/Scene.java),
[iOS TGScene.resolveCircleSolids](https://github.com/m1ga/ti.game/blob/88e181cb85526d8146d0be6e09b2b90c2551baad/ios/Classes/TGScene.m).

## Equal-mass billiards and circular containment

**Engine**, two visible circles, both `push`, each listing the other's group:

```text
n = normalize(centerA−centerB)
penetration = radiusA+radiusB−distance
if penetration > slop: pA+=n·penetration/2; pB−=n·penetration/2
vn = (vA−vB)·n
e = max(eA,eB)
if vn < 0:
    j = −(1+e)·vn/2
    vA += j·n; vB -= j·n
```

Each pair resolves once. Restitution1 exchanges normal components; tangent
components remain unchanged. Even differently sized circles are equal-mass
bodies. Without mutual groups the response falls back to a one-sided solid.

Pool uses restitution 0.96, damping 0.62, and a cue velocity increment
`2600·min(1,tapDistance/(0.55W))` along the tap direction. That limits the
strike increment, not total speed when a moving cue is hit again. Pockets
are triggers, not 3D drops.

**Analytical**, unequal masses would require
`j=−(1+e)·vn/(1/mA+1/mB)`, then `vA+=j·n/mA`, `vB−=j·n/mB`.
That is not the current `push` implementation.

**Engine contain**: a ball of radius r inside a container of radius R has
allowed center distance `R−r`. If exceeded, the correcting normal points
toward the container center and penetration is `distance−(R−r)`.
The ball must fit. Drum uses gravity 1400, restitution 0.55, damping 0.35 and
mutual `push` balls. It mixes impulses/contact response, not a spinning
rigid drum or fluid simulation. [Shaped-solid patterns](patterns.md#shaped-solids-ramps-round-posts-and-bodies-that-push-back--slopesjs-circlesjs-pooljs-drumjs).

## Slopes and contact friction

Rotated ramps require `rotatedRect` geometry for the real face normal.
The normal component is cancelled/reflected while tangent velocity remains.
**Analytical**, on a fixed frictionless slope at angle α from horizontal,
downslope acceleration magnitude is `g·abs(sin α)`.

Slopes uses gravity 1100, crate restitution 0, ball0.1 and floor/walls0.5.
Its ball slides; a circle shape does not add rolling torque. Sprite damping
acts off the slope too and cannot substitute contact-only tangent friction.
Smooth uphill walking, connected terrain, mass and torque remain outside
this model. [Limitations](roadmap.md).

## Verlet ropes and tethers

**Engine**, a free node:

```text
displacement = (pCurrent−pPrevious)·damping
pPrevious = pCurrent
pCurrent += displacement + (0,gravity·dt²)
```

For adjacent nodes, `Δ=pB−pA`, `d=|Δ|`, target length L, correction
`Δ·(d−L)/d` is split between free nodes, or applied fully to the free node
when the other is pinned. Division has an epsilon guard. `iterations` repeats
relaxation: more passes stiffen the result at a CPU cost.

The first Rope demo uses 14 links of length 0.04H, gravity 1.6H,
damping 0.985 and 3 constraint passes. Nodes do not automatically receive
Sprite solid collisions. `tail` plus positive `maxLength` additionally
clamps head-to-tail distance and removes outward radial velocity. With two
free sprite ends the correction is split; dragging an end makes the other
yield. It is a positional tether, not a mass/stiffness Hooke spring.

Rope damping is **per update**, not1/s. Before forces and constraints, the
retained displacement factor over one second at 0.985 would be about 0.635
at 30 updates,0.404 at 60 and 0.163 at 120. These are not predictions of the
whole rope's amplitude. An analytical time-normalized alternative would be
`exp(−c·dt)` or `dRef^(dt/dtRef)`; the engine uses the fixed supplied factor.

At zero or negative dt, the current Rope update returns before tether response,
Verlet displacement, endpoint pinning and constraint relaxation. Existing node
positions and their history remain unchanged, so positive dt resumes the saved
motion. A new rope, or a changed segment count, still rebuilds geometry before
that return so it is drawable and its endpoint is readable while paused.

`timeScale=0` now freezes rope simulation while drawing and touch continue.
A user drag or explicit property write can still move a sprite independently;
zero scene time does not disable input. `pause()` stops the render loop as well.
The earlier `3bea2f4` source lacked the early return and could keep relaxing or
integrating at zero dt; do not apply that historical warning to current builds.
`tests/test_rope_pause.py` checks node/history/tether state in both native twins
without a renderer.

Sources: [Android Rope.update](https://github.com/m1ga/ti.game/blob/88e181cb85526d8146d0be6e09b2b90c2551baad/android/src/ti/game/engine/Rope.java),
[iOS TGRope.update](https://github.com/m1ga/ti.game/blob/88e181cb85526d8146d0be6e09b2b90c2551baad/ios/Classes/TGRope.m).

## Swept movement and periodic worlds

**Analytical** per-step movement is `Δp=v·dt`:9600 px/s travels160 px
at 60 FPS. A final-position overlap can skip a thin wall.
Swept tests examine the traveled segment; circle pairs have circular sweeps,
overlap events for a circle/rect or circle/rotatedRect use an expanded box
with rounded corners, including relative target movement and periodic offsets.
Rectangle-pair overlap sweeps retain AABBs. Orientation and size are fixed at
the end-of-frame values: these are translation sweeps, not rotational sweeps.
Solid blocking has a separate implementation. The solid
sweep skips `contain`/`push`; those still use discrete responses. It is not
a general multiple-substep rigid-body simulation.

Raycast is an instantaneous query, not a gravity-driven projectile.
`wrapAround` uses screen edges; `wrapX/wrapShift` loops scrolling copies;
`worldWrapX` defines a periodic horizontal world with participating sprites.
**Analytical** normalization for `L=maxX−minX` is
`x=minX+((x−minX)%L+L)%L`; nearest image displacement is
`dx−L·round(dx/L)`. Raycast, A*, particles, ropes and skid trails do not
repeat at the seam. Native path cursors are aligned to the sprite's nearest
periodic image **before** advancing, preserving signed frame deltas across the
seam, including steps longer than half a world. This does not make A* itself
periodic. Rect resting-contact sweeps also defer shallow normal entry to the
static resolver so tangential sliding survives float-sized contact gaps;
deep entries and full crossings still sweep. [Worldwrap contract](api.md#physics).

## Paths, tweens and navigation

**Engine Path** accumulates `distance+=speed·dt`. Within a segment,
`u=(distance−segmentStart)/segmentLength`,
`p=pStart+u·(pEnd−pStart)`. Optional rotation is
`atan2(dx,−dy)·180/π`. A* chooses the waypoints; it does not apply a force.
Maze/Tilemap use4·TILE px/s. Path motion overrides integrated position;
a later position tween can override the path again.

**Engine Tween** uses `u=clamp(elapsed/duration,0,1)` after its delay,
then `value=from+(to−from)·Easing(u)`. Cards, puzzles and Basic use
prescribed destinations/gestures, not conservation of momentum.
Camera/parallax, blend, text, flip and pixel snapping are presentation;
they do not change those motion equations. Snapping rounds the drawn anchor,
not physical position, and cannot eliminate every rotational raster change.

Sources: [Path.advance](https://github.com/m1ga/ti.game/blob/88e181cb85526d8146d0be6e09b2b90c2551baad/android/src/ti/game/engine/Path.java),
[Tween.update](https://github.com/m1ga/ti.game/blob/88e181cb85526d8146d0be6e09b2b90c2551baad/android/src/ti/game/engine/Tween.java).

## Rhythm timing

**Demo**, `vy=(PAD_Y+NOTE)/1.6`, starting at `y=−NOTE`, gives a 1.6 s
trip to the pad. GOOD allows 0.08H distance and PERFECT0.03H.
**Analytical** temporal error is `abs(y−PAD_Y)/abs(vy)`; changing fall speed
changes the milliseconds represented by a fixed pixel window.

At the demo's stated 150 BPM, quarter duration is `60000/150=400 ms`;
an eighth is200 ms. The400 ms spawn interval and 1.6s travel are one and four
quarters, respectively. The older `3bea2f4` comments called them eighths, and the old action recipe
repeated that error. Current source comments and the corrected recipe preserve
the same timing and identify the quarter-note spacing.

This is a comment/recipe error, not evidence of a faulty native beat engine.
The demo uses `setInterval(spawn,SPAWN_MS)` and independent `music.play()`;
it has no audio-position-driven scheduling. Exact musical synchronization,
actual asset tempo and phase would need separate measurement. A comment-only
upstream patch should not halve SPAWN_MS or replace the motor.

Source: [Rhythm demo](https://github.com/m1ga/ti.game/blob/88e181cb85526d8146d0be6e09b2b90c2551baad/example/rhythm.js).

## Particle integration

**Engine** accumulates `rate·dt`, emits the integer part and keeps the
remainder. Live particles age, receive `vy+=gravity·dt`, then position
updates with the new velocity. At lifetime they retire. They are effects,
not Sprite solids or automatic damage sensors. [Particle recipes](recipes-adventure-effects.md#particles).

## Time step and frame rate

Both renderers derive a variable real dt, cap it at 0.1s and then scale by
`max(0,timeScale)`. They do not run a fixed-step accumulator with physics
substeps. `maxFps` is a cap, not a guarantee of exact dt. Differences can
come from Euler error, rest/rebound thresholds, per-update Rope damping,
surface-based parameters, input/lifecycle or different installed binaries.

GameView timers follow scene time, conventional JS timers do not. Rendering
and touch continue under timeScale 0; current Rope nodes/constraints also
freeze. Explicit writes, dragging and solid/attachment resolution still need
to be considered when a pause design permits interaction.

For tuning, capture the build, actual FPS, W/H, timeScale, forces and
velocities. Check rest-to-powered motion, releases, turns, contacts and pauses
at 30/60/120 FPS, then validate on the target hardware. Scalar equations and
source parity are useful evidence, not certificates of identical device feel.
[Telemetry workflow](debugging-performance.md).

Sources: [Android SceneRenderer](https://github.com/m1ga/ti.game/blob/88e181cb85526d8146d0be6e09b2b90c2551baad/android/src/ti/game/engine/SceneRenderer.java),
[iOS TGSceneRenderer](https://github.com/m1ga/ti.game/blob/88e181cb85526d8146d0be6e09b2b90c2551baad/ios/Classes/TGSceneRenderer.m).

## What needs a different model

Assisted spacecraft flight can use deliberate resistance, but it is not
airplane aerodynamics. A fuller aircraft model needs relative airspeed,
lift, drag, stall, altitude and bank response. Ships, tires, springs,
variable masses and collision torque also need separate modeling choices.
Do not claim those simulations from a sprite's artwork or camera angle.
See [roadmap.md](roadmap.md) before naming a missing API, and retain the
distinction between analytical tuning, application rules and native support.
