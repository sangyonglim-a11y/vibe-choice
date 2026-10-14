"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChoiceCard } from "@/entities/choice";
import type { Choice } from "@/entities/choice";
import { applyVoteCountDelta } from "@/features/choice/lib/vote-counts";
import { useVotesRealtime } from "@/features/choice/lib/use-votes-realtime";

type ChoiceFeedProps = {
  choices: Choice[];
};

export function ChoiceFeed({ choices: initialChoices }: ChoiceFeedProps) {
  const [choices, setChoices] = useState(initialChoices);

  useEffect(() => {
    setChoices(initialChoices);
  }, [initialChoices]);

  useVotesRealtime({
    onChange: (payload) => {
      setChoices((prev) =>
        prev.map((choice) =>
          choice.id === payload.gameId
            ? applyVoteCountDelta(choice, payload)
            : choice,
        ),
      );
    },
  });

  if (choices.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-[color:var(--border)] px-6 py-16 text-center">
        <p className="font-[family-name:var(--font-display)] text-xl font-semibold leading-snug sm:text-2xl">
          아직 게임이 없어요. 첫 번째 게임을 만들어 보세요!
        </p>
        <Link
          href="/choices/new"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-[color:var(--foreground)] px-5 py-2.5 text-sm font-semibold text-white touch-manipulation transition-transform hover:-translate-y-0.5"
        >
          첫 게임 만들기
        </Link>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-4 sm:gap-5">
      {choices.map((choice, index) => (
        <li key={choice.id}>
          <ChoiceCard choice={choice} index={index} />
        </li>
      ))}
    </ul>
  );
}
