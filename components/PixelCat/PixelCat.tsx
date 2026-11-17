'use client';

/*
 * PixelCat — a neon-blue side-view pixel cat, in the spirit of vscode-pets:
 * a small profile cat that WALKS (a two-frame leg cycle, upright tail, ears,
 * a face) along the right margin, following the page scroll, and SITS when the
 * page is still. It faces its direction of travel.
 *
 * Pure canvas sprite, no library. Hidden under prefers-reduced-motion and on
 * narrow screens. Decorative, so aria-hidden.
 */

import { useEffect, useRef } from 'react';
import styles from './PixelCat.module.css';

const BODY = '#5bd6ff'; // neon blue
const DARK = '#2aa3d6'; // shaded blue
const EYE = '#0d1412';
const _ = null; // empty pixel

// Side-view sprites on a 22x14 grid. Colours: B body, D dark, E eye.
// Three poses: walkA, walkB (legs swapped), sit.
type Row = string;
const WALK_A: Row[] = [
  '..............B.......',
  '....BB.......BB.......',
  '...BEB......BBB.......',
  '...BBBBBBBBBBBB.......',
  '..BBBBBBBBBBBBBB......',
  '..BBBBBBBBBBBBBBB.....',
  '..BBBBBBBBBBBBBBB.....',
  '..BBBBBBBBBBBBBBB.....',
  '..DBBBBBBBBBBBBBD.....',
  '...D..BB....BB..D.....',
  '...D..BB....BB........',
  '......BB....BB...D....',
  '.....B.......B...D....',
  '.....................',
];
const WALK_B: Row[] = [
  '..............B.......',
  '....BB.......BB.......',
  '...BEB......BBB.......',
  '...BBBBBBBBBBBB.......',
  '..BBBBBBBBBBBBBB......',
  '..BBBBBBBBBBBBBBB.....',
  '..BBBBBBBBBBBBBBB.....',
  '..BBBBBBBBBBBBBBB.....',
  '..DBBBBBBBBBBBBBD.....',
  '....D.BB....BB.D......',
  '......BB....BB..D.....',
  '.....BB......BB.......',
  '....B..........B.D....',
  '.....................',
];
const SIT: Row[] = [
  '..............BB......',
  '....BB.......BBB......',
  '...BEB......BBBB......',
  '...BBBBBBBBBBBBB......',
  '..BBBBBBBBBBBBBBB.....',
  '..BBBBBBBBBBBBBBB.B...',
  '..BBBBBBBBBBBBBBB.B...',
  '..BBBBBBBBBBBBBBBB....',
  '..BBBBBBBBBBBBBBBB....',
  '..DBBBBBBBBBBBBBBD....',
  '..DBBBBBBBBBBBBBBD....',
  '..BBBBBBBBBBBBBBBB....',
  '...BB..........BB.....',
  '.....................',
];

const COL: Record<string, string> = { B: BODY, D: DARK, E: EYE };
const GW = 22;
const GH = 14;

export default function PixelCat() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      canvas.style.display = 'none';
      return;
    }
    const scale = 4;
    canvas.width = GW * scale;
    canvas.height = GH * scale;
    ctx.imageSmoothingEnabled = false;

    const paint = (rows: Row[], flip: boolean) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      if (flip) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      for (let r = 0; r < rows.length; r++) {
        for (let c = 0; c < rows[r].length; c++) {
          const ch = rows[r][c];
          if (ch === '.') continue;
          ctx.fillStyle = COL[ch] ?? BODY;
          ctx.fillRect(c * scale, r * scale, scale, scale);
        }
      }
      ctx.restore();
    };

    let y = window.scrollY; // eased follow position
    let lastScroll = window.scrollY;
    let facingDown = true;
    let raf = 0;

    const loop = (t: number) => {
      const target = window.scrollY;
      const delta = target - y;
      y += delta * 0.07;

      const moving = Math.abs(delta) > 0.6;
      if (Math.abs(target - lastScroll) > 1) {
        facingDown = target > lastScroll; // face the way the page is going
        lastScroll = target;
      }

      // choose pose: walk cycle while moving, sit when still
      let rows: Row[];
      if (moving) {
        rows = Math.floor(t / 140) % 2 === 0 ? WALK_A : WALK_B;
      } else {
        rows = SIT;
      }
      // the cat walks vertically down the margin, so "facing down" tilts it;
      // we keep it upright (side view) but flip horizontally as a nod to
      // direction, and place it vertically by the eased scroll lag.
      paint(rows, !facingDown);

      const lag = target - y;
      const vhCentre = window.innerHeight * 0.5;
      const offset = Math.max(-140, Math.min(140, lag * 0.7));
      canvas.style.top = `${vhCentre - canvas.height / 2 + offset}px`;

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={ref} className={styles.cat} aria-hidden="true" />;
}
