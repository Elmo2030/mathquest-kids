/**
 * SummaryScreen — MathQuest Kids
 * Design: Sunny Storybook
 * ─────────────────────────────────────────────────────────────
 * End-of-round celebration screen:
 *   - Animated star award (staggered pop-in)
 *   - Score breakdown (correct / total)
 *   - Accuracy percentage
 *   - Mascot mood tied to performance
 *   - "Play Again" and "Choose Level" buttons
 *   - Confetti burst for 3-star performance
 * ─────────────────────────────────────────────────────────────
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import MascotOwl from "@/components/MascotOwl";
import type { MoodType } from "@/components/MascotOwl";

const LOGO_STAR =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663029442648/HuT9LUnwcUFmp6Xsie23M7/logo-star-VXHLUR84pLpFzMGbXzZvfX.webp";

// ── Confetti particle ─────────────────────────────────────────

interface Particle {
  id: number;
  x: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
  rotate: number;
}

const CONFETTI_COLORS = [
  "oklch(0.82 0.17 85)",
  "oklch(0.58 0.19 250)",
  "oklch(0.65 0.2 145)",
  "oklch(0.62 0.22 25)",
  "oklch(0.72 0.18 310)",
];

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: 8 + Math.random() * 10,
    delay: Math.random() * 0.6,
    duration: 1.5 + Math.random() * 1.2,
    rotate: Math.random() * 360,
  }));
}

function ConfettiBurst({ active }: { active: boolean }) {
  const [particles] = useState(() => generateParticles(40));

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-50" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            top: "-10px",
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            border: "1.5px solid oklch(0.18 0.04 270 / 0.3)",
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{
            y: ["0vh", "110vh"],
            rotate: [0, p.rotate],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

// ── Animated Star ─────────────────────────────────────────────

function AwardStar({ filled, delay }: { filled: boolean; delay: number }) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -30, opacity: 0 }}
      animate={
        filled
          ? { scale: [0, 1.4, 1], rotate: [-30, 10, 0], opacity: 1 }
          : { scale: 1, rotate: 0, opacity: 1 }
      }
      transition={{
        delay,
        duration: filled ? 0.5 : 0.3,
        ease: [0.23, 1, 0.32, 1] as [number, number, number, number],
      }}
      style={{ display: "inline-block" }}
    >
      <span
        className="text-6xl md:text-7xl select-none"
        style={{
          color: filled ? "oklch(0.82 0.17 85)" : "oklch(0.85 0.04 90)",
          filter: filled
            ? "drop-shadow(0 0 8px oklch(0.82 0.17 85 / 0.7)) drop-shadow(2px 3px 0 oklch(0.18 0.04 270 / 0.3))"
            : "none",
        }}
        aria-hidden="true"
      >
        ★
      </span>
    </motion.div>
  );
}

// ── Performance messages ──────────────────────────────────────

const STAR_MESSAGES: Record<number, { title: string; sub: string; mood: MoodType }> = {
  0: {
    title: "Keep Practicing!",
    sub: "Every expert was once a beginner. Try again! 💪",
    mood: "thinking",
  },
  1: {
    title: "Good Effort!",
    sub: "You earned a star! Keep going to get more! 🌟",
    mood: "happy",
  },
  2: {
    title: "Great Job!",
    sub: "Two stars! You're getting really good! 🚀",
    mood: "celebrate",
  },
  3: {
    title: "AMAZING! 🎉",
    sub: "PERFECT! Three stars! You're a Math Hero! 🏆",
    mood: "celebrate",
  },
};

// ── Result Row ────────────────────────────────────────────────

function ResultRow({
  label,
  value,
  color,
  delay,
}: {
  label: string;
  value: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      className="flex items-center justify-between px-4 py-3 rounded-2xl"
      style={{
        background: "oklch(0.99 0.015 85)",
        border: "2.5px solid oklch(0.18 0.04 270)",
        boxShadow: "3px 3px 0 oklch(0.18 0.04 270)",
      }}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay, duration: 0.3, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }}
    >
      <span
        style={{
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 700,
          fontSize: "1rem",
          color: "oklch(0.35 0.04 270)",
        }}
      >
        {label}
      </span>
      <span
        className="px-3 py-1 rounded-xl"
        style={{
          background: color,
          border: "2px solid oklch(0.18 0.04 270)",
          fontFamily: "'Fredoka One', sans-serif",
          fontSize: "1.1rem",
          color: "oklch(0.18 0.04 270)",
        }}
      >
        {value}
      </span>
    </motion.div>
  );
}

// ── Main Screen ───────────────────────────────────────────────

export default function SummaryScreen() {
  const { round, selectedLevel, goToLevels, restartRound, levels } = useGame();
  const [showConfetti, setShowConfetti] = useState(false);

  const stars = round.starsEarned;
  const correct = round.score;
  const total = round.questions.length;
  const accuracy = Math.round((correct / total) * 100);
  const msg = STAR_MESSAGES[stars];

  const levelInfo = levels.find((l) => l.id === selectedLevel);

  useEffect(() => {
    if (stars === 3) {
      const t = setTimeout(() => setShowConfetti(true), 400);
      return () => clearTimeout(t);
    }
  }, [stars]);

  return (
    <div
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: "oklch(0.985 0.025 90)" }}
    >
      <ConfettiBurst active={showConfetti} />

      {/* Decorative top band */}
      <div
        className="w-full py-6 px-4"
        style={{
          background:
            stars === 3
              ? "oklch(0.82 0.17 85)"
              : stars === 2
              ? "oklch(0.58 0.19 250)"
              : stars === 1
              ? "oklch(0.65 0.2 145)"
              : "oklch(0.75 0.04 270)",
          borderBottom: "3px solid oklch(0.18 0.04 270)",
          boxShadow: "0 4px 0 oklch(0.18 0.04 270)",
        }}
      >
        {/* Level badge */}
        <motion.div
          className="flex justify-center mb-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span
            className="px-4 py-1.5 rounded-full text-base"
            style={{
              background: "oklch(0.99 0.015 85 / 0.9)",
              border: "2.5px solid oklch(0.18 0.04 270)",
              fontFamily: "'Fredoka One', sans-serif",
              color: "oklch(0.18 0.04 270)",
            }}
          >
            {levelInfo?.emoji} {levelInfo?.label} Complete!
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-center text-4xl md:text-5xl"
          style={{
            fontFamily: "'Fredoka One', sans-serif",
            color: "oklch(0.18 0.04 270)",
            textShadow: "2px 3px 0 oklch(0.18 0.04 270 / 0.2)",
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }}
        >
          {msg.title}
        </motion.h1>
      </div>

      <main className="flex-1 flex flex-col items-center px-4 py-5 gap-5 max-w-md mx-auto w-full">

        {/* Stars row */}
        <div className="flex items-center justify-center gap-4" aria-label={`${stars} out of 3 stars`}>
          {[0, 1, 2].map((i) => (
            <AwardStar key={i} filled={i < stars} delay={0.3 + i * 0.18} />
          ))}
        </div>

        {/* Mascot */}
        <MascotOwl mood={msg.mood} size="md" />

        {/* Sub-message */}
        <motion.p
          className="text-center text-lg"
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700,
            color: "oklch(0.28 0.04 270)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          {msg.sub}
        </motion.p>

        {/* Score breakdown */}
        <div className="flex flex-col gap-2.5 w-full">
          <ResultRow
            label="✅ Correct Answers"
            value={`${correct} / ${total}`}
            color="oklch(0.82 0.17 85)"
            delay={0.6}
          />
          <ResultRow
            label="🎯 Accuracy"
            value={`${accuracy}%`}
            color={
              accuracy >= 90
                ? "oklch(0.82 0.17 85)"
                : accuracy >= 60
                ? "oklch(0.78 0.15 145)"
                : "oklch(0.85 0.1 25)"
            }
            delay={0.7}
          />
          <ResultRow
            label="⭐ Stars Earned"
            value={`${stars} / 3`}
            color="oklch(0.82 0.17 85)"
            delay={0.8}
          />
          {round.lives < 3 && (
            <ResultRow
              label="❤️ Lives Remaining"
              value={`${round.lives} / 3`}
              color={round.lives === 0 ? "oklch(0.85 0.1 25)" : "oklch(0.82 0.17 85)"}
              delay={0.9}
            />
          )}
        </div>

        {/* Action buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 w-full"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.35 }}
        >
          <motion.button
            className="btn-ink btn-ink-blue flex-1 py-4 text-xl"
            onClick={restartRound}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            aria-label="Play again"
          >
            🔄 Play Again!
          </motion.button>

          <motion.button
            className="btn-ink btn-ink-white flex-1 py-4 text-xl"
            onClick={goToLevels}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            aria-label="Choose another level"
          >
            🗺️ Levels
          </motion.button>
        </motion.div>

        {/* Logo */}
        <motion.div
          className="flex items-center gap-2 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <img src={LOGO_STAR} alt="" className="w-7 h-7" aria-hidden="true" />
          <span
            style={{
              fontFamily: "'Fredoka One', sans-serif",
              fontSize: "0.95rem",
              color: "oklch(0.52 0.04 270)",
            }}
          >
            MathQuest Kids
          </span>
        </motion.div>
      </main>
    </div>
  );
}
