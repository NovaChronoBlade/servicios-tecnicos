"use client";

import { useCallback } from "react";
import { loginRequest } from "../services/auth.service";
import { useAuthStore } from "../store/authStore";

export function useAuth() {
  const store = useAuthStore();

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await loginRequest({ email, password });
      const currentUser = res.user ?? res.usuario;

      if (!currentUser) {
        throw new Error("El backend no devolvio los datos del usuario.");
      }

      store.setAuth(res.token, currentUser);
      return res;
    },
    [store]
  );

  const logout = useCallback(() => store.logout(), [store]);

  return {
    ...store,
    login,
    logout,
  };
}
