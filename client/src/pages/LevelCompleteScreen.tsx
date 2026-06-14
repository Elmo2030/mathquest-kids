/**
 * LevelCompleteScreen — MathQuest Kids
 * ─────────────────────────────────────────────────────────────
 * Shown when a player finishes a grade and unlocks the next one.
 * Features:
 *  - react-confetti burst (5 s)
 *  - Three bouncing golden stars appearing one-by-one
 *  - "Level Complete!" headline + grade name badge
 *  - "Next Level →" primary CTA → starts first round of new grade
 *  - "Main Board" secondary CTA → Level Select screen
 *  - Fully bilingual EN / AR with RTL layout support
 * ─────────────────────────────────────────────────────────────
 */

import { useEffect, useState, useRef } from "react";
import Confetti from "react-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { useGame, type GradeZone } from "@/contexts/GameContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSoundEngine } from "@/hooks/useSoundEngine";

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

// Grade display info
const GRADE_INFO: Record<GradeZone, { emoji: string; en: string; ar: string; color: string }> = {
  KG: { emoji: "🌟", en: "Kindergarten",  ar: "الروضة",   color: "oklch(0.78 0.18 85)" },
  G1: { emoji: "🚀", en: "Grade 1",        ar: "الصف 1",   color: "oklch(0.58 0.19 250)" },
  G2: { emoji: "🎯", en: "Grade 2",        ar: "الصف 2",   color: "oklch(0.65 0.2 145)" },
  G3: { emoji: "🏆", en: "Grade 3",        ar: "الصف 3",   color: "oklch(0.62 0.22 25)" },
};

