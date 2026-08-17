# Handoff: Prajesh Kumar — Portfolio Site

## Overview
A single-page developer portfolio for Prajesh Kumar (SDE, compilers/systems/security focus). Paper-toned background, indigo-blue accent, black text, monospace + Space Grotesk type. Sections: Hero, Experience, Projects, Skills, Writing (blog link), Contact. Hero includes an interactive 3D "slime" blob (three.js) users can drag-poke and flick to split into droplets.

## About the Design Files
The files in this bundle (`Prajesh Portfolio.dc.html`, `slime3d.js`, `image-slot.js`) are **design references built in HTML/JS** — they show the intended look, copy, and interaction, not production code to import as-is. Recreate this design in whatever stack you're building the real site in (plain static HTML/CSS/JS, React, Next.js, etc.) using that stack's conventions. If you don't have a stack chosen yet, plain static HTML/CSS/JS is the simplest fit for a portfolio like this.

## Fidelity
**High-fidelity.** Colors, type, spacing, and copy below are final — implement pixel-close. The 3D slime interaction is a working reference implementation (real three.js code) — port its logic, not just its look.

## Screens / Views
Single scrolling page, one view, anchor-linked sections.

### Nav (sticky top)
- Sticky bar, `max-width:1080px` centered, `padding:16px 32px`.
- Background `rgba(244,241,232,.85)` + `backdrop-filter: blur(10px)`, bottom border `1px solid rgba(26,26,23,.08)`.
- Left: "PRAJESH." wordmark, JetBrains Mono 700 12px, the trailing period in accent blue `#3546e0`.
- Right: links Work / Projects / Skills / Blog / Contact, JetBrains Mono 12px, muted `#5c5848`; Contact is bold accent `#3546e0`.

### Hero
- Grid: `28px | 1fr | 1fr` columns, `gap:44px`, min-height 520px, padding `70px 0 100px`.
- Col 1: vertical side-nav — "WORK" / "PROJECTS" links in `writing-mode: vertical-rl`, JetBrains Mono 11px, color `#6a6a60` (hover `#3546e0`), a 1px vertical divider line, then "CONTACT" link at the bottom.
- Col 2: eyebrow "I'M PRAJESH KUMAR" (JetBrains Mono 12px, accent blue, letter-spacing .1em) → h1 stacked 3 lines, 58px/1.05, weight 700: "Engineer." (black) / "Compilers." (accent blue) / "Security." (black) → paragraph (15px/1.8, `#5c5848`, max-width 440px, first-person bio) → button row: primary button "See my work →" (`.btn-primary`: bg `#3546e0`, text `#f4f6ff`, `padding:13px 26px`, `border-radius:8px`, hover `translateY(-2px)` + shadow) and a text link "resume.pdf ↓".
- Col 3: square-ish box (`aspect-ratio:1/1.05`) holding the interactive 3D slime canvas, with a small caption below: "click + drag, then flick to split droplets" (JetBrains Mono 10.5px, `#8a8471`).

### Experience
- Section label "EXPERIENCE" (`.section-label`: JetBrains Mono 11px, letter-spacing .22em, accent blue, with a 26px accent-blue tick mark before it).
- 3-column grid, `gap:22px`, three `.card3d` cards (Amazon / Shell / NYU Courant), each: meta line (mono, accent blue, e.g. "2026 · SEATTLE"), org name (18px/600), role (12.5px, `#8a8471`), body paragraph (12.5px/1.75, `#5c5848`, first-person).
- `.card3d`: bg `#fbf9f2`, border `1px solid rgba(26,26,23,.1)`, `border-radius:16px`, `padding:28px`; on hover: `transform: rotateX(4deg) rotateY(-3deg) translateY(-8px)`, border → `rgba(53,70,224,.4)`, shadow `0 30px 60px rgba(26,26,23,.12), 0 0 40px rgba(53,70,224,.1)` (needs `perspective` on the parent grid and `transform-style: preserve-3d` on the card).

