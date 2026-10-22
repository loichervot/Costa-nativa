/**
 * The walk: one continuous scroll through the house over one day.
 *
 * Each leg owns `w` viewport-heights of scroll. Clip legs hold one pace
 * (1.1vh per 5s of film, ~0.22vh/s) so the world never surges or drags; the
 * gallery clip is 2.5s and gets half the weight. The peak is the doors and the
 * dusk: two clips on one locked camera, frame-matched on the real photo, so it
 * reads as the single long leg of the page.
 *
 * Copy windows are computed from these weights rather than typed as numbers,
 * because every weight change moves every boundary after it.
 */
export type Leg = {
  key:
    | "hero" | "canopy" | "inside" | "pool" | "coast" | "doors"
    | "dusk" | "gallery" | "king" | "twin" | "evening" | "night";
  w: number;
  linger?: number;
  /** Basename in /public/walk. No clip means a poster-only leg. */
  clip?: string;
  poster: string;
};

export const legs: Leg[] = [
  { key: "hero", w: 1.0, poster: "hero-sky.webp" },
  { key: "canopy", w: 1.1, clip: "02-canopy", poster: "02-canopy.webp" },
  { key: "inside", w: 1.1, clip: "03-inside", poster: "03-inside.webp" },
  { key: "pool", w: 1.1, clip: "04-pool", poster: "04-pool.webp" },
  { key: "coast", w: 1.1, linger: 0.2, clip: "05-coast", poster: "05-coast.webp" },
  { key: "doors", w: 1.1, clip: "06-doors", poster: "06-doors.webp" },
  { key: "dusk", w: 1.1, linger: 0.3, clip: "07-dusk", poster: "07-dusk.webp" },
  { key: "gallery", w: 0.6, clip: "08-gallery", poster: "08-gallery.webp" },
  { key: "king", w: 1.1, clip: "09-king", poster: "09-king.webp" },
  { key: "twin", w: 1.1, clip: "10-twin", poster: "10-twin.webp" },
  { key: "evening", w: 1.0, poster: "12-evening.webp" },
  { key: "night", w: 2.0, linger: 0.3, clip: "11-night", poster: "11-night.webp" },
];

export const total = legs.reduce((sum, leg) => sum + leg.w, 0);

/** Track position (viewport-heights) where each leg starts. */
export const starts = legs.reduce<number[]>((acc, leg, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + legs[i - 1].w);
  return acc;
}, []);

const at = (key: Leg["key"], local: number) => {
  const i = legs.findIndex((leg) => leg.key === key);
  return starts[i] + legs[i].w * local;
};

/**
 * A copy window from `a` of one leg to `b` of another, as the engine wants it:
 * fractions of the whole track. Also returns the midpoint in track units, which
 * the page uses to bring a window on screen when keyboard focus enters it.
 */
export function win(fromKey: Leg["key"], a: number, toKey: Leg["key"], b: number) {
  const from = at(fromKey, a);
  const to = at(toKey, b);
  return { window: `${(from / total).toFixed(4)} ${(to / total).toFixed(4)}`, mid: (from + to) / 2 };
}

/** The sun rail's stops, in the order of `dict.stops`. */
export const stopLegs: Leg["key"][] = [
  "hero", "canopy", "inside", "pool", "coast", "doors", "gallery", "king", "night",
];
export const stopAt = stopLegs.map((key) => at(key, key === "hero" ? 0 : 0.12));
