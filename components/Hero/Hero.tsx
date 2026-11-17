'use client';

/*
 * Hero — the one unique moment on the page (taste-skill v2: anti-center,
 * motivated kinetic type, emphasis in the SAME family, no serif accent, no
 * scroll cue). The name is huge and two-ink; beneath it one line re-sets a
 * rotating role word in place — "systems", "compilers", "security" — a masked
 * swap that shows the breadth of the work without a paragraph. Same Switzer
 * throughout; the rotating word is the bold emphasis.
 *
 * Client because of the rotating word and the pointer-reactive weight on the
 * name. Everything degrades to a static, readable hero with no JS and under
 * reduced motion.
 */

import { useEffect, useRef } from 'react';
import { site } from '@/content';
import PixelSpace from './PixelSpace';
import styles from './Hero.module.css';

export default function Hero() {
  const nameRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    // pointer-reactive weight: the name leans heavier toward the cursor.
    const el = nameRef.current;
    const onMove = (e: PointerEvent) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width; // 0..1 across the name
      const weight = Math.round(400 + Math.max(0, Math.min(1, x)) * 200); // 400–600
      el.style.setProperty('--name-weight', String(weight));
    };
    window.addEventListener('pointermove', onMove);

    return () => {
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <header id="top" className={styles.hero} data-hero-pending>
      <PixelSpace />
      <div className={styles.top}>
        <span className={styles.monogram}>{site.wordmark}</span>
        <nav className={styles.links} aria-label="Primary">
          <a href="#work">Work</a>
          <a href="#projects">Projects</a>
          <a href={site.blogHref}>Writing</a>
        </nav>
      </div>

      <h1 className={styles.name} ref={nameRef}>
        <span className={styles.line} data-hero-line>
          <span>Prajesh</span>
        </span>
        <span className={`${styles.line} ${styles.lineTwo}`} data-hero-line>
          <span>Kumar</span>
        </span>
      </h1>

      <p className={styles.current} data-hero-lede>
        Current: MSCS@NYU, SDE Intern@Amazon, SWE@Shell
      </p>

      <div className={styles.foot}>
        <p className={styles.role} data-hero-lede>
          Welcome to my corner of the internet. This is where I build things,
          chase ideas, and write about what I learn along the way.
        </p>
        <a className={styles.cta} href="#work" data-hero-lede>
          See my work
        </a>
      </div>
    </header>
  );
}
