/**
 * Real guest review quotes, copied verbatim from the Airbnb listing.
 *
 * Two rules for anything added here:
 *
 * 1. Verbatim. Never reword, never invent. Fabricated testimonials are
 *    dishonest and, as marketing claims, a real legal exposure.
 * 2. Not translated. These are the guests' own words, and they appear in
 *    English on the Spanish page too. Rewriting someone's testimonial into
 *    another language and still attributing it to them by name misrepresents
 *    what they said — Airbnb itself shows the original with a translate
 *    toggle rather than silently swapping it.
 *
 * Airbnb labels some reviewers with a date and others with how long they have
 * been on the platform. Both are carried as-is; neither is guessed when
 * missing.
 *
 * The reviews section and the aggregateRating in the structured data are both
 * gated on this array being non-empty. That is deliberate: Google treats
 * rating markup with no visible reviews on the page as a structured-data
 * violation.
 */
export type Review = {
  /** Verbatim quote. */
  quote: string;
  /** Reviewer's first name, as Airbnb shows it. */
  name: string;
  /** e.g. "July 2026". Present when Airbnb dates the review. */
  date?: string;
  /** e.g. "9 years on Airbnb". Present when Airbnb shows tenure instead. */
  tenure?: string;
};

export const reviews: Review[] = [
  {
    quote:
      "The house was beautiful and well-maintained. Marco met us at the house and explained everything. It’s inside a gated community with 24hr guards at the gate and the house itself has a remote operated gate so you feel super secure. The A/C is perfect and there are fans in every room. The beds have excellent mattresses. The location is very close to great beaches. We’d come again.",
    name: "Shay",
    date: "July 2026",
  },
  {
    quote:
      "Beautiful house on a large property with a pool, outside deck, and very nice landscaping. The bedrooms were large, kitchen had all we needed to prepare meals. We met with the host at the house. He had helpful instructions and was professional, a prompt communicator and very friendly. Overall, we were extremely satisfied with this property, and we would book it again.",
    name: "Nathalie",
    date: "February 2026",
  },
  {
    quote:
      "We really enjoyed our stay at Paula’s place. We were greeted by a friendly co-host who was always quick to respond to any questions, which made everything easy. The place itself was beautiful, very well located, and close to lots of stunning beaches. One of the highlights for us was the swimming pool, which our kids absolutely loved. It was perfect for a family getaway. Thanks for having us!",
    name: "Michelle",
    tenure: "9 years on Airbnb",
  },
  {
    quote:
      "We absolutely loved this place. The house was so light, immaculately clean and with great air con throughout. It was the perfect size for us and our two older teens. The outside space was enormous and we really enjoyed sitting out by the pool in the evenings. Also great to have a supermarket close by and the beautiful Brasilito and Playa Conchal beaches.",
    name: "Rebecca",
    tenure: "14 years on Airbnb",
  },
];
