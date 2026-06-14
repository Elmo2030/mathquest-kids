/**
 * mathEngine.ts — MathQuest Kids
 * ─────────────────────────────────────────────────────────────
 * Pure utility module: generates questions, answer choices, and
 * validates answers for all four grade levels.
 *
 * KG  — Counting (1–10) + Number recognition
 * G1  — Addition & Subtraction (≤ 20, no negatives)
 * G2  — Addition/Subtraction (≤ 100) + Basic Multiplication
 * G3  — Full Times Tables (12×12) + Division + Fractions
 *
 * Sub-level Progression System:
 *   Each grade is divided into named "sub-levels" (operations).
 *   A child must answer PASS_THRESHOLD questions correctly within
 *   a sub-level to "pass" it and advance to the next operation.
 * ─────────────────────────────────────────────────────────────
 */

// ── Constants ─────────────────────────────────────────────────

/** Correct answers needed to pass a sub-level */
export const PASS_THRESHOLD = 5;

/** Questions served per round (across all sub-levels) */
export const QUESTIONS_PER_ROUND = 10;

// ── Types ─────────────────────────────────────────────────────

export type GradeLevel = "KG" | "G1" | "G2" | "G3";

export type QuestionType =
  // KG
  | "counting"
  | "number_id"
  // G1
  | "addition_easy"
  | "subtraction_easy"
  // G2
  | "addition_hard"
  | "subtraction_hard"
  | "multiplication_basic"
  // G3
  | "multiplication_full"
  | "division"
  | "fraction";

/** A named sub-level (operation group) within a grade */
export interface SubLevel {
  id: string;                 // e.g. "KG-counting"
  grade: GradeLevel;
  label: string;              // e.g. "Counting"
  emoji: string;
  types: QuestionType[];      // question types included
  description: string;
}

/** Visual icon used in KG counting questions */
export interface CountingIcon {
  emoji: string;
  label: string;
}

/** Fraction visual data */
export interface FractionVisual {
  numerator: number;
  denominator: number;
  /** SVG path segments for the shaded slice(s) */
  label: string;              // e.g. "1/2"
}

export interface Question {
  id: string;
  type: QuestionType;
  subLevelId: string;
  /** Human-readable question text */
  text: string;
  /** For counting questions: the emoji repeated `countingAmount` times */
  countingIcon?: CountingIcon;
  countingAmount?: number;
  /** Operands for arithmetic questions */
  operandA?: number;
  operandB?: number;
  /** Fraction visual (G3 fraction questions) */
  fractionVisual?: FractionVisual;
  /** The correct numeric answer (fraction: numerator index 0–(denom-1)) */
  answer: number;
  /** 4 shuffled answer choices */
  choices: AnswerChoice[];
  /** Mascot hint text */
  hint: string;
  /** Category chip label */
  category: string;
  categoryEmoji: string;
}

export interface AnswerChoice {
  id: string;       // "a" | "b" | "c" | "d"
  value: number;
  label: string;
  correct: boolean;
}

// ── Sub-level Registry ────────────────────────────────────────

