/**
 * GameContext — MathQuest Kids
 * ─────────────────────────────────────────────────────────────
 * Global state for navigation, game rounds, score, lives,
 * star tracking, sub-level progression, per-operation
 * answer history, playtime tracking, and progress reset.
 * All persistent state is saved to localStorage.
 *
 * Sub-level Progression:
 *   Each grade has named sub-levels (operations).
 *   PASS_THRESHOLD correct answers in a sub-level → it is "passed".
 *   All sub-levels in a grade passed → grade is "mastered".
 *   Grade mastered → next grade unlocked.
 * ─────────────────────────────────────────────────────────────
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useReducer,
  useEffect,
  useRef,
} from "react";
import {
  generateAdaptiveQuestion,
  generateRound,
  generateEndlessRound,
  validateAnswer,
  calculateStars,
  getSubLevels,
  getTierFromStreak,
  PASS_THRESHOLD,
  QUESTIONS_PER_ROUND,
  type Question,
  type GradeLevel,
  type DifficultyTier,
} from "@/lib/mathEngine";

// ── Screen & Level Types ──────────────────────────────────────

export type Screen = "home" | "levels" | "game" | "summary" | "parents" | "victory" | "endless" | "trophy" | "levelcomplete";
export type GradeZone = "KG" | "G1" | "G2" | "G3";

export interface LevelInfo {
  id: GradeZone;
  label: string;
  subtitle: string;
  bgColor: string;
  shadowColor: string;
  textColor: string;
  emoji: string;
  unlocked: boolean;
  stars: number;       // best stars earned (0–3)
  totalStars: number;  // always 3
  gamesPlayed: number;
}

export const INITIAL_LEVELS: LevelInfo[] = [
  {
    id: "KG",
    label: "Kindergarten",
    subtitle: "Counting & Numbers",
    bgColor: "oklch(0.82 0.17 85)",
    shadowColor: "oklch(0.62 0.12 85)",
    textColor: "oklch(0.18 0.04 270)",
    emoji: "🌟",
    unlocked: true,
    stars: 0,
    totalStars: 3,
    gamesPlayed: 0,
  },
  {
    id: "G1",
    label: "Grade 1",
    subtitle: "Adding & Subtracting",
    bgColor: "oklch(0.58 0.19 250)",
    shadowColor: "oklch(0.42 0.19 250)",
    textColor: "white",
    emoji: "🚀",
    unlocked: true,
    stars: 0,
    totalStars: 3,
    gamesPlayed: 0,
  },
  {
    id: "G2",
    label: "Grade 2",
    subtitle: "Bigger Numbers & Times",
    bgColor: "oklch(0.65 0.2 145)",
    shadowColor: "oklch(0.48 0.2 145)",
    textColor: "white",
    emoji: "🎯",
    unlocked: false,
    stars: 0,
    totalStars: 3,
    gamesPlayed: 0,
  },
  {
    id: "G3",
    label: "Grade 3",
    subtitle: "Multiply, Divide & Fractions",
    bgColor: "oklch(0.62 0.22 25)",
    shadowColor: "oklch(0.46 0.22 25)",
    textColor: "white",
    emoji: "🏆",
    unlocked: false,
    stars: 0,
    totalStars: 3,
    gamesPlayed: 0,
  },
];

// ── Sub-level Progress ────────────────────────────────────────

/** Per-sub-level progress record */
export interface SubLevelProgress {
  subLevelId: string;
  grade: GradeZone;
  label: string;
  emoji: string;
  passed: boolean;
  /** Number of correct answers accumulated (resets when passed) */
  correctCount: number;
  /** Total attempts ever */
  totalAttempts: number;
  /** Total correct ever (for history) */
  totalCorrect: number;
}

/** Per-question answer history entry (for Parents Dashboard) */
export interface AnswerHistoryEntry {
  timestamp: number;
  grade: GradeZone;
  subLevelId: string;
  subLevelLabel: string;
  questionType: string;
  correct: boolean;
  questionText: string;
}

