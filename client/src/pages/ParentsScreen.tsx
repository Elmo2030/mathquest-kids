/**
 * ParentsScreen — MathQuest Kids
 * Design: Sunny Storybook
 * A clean, readable dashboard for parents/guardians to review
 * their child's progress. Calmer palette, same design language.
 * Math logic and real data NOT implemented yet (Task 1 shell).
 */

import { motion } from "framer-motion";
import { useGame } from "@/contexts/GameContext";

const LOGO_STAR =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663029442648/HuT9LUnwcUFmp6Xsie23M7/logo-star-VXHLUR84pLpFzMGbXzZvfX.webp";

const STATS = [
  { label: "Total Stars",      value: "3",   icon: "⭐", color: "oklch(0.82 0.17 85)" },
  { label: "Quests Completed", value: "2",   icon: "🎯", color: "oklch(0.58 0.19 250)" },
  { label: "Days Played",      value: "5",   icon: "📅", color: "oklch(0.65 0.2 145)" },
  { label: "Best Streak",      value: "3🔥", icon: "🏆", color: "oklch(0.62 0.22 25)" },
];

const RECENT_ACTIVITY = [
  { date: "Today",      level: "Grade 1",      score: "8/10", stars: 2, emoji: "🚀" },
  { date: "Yesterday",  level: "Kindergarten", score: "10/10", stars: 3, emoji: "🌟" },
  { date: "2 days ago", level: "Kindergarten", score: "6/10", stars: 1, emoji: "🌟" },
];

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
  const { goHome } = useGame();

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
          👤 Alex
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
          {/* Welcome message */}
          <motion.div variants={itemVariants}>
            <p
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 700,
                fontSize: "1.05rem",
                color: "oklch(0.35 0.04 270)",
              }}
            >
              Here's how Alex is doing on their math adventure! 🦉
            </p>
          </motion.div>

          {/* Stats grid */}
          <motion.div variants={itemVariants}>
            <h2
              className="mb-3 text-xl"
              style={{
                fontFamily: "'Fredoka One', sans-serif",
                color: "oklch(0.18 0.04 270)",
              }}
            >
              Overall Stats
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {STATS.map((stat) => (
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

          {/* Level progress */}
          <motion.div variants={itemVariants}>
            <h2
              className="mb-3 text-xl"
              style={{
                fontFamily: "'Fredoka One', sans-serif",
                color: "oklch(0.18 0.04 270)",
              }}
            >
              Level Progress
            </h2>
            <div
              className="card-ink p-4 flex flex-col gap-3"
            >
              {[
                { label: "Kindergarten", pct: 67, stars: 2, color: "oklch(0.82 0.17 85)" },
                { label: "Grade 1",      pct: 33, stars: 1, color: "oklch(0.58 0.19 250)" },
                { label: "Grade 2",      pct: 0,  stars: 0, color: "oklch(0.65 0.2 145)", locked: true },
                { label: "Grade 3",      pct: 0,  stars: 0, color: "oklch(0.62 0.22 25)", locked: true },
              ].map((lvl) => (
                <div key={lvl.label} className="flex items-center gap-3">
                  <span
                    className="text-sm w-28 shrink-0"
                    style={{
                      fontFamily: "'Fredoka One', sans-serif",
                      color: lvl.locked ? "oklch(0.65 0.04 270)" : "oklch(0.18 0.04 270)",
                    }}
                  >
                    {lvl.locked ? "🔒 " : ""}{lvl.label}
                  </span>
                  <div className="progress-track flex-1">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${lvl.pct}%`,
                        background: lvl.locked
                          ? "oklch(0.75 0.04 270)"
                          : `linear-gradient(90deg, ${lvl.color}, oklch(0.65 0.2 145))`,
                      }}
                    />
                  </div>
                  <div className="flex gap-0.5 shrink-0">
                    {[0,1,2].map((i) => (
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
              ))}
            </div>
          </motion.div>

          {/* Recent activity */}
          <motion.div variants={itemVariants}>
            <h2
              className="mb-3 text-xl"
              style={{
                fontFamily: "'Fredoka One', sans-serif",
                color: "oklch(0.18 0.04 270)",
              }}
            >
              Recent Activity
            </h2>
            <div className="flex flex-col gap-3">
              {RECENT_ACTIVITY.map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-2xl"
                  style={{
                    background: "oklch(0.99 0.015 85)",
                    border: "2.5px solid oklch(0.18 0.04 270)",
                    boxShadow: "3px 3px 0 oklch(0.18 0.04 270)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" aria-hidden="true">{activity.emoji}</span>
                    <div>
                      <div
                        style={{
                          fontFamily: "'Fredoka One', sans-serif",
                          fontSize: "1rem",
                          color: "oklch(0.18 0.04 270)",
                        }}
                      >
                        {activity.level}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Nunito', sans-serif",
                          fontWeight: 700,
                          fontSize: "0.8rem",
                          color: "oklch(0.52 0.04 270)",
                        }}
                      >
                        {activity.date}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="px-2 py-1 rounded-lg text-sm"
                      style={{
                        background: "oklch(0.97 0.02 90)",
                        border: "1.5px solid oklch(0.18 0.04 270)",
                        fontFamily: "'Fredoka One', sans-serif",
                        color: "oklch(0.18 0.04 270)",
                      }}
                    >
                      {activity.score}
                    </span>
                    <div className="flex gap-0.5">
                      {[0,1,2].map((i) => (
                        <span
                          key={i}
                          className={`text-lg ${i < activity.stars ? "star-filled" : "star-empty"}`}
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

          {/* Settings placeholders */}
          <motion.div variants={itemVariants}>
            <h2
              className="mb-3 text-xl"
              style={{
                fontFamily: "'Fredoka One', sans-serif",
                color: "oklch(0.18 0.04 270)",
              }}
            >
              Settings
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: "🔔", label: "Daily Reminders",    desc: "Set practice time" },
                { icon: "⏱️", label: "Session Duration",   desc: "10 min / session" },
                { icon: "🎵", label: "Sound Effects",      desc: "Currently: On" },
                { icon: "🌐", label: "Language",           desc: "English" },
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
                  onClick={() => {}}
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

          {/* Bottom spacer */}
          <div className="h-6" />
        </motion.div>
      </main>
    </div>
  );
}
