export interface StudentProfile {
  name: string;
  university: string;
  major: string;
  graduation_year: number;
  gpa: number;
  skills: string[];
  soft_skills: string[];
  target_roles: string[];
  preferred_locations: string[];
  min_stipend: string;
  work_authorization: string;
  resume_text: string;
}

export interface InternshipOpportunity {
  id: string;
  title: string;
  company: string;
  domain: string;
  location: string;
  stipend: string;
  required_skills: string[];
  optional_skills: string[];
  min_gpa: number;
  description: string;
  deadline: string;
  apply_url: string;
}

export interface RubricBreakdown {
  core_tech_score: number;
  eligibility_score: number;
  secondary_skills_score: number;
  location_score: number;
}

export interface MatchEvaluation {
  job_id: string;
  match_percent: number;
  rubric_breakdown: RubricBreakdown;
  matched_skills: string[];
  missing_skills: string[];
  recommendation: string;
}

export interface OpportunityRanking {
  opportunity: InternshipOpportunity;
  match_evaluation: MatchEvaluation;
}

export interface InterviewQnA {
  question: string;
  answer_tip: string;
}

export interface ApplicationKit {
  job_id: string;
  job_title: string;
  company: string;
  pitch: string;
  cover_letter: string;
  resume_bullet_suggestions: string[];
  interview_prep_qna: InterviewQnA[];
  skill_gap_advice: string;
}

export interface ApplicationRecord {
  id: string;
  job_id: string;
  status: 'Saved' | 'Applied' | 'Interviewing' | 'Offered' | 'Rejected';
  notes?: string;
  applied_date?: string;
  deadline?: string;
  reminder_date?: string;
}

export interface GroqSettings {
  apiKey: string;
  modelName: string;
  useMock: boolean;
}
