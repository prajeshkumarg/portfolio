'use client';

/*
 * PixelSpace — procedural "8-bit" pixel-art in the hero's right half, with no
 * frame: the canvas is transparent and sits directly on the hero ground, part
 * of the scene. Several distinct artworks cycle — every few seconds the current
 * scene cross-fades out and the next fades in, looping back to the first.
 *
 * Each scene is drawn procedurally on a tiny GRID×GRID canvas scaled up crisp.
 * A shared twinkling starfield sits behind every scene; the foreground changes.
 * Under prefers-reduced-motion it paints one scene and does not cycle or move.
 */

import { useEffect, useRef } from 'react';
import styles from './PixelSpace.module.css';

const GRID = 88; // logical pixels across — the "bit" resolution
const HOLD = 2600; // ms each scene is shown
const FADE = 700; // ms cross-fade between scenes

const C = {
  star: '#e3e2da',
  starDim: '#8aa89c',
  jade: '#9fc7b8',
  jadeShade: '#5f8f7e',
  jadeLite: '#cfe6dc',
  bone: '#e3e2da',
  rust: '#c58a6d', // a warm pixel for rocket flame / a red planet accent
};

type Px = (x: number, y: number, c: string) => void;

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

    const px: Px = (x, y, c) => {
      ctx.fillStyle = c;
      ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
    };
    const disc = (cx: number, cy: number, r: number, c: string, shade?: string) => {
      for (let y = -r; y <= r; y++)
        for (let x = -r; x <= r; x++)
          if (x * x + y * y <= r * r) px(cx + x, cy + y, shade && x + y > r * 0.4 ? shade : c);
    };
    const ellipse = (cx: number, cy: number, rx: number, ry: number, c: string, from = 0, to = Math.PI * 2) => {
      for (let a = from; a < to; a += 0.05) px(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, c);
    };

    // shared starfield
    const stars = Array.from({ length: 48 }, () => ({
      x: Math.floor(rng() * GRID),
      y: Math.floor(rng() * GRID),
      period: 1400 + rng() * 2600,
      phase: rng() * Math.PI * 2,
      bright: rng() > 0.72,
    }));
    const drawStars = (t: number) => {
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

    // ---- the scenes (each paints its foreground; stars drawn first) ----
    const C2 = GRID / 2;

    const sceneRingedPlanet = (t: number) => {
      const cx = Math.round(GRID * 0.56), cy = C2;
      ellipse(cx, cy, 25, 25 * 0.34, C.jadeLite); // back ring
      disc(cx, cy, 17, C.jade, C.jadeShade);
      ellipse(cx, cy, 25, 25 * 0.34, C.jadeLite, 0, Math.PI); // front ring
      const a = reduced ? -0.7 : t / 2600;
      disc(cx + Math.cos(a) * 31, cy + Math.sin(a) * 15, 3, C.bone); // moon
    };

    const sceneRocket = (t: number) => {
      // a rocket flying up-right across the field, flame flickering
      const prog = reduced ? 0.5 : ((t / 40) % (GRID + 40)) / (GRID + 40);
      const x = Math.round(10 + prog * (GRID - 20));
      const y = Math.round(GRID - 14 - prog * (GRID - 28));
      // body (diagonal capsule)
      for (let i = 0; i < 9; i++) px(x + i, y - i, C.bone);
      for (let i = 2; i < 8; i++) px(x + i, y - i + 1, C.jade);
      px(x + 9, y - 9, C.jadeLite); // nose
      // fins
      px(x, y + 1, C.jadeShade);
      px(x + 1, y - 2, C.jadeShade);
      // flame
      if (reduced || Math.sin(t / 90) > 0) {
        px(x - 1, y + 1, C.rust);
        px(x - 2, y + 2, C.star);
      }
    };

    const sceneComet = (t: number) => {
      // a crescent moon with a comet streaking past
      const mx = Math.round(GRID * 0.58), my = C2;
      disc(mx, my, 16, C.jade, C.jadeShade);
      disc(mx + 7, my - 4, 15, 'rgba(0,0,0,0)'); // (no cut; keep simple crescent via overlay below)
      // crescent: redraw a ground-coloured disc offset to carve it — use transparent clear
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      disc(mx + 8, my - 3, 15, '#000');
      ctx.restore();
      // comet
      const prog = reduced ? 0.4 : ((t / 24) % (GRID + 30)) / (GRID + 30);
      const cxp = Math.round(GRID - prog * (GRID + 30));
      const cyp = Math.round(18 + prog * 20);
      for (let i = 0; i < 10; i++) px(cxp + i, cyp - Math.round(i * 0.5), i < 3 ? C.bone : C.jadeLite);
      px(cxp, cyp, C.star);
    };

    const sceneSystem = (t: number) => {
      // a little sun with two orbiting planets
      disc(C2, C2, 6, C.jadeLite, C.jade);
      const o1 = reduced ? 0.4 : t / 1800;
      const o2 = reduced ? 2.1 : -t / 2800;
      ellipse(C2, C2, 18, 18, C.jadeShade); // faint orbit
      ellipse(C2, C2, 30, 30, C.jadeShade);
      disc(C2 + Math.cos(o1) * 18, C2 + Math.sin(o1) * 18, 3, C.bone);
      disc(C2 + Math.cos(o2) * 30, C2 + Math.sin(o2) * 30, 4, C.jade, C.jadeShade);
    };

    const scenes = [sceneRingedPlanet, sceneRocket, sceneComet, sceneSystem];

    // ---- cycle + cross-fade ----
    const t0 = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      const t = now - t0;
      ctx.clearRect(0, 0, GRID, GRID); // transparent — no frame

      if (reduced) {
        drawStars(t);
        scenes[0](t);
        return; // one static frame
      }

      const cycle = HOLD + FADE;
      const total = now; // continuous
      const idx = Math.floor(total / cycle) % scenes.length;
      const nextIdx = (idx + 1) % scenes.length;
      const inCycle = total % cycle;

      drawStars(t);

      if (inCycle < HOLD) {
        // steady show of current scene
        ctx.globalAlpha = 1;
        scenes[idx](t);
      } else {
        // cross-fade current → next
        const k = (inCycle - HOLD) / FADE; // 0..1
        ctx.globalAlpha = 1 - k;
        scenes[idx](t);
        ctx.globalAlpha = k;
        scenes[nextIdx](t);
        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(frame);
    };

    if (reduced) {
      frame(performance.now());
    } else {
      raf = requestAnimationFrame(frame);
    }

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
