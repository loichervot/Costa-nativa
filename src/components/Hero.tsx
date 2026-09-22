import Image from "next/image";

import { Reveal, Star } from "@/components/primitives";
import type { Dictionary } from "@/lib/dictionaries";
import { photos } from "@/lib/photos";

export function Hero({ dict }: { dict: Dictionary }) {
  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden">
      <Image
        src={photos.exteriorTwilightPool}
        alt={dict.meta.ogAlt}
        priority
        fetchPriority="high"
        sizes="100vw"
        placeholder="blur"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/*
        Two overlays, because one could not do both jobs. The vertical ramp
        keeps the transparent header legible against a bright sky and anchors
        the copy at the foot of the frame; the horizontal one darkens the left
        third, where the headline crosses the lit interior of the house — the
        brightest part of the photograph and the only place white text was
        genuinely hard to read.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/15 to-ink/85"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-ink/55 via-ink/15 to-transparent"
      />

      <div className="relative mx-auto w-full max-w-6xl px-6 pb-20 sm:px-8 sm:pb-24 lg:pb-28">
        <Reveal>
          <p className="text-xs font-medium tracking-[0.22em] text-cream/80 uppercase">
            {dict.hero.eyebrow}
          </p>
        </Reveal>

        <Reveal delay={120}>
          <h1 className="font-display mt-6 max-w-[15ch] text-[2.75rem] leading-[1.05] font-normal text-cream sm:text-6xl lg:text-7xl">
            {dict.hero.title}
          </h1>
        </Reveal>

        <Reveal delay={240}>
          <p className="mt-7 max-w-[46ch] text-lg leading-[1.7] text-cream/85 sm:text-xl">
            {dict.hero.subtitle}
          </p>
        </Reveal>

        <Reveal delay={360}>
          <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-cream/90">
            <span className="flex items-center gap-1.5">
              <Star className="text-ochre" />
              <span className="font-medium">{dict.rating.score}</span>
            </span>
            <span aria-hidden="true" className="text-cream/40">
              ·
            </span>
            <span>{dict.rating.reviews}</span>
            <span aria-hidden="true" className="text-cream/40">
              ·
            </span>
            <span>{dict.rating.superhost}</span>
          </div>
        </Reveal>
      </div>

      <a
        href="#house"
        className="absolute inset-x-0 bottom-6 mx-auto hidden w-fit text-xs tracking-[0.18em] text-cream/70 uppercase transition-opacity duration-200 hover:opacity-100 lg:block"
      >
        {dict.hero.scroll}
      </a>
    </section>
  );
}
