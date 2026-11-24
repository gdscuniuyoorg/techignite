#!/usr/bin/env node
/**
 * Sync the Tech Ignite '26 Hackathon album from Google Photos.
 *
 * Google Photos share pages embed every photo's direct CDN URL in the page
 * bootstrap data. This script:
 *   1. fetches the album page and extracts the unique `lh3.googleusercontent`
 *      photo URLs, preserving album order;
 *   2. downloads the first N photos as local fallbacks into
 *      `public/images/hackathon/`;
 *   3. writes `src/utils/hackathon-photos.json`, where the first N entries use
 *      the local files and every remaining entry points at the remote CDN URL
 *      with one of the local files assigned as its `fallback`.
 *
 * Run with:
 *   bun run photos:sync        (or)   node scripts/sync-hackathon-photos.mjs
 *
 * Re-run whenever the album changes. Google CDN URLs can expire; the gallery
 * swaps a failed remote image for its local fallback at render time.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ALBUM_URL = 'https://photos.app.goo.gl/BSAdHisV9ZZtUjXL9';
const FALLBACK_COUNT = 10;
const REMOTE_WIDTH = 1600;
const OUT_DIR = join(ROOT, 'public', 'images', 'hackathon');
const MANIFEST = join(ROOT, 'src', 'utils', 'hackathon-photos.json');

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
          referer: 'https://photos.google.com/',
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
 * Read the intrinsic dimensions from a JPEG buffer.
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
    // Standalone markers carry no length field.
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

/** @param {string} html */
function extractPhotoUrls(html) {
  const matches = html.matchAll(
    /https:\/\/lh3\.googleusercontent\.com\/pw\/[A-Za-z0-9_-]+/g,
  );
  const seen = new Set();
  const urls = [];

  for (const match of matches) {
    const url = match[0];
    if (seen.has(url)) continue;
    seen.add(url);
    urls.push(url);
  }

  return urls;
}

/** @param {number} index */
function fallbackName(index) {
  return `hackathon-${String(index + 1).padStart(2, '0')}.jpg`;
}

async function main() {
  console.log(`Fetching album: ${ALBUM_URL}`);
  const albumResponse = await fetchWithRetry(ALBUM_URL);
  const html = await albumResponse.text();
  const photoUrls = extractPhotoUrls(html);

  if (photoUrls.length === 0) {
    throw new Error(
      'No photo URLs found. The album may be private or Google changed its markup.',
    );
  }

  console.log(`Found ${String(photoUrls.length)} photos.`);

  await mkdir(OUT_DIR, { recursive: true });

  const fallbackCount = Math.min(FALLBACK_COUNT, photoUrls.length);
  /** @type {{ path: string; width: number; height: number }[]} */
  const fallbacks = [];

  for (let index = 0; index < fallbackCount; index += 1) {
    const source = photoUrls[index];
    if (source === undefined) continue;

    const response = await fetchWithRetry(`${source}=w${String(REMOTE_WIDTH)}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    const size = jpegSize(buffer);
    const file = fallbackName(index);
    await writeFile(join(OUT_DIR, file), buffer);

    fallbacks.push({
      path: `/images/hackathon/${file}`,
      width: size?.width ?? REMOTE_WIDTH,
      height: size?.height ?? Math.round((REMOTE_WIDTH * 2) / 3),
    });

    console.log(
      `  fallback ${String(index + 1).padStart(2, '0')}/${String(fallbackCount)} → ${file} (${String(buffer.length)} bytes)`,
    );
  }

  if (fallbacks.length === 0) {
    throw new Error('Could not download any fallback photos.');
  }

  const photos = photoUrls.map((source, index) => {
    const fallback = fallbacks[index % fallbacks.length];
    if (fallback === undefined) {
      throw new Error('Fallback list unexpectedly empty.');
    }

    const isLocal = index < fallbacks.length;
    return {
      src: isLocal ? fallback.path : `${source}=w${String(REMOTE_WIDTH)}`,
      fallback: fallback.path,
      alt: `Tech Ignite '26 hackathon photo ${String(index + 1)}`,
      width: isLocal ? fallback.width : REMOTE_WIDTH,
      height: isLocal ? fallback.height : Math.round((REMOTE_WIDTH * 2) / 3),
    };
  });

  await writeFile(MANIFEST, `${JSON.stringify(photos, null, 2)}\n`);

  console.log(`Wrote ${String(photos.length)} entries → ${MANIFEST}`);
  console.log(`Local fallbacks: ${String(fallbacks.length)} in public/images/hackathon/`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
