# PurgeTSS Class Categories by Prefix

Complete inventory of all class prefixes organized by functional category. For naming conventions, the full 416-property table, and verification commands, see [class-index.md](./class-index.md).

---

### Layout & Structure

| Prefix | Count | Examples |
| --- | --- | --- |
| `horizontal` | 1 | `horizontal` |
| `vertical` | 1 | `vertical` |
| `composite` | 1 | `composite` (default, omit class) |
| `grid` | 1 | `grid` |
| `grid-cols-*` | ~12 | `grid-cols-2`, `grid-cols-3`, etc. |
| `col-*` | ~24 | `col-1/2`, `col-2/3`, etc. (percentages) |
| `row-*` | ~55 | `row-*` (grid row related) |
| `wh-` | ~60 | `wh-0`, `wh-auto`, `wh-screen`, `wh-full`, `wh-1/2` |
| `w-` | ~60 | `w-0` to `w-96`, `w-auto`, `w-screen`, `w-full`, `w-1/2` |
| `h-` | ~60 | `h-0` to `h-96`, `h-auto`, `h-screen`, `h-full`, `h-1/2` |
| `content-*` | ~20 | `content-h-*`, `content-w-*` |
| `aspect-*` | 2 | `aspect-ratio-16-9`, `aspect-ratio-4-3` |

> **Community-Discovered Pattern: `w-full` vs `w-screen`**
>
> - `w-full` → `width: '100%'` — 100% of parent container
> - `w-screen` → `width: Ti.UI.FILL` — Fills all available space in parent
> - `h-full` → `height: '100%'` — 100% of parent container
> - `h-screen` → `height: Ti.UI.FILL` — Fills all available space in parent
> - `wh-full` → Both `'100%'`

### Spacing (Margins & Padding)

| Prefix | Count | Examples |
| --- | --- | --- |
| `m-` | ~80 | `m-0` to `m-96`, `m-auto`, `m-1/2`, `m-px`, `m-0.5` |
| `mt-` | ~80 | `mt-0` to `mt-96`, `mt-auto`, `mt-1/2`, `mt-px` |
| `mb-` | ~80 | `mb-0` to `mb-96`, `mb-auto`, `mb-1/2`, `mb-px` |
| `ml-` | ~80 | `ml-0` to `ml-96`, `ml-auto`, `ml-1/2`, `ml-px` |
| `mr-` | ~80 | `mr-0` to `mr-96`, `mr-auto`, `mr-1/2`, `mr-px` |
| `mx-` | ~80 | `mx-0` to `mx-96`, `mx-auto`, `mx-1/2`, `mx-px` |
| `my-` | ~80 | `my-0` to `my-96`, `my-auto`, `my-1/2`, `my-px` |
| `p-` | ~80 | `p-0` to `p-96`, `p-auto`, `p-1/2`, `p-px` |
| `pt-` | ~80 | `pt-0` to `pt-96`, `pt-auto`, `pt-1/2`, `pt-px` |
| `pb-` | ~80 | `pb-0` to `pb-96`, `pb-auto`, `pb-1/2`, `pb-px` |
| `pl-` | ~80 | `pl-0` to `pl-96`, `pl-auto`, `pl-1/2`, `pl-px` |
| `pr-` | ~80 | `pr-0` to `pr-96`, `pr-auto`, `pr-1/2`, `pr-px` |
| `px-` | ~80 | `px-0` to `px-96`, `px-auto`, `px-1/2`, `px-px` |
| `py-` | ~80 | `py-0` to `py-96`, `py-auto`, `py-1/2`, `py-px` |
| `gap-` | ~60 | `gap-0` to `gap-96`, `gap-px`, fractions |
| `padding-*` | ~155 | `padding-top-*`, `padding-bottom-*`, etc. |

### Positioning

| Prefix | Count | Examples |
| --- | --- | --- |
| `top-` | ~60 | `top-0` to `top-96`, `top-auto`, `top-1/2`, `top-px` |
| `right-` | ~60 | `right-0` to `right-96`, `right-auto`, `right-1/2`, `right-px` |
| `bottom-` | ~60 | `bottom-0` to `bottom-96`, `bottom-auto`, `bottom-1/2`, `bottom-px` |
| `left-` | ~60 | `left-0` to `left-96`, `left-auto`, `left-1/2`, `left-px` |
| `inset-*` | ~20 | `inset-*` (all sides) |
| `position-*` | ~5 | Various position utilities |

### Colors (Background)

