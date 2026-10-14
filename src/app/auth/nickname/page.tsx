"use client";

import { useRouter } from "next/navigation";
import {
  NicknameForm,
  RequireAuth,
  useAuthStore,
} from "@/features/auth";
import { Header } from "@/widgets/header";

export default function NicknameSetupPage() {
  const router = useRouter();
  const needsNickname = useAuthStore((state) => state.needsNickname);
  const isLoading = useAuthStore((state) => state.isLoading);

  return (
    <>
      <Header />
      <main className="relative flex-1">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(26,166,166,0.14),transparent_60%),radial-gradient(ellipse_at_80%_0%,rgba(255,90,95,0.12),transparent_45%)]" />
        <section className="relative mx-auto w-full max-w-md px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-10">
          <div className="feed-intro mb-8">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--muted)] sm:text-sm">
              Welcome
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-[1.75rem] font-bold tracking-tight text-[color:var(--foreground)] sm:text-3xl">
              닉네임 설정
            </h1>
            <p className="mt-3 text-[color:var(--muted)]">
              Vibe Choice에서 사용할 닉네임을 정해 주세요. 나중에 마이페이지에서
              변경할 수 있어요.
            </p>
          </div>

          <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-[0_18px_40px_-32px_rgba(18,24,22,0.35)] sm:p-8">
            <RequireAuth>
              {isLoading ? (
                <p className="text-sm text-[color:var(--muted)]">
                  불러오는 중...
                </p>
              ) : (
                <NicknameForm
                  submitLabel="저장하고 시작하기"
                  onSuccess={() => {
                    router.replace("/");
                  }}
                />
              )}
              {!isLoading && !needsNickname ? (
                <p className="mt-4 text-sm text-[color:var(--muted)]">
                  이미 닉네임이 설정되어 있습니다. 메인으로 이동합니다.
                </p>
              ) : null}
            </RequireAuth>
          </div>
        </section>
      </main>
    </>
  );
}
