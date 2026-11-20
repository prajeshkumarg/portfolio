'use client';

/*
 * StarField — a sparse star layer with two scopes:
 *
 *   scope="viewport" (default)  the page's background: a FIXED, full-viewport layer
 *     that stays still while the content (the hero's name and art, then every
 *     section) scrolls over it. Stars are drawn around the hero UI, not behind it
 *     (see below), measured against the current scroll.
 *   scope="host"  only the stars that hug the hero's pixel scene; fills its parent
 *     (the hero), so the ring and the moon's pocket scroll away with the planet.
 *
 * Rendered at full device resolution with smoothing on, so stars are small,
 * SHARP round points (not chunky pixel squares). Density is low; opacity varies
 * for depth. Bright stars flash a crisp 4-point sparkle at their twinkle peak.
 * Still frames under prefers-reduced-motion.
 *
 * The scene cluster is placed from the scene's real on-screen rect (the
 * [data-star-scene] canvas inside the parent, measured with getBoundingClientRect
 * and re-measured on resize / font load), in pixels around its centre, so the
 * falloff is round at every viewport size.
 *
 * Stars never draw over the hero UI: every [data-star-avoid] element (top bar,
 * name, "Building now", cards, buttons) is measured into an exclusion rect, padded
 * 8px, re-measured on resize / font load, and tested at draw time.
 */

import { useEffect, useRef } from 'react';
import styles from './StarField.module.css';

