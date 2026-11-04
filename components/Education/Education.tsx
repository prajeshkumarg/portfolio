import Image from 'next/image';
import SectionHeader from '@/components/SectionHeader/SectionHeader';
import { education } from '@/content';
import styles from './Education.module.css';

export default function Education() {
  return (
    <section id="education" className={styles.section}>
      <SectionHeader section="education" />
      <ul className={styles.rows}>
        {education.map((entry) => (
          <li key={entry.institution} className={styles.row} data-reveal>
            {/* no frame — the mark keeps its own shape (plated only if it has a baked-in field) */}
            {entry.logo ? (
              <Image
                className={styles.logo}
                src={entry.logo}
                alt=""
                sizes="180px"
                data-plate={entry.logoPlate ? 'true' : undefined}
              />
            ) : null}
            <div className={styles.body}>
              <h3 className={styles.degree}>{entry.degree}</h3>
              <p className={styles.institution}>{entry.institution}</p>
            </div>
            <p className={styles.meta}>{entry.meta}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
