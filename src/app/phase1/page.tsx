import { Phase1Form } from "@/components/Phase1Form";
import { Countdown } from "@/components/Countdown";
import { getPhase1LockDate, isPhase1Locked } from "@/lib/locks";
import { he } from "@/lib/he";

export default function Phase1Page() {
  const locked = isPhase1Locked();
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{he.phase1Title}</h1>
          <p className="mt-1 text-sm text-sky-200/90">
            {he.phase1LockLabel}: {locked ? he.locked : he.open}
          </p>
        </div>
        <div className="max-w-xs shrink-0">
          <Countdown target={getPhase1LockDate()} label={he.phase1LockLabel} />
        </div>
      </div>
      <Phase1Form />
    </div>
  );
}
