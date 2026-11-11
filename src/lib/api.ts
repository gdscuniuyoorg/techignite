import ky, { HTTPError, TimeoutError } from 'ky';
import { httpErrorMessage } from '@/lib/api-error';

/**
 * Shared client for the Tech Ignite API. The hackathon applications endpoint
 * lives at `/api/applications`. The base URL is env-driven for local
 * development (`.env.local`); production falls back to the public API.
 */
const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  'https://api.techignite.net/';

export const api = ky.create({
  baseUrl: API_BASE_URL,
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

/**
 * Best-effort, human readable message from a failed submission. The API's
 * error body shape is not guaranteed, so every step is narrowed defensively
 * and a generic fallback covers the rest.
 */
export async function getApplicationErrorMessage(error: unknown): Promise<string> {
  if (error instanceof HTTPError) {
    const message = await httpErrorMessage(error);
    if (message.length > 0) {
      return message;
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
