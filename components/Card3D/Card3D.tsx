import type { ElementType, ReactNode } from 'react';
import styles from './Card3D.module.css';

type Card3DProps = {
  children: ReactNode;
  /** Rendered element. Use `a` for full-card links. */
  as?: ElementType;
  /** Extra class from the consuming section, for padding/layout overrides. */
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
};

export default function Card3D({ children, as: Tag = 'div', className, ...rest }: Card3DProps) {
  return (
    <Tag className={className ? `${styles.card} ${className}` : styles.card} {...rest}>
      {children}
    </Tag>
  );
}
