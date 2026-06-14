/**
 * LevelSelectScreen — MathQuest Kids
 * Design: Sunny Storybook
 * i18n: Full EN/AR support with RTL layout switching.
 * Numbers: All numeric values wrapped in LtrNum for RTL safety.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame, type LevelInfo, type GradeZone } from "@/contexts/GameContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { PASS_THRESHOLD } from "@/lib/mathEngine";
import FloatingDecorations from "@/components/FloatingDecorations";
import MascotOwl from "@/components/MascotOwl";
import LanguageToggle from "@/components/LanguageToggle";
import LtrNum from "@/components/LtrNum";

const LEVEL_BG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663029442648/HuT9LUnwcUFmp6Xsie23M7/level-bg-Am4tSjW7v3sFBcfAVC3Ehm.webp";
const LOGO_STAR =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663029442648/HuT9LUnwcUFmp6Xsie23M7/logo-star-VXHLUR84pLpFzMGbXzZvfX.webp";

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const cardVariants = {
  hidden:  { y: 40, opacity: 0, scale: 0.92 },
  visible: { y: 0, opacity: 1, scale: 1, transition: { duration: 0.4, ease } },
};

function StarRating({ stars, total }: { stars: number; total: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${stars} of ${total} stars`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className="text-xl transition-transform"
          style={{
            color: i < stars ? "oklch(0.99 0.015 85)" : "oklch(0.99 0.015 85 / 0.4)",
            filter: i < stars ? "drop-shadow(0 0 3px oklch(0.18 0.04 270 / 0.4))" : "none",
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

function LevelCard({
  level,
  expanded,
  onToggle,
}: {
  level: LevelInfo;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const { selectLevel, getSubLevelProgressForGrade, isGradeMastered } = useGame();
  const { t, isRTL } = useLanguage();

  const subLevels = getSubLevelProgressForGrade(level.id);
  const passedCount = subLevels.filter((s) => s.passed).length;
  const mastered = isGradeMastered(level.id);

  const displayFont = isRTL ? "'Tajawal', sans-serif" : "'Fredoka One', sans-serif";
  const bodyFont    = isRTL ? "'Tajawal', sans-serif" : "'Nunito', sans-serif";

  // Translate grade label and subtitle from context
  const gradeLabels: Record<GradeZone, { label: string; subtitle: string }> = {
    KG: { label: t("gradeKG"), subtitle: t("gradeKGSub") },
    G1: { label: t("grade1"), subtitle: t("grade1Sub") },
    G2: { label: t("grade2"), subtitle: t("grade2Sub") },
    G3: { label: t("grade3"), subtitle: t("grade3Sub") },
  };
  const { label, subtitle } = gradeLabels[level.id];

  return (
    <motion.div
      variants={cardVariants}
      className="relative rounded-3xl overflow-hidden"
      style={{
        border: level.unlocked
          ? "3px solid oklch(0.18 0.04 270)"
          : "3px solid oklch(0.45 0.02 270 / 0.5)",
        boxShadow: level.unlocked
          ? isRTL ? "-6px 6px 0px oklch(0.18 0.04 270)" : "6px 6px 0px oklch(0.18 0.04 270)"
          : "none",
        opacity: level.unlocked ? 1 : 1,
        filter: level.unlocked ? "none" : "saturate(0.15) brightness(0.7)",
      }}
      whileHover={level.unlocked ? { y: -3 } : { scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Locked overlay */}
      {!level.unlocked && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-3xl"
          style={{
            background: "oklch(0.08 0.02 270 / 0.55)",
            backdropFilter: "blur(1.5px)",
            pointerEvents: "none",
          }}
        >
          <motion.div
            animate={{ y: [-3, 3, -3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ fontSize: "2.8rem", filter: "drop-shadow(0 2px 8px oklch(0 0 0 / 0.5))" }}
          >
            🔒
          </motion.div>
          <span
            style={{
              fontFamily: isRTL ? "'Tajawal', sans-serif" : "'Fredoka One', cursive",
              fontSize: "0.85rem",
              color: "oklch(0.75 0.04 270)",
              marginTop: "0.4rem",
              fontWeight: 700,
            }}
          >
            {t("locked")}
          </span>
        </div>
      )}
      {/* Card header */}
      <button
        className="w-full text-start"
        style={{ background: level.bgColor }}
        onClick={onToggle}
        disabled={!level.unlocked}
        aria-expanded={expanded}
        aria-label={`${label} — ${level.unlocked ? (expanded ? "collapse" : "expand") : "locked"}`}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <div className="flex items-center gap-3">
            <span className="text-4xl md:text-5xl" aria-hidden="true">{level.emoji}</span>
            <div>
              <h3
                className="text-xl md:text-2xl leading-tight"
                style={{
                  fontFamily: displayFont,
                  color: level.textColor,
                  textShadow: level.unlocked ? "1px 2px 0 oklch(0.18 0.04 270 / 0.2)" : "none",
                }}
              >
                {label}
              </h3>
              <p
                className="text-sm md:text-base mt-0.5"
                style={{
                  fontFamily: bodyFont,
                  fontWeight: 700,
                  color: level.textColor === "white"
                    ? "oklch(0.95 0 0 / 0.85)"
                    : "oklch(0.28 0.04 270)",
                }}
              >
                {subtitle}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            {level.unlocked ? (
              <>
                <StarRating stars={level.stars} total={level.totalStars} />
                <span style={{ fontFamily: displayFont, fontSize: "0.72rem", color: level.textColor, opacity: 0.85 }}>
                  {mastered ? t("levelMastered") : (
                    <><LtrNum>{passedCount}</LtrNum>/<LtrNum>{subLevels.length}</LtrNum> ops</>
                  )}
                </span>
                <motion.span
                  animate={{ rotate: expanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ color: level.textColor, fontSize: "0.9rem" }}
                  aria-hidden="true"
                >
                  ▼
                </motion.span>
              </>
            ) : (
              <span className="text-2xl opacity-0" aria-hidden="true">🔒</span>
            )}
          </div>
        </div>

        {/* Sub-level dot bar */}
        {level.unlocked && subLevels.length > 0 && (
          <div className="flex gap-1 px-5 pb-4 pt-1">
            {subLevels.map((sp) => (
              <div
                key={sp.subLevelId}
                className="flex-1 rounded-full"
                style={{
                  height: "6px",
                  background: sp.passed
                    ? "oklch(0.18 0.04 270)"
                    : "oklch(0.18 0.04 270 / 0.25)",
                }}
                title={`${sp.label}: ${sp.passed ? t("passed") : `${sp.correctCount}/${PASS_THRESHOLD}`}`}
              />
            ))}
          </div>
        )}
      </button>

      {/* Expanded sub-level panel */}
      <AnimatePresence>
        {expanded && level.unlocked && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            style={{
              background: "oklch(0.99 0.015 85)",
              borderTop: "2.5px solid oklch(0.18 0.04 270)",
              overflow: "hidden",
            }}
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {/* Play All */}
              <motion.button
                className="btn-ink w-full py-3 text-base"
                style={{
                  background: level.bgColor,
                  color: level.textColor,
                  fontFamily: displayFont,
                }}
                onClick={() => selectLevel(level.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                aria-label={`Play all ${label} operations`}
              >
                {level.emoji} {t("startLevel")} {label}
              </motion.button>

              <p
                className="text-center"
                style={{ fontFamily: displayFont, fontSize: "0.78rem", color: "oklch(0.52 0.04 270)" }}
              >
                — {t("practiceThis").replace("→", "").replace("←", "").trim()} —
              </p>

              {/* Sub-level chips */}
              <div className="flex flex-col gap-2">
                {subLevels.map((sp) => {
                  const pct = sp.passed
                    ? 100
                    : Math.min(100, Math.round((sp.correctCount / PASS_THRESHOLD) * 100));
                  return (
                    <motion.button
                      key={sp.subLevelId}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl text-start w-full"
                      style={{
                        background: sp.passed ? "oklch(0.92 0.06 145)" : "oklch(0.97 0.015 85)",
                        border: `2.5px solid ${sp.passed ? "oklch(0.65 0.2 145)" : "oklch(0.18 0.04 270)"}`,
                        boxShadow: `${isRTL ? "-3px" : "3px"} 3px 0 ${sp.passed ? "oklch(0.48 0.2 145)" : "oklch(0.18 0.04 270)"}`,
                      }}
                      onClick={() => selectLevel(level.id, sp.subLevelId)}
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span className="text-2xl shrink-0" aria-hidden="true">{sp.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span style={{ fontFamily: displayFont, fontSize: "0.95rem", color: "oklch(0.18 0.04 270)" }}>
                            {sp.label}
                          </span>
                          {sp.passed ? (
                            <span className="text-sm" aria-hidden="true">✅ {t("passed")}</span>
                          ) : (
                            <span style={{ fontFamily: displayFont, fontSize: "0.75rem", color: "oklch(0.52 0.04 270)" }}>
                              <LtrNum>{sp.correctCount}</LtrNum>/<LtrNum>{PASS_THRESHOLD}</LtrNum> ✓
                            </span>
                          )}
                        </div>
                        <div
                          className="rounded-full overflow-hidden"
                          style={{
                            height: "7px",
                            background: "oklch(0.88 0.02 90)",
                            border: "1.5px solid oklch(0.18 0.04 270 / 0.3)",
                          }}
                        >
                          <motion.div
                            style={{
                              height: "100%",
                              background: sp.passed
                                ? "oklch(0.65 0.2 145)"
                                : "linear-gradient(90deg, oklch(0.82 0.17 85), oklch(0.65 0.2 145))",
                              borderRadius: "9999px",
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, ease }}
                          />
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Locked overlay */}
      {!level.unlocked && (
        <div
          className="absolute inset-0 rounded-3xl flex items-end justify-center pb-4"
          style={{ background: "oklch(0.18 0.04 270 / 0.18)", backdropFilter: "blur(1.5px)" }}
          aria-hidden="true"
        >
          <div
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-2xl"
            style={{ background: "oklch(0.99 0.015 85 / 0.92)", border: "2px solid oklch(0.18 0.04 270)" }}
          >
            <span className="text-xs" style={{ fontFamily: displayFont, color: "oklch(0.18 0.04 270)" }}>
              {t("locked")} — {isRTL ? "احصل على ⭐ في المستوى السابق!" : "Earn ⭐ in the previous level!"}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function LevelSelectScreen() {
  const { goHome, levels, totalStarsEarned, isEndlessModeUnlocked, startEndlessMode } = useGame();
  const { t, isRTL } = useLanguage();
  const totalPossible = levels.reduce((s, l) => s + l.totalStars, 0);
  const [expandedGrade, setExpandedGrade] = useState<GradeZone | null>(null);

  const displayFont = isRTL ? "'Tajawal', sans-serif" : "'Fredoka One', sans-serif";
  const bodyFont    = isRTL ? "'Tajawal', sans-serif" : "'Nunito', sans-serif";

  const handleToggle = (id: GradeZone, unlocked: boolean) => {
    if (!unlocked) return;
    setExpandedGrade((prev) => (prev === id ? null : id));
  };

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
      <div className="absolute inset-0" style={{ background: "oklch(0.985 0.025 90 / 0.45)" }} />
      <FloatingDecorations density="low" />

      {/* Header */}
      <motion.header
        className="relative z-10 flex items-center justify-between px-5 pt-5 pb-2"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease }}
      >
        <button
          className="btn-ink btn-ink-white text-base px-4 py-2.5"
          onClick={goHome}
          style={{ fontFamily: displayFont }}
          aria-label={t("backHome")}
        >
          {isRTL ? "الرئيسية →" : "← Back"}
        </button>

        <div className="flex items-center gap-2">
          <img src={LOGO_STAR} alt="" className="w-9 h-9" aria-hidden="true" />
          <span
            className="text-xl md:text-2xl"
            style={{ fontFamily: displayFont, color: "oklch(0.18 0.04 270)", textShadow: "2px 2px 0 oklch(0.82 0.17 85)" }}
          >
            {t("chooseLevelTitle")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <LanguageToggle variant="light" />
          <MascotOwl mood="idle" size="sm" />
        </div>
      </motion.header>

      {/* Page title */}
      <motion.div
        className="relative z-10 text-center px-4 pt-2 pb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35, ease }}
      >
        <h2
          className="text-3xl md:text-4xl"
          style={{ fontFamily: displayFont, color: "oklch(0.18 0.04 270)", textShadow: "2px 3px 0 oklch(0.82 0.17 85)" }}
        >
          {t("chooseLevelTitle")}
        </h2>
        <p
          className="text-base md:text-lg mt-1"
          style={{ fontFamily: bodyFont, fontWeight: 700, color: "oklch(0.28 0.04 270)" }}
        >
          {t("chooseLevelSubtitle")}
        </p>
      </motion.div>

      {/* Level Cards */}
      <main className="relative z-10 flex-1 px-4 pb-8">
        <motion.div
          className="flex flex-col gap-4 max-w-lg mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {levels.map((level, i) => (
            <LevelCard
              key={level.id}
              level={level}
              index={i}
              expanded={expandedGrade === level.id}
              onToggle={() => handleToggle(level.id, level.unlocked)}
            />
          ))}
        </motion.div>

        {/* Progress summary */}
        <motion.div
          className="max-w-lg mx-auto mt-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.35 }}
        >
          <div
            className="flex items-center justify-between px-5 py-3 rounded-2xl"
            style={{
              background: "oklch(0.99 0.015 85 / 0.88)",
              border: "2.5px solid oklch(0.18 0.04 270)",
              boxShadow: `${isRTL ? "-3px" : "3px"} 3px 0 oklch(0.18 0.04 270)`,
            }}
          >
            <span style={{ fontFamily: displayFont, fontSize: "1rem", color: "oklch(0.18 0.04 270)" }}>
              {isRTL ? "إجمالي التقدّم" : "Total Progress"}
            </span>
            <div className="flex items-center gap-3 flex-1 mx-4">
              <div className="progress-track flex-1">
                <div
                  className="progress-fill"
                  style={{ width: `${Math.round((totalStarsEarned / totalPossible) * 100)}%` }}
                />
              </div>
              <span style={{ fontFamily: displayFont, fontSize: "0.95rem", color: "oklch(0.18 0.04 270)", minWidth: "4rem", textAlign: isRTL ? "left" : "right" }}>
                <LtrNum>{totalStarsEarned}</LtrNum> / <LtrNum>{totalPossible}</LtrNum> ⭐
              </span>
            </div>
          </div>
        </motion.div>
        {/* Endless Challenge unlock button */}
        <motion.div
          className="max-w-lg mx-auto mt-4 mb-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.35 }}
        >
          <motion.button
            onClick={() => isEndlessModeUnlocked && startEndlessMode()}
            whileHover={isEndlessModeUnlocked ? { scale: 1.04, y: -2 } : {}}
            whileTap={isEndlessModeUnlocked ? { scale: 0.97 } : {}}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-3"
            style={{
              fontFamily: displayFont,
              fontSize: "1.15rem",
              fontWeight: 700,
              background: isEndlessModeUnlocked ? "oklch(0.62 0.22 25)" : "oklch(0.55 0.04 270)",
              color: "white",
              border: "3px solid oklch(0.18 0.04 270)",
              boxShadow: isEndlessModeUnlocked ? `${isRTL ? "-5px" : "5px"} 5px 0 oklch(0.18 0.04 270)` : "none",
              cursor: isEndlessModeUnlocked ? "pointer" : "not-allowed",
              opacity: isEndlessModeUnlocked ? 1 : 0.55,
            }}
          >
            <span style={{ fontSize: "1.4rem" }}>{isEndlessModeUnlocked ? "🔥" : "🔒"}</span>
            <span>{isRTL ? "تحدي بلا نهاية" : "Endless Challenge"}</span>
            {isEndlessModeUnlocked && (
              <span
                className="px-2 py-0.5 rounded-full text-xs"
                style={{ background: "oklch(0.82 0.17 85)", color: "oklch(0.18 0.04 270)", fontWeight: 800 }}
              >
                {isRTL ? "مفتوح!" : "Unlocked!"}
              </span>
            )}
            {!isEndlessModeUnlocked && (
              <span className="text-sm opacity-75" style={{ fontFamily: bodyFont }}>
                {isRTL ? "(أكمل جميع المستويات)" : "(Complete all levels)"}
              </span>
            )}
          </motion.button>
        </motion.div>
      </main>
    </div>
  );
}
