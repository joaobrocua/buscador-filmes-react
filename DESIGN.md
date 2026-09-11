# Design

<!-- impeccable:design-schema 1 -->

## World

**Cinephile Diary** — the site reads as a kept film journal, not a database front-end. Chosen via the impeccable direction round (seed `f03e8f71`, mode `persuade`): the dice assigned index 6 (Vídeo Locadora / VHS Rental Wall) from the ordered candidate list; the user pinned **IMPECCABLE'S PICK** instead (a user/brief pin always beats the roll). The full direction contract lives as an HTML comment, first child of `<body>`, in [index.html](index.html).

Everything about the prior "dark mode + gold accent movie app" look was discarded per explicit approval — nothing was preserved from it, product truth only (the search/browse/detail mechanism, TMDB attribution, GitHub Pages hosting).

## Palette — Committed, single accent

Warm cream paper ground with near-black ink and one committed wine-red accent. Chosen from the physical scene: a diary kept on a desk, read in daylight — not a screen-lit dark room.

| Token | Value | Role |
|---|---|---|
| `--paper` | `#f6f0e2` | Page ground |
| `--paper-raised` | `#efe6d2` | Cards, inputs, chips |
| `--paper-deep` | `#e4d8bd` | Poster placeholder / skeleton peak |
| `--line` | `#d3c39d` | Hairline dividers (decorative only) |
| `--ink` | `#241f19` | Primary text |
| `--ink-soft` | `#6b5d4a` | Secondary text (5.1–5.6:1 on paper) |
| `--wine` | `#8c2f3d` | Committed accent — active states, stars, stamps, links |
| `--wine-deep` | `#6e2230` | Hover/active accent, headings that need more weight |
| `--alert` | `#a3391f` | Real failure state only (network/API errors) — kept distinct from `--wine`'s informational use |

All text-on-background pairs verified ≥ 4.5:1 (ink on paper 14.4:1, ink-soft 5.1–5.6:1, wine 7.1:1, wine-deep 9.6:1).

## Type

- **Petrona** (400–800) — carries everything: display headings, body copy, UI labels. A serif with real character, chosen to avoid the training-data-default stack (no Inter/Fraunces/Playfair/Space Grotesk/etc.).
- **Caveat** (600) — a real, licensed handwriting face used in exactly two places: the header dateline and the modal's "registrado em …" line. It is the single deliberate "someone wrote this by hand" moment, not a UI typeface — never used for body copy, controls, or anything that needs to stay legible at small sizes under load.
- Tracking: −0.02em on display headings (within the −0.02 to −0.03em sweet spot, never past the −0.04em floor).

## Components

- **Header** — diary cover: mark (ink stamp / seal) + "Caderno de Cinema" in Petrona 800, dateline in Caveat below.
- **Type toggle** — ledger tabs (Filmes / Séries): flat, bottom-border indicator in wine on the active tab, no pill/slider.
- **Search** — catalog-slot field: paper-raised background, wine focus ring, clear button, spinner replaces the label while a search is in flight.
- **Media card** — a "pasted photograph": paper-raised mount, small radius (2–3px, earned by the photo/index-card motif rather than the general 12–16px app-tile default), soft single-declared shadow (no border), a small ink-pin glyph at the top edge, a literal 5-star rating row under the title (TMDB's 0–10 rounded to a 5-star scale). Hover lifts and tilts −0.6deg — a "picking the photo up" micro-interaction, off at rest so the grid stays aligned.
- **Star rating** (`StarRating.jsx`) — two overlaid icon rows (outline + wine-filled, clipped by percentage width) reused in the card and the modal at two sizes.
- **Modal** — an open diary spread: poster "page" on the left, entry text on the right, a vertical hairline + soft shadow at the gutter evoking a book's fold. Genre chips are ink-stamped tags (bordered, alternating micro-rotation via `nth-child`, no fill). ESC closes it, focus returns to the card that opened it, background scroll is locked.
- **Empty / error states** — same paper-card language; the API-key notice uses `--wine` (informational), a real fetch failure uses `--alert` (a distinct warm red) so the two are never visually confused.
- **Skeleton loading** — shimmer sweep across paper tones (`--paper-deep` → `--paper` → `--paper-deep`), same card shape as the real grid.

## Motion — one authored family, not scattered effects

- Card entrance: staggered fade + rise (35ms/card, capped at 10).
- Card hover: lift + tilt (−0.6deg), off at rest.
- Modal entrance: scale + rise + a −0.8deg → 0deg settle, evoking a page opening.
- Skeleton shimmer for the loading state.
- Everything collapses under `prefers-reduced-motion: reduce`.

## Browser surfaces

Selection, scrollbar (`scrollbar-color` + WebKit fallback), `:focus-visible` ring, and input caret are all themed from the palette (wine / paper / line) rather than left as browser defaults.

## States verified

Hover, focus-visible, active, disabled (search button while loading), loading (skeleton), empty, and two distinct error states — all present, all in the same visual language.

## Known gaps / honest risk

- The type toggle uses `role="tablist"`/`role="tab"` without roving-tabindex arrow-key navigation between tabs (carried over from the prior implementation, not introduced by this redesign; each tab is still independently focusable and operable).
- No image-generation tool was available in this environment, so this was a **code-led** build: no comp was rendered before building, and the ambition lives directly in the direction contract (`index.html`) and this file, audited here rather than against a locked mockup.
- This document and the finish check below were written in-thread by the same session that built the surface — the skill's shipped `impeccable-finish-reviewer` / `impeccable-documenter` subagents are not registered in this harness's agent roster, so a fresh-context review was substituted with a disciplined self-audit against `craft-floor.md` and the direction contract instead. Disclosed per the skill's own substitution rule.
