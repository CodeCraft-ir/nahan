/**
 * scripts/generate-pwa-icons.mjs
 * Run: node scripts/generate-pwa-icons.mjs
 * Requires: sharp (already in devDependencies)
 */
import sharp from "sharp";
import { readFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const svgPath = join(__dirname, "../src/app/icon.svg");
const outDir = join(__dirname, "../public/icons");
mkdirSync(outDir, { recursive: true });

const svg = readFileSync(svgPath);

// Background color matching the app's charcoal
const BG = { r: 42, g: 42, b: 42, alpha: 1 };

async function makeIcon(size, filename) {
  const padding = Math.round(size * 0.15);
  const innerSize = size - padding * 2;

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: BG,
    },
  })
    .composite([
      {
        input: await sharp(svg).resize(innerSize, innerSize).toBuffer(),
        top: padding,
        left: padding,
      },
    ])
    .png()
    .toFile(join(outDir, filename));

  console.log(`✓ ${filename} (${size}×${size})`);
}

await makeIcon(192, "icon-192.png");
await makeIcon(512, "icon-512.png");

console.log("\nDone! Place icons in /public/icons/");
