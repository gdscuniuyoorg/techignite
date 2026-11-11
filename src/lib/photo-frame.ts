/**
 * Geometry and pixel compositing for the "I Will Be Attending" photo frame.
 *
 * The frame artwork (`public/images/template.jpg`) is a 1280x1280 JPEG. Inside
 * it, a white panel marks where the photo goes. That panel is not a plain
 * rectangle: it has a large rounded top left corner, and the black and green
 * checker squares of the mosaic sit on top of it.
 *
 * So the photo is placed by flood filling the panel from its centre and
 * treating everything the fill did not reach as artwork that stays on top.
 * The result is the artwork with the photo showing through the white panel,
 * with every decorative square and the rounded corner preserved.
 *
 * Everything here is browser only except the pure geometry helpers, which are
 * unit tested in `scripts/photo-frame.test.mjs`.
 */

/** Path of the frame artwork in `public/`. */
export const TEMPLATE_SOURCE = '/images/template.jpg';

/** Edge length of the frame artwork in pixels. */
export const TEMPLATE_SIZE = 1280;

/**
 * The white panel inside the artwork, in artwork pixels. Verified against the
 * JPEG: the pure white bounding box of the panel is x 423..860 and y 433..870.
 */
export const PHOTO_SLOT = {
  x: 423,
  y: 433,
  width: 438,
  height: 438,
} as const;

/**
 * The white name bar inside the artwork, in artwork pixels. Verified against
 * the JPEG: the pure white bounding box of the bar is x 421..858 and y 907..975.
 */
export const NAME_BAR = {
  x: 421,
  y: 907,
  width: 437,
  height: 68,
} as const;

/** Font size range for the name, in artwork pixels. */
export const NAME_MAX_FONT_SIZE = 44;
export const NAME_MIN_FONT_SIZE = 22;

/** Padding inside the bar, in artwork pixels. */
export const NAME_BAR_PADDING = 28;

/**
 * Luminance window used to build the panel mask. Pixels darker than
 * `MASK_FLOOR` are artwork (checker squares, corner edge), pixels brighter
 * than `MASK_CEILING` are fully replaced by the photo.
 */
export const MASK_FLOOR = 170;
export const MASK_CEILING = 250;

/** Largest upload accepted, in bytes. */
export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

/** A rectangle in source image pixels. */
export interface SourceRect {
  readonly sx: number;
  readonly sy: number;
  readonly width: number;
  readonly height: number;
}

/** Anything the browser can draw, with its intrinsic pixel size. */
export type DrawableImage = ImageBitmap | HTMLImageElement;

function intrinsicWidth(image: DrawableImage): number {
  return image instanceof HTMLImageElement ? image.naturalWidth : image.width;
}

function intrinsicHeight(image: DrawableImage): number {
  return image instanceof HTMLImageElement ? image.naturalHeight : image.height;
}

/**
 * Source rectangle that fills a target box with the source image, cropping the
 * overflow evenly on both sides (a "cover" crop). Portrait photos therefore
 * lose their top and bottom, never their sides.
 */
export function coverSourceRect(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
): SourceRect {
  if (sourceWidth <= 0 || sourceHeight <= 0) {
    throw new Error('Source image has no pixels');
  }
  if (targetWidth <= 0 || targetHeight <= 0) {
    throw new Error('Target box has no pixels');
  }

  const scale = Math.max(targetWidth / sourceWidth, targetHeight / sourceHeight);
  const width = targetWidth / scale;
  const height = targetHeight / scale;

  return {
    sx: (sourceWidth - width) / 2,
    sy: (sourceHeight - height) / 2,
    width,
    height,
  };
}

/** Mask opacity for a luminance value: 0 keeps the artwork, 1 is pure photo. */
export function maskOpacity(luminance: number): number {
  const span = MASK_CEILING - MASK_FLOOR;
  const value = (luminance - MASK_FLOOR) / span;
  if (Number.isNaN(value)) return 0;
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
}

/**
 * Luminance of one pixel of an RGBA buffer, using the Rec. 601 weights.
 */
function luminanceAt(data: Uint8ClampedArray, index: number): number {
  const red = data[index] ?? 0;
  const green = data[index + 1] ?? 0;
  const blue = data[index + 2] ?? 0;
  return red * 0.299 + green * 0.587 + blue * 0.114;
}

/**
 * Reduces an RGBA buffer to one luminance byte per pixel.
 */
export function toLuminance(data: Uint8ClampedArray): Uint8Array {
  const luminance = new Uint8Array(data.length / 4);
  for (let pixel = 0; pixel < luminance.length; pixel += 1) {
    luminance[pixel] = Math.round(luminanceAt(data, pixel * 4));
  }
  return luminance;
}

