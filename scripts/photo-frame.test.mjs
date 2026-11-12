import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import {
  buildPanelMask,
  coverSourceRect,
  dilateMask,
  fitNameFontSize,
  maskOpacity,
  MASK_CEILING,
  MASK_FLOOR,
  NAME_BAR,
  NAME_MAX_FONT_SIZE,
  NAME_MIN_FONT_SIZE,
  PHOTO_SLOT,
  TEMPLATE_SIZE,
  truncateName,
} from '../src/lib/photo-frame.ts';

const SLOT_WIDTH = PHOTO_SLOT.width;
const SLOT_HEIGHT = PHOTO_SLOT.height;

/** Luminance bytes of the slot region, exported from the real artwork. */
async function loadSlotLuminance() {
  const buffer = await readFile('scripts/fixtures/photo-frame-slot.luma');
  return new Uint8Array(buffer);
}

test('the photo slot sits inside the 2160px artwork', () => {
  assert.equal(TEMPLATE_SIZE, 2160);
  assert.ok(PHOTO_SLOT.x >= 0);
  assert.ok(PHOTO_SLOT.y >= 0);
  assert.ok(PHOTO_SLOT.x + PHOTO_SLOT.width <= TEMPLATE_SIZE);
  assert.ok(PHOTO_SLOT.y + PHOTO_SLOT.height <= TEMPLATE_SIZE);
});

test('the photo slot is wider than it is tall', () => {
  assert.ok(PHOTO_SLOT.width > PHOTO_SLOT.height);
});

test('the name bar sits inside the artwork and beside the panel', () => {
  assert.ok(NAME_BAR.x >= 0);
  assert.ok(NAME_BAR.y >= 0);
  assert.ok(NAME_BAR.x + NAME_BAR.width <= TEMPLATE_SIZE);
  assert.ok(NAME_BAR.y + NAME_BAR.height <= TEMPLATE_SIZE);
  assert.ok(NAME_BAR.x + NAME_BAR.width / 2 > PHOTO_SLOT.x + PHOTO_SLOT.width);
});

test('a cover crop keeps the whole target box filled', () => {
  // 800x600 into a 438x438 box scales by 438/600, so the source region is
  // 600x600 wide and tall, cropped evenly from the sides.
  const crop = coverSourceRect(800, 600, 438, 438);
  assert.equal(crop.width, 600);
  assert.equal(crop.height, 600);
  assert.equal(crop.sx, 100);
  assert.equal(crop.sy, 0);
});

test('a square source needs no crop at all', () => {
  const crop = coverSourceRect(1000, 1000, 438, 438);
  assert.equal(crop.sx, 0);
  assert.equal(crop.sy, 0);
  assert.equal(crop.width, 1000);
  assert.equal(crop.height, 1000);
});

test('a cover crop of a tall portrait crops the top and bottom, not the sides', () => {
  const crop = coverSourceRect(400, 1200, 438, 438);
  assert.equal(crop.width, 400);
  assert.equal(crop.sx, 0);
  assert.equal(crop.height, 400);
  assert.equal(crop.sy, (1200 - 400) / 2);
});

test('a cover crop of a wide landscape crops the sides, not the top and bottom', () => {
  const crop = coverSourceRect(1600, 400, 438, 438);
  assert.equal(crop.height, 400);
  assert.equal(crop.sy, 0);
  assert.equal(crop.width, 400);
  assert.equal(crop.sx, (1600 - 400) / 2);
});

test('a cover crop rejects empty images', () => {
  assert.throws(() => coverSourceRect(0, 100, 438, 438));
  assert.throws(() => coverSourceRect(100, 0, 438, 438));
});

test('the mask keeps the artwork dark and replaces the artwork yellow', () => {
  assert.equal(maskOpacity(0), 0);
  assert.equal(maskOpacity(MASK_FLOOR), 0);
  assert.equal(maskOpacity(255), 1);
  assert.equal(maskOpacity(MASK_CEILING), 1);
});

test('the mask ramps smoothly between the artwork and the photo', () => {
  const mid = (MASK_FLOOR + MASK_CEILING) / 2;
  assert.ok(maskOpacity(mid) > 0 && maskOpacity(mid) < 1);
  assert.ok(maskOpacity(mid - 1) < maskOpacity(mid));
  assert.ok(maskOpacity(mid + 1) > maskOpacity(mid));
});

