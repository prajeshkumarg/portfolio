import Image from 'next/image';
import { education } from '@/content';
import styles from './Education.module.css';

/*
 * Education — dark cards, one per degree: the school's logo on the left, set
 * straight on the card surface and turned bone by --logo-filter (no plate), then
 * the degree, institution and dates in light ink.
 */

export default function Education() {
  return (
    <section id="education" className={styles.section} aria-labelledby="edu-h">
      <div className="wrap">
        <h2 id="edu-h" className={styles.heading} data-reveal>
          Where I studied
        </h2>
        <ol className={styles.list}>
          {education.map((e) => (
            <li key={e.institution} className={styles.card} data-reveal>
              {e.logo ? (
                <div className={styles.logoPanel}>
                  <Image className={styles.logo} src={e.logo} alt={`${e.institution} logo`} sizes="200px" />
                </div>
              ) : null}
              <div className={styles.text}>
                <h3 className={styles.degree}>{e.degree}</h3>
                <p className={styles.inst}>{e.institution}</p>
                <p className={styles.meta}>{e.meta}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