| Prefix | Count | Examples |
| --- | --- | --- |
| `bg-` | **1,688** | `bg-white`, `bg-gray-*` (50-950), all 22 Tailwind colors. Each color has 11 shades: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950. Plus: `bg-black`, `bg-white`, `bg-transparent` |
| `active-tint-*` | ~24 | `active-tint-*` (all colors) |
| `selected-bg-*` | ~264 | `selected-bg-*` (selected state backgrounds) |
| `badge-bg-*` | ~264 | `badge-bg-*` (badge backgrounds) |
| `title-bg-*` | ~264 | `title-bg-*` (title backgrounds) |
| `tabs-bg-*` | ~264 | `tabs-bg-*` (tab backgrounds) |
| `keyboard-toolbar-*` | ~285 | `keyboard-toolbar-*` colors + heights |
| `thumb-*` | ~264 | `thumb-*` colors (sliders) |
| `track-*` | ~264 | `track-*` colors (sliders) |
| `status-bar-bg-*` | ~264 | `status-bar-bg-*` (status bar) |
| `nav-*` | ~492 | `nav-bg-*`, `nav-tint-*` (navigation) |
| `tint-*` | ~490 | `tint-*` colors (UI tinting) |
| `placeholder-*` | ~245 | `placeholder-*` colors |
| `hint-*` | ~247 | `hint-*` colors |
| `subtitle-*` | ~490 | `subtitle-*` colors |
| `bar-*` | ~245 | `bar-bg-*`, `bar-color-*` |
| `separator-*` | ~278 | `separator-*` colors |
| `indicator-*` | ~245 | `indicator-*` colors |
| `disabled-*` | ~245 | `disabled-*` colors (disabled state) |
| `highlighted-*` | ~245 | `highlighted-*` colors |

### Colors (Text & Foreground)

| Prefix | Count | Examples |
| --- | --- | --- |
| `text-` | **273** | `text-white`, `text-gray-*` (50-950), `text-center/left/right`. Text sizes: `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl` |
| `title-*` | **1,019** | `title-*`, `title-attributes-*`, `title-color-*` |
| `selected-*` | **1,471** | `selected-*`, `selected-bg-*`, `selected-color-*` |
| `badge-*` | **735** | `badge-*`, `badge-bg-*`, `badge-color-*` |
| `colors-*` | ~245 | `colors-*` (picker colors) |
| `color-*` | ~245 | `color-*` variants |

### Borders & Radius

| Prefix | Count | Examples |
| --- | --- | --- |
| `border-` | **303** | `border-0`, `border-(1)`, `border-gray-*` colors. `border-t-*`, `border-r-*`, `border-b-*`, `border-l-*` |
| `rounded-*` | **455** | `rounded-none`, `rounded-sm`, `rounded-lg`. `rounded-full-*` (with size: `rounded-full-12`). `rounded-t-*`, `rounded-r-*`, `rounded-b-*`, `rounded-l-*` |

### Typography

| Prefix | Count | Examples |
| --- | --- | --- |
| `text-*` | 273 | Text colors, sizes, alignment |
| `font-*` | 12 | Weights: `font-thin`, `font-light`, `font-normal`, `font-medium`, `font-semibold`, `font-bold`, `font-extrabold`, `font-black`. Families (v7.5.3+): `font-sans`, `font-serif`, `font-mono` |
| `line-h-multiple-*` | ~85 | Line height as multiple |
| `line-spacing-*` | ~85 | Line spacing |
| `line-break-mode-*` | 7 | `line-break-mode-attribute-by-word-wrapping`, etc. |
| `letter-spacing-*` | ~85 | Letter spacing values |
| `paragraph-spacing-*` | ~120 | Paragraph spacing |
| `ellipsize-*` | ~18 | `ellipsize-*` (text truncation) |

### Accessibility

| Prefix | Count | Examples |
| --- | --- | --- |
| `accessibility-*` | 7 | `accessibility-enabled`, `accessibility-enabled-false`, `accessibility-hidden`, `accessibility-hidden-false`, `accessibility-disable-long-press`, `accessibility-disable-long-press-false` |

### Input & Keyboard

| Prefix | Count | Examples |
| --- | --- | --- |
| `keyboard-*` | **297** | `keyboard-type-*`, `keyboard-appearance-*` |
| `keyboard-type-*` | 11 | `email`, `number-pad`, `phone-pad`, `url`, `decimal-pad`, `twitter`, `websearch`, `ascii`, `namephone-pad`, `numbers-punctuation` |
| `return-key-type-*` | 12 | `next`, `done`, `go`, `search`, `send`, `continue`, `route`, `join`, `yahoo`, `google`, `emergency-call`, `returnkey` |
| `keyboard-appearance-*` | 3 | `keyboard-appearance`, `dark`, `light` |
| `keyboard-toolbar-*` | ~285 | `keyboard-toolbar-*` (colors, heights) |
| `keyboard-visible-*` | 2 | `keyboard-visible`, `keyboard-visible-false` |
| `autocapitalization-*` | 4 | `autocapitalization-text-all`, `text-none`, `text-sentences`, `text-words` |
| `autocorrect` | 2 | `autocorrect`, `autocorrect-false` |
| `autofill-*` | 32 | `autofill-*` variants |

