import Image from 'next/image';
import ButtonPrimary from '@/components/ButtonPrimary/ButtonPrimary';
import { hero, sideCaption, site } from '@/content';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section id="top" className={styles.hero}>

      <div className={styles.intro}>
        <h1 className={styles.greeting}>
          {hero.greeting.lead}
          <span className={styles.greetingName}>{hero.greeting.name}</span>
        </h1>
        <p className={styles.bio}>{hero.bio}</p>
        <div className={styles.actions}>
          <ButtonPrimary href={hero.ctaHref}>{hero.ctaLabel}</ButtonPrimary>
          <a className={styles.resume} href={site.resumeHref} target="_blank" rel="noreferrer">
            {hero.resumeLabel}
          </a>
        </div>
      </div>

      {/* col 2 — the portrait in a circular frame, with the former side-rail
          words as a subscript caption underneath */}
      <div className={styles.portraitStage}>
        <div className={styles.portraitFrame}>
          <Image
            className={styles.portrait}
            src={hero.portrait}
            alt={hero.portraitAlt}
            fill
            priority
            sizes="(max-width: 900px) 60vw, 320px"
          />
        </div>
        <p className={styles.portraitCaption}>{sideCaption}</p>
      </div>
    </section>
  );
}
