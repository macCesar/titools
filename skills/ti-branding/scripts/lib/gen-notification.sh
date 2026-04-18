#!/usr/bin/env bash
# gen-notification.sh — white-on-transparent notification icons at 5 densities.
# Android applies a runtime tint based on the notification's color property, so
# all non-transparent pixels become white and color information is discarded.
#
# Sizes per Android spec: mdpi=24px, hdpi=36, xhdpi=48, xxhdpi=72, xxxhdpi=96.

gen_notification() {
  local master="$1"
  local padding="$2"
  local res_root="$3"

  local densities=(mdpi hdpi xhdpi xxhdpi xxxhdpi)
  local sizes=(24 36 48 72 96)

  for i in "${!densities[@]}"; do
    local d="${densities[$i]}"
    local size="${sizes[$i]}"
    # Notification icons get pretty heavily masked in the status bar, so use
    # slightly tighter padding than the full safe-zone.
    local inner=$(( size * (100 - 2 * padding) / 100 ))
    local dir="$res_root/drawable-$d"
    mkdir -p "$dir"

    magick "$master" \
      -resize "${inner}x${inner}" \
      -channel RGB -fill white -colorize 100 +channel \
      -background none -gravity center -extent "${size}x${size}" \
      -strip \
      "$dir/ic_stat_notify.png"
  done

  log_ok "Notification icons (white+alpha) × 5 densities"
}
