import Card3D from '@/components/Card3D/Card3D';
import SectionLabel from '@/components/SectionLabel/SectionLabel';
import { writing } from '@/content';
import styles from './Writing.module.css';

export default function Writing() {
  return (
    <section id="blog" className={styles.section}>
      <SectionLabel>WRITING</SectionLabel>
      <div className={styles.stage}>
        <Card3D
          as="a"
          className={styles.card}
          href={writing.href}
          target="_blank"
          rel="noreferrer"
        >
          <h3 className={styles.title}>{writing.title}</h3>
          <p className={styles.body}>
            {writing.body}{' '}
            <span className={styles.link}>{writing.linkLabel}</span>
          </p>
        </Card3D>
      </div>
    </section>
  );
}
