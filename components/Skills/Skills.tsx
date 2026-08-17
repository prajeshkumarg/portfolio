import Card3D from '@/components/Card3D/Card3D';
import SectionLabel from '@/components/SectionLabel/SectionLabel';
import Chip from '@/components/Chip/Chip';
import { skillGroups } from '@/content';
import styles from './Skills.module.css';

export default function Skills() {
  return (
    <section id="skills" className={styles.section}>
      <SectionLabel>SKILLS</SectionLabel>
      <div className={styles.stage}>
        <Card3D className={styles.panel}>
          {skillGroups.map((group) => (
            <div key={group.label}>
              <h3 className={styles.groupLabel}>{group.label}</h3>
              <div className={styles.chips}>
                {group.items.map((item) => (
                  <Chip key={item}>{item}</Chip>
                ))}
              </div>
            </div>
          ))}
        </Card3D>
      </div>
    </section>
  );
}
