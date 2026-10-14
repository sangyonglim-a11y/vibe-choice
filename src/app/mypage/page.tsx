"use client";

import Link from "next/link";
import { useState } from "react";
import {
  NicknameForm,
  RequireAuth,
  SignOutButton,
  useAuthStore,
} from "@/features/auth";
import { Header } from "@/widgets/header";

export default function MyPage() {
  const user = useAuthStore((state) => state.user);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  return (
    <>
      <Header />
      <main className="relative flex-1">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(26,166,166,0.14),transparent_60%),radial-gradient(ellipse_at_80%_0%,rgba(255,90,95,0.12),transparent_45%)]" />
        <section className="relative mx-auto w-full max-w-2xl px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-10">
          <div className="feed-intro mb-8">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center text-sm font-medium text-[color:var(--muted)] touch-manipulation transition-colors hover:text-[color:var(--foreground)] sm:min-h-0"
            >
              ← 피드로 돌아가기
            </Link>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-[1.75rem] font-bold tracking-tight text-[color:var(--foreground)] sm:text-3xl">
              마이페이지
            </h1>
            <p className="mt-3 text-[color:var(--muted)]">
              로그인된 계정 정보를 확인하고 닉네임을 변경할 수 있습니다.
            </p>
          </div>

          <RequireAuth>
            <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-[0_18px_40px_-32px_rgba(18,24,22,0.35)] sm:p-8">
              {successMessage ? (
                <p
                  role="status"
                  className="mb-5 rounded-2xl border border-[color:var(--border)] bg-[color:var(--background)] px-4 py-3 text-sm text-[color:var(--foreground)]"
                >
                  {successMessage}
                </p>
              ) : null}

              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-[color:var(--muted)]">닉네임</dt>
                  <dd className="mt-1 flex items-center justify-between gap-3">
                    <span className="font-medium text-[color:var(--foreground)]">
                      {user?.nickname || "미설정"}
                    </span>
                    {!isEditingNickname ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSuccessMessage(null);
                          setIsEditingNickname(true);
                        }}
                        className="inline-flex min-h-10 items-center rounded-xl border border-[color:var(--border-strong)] bg-white px-3 py-2 text-sm font-medium touch-manipulation transition-colors hover:bg-[color:var(--surface-muted)] sm:min-h-0 sm:rounded-lg sm:px-2.5 sm:py-1.5 sm:text-xs"
                      >
                        변경
                      </button>
                    ) : null}
                  </dd>
                </div>
                <div>
                  <dt className="text-[color:var(--muted)]">이메일</dt>
                  <dd className="mt-1 font-medium text-[color:var(--foreground)]">
                    {user?.email || "-"}
                  </dd>
                </div>
                <div>
                  <dt className="text-[color:var(--muted)]">사용자 ID</dt>
                  <dd className="mt-1 break-all font-mono text-xs text-[color:var(--foreground)]">
                    {user?.id}
                  </dd>
                </div>
              </dl>

              {isEditingNickname ? (
                <div className="mt-8 border-t border-[color:var(--border)] pt-6">
                  <h2 className="mb-4 font-[family-name:var(--font-display)] text-lg font-semibold">
                    닉네임 변경
                  </h2>
                  <NicknameForm
                    initialNickname={user?.nickname ?? ""}
                    submitLabel="닉네임 저장"
                    onSuccess={() => {
                      setIsEditingNickname(false);
                      setSuccessMessage("닉네임이 변경되었습니다.");
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setIsEditingNickname(false)}
                    className="mt-3 w-full rounded-2xl border border-[color:var(--border-strong)] bg-white px-4 py-3 text-sm font-medium transition-colors hover:bg-[color:var(--surface-muted)]"
                  >
                    취소
                  </button>
                </div>
              ) : null}

              <div className="mt-8 [&_button]:min-h-12 [&_button]:w-full sm:[&_button]:min-h-0 sm:[&_button]:w-auto">
                <SignOutButton />
              </div>
            </div>
          </RequireAuth>
        </section>
      </main>
    </>
  );
}
