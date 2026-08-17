import { site } from '@/content';
import styles from './Footer.module.css';

export default function Footer() {
  return <footer className={styles.footer}>{site.copyright}</footer>;
}
