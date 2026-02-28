interface Props {
  lineKo: string;
  lineRoman: string;
  lineEn: string;
  hint: string;
  onListenExample: () => void;
  isLoadingTTS: boolean;
}

export function PlayerPrompt({
  lineKo,
  lineRoman,
  lineEn,
  hint,
  onListenExample,
  isLoadingTTS,
}: Props) {
  return (
    <div className="bg-gray-800 rounded-2xl p-4 space-y-2">
      <p className="text-white text-xl font-bold">{lineKo}</p>
      <p className="text-blue-300 text-sm">{lineRoman}</p>
      <p className="text-gray-400 text-sm">"{lineEn}"</p>
      {hint && <p className="text-yellow-400 text-xs">💡 {hint}</p>}
      <button
        onClick={onListenExample}
        disabled={isLoadingTTS}
        className="text-xs text-gray-300 border border-gray-600 rounded-full px-3 py-1 hover:bg-gray-700 disabled:opacity-50"
      >
        {isLoadingTTS ? "로딩 중..." : "🔊 원어민 발음 듣기"}
      </button>
    </div>
  );
}
