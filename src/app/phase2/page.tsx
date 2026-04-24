import { Phase2BracketForm } from "@/components/Phase2BracketForm";
import { Countdown } from "@/components/Countdown";
import { getPhase2LockDate, isPhase2Locked } from "@/lib/locks";
import { he } from "@/lib/he";

export default function Phase2Page() {
  const locked = isPhase2Locked();
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{he.phase2Title}</h1>
          <p className="mt-1 text-sm text-sky-200/90">
            ניקוד התקדמות: סיבוב 16 — 7 נק׳, רבע גמר — 10, חצי גמר — 15, זוכה
            — 30.
          </p>
          <p className="text-sm text-sky-200/90">
            {he.phase2LockLabel}: {locked ? he.locked : he.open}
          </p>
        </div>
        <div className="max-w-xs shrink-0">
          <Countdown target={getPhase2LockDate()} label={he.phase2LockLabel} />
        </div>
      </div>
      <Phase2BracketForm />
    </div>
  );
}
