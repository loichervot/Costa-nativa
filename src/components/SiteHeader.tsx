"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AIRBNB_URL } from "@/lib/site";
import type { Dictionary, Locale } from "@/lib/dictionaries";

/**
 * Transparent over the hero, solid once you have scrolled past it. The booking
 * link is the only thing that is always visible — it is the single conversion
 * path on the site, and it should never be more than a glance away.
 *
 * Takes `dict.nav` rather than the whole dictionary: this is a Client
 * Component, so whatever it receives is serialised into the RSC payload and
 * shipped to the browser. Handed the full dictionary it would send every
 * paragraph, alt text and amenity twice — once as HTML, once as JSON.
 */
export function SiteHeader({
  nav,
  locale,
  other,
}: {
  nav: Dictionary["nav"];
  locale: Locale;
  other: Locale;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#house", label: nav.house },
    { href: "#pool", label: nav.pool },
    { href: "#rooms", label: nav.rooms },
    { href: "#setting", label: nav.setting },
    { href: "#details", label: nav.details },
    { href: "#reviews", label: nav.reviews },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled ? "bg-cream/95 text-ink shadow-[0_1px_0_rgba(28,22,19,0.08)] backdrop-blur" : "text-cream"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 px-6 sm:h-20 sm:px-8">
        <Link
          href={`/${locale}`}
          className="font-display text-lg tracking-[0.02em] whitespace-nowrap sm:text-xl"
        >
          Costa Nativa
        </Link>

        {/*
          Shown from xl, not lg. Six items fit at 1024px in English but not in
          Spanish — "Piscina y terraza" and "El entorno" are far longer than
          their English counterparts, and the row wrapped to two lines. Below
          xl the header falls back to the wordmark, language toggle and book
          button, which is the same treatment mobile already gets.
        */}
        <nav
          aria-label={nav.sections}
          className="hidden items-center gap-6 xl:flex 2xl:gap-8"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm tracking-wide whitespace-nowrap transition-opacity duration-200 hover:opacity-60"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-5">
          <Link
            href={`/${other}`}
            hrefLang={other}
            aria-label={nav.switchTo}
            className="text-xs font-medium tracking-[0.12em] uppercase transition-opacity duration-200 hover:opacity-60"
          >
            {other}
          </Link>
          <a
            href={AIRBNB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`px-4 py-2.5 text-xs font-medium tracking-[0.08em] whitespace-nowrap uppercase transition-colors duration-300 sm:px-6 sm:py-3 ${
              scrolled
                ? "bg-ochre-deep text-cream hover:bg-ink"
                : "border border-cream/70 hover:bg-cream hover:text-ink"
            }`}
          >
            {nav.book}
          </a>
        </div>
      </div>
    </header>
  );
}
