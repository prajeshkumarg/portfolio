'use client';

/*
 * PixelSpace — procedural "8-bit" pixel-art in the hero's right half, frameless
 * (transparent canvas on the hero ground). Four artworks cycle, each holding a
 * few seconds and then cleanly cross-fading into the next, looping. A twinkling
 * starfield sits live behind every scene; the comet and rocket stay on-frame.
 * Under prefers-reduced-motion it paints one still scene and does not cycle.
 */

import { useEffect, useRef } from 'react';
import styles from './PixelSpace.module.css';

const GRID = 88; // logical pixels across — the "bit" resolution
const HOLD = 2600; // ms a scene holds before it changes
const FADE = 700; // ms of the cross-fade between scenes

const C = {
  star: '#e3e2da',
  starDim: '#8aa89c',
  jade: '#9fc7b8',
  jadeShade: '#5f8f7e',
  jadeLite: '#cfe6dc',
  bone: '#e3e2da',
  rust: '#c58a6d',
};

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
    const rng = mulberry32(20261116);

    // an offscreen buffer to render a scene's foreground into, so we can read
    // its pixels for the shuffle
    const buf = document.createElement('canvas');
    buf.width = GRID;
    buf.height = GRID;
    const bctx = buf.getContext('2d')!;
    bctx.imageSmoothingEnabled = false;

    const mk = (c: CanvasRenderingContext2D) => {
      const px = (x: number, y: number, col: string) => {
        c.fillStyle = col;
        c.fillRect(Math.round(x), Math.round(y), 1, 1);
      };
      const disc = (cx: number, cy: number, r: number, col: string, shade?: string) => {
        for (let y = -r; y <= r; y++)
          for (let x = -r; x <= r; x++)
            if (x * x + y * y <= r * r) px(cx + x, cy + y, shade && x + y > r * 0.4 ? shade : col);
      };
      const ellipse = (cx: number, cy: number, rx: number, ry: number, col: string, from = 0, to = Math.PI * 2) => {
        for (let a = from; a < to; a += 0.05) px(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, col);
      };
      return { px, disc, ellipse };
    };

    // ---- starfield (drawn live on the main canvas, behind everything) ----
    const stars = Array.from({ length: 48 }, () => ({
      x: Math.floor(rng() * GRID),
      y: Math.floor(rng() * GRID),
      period: 1400 + rng() * 2600,
      phase: rng() * Math.PI * 2,
      bright: rng() > 0.72,
    }));
    const drawStars = (t: number) => {
      const { px } = mk(ctx);
      for (const s of stars) {
        const tw = reduced ? 1 : 0.5 + 0.5 * Math.sin(t / s.period + s.phase);
        if (tw > 0.35) px(s.x, s.y, s.bright ? C.star : C.starDim);
        if (s.bright && tw > 0.82) {
          px(s.x + 1, s.y, C.starDim);
          px(s.x - 1, s.y, C.starDim);
          px(s.x, s.y + 1, C.starDim);
          px(s.x, s.y - 1, C.starDim);
        }
      }
    };

    // ---- scenes: draw a foreground into ctx `c` ----
    const C2 = GRID / 2;

    const sceneRingedPlanet = (c: CanvasRenderingContext2D, t: number) => {
      const { disc, ellipse, px } = mk(c);
      const cx = Math.round(GRID * 0.56), cy = C2;
      ellipse(cx, cy, 25, 25 * 0.34, C.jadeLite);
      disc(cx, cy, 17, C.jade, C.jadeShade);
      ellipse(cx, cy, 25, 25 * 0.34, C.jadeLite, 0, Math.PI);
      const a = reduced ? -0.7 : t / 2600;
      disc(cx + Math.cos(a) * 31, cy + Math.sin(a) * 15, 3, C.bone);
      void px;
    };

    const sceneRocket = (c: CanvasRenderingContext2D, t: number) => {
      const { px } = mk(c);
      // the rocket hovers near centre and bobs gently, staying fully on-frame
      const x = Math.round(C2 - 4 + (reduced ? 0 : Math.sin(t / 900) * 5));
      const y = Math.round(C2 + 6 + (reduced ? 0 : Math.cos(t / 1100) * 5));
      for (let i = 0; i < 9; i++) px(x + i, y - i, C.bone);
      for (let i = 2; i < 8; i++) px(x + i, y - i + 1, C.jade);
      px(x + 9, y - 9, C.jadeLite);
      px(x, y + 1, C.jadeShade);
      px(x + 1, y - 2, C.jadeShade);
      if (reduced || Math.sin(t / 90) > 0) {
        px(x - 1, y + 1, C.rust);
        px(x - 2, y + 2, C.star);
      }
    };

    const sceneComet = (c: CanvasRenderingContext2D, t: number) => {
      const { disc, px } = mk(c);
      const mx = Math.round(GRID * 0.58), my = C2;
      disc(mx, my, 16, C.jade, C.jadeShade);
      c.save();
      c.globalCompositeOperation = 'destination-out';
      disc(mx + 8, my - 3, 15, '#000');
      c.restore();
      // the comet orbits the moon on a contained elliptical path, so it never
      // flies off-frame — it sweeps around and comes back
      const a = reduced ? -0.6 : t / 1500;
      const cxp = Math.round(mx + Math.cos(a) * 30);
      const cyp = Math.round(my + Math.sin(a) * 22);
      // tail points along the direction of travel (tangent), staying on-canvas
      const tx = -Math.sin(a), ty = Math.cos(a);
      for (let i = 0; i < 9; i++) {
        const bx = Math.round(cxp - tx * i);
        const by = Math.round(cyp - ty * i);
        if (bx >= 0 && bx < GRID && by >= 0 && by < GRID) px(bx, by, i < 3 ? C.bone : C.jadeLite);
      }
      px(cxp, cyp, C.star);
    };

    const sceneSystem = (c: CanvasRenderingContext2D, t: number) => {
      const { disc, ellipse } = mk(c);
      disc(C2, C2, 6, C.jadeLite, C.jade);
      const o1 = reduced ? 0.4 : t / 1800;
      const o2 = reduced ? 2.1 : -t / 2800;
      ellipse(C2, C2, 18, 18, C.jadeShade);
      ellipse(C2, C2, 30, 30, C.jadeShade);
      disc(C2 + Math.cos(o1) * 18, C2 + Math.sin(o1) * 18, 3, C.bone);
      disc(C2 + Math.cos(o2) * 30, C2 + Math.sin(o2) * 30, 4, C.jade, C.jadeShade);
    };

    const scenes = [sceneRingedPlanet, sceneRocket, sceneComet, sceneSystem];

    // draw a scene into the offscreen buffer and blit it onto the main canvas
    // at a given alpha — a clean cross-fade, no scatter.
    const blitScene = (sceneIdx: number, t: number, alpha: number) => {
      if (alpha <= 0.01) return;
      bctx.clearRect(0, 0, GRID, GRID);
      scenes[sceneIdx](bctx, t);
      ctx.globalAlpha = alpha;
      ctx.drawImage(buf, 0, 0);
      ctx.globalAlpha = 1;
    };

    const t0 = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      const t = now - t0;
      ctx.clearRect(0, 0, GRID, GRID);
      drawStars(t);

      if (reduced) {
        scenes[0](ctx, t);
        return;
      }

      const cycle = HOLD + FADE;
      const idx = Math.floor(now / cycle) % scenes.length;
      const nextIdx = (idx + 1) % scenes.length;
      const inCycle = now % cycle;

      if (inCycle < HOLD) {
        scenes[idx](ctx, t);
      } else {
        // clean cross-fade: current fades out, next fades in
        const k = (inCycle - HOLD) / FADE; // 0..1
        blitScene(idx, t, 1 - k);
        blitScene(nextIdx, t, k);
      }

      raf = requestAnimationFrame(frame);
    };

    if (reduced) frame(performance.now());
    else raf = requestAnimationFrame(frame);

    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={ref} className={styles.canvas} aria-hidden="true" />;
}

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
