/* eslint-disable @next/next/no-img-element --
   Plain <img> on purpose: the engine takes these elements over (classes,
   inline transforms), and each poster must be its clip's exact first frame,
   already sized and encoded as WebP. */
import type { Dictionary, Locale } from "@/lib/dictionaries";
import type { Review } from "@/lib/reviews";
import { AIRBNB_URL } from "@/lib/site";
import { legs, win } from "@/lib/walk";

import { ReviewCarousel } from "./ReviewCarousel";

/**
 * The whole page as one worldflight: a single fixed stage holding every leg,
 * a fixed copy layer whose blocks open and close against the scroll track, and
 * an empty spacer that is the only thing in document flow. Server-rendered, so
 * every word is real HTML before the engine ever runs; scrollcraft.js only
 * drives opacity and the film timeline.
 *
 * Every scrim sits directly before the copy it protects, as a sibling, never a
 * child and never a window of its own: the contrast harness hides copy (and
 * everything inside it) to photograph the frame underneath, so a scrim must
 * survive that. WalkRuntime mirrors each copy block's opacity onto its scrim.
 */
export function Walk({
  dict,
  lang,
  reviews,
}: {
  dict: Dictionary;
  lang: Locale;
  reviews: Review[];
}) {
  const w = {
    opening: win("canopy", 0.12, "canopy", 0.94),
    inside: win("inside", 0.12, "inside", 0.92),
    pool: win("pool", 0.12, "pool", 0.92),
    coast: win("coast", 0.1, "coast", 0.82),
    // coast 0.82 → dusk 0.25 carries no copy: the silence the peak arrives from.
    evening: win("dusk", 0.25, "dusk", 0.98),
    gallery: win("gallery", 0.05, "king", 0.08),
    king: win("king", 0.16, "king", 0.92),
    twin: win("twin", 0.16, "twin", 0.92),
    details: win("evening", 0.02, "evening", 0.98),
    reviews: win("night", 0.03, "night", 0.38),
  };

  const scrim = (shape: string) => (
    <div className={`w-scrim w-scrim--${shape}`} data-scrim aria-hidden="true" />
  );

  return (
    <div className="walk" data-sc-mode="worldflight" data-sc-seam="0.16" data-sc-lerp="0.12">
      <div data-sc-world>
        {legs.map((leg) =>
          leg.key === "hero" ? (
            <div key={leg.key} className="hero" data-sc-segment data-sc-w={leg.w} data-sc-waypoint={leg.key}>
              {/* Far plane: the sky. The engine pushes it in slowly. */}
              <picture className="hero__far">
                <source media="(max-aspect-ratio: 4/5)" srcSet="/walk/hero-sky-p.webp" />
                <img data-sc-poster src="/walk/hero-sky.webp" alt="" fetchPriority="high" />
              </picture>
              {/* Mid plane: the real house with only its sky removed. */}
              <img className="hero__house" src="/walk/hero-house.webp" alt={dict.alt.hero} fetchPriority="high" />
              {/* Atmosphere: morning haze, which is also the headline's ground. */}
              <div className="hero__haze" aria-hidden="true" />
            </div>
          ) : (
            <div
              key={leg.key}
              data-sc-segment
              data-sc-w={leg.w}
              data-sc-linger={leg.linger}
              data-sc-waypoint={leg.key}
            >
              <img className="sc-world__poster" src={`/walk/${leg.poster}`} alt={dict.alt[leg.key]} loading="lazy" decoding="async" />
              {leg.clip && (
                <video
                  data-sc-src={`/walk/${leg.clip}.mp4`}
                  data-sc-src-mobile={`/walk/${leg.clip}-m.mp4`}
                  muted
                  playsInline
                  preload="none"
                  aria-hidden="true"
                />
              )}
            </div>
          ),
        )}
      </div>

      <main data-sc-world-copy>
        {/* One block spanning the frame: the headline holds the sky above the
            roofline, the facts sit on the open gravel below the house. Dark
            ink on the morning haze, the page's one light ground. */}
        <div className="w-copy w-hero" data-sc-copy data-sc-window="hero" data-mid="0">
          <div>
            <p className="w-eyebrow">{dict.hero.eyebrow}</p>
            <h1 className="w-display w-display--hero">{dict.hero.title}</h1>
          </div>
          <div>
            <p className="w-lede">{dict.hero.subtitle}</p>
            <p className="w-rating">
              <span aria-hidden="true">★</span> {dict.rating.score} · {dict.rating.reviews} · {dict.rating.superhost}
            </p>
          </div>
        </div>

        {scrim("left")}
        <div className="w-copy w-copy--mid-lead" data-sc-copy data-sc-window={w.opening.window} data-mid={w.opening.mid}>
          {dict.opening.body.split("\n\n").map((para, i) => (
            <p key={i} className={i === 0 ? "w-prose" : "w-prose w-prose--turn"}>{para}</p>
          ))}
        </div>

        {scrim("trail")}
        <section className="w-copy w-copy--trail" data-sc-copy data-sc-window={w.inside.window} data-mid={w.inside.mid}>
          <h2 className="w-display">{dict.house.title}</h2>
          <p className="w-body">{dict.house.body}</p>
        </section>

        {scrim("lead")}
        <section className="w-copy w-copy--lead" data-sc-copy data-sc-window={w.pool.window} data-mid={w.pool.mid}>
          <h2 className="w-display">{dict.pool.title}</h2>
          <p className="w-body">{dict.pool.body}</p>
        </section>

        {scrim("band")}
        <section className="w-copy w-copy--wide w-coast" data-sc-copy data-sc-window={w.coast.window} data-mid={w.coast.mid}>
          <div>
            <h2 className="w-display">{dict.setting.title}</h2>
            <p className="w-body">{dict.setting.body}</p>
          </div>
          <div>
            <ul className="w-distances">
              {dict.setting.distances.map((d) => (
                <li key={d.place}>
                  <span>{d.place}</span>
                  <span className="w-nums">{d.detail}</span>
                </li>
              ))}
            </ul>
            <p className="w-small">{dict.setting.distancesNote}</p>
          </div>
        </section>

        {scrim("band")}
        <section className="w-copy w-copy--lead" data-sc-copy data-sc-window={w.evening.window} data-mid={w.evening.mid}>
          <h2 className="w-display w-display--peak">{dict.evening.line}</h2>
          <p className="w-body">{dict.evening.body}</p>
        </section>

        {scrim("band")}
        <section className="w-copy w-copy--lead" data-sc-copy data-sc-window={w.gallery.window} data-mid={w.gallery.mid}>
          <p className="w-label">{dict.design.label}</p>
          <h2 className="w-display">{dict.design.title}</h2>
          <p className="w-body">{dict.design.body}</p>
        </section>

        {scrim("lead")}
        <section className="w-copy w-copy--lead" data-sc-copy data-sc-window={w.king.window} data-mid={w.king.mid}>
          <h2 className="w-display">{dict.rooms.title}</h2>
          <p className="w-body">{dict.rooms.body}</p>
          <p className="w-caption">{dict.rooms.bedroomOne}</p>
        </section>

        {scrim("trail")}
        <div className="w-copy w-copy--trail" data-sc-copy data-sc-window={w.twin.window} data-mid={w.twin.mid}>
          <p className="w-caption w-caption--lg">{dict.rooms.bedroomTwo}</p>
        </div>

        <section className="w-panel" data-sc-copy data-sc-window={w.details.window} data-mid={w.details.mid}>
          <p className="w-caption">{dict.rooms.bathrooms}</p>
          <h2 className="w-display w-display--sm">{dict.details.title}</h2>
          <dl className="w-facts">
            {dict.details.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd className="w-nums">{fact.value}</dd>
              </div>
            ))}
          </dl>
          <h3 className="w-label">{dict.details.amenitiesTitle}</h3>
          <ul className="w-amenities">
            {dict.details.amenities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h3 className="w-label">{dict.details.notesTitle}</h3>
          <ul className="w-notes">
            {dict.details.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>

        {reviews.length > 0 && (
          <>
            {scrim("deep")}
            <section className="w-copy w-copy--mid-lead w-reviews" data-sc-copy data-sc-window={w.reviews.window} data-mid={w.reviews.mid}>
              <h2 className="w-display w-display--sm">{dict.reviews.title}</h2>
              <dl className="w-stats">
                {dict.reviews.stats.map((stat) => (
                  <div key={stat.label}>
                    <dd className="w-nums">{stat.value}</dd>
                    <dt>{stat.label}</dt>
                  </div>
                ))}
              </dl>
              <ReviewCarousel reviews={reviews} labels={dict.reviews} />
              {/* Quotes stay in the language each guest wrote them in; on a
                  page in another language, say so rather than translating
                  words that still carry the guest's name. */}
              {lang !== "en" && <p className="w-small">{dict.reviews.originalLanguage}</p>}
              <p className="w-small">
                {dict.reviews.hostNote}{" "}
                <a href={AIRBNB_URL} target="_blank" rel="noopener noreferrer">
                  {dict.reviews.readAll}
                </a>
              </p>
            </section>
          </>
        )}

        {scrim("deep")}
        <section id="book" className="w-copy w-copy--mid-lead w-finale" data-sc-copy data-sc-window="finale" data-mid="end">
          <h2 className="w-display w-display--hero">{dict.cta.title}</h2>
          <p className="w-body">{dict.cta.body}</p>
          <a className="w-cta" href={AIRBNB_URL} target="_blank" rel="noopener noreferrer">
            {dict.cta.button}
          </a>
          <footer className="w-foot">
            <span>Costa Nativa · {dict.footer.tagline}</span>
            <span>
              © {new Date().getFullYear()} Costa Nativa. {dict.footer.rights}
            </span>
          </footer>
        </section>
      </main>

      <div data-sc-spacer aria-hidden="true" />
    </div>
  );
}
