'use client';

/*
 * StarField — a sparse, full-page star layer fixed behind everything. It gives
 * the whole site (not just the hero) a faint scattered-stars background that
 * shows through the side margins and gaps of every section as you scroll.
 *
 * Density is low (~10% of the hero field), stars sit mostly toward the sides
 * and vary in opacity so it reads as depth, not noise. It is a fixed background
 * at a low z-index with pointer-events off; section content sits above it on
 * the opaque-ish dark ground, so stars fall in the margins, never over text.
 * Off under prefers-reduced-motion (painted once, no twinkle).
 */

import { useEffect, useRef } from 'react';
import styles from './StarField.module.css';

export default function StarField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rng = mulberry32(31337);

    // low-res field stretched over the FULL PAGE (document height), so it
    // scrolls with the content instead of staying pinned to the viewport.
    const GW = 165; // +10% resolution -> stars render ~10% smaller
    let GH = 198;

    const size = () => {
      // Measure the PAGE height without the canvas's own contribution: zero it
      // first, read the document height, then size the canvas to that. Without
      // this, the absolute canvas inflates scrollHeight and each re-measure
      // grows the page further, leaving dead space below the footer.
      canvas.style.height = '0px';
      const docH = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        window.innerHeight,
      );
      const ar = docH / window.innerWidth || 2;
      GH = Math.round(GW * ar);
      canvas.width = GW;
      canvas.height = GH;
      canvas.style.height = `${docH}px`;
      ctx.imageSmoothingEnabled = false;
    };
    size();

    // sparse stars biased toward the left and right thirds (the side margins),
    // avoiding the central 40% where content text usually sits
    type Star = { nx: number; ny: number; period: number; phase: number; op: number; dim: boolean };
    const stars: Star[] = [];
    const COUNT = Math.round(GH * 0.8); // sparse; density tuned for the field
    for (let i = 0; i < COUNT; i++) {
      // push x toward the sides: pick from [0,0.3] or [0.7,1] most of the time
      let nx = rng();
      if (nx > 0.3 && nx < 0.7 && rng() > 0.25) {
        nx = rng() < 0.5 ? rng() * 0.3 : 0.7 + rng() * 0.3;
      }
      stars.push({
        nx,
        ny: rng(),
        period: 1800 + rng() * 3600,
        phase: rng() * Math.PI * 2,
        op: 0.25 + rng() * 0.6,
        dim: rng() > 0.5,
      });
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, GW, GH);
      for (const s of stars) {
        const x = Math.round(s.nx * GW);
        const y = Math.round(s.ny * GH);
        const tw = reduced ? 1 : 0.55 + 0.45 * Math.sin(t / s.period + s.phase);
        const a = s.op * tw;
        if (a < 0.06) continue;
        ctx.globalAlpha = a;
        ctx.fillStyle = s.dim ? '#8aa89c' : '#e3e2da';
        ctx.fillRect(x, y, 1, 1);
        // a defined bit-art sparkle at the twinkle peak: a bright 4-point plus
        // PLUS two diagonal rays, for an 8-point star
        if (!reduced && !s.dim && tw > 0.95) {
          const k = (tw - 0.95) / 0.05;
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = k;
          // plus arms
          ctx.fillRect(x + 1, y, 1, 1);
          ctx.fillRect(x - 1, y, 1, 1);
          ctx.fillRect(x, y + 1, 1, 1);
          ctx.fillRect(x, y - 1, 1, 1);
          // diagonal rays (dimmer), so it reads as an 8-point bit-art sparkle
          ctx.globalAlpha = k * 0.5;
          ctx.fillStyle = '#cfe6dc';
          ctx.fillRect(x + 1, y + 1, 1, 1);
          ctx.fillRect(x - 1, y - 1, 1, 1);
          ctx.fillRect(x + 1, y - 1, 1, 1);
          ctx.fillRect(x - 1, y + 1, 1, 1);
        }
      }
      ctx.globalAlpha = 1;
    };

    let raf = 0;
    const onResize = () => size();
    window.addEventListener('resize', onResize);
    // catch late layout growth (fonts, images) so the field covers the full page
    const t1 = setTimeout(size, 400);
    const t2 = setTimeout(size, 1200);

    // parallax: shift the whole field by a fraction of the scroll so the stars
    // drift at a slower rate than the content, reading as a distant layer.
    const onScroll = () => {
      canvas.style.transform = `translateY(${window.scrollY * 0.25}px)`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

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
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return <canvas ref={ref} className={styles.field} aria-hidden="true" />;
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
