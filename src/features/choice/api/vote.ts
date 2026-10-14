import { createBrowserClient } from "@/shared/api";
import { resolveVoterIdentity } from "@/shared/lib";
import type { VoteOption } from "../model/types";

async function getVoterIdentity(preferredUserId?: string | null) {
  const supabase = createBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return resolveVoterIdentity(user?.id ?? preferredUserId);
}

export async function voteChoice(input: {
  gameId: string;
  choice: VoteOption;
  userId?: string | null;
}) {
  const supabase = createBrowserClient();
  const identity = await getVoterIdentity(input.userId);

  const existing = await supabase
    .from("votes")
    .select("id, choice")
    .eq("game_id", input.gameId)
    .eq("voter_key", identity.voterKey)
    .maybeSingle();

  if (existing.error) {
    throw existing.error;
  }

  if (existing.data) {
    return {
      alreadyVoted: true as const,
      choice: existing.data.choice as VoteOption,
    };
  }

  const { data, error } = await supabase
    .from("votes")
    .insert({
      game_id: input.gameId,
      user_id: identity.userId,
      voter_key: identity.voterKey,
      choice: input.choice,
    })
    .select("choice")
    .single();

  if (error) {
    if (error.code === "23505") {
      const raced = await supabase
        .from("votes")
        .select("choice")
        .eq("game_id", input.gameId)
        .eq("voter_key", identity.voterKey)
        .maybeSingle();

      if (raced.data?.choice === "A" || raced.data?.choice === "B") {
        return {
          alreadyVoted: true as const,
          choice: raced.data.choice as VoteOption,
        };
      }
    }
    throw error;
  }

  return {
    alreadyVoted: false as const,
    choice: data.choice as VoteOption,
  };
}

export async function fetchMyVoteForGame(input: {
  gameId: string;
  userId?: string | null;
}) {
  const supabase = createBrowserClient();
  const identity = await getVoterIdentity(input.userId);

  const { data, error } = await supabase
    .from("votes")
    .select("choice")
    .eq("game_id", input.gameId)
    .eq("voter_key", identity.voterKey)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (data?.choice === "A" || data?.choice === "B") {
    return data.choice as VoteOption;
  }

  return null;
}
