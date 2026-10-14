"use client";

import { useEffect, useState } from "react";
import type { Choice, VoteOption } from "@/entities/choice/model/types";
import { ChoiceOption } from "@/entities/choice/ui/ChoiceOption";
import { useAuthStore } from "@/features/auth";
import { toFriendlyErrorMessage } from "@/shared/lib";
import { applyVoteCountDelta } from "../lib/vote-counts";
import { useVotesRealtime } from "../lib/use-votes-realtime";
import { fetchMyVoteForGame, voteChoice } from "../api/vote";

type ChoiceDetailBoardProps = {
  initialChoice: Choice;
};

function formatVotes(count: number) {
  return new Intl.NumberFormat("ko-KR").format(count);
}

export function ChoiceDetailBoard({ initialChoice }: ChoiceDetailBoardProps) {
  const user = useAuthStore((state) => state.user);
  const [choice, setChoice] = useState(initialChoice);
  const [myVote, setMyVote] = useState<VoteOption | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [isLoadingVote, setIsLoadingVote] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setChoice(initialChoice);
  }, [initialChoice]);

  useEffect(() => {
    let cancelled = false;

    async function loadMyVote() {
      setIsLoadingVote(true);
      try {
        const vote = await fetchMyVoteForGame({
          gameId: initialChoice.id,
          userId: user?.id,
        });
        if (!cancelled) {
          setMyVote(vote);
        }
      } catch (error) {
        console.error("[ChoiceDetailBoard] failed to load vote", error);
      } finally {
        if (!cancelled) {
          setIsLoadingVote(false);
        }
      }
    }

    void loadMyVote();

    return () => {
      cancelled = true;
    };
  }, [initialChoice.id, user?.id]);

  useVotesRealtime({
    gameId: choice.id,
    onChange: (payload) => {
      setChoice((prev) => applyVoteCountDelta(prev, payload));
    },
  });

  async function handleVote(nextChoice: VoteOption) {
    if (myVote || isVoting || isLoadingVote) {
      return;
    }

    setIsVoting(true);
    setErrorMessage(null);

    try {
      const result = await voteChoice({
        gameId: choice.id,
        choice: nextChoice,
        userId: user?.id,
      });

      setMyVote(result.choice);
    } catch (error) {
      console.error("[ChoiceDetailBoard] vote failed", error);
      setErrorMessage(
        toFriendlyErrorMessage(
          error,
          "투표를 완료하지 못했어요. 잠시 후 다시 시도해 주세요.",
        ),
      );
    } finally {
      setIsVoting(false);
    }
  }

  const totalVotes = choice.optionA.voteCount + choice.optionB.voteCount;
  const voteSummary = `${choice.optionA.label} ${formatVotes(choice.optionA.voteCount)}표 vs ${choice.optionB.label} ${formatVotes(choice.optionB.voteCount)}표`;
  const hasVoted = Boolean(myVote);

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-[1.75rem] font-bold leading-tight tracking-tight sm:text-4xl">
          {choice.title}
        </h1>
        {choice.description ? (
          <p className="mt-2 text-sm text-[color:var(--muted)] sm:text-base">
            {choice.description}
          </p>
        ) : null}
        <p className="mt-3 text-sm font-medium leading-snug text-[color:var(--foreground)]">
          {voteSummary}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[color:var(--muted)]">
          <span>총 {formatVotes(totalVotes)}표</span>
          <span>{choice.authorName}</span>
        </div>
      </div>

      {errorMessage ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorMessage}
        </div>
      ) : null}

      <p className="text-sm text-[color:var(--muted)]">
        {isLoadingVote
          ? "투표 상태를 확인하는 중..."
          : hasVoted
            ? "이미 투표한 게임입니다. 선택한 항목에 체크가 표시됩니다."
            : "선택지를 눌러 투표하세요. 로그인 없이도 참여할 수 있습니다."}
      </p>

      <div className="relative overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-2 shadow-[0_18px_40px_-32px_rgba(18,24,22,0.35)]">
        <div className="relative flex w-full flex-col overflow-hidden rounded-2xl bg-[color:var(--surface-muted)] sm:flex-row">
          <ChoiceOption
            option={choice.optionA}
            side="A"
            interactive
            selected={myVote === "A"}
            disabled={hasVoted || isVoting || isLoadingVote}
            onSelect={() => {
              void handleVote("A");
            }}
          />
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 items-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--foreground)] font-[family-name:var(--font-display)] text-xs font-bold tracking-wide text-white shadow-lg sm:h-11 sm:w-11">
              VS
            </span>
          </div>
          <ChoiceOption
            option={choice.optionB}
            side="B"
            interactive
            selected={myVote === "B"}
            disabled={hasVoted || isVoting || isLoadingVote}
            onSelect={() => {
              void handleVote("B");
            }}
          />
        </div>
      </div>
    </div>
  );
}
