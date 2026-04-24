import { NextResponse } from "next/server";

/**
 * נקודת קצה לעדכון ניקודים אחרי משחקים.
 * להפעלה מתוזמנת (Vercel Cron / Supabase Edge) עם כותרת Authorization: Bearer SERVICE_SECRET
 * ולוגיקת חישוב מלאה מול טבלת fixtures + phase1/phase2.
 */
export async function POST(request: Request) {
  const secret = process.env.SCORING_CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "לא מורשה" }, { status: 401 });
  }
  return NextResponse.json({
    ok: true,
    message:
      "שלב placeholder: חברו כאן חישוב מלא (API-Football + scoring.ts) ועדכון profiles.total_score",
  });
}
