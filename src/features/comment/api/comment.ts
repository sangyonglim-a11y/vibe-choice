import { createBrowserClient } from "@/shared/api";
import {
  commentSelect,
  mapCommentRow,
  type CommentRow,
} from "@/entities/comment/api/mapper";
import type { Comment } from "@/entities/comment";

export type CreateCommentInput = {
  gameId: string;
  authorId: string;
  content: string;
};

export type UpdateCommentInput = {
  id: string;
  content: string;
};

export async function createComment(
  input: CreateCommentInput,
): Promise<Comment> {
  const content = input.content.trim();
  if (!content) {
    throw new Error("댓글 내용을 입력해 주세요.");
  }

  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("comments")
    .insert({
      game_id: input.gameId,
      author_id: input.authorId,
      content,
    })
    .select(commentSelect)
    .single();

  if (error) {
    throw error;
  }

  return mapCommentRow(data as CommentRow);
}

export async function updateComment(
  input: UpdateCommentInput,
): Promise<Comment> {
  const content = input.content.trim();
  if (!content) {
    throw new Error("댓글 내용을 입력해 주세요.");
  }

  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("comments")
    .update({
      content,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.id)
    .select(commentSelect)
    .single();

  if (error) {
    throw error;
  }

  return mapCommentRow(data as CommentRow);
}

export async function deleteComment(id: string): Promise<void> {
  const supabase = createBrowserClient();
  const { error } = await supabase.from("comments").delete().eq("id", id);

  if (error) {
    throw error;
  }
}
