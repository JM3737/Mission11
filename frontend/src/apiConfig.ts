/** Trim trailing slash so `${API_BASE_URL}/api/...` is always valid. */
function normalizeBaseUrl(url: string): string {
  return url.replace(/\/$/, '');
}

/**
 * Used when `import.meta.env.PROD` is true but `VITE_API_URL` was not set at build time
 * (some Azure/Oryx builds do not load `.env.production` like local `vite build` does).
 */
const PRODUCTION_API_DEFAULT =
  'https://online-bookstore-cef4d0hfg0fcahfm.westus2-01.azurewebsites.net';

function resolveApiBaseUrl(): string {
  const env = import.meta.env.VITE_API_URL;
  if (typeof env === 'string' && env.trim().length > 0) {
    return normalizeBaseUrl(env.trim());
  }
  if (import.meta.env.PROD) {
    return normalizeBaseUrl(PRODUCTION_API_DEFAULT);
  }
  return 'http://localhost:5140';
}

/**
 * Backend API base (no `/api` suffix).
 * - Prefer `VITE_API_URL` from `.env.production` / CI when set.
 * - Production fallback: Azure App Service URL above (change if you recreate the API).
 * - Local dev: http://localhost:5140 when unset.
 */
export const API_BASE_URL = resolveApiBaseUrl();
