import { useState } from "react";
import type { Difficulty, StartResponse, TalkResponse } from "./types";
import { startGame } from "./api/client";
import { SplashScreen } from "./pages/SplashScreen";
import { SelectScreen } from "./pages/SelectScreen";
import { GameScreen } from "./pages/GameScreen";
import { EndingScreen } from "./pages/EndingScreen";

type Screen = "splash" | "select" | "game" | "ending";

export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [gameData, setGameData] = useState<StartResponse | null>(null);
  const [endResult, setEndResult] = useState<TalkResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectDifficulty = async (d: Difficulty) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const data = await startGame(d);
      setDifficulty(d);
      setGameData(data);
      setScreen("game");
    } catch (e) {
      alert("게임 시작 중 오류가 발생했습니다. 백엔드 서버를 확인해주세요.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGameEnd = (result: TalkResponse) => {
    setEndResult(result);
    setScreen("ending");
  };

  const handleRestart = () => {
    setGameData(null);
    setEndResult(null);
    setScreen("splash");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-white text-xl animate-pulse">게임 준비 중...</p>
      </div>
    );
  }

  if (screen === "game" && gameData) {
    return (
      <GameScreen
        initialData={gameData}
        difficulty={difficulty}
        onEnd={handleGameEnd}
      />
    );
  }

  if (screen === "ending" && endResult) {
    return <EndingScreen result={endResult} onRestart={handleRestart} />;
  }

  if (screen === "splash") {
    return <SplashScreen onStart={() => setScreen("select")} />;
  }

  return <SelectScreen onSelect={handleSelectDifficulty} />;
}
