import styles from './ButtonPrimary.module.css';

type ButtonPrimaryProps = {
  href: string;
  children: string;
  target?: string;
  rel?: string;
};

export default function ButtonPrimary({ href, children, target, rel }: ButtonPrimaryProps) {
  return (
    <a className={styles.button} href={href} target={target} rel={rel}>
      {children}
    </a>
  );
}
