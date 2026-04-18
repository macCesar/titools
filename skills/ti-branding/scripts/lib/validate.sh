#!/usr/bin/env bash
# validate.sh — sanity-check the master input.

validate_master() {
  local master="$1"
  local ext="${master##*.}"
  ext=$(printf '%s' "$ext" | tr '[:upper:]' '[:lower:]')

  case "$ext" in
    svg)
      validate_svg "$master"
      ;;
    png)
      validate_png "$master"
      ;;
    *)
      log_err "Unsupported format: .$ext (expected .svg or .png)"
      exit 2
      ;;
  esac
}

validate_svg() {
  local master="$1"
  if ! grep -q "<svg" "$master" 2>/dev/null; then
    log_err "File does not appear to be valid SVG: $master"
    exit 2
  fi

  if grep -qE '<(script|foreignObject)' "$master" 2>/dev/null; then
    log_warn "SVG contains <script> or <foreignObject> — may not render correctly."
  fi

  log_ok "SVG input accepted (will rasterize to 1024×1024)"
}

validate_png() {
  local master="$1"
  local w h
  w=$(magick identify -format "%w" "$master" 2>/dev/null || echo 0)
  h=$(magick identify -format "%h" "$master" 2>/dev/null || echo 0)

  if [[ -z "$w" || "$w" -eq 0 ]]; then
    log_err "Could not read PNG dimensions: $master"
    exit 2
  fi

  if [[ "$w" -lt 1024 || "$h" -lt 1024 ]]; then
    log_err "PNG too small: ${w}×${h}. Need at least 1024×1024 for high-density output."
    exit 2
  fi

  if [[ "$w" -ne "$h" ]]; then
    log_warn "PNG is not square (${w}×${h}). Will be center-cropped to square."
  fi

  local has_alpha
  has_alpha=$(magick identify -format "%A" "$master" 2>/dev/null)
  case "$has_alpha" in
    True|Blend)
      log_ok "PNG ${w}×${h} with alpha — good for monochrome layer"
      ;;
    *)
      log_warn "PNG ${w}×${h} has no alpha — monochrome layer will be a square silhouette"
      ;;
  esac
}
