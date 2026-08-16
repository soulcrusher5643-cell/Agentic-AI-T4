from pydantic import BaseModel, Field
from typing import List, Optional

class StudentProfile(BaseModel):
    name: str = "Trimil Triliver John"
    university: str = "National Institute of Technology"
    major: str = "Computer Science & Artificial Intelligence"
    graduation_year: int = 2026
    gpa: float = 8.9
    skills: List[str] = ["Python", "React", "Node.js", "TensorFlow", "PyTorch", "SQL", "REST APIs", "Git"]
    soft_skills: List[str] = ["Problem Solving", "Team Leadership", "Communication"]
    target_roles: List[str] = ["AI Engineer Intern", "Full Stack Intern", "Data Science Intern"]
    preferred_locations: List[str] = ["Remote", "Bengaluru", "Hybrid"]
    min_stipend: str = "₹25,000"
    work_authorization: str = "Authorized to work in India / Remote"
    resume_text: str = "Final year Computer Science student building autonomous agentic AI systems. Proficient in Python, React, vector search, and LLM orchestration."

class InternshipOpportunity(BaseModel):
    id: str
    title: str
    company: str
    domain: str
    location: str
    stipend: str
    required_skills: List[str]
    optional_skills: List[str]
    min_gpa: float
    description: str
    deadline: str
    apply_url: str = "https://example.com/apply"

class RubricBreakdown(BaseModel):
    core_tech_score: float = Field(..., description="Out of 40")
    eligibility_score: float = Field(..., description="Out of 30")
    secondary_skills_score: float = Field(..., description="Out of 20")
    location_score: float = Field(..., description="Out of 10")

class MatchEvaluation(BaseModel):
    job_id: str
    match_percent: int
    rubric_breakdown: RubricBreakdown
    matched_skills: List[str]
    missing_skills: List[str]
    recommendation: str

class ApplicationKit(BaseModel):
    job_id: str
    job_title: str
    company: str
    pitch: str
    cover_letter: str
    resume_bullet_suggestions: List[str]
    interview_prep_qna: List[dict]
    skill_gap_advice: str

class ApplicationRecord(BaseModel):
    id: str
    job_id: str
    status: str = "Saved"  # Saved, Applied, Interviewing, Offered, Rejected
    notes: Optional[str] = ""
    applied_date: Optional[str] = None
    deadline: Optional[str] = None
    reminder_date: Optional[str] = None

class ResumeParseRequest(BaseModel):
    resume_text: str

class GroqConfig(BaseModel):
    api_key: Optional[str] = None
    model_name: str = "llama-3.3-70b-versatile"
    use_mock: bool = False
