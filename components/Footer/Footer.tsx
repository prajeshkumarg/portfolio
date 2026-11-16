import { site } from '@/content';
import styles from './Footer.module.css';

/*
 * Footer — a designed close: the name returns at full width, with the
 * copyright and a direct email link beneath it.
 */
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="wrap">
        <p className={styles.wordmark} aria-hidden="true">
          {site.wordmark}
        </p>
        <div className={styles.meta}>
          <p>{site.copyright}</p>
          <p className={styles.credit}>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
