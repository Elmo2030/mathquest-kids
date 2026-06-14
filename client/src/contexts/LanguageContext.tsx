/**
 * LanguageContext — MathQuest Kids
 * ─────────────────────────────────────────────────────────────
 * Provides:
 *   language   — current language ("en" | "ar")
 *   setLanguage — switch language
 *   t          — translation helper: t("key") → string
 *   isRTL      — true when Arabic is active
 *   dir        — "rtl" | "ltr" for use on container elements
 *
 * RTL is applied at the <html> element level via a useEffect
 * so the entire document flips direction automatically.
 *
 * CRITICAL: Math equations and numbers must ALWAYS be wrapped
 * in <span dir="ltr" style={{unicodeBidi:"isolate"}}> to
 * prevent Arabic RTL context from reversing operator order.
 * Use the exported <LtrNum> helper component for this.
 * ─────────────────────────────────────────────────────────────
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { translations, en, type Language, type Translations } from "@/i18n/translations";

const LS_LANG_KEY = "mq_language_v1";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations) => string;
  isRTL: boolean;
  dir: "rtl" | "ltr";
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem(LS_LANG_KEY);
      if (stored === "ar" || stored === "en") return stored;
    } catch { /* ignore */ }
    return "en";
  });

  const isRTL = language === "ar";
  const dir = isRTL ? "rtl" : "ltr";

  // Apply dir + lang to <html> element so the entire document flips
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("dir", dir);
    html.setAttribute("lang", language);
    // Switch body font family for Arabic
    if (isRTL) {
      html.style.setProperty("--font-body", "'Tajawal', sans-serif");
      html.style.setProperty("--font-display", "'Tajawal', sans-serif");
    } else {
      html.style.setProperty("--font-body", "'Nunito', sans-serif");
      html.style.setProperty("--font-display", "'Fredoka One', sans-serif");
    }
  }, [language, dir, isRTL]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try { localStorage.setItem(LS_LANG_KEY, lang); } catch { /* ignore */ }
  }, []);

  const t = useCallback(
    (key: keyof Translations): string => translations[language][key],
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Safe fallback — returns English defaults if somehow called outside provider
const FALLBACK: LanguageContextValue = {
  language: "en",
  setLanguage: () => {},
  t: (key: keyof Translations) => en[key],
  isRTL: false,
  dir: "ltr",
};

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  // Return safe defaults instead of throwing so the app never crashes
  return ctx ?? FALLBACK;
}
