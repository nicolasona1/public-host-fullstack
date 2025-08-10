// frontend/src/api.ts
const raw = import.meta.env.VITE_API_BASE_URL || '';
export const API_BASE = raw.replace(/\/$/, ''); // no trailing slash

function join(path: string) {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${p}`;
}

export async function api(path: string, init: RequestInit = {}) {
  const url = join(path);
  const res = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
    ...init,
  });
  return res;
}

export async function apiJSON<T = any>(path: string, init: RequestInit = {}) {
  const res = await api(path, init);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error((data as any)?.message || res.statusText), { status: res.status, data });
  return data as T;
}

/* Optional helpers */
export const login = (body: { usrName: string; email: string }) =>
  apiJSON('/login', { method: 'POST', body: JSON.stringify(body) });

export const logout = () =>
  apiJSON('/logout', { method: 'POST' });

export const getUserCards = () =>
  apiJSON('/user_cards');

export const updateResetPeriod = (period: 'monthly' | 'yearly') =>
  apiJSON('/update_reset_period', { method: 'PATCH', body: JSON.stringify({ resetPeriod: period }) });

export const getRecommendation = () =>
  apiJSON('/ai/recommendation', { method: 'POST' });
