/**
 * MathGate — MathQuest Kids
 * i18n: Full EN/AR support with RTL layout switching.
 * CRITICAL: The math question text is always rendered dir="ltr"
 * so expressions like "12 + 15" never visually reorder in RTL mode.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface GateQuestion {
  text: string;
  answer: number;
}

// Pool of adult-friendly arithmetic questions (Western numerals only)
const GATE_QUESTIONS: GateQuestion[] = [
  { text: "12 + 15 = ?",   answer: 27  },
  { text: "34 + 28 = ?",   answer: 62  },
  { text: "47 − 19 = ?",   answer: 28  },
  { text: "8 × 7 = ?",     answer: 56  },
  { text: "9 × 6 = ?",     answer: 54  },
  { text: "63 ÷ 9 = ?",    answer: 7   },
  { text: "15 + 37 = ?",   answer: 52  },
  { text: "100 − 43 = ?",  answer: 57  },
  { text: "6 × 8 = ?",     answer: 48  },
  { text: "72 ÷ 8 = ?",    answer: 9   },
  { text: "25 + 48 = ?",   answer: 73  },
  { text: "56 − 27 = ?",   answer: 29  },
  { text: "7 × 9 = ?",     answer: 63  },
  { text: "81 ÷ 9 = ?",    answer: 9   },
  { text: "44 + 38 = ?",   answer: 82  },
];

function pickQuestion(): GateQuestion {
  return GATE_QUESTIONS[Math.floor(Math.random() * GATE_QUESTIONS.length)];
}

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

interface MathGateProps {
  onSuccess: () => void;
  onDismiss: () => void;
}

export default function MathGate({ onSuccess, onDismiss }: MathGateProps) {
  const { t, isRTL } = useLanguage();
  const [question, setQuestion] = useState<GateQuestion>(pickQuestion);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "wrong" | "success">("idle");
  const [shakeTick, setShakeTick] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayFont = isRTL ? "'Tajawal', sans-serif" : "'Fredoka One', sans-serif";
  const bodyFont    = isRTL ? "'Tajawal', sans-serif" : "'Nunito', sans-serif";

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const handleWrong = useCallback(() => {
    setStatus("wrong");
    setShakeTick((t) => t + 1);
    setTimeout(() => {
      setQuestion(pickQuestion());
      setInput("");
      setStatus("idle");
    }, 1200);
  }, []);

  const handleSubmit = useCallback(() => {
    const parsed = parseInt(input.trim(), 10);
    if (isNaN(parsed)) { handleWrong(); return; }
    if (parsed === question.answer) {
      setStatus("success");
      setTimeout(onSuccess, 600);
    } else {
      handleWrong();
    }
  }, [input, question.answer, handleWrong, onSuccess]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleSubmit();
      if (e.key === "Escape") onDismiss();
    },
    [handleSubmit, onDismiss]
  );

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="gate-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "oklch(0.18 0.04 270 / 0.65)", backdropFilter: "blur(6px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => { if (e.target === e.currentTarget) onDismiss(); }}
        aria-modal="true"
        role="dialog"
        aria-labelledby="gate-title"
      >
        {/* Card */}
        <motion.div
          key={`gate-card-${shakeTick}`}
          className="relative w-full max-w-sm"
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={
            status === "wrong"
              ? { scale: 1, opacity: 1, y: 0, x: [0, -10, 10, -8, 8, -4, 4, 0] }
              : { scale: 1, opacity: 1, y: 0, x: 0 }
          }
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={status === "wrong" ? { duration: 0.5, ease: "easeInOut" } : { duration: 0.35, ease }}
          style={{
            background: "oklch(0.99 0.025 85)",
            border: "3px solid oklch(0.18 0.04 270)",
            boxShadow: `${isRTL ? "-6px" : "6px"} 6px 0 oklch(0.18 0.04 270)`,
            borderRadius: "1.5rem",
            overflow: "hidden",
          }}
        >
          {/* Header band */}
          <div
            className="px-6 pt-5 pb-4 text-center"
            style={{ background: "oklch(0.58 0.19 250)", borderBottom: "3px solid oklch(0.18 0.04 270)" }}
          >
            <div className="text-4xl mb-1" aria-hidden="true">👨‍👩‍👧</div>
            <h2
              id="gate-title"
              style={{ fontFamily: displayFont, fontSize: "1.4rem", color: "white", textShadow: "2px 2px 0 oklch(0.18 0.04 270 / 0.3)" }}
            >
              {t("gateTitle")}
            </h2>
            <p style={{ fontFamily: bodyFont, fontWeight: 700, fontSize: "0.85rem", color: "oklch(0.92 0.04 250)", marginTop: "0.25rem" }}>
              {t("gateSubtitle")}
            </p>
          </div>

          {/* Body */}
          <div className="px-6 py-6 flex flex-col gap-5">
            {/* Question display — ALWAYS dir="ltr" for math expressions */}
            <div
              className="text-center py-4 px-4 rounded-2xl"
              style={{
                background: status === "wrong" ? "oklch(0.95 0.04 25)" : status === "success" ? "oklch(0.92 0.06 145)" : "oklch(0.96 0.025 90)",
                border: `2.5px solid ${status === "wrong" ? "oklch(0.62 0.22 25)" : status === "success" ? "oklch(0.65 0.2 145)" : "oklch(0.18 0.04 270 / 0.2)"}`,
                transition: "background 0.3s ease, border-color 0.3s ease",
              }}
            >
              {/* The math expression is always LTR — critical for Arabic RTL mode */}
              <p
                className="math-equation"
                dir="ltr"
                style={{ fontFamily: "'Fredoka One', sans-serif", fontSize: "1.6rem", color: "oklch(0.18 0.04 270)", lineHeight: 1.2 }}
              >
                {question.text}
              </p>
              {status === "wrong" && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ fontFamily: displayFont, fontSize: "0.9rem", color: "oklch(0.5 0.22 25)", marginTop: "0.25rem" }}
                >
                  {t("gateWrong")}
                </motion.p>
              )}
              {status === "success" && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ fontFamily: displayFont, fontSize: "0.9rem", color: "oklch(0.38 0.18 145)", marginTop: "0.25rem" }}
                >
                  {t("gateSuccess")}
                </motion.p>
              )}
            </div>

            {/* Input row */}
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("gateAnswerPlaceholder")}
                disabled={status === "success"}
                className="flex-1 text-center text-xl rounded-xl px-4 py-3 outline-none"
                style={{
                  fontFamily: "'Fredoka One', sans-serif",
                  background: "white",
                  border: `2.5px solid ${status === "wrong" ? "oklch(0.62 0.22 25)" : "oklch(0.18 0.04 270 / 0.3)"}`,
                  color: "oklch(0.18 0.04 270)",
                  boxShadow: "inset 0 2px 4px oklch(0.18 0.04 270 / 0.06)",
                  transition: "border-color 0.2s ease",
                  // Input numbers are always LTR
                  direction: "ltr",
                }}
                aria-label={t("gateAnswerPlaceholder")}
              />
              <motion.button
                onClick={handleSubmit}
                disabled={status === "success" || input.trim() === ""}
                className="px-5 py-3 rounded-xl"
                style={{
                  fontFamily: displayFont,
                  fontSize: "1rem",
                  background: "oklch(0.58 0.19 250)",
                  color: "white",
                  border: "2.5px solid oklch(0.18 0.04 270)",
                  boxShadow: `${isRTL ? "-3px" : "3px"} 3px 0 oklch(0.18 0.04 270)`,
                  opacity: input.trim() === "" ? 0.5 : 1,
                  transition: "opacity 0.15s ease",
                }}
                whileTap={{ scale: 0.95, y: 2 }}
                aria-label={t("gateSubmit")}
              >
                {t("gateSubmit")}
              </motion.button>
            </div>

            {/* Dismiss link */}
            <button
              onClick={onDismiss}
              className="text-center text-sm"
              style={{ fontFamily: bodyFont, fontWeight: 700, color: "oklch(0.55 0.04 270)", textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}
              aria-label={t("gateGoBack")}
            >
              {t("gateGoBack")}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
