#!/usr/bin/env bash
# gen-notification.sh — white-on-transparent notification icons at 5 densities.
# Android applies a runtime tint based on the notification's color property, so
# all non-transparent pixels become white and color information is discarded.
#
# Sizes per Android spec: mdpi=24px, hdpi=36, xhdpi=48, xxhdpi=72, xxxhdpi=96.
#
# Notification icons are NOT masked by the launcher, so they render as drawn.
# We trim any transparent padding baked into the master first, then scale the
# logo to fill the canvas edge-to-edge on its longer axis (with a 1px
# anti-aliasing margin per side). This matches what first-party Android apps
# ship (Gmail, Slack, Chrome) — the logo reaches the edge instead of sitting
# in a visibly padded box in the status bar.
#
# Material's 22dp-inside-24dp "live area" is a conservative guideline; in
# practice notification icons benefit from going closer to the edge because
# the status bar is already tiny.

gen_notification() {
  local master="$1"
  local res_root="$2"

  local densities=(mdpi hdpi xhdpi xxhdpi xxxhdpi)
  local sizes=(24 36 48 72 96)

  for i in "${!densities[@]}"; do
    local d="${densities[$i]}"
    local size="${sizes[$i]}"
    # Edge-to-edge with a 1px anti-aliasing margin per side.
    local inner=$(( size - 2 ))
    (( inner < 1 )) && inner=1
    local dir="$res_root/drawable-$d"
    mkdir -p "$dir"

    # Trim baked-in transparent padding from the master, then scale to inner.
    magick "$master" \
      -trim +repage \
      -resize "${inner}x${inner}" \
      -channel RGB -fill white -colorize 100 +channel \
      -background none -gravity center -extent "${size}x${size}" \
      -strip \
      "$dir/ic_stat_notify.png"
  done

  log_ok "Notification icons (white+alpha, edge-to-edge) × 5 densities"
}
