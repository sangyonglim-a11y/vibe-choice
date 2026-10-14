"use client";

import { useSearchParams } from "next/navigation";
import { SignInForm } from "./SignInForm";

export function LoginFormSection() {
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/";
  const hasError = searchParams.get("error") === "oauth_callback";

  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-[0_18px_40px_-32px_rgba(18,24,22,0.35)] sm:p-8">
      {hasError ? (
        <p
          role="alert"
          className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          로그인 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.
        </p>
      ) : null}
      <SignInForm nextPath={nextPath} />
    </div>
  );
}
