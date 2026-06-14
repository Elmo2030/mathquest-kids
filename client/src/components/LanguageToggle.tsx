/**
 * LanguageToggle — MathQuest Kids
 * ─────────────────────────────────────────────────────────────
 * A compact EN/AR toggle button for use in headers.
 * Renders as a pill with the inactive language shown.
 * ─────────────────────────────────────────────────────────────
 */

import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface LanguageToggleProps {
  /** Visual variant: "light" for dark backgrounds, "dark" for light backgrounds */
  variant?: "light" | "dark";
  className?: string;
}

export default function LanguageToggle({
  variant = "light",
  className = "",
}: LanguageToggleProps) {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  const isLight = variant === "light";

  return (
    <motion.button
      onClick={toggleLanguage}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl select-none ${className}`}
      style={{
        fontFamily: language === "ar" ? "'Tajawal', sans-serif" : "'Fredoka One', sans-serif",
        fontSize: "0.88rem",
        background: isLight ? "oklch(0.99 0.015 85 / 0.9)" : "oklch(0.58 0.19 250)",
        color: isLight ? "oklch(0.18 0.04 270)" : "white",
        border: "2px solid oklch(0.18 0.04 270)",
        boxShadow: "2px 2px 0 oklch(0.18 0.04 270)",
        transition: "transform 0.12s ease, box-shadow 0.12s ease",
        cursor: "pointer",
      }}
      whileTap={{ scale: 0.95, y: 1 }}
      aria-label={language === "en" ? t("switchToArabic") : t("switchToEnglish")}
      title={language === "en" ? "Switch to Arabic" : "Switch to English"}
    >
      <span aria-hidden="true">🌐</span>
      <span>
        {language === "en" ? t("switchToArabic") : t("switchToEnglish")}
      </span>
    </motion.button>
  );
}
