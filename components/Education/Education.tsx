import Card3D from '@/components/Card3D/Card3D';
import SectionLabel from '@/components/SectionLabel/SectionLabel';
import { education } from '@/content';
import styles from './Education.module.css';

export default function Education() {
  return (
    <section id="education" className={styles.section}>
      <SectionLabel>EDUCATION</SectionLabel>
      <div className={styles.stage}>
        <Card3D className={styles.panel}>
          {education.map((entry, index) => (
            <div
              key={entry.institution}
              className={index < education.length - 1 ? styles.row : `${styles.row} ${styles.rowLast}`}
            >
              <div className={styles.rowMain}>
                <h3 className={styles.degree}>{entry.degree}</h3>
                <p className={styles.institution}>{entry.institution}</p>
              </div>
              <div className={styles.rowMeta}>
                <p className={styles.meta}>{entry.meta}</p>
              </div>
            </div>
          ))}
        </Card3D>
      </div>
    </section>
  );
}
