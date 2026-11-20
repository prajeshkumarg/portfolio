/*
 * Hero — the one unique moment on the page. The name is huge and two-ink; under
 * it an italic jade "Building now" line and a row of cards (one per
 * item in `now`, content.ts — see HeroCard). The two buttons, "See my work"
 * (lava) and a quiet Résumé, sit bottom-right under the pixel scene (PixelSpace),
 * and stack full-width at the bottom on phones.
 *
 * It scrolls away normally over the page's fixed starfield (which also holds the
 * ring of stars around the pixel scene). A Server Component (PixelSpace and
 * HeroCard are the client pieces). Elements marked
 * data-star-avoid are measured by StarField so background stars never draw over
 * them. Everything degrades to a static, readable hero with no JS and under
 * reduced motion.
 */

import { site, now, nowCopy } from '@/content';
import PixelSpace from './PixelSpace';
import HeroCard from './HeroCard';
import { ArtSvg, getArt } from './HeroArt';
import styles from './Hero.module.css';

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

        <h2 className={styles.nowHeading} data-hero-lede data-star-avoid>
          {nowCopy.heading}
        </h2>

        <ul className={styles.carts} data-hero-lede data-hero-exit data-star-avoid>
          {now.items.slice(0, 4).map((item) => (
            <li key={item.id} className={styles.cartItem}>
              <HeroCard item={item} />
            </li>
          ))}
        </ul>

        {/* phone (<=600px): the same items as a compact list instead of cards */}
        <ul className={styles.nowList} data-hero-lede data-star-avoid>
          {now.items.slice(0, 4).map((item) => {
            const art = getArt(item.art);
            const row = (
              <>
                <ArtSvg art={art} className={styles.nowIcon} />
                <span className={styles.nowName}>{item.name}</span>
                <span className={styles.nowShort}>{item.short}</span>
              </>
            );
            const style = { '--label': art.colour } as React.CSSProperties;
            return (
              <li key={item.id}>
                {item.href ? (
                  <a className={styles.nowRow} href={item.href} target="_blank" rel="noreferrer" style={style}>
                    {row}
                  </a>
                ) : (
                  <div className={styles.nowRow} style={style}>
                    {row}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className={styles.actions} data-hero-lede data-hero-exit data-star-avoid>
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
