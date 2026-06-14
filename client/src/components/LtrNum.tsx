/**
 * LtrNum — MathQuest Kids
 * ─────────────────────────────────────────────────────────────
 * Wraps any math expression or number in a strictly LTR
 * isolated span so that Arabic RTL context never reverses
 * operator order (e.g. "3 + 5" must never display as "5 + 3").
 *
 * Usage:
 *   <LtrNum>{question.text}</LtrNum>
 *   <LtrNum>{score}</LtrNum>
 *
 * CRITICAL: All math equations, scores, timers, and numeric
 * labels MUST be wrapped in this component when the UI is in
 * Arabic/RTL mode. Numbers remain Western Arabic (0-9).
 * ─────────────────────────────────────────────────────────────
 */

import React from "react";

interface LtrNumProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Display mode: "inline" (default) or "block" */
  display?: "inline" | "block" | "inline-block";
}

export default function LtrNum({
  children,
  className = "",
  style,
  display = "inline",
}: LtrNumProps) {
  return (
    <span
      dir="ltr"
      className={className}
      style={{
        unicodeBidi: "isolate",
        display,
        fontVariantNumeric: "tabular-nums",
        ...style,
      }}
    >
      {children}
    </span>
  );
}
