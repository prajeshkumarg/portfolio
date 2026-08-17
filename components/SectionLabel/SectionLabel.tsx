import styles from './SectionLabel.module.css';

type SectionLabelProps = {
  children: string;
  /** Centers the label and its tick mark (used by Contact). */
  centered?: boolean;
};

export default function SectionLabel({ children, centered }: SectionLabelProps) {
  return (
    <div className={centered ? `${styles.label} ${styles.centered}` : styles.label}>{children}</div>
  );
}
