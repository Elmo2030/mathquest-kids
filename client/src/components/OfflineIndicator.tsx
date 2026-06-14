/**
 * OfflineIndicator
 *
 * A subtle animated banner that slides in from the top when the device
 * loses its internet connection and slides out when it reconnects.
 * Uses the usePWA hook for live online/offline status.
 */

import { usePWA } from "@/hooks/usePWA";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatePresence, motion } from "framer-motion";
import { WifiOff } from "lucide-react";

export function OfflineIndicator() {
  const { isOnline } = usePWA();
  const { t, isRTL } = useLanguage();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          key="offline-banner"
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-center gap-2 px-4 py-2"
          style={{
            background: "oklch(0.35 0.08 25)",
            color: "white",
            fontFamily: isRTL ? "'Tajawal', sans-serif" : "'Nunito', sans-serif",
            fontWeight: 700,
            fontSize: "0.85rem",
            direction: isRTL ? "rtl" : "ltr",
          }}
          role="status"
          aria-live="polite"
        >
          <WifiOff size={16} strokeWidth={2.5} />
          <span>{t("offlineMessage")}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
