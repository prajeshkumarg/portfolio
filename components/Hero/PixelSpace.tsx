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

  // ---- the galaxy: a slowly turning pixel spiral in the right half ----
  useEffect(() => {
    const canvas = sceneRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = SCENE;
    canvas.height = SCENE;
    ctx.imageSmoothingEnabled = false;

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rng = mulberry32(5150);
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

    // pre-generate the spiral: for each arm, a run of particles placed along a
    // logarithmic spiral with a little scatter, coloured by distance from core
    const ARMS = 2;
    const particles: { ang: number; rad: number; col: string }[] = [];
    for (let arm = 0; arm < ARMS; arm++) {
      const base = (arm / ARMS) * Math.PI * 2;
      for (let i = 0; i < 150; i++) {
        const tpar = i / 150;
        const rad = 6 + tpar * (SCENE * 0.46); // grows outward
        // logarithmic spiral: angle advances with radius
        const ang = base + tpar * 3.1 + (rng() - 0.5) * 0.5;
        const radJ = rad + (rng() - 0.5) * 6;
        // colour: bright core -> jade mid -> faint rim
        const col =
          tpar < 0.18 ? C.jadeLite : tpar < 0.55 ? C.jade : rng() > 0.5 ? C.jadeShade : C.starDim;
        particles.push({ ang, rad: radJ, col });
      }
    }
    // a scatter of loose stars in the disc so arms aren't the only thing
    const dust: { ang: number; rad: number; col: string }[] = [];
    for (let i = 0; i < 90; i++) {
      dust.push({
        ang: rng() * Math.PI * 2,
        rad: 8 + rng() * SCENE * 0.46,
        col: rng() > 0.7 ? C.star : C.jadeShade,
      });
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, SCENE, SCENE);
      const spin = reduced ? 0.6 : t / 9000; // slow turn

      // bright glowing core
      disc(C2, C2, 6, C.jadeLite);
      disc(C2, C2, 3, C.bone);

      // spiral arms
      for (const p of particles) {
        const a = p.ang + spin;
        const x = C2 + Math.cos(a) * p.rad;
        const y = C2 + Math.sin(a) * p.rad * 0.64; // flatten slightly -> disc tilt
        if (x >= 0 && x < SCENE && y >= 0 && y < SCENE) px(x, y, p.col);
      }
      // loose dust, turning a touch slower for parallax
      for (const p of dust) {
        const a = p.ang + spin * 0.6;
        const x = C2 + Math.cos(a) * p.rad;
        const y = C2 + Math.sin(a) * p.rad * 0.64;
        if (x >= 0 && x < SCENE && y >= 0 && y < SCENE) px(x, y, p.col);
      }
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
