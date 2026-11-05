import Image from 'next/image';
import SectionHeader from '@/components/SectionHeader/SectionHeader';
import { experiences } from '@/content';
import styles from './Experience.module.css';

/*
 * A ledger of roles. Each row is a wide band: meta + logo on the left rail, the
 * role and what you did on the right. The current role is marked. Clean rules
 * between rows, no cards — it reads like a printed CV, not a dashboard.
 */
export default function Experience() {
  return (
    <section id="work" className={styles.section}>
      <SectionHeader section="work" />
      <ol className={styles.list}>
        {experiences.map((role) => (
          <li
            key={role.org}
            className={styles.row}
            data-current={role.current ? 'true' : undefined}
            data-reveal
          >
            <div className={styles.rail}>
              <p className={styles.meta}>
                {role.current ? <span className={styles.now} aria-hidden="true" /> : null}
                {role.meta}
              </p>
              {role.logo ? (
                <Image className={styles.logo} src={role.logo} alt={`${role.org} logo`} sizes="120px" />
              ) : null}
            </div>
            <div className={styles.body}>
              <h3 className={styles.org}>{role.org}</h3>
              <p className={styles.role}>{role.role}</p>
              <ul className={styles.points}>
                {role.points.map((point) => (
                  <li key={point} className={styles.point}>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
