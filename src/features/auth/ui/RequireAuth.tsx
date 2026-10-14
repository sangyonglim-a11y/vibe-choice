"use client";

import { useRouter } from "next/navigation";
import { useEffect, type PropsWithChildren } from "react";
import { useAuthStore } from "../model/auth-store";

type RequireAuthProps = PropsWithChildren<{
  redirectTo?: string;
}>;

export function RequireAuth({
  children,
  redirectTo = "/auth/login",
}: RequireAuthProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const next = `${redirectTo}?next=${encodeURIComponent(window.location.pathname)}`;
      router.replace(next);
    }
  }, [isAuthenticated, isLoading, redirectTo, router]);

  if (isLoading) {
    return (
      <p className="text-sm text-[color:var(--muted)]">로그인 상태 확인 중...</p>
    );
  }

  if (!isAuthenticated) {
    return (
      <p className="text-sm text-[color:var(--muted)]">로그인 페이지로 이동 중...</p>
    );
  }

  return children;
}
