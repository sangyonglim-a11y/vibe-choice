"use client";

import { useState, type FormEvent } from "react";
import { updateNickname } from "@/entities/auth";
import { toFriendlyErrorMessage } from "@/shared/lib";
import { useAuthStore } from "../model/auth-store";
import { validateNickname } from "../model/nickname";

type NicknameFormProps = {
  initialNickname?: string;
  submitLabel?: string;
  onSuccess?: (nickname: string) => void;
};

export function NicknameForm({
  initialNickname = "",
  submitLabel = "저장",
  onSuccess,
}: NicknameFormProps) {
  const user = useAuthStore((state) => state.user);
  const setNickname = useAuthStore((state) => state.setNickname);
  const [nickname, setNicknameInput] = useState(initialNickname);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      setErrorMessage("로그인이 필요합니다.");
      return;
    }

    const validationError = validateNickname(nickname);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const trimmed = nickname.trim();
      const updated = await updateNickname(user.id, trimmed);
      setNickname(updated.nickname ?? trimmed);
      onSuccess?.(updated.nickname ?? trimmed);
    } catch (error) {
      console.error("[NicknameForm] update failed", error);
      setErrorMessage(
        toFriendlyErrorMessage(
          error,
          "닉네임을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const fieldClassName =
    "w-full rounded-xl border border-[color:var(--border-strong)] bg-white px-3.5 py-3 text-sm text-[color:var(--foreground)] outline-none transition-[border-color,box-shadow] placeholder:text-[color:var(--muted)] focus:border-[color:var(--foreground)] focus:shadow-[0_0_0_3px_rgba(18,24,22,0.08)]";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {errorMessage ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorMessage}
        </div>
      ) : null}

      <div className="space-y-2">
        <label
          htmlFor="nickname"
          className="text-sm font-medium text-[color:var(--foreground)]"
        >
          닉네임 <span className="text-[color:var(--option-a)]">*</span>
        </label>
        <input
          id="nickname"
          type="text"
          value={nickname}
          onChange={(event) => {
            setNicknameInput(event.target.value);
            setErrorMessage(null);
          }}
          placeholder="예: 바이브초이스"
          maxLength={20}
          className={fieldClassName}
          disabled={isSubmitting}
          autoFocus
        />
        <p className="text-xs text-[color:var(--muted)]">
          2~20자, 다른 사용자와 겹치지 않는 이름으로 설정해 주세요.
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[color:var(--foreground)] px-4 py-3.5 text-sm font-semibold text-white transition-[transform,opacity] hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            저장 중...
          </>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
}
