import axios from "axios";

import { API_CONFIG } from "@/constants/api.constants";

let authToken: string | null = null;

export const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  return config;
});

export function setAuthToken(token: string | null) {
  authToken = token;

  try {
    if (typeof window !== "undefined") {
      if (token) {
        window.localStorage.setItem("auth.token", token);
      } else {
        window.localStorage.removeItem("auth.token");
      }
    }
  } catch (error) {}
}

export function getAuthToken() {
  if (authToken) return authToken;

  try {
    if (typeof window !== "undefined") {
      const storedToken = window.localStorage.getItem("auth.token");
      if (storedToken) {
        authToken = storedToken;
        return storedToken;
      }
    }
  } catch (error) {}

  return null;
}


// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// let authToken: string | null = null;

// export function setAuthToken(token: string | null) {
//   authToken = token;
//   try {
//     if (typeof window !== "undefined") {
//       if (token) window.localStorage.setItem("auth.token", token);
//       else window.localStorage.removeItem("auth.token");
//     }
//   } catch (e) {}
// }

// export function getAuthToken() {
//   if (authToken) return authToken;
//   try {
//     if (typeof window !== "undefined") {
//       const t = window.localStorage.getItem("auth.token");
//       if (t) {
//         authToken = t;
//         return t;
//       }
//     }
//   } catch (e) {}
//   return null;
// }

// async function request(path: string, options: RequestInit = {}) {
//   const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
//   const headers: Record<string, string> = { ...(options.headers as Record<string, string> || {}) };
//   if (!headers["Content-Type"] && !(options.body instanceof FormData)) {
//     headers["Content-Type"] = "application/json";
//   }

//   const token = getAuthToken();
//   if (token) headers["Authorization"] = `Bearer ${token}`;

//   const res = await fetch(url, { ...options, headers, credentials: options.credentials ?? "include" });

//   const text = await res.text();
//   const data = text ? parseJSONSafe(text) : null;

//   if (!res.ok) {
//     const err = new Error((data && data.message) || res.statusText || "API error");
//     (err as any).status = res.status;
//     (err as any).data = data;
//     throw err;
//   }

//   return data;
// }

// function parseJSONSafe(text: string) {
//   try {
//     return JSON.parse(text);
//   } catch (e) {
//     return text;
//   }
// }

// export const api = {
//   request,
//   get: (path: string, opts: RequestInit = {}) => request(path, { ...opts, method: "GET" }),
//   post: (path: string, body?: any, opts: RequestInit = {}) => request(path, { ...opts, method: "POST", body: body ? JSON.stringify(body) : undefined }),
//   patch: (path: string, body?: any, opts: RequestInit = {}) => request(path, { ...opts, method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
//   del: (path: string, opts: RequestInit = {}) => request(path, { ...opts, method: "DELETE" }),
//   setAuthToken,
//   getAuthToken,
// };

// export default api;
