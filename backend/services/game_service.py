import uuid
from config import DIFFICULTY_CONFIG, SUSPICION_EVENT_THRESHOLD, SUSPICION_CAUGHT_THRESHOLD
from models.schemas import GameSession, Scenario, NPC, PronunciationScore, DialogueTurn
from data.scenarios import SCENARIOS


game_sessions: dict[str, GameSession] = {}


def create_session(difficulty: str) -> GameSession:
    data = SCENARIOS[difficulty]
    session = GameSession(
        session_id=str(uuid.uuid4()),
        status="playing",
        difficulty=difficulty,
        scenario=Scenario(**data["scenario"]),
        npcs=[NPC(**npc) for npc in data["npcs"]],
        current_round=1,
        total_rounds=DIFFICULTY_CONFIG[difficulty]["total_rounds"],
        suspicion=0,
        conversation_history=[],
        scores=[],
    )
    game_sessions[session.session_id] = session
    return session


def get_session(session_id: str) -> GameSession | None:
    return game_sessions.get(session_id)


def update_suspicion(session: GameSession, score: PronunciationScore) -> int:
    config = DIFFICULTY_CONFIG[session.difficulty]
    if score.overall >= config["threshold"]:
        session.suspicion = max(0, session.suspicion - config["decrease"])
    else:
        session.suspicion = min(SUSPICION_CAUGHT_THRESHOLD, session.suspicion + config["increase"])
    return session.suspicion


def determine_next_status(session: GameSession, score: PronunciationScore) -> str:
    if session.suspicion >= SUSPICION_CAUGHT_THRESHOLD:
        return "caught"
    if session.status == "suspicion_event":
        config = DIFFICULTY_CONFIG[session.difficulty]
        if score.overall < config["threshold"]:
            return "caught"
        session.suspicion = 50
        return "playing"
    if session.suspicion >= SUSPICION_EVENT_THRESHOLD:
        return "suspicion_event"
    if session.current_round >= session.total_rounds:
        return "success"
    return "playing"


def get_fallback_dialogue(session: GameSession) -> dict:
    scenario_data = SCENARIOS[session.difficulty]
    if session.status == "suspicion_event" and "suspicion_event_fallback" in scenario_data:
        return scenario_data["suspicion_event_fallback"]
    fallback = scenario_data["fallback"]
    idx = min(session.current_round - 1, len(fallback) - 1)
    entry = fallback[idx]
    if entry.get("type") == "branch":
        key = "good" if session.suspicion < SUSPICION_EVENT_THRESHOLD else "bad"
        result = {"npc_name": entry["npc_name"], **entry[key]}
        return result
    return entry


def build_final_stats(session: GameSession) -> dict:
    if not session.scores:
        return {}
    scores = [s.overall for s in session.scores]
    return {
        "average_accuracy": round(sum(s.accuracy for s in session.scores) / len(session.scores)),
        "average_naturalness": round(sum(s.naturalness for s in session.scores) / len(session.scores)),
        "average_fluency": round(sum(s.fluency for s in session.scores) / len(session.scores)),
        "average_overall": round(sum(scores) / len(scores)),
        "best_round": scores.index(max(scores)) + 1,
        "worst_round": scores.index(min(scores)) + 1,
    }
