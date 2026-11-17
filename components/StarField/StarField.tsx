'use client';

/*
 * StarField — a sparse, full-page star layer behind everything. It gives the
 * whole site a faint scattered-stars background in the margins and gaps, and
 * scrolls with the page (with a slight parallax).
 *
 * Rendered at full device resolution with smoothing on, so stars are small,
 * SHARP round points (not chunky pixel squares). Density is low and biased to
 * the side margins; opacity varies for depth. Bright stars flash a crisp
 * 4-point sparkle at their twinkle peak. Off under prefers-reduced-motion.
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

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = window.innerWidth; // CSS px
    let H = 0; // CSS px, document height

    const size = () => {
      canvas.style.height = '0px'; // measure page without the canvas's own height
      const docH = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        window.innerHeight,
      );
      W = window.innerWidth;
      H = docH;
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
    const stars: Star[] = [];
    const COUNT = Math.round((H / 10) * 1.1);
    for (let i = 0; i < COUNT; i++) {
      let nx = rng();
      if (nx > 0.3 && nx < 0.7 && rng() > 0.25) {
        nx = rng() < 0.5 ? rng() * 0.3 : 0.7 + rng() * 0.3;
      }
      const big = rng() > 0.86; // a few larger stars
      stars.push({
        nx,
        ny: rng(),
        r: big ? 1.6 + rng() * 1.1 : 0.6 + rng() * 0.8, // mix of tiny and a few larger
        period: 1800 + rng() * 3600,
        phase: rng() * Math.PI * 2,
        op: 0.22 + rng() * 0.7, // wide opacity range
        col: PALETTE[Math.floor(rng() * PALETTE.length)],
        sparkle: big && rng() > 0.4, // only some big stars sparkle
      });
    }

    const dot = (x: number, y: number, r: number, col: string) => {
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      for (const s of stars) {
        const x = s.nx * W;
        const y = s.ny * H;
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
    const onResize = () => size();
    window.addEventListener('resize', onResize);
    const t1 = setTimeout(size, 400);
    const t2 = setTimeout(size, 1200);

    // parallax: the field drifts slower than the content
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
