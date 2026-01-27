#!/bin/bash

# Titanium SDK Skills Installer
# Installs to ~/.agents/skills/ and creates symlinks for detected platforms
# Compatible with: Claude Code, Gemini CLI, Codex CLI

set -e

REPO_URL="https://github.com/macCesar/titanium-sdk-skills"
SKILLS=(alloy-expert purgetss ti-ui ti-howtos ti-guides alloy-guides alloy-howtos)
AGENTS_DIR="$HOME/.agents"
AGENTS_SKILLS_DIR="$AGENTS_DIR/skills"

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
            echo "  2. Creates symlinks in detected AI CLI directories"
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

    echo -ne "Installing to $AGENTS_SKILLS_DIR... "
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
            echo -e "${GREEN}✓${NC} $skill"
        fi
    done

    echo -e "${GREEN}Done${NC}"
}

# Create symlinks for detected platforms
create_symlinks() {
    for i in "$@"; do
        local platform="${PLATFORM_NAMES[$i]}"
        local platform_path="${PLATFORM_PATHS[$i]}"
        local platform_display="${PLATFORM_DISPLAY[$i]}"

        echo -ne "Creating symlinks for $platform_display... "

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

        echo -e "${GREEN}Done${NC}"
    done
}

# Handle custom path (skip symlinks)
if [ -n "$CUSTOM_PATH" ]; then
    TMP_DIR=$(mktemp -d)
    trap "rm -rf $TMP_DIR" EXIT
    echo -ne "Downloading... "
    git clone --depth 1 --quiet "$REPO_URL" "$TMP_DIR/repo" 2>/dev/null || { echo -e "${RED}Failed${NC}"; exit 1; }
    echo -e "${GREEN}Done${NC}"
    install_to_agents "$TMP_DIR/repo"
    SKILLS_LIST=$(printf '%s, ' "${SKILLS[@]}" | sed 's/, $//')
    echo -e "\n${GREEN}✓ Installed:${NC} $SKILLS_LIST"
    echo ""
    echo "Skills are in: $AGENTS_SKILLS_DIR"
    echo ""
    echo "Start using them by asking about Titanium SDK development!"
    echo ""
    echo "Examples:"
    echo "  \"Create a login screen with PurgeTSS styling\""
    echo "  \"How do I structure an Alloy app?\""
    echo "  \"Implement push notifications\""
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

    read -p "Enter your choice: " choice

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

    echo -ne "Downloading from GitHub... "
    git clone --depth 1 --quiet "$REPO_URL" "$TMP_DIR/repo" 2>/dev/null || { echo -e "${RED}Failed${NC}"; exit 1; }
    echo -e "${GREEN}Done${NC}"

    REPO_DIR="$TMP_DIR/repo"
fi

# Install to central agents directory
install_to_agents "$REPO_DIR"

# Create symlinks for selected platforms
create_symlinks "${SELECTED_INDICES[@]}"

SKILLS_LIST=$(printf '%s, ' "${SKILLS[@]}" | sed 's/, $//')
echo -e "\n${GREEN}✓ Installed:${NC} $SKILLS_LIST"
echo ""
echo "Skills location: $AGENTS_SKILLS_DIR"
echo "Symlinks created in: ${PLATFORM_DISPLAY[*]}"
echo ""
echo "Start using them by asking about Titanium SDK development!"
echo ""
echo "Examples:"
echo "  \"Create a login screen with PurgeTSS styling\""
echo "  \"How do I structure an Alloy app?\""
echo "  \"Implement push notifications\""
echo ""
