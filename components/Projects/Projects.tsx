import Image from 'next/image';
import { projects } from '@/content';
import styles from './Projects.module.css';

/*
 * Projects — the real work, large. Each project is a wide row: the screenshot
 * on one side (sides alternate so neighbouring rows differ), the name, one
 * sentence, the stack as plain words, and a link. The screenshots are the
 * page's dominant pictures; they count toward the imagery floor.
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
              {p.image ? (
                <figure className={styles.media}>
                  <Image
                    src={p.image}
                    alt={p.imageAlt ?? `${p.title} screenshot`}
                    sizes="(max-width: 860px) 100vw, 55vw"
                  />
                </figure>
              ) : null}
              <div className={styles.text}>
                <h3 className={styles.title}>{p.title}</h3>
                <p className={styles.body}>{p.body}</p>
                <p className={styles.stack}>{p.tags.join('  ·  ')}</p>
                <a className={styles.link} href={p.href} target="_blank" rel="noreferrer">
                  {p.linkLabel}
                </a>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