export default function StarField({ scope = 'viewport' }: { scope?: 'viewport' | 'host' }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const host = scope === 'host' ? canvas.parentElement : null;
    if (scope === 'host' && !host) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = host ? host.clientWidth : window.innerWidth; // CSS px
    let H = host ? host.clientHeight : window.innerHeight; // CSS px

    const size = () => {
      W = host ? host.clientWidth : window.innerWidth;
      H = host ? host.clientHeight : window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // draw in CSS px, crisp on hi-dpi
    };
    size();

    // sparse stars biased toward the side margins; varied size, shade, opacity
    // and an occasional faint colour (jade / soft blue) for depth and interest.
    type Star = {
      nx: number; ny: number; r: number; period: number; phase: number;
      op: number; col: string; sparkle: boolean;
    };
    const PALETTE = [
      '#e8e6dc', // bone (most common)
      '#e8e6dc',
      '#e8e6dc',
      '#9aa09a', // grey
      '#9fc7b8', // jade tint
      '#b8c6d6', // faint cool blue
      '#cfe6dc', // pale jade-white
    ];
    // exclusion rects, padded: relative to the parent (host scope) or in page
    // coordinates (viewport scope, shifted by the scroll at draw time)
    const PAD = 8;
    let avoid: { x0: number; y0: number; x1: number; y1: number }[] = [];
    const measureAvoid = () => {
      const root: ParentNode = host ?? document;
      const o = host ? host.getBoundingClientRect() : { left: 0, top: -window.scrollY };
      avoid = Array.from(root.querySelectorAll<HTMLElement>('[data-star-avoid]')).map((el) => {
        const r = el.getBoundingClientRect();
        return {
          x0: r.left - o.left - PAD,
          y0: r.top - o.top - PAD,
          x1: r.right - o.left + PAD,
          y1: r.bottom - o.top + PAD,
        };
      });
    };
    // a star (plus its sparkle arms, if any) overlapping any exclusion rect
    const blocked = (x: number, y: number, reach: number) => {
      for (const a of avoid) {
        if (x > a.x0 - reach && x < a.x1 + reach && y > a.y0 - reach && y < a.y1 + reach) return true;
      }
      return false;
    };

    // (re)built whenever the page is re-measured, so the scene cluster follows it
    let stars: Star[] = [];
    const build = () => {
      const next: Star[] = [];
      const rng = mulberry32(31337); // same seed every build -> a stable field
      const COUNT = host ? 0 : Math.round((H / 10) * 1.6); // the host scope only adds the scene cluster
      for (let i = 0; i < COUNT; i++) {
        // allow stars across the full width (incl. the centre gap); only nudge a
        // small share out of the middle so the field is even, not segregated.
        let nx = rng();
        if (nx > 0.35 && nx < 0.65 && rng() > 0.75) {
          nx = rng() < 0.5 ? rng() * 0.35 : 0.65 + rng() * 0.35;
        }
        const big = rng() > 0.78;
        next.push({
          nx,
          ny: rng(),
          r: big ? 2.4 + rng() * 1.8 : 1.1 + rng() * 1.0, // bigger overall, more visible
          period: 1800 + rng() * 3600,
          phase: rng() * Math.PI * 2,
          op: big ? 0.75 + rng() * 0.25 : 0.4 + rng() * 0.5, // brighter overall
          col: PALETTE[Math.floor(rng() * PALETTE.length)],
          sparkle: big && rng() > 0.4,
        });
      }

      // Stars hugging the hero's pixel scene, placed from its real on-screen rect so
      // they stay round (px around the centre, no page-fraction stretching) on any
      // viewport. Coordinates are relative to the parent element.
      const sceneEl = host?.querySelector<HTMLElement>('[data-star-scene]');
      const sr = sceneEl?.getBoundingClientRect();
      const o = host ? host.getBoundingClientRect() : { left: 0, top: 0 };
      if (sr && sr.width > 0) {
        const cx = sr.left - o.left + sr.width / 2;
        const cy = sr.top - o.top + sr.height / 2;
        const rim = sr.width * 0.3; // roughly the visible planet / ring edge
        const addNear = (x: number, y: number, bigChance: number, sparkleChance: number) => {
          if (x < 0 || x > W || y < 0 || y > H) return;
          const big = rng() > bigChance;
          next.push({
            nx: x / W,
            ny: y / H,
            r: big ? 2.3 + rng() * 1.5 : 1.05 + rng() * 0.95,
            period: 1600 + rng() * 3000,
            phase: rng() * Math.PI * 2,
            op: big ? 0.75 + rng() * 0.25 : 0.45 + rng() * 0.5,
            col: PALETTE[Math.floor(rng() * PALETTE.length)],
            sparkle: big && rng() > sparkleChance,
          });
        };

        // a ring just outside the scene, even all the way round, thinning outward
        for (let i = 0; i < 240; i++) {
          const ang = rng() * Math.PI * 2;
          const dist = rim * (1.05 + Math.pow(rng(), 1.5) * 1.8);
          addNear(cx + Math.cos(ang) * dist, cy + Math.sin(ang) * dist, 0.78, 0.4);
        }

        // a small pocket by the moon (lower-left of the scene)
        const mx = cx - sr.width * 0.14;
        const my = cy + sr.width * 0.094;
        const spread = sr.width * 0.25;
        for (let i = 0; i < 60; i++) {
          const ang = rng() * Math.PI * 2;
          const rad = Math.pow(rng(), 0.5) * spread;
          addNear(mx + Math.cos(ang) * rad, my + Math.sin(ang) * rad, 0.82, 0.5);
        }
      }

      stars = next;
    };

    const dot = (x: number, y: number, r: number, col: string) => {
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      const scrolled = host ? 0 : window.scrollY; // viewport scope: avoid rects are in page coordinates
      for (const s of stars) {
        const x = s.nx * W;
        const y = s.ny * H;
        if (blocked(x, y + scrolled, s.sparkle ? 14 : s.r)) continue;
        const tw = reduced ? 1 : 0.55 + 0.45 * Math.sin(t / s.period + s.phase);
        const a = s.op * tw;
        if (a < 0.05) continue;
        ctx.globalAlpha = a;
        dot(x, y, s.r, s.col);

        // crisp sparkle on the designated sparkle stars at the twinkle peak
        if (!reduced && s.sparkle && tw > 0.94) {
          const k = (tw - 0.94) / 0.06;
          const len = 2.6 + s.r * 2.4;
          ctx.globalAlpha = k * 0.9;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(x - len, y);
          ctx.lineTo(x + len, y);
          ctx.moveTo(x, y - len);
          ctx.lineTo(x, y + len);
          ctx.stroke();
          ctx.globalAlpha = k * 0.4;
          const d = len * 0.6;
          ctx.beginPath();
          ctx.moveTo(x - d, y - d);
          ctx.lineTo(x + d, y + d);
          ctx.moveTo(x + d, y - d);
          ctx.lineTo(x - d, y + d);
          ctx.stroke();
          ctx.globalAlpha = k;
          dot(x, y, s.r + 0.4, '#ffffff');
        }
      }
      ctx.globalAlpha = 1;
    };

    let raf = 0;
    const measure = () => {
      size();
      measureAvoid();
      build();
    };
    const onResize = measure;
    // host scope: the parent changes size as content lands; viewport scope: the window
    const ro = new ResizeObserver(onResize);
    if (host) ro.observe(host);
    else window.addEventListener('resize', onResize);
    const t1 = setTimeout(measure, 400);
    const t2 = setTimeout(measure, 1200);
    const t3 = setTimeout(measure, 2600); // after the hero intro has settled
    document.fonts?.ready.then(measure); // Switzer loads late and moves the layout

    measureAvoid();
    build();
    if (reduced) {
      draw(0);
    } else {
      const loop = (now: number) => {
        draw(now);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', onResize);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [scope]);

  return (
    <canvas
      ref={ref}
      className={scope === 'host' ? styles.field : styles.fixed}
      aria-hidden="true"
    />
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
