'use client';

/*
 * PixelSpace — the hero's pixel-art space, in two layers:
 *
 *   1. a GALAXY starfield that spans the WHOLE hero (behind the name, nav and
 *      everything) — many twinkling stars spread across, plus one or two slow
 *      drifting "motes" that pass over the name and nav;
 *   2. the ringed-planet scene canvas in the RIGHT half, same pixel style and
 *      same spot as before, cycling its four artworks with a clean cross-fade.
 *
 * Both are transparent and frameless on the hero ground. Under
 * prefers-reduced-motion the galaxy holds still and the scene shows one frame.
 */

import { useEffect, useRef } from 'react';
import styles from './PixelSpace.module.css';

const SCENE = 88; // scene canvas resolution (unchanged — keeps the planet style)
const HOLD = 2600;
const FADE = 700;

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

  // ---- galaxy: full-hero starfield + a couple of drifting motes ----
  useEffect(() => {
    const canvas = galaxyRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rng = mulberry32(99173);

    // Higher-res so the nebula haze is smooth; stretched over the whole hero.
    const GW = 320;
    const GH = 170;
    canvas.width = GW;
    canvas.height = GH;

    // the Milky-Way band: a diagonal axis crossing the field, with a bright
    // core near the planet (right side). Stars and haze gather along this axis.
    const core = { x: GW * 0.78, y: GH * 0.42 };
    const ang = -0.42; // band tilt (radians), rising to the right
    const ax = Math.cos(ang), ay = Math.sin(ang);
    const bandDist = (x: number, y: number) => {
      const dx = x - core.x, dy = y - core.y;
      return Math.abs(dx * -ay + dy * ax); // perpendicular to the band axis
    };
    const alongDist = (x: number, y: number) => {
      const dx = x - core.x, dy = y - core.y;
      return dx * ax + dy * ay; // along the band axis
    };

    // ---- stars: clustered along the band, denser toward the core ----
    // Exclusion zones (in 0..1 of GW/GH) where text lives — no stars there, so
    // nothing sits on the name, nav, monogram or the foot row.
    const EXCLUDE = [
      { x0: 0.0, y0: 0.08, x1: 0.5, y1: 0.72 }, // the big name block (left)
      { x0: 0.0, y0: 0.0, x1: 0.12, y1: 0.1 }, // monogram top-left
      { x0: 0.82, y0: 0.0, x1: 1.0, y1: 0.1 }, // nav top-right
      { x0: 0.0, y0: 0.82, x1: 0.42, y1: 1.0 }, // foot role line bottom-left
      { x0: 0.78, y0: 0.82, x1: 1.0, y1: 1.0 }, // the CTA bottom-right
    ];
    const inText = (x: number, y: number) => {
      const nx = x / GW, ny = y / GH;
      return EXCLUDE.some((r) => nx >= r.x0 && nx <= r.x1 && ny >= r.y0 && ny <= r.y1);
    };

    type Star = { x: number; y: number; period: number; phase: number; bright: boolean; blink: boolean };
    const stars: Star[] = [];
    const BAND = GH * 0.5;
    for (let i = 0; i < 1100; i++) {
      const x = rng() * GW;
      const y = rng() * GH;
      if (inText(x, y)) continue; // never over the text
      const perp = bandDist(x, y);
      const along = Math.abs(alongDist(x, y));
      const pBand = Math.exp(-(perp * perp) / (2 * (BAND * 0.42) ** 2));
      const pCore = Math.exp(-(along * along) / (2 * (GW * 0.5) ** 2));
      const keep = 0.04 + 0.96 * pBand * (0.45 + 0.55 * pCore);
      if (rng() > keep) continue;
      stars.push({
        x, y,
        period: 1400 + rng() * 2800,
        phase: rng() * Math.PI * 2,
        bright: rng() > 0.86,
        blink: false,
      });
    }
    for (let i = 0; i < 10; i++) {
      let x = rng() * GW, y = rng() * GH, tries = 0;
      while (inText(x, y) && tries++ < 8) {
        x = rng() * GW;
        y = rng() * GH;
      }
      stars.push({
        x, y,
        period: 2600 + rng() * 3200,
        phase: rng() * Math.PI * 2,
        bright: rng() > 0.5,
        blink: true,
      });
    }

    // soft drifting motes along the band
    const motes = [
      { x: GW * 0.6, y: GH * 0.55, vx: 0.06, vy: 0.06 * Math.tan(ang) },
      { x: GW * 0.4, y: GH * 0.66, vx: 0.045, vy: 0.045 * Math.tan(ang) },
    ];

    // paint the nebula haze once into an offscreen buffer (static glow)
    const haze = document.createElement('canvas');
    haze.width = GW;
    haze.height = GH;
    const hctx = haze.getContext('2d')!;
    hctx.save();
    hctx.translate(core.x, core.y);
    hctx.rotate(ang);
    const bandGrad = hctx.createLinearGradient(-GW * 0.7, 0, GW * 0.5, 0);
    bandGrad.addColorStop(0, 'rgba(159,199,184,0)');
    bandGrad.addColorStop(0.5, 'rgba(159,199,184,0.10)');
    bandGrad.addColorStop(0.78, 'rgba(207,230,220,0.16)');
    bandGrad.addColorStop(1, 'rgba(159,199,184,0)');
    hctx.fillStyle = bandGrad;
    hctx.beginPath();
    hctx.ellipse(0, 0, GW * 0.6, GH * 0.16, 0, 0, Math.PI * 2);
    hctx.fill();
    hctx.restore();
    const g = hctx.createRadialGradient(core.x, core.y, 0, core.x, core.y, GH * 0.5);
    g.addColorStop(0, 'rgba(207,230,220,0.26)');
    g.addColorStop(0.4, 'rgba(159,199,184,0.12)');
    g.addColorStop(1, 'rgba(159,199,184,0)');
    hctx.fillStyle = g;
    hctx.fillRect(0, 0, GW, GH);

    const px = (x: number, y: number, col: string) => {
      ctx.fillStyle = col;
      ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, GW, GH);
      ctx.drawImage(haze, 0, 0); // the galactic glow (CSS-blurred for softness)

      for (const s of stars) {
        const tw = reduced ? 1 : 0.5 + 0.5 * Math.sin(t / s.period + s.phase);
        if (s.blink) {
          if (tw < 0.12 && !reduced) {
            let nx = rng() * GW, ny = rng() * GH, tries = 0;
            while (inText(nx, ny) && tries++ < 8) {
              nx = rng() * GW;
              ny = rng() * GH;
            }
            s.x = nx;
            s.y = ny;
            s.bright = rng() > 0.5;
          }
          if (tw > 0.72) px(s.x, s.y, s.bright ? C.star : C.starDim);
          continue;
        }
        if (tw > 0.42) px(s.x, s.y, s.bright ? C.star : C.starDim);
        if (s.bright && tw > 0.86) {
          px(s.x + 1, s.y, C.starDim);
          px(s.x - 1, s.y, C.starDim);
          px(s.x, s.y + 1, C.starDim);
          px(s.x, s.y - 1, C.starDim);
        }
      }

      for (const m of motes) {
        if (!reduced) {
          m.x += m.vx;
          m.y += m.vy;
          if (m.x > GW || m.y < 0 || m.y > GH) {
            m.x = GW * 0.3;
            m.y = GH * 0.72;
          }
        }
        px(m.x, m.y, C.bone);
        px(m.x + 1, m.y, C.starDim);
        px(m.x - 1, m.y, C.starDim);
        px(m.x, m.y + 1, C.starDim);
        px(m.x, m.y - 1, C.starDim);
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

  // ---- scene: the ringed planet in the right half (same style & spot) ----
  useEffect(() => {
    const canvas = sceneRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = SCENE;
    canvas.height = SCENE;
    ctx.imageSmoothingEnabled = false;

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

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
      const ellipse = (cx: number, cy: number, rx: number, ry: number, col: string, from = 0, to = Math.PI * 2) => {
        for (let a = from; a < to; a += 0.05) px(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, col);
      };
      return { px, disc, ellipse };
    };

    const C2 = SCENE / 2;

    const sceneRingedPlanet = (c: CanvasRenderingContext2D, t: number) => {
      const { disc, ellipse } = mk(c);
      const cx = Math.round(SCENE * 0.56), cy = C2;
      ellipse(cx, cy, 25, 25 * 0.34, C.jadeLite);
      disc(cx, cy, 17, C.jade, C.jadeShade);
      ellipse(cx, cy, 25, 25 * 0.34, C.jadeLite, 0, Math.PI);
      const a = reduced ? -0.7 : t / 2600;
      disc(cx + Math.cos(a) * 31, cy + Math.sin(a) * 15, 3, C.bone);
    };

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

    const sceneComet = (c: CanvasRenderingContext2D, t: number) => {
      const { disc, px } = mk(c);
      const mx = Math.round(SCENE * 0.58), my = C2;
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
        const bx = Math.round(cxp - tx * i);
        const by = Math.round(cyp - ty * i);
        if (bx >= 0 && bx < SCENE && by >= 0 && by < SCENE) px(bx, by, i < 3 ? C.bone : C.jadeLite);
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

    const blitScene = (sceneIdx: number, t: number, alpha: number) => {
      if (alpha <= 0.01) return;
      bctx.clearRect(0, 0, SCENE, SCENE);
      scenes[sceneIdx](bctx, t);
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
