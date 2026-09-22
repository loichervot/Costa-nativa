"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Fade-and-rise on first entry into the viewport.
 *
 * An IntersectionObserver plus two CSS custom properties, rather than an
 * animation library: the whole effect is one transition, and a 40KB dependency
 * would cost more than it buys on a page whose weight is all photography.
 *
 * The displaced starting state and the reduced-motion escape hatch both live
 * in globals.css under [data-reveal].
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Anything already on screen at mount (the hero) is released immediately,
    // so it never sits invisible waiting for a scroll that may not come.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        entry.target.setAttribute("data-revealed", "true");
        observer.unobserve(entry.target);
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal=""
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}
