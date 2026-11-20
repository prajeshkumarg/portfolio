/*
 * HeroArt — the 32×20 pixel scenes for the "Building now" items, shared by the
 * desktop cards (HeroCard) and the phone list (a 20px icon). Each scene is a label
 * colour (a --viz-* token) and a grid where `c` = the label colour, `i` = ink,
 * `b` = background, `.` = empty. Unknown keys fall back to the jade label with an
 * empty frame. Server-safe: no hooks, deterministic output.
 *
 * To add art: add an entry to ART below (and an item to `now` in content.ts).
 */

import styles from './HeroArt.module.css';

const W = 32;
const H = 20;

export type Art = {
  /** The label colour: a --viz-* token reference. */
  colour: string;
  /** H rows of W characters. */
  grid: string[];
  /** Optional blinking cursor rect on the grid (x, y, w, h). */
  cursor?: [number, number, number, number];
};

// ---- art builders -----------------------------------------------------------

const blank = () => Array.from({ length: H }, () => Array<string>(W).fill('.'));
const toRows = (g: string[][]) => g.map((r) => r.join(''));

/** A PSP, near full width: D-pad left, buttons right, tiny text typing on the screen. */
function pspGrid(): string[] {
  const g = blank();
  // body: rows 2..17, cols 1..30, corners rounded by one pixel
  for (let y = 2; y <= 17; y++) {
    for (let x = 1; x <= 30; x++) {
      const corner = (y === 2 || y === 17) && (x === 1 || x === 30);
      if (!corner) g[y][x] = 'c';
    }
  }
  // screen: rows 4..15, cols 8..23
  for (let y = 4; y <= 15; y++) for (let x = 8; x <= 23; x++) g[y][x] = 'b';
  // tiny pixel text, three lines then a prompt (the cursor blinks after it)
  const lines: [number, string][] = [
    [6, 'iii.ii.iiii.ii'],
    [8, 'ii.iiii.ii.iii'],
    [10, 'iiii.iii.i.ii'],
  ];
  for (const [y, text] of lines) [...text].forEach((ch, n) => ch === 'i' && (g[y][10 + n] = 'i'));
  g[12][10] = 'i'; g[13][11] = 'i'; g[14][10] = 'i'; // the ">" prompt
  // D-pad (left) and face buttons (right)
  for (const [x, y] of [[4, 8], [4, 9], [4, 10], [4, 11], [4, 12], [2, 10], [3, 10], [5, 10], [6, 10]]) g[y][x] = 'i';
  for (const [x, y] of [[27, 8], [25, 10], [29, 10], [27, 12]]) g[y][x] = 'i';
  // start / select
  g[15][25] = 'i'; g[15][26] = 'i'; g[15][28] = 'i'; g[15][29] = 'i';
  return toRows(g);
}

/** A big cloud of overlapping soft dots resolving into a sphere, loose dots trailing off. */
function splatGrid(): string[] {
  const g = blank();
  let seed = 7;
  const rnd = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const cx = 15.5;
  const cy = 9.5;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const d = Math.hypot((x - cx) * 0.8, y - cy); // a touch wider than tall
      if (d <= 7) g[y][x] = 'c'; // the resolved core
      else if (d <= 10.5) g[y][x] = (x + y) % 2 === 0 ? 'c' : rnd() > 0.55 ? 'c' : 'b'; // soft rim
      else if (rnd() < Math.max(0, 0.34 - (d - 10.5) * 0.028)) g[y][x] = 'c'; // loose dots, off the edges
    }
  }
  // soft highlights on the upper-left of the core, a few dark gaps lower-right
  for (const [x, y] of [[11, 5], [12, 4], [13, 5], [10, 7], [14, 6], [12, 8], [17, 5]]) if (g[y][x] === 'c') g[y][x] = 'i';
  for (const [x, y] of [[19, 11], [17, 13], [20, 9], [15, 14]]) if (g[y][x] === 'c') g[y][x] = 'b';
  return toRows(g);
}

export const ART: Record<string, Art> = {
  psp: { colour: 'var(--viz-violet)', grid: pspGrid(), cursor: [13, 12, 2, 3] },
  splat: { colour: 'var(--viz-amber)', grid: splatGrid() },
};

export const FALLBACK: Art = { colour: 'var(--viz-jade)', grid: [] };

/** One <rect> per horizontal run of the same character. */
function runs(grid: string[]) {
  const out: { x: number; y: number; w: number; ch: string }[] = [];
  grid.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      let w = 1;
      while (x + w < row.length && row[x + w] === ch) w++;
      if (ch !== '.') out.push({ x, y, w, ch });
      x += w;
    }
  });
  return out;
}

const FILL: Record<string, string> = { c: styles.pc, i: styles.pi, b: styles.pb };

export const getArt = (key: string): Art => ART[key] ?? FALLBACK;

/** The scene as an SVG. `cursor` draws the blinking prompt cursor (cards only). */
export function ArtSvg({
  art,
  className,
  cursor = false,
}: {
  art: Art;
  className?: string;
  cursor?: boolean;
}) {
  return (
    <svg
      className={className}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      {runs(art.grid).map((r) => (
        <rect key={`${r.y}-${r.x}`} x={r.x} y={r.y} width={r.w} height={1} className={FILL[r.ch]} />
      ))}
      {cursor && art.cursor ? (
        <rect
          className={`${styles.pi} ${styles.cursor}`}
          x={art.cursor[0]}
          y={art.cursor[1]}
          width={art.cursor[2]}
          height={art.cursor[3]}
        />
      ) : null}
    </svg>
  );
}
