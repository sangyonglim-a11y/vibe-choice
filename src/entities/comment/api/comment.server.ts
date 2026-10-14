import { createClient } from "@/shared/api/supabase/server";
import type { Comment } from "../model/types";
import { commentSelect, mapCommentRow, type CommentRow } from "./mapper";

export async function getCommentsByChoiceIdServer(
  choiceId: string,
): Promise<Comment[]> {
  const supabase = await createClient();
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
