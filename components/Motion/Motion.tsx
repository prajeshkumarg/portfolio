'use client';

/*
 * Motion — the whole motion layer, off under prefers-reduced-motion.
 *
 *   data-hero-line   the two hero lines, masked and rising on load (signature)
 *   data-hero-lede   the supporting sentence + button, fading up after
 *   snapping         (>=768px) PROXIMITY snapping on top of Lenis: a snap point
 *                    at the top of the hero and of each section (Contact + footer,
 *                    .finale, count as one), nudged by --scroll-offset. When you
 *                    stop scrolling, it snaps only to a point AHEAD of you in the
 *                    direction you were moving, within ~18% of the viewport (plus
 *                    a 24px settle backwards), over 0.6s ease-out. So it never
 *                    drags you back to the top of a tall section you are reading.
 *                    (lenis/snap was tried first: its proximity mode snaps to the
 *                    NEAREST point, which pulled small trackpad steps back.)
 *   arrival          once per section, when it becomes the snapped one: its
 *                    heading and first row rise 16px and fade 0.6 -> 1 over 0.4s.
 *                    Never replayed; nothing is hidden before it plays.
 *   anchors          hash links scroll to the section's snap point exactly
 *   keyboard         PageDown / PageUp / Space jump to the next / previous snap
 *                    point when the current section fits the screen; inside a tall
 *                    section they scroll natively (and jump on at its end / start)
 *
 * Phones (<768px) and reduced motion: no snapping, no arrival motion. Renders
 * nothing, so every section stays a Server Component.
 */

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const SNAP_QUERY = '(min-width: 768px)';
const EASE = (t: number) => 1 - Math.pow(1 - t, 4); // ease-out quart
const INTERACTIVE = 'a, button, input, textarea, select, summary, [contenteditable="true"]';

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

    // ---- sections: the snap targets -------------------------------------------
    // the hero, each top-level section, and the Contact + footer finale
    const targets = [
      document.getElementById('top'),
      ...Array.from(document.querySelectorAll<HTMLElement>('main > section, main > [data-snap]')),
    ].filter((el): el is HTMLElement => !!el);

    let snapOn = false;
    let snapValues: number[] = [];
    const played = new Set<HTMLElement>();

    const offset = () =>
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--scroll-offset')) || 0;

    // snap value of a section: its top, nudged down by --scroll-offset (never < 0)
    const valueOf = (el: HTMLElement) =>
      Math.max(0, Math.round(el.getBoundingClientRect().top + window.scrollY - offset()));

    const computeSnapValues = () => {
      snapValues = targets.map(valueOf);
    };

    const rebuildSnaps = () => {
      if (snapOn) computeSnapValues();
    };

    // arrival: the heading and the first row rise once, when a section is snapped to
    const arrive = (el: HTMLElement) => {
      if (played.has(el)) return;
      played.add(el);
      const heading = el.querySelector<HTMLElement>('h2');
      const first = heading?.nextElementSibling as HTMLElement | null;
      const parts = [heading, first].filter(
        (p): p is HTMLElement => !!p && p.getClientRects().length > 0,
      );
      if (!parts.length) return;
      gsap.fromTo(
        parts,
        { y: 16, opacity: 0.6 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: 'expo.out',
          stagger: 0.06,
          clearProps: 'transform,opacity',
        },
      );
    };

    const mm = gsap.matchMedia();
    mm.add(SNAP_QUERY, () => {
      snapOn = true;

      // after the user stops (wheel / trackpad / touch input goes quiet), snap
      // forward to a point we were heading toward, if it is close enough
      let timer: ReturnType<typeof setTimeout> | undefined;
      let dir = 0;
      const settle = () => {
        const y = lenis.targetScroll;
        const reach = window.innerHeight * 0.18;
        const BACK = 24;
        let dest: number | undefined;
        if (dir > 0) {
          dest = snapValues.find((v) => v >= y && v - y <= reach);
          dest ??= [...snapValues].reverse().find((v) => v < y && y - v <= BACK);
        } else if (dir < 0) {
          dest = [...snapValues].reverse().find((v) => v <= y && y - v <= reach);
          dest ??= snapValues.find((v) => v > y && v - y <= BACK);
        }
        if (dest === undefined) return;
        const el = targets[snapValues.indexOf(dest)];
        if (Math.abs(dest - y) < 1) return arrive(el);
        lenis.scrollTo(dest, { duration: 0.6, easing: EASE, onComplete: () => arrive(el) });
      };
      const onInput = (e: { deltaY: number }) => {
        if (e.deltaY) dir = Math.sign(e.deltaY);
        clearTimeout(timer);
        timer = setTimeout(settle, 220);
      };
      lenis.on('virtual-scroll', onInput);
      rebuildSnaps();

      // keep the points true as content, fonts and the window change
      const ro = new ResizeObserver(() => rebuildSnaps());
      targets.forEach((t) => ro.observe(t));
      window.addEventListener('resize', rebuildSnaps);
      document.fonts?.ready.then(rebuildSnaps);

      // PageDown / PageUp / Space: next or previous snap point when the section
      // fits the screen; inside a tall section scroll natively until its edge
      const onKey = (e: KeyboardEvent) => {
        if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
        const isDown = e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey);
        const isUp = e.key === 'PageUp' || (e.key === ' ' && e.shiftKey);
        if (!isDown && !isUp) return;
        if ((e.target as Element | null)?.closest(INTERACTIVE)) return;

        const y = lenis.scroll;
        const vh = window.innerHeight;
        // the section the viewport top is in
        let i = 0;
        snapValues.forEach((v, n) => {
          if (y >= v - 8) i = n;
        });
        const el = targets[i];
        const top = el.getBoundingClientRect().top + window.scrollY;
        const bottom = top + el.offsetHeight;
        const fits = el.offsetHeight <= vh + 2;
        const EDGE = 48;

        let dest: number | undefined;
        if (isDown && (fits || y + vh >= bottom - EDGE) && i < targets.length - 1) dest = snapValues[i + 1];
        if (isUp && (fits || y <= snapValues[i] + EDGE)) {
          dest = y > snapValues[i] + EDGE ? snapValues[i] : snapValues[Math.max(0, i - 1)];
        }
        if (dest === undefined) return; // tall section: native scroll
        e.preventDefault();
        lenis.scrollTo(dest, { duration: 0.6, easing: EASE, onComplete: () => arrive(targets[snapValues.indexOf(dest!)]) });
      };
      window.addEventListener('keydown', onKey);

      return () => {
        window.removeEventListener('keydown', onKey);
        window.removeEventListener('resize', rebuildSnaps);
        ro.disconnect();
        clearTimeout(timer);
        lenis.off('virtual-scroll', onInput);
        snapOn = false;
      };
    });

    // ---- hash links: land exactly on the section's snap point -----------------
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const id = a.getAttribute('href')!.slice(1);
      const target = id ? document.getElementById(id) : document.documentElement;
      if (!target) return;
      e.preventDefault();
      const section = snapOn ? targets.find((t) => t.contains(target)) : undefined;
      if (section && snapOn) {
        lenis.scrollTo(valueOf(section), {
          duration: 1.0,
          easing: EASE,
          onComplete: () => arrive(section),
        });
      } else {
        lenis.scrollTo(id ? target : 0, { duration: 1.0, easing: EASE });
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
