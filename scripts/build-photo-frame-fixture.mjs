// Regenerates the raw pixel fixture used by scripts/photo-frame.test.mjs.
//
// The fixture is the photo slot region of public/images/template.png, stored as
// one luminance byte per pixel so the test can run the real mask algorithm
// without a browser or an image decoder.
//
// Usage: node scripts/build-photo-frame-fixture.mjs
import { readFile, writeFile } from 'node:fs/promises';
import { inflateSync } from 'node:zlib';

const ARTWORK = 'public/images/template.png';
const OUTPUT = 'scripts/fixtures/photo-frame-slot.luma';

// Must match PHOTO_SLOT in src/lib/photo-frame.ts.
const SLOT = { x: 418, y: 680, width: 1124, height: 954 };

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

/**
 * Decodes an 8-bit, non-interlaced PNG into an RGBA buffer.
 *
 * The artwork is a flat-colour export, so a small decoder is enough and it
 * keeps the fixture build dependency free.
 */
function decodePng(buffer) {
  if (!buffer.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new Error(`${ARTWORK} is not a PNG`);
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  let interlace = 0;
  const idat = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    const data = buffer.subarray(offset + 8, offset + 8 + length);

    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      interlace = data[12];
    } else if (type === 'IDAT') {
      idat.push(data);
    } else if (type === 'IEND') {
      break;
    }

    offset += length + 12;
  }

  if (bitDepth !== 8 || interlace !== 0) {
    throw new Error('Expected an 8-bit, non-interlaced PNG');
  }

  const channels = colorType === 6 ? 4 : colorType === 2 ? 3 : 0;
  if (channels === 0) {
    throw new Error(`Unsupported PNG colour type ${colorType}`);
  }

  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const pixels = Buffer.alloc(width * height * 4);
  let previous = Buffer.alloc(stride);
  let position = 0;

  for (let y = 0; y < height; y += 1) {
    const filter = raw[position];
    position += 1;
    const line = Buffer.from(raw.subarray(position, position + stride));
    position += stride;

    for (let index = 0; index < stride; index += 1) {
      const left = index >= channels ? line[index - channels] : 0;
      const up = previous[index];
      const upLeft = index >= channels ? previous[index - channels] : 0;
      let value = line[index];

      if (filter === 1) {
        value = (value + left) & 255;
      } else if (filter === 2) {
        value = (value + up) & 255;
      } else if (filter === 3) {
        value = (value + ((left + up) >> 1)) & 255;
      } else if (filter === 4) {
        const estimate = left + up - upLeft;
        const distanceLeft = Math.abs(estimate - left);
        const distanceUp = Math.abs(estimate - up);
        const distanceUpLeft = Math.abs(estimate - upLeft);
        const predictor =
          distanceLeft <= distanceUp && distanceLeft <= distanceUpLeft
            ? left
            : distanceUp <= distanceUpLeft
              ? up
              : upLeft;
        value = (value + predictor) & 255;
      } else if (filter !== 0) {
        throw new Error(`Unsupported PNG filter ${filter}`);
      }

      line[index] = value;
    }

    for (let x = 0; x < width; x += 1) {
      const source = x * channels;
      const target = (y * width + x) * 4;
      pixels[target] = line[source];
      pixels[target + 1] = channels === 4 ? line[source + 1] : line[source];
      pixels[target + 2] = channels === 4 ? line[source + 2] : line[source];
      pixels[target + 3] = channels === 4 ? line[source + 3] : 255;
    }

    previous = line;
  }

  return { width, height, pixels };
}

const artwork = decodePng(await readFile(ARTWORK));
if (SLOT.x + SLOT.width > artwork.width || SLOT.y + SLOT.height > artwork.height) {
  throw new Error('The photo slot falls outside the artwork');
}

const luminance = Buffer.alloc(SLOT.width * SLOT.height);
for (let y = 0; y < SLOT.height; y += 1) {
  for (let x = 0; x < SLOT.width; x += 1) {
    const source = ((SLOT.y + y) * artwork.width + (SLOT.x + x)) * 4;
    const value =
      artwork.pixels[source] * 0.299 +
      artwork.pixels[source + 1] * 0.587 +
      artwork.pixels[source + 2] * 0.114;
    luminance[y * SLOT.width + x] = Math.round(value);
  }
}

await writeFile(OUTPUT, luminance);
console.log(
  `Wrote ${OUTPUT} (${luminance.length} bytes, ${SLOT.width}x${SLOT.height} luminance)`,
);
