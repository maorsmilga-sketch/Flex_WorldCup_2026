"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SITE_OPTIONS, type SiteKey } from "@/lib/constants";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { he } from "@/lib/he";
import { isSupabaseConfigured } from "@/lib/env";

export function ProfileForm() {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("");
  const [site, setSite] = useState<SiteKey>("migdal");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "err">("idle");
  const [userId, setUserId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!supabase) return;
    const { data: u } = await supabase.auth.getUser();
    const uid = u.user?.id ?? null;
    setUserId(uid);
    if (!uid) return;
    const { data } = await supabase
      .from("profiles")
      .select("full_name,department,site")
      .eq("id", uid)
      .maybeSingle();
    if (!data) return;
    setFullName(data.full_name ?? "");
    setDepartment(data.department ?? "");
    setSite((data.site as SiteKey) ?? "migdal");
  }, [supabase]);

  useEffect(() => {
    void load();
  }, [load]);

  async function save() {
    if (!supabase || !userId) return;
    setStatus("saving");
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        department,
        site,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);
    setStatus(error ? "err" : "saved");
    if (!error) setTimeout(() => setStatus("idle"), 2000);
  }

  if (!isSupabaseConfigured()) {
    return <p className="text-amber-100">{he.configureEnv}</p>;
  }
  if (!supabase) return null;

  if (!userId) {
    return (
      <p className="text-sky-200">
        יש להתחבר דרך{" "}
        <a className="text-sky-400 underline" href="/login">
          {he.navLogin}
        </a>
      </p>
    );
  }

  return (
    <form
      className="mx-auto max-w-lg space-y-4 rounded-2xl border border-white/10 bg-[#0a2744]/80 p-6"
      onSubmit={(e) => {
        e.preventDefault();
        void save();
      }}
    >
      <h1 className="text-xl font-bold text-white">{he.profileTitle}</h1>
      <label className="block text-sm">
        <span className="mb-1 block text-sky-100">{he.fullName}</span>
        <input
          required
          className="w-full rounded-lg border border-white/15 bg-[#061526] px-3 py-2 text-white"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-sky-100">{he.department}</span>
        <input
          className="w-full rounded-lg border border-white/15 bg-[#061526] px-3 py-2 text-white"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-sky-100">{he.site}</span>
        <select
          className="w-full rounded-lg border border-white/15 bg-[#061526] px-3 py-2 text-white"
          value={site}
          onChange={(e) => setSite(e.target.value as SiteKey)}
        >
          {SITE_OPTIONS.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        className="rounded-xl bg-sky-500 px-6 py-3 font-bold text-[#061526] transition hover:bg-sky-400"
      >
        {status === "saving" ? he.saving : he.save}
      </button>
      {status === "saved" && (
        <span className="mr-3 text-sm text-emerald-300">{he.saved}</span>
      )}
      {status === "err" && (
        <span className="text-sm text-red-300">{he.error}</span>
      )}
    </form>
  );
}
