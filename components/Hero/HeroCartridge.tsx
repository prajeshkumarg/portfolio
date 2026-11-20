'use client';

/*
 * HeroCartridge — one "Building now" item drawn as a retro game cartridge: a
 * stepped-corner body whose top is a full-bleed coloured panel holding a 16×16
 * pixel illustration, then the project's name and one-line description below,
 * and a strip of contact pins along the bottom edge. The whole cartridge is the
 * link when `href` is set, otherwise a plain figure.
 *
 * Client only for the pointer: moving over a cartridge tilts it and shifts the
 * illustration (parallax) through the --tx / --ty CSS variables, and the lift +
 * drop shadow are CSS on hover. Nothing moves under reduced motion.
 *
 * To add a cartridge, add an item to `now` in content.ts and give its `art` key an
 * entry in ART below: a label colour (a --viz-* token) and a 16×16 grid, where
 * `c` = the label colour, `i` = ink, `b` = background, `.` = empty. Unknown keys
 * fall back to the jade label with an empty frame.
 */

import { useRef } from 'react';
import type { NowItem } from '@/types';
import styles from './HeroCartridge.module.css';

type Art = {
  /** The label colour: a --viz-* token reference. */
  colour: string;
  /** 16 rows of 16 characters. */
  grid: string[];
  /** Optional blinking cursor rect on the grid (x, y, w, h). */
  cursor?: [number, number, number, number];
};

const ART: Record<string, Art> = {
  // a PSP-3000 in silhouette: D-pad left, buttons right, a ">" prompt on the screen
  psp: {
    colour: 'var(--viz-violet)',
    grid: [
      '................',
      '................',
      '................',
      '................',
      '.cccccccccccccc.',
      'cccbbbbbbbbbbccc',
      'cicbibbbbbbbbcic',
      'iiibbibbbbbbbccc',
      'cicbibbbbbbbbcic',
      'cccbbbbbbbbbbccc',
      'cccbbbbbbbbbbccc',
      '.cccccccccccccc.',
      '................',
      '................',
      '................',
      '................',
    ],
    cursor: [7, 6, 2, 3],
  },
  // a rough sphere of soft, overlapping dots
  splat: {
    colour: 'var(--viz-amber)',
    grid: [
      '................',
      '.......cb.......',
      '....cbcbcbcb.c..',
      '.c.cbcbcbcbcb...',
      '..cbcbiccccbcb..',
      '..bcbiccccccbc..',
      '..cbcccicicccb..',
      '.cbcccccccccbcb.',
      '.bcbiccccccccbc.',
      '..bcccccicccbc..',
      '..cbcccccccbcb..',
      '..bcbcccccbcbc..',
      '...bcbcbcbcbc.c.',
      '..c.bcbcbcbc....',
      '.......bc.......',
      '................',
    ],
  },
};

const FALLBACK: Art = { colour: 'var(--viz-jade)', grid: [] };

const PINS = 12;

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

export default function HeroCartridge({ item }: { item: NowItem }) {
  const art = ART[item.art] ?? FALLBACK;
  const ref = useRef<HTMLElement | null>(null);

  // pointer position over the cartridge, -0.5..0.5 on each axis, as CSS vars
  const track = (e: React.PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--tx', String((e.clientX - r.left) / r.width - 0.5));
    el.style.setProperty('--ty', String((e.clientY - r.top) / r.height - 0.5));
  };
  const rest = () => {
    ref.current?.style.setProperty('--tx', '0');
    ref.current?.style.setProperty('--ty', '0');
  };
  const pointer = { onPointerMove: track, onPointerLeave: rest };

  const body = (
    <span className={styles.tilt}>
    <span className={styles.body}>
      <span className={styles.label}>
        <svg
          className={styles.art}
          viewBox="0 0 16 16"
          shapeRendering="crispEdges"
          aria-hidden="true"
          focusable="false"
        >
          {runs(art.grid).map((r) => (
            <rect key={`${r.y}-${r.x}`} x={r.x} y={r.y} width={r.w} height={1} className={FILL[r.ch]} />
          ))}
          {art.cursor ? (
            <rect
              className={`${styles.pi} ${styles.cursor}`}
              x={art.cursor[0]}
              y={art.cursor[1]}
              width={art.cursor[2]}
              height={art.cursor[3]}
            />
          ) : null}
        </svg>
      </span>

      <span className={styles.text}>
        <span className={styles.name}>{item.name}</span>
        <span className={styles.line}>{item.line}</span>
      </span>

      <span className={styles.pins} aria-hidden="true">
        {Array.from({ length: PINS }, (_, n) => (
          <span key={n} />
        ))}
      </span>
    </span>
    </span>
  );

  const style = { '--label': art.colour } as React.CSSProperties;

  return item.href ? (
    <a
      ref={ref as React.RefObject<HTMLAnchorElement>}
      className={styles.cart}
      href={item.href}
      target="_blank"
      rel="noreferrer"
      style={style}
      {...pointer}
    >
      {body}
    </a>
  ) : (
    <figure ref={ref} className={styles.cart} style={style} {...pointer}>
      {body}
    </figure>
  );
}
