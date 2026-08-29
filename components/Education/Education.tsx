import Image from 'next/image';
import Card3D from '@/components/Card3D/Card3D';
import SectionLabel from '@/components/SectionLabel/SectionLabel';
import { education } from '@/content';
import styles from './Education.module.css';

export default function Education() {
  return (
    <section id="education" className={styles.section}>
      <SectionLabel>EDUCATION</SectionLabel>
      <div className={styles.grid}>
        {education.map((entry) => (
          <Card3D key={entry.institution} className={styles.card}>
            {/* band fills the card's left edge, bleeding to the border — the
                card's corners are rounded here because the card cannot clip
                (overflow would flatten the 3D tilt) */}
            {entry.logo ? (
              <div
                className={styles.cardLogoWrap}
                data-plate={entry.logoPlate ? 'true' : undefined}
              >
                <Image className={styles.cardLogo} src={entry.logo} alt="" fill sizes="180px" />
              </div>
            ) : null}
            <div className={styles.cardBody}>
              <h3 className={styles.degree}>{entry.degree}</h3>
              <p className={styles.institution}>{entry.institution}</p>
              <p className={styles.meta}>{entry.meta}</p>
            </div>
          </Card3D>
        ))}
      </div>
    </section>
  );
}
