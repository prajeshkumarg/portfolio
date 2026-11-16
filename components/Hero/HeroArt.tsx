import styles from './HeroArt.module.css';

/*
 * HeroArt — a CSS-animated SVG kinetic illustration for the hero's empty right
 * half. An orbital system: concentric rings, orbiting nodes on counter-rotating
 * tracks, and a set of sweeping arcs, all drawn in the jade accent and bone at
 * low opacity so it reads as structure, not decoration. Pure SVG + CSS — no JS,
 * no library. Every motion stops under prefers-reduced-motion (handled in CSS),
 * leaving a clean static composition.
 *
 * aria-hidden: it carries no information the text does not; it is atmosphere.
 */
export default function HeroArt() {
  return (
    <div className={styles.art} aria-hidden="true">
      <svg
        className={styles.svg}
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* concentric rings, faint */}
        <g className={styles.rings}>
          <circle cx="200" cy="200" r="60" />
          <circle cx="200" cy="200" r="110" />
          <circle cx="200" cy="200" r="160" />
          <circle cx="200" cy="200" r="196" />
        </g>

        {/* sweeping arcs that rotate slowly, each its own speed */}
        <g className={styles.arcA}>
          <path d="M200 40 A160 160 0 0 1 360 200" className={styles.arcStroke} />
        </g>
        <g className={styles.arcB}>
          <path d="M200 90 A110 110 0 0 1 90 200" className={styles.arcStroke} />
        </g>

        {/* orbiting nodes on counter-rotating tracks */}
        <g className={styles.orbitOuter}>
          <circle cx="200" cy="4" r="6" className={styles.node} />
        </g>
        <g className={styles.orbitMid}>
          <circle cx="200" cy="90" r="4.5" className={styles.nodeDim} />
        </g>
        <g className={styles.orbitInner}>
          <circle cx="200" cy="140" r="3.5" className={styles.node} />
        </g>

        {/* the still core */}
        <circle cx="200" cy="200" r="7" className={styles.core} />
      </svg>
    </div>
  );
}
