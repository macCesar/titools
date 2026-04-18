#!/usr/bin/env bash
# cleanup-legacy.sh — context-aware removal of legacy branding artifacts.
#
# Reads tiapp.xml to decide what's safe to delete. Categorizes targets into:
#
#   SAFE          always deleted — universally obsolete (dead qualifiers etc.)
#   CONDITIONAL   deleted only when project config guarantees they're unused
#                 (e.g. iOS legacy launch images when storyboard is enabled)
#   AGGRESSIVE    behind --aggressive flag — strongly defensible but some
#                 edge cases remain (e.g. ldpi drawables on <1% of devices)
#
# Always prints the plan before acting. Respects --dry-run.

# Append "path|reason" pair to a named array in a bash-3.2-compatible way.
_add_target() {
  local array_name="$1"
  local path="$2"
  local reason="$3"
  eval "$array_name+=(\"\$path|\$reason\")"
}

cleanup_legacy() {
  local project_root="$1"
  local project_type="$2"
  local aggressive="$3"
  local dry_run="$4"

  local tiapp="$project_root/tiapp.xml"
  local storyboard_enabled=0
  local portrait_only=0

  if [[ -f "$tiapp" ]]; then
    grep -q "<enable-launch-screen-storyboard>true" "$tiapp" && storyboard_enabled=1
    # Portrait-only heuristic: <orientations> block contains UIInterfaceOrientationPortrait
    # for iphone AND no Landscape entries.
    if grep -q '<orientations' "$tiapp" && \
       ! grep -iqE 'UIInterfaceOrientationLandscape' "$tiapp"; then
      portrait_only=1
    fi
  fi

  local android_images=""
  local iphone_dir=""
  local android_assets=""
  case "$project_type" in
    alloy)
      android_images="$project_root/app/assets/android/images"
      iphone_dir="$project_root/app/assets/iphone"
      android_assets="$project_root/app/assets/android"
      ;;
    classic)
      android_images="$project_root/Resources/android/images"
      iphone_dir="$project_root/Resources/iphone"
      android_assets="$project_root/Resources/android"
      ;;
  esac

  local has_adaptive=0
  [[ -d "$project_root/app/platform/android/res/mipmap-anydpi-v26" ]] && has_adaptive=1
  [[ -d "$project_root/platform/android/res/mipmap-anydpi-v26" ]] && has_adaptive=1

  local safe_targets=()
  local cond_targets=()
  local aggressive_targets=()

  # -------------------------------------------------------------------------
  # SAFE
  # -------------------------------------------------------------------------

  if [[ -n "$android_images" && -d "$android_images" ]]; then
    local d
    for d in "$android_images"/res-long-* "$android_images"/res-notlong-*; do
      [[ -d "$d" ]] && _add_target safe_targets "$d" "Android long/notlong qualifier (dead since Android 3.0, 2011)"
    done
  fi

  # -------------------------------------------------------------------------
  # CONDITIONAL
  # -------------------------------------------------------------------------

  # iOS legacy launch images — only safe with storyboard enabled
  if [[ $storyboard_enabled -eq 1 && -n "$iphone_dir" && -d "$iphone_dir" ]]; then
    local f
    for f in "$iphone_dir"/Default-*.png "$iphone_dir"/Default@2x.png; do
      [[ -f "$f" ]] && _add_target cond_targets "$f" "iOS legacy launch image (storyboard enabled → not consulted)"
    done
  fi

  # Android landscape-variant folders — safe when app is portrait-only
  if [[ $portrait_only -eq 1 && -n "$android_images" && -d "$android_images" ]]; then
    local d
    for d in "$android_images"/res-*-land-* "$android_images"/res-land-*; do
      [[ -d "$d" ]] && _add_target cond_targets "$d" "Landscape variant (app is portrait-only)"
    done
  fi

  # Android legacy splash PNG — safe when adaptive icons are in place
  if [[ $has_adaptive -eq 1 && -n "$android_assets" && -f "$android_assets/default.png" ]]; then
    _add_target cond_targets "$android_assets/default.png" "Legacy Android splash PNG (adaptive launcher handles splash now)"
  fi

  # Android legacy appicon.png — redundant when adaptive icons are in place
  if [[ $has_adaptive -eq 1 && -n "$android_assets" && -f "$android_assets/appicon.png" ]]; then
    _add_target cond_targets "$android_assets/appicon.png" "Legacy appicon.png (adaptive launcher takes precedence)"
  fi

  # -------------------------------------------------------------------------
  # AGGRESSIVE
  # -------------------------------------------------------------------------

  if [[ $aggressive -eq 1 ]]; then
    # ldpi everywhere — <1% of active devices globally in 2026
    local d
    if [[ -n "$android_images" && -d "$android_images" ]]; then
      for d in "$android_images"/res-ldpi "$android_images"/res-*-ldpi; do
        [[ -d "$d" ]] && _add_target aggressive_targets "$d" "ldpi density (<1% global market)"
      done
    fi
    for d in "$project_root/app/platform/android/res/drawable-ldpi" \
             "$project_root/app/platform/android/res/values-ldpi" \
             "$project_root/app/platform/android/res/mipmap-ldpi" \
             "$project_root/platform/android/res/drawable-ldpi" \
             "$project_root/platform/android/res/values-ldpi" \
             "$project_root/platform/android/res/mipmap-ldpi"; do
      [[ -d "$d" ]] && _add_target aggressive_targets "$d" "ldpi resource folder (<1% global market)"
    done
  fi

  # -------------------------------------------------------------------------
  # Print plan
  # -------------------------------------------------------------------------

  echo
  echo "${C_BOLD}Cleanup plan${C_RESET}"
  echo "  ${C_DIM}Project:            $project_root ($project_type)${C_RESET}"
  echo "  ${C_DIM}Storyboard:         $([[ $storyboard_enabled -eq 1 ]] && echo "enabled" || echo "disabled")${C_RESET}"
  echo "  ${C_DIM}Orientation:        $([[ $portrait_only -eq 1 ]] && echo "portrait-only" || echo "landscape allowed")${C_RESET}"
  echo "  ${C_DIM}Adaptive icons:     $([[ $has_adaptive -eq 1 ]] && echo "present" || echo "not detected")${C_RESET}"
  echo "  ${C_DIM}Aggressive mode:    $([[ $aggressive -eq 1 ]] && echo "on (includes ldpi)" || echo "off")${C_RESET}"

  local total=$(( ${#safe_targets[@]} + ${#cond_targets[@]} + ${#aggressive_targets[@]} ))

  if [[ $total -eq 0 ]]; then
    echo
    log_ok "No legacy artifacts detected. Project is already clean."
    return 0
  fi

  # bash 3.2 under `set -u` errors on "${empty_array[@]}" — iterate per-bucket
  # with explicit length guards instead of expanding empty arrays into args.
  _print_bucket_safe() {
    local t path reason size
    echo
    echo "${C_GREEN}SAFE — universally obsolete${C_RESET}"
    for t in "${safe_targets[@]}"; do
      path="${t%%|*}"; reason="${t#*|}"
      size=$(du -sk "$path" 2>/dev/null | awk '{print $1}')
      [[ -z "$size" ]] && size=0
      printf "    %-6sK  %s\n" "$size" "${path#$project_root/}"
      printf "              ${C_DIM}%s${C_RESET}\n" "$reason"
    done
  }
  _print_bucket_cond() {
    local t path reason size
    echo
    echo "${C_YELLOW}CONDITIONAL — safe given your project config${C_RESET}"
    for t in "${cond_targets[@]}"; do
      path="${t%%|*}"; reason="${t#*|}"
      size=$(du -sk "$path" 2>/dev/null | awk '{print $1}')
      [[ -z "$size" ]] && size=0
      printf "    %-6sK  %s\n" "$size" "${path#$project_root/}"
      printf "              ${C_DIM}%s${C_RESET}\n" "$reason"
    done
  }
  _print_bucket_aggr() {
    local t path reason size
    echo
    echo "${C_RED}AGGRESSIVE — --aggressive enabled${C_RESET}"
    for t in "${aggressive_targets[@]}"; do
      path="${t%%|*}"; reason="${t#*|}"
      size=$(du -sk "$path" 2>/dev/null | awk '{print $1}')
      [[ -z "$size" ]] && size=0
      printf "    %-6sK  %s\n" "$size" "${path#$project_root/}"
      printf "              ${C_DIM}%s${C_RESET}\n" "$reason"
    done
  }

  [[ ${#safe_targets[@]} -gt 0 ]] && _print_bucket_safe
  [[ ${#cond_targets[@]} -gt 0 ]] && _print_bucket_cond
  [[ ${#aggressive_targets[@]} -gt 0 ]] && _print_bucket_aggr

  echo
  echo "  ${C_BOLD}Total: $total item(s) to remove${C_RESET}"

  if [[ $dry_run -eq 1 ]]; then
    echo
    log_info "Dry-run mode — nothing deleted. Re-run without --dry-run to apply."
    return 0
  fi

  # -------------------------------------------------------------------------
  # Apply
  # -------------------------------------------------------------------------

  echo
  log_step "Applying cleanup"
  local t path
  if [[ ${#safe_targets[@]} -gt 0 ]]; then
    for t in "${safe_targets[@]}"; do
      path="${t%%|*}"; rm -rf "$path"
      log_ok "Removed ${path#$project_root/}"
    done
  fi
  if [[ ${#cond_targets[@]} -gt 0 ]]; then
    for t in "${cond_targets[@]}"; do
      path="${t%%|*}"; rm -rf "$path"
      log_ok "Removed ${path#$project_root/}"
    done
  fi
  if [[ ${#aggressive_targets[@]} -gt 0 ]]; then
    for t in "${aggressive_targets[@]}"; do
      path="${t%%|*}"; rm -rf "$path"
      log_ok "Removed ${path#$project_root/}"
    done
  fi
}
