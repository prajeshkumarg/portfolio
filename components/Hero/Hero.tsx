/*
 * Hero — the one unique moment on the page. The name is huge and two-ink; under
 * it a "Building now · updated Nov 19" line and a row of cards (one per
 * item in `now`, content.ts — see HeroCard). The two buttons, "See my work"
 * (lava) and a quiet Résumé, sit bottom-right under the pixel scene (PixelSpace),
 * and stack full-width at the bottom on phones.
 *
 * It scrolls away normally over the page's fixed starfield; its own StarField (host
 * scope) only adds the ring of stars around the pixel scene. A Server Component
 * (StarField, PixelSpace and HeroCard are the client pieces). Elements marked
 * data-star-avoid are measured by StarField so background stars never draw over
 * them. Everything degrades to a static, readable hero with no JS and under
 * reduced motion.
 */

import { site, now, nowCopy } from '@/content';
import StarField from '@/components/StarField/StarField';
import PixelSpace from './PixelSpace';
import HeroCard from './HeroCard';
import styles from './Hero.module.css';

// "2026-11-19" -> "Nov 19", formatted in UTC so the day never shifts
const updatedLabel = new Date(`${now.updated}T00:00:00Z`).toLocaleDateString('en-US', {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

export default function Hero() {
  return (
    <header id="top" className={styles.hero} data-hero-pending>
      <StarField scope="host" />
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

        <h2 className={styles.nowHeading} data-hero-lede data-star-avoid>
          <span className={styles.nowTitle}>{nowCopy.heading}</span>{' '}
          <span className={styles.nowMeta}>
            {nowCopy.separator} {nowCopy.updatedLabel} <time dateTime={now.updated}>{updatedLabel}</time>
          </span>
        </h2>

        <ul className={styles.carts} data-hero-lede data-star-avoid>
          {now.items.slice(0, 4).map((item) => (
            <li key={item.id} className={styles.cartItem}>
              <HeroCard item={item} />
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.actions} data-hero-lede data-star-avoid>
        <a className={styles.cta} href={nowCopy.ctaHref}>
          {nowCopy.ctaLabel}
        </a>
        <a className={styles.quiet} href={site.resumeHref}>
          {nowCopy.resumeLabel}
        </a>
      </div>
    </header>
  );
}
