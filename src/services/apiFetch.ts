
import { authHeaders } from "@/config/api";

type Options = RequestInit & { json?: any };

export async function apiFetch<T = any>(url: string, options: Options = {}): Promise<T> {
  const { json, headers, ...rest } = options;

  const res = await fetch(url, {
    ...rest,
    headers: {
      Accept: "application/json",
      ...(json ? { "Content-Type": "application/json" } : {}),
      ...authHeaders(),
      ...headers,
    },
    body: json ? JSON.stringify(json) : options.body,
  });

  const data = await res.json().catch(() => ({} as T));
  if (!res.ok) {
    const msg = (data as any)?.error || (data as any)?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}
