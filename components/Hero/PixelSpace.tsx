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

const SCENE = 150; // scene canvas resolution (higher -> the black hole reads defined)

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

    const HOLD = 3800;
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

    // a dedicated HI-RES buffer for the black hole, so its rings read smooth
    // and defined rather than coarsely pixelated like the other 8-bit scenes.
    const HR = 3; // 3x resolution
    const hbuf = document.createElement('canvas');
    hbuf.width = SCENE * HR;
    hbuf.height = SCENE * HR;
    const hbctx = hbuf.getContext('2d')!;

    // 1. the Interstellar black hole — drawn hi-res into hbuf, then blitted
    // smoothly onto the scene so it looks more defined than 8-bit.
    const sceneBlackHole = (c: CanvasRenderingContext2D, t: number) => {
      const S = SCENE * HR;
      const O = S / 2;
      hbctx.clearRect(0, 0, S, S);
      const RX = 34 * HR, RY = 11 * HR, EH = 11 * HR, TILT = -0.26, DISC_DY = -4 * HR;
      const spin = reduced ? 0 : t / 650;
      const hp = (x: number, y: number, col: string, w = HR) => {
        hbctx.fillStyle = col;
        hbctx.fillRect(Math.round(x), Math.round(y), w, w);
      };
      hbctx.save();
      hbctx.translate(O, O);
      hbctx.rotate(TILT);
      hbctx.translate(-O, -O);
      const dring = (rx: number, ry: number, col: string, from: number, to: number) => {
        const step = 0.9 / Math.max(rx, 1); // fine step -> continuous ring
        for (let a = from; a < to; a += step) hp(O + Math.cos(a) * rx, O + DISC_DY + Math.sin(a) * ry, col);
      };
      // back of the disc
      dring(RX, RY, C.jadeShade, Math.PI, Math.PI * 2);
      dring(RX - 4 * HR, RY - 2 * HR, C.jade, Math.PI, Math.PI * 2);
      // lensed halo over the top
      const topR = EH + 9 * HR;
      for (let a = Math.PI; a < Math.PI * 2; a += 0.6 / Math.max(topR, 1)) {
        const x = O + Math.cos(a) * topR;
        const y = O + DISC_DY - 2 * HR + Math.sin(a) * (topR * 0.92);
        hp(x, y, Math.sin(a) < -0.45 ? C.bone : C.jadeLite);
      }
      for (let a = 0; a < Math.PI; a += 0.6 / Math.max(EH + 7 * HR, 1)) {
        const x = O + Math.cos(a) * (EH + 7 * HR);
        const y = O + DISC_DY + 2 * HR + Math.sin(a) * ((EH + 7 * HR) * 0.9);
        hp(x, y, Math.sin(a) > 0.5 ? C.bone : C.jadeLite);
      }
      // hot core rim
      const hdisc = (cx: number, cy: number, r: number, col: string) => {
        hbctx.fillStyle = col;
        hbctx.beginPath();
        hbctx.arc(cx, cy, r, 0, Math.PI * 2);
        hbctx.fill();
      };
      hdisc(O, O + DISC_DY, EH + 3 * HR, C.bone);
      hdisc(O, O + DISC_DY, EH + 1.5 * HR, C.jadeLite);
      hdisc(O, O + DISC_DY, EH, '#05080a');
      // front of the disc, brightest
      dring(RX, RY, C.jade, 0, Math.PI);
      dring(RX - 4 * HR, RY - 2 * HR, C.jadeLite, 0, Math.PI);
      dring(RX - 1 * HR, RY - 1 * HR, C.bone, 0.15, Math.PI - 0.15);
      // orbiting hot spots
      for (let i = 0; i < 5; i++) {
        const a = spin * (1 + i * 0.25) + (i * Math.PI * 2) / 5;
        const r = RX - 2 * HR - i * 2.4 * HR;
        hp(O + Math.cos(a) * r, O + DISC_DY + Math.sin(a) * (r * (RY / RX)), C.bone, HR + 1);
      }
      hbctx.restore();
      // blit smoothly (downscaled) -> defined, anti-aliased black hole
      c.imageSmoothingEnabled = true;
      c.drawImage(hbuf, 0, 0, SCENE, SCENE);
      c.imageSmoothingEnabled = false;
    };

    // 2. ringed planet with a moon
    const sceneRingedPlanet = (c: CanvasRenderingContext2D, t: number) => {
      const { disc, ellipse } = mk(c);
      const cx = Math.round(SCENE * 0.54), cy = C2;
      ellipse(cx, cy, 40, 40 * 0.34, C.jadeLite);
      disc(cx, cy, 27, C.jade, C.jadeShade);
      ellipse(cx, cy, 40, 40 * 0.34, C.jadeLite, 0, Math.PI);
      const a = reduced ? -0.7 : t / 2600;
      disc(cx + Math.cos(a) * 49, cy + Math.sin(a) * 24, 4, C.bone);
    };

    // 3. a rocket hovering
    const sceneRocket = (c: CanvasRenderingContext2D, t: number) => {
      const { px } = mk(c);
      const s = 1.6; // scale the sprite up for the larger canvas
      const bx = Math.round(C2 - 7 + (reduced ? 0 : Math.sin(t / 900) * 8));
      const by = Math.round(C2 + 10 + (reduced ? 0 : Math.cos(t / 1100) * 8));
      const blk = (gx: number, gy: number, col: string) => {
        for (let yy = 0; yy < s; yy++) for (let xx = 0; xx < s; xx++) px(bx + gx * s + xx, by + gy * s + yy, col);
      };
      for (let i = 0; i < 9; i++) blk(i, -i, C.bone);
      for (let i = 2; i < 8; i++) blk(i, -i + 1, C.jade);
      blk(9, -9, C.jadeLite);
      blk(0, 1, C.jadeShade);
      blk(1, -2, C.jadeShade);
      if (reduced || Math.sin(t / 90) > 0) {
        blk(-1, 1, C.rust);
        blk(-2, 2, C.star);
      }
    };

    // 4. a mini solar system
    const sceneSystem = (c: CanvasRenderingContext2D, t: number) => {
      const { disc, ellipse } = mk(c);
      disc(C2, C2, 9, C.jadeLite, C.jade);
      const o1 = reduced ? 0.4 : t / 1800;
      const o2 = reduced ? 2.1 : -t / 2800;
      ellipse(C2, C2, 28, 28, C.jadeShade);
      ellipse(C2, C2, 47, 47, C.jadeShade);
      disc(C2 + Math.cos(o1) * 28, C2 + Math.sin(o1) * 28, 4, C.bone);
      disc(C2 + Math.cos(o2) * 47, C2 + Math.sin(o2) * 47, 6, C.jade, C.jadeShade);
    };

    const scenes = [sceneBlackHole, sceneRingedPlanet, sceneRocket, sceneSystem];

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
