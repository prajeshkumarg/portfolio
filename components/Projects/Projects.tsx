import Image from 'next/image';
import { projects } from '@/content';
import styles from './Projects.module.css';

/*
 * Projects — a list, one project per row. Each row: the name large, a one-line
 * description and the stack, with a small thumbnail at the right end and the
 * whole row linking out. Rows are separated by space and a hover wash, no
 * boxes — a scannable index of the work.
 */
export default function Projects() {
  return (
    <section id="projects" className={styles.section} aria-labelledby="projects-h">
      <div className="wrap">
        <h2 id="projects-h" className={styles.heading} data-reveal>
          Things I have built
        </h2>
        <ol className={styles.list}>
          {projects.map((p) => (
            <li key={p.title} className={styles.row} data-reveal>
              <a className={styles.link} href={p.href} target="_blank" rel="noreferrer">
                <div className={styles.text}>
                  <h3 className={styles.title}>{p.title}</h3>
                  <p className={styles.body}>{p.body}</p>
                  <p className={styles.stack}>{p.tags.join('  ·  ')}</p>
                </div>
                {p.image ? (
                  <figure className={styles.thumb}>
                    <Image
                      src={p.image}
                      alt={p.imageAlt ?? `${p.title} screenshot`}
                      sizes="320px"
                    />
                  </figure>
                ) : null}
                <span className={styles.arrow} aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
