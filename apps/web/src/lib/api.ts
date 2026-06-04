import axios, { AxiosError } from 'axios';
import { clearAuth, getToken } from './auth';
import type { ApiError } from './types';

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

/** Central axios instance — the single point that talks to the API. */
export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

/** Inject the bearer token on every outgoing request. */
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** On 401, drop the stale session and bounce to /login. */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      clearAuth();
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

/** Extract a human-friendly message from an axios/API error. */
export function getApiErrorMessage(error: unknown, fallback = 'Algo deu errado. Tente novamente.'): string {
  if (axios.isAxiosError<ApiError>(error)) {
    const data = error.response?.data;
    if (data?.issues?.length) {
      return data.issues.map((i) => i.message).join(', ');
    }
    if (data?.message) return data.message;
    if (error.message) return error.message;
  }
  return fallback;
}
