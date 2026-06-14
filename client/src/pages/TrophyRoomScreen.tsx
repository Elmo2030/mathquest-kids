/**
 * TrophyRoomScreen — MathQuest Kids
 * Design: Sunny Storybook
 * Shows all badges in a rarity-grouped animated grid.
 * Unlocked badges glow; locked ones are greyed out.
 * Fully bilingual EN/AR with RTL support.
 */

import { motion } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBadges } from "@/contexts/BadgeContext";
import { ALL_BADGES, BADGE_RARITY_COLORS, type Badge } from "@/lib/badges";
import FloatingDecorations from "@/components/FloatingDecorations";
import LanguageToggle from "@/components/LanguageToggle";
import LtrNum from "@/components/LtrNum";
import BrandingFooter from "@/components/BrandingFooter";

const HERO_BG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663029442648/HuT9LUnwcUFmp6Xsie23M7/hero-bg-Wr2Ys1Yw5mZMJSHPLJqQGH.webp";

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

const RARITY_ORDER: Badge["rarity"][] = ["platinum", "gold", "silver", "bronze"];
const RARITY_LABELS: Record<Badge["rarity"], { en: string; ar: string }> = {
  platinum: { en: "Legendary",  ar: "أسطوري" },
  gold:     { en: "Gold",       ar: "ذهبي" },
  silver:   { en: "Silver",     ar: "فضي" },
  bronze:   { en: "Bronze",     ar: "برونزي" },
};

function BadgeCard({ badge, unlocked, index }: { badge: Badge; unlocked: boolean; index: number }) {
  const { isRTL, t } = useLanguage();
  const colors = BADGE_RARITY_COLORS[badge.rarity];
  const displayFont = isRTL ? "'Tajawal', sans-serif" : "'Fredoka One', sans-serif";
  const bodyFont    = isRTL ? "'Tajawal', sans-serif" : "'Nunito', sans-serif";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.88 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease }}
      whileHover={unlocked ? { y: -4, scale: 1.04 } : {}}
      className="relative flex flex-col items-center gap-2 p-4 rounded-2xl text-center"
      style={{
        background: unlocked ? colors.bg : "oklch(0.88 0.01 270)",
        border: `2.5px solid ${unlocked ? colors.border : "oklch(0.72 0.02 270)"}`,
        boxShadow: unlocked
          ? `${isRTL ? "-4px" : "4px"} 4px 0 oklch(0.18 0.04 270), 0 0 18px ${colors.glow}`
          : `${isRTL ? "-2px" : "2px"} 2px 0 oklch(0.55 0.02 270)`,
        opacity: unlocked ? 1 : 0.55,
        filter: unlocked ? "none" : "grayscale(0.8)",
        transition: "box-shadow 0.2s, transform 0.2s",
      }}
    >
      {/* Rarity pip */}
      <div
        className="absolute top-2 end-2 w-2.5 h-2.5 rounded-full"
        style={{ background: unlocked ? colors.border : "oklch(0.72 0.02 270)" }}
        aria-hidden="true"
      />

      {/* Emoji */}
      <motion.span
        className="text-4xl"
        animate={unlocked ? { scale: [1, 1.12, 1], rotate: [0, 5, -5, 0] } : {}}
        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
        aria-hidden="true"
      >
        {unlocked ? badge.emoji : "🔒"}
      </motion.span>

      {/* Name */}
      <span
        className="text-sm leading-tight"
        style={{
          fontFamily: displayFont,
          color: unlocked ? colors.text : "oklch(0.52 0.02 270)",
          fontWeight: 700,
        }}
      >
        {isRTL ? badge.nameAr : badge.nameEn}
      </span>

      {/* Description — only for unlocked */}
      {unlocked && (
        <span
          className="text-xs leading-snug"
          style={{
            fontFamily: bodyFont,
            color: colors.text,
            opacity: 0.8,
          }}
        >
          {isRTL ? badge.descAr : badge.descEn}
        </span>
      )}

      {!unlocked && (
        <span
          className="text-xs"
          style={{ fontFamily: bodyFont, color: "oklch(0.52 0.02 270)" }}
        >
          {t("trophyLocked")}
        </span>
      )}
    </motion.div>
  );
}

