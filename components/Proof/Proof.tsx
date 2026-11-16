import styles from './Proof.module.css';

/*
 * Proof — the names that make a recruiter stop, set at poster scale as the
 * first thing after the hero (work blueprint §2, "names as one paragraph",
 * kept to statement scale so it reads as a statement, not a second headline).
 *
 * Every name is real: the places Prajesh has worked and the things he has
 * shipped. No metaphor — just the pedigree, large.
 */
const names: { label: string; href?: string }[] = [
  { label: 'Amazon', href: '#work' },
  { label: 'NYU Courant', href: '#work' },
  { label: 'Shell', href: '#work' },
  { label: 'repo-scout', href: 'https://repo-scout.live/' },
  { label: 'MiniTensorCompiler', href: 'https://github.com/prajeshkumarg/MiniTensorCompiler' },
  { label: 'AnyLang', href: 'https://github.com/prajeshkumarg/anylang' },
  { label: 'OSIRIS Lab', href: 'https://osiris.cyber.nyu.edu/' },
];

export default function Proof() {
  return (
    <section className={styles.proof} aria-labelledby="proof-h">
      <div className="wrap">
        <p id="proof-h" className={styles.lead}>
          <span className={styles.caption} data-reveal>
            Built and shipped at
          </span>
          <span className={styles.names}>
            {names.map((n) => (
              <a key={n.label} className={styles.name} href={n.href} data-reveal>
                {n.label}
              </a>
            ))}
          </span>
        </p>
        <p className={styles.note} data-reveal>
          Three years shipping production software — now an MS at NYU, looking
          for a 2027 SDE role.
        </p>
      </div>
    </section>
  );
}