test('the panel mask covers the yellow panel of the real artwork', async () => {
  const luminance = await loadSlotLuminance();
  const mask = buildPanelMask(luminance, SLOT_WIDTH, SLOT_HEIGHT);

  // The panel centre is yellow artwork, so the fill reaches it.
  const centre = (SLOT_HEIGHT / 2) * SLOT_WIDTH + SLOT_WIDTH / 2;
  assert.equal(mask[centre], 255);

  // The panel is the bulk of the slot.
  const covered = mask.reduce((total, value) => total + (value === 255 ? 1 : 0), 0);
  assert.ok(covered > SLOT_WIDTH * SLOT_HEIGHT * 0.85);
  assert.ok(covered < SLOT_WIDTH * SLOT_HEIGHT);
});

test('the panel mask leaves the black notch on top', async () => {
  const luminance = await loadSlotLuminance();
  const mask = buildPanelMask(luminance, SLOT_WIDTH, SLOT_HEIGHT);

  // The rectangular notch cut out of the bottom left of the panel.
  const notch = (1400 - PHOTO_SLOT.y) * SLOT_WIDTH + (600 - PHOTO_SLOT.x);
  assert.equal(mask[notch], 0);
});

test('the panel mask leaves the separate name bar on top', async () => {
  const luminance = await loadSlotLuminance();
  const mask = buildPanelMask(luminance, SLOT_WIDTH, SLOT_HEIGHT);

  // The left edge of the name bar overlaps the slot bounding box, but it is
  // separated from the panel by the black perforation.
  const nameBar = (1540 - PHOTO_SLOT.y) * SLOT_WIDTH + (1500 - PHOTO_SLOT.x);
  assert.equal(mask[nameBar], 0);
});

test('the panel mask reaches the top tab of the panel', async () => {
  const luminance = await loadSlotLuminance();
  const mask = buildPanelMask(luminance, SLOT_WIDTH, SLOT_HEIGHT);

  // The narrow tab that rises above the main panel on the left.
  const tab = (700 - PHOTO_SLOT.y) * SLOT_WIDTH + (500 - PHOTO_SLOT.x);
  assert.equal(mask[tab], 255);
});

test('the panel mask reaches the stepped bottom edge of the panel', async () => {
  const luminance = await loadSlotLuminance();
  const mask = buildPanelMask(luminance, SLOT_WIDTH, SLOT_HEIGHT);

  // The lower part of the panel, below the notch.
  const step = (1550 - PHOTO_SLOT.y) * SLOT_WIDTH + (600 - PHOTO_SLOT.x);
  assert.equal(mask[step], 255);
});

test('dilating the mask grows it by one pixel in every direction', async () => {
  const luminance = await loadSlotLuminance();
  const mask = buildPanelMask(luminance, SLOT_WIDTH, SLOT_HEIGHT);
  const grown = dilateMask(mask, SLOT_WIDTH, SLOT_HEIGHT);

  const before = mask.reduce((total, value) => total + (value === 255 ? 1 : 0), 0);
  const after = grown.reduce((total, value) => total + (value === 255 ? 1 : 0), 0);
  assert.ok(after > before);

  // Every original pixel stays covered.
  for (let index = 0; index < mask.length; index += 1) {
    if (mask[index] === 255) {
      assert.equal(grown[index], 255);
    }
  }
});

test('the name font shrinks to fit the available width', () => {
  const measure = (fontSize) => fontSize * 10;
  assert.equal(fitNameFontSize(measure, 600), 60);
  assert.equal(fitNameFontSize(measure, 1000), NAME_MAX_FONT_SIZE);
  assert.equal(fitNameFontSize(measure, 1), NAME_MIN_FONT_SIZE);
});

test('a name that is too long is truncated with an ellipsis', () => {
  const measure = (text) => text.length * 10;
  assert.equal(truncateName(measure, 'ADA', 80), 'ADA');
  assert.equal(truncateName(measure, 'ADA LOVELACE', 80), 'ADA LOV…');
});
