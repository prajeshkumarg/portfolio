import Hero from '@/components/Hero/Hero';
import Experience from '@/components/Experience/Experience';
import Projects from '@/components/Projects/Projects';
import Skills from '@/components/Skills/Skills';
import Education from '@/components/Education/Education';
import Contact from '@/components/Contact/Contact';
import Footer from '@/components/Footer/Footer';
import Motion from '@/components/Motion/Motion';
import StarField from '@/components/StarField/StarField';

/*
 * One fixed starfield behind the whole page. The snap points are the tops of the
 * hero and each section (Motion adds them); the Contact section and the footer
 * share the last screen (.finale).
 */
export default function Page() {
  return (
    <>
      <StarField />
      <Hero />
      <main>
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <div className="finale" data-snap>
          <Contact />
          <Footer />
        </div>
      </main>
      <Motion />
    </>
  );
}
