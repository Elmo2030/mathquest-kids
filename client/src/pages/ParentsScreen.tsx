/**
 * ParentsScreen — MathQuest Kids
 * Design: Sunny Storybook — clean, parent-friendly analytics view
 * i18n: Full EN/AR support with RTL layout switching.
 * Numbers: All numeric values wrapped in LtrNum for RTL safety.
 */

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame, type GradeZone } from "@/contexts/GameContext";
import { useLanguage } from "@/contexts/LanguageContext";
import LtrNum from "@/components/LtrNum";
import LanguageToggle from "@/components/LanguageToggle";
import BrandingFooter from "@/components/BrandingFooter";
import { toast } from "sonner";

const LOGO_STAR =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663029442648/HuT9LUnwcUFmp6Xsie23M7/logo-star-VXHLUR84pLpFzMGbXzZvfX.webp";

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const itemVariants = {
  hidden:  { y: 18, opacity: 0 },
  visible: { y: 0,  opacity: 1, transition: { duration: 0.35, ease } },
};

const GRADE_COLORS: Record<GradeZone, string> = {
  KG: "oklch(0.82 0.17 85)",
  G1: "oklch(0.58 0.19 250)",
  G2: "oklch(0.65 0.2 145)",
  G3: "oklch(0.62 0.22 25)",
};

// ── Helpers ───────────────────────────────────────────────────

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m < 60) return s > 0 ? `${m}m ${s}s` : `${m}m`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem > 0 ? `${h}h ${rem}m` : `${h}h`;
}

function getAccuracyColor(pct: number): string {
  if (pct >= 80) return "oklch(0.65 0.2 145)";
  if (pct >= 55) return "oklch(0.82 0.17 85)";
  return "oklch(0.62 0.22 25)";
}

// ── Sub-components ────────────────────────────────────────────

function StatCard({
  emoji, value, label, color, delay = 0, isRTL,
}: {
  emoji: string; value: React.ReactNode; label: string;
  color: string; delay?: number; isRTL: boolean;
}) {
  const displayFont = isRTL ? "'Tajawal', sans-serif" : "'Fredoka One', sans-serif";
  const bodyFont    = isRTL ? "'Tajawal', sans-serif" : "'Nunito', sans-serif";
  return (
    <motion.div
      className="flex items-center gap-3 p-4 rounded-2xl"
      style={{
        background: color,
        border: "2.5px solid oklch(0.18 0.04 270)",
        boxShadow: `${isRTL ? "-4px" : "4px"} 4px 0 oklch(0.18 0.04 270)`,
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease }}
    >
      <span className="text-3xl shrink-0" aria-hidden="true">{emoji}</span>
      <div>
        <div style={{ fontFamily: displayFont, fontSize: "1.35rem", color: "oklch(0.18 0.04 270)", lineHeight: 1 }}>
          {value}
        </div>
        <div style={{ fontFamily: bodyFont, fontWeight: 700, fontSize: "0.76rem", color: "oklch(0.28 0.04 270)" }}>
          {label}
        </div>
      </div>
    </motion.div>
  );
}

