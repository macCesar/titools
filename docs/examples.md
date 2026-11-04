# Example prompts

Use these requests as starting points with an assistant that has TiTools installed.
Mention the framework, module and platform involved. Conditional skills apply
when the project uses that technology; an image request does not require adding
an audio or advertising module.

## Reuse and simplification — ti-reuse-first

- "Find whether this Alloy project already has a suitable confirmation panel before adding another one."
- "Review these repeated controller wrappers and explain which can be simplified without changing behavior."

## Architecture — ti-expert

- "Organize this Alloy screen so navigation, data access and view state have clear owners."
- "Review this controller for timer, listener and window lifecycle leaks."

## PurgeTSS — purgetss

- "Style this Alloy layout with the PurgeTSS classes supported by the installed version."
- "Prepare responsive images for this Classic Titanium project using the supported PurgeTSS asset workflow."

## Native UI — ti-ui

- "Build a ListView with reusable templates and predictable row heights."
- "Check this window's safe-area, orientation and gesture handling on Android and iOS."

## Native games — ti-game

- "Build a platformer using native velocity, gravity and collision events instead of a JavaScript frame loop."
- "Map keyboard and gamepad input to named actions while keeping native text-field focus usable."

## Visual and sound assets — ti-game-assets

- "Prepare a consistent sprite sheet, animation frames and three-layer parallax set for this game."
- "Create three related pickup sound variants and an asset manifest with export and listening checks."

## Native synthesis — ti-synthengine

- "Install the public TiSynthEngine 2.0.0 Android/iOS packages and start audio after the window layout settles."
- "Create a reusable laser Sound with flat per-shot pitch and position overrides."
- "Move a held spatial motor through its note control, then release it on touch cancellation."
- "Play music and a victory pattern independently; stop only the cue and wait for its end event before replacing it."
- "Repeat this complete layered effect natively without changing envelopes, sweep timing or gains."
- "Change a reusable preset with set(), reset an optional leaf with null and keep active executions unchanged."
- "Migrate playTone and setMasterProcessing to Sound objects and setProcessing, preserving timing and reverb units."
- "Add bounded native attack variation and diagnose voice pressure with enableStats/disableStats."

Use the [synthesis skill](../skills/ti-synthengine/SKILL.md) for checked Sound
presets, controls, public downloads and TypeScript declarations. Finite events,
held notes, native repetitions and patterns have distinct returns and cleanup.
The [upgrade guide](../skills/ti-synthengine/references/upgrade-2.0.0.md) maps
supported direct methods to the Sound interface and explains `version` metadata
and processing units.

## Advertising — ti-admob-unified

- "Install public ti.admob.unified 1.0.0 on Android/iOS and configure consent-first startup with the official integration library."
- "Offer a rewarded interstitial at a natural transition with a clear reward, a visible Skip option and cancellation when the screen changes."
- "Check selected mediation providers and production readiness, including app IDs, app-ads.txt and privacy options, without treating Google test ads as provider acceptance."

Use the [public Android](https://github.com/macCesar/ti.admob.unified/releases/tag/android-1.0.0)
and [iOS](https://github.com/macCesar/ti.admob.unified/releases/tag/ios-1.0.0)
packages and the [module skill](../skills/ti-admob-unified/SKILL.md). A synchronous
ATT query is separate from UMP eligibility; Android's ATT convention is not
permission for general tracking. Real account/provider delivery needs its own
validation beyond the module's publication.

## Exact Titanium APIs — ti-api

- "Verify the supported properties and event payloads for this Titanium ListView implementation."
- "Check this platform-specific API call against the SDK version used by the project."

## SDK fundamentals — ti-guides

- "Check this tiapp.xml and explain the relevant build and platform requirements."
- "Set up the CommonJS modules and assets for a maintainable Classic Titanium project."

## Native integrations — ti-howtos

- "Implement location permissions and lifecycle handling for this Android/iOS app."
- "Review this camera and file-sharing flow, including its required platform configuration."

## Alloy MVC — alloy-guides

- "Separate the controller, XML view and TSS responsibilities on this Alloy screen."
- "Explain how this model collection, binding and cleanup should work."

## Alloy tools — alloy-howtos

- "Generate an Alloy controller and place its files according to the documented project structure."
- "Diagnose this Alloy compilation error and check the relevant CLI and configuration options."

## Combining skills

"Review an Alloy game that uses PurgeTSS, ti.game and ti.synthengine. Start with
existing components, then check scene input, native audio ownership and cleanup
using the appropriate references."

See [how the knowledge index works](knowledge-index.md) for reference discovery.
