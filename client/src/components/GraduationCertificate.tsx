/**
 * GraduationCertificate — MathQuest Kids
 * ─────────────────────────────────────────────────────────────
 * Design: Sunny Storybook — premium certificate variant
 * A beautifully designed, printable A4-landscape certificate
 * awarded upon completing all Grade 3 sub-levels.
 *
 * Features:
 *  - Triple golden border frame with corner ornaments
 *  - Achievement ribbon/medal badge
 *  - Dynamic child name, current date
 *  - Bilingual EN/AR with RTL layout switching
 *  - Western numerals enforced via dir="ltr" spans
 *  - Print-optimised: @media print hides everything except cert
 *  - Landscape A4 forced via @page CSS
 *  - Background colours, borders, shadows preserved in print
 * ─────────────────────────────────────────────────────────────
 */

import { useRef } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  childName: string;
  totalStars: number;
  onClose: () => void;
}

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

/** Format today's date in a readable way, respecting locale */
function formatDate(language: "en" | "ar"): string {
  const now = new Date();
  if (language === "ar") {
    // Arabic long date — but keep numerals Western
    const day   = now.getDate();
    const year  = now.getFullYear();
    const monthsAr = [
      "يناير","فبراير","مارس","أبريل","مايو","يونيو",
      "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر",
    ];
    return `${day} ${monthsAr[now.getMonth()]} ${year}`;
  }
  return now.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function GraduationCertificate({ childName, totalStars, onClose }: Props) {
  const { language, isRTL } = useLanguage();
  const certRef = useRef<HTMLDivElement>(null);

  const isAr = language === "ar";
  const displayFont = isAr ? "'Tajawal', sans-serif" : "'Fredoka One', cursive";
  const bodyFont    = isAr ? "'Tajawal', sans-serif" : "'Nunito', sans-serif";
  const serifFont   = isAr ? "'Tajawal', sans-serif" : "'Georgia', 'Times New Roman', serif";
  const dateStr     = formatDate(language);

  // ── Copy strings ──────────────────────────────────────────
  const certTitle   = isAr ? "شهادة تفوق في الرياضيات" : "Certificate of Mathematics Excellence";
  const certPresented = isAr
    ? "تُقدَّم بفخر إلى"
    : "Proudly Presented To";
  const certBody    = isAr
    ? `لإتمامه بنجاح جميع تحديات الرياضيات من مرحلة رياض الأطفال حتى الصف 3`
    : `For successfully mastering all mathematics challenges\nfrom Kindergarten to Grade 3`;
  const certDateLabel = isAr ? "التاريخ:" : "Date:";
  const certStarsLabel = isAr ? "النجوم المكتسبة:" : "Stars Earned:";
  const certSignLeft  = isAr ? "د. يحيى\nالمصمم الرئيسي" : "Dr. Yehia\nChief Designer";
  const certSignRight = isAr ? "أكاديمية فرس\nwww.faras.ly"   : "Faras Academy\nwww.faras.ly";
  const printLabel    = isAr ? "🖨️ اطبع الشهادة" : "🖨️ Print Certificate";
  const closeLabel    = isAr ? "← رجوع" : "← Back";
  const poweredBy     = isAr ? "مدعوم من فرس | www.faras.ly" : "Powered by Faras | www.faras.ly";

  const handlePrint = () => window.print();

  return (
    <>
      {/* ── Print-only global styles injected via <style> ── */}
      <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }
          /* Hide everything on the page */
          body > * { display: none !important; }
          /* Show only the certificate overlay */
          #cert-print-root { display: flex !important; }
          /* Preserve colours */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      {/* ── Full-screen overlay (screen only) ── */}
      <motion.div
        id="cert-print-root"
        className="fixed inset-0 z-[200] flex flex-col items-center justify-start overflow-y-auto"
        style={{ background: "oklch(0.14 0.06 270 / 0.92)", backdropFilter: "blur(6px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease }}
      >
        {/* ── Screen-only action bar ── */}
        <div
          className="no-print flex items-center justify-between w-full max-w-5xl px-6 py-4 gap-4 flex-wrap"
          style={{ flexShrink: 0 }}
        >
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-base font-bold"
            style={{
              fontFamily: displayFont,
              background: "oklch(0.25 0.04 270)",
              color: "oklch(0.88 0.04 270)",
              border: "2px solid oklch(0.45 0.04 270)",
              cursor: "pointer",
            }}
          >
            {closeLabel}
          </button>

          <motion.button
            onClick={handlePrint}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="px-8 py-3 rounded-2xl text-lg font-bold"
            style={{
              fontFamily: displayFont,
              background: "linear-gradient(135deg, oklch(0.78 0.18 85), oklch(0.68 0.2 65))",
              color: "oklch(0.18 0.04 270)",
              border: "3px solid oklch(0.18 0.04 270)",
              boxShadow: "4px 4px 0 oklch(0.18 0.04 270)",
              cursor: "pointer",
            }}
          >
            {printLabel}
          </motion.button>
        </div>

        {/* ── Certificate paper ── */}
        <motion.div
          ref={certRef}
          id="certificate-paper"
          dir={isRTL ? "rtl" : "ltr"}
          initial={{ y: 40, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5, ease }}
          className="relative mx-auto mb-10"
          style={{
            /* A4 landscape proportions at screen scale */
            width: "min(96vw, 900px)",
            aspectRatio: "297 / 210",
            background: "linear-gradient(145deg, oklch(0.99 0.025 90) 0%, oklch(0.97 0.04 85) 40%, oklch(0.99 0.015 65) 100%)",
            /* Outer border */
            border: "6px solid oklch(0.68 0.18 85)",
            borderRadius: "12px",
            boxShadow: "0 0 0 3px oklch(0.18 0.04 270), 0 24px 64px oklch(0.18 0.04 270 / 0.6)",
            padding: "clamp(1.5rem, 3vw, 2.5rem)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* ── Decorative inner border ── */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: "10px",
              border: "2.5px solid oklch(0.78 0.18 85 / 0.55)",
              borderRadius: "8px",
              pointerEvents: "none",
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: "16px",
              border: "1px dashed oklch(0.78 0.18 85 / 0.35)",
              borderRadius: "6px",
              pointerEvents: "none",
            }}
          />

          {/* ── Corner ornaments ── */}
          {[
            { top: "6px",   left: "6px",   rotate: "0deg" },
            { top: "6px",   right: "6px",  rotate: "90deg" },
            { bottom: "6px",left: "6px",   rotate: "270deg" },
            { bottom: "6px",right: "6px",  rotate: "180deg" },
          ].map((pos, i) => (
            <svg
              key={i}
              aria-hidden="true"
              width="36" height="36"
              viewBox="0 0 36 36"
              style={{ position: "absolute", ...pos, transform: `rotate(${pos.rotate})` }}
            >
              <path d="M2 2 L14 2 L2 14 Z" fill="oklch(0.68 0.18 85)" />
              <path d="M2 2 L20 2 Q2 2 2 20" fill="none" stroke="oklch(0.68 0.18 85)" strokeWidth="1.5" />
              <circle cx="4" cy="4" r="2" fill="oklch(0.68 0.18 85)" />
            </svg>
          ))}

          {/* ── Watermark ── */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "clamp(6rem, 18vw, 12rem)",
              opacity: 0.04,
              pointerEvents: "none",
              userSelect: "none",
              lineHeight: 1,
            }}
          >
            🏆
          </div>

          {/* ── TOP: Header row ── */}
          <div style={{ textAlign: "center", position: "relative", zIndex: 1, width: "100%" }}>
            {/* Medal badge */}
            <div style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", lineHeight: 1, marginBottom: "0.3em" }}>
              🎓🏅
            </div>

            {/* Main title */}
            <h1
              style={{
                fontFamily: serifFont,
                fontSize: "clamp(1.1rem, 2.8vw, 1.9rem)",
                fontWeight: 700,
                color: "oklch(0.42 0.15 65)",
                letterSpacing: isAr ? "0.02em" : "0.06em",
                textTransform: isAr ? "none" : "uppercase",
                lineHeight: 1.2,
                marginBottom: "0.15em",
                textShadow: "0 1px 0 oklch(0.88 0.08 85 / 0.8)",
              }}
            >
              {certTitle}
            </h1>

            {/* Decorative rule */}
            <div
              style={{
                margin: "0.4em auto 0",
                width: "clamp(120px, 40%, 280px)",
                height: "3px",
                background: "linear-gradient(90deg, transparent, oklch(0.68 0.18 85), oklch(0.78 0.2 55), oklch(0.68 0.18 85), transparent)",
                borderRadius: "2px",
              }}
            />
          </div>

          {/* ── MIDDLE: Recipient block ── */}
          <div style={{ textAlign: "center", position: "relative", zIndex: 1, width: "100%", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.4em" }}>
            <p
              style={{
                fontFamily: bodyFont,
                fontSize: "clamp(0.75rem, 1.6vw, 1rem)",
                color: "oklch(0.45 0.08 270)",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: isAr ? "none" : "uppercase",
              }}
            >
              {certPresented}
            </p>

            {/* Child's name — the star of the show */}
            <div
              style={{
                fontFamily: displayFont,
                fontSize: "clamp(1.6rem, 5vw, 3rem)",
                fontWeight: 700,
                color: "oklch(0.32 0.12 270)",
                lineHeight: 1.1,
                padding: "0.15em 1.2em",
                background: "oklch(0.97 0.06 85 / 0.6)",
                border: "2px solid oklch(0.78 0.18 85 / 0.7)",
                borderRadius: "8px",
                boxShadow: "0 2px 12px oklch(0.78 0.18 85 / 0.25)",
                maxWidth: "90%",
                wordBreak: "break-word",
              }}
            >
              {childName || (isAr ? "البطل الصغير" : "Young Champion")}
            </div>

            {/* Body text */}
            <p
              style={{
                fontFamily: bodyFont,
                fontSize: "clamp(0.65rem, 1.4vw, 0.9rem)",
                color: "oklch(0.38 0.06 270)",
                fontWeight: 500,
                lineHeight: 1.55,
                maxWidth: "55ch",
                whiteSpace: "pre-line",
                textAlign: "center",
              }}
            >
              {certBody}
            </p>

            {/* Stars row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4em",
                fontFamily: bodyFont,
                fontSize: "clamp(0.65rem, 1.3vw, 0.85rem)",
                color: "oklch(0.45 0.12 65)",
                fontWeight: 700,
              }}
            >
              <span>{certStarsLabel}</span>
              <span dir="ltr" style={{ color: "oklch(0.62 0.2 65)", fontSize: "1.1em" }}>
                {"⭐".repeat(Math.min(totalStars, 5))} {totalStars}
              </span>
            </div>
          </div>

          {/* ── BOTTOM: Date + Signatures ── */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            {/* Date */}
            <div style={{ textAlign: isRTL ? "right" : "left", minWidth: "8rem" }}>
              <p
                style={{
                  fontFamily: bodyFont,
                  fontSize: "clamp(0.6rem, 1.2vw, 0.78rem)",
                  color: "oklch(0.52 0.06 270)",
                  fontWeight: 600,
                  marginBottom: "0.2em",
                }}
              >
                {certDateLabel}
              </p>
              <p
                style={{
                  fontFamily: bodyFont,
                  fontSize: "clamp(0.65rem, 1.3vw, 0.82rem)",
                  color: "oklch(0.32 0.08 270)",
                  fontWeight: 700,
                  direction: "ltr",
                }}
              >
                {dateStr}
              </p>
              {/* Underline */}
              <div style={{ marginTop: "0.3em", height: "1.5px", background: "oklch(0.68 0.18 85 / 0.6)", borderRadius: "1px" }} />
            </div>

            {/* Central seal */}
            <div style={{ textAlign: "center", flex: "0 0 auto" }}>
              <div
                style={{
                  width: "clamp(3rem, 7vw, 5rem)",
                  height: "clamp(3rem, 7vw, 5rem)",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, oklch(0.78 0.18 85), oklch(0.62 0.2 65))",
                  border: "3px solid oklch(0.42 0.15 65)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "clamp(1.4rem, 3.5vw, 2.2rem)",
                  boxShadow: "0 2px 12px oklch(0.68 0.18 85 / 0.4)",
                  margin: "0 auto",
                }}
              >
                🌟
              </div>
            </div>

            {/* Signatures */}
            <div
              style={{
                display: "flex",
                gap: "clamp(1rem, 4vw, 3rem)",
                alignItems: "flex-end",
              }}
            >
              {/* Left signer */}
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    height: "1.5px",
                    background: "oklch(0.68 0.18 85 / 0.6)",
                    marginBottom: "0.3em",
                    borderRadius: "1px",
                    minWidth: "clamp(4rem, 10vw, 7rem)",
                  }}
                />
                <p
                  style={{
                    fontFamily: bodyFont,
                    fontSize: "clamp(0.55rem, 1.1vw, 0.72rem)",
                    color: "oklch(0.35 0.06 270)",
                    fontWeight: 700,
                    whiteSpace: "pre-line",
                    lineHeight: 1.4,
                  }}
                >
                  {certSignLeft}
                </p>
              </div>

              {/* Right signer */}
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    height: "1.5px",
                    background: "oklch(0.68 0.18 85 / 0.6)",
                    marginBottom: "0.3em",
                    borderRadius: "1px",
                    minWidth: "clamp(4rem, 10vw, 7rem)",
                  }}
                />
                <p
                  style={{
                    fontFamily: bodyFont,
                    fontSize: "clamp(0.55rem, 1.1vw, 0.72rem)",
                    color: "oklch(0.35 0.06 270)",
                    fontWeight: 700,
                    whiteSpace: "pre-line",
                    lineHeight: 1.4,
                  }}
                >
                  {certSignRight}
                </p>
              </div>
            </div>
          </div>

          {/* ── Agency branding footer (bottom edge of cert) ── */}
          <div
            style={{
              position: "absolute",
              bottom: "22px",
              left: "50%",
              transform: "translateX(-50%)",
              fontFamily: bodyFont,
              fontSize: "clamp(0.5rem, 0.9vw, 0.62rem)",
              color: "oklch(0.62 0.06 270 / 0.7)",
              letterSpacing: "0.06em",
              whiteSpace: "nowrap",
              zIndex: 2,
            }}
          >
            {poweredBy}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
