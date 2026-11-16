import Image from 'next/image';
import { education } from '@/content';
import styles from './Education.module.css';

/*
 * Education — two rows, each the degree large with the institution and dates
 * beneath. The mark sits at the left on a white plate. No cards.
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
            <li key={e.institution} className={styles.row} data-reveal>
              {e.logo ? (
                <Image className={styles.logo} src={e.logo} alt={`${e.institution} logo`} sizes="56px" />
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
