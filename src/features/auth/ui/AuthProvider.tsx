"use client";

import { useEffect } from "react";
import type { PropsWithChildren } from "react";
import { syncProfileFromAuthUser } from "@/entities/auth";
import { createBrowserClient } from "@/shared/api";
import { useAuthStore } from "../model/auth-store";

export function AuthProvider({ children }: PropsWithChildren) {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const clear = useAuthStore((state) => state.clear);

  useEffect(() => {
    const supabase = createBrowserClient();
    let isMounted = true;

    async function applyAuthUser(userId: string | undefined) {
      if (!userId) {
        if (isMounted) clear();
        return;
      }

      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (!isMounted) return;

        if (error || !user) {
          clear();
          return;
        }

        const profileUser = await syncProfileFromAuthUser(user);
        if (!isMounted) return;
        setUser(profileUser);
      } catch (error) {
        console.error("[AuthProvider] failed to sync session", error);
        if (isMounted) clear();
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    setLoading(true);

    void supabase.auth.getSession().then(({ data: { session } }) => {
      void applyAuthUser(session?.user?.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // Defer Supabase calls to avoid auth lock deadlocks.
      setTimeout(() => {
        if (event === "SIGNED_OUT") {
          clear();
          return;
        }

        void applyAuthUser(session?.user?.id);
      }, 0);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [clear, setLoading, setUser]);

  return children;
}
