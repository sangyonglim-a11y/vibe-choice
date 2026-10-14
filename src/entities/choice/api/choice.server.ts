import { connection } from "next/server";
import { createClient as createServerClient } from "@/shared/api/supabase/server";
import type { Choice, FeedSort } from "../model/types";
import {
  gameDetailSelect,
  mapGameToChoice,
  sortChoices,
  type GameListRow,
} from "./mapper";

export async function getChoiceByIdServer(id: string) {
  const supabase = await createServerClient();
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

export async function getChoiceDetailServer(id: string): Promise<Choice | null> {
  await connection();
  const supabase = await createServerClient();
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

export async function getFeedChoices(sort: FeedSort = "latest") {
  await connection();

  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("games")
    .select(gameDetailSelect)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const choices = ((data ?? []) as unknown as GameListRow[]).map(
    mapGameToChoice,
  );
  return sortChoices(choices, sort);
}