/**
 * Flood fills the white panel of the artwork.
 *
 * Returns a mask, one byte per pixel of the slot, where 255 means the pixel
 * belongs to the panel and the photo may show through it. The fill starts at
 * the centre of the panel and only spreads over bright pixels, so the checker
 * squares and the separate decorative white square are left out.
 */
export function buildPanelMask(
  luminance: Uint8Array,
  width: number,
  height: number,
): Uint8Array {
  const mask = new Uint8Array(width * height);

  // Find a bright seed at the centre of the panel.
  const centreX = Math.floor(width / 2);
  const centreY = Math.floor(height / 2);
  let seedPixel = -1;
  for (let radius = 0; radius < Math.max(width, height) && seedPixel < 0; radius += 1) {
    const candidates: readonly (readonly [number, number])[] = [
      [centreX, centreY - radius],
      [centreX, centreY + radius],
      [centreX - radius, centreY],
      [centreX + radius, centreY],
    ];
    for (const [x, y] of candidates) {
      if (x < 0 || y < 0 || x >= width || y >= height) continue;
      const pixel = y * width + x;
      if ((luminance[pixel] ?? 0) >= MASK_CEILING) {
        seedPixel = pixel;
        break;
      }
    }
  }
  if (seedPixel < 0) {
    throw new Error('Could not locate the photo panel in the frame artwork');
  }

  // Iterative flood fill over bright pixels, using a stack of pixel indices.
  const stack = new Int32Array(width * height);
  let stackTop = 0;
  stack[stackTop] = seedPixel;
  stackTop += 1;
  mask[seedPixel] = 255;

  while (stackTop > 0) {
    stackTop -= 1;
    const pixel = stack[stackTop] ?? 0;
    const x = pixel % width;
    const y = (pixel - x) / width;

    const neighbours: readonly (readonly [number, number])[] = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ];
    for (const [nx, ny] of neighbours) {
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      const neighbour = ny * width + nx;
      if (mask[neighbour] === 255) continue;
      if ((luminance[neighbour] ?? 0) < MASK_CEILING) continue;
      mask[neighbour] = 255;
      if (stackTop < stack.length) {
        stack[stackTop] = neighbour;
        stackTop += 1;
      }
    }
  }

  return mask;
}

/**
 * Grows the mask by one pixel in every direction so the antialiased edge of
 * the panel (the rounded corner and the square edges) is included and can be
 * faded smoothly.
 */
export function dilateMask(mask: Uint8Array, width: number, height: number): Uint8Array {
  const grown = new Uint8Array(mask.length);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (mask[y * width + x] === 255) {
        grown[y * width + x] = 255;
        continue;
      }
      const neighbours: readonly (readonly [number, number])[] = [
        [x + 1, y],
        [x - 1, y],
        [x, y + 1],
        [x, y - 1],
      ];
      for (const [nx, ny] of neighbours) {
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        if (mask[ny * width + nx] === 255) {
          grown[y * width + x] = 255;
          break;
        }
      }
    }
  }
  return grown;
}

/**
 * Composites a photo into the white panel of the frame artwork.
 *
 * Returns a fresh 1280x1280 canvas: the artwork with the photo placed in the
 * panel and the name drawn into the name bar. The canvas is not tainted (same
 * origin artwork, same origin upload), so it can be exported with `toBlob`.
 */
export function compositePhoto(
  artwork: DrawableImage,
  photo: DrawableImage,
  name = '',
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = TEMPLATE_SIZE;
  canvas.height = TEMPLATE_SIZE;

  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) {
    throw new Error('Canvas 2D context is unavailable');
  }

  context.drawImage(artwork, 0, 0, TEMPLATE_SIZE, TEMPLATE_SIZE);

  const slot = PHOTO_SLOT;
  const artworkPixels = context.getImageData(slot.x, slot.y, slot.width, slot.height);

  // Draw the photo into a slot sized canvas using a cover crop. The canvas is
  // filled white first so a transparent PNG blends into the white panel
  // instead of punching a hole in it.
  const photoCanvas = document.createElement('canvas');
  photoCanvas.width = slot.width;
  photoCanvas.height = slot.height;
  const photoContext = photoCanvas.getContext('2d', { willReadFrequently: true });
  if (!photoContext) {
    throw new Error('Canvas 2D context is unavailable');
  }
  photoContext.fillStyle = '#ffffff';
  photoContext.fillRect(0, 0, slot.width, slot.height);

  const crop = coverSourceRect(
    intrinsicWidth(photo),
    intrinsicHeight(photo),
    slot.width,
    slot.height,
  );
  photoContext.drawImage(
    photo,
    crop.sx,
    crop.sy,
    crop.width,
    crop.height,
    0,
    0,
    slot.width,
    slot.height,
  );

  const photoPixels = photoContext.getImageData(0, 0, slot.width, slot.height);
  const artworkData = artworkPixels.data;
  const photoData = photoPixels.data;

  const panel = buildPanelMask(toLuminance(artworkData), slot.width, slot.height);
  const reachable = dilateMask(panel, slot.width, slot.height);

  for (let pixel = 0; pixel < reachable.length; pixel += 1) {
    if (reachable[pixel] === 0) continue;

    const index = pixel * 4;
    const opacity = maskOpacity(luminanceAt(artworkData, index));
    if (opacity <= 0) continue;

    const inverse = 1 - opacity;
    artworkData[index] = Math.round(
      (photoData[index] ?? 0) * opacity + (artworkData[index] ?? 0) * inverse,
    );
    artworkData[index + 1] = Math.round(
      (photoData[index + 1] ?? 0) * opacity + (artworkData[index + 1] ?? 0) * inverse,
    );
    artworkData[index + 2] = Math.round(
      (photoData[index + 2] ?? 0) * opacity + (artworkData[index + 2] ?? 0) * inverse,
    );
  }

  context.putImageData(artworkPixels, slot.x, slot.y);
  drawName(context, name);
  return canvas;
}

