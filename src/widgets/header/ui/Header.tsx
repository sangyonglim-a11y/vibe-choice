import Link from "next/link";
import { AuthNav } from "./AuthNav";
import { CreateGameLink } from "./CreateGameLink";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--border)] bg-[color:var(--background)]/85 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <div className="mx-auto flex min-h-14 w-full max-w-3xl items-center justify-between gap-3 px-4 py-2 sm:h-16 sm:px-6 sm:py-0">
        <Link
          href="/"
          className="group flex min-w-0 items-baseline gap-2 touch-manipulation"
        >
          <span className="truncate font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-[color:var(--foreground)] transition-colors group-hover:text-[color:var(--option-b)] sm:text-2xl">
            Vibe Choice
          </span>
        </Link>
        <nav className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <AuthNav />
          <CreateGameLink />
        </nav>
      </div>
    </header>
  );
}
