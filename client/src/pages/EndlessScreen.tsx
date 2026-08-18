/**
 * EndlessScreen — MathQuest Kids
 * ─────────────────────────────────────────────────────────────
 * Endless Challenge mode: randomly mixed questions from ALL
 * grades (KG → G3). Every correct answer earns a star.
 * No round limit — questions regenerate automatically.
 * Lives still apply; losing all lives ends the session and
 * shows a personal-best score summary.
 * ─────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSoundEngine } from "@/hooks/useSoundEngine";
import { generateEndlessRound, getLocalizedQuestion, validateAnswer, getCorrectChoice } from "@/lib/mathEngine";
import type { Question } from "@/lib/mathEngine";
import LtrNum from "@/components/LtrNum";
import BrandingFooter from "@/components/BrandingFooter";

const QUESTIONS_PER_BATCH = 10;
const MAX_LIVES = 3;

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

const ANSWER_COLORS = [
  { bg: "oklch(0.58 0.19 250)", shadow: "oklch(0.38 0.19 250)" },
  { bg: "oklch(0.65 0.2 145)", shadow: "oklch(0.45 0.2 145)" },
  { bg: "oklch(0.82 0.17 85)",  shadow: "oklch(0.62 0.12 85)" },
  { bg: "oklch(0.62 0.22 25)",  shadow: "oklch(0.42 0.22 25)" },
];

type FeedbackState = "idle" | "correct" | "wrong";

export default function EndlessScreen() {
  const { goToLevels, endlessScore, navigateTo } = useGame();
  const { language, isRTL } = useLanguage();
  const { playCorrect, playWrong, playClick, playStar } = useSoundEngine();

  const isAr = language === "ar";
  const displayFont = isAr ? "'Tajawal', sans-serif" : "'Fredoka One', cursive";
  const bodyFont = isAr ? "'Tajawal', sans-serif" : "'Nunito', sans-serif";

  const [questions, setQuestions] = useState<Question[]>(() => generateEndlessRound(QUESTIONS_PER_BATCH));
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackState>("idle");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [bestScore, setBestScore] = useState(endlessScore);
  const [isNewBest, setIsNewBest] = useState(false);
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentQuestion = questions[qIndex] ?? null;
  const localizedQuestion = currentQuestion ? getLocalizedQuestion(currentQuestion, language) : null;

  // Regenerate batch when we reach the end
  useEffect(() => {
    if (qIndex >= questions.length && !gameOver) {
      setQuestions(generateEndlessRound(QUESTIONS_PER_BATCH));
      setQIndex(0);
    }
  }, [qIndex, questions.length, gameOver]);

  const handleAnswer = useCallback((choiceId: string) => {
    if (feedback !== "idle" || gameOver || !currentQuestion) return;
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);

    const correct = validateAnswer(currentQuestion, choiceId);
    setSelectedId(choiceId);
    setTotalAnswered((p) => p + 1);

    if (correct) {
      playCorrect();
      playStar();
      setScore((p) => {
        const next = p + 1;
        if (next > bestScore) {
          setBestScore(next);
          setIsNewBest(true);
          // Persist best score
          try { localStorage.setItem("mq_endless_score_v1", String(next)); } catch { /* ignore */ }
        }
        return next;
      });
      setFeedback("correct");
    } else {
      playWrong();
      const newLives = lives - 1;
      setLives(newLives);
      setFeedback("wrong");
      if (newLives <= 0) {
        autoAdvanceRef.current = setTimeout(() => setGameOver(true), 1400);
        return;
      }
    }

    autoAdvanceRef.current = setTimeout(() => {
      setFeedback("idle");
      setSelectedId(null);
      setQIndex((p) => p + 1);
    }, 1400);
  }, [feedback, gameOver, currentQuestion, lives, bestScore, playCorrect, playWrong, playStar]);

  const handleRestart = () => {
    playClick();
    setQuestions(generateEndlessRound(QUESTIONS_PER_BATCH));
    setQIndex(0);
    setScore(0);
    setLives(MAX_LIVES);
    setTotalAnswered(0);
    setFeedback("idle");
    setSelectedId(null);
    setGameOver(false);
    setIsNewBest(false);
  };

  // Labels
  const t = {
    title: isAr ? "تحدي بلا نهاية" : "Endless Challenge",
    score: isAr ? "النتيجة" : "Score",
    lives: isAr ? "الأرواح" : "Lives",
    best: isAr ? "أفضل نتيجة" : "Best",
    solve: isAr ? "احسب:" : "Solve:",
    count: isAr ? "كم عددها؟" : "How many?",
    fraction: isAr ? "ما الكسر؟" : "What fraction?",
    gameOverTitle: isAr ? "انتهت اللعبة!" : "Game Over!",
    gameOverScore: isAr ? "نتيجتك النهائية" : "Your Final Score",
    newBest: isAr ? "🎉 رقم قياسي جديد!" : "🎉 New Best Score!",
    playAgain: isAr ? "🔄 العب مجدّدًا" : "🔄 Play Again",
    chooseLevels: isAr ? "📚 اختر المستوى" : "📚 Choose Level",
    correct: isAr ? "عمل رائع! 🌟" : "Great Job! 🌟",
    wrong: isAr ? "حاول مجدّدًا! 💪" : "Try Again! 💪",
    accuracy: isAr ? "الدقة" : "Accuracy",
    answered: isAr ? "أُجيب عليها" : "Answered",
  };

  const accuracy = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0;

  if (gameOver) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center"
        dir={isRTL ? "rtl" : "ltr"}
        style={{ background: "linear-gradient(160deg, oklch(0.22 0.06 270) 0%, oklch(0.16 0.08 280) 100%)" }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease }}
          className="w-full max-w-sm rounded-3xl p-8"
          style={{
            background: "oklch(0.20 0.06 270)",
            border: "3px solid oklch(0.35 0.08 270)",
            boxShadow: "0 20px 60px oklch(0 0 0 / 0.5)",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "0.5rem" }}>🎮</div>
          <h2 style={{ fontFamily: displayFont, fontSize: "2rem", color: "oklch(0.82 0.17 85)", marginBottom: "0.25rem" }}>
            {t.gameOverTitle}
          </h2>
          {isNewBest && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{ fontFamily: bodyFont, fontSize: "1rem", color: "oklch(0.65 0.2 145)", fontWeight: 700, marginBottom: "0.5rem" }}
            >
              {t.newBest}
            </motion.div>
          )}
          <p style={{ fontFamily: bodyFont, fontSize: "0.9rem", color: "oklch(0.70 0.04 270)", marginBottom: "1.5rem" }}>
            {t.gameOverScore}
          </p>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: t.score, value: score, emoji: "⭐" },
              { label: t.accuracy, value: `${accuracy}%`, emoji: "🎯" },
              { label: t.answered, value: totalAnswered, emoji: "📝" },
            ].map(({ label, value, emoji }) => (
              <div
                key={label}
                className="rounded-2xl p-3 flex flex-col items-center"
                style={{ background: "oklch(0.16 0.05 270)", border: "1.5px solid oklch(0.30 0.06 270)" }}
              >
                <span style={{ fontSize: "1.4rem" }}>{emoji}</span>
                <span style={{ fontFamily: displayFont, fontSize: "1.4rem", color: "oklch(0.82 0.17 85)" }}>
                  <LtrNum>{String(value)}</LtrNum>
                </span>
                <span style={{ fontFamily: bodyFont, fontSize: "0.65rem", color: "oklch(0.60 0.04 270)" }}>{label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <motion.button
              onClick={handleRestart}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="w-full py-3 rounded-2xl font-bold"
              style={{ fontFamily: displayFont, fontSize: "1.1rem", background: "oklch(0.82 0.17 85)", color: "oklch(0.18 0.04 270)", border: "2.5px solid oklch(0.18 0.04 270)", boxShadow: `${isRTL ? "-4px" : "4px"} 4px 0 oklch(0.18 0.04 270)`, cursor: "pointer" }}
            >
              {t.playAgain}
            </motion.button>
            <motion.button
              onClick={() => { playClick(); goToLevels(); }}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="w-full py-3 rounded-2xl font-bold"
              style={{ fontFamily: displayFont, fontSize: "1.1rem", background: "oklch(0.58 0.19 250)", color: "white", border: "2.5px solid oklch(0.18 0.04 270)", boxShadow: `${isRTL ? "-4px" : "4px"} 4px 0 oklch(0.18 0.04 270)`, cursor: "pointer" }}
            >
              {t.chooseLevels}
            </motion.button>
          </div>
        </motion.div>
        <BrandingFooter />
      </div>
    );
  }

  if (!currentQuestion) return null;

  const correctChoice = getCorrectChoice(currentQuestion);
  const isCountingQuestion = currentQuestion.type === "counting";
  const isFractionQuestion = currentQuestion.type === "fraction";

  return (
    <div
      className="min-h-screen flex flex-col"
      dir={isRTL ? "rtl" : "ltr"}
      style={{ background: "linear-gradient(160deg, oklch(0.22 0.06 270) 0%, oklch(0.16 0.08 280) 100%)" }}
    >
      {/* HUD */}
      <header
        className="sticky top-0 z-20 w-full px-4 py-3 flex items-center justify-between gap-3"
        style={{ background: "oklch(0.18 0.06 270 / 0.95)", borderBottom: "2px solid oklch(0.30 0.06 270)", backdropFilter: "blur(8px)" }}
      >
        {/* Back button */}
        <motion.button
          onClick={() => { playClick(); goToLevels(); }}
          whileTap={{ scale: 0.95 }}
          className="px-3 py-1.5 rounded-xl text-sm font-bold"
          style={{ fontFamily: bodyFont, background: "oklch(0.28 0.06 270)", color: "oklch(0.80 0.04 270)", border: "1.5px solid oklch(0.35 0.06 270)", cursor: "pointer" }}
        >
          {isRTL ? "→" : "←"} {isAr ? "خروج" : "Exit"}
        </motion.button>

        {/* Title */}
        <div className="flex items-center gap-2">
          <span style={{ fontSize: "1.2rem" }}>🔥</span>
          <span style={{ fontFamily: displayFont, fontSize: "1.1rem", color: "oklch(0.82 0.17 85)" }}>
            {t.title}
          </span>
        </div>

        {/* Score + Lives */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
            style={{ background: "oklch(0.82 0.17 85 / 0.15)", border: "1.5px solid oklch(0.82 0.17 85 / 0.4)" }}
          >
            <span style={{ fontSize: "1rem" }}>⭐</span>
            <span style={{ fontFamily: displayFont, fontSize: "1.1rem", color: "oklch(0.82 0.17 85)" }}>
              <LtrNum>{String(score)}</LtrNum>
            </span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: MAX_LIVES }).map((_, i) => (
              <span key={i} style={{ fontSize: "1.1rem", opacity: i < lives ? 1 : 0.25 }}>❤️</span>
            ))}
          </div>
        </div>
      </header>

      {/* Best score banner */}
      <div
        className="w-full px-4 py-1.5 flex items-center justify-center gap-3 text-sm"
        style={{ background: "oklch(0.16 0.05 270)", borderBottom: "1px solid oklch(0.28 0.06 270 / 0.5)" }}
      >
        <span style={{ fontFamily: bodyFont, color: "oklch(0.60 0.04 270)", fontSize: "0.8rem" }}>
          {t.best}: <span style={{ color: "oklch(0.82 0.17 85)", fontWeight: 700 }}><LtrNum>{String(bestScore)}</LtrNum></span>
        </span>
        <span style={{ color: "oklch(0.40 0.04 270)" }}>•</span>
        <span style={{ fontFamily: bodyFont, color: "oklch(0.60 0.04 270)", fontSize: "0.8rem" }}>
          {t.accuracy}: <span style={{ color: "oklch(0.65 0.2 145)", fontWeight: 700 }}><LtrNum>{String(accuracy)}%</LtrNum></span>
        </span>
      </div>

      {/* Question area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 gap-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${qIndex}-${questions[0]?.id}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease }}
            className="w-full max-w-md rounded-3xl p-6"
            style={{
              background: "oklch(0.20 0.06 270)",
              border: "3px solid oklch(0.35 0.08 270)",
              boxShadow: "0 8px 32px oklch(0 0 0 / 0.4)",
            }}
          >
            {/* Grade badge */}
            <div className="flex items-center justify-between mb-4">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{ fontFamily: bodyFont, background: "oklch(0.58 0.19 250 / 0.25)", color: "oklch(0.75 0.12 250)", border: "1px solid oklch(0.58 0.19 250 / 0.4)" }}
              >
                {localizedQuestion?.categoryEmoji} {localizedQuestion?.category}
              </span>
              <span style={{ fontFamily: bodyFont, fontSize: "0.8rem", color: "oklch(0.55 0.04 270)" }}>
                #{<LtrNum>{String(totalAnswered + 1)}</LtrNum>}
              </span>
            </div>

            {/* Prompt */}
            <p style={{ fontFamily: bodyFont, fontSize: "1rem", color: "oklch(0.75 0.04 270)", marginBottom: "1rem" }}>
              {isCountingQuestion ? t.count : isFractionQuestion ? t.fraction : t.solve}
            </p>

            {/* Visual / equation */}
            {isCountingQuestion && currentQuestion.countingIcon && currentQuestion.countingAmount && (
              <div className="flex flex-wrap gap-1.5 justify-center mb-4">
                {Array.from({ length: currentQuestion.countingAmount }).map((_, i) => (
                  <span key={i} style={{ fontSize: "1.8rem" }}>{currentQuestion.countingIcon!.emoji}</span>
                ))}
              </div>
            )}
            {isFractionQuestion && (
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
                  style={{ background: "oklch(0.58 0.19 250 / 0.25)", border: "3px solid oklch(0.58 0.19 250 / 0.6)" }}>
                  {currentQuestion.fractionVisual?.label ?? "?"}
                </div>
              </div>
            )}
            {!isCountingQuestion && !isFractionQuestion && (
              <div
                className="flex items-center justify-center py-4 mb-4 rounded-2xl"
                style={{ background: "oklch(0.16 0.05 270)", border: "2px solid oklch(0.32 0.07 270)" }}
              >
                <span
                  dir="ltr"
                  style={{ fontFamily: displayFont, fontSize: "clamp(1.8rem, 6vw, 2.5rem)", color: "oklch(0.95 0.02 270)", letterSpacing: "0.05em" }}
                >
                  {localizedQuestion?.text ?? currentQuestion.text}
                </span>
              </div>
            )}

            {/* Feedback banner */}
            <AnimatePresence>
              {feedback !== "idle" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-center py-2 rounded-xl mb-3"
                  style={{
                    background: feedback === "correct" ? "oklch(0.65 0.2 145 / 0.2)" : "oklch(0.62 0.22 25 / 0.2)",
                    border: `2px solid ${feedback === "correct" ? "oklch(0.65 0.2 145 / 0.5)" : "oklch(0.62 0.22 25 / 0.5)"}`,
                    fontFamily: displayFont,
                    fontSize: "1.1rem",
                    color: feedback === "correct" ? "oklch(0.75 0.15 145)" : "oklch(0.75 0.15 25)",
                  }}
                >
                  {feedback === "correct" ? t.correct : t.wrong}
                  {feedback === "wrong" && (
                    <span style={{ display: "block", fontFamily: bodyFont, fontSize: "0.85rem", marginTop: "0.2rem" }}>
                      {isAr ? "الإجابة الصحيحة: " : "Correct answer: "}
                      <span dir="ltr" style={{ fontWeight: 700 }}>{correctChoice.label}</span>
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* Answer buttons */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-md">
          {currentQuestion.choices.map((choice, i) => {
            const col = ANSWER_COLORS[i % ANSWER_COLORS.length];
            const isSelected = selectedId === choice.id;
            const isCorrectChoice = choice.correct;
            let bg = col.bg;
            let border = "oklch(0.18 0.04 270)";
            if (feedback !== "idle" && isSelected) {
              bg = isCorrectChoice ? "oklch(0.65 0.2 145)" : "oklch(0.62 0.22 25)";
            } else if (feedback !== "idle" && isCorrectChoice) {
              bg = "oklch(0.65 0.2 145)";
            }

            return (
              <motion.button
                key={choice.id}
                onClick={() => handleAnswer(choice.id)}
                disabled={feedback !== "idle"}
                whileHover={feedback === "idle" ? { scale: 1.04, y: -2 } : {}}
                whileTap={feedback === "idle" ? { scale: 0.97 } : {}}
                animate={feedback !== "idle" && isSelected && !isCorrectChoice ? { x: [-4, 4, -4, 4, 0] } : {}}
                transition={{ duration: 0.3 }}
                className="py-4 rounded-2xl font-bold text-center"
                style={{
                  fontFamily: displayFont,
                  fontSize: "clamp(1.1rem, 3vw, 1.4rem)",
                  background: bg,
                  color: "white",
                  border: `3px solid ${border}`,
                  boxShadow: feedback === "idle" ? `${isRTL ? "-4px" : "4px"} 4px 0 ${col.shadow}` : "none",
                  cursor: feedback === "idle" ? "pointer" : "default",
                  transition: "background 0.2s ease",
                  direction: "ltr",
                }}
              >
                {choice.label}
              </motion.button>
            );
          })}
        </div>
      </main>

      <BrandingFooter />
    </div>
  );
}
