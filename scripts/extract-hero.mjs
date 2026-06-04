import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const screenPath = join(
  __dirname,
  "../public/figma/screens/Android Compact - 2.pdf.png",
);
const outPath = join(__dirname, "../public/images/hero-cafe.png");

const meta = await sharp(screenPath).metadata();
const scale = meta.width / 412;

await sharp(screenPath)
  .extract({
    left: 0,
    top: 0,
    width: meta.width,
    height: Math.round(675 * scale),
  })
  .png()
  .toFile(outPath);

console.log({ scale, out: outPath });
