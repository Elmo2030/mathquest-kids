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
import ErrorBoundary from "./components/ErrorBoundary";

const pageVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] as [number,number,number,number] } },
  exit:    { opacity: 0, x: -30, transition: { duration: 0.18, ease: [0.77, 0, 0.175, 1] as [number,number,number,number] } },
};

function GameRouter() {
  const { screen } = useGame();
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
      </motion.div>
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
              <Toaster />
              <GameRouter />
            </GameProvider>
          </LanguageProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
