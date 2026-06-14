/**
 * GameScreen — MathQuest Kids
 * Design: Sunny Storybook
 * i18n: Full EN/AR support with RTL layout switching.
 * CRITICAL: All math equations and numbers use dir="ltr" isolation
 * via LtrNum and the .math-equation CSS class to prevent RTL
 * context from reversing operator order (e.g. "3 + 5").
 */

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import { useLanguage } from "@/contexts/LanguageContext";
import MascotOwl from "@/components/MascotOwl";
import FloatingDecorations from "@/components/FloatingDecorations";
import LtrNum from "@/components/LtrNum";
import type { MoodType } from "@/components/MascotOwl";
import type { Question, AnswerChoice } from "@/lib/mathEngine";
import { PASS_THRESHOLD } from "@/lib/mathEngine";

const LOGO_STAR =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663029442648/HuT9LUnwcUFmp6Xsie23M7/logo-star-VXHLUR84pLpFzMGbXzZvfX.webp";

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

// ── Answer button color palette ───────────────────────────────
const ANSWER_COLORS = [
  { bg: "oklch(0.58 0.19 250)", text: "white",                hover: "oklch(0.52 0.19 250)" },
  { bg: "oklch(0.82 0.17 85)",  text: "oklch(0.18 0.04 270)", hover: "oklch(0.78 0.17 85)"  },
  { bg: "oklch(0.65 0.2 145)",  text: "white",                hover: "oklch(0.58 0.2 145)"  },
  { bg: "oklch(0.62 0.22 25)",  text: "white",                hover: "oklch(0.56 0.22 25)"  },
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── HUD Sub-components ────────────────────────────────────────

function HeartLives({ lives, max = 3 }: { lives: number; max?: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${lives} lives remaining`}>
      {Array.from({ length: max }).map((_, i) => (
        <motion.span
          key={i}
          className="text-xl md:text-2xl select-none"
          animate={i < lives ? { scale: [1, 1.2, 1] } : { scale: 1, opacity: 0.3 }}
          transition={{ duration: 0.3, delay: i * 0.06 }}
          aria-hidden="true"
        >
          {i < lives ? "❤️" : "🖤"}
        </motion.span>
      ))}
    </div>
  );
}

function ScoreBadge({ score, isRTL }: { score: number; isRTL: boolean }) {
  const displayFont = isRTL ? "'Tajawal', sans-serif" : "'Fredoka One', sans-serif";
  return (
    <motion.div
      key={score}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.25, 1] }}
      transition={{ duration: 0.35 }}
      style={{
        background: "oklch(0.82 0.17 85)",
        border: "2.5px solid oklch(0.18 0.04 270)",
        boxShadow: `${isRTL ? "-3px" : "3px"} 3px 0 oklch(0.18 0.04 270)`,
      }}
    >
      <span className="text-lg select-none" aria-hidden="true">⭐</span>
      <span
        style={{ fontFamily: displayFont, fontSize: "1.1rem", color: "oklch(0.18 0.04 270)" }}
        aria-label={`Score: ${score}`}
      >
        {/* Score number always LTR */}
        <LtrNum>{score}</LtrNum>
      </span>
    </motion.div>
  );
}

function QuestionProgress({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="flex items-center gap-2 flex-1 max-w-xs">
      {/* Always LTR: "3/10" */}
      <span style={{ fontFamily: "'Fredoka One', sans-serif", fontSize: "0.9rem", color: "oklch(0.18 0.04 270)", whiteSpace: "nowrap" }}>
        <LtrNum>{current}/{total}</LtrNum>
      </span>
      <div className="progress-track flex-1">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease }}
        />
      </div>
    </div>
  );
}

// ── KG Visual Aid ─────────────────────────────────────────────
// CRITICAL: All numbers in this component are wrapped in .math-equation
// or LtrNum to prevent RTL context from reversing their display.

function CountingVisual({ question, isRTL }: { question: Question; isRTL: boolean }) {
  const displayFont = isRTL ? "'Tajawal', sans-serif" : "'Fredoka One', sans-serif";
  const bodyFont    = isRTL ? "'Tajawal', sans-serif" : "'Nunito', sans-serif";

  if (question.type === "number_id" && question.countingAmount !== undefined) {
    return (
      <div className="flex flex-col items-center gap-1">
        <motion.div
          className="math-equation"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          style={{
            fontFamily: "'Fredoka One', sans-serif",  // Always use Fredoka for numerals
            fontSize: "5rem",
            lineHeight: 1,
            color: "oklch(0.18 0.04 270)",
            textShadow: "3px 4px 0 oklch(0.82 0.17 85)",
          }}
        >
          {question.countingAmount}
        </motion.div>
        <p style={{ fontFamily: bodyFont, fontWeight: 700, fontSize: "0.85rem", color: "oklch(0.52 0.04 270)" }}>
          {isRTL ? "ما هذا الرقم؟" : "What number is this?"}
        </p>
      </div>
    );
  }

  if (question.type === "counting" && question.countingIcon && question.countingAmount !== undefined) {
    const { emoji } = question.countingIcon;
    const count = question.countingAmount;
    const rows: number[][] = [];
    let remaining = count;
    while (remaining > 0) {
      const rowSize = Math.min(5, remaining);
      rows.push(Array.from({ length: rowSize }, (_, i) => i));
      remaining -= rowSize;
    }
    return (
      <div className="flex flex-col items-center gap-1.5">
        {rows.map((row, ri) => (
          <div key={ri} className="flex items-center gap-1.5 flex-wrap justify-center">
            {row.map((_, ci) => {
              const globalIdx = ri * 5 + ci;
              return (
                <motion.span
                  key={globalIdx}
                  className="text-3xl md:text-4xl select-none"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: globalIdx * 0.06, type: "spring", stiffness: 350, damping: 18 }}
                  aria-hidden="true"
                >
                  {emoji}
                </motion.span>
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  // Arithmetic visual — ALWAYS rendered LTR regardless of UI direction
  const isAddition       = question.type === "addition_easy"       || question.type === "addition_hard";
  const isSubtraction    = question.type === "subtraction_easy"    || question.type === "subtraction_hard";
  const isMultiplication = question.type === "multiplication_basic" || question.type === "multiplication_full";
  const isDivision       = question.type === "division";

  if ((isAddition || isSubtraction || isMultiplication || isDivision) &&
      question.operandA !== undefined && question.operandB !== undefined) {
    const op = isAddition ? "+" : isSubtraction ? "−" : isMultiplication ? "×" : "÷";
    const opColor = isAddition ? "oklch(0.58 0.19 250)" : isSubtraction ? "oklch(0.62 0.22 25)" : isMultiplication ? "oklch(0.65 0.2 145)" : "oklch(0.72 0.18 310)";
    return (
      // dir="ltr" on the container ensures "3 + 5 = ?" never reverses in RTL
      <div className="math-equation flex items-center justify-center gap-3 flex-wrap" dir="ltr">
        <span style={{ fontFamily: "'Fredoka One', sans-serif", fontSize: "2.8rem", color: "oklch(0.18 0.04 270)" }}>
          {question.operandA}
        </span>
        <span style={{ fontFamily: "'Fredoka One', sans-serif", fontSize: "2.4rem", color: opColor }}>
          {op}
        </span>
        <span style={{ fontFamily: "'Fredoka One', sans-serif", fontSize: "2.8rem", color: "oklch(0.18 0.04 270)" }}>
          {question.operandB}
        </span>
        <span style={{ fontFamily: "'Fredoka One', sans-serif", fontSize: "2.4rem", color: "oklch(0.52 0.04 270)" }}>
          = ?
        </span>
      </div>
    );
  }

  // Fraction visual — SVG pie chart
  if (question.type === "fraction" && question.fractionVisual) {
    const { numerator, denominator } = question.fractionVisual;
    const sliceAngle = (2 * Math.PI) / denominator;
    const cx = 60, cy = 60, r = 50;
    const slices: React.ReactElement[] = [];
    for (let i = 0; i < denominator; i++) {
      const startAngle = i * sliceAngle - Math.PI / 2;
      const endAngle = startAngle + sliceAngle;
      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle);
      const y2 = cy + r * Math.sin(endAngle);
      const largeArc = sliceAngle > Math.PI ? 1 : 0;
      const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      const isShaded = i < numerator;
      slices.push(
        <motion.path
          key={i} d={d}
          fill={isShaded ? "oklch(0.62 0.22 25)" : "oklch(0.94 0.02 90)"}
          stroke="oklch(0.18 0.04 270)" strokeWidth="2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.08, type: "spring", stiffness: 300, damping: 20 }}
        />
      );
    }
    return (
      <div className="flex flex-col items-center gap-2">
        <svg width="120" height="120" viewBox="0 0 120 120" aria-label={`Pie chart showing ${question.fractionVisual.label}`}>
          {slices}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="oklch(0.18 0.04 270)" strokeWidth="2.5" />
        </svg>
        <p style={{ fontFamily: displayFont, fontWeight: 700, fontSize: "0.8rem", color: "oklch(0.52 0.04 270)" }}>
          {isRTL ? "الجزء الأحمر مظلَّل 🎨" : "The red slice is shaded 🎨"}
        </p>
      </div>
    );
  }

  return null;
}

// ── Answer Button ─────────────────────────────────────────────

type ButtonState = "idle" | "correct" | "wrong" | "reveal";

function AnswerButton({
  choice, colorIndex, state, onClick, disabled, isRTL,
}: {
  choice: AnswerChoice; colorIndex: number; state: ButtonState;
  onClick: () => void; disabled: boolean; isRTL: boolean;
}) {
  const palette = ANSWER_COLORS[colorIndex % ANSWER_COLORS.length];
  const bgColor = state === "correct" || state === "reveal" ? "oklch(0.65 0.2 145)" : state === "wrong" ? "oklch(0.62 0.22 25)" : palette.bg;
  const textColor = state === "correct" || state === "wrong" || state === "reveal" ? "white" : palette.text;

  return (
    <motion.button
      className="answer-btn w-full relative overflow-hidden"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        // Answer labels are always numbers — keep Fredoka for readability
        fontFamily: "'Fredoka One', sans-serif",
        transition: "background-color 0.2s ease",
        // Answer labels are always Western numerals — force LTR
        direction: "ltr",
        unicodeBidi: "isolate",
      }}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled && state === "idle" ? { scale: 1.03, y: -2 } : {}}
      animate={
        state === "correct" ? { scale: [1, 1.12, 1], transition: { duration: 0.35 } }
        : state === "wrong"  ? { x: [-7, 7, -6, 6, -4, 4, 0], transition: { duration: 0.4 } }
        : {}
      }
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      aria-label={`Answer: ${choice.label}`}
      aria-pressed={state !== "idle"}
    >
      {(state === "correct" || state === "reveal") && (
        <motion.div className="absolute inset-0 rounded-xl" initial={{ opacity: 0.6 }} animate={{ opacity: 0 }} transition={{ duration: 0.5 }} style={{ background: "oklch(0.85 0.2 145)" }} />
      )}
      {state === "correct" && <span className="me-1">✅</span>}
      {state === "wrong"   && <span className="me-1">❌</span>}
      {state === "reveal"  && <span className="me-1">✅</span>}
      {choice.label}
    </motion.button>
  );
}

// ── Main Screen ───────────────────────────────────────────────

export default function GameScreen() {
  const {
    goToLevels, selectedLevel, round, currentQuestion,
    answerQuestion, nextQuestion, activeSubLevelId, subLevelProgress,
  } = useGame();
  const { t, isRTL } = useLanguage();

  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [mascotMood, setMascotMood] = useState<MoodType>("idle");
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [isAdvancing, setIsAdvancing] = useState(false);

  const displayFont = isRTL ? "'Tajawal', sans-serif" : "'Fredoka One', sans-serif";
  const bodyFont    = isRTL ? "'Tajawal', sans-serif" : "'Nunito', sans-serif";

  // Feedback messages (language-aware)
  const CORRECT_MESSAGES = [
    t("feedbackCorrect1"), t("feedbackCorrect2"),
    t("feedbackCorrect3"), t("feedbackCorrect4"),
  ];
  const WRONG_MESSAGES = [
    t("feedbackWrong1"), t("feedbackWrong2"), t("feedbackWrong3"),
  ];

  // Reset local state when question changes
  useEffect(() => {
    setSelectedChoiceId(null);
    setIsCorrect(null);
    setMascotMood("idle");
    setFeedbackMsg(null);
    setIsAdvancing(false);
  }, [round.currentIndex, round.questions]);

  const handleAnswer = useCallback(
    (choice: AnswerChoice) => {
      if (selectedChoiceId || isAdvancing) return;
      setSelectedChoiceId(choice.id);
      const correct = choice.correct;
      setIsCorrect(correct);
      answerQuestion(choice.id);
      if (correct) {
        setMascotMood("celebrate");
        setFeedbackMsg(randomItem(CORRECT_MESSAGES));
      } else {
        setMascotMood("oops");
        setFeedbackMsg(randomItem(WRONG_MESSAGES));
      }
      setTimeout(() => {
        setMascotMood("idle");
        setIsAdvancing(true);
        setTimeout(() => nextQuestion(), 200);
      }, 1600);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedChoiceId, isAdvancing, answerQuestion, nextQuestion]
  );

  const getButtonState = (choice: AnswerChoice): ButtonState => {
    if (!selectedChoiceId) return "idle";
    if (choice.id === selectedChoiceId) return choice.correct ? "correct" : "wrong";
    if (!isCorrect && choice.correct) return "reveal";
    return "idle";
  };

  // Grade labels (translated)
  const levelLabels: Record<string, string> = {
    KG: `🌟 ${t("gradeKG")}`,
    G1: `🚀 ${t("grade1")}`,
    G2: `🎯 ${t("grade2")}`,
    G3: `🏆 ${t("grade3")}`,
  };

  const questionNumber = round.currentIndex + 1;
  const totalQuestions = round.questions.length;

  if (!currentQuestion) return null;

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden" style={{ background: "oklch(0.985 0.025 90)" }}>
      <FloatingDecorations density="low" />

      {/* ── TOP HUD ─────────────────────────────────────── */}
      <motion.header
        className="relative z-10 px-4 pt-4 pb-2"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease }}
      >
        {/* Row 1: Exit | Level label | Score | Lives */}
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <button
              className="btn-ink btn-ink-white text-sm px-3 py-2"
              onClick={goToLevels}
              style={{ fontFamily: displayFont }}
              aria-label={t("chooseLevel")}
            >
              ✕
            </button>
            <div
              className="px-3 py-1.5 rounded-xl text-sm hidden sm:block"
              style={{
                background: "oklch(0.99 0.015 85)",
                border: "2px solid oklch(0.18 0.04 270)",
                fontFamily: displayFont,
                color: "oklch(0.18 0.04 270)",
              }}
            >
              {levelLabels[selectedLevel ?? "KG"]}
            </div>
          </div>
          <ScoreBadge score={round.score} isRTL={isRTL} />
          <HeartLives lives={round.lives} />
        </div>

        {/* Row 2: Question progress bar — numbers always LTR */}
        <div className="flex items-center gap-3 mb-1">
          <img src={LOGO_STAR} alt="" className="w-6 h-6 shrink-0" aria-hidden="true" />
          <QuestionProgress current={questionNumber} total={totalQuestions} />
          <span style={{ fontFamily: displayFont, fontSize: "0.85rem", color: "oklch(0.52 0.04 270)", whiteSpace: "nowrap" }}>
            {t("question")} <LtrNum>{questionNumber}</LtrNum>/<LtrNum>{totalQuestions}</LtrNum>
          </span>
        </div>

        {/* Row 3: Sub-level progression bar */}
        {(() => {
          const currentSubId = currentQuestion?.subLevelId ?? activeSubLevelId;
          const sp = subLevelProgress.find((s) => s.subLevelId === currentSubId);
          if (!sp) return null;
          const pct = Math.min(100, Math.round((sp.correctCount / PASS_THRESHOLD) * 100));
          return (
            <div className="flex items-center gap-2">
              <span style={{ fontFamily: displayFont, fontSize: "0.78rem", color: "oklch(0.35 0.04 270)", whiteSpace: "nowrap" }}>
                {sp.emoji} {sp.label}
              </span>
              <div className="progress-track flex-1" style={{ height: "0.7rem" }}>
                <motion.div
                  className="progress-fill"
                  style={{
                    height: "100%",
                    background: sp.passed ? "oklch(0.65 0.2 145)" : "linear-gradient(90deg, oklch(0.82 0.17 85), oklch(0.65 0.2 145))",
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: sp.passed ? "100%" : `${pct}%` }}
                  transition={{ duration: 0.5, ease }}
                />
              </div>
              {sp.passed ? (
                <span className="text-sm" aria-label="Sub-level passed">✅</span>
              ) : (
                <span style={{ fontFamily: displayFont, fontSize: "0.75rem", color: "oklch(0.52 0.04 270)", whiteSpace: "nowrap" }}>
                  {/* Always LTR: "3/5" */}
                  <LtrNum>{sp.correctCount}/{PASS_THRESHOLD}</LtrNum>
                </span>
              )}
            </div>
          );
        })()}
      </motion.header>

      {/* ── MAIN CONTENT ────────────────────────────────── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-between px-4 py-3 gap-3 max-w-lg mx-auto w-full">

        {/* Mascot + Feedback */}
        <div className="flex flex-col items-center gap-2 w-full">
          <MascotOwl mood={mascotMood} size="md" />
          <AnimatePresence mode="wait">
            {feedbackMsg ? (
              <motion.div
                key="feedback"
                initial={{ scale: 0.7, opacity: 0, y: 8 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.85, opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease }}
                className="px-5 py-2 rounded-2xl text-center"
                style={{
                  background: isCorrect ? "oklch(0.65 0.2 145)" : "oklch(0.62 0.22 25)",
                  border: "2.5px solid oklch(0.18 0.04 270)",
                  boxShadow: `${isRTL ? "-3px" : "3px"} 3px 0 oklch(0.18 0.04 270)`,
                  fontFamily: displayFont,
                  fontSize: "1.15rem",
                  color: "white",
                }}
                role="status"
                aria-live="polite"
              >
                {feedbackMsg}
              </motion.div>
            ) : (
              <motion.p
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ fontFamily: bodyFont, fontWeight: 700, fontSize: "0.9rem", color: "oklch(0.45 0.04 270)", textAlign: "center" }}
              >
                {isRTL ? `أولي يقول: "${currentQuestion.hint}"` : `Ollie says: "${currentQuestion.hint}"`}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            className="card-ink w-full px-5 py-5 md:py-6 text-center"
            initial={{ scale: 0.92, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease }}
          >
            {/* Category chip */}
            <div className="flex justify-center mb-3">
              <span className="px-4 py-1 rounded-full text-sm"
                style={{ background: "oklch(0.82 0.17 85)", border: "2px solid oklch(0.18 0.04 270)", fontFamily: displayFont, color: "oklch(0.18 0.04 270)" }}
              >
                {currentQuestion.categoryEmoji} {currentQuestion.category}
              </span>
            </div>

            {/* Question text — always LTR for math expressions */}
            <h2
              className="text-3xl md:text-4xl leading-tight mb-4 math-equation"
              dir="ltr"
              style={{ fontFamily: "'Fredoka One', sans-serif", color: "oklch(0.18 0.04 270)" }}
            >
              {currentQuestion.text}
            </h2>

            {/* Visual aid */}
            <div
              className="flex items-center justify-center py-3 px-4 rounded-xl min-h-[80px]"
              style={{ background: "oklch(0.97 0.02 90)", border: "2px dashed oklch(0.75 0.04 270)" }}
            >
              <CountingVisual question={currentQuestion} isRTL={isRTL} />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Answer Buttons */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id + "-choices"}
            className="grid grid-cols-2 gap-3 w-full"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ delay: 0.1, duration: 0.3, ease }}
          >
            {currentQuestion.choices.map((choice, i) => (
              <AnswerButton
                key={choice.id}
                choice={choice}
                colorIndex={i}
                state={getButtonState(choice)}
                onClick={() => handleAnswer(choice)}
                disabled={!!selectedChoiceId || isAdvancing}
                isRTL={isRTL}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
