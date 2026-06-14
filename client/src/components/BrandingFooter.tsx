/**
 * BrandingFooter — MathQuest Kids
 * ─────────────────────────────────────────────────────────────
 * Unobtrusive attribution footer shown on the Home Screen and
 * Parents Dashboard. Adapts to RTL layout automatically.
 * ─────────────────────────────────────────────────────────────
 */

import { useLanguage } from "@/contexts/LanguageContext";

export default function BrandingFooter() {
  const { isRTL } = useLanguage();
  const bodyFont = isRTL ? "'Tajawal', sans-serif" : "'Nunito', sans-serif";

  return (
    <footer
      className="w-full py-3 px-4 flex items-center justify-center gap-1.5 flex-wrap"
      style={{
        borderTop: "1.5px solid oklch(0.18 0.04 270 / 0.08)",
        background: "oklch(0.18 0.04 270 / 0.03)",
      }}
      aria-label="Site attribution"
    >
      <span
        style={{
          fontFamily: bodyFont,
          fontSize: "0.72rem",
          color: "oklch(0.52 0.04 270)",
          letterSpacing: "0.01em",
        }}
      >
        Designed by{" "}
        <span style={{ fontWeight: 700, color: "oklch(0.40 0.04 270)" }}>
          Dr. Yehia
        </span>
      </span>

      {/* Separator dot */}
      <span
        aria-hidden="true"
        style={{ color: "oklch(0.70 0.04 270)", fontSize: "0.6rem" }}
      >
        •
      </span>

      <span
        style={{
          fontFamily: bodyFont,
          fontSize: "0.72rem",
          color: "oklch(0.52 0.04 270)",
          letterSpacing: "0.01em",
        }}
      >
        Powered by{" "}
        <a
          href="https://faras.ly"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontWeight: 700,
            color: "oklch(0.40 0.19 250)",
            textDecoration: "none",
            borderBottom: "1px solid oklch(0.58 0.19 250 / 0.35)",
            paddingBottom: "1px",
            transition: "color 0.15s ease, border-color 0.15s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = "oklch(0.52 0.19 250)";
            (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = "oklch(0.58 0.19 250 / 0.8)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = "oklch(0.40 0.19 250)";
            (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = "oklch(0.58 0.19 250 / 0.35)";
          }}
          aria-label="Faras agency website (opens in new tab)"
        >
          Faras
        </a>
        {" | "}
        <a
          href="https://faras.ly"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "oklch(0.58 0.04 270)",
            textDecoration: "none",
            fontSize: "0.68rem",
            transition: "color 0.15s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = "oklch(0.40 0.19 250)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = "oklch(0.58 0.04 270)";
          }}
          aria-label="www.faras.ly (opens in new tab)"
        >
          www.faras.ly
        </a>
      </span>
    </footer>
  );
}
