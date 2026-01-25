# Titanium SDK Skills for AI Coding Assistants

A comprehensive collection of AI-powered skills that transform your coding assistant into a **Titanium SDK expert**. Build cross-platform mobile applications with Titanium SDK, Alloy MVC, and PurgeTSS.

## Compatible Platforms

| Platform | Status | Installation Path |
|----------|--------|-------------------|
| [Claude Code](https://claude.ai/claude-code) | ✅ Fully Compatible | `~/.claude/skills/` |
| [Gemini CLI](https://github.com/google-gemini/gemini-cli) | ✅ Fully Compatible | `~/.gemini/skills/` |
| [Codex CLI](https://developers.openai.com/codex/cli/) | ✅ Fully Compatible | `~/.codex/skills/` |

All three platforms use the same **Agent Skills open standard**: a `SKILL.md` file with YAML frontmatter.

---

## Quick Install

### One-Line Install (All Platforms)

```bash
curl -fsSL https://raw.githubusercontent.com/macCesar/titanium-sdk-skills/main/install.sh | bash
```

This script auto-detects which platforms you have installed and copies skills to the appropriate locations.

### Manual Install

Clone and copy to your platform's skills directory:

```bash
git clone https://github.com/macCesar/titanium-sdk-skills.git
cd titanium-sdk-skills

# For Claude Code
cp -r skills/* ~/.claude/skills/

# For Gemini CLI
cp -r skills/* ~/.gemini/skills/

# For Codex CLI
cp -r skills/* ~/.codex/skills/
```

### Verify Installation

**Claude Code:**
```bash
ls ~/.claude/skills/
# Should show: alloy-expert, purgetss, ti-ui, ti-howtos, ti-guides, alloy-guides, alloy-howtos
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

| Skill | Purpose | Use When |
|-------|---------|----------|
| **alloy-expert** | Architecture + Implementation | Starting point for most Titanium/Alloy tasks |
| **purgetss** | Utility-first styling | UI styling, animations, icon fonts |
| **ti-ui** | UI/UX patterns | Layouts, ListViews, gestures, platform UI |
| **ti-howtos** | Native features | Location, Push, Media, Platform APIs |
| **ti-guides** | SDK fundamentals | Hyperloop, distribution, tiapp.xml |
| **alloy-guides** | Alloy MVC reference | Models, Views, Controllers, Widgets |
| **alloy-howtos** | Alloy CLI & debugging | Project setup, CLI commands, errors |

---

## How Skills Work

Skills are **automatically activated** based on your questions. Just ask naturally:

```
"Create a login screen with email validation and animations"
```

The AI will automatically use:
- `alloy-expert` → Architecture and controller structure
- `purgetss` → Styling classes and animations
- `ti-howtos` → Secure token storage

### Skill Hierarchy

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

**Activates when:**
- Designing project structure
- Implementing controllers, views, services
- Choosing data strategies (Models vs Collections)
- Memory management and cleanup patterns
- Performance optimization
- Security patterns

**Example prompts:**
```
"How should I structure a new Titanium Alloy app?"
"Create a user service that fetches data from an API"
"How do I prevent memory leaks in my controllers?"
```

---

### purgetss

**Utility-first styling toolkit for Titanium/Alloy.**

**Activates when:**
- Setting up PurgeTSS
- Complex layouts (Grid system)
- Animations (`<Animation>` component)
- Icon fonts (Font Awesome, Material Icons)
- Platform-specific styling

**Example prompts:**
```
"Create a responsive grid layout"
"Add a fade-in animation"
"How do I use Font Awesome icons?"
```

**Critical rules:**
- NO flexbox (`flex-row`, `justify-between`) → use `horizontal`/`vertical`
- NO `w-full` → use `w-screen`
- NO `p-*` on Views → use `m-*` on children

---

### ti-ui

**UI/UX expert for layouts and platform components.**

**Activates when:**
- Layout systems
- ListView/TableView optimization
- Gestures (swipe, pinch)
- App icons and splash screens
- Platform-specific UI

**Example prompts:**
```
"Create a high-performance ListView"
"Handle swipe gestures on table rows"
"Set up app icons for all densities"
```

---

### ti-howtos

**Native feature integration expert.**

**Activates when:**
- Location services and Maps
- Push notifications
- Camera and Gallery
- Audio/Video
- File system and SQLite
- Android Intents
- iOS Background Services

**Example prompts:**
```
"Implement GPS tracking"
"Set up push notifications"
"Capture and resize photos"
```

---

### ti-guides

**SDK fundamentals and advanced configuration.**

**Activates when:**
- Hyperloop native access
- App distribution
- tiapp.xml configuration
- Memory optimization

**Example prompts:**
```
"Access native iOS APIs using Hyperloop"
"Prepare my app for App Store submission"
```

---

### alloy-guides

**Complete Alloy MVC framework reference.**

**Activates when:**
- MVC architecture
- Backbone.js models/collections
- Data binding
- Widgets

**Example prompts:**
```
"Create a model with SQLite adapter"
"Bind a collection to a TableView"
```

---

### alloy-howtos

**Alloy CLI, configuration, and debugging.**

**Activates when:**
- Alloy CLI commands
- Configuration files
- Debugging errors
- Custom XML tags

**Example prompts:**
```
"Generate a new model with CLI"
"Fix 'No app.js found' error"
```

---

## Usage Examples

### Starting a New Project
```
"I'm starting a new Titanium Alloy app for a food delivery service.
Help me set up the project structure."
```

### UI Development
```
"Create a product listing screen with pull-to-refresh,
infinite scroll, and swipe-to-delete"
```

### API Integration
```
"Build a complete authentication flow with JWT tokens
and secure storage"
```

### Performance Optimization
```
"My ListView scrolls poorly and uses too much memory.
Help me optimize it."
```

---

## Uninstall

```bash
# Claude Code
rm -rf ~/.claude/skills/{alloy-expert,purgetss,ti-ui,ti-howtos,ti-guides,alloy-guides,alloy-howtos}

# Gemini CLI
rm -rf ~/.gemini/skills/{alloy-expert,purgetss,ti-ui,ti-howtos,ti-guides,alloy-guides,alloy-howtos}

# Codex CLI
rm -rf ~/.codex/skills/{alloy-expert,purgetss,ti-ui,ti-howtos,ti-guides,alloy-guides,alloy-howtos}
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
