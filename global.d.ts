// Marks the page as having a booted motion layer. The pre-paint boot script in
// `app/layout.tsx` adds `html.motion`; the Motion client component sets this
// flag once it mounts so the boot script's 3s fallback knows motion is live.
declare global {
  interface Window {
    __motion?: boolean;
  }
}

export {};
