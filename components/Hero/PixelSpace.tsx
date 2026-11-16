'use client';

/*
 * PixelSpace — a procedurally drawn retro "8/16-bit" space scene for the hero's
 * right half. No API, no external image: everything is painted as hard pixel
 * blocks on a tiny canvas (GRID×GRID logical pixels) and scaled up with
 * image-rendering: pixelated, so it reads as true pixel art.
 *
 * The scene: a twinkling starfield, a ringed planet, an orbiting moon, and a
 * drifting little craft — all in the green-black / jade / bone palette. One
 * rAF loop drives the twinkle and the orbit. Under prefers-reduced-motion it
 * paints a single static frame and stops.
 */

import { useEffect, useRef } from 'react';
import styles from './PixelSpace.module.css';

const GRID = 84; // logical pixels across — the "bit" resolution

// palette (green-black ground, bone, jade accent + two jade tints)
const C = {
  bg: '#11201b',
  star: '#e3e2da',
  starDim: '#8aa89c',
  planet: '#9fc7b8',
  planetShade: '#5f8f7e',
  ring: '#cfe6dc',
  moon: '#e3e2da',
  craft: '#9fc7b8',
};

type Star = { x: number; y: number; period: number; phase: number; bright: boolean };

export default function PixelSpace() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = GRID;
    canvas.height = GRID;
    ctx.imageSmoothingEnabled = false;

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    // deterministic star field so SSR/CSR agree in feel and it is stable
    const rng = mulberry32(20261116);
    const stars: Star[] = Array.from({ length: 46 }, () => ({
      x: Math.floor(rng() * GRID),
      y: Math.floor(rng() * GRID),
      period: 1400 + rng() * 2600,
      phase: rng() * Math.PI * 2,
      bright: rng() > 0.7,
    }));

    const px = (x: number, y: number, color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
    };

    // a filled disc in pixels
    const disc = (cx: number, cy: number, r: number, color: string, shade?: string) => {
      for (let y = -r; y <= r; y++) {
        for (let x = -r; x <= r; x++) {
          if (x * x + y * y <= r * r) {
            // simple shade: lower-right half darker
            const c = shade && x + y > r * 0.4 ? shade : color;
            px(cx + x, cy + y, c);
          }
        }
      }
    };

    // an elliptical ring outline (planet rings)
    const ring = (cx: number, cy: number, rx: number, ry: number, color: string) => {
      for (let a = 0; a < Math.PI * 2; a += 0.06) {
        px(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, color);
      }
    };

    const planet = { x: Math.round(GRID * 0.56), y: Math.round(GRID * 0.5), r: 16 };

    const draw = (t: number) => {
      // ground
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, GRID, GRID);

      // stars (twinkle = on/off by a sine on each star's own period)
      for (const s of stars) {
        const tw = reduced ? 1 : 0.5 + 0.5 * Math.sin(t / s.period + s.phase);
        if (tw > 0.35) px(s.x, s.y, s.bright ? C.star : C.starDim);
        if (s.bright && tw > 0.8) {
          // a little + sparkle for the brightest
          px(s.x + 1, s.y, C.starDim);
          px(s.x - 1, s.y, C.starDim);
          px(s.x, s.y + 1, C.starDim);
          px(s.x, s.y - 1, C.starDim);
        }
      }

      // planet rings behind + front halves
      ring(planet.x, planet.y, planet.r + 9, (planet.r + 9) * 0.34, C.ring);

      // the planet
      disc(planet.x, planet.y, planet.r, C.planet, C.planetShade);

      // front arc of the ring, drawn over the planet's lower half
      ctx.save();
      for (let a = 0; a < Math.PI; a += 0.05) {
        const rx = planet.r + 9;
        const ry = rx * 0.34;
        px(planet.x + Math.cos(a) * rx, planet.y + Math.sin(a) * ry, C.ring);
      }
      ctx.restore();

      // orbiting moon
      const orbitR = 30;
      const ang = reduced ? -0.7 : t / 2600;
      const mx = planet.x + Math.cos(ang) * orbitR;
      const my = planet.y + Math.sin(ang) * orbitR * 0.5;
      disc(mx, my, 3, C.moon);

      // a tiny drifting craft, upper-left, bobbing
      const cx = 16 + (reduced ? 0 : Math.sin(t / 1800) * 2);
      const cy = 18 + (reduced ? 0 : Math.cos(t / 1500) * 2);
      // body
      px(cx, cy, C.craft);
      px(cx + 1, cy, C.craft);
      px(cx + 2, cy, C.craft);
      px(cx + 1, cy - 1, C.craft);
      px(cx + 1, cy + 1, C.craft);
      // thruster flicker
      if (!reduced && Math.sin(t / 120) > 0) px(cx - 1, cy, C.star);
    };

    let raf = 0;
    if (reduced) {
      draw(0);
    } else {
      const loop = (t: number) => {
        draw(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className={styles.frame} aria-hidden="true">
      <canvas ref={ref} className={styles.canvas} />
      <span className={styles.scan} />
      <p className={styles.tag}>deep field — 8-bit</p>
    </div>
  );
}

/* small seeded PRNG so the starfield is stable across renders */
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
