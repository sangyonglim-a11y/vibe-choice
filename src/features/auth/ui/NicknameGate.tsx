"use client";

import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, type PropsWithChildren } from "react";
import { useAuthStore } from "../model/auth-store";

const NICKNAME_SETUP_PATH = "/auth/nickname";
const AUTH_EXEMPT_PREFIXES = ["/auth/login", "/auth/callback", "/auth/signup"];

function NicknameGateRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const needsNickname = useAuthStore((state) => state.needsNickname);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    if (isLoading) return;

    const isExempt = AUTH_EXEMPT_PREFIXES.some((path) =>
      pathname.startsWith(path),
    );
    const isNicknamePage = pathname.startsWith(NICKNAME_SETUP_PATH);

    if (isAuthenticated && needsNickname && !isNicknamePage && !isExempt) {
      router.replace(NICKNAME_SETUP_PATH);
      return;
    }

    if (isAuthenticated && !needsNickname && isNicknamePage) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, needsNickname, pathname, router]);

  return null;
}

export function NicknameGate({ children }: PropsWithChildren) {
  return (
    <>
      <Suspense fallback={null}>
        <NicknameGateRedirect />
      </Suspense>
      {children}
    </>
  );
}
