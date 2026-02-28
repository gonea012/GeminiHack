interface Props {
  onStart: () => void;
}

export function SplashScreen({ onStart }: Props) {
  return (
    <div
      className="min-h-screen bg-[#0d1520] flex flex-col items-center justify-center gap-10 px-6 cursor-pointer"
      onClick={onStart}
    >
      <img
        src="/images/Gemini_Generated_Image_Logo.png"
        alt="SEOULER"
        className="w-full max-w-sm"
      />

      <button
        onClick={(e) => { e.stopPropagation(); onStart(); }}
        className="bg-red-700 hover:bg-red-600 text-white font-bold text-lg px-10 py-4 rounded-full shadow-lg tracking-widest transition-all animate-pulse"
      >
        미션 시작 ▶
      </button>
    </div>
  );
}
