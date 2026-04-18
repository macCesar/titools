#!/usr/bin/env bash
# gen-ios.sh — produce DefaultIcon-ios.png (1024×1024, alpha flattened over bg-color).
#
# Unlike Android adaptive icons, iOS app icons have no "safe zone" — the launcher
# doesn't mask them. What you see is what ships. So padding is purely visual
# breathing room around the logo. Default 8% per side (logo fills 84% of the
# canvas), which matches Apple's HIG aesthetic for branded wordmarks.
#
# iOS rejects icons with alpha, so the final output is flattened over bg-color.

gen_ios() {
  local tight="$1"        # tight master (aspect-preserved, transparent bg)
  local bg="$2"
  local padding="$3"      # iOS padding percent per side (default 8)
  local out_root="$4"

  mkdir -p "$out_root"

  local size=1024
  local inner=$(( size * (100 - 2 * padding) / 100 ))

  magick "$tight" \
    -resize "${inner}x${inner}" \
    -background none -gravity center -extent "${size}x${size}" \
    -background "$bg" -alpha remove -alpha off \
    -strip \
    "$out_root/DefaultIcon-ios.png"

  log_ok "DefaultIcon-ios.png (1024×1024, ${padding}% padding, alpha flattened over $bg)"
}
