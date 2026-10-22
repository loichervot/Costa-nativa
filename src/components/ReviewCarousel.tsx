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
    >
      <ul
        ref={scroller}
        tabIndex={0}
        className="rc__track"
      >
        {reviews.map((review, i) => (
          <li
            key={review.name + i}
            aria-label={`${i + 1} / ${reviews.length}`}
            aria-roledescription="slide"
            className="rc__slide"
          >
            <blockquote className="rc__quote">
              <p>
                “{review.quote}”
              </p>
              <footer>
                <span className="rc__name">{review.name}</span>
                {(review.date || review.tenure) && (
                  <>
                    <span aria-hidden="true"> · </span>
                    {review.date ?? review.tenure}
                  </>
                )}
              </footer>
            </blockquote>
          </li>
        ))}
      </ul>

      <div className="rc__controls">
        <Arrow
          direction="prev"
          label={labels.prev}
          disabled={atStart}
          onClick={() => goTo(index - 1)}
        />

        <ol className="rc__dots">
          {reviews.map((review, i) => (
            <li key={review.name + i}>
              <button
                type="button"
                aria-label={`${labels.goTo} ${i + 1}`}
                aria-current={i === index}
                onClick={() => goTo(i)}
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
      className="rc__arrow"
    >
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        className={direction === "next" ? undefined : "rc__flip"}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M6 3.5 10.5 8 6 12.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
