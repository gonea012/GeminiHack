import { useState } from "react";
import type { Difficulty, StartResponse, TalkResponse } from "../types";
import { submitAudio, getExampleTTS } from "../api/client";
import { useAudioRecorder } from "../hooks/useAudioRecorder";
import { SuspicionMeter } from "../components/SuspicionMeter";
import { NPCBubble } from "../components/NPCBubble";
import { PlayerPrompt } from "../components/PlayerPrompt";
import { RecordButton } from "../components/RecordButton";
import { ScorePopup } from "../components/ScorePopup";

type RecordState = "idle" | "recording" | "processing";

const bgImages: Partial<Record<string, string>> = {
  easy: "/images/Gemini_Generated_Image_EasySsum.png",
  medium: "/images/Gemini_Generated_Image_MediumSsum.png",
  hard: "/images/Gemini_Generated_Image_HardSsum.png",
};

const npcAvatars: Partial<Record<string, string>> = {
  easy: "/images/Gemini_Generated_Image_EasyBubble.png",
  medium: "/images/Gemini_Generated_Image_MediumBubble1.png",
  hard: "/images/Gemini_Generated_Image_HardBubble1.png",
};

const npcNameAvatars: Record<string, string> = {
  "민지": "/images/Gemini_Generated_Image_MediumBubble1.png",
  "철수": "/images/Gemini_Generated_Image_MediumBubble2.png",
  "수빈": "/images/Gemini_Generated_Image_HardBubble1.png",
  "준호": "/images/Gemini_Generated_Image_HardBubble2.png",
};

interface Props {
  initialData: StartResponse;
  difficulty: Difficulty;
  onEnd: (result: TalkResponse) => void;
}

function playPcmAudio(base64: string) {
  if (!base64) return;
  const raw = atob(base64);
  const buf = new ArrayBuffer(raw.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < raw.length; i++) view[i] = raw.charCodeAt(i);

  const audioCtx = new AudioContext({ sampleRate: 24000 });
  const pcm = new Int16Array(buf);
  const float32 = new Float32Array(pcm.length);
  for (let i = 0; i < pcm.length; i++) float32[i] = pcm[i] / 32768;

  const audioBuf = audioCtx.createBuffer(1, float32.length, 24000);
  audioBuf.copyToChannel(float32, 0);
  const source = audioCtx.createBufferSource();
  source.buffer = audioBuf;
  source.connect(audioCtx.destination);
  source.start();
}

export function GameScreen({ initialData, difficulty, onEnd }: Props) {
  const [sessionId] = useState(initialData.session_id);
  const [npcLine, setNpcLine] = useState(initialData.npc_line);
  const [npcName, setNpcName] = useState(initialData.npcs[0]?.name ?? "NPC");
  const [playerLineKo, setPlayerLineKo] = useState(initialData.player_line_ko);
  const [playerLineRoman, setPlayerLineRoman] = useState(initialData.player_line_roman);
  const [playerLineEn, setPlayerLineEn] = useState(initialData.player_line_en);
  const [hint, setHint] = useState(initialData.hint);
  const [suspicion, setSuspicion] = useState(initialData.suspicion);
  const [currentRound, setCurrentRound] = useState(initialData.current_round);
  const [totalRounds] = useState(initialData.total_rounds);
  const [recordState, setRecordState] = useState<RecordState>("idle");
  const [talkResult, setTalkResult] = useState<TalkResponse | null>(null);
  const [isLoadingTTS, setIsLoadingTTS] = useState(false);

  const { isRecording, startRecording, stopRecording } = useAudioRecorder();

  // NPC 음성 자동 재생
  useState(() => {
    if (initialData.npc_audio_base64) playPcmAudio(initialData.npc_audio_base64);
  });

  const handleStartRecording = async () => {
    await startRecording();
    setRecordState("recording");
  };

  const handleStopRecording = async () => {
    setRecordState("processing");
    const blob = await stopRecording();
    const result = await submitAudio(sessionId, blob);
    setTalkResult(result);
  };

  const handleNext = () => {
    if (!talkResult) return;
    if (talkResult.status === "success" || talkResult.status === "caught") {
      onEnd(talkResult);
      return;
    }
    if (talkResult.npc_line) {
      setNpcLine(talkResult.npc_line);
      setSuspicion(talkResult.suspicion);
      if (talkResult.npc_name) setNpcName(talkResult.npc_name);
      if (talkResult.current_round) setCurrentRound(talkResult.current_round);
      if (talkResult.player_line_ko) setPlayerLineKo(talkResult.player_line_ko);
      if (talkResult.player_line_roman) setPlayerLineRoman(talkResult.player_line_roman);
      if (talkResult.player_line_en) setPlayerLineEn(talkResult.player_line_en);
      if (talkResult.hint) setHint(talkResult.hint);
      if (talkResult.npc_audio_base64) playPcmAudio(talkResult.npc_audio_base64);
    }
    setTalkResult(null);
    setRecordState("idle");
  };

  const handleListenExample = async () => {
    setIsLoadingTTS(true);
    try {
      const b64 = await getExampleTTS(playerLineKo);
      playPcmAudio(b64);
    } finally {
      setIsLoadingTTS(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center">
      <div className="w-full max-w-lg flex flex-col flex-1">
      <SuspicionMeter
        suspicion={suspicion}
        currentRound={currentRound}
        totalRounds={totalRounds}
      />

      {bgImages[difficulty] && (
        <img
          src={bgImages[difficulty]}
          alt=""
          className="w-full object-cover"
          style={{ maxHeight: "240px" }}
        />
      )}

      <div className="flex flex-col px-6 pt-4 pb-8 gap-4">
        <NPCBubble npcName={npcName} line={npcLine} avatarSrc={npcNameAvatars[npcName] ?? npcAvatars[difficulty]} />

        <div className="flex flex-col items-center gap-4 mt-4">
          <PlayerPrompt
            lineKo={playerLineKo}
            lineRoman={playerLineRoman}
            lineEn={playerLineEn}
            hint={hint}
            onListenExample={handleListenExample}
            isLoadingTTS={isLoadingTTS}
          />

          <RecordButton
            state={recordState}
            onStart={handleStartRecording}
            onStop={handleStopRecording}
          />
        </div>
      </div>
      </div>

      {talkResult && (
        <ScorePopup
          score={talkResult.score}
          npcReaction={talkResult.npc_reaction}
          onNext={handleNext}
        />
      )}
    </div>
  );
}
