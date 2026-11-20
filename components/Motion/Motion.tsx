'use client';

/*
 * Motion — the whole motion layer, off under prefers-reduced-motion.
 *
 *   data-hero-line   the two hero lines, masked and rising on load (signature)
 *   data-hero-lede   the supporting sentence + button, fading up after
 *   data-reveal      every section's parts, staggered in on scroll
 *   anchors          nav / hash links glide with a long ease-out (Lenis)
 *
 * Renders nothing, so every section stays a Server Component. Lenis gives the
 * smooth scroll. Transform + opacity only; content never stays hidden if the
 * script fails (the boot class is dropped after 3s, and reduced motion shows
 * everything at rest).
 */

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export default function Motion() {
  useEffect(() => {
    window.__motion = true;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      document.documentElement.classList.remove('motion');
      return;
    }

    // GSAP now owns the hero start state: drop the CSS pending hook so the
    // standing CSS rule stops hiding the lines, then animate from explicit
    // start values. (Setting the hidden state in both CSS and JS is the trap —
    // the standing CSS rule re-hides what GSAP clears.)
    document.querySelector('[data-hero-pending]')?.removeAttribute('data-hero-pending');

    const ctx = gsap.context(() => {
      // signature: the two hero lines rise from behind their own baseline
      const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
      intro
        .fromTo(
          '[data-hero-line] > span',
          { yPercent: 105 },
          { yPercent: 0, duration: 0.9, stagger: 0.11 },
        )
        .fromTo(
          '[data-hero-lede]',
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08 },
          '-=0.3',
        );

      // every section's parts, once on scroll
      const reveals = gsap.utils.toArray<HTMLElement>('[data-reveal]');
      gsap.set(reveals, { autoAlpha: 0, y: 28 });
      ScrollTrigger.batch(reveals, {
        start: 'top 88%',
        once: true,
        onEnter: (els) =>
          gsap.to(els, {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.07,
            ease: 'expo.out',
            clearProps: 'transform',
          }),
      });
    });

    const lenis = new Lenis({
      anchors: {
        duration: 1.5,
        easing: (t: number) => 1 - Math.pow(1 - t, 4), // ease-out quart
      },
    });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);

  return null;
}
