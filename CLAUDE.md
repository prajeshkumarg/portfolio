# Portfolio — Prajesh Kumar

Single-page developer portfolio. Static, no backend, no data fetching.

## Stack

Next.js (App Router) · TypeScript · CSS Modules · GSAP (ScrollTrigger, SplitText) · Lenis

No 3D, no canvas. The page is server-rendered markup and CSS; motion is layered on by a
single client component.

> **Branch `experiment/awwwards`** — full-width redesign (1600px cap, fluid side padding).
> The **hero and Contact are bento grids** of `Tile`s. Between them the page alternates
> paper and ink: Experience (sand band, "open tabs" — the
> company wordmarks (transparent PNGs; the name is visually hidden) heading three parts of one outlined box (border
> only, like the hero's; thin inner rules between parts), every panel open; logos are optically aligned — scaled so their lettering matches
> and set on one baseline, from each logo's measured `logoLetters`; `current: true` gets
> clay point markers) · Projects
> (paper — the screenshots are dark, so they need a light ground; an index + live preview:
> numbered rows with tag pills; hovering/focusing a row swaps the sticky screenshot +
> description on the right. Phones show each row's shot inline. New project = one row) · Skills (ink band, open columns) · Education (two
> cards) · Writing (one wide row). Ink sections use the `Band` primitive.
> Below the hero, surfaces have **no outlines**: cards are separated by tone + `--shadow-tile`.
> **Two accents with fixed roles:** indigo `--color-accent` = interactive (links, buttons,
> the italic title word); clay `--color-clay` = live status only (the hero's Now tile).
> **Sections can override the accent:** Projects sets `--color-accent: var(--color-green)`
> (header, active row, links, focus ring); Experience (sand) sets `--color-accent` and
> `--color-faint` to the sand-safe clay and grey. Skills keeps periwinkle.
> Dates and meta tags are neutral (`--color-faint`). **Hero tiles are `outline`** — border
> only, no fill; the Now tile is the one filled (clay) tile. The photo has no border.
> Section titles come from `sections` in `content.ts`. GSAP + Lenis were explicitly
> approved for this branch only. `main` still follows the handoff spec and its
> no-animation-library rule.

## Design source of truth

`.claude/design_handoff_portfolio/` is a **high-fidelity** spec. Colors, type, spacing,
and copy are final — implement pixel-close.

| File | Role |
|---|---|
| `README.md` | The spec. Read before implementing any section. |
| `Prajesh Portfolio.dc.html` | Reference markup + inline styles. The `<x-dc>`/`<helmet>` wrapper is a design-tool artifact — ignore it, the styles and copy are the spec. |
| `slime3d.js` | Hero blob source. **Not implemented — the 3D hero was dropped.** Ignore. |
| `image-slot.js` | Design-tool placeholder. Not used in production. |

Never edit files in `.claude/design_handoff_portfolio/` — it's a read-only reference.

## Structure

```
app/
  layout.tsx        # fonts, metadata, globals import
  page.tsx          # assembles all sections in order
  globals.css       # :root tokens, reset, base element styles
components/
  <Name>/
    <Name>.tsx
    <Name>.module.css
content.ts          # all copy and data
types.ts            # Experience, Project, SkillGroup, SocialLink
public/             # resume.pdf and static assets
```

Sections in page order: Nav · Hero · Experience · Projects · Skills · Education · Writing ·
Contact · Footer
Primitives: `Bento` + `Tile` (grid and tile — Hero and Contact only) · `Band` (full-bleed
ink section) · `SectionHeader`
(label + h2; `ink` and `center` variants) · `ButtonPrimary` · `Motion` (the only client
component)

### Bento

`Tile` takes `span` (3–8 or 12 of 12 columns), `rows` (1–2), `tone`, and `href` (only
link tiles get hover). Under 900px spans 3–5 become half width and 6+ full; under 600px
everything is one column. Bleeds inside a tile (logo bands, project media) use negative
`var(--tile-pad)` margins and are clipped by the tile's `overflow: hidden`. Hover lift uses
the `translate` property so it never fights GSAP, which animates `transform`.

### Motion

`components/Motion/Motion.tsx` renders nothing. Sections expose `data-*` hooks
(`data-intro`, `data-split`, `data-reveal`, `data-preview`, `data-progress`) and
Motion drives them; `Tile` sets `data-reveal` (or `data-intro` in the hero) itself, so every section
stays a Server Component. New animation = add a hook in markup + handle it in Motion.
An inline boot script in `layout.tsx` adds `html.motion` before paint so the hero starts
hidden; it's skipped under `prefers-reduced-motion`, and removed after 3s if Motion never
boots. Lenis is off under reduced motion; scroll-scrubbed progress stays on.

## Rules

- **No hardcoded hex, font names, or shadow values in components.** Always `var(--*)`.
  New value needed? Add a token to `globals.css` first.
- **No copy in JSX.** All text, links, and lists live in `content.ts` and render via `.map()`.
- **Server Components by default.** `Motion` is the single `'use client'` component;
  don't add others — add a `data-*` hook and handle it there.
- **One `.module.css` per component.** No global class names outside `globals.css`.
- Use the `next/font` CSS variables (`--font-sans`, `--font-mono`), never a raw
  `font-family: 'Space Grotesk'`.

## Design tokens

Defined in `app/globals.css` as `:root` custom properties.

```
--color-paper       #f4f1e8   page background
--color-card        #fbf9f2   card background
--color-ink         #1a1a17   primary text
--color-muted       #5c5848   body text
--color-faint       #8a8471   meta / captions
--color-accent      #3546e0   indigo — links, labels, primary button
--color-on-accent   #f4f6ff   text on accent
--border-default    rgba(26,26,23,.1)
--border-strong     rgba(26,26,23,.22)
--border-accent     rgba(53,70,224,.4)    card hover
--shadow-card-hover 0 30px 60px rgba(26,26,23,.12), 0 0 40px rgba(53,70,224,.1)
--shadow-btn-hover  0 10px 26px rgba(53,70,224,.25)
--shadow-hero-portrait 0 20px 44px rgba(26,26,23,.16), 0 0 28px rgba(53,70,224,.12)
--radius-card       16px
--radius-control    8px
--radius-chip       6px
--radius-circle     50%     hero portrait frame
--content-max       1080px
```

Type scale: 58px h1 / 30px h2 / 20px card title lg / 18–19px card title / 15px body /
12.5–13px card body / 11–12px mono labels.

Signature interactions:
- `.card3d:hover` → `rotateX(4deg) rotateY(-3deg) translateY(-8px)`, accent border, card
  shadow, `.35s`. Requires `perspective: 1400px` on the **grid parent** and
  `transform-style: preserve-3d` on the card.
- Button hover → `translateY(-2px)` + button shadow, `.25s`.

## The hero art slot — the portrait

The handoff's hero is a `28px | 1fr | 1fr` grid whose third column held an interactive
3D blob. **That was built, then dropped — the 3D direction was rejected.** The grid is
`28px 1fr 1fr`; the third column holds Prajesh's portrait in a circular frame
(`public/image.png` — the removebg cutout was tried 2026-08-29 and reverted),
replacing the rotating word stack (2026-08-28). It is
`next/image` in a `--radius-circle` frame with a `--shadow-hero-portrait` depth
shadow, a CSS 3D tilt on hover (perspective on the stage, `preserve-3d` on the
frame — the same pattern as `.card3d`). A bounce was tried and removed at
Prajesh's request; motion respects `prefers-reduced-motion`.

Do not reintroduce a canvas or a 3D library without being asked for it directly.

On `experiment/awwwards` the hero is a bento: an 8-col × 2-row statement tile (eyebrow,
h1, bio, actions), a 4-col portrait tile (the photo fills it, caption pill on top), then
a row of Learning (3 cols) · Building (6 cols) ·
Now (3 cols, the one filled clay tile) from `hero.learning` / `hero.building` /
`hero.status`. Each tile has one accent on its dot, label and link — ochre
(`--color-ochre`), green (the Projects colour), clay. The circular frame is not used on this branch.

## Responsive

The handoff defines **no** breakpoints. Invented behavior:
- `< 900px` — hero collapses to one column (the portrait centers, its caption
  centers under it)
- `< 900px` — Experience 3-col → 1-col, Projects 2-col → 1-col
- h1 clamps 58px → ~38px

On `experiment/awwwards`, **large screens scale the whole page** through one unit, `--u`
(`globals.css`): exactly `1px` up to 1800px wide, then `100vw / 1800` (≈1.42px at 2560).
Every size that should grow — tokens, and the px maximum inside component `clamp()`s — is
written `calc(N * var(--u))`, so a big display shows the same composition scaled up
rather than a small page in wide margins. New sizes: use `var(--u)`, not bare px. (CSS
`zoom` was avoided: it breaks the `100vw` breakouts in `Band`.) The hero portrait has no
caption on this branch.

On `experiment/awwwards` type is fluid (`--text-display`, `--text-h2`, `--text-stat`,
`--text-tile-heading` are `clamp()`s), the bento grids go 12 → 6 → 1 columns (see
**Bento**), Experience rows and Projects splits stack `< 900px`, Skills goes 4 → 2 → 1
columns, and the nav drops Projects/Skills `< 480px` so it fits a 375px screen.

## Commands

```
npm run dev     # localhost:3000
npm run build   # run before declaring done — catches SSR errors dev hides
npm run lint
```

Opening the dev server on a LAN address (e.g. to test on a phone) relies on
`allowedDevOrigins` in `next.config.ts`, which allows all private ranges (`192.168.*.*`,
`10.*.*.*`, `172.16–31.*.*`) and `*.local` — so IP changes need no edit. A host outside
those gets its JS and HMR blocked (403): the page renders but never hydrates, and every
Motion effect silently does nothing.

## Open items

- `public/resume.pdf` — the handoff links `uploads/resume_file-1783319775597.pdf` but the
  asset was not included. Link points at `/resume.pdf`; real file still needed.
- ~~Blog URL — confirm final.~~ Confirmed `https://blog-praj3sh.web.app` (Firebase Hosting).
  Set once as `site.blogHref`; nav, Writing card, and Contact all derive from it.
- LinkedIn in the reference is `linkedin.com/prajeshkumarg`, missing `/in/`. Corrected in
  `content.ts` to `linkedin.com/in/prajeshkumarg`.
