#!/usr/bin/env bash
# deps.sh — detect required system tools and guide installation.

check_deps() {
  local master="$1"
  local need_rsvg=0
  local missing=()

  local master_lower
  master_lower=$(printf '%s' "$master" | tr '[:upper:]' '[:lower:]')
  case "$master_lower" in
    *.svg) need_rsvg=1 ;;
  esac

  if ! command -v magick >/dev/null 2>&1; then
    missing+=("imagemagick")
  fi

  if [[ $need_rsvg -eq 1 ]] && ! command -v rsvg-convert >/dev/null 2>&1; then
    missing+=("librsvg")
  fi

  if [[ ${#missing[@]} -eq 0 ]]; then
    log_ok "All dependencies present: $(magick -version | head -1 | awk '{print $2,$3}')"
    [[ $need_rsvg -eq 1 ]] && log_ok "librsvg: $(rsvg-convert --version | head -1)"
    return 0
  fi

  log_err "Missing required tools: ${missing[*]}"
  echo
  echo "Install with one of:"
  local os="$(uname -s)"
  case "$os" in
    Darwin)
      echo "  macOS:      brew install ${missing[*]}"
      ;;
    Linux)
      if command -v apt >/dev/null 2>&1; then
        local apt_pkgs=()
        for m in "${missing[@]}"; do
          case "$m" in
            imagemagick) apt_pkgs+=("imagemagick") ;;
            librsvg)     apt_pkgs+=("librsvg2-bin") ;;
          esac
        done
        echo "  Ubuntu:     sudo apt install ${apt_pkgs[*]}"
      elif command -v pacman >/dev/null 2>&1; then
        echo "  Arch:       sudo pacman -S ${missing[*]}"
      elif command -v dnf >/dev/null 2>&1; then
        echo "  Fedora:     sudo dnf install ${missing[*]}"
      fi
      ;;
  esac
  echo "  Windows:    choco install ${missing[*]}"
  echo
  echo "After installing, re-run this command."
  exit 1
}
