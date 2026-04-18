#!/usr/bin/env bash
# gen-splash-icon.sh — Android 12+ SplashScreen API icon.
# The spec: 288dp canvas, icon occupies the central 192dp (~67% of canvas).
# The OS renders a circular mask automatically, so keep the icon transparent
# outside the 192dp safe-zone.
#
# Densities: mdpi=288px, hdpi=432, xhdpi=576, xxhdpi=864, xxxhdpi=1152.

gen_splash_icon() {
  local master="$1"
  local res_root="$2"

  local densities=(mdpi hdpi xhdpi xxhdpi xxxhdpi)
  local sizes=(288 432 576 864 1152)

  for i in "${!densities[@]}"; do
    local d="${densities[$i]}"
    local size="${sizes[$i]}"
    local inner=$(( size * 192 / 288 ))
    local dir="$res_root/drawable-$d"
    mkdir -p "$dir"

    magick "$master" \
      -resize "${inner}x${inner}" \
      -background none -gravity center -extent "${size}x${size}" \
      -strip \
      "$dir/splash_icon.png"
  done

  log_ok "Android 12+ splash_icon.png × 5 densities"
}
