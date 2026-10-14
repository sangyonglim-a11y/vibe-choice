"use client";

import Link from "next/link";
import { SignOutButton, useAuthStore } from "@/features/auth";

const navLinkClass =
  "inline-flex min-h-11 items-center justify-center rounded-xl border border-[color:var(--border-strong)] bg-white px-3 py-2 text-sm font-medium touch-manipulation transition-colors hover:bg-[color:var(--surface-muted)] sm:min-h-0 sm:px-3.5";

export function AuthNav() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const needsNickname = useAuthStore((state) => state.needsNickname);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return (
      <span className="px-2 text-xs text-[color:var(--muted)]">확인 중...</span>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Link href="/auth/login" className={navLinkClass}>
        로그인
      </Link>
    );
  }

  if (needsNickname) {
    return (
      <>
        <Link href="/auth/nickname" className={navLinkClass}>
          닉네임
        </Link>
        <SignOutButton />
      </>
    );
  }

  return (
    <>
      <Link
        href="/mypage"
        className="inline-flex max-w-20 min-h-11 items-center truncate rounded-xl px-2 py-2 text-sm font-medium text-[color:var(--muted)] touch-manipulation transition-colors hover:text-[color:var(--foreground)] sm:max-w-28 sm:min-h-0"
        title={user.nickname ?? undefined}
      >
        {user.nickname}
      </Link>
      <SignOutButton />
    </>
  );
}
