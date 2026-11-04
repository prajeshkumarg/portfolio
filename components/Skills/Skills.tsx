import Band from '@/components/Band/Band';
import SectionHeader from '@/components/SectionHeader/SectionHeader';
import { skillGroups } from '@/content';
import styles from './Skills.module.css';

export default function Skills() {
  return (
    <Band id="skills" className={styles.section}>
      <SectionHeader section="skills" variant="ink" />
      {/* one column per group, no boxes */}
      <div className={styles.table}>
        {skillGroups.map((group) => (
          <div key={group.label} className={styles.group} data-reveal>
            <h3 className={styles.groupLabel}>{group.label}</h3>
            <ul className={styles.items}>
              {group.items.map((item) => (
                <li key={item} className={styles.item}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Band>
  );
}
