import { NextResponse } from "next/server";

const ALLOW = new Set(["fixtures", "odds"]);

/**
 * פרוקסי ל־API-Football: GET /api/football?resource=fixtures&season=2026&league=...
 * המפתח נשאר בשרת בלבד.
 */
export async function GET(request: Request) {
  const key = process.env.API_FOOTBALL_KEY;
  if (!key) {
    return NextResponse.json(
      { errors: [{ message: "API_FOOTBALL_KEY לא הוגדר" }] },
      { status: 501 }
    );
  }

  const { searchParams } = new URL(request.url);
  const resource = searchParams.get("resource") ?? "fixtures";
  if (!ALLOW.has(resource)) {
    return NextResponse.json({ error: "resource לא מורשה" }, { status: 400 });
  }

  const forward = new URLSearchParams();
  searchParams.forEach((v, k) => {
    if (k === "resource") return;
    forward.set(k, v);
  });

  const upstream = await fetch(
    `https://v3.football.api-sports.io/${resource}?${forward.toString()}`,
    {
      headers: { "x-apisports-key": key },
      next: { revalidate: 60 },
    }
  );

  const body = await upstream.json().catch(() => ({}));
  return NextResponse.json(body, { status: upstream.status });
}
