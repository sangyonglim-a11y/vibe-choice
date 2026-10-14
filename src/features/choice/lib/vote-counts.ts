import type { Choice, VoteOption } from "@/entities/choice/model/types";

export function applyVoteCountDelta(
  choice: Choice,
  payload: {
    eventType: "INSERT" | "UPDATE" | "DELETE";
    choice: VoteOption | null;
    oldChoice: VoteOption | null;
  },
): Choice {
  let voteA = choice.optionA.voteCount;
  let voteB = choice.optionB.voteCount;

  const bump = (side: VoteOption, delta: number) => {
    if (side === "A") voteA = Math.max(0, voteA + delta);
    else voteB = Math.max(0, voteB + delta);
  };

  if (payload.eventType === "INSERT" && payload.choice) {
    bump(payload.choice, 1);
  } else if (payload.eventType === "DELETE" && payload.oldChoice) {
    bump(payload.oldChoice, -1);
  } else if (
    payload.eventType === "UPDATE" &&
    payload.choice &&
    payload.oldChoice &&
    payload.choice !== payload.oldChoice
  ) {
    bump(payload.oldChoice, -1);
    bump(payload.choice, 1);
  }

  return {
    ...choice,
    optionA: { ...choice.optionA, voteCount: voteA },
    optionB: { ...choice.optionB, voteCount: voteB },
  };
}
