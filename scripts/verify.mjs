/**
 * End-to-end checks that are easy to assume and easy to get wrong:
 * every CTA really points at the Airbnb listing, reduced motion really
 * fetches no film, keyboard focus really brings its copy on screen, the sun
 * rail really moves the walk, and nothing fabricated made it into the markup.
 *
 * Usage: node scripts/verify.mjs   (with the server running on :3000)
 */
import { readFile } from "node:fs/promises";
import { chromium } from "playwright-core";

const AIRBNB = "https://www.airbnb.com/h/costanativa";
let failures = 0;

const check = (name, ok, detail = "") => {
  console.log(`${ok ? "  ok  " : "FAIL  "}${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
};

const browser = await chromium.launch({ channel: "chrome" });

for (const locale of ["en", "es"]) {
  console.log(`\n── /${locale} ──`);
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`http://localhost:3000/${locale}`, { waitUntil: "networkidle" });

  // Control labels are localised, so read them from the same dictionary the
  // page was built from rather than hardcoding English.
  const { reviews: copy } = JSON.parse(
    await readFile(new URL(`../src/dictionaries/${locale}.json`, import.meta.url), "utf8"),
  );
  const dictPrev = copy.prev;
  const dictNext = copy.next;

  // Keyboard: on a freshly loaded page the skip link is the first stop and
  // becomes visible. This runs before anything else clicks, because any
  // interaction moves focus and the next Tab would continue from there.
  await page.keyboard.press("Tab");
  const firstFocus = await page.evaluate(() => {
    const el = document.activeElement;
    const r = el.getBoundingClientRect();
    return { text: el.textContent.trim(), visible: r.width > 0 && r.height > 0 };
  });
  check("skip link is first tab stop and visible", firstFocus.visible, firstFocus.text);

  // Every outbound booking link goes to the listing, in a new tab, safely.
  const outbound = await page.$$eval('a[href^="http"]', (as) =>
    as.map((a) => ({ href: a.href, target: a.target, rel: a.rel, text: a.textContent.trim() })),
  );
  check("has booking links", outbound.length >= 3, `${outbound.length} found`);
  check(
    "all external links → Airbnb listing",
    outbound.every((a) => a.href === AIRBNB),
    outbound
      .filter((a) => a.href !== AIRBNB)
      .map((a) => a.href)
      .join(", ") || "all match",
  );
  check(
    "all external links safe + new tab",
    outbound.every((a) => a.target === "_blank" && a.rel.includes("noopener")),
  );

  // Alt text on every image. The hero sky is the one decorative image: it
  // is a generated plate, and the real house over it carries the description.
  const imgs = await page.$$eval("img", (els) =>
    els.map((i) => ({ alt: i.alt, src: i.getAttribute("src") })),
  );
  check(
    "every image has descriptive alt",
    imgs.every((i) => (i.alt && i.alt.length > 12) || (i.alt === "" && i.src.includes("hero-sky"))),
    `${imgs.length} images`,
  );

  // Keyboard: focusing a link inside a closed copy window brings that window
  // on screen instead of focusing something invisible.
  await page.focus("#book a");
  await page.waitForTimeout(500);
  const bookOpacity = await page.$eval("#book", (el) => Number(getComputedStyle(el).opacity));
  check("focus in a closed window scrolls it into view", bookOpacity > 0.9, `opacity ${bookOpacity}`);

  // The sun rail: a stop jumps the walk to its hour.
  const stops = await page.$$(".rail__stops button");
  await stops[7].click();
  await page.waitForTimeout(1500);
  const railState = await page.evaluate(() => ({
    y: scrollY / innerHeight,
    current: [...document.querySelectorAll(".rail__stops button")].findIndex((b) => b.getAttribute("aria-current") === "step"),
  }));
  check("rail stop moves the walk", railState.current === 7 && railState.y > 8, `at ${railState.y.toFixed(2)}vh, stop ${railState.current}`);

  // A single h1, and headings present.
  const h1s = await page.$$eval("h1", (e) => e.length);
  check("exactly one h1", h1s === 1, `${h1s}`);

  // Nothing fabricated: no invented price, no placeholder review text.
  // innerText, not textContent — the latter also returns the contents of
  // <script> tags, and the RSC payload is full of things like `$1` and
  // `placeholder:"blur"` that look exactly like what we are scanning for.
  const body = await page.evaluate(() => document.body.innerText);
  const priceLike = body.match(/\$\s?\d|USD\s?\d|\d+\s?(?:\/night|por noche|per night)/i);
  check("no invented price on page", !priceLike, priceLike?.[0] ?? "none");
  // TODO/FIXME stay case-sensitive: lowercased, "todo" is ordinary Spanish
  // and matches "Todos los derechos reservados" in the footer.
  const placeholderish =
    body.match(/lorem ipsum|placeholder/i)?.[0] ?? body.match(/TODO|FIXME|XXX/)?.[0];
  check("no lorem/placeholder text", !placeholderish, placeholderish ?? "none");

  // Review carousel: the controls must actually move it, and the dots must
  // agree with where it ended up.
  const carousel = await page.$('[aria-roledescription="carousel"]');
  if (carousel) {
    // The carousel lives in a copy window; walk to it so it can take clicks.
    await page.evaluate(() => {
      const mid = Number(document.querySelector(".w-reviews").dataset.mid);
      scrollTo(0, mid * innerHeight);
    });
    await page.waitForTimeout(900);
    const slides = await page.$$('[aria-roledescription="slide"]');
    const scroller = await page.$('[aria-roledescription="carousel"] ul');
    const left = () => scroller.evaluate((el) => el.scrollLeft);
    const activeDot = () =>
      page.$$eval('[aria-roledescription="carousel"] ol button', (bs) =>
        bs.findIndex((b) => b.getAttribute("aria-current") === "true"),
      );

    check("carousel renders every review", slides.length === 4, `${slides.length} slides`);
    check("starts on first slide", (await left()) === 0 && (await activeDot()) === 0);

    const prev = await page.$(`[aria-roledescription="carousel"] button[aria-label="${dictPrev}"]`);
    const next = await page.$(`[aria-roledescription="carousel"] button[aria-label="${dictNext}"]`);
    check("previous is disabled at the start", await prev.isDisabled());

    await next.click();
    await page.waitForTimeout(700);
    check("next advances the carousel", (await left()) > 0, `scrollLeft ${await left()}`);
    check("dot follows the slide", (await activeDot()) === 1, `dot ${await activeDot()}`);

    // Jump to the last slide via its dot and confirm the end state.
    await page.$$eval('[aria-roledescription="carousel"] ol button', (bs) => bs.at(-1).click());
    await page.waitForTimeout(700);
    check("dots jump to the chosen slide", (await activeDot()) === 3, `dot ${await activeDot()}`);
    check("next is disabled at the end", await next.isDisabled());

    // Back to the start so the screenshot pass is deterministic.
    await page.$$eval('[aria-roledescription="carousel"] ol button', (bs) => bs[0].click());
    await page.waitForTimeout(600);
  } else {
    check("review carousel present", false, "not found");
  }

  await page.close();
}

// The blog: reachable from the header, newest first, one h1 per page, real
// alt text, article markup, and English only.
console.log("\n── blog ──");
const bp = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await bp.goto("http://localhost:3000/es", { waitUntil: "networkidle" });
const blogHref = await bp.$eval(".bar__link", (a) => a.getAttribute("href"));
check("header links to the blog from Spanish too", blogHref === "/en/blog", blogHref);
await bp.goto("http://localhost:3000/en/blog", { waitUntil: "networkidle" });
const list = await bp.$$eval(".card", (cards) =>
  cards.map((c) => ({ date: c.querySelector("time").dateTime, href: c.querySelector(".card__title a").getAttribute("href") })),
);
check("blog lists posts", list.length >= 2, `${list.length} posts`);
check("newest first", list.every((p, i) => i === 0 || p.date <= list[i - 1].date), list.map((p) => p.date).join(", "));
for (const { href } of list) {
  await bp.goto(`http://localhost:3000${href}`, { waitUntil: "networkidle" });
  const post = await bp.evaluate(() => ({
    h1: document.querySelectorAll("h1").length,
    alts: [...document.querySelectorAll("main img")].every((i) => i.alt.length > 12),
    schema: [...document.querySelectorAll('script[type="application/ld+json"]')].some((s) => s.textContent.includes('"BlogPosting"')),
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
  }));
  check(`${href}: one h1, alt text, BlogPosting, canonical`, post.h1 === 1 && post.alts && post.schema && post.canonical?.endsWith(href), JSON.stringify(post));
}
const es = await bp.goto("http://localhost:3000/es/blog");
check("no Spanish blog route", es.status() === 404, `status ${es.status()}`);
await bp.close();

// Reduced motion: no film is fetched, the posters carry the walk, and the
// copy still opens at its place in the track.
console.log("\n── prefers-reduced-motion: reduce ──");
const rm = await browser.newPage({
  viewport: { width: 1280, height: 900 },
  reducedMotion: "reduce",
});
await rm.goto("http://localhost:3000/en", { waitUntil: "networkidle" });
const rmState = await rm.evaluate(async () => {
  const pool = document.querySelector(".w-copy--trail"); // "Open, and then more open."
  scrollTo(0, Number(pool.dataset.mid) * innerHeight);
  await new Promise((r) => setTimeout(r, 900));
  return {
    fetched: [...document.querySelectorAll("video")].filter((v) => v.currentSrc).length,
    copy: Number(getComputedStyle(pool).opacity),
  };
});
check("no clip fetched under reduced motion", rmState.fetched === 0, `${rmState.fetched} fetched`);
check("copy still opens under reduced motion", rmState.copy > 0.9, `opacity ${rmState.copy}`);
const behavior = await rm.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
check("smooth scrolling disabled", behavior === "auto", behavior);
await rm.close();

await browser.close();
console.log(failures ? `\n${failures} check(s) failed.` : "\nAll checks passed.");
process.exit(failures ? 1 : 0);
