"use client";

import { useCallback } from "react";
import { loginRequest } from "../services/auth.service";
import { useAuthStore } from "../store/authStore";
import { UserRole } from "../types/user.types";

function isClientRole(role?: string | null) {
  return role === UserRole.CLIENTE;
}

export function useAuth() {
  const store = useAuthStore();

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await loginRequest({ email, password });
      const currentUser = res.user ?? res.usuario ?? { email };

      if (!isClientRole(currentUser.rol)) {
        store.logout();
        throw new Error("Esta interfaz solo permite acceso para clientes.");
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