/** Persistent analytics state */
export interface AnalyticsState {
  /** Total play time in seconds */
  totalPlaySeconds: number;
  /** Total questions answered across all sessions */
  totalQuestionsAnswered: number;
  /** Total correct answers across all sessions */
  totalCorrectAnswers: number;
  /** Session start timestamp (null when not in game) */
  sessionStartedAt: number | null;
}

function buildInitialSubLevelProgress(): SubLevelProgress[] {
  const grades: GradeZone[] = ["KG", "G1", "G2", "G3"];
  return grades.flatMap((grade) =>
    getSubLevels(grade as GradeLevel).map((sub) => ({
      subLevelId: sub.id,
      grade,
      label: sub.label,
      emoji: sub.emoji,
      passed: false,
      correctCount: 0,
      totalAttempts: 0,
      totalCorrect: 0,
    }))
  );
}

// ── Round State ───────────────────────────────────────────────

export interface RoundResult {
  questionId: string;
  choiceId: string;
  correct: boolean;
  subLevelId: string;
  questionType: string;
  questionText: string;
}

export interface RoundState {
  questions: Question[];
  currentIndex: number;
  results: RoundResult[];
  score: number;
  lives: number;
  starsEarned: number;
  isComplete: boolean;
  /** Sub-level being focused in this round (null = mixed grade round) */
  focusedSubLevelId: string | null;
  /** Correct answers in this round towards sub-level pass */
  subLevelCorrectThisRound: number;
}

const MAX_LIVES = 3;

function createRound(
  level: GradeLevel,
  focusedSubLevelId: string | null = null
): RoundState {
  const questions = focusedSubLevelId
    ? Array.from({ length: QUESTIONS_PER_ROUND }, () =>
        generateAdaptiveQuestion(focusedSubLevelId, "normal")
      )
    : generateRound(level, QUESTIONS_PER_ROUND);

  return {
    questions,
    currentIndex: 0,
    results: [],
    score: 0,
    lives: MAX_LIVES,
    starsEarned: 0,
    isComplete: false,
    focusedSubLevelId,
    subLevelCorrectThisRound: 0,
  };
}

// ── Reducer ───────────────────────────────────────────────────

type RoundAction =
  | { type: "ANSWER"; choiceId: string }
  | { type: "NEXT_QUESTION" }
  | { type: "RESET"; level: GradeLevel; focusedSubLevelId?: string | null; endless?: boolean };

function roundReducer(state: RoundState, action: RoundAction): RoundState {
  switch (action.type) {
    case "ANSWER": {
      const question = state.questions[state.currentIndex];
      if (!question) return state;

      const correct = validateAnswer(question, action.choiceId);
      const newResult: RoundResult = {
        questionId: question.id,
        choiceId: action.choiceId,
        correct,
        subLevelId: question.subLevelId,
        questionType: question.type,
        questionText: question.text,
      };

      const newScore = correct ? state.score + 1 : state.score;
      const newLives = correct ? state.lives : Math.max(0, state.lives - 1);
      const newResults = [...state.results, newResult];
      const newSubLevelCorrect = correct
        ? state.subLevelCorrectThisRound + 1
        : state.subLevelCorrectThisRound;

      const isLastQuestion = state.currentIndex >= state.questions.length - 1;
      const isComplete = isLastQuestion || newLives === 0;
      const starsEarned = isComplete
        ? calculateStars(newScore, state.questions.length)
        : 0;

      return {
        ...state,
        results: newResults,
        score: newScore,
        lives: newLives,
        starsEarned,
        isComplete,
        subLevelCorrectThisRound: newSubLevelCorrect,
      };
    }

    case "NEXT_QUESTION": {
      if (state.isComplete) return state;
      return {
        ...state,
        currentIndex: Math.min(
          state.currentIndex + 1,
          state.questions.length - 1
        ),
      };
    }

    case "RESET": {
      if (action.endless) {
        // Endless mode: generate a large batch of mixed questions from all grades
        const questions = generateEndlessRound(QUESTIONS_PER_ROUND);
        return {
          questions,
          currentIndex: 0,
          results: [],
          score: 0,
          lives: MAX_LIVES,
          starsEarned: 0,
          isComplete: false,
          focusedSubLevelId: null,
          subLevelCorrectThisRound: 0,
        };
      }
      return createRound(action.level, action.focusedSubLevelId ?? null);
    }

    default:
      return state;
  }
}

