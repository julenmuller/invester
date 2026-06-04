/**
 * Token storage. The JWT is kept in two places:
 *  - `localStorage`, read synchronously by the axios interceptor on the client.
 *  - a non-HttpOnly cookie, so Next.js middleware can guard routes on the edge
 *    before any client JS runs.
 *
 * All access is guarded for SSR (no `window`/`document` on the server).
 */

import type { AuthUser } from './types';

const TOKEN_KEY = 'investhub.token';
const USER_KEY = 'investhub.user';
export const TOKEN_COOKIE = 'investhub_token';

const isBrowser = typeof window !== 'undefined';

function setCookie(value: string, maxAgeSeconds: number) {
  if (typeof document === 'undefined') return;
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${TOKEN_COOKIE}=${value}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}

export function getToken(): string | null {
  if (!isBrowser) return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (!isBrowser) return;
  window.localStorage.setItem(TOKEN_KEY, token);
  setCookie(token, 60 * 60 * 24 * 7); // 7 days
}

export function getUser(): AuthUser | null {
  if (!isBrowser) return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setUser(user: AuthUser): void {
  if (!isBrowser) return;
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth(): void {
  if (!isBrowser) return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  setCookie('', 0);
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}
