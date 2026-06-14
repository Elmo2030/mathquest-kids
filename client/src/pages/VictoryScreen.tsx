/**
 * VictoryScreen — MathQuest Kids
 * ─────────────────────────────────────────────────────────────
 * Grand celebration screen shown when the user passes ALL
 * sub-levels in Grade 3 (completing the full curriculum).
 *
 * Features:
 *  - Full-screen react-confetti burst
 *  - Animated trophy + star cascade
 *  - Bilingual headline: "You are a Math Genius!" / "أنت عبقري رياضيات!"
 *  - "Show Parents" CTA → Parents Dashboard
 *  - "Endless Challenge" unlock button → Endless Mode
 *  - "Play Again" → Level Select
 * ─────────────────────────────────────────────────────────────
 */

import { useEffect, useState, useRef } from "react";
import Confetti from "react-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSoundEngine } from "@/hooks/useSoundEngine";
import BrandingFooter from "@/components/BrandingFooter";

const LOGO_STAR =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663029442648/HuT9LUnwcUFmp6Xsie23M7/logo-star-VXHLUR84pLpFzMGbXzZvfX.webp";
const MASCOT_OWL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663029442648/HuT9LUnwcUFmp6Xsie23M7/mascot-owl-EBNrLSFLMjdFrBjJhJdHBM.webp";

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

