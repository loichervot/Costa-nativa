import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";

import { AIRBNB_URL } from "@/lib/site";

/** A photo inside a post, with a caption that says what it actually shows. */
export function Figure({ src, alt, caption }: { src: StaticImageData; alt: string; caption: ReactNode }) {
  return (
    <figure className="post__figure">
      <Image src={src} alt={alt} placeholder="blur" sizes="(max-width: 860px) 100vw, 46rem" />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

/** The short version, for readers who came for one answer. */
export function Callout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="post__callout">
      <p className="post__callout-title">{title}</p>
      {children}
    </aside>
  );
}

/** The house, said once, at the end. */
export function StayCard({ title, body }: { title: string; body: string }) {
  return (
    <aside className="post__stay">
      <p className="post__stay-title">{title}</p>
      <p>{body}</p>
      <a className="w-cta" href={AIRBNB_URL} target="_blank" rel="noopener noreferrer">
        Book on Airbnb
      </a>
    </aside>
  );
}
