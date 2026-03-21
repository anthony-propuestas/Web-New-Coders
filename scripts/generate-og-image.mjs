/**
 * Genera public/og-image.png a partir de public/og-image.svg
 * Uso: node scripts/generate-og-image.mjs
 * Requiere: npm install sharp --save-dev
 */
import sharp from 'sharp';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const svgPath = path.join(root, 'public', 'og-image.svg');
const pngPath = path.join(root, 'public', 'og-image.png');

if (!fs.existsSync(svgPath)) {
  console.error('❌  No se encuentra public/og-image.svg');
  process.exit(1);
}

const svgBuffer = fs.readFileSync(svgPath);

await sharp(svgBuffer)
  .resize(1200, 630)
  .png({ compressionLevel: 9 })
  .toFile(pngPath);

const stats = fs.statSync(pngPath);
const kb = (stats.size / 1024).toFixed(1);

console.log(`✅  og-image.png generado — ${kb} KB`);
console.log(`    → ${pngPath}`);
