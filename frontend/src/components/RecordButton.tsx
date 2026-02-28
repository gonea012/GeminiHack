type RecordState = "idle" | "recording" | "processing";

interface Props {
  state: RecordState;
  onStart: () => void;
  onStop: () => void;
}

export function RecordButton({ state, onStart, onStop }: Props) {
  const label =
    state === "idle" ? "🎤 녹음하기" : state === "recording" ? "⏹ 녹음 중지" : "⏳ 평가 중...";

  const bg =
    state === "idle"
      ? "bg-blue-500 hover:bg-blue-600"
      : state === "recording"
      ? "bg-red-500 hover:bg-red-600 animate-pulse"
      : "bg-gray-500 cursor-not-allowed";

  const handleClick = () => {
    if (state === "idle") onStart();
    else if (state === "recording") onStop();
  };

  return (
    <button
      onClick={handleClick}
      disabled={state === "processing"}
      className={`${bg} text-white text-lg font-bold px-8 py-4 rounded-full shadow-lg transition-all`}
    >
      {label}
    </button>
  );
}
