import { NextResponse, type NextRequest } from "next/server";

import { locales } from "@/lib/dictionaries";

const DEFAULT_LOCALE = "en";

/**
 * Picks the best locale from Accept-Language. Deliberately hand-rolled: two
 * locales does not justify pulling in Negotiator and intl-localematcher.
 */
function preferredLocale(header: string | null): string {
  if (!header) return DEFAULT_LOCALE;

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return {
        tag: tag.trim().toLowerCase(),
        q: q ? Number.parseFloat(q.split("=")[1]) || 0 : 1,
      };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    // Match on the primary subtag, so es-CR and es-419 both land on /es.
    const base = tag.split("-")[0];
    if ((locales as readonly string[]).includes(base)) return base;
  }

  return DEFAULT_LOCALE;
}

// Renamed from `middleware` in Next.js 16 — same behaviour, new file convention.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return;

  const locale = preferredLocale(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Everything except Next internals and files with an extension (favicon,
  // robots.txt, og images, the photos themselves).
  matcher: ["/((?!_next|api|.*\\.).*)"],
};
