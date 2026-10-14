import { createBrowserClient } from "@/shared/api";
import type { Comment } from "../model/types";
import { commentSelect, mapCommentRow, type CommentRow } from "./mapper";

export async function getCommentsByChoiceId(
  choiceId: string,
): Promise<Comment[]> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("comments")
    .select(commentSelect)
    .eq("game_id", choiceId)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return ((data ?? []) as CommentRow[]).map(mapCommentRow);
}
