import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { formatDate, posts } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

// English only: /es/blog is not generated and 404s.
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ lang: "en" }];
}

const title = "Notes from Brasilito · The Costa Nativa blog";
const description =
  "Practical, occasionally silly notes for people coming to Brasilito and Playa Conchal: beaches, wildlife, and how to spend a slow day in Guanacaste.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  alternates: { canonical: "/en/blog" },
  openGraph: { type: "website", siteName: "Costa Nativa", url: `${SITE_URL}/en/blog`, title, description },
};

export default function BlogIndex() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Notes from Brasilito",
    url: `${SITE_URL}/en/blog`,
    publisher: { "@type": "Organization", name: "Costa Nativa", url: SITE_URL },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${SITE_URL}/en/blog/${p.slug}`,
      datePublished: p.date,
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <header className="blog__head">
        <p className="w-eyebrow">The Costa Nativa blog</p>
        <h1 className="blog__title">Notes from Brasilito</h1>
        <p className="blog__intro">{description}</p>
      </header>

      {/* Newest first; lib/blog.ts owns the order. */}
      <ol className="blog__list">
        {posts.map((post, i) => (
          <li key={post.slug}>
            <article className="card">
              {/* The image repeats the title link, so it stays out of the tab order. */}
              <Link href={`/en/blog/${post.slug}`} className="card__image" tabIndex={-1} aria-hidden="true">
                <Image
                  src={post.image}
                  alt=""
                  placeholder="blur"
                  sizes="(max-width: 860px) 100vw, 30rem"
                  priority={i === 0}
                />
              </Link>
              <div className="card__text">
                <p className="card__meta">
                  <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.minutes} min read
                </p>
                <h2 className="card__title">
                  <Link href={`/en/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="card__desc">{post.description}</p>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </main>
  );
}
