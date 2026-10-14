"use client";

import { useEffect, useState } from "react";
import type { Comment } from "@/entities/comment";
import { CommentItem } from "@/entities/comment";
import { useAuthStore } from "@/features/auth";
import {
  CreateCommentForm,
  deleteComment,
  updateComment,
} from "@/features/comment";

type CommentSectionProps = {
  gameId: string;
  initialComments: Comment[];
};

export function CommentSection({
  gameId,
  initialComments,
}: CommentSectionProps) {
  const user = useAuthStore((state) => state.user);
  const [comments, setComments] = useState(initialComments);

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  function handleCreated(comment: Comment) {
    setComments((prev) => [...prev, comment]);
  }

  function handleUpdated(comment: Comment) {
    setComments((prev) =>
      prev.map((item) => (item.id === comment.id ? comment : item)),
    );
  }

  function handleDeleted(commentId: string) {
    setComments((prev) => prev.filter((item) => item.id !== commentId));
  }

  async function handleUpdate(id: string, content: string) {
    return updateComment({ id, content });
  }

  return (
    <section className="space-y-5 border-t border-[color:var(--border)] pt-8">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
          댓글
        </h2>
        <p className="mt-1 text-sm text-[color:var(--muted)]">
          {comments.length}개의 의견
        </p>
      </div>

      <CreateCommentForm gameId={gameId} onCreated={handleCreated} />

      {comments.length === 0 ? (
        <p className="py-6 text-sm text-[color:var(--muted)]">
          아직 댓글이 없습니다. 첫 의견을 남겨보세요.
        </p>
      ) : (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <CommentItem
                comment={comment}
                isOwner={Boolean(user?.id && user.id === comment.authorId)}
                onUpdated={handleUpdated}
                onDeleted={handleDeleted}
                onUpdate={handleUpdate}
                onDelete={deleteComment}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
