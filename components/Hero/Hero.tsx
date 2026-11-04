import Image from 'next/image';
import ButtonPrimary from '@/components/ButtonPrimary/ButtonPrimary';
import { Bento, Tile } from '@/components/Bento/Bento';
import { hero, site } from '@/content';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section id="top" className={styles.hero}>
      {/* outlined tiles — the page shows through; only the Now tile is filled */}
      <Bento>
        <Tile span={8} rows={2} tone="outline" className={styles.intro} intro>
          <p className={styles.eyebrow}>{hero.eyebrow}</p>
          <h1 className={styles.statement} data-split="intro">
            {hero.statement.lead}
            <em className={styles.em}>{hero.statement.em}</em>
            {hero.statement.tail}
          </h1>
          <p className={styles.bio}>{hero.bio}</p>
          <div className={styles.actions}>
            <ButtonPrimary href={hero.ctaHref}>{hero.ctaLabel}</ButtonPrimary>
            <a className={styles.resume} href={site.resumeHref} target="_blank" rel="noreferrer">
              {hero.resumeLabel}
            </a>
          </div>
        </Tile>

        <Tile span={4} rows={2} tone="plain" className={styles.portraitTile} intro>
          <Image
            className={styles.portrait}
            src={hero.portrait}
            alt={hero.portraitAlt}
            fill
            priority
            sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 360px"
          />
        </Tile>

        {/* learning · building · now — narrow, wide, narrow */}
        <Tile span={3} tone="outline" href={hero.learning.href} external className={`${styles.note} ${styles.learning}`} intro>
          <p className={styles.label}>
            <span className={styles.dot} aria-hidden="true" />
            {hero.learning.label}
          </p>
          <div className={styles.copy}>
            <p className={styles.title}>{hero.learning.title}</p>
            <p className={styles.detail}>{hero.learning.detail}</p>
          </div>
          <p className={styles.link}>{hero.learning.linkLabel}</p>
        </Tile>

        <Tile span={6} tone="outline" href={hero.building.href} external className={`${styles.note} ${styles.building}`} intro>
          <p className={styles.label}>
            <span className={styles.dot} aria-hidden="true" />
            {hero.building.label}
          </p>
          <div className={styles.copy}>
            <p className={styles.title}>{hero.building.title}</p>
            <p className={styles.detail}>{hero.building.body}</p>
          </div>
          <div className={styles.footer}>
            <p className={styles.stack}>{hero.building.stack}</p>
            <p className={styles.link}>{hero.building.linkLabel}</p>
          </div>
        </Tile>

        <Tile
          span={3}
          tone="clay"
          href={hero.status.href}
          className={`${styles.note} ${styles.onClay}`}
          intro
        >
          <p className={styles.label}>
            <span className={styles.pulse} aria-hidden="true" />
            {hero.status.label}
          </p>
          <p className={styles.title}>{hero.status.text}</p>
          <p className={styles.link}>{hero.status.linkLabel}</p>
        </Tile>
      </Bento>
    </section>
  );
}
