import Image from "next/image";
import Link from "next/link";
import { he } from "@/lib/he";
import { LogoutButton } from "./LogoutButton";

type NavUser = { email?: string | null } | null;

export function AppHeader({ user }: { user: NavUser }) {
  return (
    <header className="sticky top-0 z-40 border-b border-sky-500/25 bg-[#071a2e]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative h-10 w-28 shrink-0 transition-transform group-hover:scale-[1.02]">
            <Image
              src="/flex-logo.png"
              alt="Flex"
              fill
              className="object-contain object-right"
              sizes="112px"
              priority
            />
          </span>
          <span className="hidden text-sm font-semibold text-white sm:block">
            {he.appTitle}
          </span>
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-1 text-sm">
          <Link
            className="rounded-lg px-3 py-2 text-sky-100 transition hover:bg-sky-500/15 hover:text-white"
            href="/"
          >
            {he.navHome}
          </Link>
          {user ? (
            <>
              <Link
                className="rounded-lg px-3 py-2 text-sky-100 transition hover:bg-sky-500/15 hover:text-white"
                href="/dashboard"
              >
                {he.navDashboard}
              </Link>
              <Link
                className="rounded-lg px-3 py-2 text-sky-100 transition hover:bg-sky-500/15 hover:text-white"
                href="/phase1"
              >
                {he.navPhase1}
              </Link>
              <Link
                className="rounded-lg px-3 py-2 text-sky-100 transition hover:bg-sky-500/15 hover:text-white"
                href="/phase2"
              >
                {he.navPhase2}
              </Link>
              <Link
                className="rounded-lg px-3 py-2 text-sky-100 transition hover:bg-sky-500/15 hover:text-white"
                href="/leaderboard"
              >
                {he.navLeaderboard}
              </Link>
              <Link
                className="rounded-lg px-3 py-2 text-sky-100 transition hover:bg-sky-500/15 hover:text-white"
                href="/profile"
              >
                {he.navProfile}
              </Link>
              <LogoutButton />
            </>
          ) : (
            <Link
              className="rounded-lg bg-sky-500 px-4 py-2 font-semibold text-[#071a2e] shadow transition hover:bg-sky-400"
              href="/login"
            >
              {he.navLogin}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
