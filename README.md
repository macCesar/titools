# TiTools - Titanium CLI for AI coding assistants

<div align="center">

![npm](https://img.shields.io/npm/dm/@maccesar%2Ftitools) ![npm](https://img.shields.io/npm/v/@maccesar%2Ftitools) ![NPM](https://img.shields.io/npm/l/@maccesar%2Ftitools)

</div>

TiTools is a Titanium SDK toolkit for AI coding assistants. It ships 9 skills — 4 opinionated (`ti-expert`, `purgetss`, `ti-ui`, `ti-game`) plus 5 documentation-mirror skills (`ti-api`, `ti-guides`, `ti-howtos`, `alloy-guides`, `alloy-howtos`) — a research agent, and reference files covering Titanium architecture, API reference, native how-tos, Alloy MVC, PurgeTSS styling, UI/UX patterns, and 2D game development with the `ti.game` module.

The reference files are maintained against official documentation whenever an official source exists, so the assistant can retrieve current framework behavior instead of guessing from generic training data.

Without TiTools, assistants rely on general training data. That data can be outdated or too generic for Titanium work. With TiTools, the assistant can look up Alloy architecture, memory cleanup patterns, PurgeTSS utility classes, and platform-specific APIs.

Vercel's AGENTS.md evaluation reports a 100% pass rate for the knowledge index approach, compared to 53-79% using skills alone.

---

## Safety and disclaimer

TiTools installs documentation skills and a research agent into your AI coding assistant's skill directories and, when you run `titools sync`, injects a knowledge index block into your project's `AGENTS.md`/`CLAUDE.md`/`GEMINI.md`.

The maintainers of TiTools accept no responsibility for data loss, build breakage, or any other damage caused by the use of the CLI, skills, or the AI assistant's code suggestions. The tool is provided AS IS under the MIT License — see [`LICENSE`](./LICENSE) for the full terms. Use at your own risk.

---

## Installation

### Option A: Plugin Marketplace (Claude Code only)

The fastest way to get started with Claude Code. One command to add the marketplace, one to install:

```bash
/plugin marketplace add macCesar/titools
/plugin install titools@maccesar-titools
```

What you get:
- All 9 TiTools skills (`ti-expert`, `purgetss`, `ti-ui`, `ti-game`, `ti-api`, `ti-guides`, `ti-howtos`, `alloy-guides`, `alloy-howtos`)
- ti-pro research agent
- Session hook that auto-detects Titanium projects (`tiapp.xml`, Alloy, PurgeTSS, `ti.game`)
- Slash commands: `/ti-check`, `/ti-new-screen`, `/ti-audit`
- Auto-updates via marketplace (opt-in — see note below)

> **Note on auto-updates:** Claude Code disables auto-updates by default for third-party marketplaces like this one. To receive new versions automatically, open `/plugin` → **Marketplaces** tab and enable auto-update for `maccesar-titools`. When an update is applied, Claude Code prompts you to run `/reload-plugins` to activate the new code.

### Option B: CLI (Claude Code, Gemini CLI, Codex CLI)

Cross-platform installation via npm. Works with all three AI coding assistants:

```bash
# 1) Install the CLI
npm install -g @maccesar/titools

# 2) Install skills globally
titools install

# 3) Go to your Titanium project
cd /path/to/your/project

# 4) Sync the knowledge index into your project files
titools sync

# 5) Start your AI coding assistant
claude   # or gemini, or codex

# 6) Ask away!
# "How should I structure a new app with login, signup, and a dashboard?"
# "My ListView with 500 items scrolls poorly on Android. How do I fix it?"
```

What gets installed:
- The 9 TiTools skills to `~/.agents/skills/`
- ti-pro agent for Claude Code
- Platform symlinks for Claude Code (Gemini CLI and Codex CLI auto-discover from `~/.agents/skills/` — no symlinks needed)
- Knowledge index in your project's `AGENTS.md`/`CLAUDE.md`/`GEMINI.md`
- Claude Code SessionStart hook for auto-updates

Why NPM?
- Cross-platform (macOS, Linux, Windows)
- No sudo required
- Auto-updates via Claude Code hook (checks once per day)

### Which option should I use?

|                     | Plugin (Option A)                          | CLI (Option B)            |
| ------------------- | ------------------------------------------ | ------------------------- |
| **Claude Code**     | Recommended                                | Supported                 |
| **Gemini CLI**      | Not available                              | Supported                 |
| **Codex CLI**       | Not available                              | Supported                 |
| **Knowledge Index** | Not included                               | Included (`titools sync`) |
| **Auto-updates**    | Marketplace (opt-in, enable in `/plugin`)  | SessionStart hook (daily) |
| **Slash commands**  | `/ti-check`, `/ti-new-screen`, `/ti-audit` | Same three (`~/.claude/commands/`) |
| **Session hook**    | Auto-detects Titanium projects (Alloy/Classic, PurgeTSS, `ti.game`) | Auto-update only          |

Having both installed is fine: the CLI detects an enabled marketplace plugin and skips its own skill symlinks and command copies, so nothing shows up twice. `titools doctor` reports which channel is serving Claude Code.

Use **Option A** if you only use Claude Code. Use **Option B** if you use multiple AI assistants or want the Knowledge Index feature.

---

## Compatible platforms

| Platform                                                  | Status           | Skills Path                           |
| --------------------------------------------------------- | ---------------- | ------------------------------------- |
| [Claude Code](https://claude.ai/claude-code)              | Fully Compatible | `~/.claude/skills/` (symlinked)       |
| [Gemini CLI](https://github.com/google-gemini/gemini-cli) | Fully Compatible | `~/.agents/skills/` (auto-discovered) |
| [Codex CLI](https://developers.openai.com/codex/cli/)     | Fully Compatible | `~/.agents/skills/` (auto-discovered) |

All three platforms use the Agent Skills open standard: a `SKILL.md` file with YAML frontmatter. Gemini CLI and Codex CLI auto-discover skills from `~/.agents/skills/` per [agentskills.io](https://agentskills.io), so TiTools does not create redundant platform-specific symlinks for them.

---

## Knowledge index

The knowledge index is a compressed documentation map that gets injected into your project's instruction files. It tells the AI where Titanium reference docs are, so it can pull accurate information from the installed references instead of relying on general training data.

### Why it works

| Approach         | Reported Pass Rate |
| ---------------- | ------------------ |
| No documentation | 53%                |
| Skills only      | 53-79%             |
| Knowledge index  | 100%               |

Per Vercel's evaluation:
- No decision point: information is present without needing to invoke skills
- Consistent availability: available in every turn, not async-loaded
- No ordering issues: avoids "read docs first vs explore project first"

For details, see `AGENTS-VERCEL-RESEARCH.md`.

### What gets generated

The `titools sync` command generates a block like this inside your project files:

```
[Titanium SDK Docs Index]|root: ~/.agents/skills
|MANDATORY: Your training data for Titanium SDK, Alloy, and PurgeTSS is OUTDATED and INCOMPLETE. These reference files are the SINGLE SOURCE OF TRUTH. Prefer retrieval-led reasoning over pre-training-led reasoning. ALWAYS read the relevant files below BEFORE writing any code.
|ti-expert/references:{alloy-structure.md,anti-patterns.md,...}
|purgetss/references:{animation-system.md,class-index.md,...}
|ti-ui/references:{layouts-and-positioning.md,listviews-and-performance.md,...}
...
```

Note: The index is injected as direct content (no code blocks) so the model treats it as an active instruction, not illustrative text.

File selection per assistant:
- Claude Code -> `CLAUDE.md`
- Gemini CLI -> `GEMINI.md`
- Codex CLI / others -> `AGENTS.md`

### How skills and the knowledge index work together

The knowledge index provides always-available context (the documentation map). Skills provide specialized, on-demand expertise (the actual knowledge).

Together they work like this:

| Your Question                   | Knowledge Index Provides        | Skills Activate               |
| ------------------------------- | ------------------------------- | ----------------------------- |
| "Create a login screen"         | Context about project structure | `ti-expert`, `ti-ui`          |
| "Optimize ListView performance" | Points to docs location         | `ti-ui` reads specific files  |
| "Implement push notifications"  | API reference paths             | `ti-howtos`                   |

You do not need to explicitly invoke skills. The AI detects when to use them based on your question.

### Version notice

The knowledge index is based on the latest Titanium SDK documentation. If your project uses an older version, the command will warn you about potential API differences.

---

## Skills overview

| Skill        | Purpose                             | Best For                                |
| ------------ | ----------------------------------- | --------------------------------------- |
| ti-expert    | Architecture and implementation     | Starting point for most tasks           |
| purgetss     | Utility-first styling               | UI styling and animations               |
| ti-ui        | UI/UX patterns                      | Complex layouts, ListViews, platform UI |
| ti-game      | 2D games with the `ti.game` module  | Sprites, physics, collisions, raycasts, pathfinding, text HUDs, particles, camera |
| ti-api       | Complete Titanium API reference     | Looking up properties, methods, events  |
| ti-guides    | SDK fundamentals                    | tiapp.xml, Hyperloop, distribution, JDK/Xcode compatibility, release notes |
| ti-howtos    | Native feature integration          | Location, push, media, platform APIs    |
| alloy-guides | Alloy MVC framework reference       | Controllers, models, views, widgets     |
| alloy-howtos | Alloy CLI, configuration, debugging | alloy.jmk, config.json, custom XML tags |

Notes:
- The first four (`ti-expert`, `purgetss`, `ti-ui`, `ti-game`) are opinionated workflow skills reflecting TiTools' Titanium conventions.
- `ti-game` documents the `ti.game` native module (2D sprite engine on OpenGL ES 2.0, Android and iOS). Its API reference was verified against the module source and tracks upstream `main` (the module ships features ahead of its manifest version); it applies to Alloy and Classic projects alike and does not depend on PurgeTSS.
- The latter five are documentation-mirror skills sourced from the official Titanium SDK docs (`tidev/titanium-docs`) and audited against them via the internal `titools-skill-auditor`.
- `purgetss` reference files are audited against the official PurgeTSS documentation, but its workflow conventions are opinionated.

---

## Agents (Claude Code only)

In addition to skills, this repository includes sub-agents for Claude Code. Sub-agents run in isolated contexts and are useful for research tasks that produce verbose output.

### ti-pro

Deep-dive research specialist that preloads the 3 TiTools skills.

| Aspect           | Details                                          |
| ---------------- | ------------------------------------------------ |
| Location         | `~/.claude/agents/ti-pro.md`                     |
| Model            | Sonnet (comprehensive analysis)                  |
| Tools            | Read-only (Read, Grep, Glob)                     |
| Preloaded Skills | `ti-expert`, `purgetss`, `ti-ui`                 |

When to use the agent vs skills:

| Use Case                     | Use This                        | Why                                                  |
| ---------------------------- | ------------------------------- | ---------------------------------------------------- |
| Quick inline reference       | `/ti-expert`, `/purgetss`, etc. | Runs in main conversation, interactive               |
| Analyzing an entire codebase | `ti-pro` agent                  | Isolates verbose output, cross-references all skills |
| Multi-feature research       | `ti-pro` agent                  | Preloads all skills for comprehensive answers        |
| Step-by-step implementation  | Skills directly                 | Task-oriented guidance                               |
| Architecture review          | `ti-pro` agent                  | Read-only analysis across all documentation          |

Example prompts for the agent:

```
"Can you use the ti-pro agent to analyze this Alloy codebase's architecture?"
"Can you research how to combine location, push, and background sync in Titanium?"
"Can you compare ListView vs TableView performance for my use case?"
"Review this Titanium mobile app and identify anti-patterns."
```

Tip: For automatic activation, include words like "Titanium", "Alloy", or "mobile app" in your prompt to ensure the specialized agent is used instead of generic code analysis.

Key difference:
- Skills = interactive help during development (inline, conversational)
- Agents = isolated research tasks (returns summary, keeps verbose output separate)

---

## Slash Commands (Claude Code)

TiTools provides slash commands for common tasks. Both channels ship them: the plugin serves them from its own cache, and `titools install` copies them into `~/.claude/commands/`. If you have both, the CLI detects the plugin and skips its own copy so the command does not appear twice in the autocomplete.

| Command                 | Description                                                                         |
| ----------------------- | ----------------------------------------------------------------------------------- |
| `/ti-check`             | Verify project setup: SDK version, Alloy structure, PurgeTSS config, common issues  |
| `/ti-new-screen <name>` | Create a new Alloy screen (controller + view + style) following project conventions |
| `/ti-audit`             | Audit project for anti-patterns, memory leaks, and best practice violations         |

These commands automatically invoke the relevant skills:
- `/ti-check` reads `tiapp.xml` and reports project health
- `/ti-new-screen` uses `ti-expert` + `purgetss` to create properly structured files
- `/ti-audit` uses `ti-expert` + `ti-ui` + `purgetss` for comprehensive review

---

## Session Hook (Plugin only)

The plugin includes a session start hook that auto-detects Titanium projects. When you open Claude Code in a directory with `tiapp.xml`, it automatically reports:

```
Titanium Alloy + PurgeTSS + ti.game project detected. TiTools skills are available and MUST be used...
```

It reports Alloy vs Classic, whether PurgeTSS is configured, and whether the project declares the `ti.game` module — a game project also gets a line pointing at the `ti-game` skill.

This ensures Claude knows it's a Titanium project from the first prompt, preventing it from writing generic code.

---

## How skills work

Skills are automatically activated based on your questions. Just ask naturally:

```
"Can you create a login screen with email validation and animations?"
```

The AI will automatically use:
- `ti-expert` -> Architecture and controller structure
- `purgetss` -> Styling classes and animations (if PurgeTSS detected)
- `ti-howtos` from [`tidev/skills`](https://github.com/tidev/skills) (if installed) -> Secure token storage

You do not need to call skills explicitly. The AI reads skill descriptions and loads the appropriate knowledge when needed.

### Project detection

All skills include automatic project detection to ensure compatibility:

| Skill     | What It Detects       | How It Works                                                  |
| --------- | --------------------- | ------------------------------------------------------------- |
| purgetss  | PurgeTSS installation | Checks for `purgetss/` folder, `config.cjs`, `utilities.tss`  |
| ti-expert | Alloy vs Classic      | Checks for `app/` (Alloy) vs `Resources/` (Classic) structure |
| ti-ui     | Titanium projects     | Checks for `tiapp.xml` (both Alloy and Classic)               |
| ti-game   | ti.game module        | Checks for `<module>ti.game</module>` in `tiapp.xml` or `require('ti.game')` |

Why this matters:
- PurgeTSS suggestions are only provided if PurgeTSS is installed
- Alloy-specific patterns are only suggested for Alloy projects
- Classic Titanium projects will not receive inappropriate Alloy advice

### Skill hierarchy

`ti-expert` acts as the orchestrator, delegating to specialized skills when needed:

```
                    ┌─────────────────┐
                    │  ti-expert      │
                    │  (Start Here)   │
                    └────────┬────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
        ┌───────────────┐         ┌───────────────┐
        │   purgetss    │         │    ti-ui      │
        │   (Styling)   │         │   (UI/UX)     │
        └───────────────┘         └───────────────┘
```

For pure API / native-feature how-to / MVC / SDK reference docs, install [`tidev/skills`](https://github.com/tidev/skills) alongside TiTools — its `ti-api`, `ti-guides`, `ti-howtos`, `alloy-guides`, and `alloy-howtos` skills layer below this hierarchy without conflict.

---

## Skill details

### ti-expert

The primary skill for Titanium Alloy development. Start here for most tasks.

When it activates:
- Designing project structure
- Implementing controllers, views, services
- Choosing data strategies (Models vs Collections)
- Writing clean ES6+ code
- Memory management and cleanup patterns
- Choosing a feedback surface (Snackbar, Dialog, Bottom Sheet) and deciding what stays native
- Designing reusable Alloy Widgets and their lifecycle contracts
- Adaptive layouts for tablets, foldables, and large screens
- Associating a custom file type with the app so tapping a document opens it
- Sharing a link or a file out through the iOS share sheet or the Android intent chooser
- Theming and dark mode
- Performance optimization
- Security patterns
- Migrating legacy apps

Example prompts:
```
"How should I structure a new Titanium Alloy app with authentication?"
"Create a user service that fetches data from an API."
"What's the best pattern for navigation between screens?"
"Prevent memory leaks in my controllers."
"Every confirmation in my app is an alertDialog — what should each one actually be?"
"Should this be a Widget or just a <Require>?"
"Tapping my .backup file in iOS Files previews it instead of opening my app."
"My Share button works on Android but does nothing on iOS, with no error."
"Migrate classic Titanium code to modern Alloy patterns."
"What's a clean way to organize services in an Alloy app?"
```

Key features:
- Quick decision matrix for common questions
- 26 reference guides for deep dives
- Delegates to specialized skills when needed

---

### purgetss

Utility-first styling toolkit for Titanium/Alloy.

When it activates:
- Setting up PurgeTSS in a project
- Complex layouts (Grid system)
- Declarative animations (`<Animation>` component)
- Icon fonts (Font Awesome, Material Icons)
- Custom color palettes
- Platform-specific styling
- config.cjs configuration

Example prompts:
```
"How do I set up PurgeTSS in my existing Alloy project?"
"Create a responsive 12-column grid layout."
"Add a fade-in animation when my view appears."
"How do I configure custom colors in config.cjs?"
"How do I use Font Awesome 7 icons?"
"Style this button differently on iOS vs Android."
```

Rules:
- Platform-specific properties require modifiers (e.g., `[platform=ios]`) to prevent cross-platform build failures
- No flexbox (`flex-row`, `justify-between`) -> use `horizontal`/`vertical`
- No `w-full` -> use `w-screen`
- No `p-*` on Views -> use `m-*` on children
- Arbitrary values use parentheses: `w-(100px)`, not `w-[100px]`

---

### ti-ui

UI/UX expert for layouts and platform components.

When it activates:
- Layout systems (composite, vertical, horizontal)
- ListView/TableView optimization
- Event handling and bubbling
- Animations and transforms
- Gestures (swipe, pinch, longpress)
- Orientation handling
- App icons and splash screens
- Android Action Bar / iOS Navigation patterns
- Accessibility (VoiceOver, TalkBack)

Example prompts:
```
"How do I create a high-performance ListView with custom templates?"
"Handle swipe gestures on table rows."
"Set up app icons for all iOS and Android densities."
"Implement pull-to-refresh on a ScrollView."
"How do I make my app accessible for VoiceOver users?"
"How do I configure the Android Action Bar with custom menu items?"
```

Key rules:
- No `Ti.UI.SIZE` in ListView items (causes jerky scrolling)
- Prefer ListView over TableView for large datasets
- Use `dp` units for cross-platform consistency
- Remove global listeners on pause

---

### ti-game

2D game development with the `ti.game` native module — a sprite engine rendered with OpenGL ES 2.0, same JS API on Android and iOS. Works in Alloy and Classic projects.

When it activates:
- `tiapp.xml` declares `ti.game`, or any file calls `require('ti.game')`
- Sprites, sprite sheets, TexturePacker atlases, frame animations, native tweens
- Physics: gravity and velocity, solid platforms, one-way floors, bouncing, the arcade car model, Newtonian thrust
- Collision groups, invisible trigger zones, enter/exit events, swept AABB for fast bullets, hitbox tuning
- Raycasts for line of sight, ledge probes and hitscan shots
- A* pathfinding (`findPath`) around tagged obstacles, feeding native patrol paths (`followPath`) and animation chaining (`play(name, { then })`)
- Bitmap-font text sprites and screen-fixed HUDs inside the scene
- Particle emitters, Verlet ropes, camera follow/zoom/shake/effects, `scrollFactor` parallax, low-latency sound
- Game-clock timers that obey pause and slow motion
- Drag & drop, pinch, rotate, multitouch controls

Example prompts:
```
"Build a flappy-bird style game with ti.game."
"My sprites won't collide — collisionGroup is set on both."
"Add a camera that follows the player with a dead zone."
"How do I make a top-down racer that drifts?"
"Why does my game stutter when I move sprites from setInterval?"
"Add a score HUD that stays put while the camera follows the player."
"Make the guard walk a patrol route and turn around before the ledge."
"Tap to walk, but the player should go around the tree instead of through it."
```

Key rules:
- JS describes the scene and reacts to events; the engine runs every frame. Never move a sprite from a timer — use velocity, gravity, a tween, `carMode` or `thrust`
- Build the level inside a guarded `resize` handler, never from `Ti.Platform.displayCaps`
- `solidWith` blocks, `collidesWith` reports — they are independent
- A sprite with size but no sheet is an invisible trigger (scores, goals, walls)
- Add a whole level with one `gameView.add([...])` call
- HUDs are `Game.createText` sprites with `screenFixed: true`, not `Ti.UI.Label` overlays
- Timers that drive game logic belong on the game clock (`gameView.every`), so a paused game stops spawning

---

## Usage examples and best practices

### Example prompts

Starting a new project:
```
"I'm starting a new Titanium Alloy app for a food delivery service.
Can you help me set up the project structure?"
```

UI development:
```
"Can you create a product listing screen with:
- Pull-to-refresh
- Infinite scroll pagination
- Image caching
- Swipe-to-delete"
```

API integration:
```
"Can you build a complete authentication flow with:
- Login/Register screens
- JWT token management
- Secure storage
- Auto-refresh tokens"
```

Performance optimization:
```
"My app is slow - the ListView scrolls poorly and memory usage is high. How do I optimize it?"
```

Migration:
```
"I have a legacy Titanium classic app from 2015. Can you help me migrate it to modern Alloy?"
```

Platform-specific features:
```
"How do I implement Apple Sign-In for iOS and Google Sign-In for Android?"
```

Debugging:
```
"How do I fix "Alloy is not defined" in my lib file?"
```

Codebase analysis (using agent):
```
"Use the ti-pro agent to analyze this project and:
- review the overall architecture
- identify memory leak patterns
- check for common anti-patterns
- suggest improvements"
```

### Tips for better results

1. Be specific. Instead of "Make a list", try "Can you create a ListView with user avatars, names, and swipe actions?"
2. Provide context. Instead of "How do I fix this error?", try "I'm getting this error when compiling: [error message]. Here's my code: [code]"
3. Ask for architecture first. For complex features, start with "How should I architect a real-time chat feature?" then follow up with implementation details.
4. Mention constraints. "Build a settings screen. Must work offline and sync when connected."
5. Reference existing code. "Here's my current controller. How can I improve memory management?"

More examples: See [Example Prompts](EXAMPLE-PROMPTS.md) for detailed prompts that test each skill's capabilities.

---

## CLI reference

### titools install

Installs Titanium skills, the ti-pro agent, slash commands, and platform symlinks.

```bash
titools install [options]
```

Options:
| Option          | Description                                                         |
| --------------- | ------------------------------------------------------------------- |
| `-l, --local`   | Install skills locally in the current project (`./.agents/skills/`) |
| `-a, --all`     | Install to all detected platforms without prompting                 |
| `--path <path>` | Install to a custom path (skips symlink setup)                      |

Behavior depends on where you run it:

| Context                    | Behavior                                                              |
| -------------------------- | --------------------------------------------------------------------- |
| Outside a Titanium project | Installs skills globally to `~/.agents/skills/`                       |
| Inside a Titanium project  | Prompts you to choose: Global or Local installation                   |
| With `--local` flag        | Installs skills locally to `./.agents/skills/` in the current project |

What it does:
- Installs the 9 TiTools skills (global or local depending on context)
- Installs ti-pro agent for Claude Code
- Installs the `/ti-check`, `/ti-new-screen` and `/ti-audit` slash commands into `~/.claude/commands/`
- Detects installed AI platforms and lets you choose which to link (only Claude Code needs platform symlinks; Gemini CLI and Codex CLI auto-discover from `~/.agents/skills/`)
- Creates symlinks from `~/.claude/skills/` to the central `~/.agents/skills/`
- Skips any skill or command already served by an enabled marketplace plugin, and removes a duplicate left by an earlier install
- Cleans up legacy artifacts (`alloy-expert` skill, `ti-researcher` agent, redundant Gemini/Codex symlinks)
- If run inside a Titanium project, prompts to run `titools sync` afterward
- Installs Claude Code SessionStart hook for auto-updates

### titools auto-update

Checks for updates and applies them silently. Designed to run from the Claude Code SessionStart hook, but can also be used manually.

```bash
titools auto-update            # Show progress
titools auto-update --silent   # No output (for hooks)
```

Options:
| Option         | Description                       |
| -------------- | --------------------------------- |
| `-s, --silent` | Suppress all output except errors |

What it does:
1. Checks a local cache (`~/.titools/last-check.json`) — if already checked today, exits immediately
2. Queries npm for the latest version
3. If a new version is available, runs `npm update -g @maccesar/titools`
4. Syncs skills and refreshes platform symlinks
5. If inside a Titanium project, updates existing Knowledge Index files
6. Writes the cache so it won't check again for 24 hours

The hook is installed automatically by `titools install` when Claude Code is selected. It runs `titools auto-update --silent` at the start of every Claude Code session.

### titools status

Shows a quick overview of your installation.

```bash
titools status
```

Displays: version, skills count, agent, hook status, last update check, platform symlinks, and project Knowledge Index status (if inside a Titanium project).

### titools doctor

Diagnoses installation health.

```bash
titools doctor
```

Checks: skill directories exist, symlinks are valid (not broken), agent is installed, slash commands are installed, hook is configured, cache is readable, Knowledge Index version matches CLI version. Reports issues with fix suggestions.

It also reports the marketplace plugin's state, which changes what "healthy" means:

| Plugin state                       | What doctor reports                                                     |
| ---------------------------------- | ----------------------------------------------------------------------- |
| Enabled                            | Claude Code is served by the plugin — missing mirrors are correct        |
| Not installed                      | Skills reach Claude Code through npm mirrors — mirrors must be present   |
| Uninstalled, cache directory left  | Warns and prints the `rm -rf` that clears the leftover                   |

### titools sync

Generates a compressed knowledge index inside your project's instruction files (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`).

Important: This command only works inside a Titanium project (requires `tiapp.xml`). The knowledge index is project-specific. It detects your SDK version and points to the installed skill references.

```bash
titools sync [path] [options]
```

Arguments:
| Argument | Description                                  |
| -------- | -------------------------------------------- |
| `[path]` | Project path (defaults to current directory) |

Options:
| Option          | Description                                |
| --------------- | ------------------------------------------ |
| `-f, --force`   | Overwrite existing files without prompting |
| `-v, --verbose` | Show detailed diagnostics                  |

What it does:
- Verifies you're inside a Titanium project (`tiapp.xml`)
- Detects Titanium SDK version from `tiapp.xml`
- Prompts you to select which files to sync: `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`
- Inserts or updates a compressed knowledge index block in selected files
- Removes knowledge blocks from unselected files
- Creates files if they don't exist

### titools update

Checks whether a newer `titools` CLI version is available on npm, then syncs installed skills and agents from the currently installed package.

```bash
titools update [options]
```

Options:
| Option        | Description                                |
| ------------- | ------------------------------------------ |
| `-l, --local` | Update local skills in the current project |

Behavior depends on where you run it:

| Context                                                         | Behavior                                                    |
| --------------------------------------------------------------- | ----------------------------------------------------------- |
| Outside a Titanium project                                      | Updates global skills in `~/.agents/skills/` (if installed) |
| Inside a Titanium project (local skills only)                   | Updates local skills automatically                          |
| Inside a Titanium project (both local and global)               | Prompts you to choose: Global or Local                      |
| Inside a Titanium project (with existing knowledge index files) | Also refreshes `AGENTS.md`/`CLAUDE.md`/`GEMINI.md`          |

What it does:
1. Checks npm for the latest CLI version
2. If a newer version exists, it shows the update command `npm update -g @maccesar/titools`
3. It exits without changing skills, agents, or knowledge files until the CLI is updated
4. If the CLI is current, it syncs skills and agents from the installed package (no download needed)
5. Updates platform symlinks only for platforms that already have them
6. Cleans up legacy artifacts (`alloy-expert` skill, `ti-researcher` agent)
7. Auto-syncs knowledge index files if they exist in the current project

Note: This command syncs knowledge packages and agents from your installed CLI. To get new features, first update the CLI with `npm update -g @maccesar/titools`, then run `titools update` again.

### titools remove

Removes skills, agents, symlinks, and knowledge index blocks.

```bash
titools remove [options]
```

Options:
| Option        | Description                                  |
| ------------- | -------------------------------------------- |
| `-l, --local` | Remove local skills from the current project |

What it does:
- Detects all installed components (skills, agents, symlinks, knowledge blocks)
- Prompts you to select what to remove:
  - ti-pro agent for Claude Code
  - Knowledge index blocks from instruction files (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`)
  - Skills from global (`~/.agents/skills/`) or project directory
  - Platform symlinks from global or project directory
- Removes both current and legacy artifacts
- Removes Claude Code auto-update hook
- Cleans up cache directory (`~/.titools/`)

### Verify installation

```bash
titools status    # Quick overview of everything
titools doctor    # Diagnose any issues
titools --version # CLI version only
```

---

## Community-Discovered Patterns

The TiTools skills include **Community-Discovered Patterns** — verified iOS behaviors not present in the official Titanium documentation. These sections are protected from removal during skill audits.

### Large Title + ScrollView (iOS)

When using Large Titles with a ScrollView inside NavigationWindow or TabGroup, three Window properties must be set together. Without all three, the ScrollView content overlaps behind the navigation bar — or the large title renders with a visible delay.

| Class                            | Property                     | Purpose                                               |
| -------------------------------- | ---------------------------- | ----------------------------------------------------- |
| `auto-adjust-scroll-view-insets` | `autoAdjustScrollViewInsets` | Adjusts ScrollView insets to prevent content overlap  |
| `extend-edges-all`               | `extendEdges`                | Content extends behind bars (blur/translucent effect) |
| `large-title-enabled`            | `largeTitleEnabled`          | Large title that collapses on scroll                  |

**Recommended:** set the base properties as global Window defaults in `config.cjs`:

```js
module.exports = {
  theme: {
    Window: {
      ios: {
        apply: 'auto-adjust-scroll-view-insets extend-edges-all status-bar-style-light-content'
      }
    }
  }
};
```

Then only add `large-title-enabled` per-window as needed:

```xml
<Window title="Home" class="large-title-enabled">
  <ScrollView class="vertical w-screen" contentHeight="Ti.UI.SIZE">
    <!-- Content starts below the nav bar automatically -->
  </ScrollView>
</Window>
```

This pattern is documented across three TiTools skills: `ti-ui`, `ti-expert`, and `purgetss`. The `ti-api` skill in [`tidev/skills`](https://github.com/tidev/skills) also documents the underlying Window properties.

---

## Skill contents summary

| Skill     | SKILL.md                      | References                                            |
| --------- | ----------------------------- | ----------------------------------------------------- |
| ti-expert | Architecture + Implementation | 26 files (patterns, feedback surfaces, file type association, sharing, testing, security, etc.) |
| purgetss  | Setup + Critical Rules        | 33 files (grid, animations, icons, class-index, SVG pipeline, etc.) |
| ti-ui     | UI Rules + Platform Diffs     | 14 files (layouts, lists, gestures, etc.)             |

---

## Troubleshooting

### Skill not activating?

If the AI doesn't seem to use Titanium knowledge:
1. Mention "Titanium" or "Alloy" explicitly in your prompt
2. Be more specific about what you're building
3. Reference the technology stack
4. Try explicit invocation: "Use the purgetss skill for styling questions"

### Getting wrong suggestions?

If the AI suggests patterns you don't use (for example, PurgeTSS when you're not using it):
1. The skill may not have detected your project type correctly
2. Explicitly mention your stack: "I'm using Classic Titanium, not Alloy"
3. Be more specific about what you're building

### PurgeTSS not detected?

If the purgetss skill doesn't activate for your PurgeTSS project:
1. Verify `purgetss/` folder exists in project root
2. Check that `purgetss/config.cjs` exists
3. Mention "PurgeTSS" explicitly in your prompt

### Wrong advice?

If the AI suggests incorrect patterns (like flexbox):
1. Remind it you're using PurgeTSS
2. Reference the correct pattern from memory
3. Ask to check the PurgeTSS rules

### Need more detail?

Ask the AI to:
```
"Show me the reference documentation for ListView performance"
"What does the ti-expert skill say about memory cleanup?"
```

### titools command not found?

If the command is not found:
```bash
# Verify installation
npm list -g @maccesar/titools

# Re-install
npm install -g @maccesar/titools
```

### Knowledge index not working?

If your AI doesn't use the knowledge index information:
1. Verify AGENTS.md/CLAUDE.md/GEMINI.md exists in your project root
2. Check that your AI supports these files
3. Try explicitly referencing: "Check the AGENTS.md documentation"

### Version mismatch warning?

The knowledge index is based on the latest documentation. Be cautious when using newer APIs in older projects.

---

## Uninstall

```bash
# Remove the CLI
npm uninstall -g @maccesar/titools

# Remove knowledge packages and agent
titools remove
```

Note: `titools remove` can remove the knowledge index blocks from your project files, but it does not delete the files themselves.

---

## Contributing

1. Fork the repository
2. Improve SKILL.md or reference files
3. Test with your preferred AI coding assistant
4. Submit a pull request

### Guidelines
- Keep SKILL.md concise (<500 lines)
- Use progressive disclosure (details in references)
- Include concrete examples
- Test with real sessions

---

## Legacy installation (not recommended)

The bash installer is maintained for backward compatibility but NPM installation is recommended.

```bash
curl -fsSL https://raw.githubusercontent.com/macCesar/titools/main/install.sh | bash
```

Use this only if you cannot use NPM for any reason.

---

## Credits

Created by César Estrada ([@macCesar](https://github.com/macCesar)), creator of [PurgeTSS](https://github.com/macCesar/purgeTSS).

## License

MIT License - Free to use, modify, and distribute.

---

## Resources

- [Titanium SDK](https://titaniumsdk.com/)
- [PurgeTSS](https://purgetss.com/)
- [TiDev Community](https://tidev.io/)
- [Claude Code Skills](https://docs.anthropic.com/en/docs/claude-code)
- [Gemini CLI Skills](https://geminicli.com/docs/cli/skills/)
- [Codex CLI Skills](https://developers.openai.com/codex/skills/)
