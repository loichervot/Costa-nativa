import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/SiteHeader";
import { SunRail } from "@/components/SunRail";
import { Walk } from "@/components/Walk";
import { WalkRuntime } from "@/components/WalkRuntime";
import { getDictionary, isLocale, locales, otherLocale } from "@/lib/dictionaries";
import { reviews } from "@/lib/reviews";
import { SITE_URL, geo, rating } from "@/lib/site";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);

  return {
    metadataBase: new URL(SITE_URL),
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: `/${lang}`,
      languages: { en: "/en", es: "/es", "x-default": "/en" },
    },
    openGraph: {
      type: "website",
      siteName: "Costa Nativa",
      locale: lang === "es" ? "es_CR" : "en_US",
      url: `${SITE_URL}/${lang}`,
      title: dict.meta.title,
      description: dict.meta.description,
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: dict.meta.ogAlt }],
    },
    twitter: { card: "summary_large_image", images: ["/og.jpg"] },
  };
}

export default async function Page({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const other = otherLocale(lang);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    name: "Costa Nativa",
    description: dict.meta.description,
    url: `${SITE_URL}/${lang}`,
    image: `${SITE_URL}/og.jpg`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Brasilito",
      addressRegion: "Guanacaste",
      addressCountry: "CR",
    },
    geo: { "@type": "GeoCoordinates", ...geo },
    numberOfRooms: 2,
    occupancy: { "@type": "QuantitativeValue", maxValue: 5 },
    amenityFeature: dict.details.amenities.map((name) => ({
      "@type": "LocationFeatureSpecification",
      name,
      value: true,
    })),
    // Only claim a rating once real quotes render on the page — see lib/reviews.
    ...(reviews.length > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: rating.score,
        reviewCount: rating.reviewCount,
        bestRating: 5,
      },
      // Every quote carried here is also visible in the reviews window, which
      // is what keeps this markup legitimate rather than decorative.
      review: reviews.map((r) => ({
        "@type": "Review",
        reviewBody: r.quote,
        author: { "@type": "Person", name: r.name },
        reviewRating: { "@type": "Rating", ratingValue: 5, bestRating: 5 },
        ...(r.date && { datePublished: r.date }),
      })),
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <a href="#book" className="skip">
        {dict.nav.skipToContent}
      </a>
      <SiteHeader nav={dict.nav} locale={lang} other={other} />
      <Walk dict={dict} lang={lang} reviews={reviews} />
      <SunRail stops={dict.stops} nav={dict.nav} />
      <WalkRuntime />
    </>
  );
}
