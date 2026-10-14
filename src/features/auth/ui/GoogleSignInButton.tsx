"use client";

import { useState } from "react";
import { signInWithGoogle } from "../api/auth";

type GoogleSignInButtonProps = {
  nextPath?: string;
};

export function GoogleSignInButton({ nextPath = "/" }: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleClick() {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      await signInWithGoogle(nextPath);
    } catch (error) {
      console.error("[GoogleSignInButton] login failed", error);
      setErrorMessage(
        "Google 로그인을 완료하지 못했어요. 잠시 후 다시 시도해 주세요.",
      );
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      {errorMessage ? (
        <p role="alert" className="text-sm text-red-600">
          {errorMessage}
        </p>
      ) : null}
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[color:var(--foreground)] px-4 py-3.5 text-sm font-semibold text-white transition-[transform,opacity] hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Google 연결 중...
          </>
        ) : (
          "Google로 로그인"
        )}
      </button>
    </div>
  );
}
