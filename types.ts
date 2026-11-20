import type { StaticImageData } from 'next/image';

export type Experience = {
  meta: string;
  /** Marks the role you're in now — its point markers are accented. */
  current?: boolean;
  /**
   * Where the wordmark's lettering sits in the logo file, as fractions of its
   * height (0 = top). Experience sizes each logo so the lettering is the same
   * height and sits on one shared baseline. Re-measure when a logo file changes.
   */
  logoLetters?: { top: number; bottom: number };
  org: string;
  role: string;
  /** Short year range for the phone table, e.g. "2026", "2026–", "2023–25". */
  years: string;
  /** What you did, as separate points — two reads best in the Experience columns. */
  points: string[];
  /**
   * Statically imported logo, so Next carries the real intrinsic dimensions and
   * the mark scales to the slot height at its true aspect ratio. The slot is
   * reserved either way, so cards keep the same height before the images land.
   */
  logo?: StaticImageData;
  /**
   * Set when the logo is a transparent mark rather than a pre-baked banner.
   * Puts it on a white plate and fits it inside the band instead of cropping
   * to fill, which would clip a centred mark.
   */
  logoPlate?: boolean;
};

import type { DiagramKey } from './components/Projects/diagrams';

export type Project = {
  /** Stack and tools, rendered as tag pills. */
  tags: string[];
  title: string;
  /** ~5-word one-liner for the phone list. */
  short: string;
  body: string;
  linkLabel: string;
  href: string;
  /**
   * The architecture diagram shown beside the project — an inline SVG React
   * component keyed here and resolved through components/Projects/diagrams.
   * Each diagram is hand-authored in the shared --viz-* system (no screenshots).
   */
  diagram: DiagramKey;
};

export type SkillGroup = {
  label: string;
  /** Shortened label for the phone definition list. */
  short: string;
  items: string[];
};

export type Education = {
  degree: string;
  /** Short forms for the phone table. */
  degreeShort: string;
  schoolShort: string;
  years: string;
  /** Plain name — the separator lives in `degree` ("MS - Computer Science"). */
  institution: string;
  /** Dates · location line, like the experience cards' meta. */
  meta: string;
  /** College mark, shown left of the degree row. */
  logo?: StaticImageData;
  /** Set when the mark sits on a baked-in white field — plates it, like the
      Shell logo. */
  logoPlate?: boolean;
};

export type SocialLink = {
  label: string;
  href: string;
};

export type NowItem = {
  id: string;
  /** The project's name, set on the card. */
  name: string;
  /** One line on what it is, under the label. */
  line: string;
  /** ~5 words, for the phone list. */
  short: string;
  /** Key into the card art map in HeroCard. */
  art: string;
  /** Makes the whole card a link. */
  href?: string;
};

/** The hero's "Building now" cards. Render 1–4 items. */
export type Now = {
  items: NowItem[];
};
