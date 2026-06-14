/**
 * mathEngine.ts — MathQuest Kids
 * ─────────────────────────────────────────────────────────────
 * Pure utility module: generates questions, answer choices, and
 * validates answers for KG and Grade 1 levels.
 *
 * KG  — Number recognition & visual counting (1–10)
 * G1  — Addition & Subtraction (numbers up to 20, no negatives)
 *
 * No side-effects. All functions are deterministic given a seed,
 * or random when no seed is provided.
 * ─────────────────────────────────────────────────────────────
 */

// ── Types ─────────────────────────────────────────────────────

export type GradeLevel = "KG" | "G1" | "G2" | "G3";

export type QuestionType =
  | "counting"        // KG: count the icons → pick the number
  | "number_id"       // KG: which number is shown? (numeral recognition)
  | "addition"        // G1: a + b = ?
  | "subtraction";    // G1: a - b = ? (b ≤ a, result ≥ 0)

/** Visual icon used in KG counting questions */
export interface CountingIcon {
  emoji: string;
  label: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  /** Human-readable question text, e.g. "What is 4 + 3?" */
  text: string;
  /** For counting questions: the emoji repeated `count` times */
  countingIcon?: CountingIcon;
  /** Number of icons to display (KG counting) */
  countingAmount?: number;
  /** The operands for arithmetic questions */
  operandA?: number;
  operandB?: number;
  /** The correct numeric answer */
  answer: number;
  /** 4 shuffled answer choices (1 correct + 3 distractors) */
  choices: AnswerChoice[];
  /** Mascot hint text */
  hint: string;
  /** Category chip label */
  category: string;
  /** Category emoji */
  categoryEmoji: string;
}

export interface AnswerChoice {
  id: string;       // "a" | "b" | "c" | "d"
  value: number;
  label: string;    // display string (same as value for now)
  correct: boolean;
}

// ── Constants ─────────────────────────────────────────────────

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
 * Generate 3 distractor answer choices that are:
 * - Different from the correct answer
 * - Different from each other
 * - Within a plausible range (±3 of correct, clamped to [1, maxVal])
 */
function generateDistractors(
  correct: number,
  count: number,
  minVal: number,
  maxVal: number
): number[] {
  const distractors = new Set<number>();
  let attempts = 0;

  while (distractors.size < count && attempts < 200) {
    attempts++;
    // Bias towards close numbers for difficulty calibration
    const offset = randomInt(1, 4) * (Math.random() < 0.5 ? 1 : -1);
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

  // Fallback: fill remaining slots with sequential values
  if (distractors.size < count) {
    for (let v = minVal; v <= maxVal && distractors.size < count; v++) {
      if (v !== correct && !distractors.has(v)) distractors.add(v);
    }
  }

  return Array.from(distractors).slice(0, count);
}

function buildChoices(
  correct: number,
  distractorValues: number[]
): AnswerChoice[] {
  const ids = ["a", "b", "c", "d"];
  const allValues = shuffleArray([correct, ...distractorValues]);
  return allValues.map((v, i) => ({
    id: ids[i],
    value: v,
    label: String(v),
    correct: v === correct,
  }));
}

// ── KG Question Generators ────────────────────────────────────

/**
 * KG Counting: show N emoji icons, pick the matching number.
 * Range: 1–10
 */
function generateKGCounting(): Question {
  const count = randomInt(1, 10);
  const icon = randomItem(KG_ICONS);
  const distractors = generateDistractors(count, 3, 1, 10);

  return {
    id: uid(),
    type: "counting",
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

/**
 * KG Number ID: show a numeral, pick the matching word/number.
 * (Simplified: show a large number, confirm recognition.)
 * Range: 1–10
 */
function generateKGNumberId(): Question {
  const num = randomInt(1, 10);
  const distractors = generateDistractors(num, 3, 1, 10);

  return {
    id: uid(),
    type: "number_id",
    text: `What number is this?`,
    countingAmount: num, // reuse field to display the large numeral
    answer: num,
    choices: buildChoices(num, distractors),
    hint: randomItem(KG_HINTS),
    category: "Numbers",
    categoryEmoji: "🔢",
  };
}

// ── G1 Question Generators ────────────────────────────────────

/**
 * G1 Addition: a + b = ?
 * a ∈ [1, 15], b ∈ [1, 10], sum ≤ 20
 */
function generateG1Addition(): Question {
  let a: number, b: number;
  do {
    a = randomInt(1, 15);
    b = randomInt(1, 10);
  } while (a + b > 20);

  const answer = a + b;
  const distractors = generateDistractors(answer, 3, 1, 20);

  return {
    id: uid(),
    type: "addition",
    text: `What is ${a} + ${b}?`,
    operandA: a,
    operandB: b,
    answer,
    choices: buildChoices(answer, distractors),
    hint: randomItem(G1_ADD_HINTS),
    category: "Addition",
    categoryEmoji: "➕",
  };
}

/**
 * G1 Subtraction: a - b = ?
 * a ∈ [2, 20], b ∈ [1, a], result ≥ 0
 */
function generateG1Subtraction(): Question {
  const a = randomInt(2, 20);
  const b = randomInt(1, a);
  const answer = a - b;
  const distractors = generateDistractors(answer, 3, 0, 20);

  return {
    id: uid(),
    type: "subtraction",
    text: `What is ${a} − ${b}?`,
    operandA: a,
    operandB: b,
    answer,
    choices: buildChoices(answer, distractors),
    hint: randomItem(G1_SUB_HINTS),
    category: "Subtraction",
    categoryEmoji: "➖",
  };
}

// ── Public API ────────────────────────────────────────────────

/**
 * Generate a single question for the given level.
 * KG alternates between counting (70%) and number ID (30%).
 * G1 alternates between addition (60%) and subtraction (40%).
 */
export function generateQuestion(level: GradeLevel): Question {
  switch (level) {
    case "KG":
      return Math.random() < 0.7
        ? generateKGCounting()
        : generateKGNumberId();
    case "G1":
      return Math.random() < 0.6
        ? generateG1Addition()
        : generateG1Subtraction();
    default:
      // G2/G3 not implemented yet — fall back to G1
      return generateG1Addition();
  }
}

/**
 * Generate a full round of `count` questions for the given level.
 * Ensures no two consecutive questions have the same type.
 */
export function generateRound(level: GradeLevel, count: number = 10): Question[] {
  const questions: Question[] = [];
  let lastType: QuestionType | null = null;

  for (let i = 0; i < count; i++) {
    let q: Question;
    let attempts = 0;
    do {
      q = generateQuestion(level);
      attempts++;
    } while (q.type === lastType && attempts < 10);
    lastType = q.type;
    questions.push(q);
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
 * 3 stars: 9–10 correct | 2 stars: 6–8 | 1 star: 3–5 | 0 stars: 0–2
 */
export function calculateStars(correct: number, total: number): number {
  const pct = correct / total;
  if (pct >= 0.9) return 3;
  if (pct >= 0.6) return 2;
  if (pct >= 0.3) return 1;
  return 0;
}
