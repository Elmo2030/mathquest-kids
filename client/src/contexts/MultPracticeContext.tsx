/**
 * MultPracticeContext — MathQuest Kids
 * ─────────────────────────────────────────────────────────────
 * Manages all state for the dedicated Multiplication Table
 * Free Practice mode:
 *  - Current streak & best streak (localStorage)
 *  - Per-fact error tracking: Record<"AxB", { attempts, errors }>
 *  - Session stats: total answered, correct, session start time
 *  - Navigation: open / close the practice screen
 * ─────────────────────────────────────────────────────────────
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";

// ── Types ─────────────────────────────────────────────────────

export interface MultFactRecord {
  factKey: string;   // e.g. "7x8"
  a: number;
  b: number;
  attempts: number;
  errors: number;
}

export interface MultPracticeStats {
  totalAnswered: number;
  totalCorrect: number;
  sessionStartTime: number;
}

export interface MultPracticeContextValue {
  // Navigation
  isOpen: boolean;
  openPractice: () => void;
  closePractice: () => void;

  // Streak
  currentStreak: number;
  bestStreak: number;
  resetStreak: () => void;
  incrementStreak: () => void;

  // Per-fact analytics
  factRecords: MultFactRecord[];
  recordAnswer: (a: number, b: number, correct: boolean) => void;
  getWeakFacts: (topN?: number) => MultFactRecord[];

  // Session stats
  stats: MultPracticeStats;
  resetSession: () => void;
}

// ── Storage keys ──────────────────────────────────────────────

const LS_BEST_STREAK = "mq_mult_best_streak_v1";
const LS_FACT_RECORDS = "mq_mult_fact_records_v1";

function loadLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveLS<T>(key: string, value: T): void {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
}

// ── Context ───────────────────────────────────────────────────

const MultPracticeContext = createContext<MultPracticeContextValue | null>(null);

export function MultPracticeProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState<number>(() => loadLS(LS_BEST_STREAK, 0));
  const [factRecords, setFactRecords] = useState<MultFactRecord[]>(() =>
    loadLS<MultFactRecord[]>(LS_FACT_RECORDS, [])
  );
  const [stats, setStats] = useState<MultPracticeStats>({
    totalAnswered: 0,
    totalCorrect: 0,
    sessionStartTime: Date.now(),
  });

  const openPractice = useCallback(() => {
    setStats({ totalAnswered: 0, totalCorrect: 0, sessionStartTime: Date.now() });
    setCurrentStreak(0);
    setIsOpen(true);
  }, []);

  const closePractice = useCallback(() => {
    setIsOpen(false);
    setCurrentStreak(0);
  }, []);

  const incrementStreak = useCallback(() => {
    setCurrentStreak((prev) => {
      const next = prev + 1;
      setBestStreak((best) => {
        const newBest = Math.max(best, next);
        saveLS(LS_BEST_STREAK, newBest);
        return newBest;
      });
      return next;
    });
  }, []);

  const resetStreak = useCallback(() => {
    setCurrentStreak(0);
  }, []);

  const recordAnswer = useCallback((a: number, b: number, correct: boolean) => {
    const factKey = `${a}x${b}`;
    setFactRecords((prev) => {
      const existing = prev.find((r) => r.factKey === factKey);
      let updated: MultFactRecord[];
      if (existing) {
        updated = prev.map((r) =>
          r.factKey === factKey
            ? { ...r, attempts: r.attempts + 1, errors: r.errors + (correct ? 0 : 1) }
            : r
        );
      } else {
        updated = [
          ...prev,
          { factKey, a, b, attempts: 1, errors: correct ? 0 : 1 },
        ];
      }
      saveLS(LS_FACT_RECORDS, updated);
      return updated;
    });

    setStats((prev) => ({
      ...prev,
      totalAnswered: prev.totalAnswered + 1,
      totalCorrect: prev.totalCorrect + (correct ? 1 : 0),
    }));
  }, []);

  // Return top-N weakest facts (highest error rate, min 2 attempts)
  const getWeakFacts = useCallback(
    (topN = 6): MultFactRecord[] => {
      return [...factRecords]
        .filter((r) => r.attempts >= 2 && r.errors > 0)
        .sort((a, b) => b.errors / b.attempts - a.errors / a.attempts)
        .slice(0, topN);
    },
    [factRecords]
  );

  const resetSession = useCallback(() => {
    setStats({ totalAnswered: 0, totalCorrect: 0, sessionStartTime: Date.now() });
    setCurrentStreak(0);
  }, []);

  return (
    <MultPracticeContext.Provider
      value={{
        isOpen,
        openPractice,
        closePractice,
        currentStreak,
        bestStreak,
        resetStreak,
        incrementStreak,
        factRecords,
        recordAnswer,
        getWeakFacts,
        stats,
        resetSession,
      }}
    >
      {children}
    </MultPracticeContext.Provider>
  );
}

export function useMultPractice() {
  const ctx = useContext(MultPracticeContext);
  if (!ctx) {
    // Return safe defaults when used outside provider (shouldn't happen)
    return {
      isOpen: false,
      openPractice: () => {},
      closePractice: () => {},
      currentStreak: 0,
      bestStreak: 0,
      resetStreak: () => {},
      incrementStreak: () => {},
      factRecords: [],
      recordAnswer: () => {},
      getWeakFacts: () => [],
      stats: { totalAnswered: 0, totalCorrect: 0, sessionStartTime: Date.now() },
      resetSession: () => {},
    } as MultPracticeContextValue;
  }
  return ctx;
}
