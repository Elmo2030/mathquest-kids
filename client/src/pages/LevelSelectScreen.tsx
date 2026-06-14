/**
 * LevelSelectScreen — MathQuest Kids
 * Design: Sunny Storybook
 * Layout: Storybook map background, four grade zone cards in a 2x2 grid,
 *         each showing lock/unlock state, star rating, and a "Play" button.
 */

import { motion } from "framer-motion";
import { useGame, type LevelInfo } from "@/contexts/GameContext";
import FloatingDecorations from "@/components/FloatingDecorations";
import MascotOwl from "@/components/MascotOwl";

const LEVEL_BG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663029442648/HuT9LUnwcUFmp6Xsie23M7/level-bg-Am4tSjW7v3sFBcfAVC3Ehm.webp";
const LOGO_STAR =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663029442648/HuT9LUnwcUFmp6Xsie23M7/logo-star-VXHLUR84pLpFzMGbXzZvfX.webp";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const cardVariants = {
  hidden:  { y: 40, opacity: 0, scale: 0.92 },
  visible: {
    y: 0, opacity: 1, scale: 1,
    transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] as [number,number,number,number] },
  },
};

function StarRating({ stars, total }: { stars: number; total: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${stars} of ${total} stars`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className="text-xl md:text-2xl transition-transform"
          style={{
            color: i < stars ? "oklch(0.99 0.015 85)" : "oklch(0.99 0.015 85 / 0.4)",
            filter: i < stars ? "drop-shadow(0 0 3px oklch(0.18 0.04 270 / 0.4))" : "none",
            transform: i < stars ? "scale(1.1)" : "scale(1)",
            display: "inline-block",
          }}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </div>
  );
}

function LevelCard({ level, index }: { level: LevelInfo; index: number }) {
  const { selectLevel } = useGame();

  return (
    <motion.div
      variants={cardVariants}
      className="relative rounded-3xl overflow-hidden"
      style={{
        border: "3px solid oklch(0.18 0.04 270)",
        boxShadow: `6px 6px 0px oklch(0.18 0.04 270)`,
      }}
      whileHover={level.unlocked ? { y: -4, boxShadow: "8px 10px 0px oklch(0.18 0.04 270)" } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Card background */}
      <div
        className="p-5 md:p-6 flex flex-col gap-3"
        style={{ backgroundColor: level.bgColor }}
      >
        {/* Top row: emoji + grade label */}
        <div className="flex items-start justify-between">
          <div>
            <div className="text-4xl md:text-5xl mb-1">{level.emoji}</div>
            <h3
              className="text-xl md:text-2xl leading-tight"
              style={{
                fontFamily: "'Fredoka One', sans-serif",
                color: level.color,
                textShadow: level.unlocked ? "1px 2px 0 oklch(0.18 0.04 270 / 0.25)" : "none",
              }}
            >
              {level.label}
            </h3>
            <p
              className="text-sm md:text-base mt-0.5"
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 700,
                color: level.color === "white"
                  ? "oklch(0.95 0 0 / 0.85)"
                  : "oklch(0.28 0.04 270)",
              }}
            >
              {level.subtitle}
            </p>
          </div>

          {/* Zone number badge */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-black"
            style={{
              background: "oklch(0.99 0.015 85)",
              border: "2.5px solid oklch(0.18 0.04 270)",
              fontFamily: "'Fredoka One', sans-serif",
              color: "oklch(0.18 0.04 270)",
            }}
          >
            {index + 1}
          </div>
        </div>

        {/* Stars */}
        <div className="flex items-center justify-between">
          <StarRating stars={level.stars} total={level.totalStars} />
          {level.unlocked && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: "oklch(0.99 0.015 85 / 0.8)",
                border: "1.5px solid oklch(0.18 0.04 270)",
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 800,
                color: "oklch(0.18 0.04 270)",
              }}
            >
              {level.stars}/{level.totalStars} ⭐
            </span>
          )}
        </div>

        {/* Play / Locked button */}
        {level.unlocked ? (
          <motion.button
            className="btn-ink w-full py-3 text-lg"
            style={{
              background: "oklch(0.99 0.015 85)",
              color: "oklch(0.18 0.04 270)",
              fontFamily: "'Fredoka One', sans-serif",
              border: "3px solid oklch(0.18 0.04 270)",
              boxShadow: "4px 4px 0 oklch(0.18 0.04 270)",
            }}
            onClick={() => selectLevel(level.id)}
            whileTap={{ scale: 0.96 }}
            aria-label={`Play ${level.label}`}
          >
            🎮 Let's Play!
          </motion.button>
        ) : (
          <div
            className="w-full py-3 text-lg rounded-xl flex items-center justify-center gap-2"
            style={{
              background: "oklch(0.18 0.04 270 / 0.25)",
              border: "3px solid oklch(0.18 0.04 270 / 0.4)",
              fontFamily: "'Fredoka One', sans-serif",
              color: level.color === "white" ? "oklch(0.95 0 0 / 0.6)" : "oklch(0.18 0.04 270 / 0.5)",
            }}
            aria-label={`${level.label} is locked`}
          >
            🔒 Locked
          </div>
        )}
      </div>

      {/* Locked overlay */}
      {!level.unlocked && (
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: "oklch(0.18 0.04 270 / 0.18)",
            backdropFilter: "blur(1.5px)",
          }}
          aria-hidden="true"
        />
      )}
    </motion.div>
  );
}

export default function LevelSelectScreen() {
  const { goHome, levels } = useGame();

  return (
    <div
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{
        backgroundImage: `url(${LEVEL_BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "oklch(0.985 0.025 90 / 0.45)" }}
      />

      <FloatingDecorations density="low" />

      {/* Header */}
      <motion.header
        className="relative z-10 flex items-center justify-between px-5 pt-5 pb-2"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] as [number,number,number,number] }}
      >
        <button
          className="btn-ink btn-ink-white text-base px-4 py-2.5"
          onClick={goHome}
          aria-label="Go back to home"
        >
          ← Back
        </button>

        <div className="flex items-center gap-2">
          <img src={LOGO_STAR} alt="" className="w-9 h-9" aria-hidden="true" />
          <span
            className="text-xl md:text-2xl"
            style={{
              fontFamily: "'Fredoka One', sans-serif",
              color: "oklch(0.18 0.04 270)",
              textShadow: "2px 2px 0 oklch(0.82 0.17 85)",
            }}
          >
            Pick Your Quest!
          </span>
        </div>

        {/* Mascot small */}
        <MascotOwl mood="idle" size="sm" />
      </motion.header>

      {/* Page title */}
      <motion.div
        className="relative z-10 text-center px-4 pt-2 pb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35, ease: [0.23, 1, 0.32, 1] as [number,number,number,number] }}
      >
        <h2
          className="text-3xl md:text-4xl"
          style={{
            fontFamily: "'Fredoka One', sans-serif",
            color: "oklch(0.18 0.04 270)",
            textShadow: "2px 3px 0 oklch(0.82 0.17 85)",
          }}
        >
          Choose Your Grade Zone
        </h2>
        <p
          className="text-base md:text-lg mt-1"
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700,
            color: "oklch(0.28 0.04 270)",
          }}
        >
          Complete quests to unlock new adventures! 🗺️
        </p>
      </motion.div>

      {/* Level Cards Grid */}
      <main className="relative z-10 flex-1 px-4 pb-8">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-2xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {levels.map((level, i) => (
            <LevelCard key={level.id} level={level} index={i} />
          ))}
        </motion.div>

        {/* Progress summary */}
        <motion.div
          className="max-w-2xl mx-auto mt-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.35 }}
        >
          <div
            className="flex items-center justify-between px-5 py-3 rounded-2xl"
            style={{
              background: "oklch(0.99 0.015 85 / 0.88)",
              border: "2.5px solid oklch(0.18 0.04 270)",
              boxShadow: "3px 3px 0 oklch(0.18 0.04 270)",
            }}
          >
            <span
              style={{
                fontFamily: "'Fredoka One', sans-serif",
                fontSize: "1rem",
                color: "oklch(0.18 0.04 270)",
              }}
            >
              Total Progress
            </span>
            <div className="flex items-center gap-3 flex-1 mx-4">
              <div className="progress-track flex-1">
                <div className="progress-fill" style={{ width: "25%" }} />
              </div>
              <span
                style={{
                  fontFamily: "'Fredoka One', sans-serif",
                  fontSize: "0.95rem",
                  color: "oklch(0.18 0.04 270)",
                  minWidth: "3rem",
                  textAlign: "right",
                }}
              >
                3 / 12 ⭐
              </span>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
