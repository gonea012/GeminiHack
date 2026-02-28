interface Props {
  suspicion: number;
  currentRound: number;
  totalRounds: number;
}

export function SuspicionMeter({ suspicion, currentRound, totalRounds }: Props) {
  const color =
    suspicion >= 70 ? "bg-red-500" : suspicion >= 40 ? "bg-yellow-400" : "bg-green-400";

  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-gray-900 text-white text-sm">
      <span className="font-mono">
        Round {currentRound}/{totalRounds}
      </span>
      <div className="flex items-center gap-2 flex-1">
        <span className="text-gray-400 whitespace-nowrap">의심 게이지</span>
        <div className="flex-1 bg-gray-700 rounded-full h-3">
          <div
            className={`${color} h-3 rounded-full transition-all duration-500`}
            style={{ width: `${suspicion}%` }}
          />
        </div>
        <span className="w-10 text-right font-mono">{suspicion}%</span>
      </div>
    </div>
  );
}
