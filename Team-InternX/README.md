# InternX — Autonomous AI Agent for Internship Discovery & Application Management

InternX is an autonomous AI agent platform designed to simplify and personalize the internship search process for college students. The system analyzes a student’s profile, skills, education, and career interests to discover relevant internship opportunities from external sources, automatically check eligibility, evaluate skill compatibility using a strict 40/30/20/10 ATS rubric, assist in preparing personalized applications, and maintain persistent application pipeline status.

---

## 🛠️ Architecture & Tech Stack

### Backend
- **Framework**: Python 3.10+ & FastAPI
- **LLM Agent Engine**: Groq SDK (`llama-3.3-70b-versatile` / `mixtral-8x7b-32768`) & fallback agent engine
- **Scoring Rubric Engine**:
  - 40% Core Technical Skills Match
  - 30% Eligibility (GPA, Major, Graduation Year)
  - 20% Preferred / Secondary Tools
  - 10% Location & Availability Alignment
- **Database**: SQLite & SQLAlchemy persistent database (`backend/internx.db`)

### Frontend
- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS + Linear/Notion-inspired dark mode theme
- **Icons & Motion**: Lucide React + Framer Motion
- **State Management**: Zustand (`useAppStore`)

---

## 🚀 How to Run the Project

### Prerequisites
- Python 3.10+
- Node.js v18+

### Step 1: Start Backend FastAPI Server
```bash
cd backend
python -m venv venv
# Activate venv:
# On Windows: venv\Scripts\activate
# On Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

FastAPI server will run at: `http://localhost:8000` (API Docs at `http://localhost:8000/docs`).

### Step 2: Start Frontend Development Server
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```

Frontend application will run at: `http://localhost:5173`.

---

## 📌 API Endpoints Summary

- `POST /api/profile` – Create or update student profile
- `POST /api/profile/parse-resume` – Upload and parse resume text via AI vision/text model
- `POST /api/agent/discover` – Rank opportunities using 40/30/20/10 ATS rubric
- `POST /api/agent/evaluate-match` – Score single job description against profile
- `POST /api/agent/generate-kit` – Generate tailored cover letter, resume bullet suggestions, and interview talking points
- `GET /api/applications` – Fetch Kanban application tracking records
- `PATCH /api/applications/:id` – Update Kanban application status, notes, or deadlines
- `POST /api/settings/config` – Set Groq API key and model selection
