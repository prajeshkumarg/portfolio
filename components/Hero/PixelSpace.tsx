'use client';

/*
 * PixelSpace — the hero's pixel-art space, in two layers:
 *
 *   1. a scattered starfield across the WHOLE hero, denser toward the galaxy
 *      (right side) and thinning out everywhere else, kept clear of the text;
 *   2. the GALAXY scene in the right half — a slowly turning spiral Milky-Way
 *      (a bright core with two curved arms of stars), same pixel style and
 *      same spot where the planet used to be. No planet, no comet.
 *
 * Both are transparent and frameless on the hero ground. Reduced motion holds
 * everything still.
 */

import { useEffect, useRef } from 'react';
import styles from './PixelSpace.module.css';

const SCENE = 96; // scene canvas resolution

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
  const galaxyRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<HTMLCanvasElement>(null);

  // ---- background starfield across the whole hero ----
  useEffect(() => {
    const canvas = galaxyRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rng = mulberry32(99173);

    const GW = 160;
    const GH = 84;
    canvas.width = GW;
    canvas.height = GH;
    ctx.imageSmoothingEnabled = false;

    // stars thin out gradually with distance from the galaxy (right side)
    const cxG = GW * 0.8;
    const cyG = GH * 0.5;
    const maxD = Math.hypot(GW, GH);

    // keep stars off the text
    const EXCLUDE = [
      { x0: 0.0, y0: 0.08, x1: 0.5, y1: 0.72 },
      { x0: 0.0, y0: 0.0, x1: 0.12, y1: 0.1 },
      { x0: 0.82, y0: 0.0, x1: 1.0, y1: 0.1 },
      { x0: 0.0, y0: 0.82, x1: 0.42, y1: 1.0 },
      { x0: 0.78, y0: 0.82, x1: 1.0, y1: 1.0 },
    ];
    const inText = (x: number, y: number) => {
      const nx = x / GW, ny = y / GH;
      return EXCLUDE.some((r) => nx >= r.x0 && nx <= r.x1 && ny >= r.y0 && ny <= r.y1);
    };

    type Star = { x: number; y: number; period: number; phase: number; bright: boolean; blink: boolean };
    const stars: Star[] = [];
    for (let i = 0; i < 520; i++) {
      const x = Math.floor(rng() * GW);
      const y = Math.floor(rng() * GH);
      if (inText(x, y)) continue;
      const d = Math.hypot(x - cxG, y - cyG) / maxD;
      const keep = Math.max(0.03, Math.pow(1 - d, 2.2));
      if (rng() > keep) continue;
      stars.push({
        x, y,
        period: 1400 + rng() * 2800,
        phase: rng() * Math.PI * 2,
        bright: rng() > 0.84,
        blink: false,
      });
    }
    for (let i = 0; i < 10; i++) {
      let x = Math.floor(rng() * GW), y = Math.floor(rng() * GH), tries = 0;
      while (inText(x, y) && tries++ < 8) {
        x = Math.floor(rng() * GW);
        y = Math.floor(rng() * GH);
      }
      stars.push({
        x, y,
        period: 2600 + rng() * 3200,
        phase: rng() * Math.PI * 2,
        bright: rng() > 0.5,
        blink: true,
      });
    }

    const px = (x: number, y: number, col: string) => {
      ctx.fillStyle = col;
      ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, GW, GH);
      for (const s of stars) {
        const tw = reduced ? 1 : 0.5 + 0.5 * Math.sin(t / s.period + s.phase);
        if (s.blink) {
          if (tw < 0.12 && !reduced) {
            let nx = Math.floor(rng() * GW), ny = Math.floor(rng() * GH), tries = 0;
            while (inText(nx, ny) && tries++ < 8) {
              nx = Math.floor(rng() * GW);
              ny = Math.floor(rng() * GH);
            }
            s.x = nx;
            s.y = ny;
            s.bright = rng() > 0.5;
          }
          if (tw > 0.72) px(s.x, s.y, s.bright ? C.star : C.starDim);
          continue;
        }
        if (tw > 0.42) px(s.x, s.y, s.bright ? C.star : C.starDim);
        if (s.bright && tw > 0.85) {
          px(s.x + 1, s.y, C.starDim);
          px(s.x - 1, s.y, C.starDim);
          px(s.x, s.y + 1, C.starDim);
          px(s.x, s.y - 1, C.starDim);
        }
      }
    };

    let raf = 0;
    if (reduced) {
      draw(0);
    } else {
      const loop = (now: number) => {
        draw(now);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(raf);
  }, []);

  // ---- the scene: cycles through space artworks in the right half ----
  useEffect(() => {
    const canvas = sceneRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = SCENE;
    canvas.height = SCENE;
    ctx.imageSmoothingEnabled = false;

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const C2 = SCENE / 2;

    const HOLD = 2800;
    const FADE = 700;

    const buf = document.createElement('canvas');
    buf.width = SCENE;
    buf.height = SCENE;
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
      const ellipse = (cx: number, cy: number, rx: number, ry: number, col: string, from = 0, to = Math.PI * 2, step = 0.05) => {
        for (let a = from; a < to; a += step) px(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, col);
      };
      return { px, disc, ellipse };
    };

    // 1. the Interstellar black hole
    const sceneBlackHole = (c: CanvasRenderingContext2D, t: number) => {
      const { px, disc, ellipse } = mk(c);
      const RX = 34, RY = 11, EH = 11, TILT = -0.26, DISC_DY = -4;
      const spin = reduced ? 0 : t / 650;
      c.save();
      c.translate(C2, C2);
      c.rotate(TILT);
      c.translate(-C2, -C2);
      const dring = (rx: number, ry: number, col: string, from: number, to: number, step = 0.035) => {
        for (let a = from; a < to; a += step) px(C2 + Math.cos(a) * rx, C2 + DISC_DY + Math.sin(a) * ry, col);
      };
      dring(RX, RY, C.jadeShade, Math.PI, Math.PI * 2);
      dring(RX - 4, RY - 2, C.jade, Math.PI, Math.PI * 2);
      const topR = EH + 9;
      for (let a = Math.PI; a < Math.PI * 2; a += 0.03) {
        const x = C2 + Math.cos(a) * topR;
        const y = C2 + DISC_DY - 2 + Math.sin(a) * (topR * 0.92);
        const crown = Math.sin(a) < -0.45;
        px(x, y, crown ? C.bone : C.jadeLite);
        if (crown) px(x, y - 1, C.jadeLite);
      }
      for (let a = 0; a < Math.PI; a += 0.03) {
        const x = C2 + Math.cos(a) * (EH + 7);
        const y = C2 + DISC_DY + 2 + Math.sin(a) * ((EH + 7) * 0.9);
        px(x, y, Math.sin(a) > 0.5 ? C.bone : C.jadeLite);
      }
      ellipse(C2, C2 + DISC_DY, EH + 3, EH + 3, C.bone);
      ellipse(C2, C2 + DISC_DY, EH + 2, EH + 2, C.jadeLite);
      disc(C2, C2 + DISC_DY, EH, '#05080a');
      ellipse(C2, C2 + DISC_DY, EH + 1, EH + 1, C.bone);
      dring(RX, RY, C.jade, 0, Math.PI);
      dring(RX - 4, RY - 2, C.jadeLite, 0, Math.PI);
      dring(RX - 1, RY - 1, C.bone, 0.15, Math.PI - 0.15, 0.05);
      for (let i = 0; i < 5; i++) {
        const a = spin * (1 + i * 0.25) + (i * Math.PI * 2) / 5;
        const r = RX - 2 - i * 2.4;
        px(C2 + Math.cos(a) * r, C2 + DISC_DY + Math.sin(a) * (r * (RY / RX)), C.bone);
      }
      c.restore();
    };

    // 2. ringed planet with a moon
    const sceneRingedPlanet = (c: CanvasRenderingContext2D, t: number) => {
      const { disc, ellipse } = mk(c);
      const cx = Math.round(SCENE * 0.54), cy = C2;
      ellipse(cx, cy, 25, 25 * 0.34, C.jadeLite);
      disc(cx, cy, 17, C.jade, C.jadeShade);
      ellipse(cx, cy, 25, 25 * 0.34, C.jadeLite, 0, Math.PI);
      const a = reduced ? -0.7 : t / 2600;
      disc(cx + Math.cos(a) * 31, cy + Math.sin(a) * 15, 3, C.bone);
    };

    // 3. a rocket hovering
    const sceneRocket = (c: CanvasRenderingContext2D, t: number) => {
      const { px } = mk(c);
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

    // 4. crescent moon + orbiting comet
    const sceneComet = (c: CanvasRenderingContext2D, t: number) => {
      const { disc, px } = mk(c);
      const mx = Math.round(SCENE * 0.54), my = C2;
      disc(mx, my, 16, C.jade, C.jadeShade);
      c.save();
      c.globalCompositeOperation = 'destination-out';
      disc(mx + 8, my - 3, 15, '#000');
      c.restore();
      const a = reduced ? -0.6 : t / 1500;
      const cxp = Math.round(mx + Math.cos(a) * 30);
      const cyp = Math.round(my + Math.sin(a) * 22);
      const tx = -Math.sin(a), ty = Math.cos(a);
      for (let i = 0; i < 9; i++) {
        const bx = Math.round(cxp - tx * i), by = Math.round(cyp - ty * i);
        if (bx >= 0 && bx < SCENE && by >= 0 && by < SCENE) px(bx, by, i < 3 ? C.bone : C.jadeLite);
      }
      px(cxp, cyp, C.star);
    };

    // 5. a mini solar system
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

    const scenes = [sceneBlackHole, sceneRingedPlanet, sceneRocket, sceneComet, sceneSystem];

    const blitScene = (idx: number, t: number, alpha: number) => {
      if (alpha <= 0.01) return;
      bctx.clearRect(0, 0, SCENE, SCENE);
      scenes[idx](bctx, t);
      ctx.globalAlpha = alpha;
      ctx.drawImage(buf, 0, 0);
      ctx.globalAlpha = 1;
    };

    let raf = 0;
    const frame = (now: number) => {
      ctx.clearRect(0, 0, SCENE, SCENE);
      if (reduced) {
        scenes[0](ctx, now);
        return;
      }
      const cycle = HOLD + FADE;
      const idx = Math.floor(now / cycle) % scenes.length;
      const nextIdx = (idx + 1) % scenes.length;
      const inCycle = now % cycle;
      if (inCycle < HOLD) {
        scenes[idx](ctx, now);
      } else {
        const k = (inCycle - HOLD) / FADE;
        blitScene(idx, now, 1 - k);
        blitScene(nextIdx, now, k);
      }
      raf = requestAnimationFrame(frame);
    };
    if (reduced) frame(performance.now());
    else raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <canvas ref={galaxyRef} className={styles.galaxy} aria-hidden="true" />
      <canvas ref={sceneRef} className={styles.canvas} aria-hidden="true" />
    </>
  );
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
