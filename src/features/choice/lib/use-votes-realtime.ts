"use client";

import { useEffect, useRef } from "react";
import { createBrowserClient } from "@/shared/api";
import type { VoteOption } from "../model/types";

export type VoteChangePayload = {
  eventType: "INSERT" | "UPDATE" | "DELETE";
  gameId: string;
  choice: VoteOption | null;
  oldChoice: VoteOption | null;
};

type UseVotesRealtimeOptions = {
  gameId?: string;
  onChange: (payload: VoteChangePayload) => void;
};

function asVoteOption(value: unknown): VoteOption | null {
  return value === "A" || value === "B" ? value : null;
}

export function useVotesRealtime({ gameId, onChange }: UseVotesRealtimeOptions) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    const supabase = createBrowserClient();
    const channelName = gameId ? `votes-game-${gameId}` : "votes-feed";

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "votes",
          ...(gameId ? { filter: `game_id=eq.${gameId}` } : {}),
        },
        (payload) => {
          const nextRow = payload.new as { game_id?: string; choice?: string };
          const prevRow = payload.old as { game_id?: string; choice?: string };
          const resolvedGameId = nextRow.game_id ?? prevRow.game_id;
          if (!resolvedGameId) return;

          onChangeRef.current({
            eventType: payload.eventType as VoteChangePayload["eventType"],
            gameId: resolvedGameId,
            choice: asVoteOption(nextRow.choice),
            oldChoice: asVoteOption(prevRow.choice),
          });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [gameId]);
}
