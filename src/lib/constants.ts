/** Deadlines — Israel summer time (IDT, UTC+3) */
export const PHASE1_LOCK_ISO = "2026-06-11T21:59:00+03:00";
export const PHASE2_LOCK_ISO = "2026-06-28T21:59:00+03:00";

export const UNDERDOG_DECIMAL_THRESHOLD = 3.5;

export const POINTS = {
  groupMatch: 3,
  bonusTopScorer: 5,
  bonusHighestScoringTeam: 5,
  bonusLeastConceding: 5,
  underdogBonus: 8,
  tournamentWinnerBonus: 10,
  koRoundOf16: 7,
  koQuarter: 10,
  koSemi: 15,
  koWinner: 30,
  finalExactScore: 5,
  koStatsTopScorer: 7,
  koStatsHighestScoringTeam: 7,
} as const;

export type SiteKey = "migdal" | "ofakim" | "modiin";

export const SITE_OPTIONS: { key: SiteKey; label: string }[] = [
  { key: "migdal", label: "מגדל העמק" },
  { key: "ofakim", label: "אופקים" },
  { key: "modiin", label: "מודיעין" },
];
