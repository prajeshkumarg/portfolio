'use client';

/*
 * The page's only client component. It renders nothing; it finds the
 * `data-*` hooks the server-rendered sections expose and drives them:
 *
 *   data-intro        hero tiles assemble on load (pre-hidden by html.motion)
 *   data-split        heading lines rise out of a mask ("intro" = part of the load)
 *   data-reveal       tiles and rows fade up once on scroll, batched so a row staggers
 *   data-preview      a project index: hovering or focusing a [data-preview-trigger]
 *                     row marks it and the matching [data-preview-item] data-active
 *   data-progress     scrubbed to page scroll
 *
 * Keeping it in one place means every section stays a Server Component.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

declare global {
  interface Window {
    /** Read by the boot script in layout.tsx — present means the hero will be revealed. */
    __motion?: boolean;
  }
}

const EASE = 'expo.out';

/** Lines rise from below a mask; the split is reverted afterwards so descenders aren't clipped. */
function riseLines(el: HTMLElement) {
  const split = SplitText.create(el, { type: 'lines', mask: 'lines' });
  gsap.set(el, { autoAlpha: 1 });
  return gsap.from(split.lines, {
    yPercent: 110,
    duration: 1.2,
    stagger: 0.09,
    ease: EASE,
    onComplete: () => split.revert(),
  });
}

/** Hero tiles rise and settle in reading order; the headline's lines follow its tile. */
function intro() {
  const tiles = gsap.utils.toArray<HTMLElement>('[data-intro]');
  const statement = document.querySelector<HTMLElement>('[data-split="intro"]');

  const tl = gsap.timeline({ defaults: { ease: EASE } });
  tl.fromTo(
    tiles,
    { autoAlpha: 0, y: 40, scale: 0.97 },
    { autoAlpha: 1, y: 0, scale: 1, duration: 1.1, stagger: 0.07, clearProps: 'transform' },
  );
  if (statement) tl.add(riseLines(statement), 0.15);
}

function scrollReveals() {
  const tiles = gsap.utils.toArray<HTMLElement>('[data-reveal]');
  gsap.set(tiles, { autoAlpha: 0, y: 40 });
  ScrollTrigger.batch(tiles, {
    start: 'top 90%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: EASE,
        clearProps: 'transform',
      }),
  });

  gsap.utils.toArray<HTMLElement>('[data-split]:not([data-split="intro"])').forEach((el) => {
    gsap.set(el, { autoAlpha: 0 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => riseLines(el),
    });
  });
}

/**
 * State, not motion — runs under reduced motion too (the CSS drops the
 * crossfade there). The last row hovered stays active when the pointer leaves.
 * Returns a cleanup that removes the listeners.
 */
function previews() {
  // Delegated from the document and resolved at event time, so it keeps working
  // when React replaces the rows (a re-render, or Fast Refresh in dev) — listeners
  // bound to the original nodes would be left on detached elements.
  const activate = (event: Event) => {
    if (!(event.target instanceof Element)) return;
    const trigger = event.target.closest<HTMLElement>('[data-preview-trigger]');
    const root = trigger?.closest('[data-preview]');
    if (!trigger || !root || trigger.dataset.active === 'true') return;
    const key = trigger.dataset.previewTrigger;
    root.querySelectorAll<HTMLElement>('[data-preview-trigger]').forEach((el) => {
      el.dataset.active = String(el.dataset.previewTrigger === key);
    });
    root.querySelectorAll<HTMLElement>('[data-preview-item]').forEach((el) => {
      el.dataset.active = String(el.dataset.previewItem === key);
    });
  };
  document.addEventListener('pointerover', activate);
  document.addEventListener('focusin', activate);
  return () => {
    document.removeEventListener('pointerover', activate);
    document.removeEventListener('focusin', activate);
  };
}

export default function Motion() {
  useGSAP(() => {
    window.__motion = true;

    // Position-mapped, not autonomous motion — runs under reduced motion too.
    gsap.to('[data-progress]', {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: true },
    });

    const removePreviews = previews();
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', (ctx) => {
      // Lenis is driven by GSAP's ticker so scroll and ScrollTrigger share a frame.
      // `anchors` routes in-page links through it, honouring scroll-margin-top.
      const lenis = new Lenis({ anchors: true });
      lenis.on('scroll', ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      // SplitText measures lines, so wait for the real fonts.
      let alive = true;
      document.fonts.ready.then(() => {
        if (!alive) return;
        ctx.add(() => {
          intro();
          scrollReveals();
          ScrollTrigger.refresh();
        });
      });

      return () => {
        alive = false;
        gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.destroy();
      };
    });

    return removePreviews;
  });

  return null;
}
