import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

DIFFICULTY_CONFIG = {
    "easy": {
        "threshold": 50,
        "decrease": 10,
        "increase": 15,
        "total_rounds": 7,
    },
    "medium": {
        "threshold": 65,
        "decrease": 8,
        "increase": 20,
        "total_rounds": 5,
    },
    "hard": {
        "threshold": 75,
        "decrease": 5,
        "increase": 25,
        "total_rounds": 5,
    },
}

SUSPICION_EVENT_THRESHOLD = 70
SUSPICION_CAUGHT_THRESHOLD = 100
