/**
 * MultPracticeScreen — MathQuest Kids
 * ─────────────────────────────────────────────────────────────
 * Dedicated Multiplication Table Free Practice mode.
 * Design: Sunny Storybook — deep navy background with electric
 *         purple/gold accents to visually distinguish from the
 *         main game flow.
 *
 * Features:
 *  - Endless 1×1 → 12×12 multiplication questions
 *  - 4 answer choices (1 correct + 3 calibrated distractors)
 *  - Immediate green/red feedback → auto-advance after 1 s
 *  - Current Streak + Best Streak counters
 *  - Encouraging message on streak break
 *  - Session accuracy badge
 *  - Fully bilingual EN/AR, RTL-safe, Western numerals only
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMultPractice } from "@/contexts/MultPracticeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSoundEngine } from "@/hooks/useSoundEngine";
import LtrNum from "@/components/LtrNum";

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

// ── Question generator ────────────────────────────────────────

interface MultQuestion {
  a: number;
  b: number;
  answer: number;
  choices: number[];
}

function generateMultQuestion(): MultQuestion {
  const a = Math.floor(Math.random() * 12) + 1;
  const b = Math.floor(Math.random() * 12) + 1;
  const answer = a * b;

  // Generate 3 distractors: close but distinct
  const distractors = new Set<number>();
  while (distractors.size < 3) {
    const delta = Math.floor(Math.random() * 6) + 1;
    const sign = Math.random() < 0.5 ? 1 : -1;
    const candidate = answer + sign * delta;
    if (candidate > 0 && candidate !== answer && !distractors.has(candidate)) {
      distractors.add(candidate);
    }
  }

  const choices = [answer, ...Array.from(distractors)].sort(() => Math.random() - 0.5);
  return { a, b, answer, choices };
}

// ── Colour palette ────────────────────────────────────────────

const ANSWER_COLORS = [
  { bg: "oklch(0.55 0.22 250)", shadow: "oklch(0.30 0.18 250)" }, // blue
  { bg: "oklch(0.62 0.22 145)", shadow: "oklch(0.35 0.18 145)" }, // green
  { bg: "oklch(0.65 0.22 25)",  shadow: "oklch(0.38 0.18 25)"  }, // orange
  { bg: "oklch(0.58 0.22 310)", shadow: "oklch(0.32 0.18 310)" }, // purple
];

// ── Encouraging messages ──────────────────────────────────────

const ENCOURAGE_EN = [
  "Keep going, you've got this! 💪",
  "Almost! Try again! 🌟",
  "Don't give up — you're learning! 🚀",
  "Shake it off and keep going! ✨",
];
const ENCOURAGE_AR = [
  "استمر، أنت تستطيع! 💪",
  "تقريباً! حاول مرة أخرى! 🌟",
  "لا تستسلم — أنت تتعلم! 🚀",
  "تجاوزها وواصل! ✨",
];

// ── Component ─────────────────────────────────────────────────

export default function MultPracticeScreen() {
  const { closePractice, currentStreak, bestStreak, incrementStreak, resetStreak, recordAnswer, stats } =
    useMultPractice();
  const { language, isRTL } = useLanguage();
  const { playCorrect, playWrong } = useSoundEngine();

  const isAr = language === "ar";
  const displayFont = isAr ? "'Tajawal', sans-serif" : "'Fredoka One', cursive";
  const bodyFont    = isAr ? "'Tajawal', sans-serif" : "'Nunito', sans-serif";

  const [question, setQuestion] = useState<MultQuestion>(generateMultQuestion);
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [encourageMsg, setEncourageMsg] = useState<string | null>(null);
  const [questionKey, setQuestionKey] = useState(0);
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadNext = useCallback(() => {
    setSelected(null);
    setIsCorrect(null);
    setEncourageMsg(null);
    setQuestion(generateMultQuestion());
    setQuestionKey((k) => k + 1);
  }, []);

  const handleAnswer = useCallback(
    (choice: number) => {
      if (selected !== null) return; // already answered
      const correct = choice === question.answer;
      setSelected(choice);
      setIsCorrect(correct);
      recordAnswer(question.a, question.b, correct);

      if (correct) {
        playCorrect();
        incrementStreak();
      } else {
        playWrong();
        resetStreak();
        const msgs = isAr ? ENCOURAGE_AR : ENCOURAGE_EN;
        setEncourageMsg(msgs[Math.floor(Math.random() * msgs.length)]);
      }

      // Auto-advance after 1 s
      autoAdvanceRef.current = setTimeout(loadNext, 1000);
    },
    [selected, question, recordAnswer, playCorrect, playWrong, incrementStreak, resetStreak, loadNext, isAr]
  );

  useEffect(() => {
    return () => {
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    };
  }, []);

  // ── Copy strings ────────────────────────────────────────────
  const titleText     = isAr ? "تدريب جدول الضرب" : "Multiplication Practice";
  const streakLabel   = isAr ? "التسلسل الحالي" : "Current Streak";
  const bestLabel     = isAr ? "أعلى رقم قياسي" : "Best Streak";
  const accuracyLabel = isAr ? "الدقة" : "Accuracy";
  const exitLabel     = isAr ? "خروج" : "Exit";
  const questionLabel = isAr ? "ما هو ناتج:" : "What is:";
  const correctMsg    = isAr ? "ممتاز! ✅" : "Correct! ✅";

  const accuracy =
    stats.totalAnswered > 0
      ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100)
      : 100;

  return (
    <div
      className="min-h-screen flex flex-col"
      dir={isRTL ? "rtl" : "ltr"}
      style={{
        background:
          "linear-gradient(160deg, oklch(0.15 0.08 270) 0%, oklch(0.11 0.10 285) 55%, oklch(0.09 0.07 300) 100%)",
        fontFamily: bodyFont,
      }}
    >
      {/* ── Header ──────────────────────────────────────────── */}
      <header
        className="flex items-center justify-between px-4 sm:px-6 py-4"
        style={{ borderBottom: "2px solid oklch(0.55 0.22 270 / 0.3)" }}
      >
        {/* Title */}
        <div className="flex items-center gap-3">
          <span style={{ fontSize: "1.8rem" }}>⚡</span>
          <h1
            style={{
              fontFamily: displayFont,
              fontSize: "clamp(1.1rem, 4vw, 1.5rem)",
              color: "oklch(0.82 0.17 85)",
              textShadow: "0 0 20px oklch(0.82 0.17 85 / 0.4)",
            }}
          >
            {titleText}
          </h1>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3">
          {/* Accuracy badge */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{
              background: "oklch(0.55 0.22 145 / 0.2)",
              border: "1.5px solid oklch(0.55 0.22 145 / 0.5)",
            }}
          >
            <span style={{ fontSize: "0.85rem", color: "oklch(0.75 0.15 145)", fontWeight: 700 }}>
              {accuracyLabel}:
            </span>
            <span dir="ltr" style={{ fontSize: "0.85rem", color: "oklch(0.82 0.14 145)", fontWeight: 800 }}>
              <LtrNum>{accuracy}</LtrNum>%
            </span>
          </div>

          {/* Exit */}
          <motion.button
            onClick={closePractice}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className="px-4 py-2 rounded-xl font-bold"
            style={{
              fontFamily: displayFont,
              fontSize: "0.9rem",
              background: "oklch(0.22 0.05 270)",
              color: "oklch(0.75 0.04 270)",
              border: "2px solid oklch(0.35 0.04 270)",
              cursor: "pointer",
            }}
          >
            {exitLabel}
          </motion.button>
        </div>
      </header>

      {/* ── Streak counters ──────────────────────────────────── */}
      <div className="flex justify-center gap-4 sm:gap-8 py-4 px-4">
        {/* Current streak */}
        <motion.div
          className="flex flex-col items-center px-6 py-3 rounded-2xl"
          style={{
            background: "oklch(0.22 0.06 270 / 0.8)",
            border: "2.5px solid oklch(0.55 0.22 270 / 0.5)",
            minWidth: "120px",
          }}
          animate={currentStreak > 0 ? { scale: [1, 1.08, 1] } : {}}
          transition={{ duration: 0.3 }}
          key={`streak-${currentStreak}`}
        >
          <span style={{ fontSize: "2rem", lineHeight: 1 }}>🔥</span>
          <span
            style={{
              fontFamily: displayFont,
              fontSize: "clamp(1.6rem, 5vw, 2.2rem)",
              color: "oklch(0.82 0.17 85)",
              lineHeight: 1.1,
            }}
            dir="ltr"
          >
            <LtrNum>{currentStreak}</LtrNum>
          </span>
          <span
            style={{
              fontFamily: bodyFont,
              fontSize: "0.72rem",
              color: "oklch(0.65 0.04 270)",
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            {streakLabel}
          </span>
        </motion.div>

        {/* Best streak */}
        <motion.div
          className="flex flex-col items-center px-6 py-3 rounded-2xl"
          style={{
            background: "oklch(0.22 0.06 270 / 0.8)",
            border: "2.5px solid oklch(0.82 0.17 85 / 0.4)",
            minWidth: "120px",
          }}
        >
          <span style={{ fontSize: "2rem", lineHeight: 1 }}>🏆</span>
          <span
            style={{
              fontFamily: displayFont,
              fontSize: "clamp(1.6rem, 5vw, 2.2rem)",
              color: "oklch(0.82 0.17 85)",
              lineHeight: 1.1,
            }}
            dir="ltr"
          >
            <LtrNum>{bestStreak}</LtrNum>
          </span>
          <span
            style={{
              fontFamily: bodyFont,
              fontSize: "0.72rem",
              color: "oklch(0.65 0.04 270)",
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            {bestLabel}
          </span>
        </motion.div>
      </div>

      {/* ── Main question area ───────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={questionKey}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.28, ease }}
            className="w-full flex flex-col items-center"
            style={{ maxWidth: "480px" }}
          >
            {/* Question card */}
            <div
              className="w-full rounded-3xl px-8 py-8 mb-6 text-center"
              style={{
                background: "oklch(0.20 0.06 270 / 0.9)",
                border: "3px solid oklch(0.55 0.22 270 / 0.5)",
                boxShadow: "0 12px 40px oklch(0 0 0 / 0.4)",
              }}
            >
              <p
                style={{
                  fontFamily: bodyFont,
                  fontSize: "0.9rem",
                  color: "oklch(0.65 0.04 270)",
                  marginBottom: "0.5rem",
                  fontWeight: 700,
                }}
              >
                {questionLabel}
              </p>
              <div
                style={{
                  fontFamily: displayFont,
                  fontSize: "clamp(2.8rem, 10vw, 4.5rem)",
                  color: "oklch(0.92 0.015 85)",
                  lineHeight: 1,
                  letterSpacing: "-0.01em",
                }}
                dir="ltr"
              >
                <LtrNum>{question.a}</LtrNum>
                <span style={{ color: "oklch(0.82 0.17 85)", margin: "0 0.2em" }}>×</span>
                <LtrNum>{question.b}</LtrNum>
                <span style={{ color: "oklch(0.65 0.04 270)", margin: "0 0.2em" }}>=</span>
                <span style={{ color: "oklch(0.55 0.22 270 / 0.7)" }}>?</span>
              </div>
            </div>

            {/* Feedback message */}
            <AnimatePresence>
              {isCorrect !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease }}
                  className="mb-4 px-5 py-2 rounded-full text-center"
                  style={{
                    background: isCorrect
                      ? "oklch(0.55 0.22 145 / 0.25)"
                      : "oklch(0.55 0.22 25 / 0.25)",
                    border: `2px solid ${isCorrect ? "oklch(0.55 0.22 145 / 0.6)" : "oklch(0.55 0.22 25 / 0.6)"}`,
                    fontFamily: bodyFont,
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: isCorrect ? "oklch(0.78 0.18 145)" : "oklch(0.78 0.18 25)",
                  }}
                >
                  {isCorrect ? correctMsg : (encourageMsg ?? (isAr ? "حاول مرة أخرى! 💪" : "Try again! 💪"))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Answer buttons 2×2 grid */}
            <div className="grid grid-cols-2 gap-3 w-full">
              {question.choices.map((choice, i) => {
                const colorSet = ANSWER_COLORS[i % ANSWER_COLORS.length];
                const isSelected = selected === choice;
                const isRight = choice === question.answer;

                let bg = colorSet.bg;
                let border = colorSet.shadow;
                let textColor = "oklch(0.98 0 0)";

                if (selected !== null) {
                  if (isRight) {
                    bg = "oklch(0.55 0.22 145)";
                    border = "oklch(0.35 0.18 145)";
                  } else if (isSelected) {
                    bg = "oklch(0.55 0.22 25)";
                    border = "oklch(0.35 0.18 25)";
                  } else {
                    bg = "oklch(0.28 0.04 270)";
                    border = "oklch(0.22 0.03 270)";
                    textColor = "oklch(0.55 0.04 270)";
                  }
                }

                return (
                  <motion.button
                    key={choice}
                    onClick={() => handleAnswer(choice)}
                    disabled={selected !== null}
                    whileHover={selected === null ? { scale: 1.04, y: -2 } : {}}
                    whileTap={selected === null ? { scale: 0.95 } : {}}
                    animate={
                      isSelected && !isRight
                        ? { x: [-6, 6, -4, 4, 0] }
                        : isSelected && isRight
                        ? { scale: [1, 1.12, 1] }
                        : {}
                    }
                    transition={{ duration: 0.35 }}
                    className="py-5 rounded-2xl font-bold"
                    style={{
                      fontFamily: displayFont,
                      fontSize: "clamp(1.4rem, 5vw, 2rem)",
                      background: bg,
                      color: textColor,
                      border: `3px solid ${border}`,
                      boxShadow: selected === null ? `0 5px 0 ${border}` : "none",
                      cursor: selected !== null ? "default" : "pointer",
                      transition: "background 0.2s, border 0.2s, box-shadow 0.15s",
                    }}
                    dir="ltr"
                  >
                    <LtrNum>{choice}</LtrNum>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
