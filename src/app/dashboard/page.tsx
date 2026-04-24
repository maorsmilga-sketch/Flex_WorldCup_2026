import Link from "next/link";
import { Countdown } from "@/components/Countdown";
import { createClient } from "@/lib/supabase/server";
import { getPhase1LockDate, getPhase2LockDate } from "@/lib/locks";
import { he } from "@/lib/he";

export default async function DashboardPage() {
  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  let name = "";
  if (supabase && user) {
    const { data } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle();
    name = data?.full_name ?? "";
  }

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-12">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-white">
          {he.dashboardWelcome}
          {name ? `, ${name}` : ""}
        </h1>
        <p className="text-sky-200/90">{he.dashboardScores}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Countdown target={getPhase1LockDate()} label={he.phase1LockLabel} />
        <Countdown target={getPhase2LockDate()} label={he.phase2LockLabel} />
      </div>

      <div className="flex flex-wrap gap-4">
        <Link
          href="/phase1"
          className="rounded-xl border border-sky-400/40 bg-sky-500/15 px-6 py-4 font-semibold text-white transition hover:bg-sky-500/25"
        >
          {he.dashboardPhase1}
        </Link>
        <Link
          href="/phase2"
          className="rounded-xl border border-sky-400/40 bg-sky-500/15 px-6 py-4 font-semibold text-white transition hover:bg-sky-500/25"
        >
          {he.dashboardPhase2}
        </Link>
        <Link
          href="/leaderboard"
          className="rounded-xl border border-white/15 px-6 py-4 font-semibold text-sky-100 transition hover:bg-white/5"
        >
          {he.navLeaderboard}
        </Link>
      </div>

      {!user && (
        <p className="rounded-xl border border-amber-500/30 bg-amber-950/30 p-4 text-amber-100">
          <Link className="font-semibold underline" href="/login">
            {he.navLogin}
          </Link>{" "}
          כדי לשמור ניבויים ולהופיע בלוח התוצאות.
        </p>
      )}
    </div>
  );
}
