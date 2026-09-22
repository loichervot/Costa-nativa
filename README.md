# Costa Nativa

Marketing site for [Costa Nativa](https://www.airbnb.com/h/costanativa), a
two-bedroom house with a private pool in Brasilito, Guanacaste, Costa Rica.

The site has one job: make a visitor want the house, then send them to the
Airbnb listing. It holds no availability, pricing or booking logic — Airbnb is
the single source of truth for all three.

Next.js 16 · React 19 · Tailwind v4 · English + Spanish · deploys to Netlify.

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
| `npm run verify` | End-to-end checks — CTAs, alt text, carousel, reduced motion, no fabricated content |
| `npm run shots` | Screenshot every viewport-height of the page for review |

`verify` and `shots` need a server already running on :3000.

---

## One thing to keep an eye on

`src/lib/site.ts` carries `4.96 ★ / 83 reviews`. Airbnb publishes two different
numbers — *129 reviews / 4.95* is Paula's **host** figure across all her
listings, *83 / 4.96* belongs to **this listing**. The site shows the listing
figure. Both drift as reviews come in; re-check before any significant push.

The same numbers appear as display strings in `src/dictionaries/{en,es}.json`
under `rating` and `reviews.stats` — update both places.

### Adding more guest reviews

`src/lib/reviews.ts` holds four real quotes, shown in a carousel. To add more,
copy them from the listing **verbatim** — never reword, never invent. Airbnb
labels some reviewers with a date and others with how long they have been on
the platform; carry across whichever it shows, and leave the other field off
rather than guessing:

```ts
{ quote: "…", name: "Shay", date: "July 2026" },
{ quote: "…", name: "Michelle", tenure: "9 years on Airbnb" },
```

Quotes are **not translated**. They appear in English on the Spanish page too,
under a line explaining why — rewriting someone's testimonial into another
language while still signing their name to it misrepresents what they said.

The carousel and the `aggregateRating` in the structured data are both gated on
this array being non-empty, because Google treats rating markup with no visible
reviews on the page as a structured-data violation.

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
  components/        Hero, SiteHeader, ReviewCarousel, Reveal, primitives
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

## Deploying to Netlify

The domain is registered with GoDaddy and currently serves a GoDaddy Website
Builder page.

`netlify.toml` already carries the build command, publish directory and Node
version, so there is nothing to configure in the UI. Netlify installs the
Next.js runtime (`@netlify/plugin-nextjs`) itself on every build — do not add
it to `package.json` or pin it.

### Continuous deployment (recommended)

Every push then rebuilds the site, and pull requests get their own preview URL.

1. Create an empty repo on GitHub and push:
   ```bash
   git remote add origin git@github.com:<you>/costa-nativa.git
   git push -u origin main
   ```
2. In Netlify: **Add new project → Import an existing project**, pick the repo.
3. Accept the detected settings (they come from `netlify.toml`) and deploy.

### Or straight from this machine, no Git host

```bash
npm i -g netlify-cli
netlify login
netlify init      # creates and links the project
netlify deploy --prod
```

⚠ If you later connect Git CD, stop using `netlify deploy --prod` — the next
push to the production branch silently replaces a hand-shipped deploy.

### Pointing costa-nativa.com at it

1. In Netlify: **Domain management → Add a domain**, enter `costa-nativa.com`.
2. **In GoDaddy, turn off the Website Builder site first.** It answers on the
   apex and will keep winning until it is disabled.
3. Follow the DNS records Netlify shows on that screen. Taking them from
   Netlify rather than from here matters — they differ depending on whether
   you delegate the whole domain to Netlify DNS or keep GoDaddy's nameservers
   and add records by hand.

DNS usually settles within an hour. Netlify issues the TLS certificate itself.

### After it is live

- Submit `https://costa-nativa.com/sitemap.xml` in Google Search Console.
- Check the OG card with the [sharing debugger](https://developers.facebook.com/tools/debug/).
- Validate the structured data in the [Rich Results Test](https://search.google.com/test/rich-results).
- Confirm `https://costa-nativa.com/` lands on `/en`, and on `/es` in a
  Spanish-language browser.

---

## Measured

Lighthouse against the deployed site, not a local build:

| | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| Desktop | 97 | 100 | 100 | 100 |
| Mobile | 89 | 100 | 100 | 100 |

CLS is ~0 on both. Mobile LCP is 3.7s under Lighthouse's simulated 1.6 Mbps
connection; the LCP element is the hero headline waiting on Fraunces, and both
fonts and the hero image are already preloaded. Closing that last gap means
dropping a typeface — a design decision, not a bug. On real connections it is
far quicker.

Images come through the Netlify Image CDN as WebP. That is Netlify's default
negotiation and it is the right one here: its encoder produces a smaller WebP
than AVIF for these photos, the reverse of what Next's own optimizer does
locally.
