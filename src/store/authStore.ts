import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "../lib/authApi";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  pendingVerificationEmail: string | null;
  isAuthenticated: boolean;
  setAuth: (payload: {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
  }) => void;
  clearAuth: () => void;
  setPendingVerificationEmail: (email: string | null) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      pendingVerificationEmail: null,
      isAuthenticated: false,
      setAuth: ({ accessToken, refreshToken, user }) =>
        set({
          accessToken,
          refreshToken,
          user,
          isAuthenticated: true,
        }),
      clearAuth: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        }),
      setPendingVerificationEmail: (email) =>
        set({ pendingVerificationEmail: email }),
    }),
    {
      name: "medbook-auth",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
