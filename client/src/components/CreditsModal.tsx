/**
 * CreditsModal — MathQuest Kids
 * ─────────────────────────────────────────────────────────────
 * Beautiful dedication modal showing who the app was made for.
 * Features:
 *  - Animated entrance with confetti-like particles
 *  - Bilingual EN/AR support with RTL layout
 *  - Smooth fade-out on close
 * ─────────────────────────────────────────────────────────────
 */

import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

interface CreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreditsModal({ isOpen, onClose }: CreditsModalProps) {
  const { isRTL } = useLanguage();
  const displayFont = isRTL ? "'Tajawal', sans-serif" : "'Fredoka One', cursive";
  const bodyFont    = isRTL ? "'Tajawal', sans-serif" : "'Nunito', sans-serif";

  const title = isRTL ? "من نحن 📖" : "About Us 📖";
  const dedicatedTo = isRTL ? "تم إنشاء هذا التطبيق لـ:" : "This app was made for:";
  const heroName = "السيد يحيي أحمد وأصدقاؤه";
  const tagline = isRTL
    ? "لتعليم الرياضيات بطريقة ممتعة وتفاعلية 🎓"
    : "To make learning math fun and interactive 🎓";
  const closeBtn = isRTL ? "حسناً ✓" : "Got it ✓";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0" style={{ background: "oklch(0 0 0 / 0.6)" }} />

          {/* Floating particles background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                style={{
                  left: `${(i * 23 + 12) % 95}%`,
                  top: `${(i * 31 + 15) % 90}%`,
                }}
                animate={{
                  y: [-8, 8, -8],
                  opacity: [0.3, 0.7, 0.3],
                  rotate: [0, 360, 0],
                }}
                transition={{
                  duration: 3 + (i % 2) * 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: (i % 4) * 0.3,
                }}
              >
                {["⭐", "✨", "🌟", "💫"][i % 4]}
              </motion.div>
            ))}
          </div>

          {/* Modal card */}
          <motion.div
            className="relative z-10 flex flex-col items-center text-center px-8 py-10 rounded-3xl"
            style={{
              background: "linear-gradient(135deg, oklch(0.22 0.05 270 / 0.95) 0%, oklch(0.20 0.06 280 / 0.95) 100%)",
              border: "3px solid oklch(0.82 0.17 85)",
              boxShadow: "0 20px 60px oklch(0 0 0 / 0.4), inset 0 1px 0 oklch(1 0 0 / 0.1)",
              maxWidth: "420px",
              width: "100%",
              backdropFilter: "blur(8px)",
            }}
            initial={{ scale: 0.75, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 30 }}
            transition={{ duration: 0.4, ease }}
            onClick={(e) => e.stopPropagation()}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              style={{
                fontFamily: displayFont,
                fontSize: "1.8rem",
                color: "oklch(0.82 0.17 85)",
                marginBottom: "1.2rem",
                textShadow: "0 2px 8px oklch(0 0 0 / 0.3)",
              }}
            >
              {title}
            </motion.h2>

            {/* Dedicated to label */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              style={{
                fontFamily: bodyFont,
                fontSize: "0.95rem",
                color: "oklch(0.75 0.04 270)",
                marginBottom: "0.8rem",
                fontWeight: 600,
              }}
            >
              {dedicatedTo}
            </motion.p>

            {/* Hero name — large and prominent */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4, ease }}
              className="px-6 py-4 rounded-2xl mb-4"
              style={{
                background: "linear-gradient(135deg, oklch(0.82 0.17 85 / 0.15), oklch(0.65 0.2 145 / 0.15))",
                border: "2.5px solid oklch(0.82 0.17 85 / 0.4)",
              }}
            >
              <p
                style={{
                  fontFamily: displayFont,
                  fontSize: "1.5rem",
                  color: "oklch(0.82 0.17 85)",
                  fontWeight: 800,
                  lineHeight: 1.3,
                }}
              >
                {heroName}
              </p>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              style={{
                fontFamily: bodyFont,
                fontSize: "1rem",
                color: "oklch(0.70 0.05 270)",
                lineHeight: 1.6,
                marginBottom: "1.8rem",
              }}
            >
              {tagline}
            </motion.p>

            {/* Close button */}
            <motion.button
              onClick={onClose}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3.5 rounded-2xl font-bold"
              style={{
                fontFamily: displayFont,
                fontSize: "1.1rem",
                background: "oklch(0.82 0.17 85)",
                color: "oklch(0.18 0.04 270)",
                border: "3px solid oklch(0.18 0.04 270)",
                boxShadow: `${isRTL ? "-4px" : "4px"} 4px 0 oklch(0.18 0.04 270)`,
                cursor: "pointer",
              }}
            >
              {closeBtn}
            </motion.button>

            {/* Decorative emoji line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              style={{
                marginTop: "1.2rem",
                fontSize: "1.5rem",
                letterSpacing: "0.3em",
              }}
            >
              ⭐ 🎓 ⭐
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
