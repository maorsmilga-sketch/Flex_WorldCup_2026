"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SEED_MATCHES } from "@/data/seed-matches";
import { TEAMS_HE } from "@/data/teams-he";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { isPhase1Locked } from "@/lib/locks";
import { he } from "@/lib/he";
import { isSupabaseConfigured } from "@/lib/env";
import type { MatchPick } from "@/lib/scoring";
import { MatchPickCard } from "./MatchPickCard";

type MatchPicks = Record<string, MatchPick | undefined>;
type UnderMap = Record<string, boolean>;

export function Phase1Form() {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const locked = isPhase1Locked();
  const [picks, setPicks] = useState<MatchPicks>({});
  const [under, setUnder] = useState<UnderMap>({});
  const [topScorer, setTopScorer] = useState("");
  const [highTeam, setHighTeam] = useState("");
  const [lowTeam, setLowTeam] = useState("");
  const [winner, setWinner] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "err">("idle");
  const [userId, setUserId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!supabase) return;
    const { data: u } = await supabase.auth.getUser();
    const uid = u.user?.id;
    setUserId(uid ?? null);
    if (!uid) return;
    const { data } = await supabase
      .from("phase1_predictions")
      .select("*")
      .eq("user_id", uid)
      .maybeSingle();
    if (!data) return;
    setPicks((data.match_picks as MatchPicks) ?? {});
    const ud = (data.underdog_match_keys as string[] | null) ?? [];
    setUnder(Object.fromEntries(ud.map((k) => [k, true])));
    setTopScorer(data.top_scorer ?? "");
    setHighTeam(data.highest_scoring_team_id ?? "");
    setLowTeam(data.least_conceding_team_id ?? "");
    setWinner(data.tournament_winner_team_id ?? "");
  }, [supabase]);

  useEffect(() => {
    void load();
  }, [load]);

  async function save() {
    if (!supabase || !userId || locked) return;
    setStatus("saving");
    const underdogKeys = Object.entries(under)
      .filter(([, v]) => v)
      .map(([k]) => k);
    const { error } = await supabase.from("phase1_predictions").upsert(
      {
        user_id: userId,
        match_picks: picks,
        top_scorer: topScorer || null,
        highest_scoring_team_id: highTeam || null,
        least_conceding_team_id: lowTeam || null,
        tournament_winner_team_id: winner || null,
        underdog_match_keys: underdogKeys,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );
    setStatus(error ? "err" : "saved");
    if (!error) setTimeout(() => setStatus("idle"), 2000);
  }

  if (!isSupabaseConfigured()) {
    return (
      <p className="rounded-xl border border-amber-500/40 bg-amber-950/40 p-4 text-amber-100">
        {he.configureEnv}
      </p>
    );
  }

  if (!supabase) return null;

  return (
    <div className="space-y-8">
      {locked && (
        <p className="rounded-xl border border-red-500/40 bg-red-950/30 p-4 text-red-100">
          {he.phase1LockLabel} — {he.locked}
        </p>
      )}
      <section>
        <h2 className="mb-4 text-lg font-bold text-white">{he.matchesTitle}</h2>
        <p className="mb-4 text-sm text-sky-200/90">{he.underdogHint}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {SEED_MATCHES.map((m) => (
            <MatchPickCard
              key={m.key}
              match={m}
              value={picks[m.key]}
              onChange={(pick) =>
                setPicks((prev) => ({ ...prev, [m.key]: pick }))
              }
              underdogClaim={!!under[m.key]}
              onUnderdogClaimChange={(v) =>
                setUnder((prev) => ({ ...prev, [m.key]: v }))
              }
              disabled={locked}
            />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#0a2744]/80 p-5">
        <h2 className="mb-4 text-lg font-bold text-white">בונוסים</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block text-sky-100">{he.bonusTopScorer}</span>
            <input
              className="w-full rounded-lg border border-white/15 bg-[#061526] px-3 py-2 text-white"
              value={topScorer}
              disabled={locked}
              onChange={(e) => setTopScorer(e.target.value)}
              placeholder="למשל: קיליאן אמבפה"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-sky-100">{he.bonusHighScoreTeam}</span>
            <select
              className="w-full rounded-lg border border-white/15 bg-[#061526] px-3 py-2 text-white"
              value={highTeam}
              disabled={locked}
              onChange={(e) => setHighTeam(e.target.value)}
            >
              <option value="">—</option>
              {TEAMS_HE.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-sky-100">{he.bonusLeastConceded}</span>
            <select
              className="w-full rounded-lg border border-white/15 bg-[#061526] px-3 py-2 text-white"
              value={lowTeam}
              disabled={locked}
              onChange={(e) => setLowTeam(e.target.value)}
            >
              <option value="">—</option>
              {TEAMS_HE.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-sky-100">{he.bonusTournamentWinner}</span>
            <select
              className="w-full rounded-lg border border-white/15 bg-[#061526] px-3 py-2 text-white"
              value={winner}
              disabled={locked}
              onChange={(e) => setWinner(e.target.value)}
            >
              <option value="">—</option>
              {TEAMS_HE.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={locked || !userId}
          onClick={() => void save()}
          className="rounded-xl bg-sky-500 px-6 py-3 font-bold text-[#061526] shadow transition hover:bg-sky-400 disabled:opacity-40"
        >
          {status === "saving" ? he.saving : he.save}
        </button>
        {status === "saved" && (
          <span className="text-sm text-emerald-300">{he.saved}</span>
        )}
        {status === "err" && (
          <span className="text-sm text-red-300">{he.error}</span>
        )}
      </div>
    </div>
  );
}
