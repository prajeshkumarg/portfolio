import Image from 'next/image';
import { experiences } from '@/content';
import styles from './Experience.module.css';

/*
 * Experience — a bento row of company cards. Each card leads with a large logo
 * panel on the company's own brand colour (the banner logos already carry it),
 * then the dates, role and what was done below. The current role carries a jade
 * dot. This is the "logo-forward card" layout, restyled for the green-black
 * ground.
 */

// a uniform white plate for every logo, so dark/colour marks all read cleanly
// and the row looks consistent on the green-black ground
const PLATE = '#ffffff';

export default function Experience() {
  return (
    <section id="work" className={styles.section} aria-labelledby="work-h">
      <div className="wrap">
        <h2 id="work-h" className={styles.heading} data-reveal>
          Where I have worked
        </h2>
        <ol className={styles.grid}>
          {experiences.map((role) => (
            <li
              key={role.org}
              className={styles.card}
              data-current={role.current ? 'true' : undefined}
              data-reveal
            >
              <div className={styles.logoPanel} style={{ background: PLATE }}>
                {role.logo ? (
                  <Image className={styles.logo} src={role.logo} alt={`${role.org} logo`} sizes="360px" />
                ) : (
                  <span className={styles.logoText}>{role.org}</span>
                )}
              </div>

              <div className={styles.body}>
                <p className={styles.meta}>
                  {role.current ? <span className={styles.now} aria-hidden="true" /> : null}
                  {role.meta}
                </p>
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
      </div>
    </section>
  );
}
