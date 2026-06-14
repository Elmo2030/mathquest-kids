// Temporary preview helper — cycles through screens for testing
import { useEffect } from "react";
import { useGame } from "@/contexts/GameContext";

export default function ScreenPreview({ target }: { target: string }) {
  const { navigateTo, selectLevel } = useGame();
  useEffect(() => {
    if (target === "levels") navigateTo("levels");
    else if (target === "game") selectLevel("G1");
    else if (target === "parents") navigateTo("parents");
  }, [target]);
  return null;
}
