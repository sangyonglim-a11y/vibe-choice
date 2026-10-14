import Image from "next/image";
import type { ChoiceOption as ChoiceOptionType } from "../model/types";

type ChoiceOptionProps = {
  option: ChoiceOptionType;
  side: "A" | "B";
  selected?: boolean;
  interactive?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
};

function formatVotes(count: number) {
  return new Intl.NumberFormat("ko-KR").format(count);
}

export function ChoiceOption({
  option,
  side,
  selected = false,
  interactive = false,
  disabled = false,
  onSelect,
}: ChoiceOptionProps) {
  const sideClass =
    side === "A"
      ? "from-[color:var(--option-a)]/90 to-[color:var(--option-a)]/40"
      : "from-[color:var(--option-b)]/90 to-[color:var(--option-b)]/40";

  const fallbackClass =
    side === "A"
      ? "bg-[color:var(--option-a)]"
      : "bg-[color:var(--option-b)]";

  const content = (
    <>
      {option.imageUrl ? (
        <Image
          src={option.imageUrl}
          alt={option.label}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 360px"
          className="object-cover transition-transform duration-500 ease-out group-hover/option:scale-105"
        />
      ) : (
        <div className={`absolute inset-0 ${fallbackClass}`} />
      )}
      <div
        className={`absolute inset-0 bg-gradient-to-t ${sideClass} transition-opacity duration-300 group-hover/option:opacity-90`}
      />
      {selected ? (
        <span className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-bold text-[color:var(--foreground)] sm:h-8 sm:w-8">
          ✓
        </span>
      ) : null}
      <div className="relative z-10 mt-auto flex flex-col gap-1 p-4 sm:p-5">
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white/75">
          {side === "A" ? "Choice A" : "Choice B"}
        </span>
        <span className="font-[family-name:var(--font-display)] text-lg font-semibold leading-tight text-white sm:text-xl">
          {option.label}
        </span>
        <span className="text-sm font-medium text-white/90">
          {formatVotes(option.voteCount)}표
        </span>
      </div>
    </>
  );

  const sharedClassName = `group/option relative flex min-h-40 w-full flex-1 flex-col overflow-hidden text-left sm:min-h-56 ${
    side === "A"
      ? "rounded-2xl rounded-b-none sm:rounded-2xl sm:rounded-r-none"
      : "rounded-2xl rounded-t-none sm:rounded-2xl sm:rounded-l-none"
  } ${selected ? "ring-2 ring-inset ring-white/80" : ""} ${
    interactive ? "min-h-44 touch-manipulation active:brightness-95 sm:min-h-56" : ""
  }`;

  if (interactive) {
    return (
      <button
        type="button"
        onClick={onSelect}
        disabled={disabled}
        className={`${sharedClassName} disabled:cursor-not-allowed`}
        aria-pressed={selected}
      >
        {content}
      </button>
    );
  }

  return <div className={sharedClassName}>{content}</div>;
}
