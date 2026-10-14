# folkmerdesign.com · Design system

Atomic structure: **tokens → atoms → molecules → organisms → pages**.
Tokens live in `src/styles/global.css` (`:root`). Components live in `src/components/`.

**The one rule:** every value in a component comes from a token. One token per job, one job per token.
If a value isn't here, don't invent it: add a token (and a line in this file) or ask Francesca.

---

## 1. Tokens

### Colour
| Token | Value | Use |
|---|---|---|
| `--bg` | #fcfcfa | Page background |
| `--white` | #fff | Pure white: inputs, white cards, text on orange or dark images |
| `--surface` | #f4f6f5 | Light cards |
| `--surface-2` | #e9efec | Secondary surfaces, ghost buttons, hover fills |
| `--line` | #d9d9d9 | Dividers, outlines |
| `--ink` | #2a2f2d | Main text |
| `--ink-2` | #5c615f | Secondary text, tags (≥ 4.5:1 on bg) |
| `--ink-faint` | #b4bab7 | Placeholders on light, decorative only |
| `--sage` | #748d7a | Large numbers, graphics, whiteboard green |
| `--sage-text` | #5e7663 | Eyebrows and small green text (4.8:1) |
| `--sage-deep` | #405e47 | Favicon, highlighted cards (Aon "Today") |
| `--orange` | #ff5c33 | Graphics and accents on dark, whiteboard orange |
| `--orange-text` | #d4380f | Orange text on light, bubbles with white text (4.8:1) |
| `--mint` | #aee7ca | "Available" dot and chips on dark only |
| `--btn` / `--btn-hover` | #373b3a / #09110d | Primary button |
| `--btn2-hover` | #d0d9d2 | Ghost button hover |
| `--night` | #121614 | Dark surfaces: footer, dialogs, profile pill, tooltips |
| `--night-line` / `--night-edge` | #2c3330 / #3a423e | Lines and borders on dark |
| `--night-muted` / `--night-soft` | #9aa29e / #c4cac7 | Secondary text on dark |
| `--night-faint` | #4f5753 | Placeholders on dark |
| `--on-night` | = `--surface` | Text on dark |
| `--paper` | #fbf8f0 | Paper notes (My setup) |
| `--dot` | #cfd5d2 | Whiteboard grid |
| `--focus` | #115aba | Focus ring, everywhere on light |

**Illustrations are the only exception.** Mock-ups of other products keep their own colours, declared as local custom properties at the top of the component: Alé brand (`--orange-ale`, `--beige-ale` in `AleTimeline`), the Sky / Aon covers (`Cover`), app icons (`MySetup`), objects on the whiteboard, Figma-style notes (accessibility page), the Crédit Agricole teal cover. UI around them (text, buttons, borders) still uses tokens.

### Type (Satoshi; Caveat only for handwritten accents)
Fluid: mobile value at 375px, desktop value at 1440px.

| Token | Mobile | Desktop | Use |
|---|---|---|---|
| `--fs-display` | 56 | 120 | Big numbers |
| `--fs-h1` | 36 | 48 | Page title (one per page), footer question |
| `--fs-h2` | 28 | 36 | Section titles, request dialog |
| `--fs-h3` | 22 | 28 | Card titles |
| `--fs-h4` | 18 | 22 | Small titles |
| `--fs-lead` | 17 | 20 | Intro paragraphs |
| `--fs-body` | 16 | 18 | Body text, buttons |
| `--fs-small` | 14 | 16 | Secondary text, small buttons |
| `--fs-caption` | 13 | 14 | Tags, labels, captions |
| `--fs-meta` | 12 | 12 | The minimum. Legal, kbd, meta |

Weights: **400** body · **500** headings and labels · **600** emphasis (max). Line-height 1.1–1.25 headings, 1.5–1.6 body.
Caveat (handwriting) sizes use the same tokens (`--fs-h2`, `--fs-h3`), never px.

### Spacing (8pt grid, 4pt for micro gaps)
4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128.

| Token | Mobile → Desktop | Use |
|---|---|---|
| `--space-section` | 96 → 160 | Between blocks and sections, on every page. Always this, never a custom value |
| `--space-block` | 32 → 48 | From a block title to its content, small intro spacing |
| `--space-inset` | 24 → 64 | Padding inside big cards |
| `--gutter` | 16 → 200 | Page side margin |