// ── localStorage helpers ──────────────────────────────────────

const LS_LEVELS_KEY    = "mq_levels_v2";
const LS_SUBLEVEL_KEY  = "mq_sublevel_progress_v2";
const LS_HISTORY_KEY   = "mq_answer_history_v2";
const LS_ANALYTICS_KEY = "mq_analytics_v1";

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

const INITIAL_ANALYTICS: AnalyticsState = {
  totalPlaySeconds: 0,
  totalQuestionsAnswered: 0,
  totalCorrectAnswers: 0,
  sessionStartedAt: null,
};

// ── Context Value ─────────────────────────────────────────────

interface GameContextValue {
  // Navigation
  screen: Screen;
  navigateTo: (screen: Screen) => void;
  goHome: () => void;
  goToLevels: () => void;

  // Level selection & progress
  levels: LevelInfo[];
  selectedLevel: GradeZone | null;
  selectLevel: (level: GradeZone, subLevelId?: string) => void;

  // Sub-level progression
  subLevelProgress: SubLevelProgress[];
  activeSubLevelId: string | null;
  getSubLevelProgressForGrade: (grade: GradeZone) => SubLevelProgress[];
  isSubLevelPassed: (subLevelId: string) => boolean;
  isGradeMastered: (grade: GradeZone) => boolean;

  // Answer history (for Parents Dashboard)
  answerHistory: AnswerHistoryEntry[];

  // Analytics
  analytics: AnalyticsState;

  // Round state
  round: RoundState;
  currentQuestion: Question | null;
  answerQuestion: (choiceId: string) => void;
  nextQuestion: () => void;
  restartRound: () => void;

  // Derived helpers
  totalStarsEarned: number;

  // Endless mode
  isEndlessModeUnlocked: boolean;
  endlessScore: number;
  startEndlessMode: () => void;

  // All levels complete
  allLevelsComplete: boolean;

  // Adaptive difficulty
  streak: number;
  difficultyTier: DifficultyTier;

  // Badge-related counters
  fastAnswerCount: number;  // correct answers under 3 s

  // Progress reset
  resetProgress: () => void;

  // Trophy Room
  goToTrophy: () => void;

  // Level completion flow
  levelJustUnlocked: GradeZone | null;  // grade that was just unlocked after finishing a level
  startNextLevel: () => void;           // start the first round of the newly unlocked grade
  dismissLevelComplete: () => void;     // go to level select without starting next level
}

