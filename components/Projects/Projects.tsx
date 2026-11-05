import type { CSSProperties } from 'react';
import Image from 'next/image';
import SectionHeader from '@/components/SectionHeader/SectionHeader';
import { projects } from '@/content';
import styles from './Projects.module.css';

/*
 * Big alternating project rows: a numbered index, the screenshot on one side and
 * the write-up on the other, sides swapping down the list. Each is a full-card
 * link. No hover-to-swap JS — every project is laid out and readable at rest.
 */
export default function Projects() {
  return (
    <section id="projects" className={styles.section}>
      <SectionHeader section="projects" />
      <ol className={styles.list}>
        {projects.map((project, index) => {
          const ratio = project.image
            ? ({ '--ratio': `${project.image.width} / ${project.image.height}` } as CSSProperties)
            : undefined;
          return (
            <li key={project.title} className={styles.item} data-reveal>
              <a className={styles.card} href={project.href} target="_blank" rel="noreferrer">
                <div className={styles.media} style={ratio}>
                  {project.image ? (
                    <Image
                      className={styles.image}
                      src={project.image}
                      alt={project.imageAlt ?? ''}
                      fill
                      sizes="(max-width: 860px) 100vw, 560px"
                    />
                  ) : null}
                </div>
                <div className={styles.text}>
                  <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
                  <h3 className={styles.title}>{project.title}</h3>
                  <p className={styles.body}>{project.body}</p>
                  <ul className={styles.tags}>
                    {project.tags.map((tag) => (
                      <li key={tag} className={styles.tag}>
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <span className={styles.link}>{project.linkLabel}</span>
                </div>
              </a>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
