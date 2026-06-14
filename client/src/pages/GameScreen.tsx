/**
 * GameScreen — MathQuest Kids
 * Design: Sunny Storybook
 * ─────────────────────────────────────────────────────────────
 * Fully wired game area:
 *   TOP HUD  — Score, Stars, Lives (hearts), Progress bar
 *   CENTER   — Question card (text + visual aid for KG)
 *              Mascot reacts to correct / wrong answers
 *   BOTTOM   — 4 multiple-choice answer buttons (2×2 grid)
 *
 * Feedback:
 *   ✅ Correct → green flash + scale burst + "Great Job!" + mascot celebrate
 *   ❌ Wrong   → red flash + shake + "Try Again!" + mascot oops + lose a life
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import MascotOwl from "@/components/MascotOwl";
import FloatingDecorations from "@/components/FloatingDecorations";
import type { MoodType } from "@/components/MascotOwl";
import type { Question, AnswerChoice } from "@/lib/mathEngine";

const LOGO_STAR =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663029442648/HuT9LUnwcUFmp6Xsie23M7/logo-star-VXHLUR84pLpFzMGbXzZvfX.webp";

// ── Answer button color palette (4 slots) ─────────────────────
const ANSWER_COLORS = [
  { bg: "oklch(0.58 0.19 250)", text: "white",                     hover: "oklch(0.52 0.19 250)" },
  { bg: "oklch(0.82 0.17 85)",  text: "oklch(0.18 0.04 270)",      hover: "oklch(0.78 0.17 85)"  },
  { bg: "oklch(0.65 0.2 145)",  text: "white",                     hover: "oklch(0.58 0.2 145)"  },
  { bg: "oklch(0.62 0.22 25)",  text: "white",                     hover: "oklch(0.56 0.22 25)"  },
];

// ── Feedback messages ─────────────────────────────────────────
const CORRECT_MESSAGES = [
  "Great Job! 🎉",
  "You're Amazing! ⭐",
  "Correct! Keep Going! 🚀",
  "Brilliant! 🌟",
  "Awesome Work! 🎊",
  "You Got It! 💫",
];
const WRONG_MESSAGES = [
  "Try Again! 💪",
  "Almost! Keep Going! 🤔",
  "Don't Give Up! 🌈",
  "Good Try! 🦉",
  "You Can Do It! ✨",
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

function ScoreBadge({ score }: { score: number }) {
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
        boxShadow: "3px 3px 0 oklch(0.18 0.04 270)",
      }}
    >
      <span className="text-lg select-none" aria-hidden="true">⭐</span>
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
    </motion.div>
  );
}

function QuestionProgress({ current, total }: { current: number; total: number }) {
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
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }}
        />
      </div>
    </div>
  );
}

// ── KG Visual Aid ─────────────────────────────────────────────

function CountingVisual({ question }: { question: Question }) {
  if (question.type === "number_id" && question.countingAmount !== undefined) {
    // Show a large numeral for number recognition
    return (
      <div className="flex flex-col items-center gap-1">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          style={{
            fontFamily: "'Fredoka One', sans-serif",
            fontSize: "5rem",
            lineHeight: 1,
            color: "oklch(0.18 0.04 270)",
            textShadow: "3px 4px 0 oklch(0.82 0.17 85)",
          }}
        >
          {question.countingAmount}
        </motion.div>
        <p
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700,
            fontSize: "0.85rem",
            color: "oklch(0.52 0.04 270)",
          }}
        >
          What number is this?
        </p>
      </div>
    );
  }

  if (
    question.type === "counting" &&
    question.countingIcon &&
    question.countingAmount !== undefined
  ) {
    const { emoji } = question.countingIcon;
    const count = question.countingAmount;
    // Arrange icons in rows of up to 5
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
                  transition={{
                    delay: globalIdx * 0.06,
                    type: "spring",
                    stiffness: 350,
                    damping: 18,
                  }}
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

  // G1 arithmetic visual: show the equation
  if (
    (question.type === "addition" || question.type === "subtraction") &&
    question.operandA !== undefined &&
    question.operandB !== undefined
  ) {
    const op = question.type === "addition" ? "+" : "−";
    return (
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <span
          style={{
            fontFamily: "'Fredoka One', sans-serif",
            fontSize: "2.8rem",
            color: "oklch(0.18 0.04 270)",
          }}
        >
          {question.operandA}
        </span>
        <span
          style={{
            fontFamily: "'Fredoka One', sans-serif",
            fontSize: "2.4rem",
            color:
              question.type === "addition"
                ? "oklch(0.58 0.19 250)"
                : "oklch(0.62 0.22 25)",
          }}
        >
          {op}
        </span>
        <span
          style={{
            fontFamily: "'Fredoka One', sans-serif",
            fontSize: "2.8rem",
            color: "oklch(0.18 0.04 270)",
          }}
        >
          {question.operandB}
        </span>
        <span
          style={{
            fontFamily: "'Fredoka One', sans-serif",
            fontSize: "2.4rem",
            color: "oklch(0.52 0.04 270)",
          }}
        >
          = ?
        </span>
      </div>
    );
  }

  return null;
}

// ── Answer Button ─────────────────────────────────────────────

type ButtonState = "idle" | "correct" | "wrong" | "reveal";

function AnswerButton({
  choice,
  colorIndex,
  state,
  onClick,
  disabled,
}: {
  choice: AnswerChoice;
  colorIndex: number;
  state: ButtonState;
  onClick: () => void;
  disabled: boolean;
}) {
  const palette = ANSWER_COLORS[colorIndex % ANSWER_COLORS.length];

  const bgColor =
    state === "correct" || state === "reveal"
      ? "oklch(0.65 0.2 145)"   // green
      : state === "wrong"
      ? "oklch(0.62 0.22 25)"   // red
      : palette.bg;

  const textColor =
    state === "correct" || state === "wrong" || state === "reveal"
      ? "white"
      : palette.text;

  return (
    <motion.button
      className="answer-btn w-full relative overflow-hidden"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        fontFamily: "'Fredoka One', sans-serif",
        transition: "background-color 0.2s ease",
      }}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled && state === "idle" ? { scale: 1.03, y: -2 } : {}}
      animate={
        state === "correct"
          ? { scale: [1, 1.12, 1], transition: { duration: 0.35 } }
          : state === "wrong"
          ? { x: [-7, 7, -6, 6, -4, 4, 0], transition: { duration: 0.4 } }
          : {}
      }
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      aria-label={`Answer: ${choice.label}`}
      aria-pressed={state !== "idle"}
    >
      {/* Correct flash overlay */}
      {(state === "correct" || state === "reveal") && (
        <motion.div
          className="absolute inset-0 rounded-xl"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{ background: "oklch(0.85 0.2 145)" }}
        />
      )}
      {state === "correct" && <span className="mr-1">✅</span>}
      {state === "wrong"   && <span className="mr-1">❌</span>}
      {state === "reveal"  && <span className="mr-1">✅</span>}
      {choice.label}
    </motion.button>
  );
}