const GameContext = createContext<GameContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedLevel, setSelectedLevel] = useState<GradeZone | null>(null);
  const [activeSubLevelId, setActiveSubLevelId] = useState<string | null>(null);

  const [levels, setLevels] = useState<LevelInfo[]>(() =>
    loadFromStorage(LS_LEVELS_KEY, INITIAL_LEVELS)
  );

  const [subLevelProgress, setSubLevelProgress] = useState<SubLevelProgress[]>(
    () => {
      const stored = loadFromStorage<SubLevelProgress[]>(LS_SUBLEVEL_KEY, []);
      const initial = buildInitialSubLevelProgress();
      return initial.map((init) => {
        const found = stored.find((s) => s.subLevelId === init.subLevelId);
        return found ? { ...init, ...found } : init;
      });
    }
  );

  const [answerHistory, setAnswerHistory] = useState<AnswerHistoryEntry[]>(() =>
    loadFromStorage(LS_HISTORY_KEY, [])
  );

  const [analytics, setAnalytics] = useState<AnalyticsState>(() =>
    loadFromStorage(LS_ANALYTICS_KEY, INITIAL_ANALYTICS)
  );

  const [round, dispatch] = useReducer(roundReducer, createRound("KG"));
  const [levelJustUnlocked, setLevelJustUnlocked] = useState<GradeZone | null>(null);
  const [endlessScore, setEndlessScore] = useState<number>(() =>
    loadFromStorage<number>("mq_endless_score_v1", 0)
  );

  // Adaptive difficulty & badge counters
  const [streak, setStreak] = useState<number>(0);
  const [fastAnswerCount, setFastAnswerCount] = useState<number>(0);
  const answerStartTimeRef = useRef<number>(Date.now());

  // Reset answer timer whenever a new question is shown
  useEffect(() => {
    answerStartTimeRef.current = Date.now();
  }, [round.currentIndex]);

  const difficultyTier: DifficultyTier = getTierFromStreak(streak);

  // Track playtime: record session start when entering game screen
  const sessionStartRef = useRef<number | null>(null);

  useEffect(() => {
    if (screen === "game") {
      sessionStartRef.current = Date.now();
    } else if (sessionStartRef.current !== null) {
      // Session ended — accumulate elapsed seconds
      const elapsed = Math.round((Date.now() - sessionStartRef.current) / 1000);
      sessionStartRef.current = null;
      if (elapsed > 0) {
        setAnalytics((prev) => ({
          ...prev,
          totalPlaySeconds: prev.totalPlaySeconds + elapsed,
        }));
      }
    }
  }, [screen]);

  // Persist endless score
  useEffect(() => { saveToStorage("mq_endless_score_v1", endlessScore); }, [endlessScore]);

  // Persist to localStorage whenever state changes
  useEffect(() => { saveToStorage(LS_LEVELS_KEY, levels); }, [levels]);
  useEffect(() => { saveToStorage(LS_SUBLEVEL_KEY, subLevelProgress); }, [subLevelProgress]);
  useEffect(() => {
    saveToStorage(LS_HISTORY_KEY, answerHistory.slice(-200));
  }, [answerHistory]);
  useEffect(() => { saveToStorage(LS_ANALYTICS_KEY, analytics); }, [analytics]);

  // ── Navigation ──────────────────────────────────────────────

  const navigateTo = useCallback((s: Screen) => setScreen(s), []);

  const goHome = useCallback(() => {
    setScreen("home");
    setSelectedLevel(null);
    setActiveSubLevelId(null);
  }, []);

  const goToLevels = useCallback(() => setScreen("levels"), []);
  const goToTrophy = useCallback(() => setScreen("trophy"), []);

  // ── Derived: all levels complete ────────────────────────────
  const allLevelsComplete = levels.every((l) => l.stars >= 1) &&
    subLevelProgress.every((s) => s.passed);

  const isEndlessModeUnlocked = allLevelsComplete;

  // ── Endless Mode ─────────────────────────────────────────────
  const startEndlessMode = useCallback(() => {
    dispatch({ type: "RESET", level: "KG", focusedSubLevelId: null, endless: true });
    setSelectedLevel(null);
    setActiveSubLevelId(null);
    setScreen("endless");
  }, []);

  // ── Sub-level helpers ────────────────────────────────────────

  const getSubLevelProgressForGrade = useCallback(
    (grade: GradeZone) =>
      subLevelProgress.filter((s) => s.grade === grade),
    [subLevelProgress]
  );

  const isSubLevelPassed = useCallback(
    (subLevelId: string) =>
      subLevelProgress.find((s) => s.subLevelId === subLevelId)?.passed ?? false,
    [subLevelProgress]
  );

  const isGradeMastered = useCallback(
    (grade: GradeZone) => {
      const subs = subLevelProgress.filter((s) => s.grade === grade);
      return subs.length > 0 && subs.every((s) => s.passed);
    },
    [subLevelProgress]
  );

  // ── Level Selection ─────────────────────────────────────────

  const selectLevel = useCallback(
    (level: GradeZone, subLevelId?: string) => {
      const info = levels.find((l) => l.id === level);
      if (!info?.unlocked) return;
      setSelectedLevel(level);
      const focusId = subLevelId ?? null;
      setActiveSubLevelId(focusId);
      dispatch({ type: "RESET", level: level as GradeLevel, focusedSubLevelId: focusId });
      setScreen("game");
    },
    [levels]
  );

  // ── Answer Handling ─────────────────────────────────────────

  const answerQuestion = useCallback((choiceId: string) => {
    const elapsed = Date.now() - answerStartTimeRef.current;
    dispatch({ type: "ANSWER", choiceId });
    // Update streak & fast-answer counter after dispatch
    // We need to check correctness here directly
    const question = round.questions[round.currentIndex];
    if (!question) return;
    const correct = validateAnswer(question, choiceId);
    setStreak((prev) => correct ? prev + 1 : (prev > 0 ? 0 : prev - 1));
    if (correct && elapsed < 3000) {
      setFastAnswerCount((prev) => prev + 1);
    }
  }, [round.questions, round.currentIndex]);

  // Called after the feedback animation completes
  const nextQuestion = useCallback(() => {
    if (round.isComplete) {
      // ── Persist round results ──────────────────────────────

      // 1. Update per-sub-level progress
      const subLevelCorrectMap: Record<string, number> = {};
      const subLevelAttemptMap: Record<string, number> = {};
      for (const result of round.results) {
        subLevelCorrectMap[result.subLevelId] =
          (subLevelCorrectMap[result.subLevelId] ?? 0) + (result.correct ? 1 : 0);
        subLevelAttemptMap[result.subLevelId] =
          (subLevelAttemptMap[result.subLevelId] ?? 0) + 1;
      }

      setSubLevelProgress((prev) =>
        prev.map((sp) => {
          const correct = subLevelCorrectMap[sp.subLevelId] ?? 0;
          const attempts = subLevelAttemptMap[sp.subLevelId] ?? 0;
          if (attempts === 0) return sp;
          const newCorrectCount = sp.passed ? sp.correctCount : sp.correctCount + correct;
          const passed = sp.passed || newCorrectCount >= PASS_THRESHOLD;
          return {
            ...sp,
            correctCount: passed && !sp.passed ? 0 : newCorrectCount,
            totalAttempts: sp.totalAttempts + attempts,
            totalCorrect: sp.totalCorrect + correct,
            passed,
          };
        })
      );

      // 2. Append answer history entries
      const newEntries: AnswerHistoryEntry[] = round.results.map((r) => {
        const sp = subLevelProgress.find((s) => s.subLevelId === r.subLevelId);
        return {
          timestamp: Date.now(),
          grade: selectedLevel ?? "KG",
          subLevelId: r.subLevelId,
          subLevelLabel: sp?.label ?? r.subLevelId,
          questionType: r.questionType,
          correct: r.correct,
          questionText: r.questionText,
        };
      });
      setAnswerHistory((prev) => [...prev, ...newEntries]);

      // 3. Update analytics totals
      const roundCorrect = round.results.filter((r) => r.correct).length;
      setAnalytics((prev) => ({
        ...prev,
        totalQuestionsAnswered: prev.totalQuestionsAnswered + round.results.length,
        totalCorrectAnswers: prev.totalCorrectAnswers + roundCorrect,
      }));

      // 4. Update level stars and games played
      setLevels((prev) =>
        prev.map((l) => {
          if (l.id !== selectedLevel) return l;
          const newStars = Math.max(l.stars, round.starsEarned);
          return { ...l, stars: newStars, gamesPlayed: l.gamesPlayed + 1 };
        })
      );

      // 5. Unlock next grade if earned ≥1 star and track which grade was just unlocked
      let justUnlockedGrade: GradeZone | null = null;
      if (round.starsEarned >= 1) {
        setLevels((prev) => {
          const idx = prev.findIndex((l) => l.id === selectedLevel);
          if (idx < 0 || idx >= prev.length - 1) return prev;
          const nextLevel = prev[idx + 1];
          if (!nextLevel.unlocked) {
            justUnlockedGrade = nextLevel.id;
          }
          return prev.map((l, i) =>
            i === idx + 1 ? { ...l, unlocked: true } : l
          );
        });
      }

      // Check if all grades are now mastered → Victory Screen
      const updatedSubLevels = subLevelProgress.map((sp) => {
        const correct = subLevelCorrectMap[sp.subLevelId] ?? 0;
        const attempts = subLevelAttemptMap[sp.subLevelId] ?? 0;
        if (attempts === 0) return sp;
        const newCorrectCount = sp.passed ? sp.correctCount : sp.correctCount + correct;
        const passed = sp.passed || newCorrectCount >= PASS_THRESHOLD;
        return { ...sp, correctCount: passed && !sp.passed ? 0 : newCorrectCount, passed };
      });
      const allNowComplete =
        selectedLevel === "G3" &&
        updatedSubLevels.every((s) => s.passed);

      if (allNowComplete) {
        setScreen("victory");
      } else if (justUnlockedGrade) {
        // A new grade was just unlocked — show the Level Complete celebration
        setLevelJustUnlocked(justUnlockedGrade);
        setScreen("levelcomplete");
      } else {
        setScreen("summary");
      }
    } else {
      dispatch({ type: "NEXT_QUESTION" });
    }
  }, [round, selectedLevel, subLevelProgress]);

  // ── Level Complete flow ────────────────────────────────────

  const startNextLevel = useCallback(() => {
    if (!levelJustUnlocked) return;
    const nextGrade = levelJustUnlocked;
    setLevelJustUnlocked(null);
    setSelectedLevel(nextGrade);
    setActiveSubLevelId(null);
    dispatch({ type: "RESET", level: nextGrade as GradeLevel, focusedSubLevelId: null });
    setScreen("game");
  }, [levelJustUnlocked]);

  const dismissLevelComplete = useCallback(() => {
    setLevelJustUnlocked(null);
    setScreen("levels");
  }, []);

  const restartRound = useCallback(() => {
    if (!selectedLevel) return;
    dispatch({
      type: "RESET",
      level: selectedLevel as GradeLevel,
      focusedSubLevelId: activeSubLevelId,
    });
    setScreen("game");
  }, [selectedLevel, activeSubLevelId]);

  // ── Reset Progress ──────────────────────────────────────────

  const resetProgress = useCallback(() => {
    setLevels(INITIAL_LEVELS);
    setSubLevelProgress(buildInitialSubLevelProgress());
    setAnswerHistory([]);
    setAnalytics(INITIAL_ANALYTICS);
    setEndlessScore(0);
    // Clear all localStorage keys
    [LS_LEVELS_KEY, LS_SUBLEVEL_KEY, LS_HISTORY_KEY, LS_ANALYTICS_KEY, "mq_endless_score_v1"].forEach(
      (key) => {
        try { localStorage.removeItem(key); } catch { /* ignore */ }
      }
    );
    setScreen("home");
  }, []);

  // ── Derived ─────────────────────────────────────────────────

  const currentQuestion = round.questions[round.currentIndex] ?? null;
  const totalStarsEarned = levels.reduce((sum, l) => sum + l.stars, 0);

  return (
    <GameContext.Provider
      value={{
        screen,
        navigateTo,
        goHome,
        goToLevels,
        levels,
        selectedLevel,
        selectLevel,
        subLevelProgress,
        activeSubLevelId,
        getSubLevelProgressForGrade,
        isSubLevelPassed,
        isGradeMastered,
        answerHistory,
        analytics,
        round,
        currentQuestion,
        answerQuestion,
        nextQuestion,
        restartRound,
        totalStarsEarned,
        isEndlessModeUnlocked,
        endlessScore,
        startEndlessMode,
        allLevelsComplete,
        streak,
        difficultyTier,
        fastAnswerCount,
        resetProgress,
        goToTrophy,
        levelJustUnlocked,
        startNextLevel,
        dismissLevelComplete,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
