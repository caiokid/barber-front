// export const API_URL = "http://localhost:8080";

// export async function api<T = unknown>(path: string, options: RequestInit = {}) {
//   const headers = new Headers(options.headers);
//   headers.set("Content-Type", "application/json");

//   const res = await fetch(`${API_URL}${path}`, { ...options, headers, credentials: "include" });
//   if (!res.ok) {
//     const err = await res.json().catch(() => ({}));
//     throw new Error(err.error || `HTTP ${res.status}`);
//   }
//   return (await res.json()) as T;
// }
