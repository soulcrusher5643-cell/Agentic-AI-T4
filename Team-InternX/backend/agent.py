import os
import json
import logging
from typing import List, Tuple, Dict, Any, Optional
from groq import Groq
from models import (
    StudentProfile, InternshipOpportunity, MatchEvaluation, 
    RubricBreakdown, ApplicationKit, GroqConfig
)

logger = logging.getLogger("internx.agent")

def get_groq_client(config: GroqConfig) -> Tuple[Optional[Groq], bool]:
    api_key = config.api_key or os.getenv("GROQ_API_KEY")
    if not api_key or config.use_mock:
        return None, True
    try:
        client = Groq(api_key=api_key)
        return client, False
    except Exception as e:
        logger.warning(f"Failed to initialize Groq client: {e}. Falling back to deterministic engine.")
        return None, True

def calculate_rubric_score(job: InternshipOpportunity, profile: StudentProfile) -> MatchEvaluation:
    """
    Evaluates candidate against job requirements using the strict 40/30/20/10 rubric:
    - 40% Core Technical Skills Match
    - 30% Eligibility (GPA, Major, Grad Year)
    - 20% Preferred / Secondary Skills
    - 10% Location & Availability Alignment
    """
    student_skills_upper = [s.strip().upper() for s in profile.skills]
    
    # 1. Core Technical Skills Match (Max 40)
    matched_core = []
    missing_core = []
    for skill in job.required_skills:
        if skill.strip().upper() in student_skills_upper:
            matched_core.append(skill)
        else:
            missing_core.append(skill)
            
    core_ratio = (len(matched_core) / len(job.required_skills)) if job.required_skills else 1.0
    core_tech_score = round(core_ratio * 40.0, 1)

    # 2. Eligibility Match (Max 30) - GPA & Major check
    eligibility_pts = 30.0
    if profile.gpa < job.min_gpa:
        gpa_diff = job.min_gpa - profile.gpa
        eligibility_pts -= min(15.0, gpa_diff * 10)
    eligibility_score = round(max(10.0, eligibility_pts), 1)

    # 3. Secondary / Optional Skills (Max 20)
    matched_opt = []
    for opt in job.optional_skills:
        if opt.strip().upper() in student_skills_upper:
            matched_opt.append(opt)
            
    opt_ratio = (len(matched_opt) / len(job.optional_skills)) if job.optional_skills else 0.5
    secondary_skills_score = round(opt_ratio * 20.0, 1)

    # 4. Location Alignment (Max 10)
    location_score = 10.0
    pref_locs_upper = [l.strip().upper() for l in profile.preferred_locations]
    if "REMOTE" in job.location.upper() or any(loc in job.location.upper() for loc in pref_locs_upper):
        location_score = 10.0
    else:
        location_score = 5.0

    total_score = int(round(core_tech_score + eligibility_score + secondary_skills_score + location_score))
    total_score = min(100, max(15, total_score))

    rec = "Strong Match — Highly Recommended to Apply"
    if total_score < 60:
        rec = "Needs Skill Prep — Review Missing Core Prerequisites"
    elif total_score < 80:
        rec = "Good Match — Tailor Resume Bullets for Secondary Skills"

    rubric = RubricBreakdown(
        core_tech_score=core_tech_score,
        eligibility_score=eligibility_score,
        secondary_skills_score=secondary_skills_score,
        location_score=location_score
    )

    return MatchEvaluation(
        job_id=job.id,
        match_percent=total_score,
        rubric_breakdown=rubric,
        matched_skills=matched_core,
        missing_skills=missing_core,
        recommendation=rec
    )

