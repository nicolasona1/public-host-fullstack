// src/api.ts
// CHANGE: Central API base from Vite env
const RAW = import.meta.env.VITE_API_BASE_URL || "";
export const API_BASE = RAW.replace(/\/$/, "");

// CHANGE: One helper that adds credentials + sane JSON handling
export async function apiFetch(path: string, options: RequestInit = {}) {
  const url = `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
  const headers = new Headers(options.headers || {});
  const method = (options.method || "GET").toUpperCase();
  if (method !== "GET" && method !== "DELETE" && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(url, { ...options, headers, credentials: "include" });
  if (!res.ok) {
    let msg = "";
    try { msg = (await res.json()).message || ""; } catch {}
    throw new Error(msg || `${res.status} ${res.statusText}`);
  }
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

// === Auth ===
export const login = (body: { usrName: string; email: string; }) =>
  apiFetch("/login", { method: "POST", body: JSON.stringify(body) }); // CHANGE

export const logout = () =>
  apiFetch("/logout", { method: "POST" }); // CHANGE

export const signUp = (body: { fullName: string; usrName: string; email: string; }) =>
  apiFetch("/sign_up", { method: "POST", body: JSON.stringify(body) }); // CHANGE

// === Cards ===
export const getUserCards = () =>
  apiFetch("/user_cards"); // CHANGE

export const addCard = (body: any) =>
  apiFetch("/add_cards", { method: "POST", body: JSON.stringify(body) }); // CHANGE

export const updateSpent = (id: number, body: any) =>
  apiFetch(`/update_spent/${id}`, { method: "PATCH", body: JSON.stringify(body) }); // CHANGE

export const deleteCard = (id: number) =>
  apiFetch(`/delete_cards/${id}`, { method: "DELETE" }); // CHANGE

export async function downloadExcel() { // CHANGE
  const res = await fetch(`${API_BASE}/download_excel`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.blob();
}

// === Settings ===
export const updateResetPeriod = (period: "monthly" | "yearly") =>
  apiFetch("/update_reset_period", {
    method: "PATCH",
    body: JSON.stringify({ reset_period: period }),
  }); // CHANGE

// === AI ===
export const getRecommendation = () =>
  apiFetch("/ai/recommendation", { method: "POST" }); // CHANGE
