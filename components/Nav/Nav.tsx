import { navLinks, site } from '@/content';
import styles from './Nav.module.css';

/*
 * No nav over the scene — it reads as a clean cover. Motion adds `isShown` once
 * the camera has flown past, so the bar slides in with the content.
 */
export default function Nav() {
  const lastIndex = navLinks.length - 1;

  return (
    <header className={styles.bar} data-nav>
      <div className={styles.inner}>
        <a className={styles.wordmark} href="#top">
          {site.wordmark}
          <span className={styles.dot} aria-hidden="true">
            .
          </span>
        </a>
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
      {/* scroll progress — scrubbed by Motion */}
      <span className={styles.rail} aria-hidden="true" data-rail />
    </header>
  );
}
