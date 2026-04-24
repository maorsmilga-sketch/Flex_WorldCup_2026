"use client";

import { useState } from "react";
import { he } from "@/lib/he";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!isSupabaseConfigured()) {
      setErr(he.configureEnv);
      return;
    }
    const supabase = createBrowserSupabase();
    if (!supabase) return;
    setLoading(true);
    const origin =
      typeof window !== "undefined" ? window.location.origin : "";
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setSent(true);
  }

  return (
    <form
      onSubmit={(e) => void submit(e)}
      className="mx-auto max-w-md space-y-4 rounded-2xl border border-white/10 bg-[#0a2744]/80 p-6"
    >
      <h1 className="text-xl font-bold text-white">{he.loginTitle}</h1>
      <p className="text-sm text-sky-200/90">{he.loginHint}</p>
      <label className="block text-sm">
        <span className="mb-1 block text-sky-100">{he.email}</span>
        <input
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-lg border border-white/15 bg-[#061526] px-3 py-2 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={sent || loading}
        />
      </label>
      {err && <p className="text-sm text-red-300">{err}</p>}
      {sent ? (
        <p className="text-emerald-300">{he.checkEmail}</p>
      ) : (
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-sky-500 py-3 font-bold text-[#061526] transition hover:bg-sky-400 disabled:opacity-50"
        >
          {loading ? he.loading : he.sendLink}
        </button>
      )}
    </form>
  );
}
