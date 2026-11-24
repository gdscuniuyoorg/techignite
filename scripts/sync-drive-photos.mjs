#!/usr/bin/env node
/**
 * Sync Tech Ignite '26 photo snippets from the public Google Drive folder.
 *
 * The Drive "CONTI" folder holds the full-resolution event gallery. The folder's
 * embedded list view exposes every file id and name, so this script:
 *   1. reads the folder listing and pairs each file id with its filename;
 *   2. picks an evenly spread subset across the album;
 *   3. downloads each pick through the Drive thumbnail endpoint at 1600px;
 *   4. writes `src/utils/tech-ignite-26-photos.json` with local paths, alt text
 *      and intrinsic dimensions.
 *
 * Run with:
 *   bun run photos:sync:memories
 *   (or) node scripts/sync-drive-photos.mjs
 *
 * Re-run whenever the folder gains photos. Drive file ids stay stable, so the
 * generated local files keep working offline.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FOLDER_ID = '1D79cUQGo1Zr2uow5TvhFkVQ3v8bhWzpV';
const FOLDER_VIEW = `https://drive.google.com/embeddedfolderview?id=${FOLDER_ID}#grid`;
const PHOTO_COUNT = 30;
const REMOTE_WIDTH = 1200;
const OUT_DIR = join(ROOT, 'public', 'images', 'memories', 'tech-ignite-26');
const MANIFEST = join(ROOT, 'src', 'utils', 'tech-ignite-26-photos.json');

const USER_AGENT =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

/** @param {string} url */
async function fetchWithRetry(url, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          'user-agent': USER_AGENT,
          'accept-language': 'en-US,en;q=0.9',
        },
        redirect: 'follow',
      });
      if (!response.ok) {
        throw new Error(`HTTP ${String(response.status)} for ${url}`);
      }
      return response;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise((resolveDelay) => {
          setTimeout(resolveDelay, 600 * attempt);
        });
      }
    }
  }
  throw lastError;
}

/**
 * Read intrinsic dimensions from a JPEG buffer.
 * @param {Buffer} buffer
 * @returns {{ width: number; height: number } | null}
 */
function jpegSize(buffer) {
  if (buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;

  let offset = 2;
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = buffer[offset + 1];
    if (marker === undefined) break;
    if (marker === 0x01 || marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2;
      continue;
    }

    const length = buffer.readUInt16BE(offset + 2);
    const isStartOfFrame =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc;

    if (isStartOfFrame) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7),
      };
    }

    offset += 2 + length;
  }

  return null;
}

/**
 * Pair each file id with its filename, preserving folder order.
 * @param {string} html
 * @returns {{ id: string; name: string }[]}
 */
function extractEntries(html) {
  const ids = [...html.matchAll(/\/file\/d\/([A-Za-z0-9_-]+)\/view/g)].map(
    (match) => match[1],
  );
  const names = [...html.matchAll(/flip-entry-title">([^<]+)</g)].map((match) =>
    match[1].trim(),
  );

  const count = Math.min(ids.length, names.length);
  const entries = [];
  for (let index = 0; index < count; index += 1) {
    const id = ids[index];
    const name = names[index];
    if (id === undefined || name === undefined) continue;
    if (!/\.(jpe?g|png|webp)$/i.test(name)) continue;
    entries.push({ id, name });
  }

  return entries;
}

/**
 * Pick `count` entries spread evenly across the album.
 * @param {{ id: string; name: string }[]} entries
 * @param {number} count
 */
function pickSpread(entries, count) {
  if (entries.length <= count) return entries;

  const step = (entries.length - 1) / (count - 1);
  const picks = [];
  for (let index = 0; index < count; index += 1) {
    const entry = entries[Math.round(index * step)];
    if (entry !== undefined && !picks.includes(entry)) picks.push(entry);
  }

  return picks;
}

/** @param {number} index */
function fileName(index) {
  return `tech-ignite-26-${String(index + 1).padStart(2, '0')}.jpg`;
}

async function main() {
  console.log(`Reading folder listing: ${FOLDER_VIEW}`);
  const listing = await (await fetchWithRetry(FOLDER_VIEW)).text();
  const entries = extractEntries(listing);

  if (entries.length === 0) {
    throw new Error(
      'No image files found. The folder may be private or Google changed its markup.',
    );
  }

  console.log(`Found ${String(entries.length)} images.`);

  const picks = pickSpread(entries, PHOTO_COUNT);
  await mkdir(OUT_DIR, { recursive: true });

  /** @type {{ src: string; alt: string; width: number; height: number }[]} */
  const photos = [];

  for (const [index, entry] of picks.entries()) {
    const file = fileName(index);
    const source = `https://drive.google.com/thumbnail?id=${entry.id}&sz=w${String(REMOTE_WIDTH)}`;
    const response = await fetchWithRetry(source);
    const buffer = Buffer.from(await response.arrayBuffer());
    const size = jpegSize(buffer);
    await writeFile(join(OUT_DIR, file), buffer);

    photos.push({
      src: `/images/memories/tech-ignite-26/${file}`,
      alt: `Tech Ignite '26 moment ${String(index + 1)}`,
      width: size?.width ?? REMOTE_WIDTH,
      height: size?.height ?? Math.round((REMOTE_WIDTH * 2) / 3),
    });

    console.log(
      `  ${String(index + 1).padStart(2, '0')}/${String(picks.length)} → ${file} (${String(buffer.length)} bytes, ${entry.name})`,
    );
  }

  await writeFile(MANIFEST, `${JSON.stringify(photos, null, 2)}\n`);

  console.log(`Wrote ${String(photos.length)} entries → ${MANIFEST}`);
  console.log(`Saved to public/images/memories/tech-ignite-26/`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
