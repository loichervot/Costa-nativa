import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /*
     * Applies to `next build` / `next start` only.
     *
     * In production this site runs on Netlify, whose runtime swaps Next's
     * image optimizer for the Netlify Image CDN — and that ignores this
     * setting, negotiating WebP ahead of AVIF off the Accept header. Measured
     * on the deployed site, that is the better call anyway: Netlify's encoder
     * produces a 151KB WebP against a 189KB AVIF for the hero photo at
     * 1080px, so forcing AVIF there would cost bytes rather than save them.
     *
     * Kept because it is still correct locally and on any host that uses
     * Next's own optimizer, where AVIF does come out materially smaller.
     */
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