### Projects
- Same section-label pattern, "PROJECTS".
- 2-column grid, `gap:22px`, two `.card3d` cards as full-card links (MiniTensorCompiler — C++/MLIR/LLVM; AnyLang — OCaml/RISC-V), same card styling as Experience, body ends with an inline "github ↗" accent link.

### Skills
- One `.card3d` panel, `padding:32px`, three labeled rows (Languages / Systems & Compilers / Cloud & Infra), each a wrapped row of `.chip` pills: `border:1px solid rgba(26,26,23,.22)`, `border-radius:6px`, `padding:5px 11px`, JetBrains Mono 11px.

### Writing (Blog)
- One `.card3d` link card to the external blog, title 19px/600 + body paragraph.

### Contact
- Centered. Section label, h2 "The case is still open." (30px/600), paragraph (15px/1.85, `#5c5848`, max-width 480px), primary button with mailto, then three text links (github / linkedin / blog).
- Footer line: copyright, centered, 10.5px mono, `#8a8471`.

## Interactions & Behavior
- Smooth-scroll anchor nav (`html { scroll-behavior: smooth }`) to `#work`, `#projects`, `#skills`, `#contact`.
- Card hover: 3D tilt + lift + glow (see `.card3d:hover` above), 0.35s transition.
- Button hover: lift 2px + shadow.
- **3D slime blob** (hero, `slime3d.js`): three.js `IcosahedronGeometry` deformed per-vertex by cheap value-noise for an idle organic wobble. Raycasts the pointer against the mesh; on pointerdown+drag, tracks drag speed; on release, if drag speed exceeds a threshold, spawns 5–8 small sphere "droplets" at the poke point that fly outward (velocity = poke direction + random spread, biased upward) with simple gravity, fading opacity over ~1–1.7s lifetime and being removed from the scene when their life reaches 0. Material: `MeshPhysicalMaterial`, color `#3546e0`, `clearcoat:0.9`, slight emissive `#1c2470`, `opacity:0.94`. Lighting: ambient `#8fa0ff`, key light `#c4ceff`, rim light `#8e5bff`.
- No loading/error states — this is a static informational page.

## State Management
No app state beyond hover/scroll and the slime's local animation-loop state (pointer position, drag velocity, per-vertex noise offsets, active droplets array). No data fetching.

## Design Tokens
**Colors**
- Background (paper): `#f4f1e8`
- Card background: `#fbf9f2`
- Primary text: `#1a1a17`
- Muted text: `#5c5848`
- Faint/meta text: `#8a8471`
- Accent (indigo blue): `#3546e0`
- Accent-tinted card border (hover): `rgba(53,70,224,.4)`
- Borders (default): `rgba(26,26,23,.1)` – `rgba(26,26,23,.22)`

**Typography**
- Headings/body: `Space Grotesk` (400–700)
- Labels/meta/mono UI: `JetBrains Mono` (400–700, italic 400)
- Scale used: 58px (h1) / 30px (h2) / 20px (card title lg) / 18–19px (card title) / 15px (body) / 12.5–13px (card body) / 11–12px (labels, mono)

**Spacing / radius**
- Section vertical padding: 40–100px
- Card padding: 28–32px
- Grid gaps: 22px
- Card radius: 16px, chip/button radius: 6–8px

**Shadows**
- Card hover: `0 30px 60px rgba(26,26,23,.12), 0 0 40px rgba(53,70,224,.1)`
- Button hover: `0 10px 26px rgba(53,70,224,.25)`

## Assets
No external images. Fonts loaded from Google Fonts (Space Grotesk, JetBrains Mono). The hero art area is 100% code-generated (three.js canvas), no static image asset.

## Files
- `Prajesh Portfolio.dc.html` — full page markup + inline styles (design-tool component format; treat the inline styles/markup as the spec, not the wrapper format).
- `slime3d.js` — the interactive 3D blob web component (`<slime-3d>`), real working three.js source — port this logic directly.
- `image-slot.js` — a design-tool placeholder component, not needed in production (was swapped out for the slime).
