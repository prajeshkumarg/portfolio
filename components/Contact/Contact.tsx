import SectionLabel from '@/components/SectionLabel/SectionLabel';
import ButtonPrimary from '@/components/ButtonPrimary/ButtonPrimary';
import { contact, socialLinks } from '@/content';
import styles from './Contact.module.css';

export default function Contact() {
  return (
    <section id="contact" className={styles.section}>
      <SectionLabel centered>{contact.label}</SectionLabel>
      <h2 className={styles.heading}>{contact.heading}</h2>
      <p className={styles.body}>{contact.body}</p>
      <div className={styles.cta}>
        <ButtonPrimary href={contact.ctaHref}>{contact.ctaLabel}</ButtonPrimary>
      </div>
      <div className={styles.socials}>
        {socialLinks.map((link) => (
          <a key={link.label} className={styles.social} href={link.href} target="_blank" rel="noreferrer">
            {link.label}
          </a>
        ))}
      </div>
    </section>
  );
}
