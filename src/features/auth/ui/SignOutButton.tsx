"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signOut } from "../api/auth";

type SignOutButtonProps = {
  redirectTo?: string;
};

export function SignOutButton({ redirectTo = "/" }: SignOutButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    setIsLoading(true);

    try {
      await signOut();
      router.replace(redirectTo);
      router.refresh();
    } catch (error) {
      console.error("[SignOutButton] logout failed", error);
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[color:var(--border-strong)] bg-white px-3 py-2 text-sm font-medium touch-manipulation transition-colors hover:bg-[color:var(--surface-muted)] disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-0 sm:px-3.5"
    >
      {isLoading ? "로그아웃 중..." : "로그아웃"}
    </button>
  );
}
