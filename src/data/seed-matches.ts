/** דוגמת משחקים ל־UI — ניתן להחליף בסנכרון מ־API-Football לטבלת fixtures */
export type SeedMatch = {
  key: string;
  home: string;
  away: string;
  group: string;
  homeOdds: number;
  drawOdds: number;
  awayOdds: number;
};

export const SEED_MATCHES: SeedMatch[] = [
  {
    key: "A1",
    group: "א",
    home: "ארגנטינה",
    away: "שבדיה",
    homeOdds: 1.55,
    drawOdds: 4.1,
    awayOdds: 6.2,
  },
  {
    key: "A2",
    group: "א",
    home: "מקסיקו",
    away: "פולין",
    homeOdds: 2.2,
    drawOdds: 3.2,
    awayOdds: 3.6,
  },
  {
    key: "B1",
    group: "ב",
    home: "צרפת",
    away: "אוסטרליה",
    homeOdds: 1.35,
    drawOdds: 5.0,
    awayOdds: 9.5,
  },
  {
    key: "B2",
    group: "ב",
    home: "דנמרק",
    away: "תוניסיה",
    homeOdds: 1.9,
    drawOdds: 3.4,
    awayOdds: 4.4,
  },
  {
    key: "C1",
    group: "ג",
    home: "אנגליה",
    away: "ארצות הברית",
    homeOdds: 1.65,
    drawOdds: 3.8,
    awayOdds: 5.8,
  },
  {
    key: "C2",
    group: "ג",
    home: "סנגל",
    away: "אקוודור",
    homeOdds: 2.05,
    drawOdds: 3.15,
    awayOdds: 4.1,
  },
  {
    key: "D1",
    group: "ד",
    home: "ספרד",
    away: "יפן",
    homeOdds: 1.48,
    drawOdds: 4.4,
    awayOdds: 7.2,
  },
  {
    key: "D2",
    group: "ד",
    home: "גרמניה",
    away: "קוסטה ריקה",
    homeOdds: 1.25,
    drawOdds: 6.0,
    awayOdds: 12.0,
  },
  {
    key: "E1",
    group: "ה",
    home: "בלגיה",
    away: "קנדה",
    homeOdds: 1.72,
    drawOdds: 3.9,
    awayOdds: 4.9,
  },
  {
    key: "E2",
    group: "ה",
    home: "קרואטיה",
    away: "מרוקו",
    homeOdds: 2.1,
    drawOdds: 3.25,
    awayOdds: 3.9,
  },
  {
    key: "F1",
    group: "ו",
    home: "ברזיל",
    away: "סרביה",
    homeOdds: 1.42,
    drawOdds: 4.6,
    awayOdds: 8.0,
  },
  {
    key: "F2",
    group: "ו",
    home: "שוויץ",
    away: "קמרון",
    homeOdds: 1.88,
    drawOdds: 3.35,
    awayOdds: 4.6,
  },
];
