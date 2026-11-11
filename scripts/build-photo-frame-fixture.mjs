// Regenerates the raw pixel fixture used by scripts/photo-frame.test.mjs.
//
// The fixture is the photo slot region of public/images/template.jpg, stored as
// one luminance byte per pixel so the test can run the real mask algorithm
// without a browser or an image decoder.
//
// Usage: node scripts/build-photo-frame-fixture.mjs
import { writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const ARTWORK = 'public/images/template.jpg';
const OUTPUT = 'scripts/fixtures/photo-frame-slot.luma';

// Must match PHOTO_SLOT in src/lib/photo-frame.ts.
const SLOT = { x: 423, y: 433, width: 438, height: 438 };

// Python with Pillow is the only JPEG decoder available in this environment.
const script = `
from PIL import Image
import sys
image = Image.open(${JSON.stringify(ARTWORK)}).convert("L")
slot = image.crop((${SLOT.x}, ${SLOT.y}, ${SLOT.x + SLOT.width}, ${SLOT.y + SLOT.height}))
sys.stdout.buffer.write(slot.tobytes())
`;

const raw = execFileSync('python3', ['-c', script], { maxBuffer: 64 * 1024 * 1024 });

const expected = SLOT.width * SLOT.height;
if (raw.length !== expected) {
  throw new Error(`Expected ${expected} bytes of pixel data, got ${raw.length}`);
}

await writeFile(OUTPUT, raw);
console.log(
  `Wrote ${OUTPUT} (${raw.length} bytes, ${SLOT.width}x${SLOT.height} luminance)`,
);
