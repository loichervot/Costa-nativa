"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Dictionary } from "@/lib/dictionaries";
import type { Review } from "@/lib/reviews";

/**
 * One quote at a time, moved by hand.
 *
 * Built on native CSS scroll-snap rather than a carousel library: the browser
 * already does momentum, touch swipe and snapping better than anything we
 * would ship, and the buttons are just `scrollTo`. It also means the control
 * state can never disagree with what is on screen, because the scroll
 * position is the only source of truth.
 *
 * There is no autoplay. The brief is calm, and a panel that moves on its own
 * is both the opposite of that and a pile of accessibility problems.
 */
export function ReviewCarousel({
  reviews,
  labels,
}: {
  reviews: Review[];
  labels: Dictionary["reviews"];
}) {
  const scroller = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);

  // Derive the active slide from where the scroller actually is, so dragging,
  // swiping and the buttons all stay in agreement.
  const onScroll = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const slide = el.clientWidth;
    if (!slide) return;
    setIndex(Math.round(el.scrollLeft / slide));
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const goTo = useCallback((i: number) => {
    const el = scroller.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: i * el.clientWidth, behavior: reduced ? "auto" : "smooth" });
  }, []);

  const atStart = index <= 0;
  const atEnd = index >= reviews.length - 1;

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={labels.carousel}
      className="mt-14"
    >
      <ul
        ref={scroller}
        tabIndex={0}
        className="flex snap-x snap-mandatory overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {reviews.map((review, i) => (
          <li
            key={review.name + i}
            aria-label={`${i + 1} / ${reviews.length}`}
            aria-roledescription="slide"
            className="w-full shrink-0 snap-center px-1"
          >
            <blockquote className="mx-auto max-w-[58ch] text-center">
              <p className="font-display text-xl leading-[1.6] text-ink sm:text-2xl sm:leading-[1.55]">
                “{review.quote}”
              </p>
              <footer className="mt-8 text-sm tracking-wide text-ink-soft">
                <span className="font-medium text-ink">{review.name}</span>
                {(review.date || review.tenure) && (
                  <>
                    <span aria-hidden="true" className="mx-2 text-ink-soft/50">
                      ·
                    </span>
                    {review.date ?? review.tenure}
                  </>
                )}
              </footer>
            </blockquote>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex items-center justify-center gap-6">
        <Arrow
          direction="prev"
          label={labels.prev}
          disabled={atStart}
          onClick={() => goTo(index - 1)}
        />

        <ol className="flex items-center gap-2.5">
          {reviews.map((review, i) => (
            <li key={review.name + i}>
              <button
                type="button"
                aria-label={`${labels.goTo} ${i + 1}`}
                aria-current={i === index}
                onClick={() => goTo(i)}
                className={`block h-1.5 rounded-full transition-all duration-500 ${
                  i === index ? "w-6 bg-ochre-deep" : "w-1.5 bg-ink/25 hover:bg-ink/45"
                }`}
              />
            </li>
          ))}
        </ol>

        <Arrow
          direction="next"
          label={labels.next}
          disabled={atEnd}
          onClick={() => goTo(index + 1)}
        />
      </div>
    </div>
  );
}

function Arrow({
  direction,
  label,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors duration-300 hover:border-ink/50 disabled:pointer-events-none disabled:opacity-25"
    >
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        className={`h-4 w-4 ${direction === "next" ? "" : "rotate-180"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M6 3.5 10.5 8 6 12.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
