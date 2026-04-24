import { POINTS, UNDERDOG_DECIMAL_THRESHOLD } from "./constants";

export type MatchPick = "1" | "X" | "2";

export type FixtureResult = {
  matchKey: string;
  homeGoals: number;
  awayGoals: number;
  homeOdds?: number;
  drawOdds?: number;
  awayOdds?: number;
};

function actualPick(fr: FixtureResult): MatchPick {
  if (fr.homeGoals > fr.awayGoals) return "1";
  if (fr.homeGoals < fr.awayGoals) return "2";
  return "X";
}

function underdogSide(fr: FixtureResult): "home" | "away" | null {
  const ho = fr.homeOdds ?? 0;
  const ao = fr.awayOdds ?? 0;
  if (ho > UNDERDOG_DECIMAL_THRESHOLD && ho >= ao) return "home";
  if (ao > UNDERDOG_DECIMAL_THRESHOLD && ao > ho) return "away";
  return null;
}

export function pointsForGroupMatch(
  pick: MatchPick | undefined,
  fr: FixtureResult,
  claimedUnderdog: boolean
): number {
  if (!pick) return 0;
  const actual = actualPick(fr);
  if (pick !== actual) return 0;
  let pts = POINTS.groupMatch;
  if (claimedUnderdog) {
    const side = underdogSide(fr);
    const winningSide = actual === "1" ? "home" : actual === "2" ? "away" : null;
    if (side && winningSide === side) {
      pts += POINTS.underdogBonus;
    }
  }
  return pts;
}

/** לשימוש בשרת / קרון — חישוב שובר שוויון: מספר נכונים בנוקאאוט, אחר כך תאריך הרשמה */
export function compareTiebreak(
  a: { total: number; knockoutCorrect: number; registeredAt: number },
  b: { total: number; knockoutCorrect: number; registeredAt: number }
): number {
  if (b.total !== a.total) return b.total - a.total;
  if (b.knockoutCorrect !== a.knockoutCorrect)
    return b.knockoutCorrect - a.knockoutCorrect;
  return a.registeredAt - b.registeredAt;
}
