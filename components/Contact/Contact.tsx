import { site, contact, contactLinks } from '@/content';
import styles from './Contact.module.css';

/*
 * Contact — the close. The pitch sits first at display scale; the ways to reach
 * Prajesh follow as a two-column grid of link blocks (label above its value, no
 * bars); the jade button sends the email. No form.
 */
export default function Contact() {
  return (
    <section id="contact" className={styles.section} aria-labelledby="contact-h">
      <div className="wrap">
        <h2 id="contact-h" className={styles.pitch} data-reveal>
          {contact.heading}
        </h2>
        <p className={styles.body} data-reveal>
          {contact.body}
        </p>

        <ul className={styles.rows}>
          {contactLinks.map((l) => (
            <li key={l.label} data-reveal>
              <a className={styles.rowLink} href={l.href} target="_blank" rel="noreferrer">
                <span className={styles.rowLabel}>{l.label}</span>
                <span className={styles.rowValue}>{l.value}</span>
              </a>
            </li>
          ))}
        </ul>

        <a className={styles.cta} href={contact.ctaHref} data-reveal>
          {site.email}
          <span className={styles.arrow} aria-hidden="true">
            →
          </span>
        </a>
      </div>
    </section>
  );
}
