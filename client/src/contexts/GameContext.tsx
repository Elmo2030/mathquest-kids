/**
 * GameContext — MathQuest Kids
 * Global state for navigation, score, lives, and level selection.
 * Math logic is NOT implemented here yet (Task 1 shell only).
 */

import React, { createContext, useContext, useState, useCallback } from "react";

export type Screen = "home" | "levels" | "game" | "parents";

export type GradeZone = "KG" | "G1" | "G2" | "G3";

export interface LevelInfo {
  id: GradeZone;
  label: string;
  subtitle: string;
  color: string;
  bgColor: string;
  shadowColor: string;
  emoji: string;
  unlocked: boolean;
  stars: number; // 0-3
  totalStars: number;
}

export const LEVELS: LevelInfo[] = [
  {
    id: "KG",
    label: "Kindergarten",
    subtitle: "Counting & Numbers",
    color: "oklch(0.18 0.04 270)",
    bgColor: "oklch(0.82 0.17 85)",
    shadowColor: "oklch(0.62 0.12 85)",
    emoji: "🌟",
    unlocked: true,
    stars: 2,
    totalStars: 3,
  },
  {
    id: "G1",
    label: "Grade 1",
    subtitle: "Adding & Subtracting",
    color: "white",
    bgColor: "oklch(0.58 0.19 250)",
    shadowColor: "oklch(0.42 0.19 250)",
    emoji: "🚀",
    unlocked: true,
    stars: 1,
    totalStars: 3,
  },
  {
    id: "G2",
    label: "Grade 2",
    subtitle: "Bigger Numbers",
    color: "white",
    bgColor: "oklch(0.65 0.2 145)",
    shadowColor: "oklch(0.48 0.2 145)",
    emoji: "🎯",
    unlocked: false,
    stars: 0,
    totalStars: 3,
  },
  {
    id: "G3",
    label: "Grade 3",
    subtitle: "Multiply & Divide",
    color: "white",
    bgColor: "oklch(0.62 0.22 25)",
    shadowColor: "oklch(0.46 0.22 25)",
    emoji: "🏆",
    unlocked: false,
    stars: 0,
    totalStars: 3,
  },
];

interface GameState {
  screen: Screen;
  selectedLevel: GradeZone | null;
  score: number;
  lives: number;
  questionIndex: number;
  totalQuestions: number;
  levels: LevelInfo[];
}

interface GameContextValue extends GameState {
  navigateTo: (screen: Screen) => void;
  selectLevel: (level: GradeZone) => void;
  goHome: () => void;
  goToLevels: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>({
    screen: "home",
    selectedLevel: null,
    score: 0,
    lives: 3,
    questionIndex: 1,
    totalQuestions: 10,
    levels: LEVELS,
  });

  const navigateTo = useCallback((screen: Screen) => {
    setState((prev) => ({ ...prev, screen }));
  }, []);

  const selectLevel = useCallback((level: GradeZone) => {
    setState((prev) => ({
      ...prev,
      selectedLevel: level,
      screen: "game",
      score: 0,
      lives: 3,
      questionIndex: 1,
    }));
  }, []);

  const goHome = useCallback(() => {
    setState((prev) => ({ ...prev, screen: "home", selectedLevel: null }));
  }, []);

  const goToLevels = useCallback(() => {
    setState((prev) => ({ ...prev, screen: "levels" }));
  }, []);

  return (
    <GameContext.Provider
      value={{ ...state, navigateTo, selectLevel, goHome, goToLevels }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
