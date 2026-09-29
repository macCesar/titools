---
name: purgetss-videos
description: Plan, record, narrate and deliver PurgeTSS video tutorials for Titanium Alloy or Classic projects in VS Code on macOS. Use for any PurgeTSS tutorial, demo, episode, retake, ElevenLabs narration, cue sheet, subtitles, publishing metadata or final master — a single command, utility classes, the purgetss.ui module, an app showcase, or a whole series. Adds the PurgeTSS conventions on top of technical-demo-videos, which owns the production workflow. Maintainer-only — not intended for end-user Titanium projects.
metadata:
  internal: true
---

# purgetss-videos

Maintainer-only layer for PurgeTSS video tutorials. `technical-demo-videos` owns the production workflow: proposal, beat table, permanent recorder, pinned runtime, VS Code profile, capture, audio alignment, YouTube master, publishing metadata and upload. This skill adds only what is specific to PurgeTSS. Where the two disagree, this skill wins; where a source repository's own `AGENTS.md` or `videos/` guide is stricter, that repository wins for its episodes.

## Before acting

1. Load `technical-demo-videos` and read the references its workflow table requires for the current phase.
2. Load `purgetss` and read its command-specific references. Every command, flag, output path, class and module API shown or narrated is verified there, and against the PurgeTSS implementation when the reference leaves doubt. Never write a plausible-looking command or class into a script.
3. Detect the project type and read [references/project-types.md](references/project-types.md). Alloy and Classic tutorials differ in what may appear on screen.
4. If the source project lives in a repository with its own `AGENTS.md` or `videos/` production guide, read it before drafting.

## Source projects

Existing starting fixtures, one independent project per episode:

- Alloy: `/Users/cesar/Developer/openSource/purgetss-alloy-apps/projects/`, guide at `videos/production-guide.md`.
- Classic: `/Users/cesar/Developer/openSource/purgetss-classic-apps/projects/`, guide at `videos/recording-guide.md`. The eight Classic command episodes are published.

A new tutorial may reuse one of these fixtures or need a new minimal project. Propose which in the plan. Keep each project to the smallest app that proves the tutorial's claim.

Both repositories ignore `/videos/` in its entirety by the user's decision. Keep scripts, recipes, recorders, takes and media there locally; never force-add them to Git. Source projects, inputs and font licenses are versioned.

## Production conventions

- English screen content, narration and subtitles. Horizontal 16:9.
- Audio first: approve the English narration, receive the ElevenLabs audio, measure it, then lock the visual recipe. A recipe waiting for audio stays in draft.
- The preferred ElevenLabs voice is `Liam - Energetic, Social Media Creator`. Confirm before generating audio for a new tutorial.
- Subtitles are an external `.srt`. Never burn captions into the image.
- Preserve numbered slugs such as `02-utility-classes` across `projects/`, `videos/`, recorder, recipe, takes and deliverables.

## Narration

- In text sent to ElevenLabs, write the product as `Purge TSS`: one space between `Purge` and `TSS`, no spaces inside `TSS`. Never `PurgeTSS` or `Purge T S S` in voice text, even when naming the command.
- In subtitles, write `PurgeTSS` for the product and lowercase `purgetss` for the command.
- Subtitles keep the exact technical spelling of paths, filenames, flags, APIs and URLs: `purgetss/config.cjs`, `Resources/lib/purgetss.colors.js`, `require('lib/fontawesome')`, `purgetss icon-library --module`, `purgetss.com`. The voice text phrases them naturally for speech; the subtitle stays exact.
- Describe styling as PurgeTSS utility classes and the generated file as `utilities.tss`. Name Tailwind CSS only for the optional VS Code tools (IntelliSense, Raw Reorder) and their real dependencies. Never call the app's utilities Tailwind classes.
- One natural paragraph per visual beat. No `[pause]`, `[short pause]`, SSML `<break>` or other pause markup unless the user asks for it in a specific episode.
- When the demonstrated command has other meaningful documented modes or options, spend one sentence near the end on the most useful ones. Verify each against `purgetss`; omit incidental flags and anything that cannot be stated accurately in a few words. Do not add screen actions for them.
- Close with `For more information, visit purgetss.com.` unless the user chooses another closing. Include it before generating audio so its real duration is in the plan; do not retrofit it into approved or generated audio.

## Disposable copies

- Each take copies the source project to `/Users/PurgeTSS/<source-repo>/<slug>-<random>`, for example `/Users/PurgeTSS/purgetss-alloy-apps/00-showcase-ylpqkhtu`. Pass that root as the recipe's copies directory or `TECHNICAL_DEMO_COPIES_ROOT`. PurgeTSS prints absolute destinations, so this short path is part of a readable terminal.
- Generate a new suffix for every take and never reuse a take's folder: a new folder gives VS Code a new workspace identity, so it does not restore the previous take's open editors.
- Delete rehearsal and rejected-take copies. Keep only the accepted final take's copy for the user to inspect; until a final take exists, keep at most one clean review copy.
- Never run a take on the versioned source project. Helpers go in a separate system temp directory.

## On screen

- Open files with Quick Open (Command-P) and the full project-relative path. Never type navigation text into an editor.
- SVG sources open directly in VS Code's built-in Image Preview, with the association preflighted before capture as the `technical-demo-videos` VS Code profile describes. Never use the `SVG Preview` extension or its side panel.
- Focus the already-open terminal with Command-T right before typing the command. Run it from the project root; never `cd`.
- Keep the terminal low enough that previews stay useful, and keep the transition from preview to terminal short.
- After the command, open representative outputs promptly. Show every platform, density or output family the narration claims, not just a directory name or `DefaultIcon.png`.
- Record the command and its outputs. Compile or launch the app only when the tutorial's proof requires the running app; then prepare the simulator and build off camera and bring the app forward only at its scheduled beat.
- Never operate on the main `purgeTSS` development window.

## Android launch during rehearsals

Launch the installed app from its icon or with a `MAIN` + `LAUNCHER` intent: `adb shell am start -a android.intent.action.MAIN -c android.intent.category.LAUNCHER -n <component>`. A bare `am start -n <component>` relaunched the JavaScript during an appearance change in Fieldnotes. A native Activity recreation is not a controller re-run and is not a normal app animation.

## Pin the environment

Record in each episode's recipe the Node, PurgeTSS, Alloy, Titanium CLI and SDK, Xcode, iOS runtime and simulator model used for the take. A fixture repository's verified toolchain does not replace this per-episode record.
