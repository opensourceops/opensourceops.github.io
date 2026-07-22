import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const size = 64;
const channels = 4;
const pixels = Buffer.alloc(size * size * channels);

function paint(x, y, width, height, color) {
  for (let row = y; row < y + height; row += 1) {
    for (let column = x; column < x + width; column += 1) {
      const offset = (row * size + column) * channels;
      pixels[offset] = color[0];
      pixels[offset + 1] = color[1];
      pixels[offset + 2] = color[2];
      pixels[offset + 3] = 255;
    }
  }
}

paint(0, 0, size, size, [15, 118, 110]);
for (let step = 0; step < 17; step += 1) {
  paint(15 + step, 15 + step, 5, 5, [240, 253, 250]);
  paint(15 + step, 44 - step, 5, 5, [240, 253, 250]);
}
paint(35, 42, 16, 5, [153, 246, 228]);

await mkdir(path.join(root, 'public'), { recursive: true });
await sharp(pixels, { raw: { width: size, height: size, channels } })
  .png({ compressionLevel: 9 })
  .toFile(path.join(root, 'public/favicon.png'));

console.log('Generated public/favicon.png.');
