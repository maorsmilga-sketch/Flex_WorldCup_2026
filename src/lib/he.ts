/** כל המחרוזות המוצגות למשתמש — עברית בלבד */
export const he = {
  appTitle: "גביע העולם Flex",
  tagline: "תחרות ניבויים לעובדי פלקס ישראל",
  navHome: "בית",
  navDashboard: "לוח בקרה",
  navPhase1: "שלב הבתים",
  navPhase2: "נוקאאוט",
  navLeaderboard: "לוח תוצאות",
  navLogin: "כניסה",
  navLogout: "יציאה",
  navProfile: "פרופיל",

  phase1Title: "שלב הבתים",
  phase2Title: "שלב הנוקאאוט",
  phase1LockLabel: "נעילת ניבויים שלב בתים",
  phase2LockLabel: "נעילת ניבויים נוקאאוט",
  locked: "נעול",
  open: "פתוח לעריכה",
  save: "שמירה",
  saving: "שומר…",
  saved: "נשמר",
  error: "שגיאה",
  loading: "טוען…",

  landingCta: "התחלת ניבויים",
  landingSub:
    "נחשו תוצאות משחקים, בונוסים ואלופה — הכל בעברית, מותאם לנייד, עם טיימרים ברורים לכל שלב.",

  countdownDays: "ימים",
  countdownHours: "שעות",
  countdownMinutes: "דקות",
  countdownSeconds: "שניות",

  loginTitle: "כניסה עם אימייל",
  loginHint: "נשלח אליכם קישור כניסה חד-פעמי (ללא סיסמה).",
  email: "אימייל ארגוני",
  sendLink: "שליחת קישור",
  checkEmail: "בדקו את תיבת הדואר לאישור הכניסה.",

  profileTitle: "השלמת פרופיל",
  fullName: "שם מלא",
  department: "מחלקה",
  site: "אתר",
  continue: "המשך",

  dashboardWelcome: "שלום",
  dashboardPhase1: "מעבר לניבויי שלב הבתים",
  dashboardPhase2: "מעבר לניבויי הנוקאאוט",
  dashboardScores: "הניקוד שלכם מתעדכן אוטומטית לאחר כל משחק.",

  matchesTitle: "משחקים — ניבוי 1 / X / 2",
  pickHome: "1 — ניצחון בית",
  pickDraw: "X — תיקו",
  pickAway: "2 — ניצחון חוץ",
  underdogHint:
    "סימון אדום: מועמד חיצוני (יחס מעל 3.5). ניחוש נכון מעניק +8 נקודות בונוס.",
  underdogToggle: "אני מנחש ניצחון של מועמד חיצוני במשחק זה (+8 אם יוצא)",

  bonusTopScorer: "מלך שערים (בונוס 5 נק')",
  bonusHighScoreTeam: "הקבוצה שתבקיע הכי הרבה (5 נק')",
  bonusLeastConceded: "הקבוצה שתספוג הכי מעט (5 נק')",
  bonusTournamentWinner: "זוכת הטורניר עכשיו (10 נק' בסוף הטורניר אם נכון)",

  phase2Bracket: "בחירת מעפילים בברקט",
  phase2FinalScore: "תוצאת הגמר אחרי 90 דקות (5 נקודות)",
  phase2Stats: "סטטיסטיקות טורניר (7 נק' כל אחד)",
  homeGoals: "שערי בית",
  awayGoals: "שערי חוץ",

  leaderboardTitle: "לוח תוצאות",
  filterGlobal: "כל החברה",
  filterSite: "לפי אתר",
  filterDepartment: "לפי מחלקה",
  filterFriends: "החברים שלי",
  rank: "דירוג",
  name: "שם",
  score: "ניקוד",
  siteCol: "אתר",
  star: "מעקב",
  unstar: "הסרת מעקב",
  you: "אתם",
  stickyMe: "המיקום שלכם",

  configureEnv:
    "יש ליצור קובץ .env.local בתיקיית web (ליד package.json) ולהגדיר בו NEXT_PUBLIC_SUPABASE_URL ו-NEXT_PUBLIC_SUPABASE_ANON_KEY. לאחר שמירה — עצרו והפעילו מחדש את npm run dev.",

  tiebreakHint:
    "במקרה של שוויון בניקוד — קודם מי שנרשם מוקדם יותר לפי חותמת זמן.",
} as const;
