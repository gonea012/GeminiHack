<div align="center">
  <img src="frontend/public/images/Gemini_Generated_Image_Logo.png" alt="SEOULER" width="380" />
  <h3>서울 현지인으로 위장하라!</h3>
  <p><em>You are not a tourist. You are a Seouler.</em></p>
</div>

---

## What is SEOULER?

당신은 지금 **서울 현지인으로 위장한 외국인**입니다.

광장시장 포장마차, 한강공원 치맥 자리, 친구들과의 스몰토크 —
서울 토박이들 사이에 자연스럽게 녹아들어야 합니다.
그들이 당신을 의심하기 전에, 먼저 **정확한 발음**으로 대화를 이어가세요.

SEOULER는 한국어 억양·발음 학습을 **스파이 생존 게임**의 형식으로 풀어낸 인터랙티브 언어 게임입니다.
Gemini AI가 실시간으로 당신의 발음을 평가하고, NPC는 당신의 어색함을 눈치채기 시작합니다.

---

## How to Play

1. **난이도 선택** — Easy / Medium / Hard
2. **NPC의 대사를 듣고** 화면에 표시된 한국어 문장을 따라 말하세요
3. **Gemini AI가 발음을 평가** — 정확도, 자연스러움, 유창성 측정
4. **의심 게이지**를 관리하세요. 발음이 어색할수록 NPC의 의심이 쌓입니다
5. 마지막 라운드까지 들키지 않으면 **서울러 인증 성공!**

---

## Game Scenarios

외국인들이 실제로 방문하는 서울의 핫플레이스를 배경으로 설계했습니다.

<div align="center">
  <img src="frontend/public/images/Gemini_Generated_Image_EasyCard.png" alt="Easy" width="200" />
  &nbsp;&nbsp;
  <img src="frontend/public/images/Gemini_Generated_Image_MediumCard.png" alt="Medium" width="200" />
  &nbsp;&nbsp;
  <img src="frontend/public/images/Gemini_Generated_Image_HardCard.png" alt="Hard" width="200" />
</div>

<br/>

| 난이도 | 배경 | 시나리오 |
|--------|------|----------|
| 🟢 Easy | 광장시장 포장마차 | 사장님께 음식 주문하기 |
| 🟡 Medium | 광장시장 옆 테이블 | 처음 만난 서울 사람들과 스몰토크 |
| 🔴 Hard | 한강공원 치맥 자리 | 알바 동료들과 반말로 수다 떨기 |

---

## Tech Stack

| 역할 | 기술 |
|------|------|
| AI 발음 평가 | Gemini 3 Flash (`gemini-3-flash-preview`) |
| TTS 음성 생성 | Gemini TTS (`gemini-2.5-flash-preview-tts`) |
| Backend | Python · FastAPI · Uvicorn |
| Frontend | React · TypeScript · Vite · Tailwind CSS |

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- [Gemini API Key](https://aistudio.google.com/)

### Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt

# .env 파일 생성
echo "GEMINI_API_KEY=your_api_key_here" > .env

python main.py
# → http://localhost:8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

---

## Why SEOULER?

한국어 학습 앱은 많지만, 대부분 단어 암기나 문법 설명에 집중합니다.
실제 여행에서 외국인이 가장 어려워하는 건 **억양과 발음** — 말은 아는데 입이 안 따라가는 그 순간입니다.

SEOULER는 틀려도 괜찮은 게임의 형식 속에서,
실제 여행지 맥락 그대로 자연스럽게 발음을 반복 훈련할 수 있도록 설계했습니다.
들킬까봐 긴장하는 그 감각이, 학습을 게임으로 만듭니다.

---

*Built at Google Gemini Hackathon 2025*
