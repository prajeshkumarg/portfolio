import { Bento, Tile } from '@/components/Bento/Bento';
import SectionHeader from '@/components/SectionHeader/SectionHeader';
import { contact, contactLinks } from '@/content';
import styles from './Contact.module.css';

/* resume and GitHub stack beside the email tile; the last two share a row */
const spans = [4, 4, 6, 6] as const;

export default function Contact() {
  return (
    <section id="contact" className={styles.section}>
      <SectionHeader section="contact" />
      <Bento>
        <Tile span={8} rows={2} tone="accent" href={contact.ctaHref} className={styles.email}>
          <p className={styles.label}>{contact.label}</p>
          <div className={styles.copy}>
            <h3 className={styles.heading}>{contact.heading}</h3>
            <p className={styles.body}>{contact.body}</p>
          </div>
          <p className={styles.address}>
            {contact.ctaLabel}
            <span className={styles.arrow}>{contact.arrow}</span>
          </p>
        </Tile>

        {contactLinks.map((link, index) => (
          <Tile
            key={link.label}
            span={spans[index % spans.length]}
            tone={index === 0 ? 'ink' : 'card'}
            href={link.href}
            external
            className={index === 0 ? `${styles.linkTile} ${styles.onInk}` : styles.linkTile}
          >
            <p className={styles.linkLabel}>{link.label}</p>
            <p className={styles.linkValue}>
              {link.value}
              <span className={styles.arrow}>{contact.arrow}</span>
            </p>
          </Tile>
        ))}
      </Bento>
    </section>
  );
}
