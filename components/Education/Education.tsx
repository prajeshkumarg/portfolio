import Image from 'next/image';
import { education } from '@/content';
import styles from './Education.module.css';

/*
 * Education — white cards, one per degree: a white logo panel on the left with
 * the mark filling it, and the degree, institution and dates in dark ink on the
 * card's white ground. Light cards are a deliberate break from the dark page,
 * like the old awwwards layout.
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
                  <Image className={styles.logo} src={e.logo} alt={`${e.institution} logo`} sizes="260px" />
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

        {/* phone (<=600px): the same row pattern as Experience, not expandable */}
        <ol className={styles.phoneList}>
          {education.map((e) => (
            <li key={e.institution} className={styles.prow} data-reveal>
              <span className={styles.ptile}>
                {e.logo ? <Image className={styles.plogo} src={e.logo} alt="" sizes="48px" /> : null}
              </span>
              <span className={styles.ptext}>
                <span className={styles.pschool}>{e.schoolShort}</span>
                <span className={styles.pdegree}>{e.degreeShort}</span>
              </span>
              <span className={styles.pyears}>{e.years}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
