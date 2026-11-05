import ButtonPrimary from '@/components/ButtonPrimary/ButtonPrimary';
import SectionHeader from '@/components/SectionHeader/SectionHeader';
import { contact, contactLinks } from '@/content';
import styles from './Contact.module.css';

/*
 * The closing panel. A centred statement and the email CTA, then a row of the
 * other links. Reads like the back cover — a sign-off, not another grid.
 */
export default function Contact() {
  return (
    <section id="contact" className={styles.section}>
      <SectionHeader section="contact" variant="center" />
      <div className={styles.panel} data-reveal>
        <h3 className={styles.heading}>{contact.heading}</h3>
        <p className={styles.body}>{contact.body}</p>
        <ButtonPrimary href={contact.ctaHref}>{`${contact.ctaLabel} ${contact.arrow}`}</ButtonPrimary>
      </div>
      <ul className={styles.links} data-reveal>
        {contactLinks.map((link) => (
          <li key={link.label}>
            <a className={styles.link} href={link.href} target="_blank" rel="noreferrer">
              <span className={styles.linkLabel}>{link.label}</span>
              <span className={styles.linkValue}>
                {link.value} <span aria-hidden="true">{contact.arrow}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
