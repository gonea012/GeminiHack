import type { PronunciationScore } from "../types";

interface Props {
  score: PronunciationScore;
  npcReaction: string;
  onNext: () => void;
}

const verdictLabel: Record<string, string> = {
  perfect: "완벽해요!",
  good: "잘했어요",
  awkward: "조금 어색해요",
  suspicious: "외국인 티가 나요",
  caught: "들킬 것 같아요",
};

const verdictColor: Record<string, string> = {
  perfect: "text-green-400",
  good: "text-blue-400",
  awkward: "text-yellow-400",
  suspicious: "text-orange-400",
  caught: "text-red-400",
};

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = value >= 70 ? "bg-green-400" : value >= 50 ? "bg-yellow-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-20 text-gray-300">{label}</span>
      <div className="flex-1 bg-gray-700 rounded-full h-2">
        <div className={`${color} h-2 rounded-full`} style={{ width: `${value}%` }} />
      </div>
      <span className="w-8 text-right text-white font-mono">{value}</span>
    </div>
  );
}

export function ScorePopup({ score, npcReaction, onNext }: Props) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-2xl p-6 w-80 space-y-4 shadow-2xl">
        <div className="text-center">
          <p className="text-3xl font-bold text-white">{score.overall}점</p>
          <p className={`text-sm font-semibold mt-1 ${verdictColor[score.verdict]}`}>
            {verdictLabel[score.verdict]}
          </p>
        </div>

        <div className="space-y-2">
          <ScoreBar label="정확도" value={score.accuracy} />
          <ScoreBar label="자연스러움" value={score.naturalness} />
          <ScoreBar label="유창성" value={score.fluency} />
        </div>

        <p className="text-gray-300 text-sm text-center">{score.feedback_ko}</p>

        <div className="bg-gray-700 rounded-xl p-3">
          <p className="text-xs text-gray-400 mb-1">NPC 반응</p>
          <p className="text-white text-sm">{npcReaction}</p>
        </div>

        <button
          onClick={onNext}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl"
        >
          다음 →
        </button>
      </div>
    </div>
  );
}