export const SUB_LEVELS: SubLevel[] = [
  // KG
  {
    id: "KG-counting",
    grade: "KG",
    label: "Counting",
    emoji: "🔢",
    types: ["counting"],
    description: "Count objects up to 10",
  },
  {
    id: "KG-numbers",
    grade: "KG",
    label: "Numbers",
    emoji: "🔡",
    types: ["number_id"],
    description: "Recognise numerals 1–10",
  },
  // G1
  {
    id: "G1-addition",
    grade: "G1",
    label: "Addition",
    emoji: "➕",
    types: ["addition_easy"],
    description: "Add numbers up to 20",
  },
  {
    id: "G1-subtraction",
    grade: "G1",
    label: "Subtraction",
    emoji: "➖",
    types: ["subtraction_easy"],
    description: "Subtract numbers up to 20",
  },
  // G2
  {
    id: "G2-addition",
    grade: "G2",
    label: "Big Addition",
    emoji: "➕",
    types: ["addition_hard"],
    description: "Add numbers up to 100",
  },
  {
    id: "G2-subtraction",
    grade: "G2",
    label: "Big Subtraction",
    emoji: "➖",
    types: ["subtraction_hard"],
    description: "Subtract numbers up to 100",
  },
  {
    id: "G2-multiplication",
    grade: "G2",
    label: "First Times",
    emoji: "✖️",
    types: ["multiplication_basic"],
    description: "Multiply small numbers (2×, 5×, 10×)",
  },
  // G3
  {
    id: "G3-multiplication",
    grade: "G3",
    label: "Times Tables",
    emoji: "✖️",
    types: ["multiplication_full"],
    description: "Full multiplication tables up to 12×12",
  },
  {
    id: "G3-division",
    grade: "G3",
    label: "Division",
    emoji: "➗",
    types: ["division"],
    description: "Divide with no remainders",
  },
  {
    id: "G3-fractions",
    grade: "G3",
    label: "Fractions",
    emoji: "🥧",
    types: ["fraction"],
    description: "Identify 1/2, 1/3, and 1/4",
  },
];

/** Get all sub-levels for a given grade */
export function getSubLevels(grade: GradeLevel): SubLevel[] {
  return SUB_LEVELS.filter((s) => s.grade === grade);
}

// ── Helpers ───────────────────────────────────────────────────

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Generate distractor answer choices that are:
 * - Different from the correct answer and each other
 * - Within a plausible range (clamped to [minVal, maxVal])
 */
function generateDistractors(
  correct: number,
  count: number,
  minVal: number,
  maxVal: number,
  spread: number = 4
): number[] {
  const distractors = new Set<number>();
  let attempts = 0;

  while (distractors.size < count && attempts < 300) {
    attempts++;
    const offset = randomInt(1, spread) * (Math.random() < 0.5 ? 1 : -1);
    const candidate = correct + offset;
    if (
      candidate !== correct &&
      candidate >= minVal &&
      candidate <= maxVal &&
      !distractors.has(candidate)
    ) {
      distractors.add(candidate);
    }
  }

  // Fallback: fill remaining with sequential values
  for (let v = minVal; v <= maxVal && distractors.size < count; v++) {
    if (v !== correct && !distractors.has(v)) distractors.add(v);
  }

  return Array.from(distractors).slice(0, count);
}

function buildChoices(correct: number, distractorValues: number[], labelFn?: (v: number) => string): AnswerChoice[] {
  const ids = ["a", "b", "c", "d"];
  const allValues = shuffleArray([correct, ...distractorValues]);
  return allValues.map((v, i) => ({
    id: ids[i],
    value: v,
    label: labelFn ? labelFn(v) : String(v),
    correct: v === correct,
  }));
}

// ── KG Generators ─────────────────────────────────────────────

const KG_ICONS: CountingIcon[] = [
  { emoji: "🍎", label: "apple" },
  { emoji: "⭐", label: "star" },
  { emoji: "🐱", label: "cat" },
  { emoji: "🌸", label: "flower" },
  { emoji: "🦋", label: "butterfly" },
  { emoji: "🍭", label: "lollipop" },
  { emoji: "🐸", label: "frog" },
  { emoji: "🎈", label: "balloon" },
  { emoji: "🍩", label: "donut" },
  { emoji: "🐥", label: "chick" },
  { emoji: "🌈", label: "rainbow" },
  { emoji: "🍓", label: "strawberry" },
];

const KG_HINTS = [
  "Count each one carefully! 🦉",
  "Point and count out loud! 👆",
  "How many can you see? 👀",
  "Count them one by one! 🐾",
  "Take your time, you've got this! 💪",
];

