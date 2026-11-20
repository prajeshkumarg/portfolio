'use client';

/*
 * HeroCard — one "Building now" item: a rounded card whose top is a full-bleed
 * tinted panel holding a composed 32×20 pixel scene (drawn at 65% of the panel), with the project's name and
 * one-line description below. The whole card is the link when `href` is set,
 * otherwise a plain figure.
 *
 * Client only for the pointer: moving over a card tilts it (±6°), slides a flat
 * sheen across it and shifts the scene (parallax) through --tx / --ty, and the
 * lift + shadow are CSS on hover. Pointer effects are off for touch and under
 * reduced motion; only the label border changes then.
 *
 * To add a card, add an item to `now` in content.ts and give its `art` key an entry
 * in the ART map in HeroArt.tsx (label colour + 32×20 grid).
 */

import { useRef } from 'react';
import type { NowItem } from '@/types';
import { ArtSvg, getArt } from './HeroArt';
import styles from './HeroCard.module.css';

export default function HeroCard({ item }: { item: NowItem }) {
  const art = getArt(item.art);
  const ref = useRef<HTMLElement | null>(null);

  // pointer position over the card, -0.5..0.5 on each axis, as CSS vars
  const track = (e: React.PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el || e.pointerType === 'touch' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--tx', String((e.clientX - r.left) / r.width - 0.5));
    el.style.setProperty('--ty', String((e.clientY - r.top) / r.height - 0.5));
  };
  const rest = () => {
    ref.current?.style.setProperty('--tx', '0');
    ref.current?.style.setProperty('--ty', '0');
  };
  const pointer = { onPointerMove: track, onPointerLeave: rest };

  const body = (
    <span className={styles.tilt}>
      <span className={styles.body}>
        <span className={styles.label}>
          <ArtSvg art={art} className={styles.art} cursor />
        </span>

        <span className={styles.text}>
          <span className={styles.name}>{item.name}</span>
          <span className={styles.line}>{item.line}</span>
        </span>

        <span className={styles.sheen} aria-hidden="true" />
      </span>
    </span>
  );

  const style = { '--label': art.colour } as React.CSSProperties;

  return item.href ? (
    <a
      ref={ref as React.RefObject<HTMLAnchorElement>}
      className={styles.cart}
      href={item.href}
      target="_blank"
      rel="noreferrer"
      style={style}
      {...pointer}
    >
      {body}
    </a>
  ) : (
    <figure ref={ref} className={styles.cart} style={style} {...pointer}>
      {body}
    </figure>
  );
}
