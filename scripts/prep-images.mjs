/**
 * Normalises the original photography into build-ready assets.
 *
 * The originals run 3-9MB straight off the camera and drone, with EXIF intact.
 * next/image can resize them at request time, but the source files still get
 * read on every build and committed to git at full size, so we bring them down
 * to a sane ceiling once, here, and commit the result.
 *
 * Run: npm run prep-images
 */
import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ORIGINALS = "originals";
const OUT = "src/photos";
const MAX_WIDTH = 2560;
const QUALITY = 82;

/**
 * Original filenames are camera roll noise (IMG_3982, UUIDs). Map them once to
 * names that say what the photo is, so the components read as English.
 */
const RENAMES = {
  "IMG_3982.JPG": "exterior-twilight-pool",
  "IMG_3983.JPG": "exterior-twilight-front",
  "IMG_9073_HDR.JPEG": "terrace-night",
  "IMG_9361_HDR.JPEG": "kitchen-living-wide",
  "IMG_3981.JPG": "terrace-lounge",
  "IMG_3989.JPG": "living-to-entry",
  "IMG_3990.JPG": "kitchen",
  "IMG_3993.JPG": "terrace-wide",
  "_MG_8884.JPEG": "bathroom",
  "dji_fly_20231130_090628_228_1701357287963_pano_optimized.jpg": "coast-aerial",
  "14d0feb1-a783-4cfa-9daf-78f5f14ff39f.JPG": "living-to-terrace",
  "66fdc240-fb05-4cda-a717-fb7861a999d4.JPG": "facade",
  "709ea200-6213-4b8b-90e5-02cc64e91ded.JPG": "bedroom-two",
  "a72ed754-c87f-4311-8926-14f090d57244.JPG": "pool-day",
  "c3ffe716-b6a1-4a6f-b06b-8ffd7621f1b1.JPG": "living-pool-view",
  "eb937646-067c-4420-ac0a-a40b304363c9.JPG": "bedroom-king",
  "64a4f8b9-a56e-4488-9bf0-13c6a85fb0f0.jpg": "logo",
};

await mkdir(OUT, { recursive: true });

const files = await readdir(ORIGINALS);
const unmapped = files.filter((f) => !RENAMES[f] && !f.startsWith("."));
if (unmapped.length) {
  console.warn(`! No mapping for: ${unmapped.join(", ")} — skipped.`);
}

let totalIn = 0;
let totalOut = 0;

for (const [source, name] of Object.entries(RENAMES)) {
  const from = path.join(ORIGINALS, source);
  const to = path.join(OUT, `${name}.jpg`);

  const input = sharp(from);
  const { width, height } = await input.metadata();

  // rotate() with no argument applies the EXIF orientation, then we drop the
  // metadata entirely — otherwise portrait shots come out sideways once the
  // EXIF tag is stripped.
  const info = await input
    .rotate()
    .resize({ width: Math.min(width, MAX_WIDTH), withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(to);

  const before = (await stat(from)).size;
  totalIn += before;
  totalOut += info.size;

  console.log(
    `${name.padEnd(24)} ${width}x${height} → ${info.width}x${info.height}  ` +
      `${(before / 1e6).toFixed(1)}MB → ${(info.size / 1e6).toFixed(2)}MB`,
  );
}

console.log(
  `\n${Object.keys(RENAMES).length} photos  ` +
    `${(totalIn / 1e6).toFixed(1)}MB → ${(totalOut / 1e6).toFixed(1)}MB ` +
    `(${Math.round((1 - totalOut / totalIn) * 100)}% smaller)`,
);

// ── Derived assets ──────────────────────────────────────────────────────────

await mkdir("public", { recursive: true });

// Social card. A flat file beats generating this at runtime with ImageResponse,
// which cannot embed a local JPEG without a round trip.
await sharp(path.join(ORIGINALS, "IMG_3982.JPG"))
  .resize(1200, 630, { fit: "cover", position: "attention" })
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile("public/og.jpg");
console.log("\nog.jpg                   1200x630");

/*
 * Favicons, cropped from the artwork panel of the logo — the lockup includes
 * "COSTA NATIVA / BRASILITO - GUANACASTE" underneath, which is illegible at
 * 32px. These offsets isolate the painting above the type.
 */
const ART = { left: 62, top: 56, width: 1150, height: 1140 };

/*
 * Kept deliberately small and palette-quantised. A full-colour 512px PNG of
 * this painting weighs ~500KB, and because the browser fetches the icon during
 * initial page load it competes with the hero image for bandwidth — on a
 * throttled mobile connection that one file cost several seconds of LCP.
 * 96px is past the largest size any browser tab actually renders.
 */
for (const [file, size] of [
  ["src/app/icon.png", 96],
  ["src/app/apple-icon.png", 180],
]) {
  const info = await sharp(path.join(ORIGINALS, "64a4f8b9-a56e-4488-9bf0-13c6a85fb0f0.jpg"))
    .extract(ART)
    .resize(size, size)
    .png({ palette: true, quality: 90, effort: 10 })
    .toFile(file);
  console.log(`${path.basename(file).padEnd(24)} ${size}x${size}  ${(info.size / 1024).toFixed(1)}KB`);
}