export default function TrophyRoomScreen() {
  const { goHome } = useGame();
  const { isRTL, t } = useLanguage();
  const { unlockedIds } = useBadges();

  const displayFont = isRTL ? "'Tajawal', sans-serif" : "'Fredoka One', sans-serif";
  const bodyFont    = isRTL ? "'Tajawal', sans-serif" : "'Nunito', sans-serif";

  const unlockedCount = unlockedIds.size;
  const totalCount = ALL_BADGES.length;

  return (
    <div
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{
        backgroundImage: `url(${HERO_BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0" style={{ background: "oklch(0.12 0.04 270 / 0.72)" }} />
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
        >
          {isRTL ? t("backHome").replace("← ", "") + " →" : "← " + t("backHome").replace("← ", "")}
        </button>

        <div className="flex items-center gap-2">
          <span className="text-3xl" aria-hidden="true">🏆</span>
          <span
            className="text-2xl md:text-3xl"
            style={{ fontFamily: displayFont, color: "oklch(0.97 0.12 85)", textShadow: "2px 2px 0 oklch(0.18 0.04 270)" }}
          >
            {t("trophyRoom")}
          </span>
        </div>

        <LanguageToggle variant="dark" />
      </motion.header>

      {/* Progress summary */}
      <motion.div
        className="relative z-10 text-center px-4 pt-2 pb-5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35, ease }}
      >
        <p style={{ fontFamily: bodyFont, color: "oklch(0.88 0.04 85)", fontSize: "1rem", fontWeight: 700 }}>
          {isRTL
            ? <>لقد حصلت على <LtrNum>{unlockedCount}</LtrNum> من أصل <LtrNum>{totalCount}</LtrNum> شارة 🎖️</>
            : <><LtrNum>{unlockedCount}</LtrNum> of <LtrNum>{totalCount}</LtrNum> badges unlocked 🎖️</>
          }
        </p>
        {/* Progress bar */}
        <div
          className="mx-auto mt-2 rounded-full overflow-hidden"
          style={{ maxWidth: "320px", height: "10px", background: "oklch(0.25 0.04 270)", border: "2px solid oklch(0.45 0.04 270)" }}
        >
          <motion.div
            style={{ height: "100%", background: "linear-gradient(90deg, oklch(0.78 0.18 85), oklch(0.65 0.2 145))", borderRadius: "9999px" }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.round((unlockedCount / totalCount) * 100)}%` }}
            transition={{ duration: 0.8, ease }}
          />
        </div>
      </motion.div>

      {/* Badge grid — grouped by rarity */}
      <main className="relative z-10 flex-1 px-4 pb-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto flex flex-col gap-8">
          {RARITY_ORDER.map((rarity) => {
            const badges = ALL_BADGES.filter((b) => b.rarity === rarity);
            const label = RARITY_LABELS[rarity];
            const colors = BADGE_RARITY_COLORS[rarity];
            return (
              <section key={rarity}>
                {/* Section header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 h-px" style={{ background: colors.border }} />
                  <span
                    className="px-3 py-1 rounded-full text-sm"
                    style={{
                      fontFamily: displayFont,
                      background: colors.bg,
                      color: colors.text,
                      border: `2px solid ${colors.border}`,
                      fontWeight: 700,
                    }}
                  >
                    {isRTL ? label.ar : label.en}
                  </span>
                  <div className="flex-1 h-px" style={{ background: colors.border }} />
                </div>

                {/* Badge cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {badges.map((badge, i) => (
                    <BadgeCard
                      key={badge.id}
                      badge={badge}
                      unlocked={unlockedIds.has(badge.id)}
                      index={i}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <BrandingFooter />
      </main>
    </div>
  );
}
