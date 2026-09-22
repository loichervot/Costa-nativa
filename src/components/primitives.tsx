import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";

import { Reveal } from "@/components/Reveal";
import { AIRBNB_URL } from "@/lib/site";

export function Section({
  id,
  children,
  tone = "cream",
  className = "",
}: {
  id?: string;
  children: ReactNode;
  tone?: "cream" | "sand" | "ink";
  className?: string;
}) {
  const tones = {
    cream: "bg-cream text-ink",
    sand: "bg-sand text-ink",
    ink: "bg-ink text-cream",
  };
  return (
    <section
      id={id}
      className={`${tones[tone]} px-6 py-24 sm:px-8 md:py-32 lg:py-40 ${className}`}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function Eyebrow({ children, tone = "dark" }: { children: ReactNode; tone?: "dark" | "light" }) {
  return (
    <p
      className={`font-sans text-xs font-medium tracking-[0.2em] uppercase ${
        tone === "light" ? "text-ochre" : "text-ochre-deep"
      }`}
    >
      {children}
    </p>
  );
}

export function Title({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`font-display mt-5 text-4xl leading-[1.1] font-normal sm:text-5xl lg:text-6xl ${className}`}>
      {children}
    </h2>
  );
}

export function Body({ children, tone = "dark" }: { children: ReactNode; tone?: "dark" | "light" }) {
  return (
    <p
      className={`mt-6 max-w-[62ch] text-lg leading-[1.75] sm:text-xl ${
        tone === "light" ? "text-cream/80" : "text-ink-soft"
      }`}
    >
      {children}
    </p>
  );
}

/**
 * `sizes` defaults to the common case — a photo that is full width on phones
 * and roughly half the 72rem container on desktop. Full-bleed images pass
 * "100vw" explicitly.
 */
export function Photo({
  src,
  alt,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px",
  className = "",
  imgClassName = "",
}: {
  src: StaticImageData;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  imgClassName?: string;
}) {
  // No `position` utility here on purpose. These images are sized by the
  // wrapper rather than `fill`, so they never needed one — and hardcoding
  // `relative` silently beat any `absolute` passed in via className, since
  // conflicting Tailwind utilities resolve by CSS source order, not class
  // order. Callers that need this positioned should wrap it.
  return (
    <div className={`overflow-hidden bg-sand ${className}`}>
      <Image
        src={src}
        alt={alt}
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        className={`h-full w-full object-cover ${imgClassName}`}
      />
    </div>
  );
}

export function BookButton({
  children,
  variant = "solid",
  className = "",
}: {
  children: ReactNode;
  variant?: "solid" | "outline";
  className?: string;
}) {
  const styles = {
    solid: "bg-ochre-deep text-cream hover:bg-ink",
    outline: "border border-current text-cream hover:bg-cream hover:text-ink",
  };
  return (
    <a
      href={AIRBNB_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-medium tracking-[0.08em] uppercase transition-colors duration-300 ${styles[variant]} ${className}`}
    >
      {children}
      <ArrowUpRight />
    </a>
  );
}

function ArrowUpRight() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Star({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={`h-3.5 w-3.5 ${className}`} fill="currentColor">
      <path d="M8 .9l2.2 4.5 4.9.7-3.5 3.5.8 4.9L8 12.2l-4.4 2.3.8-4.9L.9 6.1l4.9-.7z" />
    </svg>
  );
}

export { Reveal };
