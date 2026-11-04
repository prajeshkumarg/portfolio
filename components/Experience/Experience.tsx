import type { CSSProperties } from 'react';
import Image from 'next/image';
import Band from '@/components/Band/Band';
import SectionHeader from '@/components/SectionHeader/SectionHeader';
import { experiences } from '@/content';
import type { Experience as Role } from '@/types';
import styles from './Experience.module.css';

/*
 * Logos are optically aligned, not box-aligned: each is scaled so its lettering
 * is the same height, and dropped so the lettering sits on one shared baseline.
 * Whatever sits below the letters (Amazon's smile, the foot of NYU's box) hangs
 * under that line, as it would in print. Without measurements, a logo just
 * sits on the line at the lettering height.
 */
function logoVars(role: Role): CSSProperties {
  const { top, bottom } = role.logoLetters ?? { top: 0, bottom: 1 };
  const letters = bottom - top;
  return {
    '--logo-scale': 1 / letters,
    '--logo-drop': (1 - bottom) / letters,
  } as CSSProperties;
}

/*
 * Open tabs: the company wordmarks head three columns, every panel open, so all
 * roles are visible at once. Columns are a subgrid of the same two rows (logo ·
 * details), so the details start on one line; thin vertical rules divide them.
 */
export default function Experience() {
  return (
    <Band id="work" tone="sand" className={styles.section}>
      <SectionHeader section="work" />
      <ol className={styles.tabs}>
        {experiences.map((role) => (
          <li
            key={role.org}
            className={styles.tab}
            data-current={role.current ? 'true' : undefined}
            data-reveal
          >
            {/* the wordmark is the heading; the name is kept for screen readers */}
            <div className={styles.head}>
              {role.logo ? (
                <Image
                  className={styles.logo}
                  src={role.logo}
                  alt=""
                  sizes="280px"
                  style={logoVars(role)}
                />
              ) : null}
              <h3 className={styles.org}>{role.org}</h3>
            </div>
            <div className={styles.panel}>
              <p className={styles.meta}>{role.meta}</p>
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
    </Band>
  );
}
