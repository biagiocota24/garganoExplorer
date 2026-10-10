import { create } from "zustand";
import type { LoginRequest, User } from "../api/auth";
import * as auth from "../api/auth";

type AuthStatus = "loading" | "authenticated" | "anonymous";

type AuthState = {
  user: User | null;
  status: AuthStatus;
  loadCurrentUser: () => Promise<void>;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  status: "loading",

  loadCurrentUser: async () => {
    try {
      const user = await auth.getCurrentUser();
      set({ user, status: "authenticated" });
    } catch {
      set({ user: null, status: "anonymous" });
    }
  },

  login: async (data: LoginRequest) => {
    const user = await auth.login(data);
    set({
      user,
      status: "authenticated",
    });
  },
  logout: async () => {
    try {
      await auth.logout();
    } finally {
      set({
        user: null,
        status: "anonymous",
      });
    }
  },
}));
