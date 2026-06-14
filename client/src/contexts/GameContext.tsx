/**
 * GameContext — MathQuest Kids
 * ─────────────────────────────────────────────────────────────
 * Global state for navigation, game rounds, score, lives,
 * star tracking, and persistent level progress.
 * ─────────────────────────────────────────────────────────────
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useReducer,
} from "react";
import {
  generateRound,
  validateAnswer,
  calculateStars,
  type Question,
  type GradeLevel,
} from "@/lib/mathEngine";

// ── Screen & Level Types ──────────────────────────────────────

export type Screen = "home" | "levels" | "game" | "summary" | "parents";
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
    subtitle: "Bigger Numbers",
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
    subtitle: "Multiply & Divide",
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

// ── Round State ───────────────────────────────────────────────

export interface RoundResult {
  questionId: string;
  choiceId: string;
  correct: boolean;
  timeTaken?: number;
}

export interface RoundState {
  questions: Question[];
  currentIndex: number;
  results: RoundResult[];
  score: number;          // correct answers this round
  lives: number;          // remaining lives (start: 3)
  starsEarned: number;    // calculated at round end
  isComplete: boolean;
}

const QUESTIONS_PER_ROUND = 10;
const MAX_LIVES = 3;

function createRound(level: GradeLevel): RoundState {
  return {
    questions: generateRound(level, QUESTIONS_PER_ROUND),
    currentIndex: 0,
    results: [],
    score: 0,
    lives: MAX_LIVES,
    starsEarned: 0,
    isComplete: false,
  };
}

// ── Reducer ───────────────────────────────────────────────────

type RoundAction =
  | { type: "ANSWER"; choiceId: string }
  | { type: "NEXT_QUESTION" }
  | { type: "RESET"; level: GradeLevel };

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
      };

      const newScore = correct ? state.score + 1 : state.score;
      const newLives = correct ? state.lives : Math.max(0, state.lives - 1);
      const newResults = [...state.results, newResult];

      // Round ends when all questions answered OR lives run out
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
      return createRound(action.level);
    }

    default:
      return state;
  }
}

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
  selectLevel: (level: GradeZone) => void;

  // Round state
  round: RoundState;
  currentQuestion: Question | null;
  answerQuestion: (choiceId: string) => void;
  nextQuestion: () => void;
  restartRound: () => void;

  // Derived helpers
  totalStarsEarned: number;
}

const GameContext = createContext<GameContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedLevel, setSelectedLevel] = useState<GradeZone | null>(null);
  const [levels, setLevels] = useState<LevelInfo[]>(INITIAL_LEVELS);
  const [round, dispatch] = useReducer(roundReducer, createRound("KG"));

  // ── Navigation ──────────────────────────────────────────────

  const navigateTo = useCallback((s: Screen) => setScreen(s), []);

  const goHome = useCallback(() => {
    setScreen("home");
    setSelectedLevel(null);
  }, []);

  const goToLevels = useCallback(() => setScreen("levels"), []);

  // ── Level Selection ─────────────────────────────────────────

  const selectLevel = useCallback(
    (level: GradeZone) => {
      const info = levels.find((l) => l.id === level);
      if (!info?.unlocked) return;
      setSelectedLevel(level);
      dispatch({ type: "RESET", level: level as GradeLevel });
      setScreen("game");
    },
    [levels]
  );

  // ── Answer Handling ─────────────────────────────────────────

  const answerQuestion = useCallback(
    (choiceId: string) => {
      dispatch({ type: "ANSWER", choiceId });
    },
    []
  );

  // Called after the feedback animation completes
  const nextQuestion = useCallback(() => {
    if (round.isComplete) {
      // Persist best stars to level record
      setLevels((prev) =>
        prev.map((l) => {
          if (l.id !== selectedLevel) return l;
          const newStars = Math.max(l.stars, round.starsEarned);
          // Unlock the next level if 1+ stars earned
          return { ...l, stars: newStars, gamesPlayed: l.gamesPlayed + 1 };
        })
      );
      // Unlock next level if earned at least 1 star
      if (round.starsEarned >= 1) {
        setLevels((prev) => {
          const idx = prev.findIndex((l) => l.id === selectedLevel);
          if (idx < 0 || idx >= prev.length - 1) return prev;
          return prev.map((l, i) =>
            i === idx + 1 ? { ...l, unlocked: true } : l
          );
        });
      }
      setScreen("summary");
    } else {
      dispatch({ type: "NEXT_QUESTION" });
    }
  }, [round.isComplete, round.starsEarned, selectedLevel]);

  const restartRound = useCallback(() => {
    if (!selectedLevel) return;
    dispatch({ type: "RESET", level: selectedLevel as GradeLevel });
    setScreen("game");
  }, [selectedLevel]);

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
        round,
        currentQuestion,
        answerQuestion,
        nextQuestion,
        restartRound,
        totalStarsEarned,
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
