/**
 * MultipleChoiceFormat — Format A (Classic)
 * 4 coloured answer buttons in a 2×2 grid.
 */
import { motion } from "framer-motion";
import type { AnswerChoice } from "@/lib/mathEngine";
import LtrNum from "@/components/LtrNum";

const CHOICE_COLORS = [
  { bg: "oklch(0.62 0.22 25)",  border: "oklch(0.42 0.22 25)",  text: "white" },  // red-orange
  { bg: "oklch(0.62 0.2 250)",  border: "oklch(0.42 0.2 250)",  text: "white" },  // blue
  { bg: "oklch(0.62 0.2 145)",  border: "oklch(0.42 0.2 145)",  text: "white" },  // green
  { bg: "oklch(0.78 0.18 85)",  border: "oklch(0.58 0.18 85)",  text: "oklch(0.18 0.04 270)" }, // yellow
];

interface Props {
  choices: AnswerChoice[];
  selectedId: string | null;
  feedbackState: "idle" | "correct" | "wrong";
  onSelect: (id: string) => void;
  displayFont: string;
  isRTL: boolean;
}

export default function MultipleChoiceFormat({ choices, selectedId, feedbackState, onSelect, displayFont, isRTL }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 w-full max-w-sm mx-auto">
      {choices.map((choice, i) => {
        const col = CHOICE_COLORS[i % CHOICE_COLORS.length];
        const isSelected = selectedId === choice.id;
        const showCorrect = isSelected && feedbackState === "correct";
        const showWrong   = isSelected && feedbackState === "wrong";
        const revealCorrect = feedbackState !== "idle" && choice.correct && !isSelected;

        return (
          <motion.button
            key={choice.id}
            onClick={() => feedbackState === "idle" && onSelect(choice.id)}
            disabled={feedbackState !== "idle"}
            whileHover={feedbackState === "idle" ? { scale: 1.05, y: -2 } : {}}
            whileTap={feedbackState === "idle" ? { scale: 0.95 } : {}}
            animate={
              showWrong   ? { x: [0, -8, 8, -6, 6, 0] } :
              showCorrect ? { scale: [1, 1.12, 1] } :
              {}
            }
            transition={{ duration: 0.35 }}
            className="relative py-5 rounded-2xl text-center"
            style={{
              fontFamily: displayFont,
              fontSize: "1.35rem",
              fontWeight: 700,
              background: showCorrect || revealCorrect ? "oklch(0.62 0.2 145)" :
                          showWrong ? "oklch(0.62 0.22 25)" : col.bg,
              color: showCorrect || revealCorrect || showWrong ? "white" : col.text,
              border: `3px solid ${
                showCorrect || revealCorrect ? "oklch(0.42 0.2 145)" :
                showWrong ? "oklch(0.42 0.22 25)" : col.border
              }`,
              boxShadow: `${isRTL ? "-4px" : "4px"} 4px 0 oklch(0.18 0.04 270)`,
              cursor: feedbackState === "idle" ? "pointer" : "default",
              direction: "ltr",
            }}
            aria-label={`Answer: ${choice.label}`}
          >
            <LtrNum>{choice.label}</LtrNum>
            {showCorrect && <span className="absolute top-1 end-2 text-lg" aria-hidden="true">✅</span>}
            {showWrong   && <span className="absolute top-1 end-2 text-lg" aria-hidden="true">❌</span>}
            {revealCorrect && <span className="absolute top-1 end-2 text-lg" aria-hidden="true">✅</span>}
          </motion.button>
        );
      })}
    </div>
  );
}
