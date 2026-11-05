'use client';

/*
 * The landing scene + the scroll-zoom camera.
 *
 * The scene is an editorial "cover": greeting, a stacked ENGINEER / COMPILERS /
 * SECURITY statement, the circular portrait, a caption. At rest it fills the
 * viewport with no nav bar — it reads like the front of a printed zine.
 *
 * On scroll the camera flies INTO the scene: a pinned stage scales the scene up
 * and fades it out while the page content (which flows after this component)
 * rises into view. The whole move is one ScrollTrigger scrubbed to a tall pin
 * spacer, so it tracks the scrollbar exactly.
 *
 * Under reduced motion (or no JS) none of this runs: the scene is a normal
 * full-height block and the page scrolls past it conventionally.
 */

import { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { hero, site } from '@/content';
import styles from './Scene.module.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

declare global {
  interface Window {
    __motion?: boolean;
  }
}

export default function Scene() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      window.__motion = true;
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

      // live clock
      const clockEl = root.current?.querySelector<HTMLElement>('[data-clock]');
      let clockId = 0;
      if (clockEl) {
        const fmt = new Intl.DateTimeFormat('en-GB', {
          timeZone: hero.readout.timeZone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        const tick = () => (clockEl.textContent = fmt.format(new Date()));
        tick();
        clockId = window.setInterval(tick, 1000);
      }

      // The CSS pre-hide (html.motion [data-scene-hidden]) keeps the scene from
      // flashing before this runs. Drop the attribute so that rule stops applying,
      // then drive the reveal explicitly — otherwise GSAP reads the hidden state
      // as the target and animates 0 -> 0.
      const hidden = gsap.utils.toArray<HTMLElement>('[data-scene-hidden]');
      hidden.forEach((el) => el.removeAttribute('data-scene-hidden'));

      if (reduced) {
        gsap.set(hidden, { opacity: 1 });
        return () => window.clearInterval(clockId);
      }

      const stage = root.current?.querySelector<HTMLElement>(`.${styles.stage}`);
      const scene = root.current?.querySelector<HTMLElement>(`.${styles.scene}`);
      const cue = root.current?.querySelector<HTMLElement>(`.${styles.cue}`);
      if (!stage || !scene) return () => window.clearInterval(clockId);

      // intro: the scene settles in on load (cue stays CSS-driven)
      gsap.fromTo(
        gsap.utils.toArray<HTMLElement>('[data-scene-in]'),
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.08, ease: 'expo.out', delay: 0.1 },
      );

      // the camera: scrub the scene's scale + fade to the pin spacer
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
          pin: stage,
          pinSpacing: true,
          anticipatePin: 1,
        },
      });

      // fly in: scale past the viewport while fading — the content behind rises in
      tl.to(scene, { scale: 3.4, ease: 'power2.in' }, 0)
        .to(scene, { opacity: 0, ease: 'power1.in' }, 0.25)
        .to(scene, { filter: 'blur(6px)', ease: 'none' }, 0.1);

      if (cue) tl.to(cue, { opacity: 0, duration: 0.15, ease: 'none' }, 0);

      return () => window.clearInterval(clockId);
    },
    { scope: root },
  );

  return (
    <div ref={root} className={styles.camera} data-camera>
      <div className={styles.stage}>
        <div className={styles.scene}>
          <div className={styles.grain} aria-hidden="true" />

          <p className={styles.readout} data-scene-hidden data-scene-in>
            {hero.readout.city} <time data-clock>--:--</time> {hero.readout.timeZoneLabel}
          </p>

          <div className={styles.center}>
            <p className={styles.greeting} data-scene-hidden data-scene-in>
              {hero.greeting}
            </p>

            <figure className={styles.portrait} data-scene-hidden data-scene-in>
              <Image
                className={styles.photo}
                src={hero.portrait}
                alt={hero.portraitAlt}
                fill
                priority
                sizes="(max-width: 640px) 180px, 240px"
              />
            </figure>

            <h1 className={styles.statement}>
              {hero.statement.map((line, i) => (
                <span
                  key={line.word}
                  className={line.em ? `${styles.line} ${styles.em}` : styles.line}
                  data-scene-hidden
                  data-scene-in
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  {line.word}
                  <span aria-hidden="true">.</span>
                </span>
              ))}
            </h1>

            <p className={styles.caption} data-scene-hidden data-scene-in>
              {hero.caption}
            </p>
          </div>

          <div className={styles.actions} data-scene-hidden data-scene-in>
            <a className={styles.cta} href={hero.ctaHref}>
              {hero.ctaLabel} <span aria-hidden="true">↓</span>
            </a>
            <a className={styles.resume} href={site.resumeHref} target="_blank" rel="noreferrer">
              {hero.resumeLabel} <span aria-hidden="true">↗</span>
            </a>
          </div>

          <p className={styles.cue} aria-hidden="true">
            {hero.scrollCue}
          </p>
        </div>
      </div>
    </div>
  );
}
