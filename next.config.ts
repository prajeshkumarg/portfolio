import type { NextConfig } from 'next';

/*
 * Dev only. Next blocks its dev JS and HMR for any origin but localhost, so a
 * page opened on this machine's LAN address (e.g. to test from a phone) renders
 * but never hydrates. Allow the private address ranges instead of one IP, so a
 * new address from the router — home Wi-Fi, campus, office — just works, even
 * mid-session. Public sites never have these origins, which is what the block
 * protects against. Each `*` matches exactly one address segment.
 */
const privateRanges = [
  '192.168.*.*',
  '10.*.*.*',
  // 172.16.0.0 – 172.31.255.255
  ...Array.from({ length: 16 }, (_, i) => `172.${16 + i}.*.*`),
];

const nextConfig: NextConfig = {
  allowedDevOrigins: [...privateRanges, '*.local'],
};

export default nextConfig;
