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
# Install skills and agents
titools install

# Add AGENTS.md/CLAUDE.md to your project
titools agents

# Update to the latest version
titools update

# Show version
titools --version
```

**What it installs:**
- ✅ All 7 titanium-* skills
- ✅ ti-researcher agent
- ✅ Automatic documentation generation

**Why use NPM?**
- ✅ Cross-platform support (macOS, Linux, Windows)
- ✅ No sudo required
- ✅ Easy version management
- ✅ Simple updates with `titools update`

---

## Usage

### titools install

Installs Titanium skills and agents globally:
- ✅ All 7 titanium-* skills
- ✅ ti-researcher agent
- ✅ AGENTS-TEMPLATE.md (template for documentation generation)

### Verify Installation

**Check titools version:**
```bash
titools --version
```

**Check central location:**
```bash
ls ~/.agents/skills/
# Should show: alloy-expert, purgetss, ti-ui, ti-howtos, ti-guides, alloy-guides, alloy-howtos
```

**Claude Code (skills):**
```bash
ls -la ~/.claude/skills/
# Should show symlinks pointing to ~/.agents/skills/
```

**Claude Code (agents):**
```bash
ls -la ~/.claude/agents/
# Should show: ti-researcher.md
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

## AGENTS.md: Boost AI Performance to 100%

### ⚠️ Claude Code Users: Use CLAUDE.md

**Claude Code specifically looks for `CLAUDE.md`** (not `AGENTS.md`).

The `titools agents` command detects if you use Claude Code and creates `CLAUDE.md` automatically:

```bash
cd /path/to/your/titanium/project
titools agents

# The command will ask:
# Which AI assistant are you using?
#   1) Claude Code (creates CLAUDE.md)
#   2) Gemini CLI (creates GEMINI.md)
#   3) Cursor/Copilot (creates AGENTS.md)
```

The content is identical - only the filename differs per AI assistant.

---

### How AGENTS.md/CLAUDE.md Works

| Approach         | Pass Rate |
| ---------------- | --------- |
| No documentation | 53%       |
| Skills only      | 53-79%    |
| **AGENTS.md**    | **100%**  |

**Why it works:**
- **No decision point** - Information is always present, no need to invoke skills
- **Consistent availability** - Available in every turn, not async-loaded
- **No ordering issues** - No "read docs first vs explore project first" dilemma

### How to Install AGENTS.md

After installing titools, add AGENTS.md to your Titanium project:

```bash
cd /path/to/your/titanium/project

# If using NPM installation:
titools agents
```

The `titools agents` command will:
1. Verify this is a Titanium project (checks for `tiapp.xml`)
2. Detect your Titanium SDK version
3. Create `AGENTS.md`/`CLAUDE.md`/`GEMINI.md` with a compressed 8KB documentation index
4. Intelligently merge if file already exists (removes old block, adds new one)

**Priority Logic:** If multiple AI files exist (CLAUDE.md, GEMINI.md, AGENTS.md), the command updates all of them automatically:
- CLAUDE.md has highest priority (Claude Code users)
- GEMINI.md has medium priority (Gemini CLI users)
- AGENTS.md has lowest priority (Cursor/Copilot users)

### What AGENTS.md Contains

```
[Titanium SDK Docs Index]|root: ~/.agents/skills
|alloy-expert/references:{alloy-structure.md,anti-patterns.md,...}
|purgetss/references:{animation-system.md,class-index.md,...}
|ti-ui/references:{layouts-and-positioning.md,listviews-and-performance.md,...}
...
```

The index points to all reference documentation, so your AI assistant can quickly retrieve accurate information without relying on potentially outdated training data.

### Version Notice

AGENTS.md is based on the **latest Titanium SDK documentation**. If your project uses an older version, the command will detect and warn you about potential API differences.

---

## How to Use AGENTS.md/CLAUDE.md

Once installed, the AI assistant automatically reads the documentation index in every conversation. Just ask natural questions about Titanium development:

### Example Prompts

**General Architecture:**
```
"How should I structure a new Alloy app with authentication?"
"What's the best pattern for navigation between screens?"
```

**PurgeTSS Styling:**
```
"Create a product card with PurgeTSS: image, title, price, and buy button"
"How do I use the 12-column grid system in PurgeTSS?"
"Why does my build fail with platform-specific properties?"
```

**UI Components:**
```
"Create a ListView with custom templates for performance"
"Implement pull-to-refresh on a ScrollView"
```

**Native Features:**
```
"Implement push notifications for iOS and Android"
"How do I handle GPS location in the background?"
```

**Debugging:**
```
"Why is my ListView scrolling poorly?"
"I'm getting 'Alloy is not defined' in my lib file. How do I fix it?"
```

---

## How Skills Work with AGENTS.md

**AGENTS.md** provides always-available context (the documentation index).
**Skills** provide specialized, on-demand expertise.

Together they work seamlessly:

