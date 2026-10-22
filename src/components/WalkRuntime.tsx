"use client";

import Script from "next/script";
import { useEffect } from "react";

import { legs, starts, total } from "@/lib/walk";

type Engine = { mount: (root: ParentNode) => { destroy: () => void } };
declare global {
  interface Window {
    ScrollCraft?: Engine;
  }
}

let instance: { destroy: () => void } | null = null;

/**
 * Loads scrollcraft.js and mounts it on the server-rendered walk, then adds
 * what the engine leaves to the page: the hero's own plane motion, each
 * leg's progress (--leg-p) for page-side camera moves, which ground the
 * chrome sits on, and keyboard focus that lands inside a copy window not
 * currently on screen.
 */
function mountEngine() {
  if (instance || !window.ScrollCraft) return;
  instance = window.ScrollCraft.mount(document);
  // The spacer is sized once at mount; if the window or a webfont had not
  // settled yet it is wrong (worst case 0px and the page cannot scroll). One
  // resize makes the engine measure again.
  const relayout = () => dispatchEvent(new Event("resize"));
  relayout();
  document.fonts?.ready.then(relayout);
}

export function WalkRuntime() {
  useEffect(() => {
    mountEngine();
    const root = document.documentElement;
    const heroW = legs[0].w;
    // Same order as `legs`: Walk renders one segment per leg.
    const segments = Array.from(document.querySelectorAll<HTMLElement>("[data-sc-segment]"));
    let frame = 0;

    const update = () => {
      frame = 0;
      const t = scrollY / (innerHeight || 1);
      root.style.setProperty("--hero-p", Math.min(1, t / heroW).toFixed(4));
      segments.forEach((seg, i) => {
        const p = Math.min(1, Math.max(0, (t - starts[i]) / legs[i].w));
        seg.style.setProperty("--leg-p", p.toFixed(4));
      });
      root.dataset.ground = t < heroW * 0.6 ? "light" : "dark";
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // Copy windows are always in the DOM, so Tab can land on a link whose
    // window is closed. Move the walk to that window instead of focusing
    // something invisible.
    const onFocus = (e: FocusEvent) => {
      const block = (e.target as Element | null)?.closest?.<HTMLElement>("[data-mid]");
      if (!block) return;
      const mid = block.dataset.mid === "end" ? total : Number(block.dataset.mid);
      const y = mid * innerHeight;
      if (Math.abs(scrollY - y) > innerHeight * 0.3) scrollTo({ top: y, behavior: "auto" });
    };

    // Scrims follow the copy they sit under. The engine eases copy opacity on
    // its own loop, so mirror it every frame rather than on scroll.
    const scrims = Array.from(document.querySelectorAll<HTMLElement>("[data-scrim]"));
    let mirror = 0;
    const follow = () => {
      for (const s of scrims) {
        const copy = s.nextElementSibling as HTMLElement | null;
        s.style.opacity = copy ? getComputedStyle(copy).opacity : "0";
      }
      mirror = requestAnimationFrame(follow);
    };
    follow();

    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    document.addEventListener("focusin", onFocus);
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(mirror);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      document.removeEventListener("focusin", onFocus);
      instance?.destroy();
      instance = null;
    };
  }, []);

  return <Script src="/scrollcraft.js" strategy="afterInteractive" onReady={mountEngine} />;
}
