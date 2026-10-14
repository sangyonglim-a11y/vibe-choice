import Link from "next/link";
import type { FeedSort } from "@/entities/choice";

type FeedSortTabsProps = {
  activeSort: FeedSort;
};

const tabs: Array<{ value: FeedSort; label: string }> = [
  { value: "latest", label: "최신순" },
  { value: "popular", label: "참여순" },
];

export function FeedSortTabs({ activeSort }: FeedSortTabsProps) {
  return (
    <div className="mb-5 grid grid-cols-2 gap-2 sm:inline-flex sm:items-center">
      {tabs.map((tab) => {
        const isActive = tab.value === activeSort;
        const href = tab.value === "latest" ? "/" : `/?sort=${tab.value}`;

        return (
          <Link
            key={tab.value}
            href={href}
            className={`inline-flex min-h-11 items-center justify-center rounded-xl px-3.5 py-2 text-sm font-medium touch-manipulation transition-colors sm:min-h-0 ${
              isActive
                ? "bg-[color:var(--foreground)] text-white"
                : "border border-[color:var(--border-strong)] bg-white text-[color:var(--muted)] hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--foreground)]"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
