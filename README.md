# titools - Titanium CLI for AI Coding Assistants

A comprehensive CLI that transforms your coding assistant into a **Titanium SDK expert**. Install skills, agents, and documentation for Titanium SDK, Alloy MVC, and PurgeTSS development.

## Compatible Platforms

| Platform                                                  | Status             | Installation Path   |
| --------------------------------------------------------- | ------------------ | ------------------- |
| [Claude Code](https://claude.ai/claude-code)              | ✅ Fully Compatible | `~/.claude/skills/` |
| [Gemini CLI](https://github.com/google-gemini/gemini-cli) | ✅ Fully Compatible | `~/.gemini/skills/` |
| [Codex CLI](https://developers.openai.com/codex/cli/)     | ✅ Fully Compatible | `~/.codex/skills/`  |

All three platforms use the same **Agent Skills open standard**: a `SKILL.md` file with YAML frontmatter.

---

## Quick Install

### NPM Package (Recommended)

```bash
npm install -g @maccesar/titools
```

This installs the `titools` CLI command globally:

```bash
# Install knowledge packages and platform links
titools install

# Sync knowledge index files in your project
titools sync

# Update knowledge packages and agent (and refresh existing knowledge index files)
titools update

# Show version
titools --version
```

**What it installs:**
- ✅ All 7 titanium-* skills
- ✅ ti-pro agent
- ✅ Automatic documentation generation

**Why use NPM?**
- ✅ Cross-platform support (macOS, Linux, Windows)
- ✅ No sudo required
- ✅ Easy version management
- ✅ Simple updates with `titools update`

---

## Usage

### titools install

Installs Titanium knowledge packages and platform links.

```bash
titools install [options]
```

**Options:**
| Option          | Description                                                         |
| --------------- | ------------------------------------------------------------------- |
| `-l, --local`   | Install skills locally in the current project (`./.agents/skills/`) |
| `-a, --all`     | Install to all detected platforms without prompting                 |
| `--path <path>` | Install to a custom path (skips symlink setup)                      |

**What it does:**
- ✅ Installs all 7 titanium-* skills (global or local)
- ✅ Installs ti-pro agent for Claude Code
- ✅ Creates symlinks from platform directories to central skills
- ✅ Detects installed AI platforms and lets you choose which to link
- ✅ Cleans up legacy artifacts (`alloy-expert` skill, `ti-researcher` agent)
- ✅ If run inside a Titanium project, prompts to sync knowledge index files

Run inside a Titanium project to install locally or globally from anywhere.

### Recommended Setup Flow

Start in a Titanium project so the instruction files can be created/updated:

```bash
# 1) Create a Titanium project
ti create

# 2) Enter the project
cd /path/to/your/project

# 3) Install knowledge packages (global or local)
titools install

# 4) Sync knowledge index files (AGENTS.md/CLAUDE.md/GEMINI.md)
titools sync
```

### titools sync

Updates the Titanium knowledge index inside your project's instruction files.

```bash
titools sync [path] [options]
```

**Arguments:**
| Argument | Description                                  |
| -------- | -------------------------------------------- |
| `[path]` | Project path (defaults to current directory) |

**Options:**
| Option          | Description                                |
| --------------- | ------------------------------------------ |
| `-f, --force`   | Overwrite existing files without prompting |
| `-v, --verbose` | Show detailed diagnostics                  |

**What it does:**
- Detects Titanium SDK version from `tiapp.xml`
- Prompts you to select which files to sync: `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`
- Inserts or updates a compressed knowledge index block in selected files
- Removes knowledge blocks from unselected files
- Creates files if they don't exist
- Only works inside a Titanium project (requires `tiapp.xml`)

### titools update

Updates installed knowledge packages and agent to the latest version.

```bash
titools update [options]
```

**Options:**
| Option        | Description                                |
| ------------- | ------------------------------------------ |
| `-l, --local` | Update local skills in the current project |

**What it does:**
- Checks GitHub for the latest version
- Downloads and installs updated skills and agents
- Updates platform symlinks for all detected platforms
- Cleans up legacy artifacts (`alloy-expert` skill, `ti-researcher` agent)
- Auto-syncs knowledge index files in Titanium projects
- If only local **or** global skills exist, updates that location automatically
- If both exist, prompts you to choose

> Note: This updates knowledge packages/agent and refreshes existing knowledge index files, not the CLI binary itself. To update the CLI, use `npm update -g @maccesar/titools`.

### titools remove

Removes knowledge packages, agents, symlinks, and knowledge index blocks.

```bash
titools remove [options]
```

**Options:**
| Option        | Description                                  |
| ------------- | -------------------------------------------- |
| `-l, --local` | Remove local skills from the current project |

**What it does:**
- Detects all installed components (skills, agents, symlinks, knowledge blocks)
- Prompts you to select what to remove:
  - ti-pro agent for Claude Code
  - Knowledge index blocks from instruction files (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`)
  - Skills from global (`~/.agents/skills/`) or project directory
  - Platform symlinks from global or project directory
- Removes both current and legacy artifacts

### Verify Installation

**Check titools version:**
```bash
titools --version
```

**Check central location (global install):**
```bash
ls ~/.agents/skills/
# Should show: ti-expert, purgetss, ti-ui, ti-howtos, ti-guides, alloy-guides, alloy-howtos
```

**Claude Code (skills):**
```bash
ls -la ~/.claude/skills/
# Should show symlinks pointing to ~/.agents/skills/
```

**Claude Code (agents):**
```bash
ls -la ~/.claude/agents/
# Should show: ti-pro.md
```

**Gemini CLI:**
```bash
gemini skills list
```

**Codex CLI:**
```bash
# Type /skills in Codex or use $ to mention a skill
```

---

## Knowledge Index: Boost AI Performance

**File selection per assistant:**
- Claude Code → `CLAUDE.md`
- Gemini CLI → `GEMINI.md`
- Codex CLI / others → `AGENTS.md`

Run this inside your Titanium project:

```bash
cd /path/to/your/titanium/project
titools sync
```

---

### How the Knowledge Index Works

| Approach            | Reported Pass Rate |
| ------------------- | ------------------ |
| No documentation    | 53%                |
| Skills only         | 53-79%             |
| **Knowledge index** | **100%**           |

**Why it works (per Vercel’s evaluation):**
- **No decision point** - Information is always present, no need to invoke skills
- **Consistent availability** - Available in every turn, not async-loaded
- **No ordering issues** - No "read docs first vs explore project first" dilemma

For details, see `AGENTS-VERCEL-RESEARCH.md`.

### How to Sync the Knowledge Index

The `titools sync` command will:
1. Verify this is a Titanium project (checks for `tiapp.xml`)
2. Detect your Titanium SDK version
3. Update `AGENTS.md`/`CLAUDE.md`/`GEMINI.md` with a compressed knowledge index
4. Intelligently merge if file already exists (removes old block, adds new one)

**Selection behavior:** The command lets you choose which instruction files to sync and preselects any files that already contain a knowledge block.

### What the Knowledge Index Contains

```
[Titanium SDK Docs Index]|root: ~/.agents/skills
|ti-expert/references:{alloy-structure.md,anti-patterns.md,...}
|purgetss/references:{animation-system.md,class-index.md,...}
|ti-ui/references:{layouts-and-positioning.md,listviews-and-performance.md,...}
...
```

The index points to all reference documentation, so your AI assistant can quickly retrieve accurate information without relying on potentially outdated training data.

### Version Notice

The knowledge index is based on the **latest Titanium SDK documentation**. If your project uses an older version, the command will detect and warn you about potential API differences.

---

## How to Use the Knowledge Index

Once installed, the AI assistant automatically reads the documentation index in every conversation. Just ask natural questions about Titanium development:

### Example Prompts

**General Architecture:**
```
"How should I structure a new Alloy app with authentication?"
"What’s a solid pattern for navigation between screens?"
```

**PurgeTSS Styling:**
```
"Can you create a product card with PurgeTSS (image, title, price, buy button)?"
"How do I use the 12‑column grid system in PurgeTSS?"
"Explain why my build fails with platform‑specific properties."
```

**UI Components:**
```
"How do I build a high‑performance ListView with custom templates?"
"Implement pull‑to‑refresh on a ScrollView."
```

**Native Features:**
```
"How do I implement push notifications for iOS and Android?"
"Handle GPS location in the background."
```

**Debugging:**
```
"Why is my ListView scrolling poorly?"
"Fix “Alloy is not defined” in my lib file."
```

---

## How Skills Work with the Knowledge Index

The knowledge index provides always-available context (the documentation index).
**Skills** provide specialized, on-demand expertise.

Together they work seamlessly:

| Your Question                   | Knowledge Index Provides        | Skills Activate               |
| ------------------------------- | ------------------------------- | ----------------------------- |
| "Create a login screen"         | Context about project structure | `ti-expert`, `ti-ui`          |
| "Optimize ListView performance" | Points to docs location         | `ti-ui` reads specific files  |
| "Implement push notifications"  | API reference paths             | `ti-howtos` provides workflow |

**You don't need to explicitly invoke skills** - the AI detects when to use them based on your question.

---

## Skills Overview

| Skill            | Purpose                       | Best For                                |
| ---------------- | ----------------------------- | --------------------------------------- |
| **ti-expert**    | Architecture + Implementation | Starting point for most tasks           |
| **purgetss**     | Utility-first styling         | UI styling and animations               |
| **ti-ui**        | UI/UX patterns                | Complex layouts, ListViews, platform UI |
| **ti-howtos**    | Native feature integration    | Location, Push, Media, Platform APIs    |
| **ti-guides**    | SDK fundamentals              | Hyperloop, distribution, configuration  |
| **alloy-guides** | Alloy MVC reference           | Models, Views, Controllers, Widgets     |
| **alloy-howtos** | Alloy CLI & debugging         | Project setup, CLI commands, errors     |

> **Note:** `ti-guides`, `ti-howtos`, `ti-ui`, `alloy-guides`, and `alloy-howtos` are based on **official Titanium SDK and Alloy documentation**. `ti-expert` and `purgetss` are opinionated and reflect personal coding conventions (biased toward PurgeTSS).

---

## Agents (Claude Code Only)

In addition to skills, this repository includes **sub-agents** for Claude Code. Sub-agents run in isolated contexts and are ideal for research tasks that produce verbose output.

### ti-pro

**Deep-dive research specialist that preloads all 7 titanium-\* skills.**

| Aspect               | Details                                      |
| -------------------- | -------------------------------------------- |
| **Location**         | `~/.claude/agents/ti-pro.md`                 |
| **Model**            | Sonnet (comprehensive analysis)              |
| **Tools**            | Read-only (Read, Grep, Glob)                 |
| **Preloaded Skills** | All 7 titanium-\* skills injected at startup |

**When to use the agent vs skills:**

| Use Case                     | Use This                        | Why                                                  |
| ---------------------------- | ------------------------------- | ---------------------------------------------------- |
| Quick inline reference       | `/ti-expert`, `/purgetss`, etc. | Runs in main conversation, interactive               |
| Analyzing an entire codebase | `ti-pro` agent                  | Isolates verbose output, cross-references all skills |
| Multi-feature research       | `ti-pro` agent                  | Preloads all skills for comprehensive answers        |
| Step-by-step implementation  | Skills directly                 | Task-oriented guidance                               |
| Architecture review          | `ti-pro` agent                  | Read-only analysis across all documentation          |

**Example prompts for the agent:**

```
"Can you use the ti-pro agent to analyze this Alloy codebase’s architecture?"
"Can you research how to combine location, push, and background sync in Titanium?"
"Can you compare ListView vs TableView performance for my use case?"
"Review this Titanium mobile app and identify anti‑patterns."
```

> **Tip**: For automatic activation, include words like "Titanium", "Alloy", or "mobile app" in your prompt to ensure the specialized agent is used instead of generic code analysis.

**Key difference:**
- **Skills** = Interactive help during development (inline, conversational)
- **Agents** = Isolated research tasks (returns summary, keeps verbose output separate)

---

## How Skills Work

Skills are **automatically activated** based on your questions. Just ask naturally:

```
"Can you create a login screen with email validation and animations?"
```

The AI will automatically use:
- `ti-expert` → Architecture and controller structure
- `purgetss` → Styling classes and animations (if PurgeTSS detected)
- `ti-howtos` → Secure token storage

**You don't need to call skills explicitly** - the AI reads skill descriptions and loads the appropriate knowledge when needed.

### Project Detection

All skills now include **automatic project detection** to ensure compatibility:

| Skill            | What It Detects       | How It Works                                                  |
| ---------------- | --------------------- | ------------------------------------------------------------- |
| **purgetss**     | PurgeTSS installation | Checks for `purgetss/` folder, `config.cjs`, `utilities.tss`  |
| **ti-expert**    | Alloy vs Classic      | Checks for `app/` (Alloy) vs `Resources/` (Classic) structure |
| **alloy-guides** | Alloy projects        | Checks for `app/views/`, `app/controllers/`                   |
| **alloy-howtos** | Alloy projects        | Checks for `alloy.jmk`, `config.json`                         |
| **ti-ui**        | Titanium projects     | Checks for `tiapp.xml` (both Alloy & Classic)                 |
| **ti-guides**    | Titanium projects     | Checks for `tiapp.xml` (both Alloy & Classic)                 |
| **ti-howtos**    | Titanium projects     | Checks for `tiapp.xml` (both Alloy & Classic)                 |

**Why this matters:**
- PurgeTSS suggestions are **only provided** if PurgeTSS is installed
- Alloy-specific patterns are **only suggested** for Alloy projects
- Classic Titanium projects won't receive inappropriate Alloy advice

### Skill Hierarchy

`ti-expert` acts as the **orchestrator**, delegating to specialized skills when needed:

```
                    ┌─────────────────┐
                    │  ti-expert   │
                    │  (Start Here)   │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│   purgetss    │   │    ti-ui      │   │   ti-howtos   │
│   (Styling)   │   │   (UI/UX)     │   │   (Native)    │
└───────────────┘   └───────────────┘   └───────────────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│  ti-guides    │   │ alloy-guides  │   │ alloy-howtos  │
│    (SDK)      │   │    (MVC)      │   │    (CLI)      │
└───────────────┘   └───────────────┘   └───────────────┘
```

---

## Skill Details

### ti-expert

**The primary skill for Titanium Alloy development.** Start here for most tasks.

**When it activates:**
- Designing project structure
- Implementing controllers, views, services
- Choosing data strategies (Models vs Collections)
- Writing clean ES6+ code
- Memory management and cleanup patterns
- Performance optimization
- Security patterns
- Migrating legacy apps

**Example prompts:**
```
"How should I structure a new Titanium Alloy app with authentication?"
"Create a user service that fetches data from an API."
"What’s the best pattern for navigation between screens?"
"Prevent memory leaks in my controllers."
"Migrate classic Titanium code to modern Alloy patterns."
"What’s a clean way to organize services in an Alloy app?"
```

**Key features:**
- Quick decision matrix for common questions
- 18 reference guides for deep dives
- Delegates to specialized skills when needed

---

### purgetss

**Utility-first styling toolkit for Titanium/Alloy.**

**When it activates:**
- Setting up PurgeTSS in a project
- Complex layouts (Grid system)
- Declarative animations (`<Animation>` component)
- Icon fonts (Font Awesome, Material Icons)
- Custom color palettes
- Platform-specific styling
- config.cjs configuration

**Example prompts:**
```
"How do I set up PurgeTSS in my existing Alloy project?"
"Create a responsive 12‑column grid layout."
"Add a fade‑in animation when my view appears."
"How do I configure custom colors in config.cjs?"
"How do I use Font Awesome 7 icons?"
"Style this button differently on iOS vs Android."
```

**Critical rules:**
- **Platform-specific properties REQUIRE modifiers** (e.g., `[platform=ios]`) to prevent cross-platform build failures
- NO flexbox (`flex-row`, `justify-between`) → use `horizontal`/`vertical`
- NO `w-full` → use `w-screen`
- NO `p-*` on Views → use `m-*` on children
- Arbitrary values use parentheses: `w-(100px)`, NOT `w-[100px]`

---

### ti-ui

**UI/UX expert for layouts and platform components.**

**When it activates:**
- Layout systems (composite, vertical, horizontal)
- ListView/TableView optimization
- Event handling and bubbling
- Animations and transforms
- Gestures (swipe, pinch, longpress)
- Orientation handling
- App icons and splash screens
- Android Action Bar / iOS Navigation patterns
- Accessibility (VoiceOver, TalkBack)

**Example prompts:**
```
"How do I create a high‑performance ListView with custom templates?"
"Handle swipe gestures on table rows."
"Set up app icons for all iOS and Android densities."
"Implement pull‑to‑refresh on a ScrollView."
"How do I make my app accessible for VoiceOver users?"
"How do I configure the Android Action Bar with custom menu items?"
```

**Key rules:**
- NO `Ti.UI.SIZE` in ListView items (causes jerky scrolling)
- Prefer ListView over TableView for large datasets
- Use `dp` units for cross-platform consistency
- Remove global listeners on pause

---

### ti-howtos

**Native feature integration expert.**

**When it activates:**
- Location services and Maps
- Push notifications (APNs/FCM)
- Local notifications
- Camera and Gallery
- Audio/Video playback
- File system operations
- SQLite databases
- HTTPClient networking
- WebView integration
- Android Intents and Services
- iOS Background Services, iCloud, Keychain
- Core Motion, WatchKit

**Example prompts:**
```
"How do I implement battery‑efficient GPS tracking?"
"How do I set up push notifications for iOS and Android?"
"How do I capture and resize photos from the camera?"
"Download files with a progress indicator."
"How should I store sensitive data in iOS Keychain?"
"Create an Android background service."
"Integrate with Apple Watch using WatchKit."
"Handle background location updates on iOS."
```

**Key rules:**
- Always handle both `onload` and `onerror` for HTTPClient
- Always close database handles and result sets
- Use `imageAsResized` to avoid memory exhaustion
- Configure proper permissions in tiapp.xml

---

### ti-guides

**SDK fundamentals and advanced configuration.**

**When it activates:**
- Hyperloop native access
- Native module development
- App distribution (Play Store, App Store)
- tiapp.xml configuration
- CLI commands and options
- Memory and bridge optimization
- CommonJS module patterns
- Coding best practices

**Example prompts:**
```
"How do I access native iOS APIs using Hyperloop?"
"Configure tiapp.xml for a production build."
"What do I need for Google Play submission?"
"How do I create a native Android module?"
"Optimize bridge crossings for better performance."
"List reserved words I should avoid."
```

---

### alloy-guides

**Complete Alloy MVC framework reference.**

**When it activates:**
- MVC architecture concepts
- Backbone.js models and collections
- Data binding patterns
- XML markup elements
- TSS styling syntax
- Widget development
- Sync adapters (sql, properties)
- Migrations

**Example prompts:**
```
"Explain how Alloy data binding works."
"How do I create a model with the SQLite adapter?"
"Bind a collection to a TableView."
"How do I build a reusable widget?"
"Show the TSS syntax for platform‑specific styles."
"How does the Alloy compilation process work?"
```

---

### alloy-howtos

**Alloy CLI, configuration, and debugging.**

**When it activates:**
- Alloy CLI commands (new, generate, compile)
- Configuration files (alloy.jmk, config.json)
- Debugging compilation errors
- Conditional views
- Custom XML tags
- Best practices and naming conventions
- Backbone.Events patterns

**Example prompts:**
```
"How do I generate a new model with the CLI?"
"Configure alloy.jmk build hooks."
"How do I fix “No app.js found”?"
"Create conditional views based on user state."
"How do I build a custom XML tag without widgets?"
"Set up Backbone.Events for global communication."
```

**Key rules:**
- Use Backbone.Events instead of Ti.App.fireEvent
- Never use double underscore prefixes (`__foo`)
- Access config at runtime with `Alloy.CFG.yourKey`

---

## Usage Examples

### Starting a New Project
```
"I'm starting a new Titanium Alloy app for a food delivery service.
Can you help me set up the project structure?"
```

### UI Development
```
"Can you create a product listing screen with:
- Pull-to-refresh
- Infinite scroll pagination
- Image caching
- Swipe-to-delete"
```

### API Integration
```
"Can you build a complete authentication flow with:
- Login/Register screens
- JWT token management
- Secure storage
- Auto-refresh tokens"
```

### Performance Optimization
```
"My app is slow — the ListView scrolls poorly and memory usage is high. How do I optimize it?"
```

### Migration
```
"I have a legacy Titanium classic app from 2015. Can you help me migrate it to modern Alloy?"
```

### Platform-Specific Features
```
"How do I implement Apple Sign‑In for iOS and Google Sign‑In for Android?"
```

### Debugging
```
"How do I fix “Alloy is not defined” in my lib file?"
```

### Codebase Analysis (Using Agent)
```
"Use the ti-pro agent to analyze this project and:
- review the overall architecture
- identify memory leak patterns
- check for common anti‑patterns
- suggest improvements"
```

---

## Best Practices

### 1. Be Specific
Instead of: "Make a list"
Try: "Can you create a ListView with user avatars, names, and swipe actions?"

### 2. Provide Context
Instead of: "How do I fix this error?"
Try: "I'm getting this error when compiling: [error message]. Here's my code: [code]"

### 3. Ask for Architecture First
For complex features, start with:
"How should I architect a real-time chat feature?"
Then follow up with implementation details.

### 4. Mention Constraints
"Build a settings screen. Must work offline and sync when connected."

### 5. Reference Existing Code
"Here's my current controller. How can I improve memory management?"

> **More examples:** See [Example Prompts](EXAMPLE-PROMPTS.md) for detailed prompts that test each skill's capabilities.

---

## Skill Contents Summary

| Skill        | SKILL.md                      | References                                            |
| ------------ | ----------------------------- | ----------------------------------------------------- |
| ti-expert    | Architecture + Implementation | 19 refs + 1 asset (patterns, testing, security, etc.) |
| purgetss     | Setup + Critical Rules        | 21 files (grid, animations, icons, class-index, etc.) |
| ti-ui        | UI Rules + Platform Diffs     | 14 files (layouts, lists, gestures, etc.)             |
| ti-howtos    | Integration Workflow          | 18 files (location, media, maps, automation, etc.)    |
| ti-guides    | Core Workflow                 | 14 files (hyperloop, distribution, etc.)              |
| alloy-guides | MVC Quick Start               | 10 files (models, views, widgets, etc.)               |
| alloy-howtos | Best Practices                | 6 files (CLI, config, debugging, etc.)                |

---

## Troubleshooting

### Skill Not Activating?

If the AI doesn't seem to use Titanium knowledge:
1. Mention "Titanium" or "Alloy" explicitly in your prompt
2. Be more specific about what you're building
3. Reference the technology stack
4. Try explicit invocation: "Use the purgetss skill for styling questions"

### Getting Wrong Suggestions?

If the AI suggests patterns you don't use (e.g., PurgeTSS when you're not using it):
1. The skill may not have detected your project type correctly
2. Explicitly mention your stack: "I'm using Classic Titanium, not Alloy"
3. Be more specific about what you're building

### PurgeTSS Not Detected?

If the purgetss skill doesn't activate for your PurgeTSS project:
1. Verify `purgetss/` folder exists in project root
2. Check that `purgetss/config.cjs` exists
3. Mention "PurgeTSS" explicitly in your prompt

### Wrong Advice?

If the AI suggests incorrect patterns (like flexbox):
1. Remind it you're using PurgeTSS
2. Reference the correct pattern from memory
3. Ask to check the PurgeTSS rules

### Need More Detail?

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

**Note:** `titools remove` can remove the knowledge index blocks from your project files, but it does not delete the files themselves.


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

## Legacy Installation (Not Recommended)

The bash installer is maintained for backward compatibility but **NPM installation is strongly recommended**.

```bash
curl -fsSL https://raw.githubusercontent.com/macCesar/titools/main/install.sh | bash
```

Use this only if you cannot use NPM for any reason.

---

## Credits

Created by **César Estrada** ([@macCesar](https://github.com/macCesar)), creator of [PurgeTSS](https://github.com/macCesar/purgeTSS).

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
