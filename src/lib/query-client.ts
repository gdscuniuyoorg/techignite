import { QueryClient, type DefaultOptions } from '@tanstack/react-query';

const defaultOptions = {
  queries: {
    // Admin data changes on mutations that invalidate explicitly; focus
    // refetching adds noise on an internal tool.
    staleTime: 30_000,
    // Auth and permission failures are deterministic; fail fast and let the
    // UI render the error state instead of retrying behind the panel.
    retry: false,
    refetchOnWindowFocus: false,
  },
} satisfies { queries: DefaultOptions['queries'] };

/**
 * Per TanStack Query's SSR guidance: the server gets a fresh client per
 * request (no cross-request cache leakage); the browser reuses one client.
 */
let browserClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  if (typeof window === 'undefined') {
    return new QueryClient({ defaultOptions });
  }
  browserClient ??= new QueryClient({ defaultOptions });
  return browserClient;
}

/** Admin alias kept for the existing admin root. */
export function getAdminQueryClient(): QueryClient {
  return getQueryClient();
}
