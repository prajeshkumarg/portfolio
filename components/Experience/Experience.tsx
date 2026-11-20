import Image from 'next/image';
import { experiences } from '@/content';
import styles from './Experience.module.css';

/*
 * Experience — a bento row of company cards. Each card leads with a large logo
 * panel on the company's own brand colour (the banner logos already carry it),
 * then the dates, role and what was done below. The current role carries a jade
 * dot. This is the "logo-forward card" layout, restyled for the green-black
 * ground. On phones (<=600px) the cards give way to a compact table of tappable
 * <details> rows.
 */


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
              <div className={styles.logoPanel}>
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

        {/* phone (<=600px): one compact row per job; tap a row to open its bullets */}
        <ol className={styles.phoneList}>
          {experiences.map((role) => (
            <li key={role.org} data-reveal>
              <details className={styles.prow}>
                <summary className={styles.psum}>
                  <span className={styles.ptile}>
                    {role.logo ? (
                      <Image className={styles.plogo} src={role.logo} alt="" sizes="48px" />
                    ) : null}
                  </span>
                  <span className={styles.ptext}>
                    <span className={styles.porg}>{role.org}</span>
                    <span className={styles.prole}>{role.role}</span>
                  </span>
                  <span className={styles.pyears}>{role.years}</span>
                  <span className={styles.pchev} aria-hidden="true" />
                </summary>
                <ul className={styles.ppoints}>
                  {role.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </details>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
