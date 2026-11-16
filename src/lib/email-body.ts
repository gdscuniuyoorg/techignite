/**
 * A campaign body is sendable when it has visible text or non-text media.
 * Image-only emails have no extracted text, so checking text alone would
 * wrongly reject them.
 */
export function hasEmailBody(html: string, text: string): boolean {
  if (text.trim().length > 0) return true;
  return /<(?:img|hr|table|video|picture)\b/i.test(html);
}