// ── Main Screen ───────────────────────────────────────────────

export default function GameScreen() {
  const {
    goToLevels,
    selectedLevel,
    round,
    currentQuestion,
    answerQuestion,
    nextQuestion,
  } = useGame();

  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [mascotMood, setMascotMood] = useState<MoodType>("idle");
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [isAdvancing, setIsAdvancing] = useState(false);

  // Reset local state when the question index changes
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

      // Dispatch to reducer
      answerQuestion(choice.id);

      if (correct) {
        setMascotMood("celebrate");
        setFeedbackMsg(randomItem(CORRECT_MESSAGES));
      } else {
        setMascotMood("oops");
        setFeedbackMsg(randomItem(WRONG_MESSAGES));
      }

      // Auto-advance after 1.6 s
      setTimeout(() => {
        setMascotMood("idle");
        setIsAdvancing(true);
        setTimeout(() => {
          nextQuestion();
        }, 200);
      }, 1600);
    },
    [selectedChoiceId, isAdvancing, answerQuestion, nextQuestion]
  );

  const getButtonState = (choice: AnswerChoice): ButtonState => {
    if (!selectedChoiceId) return "idle";
    if (choice.id === selectedChoiceId) {
      return choice.correct ? "correct" : "wrong";
    }
    // Reveal the correct answer after wrong pick
    if (!isCorrect && choice.correct) return "reveal";
    return "idle";
  };

  const levelLabels: Record<string, string> = {
    KG: "🌟 Kindergarten",
    G1: "🚀 Grade 1",
    G2: "🎯 Grade 2",
    G3: "🏆 Grade 3",
  };

  const questionNumber = round.currentIndex + 1;
  const totalQuestions = round.questions.length;

  if (!currentQuestion) return null;

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
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }}
      >
        {/* Row 1: Exit | Score | Lives */}
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <button
              className="btn-ink btn-ink-white text-sm px-3 py-2"
              onClick={goToLevels}
              aria-label="Exit game"
            >
              ✕
            </button>
            <div
              className="px-3 py-1.5 rounded-xl text-sm hidden sm:block"
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

          <ScoreBadge score={round.score} />
          <HeartLives lives={round.lives} />
        </div>

        {/* Row 2: Progress bar */}
        <div className="flex items-center gap-3">
          <img src={LOGO_STAR} alt="" className="w-6 h-6 shrink-0" aria-hidden="true" />
          <QuestionProgress current={questionNumber} total={totalQuestions} />
          <span
            style={{
              fontFamily: "'Fredoka One', sans-serif",
              fontSize: "0.85rem",
              color: "oklch(0.52 0.04 270)",
              whiteSpace: "nowrap",
            }}
          >
            Q {questionNumber}/{totalQuestions}
          </span>
        </div>
      </motion.header>

      {/* ── MAIN CONTENT ────────────────────────────────── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-between px-4 py-3 gap-3 max-w-lg mx-auto w-full">

        {/* ── MASCOT + FEEDBACK ───────────────────────── */}
        <div className="flex flex-col items-center gap-2 w-full">
          <MascotOwl mood={mascotMood} size="md" />

          <AnimatePresence mode="wait">
            {feedbackMsg ? (
              <motion.div
                key="feedback"
                initial={{ scale: 0.7, opacity: 0, y: 8 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.85, opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }}
                className="px-5 py-2 rounded-2xl text-center"
                style={{
                  background: isCorrect
                    ? "oklch(0.65 0.2 145)"
                    : "oklch(0.62 0.22 25)",
                  border: "2.5px solid oklch(0.18 0.04 270)",
                  boxShadow: "3px 3px 0 oklch(0.18 0.04 270)",
                  fontFamily: "'Fredoka One', sans-serif",
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
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  color: "oklch(0.45 0.04 270)",
                  textAlign: "center",
                }}
              >
                Ollie says: "{currentQuestion.hint}"
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* ── QUESTION CARD ───────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            className="card-ink w-full px-5 py-5 md:py-6 text-center"
            initial={{ scale: 0.92, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }}
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
                {currentQuestion.categoryEmoji} {currentQuestion.category}
              </span>
            </div>

            {/* Question text */}
            <h2
              className="text-3xl md:text-4xl leading-tight mb-4"
              style={{
                fontFamily: "'Fredoka One', sans-serif",
                color: "oklch(0.18 0.04 270)",
              }}
            >
              {currentQuestion.text}
            </h2>

            {/* Visual aid */}
            <div
              className="flex items-center justify-center py-3 px-4 rounded-xl min-h-[80px]"
              style={{
                background: "oklch(0.97 0.02 90)",
                border: "2px dashed oklch(0.75 0.04 270)",
              }}
            >
              <CountingVisual question={currentQuestion} />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── ANSWER BUTTONS ──────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id + "-choices"}
            className="grid grid-cols-2 gap-3 w-full"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ delay: 0.1, duration: 0.3, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }}
          >
            {currentQuestion.choices.map((choice, i) => (
              <AnswerButton
                key={choice.id}
                choice={choice}
                colorIndex={i}
                state={getButtonState(choice)}
                onClick={() => handleAnswer(choice)}
                disabled={!!selectedChoiceId || isAdvancing}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
