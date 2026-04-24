"use client";

import { UNDERDOG_DECIMAL_THRESHOLD } from "@/lib/constants";
import { he } from "@/lib/he";
import type { MatchPick } from "@/lib/scoring";
import type { SeedMatch } from "@/data/seed-matches";

type Props = {
  match: SeedMatch;
  value: MatchPick | undefined;
  onChange: (pick: MatchPick) => void;
  underdogClaim: boolean;
  onUnderdogClaimChange: (v: boolean) => void;
  disabled: boolean;
};

export function MatchPickCard({
  match,
  value,
  onChange,
  underdogClaim,
  onUnderdogClaimChange,
  disabled,
}: Props) {
  const homeUd = match.homeOdds > UNDERDOG_DECIMAL_THRESHOLD;
  const awayUd = match.awayOdds > UNDERDOG_DECIMAL_THRESHOLD;

  const btn = (
    side: MatchPick,
    label: string,
    isUnderdog: boolean,
    active: boolean
  ) => (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(side)}
      className={[
        "flex-1 rounded-xl border-2 px-2 py-3 text-sm font-bold transition",
        active
          ? "border-sky-400 bg-sky-500/30 text-white shadow-inner"
          : "border-white/10 bg-white/5 text-sky-50 hover:border-sky-400/50 hover:bg-sky-500/10",
        isUnderdog && !active ? "ring-2 ring-red-500/70 border-red-400/40" : "",
        disabled ? "opacity-50 pointer-events-none" : "",
      ].join(" ")}
    >
      <span className="block text-xs font-normal text-sky-200/80">{label}</span>
      {side === "1" ? match.home : side === "2" ? match.away : "X"}
    </button>
  );

  return (
    <article className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c2a45] to-[#061526] p-4 shadow-lg transition hover:shadow-sky-900/30 hover:border-sky-500/30">
      <div className="mb-2 flex items-center justify-between gap-2 text-xs text-sky-200/80">
        <span>קבוצה {match.group}</span>
        <span className="tabular-nums opacity-80" dir="ltr">
          {match.homeOdds} / {match.drawOdds} / {match.awayOdds}
        </span>
      </div>
      <div className="mb-3 text-center text-sm font-semibold text-white">
        <span>{match.home}</span>
        <span className="mx-2 text-sky-300">—</span>
        <span>{match.away}</span>
      </div>
      <div className="flex gap-2">
        {btn("1", he.pickHome, homeUd, value === "1")}
        {btn("X", he.pickDraw, false, value === "X")}
        {btn("2", he.pickAway, awayUd, value === "2")}
      </div>
      {(homeUd || awayUd) && (
        <label className="mt-3 flex cursor-pointer items-start gap-2 text-xs text-sky-100">
          <input
            type="checkbox"
            className="mt-0.5 size-4 rounded border-sky-400"
            checked={underdogClaim}
            disabled={disabled}
            onChange={(e) => onUnderdogClaimChange(e.target.checked)}
          />
          <span>{he.underdogToggle}</span>
        </label>
      )}
    </article>
  );
}
