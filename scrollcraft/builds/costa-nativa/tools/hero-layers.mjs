// Cut the hero into planes from the real facade photo, keyed by colour. No
// pixel of the house is generated: the house plane is the photo with only its
// sky removed; the far plane is the generated clean plate's sky.
//
//   node tools/hero-layers.mjs <facade.jpg> <plate.png> <outdir> [width]
//
// A near plane cut from the cactus garden was tried and dropped: thin spines
// need a real matte, and a soft key read as translucent ghosts once it moved.
import sharp from "sharp";

const [facadePath, platePath, outDir, width = "2048"] = process.argv.slice(2);
const W = Number(width);
const meta = await sharp(facadePath).metadata();
const H = Math.round((W * meta.height) / meta.width);
const img = await sharp(facadePath).resize(W, H, { kernel: "lanczos3" }).removeAlpha().raw().toBuffer();

const isBlue = (r, g, b) => b > 140 && b > r + 25 && b >= g - 5;

// Sky: flood from the top edge through blue sky, and through white cloud only
// above the roofline so the white fascia can never be reached.
const roofline = Math.round(H * 0.4);
const isSky = (i) => {
  const r = img[i * 3], g = img[i * 3 + 1], b = img[i * 3 + 2];
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  const cloud = mx > 185 && (mx - mn) / mx < 0.2 && ((i / W) | 0) < roofline;
  return isBlue(r, g, b) || cloud;
};
const sky = new Uint8Array(W * H);
const stack = [];
for (let x = 0; x < W; x++) if (isSky(x)) { sky[x] = 255; stack.push(x); }
while (stack.length) {
  const p = stack.pop();
  const x = p % W, y = (p / W) | 0;
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const nx = x + dx, ny = y + dy;
    if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
    const n = ny * W + nx;
    if (!sky[n] && isSky(n)) { sky[n] = 255; stack.push(n); }
  }
}
// Pockets enclosed by canopy never connect to the top edge; any blue above the
// eaves is sky regardless.
for (let i = 0; i < W * Math.round(H * 0.52); i++) {
  if (isBlue(img[i * 3], img[i * 3 + 1], img[i * 3 + 2])) sky[i] = 255;
}

// Close pinholes, then feather a pixel so leaf edges do not alias.
const skyMask = await sharp(Buffer.from(sky), { raw: { width: W, height: H, channels: 1 } })
  .blur(1.2).threshold(128).blur(0.7).extractChannel(0).raw().toBuffer();

const house = Buffer.alloc(W * H * 4);
for (let i = 0; i < W * H; i++) {
  house[i * 4] = img[i * 3];
  house[i * 4 + 1] = img[i * 3 + 1];
  house[i * 4 + 2] = img[i * 3 + 2];
  house[i * 4 + 3] = 255 - skyMask[i];
}

const rgba = { raw: { width: W, height: H, channels: 4 } };
await sharp(house, rgba).webp({ quality: 84, alphaQuality: 90 }).toFile(`${outDir}/hero-house.webp`);
await sharp(platePath).resize(W).webp({ quality: 80 }).toFile(`${outDir}/hero-sky.webp`);
console.log(`hero planes ${W}x${H} → ${outDir}`);
