# Portfolio — Prajesh Kumar

Single-page developer portfolio. Static, no backend, no data fetching.

## Stack

Next.js (App Router) · TypeScript · CSS Modules

No 3D, no canvas, no animation libraries. The page is server-rendered markup and CSS.

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

Sections in page order: Nav · Hero · Experience · Projects · Skills · Writing · Contact · Footer
Primitives: `Card3D` · `SectionLabel` · `Chip` · `ButtonPrimary`

## Rules

- **No hardcoded hex, font names, or shadow values in components.** Always `var(--*)`.
  New value needed? Add a token to `globals.css` first.
- **No copy in JSX.** All text, links, and lists live in `content.ts` and render via `.map()`.
- **Server Components by default.** Nothing currently needs `'use client'` — the whole
  page is static. Adding it should be a deliberate, justified choice.
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
--radius-card       16px
--radius-control    8px
--radius-chip       6px
--content-max       1080px
```

Type scale: 58px h1 / 30px h2 / 20px card title lg / 18–19px card title / 15px body /
12.5–13px card body / 11–12px mono labels.

Signature interactions:
- `.card3d:hover` → `rotateX(4deg) rotateY(-3deg) translateY(-8px)`, accent border, card
  shadow, `.35s`. Requires `perspective: 1400px` on the **grid parent** and
  `transform-style: preserve-3d` on the card.
- Button hover → `translateY(-2px)` + button shadow, `.25s`.

## The hero art slot — deliberately empty

The handoff's hero is a `28px | 1fr | 1fr` grid whose third column held an interactive
3D blob. **That was built, then dropped — the 3D direction was rejected.** The hero is
now `28px | 1fr` and reads as left-aligned copy.

Do not reintroduce a canvas, a 3D library, or an animated hero decoration without being
asked for it directly.

## Responsive

The handoff defines **no** breakpoints. Invented behavior:
- `< 900px` — hero drops the vertical side-nav and collapses to one column
- `< 900px` — Experience 3-col → 1-col, Projects 2-col → 1-col
- h1 clamps 58px → ~38px

## Commands

```
npm run dev     # localhost:3000
npm run build   # run before declaring done — catches SSR errors dev hides
npm run lint
```

## Open items

- `public/resume.pdf` — the handoff links `uploads/resume_file-1783319775597.pdf` but the
  asset was not included. Link points at `/resume.pdf`; real file still needed.
- ~~Blog URL — confirm final.~~ Confirmed `https://blog-praj3sh.web.app` (Firebase Hosting).
  Set once as `site.blogHref`; nav, Writing card, and Contact all derive from it.
- LinkedIn in the reference is `linkedin.com/prajeshkumarg`, missing `/in/`. Corrected in
  `content.ts` to `linkedin.com/in/prajeshkumarg`.
