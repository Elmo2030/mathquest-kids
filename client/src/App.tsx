/**
 * App.tsx — MathQuest Kids
 * Design: Sunny Storybook
 * Routing: Context-driven screen navigation (no URL routing needed for a game).
 * Screens: Home → LevelSelect → Game | Parents
 */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeProvider } from "./contexts/ThemeContext";
import { GameProvider, useGame } from "./contexts/GameContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import HomeScreen from "./pages/HomeScreen";
import LevelSelectScreen from "./pages/LevelSelectScreen";
import GameScreen from "./pages/GameScreen";
import ParentsScreen from "./pages/ParentsScreen";
import SummaryScreen from "./pages/SummaryScreen";
import VictoryScreen from "./pages/VictoryScreen";
import EndlessScreen from "./pages/EndlessScreen";
import TrophyRoomScreen from "./pages/TrophyRoomScreen";
import LevelCompleteScreen from "./pages/LevelCompleteScreen";
import MultPracticeScreen from "./pages/MultPracticeScreen";
import { BadgeProvider } from "./contexts/BadgeContext";
import { MultPracticeProvider, useMultPractice } from "./contexts/MultPracticeContext";
import ErrorBoundary from "./components/ErrorBoundary";

const pageVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] as [number,number,number,number] } },
  exit:    { opacity: 0, x: -30, transition: { duration: 0.18, ease: [0.77, 0, 0.175, 1] as [number,number,number,number] } },
};

function GameRouter() {
  const { screen } = useGame();
  const { isOpen: isMultOpen } = useMultPractice();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={screen}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ minHeight: "100vh" }}
      >
        {screen === "home"    && <HomeScreen />}
        {screen === "levels"  && <LevelSelectScreen />}
        {screen === "game"    && <GameScreen />}
        {screen === "parents" && <ParentsScreen />}
        {screen === "summary"  && <SummaryScreen />}
        {screen === "victory"  && <VictoryScreen />}
        {screen === "endless"  && <EndlessScreen />}
        {screen === "trophy"        && <TrophyRoomScreen />}
        {screen === "levelcomplete" && <LevelCompleteScreen />}
      </motion.div>
      {/* Multiplication Practice overlay — sits above all screens */}
      <AnimatePresence>
        {isMultOpen && (
          <motion.div
            key="mult-practice"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.23, 1, 0.32, 1] as [number,number,number,number] } }}
            exit={{ opacity: 0, y: 30, transition: { duration: 0.2 } }}
            style={{ position: "fixed", inset: 0, zIndex: 50 }}
          >
            <MultPracticeScreen />
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <LanguageProvider>
            <GameProvider>
              <MultPracticeProvider>
              <BadgeProvider>
                <Toaster />
                <GameRouter />
              </BadgeProvider>
              </MultPracticeProvider>
            </GameProvider>
          </LanguageProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
