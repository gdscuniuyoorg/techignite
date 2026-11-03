import ky, { HTTPError, TimeoutError } from 'ky';

/**
 * Shared client for the Tech Ignite API. The hackathon applications endpoint
 * lives at `https://api.techignite.net/api/applications`.
 */
export const api = ky.create({
  baseUrl: 'https://api.techignite.net/',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

/** Payload accepted by POST /api/applications. */
export interface HackathonApplication {
  readonly teamName: string;
  readonly projectIdea: string;
  readonly agreedToRules: boolean;
  readonly applicantEmail: string;
  readonly teamDescription: string;
  readonly applicantLastName: string;
  readonly applicantFirstName: string;
}

export async function submitApplication(
  application: HackathonApplication,
): Promise<void> {
  await api.post('api/applications', { json: application });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * Best-effort, human readable message from a failed submission. The API's
 * error body shape is not guaranteed, so every step is narrowed defensively
 * and a generic fallback covers the rest.
 */
export async function getApplicationErrorMessage(error: unknown): Promise<string> {
  if (error instanceof HTTPError) {
    try {
      const body: unknown = await error.response.clone().json();
      if (isRecord(body)) {
        const message = body.message ?? body.error;
        if (typeof message === 'string' && message.trim()) {
          return message;
        }
      }
    } catch {
      // Unparseable or empty error body — fall through to the generic message.
    }
    if (error.response.status === 429) {
      return 'Too many attempts. Give it a minute, then try again.';
    }
    return `The server refused the application (HTTP ${String(error.response.status)}). Try again in a moment.`;
  }
  if (error instanceof TimeoutError) {
    return 'The request timed out. Check your connection and try again.';
  }
  return 'Something went wrong while submitting. Check your connection and try again.';
}
