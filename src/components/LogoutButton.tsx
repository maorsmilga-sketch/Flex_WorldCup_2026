"use client";

import { useRouter } from "next/navigation";
import { he } from "@/lib/he";
import { createBrowserSupabase } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const supabase = createBrowserSupabase();

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  }

  if (!supabase) return null;

  return (
    <button
      type="button"
      onClick={() => void signOut()}
      className="rounded-lg px-3 py-2 text-sm text-sky-200 transition hover:bg-white/10 hover:text-white"
    >
      {he.navLogout}
    </button>
  );
}
