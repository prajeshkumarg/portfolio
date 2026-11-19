'use client';

/*
 * Projects — a split index/preview. Left: the list of project names. Right: a
 * sticky preview that shows the hovered (or focused) project's screenshot, its
 * one-line description and its stack. Defaults to the first project; the
 * preview follows hover/focus on desktop. On phone it collapses to stacked
 * rows, each with its own inline image, so nothing depends on hover.
 */

import { useState } from 'react';
import Image from 'next/image';
import { projects } from '@/content';
import styles from './Projects.module.css';

export default function Projects() {
  const [active, setActive] = useState(0);
  const current = projects[active];

  return (
    <section id="projects" className={styles.section} aria-labelledby="projects-h">
      <div className="wrap">
        <h2 id="projects-h" className={styles.heading} data-reveal>
          Things I have built
        </h2>

        <div className={styles.split} data-reveal>
          {/* left: the index of names */}
          <ol className={styles.list}>
            {projects.map((p, i) => (
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
                  {p.image ? (
                    <figure className={styles.inlineMedia}>
                      <Image src={p.image} alt={p.imageAlt ?? `${p.title} screenshot`} sizes="100vw" />
                    </figure>
                  ) : null}
                  <p className={styles.caption}>{p.body}</p>
                  <p className={styles.stack}>{p.tags.join('  ·  ')}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* right: the sticky preview of the active project */}
          <div className={styles.preview} aria-hidden="true">
            <div className={styles.previewInner}>
              {current.image ? (
                <figure className={styles.media}>
                  <Image
                    key={current.title}
                    src={current.image}
                    alt={current.imageAlt ?? `${current.title} screenshot`}
                    sizes="(min-width: 860px) 45vw, 100vw"
                  />
                </figure>
              ) : null}
              <p className={styles.caption}>{current.body}</p>
              <p className={styles.stack}>{current.tags.join('  ·  ')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
