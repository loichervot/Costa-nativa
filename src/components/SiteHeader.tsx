import Link from "next/link";

import type { Dictionary, Locale } from "@/lib/dictionaries";
import { AIRBNB_URL } from "@/lib/site";

/**
 * Wordmark, the blog, language and the one action. The section links the old
 * page carried now live in the sun rail, which is the map of the walk. The
 * booking link is the only thing always on screen: it is the single
 * conversion path, and it should never be more than a glance away.
 *
 * The blog is English only, so it links to /en/blog from both languages and
 * hides the language switch on its own pages (`other` omitted).
 */
export function SiteHeader({
  nav,
  locale,
  other,
  onBlog = false,
}: {
  nav: Dictionary["nav"];
  locale: Locale;
  other?: Locale;
  onBlog?: boolean;
}) {
  return (
    <header className="bar">
      <Link href={`/${locale}`} className="bar__mark">
        Costa Nativa
      </Link>
      <div className="bar__end">
        <Link href="/en/blog" hrefLang="en" className="bar__link" aria-current={onBlog ? "page" : undefined}>
          {nav.blog}
        </Link>
        {other && (
          <Link href={`/${other}`} hrefLang={other} aria-label={nav.switchTo} className="bar__lang">
            {other}
          </Link>
        )}
        <a href={AIRBNB_URL} target="_blank" rel="noopener noreferrer" className="bar__book">
          {nav.book}
        </a>
      </div>
    </header>
  );
}
