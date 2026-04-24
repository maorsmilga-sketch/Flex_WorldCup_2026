import { LeaderboardClient } from "@/components/LeaderboardClient";
import { he } from "@/lib/he";

export default function LeaderboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold text-white">{he.leaderboardTitle}</h1>
      <LeaderboardClient />
    </div>
  );
}
