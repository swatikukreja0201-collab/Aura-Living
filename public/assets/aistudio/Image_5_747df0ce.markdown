---
name: AURA Living
colors:
  surface: '#fcf9f2'
  surface-dim: '#dcdad3'
  surface-bright: '#fcf9f2'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ec'
  surface-container: '#f1eee7'
  surface-container-high: '#ebe8e1'
  surface-container-highest: '#e5e2db'
  on-surface: '#1c1c18'
  on-surface-variant: '#4a4640'
  inverse-surface: '#31312c'
  inverse-on-surface: '#f3f0e9'
  outline: '#7b766f'
  outline-variant: '#ccc6bd'
  surface-tint: '#605e5c'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1a'
  on-primary-container: '#868382'
  inverse-primary: '#cac6c4'
  secondary: '#8d4e34'
  on-secondary: '#ffffff'
  secondary-container: '#ffad8e'
  on-secondary-container: '#7a3e26'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#2b1700'
  on-tertiary-container: '#9f7e59'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e6e2df'
  primary-fixed-dim: '#cac6c4'
  on-primary-fixed: '#1c1b1a'
  on-primary-fixed-variant: '#484645'
  secondary-fixed: '#ffdbce'
  secondary-fixed-dim: '#ffb599'
  on-secondary-fixed: '#370e00'
  on-secondary-fixed-variant: '#70371f'
  tertiary-fixed: '#ffddb9'
  tertiary-fixed-dim: '#e6c097'
  on-tertiary-fixed: '#2b1700'
  on-tertiary-fixed-variant: '#5c4222'
  background: '#fcf9f2'
  on-background: '#1c1c18'
  surface-variant: '#e5e2db'
typography:
  headline-xl:
    fontFamily: Noto Serif
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Noto Serif
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Noto Serif
    fontSize: 36px
    fontWeight: '400'
    lineHeight: 44px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Noto Serif
    fontSize: 26px
    fontWeight: '400'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Noto Serif
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 32px
    letterSpacing: 0em
  headline-sm:
    fontFamily: Noto Serif
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: 0em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.04em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.06em
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.12em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 4rem
  margin-tablet: 2rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.75rem
  space-xl: 3rem
---

## Brand & Style

This design system embodies Scandinavian-inspired architectural minimalism tailored for a discerning luxury retail audience. It serves intentional consumers seeking curated homeware, organic textures, and artisanal living objects. The aesthetic pairs restraint with quiet indulgence—evoking tranquility, unhurried deliberation, and tactile warmth.

The visual direction draws from high-end gallery catalogues and architectural monographs. It balances expansive, breathing white space against grounded mineral neutrals, razor-thin structural micro-borders, and disciplined editorial typography. Interactivity is restrained and deliberate, prioritizing subtle spatial transitions over flashy ornamentation.

## Colors

The palette derives from raw mineral pigments and unbleached fiber:

- **Primary (`#1C1B1A`)**: Deep Charcoal Carbon. Used for primary typography, authoritative CTAs, active states, and structural framing.
- **Secondary (`#C47B5E`)**: Faded Terracotta. Applied sparingly for editorial highlights, cart accents, promotional badges, and subtle hover cues.
- **Tertiary (`#D4AF87`)**: Champagne Linen. Acts as an opulent metallic/warm accent for decorative rules, seasonal capsules, and soft interactive states.
- **Neutral (`#F4F1EA`)**: Warm Alabaster/Ecru. Serves as the canvas base, providing natural warmth that avoids sterile cold whites.

### Surface Tiers
- **Canvas Base**: `#F4F1EA` (Warm Ecru)
- **Surface Elevated (Cards / Drawers)**: `#FAF8F5` (Soft Chalk)
- **Surface Recessed / Backdrop**: `#ECE7DE` (Raw Stone)
- **Dividers & Hairlines**: `rgba(28, 27, 26, 0.08)` to `rgba(28, 27, 26, 0.12)`

## Typography

The type system blends the classical elegance of `Noto Serif` with the modern, geometric clarity of `Plus Jakarta Sans`.

