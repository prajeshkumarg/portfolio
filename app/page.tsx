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
 * The page is a stack of sheets: the hero is the bottom card, and every section
 * after it (the footer rides in the last one) is a solid sheet that slides up over
 * the one before. Sheets are plain blocks on phones and without JS; Motion + the
 * sheet CSS in globals.css make them sticky and animate the covered one.
 */
export default function Page() {
  return (
    <>
      {/* a fixed, still starfield behind the hero (opaque sheets cover it below) */}
      <StarField />
      <div className="stack" data-stack>
        <div className="sheet sheet-hero" data-sheet style={{ zIndex: 1 }}>
          <Hero />
        </div>
        <main>
          <div className="sheet sheet-solid" data-sheet style={{ zIndex: 2 }}>
            <Experience />
          </div>
          <div className="sheet sheet-solid" data-sheet style={{ zIndex: 3 }}>
            <Projects />
          </div>
          <div className="sheet sheet-solid" data-sheet style={{ zIndex: 4 }}>
            <Skills />
          </div>
          <div className="sheet sheet-solid" data-sheet style={{ zIndex: 5 }}>
            <Education />
          </div>
          <div className="sheet sheet-solid" data-sheet style={{ zIndex: 6 }}>
            <Contact />
            <Footer />
          </div>
        </main>
      </div>
      <Motion />
    </>
  );
}
