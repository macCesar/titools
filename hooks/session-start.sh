#!/bin/bash
# TiTools session start hook
# Detects Titanium projects and reminds Claude to use TiTools skills

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PLUGIN_ROOT="$(dirname "$SCRIPT_DIR")"

# Check if current project is a Titanium project
if [ -f "tiapp.xml" ]; then
  PROJECT_TYPE="Titanium"

  # Check for Alloy structure
  if [ -d "app/views" ] && [ -d "app/controllers" ]; then
    PROJECT_TYPE="Titanium Alloy"
  fi

  # Check for PurgeTSS
  HAS_PURGETSS=""
  if [ -d "purgetss" ] || [ -f "purgetss/config.cjs" ]; then
    HAS_PURGETSS=" + PurgeTSS"
  fi

  echo '{"priority": "IMPORTANT", "message": "'"${PROJECT_TYPE}${HAS_PURGETSS}"' project detected. TiTools skills are available and MUST be used before writing any Titanium code. Use ti-api for API lookups, ti-ui for UI patterns, ti-expert for architecture, alloy-guides for Alloy MVC, and purgetss for styling. NEVER rely on training data for Titanium — always consult the skill references first."}'
fi
