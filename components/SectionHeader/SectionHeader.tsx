import { sections, type SectionKey } from '@/content';
import styles from './SectionHeader.module.css';

type SectionHeaderProps = {
  section: SectionKey;
  /** `ink` for the full-bleed Projects band; `center` for the closing Contact section. */
  variant?: 'ink' | 'center';
};

export default function SectionHeader({ section, variant }: SectionHeaderProps) {
  const { label, title } = sections[section];
  const className = variant ? `${styles.header} ${styles[variant]}` : styles.header;

  return (
    <header className={className}>
      <p className={styles.label} data-reveal>
        {label}
      </p>
      <h2 className={styles.title} data-split>
        {title.lead}
        <em className={styles.em}>{title.em}</em>
      </h2>
    </header>
  );
}
