export type Difficulty = "easy" | "medium" | "hard";
export type GameStatus = "playing" | "suspicion_event" | "success" | "caught";
export type Verdict = "perfect" | "good" | "awkward" | "suspicious" | "caught";

export interface Scenario {
  title: string;
  setting: string;
  description: string;
}

export interface NPC {
  name: string;
  description: string;
  voice_name: string;
}

export interface PronunciationScore {
  accuracy: number;
  naturalness: number;
  fluency: number;
  overall: number;
  verdict: Verdict;
  feedback_ko: string;
  feedback_en: string;
  detected_text: string;
}

export interface DialogueTurn {
  round: number;
  npc_name: string;
  npc_line: string;
  player_expected: string;
  player_score?: PronunciationScore;
}

export interface StartResponse {
  session_id: string;
  scenario: Scenario;
  npcs: NPC[];
  current_round: number;
  total_rounds: number;
  suspicion: number;
  npc_line: string;
  npc_audio_base64: string;
  player_line_ko: string;
  player_line_roman: string;
  player_line_en: string;
  hint: string;
}

export interface TalkResponse {
  status: GameStatus;
  score: PronunciationScore;
  suspicion: number;
  npc_reaction: string;
  npc_name?: string;
  current_round?: number;
  total_rounds?: number;
  npc_line?: string;
  npc_audio_base64?: string;
  player_line_ko?: string;
  player_line_roman?: string;
  player_line_en?: string;
  hint?: string;
  ending_message?: string;
  final_stats?: FinalStats;
  conversation_log?: DialogueTurn[];
}

export interface FinalStats {
  average_accuracy: number;
  average_naturalness: number;
  average_fluency: number;
  average_overall: number;
  best_round: number;
  worst_round: number;
}
