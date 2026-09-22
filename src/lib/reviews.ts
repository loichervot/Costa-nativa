/**
 * Real guest review quotes, pasted from the Airbnb listing.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THIS ARRAY IS INTENTIONALLY EMPTY. Do not invent entries.
 *
 * Airbnb renders its review text in JavaScript, so it could not be scraped
 * when this site was built. Fabricated testimonials are dishonest and, as
 * marketing claims, a real legal exposure.
 *
 * To add them: open https://www.airbnb.com/h/costanativa, pick three to five
 * reviews, and copy them in verbatim. The reviews section and the
 * aggregateRating in the structured data both switch on automatically once
 * this array has entries — Google treats rating markup with no visible reviews
 * on the page as a structured-data violation, so the two are deliberately
 * tied together.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export type Review = {
  /** Verbatim quote. Trim to a sentence or two, but never reword. */
  quote: string;
  /** Reviewer's first name, as Airbnb shows it. */
  name: string;
  /** e.g. "March 2025" */
  date: string;
};

export const reviews: Review[] = [];
