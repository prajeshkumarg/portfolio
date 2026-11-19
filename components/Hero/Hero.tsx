/*
 * Hero — the one unique moment on the page. The name is huge and two-ink; under
 * it sits a "Right now" block (what Prajesh is working on, from `now` in
 * content.ts), a one-line summary, and two buttons: "See my work" (lava) and a
 * quiet Résumé link. The pixel scene (PixelSpace) sits on the right on desktop
 * and in its own row on phones.
 *
 * A Server Component (PixelSpace is the client piece). Elements
 * marked data-star-avoid are measured by StarField so background stars never
 * draw over them. Everything degrades to a static, readable hero with no JS and
 * under reduced motion.
 */

import { site, now, nowCopy } from '@/content';
import PixelSpace from './PixelSpace';
import styles from './Hero.module.css';

// "2026-11-19" -> "Nov 19, 2026", formatted in UTC so the day never shifts
const updatedLabel = new Date(`${now.updated}T00:00:00Z`).toLocaleDateString('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

export default function Hero() {
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

        <section className={styles.now} aria-labelledby="now-h" data-hero-lede data-star-avoid>
          <h2 id="now-h" className={styles.nowHeading}>
            {nowCopy.heading}
          </h2>
          <ul className={styles.nowList}>
            {now.items.slice(0, 4).map((item) => (
              <li key={item.id} className={styles.nowRow}>
                {item.href ? (
                  <a className={`${styles.nowName} ${styles.nowLink}`} href={item.href}>
                    {item.name}
                  </a>
                ) : (
                  <span className={styles.nowName}>{item.name}</span>
                )}
                <span className={styles.nowStatus}>{item.status}</span>
              </li>
            ))}
          </ul>
          <p className={styles.updated}>
            {nowCopy.updatedLabel} <time dateTime={now.updated}>{updatedLabel}</time>
          </p>
        </section>

        <div className={styles.foot} data-hero-lede data-star-avoid>
          <p className={styles.summary}>{nowCopy.summary}</p>
          <div className={styles.actions}>
            <a className={styles.cta} href={nowCopy.ctaHref}>
              {nowCopy.ctaLabel}
            </a>
            <a className={styles.quiet} href={site.resumeHref}>
              {nowCopy.resumeLabel}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
