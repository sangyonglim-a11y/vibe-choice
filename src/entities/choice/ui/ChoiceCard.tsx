import Link from "next/link";
import type { Choice } from "../model/types";
import { ChoiceOption } from "./ChoiceOption";

type ChoiceCardProps = {
  choice: Choice;
  index?: number;
};

function formatVotes(count: number) {
  return new Intl.NumberFormat("ko-KR").format(count);
}

export function ChoiceCard({ choice, index = 0 }: ChoiceCardProps) {
  const totalVotes = choice.optionA.voteCount + choice.optionB.voteCount;
  const voteSummary = `${choice.optionA.label} ${formatVotes(choice.optionA.voteCount)}표 vs ${choice.optionB.label} ${formatVotes(choice.optionB.voteCount)}표`;

  return (
    <Link
      href={`/choices/${choice.id}`}
      className="choice-card group block rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-3 shadow-[0_1px_0_rgba(18,24,22,0.04)] transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-[color:var(--border-strong)] hover:shadow-[0_18px_40px_-28px_rgba(18,24,22,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--option-b)] active:scale-[0.99] sm:active:scale-100"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="mb-3 flex flex-col gap-2 px-1 pt-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div className="min-w-0">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-2xl">
            {choice.title}
          </h2>
          {choice.description ? (
            <p className="mt-1 line-clamp-2 text-sm text-[color:var(--muted)] sm:truncate">
              {choice.description}
            </p>
          ) : null}
          <p className="mt-2 text-sm font-medium leading-snug text-[color:var(--foreground)]">
            {voteSummary}
          </p>
        </div>
        <div className="flex shrink-0 items-center justify-between gap-3 text-xs text-[color:var(--muted)] sm:flex-col sm:items-end sm:text-right">
          <p className="font-medium text-[color:var(--foreground)]">
            총 {formatVotes(totalVotes)}표
          </p>
          <p>{choice.authorName}</p>
        </div>
      </div>

      <div className="relative flex flex-col overflow-hidden rounded-2xl bg-[color:var(--surface-muted)] sm:flex-row">
        <ChoiceOption option={choice.optionA} side="A" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 items-center">
          <span className="vs-badge flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--foreground)] font-[family-name:var(--font-display)] text-xs font-bold tracking-wide text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 sm:h-11 sm:w-11">
            VS
          </span>
        </div>
        <ChoiceOption option={choice.optionB} side="B" />
      </div>
    </Link>
  );
}
