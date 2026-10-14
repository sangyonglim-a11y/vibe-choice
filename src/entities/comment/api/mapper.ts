import type { Comment } from "../model/types";

export type CommentRow = {
  id: string;
  game_id: string;
  author_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  author: {
    nickname: string | null;
    avatar_url: string | null;
  } | null;
};

export const commentSelect = `
  id,
  game_id,
  author_id,
  content,
  created_at,
  updated_at,
  author:profiles!comments_author_id_fkey(nickname, avatar_url)
`;

export function mapCommentRow(row: CommentRow): Comment {
  return {
    id: row.id,
    choiceId: row.game_id,
    authorId: row.author_id,
    authorName: row.author?.nickname?.trim() || "익명",
    authorAvatarUrl: row.author?.avatar_url ?? null,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