| Your Question                   | AGENTS.md Provides              | Skills Activate               |
| ------------------------------- | ------------------------------- | ----------------------------- |
| "Create a login screen"         | Context about project structure | `alloy-expert`, `purgetss`    |
| "Optimize ListView performance" | Points to docs location         | `ti-ui` reads specific files  |
| "Implement push notifications"  | API reference paths             | `ti-howtos` provides workflow |

**You don't need to explicitly invoke skills** - the AI detects when to use them based on your question.

---

## Skills Overview

| Skill            | Purpose                       | Best For                                |
| ---------------- | ----------------------------- | --------------------------------------- |
| **alloy-expert** | Architecture + Implementation | Starting point for most tasks           |
| **purgetss**     | Utility-first styling         | UI styling and animations               |
| **ti-ui**        | UI/UX patterns                | Complex layouts, ListViews, platform UI |
| **ti-howtos**    | Native feature integration    | Location, Push, Media, Platform APIs    |
| **ti-guides**    | SDK fundamentals              | Hyperloop, distribution, configuration  |
| **alloy-guides** | Alloy MVC reference           | Models, Views, Controllers, Widgets     |
| **alloy-howtos** | Alloy CLI & debugging         | Project setup, CLI commands, errors     |

> **Note:** `ti-guides`, `ti-howtos`, `ti-ui`, `alloy-guides`, and `alloy-howtos` are based on **official Titanium SDK and Alloy documentation**. `alloy-expert` and `purgetss` are opinionated and reflect personal coding conventions (biased toward PurgeTSS).

---

## Agents (Claude Code Only)

In addition to skills, this repository includes **sub-agents** for Claude Code. Sub-agents run in isolated contexts and are ideal for research tasks that produce verbose output.

### ti-researcher

**Deep-dive research specialist that preloads all 7 titanium-\* skills.**

| Aspect               | Details                                      |
| -------------------- | -------------------------------------------- |
| **Location**         | `~/.claude/agents/ti-researcher.md`          |
| **Model**            | Sonnet (comprehensive analysis)              |
| **Tools**            | Read-only (Read, Grep, Glob)                 |
| **Preloaded Skills** | All 7 titanium-\* skills injected at startup |

**When to use the agent vs skills:**

| Use Case                     | Use This                           | Why                                                  |
| ---------------------------- | ---------------------------------- | ---------------------------------------------------- |
| Quick inline reference       | `/alloy-expert`, `/purgetss`, etc. | Runs in main conversation, interactive               |
| Analyzing an entire codebase | `ti-researcher` agent              | Isolates verbose output, cross-references all skills |
| Multi-feature research       | `ti-researcher` agent              | Preloads all skills for comprehensive answers        |
| Step-by-step implementation  | Skills directly                    | Task-oriented guidance                               |
| Architecture review          | `ti-researcher` agent              | Read-only analysis across all documentation          |

**Example prompts for the agent:**

```
"Use the ti-researcher agent to analyze this Alloy codebase's architecture"
"Research how to implement location + push + background sync together in Titanium"
"Compare ListView vs TableView for my use case with PurgeTSS styling"
"Review this Titanium mobile app and identify anti-patterns"
```

> **Tip**: For automatic activation, include words like "Titanium", "Alloy", or "mobile app" in your prompt to ensure the specialized agent is used instead of generic code analysis.

**Key difference:**
- **Skills** = Interactive help during development (inline, conversational)
- **Agents** = Isolated research tasks (returns summary, keeps verbose output separate)

---

## How Skills Work

Skills are **automatically activated** based on your questions. Just ask naturally:

```
"Create a login screen with email validation and animations"
```

The AI will automatically use:
- `alloy-expert` → Architecture and controller structure
- `purgetss` → Styling classes and animations (if PurgeTSS detected)
- `ti-howtos` → Secure token storage

**You don't need to call skills explicitly** - the AI reads skill descriptions and loads the appropriate knowledge when needed.

### Project Detection

All skills now include **automatic project detection** to ensure compatibility:

| Skill            | What It Detects       | How It Works                                                  |
| ---------------- | --------------------- | ------------------------------------------------------------- |
| **purgetss**     | PurgeTSS installation | Checks for `purgetss/` folder, `config.cjs`, `utilities.tss`  |
| **alloy-expert** | Alloy vs Classic      | Checks for `app/` (Alloy) vs `Resources/` (Classic) structure |
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

`alloy-expert` acts as the **orchestrator**, delegating to specialized skills when needed:

```
                    ┌─────────────────┐
                    │  alloy-expert   │
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

### alloy-expert

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
"Create a user service that fetches data from an API"
"What's the best pattern for navigation between screens?"
"How do I prevent memory leaks in my controllers?"
"Migrate this classic Titanium code to modern Alloy patterns"
```

