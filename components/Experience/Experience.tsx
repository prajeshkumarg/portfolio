import Image from 'next/image';
import Card3D from '@/components/Card3D/Card3D';
import SectionLabel from '@/components/SectionLabel/SectionLabel';
import { experiences } from '@/content';
import styles from './Experience.module.css';

export default function Experience() {
  return (
    <section id="work" className={styles.section}>
      <SectionLabel>EXPERIENCE</SectionLabel>
      <div className={styles.grid}>
        {experiences.map((item) => (
          <Card3D key={item.org} className={styles.card}>
            {/* Band is held whether or not a logo exists yet, so the three cards
                stay aligned while the images land one at a time. */}
            <div className={styles.logo} data-plate={item.logoPlate ? 'true' : undefined}>
              {item.logo ? (
                <Image
                  className={styles.logoImage}
                  src={item.logo}
                  alt={item.org}
                  fill
                  sizes="(max-width: 900px) 100vw, 360px"
                />
              ) : null}
            </div>
            <p className={styles.meta}>{item.meta}</p>
            <h3 className={styles.org}>{item.org}</h3>
            <p className={styles.role}>{item.role}</p>
            <p className={styles.body}>{item.body}</p>
          </Card3D>
        ))}
      </div>
    </section>
  );
}
