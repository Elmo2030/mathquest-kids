/**
 * ParentsScreen — MathQuest Kids
 * Design: Sunny Storybook
 * ─────────────────────────────────────────────────────────────
 * Wired to real GameContext data:
 *   - Overall stats (stars, games, accuracy, ops passed)
 *   - Per-grade sub-level progress with accuracy bars
 *   - Recent answer history log (last 20 entries)
 *   - Settings placeholders
 * ─────────────────────────────────────────────────────────────
 */

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useGame, type GradeZone } from "@/contexts/GameContext";
import { toast } from "sonner";

const LOGO_STAR =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663029442648/HuT9LUnwcUFmp6Xsie23M7/logo-star-VXHLUR84pLpFzMGbXzZvfX.webp";

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

const GRADE_LABELS: Record<GradeZone, string> = {
  KG: "🌟 Kindergarten",
  G1: "🚀 Grade 1",
  G2: "🎯 Grade 2",
  G3: "🏆 Grade 3",
};

const GRADE_COLORS: Record<GradeZone, string> = {
  KG: "oklch(0.82 0.17 85)",
  G1: "oklch(0.58 0.19 250)",
  G2: "oklch(0.65 0.2 145)",
  G3: "oklch(0.62 0.22 25)",
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden:  { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.35, ease } },
};

