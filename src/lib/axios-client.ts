import axios from 'axios';
import { notify } from './toast';

export const api = axios.create({
  baseURL: '/api/proxy',
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function attemptRefresh(): Promise<boolean> {
  if (isRefreshing && refreshPromise) return refreshPromise;

  isRefreshing = true;
  refreshPromise = fetch('/api/auth/refresh', { method: 'POST' })
    .then((res) => res.ok)
    .catch(() => false)
    .finally(() => {
      isRefreshing = false;
    });

  return refreshPromise;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const originalRequest = error.config;

    if (status === 401 && !originalRequest._retried && !window.location.pathname.startsWith('/login')) {
      originalRequest._retried = true;

      const refreshed = await attemptRefresh();
      if (refreshed) {
        return api(originalRequest); // retry the original request once, with the new cookie now set
      }

      await fetch('/api/auth/logout', { method: 'POST' }).catch(() => { });
      window.location.href = '/login?expired=1';
      return new Promise(() => { });
    }

    const message = error.response?.data?.message ?? 'Something went wrong';
    const text = Array.isArray(message) ? message.join(', ') : message;
    notify.error(text);
    return Promise.reject(new Error(text));
  },
);