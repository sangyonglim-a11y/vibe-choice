import { Suspense } from "react";
import { isFeedSort } from "@/entities/choice";
import type { FeedSort } from "@/entities/choice";
import { getFeedChoices } from "@/entities/choice/api/choice.server";
import { ChoiceFeed, FeedSortTabs } from "@/widgets/choice-feed";
import { Header } from "@/widgets/header";

type HomePageProps = {
  searchParams: Promise<{ sort?: string }>;
};

async function FeedSection({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const params = await searchParams;
  const sort: FeedSort = isFeedSort(params.sort) ? params.sort : "latest";
  const choices = await getFeedChoices(sort);

  return (
    <>
      <FeedSortTabs activeSort={sort} />
      <ChoiceFeed choices={choices} />
    </>
  );
}

export default function HomePage({ searchParams }: HomePageProps) {
  return (
    <>
      <Header />
      <main className="relative flex-1">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(26,166,166,0.14),transparent_60%),radial-gradient(ellipse_at_20%_0%,rgba(255,90,95,0.12),transparent_45%)]" />
        <section className="relative mx-auto w-full max-w-3xl px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-10">
          <div className="feed-intro mb-6 sm:mb-8">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--muted)] sm:text-sm">
              Today&apos;s vibes
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-[color:var(--foreground)] sm:text-5xl">
              Vibe Choice
            </h1>
            <p className="mt-3 max-w-md text-sm text-[color:var(--muted)] sm:text-lg">
              두 갈래 중 하나를 고르고, 다른 사람들의 선택과 이야기를
              확인해보세요.
            </p>
          </div>
          <Suspense
            fallback={
              <p className="text-sm text-[color:var(--muted)]">
                게임 목록을 불러오는 중...
              </p>
            }
          >
            <FeedSection searchParams={searchParams} />
          </Suspense>
        </section>
      </main>
    </>
  );
}