function generateKGCounting(): Question {
  const count = randomInt(1, 10);
  const icon = randomItem(KG_ICONS);
  const distractors = generateDistractors(count, 3, 1, 10);
  return {
    id: uid(),
    type: "counting",
    subLevelId: "KG-counting",
    text: `How many ${icon.label}s do you see?`,
    countingIcon: icon,
    countingAmount: count,
    answer: count,
    choices: buildChoices(count, distractors),
    hint: randomItem(KG_HINTS),
    category: "Counting",
    categoryEmoji: "🔢",
  };
}

function generateKGNumberId(): Question {
  const num = randomInt(1, 10);
  const distractors = generateDistractors(num, 3, 1, 10);
  return {
    id: uid(),
    type: "number_id",
    subLevelId: "KG-numbers",
    text: "What number is this?",
    countingAmount: num,
    answer: num,
    choices: buildChoices(num, distractors),
    hint: randomItem(KG_HINTS),
    category: "Numbers",
    categoryEmoji: "🔡",
  };
}

// ── G1 Generators ─────────────────────────────────────────────

const G1_ADD_HINTS = [
  "Add them together! 🦉",
  "Count on from the bigger number! 🔢",
  "Use your fingers if you need! 🖐️",
  "You can do it! Think carefully! 🧠",
  "Start with the bigger number! ⬆️",
];

const G1_SUB_HINTS = [
  "Take away the smaller number! 🦉",
  "Count backwards! ⬅️",
  "How many are left? 🤔",
  "Subtract carefully! ✂️",
  "You've got this! Think it through! 💡",
];

function generateG1Addition(): Question {
  let a: number, b: number;
  do {
    a = randomInt(1, 15);
    b = randomInt(1, 10);
  } while (a + b > 20);
  const answer = a + b;
  return {
    id: uid(),
    type: "addition_easy",
    subLevelId: "G1-addition",
    text: `What is ${a} + ${b}?`,
    operandA: a,
    operandB: b,
    answer,
    choices: buildChoices(answer, generateDistractors(answer, 3, 1, 20)),
    hint: randomItem(G1_ADD_HINTS),
    category: "Addition",
    categoryEmoji: "➕",
  };
}

function generateG1Subtraction(): Question {
  const a = randomInt(2, 20);
  const b = randomInt(1, a);
  const answer = a - b;
  return {
    id: uid(),
    type: "subtraction_easy",
    subLevelId: "G1-subtraction",
    text: `What is ${a} − ${b}?`,
    operandA: a,
    operandB: b,
    answer,
    choices: buildChoices(answer, generateDistractors(answer, 3, 0, 20)),
    hint: randomItem(G1_SUB_HINTS),
    category: "Subtraction",
    categoryEmoji: "➖",
  };
}

// ── G2 Generators ─────────────────────────────────────────────

const G2_ADD_HINTS = [
  "Line them up and add! 🦉",
  "Break it into tens and ones! 🔟",
  "Count up carefully! 📈",
  "You know this one! 💪",
  "Think of the tens first! 💡",
];

const G2_SUB_HINTS = [
  "Take away step by step! 🦉",
  "Count down from the bigger number! ⬇️",
  "Break it into tens and ones! 🔟",
  "Almost there — think it through! 🤔",
  "You've got this! 💪",
];

const G2_MULT_HINTS = [
  "Multiplication is fast adding! 🦉",
  "Count by groups! 👥",
  "Think of the times table! 📋",
  "Multiply carefully! ✖️",
  "You can do it! 🌟",
];

function generateG2Addition(): Question {
  const a = randomInt(10, 90);
  const b = randomInt(5, 100 - a);
  const answer = a + b;
  return {
    id: uid(),
    type: "addition_hard",
    subLevelId: "G2-addition",
    text: `What is ${a} + ${b}?`,
    operandA: a,
    operandB: b,
    answer,
    choices: buildChoices(answer, generateDistractors(answer, 3, 1, 100, 8)),
    hint: randomItem(G2_ADD_HINTS),
    category: "Big Addition",
    categoryEmoji: "➕",
  };
}

