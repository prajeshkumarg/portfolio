import SectionHeader from '@/components/SectionHeader/SectionHeader';
import { writing } from '@/content';
import styles from './Writing.module.css';

export default function Writing() {
  return (
    <section id="blog" className={styles.section}>
      <SectionHeader section="writing" />
      <a className={styles.link} href={writing.href} target="_blank" rel="noreferrer" data-reveal>
        <span className={styles.text}>
          <span className={styles.title}>{writing.title}</span>
          <span className={styles.body}>{writing.body}</span>
        </span>
        <span className={styles.cta}>{writing.linkLabel}</span>
      </a>
    </section>
  );
}
