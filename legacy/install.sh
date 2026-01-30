#!/bin/bash

# Titanium SDK Skills & Agents Installer
# Installs skills to ~/.agents/skills/ and agents to ~/.claude/agents/
# Creates symlinks for detected platforms
# Compatible with: Claude Code, Gemini CLI, Codex CLI

set -e

REPO_URL="https://github.com/macCesar/titanium-sdk-skills"
SKILLS=(alloy-expert purgetss ti-ui ti-howtos ti-guides alloy-guides alloy-howtos)
AGENTS=(ti-researcher)
AGENTS_DIR="$HOME/.agents"
AGENTS_SKILLS_DIR="$AGENTS_DIR/skills"
CLAUDE_AGENTS_DIR="$HOME/.claude/agents"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}Titanium SDK Skills Installer${NC}"
echo ""

# Parse arguments first
CUSTOM_PATH=""
ALL_FLAG=false
while [[ $# -gt 0 ]]; do
    case $1 in
        --path)
            CUSTOM_PATH="$2"
            shift 2
            ;;
        --all)
            ALL_FLAG=true
            shift
            ;;
        --help)
            echo "Usage: ./install.sh [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --all          Install to all detected platforms without prompting"
            echo "  --path PATH    Install to a custom path (skips symlink setup)"
            echo "  --help         Show this help message"
            echo ""
            echo "This installer:"
            echo "  1. Installs skills to ~/.agents/skills/ (central location)"
            echo "  2. Installs agents to ~/.claude/agents/ (Claude Code)"
            echo "  3. Creates symlinks in detected AI CLI directories"
            echo ""
            exit 0
            ;;
        *)
            shift
            ;;
    esac
done

# Detect installed platforms
PLATFORM_NAMES=()
PLATFORM_PATHS=()
PLATFORM_DISPLAY=()

if [ -d "$HOME/.claude" ]; then
    PLATFORM_NAMES+=("claude")
    PLATFORM_PATHS+=("$HOME/.claude/skills")
    PLATFORM_DISPLAY+=("Claude Code")
    echo -e "${GREEN}✓${NC} Claude Code detected"
fi

if [ -d "$HOME/.gemini" ]; then
    PLATFORM_NAMES+=("gemini")
    PLATFORM_PATHS+=("$HOME/.gemini/skills")
    PLATFORM_DISPLAY+=("Gemini CLI")
    echo -e "${GREEN}✓${NC} Gemini CLI detected"
fi

if [ -d "$HOME/.codex" ]; then
    PLATFORM_NAMES+=("codex")
    PLATFORM_PATHS+=("$HOME/.codex/skills")
    PLATFORM_DISPLAY+=("Codex CLI")
    echo -e "${GREEN}✓${NC} Codex CLI detected"
fi

