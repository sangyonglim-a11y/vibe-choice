"use client";

import type { VoteOption } from "../model/types";

type VoteButtonProps = {
  side: VoteOption;
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

export function VoteButton({
  side,
  label,
  selected = false,
  disabled = false,
  onClick,
}: VoteButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className="rounded-xl border border-[color:var(--border-strong)] bg-white px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
    >
      {selected ? "✓ " : ""}
      {side}: {label}
    </button>
  );
}