### Radius
| Token | Value | Use |
|---|---|---|
| `--radius-pill` | 100px | Buttons, chips, bars |
| `--radius-card` | 56px (32px mobile) | Big story cards |
| `--radius-xl` | 32px | Lab cards, whiteboard, dialogs, media inside big cards |
| `--radius-l` | 24px | Inner media, small cards, dock |
| `--radius-m` | 12px | Thumbnails, focus rings on tiles, toolbars |
| `--radius-s` | 8px | Tags, small chips, tools, kbd |

Device mockups (iPhone, MacBook) keep their physical radius.

### Motion
| Token | Value | Use |
|---|---|---|
| `--dur-fast` | 200ms | Hover, colour, small feedback |
| `--dur-base` | 300ms | UI enter / exit, buttons, dialogs |
| `--dur-slow` | 600ms | Scroll reveals, page transitions, larger moves |
| `--dur-story` | 1s | Decorative storytelling only (hand-drawn line, flask, bubbles). Always pausable |
| `--ease-out` | cubic-bezier(.16, 1, .3, 1) | Default: things entering |
| `--ease-in-out` | cubic-bezier(.4, 0, .2, 1) | Things moving across, page slides |
| `--ease-spring` | cubic-bezier(.34, 1.56, .64, 1) | A small bounce on playful details (arrows, icons) |

Transform and opacity only. Every loop can be paused (header Pause button) and respects `prefers-reduced-motion`.
Exceptions: three hand-tuned curves in the flask easter egg and the "co-founder" handwriting (`index.astro`).

---

## 2. Atoms
| Atom | Where | Notes |
|---|---|---|
| **Icon** | `Icon.astro` | Heroicons v2 outline only. Exceptions: brand logos (`img/brands/`), whiteboard cursors, the mic-slash icon (not in Heroicons) |
| **Button "roll"** | `.roll` in global.css | The only button. Pill + ball that rolls in from the right. Variants: default (dark), `--ghost` (light), `--light` (on dark), `--send` (orange, final step), `--small`. Sizes 56 / 44 desktop, 48 / 40 mobile; 48 in forms |
| **Outline button** | `.btn-outline` | Secondary action on dark (Back in the forms) |
| **Text link button** | `.pc__ask`, `.gate__ask` | Underlined, for "Request access" |
| **Tag line** | `.tags` | Italic, `--ink-2`, separator ` · ` |
| **Eyebrow** | `.eyebrow` | Uppercase, `--sage-text` |
| **Step count** | Footer, request dialog | "1 of 5", plain text |
| **Status dot** | Header | 7px + ripple |
| **Round icon button** | Carousel arrows, Pause, close, Alé card ball | 44–56px circle |
| **Blank** | Footer, request dialog | Input that looks like a line to write on, grows with the text |

## 3. Molecules
Profile pill (Header) · Lab card (`LabCarousel`) · Story card (`.secret-case`, `.a11y`, `.ale-card` in `index.astro`; covers 520px max; accessibility card text-only with the CPACC stamp on its top right corner, tilted -12°) · Clients strip (`.brands`) · Paper note (`MySetup`) · Polaroid stack (About) · Testimonial bubble (hero) · iPhone mockup (`.phone-mock`, global) · Phone carousel (`PhoneCarousel.astro` + `src/lib/phones.js`: the only way to show a row of screens; in private cases use the same classes) · Lock gate (`ProtectedCase`, `CaseGate`).

## 4. Organisms
Header · Footer "Let's connect" (step form) · Request access dialog (`RequestAccess`, same pattern as the footer) · Lab carousel · Whiteboard (`Whiteboard.astro` + `worker/`) · My setup · Case intro (`CaseIntro`) · Alé timeline (`AleTimeline`).

## 5. Pages
Home · About · Alé · Work: Aon (private), Crédit Agricole (private), Accessibility · AI Lab: agents, accessible PDF · Privacy · 404.

## Checks before publishing
WCAG 2.2 AA (axe: 0 violations) · text never below `--fs-meta` · tap targets ≥ 24px (44px for main actions) · no hover states on non-interactive elements · no raw hex, px font sizes, radius or durations outside the exceptions above · copy follows `WRITING.md`.
