import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { formatDate, getPost, posts } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() {
  return posts.map((p) => ({ lang: "en", slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/blog/[slug]">): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  const url = `/en/blog/${post.slug}`;
  return {
    metadataBase: new URL(SITE_URL),
    title: `${post.title} · Costa Nativa`,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      siteName: "Costa Nativa",
      url: `${SITE_URL}${url}`,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      images: [{ url: post.image.src, width: post.image.width, height: post.image.height, alt: post.imageAlt }],
    },
    twitter: { card: "summary_large_image", images: [post.image.src] },
  };
}

export default async function PostPage({ params }: PageProps<"/[lang]/blog/[slug]">) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const { Body } = post;
  const others = posts.filter((p) => p.slug !== post.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    image: `${SITE_URL}${post.image.src}`,
    url: `${SITE_URL}/en/blog/${post.slug}`,
    mainEntityOfPage: `${SITE_URL}/en/blog/${post.slug}`,
    author: { "@type": "Organization", name: "Costa Nativa", url: SITE_URL },
    publisher: { "@type": "Organization", name: "Costa Nativa", url: SITE_URL },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <article className="post">
        <header className="post__head">
          <Link href="/en/blog" className="post__back">
            Notes from Brasilito
          </Link>
          <h1 className="post__title">{post.title}</h1>
          <p className="card__meta">
            <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.minutes} min read · By
            Costa Nativa
          </p>
        </header>
        <div className="post__hero">
          <Image src={post.image} alt={post.imageAlt} placeholder="blur" priority sizes="(max-width: 1100px) 100vw, 68rem" />
        </div>
        <div className="post__body">
          <Body />
        </div>
      </article>

      {others.length > 0 && (
        <nav className="post__more" aria-label="More from the blog">
          <p className="w-eyebrow">More from Brasilito</p>
          <ul>
            {others.map((p) => (
              <li key={p.slug}>
                <Link href={`/en/blog/${p.slug}`}>{p.title}</Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </main>
  );
}
