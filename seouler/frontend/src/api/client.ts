import type { Difficulty, StartResponse, TalkResponse } from "../types";

export async function startGame(difficulty: Difficulty): Promise<StartResponse> {
  const res = await fetch("/api/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ difficulty }),
  });
  if (!res.ok) throw new Error("Failed to start game");
  return res.json();
}

export async function submitAudio(
  sessionId: string,
  audioBlob: Blob
): Promise<TalkResponse> {
  const form = new FormData();
  form.append("session_id", sessionId);
  form.append("audio", audioBlob, "recording.webm");

  const res = await fetch("/api/talk", { method: "POST", body: form });
  if (!res.ok) throw new Error("Failed to submit audio");
  return res.json();
}

export async function getExampleTTS(text: string): Promise<string> {
  const res = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error("Failed to get TTS");
  const data = await res.json();
  return data.audio_base64 as string;
}
