import type { CSSProperties, ReactNode } from 'react';
import styles from './Bento.module.css';

/** Columns out of 12 on desktop. Under 900px, 3–5 become half width and 6+ full. */
type Span = 3 | 4 | 5 | 6 | 7 | 8 | 12;

export function Bento({ children }: { children: ReactNode }) {
  return <div className={styles.grid}>{children}</div>;
}

type TileProps = {
  children: ReactNode;
  span: Span;
  /** Desktop row span. Rows collapse to auto on narrow screens. */
  rows?: 1 | 2;
  /**
   * `outline` is a surface drawn by its border alone, no fill. `plain` drops the
   * surface entirely — content sits straight on the page.
   */
  tone?: 'card' | 'ink' | 'accent' | 'clay' | 'outline' | 'plain';
  /** Makes the whole tile a link — the only tiles that respond to hover. */
  href?: string;
  external?: boolean;
  /** Extra class from the consuming section, for its own layout inside the tile. */
  className?: string;
  /** Hero tiles: revealed by the load intro instead of on scroll. */
  intro?: boolean;
};

export function Tile({
  children,
  span,
  rows = 1,
  tone = 'card',
  href,
  external,
  className,
  intro,
}: TileProps) {
  const classes = [styles.tile, styles[tone], href ? styles.link : '', className ?? '']
    .filter(Boolean)
    .join(' ');
  const shared = {
    className: classes,
    'data-span': span,
    [intro ? 'data-intro' : 'data-reveal']: true,
    style: { '--rows': rows } as CSSProperties,
  };

  if (href) {
    return (
      <a
        {...shared}
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
      >
        {children}
      </a>
    );
  }
  return <div {...shared}>{children}</div>;
}
