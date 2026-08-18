/**
 * FillTheGapFormat — Format B
 * Shows an equation with a "[ ? ]" gap.
 * The user selects the number that fills the blank.
 * Works for addition, subtraction, multiplication, division.
 * For KG counting/fraction questions, falls back to MultipleChoice.
 */
import { motion } from "framer-motion";
import type { AnswerChoice, Question } from "@/lib/mathEngine";
import LtrNum from "@/components/LtrNum";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  question: Question;
  choices: AnswerChoice[];
  selectedId: string | null;
  feedbackState: "idle" | "correct" | "wrong";
  onSelect: (id: string) => void;
  displayFont: string;
  bodyFont: string;
  isRTL: boolean;
}

/** Build the gap equation string, returning parts: left, operator, right, equals, result */
function buildGapEquation(q: Question): { left: string; op: string; right: string; eq: string; result: string } | null {
  const { operandA: a, operandB: b, answer, type } = q;
  if (a === undefined || b === undefined) return null;

  // Randomly decide which position to blank: left operand, right operand, or result
  // For KG/fraction types, return null to fall back
  if (type === "counting" || type === "number_id" || type === "fraction") return null;

  // Use a seeded choice based on question id to be deterministic per question
  const seed = q.id.charCodeAt(0) % 3; // 0=blank left, 1=blank right, 2=blank result

  switch (type) {
    case "addition_easy":
    case "addition_hard":
      if (seed === 0) return { left: "?", op: "+", right: String(b), eq: "=", result: String(answer) };
      if (seed === 1) return { left: String(a), op: "+", right: "?", eq: "=", result: String(answer) };
      return { left: String(a), op: "+", right: String(b), eq: "=", result: "?" };

    case "subtraction_easy":
    case "subtraction_hard":
      if (seed === 0) return { left: "?", op: "−", right: String(b), eq: "=", result: String(answer) };
      if (seed === 1) return { left: String(a), op: "−", right: "?", eq: "=", result: String(answer) };
      return { left: String(a), op: "−", right: String(b), eq: "=", result: "?" };

    case "multiplication_basic":
    case "multiplication_full":
      if (seed === 0) return { left: "?", op: "×", right: String(b), eq: "=", result: String(answer) };
      if (seed === 1) return { left: String(a), op: "×", right: "?", eq: "=", result: String(answer) };
      return { left: String(a), op: "×", right: String(b), eq: "=", result: "?" };

    case "division":
      // a ÷ b = c → only blank the result (c) to keep it simple
      return { left: String(a), op: "÷", right: String(b), eq: "=", result: "?" };

    default:
      return null;
  }
}

const CHIP_COLORS = [
  { bg: "oklch(0.93 0.08 25)",  border: "oklch(0.62 0.22 25)",  text: "oklch(0.28 0.12 25)" },
  { bg: "oklch(0.88 0.1 250)",  border: "oklch(0.55 0.2 250)",  text: "oklch(0.22 0.1 250)" },
  { bg: "oklch(0.88 0.1 145)",  border: "oklch(0.55 0.2 145)",  text: "oklch(0.22 0.1 145)" },
  { bg: "oklch(0.97 0.12 85)",  border: "oklch(0.78 0.18 85)",  text: "oklch(0.28 0.1 65)" },
];

