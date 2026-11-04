import type { CSSProperties } from 'react';
import Image from 'next/image';
import SectionHeader from '@/components/SectionHeader/SectionHeader';
import { projects } from '@/content';
import type { Project } from '@/types';
import styles from './Projects.module.css';

/** Screenshot frame at the image's own aspect ratio, so nothing is cropped. */
function Shot({ project, sizes }: { project: Project; sizes: string }) {
  const ratio = project.image
    ? ({ '--media-ratio': `${project.image.width} / ${project.image.height}` } as CSSProperties)
    : undefined;
  return (
    <div className={styles.media} style={ratio}>
      {project.image ? (
        <Image
          className={styles.mediaImage}
          src={project.image}
          alt={project.imageAlt ?? ''}
          fill
          sizes={sizes}
        />
      ) : null}
    </div>
  );
}

/**
 * An index of projects with a live preview. Hovering or focusing a row swaps
 * the sticky preview (Motion drives `data-active`); the first project shows
 * by default, so it works without JS. Under 900px the preview hides and each
 * row carries its own screenshot and description.
 */
export default function Projects() {
  return (
    <section id="projects" className={styles.section} data-preview>
      <SectionHeader section="projects" />
      <div className={styles.layout}>
        <ol className={styles.list}>
          {projects.map((project, index) => (
            <li key={project.title} data-reveal>
              <a
                className={styles.row}
                href={project.href}
                target="_blank"
                rel="noreferrer"
                data-preview-trigger={index}
                data-active={index === 0 ? 'true' : undefined}
              >
                <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
                <span className={styles.main}>
                  <span className={styles.title}>{project.title}</span>
                  <span className={styles.tags}>
                    {project.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </span>
                </span>
                <span className={styles.link}>{project.linkLabel}</span>

                {/* phones only — the preview pane is hidden there */}
                <div className={styles.inline}>
                  <Shot project={project} sizes="100vw" />
                  <p className={styles.body}>{project.body}</p>
                </div>
              </a>
            </li>
          ))}
        </ol>

        <div className={styles.preview} data-reveal>
          {projects.map((project, index) => (
            <figure
              key={project.title}
              className={styles.figure}
              data-preview-item={index}
              data-active={index === 0 ? 'true' : undefined}
            >
              <Shot project={project} sizes="(max-width: 1200px) 40vw, 560px" />
              <figcaption className={styles.body}>{project.body}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
