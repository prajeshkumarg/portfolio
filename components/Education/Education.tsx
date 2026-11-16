import Image from 'next/image';
import { education } from '@/content';
import styles from './Education.module.css';

/*
 * Education — white cards, one per degree: a brand-coloured logo panel on the
 * left (NYU purple, VIT white), the degree, institution and dates in dark ink
 * on the card's white ground. The light cards are a deliberate break from the
 * dark page, like the old awwwards layout.
 */

// logo-panel colour per institution
function plateFor(institution: string): string {
  if (institution.toLowerCase().includes('nyu')) return '#57068c';
  return '#f3f1ea';
}

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
                <div className={styles.logoPanel} style={{ background: plateFor(e.institution) }}>
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
