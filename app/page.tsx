import Hero from '@/components/Hero/Hero';
import Experience from '@/components/Experience/Experience';
import Projects from '@/components/Projects/Projects';
import Skills from '@/components/Skills/Skills';
import Education from '@/components/Education/Education';
import Contact from '@/components/Contact/Contact';
import Footer from '@/components/Footer/Footer';
import Motion from '@/components/Motion/Motion';
import StarField from '@/components/StarField/StarField';

export default function Page() {
  return (
    <>
      {/* a fixed, still starfield sits behind everything; the hero's content and
          every section scroll over it */}
      <StarField />
      <Hero />
      <main>
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>
      <Footer />
      <Motion />
    </>
  );
}
