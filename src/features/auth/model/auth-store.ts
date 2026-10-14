"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { hasNickname, type User } from "@/entities/auth";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  needsNickname: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setNickname: (nickname: string) => void;
  setLoading: (isLoading: boolean) => void;
  clear: () => void;
};

const noopStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      needsNickname: false,
      isLoading: true,
      setUser: (user) =>
        set({
          user,
          isAuthenticated: Boolean(user),
          needsNickname: Boolean(user) && !hasNickname(user),
          isLoading: false,
        }),
      setNickname: (nickname) =>
        set((state) => {
          if (!state.user) return state;
          const nextUser = { ...state.user, nickname };
          return {
            user: nextUser,
            isAuthenticated: true,
            needsNickname: !hasNickname(nextUser),
          };
        }),
      setLoading: (isLoading) => set({ isLoading }),
      clear: () =>
        set({
          user: null,
          isAuthenticated: false,
          needsNickname: false,
          isLoading: false,
        }),
    }),
    {
      name: "vibe-choice-auth",
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? noopStorage : localStorage,
      ),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        needsNickname: state.needsNickname,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        // Keep loading true until AuthProvider syncs; recompute nickname flag.
        useAuthStore.setState({
          needsNickname: Boolean(state.user) && !hasNickname(state.user),
          isLoading: true,
        });
      },
    },
  ),
);
