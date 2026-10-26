# DESIGN.md — Tech Ignite '26 Design System

> Source of truth: `src/styles/globals.css` (`@theme` tokens). This document
> describes the CSS in human/agent language; the CSS is canonical. Any
> component or section must be derivable from the tokens and rules here.
> Palettes are sampled from the event art direction: off-black canvas, paper
> sections, a cream hero arch, and Google-brand blue / green / amber accents.

## 1. Visual Theme & Atmosphere

A bold, playful tech-festival identity sitting on an **off-black canvas**
(`--color-ink #050505`). Sections alternate between the dark canvas and clean
**paper** (`#ffffff`) surfaces, punctuated by a giant **cream dome arch**
(`#ffe08a` with a topographic contour texture) and scattered patches of Google
blue — the "checker mosaic" behind the hero.

- Density: airy, poster-like (3/10) — big type, generous whitespace
- Variance: playful asymmetric (7/10) — checkered mosaics, domed arches,
  oversized bracket lockups, not uniform grids
- Motion: fluid and restrained (5/10) — smooth scroll, hover transitions,
  reduced-motion respected

Signature motifs (reuse, don't reinvent):

- **Cream arch** — dome top, flat bottom edge-to-edge of the section, filled
  with a **flat** `#FEEBB4` (`bg-accent`) — no texture, grid, contour lines,
  or background image inside it. Desktop geometry: `1124 × 705px`, top offset
  `167px` from the page top, `500px` top-left/top-right radius (flat bottom)
- **Checker mosaic** — rectangles of `brand-blue`, `brand-blue-soft` and
  `brand-blue-pale` scattered on the ink canvas behind arches/sections
- **Bracket lockup** — the `{TECH IGNITE '26}` artwork (`/icons/hero.svg`);
  brackets carry the Google four-color stripe (red/green/amber/blue)

## 2. Color Palette & Roles

Neutrals:

- **Ink / Off-black canvas** (`--color-ink #050505`) — page background, dark
  sections; never pure `#000000`
- **Ink Raised** (`--color-ink-raised #171717`) — cards/surfaces on dark
- **Ink Soft** (`--color-ink-soft #202020`) — elevated surfaces on dark
- **Paper** (`--color-paper #ffffff`) — light sections, text on ink,
  light-mode buttons
- **Mist** (`--color-mist #f2f4f7`) — hover tint on light buttons/surfaces
- **Line on Dark** (`--color-line #2a2a2a`) — borders/dividers on ink
- **Line Light** (`--color-line-light #e4e7ec`) — borders/dividers on paper
- **Muted text** (`--color-muted #a3a3a3`, `--color-muted-dark #525252`) —
  secondary text on dark / light respectively

Brand & accents (Google-derived, used sparingly — one accent per component):

- **Brand Blue** (`--color-brand-blue #3d7cf6`) — primary CTA fill, selection
  highlight, focus ring
- **Brand Blue Strong** (`--color-brand-blue-strong #2f63d4`) — CTA hover only
- **Brand Blue Soft** (`--color-brand-blue-soft #8db2ff`) — hover text on dark
- **Brand Blue Pale** (`--color-brand-blue-pale #d7e4ff`) — mosaic patches,
  decorative fills
- **Brand Green** (`--color-brand-green #0a7a3c`) / **Green Bright**
  (`--color-brand-green-bright #22c55e`) — success states, lockup colors
- **Brand Amber** (`--color-brand-amber #ffb020`) — decorative lockup color
- **Brand Cream** (`--color-brand-cream #feebb4`) — hero arch fill, accent on
  ink
- **Brand Red** (`--color-brand-red #e1493c`) — decorative lockup color only
  (never for errors; errors use it only if no better semantic exists)

Semantic aliases (use these in components, not raw brand colors):
`background`, `foreground`, `surface`, `surface-raised`, `muted`/`muted-dark`,
`border`, `border-light`, `primary` (+ `primary-foreground`),
`accent` (+ `accent-foreground`), `ring`.

## 3. Typography

Two type families, both Google-native:

- **Google Sans Variable** (`@fontsource-variable/google-sans`) — body, UI,
  and all headings (`--font-sans`, `--font-display`)
- **Product Sans** (self-hosted TTFs in `public/custom-font/product-sans/`) —
  brand/display utility `font-product-sans` for the wordmark and poster-scale
  lockup text (400 / 700)

Scale (all `clamp()`-fluid, defined in `@theme`):

| Token             | Size                             | Line height      | Tracking     |
| ----------------- | -------------------------------- | ---------------- | ------------ |
| `text-display`    | `clamp(3.5rem, 9vw, 8rem)`       | 0.9              | `-0.05em`    |
| `text-heading`    | `clamp(2.35rem, 4.6vw, 4.25rem)` | 1.02             | `-0.035em`   |
| `text-subheading` | `clamp(1.5rem, 2.4vw, 2rem)`     | 1.15             | —            |
| `text-tagline`    | `1.75rem` (28px)                 | 1.5625rem (25px) | `0`          |
| `text-stat`       | `clamp(3.5rem, 7vw, 6.5rem)`     | 0.9              | `-0.04em`    |
| `text-label`      | `1rem` (16px)                    | 1.199375rem      | `-0.02em`    |
| `text-button`     | `1rem` (16px)                    | 1.05rem          | `0.03125rem` |
| `text-eyebrow`    | `0.875rem` (14px)                | 1.25rem          | `0.1em`      |

Rules:

- Hierarchy through size, weight (500/700), and color — not shouting
- Hero poster type is uppercase, track-tight, `leading-[0.9]`
- Body copy: relaxed leading, ≥ 1rem, max ~65ch
- **Hero tagline** — “Are you actually Building?” uses `text-tagline`
  (Google Sans 400; 28px / 25px, 0 tracking), centered.
- **UI labels** — nav links, badges, and table headers — use `text-label`
  (Google Sans 400; 16px / 19.19px, -0.32px). **Button labels** use
  `text-button` (Google Sans 400; 16px / 16.8px, +0.5px). Nav text never
  scales up and is never bold: it stays at these values at every breakpoint,
  including the mobile menu.
- Banned: Inter, Roboto-as-identity, generic system fonts for headings;
  serif fonts anywhere on this site

## 4. Component Stylings

- **Buttons — primary:** flat Brand-Blue fill (`bg-brand-blue` `#3d7cf6`),
  white label in `text-button` (16px / 16.8px, +0.5px, weight 400),
  `rounded-xs` (2px, NOT pill), height 44px (`h-11`), compact x-padding,
  clear arrow-icon slot, hover to `brand-blue-strong` (color only).
  **Minimal by default:** `shadow-none`, no elevation, no glow, no gradient,
  no outline unless focused
- **Buttons — light:** `bg-paper` fill, `text-ink`, `text-button`, hover to
  `mist`; same flat, shadowless treatment
- **Nav chrome:** header links use `text-label` and both nav actions use
  `text-button` at every breakpoint; the header never uses heading/body
  sizes and never bolds labels
- **Cards/surfaces:** radius `--radius-card` (1rem) / panels `.5rem+`
  (`--radius-panel` 1.5rem) / pills `--radius-pill`; borders use
  `border`/`border-light`; tint any shadow toward the surface hue; no neon
  outer glows
- **Inputs:** label above input, helper below, focus `ring` in Brand Blue;
  no floating labels
- **Loaders:** skeletal, layout-shaped; no circular spinners
- **Empty/error states:** composed and specific, inline error text
- **Links on ink:** `text-white/90`, hover to `brand-blue-soft`
- **Selection:** blue fill, white text (`::selection`)

## 5. Layout Principles

- Page container: `.container` — `max-width 1280px`, centered,
  `padding-inline: clamp(1.25rem, 5vw, 1.5rem)` (tight 20–24px gutters so the
  desktop nav lockup and actions sit near the reference edges)
- Full-height sections use `min-h-[100dvh]` (dvh, never `h-screen`);
  the hero reserves the `h-24` desktop nav (`min-h-[calc(100dvh-6rem)]`) and
  closes with a 6rem ink strip below the arch (`pb-24`), so the dome never
  runs into the next section
- Sections are edge-to-edge colored bands (ink / paper / arch) stacked
  vertically; content sits inside the container
- Grid-first responsive; no `calc()` percentage hacks beyond the fluid
  container clamp
- Desktop nav is a single row (`h-24`, `h-20` on mobile); below `lg` it
  collapses into a hamburger menu panel. The full composite lockup shows from
  `sm`; mobile uses the compact bracket lockup so actions never overflow
- All anchor targets are kebab-case IDs (`#speakers`, `#hackathon`,
  `#agenda`, `#sponsors`) with scroll offset (`scroll-margin-top: 5.5rem`)
  handled by the base layer
- Mobile: everything collapses to single column; no horizontal scroll;
  touch targets ≥ 44px

## 6. Motion & Interaction

- Smooth scrolling native (`scroll-behavior: smooth`), disabled under
  `prefers-reduced-motion`
- Hover/active transitions: color/transform only, hardware-friendly;
  default duration ~150–300ms (`tw-animate-css` is available for entrances)
- Staggered cascade reveals for lists; never mount large lists instantly
- Animate exclusively via `transform` and `opacity`
- Decorative loops (float/pulse) only on clearly decorative elements

## 7. Anti-Patterns (banned)

- Pure `#000000` black (use `--color-ink`)
- Neon/outer-glow buttons, gradient buttons, purple accents
- Inter or system fonts as headings; serif fonts
- Emoji in UI copy; AI clichés ("Elevate", "Seamless", "Unleash")
- Generic placeholder names ("John Doe", "Acme", "Nexus")
- 3-equal-column generic card rows — prefer asymmetric grids, zig-zag
  splits, or horizontal scroll galleries (with `.scrollbar-none`)
- Overlapping text/graphics; text over busy mosaic patches
- Circular spinners; animating `top/left/width/height`
- Reintroducing a JS Tailwind config or editing tokens anywhere but
  `src/styles/globals.css` `@theme`
- Jump links that aren't `<Link>` with `hash` props, or non-kebab-case IDs
