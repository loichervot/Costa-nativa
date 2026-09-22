/**
 * Facts about the listing, in one place.
 *
 * Everything here is taken from the live Airbnb listing. Ratings drift as
 * reviews come in — re-check `rating` before any significant push.
 *
 * Note the two different review counts Airbnb publishes: 129 reviews / 4.95 is
 * the *host* figure across all of Paula's listings, while 83 / 4.96 belongs to
 * this listing. We show the listing figure, because that is what this page is
 * about.
 */
export const AIRBNB_URL = "https://www.airbnb.com/h/costanativa";

export const SITE_URL = "https://costa-nativa.com";

export const rating = {
  score: 4.96,
  reviewCount: 83,
} as const;

export const geo = {
  // Brasilito, Guanacaste. Approximate — the house is inside a gated community
  // and the exact pin is deliberately not published.
  latitude: 10.4139,
  longitude: -85.7972,
} as const;
