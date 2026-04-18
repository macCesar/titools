#!/usr/bin/env bash
# gen-ios.sh — produce Titanium's two root-level iOS/Android icons:
#
#   DefaultIcon.png       1024×1024, alpha preserved (universal / Android source)
#   DefaultIcon-ios.png   1024×1024, alpha flattened over bg-color (iOS)
#
# This matches what `titanium` / `alloy new` ships out of the box: a fresh
# Alloy project contains both files in the project root, with DefaultIcon.png
# keeping transparency and DefaultIcon-ios.png flattened (Apple rejects alpha
# on App Store icon uploads).
#
# Padding is purely visual breathing room — iOS app icons have no launcher
# mask. Default 8% per side (logo fills 84% of the canvas), which matches
# Apple's HIG aesthetic for branded wordmarks.

gen_ios() {
  local tight="$1"        # tight master (aspect-preserved, transparent bg)
  local bg="$2"
  local padding="$3"      # iOS padding percent per side (default 8)
  local out_root="$4"

  mkdir -p "$out_root"

  local size=1024
  local inner=$(( size * (100 - 2 * padding) / 100 ))

  # DefaultIcon.png — alpha preserved (matches `ti create` default for the
  # universal icon source; Alloy/Android use this directly).
  magick "$tight" \
    -resize "${inner}x${inner}" \
    -background none -gravity center -extent "${size}x${size}" \
    -strip \
    "$out_root/DefaultIcon.png"

  # DefaultIcon-ios.png — flattened over bg-color. This is the file iOS
  # actually ships; Apple rejects alpha on App Store icon uploads.
  magick "$tight" \
    -resize "${inner}x${inner}" \
    -background none -gravity center -extent "${size}x${size}" \
    -background "$bg" -alpha remove -alpha off \
    -strip \
    "$out_root/DefaultIcon-ios.png"

  log_ok "DefaultIcon.png (1024×1024, ${padding}% padding, alpha preserved)"
  log_ok "DefaultIcon-ios.png (1024×1024, ${padding}% padding, alpha flattened over $bg)"
}
