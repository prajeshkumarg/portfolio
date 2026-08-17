import type { Experience, Project, SkillGroup, SocialLink } from './types';
import amazonLogo from './public/logos/amazon.png';
import shellLogo from './public/logos/shell.png';
import nyuLogo from './public/logos/nyu.png';
import anylangArch from './public/projects/anylang-arch.png';
import miniTensorCompilerOutput from './public/projects/minicompiler.png';

export const site = {
  wordmark: 'PRAJESH',
  email: 'pg2973@nyu.edu',
  resumeHref: '/resume.pdf',
  blogHref: 'https://blog-praj3sh.com',
  githubHref: 'https://github.com/prajeshkumarg',
  linkedinHref: 'https://linkedin.com/in/prajeshkumarg',
  copyright: '© 2026 Prajesh Kumar Ganesh Kumar',
};

export const navLinks: SocialLink[] = [
  { label: 'Work', href: '#work' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Blog', href: site.blogHref },
  { label: 'Contact', href: '#contact' },
];

export const sideNavLinks: SocialLink[] = [
  { label: 'WORK', href: '#work' },
  { label: 'PROJECTS', href: '#projects' },
];

export const sideNavFooterLink: SocialLink = { label: 'CONTACT', href: '#contact' };

export const hero = {
  /** Split so the name can carry the accent colour without copy living in JSX. */
  greeting: { lead: 'Hi, I am ', name: 'Prajesh' },
  /**
   * Top / middle / bottom of the rotating stack at rest. They cycle downward and
   * whichever word is in the middle is the highlighted one, so no per-word colour.
   */
  rotating: ['Engineer.', 'Compilers.', 'Security.'],
  bio: 'SDE intern at Amazon and MSCS student at NYU Courant. I build compilers in C++ and OCaml, teach parallel computing, and do security research with OSIRIS Lab.',
  ctaLabel: 'See my work',
  ctaHref: '#work',
  resumeLabel: 'resume.pdf ↗',
};

export const experiences: Experience[] = [
  {
    meta: '2026 · SEATTLE',
    org: 'Amazon',
    logo: amazonLogo,
    role: 'Software Development Intern',
    body: 'I built a Grants Console that tracks every temporary access grant across Amazon Connect, showing exactly who can reach which resources and revoking access as soon as it is no longer needed.',
  },
  {
    meta: '2023–25 · BENGALURU',
    org: 'Shell',
    logo: shellLogo,
    logoPlate: true,
    role: 'Software Engineer',
    body: 'I fixed twelve security vulnerabilities, rebuilt the permissions system from scratch, cut deployment time from 4 hours to under 1, and redesigned storage for 3x faster queries and $70K/yr in savings.',
  },
  {
    meta: '2025–27 · NEW YORK',
    org: 'NYU Courant',
    logo: nyuLogo,
    role: 'Course Assistant',
    body: 'I teach OpenMP, MPI, and CUDA to 100+ students a week in Courant’s parallel computing course, taking them from their first parallel loop to reasoning about races, deadlocks, and why the speedup never quite matches the core count.',
  },
];

export const projects: Project[] = [
  {
    meta: 'C++ · MLIR · LLVM',
    title: 'MiniTensorCompiler',
    body: 'A tensor language that compiles to LLVM. It fuses and folds operations, catches dimension mismatches at compile time instead of at runtime, and targets both native and JIT execution.',
    linkLabel: 'github ↗',
    href: 'https://github.com/prajeshkumarg/MiniTensorCompiler',
    image: miniTensorCompilerOutput,
    imageAlt:
      'Terminal output showing a tensor program lowered first to the ts-mlir dialect, then to LLVM MLIR.',
  },
  {
    meta: 'OCAML · RISC-V',
    title: 'AnyLang',
    body: 'A four-stage compiler that lowers a typed language to RISC-V assembly, optimizes it with control-flow-graph analysis, and verifies the output against a simulator I wrote by hand.',
    linkLabel: 'github ↗',
    href: 'https://github.com/prajeshkumarg/anylang',
    image: anylangArch,
    imageAlt:
      'Pipeline diagram: Fish and Scish front ends lower through Cish to a RISC-V AST, then to 32-bit machine code and a simulator.',
  },
];

export const skillGroups: SkillGroup[] = [
  {
    label: 'Languages',
    items: ['C/C++', 'OCaml', 'Python', 'Java', 'C#', 'JavaScript'],
  },
  {
    label: 'Systems & Compilers',
    items: ['LLVM/MLIR', 'CUDA', 'OpenMP', 'MPI', 'Linux', 'RISC-V'],
  },
  {
    label: 'Cloud & Infra',
    items: ['AWS', 'Terraform', 'Docker', 'Kubernetes', 'CI/CD', 'PostgreSQL'],
  },
];

export const writing = {
  title: 'Notes on compilers and systems',
  body: 'I write about MLIR dialect design, dataflow analysis, and the CTF challenges I work through with OSIRIS Lab.',
  linkLabel: 'blog-praj3sh.com ↗',
  href: site.blogHref,
};

export const contact = {
  label: 'GET IN TOUCH',
  heading: 'Looking for my next role.',
  body: 'I’m seeking a 2027 SDE position on a compilers, systems, or security team. If that sounds like a fit, I’d like to hear from you.',
  ctaLabel: site.email,
  ctaHref: `mailto:${site.email}`,
};

export const socialLinks: SocialLink[] = [
  { label: 'github ↗', href: site.githubHref },
  { label: 'linkedin ↗', href: site.linkedinHref },
  { label: 'blog ↗', href: site.blogHref },
];
