import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /*
     * AVIF first, WebP as the fallback. This page is almost entirely
     * photography, so the ~30% AVIF saves over WebP lands directly on LCP.
     * Encoding is slower, but every variant is generated once and then cached
     * at the edge.
     */
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
