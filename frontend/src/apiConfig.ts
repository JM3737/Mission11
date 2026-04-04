/** Trim trailing slash so `${API_BASE_URL}/api/...` is always valid. */
function normalizeBaseUrl(url: string): string {
  return url.replace(/\/$/, '');
}

/**
 * Backend API base (no `/api` suffix).
 * - Production: set `VITE_API_URL` in `.env.production` (Azure App Service URL).
 * - Local dev: defaults to http://localhost:5140 when unset.
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL
  ? normalizeBaseUrl(import.meta.env.VITE_API_URL)
  : 'http://localhost:5140';
