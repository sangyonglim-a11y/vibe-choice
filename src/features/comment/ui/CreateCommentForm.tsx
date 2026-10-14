"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { Comment } from "@/entities/comment";
import { useAuthStore } from "@/features/auth";
import { toFriendlyErrorMessage } from "@/shared/lib";
import { createComment } from "../api/comment";

type CreateCommentFormProps = {
  gameId: string;
  onCreated: (comment: Comment) => void;
};

export function CreateCommentForm({
  gameId,
  onCreated,
}: CreateCommentFormProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function redirectToLogin() {
    const next = `${window.location.pathname}${window.location.search}`;
    router.push(`/auth/login?next=${encodeURIComponent(next)}`);
  }

  function requireAuth() {
    if (isLoading) return false;
    if (!isAuthenticated || !user?.id) {
      redirectToLogin();
      return false;
    }
    return true;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!requireAuth()) return;

    const trimmed = content.trim();
    if (!trimmed) {
      setErrorMessage("댓글 내용을 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const comment = await createComment({
        gameId,
        authorId: user!.id,
        content: trimmed,
      });
      onCreated(comment);
      setContent("");
    } catch (error) {
      console.error("[CreateCommentForm] create failed", error);
      setErrorMessage(
        toFriendlyErrorMessage(
          error,
          "댓글을 남기지 못했어요. 잠시 후 다시 시도해 주세요.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label className="block">
        <span className="sr-only">댓글 작성</span>
        <textarea
          value={content}
          onChange={(event) => {
            setContent(event.target.value);
            setErrorMessage(null);
          }}
          onFocus={() => {
            if (!isLoading && !isAuthenticated) {
              redirectToLogin();
            }
          }}
          rows={3}
          placeholder={
            isAuthenticated
              ? "이 게임에 대한 의견을 남겨보세요"
              : "로그인 후 댓글을 작성할 수 있어요"
          }
          disabled={isSubmitting}
          className="w-full resize-y rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-sm leading-relaxed text-[color:var(--foreground)] outline-none transition-[border-color,box-shadow] placeholder:text-[color:var(--muted)] focus:border-[color:var(--border-strong)] focus:shadow-[0_0_0_3px_rgba(26,166,166,0.12)] disabled:opacity-60"
        />
      </label>

      {errorMessage ? (
        <p role="alert" className="text-sm text-red-600">
          {errorMessage}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="order-2 text-xs text-[color:var(--muted)] sm:order-1">
          {isAuthenticated
            ? `${user?.nickname?.trim() || "회원"}으로 작성됩니다`
            : "댓글 작성은 로그인이 필요합니다"}
        </p>
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="order-1 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[color:var(--foreground)] px-4 py-2.5 text-sm font-semibold text-white touch-manipulation transition-opacity disabled:opacity-50 sm:order-2 sm:w-auto"
        >
          {isSubmitting ? "등록 중..." : "댓글 등록"}
        </button>
      </div>
    </form>
  );
}
