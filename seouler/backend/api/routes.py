import base64
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from models.schemas import (
    StartRequest, StartResponse, TalkResponse, TTSRequest, TTSResponse,
    PronunciationScore, DialogueTurn,
)
from services import game_service, gemini_service

router = APIRouter()


@router.post("/start", response_model=StartResponse)
async def start_game(request: StartRequest):
    session = game_service.create_session(request.difficulty)

    # fallback 대사 바로 사용 — Gemini 호출 없음 → 즉시 응답
    dialogue = game_service.get_fallback_dialogue(session)

    return StartResponse(
        session_id=session.session_id,
        scenario=session.scenario,
        npcs=session.npcs,
        current_round=session.current_round,
        total_rounds=session.total_rounds,
        suspicion=session.suspicion,
        npc_line=dialogue["npc_line"],
        npc_audio_base64="",
        player_line_ko=dialogue["player_line_ko"],
        player_line_roman=dialogue["player_line_roman"],
        player_line_en=dialogue["player_line_en"],
        hint=dialogue.get("hint", ""),
    )


@router.post("/talk", response_model=TalkResponse)
async def talk(
    session_id: str = Form(...),
    audio: UploadFile = File(...),
):
    session = game_service.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    audio_bytes = await audio.read()
    current_dialogue = game_service.get_fallback_dialogue(session)

    # 발음 평가만 Gemini 사용 (~4-5초)
    try:
        score_dict = await gemini_service.evaluate_pronunciation(
            audio_bytes=audio_bytes,
            reference_text=current_dialogue["player_line_ko"],
        )
        score = PronunciationScore(**score_dict)
    except Exception:
        score = PronunciationScore(
            accuracy=50, naturalness=50, fluency=50, overall=50,
            verdict="awkward",
            feedback_ko="평가 중 오류가 발생했습니다",
            feedback_en="Evaluation error occurred",
            detected_text=current_dialogue["player_line_ko"],
        )

    session.scores.append(score)
    game_service.update_suspicion(session, score)
    next_status = game_service.determine_next_status(session, score)
    session.status = next_status

    npc_reaction = (
        current_dialogue["npc_reaction_if_good"]
        if score.overall >= 65
        else current_dialogue["npc_reaction_if_bad"]
    )

    session.conversation_history.append(DialogueTurn(
        round=session.current_round,
        npc_name=current_dialogue["npc_name"],
        npc_line=current_dialogue["npc_line"],
        player_expected=current_dialogue["player_line_ko"],
        player_score=score,
    ))

    if next_status in ("success", "caught"):
        ending_messages = {
            "success": "축하합니다! 끝까지 서울사람으로 통과했습니다!",
            "caught": "들켰습니다! 하지만 NPC가 따뜻하게 반응합니다",
        }
        return TalkResponse(
            status=next_status,
            score=score,
            suspicion=session.suspicion,
            npc_reaction=npc_reaction,
            npc_name=current_dialogue["npc_name"],
            ending_message=ending_messages[next_status],
            final_stats=game_service.build_final_stats(session),
            conversation_log=session.conversation_history,
        )

    session.current_round += 1

    # 다음 대사도 fallback — Gemini 호출 없음
    next_dialogue = game_service.get_fallback_dialogue(session)

    return TalkResponse(
        status=next_status,
        score=score,
        suspicion=session.suspicion,
        npc_reaction=npc_reaction,
        npc_name=next_dialogue["npc_name"],
        current_round=session.current_round,
        total_rounds=session.total_rounds,
        npc_line=next_dialogue["npc_line"],
        npc_audio_base64="",
        player_line_ko=next_dialogue["player_line_ko"],
        player_line_roman=next_dialogue["player_line_roman"],
        player_line_en=next_dialogue["player_line_en"],
        hint=next_dialogue.get("hint", ""),
    )


@router.post("/tts", response_model=TTSResponse)
async def tts(request: TTSRequest):
    try:
        audio_bytes = await gemini_service.generate_tts(request.text)
        return TTSResponse(audio_base64=base64.b64encode(audio_bytes).decode())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
