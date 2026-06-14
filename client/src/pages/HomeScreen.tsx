/**
 * HomeScreen — MathQuest Kids
 * Design: Sunny Storybook
 * Layout: Full-screen hero with warm cream bg image, centered mascot + title,
 *         large "Play" CTA, and "Parents Dashboard" secondary button.
 */

import { motion } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import MascotOwl from "@/components/MascotOwl";
import FloatingDecorations from "@/components/FloatingDecorations";

const HERO_BG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663029442648/HuT9LUnwcUFmp6Xsie23M7/hero-bg-NGHvceSnJXhQwUn4AGvBuA.webp";
const LOGO_STAR =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663029442648/HuT9LUnwcUFmp6Xsie23M7/logo-star-VXHLUR84pLpFzMGbXzZvfX.webp";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden:  { y: 30, opacity: 0 },
  visible: { y: 0,  opacity: 1, transition: { duration: 0.45, ease: [0.23, 1, 0.32, 1] as [number,number,number,number] } },
};

export default function HomeScreen() {
  const { goToLevels, navigateTo, totalStarsEarned } = useGame();

  return (
    <div
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{
        backgroundImage: `url(${HERO_BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Warm overlay to ensure text readability */}
      <div
        className="absolute inset-0"
        style={{ background: "oklch(0.985 0.025 90 / 0.55)" }}
      />

      <FloatingDecorations density="medium" />

      {/* Top bar: Logo */}
      <motion.header
        className="relative z-10 flex items-center justify-between px-6 pt-6 pb-2"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] as [number,number,number,number] }}
      >
        <div className="flex items-center gap-3">
          <img
            src={LOGO_STAR}
            alt="MathQuest Kids logo"
            className="w-12 h-12 drop-shadow-md"
          />
          <span
            className="text-2xl md:text-3xl"
            style={{
              fontFamily: "'Fredoka One', sans-serif",
              color: "oklch(0.18 0.04 270)",
              textShadow: "2px 2px 0 oklch(0.82 0.17 85)",
            }}
          >
            MathQuest Kids
          </span>
        </div>

        {/* Settings placeholder */}
        <button
          className="btn-ink btn-ink-white text-sm px-4 py-2"
          style={{ fontFamily: "'Fredoka One', sans-serif" }}
          onClick={() => navigateTo("parents")}
          aria-label="Settings"
        >
          ⚙️ Settings
        </button>
      </motion.header>

      {/* Main content */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-8 gap-6 md:gap-8">
        <motion.div
          className="flex flex-col items-center gap-4 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Mascot */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <MascotOwl mood="idle" size="xl" />
          </motion.div>

          {/* Title block */}
          <motion.div variants={itemVariants} className="text-center">
            <h1
              className="text-5xl md:text-7xl leading-none mb-2"
              style={{
                fontFamily: "'Fredoka One', sans-serif",
                color: "oklch(0.18 0.04 270)",
                textShadow: "3px 3px 0 oklch(0.82 0.17 85), 5px 5px 0 oklch(0.18 0.04 270 / 0.15)",
              }}
            >
              MathQuest!
            </h1>
            <p
              className="text-xl md:text-2xl"
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 700,
                color: "oklch(0.28 0.04 270)",
              }}
            >
              Ready to become a Math Hero? 🦸
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-sm sm:max-w-none"
          >
            {/* Primary: Play */}
            <motion.button
              className="btn-ink btn-ink-blue w-full sm:w-auto text-2xl md:text-3xl px-12 py-5"
              onClick={goToLevels}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              aria-label="Start playing"
            >
              🎮 Play Now!
            </motion.button>

            {/* Secondary: Parents Dashboard */}
            <motion.button
              className="btn-ink btn-ink-white w-full sm:w-auto text-lg md:text-xl px-8 py-4"
              onClick={() => navigateTo("parents")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              aria-label="Open parents dashboard"
            >
              👨‍👩‍👧 Parents Dashboard
            </motion.button>
          </motion.div>

          {/* Stars earned teaser */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl"
            style={{
              background: "oklch(0.99 0.015 85 / 0.85)",
              border: "2.5px solid oklch(0.18 0.04 270)",
              boxShadow: "3px 3px 0 oklch(0.18 0.04 270)",
            }}
          >
            <span className="text-2xl">⭐</span>
            <span
              style={{
                fontFamily: "'Fredoka One', sans-serif",
                fontSize: "1.1rem",
                color: "oklch(0.18 0.04 270)",
              }}
            >
              {totalStarsEarned} Stars Earned!
            </span>
            <span className="text-2xl">⭐</span>
          </motion.div>
        </motion.div>
      </main>

      {/* Bottom wave decoration */}
      <div className="relative z-10 w-full" aria-hidden="true">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          style={{ display: "block", marginBottom: "-2px" }}
        >
          <path
            d="M0 40 C360 80 1080 0 1440 40 L1440 80 L0 80 Z"
            fill="oklch(0.985 0.025 90)"
          />
        </svg>
      </div>
    </div>
  );
}
