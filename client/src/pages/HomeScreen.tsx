/**
 * HomeScreen — MathQuest Kids
 * Design: Sunny Storybook
 * i18n: Full EN/AR support with RTL layout switching.
 * Numbers: All star counts wrapped in LtrNum for RTL safety.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import { useMultPractice } from "@/contexts/MultPracticeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import MascotOwl from "@/components/MascotOwl";
import FloatingDecorations from "@/components/FloatingDecorations";
import MathGate from "@/components/MathGate";
import LanguageToggle from "@/components/LanguageToggle";
import LtrNum from "@/components/LtrNum";
import BrandingFooter from "@/components/BrandingFooter";
import { usePWA } from "@/hooks/usePWA";

const HERO_BG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663029442648/HuT9LUnwcUFmp6Xsie23M7/hero-bg-NGHvceSnJXhQwUn4AGvBuA.webp";
const LOGO_STAR =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663029442648/HuT9LUnwcUFmp6Xsie23M7/logo-star-VXHLUR84pLpFzMGbXzZvfX.webp";

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden:  { y: 30, opacity: 0 },
  visible: { y: 0,  opacity: 1, transition: { duration: 0.45, ease } },
};

export default function HomeScreen() {
  const { goToLevels, navigateTo, totalStarsEarned, goToTrophy } = useGame();
  const { openPractice } = useMultPractice();
  const { t, isRTL } = useLanguage();
  const [showGate, setShowGate] = useState(false);
  const { isInstallable, promptInstall } = usePWA();

  const handleParentsDashboard = () => setShowGate(true);
  const handleGateSuccess = () => { setShowGate(false); navigateTo("parents"); };
  const handleGateDismiss = () => setShowGate(false);

  const displayFont = isRTL ? "'Tajawal', sans-serif" : "'Fredoka One', sans-serif";
  const bodyFont   = isRTL ? "'Tajawal', sans-serif" : "'Nunito', sans-serif";

  return (
    <>
      <div
        className="relative min-h-screen flex flex-col overflow-hidden"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Warm overlay */}
        <div className="absolute inset-0" style={{ background: "oklch(0.985 0.025 90 / 0.55)" }} />
        <FloatingDecorations density="medium" />

        {/* Header */}
        <motion.header
          className="relative z-10 flex items-center justify-between px-6 pt-6 pb-2"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={LOGO_STAR} alt="MathQuest Kids logo" className="w-12 h-12 drop-shadow-md" />
            <span
              className="text-2xl md:text-3xl"
              style={{
                fontFamily: displayFont,
                color: "oklch(0.18 0.04 270)",
                textShadow: "2px 2px 0 oklch(0.82 0.17 85)",
              }}
            >
              {t("appName")}
            </span>
          </div>

          {/* Header right: Language toggle + Settings */}
          <div className="flex items-center gap-2">
            <LanguageToggle variant="light" />
            <button
              className="btn-ink btn-ink-white text-sm px-4 py-2"
              style={{ fontFamily: displayFont }}
              onClick={handleParentsDashboard}
              aria-label={t("parentsDashboard")}
            >
              {t("settings")}
            </button>
          </div>
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

            {/* Title */}
            <motion.div variants={itemVariants} className="text-center">
              <h1
                className="text-5xl md:text-7xl leading-none mb-2"
                style={{
                  fontFamily: displayFont,
                  color: "oklch(0.18 0.04 270)",
                  textShadow: "3px 3px 0 oklch(0.82 0.17 85), 5px 5px 0 oklch(0.18 0.04 270 / 0.15)",
                }}
              >
                {t("homeTitle")}
              </h1>
              <p
                className="text-xl md:text-2xl"
                style={{ fontFamily: bodyFont, fontWeight: 700, color: "oklch(0.28 0.04 270)" }}
              >
                {t("homeSubtitle")}
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-sm sm:max-w-none"
            >
              <motion.button
                className="btn-ink btn-ink-blue w-full sm:w-auto text-2xl md:text-3xl px-12 py-5"
                style={{ fontFamily: displayFont }}
                onClick={goToLevels}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                aria-label={t("playNow")}
              >
                {t("playNow")}
              </motion.button>

              <motion.button
                className="btn-ink btn-ink-white w-full sm:w-auto text-lg md:text-xl px-8 py-4"
                style={{ fontFamily: displayFont }}
                onClick={handleParentsDashboard}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                aria-label={t("parentsDashboard")}
              >
                {t("parentsDashboard")}
              </motion.button>

              <motion.button
                className="btn-ink w-full sm:w-auto text-lg md:text-xl px-8 py-4"
                style={{
                  fontFamily: displayFont,
                  background: "oklch(0.82 0.17 85)",
                  border: "3px solid oklch(0.18 0.04 270)",
                  boxShadow: `${isRTL ? "-4px" : "4px"} 4px 0 oklch(0.18 0.04 270)`,
                  color: "oklch(0.18 0.04 270)",
                }}
                onClick={goToTrophy}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                aria-label={t("trophyRoom")}
              >
                {t("trophyRoom")}
              </motion.button>

              {/* Multiplication Practice — always unlocked, electric purple */}
              <motion.button
                className="btn-ink w-full sm:w-auto text-lg md:text-xl px-8 py-4"
                style={{
                  fontFamily: displayFont,
                  background: "oklch(0.55 0.22 270)",
                  border: "3px solid oklch(0.18 0.04 270)",
                  boxShadow: `${isRTL ? "-4px" : "4px"} 4px 0 oklch(0.18 0.04 270)`,
                  color: "oklch(0.98 0 0)",
                }}
                onClick={openPractice}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                aria-label={t("multPractice")}
              >
                ⚡ {t("multPractice")}
              </motion.button>
            </motion.div>

            {/* Install App — only shown when browser install prompt is available */}
            {isInstallable && (
              <motion.div variants={itemVariants}>
                <motion.button
                  className="btn-ink w-full sm:w-auto text-base px-6 py-3"
                  style={{
                    fontFamily: displayFont,
                    background: "oklch(0.52 0.18 145)",
                    border: "3px solid oklch(0.18 0.04 270)",
                    boxShadow: `${isRTL ? "-4px" : "4px"} 4px 0 oklch(0.18 0.04 270)`,
                    color: "oklch(0.98 0 0)",
                  }}
                  onClick={promptInstall}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  aria-label={t("installApp")}
                  title={t("installAppHint")}
                >
                  {t("installApp")}
                </motion.button>
              </motion.div>
            )}

            {/* Stars earned */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl"
              style={{
                background: "oklch(0.99 0.015 85 / 0.85)",
                border: "2.5px solid oklch(0.18 0.04 270)",
                boxShadow: "3px 3px 0 oklch(0.18 0.04 270)",
              }}
            >
              <span className="text-2xl" aria-hidden="true">⭐</span>
              <span style={{ fontFamily: displayFont, fontSize: "1.1rem", color: "oklch(0.18 0.04 270)" }}>
                <LtrNum>{totalStarsEarned}</LtrNum>
                {" "}{t("starsEarned")}
              </span>
              <span className="text-2xl" aria-hidden="true">⭐</span>
            </motion.div>
          </motion.div>
        </main>

        {/* Bottom wave */}
        <div className="relative z-10 w-full" aria-hidden="true">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{ display: "block", marginBottom: "-2px" }}>
            <path d="M0 40 C360 80 1080 0 1440 40 L1440 80 L0 80 Z" fill="oklch(0.985 0.025 90)" />
          </svg>
        </div>
      </div>

      {/* Branding Footer */}
      <BrandingFooter />

      {/* Math Gate */}
      <AnimatePresence>
        {showGate && <MathGate onSuccess={handleGateSuccess} onDismiss={handleGateDismiss} />}
      </AnimatePresence>
    </>
  );
}
