'use client';

/*
 * Motion — the whole motion layer, off under prefers-reduced-motion.
 *
 *   data-hero-line   the two hero lines, masked and rising on load (signature)
 *   data-hero-lede   the supporting sentence + button, fading up after
 *   data-sheet       the SHEET SLIDE-OVER (desktop/tablet, >=768px with a fine
 *                    pointer): the hero and each section are sheets in one stack
 *                    (app/page.tsx). Each sheet is sticky (see the CSS in
 *                    globals.css); the next one slides up over it, and while it
 *                    does, the covered sheet scales 1 -> 0.94 (from its top
 *                    centre), its content dims 1 -> 0.4 and a dark overlay goes
 *                    0 -> 0.35 — all scrubbed to the scroll, so it reverses.
 *                    Nothing animates on the incoming sheet.
 *   anchors          hash links scroll to the target SHEET's real top (computed
 *                    from the sheet heights, never from a sticky element's
 *                    current position), so it lands fully on top and unscaled
 *
 * Phones (<768px / no fine pointer) and reduced motion get plain scrolling, and
 * html.motion is dropped so the sheet CSS never applies. Renders nothing, so every
 * section stays a Server Component. Transform + opacity only; will-change is set
 * only while a sheet is actively being covered.
 */

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const SHEET_QUERY = '(min-width: 768px) and (pointer: fine)';
const SCROLL_EASE = (t: number) => 1 - Math.pow(1 - t, 4); // ease-out quart

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

    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // ---- the sheet slide-over ------------------------------------------------
    const sheets = gsap.utils.toArray<HTMLElement>('[data-sheet]');
    const stack = document.querySelector<HTMLElement>('[data-stack]');
    let tops: number[] = []; // each sheet's resting top, in page coordinates
    let sheetMode = false;

    // Positions come from the stacked heights, not from offsetTop: a sticky sheet's
    // offsetTop moves while it is stuck, its height never does.
    const measure = () => {
      if (!stack) return;
      let y = stack.getBoundingClientRect().top + window.scrollY;
      tops = sheets.map((s) => {
        const top = y;
        y += s.offsetHeight;
        // a sheet taller than the viewport scrolls fully, then sticks by its bottom
        s.style.setProperty('--sheet-top', `${Math.min(0, window.innerHeight - s.offsetHeight)}px`);
        return top;
      });
    };

    const mm = gsap.matchMedia();
    mm.add(SHEET_QUERY, () => {
      sheetMode = true;
      measure();

      // sheet i covers sheet i-1: the covered one is stuck from max(its top, the
      // moment its bottom meets the viewport's bottom) until sheet i reaches the top
      sheets.forEach((sheet, i) => {
        if (i === 0) return;
        const covered = sheets[i - 1];
        const content = Array.from(covered.children) as HTMLElement[];
        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              start: () => Math.max(tops[i - 1], tops[i] - window.innerHeight),
              end: () => tops[i],
              scrub: true,
              invalidateOnRefresh: true,
              onToggle: (self) => {
                covered.style.willChange = self.isActive ? 'transform' : '';
              },
              onUpdate: (self) => sheet.toggleAttribute('data-covering', self.progress > 0),
            },
          })
          .set(covered, { transformOrigin: '50% 0%' }, 0)
          .to(covered, { scale: 0.94, '--dim': 0.35 }, 0)
          .to(content, { opacity: 0.4 }, 0);
      });

      // keep the measurements (and --sheet-top) true as content and window change
      const ro = new ResizeObserver(() => {
        measure();
        ScrollTrigger.refresh();
      });
      sheets.forEach((s) => ro.observe(s));
      const onResize = () => {
        measure();
        ScrollTrigger.refresh();
      };
      window.addEventListener('resize', onResize);
      ScrollTrigger.refresh();

      return () => {
        sheetMode = false;
        ro.disconnect();
        window.removeEventListener('resize', onResize);
        sheets.forEach((s) => {
          s.style.removeProperty('--sheet-top');
          s.style.removeProperty('will-change');
          s.removeAttribute('data-covering');
        });
      };
    });

    // ---- hash links -----------------------------------------------------------
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const id = a.getAttribute('href')!.slice(1);
      const target = id ? document.getElementById(id) : document.documentElement;
      if (!target) return;
      e.preventDefault();
      const sheetIndex = sheetMode ? sheets.findIndex((s) => s.contains(target)) : -1;
      if (sheetIndex >= 0) {
        // land with the target's sheet fully on top (and unscaled)
        lenis.scrollTo(tops[sheetIndex], { duration: 1.5, easing: SCROLL_EASE });
      } else {
        lenis.scrollTo(id ? target : 0, { duration: 1.5, easing: SCROLL_EASE });
      }
      if (id) history.pushState(null, '', `#${id}`);
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      mm.revert();
      ctx.revert();
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);

  return null;
}