/**
 * Font used for the name on the frame. DESIGN.md names Product Sans as the
 * brand display face for poster scale lockup text, and it is self hosted in
 * `public/custom-font`, so the canvas can use it once the document font has
 * loaded.
 */
const NAME_FONT_FAMILY = 'Product Sans';

/** Colour of the name text, sampled from the "TECH IGNITE'26" lockup. */
const NAME_FONT_COLOR = '#9b80e9';

/**
 * Waits for the display font to load, so canvas text is measured and drawn
 * with the real face rather than a fallback.
 */
export async function loadNameFont(): Promise<void> {
  if (typeof document === 'undefined') return;
  try {
    const spec = `700 ${String(NAME_MAX_FONT_SIZE)}px "${NAME_FONT_FAMILY}"`;
    await document.fonts.load(spec);
  } catch {
    // A missing font only means the name falls back to the generic family.
  }
}

/**
 * Shrinks the font size until the name fits inside the name bar.
 *
 * Pure: it takes the measured width at a given size and returns the size to
 * use, so the fitting rule can be unit tested without a canvas.
 */
export function fitNameFontSize(
  measure: (fontSize: number) => number,
  availableWidth: number,
  maxFontSize: number = NAME_MAX_FONT_SIZE,
  minFontSize: number = NAME_MIN_FONT_SIZE,
): number {
  for (let size = maxFontSize; size > minFontSize; size -= 1) {
    if (measure(size) <= availableWidth) return size;
  }
  return minFontSize;
}

/**
 * Shortens a name until it fits the available width, ending in an ellipsis.
 *
 * Pure: it takes the measured width of a string and returns the string to
 * draw, so the truncation rule can be unit tested without a canvas.
 */
export function truncateName(
  measure: (text: string) => number,
  text: string,
  availableWidth: number,
): string {
  if (measure(text) <= availableWidth) return text;

  for (let length = text.length - 1; length > 0; length -= 1) {
    const candidate = `${text.slice(0, length).trimEnd()}…`;
    if (measure(candidate) <= availableWidth) return candidate;
  }
  return '…';
}

/**
 * Draws the name into the white name bar of the artwork.
 *
 * The name is uppercased and centred in the bar, shrunk to fit and then
 * truncated if it is still too long. An empty name leaves the bar blank,
 * which is how the artwork ships.
 */
export function drawName(context: CanvasRenderingContext2D, name: string): void {
  const trimmed = name.trim();
  if (!trimmed) return;

  const bar = NAME_BAR;
  const availableWidth = bar.width - NAME_BAR_PADDING * 2;

  context.save();
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = NAME_FONT_COLOR;

  const setFont = (fontSize: number) => {
    context.font = `700 ${String(fontSize)}px "${NAME_FONT_FAMILY}"`;
  };
  const measure = (text: string) => {
    setFont(NAME_MIN_FONT_SIZE);
    return context.measureText(text).width;
  };

  const fontSize = fitNameFontSize((size) => {
    setFont(size);
    return context.measureText(trimmed.toUpperCase()).width;
  }, availableWidth);

  setFont(fontSize);
  const text = truncateName(measure, trimmed.toUpperCase(), availableWidth);
  context.fillText(text, bar.x + bar.width / 2, bar.y + bar.height / 2);
  context.restore();
}

/** Decoded frame artwork, fetched once and reused for every upload. */
let artworkPromise: Promise<ImageBitmap> | null = null;

export function loadArtwork(): Promise<ImageBitmap> {
  artworkPromise ??= (async () => {
    const response = await fetch(TEMPLATE_SOURCE);
    if (!response.ok) {
      throw new Error(`Could not load the frame artwork (${String(response.status)})`);
    }
    const blob = await response.blob();
    return createImageBitmap(blob);
  })().catch((error: unknown) => {
    artworkPromise = null;
    throw error;
  });
  return artworkPromise;
}
