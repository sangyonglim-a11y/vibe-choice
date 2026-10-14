"use client";

import Link from "next/link";
import { useAuthStore } from "@/features/auth";

const CREATE_PATH = "/choices/new";

export function CreateGameLink() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  const href =
    !isLoading && !isAuthenticated
      ? `/auth/login?next=${encodeURIComponent(CREATE_PATH)}`
      : CREATE_PATH;

  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[color:var(--foreground)] px-3.5 py-2 text-sm font-medium text-white touch-manipulation transition-transform duration-200 hover:-translate-y-0.5 sm:min-h-0"
    >
      만들기
    </Link>
  );
}
