#!/usr/bin/env bash
# gen-android-legacy.sh — produce the flat ic_launcher.png for pre-adaptive Android
# (API 21–25, ~3% of users in 2026). Composites foreground over background and
# scales down to the legacy density sizes.
#
# Legacy densities: mdpi=48px, hdpi=72, xhdpi=96, xxhdpi=144, xxxhdpi=192.

gen_android_legacy() {
  local master="$1"
  local bg="$2"
  local padding="$3"
  local res_root="$4"

  local densities=(mdpi hdpi xhdpi xxhdpi xxxhdpi)
  local sizes=(48 72 96 144 192)

  for i in "${!densities[@]}"; do
    local d="${densities[$i]}"
    local size="${sizes[$i]}"
    # Legacy icons are displayed as-drawn (no adaptive mask), so we can fill more of
    # the canvas. Reduce the padding by ~40% for the legacy composite.
    local legacy_padding=$(( padding * 60 / 100 ))
    local inner=$(( size * (100 - 2 * legacy_padding) / 100 ))
    local dir="$res_root/mipmap-$d"
    mkdir -p "$dir"

    # Compose: solid bg + logo centered
    magick -size "${size}x${size}" "xc:$bg" \
      \( "$master" -resize "${inner}x${inner}" \) \
      -gravity center -composite \
      -strip \
      "$dir/ic_launcher.png"
  done

  log_ok "Legacy ic_launcher.png × 5 densities (fallback for Android <8)"
}
