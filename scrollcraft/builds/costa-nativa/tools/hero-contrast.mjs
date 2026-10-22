// Grades the hero line by line, with the harness's own method (hide the copy,
// screenshot, sample the darkest patch under each line for dark ink). The
// harness grades whole copy blocks, and the hero block spans the frame, so its
// number is the house's window glass, not anything under the text.
//
//   node tools/hero-contrast.mjs http://localhost:3000/en
import { createRequire } from "node:module";
import path from "node:path";

const { chromium } = createRequire(path.join(process.cwd(), "package.json"))("playwright-core");
const url = process.argv[2] ?? "http://localhost:3000/en";
const browser = await chromium.launch({ channel: "chrome" });
let worstAll = Infinity;

for (const [w, h] of [[1440, 900], [390, 844], [360, 640]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: "networkidle" });
  for (const at of [0, 0.25, 0.45]) {
    await page.evaluate((y) => scrollTo(0, y * innerHeight), at);
    await page.waitForTimeout(900);
    const lines = await page.$$eval(".w-hero :is(p, h1)", (els) =>
      els.map((el) => {
        const r = el.getBoundingClientRect();
        const fg = getComputedStyle(el).color.match(/[\d.]+/g).map(Number);
        const op = parseFloat(getComputedStyle(el.closest("[data-sc-copy]")).opacity);
        return { t: el.textContent.trim().slice(0, 28), r: [r.left, r.top, r.width, r.height], fg, op };
      }),
    );
    const css = await page.addStyleTag({ content: ".w-hero, .w-hero * { visibility: hidden !important }" });
    const shot = await page.screenshot();
    await css.evaluate((n) => n.remove());
    const res = await page.evaluate(async ({ b64, lines }) => {
      const img = new Image();
      img.src = "data:image/png;base64," + b64;
      await img.decode();
      const c = document.createElement("canvas");
      const g = c.getContext("2d", { willReadFrequently: true });
      const lum = (r, gr, b) => {
        const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
        return 0.2126 * f(r) + 0.7152 * f(gr) + 0.0722 * f(b);
      };
      const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      return lines.map(({ t, r, fg, op }) => {
        c.width = 32; c.height = 16;
        g.drawImage(img, r[0], r[1], r[2], r[3], 0, 0, 32, 16);
        const d = g.getImageData(0, 0, 32, 16).data;
        let min = 1;
        for (let k = 0; k < d.length; k += 4) min = Math.min(min, lum(d[k], d[k + 1], d[k + 2]));
        return { t, op, worst: +ratio(lum(...fg), min).toFixed(2) };
      });
    }, { b64: shot.toString("base64"), lines });
    for (const l of res) {
      if (l.op < 0.85) continue;
      worstAll = Math.min(worstAll, l.worst);
      console.log(`${w}x${h} @${at}  ${String(l.worst).padEnd(6)} ${l.t}`);
    }
  }
  await page.close();
}
await browser.close();
console.log(`\nworst hero line: ${worstAll}:1`);
