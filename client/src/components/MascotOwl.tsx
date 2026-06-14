/**
 * MascotOwl — MathQuest Kids
 * The game mascot: a cheerful owl with a graduation cap.
 * Supports idle float animation and emotional states.
 * Design: Sunny Storybook
 */

import { motion, type Transition } from "framer-motion";

export type MoodType = "idle" | "happy" | "thinking" | "celebrate" | "oops";

interface MascotOwlProps {
  mood?: MoodType;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm:  "w-20 h-20",
  md:  "w-32 h-32",
  lg:  "w-44 h-44",
  xl:  "w-56 h-56",
};

const t = (overrides: Partial<Transition>): Transition => ({
  ease: "easeInOut" as const,
  ...overrides,
});

const moodVariants = {
  idle: {
    y: [0, -10, 0],
    rotate: [0, 2, -2, 0],
    transition: t({ duration: 4, repeat: Infinity }),
  },
  happy: {
    y: [0, -16, 0, -12, 0],
    rotate: [0, 5, -5, 3, 0],
    transition: t({ duration: 0.8, repeat: 2 }),
  },
  thinking: {
    rotate: [-5, 5, -5],
    transition: t({ duration: 1.5, repeat: Infinity }),
  },
  celebrate: {
    y: [0, -24, 0, -18, 0],
    rotate: [0, 10, -10, 8, 0],
    scale: [1, 1.15, 1, 1.1, 1],
    transition: t({ duration: 0.6, repeat: 3 }),
  },
  oops: {
    x: [-8, 8, -6, 6, 0],
    transition: t({ duration: 0.4 }),
  },
};

export default function MascotOwl({
  mood = "idle",
  size = "lg",
  className = "",
}: MascotOwlProps) {
  return (
    <motion.div
      className={`${sizeMap[size]} ${className} select-none`}
      animate={moodVariants[mood]}
      style={{ display: "inline-block" }}
    >
      <img
        src="https://d2xsxph8kpxj0f.cloudfront.net/310419663029442648/HuT9LUnwcUFmp6Xsie23M7/mascot-owl-NPKjgs9ScVD3T38BAxSzxo.webp"
        alt="Ollie the Math Owl mascot"
        className="w-full h-full object-contain drop-shadow-lg"
        draggable={false}
      />
    </motion.div>
  );
}
