import type { ReactNode } from 'react';
import styles from './Band.module.css';

type BandProps = {
  id: string;
  children: ReactNode;
  /** The section's own class — vertical padding and anything else it needs. */
  className?: string;
  tone?: 'ink' | 'sand';
};

/**
 * A full-bleed section on its own ground. It breaks out of the page shell to the
 * viewport edges and re-centres its content on the same column as everything else.
 */
export default function Band({ id, children, className, tone = 'ink' }: BandProps) {
  const classes = [styles.band, styles[tone], className ?? ''].filter(Boolean).join(' ');
  return (
    <section id={id} className={classes}>
      <div className={styles.inner}>{children}</div>
    </section>
  );
}
