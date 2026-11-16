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

import { useEffect, useRef, useState } from 'react';
import { site } from '@/content';
import HeroArt from './HeroArt';
import styles from './Hero.module.css';

const ROLES = ['systems', 'compilers', 'security'];

export default function Hero() {
  const [i, setI] = useState(0);
  const nameRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const id = setInterval(() => setI((n) => (n + 1) % ROLES.length), 2200);

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
      clearInterval(id);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <header id="top" className={styles.hero} data-hero-pending>
      <HeroArt />
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

      <div className={styles.foot}>
        <p className={styles.role} data-hero-lede>
          <span className={styles.roleStatic}>Software engineer —</span>{' '}
          <span className={styles.roleRotator} aria-live="polite">
            {ROLES.map((r, n) => (
              <span
                key={r}
                className={styles.roleWord}
                data-on={n === i ? 'true' : undefined}
                aria-hidden={n === i ? undefined : 'true'}
              >
                {r}
              </span>
            ))}
          </span>
        </p>
        <a className={styles.cta} href="#work" data-hero-lede>
          See my work
        </a>
      </div>
    </header>
  );
}
