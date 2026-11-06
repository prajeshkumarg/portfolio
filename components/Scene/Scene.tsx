'use client';

/*
 * The hero. A bold asymmetric layout on the gradient ground with an interactive
 * particle field behind it: drifting glowing dots in the accent palette, linked
 * by faint lines when near, that lean away from the pointer. Big display type
 * with the accent gradient on the name; the portrait sits in a glowing ring.
 * No scroll-zoom. Particles + the load-in are off under reduced motion.
 */

import { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { hero, site } from '@/content';
import styles from './Scene.module.css';

gsap.registerPlugin(useGSAP);

type Dot = { x: number; y: number; vx: number; vy: number; r: number; c: string };

/** The drifting, pointer-reactive particle field. Returns a cleanup. */
function particles(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  const palette = ['#a78bfa', '#38bdf8', '#f472b6'];
  let dots: Dot[] = [];
  let dpr = 1;
  let w = 0;
  let h = 0;
  let raf = 0;
  const pointer = { x: -1e4, y: -1e4 };

  const build = () => {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = Math.round(rect.width * dpr);
    h = canvas.height = Math.round(rect.height * dpr);
    // density scales with area, capped so it stays cheap
    const count = Math.min(90, Math.round((rect.width * rect.height) / 11000));
    dots = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25 * dpr,
      vy: (Math.random() - 0.5) * 0.25 * dpr,
      r: (Math.random() * 1.6 + 0.8) * dpr,
      c: palette[(Math.random() * palette.length) | 0],
    }));
  };

  const link = 120;
  const step = () => {
    raf = requestAnimationFrame(step);
    ctx.clearRect(0, 0, w, h);
    const reach = 120 * dpr;
    const linkPx = link * dpr;

    for (const d of dots) {
      // pointer repulsion
      const dx = d.x - pointer.x;
      const dy = d.y - pointer.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < reach * reach && d2 > 0.01) {
        const dist = Math.sqrt(d2);
        const push = (1 - dist / reach) * 0.9 * dpr;
        d.vx += (dx / dist) * push;
        d.vy += (dy / dist) * push;
      }
      d.vx *= 0.96;
      d.vy *= 0.96;
      d.x += d.vx;
      d.y += d.vy;
      // wrap at edges
      if (d.x < 0) d.x += w;
      else if (d.x > w) d.x -= w;
      if (d.y < 0) d.y += h;
      else if (d.y > h) d.y -= h;
    }

    // links
    ctx.lineWidth = dpr;
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const a = dots[i];
        const b = dots[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < linkPx) {
          ctx.globalAlpha = (1 - dist / linkPx) * 0.18;
          ctx.strokeStyle = a.c;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // dots with glow
    ctx.globalAlpha = 1;
    for (const d of dots) {
      ctx.fillStyle = d.c;
      ctx.shadowColor = d.c;
      ctx.shadowBlur = 8 * dpr;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  };

  const move = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return;
    const rect = canvas.getBoundingClientRect();
    pointer.x = (e.clientX - rect.left) * dpr;
    pointer.y = (e.clientY - rect.top) * dpr;
  };
  const leave = () => {
    pointer.x = -1e4;
    pointer.y = -1e4;
  };

  const ro = new ResizeObserver(build);
  ro.observe(canvas);
  build();
  step();
  window.addEventListener('pointermove', move);
  document.documentElement.addEventListener('pointerleave', leave);

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    window.removeEventListener('pointermove', move);
    document.documentElement.removeEventListener('pointerleave', leave);
  };
}

export default function Scene() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

      // live clock
      const clockEl = root.current?.querySelector<HTMLElement>('[data-clock]');
      let clockId = 0;
      if (clockEl) {
        const fmt = new Intl.DateTimeFormat('en-GB', {
          timeZone: hero.readout.timeZone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        const tick = () => (clockEl.textContent = fmt.format(new Date()));
        tick();
        clockId = window.setInterval(tick, 1000);
      }

      let stopParticles = () => {};
      if (!reduced) {
        const canvas = root.current?.querySelector<HTMLCanvasElement>('[data-particles]');
        if (canvas) stopParticles = particles(canvas);

        gsap.from(gsap.utils.toArray<HTMLElement>('[data-hero-in]'), {
          y: 34,
          opacity: 0,
          duration: 1,
          stagger: 0.09,
          ease: 'expo.out',
          delay: 0.1,
        });
      }

      return () => {
        window.clearInterval(clockId);
        stopParticles();
      };
    },
    { scope: root },
  );

  return (
    <header id="top" ref={root} className={styles.hero}>
      <canvas className={styles.particles} data-particles aria-hidden="true" />

      <div className={styles.inner}>
        <p className={styles.readout} data-hero-in>
          <span className={styles.ping} aria-hidden="true" />
          {hero.greeting}
          <span className={styles.clock}>
            <time data-clock>--:--</time> {hero.readout.timeZoneLabel}
          </span>
        </p>

        <h1 className={styles.statement} data-hero-in>
          {hero.statement.map((line) => (
            <span key={line.word} className={line.em ? `${styles.line} gradientText` : styles.line}>
              {line.word}
              <span aria-hidden="true">.</span>
            </span>
          ))}
        </h1>

        <div className={styles.foot}>
          <figure className={styles.portrait} data-hero-in>
            <span className={styles.ring} aria-hidden="true" />
            <Image
              className={styles.photo}
              src={hero.portrait}
              alt={hero.portraitAlt}
              fill
              priority
              sizes="(max-width: 640px) 96px, 120px"
            />
          </figure>

          <p className={styles.bio} data-hero-in>
            {hero.bio}
          </p>

          <div className={styles.actions} data-hero-in>
            <a className={styles.cta} href={hero.ctaHref}>
              {hero.ctaLabel} <span aria-hidden="true">↓</span>
            </a>
            <a className={styles.resume} href={site.resumeHref} target="_blank" rel="noreferrer">
              {hero.resumeLabel} <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
