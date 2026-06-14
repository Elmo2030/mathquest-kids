/**
 * BadgeContext — MathQuest Kids
 * ─────────────────────────────────────────────────────────────
 * Manages the badge/achievement system.
 * Persists unlocked badge IDs to localStorage.
 * Exposes an `unlockBadge(id)` function that can be called from
 * anywhere in the app (GameContext, GameScreen, etc.).
 * ─────────────────────────────────────────────────────────────
 */

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ALL_BADGES, BADGE_RARITY_COLORS, type Badge } from "@/lib/badges";

const STORAGE_KEY = "mathquest_badges_v1";

interface BadgeContextValue {
  unlockedIds: Set<string>;
  unlockBadge: (id: string) => void;
  isUnlocked: (id: string) => boolean;
  allBadges: Badge[];
  /** Check multiple unlock conditions at once — call after each answer */
  checkUnlocks: (params: BadgeCheckParams) => void;
}

export interface BadgeCheckParams {
  totalCorrect: number;
  currentStreak: number;
  /** Negative streak (consecutive wrong) */
  wrongStreak: number;
  answerTimeMs: number;
  fastAnswersUnder3s: number;
  gradesMastered: string[];   // e.g. ["KG", "G1"]
  allLevelsComplete: boolean;
  roundCorrect?: number;
  roundTotal?: number;
  isEndlessMode?: boolean;
  endlessTotalAnswered?: number;
}

const BadgeContext = createContext<BadgeContextValue | null>(null);

export function BadgeProvider({ children }: { children: React.ReactNode }) {
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr: string[] = raw ? JSON.parse(raw) : [];
      return new Set<string>(arr);
    } catch {
      return new Set<string>();
    }
  });

  // Toast queue for badge unlock notifications
  const [toastQueue, setToastQueue] = useState<Badge[]>([]);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Persist to localStorage whenever unlockedIds changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(unlockedIds)));
  }, [unlockedIds]);

  const unlockBadge = useCallback((id: string) => {
    setUnlockedIds((prev) => {
      if (prev.has(id)) return prev;
      const badge = ALL_BADGES.find((b) => b.id === id);
      if (!badge) return prev;
      // Queue a toast notification
      setToastQueue((q) => [...q, badge]);
      const next = new Set<string>(Array.from(prev));
      next.add(id);
      return next;
    });
  }, []);

  const isUnlocked = useCallback((id: string) => unlockedIds.has(id), [unlockedIds]);

  const checkUnlocks = useCallback((p: BadgeCheckParams) => {
    // Milestone: first correct answer
    if (p.totalCorrect >= 1)   unlockBadge("first_win");
    if (p.totalCorrect >= 10)  unlockBadge("ten_correct");
    if (p.totalCorrect >= 50)  unlockBadge("fifty_correct");
    if (p.totalCorrect >= 100) unlockBadge("hundred_correct");

    // Streak
    if (p.currentStreak >= 5)  unlockBadge("streak_5");
    if (p.currentStreak >= 10) unlockBadge("streak_10");
    if (p.currentStreak >= 20) unlockBadge("streak_20");

    // Speed
    if (p.answerTimeMs > 0 && p.answerTimeMs < 5000) unlockBadge("speed_thinker");
    if (p.fastAnswersUnder3s >= 5)                   unlockBadge("speed_demon");

    // Comeback: correct answer after 3 wrong in a row
    if (p.wrongStreak <= -3 && p.currentStreak > 0) unlockBadge("comeback_kid");

    // Grade completion
    if (p.gradesMastered.includes("KG")) unlockBadge("kg_master");
    if (p.gradesMastered.includes("G1")) unlockBadge("g1_master");
    if (p.gradesMastered.includes("G2")) unlockBadge("g2_master");
    if (p.gradesMastered.includes("G3")) unlockBadge("g3_master");

    // Perfect round
    if (p.roundCorrect !== undefined && p.roundTotal !== undefined &&
        p.roundTotal > 0 && p.roundCorrect === p.roundTotal) {
      unlockBadge("perfect_round");
    }

    // Endless mode
    if (p.isEndlessMode && (p.endlessTotalAnswered ?? 0) >= 50) unlockBadge("endless_50");

    // All levels
    if (p.allLevelsComplete) unlockBadge("math_genius");
  }, [unlockBadge]);

  // Auto-dismiss toasts
  useEffect(() => {
    if (toastQueue.length === 0) return;
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastQueue((q) => q.slice(1));
    }, 3200);
    return () => { if (toastTimerRef.current) clearTimeout(toastTimerRef.current); };
  }, [toastQueue]);

  const currentToast = toastQueue[0] ?? null;

  return (
    <BadgeContext.Provider value={{ unlockedIds, unlockBadge, isUnlocked, allBadges: ALL_BADGES, checkUnlocks }}>
      {children}
      {/* Badge unlock toast overlay */}
      <AnimatePresence>
        {currentToast && (
          <motion.div
            key={currentToast.id}
            initial={{ y: -80, opacity: 0, scale: 0.85 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -80, opacity: 0, scale: 0.85 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            style={{
              position: "fixed",
              top: "1rem",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9999,
              pointerEvents: "none",
              minWidth: "260px",
              maxWidth: "90vw",
            }}
          >
            <div
              style={{
                background: BADGE_RARITY_COLORS[currentToast.rarity].bg,
                border: `3px solid ${BADGE_RARITY_COLORS[currentToast.rarity].border}`,
                boxShadow: `0 4px 24px ${BADGE_RARITY_COLORS[currentToast.rarity].glow}, 4px 4px 0 oklch(0.18 0.04 270)`,
                borderRadius: "1.25rem",
                padding: "0.75rem 1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                fontFamily: "'Fredoka One', 'Tajawal', sans-serif",
              }}
            >
              <motion.span
                style={{ fontSize: "2rem", display: "inline-block" }}
                animate={{ rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.3, 1.1, 1.2, 1] }}
                transition={{ duration: 0.6 }}
              >
                {currentToast.emoji}
              </motion.span>
              <div>
                <div style={{ fontSize: "0.7rem", color: BADGE_RARITY_COLORS[currentToast.rarity].text, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Badge Unlocked!
                </div>
                <div style={{ fontSize: "1rem", color: BADGE_RARITY_COLORS[currentToast.rarity].text, fontWeight: 700 }}>
                  {currentToast.nameEn}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </BadgeContext.Provider>
  );
}

export function useBadges(): BadgeContextValue {
  const ctx = useContext(BadgeContext);
  if (!ctx) {
    // Safe fallback — never throws
    return {
      unlockedIds: new Set(),
      unlockBadge: () => {},
      isUnlocked: () => false,
      allBadges: ALL_BADGES,
      checkUnlocks: () => {},
    };
  }
  return ctx;
}