### Boolean & State Classes

| Property | Classes | Pattern |
| --- | --- | --- |
| `editable` | `editable`, `editable-false` | Boolean |
| `enabled` | `enabled`, `enabled-false` | Boolean |
| `visible` | `visible`, `visible-false`, `hidden` | Boolean |
| `selectable` | `selectable`, `selectable-false` | Boolean |
| `scrolling` | `scrolling-enabled`, `scrolling-enabled-false` | Boolean |
| `scrollable` | `scrollable` | Boolean |
| `zoom` | `zoom-enabled`, `zoom-enabled-false` | Boolean |
| `touch` | `touch-enabled`, `touch-enabled-false` | Boolean |
| `clip` | `clip-enabled`, `clip-enabled-false` | Boolean (iOS) |
| `interactive-dismiss` | `interactive-dismiss-mode-enabled`, `*-false` | Boolean (iOS) |
| `large-title` | `large-title-enabled`, `large-title-enabled-false` | Boolean (iOS). Must pair with `extend-edges-all` and `auto-adjust-scroll-view-insets` when using ScrollView — full pattern, global-defaults recipe, TabGroup behavior, and the `content-w-screen` / `content-h-auto` ScrollView pairing live in [`ios-large-titles.md`](ios-large-titles.md). |
| `overlay` | `overlay-enabled`, `overlay-enabled-false` | Boolean (iOS) |
| `toolbar` | `toolbar-enabled`, `toolbar-enabled-false` | Boolean |
| `submit` | `submit-enabled`, `submit-enabled-false` | Boolean |
| `active` | `active`, `active-false` | Boolean |
| `animated` | `animated` | Boolean |
| `focusable` | `focusable` | Boolean |
| `hidden` | `hidden` | Boolean (alias for `visible-false`) |
| `hires` | `hires` | Boolean |
| `modal` | `modal` | Boolean |
| `persistent` | `persistent` | Boolean |
| `running` | `running` | Boolean |
| `translucent` | `translucent` | Boolean |
| `transparent` | `transparent` | Boolean |

### Text Transformation

| Class | Property | Value |
| --- | --- | --- |
| `uppercase` | autocapitalization | TEXT_AUTOCAPITALIZATION_ALL |
| `capitalize` | autocapitalization | TEXT_AUTOCAPITALIZATION_WORDS |
| `sentences` | autocapitalization | TEXT_AUTOCAPITALIZATION_SENTENCES |
| `normal-case` | autocapitalization | TEXT_AUTOCAPITALIZATION_NONE |

### Opacity

| Pattern | Examples |
| --- | --- |
| `opacity-*` | `opacity-0`, `opacity-5`, `opacity-10` ... `opacity-100` (23 classes). Also: `opacity-to-0`, `opacity-to-100` |

### Transformation & Animation

| Prefix | Count | Examples |
| --- | --- | --- |
| `rotate-*` | 14 | `rotate-0`, `rotate-1`, `rotate-2`, `rotate-3`, `rotate-6`, `rotate-12`, `rotate-45`, `rotate-90`, `rotate-135`, `rotate-180`, `rotate-225`, `rotate-270`, `rotate-315`, `rotate-360` |
| `scale-*` | 15 | `scale-0`, `scale-5` to `scale-200` |
| `scale-x-*` | 15 | `scale-x-0`, `scale-x-5` to `scale-x-200` |
| `scale-y-*` | 15 | `scale-y-0`, `scale-y-5` to `scale-y-200` |
| `origin-*` | ~9 | `origin-center`, `origin-top-left`, etc. |
| `duration-*` | 22 | `duration-0`, `duration-50` to `duration-5000` |
| `delay-*` | 22 | `delay-0`, `delay-50` to `delay-5000` |
| `repeat-*` | ~31 | `repeat-*` variants |
| `snap-*` runtime behavior (v7.4.0+) | 4 | `snap-back`, `snap-back-false`, `snap-center`, `snap-center-false` — implemented drop behaviors. Generated inventories may still contain `snap-magnet*`, but the runtime does not consume them |
| `keep-z-index` (v7.4.0+) | 2 | `keep-z-index`, `keep-z-index-false` — prevents touch-start promotion; it does not stop `draggable(array)` from assigning index-based z-order |

