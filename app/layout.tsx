import type { Metadata } from 'next';
import 'lenis/dist/lenis.css';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://prajeshkumar.com'),
  title: 'Prajesh Kumar — software engineer',
  description:
    'Software engineer. Amazon, NYU Courant, Shell. I build systems, compilers, and the security that holds them together — and I am looking for a 2027 SDE role.',
};

/* Runs before first paint. Marks the page as animated so the hero lines can
   start masked, unless the visitor prefers reduced motion. If the motion bundle
   never boots, the class is dropped after 3s so nothing stays hidden. */
const motionBoot = `(function(){var d=document.documentElement;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('motion');setTimeout(function(){if(!window.__motion)d.classList.remove('motion')},3000)})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=switzer@400,500,600&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: motionBoot }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
