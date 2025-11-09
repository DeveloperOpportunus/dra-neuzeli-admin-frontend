// src/lib/auth.ts
const AUTH_KEY = "auth_token";
const USER_KEY = "auth_user";

export function setToken(token: string) {
  localStorage.setItem(AUTH_KEY, token);
}
export function getToken(): string | null {
  return localStorage.getItem(AUTH_KEY);
}
export function clearToken() {
  localStorage.removeItem(AUTH_KEY);
}

export function setUser(user: unknown) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}
export function getUser<T = any>(): T | null {
  const raw = localStorage.getItem(USER_KEY);
  try { return raw ? (JSON.parse(raw) as T) : null; } catch { return null; }
}
export function clearUser() {
  localStorage.removeItem(USER_KEY);
}

export function logout() {
  clearToken();
  clearUser();
}

// Decodifica parte do JWT com base64 url-safe
function decodeJwtPart(part: string) {
  const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "===".slice((base64.length + 3) % 4);
  return JSON.parse(atob(padded));
}

export function isTokenValid(token?: string | null) {
  if (!token) return false;
  const [, payload] = token.split(".");
  if (!payload) return false;
  try {
    const json = decodeJwtPart(payload);
    if (!json.exp) return true;
    const now = Math.floor(Date.now() / 1000);
    return json.exp > now;
  } catch {
    return false;
  }
}
