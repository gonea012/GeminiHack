import type { TalkResponse } from "../types";

interface Props {
  result: TalkResponse;
  onRestart: () => void;
}

const verdictColor: Record<string, string> = {
  perfect: "text-green-400",
  good: "text-blue-400",
  awkward: "text-yellow-400",
  suspicious: "text-orange-400",
  caught: "text-red-400",
};

export function EndingScreen({ result, onRestart }: Props) {
  const isSuccess = result.status === "success";
  const stats = result.final_stats;
  const log = result.conversation_log ?? [];

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center gap-6 px-6 py-10 ${
        isSuccess ? "bg-gradient-to-b from-green-950 to-gray-950" : "bg-gradient-to-b from-red-950 to-gray-950"
      }`}
    >
      {/* 결과 헤더 */}
      <div className="text-center space-y-3">
        <p className="text-6xl animate-bounce">{isSuccess ? "🎉" : "🚨"}</p>
        <h2
          className={`text-3xl font-extrabold ${isSuccess ? "text-green-300" : "text-red-300"}`}
        >
          {isSuccess ? "서울사람 인정!" : "들켰습니다!"}
        </h2>
        <p className={`text-sm px-4 py-2 rounded-full font-medium ${
          isSuccess
            ? "bg-green-800/50 text-green-200"
            : "bg-red-800/50 text-red-200"
        }`}>
          {result.ending_message}
        </p>
      </div>

      {/* 최종 점수 */}
      {stats && (
        <div className={`rounded-2xl p-5 w-72 space-y-2 border ${
          isSuccess ? "bg-green-900/30 border-green-700" : "bg-red-900/20 border-red-800"
        }`}>
          <p className="text-white font-bold text-sm mb-3">
            {isSuccess ? "🏅 최종 점수" : "📊 최종 점수"}
          </p>
          {[
            ["평균 정확도", stats.average_accuracy],
            ["평균 자연스러움", stats.average_naturalness],
            ["평균 유창성", stats.average_fluency],
            ["종합", stats.average_overall],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-gray-400">{label}</span>
              <span
                className={`font-mono font-bold ${
                  isSuccess ? "text-green-300" : "text-red-300"
                }`}
              >
                {value}점
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 대화 리뷰 */}
      {log.length > 0 && (
        <div className="bg-gray-800/60 rounded-2xl p-5 w-72">
          <p className="text-white font-bold text-sm mb-3">대화 리뷰</p>
          <div className="space-y-2">
            {log.map((turn) => {
              const overall = turn.player_score?.overall ?? 0;
              const verdict = turn.player_score?.verdict ?? "awkward";
              const emoji = overall >= 70 ? "🟢" : overall >= 50 ? "🟡" : "🔴";
              return (
                <div key={turn.round} className="flex justify-between items-center text-sm">
                  <span className="text-gray-300 truncate flex-1">
                    R{turn.round}: "{turn.player_expected}"
                  </span>
                  <span className={`ml-2 font-mono font-bold ${verdictColor[verdict]}`}>
                    {emoji} {overall}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 다시 하기 버튼 */}
      <button
        onClick={onRestart}
        className={`font-bold px-8 py-3 rounded-full text-lg text-white transition-all ${
          isSuccess
            ? "bg-green-500 hover:bg-green-400"
            : "bg-red-500 hover:bg-red-400"
        }`}
      >
        {isSuccess ? "🔄 다시 도전" : "🔄 다시 시도"}
      </button>
    </div>
  );
}
