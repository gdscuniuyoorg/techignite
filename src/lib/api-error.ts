import type { HTTPError } from 'ky';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * Human-readable message from an error response body.
 *
 * ky v2 reads and parses the error body itself and exposes it as
 * `HTTPError.data`. `HTTPError.response` is already consumed, so cloning it
 * throws ("Response body is already used") and the server's message is lost.
 */
export function errorMessageFromData(data: unknown): string {
  if (typeof data === 'string' && data.trim().length > 0) {
    return data.trim();
  }
  if (!isRecord(data)) {
    return '';
  }
  if (typeof data.message === 'string' && data.message.trim().length > 0) {
    return data.message.trim();
  }
  if (typeof data.error === 'string' && data.error.trim().length > 0) {
    return data.error.trim();
  }
  const nested = data.error;
  if (
    isRecord(nested) &&
    typeof nested.message === 'string' &&
    nested.message.trim().length > 0
  ) {
    return nested.message.trim();
  }
  return '';
}

/**
 * Server-provided message for a failed HTTP request, or an empty string.
 *
 * Prefers ky's parsed `data`; only falls back to reading the response when ky
 * did not capture a body (where the body may still be unread).
 */
export async function httpErrorMessage(error: HTTPError): Promise<string> {
  let data: unknown = error.data;
  if (data === undefined) {
    try {
      data = await error.response.clone().json();
    } catch {
      // Body was already consumed or was not JSON.
    }
  }
  return errorMessageFromData(data);
}
