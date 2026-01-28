# Titanium SDK Skills for AI Coding Assistants

A comprehensive collection of AI-powered skills that transform your coding assistant into a **Titanium SDK expert**. Build cross-platform mobile applications with Titanium SDK, Alloy MVC, and PurgeTSS.

## Compatible Platforms

| Platform                                                  | Status             | Installation Path   |
| --------------------------------------------------------- | ------------------ | ------------------- |
| [Claude Code](https://claude.ai/claude-code)              | ✅ Fully Compatible | `~/.claude/skills/` |
| [Gemini CLI](https://github.com/google-gemini/gemini-cli) | ✅ Fully Compatible | `~/.gemini/skills/` |
| [Codex CLI](https://developers.openai.com/codex/cli/)     | ✅ Fully Compatible | `~/.codex/skills/`  |

All three platforms use the same **Agent Skills open standard**: a `SKILL.md` file with YAML frontmatter.

---

## Quick Install

### One-Line Install

```bash
curl -fsSL https://raw.githubusercontent.com/macCesar/titanium-sdk-skills/main/install.sh | bash
```

Auto-detects installed LLMs and creates a centralized installation with symlinks to detected platforms:

```
Titanium SDK Skills Installer

✓ Claude Code detected
✓ Gemini CLI detected
✓ Codex CLI detected

This installer:
  1. Installs skills to ~/.agents/skills/ (central location)
  2. Installs agents to ~/.claude/agents/ (Claude Code)
  3. Creates symlinks in detected AI CLI directories

Select platform to install:

  a) All detected platforms
  1) Claude Code only
  2) Gemini CLI only
  3) Codex CLI only
  q) Quit
```

### Using skills.sh

You can also install these skills using `skills.sh` and follow the inline instructions:

```bash
npx skills add macCesar/titanium-sdk-skills
```

### Verify Installation

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
| **purgetss**     | PurgeTSS installation | Checks for `purgetss/` folder, `config.cjs`, `tailwind.tss`   |
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

## Uninstall

```bash
# Remove skill symlinks from all platforms
rm -rf ~/.claude/skills/{alloy-expert,purgetss,ti-ui,ti-howtos,ti-guides,alloy-guides,alloy-howtos}
rm -rf ~/.gemini/skills/{alloy-expert,purgetss,ti-ui,ti-howtos,ti-guides,alloy-guides,alloy-howtos}
rm -rf ~/.codex/skills/{alloy-expert,purgetss,ti-ui,ti-howtos,ti-guides,alloy-guides,alloy-howtos}

# Remove agent from Claude Code
rm -f ~/.claude/agents/ti-researcher.md

# Remove Titanium SDK skills from central directory (ONLY removes our skills)
for skill in alloy-expert purgetss ti-ui ti-howtos ti-guides alloy-guides alloy-howtos; do
    rm -rf ~/.agents/skills/"$skill"
done
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
