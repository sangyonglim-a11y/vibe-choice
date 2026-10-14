import Link from "next/link";
import { Suspense } from "react";
import { getChoiceDetailServer } from "@/entities/choice/api/choice.server";
import { getCommentsByChoiceIdServer } from "@/entities/comment/api/comment.server";
import { ChoiceDetailBoard } from "@/features/choice";
import { CommentSection } from "@/widgets/comment-section";
import { Header } from "@/widgets/header";

type ChoiceDetailPageProps = {
  params: Promise<{ id: string }>;
};

async function ChoiceDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [choice, comments] = await Promise.all([
    getChoiceDetailServer(id),
    getCommentsByChoiceIdServer(id).catch((error) => {
      console.error("[ChoiceDetailPage] failed to load comments", error);
      return [];
    }),
  ]);

  if (!choice) {
    return (
      <div className="space-y-3">
        <p className="font-[family-name:var(--font-display)] text-xl font-semibold">
          이 게임을 찾을 수 없어요
        </p>
        <p className="text-sm text-[color:var(--muted)]">
          삭제되었거나 잘못된 주소일 수 있어요. 피드에서 다른 게임을
          골라보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <ChoiceDetailBoard initialChoice={choice} />
      <CommentSection gameId={choice.id} initialComments={comments} />
    </div>
  );
}

export default function ChoiceDetailPage({ params }: ChoiceDetailPageProps) {
  return (
    <>
      <Header />
      <main className="relative flex-1">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(26,166,166,0.14),transparent_60%),radial-gradient(ellipse_at_80%_0%,rgba(255,90,95,0.12),transparent_45%)]" />
        <section className="relative mx-auto w-full max-w-3xl px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-10">
          <Link
            href="/"
            className="mb-5 inline-flex min-h-11 items-center text-sm font-medium text-[color:var(--muted)] touch-manipulation transition-colors hover:text-[color:var(--foreground)] sm:mb-6 sm:min-h-0"
          >
            ← 피드로 돌아가기
          </Link>
          <Suspense
            fallback={
              <p className="text-sm text-[color:var(--muted)]">불러오는 중…</p>
            }
          >
            <ChoiceDetailContent params={params} />
          </Suspense>
        </section>
      </main>
    </>
  );
}
