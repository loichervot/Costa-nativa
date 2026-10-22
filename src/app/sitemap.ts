import type { MetadataRoute } from "next";

import { posts } from "@/lib/blog";
import { locales } from "@/lib/dictionaries";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const home: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: locale === "en" ? 1 : 0.9,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}`])),
    },
  }));

  // The blog is English only, so its entries carry no language alternates.
  const blog: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/en/blog`, lastModified: posts[0] ? new Date(posts[0].date) : new Date(), changeFrequency: "weekly", priority: 0.7 },
    ...posts.map((p) => ({
      url: `${SITE_URL}/en/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];

  return [...home, ...blog];
}
