"use client";

import { useState, type FormEvent } from "react";
import { toFriendlyErrorMessage } from "@/shared/lib";
import type { Comment } from "../model/types";

type CommentItemProps = {
  comment: Comment;
  isOwner: boolean;
  onUpdated: (comment: Comment) => void;
  onDeleted: (commentId: string) => void;
  onUpdate: (id: string, content: string) => Promise<Comment>;
  onDelete: (id: string) => Promise<void>;
};

function formatCommentTime(iso: string) {
  try {
    return new Intl.DateTimeFormat("ko-KR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function CommentItem({
  comment,
  isOwner,
  onUpdated,
  onDeleted,
  onUpdate,
  onDelete,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const initial = comment.authorName.trim().charAt(0).toUpperCase() || "?";
  const wasEdited = comment.updatedAt !== comment.createdAt;

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) {
      setErrorMessage("댓글 내용을 입력해 주세요.");
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const updated = await onUpdate(comment.id, trimmed);
      onUpdated(updated);
      setIsEditing(false);
    } catch (error) {
      console.error("[CommentItem] update failed", error);
      setErrorMessage(
        toFriendlyErrorMessage(
          error,
          "댓글을 수정하지 못했어요. 잠시 후 다시 시도해 주세요.",
        ),
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("이 댓글을 삭제할까요?")) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage(null);

    try {
      await onDelete(comment.id);
      onDeleted(comment.id);
    } catch (error) {
      console.error("[CommentItem] delete failed", error);
      setErrorMessage(
        toFriendlyErrorMessage(
          error,
          "댓글을 삭제하지 못했어요. 잠시 후 다시 시도해 주세요.",
        ),
      );
      setIsDeleting(false);
    }
  }

  return (
    <article className="border-b border-[color:var(--border)] py-4 last:border-b-0">
      <div className="flex items-start gap-3">
        <div
          aria-hidden
          className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[color:var(--surface-muted)] bg-cover bg-center text-sm font-semibold text-[color:var(--foreground)]"
          style={
            comment.authorAvatarUrl
              ? { backgroundImage: `url(${comment.authorAvatarUrl})` }
              : undefined
          }
        >
          {comment.authorAvatarUrl ? null : initial}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <p className="text-sm font-semibold text-[color:var(--foreground)]">
              {comment.authorName}
            </p>
            <time
              dateTime={comment.createdAt}
              className="text-xs text-[color:var(--muted)]"
            >
              {formatCommentTime(comment.createdAt)}
              {wasEdited ? " · 수정됨" : ""}
            </time>
          </div>

          {isEditing ? (
            <form onSubmit={handleSave} className="mt-2 space-y-2">
              <textarea
                value={draft}
                onChange={(event) => {
                  setDraft(event.target.value);
                  setErrorMessage(null);
                }}
                rows={3}
                disabled={isSaving}
                className="w-full resize-y rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-sm outline-none focus:border-[color:var(--border-strong)]"
              />
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-[color:var(--foreground)] px-3 py-2 text-sm font-semibold text-white touch-manipulation disabled:opacity-50 sm:min-h-0 sm:flex-none sm:rounded-lg sm:py-1.5 sm:text-xs"
                >
                  {isSaving ? "저장 중..." : "저장"}
                </button>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => {
                    setIsEditing(false);
                    setDraft(comment.content);
                    setErrorMessage(null);
                  }}
                  className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl px-3 py-2 text-sm font-medium text-[color:var(--muted)] touch-manipulation hover:text-[color:var(--foreground)] sm:min-h-0 sm:flex-none sm:rounded-lg sm:py-1.5 sm:text-xs"
                >
                  취소
                </button>
              </div>
            </form>
          ) : (
            <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-[color:var(--foreground)]">
              {comment.content}
            </p>
          )}

          {errorMessage ? (
            <p role="alert" className="mt-2 text-sm text-red-600">
              {errorMessage}
            </p>
          ) : null}

          {isOwner && !isEditing ? (
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setDraft(comment.content);
                  setIsEditing(true);
                  setErrorMessage(null);
                }}
                className="inline-flex min-h-10 items-center rounded-lg px-3 py-2 text-sm font-medium text-[color:var(--muted)] touch-manipulation transition-colors hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--foreground)] sm:min-h-0 sm:px-0 sm:py-0 sm:text-xs sm:hover:bg-transparent"
              >
                수정
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => {
                  void handleDelete();
                }}
                className="inline-flex min-h-10 items-center rounded-lg px-3 py-2 text-sm font-medium text-[color:var(--muted)] touch-manipulation transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50 sm:min-h-0 sm:px-0 sm:py-0 sm:text-xs sm:hover:bg-transparent"
              >
                {isDeleting ? "삭제 중..." : "삭제"}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
