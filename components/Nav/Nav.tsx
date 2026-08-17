import { navLinks, site } from '@/content';
import styles from './Nav.module.css';

export default function Nav() {
  const lastIndex = navLinks.length - 1;

  return (
    <header className={styles.bar}>
      <div className={styles.inner}>
        <span className={styles.wordmark}>
          {site.wordmark}
          <span className={styles.dot} aria-hidden="true">
            .
          </span>
        </span>
        <nav className={styles.links}>
          {navLinks.map((link, index) => {
            const external = link.href.startsWith('http');
            return (
              <a
                key={link.href}
                className={index === lastIndex ? styles.linkPrimary : styles.link}
                href={link.href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer' : undefined}
              >
                {link.label}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
