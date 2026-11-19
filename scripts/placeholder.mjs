// Writes a labelled placeholder photo at the exact size a design needs, so pages can import it
// now and the real photo can replace the file later under the same name.
// Usage: pnpm placeholder <output.jpg> <width> <height> "<what the photo shows>" [#background]
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import sharp from "sharp";

const [out, w, h, label = "Photo", bg = "#d9dee3"] = process.argv.slice(2);
const width = Number(w);
const height = Number(h);
if (!out || !width || !height) {
  console.error('Usage: pnpm placeholder <output.jpg> <width> <height> "<label>" [#background]');
  process.exit(1);
}

const escape = (s) =>
  s.replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" })[c]);
const size = Math.round(Math.min(width, height) / 18);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${bg}"/><stop offset="1" stop-color="#ffffff" stop-opacity="0.55"/>
  </linearGradient></defs>
  <rect width="100%" height="100%" fill="${bg}"/><rect width="100%" height="100%" fill="url(#g)"/>
  <text x="50%" y="50%" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="${size}" fill="#334155">${escape(label)}</text>
  <text x="50%" y="${50 + (size * 1.6 * 100) / height}%" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="${Math.round(size * 0.6)}" fill="#64748b">${width} x ${height} placeholder</text>
</svg>`;

mkdirSync(dirname(out), { recursive: true });
await sharp(Buffer.from(svg)).jpeg({ quality: 80 }).toFile(out);
console.log(`wrote ${out} (${width}x${height})`);