function AccuracyRow({
  emoji, label, pct, correct, total, passed, isWorst, delay, isRTL, notStartedLabel, focusBadge,
}: {
  emoji: string; label: string; pct: number; correct: number; total: number;
  passed: boolean; isWorst: boolean; delay: number; isRTL: boolean;
  notStartedLabel: string; focusBadge: string;
}) {
  const barColor = getAccuracyColor(pct);
  const displayFont = isRTL ? "'Tajawal', sans-serif" : "'Fredoka One', sans-serif";
  const bodyFont    = isRTL ? "'Tajawal', sans-serif" : "'Nunito', sans-serif";
  return (
    <motion.div
      className="flex items-center gap-3 py-3"
      style={{ borderBottom: "1px solid oklch(0.18 0.04 270 / 0.08)" }}
      initial={{ opacity: 0, x: isRTL ? 12 : -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.35, ease }}
    >
      <span className="text-xl shrink-0 w-7 text-center" aria-hidden="true">{emoji}</span>
      <div className="w-28 shrink-0">
        <span style={{ fontFamily: displayFont, fontSize: "0.88rem", color: "oklch(0.18 0.04 270)" }}>
          {label}
        </span>
        {isWorst && total > 0 && (
          <span
            className="ms-1.5 text-xs px-1.5 py-0.5 rounded-md"
            style={{ background: "oklch(0.95 0.04 25)", color: "oklch(0.45 0.18 25)", fontFamily: displayFont, border: "1.5px solid oklch(0.62 0.22 25)" }}
          >
            {focusBadge}
          </span>
        )}
      </div>

      {/* Bar */}
      <div className="flex-1 rounded-full overflow-hidden" style={{ height: "12px", background: "oklch(0.88 0.02 90)", border: "1.5px solid oklch(0.18 0.04 270 / 0.15)" }}>
        {total > 0 ? (
          <motion.div
            style={{ height: "100%", background: barColor, borderRadius: "9999px" }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ delay: delay + 0.1, duration: 0.65, ease }}
          />
        ) : (
          <div style={{ height: "100%", width: "100%", background: "oklch(0.88 0.02 90)", borderRadius: "9999px" }} />
        )}
      </div>

      {/* Stats — always LTR */}
      <div className="shrink-0 text-right" style={{ minWidth: "5rem" }}>
        {total > 0 ? (
          <>
            <span style={{ fontFamily: displayFont, fontSize: "0.95rem", color: barColor }}>
              <LtrNum>{pct}%</LtrNum>
            </span>
            <span style={{ fontFamily: bodyFont, fontWeight: 700, fontSize: "0.7rem", color: "oklch(0.52 0.04 270)", display: "block" }}>
              <LtrNum>{correct}/{total}</LtrNum>
            </span>
          </>
        ) : (
          <span style={{ fontFamily: bodyFont, fontWeight: 700, fontSize: "0.75rem", color: "oklch(0.65 0.04 270)" }}>
            {notStartedLabel}
          </span>
        )}
      </div>

      <div className="shrink-0 w-6 text-center">
        {passed && <span aria-label="Passed">✅</span>}
      </div>
    </motion.div>
  );
}

// ── Reset Confirmation Dialog ─────────────────────────────────

function ResetDialog({
  onConfirm, onCancel, isRTL,
}: {
  onConfirm: () => void; onCancel: () => void; isRTL: boolean;
}) {
  const { t } = useLanguage();
  const displayFont = isRTL ? "'Tajawal', sans-serif" : "'Fredoka One', sans-serif";
  const bodyFont    = isRTL ? "'Tajawal', sans-serif" : "'Nunito', sans-serif";
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "oklch(0.18 0.04 270 / 0.65)", backdropFilter: "blur(6px)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
      aria-modal="true" role="alertdialog" aria-labelledby="reset-title"
    >
      <motion.div
        className="w-full max-w-sm rounded-3xl overflow-hidden"
        style={{
          background: "oklch(0.99 0.025 85)",
          border: "3px solid oklch(0.18 0.04 270)",
          boxShadow: `${isRTL ? "-6px" : "6px"} 6px 0 oklch(0.18 0.04 270)`,
        }}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease }}
      >
        <div className="px-6 pt-5 pb-4 text-center" style={{ background: "oklch(0.62 0.22 25)", borderBottom: "3px solid oklch(0.18 0.04 270)" }}>
          <div className="text-4xl mb-1" aria-hidden="true">⚠️</div>
          <h2 id="reset-title" style={{ fontFamily: displayFont, fontSize: "1.3rem", color: "white", textShadow: "2px 2px 0 oklch(0.18 0.04 270 / 0.3)" }}>
            {t("resetConfirmTitle")}
          </h2>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          <p style={{ fontFamily: bodyFont, fontWeight: 700, fontSize: "0.95rem", color: "oklch(0.28 0.04 270)", textAlign: "center", lineHeight: 1.5 }}>
            {t("resetConfirmBody")}
          </p>
          <div className="flex gap-3">
            <button onClick={onCancel} className="flex-1 py-3 rounded-xl"
              style={{ fontFamily: displayFont, fontSize: "1rem", background: "oklch(0.96 0.025 90)", color: "oklch(0.18 0.04 270)", border: "2.5px solid oklch(0.18 0.04 270)", boxShadow: `${isRTL ? "-3px" : "3px"} 3px 0 oklch(0.18 0.04 270)` }}>
              {t("resetConfirmCancel")}
            </button>
            <button onClick={onConfirm} className="flex-1 py-3 rounded-xl"
              style={{ fontFamily: displayFont, fontSize: "1rem", background: "oklch(0.62 0.22 25)", color: "white", border: "2.5px solid oklch(0.18 0.04 270)", boxShadow: `${isRTL ? "-3px" : "3px"} 3px 0 oklch(0.18 0.04 270)` }}>
              {t("resetConfirmYes")}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────