**Key features:**
- PurgeTSS rules built-in (correct classes)
- Quick decision matrix for common questions
- 13 reference guides for deep dives
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
"Set up PurgeTSS in my existing Alloy project"
"Create a responsive 12-column grid layout"
"Add a fade-in animation when my view appears"
"Configure custom colors in config.cjs"
"How do I use Font Awesome 7 icons?"
"Style this button differently on iOS vs Android"
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
"Create a high-performance ListView with custom templates"
"Handle swipe gestures on table rows"
"Set up app icons for all iOS and Android densities"
"Implement pull-to-refresh on a ScrollView"
"Make my app accessible for VoiceOver users"
"Configure the Android Action Bar with custom menu items"
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
"Implement battery-efficient GPS tracking"
"Set up push notifications for iOS and Android"
"Capture and resize photos from the camera"
"Download files with progress indicator"
"Store sensitive data in iOS Keychain"
"Create an Android background service"
"Integrate with Apple Watch using WatchKit"
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
"Access native iOS APIs using Hyperloop"
"Configure tiapp.xml for production build"
"Prepare my app for Google Play submission"
"Create a native Android module"
"Optimize bridge crossings for better performance"
"What are the reserved words I should avoid?"
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
"Explain how Alloy data binding works"
"Create a model with SQLite adapter"
"Bind a collection to a TableView"
"Build a reusable widget"
"What's the TSS syntax for platform-specific styles?"
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
"Generate a new model with CLI"
"Configure alloy.jmk build hooks"
"Fix 'No app.js found' error"
"Create conditional views based on user state"
"Build a custom XML tag without widgets"
"Set up Backbone.Events for global communication"
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
Help me set up the project structure."
```

### UI Development
```
"Create a product listing screen with:
- Pull-to-refresh
- Infinite scroll pagination
- Image caching
- Swipe-to-delete"
```

### API Integration
```
"Build a complete authentication flow:
- Login/Register screens
- JWT token management
- Secure storage
- Auto-refresh tokens"
```

### Performance Optimization
```
"My app is slow. The ListView scrolls poorly and
the app uses too much memory. Help me optimize it."
```

### Migration
```
"I have a legacy Titanium classic app from 2015.
Help me migrate it to modern Alloy with PurgeTSS."
```

### Platform-Specific Features
```
"Implement Apple Sign-In for iOS and Google Sign-In for Android"
```

### Debugging
```
"I'm getting 'Alloy is not defined' in my lib file. How do I fix it?"
```

### Codebase Analysis (Using Agent)
```
"Use the ti-researcher agent to analyze this project:
- Review the overall architecture
- Identify memory leak patterns
- Check for PurgeTSS anti-patterns
- Suggest improvements"
```

---

## Best Practices

### 1. Be Specific
Instead of: "Make a list"
Try: "Create a ListView with user avatars, names, and swipe actions"

### 2. Provide Context
Instead of: "Fix the error"
Try: "I'm getting this error when compiling: [error message]. Here's my code: [code]"

### 3. Ask for Architecture First
For complex features, start with:
"How should I architect a real-time chat feature?"
Then follow up with implementation details.

### 4. Mention Constraints
"Build a settings screen. Must work offline and sync when connected."

### 5. Reference Existing Code
"Here's my current controller. How can I improve memory management?"

> **More examples:** See [Example Prompts](docs/EXAMPLE-PROMPTS.md) for detailed prompts that test each skill's capabilities.

---

## Skill Contents Summary

| Skill        | SKILL.md                      | References                                            |
| ------------ | ----------------------------- | ----------------------------------------------------- |
| alloy-expert | Architecture + Implementation | 14 files (patterns, testing, security, assets, etc.)  |
| purgetss     | Setup + Critical Rules        | 17 files (grid, animations, icons, class-index, etc.) |
| ti-ui        | UI Rules + Platform Diffs     | 13 files (layouts, lists, gestures, etc.)             |
| ti-howtos    | Integration Workflow          | 12 files (location, media, maps, automation, etc.)    |
| ti-guides    | Core Workflow                 | 10 files (hyperloop, distribution, etc.)              |
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
"What does the alloy-expert skill say about memory cleanup?"
```

---

## Troubleshooting

### titools command not found?

If the command is not found:
```bash
# Verify installation
npm list -g @maccesar/titools

# Re-install
npm install -g @maccesar/titools
```

### AGENTS.md not working?

If your AI doesn't use the AGENTS.md information:
1. Verify AGENTS.md/CLAUDE.md exists in your project root
2. Check that your AI supports these files (Claude Code does)
3. Try explicitly referencing: "Check the AGENTS.md documentation"

### Version mismatch warning?

AGENTS.md is based on the latest documentation. Be cautious when using newer APIs in older projects.

---

## Uninstall

```bash
# Remove the CLI
npm uninstall -g @maccesar/titools

# Remove skills and agents
titools uninstall
```

**Note:** AGENTS.md/CLAUDE.md/GEMINI.md files in your projects are NOT removed. To remove them manually:

```bash
rm -f /path/to/your/project/AGENTS.md
rm -f /path/to/your/project/CLAUDE.md
rm -f /path/to/your/project/GEMINI.md
```


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
