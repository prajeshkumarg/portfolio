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

  // ---- the scene: a pixel BLACK HOLE in the right half ----
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

    const px = (x: number, y: number, col: string) => {
      ctx.fillStyle = col;
      ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
    };
    const disc = (cx: number, cy: number, r: number, col: string) => {
      for (let y = -r; y <= r; y++)
        for (let x = -r; x <= r; x++)
          if (x * x + y * y <= r * r) px(cx + x, cy + y, col);
    };
    // an elliptical ring of a given radius, thickness and tilt (ry/rx)
    const ring = (rx: number, ry: number, col: string, from: number, to: number, step = 0.04) => {
      for (let a = from; a < to; a += step) {
        px(C2 + Math.cos(a) * rx, C2 + Math.sin(a) * ry, col);
      }
    };

    const RX = 34; // accretion-disc radii
    const RY = 12; // flattened -> edge-on tilt
    const EH = 11; // event-horizon (black core) radius
    const TILT = -0.26; // whole disc tilts down to the left
    const DISC_DY = -5; // raise the disc so its line crosses the hole higher

    const draw = (t: number) => {
      ctx.clearRect(0, 0, SCENE, SCENE);
      const spin = reduced ? 0 : t / 650; // faster orbit

      // tilt everything (disc + halo) down-left; the black core stays centred
      ctx.save();
      ctx.translate(C2, C2);
      ctx.rotate(TILT);
      ctx.translate(-C2, -C2);

      // a tilted ellipse helper, centred on the hole but lifted by DISC_DY
      const dring = (rx: number, ry: number, col: string, from: number, to: number, step = 0.04) => {
        for (let a = from; a < to; a += step) {
          px(C2 + Math.cos(a) * rx, C2 + DISC_DY + Math.sin(a) * ry, col);
        }
      };

      // BACK half of the edge-on disc (behind the hole)
      dring(RX, RY, C.jadeShade, Math.PI, Math.PI * 2);
      dring(RX - 4, RY - 2, C.jade, Math.PI, Math.PI * 2);

      // lensed PHOTON HALO over the top and under the bottom of the hole
      ring(EH + 4, EH + 4, C.jadeLite, 0, Math.PI * 2, 0.05);
      ring(EH + 5, EH + 5, C.bone, Math.PI * 1.15, Math.PI * 1.85, 0.05);
      ring(EH + 5, EH + 5, C.bone, Math.PI * 0.15, Math.PI * 0.85, 0.05);

      // the event horizon
      disc(C2, C2, EH, '#05080a');
      ring(EH + 1, EH + 1, C.jadeLite, 0, Math.PI * 2, 0.08);

      // FRONT half of the edge-on disc (crosses in front of the hole)
      dring(RX, RY, C.jade, 0, Math.PI);
      dring(RX - 4, RY - 2, C.jadeLite, 0, Math.PI);
      dring(RX - 1, RY - 1, C.bone, 0.2, Math.PI - 0.2, 0.06);

      // hot spots orbiting on the disc (faster, more of them)
      for (let i = 0; i < 5; i++) {
        const a = spin * (1 + i * 0.25) + (i * Math.PI * 2) / 5;
        const r = RX - 2 - i * 2.4;
        const x = C2 + Math.cos(a) * r;
        const y = C2 + DISC_DY + Math.sin(a) * (r * (RY / RX));
        px(x, y, C.bone);
        px(x + 1, y, C.jadeLite);
      }

      ctx.restore();
    };

    let raf = 0;
    if (reduced) draw(0);
    else {
      const loop = (now: number) => {
        draw(now);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }
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
