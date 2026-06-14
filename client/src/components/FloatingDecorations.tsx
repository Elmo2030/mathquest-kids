/**
 * FloatingDecorations — MathQuest Kids
 * Animated background decorations: stars, dots, math symbols.
 * Design: Sunny Storybook — chunky, playful, hand-drawn feel.
 */

import { motion } from "framer-motion";

const DECORATIONS = [
  { id: 1, symbol: "⭐", size: "text-3xl", x: "8%",  y: "12%", delay: 0,    duration: 4.2 },
  { id: 2, symbol: "✨", size: "text-2xl", x: "88%", y: "8%",  delay: 0.8,  duration: 5.1 },
  { id: 3, symbol: "⭐", size: "text-4xl", x: "92%", y: "55%", delay: 1.5,  duration: 3.8 },
  { id: 4, symbol: "🌈", size: "text-3xl", x: "5%",  y: "65%", delay: 0.3,  duration: 6.0 },
  { id: 5, symbol: "✨", size: "text-xl",  x: "50%", y: "5%",  delay: 2.0,  duration: 4.5 },
  { id: 6, symbol: "⭐", size: "text-2xl", x: "75%", y: "88%", delay: 1.2,  duration: 5.5 },
  { id: 7, symbol: "☁️", size: "text-4xl", x: "20%", y: "90%", delay: 0.6,  duration: 7.0 },
  { id: 8, symbol: "✨", size: "text-3xl", x: "65%", y: "15%", delay: 1.8,  duration: 4.0 },
  { id: 9, symbol: "⭐", size: "text-xl",  x: "35%", y: "82%", delay: 0.4,  duration: 5.8 },
  { id: 10,symbol: "☁️", size: "text-3xl", x: "80%", y: "30%", delay: 2.5,  duration: 6.5 },
];

interface FloatingDecorationsProps {
  density?: "low" | "medium" | "high";
}

export default function FloatingDecorations({
  density = "medium",
}: FloatingDecorationsProps) {
  const items =
    density === "low"
      ? DECORATIONS.slice(0, 4)
      : density === "high"
      ? DECORATIONS
      : DECORATIONS.slice(0, 7);

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {items.map((d) => (
        <motion.div
          key={d.id}
          className={`absolute select-none ${d.size}`}
          style={{ left: d.x, top: d.y }}
          animate={{
            y: [0, -14, -7, 0],
            rotate: [0, 4, -3, 0],
          }}
          transition={{
            duration: d.duration,
            delay: d.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {d.symbol}
        </motion.div>
      ))}
    </div>
  );
}
