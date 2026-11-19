'use client';

/*
 * Hero — the one unique moment on the page. The name is huge and two-ink; under
 * it sit a welcome line, then a role line that re-sets a rotating word in place
 * ("systems", "compilers", "security" — a masked swap) beside the lava CTA. Name,
 * welcome, role and CTA are one group, centred under the top bar. The pixel scene
 * (PixelSpace) sits on the right on desktop and in its own row on phones.
 *
 * Client because of the rotating word. Elements marked data-star-avoid are
 * measured by StarField so background stars never draw over them. Everything
 * degrades to a static, readable hero with no JS and under reduced motion.
 */

import { useEffect, useState } from 'react';
import { site } from '@/content';
import PixelSpace from './PixelSpace';
import styles from './Hero.module.css';

const ROLES = ['systems', 'compilers', 'security'];

export default function Hero() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const id = setInterval(() => setI((n) => (n + 1) % ROLES.length), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <header id="top" className={styles.hero} data-hero-pending>
      <PixelSpace />
      <div className={styles.top} data-star-avoid>
        <span className={styles.monogram}>{site.wordmark}</span>
        <nav className={styles.links} aria-label="Primary">
          <a href="#work">Work</a>
          <a href="#projects">Projects</a>
          <a href={site.blogHref}>Writing</a>
        </nav>
      </div>

      <div className={styles.main}>
        <h1 className={styles.name} data-star-avoid>
          <span className={styles.line} data-hero-line>
            <span>Prajesh</span>
          </span>
          <span className={`${styles.line} ${styles.lineTwo}`} data-hero-line>
            <span>Kumar</span>
          </span>
        </h1>

        <p className={styles.welcome} data-hero-lede data-star-avoid>
          Welcome to my corner of the internet. This is where I build things,
          chase ideas, and write about what I learn along the way.
        </p>

        <div className={styles.foot}>
          <p className={styles.role} data-hero-lede data-star-avoid>
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
          <a className={styles.cta} href="#work" data-hero-lede data-star-avoid>
            See my work
          </a>
        </div>
      </div>
    </header>
  );
}