if [ ${#PLATFORM_NAMES[@]} -eq 0 ]; then
    echo -e "${YELLOW}No AI coding assistants detected.${NC}"
    echo "Install one of: Claude Code, Gemini CLI, or Codex CLI"
    echo "Or use: ./install.sh --path /custom/path"
    exit 1
fi

echo ""

# Install function to central location
install_to_agents() {
    local repo_dir="$1"

    echo -ne "${CYAN}→${NC} Installing skills... "
    mkdir -p "$AGENTS_SKILLS_DIR"

    for skill in "${SKILLS[@]}"; do
        local skill_src="$repo_dir/skills/$skill"
        local skill_dest="$AGENTS_SKILLS_DIR/$skill"

        if [ -d "$skill_src" ]; then
            # Remove existing directory/symlink
            if [ -e "$skill_dest" ] || [ -L "$skill_dest" ]; then
                rm -rf "$skill_dest"
            fi
            # Copy skill to agents directory
            cp -r "$skill_src" "$skill_dest"
        fi
    done

    echo -e "${GREEN}✓${NC}"
}

# Install agents to Claude Code
install_agents() {
    local repo_dir="$1"

    # Only install agents if Claude Code is detected
    if [ ! -d "$HOME/.claude" ]; then
        return
    fi

    echo -ne "${CYAN}→${NC} Installing agents... "
    mkdir -p "$CLAUDE_AGENTS_DIR"

    for agent in "${AGENTS[@]}"; do
        local agent_src="$repo_dir/agents/$agent.md"
        local agent_dest="$CLAUDE_AGENTS_DIR/$agent.md"

        if [ -f "$agent_src" ]; then
            # Remove existing file/symlink
            if [ -e "$agent_dest" ] || [ -L "$agent_dest" ]; then
                rm -f "$agent_dest"
            fi
            # Copy agent to Claude agents directory
            cp "$agent_src" "$agent_dest"
        fi
    done

    echo -e "${GREEN}✓${NC}"
}

# Install AGENTS-TEMPLATE.md
install_agents_template() {
    local repo_dir="$1"

    echo -ne "${CYAN}→${NC} Installing AGENTS-TEMPLATE.md... "
    mkdir -p "$AGENTS_DIR"

    local template_src="$repo_dir/AGENTS-TEMPLATE.md"
    local template_dest="$AGENTS_DIR/AGENTS-TEMPLATE.md"

    # Copy template
    if [ -f "$template_src" ]; then
        cp "$template_src" "$template_dest"
        echo -e "${GREEN}✓${NC}"
    else
        # Download from GitHub if not in local repo
        curl -fsSL -o "$template_dest" \
            "https://raw.githubusercontent.com/macCesar/titanium-sdk-skills/main/AGENTS-TEMPLATE.md"
        echo -e "${GREEN}✓${NC}"
    fi
}

# Install ti-docs-index command
install_ti_docs_index() {
    local repo_dir="$1"

    echo -ne "${CYAN}→${NC} Installing ti-docs-index command... "

    local script_src="$repo_dir/scripts/ti-docs-index"
    local script_dest

    # Detect OS and choose installation path
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        # Windows (Git Bash, MSYS2)
        mkdir -p "$HOME/bin" 2>/dev/null
        script_dest="$HOME/bin/ti-docs-index"
    else
        # Unix/macOS
        script_dest="/usr/local/bin/ti-docs-index"
    fi

    # Check if script exists in local repo
    if [ -f "$script_src" ]; then
        if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
            # Windows: no sudo needed
            cp "$script_src" "$script_dest" 2>/dev/null || {
                echo -e "${YELLOW}⚠${NC} (failed)"
                return
            }
        else
            # Unix/macOS: try with sudo, fallback without
            sudo cp "$script_src" "$script_dest" 2>/dev/null || {
                cp "$script_src" "$script_dest" 2>/dev/null || {
                    echo -e "${YELLOW}⚠${NC} (requires sudo, skipping)"
                    return
                }
            }
        fi
    else
        # Download from GitHub
        if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
            curl -fsSL -o "$script_dest" \
                "https://raw.githubusercontent.com/macCesar/titanium-sdk-skills/main/scripts/ti-docs-index" 2>/dev/null || {
                echo -e "${YELLOW}⚠${NC} (failed to download)"
                return
            }
        else
            sudo curl -fsSL -o "$script_dest" \
                "https://raw.githubusercontent.com/macCesar/titanium-sdk-skills/main/scripts/ti-docs-index" 2>/dev/null || {
                curl -fsSL -o "$script_dest" \
                    "https://raw.githubusercontent.com/macCesar/titanium-sdk-skills/main/scripts/ti-docs-index" 2>/dev/null || {
                    echo -e "${YELLOW}⚠${NC} (failed to download)"
                    return
                }
            }
        fi
    fi

    # Make executable
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        chmod +x "$script_dest" 2>/dev/null
    else
        sudo chmod +x "$script_dest" 2>/dev/null || chmod +x "$script_dest" 2>/dev/null
    fi

    echo -e "${GREEN}✓${NC} (${script_dest})"
}

# Create symlinks for detected platforms
create_symlinks() {
    for i in "$@"; do
        local platform="${PLATFORM_NAMES[$i]}"
        local platform_path="${PLATFORM_PATHS[$i]}"
        local platform_display="${PLATFORM_DISPLAY[$i]}"

        echo -ne "${CYAN}→${NC} Linking $platform_display... "

        mkdir -p "$platform_path"

        for skill in "${SKILLS[@]}"; do
            local skill_source="$AGENTS_SKILLS_DIR/$skill"
            local symlink_target="$platform_path/$skill"

            # Remove existing symlink or directory
            if [ -e "$symlink_target" ] || [ -L "$symlink_target" ]; then
                rm -rf "$symlink_target"
            fi

            # Create relative symlink
            if [ -d "$skill_source" ]; then
                ln -s "$skill_source" "$symlink_target"
            fi
        done

        echo -e "${GREEN}✓${NC}"
    done
}

# Handle custom path (skip symlinks)
if [ -n "$CUSTOM_PATH" ]; then
    TMP_DIR=$(mktemp -d)
    trap "rm -rf $TMP_DIR" EXIT
    echo -ne "${CYAN}→${NC} Downloading... "
    git clone --depth 1 --quiet "$REPO_URL" "$TMP_DIR/repo" 2>/dev/null || { echo -e "${RED}✗${NC}"; exit 1; }
    echo -e "${GREEN}✓${NC}"
    install_to_agents "$TMP_DIR/repo"
    install_agents "$TMP_DIR/repo"
    install_agents_template "$TMP_DIR/repo"
    install_ti_docs_index "$TMP_DIR/repo"
    SKILLS_LIST=$(printf '%s, ' "${SKILLS[@]}" | sed 's/, $//')
    echo -e "\n${GREEN}✓${NC} Skills: $SKILLS_LIST"
    if [ -d "$HOME/.claude" ] && [ ${#AGENTS[@]} -gt 0 ]; then
        AGENTS_LIST=$(printf '%s, ' "${AGENTS[@]}" | sed 's/, $//')
        echo -e "${GREEN}✓${NC} Agents: $AGENTS_LIST"
    fi
    echo -e "${GREEN}✓${NC} AGENTS.md support installed"
    echo ""
    echo -e "${BLUE}▸${NC} Add AGENTS.md to your project: ${CYAN}ti-docs-index${NC}"
    echo -e "${BLUE}▸${NC} Improves AI: ${RED}53%${NC} → ${GREEN}100%${NC}"
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        echo -e "${YELLOW}▸${NC} Windows: Ensure ~/bin is in your PATH"
    fi
    echo ""
    exit 0
fi

# Select platforms to install
SELECTED_INDICES=()

if [ "$ALL_FLAG" = true ]; then
    for i in "${!PLATFORM_NAMES[@]}"; do
        SELECTED_INDICES+=("$i")
    done
else
    # Interactive selection
    echo -e "${BOLD}Select platform to install:${NC}"
    echo ""
    echo -e "  ${CYAN}a)${NC} All detected platforms"

    for i in "${!PLATFORM_NAMES[@]}"; do
        echo -e "  ${CYAN}$((i+1)))${NC} ${PLATFORM_DISPLAY[$i]} only"
    done

    echo -e "  ${CYAN}q)${NC} Quit"
    echo ""

    read -p "Enter your choice: " choice < /dev/tty

    case $choice in
        a|A)
            for i in "${!PLATFORM_NAMES[@]}"; do
                SELECTED_INDICES+=("$i")
            done
            ;;
        q|Q)
            echo "Cancelled."
            exit 0
            ;;
        *)
            if [[ "$choice" =~ ^[0-9]+$ ]] && [ "$choice" -ge 1 ] && [ "$choice" -le ${#PLATFORM_NAMES[@]} ]; then
                SELECTED_INDICES+=("$((choice-1))")
            else
                IFS=',' read -ra SELECTIONS <<< "$choice"
                for sel in "${SELECTIONS[@]}"; do
                    sel=$(echo "$sel" | tr -d ' ')
                    if [[ "$sel" =~ ^[0-9]+$ ]] && [ "$sel" -ge 1 ] && [ "$sel" -le ${#PLATFORM_NAMES[@]} ]; then
                        SELECTED_INDICES+=("$((sel-1))")
                    fi
                done
                if [ ${#SELECTED_INDICES[@]} -eq 0 ]; then
                    echo -e "${RED}Invalid selection.${NC}"
                    exit 1
                fi
            fi
            ;;
    esac
fi

if [ ${#SELECTED_INDICES[@]} -eq 0 ]; then
    echo "No platforms selected."
    exit 0
fi

# Detect if running from repo (local installation)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -d "$SCRIPT_DIR/skills" ]; then
    # Running from local repo - use current directory
    REPO_DIR="$SCRIPT_DIR"
    echo -e "${GREEN}Using local repository${NC}"
else
    # Download from GitHub
    REPO_DIR=""
    TMP_DIR=$(mktemp -d)
    trap "rm -rf $TMP_DIR" EXIT

    echo -ne "${CYAN}→${NC} Downloading from GitHub... "
    git clone --depth 1 --quiet "$REPO_URL" "$TMP_DIR/repo" 2>/dev/null || { echo -e "${RED}✗${NC}"; exit 1; }
    echo -e "${GREEN}✓${NC}"

    REPO_DIR="$TMP_DIR/repo"
fi

# Install to central agents directory
install_to_agents "$REPO_DIR"

# Install agents to Claude Code
install_agents "$REPO_DIR"

# Install AGENTS-TEMPLATE.md
install_agents_template "$REPO_DIR"

# Install ti-docs-index command
install_ti_docs_index "$REPO_DIR"

# Create symlinks for selected platforms
create_symlinks "${SELECTED_INDICES[@]}"

SKILLS_LIST=$(printf '%s, ' "${SKILLS[@]}" | sed 's/, $//')
echo -e "\n${GREEN}✓${NC} Skills: $SKILLS_LIST"
if [ -d "$HOME/.claude" ] && [ ${#AGENTS[@]} -gt 0 ]; then
    AGENTS_LIST=$(printf '%s, ' "${AGENTS[@]}" | sed 's/, $//')
    echo -e "${GREEN}✓${NC} Agents: $AGENTS_LIST"
fi
echo -e "${GREEN}✓${NC} AGENTS.md support installed"
echo ""
echo -e "${BLUE}▸${NC} Add AGENTS.md to your project: ${CYAN}ti-docs-index${NC}"
echo -e "${BLUE}▸${NC} Improves AI: ${RED}53%${NC} → ${GREEN}100%${NC}"
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    echo -e "${YELLOW}▸${NC} Windows: Ensure ~/bin is in your PATH"
fi
echo ""
