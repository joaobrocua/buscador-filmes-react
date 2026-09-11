# Design

<!-- impeccable:design-schema 2 -->

## World

**Painel de Cinema** (working name) — a confident, information-dense entertainment-database look. This replaces the earlier "Cinephile Diary" world (warm paper, serif, handwriting) entirely, per the user's request to restyle using real reference sites rather than another abstract direction round.

**Process note**: instead of running the impeccable direction-roll (`concept-seed.mjs`), this round was seeded directly from references the user supplied — [filmow.com](https://filmow.com), [justwatch.com/br](https://br.justwatch.com/br), [imdb.com/pt](https://www.imdb.com/pt/), [omelete.com.br](https://www.omelete.com.br/), [pobreflixhub.net](https://www.pobreflixhub.net/). None of these is cloned; the system below is a synthesis of what they share (dark ground, vivid badge colors, bold sans, dense grids), built into one original identity. The full direction contract lives as an HTML comment, first child of `<body>`, in [index.html](index.html).

## Palette — near-black ground, one action red, one rating gold

| Token | Value | Role |
|---|---|---|
| `--bg` | `#0b0a0f` | Page ground |
| `--bg-elevated` | `#151319` | Header/footer, modal surface |
| `--card` | `#1c1a22` | Cards, inputs, chips |
| `--border` | `#2e2b36` | Hairlines |
| `--text` | `#f5f3f7` | Primary text (17.9:1 on bg) |
| `--text-muted` | `#9691a1` | Secondary text (6.4:1 on bg, 5.6:1 on card) |
| `--red` | `#c8253b` | Solid fills carrying **white text** (buttons, active pill) — 5.55:1 with white |
| `--red-hover` | `#9c1c2d` | Hover/active darken of `--red` |
| `--red-bright` | `#f74a63` | Vivid accent for **text/icons/borders on dark** (links, header rule, focus ring, hover glow) — 5.0:1 on card, 5.7:1 on bg |
| `--gold` | `#ffc94a` | Rating badge only — the genre's own universal convention (IMDb/JustWatch/Filmow all reserve a warm accent for the score) |
| `--gold-ink` | `#221a06` | Text on gold badges — 11.3:1 |
| `--alert` | `#ff6b4a` | Real failure state only (distinct from the brand red) |

Two named accent roles, not a scattered palette: red carries brand/action/interaction, gold carries only the rating. This is a deliberate two-token system earned by how consistently the reference sites separate "brand color" from "score color."

`--red` and `--red-bright` are two different values for the same hue on purpose: a single red that reads well as white-on-red *and* as text-on-dark does not exist at this saturation, so the darker one is the fill, the brighter one is the ink/border.

## Type

- **Anton** — single black weight, uppercase, used only for big display moments (site title, section headers, movie title in the modal). Condensed and loud on purpose — the poster-marquee register the references all reach for.
- **Archivo** (400–800) — everything else: body copy, buttons, badges, tags, meta text. A confident grotesk, not in the training-data-default list (Inter/Space Grotesk/DM Sans/etc.).
- No serif, no handwriting face this round — the database/portal register wants a single loud sans family, not a literary pairing.

## Components

- **Header** — bold uppercase wordmark with a small star-badge mark, under a solid red rule (not a gradient, not a soft glow — a hard 3px line, like a marquee edge).
- **Type toggle** — a pill switch; the active option is a solid red pill with white text, not an outline.
- **Search** — pill-shaped dark field with a pill red submit button; spinner replaces the label while a search is in flight.
- **Rating badge** (`RatingBadge.jsx`) — gold pill, star icon + one decimal, reused identically on cards and in the modal at two sizes. This is the universal convention across every reference site; the previous round's 5-star fill bar is retired.
- **Media card** — dark tile, thin hairline border, gold rating badge fixed top-right of the poster (the one placement every reference site agrees on). Hover: border and shadow turn red, card lifts — no tilt, no photo-corner conceit this time; the register is catalog tile, not scrapbook.
- **Modal** — a dense "database record": big Anton title, a single meta row (year · rating badge · runtime/seasons), genre tags as solid outlined pills, synopsis last. No handwritten annotations, no page-spread metaphor.
- **Provider filter** (`ProviderFilter.jsx`) — a row of real streaming-service logos as circular chips (top ~8 for Brazil by TMDB's own `display_priorities`), click to toggle. Selecting one switches the grid from "populares" to a `/discover` query filtered by that provider; selecting a provider clears any active search term, and submitting a search clears the provider (the two modes don't compose against the TMDB API today, so the UI doesn't pretend they do).
- **Trending row** (`TrendingRow.jsx`) — a horizontal-scroll strip sourced from TMDB's real `/trending/{tipo}/day`, badge labeled plainly "Em alta" (a single honest tier, not JustWatch's proprietary multi-tier viral/trending distinction, which we have no data for). Each card resolves its own "Assista agora" provider via a per-title watch-providers lookup.
- **Seasons & episodes** (`SeasonEpisodes.jsx`, TV only) — a pill row of seasons (from the show's own `/tv/{id}` payload, no extra call) and, below it, the selected season's episode list (number, still, name, air date, runtime) fetched from `/tv/{id}/season/{n}` on demand. TMDB has no per-episode watch-provider data, so each episode's "Assistir" button honestly reuses the show-level watch link rather than pretending to deep-link that specific episode.
- **Empty / error states** — same dark-card language; the API-key notice uses `--red-bright` (informational), a real fetch failure uses `--alert` (visually distinct warm orange-red) so the two never read as the same problem.
- **Skeleton loading** — shimmer across `--card` → `--border` → `--card`, same card shape as the real grid.

## Motion — one authored family

- Card entrance: quick fade + rise (30ms/card, capped at 10) — snappier than the previous round's stagger, matching the punchier register.
- Card hover: border/shadow color shift + small lift, no rotation.
- Modal entrance: fast scale + rise (220ms) — confident, not dreamy.
- Skeleton shimmer for the loading state.
- Everything collapses under `prefers-reduced-motion: reduce`.

## Browser surfaces

Selection, scrollbar, `:focus-visible` ring, and input caret are themed from `--red-bright` rather than left as browser defaults.

## Contrast — verified

All text/background pairs checked against WCAG AA (4.5:1) with the actual rendered page, not just the swatch values: `--text` 17.9:1, `--text-muted` 6.4:1 (bg) / 5.6:1 (card), `--red` w/ white text 5.55:1, `--red-bright` 5.7:1 (bg) / 5.0:1 (card), `--gold-ink` on `--gold` 11.3:1. The first pass shipped `--red-bright` at a value that only cleared 4.0:1 against white text and 4.3:1 as text-on-card — both were caught and corrected before shipping, which is why the fill/ink split above exists at all.

## Known gaps / honest risk

- The type toggle still uses `role="tablist"`/`role="tab"` without roving-tabindex arrow-key navigation (carried over from earlier rounds; each tab remains independently focusable).
- No image-generation tool was available in this environment; this was a **code-led** build with no rendered comp — the ambition lives in the direction contract (`index.html`) and this file.
- This document and the finish check were written in-thread by the same session that built the surface — the skill's shipped `impeccable-finish-reviewer` / `impeccable-documenter` subagents are not registered in this harness's agent roster, so a disciplined self-audit against `craft-floor.md` substitutes for them, as disclosed in the previous round.
- This is the **second** full visual world for this product in one project history (see git log). That is an unusually high churn rate for a shipped identity; if a third restyle is requested, it's worth pausing to ask what about the first two wasn't landing, rather than rolling a third world on faith.