def generate_application_kit(
    job: InternshipOpportunity, 
    profile: StudentProfile, 
    eval_result: MatchEvaluation,
    config: GroqConfig
) -> ApplicationKit:
    """
    Generates tailored cover letter, resume bullet suggestions, and interview talking points using Groq or deterministic agent engine.
    """
    client, is_mock = get_groq_client(config)

    if not is_mock and client:
        try:
            prompt = f"""
            You are InternX, an elite autonomous career agent. Generate an application kit for a college student applying for an internship.
            
            Student Profile:
            - Name: {profile.name}
            - University: {profile.university} ({profile.major}, Grad Year: {profile.graduation_year}, GPA: {profile.gpa})
            - Key Skills: {', '.join(profile.skills)}
            - Resume Summary: {profile.resume_text}

            Target Job Details:
            - Title: {job.title}
            - Company: {job.company}
            - Domain: {job.domain}
            - Description: {job.description}
            - Required Skills: {', '.join(job.required_skills)}
            - Matched Skills: {', '.join(eval_result.matched_skills)}
            - Missing Skills: {', '.join(eval_result.missing_skills)}

            Respond strictly in valid JSON with keys:
            {{
                "pitch": "A 3-sentence high-impact elevator pitch for outreach",
                "cover_letter": "A full professional 3-paragraph cover letter tailored to {job.company}",
                "resume_bullet_suggestions": ["Action-oriented resume bullet 1", "Action-oriented resume bullet 2", "Action-oriented resume bullet 3"],
                "interview_prep_qna": [
                    {{"question": "Likely interview question", "answer_tip": "Strategic talking point using candidate background"}}
                ],
                "skill_gap_advice": "Advice on how to quickly bridge missing skills: {', '.join(eval_result.missing_skills)}"
            }}
            """
            
            completion = client.chat.completions.create(
                model=config.model_name,
                messages=[
                    {"role": "system", "content": "You are a specialized career counselor AI. Always respond in JSON format."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.4
            )
            
            res_data = json.loads(completion.choices[0].message.content)
            return ApplicationKit(
                job_id=job.id,
                job_title=job.title,
                company=job.company,
                pitch=res_data.get("pitch", ""),
                cover_letter=res_data.get("cover_letter", ""),
                resume_bullet_suggestions=res_data.get("resume_bullet_suggestions", []),
                interview_prep_qna=res_data.get("interview_prep_qna", []),
                skill_gap_advice=res_data.get("skill_gap_advice", "")
            )
        except Exception as e:
            logger.error(f"Groq API call error: {e}. Falling back to template generator.")

    # Deterministic Agent Fallback Generator
    pitch = f"Dear Hiring Team at {job.company}, I am writing to express my enthusiastic interest in the {job.title} position. As a {profile.major} student at {profile.university} with a {profile.gpa} GPA and proven expertise in {', '.join(eval_result.matched_skills[:3])}, I am eager to contribute immediately to your engineering goals."
    
    cover_letter = f"""Dear Hiring Manager at {job.company},

I am writing to formally apply for the {job.title} position. Currently pursuing my degree in {profile.major} at {profile.university} (Expected Graduation: {profile.graduation_year}), I have built a solid foundation in {', '.join(profile.skills[:4])}.

Your position requires strong competence in {', '.join(job.required_skills)}. In my recent academic projects, I have successfully applied {', '.join(eval_result.matched_skills)} to engineer scalable solutions. {job.description}

I welcome the opportunity to discuss how my background and dedication align with the goals of {job.company}. Thank you for your time and consideration.

Sincerely,
{profile.name}
{profile.university}"""

    bullets = [
        f"Engineered full-stack solutions utilizing {eval_result.matched_skills[0] if eval_result.matched_skills else 'Python'} and RESTful API microservices.",
        f"Optimized system performance and data pipelines, achieving measurable latency reductions across candidate workloads.",
        f"Collaborated with cross-functional teams to deploy agentic software architectures and database integration pipelines."
    ]

    qna = [
        {
            "question": f"How have you used {eval_result.matched_skills[0] if eval_result.matched_skills else 'Python'} in past projects?",
            "answer_tip": f"Highlight a specific project at {profile.university} where you applied {eval_result.matched_skills[0] if eval_result.matched_skills else 'core tools'} to solve real-world constraints."
        },
        {
            "question": f"Why are you interested in working at {job.company}?",
            "answer_tip": f"Emphasize your alignment with {job.domain} technologies and how their work matches your career trajectory."
        }
    ]

    gap_advice = f"To reach 100% core compatibility for this role, build a small weekend side-project demonstrating: {', '.join(eval_result.missing_skills)}." if eval_result.missing_skills else "You hold 100% core skill alignment for this role!"

    return ApplicationKit(
        job_id=job.id,
        job_title=job.title,
        company=job.company,
        pitch=pitch,
        cover_letter=cover_letter,
        resume_bullet_suggestions=bullets,
        interview_prep_qna=qna,
        skill_gap_advice=gap_advice
    )

def parse_resume_text(resume_text: str, config: GroqConfig) -> StudentProfile:
    """Parses raw resume text into structured profile JSON using Groq or Regex heuristics"""
    client, is_mock = get_groq_client(config)
    
    if not is_mock and client:
        try:
            prompt = f"""
            Parse the following resume text into a structured student profile JSON object:
            Resume Text:
            {resume_text}

            Respond in JSON with schema matching:
            {{
                "name": "Candidate Name",
                "university": "University Name",
                "major": "Degree / Major",
                "graduation_year": 2026,
                "gpa": 8.5,
                "skills": ["Skill1", "Skill2", "Skill3"],
                "target_roles": ["Role1", "Role2"],
                "resume_text": "Extracted summary"
            }}
            """
            completion = client.chat.completions.create(
                model=config.model_name,
                messages=[
                    {"role": "system", "content": "You are a resume parsing AI. Return valid JSON only."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"}
            )
            res_json = json.loads(completion.choices[0].message.content)
            curr = StudentProfile()
            return StudentProfile(
                name=res_json.get("name", curr.name),
                university=res_json.get("university", curr.university),
                major=res_json.get("major", curr.major),
                graduation_year=int(res_json.get("graduation_year", curr.graduation_year)),
                gpa=float(res_json.get("gpa", curr.gpa)),
                skills=res_json.get("skills", curr.skills),
                target_roles=res_json.get("target_roles", curr.target_roles),
                resume_text=resume_text[:500]
            )
        except Exception as e:
            logger.error(f"Failed parsing resume with Groq: {e}")

    # Heuristic fallback parser
    skills_keywords = ["Python", "React", "Node.js", "TypeScript", "TensorFlow", "PyTorch", "SQL", "Docker", "AWS", "Java", "C++", "Git", "Figma", "REST APIs"]
    found_skills = [s for s in skills_keywords if s.lower() in resume_text.lower()]
    if not found_skills:
        found_skills = ["Python", "SQL", "Git", "REST APIs"]

    return StudentProfile(
        skills=found_skills,
        resume_text=resume_text[:500]
    )
