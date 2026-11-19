import Image from 'next/image';
import { experiences } from '@/content';
import styles from './Experience.module.css';

/*
 * Experience — a row of company cards. Each card leads with the company logo
 * set straight on the dark surface (the transparent PNGs are turned bone with
 * --logo-filter, no plate), then the dates, role and what was done below. Every
 * logo is scaled so its lettering is the same height (--logo-letters) and sits on
 * one shared baseline, from the measured `logoLetters` fractions in content.ts.
 * The current role carries a jade dot.
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
                  <Image
                    className={styles.logo}
                    src={role.logo}
                    alt={`${role.org} logo`}
                    sizes="360px"
                    data-duo={role.logoDuotone ? 'true' : undefined}
                    style={
                      role.logoLetters
                        ? ({ '--lt': role.logoLetters.top, '--lb': role.logoLetters.bottom } as React.CSSProperties)
                        : undefined
                    }
                  />
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
