# folkmerdesign.com · Design system

Atomic structure: **tokens → atoms → molecules → organisms → pages**.
Tokens live in `src/styles/global.css` (`:root`). Components live in `src/components/`.
Rule: no raw hex, no raw font sizes in components. Use the tokens below.

---

## 1. Tokens

### Colour
| Token | Value | Use |
|---|---|---|
| `--bg` | #fcfcfa | Page background |
| `--surface` | #f4f6f5 | Cards (Accessibility, Insurance, What I bring) |
| `--surface-2` | #e9efec | Secondary surfaces, hover fills |
| `--line` | #d9d9d9 | Dividers, outlines, timeline line |
| `--ink` | #2a2f2d | Main text |
| `--ink-2` | #5c615f | Secondary text, tags (≥ 4.5:1 on bg) |
| `--ink-faint` | #b4bab7 | Placeholders, ghost captions (decorative only) |
| `--sage` | #748d7a | Large numbers, graphics |
| `--sage-text` | #5e7663 | Eyebrows, small green text (4.8:1) |
| `--sage-deep` | #405e47 | Favicon, highlighted cards (Aon "Today") |
| `--orange` | #ff5c33 | Graphics, accents on dark |
| `--orange-text` | #d4380f | Orange text on light (4.8:1) |
| `--mint` | #aee7ca | "Available" dot only |
| `--dark` | #1b201e | Profile pill, tooltip |
| `--btn` / `--btn-hover` | #373b3a / #09110d | Primary button |
| `--btn2` / `--btn2-hover` | #e9efec / #d0d9d2 | Secondary button |
| `--night` | #121614 | Footer, dark cards |
| `--night-line` / `--night-edge` | #2c3330 / #3a423e | Lines and borders on dark |
| `--night-muted` / `--night-soft` | #9aa29e / #c4cac7 | Secondary text on dark |
| `--on-night` | #f4f6f5 | Text on dark |
| `--paper` | #fbf8f0 | Paper notes (My setup) |
| `--dot` | #cfd5d2 | Whiteboard grid |
| `--focus` | #115aba | Focus ring, everywhere |

### Type scale (Satoshi; Caveat only for handwritten accents)
Fluid: mobile value at 375px, desktop value at 1440px, smooth in between.

| Token | Mobile | Desktop | Use |
|---|---|---|---|
| `--fs-display` | 56 | 120 | Big numbers (85%) |
| `--fs-h1` | 36 | 48 | Page title (one per page) |
| `--fs-h2` | 28 | 36 | Section / story titles |
| `--fs-h3` | 22 | 28 | Card titles |
| `--fs-h4` | 18 | 22 | Small titles, timeline steps |
| `--fs-lead` | 17 | 20 | Intro paragraphs |
| `--fs-body` | 16 | 18 | Body text, buttons |
| `--fs-small` | 14 | 16 | Secondary text, small buttons |
| `--fs-caption` | 13 | 14 | Tags, labels, captions |
| `--fs-meta` | 12 | 12 | Legal, kbd, meta only |

Weights: 400 body · 500 headings and labels · 600 max (emphasis). Line-height: 1.1–1.25 headings, 1.5–1.6 body.

### Spacing (8pt grid, 4pt for micro gaps)
4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128. Sections: `clamp(72px, 12vw, 200px)`.

### Radius
| Token | Value | Use |
|---|---|---|
| `--radius-pill` | 100px | Buttons, chips, bars |
| `--radius-card` | 56px (32px mobile) | Big story cards, project cards |
| `--radius-xl` | 32px | Lab cards, whiteboard, media inside big cards |
| `--radius-l` | 24px | Inner media, small cards, dock |
| `--radius-m` | 12px | Thumbnails, focus rings on tiles, toolbars |
| `--radius-s` | 8px | Tags, small chips, tools |

Device mockups (phone, MacBook) keep their own physical radius. No raw px radius in components.

### Motion
100 / 150 / 200 / 300 ms. Ease-out on enter. Transform and opacity only. Every loop can be paused (header Pause button) and respects `prefers-reduced-motion`.

---

## 2. Atoms
| Atom | Where | Notes |
|---|---|---|
| **Icon** | `Icon.astro` | Heroicons v2 outline only |
| **Button "roll"** | `.roll` in global.css | Pill + white ball that rolls in from the right (anticlockwise). Sizes: 56 / 44 desktop, 48 / 40 mobile. Primary dark, `--ghost` light, `--small` |
| **Tag line** | `.tags` | Italic, `--ink-2`, separator ` · ` |
| **Eyebrow** | `.eyebrow` | Uppercase, `--sage-text` |
| **Chip** | `.ale-card__facts span` | Pill on dark gradient |
| **Status dot** | Header | 7px + ripple |
| **Round icon button** | Carousel arrows, Pause, Alé card ball | 44–56px circle, white or `--btn2` |

## 3. Molecules
Profile pill (Header) · Project card (`ProjectCard`) · Lab card (`LabCarousel`) · Story card (Insurance, Accessibility, Alé in `index.astro`) · Paper note (`MySetup`) · Polaroid stack (About) · Testimonial bubble (hero).

## 4. Organisms
Header (pill, Download CV, Pause) · Footer "Let's connect" (step form) · Lab carousel (arc, swipe) · Whiteboard (`Whiteboard.astro` + `worker/`) · My setup (MacBook mockup) · Case intro (`CaseIntro`).

## 5. Pages
Home (stories: End-to-end, Accessibility, Alé, Lab, wall) · About · Alé · Work: Aon, Accessibility · Lab: agents, accessible PDF.

## Checks before publishing
WCAG 2.2 AA (axe: 0 violations) · text never below `--fs-meta` · tap targets ≥ 44px · no hover states on non-interactive elements · no em dash in copy.
