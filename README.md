# Costa Nativa

Marketing site for [Costa Nativa](https://www.airbnb.com/h/costanativa), a
two-bedroom house with a private pool in Brasilito, Guanacaste, Costa Rica.

The site has one job: make a visitor want the house, then send them to the
Airbnb listing. It holds no availability, pricing or booking logic — Airbnb is
the single source of truth for all three.

Next.js 16 · React 19 · Tailwind v4 · English + Spanish · deploys to Vercel.

---

## Running it

```bash
npm install
npm run dev          # http://localhost:3000 → redirects to /en or /es
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build (must pass clean before deploying) |
| `npm start` | Serve the production build locally |
| `npm run prep-images` | Re-derive web photos, OG card and favicons from `originals/` |
| `npm run verify` | End-to-end checks — CTAs, alt text, reduced motion, no fabricated content |
| `npm run shots` | Screenshot every viewport-height of the page for review |

`verify` and `shots` need a server already running on :3000.

---

## Two things to finish

### 1. Real guest reviews

`src/lib/reviews.ts` exports an **intentionally empty array**. Airbnb renders
review text in JavaScript, so it could not be read when this site was built.

Open the listing, pick three to five reviews, and paste them in verbatim:

```ts
export const reviews: Review[] = [
  { quote: "…", name: "Sarah", date: "March 2025" },
];
```

The reviews section and the `aggregateRating` in the structured data both
switch on automatically once the array has entries. They are deliberately tied
together: Google treats rating markup with no visible reviews on the page as a
structured-data violation.

**Do not invent entries.** Fabricated testimonials are dishonest and, as
marketing claims, a legal exposure.

### 2. Confirm the rating

`src/lib/site.ts` carries `4.96 ★ / 83 reviews`. Airbnb publishes two different
numbers — *129 reviews / 4.95* is Paula's **host** figure across all her
listings, *83 / 4.96* belongs to **this listing**. The site shows the listing
figure. Both drift as reviews come in; re-check before any significant push.

The same numbers appear as display strings in `src/dictionaries/{en,es}.json`
under `rating` and `reviews.stats` — update both places.

---

## How it is put together

```
originals/           Full-res masters (gitignored — keep your own backup)
scripts/
  prep-images.mjs    sharp: originals → src/photos/, og.jpg, favicons
  verify.mjs         End-to-end correctness checks
  shots.mjs          Screenshot helper
src/
  photos/            Committed web-ready photos; statically imported
  dictionaries/      en.json, es.json — ALL copy lives here
  lib/               site facts, reviews, photo map, dictionary loader
  components/        Hero, SiteHeader, Reveal, primitives
  app/[lang]/        The page. One locale segment, two static routes.
  proxy.ts           / → /en | /es from Accept-Language
```

**All copy lives in the dictionaries.** No text is hardcoded in components, so
changing wording never means touching layout — and English and Spanish cannot
drift apart, because `Dictionary` is typed from `en.json` and the build fails
if `es.json` does not match it key for key.

**Photos** are statically imported, which gets `next/image` intrinsic sizes and
an automatic blur placeholder. `prep-images` caps originals at 2560px and
strips EXIF — 27.3MB → 4.0MB.

**Motion** is one IntersectionObserver plus a CSS transition (`Reveal` +
`[data-reveal]` in `globals.css`), not an animation library. Everything is
gated behind `prefers-reduced-motion`.

**Colour** comes from the existing logo, sampled in the `@theme` block in
`globals.css`. The logo's hot magenta and orange are deliberately unused — the
photographs supply the saturation, the interface stays warm-neutral.

---

## Deploying to costa-nativa.com

The domain is registered with GoDaddy and currently serves a GoDaddy Website
Builder page.

1. Push the repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new). No configuration
   needed — the framework, build command and output are all detected.
3. Add `costa-nativa.com` and `www.costa-nativa.com` under **Settings →
   Domains**.
4. **In GoDaddy, turn off the Website Builder site first.** It answers on the
   apex and will keep winning until it is disabled.
5. Point DNS at the records Vercel shows you on that screen — typically
   `A @ → 76.76.21.21` and `CNAME www → cname.vercel-dns.com`. Take them from
   Vercel rather than from here; they change.

DNS usually settles within an hour. Vercel issues the TLS certificate itself.

### After it is live

- Submit `https://costa-nativa.com/sitemap.xml` in Google Search Console.
- Check the OG card with the [sharing debugger](https://developers.facebook.com/tools/debug/).
- Validate the structured data in the [Rich Results Test](https://search.google.com/test/rich-results).

---

## Measured on the production build

| | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| Desktop | 99 | 100 | 100 | 100 |
| Mobile | 91 | 100 | 100 | 100 |

CLS is 0 on both. Mobile LCP is 3.4s under Lighthouse's simulated 1.6 Mbps
connection, and the LCP element is the hero headline waiting on Fraunces.
Both fonts and the hero image are already preloaded, so closing that last gap
means dropping a typeface — a design decision, not a bug. On real connections
it is far quicker.