export default function ParentsScreen() {
  const { goHome, levels, subLevelProgress, answerHistory, analytics, totalStarsEarned, resetProgress } = useGame();
  const { t, isRTL } = useLanguage();
  const [showResetDialog, setShowResetDialog] = useState(false);

  const displayFont = isRTL ? "'Tajawal', sans-serif" : "'Fredoka One', sans-serif";
  const bodyFont    = isRTL ? "'Tajawal', sans-serif" : "'Nunito', sans-serif";

  // Grade labels (translated)
  const GRADE_LABELS: Record<GradeZone, string> = {
    KG: `🌟 ${t("gradeKG")}`,
    G1: `🚀 ${t("grade1")}`,
    G2: `🎯 ${t("grade2")}`,
    G3: `🏆 ${t("grade3")}`,
  };

  // ── Derived stats ──────────────────────────────────────────
  const totalPossibleStars = levels.reduce((s, l) => s + l.totalStars, 0);
  const overallAccuracy = analytics.totalQuestionsAnswered > 0
    ? Math.round((analytics.totalCorrectAnswers / analytics.totalQuestionsAnswered) * 100)
    : 0;
  const passedOps = subLevelProgress.filter((s) => s.passed).length;
  const totalOps = subLevelProgress.length;

  const byGrade = useMemo(() => {
    const grades: GradeZone[] = ["KG", "G1", "G2", "G3"];
    return grades.map((grade) => ({
      grade,
      subs: subLevelProgress.filter((s) => s.grade === grade),
    }));
  }, [subLevelProgress]);

  const areasToImprove = useMemo(() => {
    const withData = subLevelProgress.filter((s) => s.totalAttempts >= 5);
    if (withData.length === 0) return [];
    const sorted = [...withData].sort((a, b) => (a.totalCorrect / a.totalAttempts) - (b.totalCorrect / b.totalAttempts));
    return sorted.filter((s) => s.totalCorrect / s.totalAttempts < 0.7).slice(0, 2);
  }, [subLevelProgress]);

  const worstIds = useMemo(() => new Set(areasToImprove.map((s) => s.subLevelId)), [areasToImprove]);

  const recentHistory = useMemo(() => [...answerHistory].reverse().slice(0, 20), [answerHistory]);

  const handleReset = () => {
    setShowResetDialog(false);
    resetProgress();
    toast.success(t("resetSuccessToast"));
  };

  return (
    <>
      <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.985 0.025 90)" }}>

        {/* ── Header ──────────────────────────────────────── */}
        <motion.header
          className="flex items-center justify-between px-5 pt-5 pb-4 sticky top-0 z-20 gap-3"
          style={{ background: "oklch(0.58 0.19 250)", borderBottom: "3px solid oklch(0.18 0.04 270)", boxShadow: "0 4px 0 oklch(0.18 0.04 270)" }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35, ease }}
        >
          <button className="btn-ink btn-ink-white text-sm px-4 py-2" onClick={goHome}
            style={{ fontFamily: displayFont }} aria-label={t("backHome")}>
            {t("backHome")}
          </button>

          <div className="flex items-center gap-2">
            <img src={LOGO_STAR} alt="" className="w-9 h-9" aria-hidden="true" />
            <h1 className="text-xl md:text-2xl hidden sm:block"
              style={{ fontFamily: displayFont, color: "white", textShadow: "2px 2px 0 oklch(0.18 0.04 270 / 0.4)" }}>
              {t("parentsDashboardTitle")}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <LanguageToggle variant="light" />

            {/* Stars badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
              style={{ background: "oklch(0.82 0.17 85)", border: "2px solid oklch(0.18 0.04 270)" }}>
              <span className="text-lg" aria-hidden="true">⭐</span>
              <span style={{ fontFamily: displayFont, fontSize: "1rem", color: "oklch(0.18 0.04 270)" }}>
                <LtrNum>{totalStarsEarned}</LtrNum>
              </span>
            </div>
          </div>
        </motion.header>

        {/* ── Content ─────────────────────────────────────── */}
        <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
          <motion.div className="flex flex-col gap-7" variants={containerVariants} initial="hidden" animate="visible">

            {/* Welcome */}
            <motion.p variants={itemVariants}
              style={{ fontFamily: bodyFont, fontWeight: 700, fontSize: "1.05rem", color: "oklch(0.35 0.04 270)" }}>
              {t("parentsWelcome")}
            </motion.p>

            {/* ── 1. Overview Stats ──────────────────────── */}
            <motion.section variants={itemVariants} aria-labelledby="stats-heading">
              <h2 id="stats-heading" className="mb-3 text-xl"
                style={{ fontFamily: displayFont, color: "oklch(0.18 0.04 270)" }}>
                {t("overviewTitle")}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <StatCard emoji="⏱️" value={<LtrNum>{formatTime(analytics.totalPlaySeconds)}</LtrNum>} label={t("totalPlayTime")} color="oklch(0.82 0.17 85)" delay={0.05} isRTL={isRTL} />
                <StatCard emoji="❓" value={<LtrNum>{analytics.totalQuestionsAnswered}</LtrNum>} label={t("questionsAnswered")} color="oklch(0.58 0.19 250)" delay={0.1} isRTL={isRTL} />
                <StatCard emoji="🎯" value={analytics.totalQuestionsAnswered > 0 ? <LtrNum>{overallAccuracy}%</LtrNum> : "—"} label={t("overallAccuracy")} color="oklch(0.65 0.2 145)" delay={0.15} isRTL={isRTL} />
                <StatCard emoji="✅" value={<LtrNum>{passedOps}/{totalOps}</LtrNum>} label={t("operationsPassed")} color="oklch(0.82 0.17 85)" delay={0.2} isRTL={isRTL} />
              </div>
            </motion.section>

            {/* ── 2. Areas to Improve ────────────────────── */}
            {areasToImprove.length > 0 && (
              <motion.section variants={itemVariants} aria-labelledby="improve-heading">
                <h2 id="improve-heading" className="mb-3 text-xl"
                  style={{ fontFamily: displayFont, color: "oklch(0.18 0.04 270)" }}>
                  {t("areasToImproveTitle")}
                </h2>
                <div className="rounded-2xl overflow-hidden"
                  style={{ border: "2.5px solid oklch(0.62 0.22 25)", boxShadow: `${isRTL ? "-4px" : "4px"} 4px 0 oklch(0.62 0.22 25)`, background: "oklch(0.99 0.015 85)" }}>
                  <div className="px-4 py-2.5" style={{ background: "oklch(0.62 0.22 25)", borderBottom: "2px solid oklch(0.18 0.04 270)" }}>
                    <p style={{ fontFamily: displayFont, fontSize: "0.9rem", color: "white" }}>
                      {t("areasToImproveIntro")}
                    </p>
                  </div>
                  <div className="px-4 py-3 flex flex-col gap-3">
                    {areasToImprove.map((sp) => {
                      const acc = Math.round((sp.totalCorrect / sp.totalAttempts) * 100);
                      return (
                        <div key={sp.subLevelId} className="flex items-start gap-3">
                          <span className="text-2xl shrink-0 mt-0.5" aria-hidden="true">{sp.emoji}</span>
                          <div>
                            <p style={{ fontFamily: displayFont, fontSize: "1rem", color: "oklch(0.18 0.04 270)" }}>
                              {sp.label}
                              <span className="ms-2 text-sm" style={{ color: "oklch(0.62 0.22 25)" }}>
                                (<LtrNum>{acc}%</LtrNum>)
                              </span>
                            </p>
                            <p style={{ fontFamily: bodyFont, fontWeight: 700, fontSize: "0.82rem", color: "oklch(0.45 0.04 270)", marginTop: "0.1rem" }}>
                              {t("areasToImproveTip")}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.section>
            )}

            {/* ── 3. Per-Operation Accuracy ──────────────── */}
            <motion.section variants={itemVariants} aria-labelledby="ops-heading">
              <h2 id="ops-heading" className="mb-3 text-xl"
                style={{ fontFamily: displayFont, color: "oklch(0.18 0.04 270)" }}>
                {t("accuracyByOperation")}
              </h2>
              <div className="flex flex-col gap-4">
                {byGrade.map(({ grade, subs }, gi) => {
                  const levelInfo = levels.find((l) => l.id === grade);
                  if (!levelInfo?.unlocked && subs.every((s) => s.totalAttempts === 0)) return null;
                  return (
                    <div key={grade} className="rounded-2xl overflow-hidden"
                      style={{ border: "2.5px solid oklch(0.18 0.04 270)", boxShadow: `${isRTL ? "-4px" : "4px"} 4px 0 oklch(0.18 0.04 270)` }}>
                      <div className="px-4 py-2.5" style={{ background: GRADE_COLORS[grade] }}>
                        <span style={{ fontFamily: displayFont, fontSize: "1rem", color: grade === "KG" ? "oklch(0.18 0.04 270)" : "white" }}>
                          {GRADE_LABELS[grade]}{levelInfo && !levelInfo.unlocked && " 🔒"}
                        </span>
                      </div>
                      <div className="px-4 pt-1 pb-2" style={{ background: "oklch(0.99 0.015 85)" }}>
                        {subs.map((sp, si) => {
                          const acc = sp.totalAttempts > 0 ? Math.round((sp.totalCorrect / sp.totalAttempts) * 100) : 0;
                          return (
                            <AccuracyRow
                              key={sp.subLevelId}
                              emoji={sp.emoji} label={sp.label}
                              pct={acc} correct={sp.totalCorrect} total={sp.totalAttempts}
                              passed={sp.passed} isWorst={worstIds.has(sp.subLevelId)}
                              delay={0.05 + gi * 0.06 + si * 0.04}
                              isRTL={isRTL}
                              notStartedLabel={t("notStarted")}
                              focusBadge={t("focusBadge")}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-3 mt-3 px-1">
                {[
                  { color: "oklch(0.65 0.2 145)", label: t("accuracyLegendExcellent") },
                  { color: "oklch(0.82 0.17 85)", label: t("accuracyLegendGood") },
                  { color: "oklch(0.62 0.22 25)", label: t("accuracyLegendNeeds") },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ background: item.color, border: "1.5px solid oklch(0.18 0.04 270 / 0.3)" }} aria-hidden="true" />
                    <span style={{ fontFamily: bodyFont, fontWeight: 700, fontSize: "0.72rem", color: "oklch(0.45 0.04 270)" }}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* ── 4. Level Stars ─────────────────────────── */}
            <motion.section variants={itemVariants} aria-labelledby="stars-heading">
              <h2 id="stars-heading" className="mb-3 text-xl"
                style={{ fontFamily: displayFont, color: "oklch(0.18 0.04 270)" }}>
                {t("levelStarsTitle")} (<LtrNum>{totalStarsEarned}/{totalPossibleStars}</LtrNum>)
              </h2>
              <div className="card-ink p-4 flex flex-col gap-3">
                {levels.map((lvl) => {
                  const pct = Math.round((lvl.stars / lvl.totalStars) * 100);
                  return (
                    <div key={lvl.id} className="flex items-center gap-3">
                      <span className="text-sm w-28 shrink-0"
                        style={{ fontFamily: displayFont, color: lvl.unlocked ? "oklch(0.18 0.04 270)" : "oklch(0.65 0.04 270)" }}>
                        {!lvl.unlocked ? "🔒 " : ""}{lvl.label}
                      </span>
                      <div className="progress-track flex-1">
                        <div className="progress-fill" style={{ width: `${pct}%`, background: lvl.unlocked ? `linear-gradient(90deg, ${lvl.bgColor}, oklch(0.65 0.2 145))` : "oklch(0.75 0.04 270)" }} />
                      </div>
                      <div className="flex gap-0.5 shrink-0">
                        {[0, 1, 2].map((i) => (
                          <span key={i} className={`text-base ${i < lvl.stars ? "star-filled" : "star-empty"}`} aria-hidden="true">★</span>
                        ))}
                      </div>
                      <span style={{ fontFamily: bodyFont, fontWeight: 700, fontSize: "0.72rem", color: "oklch(0.52 0.04 270)", width: "3.5rem", textAlign: isRTL ? "left" : "right" } as React.CSSProperties}>
                        <LtrNum>{lvl.gamesPlayed}</LtrNum> {lvl.gamesPlayed !== 1 ? t("games") : t("game")}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.section>

            {/* ── 5. Recent Activity ─────────────────────── */}
            <motion.section variants={itemVariants} aria-labelledby="history-heading">
              <h2 id="history-heading" className="mb-3 text-xl"
                style={{ fontFamily: displayFont, color: "oklch(0.18 0.04 270)" }}>
                {t("recentActivityTitle")}
              </h2>
              {recentHistory.length === 0 ? (
                <div className="text-center py-8 rounded-2xl"
                  style={{ background: "oklch(0.99 0.015 85)", border: "2.5px dashed oklch(0.18 0.04 270 / 0.3)" }}>
                  <p style={{ fontFamily: displayFont, fontSize: "1rem", color: "oklch(0.52 0.04 270)" }}>
                    {t("noActivityYet")}
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl overflow-hidden"
                  style={{ border: "2.5px solid oklch(0.18 0.04 270)", boxShadow: `${isRTL ? "-4px" : "4px"} 4px 0 oklch(0.18 0.04 270)` }}>
                  {/* Table header */}
                  <div className="grid px-4 py-2"
                    style={{ gridTemplateColumns: "1.5rem 1fr 5rem 3rem", gap: "0.5rem", background: "oklch(0.58 0.19 250)", borderBottom: "2px solid oklch(0.18 0.04 270)" }}>
                    {["", t("tableQuestion"), t("tableOperation"), t("tableResult")].map((h) => (
                      <span key={h} style={{ fontFamily: displayFont, fontSize: "0.78rem", color: "white" }}>{h}</span>
                    ))}
                  </div>
                  {/* Table rows */}
                  <div style={{ background: "oklch(0.99 0.015 85)" }}>
                    {recentHistory.map((entry, i) => (
                      <div key={i} className="grid px-4 py-2 items-center"
                        style={{ gridTemplateColumns: "1.5rem 1fr 5rem 3rem", gap: "0.5rem", borderBottom: i < recentHistory.length - 1 ? "1px solid oklch(0.18 0.04 270 / 0.08)" : "none", background: i % 2 === 0 ? "transparent" : "oklch(0.97 0.015 85)" }}>
                        <span className="text-sm" aria-hidden="true">
                          {GRADE_LABELS[entry.grade]?.split(" ")[0] ?? ""}
                        </span>
                        {/* Question text always LTR (math expression) */}
                        <span dir="ltr" className="math-equation"
                          style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "0.82rem", color: "oklch(0.28 0.04 270)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {entry.questionText}
                        </span>
                        <span style={{ fontFamily: bodyFont, fontWeight: 700, fontSize: "0.72rem", color: "oklch(0.52 0.04 270)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {entry.subLevelLabel}
                        </span>
                        <span className="text-center rounded-lg px-1 py-0.5 text-xs"
                          style={{ background: entry.correct ? "oklch(0.92 0.06 145)" : "oklch(0.95 0.04 25)", color: entry.correct ? "oklch(0.35 0.15 145)" : "oklch(0.45 0.18 25)", fontFamily: displayFont, border: `1.5px solid ${entry.correct ? "oklch(0.65 0.2 145)" : "oklch(0.62 0.22 25)"}` }}>
                          {entry.correct ? "✓" : "✗"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.section>

            {/* ── 6. Settings Placeholders ───────────────── */}
            <motion.section variants={itemVariants} aria-labelledby="settings-heading">
              <h2 id="settings-heading" className="mb-3 text-xl"
                style={{ fontFamily: displayFont, color: "oklch(0.18 0.04 270)" }}>
                {t("settingsTitle")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: "🔔", label: t("dailyReminders"),  desc: t("dailyRemindersDesc") },
                  { icon: "⏱️", label: t("sessionDuration"), desc: t("sessionDurationDesc") },
                  { icon: "🎵", label: t("soundEffects"),    desc: t("soundEffectsDesc") },
                  { icon: "🌐", label: t("language"),        desc: t("languageDesc") },
                ].map((setting) => (
                  <button key={setting.label} className="flex items-center gap-3 p-4 rounded-2xl text-start w-full"
                    style={{ background: "oklch(0.99 0.015 85)", border: "2.5px solid oklch(0.18 0.04 270)", boxShadow: `${isRTL ? "-3px" : "3px"} 3px 0 oklch(0.18 0.04 270)`, transition: "transform 0.12s ease, box-shadow 0.12s ease" }}
                    onClick={() => toast.info(t("featureComingSoon"))}
                    aria-label={setting.label}>
                    <span className="text-2xl" aria-hidden="true">{setting.icon}</span>
                    <div>
                      <div style={{ fontFamily: displayFont, fontSize: "0.95rem", color: "oklch(0.18 0.04 270)" }}>{setting.label}</div>
                      <div style={{ fontFamily: bodyFont, fontWeight: 700, fontSize: "0.78rem", color: "oklch(0.52 0.04 270)" }}>{setting.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.section>

            {/* ── 7. Reset Progress ──────────────────────── */}
            <motion.section variants={itemVariants} aria-labelledby="reset-heading">
              <h2 id="reset-heading" className="mb-3 text-xl"
                style={{ fontFamily: displayFont, color: "oklch(0.18 0.04 270)" }}>
                {t("dataManagement")}
              </h2>
              <div className="p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                style={{ background: "oklch(0.99 0.015 85)", border: "2.5px solid oklch(0.18 0.04 270)", boxShadow: `${isRTL ? "-4px" : "4px"} 4px 0 oklch(0.18 0.04 270)` }}>
                <div>
                  <p style={{ fontFamily: displayFont, fontSize: "1rem", color: "oklch(0.18 0.04 270)" }}>
                    {t("resetProgressTitle")}
                  </p>
                  <p style={{ fontFamily: bodyFont, fontWeight: 700, fontSize: "0.8rem", color: "oklch(0.52 0.04 270)", marginTop: "0.15rem" }}>
                    {t("resetProgressDesc")}
                  </p>
                </div>
                <button onClick={() => setShowResetDialog(true)} className="shrink-0 px-5 py-2.5 rounded-xl"
                  style={{ fontFamily: displayFont, fontSize: "0.95rem", background: "oklch(0.62 0.22 25)", color: "white", border: "2.5px solid oklch(0.18 0.04 270)", boxShadow: `${isRTL ? "-3px" : "3px"} 3px 0 oklch(0.18 0.04 270)` }}>
                  {t("resetProgressBtn")}
                </button>
              </div>
            </motion.section>

          </motion.div>
        </main>
      </div>

      {/* Branding Footer */}
      <BrandingFooter />

      {/* Reset dialog */}
      <AnimatePresence>
        {showResetDialog && (
          <ResetDialog onConfirm={handleReset} onCancel={() => setShowResetDialog(false)} isRTL={isRTL} />
        )}
      </AnimatePresence>
    </>
  );
}
