# Decisions

Judgment calls made while scaffolding myelin. Each is reversible — change as you like.

## Image location: colocated with markdown, not a separate `src/assets/entries/`

The spec showed both `src/assets/entries/<date>.png` for the file and `image: ./<date>.png` in frontmatter. Those two contradict each other: a relative `./` path resolves against the markdown file's directory, so `./` would point at `src/content/entries/`, not `src/assets/entries/`.

I kept the simpler `./` form and put the image alongside its markdown file in `src/content/entries/`. Adding a new entry now means dropping two files into one folder. No `src/assets/entries/` directory exists.

If you'd rather split them, change the frontmatter path to `../../assets/entries/<date>.png` and create `src/assets/entries/`. The `image()` schema helper in `src/content/config.ts` handles either path; nothing else changes.

## Starter alt text

I peeked at `~/Downloads/2026-05-02.png` to write a real description rather than a placeholder. Current alt:

> A dusk landscape where rolling green hills form the profile of a sleeping face, with luminous golden filaments arcing overhead like neural pathways. A distant city glows on the horizon.

Tweak to taste in `src/content/entries/2026-05-02.md`.

## Caption + date layout

Caption and date sit together at the **bottom-centre** of the viewport, horizontally aligned with the image like a museum label. They share a single line (`flex` with baseline alignment), separated by a thin middot — `first signal · may 2, 2026`.

Hierarchy: the caption is the *content* of the entry, so it leads visually — bigger, in regular ink (`--fg`). The date is the quieter timestamp that follows — smaller, italic, muted. The separator is rendered via a `::before` on `.date` and only shows when both elements are present.

Starter caption is `"first signal"`. Spec originally suggested the date in a corner; bottom-centre below the image read better once the caption became the lead.

## About link position and styling

Top-right corner, not bottom-right (spec). It uses the **same color, font-size and letter-spacing as the caption** (`--fg`, `1.171875rem`, `0.005em`) so the two pieces of overlay text read as one consistent voice — different positions, same voice. Hover/focus shifts to `--accent`.

## Lowercase tone

The whole site is lowercase: chrome text, links, page `<title>`s, and the about-page prose (including the byline). The date is also lowercased after `toLocaleDateString` (`may 2, 2026`, not `May 2, 2026`). Proper-noun rules are dropped on purpose — it's the project's tone. Sentence-initial capitalisation in markdown frontmatter (`alt`) is left alone since alt text is read aloud by screen readers and arguably benefits from normal casing.

## Typography: Source Serif 4

A modern serif with a clean italic — the italic is used for the date label and the about-page title. Loaded via Astro 6's Fonts API (Google provider), weights 400/500, normal + italic, latin subset. No manual `<link>` tags, no FOUT.

Alternatives considered: Newsreader (warmer, more literary), EB Garamond (more historical). Source Serif 4 is the most neutral and reads cleanly at small sizes, which matters here since chrome text is small by design.

## Palette

- **Light**: `#f3ede2` background (warm off-white, leans paper), `#1a1814` ink, `#8a857a` muted, `#a87c5a` accent (clay).
- **Dark**: `#0c1018` background (deep blue-black, matches the dusk imagery), `#e8e4da` ivory text, `#6a7180` muted, `#c89a78` warm tan accent.

The accent is used only on hover/focus states (nav arrows, about link) and `::selection`. Nothing on the page is bright at rest. The about link, the caption, and the about-page body text all share `--fg`; the date and the about-page byline use `--muted`.

Switched purely on `prefers-color-scheme` per the spec — no toggle UI.

## Image sizing

`max-width: min(85vw, 100%)`, max-height capped at `calc(100dvh - var(--chrome-band))` where `--chrome-band` clamps from `6.5rem` on small screens to `9rem` on large.

The chrome (top-right "about" and bottom-centre caption + date) is fixed-positioned, so the image's height has to be reserved-down to leave a clear band at top and bottom — otherwise on short viewports the caption ends up overlapping the lower edge of the image. A subtle box-shadow lifts the image off the background.

The earlier scaffold used a flat `max-height: 85dvh`, which was simpler but produced visible overlap once the chrome typography was bumped 25%.

## Typography sizes

Chrome and about-page type were scaled up 25% from the original scaffold so the site reads less timid:

- caption: `1.171875rem` (was `0.9375rem`)
- date: `0.9375rem` (was `0.75rem`)
- about link: matches caption — `1.171875rem`, `letter-spacing: 0.005em`
- about-page prose: `1.328125rem` (was `1.0625rem`)
- about-page h1: `1.5625rem` (was `1.25rem`)
- about-page back link: `1.09375rem` (was `0.875rem`)

Decimal sizes look weird but are exact `× 1.25` of the prior values — feel free to round them.

## Prev / next semantics

- `←` (left arrow / ArrowLeft) goes to the **older** entry.
- `→` (right arrow / ArrowRight) goes to the **newer** entry.

This matches reading-order intuition (going back in time = leftward) and is the most common pattern for journal-style sites. When a neighbour doesn't exist the arrow renders as a non-interactive span at very low opacity, so layout never shifts.

## Swipe gestures

**Skipped.** The spec said "only if you can implement in <30 lines of JS" — a robust touch swipe handler that doesn't fight scroll, handles cancellation, and respects the velocity threshold is more than that. Mobile users get tap-on-arrow and that's it. Easy to add later.

## Keyboard handler

Bound once on `document` with a `window.__myelinKeysBound` guard so view transitions don't double-bind. The handler ignores key events when modifier keys are held or when the focus is inside an input — defensive but cheap.

## Index page renders inline (no redirect)

Per spec. `/` and `/e/<latest-date>` both render the same entry. No canonical link added; can be added later if SEO becomes a concern.

## Vercel adapter included even though output is static

The spec asked for it. Static output doesn't strictly need an adapter, but having `@astrojs/vercel` lets Vercel pick up image-optimisation hints and headers configuration if/when needed.

## Content-collection config location

Spec said `src/content/config.ts`, but Astro 6 hard-errors on that path with `LegacyContentConfigError` and refuses to build. Moved to `src/content.config.ts` (one level up). Functionally identical, just the new required location.

## Picture vs Image component

Used `<Picture>` from `astro:assets` rather than `<Image>`. `<Image>` accepts a `formats` array but only emits the *last* one; you don't get a real fallback chain. `<Picture>` renders a `<picture>` with one `<source type="image/avif">`, one `<source type="image/webp">`, and an `<img>` fallback — which is what the spec asked for. `transition:name` is passed through and ends up on the `<img>` so the cross-fade animation still works between entries.

## Vite version override

`@tailwindcss/vite` declares `vite ^5.2.0 || ^6 || ^7 || ^8` as a peer, and on a fresh install resolves Vite 8 at the project root. Astro 6 ships Vite 7 internally. The result is two Vite copies in the tree, and at build time rolldown's native bindings disagree on the resolve-plugin config shape — the build crashes with `Missing field tsconfigPaths on BindingViteResolvePluginConfig.resolveOptions`.

Fix: a top-level `overrides.vite: "$vite"` in `package.json` plus `vite` as a devDependency, which forces every consumer (including `@tailwindcss/vite`) to use the same Vite. Drop both lines once the upstream incompatibility is resolved.