function generateG2Subtraction(): Question {
  const a = randomInt(20, 100);
  const b = randomInt(5, a - 1);
  const answer = a - b;
  return {
    id: uid(),
    type: "subtraction_hard",
    subLevelId: "G2-subtraction",
    text: `What is ${a} − ${b}?`,
    operandA: a,
    operandB: b,
    answer,
    choices: buildChoices(answer, generateDistractors(answer, 3, 0, 99, 8)),
    hint: randomItem(G2_SUB_HINTS),
    category: "Big Subtraction",
    categoryEmoji: "➖",
  };
}

/** Basic multiplication: 2×, 5×, 10× tables */
function generateG2Multiplication(): Question {
  const multipliers = [2, 5, 10];
  const a = randomItem(multipliers);
  const b = randomInt(1, 10);
  const answer = a * b;
  return {
    id: uid(),
    type: "multiplication_basic",
    subLevelId: "G2-multiplication",
    text: `What is ${a} × ${b}?`,
    operandA: a,
    operandB: b,
    answer,
    choices: buildChoices(answer, generateDistractors(answer, 3, 0, 100, 10)),
    hint: randomItem(G2_MULT_HINTS),
    category: "Times Tables",
    categoryEmoji: "✖️",
  };
}

// ── G3 Generators ─────────────────────────────────────────────

const G3_MULT_HINTS = [
  "Remember your times tables! 🦉",
  "Think of the groups! 👥",
  "You've practised this! 📋",
  "Multiply step by step! ✖️",
  "You're a times-table hero! 🏆",
];

const G3_DIV_HINTS = [
  "Division is sharing equally! 🦉",
  "How many groups can you make? 👥",
  "Think of the matching times table! 📋",
  "Share them out carefully! ➗",
  "You can do it! 💪",
];

const G3_FRAC_HINTS = [
  "Look at the shaded pieces! 🦉",
  "Count the total slices first! 🥧",
  "The shaded part is the answer! 🎨",
  "How much of the pie is coloured? 🍕",
  "Top number = shaded, bottom = total! 📐",
];

/** Full times tables up to 12×12 */
function generateG3Multiplication(): Question {
  const a = randomInt(2, 12);
  const b = randomInt(2, 12);
  const answer = a * b;
  return {
    id: uid(),
    type: "multiplication_full",
    subLevelId: "G3-multiplication",
    text: `What is ${a} × ${b}?`,
    operandA: a,
    operandB: b,
    answer,
    choices: buildChoices(answer, generateDistractors(answer, 3, 1, 144, 12)),
    hint: randomItem(G3_MULT_HINTS),
    category: "Times Tables",
    categoryEmoji: "✖️",
  };
}

/** Division with no remainders */
function generateG3Division(): Question {
  // Generate as b × c = a, then ask a ÷ b = c
  const b = randomInt(2, 12);
  const c = randomInt(2, 12);
  const a = b * c;
  const answer = c;
  return {
    id: uid(),
    type: "division",
    subLevelId: "G3-division",
    text: `What is ${a} ÷ ${b}?`,
    operandA: a,
    operandB: b,
    answer,
    choices: buildChoices(answer, generateDistractors(answer, 3, 1, 12, 3)),
    hint: randomItem(G3_DIV_HINTS),
    category: "Division",
    categoryEmoji: "➗",
  };
}

/**
 * Fraction visual identification.
 * Shows a pie chart split into `denominator` equal slices,
 * with `numerator` slices shaded. The child picks the fraction label.
 *
 * Answer encoding: denominator index (2→0, 3→1, 4→2)
 * so we can use numeric choices mapped to fraction labels.
 */
const FRACTION_OPTIONS: FractionVisual[] = [
  { numerator: 1, denominator: 2, label: "1/2" },
  { numerator: 1, denominator: 3, label: "1/3" },
  { numerator: 1, denominator: 4, label: "1/4" },
];