export default function VictoryScreen() {
  const { navigateTo, goToLevels, startEndlessMode, totalStarsEarned } = useGame();
  const { language, isRTL } = useLanguage();
  const { playFanfare, playStar } = useSoundEngine();

  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [confettiActive, setConfettiActive] = useState(true);
  const [starsVisible, setStarsVisible] = useState(false);
  const [badgeVisible, setBadgeVisible] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const fanfarePlayed = useRef(false);

  const isAr = language === "ar";
  const displayFont = isAr ? "'Tajawal', sans-serif" : "'Fredoka One', cursive";
  const bodyFont = isAr ? "'Tajawal', sans-serif" : "'Nunito', sans-serif";

  // Responsive window size
  useEffect(() => {
    const onResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Sequence: fanfare → stars → badge → buttons
  useEffect(() => {
    if (!fanfarePlayed.current) {
      fanfarePlayed.current = true;
      setTimeout(() => playFanfare(), 300);
      setTimeout(() => playStar(), 800);
      setTimeout(() => playStar(), 1100);
      setTimeout(() => playStar(), 1400);
    }
    const t1 = setTimeout(() => setStarsVisible(true), 400);
    const t2 = setTimeout(() => setBadgeVisible(true), 900);
    const t3 = setTimeout(() => setButtonsVisible(true), 1600);
    const t4 = setTimeout(() => setConfettiActive(false), 8000);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [playFanfare, playStar]);

  const headline = isAr ? "أنت عبقري رياضيات!" : "You are a Math Genius!";
  const subline = isAr
    ? "لقد أتممت جميع المستويات! أنت بطل حقيقي 🏆"
    : "You've completed every level! A true Math Hero! 🏆";
  const showParentsLabel = isAr ? "أخبر والديك 👨‍👩‍👧" : "Show Parents 👨‍👩‍👧";
  const endlessLabel = isAr ? "🔥 تحدي بلا نهاية" : "🔥 Endless Challenge";
  const playAgainLabel = isAr ? "📚 اختر المستوى" : "📚 Choose Level";
  const unlockedLabel = isAr ? "🔓 تم الفتح!" : "🔓 Unlocked!";
  const starsLabel = isAr ? "نجوم مكتسبة" : "Stars Earned";

  return (
    <div
      className="relative min-h-screen flex flex-col overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
      style={{
        background: "linear-gradient(160deg, oklch(0.22 0.06 270) 0%, oklch(0.16 0.08 280) 50%, oklch(0.12 0.06 300) 100%)",
      }}
    >
      {/* Confetti */}
      {confettiActive && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={350}
          recycle={false}
          colors={["#FBBF24", "#34D399", "#60A5FA", "#F472B6", "#A78BFA", "#FCD34D", "#6EE7B7"]}
          gravity={0.25}
          style={{ position: "fixed", top: 0, left: 0, zIndex: 50, pointerEvents: "none" }}
        />
      )}

      {/* Floating star particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            style={{ left: `${(i * 17 + 5) % 95}%`, top: `${(i * 23 + 10) % 85}%` }}
            animate={{ y: [-8, 8, -8], rotate: [-10, 10, -10], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2.5 + (i % 4) * 0.5, repeat: Infinity, ease: "easeInOut", delay: (i % 6) * 0.3 }}
          >
            {["⭐", "🌟", "✨", "💫"][i % 4]}
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">

        {/* Trophy + Owl */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="relative mb-6"
        >
          {/* Giant trophy emoji */}
          <div
            style={{
              fontSize: "clamp(5rem, 15vw, 8rem)",
              lineHeight: 1,
              filter: "drop-shadow(0 0 40px oklch(0.82 0.17 85 / 0.8))",
            }}
          >
            🏆
          </div>
          {/* Owl mascot overlay */}
          <motion.img
            src={MASCOT_OWL}
            alt="Ollie the Owl"
            className="absolute -bottom-4 -right-8 w-20 h-20 object-contain"
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Stars row */}
        <AnimatePresence>
          {starsVisible && (
            <motion.div
              className="flex items-center gap-2 mb-6"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease }}
            >
              {[0, 1, 2].map((i) => (
                <motion.img
                  key={i}
                  src={LOGO_STAR}
                  alt="star"
                  className="w-12 h-12 object-contain"
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.4, ease }}
                />
              ))}
              <span
                style={{
                  fontFamily: bodyFont,
                  fontSize: "1.1rem",
                  color: "oklch(0.82 0.17 85)",
                  fontWeight: 700,
                  marginInlineStart: "0.5rem",
                }}
              >
                <span dir="ltr">{totalStarsEarned}</span> {starsLabel}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Headline badge */}
        <AnimatePresence>
          {badgeVisible && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease }}
              className="mb-4"
            >
              <h1
                style={{
                  fontFamily: displayFont,
                  fontSize: "clamp(2rem, 6vw, 3.5rem)",
                  color: "oklch(0.82 0.17 85)",
                  textShadow: "0 0 40px oklch(0.82 0.17 85 / 0.5), 0 4px 0 oklch(0.18 0.04 270)",
                  lineHeight: 1.15,
                  marginBottom: "0.5rem",
                }}
              >
                {headline}
              </h1>
              <p
                style={{
                  fontFamily: bodyFont,
                  fontSize: "clamp(1rem, 3vw, 1.3rem)",
                  color: "oklch(0.85 0.04 270)",
                  maxWidth: "36ch",
                  margin: "0 auto",
                  lineHeight: 1.5,
                }}
              >
                {subline}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unlock badge */}
        <AnimatePresence>
          {badgeVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, ease }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8"
              style={{
                background: "oklch(0.65 0.2 145 / 0.25)",
                border: "2px solid oklch(0.65 0.2 145 / 0.6)",
                fontFamily: bodyFont,
                fontSize: "1rem",
                color: "oklch(0.85 0.12 145)",
                fontWeight: 700,
              }}
            >
              {unlockedLabel}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action buttons */}
        <AnimatePresence>
          {buttonsVisible && (
            <motion.div
              className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
            >
              {/* Show Parents — primary CTA */}
              <motion.button
                onClick={() => navigateTo("parents")}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 w-full py-4 rounded-2xl text-lg font-bold"
                style={{
                  fontFamily: displayFont,
                  fontSize: "1.15rem",
                  background: "oklch(0.82 0.17 85)",
                  color: "oklch(0.18 0.04 270)",
                  border: "3px solid oklch(0.18 0.04 270)",
                  boxShadow: `${isRTL ? "-5px" : "5px"} 5px 0 oklch(0.18 0.04 270)`,
                  cursor: "pointer",
                }}
              >
                {showParentsLabel}
              </motion.button>

              {/* Endless Challenge */}
              <motion.button
                onClick={startEndlessMode}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 w-full py-4 rounded-2xl text-lg font-bold"
                style={{
                  fontFamily: displayFont,
                  fontSize: "1.15rem",
                  background: "oklch(0.62 0.22 25)",
                  color: "white",
                  border: "3px solid oklch(0.18 0.04 270)",
                  boxShadow: `${isRTL ? "-5px" : "5px"} 5px 0 oklch(0.18 0.04 270)`,
                  cursor: "pointer",
                }}
              >
                {endlessLabel}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {buttonsVisible && (
            <motion.button
              onClick={goToLevels}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="mt-4 px-6 py-2 rounded-xl"
              style={{
                fontFamily: bodyFont,
                fontSize: "0.95rem",
                color: "oklch(0.75 0.04 270)",
                background: "transparent",
                border: "1.5px solid oklch(0.75 0.04 270 / 0.4)",
                cursor: "pointer",
              }}
              whileHover={{ color: "oklch(0.95 0 0)", borderColor: "oklch(0.95 0 0 / 0.6)" }}
            >
              {playAgainLabel}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <BrandingFooter />
    </div>
  );
}
