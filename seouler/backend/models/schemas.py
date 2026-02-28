from pydantic import BaseModel
from typing import Literal, Optional


# --- 내부 상태 모델 ---

class PronunciationScore(BaseModel):
    accuracy: int
    naturalness: int
    fluency: int
    overall: int
    verdict: Literal["perfect", "good", "awkward", "suspicious", "caught"]
    feedback_ko: str
    feedback_en: str
    detected_text: str


class DialogueTurn(BaseModel):
    round: int
    npc_name: str
    npc_line: str
    player_expected: str
    player_score: Optional[PronunciationScore] = None


class Scenario(BaseModel):
    title: str
    setting: str
    description: str


class NPC(BaseModel):
    name: str
    description: str
    voice_name: str


class GameSession(BaseModel):
    session_id: str
    status: Literal["playing", "suspicion_event", "success", "caught"]
    difficulty: Literal["easy", "medium", "hard"]
    scenario: Scenario
    npcs: list[NPC]
    current_round: int
    total_rounds: int
    suspicion: int
    conversation_history: list[DialogueTurn]
    scores: list[PronunciationScore]


# --- API 요청/응답 모델 ---

class StartRequest(BaseModel):
    difficulty: Literal["easy", "medium", "hard"]


class StartResponse(BaseModel):
    session_id: str
    scenario: Scenario
    npcs: list[NPC]
    current_round: int
    total_rounds: int
    suspicion: int
    npc_line: str
    npc_audio_base64: str
    player_line_ko: str
    player_line_roman: str
    player_line_en: str
    hint: str


class TalkResponse(BaseModel):
    status: Literal["playing", "suspicion_event", "success", "caught"]
    score: PronunciationScore
    suspicion: int
    npc_reaction: str
    npc_name: Optional[str] = None
    current_round: Optional[int] = None
    total_rounds: Optional[int] = None
    npc_line: Optional[str] = None
    npc_audio_base64: Optional[str] = None
    player_line_ko: Optional[str] = None
    player_line_roman: Optional[str] = None
    player_line_en: Optional[str] = None
    hint: Optional[str] = None
    ending_message: Optional[str] = None
    final_stats: Optional[dict] = None
    conversation_log: Optional[list[DialogueTurn]] = None


class TTSRequest(BaseModel):
    text: str


class TTSResponse(BaseModel):
    audio_base64: str
