// Single source of truth for fetching leaderboard data from Google Sheets.

const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID as string;
const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY as string;
const BASE = 'https://sheets.googleapis.com/v4/spreadsheets';

export interface StudentRow {
  name: string;
  mobile: string;
  score: number; // Raw score/Total_score
  finalScore: number; // The score used for rankings
  winnerUp: number;
  runnerUp: number;
  weekNumber: number;
}

export interface Student {
  mobile: string;
  name: string;
  totalScore: number; // This will now represent sum of final_score
  totalWinnerUp: number;
  totalRunnerUp: number;
  weeklyScores: Record<number, number>;
  weeklyWinnerUp: Record<number, number>;
  weeklyRunnerUp: Record<number, number>;
}

function assertConfig() {
  if (!SPREADSHEET_ID) throw new Error('VITE_SPREADSHEET_ID is not configured');
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    throw new Error('VITE_GOOGLE_SHEETS_API_KEY is not configured');
  }
}

function normalizeMobile(raw: unknown): string | null {
  if (raw == null) return null;
  const digits = String(raw).replace(/\D/g, '');
  if (digits.length < 10) return null;
  return digits.slice(-10);
}

export async function fetchAllSheetNames(): Promise<
  Array<{ sheetName: string; weekNumber: number }>
> {
  assertConfig();
  const url = `${BASE}/${SPREADSHEET_ID}?key=${API_KEY}&fields=sheets.properties(title)`;
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to fetch spreadsheet metadata [${res.status}]: ${body}`);
  }
  const data = await res.json();
  const sheets: Array<{ properties?: { title?: string } }> = data?.sheets ?? [];
  const out: Array<{ sheetName: string; weekNumber: number }> = [];
  for (const s of sheets) {
    const title = s.properties?.title ?? '';
    const m = /^week[- ]?(\d+)$/i.exec(title);
    if (m) out.push({ sheetName: title, weekNumber: parseInt(m[1], 10) });
  }
  out.sort((a, b) => a.weekNumber - b.weekNumber);
  return out;
}

export async function fetchSheetRows(
  sheetName: string,
  weekNumber: number
): Promise<StudentRow[]> {
  assertConfig();
  const range = `${sheetName}!A1:Z1000`;
  const url = `${BASE}/${SPREADSHEET_ID}/values/${range}?key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `Failed to fetch sheet ${sheetName} [${res.status}]: ${body}`
    );
  }
  const data = await res.json();
  const values: string[][] = data?.values ?? [];
  if (values.length < 2) return [];

  const headers = values[0].map((h) => (h ?? '').toString().trim().toLowerCase());

  const findIdx = (...candidates: string[]) => {
    for (const c of candidates) {
      const i = headers.indexOf(c.toLowerCase());
      if (i !== -1) return i;
    }
    // fuzzy: find a header containing the candidate
    for (const c of candidates) {
      const cl = c.toLowerCase();
      const i = headers.findIndex((h) => h.includes(cl));
      if (i !== -1) return i;
    }
    return -1;
  };

  const nameIdx = findIdx('student name', 'name');
  const mobileIdx = findIdx('mobile number', 'mobile', 'phone');
  const scoreIdx = findIdx('total_score', 'total score', 'score');
  const finalScoreIdx = findIdx('final_score', 'final score', 'Final_Score');
  const winnerUpIdx = findIdx('winner_up', 'winner up', 'Winner-Up');
  const runnerUpIdx = findIdx('runner_up', 'runner up', 'Runner_Up');

  if (nameIdx === -1 || mobileIdx === -1) return [];

  const rows: StudentRow[] = [];
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if (!row) continue;
    const mobile = normalizeMobile(row[mobileIdx]);
    if (!mobile) continue;
    const rawScore = scoreIdx !== -1 ? row[scoreIdx] : 0;
    const rawFinalScore = finalScoreIdx !== -1 ? row[finalScoreIdx] : 0;
    const rawWinnerUp = winnerUpIdx !== -1 ? row[winnerUpIdx] : 0;
    const rawRunnerUp = runnerUpIdx !== -1 ? row[runnerUpIdx] : 0;

    const parseNum = (val: any) => {
      if (val == null || String(val).trim() === '') return 0;
      const n = Number(String(val).replace(/[^\d.\-]/g, ''));
      return isFinite(n) ? n : 0;
    };

    const score = parseNum(rawScore);
    const finalScore = finalScoreIdx !== -1 ? parseNum(rawFinalScore) : score;
    const winnerUp = parseNum(rawWinnerUp);
    const runnerUp = parseNum(rawRunnerUp);

    const name = String(row[nameIdx] ?? '').trim();
    rows.push({ name, mobile, score, finalScore, winnerUp, runnerUp, weekNumber });
  }
  return rows;
}

export async function fetchAllStudents(): Promise<Student[]> {
  const sheets = await fetchAllSheetNames();
  const allRows = await Promise.all(
    sheets.map((s) => fetchSheetRows(s.sheetName, s.weekNumber))
  );

  // Group by normalized mobile
  const map = new Map<string, Student & { _latestWeekForName: number }>();
  for (const rows of allRows) {
    for (const r of rows) {
      const existing = map.get(r.mobile);
      if (existing) {
        existing.weeklyScores[r.weekNumber] =
          Number(existing.weeklyScores[r.weekNumber] ?? 0) + Number(r.finalScore);
        existing.totalScore = Number(existing.totalScore) + Number(r.finalScore);
        
        existing.weeklyWinnerUp[r.weekNumber] = (existing.weeklyWinnerUp[r.weekNumber] ?? 0) + r.winnerUp;
        existing.totalWinnerUp += r.winnerUp;
        
        existing.weeklyRunnerUp[r.weekNumber] = (existing.weeklyRunnerUp[r.weekNumber] ?? 0) + r.runnerUp;
        existing.totalRunnerUp += r.runnerUp;

        if (r.weekNumber >= existing._latestWeekForName && r.name) {
          existing.name = r.name;
          existing._latestWeekForName = r.weekNumber;
        }
      } else {
        map.set(r.mobile, {
          mobile: r.mobile,
          name: r.name,
          totalScore: Number(r.finalScore),
          totalWinnerUp: r.winnerUp,
          totalRunnerUp: r.runnerUp,
          weeklyScores: { [r.weekNumber]: Number(r.finalScore) },
          weeklyWinnerUp: { [r.weekNumber]: r.winnerUp },
          weeklyRunnerUp: { [r.weekNumber]: r.runnerUp },
          _latestWeekForName: r.weekNumber,
        });
      }
    }
  }

  const out = Array.from(map.values()).map(({ _latestWeekForName, ...s }) => s);
  out.sort((a, b) => b.totalScore - a.totalScore);
  return out;
}
