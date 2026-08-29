import { Fragment } from 'react';
import Image from 'next/image';
import ButtonPrimary from '@/components/ButtonPrimary/ButtonPrimary';
import { hero, sideWords, site } from '@/content';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section id="top" className={styles.hero}>
      {/* vertical side rail — plain words, not links; the rule sits between
          the second and third */}
      <div className={styles.side}>
        {sideWords.map((word, index) => (
          <Fragment key={word}>
            <span className={styles.sideWord}>{word}</span>
            {index === 1 ? <span className={styles.sideRule} aria-hidden="true" /> : null}
          </Fragment>
        ))}
      </div>

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

      {/* col 3 — the portrait, replacing the rotating words. Circular frame,
          3D tilt on hover, slow bounce; all motion is CSS. */}
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
      </div>
    </section>
  );
}
