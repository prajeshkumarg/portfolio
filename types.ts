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

export type Project = {
  /** Stack and tools, rendered as tag pills. */
  tags: string[];
  title: string;
  body: string;
  linkLabel: string;
  href: string;
  /**
   * Statically imported screenshot or diagram, shown below the description. The
   * slot is reserved either way, so cards keep the same height before and after
   * the images land, and the intrinsic dimensions drive the slot's aspect ratio
   * so nothing gets cropped.
   */
  image?: StaticImageData;
  /** Describes what the image shows. Required whenever `image` is set. */
  imageAlt?: string;
};

export type SkillGroup = {
  label: string;
  items: string[];
};

export type Education = {
  degree: string;
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
