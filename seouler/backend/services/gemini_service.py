import base64
import json
import google.genai as genai
from google.genai import types
from config import GEMINI_API_KEY
from prompts.system_prompts import PRONUNCIATION_SYSTEM_PROMPT, NPC_DIALOGUE_SYSTEM_PROMPT

client = genai.Client(api_key=GEMINI_API_KEY)


async def evaluate_pronunciation(audio_bytes: bytes, reference_text: str) -> dict:
    audio_b64 = base64.b64encode(audio_bytes).decode()

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=[
            {
                "role": "user",
                "parts": [
                    {"text": f'Reference text: "{reference_text}"\nEvaluate this pronunciation:'},
                    {"inline_data": {"mime_type": "audio/webm", "data": audio_b64}},
                ],
            }
        ],
        config={
            "system_instruction": PRONUNCIATION_SYSTEM_PROMPT,
            "response_mime_type": "application/json",
        },
    )

    result = json.loads(response.text)

    # 극단값 보정
    if result.get("overall", 50) == 0 or result.get("overall", 50) == 100:
        result["overall"] = 50

    return result


async def generate_npc_dialogue(
    scenario: dict,
    difficulty: str,
    current_round: int,
    suspicion: int,
    conversation_history: list,
) -> dict:
    history_text = "\n".join(
        [f"Round {t['round']}: NPC: {t['npc_line']} / Player: {t['player_expected']}"
         for t in conversation_history]
    ) or "첫 번째 라운드"

    prompt = f"""
시나리오: {scenario['title']}
장소: {scenario['setting']}
난이도: {difficulty}
현재 라운드: {current_round}
현재 의심 수치: {suspicion}/100
대화 히스토리:
{history_text}

다음 대화 턴을 생성해주세요.
"""

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=[{"role": "user", "parts": [{"text": prompt}]}],
        config={
            "system_instruction": NPC_DIALOGUE_SYSTEM_PROMPT,
            "response_mime_type": "application/json",
        },
    )

    return json.loads(response.text)


async def generate_tts(text: str, voice_name: str = "Kore") -> bytes:
    response = client.models.generate_content(
        model="gemini-2.5-flash-preview-tts",
        contents=text,
        config=types.GenerateContentConfig(
            response_modalities=["AUDIO"],
            speech_config=types.SpeechConfig(
                voice_config=types.VoiceConfig(
                    prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name=voice_name)
                )
            ),
        ),
    )
    data = response.candidates[0].content.parts[0].inline_data.data
    if isinstance(data, bytes):
        return data
    # 패딩 보정 후 디코딩
    data = data + '=' * (-len(data) % 4)
    return base64.b64decode(data)
