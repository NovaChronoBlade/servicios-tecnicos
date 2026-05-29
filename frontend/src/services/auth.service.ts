import { api, setAuthToken } from "./api";
import axios from "axios";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
} from "../types/auth.types";
import { AUTH_ENDPOINTS } from "../constants/auth.constants";

function normalizeAuthResponse(response: AuthResponse): AuthResponse {
  return {
    ...response,
    user: response.user ?? response.usuario,
    usuario: response.usuario ?? response.user,
  };
}

export type AuthFieldErrorMap = Partial<
  Record<
    | "email"
    | "password"
    | "nombre"
    | "correo"
    | "contrasena"
    | "telefono"
    | "documento"
    | "fecha_nacimiento"
    | "rol",
    string
  >
>;

function extractBackendMessages(data: unknown) {
  const messages: string[] = [];

  if (!data || typeof data !== "object") return null;

  const payload = data as Record<string, unknown>;

  if (typeof payload.message === "string" && payload.message.trim()) {
    messages.push(payload.message.trim());
  }

  if (typeof payload.error === "string" && payload.error.trim()) {
    messages.push(payload.error.trim());
  }

  if (Array.isArray(payload.error)) {
    for (const entry of payload.error) {
      if (typeof entry === "string" && entry.trim()) {
        messages.push(entry.trim());
      } else if (entry && typeof entry === "object") {
        const entryObject = entry as Record<string, unknown>;
        if (typeof entryObject.message === "string" && entryObject.message.trim()) {
          messages.push(entryObject.message.trim());
        }
      }
    }
  }

  if (Array.isArray(payload.errors)) {
    for (const entry of payload.errors) {
      if (typeof entry === "string" && entry.trim()) {
        messages.push(entry.trim());
      } else if (entry && typeof entry === "object") {
        const entryObject = entry as Record<string, unknown>;
        if (typeof entryObject.message === "string" && entryObject.message.trim()) {
          messages.push(entryObject.message.trim());
        }
      }
    }
  }

  return messages;
}

function inferFieldFromMessage(message: string): keyof AuthFieldErrorMap | null {
  const normalized = message.toLowerCase();

  if (normalized.includes("password") || normalized.includes("contrase") || normalized.includes("contrasena")) {
    return normalized.includes("password") ? "password" : "contrasena";
  }

  if (normalized.includes("correo") || normalized.includes("email")) {
    return normalized.includes("correo") ? "correo" : "email";
  }

  if (normalized.includes("document")) return "documento";
  if (normalized.includes("telefono") || normalized.includes("teléfono")) return "telefono";
  if (normalized.includes("nombre")) return "nombre";
  if (normalized.includes("fecha")) return "fecha_nacimiento";
  if (normalized.includes("rol")) return "rol";

  return null;
}

export function getAuthErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const backendMessages = extractBackendMessages(error.response?.data);
    if (backendMessages && backendMessages.length > 0) {
      return backendMessages.join(". ");
    }

    if (typeof error.message === "string" && error.message.trim()) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}

export function getAuthFieldErrors(error: unknown): AuthFieldErrorMap {
  const fieldErrors: AuthFieldErrorMap = {};

  if (!axios.isAxiosError(error)) {
    return fieldErrors;
  }

  const backendMessages = extractBackendMessages(error.response?.data);
  if (!backendMessages) return fieldErrors;

  for (const message of backendMessages) {
    const field = inferFieldFromMessage(message);
    if (field && !fieldErrors[field]) {
      fieldErrors[field] = message;
    }
  }

  return fieldErrors;
}

export async function loginRequest(credentials: LoginRequest): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, credentials);
  if (data?.token) setAuthToken(data.token);
  return normalizeAuthResponse(data);
}

export function saveToken(token: string) {
  try {
    setAuthToken(token);
  } catch (e) {}
}

export function clearToken() {
  try {
    setAuthToken(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("auth.user");
      document.cookie = "auth.token=; path=/; max-age=0; samesite=lax";
      document.cookie = "auth.role=; path=/; max-age=0; samesite=lax";
      document.cookie = "auth.user=; path=/; max-age=0; samesite=lax";
    }
  } catch (e) {}
}

export async function refreshToken(): Promise<AuthResponse> {
  try {
    const { data } = await api.post<AuthResponse>("/auth/refresh");
    if (data?.token) setAuthToken(data.token);
    return normalizeAuthResponse(data);
  } catch (e) {
    throw e;
  }
}

export async function logoutRequest(): Promise<void> {
  try {
    await api.post(AUTH_ENDPOINTS.LOGOUT);
  } catch (e) {
    // ignore
  }
  clearToken();
}

export async function registerRequest(
  payload: RegisterRequest,
): Promise<RegisterResponse> {
  const { data } = await api.post<RegisterResponse>(AUTH_ENDPOINTS.REGISTER, payload);

  if (data?.token) {
    setAuthToken(data.token);
  }

  return normalizeAuthResponse(data);
}
