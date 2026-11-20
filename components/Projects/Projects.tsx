'use client';

/*
 * Projects — a split index/preview. Left: the list of project names. Right: a
 * sticky preview that shows the hovered (or focused) project's architecture
 * diagram, its one-line description and its stack. Defaults to the first
 * project; the preview follows hover/focus on desktop. On phone it collapses
 * to stacked rows, each with its own inline diagram, so nothing depends on
 * hover.
 *
 * Each diagram is a hand-authored inline SVG in the shared --viz-* system
 * (no screenshots). Only the active diagram animates its edges and key-idea
 * pulse; motion is disabled under prefers-reduced-motion in the CSS.
 */

import { useState } from 'react';
import { projects, projectsCopy } from '@/content';
import { diagrams } from './diagrams';
import styles from './Projects.module.css';

export default function Projects() {
  const [active, setActive] = useState(0);
  const current = projects[active];
  const CurrentDiagram = diagrams[current.diagram];

  return (
    <section id="projects" className={styles.section} aria-labelledby="projects-h">
      <div className="wrap">
        <h2 id="projects-h" className={styles.heading} data-reveal>
          Things I have built
        </h2>

        <div className={styles.split} data-reveal>
          {/* left: the index of names */}
          <ol className={styles.list}>
            {projects.map((p, i) => {
              const Diagram = diagrams[p.diagram];
              return (
                <li key={p.title}>
                  <a
                    className={styles.item}
                    href={p.href}
                    target="_blank"
                    rel="noreferrer"
                    data-active={i === active ? 'true' : undefined}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                  >
                    <span className={styles.name}>{p.title}</span>
                    <span className={styles.arrow} aria-hidden="true">
                      ↗
                    </span>
                  </a>
                  {/* phone-only inline preview for this project */}
                  <div className={styles.inline}>
                    <div className={styles.viz}>
                      <Diagram />
                    </div>
                    <p className={styles.caption}>{p.body}</p>
                    <p className={styles.stack}>{p.tags.join(' · ')}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* right: the sticky preview of the active project */}
          <div className={styles.preview} aria-hidden="true">
            <div className={styles.previewInner}>
              <div className={`${styles.viz} ${styles.vizActive}`}>
                <CurrentDiagram key={current.title} />
              </div>
              <p className={styles.caption}>{current.body}</p>
              <p className={styles.stack}>{current.tags.join(' · ')}</p>
            </div>
          </div>
        </div>

        {/* phone (<=600px): a plain list — name, one-liner, link; the diagram,
            description and tags sit behind a "Show diagram" toggle */}
        <ol className={styles.phoneList}>
          {projects.map((p) => {
            const Diagram = diagrams[p.diagram];
            return (
              <li key={p.title} className={styles.prow} data-reveal>
                <div className={styles.phead}>
                  <div className={styles.ptitles}>
                    <span className={styles.pname}>{p.title}</span>
                    <span className={styles.pshort}>{p.short}</span>
                  </div>
                  <a
                    className={styles.plink}
                    href={p.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${p.title}: ${p.linkLabel}`}
                  >
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
                <details className={styles.pmore}>
                  <summary className={styles.ptoggle}>{projectsCopy.showDiagram}</summary>
                  <div className={styles.pscroll}>
                    <div className={styles.pdiagram}>
                      <Diagram />
                    </div>
                  </div>
                  <p className={styles.caption}>{p.body}</p>
                  <p className={styles.stack}>{p.tags.join(' · ')}</p>
                </details>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
