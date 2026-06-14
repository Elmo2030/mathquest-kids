/**
 * badges.ts — MathQuest Kids
 * ─────────────────────────────────────────────────────────────
 * Badge / achievement definitions and unlock logic.
 * All badge names and descriptions are bilingual (EN + AR).
 * Numbers in descriptions remain Western (0–9).
 * ─────────────────────────────────────────────────────────────
 */

export interface Badge {
  id: string;
  emoji: string;
  nameEn: string;
  nameAr: string;
  descEn: string;
  descAr: string;
  /** Rarity affects the badge card colour */
  rarity: "bronze" | "silver" | "gold" | "platinum";
}

export const ALL_BADGES: Badge[] = [
  // ── Milestone badges ──────────────────────────────────────
  {
    id: "first_win",
    emoji: "🌟",
    nameEn: "First Win",
    nameAr: "أول انتصار",
    descEn: "Solve your very first question correctly!",
    descAr: "أجب على أول سؤال بشكل صحيح!",
    rarity: "bronze",
  },
  {
    id: "ten_correct",
    emoji: "🔟",
    nameEn: "Perfect Ten",
    nameAr: "عشرة مثالية",
    descEn: "Answer 10 questions correctly in total.",
    descAr: "أجب على 10 أسئلة بشكل صحيح.",
    rarity: "bronze",
  },
  {
    id: "fifty_correct",
    emoji: "🏅",
    nameEn: "Half Century",
    nameAr: "نصف قرن",
    descEn: "Answer 50 questions correctly in total.",
    descAr: "أجب على 50 سؤالاً بشكل صحيح.",
    rarity: "silver",
  },
  {
    id: "hundred_correct",
    emoji: "💯",
    nameEn: "Century Club",
    nameAr: "نادي المئة",
    descEn: "Answer 100 questions correctly in total.",
    descAr: "أجب على 100 سؤال بشكل صحيح.",
    rarity: "gold",
  },

  // ── Streak badges ─────────────────────────────────────────
  {
    id: "streak_5",
    emoji: "🔥",
    nameEn: "On Fire!",
    nameAr: "في القمة!",
    descEn: "Get 5 correct answers in a row.",
    descAr: "أجب على 5 أسئلة متتالية بشكل صحيح.",
    rarity: "bronze",
  },
  {
    id: "streak_10",
    emoji: "🥷",
    nameEn: "Math Ninja",
    nameAr: "نينجا الرياضيات",
    descEn: "Get 10 correct answers in a row!",
    descAr: "أجب على 10 أسئلة متتالية بشكل صحيح!",
    rarity: "silver",
  },
  {
    id: "streak_20",
    emoji: "⚡",
    nameEn: "Lightning Brain",
    nameAr: "عقل البرق",
    descEn: "Get 20 correct answers in a row!",
    descAr: "أجب على 20 سؤالاً متتالياً بشكل صحيح!",
    rarity: "gold",
  },

  // ── Speed badges ──────────────────────────────────────────
  {
    id: "speed_thinker",
    emoji: "⏱️",
    nameEn: "Speed Thinker",
    nameAr: "المفكر السريع",
    descEn: "Answer a question correctly in under 5 seconds.",
    descAr: "أجب على سؤال بشكل صحيح في أقل من 5 ثوانٍ.",
    rarity: "bronze",
  },
  {
    id: "speed_demon",
    emoji: "🚀",
    nameEn: "Speed Demon",
    nameAr: "شيطان السرعة",
    descEn: "Answer 5 questions correctly in under 3 seconds each.",
    descAr: "أجب على 5 أسئلة بشكل صحيح في أقل من 3 ثوانٍ لكل منها.",
    rarity: "silver",
  },

  // ── Grade completion badges ───────────────────────────────
  {
    id: "kg_master",
    emoji: "🌈",
    nameEn: "Counting Champion",
    nameAr: "بطل العدّ",
    descEn: "Pass all KG sub-levels!",
    descAr: "اجتز جميع مستويات الروضة!",
    rarity: "bronze",
  },
  {
    id: "g1_master",
    emoji: "➕",
    nameEn: "Addition Ace",
    nameAr: "بطل الجمع",
    descEn: "Pass all Grade 1 sub-levels!",
    descAr: "اجتز جميع مستويات الصف الأول!",
    rarity: "silver",
  },
  {
    id: "g2_master",
    emoji: "✖️",
    nameEn: "Multiplication Master",
    nameAr: "سيّد الضرب",
    descEn: "Pass all Grade 2 sub-levels!",
    descAr: "اجتز جميع مستويات الصف الثاني!",
    rarity: "silver",
  },
  {
    id: "g3_master",
    emoji: "🏆",
    nameEn: "Master of Multiplication",
    nameAr: "أستاذ الضرب",
    descEn: "Pass all Grade 3 sub-levels — you're a math legend!",
    descAr: "اجتز جميع مستويات الصف الثالث — أنت أسطورة الرياضيات!",
    rarity: "gold",
  },

  // ── Special badges ────────────────────────────────────────
  {
    id: "perfect_round",
    emoji: "💎",
    nameEn: "Perfect Round",
    nameAr: "جولة مثالية",
    descEn: "Complete a round with 100% correct answers!",
    descAr: "أكمل جولة بإجابات صحيحة 100%!",
    rarity: "gold",
  },
  {
    id: "endless_50",
    emoji: "♾️",
    nameEn: "Endless Explorer",
    nameAr: "مستكشف لا نهاية",
    descEn: "Answer 50 questions in Endless Challenge mode.",
    descAr: "أجب على 50 سؤالاً في وضع التحدي اللانهائي.",
    rarity: "silver",
  },
  {
    id: "comeback_kid",
    emoji: "💪",
    nameEn: "Comeback Kid",
    nameAr: "العودة القوية",
    descEn: "Answer correctly after 3 wrong answers in a row.",
    descAr: "أجب بشكل صحيح بعد 3 إجابات خاطئة متتالية.",
    rarity: "bronze",
  },
  {
    id: "math_genius",
    emoji: "🧠",
    nameEn: "Math Genius",
    nameAr: "عبقري الرياضيات",
    descEn: "Complete ALL levels and unlock Endless mode!",
    descAr: "أكمل جميع المستويات وافتح وضع اللانهاية!",
    rarity: "platinum",
  },
];

export const BADGE_RARITY_COLORS: Record<Badge["rarity"], { bg: string; border: string; text: string; glow: string }> = {
  bronze:   { bg: "oklch(0.93 0.06 55)",  border: "oklch(0.62 0.14 55)",  text: "oklch(0.35 0.1 55)",  glow: "oklch(0.62 0.14 55 / 0.4)" },
  silver:   { bg: "oklch(0.93 0.01 270)", border: "oklch(0.62 0.04 270)", text: "oklch(0.28 0.04 270)", glow: "oklch(0.62 0.04 270 / 0.4)" },
  gold:     { bg: "oklch(0.97 0.12 85)",  border: "oklch(0.78 0.18 85)",  text: "oklch(0.35 0.1 65)",  glow: "oklch(0.78 0.18 85 / 0.5)" },
  platinum: { bg: "oklch(0.95 0.06 230)", border: "oklch(0.65 0.18 230)", text: "oklch(0.25 0.1 230)",  glow: "oklch(0.65 0.18 230 / 0.6)" },
};
