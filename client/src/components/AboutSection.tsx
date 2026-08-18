/**
 * AboutSection — MathQuest Kids
 * Design: Sunny Storybook
 * A permanent, bilingual story and dedication section inside HomeScreen.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSoundEngine } from "@/hooks/useSoundEngine";
import MascotOwl from "@/components/MascotOwl";

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

const STORY_POINTS = [
  { emoji: "🧠", en: "Learn by playing", ar: "نتعلّم من خلال اللعب" },
  { emoji: "🌈", en: "Grow with confidence", ar: "ننمو بثقة" },
  { emoji: "🏆", en: "Celebrate every step", ar: "نحتفل بكل خطوة" },
];

export default function AboutSection() {
  const { isRTL } = useLanguage();
  const { playDedication, playStar, playClick } = useSoundEngine();
  const [heroPulse, setHeroPulse] = useState(false);

  const displayFont = isRTL ? "'Tajawal', sans-serif" : "'Fredoka One', cursive";
  const bodyFont = isRTL ? "'Tajawal', sans-serif" : "'Nunito', sans-serif";

  const handleDedicationTap = () => {
    playDedication();
    window.setTimeout(() => playStar(), 300);
    setHeroPulse(true);
  };

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      dir={isRTL ? "rtl" : "ltr"}
      className="relative overflow-hidden px-5 py-16 md:px-8 md:py-24"
      style={{
        background: "linear-gradient(180deg, oklch(0.985 0.025 90) 0%, oklch(0.94 0.055 85) 100%)",
      }}
    >
      {/* Storybook background details */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {["⭐", "✨", "🌟", "💫", "⭐", "✨"].map((symbol, index) => (
          <motion.span
            key={`${symbol}-${index}`}
            className="absolute text-xl md:text-2xl"
            style={{
              left: `${(index * 19 + 6) % 94}%`,
              top: `${(index * 23 + 8) % 88}%`,
            }}
            animate={{ y: [-5, 5, -5], rotate: [0, 8, 0], opacity: [0.25, 0.65, 0.25] }}
            transition={{ duration: 2.8 + (index % 3) * 0.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.15 }}
          >
            {symbol}
          </motion.span>
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, ease }}
          className="mb-10 text-center"
        >
          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-2"
            style={{
              background: "oklch(0.82 0.17 85 / 0.25)",
              border: "2px solid oklch(0.18 0.04 270 / 0.18)",
              color: "oklch(0.18 0.04 270)",
              fontFamily: bodyFont,
              fontWeight: 800,
            }}
          >
            📖 {isRTL ? "قصتنا" : "Our Story"}
          </span>
          <h2
            id="about-title"
            className="mt-4 text-4xl md:text-6xl"
            style={{
              fontFamily: displayFont,
              color: "oklch(0.18 0.04 270)",
              textShadow: "3px 3px 0 oklch(0.82 0.17 85)",
            }}
          >
            {isRTL ? "عن MathQuest Kids" : "About MathQuest Kids"}
          </h2>
          <p
            className="mx-auto mt-4 max-w-2xl text-lg md:text-xl"
            style={{ fontFamily: bodyFont, color: "oklch(0.30 0.04 270)", lineHeight: 1.7, fontWeight: 700 }}
          >
            {isRTL
              ? "رحلة رياضية مرحة تساعد الأطفال على اكتشاف قوة الأرقام خطوة بخطوة."
              : "A playful math journey that helps children discover the power of numbers, one brave step at a time."}
          </p>
        </motion.div>

        {/* Story and dedication composition */}
        <div className="grid gap-6 md:grid-cols-[1.05fr_0.95fr] md:items-stretch">
          <motion.article
            initial={{ opacity: 0, x: isRTL ? 36 : -36 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease }}
            className="relative overflow-hidden rounded-[2rem] px-7 py-8 md:px-10 md:py-10"
            style={{
              background: "oklch(0.99 0.015 85 / 0.92)",
              border: "3px solid oklch(0.18 0.04 270)",
              boxShadow: `${isRTL ? "-7px" : "7px"} 7px 0 oklch(0.18 0.04 270)`,
            }}
          >
            <motion.div
              className="absolute -right-7 -top-7 text-7xl opacity-20"
              animate={{ rotate: [0, 8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden="true"
            >
              🦉
            </motion.div>
            <h3 style={{ fontFamily: displayFont, color: "oklch(0.18 0.04 270)", fontSize: "1.7rem", marginBottom: "1rem" }}>
              {isRTL ? "حكاية اللعبة" : "The story behind the game"}
            </h3>
            <p style={{ fontFamily: bodyFont, color: "oklch(0.30 0.04 270)", fontSize: "1.05rem", lineHeight: 1.8 }}>
              {isRTL
                ? "صُممت MathQuest Kids لتجعل وقت الرياضيات أكثر دفئاً ومتعة. بدلاً من الخوف من المسائل، يخوض الطفل مغامرة صغيرة، يجيب، يتعلم من المحاولة، ويجمع النجوم مع كل إنجاز."
                : "MathQuest Kids was created to make math time warmer and more joyful. Instead of feeling worried about problems, children enter a small adventure, try an answer, learn from every attempt, and collect stars along the way."}
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {STORY_POINTS.map((point, index) => (
                <motion.div
                  key={point.en}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + index * 0.08, duration: 0.35 }}
                  whileHover={{ y: -4, rotate: index % 2 === 0 ? -1 : 1 }}
                  className="rounded-2xl px-3 py-4 text-center"
                  style={{ background: "oklch(0.82 0.17 85 / 0.18)", border: "2px solid oklch(0.82 0.17 85 / 0.45)" }}
                >
                  <div className="text-2xl" aria-hidden="true">{point.emoji}</div>
                  <div className="mt-1 text-sm" style={{ fontFamily: bodyFont, color: "oklch(0.22 0.04 270)", fontWeight: 800 }}>
                    {isRTL ? point.ar : point.en}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.article>

          <motion.aside
            initial={{ opacity: 0, x: isRTL ? -36 : 36 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease, delay: 0.08 }}
            className="relative flex flex-col items-center justify-center overflow-hidden rounded-[2rem] px-7 py-8 text-center md:px-10 md:py-10"
            style={{
              background: "oklch(0.96 0.055 85)",
              border: "3px solid oklch(0.18 0.04 270)",
              boxShadow: `${isRTL ? "-7px" : "7px"} 7px 0 oklch(0.18 0.04 270)`,
            }}
          >
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{ opacity: [0.18, 0.34, 0.18], scale: [1, 1.04, 1] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              style={{ background: "radial-gradient(circle at 50% 0%, oklch(0.82 0.17 85 / 0.55), transparent 55%)" }}
              aria-hidden="true"
            />
            <div className="relative z-10">
              <MascotOwl mood="happy" size="md" />
              <p className="mt-4" style={{ fontFamily: bodyFont, color: "oklch(0.28 0.04 270)", fontWeight: 800 }}>
                {isRTL ? "هذا التطبيق إهداء إلى:" : "This app is lovingly dedicated to:"}
              </p>
              <motion.button
                type="button"
                onClick={handleDedicationTap}
                animate={heroPulse ? { scale: [1, 1.1, 1], rotate: [0, -2, 2, 0] } : { scale: 1, rotate: 0 }}
                transition={{ duration: 0.55, ease }}
                onAnimationComplete={() => heroPulse && setHeroPulse(false)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="relative mt-3 cursor-pointer rounded-2xl px-5 py-4"
                style={{
                  background: "oklch(0.82 0.17 85 / 0.42)",
                  border: "2.5px solid oklch(0.18 0.04 270)",
                  color: "oklch(0.18 0.04 270)",
                  fontFamily: displayFont,
                  fontSize: "1.35rem",
                  lineHeight: 1.35,
                  boxShadow: "4px 4px 0 oklch(0.18 0.04 270)",
                }}
                aria-label={isRTL ? "إهداء إلى السيد يحيى أحمد وأصدقاؤه" : "Dedicated to السيد يحيى أحمد وأصدقاؤه"}
              >
                <span className="absolute -right-3 -top-3 text-xl" aria-hidden="true">✨</span>
                <span className="absolute -bottom-3 -left-3 text-lg" aria-hidden="true">⭐</span>
                {"السيد يحيى أحمد وأصدقاؤه"}
              </motion.button>
              <p className="mt-5" style={{ fontFamily: bodyFont, color: "oklch(0.32 0.04 270)", lineHeight: 1.7, fontWeight: 700 }}>
                {isRTL
                  ? "لكل بطل صغير يواصل المحاولة، ولكل صديق يشارك فرحة التعلّم."
                  : "For every young hero who keeps trying, and every friend who shares the joy of learning."}
              </p>
              <div className="mt-5 text-2xl" aria-hidden="true">⭐ 🎓 ⭐</div>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}

