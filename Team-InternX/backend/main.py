import os
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from models import (
    StudentProfile, InternshipOpportunity, MatchEvaluation, 
    ApplicationKit, ApplicationRecord, ResumeParseRequest, GroqConfig
)
from seed_data import SEED_INTERNSHIPS
from database import (
    init_db, load_profile, save_profile, 
    get_all_applications, save_or_update_application
)
from agent import (
    calculate_rubric_score, generate_application_kit, parse_resume_text
)

app = FastAPI(
    title="InternX AI Agent API",
    description="Autonomous AI Agent backend for Internship Discovery & Application Management",
    version="1.0.0"
)

# Enable CORS for frontend Vite application
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory runtime Groq configuration
current_groq_config = GroqConfig()

@app.on_event("startup")
def startup_event():
    init_db()

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "InternX Autonomous AI Agent Engine",
        "version": "1.0.0",
        "endpoints": [
            "/api/profile",
            "/api/profile/parse-resume",
            "/api/agent/discover",
            "/api/agent/evaluate-match",
            "/api/agent/generate-kit",
            "/api/applications"
        ]
    }

# 1. Profile & Onboarding
@app.get("/api/profile", response_model=StudentProfile)
def get_student_profile():
    return load_profile()

@app.post("/api/profile", response_model=StudentProfile)
def update_student_profile(profile: StudentProfile):
    return save_profile(profile)

@app.post("/api/profile/parse-resume", response_model=StudentProfile)
def parse_resume(payload: ResumeParseRequest):
    if not payload.resume_text.strip():
        raise HTTPException(status_code=400, detail="Resume text cannot be empty.")
    
    parsed = parse_resume_text(payload.resume_text, current_groq_config)
    existing = load_profile()
    
    # Merge extracted skills into existing profile
    updated_skills = list(set(existing.skills + parsed.skills))
    updated_profile = StudentProfile(
        name=existing.name,
        university=existing.university,
        major=existing.major,
        graduation_year=existing.graduation_year,
        gpa=existing.gpa,
        skills=updated_skills,
        soft_skills=existing.soft_skills,
        target_roles=existing.target_roles,
        preferred_locations=existing.preferred_locations,
        min_stipend=existing.min_stipend,
        work_authorization=existing.work_authorization,
        resume_text=payload.resume_text[:1000]
    )
    return save_profile(updated_profile)

# 2. Agent Workflows
@app.post("/api/agent/discover")
def discover_and_rank_opportunities(profile: Optional[StudentProfile] = None):
    current_profile = profile or load_profile()
    results = []
    
    for job in SEED_INTERNSHIPS:
        eval_result = calculate_rubric_score(job, current_profile)
        results.append({
            "opportunity": job,
            "match_evaluation": eval_result
        })
        
    # Sort opportunities by match percentage descending
    results.sort(key=lambda x: x["match_evaluation"].match_percent, reverse=True)
    return {
        "student_name": current_profile.name,
        "total_opportunities": len(results),
        "rankings": results
    }

@app.post("/api/agent/evaluate-match", response_model=MatchEvaluation)
def evaluate_single_match(job_id: str = Body(..., embed=True), profile: Optional[StudentProfile] = Body(None)):
    job = next((j for j in SEED_INTERNSHIPS if j.id == job_id), None)
    if not job:
        raise HTTPException(status_code=404, detail=f"Job with ID '{job_id}' not found.")
    
    current_profile = profile or load_profile()
    return calculate_rubric_score(job, current_profile)

@app.post("/api/agent/generate-kit", response_model=ApplicationKit)
def generate_kit_for_opportunity(job_id: str = Body(..., embed=True), profile: Optional[StudentProfile] = Body(None)):
    job = next((j for j in SEED_INTERNSHIPS if j.id == job_id), None)
    if not job:
        raise HTTPException(status_code=404, detail=f"Job with ID '{job_id}' not found.")
    
    current_profile = profile or load_profile()
    eval_result = calculate_rubric_score(job, current_profile)
    return generate_application_kit(job, current_profile, eval_result, current_groq_config)

# 3. Applications & Kanban Pipeline Tracking
@app.get("/api/applications", response_model=List[ApplicationRecord])
def list_applications():
    return get_all_applications()

@app.patch("/api/applications/{app_id}", response_model=ApplicationRecord)
def update_application_status(
    app_id: str,
    status: Optional[str] = Body(None),
    notes: Optional[str] = Body(None),
    applied_date: Optional[str] = Body(None),
    reminder_date: Optional[str] = Body(None)
):
    apps = get_all_applications()
    record = next((a for a in apps if a.id == app_id), None)
    
    if not record:
        # If ID is a job_id, construct new application record
        record = ApplicationRecord(id=f"app-{app_id}", job_id=app_id, status=status or "Saved")
        
    if status is not None:
        record.status = status
    if notes is not None:
        record.notes = notes
    if applied_date is not None:
        record.applied_date = applied_date
    if reminder_date is not None:
        record.reminder_date = reminder_date
        
    return save_or_update_application(record)

# 4. Settings Configuration
@app.post("/api/settings/config")
def update_groq_config(config: GroqConfig):
    global current_groq_config
    current_groq_config = config
    return {
        "message": "Groq configuration updated successfully.",
        "config": {
            "model_name": current_groq_config.model_name,
            "use_mock": current_groq_config.use_mock,
            "api_key_set": bool(current_groq_config.api_key or os.getenv("GROQ_API_KEY"))
        }
    }
