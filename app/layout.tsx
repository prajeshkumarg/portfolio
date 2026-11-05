import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono, Instrument_Serif } from 'next/font/google';
import 'lenis/dist/lenis.css';
import './globals.css';

/* headings + body — the editorial sans */
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

/* labels, meta, mono UI */
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  variable: '--font-mono',
  display: 'swap',
});

/* display accent — the one italic word in the hero + section titles */
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Prajesh Kumar — compilers, systems, security',
  description:
    'SDE intern at Amazon, MSCS at NYU Courant — I write compilers in C++ and OCaml, teach parallel computing, and do security research with OSIRIS Lab.',
};

/* Runs before first paint. Marks the page as animated (so the scene can start in
   its far state) unless the visitor prefers reduced motion. If the motion bundle
   never boots, the class is dropped after 3s so nothing stays hidden. */
const motionBoot = `(function(){var d=document.documentElement;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('motion');setTimeout(function(){if(!window.__motion)d.classList.remove('motion')},3000)})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBoot }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
