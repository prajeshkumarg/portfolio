'use client';

/*
 * Scroll motion for everything BELOW the scene. The Scene component owns the
 * zoom camera and the intro; this drives the content sections:
 *
 *   data-reveal   fades + rises once on scroll (batched, so a row staggers)
 *   data-nav      the nav bar: hidden over the scene, revealed once you're past it
 *   data-rail     the scroll-progress rail under the nav, scrubbed to page scroll
 *
 * Renders nothing, so every section stays a Server Component. Lenis gives the
 * smooth scroll the zoom rides on. All of it is off under reduced motion.
 */

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export default function Motion() {
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    // the nav: shown only once the scene is behind us
    const nav = document.querySelector<HTMLElement>('[data-nav]');
    let navTrigger: ScrollTrigger | undefined;
    if (nav) {
      navTrigger = ScrollTrigger.create({
        trigger: '[data-camera]',
        start: 'bottom 80%',
        onToggle: (self) => nav.classList.toggle('isShown', self.isActive || self.progress >= 1),
        onUpdate: (self) => nav.classList.toggle('isShown', self.progress >= 1),
      });
    }

    if (reduced) {
      // nav always shown; no reveals, no smooth scroll
      nav?.classList.add('isShown');
      return () => navTrigger?.kill();
    }

    const rail = gsap.to('[data-rail]', {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: true },
    });

    const reveals = gsap.utils.toArray<HTMLElement>('[data-reveal]');
    gsap.set(reveals, { autoAlpha: 0, y: 40 });
    const batch = ScrollTrigger.batch(reveals, {
      start: 'top 88%',
      once: true,
      onEnter: (els) =>
        gsap.to(els, {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: 'expo.out',
          clearProps: 'transform',
        }),
    });

    const lenis = new Lenis({ anchors: true });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();

    return () => {
      navTrigger?.kill();
      rail.scrollTrigger?.kill();
      rail.kill();
      batch.forEach((t) => t.kill());
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);

  return null;
}
