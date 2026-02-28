import type { Difficulty } from "../types";

interface Props {
  onSelect: (difficulty: Difficulty) => void;
}

const thumbnails: Partial<Record<string, string>> = {
  easy: "/images/Gemini_Generated_Image_EasyCard.png",
  medium: "/images/Gemini_Generated_Image_MediumCard.png",
  hard: "/images/Gemini_Generated_Image_HardCard.png",
};

const levels = [
  {
    difficulty: "easy" as Difficulty,
    emoji: "🟢",
    label: "Easy",
    scenario: "광장시장 주문",
    description: "단어 위주",
    color: "border-green-500 hover:bg-green-500/10",
  },
  {
    difficulty: "medium" as Difficulty,
    emoji: "🟡",
    label: "Medium",
    scenario: "스몰 토크",
    description: "짧은 문장",
    color: "border-yellow-500 hover:bg-yellow-500/10",
  },
  {
    difficulty: "hard" as Difficulty,
    emoji: "🔴",
    label: "Hard",
    scenario: "한강 치맥",
    description: "반말 대화",
    color: "border-red-500 hover:bg-red-500/10",
  },
];

export function SelectScreen({ onSelect }: Props) {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-10 px-6">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">🎭 SEOULER</h1>
        <p className="text-gray-400 mt-2">서울 현지인으로 위장하라!</p>
      </div>

      <div className="flex gap-4">
        {levels.map(({ difficulty, emoji, label, scenario, description, color }) => (
          <button
            key={difficulty}
            onClick={() => onSelect(difficulty)}
            className={`border-2 ${color} rounded-2xl overflow-hidden w-36 flex flex-col items-center gap-3 text-white transition-all`}
          >
            {thumbnails[difficulty] ? (
              <img
                src={thumbnails[difficulty]}
                alt={label}
                className="w-full h-24 object-cover"
              />
            ) : (
              <span className="text-3xl pt-6">{emoji}</span>
            )}
            <div className="flex flex-col items-center gap-1 px-3 pb-4">
              <span className="font-bold text-lg">{label}</span>
              <span className="text-sm text-gray-300">{scenario}</span>
              <span className="text-xs text-gray-500">{description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
