import type { StaticImageData } from 'next/image';

export type Experience = {
  meta: string;
  org: string;
  role: string;
  body: string;
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
  meta: string;
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

export type SocialLink = {
  label: string;
  href: string;
};