function StatCard({
  emoji,
  value,
  label,
  color,
}: {
  emoji: string;
  value: string | number;
  label: string;
  color: string;
}) {
  return (
    <div
      className="flex items-center gap-3 p-4 rounded-2xl"
      style={{
        background: color,
        border: "2.5px solid oklch(0.18 0.04 270)",
        boxShadow: "4px 4px 0 oklch(0.18 0.04 270)",
      }}
    >
      <span className="text-3xl" aria-hidden="true">{emoji}</span>
      <div>
        <div
          style={{
            fontFamily: "'Fredoka One', sans-serif",
            fontSize: "1.4rem",
            color: "oklch(0.18 0.04 270)",
            lineHeight: 1,
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700,
            fontSize: "0.78rem",
            color: "oklch(0.28 0.04 270)",
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

function AccuracyBar({ pct, passed }: { pct: number; passed: boolean }) {
  return (
    <div
      className="rounded-full overflow-hidden flex-1"
      style={{
        height: "10px",
        background: "oklch(0.88 0.02 90)",
        border: "1.5px solid oklch(0.18 0.04 270 / 0.3)",
        minWidth: "60px",
      }}
    >
      <motion.div
        style={{
          height: "100%",
          background: passed
            ? "oklch(0.65 0.2 145)"
            : pct >= 60
            ? "oklch(0.82 0.17 85)"
            : "oklch(0.62 0.22 25)",
          borderRadius: "9999px",
        }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.7, ease }}
      />
    </div>
  );
}

export default function ParentsScreen() {
  const {
    goHome,
    levels,
    subLevelProgress,
    answerHistory,
    totalStarsEarned,
  } = useGame();

  // ── Derived stats ──────────────────────────────────────────
  const totalGamesPlayed = levels.reduce((s, l) => s + l.gamesPlayed, 0);
  const totalPossibleStars = levels.reduce((s, l) => s + l.totalStars, 0);
  const totalAttempts = subLevelProgress.reduce((s, sp) => s + sp.totalAttempts, 0);
  const totalCorrect = subLevelProgress.reduce((s, sp) => s + sp.totalCorrect, 0);
  const overallAccuracy = totalAttempts > 0
    ? Math.round((totalCorrect / totalAttempts) * 100)
    : 0;
  const passedOps = subLevelProgress.filter((s) => s.passed).length;
  const totalOps = subLevelProgress.length;

  // Group sub-levels by grade
  const byGrade = useMemo(() => {
    const grades: GradeZone[] = ["KG", "G1", "G2", "G3"];
    return grades.map((grade) => ({
      grade,
      subs: subLevelProgress.filter((s) => s.grade === grade),
    }));
  }, [subLevelProgress]);

  // Recent history (last 20, newest first)
  const recentHistory = useMemo(
    () => [...answerHistory].reverse().slice(0, 20),
    [answerHistory]
  );

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.985 0.025 90)" }}
    >
      {/* Header */}
      <motion.header
        className="flex items-center justify-between px-5 pt-5 pb-4"
        style={{
          background: "oklch(0.58 0.19 250)",
          borderBottom: "3px solid oklch(0.18 0.04 270)",
          boxShadow: "0 4px 0 oklch(0.18 0.04 270)",
        }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease }}
      >
        <button
          className="btn-ink btn-ink-white text-sm px-4 py-2"
          onClick={goHome}
          aria-label="Go back to home"
        >
          ← Home
        </button>

        <div className="flex items-center gap-2">
          <img src={LOGO_STAR} alt="" className="w-9 h-9" aria-hidden="true" />
          <h1
            className="text-xl md:text-2xl"
            style={{
              fontFamily: "'Fredoka One', sans-serif",
              color: "white",
              textShadow: "2px 2px 0 oklch(0.18 0.04 270 / 0.4)",
            }}
          >
            Parents Dashboard
          </h1>
        </div>

        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
          style={{
            background: "oklch(0.82 0.17 85)",
            border: "2px solid oklch(0.18 0.04 270)",
          }}
        >
          <span className="text-lg" aria-hidden="true">⭐</span>
          <span
            style={{
              fontFamily: "'Fredoka One', sans-serif",
              fontSize: "1rem",
              color: "oklch(0.18 0.04 270)",
            }}
          >
            {totalStarsEarned}
          </span>
        </div>
      </motion.header>

      {/* Content */}
      <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
        <motion.div
          className="flex flex-col gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Welcome */}
          <motion.p
            variants={itemVariants}
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 700,
              fontSize: "1.05rem",
              color: "oklch(0.35 0.04 270)",
            }}
          >
            Here's how your child is doing on their math adventure! 🦉
          </motion.p>

          {/* ── Overall Stats ─────────────────────────────── */}
          <motion.div variants={itemVariants}>
            <h2
              className="mb-3 text-xl"
              style={{ fontFamily: "'Fredoka One', sans-serif", color: "oklch(0.18 0.04 270)" }}
            >
              📊 Overall Stats
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <StatCard emoji="⭐" value={`${totalStarsEarned}/${totalPossibleStars}`} label="Stars Earned" color="oklch(0.82 0.17 85)" />
              <StatCard emoji="🎮" value={totalGamesPlayed} label="Games Played" color="oklch(0.58 0.19 250)" />
              <StatCard emoji="🎯" value={totalAttempts > 0 ? `${overallAccuracy}%` : "—"} label="Accuracy" color="oklch(0.65 0.2 145)" />
              <StatCard emoji="✅" value={`${passedOps}/${totalOps}`} label="Ops Passed" color="oklch(0.82 0.17 85)" />
            </div>
          </motion.div>

          {/* ── Per-Grade Sub-level Progress ──────────────── */}
          <motion.div variants={itemVariants}>
            <h2
              className="mb-3 text-xl"
              style={{ fontFamily: "'Fredoka One', sans-serif", color: "oklch(0.18 0.04 270)" }}
            >
              📚 Operation Progress
            </h2>
            <div className="flex flex-col gap-4">
              {byGrade.map(({ grade, subs }, gi) => {
                const levelInfo = levels.find((l) => l.id === grade);
                // Hide locked grades with zero attempts
                if (!levelInfo?.unlocked && subs.every((s) => s.totalAttempts === 0)) return null;
                return (
                  <div
                    key={grade}
                    className="rounded-2xl overflow-hidden"
                    style={{
                      border: "2.5px solid oklch(0.18 0.04 270)",
                      boxShadow: "4px 4px 0 oklch(0.18 0.04 270)",
                    }}
                  >
                    {/* Grade header */}
                    <div
                      className="px-4 py-2.5"
                      style={{ background: GRADE_COLORS[grade] }}
                    >
                      <span
                        style={{
                          fontFamily: "'Fredoka One', sans-serif",
                          fontSize: "1rem",
                          color: grade === "KG" ? "oklch(0.18 0.04 270)" : "white",
                        }}
                      >
                        {GRADE_LABELS[grade]}
                        {levelInfo && !levelInfo.unlocked && " 🔒"}
                      </span>
                    </div>
                    {/* Sub-level rows */}
                    <div
                      className="px-4 py-3 flex flex-col gap-2.5"
                      style={{ background: "oklch(0.99 0.015 85)" }}
                    >
                      {subs.map((sp) => {
                        const acc = sp.totalAttempts > 0
                          ? Math.round((sp.totalCorrect / sp.totalAttempts) * 100)
                          : 0;
                        return (
                          <div key={sp.subLevelId} className="flex items-center gap-3">
                            <span className="text-xl shrink-0" aria-hidden="true">{sp.emoji}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span
                                  style={{
                                    fontFamily: "'Fredoka One', sans-serif",
                                    fontSize: "0.88rem",
                                    color: "oklch(0.18 0.04 270)",
                                  }}
                                >
                                  {sp.label}
                                </span>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  {sp.passed && (
                                    <span className="text-xs" aria-label="Passed">✅</span>
                                  )}
                                  <span
                                    style={{
                                      fontFamily: "'Nunito', sans-serif",
                                      fontWeight: 700,
                                      fontSize: "0.72rem",
                                      color: "oklch(0.52 0.04 270)",
                                    }}
                                  >
                                    {sp.totalAttempts > 0
                                      ? `${acc}% (${sp.totalCorrect}/${sp.totalAttempts})`
                                      : "Not started"}
                                  </span>
                                </div>
                              </div>
                              <AccuracyBar pct={acc} passed={sp.passed} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* ── Level Stars Progress ──────────────────────── */}
          <motion.div variants={itemVariants}>
            <h2
              className="mb-3 text-xl"
              style={{ fontFamily: "'Fredoka One', sans-serif", color: "oklch(0.18 0.04 270)" }}
            >
              ⭐ Level Stars
            </h2>
            <div className="card-ink p-4 flex flex-col gap-3">
              {levels.map((lvl) => {
                const pct = Math.round((lvl.stars / lvl.totalStars) * 100);
                return (
                  <div key={lvl.id} className="flex items-center gap-3">
                    <span
                      className="text-sm w-28 shrink-0"
                      style={{
                        fontFamily: "'Fredoka One', sans-serif",
                        color: lvl.unlocked ? "oklch(0.18 0.04 270)" : "oklch(0.65 0.04 270)",
                      }}
                    >
                      {!lvl.unlocked ? "🔒 " : ""}{lvl.label}
                    </span>
                    <div className="progress-track flex-1">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${pct}%`,
                          background: lvl.unlocked
                            ? `linear-gradient(90deg, ${lvl.bgColor}, oklch(0.65 0.2 145))`
                            : "oklch(0.75 0.04 270)",
                        }}
                      />
                    </div>
                    <div className="flex gap-0.5 shrink-0">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className={`text-base ${i < lvl.stars ? "star-filled" : "star-empty"}`}
                          aria-hidden="true"
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* ── Recent Activity Log ───────────────────────── */}
          <motion.div variants={itemVariants}>
            <h2
              className="mb-3 text-xl"
              style={{ fontFamily: "'Fredoka One', sans-serif", color: "oklch(0.18 0.04 270)" }}
            >
              🕐 Recent Activity
            </h2>

            {recentHistory.length === 0 ? (
              <div
                className="text-center py-8 rounded-2xl"
                style={{
                  background: "oklch(0.99 0.015 85)",
                  border: "2.5px dashed oklch(0.18 0.04 270 / 0.3)",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Fredoka One', sans-serif",
                    fontSize: "1rem",
                    color: "oklch(0.52 0.04 270)",
                  }}
                >
                  No activity yet — play a game to see results here! 🎮
                </p>
              </div>
            ) : (
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  border: "2.5px solid oklch(0.18 0.04 270)",
                  boxShadow: "4px 4px 0 oklch(0.18 0.04 270)",
                }}
              >
                {/* Table header */}
                <div
                  className="grid px-4 py-2"
                  style={{
                    gridTemplateColumns: "1.5rem 1fr 5rem 3rem",
                    gap: "0.5rem",
                    background: "oklch(0.58 0.19 250)",
                    borderBottom: "2px solid oklch(0.18 0.04 270)",
                  }}
                >
                  {["", "Question", "Operation", "✓/✗"].map((h) => (
                    <span
                      key={h}
                      style={{
                        fontFamily: "'Fredoka One', sans-serif",
                        fontSize: "0.78rem",
                        color: "white",
                      }}
                    >
                      {h}
                    </span>
                  ))}
                </div>

                {/* Table rows */}
                <div style={{ background: "oklch(0.99 0.015 85)" }}>
                  {recentHistory.map((entry, i) => (
                    <div
                      key={i}
                      className="grid px-4 py-2 items-center"
                      style={{
                        gridTemplateColumns: "1.5rem 1fr 5rem 3rem",
                        gap: "0.5rem",
                        borderBottom:
                          i < recentHistory.length - 1
                            ? "1px solid oklch(0.18 0.04 270 / 0.1)"
                            : "none",
                        background:
                          i % 2 === 0 ? "transparent" : "oklch(0.97 0.015 85)",
                      }}
                    >
                      <span className="text-sm" aria-hidden="true">
                        {GRADE_LABELS[entry.grade]?.split(" ")[0] ?? ""}
                      </span>
                      <span
                        style={{
                          fontFamily: "'Nunito', sans-serif",
                          fontWeight: 700,
                          fontSize: "0.82rem",
                          color: "oklch(0.28 0.04 270)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {entry.questionText}
                      </span>
                      <span
                        style={{
                          fontFamily: "'Nunito', sans-serif",
                          fontWeight: 700,
                          fontSize: "0.72rem",
                          color: "oklch(0.52 0.04 270)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {entry.subLevelLabel}
                      </span>
                      <span
                        className="text-center rounded-lg px-1 py-0.5 text-xs"
                        style={{
                          background: entry.correct
                            ? "oklch(0.92 0.06 145)"
                            : "oklch(0.95 0.04 25)",
                          color: entry.correct
                            ? "oklch(0.35 0.15 145)"
                            : "oklch(0.45 0.18 25)",
                          fontFamily: "'Fredoka One', sans-serif",
                          border: `1.5px solid ${
                            entry.correct
                              ? "oklch(0.65 0.2 145)"
                              : "oklch(0.62 0.22 25)"
                          }`,
                        }}
                      >
                        {entry.correct ? "✓" : "✗"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* ── Settings Placeholders ─────────────────────── */}
          <motion.div variants={itemVariants}>
            <h2
              className="mb-3 text-xl"
              style={{ fontFamily: "'Fredoka One', sans-serif", color: "oklch(0.18 0.04 270)" }}
            >
              ⚙️ Settings
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: "🔔", label: "Daily Reminders",  desc: "Set practice time" },
                { icon: "⏱️", label: "Session Duration", desc: "10 min / session" },
                { icon: "🎵", label: "Sound Effects",    desc: "Currently: On" },
                { icon: "🌐", label: "Language",         desc: "English" },
              ].map((setting) => (
                <button
                  key={setting.label}
                  className="flex items-center gap-3 p-4 rounded-2xl text-left w-full"
                  style={{
                    background: "oklch(0.99 0.015 85)",
                    border: "2.5px solid oklch(0.18 0.04 270)",
                    boxShadow: "3px 3px 0 oklch(0.18 0.04 270)",
                    transition: "transform 120ms ease-out, box-shadow 120ms ease-out",
                  }}
                  onMouseDown={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translate(2px,2px)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "1px 1px 0 oklch(0.18 0.04 270)";
                  }}
                  onMouseUp={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "";
                    (e.currentTarget as HTMLElement).style.boxShadow = "3px 3px 0 oklch(0.18 0.04 270)";
                  }}
                  onClick={() => toast.info("Feature coming soon! 🚀")}
                  aria-label={setting.label}
                >
                  <span className="text-2xl" aria-hidden="true">{setting.icon}</span>
                  <div>
                    <div
                      style={{
                        fontFamily: "'Fredoka One', sans-serif",
                        fontSize: "0.95rem",
                        color: "oklch(0.18 0.04 270)",
                      }}
                    >
                      {setting.label}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Nunito', sans-serif",
                        fontWeight: 700,
                        fontSize: "0.78rem",
                        color: "oklch(0.52 0.04 270)",
                      }}
                    >
                      {setting.desc}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          <div className="h-6" />
        </motion.div>
      </main>
    </div>
  );
}
