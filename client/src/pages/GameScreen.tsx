/**
 * GameScreen — MathQuest Kids
 * Design: Sunny Storybook
 * Layout:
 *   TOP HUD  — Score, Stars, Lives, Progress bar
 *   CENTER   — Question card + Mascot (reacts to answers)
 *   BOTTOM   — 4 multiple-choice answer buttons (2×2 grid)
 *
 * Math logic is NOT implemented yet (Task 1 shell only).
 * All values shown are placeholder/demo data.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import MascotOwl from "@/components/MascotOwl";
import FloatingDecorations from "@/components/FloatingDecorations";
import type { MoodType } from "@/components/MascotOwl";

const LOGO_STAR =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663029442648/HuT9LUnwcUFmp6Xsie23M7/logo-star-VXHLUR84pLpFzMGbXzZvfX.webp";

// ── Placeholder question data ──────────────────────────────
const PLACEHOLDER_QUESTION = {
  text: "What is 3 + 4?",
  answers: [
    { id: "a", label: "6",  correct: false },
    { id: "b", label: "7",  correct: true  },
    { id: "c", label: "8",  correct: false },
    { id: "d", label: "5",  correct: false },
  ],
};

const ANSWER_COLORS = [
  { bg: "oklch(0.58 0.19 250)", hover: "oklch(0.52 0.19 250)", text: "white" }, // Blue
  { bg: "oklch(0.82 0.17 85)",  hover: "oklch(0.78 0.17 85)",  text: "oklch(0.18 0.04 270)" }, // Yellow
  { bg: "oklch(0.65 0.2 145)",  hover: "oklch(0.58 0.2 145)",  text: "white" }, // Green
  { bg: "oklch(0.62 0.22 25)",  hover: "oklch(0.56 0.22 25)",  text: "white" }, // Red
];

// ── HUD Components ─────────────────────────────────────────

function HeartLives({ lives, max = 3 }: { lives: number; max?: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${lives} lives remaining`}>
      {Array.from({ length: max }).map((_, i) => (
        <motion.span
          key={i}
          className="text-xl md:text-2xl"
          animate={i < lives ? { scale: [1, 1.2, 1] } : { scale: 1, opacity: 0.3 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          aria-hidden="true"
        >
          {i < lives ? "❤️" : "🖤"}
        </motion.span>
      ))}
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
      style={{
        background: "oklch(0.82 0.17 85)",
        border: "2.5px solid oklch(0.18 0.04 270)",
        boxShadow: "3px 3px 0 oklch(0.18 0.04 270)",
      }}
    >
      <span className="text-lg" aria-hidden="true">⭐</span>
      <span
        style={{
          fontFamily: "'Fredoka One', sans-serif",
          fontSize: "1.1rem",
          color: "oklch(0.18 0.04 270)",
        }}
        aria-label={`Score: ${score}`}
      >
        {score}
      </span>
    </div>
  );
}

function QuestionProgress({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="flex items-center gap-2 flex-1 max-w-xs">
      <span
        style={{
          fontFamily: "'Fredoka One', sans-serif",
          fontSize: "0.9rem",
          color: "oklch(0.18 0.04 270)",
          whiteSpace: "nowrap",
        }}
      >
        {current}/{total}
      </span>
      <div className="progress-track flex-1">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] as [number,number,number,number] }}
        />
      </div>
    </div>
  );
}

// ── Answer Button ──────────────────────────────────────────

type AnswerState = "idle" | "correct" | "wrong";

function AnswerButton({
  label,
  colorIndex,
  state,
  onClick,
  disabled,
}: {
  label: string;
  colorIndex: number;
  state: AnswerState;
  onClick: () => void;
  disabled: boolean;
}) {
  const colors = ANSWER_COLORS[colorIndex % ANSWER_COLORS.length];

  const bgColor =
    state === "correct"
      ? "oklch(0.65 0.2 145)"
      : state === "wrong"
      ? "oklch(0.62 0.22 25)"
      : colors.bg;

  const textColor =
    state === "correct" || state === "wrong" ? "white" : colors.text;

  return (
    <motion.button
      className="answer-btn w-full"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        fontFamily: "'Fredoka One', sans-serif",
      }}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.03, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.96 } : {}}
      animate={
        state === "correct"
          ? { scale: [1, 1.12, 1], transition: { duration: 0.35 } }
          : state === "wrong"
          ? { x: [-6, 6, -5, 5, 0], transition: { duration: 0.35 } }
          : {}
      }
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      aria-label={`Answer: ${label}`}
    >
      {state === "correct" && "✅ "}
      {state === "wrong"   && "❌ "}
      {label}
    </motion.button>
  );
}

// ── Main Screen ────────────────────────────────────────────

export default function GameScreen() {
  const { goToLevels, selectedLevel, score, lives, questionIndex, totalQuestions } =
    useGame();

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [mascotMood, setMascotMood] = useState<MoodType>("idle");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const levelLabels: Record<string, string> = {
    KG: "🌟 Kindergarten",
    G1: "🚀 Grade 1",
    G2: "🎯 Grade 2",
    G3: "🏆 Grade 3",
  };

  function handleAnswer(answerId: string, isCorrect: boolean) {
    if (selectedAnswer) return; // already answered
    setSelectedAnswer(answerId);

    if (isCorrect) {
      setMascotMood("celebrate");
      setFeedbackMessage("Amazing! You got it! 🎉");
    } else {
      setMascotMood("oops");
      setFeedbackMessage("Oops! Try again next time! 💪");
    }

    // Reset mascot after 1.5s
    setTimeout(() => {
      setMascotMood("idle");
      setFeedbackMessage(null);
    }, 1800);
  }

  const getAnswerState = (id: string): AnswerState => {
    if (!selectedAnswer) return "idle";
    const answer = PLACEHOLDER_QUESTION.answers.find((a) => a.id === id);
    if (id === selectedAnswer) return answer?.correct ? "correct" : "wrong";
    if (answer?.correct && selectedAnswer) return "correct"; // reveal correct
    return "idle";
  };

  return (
    <div
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: "oklch(0.985 0.025 90)" }}
    >
      <FloatingDecorations density="low" />

      {/* ── TOP HUD ─────────────────────────────────────── */}
      <motion.header
        className="relative z-10 px-4 pt-4 pb-2"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] as [number,number,number,number] }}
      >
        {/* Top row */}
        <div className="flex items-center justify-between gap-3 mb-2">
          {/* Back + Level label */}
          <div className="flex items-center gap-2">
            <button
              className="btn-ink btn-ink-white text-sm px-3 py-2"
              onClick={goToLevels}
              aria-label="Exit game and go back to level selection"
            >
              ✕
            </button>
            <div
              className="px-3 py-1.5 rounded-xl text-sm"
              style={{
                background: "oklch(0.99 0.015 85)",
                border: "2px solid oklch(0.18 0.04 270)",
                fontFamily: "'Fredoka One', sans-serif",
                color: "oklch(0.18 0.04 270)",
              }}
            >
              {levelLabels[selectedLevel ?? "KG"]}
            </div>
          </div>

          {/* Score */}
          <ScoreBadge score={score} />

          {/* Lives */}
          <HeartLives lives={lives} />
        </div>

        {/* Progress bar row */}
        <div className="flex items-center gap-3">
          <img src={LOGO_STAR} alt="" className="w-6 h-6" aria-hidden="true" />
          <QuestionProgress current={questionIndex} total={totalQuestions} />
          <span
            style={{
              fontFamily: "'Fredoka One', sans-serif",
              fontSize: "0.85rem",
              color: "oklch(0.52 0.04 270)",
            }}
          >
            Question {questionIndex} of {totalQuestions}
          </span>
        </div>
      </motion.header>

      {/* ── MAIN CONTENT ────────────────────────────────── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-between px-4 py-4 gap-4 max-w-lg mx-auto w-full">

        {/* ── MASCOT + FEEDBACK ───────────────────────── */}
        <div className="flex flex-col items-center gap-2 w-full">
          <MascotOwl mood={mascotMood} size="md" />

          <AnimatePresence mode="wait">
            {feedbackMessage && (
              <motion.div
                key="feedback"
                initial={{ scale: 0.7, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] as [number,number,number,number] }}
                className="px-5 py-2 rounded-2xl text-center"
                style={{
                  background: mascotMood === "celebrate"
                    ? "oklch(0.65 0.2 145)"
                    : "oklch(0.62 0.22 25)",
                  border: "2.5px solid oklch(0.18 0.04 270)",
                  boxShadow: "3px 3px 0 oklch(0.18 0.04 270)",
                  fontFamily: "'Fredoka One', sans-serif",
                  fontSize: "1.1rem",
                  color: "white",
                }}
              >
                {feedbackMessage}
              </motion.div>
            )}
            {!feedbackMessage && (
              <motion.div
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: "oklch(0.45 0.04 270)",
                }}
              >
                Ollie says: "You can do it! Think carefully! 🦉"
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── QUESTION CARD ───────────────────────────── */}
        <motion.div
          className="card-ink w-full px-6 py-6 md:py-8 text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4, ease: [0.23, 1, 0.32, 1] as [number,number,number,number] }}
        >
          {/* Category chip */}
          <div className="flex justify-center mb-3">
            <span
              className="px-4 py-1 rounded-full text-sm"
              style={{
                background: "oklch(0.82 0.17 85)",
                border: "2px solid oklch(0.18 0.04 270)",
                fontFamily: "'Fredoka One', sans-serif",
                color: "oklch(0.18 0.04 270)",
              }}
            >
              ➕ Addition
            </span>
          </div>

          {/* Question text */}
          <h2
            className="text-4xl md:text-5xl leading-tight"
            style={{
              fontFamily: "'Fredoka One', sans-serif",
              color: "oklch(0.18 0.04 270)",
            }}
          >
            {PLACEHOLDER_QUESTION.text}
          </h2>

          {/* Visual hint area (placeholder for future visual aids) */}
          <div
            className="mt-4 flex items-center justify-center gap-2 py-3 rounded-xl"
            style={{
              background: "oklch(0.97 0.02 90)",
              border: "2px dashed oklch(0.75 0.04 270)",
            }}
          >
            <span className="text-3xl" aria-hidden="true">🍎🍎🍎</span>
            <span
              style={{
                fontFamily: "'Fredoka One', sans-serif",
                fontSize: "1.5rem",
                color: "oklch(0.18 0.04 270)",
              }}
            >
              +
            </span>
            <span className="text-3xl" aria-hidden="true">🍎🍎🍎🍎</span>
            <span
              style={{
                fontFamily: "'Fredoka One', sans-serif",
                fontSize: "1.5rem",
                color: "oklch(0.18 0.04 270)",
              }}
            >
              = ?
            </span>
          </div>
        </motion.div>

        {/* ── ANSWER BUTTONS ──────────────────────────── */}
        <motion.div
          className="grid grid-cols-2 gap-3 w-full"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.4, ease: [0.23, 1, 0.32, 1] as [number,number,number,number] }}
        >
          {PLACEHOLDER_QUESTION.answers.map((answer, i) => (
            <AnswerButton
              key={answer.id}
              label={answer.label}
              colorIndex={i}
              state={getAnswerState(answer.id)}
              onClick={() => handleAnswer(answer.id, answer.correct)}
              disabled={!!selectedAnswer}
            />
          ))}
        </motion.div>

        {/* ── NEXT BUTTON (appears after answering) ───── */}
        <AnimatePresence>
          {selectedAnswer && (
            <motion.button
              className="btn-ink btn-ink-blue w-full py-4 text-xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] as [number,number,number,number] }}
              onClick={() => {
                setSelectedAnswer(null);
                setMascotMood("idle");
              }}
              aria-label="Go to next question"
            >
              Next Question →
            </motion.button>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
