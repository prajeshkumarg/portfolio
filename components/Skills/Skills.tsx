import { skillGroups } from '@/content';
import styles from './Skills.module.css';

/*
 * Skills — grouped capability columns (direction §7.4 "two-ended rows" adapted
 * to grouped lists). Each group opens with one plain word; its items sit under
 * it at small size. No boxes, no rules — groups are told apart by space.
 */
export default function Skills() {
  return (
    <section id="skills" className={styles.section} aria-labelledby="skills-h">
      <div className="wrap">
        <h2 id="skills-h" className={styles.heading} data-reveal>
          What I work with
        </h2>
        <div className={styles.groups}>
          {skillGroups.map((g) => (
            <div key={g.label} className={styles.group} data-reveal>
              <p className={styles.label}>{g.label}</p>
              <ul className={styles.items}>
                {g.items.map((item) => (
                  <li key={item} className={styles.item}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
