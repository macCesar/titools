#!/bin/bash

# Titanium SDK Skills Installer
# Compatible with: Claude Code, Gemini CLI, Codex CLI

set -e

REPO_URL="https://github.com/macCesar/titanium-sdk-skills"
SKILLS=(alloy-expert purgetss ti-ui ti-howtos ti-guides alloy-guides alloy-howtos)

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Titanium SDK Skills Installer                  ║${NC}"
echo -e "${BLUE}║     For Claude Code, Gemini CLI, and Codex CLI     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"
echo ""

# Detect installed platforms
PLATFORMS=()

if [ -d "$HOME/.claude" ]; then
    PLATFORMS+=("claude:$HOME/.claude/skills")
    echo -e "${GREEN}✓${NC} Claude Code detected"
fi

if [ -d "$HOME/.gemini" ]; then
    PLATFORMS+=("gemini:$HOME/.gemini/skills")
    echo -e "${GREEN}✓${NC} Gemini CLI detected"
fi

if [ -d "$HOME/.codex" ]; then
    PLATFORMS+=("codex:$HOME/.codex/skills")
    echo -e "${GREEN}✓${NC} Codex CLI detected"
fi

if [ ${#PLATFORMS[@]} -eq 0 ]; then
    echo -e "${YELLOW}No AI coding assistants detected.${NC}"
    echo ""
    echo "Please install at least one of:"
    echo "  - Claude Code: https://claude.ai/claude-code"
    echo "  - Gemini CLI:  https://github.com/google-gemini/gemini-cli"
    echo "  - Codex CLI:   https://developers.openai.com/codex/cli/"
    echo ""
    echo "Or specify a custom path:"
    echo "  ./install.sh --path /custom/path/to/skills"
    exit 1
fi

echo ""

# Parse arguments
CUSTOM_PATH=""
while [[ $# -gt 0 ]]; do
    case $1 in
        --path)
            CUSTOM_PATH="$2"
            shift 2
            ;;
        --help)
            echo "Usage: ./install.sh [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --path PATH    Install to a custom path"
            echo "  --help         Show this help message"
            exit 0
            ;;
        *)
            shift
            ;;
    esac
done

# Create temporary directory
TMP_DIR=$(mktemp -d)
trap "rm -rf $TMP_DIR" EXIT

echo -e "${BLUE}Downloading skills...${NC}"

# Clone repository
git clone --depth 1 --quiet "$REPO_URL" "$TMP_DIR/repo" 2>/dev/null || {
    echo -e "${RED}Failed to clone repository${NC}"
    echo "Please check your internet connection and try again."
    exit 1
}

echo -e "${GREEN}✓${NC} Download complete"
echo ""

# Install function
install_skills() {
    local dest="$1"
    local platform="$2"

    mkdir -p "$dest"

    for skill in "${SKILLS[@]}"; do
        if [ -d "$TMP_DIR/repo/skills/$skill" ]; then
            cp -r "$TMP_DIR/repo/skills/$skill" "$dest/"
            echo -e "  ${GREEN}✓${NC} $skill"
        fi
    done
}

# Install to custom path if specified
if [ -n "$CUSTOM_PATH" ]; then
    echo -e "${BLUE}Installing to custom path: $CUSTOM_PATH${NC}"
    install_skills "$CUSTOM_PATH" "custom"
    echo ""
    echo -e "${GREEN}Installation complete!${NC}"
    exit 0
fi

# Install to detected platforms
for platform_info in "${PLATFORMS[@]}"; do
    platform="${platform_info%%:*}"
    path="${platform_info##*:}"

    echo -e "${BLUE}Installing to $platform ($path)${NC}"
    install_skills "$path" "$platform"
    echo ""
done

echo -e "${GREEN}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║           Installation Complete!                   ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════╝${NC}"
echo ""
echo "Installed skills:"
for skill in "${SKILLS[@]}"; do
    echo "  • $skill"
done
echo ""
echo "Start using them by asking about Titanium SDK development!"
echo ""
echo "Examples:"
echo "  \"Create a login screen with PurgeTSS styling\""
echo "  \"How do I structure an Alloy app?\""
echo "  \"Implement push notifications\""
echo ""
