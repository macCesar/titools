#!/usr/bin/env bash
# gen-marketplace.sh — store-submission artwork.
#
#   iTunesConnect.png      1024×1024 (App Store)
#   MarketplaceArtwork.png 512×512   (Google Play)
#
# Alpha handling depends on whether --bg-color was EXPLICITLY provided
# (tracked via the 5th argument, `flatten`):
#   - flatten=0 (no --bg-color) → alpha preserved, matches `ti create` default
#   - flatten=1 (--bg-color X)  → alpha flattened on bg-color. Prevents the
#                                  dark-mode-muddy-icon issue on Play Store
#                                  and macOS App Store when the master has
#                                  significant transparent areas.
#
# Uses the same --ios-padding as the iOS master (default 8%) so the three
# square icons share the same visual weight.

gen_marketplace() {
  local tight="$1"
  local bg="$2"
  local padding="$3"      # ios-padding percent per side
  local out_root="$4"
  local flatten="${5:-0}" # 1 when --bg-color was explicitly provided

  mkdir -p "$out_root"

  local flatten_args=()
  local alpha_label="alpha"
  if [[ "$flatten" == "1" ]]; then
    flatten_args=(-background "$bg" -alpha remove -alpha off)
    alpha_label="flat on $bg"
  fi

  # App Store (1024²)
  local size_ios=1024
  local inner_ios=$(( size_ios * (100 - 2 * padding) / 100 ))
  magick "$tight" \
    -resize "${inner_ios}x${inner_ios}" \
    -background none -gravity center -extent "${size_ios}x${size_ios}" \
    "${flatten_args[@]}" \
    -strip \
    "$out_root/iTunesConnect.png"

  # Google Play (512²)
  local size_play=512
  local inner_play=$(( size_play * (100 - 2 * padding) / 100 ))
  magick "$tight" \
    -resize "${inner_play}x${inner_play}" \
    -background none -gravity center -extent "${size_play}x${size_play}" \
    "${flatten_args[@]}" \
    -strip \
    "$out_root/MarketplaceArtwork.png"

  log_ok "Marketplace artwork: iTunesConnect.png (1024², ${padding}% padding, ${alpha_label}), MarketplaceArtwork.png (512², ${padding}% padding, ${alpha_label})"
}
