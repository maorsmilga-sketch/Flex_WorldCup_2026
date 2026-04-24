import Image from "next/image";
import Link from "next/link";
import { Countdown } from "@/components/Countdown";
import { FootballHero } from "@/components/FootballHero";
import { PHASE1_LOCK_ISO, PHASE2_LOCK_ISO } from "@/lib/constants";
import { getPhase1LockDate, getPhase2LockDate } from "@/lib/locks";
import { he } from "@/lib/he";

export default function HomePage() {
  const d1 = getPhase1LockDate();
  const d2 = getPhase2LockDate();

  return (
    <div className="relative overflow-hidden">
      <FootballHero />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-4 py-16 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl space-y-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div className="relative h-14 w-40 shrink-0">
              <Image
                src="/flex-logo.png"
                alt="Flex"
                fill
                className="object-contain object-right"
                priority
              />
            </div>
            <h1 className="text-3xl font-extrabold leading-tight text-white md:text-4xl">
              {he.appTitle}
            </h1>
          </div>
          <p className="text-lg text-sky-100/95">{he.tagline}</p>
          <p className="text-sky-200/90">{he.landingSub}</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl bg-sky-500 px-8 py-3 text-base font-bold text-[#061526] shadow-lg shadow-sky-900/30 transition hover:scale-[1.02] hover:bg-sky-400"
            >
              {he.landingCta}
            </Link>
            <Link
              href="/leaderboard"
              className="inline-flex items-center justify-center rounded-xl border border-sky-400/50 px-6 py-3 font-semibold text-sky-100 transition hover:bg-sky-500/10"
            >
              {he.navLeaderboard}
            </Link>
          </div>
          <p className="text-xs text-sky-300/70" dir="ltr">
            {PHASE1_LOCK_ISO} · {PHASE2_LOCK_ISO}
          </p>
        </div>
        <div className="grid w-full max-w-md shrink-0 gap-4 md:max-w-sm">
          <Countdown target={d1} label={he.phase1LockLabel} />
          <Countdown target={d2} label={he.phase2LockLabel} />
        </div>
      </div>
    </div>
  );
}
