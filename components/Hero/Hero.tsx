import ButtonPrimary from '@/components/ButtonPrimary/ButtonPrimary';
import { hero, sideNavFooterLink, sideNavLinks, site } from '@/content';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section id="top" className={styles.hero}>
      <div className={styles.side}>
        {sideNavLinks.map((link) => (
          <a key={link.href} className={styles.sideLink} href={link.href}>
            {link.label}
          </a>
        ))}
        <span className={styles.sideRule} aria-hidden="true" />
        <a className={styles.sideLink} href={sideNavFooterLink.href}>
          {sideNavFooterLink.label}
        </a>
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

      {/* every word stays in the DOM and in reading order — the cycle is purely visual */}
      <p className={styles.rotator}>
        {hero.rotating.map((word) => (
          <span key={word} className={styles.word}>
            {word}
          </span>
        ))}
      </p>
    </section>
  );
}
