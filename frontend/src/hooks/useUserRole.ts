"use client";

import { useMemo } from "react";
import { useAuthStore } from "@/store/authStore";
import { UserRole } from "@/types/user.types";

export function useUserRole() {
	const { user, isHydrated } = useAuthStore();

	const role = user?.rol ?? null;

	return useMemo(
		() => ({
			role,
			isHydrated,
			isClient: role === UserRole.CLIENTE,
			isAdmin: role === UserRole.ADMIN,
			isTechnician: role === UserRole.TECNICO,
		}),
		[isHydrated, role],
	);
}
