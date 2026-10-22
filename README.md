# Costa Nativa

Marketing site for [Costa Nativa](https://www.airbnb.com/h/costanativa), a
two-bedroom house with a private pool in Brasilito, Guanacaste, Costa Rica.

The site has one job: make a visitor want the house, then send them to the
Airbnb listing. It holds no availability, pricing or booking logic — Airbnb is
the single source of truth for all three.

Next.js 16 · React 19 · scroll-craft worldflight · English + Spanish · deploys to Netlify.

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
| `npm run verify` | End-to-end checks: CTAs, alt text, keyboard focus, sun rail, carousel, reduced motion, no fabricated content |
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

The page is one continuous walk through the house over one day, built with
the scroll-craft skill's **worldflight** mode: a single fixed stage holding
every leg of film, a fixed copy layer whose blocks open and close against the
scroll position, and an empty spacer that is the only thing in document flow.
Scroll is the playhead. The brief, the feeling curve and what was generated
are in `scrollcraft/builds/costa-nativa/BRIEF.md`.

```
originals/                 Full-res masters (gitignored — keep your own backup)
public/
  scrollcraft.js           The engine, copied unedited from the skill
  walk/                    Clips (desktop + -m mobile), posters, hero planes
scripts/                   prep-images, verify, shots
scrollcraft/
  FINGERPRINTS.md          Registry of scroll-craft builds (the skill's gate)
  builds/costa-nativa/     BRIEF.md and the build tools; out/ lab/ assets/
                           are working files and gitignored
src/
  app/[lang]/              The page. One locale segment, two static routes.
  app/scrollcraft.css      The engine's stylesheet, unedited
  app/globals.css          Theme tokens and the page's own styles
  components/Walk.tsx      The whole walk, server-rendered
  components/WalkRuntime   Loads and mounts the engine; hero plane motion
  components/SunRail       The map: the sun's path across the day
  dictionaries/            en.json, es.json — ALL copy lives here
  lib/walk.ts              Legs, weights and copy windows
  lib/                     site facts, reviews, dictionary loader
  proxy.ts                 / → /en | /es from Accept-Language
```

**All copy lives in the dictionaries.** `Dictionary` is typed from `en.json`
and the build fails if `es.json` does not match it key for key.

**The footage is the house, unaltered.** Every room is a real photo or a clip
that starts and ends on one; transitions between rooms are dissolves, never
generated hallways. Only the canopy B-roll and the hero's sky plate are
generated from scratch. Clips are encoded for scrubbing (dense keyframes) and
each one is fetched only as the walk approaches it.

**Pacing lives in `src/lib/walk.ts`.** Each leg owns a number of
viewport-heights; clip legs share one pace so the walk never surges, and the
copy windows are computed from the weights. Change a weight and every window
after it moves with it.

**Motion** is the engine plus a little page code: the hero's three planes,
the sun rail, and scrims that follow their copy. Under
`prefers-reduced-motion` no clip is fetched; the posters cross-dissolve
through the same positions and every word still appears.

**Colour** comes from the logo, one of Jacques Hervot's pieces: its warm
off-black, its bone, and its hot coral as the single accent. The sun, the rail
and every scrim regrade from morning to night as you scroll.

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

The domain is at GoDaddy on GoDaddy's nameservers (`ns03/ns04.domaincontrol.com`),
serving a GoDaddy Website Builder page. It carries **no MX, TXT or subdomain
records** — nothing but the parked site — so moving DNS breaks nothing.

**Use Netlify DNS.** GoDaddy cannot do ALIAS/ANAME at the apex, so keeping
GoDaddy's nameservers forces the A-record fallback, and Netlify says plainly
that the apex then misses global CDN routing. Delegating avoids that, and it
also makes the Website Builder page irrelevant — once the nameservers move,
GoDaddy's DNS is out of the path entirely.

1. Netlify → **Domain management → Add a domain** → `costa-nativa.com`.
2. Choose **Set up Netlify DNS**. It prints four nameservers, along the lines
   of `dns1.p0X.nsone.net` … `dns4.p0X.nsone.net`. They are specific to this
   zone — copy the ones shown, do not reuse these.
3. GoDaddy → **My Products → Domains → costa-nativa.com → DNS →
   Nameservers → Change → I'll use my own nameservers**. Replace all four,
   save, and confirm the warning.
4. Back in Netlify, wait for the domain to verify.

Propagation is usually under an hour, occasionally up to 24. Netlify issues
the Let's Encrypt certificate automatically once the nameservers resolve —
if HTTPS is still pending after DNS has moved, use **Domain management →
HTTPS → Verify DNS configuration**.

#### Keeping GoDaddy's nameservers instead

Workable, slightly worse, and needs the Website Builder site switched off
first or it keeps answering on the apex. In GoDaddy's DNS records:

| Type | Name | Value |
|---|---|---|
| A | `@` | `75.2.60.5` |
| CNAME | `www` | `monumental-strudel-365824.netlify.app` |

Delete the existing parked A records for `@` and `www` first. `75.2.60.5` is
Netlify's load balancer; take it from Netlify's own screen if it ever differs.

### After it is live

- Submit `https://costa-nativa.com/sitemap.xml` in Google Search Console.
- Check the OG card with the [sharing debugger](https://developers.facebook.com/tools/debug/).
- Validate the structured data in the [Rich Results Test](https://search.google.com/test/rich-results).
- Confirm `https://costa-nativa.com/` lands on `/en`, and on `/es` in a
  Spanish-language browser.

---

## Measured

The Lighthouse figures from the previous build no longer apply. Re-measure
against the deployed site; expect a heavier page (the clips are 3–8MB each,
loaded one leg ahead) and the LCP element to be the hero headline over the
hero planes.
