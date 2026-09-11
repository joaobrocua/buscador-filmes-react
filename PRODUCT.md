# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React + Vite, plain CSS (no UI framework), one serverless function (`api/tmdb.js`). Deployed on Vercel (migrated from GitHub Pages after the TMDB key was found committed to the public repo's history — see "Capabilities and Constraints").

## Users

Dual audience, held equally:

- **Recruiters / other developers** browsing the project as a portfolio piece — they judge craft, taste, and execution quality in the first few seconds.
- **The author and friends/family**, using it casually to decide what to watch — search a title or browse what's popular right now.

## Product Purpose

A small movie & TV search tool built on the public TMDB API: browse popular titles, search by name, and open a detail view (synopsis, rating, genres, runtime/seasons). Success is a fast, frictionless search that also reads as a deliberately designed piece of work, not a tutorial-grade CRUD demo.

## Positioning

Most personal "TMDB search" side projects (the category this sits in) ship as an unstyled or lightly-styled Bootstrap-ish grid — functional, forgettable, obviously a learning exercise. This one's differentiator is visual conviction: a single, fully-committed visual world applied with production-grade execution, on a scope small enough that every screen, state, and micro-interaction can actually be finished rather than merely started.

## Operating Context

Single-page app, no auth. A small serverless proxy (`api/tmdb.js`, deployed on Vercel) fronts the TMDB REST API so the key (`TMDB_API_KEY`) stays server-side and never ships in the client bundle. Two content types (movies, TV shows) toggled by the user; search-by-name or browse-popular as the two entry paths; a detail modal as the only secondary view. Portuguese (pt-BR) UI copy throughout.

## Capabilities and Constraints

- No account system, no watchlists/favorites, no backend beyond the single TMDB proxy function — purely a read-only TMDB client.
- Must keep the mandatory TMDB attribution notice in the footer.
- The TMDB key lives only in `TMDB_API_KEY` (server-side env var, no `VITE_` prefix) and must never be embedded in the client bundle again; the app must degrade gracefully (an in-product notice, not a crash) when the proxy reports the key is missing.
- Hosting: Vercel (static build + one serverless function under `api/`).

## Brand Commitments

None. No existing name, mark, or palette is binding — the user explicitly approved discarding the current dark/gold visual system entirely for the redesign.

## Evidence on Hand

Live poster art, ratings, genres, and synopses come from the real TMDB API at runtime — no placeholder content needed for those. No logo, brand guide, or existing marketing assets exist beyond the current (replaceable) in-app title treatment and favicon.

## Product Principles

1. **One committed world, fully finished** — a small surface is an argument for depth over breadth: every state (loading, empty, error, hover, focus) gets the same level of finish as the happy path.
2. **Craft is the pitch** — since the dual audience includes people evaluating the work itself, visual and interaction polish is never optional scope; it's the product's actual differentiator.
3. **Never fight the task** — search and browse stay fast and legible; expression amplifies the movie-discovery moment, it never buries the title, the rating, or the search field.
4. **Real data, no invented claims** — TMDB is the only source of truth; nothing about ratings, cast, or availability is fabricated.

## Accessibility & Inclusion

No formally required standard, but keyboard operability, visible focus, and readable contrast are treated as a baseline, not an enhancement (carried over from the prior implementation).
