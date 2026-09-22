import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Hero } from "@/components/Hero";
import { ReviewCarousel } from "@/components/ReviewCarousel";
import { SiteHeader } from "@/components/SiteHeader";
import {
  Body,
  BookButton,
  Eyebrow,
  Photo,
  Reveal,
  Section,
  Star,
  Title,
} from "@/components/primitives";
import { getDictionary, isLocale, locales, otherLocale } from "@/lib/dictionaries";
import { photos } from "@/lib/photos";
import { reviews } from "@/lib/reviews";
import { AIRBNB_URL, SITE_URL, geo, rating } from "@/lib/site";

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
      // Every quote carried here is also visible in the carousel above, which
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

      <a
        href="#house"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:bg-ink focus:px-5 focus:py-3 focus:text-cream"
      >
        {dict.nav.skipToContent}
      </a>

      <SiteHeader nav={dict.nav} locale={lang} other={other} />

      <main>
        <Hero dict={dict} />

        {/* Opening — type only, deliberately unaccompanied. The page has just
            spent a full screen on a photograph; this is the exhale. */}
        <Section tone="cream" className="!py-28 md:!py-36 lg:!py-44">
          <Reveal>
            <div className="mx-auto max-w-[54ch]">
              {dict.opening.body.split("\n\n").map((para, i) => (
                <p
                  key={i}
                  className={`font-display text-2xl leading-[1.55] text-ink sm:text-[1.75rem] ${i > 0 ? "mt-8" : ""}`}
                >
                  {para}
                </p>
              ))}
            </div>
          </Reveal>
        </Section>

        {/* The house */}
        <Section id="house" tone="sand">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <Eyebrow>{dict.house.eyebrow}</Eyebrow>
              <Title>{dict.house.title}</Title>
              <Body>{dict.house.body}</Body>
            </Reveal>
            <Reveal delay={140}>
              <Photo
                src={photos.kitchenLivingWide}
                alt={dict.house.alt.kitchenLivingWide}
                className="aspect-[4/3]"
              />
            </Reveal>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:mt-8">
            <Reveal>
              <Photo
                src={photos.livingPoolView}
                alt={dict.house.alt.livingPoolView}
                className="aspect-[3/2]"
              />
            </Reveal>
            <Reveal delay={140}>
              <Photo
                src={photos.livingToEntry}
                alt={dict.house.alt.livingToEntry}
                className="aspect-[3/2]"
              />
            </Reveal>
          </div>
        </Section>

        {/* Pool & terrace — the night shot goes full bleed. It is the single
            most persuasive image in the set and earns the whole width. */}
        <section id="pool" className="bg-ink text-cream">
          <Reveal>
            <Photo
              src={photos.terraceNight}
              alt={dict.pool.alt.terraceNight}
              sizes="100vw"
              className="h-[60vh] min-h-[420px] w-full lg:h-[78vh]"
            />
          </Reveal>

          <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-8 md:py-32">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
              <Reveal>
                <Eyebrow tone="light">{dict.pool.eyebrow}</Eyebrow>
                <Title>{dict.pool.title}</Title>
              </Reveal>
              <Reveal delay={140}>
                <Body tone="light">{dict.pool.body}</Body>
              </Reveal>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2">
              <Reveal>
                <Photo src={photos.poolDay} alt={dict.pool.alt.poolDay} className="aspect-[3/2]" />
              </Reveal>
              <Reveal delay={140}>
                <Photo
                  src={photos.terraceWide}
                  alt={dict.pool.alt.terraceWide}
                  className="aspect-[3/2]"
                />
              </Reveal>
            </div>
          </div>
        </section>

        {/* Rooms */}
        <Section id="rooms" tone="cream">
          <Reveal>
            <Eyebrow>{dict.rooms.eyebrow}</Eyebrow>
            <Title>{dict.rooms.title}</Title>
            <Body>{dict.rooms.body}</Body>
          </Reveal>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <Reveal>
              <Photo
                src={photos.bedroomKing}
                alt={dict.rooms.alt.bedroomKing}
                sizes="(max-width: 768px) 100vw, 380px"
                className="aspect-[4/5]"
              />
              <p className="mt-4 text-sm tracking-wide text-ink-soft">{dict.rooms.bedroomOne}</p>
            </Reveal>
            <Reveal delay={120}>
              <Photo
                src={photos.bedroomTwo}
                alt={dict.rooms.alt.bedroomTwo}
                sizes="(max-width: 768px) 100vw, 380px"
                className="aspect-[4/5]"
              />
              <p className="mt-4 text-sm tracking-wide text-ink-soft">{dict.rooms.bedroomTwo}</p>
            </Reveal>
            <Reveal delay={240}>
              <Photo
                src={photos.bathroom}
                alt={dict.rooms.alt.bathroom}
                sizes="(max-width: 768px) 100vw, 380px"
                className="aspect-[4/5]"
                // Biased upward: a centred crop of this frame leads with the
                // toilet. Higher up it is the artwork, concrete and towels.
                imgClassName="object-[center_28%]"
              />
              <p className="mt-4 text-sm tracking-wide text-ink-soft">{dict.rooms.bathrooms}</p>
            </Reveal>
          </div>
        </Section>

        {/* The architecture and art — one quiet block, not a section of its own. */}
        <Section tone="sand">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
            <Reveal>
              <Photo
                src={photos.terraceLounge}
                alt={dict.design.alt}
                className="aspect-[4/3]"
              />
            </Reveal>
            <Reveal delay={140}>
              <Eyebrow>{dict.design.eyebrow}</Eyebrow>
              <Title className="text-3xl sm:text-4xl lg:text-5xl">{dict.design.title}</Title>
              <Body>{dict.design.body}</Body>
            </Reveal>
          </div>
        </Section>

        {/* The setting */}
        <Section id="setting" tone="cream">
          <Reveal>
            <Eyebrow>{dict.setting.eyebrow}</Eyebrow>
            <Title>{dict.setting.title}</Title>
          </Reveal>

          <Reveal delay={120}>
            <Photo
              src={photos.coastAerial}
              alt={dict.setting.alt}
              sizes="(max-width: 1280px) 100vw, 1152px"
              className="mt-12 aspect-[16/9]"
            />
          </Reveal>

          <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <Body>{dict.setting.body}</Body>
            </Reveal>

            <Reveal delay={140}>
              <ul className="divide-y divide-ink/10 border-t border-ink/10">
                {dict.setting.distances.map((d) => (
                  <li key={d.place} className="flex items-baseline justify-between gap-6 py-4">
                    <span className="text-base sm:text-lg">{d.place}</span>
                    <span className="text-right text-sm text-ink-soft">{d.detail}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-ink-soft/80">{dict.setting.distancesNote}</p>
            </Reveal>
          </div>
        </Section>

        {/* Details */}
        <Section id="details" tone="sand">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
            <Reveal>
              <Eyebrow>{dict.details.eyebrow}</Eyebrow>
              <Title>{dict.details.title}</Title>

              <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden border border-ink/10 bg-ink/10 sm:grid-cols-4">
                {dict.details.facts.map((fact) => (
                  <div key={fact.label} className="bg-sand px-4 py-6 text-center">
                    <dt className="text-xs tracking-[0.14em] text-ink-soft uppercase">
                      {fact.label}
                    </dt>
                    <dd className="font-display mt-2 text-3xl">{fact.value}</dd>
                  </div>
                ))}
              </dl>

              <h3 className="mt-12 text-xs font-medium tracking-[0.2em] text-ochre-deep uppercase">
                {dict.details.amenitiesTitle}
              </h3>
              {/* Columns rather than a grid: one amenity wraps to two lines,
                  and in a grid that punches a hole in the opposite column. */}
              <ul className="mt-6 sm:columns-2 sm:gap-x-8">
                {dict.details.amenities.map((item) => (
                  <li
                    key={item}
                    className="mb-3 flex break-inside-avoid gap-3 text-[0.95rem] text-ink-soft"
                  >
                    <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ochre" />
                    {item}
                  </li>
                ))}
              </ul>

              <h3 className="mt-12 text-xs font-medium tracking-[0.2em] text-ochre-deep uppercase">
                {dict.details.notesTitle}
              </h3>
              <ul className="mt-6 space-y-2.5">
                {dict.details.notes.map((note) => (
                  <li key={note} className="text-[0.95rem] leading-relaxed text-ink-soft">
                    {note}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={140}>
              <Photo
                src={photos.facade}
                alt={dict.details.alt}
                className="aspect-[3/4] lg:sticky lg:top-28"
              />
            </Reveal>
          </div>
        </Section>

        {/* Guests */}
        <Section tone="cream">
          <Reveal>
            <Eyebrow>{dict.reviews.eyebrow}</Eyebrow>
            <Title>{dict.reviews.title}</Title>
          </Reveal>

          <Reveal delay={120}>
            <dl className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
              {dict.reviews.stats.map((stat) => (
                <div key={stat.label}>
                  <dd className="font-display flex items-center gap-2 text-4xl">
                    <Star className="h-5 w-5 text-ochre" />
                    {stat.value}
                  </dd>
                  <dt className="mt-2 text-xs tracking-[0.14em] text-ink-soft uppercase">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* Renders nothing until real quotes are added — see lib/reviews.ts. */}
          {reviews.length > 0 && (
            <Reveal delay={160}>
              <ReviewCarousel reviews={reviews} labels={dict.reviews} />
              {/* Every quote is currently English. Saying so on the Spanish
                  page is the honest alternative to translating testimonials:
                  rewording someone's words and still signing their name to
                  them misrepresents what they said. Shown only where the
                  quotes and the page disagree. */}
              {lang !== "en" && (
                <p className="mt-8 text-center text-xs text-ink-soft/70">
                  {dict.reviews.originalLanguage}
                </p>
              )}
            </Reveal>
          )}

          <Reveal delay={200}>
            <p className="mt-14 text-base text-ink-soft">{dict.reviews.hostNote}</p>
            <a
              href={AIRBNB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block border-b border-ochre pb-0.5 text-sm tracking-wide text-ink transition-colors duration-200 hover:border-ink"
            >
              {dict.reviews.readAll}
            </a>
          </Reveal>
        </Section>

        {/* Close */}
        <section className="relative flex min-h-[80vh] items-center overflow-hidden">
          {/* Positioning lives on this wrapper, not on Photo: Photo sets
              `relative` on its own root, and passing `absolute` through
              className loses to it on CSS source order. */}
          <div className="absolute inset-0">
            <Photo
              src={photos.exteriorTwilightFront}
              alt={dict.cta.alt}
              sizes="100vw"
              className="h-full w-full"
            />
          </div>
          <div aria-hidden="true" className="absolute inset-0 bg-ink/65" />

          <div className="relative mx-auto w-full max-w-6xl px-6 py-24 text-center sm:px-8">
            <Reveal>
              <Eyebrow tone="light">{dict.cta.eyebrow}</Eyebrow>
              <Title className="mx-auto max-w-[18ch] text-cream">{dict.cta.title}</Title>
              <p className="mx-auto mt-6 max-w-[48ch] text-lg leading-[1.75] text-cream/80">
                {dict.cta.body}
              </p>
              <BookButton className="mt-10">{dict.cta.button}</BookButton>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="bg-ink px-6 py-16 text-cream sm:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-display text-2xl">Costa Nativa</p>
            <p className="mt-2 text-sm text-cream/60">{dict.footer.tagline}</p>
            <p className="mt-6 text-xs text-cream/60">{dict.footer.architecture}</p>
          </div>
          <div className="text-sm sm:text-right">
            <a
              href={AIRBNB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-ochre pb-0.5 transition-colors duration-200 hover:border-cream"
            >
              {dict.nav.book}
            </a>
            <p className="mt-6 text-xs text-cream/60">
              © {new Date().getFullYear()} Costa Nativa. {dict.footer.rights}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