export default function LevelCompleteScreen() {
  const { levelJustUnlocked, startNextLevel, dismissLevelComplete, selectedLevel, round } = useGame();
  const { language, isRTL } = useLanguage();
  const { playFanfare, playStar } = useSoundEngine();

  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [confettiActive, setConfettiActive] = useState(true);
  const [starsShown, setStarsShown] = useState(0);
  const [headlineVisible, setHeadlineVisible] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const fanfarePlayed = useRef(false);

  const isAr = language === "ar";
  const displayFont = isAr ? "'Tajawal', sans-serif" : "'Fredoka One', cursive";
  const bodyFont    = isAr ? "'Tajawal', sans-serif" : "'Nunito', sans-serif";

  // Info about the level that was just completed
  const completedInfo = selectedLevel ? GRADE_INFO[selectedLevel] : null;
  // Info about the newly unlocked level
  const unlockedInfo  = levelJustUnlocked ? GRADE_INFO[levelJustUnlocked] : null;

  useEffect(() => {
    const onResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!fanfarePlayed.current) {
      fanfarePlayed.current = true;
      setTimeout(() => playFanfare(), 200);
    }
    // Stars appear one-by-one
    const t1 = setTimeout(() => { setStarsShown(1); playStar(); }, 400);
    const t2 = setTimeout(() => { setStarsShown(2); playStar(); }, 750);
    const t3 = setTimeout(() => { setStarsShown(3); playStar(); }, 1100);
    const t4 = setTimeout(() => setHeadlineVisible(true), 1400);
    const t5 = setTimeout(() => setButtonsVisible(true), 1900);
    const t6 = setTimeout(() => setConfettiActive(false), 6000);
    return () => [t1, t2, t3, t4, t5, t6].forEach(clearTimeout);
  }, [playFanfare, playStar]);

  // ── Copy strings ──────────────────────────────────────────────
  const completedLabel = isAr ? "اكتمل المستوى!" : "Level Complete!";
  const scoreText = isAr
    ? `أجبت على ${round.score} من ${round.questions.length} بشكل صحيح`
    : `You answered ${round.score} of ${round.questions.length} correctly`;
  const unlockedText = isAr
    ? `🔓 تم فتح ${unlockedInfo?.ar ?? ""}!`
    : `🔓 ${unlockedInfo?.en ?? ""} Unlocked!`;
  const nextLevelLabel = isAr ? "المستوى التالي ←" : "Next Level →";
  const mainBoardLabel = isAr ? "اللوحة الرئيسية" : "Main Board";

  const starsEarned = round.starsEarned;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
      style={{
        background: "linear-gradient(160deg, oklch(0.18 0.06 270) 0%, oklch(0.13 0.08 285) 60%, oklch(0.10 0.06 300) 100%)",
      }}
    >
      {/* Confetti */}
      {confettiActive && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={250}
          recycle={false}
          colors={["#FBBF24", "#34D399", "#60A5FA", "#F472B6", "#A78BFA", "#FCD34D"]}
          gravity={0.2}
          style={{ position: "fixed", top: 0, left: 0, zIndex: 51, pointerEvents: "none" }}
        />
      )}

      {/* Floating background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-xl"
            style={{ left: `${(i * 19 + 7) % 93}%`, top: `${(i * 27 + 8) % 88}%` }}
            animate={{ y: [-6, 6, -6], opacity: [0.25, 0.55, 0.25] }}
            transition={{ duration: 2.2 + (i % 3) * 0.6, repeat: Infinity, ease: "easeInOut", delay: (i % 5) * 0.25 }}
          >
            {["⭐", "✨", "🌟", "💫"][i % 4]}
          </motion.div>
        ))}
      </div>

      {/* Card */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease }}
        className="relative z-10 flex flex-col items-center text-center px-8 py-10 rounded-3xl mx-4"
        style={{
          background: "oklch(0.22 0.05 270 / 0.9)",
          border: "2.5px solid oklch(0.78 0.18 85 / 0.4)",
          backdropFilter: "blur(16px)",
          maxWidth: "480px",
          width: "100%",
          boxShadow: "0 24px 80px oklch(0 0 0 / 0.5)",
        }}
      >
        {/* Completed grade badge */}
        {completedInfo && (
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
            style={{
              background: `${completedInfo.color}22`,
              border: `2px solid ${completedInfo.color}66`,
              fontFamily: bodyFont,
              fontSize: "0.9rem",
              color: completedInfo.color,
              fontWeight: 700,
            }}
          >
            <span>{completedInfo.emoji}</span>
            <span dir="ltr">{isAr ? completedInfo.ar : completedInfo.en}</span>
          </div>
        )}

        {/* Three bouncing stars */}
        <div className="flex items-center justify-center gap-4 mb-6">
          {[0, 1, 2].map((i) => (
            <AnimatePresence key={i}>
              {starsShown > i && (
                <motion.div
                  initial={{ scale: 0, rotate: -30, opacity: 0 }}
                  animate={{
                    scale: [0, 1.3, 1],
                    rotate: [0, 15, 0],
                    opacity: 1,
                  }}
                  transition={{ duration: 0.45, ease }}
                  style={{ fontSize: "clamp(2.5rem, 8vw, 3.5rem)" }}
                >
                  {i < starsEarned ? "⭐" : "☆"}
                </motion.div>
              )}
            </AnimatePresence>
          ))}
        </div>

        {/* Headline */}
        <AnimatePresence>
          {headlineVisible && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease }}
              className="mb-3"
            >
              <h1
                style={{
                  fontFamily: displayFont,
                  fontSize: "clamp(1.8rem, 5vw, 2.6rem)",
                  color: "oklch(0.82 0.17 85)",
                  textShadow: "0 0 30px oklch(0.82 0.17 85 / 0.4)",
                  lineHeight: 1.15,
                  marginBottom: "0.35em",
                }}
              >
                {completedLabel}
              </h1>
              <p
                style={{
                  fontFamily: bodyFont,
                  fontSize: "0.95rem",
                  color: "oklch(0.75 0.04 270)",
                  lineHeight: 1.5,
                }}
                dir="ltr"
              >
                {scoreText}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unlock badge */}
        <AnimatePresence>
          {headlineVisible && unlockedInfo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4, ease }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-7"
              style={{
                background: "oklch(0.65 0.2 145 / 0.2)",
                border: "2px solid oklch(0.65 0.2 145 / 0.55)",
                fontFamily: bodyFont,
                fontSize: "0.95rem",
                color: "oklch(0.82 0.14 145)",
                fontWeight: 700,
              }}
            >
              <span>{unlockedInfo.emoji}</span>
              <span>{unlockedText}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA Buttons */}
        <AnimatePresence>
          {buttonsVisible && (
            <motion.div
              className="flex flex-col sm:flex-row gap-3 w-full"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease }}
            >
              {/* Next Level — primary */}
              <motion.button
                onClick={startNextLevel}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="flex-1 py-4 rounded-2xl font-bold"
                style={{
                  fontFamily: displayFont,
                  fontSize: "1.1rem",
                  background: "oklch(0.82 0.17 85)",
                  color: "oklch(0.18 0.04 270)",
                  border: "3px solid oklch(0.18 0.04 270)",
                  boxShadow: `${isRTL ? "-5px" : "5px"} 5px 0 oklch(0.18 0.04 270)`,
                  cursor: "pointer",
                }}
              >
                {nextLevelLabel}
              </motion.button>

              {/* Main Board — secondary */}
              <motion.button
                onClick={dismissLevelComplete}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 py-4 rounded-2xl font-bold"
                style={{
                  fontFamily: displayFont,
                  fontSize: "1.05rem",
                  background: "transparent",
                  color: "oklch(0.82 0.04 270)",
                  border: "2.5px solid oklch(0.45 0.04 270)",
                  cursor: "pointer",
                }}
              >
                {mainBoardLabel}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