- **Headings (`Noto Serif`)**: Reserved for narrative storytelling, section headers, product titles, and hero statements. It imparts an editorial rhythm akin to architectural journals.
- **Body & Functional UI (`Plus Jakarta Sans`)**: Neutral, highly legible at small sizes, handling dense product specifications, pricing, navigation, and transactional workflows.
- **Labels & Microcopy**: Use `label-caps` in uppercase styling with extended letter spacing (`0.12em`) for categories, SKU markers, filters, and status flags.

## Layout & Spacing

The layout employs an asymmetric, fluid 12-column grid designed for airy compositions and balanced breathing room.

- **Desktop (>= 1200px)**: 12 columns, `4rem` outer margin, `1.5rem` gutter. Product grids prefer a spacious 3 or 4-column distribution with offset focal items.
- **Tablet (768px – 1199px)**: 8 columns, `2rem` outer margin, `1.25rem` gutter.
- **Mobile (< 768px)**: 4 columns or single-column stacked layout, `1.25rem` margin, `1rem` gutter.

Generous vertical rhythm is standard: sections should be spaced using multipliers of `space-xl` (typically 4.5rem to 7rem between primary merchandising rows) to prevent visual crowding.

## Elevation & Depth

This design system avoids heavy drop shadows and synthetic floating effects. Depth is achieved via tonal contrast and crisp, tactile micro-borders:

- **Flat Architectural Baseline**: Resting surfaces lie flat on the `#F4F1EA` canvas, distinguished solely by hairline borders (`1px solid rgba(28, 27, 26, 0.08)`).
- **Elevated Interactive Tier**: Product cards, slide-over bags, and floating menus use `#FAF8F5` with a sheer, warm-tinted contact shadow: `0 8px 30px -4px rgba(28, 27, 26, 0.05)`.
- **Modal & Backdrop Overlays**: Overlay sheets use `#1C1B1A` at 35% opacity with an ultra-subtle backdrop blur (`4px`), retaining the sensory impression of the scene behind.

## Shapes

The design system enforces architectural softness (`roundedness: 1`):

- **Standard Elements (Inputs, Buttons, Badges)**: Soft `0.25rem` (4px) corner radius. This avoids brutalist harshness while retaining a disciplined, tailored corner.
- **Cards & Modals (`rounded-lg`)**: `0.5rem` (8px), producing gentle definition against the canvas.
- **Media Containers**: Strictly rectilinear or `0.25rem` to honor raw photographic edges and crafted textures.

## Components

### Buttons
- **Primary**: Solid Charcoal (`#1C1B1A`) with ecru text (`#F4F1EA`), 48px height, 4px radius, padded with `1.5rem` horizontally. Smooth background transition to `#C47B5E` (Terracotta) on hover.
- **Secondary / Outlined**: 1px border (`rgba(28, 27, 26, 0.3)`), transparent background, charcoal text. Hover transitions to `#1C1B1A` fill with ecru text.
- **Tertiary / Text**: Understated link with a persistent 1px hairline underline offset by 4px; underline expands on hover.

### Product Cards
- Contained within `#FAF8F5` surface or bordered by 1px subtle hairline.
- Aspect ratio of 4:5 or 1:1 for product imagery with natural limestone/linen backgrounds.
- Minimal overlay interaction: quick-add button reveals on hover as an understated slide-up bar or corner icon.
- Typographic hierarchy: Category in `label-caps`, Title in `headline-sm`, Price in `body-md` bold.

### Input Fields & Selectors
- Background: `#FAF8F5` or transparent with a crisp bottom rule or full 1px border (`rgba(28, 27, 26, 0.15)`).
- Height: 46px, 4px border radius.
- Active / Focus: Border transitions to `#1C1B1A` with zero ring glow; clean and architectural.

### Chips & Filters
- Compact pill-like or soft rectangular containers (4px radius) with 1px border.
- Selected state: Inverted to `#1C1B1A` fill with `#F4F1EA` text.
- Hover state: Subtle background tint (`rgba(28, 27, 26, 0.04)`).

### Checkboxes & Radios
- Size: 18x18px.
- Unchecked: 1px border in `rgba(28, 27, 26, 0.3)`.
- Checked: Fill `#1C1B1A` with a clean white tick mark or centered inset dot.

### Curated Editorial Modules
- Split banner cards featuring full-bleed contextual lifestyle photography on one half, paired with generous whitespace, `headline-lg` serif narrative, and a single quiet CTA on the other.