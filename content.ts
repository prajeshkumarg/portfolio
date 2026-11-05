import type { Education, Experience, Project, SkillGroup, SocialLink } from './types';
import amazonLogo from './public/logos/amazon.png';
import shellLogo from './public/logos/shell.png';
import nyuLogo from './public/logos/nyu.png';
import anylangArch from './public/projects/anylang-arch.png';
import miniTensorCompilerOutput from './public/projects/minicompiler.png';
import repoScoutShot from './public/projects/repo-scout.png';
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

/**
 * Section headers. Titles are split so one word can carry the serif italic
 * without copy living in JSX.
 */
export const sections = {
  work: { label: 'Experience', title: { lead: 'Where I’ve ', em: 'built and led' } },
  projects: { label: 'Projects', title: { lead: 'Selected ', em: 'builds' } },
  skills: { label: 'Skills', title: { lead: 'The ', em: 'toolkit' } },
  education: { label: 'Education', title: { lead: 'Where I ', em: 'studied' } },
  writing: { label: 'Writing', title: { lead: 'Notes & ', em: 'write-ups' } },
  contact: { label: 'Contact', title: { lead: 'Let’s ', em: 'talk' } },
} as const;

export type SectionKey = keyof typeof sections;

export const hero = {
  /** The greeting above the stacked statement. */
  greeting: 'Hi, I’m Prajesh —',
  /**
   * The stacked identity. Each line is a word; `em` marks the one carried in the
   * accent (indigo). The scene the camera flies into is built from these.
   */
  statement: [
    { word: 'Engineer', em: false },
    { word: 'Compilers', em: true },
    { word: 'Security', em: false },
  ],
  caption: 'ENGINEER · COMPILERS · SECURITY',
  bio: 'SDE intern at Amazon and MSCS student at NYU Courant. I write compilers in C++ and OCaml, teach parallel computing, and do security research with OSIRIS Lab.',
  /** The hero portrait — the circular photo the scene is composed around. */
  portrait: heroPortrait,
  portraitAlt:
    'Prajesh Kumar at Belvedere Castle, Central Park, with the autumn trees and the skyline behind him',
  ctaLabel: 'See my work',
  ctaHref: '#work',
  resumeLabel: 'resume.pdf',
  /** The small cue inviting the scroll-zoom. */
  scrollCue: 'scroll to enter',
  /** Live clock readout in the scene's corner. */
  readout: {
    city: 'New York',
    timeZone: 'America/New_York',
    timeZoneLabel: 'ET',
  },
};

export const experiences: Experience[] = [
  {
    meta: 'JUN – AUG 2026 · SEATTLE',
    org: 'Amazon',
    logo: amazonLogo,
    logoLetters: { top: 0.023, bottom: 0.58 },
    role: 'Software Development Intern',
    points: [
      'Built a Grants Console that tracks every temporary access grant across Amazon Connect, showing exactly who can reach which resources and revoking access as soon as it is no longer needed.',
      'Modeled its authorization layer on AWS IAM and Amazon Connect’s permission model, so each admin sees only the grants their role permits.',
    ],
  },
  {
    meta: 'JAN 2026 – NOW · NEW YORK',
    current: true,
    org: 'NYU Courant',
    logo: nyuLogo,
    logoLetters: { top: 0.229, bottom: 0.789 },
    role: 'Course Assistant',
    points: [
      'Teach OpenMP, MPI, and CUDA to 100+ students a week in Courant’s parallel computing course, from their first parallel loop to reasoning about races, deadlocks, and why the speedup never quite matches the core count.',
      'Design and lead the weekly review sessions, from multi-core optimizations to GPU kernels.',
    ],
  },
  {
    meta: 'AUG 2023 – JUL 2025 · BENGALURU',
    org: 'Shell',
    logo: shellLogo,
    logoLetters: { top: 0.217, bottom: 0.973 },
    role: 'Software Engineer',
    points: [
      'Shipped features and APIs and fixed security vulnerabilities in a commissioning data platform, cut deployment time from 4 hours to under 1 with a CI/CD pipeline, and migrated 50K+ records to SQLite for 3x faster queries.',
      'Built a project on-boarding service that cut setup for construction sites from 3 weeks to 3 days, saving an estimated $80K a year.',
    ],
  },
];

export const projects: Project[] = [
  {
    tags: ['Python', 'FastAPI', 'React', 'TypeScript', 'RAG', 'pgvector', 'Redis'],
    title: 'repo-scout',
    body: 'Ask questions about any codebase and get answers with citations. Instead of returning snippets that only look similar, an agent walks the code — handler to service to model — and every claim it makes carries a file:line range you can open.',
    linkLabel: 'repo-scout.live ↗',
    href: 'https://repo-scout.live/',
    image: repoScoutShot,
    imageAlt:
      'The repo-scout landing page: a GitHub URL field with a “Read it” button, and four steps — paste a repo, we read it, ask in English, get proof.',
  },
  {
    tags: ['C++', 'MLIR', 'LLVM', 'JIT'],
    title: 'MiniTensorCompiler',
    body: 'A tensor language that compiles to LLVM. It fuses and folds operations, catches dimension mismatches at compile time instead of at runtime, and targets both native and JIT execution.',
    linkLabel: 'github ↗',
    href: 'https://github.com/prajeshkumarg/MiniTensorCompiler',
    image: miniTensorCompilerOutput,
    imageAlt:
      'Terminal output showing a tensor program lowered first to the ts-mlir dialect, then to LLVM MLIR.',
  },
  {
    tags: ['OCaml', 'RISC-V', 'CFG analysis'],
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
  label: 'Email',
  heading: 'Looking for my next role.',
  body: 'I’m seeking a 2027 SDE position on a compilers, systems, or security team. If that sounds like a fit, I’d like to hear from you.',
  ctaLabel: site.email,
  ctaHref: `mailto:${site.email}`,
  arrow: '↗',
};

/** The link tiles beside the contact tile. `value` is the handle shown large. */
export const contactLinks = [
  { label: 'Résumé', value: 'resume.pdf', href: site.resumeHref },
  { label: 'GitHub', value: 'prajeshkumarg', href: site.githubHref },
  { label: 'LinkedIn', value: 'in/prajeshkumarg', href: site.linkedinHref },
  { label: 'Blog', value: 'blog-praj3sh', href: site.blogHref },
];
