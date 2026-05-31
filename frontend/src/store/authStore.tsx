'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { UserRole } from '@/types/user.types';
import { setAuthToken } from '@/services/api';

// ── Tipos ─────────────────────────────────────────────────

export interface AuthUser {
  id_usuario: string;
  nombre: string;
  correo: string;
  rol: UserRole; // ← solo "rol", no "role"
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
}

interface AuthContextType extends AuthState {
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
}

// ── Keys ──────────────────────────────────────────────────
const TOKEN_KEY = 'auth.token' as const;
const USER_KEY = 'auth.user' as const;

// ── Helpers ───────────────────────────────────────────────
function isValidUser(user: unknown): user is AuthUser {
  if (!user || typeof user !== 'object') return false;
  const u = user as Record<string, unknown>;
  return (
    typeof u.id_usuario === 'string' &&
    typeof u.nombre === 'string' &&
    typeof u.correo === 'string' &&
    Object.values(UserRole).includes(u.rol as UserRole)
  );
}

function loadFromStorage(): { token: string; user: AuthUser } | null {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const raw = localStorage.getItem(USER_KEY);
    if (!token || !raw) return null;

    const user = JSON.parse(raw);
    if (!isValidUser(user)) return null;

    return { token, user };
  } catch {
    return null;
  }
}

function persistAuth(token: string, user: AuthUser) {
  setAuthToken(token);
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearStorage() {
  setAuthToken(null);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// ── Context ───────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Provider ──────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    token: null,
    user: null,
    isAuthenticated: false,
    isHydrated: false,
  });

  // Hidratación inicial
  useEffect(() => {
    const saved = loadFromStorage();

    setState(
      saved
        ? {
            token: saved.token,
            user: saved.user,
            isAuthenticated: true,
            isHydrated: true,
          }
        : { token: null, user: null, isAuthenticated: false, isHydrated: true },
    );

    if (saved) {
      setAuthToken(saved.token);
    } else {
      clearStorage();
    }
  }, []);

  const setAuth = useCallback((token: string, user: AuthUser) => {
    persistAuth(token, user);
    setState({ token, user, isAuthenticated: true, isHydrated: true });
  }, []);

  const logout = useCallback(() => {
    clearStorage();
    setState({
      token: null,
      user: null,
      isAuthenticated: false,
      isHydrated: true,
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────
export function useAuthStore() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthStore must be used within <AuthProvider>');
  return ctx;
}
