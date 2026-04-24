"use client";

import { useEffect, useState } from "react";
import { he } from "@/lib/he";

type Props = {
  target: Date;
  label: string;
};

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function Countdown({ target, label }: Props) {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(0);

  useEffect(() => {
    setMounted(true);
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const diff = mounted ? Math.max(0, target.getTime() - now) : 0;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  const done = mounted && diff === 0;

  const cell = (value: number, unit: string) => (
    <div className="flex flex-col items-center rounded-xl bg-white/10 px-3 py-2 backdrop-blur-sm min-w-[3.5rem]">
      <span className="text-2xl font-bold tabular-nums text-white">
        {mounted ? pad(value) : "—"}
      </span>
      <span className="text-xs text-sky-100/90">{unit}</span>
    </div>
  );

  return (
    <div className="rounded-2xl border border-sky-400/40 bg-[#0a2744]/90 p-4 shadow-lg shadow-sky-900/20">
      <p className="mb-3 text-center text-sm font-medium text-sky-100">{label}</p>
      {done ? (
        <p className="text-center text-lg font-semibold text-amber-200">{he.locked}</p>
      ) : (
        <div
          className="flex flex-wrap justify-center gap-2"
          dir="ltr"
          aria-live="polite"
        >
          {cell(days, he.countdownDays)}
          {cell(hours, he.countdownHours)}
          {cell(minutes, he.countdownMinutes)}
          {cell(seconds, he.countdownSeconds)}
        </div>
      )}
    </div>
  );
}
