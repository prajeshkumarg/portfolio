'use client';

/*
 * Motion — the whole motion layer, off under prefers-reduced-motion.
 *
 *   data-hero-line   the two hero lines, masked and rising on load (signature)
 *   data-hero-lede   the supporting sentence + button, fading up after
 *   data-hero-exit   the hero's cards and buttons ease up 16px and dim to 0.6
 *                    across the hero's last 30% as it scrolls out (scrubbed)
 *   data-reveal      each section's parts, entering ONCE (never reversed) when
 *                    the section's top crosses 85% of the viewport: the h2 first,
 *                    then the rest 80ms later, staggered 60ms (under ~0.8s total)
 *   h2 parallax      while a section is in view its h2 drifts +24px -> -24px
 *                    (a --drift CSS variable, applied as `translate`), so
 *                    headings lead the content slightly
 *   anchors          nav / hash links glide with a long ease-out (Lenis)
 *
 * Section entrances, the exit and the parallax run only above 600px (phones are
 * static) and never under reduced motion. Parts start hidden by CSS only while
 * html.motion is set (the boot script drops it after 3s if this never boots), so
 * nothing stays hidden if the script fails. Renders nothing, so every section
 * stays a Server Component. Transform + opacity only.
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

    });

    // ---- sections + hero exit: desktop and tablet only -----------------------
    const mm = gsap.matchMedia();
    mm.add('(min-width: 601px)', () => {
      const headings: HTMLElement[] = [];

      // marks parts as revealed (so the CSS stops hiding them) and animates them in
      const enter = (els: HTMLElement[], delay: number, each: number) => {
        if (!els.length) return;
        els.forEach((el) => el.setAttribute('data-revealed', ''));
        gsap.fromTo(
          els,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: 'expo.out',
            delay,
            stagger: each,
            clearProps: 'transform,opacity,visibility',
          },
        );
      };

      gsap.utils.toArray<HTMLElement>('main > section').forEach((sec) => {
        const heading = sec.querySelector<HTMLElement>('h2[data-reveal]');
        // visible parts only: the phone-only duplicates are display:none here
        const parts = gsap
          .utils.toArray<HTMLElement>('[data-reveal]', sec)
          .filter((el) => el !== heading && el.getClientRects().length > 0);
        const each = Math.min(0.06, 0.2 / Math.max(parts.length - 1, 1)); // keeps the total < ~0.8s

        ScrollTrigger.create({
          trigger: sec,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            if (heading) enter([heading], 0, 0);
            enter(parts, heading ? 0.08 : 0, each);
          },
        });

        if (heading) {
          headings.push(heading);
          ScrollTrigger.create({
            trigger: sec,
            start: 'top bottom',
            end: 'bottom top',
            onUpdate: (self) => heading.style.setProperty('--drift', `${(0.5 - self.progress) * 48}px`),
          });
        }
      });

      // the hero's cards and buttons lift and dim across the hero's last 30%
      const hero = document.getElementById('top');
      const exits = gsap.utils.toArray<HTMLElement>('[data-hero-exit]');
      if (hero && exits.length) {
        gsap.to(exits, {
          opacity: 0.6,
          y: -16,
          ease: 'none',
          immediateRender: false,
          overwrite: false,
          scrollTrigger: {
            trigger: hero,
            start: () => `top+=${Math.round(hero.offsetHeight * 0.7)} top`,
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      }

      return () => headings.forEach((h) => h.style.removeProperty('--drift'));
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
      mm.revert();
      ctx.revert();
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);

  return null;
}
