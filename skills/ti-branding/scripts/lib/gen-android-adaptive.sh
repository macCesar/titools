#!/usr/bin/env bash
# gen-android-adaptive.sh — produce the adaptive icon triplet (foreground +
# background + monochrome) at 5 densities.
#
# Android adaptive icon: 108×108dp canvas, 66×66dp safe-zone.
# Densities: mdpi=108px, hdpi=162, xhdpi=216, xxhdpi=324, xxxhdpi=432.
#
# Foreground: logo centered inside safe-zone, transparent outside.
# Background: solid color (or pattern) filling the full canvas.
# Monochrome: foreground silhouette in pure white with preserved alpha — Android
#             applies themed tint at runtime on API 31+.

gen_android_adaptive() {
  local master="$1"
  local bg="$2"
  local padding="$3"      # percent per side
  local res_root="$4"     # e.g. /path/app/platform/android/res

  local densities=(mdpi hdpi xhdpi xxhdpi xxxhdpi)
  local sizes=(108 162 216 324 432)

  for i in "${!densities[@]}"; do
    local d="${densities[$i]}"
    local size="${sizes[$i]}"
    local inner=$(( size * (100 - 2 * padding) / 100 ))
    local dir="$res_root/mipmap-$d"
    mkdir -p "$dir"

    # Foreground: logo centered, padded, transparent outside
    magick "$master" \
      -resize "${inner}x${inner}" \
      -background none -gravity center -extent "${size}x${size}" \
      -strip \
      "$dir/ic_launcher_foreground.png"

    # Background: solid color
    magick -size "${size}x${size}" "xc:$bg" \
      -strip \
      "$dir/ic_launcher_background.png"

    # Monochrome: foreground tinted to pure white, alpha preserved
    magick "$dir/ic_launcher_foreground.png" \
      -channel RGB -fill white -colorize 100 +channel \
      -strip \
      "$dir/ic_launcher_monochrome.png"
  done

  # anydpi-v26 binder directory (XML copied by caller from assets/ic_launcher.xml)
  mkdir -p "$res_root/mipmap-anydpi-v26"

  log_ok "Adaptive icons: foreground + background + monochrome × 5 densities"
}
