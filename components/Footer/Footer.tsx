import { site } from '@/content';
import styles from './Footer.module.css';

/*
 * Footer — a quiet close: copyright and a direct email link.
 */
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="wrap">
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
