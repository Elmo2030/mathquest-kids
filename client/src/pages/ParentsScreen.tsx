/**
 * ParentsScreen — MathQuest Kids
 * Design: Sunny Storybook
 * Now wired to real GameContext data: level stars, games played, total stars.
 */

import { motion } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import { toast } from "sonner";

const LOGO_STAR =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663029442648/HuT9LUnwcUFmp6Xsie23M7/logo-star-VXHLUR84pLpFzMGbXzZvfX.webp";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden:  { y: 20, opacity: 0 },
  visible: {
    y: 0, opacity: 1,
    transition: { duration: 0.35, ease: [0.23, 1, 0.32, 1] as [number,number,number,number] },
  },
};

export default function ParentsScreen() {
  const { goHome, levels, totalStarsEarned } = useGame();

  const totalGamesPlayed = levels.reduce((s, l) => s + l.gamesPlayed, 0);
  const totalPossibleStars = levels.reduce((s, l) => s + l.totalStars, 0);

  const statsData = [
    { label: "Total Stars",      value: String(totalStarsEarned),   icon: "⭐", color: "oklch(0.82 0.17 85)" },
    { label: "Quests Completed", value: String(totalGamesPlayed),   icon: "🎯", color: "oklch(0.58 0.19 250)" },
    { label: "Levels Unlocked",  value: String(levels.filter(l => l.unlocked).length) + "/4", icon: "🔓", color: "oklch(0.65 0.2 145)" },
    { label: "Best Stars",       value: String(Math.max(...levels.map(l => l.stars))) + "/3", icon: "🏆", color: "oklch(0.62 0.22 25)" },
  ];

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
        transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] as [number,number,number,number] }}
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
          className="px-3 py-1.5 rounded-xl text-sm"
          style={{
            background: "oklch(0.99 0.015 85 / 0.9)",
            border: "2px solid oklch(0.18 0.04 270)",
            fontFamily: "'Fredoka One', sans-serif",
            color: "oklch(0.18 0.04 270)",
          }}
        >
          👤 Player
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
          <motion.div variants={itemVariants}>
            <p
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 700,
                fontSize: "1.05rem",
                color: "oklch(0.35 0.04 270)",
              }}
            >
              Here's how your child is doing on their math adventure! 🦉
            </p>
          </motion.div>

          {/* Stats grid — live data */}
          <motion.div variants={itemVariants}>
            <h2
              className="mb-3 text-xl"
              style={{ fontFamily: "'Fredoka One', sans-serif", color: "oklch(0.18 0.04 270)" }}
            >
              Overall Stats
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {statsData.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 p-4 rounded-2xl"
                  style={{
                    background: stat.color,
                    border: "2.5px solid oklch(0.18 0.04 270)",
                    boxShadow: "4px 4px 0 oklch(0.18 0.04 270)",
                  }}
                >
                  <span className="text-3xl" aria-hidden="true">{stat.icon}</span>
                  <div>
                    <div
                      style={{
                        fontFamily: "'Fredoka One', sans-serif",
                        fontSize: "1.4rem",
                        color: "oklch(0.18 0.04 270)",
                        lineHeight: 1,
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Nunito', sans-serif",
                        fontWeight: 700,
                        fontSize: "0.78rem",
                        color: "oklch(0.28 0.04 270)",
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Level progress — live data */}
          <motion.div variants={itemVariants}>
            <h2
              className="mb-3 text-xl"
              style={{ fontFamily: "'Fredoka One', sans-serif", color: "oklch(0.18 0.04 270)" }}
            >
              Level Progress
            </h2>
            <div className="card-ink p-4 flex flex-col gap-3">
              {levels.map((lvl) => {
                const pct = totalPossibleStars > 0
                  ? Math.round((lvl.stars / lvl.totalStars) * 100)
                  : 0;
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

          {/* Games played per level */}
          {totalGamesPlayed > 0 && (
            <motion.div variants={itemVariants}>
              <h2
                className="mb-3 text-xl"
                style={{ fontFamily: "'Fredoka One', sans-serif", color: "oklch(0.18 0.04 270)" }}
              >
                Practice Sessions
              </h2>
              <div className="flex flex-col gap-2.5">
                {levels.filter(l => l.gamesPlayed > 0).map((lvl) => (
                  <div
                    key={lvl.id}
                    className="flex items-center justify-between p-4 rounded-2xl"
                    style={{
                      background: "oklch(0.99 0.015 85)",
                      border: "2.5px solid oklch(0.18 0.04 270)",
                      boxShadow: "3px 3px 0 oklch(0.18 0.04 270)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl" aria-hidden="true">{lvl.emoji}</span>
                      <div>
                        <div
                          style={{
                            fontFamily: "'Fredoka One', sans-serif",
                            fontSize: "1rem",
                            color: "oklch(0.18 0.04 270)",
                          }}
                        >
                          {lvl.label}
                        </div>
                        <div
                          style={{
                            fontFamily: "'Nunito', sans-serif",
                            fontWeight: 700,
                            fontSize: "0.8rem",
                            color: "oklch(0.52 0.04 270)",
                          }}
                        >
                          {lvl.gamesPlayed} session{lvl.gamesPlayed !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className={`text-lg ${i < lvl.stars ? "star-filled" : "star-empty"}`}
                            aria-hidden="true"
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Settings placeholders */}
          <motion.div variants={itemVariants}>
            <h2
              className="mb-3 text-xl"
              style={{ fontFamily: "'Fredoka One', sans-serif", color: "oklch(0.18 0.04 270)" }}
            >
              Settings
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
