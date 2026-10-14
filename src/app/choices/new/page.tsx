"use client";

import Link from "next/link";
import { RequireAuth } from "@/features/auth";
import { CreateChoiceForm } from "@/features/choice";
import { Header } from "@/widgets/header";

export default function NewChoicePage() {
  return (
    <>
      <Header />
      <main className="relative flex-1">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(26,166,166,0.14),transparent_60%),radial-gradient(ellipse_at_80%_0%,rgba(255,90,95,0.12),transparent_45%)]" />
        <section className="relative mx-auto w-full max-w-2xl px-4 py-6 pb-[max(5rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-10 sm:pb-10">
          <div className="feed-intro mb-8">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center text-sm font-medium text-[color:var(--muted)] touch-manipulation transition-colors hover:text-[color:var(--foreground)] sm:min-h-0"
            >
              ← 피드로 돌아가기
            </Link>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-[1.75rem] font-bold tracking-tight text-[color:var(--foreground)] sm:text-4xl">
              새 게임 만들기
            </h1>
            <p className="mt-3 max-w-md text-[color:var(--muted)]">
              두 가지 선택지를 만들고, 사람들의 투표를 받아보세요.
            </p>
          </div>
          <RequireAuth>
            <CreateChoiceForm />
          </RequireAuth>
        </section>
      </main>
    </>
  );
}
