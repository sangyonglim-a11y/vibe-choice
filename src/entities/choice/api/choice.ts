import { createBrowserClient } from "@/shared/api";
import type { Choice, VoteOption } from "../model/types";
import {
  gameDetailSelect,
  mapGameToChoice,
  type GameListRow,
  type GameRow,
} from "./mapper";

export type { GameRow } from "./mapper";
export { mapGameToChoice } from "./mapper";

export async function getChoiceById(id: string) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("games")
    .select(
      "id, author_id, title, description, option_a_text, option_b_text, option_a_image_url, option_b_image_url, created_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function getChoiceDetail(id: string): Promise<Choice | null> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("games")
    .select(gameDetailSelect)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return mapGameToChoice(data as unknown as GameListRow);
}

export async function getMyVote(gameId: string, voterKey: string) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("votes")
    .select("choice")
    .eq("game_id", gameId)
    .eq("voter_key", voterKey)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (data?.choice === "A" || data?.choice === "B") {
    return data.choice as VoteOption;
  }

  return null;
}

export async function getChoiceList() {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("games")
    .select(
      "id, author_id, title, description, option_a_text, option_b_text, option_a_image_url, option_b_image_url, created_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}
