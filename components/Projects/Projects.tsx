import type { CSSProperties } from 'react';
import Image from 'next/image';
import Card3D from '@/components/Card3D/Card3D';
import SectionLabel from '@/components/SectionLabel/SectionLabel';
import { projects } from '@/content';
import styles from './Projects.module.css';

export default function Projects() {
  return (
    <section id="projects" className={styles.section}>
      <SectionLabel>PROJECTS</SectionLabel>
      <div className={styles.grid}>
        {projects.map((project) => (
          <Card3D
            key={project.title}
            as="a"
            className={styles.card}
            href={project.href}
            target="_blank"
            rel="noreferrer"
          >
            <p className={styles.meta}>{project.meta}</p>
            <h3 className={styles.title}>{project.title}</h3>
            <p className={styles.body}>
              {project.body} <span className={styles.link}>{project.linkLabel}</span>
            </p>
            {/* Space is held whether or not a screenshot exists yet. When one is
                present the slot takes the image's own aspect ratio, so diagrams
                are never cropped to fit a fixed box. */}
            <div
              className={styles.media}
              style={
                project.image
                  ? ({
                      '--media-ratio': `${project.image.width} / ${project.image.height}`,
                    } as CSSProperties)
                  : undefined
              }
            >
              {project.image ? (
                <Image
                  className={styles.mediaImage}
                  src={project.image}
                  alt={project.imageAlt ?? ''}
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                />
              ) : null}
            </div>
          </Card3D>
        ))}
      </div>
    </section>
  );
}
