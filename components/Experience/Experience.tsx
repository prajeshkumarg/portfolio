import { experiences } from '@/content';
import styles from './Experience.module.css';

/*
 * Experience — a ledger of roles (direction §7.1 "side facts, wide paragraph").
 * Left rail: dates, place, and the logo. Right: the org large, the role, and
 * what was done. The current role carries a jade dot. No cards, no rules drawn
 * between rows — the space and the scale do the separating.
 */
export default function Experience() {
  return (
    <section id="work" className={styles.section} aria-labelledby="work-h">
      <div className="wrap">
        <h2 id="work-h" className={styles.heading} data-reveal>
          Where I have worked
        </h2>
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
      </div>
    </section>
  );
}
