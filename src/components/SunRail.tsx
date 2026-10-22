"use client";

import { useEffect, useRef, useState } from "react";

import type { Dictionary } from "@/lib/dictionaries";
import { stopAt, total } from "@/lib/walk";

/**
 * The page's map, drawn as the sun's path across one day. The sun rides the
 * arc as you scroll; each hour is a stop you can jump to; dragging the sun (or
 * arrowing it from the keyboard) scrubs the whole walk. The same progress
 * regrades the interface: sun, rail ink and every scrim shift from morning to
 * night together, so the chrome lives in the same hour as the footage.
 */

// Arc in a 1000×60 box: a quadratic from (0,56) through (500,-40) to (1000,56).
// x is linear in t because the control point sits at the midpoint.
const arcY = (p: number) => (1 - p) ** 2 * 56 + 2 * (1 - p) * p * -40 + p ** 2 * 56;

// Keyframes across the day: [progress, sun, scrim ground].
const grade: [number, string, string][] = [
  [0, "#f7c97e", "#1b150f"],
  [0.3, "#fff1d2", "#16130f"],
  [0.45, "#f39a5f", "#1a120e"],
  [0.55, "#ee6a3e", "#160f12"],
  [0.7, "#c9a4d6", "#110f18"],
  [1, "#a9bfe3", "#0b0f19"],
];
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a: string, b: string, k: number) =>
  `rgb(${hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * k)).join(" ")})`;
function gradeAt(p: number) {
  let i = 0;
  while (i < grade.length - 2 && p > grade[i + 1][0]) i++;
  const [p0, s0, g0] = grade[i];
  const [p1, s1, g1] = grade[i + 1];
  const k = Math.min(1, Math.max(0, (p - p0) / (p1 - p0)));
  return { sun: mix(s0, s1, k), ground: mix(g0, g1, k) };
}

export function SunRail({ stops, nav }: { stops: Dictionary["stops"]; nav: Dictionary["nav"] }) {
  const rail = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = innerHeight || 1;
      const t = scrollY / vh;
      const p = Math.min(1, Math.max(0, t / total));
      const el = rail.current;
      if (el) {
        el.style.setProperty("--sun-x", p.toFixed(4));
        el.style.setProperty("--sun-y", (arcY(p) / 60).toFixed(4));
      }
      const g = gradeAt(p);
      document.documentElement.style.setProperty("--sun", g.sun);
      document.documentElement.style.setProperty("--scrim", g.ground);
      let k = 0;
      while (k < stopAt.length - 1 && t >= stopAt[k + 1] - 0.15) k++;
      setCurrent(k);
      setProgress(Math.round(p * 100));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, []);

  const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const goTo = (t: number, smooth: boolean) =>
    scrollTo({ top: t * innerHeight, behavior: smooth && !reduced() ? "smooth" : "auto" });

  // Drag anywhere on the arc: x across the rail is the hour.
  const dragging = useRef(false);
  const scrubTo = (clientX: number) => {
    const box = rail.current?.querySelector(".rail__track")?.getBoundingClientRect();
    if (!box) return;
    const p = Math.min(1, Math.max(0, (clientX - box.left) / box.width));
    goTo(p * total, false);
  };

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -1 : 0;
    if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      goTo(e.key === "Home" ? 0 : total, true);
    } else if (step) {
      e.preventDefault();
      goTo(stopAt[Math.min(stopAt.length - 1, Math.max(0, current + step))], true);
    }
  };

  return (
    <nav ref={rail} className="rail" aria-label={nav.day}>
      <div
        className="rail__track"
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          scrubTo(e.clientX);
        }}
        onPointerMove={(e) => dragging.current && scrubTo(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      >
        <svg className="rail__arc" viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 56 Q500 -40 1000 56" />
        </svg>
        <div
          className="rail__sun"
          role="slider"
          tabIndex={0}
          aria-label={nav.dayHint}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-valuetext={`${stops[current].time} · ${stops[current].label}`}
          onKeyDown={onKey}
        />
      </div>
      <ol className="rail__stops">
        {stops.map((stop, i) => (
          <li key={stop.time} style={{ "--at": (stopAt[i] / total).toFixed(4) } as React.CSSProperties}>
            <button
              type="button"
              aria-current={i === current ? "step" : undefined}
              onClick={() => goTo(stopAt[i], true)}
            >
              <span className="rail__time">{stop.time}</span>
              <span className="rail__label">{stop.label}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