function generateG3Fraction(): Question {
  const frac = randomItem(FRACTION_OPTIONS);
  // Encode answer as denominator (2, 3, or 4) — unique per option
  const answer = frac.denominator;
  // Distractors: the other denominators
  const distractorValues = FRACTION_OPTIONS
    .filter((f) => f.denominator !== frac.denominator)
    .map((f) => f.denominator);
  // Build choices with fraction labels
  const labelFn = (v: number) => {
    const f = FRACTION_OPTIONS.find((x) => x.denominator === v);
    return f ? f.label : `1/${v}`;
  };
  return {
    id: uid(),
    type: "fraction",
    subLevelId: "G3-fractions",
    text: "What fraction of the shape is shaded?",
    fractionVisual: frac,
    answer,
    choices: buildChoices(answer, distractorValues, labelFn),
    hint: randomItem(G3_FRAC_HINTS),
    category: "Fractions",
    categoryEmoji: "🥧",
  };
}

// ── Public API ────────────────────────────────────────────────

/**
 * Generate a single question for a specific sub-level.
 */
export function generateQuestionForSubLevel(subLevelId: string): Question {
  switch (subLevelId) {
    case "KG-counting":      return generateKGCounting();
    case "KG-numbers":       return generateKGNumberId();
    case "G1-addition":      return generateG1Addition();
    case "G1-subtraction":   return generateG1Subtraction();
    case "G2-addition":      return generateG2Addition();
    case "G2-subtraction":   return generateG2Subtraction();
    case "G2-multiplication":return generateG2Multiplication();
    case "G3-multiplication":return generateG3Multiplication();
    case "G3-division":      return generateG3Division();
    case "G3-fractions":     return generateG3Fraction();
    default:                 return generateG1Addition();
  }
}

/**
 * Generate a single question for a grade level.
 * Picks a random sub-level from the grade.
 */
export function generateQuestion(level: GradeLevel): Question {
  const subs = getSubLevels(level);
  const sub = randomItem(subs);
  return generateQuestionForSubLevel(sub.id);
}

/**
 * Generate a full round of `count` questions for a specific sub-level.
 */
export function generateSubLevelRound(subLevelId: string, count: number = QUESTIONS_PER_ROUND): Question[] {
  return Array.from({ length: count }, () => generateQuestionForSubLevel(subLevelId));
}

/**
 * Generate a full round mixing all sub-levels for a grade.
 * Ensures no two consecutive questions have the same type.
 */
export function generateRound(level: GradeLevel, count: number = QUESTIONS_PER_ROUND): Question[] {
  const subs = getSubLevels(level);
  const questions: Question[] = [];
  let lastSubId: string | null = null;

  for (let i = 0; i < count; i++) {
    let sub: SubLevel;
    let attempts = 0;
    do {
      sub = randomItem(subs);
      attempts++;
    } while (sub.id === lastSubId && attempts < 10);
    lastSubId = sub.id;
    questions.push(generateQuestionForSubLevel(sub.id));
  }

  return questions;
}

/**
 * Validate a user's answer choice.
 */
export function validateAnswer(question: Question, choiceId: string): boolean {
  const choice = question.choices.find((c) => c.id === choiceId);
  return choice?.correct ?? false;
}

/**
 * Get the correct choice from a question.
 */
export function getCorrectChoice(question: Question): AnswerChoice {
  return question.choices.find((c) => c.correct)!;
}

/**
 * Calculate the star rating for a completed round.
 * 3 stars: ≥90% | 2 stars: ≥60% | 1 star: ≥30% | 0 stars: <30%
 */
export function calculateStars(correct: number, total: number): number {
  const pct = correct / total;
  if (pct >= 0.9) return 3;
  if (pct >= 0.6) return 2;
  if (pct >= 0.3) return 1;
  return 0;
}
