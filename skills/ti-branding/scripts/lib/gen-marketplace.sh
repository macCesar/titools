#!/usr/bin/env bash
# gen-marketplace.sh — store-submission artwork.
#
#   iTunesConnect.png:     1024×1024, no alpha (App Store)
#   MarketplaceArtwork.png: 512×512, no alpha (Google Play)
#
# Uses the same --ios-padding as the iOS master (default 8%). Store assets are
# scrutinized at large sizes and need visual breathing room — no safe-zone to
# comply with, but aesthetically they should match the DefaultIcon-ios look.

gen_marketplace() {
  local tight="$1"
  local bg="$2"
  local padding="$3"      # ios-padding percent per side
  local out_root="$4"

  mkdir -p "$out_root"

  # App Store (1024²)
  local size_ios=1024
  local inner_ios=$(( size_ios * (100 - 2 * padding) / 100 ))
  magick "$tight" \
    -resize "${inner_ios}x${inner_ios}" \
    -background none -gravity center -extent "${size_ios}x${size_ios}" \
    -background "$bg" -alpha remove -alpha off \
    -strip \
    "$out_root/iTunesConnect.png"

  # Google Play (512²)
  local size_play=512
  local inner_play=$(( size_play * (100 - 2 * padding) / 100 ))
  magick "$tight" \
    -resize "${inner_play}x${inner_play}" \
    -background none -gravity center -extent "${size_play}x${size_play}" \
    -background "$bg" -alpha remove -alpha off \
    -strip \
    "$out_root/MarketplaceArtwork.png"

  log_ok "Marketplace artwork: iTunesConnect.png (1024², ${padding}% padding), MarketplaceArtwork.png (512², ${padding}% padding)"
}
