/**
 * BubblePopFormat — Format C
 * Answer choices float around as colourful bubbles using Framer Motion.
 * The child "pops" the correct bubble.
 */
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { AnswerChoice } from "@/lib/mathEngine";
import LtrNum from "@/components/LtrNum";
import { useLanguage } from "@/contexts/LanguageContext";

interface BubbleState {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  borderColor: string;
  textColor: string;
}

const BUBBLE_PALETTE = [
  { bg: "oklch(0.75 0.22 25)",  border: "oklch(0.52 0.22 25)",  text: "white" },
  { bg: "oklch(0.68 0.22 250)", border: "oklch(0.45 0.22 250)", text: "white" },
  { bg: "oklch(0.68 0.22 145)", border: "oklch(0.45 0.22 145)", text: "white" },
  { bg: "oklch(0.82 0.18 85)",  border: "oklch(0.62 0.18 85)",  text: "oklch(0.22 0.08 65)" },
];

interface Props {
  choices: AnswerChoice[];
  selectedId: string | null;
  feedbackState: "idle" | "correct" | "wrong";
  onSelect: (id: string) => void;
  displayFont: string;
  isRTL: boolean;
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export default function BubblePopFormat({ choices, selectedId, feedbackState, onSelect, displayFont }: Props) {
  const arenaRef = useRef<HTMLDivElement>(null);
  const [bubbles, setBubbles] = useState<BubbleState[]>([]);
  const animRef = useRef<number | null>(null);
  const bubblesRef = useRef<BubbleState[]>([]);
  const [poppedId, setPoppedId] = useState<string | null>(null);

  // Initialise bubble positions once
  useEffect(() => {
    const arena = arenaRef.current;
    if (!arena) return;
    const W = arena.clientWidth || 320;
    const H = arena.clientHeight || 220;
    const R = Math.min(W, H) * 0.13 + 12;

    const initial: BubbleState[] = choices.map((c, i) => {
      const col = BUBBLE_PALETTE[i % BUBBLE_PALETTE.length];
      return {
        id: c.id,
        x: randomBetween(R, W - R),
        y: randomBetween(R, H - R),
        vx: randomBetween(-0.6, 0.6) * (Math.random() > 0.5 ? 1 : -1),
        vy: randomBetween(-0.6, 0.6) * (Math.random() > 0.5 ? 1 : -1),
        radius: R,
        color: col.bg,
        borderColor: col.border,
        textColor: col.text,
      };
    });
    setBubbles(initial);
    bubblesRef.current = initial;
  }, [choices]);

  // Animate bubbles
  useEffect(() => {
    if (feedbackState !== "idle") {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    const arena = arenaRef.current;
    if (!arena) return;

    const step = () => {
      const W = arena.clientWidth || 320;
      const H = arena.clientHeight || 220;

      bubblesRef.current = bubblesRef.current.map((b) => {
        let { x, y, vx, vy, radius } = b;
        x += vx;
        y += vy;
        if (x - radius < 0)   { x = radius;     vx = Math.abs(vx); }
        if (x + radius > W)   { x = W - radius; vx = -Math.abs(vx); }
        if (y - radius < 0)   { y = radius;     vy = Math.abs(vy); }
        if (y + radius > H)   { y = H - radius; vy = -Math.abs(vy); }
        return { ...b, x, y, vx, vy };
      });

      setBubbles([...bubblesRef.current]);
      animRef.current = requestAnimationFrame(step);
    };

    animRef.current = requestAnimationFrame(step);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [feedbackState, bubbles.length]);

  const handlePop = (choiceId: string) => {
    if (feedbackState !== "idle") return;
    setPoppedId(choiceId);
    onSelect(choiceId);
  };

  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <p style={{ fontFamily: displayFont, fontSize: "0.85rem", color: "oklch(0.45 0.08 270)", fontWeight: 600 }}>
        {t("formatBubblePopPrompt")}
      </p>
      <div
        ref={arenaRef}
        className="relative w-full rounded-2xl overflow-hidden"
        style={{
          height: "220px",
          background: "oklch(0.93 0.04 230 / 0.35)",
          border: "2.5px solid oklch(0.72 0.08 230 / 0.4)",
        }}
      >
        <AnimatePresence>
          {bubbles.map((b) => {
            const choice = choices.find((c) => c.id === b.id);
            if (!choice) return null;
            const isPopped = poppedId === b.id;
            const showCorrect = isPopped && feedbackState === "correct";
            const showWrong   = isPopped && feedbackState === "wrong";
            const revealCorrect = feedbackState !== "idle" && choice.correct && !isPopped;

            return (
              <motion.button
                key={b.id}
                onClick={() => handlePop(b.id)}
                disabled={feedbackState !== "idle"}
                style={{
                  position: "absolute",
                  left: b.x - b.radius,
                  top: b.y - b.radius,
                  width: b.radius * 2,
                  height: b.radius * 2,
                  borderRadius: "50%",
                  background: showCorrect || revealCorrect ? "oklch(0.62 0.2 145)" :
                              showWrong ? "oklch(0.62 0.22 25)" : b.color,
                  border: `3px solid ${
                    showCorrect || revealCorrect ? "oklch(0.42 0.2 145)" :
                    showWrong ? "oklch(0.42 0.22 25)" : b.borderColor
                  }`,
                  boxShadow: `0 4px 12px ${b.borderColor}88, inset 0 -3px 8px rgba(255,255,255,0.3)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: displayFont,
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: showCorrect || revealCorrect || showWrong ? "white" : b.textColor,
                  cursor: feedbackState === "idle" ? "pointer" : "default",
                  direction: "ltr",
                  zIndex: 2,
                  transition: "background 0.2s, border-color 0.2s",
                }}
                animate={
                  isPopped && feedbackState === "wrong"
                    ? { scale: [1, 1.2, 0.8, 1], x: [0, -6, 6, 0] }
                    : isPopped && feedbackState === "correct"
                    ? { scale: [1, 1.4, 0] }
                    : {}
                }
                exit={showCorrect ? { scale: 0, opacity: 0 } : {}}
                transition={{ duration: 0.4 }}
                whileHover={feedbackState === "idle" ? { scale: 1.1 } : {}}
                aria-label={`Bubble: ${choice.label}`}
              >
                <LtrNum>{choice.label}</LtrNum>
                {/* Shine highlight */}
                <span
                  style={{
                    position: "absolute",
                    top: "18%",
                    left: "20%",
                    width: "30%",
                    height: "18%",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.55)",
                    pointerEvents: "none",
                  }}
                  aria-hidden="true"
                />
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
