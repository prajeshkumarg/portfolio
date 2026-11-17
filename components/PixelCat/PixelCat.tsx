'use client';

/*
 * PixelCat — a neon-blue pixel cat that plays in the right margin and travels
 * DOWN the page as you scroll, settling beside whatever section you are
 * reading. It sits fixed to the viewport's right edge; its vertical position
 * eases toward where you have scrolled, and it animates (tail flick, blink,
 * occasional pounce wiggle) while idle.
 *
 * Pure canvas sprite, no library. Hidden under prefers-reduced-motion and on
 * narrow screens (it needs the right margin). Decorative, so aria-hidden.
 */

import { useEffect, useRef } from 'react';
import styles from './PixelCat.module.css';

const NEON = '#5bd6ff'; // neon blue
const NEON_DK = '#2aa3d6';
const EYE = '#0d1412';
const W = 24; // sprite grid
const H = 18;

// the cat sprite as rows of pixels — 'x' body, 'o' eye, '.' empty
// a simple sitting cat with ears and a tail (tail is animated separately)
const SPRITE = [
  '....x........x..........',
  '....xx......xx..........',
  '....xxx....xxx..........',
  '....xxxxxxxxxxx.........',
  '...xxxxxxxxxxxxx........',
  '...xxoxxxxxxxoxx........',
  '...xxxxxxxxxxxxx........',
  '...xxxxxxxxxxxxx........',
  '...xxxxxxxxxxxxx........',
  '..xxxxxxxxxxxxxxx.......',
  '..xxxxxxxxxxxxxxx.......',
  '..xxxxxxxxxxxxxxx.......',
  '..xxxxxxxxxxxxxxx.......',
  '..xxxxxxxxxxxxxxx.......',
  '..xxxxxxxxxxxxxxx.......',
  '..xx..xxxxxxx..xx.......',
  '..xx..xxxxxxx..xx.......',
  '........................',
];

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
    canvas.width = W * scale;
    canvas.height = (H + 4) * scale; // headroom for the tail
    ctx.imageSmoothingEnabled = false;

    let y = window.scrollY; // current eased top position (document coords proxy)
    let raf = 0;

    const drawCat = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const blink = Math.sin(t / 1400) > 0.93; // occasional blink
      const bob = Math.round(Math.sin(t / 600) * 1); // gentle idle bob

      for (let r = 0; r < SPRITE.length; r++) {
        for (let c = 0; c < SPRITE[r].length; c++) {
          const ch = SPRITE[r][c];
          if (ch === '.') continue;
          let col = NEON;
          if (ch === 'o') col = blink ? NEON : EYE;
          // shade the lower body a touch
          if (r > 12 && ch === 'x') col = NEON_DK;
          ctx.fillStyle = col;
          ctx.fillRect(c * scale, (r + 2 + bob) * scale, scale, scale);
        }
      }
      // animated tail: a curl on the right that flicks
      const flick = Math.sin(t / 420) * 3;
      ctx.fillStyle = NEON;
      for (let i = 0; i < 6; i++) {
        const tx = (16 + i) * scale;
        const ty = (13 - i + Math.round((flick * i) / 6) + bob) * scale;
        ctx.fillRect(tx, ty, scale, scale);
      }
    };

    const loop = (t: number) => {
      // ease the cat toward the current scroll position so it follows down
      const target = window.scrollY;
      y += (target - y) * 0.06;
      // place it vertically centred in the viewport, nudged by how far we are
      // between the eased position and the live scroll (a little lag = "chasing")
      const lag = target - y; // positive when scrolling down
      const vhCentre = window.innerHeight * 0.5;
      const offset = Math.max(-120, Math.min(120, lag * 0.6));
      canvas.style.top = `${vhCentre - canvas.height / 2 + offset}px`;
      drawCat(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={ref} className={styles.cat} aria-hidden="true" />;
}
