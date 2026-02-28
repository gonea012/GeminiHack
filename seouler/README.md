# SEOULER — 외국인인 걸 들키지 마!

한국어 발음 게임. Gemini API로 발음 평가 + NPC 대사 생성 + TTS.

## 시작하기

### Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
# .env에 GEMINI_API_KEY 설정
python main.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

→ http://localhost:5173 에서 게임 실행
