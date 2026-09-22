/**
 * Screenshot helper for reviewing the page during development.
 * Drives the system Chrome via playwright-core — no browser download.
 *
 * Usage: node scripts/shots.mjs [locale] [width] [height]
 */
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";

const [locale = "en", width = "1440", height = "900"] = process.argv.slice(2);
const OUT = "/tmp/shots";

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({
  channel: "chrome",
  args: ["--hide-scrollbars"],
});
const page = await browser.newPage({
  viewport: { width: Number(width), height: Number(height) },
  deviceScaleFactor: 1,
});

await page.goto(`http://localhost:3000/${locale}`, { waitUntil: "networkidle" });

// Scroll the whole page once so every IntersectionObserver fires and every
// lazy image loads, then return to the top before shooting.
await page.evaluate(async () => {
  const step = window.innerHeight * 0.8;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 120));
  }
  window.scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 600));
});

const total = await page.evaluate(() => document.body.scrollHeight);
const vh = Number(height);
const screens = Math.ceil(total / vh);
console.log(`${locale}: ${width}x${height}, page ${total}px → ${screens} screens`);

for (let i = 0; i < screens; i++) {
  await page.evaluate((y) => window.scrollTo(0, y), i * vh);
  await new Promise((r) => setTimeout(r, 450));
  await page.screenshot({ path: `${OUT}/${locale}-${width}-${String(i).padStart(2, "0")}.png` });
}

await browser.close();
console.log(`→ ${OUT}`);
