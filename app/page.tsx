import Nav from '@/components/Nav/Nav';
import Scene from '@/components/Scene/Scene';
import Experience from '@/components/Experience/Experience';
import Projects from '@/components/Projects/Projects';
import Skills from '@/components/Skills/Skills';
import Education from '@/components/Education/Education';
import Writing from '@/components/Writing/Writing';
import Contact from '@/components/Contact/Contact';
import Footer from '@/components/Footer/Footer';
import Motion from '@/components/Motion/Motion';
import styles from './page.module.css';

export default function Page() {
  return (
    <>
      <Nav />
      <Scene />
      <main className={styles.shell}>
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Writing />
        <Contact />
        <Footer />
      </main>
      <Motion />
    </>
  );
}
