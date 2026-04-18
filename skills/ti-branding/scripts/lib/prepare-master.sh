#!/usr/bin/env bash
# prepare-master.sh — produces two normalized masters from the input:
#
#   1. <out>_square.png — 1024×1024 PNG with the logo centered in a square
#      canvas and transparent padding added to sides (or top/bottom) to keep
#      the logo's aspect intact. Used for iOS DefaultIcon and marketplace
#      artwork — platforms that require square icons.
#
#   2. <out>_tight.png — logo rasterized at 1024-px max dimension with its
#      native aspect preserved (no padding added). Used for Android adaptive
#      icon generation so a horizontal wordmark can fill the safe-zone by
#      width instead of being double-padded inside the square master.
#
# The skill's main script passes <out>_square.png to iOS generators and
# <out>_tight.png to Android adaptive/legacy/notification/splash generators.

prepare_master() {
  local input="$1"
  local base="$2"       # e.g. /path/.ti-branding/_master (no extension)
  local square="${base}_square.png"
  local tight="${base}_tight.png"
  local ext="${input##*.}"
  ext=$(printf '%s' "$ext" | tr '[:upper:]' '[:lower:]')

  mkdir -p "$(dirname "$base")"

  case "$ext" in
    svg)
      # Rasterize SVG at 2048-px max dimension preserving native aspect — this
      # is the tight master. rsvg-convert's -a flag preserves aspect when both
      # -w and -h are supplied, producing the larger of the two dimensions.
      rsvg-convert -w 2048 -h 2048 -a "$input" -o "$tight.2x.png"
      magick "$tight.2x.png" -resize "1024x1024>" -strip "$tight"
      rm -f "$tight.2x.png"
      ;;
    png)
      magick "$input" -resize "1024x1024>" -strip "$tight"
      ;;
  esac

  # Build the square master by padding the tight master to 1024×1024 with
  # transparency. magick's -gravity center + -extent centers the logo and
  # distributes padding to whichever axis is shorter.
  magick "$tight" \
    -background none -gravity center -extent 1024x1024 \
    -strip \
    "$square"
}
