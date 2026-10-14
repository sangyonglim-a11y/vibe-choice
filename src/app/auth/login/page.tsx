import Link from "next/link";
import { SignInForm } from "@/features/auth";
import { Header } from "@/widgets/header";

type LoginPageProps = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = params.next || "/";
  const hasError = params.error === "oauth_callback";

  return (
    <>
      <Header />
      <main className="relative flex-1">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(26,166,166,0.14),transparent_60%),radial-gradient(ellipse_at_80%_0%,rgba(255,90,95,0.12),transparent_45%)]" />
        <section className="relative mx-auto w-full max-w-md px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-10">
          <div className="feed-intro mb-8">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center text-sm font-medium text-[color:var(--muted)] touch-manipulation transition-colors hover:text-[color:var(--foreground)] sm:min-h-0"
            >
              ← 피드로 돌아가기
            </Link>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-[color:var(--foreground)]">
              로그인
            </h1>
            <p className="mt-3 text-[color:var(--muted)]">
              Vibe Choice에 Google 계정으로 로그인하세요.
            </p>
          </div>

          <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-[0_18px_40px_-32px_rgba(18,24,22,0.35)] sm:p-8">
            {hasError ? (
              <p
                role="alert"
                className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                로그인 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.
              </p>
            ) : null}
            <SignInForm nextPath={nextPath} />
          </div>
        </section>
      </main>
    </>
  );
}
