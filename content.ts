import type { Education, Experience, Project, SkillGroup, SocialLink } from './types';
import amazonLogo from './public/logos/amazon.png';
import shellLogo from './public/logos/shell.png';
import nyuLogo from './public/logos/nyu.png';
import anylangArch from './public/projects/anylang-arch.png';
import miniTensorCompilerOutput from './public/projects/minicompiler.png';
import heroPortrait from './public/image.png';
import vitLogo from './public/logos/vit.webp';

export const site = {
  wordmark: 'PRAJESH',
  email: 'pg2973@nyu.edu',
  resumeHref: '/resume.pdf',
  blogHref: 'https://blog-praj3sh.web.app',
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

/** Subscript caption under the hero portrait — the former side-rail words. */
export const sideCaption = 'ENGINEER · COMPILERS · SECURITY';

export const hero = {
  /** Split so the name can carry the accent colour without copy living in JSX. */
  greeting: { lead: 'Hi, I am ', name: 'Prajesh' },
  bio: 'SDE intern at Amazon and MSCS student at NYU Courant. I build compilers in C++ and OCaml, teach parallel computing, and do security research with OSIRIS Lab.',
  /** The hero portrait — replaces the rotating word stack (2026-08-28). */
  portrait: heroPortrait,
  /** Alt text describing the portrait — required whenever an image is set. */
  portraitAlt: 'Portrait of Prajesh Kumar',
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
    body: 'I shipped features, API, fixed security vulnerabilities in a commissioning data platform, cut deployment time from 4 hours to under 1 with a CI/CD pipeline, and migrated 50K+ records to SQLite for 3x faster queries.',
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
    label: 'ML & AI',
    items: [
      'PyTorch',
      'Hugging Face',
      'Diffusion LLMs',
      'Inference Optimization',
      'NumPy/Pandas',
    ],
  },
  {
    label: 'Cloud & Infra',
    items: ['AWS', 'Terraform', 'Docker', 'Kubernetes', 'CI/CD', 'PostgreSQL'],
  },
];

export const education: Education[] = [
  {
    degree: 'Masters - Computer Science',
    institution: 'NYU Courant Institute of Mathematical Sciences',
    meta: '2025–27 · NEW YORK, USA',
    logo: nyuLogo,
  },
  {
    degree: 'Bachelors - Computer Science & Engineering',
    institution: 'Vellore Institute of Technology',
    meta: '2019–23 · VELLORE, INDIA',
    logo: vitLogo,
    logoPlate: true,
  },
];

export const writing = {
  title: 'Notes on compilers and systems',
  body: 'I write about MLIR dialect design, dataflow analysis, and the CTF challenges I work through with OSIRIS Lab.',
  linkLabel: 'blog-praj3sh ↗',
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