### Shadows & Elevation

| Prefix | Count | Examples |
| --- | --- | --- |
| `shadow-*` | **285** | `shadow-none`, `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl`, `shadow-xs`, `shadow-inner`, `shadow-outline`. `shadow-*` (all colors), `shadow-radius-*` |
| `elevation-*` | 29 | `elevation-0` to `elevation-96` (Android only). `elevation-px` |

### Z-Index & Overflow

| Prefix | Count | Examples |
| --- | --- | --- |
| `z-index-*` | 6 | `z-index-0` to `z-index-50` |
| `overflow-*` | 6 | `overflow-hidden`, `overflow-scroll`, `overflow-x-hidden`, `overflow-x-scroll`, `overflow-y-hidden`, `overflow-y-scroll` |

### Status Bar & Navigation

| Prefix | Count | Examples |
| --- | --- | --- |
| `status-bar-*` | **563** | `status-bar-*`, `status-bar-bg-*` (all colors) |
| `tabs-*` | **492** | `tabs-bg-*`, `tabs-tint-*` |
| `nav-*` | **492** | `nav-bg-*`, `nav-tint-*` |

### UI Component States

| Prefix | Count | Examples |
| --- | --- | --- |
| `selected-*` | **1,471** | `selected-*`, `selected-bg-*`, `selected-color-*` (all colors) |
| `badge-*` | **735** | `badge-*`, `badge-bg-*`, `badge-color-*` |
| `title-*` | **1,019** | `title-*`, `title-attributes-*`, `title-bg-*` |
| `disabled-*` | **245** | `disabled-*`, `disabled-bg-*`, `disabled-color-*` |
| `highlighted-*` | **245** | `highlighted-*` colors |
| `pull-*` | **245** | `pull-*` (pull-to-refresh colors) |
| `results-*` | **492** | `results-*` (search results styling) |
| `on-*` | **490** | `on-*` (switch/toggle "on" state) |

### Display & Sizing

| Prefix | Count | Examples |
| --- | --- | --- |
| `display-*` | ~5 | `display-*` variants |
| `size-*` | ~60 | `size-*` (component sizing) |
| `min-*` | ~73 | `minimum-*`, `min-*` (minimum sizes) |
| `max-*` | ~91 | `maximum-*`, `max-*` (maximum sizes) |

### Media & Video

| Prefix | Count | Examples |
| --- | --- | --- |
| `media-*` | ~23 | `media-*` (media control styling) |
| `video-*` | ~5 | `video-*` properties |
| `audio-*` | ~15 | `audio-*` properties |
| `picture-*` | ~5 | `picture-*` properties |

### Other Special Prefixes

| Prefix | Count | Usage |
| --- | --- | --- |
| `allows-*` | ~14 | `allows-*`, `allows-*-*-false` (permissions) |
| `can-*` | ~14 | `can-*` (capability queries) |
| `has-*` | ~12 | `has-*` (state queries) |
| `is-*` | ~26 | `is-*` (state queries) |
| `no-*` | ~10 | `no-*` (negations) |
| `show-*` | ~30 | `show-*`, `shows-*` (visibility control) |
| `hide-*` | ~10 | `hide-*`, `hides-*` (visibility control) |
| `cache-*` | ~15 | `cache-*` (caching behavior) |
| `autohide` | 2 | `autohide`, `autohide-false` |
| `autoplay` | 2 | `autoplay`, `autoplay-false` |
| `autoreverse` | 2 | `autoreverse`, `autoreverse-false` |
| `timeout-*` | ~22 | `timeout-*` (timeout values) |
| `from-*` | ~245 | `from-*` (gradient/animation from states) |
| `to-*` | ~245 | `to-*` (gradient/animation to states) |
| `ease-*` | ~5 | `ease-*` (easing functions) |
| `curve-*` | ~5 | `curve-*` (animation curves) |
| `mode-*` | ~31 | `mode-*` (display/interaction modes) |
| `state-*` | ~16 | `state-*` (UI states) |
| `style-*` | ~14 | `style-*` (style variants) |
| `login-*` | ~26 | `login-*` (login-related) |
| `section-*` | ~31 | `section-*` (list sections) |
| `indention-*` | ~31 | `indention-*` (text indention) |
| `target-*` | ~120 | `target-*` (action targets) |
| `view-*` | ~245 | `view-*` (view properties) |
| `scroll-*` | ~20 | `scroll-*` (scroll behavior) |
