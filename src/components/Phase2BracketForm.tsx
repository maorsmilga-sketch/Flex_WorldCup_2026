"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { TEAMS_HE } from "@/data/teams-he";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { isPhase2Locked } from "@/lib/locks";
import { he } from "@/lib/he";
import { isSupabaseConfigured } from "@/lib/env";

type Bracket = {
  r16: (string | null)[];
  qf: (string | null)[];
  sf: (string | null)[];
  final: string | null;
};

const emptyBracket = (): Bracket => ({
  r16: Array(8).fill(null),
  qf: Array(4).fill(null),
  sf: Array(2).fill(null),
  final: null,
});

const R16_PAIRS = Array.from({ length: 8 }, (_, i) => {
  const a = TEAMS_HE[i * 2];
  const b = TEAMS_HE[i * 2 + 1];
  return [a, b] as const;
});

function nameById(id: string | null) {
  if (!id) return "—";
  return TEAMS_HE.find((t) => t.id === id)?.name ?? id;
}

export function Phase2BracketForm() {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const locked = isPhase2Locked();
  const [b, setB] = useState<Bracket>(emptyBracket());
  const [fh, setFh] = useState<number | "">("");
  const [fa, setFa] = useState<number | "">("");
  const [statsScorer, setStatsScorer] = useState("");
  const [statsTeam, setStatsTeam] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "err">("idle");
  const [userId, setUserId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!supabase) return;
    const { data: u } = await supabase.auth.getUser();
    const uid = u.user?.id ?? null;
    setUserId(uid);
    if (!uid) return;
    const { data } = await supabase
      .from("phase2_predictions")
      .select("*")
      .eq("user_id", uid)
      .maybeSingle();
    if (!data) return;
    const br = (data.bracket as Bracket) ?? emptyBracket();
    setB({
      r16: pad(br.r16, 8),
      qf: pad(br.qf, 4),
      sf: pad(br.sf, 2),
      final: br.final ?? null,
    });
    if (data.final_home_goals != null) setFh(data.final_home_goals);
    if (data.final_away_goals != null) setFa(data.final_away_goals);
    setStatsScorer(data.stats_top_scorer ?? "");
    setStatsTeam(data.stats_highest_scoring_team_id ?? "");
  }, [supabase]);

  useEffect(() => {
    void load();
  }, [load]);

  function pad<T>(arr: T[] | null | undefined, len: number): (T | null)[] {
    const a: (T | null)[] = [...(arr ?? [])];
    while (a.length < len) a.push(null);
    return a.slice(0, len);
  }

  const qfPairs = [
    [b.r16[0], b.r16[1]],
    [b.r16[2], b.r16[3]],
    [b.r16[4], b.r16[5]],
    [b.r16[6], b.r16[7]],
  ] as const;

  const sfPairs = [
    [b.qf[0], b.qf[1]],
    [b.qf[2], b.qf[3]],
  ] as const;

  async function save() {
    if (!supabase || !userId || locked) return;
    setStatus("saving");
    const { error } = await supabase.from("phase2_predictions").upsert(
      {
        user_id: userId,
        bracket: b,
        final_home_goals: fh === "" ? null : fh,
        final_away_goals: fa === "" ? null : fa,
        stats_top_scorer: statsScorer || null,
        stats_highest_scoring_team_id: statsTeam || null,
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

  function pickWinner(
    round: "r16" | "qf" | "sf" | "final",
    index: number,
    teamId: string
  ) {
    if (locked) return;
    setB((prev) => {
      if (round === "final") {
        return { ...prev, final: teamId };
      }
      const arr = [...(prev[round] as (string | null)[])];
      arr[index] = teamId;
      const next = { ...prev, [round]: arr } as Bracket;
      if (round === "r16") {
        return {
          ...next,
          qf: Array(4).fill(null),
          sf: Array(2).fill(null),
          final: null,
        };
      }
      if (round === "qf") {
        return { ...next, sf: Array(2).fill(null), final: null };
      }
      if (round === "sf") {
        return { ...next, final: null };
      }
      return next;
    });
  }

  return (
    <div className="space-y-8">
      {locked && (
        <p className="rounded-xl border border-red-500/40 bg-red-950/30 p-4 text-red-100">
          {he.phase2LockLabel} — {he.locked}
        </p>
      )}

      <section>
        <h2 className="mb-3 text-lg font-bold text-white">{he.phase2Bracket}</h2>
        <p className="mb-4 text-sm text-sky-200/90">
          סיבוב 16: בחרו מנצחת לכל זוג. לאחר מכן רבע גמר, חצי גמר וגמר יתעדכנו
          לפי הבחירות שלכם.
        </p>
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-sky-200">סיבוב 16</h3>
            <div className="space-y-3">
              {R16_PAIRS.map((pair, i) => (
                <div
                  key={i}
                  className="flex flex-wrap gap-2 rounded-xl border border-white/10 bg-[#0a2744]/60 p-3"
                >
                  {[pair[0], pair[1]].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      disabled={locked}
                      onClick={() => pickWinner("r16", i, t.id)}
                      className={[
                        "flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition",
                        b.r16[i] === t.id
                          ? "border-sky-400 bg-sky-500/25 text-white"
                          : "border-white/10 bg-white/5 text-sky-100 hover:border-sky-400/40",
                      ].join(" ")}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-sky-200">רבע גמר</h3>
              <div className="space-y-3">
                {qfPairs.map((pair, i) => (
                  <div
                    key={i}
                    className="flex flex-wrap gap-2 rounded-xl border border-white/10 bg-[#0a2744]/60 p-3"
                  >
                    {pair.map((tid) => (
                      <button
                        key={String(tid) + i}
                        type="button"
                        disabled={locked || !tid}
                        onClick={() => tid && pickWinner("qf", i, tid)}
                        className={[
                          "flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition",
                          b.qf[i] === tid
                            ? "border-sky-400 bg-sky-500/25 text-white"
                            : "border-white/10 bg-white/5 text-sky-100 hover:border-sky-400/40",
                          !tid ? "opacity-40" : "",
                        ].join(" ")}
                      >
                        {nameById(tid)}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-sky-200">חצי גמר</h3>
              <div className="space-y-3">
                {sfPairs.map((pair, i) => (
                  <div
                    key={i}
                    className="flex flex-wrap gap-2 rounded-xl border border-white/10 bg-[#0a2744]/60 p-3"
                  >
                    {pair.map((tid) => (
                      <button
                        key={String(tid) + i}
                        type="button"
                        disabled={locked || !tid}
                        onClick={() => tid && pickWinner("sf", i, tid)}
                        className={[
                          "flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition",
                          b.sf[i] === tid
                            ? "border-sky-400 bg-sky-500/25 text-white"
                            : "border-white/10 bg-white/5 text-sky-100 hover:border-sky-400/40",
                          !tid ? "opacity-40" : "",
                        ].join(" ")}
                      >
                        {nameById(tid)}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-sky-200">גמר</h3>
              <div className="flex flex-wrap gap-2 rounded-xl border border-white/10 bg-[#0a2744]/60 p-3">
                {b.sf.map((tid) => (
                  <button
                    key={String(tid)}
                    type="button"
                    disabled={locked || !tid}
                    onClick={() => tid && pickWinner("final", 0, tid)}
                    className={[
                      "flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition",
                      b.final === tid
                        ? "border-sky-400 bg-sky-500/25 text-white"
                        : "border-white/10 bg-white/5 text-sky-100 hover:border-sky-400/40",
                      !tid ? "opacity-40" : "",
                    ].join(" ")}
                  >
                    {nameById(tid)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#0a2744]/80 p-5">
        <h2 className="mb-4 text-lg font-bold text-white">{he.phase2FinalScore}</h2>
        <div className="flex flex-wrap gap-4">
          <label className="text-sm">
            <span className="mb-1 block text-sky-100">{he.homeGoals}</span>
            <input
              type="number"
              min={0}
              className="w-28 rounded-lg border border-white/15 bg-[#061526] px-3 py-2 text-white"
              value={fh}
              disabled={locked}
              onChange={(e) =>
                setFh(e.target.value === "" ? "" : Number(e.target.value))
              }
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-sky-100">{he.awayGoals}</span>
            <input
              type="number"
              min={0}
              className="w-28 rounded-lg border border-white/15 bg-[#061526] px-3 py-2 text-white"
              value={fa}
              disabled={locked}
              onChange={(e) =>
                setFa(e.target.value === "" ? "" : Number(e.target.value))
              }
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#0a2744]/80 p-5">
        <h2 className="mb-4 text-lg font-bold text-white">{he.phase2Stats}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block text-sky-100">{he.bonusTopScorer}</span>
            <input
              className="w-full rounded-lg border border-white/15 bg-[#061526] px-3 py-2 text-white"
              value={statsScorer}
              disabled={locked}
              onChange={(e) => setStatsScorer(e.target.value)}
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-sky-100">{he.bonusHighScoreTeam}</span>
            <select
              className="w-full rounded-lg border border-white/15 bg-[#061526] px-3 py-2 text-white"
              value={statsTeam}
              disabled={locked}
              onChange={(e) => setStatsTeam(e.target.value)}
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
