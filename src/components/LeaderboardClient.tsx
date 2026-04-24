"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SITE_OPTIONS, type SiteKey } from "@/lib/constants";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { he } from "@/lib/he";
import { isSupabaseConfigured } from "@/lib/env";

export type ProfileRow = {
  id: string;
  full_name: string;
  department: string;
  site: SiteKey;
  total_score: number;
};

type Filter = "global" | "site" | "department" | "friends";

export function LeaderboardClient() {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const [rows, setRows] = useState<ProfileRow[]>([]);
  const [filter, setFilter] = useState<Filter>("global");
  const [site, setSite] = useState<SiteKey | "">("");
  const [dept, setDept] = useState("");
  const [me, setMe] = useState<string | null>(null);
  const [following, setFollowing] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const refreshFollows = useCallback(async () => {
    if (!supabase) return;
    const { data: u } = await supabase.auth.getUser();
    const uid = u.user?.id;
    setMe(uid ?? null);
    if (!uid) {
      setFollowing(new Set());
      return;
    }
    const { data } = await supabase
      .from("user_follows")
      .select("following_id")
      .eq("follower_id", uid);
    setFollowing(new Set((data ?? []).map((r) => r.following_id as string)));
  }, [supabase]);

  const loadRows = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    let q = supabase
      .from("profiles")
      .select("id,full_name,department,site,total_score")
      .order("total_score", { ascending: false });
    if (filter === "site" && site) q = q.eq("site", site);
    if (filter === "department" && dept.trim())
      q = q.ilike("department", `%${dept.trim()}%`);
    const { data, error } = await q;
    if (error) {
      setRows([]);
      setLoading(false);
      return;
    }
    let list = (data ?? []) as ProfileRow[];
    if (filter === "friends" && following.size) {
      list = list.filter((r) => following.has(r.id));
    }
    setRows(list);
    setLoading(false);
  }, [supabase, filter, site, dept, following]);

  useEffect(() => {
    void refreshFollows();
  }, [refreshFollows]);

  useEffect(() => {
    void loadRows();
  }, [loadRows]);

  async function toggleStar(targetId: string) {
    if (!supabase || !me || targetId === me) return;
    if (following.has(targetId)) {
      await supabase
        .from("user_follows")
        .delete()
        .eq("follower_id", me)
        .eq("following_id", targetId);
    } else {
      await supabase.from("user_follows").insert({
        follower_id: me,
        following_id: targetId,
      });
    }
    await refreshFollows();
    await loadRows();
  }

  const ranked = useMemo(() => {
    return rows.map((r, i) => ({ ...r, rank: i + 1 }));
  }, [rows]);

  const myRow = me ? ranked.find((r) => r.id === me) : undefined;

  if (!isSupabaseConfigured() || !supabase) {
    return (
      <p className="text-amber-100">{he.configureEnv}</p>
    );
  }

  return (
    <div className="space-y-6 pb-28">
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["global", he.filterGlobal],
            ["site", he.filterSite],
            ["department", he.filterDepartment],
            ["friends", he.filterFriends],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setFilter(k)}
            className={[
              "rounded-full border px-4 py-2 text-sm font-semibold transition",
              filter === k
                ? "border-sky-400 bg-sky-500/25 text-white"
                : "border-white/15 bg-white/5 text-sky-100 hover:border-sky-400/40",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      {filter === "site" && (
        <select
          className="rounded-lg border border-white/15 bg-[#061526] px-3 py-2 text-white"
          value={site}
          onChange={(e) => setSite((e.target.value || "") as SiteKey | "")}
        >
          <option value="">כל האתרים</option>
          {SITE_OPTIONS.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
      )}

      {filter === "department" && (
        <input
          className="w-full max-w-md rounded-lg border border-white/15 bg-[#061526] px-3 py-2 text-white"
          placeholder="חיפוש מחלקה"
          value={dept}
          onChange={(e) => setDept(e.target.value)}
        />
      )}

      <p className="text-sm text-sky-200/80">{he.tiebreakHint}</p>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[320px] text-right text-sm">
          <thead className="bg-[#0a2744] text-sky-100">
            <tr>
              <th className="p-3 font-semibold">{he.rank}</th>
              <th className="p-3 font-semibold">{he.name}</th>
              <th className="p-3 font-semibold">{he.siteCol}</th>
              <th className="p-3 font-semibold">{he.score}</th>
              <th className="p-3 font-semibold w-24">{he.star}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-sky-200">
                  {he.loading}
                </td>
              </tr>
            ) : ranked.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-sky-200">
                  {filter === "friends"
                    ? "עדיין לא סימנתם עמיתים. לחצו על הכוכב ליד שורה כדי לעקוב."
                    : "אין נתונים להצגה."}
                </td>
              </tr>
            ) : (
              ranked.map((r) => (
                <tr
                  key={r.id}
                  className={[
                    "border-t border-white/5",
                    r.id === me ? "bg-sky-500/10" : "hover:bg-white/5",
                  ].join(" ")}
                >
                  <td className="p-3 font-mono text-sky-200">{r.rank}</td>
                  <td className="p-3 font-medium text-white">
                    {r.full_name}
                    {r.id === me && (
                      <span className="mr-2 text-xs text-sky-300">({he.you})</span>
                    )}
                  </td>
                  <td className="p-3 text-sky-100">
                    {SITE_OPTIONS.find((s) => s.key === r.site)?.label ?? r.site}
                  </td>
                  <td className="p-3 font-bold text-sky-300">{r.total_score}</td>
                  <td className="p-3">
                    {me && r.id !== me ? (
                      <button
                        type="button"
                        onClick={() => void toggleStar(r.id)}
                        className="text-lg text-amber-300 hover:text-amber-200"
                        title={
                          following.has(r.id) ? he.unstar : he.star
                        }
                      >
                        {following.has(r.id) ? "★" : "☆"}
                      </button>
                    ) : (
                      <span className="text-white/20">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {me && myRow && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-sky-500/40 bg-[#071a2e]/95 px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.35)] backdrop-blur-md"
          role="status"
        >
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 text-sm">
            <span className="font-semibold text-sky-200">{he.stickyMe}</span>
            <div className="flex flex-wrap items-center gap-4 text-white">
              <span className="text-sky-300">
                {he.rank}: <strong className="text-white">{myRow.rank}</strong>
              </span>
              <span>
                {he.score}:{" "}
                <strong className="text-xl text-sky-400">{myRow.total_score}</strong>
              </span>
              <span className="text-sky-100">{myRow.full_name}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