export default function FillTheGapFormat({ question, choices, selectedId, feedbackState, onSelect, displayFont, isRTL }: Props) {
  const { t } = useLanguage();
  const eq = buildGapEquation(question);

  // Fallback: if we can't build a gap equation, render as simple chips
  if (!eq) {
    return (
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm mx-auto">
        {choices.map((choice, i) => {
          const col = CHIP_COLORS[i % CHIP_COLORS.length];
          const isSelected = selectedId === choice.id;
          const showCorrect = isSelected && feedbackState === "correct";
          const showWrong   = isSelected && feedbackState === "wrong";
          return (
            <motion.button
              key={choice.id}
              onClick={() => feedbackState === "idle" && onSelect(choice.id)}
              disabled={feedbackState !== "idle"}
              whileHover={feedbackState === "idle" ? { scale: 1.05 } : {}}
              whileTap={feedbackState === "idle" ? { scale: 0.95 } : {}}
              animate={showWrong ? { x: [0, -8, 8, -6, 6, 0] } : showCorrect ? { scale: [1, 1.12, 1] } : {}}
              className="py-5 rounded-2xl text-center"
              style={{
                fontFamily: displayFont, fontSize: "1.35rem", fontWeight: 700,
                background: showCorrect ? "oklch(0.62 0.2 145)" : showWrong ? "oklch(0.62 0.22 25)" : col.bg,
                color: showCorrect || showWrong ? "white" : col.text,
                border: `3px solid ${showCorrect ? "oklch(0.42 0.2 145)" : showWrong ? "oklch(0.42 0.22 25)" : col.border}`,
                boxShadow: `${isRTL ? "-4px" : "4px"} 4px 0 oklch(0.18 0.04 270)`,
                direction: "ltr",
              }}
            >
              <LtrNum>{choice.label}</LtrNum>
            </motion.button>
          );
        })}
      </div>
    );
  }

  const parts = [eq.left, eq.op, eq.right, eq.eq, eq.result];

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {/* Equation display */}
      <motion.div
        className="flex items-center justify-center gap-2 flex-wrap"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ direction: "ltr" }}
      >
        {parts.map((part, i) => {
          const isGap = part === "?";
          const isOperator = ["+", "−", "×", "÷", "="].includes(part);
          return (
            <motion.span
              key={i}
              animate={isGap ? { scale: [1, 1.08, 1] } : {}}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="flex items-center justify-center rounded-xl"
              style={{
                fontFamily: displayFont,
                fontSize: isOperator ? "1.6rem" : "2rem",
                fontWeight: 700,
                minWidth: isGap ? "3.5rem" : isOperator ? "auto" : "2.8rem",
                height: isGap ? "3.5rem" : "auto",
                background: isGap ? "oklch(0.97 0.12 85)" : "transparent",
                border: isGap ? "3px dashed oklch(0.78 0.18 85)" : "none",
                color: isGap ? "oklch(0.35 0.12 65)" :
                       isOperator ? "oklch(0.45 0.15 270)" : "oklch(0.18 0.04 270)",
                boxShadow: isGap ? "inset 0 2px 6px oklch(0.78 0.18 85 / 0.3)" : "none",
                padding: isGap ? "0 0.5rem" : "0",
              }}
            >
              {isGap ? "?" : <LtrNum>{part}</LtrNum>}
            </motion.span>
          );
        })}
      </motion.div>

      {/* Hint label */}
      <p style={{ fontFamily: displayFont, fontSize: "0.9rem", color: "oklch(0.45 0.08 270)", fontWeight: 600 }}>
        {t("formatFillGapPrompt")}
      </p>

      {/* Answer chips */}
      <div className="flex flex-wrap justify-center gap-3 w-full max-w-sm">
        {choices.map((choice, i) => {
          const col = CHIP_COLORS[i % CHIP_COLORS.length];
          const isSelected = selectedId === choice.id;
          const showCorrect = isSelected && feedbackState === "correct";
          const showWrong   = isSelected && feedbackState === "wrong";
          const revealCorrect = feedbackState !== "idle" && choice.correct && !isSelected;

          return (
            <motion.button
              key={choice.id}
              onClick={() => feedbackState === "idle" && onSelect(choice.id)}
              disabled={feedbackState !== "idle"}
              whileHover={feedbackState === "idle" ? { scale: 1.08, y: -3 } : {}}
              whileTap={feedbackState === "idle" ? { scale: 0.92 } : {}}
              animate={showWrong ? { x: [0, -8, 8, -6, 6, 0] } : showCorrect ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 0.35 }}
              className="rounded-2xl px-6 py-4 text-xl font-bold"
              style={{
                fontFamily: displayFont,
                background: showCorrect || revealCorrect ? "oklch(0.62 0.2 145)" : showWrong ? "oklch(0.62 0.22 25)" : col.bg,
                color: showCorrect || revealCorrect || showWrong ? "white" : col.text,
                border: `3px solid ${showCorrect || revealCorrect ? "oklch(0.42 0.2 145)" : showWrong ? "oklch(0.42 0.22 25)" : col.border}`,
                boxShadow: `${isRTL ? "-4px" : "4px"} 4px 0 oklch(0.18 0.04 270)`,
                direction: "ltr",
                minWidth: "4.5rem",
              }}
              aria-label={`${isRTL ? "الإجابة" : "Answer"}: ${choice.label}`}
            >
              <LtrNum>{choice.label}</LtrNum>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
